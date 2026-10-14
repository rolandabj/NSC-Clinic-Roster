import test from 'node:test';
import assert from 'node:assert/strict';
import { checkNurseForm, movePreference, nextEmployeeCode } from '../../src/services/nurses/nurseForm';

const TODAY = '2026-10-14';
const others = [
  { id: 'mary', fullName: 'Mary Lee', gmail: 'mary.lee@gmail.com', employeeCode: 'N-104' },
  // Records saved by older versions may miss the email or the code.
  { id: 'old', fullName: 'Old Record' },
] as any[];

const form = (over: Record<string, any> = {}) => ({
  fullName: 'Omar Saleh',
  gmail: 'omar@gmail.com',
  employeeCode: 'N-200',
  contractPercent: 100,
  dateOfBirth: '1990-03-02',
  leaveQuotas: {},
  ...over,
});

test('a complete form has no errors', () => {
  assert.deepEqual(checkNurseForm(form(), others, undefined, TODAY), {});
});

test('the name and the email are needed, and the email must look like one', () => {
  assert.deepEqual(checkNurseForm(form({ fullName: '  ', gmail: '' }), others, undefined, TODAY), {
    fullName: "Enter the nurse's full name.",
    gmail: 'Enter an email address. Rosters and the private page are sent to it.',
  });
  assert.equal(checkNurseForm(form({ gmail: 'omar@gmail' }), others, undefined, TODAY).gmail, 'Enter an email address like name@gmail.com.');
});

test('another nurse with the same email or employee code is named, in any case', () => {
  const errors = checkNurseForm(form({ gmail: ' Mary.Lee@Gmail.com ', employeeCode: 'n-104' }), others, undefined, TODAY);
  assert.equal(errors.gmail, 'Mary Lee already has this email address.');
  assert.equal(errors.employeeCode, 'Mary Lee already has this employee code.');
  // The nurse being edited is not a clash with itself.
  assert.deepEqual(checkNurseForm(form({ gmail: 'mary.lee@gmail.com', employeeCode: 'N-104' }), others, 'mary', TODAY), {});
});

test('the contract is a whole number from 10 to 100', () => {
  for (const bad of [0, 9, 101, 75.5, NaN]) {
    assert.equal(checkNurseForm(form({ contractPercent: bad }), others, undefined, TODAY).contractPercent, 'Enter a whole number from 10 to 100.', String(bad));
  }
  assert.equal(checkNurseForm(form({ contractPercent: 10 }), others, undefined, TODAY).contractPercent, undefined);
});

test('the date of birth is needed and cannot be in the future', () => {
  assert.equal(checkNurseForm(form({ dateOfBirth: '' }), others, undefined, TODAY).dateOfBirth, 'Enter the date of birth, like 18-11-1990.');
  assert.equal(checkNurseForm(form({ dateOfBirth: '2026-10-15' }), others, undefined, TODAY).dateOfBirth, 'The date of birth is after today.');
});

test('leave days a year are whole numbers from 0 to 366', () => {
  const errors = checkNurseForm(form({ leaveQuotas: { al: 30, bl: 400, pl: 2.5 } }), others, undefined, TODAY);
  assert.deepEqual(errors, { 'quota:bl': 'Enter a whole number of days from 0 to 366.', 'quota:pl': 'Enter a whole number of days from 0 to 366.' });
});

test('moving a preference keeps the ranks in order', () => {
  const prefs = [
    { kind: 'DOCTOR', refId: 'lee', rank: 1 },
    { kind: 'DOCTOR', refId: 'ray', rank: 2 },
    { kind: 'SPECIALTY', refId: 'ent', rank: 3 },
  ] as any[];
  assert.deepEqual(movePreference(prefs, 2, 0).map((p) => `${p.rank}:${p.refId}`), ['1:ent', '2:lee', '3:ray']);
  assert.deepEqual(movePreference(prefs, 0, 1).map((p) => `${p.rank}:${p.refId}`), ['1:ray', '2:lee', '3:ent']);
  // Past either end nothing moves.
  assert.equal(movePreference(prefs, 0, -1), prefs);
  assert.equal(movePreference(prefs, 2, 3), prefs);
});

test('a record saved without an email, a code or a date of birth is checked without breaking', () => {
  const errors = checkNurseForm({ fullName: 'Old Record', gmail: undefined, employeeCode: undefined, contractPercent: 100, dateOfBirth: undefined, leaveQuotas: {} } as any, others, 'old', TODAY);
  assert.equal(errors.gmail, 'Enter an email address. Rosters and the private page are sent to it.');
  assert.equal(errors.dateOfBirth, 'Enter the date of birth, like 18-11-1990.');
  assert.equal(errors.employeeCode, undefined);
});

test('a new nurse is offered the first free employee code', () => {
  const nurses = [{ employeeCode: 'N-101' }, { employeeCode: 'N-103' }, { employeeCode: 'n-102' }, { employeeCode: 'X-9' }, {}] as any[];
  assert.equal(nextEmployeeCode(nurses), 'N-104');
  assert.equal(nextEmployeeCode([]), 'N-101');
  assert.equal(nextEmployeeCode([{ employeeCode: 'N-101' }, { employeeCode: 'N-103' }] as any[]), 'N-102');
});
