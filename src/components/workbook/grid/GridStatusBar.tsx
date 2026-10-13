import React from 'react';
import type { Nurse } from '../../../types';
import type { ValidationReport } from '../../../services/validation/ScheduleValidator';
import { formatDate, formatDayDate } from '../../../utils/dateUtils';
import { HOURS_COLUMN, TOTALS_ROW, type GridSelection } from './gridSelection';
import { SelectionView } from './SelectionView';
import { ProblemCounts } from '../../ui';

/**
 * The bar under the grid: the selected cell, the opening hours without a free nurse on its
 * day (else the first day shown), and the roster's problem count.
 */
export const GridStatusBar: React.FC<{
  selection: GridSelection;
  nurseMap: Map<string, Nurse>;
  /** The day the coverage is shown for when no cell is selected. */
  firstDate: string;
  /** What a roster cell holds, in a few words ("Lee #1 09:00 to 17:00, Day shift"). */
  cellWords: (nurseId: string, date: string) => string;
  validationReport: ValidationReport;
  onOpenCoverage: () => void;
  onOpenProblems: () => void;
}> = ({ selection, nurseMap, firstDate, cellWords, validationReport, onOpenCoverage, onOpenProblems }) => (
  <div className="min-h-8 bg-surface border-t border-line px-4 py-1 flex items-center justify-between gap-4 text-xs text-ink-muted shrink-0 select-none">
    <div className="flex min-w-0 items-center gap-4">
      <SelectionView
        selection={selection}
        render={({ selected: selectedCell }) =>
          // What the selected cell holds: "Mary, 16-11-2026: Lee #1 09:00 to 17:00, Day shift".
          selectedCell ? (
            <p className="truncate text-ink">
              {selectedCell.nurseId === TOTALS_ROW ? (
                <span className="font-semibold">Day totals, {formatDayDate(selectedCell.date)}</span>
              ) : selectedCell.date === HOURS_COLUMN ? (
                <span className="font-semibold">Hours, {nurseMap.get(selectedCell.nurseId)?.fullName}</span>
              ) : (
                <>
                  <span className="font-semibold">
                    {nurseMap.get(selectedCell.nurseId)?.fullName}, {formatDate(selectedCell.date)}:
                  </span>{' '}
                  {cellWords(selectedCell.nurseId, selectedCell.date)}
                </>
              )}
            </p>
          ) : (
            <span>Click a cell to change it</span>
          )
        }
      />
    </div>

    <div className="flex items-center gap-4">
      <SelectionView
        selection={selection}
        render={({ selected: selectedCell }) => {
          // The day of the selected cell (else the first day shown): opening hours missing a free nurse.
          const checkDate = selectedCell && selectedCell.date !== HOURS_COLUMN ? selectedCell.date : firstDate;
          const dayMap = validationReport.hourlyCoverageMap[checkDate];
          if (!dayMap || Object.keys(dayMap).length === 0) {
            return <span className="text-slate-500">Coverage: not checked yet</span>;
          }
          const shortHours = Object.keys(dayMap).filter((h) => dayMap[h].deficit > 0).sort();
          return (
            <button
              type="button"
              onClick={onOpenCoverage}
              className={`flex items-center gap-1 cursor-pointer px-1.5 py-0.5 rounded ${
                shortHours.length > 0 ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Open the Coverage tab"
            >
              <span>Coverage {formatDate(checkDate)}:</span>
              <span>
                {shortHours.length === 0
                  ? 'every hour covered'
                  : `${shortHours.length} hour${shortHours.length === 1 ? '' : 's'} without a free nurse (from ${shortHours[0]})`}
              </span>
            </button>
          );
        }}
      />

      <button
        onClick={onOpenProblems}
        className={`flex items-center gap-1 font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
          validationReport.errorCount > 0
            ? 'bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 border border-rose-200'
            : validationReport.warnCount > 0
            ? 'bg-amber-50 text-amber-800 font-bold hover:bg-amber-100 border border-amber-200'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        title="Open the Problems tab"
      >
        <span>Problems:</span>
        <ProblemCounts mustFix={validationReport.errorCount} toCheck={validationReport.warnCount} notes={validationReport.infoCount} none="none" />
      </button>
    </div>
  </div>
);
