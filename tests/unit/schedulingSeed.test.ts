import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLock, makeNurse, makeSchedule } from './fixtures';

test('a matching pin preserves the complete saved assignment including its note', async () => {
  const date = '2026-11-18';
  const doctor = { id: 'doctor', fullName: 'Dr One', active: true, weeklyPattern: [], specialtyIds: [] } as Doctor;
  const session = { id: 'session', date, doctorId: doctor.id, startTime: '09:00', endTime: '17:00',
    source: 'MANUAL', cancelled: false } as DoctorSession;
  const pinned: Assignment = { id: 'saved-pin', scheduleId: 'sched-1', nurseId: 'n', date, dutyWindowId: DAY_DUTY.id,
    kind: 'DOCTOR', doctorId: doctor.id, locked: true, source: 'MANUAL', note: 'Keep this exact saved note',
    allocationReview: null, doctorCoverage: [{ doctorId: doctor.id, startTime: '09:00', endTime: '17:00' }] };
  const lock = makeLock('n', date, { assignmentKind: 'DOCTOR', targetRefId: doctor.id, doctorCoverage: pinned.doctorCoverage });
  const result = await SchedulingEngine.generate(makeSchedule({ startDate: date, endDate: date }), 'GENERATE_ALL', [pinned],
    [makeNurse('n')], [SENIOR], [DAY_DUTY], [], [], [session], [lock], [], hoursOnlyRules(), undefined, [], [doctor]);
  assert.deepEqual(result.assignments, [pinned]);
});
