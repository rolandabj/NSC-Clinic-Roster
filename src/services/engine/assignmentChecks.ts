/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hard rule checks for a single cell, shared by every screen that moves
 * shifts by hand (fairness rebalancing, shift swaps), so they follow the same
 * rules as the scheduling engine:
 *   one duty per day (H4), approved leave and locks (H5), PHL skill (H6),
 *   clinic nurse for doctor and specialty cells, max consecutive days (H2),
 *   minimum rest (H3) and consecutive late duties (S1).
 * Rules switched off or set to SOFT are not enforced here.
 */

import { Assignment, ClinicalRole, DutyWindow, LeaveEntry, LockEntry, Nurse, Rule } from '../../types';
import { resolveRule, LATE_DUTY_RULE_WORDS } from './SchedulingEngine';
import { isExclusiveNurseClinic } from './nurseClinicUtils';

export interface AssignmentCheckContext {
  /** The whole roster as it would be after the change. */
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  roles: ClinicalRole[];
  rules: Rule[];
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

  // H3: minimum rest before and after this duty
  const h3 = hardRule(ctx.rules, 'MIN_REST_HOURS', 'rule-h3', ['rest between duties', 'minimum rest']);
  if (h3.enforced && duty) {
    const minRest = h3.rule?.value || 11;
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

  return reasons;
}
