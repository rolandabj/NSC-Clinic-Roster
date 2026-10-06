/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * How this clinic runs, shared by the scheduling engine and the validator so
 * both judge a roster the same way:
 *
 *   - The clinic is open every day, from the clinic profile's opening time to
 *     its closing time (default 09:00 to 21:00).
 *   - Each doctor works one session a day and gets one nurse. Her shift must
 *     overlap the session; covering all of it is preferred, partial cover is
 *     accepted.
 *   - At every opening hour there must be one "free" nurse: a nurse who is not
 *     with a doctor at that hour and is qualified for blood collection. She
 *     runs Nurse Clinic and blood collection together.
 *   - At least one senior nurse works each day (any shift).
 *   - On a public holiday only the on call doctor works, and one nurse covers
 *     the clinic for the opening hours; doctor sessions that day are ignored.
 *   - Rosters run back to back, so the last days of the previous roster count
 *     for consecutive days, rest and late duty rules.
 */

import type { HoursHistory } from '../hours/hoursBalance';

import { Assignment, AvailabilityRequest, ClinicalRole, DoctorSession, DutyWindow, Nurse } from '../../types';

/** One nurse's totals over the earlier rosters of this calendar year. */
export interface YearToDateCounts {
  /** Days worked on a weekend day. */
  weekendDays: number;
  /** Public holidays worked. */
  holidays: number;
  /** Shifts ending at or after the late time. */
  lateShifts: number;
  /** Shifts running Nurse Clinic. */
  nurseClinic: number;
  /** Earlier rosters in which she had at least one shift. */
  rosters: number;
}

/** Year to date totals by nurse id. */
export type YearToDate = Record<string, YearToDateCounts>;

export interface ClinicSetup {
  hoursHistory?: HoursHistory;
  /** 'HH:mm', default '09:00' */
  openTime?: string;
  /** 'HH:mm', default '21:00' */
  closeTime?: string;
  /** Public holiday dates (YYYY-MM-DD). */
  holidayDates?: Iterable<string>;
  /** Public holiday names by date, for messages. */
  holidayNames?: Record<string, string>;
  /** Shifts from the roster just before this one (read only, for the rules that look back). */
  priorAssignments?: Assignment[];
  /** Weekends, holidays, late shifts and Nurse Clinic so far this year (earlier rosters only). */
  yearToDate?: YearToDate;
  /** Nurses' availability requests for this roster's dates (any status), and days off taken for its public holidays. */
  availabilityRequests?: AvailabilityRequest[];
}

export interface ResolvedClinicSetup {
  openTime: string;
  closeTime: string;
  holidays: Set<string>;
  priorAssignments: Assignment[];
}

export const DEFAULT_OPEN_TIME = '09:00';
export const DEFAULT_CLOSE_TIME = '21:00';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export function resolveClinicSetup(setup?: ClinicSetup): ResolvedClinicSetup {
  const openTime = setup?.openTime && TIME.test(setup.openTime) ? setup.openTime : DEFAULT_OPEN_TIME;
  let closeTime = setup?.closeTime && TIME.test(setup.closeTime) ? setup.closeTime : DEFAULT_CLOSE_TIME;
  if (closeTime <= openTime) closeTime = DEFAULT_CLOSE_TIME > openTime ? DEFAULT_CLOSE_TIME : '23:59';
  return {
    openTime,
    closeTime,
    holidays: new Set(setup?.holidayDates || []),
    priorAssignments: setup?.priorAssignments || [],
  };
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

function fromMinutes(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** The opening hours split into one hour checks ([start, end) pairs, the last one may be shorter). */
export function openingHourSlots(setup: ResolvedClinicSetup): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];
  const close = toMinutes(setup.closeTime);
  for (let t = toMinutes(setup.openTime); t < close; t += 60) {
    slots.push({ start: fromMinutes(t), end: fromMinutes(Math.min(t + 60, close)) });
  }
  return slots;
}

/** True when the time ranges overlap (touching ends don't count). */
export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && aEnd > bStart;
}

/** The blood collection role (acronym PHL), if the clinic has one set up. */
export function bloodCollectionRole(roles: ClinicalRole[]): ClinicalRole | undefined {
  return roles.find((r) => r.acronym === 'PHL');
}

/** The Nurse Clinic role, if the clinic has one set up. */
export function nurseClinicRoleOf(roles: ClinicalRole[]): ClinicalRole | undefined {
  return roles.find((r) => r.id === 'role-nurse-clinic' || r.acronym === 'NC' || r.name.toLowerCase().includes('nurse clinic'));
}

/**
 * Can this nurse be the free nurse (Nurse Clinic and blood collection)? She needs the
 * Nurse Clinic option ticked in her profile, and the blood collection skill, whenever
 * the clinic has those roles set up. A nurse without them can still float.
 */
