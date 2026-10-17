import test from 'node:test';
import assert from 'node:assert/strict';
import { readNurseRows, readDoctorRows } from '../../src/services/import/peopleImport';

// The nurses and doctors CSV import (Phase 7, slice 3c): every row checked, every problem named,
// nothing made up.

const levels = [{ id: 'jun', name: 'Junior Nurse' }, { id: 'staff', name: 'Staff Nurse' }, { id: 'sen', name: 'Senior Nurse' }] as any[];
const roles = [{ id: 'nc', name: 'Clinic Nurse', acronym: 'NC' }, { id: 'bc', name: 'Blood Collection & IV', acronym: 'BC' }] as any[];
const nurses = [{ id: 'amy', fullName: 'Amy', gmail: 'amy@clinic.ae', employeeCode: 'N-101' }] as any[];
const header = 'fullName,gmail,employeeCode,seniorityLevel,contractPercent,dateOfBirth,capabilities';

test('a good nurse row is read as written, with dates as DD-MM-YYYY or YYYY-MM-DD', () => {
  const rows = readNurseRows(`${header}\nLina Haddad,lina@clinic.ae,N-120,Senior Nurse,80,14-05-1992,Clinic Nurse;BC`, { levels, roles, nurses, today: '2026-10-17' });
  assert.deepEqual(rows[0].problems, []);
  assert.deepEqual(rows[0].nurse, { fullName: 'Lina Haddad', gmail: 'lina@clinic.ae', employeeCode: 'N-120', seniorityLevelId: 'sen', contractPercent: 80, dateOfBirth: '1992-05-14', capabilityIds: ['nc', 'bc'] });
});

test('nothing is made up: no date of birth stays empty, and a missing code takes the first free one', () => {
  const rows = readNurseRows(`${header}\nLina,lina@clinic.ae,,Staff Nurse,,,\nOmar,omar@clinic.ae,,Staff Nurse,,,`, { levels, roles, nurses, today: '2026-10-17' });
  assert.equal(rows[0].nurse.dateOfBirth, '');
  assert.equal(rows[0].nurse.contractPercent, 100);
  assert.deepEqual([rows[0].nurse.employeeCode, rows[1].nurse.employeeCode], ['N-102', 'N-103']);
  assert.deepEqual(rows[0].nurse.capabilityIds, ['nc']);
});

test('each problem in a nurse row is named', () => {
  const rows = readNurseRows(
    `${header}\n,bad-email,N-101,Matron,150,31-02-1990,Juggling\nZed,AMY@clinic.ae,,Staff Nurse,100,01-01-2030,\nYan,yan@clinic.ae,,Staff Nurse,100,,\nYin,yan@clinic.ae,,Staff Nurse,100,,`,
    { levels, roles, nurses, today: '2026-10-17' }
  );
  assert.deepEqual(rows[0].problems, [
    'no name',
    'bad-email is not an email address',
    'Amy already has the code N-101',
    'no nurse level is called Matron (Junior Nurse, Staff Nurse, Senior Nurse)',
    'the contract must be a whole number from 10 to 100',
    '31-02-1990 is not a date',
    'no nurse skill is called Juggling',
  ]);
  assert.deepEqual(rows[1].problems, ['Amy already has the email AMY@clinic.ae', 'the date of birth is after today']);
  assert.deepEqual(rows[2].problems, []);
  assert.deepEqual(rows[3].problems, ['row 3 already has the email yan@clinic.ae']);
});

test("a doctor's usual week is read from the file, not made up", () => {
  const specialties = [{ id: 'card', name: 'Cardiology', code: 'CARD' }, { id: 'ped', name: 'Pediatrics', code: 'PED' }] as any[];
  const rows = readDoctorRows(
    'fullName,gmail,specialties,weeklyPattern\nDr Hamad,hamad@clinic.ae,Cardiology,Sun 09:00-13:00 Room 1;Tue 14:00-18:00\nDr Reem,,ped,\nDr X,x@,Surgery,Funday 9-1',
    { specialties, doctors: [] }
  );
  assert.deepEqual(rows[0].problems, []);
  assert.deepEqual(rows[0].doctor, {
    fullName: 'Dr Hamad',
    gmail: 'hamad@clinic.ae',
    specialtyIds: ['card'],
    weeklyPattern: [
      { weekday: 0, startTime: '09:00', endTime: '13:00', room: 'Room 1' },
      { weekday: 2, startTime: '14:00', endTime: '18:00', room: '' },
    ],
  });
  assert.deepEqual(rows[1].problems, []);
  assert.deepEqual(rows[1].doctor.weeklyPattern, []);
  assert.deepEqual(rows[2].problems, [
    'x@ is not an email address',
    'no specialty is called Surgery',
    '"Funday 9-1" is not a clinic like Sun 09:00-13:00 Room 1',
  ]);
});

test('two doctor rows with the same email are refused (Checkpoint 7)', () => {
  const text = 'Name,Email,Specialties\nDr Ana,ana@x.com,ENT\nDr Ann,ana@x.com,ENT';
  const rows = readDoctorRows(text, { specialties: [{ id: 'ent', name: 'ENT', code: 'ENT' }], doctors: [] });
  assert.equal(rows[0].problems.length, 0);
  assert.ok(rows[1].problems.some((p) => /row 1 already has the email ana@x\.com/i.test(p)), rows[1].problems.join(' | '));
});
