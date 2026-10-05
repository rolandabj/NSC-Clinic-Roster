import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  inclusiveDays,
  leaveCreditPerDay,
  leaveCreditInRange,
  resolveFullTimeTarget,
} from '../../src/services/hours/hoursPolicy';
import { ANNUAL_LEAVE, UNPAID_LEAVE, makeLeave, makeSchedule } from './fixtures';
import { calculateWorkingHoursForDateRange } from '../../src/services/periods/workingHoursPeriodService';

test('inclusiveDays counts both ends', () => {
  assert.equal(inclusiveDays('2026-10-01', '2026-10-01'), 1);
  assert.equal(inclusiveDays('2026-10-01', '2026-10-31'), 31);
  assert.equal(inclusiveDays('2026-10-05', '2026-10-01'), 0);
});

test('a 5 day leave entry of 40h credits 8h per day, not 40h per day', () => {
  const leave = makeLeave({ startDate: '2026-10-05', endDate: '2026-10-09', hoursCredited: 40 });
  assert.equal(leaveCreditPerDay(leave, ANNUAL_LEAVE), 8);
});

test('leave types that do not count toward the target credit nothing', () => {
  const leave = makeLeave({ leaveTypeId: UNPAID_LEAVE.id, hoursCredited: 16, endDate: '2026-10-06' });
  assert.equal(leaveCreditPerDay(leave, UNPAID_LEAVE), 0);
});

test('without hoursCredited the leave type hours per day are used', () => {
  const leave = makeLeave({ hoursCredited: 0 });
  assert.equal(leaveCreditPerDay(leave, { ...ANNUAL_LEAVE, creditedHours: 7.5 }), 7.5);
  assert.equal(leaveCreditPerDay(leave, { ...ANNUAL_LEAVE, creditedHours: 'match_duty' as any }), 8);
});

test('only leave days inside the schedule count', () => {
  // 28 Sep to 2 Oct (5 days, 40h); October schedule contains 2 of those days
  const leave = makeLeave({ startDate: '2026-09-28', endDate: '2026-10-02', hoursCredited: 40 });
  assert.equal(leaveCreditInRange(leave, ANNUAL_LEAVE, '2026-10-01', '2026-10-31'), 16);
  assert.equal(leaveCreditInRange(leave, ANNUAL_LEAVE, '2026-11-01', '2026-11-30'), 0);
});

test('full time target: schedule target is ignored when no period covers the dates', () => {
  const schedule = makeSchedule({ startDate: '2026-10-01', endDate: '2026-10-31', hoursTargetFullTime: 168 });
  const periodsElsewhere = [
    { id: 'p', year: '2025', name: 'Jan 2025', startDate: '2025-01-01', endDate: '2025-01-31', workingHours: 170 },
  ] as any;
  assert.equal(resolveFullTimeTarget(schedule, periodsElsewhere).hours, 0);
  assert.equal(resolveFullTimeTarget(schedule, periodsElsewhere).source, 'DEFAULT');
});

test('full time target: a matching dedicated period wins', () => {
  const schedule = makeSchedule({ startDate: '2026-10-01', endDate: '2026-10-31', hoursTargetFullTime: 168 });
  const periods = [
    { id: 'p', year: '2026', name: 'Oct 2026', startDate: '2026-10-01', endDate: '2026-10-31', workingHours: 176 },
  ] as any;
  const target = resolveFullTimeTarget(schedule, periods);
  assert.equal(target.hours, 176);
  assert.equal(target.source, 'PERIOD');
});

test('full time target: uncovered dates accrue no target hours', () => {
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-18', hoursTargetFullTime: 0 });
  assert.equal(resolveFullTimeTarget(schedule, []).hours, 0);
});


test('uncovered days are excluded from period prorating', () => {
  const periods = [
    { id: 'p', year: '2026', name: 'October', startDate: '2026-10-01', endDate: '2026-10-31', workingHours: 310 },
  ] as any;
  const result = calculateWorkingHoursForDateRange('2026-10-30', '2026-11-02', periods);
  assert.equal(result.targetHours, 20);
  assert.equal(result.fallbackDays, 2);
  assert.match(result.description, /2 uncovered days excluded/);
});

test('dates with no dedicated period accrue no target', () => {
  const result = calculateWorkingHoursForDateRange('2026-10-05', '2026-10-18', []);
  assert.equal(result.targetHours, 0);
  assert.equal(result.fallbackDays, 14);
  assert.match(result.description, /no hours target is accrued/);
});
