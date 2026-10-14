import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDoctorForm, filterDoctors, usualWeekLines } from '../../src/services/doctors/doctorForm';

const doctors = [
  { id: 'lee', fullName: 'Dr Lee', gmail: 'lee@example.com', specialtyIds: ['ortho'], weeklyPattern: [{ weekday: 1, startTime: '09:00', endTime: '13:00' }], notes: 'Knees and hips', active: true },
  { id: 'ray', fullName: 'Dr Ray', gmail: 'RAY@example.com', specialtyIds: ['ent'], weeklyPattern: [], active: true },
  // Records saved by older versions may miss the email or the specialties.
  { id: 'old', fullName: 'Dr Old', active: false },
] as any[];

const form = (over: Record<string, any> = {}) => ({
  fullName: 'Dr Sami',
  gmail: '',
  specialtyIds: ['ent'],
  weeklyPattern: [
    { weekday: 1, startTime: '09:00', endTime: '13:00' },
    { weekday: 3, startTime: '14:00', endTime: '17:00' },
  ],
  ...over,
});

test('a complete form has no errors, and the email may be left empty', () => {
  assert.deepEqual(checkDoctorForm(form(), doctors, undefined, true), {});
});

test('the name is needed, and a specialty when the clinic has some', () => {
  assert.deepEqual(checkDoctorForm(form({ fullName: ' ', specialtyIds: [] }), doctors, undefined, true), {
    fullName: "Enter the doctor's full name.",
    specialtyIds: 'Choose at least one specialty.',
  });
  // With no specialties at all, saving adds General Practice.
  assert.equal(checkDoctorForm(form({ specialtyIds: [] }), doctors, undefined, false).specialtyIds, undefined);
});

test('an email, when given, must look like one and belong to no other doctor', () => {
  assert.equal(checkDoctorForm(form({ gmail: 'sami@' }), doctors, undefined, true).gmail, 'Enter an email address like name@gmail.com, or leave it empty.');
  assert.equal(checkDoctorForm(form({ gmail: ' ray@EXAMPLE.com ' }), doctors, undefined, true).gmail, 'Dr Ray already has this email address.');
  assert.equal(checkDoctorForm(form({ gmail: 'ray@example.com' }), doctors, 'ray', true).gmail, undefined);
});

test('each clinic in the usual week ends after it starts and does not overlap another that day', () => {
  const errors = checkDoctorForm(
    form({
      weeklyPattern: [
        { weekday: 1, startTime: '09:00', endTime: '13:00' },
        { weekday: 1, startTime: '12:00', endTime: '15:00' },
        { weekday: 2, startTime: '14:00', endTime: '14:00' },
        { weekday: 3, startTime: '', endTime: '12:00' },
      ],
    }),
    doctors,
    undefined,
    true
  );
  assert.deepEqual(errors, {
    'pattern:1': 'Overlaps the Monday clinic from 09:00 to 13:00.',
    'pattern:2': 'The end time must be after the start time.',
    'pattern:3': 'Enter a start and an end time.',
  });
  // One clinic ending as the next starts is fine.
  assert.deepEqual(checkDoctorForm(form({ weeklyPattern: [{ weekday: 1, startTime: '09:00', endTime: '13:00' }, { weekday: 1, startTime: '13:00', endTime: '15:00' }] }), doctors, undefined, true), {});
});

test('the doctors list is searched by name or note, and filtered by specialty and status', () => {
  const ids = (q: string, specialtyId = 'ALL', status: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL') => filterDoctors(doctors, { query: q, specialtyId, status }).map((d) => d.id);
  assert.deepEqual(ids(' RAY '), ['ray']);
  assert.deepEqual(ids('hips'), ['lee']);
  assert.deepEqual(ids('', 'ortho'), ['lee']);
  assert.deepEqual(ids('', 'ALL', 'INACTIVE'), ['old']);
  assert.deepEqual(ids('dr', 'ALL', 'ACTIVE'), ['lee', 'ray']);
});

test('the usual week reads as days in week order with times', () => {
  assert.deepEqual(
    usualWeekLines([
      { weekday: 3, startTime: '14:00', endTime: '17:00', room: 'R2' },
      { weekday: 1, startTime: '09:00', endTime: '13:00' },
    ]),
    ['Monday 09:00 to 13:00', 'Wednesday 14:00 to 17:00, R2']
  );
  assert.deepEqual(usualWeekLines(undefined), []);
});
