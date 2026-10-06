/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Rule H9: the most hours a nurse works in any 7 days in a row (60 h unless the
 * clinic sets another number in Settings, Rules). It keeps catching up, and any
 * other extra hours, from piling into one week. The engine, the checker and the
 * hand checks share these helpers, so they agree on what counts:
 *   - shift hours only (leave is not work), one shift a day;
 *   - a day of approved leave counts no shift hours, as in the hours tally;
 *   - the days before a roster come from the rosters before it, so a week that
 *     crosses two rosters is checked as one week.
 */

import type { Rule } from '../../types';

/** How the rule is found (see resolveRule): its template, its id, words in an older rule's name. */
export const WEEK_HOURS_RULE = {
  key: 'MAX_HOURS_IN_7_DAYS',
  id: 'rule-h9-week-hours',
  keywords: ['hours in 7 days', 'hours in any 7 days', 'weekly hours', 'hours in a week'],
};

/** The usual limit, used when the rule is not set up yet or has no number. */
export const WEEK_HOURS_DEFAULT = 60;
const WEEK = 7;

export interface WeekHoursSetting {
  enabled: boolean;
  /** "Must": the engine and the hand checks refuse a shift that breaks it. */
  hard: boolean;
  limit: number;
}

/** The rule's setting; a clinic without the rule gets the usual one (on, must, 60 h), as for the other rules. */
export function weekHoursSetting(rule?: Rule): WeekHoursSetting {
  const value = Number(rule?.value);
  return {
    enabled: rule ? rule.enabled !== false : true,
    hard: (rule?.severity || 'HARD') === 'HARD',
    limit: Number.isFinite(value) && value > 0 ? value : WEEK_HOURS_DEFAULT,
  };
}

export interface WeekHours {
  start: string;
  end: string;
  hours: number;
}

function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
}

/** Over the limit, ignoring rounding noise in sums of shift lengths. */
const over = (hours: number, limit: number) => hours > limit + 1e-6;

/** Of the 7 day stretches that include `date`, the one with the most hours. */
export function heaviestWeekAround(date: string, hoursOn: (date: string) => number): WeekHours {
  const days = Array.from({ length: 2 * WEEK - 1 }, (_, i) => addDays(date, i - (WEEK - 1)));
  const hours = days.map(hoursOn);
  let best: WeekHours = { start: days[0], end: days[WEEK - 1], hours: -Infinity };
  for (let s = 0; s < WEEK; s++) {
    let sum = 0;
    for (let i = s; i < s + WEEK; i++) sum += hours[i];
    if (sum > best.hours) best = { start: days[s], end: days[s + WEEK - 1], hours: sum };
  }
  return best;
}

/** True when giving her `hoursThatDay` on `date` keeps every 7 days in a row within the limit. */
export function fitsWeekHours(date: string, hoursThatDay: number, hoursOn: (date: string) => number, limit: number): boolean {
  return !over(heaviestWeekAround(date, (d) => (d === date ? hoursThatDay : hoursOn(d))).hours, limit);
}

/**
 * The 7 day stretches over the limit that end on firstDay to lastDay and have
 * hours on firstDay or later (the days before belong to the roster before). One
 * per run of overlapping stretches, its heaviest, so one busy fortnight is one
 * finding, not seven. Its start and end are its first and last day with hours.
 */
export function weeksOverLimit(firstDay: string, lastDay: string, hoursOn: (date: string) => number, limit: number): WeekHours[] {
  const found: WeekHours[] = [];
  let run: WeekHours | null = null;
  for (let end = firstDay; end <= lastDay; end = addDays(end, 1)) {
    let sum = 0;
    let own = 0;
    let first = '';
    let last = '';
    for (let d = addDays(end, -(WEEK - 1)); d <= end; d = addDays(d, 1)) {
      const h = hoursOn(d);
      if (h <= 0) continue;
      sum += h;
      if (d >= firstDay) own += h;
      first = first || d;
      last = d;
    }
    if (over(sum, limit) && own > 0) {
      if (!run || sum > run.hours) run = { start: first, end: last, hours: sum };
    } else if (run) {
      found.push(run);
      run = null;
    }
  }
  if (run) found.push(run);
  return found;
}
