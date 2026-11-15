import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { DoctorSession, Nurse, Rule } from '../../src/types';

const dates = ['2026-12-16', '2026-12-17', '2026-12-18'];
const doc = (id: string) => ({ id, fullName: id, specialtyIds: [id], weeklyPattern: [], active: true });
const doctors = [doc('peds'), doc('general')];
const specialties = doctors.map(d => ({ id: d.id, name: d.id, code: d.id }));
const preference = (refId: string, rank = 1) => ({ kind: 'SPECIALTY' as const, refId, rank });
const session = (doctorId: string, date: string, endTime = '17:00'): DoctorSession =>
  ({ id: `${doctorId}-${date}`, doctorId, specialtyId: doctorId, date, startTime: '09:00', endTime, cancelled: false, source: 'MANUAL' } as DoctorSession);
const rules = [...hoursOnlyRules(), { id: 'h7', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', name: 'Hours limit', enabled: true, value: 100, severity: 'HARD' }] as Rule[];

async function fill(nurses: Nurse[], sessions: DoctorSession[], target = 16) {
  const schedule = makeSchedule({ startDate: dates[0], endDate: dates[2], hoursTargetFullTime: target });
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], nurses, [SENIOR], [DAY_DUTY], [],
    specialties, sessions, [], [], rules, undefined, [], doctors);
  const report = ScheduleValidator.validate(schedule, result.assignments, nurses, [SENIOR], [DAY_DUTY], sessions, [], [], [], rules, [], specialties, doctors);
  return { result, report };
}

test('a scarce early doctor session is covered before an easier late session uses its only nurse', async () => {
  const mary = makeNurse('mary', { preferences: [preference('general'), preference('peds', 2)] });
  const ben = makeNurse('ben', { preferences: [preference('general', 2)] });
  const date = dates[0];
  const { result, report } = await fill([mary, ben], [session('general', date), session('peds', date, '15:00')], 8);
  assert.equal(result.assignments.find(a => a.doctorId === 'peds')?.nurseId, 'mary');
  assert.equal(result.assignments.find(a => a.doctorId === 'general')?.nurseId, 'ben');
  assert.ok(!report.findings.some(f => f.id.startsWith('unassigned-session-')));
});

test('later pediatric sessions keep capacity even when a flexible nurse prefers earlier general sessions', async () => {
  const mary = makeNurse('mary', { preferences: [preference('general'), preference('peds', 2)] });
  const ben = makeNurse('ben', { preferences: [preference('general')] });
  const sessions = [session('general', dates[0]), session('general', dates[1]), session('peds', dates[1]), session('peds', dates[2])];
  const { result, report } = await fill([mary, ben], sessions);
  assert.equal(result.assignments.filter(a => a.nurseId === 'mary' && a.doctorId === 'peds').length, 2);
  assert.ok(!report.findings.some(f => /^(unassigned-session-|session-partial-|h8-doctor-allocation-)/.test(f.id)),
    report.findings.map(f => f.message).join('\n'));
});

test('a short Nurse Clinic duty leaves the last late cover option free of a doctor', async () => {
  const date = dates[0];
  const role = { id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 };
  const staff = [makeNurse('rachel', { isClinicNurse: false, contractPercent: 50, capabilityIds: [role.id] }),
    makeNurse('mary', { capabilityIds: [role.id], preferences: [preference('general')] }),
    makeNurse('ben', { preferences: [preference('general', 2)] })];
  const duties = [DAY_DUTY, { ...DAY_DUTY, id: 'short', endTime: '15:00' },
    { ...DAY_DUTY, id: 'late', startTime: '13:00', endTime: '21:00' },
    { ...DAY_DUTY, id: 'full', endTime: '21:00' }];
  const coverageRules = [rules[2],
    { id: 'rule-nurse-clinic', templateKey: 'DEDICATED_NURSE_CLINIC', name: 'Nurse Clinic', value: 1, severity: 'HARD', enabled: true },
    { id: 'rule-nurse-plus-one', templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', name: 'Free nurse', value: 1, severity: 'HARD', enabled: true }] as Rule[];
  const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 12 });
  const sessions = [session('general', date)];
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], staff, [SENIOR], duties, [role],
    specialties, sessions, [], [], coverageRules, undefined, [], doctors);
  const report = ScheduleValidator.validate(schedule, result.assignments, staff, [SENIOR], duties, sessions,
    [], [], [role], coverageRules, [], specialties, doctors);
  assert.ok(!report.findings.some(f => f.id.startsWith('cov-gap-')), report.findings.map(f => f.message).join('\n'));
  assert.equal(result.assignments.find(a => a.doctorId === 'general')?.nurseId, 'ben');
});


test('future leave is excluded when reserving the only available pediatric nurse for the last day', async () => {
  const staff = [makeNurse('mary', { preferences: [preference('general'), preference('peds', 2)] }),
    makeNurse('noor', { preferences: [preference('peds')] }),
    makeNurse('ben', { preferences: [preference('general')] })];
  const schedule = makeSchedule({ startDate: dates[0], endDate: dates[2], hoursTargetFullTime: 16 });
  const sessions = [session('general', dates[0]), session('general', dates[1]), session('peds', dates[1]), session('peds', dates[2])];
  const leave = [makeLeave({ nurseId: 'noor', startDate: dates[2], endDate: dates[2] })];
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], staff, [SENIOR], [DAY_DUTY], [],
    specialties, sessions, [], leave, rules, undefined, [], doctors, [ANNUAL_LEAVE]);
  const report = ScheduleValidator.validate(schedule, result.assignments, staff, [SENIOR], [DAY_DUTY], sessions,
    leave, [], [], rules, [], specialties, doctors, [ANNUAL_LEAVE]);
  assert.equal(result.assignments.find(a => a.date === dates[2] && a.doctorId === 'peds')?.nurseId, 'mary');
  assert.ok(!result.assignments.some(a => a.nurseId === 'noor' && a.date === dates[2]));
  assert.ok(!report.findings.some(f => /^(unassigned-session-|session-partial-|h8-doctor-allocation-)/.test(f.id)));
});
