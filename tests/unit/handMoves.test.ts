import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSwap, newFindings, suggestMoves, swapNotes } from '../../src/services/engine/handMoveChecks';
import { explainNurseDay } from '../../src/services/engine/explainCell';
import { AGREED_EXCEPTION_NOTE } from '../../src/services/engine/lastResort';
import { swapShifts } from '../../src/services/schedule/shiftMoves';
import { ScheduleValidator, type ValidationFinding } from '../../src/services/validation/ScheduleValidator';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, AvailabilityRequest, Doctor, DoctorSession, DutyWindow, Rule, SeniorityLevel, Specialty } from '../../src/types';

// Batch 4 (owner's answers of 2026-10-06): a swap or fairness move the dialogs allow never
// turns into a "Must fix"; a swap outside a nurse's list only as an agreed exception.

const JUNIOR: SeniorityLevel = { id: 'jun', name: 'Staff Nurse', rank: 2, isSenior: false, color: '#999999' };
const EARLY: DutyWindow = { ...DAY_DUTY, id: 'duty-e', name: 'Early', acronym: 'E', startTime: '07:00', endTime: '15:00' };
const LATE: DutyWindow = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00' };
const LONG: DutyWindow = { ...DAY_DUTY, id: 'duty-long', name: 'Long', acronym: 'LD', startTime: '09:00', endTime: '21:00' };
const DUTIES = [DAY_DUTY, EARLY, LATE, LONG];
const SPECIALTIES = [
  { id: 'ortho', name: 'Orthopaedics', code: 'ORTHO' },
  { id: 'ent', name: 'ENT', code: 'ENT' },
] as Specialty[];
const DOCTORS = [
  { id: 'lee', fullName: 'Dr Lee', specialtyIds: ['ortho'], active: true, weeklyPattern: [] },
  { id: 'ray', fullName: 'Dr Ray', specialtyIds: ['ent'], active: true, weeklyPattern: [] },
] as unknown as Doctor[];
const AMY = makeNurse('amy', { fullName: 'Amy' });
const BEA = makeNurse('bea', { fullName: 'Bea', seniorityLevelId: JUNIOR.id });
const CARA = makeNurse('cara', { fullName: 'Cara', seniorityLevelId: JUNIOR.id, preferences: [{ kind: 'DOCTOR', refId: 'lee', rank: 1 }] });
const DAN = makeNurse('dan', { fullName: 'Dan' });
const NURSES = [AMY, BEA, CARA, DAN];

