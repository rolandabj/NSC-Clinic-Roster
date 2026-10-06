/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Restoring a saved version from History. A version always goes back into its
 * own roster, never into the roster that happens to be selected on screen
 * (History lists the versions of every roster). The roster's shifts become the
 * version's shifts, a backup copy of the shifts as they were is kept first (so
 * the restore can be undone from the roster screen, More, Backup copies), and
 * a new version records the restore. Pinned days and leave are not changed.
 */

import { IRepository } from '../repository/IRepository';
import { syncScheduleAssignments } from '../repository/assignmentSync';
import { saveRosterBackup } from './rosterBackup';
import { Schedule, ScheduleVersion } from '../../types';

export interface VersionRestoreResult {
  schedule: Schedule;
  /** The number of the new version that records the restore. */
  newVersionNumber: number;
  restoredShifts: number;
}

export async function restoreVersion(
  repo: IRepository,
  version: ScheduleVersion,
  author: string
): Promise<VersionRestoreResult> {
  if (version.kind === 'BACKUP') throw new Error('Backup copies are restored from the roster screen (More, Backup copies).');
  const schedule = await repo.get('schedules', version.scheduleId);
  if (!schedule) throw new Error('The roster of this version no longer exists, so it cannot be restored.');

  const current = await repo.list('assignments', { field: 'scheduleId', operator: '==', value: schedule.id });
  await saveRosterBackup(repo, schedule, { assignments: current }, author, `Before restoring version ${version.number}`);

  const restored = (version.snapshot?.assignments || []).map((a) => ({ ...a, scheduleId: schedule.id }));
  await syncScheduleAssignments(repo, schedule.id, restored);

  const now = new Date().toISOString();
  const newVersionNumber = (schedule.activeVersionNumber || 1) + 1;
  await repo.create('versions', {
    scheduleId: schedule.id,
    number: newVersionNumber,
    timestamp: now,
    author,
    note: `Restored from version ${version.number} ("${version.note || 'Snapshot'}")`,
    snapshot: { ...version.snapshot, assignments: restored },
    isPublished: false,
  });
  await repo.update('schedules', schedule.id, { activeVersionNumber: newVersionNumber, updatedAt: now });
  await repo.create('audit', {
    scheduleId: schedule.id,
    actor: author,
    action: 'RESTORE',
    entity: 'Schedule',
    entityId: schedule.id,
    before: { version: schedule.activeVersionNumber },
    after: { version: newVersionNumber, restoredFrom: version.number },
    note: `Restored "${schedule.name}" to version ${version.number}`,
    timestamp: now,
  });
  return { schedule, newVersionNumber, restoredShifts: restored.length };
}
