import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { calculateDutyDurationHours } from '../../src/services/reports/hoursAccounting';
import {
  ANNUAL_LEAVE,
  DAY_DUTY,
  SENIOR,
  hoursOnlyRules,
  makeLeave,
  makeLock,
  makeNurse,
  makeSchedule,
} from './fixtures';
import type { LeaveEntry, LockEntry } from '../../src/types';

async function generate(locks: LockEntry[] = [], leave: LeaveEntry[] = []) {
  return SchedulingEngine.generate(
    makeSchedule(),
    'GENERATE_ALL',
    [],
    [makeNurse('n1')],
    [SENIOR],
    [DAY_DUTY],
    [],
    [],
    [],
    locks,
    leave,
    hoursOnlyRules(),
    undefined,
    [],
    [],
    [ANNUAL_LEAVE]
  );
}

function dutyHours(result: Awaited<ReturnType<typeof generate>>) {
  return result.assignments.reduce((sum) => sum + calculateDutyDurationHours(DAY_DUTY), 0);
}

test('baseline: a full time nurse is filled up to the 40h week', async () => {
  const result = await generate();
  assert.equal(dutyHours(result), 40);
});

test('pinned shifts are not counted twice against the hours cap', async () => {
  const locks = [makeLock('n1', '2026-10-05'), makeLock('n1', '2026-10-06')];
  const result = await generate(locks);
  // 2 pinned + 3 generated shifts = 40h. Counting the pinned shifts twice stopped at 24h.
  assert.equal(dutyHours(result), 40);
});

test('leave is taken off the duty target once, not twice', async () => {
  const leave = [makeLeave({ startDate: '2026-10-05', endDate: '2026-10-06', hoursCredited: 16 })];
  const result = await generate([], leave);
  // 40h target minus 16h leave = 24h of duty. Subtracting leave twice gave 8h.
  assert.equal(dutyHours(result), 24);
  assert.ok(result.assignments.every((a) => a.date !== '2026-10-05' && a.date !== '2026-10-06'));
});

test('a day off lock is respected by the float pool', async () => {
  const off = makeLock('n1', '2026-10-07', { mode: 'OFF', dutyWindowId: undefined });
  const result = await generate([off]);
  assert.ok(result.assignments.every((a) => a.date !== '2026-10-07'));
});

test('the engine never changes the assignments it was given', async () => {
  const LATE = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '11:00', endTime: '21:00' };
  const existing = Object.freeze({
    id: 'g1',
    scheduleId: 'sched-1',
    nurseId: 'n1',
    date: '2026-10-05',
    dutyWindowId: DAY_DUTY.id,
    kind: 'CLINICAL_ROLE',
    clinicalRoleId: 'role-float',
    locked: false,
    source: 'GENERATED',
  }) as any;
  // A doctor working until 21:00 makes the +1 coverage step want to extend the 17:00 duty.
  const session = {
    id: 's1',
    doctorId: 'doc1',
    date: '2026-10-05',
    startTime: '09:00',
    endTime: '21:00',
    specialtyId: 'sp',
    source: 'PATTERN',
    cancelled: false,
  } as any;
  const rules = hoursOnlyRules().map((r) =>
    r.id === 'rule-nurse-plus-one' ? ({ ...r, enabled: true, severity: 'HARD', value: 1 } as any) : r
  );
  await SchedulingEngine.generate(
    makeSchedule(),
    'EMPTY_ONLY',
    [existing],
    [makeNurse('n1')],
    [SENIOR],
    [DAY_DUTY, LATE],
    [],
    [],
    [session],
    [],
    [],
    rules,
    undefined,
    [],
    [{ id: 'doc1', fullName: 'Dr One', specialtyIds: ['sp'], weeklyPattern: [], active: true } as any],
    [ANNUAL_LEAVE]
  );
  assert.equal(existing.dutyWindowId, DAY_DUTY.id);
});
