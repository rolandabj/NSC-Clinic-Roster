import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';
import { timedFloatRelief, applySeparateFloatCover, type FloatCoverContext } from '../../src/services/engine/lowAcuityLastResort';
import { repairCoverage } from '../../src/services/engine/coverageRepair';
import { resolveClinicSetup } from '../../src/services/engine/clinicModel';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
const date = '2026-11-22';
const nurse = makeNurse('one');
const secondNurse = makeNurse('two');
const doctors = ['one', 'two'].map(id => ({ id, fullName: `Dr ${id}`, active: true, lowAcuity: true, specialtyIds: [], weeklyPattern: [] } as Doctor));
const sessions = doctors.map(d => ({ id: d.id, doctorId: d.id, date, startTime: '09:00', endTime: '17:00', source: 'MANUAL', cancelled: false } as DoctorSession));
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 });
const interval = (doctorId: string, startTime: string, endTime: string) => ({ doctorId, startTime, endTime });
const shift = (id: string, nurseId = nurse.id, extra: object = {}): Assignment => ({ id, nurseId, scheduleId: schedule.id, date,
  dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: 'one', locked: false, source: 'MANUAL', ...extra } as Assignment);
const check = (assignments: Assignment[], profiles = doctors, clinics = sessions, duties = [DAY_DUTY]) => ScheduleValidator.validate(
  schedule, assignments, [nurse, secondNurse], [SENIOR], duties, clinics, [], [], [], hoursOnlyRules(), [], [], profiles, [], { openTime: '09:00', closeTime: '17:00' });
const timingErrors = (report: ReturnType<typeof check>) => report.findings.filter(f => f.id.startsWith('doctor-cover-times-'));

