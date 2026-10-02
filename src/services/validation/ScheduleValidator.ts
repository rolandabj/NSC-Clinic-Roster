/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Schedule Validation Service (Phase 8 — Complete Implementation)
 * Audits every cell update, generation pass, and manual edit.
 * 
 * Finding Categories:
 * 1. COVERAGE_GAP: An opening hour with no free nurse (not with a doctor, qualified for blood
 *    collection), evening tail deficits e.g. 19:00. The clinic rules are in engine/clinicModel.ts.
 * 2. STAFFING_SCALE: Pre-flight ratio warnings (e.g. 7 nurses vs 9 doctors, evening departure tails).
 * 3. RULE_VIOLATION: H1 (Senior on duty), H2 (Consecutive days <= 6), H3 (11h rest), H6 (Phlebotomy capability & quota), S1 (Consecutive late ends >= 21:00).
 * 4. HOURS_IMBALANCE: Nurse pacing < 75% or > 105%.
 * 5. DATA_ISSUE: Missing Gmail, unassigned doctor sessions, duplicate duties on same day, leave overlapping assignments.
 */

import { summarizeNurseHours } from '../reports/hoursAccounting';
import {
  Schedule,
  Assignment,
  LeaveEntry,
  LeaveType,
  LockEntry,
  DoctorSession,
  Nurse,
  DutyWindow,
  SeniorityLevel,
  ClinicalRole,
  Rule,
  WorkingHoursPeriod,
  Specialty,
  Doctor,
} from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { isExclusiveNurseClinic } from '../engine/nurseClinicUtils';
import { resolveFullTimeTarget, leaveCreditInRange } from '../hours/hoursPolicy';
import { calculateDutyDurationHours } from '../reports/hoursAccounting';
import { resolveRule, LATE_DUTY_RULE_WORDS } from '../engine/SchedulingEngine';
import {
  ClinicSetup,
  bloodCollectionRole,
  canBeFreeNurse,
  isFreeDuring,
  openingHourSlots,
  overlaps,
  resolveClinicSetup,
  uncoveredParts,
  doctorSessionsOn,
} from '../engine/clinicModel';

export type FindingSeverity = 'ERROR' | 'WARN' | 'INFO';

export type FindingCategory =
  | 'COVERAGE_GAP'
  | 'STAFFING_SCALE'
  | 'RULE_VIOLATION'
  | 'HOURS_IMBALANCE'
  | 'DATA_ISSUE';

export interface ValidationFinding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  message: string;
  affectedNurseIds: string[];
  cellRefs: { nurseId: string; date: string }[];
  date?: string;
  hour?: string;
}

export interface HourCoverage {
  nurses: number;
  doctors: number;
  /** Nurses free of a doctor at that hour who can run Nurse Clinic. */
  freeNurses?: number;
  /** Free nurses still needed at that hour (0 when covered). */
  deficit: number;
  /** A public holiday: one nurse covers the clinic. */
  holiday?: boolean;
}

export interface ValidationReport {
  scheduleId: string;
  timestamp: string;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  findings: ValidationFinding[];
  /** Per date and opening hour: nurses on duty, doctors in session, free nurses, and how many free nurses are missing. */
  hourlyCoverageMap: Record<string, Record<string, HourCoverage>>;
}

export class ScheduleValidator {
  public static validate(
    schedule: Schedule,
    assignments: Assignment[],
    nurses: Nurse[],
    seniorityLevels: SeniorityLevel[],
    dutyWindows: DutyWindow[],
    sessions: DoctorSession[],
    leaveEntries: LeaveEntry[],
    locks: LockEntry[],
    roles: ClinicalRole[],
    rules: Rule[],
    workingHoursPeriods: WorkingHoursPeriod[] = [],
    specialties: Specialty[] = [],
    doctors: Doctor[] = [],
    leaveTypes: LeaveType[] = [],
    clinicSetup?: ClinicSetup
  ): ValidationReport {
    const findings: ValidationFinding[] = [];
    const clinic = resolveClinicSetup(clinicSetup);
    const openHours = openingHourSlots(clinic);
    const phlRole = bloodCollectionRole(roles);
    /** "Dr name (Specialty)" for messages about a session. */
    const doctorLabel = (sess: DoctorSession): string => {
      const doctor = doctors.find((d) => d.id === sess.doctorId);
      const specialty =
        specialties.find((sp) => sp.id === sess.specialtyId) || specialties.find((sp) => doctor?.specialtyIds?.includes(sp.id));
      const name = doctor?.fullName || 'A doctor';
      return specialty ? `${name} (${specialty.name})` : name;
    };
    const seniorRule = resolveRule(rules, 'SENIOR_ON_DUTY', 'rule-h1', ['senior nurse', 'senior on duty']);
    const seniorRuleEnabled = seniorRule ? seniorRule.enabled !== false : true;
    const seniorSeverity: FindingSeverity = seniorRule?.severity === 'SOFT' ? 'WARN' : 'ERROR';
    const seniorLevelIds = new Set((seniorityLevels || []).filter((s) => s.isSenior).map((s) => s.id));
    const dutyMap = new Map((dutyWindows || []).map((d) => [d.id, d]));
    const nurseMap = new Map((nurses || []).map((n) => [n.id, n]));

    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    const datesList: string[] = [];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      datesList.push(d.toISOString().split('T')[0]);
    }

