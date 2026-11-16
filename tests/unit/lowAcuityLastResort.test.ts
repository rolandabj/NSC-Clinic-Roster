import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, ClinicalRole, Doctor, DoctorSession, DutyWindow, LeaveEntry, LockEntry, Nurse, Rule } from '../../src/types';
import { buildRosterReview } from '../../src/services/reports/rosterReview';
import { applySeparateFloatCover } from '../../src/services/engine/lowAcuityLastResort';
import { resolveClinicSetup } from '../../src/services/engine/clinicModel';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { publicationReport } from '../../src/services/publish/publicationChecks';
import { approveAllocation } from '../../src/services/engine/allocationReview';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeLock, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-22';
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 });
const doctors = ['one', 'two'].map(id => ({ id, fullName: `Dr ${id}`, active: true, lowAcuity: true, specialtyIds: [], weeklyPattern: [] } as Doctor));
const sessions = doctors.map(d => ({ id: d.id, doctorId: d.id, date, startTime: '09:00', endTime: '17:00', cancelled: false, source: 'MANUAL' } as DoctorSession));
const staff = [makeNurse('amy'), makeNurse('ben')];
const pair: Assignment = { id: 'pair', scheduleId: schedule.id, nurseId: 'amy', date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: 'one', secondDoctorId: 'two', source: 'GENERATED', locked: false };
const float: Assignment = { ...pair, id: 'float', nurseId: 'ben', kind: 'CLINICAL_ROLE', doctorId: undefined, secondDoctorId: undefined, clinicalRoleId: 'role-float' };
const roles = ['NC', 'PHL'].map(acronym => ({ id: acronym, name: acronym, acronym, defaultDailyQuota: 0 } as ClinicalRole));
const freeRules = [...hoursOnlyRules().filter(r => r.templateKey !== 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS'), {
  id: 'plus', templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', enabled: true, severity: 'HARD', value: 1,
} as Rule];
interface Options { nurses?: Nurse[]; duties?: DutyWindow[]; leave?: LeaveEntry[]; locks?: LockEntry[]; rules?: Rule[]; roles?: ClinicalRole[] }
function check(list = [pair, float], o: Options = {}) {
  return ScheduleValidator.validate(schedule, list, o.nurses || staff, [SENIOR], o.duties || [DAY_DUTY], sessions,
    o.leave || [], o.locks || [], o.roles || [], o.rules || hoursOnlyRules(), [], [], doctors, [], { openTime: '09:00', closeTime: '17:00' });
}
const floatProblem = (r: ReturnType<typeof check>) => r.findings.find(f => f.id.startsWith('low-acuity-float-'));
const pairNote = (r: ReturnType<typeof check>) => r.findings.find(f => f.id.startsWith('low-acuity-cover-'));
const generate = (nurses = staff) => SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], nurses, [SENIOR], [DAY_DUTY], [], [], sessions, [], [], hoursOnlyRules(), undefined, [], doctors);

