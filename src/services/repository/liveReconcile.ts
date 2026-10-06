/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shows other people's changes to a list this browser also saves (a roster's
 * shifts, leave, pinned days) without losing either side. A fresh copy from
 * the database is applied only once nothing of this browser's is waiting to be
 * saved, and only when it differs from what this browser saved. While a save
 * here has failed, the copy is held back and onConflict is called, so the
 * screen can ask before replacing unsaved changes.
 */

export interface LiveSaveQueue<T> {
  hasFailed(scope: string): boolean;
  hasUnsaved(scope?: string): boolean;
  differsFromKnown(items: T[], inScope?: (item: T) => boolean): boolean;
  replaceKnown(items: T[], inScope?: (item: T) => boolean): void;
}

export interface LiveReconcileOptions<T> {
  syncer: LiveSaveQueue<T>;
  /** The save scope (a roster id for shifts, 'all' for leave and pinned days). */
  scope: string;
  inScope?: (item: T) => boolean;
  /** True while the screen loads or fills: try again a little later. */
  isBusy: () => boolean;
  /** False once the screen shows something else (another roster). */
  isCurrent?: () => boolean;
  onApply: (items: T[]) => void;
  onConflict?: () => void;
  retryMs?: number;
}

export function createLiveReconciler<T>(options: LiveReconcileOptions<T>): { push(items: T[]): void; stop(): void } {
  let latest: T[] | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const reconcile = () => {
    clearTimeout(timer);
    const list = latest;
    if (!list || (options.isCurrent && !options.isCurrent())) return;
    if (options.syncer.hasFailed(options.scope)) {
      // This browser's change isn't saved: ask before showing theirs.
      if (options.syncer.differsFromKnown(list, options.inScope)) options.onConflict?.();
      return;
    }
    if (options.isBusy() || options.syncer.hasUnsaved(options.scope)) {
      timer = setTimeout(reconcile, options.retryMs ?? 1000);
      return;
    }
    if (!options.syncer.differsFromKnown(list, options.inScope)) return; // what this browser saved
    options.syncer.replaceKnown(list, options.inScope);
    options.onApply(list);
  };
  return {
    push(items: T[]) {
      latest = items;
      reconcile();
    },
    stop() {
      clearTimeout(timer);
    },
  };
}