test('explicit doctor intervals expose a minute boundary gap despite a full paid duty', () => {
  const report = check([shift('split', nurse.id, { doctorCoverage: [interval('one', '09:00', '13:15'), interval('one', '14:45', '17:00')] })], doctors, [sessions[0]]);
  const missing = report.findings.find(f => f.id === 'session-partial-one');
  assert.equal(missing?.amount, 1.5);
  assert.match(missing!.message, /13:15 to 14:45/);
  assert.equal(report.hourlyCoverageMap[date]['13:15'].uncoveredDoctors, 1);
  assert.equal(report.hourlyCoverageMap[date]['14:45'].coveredDoctors, 1);
  assert.equal(report.hourlyCoverageMap[date]['13:15'].freeNurses, 1);
});
test('sequential normal acuity doctors are valid and a touching handover has no duplicate cover', () => {
  const duty = { ...DAY_DUTY, endTime: '21:00' };
  const early = { ...DAY_DUTY, id: 'early', endTime: '19:00' };
  const clinics = [{ ...sessions[0], endTime: '19:00' }, { ...sessions[1], endTime: '21:00' }];
  const profiles = doctors.map(d => ({ ...d, lowAcuity: false }));
  const report = check([shift('sequential', nurse.id, { secondDoctorId: 'two', doctorCoverage: [interval('one', '09:00', '19:00'), interval('two', '19:00', '21:00')] }),
    shift('early', secondNurse.id, { doctorId: 'two', dutyWindowId: early.id, doctorCoverage: [interval('two', '09:00', '19:00')] })], profiles, clinics, [duty, early]);
  assert.ok(!report.findings.some(f => /^(low-acuity-pair-|low-acuity-float-|low-acuity-cover-|session-overlap-|session-partial-|unassigned-session-)/.test(f.id)), report.findings.map(f => f.message).join('\n'));
  assert.equal(report.hourlyCoverageMap[date]['09:00'].coveredDoctors, 2);
  assert.equal(report.findings.find(f => f.id === 'session-handover-two')?.amount, 0);
});
test('overlapping doctor intervals on one nurse count their coverage once', () => {
  const report = check([shift('duplicate', nurse.id, { doctorCoverage: [interval('one', '09:00', '13:15'), interval('one', '12:30', '17:00')] })], doctors, [sessions[0]]);
  assert.equal(timingErrors(report).length, 0);
  assert.equal(report.hourlyCoverageMap[date]['12:30']?.coveredDoctors ?? report.hourlyCoverageMap[date]['12:00'].coveredDoctors, 1);
  assert.ok(!report.findings.some(f => /^(session-partial-|session-overlap-|session-handover-)/.test(f.id)));
});
test('shared doctor notes describe the actual simultaneous interval', () => {
  const early = { ...DAY_DUTY, id: 'early', endTime: '13:15' };
  const report = check([shift('shared', nurse.id, { secondDoctorId: 'two', doctorCoverage: [interval('one', '09:00', '17:00'), interval('two', '13:15', '17:00')] }),
    shift('early', secondNurse.id, { doctorId: 'two', dutyWindowId: early.id, doctorCoverage: [interval('two', '09:00', '13:15')] })], doctors, sessions, [DAY_DUTY, early]);
  const note = report.findings.find(f => f.id === 'low-acuity-cover-shared');
  assert.equal(note?.severity, 'INFO');
  assert.match(note!.message, /13:15 to 17:00/);
});
test('explicit empty coverage does not fall back to the paid duty or create free nurse cover', () => {
  const report = check([shift('empty', nurse.id, { doctorCoverage: [] })], doctors, [sessions[0]]);
  assert.ok(timingErrors(report).some(f => f.severity === 'ERROR'));
  assert.equal(report.hourlyCoverageMap[date]['09:00'].coveredDoctors, 0);
  assert.equal(report.hourlyCoverageMap[date]['09:00'].freeNurses, 0);
});
test('invalid explicit times cannot provide doctor or Nurse Clinic cover', () => {
  for (const times of [[interval('one', '25:00', '26:00')], [interval('one', '08:30', '17:00')], [interval('other', '09:00', '17:00')]]) {
    const report = check([shift('invalid', nurse.id, { doctorCoverage: times })], doctors, [sessions[0]]);
    assert.ok(timingErrors(report).some(f => f.severity === 'ERROR'));
    assert.equal(report.hourlyCoverageMap[date]['09:00'].coveredDoctors, 0);
    assert.equal(report.hourlyCoverageMap[date]['09:00'].freeNurses, 0);
  }
});
test('partial Float relief leaves the exact remaining gap visible', () => {
  const report = check([shift('shared', nurse.id, { secondDoctorId: 'two', doctorCoverage: [interval('one', '09:00', '17:00'), interval('two', '13:00', '17:00')] }),
    shift('relief', secondNurse.id, { doctorId: 'two', doctorCoverage: [interval('two', '09:00', '12:30')] })]);
  const missing = report.findings.find(f => f.id === 'session-partial-two');
  assert.equal(missing?.amount, 0.5);
  assert.match(missing!.message, /12:30 to 13:00/);
});
test('legacy missing interval data retains whole duty cover and handover behavior', () => {
  const report = check([shift('legacy')], doctors, [sessions[0]]);
  assert.equal(timingErrors(report).length, 0);
  assert.equal(report.hourlyCoverageMap[date]['09:00'].coveredDoctors, 1);
  assert.ok(!report.findings.some(f => /^(session-partial-|unassigned-session-)/.test(f.id)));
});

const sharedPair = shift('shared-pair', nurse.id, { secondDoctorId: 'two', doctorCoverage: [interval('one', '09:00', '17:00'), interval('two', '13:15', '17:00')] });
const clinic = resolveClinicSetup({ openTime: '09:00', closeTime: '17:00' });
const floatContext = (assignments: Assignment[]): FloatCoverContext => ({ assignments, nurses: [nurse, secondNurse], doctors,
  specialties: [], sessions, duties: [DAY_DUTY], roles: [], leave: [], locks: [], requests: [], clinic, minFreeNurses: 0 });
