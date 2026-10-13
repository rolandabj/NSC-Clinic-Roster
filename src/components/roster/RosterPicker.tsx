import React, { useId } from 'react';
import { ChevronRight, FolderOpen, Plus, Trash2, X } from 'lucide-react';
import type { Schedule } from '../../types';
import { useDialogA11y } from '../common/useDialogA11y';
import { formatDate } from '../../utils/dateUtils';

interface RosterPickerProps {
  schedules: Schedule[];
  activeScheduleId?: string;
  /** The roster's hours goal as a short chip (for example "184h Target"), with its tooltip. */
  periodChipOf: (s: Schedule) => { label: string; tooltip: string; isExact: boolean };
  onClose: () => void;
  /** Another roster was chosen (the dialog has closed). */
  onPick: (s: Schedule) => void;
  onDelete: (s: Schedule) => void;
  onNew: () => void;
}

/** "Open a roster": the list of rosters, newest first, with Delete, and New roster. */
export const RosterPicker: React.FC<RosterPickerProps> = ({ schedules, activeScheduleId, periodChipOf, onClose, onPick, onDelete, onNew }) => {
  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(true, onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <h3 id={titleId} className="text-sm font-bold text-slate-900">Open a roster</h3>
          </div>
          <button
            onClick={() => onClose()}
            className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Close"
            title="Close"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* My Schedules Section */}
        <div className="space-y-2">
          <span className="font-bold text-slate-800 text-xs block">Rosters</span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {[...schedules].sort((a, b) => b.startDate.localeCompare(a.startDate)).map((s) => {
              const isActive = s.id === activeScheduleId;
              const pickSchedule = () => {
                onClose();
                if (s.id !== activeScheduleId) onPick(s);
              };
              return (
                // Not a <button>: it holds the delete button
                <div
                  key={s.id}
                  onClick={pickSchedule}
                  role="button"
                  tabIndex={0}
                  aria-current={isActive ? 'true' : undefined}
                  onKeyDown={(e) => {
                    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      pickSchedule();
                    }
                  }}
                  className={`p-3 rounded border cursor-pointer transition-colors flex items-center justify-between ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{s.name}</span>
                      {isActive && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]">
                          Open now
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                        {s.status === 'PUBLISHED' ? 'Published' : 'Draft'} · v{s.activeVersionNumber || 1}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {formatDate(s.startDate)} to {formatDate(s.endDate)} · full time goal {s.hoursTargetFullTime} h
                    </p>
                    {(() => {
                      const chip = periodChipOf(s);
                      return (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                              chip.isExact
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}
                            title={chip.tooltip}
                          >
                            {chip.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(s);
                      }}
                      className="p-1.5 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title={`Delete roster "${s.name}"`}
                      aria-label={`Delete roster "${s.name}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNew();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>New roster</span>
          </button>

          <button
            type="button"
            onClick={() => onClose()}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
