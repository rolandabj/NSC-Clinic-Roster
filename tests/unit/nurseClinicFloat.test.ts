import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { FLOAT_ROLE_ID, isFloatShift } from '../../src/services/engine/floatShift';
import type { Assignment, DoctorSession, Rule } from '../../src/types';
import { makeNurse, makeSchedule, SENIOR } from './fixtures';

const FULL = { id: 'd', name: '9-9', acronym: '9-9', startTime: '09:00', endTime: '21:00', color: '#000', active: true };
const NINE_SEVEN = { id: 'n7', name: '9-7', acronym: '9-7', startTime: '09:00', endTime: '19:00', color: '#000', active: true };
const EARLY = { id: 'e', name: '9-5', acronym: '9-5', startTime: '09:00', endTime: '17:00', color: '#000', active: true };
const LATE = { id: 'l', name: '1-9', acronym: '1-9', startTime: '13:00', endTime: '21:00', color: '#000', active: true };
const NC = { id: 'role-nc', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 };
const CARD = { id: 'sp-card', name: 'Cardiology', code: 'CARD' };
const DATE = '2026-11-03';

const ncShifts = (list: Assignment[], date = DATE) =>
  list.filter((a) => a.date === date && a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId === NC.id);

async function run(
  staff: ReturnType<typeof makeNurse>[],
  duties: any[],
  opts: { rules?: Rule[]; prior?: Assignment[]; sessions?: DoctorSession[]; start?: string; end?: string; target?: number } = {}
) {
  const schedule = makeSchedule({ startDate: opts.start || DATE, endDate: opts.end || DATE, hoursTargetFullTime: opts.target ?? 12 });
  const result = await SchedulingEngine.generate(
    schedule, 'GENERATE_ALL', [], staff, [SENIOR], duties, [NC] as any, [CARD], opts.sessions || [], [], [], opts.rules || [],
    undefined, [], [], [], { priorAssignments: opts.prior || [] }
  );
  return result.assignments;
}

test('no shift covers the opening hours: one Nurse Clinic, the evening nurse floats', async () => {
  const staff = ['a', 'b', 'c'].map((id) => makeNurse(id, { capabilityIds: [NC.id] }));
  const shifts = await run(staff, [EARLY, LATE]);
  assert.equal(ncShifts(shifts).length, 1, 'exactly one Nurse Clinic shift');
  const others = shifts.filter((a) => !ncShifts(shifts).includes(a));
  assert.ok(others.length >= 1, 'a second nurse covers the evening');
  others.forEach((a) => assert.equal(a.clinicalRoleId, FLOAT_ROLE_ID));
});

test('Nurse Clinic gets a shift covering all opening hours when a nurse can work it', async () => {
  // Amy (Nurse Clinic only) worked late yesterday and may not do two late shifts in a row,
  // so she can only work 9-7. Ben can work 9-9 and runs Nurse Clinic for the whole day.
  const lateRule = { id: 'rule-s1', name: 'Consecutive late duties', templateKey: 'MAX_CONSECUTIVE_LATE_DUTIES', enabled: true, severity: 'HARD', value: 1, params: { thresholdTime: '21:00' } } as any;
  const prior = [{ id: 'p', scheduleId: 'prev', nurseId: 'amy', date: '2026-11-02', dutyWindowId: 'd', kind: 'CLINICAL_ROLE', clinicalRoleId: NC.id, locked: false, source: 'GENERATED' } as Assignment];
  const amy = makeNurse('amy', { isClinicNurse: false, capabilityIds: [NC.id] });
  const ben = makeNurse('ben', { capabilityIds: [NC.id] });
  const shifts = await run([amy, ben], [FULL, NINE_SEVEN], { rules: [lateRule], prior });
  const nc = ncShifts(shifts);
  assert.equal(nc.length, 1);
  assert.equal(nc[0].nurseId, 'ben');
  assert.equal(nc[0].dutyWindowId, FULL.id);
});

test('a float shift says Float, not the department in her list', async () => {
  // Two weeks with no doctors, Nurse Clinic and the senior rule off: nurses behind their hours float.
  const rules = [
    { id: 'rule-h1', name: 'Senior', templateKey: 'SENIOR_ON_DUTY', enabled: false, severity: 'SOFT', value: 0 },
    { id: 'rule-nurse-clinic', name: 'Nurse Clinic', templateKey: 'DEDICATED_NURSE_CLINIC', enabled: false, severity: 'SOFT', value: 0 },
    { id: 'rule-nurse-plus-one', name: 'Plus one', templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', enabled: false, severity: 'SOFT', value: 0 },
  ] as any;
  const amy = makeNurse('amy', { preferences: [{ kind: 'SPECIALTY', refId: CARD.id, rank: 1 }] });
  const shifts = await run([amy], [EARLY], { rules, start: '2026-11-01', end: '2026-11-14', target: 80 });
  assert.ok(shifts.length > 0, 'she floats on some days');
  shifts.forEach((a) => {
    assert.equal(a.kind, 'CLINICAL_ROLE');
    assert.equal(a.clinicalRoleId, FLOAT_ROLE_ID);
    assert.equal(a.specialtyId, undefined);
    assert.ok(isFloatShift(a));
  });
});

test('a whole month: never more than one Nurse Clinic a day, and no department floats', async () => {
  const doctors = ['A', 'B', 'C'].map((x) => ({ id: 'doc' + x, fullName: 'Dr ' + x, specialtyIds: [CARD.id], weeklyPattern: [], active: true }));
  const sessions: DoctorSession[] = [];
  for (let d = 1; d <= 28; d++) {
    const date = `2026-11-${String(d).padStart(2, '0')}`;
    doctors.forEach((doc, i) => {
      if ((d + i) % 3 === 0) return;
      sessions.push({ id: `s-${doc.id}-${date}`, doctorId: doc.id, date, startTime: '09:00', endTime: i === 2 ? '21:00' : '18:30', specialtyId: CARD.id, source: 'PATTERN', cancelled: false } as DoctorSession);
    });
  }
  const staff = Array.from({ length: 8 }, (_, i) =>
    makeNurse('n' + i, { capabilityIds: [NC.id], preferences: i < 5 ? [{ kind: 'SPECIALTY', refId: CARD.id, rank: 1 }] : [] })
  );
  const schedule = makeSchedule({ startDate: '2026-11-01', endDate: '2026-11-28', hoursTargetFullTime: 168 });
  const lateRule = { id: 'rule-s1', name: 'Consecutive late duties', templateKey: 'MAX_CONSECUTIVE_LATE_DUTIES', enabled: true, severity: 'HARD', value: 2, params: { thresholdTime: '21:00' } } as any;
  const { assignments } = await SchedulingEngine.generate(
    schedule, 'GENERATE_ALL', [], staff, [SENIOR], [FULL, NINE_SEVEN, LATE], [NC] as any, [CARD], sessions, [], [], [lateRule],
    undefined, [], doctors as any, []
  );
  for (let d = 1; d <= 28; d++) {
    const date = `2026-11-${String(d).padStart(2, '0')}`;
    assert.ok(ncShifts(assignments, date).length <= 1, `${date}: ${ncShifts(assignments, date).length} Nurse Clinic shifts`);
  }
  assert.equal(assignments.filter((a) => a.kind === 'SPECIALTY').length, 0);
});
