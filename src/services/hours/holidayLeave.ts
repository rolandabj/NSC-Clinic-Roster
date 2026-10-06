/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Public holidays and leave, by the owner's decision of 2026-10-06 (option 1):
 * the hours of each working hours period already leave the public holidays out,
 * so nobody is given hours for a holiday.
 *   - A leave day on a public holiday counts 0 h. It is saved on the leave as
 *     that day's own hours (dayHours), so every screen, report, email and the
 *     hours history count it the same way, and earlier rosters only change when
 *     someone tidies their leave on purpose.
 *   - The old "public holiday leave" (8 h for every nurse on every holiday) is
 *     no longer given: it counted the holiday twice and kept the nurse who works
 *     the holiday from being rostered.
 *   - The nurse who works the holiday takes a day off of her choosing instead (an
 *     approved day off request linked to the holiday, see recordHolidayDayOff).
 */

import type { LeaveEntry, LeaveType, PublicHoliday } from '../../types';
import type { IRepository } from '../repository/IRepository';
import { leaveCreditOnDate } from './hoursPolicy';

type DatedLeave = Pick<LeaveEntry, 'startDate' | 'endDate'> & { dayHours?: Record<string, number> };

const datesOf = (holidays: Iterable<string | Pick<PublicHoliday, 'date'>>): string[] =>
  Array.from(holidays, (h) => (typeof h === 'string' ? h : h.date));

/** The leave with every public holiday inside it counted 0 h (hours set by hand for a day stay). */
export function withHolidaysAtZero<T extends DatedLeave>(entry: T, holidays: Iterable<string | Pick<PublicHoliday, 'date'>>): T {
  const zero = datesOf(holidays).filter((d) => d >= entry.startDate && d <= entry.endDate && entry.dayHours?.[d] === undefined);
  if (zero.length === 0) return entry;
  return { ...entry, dayHours: { ...(entry.dayHours || {}), ...Object.fromEntries(zero.map((d) => [d, 0])) } };
}

/** The leave without the 0 h a public holiday gave it on `date` (the holiday was removed or moved). */
export function withoutHolidayZero<T extends DatedLeave>(entry: T, date: string): T {
  if (entry.dayHours?.[date] !== 0) return entry;
  const rest = { ...entry.dayHours };
  delete rest[date];
  const { dayHours: _old, ...base } = entry;
  return (Object.keys(rest).length > 0 ? { ...base, dayHours: rest } : base) as T;
}

/**
 * The leave to save after public holidays changed in Settings: leave on a new
 * holiday date counts 0 h, leave on a date that is no longer a holiday counts
 * its usual hours again.
 */
export function leaveAfterHolidayChange(leaveEntries: LeaveEntry[], before: Iterable<string>, after: Iterable<string>): LeaveEntry[] {
  const was = new Set(before);
  const now = new Set(after);
  const removed = [...was].filter((d) => !now.has(d));
  const added = [...now].filter((d) => !was.has(d));
  if (removed.length === 0 && added.length === 0) return [];
  return leaveEntries.flatMap((le) => {
    let next = le;
    for (const d of removed) next = withoutHolidayZero(next, d);
    next = withHolidaysAtZero(next, added);
    return next === le ? [] : [next];
  });
}

/**
 * Leave the old "Apply Public Holidays as PH" button gave every nurse: one day
 * on a public holiday, of the PH type or noted "Public Holiday: ..." (the
 * button used the first leave type when the clinic had no PH type).
 */
export function isOldHolidayLeave(entry: LeaveEntry, holidayDates: ReadonlySet<string>, leaveTypes: LeaveType[]): boolean {
  if (entry.startDate !== entry.endDate || !holidayDates.has(entry.startDate)) return false;
  const type = leaveTypes.find((t) => t.id === entry.leaveTypeId);
  return (type?.acronym || '').trim().toUpperCase() === 'PH' || /^public holiday:/i.test(entry.note || '');
}

/** Approved leave of these nurses that still counts hours on a public holiday (it should count 0 h). */
export function leaveCountingOnHoliday(leaveEntries: LeaveEntry[], leaveTypes: LeaveType[], date: string): LeaveEntry[] {
  const types = new Map(leaveTypes.map((t) => [t.id, t]));
  return leaveEntries.filter(
    (le) => le.approved && le.startDate <= date && le.endDate >= date && leaveCreditOnDate(le, types.get(le.leaveTypeId), date) > 0
  );
}

export interface HolidayLeaveTidy {
  /** Old public holiday leave to delete. */
  remove: LeaveEntry[];
  /** Other leave, changed to count 0 h on the public holidays inside it. */
  zero: LeaveEntry[];
}

/**
 * What "Tidy public holiday leave" does for these holidays: deletes the old
 * public holiday leave and makes every other leave count 0 h on them (also a
 * day whose hours were set by hand: the tidy is asked for on purpose).
 */
export function planHolidayLeaveTidy(
  leaveEntries: LeaveEntry[],
  leaveTypes: LeaveType[],
  holidays: Iterable<string | Pick<PublicHoliday, 'date'>>
): HolidayLeaveTidy {
  const dates = new Set(datesOf(holidays));
  const types = new Map(leaveTypes.map((t) => [t.id, t]));
  const remove = leaveEntries.filter((le) => isOldHolidayLeave(le, dates, leaveTypes));
  const removed = new Set(remove.map((le) => le.id));
  const zero = leaveEntries.flatMap((le) => {
    if (removed.has(le.id)) return [];
    const counted = [...dates].filter(
      (d) => d >= le.startDate && d <= le.endDate && leaveCreditOnDate(le, types.get(le.leaveTypeId), d) > 0
    );
    if (counted.length === 0) return [];
    return [{ ...le, dayHours: { ...(le.dayHours || {}), ...Object.fromEntries(counted.map((d) => [d, 0])) } }];
  });
  return { remove, zero };
}

/**
 * Saves leave as whole records (a day's 0 h taken off again must disappear, which
 * a merge would keep) and deletes the given ones, in one write when the repository can.
 */
export async function saveHolidayLeave(repo: IRepository, upserts: LeaveEntry[], removeIds: string[] = []): Promise<void> {
  if (upserts.length + removeIds.length === 0) return;
  if (repo.bulkWrite) {
    await repo.bulkWrite('leaveEntries', { upserts, removeIds, replace: true });
    return;
  }
  if (upserts.length > 0) await repo.bulkUpsert('leaveEntries', upserts, { replace: true });
  if (removeIds.length > 0) await repo.bulkRemove('leaveEntries', removeIds);
}

/** After public holidays changed in Settings: leave on the dates that changed is saved again (see leaveAfterHolidayChange). Returns how many changed. */
export async function applyHolidayChangeToLeave(repo: IRepository, before: Iterable<string>, after: Iterable<string>): Promise<number> {
  const changed = leaveAfterHolidayChange(await repo.list('leaveEntries'), before, after);
  await saveHolidayLeave(repo, changed);
  return changed.length;
}
