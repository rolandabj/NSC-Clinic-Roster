import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteEntireSchedule } from '../../src/services/schedule/scheduleDeletionService';
import { removePublicRoster } from '../../src/services/publish/publicRosterService';
import type { IRepository } from '../../src/services/repository/IRepository';

function fakeRepo(initial: Record<string, any[]> = {}) {
  const data: Record<string, Map<string, any>> = {};
  for (const [col, items] of Object.entries(initial)) data[col] = new Map(items.map((x) => [x.id, x]));
  const col = (name: string) => (data[name] ||= new Map());
  const log: { action: string; col: string; id?: string; ids?: string[] }[] = [];

  const repo: Partial<IRepository> = {
    async get(name: any, id: string) {
      return col(name).get(id) || null;
    },
    async list(name: any, filter?: { field: string; operator: any; value: any }) {
      const all = [...col(name).values()];
      return filter ? all.filter((x) => x[filter.field] === filter.value) : all;
    },
    async create(name: any, item: any) {
      col(name).set(item.id, item);
      log.push({ action: 'create', col: name, id: item.id });
      return item;
    },
    async update(name: any, id: string, patch: any) {
      const existing = col(name).get(id) || { id };
      const updated = { ...existing, ...patch };
      col(name).set(id, updated);
      log.push({ action: 'update', col: name, id });
      return updated;
    },
    async remove(name: any, id: string) {
      col(name).delete(id);
      log.push({ action: 'remove', col: name, id });
    },
    async bulkRemove(name: any, ids: string[]) {
      for (const id of ids) {
        col(name).delete(id);
      }
      log.push({ action: 'bulkRemove', col: name, ids });
    },
  };

  return { repo: repo as IRepository, data, log, col };
}

test('deleteEntireSchedule deletes all cascaded items including share links', async () => {
  const schedId = 'sched-123';
  const { repo, col } = fakeRepo({
    schedules: [{ id: schedId, name: 'November 2026' }],
    assignments: [
      { id: 'a1', scheduleId: schedId, nurseId: 'n1', date: '2026-11-01' },
      { id: 'a2', scheduleId: schedId, nurseId: 'n2', date: '2026-11-02' },
    ],
    shareLinks: [
      { id: 'sl1', scheduleId: schedId, token: 'tok1' },
      { id: 'sl2', scheduleId: schedId, token: 'tok2' },
    ],
    versions: [{ id: 'v1', scheduleId: schedId, number: 1 }],
    invitations: [{ id: 'i1', scheduleId: schedId }],
    emailLog: [{ id: 'e1', scheduleId: schedId }],
    acknowledgments: [{ id: 'ack1', scheduleId: schedId }],
    swaps: [{ id: 'sw1', scheduleId: schedId }],
    publicRosters: [
      { id: 'tok1', token: 'tok1', scheduleId: schedId, revoked: false },
      { id: 'tok2', token: 'tok2', scheduleId: schedId, revoked: true },
    ],
  });

  const result = await deleteEntireSchedule(repo, schedId, 'Admin');

  assert.equal(result.success, true);
  assert.equal(result.purgedAssignmentsCount, 2);
  assert.equal(result.purgedVersionsCount, 1);
  assert.equal(col('schedules').has(schedId), false);
  assert.equal(col('assignments').size, 0);
  assert.equal(col('shareLinks').size, 0);
  assert.equal(col('versions').size, 0);
  assert.equal(col('invitations').size, 0);
  assert.equal(col('emailLog').size, 0);
  assert.equal(col('acknowledgments').size, 0);
  assert.equal(col('swaps').size, 0);
  assert.equal(col('publicRosters').size, 0);
  assert.equal(col('audit').size, 1);
});

test('a public snapshot that cannot be removed keeps its share link and the roster, so it can be retried', async () => {
  const schedId = 'sched-err';
  const { repo, col } = fakeRepo({
    schedules: [{ id: schedId, name: 'October 2026' }],
    assignments: [{ id: 'a1', scheduleId: schedId }],
    shareLinks: [{ id: 'sl1', scheduleId: schedId, token: 'tok-err' }],
    publicRosters: [{ id: 'tok-err', token: 'tok-err' }],
  });

  // Make remove for publicRosters fail (simulating permission error or missing document)
  const origRemove = repo.remove.bind(repo);
  repo.remove = async (name: any, id: string) => {
    if (name === 'publicRosters') {
      throw new Error('Missing or insufficient permissions.');
    }
    return origRemove(name, id);
  };

  await assert.rejects(deleteEntireSchedule(repo, schedId, 'Admin'), /share links/);
  assert.equal(col('schedules').has(schedId), true, 'the roster is kept');
  assert.equal(col('shareLinks').has('sl1'), true, 'the link to the live snapshot is kept');
  assert.equal(col('assignments').size, 0);
});
