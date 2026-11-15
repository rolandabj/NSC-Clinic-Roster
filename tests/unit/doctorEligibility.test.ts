import { test } from 'node:test';
import assert from 'node:assert/strict';
import { outsideNurseList } from '../../src/services/engine/nurseList';
import { checkAssignment } from '../../src/services/engine/assignmentChecks';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Doctor, DoctorSession, Nurse } from '../../src/types';

const date = '2026-12-18';
const doctors = ['peds', 'derma'].map(id => ({ id, fullName: id, specialtyIds: [id], active: true, weeklyPattern: [] } as Doctor));
const specialties = doctors.map(d => ({ id: d.id, name: d.id, code: d.id }));
const sessions = doctors.map(d => ({ id: d.id, doctorId: d.id, specialtyId: d.id, date, startTime: '09:00', endTime: '17:00', cancelled: false, source: 'MANUAL' } as DoctorSession));
const eligibility = (doctorIds: string[] = [], specialtyIds: string[] = []) =>
  ({ doctorIds, specialtyIds, reviewedAt: '2026-11-15T10:00:00.000Z', reviewedBy: 'planner-1' });
const cell = (doctorId: string): Assignment => ({ id: 'a', scheduleId: 'sched-1', nurseId: 'n', date,
  dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId, source: 'GENERATED', locked: false });
const refs = { doctors, specialties, sessions };
const prefs = [{ kind: 'SPECIALTY' as const, refId: 'peds', rank: 1 }];

test('legacy nurse profiles keep their existing preference allocation rules', () => {
  assert.equal(outsideNurseList(makeNurse('n', { preferences: prefs }), cell('peds'), refs), null);
  assert.ok(outsideNurseList(makeNurse('n', { preferences: prefs }), cell('derma'), refs));
  assert.equal(outsideNurseList(makeNurse('n'), cell('derma'), refs), null);
});

test('reviewed eligibility permits nonpreferred work and blocks preferred work outside eligibility', () => {
  const nurse = makeNurse('n', { preferences: prefs, doctorEligibility: eligibility(['derma']) });
  assert.equal(outsideNurseList(nurse, cell('derma'), refs), null);
  assert.ok(outsideNurseList(nurse, cell('peds'), refs)?.eligibility);
});

test('an explicitly empty or unreviewed eligibility list never means unrestricted', () => {
  for (const doctorEligibility of [eligibility(), { ...eligibility(['peds']), reviewedBy: '' }]) {
    assert.ok(outsideNurseList(makeNurse('n', { doctorEligibility }), cell('peds'), refs));
  }
});

test('specialty eligibility follows the current doctor profile rather than a stale session specialty', () => {
  const nurse = makeNurse('n', { doctorEligibility: eligibility([], ['peds']) });
  assert.ok(outsideNurseList(nurse, cell('derma'), { ...refs, sessions: [{ ...sessions[1], specialtyId: 'peds' }] }));
});

test('neither a last resort note nor a manual exception can override clinical eligibility', () => {
  const nurse = makeNurse('n', { preferences: prefs, doctorEligibility: eligibility(['derma']) });
  for (const note of ['Last resort: none of the nurses who list this doctor was free', 'Agreed exception: not in the nurse list']) {
    const a = { ...cell('peds'), note };
    const report = ScheduleValidator.validate(makeSchedule({ startDate: date, endDate: date }), [a], [nurse], [SENIOR], [DAY_DUTY], sessions, [], [], [], hoursOnlyRules(), [], specialties, doctors);
    assert.equal(report.findings.find(f => f.id.startsWith('h8-doctor-allocation-'))?.severity, 'ERROR');
    assert.ok(checkAssignment({ assignments: [a], nurses: [nurse], dutyWindows: [DAY_DUTY], leaveEntries: [], locks: [], roles: [], rules: hoursOnlyRules(), ...refs }, a).some(r => /eligib/i.test(r)));
  }
});

test('generation and top up never use a nurse outside reviewed eligibility as a fallback', async () => {
  const nurse: Nurse = makeNurse('n', { preferences: prefs, doctorEligibility: eligibility(['derma']) });
  const result = await SchedulingEngine.generate(makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }),
    'GENERATE_ALL', [], [nurse], [SENIOR], [DAY_DUTY], [], specialties, [sessions[0]], [], [], hoursOnlyRules(), undefined, [], doctors);
  assert.ok(!result.assignments.some(a => a.doctorId === 'peds'));
  const allowed = await SchedulingEngine.generate(makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }),
    'GENERATE_ALL', [], [nurse], [SENIOR], [DAY_DUTY], [], specialties, [sessions[1]], [], [], hoursOnlyRules(), undefined, [], doctors);
  assert.ok(allowed.assignments.some(a => a.doctorId === 'derma'), 'eligible nonpreferred work remains available');
});

test('approval for one specialty does not grant another specialty of the same doctor', () => {
  const dual = { ...doctors[0], specialtyIds: ['peds', 'derma'] };
  const nurse = makeNurse('n', { doctorEligibility: eligibility([], ['peds']) });
  assert.ok(outsideNurseList(nurse, cell('peds'), { doctors: [dual], specialties,
    sessions: [{ ...sessions[0], specialtyId: 'derma' }] }));
  assert.equal(outsideNurseList(nurse, cell('peds'), { doctors: [dual], specialties, sessions: [sessions[0]] }), null);
});
