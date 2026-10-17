/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Asked when a doctor's usual week changes on the Doctors screen (or a doctor is
 * added, or switched on or off) while rosters are already set up: from which date
 * should the days already set up follow the new week? Days before it keep the old
 * week, and days changed by hand for one date stay as they are.
 */

import React, { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { Button, DateInput, Dialog, Field, Notice } from '../ui';

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
  const [date, setDate] = useState(minDate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Over the doctor editor, so one layer higher (Phase 7, slice 3a: on the shared Dialog).
  return (
    <Dialog
      open
      stacked
      onClose={() => !saving && onCancel()}
      title={`${doctorName}: from which date?`}
      description={
        <>
          <span className="block">Before: {beforeText}</span>
          <span className="block">Now: {afterText}</span>
        </>
      }
      footer={
        <>
          <Button disabled={saving} onClick={onCancel}>
            Back
          </Button>
          <Button variant="primary" busy={saving} disabled={!valid} onClick={confirm}>
            Save and change from {valid ? formatDate(date) : 'that date'}
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-sm">
        <Field
          label="Change the days already set up from"
          hint={dayAfterLast && `The rosters already set up run to ${formatDate(lastSetUpDate!)}; choose ${formatDate(dayAfterLast)} to leave them all as they are.`}
        >
          {(f) => (
            <DateInput
              {...f}
              min={minDate}
              value={date}
              onChange={(iso) => {
                setDate(iso);
                setError(null);
              }}
            />
          )}
        </Field>
        {p && (
          <p className="text-ink-muted" aria-live="polite">
            {p.changedDays === 0
              ? 'No day already set up changes from this date.'
              : `${p.changedDays} ${p.changedDays === 1 ? 'day' : 'days'} will change${p.rosterNames.length ? ` (${p.rosterNames.join(', ')})` : ''}.`}{' '}
            {p.handChangedDays > 0 &&
              `${p.handChangedDays} ${p.handChangedDays === 1 ? 'day' : 'days'} changed by hand ${p.handChangedDays === 1 ? 'stays as it is' : 'stay as they are'}. `}
            Days before {formatDate(date)} keep the old week. Rosters not set up yet get the new week.
          </p>
        )}
        {error && <Notice tone="danger" live title={error} />}
      </div>
    </Dialog>
  );
};
