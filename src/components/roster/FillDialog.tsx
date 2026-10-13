import React, { useId } from 'react';
import { AlertTriangle, Sparkles, Trash2, X } from 'lucide-react';
import type { Assignment } from '../../types';
import type { GenerationPreflightSummary, GenerationProgress, RegenerateMode } from '../../services/engine/types';
import { useDialogA11y } from '../common/useDialogA11y';
import { formatDate } from '../../utils/dateUtils';

export interface FillRange {
  enabled: boolean;
  start: string;
  end: string;
}

interface FillDialogProps {
  mode: RegenerateMode;
  summary: GenerationPreflightSummary;
  /** The roster's shifts now (for the counts of filled shifts and hand changes). */
  assignments: Assignment[];
  fillRange: FillRange;
  setFillRange: React.Dispatch<React.SetStateAction<FillRange>>;
  /** Fill the whole roster: keep the shifts changed by hand. */
  keepManual: boolean;
  setKeepManual: (keep: boolean) => void;
  /** Clear filled shifts: remove the hand changes too. */
  clearIncludeManual: boolean;
  setClearIncludeManual: (include: boolean) => void;
  isGenerating: boolean;
  progress: GenerationProgress | null;
  onClose: () => void;
  onRun: () => void;
  /** The Nurse Clinic rule: never broken (HARD), when possible (SOFT), or off. */
  onNurseClinicRule: (severity: 'HARD' | 'SOFT', enabled: boolean) => void;
}

/**
 * The fill dialog of the roster screen: what a fill (whole roster, empty cells only) or a
 * clear keeps and replaces, the options, and the progress while it runs.
 */
