/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard: what matters today. Planners see who is on duty today, the
 * current roster's state and problems, and what needs their attention.
 * Nurses and other viewers see their own next shifts and today at the clinic
 * as published.
 */

import React, { useEffect, useId, useRef, useState } from 'react';
import {
  CalendarRange,
  Users,
  Stethoscope,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Plus,
  Send,
  Inbox,
  Mail,
  MailCheck,
  UserCheck,
  Clock,
  RotateCcw,
  BarChart3,
  History,
} from 'lucide-react';
import { AppRoute, ClinicContextState } from '../../types/navigation';
import { getRepository } from '../../services/repository';
import { authService } from '../../services/auth/authService';
import { canAccessRoute, canApproveRequests, canEditClinicData } from '../../services/auth/access';
import { chooseScheduleToOpen } from '../../services/schedule/openSchedule';
import { loadClinicSetup } from '../../services/engine/clinicSetupService';
import { ScheduleValidator } from '../../services/validation/ScheduleValidator';
import { countPendingApprovals } from '../../services/requests/staffRequestService';
import { withoutBackups } from '../../services/history/versionList';
import {
  buildNurseRosterDoc,
  latestPublishedVersions,
  shiftDetail,
  todayIso,
  addDaysIso,
  weekdayOf,
} from '../../services/publish/nurseRosterService';
import {
  countChangedCells,
  nextRosterNeeded,
  receiptSummary,
  todayAtClinic,
  TodayAtClinic,
} from '../../services/dashboard/dashboardSummary';
import type { ProblemCount } from '../../services/dashboard/problemCount';
import { useAppContext } from '../common/AppContext';
import { formatDate, formatDateRange } from '../../utils/dateUtils';
import { PageLoading } from '../common/PageLoading';
import { Assignment, NurseRosterShift, Schedule } from '../../types';

interface DashboardViewProps {
  context: ClinicContextState;
  onNavigate: (route: AppRoute) => void;
  onOpenCreateSchedule?: () => void;
}

/** Everything the planner's dashboard shows. */
interface PlannerData {
  today: string;
  roster: Schedule | null;
  rosterStatus: { shifts: number; mustFix: number; toCheck: number; changed: number; published: boolean; version: number } | null;
  receipts: { sent: number; confirmed: number } | null;
  todayRoster: Schedule | null;
  todayInfo: TodayAtClinic | null;
  nextFrom: string | null;
  pendingRequests: number | null;
  nursesWithoutEmail: number;
  activeNurses: number;
  activeDoctors: number;
  /** The roster check's counts, announced to the top bar once the page is still showing. */
  announce: ProblemCount | null;
}

/** Everything a nurse or viewer's dashboard shows. */
interface ViewerData {
  today: string;
  /** Requests waiting for approval (managers only; null for others). */
  pendingRequests: number | null;
  myShifts: NurseRosterShift[] | null;
  myLeaveDays: string[];
  todayRoster: Schedule | null;
  todayInfo: TodayAtClinic | null;
}

const OPEN_SCHEDULE_KEY = 'clinic_roster_active_schedule_id';
const readStoredId = () => {
  try {
    return localStorage.getItem(OPEN_SCHEDULE_KEY);
  } catch {
    return null;
  }
};

const longDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

