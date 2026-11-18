import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession, Rule } from '../../src/types';
import { searchSchedule, SchedulingSearchCancelledError } from '../../src/services/engine/schedulingSearch';
import { createSchedulingObjective, type SchedulingObjectiveInput } from '../../src/services/engine/schedulingObjective';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-18', next = '2026-11-19';
const doctors = ['a', 'b', 'c'].map(id => ({ id, fullName: `Dr ${id}`, active: true, specialtyIds: [], weeklyPattern: [] } as Doctor));
const clinic = (doctorId: string, day = date, endTime = '17:00'): DoctorSession => ({ id: `s-${doctorId}-${day}`, doctorId,
  date: day, startTime: '09:00', endTime, source: 'MANUAL', cancelled: false } as DoctorSession);
const nurse = (id: string, ids: string[]) => makeNurse(id, { doctorEligibility: { doctorIds: ids, specialtyIds: [],
  reviewedBy: 'lead', reviewedAt: '2026-11-17T10:00:00Z' } });
const shift = (id: string, nurseId: string, doctorId?: string, day = date): Assignment => ({ id, nurseId, date: day,
  scheduleId: 'sched-1', dutyWindowId: DAY_DUTY.id, kind: doctorId ? 'DOCTOR' : 'CLINICAL_ROLE',
  ...(doctorId ? { doctorId, doctorCoverage: [{ doctorId, startTime: '09:00', endTime: '17:00' }] } : { clinicalRoleId: 'role-float' }),
  source: 'GENERATED', locked: false });
const base = (overrides: Partial<SchedulingObjectiveInput> = {}): SchedulingObjectiveInput => ({
  schedule: makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }), doctors,
  nurses: [nurse('one', ['a', 'b']), nurse('two', ['a', 'c']), nurse('three', ['c'])], seniorityLevels: [SENIOR],
  dutyWindows: [DAY_DUTY], sessions: [clinic('a'), clinic('b'), clinic('c')], roles: [], locks: [], leaveEntries: [],
  rules: [...hoursOnlyRules(), { id: 'rule-h1', templateKey: 'SENIOR_ON_DUTY', name: 'Senior', enabled: false,
    severity: 'SOFT', value: 0 } as Rule], specialties: [], clinicSetup: { openTime: '09:00', closeTime: '17:00' }, ...overrides,
});
const options = { maxExamined: 1200, maxStates: 8, deadlineMs: performance.timeOrigin + performance.now() + 10_000 };

test('a three nurse exchange fills a gap that no one or two duty exchange can fill', async () => {
  const assignments = [shift('one-a', 'one', 'a'), shift('two-c', 'two', 'c'), shift('three-float', 'three')];
  const input = { ...base(), baselineAssignments: assignments, initialAssignments: assignments };
  const before = JSON.stringify(input);
  const limited = await searchSchedule(input, { ...options, maxChangedDuties: 2, maxRounds: 1 });
  assert.equal(limited.score.uncoveredDoctorMinutes, 480);
  const result = await searchSchedule(input, { ...options, maxChangedDuties: 3, maxRounds: 1 });
  assert.equal(result.score.uncoveredDoctorMinutes, 0);
  assert.equal(result.score.hardViolations, 0);
  assert.equal(result.assignments.find(a => a.nurseId === 'one')?.doctorId, 'b');
  assert.equal(result.assignments.find(a => a.nurseId === 'two')?.doctorId, 'a');
  assert.equal(result.assignments.find(a => a.nurseId === 'three')?.doctorId, 'c');
  assert.equal(JSON.stringify(input), before);
});

test('a smaller doctor gap may move to another selected date for a net improvement', async () => {
  const initial = [shift('old', 'one', 'a')];
  const input = { ...base({ schedule: makeSchedule({ startDate: date, endDate: next, hoursTargetFullTime: 8 }),
    nurses: [nurse('one', ['a', 'b'])], sessions: [clinic('a', date, '13:00'), clinic('b', next)],
    rules: [...base().rules, { id: 'rule-h7-max-hours', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', name: 'Maximum hours',
      enabled: true, severity: 'HARD', value: 100 } as Rule] }),
    baselineAssignments: initial, initialAssignments: initial.map(a => ({ ...a, doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }] })) };
  const result = await searchSchedule(input, options);
  assert.equal(result.score.uncoveredDoctorMinutes, 240);
  assert.equal(result.assignments.some(a => a.date === next && a.doctorId === 'b'), true);
  assert.equal(result.assignments.some(a => a.date === date), false);
});

test('search never moves protected manual duties, pins or generated dates outside the selection', async () => {
  const initial = [{ ...shift('manual', 'one', 'a'), source: 'MANUAL' as const },
    { ...shift('pin', 'two', 'c'), source: 'LOCK' as const, locked: true }, shift('outside', 'three', undefined, next)];
  const input = { ...base({ schedule: makeSchedule({ startDate: date, endDate: next, hoursTargetFullTime: 16 }), selectedDates: [date] }),
    initialAssignments: initial, baselineAssignments: initial };
  const result = await searchSchedule(input, { ...options, maxExamined: 100 });
  for (const original of initial) assert.deepEqual(result.assignments.find(a => a.id === original.id), original);
});

