import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, DoctorSession } from '../../src/types';
import { doctorCoverageDraftOf, manualDoctorCoverageOf } from '../../src/services/engine/manualDoctorCoverage';
import { DAY_DUTY } from './fixtures';

const date = '2026-11-18';
const choice: Assignment = { id: 'manual', scheduleId: 'roster', nurseId: 'amy', date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: 'one', source: 'MANUAL', locked: false };
const sessions = ['one', 'two'].map(doctorId => ({ id: doctorId, doctorId, date, startTime: '10:00', endTime: '16:00',
  source: 'MANUAL', cancelled: false } as DoctorSession));

test('a new manual doctor duty uses the exact duty and clinic intersection', () => {
  assert.deepEqual(manualDoctorCoverageOf(choice, DAY_DUTY, sessions), [
    { doctorId: 'one', startTime: '10:00', endTime: '16:00' },
  ]);
});
test('a note or pin edit preserves every existing timed visit rather than widening the doctor duty', () => {
  const previous = { ...choice, doctorCoverage: [{ doctorId: 'one', startTime: '10:00', endTime: '12:00' },
    { doctorId: 'one', startTime: '14:00', endTime: '16:00' }] };
  const before = JSON.stringify(previous);
  const edit = { ...choice, note: 'Reviewed', locked: true };
  assert.deepEqual(manualDoctorCoverageOf(edit, DAY_DUTY, sessions, previous), previous.doctorCoverage);
  assert.equal(JSON.stringify(previous), before);
});
test('explicit split visits and touching boundaries remain exact and canonical', () => {
  const intervals = [{ doctorId: 'two', startTime: '13:00', endTime: '16:00' },
    { doctorId: 'one', startTime: '10:00', endTime: '11:00' }, { doctorId: 'one', startTime: '11:00', endTime: '13:00' }];
  const before = JSON.stringify(intervals);
  assert.deepEqual(manualDoctorCoverageOf({ ...choice, secondDoctorId: 'two', doctorCoverage: intervals }, DAY_DUTY, sessions), [
    { doctorId: 'one', startTime: '10:00', endTime: '13:00' }, { doctorId: 'two', startTime: '13:00', endTime: '16:00' },
  ]);
  assert.equal(JSON.stringify(intervals), before);
});
test('invalid manual explicit times never fall back to whole clinic coverage', () => {
  for (const doctorCoverage of [[], [{ doctorId: 'one', startTime: '09:00', endTime: '16:00' }],
    [{ doctorId: 'one', startTime: '12:00', endTime: '11:00' }]]) {
    assert.throws(() => manualDoctorCoverageOf({ ...choice, doctorCoverage }, DAY_DUTY, sessions), /cover/i);
  }
});
test('a changed doctor does not inherit the previous doctor times', () => {
  const previous = { ...choice, doctorCoverage: [{ doctorId: 'one', startTime: '11:00', endTime: '12:00' }] };
  assert.deepEqual(manualDoctorCoverageOf({ ...choice, doctorId: 'two' }, DAY_DUTY, sessions, previous), [
    { doctorId: 'two', startTime: '10:00', endTime: '16:00' },
  ]);
});
test('extending the paid duty does not silently widen an existing doctor period', () => {
  const previous = { ...choice, doctorCoverage: [{ doctorId: 'one', startTime: '11:00', endTime: '12:00' }] };
  const longer = { ...DAY_DUTY, id: 'longer', endTime: '19:00' };
  assert.deepEqual(manualDoctorCoverageOf({ ...choice, dutyWindowId: longer.id }, longer, sessions, previous), previous.doctorCoverage);
  const shorter = { ...DAY_DUTY, id: 'shorter', startTime: '13:00' };
  assert.throws(() => manualDoctorCoverageOf({ ...choice, dutyWindowId: shorter.id }, shorter, sessions, previous), /duty/);
});
test('a legacy empty second doctor value does not discard the saved primary cover times', () => {
  const previous = { ...choice, secondDoctorId: null as any, doctorCoverage: [{ doctorId: 'one', startTime: '11:00', endTime: '12:00' }] };
  assert.deepEqual(manualDoctorCoverageOf(choice, DAY_DUTY, sessions, previous), previous.doctorCoverage);
});
test('manual timed duty needs a real shift and active clinic before it can be saved', () => {
  assert.throws(() => manualDoctorCoverageOf(choice, undefined, sessions), /duty|shift/i);
  assert.throws(() => manualDoctorCoverageOf(choice, DAY_DUTY, []), /cover/i);
  assert.throws(() => manualDoctorCoverageOf(choice, DAY_DUTY, sessions.map(s => ({ ...s, cancelled: true }))), /cover/i);
});
test('changing a doctor duty to a clinic task removes doctor times', () => {
  assert.equal(manualDoctorCoverageOf({ ...choice, kind: 'CLINICAL_ROLE', doctorId: undefined,
    doctorCoverage: [{ doctorId: 'one', startTime: '10:00', endTime: '16:00' }] }, DAY_DUTY, sessions), undefined);
});

test('malformed explicit data cannot turn into inferred cover on manual save', () => {
  for (const raw of [null, {}, 'invalid']) {
    assert.throws(() => manualDoctorCoverageOf({ ...choice, doctorCoverage: raw as any }, DAY_DUTY, sessions), /cover/i);
  }
});
test('malformed saved times open incomplete fields instead of a wider default session', () => {
  assert.deepEqual(doctorCoverageDraftOf({ ...choice, doctorCoverage: null as any }, DAY_DUTY, sessions), [
    { doctorId: 'one', startTime: '', endTime: '' },
  ]);
  assert.deepEqual(doctorCoverageDraftOf({ ...choice, doctorCoverage: [] }, DAY_DUTY, sessions), [
    { doctorId: 'one', startTime: '', endTime: '' },
  ]);
});
test('the editor draft retains each repeated visit and adds a blank period for a missing named doctor', () => {
  const previous = { ...choice, secondDoctorId: 'two', doctorCoverage: [
    { doctorId: 'one', startTime: '10:00', endTime: '12:00' }, { doctorId: 'one', startTime: '14:00', endTime: '16:00' },
  ] };
  assert.deepEqual(doctorCoverageDraftOf(previous, DAY_DUTY, sessions), [...previous.doctorCoverage,
    { doctorId: 'two', startTime: '', endTime: '' },
  ]);
});
