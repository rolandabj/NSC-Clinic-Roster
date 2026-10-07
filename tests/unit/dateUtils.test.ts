import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, formatDateRange, formatDateTime, formatDayDate, parseDayMonthYear } from '../../src/utils/dateUtils';

// One date module for the whole app (UI overhaul Phase 2): dates on screen are DD-MM-YYYY,
// a day is "Mon 16-11-2026", a range uses "to", and date fields take DD-MM-YYYY.

/** Runs fn with the computer's time zone set to tz, so dates are shown to stay put. */
function inTimeZone(tz: string, fn: () => void) {
  const before = process.env.TZ;
  process.env.TZ = tz;
  try {
    fn();
  } finally {
    if (before === undefined) delete process.env.TZ;
    else process.env.TZ = before;
  }
}

test('a date is shown as DD-MM-YYYY', () => {
  assert.equal(formatDate('2026-10-01'), '01-10-2026');
  assert.equal(formatDate('2026-5-9'), '09-05-2026');
  assert.equal(formatDate('16-11-2026'), '16-11-2026');
  assert.equal(formatDate(new Date(2026, 4, 9, 14, 30)), '09-05-2026');
  assert.equal(formatDate(''), '');
  assert.equal(formatDate(null), '');
});

test('a range is joined with "to", and one missing end shows the other date alone', () => {
  assert.equal(formatDateRange('2026-11-16', '2026-11-29'), '16-11-2026 to 29-11-2026');
  assert.equal(formatDateRange('2026-11-16', null), '16-11-2026');
  assert.equal(formatDateRange(undefined, '2026-11-29'), '29-11-2026');
  assert.equal(formatDateRange(null, null), '');
});

test('a moment is shown as DD-MM-YYYY HH:MM in the local time', () => {
  assert.equal(formatDateTime(new Date(2026, 9, 2, 15, 45)), '02-10-2026 15:45');
  assert.equal(formatDateTime(new Date(2026, 9, 2, 9, 5, 7), true), '02-10-2026 09:05:07');
  assert.equal(formatDateTime('2026-10-02'), '02-10-2026');
});

test('a day is shown with its weekday, short or long', () => {
  assert.equal(formatDayDate('2026-11-16'), 'Mon 16-11-2026');
  assert.equal(formatDayDate('2026-11-29'), 'Sun 29-11-2026');
  assert.equal(formatDayDate('2026-10-07', 'long'), 'Wednesday 07-10-2026');
  assert.equal(formatDayDate(new Date(2026, 10, 20, 23, 30)), 'Fri 20-11-2026');
  assert.equal(formatDayDate(''), '');
});

test('the weekday of a calendar date does not move with the time zone', () => {
  for (const tz of ['America/Los_Angeles', 'Asia/Dubai', 'Pacific/Kiritimati']) {
    inTimeZone(tz, () => {
      assert.equal(formatDayDate('2026-11-16'), 'Mon 16-11-2026', tz);
      assert.equal(formatDate('2026-11-16'), '16-11-2026', tz);
    });
  }
});

test('a typed date is read as DD-MM-YYYY, with slashes or dots too', () => {
  assert.equal(parseDayMonthYear('21-12-2026'), '2026-12-21');
  assert.equal(parseDayMonthYear(' 1/2/2027 '), '2027-02-01');
  assert.equal(parseDayMonthYear('29.02.2028'), '2028-02-29');
  assert.equal(parseDayMonthYear('2026-12-21'), '2026-12-21');
});

test('a date that does not exist, or is not a date, is refused', () => {
  for (const text of ['31-02-2027', '29-02-2027', '32-01-2026', '00-01-2026', '12-13-2026', '21-12-26', 'tomorrow', '']) {
    assert.equal(parseDayMonthYear(text), '', text);
  }
});
