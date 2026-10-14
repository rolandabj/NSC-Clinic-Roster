/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The nurse editor's checks (UI overhaul Phase 6, slice 2): one message for each field
 * that needs fixing, and moving a preference up or down the list.
 */

import type { Nurse, NursePreference } from '../../types';

export interface NurseFormValues {
  fullName: string;
  gmail: string;
  employeeCode: string;
  contractPercent: number;
  /** YYYY-MM-DD, or '' when what was typed is not a date. */
  dateOfBirth: string;
  /** Leave type id to days a year. */
  leaveQuotas: Record<string, number>;
}

/** Field name to message; a leave type's days are under `quota:<leave type id>`. */
export type NurseFormErrors = Partial<Record<string, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkNurseForm(
  form: NurseFormValues,
  nurses: Pick<Nurse, 'id' | 'fullName' | 'gmail' | 'employeeCode'>[],
  editingId: string | undefined,
  today: string
): NurseFormErrors {
  const errors: NurseFormErrors = {};
  const others = nurses.filter((n) => n.id !== editingId);
  const same = (a: string | undefined, b: string) => (a || '').trim().toLowerCase() === b;

  // Records saved by older versions may miss the email, the code or the date of birth.
  if (!(form.fullName || '').trim()) errors.fullName = "Enter the nurse's full name.";

  const gmail = (form.gmail || '').trim().toLowerCase();
  if (!gmail) errors.gmail = 'Enter an email address. Rosters and the private page are sent to it.';
  else if (!EMAIL.test(gmail)) errors.gmail = 'Enter an email address like name@gmail.com.';
  else {
    const clash = others.find((n) => same(n.gmail, gmail));
    if (clash) errors.gmail = `${clash.fullName} already has this email address.`;
  }

  const code = (form.employeeCode || '').trim().toLowerCase();
  if (code) {
    const clash = others.find((n) => same(n.employeeCode, code));
    if (clash) errors.employeeCode = `${clash.fullName} already has this employee code.`;
  }

  const p = form.contractPercent;
  if (!Number.isInteger(p) || p < 10 || p > 100) errors.contractPercent = 'Enter a whole number from 10 to 100.';

  if (!form.dateOfBirth) errors.dateOfBirth = 'Enter the date of birth, like 18-11-1990.';
  else if (form.dateOfBirth > today) errors.dateOfBirth = 'The date of birth is after today.';

  for (const [id, days] of Object.entries(form.leaveQuotas)) {
    if (!Number.isInteger(days) || days < 0 || days > 366) errors[`quota:${id}`] = 'Enter a whole number of days from 0 to 366.';
  }
  return errors;
}

/** The list with one preference moved to another place, ranked 1, 2, 3 again. Past either end it is unchanged. */
export function movePreference(prefs: NursePreference[], from: number, to: number): NursePreference[] {
  if (from === to || from < 0 || to < 0 || from >= prefs.length || to >= prefs.length) return prefs;
  const list = [...prefs];
  const [moved] = list.splice(from, 1);
  list.splice(to, 0, moved);
  return list.map((pref, i) => ({ ...pref, rank: i + 1 }));
}

/** The first N-101, N-102 ... that no nurse has, offered to a new nurse. */
export function nextEmployeeCode(nurses: Pick<Nurse, 'employeeCode'>[]): string {
  const taken = new Set(nurses.map((n) => (n.employeeCode || '').trim().toUpperCase()));
  let n = 101;
  while (taken.has(`N-${n}`)) n++;
  return `N-${n}`;
}
