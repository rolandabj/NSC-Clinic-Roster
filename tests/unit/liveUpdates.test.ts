import { test } from 'node:test';
import assert from 'node:assert/strict';
import { othersOnRoster } from '../../src/services/presence/presenceRules';
import { CollectionSyncer } from '../../src/services/repository/collectionSyncer';

const now = Date.parse('2026-10-02T10:00:00Z');
const rec = (id: string, scheduleId: string | null, secondsAgo: number) => ({
  id,
  name: id,
  email: `${id}@x.com`,
  scheduleId,
  at: new Date(now - secondsAgo * 1000).toISOString(),
});

test('only other people with this roster open recently count as also here', () => {
  const list = [rec('me', 's1', 5), rec('ana', 's1', 20), rec('bo', 's2', 5), rec('cy', 's1', 200)];
  assert.deepEqual(othersOnRoster(list, 'me', 's1', now).map((p) => p.id), ['ana']);
  assert.deepEqual(othersOnRoster(list, 'me', null, now), []);
});

test("a fresh copy that matches what this browser saved is not someone else's change", () => {
  const syncer = new CollectionSyncer({} as any, 'assignments');
  const a = { id: 'a1', scheduleId: 's1', nurseId: 'n', date: '2026-10-05', dutyWindowId: 'd', kind: 'CLINICAL_ROLE', locked: false, source: 'MANUAL' } as any;
  syncer.remember([a]);
  const inScope = (x: any) => x.scheduleId === 's1';
  assert.equal(syncer.differsFromKnown([{ ...a }], inScope), false);
  assert.equal(syncer.differsFromKnown([{ ...a, dutyWindowId: 'l' }], inScope), true);
  assert.equal(syncer.differsFromKnown([], inScope), true);
  assert.equal(syncer.differsFromKnown([a, { ...a, id: 'a2' }], inScope), true);
});
