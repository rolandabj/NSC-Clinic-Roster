import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, AvailabilityRequest, ClinicalRole, Doctor, DoctorSession, LeaveEntry, Nurse, Rule } from '../../src/types';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-15';
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 0 });
const nurses = [makeNurse('amy'), makeNurse('ben')];
const unlimited = [...hoursOnlyRules(), { id: 'no-ceiling', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: false, severity: 'HARD', value: 105 } as Rule];
const retained: Assignment = { id: 'retained', scheduleId: schedule.id, nurseId: 'amy', date, dutyWindowId: DAY_DUTY.id,
  kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'MANUAL', locked: false };
const doctor = { id: 'doctor', fullName: 'Dr Example', active: true, specialtyIds: [], weeklyPattern: [] } as Doctor;
const session = { id: 'session', doctorId: doctor.id, date, startTime: '09:00', endTime: '17:00', cancelled: false, source: 'MANUAL' } as DoctorSession;
const leave = [makeLeave({ nurseId: 'amy', startDate: date, endDate: date })];
const roles = ['NC', 'PHL'].map(acronym => ({ id: acronym, name: acronym, acronym, defaultDailyQuota: 0 } as ClinicalRole));
interface Options { staff?: Nurse[]; kept?: Assignment[]; leave?: LeaveEntry[]; requests?: AvailabilityRequest[]; holiday?: boolean; sessions?: DoctorSession[]; roles?: ClinicalRole[]; rules?: Rule[] }
const generate = (o: Options) => SchedulingEngine.generate(schedule, 'GENERATE_ALL', o.kept || [retained], o.staff || nurses, [SENIOR], [DAY_DUTY],
  o.roles || [], [], o.sessions || [], [], o.leave || [], o.rules || unlimited, undefined, [], [doctor], [],
  { openTime: '09:00', closeTime: '17:00', holidayDates: o.holiday ? [date] : [], availabilityRequests: o.requests || [] });

test('retained holiday duty on approved leave cannot hide the real holiday shortage', async () => {
  const before = JSON.stringify(retained);
  const result = await generate({ leave, holiday: true });
  assert.ok(result.assignments.some(a => a.nurseId === 'ben'));
  assert.deepEqual(result.assignments.find(a => a.id === retained.id), retained);
  assert.equal(JSON.stringify(retained), before);
});
test('retained holiday duty on an approved day off cannot replace available staff', async () => {
  const requests = [{ id: 'approved-off', nurseId: 'amy', date, available: false, status: 'APPROVED' } as AvailabilityRequest];
  const result = await generate({ requests, holiday: true });
  assert.ok(result.assignments.some(a => a.nurseId === 'ben'));
});
test('a retained doctor duty on leave does not stop an available eligible nurse covering the doctor', async () => {
  const result = await generate({ leave, sessions: [session], kept: [{ ...retained, kind: 'DOCTOR', doctorId: doctor.id, clinicalRoleId: undefined }] });
  assert.ok(result.assignments.some(a => a.nurseId === 'ben' && a.doctorId === doctor.id));
});
test('a retained doctor duty outside reviewed clinical eligibility does not satisfy the session', async () => {
  const staff = [makeNurse('amy', { doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-15T10:00:00Z' } }), nurses[1]];
  const result = await generate({ staff, sessions: [session], kept: [{ ...retained, kind: 'DOCTOR', doctorId: doctor.id, clinicalRoleId: undefined }] });
  assert.ok(result.assignments.some(a => a.nurseId === 'ben' && a.doctorId === doctor.id));
});
test('retained unavailable Nurse Clinic cover does not satisfy the daily quota', async () => {
  const staff = nurses.map(n => ({ ...n, capabilityIds: ['NC', 'PHL'] }));
  const rules = unlimited.filter(r => r.templateKey !== 'DEDICATED_NURSE_CLINIC').concat({ id: 'nc', templateKey: 'DEDICATED_NURSE_CLINIC', enabled: true, severity: 'HARD', value: 1 } as Rule);
  const result = await generate({ staff, leave, roles, rules, kept: [{ ...retained, clinicalRoleId: 'NC' }] });
  assert.ok(result.assignments.some(a => a.nurseId === 'ben' && a.clinicalRoleId === 'NC'));
});
test('retained unqualified Nurse Clinic cover does not satisfy the daily quota', async () => {
  const staff = [nurses[0], makeNurse('ben', { capabilityIds: ['NC', 'PHL'] })];
  const rules = unlimited.filter(r => r.templateKey !== 'DEDICATED_NURSE_CLINIC').concat({ id: 'nc', templateKey: 'DEDICATED_NURSE_CLINIC', enabled: true, severity: 'HARD', value: 1 } as Rule);
  const result = await generate({ staff, roles, rules, kept: [{ ...retained, clinicalRoleId: 'NC' }] });
  assert.ok(result.assignments.some(a => a.nurseId === 'ben' && a.clinicalRoleId === 'NC'));
});
