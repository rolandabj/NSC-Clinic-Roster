import test from 'node:test';
import assert from 'node:assert/strict';
import { allowanceFor, takesAllowance } from '../../src/services/hours/leaveAllowance';

// The owner's rule (14-10-2026): an allowance is always in days; the hours of each leave day are
// set on their own and never change the allowance.

const AL = { id: 'al', name: 'Annual Leave', acronym: 'AL', creditedHours: 8 } as any;
const SICK = { id: 'sl', name: 'Sick Leave', acronym: 'SL', creditedHours: 8 } as any;
const DAY_OFF = { id: 'do', name: 'DO', acronym: 'DO', creditedHours: 0 } as any;
const nurseWith = (leaveQuotas?: Record<string, number>) => ({ id: 'mary', leaveQuotas }) as any;

test('an allowance is read as the days typed, whatever the number', () => {
  assert.equal(allowanceFor(nurseWith({ al: 30 }), AL), 30);
  assert.equal(allowanceFor(nurseWith({ al: 48 }), AL), 48, 'it was read as 6 when large multiples of 8 were taken for hours');
  assert.equal(allowanceFor(nurseWith({ al: 240 }), AL), 240);
});

test("the owner's rule of 17-10-2026: an allowance left empty or set to 0 is 0 days", () => {
  assert.equal(allowanceFor(nurseWith({ al: 0 }), AL), 0);
  assert.equal(allowanceFor(nurseWith({}), AL), 0);
  assert.equal(allowanceFor(nurseWith(undefined), AL), 0);
});

test('sick leave and the kinds without an allowance box (day off, 0 hours) have no limit', () => {
  assert.equal(allowanceFor(nurseWith({}), SICK), null);
  assert.equal(allowanceFor(nurseWith({ do: 5 }), DAY_OFF), null);
  assert.equal(takesAllowance(AL), true);
  assert.equal(takesAllowance(SICK), false);
  assert.equal(takesAllowance(DAY_OFF), false);
});

test("a nurse's leave request respects an allowance of 48 days, and the leave's hours do not count against it", async (t) => {
  const { repositoryManager } = await import('../../src/services/repository');
  const { submitLeaveRequest } = await import('../../src/services/requests/staffRequestService');
  const created: any[] = [];
  const repo = {
    list: async (c: string) =>
      c === 'leaveTypes'
        ? [{ id: 'al', name: 'Annual Leave', acronym: 'AL', creditedHours: 6 }]
        : c === 'leaveEntries'
          ? [{ id: 'x', nurseId: 'mary', leaveTypeId: 'al', startDate: '2026-02-01', endDate: '2026-02-10', status: 'APPROVED' }]
          : [],
    get: async () => ({ id: 'mary', fullName: 'Mary', leaveQuotas: { al: 48 } }),
    create: async (_c: string, d: any) => (created.push(d), d),
    update: async () => {},
    remove: async () => {},
  };
  const previous = (repositoryManager as any).activeRepo;
  (repositoryManager as any).activeRepo = repo;
  t.after(() => { (repositoryManager as any).activeRepo = previous; });
  const nurse = { uid: 'u4', role: 'VIEWER', linkedNurseId: 'mary' } as any;

  // 10 days used of 48: 5 more fit (with the old rule the allowance read as 6 and this failed).
  await submitLeaveRequest(nurse, { leaveTypeId: 'al', startDate: '2026-11-02', endDate: '2026-11-06' });
  assert.equal(created.length, 1);
  // 10 used, 39 more would make 49 of 48: refused, counted in days.
  await assert.rejects(submitLeaveRequest(nurse, { leaveTypeId: 'al', startDate: '2026-03-01', endDate: '2026-04-08' }), /10 of 48 Annual Leave days/);
});

test('a leave request is refused when the nurse has no allowance for that kind of leave', async (t) => {
  const { repositoryManager } = await import('../../src/services/repository');
  const { submitLeaveRequest } = await import('../../src/services/requests/staffRequestService');
  const repo = {
    list: async (c: string) => (c === 'leaveTypes' ? [{ id: 'al', name: 'Annual Leave', acronym: 'AL', creditedHours: 8 }, { id: 'sl', name: 'Sick Leave', acronym: 'SL', creditedHours: 8 }] : []),
    get: async () => ({ id: 'mary', fullName: 'Mary', leaveQuotas: {} }),
    create: async (_c: string, d: any) => d,
    update: async () => {},
    remove: async () => {},
  };
  const previous = (repositoryManager as any).activeRepo;
  (repositoryManager as any).activeRepo = repo;
  t.after(() => { (repositoryManager as any).activeRepo = previous; });
  const nurse = { uid: 'u4', role: 'VIEWER', linkedNurseId: 'mary' } as any;
  await assert.rejects(submitLeaveRequest(nurse, { leaveTypeId: 'al', startDate: '2026-11-02', endDate: '2026-11-02' }), /no Annual Leave allowance/);
  // Sick leave has no limit.
  await assert.doesNotReject(submitLeaveRequest(nurse, { leaveTypeId: 'sl', startDate: '2026-11-03', endDate: '2026-11-03' }));
});

test('the hours report shows only the allowances set: none set is 0 days, never a made up 30', async () => {
  const { calculateNurseHoursAccounting } = await import('../../src/services/reports/hoursAccounting');
  const { makeNurse, makeSchedule, DAY_DUTY, SENIOR } = await import('./fixtures');
  const report = calculateNurseHoursAccounting(makeNurse('n1', { leaveQuotas: {} }), makeSchedule(), [], [DAY_DUTY], [], [{ ...AL, active: true }, { ...SICK, active: true }], [SENIOR], [], [], []);
  assert.deepEqual(report.quotas.map((q: any) => [q.leaveTypeName, q.annualQuotaDays]), [['Annual Leave', 0]]);
});
