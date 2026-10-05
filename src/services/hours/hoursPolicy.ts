/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared hours rules used by the scheduling engine, the validator and the
 * hours reports, so all three always agree on:
 *   - the full time target hours of a schedule
 *   - how many hours a leave entry credits, per day and inside a date range
 */

import { LeaveEntry, LeaveType, Schedule, WorkingHoursPeriod } from '../../types';
import { calculateWorkingHoursForDateRange } from '../periods/workingHoursPeriodService';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Hours credited for a leave day when nothing more specific is known. */
export const DEFAULT_LEAVE_DAY_HOURS = 8;

/** Number of calendar days from start to end, both included (0 if end is before start). */
export function inclusiveDays(startDate: string, endDate: string): number {
  const s = Date.parse(`${startDate}T00:00:00Z`);
  const e = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 0;
  return Math.round((e - s) / DAY_MS) + 1;
}

export interface FullTimeTarget {
  hours: number;
  source: 'PERIOD' | 'SCHEDULE' | 'DEFAULT';
  periodName?: string;
}

/**
 * Full time target hours for a schedule.
 * 1. Dedicated working hours periods, when at least one covers part of the schedule.
 * 2. Dates outside dedicated periods do not accrue target hours.
 */
export function resolveFullTimeTarget(
  schedule: Pick<Schedule, 'startDate' | 'endDate' | 'hoursTargetFullTime' | 'periodName'>,
  workingHoursPeriods?: WorkingHoursPeriod[]
): FullTimeTarget {
  if (workingHoursPeriods && workingHoursPeriods.length > 0 && schedule.startDate && schedule.endDate) {
    const calc = calculateWorkingHoursForDateRange(schedule.startDate, schedule.endDate, workingHoursPeriods);
    if (calc.targetHours > 0 && calc.breakdown.length > 0) {
      return {
        hours: calc.targetHours,
        source: 'PERIOD',
        periodName:
          calc.matchedPeriod?.name || (calc.isProrated ? `${calc.totalScheduleDays}d Prorated` : schedule.periodName),
      };
    }
  }

  return { hours: 0, source: 'DEFAULT', periodName: schedule.periodName };
}

type CreditEntry = Pick<LeaveEntry, 'startDate' | 'endDate' | 'hoursCredited'> & { dayHours?: Record<string, number> };
type CreditType = Pick<LeaveType, 'creditedHours' | 'countsTowardHoursTarget'>;

/**
 * Hours one leave day counts toward the hours target when that day has no
 * hours of its own:
 * - leave types that do not count toward the target credit 0;
 * - otherwise the leave type's hours per day (set in Settings > Leave types);
 * - for an unknown type, the entry's saved total spread over its days, else 8 h.
 */
export function leaveCreditPerDay(
  entry: CreditEntry,
  leaveType?: CreditType,
  defaultDayHours: number = DEFAULT_LEAVE_DAY_HOURS
): number {
  if (leaveType && leaveType.countsTowardHoursTarget === false) return 0;
  if (leaveType && typeof leaveType.creditedHours === 'number') return leaveType.creditedHours;
  const entryDays = inclusiveDays(entry.startDate, entry.endDate);
  if (typeof entry.hoursCredited === 'number' && entry.hoursCredited > 0 && entryDays > 0) {
    return entry.hoursCredited / entryDays;
  }
  return defaultDayHours;
}

/** Hours this leave counts on one date: that day's own hours if set, else the default. */
export function leaveCreditOnDate(
  entry: CreditEntry,
  leaveType: CreditType | undefined,
  date: string,
  defaultDayHours: number = DEFAULT_LEAVE_DAY_HOURS
): number {
  if (leaveType && leaveType.countsTowardHoursTarget === false) return 0;
  const own = entry.dayHours?.[date];
  if (typeof own === 'number' && Number.isFinite(own) && own >= 0) return own;
  return leaveCreditPerDay(entry, leaveType, defaultDayHours);
}

/** Days of the leave entry that fall inside the range (both ends included). */
export function leaveDaysInRange(
  entry: Pick<LeaveEntry, 'startDate' | 'endDate'>,
  rangeStart: string,
  rangeEnd: string
): number {
  const start = entry.startDate > rangeStart ? entry.startDate : rangeStart;
  const end = entry.endDate < rangeEnd ? entry.endDate : rangeEnd;
  return inclusiveDays(start, end);
}

/** Hours this leave entry credits inside the range. */
export function leaveCreditInRange(
  entry: CreditEntry,
  leaveType: CreditType | undefined,
  rangeStart: string,
  rangeEnd: string,
  defaultDayHours: number = DEFAULT_LEAVE_DAY_HOURS
): number {
  const days = leaveDaysInRange(entry, rangeStart, rangeEnd);
  if (days <= 0) return 0;
  const base = leaveCreditPerDay(entry, leaveType, defaultDayHours);
  let total = base * days;
  // Days with their own hours replace the default for that day.
  if (entry.dayHours && !(leaveType && leaveType.countsTowardHoursTarget === false)) {
    const from = entry.startDate > rangeStart ? entry.startDate : rangeStart;
    const to = entry.endDate < rangeEnd ? entry.endDate : rangeEnd;
    for (const [date, hours] of Object.entries(entry.dayHours)) {
      if (date >= from && date <= to && typeof hours === 'number' && Number.isFinite(hours) && hours >= 0) {
        total += hours - base;
      }
    }
  }
  return total;
}

/** Total approved leave hours of one nurse inside the range. */
export function nurseLeaveHoursInRange(
  nurseId: string,
  leaveEntries: LeaveEntry[],
  leaveTypes: LeaveType[],
  rangeStart: string,
  rangeEnd: string
): number {
  const typeMap = new Map(leaveTypes.map((t) => [t.id, t]));
  return leaveEntries
    .filter((le) => le.nurseId === nurseId && le.approved)
    .reduce((sum, le) => sum + leaveCreditInRange(le, typeMap.get(le.leaveTypeId), rangeStart, rangeEnd), 0);
}
