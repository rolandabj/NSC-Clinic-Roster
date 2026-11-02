import test from 'node:test';
import assert from 'node:assert/strict';
import { nextPeriodDefaults } from '../../src/services/hours/nextPeriod';

// Settings, Time periods (Phase 8, slice 1d): a new period starts at the next cycle, not at 19-01-2026.

const p = (startDate: string, endDate: string) => ({ startDate, endDate });

test('a new period starts the day after the latest one ends and runs one cycle', () => {
  const d = nextPeriodDefaults([p('2026-09-19', '2026-10-18'), p('2026-10-19', '2026-11-18')], '2026-11-02');
  assert.deepEqual(d, { startDate: '2026-11-19', endDate: '2026-12-18', name: 'Nov19-Dec18', year: '2026' });
});

test('a period across the year end is named for both years', () => {
  const d = nextPeriodDefaults([p('2026-11-19', '2026-12-18')], '2026-11-02');
  assert.deepEqual(d, { startDate: '2026-12-19', endDate: '2027-01-18', name: 'Dec19-Jan18', year: '2026-2027' });
});

test('with no periods yet, it starts on the next 19th', () => {
  assert.equal(nextPeriodDefaults([], '2026-11-02').startDate, '2026-11-19');
  assert.equal(nextPeriodDefaults([], '2026-11-25').startDate, '2026-12-19');
  assert.equal(nextPeriodDefaults([], '2026-11-19').startDate, '2026-11-19');
});

test('a cycle that does not start on the 19th keeps its own day, and short months are fine', () => {
  const d = nextPeriodDefaults([p('2026-12-01', '2026-12-31')], '2026-11-02');
  assert.deepEqual(d, { startDate: '2027-01-01', endDate: '2027-01-31', name: 'Jan1-Jan31', year: '2027' });
  const e = nextPeriodDefaults([p('2027-01-01', '2027-01-30')], '2026-11-02');
  assert.equal(e.startDate, '2027-01-31');
  assert.equal(e.endDate, '2027-02-27', 'the day before 31 February, which is 28 February, falls back to the month end less a day');
});