test('timed Float diagnostics use residual free minutes without changing assignments', () => {
  const earlyDuty = { ...DAY_DUTY, id: 'early-duty', endTime: '15:15' };
  const third = { ...doctors[0], id: 'third', fullName: 'Dr third', lowAcuity: false };
  const thirdSession = { ...sessions[0], id: 'third', doctorId: third.id, endTime: '13:45' };
  const helper = shift('residual-float', secondNurse.id, { doctorId: third.id, dutyWindowId: earlyDuty.id, doctorCoverage: [interval(third.id, '09:00', '13:45')] });
  const context = { ...floatContext([sharedPair, helper]), doctors: [...doctors, third], sessions: [...sessions, thirdSession], duties: [DAY_DUTY, earlyDuty] };
  const before = JSON.stringify(context);
  const relief = timedFloatRelief(context, sharedPair);
  assert.deepEqual(relief.map(r => [r.doctorId, r.startTime, r.endTime, r.floatAssignment.id]), [['two', '13:45', '15:15', helper.id]]);
  assert.equal(JSON.stringify(context), before);
});
test('timed Float diagnostics do not consume the only qualified Nurse Clinic cover', () => {
  const candidate = shift('float', secondNurse.id, { kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'role-float' });
  const roles = ['NC', 'PHL'].map(acronym => ({ id: acronym, acronym, name: acronym, description: '', defaultDailyQuota: 0 }));
  const context = { ...floatContext([sharedPair, candidate]), roles, minFreeNurses: 1,
    nurses: [nurse, { ...secondNurse, capabilityIds: ['NC', 'PHL'] }] };
  assert.deepEqual(timedFloatRelief(context, sharedPair), []);
  const nc = makeNurse('nc', { capabilityIds: ['NC', 'PHL'] });
  const staffed = { ...context, nurses: [...context.nurses, nc], assignments: [...context.assignments,
    shift('dedicated-nc', nc.id, { kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'NC' })] };
  assert.deepEqual(timedFloatRelief(staffed, sharedPair).map(r => [r.startTime, r.endTime]), [['13:15', '17:00']]);
});
test('the Float mutation pass preserves retained manual timed pairs and timed Float candidates', () => {
  const float = shift('float', secondNurse.id, { kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'role-float' });
  const explicit = [sharedPair, float];
  assert.deepEqual(applySeparateFloatCover(floatContext(explicit), () => true), explicit);
  const legacyPair = shift('legacy-pair', nurse.id, { secondDoctorId: 'two' });
  const timedHelper = shift('timed-helper', secondNurse.id, { doctorId: 'one', doctorCoverage: [interval('one', '09:00', '13:00')] });
  const legacy = [legacyPair, timedHelper];
  assert.deepEqual(applySeparateFloatCover(floatContext(legacy), () => true), legacy);
});
test('the repair pass preserves a manual timed duty and its declared gap', async () => {
  const timed = shift('timed', nurse.id, { source: 'MANUAL', doctorCoverage: [interval('one', '09:00', '13:15')] });
  const assignments = [timed];
  const result = await repairCoverage({ assignments, dates: [date], sessions: [sessions[0]], nurses: [nurse], duties: [DAY_DUTY], roles: [], clinic,
    minFreeNurses: 0, movable: () => true, canWorkOnDate: () => true, canPair: () => true,
    validate: list => check(list, doctors, [sessions[0]]).findings });
  assert.deepEqual(result.assignments, assignments);
  assert.equal(result.repairedCount, 0);
});
test('a legacy pair cannot claim last resort when a timed duty supplies residual Float cover', () => {
  const third = { ...doctors[0], id: 'third', fullName: 'Dr third', lowAcuity: false };
  const thirdSession = { ...sessions[0], id: 'third', doctorId: third.id, endTime: '12:00' };
  const legacyPair = shift('legacy-pair', nurse.id, { secondDoctorId: 'two' });
  const timedHelper = shift('timed-helper', secondNurse.id, { doctorId: third.id, doctorCoverage: [interval(third.id, '09:00', '12:00')] });
  const report = check([legacyPair, timedHelper], [...doctors, third], [...sessions, thirdSession]);
  const finding = report.findings.find(f => f.id === 'low-acuity-float-legacy-pair');
  assert.equal(finding?.severity, 'ERROR');
  assert.match(finding!.message, /12:00 to 17:00/);
  assert.ok(!report.findings.some(f => f.id === 'low-acuity-cover-legacy-pair'));
});