async function loadPlannerData(timezone: string, canApprove: boolean): Promise<PlannerData> {
  const repo = getRepository();
  const today = todayIso(timezone);
  const [schedules, nurses, doctors, dutyWindows, seniorityLevels, roles, specialties, leaveEntries, leaveTypes, locks, rules, periods, sessions] =
    await Promise.all([
      repo.list('schedules'),
      repo.list('nurses'),
      repo.list('doctors'),
      repo.list('dutyWindows'),
      repo.list('seniorityLevels'),
      repo.list('clinicalRoles'),
      repo.list('specialties'),
      repo.list('leaveEntries'),
      repo.list('leaveTypes'),
      repo.list('locks'),
      repo.list('rules'),
      repo.list('workingHoursPeriods'),
      repo.list('doctorSessions'),
    ]);
  const activeNurses = nurses.filter((n) => n.active);
  const activeDoctors = doctors.filter((d) => d.active);
  const refs = { doctors, clinicalRoles: roles, specialties };

  const roster = chooseScheduleToOpen(schedules, readStoredId(), null, today) || null;
  const todayRoster = schedules.find((s) => s.startDate <= today && s.endDate >= today) || null;

  // The current roster: its shifts, the roster check, changes since the last publish, read receipts.
  let rosterStatus: PlannerData['rosterStatus'] = null;
  let announce: ProblemCount | null = null;
  let receipts: PlannerData['receipts'] = null;
  let rosterAssignments: Assignment[] = [];
  if (roster) {
    const by = { field: 'scheduleId', operator: '==' as const, value: roster.id };
    const [assignments, versionList, setup, acks] = await Promise.all([
      repo.list('assignments', by),
      repo.list('versions', by).then(withoutBackups),
      // The year's fairness totals are only for filling the roster, not checking it.
      loadClinicSetup(repo, roster, { withYearToDate: false }).catch(() => undefined),
      repo.list('acknowledgments', by).catch(() => []),
    ]);
    const requests = setup?.availabilityRequests || [];
    rosterAssignments = assignments;
    const report = ScheduleValidator.validate(
      roster,
      assignments,
      activeNurses,
      seniorityLevels,
      dutyWindows,
      sessions,
      leaveEntries,
      locks,
      roles,
      rules,
      periods,
      specialties,
      activeDoctors,
      leaveTypes,
      setup,
      requests
    );
    const lastPublished = latestPublishedVersions(versionList).get(roster.id);
    rosterStatus = {
      shifts: assignments.length,
      mustFix: report.errorCount,
      toCheck: report.warnCount,
      changed: lastPublished ? countChangedCells(lastPublished.snapshot.assignments, assignments) : 0,
      published: !!lastPublished,
      version: roster.activeVersionNumber || 1,
    };
    if (lastPublished) {
      const r = receiptSummary(acks, lastPublished.id);
      if (r.sent > 0) receipts = { sent: r.sent, confirmed: r.confirmed };
    }
    announce = {
      scheduleId: roster.id,
      name: roster.name,
      startDate: roster.startDate,
      endDate: roster.endDate,
      mustFix: report.errorCount,
      toCheck: report.warnCount,
    };
  }

  // Today at the clinic, from the roster that covers today (its current shifts).
  let todayInfo: TodayAtClinic | null = null;
  if (todayRoster) {
    const todayShifts =
      todayRoster.id === roster?.id
        ? rosterAssignments
        : await repo.list('assignments', { field: 'scheduleId', operator: '==', value: todayRoster.id });
    todayInfo = todayAtClinic({
      date: today,
      assignments: todayShifts,
      nurses,
      dutyWindows,
      seniorityLevels,
      leaveEntries,
      detailOf: (a) => shiftDetail(a, refs),
    });
  }

  const pendingRequests = canApprove ? await countPendingApprovals().catch(() => null) : null;

  return {
    today,
    roster,
    rosterStatus,
    receipts,
    todayRoster,
    todayInfo,
    nextFrom: nextRosterNeeded(schedules, today)?.from || null,
    pendingRequests,
    nursesWithoutEmail: activeNurses.filter((n) => !n.gmail || !n.gmail.includes('@')).length,
    activeNurses: activeNurses.length,
    activeDoctors: activeDoctors.length,
    announce,
  };
}

