/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Keyboard Shortcuts Cheat-Sheet Modal (Phase 14.9)
 * Triggered by '?' key or Help button.
 */

import React, { useId } from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { t } from '../../services/i18n';
import { useDialogA11y } from '../common/useDialogA11y';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  action: string;
  category: 'Navigation' | 'Editing' | 'Clipboard & History' | 'Global';
}

// Only shortcuts the app really supports are listed here.
const SHORTCUTS: ShortcutItem[] = [
  // Navigation
  { keys: ['↑', '↓', '←', '→'], action: 'Navigate between roster cells', category: 'Navigation' },
  { keys: ['Tab'], action: 'Move to next date in row', category: 'Navigation' },
  { keys: ['Shift', 'Tab'], action: 'Move to previous date in row', category: 'Navigation' },

  // Editing
  { keys: ['Enter'], action: 'Open the duty and pairing editor for the selected cell', category: 'Editing' },
  { keys: ['Delete'], action: 'Clear the selected cell (asks first for pinned or leave days)', category: 'Editing' },
  { keys: ['Esc'], action: 'Exit the expanded roster view', category: 'Editing' },

  // Clipboard & History
  { keys: ['Ctrl / ⌘', 'C'], action: 'Copy the selected cell', category: 'Clipboard & History' },
  { keys: ['Ctrl / ⌘', 'V'], action: 'Paste into the selected cell', category: 'Clipboard & History' },

  // Global
  { keys: ['?'], action: 'Open keyboard shortcut cheat-sheet', category: 'Global' },
  { keys: ['Ctrl / ⌘', '\\'], action: 'Collapse / expand sidebar to maximize workspace', category: 'Global' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const categories = ['Navigation', 'Editing', 'Clipboard & History', 'Global'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-5 space-y-4 text-xs font-sans text-slate-800 dark:text-slate-100"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 id={titleId} className="font-bold text-slate-900 dark:text-white text-sm">
                Workbook Keyboard Shortcuts
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px]">?</kbd> anywhere in the workbook
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {cat}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SHORTCUTS.filter((s) => s.category === cat).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {item.action}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-[10px] font-mono font-bold text-slate-800 dark:text-slate-100 shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Excel-style navigation &amp; editing compliant</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
