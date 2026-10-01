import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { SENIOR, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, DutyWindow, Rule } from '../../src/types';

const LATE: DutyWindow = { id: 'late', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00', color: '#000000', active: true };
const EARLY: DutyWindow = { id: 'early', name: 'Early', acronym: 'E', startTime: '07:00', endTime: '15:00', color: '#000000', active: true };

// A late shift then an early one: 10 hours of rest.
const shifts = [
  { id: 'a1', scheduleId: 'sched-1', nurseId: 'n1', date: '2026-10-05', dutyWindowId: 'late', kind: 'FLOAT', locked: false, source: 'MANUAL' },
  { id: 'a2', scheduleId: 'sched-1', nurseId: 'n1', date: '2026-10-06', dutyWindowId: 'early', kind: 'FLOAT', locked: false, source: 'MANUAL' },
] as unknown as Assignment[];

const restRule = (overrides: Partial<Rule>) =>
  ({ id: 'rule-h3', name: 'Minimum rest', templateKey: 'MIN_REST_HOURS', severity: 'HARD', value: 11, ...overrides }) as unknown as Rule;

const restFindings = (rules: Rule[]) =>
  ScheduleValidator.validate(makeSchedule(), shifts, [makeNurse('n1')], [SENIOR], [LATE, EARLY], [], [], [], [], rules).findings.filter((f) =>
    f.id.startsWith('h3-rest-')
  );

test('the checker applies a rule whose on/off setting was never saved, like the generator', () => {
  assert.equal(restFindings([restRule({ enabled: undefined })]).length, 1);
});

test('the checker skips a rule that is switched off', () => {
  assert.equal(restFindings([restRule({ enabled: false })]).length, 0);
});

test('rest set to 0 means no minimum rest in the checker, like the generator', () => {
  assert.equal(restFindings([restRule({ enabled: true, value: 0 })]).length, 0);
});