export function canBeFreeNurse(nurse: Nurse | undefined, roles: ClinicalRole[]): boolean {
  if (!nurse) return false;
  const nc = nurseClinicRoleOf(roles);
  if (nc && !nurse.capabilityIds.includes(nc.id) && !nurse.capabilityIds.includes('role-nurse-clinic')) return false;
  const phl = bloodCollectionRole(roles);
  return !phl || nurse.capabilityIds.includes(phl.id);
}

/**
 * Is this shift a free nurse during [start, end)? She must be on duty then, and
 * not with a doctor at that time: a doctor's nurse whose shift runs past the
 * doctor's session is free once the doctor has left.
 */
export function isFreeDuring(
  assignment: Assignment,
  duty: DutyWindow | undefined,
  daySessions: DoctorSession[],
  start: string,
  end: string
): boolean {
  if (!duty || !overlaps(duty.startTime, duty.endTime, start, end)) return false;
  if (assignment.kind !== 'DOCTOR' || !assignment.doctorId) return true;
  const session = daySessions.find((s) => s.doctorId === assignment.doctorId);
  return !session || !overlaps(session.startTime, session.endTime, start, end);
}

/** Minutes of [start, end) that a duty covers. */
export function coveredMinutes(duty: DutyWindow, start: string, end: string): number {
  const from = Math.max(toMinutes(duty.startTime), toMinutes(start));
  const to = Math.min(toMinutes(duty.endTime), toMinutes(end));
  return Math.max(0, to - from);
}

/** The parts of [start, end) that none of the duties cover. */
export function uncoveredParts(start: string, end: string, duties: DutyWindow[]): { start: string; end: string }[] {
  const parts: { start: string; end: string }[] = [];
  let cursor = toMinutes(start);
  const stop = toMinutes(end);
  const sorted = [...duties].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
  for (const d of sorted) {
    const ds = toMinutes(d.startTime);
    const de = toMinutes(d.endTime);
    if (de <= cursor) continue;
    if (ds > cursor) parts.push({ start: fromMinutes(cursor), end: fromMinutes(Math.min(ds, stop)) });
    cursor = Math.max(cursor, de);
    if (cursor >= stop) break;
  }
  if (cursor < stop) parts.push({ start: fromMinutes(cursor), end: fromMinutes(stop) });
  return parts.filter((p) => p.start < p.end);
}

/**
 * Hours of shifts needed to cover [start, end) with the given duties: one shift
 * if one covers it all, otherwise the fewest shifts that do (e.g. 10h + 8h for
 * 09:00 to 21:00 when the longest shift is 10 hours).
 */
export function hoursToCover(start: string, end: string, duties: DutyWindow[]): number {
  const hoursOf = (d: DutyWindow) => (toMinutes(d.endTime) - toMinutes(d.startTime)) / 60;
  const full = duties.filter((d) => d.startTime <= start && d.endTime >= end);
  if (full.length > 0) return Math.min(...full.map(hoursOf));
  let cursor = toMinutes(start);
  const stop = toMinutes(end);
  let total = 0;
  for (let guard = 0; cursor < stop && guard < 24; guard++) {
    const startingNow = duties.filter((d) => toMinutes(d.startTime) <= cursor && toMinutes(d.endTime) > cursor);
    let next: DutyWindow | undefined;
    if (startingNow.length > 0) {
      next = startingNow.sort((a, b) => toMinutes(b.endTime) - toMinutes(a.endTime) || hoursOf(a) - hoursOf(b))[0];
    } else {
      next = duties
        .filter((d) => toMinutes(d.startTime) > cursor && toMinutes(d.startTime) < stop)
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))[0];
      if (!next) break;
    }
    total += hoursOf(next);
    cursor = toMinutes(next.endTime);
  }
  return total;
}

/**
 * A day's doctor sessions, one per doctor (a doctor works one session a day; a
 * duplicate entry is ignored). The generator and the checker both use this, so
 * they always keep the same session: the earliest start, then the longest.
 */
export function doctorSessionsOn(sessions: DoctorSession[], date: string): DoctorSession[] {
  const seen = new Set<string>();
  return sessions
    .filter((s) => !s.cancelled && s.date === date)
    .sort(
      (a, b) =>
        a.startTime.localeCompare(b.startTime) ||
        b.endTime.localeCompare(a.endTime) ||
        a.doctorId.localeCompare(b.doctorId) ||
        a.id.localeCompare(b.id)
    )
    .filter((s) => {
      if (seen.has(s.doctorId)) return false;
      seen.add(s.doctorId);
      return true;
    });
}
