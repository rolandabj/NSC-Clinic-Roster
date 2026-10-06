import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { CollectionSyncer } from '../../src/services/repository/collectionSyncer';
import { createLiveReconciler } from '../../src/services/repository/liveReconcile';
import { RETRY_EVERY_MS, rosterSaveQueues } from '../../src/services/repository/rosterSaveQueues';
import { rebaseEdit } from '../../src/services/schedule/rebaseEdit';
import type { Assignment } from '../../src/types';

const shift = (id: string, date: string, extra: Partial<Assignment> = {}): Assignment =>
  ({ id, scheduleId: 'R', nurseId: 'amy', date, dutyWindowId: 'D', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED', ...extra }) as Assignment;
const inRoster = (a: Assignment) => a.scheduleId === 'R';

/** An in memory database whose writes can be made to fail. */
function memoryRepo(items: Assignment[], withBulkWrite = false) {
  const data = new Map(items.map((x) => [x.id, x]));
  const state = { fail: false, calls: [] as string[] };
  const check = () => {
    if (state.fail) throw new Error('quota used up');
  };
  const repo: any = {
    async list() {
      return [...data.values()];
    },
    async bulkRemove(_c: string, ids: string[]) {
      check();
      state.calls.push(`remove ${ids.join(',')}`);
      ids.forEach((id) => data.delete(id));
    },
    async bulkUpsert(_c: string, list: Assignment[]) {
      check();
      state.calls.push(`upsert ${list.map((x) => x.id).join(',')}`);
      list.forEach((x) => data.set(x.id, x));
    },
  };
  if (withBulkWrite) {
    repo.bulkWrite = async (_c: string, changes: { upserts: Assignment[]; removeIds: string[] }) => {
      check();
      state.calls.push(`write ${changes.upserts.map((x) => x.id).join(',')} / ${changes.removeIds.join(',')}`);
      changes.upserts.forEach((x) => data.set(x.id, x));
      changes.removeIds.forEach((id) => data.delete(id));
    };
  }
  return { repo, data, state };
}

test('a reload after a failed save shows the unsaved change, and the retry never deletes what someone else added', async () => {
  const a1 = shift('a1', '2026-10-05');
  const a2 = shift('a2', '2026-10-06');
  const { repo, data, state } = memoryRepo([a1, a2]);
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown([a1, a2], inRoster);

  state.fail = true;
  const edited = [{ ...a1, dutyWindowId: 'L', source: 'MANUAL' as const }, a2, shift('a3', '2026-10-07', { source: 'MANUAL' })];
  assert.equal(await syncer.save(edited, inRoster, 'R'), false);

  // Meanwhile another planner adds a shift, and this screen loads the roster again.
  data.set('b1', shift('b1', '2026-10-08', { nurseId: 'mary' }));
  const shown = syncer.adoptLoaded([...data.values()], 'R', inRoster);
  assert.deepEqual(shown, edited, 'the screen keeps showing the change that is not saved');

  state.fail = false;
  assert.equal(await syncer.retry(), true);
  const saved = [...data.values()].map((x) => `${x.id}:${x.dutyWindowId}`).sort();
  // Before the fix the reload made b1 "known", so the retry deleted it, and the
  // screen showed a1:D while the database held a1:L.
  assert.deepEqual(saved, ['a1:L', 'a2:D', 'a3:D', 'b1:D']);
});

test('a reload with nothing unsaved shows the database copy', async () => {
  const a1 = shift('a1', '2026-10-05');
  const { repo } = memoryRepo([a1]);
  const syncer = new CollectionSyncer(repo, 'assignments');
  const fresh = [a1, shift('b1', '2026-10-08')];
  assert.deepEqual(syncer.adoptLoaded(fresh, 'R', inRoster), fresh);
  assert.equal(syncer.differsFromKnown(fresh, inRoster), false);
});

test('dropping an unsaved change on reload means it is never written later', async () => {
  const a1 = shift('a1', '2026-10-05');
  const { repo, data, state } = memoryRepo([a1]);
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown([a1], inRoster);
  state.fail = true;
  await syncer.save([], inRoster, 'R');
  syncer.discard('R');
  state.fail = false;
  assert.equal(syncer.retry(), null);
  assert.equal(syncer.hasUnsaved('R'), false);
  assert.ok(data.has('a1'));
});

test('new records are written before old ones are removed, in one write when the repository can', async () => {
  const old = shift('old', '2026-10-05');
  const { repo, data, state } = memoryRepo([old], true);
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown([old], inRoster);
  assert.equal(await syncer.save([shift('new', '2026-10-05')], inRoster, 'R'), true);
  assert.deepEqual(state.calls, ['write new / old']);
  assert.deepEqual([...data.keys()], ['new']);

  // A failed combined write is retried with the same plan.
  state.fail = true;
  state.calls = [];
  assert.equal(await syncer.save([shift('newer', '2026-10-05')], inRoster, 'R'), false);
  state.fail = false;
  assert.equal(await syncer.retry(), true);
  assert.deepEqual(state.calls, ['write newer / new']);
});

test('live updates: someone else\'s change is shown once nothing here is unsaved, and held back while a save failed', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const a1 = shift('a1', '2026-10-05');
    const { repo, state } = memoryRepo([a1]);
    const syncer = new CollectionSyncer(repo, 'assignments');
    syncer.replaceKnown([a1], inRoster);
    const applied: Assignment[][] = [];
    let conflicts = 0;
    const live = createLiveReconciler<Assignment>({
      syncer,
      scope: 'R',
      inScope: inRoster,
      isBusy: () => false,
      onApply: (list) => applied.push(list),
      onConflict: () => conflicts++,
    });

    // The same copy this browser saved: nothing to show.
    live.push([a1]);
    assert.equal(applied.length, 0);

    // Their change while nothing is unsaved here: shown at once.
    const theirs = [a1, shift('b1', '2026-10-06', { nurseId: 'mary' })];
    live.push(theirs);
    assert.deepEqual(applied, [theirs]);

    // A save here fails: their next change is held back and the screen is told.
    state.fail = true;
    await syncer.save([], inRoster, 'R');
    live.push([a1, shift('b2', '2026-10-07', { nurseId: 'mary' })]);
    assert.equal(applied.length, 1);
    assert.equal(conflicts, 1);

    // Once the save goes through, the next copy is compared again.
    state.fail = false;
    await syncer.retry();
    live.push([shift('b3', '2026-10-09', { nurseId: 'mary' })]);
    assert.equal(applied.length, 2);
    live.stop();
  } finally {
    mock.timers.reset();
  }
});

