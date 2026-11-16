import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';
import { applySeparateFloatCover, type FloatCoverContext } from '../../src/services/engine/lowAcuityLastResort';
import { repairCoverage } from '../../src/services/engine/coverageRepair';
import { effectiveDoctorCoverage, resolveClinicSetup } from '../../src/services/engine/clinicModel';
import { DAY_DUTY, makeNurse } from './fixtures';

const date = '2026-11-22';
const range = (doctorId: string, startTime: string, endTime: string) => ({ doctorId, startTime, endTime });
const doctors = ['one', 'two', 'third', 'fourth'].map(id => ({ id, fullName: `Dr ${id}`, active: true,
  lowAcuity: id === 'one' || id === 'two', specialtyIds: [], weeklyPattern: [] } as Doctor));
const sessions = doctors.map(d => ({ id: d.id, doctorId: d.id, date, startTime: '09:00', endTime: '17:00',
  source: 'MANUAL', cancelled: false } as DoctorSession));
const nurses = [makeNurse('amy'), makeNurse('ben'), makeNurse('nc')];
const pair: Assignment = { id: 'pair', scheduleId: 'sched', nurseId: 'amy', date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: 'one', secondDoctorId: 'two', source: 'GENERATED', locked: false,
  doctorCoverage: [range('one', '09:00', '17:00'), range('two', '13:00', '17:00')] };
const float: Assignment = { id: 'float', scheduleId: 'sched', nurseId: 'ben', date, dutyWindowId: DAY_DUTY.id,
  kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'GENERATED', locked: false };
const ctx = (assignments: Assignment[]): FloatCoverContext => ({ assignments, nurses, doctors, sessions, duties: [DAY_DUTY],
  specialties: [], roles: [], leave: [], locks: [], requests: [], clinic: resolveClinicSetup({ openTime: '09:00', closeTime: '17:00' }),
  minFreeNurses: 0, movable: a => a.source === 'GENERATED' && !a.locked });
const cover = (a: Assignment, context: FloatCoverContext) => effectiveDoctorCoverage(a,
  context.duties.find(d => d.id === a.dutyWindowId), context.sessions);

