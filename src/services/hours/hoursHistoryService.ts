/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Loads the hours history a roster's balances carry from: the earlier rosters
 * of the same dedicated period, each as it was last published. Drafts and
 * archived rosters never count, and later draft edits never change a balance.
 */

import { IRepository } from '../repository/IRepository';
import { LeaveEntry, Schedule, WorkingHoursPeriod } from '../../types';
import { loadEarlierRosters } from '../fairness/yearToDate';
import { countedEarlierRosters, HoursHistory } from './hoursBalance';

export async function loadHoursHistory(
  repo: IRepository,
  schedule: Schedule,
  known: { schedules?: Schedule[]; periods?: WorkingHoursPeriod[]; leaveEntries?: LeaveEntry[] } = {}
): Promise<HoursHistory> {
  const [schedules, periods, leaveEntries] = await Promise.all([
    known.schedules || repo.list('schedules'),
    known.periods || repo.list('workingHoursPeriods'),
    known.leaveEntries || repo.list('leaveEntries'),
  ]);
  // Every roster that is not archived may hold dates, and could have been published.
  const candidates = countedEarlierRosters(schedule, periods, schedules.filter((s) => s.status !== 'ARCHIVED'),
    schedules.map((s) => s.id));
  const published = await loadEarlierRosters(repo, candidates);
  return {
    schedules,
    assignments: published.flatMap((r) => r.assignments.filter((a) => a.scheduleId === r.schedule.id || !a.scheduleId)
      .map((a) => ({ ...a, scheduleId: r.schedule.id }))),
    leaveEntries,
    countedScheduleIds: published.map((r) => r.schedule.id),
    contractPercents: Object.fromEntries(published.filter((r) => r.contractPercents).map((r) => [r.schedule.id, r.contractPercents!])),
  };
}
