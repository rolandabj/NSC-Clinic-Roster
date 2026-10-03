/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * What the dashboard shows, worked out from the roster data (pure, so it can
 * be tested): who is on duty today, how a roster differs from what was last
 * published, read receipts, and whether the next roster still needs making.
 */

import { Acknowledgment, Assignment, DutyWindow, LeaveEntry, Nurse, Schedule, SeniorityLevel } from '../../types';

/** Days ahead of the last roster's end at which the dashboard asks for the next one. */
export const NEXT_ROSTER_WARNING_DAYS = 21;

const addDays = (date: string, days: number) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

/** Cells (nurse and day) whose shift differs between two lists; pinning counts as a change. */
export function countChangedCells(before: Assignment[], now: Assignment[]): number {
  const sig = (a: Assignment) =>
    `${a.dutyWindowId}|${a.kind}|${a.doctorId || ''}|${a.clinicalRoleId || ''}|${a.specialtyId || ''}|${a.locked ? 'pinned' : ''}`;
  const cells = (list: Assignment[]) => {
    const m = new Map<string, string>();
    for (const a of list) m.set(`${a.nurseId}|${a.date}`, sig(a));
    return m;
  };
  const was = cells(before);
  const is = cells(now);
  let changed = 0;
  for (const [key, value] of is) if (was.get(key) !== value) changed++;
  for (const key of was.keys()) if (!is.has(key)) changed++;
  return changed;
}

export interface OnDutyEntry {
  nurseId: string;
  name: string;
  acronym: string;
  startTime: string;
  endTime: string;
  detail: string;
  senior: boolean;
}

export interface TodayAtClinic {
  onDuty: OnDutyEntry[];
  onLeave: { nurseId: string; name: string }[];
  hasSenior: boolean;
}

/** Who works on a day (by start time), who is on approved leave, and whether a senior nurse is on. */
export function todayAtClinic(input: {
  date: string;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  seniorityLevels: SeniorityLevel[];
  leaveEntries: LeaveEntry[];
  detailOf: (a: Assignment) => string;
}): TodayAtClinic {
  const { date } = input;
  const nurseMap = new Map(input.nurses.map((n) => [n.id, n]));
  const dutyMap = new Map(input.dutyWindows.map((d) => [d.id, d]));
  const seniorIds = new Set(input.seniorityLevels.filter((s) => s.isSenior).map((s) => s.id));
  const onLeaveIds = new Set(
    input.leaveEntries
      .filter((le) => le.approved && date >= le.startDate && date <= le.endDate)
      .map((le) => le.nurseId)
  );
  // Every shift that day (a nurse with two shows twice), except exact repeats.
  const seen = new Set<string>();
  const onDuty: OnDutyEntry[] = [];
  for (const a of input.assignments) {
    if (a.date !== date || onLeaveIds.has(a.nurseId)) continue;
    const nurse = nurseMap.get(a.nurseId);
    const duty = dutyMap.get(a.dutyWindowId);
    if (!nurse || nurse.active === false || !duty) continue;
    const key = `${a.nurseId}|${a.dutyWindowId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    onDuty.push({
      nurseId: nurse.id,
      name: nurse.fullName,
      acronym: duty.acronym,
      startTime: duty.startTime,
      endTime: duty.endTime,
      detail: input.detailOf(a),
      senior: seniorIds.has(nurse.seniorityLevelId),
    });
  }
  onDuty.sort((a, b) => a.startTime.localeCompare(b.startTime) || a.name.localeCompare(b.name));
  const onLeave = [...onLeaveIds]
    .map((id) => nurseMap.get(id))
    .filter((n): n is Nurse => !!n && n.active !== false)
    .map((n) => ({ nurseId: n.id, name: n.fullName }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { onDuty, onLeave, hasSenior: onDuty.some((e) => e.senior) };
}

/** Each nurse once, for counts (two shifts are still one nurse). */
export function nursesOnDuty(info: TodayAtClinic): number {
  return new Set(info.onDuty.map((e) => e.nurseId)).size;
}

/** Read receipts for one published version: how many were sent and how many confirmed. */
export function receiptSummary(acks: Acknowledgment[], versionId: string) {
  const forVersion = acks.filter((a) => a.versionId === versionId);
  const waiting = forVersion.filter((a) => !a.ackAt);
  return { sent: forVersion.length, confirmed: forVersion.length - waiting.length, waitingNurseIds: waiting.map((a) => a.nurseId) };
}

/**
 * When no roster covers the days soon after the last one ends, the dates the
 * next roster should start from (else null).
 */
export function nextRosterNeeded(
  schedules: (Pick<Schedule, 'startDate' | 'endDate'> & { status?: Schedule['status'] })[],
  today: string
): { from: string } | null {
  const live = schedules.filter((s) => s.status !== 'ARCHIVED');
  if (live.length === 0) return null;
  const lastEnd = live.reduce((max, s) => (s.endDate > max ? s.endDate : max), '');
  if (!lastEnd || lastEnd > addDays(today, NEXT_ROSTER_WARNING_DAYS)) return null;
  // Never a date in the past: after a long gap the next roster starts today.
  const next = addDays(lastEnd, 1);
  return { from: next < today ? today : next };
}
