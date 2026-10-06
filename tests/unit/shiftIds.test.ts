import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { moveShift, swapShifts } from '../../src/services/schedule/shiftMoves';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Doctor, DoctorSession, DutyWindow } from '../../src/types';

const LATE: DutyWindow = { id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00', color: '#000', active: true } as DutyWindow;
const doctors = ['x', 'y'].map((id) => ({ id: `dr-${id}`, fullName: `Dr ${id}`, specialtyIds: [], active: true, weeklyPattern: [] }) as unknown as Doctor);
const dates = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11'];
const sessions = dates.flatMap((d) =>
  doctors.map((dr) => ({ id: `s-${dr.id}-${d}`, doctorId: dr.id, date: d, startTime: '09:00', endTime: '17:00', source: 'PATTERN', cancelled: false }) as unknown as DoctorSession)
);
const nurses = ['a', 'b', 'c', 'd'].map((id) => makeNurse(id));
const schedule = makeSchedule({ hoursTargetFullTime: 40 });
const fill = (existing: Assignment[]) =>
  SchedulingEngine.generate(schedule, 'GENERATE_ALL', existing, nurses, [SENIOR], [DAY_DUTY, LATE], [], [], sessions, [], [], hoursOnlyRules(),
    undefined, [], doctors, [ANNUAL_LEAVE], undefined, { keepManual: true });

test('a fill never gives a new shift the id a swapped shift still has', async () => {
  const first = (await fill([])).assignments;
  // Every swap between two different days of the week, each followed by a whole fill.
  let checked = 0;
  for (const shiftA of first) {
    for (const shiftB of first) {
      if (shiftA.nurseId === shiftB.nurseId || shiftA.date === shiftB.date) continue;
      if (first.some((x) => x.nurseId === shiftB.nurseId && x.date === shiftA.date)) continue;
      if (first.some((x) => x.nurseId === shiftA.nurseId && x.date === shiftB.date)) continue;
      // The swap as it was saved before the fix: the shifts keep their ids.
      const swapped = first.map((x) =>
        x.id === shiftA.id ? { ...x, nurseId: shiftB.nurseId, source: 'MANUAL' as const }
          : x.id === shiftB.id ? { ...x, nurseId: shiftA.nurseId, source: 'MANUAL' as const } : x
      );
      const refill = (await fill(swapped)).assignments;
      const ids = refill.map((x) => x.id);
      assert.equal(new Set(ids).size, ids.length, `two shifts share an id after swapping ${shiftA.id} and ${shiftB.id}`);
      checked++;
    }
  }
  assert.ok(checked > 0);
});

test('a swap gives both shifts new ids and exchanges the nurses', () => {
  const amy = { id: 'asgn-gen-r-amy-2026-10-05-DOCTOR', scheduleId: 'r', nurseId: 'amy', date: '2026-10-05', dutyWindowId: 'D', kind: 'DOCTOR', doctorId: 'dr-x', locked: false, source: 'GENERATED' } as Assignment;
  const mary = { id: 'asgn-gen-r-mary-2026-10-07-DOCTOR', scheduleId: 'r', nurseId: 'mary', date: '2026-10-07', dutyWindowId: 'D', kind: 'DOCTOR', doctorId: 'dr-y', locked: false, source: 'GENERATED' } as Assignment;
  const other = { ...amy, id: 'other', date: '2026-10-09' };
  let n = 0;
  const result = swapShifts([amy, mary, other], amy, mary, { a: 'Swapped with Amy', b: 'Swapped with Mary' }, () => `new-${++n}`);
  assert.deepEqual(result.map((x) => x.id).sort(), ['new-1', 'new-2', 'other']);
  const onAmysDay = result.find((x) => x.date === '2026-10-05')!;
  const onMarysDay = result.find((x) => x.date === '2026-10-07')!;
  assert.equal(onAmysDay.nurseId, 'mary');
  assert.equal(onAmysDay.doctorId, 'dr-x');
  assert.equal(onAmysDay.source, 'MANUAL');
  assert.equal(onMarysDay.nurseId, 'amy');
  assert.equal(onMarysDay.note, 'Swapped with Mary');
});

test('a shift moved to another nurse gets a new id', () => {
  const amy = { id: 'asgn-gen-r-amy-2026-10-05-POOL', scheduleId: 'r', nurseId: 'amy', date: '2026-10-05', dutyWindowId: 'D', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED' } as Assignment;
  const moved = moveShift(amy, 'mary', { note: 'Rebalanced from Amy' }, () => 'new-1');
  assert.equal(moved.id, 'new-1');
  assert.equal(moved.nurseId, 'mary');
  assert.equal(moved.note, 'Rebalanced from Amy');
  assert.equal(moved.date, '2026-10-05');
});