async function loadViewerData(timezone: string, linkedNurseId: string | undefined, canApprove: boolean): Promise<ViewerData> {
  const repo = getRepository();
  const today = todayIso(timezone);
  const [schedules, nurses, doctors, dutyWindows, seniorityLevels, roles, specialties, leaveEntries] = await Promise.all([
    repo.list('schedules'),
    repo.list('nurses'),
    repo.list('doctors'),
    repo.list('dutyWindows'),
    repo.list('seniorityLevels'),
    repo.list('clinicalRoles'),
    repo.list('specialties'),
    repo.list('leaveEntries'),
  ]);
  // Only the copies of rosters that cover today or later (old rosters' copies aren't read).
  const recent = schedules.filter((s) => s.endDate >= today && s.status !== 'ARCHIVED');
  const versions = (
    await Promise.all(recent.map((s) => repo.list('versions', { field: 'scheduleId', operator: '==', value: s.id })))
  ).flat();
  const refs = { doctors, clinicalRoles: roles, specialties };
  const published = latestPublishedVersions(versions);

  // Only what was published counts for nurses (not a draft still being planned).
  const todayRoster = schedules.find((s) => s.startDate <= today && s.endDate >= today && published.has(s.id)) || null;
  const todayInfo = todayRoster
    ? todayAtClinic({
        date: today,
        assignments: published.get(todayRoster.id)!.snapshot.assignments,
        nurses,
        dutyWindows,
        seniorityLevels,
        leaveEntries,
        detailOf: (a) => shiftDetail(a, refs),
      })
    : null;

  let myShifts: NurseRosterShift[] | null = null;
  let myLeaveDays: string[] = [];
  const me = linkedNurseId ? nurses.find((n) => n.id === linkedNurseId) : undefined;
  if (me) {
    const doc = buildNurseRosterDoc({ token: '', nurse: me, schedules, versions, dutyWindows, ...refs, today });
    const until = addDaysIso(today, 13);
    myShifts = doc.shifts.filter((s) => s.date >= today && s.date <= until);
    myLeaveDays = doc.leaveDays.filter((d) => d >= today && d <= until);
  }
  const pendingRequests = canApprove ? await countPendingApprovals().catch(() => null) : null;
  return { today, pendingRequests, myShifts, myLeaveDays, todayRoster, todayInfo };
}

