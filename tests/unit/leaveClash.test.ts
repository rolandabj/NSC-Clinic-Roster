import test from 'node:test';
import assert from 'node:assert/strict';
import { leaveClash } from '../../src/services/availability/leaveClash';

const leaves = [
  { id: 'al', nurseId: 'amy', startDate: '2026-10-15', endDate: '2026-10-15', status: 'APPROVED' },
  { id: 'no', nurseId: 'amy', startDate: '2026-10-22', endDate: '2026-10-23', status: 'REJECTED' },
  { id: 'mary', nurseId: 'mary', startDate: '2026-10-12', endDate: '2026-10-20', status: 'APPROVED' },
] as any[];
const pins = [{ id: 'p', nurseId: 'amy', date: '2026-10-18', mode: 'OFF' }] as any[];

test('a leave over another leave of the same nurse is refused, with the day named', () => {
  assert.equal(leaveClash('amy', '2026-10-12', '2026-10-20', leaves, pins), 'Amy already has leave on Thu 15-10-2026.'.replace('Amy', 'This nurse'));
});

test('a leave over a pinned day is refused', () => {
  assert.equal(leaveClash('amy', '2026-10-17', '2026-10-19', leaves, pins), 'This nurse has a pinned day on Sun 18-10-2026. Remove the pin first.');
});

test('declined leave, other nurses and the leave being changed do not count', () => {
  assert.equal(leaveClash('amy', '2026-10-21', '2026-10-24', leaves, pins), null);
  assert.equal(leaveClash('amy', '2026-10-15', '2026-10-16', leaves, pins, 'al'), null);
  assert.equal(leaveClash('nina', '2026-10-12', '2026-10-20', leaves, pins), null);
});
