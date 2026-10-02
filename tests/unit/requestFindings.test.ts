import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, makeLeave, makeLock, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, AvailabilityRequest, LeaveEntry, LockEntry } from '../../src/types';

const LATE = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00' };
const schedule = makeSchedule(); // 5 to 11 Oct 2026

function shift(date: string, dutyWindowId = DAY_DUTY.id): Assignment {
  return { id: `n1-${date}`, scheduleId: schedule.id, nurseId: 'n1', date, dutyWindowId, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED' } as Assignment;
}

function request(overrides: Partial<AvailabilityRequest>): AvailabilityRequest {
  return { id: 'req-1', nurseId: 'n1', date: '2026-10-07', available: false, status: 'PENDING', submittedByNurseId: 'n1', submittedAt: '2026-09-01T00:00:00Z', ...overrides };
}

function wishFindings(assignments: Assignment[], requests: AvailabilityRequest[], leave: LeaveEntry[] = [], locks: LockEntry[] = []) {
  const nurse = makeNurse('n1', { fullName: 'Fatma Ali' });
  return ScheduleValidator.validate(schedule, assignments, [nurse], [SENIOR], [DAY_DUTY, LATE], [], leave, locks, [], [], [], [], [], [ANNUAL_LEAVE], undefined, requests).findings.filter(
    (f) => f.id.startsWith('request-') || f.id.startsWith('pending-leave-')
  );
}

test('a shift on a day the nurse asked off is a note, never blocking', () => {
  const found = wishFindings([shift('2026-10-07')], [request({})]);
  assert.equal(found.length, 1);
  assert.equal(found[0].severity, 'INFO');
  assert.equal(found[0].message, 'Fatma Ali asked for 07-10-2026 off (waiting for approval) but has a shift.');
  assert.deepEqual(found[0].cellRefs, [{ nurseId: 'n1', date: '2026-10-07' }]);

  // Refused requests and days without a shift say nothing.
  assert.equal(wishFindings([shift('2026-10-07')], [request({ status: 'REJECTED' })]).length, 0);
  assert.equal(wishFindings([shift('2026-10-06')], [request({})]).length, 0);
});

test('an approved day off is already a pinned day off, so it is not noted twice', () => {
  const lock = makeLock('n1', '2026-10-07', { mode: 'OFF', dutyWindowId: undefined });
  assert.equal(wishFindings([shift('2026-10-07')], [request({ status: 'APPROVED' })], [], [lock]).length, 0);
});

test('a shift on leave waiting for approval is a note; refused leave says nothing', () => {
  const pending = makeLeave({ startDate: '2026-10-07', endDate: '2026-10-07', approved: false, status: 'PENDING' });
  const found = wishFindings([shift('2026-10-07')], [], [pending]);
  assert.equal(found.length, 1);
  assert.equal(found[0].severity, 'INFO');
  assert.equal(found[0].message, 'Fatma Ali has Annual Leave waiting for approval on 07-10-2026 but has a shift.');

  const refused = { ...pending, status: 'REJECTED' as const };
  assert.equal(wishFindings([shift('2026-10-07')], [], [refused]).length, 0);
});

test('a shift asked for and not given is a note', () => {
  const late = request({ available: true, preferredDutyWindowId: LATE.id, status: 'APPROVED' });
  const other = wishFindings([shift('2026-10-07')], [late]);
  assert.equal(other.length, 1);
  assert.equal(other[0].severity, 'INFO');
  assert.equal(other[0].message, 'Fatma Ali asked for the Late shift on 07-10-2026 but has the Day shift.');

  const none = wishFindings([], [{ ...late, status: 'PENDING' }]);
  assert.equal(none[0].message, 'Fatma Ali asked for the Late shift on 07-10-2026 (waiting for approval) but has no shift.');

  assert.equal(wishFindings([shift('2026-10-07', LATE.id)], [late]).length, 0);
});

test('request notes never count as errors or warnings', () => {
  const nurse = makeNurse('n1');
  const base = ScheduleValidator.validate(schedule, [shift('2026-10-07')], [nurse], [SENIOR], [DAY_DUTY, LATE], [], [], [], [], []);
  const withWish = ScheduleValidator.validate(schedule, [shift('2026-10-07')], [nurse], [SENIOR], [DAY_DUTY, LATE], [], [], [], [], [], [], [], [], [], undefined, [request({})]);
  assert.equal(withWish.errorCount, base.errorCount);
  assert.equal(withWish.warnCount, base.warnCount);
  assert.equal(withWish.infoCount, base.infoCount + 1);
});
