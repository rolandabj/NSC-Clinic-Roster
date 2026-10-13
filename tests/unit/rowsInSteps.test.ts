import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextRowLimit, ROW_STEP } from '../../src/components/workbook/grid/rowsInSteps';

// The roster grid draws a full size roster's rows in steps (UI overhaul Phase 4, slice 4, part 3):
// the first rows at once, the rest over the next frames, so no single task lays out every cell
// (the longest task while loading was over 200 ms, all of it the browser's styles and layout).

test('rows are added one step at a time until all are drawn', () => {
  assert.equal(ROW_STEP, 20);
  assert.equal(nextRowLimit(20, 60), 40);
  assert.equal(nextRowLimit(40, 60), 60);
  assert.equal(nextRowLimit(60, 60), 60, 'all drawn: no more steps');
});

test('a small roster is drawn in one step', () => {
  assert.equal(nextRowLimit(20, 4), 4);
  assert.equal(nextRowLimit(4, 4), 4);
});
