/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Unsaved changes (UI overhaul Phase 8, slice 1b). A screen with a form that is saved only by
 * Save (Settings) adds a guard; the app frame asks "Leave without saving?" before opening
 * another screen while a guard gives a reason, and the browser asks before the tab closes.
 */

type Guard = () => string | null;

const guards = new Set<Guard>();

/** Adds a guard that returns why leaving would lose changes, or null. Returns its removal. */
export function addLeaveGuard(guard: Guard): () => void {
  guards.add(guard);
  return () => {
    guards.delete(guard);
  };
}

/** The first reason not to leave, or null when nothing would be lost. */
export function leaveReason(): string | null {
  for (const guard of guards) {
    const reason = guard();
    if (reason) return reason;
  }
  return null;
}

/** Whether a draft differs from what is saved (values compared as data). */
export function isChanged<T>(saved: T | null | undefined, draft: T | null | undefined): boolean {
  if (saved == null || draft == null) return false;
  return JSON.stringify(saved) !== JSON.stringify(draft);
}
