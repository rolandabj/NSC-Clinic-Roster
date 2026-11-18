import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { CollectionSyncer } from '../../src/services/repository/collectionSyncer';
import { createLiveReconciler } from '../../src/services/repository/liveReconcile';
import { RETRY_EVERY_MS, STAMP_EVERY_MS, rosterSaveQueues } from '../../src/services/repository/rosterSaveQueues';
import { clearYearToDateCache, loadEarlierRosters } from '../../src/services/fairness/yearToDate';
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
    async get() {
      return null;
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

test('Undo after a partially committed combined save restores old values and removes only this browser\'s new records', async () => {
  const old = shift('old', '2026-10-05');
  const removed = shift('removed', '2026-10-06');
  const added = shift('added', '2026-10-07');
  const baseline = [old, removed];
  const { repo, data } = memoryRepo(baseline, true);
  const complete = repo.bulkWrite;
  let first = true;
  repo.bulkWrite = async (collection: string, changes: { upserts: Assignment[]; removeIds: string[] }) => {
    if (!first) return complete(collection, changes);
    first = false;
    changes.upserts.forEach(item => data.set(item.id, item));
    throw new Error('A later batch failed after the upserts committed');
  };
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown(baseline, inRoster);
  assert.equal(await syncer.save([{ ...old, dutyWindowId: 'L' }, added], inRoster, 'R'), false);
  assert.equal(data.get(old.id)?.dutyWindowId, 'L');
  assert.ok(data.has(added.id));
  const otherPlanner = shift('other-planner', '2026-10-08', { nurseId: 'mary' });
  data.set(otherPlanner.id, otherPlanner);
  assert.equal(await syncer.save(baseline, inRoster, 'R'), true);
  assert.deepEqual([...data.values()].sort((a, b) => a.id.localeCompare(b.id)),
    [...baseline, otherPlanner].sort((a, b) => a.id.localeCompare(b.id)));
  assert.equal(syncer.hasUnsaved('R'), false);
});

test('Retry repeats uncertain upserts even when the desired records are the same objects', async () => {
  const old = shift('old', '2026-10-05');
  const desired = [shift('new-one', '2026-10-06'), shift('new-two', '2026-10-07')];
  const { repo, data, state } = memoryRepo([old], true);
  const complete = repo.bulkWrite;
  let first = true;
  repo.bulkWrite = async (collection: string, changes: { upserts: Assignment[]; removeIds: string[] }) => {
    if (!first) return complete(collection, changes);
    first = false;
    data.set(changes.upserts[0].id, changes.upserts[0]);
    throw new Error('The first upsert committed, but the next batch failed');
  };
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown([old], inRoster);
  assert.equal(await syncer.save(desired, inRoster, 'R'), false);
  assert.equal(data.has('new-two'), false);
  assert.equal(await syncer.retry(), true);
  assert.deepEqual([...data.values()].sort((a, b) => a.id.localeCompare(b.id)), desired);
  assert.deepEqual(state.calls, ['write new-one,new-two / old']);
});

test('Undo restores a removed record after a save committed but its acknowledgement was lost', async () => {
  const baseline = [shift('old-one', '2026-10-05'), shift('old-two', '2026-10-06')];
  const replacement = shift('new', '2026-10-07');
  const { repo, data } = memoryRepo(baseline, true);
  const complete = repo.bulkWrite;
  let first = true;
  repo.bulkWrite = async (collection: string, changes: { upserts: Assignment[]; removeIds: string[] }) => {
    await complete(collection, changes);
    if (first) { first = false; throw new Error('The save committed, but its acknowledgement was lost'); }
  };
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown(baseline, inRoster);
  assert.equal(await syncer.save([replacement], inRoster, 'R'), false);
  assert.deepEqual([...data.keys()], ['new']);
  assert.equal(await syncer.save(baseline, inRoster, 'R'), true);
  assert.deepEqual([...data.values()].sort((a, b) => a.id.localeCompare(b.id)), baseline);
});

test('Undo restores the same original objects after a partial fallback removal', async () => {
  const baseline = [shift('old-one', '2026-10-05'), shift('old-two', '2026-10-06')];
  const { repo, data } = memoryRepo(baseline);
  const complete = repo.bulkRemove;
  let first = true;
  repo.bulkRemove = async (collection: string, ids: string[]) => {
    if (!first) return complete(collection, ids);
    first = false;
    data.delete(ids[0]);
    throw new Error('Only the first removal committed');
  };
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown(baseline, inRoster);
  assert.equal(await syncer.save([], inRoster, 'R'), false);
  assert.equal(data.has('old-one'), false);
  assert.equal(await syncer.save(baseline, inRoster, 'R'), true);
  assert.deepEqual([...data.values()].sort((a, b) => a.id.localeCompare(b.id)), baseline);
});

test('Retry completes a partially committed fallback upsert without deleting another planner\'s addition', async () => {
  const desired = [shift('new-one', '2026-10-05'), shift('new-two', '2026-10-06')];
  const { repo, data } = memoryRepo([]);
  const complete = repo.bulkUpsert;
  let first = true;
  repo.bulkUpsert = async (collection: string, items: Assignment[]) => {
    if (!first) return complete(collection, items);
    first = false;
    data.set(items[0].id, items[0]);
    throw new Error('Only the first upsert committed');
  };
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown([], inRoster);
  assert.equal(await syncer.save(desired, inRoster, 'R'), false);
  const otherPlanner = shift('other-planner', '2026-10-07', { nurseId: 'mary' });
  data.set(otherPlanner.id, otherPlanner);
  assert.equal(await syncer.retry(), true);
  assert.deepEqual([...data.values()].sort((a, b) => a.id.localeCompare(b.id)), [...desired, otherPlanner]);
});

test('Undo removes candidate records and restores old values after a fallback upsert reported failure', async () => {
  const old = shift('old', '2026-10-05');
  const added = shift('new', '2026-10-06');
  const { repo, data } = memoryRepo([old]);
  const complete = repo.bulkUpsert;
  let first = true;
  repo.bulkUpsert = async (collection: string, items: Assignment[]) => {
    await complete(collection, items);
    if (first) { first = false; throw new Error('The upserts committed before the connection failed'); }
  };
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown([old], inRoster);
  assert.equal(await syncer.save([{ ...old, dutyWindowId: 'L' }, added], inRoster, 'R'), false);
  assert.deepEqual([...data.keys()], ['old', 'new']);
  assert.equal(await syncer.save([old], inRoster, 'R'), true);
  assert.deepEqual([...data.values()], [old]);
});

test('a newer Undo queued during a partial save repairs the database before reporting success', async () => {
  const old = shift('old', '2026-10-05');
  const replacement = shift('new', '2026-10-06');
  const { repo, data } = memoryRepo([old], true);
  const complete = repo.bulkWrite;
  let release!: () => void;
  let first = true;
  const paused = new Promise<void>(resolve => { release = resolve; });
  repo.bulkWrite = async (collection: string, changes: { upserts: Assignment[]; removeIds: string[] }) => {
    if (!first) return complete(collection, changes);
    first = false;
    data.set(changes.upserts[0].id, changes.upserts[0]);
    await paused;
    throw new Error('A later batch failed while Undo was queued');
  };
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.replaceKnown([old], inRoster);
  const saving = syncer.save([replacement], inRoster, 'R');
  const undoing = syncer.save([old], inRoster, 'R');
  release();
  await Promise.all([saving, undoing]);
  assert.deepEqual([...data.values()], [old]);
  assert.equal(syncer.hasUnsaved('R'), false);
  assert.equal(syncer.lastError, null);
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

test('a retry that fails after reset cannot restore old pending state or uncertain records', async () => {
  const old = shift('old', '2026-10-05');
  const replacement = shift('old-account-change', '2026-10-06');
  const { repo } = memoryRepo([old], true);
  let calls = 0;
  let rejectWrite!: (error: Error) => void;
  const pending = new Promise<void>((_, reject) => { rejectWrite = reject; });
  repo.bulkWrite = async () => {
    if (++calls === 1) throw new Error('The first attempt failed');
    await pending;
  };
  const saved: string[] = [];
  const syncer = new CollectionSyncer(repo, 'assignments', undefined, scope => saved.push(scope));
  syncer.replaceKnown([old], inRoster);
  assert.equal(await syncer.save([replacement], inRoster, 'R'), false);
  const retrying = syncer.retry();
  assert.ok(retrying);
  syncer.reset();
  rejectWrite(new Error('The retry failed after the old account signed out'));
  assert.equal(await retrying, false);
  assert.equal(syncer.hasUnsaved(), false);
  assert.equal(syncer.lastError, null);
  assert.equal(syncer.differsFromKnown([], inRoster), false);
  assert.equal(syncer.retry(), null);
  assert.deepEqual(saved, []);
  assert.equal(calls, 2);
});

test('a successful in flight save after reset cannot restore old known records or report them saved', async () => {
  const old = shift('old', '2026-10-05');
  const replacement = shift('old-account-change', '2026-10-06');
  const { repo, data } = memoryRepo([old], true);
  const complete = repo.bulkWrite;
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  repo.bulkWrite = async (collection: string, changes: { upserts: Assignment[]; removeIds: string[] }) => {
    await pending;
    await complete(collection, changes);
  };
  const saved: string[] = [];
  const syncer = new CollectionSyncer(repo, 'assignments', undefined, scope => saved.push(scope));
  syncer.replaceKnown([old], inRoster);
  const saving = syncer.save([replacement], inRoster, 'R');
  syncer.reset();
  release();
  assert.equal(await saving, false);
  assert.ok(data.has(replacement.id), 'an already accepted server call cannot be unsent');
  assert.equal(syncer.differsFromKnown([], inRoster), false);
  assert.equal(syncer.hasUnsaved(), false);
  assert.deepEqual(saved, []);
});

for (const outcome of ['success', 'failure'] as const) {
  test(`a new save queued after reset succeeds when the old request reports ${outcome}`, async () => {
    const old = shift('old', '2026-10-05');
    const oldChange = shift('old-account-change', '2026-10-06');
    const newChange = shift('new-account-change', '2026-10-07');
    const { repo, data } = memoryRepo([old], true);
    const complete = repo.bulkWrite;
    let first = true;
    let release!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    repo.bulkWrite = async (collection: string, changes: { upserts: Assignment[]; removeIds: string[] }) => {
      if (!first) return complete(collection, changes);
      first = false;
      await pending;
      if (outcome === 'failure') throw new Error('The old account request failed late');
      await complete(collection, changes);
    };
    const saved: string[] = [];
    const syncer = new CollectionSyncer(repo, 'assignments', undefined, scope => saved.push(scope));
    syncer.replaceKnown([old], inRoster);
    const oldSaving = syncer.save([oldChange], inRoster, 'R');
    syncer.reset();
    const newSaving = syncer.save([newChange], inRoster, 'R');
    release();
    assert.equal(await oldSaving, false);
    assert.equal(await newSaving, true);
    assert.ok(data.has(newChange.id));
    assert.equal(syncer.differsFromKnown([newChange], inRoster), false);
    assert.equal(syncer.hasUnsaved(), false);
    assert.equal(syncer.lastError, null);
    assert.deepEqual(saved, ['R']);
  });
}

test('reset during a fallback removal prevents the old account upsert phase from starting', async () => {
  const old = shift('old', '2026-10-05');
  const replacement = shift('old-account-change', '2026-10-06');
  const { repo, data, state } = memoryRepo([old]);
  const complete = repo.bulkRemove;
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  repo.bulkRemove = async (collection: string, ids: string[]) => {
    await complete(collection, ids);
    await pending;
  };
  const saved: string[] = [];
  const syncer = new CollectionSyncer(repo, 'assignments', undefined, scope => saved.push(scope));
  syncer.replaceKnown([old], inRoster);
  const saving = syncer.save([replacement], inRoster, 'R');
  syncer.reset();
  release();
  assert.equal(await saving, false);
  assert.equal(data.has(replacement.id), false);
  assert.deepEqual(state.calls, ['remove old']);
  assert.equal(syncer.hasUnsaved(), false);
  assert.equal(syncer.differsFromKnown([], inRoster), false);
  assert.deepEqual(saved, []);
});

test("saving a published roster's shifts counts at once: this browser's copy is dropped, and the roster is stamped for other browsers at most once a minute", async () => {
  mock.timers.enable({ apis: ['setTimeout', 'Date'], now: Date.parse('2026-10-06T08:00:00Z') });
  clearYearToDateCache();
  try {
    const a1 = shift('a1', '2026-10-05');
    const { repo } = memoryRepo([a1], true);
    let status = 'PUBLISHED';
    const stamps: string[] = [];
    let rosterReads = 0;
    const list = repo.list;
    repo.list = async (c: string) => {
      if (c === 'assignments') rosterReads++;
      return c === 'versions' ? [] : list();
    };
    repo.get = async (c: string, id: string) => (c === 'schedules' ? { id, status } : null);
    repo.update = async (c: string, id: string, data: any) => {
      stamps.push(`${c}/${id} ${data.updatedAt}`);
      return { id, ...data };
    };
    const roster = { id: 'R', startDate: '2026-10-05', endDate: '2026-10-11', status: 'PUBLISHED' } as any;
    await loadEarlierRosters(repo, [roster]); // a later roster read it (cached)
    assert.equal(rosterReads, 1);

    const queues = rosterSaveQueues(repo);
    queues.assignments.replaceKnown([a1], inRoster);
    await queues.assignments.save([{ ...a1, dutyWindowId: 'L' }], inRoster, 'R');
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(stamps, ['schedules/R 2026-10-06T08:00:00.000Z'], 'stamped straight away');
    await loadEarlierRosters(repo, [roster]);
    assert.equal(rosterReads, 2, 'the cached copy was dropped, so the change counts here at once');

    // Saved again within the minute: one more stamp at the end of the minute, not one per save.
    mock.timers.tick(10000);
    await queues.assignments.save([{ ...a1, dutyWindowId: 'E' }], inRoster, 'R');
    await queues.assignments.save([{ ...a1, dutyWindowId: 'D' }], inRoster, 'R');
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(stamps.length, 1);
    mock.timers.tick(STAMP_EVERY_MS - 10000);
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(stamps.slice(1), ['schedules/R 2026-10-06T08:01:00.000Z']);

    // A draft never counts for later rosters: no stamp.
    status = 'DRAFT';
    mock.timers.tick(STAMP_EVERY_MS);
    await queues.assignments.save([{ ...a1, dutyWindowId: 'L' }], inRoster, 'R');
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(stamps.length, 2);
  } finally {
    mock.timers.reset();
    clearYearToDateCache();
  }
});
