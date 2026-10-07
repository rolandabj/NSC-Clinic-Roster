/**
 * Default dates for screens and forms, worked out from today's date (YYYY-MM-DD) instead of
 * fixed dates. `today` comes from localTodayIso() in the screens and is passed in for tests.
 */
import type { Schedule } from '../types';

export interface DateRange {
  startDate: string;
  endDate: string;
}

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** The month that contains `date`, from its first to its last day. */
export function monthRange(date: string): DateRange {
  const [y, m] = date.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const month = String(m).padStart(2, '0');
  return { startDate: `${y}-${month}-01`, endDate: `${y}-${month}-${String(last).padStart(2, '0')}` };
}

/** The open roster, else the roster covering today, else the next one; never an archived one. */
function rosterFor(schedules: Schedule[], activeScheduleId: string | undefined, today: string): Schedule | undefined {
  const live = schedules.filter((s) => s.status !== 'ARCHIVED' && s.startDate && s.endDate);
  const open = live.find((s) => s.id === activeScheduleId);
  if (open) return open;
  const covering = live.find((s) => s.startDate <= today && today <= s.endDate);
  if (covering) return covering;
  return live.filter((s) => s.startDate > today).sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
}

/** Dates offered when a doctor's usual week is put on the calendar. */
export function defaultPatternRange(schedules: Schedule[], activeScheduleId: string | undefined, today: string): DateRange {
  const roster = rosterFor(schedules, activeScheduleId, today);
  return roster ? { startDate: roster.startDate, endDate: roster.endDate } : monthRange(today);
}

/** Date offered for a new one day clinic: today, or the open roster's first day if it starts later. */
export function defaultSessionDate(schedules: Schedule[], activeScheduleId: string | undefined, today: string): string {
  const roster = rosterFor(schedules, activeScheduleId, today);
  return roster && roster.startDate > today ? roster.startDate : today;
}

/** Dates a nurse's request form starts with: one day, a week ahead. */
export function requestDefaults(today: string): { leaveStartDate: string; leaveEndDate: string; dayOffDate: string } {
  const weekAhead = addDays(today, 7);
  return { leaveStartDate: weekAhead, leaveEndDate: weekAhead, dayOffDate: weekAhead };
}
