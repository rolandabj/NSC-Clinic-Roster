/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reports (Phase 8, in plain words): each nurse's hours against the goal for one roster, how
 * fairly weekends and late finishes were shared, and the leave allowances. Three tabs, kept in
 * the address (#reports?tab=fairness). Headings say Goal, Worked, Leave and Difference, and a
 * status is a word in normal case (reportWords.ts). The bars follow the dataviz skill: thin,
 * one colour for one series, the value at the tip in the text colour, and a table beside them.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Download, FileSpreadsheet, Printer, Search } from 'lucide-react';
import { HoursHistory, hoursHistoryOverlaps } from '../../services/hours/hoursBalance';
import { loadHoursHistory } from '../../services/hours/hoursHistoryService';
import type { AddressChange, ClinicContextState } from '../../types/navigation';
import { getRepository } from '../../services/repository';
import {
  Schedule,
  Assignment,
  Nurse,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  SeniorityLevel,
  Doctor,
  ClinicalRole,
  Specialty,
  NurseHoursQuota,
  WorkingHoursPeriod,
} from '../../types';
import {
  NurseHoursAccounting,
  ClinicHoursMetrics,
  calculateNurseHoursAccounting,
  calculateClinicHoursMetrics,
} from '../../services/reports/hoursAccounting';
import {
  REPORT_TABS,
  STATUS_CHOICES,
  barShare,
  differenceWords,
  filterReportRows,
  reportTab,
  shareTone,
  statusTone,
  statusWord,
  type ReportFilters,
} from '../../services/reports/reportWords';
import { NurseTimesheetModal } from '../modals/NurseTimesheetModal';
import { usePermissions } from '../common/usePermissions';
import { toCsv, downloadCsv, CsvValue } from '../../utils/csv';
import { formatDateRange } from '../../utils/dateUtils';
import { readableTextOn } from '../../utils/colorContrast';
import { notify } from '../common/dialogs';
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  Field,
  IconButton,
  Input,
  LoadingState,
  Notice,
  PageHeader,
  Select,
  TabPanel,
  Tabs,
  cx,
  type Column,
  type Tone,
} from '../ui';

interface ReportsViewProps {
  context: ClinicContextState;
  /** The open tab from the address: 'fairness' or 'leave', else Hours. */
  tab?: string;
  onAddressChange?: AddressChange;
}

/** Hours to one decimal place, as "12.5 h". */
const hours = (n: number) => `${Math.round(n * 10) / 10} h`;

const METER_FILL: Record<Tone, string> = {
  success: 'bg-success',
  warning: 'bg-warning-line',
  danger: 'bg-danger-line',
  info: 'bg-info',
  brand: 'bg-brand',
  neutral: 'bg-control',
};

/** A share of a goal: the fill carries the state, the track is the rest of the goal. */
const Meter: React.FC<{ percent: number; tone: Tone; label: string }> = ({ percent, tone, label }) => (
  <div
    role="meter"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.min(100, Math.max(0, percent))}
    aria-valuetext={`${percent}%`}
    className="h-2 w-full overflow-hidden rounded bg-line"
  >
    <div className={cx('h-full rounded-r', METER_FILL[tone])} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
  </div>
);

/** One bar for each nurse: one series, one colour, the value at the tip. */
const BarList: React.FC<{ caption: string; unit: (n: number) => string; items: { id: string; name: string; value: number }[] }> = ({
  caption,
  unit,
  items,
}) => {
  const longest = Math.max(0, ...items.map((i) => i.value));
  return (
    <ul aria-label={caption} className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
      {items.map((i) => (
        <li key={i.id} title={`${i.name}: ${unit(i.value)}`} className="grid grid-cols-[9rem_1fr_5.5rem] items-center gap-3 text-sm">
          <span className="truncate text-ink">{i.name}</span>
          <span aria-hidden="true" className="h-2.5">
            <span className="block h-full rounded-r bg-brand" style={{ width: `${barShare(i.value, longest)}%` }} />
          </span>
          <span className="text-right tabular-nums text-ink">{unit(i.value)}</span>
        </li>
      ))}
    </ul>
  );
};

