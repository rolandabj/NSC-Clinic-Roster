/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Suggested dates for a new roster: it starts the day after the last roster
 * ends, and runs to the end of that month (or as long as the last roster).
 */

import { Schedule } from '../../types';

const iso = (d: Date) => d.toISOString().split('T')[0];
const addDays = (date: string, days: number) => {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return iso(d);
};
const monthEnd = (date: string) => {
  const d = new Date(date + 'T00:00:00Z');
  return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)));
};

export function suggestNewRosterDates(existing: Pick<Schedule, 'startDate' | 'endDate'>[], today = new Date()): { start: string; end: string } {
  const latest = [...existing].filter((s) => s.endDate).sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
  if (!latest) {
    // No roster yet: next month.
    const start = iso(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1)));
    return { start, end: monthEnd(start) };
  }
  const start = addDays(latest.endDate, 1);
  if (start.endsWith('-01')) return { start, end: monthEnd(start) };
  const lastLength =
    Math.round((Date.parse(latest.endDate + 'T00:00:00Z') - Date.parse(latest.startDate + 'T00:00:00Z')) / 86400000) + 1;
  return { start, end: addDays(start, Math.max(7, lastLength) - 1) };
}
