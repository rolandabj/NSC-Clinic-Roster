import React, { type Ref } from 'react';
import { Check, Clock, OctagonAlert, Stethoscope, TriangleAlert, Users } from 'lucide-react';
import type { Nurse, PublicHoliday, SeniorityLevel } from '../../../types';
import type { NurseHoursSummary } from '../../../services/reports/hoursAccounting';
import { formatDate } from '../../../utils/dateUtils';
import type { CellView } from './cellView';
import { dayTotalWords, type DayTotal } from './dayTotals';
import { FOCUS_CELL, SELECTED_CELL, useCellFlags } from './GridCell';
import { GridRow, PROBLEM_SEPARATOR, type GridRowActions } from './GridRow';
import { CELL_SELECTED, CELL_TAB_STOP, TOTALS_ROW, type GridSelection } from './gridSelection';

const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** The widths of the nurse column and the hours column, in pixels. */
const NAME_COLUMN = 240;
const HOURS_COLUMN_WIDTH = 104;

/** One day column of the grid. */
export interface DayColumn {
  dateStr: string;
  /** Day of the month. */
  day: number;
  /** 0 is Sunday. */
  weekday: number;
  isWeekend: boolean;
  holiday?: PublicHoliday;
  isToday: boolean;
}

/** Problems shown as one mark (a day's heading, a nurse's name): their messages, and whether one is Must fix. */
export interface ProblemMark {
  messages: string[];
  mustFix: boolean;
}

interface GridTableProps {
  tableRef: Ref<HTMLTableElement>;
  dayInfo: DayColumn[];
  blockDates: string[];
  isAllDaysExpanded: boolean;
  totalDays: number;
  currentBlockIndex: number;
  blockWeeks: number;
  displayNurses: Nurse[];
  /** How many of the nurses' rows are drawn so far (`useRowsInSteps`). */
  rowLimit: number;
  seniorityMap: Map<string, SeniorityLevel>;
  rowViews: Map<string, CellView[]>;
  hoursByNurse: Map<string, NurseHoursSummary>;
  blockHoursByNurse: Map<string, NurseHoursSummary>;
  dayProblems: Map<string, ProblemMark>;
  nurseProblems: Map<string, ProblemMark>;
  dayTotals: Map<string, DayTotal>;
  /** The Problem marks switch. */
  showProblems: boolean;
  heightClass: string;
  fontClass: string;
  /** The day columns' width in pixels, by the zoom. */
  dayWidth: number;
  selection: GridSelection;
  actions: GridRowActions;
}

