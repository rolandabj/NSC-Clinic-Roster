/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fairness dialog: how hours, weekends, holidays and late shifts are shared
 * between nurses, and suggested shift moves that even them out. The moves are
 * checked as the roster check would see them (handMoveChecks): never outside a
 * nurse's list, and never leaving a new or bigger "Must fix".
 */

import type { HoursHistory } from '../../services/hours/hoursBalance';

import { summarizeNurseHours } from '../../services/reports/hoursAccounting';
import { isWeekendDate, isWeekendDay } from '../../utils/weekend';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Schedule,
  Assignment,
  AvailabilityRequest,
  Nurse,
  Doctor,
  DoctorSession,
  DutyWindow,
  PublicHoliday,
  SeniorityLevel,
  Rule,
  LeaveType,
  WorkingHoursPeriod,
  LeaveEntry,
  LockEntry,
  ClinicalRole,
  Specialty,
} from '../../types';
import { getRepository } from '../../services/repository';
import { formatDate } from '../../utils/dateUtils';
import { MoveSuggestion, newFindings, rebalancedFields, RosterCheck, suggestMoves } from '../../services/engine/handMoveChecks';
import { isLateDuty, lateDutyThreshold } from '../../services/engine/SchedulingEngine';
import { loadYearToDate, YearToDate } from '../../services/fairness/yearToDate';
import { Badge, Button, Checkbox, DataTable, Dialog, EmptyState, LoadingState, Notice, TabPanel, Tabs, cx, type Column } from '../ui';
import { notify, confirmDialog } from '../common/dialogs';
import { authService } from '../../services/auth/authService';
import { moveShift } from '../../services/schedule/shiftMoves';
import { fetchRosterInsights } from '../../services/gemini/geminiService';

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
  hoursHistory?: HoursHistory;
  /** For the nurses' lists: a move never gives a nurse a doctor outside it. */
  doctors?: Doctor[];
  specialties?: Specialty[];
  sessions?: DoctorSession[];
  /** The nurses' requests: an approved day off is a day off. */
  availabilityRequests?: AvailabilityRequest[];
  /** Shifts from the roster just before this one, for rest and days in a row at its start. */
  priorAssignments?: Assignment[];
  /** The roster check on a changed list of shifts, with everything else as now. */
  checkRoster: RosterCheck;
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

export type ProposedSwap = MoveSuggestion;

/** One empty list for absent props, so the suggestions aren't worked out again on every render. */
const NONE: never[] = [];

