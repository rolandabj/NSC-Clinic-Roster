import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAssignment, AssignmentCheckContext } from '../../src/services/engine/assignmentChecks';
import { DAY_DUTY, makeLeave, makeLock, makeNurse } from './fixtures';
import type { Assignment, Rule } from '../../src/types';

const LATE = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '23:00' };
const EARLY = { ...DAY_DUTY, id: 'duty-e', name: 'Early', acronym: 'E', startTime: '07:00', endTime: '15:00' };

function cell(date: string, nurseId = 'n1', dutyWindowId = DAY_DUTY.id, id = `${nurseId}-${date}`): Assignment {
  return { id, scheduleId: 's', nurseId, date, dutyWindowId, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'MANUAL' } as Assignment;
}

function ctx(assignments: Assignment[], extra: Partial<AssignmentCheckContext> = {}): AssignmentCheckContext {
  return {
    assignments,
    nurses: [makeNurse('n1'), makeNurse('n2')],
    dutyWindows: [DAY_DUTY, LATE, EARLY],
    leaveEntries: [],
    locks: [],
    roles: [],
    rules: [],
    ...extra,
  };
}

test('an allowed move has no problems', () => {
  const c = cell('2026-10-06');
  assert.deepEqual(checkAssignment(ctx([c]), c), []);
});

test('a second duty on the same day is refused', () => {
  const c = cell('2026-10-06');
  assert.equal(checkAssignment(ctx([cell('2026-10-06', 'n1', DAY_DUTY.id, 'other'), c]), c).length, 1);
});

test('approved leave and day off locks are refused', () => {
  const c = cell('2026-10-06');
  assert.equal(checkAssignment(ctx([c], { leaveEntries: [makeLeave({ startDate: '2026-10-06', endDate: '2026-10-06' })] }), c).length, 1);
  assert.equal(checkAssignment(ctx([c], { locks: [makeLock('n1', '2026-10-06', { mode: 'OFF' })] }), c).length, 1);
});

test('a 7th day in a row is refused by default (max 6)', () => {
  const week = ['05', '06', '07', '08', '09', '10'].map((d) => cell(`2026-10-${d}`));
  const seventh = cell('2026-10-11');
  assert.match(checkAssignment(ctx([...week, seventh]), seventh)[0], /7 days in a row/);
});

test('a switched off max consecutive days rule is not enforced', () => {
  const week = ['05', '06', '07', '08', '09', '10'].map((d) => cell(`2026-10-${d}`));
  const seventh = cell('2026-10-11');
  const rules = [{ id: 'rule-h2', name: 'Max consecutive working days', templateKey: 'MAX_CONSECUTIVE_DAYS', enabled: false, value: 6, severity: 'HARD' } as unknown as Rule];
  assert.deepEqual(checkAssignment(ctx([...week, seventh], { rules }), seventh), []);
});

test('less than 11h rest after a late duty is refused', () => {
  const late = cell('2026-10-05', 'n1', LATE.id); // ends 23:00
  const early = cell('2026-10-06', 'n1', EARLY.id); // starts 07:00 -> 8h rest
  assert.match(checkAssignment(ctx([late, early]), early)[0], /rest/);
});
