import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession, Rule } from '../../src/types';
import { createSchedulingObjective, compareSchedulingScores, type SchedulingObjectiveInput } from '../../src/services/engine/schedulingObjective';
import { searchSchedule } from '../../src/services/engine/schedulingSearch';
import { LAST_RESORT_NOTE } from '../../src/services/engine/lastResort';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLock, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-18';
const nextDate = '2026-11-19';
const doctors = ['a', 'b'].map(id => ({ id, fullName: `Dr ${id}`, specialtyIds: [], weeklyPattern: [], active: true, lowAcuity: true } as Doctor));
const session = (doctorId = 'a', startTime = '09:00', endTime = '17:00', day = date): DoctorSession => ({
  id: `${doctorId}-${day}`, doctorId, date: day, startTime, endTime, source: 'MANUAL', cancelled: false,
} as DoctorSession);
const shift = (id: string, nurseId = 'one', extra: Partial<Assignment> = {}): Assignment => ({ id, scheduleId: 'sched-1',
  nurseId, date, dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: 'a', locked: false, source: 'GENERATED', ...extra });
const rules = [...hoursOnlyRules(), { id: 'rule-h1', templateKey: 'SENIOR_ON_DUTY', name: 'Senior', enabled: false,
  severity: 'HARD', value: 1 } as Rule];
const input = (extra: Partial<SchedulingObjectiveInput> = {}): SchedulingObjectiveInput => ({
  schedule: makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }), nurses: [makeNurse('one'), makeNurse('two')],
  seniorityLevels: [SENIOR], dutyWindows: [DAY_DUTY], sessions: [session()], leaveEntries: [], locks: [], roles: [], rules,
  workingHoursPeriods: [], specialties: [], doctors, leaveTypes: [], baselineAssignments: [],
  clinicSetup: { openTime: '09:00', closeTime: '17:00' }, ...extra,
});

test('coverage scoring counts exact uncovered minutes and returns their intervals', () => {
  const objective = createSchedulingObjective(input({ sessions: [session('a', '09:00', '10:30')] }));
  const duty = shift('partial', 'one', { doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '09:20' },
    { doctorId: 'a', startTime: '09:40', endTime: '10:30' }] });
  assert.equal(objective.score([duty], []).uncoveredDoctorMinutes, 20);
  assert.deepEqual(objective.coverageGaps([duty]), [{ date, doctorId: 'a', startTime: '09:20', endTime: '09:40', missingMinutes: 20 }]);
});

test('the shared score permits moving a smaller gap elsewhere for a net improvement', () => {
  const objective = createSchedulingObjective(input({ schedule: makeSchedule({ startDate: date, endDate: nextDate, hoursTargetFullTime: 1 }),
    sessions: [session('a', '09:00', '10:00'), session('a', '09:00', '10:00', nextDate)],
    rules: [...rules, { id: 'rule-h7-max-hours', name: 'Hours', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: false } as Rule] }));
  const before = [shift('later', 'one', { date: nextDate, doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '10:00' }] })];
  const after = [shift('today', 'two', { doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '10:00' }] }),
    shift('later', 'one', { date: nextDate, doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '09:30' }] })];
  assert.equal(objective.score(before, []).uncoveredDoctorMinutes, 60);
  assert.equal(objective.score(after, []).uncoveredDoctorMinutes, 30);
  assert.ok(compareSchedulingScores(objective.score(after, []), objective.score(before, [])) < 0);
});

test('shared doctor time is a union and never doubles paid duty hours', () => {
  const objective = createSchedulingObjective(input({ sessions: [session('a'), session('b')] }));
  const pair = shift('pair', 'one', { secondDoctorId: 'b', doctorCoverage: [
    { doctorId: 'a', startTime: '09:00', endTime: '17:00' }, { doctorId: 'b', startTime: '11:00', endTime: '15:00' },
  ] });
  const score = objective.score([pair], []);
  assert.equal(score.concurrentDoctorMinutes, 240);
  assert.equal(score.uncoveredDoctorMinutes, 240);
  assert.equal(score.hoursImbalance, 480);
});

