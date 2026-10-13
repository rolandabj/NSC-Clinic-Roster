import type React from 'react';
import { useEffect, useRef } from 'react';
import { moveSelection, type GridSelection } from './gridSelection';

/** What a key does to the selected cell. */
type CellAction = (nurseId: string, date: string) => void;

/**
 * The grid's keys. Returns the `onKeyDown` for the grid; the hook also listens on the page,
 * for keys pressed while nothing has the focus.
 */
export function useGridKeyboard(o: {
  selection: GridSelection;
  /** False while another sheet is open or the full editor is: the grid takes no keys. */
  enabled: boolean;
  /** The nurses and days shown, in order. */
  nurseIds: string[];
  dates: string[];
  onEnter: CellAction;
  onSpace: CellAction;
  onDelete: CellAction;
  onCopy: CellAction;
  onPaste: CellAction;
}) {
  const { selection } = o;
  // Keyboard navigation (arrows, Tab, Enter, Space, Delete, copy and paste). The keys are
  // handled on the grid itself (`onKeyDown` below), and on the page only while nothing has
  // the focus (for example after a dialog closed), as before. One listener for the life of
  // the grid, reading the latest state through a ref, instead of one added after every render.
  const handleGridKey = (e: KeyboardEvent | React.KeyboardEvent) => {
    if (!o.enabled) return;
    const { selected: selectedCell, popup } = selection.getState();
    if (!selectedCell) return;
    // A dialog (e.g. the clear cell confirmation) is open: its keys are its own.
    if (document.querySelector('[aria-modal="true"]')) return;

    // Never take over keys while the user is typing somewhere else (search boxes,
    // other sheets, dialogs) or while a button or link has keyboard focus.
    const target = e.target as HTMLElement | null;
    const tag = target?.tagName;
    // Tab from the cell with the popup open goes into the popup.
    if (e.key === 'Tab' && !e.shiftKey && popup && target?.dataset?.cell) {
      const first = document.querySelector<HTMLElement>('[data-quick-popup] button');
      if (first) {
        e.preventDefault();
        first.focus();
        return;
      }
    }
    if (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target?.isContentEditable ||
      (e.key === 'Tab' && target && target !== document.body) ||
      // Enter, Space and Delete on a focused button or link belong to it, not to the grid.
      (target && target !== document.body && !!target.closest('button, a[href], [role="button"]'))
    ) {
      return;
    }

    const moved = moveSelection(selectedCell, e, o.nurseIds, o.dates);
    if (moved) {
      e.preventDefault();
      selection.select(moved);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      o.onEnter(selectedCell.nurseId, selectedCell.date);
    } else if (e.key === ' ') {
      // Space opens the small popup with its quick choices.
      e.preventDefault();
      o.onSpace(selectedCell.nurseId, selectedCell.date);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      o.onDelete(selectedCell.nurseId, selectedCell.date);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      o.onCopy(selectedCell.nurseId, selectedCell.date);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      o.onPaste(selectedCell.nurseId, selectedCell.date);
    }
  };
  const gridKeyRef = useRef(handleGridKey);
  gridKeyRef.current = handleGridKey;
  useEffect(() => {
    const onPageKey = (e: KeyboardEvent) => {
      if (e.target === document.body) gridKeyRef.current(e);
    };
    window.addEventListener('keydown', onPageKey);
    return () => window.removeEventListener('keydown', onPageKey);
  }, []);

  return (e: React.KeyboardEvent) => gridKeyRef.current(e);
}
