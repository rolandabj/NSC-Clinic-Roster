/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fairness dialog: how hours, weekends, holidays and late shifts are shared
 * between nurses, and suggested shift moves that even them out.
 */

import { summarizeNurseHours } from '../../services/reports/hoursAccounting';
import { isWeekendDate, isWeekendDay } from '../../utils/weekend';
import React, { useState, useMemo, useId, useEffect, useRef } from 'react';
import {
  X,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Moon,
  Calendar,
  Clock,
  Sun,
  ShieldAlert,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Schedule,
  Assignment,
  Nurse,
  DutyWindow,
  PublicHoliday,
  SeniorityLevel,
  Rule,
  LeaveType,
  WorkingHoursPeriod,
  LeaveEntry,
  LockEntry,
  ClinicalRole,
} from '../../types';
import { getRepository } from '../../services/repository';
import { formatDate } from '../../utils/dateUtils';
import { checkAssignment } from '../../services/engine/assignmentChecks';
import { isLateDuty, lateDutyThreshold } from '../../services/engine/SchedulingEngine';
import { loadYearToDate, YearToDate } from '../../services/fairness/yearToDate';
import { useDialogA11y } from '../common/useDialogA11y';
import { notify, confirmDialog } from '../common/dialogs';
import { authService } from '../../services/auth/authService';