test('handover scoring counts nurse changes rather than repeated interval rows', () => {
  const objective = createSchedulingObjective(input());
  const repeated = shift('repeated', 'one', { doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '11:00' },
    { doctorId: 'a', startTime: '13:00', endTime: '17:00' }] });
  const middle = shift('middle', 'two', { doctorCoverage: [{ doctorId: 'a', startTime: '11:00', endTime: '13:00' }] });
  assert.equal(objective.score([repeated, middle], []).handovers, 2);
  assert.equal(objective.score([shift('full')], []).handovers, 0);
});

test('hard Nurse Clinic staffing deficits precede doctor cover and use exact minute boundaries', () => {
  const nc = { id: 'nc', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 };
  const partialDuty = { ...DAY_DUTY, id: 'partial', startTime: '09:20', endTime: '10:00' };
  const objective = createSchedulingObjective(input({ sessions: [session('a', '09:00', '10:00')],
    clinicSetup: { openTime: '09:00', closeTime: '10:00' }, roles: [nc],
    dutyWindows: [DAY_DUTY, partialDuty], nurses: [makeNurse('one', { capabilityIds: ['nc'] }), makeNurse('two')],
    rules: rules.map(r => r.templateKey === 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS' ? { ...r, enabled: true, severity: 'HARD', value: 1 } : r) }));
  const empty = objective.score([], []);
  const free = objective.score([shift('float', 'one', { kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'role-float', dutyWindowId: partialDuty.id })], []);
  assert.equal(empty.requiredNurseClinicMinutes, 60);
  assert.equal(free.requiredNurseClinicMinutes, 20);
  assert.ok(compareSchedulingScores(free, empty) < 0);
});

test('soft or disabled Nurse Clinic rules do not become implicit hard constraints', () => {
  for (const enabled of [true, false]) {
    const objective = createSchedulingObjective(input({ rules: rules.map(r => r.templateKey === 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS'
      ? { ...r, enabled, severity: 'SOFT', value: 2 } : r) }));
    assert.equal(objective.score([], []).requiredNurseClinicMinutes, 0);
  }
});

test('the existing maximum hours rule alone determines hard overtime feasibility', () => {
  const hard = { id: 'rule-h7-max-hours', name: 'Hours limit', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: true, severity: 'HARD', value: 100 } as Rule;
  const common = input({ schedule: makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 4 }) });
  const on = createSchedulingObjective({ ...common, rules: [...rules, hard] }).score([shift('full')]);
  const off = createSchedulingObjective({ ...common, rules: [...rules, { ...hard, enabled: false }] }).score([shift('full')]);
  const soft = createSchedulingObjective({ ...common, rules: [...rules, { ...hard, severity: 'SOFT' }] }).score([shift('full')]);
  assert.ok(on.hardViolations > 0); assert.equal(off.hardViolations, 0); assert.equal(soft.hardViolations, 0);
  assert.equal(off.hoursImbalance, soft.hoursImbalance);
});

test('one extra minute of doctor cover wins before any lower priority preference penalty', () => {
  const nurses = [makeNurse('one', { preferences: [{ kind: 'DOCTOR', refId: 'a', rank: 1000000 }],
    doctorEligibility: { doctorIds: ['a'], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-17T09:00:00Z' } }),
  makeNurse('two', { preferences: [{ kind: 'DOCTOR', refId: 'a', rank: 1 }] })];
  const objective = createSchedulingObjective(input({ nurses }));
  const full = objective.score([shift('full')], []);
  const preferred = objective.score([shift('partial', 'two', { doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '16:59' }] })], []);
  assert.ok(full.preferencePenalty > preferred.preferencePenalty);
  assert.ok(compareSchedulingScores(full, preferred) < 0);
});

test('inactive or clinically denied staff never supply objective doctor coverage', () => {
  const objective = createSchedulingObjective(input({ nurses: [makeNurse('one', { doctorEligibility: { doctorIds: [], specialtyIds: [],
    reviewedBy: 'lead', reviewedAt: '2026-11-17T09:00:00Z' } }), makeNurse('two', { active: false })] }));
  assert.equal(objective.score([shift('denied'), shift('inactive', 'two')], []).uncoveredDoctorMinutes, 480);
});

test('equivalent generated time representations are not unnecessary changes', () => {
  const baseline = shift('old', 'one', { doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '17:00' }] });
  const objective = createSchedulingObjective(input({ baselineAssignments: [baseline] }));
  const equivalent = shift('new-id', 'one', { doctorCoverage: [{ doctorId: 'a', startTime: '13:00', endTime: '17:00' },
    { doctorId: 'a', startTime: '09:00', endTime: '13:00' }] });
  assert.equal(objective.score([equivalent], []).changedDutyCount, 0);
  assert.equal(objective.score([], []).changedDutyCount, 1);
});

test('protected manual changes and changes outside selected dates stay hard violations', () => {
  const manual = shift('manual', 'one', { source: 'MANUAL' });
  const outside = shift('outside', 'two', { date: nextDate });
  const objective = createSchedulingObjective(input({ schedule: makeSchedule({ startDate: date, endDate: nextDate }),
    baselineAssignments: [manual, outside], selectedDates: [date] }));
  assert.equal(objective.score([manual, outside], []).hardViolations, 0);
  assert.ok(objective.score([{ ...manual, dutyWindowId: 'other' }, outside], []).hardViolations > 0);
  assert.ok(objective.score([manual], []).hardViolations > 0);
});

test('objective evaluation does not change its context or candidate assignments', () => {
  const setup = input(); const candidate = [shift('same')]; const before = JSON.stringify({ setup, candidate });
  const objective = createSchedulingObjective(setup); objective.score(candidate); objective.coverageGaps(candidate);
  assert.equal(JSON.stringify({ setup, candidate }), before);
});

test('required dedicated Nurse Clinic quota remains visible during optimistic candidate ranking', () => {
  const objective = createSchedulingObjective(input({ sessions: [], rules: rules.map(r => r.templateKey === 'DEDICATED_NURSE_CLINIC'
    ? { ...r, enabled: true, severity: 'HARD', value: 1 } : r) }));
  assert.equal(objective.score([], []).hardViolations, 1);
  assert.equal(objective.score([], []).hardMagnitude, 1);
  assert.equal(objective.score([]).hardViolations, 1);
});

test('a partly unmet dedicated Nurse Clinic quota cannot lose another nurse under the same finding', () => {
  const existing = shift('nc', 'one', { kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'role-nurse-clinic' });
  const after = [{ ...existing, clinicalRoleId: 'role-float' }];
  const objective = createSchedulingObjective(input({ sessions: [], baselineAssignments: [existing],
    nurses: [makeNurse('one', { capabilityIds: ['role-nurse-clinic'] })],
    roles: [{ id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 2 }],
    rules: rules.map(r => r.templateKey === 'DEDICATED_NURSE_CLINIC'
      ? { ...r, enabled: true, severity: 'HARD', value: 2 } : r) }));
  const priorFindings = objective.validate([existing]), nextFindings = objective.validate(after);
  assert.deepEqual(nextFindings, priorFindings);
  assert.equal(objective.score([existing]).hardMagnitude, 1);
  assert.equal(objective.score(after).hardMagnitude, 2);
  assert.equal(objective.admissible([existing], after, priorFindings, nextFindings), false);
});

test('an assignment pin cannot disappear, and an unmaterialized pin admits only its exact duty', () => {
  const lock = makeLock('one', date, { assignmentKind: 'DOCTOR', targetRefId: 'a' });
  const materialized = shift('pin', 'one', { source: 'LOCK', locked: true });
  const objective = createSchedulingObjective(input({ locks: [lock], baselineAssignments: [] }));
  assert.equal(objective.admissible([], []), false);
  assert.equal(objective.admissible([], [materialized]), true);
  assert.equal(objective.admissible([], [{ ...materialized, doctorId: 'b' }]), false);
  assert.equal(objective.score([], []).hardViolations, 1);
});

test('authoritative pins replace stale manual duty choices, while matching pinned records remain exact', () => {
  const manual = shift('manual', 'one', { source: 'MANUAL', note: 'Keep this note' });
  const off = makeLock('one', date, { mode: 'OFF' });
  const offObjective = createSchedulingObjective(input({ locks: [off], baselineAssignments: [manual] }));
  assert.equal(offObjective.admissible([manual], []), true);
  assert.equal(offObjective.admissible([manual], [manual]), false);
  const pin = makeLock('one', date, { assignmentKind: 'DOCTOR', targetRefId: 'b' });
  const changed = shift('new-pin', 'one', { doctorId: 'b', source: 'LOCK', locked: true });
  assert.equal(createSchedulingObjective(input({ locks: [pin], baselineAssignments: [manual] })).admissible([manual], [changed]), true);
  const original = { ...changed, note: 'The saved duty note', allocationReview: null };
  const objective = createSchedulingObjective(input({ locks: [pin], baselineAssignments: [original] }));
  assert.equal(objective.admissible([original], [original]), true);
  assert.equal(objective.admissible([original], [{ ...original, note: 'Replaced automatically' }]), false);
});

test('an unchanged old generated pin stays protected even when its source is not LOCK', () => {
  const pinned = shift('pinned', 'one', { locked: true, note: 'Saved note' });
  const objective = createSchedulingObjective(input({ baselineAssignments: [pinned] }));
  assert.equal(objective.admissible([pinned], [pinned]), true);
  assert.equal(objective.admissible([pinned], [{ ...pinned, note: undefined }]), false);
});

test('new automatic lock materialization cannot invent manual overlap intent', () => {
  const lock = makeLock('one', date, { assignmentKind: 'DOCTOR', targetRefId: 'a' });
  const candidate = shift('pin', 'one', { source: 'LOCK', locked: true,
    manualDoctorOverlaps: [{ doctorId: 'a', date, startTime: '09:00', endTime: '10:00', nurseIds: ['one', 'two'],
      members: [{ assignmentId: 'pin', signature: 'fabricated' }, { assignmentId: 'other', signature: 'fabricated' }],
      recordedBy: 'automatic', recordedAt: '2026-11-17T10:00:00Z' }] });
  const objective = createSchedulingObjective(input({ locks: [lock], baselineAssignments: [] }));
  assert.equal(objective.admissible([], [candidate]), false);
});

test('existing unavailable protected manual data remains visible while valid cover improves', () => {
  const manual = shift('manual', 'one', { source: 'MANUAL' });
  const denied = makeNurse('one', { doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-17T10:00:00Z' } });
  const objective = createSchedulingObjective(input({ baselineAssignments: [manual], nurses: [denied, makeNurse('two')] }));
  const after = [manual, shift('valid', 'two')];
  assert.equal(objective.admissible([manual], after), true);
  assert.equal(objective.score(after).uncoveredDoctorMinutes, 0);
});

test('automatic overlaps and illegal hours remain forbidden when old finding ids and amounts are unchanged', () => {
  const before = [shift('one'), shift('two', 'two')];
  const objective = createSchedulingObjective(input({ baselineAssignments: before, nurses: ['one', 'two', 'three'].map(id => makeNurse(id)) }));
  assert.equal(objective.admissible(before, [shift('moved', 'three'), before[1]]), false);
  const hard = { id: 'rule-h7-max-hours', name: 'Hours limit', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: true, severity: 'HARD', value: 100 } as Rule;
  const hoursObjective = createSchedulingObjective(input({ schedule: makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 4 }),
    baselineAssignments: [before[0]], rules: [...rules, hard] }));
  assert.equal(hoursObjective.admissible([before[0]], [shift('new-id')]), false);
});

test('last resort sharing outside a preference list still requires using eligible Float cover first', async () => {
  const primary = shift('primary', 'one', { doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '17:00' }] });
  const float = shift('float', 'two', { kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'role-float', source: 'MANUAL' });
  const before = [primary, float];
  const pair = { ...primary, secondDoctorId: 'b', note: LAST_RESORT_NOTE,
    doctorCoverage: [...primary.doctorCoverage!, { doctorId: 'b', startTime: '09:00', endTime: '17:00' }] };
  const nurses = [makeNurse('one', { preferences: [{ kind: 'DOCTOR', refId: 'a', rank: 1 }] }), makeNurse('two')];
  const context = input({ nurses, sessions: [session('a'), session('b')], baselineAssignments: before });
  const objective = createSchedulingObjective(context);
  const findings = objective.validate([pair, float]);
  assert.ok(findings.some(f => f.id === 'low-acuity-float-primary' && f.severity === 'ERROR'));
  assert.equal(objective.admissible(before, [pair, float]), false);
  const searched = await searchSchedule({ ...context, initialAssignments: before }, { maxRounds: 1, maxExamined: 100 });
  assert.equal(searched.score.uncoveredDoctorMinutes, 480);
  assert.ok(searched.assignments.every(a => !a.secondDoctorId));
  assert.deepEqual(searched.assignments.find(a => a.id === float.id), float);

  const noFloat = createSchedulingObjective({ ...context, baselineAssignments: [primary] });
  assert.equal(noFloat.admissible([primary], [pair]), true);
  assert.ok(noFloat.validate([pair]).some(f => f.id === 'low-acuity-cover-primary' && f.severity === 'INFO'));
  const denied = createSchedulingObjective({ ...context, nurses: [{ ...nurses[0], doctorEligibility: {
    doctorIds: ['a'], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-17T09:00:00Z' } }, nurses[1]] });
  assert.equal(denied.score([pair, float]).uncoveredDoctorMinutes, 480);
  assert.equal(denied.admissible(before, [pair, float]), false);
});

test('soft or disabled maximum hours settings permit cover without a hidden hours goal cap', () => {
  for (const configuration of [{ enabled: false, severity: 'HARD' }, { enabled: true, severity: 'SOFT' }] as const) {
    const objective = createSchedulingObjective(input({ schedule: makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 4 }),
      rules: [...rules, { id: 'rule-h7-max-hours', name: 'Hours limit', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', value: 100, ...configuration } as Rule] }));
    assert.equal(objective.admissible([], [shift('full')]), true);
  }
});

test('empty only reallocates doctor work but keeps existing generated paid fields and identities', () => {
  const existing = shift('existing');
  const objective = createSchedulingObjective(input({ baselineAssignments: [existing], preservePaidDuties: true,
    dutyWindows: [DAY_DUTY, { ...DAY_DUTY, id: 'short', endTime: '13:00' }] }));
  const float = { ...existing, kind: 'CLINICAL_ROLE' as const, doctorId: undefined, clinicalRoleId: 'role-float' };
  assert.equal(objective.admissible([existing], [float]), true);
  assert.equal(objective.admissible([existing], []), false);
  assert.equal(objective.admissible([existing], [{ ...existing, id: 'new-id' }]), false);
  assert.equal(objective.admissible([existing], [{ ...existing, dutyWindowId: 'short' }]), false);
});

test('an empty only fill may drop an unlocked generated duty that is now unavailable', () => {
  const existing = shift('existing');
  const objective = createSchedulingObjective(input({ baselineAssignments: [existing], preservePaidDuties: true,
    availabilityRequests: [{ id: 'off', nurseId: 'one', date, available: false, status: 'APPROVED',
      submittedByNurseId: 'one', submittedAt: '2026-11-17T10:00:00Z' }] }));
  assert.equal(objective.admissible([existing], []), true);
});

test('duplicate saved shift ids cannot overwrite a different nurse during candidate admission', () => {
  const objective = createSchedulingObjective(input({ sessions: [session('a'), session('b')] }));
  assert.equal(objective.admissible([], [shift('same-id'), shift('same-id', 'two', { doctorId: 'b' })]), false);
});