test('existing paid duties stay on their dates and windows in an empty only search', async () => {
  const initial = [shift('old-float', 'one', undefined, date)];
  const result = await searchSchedule({ ...base({ schedule: makeSchedule({ startDate: date, endDate: next, hoursTargetFullTime: 8 }),
    nurses: [nurse('one', ['b'])], sessions: [clinic('b', next)] }), baselineAssignments: initial,
    initialAssignments: initial, preservePaidDuties: true }, options);
  const kept = result.assignments.find(a => a.id === initial[0].id);
  assert.equal(kept?.date, date); assert.equal(kept?.dutyWindowId, DAY_DUTY.id);
});

test('deadline and candidate limits return the best checked state with honest termination', async () => {
  const initial = [shift('a', 'one', 'a')]; const input = { ...base(), initialAssignments: initial, baselineAssignments: initial };
  const deadline = await searchSchedule(input, { now: () => 100, deadlineMs: 100 });
  assert.equal(deadline.termination, 'deadline'); assert.deepEqual(deadline.assignments, initial);
  const limited = await searchSchedule(input, { ...options, maxExamined: 1 });
  assert.equal(limited.termination, 'limit'); assert.ok(limited.score.uncoveredDoctorMinutes <= 960);
  const memoryLimited = await searchSchedule(input, { ...options, maxRetainedKeyBytes: 0 });
  assert.equal(memoryLimited.termination, 'limit'); assert.equal(memoryLimited.examined, 0);
  assert.equal(JSON.stringify(memoryLimited.assignments), JSON.stringify(initial));
  const checkedMemoryLimit = await searchSchedule(input, { ...options, maxRetainedKeyBytes: 400 });
  assert.equal(checkedMemoryLimit.termination, 'limit'); assert.ok(checkedMemoryLimit.examined > 0);
  assert.ok(checkedMemoryLimit.score.uncoveredDoctorMinutes < 960);
  assert.equal(checkedMemoryLimit.score.hardViolations, 0);
});

test('search reports ongoing work while no better checked roster has been found', async () => {
  const initial = [shift('one-a', 'one', 'a'), shift('two-c', 'two', 'c'), shift('three-float', 'three')];
  const progress: { elapsedMs: number; bestUncoveredDoctorMinutes: number; examinedStates: number }[] = [];
  let elapsed = 0;
  const result = await searchSchedule({ ...base(), initialAssignments: initial, baselineAssignments: initial },
    { ...options, maxChangedDuties: 2, maxRounds: 1, deadlineMs: 10_000, now: () => elapsed += 25,
      yieldControl: async () => {}, onProgress: update => progress.push(update) });
  assert.equal(result.score.uncoveredDoctorMinutes, 480);
  assert.ok(progress.slice(1, -1).some(update => update.elapsedMs >= 500 && update.examinedStates > 0 &&
    update.bestUncoveredDoctorMinutes === 480));
});

test('cancelling search returns no candidate and leaves inputs untouched', async () => {
  const initial = [shift('a', 'one', 'a')]; const input = { ...base(), initialAssignments: initial, baselineAssignments: initial };
  const before = JSON.stringify(input);
  await assert.rejects(() => searchSchedule(input, { isCancelled: () => true }), SchedulingSearchCancelledError);
  assert.equal(JSON.stringify(input), before);
});

test('search cannot trade required Nurse Clinic minutes for more doctor cover', async () => {
  const initial = [shift('one-a', 'one', 'a'), { ...shift('nc', 'two'), clinicalRoleId: 'role-nurse-clinic' }];
  const ctx = base({ nurses: [nurse('one', ['a', 'b']), { ...nurse('two', ['b']), capabilityIds: ['role-nurse-clinic'] }],
    sessions: [clinic('a'), clinic('b')], roles: [{ id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 }], rules: [] });
  const input = { ...ctx, initialAssignments: initial, baselineAssignments: initial };
  const before = createSchedulingObjective(input).score(initial);
  const result = await searchSchedule(input, { ...options, maxExamined: 150 });
  assert.equal(result.score.requiredNurseClinicMinutes, before.requiredNurseClinicMinutes);
  assert.equal(result.score.uncoveredDoctorMinutes, before.uncoveredDoctorMinutes);
});

