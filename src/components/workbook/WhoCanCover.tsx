/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A short list for one day of who could fill a gap: nurses who are free, with
 * the shifts they could take and their hours, then nurses who are off with the
 * main reason. Shown under coverage gap problems.
 */

import React, { useMemo, useState } from 'react';
import { explainDay, ExplainDayInput, NurseDayExplanation } from '../../services/engine/explainCell';

/**
 * Props: everything explainDay needs (the roster data: schedule, assignments,
 * nurses, dutyWindows, leaveEntries, locks, roles, rules, and optionally
 * seniorityLevels, workingHoursPeriods, leaveTypes, sessions, doctors), plus:
 * - date: the day, YYYY-MM-DD.
 * - hour: optional "HH:MM"; only shifts on duty at that time are offered.
 * - onPick: optional; when given, each shift a nurse could take gets an "Add"
 *   button that calls onPick(nurseId, dutyWindowId). The parent makes the change.
 * - maxBlocked: how many nurses who are off to list before "Show all" (default 4).
 */
export interface WhoCanCoverProps extends ExplainDayInput {
  date: string;
  hour?: string;
  onPick?: (nurseId: string, dutyWindowId: string) => void;
  maxBlocked?: number;
}

const fmt = (n: number) => String(Math.round(n * 10) / 10);

const hoursText = (r: NurseDayExplanation) =>
  r.hours.goal > 0 ? `${fmt(r.hours.worked)} / ${fmt(r.hours.goal)} h` : `${fmt(r.hours.worked)} h`;

export const WhoCanCover: React.FC<WhoCanCoverProps> = ({ date, hour, onPick, maxBlocked = 4, ...data }) => {
  const [showAllBlocked, setShowAllBlocked] = useState(false);

  const { free, off } = useMemo(() => {
    const list = explainDay(date, data);
    const free: NurseDayExplanation[] = [];
    const off: { r: NurseDayExplanation; reason: string }[] = [];
    for (const r of list) {
      if (r.status === 'BLOCKED') {
        off.push({ r, reason: r.reasons[0] || 'Can’t work this day.' });
        continue;
      }
      const shifts = hour ? r.possibleShifts.filter((s) => s.startTime <= hour && s.endTime > hour) : r.possibleShifts;
      if (shifts.length > 0) free.push({ ...r, possibleShifts: shifts });
      else off.push({ r, reason: `Free this day, but no shift they could take covers ${hour}.` });
    }
    return { free, off };
  }, [
    date,
    hour,
    data.schedule,
    data.assignments,
    data.nurses,
    data.dutyWindows,
    data.leaveEntries,
    data.locks,
    data.roles,
    data.rules,
    data.seniorityLevels,
    data.workingHoursPeriods,
    data.hoursHistory,
    data.leaveTypes,
  ]);

  const shownOff = showAllBlocked ? off : off.slice(0, maxBlocked);

  return (
    <div className="text-[11px] font-sans space-y-1.5">
      <div>
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {hour ? `Free to work at ${hour}` : 'Free to work'}
        </span>
        {free.length === 0 ? (
          <span className="block text-slate-500">Nobody is free for this.</span>
        ) : (
          <ul className="space-y-1">
            {free.map((r) => (
              <li key={r.nurseId} className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="font-semibold text-slate-900">{r.nurseName}</span>
                <span className="text-slate-500">{hoursText(r)}</span>
                <span className="flex flex-wrap gap-1 ml-auto">
                  {r.possibleShifts.map((s) =>
                    onPick ? (
                      <button
                        key={s.dutyWindowId}
                        type="button"
                        onClick={() => onPick(r.nurseId, s.dutyWindowId)}
                        aria-label={`Add ${r.nurseName} on the ${s.name} shift, ${s.startTime} to ${s.endTime}; ${fmt(s.hoursAfter)} hours after`}
                        title={`${s.name}, ${s.startTime} to ${s.endTime} · ${fmt(s.hoursAfter)} h after`}
                        className="px-1.5 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-800 font-semibold hover:bg-indigo-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        Add {s.label}
                      </button>
                    ) : (
                      <span
                        key={s.dutyWindowId}
                        title={`${s.name}, ${s.startTime} to ${s.endTime} · ${fmt(s.hoursAfter)} h after`}
                        className="px-1 rounded border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
                      >
                        {s.label}
                      </span>
                    )
                  )}
                </span>
                {r.notes.length > 0 && <span className="basis-full text-amber-800 leading-snug">{r.notes[0]}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {off.length > 0 && (
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Can’t take it</span>
          <ul className="space-y-0.5">
            {shownOff.map(({ r, reason }) => (
              <li key={r.nurseId} className="leading-snug text-slate-600">
                <span className="font-semibold text-slate-800">{r.nurseName}</span>: {reason}
              </li>
            ))}
          </ul>
          {off.length > maxBlocked && (
            <button
              type="button"
              onClick={() => setShowAllBlocked((v) => !v)}
              aria-expanded={showAllBlocked}
              className="mt-0.5 font-semibold text-indigo-700 hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {showAllBlocked ? 'Show fewer' : `Show all ${off.length}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
