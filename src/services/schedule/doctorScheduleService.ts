/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Doctor Schedule & Session Management Service
 * Provides helper functions to create, update, or remove single-day doctor shifts
 * as well as recurring weekly patterns across a schedule.
 */

import { IRepository } from '../repository/IRepository';
import { Doctor, DoctorSession, Schedule, WeeklyPatternSlot } from '../../types';

export const WEEKDAY_FULL_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export interface SaveDoctorShiftParams {
  repo: IRepository;
  doctor: Doctor;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  room?: string;
  specialtyId: string;
  updateScope: 'THIS_DATE_ONLY' | 'RECURRING_ALL_MATCHING_DAYS';
  schedule?: Schedule | null;
  existingSession?: DoctorSession | null;
}

export interface SaveDoctorShiftResult {
  updatedDoctor: Doctor;
  allSessions: DoctorSession[];
  message: string;
}

export interface DeleteDoctorShiftParams {
  repo: IRepository;
  doctor: Doctor;
  date: string;
  sessionId?: string;
  deleteScope: 'THIS_DATE_ONLY' | 'REMOVE_RECURRING_PATTERN';
  schedule?: Schedule | null;
}

export interface DeleteDoctorShiftResult {
  updatedDoctor: Doctor;
  allSessions: DoctorSession[];
  message: string;
}

/**
 * Parses a YYYY-MM-DD string into UTC date components safely
 */
export function getWeekdayFromIsoDate(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  return dateObj.getUTCDay();
}

/**
 * Saves a doctor shift, either for a single date or as a recurring weekly pattern.
 */
export async function saveDoctorShift(
  params: SaveDoctorShiftParams
): Promise<SaveDoctorShiftResult> {
  const {
    repo,
    doctor,
    date,
    startTime,
    endTime,
    room = 'Suite 101',
    specialtyId,
    updateScope,
    schedule,
    existingSession,
  } = params;

  const weekdayIndex = getWeekdayFromIsoDate(date);
  const weekdayName = WEEKDAY_FULL_NAMES[weekdayIndex];

  let currentDoctor = doctor;

  if (updateScope === 'THIS_DATE_ONLY') {
    // 1. Update or create single session for this specific date. A session cancelled
    // for this date earlier is brought back, so there is never more than one record.
    const target =
      existingSession ||
      (
        await repo.list('doctorSessions', { field: 'doctorId', operator: '==', value: doctor.id })
      ).find((x) => x.date === date && x.cancelled);
    if (target) {
      await repo.update('doctorSessions', target.id, {
        startTime,
        endTime,
        room,
        specialtyId,
        source: 'MANUAL',
        cancelled: false,
      });
    } else {
      const newId = `sess-${doctor.id}-${date}-${startTime.replace(':', '')}-${Math.random().toString(36).slice(2, 6)}`;
      await repo.create('doctorSessions', {
        id: newId,
        doctorId: doctor.id,
        date,
        startTime,
        endTime,
        specialtyId,
        room,
        source: 'MANUAL',
        cancelled: false,
      });
    }
  } else {
    // 2. RECURRING_ALL_MATCHING_DAYS: Update weekly pattern + sync all matching days in schedule
    const existingPatterns = doctor.weeklyPattern || [];
    const otherPatterns = existingPatterns.filter((p) => p.weekday !== weekdayIndex);
    const newSlot: WeeklyPatternSlot = {
      weekday: weekdayIndex,
      startTime,
      endTime,
      room,
    };
    const nextWeeklyPattern = [...otherPatterns, newSlot].sort((a, b) => a.weekday - b.weekday);

    currentDoctor = await repo.update('doctors', doctor.id, {
      weeklyPattern: nextWeeklyPattern,
    });

    // Determine date range to apply
    let rangeStart = schedule?.startDate;
    let rangeEnd = schedule?.endDate;

    if (!rangeStart || !rangeEnd) {
      // Default to the month of the edited date
      const [y, m] = date.split('-');
      rangeStart = `${y}-${m}-01`;
      const lastDay = new Date(Date.UTC(Number(y), Number(m), 0)).getUTCDate();
      rangeEnd = `${y}-${m}-${lastDay.toString().padStart(2, '0')}`;
    }

    const startObj = new Date(rangeStart + 'T00:00:00Z');
    const endObj = new Date(rangeEnd + 'T00:00:00Z');

    // Fetch existing sessions for this doctor
    const existingSessions = await repo.list('doctorSessions', {
      field: 'doctorId',
      operator: '==',
      value: doctor.id,
    });

    const sessionsByDate = new Map<string, DoctorSession>();
    existingSessions.forEach((s) => sessionsByDate.set(s.date, s));

    for (
      let cur = new Date(startObj);
      cur <= endObj;
      cur.setUTCDate(cur.getUTCDate() + 1)
    ) {
      if (cur.getUTCDay() === weekdayIndex) {
        const curIsoDate = cur.toISOString().split('T')[0];
        const existing = sessionsByDate.get(curIsoDate);

        // A change or removal made for another single date is kept; the date being
        // edited always takes the new times.
        if (existing && curIsoDate !== date && (existing.source === 'MANUAL' || existing.cancelled)) continue;

        if (existing) {
          await repo.update('doctorSessions', existing.id, {
            startTime,
            endTime,
            room,
            specialtyId,
            source: 'PATTERN',
            cancelled: false,
          });
        } else {
          const sessId = `sess-${doctor.id}-${curIsoDate}-${startTime.replace(':', '')}`;
          await repo.create('doctorSessions', {
            id: sessId,
            doctorId: doctor.id,
            date: curIsoDate,
            startTime,
            endTime,
            specialtyId,
            room,
            source: 'PATTERN',
            cancelled: false,
          });
        }
      }
    }
  }

  // Load fresh sessions list
  const allSessions = await repo.list('doctorSessions');

  const message =
    updateScope === 'THIS_DATE_ONLY'
      ? `Updated shift for ${doctor.fullName} on ${date} (${startTime}–${endTime} in ${room}).`
      : `Updated recurring ${weekdayName} shift (${startTime}–${endTime} in ${room}) for ${doctor.fullName} across schedule.`;

  return {
    updatedDoctor: currentDoctor,
    allSessions,
    message,
  };
}

