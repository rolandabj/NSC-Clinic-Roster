import test from 'node:test';
import assert from 'node:assert/strict';
import { allowanceDays } from '../../src/services/hours/leaveAllowance';

// The owner's rule (14-10-2026): an allowance is always in days; the hours of each leave day are
// set on their own and never change the allowance.

test('an allowance is read as the days typed, whatever the number', () => {
  assert.equal(allowanceDays(30), 30);
  assert.equal(allowanceDays(48), 48, 'it was read as 6 when large multiples of 8 were taken for hours');
  assert.equal(allowanceDays(56), 56);
  assert.equal(allowanceDays(240), 240);
});

test('no allowance, or zero, means no limit set', () => {
  assert.equal(allowanceDays(undefined), null);
  assert.equal(allowanceDays(0), null);
  assert.equal(allowanceDays(-3), null);
  assert.equal(allowanceDays('30' as any), null);
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
