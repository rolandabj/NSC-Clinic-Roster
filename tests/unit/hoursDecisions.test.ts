import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveNurseHoursBalance, type HoursHistory } from '../../src/services/hours/hoursBalance';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { summarizeNurseHours, calculateDutyDurationHours } from '../../src/services/reports/hoursAccounting';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, WorkingHoursPeriod } from '../../src/types';

// The owner's decisions of 2026-10-06 on hours (PROJECT_GUIDE section 16, item 28).

const OCT: WorkingHoursPeriod = { id: 'oct', year: '2026', name: 'Oct19-Nov18', startDate: '2026-10-19', endDate: '2026-11-18', workingHours: 230 };
const NOV: WorkingHoursPeriod = { id: 'nov', year: '2026', name: 'Nov19-Dec18', startDate: '2026-11-19', endDate: '2026-12-18', workingHours: 210 };
const LONG = { ...DAY_DUTY, id: 'long', endTime: '21:00' }; // 12 h
const day = (i: number) => new Date(Date.UTC(2026, 9, 19 + i)).toISOString().slice(0, 10);
const shiftOn = (id: string, scheduleId: string, nurseId: string, date: string, dutyWindowId = LONG.id) =>
  ({ id, scheduleId, nurseId, date, dutyWindowId, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'MANUAL', locked: false }) as Assignment;

test('unpaid leave adds no goal while drafting, the same as in the published ledger', async () => {
  const nurse = makeNurse('u');
  const unpaid = [makeLeave({ id: 'ul', nurseId: 'u', leaveTypeId: UNPAID_LEAVE.id, startDate: day(0), endDate: day(6), hoursCredited: 0 })];
  const draft = makeSchedule({ id: 'd', startDate: OCT.startDate, endDate: OCT.endDate, hoursTargetFullTime: 0 });
  // 24 of the 31 days have a goal: 230 x 24 / 31 = 178 h (it asked the whole 230 h before).
  const goal = resolveNurseHoursBalance(nurse, draft, [DAY_DUTY, LONG], unpaid, [UNPAID_LEAVE], [OCT]);
  assert.equal(goal.targetHours, 178);

  // The engine fills her to that goal, not to 230 h in fewer days.
  const result = await SchedulingEngine.generate(draft, 'GENERATE_ALL', [], [nurse], [SENIOR], [DAY_DUTY, LONG], [], [], [], [], unpaid,
    hoursOnlyRules(), undefined, [OCT], [], [UNPAID_LEAVE]);
  const hours = result.assignments.reduce((sum, a) => sum + calculateDutyDurationHours(a.dutyWindowId === LONG.id ? LONG : DAY_DUTY), 0);
  assert.ok(hours <= 186 && hours >= 170, `about 178 h, got ${hours}`);

  // Once published, the next month carries what the screen showed (180 h worked: 2 h ahead).
  const shifts = Array.from({ length: 15 }, (_, i) => shiftOn('s' + i, 'd', 'u', day(7 + i)));
  const shown = summarizeNurseHours(nurse, draft, shifts, [DAY_DUTY, LONG], unpaid, [UNPAID_LEAVE], [OCT]);
  const next = makeSchedule({ id: 'n', startDate: NOV.startDate, endDate: NOV.endDate });
  const history: HoursHistory = { schedules: [{ ...draft, status: 'PUBLISHED' }, next], assignments: shifts, leaveEntries: unpaid };
  const carried = resolveNurseHoursBalance(nurse, next, [DAY_DUTY, LONG], unpaid, [UNPAID_LEAVE], [OCT, NOV], history).carriedHours;
  assert.equal(shown.closingBalanceHours, 2);
  assert.equal(Math.round(carried), -2);
});

test('leave on days outside every period does not cut the goal of the period days', async () => {
  // The last period ends Dec 18; the roster runs to Dec 25. Leave Dec 21 to 25 is on days without a goal.
  const schedule = makeSchedule({ startDate: '2026-12-12', endDate: '2026-12-25', hoursTargetFullTime: 0 });
  const fill = (leave: any[]) =>
    SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], [makeNurse('a')], [SENIOR], [DAY_DUTY], [], [], [], [], leave, hoursOnlyRules(),
      undefined, [NOV], [], [ANNUAL_LEAVE]);
  const hoursOf = (r: Awaited<ReturnType<typeof fill>>) => r.assignments.length * 8;
  const leave = [makeLeave({ nurseId: 'a', startDate: '2026-12-21', endDate: '2026-12-25' })];
  assert.equal(hoursOf(await fill(leave)), hoursOf(await fill([])), 'the same hours with the leave after the period (it was 8 h instead of 48 h)');

  // The checker says the days need their period.
  const report = ScheduleValidator.validate(schedule, [], [makeNurse('a')], [SENIOR], [DAY_DUTY], [], leave, [], [], hoursOnlyRules(), [NOV], [], [], [ANNUAL_LEAVE]);
  const gap = report.findings.find((f) => f.id.startsWith('period-gap'));
  assert.ok(gap, 'a Check about the days outside every period');
  assert.equal(gap!.severity, 'WARN');
  assert.match(gap!.message, /7 days/);
});

