import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { buildTemplateCoveragePlan, assertTemplateCoverageCurrent, type TemplateCoverageInput } from '../../src/services/schedule/templateCoverage';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeLock, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-18';
const schedule = makeSchedule({ id: 'target', startDate: date, endDate: date, hoursTargetFullTime: 8 });
const doctors = ['one', 'two'].map(id => ({ id, fullName: `Dr ${id}`, specialtyIds: [], weeklyPattern: [], active: true } as Doctor));
const sessions = doctors.map(d => ({ id: `session-${d.id}`, doctorId: d.id, date, startTime: '09:00', endTime: '17:00', source: 'MANUAL', cancelled: false } as DoctorSession));
const pattern = { dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR' as const, doctorId: 'one',
  doctorCoverage: [{ doctorId: 'one', startTime: '09:00', endTime: '12:30' }] };
const shift = (id: string, nurseId: string): Assignment => ({ id, scheduleId: schedule.id, nurseId, date,
  dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: 'one', source: 'MANUAL', locked: false });
function input(overrides: Partial<TemplateCoverageInput> = {}): TemplateCoverageInput {
  const ctx: TemplateCoverageInput = { schedule, assignments: [], nurses: [makeNurse('amy')], dutyWindows: [DAY_DUTY],
    leaveEntries: [], locks: [], doctors, sessions, roles: [], specialties: [], rules: hoursOnlyRules(), availabilityRequests: [], surroundingAssignments: [],
    checkRoster: () => [], ...overrides };
  ctx.checkRoster = overrides.checkRoster || (list => ScheduleValidator.validate(schedule, list, ctx.nurses, [SENIOR], ctx.dutyWindows,
    ctx.sessions, ctx.leaveEntries, ctx.locks, ctx.roles, ctx.rules, [], ctx.specialties, ctx.doctors).findings);
  return ctx;
}

