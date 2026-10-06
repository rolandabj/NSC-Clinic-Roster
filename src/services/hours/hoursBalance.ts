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

/** One dedicated period's share of a roster (a roster that crosses a period end has two or more). */
export interface HoursPart {
  periodId?: string;
  name: string;
  /** The part's dates inside this roster. */
  startDate: string;
  endDate: string;
  /** The nurse's share of the period for these dates. */
  baseHours: number;
  /** Carried into this part: positive = owed from before, negative = ahead (may exceed the part, see targetHours). */
  carriedHours: number;
  /** Hours to credit in this part (never negative). */
  targetHours: number;
}

export interface NurseHoursBalance {
  trackingStartDate: string;
  /** Each period's part of this roster, in date order (one part for most rosters). */
  parts: HoursPart[];
  /** Hours that could not be made up after being carried twice, dropped when the last period closed. */
  writtenOffHours: number;
  /** Hours owed but held back to a later period so no period asks for more than MAX_CATCH_UP_SHARE extra. */
  deferredHours: number;
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

/** A leftover may be carried into this many later periods, then it is written off. */
export const MAX_CARRY_PERIODS = 2;
/** Catching up never asks a nurse for more than this share of her period hours on top (overwork guard). */
export const MAX_CATCH_UP_SHARE = 0.1;
const sortPeriods = (periods: WorkingHoursPeriod[]) => [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate));

/**
 * The earlier rosters that count toward a roster's balance: every roster that
 * starts before it, is not archived and was published (with countedIds: the
 * rosters a loaded history read as published). The whole published history is
 * read, not a window: how an old leftover was settled changes what is left
 * later. Without dedicated periods nothing is carried.
 */
export function countedEarlierRosters(schedule: Pick<Schedule, 'id' | 'startDate'>, periods: WorkingHoursPeriod[], schedules: Schedule[], countedIds?: string[]): Schedule[] {
  if (!periods.length) return [];
  const ids = countedIds ? new Set(countedIds) : undefined;
  return schedules.filter(s => s.id !== schedule.id && s.status !== 'ARCHIVED' && (ids ? ids.has(s.id) : s.status === 'PUBLISHED')
    && !!s.startDate && !!s.endDate && s.startDate < schedule.startDate);
}

/** Check at every configured period boundary, including gaps between periods. */
export function hoursCheckpoints(schedule: Pick<Schedule, 'startDate' | 'endDate'>, periods: WorkingHoursPeriod[]): string[] {
  return [...new Set([schedule.endDate, ...periods.flatMap(p => [p.endDate, shiftIsoDate(p.startDate, -1)])])]
    .filter(d => d >= schedule.startDate && d <= schedule.endDate).sort();
}

/**
 * A leftover on its way through later periods: positive = hours owed, negative
 * = hours ahead. The leftovers of a nurse always share one sign: owed hours are
 * only settled by extra work, and a new leftover of the other sign appears only
 * once all of them are settled (see closePeriod).
 */
interface Leftover { hours: number; carried: number }

/** What a period asks on top of its base: ahead hours in full, owed hours up to the catch up limit. */
function activeCarry(list: Leftover[], periodShareHours: number): { carry: number; deferred: number } {
  const owed = list.filter(l => l.hours > 0).reduce((s, l) => s + l.hours, 0);
  const ahead = list.filter(l => l.hours < 0).reduce((s, l) => s + l.hours, 0);
  const cap = Math.max(0, periodShareHours * MAX_CATCH_UP_SHARE);
  return { carry: Math.min(owed, cap) + ahead, deferred: Math.max(0, owed - cap) };
}

/**
 * Closes a period: hours worked beyond (or short of) its base first settle the
 * oldest leftovers, what remains becomes a new leftover, and every leftover
 * moves on one period. One carried MAX_CARRY_PERIODS times is written off.
 */
