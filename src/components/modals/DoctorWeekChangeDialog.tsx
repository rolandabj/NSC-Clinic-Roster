/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Asked when a doctor's usual week changes on the Doctors screen (or a doctor is
 * added, or switched on or off) while rosters are already set up: from which date
 * should the days already set up follow the new week? Days before it keep the old
 * week, and days changed by hand for one date stay as they are.
 */

import React, { useId, useState } from 'react';
import { useDialogA11y } from '../common/useDialogA11y';
import { formatDate } from '../../utils/dateUtils';

export interface WeekChangePreview {
  /** Days already set up that change from that date. */
  changedDays: number;
  /** Days changed by hand for one date, which stay. */
  handChangedDays: number;
  /** Names of the rosters those days are in. */
  rosterNames: string[];
}

interface DoctorWeekChangeDialogProps {
  doctorName: string;
  beforeText: string;
  afterText: string;
  /** The first date that may be chosen (today: past days never change). */
  minDate: string;
  /** The last day of the rosters already set up, for the hint. */
  lastSetUpDate?: string;
  preview: (date: string) => WeekChangePreview;
  onConfirm: (date: string) => Promise<void>;
  onCancel: () => void;
}

export const DoctorWeekChangeDialog: React.FC<DoctorWeekChangeDialogProps> = ({
  doctorName,
  beforeText,
  afterText,
  minDate,
  lastSetUpDate,
  preview,
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const dateId = useId();
  const [date, setDate] = useState(minDate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useDialogA11y<HTMLDivElement>(true, () => !saving && onCancel());
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= minDate;
  const p = valid ? preview(date) : null;
  const dayAfterLast = (() => {
    if (!lastSetUpDate) return undefined;
    const [y, m, d] = lastSetUpDate.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
  })();

  const confirm = async () => {
    if (!valid) return setError(`Choose ${formatDate(minDate)} or a later date.`);
    setSaving(true);
    setError(null);
    try {
      await onConfirm(date);
    } catch (err: any) {
      setError(err?.message || String(err));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
      >
        <h3 id={titleId} className="text-sm font-bold text-slate-900">
          {doctorName}: from which date?
        </h3>
        <div className="space-y-1 text-slate-700">
          <p>
            <span className="font-semibold">Before:</span> {beforeText}
          </p>
          <p>
            <span className="font-semibold">Now:</span> {afterText}
          </p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor={dateId} className="block font-medium text-slate-700">
            Change the days already set up from
          </label>
          <input
            id={dateId}
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setError(null);
            }}
            className="px-3 py-1.5 border border-slate-300 rounded font-mono"
          />
          {p && (
            <p className="text-slate-600" aria-live="polite">
              {p.changedDays === 0
                ? 'No day already set up changes from this date.'
                : `${p.changedDays} day${p.changedDays === 1 ? '' : 's'} change${p.rosterNames.length ? ` (${p.rosterNames.join(', ')})` : ''}.`}{' '}
              {p.handChangedDays > 0 &&
                `${p.handChangedDays} day${p.handChangedDays === 1 ? '' : 's'} changed by hand for one date stay${p.handChangedDays === 1 ? 's' : ''} as ${p.handChangedDays === 1 ? 'it is' : 'they are'}. `}
              Days before {formatDate(date)} keep the old week. Rosters not set up yet get the new week.
            </p>
          )}
          {dayAfterLast && (
            <p className="text-slate-500">
              The rosters already set up run to {formatDate(lastSetUpDate!)}; choose {formatDate(dayAfterLast)} to leave them all as they are.
            </p>
          )}
          {error && (
            <p role="alert" className="text-rose-700">
              {error}
            </p>
          )}
        </div>
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={saving || !valid}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving…' : `Save and change from ${valid ? formatDate(date) : 'that date'}`}
          </button>
        </div>
      </div>
    </div>
  );
};
