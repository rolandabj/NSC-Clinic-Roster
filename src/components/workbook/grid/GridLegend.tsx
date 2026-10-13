import React from 'react';
import { Check, Clock, Edit2, Lock, Star, Stethoscope, Users, X } from 'lucide-react';
import type { DutyWindow, LeaveType } from '../../../types';

/** The grid's legend drawer: what the shifts, leave, marks and totals in the grid mean. */
export const GridLegend: React.FC<{ dutyWindows: DutyWindow[]; leaveTypes: LeaveType[]; onClose: () => void }> = ({
  dutyWindows,
  leaveTypes,
  onClose,
}) => (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 text-xs shadow-lg animate-in slide-in-from-right duration-150 z-30" role="region" aria-label="Legend">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <span className="font-bold text-slate-800">Legend</span>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          aria-label="Close legend"
          title="Close legend"
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
            Marks in a cell
          </h4>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
              <span>Pinned: kept when the roster is filled again</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-5 rounded border border-dashed border-amber-400 bg-amber-50 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                OFF
              </span>
              <span>Pinned day off</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit2 className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              <span>Hand change (not pinned)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative w-6 h-5 rounded border border-slate-300 bg-white shrink-0" aria-hidden="true">
                <span className="absolute top-0 right-0 w-0 h-0 border-t-8 border-l-8 border-t-red-600 border-l-transparent" />
              </span>
              <span>Problem with this shift: tap or point at the cell to read it</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-5 flex items-center justify-center shrink-0" aria-hidden="true">
                <span className="min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
              </span>
              <span>Problems about a whole day (on the day's heading) or a nurse (by the name); red must be fixed, amber to check</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-5 rounded border border-dashed border-amber-500 text-amber-600 font-bold text-[10px] flex items-center justify-center shrink-0"
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
              <span>Asked for this day off (hollow: waiting for approval)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 flex items-center justify-center gap-0.5 shrink-0" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-[1px] border border-sky-600 bg-sky-600" />
                <span className="w-1.5 h-1.5 rounded-[1px] border border-sky-600 bg-white" />
              </span>
              <span>Asked for a shift (point at the cell to see which)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 flex items-center justify-center gap-0.5 shrink-0" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500 bg-amber-500" />
                <span className="w-1.5 h-1.5 rounded-[1px] border border-amber-500 bg-amber-500" />
              </span>
              <span>Request not followed: a shift on a day asked off, or another shift than the one asked for</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold w-3.5 text-center shrink-0" aria-hidden="true">★</span>
              <span>Shift used first when filling</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-5 rounded text-teal-900 font-mono font-bold text-[10px] flex items-center justify-center bg-teal-100 border border-teal-300 shrink-0">
                NC
              </span>
              <span>Nurse Clinic (no doctor)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">#1</span>
              <span>One of the nurse’s usual doctors (1 = first choice)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 shrink-0">Pool</span>
              <span>Doctor shared by any nurse</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-1 rounded bg-rose-100 text-rose-800 border border-rose-300 shrink-0">!</span>
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
              <span className="w-6 h-5 rounded bg-slate-200 border border-slate-300 shrink-0" aria-hidden="true" />
              <span>Weekend</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-5 rounded bg-cyan-100 border border-cyan-300 shrink-0" aria-hidden="true" />
              <span>Public holiday (point at the date for its name)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-5 rounded bg-indigo-600 shrink-0" aria-hidden="true" />
              <span>Today</span>
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
