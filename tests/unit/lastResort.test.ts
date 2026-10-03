import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { LAST_RESORT_NOTE, isLastResortShift } from '../../src/services/engine/lastResort';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import type { DoctorSession, Rule } from '../../src/types';
import { ANNUAL_LEAVE, makeLeave, makeNurse, makeSchedule, SENIOR } from './fixtures';

const FULL = { id: 'd', name: '9-9', acronym: '9-9', startTime: '09:00', endTime: '21:00', color: '#000', active: true };
const PEDS = { id: 'sp-peds', name: 'Pediatrics', code: 'PEDS' };
const ENT = { id: 'sp-ent', name: 'ENT', code: 'ENT' };
const DR_PEDS = { id: 'doc-peds', fullName: 'Dr Peds', specialtyIds: [PEDS.id], weeklyPattern: [], active: true };
// Nurse Clinic, the free nurse and the senior rule are off: only the doctor matters here.
const RULES = [
  { id: 'rule-nurse-clinic', name: 'NC', templateKey: 'DEDICATED_NURSE_CLINIC', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-nurse-plus-one', name: 'Plus one', templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-h1', name: 'Senior', templateKey: 'SENIOR_ON_DUTY', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-h2', name: 'Maximum consecutive shifts', templateKey: 'MAX_CONSECUTIVE_DAYS', enabled: true, severity: 'HARD', value: 14 },
] as unknown as Rule[];

const session = (date: string): DoctorSession =>
  ({ id: `s-${date}`, doctorId: DR_PEDS.id, date, startTime: '09:00', endTime: '21:00', specialtyId: PEDS.id, source: 'PATTERN', cancelled: false }) as DoctorSession;
const dates = (n: number) => Array.from({ length: n }, (_, i) => `2026-11-${String(i + 1).padStart(2, '0')}`);

test('a doctor whose own nurse is on leave gets a nurse from outside her list, reported as Check', async () => {
  const date = '2026-11-03';
  const noor = makeNurse('noor', { preferences: [{ kind: 'SPECIALTY', refId: PEDS.id, rank: 1 }] });
  const amy = makeNurse('amy', { preferences: [{ kind: 'SPECIALTY', refId: ENT.id, rank: 1 }] });
  const rachel = makeNurse('rachel', { isClinicNurse: false, capabilityIds: [] }); // never with a doctor
  const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 12 });
  const leave = [makeLeave({ nurseId: 'noor', startDate: date, endDate: date })];
  const { assignments } = await SchedulingEngine.generate(
    schedule, 'GENERATE_ALL', [], [noor, amy, rachel], [SENIOR], [FULL], [], [PEDS, ENT], [session(date)], [], leave, RULES,
    undefined, [], [DR_PEDS] as any, [ANNUAL_LEAVE]
  );
  const withDoctor = assignments.filter((a) => a.doctorId === DR_PEDS.id);
  assert.equal(withDoctor.length, 1);
  assert.equal(withDoctor[0].nurseId, 'amy');
  assert.equal(withDoctor[0].note, LAST_RESORT_NOTE);
  assert.ok(isLastResortShift(withDoctor[0]));

  const report = ScheduleValidator.validate(
    schedule, assignments, [noor, amy, rachel], [SENIOR], [FULL] as any, [session(date)], leave, [], [], RULES, [], [PEDS, ENT], [DR_PEDS] as any, [ANNUAL_LEAVE]
  );
  const h8 = report.findings.filter((f) => f.id.startsWith('h8-doctor-allocation'));
  assert.equal(h8.length, 1);
  assert.equal(h8[0].severity, 'WARN');
  assert.ok(!report.findings.some((f) => f.id.startsWith('unassigned-session')));
});

