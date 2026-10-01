import { test } from 'node:test';
import assert from 'node:assert/strict';
import { csvCell, toCsv } from '../../src/utils/csv';

test('csv cells are quoted and inner quotes doubled', () => {
  assert.equal(csvCell('Smith, "Jo"'), '"Smith, ""Jo"""');
  assert.equal(csvCell(null), '""');
  assert.equal(csvCell(8.5), '8.5');
});

test('text that looks like a formula cannot run in a spreadsheet', () => {
  assert.equal(csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.equal(csvCell('+1'), '"\'+1"');
  assert.equal(csvCell('@SUM(A1)'), '"\'@SUM(A1)"');
  assert.equal(csvCell(-3), '-3'); // a real number stays a number
});

test('rows join with commas and lines', () => {
  assert.equal(toCsv([['a', 1], ['b', 2]]), '"a",1\r\n"b",2');
});
