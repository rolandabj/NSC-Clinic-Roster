import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APP_NAME, SCREEN_NAMES, screenTitle } from '../../src/components/layout/screenTitles';

// One app name, and a browser tab title for each screen (UI overhaul Phase 2): the tab says
// where you are first, then the app, with no dashes.

test('the app has one name', () => {
  assert.equal(APP_NAME, 'NSC Clinic Roster');
});

test('each screen is named in its browser tab, the screen first', () => {
  assert.equal(screenTitle('schedules'), 'Rosters · NSC Clinic Roster');
  assert.equal(screenTitle('audit'), 'Audit trail · NSC Clinic Roster');
  assert.equal(screenTitle('settings', 'Email'), 'Email · Settings · NSC Clinic Roster');
});

test('every screen has a plain name without dashes', () => {
  for (const [route, name] of Object.entries(SCREEN_NAMES)) {
    assert.ok(name.length > 0, route);
    assert.doesNotMatch(name, /[-–—]/, route);
    assert.doesNotMatch(screenTitle(route as keyof typeof SCREEN_NAMES), /[-–—]/, route);
  }
});
