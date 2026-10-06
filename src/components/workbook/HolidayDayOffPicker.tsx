/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Under a "works the public holiday and has no day off chosen" problem: the
 * planner enters the day off the nurse chose, and it is saved as an approved day
 * off linked to the holiday (owner's decision of 2026-10-06).
 */

import React, { useId, useState } from 'react';
import { formatDate } from '../../utils/dateUtils';

interface HolidayDayOffPickerProps {
  nurseName: string;
  holidayDate: string;
  holidayName?: string;
  /** Saves the day off; a rejected promise shows its message. */
  onSave: (date: string) => Promise<void>;
}

export const HolidayDayOffPicker: React.FC<HolidayDayOffPickerProps> = ({ nurseName, holidayDate, holidayName, onSave }) => {
  const inputId = useId();
  const [date, setDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!date) return setError('Choose the day off first.');
    if (date === holidayDate) return setError('Choose another day than the public holiday.');
    setSaving(true);
    setError(null);
    try {
      await onSave(date);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-1.5 text-[11px] text-slate-700">
      <label htmlFor={inputId} className="block">
        Day off {nurseName} chose for working {holidayName || 'the public holiday'} ({formatDate(holidayDate)}):
      </label>
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setError(null);
          }}
          className="px-1.5 py-0.5 border border-slate-300 rounded bg-white"
        />
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving…' : 'Save day off'}
        </button>
      </div>
      <p className="text-slate-500">It is saved as an approved day off with a pinned day off; a shift on that day in this roster is removed.</p>
      {error && (
        <p role="alert" className="text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
};
