import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { applyPreferenceFocus } from '../../src/services/engine/preferenceOrder';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Doctor, DoctorSession, DutyWindow, Nurse, NursePreference, Specialty } from '../../src/types';

const LATE: DutyWindow = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00' };
const CARD = { id: 'sp-card', name: 'Cardiology', code: 'CARD' } as Specialty;
const ORTHO = { id: 'sp-ortho', name: 'Orthopaedics', code: 'ORTH' } as Specialty;
const LEE = { id: 'doc-lee', fullName: 'Dr Lee', specialtyIds: [ORTHO.id] } as Doctor;
const KHAN = { id: 'doc-khan', fullName: 'Dr Khan', specialtyIds: [CARD.id] } as Doctor;
const DATE = '2026-10-07';

// Dr Lee's late session is filled first (it ends after 7 pm), Dr Khan's day session second.
const SESSIONS = [
  { id: 's-lee', doctorId: LEE.id, date: DATE, startTime: '13:00', endTime: '21:00', specialtyId: ORTHO.id, source: 'PATTERN', cancelled: false },
  { id: 's-khan', doctorId: KHAN.id, date: DATE, startTime: '09:00', endTime: '17:00', specialtyId: CARD.id, source: 'PATTERN', cancelled: false },
] as DoctorSession[];

const pref = (kind: NursePreference['kind'], refId: string, rank: number): NursePreference => ({ kind, refId, rank });

async function doctorOfAmy(amy: Nurse) {
  const result = await SchedulingEngine.generate(
    makeSchedule({ startDate: DATE, endDate: DATE, hoursTargetFullTime: 8 }),
    'GENERATE_ALL',
    [],
    [amy, makeNurse('ben')],
    [SENIOR],
    [DAY_DUTY, LATE],
    [],
    [CARD, ORTHO],
    SESSIONS,
    [],
    [],
    hoursOnlyRules(),
    undefined,
    [],
    [LEE, KHAN],
    []
  );
  return result.assignments.find((a) => a.nurseId === 'amy' && a.date === DATE)?.doctorId;
}

test('list order: a #1 specialty beats a #2 doctor even when that doctor is filled first', async () => {
  const amy = makeNurse('amy', { preferences: [pref('SPECIALTY', CARD.id, 1), pref('DOCTOR', LEE.id, 2)] });
  assert.equal(await doctorOfAmy(amy), KHAN.id);
});

test('list order: a #1 doctor beats a #2 specialty', async () => {
  const amy = makeNurse('amy', { preferences: [pref('DOCTOR', LEE.id, 1), pref('SPECIALTY', CARD.id, 2)] });
  assert.equal(await doctorOfAmy(amy), LEE.id);
});

test('"Preferred doctors first" puts her doctor first whatever the list order', async () => {
  const amy = makeNurse('amy', {
    preferenceFocus: 'DOCTOR',
    preferences: [pref('SPECIALTY', CARD.id, 1), pref('DOCTOR', LEE.id, 2)],
  });
  assert.equal(await doctorOfAmy(amy), LEE.id);
});

test('"Specialty first" puts her specialty first whatever the list order', async () => {
  const amy = makeNurse('amy', {
    preferenceFocus: 'SPECIALTY',
    preferences: [pref('DOCTOR', LEE.id, 1), pref('SPECIALTY', CARD.id, 2)],
  });
  assert.equal(await doctorOfAmy(amy), KHAN.id);
});

test('applyPreferenceFocus reorders doctors and specialties, keeping the rank numbers used', () => {
  const nurse = makeNurse('n', {
    preferenceFocus: 'DOCTOR',
    preferences: [pref('SPECIALTY', 'a', 1), pref('DOCTOR', 'b', 2), pref('CLINICAL_ROLE', 'nc', 3), pref('DOCTOR', 'c', 4)],
  });
  const ranks = Object.fromEntries(applyPreferenceFocus(nurse).preferences.map((p) => [p.refId, p.rank]));
  assert.deepEqual(ranks, { b: 1, c: 2, nc: 3, a: 4 });

  const listOrder = makeNurse('n', { preferences: nurse.preferences });
  assert.equal(applyPreferenceFocus(listOrder), listOrder); // unchanged
  const doctorsOnly = makeNurse('n', { preferenceFocus: 'SPECIALTY', preferences: [pref('DOCTOR', 'b', 1)] });
  assert.equal(applyPreferenceFocus(doctorsOnly), doctorsOnly); // nothing to reorder
});
