/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Tabs as the ARIA tabs pattern: one Tab stop, the arrow keys move between tabs, Home and End
 * go to the first and last, and the open tab shows its panel. They scroll sideways on a phone.
 *
 *   <Tabs label="Roster sheets" idPrefix="sheet" value={tab} onChange={setTab} tabs={[...]} />
 *   <TabPanel idPrefix="sheet" id="roster" value={tab}>...</TabPanel>
 */

import React, { useRef } from 'react';
import { TONE_CLASSES, type Tone } from './Badge';
import { cx } from './cx';

export interface TabItem {
  id: string;
  label: string;
  /** A number in a small pill after the label, such as the number of problems. */
  count?: number;
  countTone?: Tone;
}

/** Where a key moves from tab `index` of `count`, or null for keys the tabs do not use. */
export function nextTabIndex(key: string, index: number, count: number): number | null {
  switch (key) {
    case 'ArrowRight':
      return (index + 1) % count;
    case 'ArrowLeft':
      return (index - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}

export const Tabs: React.FC<{
  /** Read out as the name of the row of tabs. */
  label: string;
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** Keeps the ids of the tabs and panels apart when a screen has more than one row of tabs. */
  idPrefix: string;
  className?: string;
}> = ({ label, tabs, value, onChange, idPrefix, className }) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, tabs.findIndex((t) => t.id === value));
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = nextTabIndex(e.key, index, tabs.length);
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={cx('flex gap-1 overflow-x-auto border-b border-line px-2', className)}>
      {tabs.map((tab, i) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cx(
              '-mb-px inline-flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm whitespace-nowrap transition-colors duration-150',
              selected ? 'border-brand font-semibold text-brand-strong' : 'border-transparent font-medium text-ink-muted hover:text-ink'
            )}
          >
            {tab.label}
            {tab.count != null && (
              <span className={cx('rounded-full px-1.5 text-xs font-semibold tabular-nums', TONE_CLASSES[tab.countTone || 'neutral'])}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const TabPanel: React.FC<{
  idPrefix: string;
  id: string;
  value: string;
  /** For a panel with nothing that takes focus (a plain table), so the keyboard can reach it. */
  focusable?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ idPrefix, id, value, focusable, className, children }) => (
  <div
    role="tabpanel"
    id={`${idPrefix}-panel-${id}`}
    aria-labelledby={`${idPrefix}-tab-${id}`}
    hidden={id !== value}
    tabIndex={focusable ? 0 : undefined}
    className={className}
  >
    {children}
  </div>
);