/**
 * Removes or cancels a doctor shift, either for a single date or removes the recurring pattern.
 */
export async function deleteDoctorShift(
  params: DeleteDoctorShiftParams
): Promise<DeleteDoctorShiftResult> {
  const { repo, doctor, date, sessionId, deleteScope, schedule } = params;
  const weekdayIndex = getWeekdayFromIsoDate(date);
  const weekdayName = WEEKDAY_FULL_NAMES[weekdayIndex];

  let currentDoctor = doctor;

  if (deleteScope === 'THIS_DATE_ONLY') {
    // Kept as a cancelled session, so filling from the weekly pattern doesn't add it back.
    if (sessionId) {
      await repo.update('doctorSessions', sessionId, { cancelled: true, source: 'MANUAL' });
    }
  } else {
    // 1. Remove from weekly pattern
    const nextWeeklyPattern = (doctor.weeklyPattern || []).filter(
      (p) => p.weekday !== weekdayIndex
    );
    currentDoctor = await repo.update('doctors', doctor.id, {
      weeklyPattern: nextWeeklyPattern,
    });

    // 2. Remove all matching sessions within the schedule
    let rangeStart = schedule?.startDate;
    let rangeEnd = schedule?.endDate;
    if (!rangeStart || !rangeEnd) {
      const [y, m] = date.split('-');
      rangeStart = `${y}-${m}-01`;
      const lastDay = new Date(Date.UTC(Number(y), Number(m), 0)).getUTCDate();
      rangeEnd = `${y}-${m}-${lastDay.toString().padStart(2, '0')}`;
    }

    const docSessions = await repo.list('doctorSessions', {
      field: 'doctorId',
      operator: '==',
      value: doctor.id,
    });

    for (const s of docSessions) {
      if (s.date >= rangeStart && s.date <= rangeEnd) {
        // Sessions changed for one date only are left as they are.
        if (getWeekdayFromIsoDate(s.date) === weekdayIndex && s.source !== 'MANUAL') {
          await repo.remove('doctorSessions', s.id);
        }
      }
    }
  }

  const allSessions = await repo.list('doctorSessions');

  const message =
    deleteScope === 'THIS_DATE_ONLY'
      ? `Removed shift for ${doctor.fullName} on ${date}.`
      : `Removed recurring ${weekdayName} pattern and sessions for ${doctor.fullName}.`;

  return {
    updatedDoctor: currentDoctor,
    allSessions,
    message,
  };
}

