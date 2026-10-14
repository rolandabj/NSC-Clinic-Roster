import test from 'node:test';
import assert from 'node:assert/strict';
import { filterNurses, nurseCounts } from '../../src/services/nurses/nurseList';

const nurse = (id: string, over: Record<string, any> = {}) =>
  ({ id, fullName: `Nurse ${id}`, gmail: `${id}@example.com`, employeeCode: `E-${id}`, seniorityLevelId: 'lvl-1', active: true, ...over }) as any;

const nurses = [
  nurse('mary', { fullName: 'Mary Lee', employeeCode: 'N-104' }),
  nurse('omar', { fullName: 'Omar Saleh', seniorityLevelId: 'lvl-2', gmail: 'OMAR.S@example.com' }),
  nurse('ann', { fullName: 'Ann Cruz', active: false }),
  // Records saved by older versions may miss the email or the code.
  nurse('old', { fullName: 'Old Record', gmail: undefined, employeeCode: undefined }),
];

const ids = (list: any[]) => list.map((n) => n.id);

test('the search finds a nurse by name, code or email, in any case, ignoring spaces around it', () => {
  assert.deepEqual(ids(filterNurses(nurses, { query: '  mary ', levelId: 'ALL', status: 'ALL' })), ['mary']);
  assert.deepEqual(ids(filterNurses(nurses, { query: 'n-104', levelId: 'ALL', status: 'ALL' })), ['mary']);
  assert.deepEqual(ids(filterNurses(nurses, { query: 'omar.s@', levelId: 'ALL', status: 'ALL' })), ['omar']);
  assert.deepEqual(ids(filterNurses(nurses, { query: '', levelId: 'ALL', status: 'ALL' })), ['mary', 'omar', 'ann', 'old']);
});

test('a record without an email or a code does not break the search', () => {
  assert.deepEqual(ids(filterNurses(nurses, { query: 'record', levelId: 'ALL', status: 'ALL' })), ['old']);
});

test('the level and status filters narrow the list', () => {
  assert.deepEqual(ids(filterNurses(nurses, { query: '', levelId: 'lvl-2', status: 'ALL' })), ['omar']);
  assert.deepEqual(ids(filterNurses(nurses, { query: '', levelId: 'ALL', status: 'INACTIVE' })), ['ann']);
  assert.deepEqual(ids(filterNurses(nurses, { query: '', levelId: 'lvl-1', status: 'ACTIVE' })), ['mary', 'old']);
});

test('the counts say how many nurses there are and how many are active', () => {
  assert.deepEqual(nurseCounts(nurses), { total: 4, active: 3 });
});
