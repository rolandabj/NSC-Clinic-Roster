import React from 'react';
import { Check, Clock, OctagonAlert, Pencil, Pin, Star, Stethoscope, TriangleAlert, Users, X } from 'lucide-react';
import type { DutyWindow, LeaveType } from '../../../types';

/** The id of the Key drawer, which the Key button names. */
export const GRID_KEY_ID = 'grid-key';

/**
 * The Key drawer beside the grid: what the shifts, leave, marks, days, totals and hours in the grid
 * mean. It is the only key: the Key sheet it replaced (Phase 4, slice 2) showed the shifts and leave again.
 */
export const GridLegend: React.FC<{ dutyWindows: DutyWindow[]; leaveTypes: LeaveType[]; onClose: () => void }> = ({
  dutyWindows,
  leaveTypes,
  onClose,
}) => (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 text-xs shadow-lg animate-in slide-in-from-right duration-150 z-30" id={GRID_KEY_ID} role="region" aria-label="Key">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="font-bold text-slate-800 text-sm">Key</h2>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          aria-label="Close the key"
          title="Close the key"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
            Shifts
          </h4>
          <div className="space-y-1">
            {dutyWindows.map((dw) => (
              <div key={dw.id} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="min-w-5 h-5 px-0.5 rounded text-white font-mono font-bold text-[10px] flex items-center justify-center"
                    style={{ backgroundColor: dw.color }}
                  >
                    {dw.acronym}
                  </span>
                  <span className="text-slate-800 font-medium">{dw.name}</span>
                  {dw.isPriority && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                      Used first
                    </span>
                  )}
                </div>
                <span className="font-mono text-slate-500 text-[10px]">
                  {dw.startTime} to {dw.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
            Leave and days off
          </h4>
          <div className="space-y-1">
            {leaveTypes.map((lt) => (
              <div key={lt.id} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="min-w-5 h-5 px-0.5 rounded text-white font-mono font-bold text-[10px] flex items-center justify-center"
                    style={{ backgroundColor: lt.color }}
                  >
                    {lt.acronym}
                  </span>
                  <span className="text-slate-800">{lt.name}</span>
                </div>
                <span className="font-mono text-slate-500 text-[10px]">
                  {typeof lt.creditedHours === 'number' ? `${lt.creditedHours} h a day` : '8 h a day'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
            A cell
          </h4>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-12 h-12 rounded-sm border-l-3 px-1 flex flex-col justify-center leading-tight text-ink shrink-0" style={{ backgroundColor: '#eef2ff', borderLeftColor: '#4f46e5' }} aria-hidden="true">
                <span className="font-semibold text-[11px]">Lee</span>
                <span className="text-ink-muted text-[10px]">09:00</span>
                <span className="text-ink-muted text-[10px]">17:00</span>
              </span>
              <span>The doctor's first name, the role or the leave on the first line, the start time and the marks on the second, the end time on the third; the edge has the shift's colour</span>
            </div>
            <div className="flex items-center gap-2">
              <Pin className="w-3.5 h-3.5 text-brand-strong shrink-0" aria-hidden="true" />
              <span>Pinned: kept when the roster is filled again</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 h-5 rounded-sm bg-sunken text-ink-muted font-semibold text-[10px] flex items-center justify-center shrink-0" aria-hidden="true">
                Day off
              </span>
              <span>Pinned day off</span>
            </div>
            <div className="flex items-center gap-2">
              <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              <span>Changed by hand (not pinned)</span>
            </div>
            <div className="flex items-center gap-2">
              <OctagonAlert className="w-3.5 h-3.5 text-danger shrink-0" aria-hidden="true" />
              <span>Must fix: a problem with this shift (the cell also has a red line); point at the cell to read it</span>
            </div>
            <div className="flex items-center gap-2">
              <TriangleAlert className="w-3.5 h-3.5 text-warning shrink-0" aria-hidden="true" />
              <span>Check: a problem with this shift that may be fine</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 inline-flex items-center gap-0.5 text-xs font-semibold text-danger shrink-0" aria-hidden="true">
                <OctagonAlert className="w-3.5 h-3.5" />2
              </span>
              <span>Problems about a whole day (under the day's heading) or a nurse (by the name). Each has an icon and a number. The day totals and the hours list them too, reached with the arrow keys.</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-5 rounded border border-dashed border-amber-500 text-ink-muted font-bold text-[10px] flex items-center justify-center shrink-0"
                style={{ backgroundImage: 'repeating-linear-gradient(135deg, #f59e0b40 0 3px, transparent 3px 7px)' }}
                aria-hidden="true"
              >
                AL
              </span>
              <span>Leave asked for, waiting for approval</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
              <span>Leave waiting for approval on a day with a shift</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 flex items-center justify-center gap-0.5 shrink-0" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full border border-sky-600 bg-sky-600" />
                <span className="w-1.5 h-1.5 rounded-full border border-sky-600 bg-white" />
              </span>
              <span>Top right: asked for this day off (hollow: waiting for approval)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 flex items-center justify-center gap-0.5 shrink-0" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-[1px] border border-sky-600 bg-sky-600" />
                <span className="w-1.5 h-1.5 rounded-[1px] border border-sky-600 bg-white" />
              </span>
              <span>Top right: asked for a shift (point at the cell to see which)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 flex items-center justify-center gap-0.5 shrink-0" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500 bg-amber-500" />
                <span className="w-1.5 h-1.5 rounded-[1px] border border-amber-500 bg-amber-500" />
              </span>
              <span>Request not followed: a shift on a day asked off, or another shift than the one asked for</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-[11px] font-semibold text-ink shrink-0">NC</span>
              <span>Nurse Clinic (no doctor)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-[11px] font-semibold text-ink shrink-0">Float</span>
              <span>Float: not with a doctor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-bold text-ink-muted shrink-0">#1</span>
              <span>One of the nurse’s usual doctors (1 = first choice)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-bold text-ink-muted shrink-0">Pool</span>
              <span>Doctor shared by any nurse</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0"><span className="text-[10px] font-bold px-0.5 rounded-sm bg-danger-soft text-danger">!</span></span>
              <span>Not one of the nurse’s usual doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-bold" aria-hidden="true">🩸</span>
              <span>Blood collection and IV nurse</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
            Days
          </h4>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-6 h-5 rounded-sm bg-sunken border border-line shrink-0" aria-hidden="true" />
              <span>Weekend</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-5 rounded-sm bg-cyan-50 border border-line shrink-0 flex items-center justify-center" aria-hidden="true">
                <span className="size-1.5 rounded-full bg-cyan-600" />
              </span>
              <span>Public holiday (point at the date for its name)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-5 rounded-sm bg-surface border border-line shadow-[inset_0_-3px_0_var(--color-brand)] shrink-0" aria-hidden="true" />
              <span>Today (a brand line under the date)</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
            Day totals (under the grid)
          </h4>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>Doctors in session that day</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>Nurses on duty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-px text-[10px] font-bold text-rose-700 shrink-0">
                <Clock className="w-2.5 h-2.5" aria-hidden="true" />2 h
              </span>
              <span>
                Opening hours without a free nurse (<Check className="inline w-3 h-3 text-emerald-600" aria-label="check mark" /> when every hour has one)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-rose-700 whitespace-nowrap shrink-0">No senior</span>
              <span>No senior nurse on duty that day</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
            Hours
          </h4>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-6 h-1.5 rounded bg-emerald-500 shrink-0" aria-hidden="true" />
              <span>Within about 2 h of the goal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-1.5 rounded bg-amber-500 shrink-0" aria-hidden="true" />
              <span>Short of the goal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-1.5 rounded overflow-hidden flex shrink-0" aria-hidden="true">
                <span className="w-4 bg-emerald-500" />
                <span className="w-2 bg-rose-500" />
              </span>
              <span>Over the goal (red part = hours over)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
);
