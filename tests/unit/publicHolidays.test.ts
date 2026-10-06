import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isOldHolidayLeave,
  leaveAfterHolidayChange,
  leaveCountingOnHoliday,
  planHolidayLeaveTidy,
  withHolidaysAtZero,
} from '../../src/services/hours/holidayLeave';
import { summarizeNurseHours } from '../../src/services/reports/hoursAccounting';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { recordHolidayDayOff } from '../../src/services/requests/staffRequestService';
import { repositoryManager } from '../../src/services/repository';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, AvailabilityRequest, LeaveType, WorkingHoursPeriod } from '../../src/types';

// The owner's decision of 2026-10-06 (option 1): the period hours already leave public holidays
// out, so nobody gets leave hours for a holiday; whoever works it takes another day off of their
// choosing.

const EID = '2026-10-20';
const PH: LeaveType = { ...ANNUAL_LEAVE, id: 'lt-ph', name: 'Public Holiday', acronym: 'PH' } as LeaveType;
const OCT: WorkingHoursPeriod = { id: 'oct', year: '2026', name: 'Oct19-Nov18', startDate: '2026-10-19', endDate: '2026-11-18', workingHours: 222 };
const shift = (nurseId: string, date: string): Assignment =>
  ({ id: `${nurseId}-${date}`, scheduleId: 's', nurseId, date, dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'MANUAL' }) as Assignment;

test('leave counts 0 h on a public holiday, also when the holiday is added later', () => {
  // Annual leave of 7 days around Eid: 6 days of 8 h, not 7.
  const leave = withHolidaysAtZero(makeLeave({ nurseId: 'b', startDate: '2026-10-19', endDate: '2026-10-25' }), [EID]);
  assert.deepEqual(leave.dayHours, { [EID]: 0 });
  const schedule = makeSchedule({ startDate: '2026-10-19', endDate: '2026-11-18', hoursTargetFullTime: 0 });
  assert.equal(summarizeNurseHours(makeNurse('b'), schedule, [], [DAY_DUTY], [leave], [ANNUAL_LEAVE], [OCT]).leaveHours, 48);

  // Hours typed for that day stay; a leave without the holiday is left as it is.
  const halfDay = makeLeave({ startDate: EID, endDate: EID, dayHours: { [EID]: 4 } });
  assert.equal(withHolidaysAtZero(halfDay, [EID]), halfDay);
  const other = makeLeave({ startDate: '2026-10-25', endDate: '2026-10-26' });
  assert.equal(withHolidaysAtZero(other, [EID]), other);

  // Eid announced a day later (moon sighting): the leave follows, without a manual change.
  const [moved] = leaveAfterHolidayChange([leave], [EID], ['2026-10-21']);
  assert.deepEqual(moved.dayHours, { '2026-10-21': 0 });
  assert.deepEqual(leaveAfterHolidayChange([leave], [EID], [EID]), [], 'nothing changes when the dates stay');
});

test('tidying the old public holiday leave: deleted, and other leave counts 0 h on the holiday', () => {
  const holidays = new Set([EID]);
  const oldPh = makeLeave({ id: 'ph-a', nurseId: 'a', leaveTypeId: PH.id, startDate: EID, endDate: EID });
  // The old button used the first leave type when the clinic had no PH type, with this note.
  const oldNoted = makeLeave({ id: 'al-c', nurseId: 'c', startDate: EID, endDate: EID, note: 'Public Holiday: Eid' });
  const annual = makeLeave({ id: 'al-b', nurseId: 'b', startDate: '2026-10-18', endDate: '2026-10-24', dayHours: { [EID]: 8 } });
  const unpaid = makeLeave({ id: 'ul-d', nurseId: 'd', leaveTypeId: UNPAID_LEAVE.id, startDate: '2026-10-19', endDate: '2026-10-21' });
  const types = [ANNUAL_LEAVE, UNPAID_LEAVE, PH];
  assert.equal(isOldHolidayLeave(oldPh, holidays, types), true);
  assert.equal(isOldHolidayLeave(oldNoted, holidays, types), true);
  assert.equal(isOldHolidayLeave(annual, holidays, types), false, 'a week of annual leave is real leave');

  assert.deepEqual(leaveCountingOnHoliday([oldPh, oldNoted, annual, unpaid], types, EID).map((l) => l.id), ['ph-a', 'al-c', 'al-b']);
  const tidy = planHolidayLeaveTidy([oldPh, oldNoted, annual, unpaid], types, [{ date: EID }]);
  assert.deepEqual(tidy.remove.map((l) => l.id), ['ph-a', 'al-c']);
  assert.deepEqual(tidy.zero.map((l) => [l.id, l.dayHours]), [['al-b', { [EID]: 0 }]], 'hours set by hand too; unpaid leave counts 0 h already');
});

