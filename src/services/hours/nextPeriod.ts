/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * What the New time period form starts with (Phase 8, slice 1d): the day after the latest period
 * ends, for one cycle (to the day before the same date next month), named like the clinic's
 * periods ("Nov19-Dec18") with its year ("2026", or "2026-2027" across the year end). With no
 * periods yet, the next 19th. It always started at 19-01-2026 before.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toIso = (d: Date) => d.toISOString().slice(0, 10);
const parse = (iso: string) => new Date(`${iso}T00:00:00Z`);
const addDays = (iso: string, n: number) => {
  const d = parse(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toIso(d);
};

/** The same day next month, or the month's last day when it has no such day (31 January to 28 February). */
function sameDayNextMonth(iso: string): string {
  const d = parse(iso);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return toIso(new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), last))));
}

export interface PeriodDefaults {
  startDate: string;
  endDate: string;
  name: string;
  year: string;
}

export function nextPeriodDefaults(periods: { startDate: string; endDate: string }[], today: string): PeriodDefaults {
  const latestEnd = periods.map((p) => p.endDate).sort().pop();
  let startDate: string;
  if (latestEnd) startDate = addDays(latestEnd, 1);
  else {
    const t = parse(today);
    const nineteenth = toIso(new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), 19)));
    startDate = nineteenth >= today ? nineteenth : sameDayNextMonth(nineteenth);
  }
  const endDate = addDays(sameDayNextMonth(startDate), -1);
  const label = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]}${Number(iso.slice(8, 10))}`;
  const startYear = startDate.slice(0, 4);
  const endYear = endDate.slice(0, 4);
  return { startDate, endDate, name: `${label(startDate)}-${label(endDate)}`, year: startYear === endYear ? startYear : `${startYear}-${endYear}` };
}
