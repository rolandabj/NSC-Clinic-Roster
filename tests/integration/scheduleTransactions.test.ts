import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, getDocs, collection, getDoc } from 'firebase/firestore';
import { FirestoreRepository } from '../../src/services/repository/FirestoreRepository';
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
  console.log('PASS: simultaneous planners, legacy bootstrap, updates, atomic imports, deletion and protected calendar restore');
} finally {
  await Promise.all(apps.map(app => deleteApp(app)));
  await env.cleanup();
}
