/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Explains an empty roster cell in plain words: why a nurse is off that day,
 * or which shifts she could still take and what that does to her hours.
 * It tries every active shift with the shared hard rule check
 * (checkAssignment), so it never says a shift is possible when moving it there
 * by hand would be refused. Rules set to SOFT are tried too, and only noted.
 * Hours follow the shared rule (summarizeNurseHours).
 */

import {
  Assignment,
  ClinicalRole,
  Doctor,
  DoctorSession,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  LockEntry,
  Nurse,
  Rule,
  Schedule,
  SeniorityLevel,
  WorkingHoursPeriod,
} from '../../types';
import { checkAssignment, AssignmentCheckContext } from './assignmentChecks';
import { calculateDutyDurationHours, summarizeNurseHours } from '../reports/hoursAccounting';

export interface ExplainDayInput {
  schedule: Pick<Schedule, 'id' | 'startDate' | 'endDate' | 'hoursTargetFullTime' | 'periodName'>;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  roles: ClinicalRole[];
  rules: Rule[];
  seniorityLevels?: SeniorityLevel[];
  workingHoursPeriods?: WorkingHoursPeriod[];
  leaveTypes?: LeaveType[];
  /** Not needed for the checks today; accepted so callers can pass the whole roster. */
  sessions?: DoctorSession[];
  doctors?: Doctor[];
}

export interface ExplainNurseDayInput extends ExplainDayInput {
  nurseId: string;
  date: string;
}

export interface PossibleShift {
  dutyWindowId: string;
  /** The shift's short name, e.g. "E". */
  label: string;
  name: string;
  startTime: string;
  endTime: string;
  /** Her total hours for the roster if she took this shift. */
  hoursAfter: number;
}

export interface BlockedShift {
  dutyWindowId: string;
  label: string;
  reasons: string[];
}