/** A number at the top of the page, with a line under it. */
const Stat: React.FC<{ label: string; value: React.ReactNode; note?: React.ReactNode; children?: React.ReactNode }> = ({ label, value, note, children }) => (
  <div className="rounded-lg border border-line bg-surface p-3 shadow-card">
    <dt className="text-xs font-semibold text-ink-muted">{label}</dt>
    <dd className="mt-1 space-y-1">
      <span className="block text-xl font-semibold tabular-nums text-ink">{value}</span>
      {children}
      {note && <span className="block text-xs text-ink-muted">{note}</span>}
    </dd>
  </div>
);

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export const ReportsView: React.FC<ReportsViewProps> = ({ context, tab, onAddressChange }) => {
  // Payroll and timesheet downloads: planners and managers only (canExportReports).
  const { canExport } = usePermissions();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [dutyWindows, setDutyWindows] = useState<DutyWindow[]>([]);
  const [leaveEntries, setLeaveEntries] = useState<LeaveEntry[]>([]);
  const [workingHoursPeriods, setWorkingHoursPeriods] = useState<WorkingHoursPeriod[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [hoursHistory, setHoursHistory] = useState<HoursHistory>();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [seniorityLevels, setSeniorityLevels] = useState<SeniorityLevel[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [roles, setClinicalRoles] = useState<ClinicalRole[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [quotas, setQuotas] = useState<NurseHoursQuota[]>([]);

  const open = reportTab(tab);
  const [timesheetRow, setTimesheetRow] = useState<NurseHoursAccounting | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({ search: '', status: 'ALL', seniority: 'ALL', contract: 'ALL' });
  const setFilter = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => setFilters((f) => ({ ...f, [key]: value }));

  const repo = getRepository();

  const loadData = async () => {
    try {
      const [schedList, nList, dwList, leList, ltList, sList, dList, crList, spList, qList, whpList] = await Promise.all([
        repo.list('schedules'),
        repo.list('nurses'),
        repo.list('dutyWindows'),
        repo.list('leaveEntries'),
        repo.list('leaveTypes'),
        repo.list('seniorityLevels'),
        repo.list('doctors'),
        repo.list('clinicalRoles'),
        repo.list('specialties'),
        repo.list('quotas'),
        repo.list('workingHoursPeriods'),
      ]);

      setSchedules(Array.from(new Map(schedList.map((s) => [s.id, s])).values()));
      setLoadError(null);
      setDutyWindows(dwList);
      setLeaveEntries(leList);
      setLeaveTypes(ltList);
      setSeniorityLevels(sList);
      setDoctors(dList);
      setClinicalRoles(crList);
      setSpecialties(spList);
      setQuotas(qList);
      setWorkingHoursPeriods(whpList);
      setNurses(nList.filter((n) => n.active));

      const current = schedList.find((s) => s.id === context.activeScheduleId) || schedList[0];
      if (current) setActiveSchedule(current); // its shifts arrive through the subscription below
    } catch (err) {
      console.error('Error loading reports data:', err);
      setLoadError('The hours history could not be loaded. Reload the page before relying on these balances.');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
    const stopSchedules = repo.subscribe('schedules', setSchedules);
    const stopLeaves = repo.subscribe('leaveEntries', (list) => {
      setLeaveEntries(list);
      setHoursHistory((old) => (old ? { ...old, leaveEntries: list } : old));
    });
    const stopPeriods = repo.subscribe('workingHoursPeriods', setWorkingHoursPeriods);
    const stopDuties = repo.subscribe('dutyWindows', setDutyWindows);
    return () => {
      stopSchedules();
      stopLeaves();
      stopPeriods();
      stopDuties();
    };
  }, []);

  // Balances carry from the published rosters of the same period (reloaded when a roster changes).
  useEffect(() => {
    if (!activeSchedule || schedules.length === 0) return;
    let cancelled = false;
    loadHoursHistory(repo, activeSchedule, { schedules, periods: workingHoursPeriods })
      .then((history) => {
        if (!cancelled) {
          setHoursHistory(history);
          setLoadError(null);
        }
      })
      .catch((err) => {
        console.error('Could not load the hours history:', err);
        if (!cancelled) setLoadError('The hours history could not be loaded. Reload the page before relying on these balances.');
      });
    return () => {
      cancelled = true;
    };
  }, [activeSchedule?.id, schedules, workingHoursPeriods]);

  // The open roster's shifts, kept live (edits in another tab or by another planner show at once).
  useEffect(() => {
    if (!activeSchedule?.id) return;
    setAssignments([]);
    return repo.subscribe('assignments', setAssignments, { field: 'scheduleId', operator: '==', value: activeSchedule.id });
  }, [activeSchedule?.id]);

  const rows: NurseHoursAccounting[] = useMemo(() => {
    if (!activeSchedule || !hoursHistory || loadError || hoursHistoryOverlaps(activeSchedule, hoursHistory).length) return [];
    return nurses.map((nurse) =>
      calculateNurseHoursAccounting(
        nurse,
        activeSchedule,
        assignments,
        dutyWindows,
        leaveEntries,
        leaveTypes,
        seniorityLevels,
        doctors,
        roles,
        specialties,
        quotas,
        workingHoursPeriods,
        hoursHistory
      )
    );
  }, [activeSchedule, nurses, assignments, dutyWindows, leaveEntries, leaveTypes, seniorityLevels, doctors, roles, specialties, quotas, workingHoursPeriods, hoursHistory, loadError]);

  const metrics: ClinicHoursMetrics = useMemo(() => calculateClinicHoursMetrics(rows, dutyWindows, seniorityLevels), [rows, dutyWindows, seniorityLevels]);
  const shownRows = useMemo(() => filterReportRows(rows, filters), [rows, filters]);

  // The payroll file keeps its column names: payroll may read them.
  const handleExportPayrollCsv = () => {
    const out: CsvValue[][] = [
      [
        'Employee Code',
        'Full Name',
        'Seniority',
        'Contract %',
        'Base Target (h)',
        'Carried Hours Owed (h)',
        'Adjusted Target Hours (h)',
        'Clinical Duties (h)',
        'Credited Leave (h)',
        'Total Earned (h)',
        'Closing Balance (h)',
        'Pace %',
        'Weekend Shifts Count',
        'Late Duties Count (21:00)',
        'Payroll Status',
      ],
    ];
    rows.forEach((r) => {
      out.push([
        r.nurse.employeeCode,
        r.nurse.fullName,
        r.seniority?.name || 'Staff',
        `${r.contractPercent}%`,
        r.balance.baseTargetHours,
        r.balance.carriedHours,
        r.targetHours,
        r.dutyHours,
        r.leaveHours,
        r.totalEarnedHours,
        // A real number: a "+12" text cell would be quoted as text by the CSV
        // formula guard, while spreadsheets already read the old +12 as 12.
        r.varianceHours,
        `${r.pacePercent}%`,
        r.weekendShiftsCount,
        r.lateDutiesCount,
        r.status,
      ]);
    });
    downloadCsv(`payroll-hours-${activeSchedule?.name || 'clinic'}.csv`, toCsv(out));
    notify('Payroll file downloaded.', 'success');
  };

  const handleExportAllTimesheetsCsv = () => {
    const out: CsvValue[][] = [
      ['Employee Code', 'Full Name', 'Date', 'Weekday', 'Is Weekend', 'Type', 'Duty / Leave Code', 'Hours Earned', 'Assigned Doctor / Role', 'Source', 'Notes'],
    ];
    rows.forEach((r) => {
      r.timeline.forEach((item) => {
        const doctorOrRole = item.doctor
          ? item.doctor.fullName
          : item.clinicalRole
          ? item.clinicalRole.name
          : item.specialty
          ? `${item.specialty.name} Pool`
          : '';
        out.push([
          r.nurse.employeeCode,
          r.nurse.fullName,
          item.date,
          item.weekdayName,
          item.isWeekend ? 'YES' : 'NO',
          item.type,
          item.dutyWindow?.acronym || item.leaveType?.acronym || 'OFF',
          item.hoursEarned,
          doctorOrRole,
          item.source || '',
          item.notes || '',
        ]);
      });
    });
    downloadCsv(`all-shifts-timesheet-${activeSchedule?.name || 'clinic'}.csv`, toCsv(out));
    notify('Timesheets file downloaded.', 'success');
  };

  const historyProblem =
    loadError ||
    (activeSchedule && hoursHistoryOverlaps(activeSchedule, hoursHistory).length
      ? 'Saved rosters overlap, so the hours balances cannot be worked out. Fix the dates of those rosters on the Rosters screen first.'
      : null);
  const waiting = !historyProblem && (!loaded || (activeSchedule && !hoursHistory));

  const hoursColumns: Column<NurseHoursAccounting>[] = [
    {
      key: 'name',
      header: 'Nurse',
      sortValue: (r) => r.nurse.fullName,
      cell: (r) => (
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setTimesheetRow(r)}
            className="inline-flex min-h-6 min-w-6 items-center rounded text-left font-semibold text-brand hover:underline"
            aria-label={`${r.nurse.fullName}: open the timesheet`}
          >
            {r.nurse.fullName}
          </button>
          <span className="block text-xs font-normal text-ink-muted">
            {[r.seniority?.name, r.nurse.employeeCode, plural(r.totalShiftsCount, 'shift')].filter(Boolean).join(' · ')}
          </span>
        </div>
      ),
    },
    { key: 'contract', header: 'Contract', align: 'right', sortValue: (r) => r.contractPercent, cell: (r) => `${r.contractPercent}%` },
    {
      key: 'goal',
      header: 'Goal',
      align: 'right',
      sortValue: (r) => r.targetHours,
      cell: (r) => (
        <div>
          <span className="font-semibold">{hours(r.targetHours)}</span>
          {Math.abs(r.balance.carriedHours) >= 0.05 && (
            <span className="block text-xs text-ink-muted">
              {hours(Math.abs(r.balance.carriedHours))} {r.balance.carriedHours > 0 ? 'owed from before' : 'ahead from before'}
            </span>
          )}
          {r.parts.length > 1 &&
            r.parts.map((p) => (
              <span key={p.startDate} className={cx('block text-xs', p.workedHours < p.targetHours - 4 ? 'text-warning' : 'text-ink-muted')}>
                {p.name}: {hours(p.workedHours)} of {hours(p.targetHours)}
              </span>
            ))}
        </div>
      ),
    },
    { key: 'worked', header: 'Worked', align: 'right', sortValue: (r) => r.dutyHours, cell: (r) => hours(r.dutyHours) },
    { key: 'leave', header: 'Leave', align: 'right', sortValue: (r) => r.leaveHours, cell: (r) => hours(r.leaveHours) },
    {
      key: 'difference',
      header: 'Difference',
      align: 'right',
      sortValue: (r) => r.varianceHours,
      cell: (r) => (
        <span className={cx('font-semibold', r.varianceHours <= -0.05 ? 'text-danger' : 'text-ink')}>{differenceWords(r.varianceHours)}</span>
      ),
    },
    { key: 'weekends', header: 'Weekend shifts', align: 'right', sortValue: (r) => r.weekendShiftsCount, cell: (r) => r.weekendShiftsCount },
    { key: 'late', header: 'Late finishes', align: 'right', sortValue: (r) => r.lateDutiesCount, cell: (r) => r.lateDutiesCount },
    {
      key: 'share',
      header: 'Share of goal',
      sortValue: (r) => r.pacePercent,
      className: 'w-36',
      cell: (r) => (
        <div className="space-y-1">
          <span className="tabular-nums">{r.pacePercent}%</span>
          <Meter percent={r.pacePercent} tone={shareTone(r.pacePercent)} label={`${r.nurse.fullName}, share of goal`} />
        </div>
      ),
    },
    { key: 'status', header: 'Status', sortValue: (r) => statusWord(r.status), cell: (r) => <Badge tone={statusTone(r.status)}>{statusWord(r.status)}</Badge> },
  ];

  // Found by short name: the live leave types have generated ids, not 'leave-al' and so on.
  const idOf = (acronym: string) => leaveTypes.find((lt) => lt.acronym?.toUpperCase() === acronym)?.id ?? `leave-${acronym.toLowerCase()}`;
  const days = (n: number) => plural(n, 'day');
  const leaveColumns: Column<NurseHoursAccounting>[] = [
    { key: 'name', header: 'Nurse', sortValue: (r) => r.nurse.fullName, cell: (r) => r.nurse.fullName },
    { key: 'seniority', header: 'Seniority', sortValue: (r) => r.seniority?.name, cell: (r) => r.seniority?.name || 'None set' },
    {
      key: 'al',
      header: 'Annual leave used',
      align: 'right',
      sortValue: (r) => r.quotas.find((q) => q.leaveTypeId === idOf('AL'))?.usedDays ?? 0,
      cell: (r) => {
        const q = r.quotas.find((x) => x.leaveTypeId === idOf('AL'));
        return `${q?.usedDays ?? 0} of ${days(q?.annualQuotaDays ?? 0)}`;
      },
    },
    {
      key: 'alLeft',
      header: 'Annual leave left',
      align: 'right',
      sortValue: (r) => r.quotas.find((q) => q.leaveTypeId === idOf('AL'))?.remainingDays ?? 0,
      cell: (r) => days(r.quotas.find((q) => q.leaveTypeId === idOf('AL'))?.remainingDays ?? 0),
    },
    {
      key: 'ph',
      header: 'Public holidays',
      align: 'right',
      cell: (r) => {
        const q = r.quotas.find((x) => x.leaveTypeId === idOf('PH'));
        return `${q?.usedDays ?? 0} of ${days(q?.annualQuotaDays ?? 0)}`;
      },
    },
    {
      key: 'bl',
      header: 'Birthday leave',
      align: 'right',
      cell: (r) => `${r.leaveBreakdown[idOf('BL')]?.daysCount || 0} of ${days(r.quotas.find((q) => q.leaveTypeId === idOf('BL'))?.annualQuotaDays ?? 0)}`,
    },
    {
      key: 'sl',
      header: 'Sick days',
      align: 'right',
      sortValue: (r) => r.leaveBreakdown[idOf('SL')]?.daysCount || 0,
      cell: (r) => days(r.leaveBreakdown[idOf('SL')]?.daysCount || 0),
    },
    {
      key: 'open',
      header: 'Timesheet',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (r) => (
        <Button size="sm" onClick={() => setTimesheetRow(r)} aria-label={`Timesheet of ${r.nurse.fullName}`}>
          Timesheet
        </Button>
      ),
    },
  ];

  const over = rows.length - metrics.nursesInDeficitCount - metrics.nursesOnTrackCount;

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6 print:max-w-none print:p-0">
      <PageHeader
        title="Reports"
        meta={<span>Hours worked against each nurse's goal, how fairly shifts were shared, and leave allowances.</span>}
        actions={
          <div className="flex flex-wrap items-end gap-2 print:hidden">
            <Field label="Roster" className="min-w-56">
              {(p) => (
                <Select
                  {...p}
                  value={activeSchedule?.id || ''}
                  onChange={(e) => {
                    const found = schedules.find((s) => s.id === e.target.value);
                    if (found) setActiveSchedule(found);
                  }}
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({formatDateRange(s.startDate, s.endDate)})
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            {canExport && (
              <>
                <Button icon={Download} onClick={handleExportPayrollCsv} disabled={rows.length === 0}>
                  Payroll (CSV)
                </Button>
                <Button icon={FileSpreadsheet} onClick={handleExportAllTimesheetsCsv} disabled={rows.length === 0}>
                  Timesheets (CSV)
                </Button>
              </>
            )}
            <IconButton icon={Printer} label="Print this report" variant="outline" onClick={() => window.print()} />
          </div>
        }
      />

      {historyProblem && (
        <Notice tone="danger" title="Hours balances not shown" live>
          {historyProblem}
        </Notice>
      )}

      {waiting ? (
        <Card>
          <LoadingState label="Working out the hours…" />
        </Card>
      ) : !activeSchedule ? (
        <Card>
          <EmptyState icon={CalendarClock} title="No rosters yet">
            Reports appear once a roster is made.
          </EmptyState>
        </Card>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Goal" value={hours(metrics.totalContractedTargetHours)} note={`For ${plural(metrics.totalNurses, 'nurse')}`} />
            <Stat label="Worked" value={hours(metrics.totalDutyHoursWorked)} note={plural(assignments.length, 'shift')} />
            <Stat label="Leave" value={hours(metrics.totalLeaveHoursCredited)} note="Leave that counts as hours" />
            <Stat
              label="Difference"
              value={
                <span className="text-base">
                  {[metrics.totalOvertimeHours >= 0.05 && `${hours(metrics.totalOvertimeHours)} ahead`, metrics.totalDeficitHours >= 0.05 && `${hours(metrics.totalDeficitHours)} short`]
                    .filter(Boolean)
                    .join(', ') || 'Even'}
                </span>
              }
              note={`${metrics.nursesOnTrackCount} on goal, ${metrics.nursesInDeficitCount} short, ${over} ahead`}
            />
            <Stat label="Share of goal" value={`${metrics.clinicFulfillmentPercent}%`} note={`${hours(metrics.totalEarnedHours)} worked and leave`}>
              <Meter percent={metrics.clinicFulfillmentPercent} tone={metrics.clinicFulfillmentPercent >= 90 ? 'success' : metrics.clinicFulfillmentPercent >= 75 ? 'warning' : 'danger'} label="Clinic share of goal" />
            </Stat>
          </dl>

          <Tabs
            label="Reports"
            idPrefix="reports"
            value={open}
            onChange={(id) => onAddressChange?.({ tab: id === 'hours' ? undefined : id }, 'push')}
            tabs={REPORT_TABS.map((t) => (t.id === 'hours' ? { ...t, count: rows.length } : t))}
            className="print:hidden"
          />

          <TabPanel idPrefix="reports" id="hours" value={open} className="space-y-4">
            {open === 'hours' && (
              <>
                <div role="search" aria-label="Filter the nurses" className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-surface p-3 shadow-card lg:grid-cols-4 print:hidden">
                  <Field label="Search" className="col-span-2 lg:col-span-1">
                    {(p) => (
                      <div className="relative">
                        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted" />
                        <Input {...p} type="search" placeholder="Name or staff number" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} className="pl-8" />
                      </div>
                    )}
                  </Field>
                  <Field label="Seniority">
                    {(p) => (
                      <Select {...p} value={filters.seniority} onChange={(e) => setFilter('seniority', e.target.value)}>
                        <option value="ALL">All</option>
                        {seniorityLevels.map((sl) => (
                          <option key={sl.id} value={sl.id}>
                            {sl.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <Field label="Contract">
                    {(p) => (
                      <Select {...p} value={filters.contract} onChange={(e) => setFilter('contract', e.target.value as ReportFilters['contract'])}>
                        <option value="ALL">All</option>
                        <option value="FULL">Full time</option>
                        <option value="PART">Part time</option>
                      </Select>
                    )}
                  </Field>
                  <Field label="Status">
                    {(p) => (
                      <Select {...p} value={filters.status} onChange={(e) => setFilter('status', e.target.value as ReportFilters['status'])}>
                        <option value="ALL">All</option>
                        {STATUS_CHOICES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </div>

                <Card
                  title={`Hours for ${activeSchedule.name}`}
                  actions={<span className="text-sm text-ink-muted">{shownRows.length === rows.length ? plural(rows.length, 'nurse') : `${shownRows.length} of ${rows.length} nurses`}</span>}
                  bodyClassName=""
                >
                  <p className="border-b border-line px-4 py-2 text-sm text-ink-muted">
                    Difference is the balance at the end of this roster, counting the rosters before it, and Status is judged on that balance. Share of goal counts this roster only. Open a nurse to see the timesheet.
                  </p>
                  <DataTable
                    caption={`Hours for ${activeSchedule.name}`}
                    columns={hoursColumns}
                    rows={shownRows}
                    rowKey={(r) => r.nurse.id}
                    initialSort={{ key: 'share', direction: 'ascending' }}
                    empty={<EmptyState title={rows.length ? 'No nurse matches' : 'No nurses'}>{rows.length ? 'Change the search or the filters.' : 'Add nurses on the Nurses screen.'}</EmptyState>}
                  />
                </Card>
              </>
            )}
          </TabPanel>

          <TabPanel idPrefix="reports" id="fairness" value={open} className="space-y-4">
            {open === 'fairness' && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card title="Weekend shifts">
                    <p className="mb-3 text-sm text-ink-muted">
                      On average {metrics.averageWeekendShiftsPerNurse} weekend shifts for each nurse: fewest {metrics.minWeekendShifts}, most {metrics.maxWeekendShifts}. The closer these are, the more fairly weekends were shared.
                    </p>
                    <BarList caption="Weekend shifts for each nurse" unit={(n) => plural(n, 'shift')} items={rows.map((r) => ({ id: r.nurse.id, name: r.nurse.fullName, value: r.weekendShiftsCount }))} />
                  </Card>
                  <Card title="Late finishes">
                    <p className="mb-3 text-sm text-ink-muted">Shifts that end at closing time. Sharing them out keeps late days from piling up on a few nurses.</p>
                    <BarList caption="Late finishes for each nurse" unit={(n) => plural(n, 'shift')} items={rows.map((r) => ({ id: r.nurse.id, name: r.nurse.fullName, value: r.lateDutiesCount }))} />
                  </Card>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card title="Hours by shift">
                    <ul className="space-y-3">
                      {Object.values(metrics.dutyTypeDistribution).map((d) => (
                        <li key={d.dutyWindow.id} title={`${d.dutyWindow.name}: ${hours(d.totalHours)}, ${d.percentageOfHours}%`} className="space-y-1 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="flex items-center gap-2">
                              <span
                                className="inline-flex size-6 items-center justify-center rounded text-xs font-semibold"
                                style={{ backgroundColor: d.dutyWindow.color, color: readableTextOn(d.dutyWindow.color) }}
                                aria-hidden="true"
                              >
                                {d.dutyWindow.acronym}
                              </span>
                              <span className="font-semibold text-ink">
                                {d.dutyWindow.name} ({d.dutyWindow.startTime} to {d.dutyWindow.endTime})
                              </span>
                            </span>
                            <span className="tabular-nums text-ink-muted">
                              {plural(d.shiftsCount, 'shift')}, {hours(d.totalHours)} ({d.percentageOfHours}%)
                            </span>
                          </div>
                          <div aria-hidden="true" className="h-2.5">
                            <div className="h-full rounded-r" style={{ backgroundColor: d.dutyWindow.color, width: `${Math.min(100, d.percentageOfHours)}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card title="Goal reached by seniority">
                    <p className="mb-3 text-sm text-ink-muted">
                      Hours fairness score {metrics.hoursFairnessIndex} out of 100: 100 means every full time nurse has the same hours.
                    </p>
                    <ul className="space-y-3">
                      {Object.values(metrics.seniorityDistribution).map((s) => (
                        <li key={s.seniority.id} className="space-y-1 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-ink">
                              {s.seniority.name} <span className="font-normal text-ink-muted">({plural(s.nursesCount, 'nurse')})</span>
                            </span>
                            <span className="tabular-nums text-ink-muted">
                              {hours(s.earnedHours)} of {hours(s.targetHours)} ({s.fulfillmentPercent}%)
                            </span>
                          </div>
                          <Meter percent={s.fulfillmentPercent} tone="brand" label={`${s.seniority.name}, goal reached`} />
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </>
            )}
          </TabPanel>

          <TabPanel idPrefix="reports" id="leave" value={open}>
            {open === 'leave' && (
              <Card title="Leave allowance this year" bodyClassName="">
                <p className="border-b border-line px-4 py-2 text-sm text-ink-muted">
                  Days used against each nurse's allowance. Sick leave has no allowance, so only the days taken show.
                </p>
                <DataTable
                  caption="Leave allowance this year"
                  columns={leaveColumns}
                  rows={rows}
                  rowKey={(r) => r.nurse.id}
                  empty={<EmptyState title="No nurses">Add nurses on the Nurses screen.</EmptyState>}
                />
              </Card>
            )}
          </TabPanel>
        </>
      )}

      <NurseTimesheetModal schedule={activeSchedule || schedules[0]} accounting={timesheetRow} isOpen={!!timesheetRow} onClose={() => setTimesheetRow(null)} />
    </div>
  );
};
