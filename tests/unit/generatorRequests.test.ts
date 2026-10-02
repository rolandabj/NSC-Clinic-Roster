import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { AvailabilityRequest, DoctorSession, DutyWindow, LeaveEntry, Nurse } from '../../src/types';

const LATE: DutyWindow = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00' };

function request(overrides: Partial<AvailabilityRequest>): AvailabilityRequest {
  return {
    id: 'req-1',
    nurseId: 'n1',
    date: '2026-10-07',
    available: true,
    status: 'APPROVED',
    submittedByNurseId: 'n1',
    submittedAt: '2026-09-01T00:00:00Z',
    ...overrides,
  };
}

function sessionsEveryDay(start: string, end: string, from = 5, to = 11): DoctorSession[] {
  const list: DoctorSession[] = [];
  for (let d = from; d <= to; d++) {
    const date = `2026-10-${String(d).padStart(2, '0')}`;
    list.push({ id: `s-${date}`, doctorId: 'doc1', date, startTime: start, endTime: end, source: 'PATTERN', cancelled: false } as DoctorSession);
  }
  return list;
}

async function run(opts: {
  nurses: Nurse[];
  sessions?: DoctorSession[];
  requests?: AvailabilityRequest[];
  leave?: LeaveEntry[];
  schedule?: ReturnType<typeof makeSchedule>;
}) {
  return SchedulingEngine.generate(
    opts.schedule || makeSchedule(),
    'GENERATE_ALL',
    [],
    opts.nurses,
    [SENIOR],
    [DAY_DUTY, LATE],
    [],
    [],
    opts.sessions || [],
    [],
    opts.leave || [],
    hoursOnlyRules(),
    undefined,
    [],
    [],
    [],
    { availabilityRequests: opts.requests }
  );
}

const shiftOn = (result: Awaited<ReturnType<typeof run>>, nurseId: string, date: string) =>
  result.assignments.find((a) => a.nurseId === nurseId && a.date === date);

test('an approved request for the Late shift is met when either shift would do (doctor session)', async () => {
  // A 13:00 to 17:00 session: Day and Late both cover it, so the request decides.
  const sessions = sessionsEveryDay('13:00', '17:00');
  const without = await run({ nurses: [makeNurse('n1')], sessions });
  assert.equal(shiftOn(without, 'n1', '2026-10-07')?.dutyWindowId, DAY_DUTY.id);

  const withRequest = await run({ nurses: [makeNurse('n1')], sessions, requests: [request({ preferredDutyWindowId: LATE.id })] });
  assert.equal(shiftOn(withRequest, 'n1', '2026-10-07')?.dutyWindowId, LATE.id);
  assert.equal(shiftOn(withRequest, 'n1', '2026-10-06')?.dutyWindowId, DAY_DUTY.id); // other days unchanged
  assert.equal(withRequest.requestsMet, 1);
  assert.equal(withRequest.requestsTotal, 1);
});

test('a requested shift is used for an extra (float) shift too', async () => {
  const oneDay = makeSchedule({ startDate: '2026-10-07', endDate: '2026-10-07', hoursTargetFullTime: 8 });
  const pending = await run({ nurses: [makeNurse('n1')], schedule: oneDay, requests: [request({ preferredDutyWindowId: LATE.id, status: 'PENDING' })] });
  assert.equal(shiftOn(pending, 'n1', '2026-10-07')?.dutyWindowId, LATE.id);
  const rejected = await run({ nurses: [makeNurse('n1')], schedule: oneDay, requests: [request({ preferredDutyWindowId: LATE.id, status: 'REJECTED' })] });
  assert.equal(shiftOn(rejected, 'n1', '2026-10-07')?.dutyWindowId, DAY_DUTY.id);
});

test('a nurse with pending leave is not scheduled that day when another nurse can cover', async () => {
  const sessions = sessionsEveryDay('09:00', '17:00');
  const nurses = [makeNurse('n1'), makeNurse('n2')];
  const leave = [makeLeave({ nurseId: 'n1', startDate: '2026-10-07', endDate: '2026-10-08', approved: false, status: 'PENDING' })];
  const result = await run({ nurses, sessions, leave });
  assert.equal(result.unmetSlotsCount, 0);
  for (const date of ['2026-10-07', '2026-10-08']) {
    assert.equal(shiftOn(result, 'n1', date), undefined, `n1 works on ${date}`);
    assert.equal(shiftOn(result, 'n2', date)?.kind, 'DOCTOR'); // the doctor still has a nurse
  }
  assert.equal(result.requestsMet, 1);
  assert.equal(result.requestsTotal, 1);
});

test('a pending day off request is kept when possible, but never leaves a doctor without a nurse', async () => {
  const sessions = sessionsEveryDay('09:00', '17:00');
  const dayOff = [request({ available: false, status: 'PENDING' })];
  const two = await run({ nurses: [makeNurse('n1'), makeNurse('n2')], sessions, requests: dayOff });
  assert.equal(shiftOn(two, 'n1', '2026-10-07'), undefined);
  assert.equal(two.unmetSlotsCount, 0);

  // Only one nurse: the request is soft, so she still covers the doctor.
  const one = await run({ nurses: [makeNurse('n1')], sessions, requests: dayOff });
  assert.equal(shiftOn(one, 'n1', '2026-10-07')?.kind, 'DOCTOR');
  assert.equal(one.requestsMet, 0);
});
