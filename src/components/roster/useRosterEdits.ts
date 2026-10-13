import { useEffect, useRef, useState, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import type { Assignment, LeaveEntry, LockEntry, Schedule } from '../../types';
import { changedLists, type RosterLists } from '../../services/schedule/changedLists';
import type { CheckInputs } from './useRosterChecks';

/** One undo step: the roster's shifts, pinned days and leave at that moment. */
export interface RosterSnapshot {
  scheduleId: string;
  assignments: Assignment[];
  locks: LockEntry[];
  leaveEntries: LeaveEntry[];
}

/**
 * The roster screen's edits: every change goes through `applyEdit` (one undo step, one save
 * for each list it changed, one check of all three), with Undo and Redo (50 steps each, also
 * Ctrl+Z, Ctrl+Y and Ctrl+Shift+Z). A step holds the shifts, pinned days and leave together,
 * and the roster it belongs to, so it is never applied to another roster.
 */
export function useRosterEdits(o: {
  activeSchedule: Schedule | null;
  /** True while a roster (or the page data) is loading: edits wait. */
  loadingRef: MutableRefObject<boolean>;
  /**
   * The latest lists, not this render's: an edit can come from a dialog that waited for a
   * confirmation (or a fill that waited for the database) while a change arrived.
   */
  liveRef: MutableRefObject<RosterLists>;
  setAssignments: Dispatch<SetStateAction<Assignment[]>>;
  setLocks: Dispatch<SetStateAction<LockEntry[]>>;
  setLeaveEntries: Dispatch<SetStateAction<LeaveEntry[]>>;
  persistAssignments: (scheduleId: string, list: Assignment[]) => Promise<boolean>;
  persistLocks: (next: LockEntry[]) => Promise<boolean>;
  persistLeave: (next: LeaveEntry[]) => Promise<boolean>;
  runValidation: (sched: Schedule, list: Assignment[], overrides?: Partial<CheckInputs>) => void;
  toast: (message: string, tone?: 'success' | 'warning') => void;
  /** False on a phone, where the roster is only read: Ctrl+Z and Ctrl+Y do nothing there. */
  keysEnabled?: boolean;
}) {
  const { activeSchedule, loadingRef, liveRef } = o;
  const [undoStack, setUndoStack] = useState<RosterSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<RosterSnapshot[]>([]);
  // The check runs 300 ms after the last edit.
  const validationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Drops every undo and redo step (another roster opened, or someone else changed this one). */
  const clearUndo = () => {
    setUndoStack([]);
    setRedoStack([]);
  };

  const snapshotNow = (): RosterSnapshot | null => {
    const now = liveRef.current;
    return activeSchedule ? { scheduleId: activeSchedule.id, assignments: now.assignments, locks: now.locks, leaveEntries: now.leaveEntries } : null;
  };

  /**
   * Applies one edit (shifts, pinned days and leave together): one undo step,
   * one save per changed list, and one check with all three.
   */
  const applyEdit = (edit: Partial<RosterLists>, options: { recordUndo?: boolean } = {}) => {
    if (!activeSchedule) return;
    if (loadingRef.current) {
      o.toast('The roster is still loading. Try again in a moment.', 'warning');
      return;
    }
    const sched = activeSchedule;
    const now = liveRef.current;
    // Only the lists this edit really changes are set and saved (a cell edit sends all three).
    const changed = changedLists(edit, now);
    if (!changed.assignments && !changed.locks && !changed.leaveEntries) return;
    edit = changed;
    if (options.recordUndo !== false) {
      const before = snapshotNow();
      if (before) setUndoStack((prev) => [before, ...prev].slice(0, 50));
      setRedoStack([]);
    }
    const nextAssignments = edit.assignments ?? now.assignments;
    const nextLocks = edit.locks ?? now.locks;
    const nextLeave = edit.leaveEntries ?? now.leaveEntries;
    if (edit.assignments) {
      o.setAssignments(nextAssignments);
      void o.persistAssignments(sched.id, nextAssignments);
    }
    if (edit.locks) {
      o.setLocks(nextLocks);
      void o.persistLocks(nextLocks);
    }
    if (edit.leaveEntries) {
      o.setLeaveEntries(nextLeave);
      void o.persistLeave(nextLeave);
    }
    if (validationTimerRef.current) clearTimeout(validationTimerRef.current);
    validationTimerRef.current = setTimeout(
      () => o.runValidation(sched, nextAssignments, { locks: nextLocks, leaveEntries: nextLeave }),
      300
    );
  };

  // Undo / Redo: a step restores shifts, pinned days and leave together, and
  // only ever on the roster it was recorded for.
  const restoreSnapshot = (target: RosterSnapshot) => {
    applyEdit(
      { assignments: target.assignments, locks: target.locks, leaveEntries: target.leaveEntries },
      { recordUndo: false }
    );
  };

  const handleUndo = () => {
    const previous = undoStack[0];
    const now = snapshotNow();
    if (!previous || !now) return;
    if (previous.scheduleId !== now.scheduleId) {
      clearUndo();
      return;
    }
    setRedoStack((prev) => [now, ...prev].slice(0, 50));
    setUndoStack(undoStack.slice(1));
    restoreSnapshot(previous);
    o.toast('Undone.');
  };

  const handleRedo = () => {
    const next = redoStack[0];
    const now = snapshotNow();
    if (!next || !now) return;
    if (next.scheduleId !== now.scheduleId) {
      clearUndo();
      return;
    }
    setUndoStack((prev) => [now, ...prev].slice(0, 50));
    setRedoStack(redoStack.slice(1));
    restoreSnapshot(next);
    o.toast('Redone.');
  };

  // Ctrl/Cmd+Z undoes, Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z redoes (not while typing in a box).
  const undoRedoRef = useRef({ handleUndo, handleRedo, enabled: o.keysEnabled !== false });
  undoRedoRef.current = { handleUndo, handleRedo, enabled: o.keysEnabled !== false };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || !undoRedoRef.current.enabled) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoRedoRef.current.handleUndo();
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault();
        undoRedoRef.current.handleRedo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return { undoStack, redoStack, setUndoStack, setRedoStack, clearUndo, snapshotNow, applyEdit, handleUndo, handleRedo };
}
