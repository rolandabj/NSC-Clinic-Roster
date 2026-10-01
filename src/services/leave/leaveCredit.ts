/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Leave Credit Service (Phase 2)
 *
 * Single source of truth for "how many hours does this leave entry credit?".
 *
 * Rules (approved semantics):
 *  - A leave type only credits hours when `countsTowardHoursTarget !== false`
 *    (Request Off / Day Off declare false and 0 credited hours, so they must never
 *    reduce a nurse's period target or inflate earned hours).
 *  - `creditedHours: number` is the per-day rate (0 for RO/DO, 8 for AL/BL/PH/SL).
 *  - `creditedHours: 'match_duty'` credits a standard duty day (8h) unless the stored
 *    snapshot on the entry says otherwise.
 *  - A positive stored `hoursCredited` snapshot is treated as authoritative for the entry
 *    (it may encode an intentional custom credit, e.g. a half day) and is pro-rated per day
 *    so a leave spanning a period boundary can be clipped deterministically.
 *  - 0-credit leave types always resolve to 0, regardless of a legacy stored snapshot.
 */

import { LeaveEntry, LeaveType } from '../../types';

/** Standard duty day used when a leave type credits 'match_duty' or is unknown. */
export const DEFAULT_DUTY_HOURS = 8;

export interface ClippedLeaveRange {
  startDate: string;
  endDate: string;
  days: number;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Inclusive day count between two ISO dates (0 when invalid or inverted). */
export function getInclusiveLeaveDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate || startDate > endDate) return 0;
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

/** True when this leave type contributes to the nurse's period hours target. */
export function countsTowardHoursTarget(leaveType?: LeaveType | null): boolean {
  return leaveType ? leaveType.countsTowardHoursTarget !== false : true;
}

/** Per-day credit for a leave type (0 for RO/DO, 8 for 'match_duty'). */
export function resolveLeaveTypeHoursPerDay(leaveType?: LeaveType | null): number {
  if (!leaveType) return DEFAULT_DUTY_HOURS;
  if (typeof leaveType.creditedHours === 'number') return leaveType.creditedHours;
  return DEFAULT_DUTY_HOURS; // 'match_duty'
}

/**
 * Per-day credit for a concrete leave entry.
 * Returns 0 for leave types that do not count toward the hours target.
 *
 * When the leave type record is unavailable (e.g. a pure engine harness that was not
 * given the leaveTypes collection), a numeric stored snapshot is trusted as-is —
 * including 0, so RO/DO-style zero credits never silently become 8h.
 */
export function resolveLeaveHoursPerDay(
  leave?: LeaveEntry | null,
  leaveType?: LeaveType | null
): number {
  if (!countsTowardHoursTarget(leaveType)) return 0;

  const days = leave ? getInclusiveLeaveDays(leave.startDate, leave.endDate) : 0;
  if (leave && days > 0 && typeof leave.hoursCredited === 'number') {
    if (!leaveType) return leave.hoursCredited / days;
    if (leave.hoursCredited > 0) {
      // Stored snapshot wins (pro-rated per day) so intentional custom credits survive.
      return leave.hoursCredited / days;
    }
  }
  return resolveLeaveTypeHoursPerDay(leaveType);
}

/** Total credit for a whole leave entry. */
export function creditHoursForLeave(
  leave?: LeaveEntry | null,
  leaveType?: LeaveType | null
): number {
  if (!leave) return 0;
  const days = getInclusiveLeaveDays(leave.startDate, leave.endDate);
  if (days <= 0) return 0;
  if (!countsTowardHoursTarget(leaveType)) return 0;
  return round2(resolveLeaveHoursPerDay(leave, leaveType) * days);
}

/** Credit for a bare date range (used by creation paths before an entry exists). */
export function creditHoursForDateRange(
  startDate: string,
  endDate: string,
  leaveType?: LeaveType | null
): number {
  const days = getInclusiveLeaveDays(startDate, endDate);
  if (days <= 0) return 0;
  if (!countsTowardHoursTarget(leaveType)) return 0;
  return round2(resolveLeaveTypeHoursPerDay(leaveType) * days);
}

/**
 * Clips a leave entry to a window (typically the schedule period).
 * Returns null when the entry does not overlap the window at all.
 */
export function clipLeaveRangeToWindow(
  leave: LeaveEntry | null | undefined,
  windowStart: string,
  windowEnd: string
): ClippedLeaveRange | null {
  if (!leave || !windowStart || !windowEnd) return null;
  const startDate = leave.startDate > windowStart ? leave.startDate : windowStart;
  const endDate = leave.endDate < windowEnd ? leave.endDate : windowEnd;
  if (startDate > endDate) return null;
  const days = getInclusiveLeaveDays(startDate, endDate);
  if (days <= 0) return null;
  return { startDate, endDate, days };
}

/**
 * Credit earned by a leave entry *inside a schedule window only*.
 * This is what the engine/validator/reports must use so a leave that starts before or ends
 * after the period credits exactly the overlapping days.
 */
export function clippedLeaveCredit(
  leave: LeaveEntry | null | undefined,
  leaveType: LeaveType | null | undefined,
  windowStart: string,
  windowEnd: string
): number {
  const clip = clipLeaveRangeToWindow(leave, windowStart, windowEnd);
  if (!clip) return 0;
  if (!countsTowardHoursTarget(leaveType)) return 0;
  return round2(resolveLeaveHoursPerDay(leave, leaveType) * clip.days);
}

/** Convenience: active approved leaves for a nurse overlapping a window. */
export function getApprovedLeavesOverlapping(
  leaveEntries: LeaveEntry[] | null | undefined,
  nurseId: string,
  windowStart: string,
  windowEnd: string
): LeaveEntry[] {
  if (!leaveEntries || leaveEntries.length === 0) return [];
  return leaveEntries.filter(
    (le) =>
      le.nurseId === nurseId &&
      le.approved &&
      !(le.endDate < windowStart || le.startDate > windowEnd)
  );
}
