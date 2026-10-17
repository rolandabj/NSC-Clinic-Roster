/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Timesheet dialog: one nurse's hours day by day, with leave and their hours goal.
 */

import React, { useState } from 'react';
import { Download, Lock } from 'lucide-react';
import { NurseHoursAccounting } from '../../services/reports/hoursAccounting';
import { Schedule } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { toCsv, downloadCsv, CsvValue } from '../../utils/csv';
import { readableTextOn } from '../../utils/colorContrast';
import { Badge, Button, DataTable, Dialog, cx, type Column } from '../ui';
import { usePermissions } from '../common/usePermissions';

/** Hours as shown to people: at most one decimal. */
const fmtHours = (h: number) => `${Math.round((h || 0) * 10) / 10} h`;

const STATUS_LABELS: Record<string, string> = {
  OPTIMAL: 'On goal',
  UNDER: 'A little short',
  CRITICAL_UNDER: 'Very short',
  OVER: 'A little over',
  CRITICAL_OVER: 'Too many hours',
};

const SOURCE_LABELS: Record<string, string> = {
  GENERATED: 'Filled automatically',
  MANUAL: 'Set by hand',
  LOCK: 'Pinned day',
  APPROVED_LEAVE: 'Approved leave',
  REST_DAY: 'Day off',
};

