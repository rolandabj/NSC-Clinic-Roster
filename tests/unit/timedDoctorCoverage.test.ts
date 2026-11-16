import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isFreeDuring, coverageSlots, resolveClinicSetup, resolveDoctorCoverage, effectiveDoctorCoverage, doctorCoverageProblems, simultaneousDoctorIntervals, freeDoctorIntervals, canonicalDoctorCoverage, doctorCoverageFingerprint, doctorCoverageText, uncoveredParts } from '../../src/services/engine/clinicModel';
import { doctorPairingProblems } from '../../src/services/engine/doctorPairing';
import { checkAssignment } from '../../src/services/engine/assignmentChecks';
import { summarizeNurseHours } from '../../src/services/reports/hoursAccounting';
import { DAY_DUTY, makeNurse, makeSchedule, hoursOnlyRules } from './fixtures';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';

const date = '2026-11-22';
const doctors = ['a', 'b'].map(id => ({ id, fullName: `Dr ${id.toUpperCase()}`, specialtyIds: [], weeklyPattern: [], active: true, lowAcuity: false } as Doctor));
const sessions = doctors.map(d => ({ id: d.id, doctorId: d.id, date, startTime: '09:00', endTime: '21:00', cancelled: false, source: 'MANUAL' } as DoctorSession));
const duty = { ...DAY_DUTY, endTime: '21:00' };
const assignment = (coverage: unknown, secondDoctorId?: string): Assignment => ({ id: 'timed', scheduleId: 'roster', nurseId: 'nurse',
  date, dutyWindowId: duty.id, kind: 'DOCTOR', doctorId: 'a', secondDoctorId, doctorCoverage: coverage,
  source: 'MANUAL', locked: false } as Assignment);

test('a nurse is free after explicit partial doctor cover despite the session continuing', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }]);
  assert.equal(isFreeDuring(a, duty, sessions, '13:00', '14:00'), true);
  assert.equal(isFreeDuring(a, duty, sessions, '12:00', '13:00'), false);
});
test('coverage checks split at explicit doctor coverage boundaries inside unchanged duties', () => {
  const intervals = [{ doctorId: 'a', startTime: '09:00', endTime: '13:15' }];
  const slots = coverageSlots(resolveClinicSetup({ openTime: '09:00', closeTime: '21:00' }), [duty], sessions, intervals);
  assert.ok(slots.some(s => s.start === '13:00' && s.end === '13:15'));
  assert.ok(slots.some(s => s.start === '13:15' && s.end === '14:00'));
});
test('explicit consecutive doctor cover permits two normal acuity doctors touching at 19:00', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '19:00' }, { doctorId: 'b', startTime: '19:00', endTime: '21:00' }], 'b');
  assert.deepEqual(doctorPairingProblems(a, doctors, { duty, sessions }), []);
});
test('malformed explicit timing cannot become free Nurse Clinic cover', () => {
  const a = assignment([{ doctorId: 'a', startTime: 'bad', endTime: '13:00' }]);
  const ended = sessions.map(s => ({ ...s, endTime: '13:00' }));
  assert.equal(isFreeDuring(a, duty, ended, '14:00', '15:00'), false);
});

