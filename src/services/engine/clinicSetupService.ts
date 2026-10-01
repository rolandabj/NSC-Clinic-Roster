/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Loads what the engine and the validator need to know about the clinic for
 * one schedule: opening hours (clinic profile), public holidays, and the
 * shifts at the end of the previous roster (rosters run back to back).
 */

import { IRepository } from '../repository/IRepository';
import { Assignment, Schedule } from '../../types';
import { ClinicSetup } from './clinicModel';

/** How far back into the previous roster the look back rules need to see. */
const PRIOR_DAYS = 31;

function daysBefore(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d - days)).toISOString().split('T')[0];
}

/** The roster that ends last before this one starts (a published one wins a tie). */
export function findPreviousSchedule(schedule: Schedule, schedules: Schedule[]): Schedule | undefined {
  return schedules
    .filter((s) => s.id !== schedule.id && s.status !== 'ARCHIVED' && s.endDate < schedule.startDate)
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

  return {
    openTime: profile?.openTime,
    closeTime: profile?.closeTime,
    holidayDates: holidays.map((h) => h.date),
    priorAssignments,
  };
}
