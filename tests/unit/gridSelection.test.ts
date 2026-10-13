import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CELL_FLASH,
  CELL_POPUP,
  CELL_SELECTED,
  CELL_TAB_STOP,
  createGridSelection,
  moveSelection,
} from '../../src/components/workbook/grid/gridSelection';

// The roster grid's selection, popup and flash in a small store (UI overhaul Phase 3, slice 2):
// a key press or a click tells only the cells whose look changes, not all 1,860.

const NURSES = ['amy', 'mary', 'nina'];
const DATES = ['2026-11-16', '2026-11-17', '2026-11-18'];
const at = (nurseId: string, date: string) => ({ nurseId, date });
const key = (e: string, shiftKey = false) => ({ key: e, shiftKey });

test('arrow keys and Tab move one cell, and stay put at the edge', () => {
  const mary17 = at('mary', '2026-11-17');
  assert.deepEqual(moveSelection(mary17, key('ArrowRight'), NURSES, DATES), at('mary', '2026-11-18'));
  assert.deepEqual(moveSelection(mary17, key('Tab'), NURSES, DATES), at('mary', '2026-11-18'));
  assert.deepEqual(moveSelection(mary17, key('ArrowLeft'), NURSES, DATES), at('mary', '2026-11-16'));
  assert.deepEqual(moveSelection(mary17, key('Tab', true), NURSES, DATES), at('mary', '2026-11-16'));
  assert.deepEqual(moveSelection(mary17, key('ArrowUp'), NURSES, DATES), at('amy', '2026-11-17'));
  assert.deepEqual(moveSelection(mary17, key('ArrowDown'), NURSES, DATES), at('nina', '2026-11-17'));
  assert.deepEqual(moveSelection(at('amy', '2026-11-16'), key('ArrowUp'), NURSES, DATES), at('amy', '2026-11-16'));
  assert.deepEqual(moveSelection(at('nina', '2026-11-18'), key('ArrowRight'), NURSES, DATES), at('nina', '2026-11-18'));
  assert.equal(moveSelection(mary17, key('Enter'), NURSES, DATES), undefined);
  assert.equal(moveSelection(mary17, key('a'), NURSES, DATES), undefined);
});

test('selecting a cell tells only the cell left and the cell chosen', () => {
  const grid = createGridSelection();
  grid.setLayout('amy|2026-11-16', new Set(['amy|2026-11-16', 'mary|2026-11-17', 'nina|2026-11-18']));
  const told: string[] = [];
  for (const k of ['amy|2026-11-16', 'mary|2026-11-17', 'nina|2026-11-18']) grid.subscribeCell(k, () => told.push(k));
  let all = 0;
  grid.subscribe(() => all++);

  grid.select(at('mary', '2026-11-17'));
  assert.deepEqual(told.sort(), ['amy|2026-11-16', 'mary|2026-11-17']); // the first cell loses the Tab stop
  assert.equal(grid.flagsOf('mary|2026-11-17'), CELL_SELECTED | CELL_TAB_STOP);
  assert.equal(grid.flagsOf('amy|2026-11-16'), 0);

  told.length = 0;
  grid.select(at('nina', '2026-11-18'));
  assert.deepEqual(told.sort(), ['mary|2026-11-17', 'nina|2026-11-18']);
  assert.equal(all, 2);

  told.length = 0;
  grid.select(at('nina', '2026-11-18'));
  assert.deepEqual(told, [], 'the same cell again changes nothing');
  assert.equal(all, 2);
});

test('without a selection on the days shown, the first cell is the Tab stop', () => {
  const grid = createGridSelection();
  grid.setLayout('amy|2026-11-16', new Set(['amy|2026-11-16']));
  assert.equal(grid.flagsOf('amy|2026-11-16'), CELL_TAB_STOP);
  grid.select(at('mary', '2026-12-01')); // on days not shown now
  assert.equal(grid.flagsOf('amy|2026-11-16'), CELL_TAB_STOP);
  assert.equal(grid.flagsOf('mary|2026-12-01'), CELL_SELECTED);
});

test('a new layout tells the old and the new Tab stop once it is flushed', () => {
  const grid = createGridSelection();
  grid.setLayout('amy|2026-11-16', new Set(['amy|2026-11-16', 'nina|2026-11-16']));
  grid.flushLayout();
  const told: string[] = [];
  for (const k of ['amy|2026-11-16', 'nina|2026-11-16']) grid.subscribeCell(k, () => told.push(k));
  // Grouped by seniority, Nina comes first.
  grid.setLayout('nina|2026-11-16', new Set(['amy|2026-11-16', 'nina|2026-11-16']));
  assert.equal(grid.flagsOf('nina|2026-11-16'), CELL_TAB_STOP, 'cells drawn now already see it');
  assert.deepEqual(told, [], 'nothing is told while the grid is drawing');
  grid.flushLayout();
  assert.deepEqual(told.sort(), ['amy|2026-11-16', 'nina|2026-11-16']);
});

test('the popup belongs to one cell: opening it selects the cell, moving away closes it', () => {
  const grid = createGridSelection();
  grid.setLayout('amy|2026-11-16', new Set(['amy|2026-11-16', 'mary|2026-11-17']));
  grid.openPopup({ ...at('mary', '2026-11-17'), focusOnOpen: true });
  assert.deepEqual(grid.getState().selected, at('mary', '2026-11-17'));
  assert.equal(grid.getState().popup?.focusOnOpen, true);
  assert.equal(grid.flagsOf('mary|2026-11-17'), CELL_SELECTED | CELL_TAB_STOP | CELL_POPUP);

  grid.select(at('mary', '2026-11-17'));
  assert.ok(grid.getState().popup, 'selecting the same cell keeps it open');
  grid.select(at('amy', '2026-11-16'));
  assert.equal(grid.getState().popup, null);
  assert.equal(grid.flagsOf('mary|2026-11-17'), 0);

  grid.openPopup({ ...at('amy', '2026-11-16'), focusOnOpen: false });
  grid.closePopup();
  assert.equal(grid.getState().popup, null);
  assert.deepEqual(grid.getState().selected, at('amy', '2026-11-16'), 'closing it keeps the selection');
});

test('a flashed cell is marked until the flash ends', () => {
  const grid = createGridSelection();
  const told: string[] = [];
  grid.subscribeCell('mary|2026-11-17', () => told.push('mary'));
  grid.flash('mary|2026-11-17');
  assert.equal(grid.flagsOf('mary|2026-11-17') & CELL_FLASH, CELL_FLASH);
  grid.flash(null);
  assert.equal(grid.flagsOf('mary|2026-11-17'), 0);
  assert.deepEqual(told, ['mary', 'mary']);
});

test('a cell that stops listening is not told again', () => {
  const grid = createGridSelection();
  let calls = 0;
  const stop = grid.subscribeCell('amy|2026-11-16', () => calls++);
  grid.select(at('amy', '2026-11-16'));
  stop();
  grid.select(null);
  assert.equal(calls, 1);
});
