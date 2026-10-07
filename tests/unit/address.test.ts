import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addressHash, readAddress, rosterSheetFromAddress, rosterSheetToAddress } from '../../src/services/navigation/address';

// Links that open a given roster, day, nurse or settings tab, and Back between tabs
// (UI overhaul Phase 2). The address after # names the screen, then what is open on it.

test('an address names the screen, then what is open on it', () => {
  assert.deepEqual(readAddress('#schedules?roster=nov&sheet=problems&date=2026-11-20'), {
    route: 'schedules',
    params: { roster: 'nov', sheet: 'problems', date: '2026-11-20' },
  });
  assert.deepEqual(readAddress('#settings?tab=email'), { route: 'settings', params: { tab: 'email' } });
  assert.deepEqual(readAddress('#dashboard'), { route: 'dashboard', params: {} });
  assert.deepEqual(readAddress(''), { route: '', params: {} });
  assert.deepEqual(readAddress('nurses?nurse=amy%20b'), { route: 'nurses', params: { nurse: 'amy b' } });
});

test('an address is written in a fixed order, leaving out what is empty', () => {
  assert.equal(addressHash('schedules', { roster: 'nov', sheet: 'problems' }), '#schedules?roster=nov&sheet=problems');
  assert.equal(addressHash('schedules', { roster: 'nov', sheet: undefined, date: '' }), '#schedules?roster=nov');
  assert.equal(addressHash('settings'), '#settings');
  assert.equal(addressHash('nurses', { nurse: 'amy b' }), '#nurses?nurse=amy%20b');
});

test('reading what was written gives the same address back', () => {
  const params = { roster: 'r-1', sheet: 'hours', nurse: 'mary', date: '2026-11-16' };
  assert.deepEqual(readAddress(addressHash('schedules', params)), { route: 'schedules', params });
});

test("the roster's sheets have plain names in the address", () => {
  assert.equal(rosterSheetToAddress('warnings'), 'problems');
  assert.equal(rosterSheetToAddress('legend'), 'key');
  assert.equal(rosterSheetToAddress('roster'), undefined);
  assert.equal(rosterSheetFromAddress('problems'), 'warnings');
  assert.equal(rosterSheetFromAddress('key'), 'legend');
  assert.equal(rosterSheetFromAddress('hours'), 'hours');
  assert.equal(rosterSheetFromAddress('nonsense'), undefined);
  assert.equal(rosterSheetFromAddress(undefined), undefined);
});
