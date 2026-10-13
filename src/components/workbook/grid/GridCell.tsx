import React, { memo, useCallback, useSyncExternalStore } from 'react';
import { Clock, Pencil, Pin } from 'lucide-react';
import { PROBLEM_MARKS } from '../../ui';
import type { CellView } from './cellView';
import { CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, GridSelection } from './gridSelection';

/** What a cell does when it is clicked or focused. The grid passes one object that never changes. */
export interface GridCellActions {
  click: (nurseId: string, date: string) => void;
  doubleClick: (nurseId: string, date: string) => void;
  contextMenu: (e: React.MouseEvent, nurseId: string, date: string) => void;
  select: (nurseId: string, date: string) => void;
}

interface GridCellProps {
  view: CellView;
  /** The grid's selection, popup and flash; the cell listens for its own key only. */
  selection: GridSelection;
  /** The Problem marks switch. */
  showProblems: boolean;
  heightClass: string;
  fontClass: string;
  actions: GridCellActions;
}

/** A cell's flags (selected, Tab stop, popup, flash), redrawing it only when they change. */
export function useCellFlags(selection: GridSelection, key: string): number {
  const subscribe = useCallback((listener: () => void) => selection.subscribeCell(key, listener), [selection, key]);
  return useSyncExternalStore(subscribe, () => selection.flagsOf(key));
}

/** The look of a selected cell, and of the focus ring of one that is not. */
export const SELECTED_CELL = 'outline-3 -outline-offset-3 outline-brand z-10 bg-brand-soft';
export const FOCUS_CELL = 'focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-brand';

/**
 * One roster grid cell. Its props are plain values and a view worked out in advance, and it
 * reads its own part of the selection from the store, so it is drawn again only when what it
 * shows changes or it gains or loses the selection, the popup or the flash.
 */
