/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Deterministic Scheduling Engine
 * Implements Phase 7 demand model, constraint presets (H1-H6, S1-S7),
 * and progressive chunked generation to never freeze the UI.
 */

import { isWeekendDate, isWeekendDay } from '../../utils/weekend';
import { v4 as uuidv4 } from 'uuid';
import {
  Schedule,
  Assignment,
  LeaveEntry,
  LockEntry,
  DoctorSession,
  Doctor,
  Nurse,
  NursePreference,
  DutyWindow,
  ClinicalRole,
  Specialty,
  SeniorityLevel,
  Rule,
  IsoDateString,
  AssignmentSource,
  WorkingHoursPeriod,
  LeaveType,
} from '../../types';
import {
  GenerationProgressCallback,
  GenerationResult,
  RegenerateMode,
  GenerationPreflightSummary,
} from './types';
import { isExclusiveNurseClinic } from './nurseClinicUtils';
import { resolveFullTimeTarget, nurseLeaveHoursInRange, leaveDaysInRange } from '../hours/hoursPolicy';
import { calculateWorkingHoursForDateRange } from '../periods/workingHoursPeriodService';
import { generateDoctorSessionsForDateRange } from '../schedule/doctorScheduleService';
import { calculateDutyDurationHours } from '../reports/hoursAccounting';
import {
  ClinicSetup,
  bloodCollectionRole,
  canBeFreeNurse,
  coveredMinutes,
  isFreeDuring,
  openingHourSlots,
  overlaps,
  resolveClinicSetup,
  toMinutes,
  uncoveredParts,
  hoursToCover,
  doctorSessionsOn,
} from './clinicModel';

/**
 * Resiliently finds a rule by templateKey, id, or semantic keywords in its name.
 */
export function resolveRule(
  rules: Rule[],
  templateKey?: string,
  fallbackId?: string,
  semanticKeywords?: string[],
  excludeKeywords: string[] = []
): Rule | undefined {
  if (!rules || rules.length === 0) return undefined;

  // A rule already tagged with a different template is a different rule.
  const isCandidate = (r: Rule) => !r.templateKey || !templateKey || r.templateKey === templateKey;

  // 1. Direct templateKey match
  if (templateKey) {
    const byKey = rules.find((r) => r.templateKey === templateKey);
    if (byKey) return byKey;
  }

  // 2. Direct ID match
  if (fallbackId) {
    const byId = rules.find((r) => r.id === fallbackId && isCandidate(r));
    if (byId) return byId;
  }

  // 3. Keywords in the rule name (only for older rules without a template key)
  if (semanticKeywords && semanticKeywords.length > 0) {
    const lowerKeywords = semanticKeywords.map((k) => k.toLowerCase());
    const lowerExcludes = excludeKeywords.map((k) => k.toLowerCase());
    const byName = rules.find((r) => {
      if (!isCandidate(r)) return false;
      const lowerName = (r.name || '').toLowerCase();
      if (lowerExcludes.some((k) => lowerName.includes(k))) return false;
      return lowerKeywords.some((keyword) => lowerName.includes(keyword));
    });
    if (byName) return byName;
  }

  return undefined;
}

/** Name words that mark a rule about late or night duties (never "max consecutive days"). */
export const LATE_DUTY_RULE_WORDS = ['late', 'night', '21:00'];

/** The consecutive late duties rule (S1), if the clinic has one. */
function consecutiveLateRuleOf(rules: Rule[]): Rule | undefined {
  return resolveRule(rules, 'MAX_CONSECUTIVE_LATE_DUTIES', 'rule-s1', [
    'consecutive late',
    'consecutive night',
    'ending at 21:00',
    'late duties',
  ]);
}

/**
 * A duty is "late" when it ends at or after this time (the S1 rule's setting,
 * default 21:00). The engine, the fairness counts and the year to date totals
 * all use it, so they agree on which shifts are late.
 */
export function lateDutyThreshold(rules: Rule[] = []): string {
  return (consecutiveLateRuleOf(rules)?.params as any)?.thresholdTime || '21:00';
}

/** True when the duty ends at or after the late threshold. */
export function isLateDuty(duty: DutyWindow | undefined, threshold: string): boolean {
  return !!duty && duty.endTime >= threshold;
}

interface InternalSlot {
  date: IsoDateString;
  kind: 'DOCTOR' | 'CLINICAL_ROLE' | 'SPECIALTY';
  targetId: string; // doctorId, clinicalRoleId, or specialtyId
  startTime: string; // 'HH:mm'
  endTime: string;   // 'HH:mm'
  priority: number;  // higher = fill first
}

interface NurseDayState {
  hasDuty: boolean;
  dutyWindowId?: string;
  assignmentKind?: 'DOCTOR' | 'SPECIALTY' | 'CLINICAL_ROLE';
  targetId?: string;
  source?: AssignmentSource;
  consecutiveWorkingDays: number;
  consecutiveLateEnds: number; // shifts ending at or after 21:00
  totalDutyHoursEarned: number;
  leaveHoursCredited?: number;
  initialLockedHours?: number;
  weekendsWorked: number;
  holidaysWorked: number;
  nurseClinicCount: number;
  lastDutyEndTime?: string; // 'YYYY-MM-DD HH:mm'
}

export class SchedulingEngine {
  /**
   * Produce pre-flight diagnostic summary before generation
   */
  public static computePreflight(
    schedule: Schedule,
    nurses: Nurse[],
    doctors: any[],
    sessions: DoctorSession[],
    locks: LockEntry[],
    leaveEntries: LeaveEntry[],
    roles: ClinicalRole[],
    rules: Rule[] = [],
    dutyWindows: DutyWindow[] = [],
    workingHoursPeriods: WorkingHoursPeriod[] = []
  ): GenerationPreflightSummary {
    if (!schedule || !schedule.startDate || !schedule.endDate) {
      return {
        scheduleName: schedule?.name || 'No Schedule',
        startDate: schedule?.startDate || '',
        endDate: schedule?.endDate || '',
        totalDays: 0,
        totalBlocks: 0,
        activeNursesCount: nurses?.length || 0,
        activeDoctorsCount: doctors?.length || 0,
        doctorSessionsCount: 0,
        bloodCollectionNursesCount: 0,
        existingLocksCount: locks?.length || 0,
        existingLeaveDaysCount: leaveEntries?.length || 0,
        estimatedTotalAssignments: 0,
      };
    }

    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    const totalDays =
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalBlocks = Math.ceil(totalDays / (schedule.blockWeeks * 7));

    // Resolve dedicated period and target working hours
    let detectedPeriodName: string | undefined = schedule.periodName;
    let targetWorkingHoursFullTime: number = 0;
    let isProratedPeriod: boolean | undefined = undefined;
    let hoursTargetDescription: string | undefined = undefined;

    const fullTimeTarget = resolveFullTimeTarget(schedule, workingHoursPeriods);
    targetWorkingHoursFullTime = fullTimeTarget.hours;
    detectedPeriodName = fullTimeTarget.periodName;
    if (fullTimeTarget.source === 'PERIOD' && workingHoursPeriods) {
      const calc = calculateWorkingHoursForDateRange(schedule.startDate, schedule.endDate, workingHoursPeriods);
      isProratedPeriod = !calc.isExactMatch;
      hoursTargetDescription = calc.description;
    } else {
      hoursTargetDescription =
        fullTimeTarget.source === 'SCHEDULE'
          ? `Schedule target: ${fullTimeTarget.hours}h full time`
          : `No dedicated period covers these dates: ${fullTimeTarget.hours}h (40h per week)`;
    }

    let scheduleSessions = sessions.filter(
      (s) => !s.cancelled && s.date >= schedule.startDate && s.date <= schedule.endDate
    );

    // Ensure all active doctors' recurring weekly pattern sessions are included in preflight demand
    if (doctors && doctors.length > 0 && schedule.startDate && schedule.endDate) {
      const recurringSessions = generateDoctorSessionsForDateRange(
        schedule.startDate,
        schedule.endDate,
        doctors
      );
      // Include cancelled sessions here, so a cancelled session is not added back as demand.
      const existingKeySet = new Set(
        sessions
          .filter((s) => s.date >= schedule.startDate && s.date <= schedule.endDate)
          .map((s) => `${s.doctorId}_${s.date}_${s.startTime}`)
      );
      // A doctor day changed or cancelled by hand for that date gets nothing from the pattern.
      const handChangedDays = new Set(
        sessions.filter((s) => s.source === 'MANUAL' || s.cancelled).map((s) => `${s.doctorId}_${s.date}`)
      );
      const missingRecurring = recurringSessions.filter(
        (s) => !existingKeySet.has(`${s.doctorId}_${s.date}_${s.startTime}`) && !handChangedDays.has(`${s.doctorId}_${s.date}`)
      );
      if (missingRecurring.length > 0) {
        scheduleSessions = [...scheduleSessions, ...missingRecurring];
      }
    }

    const scheduleLocks = locks.filter(
      (l) => l.date >= schedule.startDate && l.date <= schedule.endDate
    );

    const scheduleLeave = leaveEntries.filter(
      (le) =>
        le.approved &&
        !(le.endDate < schedule.startDate || le.startDate > schedule.endDate)
    );

    // Active duty priority breakdown
    const activeDuties = dutyWindows.filter((d) => d.active !== false);
    const priorityDutiesCount = activeDuties.filter((d) => Boolean(d.isPriority)).length;
    const standardDutiesCount = activeDuties.length - priorityDutiesCount;

    // Nurse Clinic Rule lookup
    const ncRule = resolveRule(rules, 'DEDICATED_NURSE_CLINIC', 'rule-nurse-clinic', [
      'dedicated nurse clinic',
      'nurse clinic coverage',
    ]);
    const ncEnabled = ncRule ? ncRule.enabled !== false : true;
    const ncSeverity = ncRule?.severity || 'HARD';
    const ncQuota = ncEnabled ? (ncRule?.value ?? 1) : 0;
    const nurseClinicSlotsCount = totalDays * ncQuota;

    // Evening doctor sessions (ending at or after 19:00)
    const eveningSessions = scheduleSessions.filter((s) => s.endTime >= '19:00');
    let eveningCoverageAlert: string | undefined;
    if (eveningSessions.length > 0) {
      eveningCoverageAlert = `${eveningSessions.length} doctor session${eveningSessions.length === 1 ? ' runs' : 's run'} into the evening, so shifts that reach the evening are used for ${eveningSessions.length === 1 ? 'it' : 'them'}.`;
    }

    let staffingScaleWarning: string | undefined;
    if (nurses.length < doctors.length) {
      staffingScaleWarning = `There are ${nurses.length} nurses and ${doctors.length} doctors, so on busy days some doctors may not get a nurse.`;
    }

    return {
      scheduleName: schedule.name,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      totalDays,
      totalBlocks,
      activeNursesCount: nurses.length,
      activeDoctorsCount: doctors.length,
      doctorSessionsCount: scheduleSessions.length,
      bloodCollectionNursesCount: (() => {
        const phl = bloodCollectionRole(roles);
        return phl ? nurses.filter((n) => n.capabilityIds.includes(phl.id)).length : nurses.length;
      })(),
      nurseClinicSlotsCount,
      nurseClinicRuleSeverity: ncSeverity,
      nurseClinicRuleEnabled: ncEnabled,
      existingLocksCount: scheduleLocks.length,
      existingLeaveDaysCount: scheduleLeave.reduce(
        (sum, le) => sum + leaveDaysInRange(le, schedule.startDate, schedule.endDate),
        0
      ),
      estimatedTotalAssignments: scheduleSessions.length + totalDays + nurseClinicSlotsCount,
      priorityDutiesCount,
      standardDutiesCount,
      eveningCoverageAlert,
      staffingScaleWarning,
      detectedPeriodName,
      targetWorkingHoursFullTime,
      isProratedPeriod,
      hoursTargetDescription,
    };
  }

