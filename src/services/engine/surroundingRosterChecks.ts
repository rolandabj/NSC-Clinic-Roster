import type { Assignment, DutyWindow, LeaveEntry, Nurse, Rule, Schedule } from '../../types';
import type { ValidationFinding } from '../validation/ScheduleValidator';
import { calculateDutyDurationHours } from '../reports/hoursAccounting';
import { formatDate } from '../../utils/dateUtils';
import { type ClinicSetup, resolveClinicSetup, toMinutes } from './clinicModel';
import { LATE_DUTY_RULE_WORDS, resolveRule } from './SchedulingEngine';
import { WEEK_HOURS_RULE, weekHoursSetting, weeksOverLimit } from './weekHours';

function shiftDate(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Check the fixed next roster without adding its shifts to this roster's hours or output. */
export function followingRosterFindings(schedule: Schedule, assignments: Assignment[], nurses: Nurse[],
  duties: DutyWindow[], leave: LeaveEntry[], rules: Rule[], clinicSetup?: ClinicSetup): ValidationFinding[] {
  const clinic = resolveClinicSetup(clinicSetup);
  const following = clinic.followingAssignments.filter(a => a.date > schedule.endDate);
  if (!following.length) return [];
  const findings: ValidationFinding[] = [];
  const dutyMap = new Map(duties.map(d => [d.id, d]));
  const h2 = resolveRule(rules, 'MAX_CONSECUTIVE_DAYS', 'rule-h2',
    ['consecutive shifts', 'consecutive duties', 'consecutive working days', 'consecutive days'], LATE_DUTY_RULE_WORDS);
  const h3 = resolveRule(rules, 'MIN_REST_HOURS', 'rule-h3', ['rest between duties', 'minimum rest']);
  const s1 = resolveRule(rules, 'MAX_CONSECUTIVE_LATE_DUTIES', 'rule-s1', LATE_DUTY_RULE_WORDS);
  const week = weekHoursSetting(resolveRule(rules, WEEK_HOURS_RULE.key, WEEK_HOURS_RULE.id, WEEK_HOURS_RULE.keywords));
  const end = schedule.endDate;
  for (const nurse of nurses) {
    if (!following.some(a => a.nurseId === nurse.id)) continue;
    const own = assignments.filter(a => a.nurseId === nurse.id && a.date >= schedule.startDate && a.date <= end);
    if (!own.length) continue;
    const byDate = new Map([...clinic.priorAssignments.filter(a => a.date < schedule.startDate), ...following, ...own]
      .filter(a => a.nurseId === nurse.id).map(a => [a.date, a]));
    const ownRefs = (start: string, stop: string) => own.filter(a => a.date >= start && a.date <= stop)
      .map(a => ({ nurseId: nurse.id, date: a.date }));
    const add = (id: string, rule: Rule | undefined, message: string, start = end, amount?: number) => findings.push({
      id, category: 'RULE_VIOLATION', severity: rule?.severity === 'SOFT' ? 'WARN' : 'ERROR',
      message, affectedNurseIds: [nurse.id], cellRefs: ownRefs(start, end), date: end, ...(amount === undefined ? {} : { amount }),
    });
    const last = byDate.get(end), next = byDate.get(shiftDate(end, 1));
    const lastDuty = last && dutyMap.get(last.dutyWindowId), nextDuty = next && dutyMap.get(next.dutyWindowId);
    const rest = h3?.value ?? 11;
    if (h3?.enabled !== false && rest > 0 && lastDuty && nextDuty) {
      const actual = (24 * 60 - toMinutes(lastDuty.endTime) + toMinutes(nextDuty.startTime)) / 60;
      if (actual < rest) add(`h3-rest-next-${nurse.id}-${end}`, h3,
        `${nurse.fullName}: only ${actual} h rest (needs ${rest} h) between ${formatDate(end)} and ${formatDate(next!.date)} in the next roster.`);
    }
    const runAcrossEnd = (matches: (a: Assignment) => boolean) => {
      let before = 0, after = 0;
      for (let i = 0; i <= 31; i++) {
        const a = byDate.get(shiftDate(end, -i));
        if (!a || !matches(a)) break;
        before++;
      }
      if (before) for (let i = 1; i <= 31; i++) {
        const a = byDate.get(shiftDate(end, i));
        if (!a || !matches(a)) break;
        after++;
      }
      return { before, after, start: shiftDate(end, 1 - before) };
    };
    const days = runAcrossEnd(() => true), maxDays = h2?.value || 6;
    if (h2?.enabled !== false && days.after && days.before <= maxDays && days.before + days.after > maxDays) {
      add(`h2-days-next-${nurse.id}-${end}`, h2,
        `${nurse.fullName}: ${days.before + days.after} shifts in a row across this roster and the next (most allowed: ${maxDays}), starting ${formatDate(days.start)}.`, days.start);
    }
    const threshold = String(s1?.params?.thresholdTime || '21:00');
    const lates = runAcrossEnd(a => (dutyMap.get(a.dutyWindowId)?.endTime || '') >= threshold), maxLate = s1?.value || 3;
    if (s1?.enabled !== false && lates.after && lates.before <= maxLate && lates.before + lates.after > maxLate) {
      add(`s1-late-next-${nurse.id}-${end}`, s1,
        `${nurse.fullName}: ${lates.before + lates.after} late shifts in a row across this roster and the next (most allowed: ${maxLate}), starting ${formatDate(lates.start)}.`, lates.start);
    }
    if (week.enabled) {
      const hoursOn = (date: string) => {
        const a = byDate.get(date);
        return !a || leave.some(le => le.nurseId === nurse.id && le.approved && le.startDate <= date && le.endDate >= date)
          ? 0 : calculateDutyDurationHours(dutyMap.get(a.dutyWindowId));
      };
      const worked = own.filter(a => hoursOn(a.date) > 0).map(a => a.date).sort();
      if (!worked.length) continue;
      // All stretches are recomputed together so a busy run crossing the boundary has one finding.
      for (const stretch of weeksOverLimit(schedule.startDate, shiftDate(worked[worked.length - 1], 6), hoursOn, week.limit)) {
        const refs = ownRefs(stretch.start, stretch.end);
        if (!refs.length) continue;
        findings.push({ id: `h9-week-hours-${nurse.id}-${stretch.start}-${stretch.end}`, category: 'RULE_VIOLATION',
          severity: week.hard ? 'ERROR' : 'WARN',
          message: `${nurse.fullName}: ${Math.round(stretch.hours * 10) / 10} h in 7 days, ${formatDate(stretch.start)} to ${formatDate(stretch.end)} (most allowed: ${week.limit} h).`,
          affectedNurseIds: [nurse.id], cellRefs: refs, date: refs[refs.length - 1].date, amount: stretch.hours,
        });
      }
    }
  }
  return findings;
}

/** Replace the earlier part of a rolling hours run with the complete cross roster check. */
export function mergeFollowingRosterFindings(existing: ValidationFinding[], following: ValidationFinding[]): ValidationFinding[] {
  const hoursNurses = new Set(following.filter(f => f.id.startsWith('h9-week-hours-')).flatMap(f => f.affectedNurseIds));
  return [...existing.filter(f => !f.id.startsWith('h9-week-hours-') || !f.affectedNurseIds.some(id => hoursNurses.has(id))), ...following];
}
