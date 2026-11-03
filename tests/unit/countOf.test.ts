import test from 'node:test';
import assert from 'node:assert/strict';
import { countOf } from '../../src/services/repository/paging';
import { getDatabaseStatistics } from '../../src/services/seed/seedRunner';

// Settings, Data and backup (Phase 8, slice 1f): the record counts are counted by Firestore, not
// read in full; a repository that cannot count is read in full instead.

test('a repository that counts is asked to count, and the list is not read', async () => {
  const asked: string[] = [];
  const repo = { list: async () => assert.fail('the whole list should not be read'), count: async (c: string) => (asked.push(c), 7) } as any;
  assert.equal(await countOf(repo, 'audit'), 7);
  assert.deepEqual(asked, ['audit']);
});

test('a repository that cannot count is read in full', async () => {
  const repo = { list: async () => [{ id: 'a' }, { id: 'b' }] } as any;
  assert.equal(await countOf(repo, 'nurses'), 2);
});

test('the database statistics count every collection without reading it', async () => {
  const repo = { list: async () => assert.fail('no collection should be read in full'), count: async (c: string) => (c === 'nurses' ? 12 : 1) } as any;
  const stats = await getDatabaseStatistics(repo);
  assert.equal(stats.nursesCount, 12);
  assert.equal(stats.auditCount, 1);
});
