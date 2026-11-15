import { test } from 'node:test';
import assert from 'node:assert/strict';
import { outsideNurseList } from '../../src/services/engine/nurseList';
import { approveAllocation, hasAllocationReview } from '../../src/services/engine/allocationReview';
import { pendingAllocationReviews, publicationReport } from '../../src/services/publish/publicationChecks';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, ClinicalRole, Doctor, DoctorSession, DutyWindow, Rule } from '../../src/types';
const date = '2026-10-05';
const doctors = ['one', 'two'].map(id => ({ id, fullName: id, specialtyIds: [], weeklyPattern: [], active: true, lowAcuity: true } as Doctor));
const sessions = doctors.map(d => ({ id: d.id, doctorId: d.id, date, startTime: '09:00', endTime: '17:00', cancelled: false, source: 'MANUAL' } as DoctorSession));
const refs = { doctors, sessions, specialties: [] };
const eligibility = { doctorIds: ['one'], specialtyIds: [], reviewedAt: '2026-11-15T10:00:00Z', reviewedBy: 'lead' };
const nurse = makeNurse('n', { doctorEligibility: eligibility });
const pair: Assignment = { id: 'a', scheduleId: 'sched-1', nurseId: 'n', date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: 'one', secondDoctorId: 'two', source: 'MANUAL', locked: false };
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 });
function check(assignments: Assignment[], allSessions = sessions, nurses = [nurse]) {
  return ScheduleValidator.validate(schedule, assignments, nurses, [SENIOR], [DAY_DUTY], allSessions, [], [], [], hoursOnlyRules(), [], [], doctors);
}
test('reviewed eligibility checks both doctors and cannot be bypassed by an exception note', () => {
  assert.equal(outsideNurseList(nurse, pair, refs)?.name, 'two');
  const a = { ...pair, note: 'Agreed exception: confirmed' };
  const report = publicationReport(check([a]), [a], [nurse], refs);
  assert.ok(report.findings.some(f => f.id.startsWith('h8-doctor-allocation-') && f.severity === 'ERROR'));
});
test('adding, changing or removing a second doctor invalidates the exact pairing review', () => {
  const single = { ...pair, secondDoctorId: undefined };
  const review = approveAllocation(single, 'lead', 'Reviewed', '2026-11-15T10:00:00Z');
  assert.ok(hasAllocationReview({ ...single, allocationReview: review }), 'single doctor reviews remain valid');
  assert.ok(!hasAllocationReview({ ...pair, allocationReview: review }));
  const pairReview = approveAllocation(pair, 'lead', 'Both checked', '2026-11-15T10:00:00Z');
  assert.ok(hasAllocationReview({ ...pair, allocationReview: pairReview }));
  assert.ok(!hasAllocationReview({ ...single, allocationReview: pairReview }));
  assert.ok(!hasAllocationReview({ ...pair, secondDoctorId: 'other', allocationReview: pairReview }));
});
test('a legacy exception review identifies both doctors in the paired shift', () => {
  const legacy = makeNurse('n', { preferences: [{ kind: 'DOCTOR', refId: 'other', rank: 1 }] });
  assert.equal(pendingAllocationReviews([pair], [legacy], refs)[0]?.pairingName, 'one and two');
});
test('both doctors receive exact cover and a second doctor partial gap blocks publication', () => {
  const approved = makeNurse('n', { doctorEligibility: { ...eligibility, doctorIds: ['one', 'two'] } });
  const full = check([pair], sessions, [approved]);
  assert.equal(full.findings.filter(f => /^(session-partial-|unassigned-session-)/.test(f.id)).length, 0);
  assert.equal(full.hourlyCoverageMap[date]['09:00'].coveredDoctors, 2);
  const longer = sessions.map(s => s.doctorId === 'two' ? { ...s, endTime: '19:00' } : s);
  const report = publicationReport(check([pair], longer, [approved]), [pair], [approved], { ...refs, sessions: longer });
  const gap = report.findings.find(f => f.id === 'session-partial-two');
  assert.equal(gap?.severity, 'ERROR'); assert.equal(gap?.amount, 2);
});
test('a second doctor with a cancelled clinic blocks publication', () => {
  const approved = makeNurse('n', { doctorEligibility: { ...eligibility, doctorIds: ['one', 'two'] } });
  const cancelled = [sessions[0], { ...sessions[1], cancelled: true }];
  const report = publicationReport(check([pair], cancelled, [approved]), [pair], [approved], { ...refs, sessions: cancelled });
  assert.ok(report.findings.some(f => f.id.startsWith('doctor-not-in-clinic-') && f.severity === 'ERROR'));
});
test('generator never shares a nurse with a second doctor outside reviewed eligibility', async () => {
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], [nurse], [SENIOR], [DAY_DUTY], [], [], sessions, [], [], hoursOnlyRules(), undefined, [], doctors);
  assert.ok(!result.assignments.some(a => a.doctorId === 'two' || a.secondDoctorId === 'two'));
});
test('pairing cannot widen a duty past the nurse hours budget or alter a kept manual duty', async () => {
  const short: DutyWindow = { ...DAY_DUTY, id: 'short', startTime: '09:00', endTime: '13:00' };
  const clinics = [{ ...sessions[0], endTime: '13:00' }, { ...sessions[1], startTime: '13:00' }];
  const fourHours = { ...schedule, hoursTargetFullTime: 4 };
  const kept = { ...pair, secondDoctorId: undefined, dutyWindowId: short.id };
  const result = await SchedulingEngine.generate(fourHours, 'GENERATE_ALL', [kept], [makeNurse('n')], [SENIOR], [short, DAY_DUTY], [], [], clinics, [], [], hoursOnlyRules(), undefined, [], doctors);
  assert.deepEqual(result.assignments.find(a => a.id === kept.id), kept);
  assert.ok(!result.assignments.some(a => a.secondDoctorId));
  const fresh = await SchedulingEngine.generate(fourHours, 'GENERATE_ALL', [], [makeNurse('n')], [SENIOR], [short, DAY_DUTY], [], [], clinics, [], [], hoursOnlyRules(), undefined, [], doctors);
  assert.ok(fresh.assignments.every(a => a.dutyWindowId === short.id));
  assert.ok(!fresh.assignments.some(a => a.secondDoctorId), 'a new pair cannot exceed the hours budget');
});
test('a second clinic cannot consume the only free nurse cover at a previously covered hour', async () => {
  const late: DutyWindow = { ...DAY_DUTY, id: 'late-short', startTime: '13:00', endTime: '17:00' };
  const roles = ['NC', 'PHL'].map(acronym => ({ id: acronym, acronym, name: acronym, defaultDailyQuota: 0 } as ClinicalRole));
  const staff = ['n', 'ben'].map(id => makeNurse(id, { capabilityIds: ['NC', 'PHL'], preferences: id === 'n'
    ? [{ kind: 'DOCTOR', refId: 'two', rank: 1 }, { kind: 'DOCTOR', refId: 'one', rank: 2 }] : [] }));
  const kept: Assignment = { ...pair, id: 'nc', nurseId: 'ben', kind: 'CLINICAL_ROLE', doctorId: undefined,
    secondDoctorId: undefined, clinicalRoleId: 'NC', dutyWindowId: late.id };
  const clinics = [{ ...sessions[0], endTime: '13:00' }, { ...sessions[1], startTime: '13:00' }];
  const rules = [...hoursOnlyRules().filter(r => r.templateKey !== 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS'), { id: 'plus', templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', enabled: true,
    severity: 'HARD', value: 1 } as Rule];
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [kept], staff, [SENIOR], [DAY_DUTY, late], roles, [], clinics, [], [], rules, undefined, [], doctors, [], { openTime: '09:00', closeTime: '17:00' });
  assert.ok(!result.assignments.some(a => a.secondDoctorId), JSON.stringify(result.assignments));
  const report = ScheduleValidator.validate(schedule, result.assignments, staff, [SENIOR], [DAY_DUTY, late], clinics, [], [], roles, rules, [], [], doctors, [], { openTime: '09:00', closeTime: '17:00' });
  assert.ok((report.hourlyCoverageMap[date]['09:00'].freeNurses ?? 0) >= 1);
});