/** The roster grid's table: the week and day headings, one row for each nurse, and the day totals. */
export const GridTable: React.FC<GridTableProps> = ({
  tableRef,
  dayInfo,
  blockDates,
  isAllDaysExpanded,
  totalDays,
  currentBlockIndex,
  blockWeeks,
  displayNurses,
  rowLimit,
  seniorityMap,
  rowViews,
  hoursByNurse,
  blockHoursByNurse,
  dayProblems,
  nurseProblems,
  dayTotals,
  showProblems,
  heightClass,
  fontClass,
  dayWidth,
  selection,
  actions,
}) => (
    // Fixed column widths: the browser does not measure every cell to size the columns, which
    // took a large part of the longest task while a full size roster loads (Phase 4, slice 4).
    <table
      ref={tableRef}
      className="table-fixed border-collapse bg-white text-xs"
      style={{ width: NAME_COLUMN + dayInfo.length * dayWidth + HOURS_COLUMN_WIDTH }}
      role="grid"
      aria-label="Nurse roster"
    >
      <colgroup>
        <col style={{ width: NAME_COLUMN }} />
        {dayInfo.map((d) => (
          <col key={d.dateStr} style={{ width: dayWidth }} />
        ))}
        <col style={{ width: HOURS_COLUMN_WIDTH }} />
      </colgroup>
      {/* Sticky Header Row 1: Week Spans */}
      <thead className="sticky top-0 z-30 bg-slate-100 border-b border-slate-300">
        <tr className="border-b border-slate-200">
          <th
            className="sticky left-0 bg-slate-100 z-40 border-r-2 border-slate-300 py-1 px-3 text-left font-semibold text-slate-700 text-xs shadow-xs"
          >
            Nurses
          </th>
          <th
            colSpan={blockDates.length}
            className="py-1 px-2 text-center font-sans text-xs text-ink-muted bg-slate-100 border-r border-slate-300"
          >
            {isAllDaysExpanded ? (
              <span className="font-bold text-indigo-700">All {totalDays} days of the roster</span>
            ) : (
              <span>
                Weeks {currentBlockIndex * blockWeeks + 1} to{' '}
                {Math.min((currentBlockIndex + 1) * blockWeeks, Math.ceil(totalDays / 7))}
              </span>
            )}
          </th>
          <th className="py-1 px-2 text-center font-sans text-xs text-ink-muted bg-slate-100">
            These days
          </th>
        </tr>

        {/* Sticky Header Row 2: Day-name + Date */}
        <tr className="bg-slate-50 text-slate-700">
          {/* Sticky Left Column: Nurse, seniority and hours */}
          <th className="sticky left-0 bg-slate-50 z-40 border-r-2 border-slate-300 py-1.5 px-3 text-left font-semibold text-slate-800 w-60 min-w-60 max-w-60 shadow-xs">
            <span className="block">Nurse</span>
            <span className="block text-xs font-normal text-ink-muted">Hours worked / goal for the whole roster</span>
          </th>

          {/* Date columns: the weekday small, the day's number; weekends and holidays shaded, today in brand */}
          {dayInfo.map(({ dateStr, day, weekday, isWeekend, holiday, isToday }) => (
            <th
              key={dateStr}
              scope="col"
              title={`${WEEKDAY_ABBR[weekday]} ${formatDate(dateStr)}${isToday ? ' · Today' : ''}${holiday ? ` · Public holiday: ${holiday.name}` : isWeekend ? ' · Weekend' : ''}`}
              aria-label={`${WEEKDAY_ABBR[weekday]} ${formatDate(dateStr)}${isToday ? ', today' : ''}${holiday ? `, public holiday: ${holiday.name}` : isWeekend ? ', weekend' : ''}`}
              className={`relative py-1 px-1 text-center font-sans border-r border-line ${
                holiday ? 'bg-cyan-50' : isWeekend ? 'bg-sunken' : 'bg-surface'
              } ${isToday ? 'shadow-[inset_0_-3px_0_var(--color-brand)]' : ''}`}
            >
              <span className={`block text-xs ${isToday ? 'font-semibold text-brand-strong' : 'text-ink-muted'}`}>{isToday ? 'Today' : WEEKDAY_ABBR[weekday]}</span>
              <span className="flex items-center justify-center gap-1 text-sm font-semibold text-ink tabular-nums">
                {day}
                {holiday && <span className="size-1.5 rounded-full bg-cyan-600" aria-hidden="true" />}
              </span>
              {showProblems && dayProblems.has(dateStr) && (() => {
                const dp = dayProblems.get(dateStr)!;
                const Icon = dp.mustFix ? OctagonAlert : TriangleAlert;
                return (
                  // Not a Tab stop: the keyboard reads the day's problems on its totals (the arrow keys reach them).
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={actions.openProblems}
                    title={dp.messages.join('\n')}
                    aria-label={`${dp.messages.length} problem${dp.messages.length === 1 ? '' : 's'} on ${formatDate(dateStr)}: ${dp.messages.join('. ')}`}
                    className={`mx-auto inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums cursor-pointer ${dp.mustFix ? 'text-danger' : 'text-warning'}`}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {dp.messages.length}
                  </button>
                );
              })()}
            </th>
          ))}

          <th className="py-1 px-2 text-center font-sans text-xs text-ink-muted bg-slate-50">
            Hours
          </th>
        </tr>
      </thead>

      {/* Table Body: Nurse Rows */}
      <tbody className="divide-y divide-slate-200 font-mono">
        {displayNurses.slice(0, rowLimit).map((nurse) => {
          const hours = hoursByNurse.get(nurse.id)!;
          const block = blockHoursByNurse.get(nurse.id);
          const np = nurseProblems.get(nurse.id);
          return (
            <GridRow
              key={nurse.id}
              nurse={nurse}
              seniority={seniorityMap.get(nurse.seniorityLevelId)}
              views={rowViews.get(nurse.id)!}
              totalHours={hours.totalHours}
              targetHours={hours.targetHours}
              percent={hours.percent}
              blockTotal={block?.totalHours ?? 0}
              blockDuty={block?.dutyHours ?? 0}
              blockLeave={block?.leaveHours ?? 0}
              problems={np ? np.messages.join(PROBLEM_SEPARATOR) : ''}
              problemMustFix={!!np?.mustFix}
              showProblems={showProblems}
              heightClass={heightClass}
              fontClass={fontClass}
              selection={selection}
              actions={actions}
            />
          );
        })}
      </tbody>

      {/* Day totals: stays at the bottom while the nurse rows scroll */}
      <tfoot className="sticky bottom-0 z-30 bg-slate-50 border-t-2 border-slate-300 font-sans">
        <tr>
          <th
            scope="row"
            className="sticky left-0 bg-slate-100 z-40 border-r-2 border-slate-300 py-1 px-2.5 text-left font-normal w-60 min-w-60 max-w-60 shadow-xs"
          >
            <span className="block text-xs font-semibold text-slate-800">Day totals</span>
            <span className="block text-xs text-ink-muted leading-tight">
              Doctors · nurses · hours without a free nurse · senior
            </span>
          </th>
          {dayInfo.map(({ dateStr, isWeekend, holiday }) => (
            <TotalsCell
              key={dateStr}
              date={dateStr}
              total={dayTotals.get(dateStr)}
              problems={showProblems ? dayProblems.get(dateStr) : undefined}
              shade={holiday ? 'bg-cyan-50' : isWeekend ? 'bg-sunken' : 'bg-slate-50'}
              selection={selection}
              actions={actions}
            />
          ))}
          <td className="bg-slate-50" />
        </tr>
      </tfoot>
    </table>
);

