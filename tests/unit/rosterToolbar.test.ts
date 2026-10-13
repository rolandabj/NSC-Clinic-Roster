import { test } from 'node:test';
import assert from 'node:assert/strict';
import { menuSections, type MenuItem } from '../../src/components/common/MenuButton';
import { moreMenuItems } from '../../src/components/roster/RosterToolbar';

// The roster toolbar regrouped (UI overhaul Phase 4, slice 3): More's nine entries in four named
// groups (Roster, Copies, Share and export, Tools), read out as groups, and a toolbar that fits
// on one line on a 1024 px laptop.

const item = (label: string, group?: string): MenuItem => ({ label, group, onSelect: () => {} });

test('menu items are split into sections by their group, in order', () => {
  const sections = menuSections([item('a', 'One'), item('b', 'One'), item('c', 'Two'), item('d', 'Two')]);
  assert.deepEqual(
    sections.map((s) => [s.group, s.items.map((i) => i.label), s.start]),
    [
      ['One', ['a', 'b'], 0],
      ['Two', ['c', 'd'], 2],
    ]
  );
  assert.deepEqual(
    menuSections([item('a'), item('b')]).map((s) => [s.group, s.items.length]),
    [[undefined, 2]],
    'a menu without groups is one section with no name'
  );
});

test("More's entries sit in four groups", () => {
  const items = moreMenuItems({ hasRoster: true, onMenu: () => {} });
  const groups = menuSections(items).map((s) => `${s.group}: ${s.items.map((i) => i.label).join(', ')}`);
  assert.deepEqual(groups, [
    'Roster: New roster…, Templates and copy last roster…',
    'Copies: Keep a copy…, Backup copies…, Compare saved copies',
    'Share and export: Export or print…, Share links…',
    'Tools: Fairness…, Swap two nurses’ shifts…',
  ]);
});

test('with no roster open only New roster can be used', () => {
  const usable = moreMenuItems({ hasRoster: false, onMenu: () => {} }).filter((i) => !i.disabled).map((i) => i.label);
  assert.deepEqual(usable, ['New roster…']);
});

test('each entry opens its own dialog', () => {
  const opened: string[] = [];
  for (const i of moreMenuItems({ hasRoster: true, onMenu: (m) => opened.push(m) })) i.onSelect();
  assert.deepEqual(opened, ['new', 'templates', 'copy', 'backups', 'compare', 'export', 'share', 'fairness', 'swap']);
});