  /**
   * Filter and order candidate duties for a given slot.
   * Partitions into Priority Tier and Fallback/Standard Tier.
   * Duties in Priority Tier are evaluated first during slot assignment.
   * If priority duties cannot fulfill the requirement or violate constraints,
   * the engine falls back to the rest of the duties in the Fallback Tier.
   */
  public static partitionCandidateDuties(
    slot: InternalSlot,
    dutyWindows: DutyWindow[]
  ): { priorityTier: DutyWindow[]; fallbackTier: DutyWindow[] } {
    const active = dutyWindows.filter((d) => d.active !== false);
    if (active.length === 0) {
      return { priorityTier: [], fallbackTier: dutyWindows };
    }

    const slotDuration =
      (parseInt(slot.endTime.split(':')[0], 10) * 60 + parseInt(slot.endTime.split(':')[1], 10)) -
      (parseInt(slot.startTime.split(':')[0], 10) * 60 + parseInt(slot.startTime.split(':')[1], 10));

    // Scorer to order duties by clinical suitability for this slot:
    // 1. Full cover (duty start <= slot start && duty end >= slot end) = +1000
    // 2. Overlap with slot = +500
    // 3. Closeness to slot duration (minimizes unnecessary surplus/deficit)
    const getSuitabilityScore = (d: DutyWindow) => {
      let score = 0;
      if (d.startTime <= slot.startTime && d.endTime >= slot.endTime) {
        score += 1000;
      } else if (d.startTime < slot.endTime && d.endTime > slot.startTime) {
        score += 500;
      }
      const dur =
        (parseInt(d.endTime.split(':')[0], 10) * 60 + parseInt(d.endTime.split(':')[1], 10)) -
        (parseInt(d.startTime.split(':')[0], 10) * 60 + parseInt(d.startTime.split(':')[1], 10));
      score -= Math.abs(dur - slotDuration);
      return score;
    };

    // Deterministic sort function for candidate duties
    const sortDuties = (list: DutyWindow[]) => {
      return [...list].sort((a, b) => {
        const suitA = getSuitabilityScore(a);
        const suitB = getSuitabilityScore(b);
        if (suitA !== suitB) return suitB - suitA;

        const rankA = a.priorityRank ?? (a.isPriority ? 100 : 50);
        const rankB = b.priorityRank ?? (b.isPriority ? 100 : 50);
        if (rankA !== rankB) return rankB - rankA;

        return a.acronym.localeCompare(b.acronym);
      });
    };

    const priorityTier = sortDuties(active.filter((d) => Boolean(d.isPriority)));
    const fallbackTier = sortDuties(active.filter((d) => !d.isPriority));

    return { priorityTier, fallbackTier };
  }

  /**
   * Deterministic Generation Pass (with async chunking)
   */
  public static async generate(
    schedule: Schedule,
    mode: RegenerateMode,
    existingAssignments: Assignment[],
    nurses: Nurse[],
    seniorityLevels: SeniorityLevel[],
    dutyWindows: DutyWindow[],
    roles: ClinicalRole[],
    specialties: Specialty[],
    sessions: DoctorSession[],
    locks: LockEntry[],
    leaveEntries: LeaveEntry[],
    rules: Rule[],
    onProgress?: GenerationProgressCallback,
    workingHoursPeriods?: WorkingHoursPeriod[],
    doctors: Doctor[] = [],
    leaveTypes: LeaveType[] = [],
    clinicSetup?: ClinicSetup,
    options: { keepManual?: boolean; onlyDates?: { start: string; end: string } } = {}
  ): Promise<GenerationResult> {
    const startTimeMs = performance.now();
    // Hand edits are kept unless the planner asks to replace them (GENERATE_ALL only).
    const keepManual = options.keepManual !== false;
    // Filling only some dates: no shift is placed on other days, and their needs
    // don't take nurses' hours (the shifts already there still count).
    const inFill = (date: string) => !options.onlyDates || (date >= options.onlyDates.start && date <= options.onlyDates.end);

    // 1. Sort inputs deterministically
    const sortedNurses = [...nurses].sort((a, b) => a.fullName.localeCompare(b.fullName));
    const fullDayDuty = dutyWindows.find((d) => d.acronym === 'D') || dutyWindows[0];
    const lateDuty = dutyWindows.find((d) => d.acronym === 'L') || dutyWindows[0];
    const earlyDuty = dutyWindows.find((d) => d.acronym === 'E') || dutyWindows[0];

    const seniorLevelIds = new Set(
      seniorityLevels.filter((s) => s.isSenior).map((s) => s.id)
    );

    // Full time target hours (shared rule: dedicated periods, then the schedule's own target)
    const fullTimeTarget = resolveFullTimeTarget(schedule, workingHoursPeriods);
    const effectiveFullTimeTarget = fullTimeTarget.hours;
    const resolvedPeriodName: string | undefined = fullTimeTarget.periodName;

    // Dedicated Nurse Clinic rule lookup & configuration
    const ncRule = resolveRule(rules, 'DEDICATED_NURSE_CLINIC', 'rule-nurse-clinic', [
      'dedicated nurse clinic',
      'nurse clinic coverage',
    ]);
    const ncEnabled = ncRule ? ncRule.enabled !== false : true;
    const ncSeverity = ncRule?.severity || 'HARD';
    const ncQuota = ncEnabled ? (ncRule?.value ?? 1) : 0;

    // At least +1 Additional Nurse Above Doctors During Operating Hours
    const plusOneRule = resolveRule(rules, 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', 'rule-nurse-plus-one', [
      'additional nurse',
      'above doctors',
      'plus one',
    ]);
    const plusOneEnabled = plusOneRule ? plusOneRule.enabled !== false : true;
    const minAdditionalNurses = plusOneEnabled ? (plusOneRule?.value ?? 1) : 0;

    // At least one senior nurse on duty each day (Hard Rule H1)
    const seniorRule = resolveRule(rules, 'SENIOR_ON_DUTY', 'rule-h1', ['senior nurse', 'senior on duty']);
    const seniorRuleEnabled = seniorRule ? seniorRule.enabled !== false : true;

    // Maximum Working Hours Per Period rule lookup & configuration (Hard Rule H7)
    const maxHoursRule = resolveRule(rules, 'MAX_WORKING_HOURS_PER_PERIOD', 'rule-h7-max-hours', [
      'working hours',
      'max hours',
      'period hours',
      'overwork',
      'hour limit',
    ]);
    const maxHoursEnabled = maxHoursRule ? maxHoursRule.enabled !== false : true;
    const maxHoursSeverity = maxHoursRule?.severity || 'HARD';
    const maxHoursToleranceRatio = (maxHoursRule?.value ? maxHoursRule.value : 105) / 100;

    // Consecutive Late Duties Ending at 21:00 (Rule S1)
    const consecutiveLateRule = consecutiveLateRuleOf(rules);
    const maxConsecutiveLate = consecutiveLateRule?.value ? consecutiveLateRule.value : 3;
    const consecutiveLateSeverity = consecutiveLateRule?.severity || 'HARD';
    const consecutiveLateEnabled = consecutiveLateRule ? consecutiveLateRule.enabled !== false : true;
    // A duty "ends late" when it ends at or after this time (rule setting, default 21:00)
    const lateThreshold: string = lateDutyThreshold(rules);

    // Consecutive Working Days (Hard Rule H2)
    const consecutiveDaysRule = resolveRule(
      rules,
      'MAX_CONSECUTIVE_DAYS',
      'rule-h2',
      ['consecutive duties', 'consecutive working days', 'consecutive days'],
      LATE_DUTY_RULE_WORDS
    );
    // Switched off: no limit. SOFT: only a scoring penalty (see below), not a hard stop.
    const consecutiveDaysEnabled = consecutiveDaysRule ? consecutiveDaysRule.enabled !== false : true;
    const maxConsecutiveDays = consecutiveDaysEnabled
      ? consecutiveDaysRule?.value
        ? consecutiveDaysRule.value
        : 6
      : Number.POSITIVE_INFINITY;
    const consecutiveDaysSeverity = consecutiveDaysRule?.severity || 'HARD';

    // Minimum Rest Between Duties (Hard Rule H3)
    const minRestRule = resolveRule(rules, 'MIN_REST_HOURS', 'rule-h3', [
      'rest between duties',
      'minimum rest',
    ]);
    // Enforced as a hard limit only when the rule is on and HARD (0 = no limit).
    const minRestEnabled = minRestRule ? minRestRule.enabled !== false : true;
    const minRestSeverity = minRestRule?.severity || 'HARD';
    const minRestHoursRequired =
      minRestEnabled && minRestSeverity === 'HARD' ? (minRestRule?.value ?? 11) : 0;

    const nurseClinicRole = roles.find(
      (r) => r.id === 'role-nurse-clinic' || r.acronym === 'NC' || r.name.toLowerCase().includes('nurse clinic')
    ) || {
      id: 'role-nurse-clinic',
      name: 'Nurse Clinic',
      acronym: 'NC',
      description: 'Dedicated nurse-led clinic (triage, dressings, vitals & injections) — independent of doctor sessions',
      defaultDailyQuota: 1,
      defaultStartTime: '09:00',
      defaultEndTime: '17:00',
    };

    if (!schedule || !schedule.startDate || !schedule.endDate) {
      return {
        scheduleId: schedule?.id || '',
        assignments: [],
        createdCount: 0,
        preservedLocksCount: 0,
        preservedManualCount: 0,
        unmetSlotsCount: 0,
        generationDurationMs: 0,
      };
    }

