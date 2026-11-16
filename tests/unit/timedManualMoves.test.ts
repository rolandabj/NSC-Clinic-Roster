import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';
import { checkSwap, rebalancedFields, recordManualSwapOverlaps, suggestMoves } from '../../src/services/engine/handMoveChecks';
import { moveShift, swapShifts } from '../../src/services/schedule/shiftMoves';
import { manualDoctorOverlapAllowed, recordManualDoctorOverlaps } from '../../src/services/engine/manualDoctorOverlap';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-18';
const tomorrow = '2026-11-19';
const now = '2026-11-16T10:00:00Z';
const doctor = { id: 'doctor', fullName: 'Dr Morgan', active: true, weeklyPattern: [], specialtyIds: [] } as Doctor;
const session = { id: 'session', doctorId: doctor.id, date, startTime: '09:00', endTime: '17:00', source: 'MANUAL', cancelled: false } as DoctorSession;
const nurses = [makeNurse('one'), makeNurse('two'), makeNurse('three')];
const ctx = { nurses, doctors: [doctor], sessions: [session], specialties: [], roles: [], leaveEntries: [],
  locks: [], rules: hoursOnlyRules(), dutyWindows: [DAY_DUTY] };
const shift = (id: string, nurseId: string, extra: Partial<Assignment> = {}): Assignment => ({
  id, nurseId, scheduleId: 'sched-1', date, dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: doctor.id,
  doctorCoverage: [{ doctorId: doctor.id, startTime: '09:00', endTime: '17:00' }], locked: false, source: 'MANUAL', ...extra,
});
const schedule = makeSchedule({ startDate: date, endDate: tomorrow, hoursTargetFullTime: 16 });
const validate = (list: Assignment[], context = ctx) => ScheduleValidator.validate(schedule, list, context.nurses,
  [SENIOR], context.dutyWindows, context.sessions, [], [], [], context.rules, [], [], context.doctors,
  [], { openTime: '09:00', closeTime: '17:00' }).findings;

test('moving a shift or making a fairness move cannot inherit an earlier manual overlap', () => {
  const first = shift('first', 'one');
  const second = shift('second', 'two');
  const recorded = recordManualDoctorOverlaps(second, [first, second], ctx, 'planner', now);
  assert.ok(recorded.manualDoctorOverlaps?.length);
  const moved = moveShift(recorded, 'three', rebalancedFields(nurses[1]), () => 'moved');
  assert.equal(moved.manualDoctorOverlaps, undefined);
  assert.equal(rebalancedFields(nurses[1]).manualDoctorOverlaps, undefined);
  const swapped = swapShifts([first, recorded], first, recorded, { a: '', b: '' });
  assert.ok(swapped.every(a => a.manualDoctorOverlaps === undefined));
});

test('an explicit swap may repair clinical eligibility and retain actual overlap without a reason', () => {
  const denied = { ...nurses[0], doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: now } };
  const context = { ...ctx, nurses: [denied, nurses[1], nurses[2]] };
  const first = shift('first', 'one');
  const second = shift('second', 'two', { date: tomorrow, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float',
    doctorId: undefined, doctorCoverage: undefined });
  const third = shift('third', 'three');
  const assignments = [first, second, third];
  const checkRoster = (list: Assignment[]) => validate(list, context);
  assert.equal(checkRoster(assignments).some(f => f.id.startsWith('session-overlap-')), false);
  const result = checkSwap({ assignments, shiftA: first, shiftB: second, ctx: context, checkRoster,
    before: checkRoster(assignments) });
  assert.equal(result.ok, true, result.rosterIssues.join(' '));
  assert.equal(result.exceptionOnly, false);
  assert.match(result.checks.join(' '), /saved by a planner/);
});

test('saved swap overlap uses the final new ids and never persists preview metadata', () => {
  const first = shift('first', 'one');
  const second = shift('second', 'two', { date: tomorrow, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float',
    doctorId: undefined, doctorCoverage: undefined });
  const third = shift('third', 'three');
  let id = 0;
  const swapped = swapShifts([first, second, third], first, second, { a: '', b: '' }, () => `moved-${++id}`);
  const before = JSON.stringify(swapped);
  assert.equal(manualDoctorOverlapAllowed(swapped, doctor.id, date, '09:00', '17:00', ['two', 'three'], ctx), false);
  const saved = recordManualSwapOverlaps(swapped, ['moved-1', 'moved-2'], ctx, 'actual-planner', now);
  assert.equal(JSON.stringify(swapped), before);
  assert.equal(manualDoctorOverlapAllowed(saved, doctor.id, date, '09:00', '17:00', ['two', 'three'], ctx), true);
  const provenance = saved.flatMap(a => a.manualDoctorOverlaps || []);
  assert.ok(provenance.length);
  assert.ok(provenance.every(r => r.recordedBy === 'actual-planner' && r.recordedAt === now));
  assert.ok(provenance.every(r => r.members.every(m => m.assignmentId !== 'first' && m.assignmentId !== 'second')));
  assert.equal(validate(saved).find(f => f.id.startsWith('session-overlap-'))?.severity, 'WARN');
});

test('automatic fairness moves cannot create the same overlap that a manual swap may retain', () => {
  const denied = { ...nurses[0], doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: now } };
  const context = { ...ctx, nurses: [denied, nurses[1], nurses[2]] };
  const assignments = [shift('first', 'one'), shift('third', 'three')];
  const suggestions = suggestMoves({ assignments, overloaded: [{ nurse: denied, hoursDelta: 8 }],
    underloaded: [{ nurse: nurses[1] }], ctx: context, checkRoster: list => validate(list, context) });
  assert.deepEqual(suggestions, []);
});

test('fairness cannot recreate an existing automatic overlap with a different nurse', () => {
  const assignments = [shift('first', 'one', { source: 'GENERATED' }), shift('second', 'two', { source: 'GENERATED' })];
  const suggestions = suggestMoves({ assignments, overloaded: [{ nurse: nurses[0], hoursDelta: 8 }],
    underloaded: [{ nurse: nurses[2] }], ctx, checkRoster: list => validate(list) });
  assert.deepEqual(suggestions, []);
});

test('manual swap intent cannot waive clinical permission or approved leave', () => {
  const denied = { ...nurses[1], doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: now } };
  const context = { ...ctx, nurses: [nurses[0], denied, nurses[2]] };
  const first = shift('first', 'one');
  const second = shift('second', 'two', { date: tomorrow, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float',
    doctorId: undefined, doctorCoverage: undefined });
  const third = shift('third', 'three');
  const assignments = [first, second, third];
  const checkRoster = (list: Assignment[]) => validate(list, context);
  const refused = checkSwap({ assignments, shiftA: first, shiftB: second, ctx: context, checkRoster,
    before: checkRoster(assignments) });
  assert.equal(refused.ok, false);
  assert.equal(refused.exceptionOnly, false);
  assert.match(refused.issuesB.join(' '), /not eligible/);
  const absent = { ...ctx, leaveEntries: [{ id: 'leave', nurseId: 'two', leaveTypeId: 'annual', startDate: date,
    endDate: date, approved: true, hoursCredited: 8 }] };
  const onLeave = checkSwap({ assignments, shiftA: first, shiftB: second, ctx: absent,
    checkRoster: list => validate(list), before: validate(assignments) });
  assert.equal(onLeave.ok, false);
  assert.match(onLeave.issuesB.join(' '), /approved leave/);
});
