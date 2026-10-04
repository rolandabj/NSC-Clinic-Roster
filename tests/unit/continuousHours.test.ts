import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HoursHistory, hoursHistoryOverlaps, resolveNurseHoursBalance } from '../../src/services/hours/hoursBalance';
import { calculateNurseHoursAccounting, summarizeNurseHours } from '../../src/services/reports/hoursAccounting';
import { RosterPublishService } from '../../src/services/publish/rosterPublishService';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { assertScheduleRangeAvailable, mergeScheduleRanges } from '../../src/services/schedule/scheduleRanges';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Schedule, WorkingHoursPeriod } from '../../src/types';

const periods: WorkingHoursPeriod[] = [
  { id: 'oct', year: '2026', name: 'October', startDate: '2026-10-19', endDate: '2026-11-18', workingHours: 230 },
  { id: 'nov', year: '2026', name: 'November', startDate: '2026-11-19', endDate: '2026-12-18', workingHours: 210 },
];
const first = makeSchedule({ id: 'first', startDate: '2026-10-19', endDate: '2026-11-01' });
const second = makeSchedule({ id: 'second', startDate: '2026-11-02', endDate: '2026-11-18' });
const third = makeSchedule({ id: 'third', startDate: '2026-11-19', endDate: '2026-12-18' });
const nurse = makeNurse('n1');
const long = { ...DAY_DUTY, id: 'long', endTime: '21:00' };
const duties = [DAY_DUTY, long];
const previousShifts = Array.from({ length: 10 }, (_, i) => ({
  id: `old-${i}`, scheduleId: first.id, nurseId: nurse.id, date: `2026-10-${19 + i}`, dutyWindowId: long.id,
  kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'MANUAL', locked: false,
} as Assignment));
const history: HoursHistory = { schedules: [first, second, third], assignments: previousShifts };
const balance = (schedule: Schedule, input: HoursHistory = history) => resolveNurseHoursBalance(nurse, schedule, duties, [], [], periods, input);

test('partial roster starts at 104 hours and 120 earlier hours leave 110 in the same period', () => {
  assert.equal(balance(first).targetHours, 104);
  const result = balance(second);
  assert.equal(result.baseTargetHours, 126);
  assert.equal(result.carriedHours, -16);
  assert.equal(result.targetHours, 110);
  assert.equal(result.previousCreditedHours, 120);
});

test('dates without a roster still accrue target into the following period', () => {
  const result = balance(third, { schedules: [first, third], assignments: previousShifts });
  assert.equal(result.baseTargetHours, 210);
  assert.equal(result.carriedHours, 110);
  assert.equal(result.targetHours, 320);
});

test('draft, published and archived rosters contribute once, and later rosters do not change earlier balances', () => {
  for (const status of ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const) {
    const input = { schedules: [{ ...first, status }, second, third], assignments: previousShifts };
    assert.equal(balance(second, input).targetHours, 110);
    assert.equal(balance(first, input).targetHours, 104);
  }
});

test('approved leave in a date gap credits the balance once and replaces a shift on the same day', () => {
  const leaves = [makeLeave({ startDate: '2026-10-19', endDate: '2026-10-19' }),
    makeLeave({ id: 'gap', startDate: '2026-11-02', endDate: '2026-11-03' })];
  const result = resolveNurseHoursBalance(nurse, third, duties, leaves, [ANNUAL_LEAVE], periods,
    { schedules: [first, third], assignments: previousShifts });
  assert.equal(result.previousCreditedHours, 132); // 120 minus 12 plus 8 plus 16
  assert.equal(result.targetHours, 308);
});

test('excess credit can cover a whole later roster and the remaining surplus is retained', () => {
  const allDay = { ...long, startTime: '09:00', endTime: '09:00' };
  const more = Array.from({ length: 13 }, (_, i) => ({ ...previousShifts[0], id: `many-${i}`, date: `2026-10-${19 + i}` }));
  const input = { schedules: [first, second], assignments: more };
  const result = calculateNurseHoursAccounting(nurse, second, [], [allDay], [], [], [], [], [], [], [], periods, input);
  assert.equal(result.targetHours, 0);
  assert.equal(result.closingBalanceHours, 82);
});

