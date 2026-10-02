import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leaveCreditInRange, leaveCreditOnDate } from '../../src/services/hours/hoursPolicy';
import { summarizeNurseHours, calculateDutyDurationHours } from '../../src/services/reports/hoursAccounting';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ANNUAL_LEAVE, UNPAID_LEAVE, DAY_DUTY, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, LeaveType } from '../../src/types';

const week = makeSchedule({ hoursTargetFullTime: 40 }); // 5 to 11 Oct 2026

test("a leave day counts the leave type's hours from Settings, even if they change later", () => {
  const leave = makeLeave({ startDate: '2026-10-05', endDate: '2026-10-07', hoursCredited: 24 });
  assert.equal(leaveCreditInRange(leave, ANNUAL_LEAVE, '2026-10-05', '2026-10-11'), 24);
  const changed = { ...ANNUAL_LEAVE, creditedHours: 7.5 } as LeaveType;
  assert.equal(leaveCreditInRange(leave, changed, '2026-10-05', '2026-10-11'), 22.5);
});

test('hours set for one day replace the default for that day only', () => {
  const leave = makeLeave({ startDate: '2026-10-05', endDate: '2026-10-07', dayHours: { '2026-10-06': 6 } });
  assert.equal(leaveCreditOnDate(leave, ANNUAL_LEAVE, '2026-10-06'), 6);
  assert.equal(leaveCreditOnDate(leave, ANNUAL_LEAVE, '2026-10-05'), 8);
  assert.equal(leaveCreditInRange(leave, ANNUAL_LEAVE, '2026-10-05', '2026-10-11'), 22);
  // Only the part inside the range counts.
  assert.equal(leaveCreditInRange(leave, ANNUAL_LEAVE, '2026-10-06', '2026-10-06'), 6);
  // Leave that doesn't count toward the goal stays at 0.
  assert.equal(leaveCreditInRange(leave, UNPAID_LEAVE, '2026-10-05', '2026-10-11'), 0);
});

const shift = (date: string, extra: Partial<Assignment> = {}) =>
  ({ id: `a-${date}-${extra.id || ''}`, scheduleId: week.id, nurseId: 'n1', date, dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', locked: false, source: 'MANUAL', ...extra }) as Assignment;

test('a nurse is counted the same way everywhere: leave beats a shift on the same day, duplicates count once', () => {
  const nurse = makeNurse('n1', { contractPercent: 50 });
  const assignments = [shift('2026-10-05'), shift('2026-10-05', { id: 'dup' }), shift('2026-10-06'), shift('2026-10-07')];
  const leave = [makeLeave({ startDate: '2026-10-07', endDate: '2026-10-07', dayHours: { '2026-10-07': 6 } })];
  const h = summarizeNurseHours(nurse, week, assignments, [DAY_DUTY], leave, [ANNUAL_LEAVE]);
  assert.equal(h.dutyHours, 16); // two 8 h days
  assert.equal(h.leaveHours, 6);
  assert.equal(h.totalHours, 22);
  assert.equal(h.targetHours, 20); // 50% of 40
  assert.equal(h.percent, 110);
});

test('a shift whose type was deleted counts nothing', () => {
  assert.equal(calculateDutyDurationHours(undefined), 0);
  const h = summarizeNurseHours(makeNurse('n1'), week, [shift('2026-10-05', { dutyWindowId: 'gone' })], [DAY_DUTY], [], []);
  assert.equal(h.totalHours, 0);
});

// The Nurse Clinic job: a nurse who is a doctor's first choice goes to that doctor while
// someone else can run Nurse Clinic, and nobody is taken over her goal while another fits.
const PHL = { id: 'role-phl', name: 'Blood collection', acronym: 'PHL', defaultDailyQuota: 1, description: '' };
const NC = { id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', defaultDailyQuota: 1, description: '' };
const SENIOR = { id: 'sen', name: 'Senior', rank: 1, isSenior: true, color: '#000000' };
const E = { id: 'e', name: 'Early', acronym: 'E', startTime: '09:00', endTime: '17:00', color: '#000000', active: true };
const L = { id: 'l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00', color: '#000000', active: true };
const D = { id: 'd', name: 'Full', acronym: 'D', startTime: '09:00', endTime: '21:00', color: '#000000', active: true };

test("a doctor's first choice nurse isn't sent to Nurse Clinic when someone else can run it", async () => {
  const both = makeNurse('p', {
    seniorityLevelId: SENIOR.id,
    capabilityIds: [PHL.id, NC.id],
    preferences: [
      { kind: 'CLINICAL_ROLE', refId: NC.id, rank: 1 },
      { kind: 'DOCTOR', refId: 'docA', rank: 1 },
    ],
  });
  const other = makeNurse('q', { seniorityLevelId: SENIOR.id, capabilityIds: [PHL.id, NC.id] });
  const day = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-05', hoursTargetFullTime: 12 });
  const result = await SchedulingEngine.generate(
    day,
    'GENERATE_ALL',
    [],
    [both, other],
    [SENIOR],
    [D, E, L],
    [PHL, NC] as any,
    [],
    [{ id: 's', doctorId: 'docA', date: '2026-10-05', startTime: '09:00', endTime: '17:00', specialtyId: 'x', source: 'PATTERN', cancelled: false }] as any,
    [],
    [],
    [],
    undefined,
    [],
    [{ id: 'docA', fullName: 'Dr A', specialtyIds: [], weeklyPattern: [], active: true }] as any,
    []
  );
  const withDoctor = result.assignments.find((a) => a.kind === 'DOCTOR');
  assert.equal(withDoctor?.nurseId, 'p');
  assert.equal(result.doctorPriority1PairingsCount, 1);
});

test('the generator gives the same roster whatever order the shifts are listed in', async () => {
  const nurses = ['a', 'b', 'c', 'd'].map((id) => makeNurse(id, { seniorityLevelId: SENIOR.id, capabilityIds: [PHL.id, NC.id] }));
  const run = (duties: any[]) =>
    SchedulingEngine.generate(makeSchedule({ hoursTargetFullTime: 40 }), 'GENERATE_ALL', [], nurses, [SENIOR], duties, [PHL, NC] as any, [], [], [], [], [], undefined, [], [], []);
  const a = await run([D, E, L]);
  const b = await run([L, E, D]);
  const key = (r: any) => r.assignments.map((x: any) => `${x.nurseId}${x.date}${x.dutyWindowId}`).sort().join(',');
  assert.equal(key(a), key(b));
});

test('filling only some dates places no shift outside them', async () => {
  const nurses = ['a', 'b', 'c'].map((id) => makeNurse(id));
  const result = await SchedulingEngine.generate(
    week, 'GENERATE_ALL', [], nurses, [], [DAY_DUTY], [], [], [], [], [], [], undefined, [], [], [], undefined,
    { onlyDates: { start: '2026-10-08', end: '2026-10-09' } }
  );
  assert.ok(result.assignments.length > 0);
  assert.ok(result.assignments.every((a) => a.date >= '2026-10-08' && a.date <= '2026-10-09'));
});