/** A small card with a heading. */
const Card: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }> = ({
  title,
  action,
  children,
  className = '',
}) => {
  const headingId = useId();
  return (
    <section className={`bg-white border border-slate-200 rounded-lg shadow-2xs ${className}`} aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 border-b border-slate-100">
        <h2 id={headingId} className="text-sm font-bold text-slate-900">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
};

/** Who works today, as a list. */
const TodayList: React.FC<{ info: TodayAtClinic | null; roster: Schedule | null; note?: string }> = ({ info, roster, note }) => {
  if (!roster || !info) {
    return <p className="text-xs text-slate-500">{note || 'No roster covers today.'}</p>;
  }
  return (
    <div className="space-y-3 text-xs">
      {info.onDuty.length === 0 ? (
        <p className="text-slate-500">Nobody is on the roster today.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {info.onDuty.map((e) => (
            <li key={e.nurseId} className="flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-0.5 py-1.5">
              <span className="w-24 shrink-0 tabular-nums text-slate-600">
                {e.startTime} to {e.endTime}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[11px] shrink-0">{e.acronym}</span>
              <span className="font-semibold text-slate-900 min-w-0 truncate">
                {e.name}
                {e.senior && <span className="ml-1.5 text-[10px] font-semibold text-violet-700 bg-violet-50 px-1 py-0.5 rounded">Senior</span>}
              </span>
              <span className="basis-full sm:basis-auto pl-[6.75rem] sm:pl-0 sm:ml-auto text-slate-600 sm:truncate sm:text-right">{e.detail}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
        {info.onDuty.length > 0 &&
          (info.hasSenior ? (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Senior nurse on duty
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" /> No senior nurse on duty
            </span>
          ))}
        {info.onLeave.length > 0 && <span>On leave: {info.onLeave.map((n) => n.name).join(', ')}</span>}
      </div>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({ context, onNavigate, onOpenCreateSchedule }) => {
  const user = authService.getCurrentUser();
  const isPlanner = canEditClinicData(user);
  const canApprove = canApproveRequests(user);
  const [planner, setPlanner] = useState<PlannerData | null>(null);
  const [viewer, setViewer] = useState<ViewerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  // The app context: the top bar's problem count, and a new data version after all data was deleted.
  const app = useAppContext();
  const reportProblems = app?.reportProblems;
  const dataVersion = app?.dataVersion ?? 0;

  // The time zone is read when loading, not a reason to load again (it arrives
  // from the clinic profile a moment after the page opens).
  const timezoneRef = useRef(context.timezone);
  timezoneRef.current = context.timezone;

  useEffect(() => {
    let cancelled = false;
    setError(null);
    const load = isPlanner
      ? loadPlannerData(timezoneRef.current, canApprove).then((d) => {
          if (cancelled) return;
          setPlanner(d);
          // Only a load still on screen may update the top bar's count.
          if (d.announce) reportProblems?.(d.announce);
        })
      : loadViewerData(timezoneRef.current, user?.linkedNurseId, canApprove).then((d) => !cancelled && setViewer(d));
    load.catch((err) => {
      console.error('Dashboard could not load:', err);
      if (!cancelled) setError('Check your connection and try again.');
    });
    return () => {
      cancelled = true;
    };
    // dataVersion: all clinic data was deleted, so the dashboard loads again.
  }, [isPlanner, canApprove, user?.linkedNurseId, attempt, dataVersion]);

  const openCreate = onOpenCreateSchedule || (() => onNavigate('schedules'));
  const today = planner?.today || viewer?.today || todayIso(context.timezone);

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200">
      <div>
        <p className="text-xs font-semibold text-slate-500">{context.clinicName}</p>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Today, {longDate(today)}</h1>
      </div>
      {isPlanner && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('schedules')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
          >
            <CalendarRange className="w-3.5 h-3.5" aria-hidden="true" />
            Open the roster
          </button>
        </div>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
        {header}
        <div role="alert" className="p-4 rounded border border-rose-200 bg-rose-50 text-xs text-rose-800 flex items-center justify-between gap-3">
          <span>The dashboard could not be loaded. {error}</span>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="inline-flex items-center gap-1 px-2.5 py-1 border border-rose-300 bg-white rounded font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Try again
          </button>
        </div>
      </div>
    );
  }

  if ((isPlanner && !planner) || (!isPlanner && !viewer)) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
        {header}
        <PageLoading label="Loading today's overview…" />
      </div>
    );
  }

  const shortcuts: { route: AppRoute; label: string; hint: string; icon: React.ReactNode }[] = (
    [
      { route: 'availability', label: 'Leave and requests', hint: 'Leave, days off and shift requests', icon: <CalendarRange className="w-4 h-4" /> },
      { route: 'nurses', label: 'Nurses', hint: 'Contracts, skills and usual doctors', icon: <Users className="w-4 h-4" /> },
      { route: 'doctors', label: 'Doctors', hint: 'Weekly clinic sessions', icon: <Stethoscope className="w-4 h-4" /> },
      { route: 'publish', label: 'Publish', hint: 'Emails, read receipts and private links', icon: <Send className="w-4 h-4" /> },
      { route: 'reports', label: 'Reports', hint: 'Hours, fairness and leave', icon: <BarChart3 className="w-4 h-4" /> },
      { route: 'history', label: 'History', hint: 'Saved and published copies', icon: <History className="w-4 h-4" /> },
    ] as const
  ).filter((s) => canAccessRoute(user, s.route));

  const shortcutGrid = (
    <nav aria-label="Shortcuts" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {shortcuts.map((s) => (
        <a
          key={s.route}
          href={`#${s.route}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(s.route);
          }}
          className="block text-left bg-white border border-slate-200 hover:border-indigo-300 rounded-lg p-3 cursor-pointer group shadow-2xs"
        >
          <span className="text-indigo-700 group-hover:text-indigo-800" aria-hidden="true">
            {s.icon}
          </span>
          <span className="block mt-1.5 text-xs font-semibold text-slate-900">{s.label}</span>
          <span className="block text-[11px] text-slate-500 leading-snug">{s.hint}</span>
        </a>
      ))}
    </nav>
  );

  // --- Nurses and other viewers ---
  if (!isPlanner && viewer) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
        {header}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {viewer.myShifts && (
            <Card title="Your next two weeks">
              {viewer.myShifts.length === 0 && viewer.myLeaveDays.length === 0 ? (
                <p className="text-xs text-slate-500">No published shifts in the next two weeks.</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-xs">
                  {[
                    ...viewer.myShifts.map((s) => ({ date: s.date, shift: s })),
                    ...viewer.myLeaveDays.map((d) => ({ date: d, shift: null as NurseRosterShift | null })),
                  ]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map(({ date, shift }) => (
                      <li key={date + (shift?.startTime || 'leave')} className={`flex items-center gap-3 py-1.5 ${date === viewer.today ? 'font-semibold' : ''}`}>
                        <span className="w-24 shrink-0 text-slate-700">
                          {weekdayOf(date)} {formatDate(date).slice(0, 5)}
                          {date === viewer.today && <span className="ml-1 text-indigo-700">Today</span>}
                        </span>
                        {shift ? (
                          <>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[11px]">{shift.acronym}</span>
                            <span className="tabular-nums text-slate-700">
                              {shift.startTime} to {shift.endTime}
                            </span>
                            <span className="ml-auto text-slate-600 truncate">{shift.detail}</span>
                          </>
                        ) : (
                          <span className="text-amber-700 font-semibold">Leave</span>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </Card>
          )}
          <Card title="Today at the clinic">
            <TodayList info={viewer.todayInfo} roster={viewer.todayRoster} note="No published roster covers today." />
          </Card>
          {viewer.pendingRequests !== null && (
            <Card title="Needs your attention">
              {viewer.pendingRequests > 0 ? (
                <div className="flex items-start gap-2 text-xs">
                  <span className="p-1 rounded shrink-0 text-amber-700 bg-amber-50" aria-hidden="true">
                    <Inbox className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-slate-800">
                      {viewer.pendingRequests} leave or shift request{viewer.pendingRequests === 1 ? '' : 's'} waiting for approval
                    </p>
                    <a
                      href="#availability"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('availability');
                      }}
                      className="font-semibold text-indigo-700 hover:underline"
                    >
                      Review requests
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-700 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> No requests waiting.
                </p>
              )}
            </Card>
          )}
        </div>
        {shortcutGrid}
      </div>
    );
  }

  // --- Planners ---
  const d = planner!;
  const status = d.rosterStatus;
  const attention: { key: string; tone: 'red' | 'amber' | 'blue'; icon: React.ReactNode; text: string; action: string; onClick: () => void }[] = [];
  if (status && status.mustFix > 0) {
    attention.push({
      key: 'fix',
      tone: 'red',
      icon: <AlertCircle className="w-4 h-4" />,
      text: `${status.mustFix} problem${status.mustFix === 1 ? '' : 's'} to fix on ${d.roster!.name}`,
      action: 'Fix problems',
      onClick: () => onNavigate('schedules'),
    });
  }
  if (status && status.toCheck > 0) {
    attention.push({
      key: 'check',
      tone: 'amber',
      icon: <AlertTriangle className="w-4 h-4" />,
      text: `${status.toCheck} thing${status.toCheck === 1 ? '' : 's'} to check on ${d.roster!.name}`,
      action: 'Check them',
      onClick: () => onNavigate('schedules'),
    });
  }
  if (status && status.published && status.changed > 0) {
    attention.push({
      key: 'changes',
      tone: 'amber',
      icon: <Send className="w-4 h-4" />,
      text: `${status.changed} change${status.changed === 1 ? '' : 's'} not sent to the nurses yet`,
      action: 'Send changes',
      onClick: () => onNavigate('schedules'),
    });
  }
  if (status && !status.published && status.shifts > 0) {
    attention.push({
      key: 'publish',
      tone: 'amber',
      icon: <Send className="w-4 h-4" />,
      text: `${d.roster!.name} is filled but not published yet`,
      action: 'Publish',
      onClick: () => onNavigate('schedules'),
    });
  }
  if (d.nextFrom) {
    attention.push({
      key: 'next',
      tone: 'blue',
      icon: <Plus className="w-4 h-4" />,
      text: `No roster from ${formatDate(d.nextFrom)} yet`,
      action: 'Create it',
      onClick: openCreate,
    });
  }
  if (d.pendingRequests && d.pendingRequests > 0) {
    attention.push({
      key: 'requests',
      tone: 'amber',
      icon: <Inbox className="w-4 h-4" />,
      text: `${d.pendingRequests} leave or shift request${d.pendingRequests === 1 ? '' : 's'} waiting for approval`,
      action: 'Review',
      onClick: () => onNavigate('availability'),
    });
  }
  if (d.receipts && d.receipts.confirmed < d.receipts.sent) {
    const waiting = d.receipts.sent - d.receipts.confirmed;
    attention.push({
      key: 'receipts',
      tone: 'blue',
      icon: <MailCheck className="w-4 h-4" />,
      text: `${waiting} nurse${waiting === 1 ? " hasn't" : "s haven't"} confirmed getting the roster`,
      action: 'See who',
      onClick: () => onNavigate('publish'),
    });
  }
  if (d.nursesWithoutEmail > 0) {
    attention.push({
      key: 'email',
      tone: 'blue',
      icon: <Mail className="w-4 h-4" />,
      text: `${d.nursesWithoutEmail} nurse${d.nursesWithoutEmail === 1 ? ' has' : 's have'} no email address`,
      action: 'Fix',
      onClick: () => onNavigate('nurses'),
    });
  }
  const toneClass = { red: 'text-rose-700 bg-rose-50', amber: 'text-amber-700 bg-amber-50', blue: 'text-indigo-700 bg-indigo-50' };

  // A brand new clinic: help with the first steps instead.
  if (!d.roster && d.activeNurses === 0) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
        {header}
        <Card title="Get started">
          <ol className="space-y-2 text-xs text-slate-700 list-decimal pl-4">
            <li>
              Add your nurses, with their contracts and skills.{' '}
              <button type="button" onClick={() => onNavigate('nurses')} className="font-semibold text-indigo-700 underline cursor-pointer">
                Add nurses
              </button>
            </li>
            <li>
              Add the doctors and their weekly clinic sessions.{' '}
              <button type="button" onClick={() => onNavigate('doctors')} className="font-semibold text-indigo-700 underline cursor-pointer">
                Add doctors
              </button>
            </li>
            <li>
              Create a roster and fill it.{' '}
              <button type="button" onClick={openCreate} className="font-semibold text-indigo-700 underline cursor-pointer">
                Create a roster
              </button>
            </li>
          </ol>
        </Card>
        {shortcutGrid}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
      {header}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Today at the clinic"
            action={d.todayRoster ? <span className="text-[11px] text-slate-500">{d.todayRoster.name}</span> : undefined}
          >
            <TodayList info={d.todayInfo} roster={d.todayRoster} />
          </Card>

          <Card
            title="Current roster"
            action={
              d.roster ? (
                <a
                  href="#schedules"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('schedules');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                >
                  Open {d.roster.name} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              ) : undefined
            }
          >
            {!d.roster || !status ? (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">No roster yet.</span>
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Create a roster
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-slate-900">{d.roster.name}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded font-semibold ${
                      status.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {status.published ? 'Published' : 'Draft'}, version {status.version}
                  </span>
                  <span className="text-xs text-slate-600 inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    {formatDateRange(d.roster.startDate, d.roster.endDate)}
                  </span>
                </div>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <dt className="text-slate-500">Shifts</dt>
                    <dd className="text-lg font-bold text-slate-900 tabular-nums">{status.shifts}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Must fix</dt>
                    <dd className={`text-lg font-bold tabular-nums ${status.mustFix > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {status.mustFix}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">To check</dt>
                    <dd className={`text-lg font-bold tabular-nums ${status.toCheck > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                      {status.toCheck}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{status.published ? 'Changes not sent' : 'Sent to nurses'}</dt>
                    <dd className={`text-lg font-bold tabular-nums ${status.published && status.changed > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                      {status.published ? status.changed : 'Not yet'}
                    </dd>
                  </div>
                </dl>
                {d.receipts && (
                  <p className="text-[11px] text-slate-600">
                    {d.receipts.confirmed} of {d.receipts.sent} nurses confirmed they got the last published roster.
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Needs your attention">
            {attention.length === 0 ? (
              <p className="text-xs text-emerald-700 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Nothing needs your attention.
              </p>
            ) : (
              <ul className="space-y-2">
                {attention.map((a) => (
                  <li key={a.key} className="flex items-start gap-2 text-xs">
                    <span className={`p-1 rounded shrink-0 ${toneClass[a.tone]}`} aria-hidden="true">
                      {a.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-slate-800">{a.text}</p>
                      <button type="button" onClick={a.onClick} className="font-semibold text-indigo-700 hover:underline cursor-pointer">
                        {a.action}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Staff">
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-slate-500 inline-flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" aria-hidden="true" /> Active nurses
                </dt>
                <dd className="text-lg font-bold text-slate-900 tabular-nums">{d.activeNurses}</dd>
              </div>
              <div>
                <dt className="text-slate-500 inline-flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" /> Active doctors
                </dt>
                <dd className="text-lg font-bold text-slate-900 tabular-nums">{d.activeDoctors}</dd>
              </div>
            </dl>
            {d.todayInfo && d.todayInfo.onDuty.length > 0 && !d.todayInfo.hasSenior && (
              <p className="mt-3 text-[11px] text-rose-700 inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> No senior nurse is on duty today.
              </p>
            )}
          </Card>
        </div>
      </div>
      {shortcutGrid}
    </div>
  );
};
