/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Date Utility Module
 * Enforces standardized DD-MM-YYYY date format across the application UI.
 */

/**
 * Formats any date input (YYYY-MM-DD string, ISO timestamp, Date object, or timestamp number)
 * into DD-MM-YYYY format.
 *
 * Examples:
 *   formatDate('2026-10-01') => '01-10-2026'
 *   formatDate('2026-05-09T14:30:00Z') => '09-05-2026'
 *   formatDate(new Date('2026-10-15T00:00:00Z')) => '15-10-2026'
 */
export function formatDate(input: string | Date | number | null | undefined): string {
  if (!input) return '';

  if (typeof input === 'string') {
    const trimmed = input.trim();
    // If already in DD-MM-YYYY format, return directly
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      return trimmed;
    }

    // Fast-path for pure YYYY-MM-DD date string
    const match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, '0');
      const day = match[3].padStart(2, '0');
      return `${day}-${month}-${year}`;
    }
  }

  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return String(input);

  // Use local date for timestamps
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear());
  return `${day}-${month}-${year}`;
}

/**
 * Formats a date range into DD-MM-YYYY to DD-MM-YYYY
 */
export function formatDateRange(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined,
  separator: string = ' to '
): string {
  if (!start && !end) return '';
  if (!start) return formatDate(end);
  if (!end) return formatDate(start);
  return `${formatDate(start)}${separator}${formatDate(end)}`;
}

/**
 * Formats a date with time into DD-MM-YYYY HH:mm (or HH:mm:ss if includeSeconds is true)
 */
export function formatDateTime(
  input: string | Date | number | null | undefined,
  includeSeconds: boolean = false
): string {
  if (!input) return '';

  if (typeof input === 'string') {
    // If it's a date-only string like YYYY-MM-DD, just format the date
    if (/^\d{4}-\d{2}-\d{2}$/.test(input.trim())) {
      return formatDate(input);
    }
  }

  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return formatDate(input);

  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  if (includeSeconds) {
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}:${seconds}`;
  }
  return `${dateStr} ${hours}:${minutes}`;
}

const WEEKDAYS = {
  short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

/**
 * A day with its weekday: 'Mon 16-11-2026', or 'Monday 16-11-2026' with style 'long'.
 * A calendar date (YYYY-MM-DD or DD-MM-YYYY) keeps its weekday whatever the computer's
 * time zone; a moment (Date, timestamp) uses the local day.
 */
export function formatDayDate(
  input: string | Date | number | null | undefined,
  style: 'short' | 'long' = 'short'
): string {
  if (!input) return '';
  const calendarDate = typeof input === 'string' ? parseDayMonthYear(input) : '';
  let weekday: number;
  if (calendarDate) {
    const [y, m, d] = calendarDate.split('-').map(Number);
    weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  } else {
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return formatDate(input);
    weekday = date.getDay();
  }
  return `${WEEKDAYS[style][weekday]} ${formatDate(calendarDate || input)}`;
}

/**
 * Reads a date typed as DD-MM-YYYY (slashes or dots work too, and so does YYYY-MM-DD) and
 * gives YYYY-MM-DD, or '' when the text is not a date that exists (31-02-2027).
 */
export function parseDayMonthYear(text: string): string {
  const trimmed = (text || '').trim();
  const dayFirst = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  const yearFirst = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!dayFirst && !yearFirst) return '';
  const [d, m, y] = dayFirst
    ? [Number(dayFirst[1]), Number(dayFirst[2]), Number(dayFirst[3])]
    : [Number(yearFirst![3]), Number(yearFirst![2]), Number(yearFirst![1])];
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return '';
  return date.toISOString().slice(0, 10);
}

/** Today's date (YYYY-MM-DD) in the device's local time, not UTC. */
export function localTodayIso(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
