import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreVersion } from '../../src/services/history/versionRestore';
import { BACKUPS_KEPT, saveRosterBackup } from '../../src/services/history/rosterBackup';
import { makeSchedule } from './fixtures';
import type { Assignment, ScheduleVersion } from '../../src/types';

/** A small in memory database with the calls History and backups use. */
function memoryRepo(initial: Record<string, any[]> = {}) {
  const data: Record<string, Map<string, any>> = {};
  for (const [name, items] of Object.entries(initial)) data[name] = new Map(items.map((x) => [x.id, x]));
  const col = (name: string) => (data[name] ||= new Map());
  let next = 0;
  const repo: any = {
    async list(name: string, filter?: { field: string; value: any }) {
      const all = [...col(name).values()];
      return filter ? all.filter((x) => x[filter.field] === filter.value) : all;
    },
    async get(name: string, id: string) {
      return col(name).get(id) ?? null;
    },
    async create(name: string, item: any) {
      const created = { ...item, id: item.id || `${name}-${++next}` };
      col(name).set(created.id, created);
      return created;
    },
    async update(name: string, id: string, fields: any) {
      const updated = { ...col(name).get(id), ...fields, id };
      col(name).set(id, updated);
      return updated;
    },
    async remove(name: string, id: string) {
      col(name).delete(id);
    },
    async bulkRemove(name: string, ids: string[]) {
      ids.forEach((id) => col(name).delete(id));
    },
    async bulkUpsert(name: string, items: any[]) {
      items.forEach((x) => col(name).set(x.id, x));
    },
  };
  return { repo, col };
}

const shift = (id: string, scheduleId: string, date: string, nurseId = 'amy'): Assignment =>
  ({ id, scheduleId, nurseId, date, dutyWindowId: 'D', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED' }) as Assignment;

const september = makeSchedule({ id: 'sep', name: 'September', startDate: '2026-09-19', endDate: '2026-10-18', activeVersionNumber: 2 });
const october = makeSchedule({ id: 'oct', name: 'October', startDate: '2026-10-19', endDate: '2026-11-18', activeVersionNumber: 4 });

const octoberVersion: ScheduleVersion = {
  id: 'v-oct-3',
  scheduleId: 'oct',
  number: 3,
  timestamp: '2026-10-10T08:00:00Z',
  author: 'Planner',
  note: 'Before the swap',
  snapshot: { schedule: october, assignments: [shift('old-oct', 'oct', '2026-10-20')], leaveEntries: [], locks: [], rulesSnapshot: [] },
  isPublished: false,
};

test('a version is restored into its own roster, never into the roster selected on screen', async () => {
  // History opened on September (its first version was selected), and Restore was clicked
  // on an October card: September's shifts were deleted and October's old ones written back.
  const { repo, col } = memoryRepo({
    schedules: [september, october],
    assignments: [shift('sep-1', 'sep', '2026-09-20'), shift('sep-2', 'sep', '2026-09-21'), shift('oct-now', 'oct', '2026-10-21')],
    versions: [octoberVersion],
  });
  const result = await restoreVersion(repo, octoberVersion, 'Planner');

  const shiftsOf = (id: string) => [...col('assignments').values()].filter((a) => a.scheduleId === id).map((a) => a.id).sort();
  assert.deepEqual(shiftsOf('sep'), ['sep-1', 'sep-2']);
  assert.deepEqual(shiftsOf('oct'), ['old-oct']);
  assert.equal(result.schedule.id, 'oct');
  assert.equal(result.newVersionNumber, 5);
  assert.equal(col('schedules').get('oct').activeVersionNumber, 5);
  assert.equal(col('schedules').get('sep').activeVersionNumber, 2);

  // The shifts from before the restore are kept as a backup copy of October.
  const versions = [...col('versions').values()];
  const backup = versions.find((v) => v.kind === 'BACKUP');
  assert.equal(backup?.scheduleId, 'oct');
  assert.deepEqual(backup?.snapshot.assignments.map((a: Assignment) => a.id), ['oct-now']);
  const record = versions.find((v) => v.number === 5);
  assert.equal(record?.scheduleId, 'oct');
  assert.equal(record?.isPublished, false);
});

test('a version whose roster was deleted is not restored anywhere', async () => {
  const { repo, col } = memoryRepo({ schedules: [september], assignments: [shift('sep-1', 'sep', '2026-09-20')], versions: [octoberVersion] });
  await assert.rejects(() => restoreVersion(repo, octoberVersion, 'Planner'), /no longer exists/);
  assert.deepEqual([...col('assignments').keys()], ['sep-1']);
  assert.equal(col('versions').size, 1);
});

test('only the newest backup copies are kept', async () => {
  const old = Array.from({ length: BACKUPS_KEPT }, (_, i) => ({
    ...octoberVersion,
    id: `b${i}`,
    number: 0,
    kind: 'BACKUP' as const,
    timestamp: `2026-10-0${i + 1}T08:00:00Z`,
  }));
  const { repo, col } = memoryRepo({ versions: old });
  const { removedIds } = await saveRosterBackup(repo, october, { assignments: [] }, 'Planner', 'Before filling');
  assert.deepEqual(removedIds, ['b0']);
  assert.equal([...col('versions').values()].filter((v) => v.kind === 'BACKUP').length, BACKUPS_KEPT);
});
