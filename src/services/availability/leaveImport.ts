/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The leave CSV import (Phase 7, slice 1): each row is checked as the leave editor checks a
 * leave (real dates, the last day not before the first, no clash with another leave or a
 * pinned day, the allowance), and every refused row is named with the reason. The rows of one
 * import count together, so two rows cannot pass the allowance between them.
 */

import type { LeaveEntry, LeaveType, LockEntry, Nurse } from '../../types';
import { parseDayMonthYear } from '../../utils/dateUtils';
import { allowanceFor } from '../hours/leaveAllowance';
import { leaveClash } from './leaveClash';

export interface LeaveImportRow {
  nurseId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  days: number;
}

const daysInclusive = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000) + 1;

export function planLeaveImport(
  text: string,
  data: {
    nurses: Pick<Nurse, 'id' | 'fullName' | 'gmail' | 'leaveQuotas'>[];
    leaveTypes: LeaveType[];
    leaveEntries: Pick<LeaveEntry, 'id' | 'nurseId' | 'leaveTypeId' | 'startDate' | 'endDate' | 'status'>[];
    locks: Pick<LockEntry, 'nurseId' | 'date'>[];
  }
): { add: LeaveImportRow[]; messages: string[] } {
  const add: LeaveImportRow[] = [];
  const messages: string[] = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || (i === 0 && /^(e-?mail|gmail)\b/i.test(line))) return;
    const refuse = (why: string) => messages.push(`Row ${i + 1}: ${why}`);
    const [email, acronym, first, last] = line.split(',').map((p) => p.trim());
    if (!email || !acronym || !first || !last) return refuse('each row needs an email, a kind of leave, a first day and a last day.');

    const nurse = data.nurses.find((n) => (n.gmail || '').toLowerCase() === email.toLowerCase());
    if (!nurse) return refuse(`no nurse has the email ${email}.`);
    const lt = data.leaveTypes.find((l) => (l.acronym || '').toUpperCase() === acronym.toUpperCase());
    if (!lt) return refuse(`no kind of leave is called ${acronym}.`);
    const startDate = parseDayMonthYear(first);
    if (!startDate) return refuse(`${first} is not a date. Write dates like 12-10-2026.`);
    const endDate = parseDayMonthYear(last);
    if (!endDate) return refuse(`${last} is not a date. Write dates like 12-10-2026.`);
    if (endDate < startDate) return refuse('the last day is before the first day.');

    // Earlier rows of this import count as leave already there.
    const earlier = add.map((a, k) => ({ ...a, id: `row-${k}`, status: 'APPROVED' as const }));
    const clash = leaveClash(nurse.id, startDate, endDate, [...data.leaveEntries, ...earlier], data.locks);
    if (clash) return refuse(clash.replace('This nurse', nurse.fullName));

    const days = daysInclusive(startDate, endDate);
    const allowance = allowanceFor(nurse, lt);
    const year = startDate.slice(0, 4);
    if (allowance !== null) {
      if (allowance === 0) return refuse(`${nurse.fullName} has no ${lt.name} allowance for ${year}.`);
      const used = [...data.leaveEntries, ...earlier]
        .filter((l) => l.nurseId === nurse.id && l.leaveTypeId === lt.id && l.status !== 'REJECTED' && l.startDate.startsWith(`${year}-`))
        .reduce((sum, l) => sum + daysInclusive(l.startDate, l.endDate), 0);
      if (used + days > allowance) return refuse(`${nurse.fullName} would have ${used + days} ${lt.name} days in ${year}, but the allowance is ${allowance}.`);
    }
    add.push({ nurseId: nurse.id, leaveTypeId: lt.id, startDate, endDate, days });
  });
  return { add, messages };
}
