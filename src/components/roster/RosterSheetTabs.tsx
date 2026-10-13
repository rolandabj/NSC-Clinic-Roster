import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ProblemCounts, Tabs } from '../ui';
import type { ProblemTally } from '../../services/dashboard/problemCount';

/** The roster screen's sheets, in the order of their tabs. */
export type RosterSheet = 'roster' | 'doctors' | 'coverage' | 'warnings' | 'leave' | 'hours';

/** The one panel under the tabs, which shows the open sheet. */
export const ROSTER_SHEET_PANEL_ID = 'sheet-panel';

/**
 * The sheet tabs above the roster screen's content: the ARIA tabs pattern (one Tab stop, the
 * arrow keys, Home and End), the Problems tab with the one problem count, and Full screen once,
 * at the end of the row, so it is there on every sheet.
 */
export const RosterSheetTabs: React.FC<{
  active: RosterSheet;
  problems: ProblemTally;
  isFullScreen: boolean;
  onOpen: (sheet: RosterSheet) => void;
  onToggleFullScreen: () => void;
}> = ({ active, problems, isFullScreen, onOpen, onToggleFullScreen }) => (
  <div className="flex shrink-0 bg-surface select-none">
    <Tabs
      label="Roster sheets"
      idPrefix="sheet"
      panelId={ROSTER_SHEET_PANEL_ID}
      value={active}
      onChange={(id) => onOpen(id as RosterSheet)}
      className="min-w-0 flex-1"
      tabs={[
        { id: 'roster', label: 'Roster' },
        { id: 'doctors', label: 'Doctors' },
        { id: 'coverage', label: 'Coverage by hour' },
        { id: 'warnings', label: 'Problems', badge: <ProblemCounts {...problems} wordsFrom="xl" className="text-xs font-semibold" /> },
        { id: 'leave', label: 'Leave and pinned days' },
        { id: 'hours', label: 'Hours' },
      ]}
    />
    <div className="flex shrink-0 items-center border-b border-line px-2">
      <button
        type="button"
        onClick={onToggleFullScreen}
        aria-pressed={isFullScreen}
        title={isFullScreen ? 'Leave full screen (Esc)' : 'Full screen'}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-ink-muted hover:bg-sunken hover:text-ink pointer-coarse:h-11"
      >
        {isFullScreen ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
        {/* Only the icon below 1280 px, so the tabs fit a 1024 px laptop. */}
        <span className="sr-only xl:not-sr-only">Full screen</span>
      </button>
    </div>
  </div>
);
