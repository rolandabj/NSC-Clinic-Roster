import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suggestNewRosterDates } from '../../src/services/schedule/newRosterDates';

test('no roster yet: next calendar month', () => {
  assert.deepEqual(suggestNewRosterDates([], new Date('2026-10-02T09:00:00Z')), { start: '2026-11-01', end: '2026-11-30' });
});

test('starts the day after the last roster, to the end of that month', () => {
  const existing = [
    { startDate: '2026-10-01', endDate: '2026-10-31' },
    { startDate: '2026-11-01', endDate: '2026-11-30' },
  ];
  assert.deepEqual(suggestNewRosterDates(existing), { start: '2026-12-01', end: '2026-12-31' });
});

test('a roster that does not end on a month end: same length as the last one', () => {
  assert.deepEqual(suggestNewRosterDates([{ startDate: '2026-11-02', endDate: '2026-11-29' }]), {
    start: '2026-11-30',
    end: '2026-12-27',
  });
});
