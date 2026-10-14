/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Doctors screen (UI overhaul Phase 6, slice 3): the list's search and filters,
 * the usual week in words, and the doctor editor's checks.
 */

import type { Doctor, WeeklyPatternSlot } from '../../types';

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface DoctorFilters {
  /** Part of a name or a note. */
  query: string;
  /** A specialty id, or 'ALL'. */
  specialtyId: string;
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
}

export function filterDoctors(doctors: Doctor[], { query, specialtyId, status }: DoctorFilters): Doctor[] {
  const q = query.trim().toLowerCase();
  return doctors.filter((d) => {
    const found = !q || [d.fullName, d.notes].some((text) => (text || '').toLowerCase().includes(q));
    const specialty = specialtyId === 'ALL' || (d.specialtyIds || []).includes(specialtyId);
    const state = status === 'ALL' || (status === 'ACTIVE') === !!d.active;
    return found && specialty && state;
  });
}

/** Sunday first, as the weekday numbers run; within a day by start time. */
const byDayAndTime = (a: WeeklyPatternSlot, b: WeeklyPatternSlot) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime);

/** "Monday 09:00 to 13:00, R1" for each clinic of the usual week. */
export function usualWeekLines(pattern: WeeklyPatternSlot[] | undefined): string[] {
  return [...(pattern || [])]
    .sort(byDayAndTime)
    .map((p) => `${WEEKDAY_NAMES[p.weekday]} ${p.startTime} to ${p.endTime}${p.room ? `, ${p.room}` : ''}`);
}

export interface DoctorFormValues {
  fullName: string;
  gmail: string;
  specialtyIds: string[];
  weeklyPattern: WeeklyPatternSlot[];
}

/** Field name to message; a clinic of the usual week is under `pattern:<its place in the list>`. */
export type DoctorFormErrors = Partial<Record<string, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkDoctorForm(
  form: DoctorFormValues,
  doctors: Pick<Doctor, 'id' | 'fullName' | 'gmail'>[],
  editingId: string | undefined,
  clinicHasSpecialties: boolean
): DoctorFormErrors {
  const errors: DoctorFormErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Enter the doctor's full name.";

  const gmail = form.gmail.trim().toLowerCase();
  if (gmail && !EMAIL.test(gmail)) errors.gmail = 'Enter an email address like name@gmail.com, or leave it empty.';
  else if (gmail) {
    const clash = doctors.find((d) => d.id !== editingId && (d.gmail || '').trim().toLowerCase() === gmail);
    if (clash) errors.gmail = `${clash.fullName} already has this email address.`;
  }

  // With no specialties in the clinic at all, saving adds General Practice.
  if (clinicHasSpecialties && form.specialtyIds.length === 0) errors.specialtyIds = 'Choose at least one specialty.';

  form.weeklyPattern.forEach((p, i) => {
    if (!p.startTime || !p.endTime) errors[`pattern:${i}`] = 'Enter a start and an end time.';
    else if (p.endTime <= p.startTime) errors[`pattern:${i}`] = 'The end time must be after the start time.';
    else {
      const earlier = form.weeklyPattern
        .slice(0, i)
        .find((o) => o.weekday === p.weekday && o.startTime && o.endTime && o.startTime < p.endTime && p.startTime < o.endTime);
      if (earlier) errors[`pattern:${i}`] = `Overlaps the ${WEEKDAY_NAMES[p.weekday]} clinic from ${earlier.startTime} to ${earlier.endTime}.`;
    }
  });
  return errors;
}

export function doctorCounts(doctors: Doctor[]): { total: number; active: number } {
  return { total: doctors.length, active: doctors.filter((d) => d.active).length };
}