test('two available nurses cover two low acuity doctors separately instead of generating a pair and Float', async () => {
  const result = await generate();
  assert.equal(result.assignments.filter(a => a.kind === 'DOCTOR').length, 2);
  assert.ok(result.assignments.every(a => !a.secondDoctorId));
  assert.equal(result.assignments.length, 2);
});
test('a shortage still permits a last resort paired duty with hours counted once', async () => {
  const result = await generate([staff[0]]);
  assert.equal(result.assignments.length, 1);
  assert.ok(result.assignments[0].secondDoctorId);
  const note = pairNote(check(result.assignments, { nurses: [staff[0]] }));
  assert.match(note!.message, /last resort/i);
  assert.match(note!.message, /Float/);
});
test('an eligible Float replacement blocks publication and suppresses the last resort note', () => {
  const draft = check();
  const problem = floatProblem(draft);
  assert.ok(problem);
  assert.match(problem.message, /Nurse ben/);
  assert.deepEqual(new Set(problem.affectedNurseIds), new Set(['amy', 'ben']));
  assert.ok(!pairNote(draft));
  const report = publicationReport(draft, [pair, float], staff, { doctors, sessions, specialties: [] });
  assert.equal(floatProblem(report)?.severity, 'ERROR');
});
test('a Float eligible for only the primary doctor can still replace avoidable shared cover', () => {
  const nurses = [staff[0], makeNurse('ben', { doctorEligibility: { doctorIds: ['one'], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-15T10:00:00Z' } })];
  assert.ok(floatProblem(check([pair, float], { nurses })));
});
test('a Float working different hours does not prevent last resort sharing', () => {
  const late = { ...DAY_DUTY, id: 'late', startTime: '17:00', endTime: '21:00' };
  const report = check([pair, { ...float, dutyWindowId: late.id }], { duties: [DAY_DUTY, late] });
  assert.ok(!floatProblem(report));
  assert.ok(pairNote(report));
});
test('partial eligible Float cover must replace sharing during its available hours', () => {
  const early = { ...DAY_DUTY, id: 'early', endTime: '13:00' };
  const report = check([pair, { ...float, dutyWindowId: early.id }], { duties: [DAY_DUTY, early] });
  assert.equal(floatProblem(report)?.severity, 'ERROR');
  assert.match(floatProblem(report)!.message, /09:00 to 13:00/);
  assert.ok(!pairNote(report));
});
test('two Float duties can provide a complete handover instead of a paired clinic', () => {
  const duties = [{ ...DAY_DUTY, id: 'early', endTime: '13:00' }, { ...DAY_DUTY, id: 'late', startTime: '13:00' }, DAY_DUTY];
  const list = [pair, { ...float, dutyWindowId: 'early' }, { ...float, id: 'late-float', nurseId: 'cara', dutyWindowId: 'late' }];
  assert.ok(floatProblem(check(list, { duties, nurses: [...staff, makeNurse('cara')] })));
});
test('an ineligible Float does not prevent last resort sharing', () => {
  const nurses = [staff[0], makeNurse('ben', { doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-15T10:00:00Z' } })];
  assert.ok(!floatProblem(check([pair, float], { nurses })));
});
test('a Float needed for the minimum free nurse cover cannot be consumed by a doctor', () => {
  const nurses = staff.map(n => ({ ...n, capabilityIds: ['NC', 'PHL'] }));
  const report = check([pair, float], { nurses, roles, rules: freeRules });
  assert.ok(!floatProblem(report));
  assert.ok(pairNote(report));
});
test('a spare Float can replace shared cover while another nurse preserves Nurse Clinic', () => {
  const nurses = [...staff, makeNurse('cara')].map(n => ({ ...n, capabilityIds: ['NC', 'PHL'] }));
  const report = check([pair, float, { ...float, id: 'float-cara', nurseId: 'cara' }], { nurses, roles, rules: freeRules });
  assert.ok(floatProblem(report));
});
test('Nurse Clinic only nurses on Float duties cannot replace either doctor', () => {
  assert.ok(!floatProblem(check([pair, float], { nurses: [staff[0], { ...staff[1], isClinicNurse: false, capabilityIds: ['NC', 'PHL'] }], roles })));
});
test('a Float on approved leave is not an available replacement', () => {
  assert.ok(!floatProblem(check([pair, float], { leave: [makeLeave({ nurseId: 'ben', startDate: date, endDate: date })] })));
});
test('inactive nurses and pinned Float duties do not count as available replacements', () => {
  assert.ok(!floatProblem(check([pair, float], { nurses: [staff[0], { ...staff[1], active: false }] })));
  assert.ok(!floatProblem(check([pair, { ...float, locked: true }])));
  assert.ok(!floatProblem(check([pair, float], { locks: [makeLock('ben', date)] })));
});
test('an allocation approval cannot waive avoidable shared cover', () => {
  const reviewed = { ...pair, allocationReview: approveAllocation(pair, 'lead', 'Reviewed', '2026-11-15T10:00:00Z') };
  assert.equal(floatProblem(publicationReport(check([reviewed, float]), [reviewed, float], staff, { doctors, sessions, specialties: [] }))?.severity, 'ERROR');
});
test('removing or assigning the Float updates the derived availability finding', () => {
  assert.ok(floatProblem(check()));
  assert.ok(!floatProblem(check([pair])));
  assert.ok(!floatProblem(check([{ ...pair, secondDoctorId: undefined }, { ...float, kind: 'DOCTOR', doctorId: 'two', clinicalRoleId: undefined }])));
});

const finalContext = (assignments = [pair, float]) => ({ assignments, nurses: staff, duties: [DAY_DUTY], doctors,
  specialties: [], sessions, roles: [], leave: [], locks: [], requests: [], clinic: resolveClinicSetup({ openTime: '09:00', closeTime: '17:00' }), minFreeNurses: 0 });
test('the final pass splits a pair after top up creates Float cover without changing dates or hours', () => {
  const before = [pair, float];
  const saved = JSON.stringify(before);
  const after = applySeparateFloatCover(finalContext(before), () => true);
  assert.equal(JSON.stringify(before), saved);
  assert.ok(after.every(a => a.kind === 'DOCTOR' && !a.secondDoctorId));
  assert.deepEqual(new Set(after.map(a => a.doctorId)), new Set(['one', 'two']));
  assert.deepEqual(after.map(a => [a.id, a.nurseId, a.date, a.dutyWindowId]), before.map(a => [a.id, a.nurseId, a.date, a.dutyWindowId]));
  assert.ok(!check(after).findings.some(f => /^(session-partial-|unassigned-session-|session-overlap-|low-acuity-float-)/.test(f.id)));
});
test('the final pass preserves retained pairs and retained Float duties', () => {
  const before = [pair, float];
  assert.deepEqual(applySeparateFloatCover(finalContext(before), () => false), before);
  assert.deepEqual(applySeparateFloatCover({ ...finalContext(before), movable: () => false }, () => true), before);
});
test('the final pass hands the primary doctor to a Float when that is the only eligible replacement', () => {
  const context = finalContext();
  context.nurses = [staff[0], makeNurse('ben', { doctorEligibility: { doctorIds: ['one'], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-15T10:00:00Z' } })];
  const after = applySeparateFloatCover(context, () => true);
  assert.equal(after.find(a => a.nurseId === 'ben')?.doctorId, 'one');
  assert.equal(after.find(a => a.nurseId === 'amy')?.doctorId, 'two');
  assert.ok(after.every(a => !a.secondDoctorId));
});
test('generation retains a necessary pair when the other nurse must stay free for Nurse Clinic', async () => {
  const nurses = staff.map(n => ({ ...n, capabilityIds: ['NC', 'PHL'] }));
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], nurses, [SENIOR], [DAY_DUTY], roles, [], sessions,
    [], [], freeRules, undefined, [], doctors, [], { openTime: '09:00', closeTime: '17:00' });
  assert.equal(result.assignments.filter(a => a.secondDoctorId).length, 1);
  const report = check(result.assignments, { nurses, roles, rules: freeRules });
  assert.ok(!floatProblem(report));
  assert.ok(Object.values(report.hourlyCoverageMap[date]).every(h => h.deficit === 0 && h.uncoveredDoctors === 0));
});

test('the exported review directs the planner to use Float cover rather than approve an avoidable pair', () => {
  const review = buildRosterReview(check(), [pair, float], staff, { doctors, sessions, specialties: [] }, []);
  const blocker = review.publication.blockers.find(b => b.rule === 'low-acuity-float');
  assert.equal(blocker?.type, 'ARRANGE_COVER');
  assert.match(blocker!.instruction, /eligible Float nurses/);
  assert.equal(review.publication.canProceed, false);
});
test('an absent Nurse Clinic nurse cannot make the only working Float look available for doctor work', () => {
  const nurses = [...staff, makeNurse('cara')].map(n => ({ ...n, capabilityIds: ['NC', 'PHL'] }));
  const nc: Assignment = { ...float, id: 'nc-cara', nurseId: 'cara', clinicalRoleId: 'NC' };
  const report = check([pair, float, nc], { nurses, roles, rules: freeRules,
    leave: [makeLeave({ nurseId: 'cara', startDate: date, endDate: date })] });
  assert.ok(!floatProblem(report));
});
test('one Float covering the primary session is preferred to a two Float handover for the second doctor', () => {
  const reviewed = (doctorIds: string[]) => ({ doctorIds, specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-15T10:00:00Z' });
  const nurses = [staff[0], makeNurse('ben', { doctorEligibility: reviewed(['two']) }),
    makeNurse('cara', { doctorEligibility: reviewed(['two']) }), makeNurse('dana', { doctorEligibility: reviewed(['one']) })];
  const duties = [DAY_DUTY, { ...DAY_DUTY, id: 'early', endTime: '13:00' }, { ...DAY_DUTY, id: 'late', startTime: '13:00' }];
  const assignments = [pair, { ...float, dutyWindowId: 'early' },
    { ...float, id: 'float-cara', nurseId: 'cara', dutyWindowId: 'late' }, { ...float, id: 'float-dana', nurseId: 'dana' }];
  const result = applySeparateFloatCover({ ...finalContext(assignments), nurses, duties }, () => true);
  assert.equal(result.find(a => a.nurseId === 'dana')?.doctorId, 'one');
  assert.equal(result.find(a => a.nurseId === 'amy')?.doctorId, 'two');
  assert.equal(result.filter(a => a.kind === 'DOCTOR').length, 2);
});
