import type { NurseRosterDoc, NurseRosterShift } from '../../types';

/** One day on a nurse's own page: their shifts (earliest first) and whether they are on leave. */
export interface MyDay {
  date: string;
  shifts: NurseRosterShift[];
  leave: boolean;
}

/**
 * A nurse's days for their own page (UI overhaul Phase 5): the next day with a shift, from today
 * on; the other days from today (shifts and leave) in order; and the days before today.
 */
export function myShiftDays(doc: Pick<NurseRosterDoc, 'shifts' | 'leaveDays'>, today: string): { next?: MyDay; comingUp: MyDay[]; earlier: MyDay[] } {
  const map = new Map<string, MyDay>();
  const entry = (date: string) => {
    let e = map.get(date);
    if (!e) map.set(date, (e = { date, shifts: [], leave: false }));
    return e;
  };
  for (const s of doc.shifts || []) entry(s.date).shifts.push(s);
  for (const d of doc.leaveDays || []) entry(d).leave = true;
  const days = [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  for (const d of days) d.shifts.sort((a, b) => a.startTime.localeCompare(b.startTime));
  const fromToday = days.filter((d) => d.date >= today);
  const next = fromToday.find((d) => d.shifts.length > 0);
  return { next, comingUp: fromToday.filter((d) => d !== next), earlier: days.filter((d) => d.date < today) };
}
