import { test } from 'node:test';
import assert from 'node:assert/strict';
import { explainDay, explainNurseDay, ExplainDayInput } from '../../src/services/engine/explainCell';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, makeLeave, makeLock, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Rule } from '../../src/types';

const LATE = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '23:00' };
const EARLY = { ...DAY_DUTY, id: 'duty-e', name: 'Early', acronym: 'E', startTime: '07:00', endTime: '15:00' };
const week = makeSchedule({ hoursTargetFullTime: 40 }); // 5 to 11 Oct 2026

function cell(date: string, nurseId = 'n1', dutyWindowId = DAY_DUTY.id): Assignment {
  return { id: `${nurseId}-${date}`, scheduleId: week.id, nurseId, date, dutyWindowId, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'MANUAL' } as Assignment;
}

function input(extra: Partial<ExplainDayInput> = {}): ExplainDayInput {
  return {
    schedule: week,
    assignments: [],
    nurses: [makeNurse('n1'), makeNurse('n2')],
    dutyWindows: [EARLY, DAY_DUTY, LATE],
    leaveEntries: [],
    locks: [],
    roles: [],
    rules: [],
    seniorityLevels: [SENIOR],
    leaveTypes: [ANNUAL_LEAVE],
    ...extra,
  };
}

test('a nurse with a shift that day is working', () => {
  const r = explainNurseDay({ ...input({ assignments: [cell('2026-10-06')] }), nurseId: 'n1', date: '2026-10-06' });
  assert.equal(r.status, 'WORKING');
});

test('a nurse on approved leave is off, with the leave named once', () => {
  const leaveEntries = [makeLeave({ startDate: '2026-10-06', endDate: '2026-10-06' })];
  const r = explainNurseDay({ ...input({ leaveEntries }), nurseId: 'n1', date: '2026-10-06' });
  assert.equal(r.status, 'BLOCKED');
  assert.deepEqual(r.reasons, ['On approved leave (Annual Leave).']);
  assert.deepEqual(r.possibleShifts, []);
});

test('a pinned day off blocks every shift', () => {
  const locks = [makeLock('n1', '2026-10-06', { mode: 'OFF' })];
  const r = explainNurseDay({ ...input({ locks }), nurseId: 'n1', date: '2026-10-06' });
  assert.equal(r.status, 'BLOCKED');
  assert.deepEqual(r.reasons, ['Has a pinned day off.']);
});

test('after a late shift, only shifts with enough rest are possible', () => {
  const assignments = [cell('2026-10-05', 'n1', LATE.id)]; // ends 23:00
  const r = explainNurseDay({ ...input({ assignments }), nurseId: 'n1', date: '2026-10-06' });
  assert.equal(r.status, 'AVAILABLE');
  assert.deepEqual(r.possibleShifts.map((s) => s.label), ['L']);
  assert.match(r.blockedShifts[0].reasons[0], /Needs 11 hours rest after the Late shift the day before \(it ends at 23:00\)/);

  // With the late shift switched off, no shift leaves enough rest.
  const onlyEarly = explainNurseDay({ ...input({ assignments, dutyWindows: [EARLY, DAY_DUTY, { ...LATE, active: false }] }), nurseId: 'n1', date: '2026-10-06' });
  assert.equal(onlyEarly.status, 'BLOCKED');
  assert.equal(onlyEarly.reasons.length, 1);
  assert.match(onlyEarly.reasons[0], /rest after the Late shift/);
});

test('a 7th working day in a row is blocked by the default limit', () => {
  const assignments = ['05', '06', '07', '08', '09', '10'].map((d) => cell(`2026-10-${d}`));
  const r = explainNurseDay({ ...input({ assignments }), nurseId: 'n1', date: '2026-10-11' });
  assert.equal(r.status, 'BLOCKED');
  assert.deepEqual(r.reasons, ['Would be 7 working days in a row; the limit is 6.']);
});

// The most hours rule set to "followed when possible", so hours alone don't block.
const softHoursLimit = { id: 'rule-h7-max-hours', name: 'Max hours', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: true, value: 105, severity: 'SOFT' } as unknown as Rule;

test('the most hours allowed blocks a shift that would go over it', () => {
  const assignments = ['05', '06', '07', '08', '09'].map((d) => cell(`2026-10-${d}`)); // 40 h, goal 40, limit 42
  const r = explainNurseDay({ ...input({ assignments }), nurseId: 'n1', date: '2026-10-10' });
  assert.equal(r.status, 'BLOCKED');
  assert.ok(r.reasons.some((x) => /most hours allowed/.test(x)));
});

test('a soft consecutive days rule only adds a note', () => {
  const assignments = ['05', '06', '07', '08', '09', '10'].map((d) => cell(`2026-10-${d}`));
  const rules = [{ id: 'rule-h2', name: 'Max consecutive working days', templateKey: 'MAX_CONSECUTIVE_DAYS', enabled: true, value: 6, severity: 'SOFT' } as unknown as Rule, softHoursLimit];
  const r = explainNurseDay({ ...input({ assignments, rules }), nurseId: 'n1', date: '2026-10-11' });
  assert.equal(r.status, 'AVAILABLE');
  assert.ok(r.notes.some((n) => /not ideal.*7 working days in a row/.test(n)));
});

test('a free nurse lists her shifts and hours, with a note when she is at her goal', () => {
  const assignments = ['05', '06', '07', '08', '09'].map((d) => cell(`2026-10-${d}`)); // 40 h
  const r = explainNurseDay({ ...input({ assignments, rules: [softHoursLimit] }), nurseId: 'n1', date: '2026-10-10' });
  assert.equal(r.status, 'AVAILABLE');
  assert.deepEqual(r.possibleShifts.map((s) => s.label), ['E', 'D', 'L']);
  assert.deepEqual(r.hours, { worked: 40, goal: 40, afterShift: 48 });
  assert.equal(r.possibleShifts.find((s) => s.label === 'L')?.hoursAfter, 50);
  assert.ok(r.notes.includes('Already at their hours goal (40 / 40 h); this shift would make 48 h.'));
});

test('explainDay lists free nurses first, most hours short first, then nurses who are off', () => {
  const nurses = [makeNurse('n1'), makeNurse('n2'), makeNurse('n3'), makeNurse('n4', { active: false })];
  const assignments = [cell('2026-10-05', 'n1'), cell('2026-10-05', 'n2'), cell('2026-10-06', 'n2'), cell('2026-10-07', 'n4')];
  const leaveEntries = [makeLeave({ nurseId: 'n3', startDate: '2026-10-07', endDate: '2026-10-07' })];
  const list = explainDay('2026-10-07', input({ nurses, assignments, leaveEntries }));
  assert.deepEqual(
    list.map((r) => [r.nurseId, r.status]),
    [
      ['n1', 'AVAILABLE'],
      ['n2', 'AVAILABLE'],
      ['n3', 'BLOCKED'],
    ]
  );
});