test('partial generated Float relief removes only the exact shared minutes and keeps paid duties', () => {
  const short = { ...DAY_DUTY, id: 'short', startTime: '13:30', endTime: '15:15' };
  const context = { ...ctx([pair, { ...float, dutyWindowId: short.id }]), duties: [DAY_DUTY, short] };
  const before = JSON.stringify(context);
  const result = applySeparateFloatCover(context, () => true);
  assert.deepEqual(cover(result[0], context), [range('one', '09:00', '17:00'), range('two', '13:00', '13:30'), range('two', '15:15', '17:00')]);
  assert.deepEqual(cover(result[1], context), [range('two', '13:30', '15:15')]);
  assert.deepEqual(result.map(a => [a.id, a.nurseId, a.date, a.dutyWindowId]), context.assignments.map(a => [a.id, a.nurseId, a.date, a.dutyWindowId]));
  assert.equal(JSON.stringify(context), before);
});
test('residual time on a generated doctor duty provides sequential Float relief', () => {
  const short = { ...DAY_DUTY, id: 'short', endTime: '15:15' };
  const helper = { ...float, kind: 'DOCTOR' as const, doctorId: 'third', clinicalRoleId: undefined,
    dutyWindowId: short.id, doctorCoverage: [range('third', '09:00', '13:45')] };
  const context = { ...ctx([pair, helper]), duties: [DAY_DUTY, short] };
  const result = applySeparateFloatCover(context, () => true);
  assert.deepEqual(cover(result[1], context), [range('third', '09:00', '13:45'), range('two', '13:45', '15:15')]);
  assert.deepEqual(cover(result[0], context).filter(r => r.doctorId === 'two'), [range('two', '13:00', '13:45'), range('two', '15:15', '17:00')]);
});
test('Float relief never gives a nurse a third distinct doctor on the same date', () => {
  const helper = { ...float, kind: 'DOCTOR' as const, doctorId: 'third', secondDoctorId: 'fourth', clinicalRoleId: undefined,
    doctorCoverage: [range('third', '09:00', '10:00'), range('fourth', '10:00', '12:00')] };
  const context = ctx([pair, helper]);
  assert.deepEqual(applySeparateFloatCover(context, () => true), context.assignments);
});
test('partial Float relief retains exact Nurse Clinic cover after a short spare duty ends', () => {
  const ncDuty = { ...DAY_DUTY, id: 'nc-short', startTime: '13:00', endTime: '14:00' };
  const nc = { ...float, id: 'nc', nurseId: 'nc', dutyWindowId: ncDuty.id, clinicalRoleId: 'NC' };
  const roles = ['NC', 'PHL'].map(acronym => ({ id: acronym, acronym, name: acronym, description: '', defaultDailyQuota: 0 }));
  const context = { ...ctx([pair, float, nc]), roles, minFreeNurses: 1, duties: [DAY_DUTY, ncDuty],
    nurses: [nurses[0], ...nurses.slice(1).map(n => ({ ...n, capabilityIds: ['NC', 'PHL'] }))] };
  const result = applySeparateFloatCover(context, () => true);
  assert.deepEqual(cover(result[1], context), [range('two', '13:00', '14:00')]);
  assert.deepEqual(cover(result[0], context).filter(r => r.doctorId === 'two'), [range('two', '14:00', '17:00')]);
});
test('automatic Float relief preserves manual and pinned duties even without an optional move filter', () => {
  for (const protectedPair of [{ ...pair, source: 'MANUAL' as const }, { ...pair, source: 'MANUAL' as const, doctorCoverage: undefined }, { ...pair, locked: true }]) {
    const context = { ...ctx([protectedPair, float]), movable: undefined };
    assert.deepEqual(applySeparateFloatCover(context, () => true), context.assignments);
  }
  for (const protectedFloat of [{ ...float, source: 'MANUAL' as const }, { ...float, locked: true }]) {
    const context = { ...ctx([pair, protectedFloat]), movable: undefined };
    assert.deepEqual(applySeparateFloatCover(context, () => true), context.assignments);
  }
});
test('a complete Float replacement preserves one nurse for the entire primary session', () => {
  const context = { ...ctx([pair, float]), nurses: [nurses[0], { ...nurses[1],
    doctorEligibility: { doctorIds: ['one'], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-16' } }] };
  const result = applySeparateFloatCover(context, () => true);
  assert.deepEqual(cover(result[0], context), [range('two', '13:00', '17:00')]);
  assert.deepEqual(cover(result[1], context), [range('one', '09:00', '17:00')]);
});
test('a primary doctor handover is limited to shared time when earlier Float hours are needed for Nurse Clinic', () => {
  const ncDuty = { ...DAY_DUTY, id: 'nc-late', startTime: '13:00' };
  const nc = { ...float, id: 'nc', nurseId: 'nc', dutyWindowId: ncDuty.id, clinicalRoleId: 'NC' };
  const roles = ['NC', 'PHL'].map(acronym => ({ id: acronym, acronym, name: acronym, description: '', defaultDailyQuota: 0 }));
  const context = { ...ctx([pair, float, nc]), roles, minFreeNurses: 1, duties: [DAY_DUTY, ncDuty], nurses: [nurses[0],
    { ...nurses[1], capabilityIds: ['NC', 'PHL'], doctorEligibility: { doctorIds: ['one'], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-16' } },
    { ...nurses[2], capabilityIds: ['NC', 'PHL'] }] };
  const result = applySeparateFloatCover(context, () => true);
  assert.deepEqual(cover(result[0], context), [range('one', '09:00', '13:00'), range('two', '13:00', '17:00')]);
  assert.deepEqual(cover(result[1], context), [range('one', '13:00', '17:00')]);
});
test('repair can fill a generated timed duty gap without widening into another nurse cover', async () => {
  const timed = { ...pair, secondDoctorId: undefined, doctorCoverage: [range('one', '09:00', '13:15')] };
  const other = { ...pair, id: 'other', nurseId: 'ben', source: 'MANUAL' as const, secondDoctorId: undefined,
    doctorCoverage: [range('one', '14:45', '17:00')] };
  const result = await repairCoverage({ assignments: [timed, other], dates: [date], sessions: [sessions[0]], nurses,
    duties: [DAY_DUTY], roles: [], clinic: ctx([]).clinic, minFreeNurses: 0, movable: a => a.source === 'GENERATED',
    canWorkOnDate: () => true, canPair: () => true, validate: () => [] });
  assert.deepEqual(cover(result.assignments[0], ctx([])), [range('one', '09:00', '14:45')]);
  assert.equal(result.assignments[1], other);
  assert.equal(result.repairedCount, 1);
});
test('repair preserves protected timed gaps for explicit planner review', async () => {
  const timed = { ...pair, source: 'MANUAL' as const, secondDoctorId: undefined, doctorCoverage: [range('one', '09:00', '13:15')] };
  const result = await repairCoverage({ assignments: [timed], dates: [date], sessions: [sessions[0]], nurses,
    duties: [DAY_DUTY], roles: [], clinic: ctx([]).clinic, minFreeNurses: 0, movable: () => true,
    canWorkOnDate: () => true, canPair: () => true, validate: () => [] });
  assert.deepEqual(result.assignments, [timed]);
});