export interface NurseDayExplanation {
  nurseId: string;
  nurseName: string;
  date: string;
  status: 'WORKING' | 'BLOCKED' | 'AVAILABLE';
  /** Why she can't work that day (BLOCKED), plain sentences without repeats. */
  reasons: string[];
  /** Shifts she could take (AVAILABLE). */
  possibleShifts: PossibleShift[];
  /** Shifts she can't take on a day she is otherwise free, with the reason. */
  blockedShifts: BlockedShift[];
  /** Things worth knowing before adding a shift (allowed, but not ideal). */
  notes: string[];
  /** worked = total hours now, goal = her hours goal, afterShift = total after the shortest possible shift. */
  hours: { worked: number; goal: number; afterShift?: number };
  isSenior: boolean;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function shiftDate(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
}

/** Rewrites one of checkAssignment's reasons (which start with the nurse's name and may end with the date) as a plain sentence about that day. */
function plainReason(
  raw: string,
  name: string,
  date: string,
  ctx: { prevDuty?: DutyWindow; nextDuty?: DutyWindow; lockedDuty?: DutyWindow; leaveName?: string; lockNote?: string }
): string {
  let text = raw.startsWith(name) ? raw.slice(name.length).trim() : raw;
  text = text.replace(new RegExp(` on ${date}$`), '');
  let m: RegExpMatchArray | null;
  if (/^is on approved leave/.test(text)) {
    return ctx.leaveName ? `On approved leave (${ctx.leaveName}).` : 'On approved leave.';
  }
  if (/^has a day off lock/.test(text)) {
    return ctx.lockNote ? `Has a pinned day off (${ctx.lockNote}).` : 'Has a pinned day off.';
  }
  if (/^has a pinned shift/.test(text)) {
    return ctx.lockedDuty ? `This day is pinned to the ${ctx.lockedDuty.name} shift.` : 'This day is pinned to another shift.';
  }
  if ((m = text.match(/^would work (\d+) days in a row \(maximum (\d+)\)/))) {
    return `Would be ${m[1]} working days in a row; the limit is ${m[2]}.`;
  }
  if ((m = text.match(/^would have less than ([\d.]+)h rest after/))) {
    const p = ctx.prevDuty;
    return p
      ? `Needs ${m[1]} hours rest after the ${p.name} shift the day before (it ends at ${p.endTime}).`
      : `Needs ${m[1]} hours rest after the shift the day before.`;
  }
  if ((m = text.match(/^would have less than ([\d.]+)h rest before/))) {
    const n = ctx.nextDuty;
    return n
      ? `Needs ${m[1]} hours rest before the ${n.name} shift the next day (it starts at ${n.startTime}).`
      : `Needs ${m[1]} hours rest before the shift the next day.`;
  }
  if ((m = text.match(/^would have (\d+) late duties in a row \(maximum (\d+)\)/))) {
    return `Would be ${m[1]} late shifts in a row; the limit is ${m[2]}.`;
  }
  if (/^already has a duty/.test(text)) return 'Already has a shift this day.';
  const sentence = text.charAt(0).toUpperCase() + text.slice(1);
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

const unique = (list: string[]) => Array.from(new Set(list));

/** Why one nurse is off on one day, or which shifts she could still take. */
export function explainNurseDay(input: ExplainNurseDayInput): NurseDayExplanation {
  const { nurseId, date, schedule, assignments, nurses, dutyWindows, leaveEntries, locks, roles, rules } = input;
  const nurse = nurses.find((n) => n.id === nurseId);
  const name = nurse?.fullName || 'This nurse';
  const dutyMap = new Map(dutyWindows.map((d) => [d.id, d]));
  const leaveTypes = input.leaveTypes || [];
  const seniorIds = new Set((input.seniorityLevels || []).filter((s) => s.isSenior).map((s) => s.id));
  const isSenior = !!nurse && seniorIds.has(nurse.seniorityLevelId);

  const summary = nurse
    ? summarizeNurseHours(nurse, schedule, assignments, dutyMap, leaveEntries, leaveTypes, input.workingHoursPeriods || [])
    : { totalHours: 0, targetHours: 0 };
  const worked = summary.totalHours;
  const goal = summary.targetHours;

  const base: NurseDayExplanation = {
    nurseId,
    nurseName: name,
    date,
    status: 'WORKING',
    reasons: [],
    possibleShifts: [],
    blockedShifts: [],
    notes: [],
    hours: { worked, goal },
    isSenior,
  };
  if (assignments.some((a) => a.nurseId === nurseId && a.date === date)) return base;

  const own = assignments.filter((a) => a.nurseId === nurseId);
  const dutyOn = (d: string) => {
    const a = own.find((x) => x.date === d);
    return a ? dutyMap.get(a.dutyWindowId) : undefined;
  };
  const leave = leaveEntries.find((le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate);
  const lock = locks.find((l) => l.nurseId === nurseId && l.date === date);
  const wording = {
    prevDuty: dutyOn(shiftDate(date, -1)),
    nextDuty: dutyOn(shiftDate(date, 1)),
    lockedDuty: lock?.mode === 'ASSIGNMENT' && lock.dutyWindowId ? dutyMap.get(lock.dutyWindowId) : undefined,
    leaveName: leave ? leaveTypes.find((t) => t.id === leave.leaveTypeId)?.name : undefined,
    lockNote: lock?.note,
  };

  // The same rules with SOFT ones made hard, to spot what is allowed but not ideal.
  const softAsHard = rules.map((r) => (r.enabled !== false && r.severity === 'SOFT' ? { ...r, severity: 'HARD' } : r)) as Rule[];

  const possible: PossibleShift[] = [];
  const blocked: BlockedShift[] = [];
  const softNotes: string[] = [];
  const shifts = dutyWindows.filter((d) => d.active !== false).sort((a, b) => a.startTime.localeCompare(b.startTime));
  for (const duty of shifts) {
    const pinnedHere = lock?.mode === 'ASSIGNMENT' && lock.dutyWindowId === duty.id;
    const cell = {
      id: '__explain__',
      scheduleId: schedule.id,
      nurseId,
      date,
      dutyWindowId: duty.id,
      kind: 'CLINICAL_ROLE',
      clinicalRoleId: 'role-float',
      locked: pinnedHere,
      source: pinnedHere ? 'LOCK' : 'MANUAL',
    } as Assignment;
    const ctx: AssignmentCheckContext = {
      assignments: [...assignments, cell],
      nurses,
      dutyWindows,
      leaveEntries,
      locks,
      roles,
      rules,
    };
    const hard = checkAssignment(ctx, cell);
    if (hard.length > 0) {
      blocked.push({ dutyWindowId: duty.id, label: duty.acronym, reasons: unique(hard.map((r) => plainReason(r, name, date, wording))) });
      continue;
    }
    const soft = checkAssignment({ ...ctx, rules: softAsHard }, cell);
    for (const r of soft) softNotes.push(`Allowed, but not ideal on ${duty.acronym}: ${plainReason(r, name, date, wording)}`);
    possible.push({
      dutyWindowId: duty.id,
      label: duty.acronym,
      name: duty.name,
      startTime: duty.startTime,
      endTime: duty.endTime,
      hoursAfter: round1(worked + calculateDutyDurationHours(duty)),
    });
  }

  if (possible.length === 0) {
    return { ...base, status: 'BLOCKED', reasons: unique(blocked.flatMap((b) => b.reasons)), blockedShifts: blocked };
  }

  const notes: string[] = [];
  const afterShift = Math.min(...possible.map((p) => p.hoursAfter));
  if (goal > 0 && worked >= goal) {
    notes.push(`Already at their hours goal (${round1(worked)} / ${goal} h); this shift would make ${afterShift} h.`);
  } else if (goal > 0 && afterShift > goal + 2) {
    notes.push(`This shift would take them over their hours goal (${round1(worked)} / ${goal} h; it would make ${afterShift} h).`);
  }
  notes.push(...unique(softNotes));
  if (isSenior && !assignments.some((a) => a.date === date && seniorIds.has(nurses.find((n) => n.id === a.nurseId)?.seniorityLevelId || ''))) {
    notes.push('No senior nurse is on duty this day yet; this nurse is a senior.');
  }

  return {
    ...base,
    status: 'AVAILABLE',
    possibleShifts: possible,
    blockedShifts: blocked,
    notes,
    hours: { worked, goal, afterShift },
  };
}

/**
 * Every active nurse who is not working on the day: free nurses first (the most
 * hours short of their goal first), then nurses who can't work, by name.
 */
export function explainDay(date: string, input: ExplainDayInput): NurseDayExplanation[] {
  const results = input.nurses
    .filter((n) => n.active !== false)
    .map((n) => explainNurseDay({ ...input, nurseId: n.id, date }))
    .filter((r) => r.status !== 'WORKING');
  const short = (r: NurseDayExplanation) => r.hours.goal - r.hours.worked;
  return results.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'AVAILABLE' ? -1 : 1;
    if (a.status === 'AVAILABLE' && short(a) !== short(b)) return short(b) - short(a);
    return a.nurseName.localeCompare(b.nurseName);
  });
}