/**
 * The week a doctor works on a date: from patternFrom on, the current week (none
 * while switched off); before it, the week that applied then. A change made "from a
 * date" (Doctors screen) so never reaches back: filling a roster again later still
 * gives the days before that date the old week.
 */
export function weekOn(
  doctor: Pick<Doctor, 'weeklyPattern' | 'active' | 'patternFrom' | 'previousWeeklyPattern'>,
  date: string
): WeeklyPatternSlot[] {
  if (doctor.patternFrom && date < doctor.patternFrom) return doctor.previousWeeklyPattern || [];
  return doctor.active === false ? [] : doctor.weeklyPattern || [];
}

/**
 * Generates doctor sessions from the doctors' weekly patterns for a date range (inclusive),
 * each date from the week that applies on it (see weekOn).
 */
export function generateDoctorSessionsForDateRange(
  startDate: string,
  endDate: string,
  doctors: Doctor[]
): DoctorSession[] {
  if (!startDate || !endDate || startDate > endDate) return [];

  const startObj = new Date(startDate + 'T00:00:00Z');
  const endObj = new Date(endDate + 'T00:00:00Z');
  const generatedSessions: DoctorSession[] = [];

  for (
    let cur = new Date(startObj);
    cur <= endObj;
    cur.setUTCDate(cur.getUTCDate() + 1)
  ) {
    const curIsoDate = cur.toISOString().split('T')[0];
    const weekday = cur.getUTCDay();

    doctors.forEach((doc) => {
      weekOn(doc, curIsoDate).forEach((pat) => {
        if (pat.weekday === weekday) {
          const sessId = `sess-${doc.id}-${curIsoDate}-${pat.startTime.replace(':', '')}`;
          generatedSessions.push({
            id: sessId,
            doctorId: doc.id,
            date: curIsoDate,
            startTime: pat.startTime,
            endTime: pat.endTime,
            specialtyId: (doc.specialtyIds && doc.specialtyIds[0]) ? doc.specialtyIds[0] : 'spec-gp',
            room: pat.room || 'Suite 101',
            source: 'PATTERN',
            cancelled: false,
          });
        }
      });
    });
  }

  return generatedSessions;
}

export interface PopulateRecurringDoctorSessionsParams {
  repo: IRepository;
  startDate: string;
  endDate: string;
  doctors?: Doctor[];
  /** Re-apply the pattern to sessions it created before (never to one-date changes). */
  overwriteExisting?: boolean;
  /** Work out what would be added without saving anything. */
  dryRun?: boolean;
}

export interface PopulateRecurringDoctorSessionsResult {
  createdCount: number;
  existingCount: number;
  totalSessions: number;
  newSessions: DoctorSession[];
}

/**
 * The week's sessions a fill adds: on a day the doctor has no session, every slot
 * the week has that day; on a day that already follows the week (each session there
 * is one of the week's slots), the slots still missing. A day changed or cancelled by
 * hand for that date, or one that follows another week (a session the week does not
 * have, say 9 to 5 kept from before a change to 1 to 9), gets nothing, so a doctor
 * never gets a second clinic from an old and a new week on one day.
 */
export function missingPatternSessions(candidates: DoctorSession[], existing: DoctorSession[]): DoctorSession[] {
  const dayKey = (x: Pick<DoctorSession, 'doctorId' | 'date'>) => `${x.doctorId}_${x.date}`;
  const byDay = new Map<string, DoctorSession[]>();
  for (const x of existing) byDay.set(dayKey(x), [...(byDay.get(dayKey(x)) || []), x]);
  const weekStarts = new Map<string, Set<string>>();
  for (const c of candidates) weekStarts.set(dayKey(c), (weekStarts.get(dayKey(c)) || new Set<string>()).add(c.startTime));
  return candidates.filter((c) => {
    const day = byDay.get(dayKey(c)) || [];
    if (day.some((x) => x.source === 'MANUAL' || x.cancelled)) return false;
    if (day.some((x) => !weekStarts.get(dayKey(c))!.has(x.startTime))) return false;
    return !day.some((x) => x.startTime === c.startTime);
  });
}

