import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestRosterName } from '../../src/services/schedule/rosterName';

// The name offered for a new roster (Phase 7, slice 3c): plain words, no dashes, no US dates.

test('a whole month is named by the month and year', () => {
  assert.equal(suggestRosterName('2026-11-01', '2026-11-30'), 'November 2026');
});

test('part of one month names its days', () => {
  assert.equal(suggestRosterName('2026-11-16', '2026-11-29'), '16 to 29 November 2026');
});

test('two months name both, and two years both years', () => {
  assert.equal(suggestRosterName('2026-11-16', '2026-12-13'), '16 November to 13 December 2026');
  assert.equal(suggestRosterName('2026-12-21', '2027-01-17'), '21 December 2026 to 17 January 2027');
});

test('missing or backward dates give "New roster"', () => {
  assert.equal(suggestRosterName('', '2026-11-30'), 'New roster');
  assert.equal(suggestRosterName('2026-11-30', '2026-11-01'), 'New roster');
});