test('live updates wait while the screen is busy, then apply', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const syncer = new CollectionSyncer(memoryRepo([]).repo, 'assignments');
    let busy = true;
    const applied: Assignment[][] = [];
    const live = createLiveReconciler<Assignment>({ syncer, scope: 'R', inScope: inRoster, isBusy: () => busy, onApply: (l) => applied.push(l) });
    live.push([shift('b1', '2026-10-06')]);
    assert.equal(applied.length, 0);
    busy = false;
    mock.timers.tick(1000);
    assert.equal(applied.length, 1);
    live.stop();
  } finally {
    mock.timers.reset();
  }
});

test('the save queues outlive the roster screen and retry a failed save while it is closed', async () => {
  mock.timers.enable({ apis: ['setInterval'] });
  try {
    const a1 = shift('a1', '2026-10-05');
    const { repo, data, state } = memoryRepo([a1]);
    const queues = rosterSaveQueues(repo);
    assert.equal(rosterSaveQueues(repo), queues, 'the same queues when the screen opens again');
    queues.assignments.replaceKnown([a1], inRoster);

    // The screen is open: it retries itself, so the background does not.
    const stopListening = queues.listen(() => {});
    state.fail = true;
    await queues.assignments.save([{ ...a1, dutyWindowId: 'L' }], inRoster, 'R');
    state.fail = false;
    mock.timers.tick(RETRY_EVERY_MS);
    await queues.assignments.idle();
    assert.equal(data.get('a1')?.dutyWindowId, 'D');

    // The planner opens another screen: the change is still saved.
    stopListening();
    mock.timers.tick(RETRY_EVERY_MS);
    await queues.assignments.idle();
    assert.equal(data.get('a1')?.dutyWindowId, 'L');
    assert.equal(queues.hasUnsaved(), false);
  } finally {
    mock.timers.reset();
  }
});

test("a dialog's change made on an older copy keeps the change someone else made meanwhile", () => {
  const a1 = shift('a1', '2026-10-05');
  const a2 = shift('a2', '2026-10-06');
  const base = [a1, a2];
  // The fairness dialog moves a2 to Mary (a new record) while waiting for its confirmation...
  const edited = [a1, { ...a2, id: 'moved', nurseId: 'mary' }];
  // ...and meanwhile another planner added b1 and changed a1.
  const latest = [{ ...a1, dutyWindowId: 'L' }, a2, shift('b1', '2026-10-08', { nurseId: 'nina' })];
  const result = rebaseEdit(base, edited, latest).map((x) => `${x.id}:${x.nurseId}:${x.dutyWindowId}`).sort();
  assert.deepEqual(result, ['a1:amy:L', 'b1:nina:D', 'moved:mary:D']);
  // Nothing arrived meanwhile: the dialog's list is used as it is.
  assert.equal(rebaseEdit(base, edited, base), edited);
});

test('signing out drops unsaved changes so the next account never saves them', async () => {
  const a1 = shift('a1', '2026-10-05');
  const { repo, state } = memoryRepo([a1]);
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown([a1], inRoster);
  state.fail = true;
  await syncer.save([], inRoster, 'R');
  syncer.reset();
  assert.equal(syncer.hasUnsaved(), false);
  assert.equal(syncer.retry(), null);
});
