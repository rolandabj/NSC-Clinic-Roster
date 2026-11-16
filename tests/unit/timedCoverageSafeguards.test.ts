import { test } from 'node:test';
import assert from 'node:assert/strict';
import { preserveTimedDoctorCoverage, timedPinNoteUpdate } from '../../src/services/engine/timedCoverageSafety';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLock, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';
const date = '2026-11-18';
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 });
const doctor = { id: 'd1', fullName: 'Doctor One', active: true, weeklyPattern: [], specialtyIds: [] } as Doctor;
const session = { id: 's1', doctorId: doctor.id, date, startTime: '09:00', endTime: '17:00', cancelled: false, source: 'MANUAL' } as DoctorSession;
const timed: Assignment = { id: 'timed', scheduleId: schedule.id, nurseId: 'n1', date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: doctor.id, doctorCoverage: [{ doctorId: doctor.id, startTime: '09:00', endTime: '13:00' }], source: 'MANUAL', locked: false };
const generate = (assignments: Assignment[], locks = [] as ReturnType<typeof makeLock>[], mode: 'GENERATE_ALL' | 'EMPTY_ONLY' | 'CLEAR_GENERATED' = 'GENERATE_ALL') =>
  SchedulingEngine.generate(schedule, mode, assignments, [makeNurse('n1')], [SENIOR], [DAY_DUTY], [], [], [session], locks, [], hoursOnlyRules(), undefined, [], [doctor]);

test('automatic filling cannot overwrite timed doctor coverage before timed writers are enabled', async () => {
  const before = JSON.stringify(timed);
  await assert.rejects(() => generate([timed]), /timed doctor cover/i);
  await assert.rejects(() => generate([timed], [], 'EMPTY_ONLY'), /timed doctor cover/i);
  assert.equal(JSON.stringify(timed), before);
});
test('a timed pin cannot silently turn into a whole session assignment during generation', async () => {
  const lock = makeLock('n1', date, { assignmentKind: 'DOCTOR', targetRefId: doctor.id, doctorCoverage: timed.doctorCoverage });
  await assert.rejects(() => generate([], [lock]), /timed doctor cover/i);
});
test('clearing generated duties preserves a manually timed duty without changing its intervals', async () => {
  const result = await generate([timed], [], 'CLEAR_GENERATED');
  assert.deepEqual(result.assignments, [timed]);
});

test('editing a note or pin keeps the exact timed coverage and leaves the input unchanged', () => {
  const before = JSON.stringify(timed);
  const next = preserveTimedDoctorCoverage(timed, { ...timed, id: 'manual-new-id', doctorCoverage: undefined, note: 'Reviewed', locked: true });
  assert.deepEqual(next.doctorCoverage, timed.doctorCoverage);
  assert.equal(next.note, 'Reviewed');assert.equal(next.locked, true);
  assert.equal(JSON.stringify(timed), before);
});
test('the legacy editor cannot silently replace or widen a timed duty', () => {
  assert.throws(() => preserveTimedDoctorCoverage(timed, { ...timed, dutyWindowId: 'later' }), /Clear the duty/);
  assert.throws(() => preserveTimedDoctorCoverage(timed, { ...timed, doctorId: 'another-doctor' }), /Clear the duty/);
  assert.throws(() => preserveTimedDoctorCoverage(timed, { ...timed, kind: 'CLINICAL_ROLE', doctorId: undefined }), /Clear the duty/);
});
test('a legacy duty remains a legacy duty when editing its note', () => {
  const legacy = { ...timed, doctorCoverage: undefined };
  const next = { ...legacy, note: 'Changed' };
  assert.equal(preserveTimedDoctorCoverage(legacy, next), next);
});

test('the separate pin editor keeps sequential normal doctor times and updates only the note', () => {
  const pin = makeLock('n1', date, { assignmentKind: 'DOCTOR', targetRefId: 'd1', secondTargetRefId: 'd2',
    doctorCoverage: [{ doctorId: 'd1', startTime: '09:00', endTime: '13:00' }, { doctorId: 'd2', startTime: '13:00', endTime: '17:00' }] });
  const before = JSON.stringify(pin);
  assert.deepEqual(timedPinNoteUpdate(pin, { ...pin, note: 'Reviewed' }), { note: 'Reviewed' });
  assert.equal(JSON.stringify(pin), before);
  assert.throws(() => timedPinNoteUpdate(pin, { ...pin, secondTargetRefId: undefined }), /timed pin has changed/);
  assert.throws(() => timedPinNoteUpdate(pin, { ...pin, doctorCoverage: undefined }), /timed pin has changed/);
  assert.throws(() => timedPinNoteUpdate(pin, { ...pin, dutyWindowId: 'later' }), /timed pin has changed/);
});