for (const scenario of [
  { name: 'after another Nurse Clinic nurse arrives', floatStart: '09:00', floatEnd: '17:00', ncStart: '11:20', ncEnd: '21:00',
    doctorEnd: '16:00', expectedStart: '11:20', expectedEnd: '16:00', missing: 140 },
  { name: 'before another Nurse Clinic nurse leaves', floatStart: '13:00', floatEnd: '21:00', ncStart: '09:00', ncEnd: '15:10',
    doctorEnd: '21:00', expectedStart: '13:00', expectedEnd: '15:10', missing: 590 },
]) test(`Float time can cover a doctor ${scenario.name}`, async () => {
  const floatDuty = { ...DAY_DUTY, startTime: scenario.floatStart, endTime: scenario.floatEnd };
  const ncDuty = { ...DAY_DUTY, id: 'nurse-clinic-duty', startTime: scenario.ncStart, endTime: scenario.ncEnd };
  const original = shift('paid-float', 'one');
  const protectedNC = { ...shift('protected-nc', 'nc'), dutyWindowId: ncDuty.id,
    clinicalRoleId: 'role-nurse-clinic', source: 'MANUAL' as const, note: 'Keep this Nurse Clinic shift' };
  const initial = [original, protectedNC];
  const input = { ...base({ schedule: makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 12 }),
    nurses: [nurse('one', ['a']), makeNurse('nc', { isClinicNurse: false, capabilityIds: ['role-nurse-clinic'] })]
      .map(n => ({ ...n, capabilityIds: ['role-nurse-clinic'] })),
    sessions: [clinic('a', date, scenario.doctorEnd)], dutyWindows: [floatDuty, ncDuty],
    clinicSetup: { openTime: '09:00', closeTime: '21:00' },
    roles: [{ id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 }],
    rules: base().rules.map(r => r.id === 'rule-nurse-clinic' || r.id === 'rule-nurse-plus-one'
      ? { ...r, enabled: true, severity: 'HARD', value: 1 } : r),
  }), initialAssignments: initial, baselineAssignments: initial, preservePaidDuties: true };
  const result = await searchSchedule(input, { maxRounds: 1, maxExamined: 50 });
  assert.equal(result.score.requiredNurseClinicMinutes, 0);
  assert.equal(result.score.hardViolations, 0);
  assert.equal(result.score.uncoveredDoctorMinutes, scenario.missing);
  const covered = result.assignments.find(a => a.id === original.id)!;
  assert.equal(covered.dutyWindowId, original.dutyWindowId);
  assert.deepEqual(covered.doctorCoverage, [{ doctorId: 'a', startTime: scenario.expectedStart, endTime: scenario.expectedEnd }]);
  assert.deepEqual(result.assignments.find(a => a.id === protectedNC.id), protectedNC);
});

test('the final Float pass covers a partial gap opened by the last wider exchange', async () => {
  const full = { ...DAY_DUTY, id: 'full', endTime: '21:00' };
  const ncLate = { ...full, id: 'nc-late', startTime: '11:00' };
  const original = { ...shift('old-doctor', 'one', 'a'), doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '16:00' }] };
  const float = shift('paid-float', 'float');
  const nc = [{ ...shift('nc-first', 'nc'), source: 'MANUAL' as const, clinicalRoleId: 'role-nurse-clinic', dutyWindowId: ncLate.id },
    { ...shift('nc-second', 'nc', undefined, next), source: 'MANUAL' as const, clinicalRoleId: 'role-nurse-clinic', dutyWindowId: full.id }];
  const initial = [original, float, ...nc];
  const input = { ...base({ schedule: makeSchedule({ startDate: date, endDate: next, hoursTargetFullTime: 12 }),
    nurses: [nurse('one', ['a', 'b']), nurse('float', ['a']), makeNurse('nc', { isClinicNurse: false, contractPercent: 200 })]
      .map(n => ({ ...n, capabilityIds: ['role-nurse-clinic'] })),
    sessions: [clinic('a', date, '16:00'), clinic('b', next, '21:00')], dutyWindows: [DAY_DUTY, full, ncLate],
    clinicSetup: { openTime: '09:00', closeTime: '21:00' },
    roles: [{ id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 }],
    rules: [...base().rules.map((r): Rule => r.id === 'rule-nurse-clinic' || r.id === 'rule-nurse-plus-one'
      ? { ...r, enabled: true, severity: 'HARD', value: 1 } : r),
    { id: 'rule-h7-max-hours', name: 'Maximum hours', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: true, severity: 'HARD', value: 100 } as Rule],
  }), initialAssignments: initial, baselineAssignments: initial };
  const result = await searchSchedule(input, { maxRounds: 1, maxExamined: 300 });
  assert.equal(result.score.uncoveredDoctorMinutes, 120);
  assert.equal(result.score.requiredNurseClinicMinutes, 0);
  assert.equal(result.score.hardViolations, 0);
  assert.deepEqual(result.assignments.find(a => a.id === float.id)?.doctorCoverage,
    [{ doctorId: 'a', startTime: '11:00', endTime: '16:00' }]);
  for (const saved of nc) assert.deepEqual(result.assignments.find(a => a.id === saved.id), saved);
});
