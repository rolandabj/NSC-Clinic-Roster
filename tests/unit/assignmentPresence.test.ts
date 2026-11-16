import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, AvailabilityRequest, ClinicalRole, Doctor, DoctorSession, LeaveEntry, LockEntry, Nurse } from '../../src/types';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { publicationReport } from '../../src/services/publish/publicationChecks';
import { approveAllocation } from '../../src/services/engine/allocationReview';
import { LAST_RESORT_NOTE, AGREED_EXCEPTION_NOTE } from '../../src/services/engine/lastResort';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeLock, makeNurse, makeSchedule } from './fixtures';
const date = '2026-11-22';
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 });
const nurse = makeNurse('one');
const doctor = { id: 'doctor', fullName: 'Dr Example', active: true, lowAcuity: true, specialtyIds: [], weeklyPattern: [] } as Doctor;
const session = { id: 'session', doctorId: doctor.id, date, startTime: '09:00', endTime: '17:00', cancelled: false, source: 'MANUAL' } as DoctorSession;
const shift: Assignment = { id: 'shift', scheduleId: schedule.id, nurseId: nurse.id, date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: doctor.id, source: 'MANUAL', locked: false };
const off = { id: 'off', nurseId: nurse.id, date, available: false, status: 'APPROVED' } as AvailabilityRequest;
const refs = { doctors: [doctor], specialties: [], sessions: [session] };
interface Options { nurses?: Nurse[]; assignments?: Assignment[]; leave?: LeaveEntry[]; locks?: LockEntry[]; requests?: AvailabilityRequest[]; setupRequests?: AvailabilityRequest[]; holiday?: boolean; roles?: ClinicalRole[] }
const check = (o: Options = {}) => ScheduleValidator.validate(schedule, o.assignments || [shift], o.nurses || [nurse], [SENIOR], [DAY_DUTY], [session],
  o.leave || [], o.locks || [], o.roles || [], hoursOnlyRules(), [], [], [doctor], [ANNUAL_LEAVE],
  { openTime: '09:00', closeTime: '17:00', holidayDates: o.holiday ? [date] : [], availabilityRequests: o.setupRequests }, o.requests || []);