/** A day's totals under the grid, a cell the arrow keys reach (its words, with the day's problems, are read out). */
function TotalsCell({
  date,
  total: t,
  problems,
  shade,
  selection,
  actions,
}: {
  date: string;
  total?: DayTotal;
  problems?: ProblemMark;
  shade: string;
  selection: GridSelection;
  actions: GridRowActions;
}) {
  const key = `${TOTALS_ROW}|${date}`;
  const flags = useCellFlags(selection, key);
  const selected = (flags & CELL_SELECTED) !== 0;
  if (!t) return <td />;
  const words = dayTotalWords(date, t, problems);
  return (
    <td
      data-cell={key}
      tabIndex={flags & CELL_TAB_STOP ? 0 : -1}
      aria-selected={selected}
      onClick={() => actions.select(TOTALS_ROW, date)}
      onFocus={() => {
        if (!selected) actions.select(TOTALS_ROW, date);
      }}
      title={words}
      className={`relative py-0.5 px-0.5 text-center border-r border-line text-[11px] leading-tight align-top ${selected ? SELECTED_CELL : `${shade} ${FOCUS_CELL}`}`}
    >
      <span className="sr-only">{words}</span>
      <span aria-hidden="true" className="flex flex-col items-center gap-px">
        <span className="flex items-center gap-1 text-ink tabular-nums">
          <span className="inline-flex items-center gap-px">
            <Stethoscope className="size-3 text-ink-muted" />
            {t.doctors}
          </span>
          <span className="inline-flex items-center gap-px">
            <Users className="size-3 text-ink-muted" />
            {t.nurses}
          </span>
        </span>
        {t.gapHours !== undefined &&
          (t.gapHours === 0 ? (
            <Check className="size-3 text-emerald-700" />
          ) : (
            <span className="inline-flex items-center gap-px font-semibold text-danger">
              <Clock className="size-3" />
              {t.gapHours} h
            </span>
          ))}
        {t.hasSenior !== undefined &&
          (t.hasSenior ? <span className="text-emerald-700 font-semibold">✓ Senior</span> : <span className="text-danger font-semibold whitespace-nowrap">No senior</span>)}
      </span>
    </td>
  );
}