test('the checker: leave counting hours on a holiday, and a day off still to choose for whoever works it', () => {
  const schedule = makeSchedule({ startDate: '2026-10-19', endDate: '2026-10-25', hoursTargetFullTime: 0 });
  const nurses = [makeNurse('a', { fullName: 'Amy' }), makeNurse('b', { fullName: 'Bea' })];
  const setup = { holidayDates: [EID], holidayNames: { [EID]: 'Eid' } };
  const leave = [makeLeave({ id: 'ph-b', nurseId: 'b', leaveTypeId: PH.id, startDate: EID, endDate: EID })];
  const check = (requests: AvailabilityRequest[] = [], leaveEntries = leave) =>
    ScheduleValidator.validate(schedule, [shift('a', EID)], nurses, [SENIOR], [DAY_DUTY], [], leaveEntries, [], [], hoursOnlyRules(), [OCT],
      [], [], [ANNUAL_LEAVE, PH], setup, requests).findings;

  const leaveFinding = check().find((f) => f.id === `holiday-leave-${EID}`);
  assert.ok(leaveFinding);
  assert.equal(leaveFinding!.severity, 'WARN');
  assert.match(leaveFinding!.message, /Eid.*leave counts hours for Bea/);
  assert.equal(check([], [withHolidaysAtZero(leave[0], [EID])]).some((f) => f.id.startsWith('holiday-leave')), false);

  const reminder = check().find((f) => f.id === `day-off-for-holiday-a-${EID}`);
  assert.ok(reminder, 'Amy works Eid without a day off chosen');
  assert.equal(reminder!.severity, 'WARN');
  assert.match(reminder!.message, /Amy works the public holiday Eid on Tue 20-10-2026 and has no day off chosen for it yet/);
  const dayOff = { id: 'r1', nurseId: 'a', date: '2026-11-01', available: false, holidayDate: EID, status: 'APPROVED', submittedByNurseId: 'a', submittedAt: '' } as AvailabilityRequest;
  assert.equal(check([dayOff]).some((f) => f.id.startsWith('day-off-for-holiday')), false, 'chosen');
  assert.equal(check([{ ...dayOff, status: 'REJECTED' }]).some((f) => f.id.startsWith('day-off-for-holiday')), true, 'a refused one does not count');
});

/** An in memory database for the request service. */
function memoryRepo() {
  const data: Record<string, Map<string, any>> = {};
  const col = (name: string) => (data[name] ||= new Map());
  const repo: any = {
    async list(name: string, filter?: { field: string; value: any }) {
      return [...col(name).values()].filter((x) => !filter || x[filter.field] === filter.value);
    },
    async get(name: string, id: string) { return col(name).get(id) || null; },
    async create(name: string, item: any) { const id = item.id || `id-${col(name).size + 1}`; col(name).set(id, { ...item, id }); return { ...item, id }; },
    async update(name: string, id: string, fields: any) { col(name).set(id, { ...col(name).get(id), ...fields }); return col(name).get(id); },
    async remove(name: string, id: string) { col(name).delete(id); },
  };
  return { repo, col };
}

test('recording the chosen day off: an approved day off linked to the holiday, with its pin', async () => {
  const { repo, col } = memoryRepo();
  const previous = (repositoryManager as any).activeRepo;
  (repositoryManager as any).activeRepo = repo;
  try {
    const planner = { uid: 'u1', name: 'Planner', email: 'p@example.com', role: 'OWNER', isLocal: false } as any;
    await assert.rejects(recordHolidayDayOff(planner, { nurseId: 'a', holidayDate: EID, date: EID }), /another day/);
    await assert.rejects(recordHolidayDayOff({ ...planner, role: 'VIEWER' }, { nurseId: 'a', holidayDate: EID, date: '2026-11-01' }), /Only planners/);

    const saved = await recordHolidayDayOff(planner, { nurseId: 'a', holidayDate: EID, holidayName: 'Eid', date: '2026-11-01' });
    assert.equal(saved.status, 'APPROVED');
    assert.equal(saved.holidayDate, EID);
    assert.equal(saved.available, false);
    assert.ok(col('locks').get('lock-off-a-2026-11-01'), 'pinned day off');

    // Moved to another day: one request, the pin moves with it.
    await recordHolidayDayOff(planner, { nurseId: 'a', holidayDate: EID, date: '2026-11-03' });
    assert.equal(col('availabilityRequests').size, 1);
    assert.equal([...col('availabilityRequests').values()][0].date, '2026-11-03');
    assert.equal(col('locks').has('lock-off-a-2026-11-01'), false);
    assert.ok(col('locks').get('lock-off-a-2026-11-03'));

    // Bea already asked for that day off: her request is linked and approved, not doubled.
    col('availabilityRequests').set('own', { id: 'own', nurseId: 'b', date: '2026-11-02', available: false, status: 'PENDING', note: 'Family visit', submittedByNurseId: 'b', submittedAt: '' });
    await recordHolidayDayOff(planner, { nurseId: 'b', holidayDate: EID, date: '2026-11-02' });
    const own = col('availabilityRequests').get('own');
    assert.equal(own.status, 'APPROVED');
    assert.equal(own.holidayDate, EID);
    assert.equal(own.note, 'Family visit');
    assert.equal([...col('availabilityRequests').values()].filter((r) => r.nurseId === 'b').length, 1);
  } finally {
    (repositoryManager as any).activeRepo = previous;
  }
});
