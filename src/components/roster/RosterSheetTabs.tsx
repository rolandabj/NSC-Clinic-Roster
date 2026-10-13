import React from 'react';

/** The roster screen's sheets, in the order of their tabs. */
export type RosterSheet = 'roster' | 'doctors' | 'coverage' | 'warnings' | 'leave' | 'hours' | 'legend';

/** The sheet tabs along the bottom of the roster screen (Phase 4 moves them above the content). */
export const RosterSheetTabs: React.FC<{
  active: RosterSheet;
  /** Must fix and Check together, for the Problems tab. */
  problemCount: number;
  onOpen: (sheet: RosterSheet) => void;
}> = ({ active, problemCount, onOpen }) => (
  <div className="h-9 bg-slate-200 border-t border-slate-300 px-2 flex items-center gap-1 shrink-0 overflow-x-auto select-none">
    {(
      [
        { id: 'roster', label: 'Roster' },
        { id: 'doctors', label: 'Doctors' },
        { id: 'coverage', label: 'Coverage by hour' },
        { id: 'warnings', label: `Problems (${problemCount})` },
        { id: 'leave', label: 'Leave and pinned days' },
        { id: 'hours', label: 'Hours' },
        { id: 'legend', label: 'Key' },
      ] as { id: RosterSheet; label: string }[]
    ).map((tab) => (
      <button
        key={tab.id}
        onClick={() => onOpen(tab.id)}
        aria-current={active === tab.id ? 'page' : undefined}
        className={`px-3 py-1 text-xs font-medium rounded-t transition-colors cursor-pointer border-t border-x ${
          active === tab.id
            ? 'bg-white text-indigo-700 border-slate-300 shadow-xs font-bold'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-50 border-transparent hover:text-slate-900'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
