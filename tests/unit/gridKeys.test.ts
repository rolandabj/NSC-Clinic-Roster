import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOURS_COLUMN, TOTALS_ROW, isRosterCell, moveSelection } from '../../src/components/workbook/grid/gridSelection';
import { dayTotalWords } from '../../src/components/workbook/grid/dayTotals';
import { hoursWords } from '../../src/components/workbook/grid/GridRow';

// The roster grid's hours column and day totals reached by the keyboard (UI overhaul Phase 4,
// slice 4, part 2): the arrow keys go on past the last day to the nurse's hours, and past the
// last nurse to the day's totals, which read out the nurse's or the day's problems. The problem
// marks in the headings are no longer extra Tab stops.

const NURSES = ['amy', 'mary', TOTALS_ROW];
const DATES = ['2026-11-16', '2026-11-17', HOURS_COLUMN];
const at = (nurseId: string, date: string) => ({ nurseId, date });
const key = (k: string) => ({ key: k, shiftKey: false });

test('the arrow keys reach the hours column and the day totals', () => {
  assert.deepEqual(moveSelection(at('mary', '2026-11-17'), key('ArrowRight'), NURSES, DATES), at('mary', HOURS_COLUMN));
  assert.deepEqual(moveSelection(at('mary', '2026-11-17'), key('ArrowDown'), NURSES, DATES), at(TOTALS_ROW, '2026-11-17'));
  assert.deepEqual(moveSelection(at(TOTALS_ROW, '2026-11-16'), key('ArrowUp'), NURSES, DATES), at('mary', '2026-11-16'));
  assert.deepEqual(moveSelection(at('amy', HOURS_COLUMN), key('ArrowLeft'), NURSES, DATES), at('amy', '2026-11-17'));
});

test('the corner under the hours has nothing, so the keys stop before it', () => {
  assert.deepEqual(moveSelection(at(TOTALS_ROW, '2026-11-17'), key('ArrowRight'), NURSES, DATES), at(TOTALS_ROW, '2026-11-17'));
  assert.deepEqual(moveSelection(at('mary', HOURS_COLUMN), key('ArrowDown'), NURSES, DATES), at('mary', HOURS_COLUMN));
});

test('only a nurse\'s day is a roster cell that can be changed', () => {
  assert.equal(isRosterCell(at('mary', '2026-11-17')), true);
  assert.equal(isRosterCell(at('mary', HOURS_COLUMN)), false);
  assert.equal(isRosterCell(at(TOTALS_ROW, '2026-11-17')), false);
});

test("a day's totals are read out in words, with the day's problems", () => {
  const total = { doctors: 1, nurses: 2, gapHours: 4, hasSenior: false };
  assert.equal(
    dayTotalWords('2026-11-16', total),
    'Day totals, Mon 16-11-2026: 1 doctor in session, 2 nurses on duty, 4 hours without a free nurse, no senior nurse on duty'
  );
  assert.equal(
    dayTotalWords('2026-11-16', { doctors: 0, nurses: 1, gapHours: 0 }, { messages: ['No senior nurse', 'Dr Lee has no nurse'], mustFix: true }),
    'Day totals, Mon 16-11-2026: 0 doctors in session, 1 nurse on duty, a free nurse every opening hour. 2 problems, must fix: No senior nurse. Dr Lee has no nurse'
  );
});

test("a nurse's hours are read out in words, with the nurse's problems", () => {
  assert.equal(
    hoursWords({ name: 'Mary', blockTotal: 16, blockDuty: 16, blockLeave: 0, totalHours: 16, targetHours: 80, percent: 20 }),
    'Hours, Mary: 16 hours on these days (16 in shifts, 0 in leave). Whole roster: 16 of 80 hours, 64 hours short'
  );
  assert.equal(
    hoursWords({ name: 'Amy', blockTotal: 8, blockDuty: 0, blockLeave: 8, totalHours: 96, targetHours: 0, percent: 0, problems: ['Over the hours limit'], mustFix: false }),
    'Hours, Amy: 8 hours on these days (0 in shifts, 8 in leave). Whole roster: 96 hours. 1 problem, to check: Over the hours limit'
  );
});
