/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Loads what the engine and the validator need to know about the clinic for
 * one schedule: opening hours (clinic profile), public holidays, the shifts at
 * the end of the previous roster (rosters run back to back), the year to date
 * fairness totals and the nurses' availability requests for these dates.
 */

import { IRepository } from '../repository/IRepository';
import { Assignment, AvailabilityRequest, Schedule } from '../../types';
import { ClinicSetup, YearToDate } from './clinicModel';
import { lateDutyThreshold } from './SchedulingEngine';
import { loadYearToDate } from '../fairness/yearToDate';

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

export async function loadClinicSetup(repo: IRepository, schedule: Schedule): Promise<ClinicSetup> {
  const [clinics, holidays, schedules] = await Promise.all([
    repo.list('clinics'),
    repo.list('holidays'),
    repo.list('schedules'),
  ]);
  const profile = clinics[0];

  let priorAssignments: Assignment[] = [];
  const previous = findPreviousSchedule(schedule, schedules);
  if (previous) {
    const from = daysBefore(schedule.startDate, PRIOR_DAYS);
    const list = await repo.list('assignments', { field: 'scheduleId', operator: '==', value: previous.id });
    priorAssignments = list.filter((a) => a.date >= from && a.date < schedule.startDate);
  }

  const holidayDates = holidays.map((h) => h.date);
  // Extras that only fine tune the generator: if they can't be loaded the roster still loads.
  const [yearToDate, availabilityRequests] = await Promise.all([
    (async (): Promise<YearToDate | undefined> => {
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
      .then((list: AvailabilityRequest[]) => list.filter((r) => r.date >= schedule.startDate && r.date <= schedule.endDate))
      .catch((err) => {
        console.warn('Could not load the availability requests:', err);
        return undefined;
      }),
  ]);

  return {
    openTime: profile?.openTime,
    closeTime: profile?.closeTime,
    holidayDates,
    priorAssignments,
    yearToDate,
    availabilityRequests,
  };
}
