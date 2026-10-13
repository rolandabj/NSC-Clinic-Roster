import type { Assignment, LeaveEntry, LockEntry } from '../../types';

/** True when both lists hold the very same items in the same order (a new list of the same items counts as the same). */
export function sameItems<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export interface RosterLists {
  assignments: Assignment[];
  locks: LockEntry[];
  leaveEntries: LeaveEntry[];
}

/**
 * The lists of an edit that really change something. A cell edit sends all three lists,
 * usually as new lists of the same items for the two it did not touch; those are left out,
 * so they are neither set on screen nor saved again.
 */
export function changedLists(edit: Partial<RosterLists>, now: RosterLists): Partial<RosterLists> {
  const out: Partial<RosterLists> = {};
  if (edit.assignments && !sameItems(edit.assignments, now.assignments)) out.assignments = edit.assignments;
  if (edit.locks && !sameItems(edit.locks, now.locks)) out.locks = edit.locks;
  if (edit.leaveEntries && !sameItems(edit.leaveEntries, now.leaveEntries)) out.leaveEntries = edit.leaveEntries;
  return out;
}