function closePeriod(list: Leftover[], base: number, worked: number): { next: Leftover[]; writtenOff: number } {
  let extra = worked - base; // > 0 made up owed hours, < 0 used up hours ahead
  const settled = [...list].sort((a, b) => b.carried - a.carried).map(l => ({ ...l }));
  for (const l of settled) {
    if (l.hours > 0 && extra > 0) { const f = Math.min(l.hours, extra); l.hours -= f; extra -= f; }
    else if (l.hours < 0 && extra < 0) { const f = Math.min(-l.hours, -extra); l.hours += f; extra += f; }
  }
  const moved = settled.filter(l => Math.abs(l.hours) > 1e-9).map(l => ({ hours: l.hours, carried: l.carried + 1 }));
  if (Math.abs(extra) > 1e-9) moved.push({ hours: -extra, carried: 1 });
  const kept = moved.filter(l => l.carried <= MAX_CARRY_PERIODS);
  const writtenOff = moved.filter(l => l.carried > MAX_CARRY_PERIODS).reduce((s, l) => s + l.hours, 0);
  return { next: kept, writtenOff };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

interface PeriodTotals { base: number; worked: number; firstDate: string }

/** Earlier totals per history (memo): the screens ask for the same nurse many times while it is loaded. */
const totalsMemo = new WeakMap<HoursHistory, Map<string, { inputs: unknown[]; totals: Map<string, PeriodTotals> }>>();

/**
 * One nurse's earlier days, per dedicated period: the base she accrued (her
 * share of each day she was rostered) and the hours credited (one shift or
 * one approved leave a day), from the rosters as they were published.
 * - The latest starting roster speaks for a day (old rosters may still overlap).
 * - She counts on a roster only with at least one shift on it: approved leave
 *   alone (a bulk public holiday, for instance) does not put her on it.
 * - On her first roster after the earliest one in the history she counts from
 *   her first shift, so days before she joined add nothing.
 * - Days outside every period, and approved leave that does not count toward
 *   the target, add neither a goal nor hours.
 */
function earlierPeriodTotals(
  nurseId: string, share: number, schedule: HoursSchedule, earlier: Schedule[], history: HoursHistory,
  leaves: LeaveEntry[], typeMap: Map<string, LeaveType>, dutyMap: Map<string, DutyWindow>, ordered: WorkingHoursPeriod[]
): Map<string, PeriodTotals> {
  const leaveList = history.leaveEntries || leaves;
  const inputs: unknown[] = [leaveList, typeMap.size, dutyMap.size, ordered.map(p => `${p.id}:${p.startDate}:${p.endDate}:${p.workingHours}`).join('|'),
    [...dutyMap.values()].map(d => `${d.id}:${d.startTime}:${d.endTime}`).join('|'),
    [...typeMap.values()].map(t => `${t.id}:${t.creditedHours}:${t.countsTowardHoursTarget}`).join('|')];
  const key = `${nurseId}|${share}|${schedule.id}|${schedule.startDate}`;
  let memo = totalsMemo.get(history);
  if (!memo) { memo = new Map(); totalsMemo.set(history, memo); }
  const hit = memo.get(key);
  if (hit && hit.inputs.length === inputs.length && hit.inputs.every((v, i) => v === inputs[i])) return hit.totals;

  const before = shiftIsoDate(schedule.startDate, -1);
  const approved = leaveList.filter(l => l.nurseId === nurseId && l.approved);
  const leaveOn = (date: string) => approved.find(l => l.startDate <= date && l.endDate >= date);
  const ids = new Set(earlier.map(s => s.id));
  const shifts = new Map<string, Assignment>(); // roster id + date
  const firstShift = new Map<string, string>(); // roster id -> her first shift date on it
  for (const a of history.assignments) {
    if (a.nurseId !== nurseId || !ids.has(a.scheduleId)) continue;
    const roster = earlier.find(r => r.id === a.scheduleId)!;
    if (a.date < roster.startDate || a.date > roster.endDate || a.date > before) continue;
    const k = `${a.scheduleId}_${a.date}`;
    if (!shifts.has(k)) shifts.set(k, a);
    if (!firstShift.has(a.scheduleId) || a.date < firstShift.get(a.scheduleId)!) firstShift.set(a.scheduleId, a.date);
  }
  const byStart = [...earlier].sort((a, b) => a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id));
  const earliestStart = byStart[0]?.startDate;
  const herFirst = byStart.find(r => firstShift.has(r.id));
  // From which day each roster counts for her (undefined: not on it).
  const countsFrom = (r: Schedule): string | undefined => {
    const first = firstShift.get(r.id);
    if (!first) return undefined;
    return r.id === herFirst?.id && r.startDate > earliestStart! ? first : r.startDate;
  };
  const totals = new Map<string, PeriodTotals>();
  const claimed = new Set<string>();
  for (const roster of [...byStart].reverse()) { // latest start first
    const from = countsFrom(roster);
    const last = roster.endDate < before ? roster.endDate : before;
    for (const date of getDatesInRange(roster.startDate, last)) {
      if (claimed.has(date)) continue;
      claimed.add(date);
      if (!from || date < from) continue;
      const period = ordered.find(p => p.startDate <= date && p.endDate >= date);
      if (!period) continue;
      const leave = leaveOn(date);
      if (leave && typeMap.get(leave.leaveTypeId)?.countsTowardHoursTarget === false) continue;
      const recorded = history.contractPercents?.[roster.id]?.[nurseId];
      const dayShare = typeof recorded === 'number' && Number.isFinite(recorded) && recorded >= 0 ? recorded / 100 : share;
      const entry = totals.get(period.id) || { base: 0, worked: 0, firstDate: date };
      entry.base += getPeriodDailyRate(period) * dayShare;
      entry.worked += leave ? leaveCreditOnDate(leave, typeMap.get(leave.leaveTypeId), date)
        : shifts.has(`${roster.id}_${date}`) ? dutyDurationHours(dutyMap.get(shifts.get(`${roster.id}_${date}`)!.dutyWindowId)) : 0;
      if (date < entry.firstDate) entry.firstDate = date;
      totals.set(period.id, entry);
    }
  }
  memo.set(key, { inputs, totals });
  return totals;
}

