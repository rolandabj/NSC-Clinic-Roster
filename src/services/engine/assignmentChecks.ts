/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hard rule checks for a single cell, shared by every screen that moves
 * shifts by hand (fairness rebalancing, shift swaps), so they follow the same
 * rules as the scheduling engine:
 *   one duty per day (H4), approved leave, locks and approved days off (H5), PHL
 *   skill (H6), the Nurse Clinic option and blood collection for a Nurse Clinic
 *   cell, clinic nurse for doctor and specialty cells, max consecutive days (H2),
 *   minimum rest (H3, 0 = off), consecutive late duties (S1) and the most hours in
 *   any 7 days (H9). Put the end of the previous roster in `assignments` too, so
 *   the rules that look back see it. The nurse's list (H8) is checked apart, by
 *   listProblem, because a planner may agree to an exception.
 * Rules switched off or set to SOFT are not enforced here.
 */

import { Assignment, AvailabilityRequest, ClinicalRole, Doctor, DoctorSession, DutyWindow, LeaveEntry, LockEntry, Nurse, Rule, Specialty } from '../../types';
import { resolveRule, LATE_DUTY_RULE_WORDS } from './SchedulingEngine';
import { isExclusiveNurseClinic } from './nurseClinicUtils';
import { bloodCollectionRole, canBeFreeNurse, nurseClinicRoleOf } from './clinicModel';
import { outsideNurseList } from './nurseList';
import { heaviestWeekAround, WEEK_HOURS_RULE, weekHoursSetting } from './weekHours';
import { dutyDurationHours } from '../hours/hoursBalance';

export interface AssignmentCheckContext {
  /** The whole roster as it would be after the change. */
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  roles: ClinicalRole[];
  rules: Rule[];
  /** The nurses' requests: an approved day off is a day off even without its pin (as for the generator). */
  availabilityRequests?: AvailabilityRequest[];
  /** For the nurse's list (listProblem). */
  doctors?: Doctor[];
  specialties?: Specialty[];
  sessions?: DoctorSession[];
}

function shiftDate(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
}

function minutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

/** Hours between a duty ending on one day and the next duty starting the following day. */
function restHoursBetween(prevEnd: string, nextStart: string): number {
  return (24 * 60 - minutes(prevEnd) + minutes(nextStart)) / 60;
}

function hardRule(rules: Rule[], templateKey: string, id: string, keywords: string[], exclude: string[] = []) {
  const rule = resolveRule(rules, templateKey, id, keywords, exclude);
  const enabled = rule ? rule.enabled !== false : true;
  const isHard = (rule?.severity || 'HARD') === 'HARD';
  return { rule, enforced: enabled && isHard };
}

/**
 * Returns the reasons the cell breaks a hard rule (empty when it is allowed).
 * `cell` must already be part of ctx.assignments.
 */