interface NurseTimesheetModalProps {
  schedule: Schedule;
  accounting: NurseHoursAccounting | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NurseTimesheetModal: React.FC<NurseTimesheetModalProps> = ({
  schedule,
  accounting,
  isOpen,
  onClose,
}) => {
  const { canExport } = usePermissions();
  const [filterType, setFilterType] = useState<'ALL' | 'DUTY' | 'LEAVE' | 'WEEKEND'>('ALL');

  if (!isOpen || !accounting) return null;

  const {
    nurse,
    seniority,
    contractPercent,
    targetHours,
    dutyHours,
    leaveHours,
    totalEarnedHours,
    varianceHours,
    pacePercent,
    status,
    totalShiftsCount,
    weekendShiftsCount,
    lateDutiesCount,
    timeline,
    leaveBreakdown,
    quotas,
  } = accounting;

  const filteredTimeline = timeline.filter((entry) => {
    if (filterType === 'DUTY') return entry.type === 'DUTY';
    if (filterType === 'LEAVE') return entry.type === 'LEAVE';
    if (filterType === 'WEEKEND') return entry.isWeekend && entry.type === 'DUTY';
    return true;
  });

  // Export single nurse CSV
  const handleExportNurseCsv = () => {
    const headers = [
      'Date',
      'Day',
      'Weekend',
      'Type',
      'Shift',
      'Shift hours',
      'Doctor or job',
      'Type of leave',
      'Hours counted',
      'How it was set',
      'Notes',
    ];

    const rows: CsvValue[][] = [headers];
    timeline.forEach((item) => {
      const doctorOrRole = item.doctor
        ? item.doctor.fullName
        : item.clinicalRole
        ? item.clinicalRole.name
        : item.specialty
        ? item.specialty.name
        : '';

      rows.push([
        formatDate(item.date),
        item.weekdayName,
        item.isWeekend ? 'Yes' : 'No',
        item.type === 'DUTY' ? 'Shift' : item.type === 'LEAVE' ? 'Leave' : 'Day off',
        item.dutyWindow ? `${item.dutyWindow.name} (${item.dutyWindow.acronym})` : '',
        item.dutyWindow ? Math.round(item.hoursEarned * 10) / 10 : 0,
        doctorOrRole,
        item.leaveType ? `${item.leaveType.name} (${item.leaveType.acronym})` : '',
        Math.round(item.hoursEarned * 10) / 10,
        item.source ? SOURCE_LABELS[item.source] || item.source : '',
        item.notes || '',
      ]);
    });

    downloadCsv(`timesheet-${nurse.employeeCode}-${schedule.name}.csv`, toCsv(rows));
  };

  const isUnder = status === 'UNDER' || status === 'CRITICAL_UNDER';
  type Day = (typeof timeline)[number];
  const chip = (color: string | undefined, text: string) => (
    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded text-xs font-bold" style={{ backgroundColor: color || '#64748b', color: readableTextOn(color || '#64748b') }}>
      {text}
    </span>
  );
  const columns: Column<Day>[] = [
    { key: 'date', header: 'Date', sortValue: (d) => d.date, cell: (d) => <span className="whitespace-nowrap font-semibold">{d.weekdayName} {formatDate(d.date)}</span>, phone: 'title' },
    {
      key: 'type',
      header: 'Type',
      cell: (d) => (d.type === 'DUTY' ? <Badge tone="brand">Shift</Badge> : d.type === 'LEAVE' ? <Badge tone="warning">Leave</Badge> : <span className="text-ink-muted">Day off</span>),
    },
    {
      key: 'what',
      header: 'Shift or leave',
      cell: (d) =>
        d.dutyWindow ? (
          <span className="flex items-center gap-2">
            {chip(d.dutyWindow.color, d.dutyWindow.acronym)}
            {d.dutyWindow.name} ({d.dutyWindow.startTime} to {d.dutyWindow.endTime})
          </span>
        ) : d.leaveType ? (
          <span className="flex items-center gap-2">
            {chip(d.leaveType.color, d.leaveType.acronym)}
            {d.leaveType.name}
          </span>
        ) : (
          <span className="text-ink-muted">None</span>
        ),
    },
    {
      key: 'with',
      header: 'Doctor or job',
      cell: (d) => d.doctor?.fullName || d.clinicalRole?.name || d.specialty?.name || <span className="text-ink-muted">None</span>,
    },
    { key: 'hours', header: 'Hours', align: 'right', sortValue: (d) => d.hoursEarned, cell: (d) => (d.hoursEarned > 0 ? `+${fmtHours(d.hoursEarned)}` : <span className="text-ink-muted">0 h</span>) },
    {
      key: 'how',
      header: 'How it was set',
      cell: (d) =>
        d.assignment?.locked ? (
          <span className="inline-flex items-center gap-1 font-semibold text-warning">
            <Lock aria-hidden="true" className="size-3.5" /> Pinned day
          </span>
        ) : (
          <span className="text-ink-muted">{d.source ? SOURCE_LABELS[d.source] || d.source : ''}</span>
        ),
    },
    { key: 'notes', header: 'Notes', cell: (d) => d.notes || <span className="text-ink-muted">None</span> },
  ];
  const tiles: { label: string; value: string; note: string; tone?: string }[] = [
    { label: 'Goal hours', value: fmtHours(targetHours), note: `${contractPercent}% contract` },
    { label: 'Shifts', value: fmtHours(dutyHours), note: `${totalShiftsCount} ${totalShiftsCount === 1 ? 'shift' : 'shifts'}` },
    { label: 'Leave', value: fmtHours(leaveHours), note: `${Object.keys(leaveBreakdown).length} ${Object.keys(leaveBreakdown).length === 1 ? 'kind' : 'kinds'} of leave` },
    { label: 'Total', value: fmtHours(totalEarnedHours), note: 'Shifts and leave' },
    {
      label: 'Closing balance',
      value: varianceHours > 0 ? `+${fmtHours(varianceHours)}` : fmtHours(varianceHours),
      note: varianceHours > 0 ? 'Over the goal' : varianceHours < 0 ? 'Under the goal' : 'On the goal',
      tone: varianceHours > 0 ? 'text-success' : varianceHours < 0 ? 'text-danger' : 'text-ink',
    },
    { label: 'Share of goal', value: `${pacePercent}%`, note: STATUS_LABELS[status] || status, tone: status === 'OPTIMAL' ? 'text-success' : isUnder ? 'text-danger' : 'text-ink' },
  ];
  const filters = [
    { id: 'ALL', label: `All days (${timeline.length})` },
    { id: 'DUTY', label: `Shifts only (${totalShiftsCount})` },
    { id: 'LEAVE', label: 'Leave only' },
    { id: 'WEEKEND', label: `Weekends (${weekendShiftsCount})` },
  ] as const;
  const balance = accounting.balance;

  return (
    <Dialog
      open
      onClose={onClose}
      size="xl"
      title={`${nurse.fullName}'s timesheet`}
      description={`${[nurse.employeeCode, seniority?.name].filter(Boolean).join(', ')}${nurse.employeeCode || seniority ? '. ' : ''}${contractPercent}% contract, a goal of ${fmtHours(targetHours)} in ${schedule.name}.`}
      footer={
        <>
          {canExport && (
            <Button icon={Download} onClick={handleExportNurseCsv} className="sm:mr-auto">
              Download the timesheet (CSV)
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="space-y-1 rounded-lg border border-line bg-sunken p-3 text-ink-muted">
          <p>
            Counted from {formatDate(balance.trackingStartDate)}. Base goal {fmtHours(balance.baseTargetHours)}. Carried into this roster:{' '}
            {fmtHours(Math.abs(balance.carriedHours))} {balance.carriedHours >= 0 ? 'owed' : 'ahead'}. Hours counted before: {fmtHours(balance.previousCreditedHours)}. Goal in
            all up to {formatDate(schedule.endDate)}: {fmtHours(balance.cumulativeTargetHours)}.
          </p>
          {accounting.parts.length > 1 && (
            <p>
              Each period on its own:{' '}
              {accounting.parts.map((pt) => `${pt.name} (${formatDate(pt.startDate)} to ${formatDate(pt.endDate)}) ${fmtHours(pt.workedHours)} of ${fmtHours(pt.targetHours)}`).join('; ')}.
            </p>
          )}
          {balance.deferredHours > 0 && <p>{fmtHours(balance.deferredHours)} is still owed and waits for a later roster (a roster asks at most 10% of its own hours extra).</p>}
          {Math.abs(balance.writtenOffHours) >= 0.5 && <p>{fmtHours(Math.abs(balance.writtenOffHours))} carried twice without being settled were written off.</p>}
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-lg border border-line p-3">
              <dt className="text-xs text-ink-muted">{t.label}</dt>
              <dd className={cx('text-lg font-semibold tabular-nums', t.tone || 'text-ink')}>{t.value}</dd>
              <dd className="text-xs text-ink-muted">{t.note}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-ink-muted">
            Weekend shifts: <strong className="text-ink">{weekendShiftsCount}</strong>. Late shifts (ending 21:00 or later):{' '}
            <strong className="text-ink">{lateDutiesCount}</strong>.
          </p>
          <div role="group" aria-label="Show" className="flex flex-wrap gap-1 rounded-lg bg-sunken p-1">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filterType === f.id}
                onClick={() => setFilterType(f.id)}
                className={cx('min-h-8 rounded-md px-3 font-semibold', filterType === f.id ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink')}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-line">
          <DataTable caption={`${nurse.fullName}'s days`} rows={filteredTimeline} rowKey={(d) => d.date} columns={columns} maxHeight="22rem" />
        </div>

        {quotas && quotas.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-ink">Leave left this year</h3>
            {/* Every allowance as set, 0 of 0 included (the owner's rule of 17-10-2026). The allowance is in days; the hours are those counted. */}
            <ul className="flex flex-wrap gap-2">
              {quotas.map((q) => (
                <li key={q.leaveTypeId} className="rounded-lg border border-line px-3 py-1.5">
                  <span className="font-semibold text-ink">{q.leaveTypeName}:</span> {q.usedDays} of {q.annualQuotaDays} days used, {q.remainingDays} left (
                  {fmtHours(q.usedHours)} counted)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Dialog>
  );
};
