/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The roster screen's save queues (shifts, pinned days, leave), one set per
 * repository for as long as the app is open. A save that failed (for example
 * while the daily quota is used up) is kept when the planner opens another
 * screen: it is retried every 30 seconds in the background, the roster screen
 * shows it again when it opens, and closing the tab asks first.
 *
 * Saved shifts of a published roster count for the hours and fairness of later
 * rosters straight away (the owner's rule), so each save drops this browser's
 * cached copy of that roster, and stamps the roster's record so other browsers
 * load it fresh too (at most once a minute while someone keeps editing).
 */

import { CollectionSyncer } from './collectionSyncer';
import { IRepository } from './IRepository';
import { quotaTracker } from '../firebase/quotaTracker';
import { forgetCachedRoster } from '../fairness/yearToDate';

export const RETRY_EVERY_MS = 30000;
export const STAMP_EVERY_MS = 60000;

/** What to do after a roster's shifts were saved (see the note at the top). */
function afterShiftsSaved(repo: IRepository): (scheduleId: string) => void {
  const lastStamp = new Map<string, number>();
  const waiting = new Set<string>();
  const stamp = async (scheduleId: string) => {
    waiting.delete(scheduleId);
    lastStamp.set(scheduleId, Date.now());
    try {
      // A draft never counts for later rosters, so only a published one needs the stamp.
      const schedule = await repo.get('schedules', scheduleId);
      if (schedule?.status === 'PUBLISHED') await repo.update('schedules', scheduleId, { updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Could not mark the roster as changed for other browsers:', err);
    }
  };
  return (scheduleId: string) => {
    forgetCachedRoster(repo, scheduleId);
    if (scheduleId === 'all' || waiting.has(scheduleId)) return;
    const wait = (lastStamp.get(scheduleId) ?? -Infinity) + STAMP_EVERY_MS - Date.now();
    if (wait <= 0) {
      void stamp(scheduleId);
      return;
    }
    waiting.add(scheduleId);
    const timer = setTimeout(() => void stamp(scheduleId), wait);
    (timer as any)?.unref?.();
  };
}

export interface RosterSaveQueues {
  assignments: CollectionSyncer<'assignments'>;
  locks: CollectionSyncer<'locks'>;
  leaveEntries: CollectionSyncer<'leaveEntries'>;
  /** Calls fn on every change of any queue while the screen listens; returns a function that stops it. */
  listen(fn: () => void): () => void;
  /** True while anything is being saved, waits, or failed. */
  hasUnsaved(): boolean;
  /** Drops every unsaved change and what is known (on sign out). */
  reset(): void;
}

const queuesByRepo = new WeakMap<IRepository, RosterSaveQueues>();

export function rosterSaveQueues(repo: IRepository): RosterSaveQueues {
  const existing = queuesByRepo.get(repo);
  if (existing) return existing;
  const listeners = new Set<() => void>();
  const onChange = () => listeners.forEach((fn) => fn());
  const assignments = new CollectionSyncer(repo, 'assignments', onChange, afterShiftsSaved(repo));
  const locks = new CollectionSyncer(repo, 'locks', onChange);
  const leaveEntries = new CollectionSyncer(repo, 'leaveEntries', onChange);
  const queues: RosterSaveQueues = {
    assignments,
    locks,
    leaveEntries,
    listen(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    hasUnsaved: () => assignments.hasUnsaved() || locks.hasUnsaved() || leaveEntries.hasUnsaved(),
    reset: () => [assignments, locks, leaveEntries].forEach((syncer) => syncer.reset()),
  };
  queuesByRepo.set(repo, queues);

  // While the roster screen is open it retries itself and shows the outcome;
  // otherwise failed saves are retried here.
  const timer = setInterval(() => {
    if (listeners.size > 0 || quotaTracker.isQuotaExceeded()) return;
    for (const syncer of [assignments, locks, leaveEntries]) void syncer.retry();
  }, RETRY_EVERY_MS);
  (timer as any)?.unref?.();

  // Closing the tab while a change is still being saved (or failed) asks first.
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
      if (!queues.hasUnsaved()) return;
      e.preventDefault();
      e.returnValue = '';
    });
  }
  return queues;
}
