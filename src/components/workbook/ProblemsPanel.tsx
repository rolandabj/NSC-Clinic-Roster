/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Side panel next to the roster grid listing the roster's problems, most
 * serious first, each with "Show in grid" so it can be fixed in place.
 */

import React, { useState } from 'react';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { ValidationReport, ValidationFinding, FindingSeverity } from '../../services/validation/ScheduleValidator';
import { formatDate } from '../../utils/dateUtils';

interface ProblemsPanelProps {
  validationReport: ValidationReport;
  nurseName: (nurseId: string) => string;
  onShowInGrid: (nurseId: string, date: string) => void;
  onOpenFullList: () => void;
  onClose: () => void;
}

const SEVERITY: Record<FindingSeverity, { label: string; order: number; icon: React.ReactNode; tone: string }> = {
  ERROR: { label: 'Must fix', order: 0, icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />, tone: 'border-rose-200 bg-rose-50' },
  WARN: { label: 'Check', order: 1, icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />, tone: 'border-amber-200 bg-amber-50' },
  INFO: { label: 'Note', order: 2, icon: <Info className="w-3.5 h-3.5 text-slate-500" />, tone: 'border-slate-200 bg-white' },
};

export const ProblemsPanel: React.FC<ProblemsPanelProps> = ({ validationReport, nurseName, onShowInGrid, onOpenFullList, onClose }) => {
  const [showNotes, setShowNotes] = useState(false);
  const all = [...validationReport.findings].sort(
    (a, b) => SEVERITY[a.severity].order - SEVERITY[b.severity].order || (a.date || '').localeCompare(b.date || '')
  );
  const notes = all.filter((f) => f.severity === 'INFO').length;
  const shown = showNotes ? all : all.filter((f) => f.severity !== 'INFO');

  const target = (f: ValidationFinding) => {
    const ref = f.cellRefs[0];
    if (ref) return ref;
    if (f.date && f.affectedNurseIds[0]) return { nurseId: f.affectedNurseIds[0], date: f.date };
    return null;
  };

  return (
    <aside
      aria-label="Problems"
      className="w-full sm:w-80 shrink-0 h-full flex flex-col bg-slate-50 border-l border-slate-200 text-xs absolute sm:static inset-0 z-30"
    >
      <div className="px-3 py-2 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
        <h2 className="font-bold text-slate-800 text-sm">
          Problems ({validationReport.errorCount + validationReport.warnCount})
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
          aria-label="Close problems"
          title="Close"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {shown.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" aria-hidden="true" />
            No problems found.
          </div>
        ) : (
          shown.map((f) => {
            const s = SEVERITY[f.severity];
            const cell = target(f);
            return (
              <div key={f.id} className={`rounded border p-2 space-y-1 ${s.tone}`}>
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0" aria-hidden="true">{s.icon}</span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">{s.label}</span>
                    <p className="text-slate-800 leading-snug">{f.message}</p>
                    {cell && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {nurseName(cell.nurseId)} · {formatDate(cell.date)}
                      </p>
                    )}
                  </div>
                </div>
                {cell && (
                  <button
                    type="button"
                    onClick={() => onShowInGrid(cell.nurseId, cell.date)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    Show in grid <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="px-3 py-2 border-t border-slate-200 bg-white flex items-center justify-between gap-2">
        {notes > 0 ? (
          <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
            <input type="checkbox" checked={showNotes} onChange={(e) => setShowNotes(e.target.checked)} />
            Show {notes} note{notes === 1 ? '' : 's'}
          </label>
        ) : (
          <span />
        )}
        <button type="button" onClick={onOpenFullList} className="text-[11px] font-semibold text-indigo-700 hover:underline cursor-pointer">
          Full list
        </button>
      </div>
    </aside>
  );
};