test('splitting a period into three rosters preserves its full target after rounding', () => {
  const pieces = [makeSchedule({ id: 'a', startDate: '2026-10-19', endDate: '2026-10-21' }),
    makeSchedule({ id: 'b', startDate: '2026-10-22', endDate: '2026-10-24' }),
    makeSchedule({ id: 'c', startDate: '2026-10-25', endDate: '2026-11-18' })];
  const targets = pieces.map(s => balance(s, { schedules: pieces, assignments: [] }).baseTargetHours);
  assert.deepEqual(targets, [22, 23, 185]);
  assert.equal(targets.reduce((a, b) => a + b), 230);
});

test('part time cumulative targets are rounded after the contract share is applied', () => {
  const result = resolveNurseHoursBalance({ ...nurse, contractPercent: 50 }, second, duties, [], [], periods, history);
  assert.equal(result.cumulativeTargetHours, 115);
  assert.equal(result.targetHours, 0);
  assert.equal(result.carriedHours, -68);
});

test('changing earlier assignments immediately changes later goals; orphan and out of range shifts do not count', () => {
  assert.equal(balance(second, { ...history, assignments: previousShifts.slice(0, 9) }).targetHours, 122);
  const extras = [{ ...previousShifts[0], id: 'orphan', scheduleId: 'gone' },
    { ...previousShifts[0], id: 'outside', date: '2026-10-18' }, { ...previousShifts[0], id: 'duplicate' }];
  assert.equal(balance(second, { ...history, assignments: [...previousShifts, ...extras] }).targetHours, 110);
});

test('a roster spanning two periods has distinct cumulative targets at the boundary', () => {
  const crossing = makeSchedule({ id: 'cross', startDate: '2026-11-02', endDate: '2026-11-30' });
  const input = { schedules: [first, crossing], assignments: previousShifts };
  assert.equal(resolveNurseHoursBalance(nurse, crossing, duties, [], [], periods, input, '2026-11-18').targetHours, 110);
  assert.equal(balance(crossing, input).targetHours, 194);
});

test('reports and the grid use the same carried target and closing balance', () => {
  const shifts = [{ ...previousShifts[0], id: 'new', date: '2026-11-02', scheduleId: second.id }];
  const summary = summarizeNurseHours(nurse, second, shifts, duties, [], [], periods, undefined, history);
  const report = calculateNurseHoursAccounting(nurse, second, shifts, duties, [], [], [], [], [], [], [], periods, history);
  assert.equal(summary.targetHours, 110);
  assert.equal(report.targetHours, summary.targetHours);
  assert.equal(report.closingBalanceHours, -98);
  assert.equal(summary.closingBalanceHours, report.closingBalanceHours);
});

test('overlap protection includes shared boundary dates, archived records and repeated reservations', () => {
  assert.doesNotThrow(() => assertScheduleRangeAvailable(second, [first]));
  assert.throws(() => assertScheduleRangeAvailable({ ...second, startDate: '2026-11-01' }, [first]), /overlap/);
  assert.throws(() => assertScheduleRangeAvailable({ ...first, id: 'copy' }, [{ ...first, status: 'ARCHIVED' } as Schedule]), /overlap/);
  const reserved = mergeScheduleRanges({}, [first]);
  assert.throws(() => mergeScheduleRanges(reserved, [{ ...first, id: 'other-planner' }]), /overlap/);
  assert.throws(() => mergeScheduleRanges({}, [first, { ...first, id: 'imported-copy' }]), /overlap/);
});

test('existing overlaps block generation and produce a publishing error without deleting records', async () => {
  const duplicate = { ...first, id: 'duplicate' };
  const input = { schedules: [first, duplicate], assignments: previousShifts };
  assert.equal(hoursHistoryOverlaps(first, input).length, 1);
  await assert.rejects(SchedulingEngine.generate(first, 'GENERATE_ALL', [], [nurse], [SENIOR], duties,
    [], [], [], [], [], hoursOnlyRules(), undefined, periods, [], [], { hoursHistory: input }), /overlap/);
  const report = ScheduleValidator.validate(first, [], [nurse], [SENIOR], duties, [], [], [], [], hoursOnlyRules(),
    periods, [], [], [], { hoursHistory: input });
  assert.ok(report.findings.some(f => f.id.startsWith('schedule-overlap-') && f.severity === 'ERROR'));
});

