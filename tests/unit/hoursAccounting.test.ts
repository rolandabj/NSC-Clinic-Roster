import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateNurseHoursAccounting } from '../../src/services/reports/hoursAccounting';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment } from '../../src/types';

function duty(date: string, id = `a-${date}`): Assignment {
  return {
    id,
    scheduleId: 'sched-1',
    nurseId: 'n1',
    date,
    dutyWindowId: DAY_DUTY.id,
    kind: 'CLINICAL_ROLE',
    clinicalRoleId: 'role-float',
    locked: false,
    source: 'GENERATED',
  } as Assignment;
}

function account(assignments: Assignment[], leave = [] as ReturnType<typeof makeLeave>[]) {
  return calculateNurseHoursAccounting(
    makeNurse('n1'),
    makeSchedule(),
    assignments,
    [DAY_DUTY],
    leave,
    [ANNUAL_LEAVE],
    [SENIOR],
    [],
    [],
    []
  );
}

test('a 5 day leave of 40h adds 40h, not 200h', () => {
  const result = account([], [makeLeave({ startDate: '2026-10-05', endDate: '2026-10-09', hoursCredited: 40 })]);
  assert.equal(result.leaveHours, 40);
});

test('a duty on a leave day is not counted on top of the leave', () => {
  const leave = makeLeave({ startDate: '2026-10-05', endDate: '2026-10-05', hoursCredited: 8 });
  const result = account([duty('2026-10-05'), duty('2026-10-06')], [leave]);
  assert.equal(result.dutyHours, 8);
  assert.equal(result.leaveHours, 8);
  assert.equal(result.totalEarnedHours, 16);
});

test('duplicate assignments on one day count once', () => {
  const result = account([duty('2026-10-06', 'x1'), duty('2026-10-06', 'x2')]);
  assert.equal(result.dutyHours, 8);
});
