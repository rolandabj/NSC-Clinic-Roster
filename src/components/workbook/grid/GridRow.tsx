import React, { memo } from 'react';
import type { Nurse, SeniorityLevel } from '../../../types';
import type { CellView } from './cellView';
import { GridCell, GridCellActions } from './GridCell';
import type { GridSelection } from './gridSelection';

/** Hours rounded for reading: whole hours, or one decimal when needed. */
const fmtHours = (n: number): string => String(Math.round(n * 10) / 10);

/** How a nurse's hours for the whole roster are shown by their name. */
export function hoursDisplay(totalHours: number, targetHours: number, percent: number) {
  // More than 2 h over in red, more than 2 h short in amber, otherwise green.
  const diff = Math.round((totalHours - targetHours) * 10) / 10;
  const tone: 'none' | 'over' | 'short' | 'ok' = targetHours <= 0 ? 'none' : diff > 2 ? 'over' : diff < -2 ? 'short' : 'ok';
  const hoursNote = targetHours <= 0 ? '' : diff > 0 ? `${fmtHours(diff)} h over` : diff < 0 ? `${fmtHours(-diff)} h short` : 'on goal';
  const hoursLine = targetHours > 0 ? `${fmtHours(totalHours)} / ${fmtHours(targetHours)} h · ${hoursNote}` : `${fmtHours(totalHours)} h`;
  // Bar: when over the goal, the whole bar is the hours worked, the goal
  // part is green and the hours over show as a red segment.
  const overShare = totalHours > targetHours && totalHours > 0 ? (totalHours - targetHours) / totalHours : 0;
  const fillPercent = overShare > 0 ? 100 - overShare * 100 : Math.min(100, Math.max(0, percent));
  return { tone, hoursNote, hoursLine, overShare, fillPercent };
}

/**
 * Each nurse's cells in the order of the days shown. A row whose cells are all the same
 * objects as before keeps its old list, so the memoized row is not drawn again.
 */
export function rowViewsOf(
  views: Map<string, CellView>,
  nurseIds: readonly string[],
  dates: readonly string[],
  previous?: Map<string, CellView[]>
): Map<string, CellView[]> {
  const rows = new Map<string, CellView[]>();
  for (const id of nurseIds) {
    const row = dates.map((d) => views.get(`${id}|${d}`)!);
    const old = previous?.get(id);
    rows.set(id, old && old.length === row.length && old.every((v, i) => v === row[i]) ? old : row);
  }
  return rows;
}

/**
 * Joins a nurse's problem messages into one text value (`problems`), which the row splits
 * again by this character. It is a control character, so no problem message contains it.
 */
export const PROBLEM_SEPARATOR = '\u001f';

/** The actions of a row: the cells' actions, and opening the Problems panel from the name's mark. */
export interface GridRowActions extends GridCellActions {
  openProblems: () => void;
}

interface GridRowProps {
  nurse: Nurse;
  seniority?: SeniorityLevel;
  /** This nurse's cells, in the order of the days shown. */
  views: CellView[];
  totalHours: number;
  targetHours: number;
  percent: number;
  /** Hours inside the days shown. */
  blockTotal: number;
  blockDuty: number;
  blockLeave: number;
  /** The roster check's problems about this nurse (not one cell), joined by `PROBLEM_SEPARATOR`; '' for none. */
  problems: string;
  problemMustFix: boolean;
  showProblems: boolean;
  heightClass: string;
  fontClass: string;
  selection: GridSelection;
  actions: GridRowActions;
}

/**
 * One nurse's row: their name, seniority and hours, their cells, and their hours on the
 * days shown. Its props are plain values and lists kept while unchanged, so an edit draws
 * again only the rows it changed.
 */
export const GridRow = memo(function GridRow({
  nurse,
  seniority,
  views,
  totalHours,
  targetHours,
  percent,
  blockTotal,
  blockDuty,
  blockLeave,
  problems: problemText,
  problemMustFix,
  showProblems,
  heightClass,
  fontClass,
  selection,
  actions,
}: GridRowProps) {
  const hasPhl = nurse.capabilityIds?.includes('role-phl');
  const { tone, hoursNote, hoursLine, overShare, fillPercent } = hoursDisplay(totalHours, targetHours, percent);
  const toneText =
    tone === 'over' ? 'text-rose-700 font-semibold' : tone === 'ok' ? 'text-emerald-700' : tone === 'short' ? 'text-amber-700' : 'text-slate-600';
  const barColor = tone === 'short' ? 'bg-amber-500' : 'bg-emerald-500';
  const problems = problemText ? problemText.split(PROBLEM_SEPARATOR) : [];

  return (
    <tr className="hover:bg-slate-50/60">
      {/* Sticky Left Column: Nurse, seniority and hours */}
      <th
        scope="row"
        className="sticky left-0 bg-white z-20 border-r-2 border-slate-300 py-1 px-2.5 text-left font-normal w-60 min-w-60 max-w-60 shadow-xs"
        title={`${nurse.fullName}${seniority ? ` · ${seniority.name}` : ''} · ${nurse.contractPercent}% of full time · Whole roster: ${hoursLine}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-slate-900 truncate text-xs font-sans">{nurse.fullName}</span>
          {seniority && (
            <span
              className="text-[10px] font-medium px-1 rounded shrink-0 font-sans"
              style={{ backgroundColor: `${seniority.color}15`, color: seniority.color }}
            >
              {seniority.name}
            </span>
          )}
          {nurse.contractPercent !== 100 && (
            <span className="text-[10px] text-slate-500 shrink-0 font-sans">{nurse.contractPercent}% time</span>
          )}
          {showProblems && problems.length > 0 && (
            <button
              type="button"
              onClick={actions.openProblems}
              title={problems.join('\n')}
              aria-label={`${problems.length} problem${problems.length === 1 ? '' : 's'} for ${nurse.fullName}: ${problems.join('. ')}`}
              className={`shrink-0 flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold font-sans cursor-pointer ${
                problemMustFix ? 'bg-rose-600 text-white' : 'bg-amber-400 text-amber-950'
              }`}
            >
              {problems.length}
            </button>
          )}
          {hasPhl && (
            <span title="Blood collection and IV nurse" className="text-rose-600 text-xs font-bold shrink-0 ml-auto">
              🩸
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[11px] font-sans whitespace-nowrap ${toneText}`}>{hoursLine}</span>
          {targetHours > 0 && (
            <div
              className="flex-1 min-w-8 h-1.5 rounded bg-slate-100 overflow-hidden flex"
              role="img"
              aria-label={`${fmtHours(totalHours)} of ${fmtHours(targetHours)} hours, ${hoursNote}`}
            >
              <div className={`h-full ${barColor}`} style={{ width: `${fillPercent}%` }} />
              {overShare > 0 && <div className="h-full bg-rose-500" style={{ width: `${overShare * 100}%` }} />}
            </div>
          )}
        </div>
      </th>

      {/* Matrix Cells */}
      {views.map((view) => (
        <GridCell
          key={view.date}
          view={view}
          selection={selection}
          showProblems={showProblems}
          heightClass={heightClass}
          fontClass={fontClass}
          actions={actions}
        />
      ))}

      {/* Hours inside the days shown */}
      <td
        className="py-1 px-2 text-center text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200"
        title={`These days: ${fmtHours(blockDuty)} h shifts + ${fmtHours(blockLeave)} h leave. Whole roster: ${hoursLine}`}
      >
        <span>{fmtHours(blockTotal)} h</span>
        <span className="block text-[10px] font-normal text-slate-500">{fmtHours(totalHours)} h in all</span>
      </td>
    </tr>
  );
});
