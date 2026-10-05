import { Assignment, DutyWindow, LeaveEntry, LeaveType, Nurse, Schedule, WorkingHoursPeriod } from '../../types';
import { inclusiveDays, leaveCreditOnDate, resolveFullTimeTarget } from './hoursPolicy';
import { getDatesInRange, getPeriodDailyRate } from '../periods/workingHoursPeriodService';
import { findScheduleOverlaps, ScheduleOverlap } from '../schedule/scheduleRanges';

type HoursSchedule = Pick<Schedule, 'id' | 'startDate' | 'endDate' | 'hoursTargetFullTime' | 'periodName'> & Partial<Pick<Schedule, 'name'>>;

/** Current saved records only: versions and backups never add a second set of hours. */
export interface HoursHistory {
  schedules: Schedule[];
  assignments: Assignment[];
  leaveEntries?: LeaveEntry[];
}

export interface NurseHoursBalance {
  trackingStartDate: string;
  baseTargetHours: number;
  carriedHours: number; // positive = owed, negative = already ahead
  targetHours: number; // hours to credit in this roster, never negative
  cumulativeTargetHours: number;
  previousCreditedHours: number;
  openingBalanceHours: number; // previous credits minus accrued target
}

export function shiftIsoDate(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function dutyDurationHours(duty?: DutyWindow): number {
  if (!duty) return 0;
  try {
    const [sh, sm] = duty.startTime.split(':').map(Number);
    const [eh, em] = duty.endTime.split(':').map(Number);
    let hours = (eh * 60 + em - sh * 60 - sm) / 60;
    if (hours <= 0) hours += 24;
    return hours > 0 ? hours : 8;
  } catch { return 8; }
}

export function nurseContractShare(nurse: Pick<Nurse, 'contractPercent'>): number {
  const percent = Number(nurse.contractPercent);
  return Number.isFinite(percent) && percent >= 0 ? percent / 100 : 1;
}

/** One approved leave or one shift per nurse and calendar day. */
export function countHoursInRange(
  nurseId: string, start: string, end: string, assignments: Assignment[],
  duties: DutyWindow[] | Map<string, DutyWindow>, leaves: LeaveEntry[], types: LeaveType[] | Map<string, LeaveType>
): { dutyHours: number; leaveHours: number; totalHours: number } {
  const dutyMap = duties instanceof Map ? duties : new Map(duties.map(d => [d.id, d]));
  const typeMap = types instanceof Map ? types : new Map(types.map(t => [t.id, t]));
  const shifts = new Map<string, Assignment>();
  for (const a of assignments) if (a.nurseId === nurseId && a.date >= start && a.date <= end && !shifts.has(a.date)) shifts.set(a.date, a);
  const approved = leaves.filter(l => l.nurseId === nurseId && l.approved && l.startDate <= end && l.endDate >= start);
  let dutyHours = 0, leaveHours = 0;
  for (const date of getDatesInRange(start, end)) {
    const leave = approved.find(l => l.startDate <= date && l.endDate >= date);
    if (leave) leaveHours += leaveCreditOnDate(leave, typeMap.get(leave.leaveTypeId), date);
    else dutyHours += dutyDurationHours(dutyMap.get(shifts.get(date)?.dutyWindowId || ''));
  }
  return { dutyHours, leaveHours, totalHours: dutyHours + leaveHours };
}

export function hoursHistoryOverlaps(schedule: HoursSchedule, history?: HoursHistory): ScheduleOverlap[] {
  if (!history) return [];
  // Later rosters cannot change the accounting of an earlier roster.
  const schedules = [...history.schedules.filter(s => s.id !== schedule.id && s.startDate <= schedule.endDate), { ...schedule, name: schedule.name || schedule.id }];
  return findScheduleOverlaps(schedules);
}

/** Check at every configured period boundary, including gaps between periods. */
export function hoursCheckpoints(schedule: Pick<Schedule, 'startDate' | 'endDate'>, periods: WorkingHoursPeriod[]): string[] {
  return [...new Set([schedule.endDate, ...periods.flatMap(p => [p.endDate, shiftIsoDate(p.startDate, -1)])])]
    .filter(d => d >= schedule.startDate && d <= schedule.endDate).sort();
}

/**
 * Accrue exact daily targets from the earliest retained roster through this one.
 * Round cumulative endpoints, never separate roster pieces, so splitting dates
 * cannot lose hours. Gaps accrue target and approved leave still credits them.
 */
export function resolveNurseHoursBalance(
  nurse: Pick<Nurse, 'id' | 'contractPercent'>, schedule: HoursSchedule,
  duties: DutyWindow[] | Map<string, DutyWindow>, leaves: LeaveEntry[], types: LeaveType[] | Map<string, LeaveType>,
  periods: WorkingHoursPeriod[] = [], history?: HoursHistory, through = schedule.endDate
): NurseHoursBalance {
  const share = nurseContractShare(nurse);
  const standalone = Math.round(resolveFullTimeTarget({ ...schedule, endDate: through }, periods).hours * share);
  if (!history || hoursHistoryOverlaps(schedule, history).length) {
    return { trackingStartDate: schedule.startDate, baseTargetHours: standalone, carriedHours: 0, targetHours: standalone,
      cumulativeTargetHours: standalone, previousCreditedHours: 0, openingBalanceHours: 0 };
  }
  const schedules = [...history.schedules.filter(s => s.id !== schedule.id && s.startDate <= through), schedule]
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const trackingStartDate = schedules[0].startDate;
  const scheduleMap = new Map(schedules.map(s => [s.id, s]));
  const previousAssignments = history.assignments.filter(a => {
    const owner = scheduleMap.get(a.scheduleId);
    return owner && owner.id !== schedule.id && a.date >= owner.startDate && a.date <= owner.endDate && a.date < schedule.startDate;
  });
  const before = shiftIsoDate(schedule.startDate, -1);
  const previousCreditedHours = countHoursInRange(nurse.id, trackingStartDate, before, previousAssignments, duties, history.leaveEntries || leaves, types).totalHours;
  const rates = new Map(schedules.map(s => [s.id, periods.some(p => p.startDate <= s.endDate && p.endDate >= s.startDate)
    ? 0 : resolveFullTimeTarget(s, periods).hours / Math.max(1, inclusiveDays(s.startDate, s.endDate))]));
  let rawBefore = 0, rawCurrent = 0;
  for (const date of getDatesInRange(trackingStartDate, through)) {
    const period = periods.find(p => p.startDate <= date && p.endDate >= date);
    const roster = schedules.find(s => s.startDate <= date && s.endDate >= date);
    const rate = period ? getPeriodDailyRate(period) : roster ? rates.get(roster.id)! : 0;
    if (date < schedule.startDate) rawBefore += rate * share;
    else rawCurrent += rate * share;
  }
  const beforeTarget = Math.round(rawBefore + 1e-8);
  const cumulativeTargetHours = Math.round(rawBefore + rawCurrent + 1e-8);
  const baseTargetHours = cumulativeTargetHours - beforeTarget;
  const carriedHours = beforeTarget - previousCreditedHours;
  return { trackingStartDate, baseTargetHours, carriedHours,
    targetHours: Math.max(0, cumulativeTargetHours - previousCreditedHours), cumulativeTargetHours,
    previousCreditedHours, openingBalanceHours: -carriedHours };
}