    // Date range
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    const totalDays =
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const datesList: IsoDateString[] = [];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      datesList.push(d.toISOString().split('T')[0]);
    }

    // Retained assignments map: key = `${nurseId}_${date}`
    const resultAssignmentsMap = new Map<string, Assignment>();
    let preservedLocksCount = 0;
    let preservedManualCount = 0;

    // Filter existing assignments based on mode
    if (mode === 'CLEAR_GENERATED') {
      existingAssignments.forEach((a) => {
        if (a.source === 'LOCK' || a.source === 'MANUAL') {
          resultAssignmentsMap.set(`${a.nurseId}_${a.date}`, a);
          if (a.source === 'LOCK') preservedLocksCount++;
          if (a.source === 'MANUAL') preservedManualCount++;
        }
      });
      return {
        scheduleId: schedule.id,
        assignments: Array.from(resultAssignmentsMap.values()),
        createdCount: 0,
        preservedLocksCount,
        preservedManualCount,
        unmetSlotsCount: 0,
        generationDurationMs: Math.round(performance.now() - startTimeMs),
      };
    }

    if (mode === 'GENERATE_ALL' && keepManual) {
      existingAssignments.forEach((a) => {
        if (a.source === 'MANUAL') {
          resultAssignmentsMap.set(`${a.nurseId}_${a.date}`, a);
          preservedManualCount++;
        }
      });
    }

    if (mode === 'EMPTY_ONLY' || mode === 'REBALANCE') {
      existingAssignments.forEach((a) => {
        if (a.source === 'LOCK') {
          resultAssignmentsMap.set(`${a.nurseId}_${a.date}`, a);
          preservedLocksCount++;
        } else if (a.source === 'MANUAL') {
          resultAssignmentsMap.set(`${a.nurseId}_${a.date}`, a);
          preservedManualCount++;
        } else if (mode === 'EMPTY_ONLY' && a.source === 'GENERATED') {
          // A generated shift that now falls on approved leave or a day off lock is dropped
          const onLeave = leaveEntries.some((le) => le.nurseId === a.nurseId && le.approved && a.date >= le.startDate && a.date <= le.endDate);
          const dayOff = locks.some((l) => l.nurseId === a.nurseId && l.date === a.date && l.mode === 'OFF');
          if (!onLeave && !dayOff) resultAssignmentsMap.set(`${a.nurseId}_${a.date}`, a);
        }
      });
    }

    // 2. Lock Pass: Materialize all LockEntry(ASSIGNMENT)
    const activeLocks = locks.filter(
      (l) => l.date >= schedule.startDate && l.date <= schedule.endDate
    );
    activeLocks.forEach((lock) => {
      const key = `${lock.nurseId}_${lock.date}`;
      if (lock.mode === 'ASSIGNMENT' && lock.dutyWindowId) {
        const lockAssignment: Assignment = {
          id: `asgn-lock-${schedule.id}-${lock.nurseId}-${lock.date}`,
          scheduleId: schedule.id,
          nurseId: lock.nurseId,
          date: lock.date,
          dutyWindowId: lock.dutyWindowId,
          kind: lock.assignmentKind || 'SPECIALTY',
          doctorId: lock.assignmentKind === 'DOCTOR' ? lock.targetRefId : undefined,
          clinicalRoleId: lock.assignmentKind === 'CLINICAL_ROLE' ? lock.targetRefId : undefined,
          specialtyId: lock.assignmentKind === 'SPECIALTY' ? lock.targetRefId : undefined,
          locked: true,
          source: 'LOCK',
          note: lock.note || 'Pinned by schedule lock',
        };
        // Count a pinned shift once, even when it was also kept from before
        if (resultAssignmentsMap.get(key)?.source !== 'LOCK') preservedLocksCount++;
        resultAssignmentsMap.set(key, lockAssignment);
      }
    });

    // 3. Clinic setup, the previous roster and quick lookups
    const clinic = resolveClinicSetup(clinicSetup);
    const openHours = openingHourSlots(clinic);
    const dutyMapGlobal = new Map(dutyWindows.map((d) => [d.id, d]));
    // Sorted once (start, end, id) so ties never depend on the order shifts were saved in.
    const activeDuties = dutyWindows
      .filter((d) => d.active !== false)
      .sort((a, b) => a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime) || a.id.localeCompare(b.id));
    const nurseMap = new Map(sortedNurses.map((n) => [n.id, n]));

    // Shifts of the roster just before this one: read only, used by the rules that look back.
    const priorMap = new Map<string, Assignment>();
    clinic.priorAssignments.forEach((a) => {
      if (a.date < schedule.startDate) priorMap.set(`${a.nurseId}_${a.date}`, a);
    });
    const shiftOn = (nurseId: string, date: string): Assignment | undefined =>
      resultAssignmentsMap.get(`${nurseId}_${date}`) || priorMap.get(`${nurseId}_${date}`);
    const shiftDate = (date: string, days: number): string => {
      const [y, m, d] = date.split('-').map(Number);
      return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
    };

    const isOnApprovedLeave = (nurseId: string, date: string) =>
      leaveEntries.some((le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate);
    const hasDayOffLock = (nurseId: string, date: string) =>
      activeLocks.some((l) => l.nurseId === nurseId && l.date === date && l.mode === 'OFF');
    const isSenior = (nurse?: Nurse) => !!nurse && seniorLevelIds.has(nurse.seniorityLevelId);
    const isLate = (duty?: DutyWindow) => isLateDuty(duty, lateThreshold);

    // 4. Nurse state
    const nurseStates = new Map<string, NurseDayState>();
    sortedNurses.forEach((nurse) => {
      // Only the leave days inside this schedule count (shared hours rule)
      const nurseLeaveHours = nurseLeaveHoursInRange(nurse.id, leaveEntries, leaveTypes, schedule.startDate, schedule.endDate);

      // Retained (pinned, hand set) shifts are committed up front and not counted again on their day.
      let initialPreservedDutyHours = 0;
      let initialWeekendsWorked = 0;
      resultAssignmentsMap.forEach((asgn) => {
        if (asgn.nurseId === nurse.id && asgn.date >= schedule.startDate && asgn.date <= schedule.endDate) {
          // A kept shift on an approved leave day isn't counted: the leave already is (shared hours rule).
          const onLeave = leaveEntries.some(
            (le) => le.nurseId === nurse.id && le.approved && asgn.date >= le.startDate && asgn.date <= le.endDate
          );
          if (!onLeave) initialPreservedDutyHours += calculateDutyDurationHours(dutyMapGlobal.get(asgn.dutyWindowId));
          if (isWeekendDate(asgn.date)) initialWeekendsWorked++;
        }
      });

      nurseStates.set(nurse.id, {
        hasDuty: false,
        consecutiveWorkingDays: 0,
        consecutiveLateEnds: 0,
        totalDutyHoursEarned: initialPreservedDutyHours,
        leaveHoursCredited: nurseLeaveHours,
        initialLockedHours: initialPreservedDutyHours,
        weekendsWorked: initialWeekendsWorked,
        holidaysWorked: 0,
        nurseClinicCount: 0,
      });
    });

    // Each nurse's goal (contract share of the full time target, minus leave) and hard ceiling.
    const nurseTargetMap = new Map<string, { contractTarget: number; dutyTarget: number; maxAllowedHours: number }>();
    sortedNurses.forEach((nurse) => {
      const contractTarget = Math.round(effectiveFullTimeTarget * (nurse.contractPercent / 100));
      const leaveHours = nurseStates.get(nurse.id)?.leaveHoursCredited || 0;
      const dutyTarget = Math.max(0, contractTarget - leaveHours);
      // The ceiling allows one shift's worth over the goal at most (8h, or the H7 tolerance if smaller)
      const maxAllowed = Math.max(dutyTarget, Math.min(dutyTarget + 8, Math.round(dutyTarget * maxHoursToleranceRatio)));
      nurseTargetMap.set(nurse.id, { contractTarget, dutyTarget, maxAllowedHours: maxAllowed });
    });

    /**
     * Pacing: by the end of day N a nurse should have worked about N/total of
     * her goal, so hours are spread evenly over the period instead of being
     * used up in the first weeks. Positive = behind pace (needs hours).
     */
    const hoursBehindPace = (nurseId: string, dayIdx: number): number => {
      const target = nurseTargetMap.get(nurseId)?.dutyTarget ?? 0;
      const pace = (target * (dayIdx + 1)) / Math.max(1, totalDays);
      return pace - (nurseStates.get(nurseId)?.totalDutyHoursEarned ?? 0);
    };

    /**
     * Hours a shift would take a nurse over her goal (0 when it fits). Optional
     * shifts (floats, an extra senior) must fit; a job that must be covered
     * (a doctor, the free nurse, a holiday) may go over only when nobody who
     * fits is available, and never past the hours limit (H7).
     */
    const hoursOverGoal = (nurseId: string, extraHours: number): number => {
      const target = nurseTargetMap.get(nurseId)?.dutyTarget ?? 0;
      return Math.max(0, (nurseStates.get(nurseId)?.totalDutyHoursEarned ?? 0) + extraHours - target);
    };
    const overGoalPenalty = (nurseId: string, extraHours: number): number => {
      const over = hoursOverGoal(nurseId, extraHours);
      return over > 0 ? 300 + over * 20 : 0;
    };

    let createdCount = 0;
    let unmetSlotsCount = 0;
    let doctorSessionsTotal = 0;
    let doctorPriority1PairingsCount = 0;
    let doctorPriority2PairingsCount = 0;
    let doctorPriority3PlusPairingsCount = 0;
    let doctorSpecialtyPairingsCount = 0;
    let doctorFallbackPairingsCount = 0;

    // Consecutive working days ending the day before `date` (this roster and the previous one)
    const getConsecutiveDaysWorkedEndingYesterday = (nurseId: string, date: string): number => {
      const lookback = Math.min(Number.isFinite(maxConsecutiveDays) ? maxConsecutiveDays : 31, 31);
      let run = 0;
      for (let i = 1; i <= lookback && shiftOn(nurseId, shiftDate(date, -i)); i++) run++;
      return run;
    };
    // Consecutive working days already fixed right after `date` (pinned or hand set shifts)
    const getConsecutiveDaysFixedFromTomorrow = (nurseId: string, date: string): number => {
      let run = 0;
      for (let i = 1; i <= 31 && resultAssignmentsMap.has(`${nurseId}_${shiftDate(date, i)}`); i++) run++;
      return run;
    };
    const getConsecutiveLateDutiesEndingYesterday = (nurseId: string, date: string): number => {
      let run = 0;
      for (let i = 1; i <= maxConsecutiveLate + 2; i++) {
        const prev = shiftOn(nurseId, shiftDate(date, -i));
        if (!prev || !isLate(dutyMapGlobal.get(prev.dutyWindowId))) break;
        run++;
      }
      return run;
    };
    const getConsecutiveLateFixedFromTomorrow = (nurseId: string, date: string): number => {
      let run = 0;
      for (let i = 1; i <= maxConsecutiveLate + 2; i++) {
        const next = resultAssignmentsMap.get(`${nurseId}_${shiftDate(date, i)}`);
        if (!next || !isLate(dutyMapGlobal.get(next.dutyWindowId))) break;
        run++;
      }
      return run;
    };
    const restHoursBetween = (prevEnd: string, nextStart: string) => (24 * 60 - toMinutes(prevEnd) + toMinutes(nextStart)) / 60;

    /**
     * Every hard rule for giving `nurse` the shift `duty` on `date`, looking
     * both back (this roster and the previous one) and forward (shifts already
     * fixed later in this roster). `extraHours` is what the change adds to her
     * total (the whole shift, or the difference when a shift is extended).
     */
    const fitsHardRules = (
      nurse: Nurse,
      date: string,
      duty: DutyWindow,
      extraHours: number,
      opts: { replacingOwnShift?: boolean } = {}
    ): boolean => {
      if (!opts.replacingOwnShift && resultAssignmentsMap.has(`${nurse.id}_${date}`)) return false; // H4
      if (isOnApprovedLeave(nurse.id, date) || hasDayOffLock(nurse.id, date)) return false; // H5

      // H2: max consecutive working days, counting the run on both sides of this day
      if (consecutiveDaysSeverity === 'HARD' && Number.isFinite(maxConsecutiveDays)) {
        const run = getConsecutiveDaysWorkedEndingYesterday(nurse.id, date) + 1 + getConsecutiveDaysFixedFromTomorrow(nurse.id, date);
        if (run > maxConsecutiveDays) return false;
      }

      // H3: minimum rest after yesterday's shift and before tomorrow's fixed shift
      if (minRestHoursRequired > 0) {
        const yesterday = shiftOn(nurse.id, shiftDate(date, -1));
        const yDuty = yesterday ? dutyMapGlobal.get(yesterday.dutyWindowId) : undefined;
        if (yDuty && restHoursBetween(yDuty.endTime, duty.startTime) < minRestHoursRequired) return false;
        const tomorrow = resultAssignmentsMap.get(`${nurse.id}_${shiftDate(date, 1)}`);
        const tDuty = tomorrow ? dutyMapGlobal.get(tomorrow.dutyWindowId) : undefined;
        if (tDuty && restHoursBetween(duty.endTime, tDuty.startTime) < minRestHoursRequired) return false;
      }

      // H7: hours ceiling
      const limits = nurseTargetMap.get(nurse.id);
      const state = nurseStates.get(nurse.id);
      if (maxHoursEnabled && maxHoursSeverity === 'HARD' && limits && state && state.totalDutyHoursEarned + extraHours > limits.maxAllowedHours) {
        return false;
      }

      // S1: max consecutive late duties, both sides of this day
      if (consecutiveLateEnabled && consecutiveLateSeverity === 'HARD' && isLate(duty)) {
        const run = getConsecutiveLateDutiesEndingYesterday(nurse.id, date) + 1 + getConsecutiveLateFixedFromTomorrow(nurse.id, date);
        if (run > maxConsecutiveLate) return false;
      }
      return true;
    };

    /** Records a new shift for a nurse and updates her counters. */
    const placeShift = (asgn: Assignment, isWeekend: boolean, isHoliday: boolean, isNurseClinic: boolean) => {
      resultAssignmentsMap.set(`${asgn.nurseId}_${asgn.date}`, asgn);
      createdCount++;
      const state = nurseStates.get(asgn.nurseId);
      const duty = dutyMapGlobal.get(asgn.dutyWindowId);
      if (!state) return;
      state.totalDutyHoursEarned += calculateDutyDurationHours(duty);
      state.lastDutyEndTime = duty ? `${asgn.date} ${duty.endTime}` : state.lastDutyEndTime;
      if (isWeekend) state.weekendsWorked += 1;
      if (isHoliday) state.holidaysWorked += 1;
      if (isNurseClinic) state.nurseClinicCount += 1;
    };

    /** Takes a generated shift away again (used when a senior takes it over). */
    const keptFromBefore = new Set(Array.from(resultAssignmentsMap.values()).map((a) => a.id));
    const removeShift = (asgn: Assignment, isWeekend: boolean) => {
      resultAssignmentsMap.delete(`${asgn.nurseId}_${asgn.date}`);
      if (!keptFromBefore.has(asgn.id)) createdCount = Math.max(0, createdCount - 1);
      const state = nurseStates.get(asgn.nurseId);
      if (!state) return;
      state.totalDutyHoursEarned = Math.max(0, state.totalDutyHoursEarned - calculateDutyDurationHours(dutyMapGlobal.get(asgn.dutyWindowId)));
      if (isWeekend) state.weekendsWorked = Math.max(0, state.weekendsWorked - 1);
      if (asgn.kind === 'CLINICAL_ROLE' && asgn.clinicalRoleId === nurseClinicRole.id) {
        state.nurseClinicCount = Math.max(0, state.nurseClinicCount - 1);
      }
    };

    /** Duties ordered by how much of [start, end) they cover, then shortest first. */
    const dutiesCovering = (start: string, end: string): DutyWindow[] =>
      [...activeDuties]
        .filter((d) => coveredMinutes(d, start, end) > 0)
        .sort((a, b) => {
          const cover = coveredMinutes(b, start, end) - coveredMinutes(a, start, end);
          if (cover !== 0) return cover;
          return calculateDutyDurationHours(a) - calculateDutyDurationHours(b);
        });

    // A small, stable number per nurse and day, so ties go to a different nurse on different days
    // instead of always to the first name in the alphabet.
    const tieOrder = (nurseId: string, date: string): number => {
      let h = 2166136261;
      const text = `${date}|${nurseId}`;
      for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    };

    // Build quick lookup for doctor -> set of specialtyIds
    const doctorSpecialtiesMap = new Map<string, Set<string>>();
    doctors.forEach((doc) => {
      if (doc.specialtyIds) doctorSpecialtiesMap.set(doc.id, new Set(doc.specialtyIds));
    });
    sessions.forEach((s) => {
      if (s.doctorId && s.specialtyId) {
        if (!doctorSpecialtiesMap.has(s.doctorId)) doctorSpecialtiesMap.set(s.doctorId, new Set());
        doctorSpecialtiesMap.get(s.doctorId)!.add(s.specialtyId);
      }
    });

    const specialtyMatchesPref = (prefRefId: string, spec: Specialty | undefined | null): boolean => {
      if (!spec) return false;
      const p = prefRefId.toLowerCase();
      const code = spec.code.toLowerCase();
      return (
        prefRefId === spec.id ||
        p === code ||
        p === spec.name.toLowerCase() ||
        (code === 'pcc' && p.includes('pcc')) ||
        (code === 'ped' && (p.includes('ped') || p.includes('pedia')))
      );
    };

    // H8: a nurse with doctor or specialty allocations in her profile only works with those.
    const isNurseAllocatedToDoctorOrSpecialty = (
      nurse: Nurse,
      targetDoctorId?: string,
      targetSpecialtyId?: string,
      directDocSpecialtyIds?: string[]
    ): boolean => {
      const hasSpecificAllocations = nurse.preferences?.some((p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY');
      if (!hasSpecificAllocations) return true; // unrestricted clinic nurse
      if (targetDoctorId && nurse.preferences?.some((p) => p.kind === 'DOCTOR' && p.refId === targetDoctorId)) return true;
      const candidateSpecIds = new Set<string>();
      if (targetSpecialtyId) candidateSpecIds.add(targetSpecialtyId);
      directDocSpecialtyIds?.forEach((sid) => candidateSpecIds.add(sid));
      if (targetDoctorId) doctorSpecialtiesMap.get(targetDoctorId)?.forEach((sid) => candidateSpecIds.add(sid));
      for (const pref of nurse.preferences || []) {
        if (pref.kind !== 'SPECIALTY') continue;
        if (candidateSpecIds.has(pref.refId)) return true;
        for (const sid of candidateSpecIds) {
          if (specialtyMatchesPref(pref.refId, specialties.find((s) => s.id === sid))) return true;
        }
      }
      return false;
    };

    const canWorkWithDoctor = (nurse: Nurse, doctorId: string, session?: DoctorSession): boolean => {
      if (!nurse.isClinicNurse || isExclusiveNurseClinic(nurse, roles)) return false;
      const docObj = doctors.find((d) => d.id === doctorId);
      const docSpecId = session?.specialtyId || docObj?.specialtyIds?.[0];
      return isNurseAllocatedToDoctorOrSpecialty(nurse, doctorId, docSpecId, docObj?.specialtyIds);
    };

    const ncRoleIds = new Set([nurseClinicRole.id, 'role-nurse-clinic']);
    const isNurseClinicAssignment = (a: Assignment) => a.kind === 'CLINICAL_ROLE' && !!a.clinicalRoleId && ncRoleIds.has(a.clinicalRoleId);

    // Hours each day needs whatever happens (a nurse for each doctor and the free nurse,
    // or the one holiday nurse), less the hours of shifts already fixed on that day, and
    // how busy the day is (its number of doctors). Used to keep hours back for later days.
    const shortestCoverHours = (start: string, end: string): number => hoursToCover(start, end, activeDuties);
    const shortestShiftHours = Math.min(...activeDuties.map((d) => calculateDutyDurationHours(d)), 24);
    const longestShiftHours = Math.max(...activeDuties.map((d) => calculateDutyDurationHours(d)), 0);
    const fixedHoursByDate = new Map<string, number>();
    // Only fixed shifts that do a needed job (a doctor or the free nurse) reduce that day's need
    resultAssignmentsMap.forEach((a) => {
      if (a.kind !== 'DOCTOR' && !(a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId && (ncRoleIds.has(a.clinicalRoleId) || a.clinicalRoleId === bloodCollectionRole(roles)?.id))) return;
      fixedHoursByDate.set(a.date, (fixedHoursByDate.get(a.date) || 0) + calculateDutyDurationHours(dutyMapGlobal.get(a.dutyWindowId)));
    });
    const dayNeedHours: number[] = [];
    const dayFreeNurseHours: number[] = []; // the part only a blood collection nurse can do
    const dayBusyness: number[] = [];
    datesList.forEach((d) => {
      const openDayHours = shortestCoverHours(clinic.openTime, clinic.closeTime);
      if (clinic.holidays.has(d)) {
        dayNeedHours.push(Math.max(0, openDayHours - (fixedHoursByDate.get(d) || 0)));
        dayFreeNurseHours.push(0);
        dayBusyness.push(0);
        return;
      }
      dayFreeNurseHours.push(ncEnabled || plusOneEnabled ? openDayHours : 0);
      const doctorsThatDay = new Map<string, DoctorSession>();
      sessions.filter((x) => !x.cancelled && x.date === d).forEach((x) => {
        if (!doctorsThatDay.has(x.doctorId)) doctorsThatDay.set(x.doctorId, x);
      });
      let need = ncEnabled || plusOneEnabled ? openDayHours : 0;
      doctorsThatDay.forEach((x) => (need += shortestCoverHours(x.startTime, x.endTime)));
      dayNeedHours.push(Math.max(0, need - (fixedHoursByDate.get(d) || 0)));
      dayBusyness.push(doctorsThatDay.size);
    });

    /**
     * Hours each nurse should keep for the later sessions of doctors who rank her first:
     * she is their nurse, so other work must leave room for them (one session a day at
     * most, and none on her leave, day off locks or public holidays).
     */
    const firstChoiceHoursFrom = new Map<string, number[]>();
    sortedNurses.forEach((n) => {
      const firstChoiceDoctors = new Set((n.preferences || []).filter((p) => p.kind === 'DOCTOR' && p.rank === 1).map((p) => p.refId));
      const perDay = datesList.map((d) => {
        if (firstChoiceDoctors.size === 0 || clinic.holidays.has(d) || !inFill(d)) return 0;
        if (isOnApprovedLeave(n.id, d) || hasDayOffLock(n.id, d)) return 0;
        const sess = sessions.find((x) => !x.cancelled && x.date === d && firstChoiceDoctors.has(x.doctorId));
        return sess ? shortestCoverHours(sess.startTime, sess.endTime) : 0;
      });
      // suffix sums: hours needed from day k (inclusive) to the end
      const fromDay = new Array(datesList.length + 1).fill(0);
      for (let k = datesList.length - 1; k >= 0; k--) fromDay[k] = fromDay[k + 1] + perDay[k];
      firstChoiceHoursFrom.set(n.id, fromDay);
    });
    /** Hours to keep for her first choice doctors after today. */
    const keepForFirstChoiceAfter = (nurseId: string, dayIdx: number): number =>
      firstChoiceHoursFrom.get(nurseId)?.[dayIdx + 1] ?? 0;

    /**
     * Spare hours that may go on extra shifts today. The nurses' remaining hours are
     * compared with what all later days still need (plus a 10% safety margin); only
     * the surplus is spare. It is shared over today and the later days by how busy
     * each day is, so the busiest days get the most extra help. With
     * onlyBloodCollection the same is done for the nurses qualified for blood
     * collection against the free nurse hours later days need, so they aren't
     * used up on extras.
     */
    const spareHoursForToday = (
      dayIdx: number,
      group: 'all' | 'bloodCollection' | 'senior' = 'all',
      rawSpare = false
    ): number => {
      const onlyBloodCollection = group === 'bloodCollection';
      // Only whole shifts count: a nurse with 4 hours left can't work a 6 hour shift.
      let remaining = 0;
      sortedNurses.forEach((n) => {
        if (onlyBloodCollection && !canBeFreeNurse(n, roles)) return;
        if (group === 'senior' && !isSenior(n)) return;
        const target = nurseTargetMap.get(n.id)?.dutyTarget ?? 0;
        const left = Math.max(0, target - (nurseStates.get(n.id)?.totalDutyHoursEarned ?? 0));
        remaining += shortestShiftHours > 0 ? left - (left % shortestShiftHours) : left;
      });
      let laterNeed = 0;
      for (let k = dayIdx + 1; k < datesList.length; k++) {
        if (!inFill(datesList[k])) continue;
        // a senior is needed every day: count one shortest shift a day for the seniors
        laterNeed += group === 'senior' ? (seniorRuleEnabled ? shortestShiftHours : 0) : onlyBloodCollection ? dayFreeNurseHours[k] : dayNeedHours[k];
      }
      const spare = remaining - laterNeed * 1.1;
      if (rawSpare) return spare;
      if (spare <= 0) return 0;
      let weightLeft = 0;
      for (let k = dayIdx; k < datesList.length; k++) {
        if (!clinic.holidays.has(datesList[k]) && inFill(datesList[k])) weightLeft += Math.max(1, dayBusyness[k]);
      }
      if (weightLeft === 0) return 0;
      return (spare * Math.max(1, dayBusyness[dayIdx])) / weightLeft;
    };

    // 5. Day by day
    for (let dayIdx = 0; dayIdx < datesList.length; dayIdx++) {
      const date = datesList[dayIdx];
      const isWeekend = isWeekendDate(date);
      const isHoliday = clinic.holidays.has(date);

      if (onProgress && dayIdx % 5 === 0) {
        onProgress({
          currentDay: dayIdx + 1,
          totalDays,
          currentDate: date,
          statusText: `Filling day ${dayIdx + 1} of ${totalDays}…`,
          percent: Math.round(((dayIdx + 1) / totalDays) * 100),
        });
        await new Promise((resolve) => setTimeout(resolve, 8));
      }
      if (!inFill(date)) continue;

      // Nurses in a fresh, fair order for today (used for ties)
      const dayOrder = [...sortedNurses].sort((a, b) => tieOrder(a.id, date) - tieOrder(b.id, date));
      const existingToday = () => Array.from(resultAssignmentsMap.values()).filter((a) => a.date === date);

      // Retained shifts today count toward today's counters
      existingToday().forEach((asgn) => {
        const state = nurseStates.get(asgn.nurseId);
        if (state && isNurseClinicAssignment(asgn)) state.nurseClinicCount += 1;
      });

      // 5.0 Public holiday: one nurse covers the clinic for the opening hours (two when no
      // single shift covers them); doctor sessions are ignored.
      if (isHoliday) {
        for (let attempt = 0; attempt < 3; attempt++) {
          const todaysDuties = existingToday()
            .map((a) => dutyMapGlobal.get(a.dutyWindowId))
            .filter((d): d is DutyWindow => !!d);
          const gaps = uncoveredParts(clinic.openTime, clinic.closeTime, todaysDuties);
          if (gaps.length === 0) break;
          const gapMinutes = (d: DutyWindow) => gaps.reduce((sum, g) => sum + coveredMinutes(d, g.start, g.end), 0);
          let best: { nurse: Nurse; duty: DutyWindow; score: number } | null = null;
          for (const duty of activeDuties) {
            const cover = gapMinutes(duty);
            if (cover === 0) continue;
            const hours = calculateDutyDurationHours(duty);
            for (const nurse of dayOrder) {
              if (!fitsHardRules(nurse, date, duty, hours)) continue;
              let score = cover / 6 - hours * 2; // cover the most uncovered time with the shortest shift
              if (isSenior(nurse) && !existingToday().some((a) => isSenior(nurseMap.get(a.nurseId)))) score += 60;
              if (canBeFreeNurse(nurse, roles)) score += 30;
              score += hoursBehindPace(nurse.id, dayIdx) * 1.5;
              score -= (nurseStates.get(nurse.id)?.holidaysWorked || 0) * 40; // share holidays out
              score -= overGoalPenalty(nurse.id, hours);
              if (!best || score > best.score) best = { nurse, duty, score };
            }
          }
          if (!best) {
            unmetSlotsCount++;
            break;
          }
          placeShift(
            {
              id: `asgn-gen-${schedule.id}-${best.nurse.id}-${date}-HOL`,
              scheduleId: schedule.id,
              nurseId: best.nurse.id,
              date,
              dutyWindowId: best.duty.id,
              kind: 'CLINICAL_ROLE',
              clinicalRoleId: nurseClinicRole.id,
              locked: false,
              source: 'GENERATED',
              note: 'Public holiday cover (on call doctor)',
              ...(canBeFreeNurse(best.nurse, roles) ? {} : { clinicalRoleId: 'role-float' }),
            },
            isWeekend,
            true,
            true
          );
        }
        continue;
      }

      // 5.1 Today's jobs
      const coveredDoctorIds = new Set(existingToday().filter((a) => a.kind === 'DOCTOR' && a.doctorId).map((a) => a.doctorId!));
      // One session per doctor, chosen the same way as the checker does.
      const allDaySessions: DoctorSession[] = doctorSessionsOn(sessions, date);
      const daySessions = allDaySessions
        .filter((s) => !coveredDoctorIds.has(s.doctorId))
        .sort((a, b) => b.endTime.localeCompare(a.endTime)); // late ending sessions first

      const daySlots: InternalSlot[] = [];
      daySessions.forEach((sess) => {
        const docSpecialty = specialties.find((s) => s.id === sess.specialtyId);
        const hasPriority1Nurse = sortedNurses.some((n) =>
          n.preferences?.some(
            (p) =>
              (p.kind === 'DOCTOR' && p.refId === sess.doctorId && p.rank === 1) ||
              (p.kind === 'SPECIALTY' && specialtyMatchesPref(p.refId, docSpecialty) && p.rank === 1)
          )
        );
        daySlots.push({
          date,
          kind: 'DOCTOR',
          targetId: sess.doctorId,
          startTime: sess.startTime,
          endTime: sess.endTime,
          priority: sess.endTime >= '19:00' ? 130 : hasPriority1Nurse ? 125 : 120,
        });
      });

      // The free nurse (Nurse Clinic and blood collection together), for the opening hours
      const coveredFree = existingToday().filter(
        (a) => isNurseClinicAssignment(a) || (a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId === bloodCollectionRole(roles)?.id)
      ).length;
      if (ncEnabled) {
        for (let q = coveredFree; q < ncQuota; q++) {
          daySlots.push({
            date,
            kind: 'CLINICAL_ROLE',
            targetId: nurseClinicRole.id,
            startTime: clinic.openTime,
            endTime: clinic.closeTime,
            // The free nurse is chosen before the doctors, so doctors can't use up every
            // blood collection nurse (her score keeps doctors' preferred nurses for them).
            priority: 140,
          });
        }
      }
      // Other roles the clinic has set up (blood collection is part of the free nurse's job)
      const phl = bloodCollectionRole(roles);
      roles.forEach((role) => {
        if (ncRoleIds.has(role.id) || role.acronym === 'NC' || role.name.toLowerCase().includes('nurse clinic')) return;
        if (ncEnabled && phl && role.id === phl.id) return;
        const roleCovered = existingToday().filter((a) => a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId === role.id).length;
        for (let q = roleCovered; q < (role.defaultDailyQuota || 1); q++) {
          daySlots.push({
            date,
            kind: 'CLINICAL_ROLE',
            targetId: role.id,
            startTime: role.defaultStartTime || clinic.openTime,
            endTime: role.defaultEndTime || clinic.closeTime,
            priority: 90,
          });
        }
      });
      daySlots.sort((a, b) => b.priority - a.priority);

      // 5.2 Fill each job
      for (const slot of daySlots) {
        const isNurseClinicSlot = slot.kind === 'CLINICAL_ROLE' && ncRoleIds.has(slot.targetId);
        const slotSession = slot.kind === 'DOCTOR' ? daySessions.find((s) => s.doctorId === slot.targetId) : undefined;
        const { priorityTier, fallbackTier } = SchedulingEngine.partitionCandidateDuties(slot, dutyWindows);
        const tiersToEvaluate: DutyWindow[][] = [priorityTier, fallbackTier].filter((t) => t.length > 0);
        if (tiersToEvaluate.length === 0) tiersToEvaluate.push([fullDayDuty]);

        let candidateCohorts: { tierRank: number; nurses: Nurse[] }[];
        if (slot.kind === 'DOCTOR') {
          const docSpecialtyId = slotSession?.specialtyId;
          const docSpecialty = docSpecialtyId ? specialties.find((s) => s.id === docSpecialtyId) : null;
          const prefersDoctor = (n: Nurse, rank?: (r: number) => boolean) =>
            !!n.preferences?.some((p) => p.kind === 'DOCTOR' && p.refId === slot.targetId && (!rank || rank(p.rank)));
          const prefersSpec = (n: Nurse, rank?: (r: number) => boolean) =>
            !!docSpecialtyId &&
            !!n.preferences?.some((p) => p.kind === 'SPECIALTY' && (!rank || rank(p.rank)) && specialtyMatchesPref(p.refId, docSpecialty));
          // Exact preference order: every rank is its own group, so rank 3 always comes before
          // rank 4, and rank 4 before rank 5 (then specialty ranks the same way, then everyone else).
          const doctorRank = (n: Nurse) =>
            Math.min(...(n.preferences || []).filter((p) => p.kind === 'DOCTOR' && p.refId === slot.targetId).map((p) => p.rank));
          const specRank = (n: Nurse) =>
            Math.min(...(n.preferences || []).filter((p) => p.kind === 'SPECIALTY' && specialtyMatchesPref(p.refId, docSpecialty)).map((p) => p.rank));
          const byRank = (nurses: Nurse[], rankOf: (n: Nurse) => number, tierOf: (rank: number) => number) => {
            const ranks = [...new Set(nurses.map(rankOf))].sort((a, b) => a - b);
            return ranks.map((r) => ({ tierRank: tierOf(r), nurses: nurses.filter((n) => rankOf(n) === r) }));
          };
          const withDoctorPref = dayOrder.filter((n) => prefersDoctor(n));
          const withSpecPref = docSpecialtyId ? dayOrder.filter((n) => !prefersDoctor(n) && prefersSpec(n)) : [];
          candidateCohorts = [
            ...byRank(withDoctorPref, doctorRank, (r) => Math.min(r, 3)),
            ...byRank(withSpecPref, specRank, (r) => (r === 1 ? 4 : 5)),
            { tierRank: 6, nurses: dayOrder.filter((n) => !prefersDoctor(n) && !(docSpecialtyId && prefersSpec(n))) },
          ];
        } else {
          const role = roles.find((r) => r.id === slot.targetId);
          const matchesRole = (p: NursePreference, rank?: number) =>
            p.kind === 'CLINICAL_ROLE' &&
            (rank === undefined || p.rank === rank) &&
            (p.refId === slot.targetId || (!!role && (p.refId.toLowerCase() === role.acronym.toLowerCase() || p.refId.toLowerCase() === role.name.toLowerCase())));
          const roleRank = (n: Nurse) => Math.min(...(n.preferences || []).filter((p) => matchesRole(p)).map((p) => p.rank));
          const withRolePref = dayOrder.filter((n) => n.preferences?.some((p) => matchesRole(p)));
          const roleRanks = [...new Set(withRolePref.map(roleRank))].sort((a, b) => a - b);
          candidateCohorts = [
            ...roleRanks.map((r) => ({ tierRank: Math.min(r, 3), nurses: withRolePref.filter((n) => roleRank(n) === r) })),
            { tierRank: 4, nurses: dayOrder.filter((n) => !n.preferences?.some((p) => matchesRole(p)) && n.capabilityIds.includes(slot.targetId)) },
            { tierRank: 5, nurses: dayOrder.filter((n) => !n.preferences?.some((p) => matchesRole(p)) && !n.capabilityIds.includes(slot.targetId)) },
          ];
        }

        let bestNurse: Nurse | null = null;
        let chosenDuty: DutyWindow = fullDayDuty;
        let matchedPairingTier = 0;

        /** The best nurse in one group for one set of duties (null when nobody fits). */
        const bestInCohort = (
          cohort: { nurses: Nurse[] },
          tier: DutyWindow[],
          withinGoalOnly = false,
          respectOtherDoctors = false
        ): { nurse: Nurse; duty: DutyWindow } | null => {
            let tierBestScore = -Infinity;
            let tierBest: { nurse: Nurse; duty: DutyWindow } | null = null;

            for (const candidateDuty of tier) {
              // A doctor's nurse must overlap the session (partial cover is accepted)
              if (slot.kind === 'DOCTOR' && !overlaps(candidateDuty.startTime, candidateDuty.endTime, slot.startTime, slot.endTime)) continue;

              for (const nurse of cohort.nurses) {
                // Who may take this job
                if (slot.kind === 'DOCTOR' && !canWorkWithDoctor(nurse, slot.targetId, slotSession)) continue;
                if (isNurseClinicSlot && !canBeFreeNurse(nurse, roles)) continue; // must do blood collection too
                if (slot.kind === 'CLINICAL_ROLE' && !isNurseClinicSlot) {
                  const role = roles.find((r) => r.id === slot.targetId);
                  if (role?.acronym === 'PHL' && !nurse.capabilityIds.includes(role.id)) continue; // H6
                }
                const shiftHours = calculateDutyDurationHours(candidateDuty);
                if (withinGoalOnly) {
                  // Within her hours, keeping enough for her first choice doctors' later sessions
                  // (unless this job is one of them).
                  const isFirstChoiceJob =
                    slot.kind === 'DOCTOR' && !!nurse.preferences?.some((p) => p.kind === 'DOCTOR' && p.refId === slot.targetId && p.rank === 1);
                  const keep = isFirstChoiceJob ? 0 : keepForFirstChoiceAfter(nurse.id, dayIdx);
                  if (hoursOverGoal(nurse.id, shiftHours + keep) > 0) continue;
                }
                if (respectOtherDoctors && slot.kind === 'DOCTOR') {
                  // Leave her for another doctor today who ranks her higher and still needs a nurse
                  const myRank = Math.min(Infinity, ...(nurse.preferences || []).filter((p) => p.kind === 'DOCTOR' && p.refId === slot.targetId).map((p) => p.rank));
                  const filledToday = new Set(existingToday().filter((a) => a.kind === 'DOCTOR' && a.doctorId).map((a) => a.doctorId!));
                  const wantedElsewhere = (nurse.preferences || []).some(
                    (p) =>
                      p.kind === 'DOCTOR' &&
                      p.refId !== slot.targetId &&
                      p.rank < myRank &&
                      !filledToday.has(p.refId) &&
                      daySessions.some((x) => x.doctorId === p.refId)
                  );
                  if (wantedElsewhere) continue;
                }
                if (!fitsHardRules(nurse, date, candidateDuty, shiftHours)) continue;

                const state = nurseStates.get(nurse.id)!;
                const limits = nurseTargetMap.get(nurse.id);
                let score = 0;

                // How much of the job the shift covers
                const slotMinutes = Math.max(1, toMinutes(slot.endTime) - toMinutes(slot.startTime));
                const coverShare = coveredMinutes(candidateDuty, slot.startTime, slot.endTime) / slotMinutes;
                score += coverShare >= 1 ? 40 : coverShare * 20;
                // Hours beyond the job are wasted from her budget: the shortest shift that covers it wins
                score -= Math.max(0, shiftHours - slotMinutes / 60) * 6;

                // Pacing: prefer not to bring a nurse up to the consecutive days limit
                if (getConsecutiveDaysWorkedEndingYesterday(nurse.id, date) >= maxConsecutiveDays - 1) {
                  score -= 60;
                }

                if (isNurseClinicSlot) {
                  if (isExclusiveNurseClinic(nurse, roles)) score += 200;
                  score -= state.nurseClinicCount * 25;
                  const ncPref = nurse.preferences?.find((p) => p.kind === 'CLINICAL_ROLE' && ncRoleIds.has(p.refId));
                  if (ncPref) score += ncPref.rank === 1 ? 40 : 20;
                  // Keep nurses for the doctors who rank them today (more so for a higher rank)
                  const todaysRanks = (nurse.preferences || [])
                    .filter((p) => p.kind === 'DOCTOR' && daySessions.some((x) => x.doctorId === p.refId))
                    .map((p) => p.rank);
                  if (todaysRanks.length > 0) score -= Math.max(40, 160 - 20 * Math.min(...todaysRanks));
                  else if (nurse.preferences?.some((p) => p.kind === 'DOCTOR')) score -= 20;
                }

                if (slot.kind === 'DOCTOR') {
                  const pref = nurse.preferences?.find((p) => p.kind === 'DOCTOR' && p.refId === slot.targetId);
                  const docSpecialty = slotSession ? specialties.find((s) => s.id === slotSession.specialtyId) : null;
                  const specPref = nurse.preferences?.find((p) => p.kind === 'SPECIALTY' && specialtyMatchesPref(p.refId, docSpecialty));
                  if (pref) score += pref.rank === 1 ? 80 : pref.rank === 2 ? 40 : 20;
                  else if (specPref) score += specPref.rank === 1 ? 70 : specPref.rank === 2 ? 35 : 15;

                  // Keep nurses whose first choice is another doctor working today for that doctor
                  const otherFirstChoices = daySessions.filter((other) => {
                    if (other.doctorId === slot.targetId) return false;
                    const otherSpec = specialties.find((s) => s.id === other.specialtyId);
                    return nurse.preferences?.some(
                      (p) =>
                        p.rank === 1 &&
                        ((p.kind === 'DOCTOR' && p.refId === other.doctorId) || (p.kind === 'SPECIALTY' && specialtyMatchesPref(p.refId, otherSpec)))
                    );
                  }).length;
                  score -= 50 * otherFirstChoices;
                } else if (!isNurseClinicSlot) {
                  const role = roles.find((r) => r.id === slot.targetId);
                  const rolePref = nurse.preferences?.find(
                    (p) =>
                      p.kind === 'CLINICAL_ROLE' &&
                      (p.refId === slot.targetId || (!!role && (p.refId.toLowerCase() === role.acronym.toLowerCase() || p.refId.toLowerCase() === role.name.toLowerCase())))
                  );
                  if (rolePref) score += rolePref.rank === 1 ? 80 : rolePref.rank === 2 ? 40 : 20;
                }

                // Hours: favour nurses behind their pace; anyone this shift would take over
                // her goal comes last (she is used only when nobody else can cover the job)
                score += hoursBehindPace(nurse.id, dayIdx) * 1.5;
                score -= overGoalPenalty(nurse.id, shiftHours);
                if (limits && state.totalDutyHoursEarned >= limits.dutyTarget) score -= 150;

                // Weekend fairness
                if (isWeekend) score -= state.weekendsWorked * 25;

                // SOFT late duty limit
                if (consecutiveLateEnabled && isLate(candidateDuty)) {
                  const lateRun = getConsecutiveLateDutiesEndingYesterday(nurse.id, date);
                  if (lateRun >= maxConsecutiveLate) score -= 150;
                  else if (lateRun >= maxConsecutiveLate - 1) score -= 50;
                }

                // A senior helps meet the one senior a day rule
                if (isSenior(nurse)) score += 10;

                if (candidateDuty.isPriority) score += 30;
                score += (candidateDuty.priorityRank ?? 100) * 0.05;

                if (score > tierBestScore) {
                  tierBestScore = score;
                  tierBest = { nurse, duty: candidateDuty };
                }
              }
            }
            return tierBest;
        };

        if (slot.kind === 'DOCTOR') {
          // A free nurse at every opening hour is a hard rule and a doctor's preference is not:
          // when the blood collection nurses' hours are running short, they go to a doctor
          // only if no other nurse can take the doctor.
          const keepBloodCollection =
            !!bloodCollectionRole(roles) &&
            (ncEnabled || plusOneEnabled) &&
            // a margin of two long shifts, since each doctor job takes a whole shift from them
            spareHoursForToday(dayIdx, 'bloodCollection', true) <= 2 * longestShiftHours;
          const cohortSets = keepBloodCollection
            ? [
                candidateCohorts.map((c) => ({ ...c, nurses: c.nurses.filter((n) => !canBeFreeNurse(n, roles)) })),
                candidateCohorts,
              ]
            : [candidateCohorts];
          // Full cover first: the best ranked nurse who can cover the whole session gets the
          // doctor. A shorter shift is accepted only when nobody can cover all of it.
          const overlapping = activeDuties.filter((d) => overlaps(d.startTime, d.endTime, slot.startTime, slot.endTime));
          const fullCover = overlapping.filter((d) => d.startTime <= slot.startTime && d.endTime >= slot.endTime);
          const partialCover = overlapping.filter((d) => !fullCover.includes(d));
          // Nurses who stay within their hours come first, in rank order (a lower ranked nurse
          // who lists this doctor before anyone unlisted); someone goes over her hours only
          // when nobody else can take the doctor.
          // A nurse another doctor today ranks higher is left for that doctor at first.
          coverage: for (const withinGoalOnly of [true, false]) for (const respectOtherDoctors of [true, false]) for (const cohortsToTry of cohortSets) for (const duties of [fullCover, partialCover]) {
            if (duties.length === 0) continue;
            for (const cohort of cohortsToTry) {
              if (cohort.nurses.length === 0) continue;
              const found = bestInCohort(cohort, duties, withinGoalOnly, respectOtherDoctors);
              if (found) {
                bestNurse = found.nurse;
                chosenDuty = found.duty;
                matchedPairingTier = cohort.tierRank;
                break coverage;
              }
            }
          }
        } else {
          // Nurses within their hours first (a preference never takes someone over her goal
          // while another nurse could do the job). For Nurse Clinic, a nurse who is the first
          // choice of a doctor working today (and not yet paired) is kept for that doctor while
          // someone else can run Nurse Clinic.
          const filledDoctorsToday = () =>
            new Set(existingToday().filter((a) => a.kind === 'DOCTOR' && a.doctorId).map((a) => a.doctorId!));
          const firstChoiceOfOpenDoctor = (n: Nurse) => {
            const filled = filledDoctorsToday();
            return (n.preferences || []).some(
              (p) => p.kind === 'DOCTOR' && p.rank === 1 && !filled.has(p.refId) && daySessions.some((x) => x.doctorId === p.refId)
            );
          };
          cohorts: for (const withinGoalOnly of [true, false])
            for (const keepForDoctors of isNurseClinicSlot ? [true, false] : [false])
              for (const cohort of candidateCohorts) {
                const nurses = keepForDoctors ? cohort.nurses.filter((n) => !firstChoiceOfOpenDoctor(n)) : cohort.nurses;
                if (nurses.length === 0) continue;
                for (const tier of tiersToEvaluate) {
                  const found = bestInCohort({ nurses }, tier, withinGoalOnly);
                  if (found) {
                    bestNurse = found.nurse;
                    chosenDuty = found.duty;
                    matchedPairingTier = cohort.tierRank;
                    break cohorts;
                  }
                }
              }
        }

        if (slot.kind === 'DOCTOR') doctorSessionsTotal++;
        if (!bestNurse) {
          unmetSlotsCount++;
          continue;
        }

        placeShift(
          {
            id: `asgn-gen-${schedule.id}-${bestNurse.id}-${date}-${slot.kind}${isNurseClinicSlot ? '-nc' : ''}`,
            scheduleId: schedule.id,
            nurseId: bestNurse.id,
            date,
            dutyWindowId: chosenDuty.id,
            kind: slot.kind,
            doctorId: slot.kind === 'DOCTOR' ? slot.targetId : undefined,
            clinicalRoleId: slot.kind === 'CLINICAL_ROLE' ? slot.targetId : undefined,
            specialtyId: slot.kind === 'SPECIALTY' ? slot.targetId : undefined,
            locked: false,
            source: 'GENERATED',
            note: isNurseClinicSlot ? 'Nurse Clinic and blood collection (not with a doctor)' : undefined,
          },
          isWeekend,
          false,
          isNurseClinicSlot
        );

        if (slot.kind === 'DOCTOR') {
          if (matchedPairingTier === 1) doctorPriority1PairingsCount++;
          else if (matchedPairingTier === 2) doctorPriority2PairingsCount++;
          else if (matchedPairingTier === 3) doctorPriority3PlusPairingsCount++;
          else if (matchedPairingTier === 4 || matchedPairingTier === 5) doctorSpecialtyPairingsCount++;
          else doctorFallbackPairingsCount++;
        }
      }

      // 5.3 Free nurse at every opening hour (rule "additional nurse"): one nurse who is not
      // with a doctor at that hour and is qualified for blood collection.
      if (plusOneEnabled && minAdditionalNurses > 0) {
        const freeNursesDuring = (start: string, end: string) =>
          existingToday().filter(
            (a) => canBeFreeNurse(nurseMap.get(a.nurseId), roles) && isFreeDuring(a, dutyMapGlobal.get(a.dutyWindowId), allDaySessions, start, end)
          ).length;
        const uncoveredHours = () => openHours.filter((h) => freeNursesDuring(h.start, h.end) < minAdditionalNurses);

        for (let attempt = 0; attempt < 6; attempt++) {
          const gaps = uncoveredHours();
          if (gaps.length === 0) break;
          const gap = gaps[0];
          let fixed = false;

          // A: stretch a generated free nurse's shift over the gap (a longer duty that keeps her hours)
          const stretchable = existingToday()
            .filter((a) => a.source === 'GENERATED' && !a.locked && a.kind !== 'DOCTOR' && canBeFreeNurse(nurseMap.get(a.nurseId), roles))
            .sort((a, b) => hoursBehindPace(b.nurseId, dayIdx) - hoursBehindPace(a.nurseId, dayIdx));
          for (const asgn of stretchable) {
            const nurse = nurseMap.get(asgn.nurseId);
            const oldDuty = dutyMapGlobal.get(asgn.dutyWindowId);
            if (!nurse || !oldDuty) continue;
            const longer = activeDuties
              .filter((d) => d.startTime <= oldDuty.startTime && d.endTime >= oldDuty.endTime && d.id !== oldDuty.id && overlaps(d.startTime, d.endTime, gap.start, gap.end))
              .sort((a, b) => calculateDutyDurationHours(a) - calculateDutyDurationHours(b))[0];
            if (!longer) continue;
            const added = calculateDutyDurationHours(longer) - calculateDutyDurationHours(oldDuty);
            if (hoursOverGoal(nurse.id, added) > 0) continue; // stretching is optional: stay within her goal
            if (!fitsHardRules(nurse, date, longer, added, { replacingOwnShift: true })) continue;
            resultAssignmentsMap.set(`${asgn.nurseId}_${date}`, {
              ...asgn,
              dutyWindowId: longer.id,
              note: asgn.note ? `${asgn.note} (extended to keep a free nurse on duty)` : 'Extended to keep a free nurse on duty',
            });
            const state = nurseStates.get(asgn.nurseId);
            if (state) {
              state.totalDutyHoursEarned += Math.max(0, added);
              state.lastDutyEndTime = `${date} ${longer.endTime}`;
            }
            fixed = true;
            break;
          }
          if (fixed) continue;

          // B: add another qualified nurse, on the duty that covers the most uncovered hours
          const gapCover = (d: DutyWindow) => gaps.filter((h) => overlaps(d.startTime, d.endTime, h.start, h.end)).length;
          const duties = activeDuties
            .filter((d) => overlaps(d.startTime, d.endTime, gap.start, gap.end))
            .sort((a, b) => gapCover(b) - gapCover(a) || calculateDutyDurationHours(a) - calculateDutyDurationHours(b));
          let added: { nurse: Nurse; duty: DutyWindow; score: number } | null = null;
          for (const duty of duties) {
            for (const nurse of dayOrder) {
              if (!canBeFreeNurse(nurse, roles)) continue;
              if (!fitsHardRules(nurse, date, duty, calculateDutyDurationHours(duty))) continue;
              let score = gapCover(duty) * 20 + hoursBehindPace(nurse.id, dayIdx) * 1.5;
              score -= overGoalPenalty(nurse.id, calculateDutyDurationHours(duty));
              if (isExclusiveNurseClinic(nurse, roles)) score += 50;
              if (isWeekend) score -= (nurseStates.get(nurse.id)?.weekendsWorked || 0) * 25;
              if (!added || score > added.score) added = { nurse, duty, score };
            }
          }
          if (!added) break; // nobody qualified is free: the validator will flag the gap
          placeShift(
            {
              id: `asgn-gen-${schedule.id}-${added.nurse.id}-${date}-free`,
              scheduleId: schedule.id,
              nurseId: added.nurse.id,
              date,
              dutyWindowId: added.duty.id,
              kind: 'CLINICAL_ROLE',
              clinicalRoleId: nurseClinicRole.id,
              locked: false,
              source: 'GENERATED',
              note: 'Free nurse (Nurse Clinic and blood collection)',
            },
            isWeekend,
            false,
            true
          );
        }
      }

      // 5.4 At least one senior nurse on duty today (any shift)
      if (seniorRuleEnabled && !existingToday().some((a) => isSenior(nurseMap.get(a.nurseId)))) {
        const seniors = dayOrder
          .filter((n) => isSenior(n) && !resultAssignmentsMap.has(`${n.id}_${date}`))
          // Even a SOFT consecutive days rule is kept here: this pass adds or moves shifts by choice.
          .filter(
            (n) =>
              getConsecutiveDaysWorkedEndingYesterday(n.id, date) + 1 + getConsecutiveDaysFixedFromTomorrow(n.id, date) <=
              maxConsecutiveDays
          )
          .sort((a, b) => hoursBehindPace(b.id, dayIdx) - hoursBehindPace(a.id, dayIdx));

        // A: when there are spare hours, a senior who needs hours joins as an extra nurse
        // (nobody loses a shift)
        let done = false;
        const seniorBudget = spareHoursForToday(dayIdx);
        for (const senior of seniors) {
          if (hoursBehindPace(senior.id, dayIdx) <= 0) break;
          const duty = dutiesCovering(clinic.openTime, clinic.closeTime).find(
            (d) =>
              calculateDutyDurationHours(d) <= seniorBudget &&
              hoursOverGoal(senior.id, calculateDutyDurationHours(d)) === 0 &&
              fitsHardRules(senior, date, d, calculateDutyDurationHours(d))
          );
          if (!duty) continue;
          const free = canBeFreeNurse(senior, roles);
          placeShift(
            {
              id: `asgn-gen-${schedule.id}-${senior.id}-${date}-SENIOR`,
              scheduleId: schedule.id,
              nurseId: senior.id,
              date,
              dutyWindowId: duty.id,
              kind: 'CLINICAL_ROLE',
              clinicalRoleId: free ? nurseClinicRole.id : 'role-float',
              locked: false,
              source: 'GENERATED',
              note: 'Senior nurse on duty',
            },
            isWeekend,
            false,
            free
          );
          done = true;
          break;
        }

        // B: otherwise a senior takes over a generated junior's job; the junior may still float
        // later. Jobs not tied to a doctor are tried first; a doctor's job only when the senior
        // ranks at least as high for that doctor as the nurse she replaces.
        if (!done) {
          const rankFor = (n: Nurse | undefined, doctorId?: string) =>
            Math.min(Infinity, ...((n?.preferences || []).filter((p) => p.kind === 'DOCTOR' && p.refId === doctorId).map((p) => p.rank)));
          const juniorShifts = existingToday()
            .filter((a) => a.source === 'GENERATED' && !a.locked)
            .sort((a, b) => (a.kind === 'DOCTOR' ? 1 : 0) - (b.kind === 'DOCTOR' ? 1 : 0));
          // Seniors who stay within their goal are tried first
          const bySpareHours = [...seniors].sort((a, b) => hoursOverGoal(a.id, 8) - hoursOverGoal(b.id, 8));
          outer: for (const senior of bySpareHours) {
            for (const asgn of juniorShifts) {
              const duty = dutyMapGlobal.get(asgn.dutyWindowId);
              if (!duty) continue;
              if (asgn.kind === 'DOCTOR' && asgn.doctorId) {
                if (!canWorkWithDoctor(senior, asgn.doctorId, allDaySessions.find((s) => s.doctorId === asgn.doctorId))) continue;
                if (rankFor(senior, asgn.doctorId) > rankFor(nurseMap.get(asgn.nurseId), asgn.doctorId)) continue;
              }
              if (asgn.kind === 'SPECIALTY') {
                if (!senior.isClinicNurse || isExclusiveNurseClinic(senior, roles)) continue;
                if (!isNurseAllocatedToDoctorOrSpecialty(senior, undefined, asgn.specialtyId)) continue;
              }
              if (isNurseClinicAssignment(asgn) && !canBeFreeNurse(senior, roles)) continue;
              if (asgn.kind === 'CLINICAL_ROLE' && asgn.clinicalRoleId) {
                const role = roles.find((r) => r.id === asgn.clinicalRoleId);
                if (role?.acronym === 'PHL' && !senior.capabilityIds.includes(role.id)) continue;
              }
              if (!fitsHardRules(senior, date, duty, calculateDutyDurationHours(duty))) continue;
              removeShift(asgn, isWeekend);
              placeShift(
                { ...asgn, id: `asgn-gen-${schedule.id}-${senior.id}-${date}-H1SWAP`, nurseId: senior.id },
                isWeekend,
                false,
                isNurseClinicAssignment(asgn)
              );
              done = true;
              break outer;
            }
          }
        }

        // C: nothing to swap (e.g. every shift today was set by hand): add a senior anyway,
        // within the hours limit, since a senior on duty is required.
        if (!done) {
          for (const senior of [...seniors].sort((a, b) => hoursOverGoal(a.id, 8) - hoursOverGoal(b.id, 8))) {
            const duty = dutiesCovering(clinic.openTime, clinic.closeTime).find((d) => fitsHardRules(senior, date, d, calculateDutyDurationHours(d)));
            if (!duty) continue;
            const free = canBeFreeNurse(senior, roles);
            placeShift(
              {
                id: `asgn-gen-${schedule.id}-${senior.id}-${date}-SENIOR`,
                scheduleId: schedule.id,
                nurseId: senior.id,
                date,
                dutyWindowId: duty.id,
                kind: 'CLINICAL_ROLE',
                clinicalRoleId: free ? nurseClinicRole.id : 'role-float',
                locked: false,
                source: 'GENERATED',
                note: 'Senior nurse on duty',
              },
              isWeekend,
              false,
              free
            );
            break;
          }
        }
      }

      // 5.5 Float shifts: extra help only from spare hours (see spareHoursForToday), so
      // hours are kept back for later days. Nurses furthest behind their pace go first.
      // A nurse may finish a few hours under her goal; floats never take her over it.
      let floatBudget = spareHoursForToday(dayIdx);
      const needsPhlReserve = !!bloodCollectionRole(roles);
      let phlFloatBudget = needsPhlReserve ? spareHoursForToday(dayIdx, 'bloodCollection') : Infinity;
      let seniorFloatBudget = spareHoursForToday(dayIdx, 'senior');

      // 5.5a A doctor still only partly covered gets a second nurse for the hours her first
      // nurse can't cover. Partial cover is acceptable, so this comes after the free nurse
      // and the senior nurse, and works like a float: from today's spare hours only, within
      // the nurse's goal, keeping the blood collection and senior reserves.
      for (const sess of allDaySessions) {
        const linked = existingToday().filter((a) => a.kind === 'DOCTOR' && a.doctorId === sess.doctorId);
        if (linked.length === 0) continue; // no nurse at all: nothing to extend
        const gaps = uncoveredParts(
          sess.startTime,
          sess.endTime,
          linked.map((a) => dutyMapGlobal.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d)
        );
        for (const gap of gaps) {
          let best: { nurse: Nurse; duty: DutyWindow; score: number } | null = null;
          for (const duty of activeDuties) {
            const cover = coveredMinutes(duty, gap.start, gap.end);
            if (cover === 0) continue;
            const hours = calculateDutyDurationHours(duty);
            if (hours > floatBudget) continue;
            for (const nurse of dayOrder) {
              if (!canWorkWithDoctor(nurse, sess.doctorId, sess)) continue;
              if (needsPhlReserve && canBeFreeNurse(nurse, roles) && hours > phlFloatBudget) continue;
              if (isSenior(nurse) && hours > seniorFloatBudget) continue;
              if (hoursOverGoal(nurse.id, hours + keepForFirstChoiceAfter(nurse.id, dayIdx)) > 0) continue;
              if (!fitsHardRules(nurse, date, duty, hours)) continue;
              const pref = nurse.preferences?.find((p) => p.kind === 'DOCTOR' && p.refId === sess.doctorId);
              let score = cover; // cover as much of the gap as possible
              score -= hours * 2; // with the shortest shift that does it
              if (pref) score += Math.max(0, 60 - pref.rank * 10);
              score += hoursBehindPace(nurse.id, dayIdx) * 1.5;
              if (!best || score > best.score) best = { nurse, duty, score };
            }
          }
          if (!best) continue; // nobody spare: partial cover stays (the checker shows it)
          const bestHours = calculateDutyDurationHours(best.duty);
          floatBudget -= bestHours;
          if (needsPhlReserve && canBeFreeNurse(best.nurse, roles)) phlFloatBudget -= bestHours;
          if (isSenior(best.nurse)) seniorFloatBudget -= bestHours;
          const doctorName = doctors.find((d) => d.id === sess.doctorId)?.fullName || 'the doctor';
          placeShift(
            {
              id: `asgn-gen-${schedule.id}-${best.nurse.id}-${date}-DOCTOR-gap`,
              scheduleId: schedule.id,
              nurseId: best.nurse.id,
              date,
              dutyWindowId: best.duty.id,
              kind: 'DOCTOR',
              doctorId: sess.doctorId,
              locked: false,
              source: 'GENERATED',
              note: `Second nurse with ${doctorName} for ${gap.start}–${gap.end}`,
            },
            isWeekend,
            false,
            false
          );
        }
      }

      const floatOrder = [...dayOrder].sort((a, b) => hoursBehindPace(b.id, dayIdx) - hoursBehindPace(a.id, dayIdx));
      for (const nurse of floatOrder) {
        if (floatBudget <= 0) break;
        if (resultAssignmentsMap.has(`${nurse.id}_${date}`)) continue;
        const state = nurseStates.get(nurse.id)!;
        const limits = nurseTargetMap.get(nurse.id);
        if (!limits || state.totalDutyHoursEarned >= limits.dutyTarget) continue;
        // Keep a one day margin under the consecutive days limit while the rule is on
        if (getConsecutiveDaysWorkedEndingYesterday(nurse.id, date) >= maxConsecutiveDays - 1) continue;

        // Floats are optional, so they must fit within her goal: longer shifts first, then shorter ones
        const byLength = (list: DutyWindow[]) => [...list].sort((a, b) => calculateDutyDurationHours(b) - calculateDutyDurationHours(a));
        const poolTiers = [byLength(activeDuties.filter((d) => d.isPriority)), byLength(activeDuties.filter((d) => !d.isPriority))];
        let selected: DutyWindow | null = null;
        for (const tier of poolTiers) {
          for (const cand of tier) {
            const hours = calculateDutyDurationHours(cand);
            if (hours > floatBudget) continue;
            if (needsPhlReserve && canBeFreeNurse(nurse, roles) && hours > phlFloatBudget) continue;
            if (isSenior(nurse) && hours > seniorFloatBudget) continue; // keep seniors' hours for later days
            if (hoursBehindPace(nurse.id, dayIdx) <= 0) continue; // ahead of her pace: no extra shift today
            if (hoursOverGoal(nurse.id, hours + keepForFirstChoiceAfter(nurse.id, dayIdx)) > 0) continue;
            if (!fitsHardRules(nurse, date, cand, hours)) continue;
            selected = cand;
            break;
          }
          if (selected) break;
        }
        if (!selected) continue;
        floatBudget -= calculateDutyDurationHours(selected);
        if (needsPhlReserve && canBeFreeNurse(nurse, roles)) phlFloatBudget -= calculateDutyDurationHours(selected);
        if (isSenior(nurse)) seniorFloatBudget -= calculateDutyDurationHours(selected);

        // A nurse with a specialty in her profile floats in that specialty, otherwise in the general pool.
        const canTakeSpecialty = nurse.isClinicNurse && !isExclusiveNurseClinic(nurse, roles);
        const specPref = canTakeSpecialty ? nurse.preferences?.find((p) => p.kind === 'SPECIALTY') : undefined;
        const spec = specPref ? specialties.find((s) => specialtyMatchesPref(specPref.refId, s)) : null;
        placeShift(
          {
            id: `asgn-gen-${schedule.id}-${nurse.id}-${date}-POOL`,
            scheduleId: schedule.id,
            nurseId: nurse.id,
            date,
            dutyWindowId: selected.id,
            kind: spec ? 'SPECIALTY' : 'CLINICAL_ROLE',
            specialtyId: spec ? spec.id : undefined,
            clinicalRoleId: spec ? undefined : 'role-float',
            locked: false,
            source: 'GENERATED',
            note: spec
              ? `${spec.name} Coverage / Float Pool (${selected.isPriority ? 'Priority' : 'Standard'})`
              : `General Clinic / Float Pool (${selected.isPriority ? 'Priority' : 'Standard'})`,
          },
          isWeekend,
          false,
          false
        );
      }
    }

    if (onProgress) {
      onProgress({
        currentDay: totalDays,
        totalDays,
        currentDate: schedule.endDate,
        statusText: 'Done.',
        percent: 100,
      });
    }

    return {
      scheduleId: schedule.id,
      assignments: Array.from(resultAssignmentsMap.values()),
      createdCount,
      preservedLocksCount,
      preservedManualCount,
      unmetSlotsCount,
      generationDurationMs: Math.round(performance.now() - startTimeMs),
      doctorSessionsTotal,
      doctorPriority1PairingsCount,
      doctorPriority2PairingsCount,
      doctorPriority3PlusPairingsCount,
      doctorSpecialtyPairingsCount,
      doctorFallbackPairingsCount,
      effectiveFullTimeTarget,
      periodName: resolvedPeriodName,
    };
  }
}
