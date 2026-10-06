import { Assignment, DutyWindow, LeaveEntry, LeaveType, Nurse, Schedule, WorkingHoursPeriod } from '../../types';
import { inclusiveDays, leaveCreditOnDate, resolveFullTimeTarget } from './hoursPolicy';
import { getDatesInRange, getPeriodDailyRate } from '../periods/workingHoursPeriodService';
import { findScheduleOverlaps, ScheduleOverlap } from '../schedule/scheduleRanges';

type HoursSchedule = Pick<Schedule, 'id' | 'startDate' | 'endDate' | 'hoursTargetFullTime' | 'periodName'> & Partial<Pick<Schedule, 'name'>>;

/**
 * The earlier rosters an hours balance can carry from. `assignments` hold the
 * shifts each counted roster was last published with (see loadHoursHistory),
 * never draft edits. `countedScheduleIds` names those rosters; without it,
 * rosters marked PUBLISHED count.
 */
export interface HoursHistory {
  schedules: Schedule[];
  assignments: Assignment[];
  leaveEntries?: LeaveEntry[];
  countedScheduleIds?: string[];
  /** Per roster: each nurse's contract percent when it was published (older versions have none). */
  contractPercents?: Record<string, Record<string, number>>;
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

/** Rosters (not archived) whose dates overlap this one: until resolved, no balance is carried. */
export function hoursHistoryOverlaps(schedule: HoursSchedule, history?: HoursHistory): ScheduleOverlap[] {
  if (!history) return [];
  const self = { ...schedule, name: schedule.name || schedule.id };
  return findScheduleOverlaps([...history.schedules.filter(s => s.id !== schedule.id), self])
    .filter(o => o.first.id === schedule.id || o.second.id === schedule.id);
}

/** The dedicated period a roster's balance runs in: the one holding its first day. */
export function trackingPeriod(schedule: Pick<Schedule, 'startDate'>, periods: WorkingHoursPeriod[] = []): WorkingHoursPeriod | undefined {
  return periods.find(p => p.startDate <= schedule.startDate && p.endDate >= schedule.startDate);
}

/** The earlier rosters that count toward this roster's balance (published, same period, before it). */
export function countedEarlierRosters(schedule: Pick<Schedule, 'id' | 'startDate'>, periods: WorkingHoursPeriod[], schedules: Schedule[], countedIds?: string[]): Schedule[] {
  const period = trackingPeriod(schedule, periods);
  if (!period) return [];
  const ids = countedIds ? new Set(countedIds) : undefined;
  return schedules.filter(s => s.id !== schedule.id && s.status !== 'ARCHIVED' && (ids ? ids.has(s.id) : s.status === 'PUBLISHED')
    && !!s.startDate && !!s.endDate && s.startDate < schedule.startDate && s.endDate >= period.startDate);
}

/** Check at every configured period boundary, including gaps between periods. */
export function hoursCheckpoints(schedule: Pick<Schedule, 'startDate' | 'endDate'>, periods: WorkingHoursPeriod[]): string[] {
  return [...new Set([schedule.endDate, ...periods.flatMap(p => [p.endDate, shiftIsoDate(p.startDate, -1)])])]
    .filter(d => d >= schedule.startDate && d <= schedule.endDate).sort();
}

/**
 * A nurse's goal for this roster, with what earlier rosters of the same
 * dedicated period left over.
 * - The base goal is each day's period rate (or, for a roster no period covers,
 *   its own target spread over its days) times her contract, summed and rounded
 *   once, so splitting a period into rosters loses no hours.
 * - Earlier days count only when an earlier roster of the same period was
 *   published for them and she was on it (a shift or leave there), so a nurse
 *   who joined later, or dates without a published roster, carry nothing.
 * - A day of approved leave that does not count toward the target adds neither
 *   a goal nor hours.
 * - Earlier days use the contract the nurse had when that roster was published
 *   (today's contract for versions published before this was recorded).
 * Nothing is carried from before the period, or while this roster overlaps another.
 */
export function resolveNurseHoursBalance(
  nurse: Pick<Nurse, 'id' | 'contractPercent'>, schedule: HoursSchedule,
  duties: DutyWindow[] | Map<string, DutyWindow>, leaves: LeaveEntry[], types: LeaveType[] | Map<string, LeaveType>,
  periods: WorkingHoursPeriod[] = [], history?: HoursHistory, through = schedule.endDate
): NurseHoursBalance {
  const share = nurseContractShare(nurse);
  const typeMap = types instanceof Map ? types : new Map(types.map(t => [t.id, t]));
  const touchesPeriod = periods.some(p => p.startDate <= schedule.endDate && p.endDate >= schedule.startDate);
  const ownRate = touchesPeriod ? 0 : resolveFullTimeTarget(schedule, periods).hours / Math.max(1, inclusiveDays(schedule.startDate, schedule.endDate));
  const rateOn = (date: string) => {
    const period = periods.find(p => p.startDate <= date && p.endDate >= date);
    return period ? getPeriodDailyRate(period) : ownRate;
  };
  let rawCurrent = 0;
  for (const date of getDatesInRange(schedule.startDate, through)) rawCurrent += rateOn(date) * share;

  let rawBefore = 0, previousCreditedHours = 0;
  let trackingStartDate = schedule.startDate;
  const earlier = history && !hoursHistoryOverlaps(schedule, history).length
    ? countedEarlierRosters(schedule, periods, history.schedules, history.countedScheduleIds) : [];
  if (earlier.length) {
    const period = trackingPeriod(schedule, periods)!;
    const before = shiftIsoDate(schedule.startDate, -1);
    const dutyMap = duties instanceof Map ? duties : new Map(duties.map(d => [d.id, d]));
    const approved = (history!.leaveEntries || leaves).filter(l => l.nurseId === nurse.id && l.approved);
    const leaveOn = (date: string) => approved.find(l => l.startDate <= date && l.endDate >= date);
    const ids = new Set(earlier.map(s => s.id));
    const shifts = new Map<string, Assignment>(); // roster id + date
    for (const a of history!.assignments) {
      if (a.nurseId === nurse.id && ids.has(a.scheduleId) && !shifts.has(`${a.scheduleId}_${a.date}`)) shifts.set(`${a.scheduleId}_${a.date}`, a);
    }
    // The latest starting roster speaks for a day (old rosters may still overlap).
    const ordered = [...earlier].sort((a, b) => b.startDate.localeCompare(a.startDate) || a.id.localeCompare(b.id));
    const onRoster = new Set(ordered.filter(r => getDatesInRange(r.startDate > period.startDate ? r.startDate : period.startDate, r.endDate < before ? r.endDate : before)
      .some(d => shifts.has(`${r.id}_${d}`) || leaveOn(d))).map(r => r.id));
    for (const date of getDatesInRange(period.startDate, before)) {
      const roster = ordered.find(r => r.startDate <= date && r.endDate >= date);
      if (!roster || !onRoster.has(roster.id)) continue;
      if (trackingStartDate > date) trackingStartDate = date;
      const leave = leaveOn(date);
      if (leave && typeMap.get(leave.leaveTypeId)?.countsTowardHoursTarget === false) continue;
      // Each earlier day keeps the contract the nurse had when that roster was published.
      const recorded = history!.contractPercents?.[roster.id]?.[nurse.id];
      const dayShare = typeof recorded === 'number' && Number.isFinite(recorded) && recorded >= 0 ? recorded / 100 : share;
      rawBefore += getPeriodDailyRate(period) * dayShare;
      previousCreditedHours += leave ? leaveCreditOnDate(leave, typeMap.get(leave.leaveTypeId), date)
        : shifts.has(`${roster.id}_${date}`) ? dutyDurationHours(dutyMap.get(shifts.get(`${roster.id}_${date}`)!.dutyWindowId)) : 0;
    }
  }
  previousCreditedHours = Math.round(previousCreditedHours * 10) / 10;
  const beforeTarget = Math.round(rawBefore + 1e-8);
  const cumulativeTargetHours = Math.round(rawBefore + rawCurrent + 1e-8);
  const baseTargetHours = cumulativeTargetHours - beforeTarget;
  const carriedHours = Math.round((beforeTarget - previousCreditedHours) * 10) / 10;
  return { trackingStartDate, baseTargetHours, carriedHours,
    targetHours: Math.max(0, Math.round((cumulativeTargetHours - previousCreditedHours) * 10) / 10), cumulativeTargetHours,
    previousCreditedHours, openingBalanceHours: -carriedHours };
}
