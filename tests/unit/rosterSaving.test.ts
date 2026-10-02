import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CollectionSyncer } from '../../src/services/repository/collectionSyncer';
import { chooseScheduleToOpen } from '../../src/services/schedule/openSchedule';
import { populateRecurringDoctorSessionsForSchedule } from '../../src/services/schedule/doctorScheduleService';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Doctor, DoctorSession, Schedule } from '../../src/types';

/** A small in memory database that counts writes. */
function fakeRepo(initial: Record<string, any[]> = {}) {
  const data: Record<string, Map<string, any>> = {};
  for (const [col, items] of Object.entries(initial)) data[col] = new Map(items.map((x) => [x.id, x]));
  const col = (name: string) => (data[name] ||= new Map());
  const stats = { removed: [] as string[], written: [] as string[], failNext: false };
  const repo: any = {
    async list(name: string, filter?: { field: string; value: any }) {
      const all = [...col(name).values()];
      return filter ? all.filter((x) => x[filter.field] === filter.value) : all;
    },
    async bulkRemove(name: string, ids: string[]) {
      if (stats.failNext) {
        stats.failNext = false;
        throw new Error('offline');
      }
      for (const id of ids) {
        col(name).delete(id);
        stats.removed.push(id);
      }
    },
    async bulkUpsert(name: string, items: any[]) {
      if (stats.failNext) {
        stats.failNext = false;
        throw new Error('offline');
      }
      for (const x of items) {
        col(name).set(x.id, x);
        stats.written.push(x.id);
      }
    },
  };
  return { repo, data, stats, col };
}

const leave = (id: string, extra: object = {}) => makeLeave({ id, ...extra });

test('saving my edit never deletes leave someone else added after I loaded the page', async () => {
  const { repo, col, stats } = fakeRepo({ leaveEntries: [leave('mine')] });
  const syncer = new CollectionSyncer(repo, 'leaveEntries');
  syncer.remember([leave('mine')]);
  // A nurse files a request after the page was opened.
  col('leaveEntries').set('nurse-request', leave('nurse-request', { approved: false, status: 'PENDING' }));

  // I change my own leave; my copy doesn't have the nurse's request.
  assert.equal(await syncer.save([leave('mine', { note: 'changed' })]), true);
  assert.ok(col('leaveEntries').has('nurse-request'));
  assert.deepEqual(stats.removed, []);
  assert.deepEqual(stats.written, ['mine']);
});

test('only what changed is written, and what I removed is deleted', async () => {
  const items = [leave('a'), leave('b'), leave('c')];
  const { repo, col, stats } = fakeRepo({ leaveEntries: items });
  const syncer = new CollectionSyncer(repo, 'leaveEntries');
  syncer.remember(items);
  await syncer.save([leave('a'), leave('c', { note: 'x' }), leave('d')]);
  assert.deepEqual(stats.removed, ['b']);
  assert.deepEqual(stats.written.sort(), ['c', 'd']);
  assert.ok(!col('leaveEntries').has('b'));
});

test("one roster's save never removes another roster's shifts", async () => {
  const shift = (id: string, scheduleId: string) => ({ id, scheduleId, nurseId: 'n1', date: '2026-10-05', dutyWindowId: 'd', kind: 'FLOAT', locked: false, source: 'MANUAL' }) as unknown as Assignment;
  const all = [shift('a1', 'A'), shift('b1', 'B')];
  const { repo, col } = fakeRepo({ assignments: all });
  const syncer = new CollectionSyncer(repo, 'assignments');
  syncer.remember(all);
  // An empty roster B (e.g. an old undo step) is saved for roster B only.
  await syncer.save([], (a) => a.scheduleId === 'B');
  assert.ok(col('assignments').has('a1'));
  assert.ok(!col('assignments').has('b1'));
});

test('a failed save is kept and the retry writes it', async () => {
  const { repo, col, stats } = fakeRepo({ leaveEntries: [] });
  const syncer = new CollectionSyncer(repo, 'leaveEntries');
  stats.failNext = true;
  assert.equal(await syncer.save([leave('new')]), false);
  assert.equal(syncer.hasUnsaved(), true);
  assert.ok(!col('leaveEntries').has('new'));
  assert.equal(await syncer.retry(), true);
  assert.ok(col('leaveEntries').has('new'));
  assert.equal(syncer.hasUnsaved(), false);
});

test('quick edits are saved one after another and the latest one wins', async () => {
  const { repo, col } = fakeRepo({ leaveEntries: [] });
  const syncer = new CollectionSyncer(repo, 'leaveEntries');
  const first = syncer.save([leave('x')]);
  const second = syncer.save([]); // undone straight away
  assert.equal(await first, true);
  assert.equal(await second, true);
  assert.ok(!col('leaveEntries').has('x'));
});

