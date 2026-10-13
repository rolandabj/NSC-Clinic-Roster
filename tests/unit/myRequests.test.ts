import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDayRequest, checkLeaveRequest, myRequestList } from '../../src/services/requests/myRequests';
import { ANNUAL_LEAVE, DAY_DUTY, makeLeave } from './fixtures';
import type { AvailabilityRequest, LeaveEntry } from '../../src/types';

// A nurse's own requests on a phone (UI overhaul Phase 5, slice 2): upcoming ones first with a
// clear Waiting, Approved or Declined and the reviewer's note, past ones kept apart, and checks
// before a request is sent.

const TODAY = '2026-11-10';
const leave = (extra: Partial<LeaveEntry>) => makeLeave({ id: 'l1', nurseId: 'mary', startDate: '2026-11-20', endDate: '2026-11-22', ...extra });
const day = (extra: Partial<AvailabilityRequest>) =>
  ({ id: 'd1', nurseId: 'mary', date: '2026-11-18', available: false, status: 'PENDING', ...extra }) as AvailabilityRequest;

test('requests are listed by date in words, with their status and the reviewer\'s note', () => {
  const list = myRequestList(
    [
      leave({ id: 'l1', approved: true, status: 'APPROVED', reviewedByUserName: 'Pat', reviewNotes: 'Enjoy it.' }),
      leave({ id: 'l2', startDate: '2026-11-01', endDate: '2026-11-02', approved: false, status: 'REJECTED' }),
    ],
    [day({}), day({ id: 'd2', date: '2026-11-25', available: true, preferredDutyWindowId: DAY_DUTY.id, status: 'REJECTED', reviewedByUserName: 'Pat', reviewNotes: 'Full that day.' })],
    TODAY,
    [ANNUAL_LEAVE],
    [DAY_DUTY]
  );
  assert.deepEqual(
    list.upcoming.map((r) => `${r.what} | ${r.when} | ${r.status}${r.reviewNote ? ` | ${r.reviewer}: ${r.reviewNote}` : ''}${r.canCancel ? ' | can cancel' : ''}`),
    [
      'Day off | 18-11-2026 | Waiting | can cancel',
      'Annual Leave | 20-11-2026 to 22-11-2026 | Approved | Pat: Enjoy it.',
      'Day shift wanted | 25-11-2026 | Declined | Pat: Full that day.',
    ]
  );
  assert.deepEqual(list.past.map((r) => `${r.what} | ${r.status}`), ['Annual Leave | Declined']);
});

test('leave: the dates must be given, in order, and not already passed', () => {
  assert.deepEqual(checkLeaveRequest({ startDate: '', endDate: '' }, TODAY, []), { startDate: 'Enter the first day, like 18-11-2026.', endDate: 'Enter the last day, like 18-11-2026.' });
  assert.deepEqual(checkLeaveRequest({ startDate: '2026-11-20', endDate: '2026-11-19' }, TODAY, []), { endDate: 'The last day is before the first day.' });
  assert.deepEqual(checkLeaveRequest({ startDate: '2026-11-09', endDate: '2026-11-12' }, TODAY, []), { startDate: 'The first day has passed. Choose today or a later day.' });
  assert.deepEqual(checkLeaveRequest({ startDate: '2026-11-15', endDate: '2026-11-16' }, TODAY, []), {});
});

test('leave: days already asked for (waiting or approved) are refused, declined ones are not', () => {
  const existing = [leave({ status: 'PENDING', approved: false }), leave({ id: 'l9', startDate: '2026-12-01', endDate: '2026-12-01', status: 'REJECTED', approved: false })];
  assert.deepEqual(checkLeaveRequest({ startDate: '2026-11-21', endDate: '2026-11-25' }, TODAY, existing), {
    startDate: 'You already asked for leave from 20-11-2026 to 22-11-2026.',
  });
  assert.deepEqual(checkLeaveRequest({ startDate: '2026-12-01', endDate: '2026-12-01' }, TODAY, existing), {});
});

test('a day off or a shift: the day must be given, not passed, and not already asked for', () => {
  assert.deepEqual(checkDayRequest({ date: '' }, TODAY, []), { date: 'Enter the day, like 18-11-2026.' });
  assert.deepEqual(checkDayRequest({ date: '2026-11-09' }, TODAY, []), { date: 'This day has passed. Choose today or a later day.' });
  assert.deepEqual(checkDayRequest({ date: '2026-11-18' }, TODAY, [day({})]), { date: 'You already asked about 18-11-2026. Cancel that request first to change it.' });
  assert.deepEqual(checkDayRequest({ date: '2026-11-18' }, TODAY, [day({ status: 'REJECTED' })]), {});
});
