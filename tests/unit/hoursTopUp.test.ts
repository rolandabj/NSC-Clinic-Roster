import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import type { DoctorSession, Rule } from '../../src/types';
import { makeNurse, makeSchedule, SENIOR } from './fixtures';

const FULL = { id: 'd', name: '9-9', acronym: '9-9', startTime: '09:00', endTime: '21:00', color: '#000', active: true };
const NINE_SEVEN = { id: 'n7', name: '9-7', acronym: '9-7', startTime: '09:00', endTime: '19:00', color: '#000', active: true };
const EARLY = { id: 'e', name: '9-3', acronym: '9-3', startTime: '09:00', endTime: '15:00', color: '#000', active: true };
const NINE_FIVE = { id: 'n5', name: '9-5', acronym: '9-5', startTime: '09:00', endTime: '17:00', color: '#000', active: true };
const ORTHO = { id: 'sp-o', name: 'Orthopedics', code: 'ORTH' };
const OBGYN = { id: 'sp-g', name: 'Obstetrics', code: 'OBGY' };
const DR_O = { id: 'doc-o', fullName: 'Dr David', specialtyIds: [ORTHO.id], weeklyPattern: [], active: true };
const DR_G = { id: 'doc-g', fullName: 'Dr Sana', specialtyIds: [OBGYN.id], weeklyPattern: [], active: true };
const NO_EXTRAS = [
  { id: 'rule-nurse-clinic', name: 'NC', templateKey: 'DEDICATED_NURSE_CLINIC', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-nurse-plus-one', name: 'Plus one', templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-h1', name: 'Senior', templateKey: 'SENIOR_ON_DUTY', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-h7-max-hours', name: 'Hours', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: true, severity: 'HARD', value: 100 },
] as unknown as Rule[];
const days = (n: number) => Array.from({ length: n }, (_, i) => `2026-11-${String(i + 1).padStart(2, '0')}`);
const session = (doctor: { id: string; specialtyIds: string[] }, date: string, endTime = '18:30') =>
  ({ id: `s-${doctor.id}-${date}`, doctorId: doctor.id, date, startTime: '09:00', endTime, specialtyId: doctor.specialtyIds[0], source: 'PATTERN', cancelled: false }) as DoctorSession;
const hoursOf = (id: string) => ({ d: 12, n7: 10, n5: 8, e: 6 } as Record<string, number>)[id];

test('every nurse reaches her hours goal when the rules allow, with floats if needed', async () => {
  // Ten days, three doctor sessions only: Amy and Ben must float to reach 70 hours each.
  const list = days(10);
  const amy = makeNurse('amy', { preferences: [{ kind: 'SPECIALTY', refId: ORTHO.id, rank: 1 }] });
  const ben = makeNurse('ben', { preferences: [{ kind: 'SPECIALTY', refId: ORTHO.id, rank: 1 }] });
  const { assignments } = await SchedulingEngine.generate(
    makeSchedule({ startDate: list[0], endDate: list[9], hoursTargetFullTime: 70 }), 'GENERATE_ALL', [], [amy, ben], [SENIOR],
    [FULL, NINE_SEVEN, NINE_FIVE, EARLY], [], [ORTHO], list.slice(0, 3).map((d) => session(DR_O, d)), [], [], NO_EXTRAS, undefined, [], [DR_O] as any, []
  );
  for (const id of ['amy', 'ben']) {
    const total = assignments.filter((a) => a.nurseId === id).reduce((sum, a) => sum + hoursOf(a.dutyWindowId), 0);
    assert.equal(total, 70, `${id} works ${total} h`);
  }
});

test('shifts ending at 9 pm are shared: a nurse with none stays on after her doctor leaves', async () => {
  // Dr David and Dr Sana both leave at 6:30 pm. Amy (Orthopedics first) floats 9-9 on the
  // first days and builds up late shifts; Zeinab (Obstetrics only, plenty of hours) should
  // get late shifts too instead of always 9-7.
  const list = days(8);
  const amy = makeNurse('amy', { preferences: [{ kind: 'SPECIALTY', refId: ORTHO.id, rank: 1 }] });
  const zeinab = makeNurse('zeinab', { preferences: [{ kind: 'SPECIALTY', refId: OBGYN.id, rank: 1 }, { kind: 'SPECIALTY', refId: ORTHO.id, rank: 2 }] });
  const { assignments } = await SchedulingEngine.generate(
    makeSchedule({ startDate: list[0], endDate: list[7], hoursTargetFullTime: 96 }), 'GENERATE_ALL', [], [amy, zeinab], [SENIOR],
    [FULL, NINE_SEVEN], [], [ORTHO, OBGYN], list.flatMap((d) => [session(DR_O, d), session(DR_G, d)]), [], [], NO_EXTRAS,
    undefined, [], [DR_O, DR_G] as any, []
  );
  const late = (id: string) => assignments.filter((a) => a.nurseId === id && a.dutyWindowId === FULL.id).length;
  assert.ok(Math.abs(late('amy') - late('zeinab')) <= 1, `late shifts: amy ${late('amy')}, zeinab ${late('zeinab')}`);
});

test('shift types are varied: the "used first" shifts take turns, 9-9 only when needed', async () => {
  // Two weeks of floats, no doctors: 9-7, 11-9 and 1-9 are all "used first".
  const list = days(14);
  const ELEVEN_NINE = { id: 'e9', name: '11-9', acronym: '11-9', startTime: '11:00', endTime: '21:00', color: '#000', active: true, isPriority: true };
  const ONE_NINE = { id: 'l', name: '1-9', acronym: '1-9', startTime: '13:00', endTime: '21:00', color: '#000', active: true, isPriority: true };
  const staff = ['amy', 'ben', 'cat'].map((id) => makeNurse(id));
  const { assignments } = await SchedulingEngine.generate(
    makeSchedule({ startDate: list[0], endDate: list[13], hoursTargetFullTime: 80 }), 'GENERATE_ALL', [], staff, [SENIOR],
    [{ ...FULL, isPriority: true }, { ...NINE_SEVEN, isPriority: true }, ELEVEN_NINE, ONE_NINE], [], [], [], [], [], NO_EXTRAS,
    undefined, [], [], []
  );
  const used = new Set(assignments.map((a) => a.dutyWindowId));
  // (the last hours may stretch a 1-9 into an 11-9, so not every type always survives)
  assert.ok(used.size >= 2 && !used.has(FULL.id), `shift types used: ${[...used].join(', ')}`);
  assert.equal(assignments.filter((a) => a.dutyWindowId === FULL.id).length, 0, 'no 9-9 without a reason');
});
