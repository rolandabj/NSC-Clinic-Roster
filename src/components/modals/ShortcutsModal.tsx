/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The keyboard shortcuts, opened with "?" anywhere or from the top bar. Only keys the app
 * really handles are listed (useGridKeyboard, useRosterEdits, AppShell). On the shared Dialog
 * since Phase 7, slice 3a, which also added Space, undo and redo.
 */

import React from 'react';
import { Button, Dialog } from '../ui';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GROUPS: { title: string; items: { keys: string[][]; action: string }[] }[] = [
  {
    title: 'Moving in the roster',
    items: [
      { keys: [['↑'], ['↓'], ['←'], ['→']], action: 'Move between cells, the hours and the day totals' },
      { keys: [['Tab'], ['Shift', 'Tab']], action: 'Next or previous day in the row' },
    ],
  },
  {
    title: 'Changing a cell',
    items: [
      { keys: [['Enter']], action: 'Open the full editor for the cell' },
      { keys: [['Space']], action: 'Open the quick choices for the cell' },
      { keys: [['Delete'], ['Backspace']], action: 'Clear the cell (asks first on a pinned day or leave)' },
      { keys: [['Ctrl', 'C']], action: 'Copy the cell' },
      { keys: [['Ctrl', 'V']], action: 'Paste into the cell' },
      { keys: [['Ctrl', 'Z']], action: 'Undo the last change' },
      { keys: [['Ctrl', 'Y'], ['Ctrl', 'Shift', 'Z']], action: 'Redo' },
    ],
  },
  {
    title: 'Anywhere',
    items: [
      { keys: [['Esc']], action: 'Close a dialog or a menu, or leave Full screen' },
      { keys: [['?']], action: 'Show these shortcuts' },
      { keys: [['Ctrl', '\\']], action: 'Hide or show the menu labels' },
    ],
  },
];

const Key: React.FC<{ children: string }> = ({ children }) => (
  <kbd className="rounded border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-xs font-semibold text-ink shadow-card">{children}</kbd>
);

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    size="lg"
    title="Keyboard shortcuts"
    description="On a Mac, use ⌘ where Ctrl is shown."
    footer={
      <Button variant="primary" onClick={onClose}>
        Close
      </Button>
    }
  >
    <div className="space-y-5 text-sm">
      {GROUPS.map((group) => (
        <section key={group.title} aria-label={group.title} className="space-y-2">
          <h3 className="font-semibold text-ink">{group.title}</h3>
          <dl className="divide-y divide-line rounded-lg border border-line">
            {group.items.map((item) => (
              <div key={item.action} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <dt className="text-ink">{item.action}</dt>
                <dd className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
                  {item.keys.map((combo, i) => (
                    <React.Fragment key={combo.join('+')}>
                      {i > 0 && <span>or</span>}
                      {combo.map((k, j) => (
                        <React.Fragment key={k}>
                          {j > 0 && <span aria-hidden="true">+</span>}
                          <Key>{k}</Key>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  </Dialog>
);