test('the open roster is kept, else the one with today, else the latest', () => {
  const s = (id: string, startDate: string, endDate: string) => ({ id, startDate, endDate }) as Schedule;
  const list = [s('oct', '2026-10-01', '2026-10-31'), s('nov', '2026-11-01', '2026-11-30'), s('sep', '2026-09-01', '2026-09-30')];
  assert.equal(chooseScheduleToOpen(list, 'sep', 'nov', '2026-10-10')?.id, 'sep');
  assert.equal(chooseScheduleToOpen(list, 'gone', null, '2026-10-10')?.id, 'oct');
  assert.equal(chooseScheduleToOpen(list, null, null, '2027-01-10')?.id, 'nov');
  assert.equal(chooseScheduleToOpen([], null, null), undefined);
});

async function generateAll(existing: Assignment[], keepManual?: boolean) {
  const result = await SchedulingEngine.generate(
    makeSchedule({ hoursTargetFullTime: 56 }),
    'GENERATE_ALL',
    existing,
    [makeNurse('n1')],
    [SENIOR],
    [DAY_DUTY],
    [],
    [],
    [],
    [],
    [],
    hoursOnlyRules(),
    undefined,
    [],
    [],
    [ANNUAL_LEAVE],
    undefined,
    keepManual === undefined ? {} : { keepManual }
  );
  return result;
}

const handEdit = {
  id: 'hand',
  scheduleId: 'sched-1',
  nurseId: 'n1',
  date: '2026-10-07',
  dutyWindowId: DAY_DUTY.id,
  kind: 'CLINICAL_ROLE',
  clinicalRoleId: 'role-float',
  locked: false,
  source: 'MANUAL',
  note: 'swapped with Sara',
} as unknown as Assignment;

test('Generate All keeps shifts changed by hand', async () => {
  const result = await generateAll([handEdit]);
  assert.ok(result.assignments.some((a) => a.id === 'hand'));
  assert.equal(result.preservedManualCount, 1);
});

test('Generate All replaces hand changes only when asked', async () => {
  const result = await generateAll([handEdit], false);
  assert.ok(!result.assignments.some((a) => a.id === 'hand'));
});

const DOCTOR = {
  id: 'dr-a',
  fullName: 'Dr A',
  specialtyIds: ['sp'],
  active: true,
  weeklyPattern: [{ weekday: 1, startTime: '09:00', endTime: '17:00' }], // Mondays
} as unknown as Doctor;

const session = (date: string, extra: Partial<DoctorSession>) =>
  ({ id: `s-${date}`, doctorId: 'dr-a', date, startTime: '09:00', endTime: '17:00', specialtyId: 'sp', source: 'PATTERN', cancelled: false, ...extra }) as DoctorSession;

test("filling from the weekly pattern keeps one date changes and skips holidays", async () => {
  // Mondays in Oct 2026: 5, 12, 19, 26. The 12th was removed for that day, the 19th moved to 13:00, the 26th is a holiday.
  const { repo, col } = fakeRepo({
    doctorSessions: [session('2026-10-12', { cancelled: true, source: 'MANUAL' }), session('2026-10-19', { startTime: '13:00', endTime: '21:00', source: 'MANUAL' })],
    holidays: [{ id: 'h', date: '2026-10-26', name: 'Holiday' }],
  });
  const result = await populateRecurringDoctorSessionsForSchedule({ repo, startDate: '2026-10-01', endDate: '2026-10-31', doctors: [DOCTOR] });
  assert.deepEqual(result.newSessions.map((x) => x.date), ['2026-10-05']);
  const byDate = [...col('doctorSessions').values()].filter((x) => x.date === '2026-10-19');
  assert.equal(byDate.length, 1);
  assert.equal(byDate[0].startTime, '13:00');
  assert.equal([...col('doctorSessions').values()].find((x) => x.date === '2026-10-12').cancelled, true);
});

test('checking the weekly pattern before generating saves nothing', async () => {
  const { repo, col, stats } = fakeRepo({ doctorSessions: [], holidays: [] });
  const result = await populateRecurringDoctorSessionsForSchedule({ repo, startDate: '2026-10-01', endDate: '2026-10-31', doctors: [DOCTOR], dryRun: true });
  assert.equal(result.newSessions.length, 4);
  assert.equal(col('doctorSessions').size, 0);
  assert.deepEqual(stats.written, []);
});