/**
 * Adds the weekly pattern sessions that are missing in a date range (see
 * missingPatternSessions): one-date changes are never undone, and a day kept from
 * an older week gets no second clinic.
 * Public holidays are skipped: only the on call doctor works then.
 * overwriteExisting (Expand pattern) puts the week on every day of the range
 * that was not changed by hand, see planPatternSessions.
 */
export async function populateRecurringDoctorSessionsForSchedule(
  params: PopulateRecurringDoctorSessionsParams
): Promise<PopulateRecurringDoctorSessionsResult> {
  const { repo, startDate, endDate, overwriteExisting = false, dryRun = false } = params;
  const doctors = params.doctors || (await repo.list('doctors'));
  if (overwriteExisting) {
    const [all, holidayList] = await Promise.all([repo.list('doctorSessions'), repo.list('holidays')]);
    const plans = doctors.map((doctor) => planPatternSessions({
      doctor, sessions: all, from: startDate, to: endDate,
      setUpRanges: [{ startDate, endDate }], holidayDates: holidayList.map((h) => h.date),
    }));
    const upserts = plans.flatMap((p) => p.upsert);
    const removeIds = plans.flatMap((p) => p.remove.map((x) => x.id));
    if (!dryRun) await saveDoctorSessions(repo, upserts, removeIds);
    return { createdCount: upserts.length, existingCount: 0, totalSessions: upserts.length, newSessions: upserts };
  }

  const candidateSessions = generateDoctorSessionsForDateRange(startDate, endDate, doctors);
  if (candidateSessions.length === 0) {
    return { createdCount: 0, existingCount: 0, totalSessions: 0, newSessions: [] };
  }

  const [allExistingSessions, holidays] = await Promise.all([repo.list('doctorSessions'), repo.list('holidays')]);
  const holidayDates = new Set(holidays.map((h) => h.date));
  const workingDays = candidateSessions.filter((cand) => !holidayDates.has(cand.date));
  const sessionsToUpsert = missingPatternSessions(workingDays, allExistingSessions);
  const existingCount = workingDays.length - sessionsToUpsert.length;

  if (!dryRun && sessionsToUpsert.length > 0) {
    await repo.bulkUpsert('doctorSessions', sessionsToUpsert);
  }

  return {
    createdCount: sessionsToUpsert.length,
    existingCount,
    totalSessions: candidateSessions.length,
    newSessions: sessionsToUpsert,
  };
}

const nextDay = (isoDate: string, days = 1): string => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
};

export interface PatternSessionPlan {
  /** Pattern sessions to delete: the week no longer has them that day. */
  remove: DoctorSession[];
  /** Sessions to add, or to save with new times (whole records). */
  upsert: DoctorSession[];
  /** Days that change, in date order. */
  changedDays: string[];
  /** Days left as they are because they were changed or cancelled by hand for that date. */
  handChangedDays: string[];
}

/**
 * The doctor's days from `from` (to `to`, if given) put on the week that applies on
 * each date (see weekOn). Days already set up are every day of `setUpRanges` (the
 * rosters) and every day the doctor already has a session on; later days get theirs
 * when their roster is set up.
 *   - A day changed or cancelled by hand for that date stays as it is.
 *   - On any other day the pattern sessions are replaced by the week's: a session the
 *     week still has at that start time is kept (new end time or room saved), the
 *     others are removed, and missing ones are added.
 *   - A public holiday gets no clinic (only the on call doctor works), and a doctor
 *     switched off gets none.
 */
