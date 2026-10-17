import React from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import type { Assignment } from '../../types';
import type { GenerationPreflightSummary, GenerationProgress, RegenerateMode } from '../../services/engine/types';
import { formatDate } from '../../utils/dateUtils';
import { Button, Checkbox, DateInput, Dialog, Field, Notice, cx } from '../ui';

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
 * clear keeps and replaces, the options, and the progress while it runs. On the shared Dialog
 * since Phase 7, slice 3a.
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
  const badRange = !isClear && fillRange.enabled && (!fillRange.start || !fillRange.end || fillRange.start > fillRange.end);
  const NURSE_CLINIC = [
    { id: 'HARD', label: 'Never broken', hint: 'Filled before the doctors’ second nurses', run: () => onNurseClinicRule('HARD', true) },
    { id: 'SOFT', label: 'When possible', hint: 'Doctors first, then Nurse Clinic', run: () => onNurseClinicRule('SOFT', true) },
    { id: 'OFF', label: 'Off', hint: 'No Nurse Clinic shifts', run: () => onNurseClinicRule('SOFT', false) },
  ] as const;

  return (
    <Dialog
      open
      // It can't be closed while a fill is running (as Cancel).
      onClose={() => !isGenerating && onClose()}
      title={`${title}: ${summary.scheduleName}`}
      footer={
        <>
          <Button disabled={isGenerating} onClick={onClose}>
            Cancel
          </Button>
          <Button variant={isClear ? 'danger' : 'primary'} icon={isClear ? Trash2 : Sparkles} busy={isGenerating} disabled={badRange} onClick={onRun}>
            {isClear ? 'Clear shifts' : mode === 'EMPTY_ONLY' ? 'Fill empty cells' : 'Fill roster'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        {isClear ? (
          <>
            <p className="text-ink">
              This removes the {plural(filledCount, 'shift')} the app filled in.{' '}
              {clearIncludeManual
                ? `Your ${plural(manualCount, 'hand change')} are removed too.`
                : manualCount > 0
                ? `Your ${plural(manualCount, 'hand change')} stay.`
                : ''}{' '}
              Pinned days and leave always stay. You can undo this.
            </p>
            {manualCount > 0 && (
              <Checkbox
                checked={clearIncludeManual}
                onChange={(e) => setClearIncludeManual(e.target.checked)}
                label={`Also remove the ${plural(manualCount, 'shift')} I changed by hand`}
              />
            )}
          </>
        ) : (
          <>
            <p className="text-ink">
              <strong>Kept:</strong> {kept.join(', ')}
              {mode === 'EMPTY_ONLY' ? `, and every shift already on the roster (${assignments.length})` : ''}
              {ranged ? `, and everything outside ${formatDate(fillRange.start)} to ${formatDate(fillRange.end)}` : ''}.{' '}
              {mode === 'GENERATE_ALL' && (
                <>
                  <strong>Replaced:</strong> {plural(filledCount + (keepManual ? 0 : manualCount), 'shift')}
                  {keepManual || manualCount === 0 ? ' the app filled in before' : ', including your hand changes'}.
                </>
              )}
            </p>
            {mode === 'GENERATE_ALL' && manualCount > 0 && (
              <Checkbox checked={keepManual} onChange={(e) => setKeepManual(e.target.checked)} label={`Keep the ${plural(manualCount, 'shift')} I changed by hand`} />
            )}
            <fieldset className="space-y-3 rounded-lg border border-line p-3" disabled={isGenerating}>
              <Checkbox
                checked={fillRange.enabled}
                onChange={(e) => setFillRange((r) => ({ ...r, enabled: e.target.checked }))}
                label="Only fill some dates"
                hint={fillRange.enabled ? 'Every shift outside these dates stays as it is.' : undefined}
              />
              {fillRange.enabled && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="From" error={fillRange.start && fillRange.end && fillRange.start > fillRange.end ? 'The last day is before the first day.' : undefined}>
                    {(f) => <DateInput {...f} value={fillRange.start} min={summary.startDate} max={summary.endDate} onChange={(iso) => setFillRange((r) => ({ ...r, start: iso }))} />}
                  </Field>
                  <Field label="To">
                    {(f) => <DateInput {...f} value={fillRange.end} min={fillRange.start || summary.startDate} max={summary.endDate} onChange={(iso) => setFillRange((r) => ({ ...r, end: iso }))} />}
                  </Field>
                </div>
              )}
            </fieldset>

            <p className="text-ink-muted">
              {plural(summary.activeNursesCount, 'nurse')} ({summary.bloodCollectionNursesCount} can take blood) and{' '}
              {plural(summary.doctorSessionsCount, 'doctor clinic')} over {plural(summary.totalDays, 'day')}. Doctors get their nurses first, then
              Nurse Clinic and the other jobs are filled.
              {summary.targetWorkingHoursFullTime
                ? ` A full time nurse has a goal of ${summary.targetWorkingHoursFullTime} h${summary.detectedPeriodName ? ` (${summary.detectedPeriodName})` : ''}.`
                : ''}
            </p>

            <fieldset className="space-y-2" disabled={isGenerating}>
              <legend className="mb-2 font-semibold text-ink">A free nurse for Nurse Clinic every opening hour</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {NURSE_CLINIC.map((opt) => (
                  <label
                    key={opt.id}
                    className={cx(
                      'cursor-pointer rounded-lg border p-3',
                      nurseClinicChoice === opt.id ? 'border-brand bg-brand-soft ring-1 ring-brand' : 'border-line hover:bg-sunken'
                    )}
                  >
                    <span className="flex items-center gap-2 font-semibold text-ink">
                      <input type="radio" name="nurse-clinic-rule" className="size-4 accent-brand" checked={nurseClinicChoice === opt.id} onChange={opt.run} />
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{opt.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {summary.eveningCoverageAlert && <Notice tone="warning" title={summary.eveningCoverageAlert} />}
            {summary.staffingScaleWarning && <Notice tone="warning" title={summary.staffingScaleWarning} />}
          </>
        )}

        {isGenerating && progress && (
          <div className="space-y-2 rounded-lg border border-line bg-sunken p-3" role="status">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">{progress.statusText}</span>
              <span className="font-semibold text-brand-strong">{progress.percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded bg-line" aria-hidden="true">
              <div className="h-full bg-brand transition-all duration-100" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
