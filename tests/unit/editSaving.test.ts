import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CollectionSyncer, planSync, fingerprint } from '../../src/services/repository/collectionSyncer';
import { changedLists, sameItems } from '../../src/services/schedule/changedLists';
import type { Assignment, LeaveEntry, LockEntry } from '../../src/types';

// An edit saves only what it changed (UI overhaul Phase 3, slice 4): lists an edit left as they
// were are not saved again, and a save does not read again records that are the very objects
// it saved last time. On a full size roster (1,860 cells) one click used to fingerprint every
// shift, pinned day and leave record.

const shift = (id: string, date: string, extra: Partial<Assignment> = {}): Assignment =>
  ({ id, scheduleId: 'R', nurseId: 'amy', date, dutyWindowId: 'D', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED', ...extra }) as Assignment;

/** A shift that counts how often its fields are read. */
function countedShift(id: string) {
  const reads = { count: 0 };
  const base = shift(id, '2026-10-05');
  const item = {} as Assignment;
  for (const [key, value] of Object.entries(base)) {
    Object.defineProperty(item, key, {
      enumerable: true,
      get() {
        reads.count++;
        return value;
      },
    });
  }
  return { item, reads };
}

test('a record that is the same object as the one saved is not read again', () => {
  const { item, reads } = countedShift('a1');
  const known = new Map([[item.id, { item, print: fingerprint(item) }]]);
  reads.count = 0;
  const plan = planSync(known, [item], () => true);
  assert.deepEqual(plan, { removeIds: [], upserts: [] });
  assert.ok(reads.count <= 2, `only its id is read (once to list the ids, once to look it up), not ${reads.count} fields`);
});

test('a copy with the same content is still compared, and a changed copy is saved', () => {
  const saved = shift('a1', '2026-10-05');
  const known = new Map([[saved.id, { item: saved, print: fingerprint(saved) }]]);
  assert.deepEqual(planSync(known, [{ ...saved }], () => true).upserts, []);
  const changed = { ...saved, dutyWindowId: 'L' };
  assert.deepEqual(planSync(known, [changed], () => true).upserts, [changed]);
});

test('saving again with the same objects writes only the new record', async () => {
  const calls: string[] = [];
  const repo: any = {
    async bulkWrite(_c: string, changes: { upserts: Assignment[]; removeIds: string[] }) {
      calls.push(`write ${changes.upserts.map((x) => x.id).join(',')} / ${changes.removeIds.join(',')}`);
    },
  };
  const syncer = new CollectionSyncer(repo, 'assignments');
  const a = shift('a', '2026-10-05');
  const b = shift('b', '2026-10-06');
  syncer.replaceKnown([a, b]);
  assert.equal(await syncer.save([a, b], () => true, 'R'), true);
  const c = shift('c', '2026-10-07');
  assert.equal(await syncer.save([a, b, c], () => true, 'R'), true);
  assert.deepEqual(calls, ['write c / ']);
});

test('lists hold the same items when every item is the same object, in the same order', () => {
  const a = shift('a', '2026-10-05');
  const b = shift('b', '2026-10-06');
  assert.equal(sameItems([a, b], [a, b]), true);
  assert.equal(sameItems([a, b], [...[a, b]]), true, 'a new list with the same items');
  assert.equal(sameItems([a, b], [a]), false);
  assert.equal(sameItems([a, b], [a, { ...b }]), false, 'a copy is not the same item');
  assert.equal(sameItems([a, b], [b, a]), false);
});

test('an edit keeps only the lists it changed', () => {
  const a = shift('a', '2026-10-05');
  const lock = { id: 'lock-amy', nurseId: 'amy', date: '2026-10-06', mode: 'OFF' } as LockEntry;
  const leave = { id: 'lv', nurseId: 'amy', startDate: '2026-10-07', endDate: '2026-10-07' } as LeaveEntry;
  const now = { assignments: [a], locks: [lock], leaveEntries: [leave] };

  // A cell edit sends all three lists; only the shifts changed (the others are new lists of the same items).
  const b = shift('b', '2026-10-06');
  assert.deepEqual(changedLists({ assignments: [a, b], locks: now.locks.filter(() => true), leaveEntries: [...now.leaveEntries] }, now), {
    assignments: [a, b],
  });
  // Clearing a pinned day changes the pinned days only.
  assert.deepEqual(changedLists({ assignments: [a], locks: [], leaveEntries: [leave] }, now), { locks: [] });
  // A list not sent stays as it is.
  assert.deepEqual(changedLists({ leaveEntries: [] }, now), { leaveEntries: [] });
  assert.deepEqual(changedLists({ assignments: [a] }, now), {});
});