interface FairnessModalProps {
  schedule: Schedule;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  holidays: PublicHoliday[];
  seniorityLevels: SeniorityLevel[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  roles?: ClinicalRole[];
  rules?: Rule[];
  leaveTypes?: LeaveType[];
  workingHoursPeriods?: WorkingHoursPeriod[];
  isOpen: boolean;
  onClose: () => void;
  onApplyAssignments: (updated: Assignment[], note: string) => void;
}

export interface NurseFairnessMetrics {
  nurse: Nurse;
  totalDutyHours: number;
  targetHours: number;
  hoursDelta: number;
  weekendsWorked: number;
  weekendsOff: number;
  holidaysWorked: number;
  lateEndsCount: number;
}

export interface ProposedSwap {
  id: string;
  date: string;
  dutyName: string;
  overloadedNurse: Nurse;
  underloadedNurse: Nurse;
  assignmentA: Assignment;
  assignmentB?: Assignment;
  reason: string;
}

export const FairnessModal: React.FC<FairnessModalProps> = ({
  schedule,
  assignments,
  nurses,
  dutyWindows,
  holidays,
  seniorityLevels,
  leaveEntries,
  locks,
  roles = [],
  rules = [],
  isOpen,
  onClose,
  onApplyAssignments,
  leaveTypes = [],
  workingHoursPeriods = [],
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'REBALANCE'>('METRICS');
  const [selectedSwaps, setSelectedSwaps] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);

  const dutyMap = useMemo(() => new Map(dutyWindows.map((d) => [d.id, d])), [dutyWindows]);
  const holidayDateSet = useMemo(() => new Set(holidays.map((h) => h.date)), [holidays]);
  // Late means the same as for the generator: ending at or after the late duties rule's time.
  const lateThreshold = useMemo(() => lateDutyThreshold(rules), [rules]);

  // Totals from the earlier rosters this year (as published), loaded when the dialog opens.
  const [yearToDate, setYearToDate] = useState<YearToDate | null>(null);
  const [yearStatus, setYearStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  // Reload only when what the totals depend on changes (the role list may be a new array each time).
  const yearInputs = useRef({ schedule, dutyWindows, holidays, roles });
  yearInputs.current = { schedule, dutyWindows, holidays, roles };
  const yearKey = [
    schedule.id,
    schedule.startDate,
    lateThreshold,
    dutyWindows.map((d) => `${d.id}${d.endTime}`).join(','),
    holidays.map((h) => h.date).join(','),
    roles.map((r) => r.id).join(','),
  ].join('|');
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setYearStatus('loading');
    const { schedule, dutyWindows, holidays, roles } = yearInputs.current;
    loadYearToDate(getRepository(), schedule, dutyWindows, holidays.map((h) => h.date), { lateThreshold, roles })
      .then((ytd) => {
        if (cancelled) return;
        setYearToDate(ytd);
        setYearStatus('ready');
      })
      .catch((err) => {
        console.warn('Could not load the totals for this year:', err);
        if (!cancelled) setYearStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, yearKey]);

  // Compute metrics per nurse
  const metrics: NurseFairnessMetrics[] = useMemo(() => {
    return nurses.map((nurse) => {
      const nurseAsgns = assignments.filter((a) => a.nurseId === nurse.id);
      let totalDutyHours = 0;
      let lateEndsCount = 0;
      let holidaysWorked = 0;
      let weekendsWorked = 0;

      const workingDates = new Set<string>();

      for (const a of nurseAsgns) {
        workingDates.add(a.date);
        const dw = dutyMap.get(a.dutyWindowId);
        if (dw) {
          const [sh, sm] = dw.startTime.split(':').map(Number);
          const [eh, em] = dw.endTime.split(':').map(Number);
          let mins = eh * 60 + em - (sh * 60 + sm);
          if (mins < 0) mins += 24 * 60;
          totalDutyHours += mins / 60;

          // Late ends (at or after the late time)
          if (isLateDuty(dw, lateThreshold)) {
            lateEndsCount++;
          }
        }

        // Public holidays worked
        if (holidayDateSet.has(a.date)) {
          holidaysWorked++;
        }

        // Weekend duty (the clinic's weekend days)
        if (isWeekendDate(a.date)) {
          weekendsWorked++;
        }
      }

      // Total weekend days in schedule
      let totalWeekendDays = 0;
      const start = new Date(schedule.startDate);
      const end = new Date(schedule.endDate);
      const cur = new Date(start);
      while (cur <= end) {
        const day = cur.getUTCDay();
        if (isWeekendDay(day)) totalWeekendDays++;
        cur.setUTCDate(cur.getUTCDate() + 1);
      }

      const weekendsOff = Math.max(0, totalWeekendDays - weekendsWorked);
      // Hours and goal by the shared rule (leave counts, period targets apply), as in the Hours tab.
      const summary = summarizeNurseHours(nurse, schedule, assignments, dutyMap, leaveEntries, leaveTypes, workingHoursPeriods);
      totalDutyHours = Math.round(summary.totalHours * 10) / 10;
      const targetHours = summary.targetHours;
      const hoursDelta = Math.round((totalDutyHours - targetHours) * 10) / 10;

      return {
        nurse,
        totalDutyHours,
        targetHours,
        hoursDelta,
        weekendsWorked,
        weekendsOff,
        holidaysWorked,
        lateEndsCount,
      };
    });
  }, [nurses, assignments, dutyMap, holidayDateSet, schedule, leaveEntries, leaveTypes, workingHoursPeriods, lateThreshold]);

  /** This year so far: the earlier rosters plus this one. */
  const thisYear = (m: NurseFairnessMetrics) => {
    const ytd = yearToDate?.[m.nurse.id];
    return {
      weekendDays: (ytd?.weekendDays || 0) + m.weekendsWorked,
      lateShifts: (ytd?.lateShifts || 0) + m.lateEndsCount,
      holidays: (ytd?.holidays || 0) + m.holidaysWorked,
    };
  };
  const showYear = yearStatus === 'ready' && !!yearToDate;

  // Compute Overall Balance Spread Score (0 - 100)
  const spreadScore = useMemo(() => {
    if (metrics.length === 0) return 100;
    const hourDeltas = metrics.map((m) => Math.abs(m.hoursDelta));
    const avgDelta = hourDeltas.reduce((a, b) => a + b, 0) / hourDeltas.length;
    const lateCounts = metrics.map((m) => m.lateEndsCount);
    const maxLate = Math.max(...lateCounts, 0);
    const minLate = lateCounts.length > 0 ? Math.min(...lateCounts) : 0;
    const lateSpread = maxLate - minLate;

    // Penalty based on hour variance and late spread
    let score = 100 - avgDelta * 1.5 - lateSpread * 4;
    return Math.max(10, Math.min(100, Math.round(score)));
  }, [metrics]);

  // Generate safe parity swaps for Rebalance mode
  const proposedSwaps = useMemo<ProposedSwap[]>(() => {
    if (metrics.length < 2) return [];

    // Sort by hoursDelta descending
    const sorted = [...metrics].sort((a, b) => b.hoursDelta - a.hoursDelta);
    const overloaded = sorted.filter((m) => m.hoursDelta > 4 || m.lateEndsCount >= 4);
    const underloaded = sorted.filter((m) => m.hoursDelta < -4 || m.lateEndsCount <= 1);

    const swaps: ProposedSwap[] = [];
    // Each proposal is checked against the roster as it would be after the
    // proposals before it, so two proposals never double book a nurse.
    let working = [...assignments];
    const usedAssignmentIds = new Set<string>();

    for (const over of overloaded) {
      for (const under of underloaded) {
        if (over.nurse.id === under.nurse.id) continue;

        const candidates = working.filter(
          (a) => a.nurseId === over.nurse.id && a.source !== 'LOCK' && !a.locked && !usedAssignmentIds.has(a.id)
        );

        for (const asgn of candidates) {
          const moved: Assignment = { ...asgn, nurseId: under.nurse.id };
          const next = working.map((a) => (a.id === asgn.id ? moved : a));
          const problems = checkAssignment(
            { assignments: next, nurses, dutyWindows, leaveEntries, locks, roles, rules },
            moved
          );
          if (problems.length > 0) continue;

          working = next;
          usedAssignmentIds.add(asgn.id);
          const dw = dutyMap.get(asgn.dutyWindowId);
          swaps.push({
            id: `swap-${asgn.id}-${under.nurse.id}`,
            date: asgn.date,
            dutyName: dw ? `${dw.name} (${dw.startTime}–${dw.endTime})` : 'Shift',
            overloadedNurse: over.nurse,
            underloadedNurse: under.nurse,
            assignmentA: asgn,
            reason:
              over.hoursDelta > 0
                ? `${over.nurse.fullName} is ${over.hoursDelta}h over their goal`
                : `${over.nurse.fullName} has many late shifts`,
          });

          if (swaps.length >= 6) break;
        }
        if (swaps.length >= 6) break;
      }
      if (swaps.length >= 6) break;
    }

    return swaps;
  }, [metrics, assignments, dutyMap, locks, leaveEntries, nurses, dutyWindows, roles, rules]);

  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const handleApplyRebalance = async () => {
    const swapsToApply = proposedSwaps.filter((s) => selectedSwaps.has(s.id));
    if (swapsToApply.length === 0) return;
    const n = swapsToApply.length;
    const nurseCount = new Set(swapsToApply.flatMap((s) => [s.overloadedNurse.id, s.underloadedNurse.id])).size;
    const ok = await confirmDialog({
      title: 'Move these shifts?',
      message: `${n} shift${n === 1 ? '' : 's'} will move to another nurse (${nurseCount} nurses affected). You can undo this afterwards.`,
      confirmLabel: `Move ${n} shift${n === 1 ? '' : 's'}`,
    });
    if (!ok) return;
    setIsApplying(true);
    try {

      const updated = assignments.map((a) => {
        const swap = swapsToApply.find((s) => s.assignmentA.id === a.id);
        if (swap) {
          return {
            ...a,
            nurseId: swap.underloadedNurse.id,
            source: 'GENERATED' as const,
            note: `Rebalanced from ${swap.overloadedNurse.fullName}`,
          };
        }
        return a;
      });

      // Audit entry
      const repo = getRepository();
      await repo.create('audit', {
        actor: authService.getCurrentUser()?.name || authService.getCurrentUser()?.email || 'Planner',
        action: 'REBALANCE',
        entity: 'Schedule',
        entityId: schedule.id,
        note: `Moved ${n} shifts to even out the roster (fairness suggestions).`,
        timestamp: new Date().toISOString(),
      });

      onApplyAssignments(updated, `Moved ${n} shift${n === 1 ? '' : 's'} to even out the roster`);
      onClose();
    } catch (err: any) {
      notify(`Couldn't move the shifts: ${err.message}`, 'error');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs font-sans text-slate-800"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="text-base font-bold text-slate-900">
                  Fairness
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {schedule.name} · how evenly the work is shared, and suggested changes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Global Summary Bar */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Fairness score:</span>
              <span
                className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded border ${
                  spreadScore >= 80
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : spreadScore >= 60
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}
              >
                {spreadScore} / 100
              </span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="text-slate-600 text-[11px]">
              Higher is fairer. Looks at how far each nurse is from their hours goal and how evenly late shifts (ending {lateThreshold} or later) are shared.
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('METRICS')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'METRICS'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Each nurse
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('REBALANCE');
                setSelectedSwaps(new Set(proposedSwaps.map((s) => s.id)));
              }}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === 'REBALANCE'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              <span>Suggested changes ({proposedSwaps.length})</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'METRICS' && (
            <div className="space-y-4">
              {yearStatus === 'loading' && (
                <p className="text-[11px] text-slate-500" role="status">
                  Loading…
                </p>
              )}
              {showYear && (
                <p className="text-[11px] text-slate-500">
                  "This year" adds up the earlier rosters of {schedule.startDate.slice(0, 4)} (as published) and this roster.
                </p>
              )}
              <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Nurse</th>
                      <th className="py-2.5 px-3">Contract</th>
                      <th className="py-2.5 px-3">Goal</th>
                      <th className="py-2.5 px-3">Hours (shifts + leave)</th>
                      <th className="py-2.5 px-3">Difference from goal</th>
                      <th className="py-2.5 px-3">Weekend days off</th>
                      <th className="py-2.5 px-3">Holidays worked</th>
                      <th className="py-2.5 px-3">Late shifts (end {lateThreshold} or later)</th>
                      {showYear && (
                        <>
                          <th className="py-2.5 px-3 border-l border-slate-200">This year: weekend days worked</th>
                          <th className="py-2.5 px-3">This year: late shifts</th>
                          <th className="py-2.5 px-3">This year: holidays worked</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {metrics.map((m) => (
                      <tr key={m.nurse.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-sans font-bold text-slate-900">
                          {m.nurse.fullName}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{m.nurse.contractPercent}%</td>
                        <td className="py-3 px-3 text-slate-600">{m.targetHours}h</td>
                        <td className="py-3 px-3 font-bold text-indigo-700">{m.totalDutyHours}h</td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                              Math.abs(m.hoursDelta) <= 2
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.hoursDelta > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {m.hoursDelta >= 0 ? `+${m.hoursDelta}h` : `${m.hoursDelta}h`}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{m.weekendsOff} days</td>
                        <td className="py-3 px-3 text-slate-700">{m.holidaysWorked}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                              m.lateEndsCount >= 4
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {m.lateEndsCount} shifts
                          </span>
                        </td>
                        {showYear && (
                          <>
                            <td className="py-3 px-3 text-slate-700 border-l border-slate-100">{thisYear(m).weekendDays} days</td>
                            <td className="py-3 px-3 text-slate-700">{thisYear(m).lateShifts} shifts</td>
                            <td className="py-3 px-3 text-slate-700">{thisYear(m).holidays}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'REBALANCE' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded text-xs space-y-1">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                  <span>Suggested shift moves</span>
                </div>
                <p className="text-indigo-900 text-[11px] leading-relaxed">
                  These move a shift from a nurse with too many hours or many late shifts to a nurse with fewer. Each move is checked against the rules that are never broken, and the nurse must be able to do the shift. Pinned shifts are never moved.
                </p>
              </div>

              {proposedSwaps.length > 0 ? (
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-xs">
                    Suggested moves ({proposedSwaps.length}):
                  </span>

                  <div className="space-y-2">
                    {proposedSwaps.map((s) => {
                      const isSelected = selectedSwaps.has(s.id);
                      return (
                        <label
                          key={s.id}
                          className={`p-3 rounded border transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/40 text-slate-900'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                const next = new Set(selectedSwaps);
                                if (isSelected) next.delete(s.id);
                                else next.add(s.id);
                                setSelectedSwaps(next);
                              }}
                              className="rounded text-indigo-600 pointer-events-none"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{formatDate(s.date)}</span>
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px]">
                                  {s.dutyName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-[11px]">
                                <span className="text-rose-700 font-medium">
                                  {s.overloadedNurse.fullName}
                                </span>
                                <ArrowRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
                                <span className="text-emerald-700 font-bold">
                                  {s.underloadedNurse.fullName}
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="text-[11px] text-slate-500 font-mono">{s.reason}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-slate-200 rounded text-center text-slate-400 text-xs">
                  No moves to suggest. The work is already shared as evenly as the rules allow.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium cursor-pointer"
          >
            Close
          </button>

          {activeTab === 'REBALANCE' && proposedSwaps.length > 0 && (
            <button
              type="button"
              disabled={selectedSwaps.size === 0 || isApplying}
              onClick={handleApplyRebalance}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer shadow-xs disabled:opacity-40"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Move {selectedSwaps.size} shift{selectedSwaps.size === 1 ? '' : 's'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
