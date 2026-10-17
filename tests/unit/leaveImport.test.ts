import test from 'node:test';
import assert from 'node:assert/strict';
import { planLeaveImport } from '../../src/services/availability/leaveImport';

// The leave CSV import (Phase 7, slice 1): each row checked as the leave editor checks a leave,
// with every refused row named and why.

const AL = { id: 'al', name: 'Annual Leave', acronym: 'AL', creditedHours: 8 } as any;
const SL = { id: 'sl', name: 'Sick Leave', acronym: 'SL', creditedHours: 8 } as any;
const nurses = [
  { id: 'amy', fullName: 'Amy', gmail: 'amy@example.com', leaveQuotas: { al: 5 } },
  { id: 'sara', fullName: 'Sara', gmail: 'Sara@Example.com', leaveQuotas: {} },
] as any[];
const data = (leaveEntries: any[] = [], locks: any[] = []) => ({ nurses, leaveTypes: [AL, SL], leaveEntries, locks });

test('rows are read with dates as DD-MM-YYYY or YYYY-MM-DD, and a header row is skipped', () => {
  const plan = planLeaveImport('email, kind, first day, last day\namy@example.com, AL, 12-10-2026, 13-10-2026\nSARA@example.com, sl, 2026-10-14, 2026-10-14', data());
  assert.deepEqual(plan.add.map((a) => [a.nurseId, a.leaveTypeId, a.startDate, a.endDate, a.days]), [
    ['amy', 'al', '2026-10-12', '2026-10-13', 2],
    ['sara', 'sl', '2026-10-14', '2026-10-14', 1],
  ]);
  assert.deepEqual(plan.messages, []);
});

test('each refused row is named with the reason', () => {
  const plan = planLeaveImport(
    [
      'amy@example.com, AL',
      'nobody@example.com, AL, 12-10-2026, 12-10-2026',
      'amy@example.com, XX, 12-10-2026, 12-10-2026',
      'amy@example.com, AL, 31-02-2026, 01-03-2026',
      'amy@example.com, AL, 14-10-2026, 12-10-2026',
      'sara@example.com, AL, 12-10-2026, 12-10-2026',
    ].join('\n'),
    data()
  );
  assert.equal(plan.add.length, 0);
  assert.deepEqual(plan.messages, [
    'Row 1: each row needs an email, a kind of leave, a first day and a last day.',
    'Row 2: no nurse has the email nobody@example.com.',
    'Row 3: no kind of leave is called XX.',
    'Row 4: 31-02-2026 is not a date. Write dates like 12-10-2026.',
    'Row 5: the last day is before the first day.',
    'Row 6: Sara has no Annual Leave allowance for 2026.',
  ]);
});

test('the rows of one import count together against the allowance', () => {
  // Amy has 5 days: 3 already taken, so 2 more fit; the second row would make 6.
  const taken = [{ id: 'x', nurseId: 'amy', leaveTypeId: 'al', startDate: '2026-02-02', endDate: '2026-02-04', status: 'APPROVED' }];
  const plan = planLeaveImport('amy@example.com, AL, 12-10-2026, 12-10-2026\namy@example.com, AL, 19-10-2026, 20-10-2026', data(taken));
  assert.deepEqual(plan.add.map((a) => a.startDate), ['2026-10-12']);
  assert.deepEqual(plan.messages, ['Row 2: Amy would have 6 Annual Leave days in 2026, but the allowance is 5.']);
});

test('a row over another leave or a pinned day, or over an earlier row, is refused', () => {
  const plan = planLeaveImport(
    'amy@example.com, SL, 15-10-2026, 16-10-2026\namy@example.com, SL, 18-10-2026, 18-10-2026\namy@example.com, SL, 20-10-2026, 21-10-2026\namy@example.com, SL, 21-10-2026, 21-10-2026',
    data([{ id: 'x', nurseId: 'amy', leaveTypeId: 'al', startDate: '2026-10-16', endDate: '2026-10-16', status: 'APPROVED' }], [{ nurseId: 'amy', date: '2026-10-18' }])
  );
  assert.deepEqual(plan.add.map((a) => a.startDate), ['2026-10-20']);
  assert.deepEqual(plan.messages, [
    'Row 1: Amy already has leave on Fri 16-10-2026.',
    'Row 2: Amy has a pinned day on Sun 18-10-2026. Remove the pin first.',
    'Row 4: Amy already has leave on Wed 21-10-2026.',
  ]);
});
