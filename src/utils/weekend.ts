/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * One weekend definition for the whole app (grid shading, fairness and hours
 * reports, the engine's weekend balancing). It is a clinic setting
 * (ClinicProfile.weekendDays); the UAE weekend, Saturday and Sunday, is the
 * default. Weekday numbers: 0 = Sun, 1 = Mon ... 6 = Sat.
 */

export const DEFAULT_WEEKEND_DAYS: number[] = [6, 0];

const STORAGE_KEY = 'clinic_roster_weekend_days';

let currentWeekendDays: number[] = loadStoredWeekendDays();

function sanitize(days: unknown): number[] | null {
  if (!Array.isArray(days)) return null;
  const clean = Array.from(new Set(days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))) as number[];
  return clean;
}

function loadStoredWeekendDays(): number[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const parsed = sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'));
      if (parsed) return parsed;
    }
  } catch {
    // ignore unreadable storage
  }
  return [...DEFAULT_WEEKEND_DAYS];
}

/** Applies the clinic's weekend setting (called when the clinic profile loads or is saved). */
export function setClinicWeekendDays(days: unknown): void {
  currentWeekendDays = sanitize(days) ?? [...DEFAULT_WEEKEND_DAYS];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWeekendDays));
    }
  } catch {
    // ignore unavailable storage
  }
}

export function getWeekendDays(): number[] {
  return currentWeekendDays;
}

/** True when the weekday (0 = Sun ... 6 = Sat) is a weekend day. */
export function isWeekendDay(weekday: number): boolean {
  return currentWeekendDays.includes(weekday);
}

/** True when the ISO date (YYYY-MM-DD) falls on a weekend day. */
export function isWeekendDate(isoDate: string): boolean {
  return isWeekendDay(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`).getUTCDay());
}
