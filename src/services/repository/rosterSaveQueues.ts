/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The roster screen's save queues (shifts, pinned days, leave), one set per
 * repository for as long as the app is open. A save that failed (for example
 * while the daily quota is used up) is kept when the planner opens another
 * screen: it is retried every 30 seconds in the background, the roster screen
 * shows it again when it opens, and closing the tab asks first.
 */

import { CollectionSyncer } from './collectionSyncer';
import { IRepository } from './IRepository';
import { quotaTracker } from '../firebase/quotaTracker';

export const RETRY_EVERY_MS = 30000;

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
  const assignments = new CollectionSyncer(repo, 'assignments', onChange);
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