/**
 * A nurse's goal for this roster, period by period.
 * - Each dedicated period is balanced on its own: a roster that crosses a
 *   period end has one part per period, each with its own goal.
 * - A part's base is each day's period rate (or, for a roster no period
 *   touches, its own target spread over its days) times her contract.
 *   Rounding happens on the period's running total, so splitting a period
 *   into rosters loses no hours.
 * - What a period leaves over (short or ahead) is carried into the next
 *   period, at most MAX_CARRY_PERIODS times, then written off. Carried owed
 *   hours never ask more than MAX_CATCH_UP_SHARE of the period on top; the
 *   rest waits for the next period (it still counts as carried).
 * - Earlier days count only when a roster was published for them and the
 *   nurse was on it (see earlierPeriodTotals), so a nurse who joined later,
 *   or dates without a published roster, carry nothing. A period with no such
 *   days for her neither settles nor ages her leftovers.
 * - A day of approved leave that does not count toward the target adds
 *   neither a goal nor hours. Earlier days use the contract saved with that
 *   published version (today's contract for older versions).
 * - Inside this roster, a later part assumes the earlier part reaches its
 *   goal (the checker reports it when it does not).
 * Nothing is carried while this roster overlaps another.
 */
export function resolveNurseHoursBalance(
  nurse: Pick<Nurse, 'id' | 'contractPercent'>, schedule: HoursSchedule,
  duties: DutyWindow[] | Map<string, DutyWindow>, leaves: LeaveEntry[], types: LeaveType[] | Map<string, LeaveType>,
  periods: WorkingHoursPeriod[] = [], history?: HoursHistory, through = schedule.endDate
): NurseHoursBalance {
  const share = nurseContractShare(nurse);
  const typeMap = types instanceof Map ? types : new Map(types.map(t => [t.id, t]));
  const dutyMap = duties instanceof Map ? duties : new Map(duties.map(d => [d.id, d]));
  const ordered = sortPeriods(periods);
  const touchesPeriod = ordered.some(p => p.startDate <= schedule.endDate && p.endDate >= schedule.startDate);
  const ownRate = touchesPeriod ? 0 : resolveFullTimeTarget(schedule, periods).hours / Math.max(1, inclusiveDays(schedule.startDate, schedule.endDate));

  // Earlier days, per period: the base she accrued and the hours credited.
  const earlier = history && !hoursHistoryOverlaps(schedule, history).length
    ? countedEarlierRosters(schedule, periods, history.schedules, history.countedScheduleIds) : [];
  const earlierByPeriod = earlier.length
    ? earlierPeriodTotals(nurse.id, share, schedule, earlier, history!, leaves, typeMap, dutyMap, ordered)
    : new Map<string, PeriodTotals>();

  // Close the periods that ended before this roster, oldest first.
  let leftovers: Leftover[] = [];
  let writtenOffHours = 0;
  for (const period of ordered.filter(p => p.endDate < schedule.startDate)) {
    const entry = earlierByPeriod.get(period.id);
    if (!entry || entry.base <= 0) continue; // she was on no published roster in it
    const closed = closePeriod(leftovers, entry.base, entry.worked);
    leftovers = closed.next;
    writtenOffHours = closed.writtenOff; // only the last closing matters for this roster
  }

  // This roster's parts: one per period it touches (or one for a roster no period touches).
  const end = through < schedule.endDate ? through : schedule.endDate;
  const parts: HoursPart[] = [];
  let previousCreditedHours = 0, deferredHours = 0;
  const partPeriods = touchesPeriod ? ordered.filter(p => p.startDate <= end && p.endDate >= schedule.startDate) : [];
  if (!touchesPeriod) {
    const raw = getDatesInRange(schedule.startDate, end).length * ownRate * share;
    parts.push({ name: schedule.name || 'This roster', startDate: schedule.startDate, endDate: end,
      baseHours: Math.round(raw + 1e-8), carriedHours: 0, targetHours: Math.round(raw + 1e-8) });
  }
  let trackingStartDate = schedule.startDate;
  partPeriods.forEach((period, index) => {
    const partStart = period.startDate > schedule.startDate ? period.startDate : schedule.startDate;
    const partEnd = period.endDate < end ? period.endDate : end;
    const rawPart = getDatesInRange(partStart, partEnd).length * getPeriodDailyRate(period) * share;
    const prior = (index === 0 && earlierByPeriod.get(period.id)) || { base: 0, worked: 0 };
    const periodShare = period.workingHours * share;
    const { carry, deferred } = activeCarry(leftovers, periodShare);
    // Rounded on the period's running total: earlier rosters of the period took round(prior.base).
    const priorBase = Math.round(prior.base + 1e-8);
    const baseHours = Math.round(prior.base + rawPart + 1e-8) - priorBase;
    const owedBefore = priorBase - prior.worked; // this period's own leftover from its earlier rosters
    const carriedHours = round1(owedBefore + carry);
    const targetHours = Math.max(0, round1(baseHours + carriedHours));
    parts.push({ periodId: period.id, name: period.name, startDate: partStart, endDate: partEnd, baseHours, carriedHours, targetHours });
    if (index === 0) {
      previousCreditedHours = round1(prior.worked);
      const first = earlierByPeriod.get(period.id)?.firstDate;
      if (first && first < trackingStartDate) trackingStartDate = first;
    }
    if (index === partPeriods.length - 1) deferredHours = round1(deferred);
    // The next part assumes this one reaches its goal: what stays open is only what was held back.
    if (index < partPeriods.length - 1) {
      const closed = closePeriod(leftovers, prior.base + rawPart, prior.worked + targetHours);
      leftovers = closed.next;
    }
  });

  const baseTargetHours = parts.reduce((s, p) => s + p.baseHours, 0);
  const targetHours = round1(parts.reduce((s, p) => s + p.targetHours, 0));
  const carriedHours = round1(parts.reduce((s, p) => s + p.carriedHours, 0));
  return { trackingStartDate, parts, writtenOffHours: round1(writtenOffHours), deferredHours,
    baseTargetHours, carriedHours, targetHours, cumulativeTargetHours: round1(previousCreditedHours + baseTargetHours + carriedHours),
    previousCreditedHours, openingBalanceHours: -carriedHours };
}