export function planPatternSessions(input: {
  doctor: Doctor;
  sessions: DoctorSession[];
  from: string;
  to?: string;
  setUpRanges: { startDate: string; endDate: string }[];
  holidayDates: Iterable<string>;
}): PatternSessionPlan {
  const { doctor, from, to } = input;
  const holidays = new Set(input.holidayDates);
  const inRange = (d: string) => d >= from && (!to || d <= to);
  const byDate = new Map<string, DoctorSession[]>();
  for (const s of input.sessions) {
    if (s.doctorId !== doctor.id || !inRange(s.date)) continue;
    byDate.set(s.date, [...(byDate.get(s.date) || []), s]);
  }
  const days = new Set<string>(byDate.keys());
  for (const r of input.setUpRanges) {
    const last = to && r.endDate > to ? to : r.endDate;
    for (let d = r.startDate > from ? r.startDate : from; d <= last; d = nextDay(d)) days.add(d);
  }

  const plan: PatternSessionPlan = { remove: [], upsert: [], changedDays: [], handChangedDays: [] };
  for (const date of [...days].sort()) {
    const day = byDate.get(date) || [];
    if (day.some((s) => s.source === 'MANUAL' || s.cancelled)) {
      plan.handChangedDays.push(date);
      continue;
    }
    const weekday = getWeekdayFromIsoDate(date);
    const wanted = holidays.has(date) ? [] : weekOn(doctor, date).filter((p) => p.weekday === weekday);
    const used = new Set<WeeklyPatternSlot>();
    let changed = false;
    for (const s of day) {
      const slot = wanted.find((p) => p.startTime === s.startTime && !used.has(p));
      if (!slot) {
        plan.remove.push(s);
        changed = true;
        continue;
      }
      used.add(slot);
      const room = slot.room || 'Suite 101';
      if (s.endTime !== slot.endTime || (s.room || '') !== room) {
        plan.upsert.push({ ...s, endTime: slot.endTime, room, source: 'PATTERN', cancelled: false });
        changed = true;
      }
    }
    for (const slot of wanted.filter((p) => !used.has(p))) {
      plan.upsert.push({
        id: `sess-${doctor.id}-${date}-${slot.startTime.replace(':', '')}`,
        doctorId: doctor.id,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        specialtyId: doctor.specialtyIds?.[0] || 'spec-gp',
        room: slot.room || 'Suite 101',
        source: 'PATTERN',
        cancelled: false,
      });
      changed = true;
    }
    if (changed) plan.changedDays.push(date);
  }
  return plan;
}

/** Saves doctor sessions as whole records and deletes the given ones, in one write when the repository can. */
export async function saveDoctorSessions(repo: IRepository, upserts: DoctorSession[], removeIds: string[]): Promise<void> {
  if (upserts.length + removeIds.length === 0) return;
  if (repo.bulkWrite) {
    await repo.bulkWrite('doctorSessions', { upserts, removeIds, replace: true });
    return;
  }
  if (upserts.length > 0) await repo.bulkUpsert('doctorSessions', upserts, { replace: true });
  if (removeIds.length > 0) await repo.bulkRemove('doctorSessions', removeIds);
}

/** True when a doctor's week or on/off state differs (what the Doctors screen asks about). */
export function weekChanged(
  before: Pick<Doctor, 'weeklyPattern' | 'active'> | undefined,
  after: Pick<Doctor, 'weeklyPattern' | 'active'>
): boolean {
  const key = (d?: Pick<Doctor, 'weeklyPattern' | 'active'>) =>
    !d || d.active === false
      ? 'off'
      : JSON.stringify(
          [...(d.weeklyPattern || [])]
            .map((p) => [p.weekday, p.startTime, p.endTime, p.room || ''])
            .sort((a, b) => String(a).localeCompare(String(b)))
        );
  return key(before) !== key(after);
}

/**
 * A doctor with a changed week (or switched on or off) from `from` on: the week that
 * applied the day before is kept for the days before `from` (previousWeeklyPattern),
 * and the days already set up from `from` follow the new week (see planPatternSessions).
 */
export function doctorFromDate(before: Doctor | undefined, after: Doctor, from: string): Doctor {
  return {
    ...after,
    patternFrom: from,
    previousWeeklyPattern: before ? weekOn(before, nextDay(from, -1)) : [],
  };
}
