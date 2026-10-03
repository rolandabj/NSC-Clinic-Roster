import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { isLastResortShift } from '../../src/services/engine/lastResort';
import type { Assignment, DoctorSession, Rule } from '../../src/types';
import { makeNurse, makeSchedule, SENIOR } from './fixtures';

const FULL = { id: 'd', name: '9-9', acronym: '9-9', startTime: '09:00', endTime: '21:00', color: '#000', active: true };
const NINE_SEVEN = { id: 'n7', name: '9-7', acronym: '9-7', startTime: '09:00', endTime: '19:00', color: '#000', active: true };
const PCC = { id: 'sp-pcc', name: 'Primary Care', code: 'PCC' };
const PEDS = { id: 'sp-peds', name: 'Pediatrics', code: 'PEDS' };
const DR_PCC = { id: 'doc-pcc', fullName: 'Dr Ansam', specialtyIds: [PCC.id], weeklyPattern: [], active: true };
const DR_PEDS = { id: 'doc-peds', fullName: 'Dr Ahmad', specialtyIds: [PEDS.id], weeklyPattern: [], active: true };
const RULES = [
  { id: 'rule-nurse-clinic', name: 'NC', templateKey: 'DEDICATED_NURSE_CLINIC', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-nurse-plus-one', name: 'Plus one', templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-h1', name: 'Senior', templateKey: 'SENIOR_ON_DUTY', enabled: false, severity: 'SOFT', value: 0 },
] as unknown as Rule[];
const days = (n: number) => Array.from({ length: n }, (_, i) => `2026-11-${String(i + 1).padStart(2, '0')}`);
const session = (doctor: { id: string; specialtyIds: string[] }, date: string, endTime = '18:30') =>
  ({ id: `s-${doctor.id}-${date}`, doctorId: doctor.id, date, startTime: '09:00', endTime, specialtyId: doctor.specialtyIds[0], source: 'PATTERN', cancelled: false }) as DoctorSession;

test('nurses with the same first choice share his sessions evenly', async () => {
  // Twelve 9-7 Primary Care sessions and three nurses with Primary Care first, each with
  // hours for four of them (no floats).
  const list = days(12);
  const staff = ['mary', 'mervat', 'cheene'].map((id) => makeNurse(id, { preferences: [{ kind: 'SPECIALTY', refId: PCC.id, rank: 1 }] }));
  const { assignments } = await SchedulingEngine.generate(
    makeSchedule({ startDate: list[0], endDate: list[11], hoursTargetFullTime: 40 }), 'GENERATE_ALL', [], staff, [SENIOR],
    [NINE_SEVEN], [], [PCC], list.map((d) => session(DR_PCC, d)), [], [], RULES, undefined, [], [DR_PCC] as any, []
  );
  const counts = staff.map((n) => assignments.filter((a) => a.nurseId === n.id && a.doctorId === DR_PCC.id).length);
  assert.equal(counts.reduce((x, y) => x + y, 0), 12);
  assert.deepEqual(counts, [4, 4, 4], `sessions per nurse: ${counts.join(', ')}`);
});

test('a nurse already floating covers the hours a doctor\'s own nurse can\'t', async () => {
  // Dr Ahmad works 9 to 9. Noor (Pediatrics) may only work 9-7 (the 9-9 would take her over
  // her hours limit); Amy is floating 9-9 by hand and joins him for 7 to 9 pm.
  const date = '2026-11-03';
  const noor = makeNurse('noor', { contractPercent: 50, preferences: [{ kind: 'SPECIALTY', refId: PEDS.id, rank: 1 }] });
  const amy = makeNurse('amy', { preferences: [{ kind: 'SPECIALTY', refId: PCC.id, rank: 1 }] });
  const amyFloat = { id: 'f', scheduleId: 'sched-1', nurseId: 'amy', date, dutyWindowId: FULL.id, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED' } as Assignment;
  const hoursLimit = [...RULES, { id: 'rule-h7-max-hours', name: 'Hours', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: true, severity: 'HARD', value: 100 } as unknown as Rule];
  const { assignments } = await SchedulingEngine.generate(
    makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 20 }), 'EMPTY_ONLY', [amyFloat], [noor, amy], [SENIOR],
    [NINE_SEVEN, FULL], [], [PCC, PEDS], [session(DR_PEDS, date, '21:00')], [], [], hoursLimit, undefined, [], [DR_PEDS] as any, []
  );
  const withDoctor = assignments.filter((a) => a.doctorId === DR_PEDS.id);
  assert.deepEqual(withDoctor.map((a) => a.nurseId).sort(), ['amy', 'noor']);
  assert.ok(isLastResortShift(withDoctor.find((a) => a.nurseId === 'amy')!));
});
