/**
 * The roster grid's selected cell, its popup and the cell flashed after "Show in grid",
 * kept outside React's state in a small store. Each cell listens for its own key only,
 * so a key press or a click draws again the cells whose look changes (usually two),
 * not the whole grid.
 */

export interface CellRef {
  nurseId: string;
  date: string;
}

export interface PopupRef extends CellRef {
  /** Move keyboard focus into the popup when it opens (opened from the keyboard). */
  focusOnOpen: boolean;
}

export interface GridSelectionState {
  selected: CellRef | null;
  popup: PopupRef | null;
  /** The key of the cell flashing after "Show in grid". */
  flash: string | null;
}

/** What a cell shows of the selection, as flags in one number. */
export const CELL_SELECTED = 1;
/** The one cell the Tab key reaches. */
export const CELL_TAB_STOP = 2;
export const CELL_POPUP = 4;
export const CELL_FLASH = 8;

/**
 * The hours column and the day totals row, reached by the arrow keys like the cells (Phase 4,
 * slice 4): `${nurseId}|hours` is a nurse's hours, `totals|${date}` a day's totals.
 */
export const HOURS_COLUMN = 'hours';
export const TOTALS_ROW = 'totals';

/** A nurse's day, which can be changed (not their hours, nor a day's totals). */
export const isRosterCell = (c: CellRef) => c.nurseId !== TOTALS_ROW && c.date !== HOURS_COLUMN;

const keyOf = (c: CellRef | null) => (c ? `${c.nurseId}|${c.date}` : null);
const sameCell = (a: CellRef | null, b: CellRef | null) => a?.nurseId === b?.nurseId && a?.date === b?.date;

export interface GridSelection {
  getState(): GridSelectionState;
  /** Called after any change. */
  subscribe(listener: () => void): () => void;
  /** Called when the look of this one cell may have changed. */
  subscribeCell(key: string, listener: () => void): () => void;
  flagsOf(key: string): number;
  /** Select a cell (or none). A popup on another cell closes. */
  select(cell: CellRef | null): void;
  /** Select the cell and open its popup. */
  openPopup(popup: PopupRef): void;
  closePopup(): void;
  flash(key: string | null): void;
  /**
   * The days and nurses shown: the first cell (the Tab stop when the selection is not
   * shown) and the keys shown. Safe to call while the grid draws: it tells no one until
   * `flushLayout`, which the grid calls once the cells are on screen.
   */
  setLayout(firstKey: string | null, shownKeys: ReadonlySet<string>): void;
  flushLayout(): void;
}

export function createGridSelection(): GridSelection {
  let state: GridSelectionState = { selected: null, popup: null, flash: null };
  let firstKey: string | null = null;
  let shown: ReadonlySet<string> = new Set();
  const listeners = new Set<() => void>();
  const cellListeners = new Map<string, Set<() => void>>();
  // Cells whose Tab stop changed with a layout, told at the next flush.
  const pending = new Set<string>();

  const tabStopKey = (s: GridSelectionState): string | null => {
    const sel = keyOf(s.selected);
    return sel && shown.has(sel) ? sel : firstKey;
  };

  const flagsIn = (s: GridSelectionState, key: string): number =>
    (keyOf(s.selected) === key ? CELL_SELECTED : 0) |
    (tabStopKey(s) === key ? CELL_TAB_STOP : 0) |
    (keyOf(s.popup) === key ? CELL_POPUP : 0) |
    (s.flash === key ? CELL_FLASH : 0);

  const tellCell = (key: string) => cellListeners.get(key)?.forEach((l) => l());

  const update = (next: GridSelectionState) => {
    const before = state;
    if (sameCell(before.selected, next.selected) && sameCell(before.popup, next.popup) && before.popup?.focusOnOpen === next.popup?.focusOnOpen && before.flash === next.flash) {
      return;
    }
    const candidates = new Set(
      [keyOf(before.selected), keyOf(next.selected), keyOf(before.popup), keyOf(next.popup), before.flash, next.flash, tabStopKey(before), tabStopKey(next)].filter(
        (k): k is string => !!k
      )
    );
    state = next;
    for (const k of candidates) if (flagsIn(before, k) !== flagsIn(next, k)) tellCell(k);
    listeners.forEach((l) => l());
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    subscribeCell(key, listener) {
      let set = cellListeners.get(key);
      if (!set) cellListeners.set(key, (set = new Set()));
      set.add(listener);
      return () => {
        set!.delete(listener);
        if (set!.size === 0) cellListeners.delete(key);
      };
    },
    flagsOf: (key) => flagsIn(state, key),
    select(cell) {
      const selected = cell ? { nurseId: cell.nurseId, date: cell.date } : null;
      // The popup belongs to one cell: moving the selection away closes it.
      update({ ...state, selected, popup: sameCell(state.popup, selected) ? state.popup : null });
    },
    openPopup(popup) {
      update({ ...state, selected: { nurseId: popup.nurseId, date: popup.date }, popup: { ...popup } });
    },
    closePopup() {
      update({ ...state, popup: null });
    },
    flash(key) {
      update({ ...state, flash: key });
    },
    setLayout(first, keys) {
      const before = tabStopKey(state);
      firstKey = first;
      shown = keys;
      const after = tabStopKey(state);
      if (before !== after) {
        if (before) pending.add(before);
        if (after) pending.add(after);
      }
    },
    flushLayout() {
      const keys = [...pending];
      pending.clear();
      keys.forEach(tellCell);
    },
  };
}

/**
 * Where an arrow key or Tab moves the selection: one cell, staying put at the edge and before
 * the empty corner under the hours column. The lists may end with `TOTALS_ROW` and
 * `HOURS_COLUMN`. Undefined for any other key.
 */
export function moveSelection(
  current: CellRef,
  e: { key: string; shiftKey: boolean },
  nurseIds: readonly string[],
  dates: readonly string[]
): CellRef | undefined {
  const row = nurseIds.indexOf(current.nurseId);
  const col = dates.indexOf(current.date);
  const corner = (c: CellRef) => c.nurseId === TOTALS_ROW && c.date === HOURS_COLUMN;
  const toDate = (i: number) => (i >= 0 && i < dates.length && !corner({ nurseId: current.nurseId, date: dates[i] }) ? { nurseId: current.nurseId, date: dates[i] } : current);
  const toNurse = (i: number) => (i >= 0 && i < nurseIds.length && !corner({ nurseId: nurseIds[i], date: current.date }) ? { nurseId: nurseIds[i], date: current.date } : current);
  if (e.key === 'Tab') return toDate(e.shiftKey ? col - 1 : col + 1);
  if (e.key === 'ArrowRight') return toDate(col + 1);
  if (e.key === 'ArrowLeft') return toDate(col - 1);
  if (e.key === 'ArrowDown') return toNurse(row + 1);
  if (e.key === 'ArrowUp') return toNurse(row - 1);
  return undefined;
}