export function checkAssignment(ctx: AssignmentCheckContext, cell: Assignment): string[] {
  const reasons: string[] = [];
  const nurse = ctx.nurses.find((n) => n.id === cell.nurseId);
  const name = nurse?.fullName || 'This nurse';
  const date = cell.date;
  const dutyMap = new Map(ctx.dutyWindows.map((d) => [d.id, d]));
  const duty = dutyMap.get(cell.dutyWindowId);

  const byNurseDate = new Map<string, Assignment[]>();
  for (const a of ctx.assignments) {
    if (a.nurseId !== cell.nurseId) continue;
    const list = byNurseDate.get(a.date) || [];
    list.push(a);
    byNurseDate.set(a.date, list);
  }

  // H4: one duty per day
  if ((byNurseDate.get(date) || []).some((a) => a.id !== cell.id)) {
    reasons.push(`${name} already has a duty on ${date}`);
  }

  // H5: approved leave and locks
  if (ctx.leaveEntries.some((le) => le.nurseId === cell.nurseId && le.approved && date >= le.startDate && date <= le.endDate)) {
    reasons.push(`${name} is on approved leave on ${date}`);
  }
  const lock = ctx.locks.find((l) => l.nurseId === cell.nurseId && l.date === date);
  if (lock?.mode === 'OFF') {
    reasons.push(`${name} has a day off lock on ${date}`);
  } else if (lock && !(cell.locked || cell.source === 'LOCK')) {
    reasons.push(`${name} has a pinned shift on ${date}`);
  }
  // An approved day off request is a day off even without its pin, as for the generator.
  if (
    lock?.mode !== 'OFF' &&
    (ctx.availabilityRequests || []).some((r) => r.nurseId === cell.nurseId && r.date === date && !r.available && r.status === 'APPROVED')
  ) {
    reasons.push(`${name} has an approved day off on ${date}`);
  }

  if (nurse) {
    // H6: phlebotomy cells need the PHL skill
    if (cell.kind === 'CLINICAL_ROLE' && cell.clinicalRoleId) {
      const role = ctx.roles.find((r) => r.id === cell.clinicalRoleId);
      if (role?.acronym === 'PHL' && !nurse.capabilityIds.includes(role.id)) {
        reasons.push(`${name} is not qualified for ${role.name}`);
      }
    }
    // Doctor and specialty cells need a clinic nurse who is not exclusive to the Nurse Clinic
    if ((cell.kind === 'DOCTOR' || cell.kind === 'SPECIALTY') && (!nurse.isClinicNurse || isExclusiveNurseClinic(nurse, ctx.roles))) {
      reasons.push(`${name} cannot be paired with doctor or specialty sessions`);
    }
    // A Nurse Clinic cell (as the roster check counts them) needs the Nurse Clinic option and blood collection
    const nc = nurseClinicRoleOf(ctx.roles);
    const phl = bloodCollectionRole(ctx.roles);
    const isNurseClinicCell =
      cell.kind === 'CLINICAL_ROLE' &&
      (cell.clinicalRoleId === nc?.id ||
        cell.clinicalRoleId === 'role-nurse-clinic' ||
        (!!phl && cell.clinicalRoleId === phl.id) ||
        !!cell.note?.toLowerCase().includes('nurse clinic'));
    if (isNurseClinicCell && !canBeFreeNurse(nurse, ctx.roles)) {
      reasons.push(`${name} cannot run Nurse Clinic (it needs the Nurse Clinic option and blood collection in the profile)`);
    }
  }

  // H2: maximum consecutive working days (counting the run this day belongs to)
  const h2 = hardRule(
    ctx.rules,
    'MAX_CONSECUTIVE_DAYS',
    'rule-h2',
    ['consecutive shifts', 'consecutive duties', 'consecutive working days', 'consecutive days'],
    LATE_DUTY_RULE_WORDS
  );
  if (h2.enforced) {
    const max = h2.rule?.value || 6;
    let run = 1;
    for (let i = 1; i <= 31 && byNurseDate.has(shiftDate(date, -i)); i++) run++;
    for (let i = 1; i <= 31 && byNurseDate.has(shiftDate(date, i)); i++) run++;
    if (run > max) reasons.push(`${name} would work ${run} days in a row (maximum ${max})`);
  }

  // H3: minimum rest before and after this duty (0 means no minimum, as for the generator)
  const h3 = hardRule(ctx.rules, 'MIN_REST_HOURS', 'rule-h3', ['rest between duties', 'minimum rest']);
  const minRest = h3.rule?.value ?? 11;
  if (h3.enforced && duty && minRest > 0) {
    const prevDuty = (byNurseDate.get(shiftDate(date, -1)) || [])
      .map((a) => dutyMap.get(a.dutyWindowId))
      .find(Boolean);
    if (prevDuty && restHoursBetween(prevDuty.endTime, duty.startTime) < minRest) {
      reasons.push(`${name} would have less than ${minRest}h rest after the previous day's duty`);
    }
    const nextDuty = (byNurseDate.get(shiftDate(date, 1)) || [])
      .map((a) => dutyMap.get(a.dutyWindowId))
      .find(Boolean);
    if (nextDuty && restHoursBetween(duty.endTime, nextDuty.startTime) < minRest) {
      reasons.push(`${name} would have less than ${minRest}h rest before the next day's duty`);
    }
  }

  // S1: consecutive late duties
  const s1 = hardRule(ctx.rules, 'MAX_CONSECUTIVE_LATE_DUTIES', 'rule-s1', [
    'consecutive late',
    'consecutive night',
    'ending at 21:00',
    'late duties',
  ]);
  const lateThreshold: string = (s1.rule?.params as any)?.thresholdTime || '21:00';
  if (s1.enforced && duty && duty.endTime >= lateThreshold) {
    const max = s1.rule?.value || 3;
    const isLate = (d: string) =>
      (byNurseDate.get(d) || []).some((a) => (dutyMap.get(a.dutyWindowId)?.endTime || '') >= lateThreshold);
    let run = 1;
    for (let i = 1; i <= 31 && isLate(shiftDate(date, -i)); i++) run++;
    for (let i = 1; i <= 31 && isLate(shiftDate(date, i)); i++) run++;
    if (run > max) reasons.push(`${name} would have ${run} late duties in a row (maximum ${max})`);
  }

  // H9: most hours in any 7 days in a row that include this day (shift hours, none on leave days)
  const h9 = weekHoursSetting(resolveRule(ctx.rules, WEEK_HOURS_RULE.key, WEEK_HOURS_RULE.id, WEEK_HOURS_RULE.keywords));
  if (h9.enabled && h9.hard) {
    const ownLeave = ctx.leaveEntries.filter((le) => le.nurseId === cell.nurseId && le.approved);
    const hoursOn = (d: string) => {
      const shift = d === date ? cell : (byNurseDate.get(d) || [])[0];
      if (!shift || ownLeave.some((le) => d >= le.startDate && d <= le.endDate)) return 0;
      return dutyDurationHours(dutyMap.get(shift.dutyWindowId));
    };
    const week = heaviestWeekAround(date, hoursOn);
    if (week.hours > h9.limit + 1e-6) {
      reasons.push(`${name} would work ${Math.round(week.hours * 10) / 10}h in 7 days (maximum ${h9.limit}h)`);
    }
  }

  return reasons;
}

/**
 * The nurse's list (H8) for a doctor or specialty cell: the reason when the cell is
 * outside it (null when it fits, or the doctors and specialties are not given).
 * Kept apart from checkAssignment: a planner may swap it in as an agreed exception.
 */
export function listProblem(ctx: AssignmentCheckContext, cell: Assignment): string | null {
  const nurse = ctx.nurses.find((n) => n.id === cell.nurseId);
  if (!nurse || !ctx.doctors || !ctx.specialties) return null;
  const outside = outsideNurseList(nurse, cell, { doctors: ctx.doctors, specialties: ctx.specialties, sessions: ctx.sessions || [] });
  if (!outside) return null;
  return outside.kind === 'DOCTOR'
    ? `${outside.name} isn't in ${nurse.fullName}'s list`
    : `${outside.name} isn't one of ${nurse.fullName}'s specialties`;
}
