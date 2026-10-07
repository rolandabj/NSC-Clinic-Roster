import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthRange, defaultPatternRange, defaultSessionDate, requestDefaults } from '../../src/utils/dateDefaults';
import { makeSchedule } from './fixtures';

// Screens used to open on October 2026 whatever the date (owner's plan, Phase 1).

test('a month runs from its first to its last day, leap years included', () => {
  assert.deepEqual(monthRange('2026-11-16'), { startDate: '2026-11-01', endDate: '2026-11-30' });
  assert.deepEqual(monthRange('2028-02-10'), { startDate: '2028-02-01', endDate: '2028-02-29' });
  assert.deepEqual(monthRange('2026-12-31'), { startDate: '2026-12-01', endDate: '2026-12-31' });
});

test('putting the usual week on dates offers the open roster first', () => {
  const nov = makeSchedule({ id: 'nov', startDate: '2026-11-16', endDate: '2026-11-29' });
  const dec = makeSchedule({ id: 'dec', startDate: '2026-11-30', endDate: '2026-12-27' });
  assert.deepEqual(defaultPatternRange([nov, dec], 'dec', '2026-11-20'), { startDate: '2026-11-30', endDate: '2026-12-27' });
});

test('without an open roster it offers the roster covering today, then the next one, then this month', () => {
  const nov = makeSchedule({ id: 'nov', startDate: '2026-11-16', endDate: '2026-11-29' });
  const dec = makeSchedule({ id: 'dec', startDate: '2026-11-30', endDate: '2026-12-27' });
  assert.deepEqual(defaultPatternRange([nov, dec], undefined, '2026-11-20'), { startDate: '2026-11-16', endDate: '2026-11-29' });
  assert.deepEqual(defaultPatternRange([dec, nov], undefined, '2026-10-07'), { startDate: '2026-11-16', endDate: '2026-11-29' });
  assert.deepEqual(defaultPatternRange([nov], undefined, '2027-01-10'), { startDate: '2027-01-01', endDate: '2027-01-31' });
});

test('archived rosters are never offered', () => {
  const old = makeSchedule({ id: 'old', startDate: '2026-11-16', endDate: '2026-11-29', status: 'ARCHIVED' });
  assert.deepEqual(defaultPatternRange([old], 'old', '2026-11-20'), { startDate: '2026-11-01', endDate: '2026-11-30' });
});

test('an extra clinic starts on today, or on the open roster first day when it has not started yet', () => {
  const nov = makeSchedule({ id: 'nov', startDate: '2026-11-16', endDate: '2026-11-29' });
  assert.equal(defaultSessionDate([nov], 'nov', '2026-10-07'), '2026-11-16');
  assert.equal(defaultSessionDate([nov], 'nov', '2026-11-20'), '2026-11-20');
  assert.equal(defaultSessionDate([nov], 'nov', '2026-12-05'), '2026-12-05');
  assert.equal(defaultSessionDate([], undefined, '2026-12-05'), '2026-12-05');
});

test("a nurse's request form suggests one day a week ahead", () => {
  assert.deepEqual(requestDefaults('2026-10-07'), { leaveStartDate: '2026-10-14', leaveEndDate: '2026-10-14', dayOffDate: '2026-10-14' });
  assert.deepEqual(requestDefaults('2026-12-28'), { leaveStartDate: '2027-01-04', leaveEndDate: '2027-01-04', dayOffDate: '2027-01-04' });
});
