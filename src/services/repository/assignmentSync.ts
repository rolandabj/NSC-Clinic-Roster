/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IRepository } from './IRepository';
import { Assignment } from '../../types';

/** Stable JSON form of an assignment, ignoring undefined fields and key order. */
function fingerprint(a: Assignment): string {
  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(a).sort()) {
    const value = (a as any)[key];
    if (value !== undefined && value !== null) clean[key] = value;
  }
  return JSON.stringify(clean);
}

/**
 * Synchronizes the persisted assignments of one schedule with the given list.
 * Only cells that actually changed are written, and removed cells are deleted,
 * so an edit to one cell costs one write instead of rewriting the whole month.
 */
export async function syncScheduleAssignments(
  repo: IRepository,
  scheduleId: string,
  newAssignments: Assignment[]
): Promise<void> {
  try {
    const existingForSchedule = await repo.list('assignments', {
      field: 'scheduleId',
      operator: '==',
      value: scheduleId,
    });
    const existingById = new Map(existingForSchedule.map((a) => [a.id, a]));
    const newIds = new Set(newAssignments.map((a) => a.id));

    const idsToRemove = existingForSchedule.filter((a) => !newIds.has(a.id)).map((a) => a.id);

    const changed = newAssignments
      .map((a) => (a.scheduleId ? a : { ...a, scheduleId }))
      .filter((a) => {
        const before = existingById.get(a.id);
        return !before || fingerprint(before) !== fingerprint(a);
      });

    if (idsToRemove.length > 0) {
      await repo.bulkRemove('assignments', idsToRemove);
    }
    if (changed.length > 0) {
      // Replace whole documents so cleared fields (e.g. a removed doctor) are removed too.
      await repo.bulkUpsert('assignments', changed, { replace: true });
    }
  } catch (err) {
    console.error(`[syncScheduleAssignments] Error synchronizing assignments for schedule ${scheduleId}:`, err);
    throw err;
  }
}