test('catching up asks at most 10% of the roster\'s own hours, also for a shortfall in the same period', () => {
  const nurse = makeNurse('n');
  const first = makeSchedule({ id: 'first', startDate: '2026-10-19', endDate: '2026-11-01', status: 'PUBLISHED' }); // 104 h
  const second = makeSchedule({ id: 'second', startDate: '2026-11-02', endDate: '2026-11-18' }); // 126 h
  // She worked only 5 x 12 h = 60 h of her 104 h in the first roster: 44 h short.
  const worked = Array.from({ length: 5 }, (_, i) => shiftOn('s' + i, 'first', 'n', day(i)));
  const balance = resolveNurseHoursBalance(nurse, second, [DAY_DUTY, LONG], [], [], [OCT, NOV], { schedules: [first, second], assignments: worked });
  // It asked all 44 h before (170 h in 17 days).
  assert.equal(balance.carriedHours, 12.6);
  assert.equal(balance.targetHours, 138.6);
  assert.equal(balance.deferredHours, 31.4);

  // A two week roster at the start of the next period asks 10% of its own 98 h, not 10% of the month.
  const month = makeSchedule({ id: 'month', startDate: OCT.startDate, endDate: OCT.endDate, status: 'PUBLISHED' });
  const twoWeeks = makeSchedule({ id: 'two', startDate: '2026-11-19', endDate: '2026-12-02' });
  const monthShort = Array.from({ length: 16 }, (_, i) => shiftOn('m' + i, 'month', 'n', day(i))); // 192 of 230 h
  const next = resolveNurseHoursBalance(nurse, twoWeeks, [DAY_DUTY, LONG], [], [], [OCT, NOV], { schedules: [month, twoWeeks], assignments: monthShort });
  assert.equal(next.baseTargetHours, 98);
  assert.equal(next.carriedHours, 9.8);
});

test('hours are paced over the days she can work: no rush of shifts when she is back from leave', async () => {
  // Four nurses share two doctors (07:00 to 19:00 every day); Nurse a is on leave Oct 19 to 28.
  const EARLY_LONG = { ...DAY_DUTY, id: 'early-long', startTime: '07:00', endTime: '19:00' }; // 12 h, not late
  const doctors = ['dr0', 'dr1'].map((id) => ({ id, fullName: id, specialtyIds: [], weeklyPattern: [], active: true })) as any[];
  const sessions = Array.from({ length: 31 }, (_, d) => doctors.map((doc) =>
    ({ id: `${doc.id}-${d}`, doctorId: doc.id, date: day(d), startTime: '07:00', endTime: '19:00', source: 'PATTERN', cancelled: false }))).flat() as any[];
  const leave = [makeLeave({ nurseId: 'a', startDate: day(0), endDate: day(9) })];
  const schedule = makeSchedule({ id: 'oct', startDate: OCT.startDate, endDate: OCT.endDate, hoursTargetFullTime: 0 });
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], ['a', 'b', 'c', 'd'].map((id) => makeNurse(id)), [SENIOR],
    [EARLY_LONG], [], [], sessions, [], leave, hoursOnlyRules(), undefined, [OCT], doctors, [ANNUAL_LEAVE]);
  const hers = result.assignments.filter((a) => a.nurseId === 'a');
  const firstWeekBack = hers.filter((a) => a.date >= day(10) && a.date <= day(16)).length * 12;
  // Her 150 h over her 21 working days is about 50 h a week. Paced over all 31 days she was
  // 53 h behind on her first day back, and got a 60 h week straight away.
  assert.ok(firstWeekBack <= 48, `at most 4 long shifts in her first week back, got ${firstWeekBack} h`);
  assert.equal(hers.length * 12, 144, 'the same hours for the month');
});