export const FillDialog: React.FC<FillDialogProps> = ({
  mode,
  summary,
  assignments,
  fillRange,
  setFillRange,
  keepManual,
  setKeepManual,
  clearIncludeManual,
  setClearIncludeManual,
  isGenerating,
  progress,
  onClose,
  onRun,
  onNurseClinicRule,
}) => {
  const titleId = useId();
  // Can't be closed while a fill is running (same as the Cancel button).
  const dialogRef = useDialogA11y<HTMLDivElement>(true, () => {
    if (!isGenerating) onClose();
  });
  const isClear = mode === 'CLEAR_GENERATED';
  // With "Only fill some dates", the counts are for those dates only.
  const ranged = !isClear && fillRange.enabled && !!fillRange.start && !!fillRange.end;
  const touched = assignments.filter((a) => !ranged || (a.date >= fillRange.start && a.date <= fillRange.end));
  const filledCount = touched.filter((a) => a.source === 'GENERATED').length;
  const manualCount = touched.filter((a) => a.source === 'MANUAL').length;
  const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
  const title = isClear
    ? 'Clear filled shifts'
    : mode === 'EMPTY_ONLY'
    ? 'Fill empty cells only'
    : 'Fill the whole roster';
  const kept = [
    plural(summary.existingLocksCount, 'pinned day'),
    plural(summary.existingLeaveDaysCount, 'leave day'),
  ];
  if (mode === 'GENERATE_ALL' && keepManual && manualCount > 0) kept.push(plural(manualCount, 'hand change'));
  const nurseClinicChoice = !summary.nurseClinicRuleEnabled
    ? 'OFF'
    : summary.nurseClinicRuleSeverity === 'HARD'
    ? 'HARD'
    : 'SOFT';
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col text-xs animate-in zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {isClear ? (
            <Trash2 className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
          )}
          <h3 id={titleId} className="text-sm font-bold text-slate-900 truncate">
            {title}: {summary.scheduleName}
          </h3>
        </div>
        {!isGenerating && (
          <button
            onClick={() => onClose()}
            className="p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
            aria-label="Close"
            title="Close"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {isClear ? (
          <>
            <p className="text-slate-800 leading-relaxed text-[13px]">
              This removes the {plural(filledCount, 'shift')} the app filled in.{' '}
              {clearIncludeManual
                ? `Your ${plural(manualCount, 'hand change')} are removed too.`
                : manualCount > 0
                ? `Your ${plural(manualCount, 'hand change')} stay.`
                : ''}{' '}
              Pinned days and leave always stay. You can undo this.
            </p>
            {manualCount > 0 && (
              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded cursor-pointer text-slate-800 font-medium">
                <input
                  type="checkbox"
                  checked={clearIncludeManual}
                  onChange={(e) => setClearIncludeManual(e.target.checked)}
                  className="rounded border-slate-300 cursor-pointer"
                />
                <span>Also remove the {plural(manualCount, 'shift')} I changed by hand</span>
              </label>
            )}
          </>
        ) : (
          <>
            <p className="text-slate-800 leading-relaxed text-[13px]">
              <strong>Kept:</strong> {kept.join(', ')}
              {mode === 'EMPTY_ONLY' ? `, and every shift already on the roster (${assignments.length})` : ''}
              {ranged ? `, and everything outside ${formatDate(fillRange.start)} to ${formatDate(fillRange.end)}` : ''}.{' '}
              {mode === 'GENERATE_ALL' && (
                <>
                  <strong>Replaced:</strong>{' '}
                  {plural(filledCount + (keepManual ? 0 : manualCount), 'shift')}
                  {keepManual || manualCount === 0 ? ' the app filled in before' : ', including your hand changes'}.
                </>
              )}
            </p>
            {mode === 'GENERATE_ALL' && manualCount > 0 && (
              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded cursor-pointer text-slate-800 font-medium">
                <input
                  type="checkbox"
                  checked={keepManual}
                  onChange={(e) => setKeepManual(e.target.checked)}
                  className="rounded border-slate-300 cursor-pointer"
                />
                <span>Keep the {plural(manualCount, 'shift')} I changed by hand</span>
              </label>
            )}
            <fieldset className="p-2 bg-slate-50 border border-slate-200 rounded space-y-2" disabled={isGenerating}>
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
                <input
                  type="checkbox"
                  checked={fillRange.enabled}
                  onChange={(e) => setFillRange((r) => ({ ...r, enabled: e.target.checked }))}
                  className="rounded border-slate-300 cursor-pointer"
                />
                <span>Only fill some dates</span>
              </label>
              {fillRange.enabled && (
                <div className="flex flex-wrap items-center gap-2 pl-6">
                  <label className="flex items-center gap-1.5">
                    <span className="text-slate-600">From</span>
                    <input
                      type="date"
                      value={fillRange.start}
                      min={summary.startDate}
                      max={summary.endDate}
                      onChange={(e) => setFillRange((r) => ({ ...r, start: e.target.value }))}
                      className="px-2 py-1 border border-slate-300 rounded bg-white"
                    />
                  </label>
                  <label className="flex items-center gap-1.5">
                    <span className="text-slate-600">to</span>
                    <input
                      type="date"
                      value={fillRange.end}
                      min={fillRange.start || summary.startDate}
                      max={summary.endDate}
                      onChange={(e) => setFillRange((r) => ({ ...r, end: e.target.value }))}
                      className="px-2 py-1 border border-slate-300 rounded bg-white"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500 basis-full">Every shift outside these dates stays as it is.</span>
                </div>
              )}
            </fieldset>

            <p className="text-slate-600 leading-relaxed">
              {plural(summary.activeNursesCount, 'nurse')} ({summary.bloodCollectionNursesCount} can take blood) and{' '}
              {plural(summary.doctorSessionsCount, 'doctor session')} over {plural(summary.totalDays, 'day')}. Doctors get
              their nurses first, then Nurse Clinic and the other jobs are filled.
              {summary.targetWorkingHoursFullTime
                ? ` A full time nurse aims for ${summary.targetWorkingHoursFullTime} h${
                    summary.detectedPeriodName ? ` (${summary.detectedPeriodName})` : ''
                  }.`
                : ''}
            </p>

            <fieldset className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2" disabled={isGenerating}>
              <legend className="font-semibold text-slate-900 px-1">A free nurse for Nurse Clinic every opening hour</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'HARD', label: 'Never broken', hint: 'Filled before the doctors’ second nurses', run: () => onNurseClinicRule('HARD', true) },
                    { id: 'SOFT', label: 'When possible', hint: 'Doctors first, then Nurse Clinic', run: () => onNurseClinicRule('SOFT', true) },
                    { id: 'OFF', label: 'Off', hint: 'No Nurse Clinic shifts', run: () => onNurseClinicRule('SOFT', false) },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className={`p-2 rounded border cursor-pointer ${
                      nurseClinicChoice === opt.id ? 'bg-white border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <input
                        type="radio"
                        name="nurse-clinic-rule"
                        checked={nurseClinicChoice === opt.id}
                        onChange={opt.run}
                      />
                      {opt.label}
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight">{opt.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {summary.eveningCoverageAlert && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{summary.eveningCoverageAlert}</span>
              </div>
            )}
            {summary.staffingScaleWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{summary.staffingScaleWarning}</span>
              </div>
            )}
          </>
        )}

        {isGenerating && progress && (
          <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded" role="status">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-700 font-semibold">{progress.statusText}</span>
              <span className="text-indigo-600 font-bold">{progress.percent}%</span>
            </div>
            <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-100" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 flex items-center justify-end gap-2 border-t border-slate-100 shrink-0">
        <button
          type="button"
          disabled={isGenerating}
          onClick={() => onClose()}
          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isGenerating || (!isClear && fillRange.enabled && (!fillRange.start || !fillRange.end || fillRange.start > fillRange.end))}
          onClick={onRun}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 ${
            isClear ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded font-semibold cursor-pointer shadow-xs disabled:opacity-50 transition-colors`}
        >
          {isClear ? <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> : <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
          <span>
            {isGenerating
              ? isClear
                ? 'Clearing…'
                : 'Filling…'
              : isClear
              ? 'Clear shifts'
              : mode === 'EMPTY_ONLY'
              ? 'Fill empty cells'
              : 'Fill roster'}
          </span>
        </button>
      </div>
    </div>
  </div>
  );
};
