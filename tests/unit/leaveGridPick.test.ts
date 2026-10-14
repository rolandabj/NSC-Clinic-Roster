import test from 'node:test';
import assert from 'node:assert/strict';
import { pickStep, moveInGrid } from '../../src/services/availability/leaveGridPick';

test('the first click starts the leave and the second ends it, in either order', () => {
  const first = pickStep(null, { nurseId: 'mary', day: 20 });
  assert.deepEqual(first, { start: { nurseId: 'mary', day: 20 } });
  assert.deepEqual(pickStep(first.start, { nurseId: 'mary', day: 23 }), { start: null, range: { nurseId: 'mary', from: 20, to: 23 } });
  // Clicking an earlier day ends it too: the range runs from the earlier day.
  assert.deepEqual(pickStep(first.start, { nurseId: 'mary', day: 17 }), { start: null, range: { nurseId: 'mary', from: 17, to: 20 } });
});

test('the same day twice is one day of leave', () => {
  assert.deepEqual(pickStep({ nurseId: 'mary', day: 5 }, { nurseId: 'mary', day: 5 }), { start: null, range: { nurseId: 'mary', from: 5, to: 5 } });
});

test("a click on another nurse's row starts again there", () => {
  assert.deepEqual(pickStep({ nurseId: 'mary', day: 5 }, { nurseId: 'amy', day: 9 }), { start: { nurseId: 'amy', day: 9 } });
});

test('the arrow keys move one day or one nurse, Home and End go to the first and last day, and the edges hold', () => {
  const rows = 4;
  const cols = 30;
  assert.deepEqual(moveInGrid(1, 5, 'ArrowRight', rows, cols), [1, 6]);
  assert.deepEqual(moveInGrid(1, 5, 'ArrowLeft', rows, cols), [1, 4]);
  assert.deepEqual(moveInGrid(1, 5, 'ArrowDown', rows, cols), [2, 5]);
  assert.deepEqual(moveInGrid(1, 5, 'ArrowUp', rows, cols), [0, 5]);
  assert.deepEqual(moveInGrid(1, 5, 'Home', rows, cols), [1, 0]);
  assert.deepEqual(moveInGrid(1, 5, 'End', rows, cols), [1, 29]);
  assert.deepEqual(moveInGrid(0, 0, 'ArrowUp', rows, cols), [0, 0]);
  assert.deepEqual(moveInGrid(3, 29, 'ArrowRight', rows, cols), [3, 29]);
  assert.equal(moveInGrid(1, 5, 'a', rows, cols), null);
});
