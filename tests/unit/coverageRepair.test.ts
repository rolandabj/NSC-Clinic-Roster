import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, ClinicalRole, DoctorSession, DutyWindow, LeaveEntry, Nurse, Rule } from '../../src/types';
import { repairCoverage, type CoverageRepairContext } from '../../src/services/engine/coverageRepair';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { resolveClinicSetup } from '../../src/services/engine/clinicModel';
import { outsideNurseList } from '../../src/services/engine/nurseList';
import { ANNUAL_LEAVE, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';

const dates = ['2026-12-16', '2026-12-17', '2026-12-18'];
const duty = (id: string, startTime: string, endTime: string): DutyWindow =>
  ({ id, name: id, acronym: id, startTime, endTime, active: true, color: '#000000' });
const FULL = duty('full', '09:00', '21:00');
const DAY = duty('day', '09:00', '17:00');
const doctors = ['peds', 'general'].map(id => ({ id, fullName: id, specialtyIds: [id], weeklyPattern: [], active: true }));
const specialties = doctors.map(d => ({ id: d.id, name: d.id, code: d.id }));
const staff = [makeNurse('amy', { preferences: [{ kind: 'SPECIALTY', refId: 'peds', rank: 1 }, { kind: 'SPECIALTY', refId: 'general', rank: 2 }] }),
  makeNurse('ben', { preferences: [{ kind: 'SPECIALTY', refId: 'general', rank: 1 }] })];
const session = (doctorId: string, date: string, startTime = '09:00', endTime = '21:00'): DoctorSession =>
  ({ id: `${doctorId}-${date}`, doctorId, date, startTime, endTime, specialtyId: doctorId, source: 'MANUAL', cancelled: false } as DoctorSession);
const shift = (id: string, nurseId: string, date: string, dutyWindowId = FULL.id, doctorId?: string): Assignment =>
  ({ id, scheduleId: 'sched-1', nurseId, date, dutyWindowId, source: 'GENERATED', locked: false,
    ...(doctorId ? { kind: 'DOCTOR', doctorId } : { kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', note: 'Float' }) });

function context(assignments: Assignment[], sessions: DoctorSession[], options: {
  duties?: DutyWindow[]; nurses?: Nurse[]; leave?: LeaveEntry[]; rules?: Rule[]; movable?: CoverageRepairContext['movable']; roles?: ClinicalRole[]; minFreeNurses?: number;
} = {}): CoverageRepairContext {
  const nurses = options.nurses || staff;
  const duties = options.duties || [FULL, DAY];
  const rules = options.rules || hoursOnlyRules();
  const leave = options.leave || [];
  const schedule = makeSchedule({ startDate: dates[0], endDate: dates[2], hoursTargetFullTime: 100 });
  return { assignments, dates, sessions, nurses, duties, roles: options.roles || [], clinic: resolveClinicSetup(), minFreeNurses: options.minFreeNurses || 0,
    movable: options.movable || (a => a.source === 'GENERATED' && !a.locked),
    canWorkOnDate: (id, date) => !leave.some(l => l.nurseId === id && l.approved && l.startDate <= date && l.endDate >= date),
    canPair: (id, sess) => !outsideNurseList(nurses.find(n => n.id === id)!,
      { kind: 'DOCTOR', doctorId: sess.doctorId, date: sess.date }, { doctors, specialties, sessions }),
    validate: list => ScheduleValidator.validate(schedule, list, nurses, [SENIOR], duties, sessions,
      leave, [], options.roles || [], rules, [], specialties, doctors, [ANNUAL_LEAVE]).findings };
}
const hours = (list: Assignment[], duties = [FULL, DAY]) => Object.fromEntries(staff.map(n => [n.id,
  list.filter(a => a.nurseId === n.id).reduce((sum, a) => {
    const d = duties.find(d => d.id === a.dutyWindowId)!;
    return sum + (Number(d.endTime.slice(0, 2)) - Number(d.startTime.slice(0, 2)));
  }, 0)]));

test('moves a generated spare duty to an uncovered session without changing nurse hours or inputs', async () => {
  const assignments = [shift('float', 'amy', dates[0]), shift('keep', 'ben', dates[0], FULL.id, 'general')];
  const original = JSON.stringify(assignments);
  const result = await repairCoverage(context(assignments, [session('general', dates[0]), session('peds', dates[2])]));
  assert.equal(result.assignments.find(a => a.doctorId === 'peds')?.date, dates[2]);
  assert.deepEqual(hours(result.assignments), hours(assignments));
  assert.equal(JSON.stringify(assignments), original);
  assert.equal(result.assignments.find(a => a.id === 'keep'), assignments[1]);
});

test('does not move manual, pinned or retained generated duties', async () => {
  for (const protectedShift of [
    { ...shift('manual', 'amy', dates[0]), source: 'MANUAL' as const },
    { ...shift('pinned', 'amy', dates[0]), locked: true },
    shift('retained', 'amy', dates[0]),
  ]) {
    const result = await repairCoverage(context([protectedShift], [session('peds', dates[2])],
      { movable: a => a.source === 'GENERATED' && !a.locked && a.id !== 'retained' }));
    assert.deepEqual(result.assignments, [protectedShift]);
  }
});

test('refuses a move onto approved leave', async () => {
  const assignments = [shift('float', 'amy', dates[0])];
  const result = await repairCoverage(context(assignments, [session('peds', dates[2])],
    { leave: [makeLeave({ nurseId: 'amy', startDate: dates[2], endDate: dates[2] })] }));
  assert.deepEqual(result.assignments, assignments);
});

test('does not borrow the only cover from another doctor session', async () => {
  const assignments = [shift('needed', 'amy', dates[0], FULL.id, 'general')];
  const result = await repairCoverage(context(assignments, [session('general', dates[0]), session('peds', dates[2])]));
  assert.deepEqual(result.assignments, assignments);
});

test('never creates a pairing outside the nurse list to close a gap', async () => {
  const assignments = [shift('float', 'ben', dates[0])];
  const result = await repairCoverage(context(assignments, [session('peds', dates[2])]));
  assert.deepEqual(result.assignments, assignments);
});

test('exchanges two duties across dates when the donor doctor still needs a nurse', async () => {
  const assignments = [shift('general', 'amy', dates[0], FULL.id, 'general'), shift('float', 'ben', dates[2])];
  const result = await repairCoverage(context(assignments, [session('general', dates[0]), session('peds', dates[2])]));
  assert.equal(result.assignments.find(a => a.doctorId === 'peds')?.nurseId, 'amy');
  assert.equal(result.assignments.find(a => a.doctorId === 'general')?.nurseId, 'ben');
  assert.deepEqual(hours(result.assignments), hours(assignments));
});

test('exchanges jobs on the same day to release the nurse eligible for an uncovered doctor', async () => {
  const assignments = [shift('general', 'amy', dates[2], FULL.id, 'general'), shift('float', 'ben', dates[2])];
  const result = await repairCoverage(context(assignments, [session('general', dates[2]), session('peds', dates[2])]));
  assert.equal(result.assignments.find(a => a.doctorId === 'peds')?.nurseId, 'amy');
  assert.equal(result.assignments.find(a => a.doctorId === 'general')?.nurseId, 'ben');
  assert.deepEqual(hours(result.assignments), hours(assignments));
});

test('shortens optional work on another day to extend partial doctor cover at the same total hours', async () => {
  const assignments = [shift('float', 'amy', dates[0]), shift('partial', 'amy', dates[2], DAY.id, 'peds')];
  const result = await repairCoverage(context(assignments, [session('peds', dates[2])]));
  assert.equal(result.assignments.find(a => a.date === dates[2])?.dutyWindowId, FULL.id);
  assert.equal(result.assignments.find(a => a.date === dates[0])?.dutyWindowId, DAY.id);
  assert.deepEqual(hours(result.assignments), hours(assignments));
});

test('turns redundant doctor cover into useful cover without creating a gap for the original doctor', async () => {
  const assignments = [shift('one', 'amy', dates[2], FULL.id, 'general'), shift('two', 'ben', dates[2], FULL.id, 'general')];
  const result = await repairCoverage(context(assignments, [session('general', dates[2]), session('peds', dates[2])]));
  assert.equal(result.assignments.filter(a => a.doctorId === 'general').length, 1);
  assert.equal(result.assignments.find(a => a.doctorId === 'peds')?.nurseId, 'amy');
  assert.deepEqual(hours(result.assignments), hours(assignments));
});

test('rejects a complete exchange if it creates a rest violation around either moved duty', async () => {
  const early = duty('early', '07:00', '19:00');
  const assignments = [shift('float', 'amy', dates[0], early.id),
    { ...shift('fixed', 'amy', dates[1]), source: 'MANUAL' as const }];
  const result = await repairCoverage(context(assignments, [session('peds', dates[2], '07:00', '19:00')], { duties: [early, FULL] }));
  assert.deepEqual(result.assignments, assignments);
});


test('does not create a short Nurse Clinic gap while moving spare hours to another day', async () => {
  const role = { id: 'nc', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 };
  const early = duty('early', '09:00', '09:40');
  const later = duty('later', '09:20', '21:00');
  const nurses = staff.map(n => ({ ...n, capabilityIds: [role.id] }));
  const assignments = [shift('bridge', 'amy', dates[0], early.id),
    { ...shift('fixed', 'ben', dates[0], later.id), source: 'MANUAL' as const }];
  const result = await repairCoverage(context(assignments, [session('peds', dates[2], '09:00', '09:40')],
    { nurses, duties: [early, later], roles: [role], minFreeNurses: 1 }));
  assert.deepEqual(result.assignments, assignments);
});

test('rejects the entire transaction when removing the donor would leave no senior', async () => {
  const assignments = [shift('float', 'amy', dates[0]),
    { ...shift('junior', 'ben', dates[0]), source: 'MANUAL' as const }];
  const nurses = [staff[0], { ...staff[1], seniorityLevelId: 'junior' }];
  const result = await repairCoverage(context(assignments, [session('peds', dates[2])], { nurses }));
  assert.deepEqual(result.assignments, assignments);
});

test('a repair with spare shifts on both sides keeps unique ids and is repeatable', async () => {
  const assignments = [shift('one', 'amy', dates[0]), shift('two', 'ben', dates[0]), shift('three', 'amy', dates[1])];
  const ctx = context(assignments, [session('peds', dates[2])]);
  const first = await repairCoverage(ctx);
  const again = await repairCoverage({ ...ctx, assignments: first.assignments });
  assert.equal(new Set(first.assignments.map(a => a.id)).size, first.assignments.length);
  assert.deepEqual(again.assignments, first.assignments);
  assert.deepEqual(hours(first.assignments), hours(assignments));
});

test('repairs a Nurse Clinic gap by moving spare qualified cover without changing doctor cover', async () => {
  const role = { id: 'nc', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 };
  const nurses = staff.map(n => ({ ...n, capabilityIds: [role.id] }));
  const assignments = [shift('spare', 'amy', dates[0]),
    { ...shift('keep', 'ben', dates[0]), source: 'MANUAL' as const }];
  const result = await repairCoverage(context(assignments, [], { nurses, roles: [role], minFreeNurses: 1 }));
  assert.ok(result.assignments.some(a => a.nurseId === 'amy' && a.date !== dates[0]));
  assert.deepEqual(hours(result.assignments), hours(assignments));
});

test('funds a longer doctor shift with a three duty exchange while another nurse covers the donor tail', async () => {
  const late = duty('late', '13:00', '21:00');
  const assignments = [shift('donor', 'amy', dates[0], FULL.id, 'general'),
    shift('partial', 'amy', dates[2], DAY.id, 'peds'), shift('helper', 'ben', dates[2], DAY.id)];
  const ctx = context(assignments, [session('general', dates[0]), session('peds', dates[2])], { duties: [FULL, DAY, late] });
  const result = await repairCoverage(ctx);
  assert.equal(result.assignments.find(a => a.doctorId === 'peds')?.dutyWindowId, FULL.id);
  assert.ok(!ctx.validate(result.assignments).some(f => /^(session-partial-|unassigned-session-)/.test(f.id)));
  assert.deepEqual(hours(result.assignments, [FULL, DAY, late]), hours(assignments, [FULL, DAY, late]));
});

test('does not remove eligible doctor cover just because an exception nurse already overlaps it', async () => {
  const assignments = [shift('eligible', 'amy', dates[2], DAY.id, 'peds'),
    { ...shift('exception', 'ben', dates[2], FULL.id, 'peds'), note: 'Last resort: none of the nurses who list this doctor was free' }];
  const result = await repairCoverage(context(assignments, [session('peds', dates[2])], { movable: a => a.id !== 'exception' }));
  assert.deepEqual(result.assignments, assignments);
});

test('can give back a whole spare duty to extend another duty at the same nurse hours', async () => {
  const short = duty('short', '09:00', '15:00');
  const assignments = [shift('spare', 'amy', dates[0], short.id), shift('partial', 'amy', dates[2], short.id, 'peds'),
    { ...shift('keep', 'ben', dates[0]), source: 'MANUAL' as const }];
  const result = await repairCoverage(context(assignments, [session('peds', dates[2])], { duties: [FULL, short] }));
  assert.equal(result.assignments.find(a => a.doctorId === 'peds')?.dutyWindowId, FULL.id);
  assert.ok(!result.assignments.some(a => a.id === 'spare'));
  assert.deepEqual(hours(result.assignments, [FULL, short]), hours(assignments, [FULL, short]));
});

test('rejects a three duty exchange if the helper is on approved leave on the donor date', async () => {
  const late = duty('late', '13:00', '21:00');
  const assignments = [shift('donor', 'amy', dates[0], FULL.id, 'general'),
    shift('partial', 'amy', dates[2], DAY.id, 'peds'), shift('helper', 'ben', dates[2], DAY.id)];
  const result = await repairCoverage(context(assignments, [session('general', dates[0]), session('peds', dates[2])],
    { duties: [FULL, DAY, late], leave: [makeLeave({ nurseId: 'ben', startDate: dates[0], endDate: dates[0] })] }));
  assert.deepEqual(result.assignments, assignments);
});

test('does not move hours into a heavier rolling week even when the total hours stay unchanged', async () => {
  const laterDates = ['2026-12-20', '2026-12-21', '2026-12-22', '2026-12-23'];
  const assignments = [shift('spare', 'amy', dates[0]), ...laterDates.map((date, i) =>
    ({ ...shift(`fixed-${i}`, 'amy', date, DAY.id), source: 'MANUAL' as const }))];
  const sessions = [session('peds', dates[2])];
  const rules = [...hoursOnlyRules(), { id: 'h9', name: 'Week hours', templateKey: 'MAX_HOURS_IN_7_DAYS', value: 40,
    enabled: true, severity: 'HARD' }] as Rule[];
  const ctx = context(assignments, sessions, { rules });
  ctx.dates = [...dates, '2026-12-19', ...laterDates];
  ctx.validate = list => ScheduleValidator.validate(makeSchedule({ startDate: dates[0], endDate: '2026-12-23', hoursTargetFullTime: 100 }),
    list, staff, [SENIOR], [FULL, DAY], sessions, [], [], [], rules, [], specialties, doctors).findings;
  assert.ok(!ctx.validate(assignments).some(f => f.id.startsWith('h9-')));
  const result = await repairCoverage(ctx);
  assert.deepEqual(result.assignments, assignments);
});

test('does not move later period hours before their budget is available', async () => {
  const assignments = [shift('spare', 'amy', dates[2])];
  const sessions = [session('peds', dates[0])];
  const rules = [...hoursOnlyRules(), { id: 'h7', name: 'Hours limit', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD',
    value: 100, enabled: true, severity: 'HARD' }] as Rule[];
  const schedule = makeSchedule({ startDate: dates[0], endDate: dates[2], hoursTargetFullTime: 16 });
  const periods = [{ id: 'first', year: '2026', name: 'First', startDate: dates[0], endDate: dates[1], workingHours: 4 },
    { id: 'second', year: '2026', name: 'Second', startDate: dates[2], endDate: dates[2], workingHours: 12 }];
  const ctx = context(assignments, sessions, { rules });
  ctx.validate = list => ScheduleValidator.validate(schedule, list, staff, [SENIOR], [FULL, DAY], sessions,
    [], [], [], rules, periods, specialties, doctors, [], { hoursHistory: { schedules: [schedule], assignments: [] } }).findings;
  assert.ok(!ctx.validate(assignments).some(f => f.id.startsWith('h7-')));
  const result = await repairCoverage(ctx);
  assert.deepEqual(result.assignments, assignments);
});

test('does not enlarge an existing rolling week violation under the same finding id', async () => {
  const short = duty('short', '09:00', '15:00');
  const later = ['2026-12-20', '2026-12-21', '2026-12-22', '2026-12-23'];
  const assignments = [shift('spare', 'amy', dates[0], short.id), shift('partial', 'amy', dates[2], short.id, 'peds'),
    { ...shift('keep', 'ben', dates[0]), source: 'MANUAL' as const },
    ...later.map((date, i) => ({ ...shift(`fixed-${i}`, 'amy', date), source: 'MANUAL' as const }))];
  const sessions = [session('peds', dates[2])];
  const rules = [...hoursOnlyRules(), { id: 'h9', name: 'Week hours', templateKey: 'MAX_HOURS_IN_7_DAYS', value: 40,
    enabled: true, severity: 'HARD' }] as Rule[];
  const ctx = context(assignments, sessions, { rules, duties: [FULL, short] });
  ctx.dates = [...dates, '2026-12-19', ...later];
  ctx.validate = list => ScheduleValidator.validate(makeSchedule({ startDate: dates[0], endDate: '2026-12-23', hoursTargetFullTime: 100 }),
    list, staff, [SENIOR], [FULL, short], sessions, [], [], [], rules, [], specialties, doctors).findings;
  assert.ok(ctx.validate(assignments).some(f => f.id.startsWith('h9-')));
  const result = await repairCoverage(ctx);
  assert.deepEqual(result.assignments, assignments);
});

test('keeps each period total unchanged even when a cross period move would fit the overall hours limit', async () => {
  const assignments = [shift('spare', 'amy', dates[2])];
  const ctx = context(assignments, [session('peds', dates[0])]);
  ctx.hoursCheckpoints = [dates[1]];
  const result = await repairCoverage(ctx);
  assert.deepEqual(result.assignments, assignments);
});

test('counts retained inactive shift cover but does not move an inactive duty to another day', async () => {
  const inactive = { ...FULL, id: 'inactive', active: false };
  const assignments = [shift('spare', 'amy', dates[0]),
    { ...shift('fixed', 'ben', dates[0], inactive.id, 'general'), source: 'MANUAL' as const }];
  const result = await repairCoverage(context(assignments, [session('general', dates[0]), session('peds', dates[2])],
    { duties: [FULL, inactive] }));
  assert.equal(result.assignments.find(a => a.doctorId === 'peds')?.nurseId, 'amy');
  assert.deepEqual(result.assignments.find(a => a.id === 'fixed'), assignments[1]);
  const frozen = [shift('old', 'amy', dates[0], inactive.id)];
  const unchanged = await repairCoverage(context(frozen, [session('peds', dates[2])], { duties: [FULL, inactive] }));
  assert.deepEqual(unchanged.assignments, frozen);
});
