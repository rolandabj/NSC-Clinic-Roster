/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Schedule Deletion Service
 * Permanently removes a schedule and cascades deletion to all associated
 * shifts, versions, publish logs, read receipts, share links, invitations and swaps.
 */

import { removePublicRoster } from '../publish/publicRosterService';
import { IRepository } from '../repository/IRepository';

export interface ScheduleDeleteResult {
  success: boolean;
  scheduleId: string;
  scheduleName: string;
  purgedAssignmentsCount: number;
  purgedVersionsCount: number;
}

export async function deleteEntireSchedule(
  repo: IRepository,
  scheduleId: string,
  actorName: string = 'Admin'
): Promise<ScheduleDeleteResult> {
  const schedule = await repo.get('schedules', scheduleId);
  const scheduleName = schedule?.name || `Schedule (${scheduleId})`;
  const bySchedule = { field: 'scheduleId', operator: '==' as const, value: scheduleId };
  const failed: string[] = [];

  let purgedAssignmentsCount = 0;
  let purgedVersionsCount = 0;

  /** Removes one kind of record that belongs to this roster; a failure is collected, not hidden. */
  const purge = async (label: string, run: () => Promise<number | void>) => {
    try {
      return (await run()) || 0;
    } catch (err) {
      console.error(`Could not delete the ${label} of schedule ${scheduleId}:`, err);
      failed.push(label);
      return 0;
    }
  };

  // Public snapshots first: they can't be found once their share link is gone. If one
  // can't be removed, nothing else is deleted, so the roster stays whole and the delete
  // can simply be tried again.
  await purge('share links', async () => {
    const links = await repo.list('shareLinks', bySchedule);
    // A link whose snapshot could not be removed is kept, so the snapshot can still be
    // found and removed later; the roster is then kept too (see purge).
    const removed: string[] = [];
    let firstError: unknown;
    for (const l of links) {
      try {
        if (l.token) await removePublicRoster(l.token, repo);
        removed.push(l.id);
      } catch (err) {
        console.warn(`Could not remove public snapshot for token ${l.token}:`, err);
        firstError ??= err;
      }
    }
    if (removed.length > 0) await repo.bulkRemove('shareLinks', removed);
    if (firstError) throw firstError;
  });
  if (failed.length > 0) {
    throw new Error('A public share page of this roster could not be removed, so the roster, its shifts and its versions were kept. Try again.');
  }

  purgedAssignmentsCount = await purge('shifts', async () => {
    const list = await repo.list('assignments', bySchedule);
    if (list.length > 0) await repo.bulkRemove('assignments', list.map((a) => a.id));
    return list.length;
  });

  purgedVersionsCount = await purge('versions', async () => {
    const list = await repo.list('versions', bySchedule);
    if (list.length > 0) await repo.bulkRemove('versions', list.map((v) => v.id));
    return list.length;
  });

  await purge('invitations', async () => {
    const list = await repo.list('invitations', bySchedule);
    if (list.length > 0) await repo.bulkRemove('invitations', list.map((x) => x.id));
  });

  await purge('email log', async () => {
    const list = await repo.list('emailLog', bySchedule);
    if (list.length > 0) await repo.bulkRemove('emailLog', list.map((x) => x.id));
  });

  await purge('read receipts', async () => {
    const list = await repo.list('acknowledgments', bySchedule);
    if (list.length > 0) await repo.bulkRemove('acknowledgments', list.map((x) => x.id));
  });

  await purge('shift swaps', async () => {
    const list = await repo.list('swaps', bySchedule);
    if (list.length > 0) await repo.bulkRemove('swaps', list.map((x) => x.id));
  });

  // The roster itself is only deleted when everything that belongs to it is gone,
  // so a failed clean up can be retried instead of leaving hidden leftovers.
  if (failed.length > 0) {
    throw new Error(`Some parts could not be deleted (${failed.join(', ')}), so the roster was kept. Try again.`);
  }
  await repo.remove('schedules', scheduleId);

  try {
    await repo.create('audit', {
      actor: actorName,
      action: 'DELETE',
      entity: 'Schedule',
      entityId: scheduleId,
      note: `Permanently deleted schedule "${scheduleName}" with ${purgedAssignmentsCount} shifts and ${purgedVersionsCount} versions.`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Error creating audit entry for schedule deletion:', err);
  }

  return {
    success: true,
    scheduleId,
    scheduleName,
    purgedAssignmentsCount,
    purgedVersionsCount,
  };
}