test('a hand placed nurse outside her list is still a Must fix', () => {
  const date = '2026-11-03';
  const amy = makeNurse('amy', { preferences: [{ kind: 'SPECIALTY', refId: ENT.id, rank: 1 }] });
  const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 12 });
  const shift = { id: 'm', scheduleId: schedule.id, nurseId: 'amy', date, dutyWindowId: FULL.id, kind: 'DOCTOR', doctorId: DR_PEDS.id, locked: false, source: 'MANUAL' } as any;
  const report = ScheduleValidator.validate(schedule, [shift], [amy], [SENIOR], [FULL] as any, [session(date)], [], [], [], RULES, [], [PEDS, ENT], [DR_PEDS] as any, []);
  assert.equal(report.findings.find((f) => f.id.startsWith('h8-doctor-allocation'))?.severity, 'ERROR');
});

test('when his own nurse is short of hours, the missing sessions are spread over the roster', async () => {
  // Ten 12 hour Pediatrics sessions; Noor (the only Pediatrics nurse) has hours for six.
  const days = dates(10);
  const noor = makeNurse('noor', { preferences: [{ kind: 'SPECIALTY', refId: PEDS.id, rank: 1 }] });
  const helpers = ['amy', 'ben', 'cat'].map((id) => makeNurse(id, { preferences: [{ kind: 'SPECIALTY', refId: ENT.id, rank: 1 }] }));
  const schedule = makeSchedule({ startDate: days[0], endDate: days[9], hoursTargetFullTime: 72 });
  const { assignments } = await SchedulingEngine.generate(
    schedule, 'GENERATE_ALL', [], [noor, ...helpers], [SENIOR], [FULL], [], [PEDS, ENT], days.map(session), [], [], RULES,
    undefined, [], [DR_PEDS] as any, []
  );
  const noorDays = assignments.filter((a) => a.nurseId === 'noor' && a.doctorId === DR_PEDS.id).map((a) => a.date);
  const lastResortDays = assignments.filter((a) => a.doctorId === DR_PEDS.id && isLastResortShift(a)).map((a) => a.date);
  assert.equal(noorDays.length, 6, 'Noor works all her hours with her doctor');
  assert.equal(noorDays.length + lastResortDays.length, 10, 'every session has a nurse');
  // Not all at the end: some last resort days in the first half, and Noor works in the second half
  assert.ok(lastResortDays.some((d) => d <= days[4]), `last resort days: ${lastResortDays.join(', ')}`);
  assert.ok(noorDays.some((d) => d > days[4]), `Noor's days: ${noorDays.join(', ')}`);
});

test('a doctor\'s nurse who is behind her hours works on after his session (9-5 becomes 9-7, never 9-9)', async () => {
  const date = '2026-11-03';
  const NINE_FIVE = { id: 'n5', name: '9-5', acronym: '9-5', startTime: '09:00', endTime: '17:00', color: '#000', active: true };
  const NINE_SEVEN = { id: 'n7', name: '9-7', acronym: '9-7', startTime: '09:00', endTime: '19:00', color: '#000', active: true };
  const shortSession = { ...session(date), endTime: '17:00' } as DoctorSession;
  const shiftOfNoor = async (target: number) => {
    const noor = makeNurse('noor', { preferences: [{ kind: 'SPECIALTY', refId: PEDS.id, rank: 1 }] });
    const amy = makeNurse('amy', { preferences: [{ kind: 'SPECIALTY', refId: ENT.id, rank: 1 }] });
    const { assignments } = await SchedulingEngine.generate(
      makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: target }), 'GENERATE_ALL', [], [noor, amy], [SENIOR],
      [NINE_FIVE, NINE_SEVEN, FULL], [], [PEDS, ENT], [shortSession], [], [], RULES, undefined, [], [DR_PEDS] as any, []
    );
    return assignments.find((a) => a.nurseId === 'noor');
  };
  const behind = await shiftOfNoor(12);
  assert.equal(behind?.doctorId, DR_PEDS.id);
  assert.equal(behind?.dutyWindowId, NINE_SEVEN.id, 'she needs more hours: 9 to 7, but not a 9-9');
  const onTarget = await shiftOfNoor(8);
  assert.equal(onTarget?.dutyWindowId, NINE_FIVE.id, 'she needs 8 hours: 9 to 5 is enough');
});
