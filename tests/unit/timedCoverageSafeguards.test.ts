import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertTimedPinCurrent } from '../../src/services/engine/timedCoverageSafety';
import { manualDoctorCoverageOf } from '../../src/services/engine/manualDoctorCoverage';
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

test('automatic filling accepts and preserves protected timed doctor coverage', async () => {
  const before = JSON.stringify(timed);
  for (const mode of ['GENERATE_ALL', 'EMPTY_ONLY'] as const) {
    const result = await generate([timed], [], mode);
    assert.deepEqual(result.assignments.find(a => a.id === timed.id)?.doctorCoverage, timed.doctorCoverage);
  }
  assert.equal(JSON.stringify(timed), before);
});
test('a timed pin cannot silently turn into a whole session assignment during generation', async () => {
  const lock = makeLock('n1', date, { assignmentKind: 'DOCTOR', targetRefId: doctor.id, doctorCoverage: timed.doctorCoverage });
  const result = await generate([], [lock]);
  assert.deepEqual(result.assignments.find(a => a.nurseId === 'n1')?.doctorCoverage, timed.doctorCoverage);
});
test('clearing generated duties preserves a manually timed duty without changing its intervals', async () => {
  const result = await generate([timed], [], 'CLEAR_GENERATED');
  assert.deepEqual(result.assignments, [timed]);
});

test('editing a note or pin keeps the exact timed coverage and leaves the input unchanged', () => {
  const before = JSON.stringify(timed);
  const coverage = manualDoctorCoverageOf({ ...timed, doctorCoverage: undefined }, DAY_DUTY, [session], timed);
  assert.deepEqual(coverage, timed.doctorCoverage);
  assert.equal(JSON.stringify(timed), before);
});
test('an explicit edit may change timing but cannot exceed the duty or clinic', () => {
  assert.deepEqual(manualDoctorCoverageOf({ ...timed, doctorCoverage: [{ doctorId: doctor.id, startTime: '10:00', endTime: '15:00' }] }, DAY_DUTY, [session]),
    [{ doctorId: doctor.id, startTime: '10:00', endTime: '15:00' }]);
  assert.throws(() => manualDoctorCoverageOf({ ...timed, doctorCoverage: [{ doctorId: doctor.id, startTime: '08:00', endTime: '18:00' }] }, DAY_DUTY, [session]), /within the nurse duty/);
});
test('a legacy doctor edit materializes the original duty and session intersection', () => {
  const legacy = { ...timed, doctorCoverage: undefined };
  assert.deepEqual(manualDoctorCoverageOf(legacy, DAY_DUTY, [session]), [{ doctorId: doctor.id, startTime: '09:00', endTime: '17:00' }]);
});

test('the separate pin editor rejects concurrent changes to its saved input', () => {
  const pin = makeLock('n1', date, { assignmentKind: 'DOCTOR', targetRefId: 'd1', secondTargetRefId: 'd2',
    doctorCoverage: [{ doctorId: 'd1', startTime: '09:00', endTime: '13:00' }, { doctorId: 'd2', startTime: '13:00', endTime: '17:00' }] });
  const before = JSON.stringify(pin);
  assert.doesNotThrow(() => assertTimedPinCurrent(pin, { ...pin }));
  assert.equal(JSON.stringify(pin), before);
  assert.throws(() => assertTimedPinCurrent({ ...pin, secondTargetRefId: undefined }, pin), /pin has changed/);
  assert.throws(() => assertTimedPinCurrent({ ...pin, doctorCoverage: undefined }, pin), /pin has changed/);
  assert.throws(() => assertTimedPinCurrent({ ...pin, dutyWindowId: 'later' }, pin), /pin has changed/);
  assert.throws(() => assertTimedPinCurrent(null, pin), /pin has changed/);
});
