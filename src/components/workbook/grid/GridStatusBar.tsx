import React from 'react';
import type { Nurse } from '../../../types';
import type { ValidationReport } from '../../../services/validation/ScheduleValidator';
import { formatDate } from '../../../utils/dateUtils';
import type { GridSelection } from './gridSelection';
import { SelectionView } from './SelectionView';

/**
 * The bar under the grid: the selected cell, the opening hours without a free nurse on its
 * day (else the first day shown), and the roster's problem count.
 */
export const GridStatusBar: React.FC<{
  selection: GridSelection;
  nurseMap: Map<string, Nurse>;
  /** The day the coverage is shown for when no cell is selected. */
  firstDate: string;
  validationReport: ValidationReport;
  onOpenCoverage: () => void;
  onOpenProblems: () => void;
}> = ({ selection, nurseMap, firstDate, validationReport, onOpenCoverage, onOpenProblems }) => (
  <div className="h-7 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-600 shrink-0 select-none">
    <div className="flex items-center gap-4">
      <SelectionView
        selection={selection}
        render={({ selected: selectedCell }) =>
          selectedCell ? (
            <div className="flex items-center gap-1.5 font-mono text-slate-800">
              <span className="font-bold">{nurseMap.get(selectedCell.nurseId)?.fullName}</span>
              <span>·</span>
              <span>{formatDate(selectedCell.date)}</span>
            </div>
          ) : (
            <span className="text-slate-500">Click a cell to change it</span>
          )
        }
      />
    </div>

    <div className="flex items-center gap-4">
      <SelectionView
        selection={selection}
        render={({ selected: selectedCell }) => {
          // The day of the selected cell (else the first day shown): opening hours missing a free nurse.
          const checkDate = selectedCell?.date || firstDate;
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
              <span className="text-slate-500">Coverage {formatDate(checkDate)}:</span>
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
        <span className="text-slate-500">Problems:</span>
        <span>
          {validationReport.errorCount + validationReport.warnCount === 0
            ? 'none'
            : `${validationReport.errorCount} must fix · ${validationReport.warnCount} to check`}
        </span>
      </button>
    </div>
  </div>
);
