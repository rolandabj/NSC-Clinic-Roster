import { useEffect, type RefObject } from 'react';
import type { GridSelection } from './gridSelection';

const cellKeyOf = (nurseId: string, date: string) => `${nurseId}|${date}`;

/**
 * The grid's selection on screen: keyboard focus follows the selected cell while the focus
 * is in the grid, and a request from outside ("Show in grid") selects a cell, scrolls it to
 * the middle of the visible cells, focuses it and flashes it.
 */
export function useGridSelection(o: {
  selection: GridSelection;
  tableRef: RefObject<HTMLTableElement | null>;
  gridScrollRef: RefObject<HTMLDivElement | null>;
  /** Change the nonce to ask again for the same cell. */
  focusRequest?: { nurseId: string; date: string; nonce: number };
  /** Called when a request arrives (the grid closes its right click menu). */
  onRequest: () => void;
}) {
  const { selection, tableRef, gridScrollRef, focusRequest, onRequest } = o;
  // Keyboard focus follows the selection while it is in the grid (arrow keys).
  // (The popup closes when the selection moves away from its cell: the store does that.)
  useEffect(() => {
    let last = selection.getState().selected;
    return selection.subscribe(() => {
      const selectedCell = selection.getState().selected;
      if (selectedCell === last) return;
      last = selectedCell;
      if (!selectedCell) return;
      const active = document.activeElement as HTMLElement | null;
      if (!active || !tableRef.current?.contains(active) || !active.dataset.cell) return;
      const key = cellKeyOf(selectedCell.nurseId, selectedCell.date);
      if (active.dataset.cell === key) return;
      const cell = findCellElement(key);
      if (cell) {
        cell.focus({ preventScroll: true });
        cell.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  }, [selection]);

  const findCellElement = (key: string): HTMLElement | null => {
    const root = tableRef.current;
    if (!root) return null;
    const sel = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(key) : key.replace(/"/g, '\\"');
    return root.querySelector<HTMLElement>(`[data-cell="${sel}"]`);
  };

  // "Go to cell" from outside: select, scroll to the middle, focus and flash.
  useEffect(() => {
    if (!focusRequest) return;
    const { nurseId, date } = focusRequest;
    const key = cellKeyOf(nurseId, date);
    selection.select({ nurseId, date });
    selection.closePopup();
    onRequest();

    let tries = 0;
    let frame = 0;
    let flashTimer: ReturnType<typeof setTimeout> | undefined;
    const attempt = () => {
      const cell = findCellElement(key);
      const box = gridScrollRef.current;
      if (!cell || !box) {
        // The days may still be changing: try again on the next frames.
        if (tries++ < 10) frame = requestAnimationFrame(attempt);
        return;
      }
      // Centre the cell in the part of the grid not covered by the sticky name column and headers.
      const boxRect = box.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();
      const stickyLeft = (tableRef.current?.querySelector('tbody th') as HTMLElement | null)?.offsetWidth || 0;
      const stickyTop = (tableRef.current?.querySelector('thead') as HTMLElement | null)?.offsetHeight || 0;
      const visibleW = boxRect.width - stickyLeft;
      const stickyBottom = (tableRef.current?.querySelector('tfoot') as HTMLElement | null)?.offsetHeight || 0;
      const visibleH = boxRect.height - stickyTop - stickyBottom;
      box.scrollTo({
        left: box.scrollLeft + (cellRect.left - boxRect.left - stickyLeft) - (visibleW - cellRect.width) / 2,
        top: box.scrollTop + (cellRect.top - boxRect.top - stickyTop) - (visibleH - cellRect.height) / 2,
        behavior: 'smooth',
      });
      cell.focus({ preventScroll: true });
      selection.flash(key);
      flashTimer = setTimeout(() => {
        if (selection.getState().flash === key) selection.flash(null);
      }, 1500);
    };
    frame = requestAnimationFrame(attempt);
    return () => {
      cancelAnimationFrame(frame);
      if (flashTimer) clearTimeout(flashTimer);
    };
    // Only a new request (nonce) starts this.
  }, [focusRequest?.nonce]);

  return { findCellElement };
}
