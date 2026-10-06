import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, getDocs, collection, getDoc, deleteDoc } from 'firebase/firestore';
import { FirestoreRepository } from '../../src/services/repository/FirestoreRepository';
import { rosterSaveQueues } from '../../src/services/repository/rosterSaveQueues';
import { makeSchedule } from '../unit/fixtures';

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
  console.log('PASS: simultaneous planners, legacy bootstrap, updates, atomic imports, deletion, protected calendar restore, combined shift writes and the stamp after saving a published roster');
} finally {
  await Promise.all(apps.map(app => deleteApp(app)));
  await env.cleanup();
}
