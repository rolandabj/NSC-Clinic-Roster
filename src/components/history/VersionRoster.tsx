/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The shifts of one saved version as a roster table: nurses down, days across, leave and pinned
 * days shown, one block of weeks at a time or the whole roster, and a search for a nurse. Used by
 * History's Roster tab and its Open larger dialog (Phase 7, slice 5).
 */

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Assignment, ClinicalRole, Doctor, DutyWindow, LeaveType, Nurse, ScheduleVersion, SeniorityLevel, Specialty } from '../../types';
import { isWeekendDay } from '../../utils/weekend';
import { formatDate } from '../../utils/dateUtils';
import { readableTextOn } from '../../utils/colorContrast';
import { isFloatShift } from '../../services/engine/floatShift';
import { versionName } from '../../services/history/versionKinds';
import { Field, IconButton, Input, Switch, cx } from '../ui';

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface VersionRosterProps {
  version: ScheduleVersion;
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  doctors: Doctor[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  leaveTypes: LeaveType[];
  seniorityLevels?: SeniorityLevel[];
  /** Start with the whole roster rather than its first weeks. */
  startWhole?: boolean;
}

/** Who or what a shift is for: a doctor, a duty, a specialty or the float. */
export const shiftTargetName = (
  a: Assignment,
  maps: { doctors: Map<string, Doctor>; roles: Map<string, ClinicalRole>; specialties: Map<string, Specialty> },
  short = false
): string => {
  if (isFloatShift(a)) return 'Float';
  if (a.doctorId) {
    const doc = maps.doctors.get(a.doctorId);
    if (!doc) return 'Doctor';
    return short ? doc.fullName.split(' ').slice(-1)[0] : doc.fullName;
  }
  if (a.clinicalRoleId) return maps.roles.get(a.clinicalRoleId)?.name || 'Duty';
  if (a.specialtyId) return maps.specialties.get(a.specialtyId)?.name || 'Specialty';
  return '';
};

export const VersionRoster: React.FC<VersionRosterProps> = ({
  version,
  nurses,
  dutyWindows,
  doctors,
  roles,
  specialties,
  leaveTypes,
  seniorityLevels = [],
  startWhole = false,
}) => {
  const [blockIndex, setBlockIndex] = useState(0);
  const [showWholeRoster, setShowWholeRoster] = useState(startWhole);
  const [nurseSearch, setNurseSearch] = useState('');

  const schedule = version.snapshot.schedule;
  const maps = useMemo(
    () => ({
      duties: new Map(dutyWindows.map((d) => [d.id, d])),
      doctors: new Map(doctors.map((d) => [d.id, d])),
      roles: new Map(roles.map((r) => [r.id, r])),
      specialties: new Map(specialties.map((s) => [s.id, s])),
      seniority: new Map(seniorityLevels.map((s) => [s.id, s])),
      leaveTypes: new Map(leaveTypes.map((l) => [l.id, l])),
    }),
    [dutyWindows, doctors, roles, specialties, seniorityLevels, leaveTypes]
  );

  const daysPerBlock = (schedule?.blockWeeks || 2) * 7;
  const { blockDates, totalBlocks } = useMemo(() => {
    if (!schedule) return { blockDates: [] as string[], totalBlocks: 1 };
    const start = new Date(schedule.startDate + 'T00:00:00Z');
    const end = new Date(schedule.endDate + 'T00:00:00Z');
    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
    const numBlocks = Math.max(1, Math.ceil(totalDays / daysPerBlock));
    const first = showWholeRoster ? 1 : blockIndex * daysPerBlock + 1;
    const last = showWholeRoster ? totalDays : Math.min((blockIndex + 1) * daysPerBlock, totalDays);
    const dates: string[] = [];
    for (let day = first; day <= last; day++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + (day - 1));
      dates.push(d.toISOString().split('T')[0]);
    }
    return { blockDates: dates, totalBlocks: numBlocks };
  }, [schedule, blockIndex, showWholeRoster, daysPerBlock]);

  const shownNurses = useMemo(() => {
    const q = nurseSearch.toLowerCase().trim();
    return nurses.filter((n) => !q || n.fullName.toLowerCase().includes(q) || n.employeeCode.toLowerCase().includes(q));
  }, [nurses, nurseSearch]);

  const assignments = version.snapshot.assignments || [];
  const leaves = version.snapshot.leaveEntries || [];
  const locks = version.snapshot.locks || [];
  const name = versionName(version).toLowerCase();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {!showWholeRoster && totalBlocks > 1 && (
            <div className="flex items-center gap-1">
              <IconButton label="Earlier weeks" icon={ChevronLeft} disabled={blockIndex === 0} onClick={() => setBlockIndex((p) => Math.max(0, p - 1))} />
              <span className="min-w-48 text-center text-sm font-medium text-ink" aria-live="polite">
                {formatDate(blockDates[0])} to {formatDate(blockDates[blockDates.length - 1])}
              </span>
              <IconButton
                label="Later weeks"
                icon={ChevronRight}
                disabled={blockIndex >= totalBlocks - 1}
                onClick={() => setBlockIndex((p) => Math.min(totalBlocks - 1, p + 1))}
              />
            </div>
          )}
          {totalBlocks > 1 && <Switch label="Show the whole roster" checked={showWholeRoster} onChange={setShowWholeRoster} />}
        </div>
        <Field label="Find a nurse" className="w-full sm:w-56">
          {(f) => <Input {...f} type="search" value={nurseSearch} onChange={(e) => setNurseSearch(e.target.value)} placeholder="Name or code" />}
        </Field>
      </div>

      <div className="relative overflow-x-auto rounded-lg border border-line" tabIndex={0} role="region" aria-label={`Shifts of ${name}`}>
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Shifts of {name} of {schedule?.name}
          </caption>
          <thead>
            <tr className="border-b border-line bg-sunken text-ink-muted">
              <th scope="col" className="sticky left-0 z-10 min-w-40 border-r border-line bg-sunken px-3 py-2 font-semibold">
                Nurse
              </th>
              {blockDates.map((dateStr) => {
                const dateObj = new Date(dateStr + 'T00:00:00Z');
                return (
                  <th
                    key={dateStr}
                    scope="col"
                    className={cx('min-w-16 border-r border-line px-1 py-1.5 text-center font-normal', isWeekendDay(dateObj.getUTCDay()) && 'bg-line/60')}
                  >
                    <span className="block text-xs text-ink-muted">{WEEKDAY_NAMES[dateObj.getUTCDay()]}</span>
                    <span className="block font-semibold text-ink">{Number(dateStr.split('-')[2])}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {shownNurses.map((nurse) => (
              <tr key={nurse.id}>
                <th scope="row" className="sticky left-0 z-10 border-r border-line bg-surface px-3 py-1.5 text-left font-normal">
                  <span className="block truncate font-semibold text-ink">{nurse.fullName}</span>
                  <span className="block text-xs text-ink-muted">
                    {nurse.employeeCode}, {maps.seniority.get(nurse.seniorityLevelId)?.name || `${nurse.contractPercent}%`}
                  </span>
                </th>
                {blockDates.map((dateStr) => {
                  const asgn = assignments.find((a) => a.nurseId === nurse.id && a.date === dateStr);
                  const leave = leaves.find((l) => l.nurseId === nurse.id && l.approved && dateStr >= l.startDate && dateStr <= l.endDate);
                  const pinned = locks.some((lk) => lk.nurseId === nurse.id && lk.date === dateStr) || asgn?.locked;
                  const duty = asgn ? maps.duties.get(asgn.dutyWindowId) : null;
                  const leaveType = leave ? maps.leaveTypes.get(leave.leaveTypeId) : null;
                  const target = asgn ? shiftTargetName(asgn, maps, true) : '';
                  return (
                    <td key={dateStr} className="border-r border-line p-1 text-center align-middle">
                      {leave ? (
                        <span
                          className="block rounded border border-warning-line bg-warning-soft px-1 py-0.5 text-xs font-semibold text-warning"
                          title={leaveType?.name || 'Leave'}
                        >
                          {leaveType?.acronym || 'Leave'}
                        </span>
                      ) : asgn && duty ? (
                        <span
                          className="block rounded px-1 py-0.5 text-xs font-semibold"
                          style={{ backgroundColor: duty.color, color: readableTextOn(duty.color) }}
                          title={`${duty.name}, ${duty.startTime} to ${duty.endTime}${target ? `, ${target}` : ''}${pinned ? ', pinned day' : ''}`}
                        >
                          <span className="flex items-center justify-center gap-0.5">
                            {duty.acronym}
                            {pinned && <Lock aria-label="Pinned day" className="size-3 shrink-0" />}
                          </span>
                          {target && <span className="block max-w-16 truncate font-normal">{target}</span>}
                        </span>
                      ) : (
                        <span className="sr-only">No shift</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-wrap items-center gap-2 text-xs text-ink-muted" aria-label="Key">
        {dutyWindows.map((dw) => (
          <li key={dw.id} className="rounded px-1.5 py-0.5 font-semibold" style={{ backgroundColor: dw.color, color: readableTextOn(dw.color) }}>
            {dw.acronym}: {dw.name}, {dw.startTime} to {dw.endTime}
          </li>
        ))}
        <li className="rounded border border-warning-line bg-warning-soft px-1.5 py-0.5 font-semibold text-warning">Leave</li>
        <li className="flex items-center gap-1">
          <Lock aria-hidden="true" className="size-3" /> Pinned day
        </li>
      </ul>
    </div>
  );
};