export const GridCell = memo(function GridCell({
  view,
  selection,
  showProblems,
  heightClass,
  fontClass,
  actions,
}: GridCellProps) {
  const { nurseId, date, key } = view;
  const flags = useCellFlags(selection, key);
  const isSelected = (flags & CELL_SELECTED) !== 0;
  const isTabStop = (flags & CELL_TAB_STOP) !== 0;
  const isPopupCell = (flags & CELL_POPUP) !== 0;
  const isFlashing = (flags & CELL_FLASH) !== 0;
  const hasViolation = showProblems && view.hasProblems;
  // Leave waiting for approval: diagonal stripes behind whatever the cell shows.
  const pendingHatch = view.hasPendingLeave
    ? `repeating-linear-gradient(135deg, ${view.pendingLeaveColor}40 0 3px, transparent 3px 7px)`
    : undefined;
  const flagged = (hasViolation && view.problemKind === 'must') || view.mismatch;

  const ProblemIcon = hasViolation && view.problemKind !== 'none' ? PROBLEM_MARKS[view.problemKind].icon : null;
  const boxed = view.content !== 'empty';

  return (
    <td
      data-cell={view.key}
      tabIndex={isTabStop ? 0 : -1}
      onClick={() => actions.click(nurseId, date)}
      onDoubleClick={() => actions.doubleClick(nurseId, date)}
      onContextMenu={(e) => actions.contextMenu(e, nurseId, date)}
      onFocus={() => {
        if (!isSelected) actions.select(nurseId, date);
      }}
      aria-selected={isSelected}
      aria-haspopup="dialog"
      aria-expanded={isPopupCell}
      aria-label={view.ariaLabel}
      title={view.title}
      style={pendingHatch ? { backgroundImage: pendingHatch } : undefined}
      className={`border-r border-b border-line p-0.5 align-middle cursor-pointer relative ${fontClass} ${
        boxed ? 'text-left' : 'text-center text-slate-400'
      } ${
        isFlashing
          ? 'outline-3 -outline-offset-3 outline-amber-400 z-10 bg-amber-50'
          : isSelected
          ? SELECTED_CELL
          : `${view.dayShade} hover:bg-sunken ${FOCUS_CELL}`
      }`}
    >
      {/* Request mark, top right: round for a day off, square for a shift; hollow while waiting for approval; amber when not followed. */}
      {view.requestMark !== 'none' && (
        <span
          aria-hidden="true"
          className={`absolute top-1 right-1 size-1.5 pointer-events-none border ${view.requestMark === 'dayOff' ? 'rounded-full' : 'rounded-[1px]'} ${
            view.requestMismatch
              ? view.requestPending
                ? 'border-amber-500 bg-white'
                : 'border-amber-500 bg-amber-500'
              : view.requestPending
              ? 'border-sky-600 bg-white'
              : 'border-sky-600 bg-sky-600'
          }`}
        />
      )}
      {boxed ? (
        // The doctor's first name or the role (or the leave) on the first line; the start time and the marks on the second; the end time on the third.
        <div
          // A small grid: the name (cut short when long) and the rank side by side, so the rank always shows; the second line under both.
          className={`${heightClass} grid grid-cols-[minmax(0,1fr)_auto] content-center items-baseline gap-x-0.5 rounded-sm px-1 leading-tight ${
            view.content === 'off'
              ? 'bg-sunken text-ink-muted'
              : view.content === 'pendingLeave'
              ? 'border border-dashed text-ink-muted'
              : 'border-l-3 text-ink'
          } ${flagged ? 'ring-1 ring-inset ring-danger' : ''}`}
          style={
            view.content === 'pendingLeave'
              ? { borderColor: view.pendingLeaveColor }
              : view.color
              ? { backgroundColor: view.fill, borderLeftColor: view.color }
              : undefined
          }
        >
          {/* No wrapper round the first line (fewer elements: a full size roster has over 1,000 shifts). */}
          <span className={`truncate font-semibold ${view.rankBadge ? '' : 'col-span-2'}`}>
            {view.content === 'leave' ? view.leaveAcronym : view.content === 'off' ? 'Day off' : view.content === 'pendingLeave' ? view.pendingLeaveAcronym : view.label}
          </span>
          {/* Spaces between the parts, so the text reads as the spoken name does ("Lee #1 09:00"); the grid does not show them. */}
          {view.rankBadge && ' '}
          {view.rankBadge && (
            <span className={`rounded-sm text-[0.75em] font-bold ${view.rankBadge === '!' ? 'px-0.5 bg-danger-soft text-danger' : 'text-ink-muted'}`}>{view.rankBadge}</span>
          )}{' '}
          {(view.startTime || view.pinned || view.handChange || view.pendingMark || ProblemIcon) && (
            // The problem's icon first, so a narrow cell (75 % zoom) cuts off the time, not the problem.
            <span className="col-span-2 flex items-center gap-0.5 overflow-hidden whitespace-nowrap text-ink-muted tabular-nums" aria-hidden="true">
              {ProblemIcon && <ProblemIcon className={`size-3 shrink-0 ${PROBLEM_MARKS[view.problemKind as 'must' | 'check'].text}`} />}
              {view.startTime}
              {view.pinned && <Pin className="size-3 shrink-0 text-brand-strong" />}
              {view.handChange && !view.pinned && <Pencil className="size-3 shrink-0" />}
              {view.pendingMark && <Clock className="size-3 shrink-0" />}
            </span>
          )}
          {/* The end time on a third line (the owner's choice of 13-10-2026); a space before it, as in the spoken name ("09:00 17:00"). */}
          {view.endTime && ' '}
          {view.endTime && (
            <span className="col-span-2 text-ink-muted tabular-nums" aria-hidden="true">
              {view.endTime}
            </span>
          )}
        </div>
      ) : (
        // An empty cell: a dash; with a problem, its icon instead.
        ProblemIcon ? (
          <ProblemIcon aria-hidden="true" className={`mx-auto size-3.5 ${PROBLEM_MARKS[view.problemKind as 'must' | 'check'].text}`} />
        ) : (
          '—'
        )
      )}
    </td>
  );
});
