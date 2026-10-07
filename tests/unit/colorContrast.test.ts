import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, readableTextOn, tint, INK, INK_MUTED } from '../../src/utils/colorContrast';

// Planners choose the shift and leave colours in Settings. The screens show them as a light
// tint with a coloured edge, or as a solid chip, and the text on them must stay readable
// (4.5:1) whatever colour was chosen (UI overhaul Phase 2).

test('contrast is worked out as WCAG does', () => {
  assert.equal(contrastRatio('#ffffff', '#000000'), 21);
  assert.equal(contrastRatio('#000', '#fff'), 21);
  assert.equal(contrastRatio('#0e7490', '#ffffff').toFixed(2), '5.36');
  assert.equal(contrastRatio('#475569', '#f1f5f9').toFixed(2), '6.92');
});

test('a solid chip gets white text on dark colours and dark text on light ones', () => {
  assert.equal(readableTextOn('#4f46e5'), '#ffffff');
  assert.equal(readableTextOn('#7c3aed'), '#ffffff');
  assert.equal(readableTextOn('#fde68a'), INK);
  assert.equal(readableTextOn('#10b981'), INK);
  assert.equal(readableTextOn('#F59E0B'), INK);
  // Pure red is too dark for the dark text and too light for white (4.48:1 and 4.0:1): black reads.
  assert.equal(readableTextOn('#ff0000'), '#000000');
});

test('whatever colour is chosen, the text picked for it reads at 4.5:1 or more', () => {
  for (let r = 0; r <= 255; r += 51) {
    for (let g = 0; g <= 255; g += 51) {
      for (let b = 0; b <= 255; b += 51) {
        const hex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
        assert.ok(contrastRatio(readableTextOn(hex), hex) >= 4.5, hex);
      }
    }
  }
});

test('a tint is the colour mixed into white, and the muted text on any tint reads at 6:1', () => {
  assert.equal(tint('#2563eb'), '#e9effd');
  assert.equal(tint('#000000'), '#e6e6e6');
  assert.equal(tint('#fff'), '#ffffff');
  assert.equal(tint('#2563eb', 0.2), '#d3e0fb');
  for (let r = 0; r <= 255; r += 51) {
    for (let g = 0; g <= 255; g += 51) {
      for (let b = 0; b <= 255; b += 51) {
        const hex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
        assert.ok(contrastRatio(INK_MUTED, tint(hex)) >= 6, hex);
      }
    }
  }
});

test('a stored colour that is not a colour falls back to readable defaults', () => {
  assert.equal(readableTextOn('blue'), INK);
  assert.equal(readableTextOn(''), INK);
  assert.equal(readableTextOn(undefined), INK);
  assert.equal(tint('#12'), '#f1f5f9');
  assert.equal(tint(null), '#f1f5f9');
});
