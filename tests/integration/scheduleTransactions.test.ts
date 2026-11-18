import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, getDocs, collection, getDoc, deleteDoc, disableNetwork, enableNetwork } from 'firebase/firestore';
import { FirestoreRepository } from '../../src/services/repository/FirestoreRepository';
import { rosterSaveQueues } from '../../src/services/repository/rosterSaveQueues';
import { assertGenerationInputsCurrent, loadGenerationInputs } from '../../src/services/schedule/generationSaveGuard';
import { runSchedulingWorker } from '../../src/services/engine/schedulingWorkerRunner';
import { schedulingClockMs } from '../../src/services/engine/workerProtocol';
import { saveRosterBackup } from '../../src/services/history/rosterBackup';
import type { Assignment, DoctorSession } from '../../src/types';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from '../unit/fixtures';

// Install the existing emulator test dependencies in tests/firestore-rules first.
const requireRules = createRequire(new URL('../firestore-rules/package.json', import.meta.url));
const { initializeTestEnvironment } = requireRules('@firebase/rules-unit-testing');
const projectId = 'demo-roster';
const env = await initializeTestEnvironment({ projectId, firestore: {
  rules: readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8'), host: '127.0.0.1', port: 8080,
} });
const apps: ReturnType<typeof initializeApp>[] = [];
function planner(name: string) {
  const app = initializeApp({ projectId, apiKey: 'demo-key' }, name);
  apps.push(app);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, '127.0.0.1', 8080, { mockUserToken: { sub: name, email: 'rolandabj@gmail.com', email_verified: true } });
  // Use the actual repository methods without starting the browser auth/cache listeners.
  const repo = Object.create(FirestoreRepository.prototype) as FirestoreRepository;
  (repo as any).db = db;
  return { repo, db };
}
try {
  await env.clearFirestore();
  const a = planner('planner-a'), b = planner('planner-b');
  const legacy = makeSchedule({ id: 'legacy', startDate: '2026-10-01', endDate: '2026-10-18' });
  await setDoc(doc(a.db, 'schedules', legacy.id), legacy);
  const dates = { startDate: '2026-10-19', endDate: '2026-11-18' };
  const results = await Promise.allSettled([
    a.repo.create('schedules', makeSchedule({ id: 'a', ...dates })),
    b.repo.create('schedules', makeSchedule({ id: 'b', ...dates })),
  ]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(results.filter(r => r.status === 'rejected').length, 1);
  assert.match((results.find(r => r.status === 'rejected') as PromiseRejectedResult).reason.message, /overlap/);
  assert.equal((await getDocs(collection(a.db, 'schedules'))).size, 2);
  const winner = (results.find(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>).value;
  await assert.rejects(a.repo.create('schedules', makeSchedule({ id: 'legacy-overlap', startDate: '2026-10-05', endDate: '2026-10-10' })), /overlap/);
  await a.repo.update('schedules', winner.id, { status: 'PUBLISHED' });
  await assert.rejects(a.repo.update('schedules', winner.id, { startDate: '2026-10-18' }), /overlap/);
  await assert.rejects(a.repo.bulkUpsert('schedules', [
    makeSchedule({ id: 'import-a', startDate: '2026-11-19', endDate: '2026-12-18' }),
    makeSchedule({ id: 'import-b', startDate: '2026-12-01', endDate: '2026-12-20' }),
  ]), /overlap/);
  assert.equal((await getDoc(doc(a.db, 'schedules', 'import-a'))).exists(), false);
  await a.repo.remove('schedules', winner.id);
  await b.repo.create('schedules', makeSchedule({ id: 'replacement', ...dates }));
  await a.repo.bulkUpsert('systemMetadata', [{ id: 'scheduleCalendar', ranges: {} } as any]);
  await assert.rejects(b.repo.create('schedules', makeSchedule({ id: 'still-overlap', ...dates })), /overlap/);
  // A roster deleted outside the app (old tab, console) no longer holds its dates.
  await b.repo.create('schedules', makeSchedule({ id: 'stale', startDate: '2027-01-01', endDate: '2027-01-31' }));
  await deleteDoc(doc(b.db, 'schedules', 'stale'));
  await a.repo.create('schedules', makeSchedule({ id: 'after-stale', startDate: '2027-01-10', endDate: '2027-01-20' }));
  // An archived roster does not hold its dates either.
  await a.repo.create('schedules', makeSchedule({ id: 'archived', startDate: '2027-03-01', endDate: '2027-03-31', status: 'ARCHIVED' }));
  await a.repo.create('schedules', makeSchedule({ id: 'over-archived', startDate: '2027-03-05', endDate: '2027-03-25' }));
  // A backup restore keeps old overlaps as they were in the backup.
  await a.repo.bulkUpsert('schedules', [
    makeSchedule({ id: 'backup-a', startDate: '2027-05-01', endDate: '2027-05-31' }),
    makeSchedule({ id: 'backup-b', startDate: '2027-05-20', endDate: '2027-06-10' }),
  ], { restore: true });
  // Outside a restore, those dates are still refused.
  await assert.rejects(a.repo.create('schedules', makeSchedule({ id: 'new-may', startDate: '2027-05-05', endDate: '2027-05-06' })), /overlap/);
  // A roster save writes new shifts and removals together; a big one takes more than one batch.
  const shiftOf = (id: string) => ({ id, scheduleId: 'replacement', nurseId: 'n1', date: '2026-10-20', dutyWindowId: 'D',
    kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED' } as any);
  const many = Array.from({ length: 500 }, (_, i) => shiftOf(`old-${i}`));
  await a.repo.bulkWrite!('assignments', { upserts: many, removeIds: [], replace: true });
  await a.repo.bulkWrite!('assignments', { upserts: [shiftOf('new-1')], removeIds: many.map((x) => x.id), replace: true });
  assert.deepEqual((await getDocs(collection(a.db, 'assignments'))).docs.map((d) => d.id), ['new-1']);
  // Final generation reads bypass both the app cache and an offline SDK fallback.
  const staleShift = { ...shiftOf('new-1'), dutyWindowId: 'stale' };
  (a.repo as any).cache = { list: async () => [staleShift], getDoc: () => ({ item: staleShift }) };
  await setDoc(doc(b.db, 'assignments', 'new-1'), { ...shiftOf('new-1'), dutyWindowId: 'server' });
  assert.equal((await a.repo.get('assignments', 'new-1'))?.dutyWindowId, 'stale');
  assert.equal((await a.repo.list('assignments'))[0].dutyWindowId, 'stale');
  assert.equal((await a.repo.getFresh('assignments', 'new-1'))?.dutyWindowId, 'server');
  const freshList = await a.repo.listFresh('assignments', { field: 'scheduleId', operator: '==', value: 'replacement' });
  assert.deepEqual(freshList.map(item => [item.id, item.dutyWindowId]), [['new-1', 'server']]);
  assert.equal(await a.repo.getFresh('assignments', 'missing'), null);
  assert.deepEqual(await a.repo.listFresh('assignments', { field: 'scheduleId', operator: '==', value: 'missing' }), []);
  await disableNetwork(a.db);
  try {
    await assert.rejects(a.repo.getFresh('assignments', 'new-1'), /offline|unavailable|network/i);
    await assert.rejects(a.repo.listFresh('assignments'), /offline|unavailable|network/i);
  } finally {
    await enableNetwork(a.db);
  }
  // Saving a published roster's shifts stamps the roster, so other browsers count the change at once.
  (a.repo as any).cache = { getDoc: () => undefined };
  const before = '2026-01-01T00:00:00.000Z';
  await a.repo.update('schedules', 'replacement', { status: 'PUBLISHED', updatedAt: before });
  const inReplacement = (x: any) => x.scheduleId === 'replacement';
  const queues = rosterSaveQueues(a.repo);
  queues.assignments.replaceKnown([shiftOf('new-1')], inReplacement);
  assert.equal(await queues.assignments.save([{ ...shiftOf('new-1'), dutyWindowId: 'L' }], inReplacement, 'replacement'), true);
  const stampOf = async () => (await getDoc(doc(a.db, 'schedules', 'replacement'))).data()!.updatedAt;
  for (let i = 0; i < 50 && (await stampOf()) === before; i++) await new Promise((resolve) => setTimeout(resolve, 100));
  assert.notEqual(await stampOf(), before);
  assert.equal((await getDoc(doc(a.db, 'schedules', 'replacement'))).data()!.status, 'PUBLISHED');
  console.log('PASS: simultaneous planners, legacy bootstrap, updates, atomic imports, deletion, protected calendar restore, combined shift writes, authoritative server reads and the stamp after saving a published roster');

  // A clean clinic exercises the actual worker, server reads, backup and save queue together.
  await env.clearFirestore();
  const timed = planner('timed-planner');
  (timed.repo as any).cache = { list: async () => null, getDoc: () => undefined };
  const date = '2027-07-01';
  const roster = makeSchedule({ id: 'timed-roster', startDate: date, endDate: date, hoursTargetFullTime: 8 });
  const nurse = makeNurse('timed-nurse', { doctorEligibility: { doctorIds: ['alpha', 'beta'], specialtyIds: [],
    reviewedBy: 'test-lead', reviewedAt: '2027-07-01T04:00:00Z' } });
  const clinics: DoctorSession[] = ['alpha', 'beta'].map((doctorId, i) => ({ id: `clinic-${doctorId}`, doctorId, date,
    startTime: i ? '13:00' : '09:00', endTime: i ? '17:00' : '13:00', specialtyId: '', source: 'MANUAL', cancelled: false }));
  await timed.repo.create('schedules', roster);
  await timed.repo.bulkUpsert('nurses', [nurse]);
  await timed.repo.bulkUpsert('seniorityLevels', [SENIOR]);
  await timed.repo.bulkUpsert('dutyWindows', [DAY_DUTY]);
  await timed.repo.bulkUpsert('doctors', ['alpha', 'beta'].map(id => ({ id, fullName: `Dr ${id}`, active: true,
    lowAcuity: false, specialtyIds: [], weeklyPattern: [] })));
  await timed.repo.bulkUpsert('doctorSessions', clinics);
  await timed.repo.bulkUpsert('rules', hoursOnlyRules());
  await timed.repo.create('clinics', { id: 'test-clinic', name: 'Test Clinic', timezone: 'Asia/Dubai',
    openTime: '09:00', closeTime: '17:00', weekendDays: [0, 6], updatedAt: '2027-07-01T04:00:00Z' });
  const original: Assignment = { id: 'original-float', scheduleId: roster.id, nurseId: nurse.id, date,
    dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'GENERATED',
    locked: false, note: 'The exact roster before filling' };
  await timed.repo.bulkUpsert('assignments', [original], { replace: true });
  const baseline = await loadGenerationInputs(timed.repo, roster.id);
  const result = await runSchedulingWorker({ type: 'start', jobId: 'emulator-verification',
    input: { ...baseline, mode: 'GENERATE_ALL' }, startedAtMs: schedulingClockMs(), budgetMs: 20000 });
  assert.equal(result.validation.errorCount, 0);
  assert.equal(result.assignments.length, 1);
  assert.deepEqual(result.assignments[0].doctorCoverage, [
    { doctorId: 'alpha', startTime: '09:00', endTime: '13:00' },
    { doctorId: 'beta', startTime: '13:00', endTime: '17:00' },
  ]);
  await assertGenerationInputsCurrent(timed.repo, baseline);
  const backup = await saveRosterBackup(timed.repo, roster, baseline, 'test-planner', 'Before verification fill');
  const inTimed = (item: Assignment) => item.scheduleId === roster.id;
  const timedQueues = rosterSaveQueues(timed.repo);
  timedQueues.assignments.replaceKnown(baseline.assignments, inTimed);
  assert.equal(await timedQueues.assignments.save(result.assignments, inTimed, roster.id), true);
  assert.deepEqual(await timed.repo.listFresh('assignments'), JSON.parse(JSON.stringify(result.assignments)));
  assert.deepEqual((await timed.repo.getFresh('versions', backup.created.id))!.snapshot.assignments, [original]);
  assert.equal(await timedQueues.assignments.save(baseline.assignments, inTimed, roster.id), true);
  assert.deepEqual(await timed.repo.listFresh('assignments'), [original]);

  const expected = await loadGenerationInputs(timed.repo, roster.id);
  const versionsBeforeGuard = await timed.repo.listFresh('versions');
  await timed.repo.update('doctorSessions', clinics[0].id, { endTime: '12:00' });
  await assert.rejects(() => assertGenerationInputsCurrent(timed.repo, expected), /changed/);
  assert.deepEqual(await timed.repo.listFresh('assignments'), [original]);
  assert.deepEqual(await timed.repo.listFresh('versions'), versionsBeforeGuard);

  // Simulate a connection failure after the first real Firestore batch committed.
  // Undo must remove every attempted candidate id while preserving another planner's record.
  const bulkWrite = timed.repo.bulkWrite.bind(timed.repo);
  let interrupt = true;
  timed.repo.bulkWrite = async (collection, changes) => {
    if (!interrupt || collection !== 'assignments') return bulkWrite(collection, changes);
    interrupt = false;
    await bulkWrite(collection, { ...changes, upserts: changes.upserts.slice(0, 450), removeIds: [] });
    throw new Error('Connection lost after the first batch committed');
  };
  const attempted = Array.from({ length: 500 }, (_, i) => ({ ...original, id: `attempt-${i}` }));
  assert.equal(await timedQueues.assignments.save(attempted, inTimed, roster.id), false);
  assert.equal((await timed.repo.listFresh('assignments')).length, 451);
  const theirs = { ...original, id: 'another-planner', nurseId: 'another-nurse' };
  await timed.repo.bulkUpsert('assignments', [theirs]);
  assert.equal(await timedQueues.assignments.save(baseline.assignments, inTimed, roster.id), true);
  assert.deepEqual((await timed.repo.listFresh('assignments')).map(item => item.id).sort(), ['another-planner', original.id]);
  assert.equal(timedQueues.hasUnsaved(), false);
  console.log('PASS: worker timed cover, exact server reload, backup, Undo, stale input refusal and recovery after a partial Firestore commit');
} finally {
  await Promise.all(apps.map(app => deleteApp(app)));
  await env.cleanup();
}