/** A shift: a doctor's id makes it a shift with that doctor. */
const shift = (nurseId: string, date: string, extra: Partial<Assignment> & { doctor?: string } = {}): Assignment => {
  const { doctor, ...rest } = extra;
  return {
    id: `${nurseId}-${date}`,
    scheduleId: 'sched-1',
    nurseId,
    date,
    dutyWindowId: DAY_DUTY.id,
    ...(doctor ? { kind: 'DOCTOR', doctorId: doctor } : { kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float' }),
    locked: false,
    source: 'GENERATED',
    ...rest,
  } as Assignment;
};
const clinic = (doctorId: string, date: string) =>
  ({ id: `${doctorId}-${date}`, doctorId, date, startTime: '09:00', endTime: '17:00', specialtyId: doctorId === 'lee' ? 'ortho' : 'ent', room: 'R1', source: 'PATTERN', cancelled: false }) as DoctorSession;
const dayOff = (nurseId: string, date: string): AvailabilityRequest =>
  ({ id: `off-${nurseId}-${date}`, nurseId, date, available: false, status: 'APPROVED', submittedByNurseId: nurseId, submittedAt: '' }) as AvailabilityRequest;

function setup(opts: { target?: number; rules?: Rule[]; sessions?: DoctorSession[]; requests?: AvailabilityRequest[] } = {}) {
  const schedule = makeSchedule({ startDate: '2026-11-16', endDate: '2026-11-22', hoursTargetFullTime: opts.target ?? 0 });
  const rules = opts.rules || hoursOnlyRules();
  const sessions = opts.sessions || [];
  const requests = opts.requests || [];
  const checkRoster = (list: Assignment[]): ValidationFinding[] =>
    ScheduleValidator.validate(schedule, list, NURSES, [SENIOR, JUNIOR], DUTIES, sessions, [], [], [], rules, [], SPECIALTIES, DOCTORS, [], undefined, requests).findings;
  const ctx = { nurses: NURSES, dutyWindows: DUTIES, leaveEntries: [], locks: [], roles: [], rules, availabilityRequests: requests, doctors: DOCTORS, specialties: SPECIALTIES, sessions };
  const swap = (assignments: Assignment[], a: Assignment, b: Assignment, prior: Assignment[] = []) =>
    checkSwap({ assignments, prior, shiftA: a, shiftB: b, ctx, checkRoster, before: checkRoster(assignments) });
  return { schedule, checkRoster, ctx, swap };
}

test('a swap that leaves a day without its only senior nurse is refused; a rule followed when possible only notes it', () => {
  // Amy (senior) works Monday alone; Bea (not senior) works Tuesday with Dan (senior).
  const roster = [shift('amy', '2026-11-16'), shift('bea', '2026-11-17'), shift('dan', '2026-11-17')];
  const refused = setup().swap(roster, roster[0], roster[1]);
  assert.equal(refused.ok, false);
  assert.equal(refused.exceptionOnly, false);
  assert.deepEqual(refused.issuesA, [], 'each shift on its own is fine');
  assert.match(refused.rosterIssues.join(' '), /No senior nurse on duty on Mon 16-11-2026/);

  const soft = [{ id: 'rule-h1', name: 'Senior on duty', templateKey: 'SENIOR_ON_DUTY', enabled: true, severity: 'SOFT', value: 1 } as unknown as Rule];
  const noted = setup({ rules: [...hoursOnlyRules(), ...soft] }).swap(roster, roster[0], roster[1]);
  assert.equal(noted.ok, true);
  assert.match(noted.checks.join(' '), /No senior nurse on duty on Mon 16-11-2026/);
});

test('a swap outside a nurse\'s list: refused unless agreed, then a Check with the mark on that shift', () => {
  // Cara lists only Dr Lee. Bea (no list) is with Dr Ray on Wednesday, Cara with Dr Lee on Thursday.
  const sessions = [clinic('ray', '2026-11-18'), clinic('lee', '2026-11-19')];
  const { swap, checkRoster } = setup({ sessions });
  const roster = [shift('cara', '2026-11-19', { doctor: 'lee' }), shift('bea', '2026-11-18', { doctor: 'ray' }), shift('dan', '2026-11-18'), shift('amy', '2026-11-19')];
  const result = swap(roster, roster[0], roster[1]);
  assert.equal(result.listA, "Dr Ray isn't in Cara's list");
  assert.equal(result.listB, null, 'Bea has no list');
  assert.equal(result.ok, false);
  assert.equal(result.exceptionOnly, true, 'nothing else is broken, so it may be agreed');
  assert.match(result.checks.join(' '), /Cara is with Dr Ray \(ENT\) on 18-11-2026 as an agreed exception/);

  // Swapped anyway: Cara's new shift carries the mark, Bea's doesn't, and the roster check shows a Check.
  const notes = swapNotes('Cara', 'Bea', 'training', { toA: true, toB: false });
  const after = swapShifts(roster, roster[0], roster[1], notes);
  const caras = after.find((a) => a.nurseId === 'cara')!;
  assert.equal(caras.doctorId, 'ray');
  assert.ok(caras.note!.startsWith(`${AGREED_EXCEPTION_NOTE}. Swapped with Bea.`));
  assert.equal(after.find((a) => a.nurseId === 'bea')!.note, 'Swapped with Cara. Reason: training');
  const h8 = checkRoster(after).filter((f) => f.id.startsWith('h8-'));
  assert.deepEqual(h8.map((f) => f.severity), ['WARN']);

  // Without the mark it would be a Must fix.
  const unmarked = swapShifts(roster, roster[0], roster[1], swapNotes('Cara', 'Bea', 'training'));
  assert.deepEqual(checkRoster(unmarked).filter((f) => f.id.startsWith('h8-')).map((f) => f.severity), ['ERROR']);
});

test('a swap onto an approved day off, or too soon after the previous roster, is refused', () => {
  // Amy has an approved day off on Wednesday (its pin was removed): she can't take Bea's Wednesday.
  const roster = [shift('amy', '2026-11-20'), shift('bea', '2026-11-18'), shift('dan', '2026-11-18'), shift('dan', '2026-11-20')];
  const offDay = setup({ requests: [dayOff('amy', '2026-11-18')] }).swap(roster, roster[0], roster[1]);
  assert.deepEqual(offDay.issuesA, ['Amy has an approved day off on 2026-11-18']);
  assert.equal(offDay.exceptionOnly, false);

  // Amy worked a Late (to 21:00) on the last day of the previous roster; Bea's Monday Early starts at 07:00.
  const prior = [shift('amy', '2026-11-15', { dutyWindowId: LATE.id, scheduleId: 'sched-0' })];
  const monday = [shift('amy', '2026-11-17'), shift('bea', '2026-11-16', { dutyWindowId: EARLY.id }), shift('dan', '2026-11-16'), shift('dan', '2026-11-17')];
  const { swap } = setup();
  assert.match(swap(monday, monday[0], monday[1], prior).issuesA.join(' '), /less than 11h rest after the previous day's duty/);
  assert.deepEqual(swap(monday, monday[0], monday[1]).issuesA, [], 'without the previous roster it would pass');
});

test('fairness suggestions: never over the hours limit, outside a list or on an approved day off', () => {
  // A one week roster with a 40 h goal (most allowed 42 h). Amy works six days (48 h).
  const week = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21'];
  const roster = [
    ...week.map((d) => shift('amy', d, d === '2026-11-19' ? { doctor: 'ray' } : {})),
    ...week.slice(0, 5).map((d) => shift('bea', d)), // Bea already at 40 h
    ...week.slice(0, 3).map((d) => shift('cara', d)), // Cara at 24 h, with an approved day off on Friday
    shift('dan', '2026-11-21'), // a senior nurse on Saturday besides Amy
  ];
  const sessions = [clinic('ray', '2026-11-19')];
  const { ctx, checkRoster } = setup({ target: 40, sessions, requests: [dayOff('cara', '2026-11-20')] });
  const input = {
    overloaded: [{ nurse: AMY, hoursDelta: 8 }],
    underloaded: [{ nurse: BEA }, { nurse: CARA }],
    assignments: roster,
    ctx,
    checkRoster,
  };
  const moves = suggestMoves(input);
  // Bea's Saturday would take her to 48 h; Cara can't take Dr Ray (not in her list) or Friday (day off).
  assert.deepEqual(moves.map((m) => `${m.date} ${m.underloadedNurse.fullName}`), ['2026-11-21 Cara']);
  assert.equal(moves[0].reason, 'Amy is 8h over their goal');
  assert.equal(moves[0].assignmentA.id, 'amy-2026-11-21');

  // It is the roster check that keeps Bea under the limit: the rules for one shift allow it.
  const withoutRosterCheck = suggestMoves({ ...input, checkRoster: undefined });
  assert.equal(`${withoutRosterCheck[0].date} ${withoutRosterCheck[0].underloadedNurse.fullName}`, '2026-11-21 Bea');
  const beaSaturday = roster.map((a) => (a.id === 'amy-2026-11-21' ? { ...a, nurseId: 'bea' } : a));
  assert.match(newFindings(checkRoster(roster), checkRoster(beaSaturday), 'ERROR').map((f) => f.message).join(' '), /Bea: 48 \/ 40 h, 8 h over \(most allowed: 42 h\)/);

  // No move without its roster check: with one check allowed, Bea's Saturday uses it up.
  assert.deepEqual(suggestMoves({ ...input, maxRosterChecks: 1 }), []);
});

test('a move that makes a Must fix bigger is refused; one that makes it smaller is not', () => {
  // A 40 h week (most allowed 42 h). Dan (a senior nurse) is already over: four Day shifts and a Long Friday, 44 h.
  const roster = [
    ...['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19'].map((d) => shift('dan', d)),
    shift('dan', '2026-11-20', { dutyWindowId: LONG.id }),
    shift('amy', '2026-11-21', { dutyWindowId: LONG.id }),
    shift('amy', '2026-11-22'),
  ];
  const { swap, checkRoster } = setup({ target: 40 });
  assert.equal(checkRoster(roster).find((f) => f.id === 'h7-hours-over-dan')?.amount, 2);

  // Dan's Wednesday (8 h) for Amy's Long Saturday (12 h): Dan would be 6 h over instead of 2.
  const worse = swap(roster, roster[2], roster[5]);
  assert.equal(worse.ok, false);
  assert.match(worse.rosterIssues.join(' '), /Dan: 48 \/ 40 h, 8 h over/);

  // Dan's Long Friday (12 h) for Amy's Sunday (8 h): back to 40 h, allowed.
  assert.equal(swap(roster, roster[4], roster[6]).ok, true);
});

test('Who could cover: an approved day off without its pin is a reason to be off', () => {
  const schedule = makeSchedule({ startDate: '2026-11-16', endDate: '2026-11-22', hoursTargetFullTime: 0 });
  const why = explainNurseDay({
    nurseId: 'amy',
    date: '2026-11-18',
    schedule,
    assignments: [],
    nurses: NURSES,
    dutyWindows: [DAY_DUTY],
    leaveEntries: [],
    locks: [],
    roles: [],
    rules: hoursOnlyRules(),
    availabilityRequests: [dayOff('amy', '2026-11-18')],
  });
  assert.equal(why.status, 'BLOCKED');
  assert.deepEqual(why.reasons, ['Has an approved day off.']);
});

test('what counts as new after a change', () => {
  const f = (id: string, severity: 'ERROR' | 'WARN') => ({ id, severity, message: id }) as ValidationFinding;
  const before = [f('x', 'ERROR'), f('y', 'WARN')];
  const after = [f('x', 'ERROR'), f('y', 'ERROR'), f('z', 'WARN'), f('x2', 'WARN')];
  assert.deepEqual(newFindings(before, after, 'ERROR').map((x) => x.id), ['y'], 'a Check turned Must fix is new');
  assert.deepEqual(newFindings(before, after, 'WARN').map((x) => x.id), ['z', 'x2']);
  assert.deepEqual(newFindings(after, before, 'WARN'), [], 'a Must fix turned Check is not new');

  const over = (amount: number) => ({ ...f('h7-hours-over-bea', 'ERROR'), amount });
  assert.deepEqual(newFindings([over(2)], [over(6)], 'ERROR').length, 1, 'bigger');
  assert.deepEqual(newFindings([over(6)], [over(2)], 'ERROR').length, 0, 'smaller');
  assert.deepEqual(newFindings([over(2)], [over(2)], 'ERROR').length, 0, 'the same');
});