test('legacy doctor cover remains the exact duty and session intersection without explicit times', () => {
  const a = assignment(undefined);
  const short = { ...duty, startTime: '11:00', endTime: '19:00' };
  assert.deepEqual(effectiveDoctorCoverage(a, short, sessions), [{ doctorId: 'a', startTime: '11:00', endTime: '19:00' }]);
  assert.deepEqual(doctorCoverageProblems(a, short, sessions), []);
  assert.equal(doctorCoverageFingerprint(a), undefined);
  assert.equal(doctorCoverageText(a, doctors, short), '');
});
test('explicit times are clipped neither to the duty nor to a changed doctor session', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '19:00' }]);
  const short = { ...duty, endTime: '17:00' };
  assert.equal(effectiveDoctorCoverage(a, short, sessions).length, 0);
  assert.match(doctorCoverageProblems(a, short, sessions).join(' '), /within the nurse duty/);
  const changed = sessions.map(s => ({ ...s, startTime: '10:00' }));
  assert.equal(effectiveDoctorCoverage(a, duty, changed).length, 0);
  assert.match(doctorCoverageProblems(a, duty, changed).join(' '), /active doctor session/);
});
test('explicit timing after a cancelled clinic produces no actual cover or free cover', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }]);
  const cancelled = sessions.map(s => ({ ...s, cancelled: true }));
  assert.equal(effectiveDoctorCoverage(a, duty, cancelled).length, 0);
  assert.ok(doctorCoverageProblems(a, duty, cancelled).length);
  assert.deepEqual(freeDoctorIntervals(a, duty, cancelled), []);
});
test('explicit empty and malformed values never fall back to legacy named doctor cover', () => {
  for (const value of [[], null, {}, 'bad', [{ doctorId: 'a', startTime: '9:00', endTime: '13:00' }],
    [{ doctorId: 'a', startTime: '09:00', endTime: '09:00' }], [{ doctorId: 'a', startTime: '24:00', endTime: '25:00' }]]) {
    const a = assignment(value);
    assert.deepEqual(effectiveDoctorCoverage(a, duty, sessions), []);
    assert.ok(doctorCoverageProblems(a, duty, sessions).length);
    assert.deepEqual(freeDoctorIntervals(a, duty, sessions), []);
    assert.equal(isFreeDuring(a, duty, sessions, '15:00', '16:00'), false);
    assert.equal(doctorCoverageText(a, doctors, duty), 'Doctor cover needs review');
  }
});
test('timed intervals must match the named doctors with no more than two distinct identities', () => {
  const unmatched = assignment([{ doctorId: 'b', startTime: '09:00', endTime: '13:00' }]);
  assert.ok(doctorCoverageProblems(unmatched, duty, sessions).some(p => p.includes('only the doctors')));
  const missing = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }], 'b');
  assert.ok(doctorCoverageProblems(missing, duty, sessions).some(p => p.includes('Each doctor')));
  const three = assignment(['a', 'b', 'c'].map(doctorId => ({ doctorId, startTime: '09:00', endTime: '13:00' })), 'b');
  assert.ok(doctorCoverageProblems(three, duty, sessions).some(p => p.includes('at most two')));
  assert.deepEqual(effectiveDoctorCoverage(three, duty, sessions), []);
});
test('canonical timing merges repeated touching cover for each doctor without changing inputs', () => {
  const intervals = [{ doctorId: 'a', startTime: '11:00', endTime: '13:00' }, { doctorId: 'a', startTime: '09:00', endTime: '11:00' },
    { doctorId: 'a', startTime: '10:00', endTime: '12:00' }, { doctorId: 'b', startTime: '19:00', endTime: '21:00' }];
  const before = JSON.stringify(intervals);
  const result = canonicalDoctorCoverage(intervals);
  assert.deepEqual(result, [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }, { doctorId: 'b', startTime: '19:00', endTime: '21:00' }]);
  assert.equal(JSON.stringify(intervals), before);
  assert.equal(doctorCoverageFingerprint(assignment(intervals, 'b')), doctorCoverageFingerprint(assignment([...result].reverse(), 'b')));
});
test('overlapping doctor assignments count only the simultaneous intervals and free duty complement', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '15:00' }, { doctorId: 'b', startTime: '13:00', endTime: '17:00' }], 'b');
  assert.deepEqual(simultaneousDoctorIntervals(a, duty, sessions), [{ startTime: '13:00', endTime: '15:00' }]);
  assert.deepEqual(freeDoctorIntervals(a, duty, sessions), [{ startTime: '17:00', endTime: '21:00' }]);
  assert.deepEqual(doctorPairingProblems(a, doctors.map(d => ({ ...d, lowAcuity: true })), { duty, sessions }), []);
  assert.ok(doctorPairingProblems(a, doctors, { duty, sessions }).some(p => p.includes('not marked as low acuity')));
});
test('a touching handover has no concurrent doctor cover and does not alter paid duty hours', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '19:00' }, { doctorId: 'b', startTime: '19:00', endTime: '21:00' }], 'b');
  assert.deepEqual(simultaneousDoctorIntervals(a, duty, sessions), []);
  const nurse = makeNurse('nurse');
  const tally = summarizeNurseHours(nurse, makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 12 }), [a], new Map([[duty.id, duty]]), [], []);
  assert.equal(tally.dutyHours, 12);
  assert.equal(tally.totalHours, 12);
});
test('the free interval resolver supports multiple doctor visits separated by Float time', () => {
  const a = assignment([{ doctorId: 'a', startTime: '10:00', endTime: '12:00' }, { doctorId: 'a', startTime: '15:00', endTime: '17:00' }]);
  assert.deepEqual(freeDoctorIntervals(a, duty, sessions), [{ startTime: '09:00', endTime: '10:00' },
    { startTime: '12:00', endTime: '15:00' }, { startTime: '17:00', endTime: '21:00' }]);
  assert.deepEqual(uncoveredParts('09:00', '21:00', effectiveDoctorCoverage(a, duty, sessions)),
    [{ start: '09:00', end: '10:00' }, { start: '12:00', end: '15:00' }, { start: '17:00', end: '21:00' }]);
});
test('historical explicit timing can be read structurally without today clinic sessions', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }]);
  assert.deepEqual(resolveDoctorCoverage(a, duty).intervals, a.doctorCoverage);
  assert.deepEqual(resolveDoctorCoverage(a, duty, []).intervals, []);
  assert.ok(resolveDoctorCoverage(a, duty, []).problems.length);
  assert.equal(doctorCoverageText(a, doctors, duty), 'Dr A 09:00 to 13:00\nFloat 13:00 to 21:00');
  assert.equal(doctorCoverageText(a, doctors), 'Dr A 09:00 to 13:00');
});
test('malformed explicit timing fingerprints cannot collide with valid doctor coverage', () => {
  const valid = doctorCoverageFingerprint(assignment([{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }]));
  for (const raw of [null, {}, 'bad', [], [{ doctorId: 'a', startTime: 'bad', endTime: '13:00' }]]) {
    const result = doctorCoverageFingerprint(assignment(raw));
    assert.ok(result?.startsWith('invalid:'));
    assert.notEqual(result, valid);
  }
  const cyclic: any = {}; cyclic.self = cyclic;
  assert.doesNotThrow(() => doctorCoverageFingerprint(assignment(cyclic)));
});
test('manual assignment checks accept sequential normal clinics and report malformed explicit cover', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '19:00' }, { doctorId: 'b', startTime: '19:00', endTime: '21:00' }], 'b');
  const ctx = { assignments: [a], nurses: [makeNurse('nurse')], dutyWindows: [duty], leaveEntries: [], locks: [], roles: [], rules: hoursOnlyRules(), doctors, sessions };
  assert.deepEqual(checkAssignment(ctx, a), []);
  const invalid = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '22:00' }]);
  assert.ok(checkAssignment({ ...ctx, assignments: [invalid] }, invalid).some(p => p.includes('within the nurse duty')));
});
test('legacy two doctor restrictions are unchanged when explicit timing is absent', () => {
  const a = assignment(undefined, 'b');
  assert.ok(doctorPairingProblems(a, doctors, { duty, sessions }).length > 0);
  assert.deepEqual(doctorPairingProblems(a, doctors.map(d => ({ ...d, lowAcuity: true }))), []);
});
test('sparse explicit timing arrays are rejected without crashing any public reader', () => {
  const sparse: any[] = [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }]; sparse.length = 2;
  const a = assignment(sparse);
  assert.doesNotThrow(() => canonicalDoctorCoverage(sparse));
  assert.deepEqual(canonicalDoctorCoverage(sparse), []);
  assert.doesNotThrow(() => doctorCoverageFingerprint(a));
  assert.ok(doctorCoverageFingerprint(a)?.startsWith('invalid:'));
  assert.deepEqual(effectiveDoctorCoverage(a, duty, sessions), []);
});
test('pairing timing context preserves omitted historical sessions but validates an explicit empty list', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '19:00' }, { doctorId: 'b', startTime: '19:00', endTime: '21:00' }], 'b');
  assert.deepEqual(doctorPairingProblems(a, doctors, { duty }), []);
  assert.ok(doctorPairingProblems(a, doctors, { duty, sessions: [] }).length);
});
test('explicit cover cannot be validated against a malformed doctor session time range', () => {
  const a = assignment([{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }]);
  const malformed = sessions.map(s => ({ ...s, startTime: '00:00:00', endTime: '99:99' }));
  assert.deepEqual(effectiveDoctorCoverage(a, duty, malformed), []);
  assert.ok(doctorCoverageProblems(a, duty, malformed).length);
});
test('non doctor duties reject explicit empty cover instead of mislabelling Nurse Clinic as Float', () => {
  const nc = { ...assignment([]), kind: 'CLINICAL_ROLE' as const, doctorId: undefined, clinicalRoleId: 'NC' };
  assert.ok(doctorCoverageProblems(nc, duty, sessions).length);
  assert.equal(doctorCoverageText(nc, doctors, duty), 'Doctor cover needs review');
  assert.deepEqual(freeDoctorIntervals(nc, duty, sessions), []);
});
