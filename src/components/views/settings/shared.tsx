/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Types, constants and small helpers shared by the Settings tabs.
 */

import React from 'react';
import { notify } from '../../common/dialogs';
import { Button, Dialog, Field, Input } from '../../ui';

export type SettingsTab =
  | 'access-roles'
  | 'clinic'
  | 'duties'
  | 'leave'
  | 'seniority'
  | 'clinical-roles'
  | 'specialties'
  | 'rules'
  | 'holidays'
  | 'working-hours-periods'
  | 'email'
  | 'database';

/** Auto-save state shown in the "Saving... / All changes saved" badges. */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** Shows the short toast banner at the top right of the Settings page. */
export type SaveNotifier = (msg: string) => void;

/**
 * Wraps a save or delete handler so a failed write shows an error message
 * instead of failing silently ("Could not <what>: <reason>").
 */
export function withSaveErrors<A extends unknown[]>(
  what: string,
  handler: (...args: A) => Promise<void>
): (...args: A) => Promise<void> {
  return async (...args: A) => {
    try {
      await handler(...args);
    } catch (err: any) {
      console.error(`Could not ${what}:`, err);
      notify(`Could not ${what}: ${err?.message || 'unknown error'}. Nothing was changed.`, 'error');
    }
  };
}

export const DUTY_COLOR_PALETTE = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#6366f1', // indigo
  '#64748b', // slate
];

export const LEAVE_COLOR_PALETTE = [
  '#f59e0b', // amber (AL)
  '#ec4899', // pink (SL)
  '#f43f5e', // rose (BL)
  '#06b6d4', // cyan (PH)
  '#94a3b8', // slate (RO)
  '#cbd5e1', // slate-300 (DO)
];

export const SENIORITY_COLOR_PALETTE = [
  '#4f46e5', // indigo
  '#2563eb', // blue
  '#0d9488', // teal
  '#16a34a', // emerald
  '#ca8a04', // amber
  '#ea580c', // orange
  '#dc2626', // rose
  '#9333ea', // purple
  '#64748b', // slate
];

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface SettingsDialogProps {
  title: string;
  description?: React.ReactNode;
  onClose: () => void;
  /** The main button; leave out with `footer` for other buttons. */
  onSave?: () => void;
  saveLabel?: string;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * The Settings tabs' dialogs, on the shared Dialog since Phase 7, slice 4: the title at the
 * top, the fields, and Cancel with the main button at the bottom right.
 */
export const SettingsDialog: React.FC<SettingsDialogProps> = ({ title, description, onClose, onSave, saveLabel = 'Save', footer, size = 'md', children }) => (
  <Dialog
    open
    onClose={onClose}
    size={size}
    title={title}
    description={description}
    footer={
      footer ?? (
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>
            {saveLabel}
          </Button>
        </>
      )
    }
  >
    <div className="space-y-4 text-sm">{children}</div>
  </Dialog>
);

/** A colour: the browser's colour picker, the hex code beside it and, if given, ready colours. */
export const ColourField: React.FC<{ label: string; value: string; onChange: (colour: string) => void; hint?: string; palette?: string[] }> = ({
  label,
  value,
  onChange,
  hint,
  palette,
}) => (
  <Field label={label} hint={hint}>
    {(f) => (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input type="color" aria-label={`${label}, picker`} value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 shrink-0 cursor-pointer rounded border border-control" />
          <Input {...f} value={value} onChange={(e) => onChange(e.target.value)} className="font-mono" />
        </div>
        {palette && (
          <div className="flex flex-wrap gap-2" role="group" aria-label={`${label}, ready colours`}>
            {palette.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Use the colour ${c}`}
                aria-pressed={value === c}
                onClick={() => onChange(c)}
                className={`size-7 rounded-full border border-line-strong ${value === c ? 'ring-2 ring-brand ring-offset-2' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>
    )}
  </Field>
);
