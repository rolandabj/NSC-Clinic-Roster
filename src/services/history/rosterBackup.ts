/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Backup copies of a roster: kept automatically before anything replaces its
 * shifts (a fill, a clear, a restore from History), so the change can be undone
 * later from the roster screen (More, Backup copies). Only the newest few are
 * kept. Backups take no version number, so saved and published versions keep theirs.
 */

import { IRepository } from '../repository/IRepository';
import { Assignment, LeaveEntry, LockEntry, Rule, Schedule, ScheduleVersion } from '../../types';

/** How many backup copies are kept per roster. */
export const BACKUPS_KEPT = 5;

export interface RosterBackupInput {
  assignments: Assignment[];
  leaveEntries?: LeaveEntry[];
  locks?: LockEntry[];
  rules?: Rule[];
}

/**
 * Saves a backup copy of a roster and removes the oldest copies beyond
 * BACKUPS_KEPT. Returns the new copy and the ids of the copies removed.
 */
export async function saveRosterBackup(
  repo: IRepository,
  schedule: Schedule,
  input: RosterBackupInput,
  author: string,
  note: string
): Promise<{ created: ScheduleVersion; removedIds: string[] }> {
  const saved = await repo.list('versions', { field: 'scheduleId', operator: '==', value: schedule.id });
  const inRange = (start: string, end: string) => end >= schedule.startDate && start <= schedule.endDate;
  const created = await repo.create('versions', {
    scheduleId: schedule.id,
    number: 0,
    timestamp: new Date().toISOString(),
    author,
    note,
    kind: 'BACKUP',
    snapshot: {
      schedule,
      assignments: input.assignments,
      leaveEntries: (input.leaveEntries || []).filter((l) => inRange(l.startDate, l.endDate)),
      locks: (input.locks || []).filter((l) => inRange(l.date, l.date)),
      rulesSnapshot: input.rules || [],
    },
    isPublished: false,
  });
  const older = saved
    .filter((v) => v.kind === 'BACKUP')
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(BACKUPS_KEPT - 1);
  // Removing old backups is tidying up; a failure here doesn't matter.
  await Promise.all(older.map((v) => repo.remove('versions', v.id).catch(() => {})));
  return { created, removedIds: older.map((v) => v.id) };
}