export const FairnessModal: React.FC<FairnessModalProps> = ({
  schedule,
  assignments,
  nurses,
  dutyWindows,
  holidays,
  seniorityLevels,
  leaveEntries,
  locks,
  roles = NONE,
  rules = NONE,
  isOpen,
  onClose,
  onApplyAssignments,
  leaveTypes = NONE,
  workingHoursPeriods = NONE,
  hoursHistory,
  doctors = NONE,
  specialties = NONE,
  sessions = NONE,
  availabilityRequests = NONE,
  priorAssignments = NONE,
  checkRoster,
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'REBALANCE' | 'AI_INSIGHTS'>('METRICS');
  const [selectedSwaps, setSelectedSwaps] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const dutyMap = useMemo(() => new Map(dutyWindows.map((d) => [d.id, d])), [dutyWindows]);
  const holidayDateSet = useMemo(() => new Set(holidays.map((h) => h.date)), [holidays]);
  // Late means the same as for the generator: ending at or after the late duties rule's time.
  const lateThreshold = useMemo(() => lateDutyThreshold(rules), [rules]);

  // Totals from the earlier published rosters this year (as saved now), loaded when the dialog opens.
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
      const summary = summarizeNurseHours(nurse, schedule, assignments, dutyMap, leaveEntries, leaveTypes, workingHoursPeriods, undefined, hoursHistory);
      totalDutyHours = Math.round(summary.totalHours * 10) / 10;
      const targetHours = summary.targetHours;
      const hoursDelta = summary.closingBalanceHours;

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
  }, [nurses, assignments, dutyMap, holidayDateSet, schedule, leaveEntries, leaveTypes, workingHoursPeriods, hoursHistory, lateThreshold]);

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

  // Suggested moves, worked out once their tab is first opened (and again when the roster
  // changes): each one runs the roster check, which takes a moment on a big roster.
  // Null while that runs.
  const [proposedSwaps, setProposedSwaps] = useState<ProposedSwap[] | null>(null);
  const [suggestionsOpened, setSuggestionsOpened] = useState(false);
  useEffect(() => {
    if (!isOpen || !suggestionsOpened) return;
    setProposedSwaps(null);
    // A moment first, so "Checking…" shows before the work starts.
    const timer = setTimeout(() => {
      const sorted = [...metrics].sort((a, b) => b.hoursDelta - a.hoursDelta);
      const list =
        metrics.length < 2
          ? []
          : suggestMoves({
              overloaded: sorted.filter((m) => m.hoursDelta > 4 || m.lateEndsCount >= 4),
              underloaded: sorted.filter((m) => m.hoursDelta < -4 || m.lateEndsCount <= 1),
              assignments,
              prior: priorAssignments,
              ctx: { nurses, dutyWindows, leaveEntries, locks, roles, rules, availabilityRequests, doctors, specialties, sessions },
              checkRoster,
            });
      setProposedSwaps(list);
      setSelectedSwaps(new Set(list.map((s) => s.id)));
    }, 30);
    return () => clearTimeout(timer);
  }, [
    isOpen,
    suggestionsOpened,
    metrics,
    assignments,
    priorAssignments,
    nurses,
    dutyWindows,
    leaveEntries,
    locks,
    roles,
    rules,
    availabilityRequests,
    doctors,
    specialties,
    sessions,
    checkRoster,
  ]);

  if (!isOpen) return null;

  const handleApplyRebalance = async () => {
    const swapsToApply = (proposedSwaps || []).filter((s) => selectedSwaps.has(s.id));
    if (swapsToApply.length === 0) return;
    const n = swapsToApply.length;
    const nurseCount = new Set(swapsToApply.flatMap((s) => [s.overloadedNurse.id, s.underloadedNurse.id])).size;
    const updated = assignments.map((a) => {
      const swap = swapsToApply.find((s) => s.assignmentA.id === a.id);
      // A moved shift gets a new id (see shiftMoves).
      return swap ? moveShift(a, swap.underloadedNurse.id, rebalancedFields(swap.overloadedNurse)) : a;
    });
    // The moves were checked one after the other; the ones chosen are checked again together.
    const added = newFindings(checkRoster(assignments), checkRoster(updated), 'ERROR');
    if (added.length > 0) {
      notify(`These moves together would add a Must fix, or make one bigger: ${added[0].message} Untick a move and try again.`, 'error');
      return;
    }
    const ok = await confirmDialog({
      title: 'Move these shifts?',
      message: `${n} shift${n === 1 ? '' : 's'} will move to another nurse (${nurseCount} nurses affected). You can undo this afterwards.`,
      confirmLabel: `Move ${n} shift${n === 1 ? '' : 's'}`,
    });
    if (!ok) return;
    setIsApplying(true);
    try {
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

  const handleGenerateAiInsights = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const totalDutyHours = metrics.reduce((acc, r) => acc + r.totalDutyHours, 0);
      const totalWeekendDays = metrics.reduce((acc, r) => acc + r.weekendsWorked, 0);
      const totalLateDuties = metrics.reduce((acc, r) => acc + r.lateEndsCount, 0);
      const summaryText = `${metrics.length} nurses analyzed. Overall workload balance score: ${spreadScore}/100. Total scheduled duty hours: ${totalDutyHours}h. Total weekend duties: ${totalWeekendDays}. Total late shifts: ${totalLateDuties}.`;

      const insights = await fetchRosterInsights({
        scheduleName: schedule.name,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        nurseCount: nurses.length,
        totalHours: totalDutyHours,
        fairnessSummary: summaryText,
      });
      setAiInsights(insights);
    } catch (err: any) {
      setAiError(err?.message || 'Could not retrieve insights from Gemini.');
    } finally {
      setAiLoading(false);
    }
  };

  type Row = (typeof metrics)[number];
  const columns: Column<Row>[] = [
    { key: 'nurse', header: 'Nurse', sortValue: (m) => m.nurse.fullName, cell: (m) => m.nurse.fullName, phone: 'title' },
    { key: 'contract', header: 'Contract', sortValue: (m) => m.nurse.contractPercent, cell: (m) => `${m.nurse.contractPercent}%`, align: 'right' },
    { key: 'goal', header: 'Goal', sortValue: (m) => m.targetHours, cell: (m) => `${m.targetHours} h`, align: 'right' },
    { key: 'hours', header: 'Hours (shifts and leave)', sortValue: (m) => m.totalDutyHours, cell: (m) => `${m.totalDutyHours} h`, align: 'right' },
    {
      key: 'balance',
      header: 'Closing balance',
      sortValue: (m) => m.hoursDelta,
      align: 'right',
      cell: (m) => (
        <Badge tone={Math.abs(m.hoursDelta) <= 2 ? 'success' : m.hoursDelta > 0 ? 'warning' : 'danger'}>{m.hoursDelta >= 0 ? `+${m.hoursDelta} h` : `${m.hoursDelta} h`}</Badge>
      ),
    },
    { key: 'weekends', header: 'Weekend days off', sortValue: (m) => m.weekendsOff, cell: (m) => `${m.weekendsOff} days`, align: 'right' },
    { key: 'holidays', header: 'Holidays worked', sortValue: (m) => m.holidaysWorked, cell: (m) => m.holidaysWorked, align: 'right' },
    {
      key: 'late',
      header: `Late shifts (end ${lateThreshold} or later)`,
      sortValue: (m) => m.lateEndsCount,
      align: 'right',
      cell: (m) => <Badge tone={m.lateEndsCount >= 4 ? 'danger' : 'neutral'}>{m.lateEndsCount} shifts</Badge>,
    },
    ...(showYear
      ? ([
          { key: 'yearWeekend', header: 'This year: weekend days worked', sortValue: (m) => thisYear(m).weekendDays, cell: (m) => `${thisYear(m).weekendDays} days`, align: 'right' },
          { key: 'yearLate', header: 'This year: late shifts', sortValue: (m) => thisYear(m).lateShifts, cell: (m) => `${thisYear(m).lateShifts} shifts`, align: 'right' },
          { key: 'yearHolidays', header: 'This year: holidays worked', sortValue: (m) => thisYear(m).holidays, cell: (m) => thisYear(m).holidays, align: 'right' },
        ] as Column<Row>[])
      : []),
  ];

  return (
    <Dialog
      open
      onClose={onClose}
      size="xl"
      title="Fairness"
      description={`${schedule.name}: how evenly the work is shared, and suggested changes.`}
      footer={
        <>
          <Button onClick={onClose}>Close</Button>
          {activeTab === 'REBALANCE' && !!proposedSwaps && proposedSwaps.length > 0 && (
            <Button variant="primary" icon={CheckCircle2} busy={isApplying} disabled={selectedSwaps.size === 0} onClick={handleApplyRebalance}>
              Move {selectedSwaps.size} {selectedSwaps.size === 1 ? 'shift' : 'shifts'}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-ink">Fairness score</span>
          <Badge tone={spreadScore >= 80 ? 'success' : spreadScore >= 60 ? 'warning' : 'danger'}>{spreadScore} of 100</Badge>
          <span className="text-ink-muted">
            Higher is fairer. It looks at how far each nurse is from their goal hours and how evenly late shifts (ending {lateThreshold} or later) are shared.
          </span>
        </div>
        <Tabs
          label="Fairness"
          idPrefix="fairness"
          value={activeTab}
          onChange={(id) => {
            setActiveTab(id as typeof activeTab);
            if (id === 'REBALANCE') setSuggestionsOpened(true);
            if (id === 'AI_INSIGHTS' && !aiInsights && !aiLoading) void handleGenerateAiInsights();
          }}
          tabs={[
            { id: 'METRICS', label: 'Each nurse' },
            { id: 'REBALANCE', label: 'Suggested changes', count: proposedSwaps ? proposedSwaps.length : undefined },
            { id: 'AI_INSIGHTS', label: 'Advice from Gemini' },
          ]}
        />

        <TabPanel idPrefix="fairness" id="METRICS" value={activeTab}>
          <div className="space-y-3">
            {yearStatus === 'loading' && <LoadingState label="Loading this year's rosters…" />}
            {showYear && (
              <p className="text-ink-muted">"This year" adds up the earlier published rosters of {schedule.startDate.slice(0, 4)} (as saved now) and this roster.</p>
            )}
            <div className="overflow-hidden rounded-lg border border-line">
              <DataTable caption="Fairness of each nurse" rows={metrics} rowKey={(m) => m.nurse.id} columns={columns} />
            </div>
          </div>
        </TabPanel>

        <TabPanel idPrefix="fairness" id="REBALANCE" value={activeTab}>
          <div className="space-y-3">
            <Notice tone="info" title="Suggested shift moves">
              These move a shift from a nurse with too many hours or many late shifts to a nurse with fewer. Each move is checked as the roster check would see
              it: the nurse must be able to do the shift, the doctor must be in their list, and the move never leaves a new or bigger Must fix. Pinned shifts
              are never moved.
            </Notice>
            {proposedSwaps === null ? (
              <LoadingState label="Checking the suggestions against the roster…" />
            ) : proposedSwaps.length > 0 ? (
              <ul className="space-y-2" aria-label={`Suggested moves (${proposedSwaps.length})`}>
                {proposedSwaps.map((sw) => {
                  const isSelected = selectedSwaps.has(sw.id);
                  return (
                    <li key={sw.id} className={cx('flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3', isSelected ? 'border-brand bg-brand-soft' : 'border-line')}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {
                          const next = new Set(selectedSwaps);
                          if (isSelected) next.delete(sw.id);
                          else next.add(sw.id);
                          setSelectedSwaps(next);
                        }}
                        label={
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">{formatDate(sw.date)}</span>
                            <Badge>{sw.dutyName}</Badge>
                            <span>{sw.overloadedNurse.fullName}</span>
                            <ArrowRight aria-label="to" className="size-4 text-ink-muted" />
                            <span className="font-semibold">{sw.underloadedNurse.fullName}</span>
                          </span>
                        }
                      />
                      <span className="text-ink-muted">{sw.reason}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState icon={CheckCircle2} title="No moves to suggest">
                The work is already shared as evenly as the rules allow.
              </EmptyState>
            )}
          </div>
        </TabPanel>

        <TabPanel idPrefix="fairness" id="AI_INSIGHTS" value={activeTab}>
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="max-w-prose text-ink-muted">
                Gemini reads a summary of this roster (counts only, no nurse names) and suggests how to share the work more evenly. The advice is only a suggestion: the roster
                check decides what is allowed.
              </p>
              <Button icon={Sparkles} busy={aiLoading} onClick={handleGenerateAiInsights}>
                {aiInsights ? 'Ask again' : 'Ask Gemini'}
              </Button>
            </div>
            {aiLoading && <LoadingState label="Waiting for Gemini…" />}
            {aiError && !aiLoading && (
              <Notice tone="danger" live title="Gemini's advice could not be loaded">
                {aiError}
              </Notice>
            )}
            {aiInsights && !aiLoading && <div className="whitespace-pre-line rounded-lg border border-line p-4 text-ink">{aiInsights}</div>}
          </div>
        </TabPanel>
      </div>
    </Dialog>
  );
};
