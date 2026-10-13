import React, { type Ref } from 'react';
import { Check, Clock, Stethoscope, Users } from 'lucide-react';
import type { Nurse, PublicHoliday, SeniorityLevel } from '../../../types';
import type { NurseHoursSummary } from '../../../services/reports/hoursAccounting';
import { formatDate } from '../../../utils/dateUtils';
import type { CellView } from './cellView';
import type { DayTotal } from './dayTotals';
import { GridRow, PROBLEM_SEPARATOR, type GridRowActions } from './GridRow';
import type { GridSelection } from './gridSelection';

const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  /** The day columns' least width, by the zoom. */
  widthClass: string;
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
  widthClass,
  selection,
  actions,
}) => (
    <table ref={tableRef} className="border-collapse bg-white text-xs w-max" role="grid" aria-label="Nurse roster">
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
            className="py-1 px-2 text-center font-mono text-[11px] text-slate-600 bg-slate-100 border-r border-slate-300"
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
          <th className="py-1 px-2 text-center font-mono text-[11px] text-slate-600 bg-slate-100">
            These days
          </th>
        </tr>

        {/* Sticky Header Row 2: Day-name + Date */}
        <tr className="bg-slate-50 text-slate-700">
          {/* Sticky Left Column: Nurse, seniority and hours */}
          <th className="sticky left-0 bg-slate-50 z-40 border-r-2 border-slate-300 py-1.5 px-3 text-left font-semibold text-slate-800 w-60 min-w-60 max-w-60 shadow-xs">
            <span className="block">Nurse</span>
            <span className="block text-[10px] font-normal text-slate-500">Hours worked / goal for the whole roster</span>
          </th>

          {/* Date Columns */}
          {dayInfo.map(({ dateStr, day, weekday, isWeekend, holiday, isToday }) => (
            <th
              key={dateStr}
              scope="col"
              title={`${WEEKDAY_ABBR[weekday]} ${formatDate(dateStr)}${isToday ? ' · Today' : ''}${holiday ? ` · Public holiday: ${holiday.name}` : isWeekend ? ' · Weekend' : ''}`}
              aria-label={`${WEEKDAY_ABBR[weekday]} ${formatDate(dateStr)}${isToday ? ', today' : ''}${holiday ? `, public holiday: ${holiday.name}` : isWeekend ? ', weekend' : ''}`}
              className={`py-1 px-1 text-center font-mono border-r border-slate-200 ${widthClass} ${
                isToday
                  ? 'bg-indigo-600 text-white'
                  : holiday
                  ? 'bg-cyan-100 text-cyan-900 font-bold'
                  : isWeekend
                  ? 'bg-slate-200 text-slate-800'
                  : 'bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-[10px] font-normal leading-tight">
                {isToday ? 'Today' : WEEKDAY_ABBR[weekday]}
              </div>
              <div className="flex items-center justify-center gap-0.5 text-xs font-bold">
                <span>{day}</span>
                {holiday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full inline-block ${isToday ? 'bg-white' : 'bg-cyan-600'}`}
                    aria-hidden="true"
                  />
                )}
              </div>
              {showProblems && dayProblems.has(dateStr) && (() => {
                const dp = dayProblems.get(dateStr)!;
                return (
                  <button
                    type="button"
                    onClick={actions.openProblems}
                    title={dp.messages.join('\n')}
                    aria-label={`${dp.messages.length} problem${dp.messages.length === 1 ? '' : 's'} on ${formatDate(dateStr)}: ${dp.messages.join('. ')}`}
                    className={`mt-0.5 mx-auto flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold font-sans cursor-pointer ${
                      dp.mustFix ? 'bg-rose-600 text-white' : 'bg-amber-400 text-amber-950'
                    }`}
                  >
                    {dp.messages.length}
                  </button>
                );
              })()}
            </th>
          ))}

          <th className="py-1 px-2 text-center font-mono text-[11px] text-slate-600 bg-slate-50">
            Hours
          </th>
        </tr>
      </thead>

      {/* Table Body: Nurse Rows */}
      <tbody className="divide-y divide-slate-200 font-mono">
        {displayNurses.map((nurse) => {
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
            <span className="block text-[10px] text-slate-500 leading-tight">
              Doctors · nurses · hours without a free nurse · senior
            </span>
          </th>
          {dayInfo.map(({ dateStr, isWeekend, holiday }) => {
            const t = dayTotals.get(dateStr);
            if (!t) return <td key={dateStr} />;
            const gapWords =
              t.gapHours === undefined
                ? ''
                : t.gapHours === 0
                ? 'a free nurse every opening hour'
                : `${t.gapHours} ${t.gapHours === 1 ? 'hour' : 'hours'} without a free nurse`;
            const seniorWords = t.hasSenior === undefined ? '' : t.hasSenior ? 'a senior nurse on duty' : 'no senior nurse on duty';
            const summary = [
              `${formatDate(dateStr)}: ${t.doctors} ${t.doctors === 1 ? 'doctor' : 'doctors'} in session`,
              `${t.nurses} ${t.nurses === 1 ? 'nurse' : 'nurses'} on duty`,
              gapWords,
              seniorWords,
            ]
              .filter(Boolean)
              .join(', ');
            return (
              <td
                key={dateStr}
                title={summary}
                className={`py-0.5 px-0.5 text-center border-r border-slate-200 text-[10px] leading-tight align-top ${
                  holiday ? 'bg-cyan-50' : isWeekend ? 'bg-slate-100' : 'bg-slate-50'
                }`}
              >
                <span className="sr-only">{summary}</span>
                <span aria-hidden="true" className="flex flex-col items-center gap-px">
                  <span className="flex items-center gap-1 text-slate-700 font-mono">
                    <span className="inline-flex items-center gap-px">
                      <Stethoscope className="w-2.5 h-2.5 text-slate-400" />
                      {t.doctors}
                    </span>
                    <span className="inline-flex items-center gap-px">
                      <Users className="w-2.5 h-2.5 text-slate-400" />
                      {t.nurses}
                    </span>
                  </span>
                  {t.gapHours !== undefined &&
                    (t.gapHours === 0 ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <span className="inline-flex items-center gap-px font-bold text-rose-700">
                        <Clock className="w-2.5 h-2.5" />
                        {t.gapHours} h
                      </span>
                    ))}
                  {t.hasSenior !== undefined &&
                    (t.hasSenior ? (
                      <span className="text-emerald-700 font-semibold">✓ Senior</span>
                    ) : (
                      <span className="text-rose-700 font-bold whitespace-nowrap">No senior</span>
                    ))}
                </span>
              </td>
            );
          })}
          <td className="bg-slate-50" />
        </tr>
      </tfoot>
    </table>
);