const missing = (r: ReturnType<typeof check>) => r.findings.filter(f => /^(unassigned-session-|session-partial-)/.test(f.id));
const noDoctorCover = (r: ReturnType<typeof check>) => {
  assert.equal(r.hourlyCoverageMap[date]['09:00'].coveredDoctors, 0);
  assert.equal(r.hourlyCoverageMap[date]['09:00'].uncoveredDoctors, 1);
  assert.equal(missing(r).reduce((sum, f) => sum + (f.amount || 0), 0), 8);
};
test('approved leave removes apparent doctor cover as well as reporting the leave error', () => {
  const report = check({ leave: [makeLeave({ nurseId: nurse.id, startDate: date, endDate: date })] });
  noDoctorCover(report);
  assert.ok(report.findings.some(f => f.id.startsWith('leave-overlap-') && f.severity === 'ERROR'));
});
test('an approved day off without a pin removes cover and blocks publication', () => {
  const report = check({ requests: [off] });
  noDoctorCover(report);
  const published = publicationReport(report, [shift], [nurse], refs);
  assert.equal(published.findings.find(f => f.id.startsWith('request-dayoff-shift-'))?.severity, 'ERROR');
});
test('approved day off requests from clinic setup also remove cover', () => noDoctorCover(check({ setupRequests: [off] })));
test('an OFF pin removes doctor cover', () => noDoctorCover(check({ locks: [makeLock(nurse.id, date, { mode: 'OFF' })] })));
test('inactive and missing nurse assignments cannot cover a doctor and have explicit errors', () => {
  for (const nurses of [[], [{ ...nurse, active: false }]]) {
    const report = check({ nurses });
    noDoctorCover(report);
    assert.ok(report.findings.some(f => f.category === 'DATA_ISSUE' && f.severity === 'ERROR' && f.affectedNurseIds.includes(nurse.id)));
  }
});
test('a clinically ineligible nurse cannot provide apparent doctor cover through an exception note', () => {
  const denied = { ...nurse, doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-15T10:00:00Z' } };
  noDoctorCover(check({ nurses: [denied], assignments: [{ ...shift, note: LAST_RESORT_NOTE }] }));
});
test('legacy unapproved mismatches do not cover a doctor while recognized exceptions retain provisional cover', () => {
  const legacy = { ...nurse, preferences: [{ kind: 'DOCTOR' as const, refId: 'other', rank: 1 }] };
  noDoctorCover(check({ nurses: [legacy] }));
  for (const assignment of [{ ...shift, note: LAST_RESORT_NOTE }, { ...shift, note: AGREED_EXCEPTION_NOTE },
    { ...shift, allocationReview: approveAllocation(shift, 'lead', 'Confirmed', '2026-11-15T10:00:00Z') }]) {
    assert.equal(check({ nurses: [legacy], assignments: [assignment] }).hourlyCoverageMap[date]['09:00'].coveredDoctors, 1);
  }
});
test('Nurse Clinic only staff cannot cover a doctor', () => noDoctorCover(check({ nurses: [{ ...nurse, isClinicNurse: false }] })));
test('a missing nurse does not provide holiday cover', () => {
  const report = check({ nurses: [], assignments: [{ ...shift, kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'role-float' }], holiday: true });
  assert.equal(report.hourlyCoverageMap[date]['09:00'].freeNurses, 0);
  assert.equal(report.hourlyCoverageMap[date]['09:00'].deficit, 1);
  assert.ok(report.findings.some(f => /^(holiday-gap-|holiday-no-nurse-)/.test(f.id) && f.severity === 'ERROR'));
});
test('approved leave and inactive staff cannot provide Nurse Clinic or senior cover', () => {
  const role = { id: 'NC', acronym: 'NC', name: 'Nurse Clinic', defaultDailyQuota: 1 } as ClinicalRole;
  const assignment = { ...shift, kind: 'CLINICAL_ROLE' as const, doctorId: undefined, clinicalRoleId: role.id };
  const report = ScheduleValidator.validate(schedule, [assignment], [{ ...nurse, capabilityIds: [role.id] }], [SENIOR], [DAY_DUTY], [],
    [makeLeave({ nurseId: nurse.id, startDate: date, endDate: date })], [], [role], [], [], [], [], [ANNUAL_LEAVE], { openTime: '09:00', closeTime: '17:00' });
  assert.equal(report.hourlyCoverageMap[date]['09:00'].freeNurses, 0);
  assert.ok(report.findings.some(f => f.id.startsWith('nc-coverage-')));
  assert.ok(report.findings.some(f => f.id.startsWith('h1-senior-')));
});
test('pending and rejected day off requests remain nonblocking wishes and do not remove coverage', () => {
  for (const status of ['PENDING', 'REJECTED'] as const) assert.equal(check({ requests: [{ ...off, status }] }).hourlyCoverageMap[date]['09:00'].coveredDoctors, 1);
});

test('an ineligible second doctor does not erase valid primary doctor cover', () => {
  const second = { ...doctor, id: 'second', fullName: 'Dr Second' };
  const sessions = [session, { ...session, id: 'session-second', doctorId: second.id }];
  const eligible = { ...nurse, doctorEligibility: { doctorIds: [doctor.id], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-15T10:00:00Z' } };
  const report = ScheduleValidator.validate(schedule, [{ ...shift, secondDoctorId: second.id }], [eligible], [SENIOR], [DAY_DUTY], sessions,
    [], [], [], hoursOnlyRules(), [], [], [doctor, second], [], { openTime: '09:00', closeTime: '17:00' });
  assert.equal(report.hourlyCoverageMap[date]['09:00'].coveredDoctors, 1);
  assert.equal(report.hourlyCoverageMap[date]['09:00'].uncoveredDoctors, 1);
  assert.ok(report.findings.some(f => f.id === 'unassigned-session-session-second'));
  assert.ok(!report.findings.some(f => f.id === 'unassigned-session-session'));
});
test('an unqualified dedicated Nurse Clinic assignment cannot satisfy its daily quota', () => {
  const roles = [{ id: 'NC', acronym: 'NC', name: 'Nurse Clinic' }, { id: 'PHL', acronym: 'PHL', name: 'Blood collection' }] as ClinicalRole[];
  const report = ScheduleValidator.validate(schedule, [{ ...shift, kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'NC' }],
    [{ ...nurse, capabilityIds: ['NC'] }], [SENIOR], [DAY_DUTY], [], [], [], roles, [], [], [], [], [], { openTime: '09:00', closeTime: '17:00' });
  assert.ok(report.findings.some(f => f.id.startsWith('nc-not-qualified-')));
  assert.ok(report.findings.some(f => f.id.startsWith('nc-coverage-')));
  assert.equal(report.hourlyCoverageMap[date]['09:00'].freeNurses, 0);
});
