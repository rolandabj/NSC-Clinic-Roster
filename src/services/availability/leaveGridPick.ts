/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The leave grid without dragging (UI overhaul Phase 6, slice 5; WCAG 2.5.7): the first
 * click on a day starts the leave, the second on the same nurse's row ends it, and the
 * arrow keys move between days.
 */

export interface GridCell {
  nurseId: string;
  day: number;
}

/** What one click does: start a leave, or end the one started and give its days. */
export function pickStep(start: GridCell | null, cell: GridCell): { start: GridCell | null; range?: { nurseId: string; from: number; to: number } } {
  if (!start || start.nurseId !== cell.nurseId) return { start: cell };
  return { start: null, range: { nurseId: cell.nurseId, from: Math.min(start.day, cell.day), to: Math.max(start.day, cell.day) } };
}

/** Where a key moves from row `row` and column `col`, or null for keys the grid does not use. */
export function moveInGrid(row: number, col: number, key: string, rows: number, cols: number): [number, number] | null {
  switch (key) {
    case 'ArrowRight':
      return [row, Math.min(cols - 1, col + 1)];
    case 'ArrowLeft':
      return [row, Math.max(0, col - 1)];
    case 'ArrowDown':
      return [Math.min(rows - 1, row + 1), col];
    case 'ArrowUp':
      return [Math.max(0, row - 1), col];
    case 'Home':
      return [row, 0];
    case 'End':
      return [row, cols - 1];
    default:
      return null;
  }
}
