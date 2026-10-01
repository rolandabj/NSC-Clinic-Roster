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

import { Assignment, ClinicalRole, DoctorSession, DutyWindow, Nurse } from '../../types';

export interface ClinicSetup {
  /** 'HH:mm', default '09:00' */
  openTime?: string;
  /** 'HH:mm', default '21:00' */
  closeTime?: string;
  /** Public holiday dates (YYYY-MM-DD). */
  holidayDates?: Iterable<string>;
  /** Shifts from the roster just before this one (read only, for the rules that look back). */
  priorAssignments?: Assignment[];
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

/** Can this nurse be the free nurse? She must be qualified for blood collection when that role exists. */
export function canBeFreeNurse(nurse: Nurse | undefined, roles: ClinicalRole[]): boolean {
  if (!nurse) return false;
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
