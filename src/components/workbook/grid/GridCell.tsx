import React, { memo } from 'react';
import { Clock, Edit2, Lock } from 'lucide-react';
import type { CellView } from './cellView';

/** What a cell does when it is clicked or focused. The grid passes one object that never changes. */
export interface GridCellActions {
  click: (nurseId: string, date: string) => void;
  doubleClick: (nurseId: string, date: string) => void;
  contextMenu: (e: React.MouseEvent, nurseId: string, date: string) => void;
  select: (nurseId: string, date: string) => void;
}

interface GridCellProps {
  view: CellView;
  isSelected: boolean;
  /** The one cell the Tab key reaches. */
  isTabStop: boolean;
  isFlashing: boolean;
  isPopupCell: boolean;
  /** The Problem marks switch. */
  showProblems: boolean;
  heightClass: string;
  fontClass: string;
  actions: GridCellActions;
}

/**
 * One roster grid cell. Its props are plain values and a view worked out in advance,
 * so it is drawn again only when what it shows changes, not on every key press.
 */
export const GridCell = memo(function GridCell({
  view,
  isSelected,
  isTabStop,
  isFlashing,
  isPopupCell,
  showProblems,
  heightClass,
  fontClass,
  actions,
}: GridCellProps) {
  const { nurseId, date } = view;
  const hasViolation = showProblems && view.hasProblems;
  // Leave waiting for approval: diagonal stripes behind whatever the cell shows.
  const pendingHatch = view.hasPendingLeave
    ? `repeating-linear-gradient(135deg, ${view.pendingLeaveColor}40 0 3px, transparent 3px 7px)`
    : undefined;
  const flagged = hasViolation || view.mismatch;
  const plainShift = !flagged && !view.isNurseClinic && !view.isFloatPool;

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
      className={`border-r border-b border-slate-200 p-0.5 text-center align-middle cursor-pointer relative transition-shadow duration-700 focus:outline-none ${fontClass} ${
        view.isToday ? 'border-x-indigo-300' : ''
      } ${
        isFlashing
          ? 'ring-4 ring-amber-400 z-10 bg-amber-50 duration-150'
          : isSelected
          ? 'ring-2 ring-indigo-600 z-10 bg-indigo-50/50'
          : `${view.dayShade} hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-400`
      }`}
    >
      {/* Problem marker: small red corner */}
      {hasViolation && (
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 w-0 h-0 border-t-8 border-l-8 border-t-red-600 border-l-transparent z-10 pointer-events-none"
        />
      )}
      {/* Request mark, top left: round for a day off, square for a shift; hollow while waiting for approval; amber when not followed. */}
      {view.requestMark !== 'none' && (
        <span
          aria-hidden="true"
          className={`absolute top-0.5 left-0.5 w-1.5 h-1.5 z-10 pointer-events-none border ${
            view.requestMark === 'dayOff' ? 'rounded-full' : 'rounded-[1px]'
          } ${
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
      {/* Leave waiting for approval under a shift or a pinned day off */}
      {view.pendingMark && (
        <Clock aria-hidden="true" className="absolute bottom-0.5 left-0.5 w-2 h-2 z-10 pointer-events-none text-slate-600" />
      )}
      {view.content === 'leave' ? (
        <div
          className={`w-full ${heightClass} rounded flex items-center justify-center gap-0.5 font-bold text-white shadow-2xs`}
          style={{ backgroundColor: view.leaveColor }}
        >
          <span>{view.leaveAcronym}</span>
          {view.pinned && <Lock className="w-2.5 h-2.5 text-white" aria-hidden="true" />}
        </div>
      ) : view.content === 'off' ? (
        <div
          className={`w-full ${heightClass} rounded border border-dashed border-amber-400 bg-amber-50 flex items-center justify-center font-bold text-amber-900 text-[10px]`}
        >
          <Lock className="w-2.5 h-2.5 text-amber-600 mr-0.5" aria-hidden="true" />
          <span>OFF</span>
        </div>
      ) : view.content === 'shift' ? (
        // A shift: the shift's letters and who it is with
        <div
          className={`w-full ${heightClass} rounded flex flex-col items-center justify-center leading-none px-0.5 border ${
            flagged
              ? 'ring-1.5 ring-rose-500 border-rose-400 bg-rose-50/70 shadow-xs'
              : view.isNurseClinic
              ? 'bg-teal-50/70 border-teal-300'
              : view.isFloatPool
              ? 'bg-indigo-50/40 border-indigo-200'
              : ''
          }`}
          style={{
            backgroundColor: plainShift ? `${view.dutyColor || '#3b82f6'}18` : undefined,
            borderColor: plainShift ? view.dutyColor || '#3b82f6' : undefined,
          }}
        >
          <div className="flex items-center gap-0.5">
            <span
              className={`font-bold text-[10px] ${view.isNurseClinic ? 'text-teal-800' : ''}`}
              style={{ color: view.isNurseClinic ? undefined : view.dutyColor || '#1e40af' }}
            >
              {view.dutyAcronym}
            </span>
            {view.dutyPriority && (
              <span className="text-[10px] text-amber-500 font-bold leading-none" aria-hidden="true">
                ★
              </span>
            )}
            {view.pinned && <Lock className="w-2.5 h-2.5 text-amber-600" aria-hidden="true" />}
            {view.handChange && !view.pinned && <Edit2 className="w-2.5 h-2.5 text-slate-500" aria-hidden="true" />}
          </div>
          <div className="flex items-center gap-0.5 max-w-[48px] justify-center">
            <span
              className={`text-[10px] font-semibold truncate ${
                view.mismatch
                  ? 'text-rose-900 font-bold'
                  : view.isNurseClinic
                  ? 'text-teal-900 font-bold bg-teal-100/80 px-1 py-0.2 rounded border border-teal-300'
                  : view.isFloatPool
                  ? 'text-indigo-800 font-bold'
                  : 'text-slate-700'
              }`}
            >
              {view.label}
            </span>
            {view.rankBadge && (
              <span
                aria-hidden="true"
                className={`text-[10px] font-bold px-0.5 rounded leading-none shrink-0 ${
                  view.rankBadge === '!'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 font-extrabold'
                    : view.rankBadge === '#1'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : view.rankBadge === '#2'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {view.rankBadge}
              </span>
            )}
          </div>
        </div>
      ) : view.content === 'pendingLeave' ? (
        // Leave waiting for approval (shown lighter, on stripes)
        <div
          className={`w-full ${heightClass} rounded border border-dashed flex items-center justify-center font-bold text-[10px] opacity-80`}
          style={{ borderColor: view.pendingLeaveColor, color: view.pendingLeaveColor }}
          aria-hidden="true"
        >
          <span className="bg-white/80 px-0.5 rounded">{view.pendingLeaveAcronym}</span>
        </div>
      ) : (
        // An empty cell
        <div className={`w-full ${heightClass} flex items-center justify-center text-slate-300`} aria-hidden="true">
          —
        </div>
      )}
    </td>
  );
});