    const hourlyCoverageMap: Record<string, Record<string, HourCoverage>> = {};

    // 0. CATEGORY 2: STAFFING SCALE WARNINGS (Setup-time analysis)
    const activeDoctorIds = new Set(sessions.filter((s) => !s.cancelled).map((s) => s.doctorId));
    if (nurses.length < activeDoctorIds.size) {
      findings.push({
        id: `scale-ratio-warning`,
        category: 'STAFFING_SCALE',
        severity: 'WARN',
        message: `There are ${nurses.length} nurses and ${activeDoctorIds.size} doctors, so on busy days some doctors may not get a nurse.`,
        affectedNurseIds: [],
        cellRefs: [],
      });
    }

    // 1. CATEGORY 1 & 3: HOURLY COVERAGE & DAILY CLINIC LEVEL RULES
    datesList.forEach((date) => {
      hourlyCoverageMap[date] = {};
      const isHoliday = clinic.holidays.has(date);
      const dayAssignments = assignments.filter((a) => a.date === date);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const hasSeniorToday = dayAssignments.some((a) => {
        const n = nurseMap.get(a.nurseId);
        return !!n && seniorLevelIds.has(n.seniorityLevelId);
      });

      // Public holiday: one nurse covers the clinic with the on call doctor; doctor sessions are ignored.
      if (isHoliday) {
        openHours.forEach((h) => {
          const onDuty = dayAssignments.filter((a) => {
            const duty = dutyMap.get(a.dutyWindowId);
            return !!duty && overlaps(duty.startTime, duty.endTime, h.start, h.end);
          }).length;
          hourlyCoverageMap[date][h.start] = { nurses: onDuty, doctors: 0, freeNurses: onDuty, deficit: onDuty > 0 ? 0 : 1, holiday: true };
        });
        const holidayDuties = dayAssignments.map((a) => dutyMap.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d);
        const holidayGaps = uncoveredParts(clinic.openTime, clinic.closeTime, holidayDuties);
        if (dayAssignments.length > 0 && holidayGaps.length > 0) {
          findings.push({
            id: `holiday-gap-${date}`,
            category: 'COVERAGE_GAP',
            severity: 'ERROR',
            message: `Public holiday ${dayName} ${formatDate(date)}: no nurse on duty ${holidayGaps.map((g) => `${g.start}–${g.end}`).join(' and ')}.`,
            affectedNurseIds: [],
            cellRefs: [],
            date,
          });
        }
        if (dayAssignments.length === 0) {
          findings.push({
            id: `holiday-no-nurse-${date}`,
            category: 'COVERAGE_GAP',
            severity: 'ERROR',
            message: `Public holiday ${dayName} ${formatDate(date)}: no nurse on duty.`,
            affectedNurseIds: [],
            cellRefs: [],
            date,
          });
        } else if (seniorRuleEnabled && !hasSeniorToday) {
          findings.push({
            id: `holiday-senior-${date}`,
            category: 'RULE_VIOLATION',
            severity: 'WARN',
            message: `Public holiday ${dayName} ${formatDate(date)}: the nurse on duty is not a senior nurse.`,
            affectedNurseIds: dayAssignments.map((a) => a.nurseId),
            cellRefs: dayAssignments.map((a) => ({ nurseId: a.nurseId, date })),
            date,
          });
        }
        return;
      }

      // Each doctor works one session a day (a duplicate entry is ignored)
      const daySessions = doctorSessionsOn(sessions, date);

      // Rule: At least +1 Additional Nurse Above Doctors During Operating Hours
      const plusOneRule = resolveRule(rules, 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', 'rule-nurse-plus-one', [
        'additional nurse',
        'above doctors',
        'plus one',
      ]);
      const plusOneEnabled = plusOneRule ? plusOneRule.enabled !== false : true;
      const minAdditional = plusOneEnabled ? (plusOneRule?.value ?? 1) : 0;
      const isPlusOneHard = (plusOneRule?.severity || 'HARD') === 'HARD';
      const plusOneSeverity: FindingSeverity = isPlusOneHard ? 'ERROR' : 'WARN';

      // Every opening hour needs a free nurse: not with a doctor at that hour, and
      // qualified for blood collection (she runs Nurse Clinic and blood collection).
      openHours.forEach((h) => {
        const activeDocs = daySessions.filter((s) => overlaps(s.startTime, s.endTime, h.start, h.end)).length;
        const activeNurses = dayAssignments.filter((a) => {
          const duty = dutyMap.get(a.dutyWindowId);
          return !!duty && overlaps(duty.startTime, duty.endTime, h.start, h.end);
        }).length;
        const freeNurses = dayAssignments.filter(
          (a) => canBeFreeNurse(nurseMap.get(a.nurseId), roles) && isFreeDuring(a, dutyMap.get(a.dutyWindowId), daySessions, h.start, h.end)
        ).length;
        const deficit = Math.max(0, minAdditional - freeNurses);

        hourlyCoverageMap[date][h.start] = { nurses: activeNurses, doctors: activeDocs, freeNurses, deficit };

        if (deficit > 0) {
          findings.push({
            id: `cov-gap-${date}-${h.start}`,
            category: 'COVERAGE_GAP',
            severity: plusOneSeverity,
            message: `${dayName} ${formatDate(date)}, ${h.start}: no free nurse for Nurse Clinic (a nurse not with a doctor who can run Nurse Clinic${phlRole ? ' and take blood' : ''} is needed every opening hour).`,
            affectedNurseIds: dayAssignments.map((a) => a.nurseId),
            cellRefs: dayAssignments.map((a) => ({ nurseId: a.nurseId, date })),
            date,
            hour: h.start,
          });
        }
      });

      // Check Evening Departure Tail Scenario (19:00 boundary):
      // "If 3 nurses are still on at 19:00 and 2 leave at 19:00, only 1 remains to cover 3 evening doctors."
      const doctorsAfter19 = daySessions.filter((s) => s.endTime > '19:00').length;
      if (doctorsAfter19 > 0) {
        const nursesBefore19 = dayAssignments.filter((a) => {
          const duty = dutyMap.get(a.dutyWindowId);
          return duty && duty.startTime < '19:00' && duty.endTime >= '19:00';
        }).length;

        const nursesLeavingAt19 = dayAssignments.filter((a) => {
          const duty = dutyMap.get(a.dutyWindowId);
          return duty && duty.endTime === '19:00';
        }).length;

        const nursesRemainingAfter19 = dayAssignments.filter((a) => {
          const duty = dutyMap.get(a.dutyWindowId);
          return duty && duty.endTime > '19:00';
        }).length;

        if (nursesRemainingAfter19 < doctorsAfter19 && nursesLeavingAt19 > 0) {
          findings.push({
            id: `evening-tail-${date}`,
            category: 'COVERAGE_GAP',
            severity: 'WARN',
            message: `${formatDate(date)}: ${nursesLeavingAt19} of ${nursesBefore19} nurses leave at 19:00, leaving ${nursesRemainingAfter19} for ${doctorsAfter19} evening doctor${doctorsAfter19 === 1 ? '' : 's'}.`,
            affectedNurseIds: dayAssignments.map((a) => a.nurseId),
            cellRefs: dayAssignments.map((a) => ({ nurseId: a.nurseId, date })),
            date,
            hour: '19:00',
          });
        }
      }

      // Dedicated Nurse Clinic Rule Check
      const ncRule = resolveRule(rules, 'DEDICATED_NURSE_CLINIC', 'rule-nurse-clinic', [
        'dedicated nurse clinic',
        'nurse clinic coverage',
      ]);
      const ncRole = roles.find(
        (r) => r.id === 'role-nurse-clinic' || r.acronym === 'NC' || r.name.toLowerCase().includes('nurse clinic')
      );
      const ncEnabled = ncRule ? ncRule.enabled !== false : true;
      const isNcHard = (ncRule?.severity || 'HARD') === 'HARD';
      const ncSeverity: FindingSeverity = isNcHard ? 'ERROR' : 'WARN';
      const ncQuota = ncEnabled ? (ncRule?.value ?? 1) : 0;

      if (ncEnabled && ncQuota > 0) {
        // The free nurse runs Nurse Clinic and blood collection together, so either role counts.
        const assignedNcNurses = dayAssignments.filter(
          (a) =>
            a.kind === 'CLINICAL_ROLE' &&
            (a.clinicalRoleId === ncRole?.id ||
              a.clinicalRoleId === 'role-nurse-clinic' ||
              (!!phlRole && a.clinicalRoleId === phlRole.id) ||
              a.note?.toLowerCase().includes('nurse clinic'))
        );

        if (assignedNcNurses.length < ncQuota) {
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

          findings.push({
            id: `nc-coverage-${date}`,
            category: 'RULE_VIOLATION',
            severity: ncSeverity,
            message:
              isNcHard
                ? `No nurse runs Nurse Clinic on ${dayName} ${formatDate(date)}. This rule is never broken: a nurse not with a doctor is needed.`
                : `No nurse runs Nurse Clinic on ${dayName} ${formatDate(date)} (wanted: ${ncQuota}).`,
            affectedNurseIds: [],
            cellRefs: [],
            date,
          });
        }

        // Strict verification: Nurse dedicated to Nurse Clinic MUST NOT be assigned to a doctor
        assignedNcNurses.forEach((asgn) => {
          const ncNurse = nurseMap.get(asgn.nurseId);
          if (ncNurse && !canBeFreeNurse(ncNurse, roles)) {
            findings.push({
              id: `nc-not-qualified-${asgn.nurseId}-${date}`,
              category: 'RULE_VIOLATION',
              severity: 'ERROR',
              message: `${ncNurse.fullName} runs Nurse Clinic on ${formatDate(date)} but ${
                !ncRole || ncNurse.capabilityIds.includes(ncRole.id) || ncNurse.capabilityIds.includes('role-nurse-clinic')
                  ? 'is not qualified for blood collection'
                  : 'does not have the Nurse Clinic option in her profile'
              }.`,
              affectedNurseIds: [asgn.nurseId],
              cellRefs: [{ nurseId: asgn.nurseId, date }],
              date,
            });
          }
          const nurseHasDoctorOnDate = dayAssignments.some(
            (other) => other.nurseId === asgn.nurseId && other.id !== asgn.id && other.kind === 'DOCTOR'
          );
          if (asgn.doctorId || nurseHasDoctorOnDate) {
            findings.push({
              id: `nc-doctor-conflict-${asgn.nurseId}-${date}`,
              category: 'RULE_VIOLATION',
              severity: 'ERROR',
              message: `The Nurse Clinic nurse on ${formatDate(date)} is also with a doctor.`,
              affectedNurseIds: [asgn.nurseId],
              cellRefs: [{ nurseId: asgn.nurseId, date }],
              date,
            });
          }
        });
      }

      // Rule: Exclusive Nurse Clinic Staff Must Never Be Assigned to Doctors or Specialty Pools
      nurses.forEach((nurse) => {
        if (isExclusiveNurseClinic(nurse, roles)) {
          const invalidAssignments = dayAssignments.filter(
            (a) => a.nurseId === nurse.id && (a.kind === 'DOCTOR' || a.kind === 'SPECIALTY' || !!a.doctorId)
          );
          invalidAssignments.forEach((asgn) => {
            findings.push({
              id: `exclusive-nc-doctor-conflict-${nurse.id}-${date}`,
              category: 'RULE_VIOLATION',
              severity: 'ERROR',
              message: `${nurse.fullName} only works in Nurse Clinic, but is with a doctor on ${formatDate(date)}.`,
              affectedNurseIds: [nurse.id],
              cellRefs: [{ nurseId: nurse.id, date }],
              date,
            });
          });
        }
      });

      // Rule 6: Clinical Role Quota (e.g. Blood Collection & IV / PHL)
      roles.forEach((role) => {
        const isNc =
          role.id === ncRole?.id ||
          role.acronym === 'NC' ||
          role.name.toLowerCase().includes('nurse clinic');
        if (isNc) return; // Handled specifically above by dedicated rule checker
        if (ncEnabled && phlRole && role.id === phlRole.id) return; // part of the free nurse's job

        const assignedRoleNurses = dayAssignments.filter(
          (a) => a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId === role.id
        );
        const quota = role.defaultDailyQuota || 1;
        if (assignedRoleNurses.length < quota) {
          findings.push({
            id: `role-quota-${date}-${role.acronym}`,
            category: 'RULE_VIOLATION',
            severity: 'WARN',
            message: `Nobody does ${role.name} on ${formatDate(date)} (wanted: ${quota}).`,
            affectedNurseIds: [],
            cellRefs: [],
            date,
          });
        }
      });

      // Hard Rule H1: at least one senior nurse on duty each day (any shift)
      if (seniorRuleEnabled && dayAssignments.length > 0 && !hasSeniorToday) {
        findings.push({
          id: `h1-senior-${date}`,
          category: 'RULE_VIOLATION',
          severity: seniorSeverity,
          message: `No senior nurse on duty on ${dayName} ${formatDate(date)}.`,
          affectedNurseIds: dayAssignments.map((a) => a.nurseId),
          cellRefs: dayAssignments.map((a) => ({ nurseId: a.nurseId, date })),
          date,
        });
      }

      // CATEGORY 5: DATA ISSUE — Doctor sessions with no nurse assigned
      daySessions.forEach((sess) => {
        const pairedNurse = dayAssignments.find(
          (a) => a.kind === 'DOCTOR' && a.doctorId === sess.doctorId
        );
        // Hours of the session no linked nurse covers (partial cover is allowed, but shown)
        const linkedDuties = dayAssignments
          .filter((a) => a.kind === 'DOCTOR' && a.doctorId === sess.doctorId)
          .map((a) => dutyMap.get(a.dutyWindowId))
          .filter((d): d is DutyWindow => !!d);
        if (linkedDuties.length > 0) {
          const missing = uncoveredParts(sess.startTime, sess.endTime, linkedDuties);
          if (missing.length > 0) {
            findings.push({
              id: `session-partial-${sess.id}`,
              category: 'COVERAGE_GAP',
              severity: 'WARN',
              message: `${doctorLabel(sess)} on ${formatDate(date)} has no nurse for ${missing.map((m) => `${m.start}–${m.end}`).join(' and ')}.`,
              affectedNurseIds: [],
              cellRefs: [],
              date,
            });
          }
        }
        const pairedDuty = pairedNurse ? dutyMap.get(pairedNurse.dutyWindowId) : undefined;
        if (pairedNurse && pairedDuty && !overlaps(pairedDuty.startTime, pairedDuty.endTime, sess.startTime, sess.endTime)) {
          findings.push({
            id: `session-no-overlap-${sess.id}`,
            category: 'COVERAGE_GAP',
            severity: 'WARN',
            message: `The nurse with the doctor on ${formatDate(date)} works ${pairedDuty.startTime}–${pairedDuty.endTime}, outside the session (${sess.startTime}–${sess.endTime}).`,
            affectedNurseIds: [pairedNurse.nurseId],
            cellRefs: [{ nurseId: pairedNurse.nurseId, date }],
            date,
          });
        }
        if (!pairedNurse) {
          findings.push({
            id: `unassigned-session-${sess.id}`,
            category: 'COVERAGE_GAP',
            severity: 'WARN',
            message: `${doctorLabel(sess)} on ${formatDate(date)} (${sess.startTime}–${sess.endTime}) has no nurse assigned.`,
            affectedNurseIds: [],
            cellRefs: [],
            date,
          });
        }
      });
    });

    // 2. CATEGORY 3, 4 & 5: PER-NURSE RULE AUDITS (H2, H3, H4, H6, H7, S1, Hours Pacing, Data Issues)
    const s1Rule = resolveRule(rules, 'MAX_CONSECUTIVE_LATE_DUTIES', 'rule-s1', [
      'consecutive late',
      'consecutive night',
      'ending at 21:00',
      'late duties',
    ]);
    const maxLateAllowed = (s1Rule?.enabled !== false && s1Rule?.value) ? s1Rule.value : 3;
    // Same default as the canonical rule (HARD) and the engine
    const s1Severity: FindingSeverity = s1Rule?.severity === 'SOFT' ? 'WARN' : 'ERROR';
    const s1Enabled = s1Rule ? s1Rule.enabled !== false : true;
    const s1LateThreshold: string = (s1Rule?.params as any)?.thresholdTime || '21:00';

    const h2Rule = resolveRule(
      rules,
      'MAX_CONSECUTIVE_DAYS',
      'rule-h2',
      ['consecutive duties', 'consecutive working days', 'consecutive days'],
      LATE_DUTY_RULE_WORDS
    );
    const maxConsecutiveDaysAllowed = (h2Rule?.enabled !== false && h2Rule?.value) ? h2Rule.value : 6;
    const h2Severity: FindingSeverity = h2Rule?.severity === 'SOFT' ? 'WARN' : 'ERROR';
    const h2Enabled = h2Rule ? h2Rule.enabled !== false : true;

    const h3Rule = resolveRule(rules, 'MIN_REST_HOURS', 'rule-h3', [
      'rest between duties',
      'minimum rest',
    ]);
    // 0 means no minimum rest, as in the generator.
    const minRestRequired = h3Rule?.value ?? 11;
    const h3Severity: FindingSeverity = h3Rule?.severity === 'SOFT' ? 'WARN' : 'ERROR';
    const h3Enabled = h3Rule ? h3Rule.enabled !== false : true;

    const h7Rule = resolveRule(rules, 'MAX_WORKING_HOURS_PER_PERIOD', 'rule-h7-max-hours', [
      'working hours',
      'max hours',
      'period hours',
      'overwork',
      'hour limit',
    ]);
    const h7Severity: FindingSeverity = h7Rule?.severity === 'SOFT' ? 'WARN' : 'ERROR';
    const h7Enabled = h7Rule ? h7Rule.enabled !== false : true;
    const h7TolerancePct = (h7Rule?.value ? h7Rule.value : 105) / 100;

    nurses.forEach((nurse) => {
      // Data Issue: Nurse missing Gmail address
      if (!nurse.gmail || !nurse.gmail.includes('@')) {
        findings.push({
          id: `missing-gmail-${nurse.id}`,
          category: 'DATA_ISSUE',
          // Not blocking: the roster can still be published, this nurse just isn't emailed.
          severity: 'WARN',
          message: `${nurse.fullName} has no email address, so they won't get the roster by email.`,
          affectedNurseIds: [nurse.id],
          cellRefs: [],
        });
      }

      const nurseAssignments = assignments
        .filter((a) => a.nurseId === nurse.id)
        .sort((a, b) => a.date.localeCompare(b.date));

      let consecutiveDays = 0;
      let consecutiveLateDuties = 0;
      let consecutiveLateStartDay: string | null = null;
      let totalHours = 0;

      // Rosters run back to back: carry the runs and the last shift over from the previous roster.
      const priorByDate = new Map(
        clinic.priorAssignments.filter((a) => a.nurseId === nurse.id && a.date < schedule.startDate).map((a) => [a.date, a])
      );
      const dayBefore = (iso: string, n: number) => {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d - n)).toISOString().split('T')[0];
      };
      for (let k = 1; k <= 31 && priorByDate.has(dayBefore(schedule.startDate, k)); k++) consecutiveDays++;
      for (let k = 1; k <= 31; k++) {
        const prev = priorByDate.get(dayBefore(schedule.startDate, k));
        const prevDuty = prev ? dutyMap.get(prev.dutyWindowId) : undefined;
        if (!prevDuty || prevDuty.endTime < s1LateThreshold) break;
        consecutiveLateDuties++;
        consecutiveLateStartDay = prev!.date;
      }
      const lastPriorShift = priorByDate.get(dayBefore(schedule.startDate, 1));

      for (let i = 0; i < datesList.length; i++) {
        const date = datesList[i];
        const asgnsToday = nurseAssignments.filter((a) => a.date === date);

        // DATA ISSUE: Duplicate duty on same day
        if (asgnsToday.length > 1) {
          findings.push({
            id: `h4-dup-${nurse.id}-${date}`,
            category: 'DATA_ISSUE',
            severity: 'ERROR',
            message: `${nurse.fullName} has two shifts on ${formatDate(date)}.`,
            affectedNurseIds: [nurse.id],
            cellRefs: [{ nurseId: nurse.id, date }],
            date,
          });
        }

        // DATA ISSUE: Leave overlapping an assignment
        const onLeave = leaveEntries.some(
          (le) => le.nurseId === nurse.id && le.approved && date >= le.startDate && date <= le.endDate
        );
        // A shift on a day off lock
        const dayOffLock = (locks || []).some((l) => l.nurseId === nurse.id && l.date === date && l.mode === 'OFF');
        if (dayOffLock && asgnsToday.length > 0) {
          findings.push({
            id: `dayoff-lock-${nurse.id}-${date}`,
            category: 'RULE_VIOLATION',
            severity: 'ERROR',
            message: `${nurse.fullName} has a shift on ${formatDate(date)}, which is pinned as a day off.`,
            affectedNurseIds: [nurse.id],
            cellRefs: [{ nurseId: nurse.id, date }],
            date,
          });
        }
        if (onLeave && asgnsToday.length > 0) {
          findings.push({
            id: `leave-overlap-${nurse.id}-${date}`,
            category: 'DATA_ISSUE',
            severity: 'ERROR',
            message: `${nurse.fullName} has a shift on ${formatDate(date)} but is on approved leave.`,
            affectedNurseIds: [nurse.id],
            cellRefs: [{ nurseId: nurse.id, date }],
            date,
          });
        }

        if (asgnsToday.length === 1) {
          const currentAsgn = asgnsToday[0];
          consecutiveDays++;
          const duty = dutyMap.get(currentAsgn.dutyWindowId);

          // Rule H6: Capability verification (Blood Collection & IV / PHL)
          if (currentAsgn.kind === 'CLINICAL_ROLE') {
            const role = roles.find((r) => r.id === currentAsgn.clinicalRoleId);
            if (role?.acronym === 'PHL' && !nurse.capabilityIds.includes(role.id)) {
              findings.push({
                id: `h6-phl-capability-${nurse.id}-${date}`,
                category: 'RULE_VIOLATION',
                severity: 'ERROR',
                message: `${nurse.fullName} does ${role.name} on ${formatDate(date)} but doesn't have that skill.`,
                affectedNurseIds: [nurse.id],
                cellRefs: [{ nurseId: nurse.id, date }],
                date,
              });
            }
          }

          // Rule H8: Strict Nurse Profile Allocation (Only pair with doctors or specialties in nurse profile)
          const hasSpecificAllocations = nurse.preferences?.some(
            (p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY'
          );

          if (hasSpecificAllocations) {
            if (currentAsgn.kind === 'DOCTOR' && currentAsgn.doctorId) {
              const docObj = doctors.find((d) => d.id === currentAsgn.doctorId);
              const docSession = sessions.find((s) => s.doctorId === currentAsgn.doctorId && s.date === date && !s.cancelled);
              const docSpecId = docSession?.specialtyId || docObj?.specialtyIds?.[0];
              const docSpecIds = docObj?.specialtyIds || (docSpecId ? [docSpecId] : []);

              const matchesDoctor = nurse.preferences?.some(
                (p) => p.kind === 'DOCTOR' && p.refId === currentAsgn.doctorId
              );
              const matchesSpec = nurse.preferences?.some((p) => {
                if (p.kind !== 'SPECIALTY') return false;
                if (docSpecIds.includes(p.refId)) return true;
                const pRefLower = p.refId.toLowerCase();
                for (const sid of docSpecIds) {
                  const sObj = specialties.find((s) => s.id === sid);
                  if (sObj) {
                    if (
                      pRefLower === sObj.code.toLowerCase() ||
                      pRefLower === sObj.name.toLowerCase() ||
                      (sObj.code.toLowerCase() === 'pcc' && pRefLower.includes('pcc')) ||
                      (sObj.code.toLowerCase() === 'ped' && (pRefLower.includes('ped') || pRefLower.includes('pedia')))
                    ) {
                      return true;
                    }
                  }
                }
                return false;
              });

              if (!matchesDoctor && !matchesSpec) {
                const docName = docObj ? docObj.fullName : 'Doctor';
                const docSpecName = specialties.find((s) => docSpecIds.includes(s.id))?.name || 'Department';
                findings.push({
                  id: `h8-doctor-allocation-${nurse.id}-${date}`,
                  category: 'RULE_VIOLATION',
                  severity: 'ERROR',
                  message: `${nurse.fullName} is with ${docName} (${docSpecName}) on ${formatDate(date)}, who isn't one of their doctors.`,
                  affectedNurseIds: [nurse.id],
                  cellRefs: [{ nurseId: nurse.id, date }],
                  date,
                });
              }
            } else if (currentAsgn.kind === 'SPECIALTY' && currentAsgn.specialtyId) {
              const specObj = specialties.find((s) => s.id === currentAsgn.specialtyId);
              const matchesSpec = nurse.preferences?.some((p) => {
                if (p.kind !== 'SPECIALTY') return false;
                if (p.refId === currentAsgn.specialtyId) return true;
                if (specObj) {
                  const pRefLower = p.refId.toLowerCase();
                  if (
                    pRefLower === specObj.code.toLowerCase() ||
                    pRefLower === specObj.name.toLowerCase() ||
                    (specObj.code.toLowerCase() === 'pcc' && pRefLower.includes('pcc')) ||
                    (specObj.code.toLowerCase() === 'ped' && (pRefLower.includes('ped') || pRefLower.includes('pedia')))
                  ) {
                    return true;
                  }
                }
                return false;
              });

              if (!matchesSpec) {
                const specName = specObj ? `${specObj.name} (${specObj.code})` : 'Specialty';
                findings.push({
                  id: `h8-specialty-allocation-${nurse.id}-${date}`,
                  category: 'RULE_VIOLATION',
                  severity: 'ERROR',
                  message: `${nurse.fullName} works in ${specName} on ${formatDate(date)}, which isn't one of their specialties.`,
                  affectedNurseIds: [nurse.id],
                  cellRefs: [{ nurseId: nurse.id, date }],
                  date,
                });
              }
            }
          }

          // Rule S1: Consecutive late duties ending at or after the rule's threshold time
          if (duty && duty.endTime >= s1LateThreshold) {
            if (consecutiveLateDuties === 0) {
              consecutiveLateStartDay = date;
            }
            consecutiveLateDuties++;
            if (s1Enabled && consecutiveLateDuties > maxLateAllowed) {
              findings.push({
                id: `s1-late-${nurse.id}-${date}`,
                category: 'RULE_VIOLATION',
                severity: s1Severity,
                message: `${nurse.fullName}: ${consecutiveLateDuties} late shifts in a row (most allowed: ${maxLateAllowed}), ${formatDate(consecutiveLateStartDay)} to ${formatDate(date)}.`,
                affectedNurseIds: [nurse.id],
                cellRefs: [{ nurseId: nurse.id, date }],
                date,
              });
            }
          } else {
            consecutiveLateDuties = 0;
            consecutiveLateStartDay = null;
          }

          // Rule H2: Max consecutive working days
          if (h2Enabled && consecutiveDays > maxConsecutiveDaysAllowed) {
            findings.push({
              id: `h2-days-${nurse.id}-${date}`,
              category: 'RULE_VIOLATION',
              severity: h2Severity,
              message: `${nurse.fullName}: ${consecutiveDays} working days in a row (most allowed: ${maxConsecutiveDaysAllowed}), ending ${formatDate(date)}.`,
              affectedNurseIds: [nurse.id],
              cellRefs: [{ nurseId: nurse.id, date }],
              date,
            });
          }

          // Rule H3: Minimum rest between consecutive duties
          if (h3Enabled) {
            const yesterdayDate = i > 0 ? datesList[i - 1] : dayBefore(schedule.startDate, 1);
            const yesterdayAsgns =
              i > 0 ? nurseAssignments.filter((a) => a.date === yesterdayDate) : lastPriorShift ? [lastPriorShift] : [];
            if (yesterdayAsgns.length > 0) {
              const prevDuty = dutyMap.get(yesterdayAsgns[0].dutyWindowId);
              if (prevDuty && duty) {
                // Calculate hours between prevDuty.endTime and today duty.startTime
                const [prevEndH, prevEndM] = prevDuty.endTime.split(':').map(Number);
                const [currStartH, currStartM] = duty.startTime.split(':').map(Number);
                const restHours = (24 - prevEndH - prevEndM / 60) + (currStartH + currStartM / 60);

                if (restHours < minRestRequired) {
                  findings.push({
                    id: `h3-rest-${nurse.id}-${date}`,
                    category: 'RULE_VIOLATION',
                    severity: h3Severity,
                    message: `${nurse.fullName}: only ${restHours} h rest (needs ${minRestRequired} h) between ${formatDate(yesterdayDate)} (ends ${prevDuty.endTime}) and ${formatDate(date)} (starts ${duty.startTime}).`,
                    affectedNurseIds: [nurse.id],
                    cellRefs: [
                      { nurseId: nurse.id, date: yesterdayDate },
                      { nurseId: nurse.id, date },
                    ],
                    date,
                  });
                }
              }
            }
          }
        } else {
          consecutiveDays = 0;
          consecutiveLateDuties = 0;
          consecutiveLateStartDay = null;
        }
      }

      // Hours by the shared rule: a leave day counts its leave (not also a shift on it),
      // and a day with two shifts counts one, as in the Hours tab and the emails.
      totalHours = summarizeNurseHours(nurse, schedule, assignments, dutyMap, leaveEntries, leaveTypes, workingHoursPeriods).totalHours;

      // Full time target hours (shared rule, same as the engine and reports)
      const effectiveFullTimeTarget = resolveFullTimeTarget(schedule, workingHoursPeriods).hours;

      // CATEGORY 4: HOURS IMBALANCE CHECKS & RULE H7 (Maximum Working Hours Limit)
      const target = Math.round(effectiveFullTimeTarget * (nurse.contractPercent / 100));
      const maxAllowed = Math.max(target, Math.min(target + 8, Math.round(target * h7TolerancePct)));
      const paceRatio = target > 0 ? totalHours / target : 1;
      const h = (n: number) => Math.round(n * 10) / 10;

      if (paceRatio < 0.75) {
        const delta = totalHours - target;
        findings.push({
          id: `hours-low-${nurse.id}`,
          category: 'HOURS_IMBALANCE',
          severity: 'WARN',
          message: `${nurse.fullName}: ${h(totalHours)} / ${target} h, ${h(Math.abs(delta))} h short.`,
          affectedNurseIds: [nurse.id],
          cellRefs: [],
        });
      } else if (h7Enabled && totalHours > maxAllowed) {
        const delta = totalHours - target;
        findings.push({
          id: `h7-hours-over-${nurse.id}`,
          category: h7Severity === 'ERROR' ? 'RULE_VIOLATION' : 'HOURS_IMBALANCE',
          severity: h7Severity,
          message: `${nurse.fullName}: ${h(totalHours)} / ${target} h, ${h(delta)} h over (most allowed: ${maxAllowed} h).`,
          affectedNurseIds: [nurse.id],
          cellRefs: nurseAssignments.slice(0, 1).map((a) => ({ nurseId: a.nurseId, date: a.date })),
        });
      } else if (paceRatio > h7TolerancePct) {
        const delta = totalHours - target;
        findings.push({
          id: `hours-over-${nurse.id}`,
          category: 'HOURS_IMBALANCE',
          severity: 'WARN',
          message: `${nurse.fullName}: ${h(totalHours)} / ${target} h, ${h(delta)} h over.`,
          affectedNurseIds: [nurse.id],
          cellRefs: nurseAssignments.slice(0, 1).map((a) => ({ nurseId: a.nurseId, date: a.date })),
        });
      }
    });

    const errorCount = findings.filter((f) => f.severity === 'ERROR').length;
    const warnCount = findings.filter((f) => f.severity === 'WARN').length;
    const infoCount = findings.filter((f) => f.severity === 'INFO').length;

    return {
      scheduleId: schedule.id,
      timestamp: new Date().toISOString(),
      errorCount,
      warnCount,
      infoCount,
      findings,
      hourlyCoverageMap,
    };
  }
}
