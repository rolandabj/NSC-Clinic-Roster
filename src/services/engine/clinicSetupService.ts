/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Loads what the engine and the validator need to know about the clinic for
 * one schedule: opening hours (clinic profile), public holidays, the shifts at
 * both sides of this roster, the year to date
 * fairness totals and the nurses' availability requests for these dates.
 */

import { IRepository } from '../repository/IRepository';
import { Assignment, AvailabilityRequest, Schedule } from '../../types';
import { ClinicSetup, YearToDate } from './clinicModel';
import { lateDutyThreshold } from './SchedulingEngine';
import { loadYearToDate } from '../fairness/yearToDate';
import { loadHoursHistory } from '../hours/hoursHistoryService';

/** How far back into the previous roster the look back rules need to see. */
const PRIOR_DAYS = 31;

function daysBefore(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d - days)).toISOString().split('T')[0];
}

/** The roster that ends last before this one starts (a published one wins a tie). */
export function findPreviousSchedule(schedule: Schedule, schedules: Schedule[]): Schedule | undefined {
  return schedules
    // A roster that started earlier counts even if it overlaps this one; only its days
    // before this roster starts are used.
    .filter((s) => s.id !== schedule.id && s.status !== 'ARCHIVED' && s.startDate < schedule.startDate)
    .sort((a, b) => {
      if (a.endDate !== b.endDate) return b.endDate.localeCompare(a.endDate);
      return (b.status === 'PUBLISHED' ? 1 : 0) - (a.status === 'PUBLISHED' ? 1 : 0);
    })[0];
}

export async function loadClinicSetup(
  repo: IRepository,
  schedule: Schedule,
  /** withYearToDate: false skips the year's fairness totals (only the generator uses them). */
  options: { withYearToDate?: boolean } = {}
): Promise<ClinicSetup> {
  const [clinics, holidays, schedules] = await Promise.all([
    repo.list('clinics'),
    repo.list('holidays'),
    repo.list('schedules'),
  ]);
  const profile = clinics[0];

  // Surrounding duties are fixed context for rest, duty runs and rolling hours.
  // Read both sides so refilling an earlier roster cannot ignore a later saved duty.
  const from = daysBefore(schedule.startDate, PRIOR_DAYS);
  const through = daysBefore(schedule.endDate, -PRIOR_DAYS);
  const surrounding = schedules.filter(s => s.id !== schedule.id && s.status !== 'ARCHIVED' &&
    s.startDate <= through && s.endDate >= from &&
    (s.startDate < schedule.startDate || s.endDate > schedule.endDate));
  const [surroundingShifts, hoursHistory] = await Promise.all([
    Promise.all(surrounding.map(s => repo.list('assignments', { field: 'scheduleId', operator: '==', value: s.id })
      .then(list => list.filter(a => a.date >= s.startDate && a.date <= s.endDate)))),
    loadHoursHistory(repo, schedule, { schedules }),
  ]);
  const priorAssignments: Assignment[] = surroundingShifts.flat().filter(a => a.date >= from && a.date < schedule.startDate);
  const followingAssignments: Assignment[] = surroundingShifts.flat().filter(a => a.date > schedule.endDate && a.date <= through);

  const holidayDates = holidays.map((h) => h.date);
  const holidayNames = Object.fromEntries(holidays.map((h) => [h.date, h.name]));
  const inRoster = (date?: string) => !!date && date >= schedule.startDate && date <= schedule.endDate;
  // Fairness totals may be unavailable; approved availability restrictions are required.
  const [yearToDate, availabilityRequests] = await Promise.all([
    (async (): Promise<YearToDate | undefined> => {
      if (options.withYearToDate === false) return undefined;
      const [dutyWindows, roles, rules] = await Promise.all([repo.list('dutyWindows'), repo.list('clinicalRoles'), repo.list('rules')]);
      return loadYearToDate(repo, schedule, dutyWindows, holidayDates, {
        lateThreshold: lateDutyThreshold(rules),
        roles,
        schedules,
      });
    })().catch((err) => {
      console.warn('Could not load the year to date fairness totals:', err);
      return undefined;
    }),
    repo
      .list('availabilityRequests')
      // A day off for one of this roster's public holidays counts here wherever it falls.
      .then((list: AvailabilityRequest[]) => list.filter((r) => inRoster(r.date) || inRoster(r.holidayDate)))
      .catch(() => {
        throw new Error('Availability requests could not be loaded. Reload before filling or publishing.');
      }),
  ]);

  return {
    hoursHistory,
    openTime: profile?.openTime,
    closeTime: profile?.closeTime,
    holidayDates,
    holidayNames,
    priorAssignments,
    followingAssignments,
    yearToDate,
    availabilityRequests,
  };
}