test('generation respects the carried goal and validation checks the same adjusted ceiling', async () => {
  const generated = await SchedulingEngine.generate(second, 'GENERATE_ALL', [], [nurse], [SENIOR], duties,
    [], [], [], [], [], hoursOnlyRules(), undefined, periods, [], [], { hoursHistory: history });
  const total = summarizeNurseHours(nurse, second, generated.assignments, duties, [], [], periods, undefined, history);
  assert.ok(total.totalHours > 0);
  assert.ok(total.totalHours <= 116, `Generated ${total.totalHours} for the adjusted 110 hour goal`);
  const over = Array.from({ length: 11 }, (_, i) => ({ ...previousShifts[0], id: `over-${i}`, scheduleId: second.id,
    date: `2026-11-${String(2 + i).padStart(2, '0')}` }));
  const checked = ScheduleValidator.validate(second, over, [nurse], [SENIOR], duties, [], [], [], [], hoursOnlyRules(), periods, [], [], [], { hoursHistory: history });
  assert.ok(checked.findings.some(f => f.id.startsWith('h7-hours-over-') && f.message.includes('110')));
});

test('generation and validation reserve the later period budget until its dates begin', async () => {
  const crossing = makeSchedule({ id: 'cross', startDate: '2026-11-02', endDate: '2026-11-30' });
  const input = { schedules: [first, crossing], assignments: previousShifts };
  const generated = await SchedulingEngine.generate(crossing, 'GENERATE_ALL', [], [nurse], [SENIOR], duties,
    [], [], [], [], [], hoursOnlyRules(), undefined, periods, [], [], { hoursHistory: input });
  const prefix = summarizeNurseHours(nurse, crossing, generated.assignments, duties, [], [], periods,
    { start: crossing.startDate, end: '2026-11-18' }, input);
  assert.ok(prefix.totalHours <= 116, `The first period received ${prefix.totalHours} hours`);
  const tooEarly = Array.from({ length: 11 }, (_, i) => ({ ...previousShifts[0], id: `early-${i}`, scheduleId: crossing.id,
    date: `2026-11-${String(2 + i).padStart(2, '0')}` }));
  const report = ScheduleValidator.validate(crossing, tooEarly, [nurse], [SENIOR], duties, [], [], [], [], hoursOnlyRules(), periods, [], [], [], { hoursHistory: input });
  assert.ok(report.findings.some(f => f.id === 'h7-period-n1-2026-11-18'));
});

test('saved historical leave stays current when exporting an older roster snapshot', () => {
  const historicalLeave = makeLeave({ startDate: '2026-10-19', endDate: '2026-10-19' });
  const result = resolveNurseHoursBalance(nurse, second, duties, [], [ANNUAL_LEAVE], periods,
    { ...history, leaveEntries: [historicalLeave] });
  assert.equal(result.previousCreditedHours, 116);
  assert.equal(result.targetHours, 114);
});

test('unconfigured dates use 40 hours per week even in a partly covered roster', () => {
  const partial = makeSchedule({ id: 'partial', startDate: '2026-11-16', endDate: '2026-11-25', hoursTargetFullTime: 999 });
  const result = resolveNurseHoursBalance(nurse, partial, duties, [], [], [periods[0]], { schedules: [partial], assignments: [] });
  assert.equal(result.targetHours, 62); // 3 of 31 days at 230h, then 7 days at 40h/week
});


test('personal roster emails show the same adjusted goal and carried balance as reports', () => {
  const email = RosterPublishService.generatePersonalEmailHtml({
    clinicName: 'Clinic', schedule: second, version: { number: 1 } as any, nurse,
    assignments: [], dutyWindows: duties, doctors: [], roles: [], specialties: [], leaveEntries: [], leaveTypes: [],
    ackToken: 'test-only', workingHoursPeriods: periods, hoursHistory: history,
  });
  assert.match(email.html, />110h</);
  assert.match(email.html, /Base goal: 126h/);
  assert.match(email.html, /16h ahead/);
});
