import test from 'node:test';
import assert from 'node:assert/strict';
import { waitingDayText, waitingLeaveText, decisionTitle } from '../../src/services/requests/waitingRequests';

const shifts = [{ id: 'd', name: 'D shift' }] as any[];

test('a waiting leave reads as its kind and its days, as DD-MM-YYYY', () => {
  assert.equal(waitingLeaveText({ leaveTypeName: 'Annual Leave', startDate: '2026-11-20', endDate: '2026-11-22' } as any), 'Annual Leave, Fri 20-11-2026 to Sun 22-11-2026');
  assert.equal(waitingLeaveText({ leaveTypeName: 'Birthday Leave', startDate: '2026-11-20', endDate: '2026-11-20' } as any), 'Birthday Leave, Fri 20-11-2026');
});

test('a waiting day reads as a day off or the shift wanted', () => {
  assert.equal(waitingDayText({ date: '2026-11-18', available: false } as any, shifts), 'Day off on Wed 18-11-2026');
  assert.equal(waitingDayText({ date: '2026-11-18', available: true, preferredDutyWindowId: 'd' } as any, shifts), 'Wants to work the D shift on Wed 18-11-2026');
  assert.equal(waitingDayText({ date: '2026-11-18', available: true } as any, shifts), 'Wants to work on Wed 18-11-2026');
});

test("the decision dialog's title names the decision and the nurse", () => {
  assert.equal(decisionTitle('APPROVED', 'Mary Lee'), "Approve Mary Lee's request?");
  assert.equal(decisionTitle('REJECTED', 'Mary Lee'), "Decline Mary Lee's request?");
});
