import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RosterSheetTabs, ROSTER_SHEET_PANEL_ID } from '../../src/components/roster/RosterSheetTabs';

// The roster screen's sheet tabs (UI overhaul Phase 4, slice 2): above the sheet as real tabs
// (one Tab stop, arrow keys), the Problems tab with the one problem count, the Key folded into the
// grid's Key drawer, and Full screen once, at the end of the row.

const render = (props: Partial<React.ComponentProps<typeof RosterSheetTabs>> = {}) =>
  renderToStaticMarkup(
    React.createElement(RosterSheetTabs, {
      active: 'warnings',
      problems: { mustFix: 28, toCheck: 6, notes: 3 },
      isFullScreen: false,
      onOpen: () => {},
      onToggleFullScreen: () => {},
      ...props,
    })
  );

const tabNames = (html: string) => [...html.matchAll(/role="tab"[^>]*>(.*?)<\/button>/g)].map((m) => m[1].replace(/<[^>]+>/g, ''));

test('the sheets are tabs in a tab list, without a Key sheet', () => {
  const html = render();
  assert.match(html, /role="tablist" aria-label="Roster sheets"/);
  const names = tabNames(html);
  assert.equal(names.length, 6);
  assert.deepEqual(names.slice(0, 3), ['Roster', 'Doctors', 'Coverage by hour']);
  assert.ok(names[3].startsWith('Problems'));
  assert.deepEqual(names.slice(4), ['Leave and pinned days', 'Hours']);
  assert.doesNotMatch(html, />Key</);
  assert.equal((html.match(/tabindex="0"/g) || []).length, 1, 'one Tab stop');
});

test('only the open tab names the panel, which is the one shown', () => {
  const html = render({ active: 'hours' });
  const controls = [...html.matchAll(/aria-controls="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(controls, [ROSTER_SHEET_PANEL_ID]);
  assert.match(html, /id="sheet-tab-hours"[^>]*aria-selected="true"|aria-selected="true"[^>]*id="sheet-tab-hours"/);
});

test('the Problems tab shows the one problem count, read out in full', () => {
  const html = render();
  assert.match(html, /28<span class="sr-only xl:not-sr-only"> must fix<\/span>/);
  assert.match(html, /3<span class="sr-only xl:not-sr-only"> notes<\/span>/);
  assert.match(render({ problems: { mustFix: 0, toCheck: 0, notes: 0 } }), />No problems</);
});

test('Full screen is one button at the end of the row, pressed while full screen', () => {
  const off = render();
  assert.equal((off.match(/>Full screen</g) || []).length, 1);
  assert.match(off, /aria-pressed="false"/);
  assert.match(render({ isFullScreen: true }), /aria-pressed="true"[^>]*title="Leave full screen \(Esc\)"/);
});
