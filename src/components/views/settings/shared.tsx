/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Types, constants and small helpers shared by the Settings tabs.
 */

import React from 'react';
import { useDialogA11y } from '../../common/useDialogA11y';
import { notify } from '../../common/dialogs';

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
  /** Called on Esc (and nothing else; buttons inside close the dialog themselves). */
  onClose: () => void;
  /** id of the dialog's heading. */
  labelledBy: string;
  overlayClassName: string;
  panelClassName: string;
  children: React.ReactNode;
}

/**
 * Overlay + panel for the inline Settings modals. Render it only while the modal
 * is open: it traps focus, closes on Esc and returns focus when it unmounts.
 */
export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  onClose,
  labelledBy,
  overlayClassName,
  panelClassName,
  children,
}) => {
  const ref = useDialogA11y<HTMLDivElement>(true, onClose);
  return (
    <div className={overlayClassName}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className={panelClassName}>
        {children}
      </div>
    </div>
  );
};
