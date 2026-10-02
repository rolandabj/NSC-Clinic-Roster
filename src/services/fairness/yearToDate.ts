/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Fairness across the year: how many weekend days, public holidays, late
 * shifts and Nurse Clinic shifts each nurse worked in the earlier rosters of
 * this calendar year. Published rosters count as they were published (the
 * latest published version), so later drafts never change the totals.
 */

import { IRepository } from '../repository/IRepository';
import { Assignment, ClinicalRole, DutyWindow, Schedule, ScheduleVersion } from '../../types';
import { isWeekendDate } from '../../utils/weekend';
import { isLateDuty } from '../engine/SchedulingEngine';
import { YearToDate, YearToDateCounts, nurseClinicRoleOf } from '../engine/clinicModel';

export type { YearToDate, YearToDateCounts } from '../engine/clinicModel';

export interface YearToDateInput {
  rosters: { schedule: Schedule; assignments: Assignment[] }[];
  dutyWindows: DutyWindow[];
  holidayDates: Iterable<string>;
  /** Shifts ending at or after this time are late (default 21:00, see lateDutyThreshold). */
  lateThreshold?: string;
  /** Used to find the Nurse Clinic role (role-nurse-clinic is always counted). */
  roles?: ClinicalRole[];
}

const emptyCounts = (): YearToDateCounts => ({ weekendDays: 0, holidays: 0, lateShifts: 0, nurseClinic: 0, rosters: 0 });

/** Counts per nurse over the given rosters (only shifts inside each roster's own dates). */
export function computeYearToDate({
  rosters,
  dutyWindows,
  holidayDates,
  lateThreshold = '21:00',
  roles = [],
}: YearToDateInput): YearToDate {
  const holidays = new Set(holidayDates);
  const duties = new Map(dutyWindows.map((d) => [d.id, d]));
  const ncIds = new Set(['role-nurse-clinic']);
  const nc = nurseClinicRoleOf(roles);
  if (nc) ncIds.add(nc.id);

  const result: YearToDate = {};
  for (const { schedule, assignments } of rosters) {
    // One shift per nurse and day (a duplicate is not counted twice)
    const seen = new Set<string>();
    const inRoster = new Set<string>();
    for (const a of assignments) {
      if (a.date < schedule.startDate || a.date > schedule.endDate) continue;
      const key = `${a.nurseId}_${a.date}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const counts = (result[a.nurseId] ||= emptyCounts());
      inRoster.add(a.nurseId);
      if (isWeekendDate(a.date)) counts.weekendDays++;
      if (holidays.has(a.date)) counts.holidays++;
      if (isLateDuty(duties.get(a.dutyWindowId), lateThreshold)) counts.lateShifts++;
      if (a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId && ncIds.has(a.clinicalRoleId)) counts.nurseClinic++;
    }
    inRoster.forEach((id) => result[id].rosters++);
  }
  return result;
}

/** The newest published version of a roster (backup copies are not versions). */
export function latestPublishedVersion(versions: ScheduleVersion[]): ScheduleVersion | undefined {
  return versions
    .filter((v) => v.isPublished && v.kind !== 'BACKUP' && v.snapshot?.assignments)
    .sort(
      (a, b) =>
        (b.number || 0) - (a.number || 0) ||
        (b.publishedAt || b.timestamp || '').localeCompare(a.publishedAt || a.timestamp || '')
    )[0];
}

/** The earlier rosters of the same calendar year that count toward the year to date totals. */
export function earlierRostersThisYear(schedule: Schedule, schedules: Schedule[]): Schedule[] {
  const year = schedule.startDate.slice(0, 4);
  return schedules.filter(
    (s) =>
      s.id !== schedule.id &&
      s.status !== 'ARCHIVED' &&
      s.startDate.slice(0, 4) === year &&
      s.endDate < schedule.startDate
  );
}

/**
 * Year to date totals for the nurses before `schedule` starts. Each earlier
 * roster this year counts as last published; a roster marked published without
 * a published version counts with its current shifts; a roster that was never
 * published is left out.
 */
export async function loadYearToDate(
  repo: IRepository,
  schedule: Schedule,
  dutyWindows: DutyWindow[],
  holidayDates: Iterable<string>,
  options: {
    lateThreshold?: string;
    roles?: ClinicalRole[];
    /** All rosters, when the caller already has them (saves a read). */
    schedules?: Schedule[];
  } = {}
): Promise<YearToDate> {
  const earlier = earlierRostersThisYear(schedule, options.schedules || (await repo.list('schedules')));
  const rosters = await Promise.all(
    earlier.map(async (s) => {
      const bySchedule = { field: 'scheduleId', operator: '==' as const, value: s.id };
      const published = latestPublishedVersion(await repo.list('versions', bySchedule));
      if (published) return { schedule: s, assignments: published.snapshot.assignments };
      if (s.status === 'PUBLISHED') return { schedule: s, assignments: await repo.list('assignments', bySchedule) };
      return null;
    })
  );
  return computeYearToDate({
    rosters: rosters.filter((r): r is { schedule: Schedule; assignments: Assignment[] } => !!r),
    dutyWindows,
    holidayDates,
    lateThreshold: options.lateThreshold,
    roles: options.roles,
  });
}