test('template copies retain exact cover with a destination identity and no inherited review intent', () => {
  const source = { ...pattern, id: 'source', allocationReview: { private: true }, manualDoctorOverlaps: [{ private: true }],
    doctorCoverage: pattern.doctorCoverage.map(r => ({ ...r, reviewedBy: 'private account' })) };
  const before = JSON.stringify(source);
  const plan = buildTemplateCoveragePlan(input(), () => source, () => 'new');
  assert.equal(plan.result[0].id, 'new'); assert.equal(plan.result[0].scheduleId, schedule.id);
  assert.deepEqual(plan.result[0].doctorCoverage, pattern.doctorCoverage);
  assert.equal(plan.result[0].manualDoctorOverlaps, undefined);
  assert.equal(plan.result[0].allocationReview, undefined);
  assert.equal(plan.result[0].source, 'GENERATED');
  assert.equal(JSON.stringify(source), before);
});
test('stale copied timing fails instead of widening or clipping to the destination clinic', () => {
  const ctx = input({ sessions: sessions.map(s => ({ ...s, startTime: '10:00' })) });
  assert.throws(() => buildTemplateCoveragePlan(ctx, () => pattern), /active doctor session/);
  assert.deepEqual(ctx.assignments, []);
});
test('sequential normal acuity doctors copy their explicit periods without becoming shared cover', () => {
  const plan = buildTemplateCoveragePlan(input(), () => ({ ...pattern, secondDoctorId: 'two', doctorCoverage: [
    { doctorId: 'one', startTime: '09:00', endTime: '13:00' }, { doctorId: 'two', startTime: '13:00', endTime: '17:00' },
  ] }));
  assert.equal(plan.result[0].secondDoctorId, 'two');
  assert.equal(plan.result[0].doctorCoverage?.length, 2);
});
test('automatic template cover cannot overlap an existing protected nurse for the same doctor', () => {
  const fixed = shift('fixed', 'other');
  assert.throws(() => buildTemplateCoveragePlan(input({ assignments: [fixed], nurses: [makeNurse('amy'), makeNurse('other')] }),
    id => id === 'amy' ? pattern : undefined), /Must fix/);
});
test('a template cannot recreate an existing automatic overlap under new shift identities', () => {
  const ctx = input({ assignments: [{ ...shift('old-a', 'amy'), source: 'GENERATED' },
    { ...shift('old-b', 'other'), source: 'GENERATED' }], nurses: [makeNurse('amy'), makeNurse('other')] });
  assert.throws(() => buildTemplateCoveragePlan(ctx, () => ({ ...pattern,
    doctorCoverage: [{ doctorId: 'one', startTime: '09:00', endTime: '17:00' }] })), /Must fix/);
});
test('templates preserve pins and manual duties and skip approved leave or approved days off', () => {
  const fixed = shift('fixed', 'manual');
  const pinned = { ...shift('pinned', 'pinned'), source: 'LOCK' as const, locked: true };
  const ctx = input({ assignments: [fixed, pinned], nurses: ['manual', 'pinned', 'leave', 'off'].map(id => makeNurse(id)),
    locks: [makeLock('pinned', date)], leaveEntries: [makeLeave({ nurseId: 'leave', startDate: date, endDate: date })],
    availabilityRequests: [{ id: 'off', nurseId: 'off', date, available: false, status: 'APPROVED', submittedByNurseId: 'off', submittedAt: '2026-11-16T08:00:00Z' }] });
  const plan = buildTemplateCoveragePlan(ctx, () => pattern);
  assert.deepEqual(plan.result, [fixed, pinned]); assert.equal(plan.added, 0);
});
test('template duties obey hard rest limits against fixed surrounding duties', () => {
  const late = { ...DAY_DUTY, id: 'late', startTime: '13:00', endTime: '23:00' };
  assert.throws(() => buildTemplateCoveragePlan(input({ dutyWindows: [DAY_DUTY, late],
    surroundingAssignments: [{ ...shift('prior', 'amy'), date: '2026-11-17', dutyWindowId: late.id }] }), () => pattern), /rest/);
});
test('template clinical restrictions and malformed role timing are checked before any candidate is returned', () => {
  assert.throws(() => buildTemplateCoveragePlan(input({ nurses: [makeNurse('amy', { doctorEligibility: {
    doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-16T08:00:00Z',
  } })] }), () => pattern), /eligible/);
  assert.throws(() => buildTemplateCoveragePlan(input(), () => ({ ...pattern, kind: 'CLINICAL_ROLE', doctorId: undefined })), /doctor duty/);
});
test('template confirmation cannot apply a stale candidate or make an existing hard problem larger', () => {
  const ctx = input();
  const plan = buildTemplateCoveragePlan(ctx, () => pattern);
  assert.doesNotThrow(() => assertTemplateCoverageCurrent(plan, ctx));
  assert.throws(() => assertTemplateCoverageCurrent(plan, { ...ctx, sessions: [] }), /changed/);
  const finding = (amount: number) => ({ id: 'hours-over-amy', severity: 'ERROR' as const, category: 'RULE_VIOLATION' as const,
    message: 'Too many hours', affectedNurseIds: ['amy'], cellRefs: [], amount });
  assert.throws(() => buildTemplateCoveragePlan(input({ checkRoster: list => [finding(list.length ? 2 : 1)] }), () => pattern), /Must fix/);
});
test('copied cover rejects inactive doctor profiles and removes unrelated role targets', () => {
  assert.throws(() => buildTemplateCoveragePlan(input({ doctors: doctors.map(d => ({ ...d, active: false })) }), () => pattern), /no longer active/);
  const plan = buildTemplateCoveragePlan(input(), () => ({ dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE',
    clinicalRoleId: 'role-float', doctorId: 'one', secondDoctorId: 'two', specialtyId: 'unrelated' }));
  assert.equal(plan.result[0].doctorId, undefined); assert.equal(plan.result[0].secondDoctorId, undefined);
  assert.equal(plan.result[0].specialtyId, undefined); assert.equal(plan.result[0].clinicalRoleId, 'role-float');
});
