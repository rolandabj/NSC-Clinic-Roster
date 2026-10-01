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
        phlebotomySlotsCount: 0,
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
      const missingRecurring = recurringSessions.filter(
        (s) => !existingKeySet.has(`${s.doctorId}_${s.date}_${s.startTime}`)
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
      eveningCoverageAlert = `Detected ${eveningSessions.length} evening doctor sessions ending up to 21:00. The engine will prioritize assigning nurses to Full Day (D 09:00-21:00) and Late (L 11:00-21:00) duties to avoid coverage gaps.`;
    }

    let staffingScaleWarning: string | undefined;
    if (nurses.length < doctors.length) {
      staffingScaleWarning = `You have ${nurses.length} active nurses but ${doctors.length} clinic doctors — expect pairing float or gaps on peak clinic days.`;
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
      phlebotomySlotsCount: totalDays * (roles.find((r) => r.acronym === 'PHL')?.defaultDailyQuota || 1),
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
    clinicSetup?: ClinicSetup
  ): Promise<GenerationResult> {
    const startTimeMs = performance.now();

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
    const consecutiveLateRule = resolveRule(rules, 'MAX_CONSECUTIVE_LATE_DUTIES', 'rule-s1', [
      'consecutive late',
      'consecutive night',
      'ending at 21:00',
      'late duties',
    ]);
    const maxConsecutiveLate = consecutiveLateRule?.value ? consecutiveLateRule.value : 3;
    const consecutiveLateSeverity = consecutiveLateRule?.severity || 'HARD';
    const consecutiveLateEnabled = consecutiveLateRule ? consecutiveLateRule.enabled !== false : true;
    // A duty "ends late" when it ends at or after this time (rule setting, default 21:00)
    const lateThreshold: string = (consecutiveLateRule?.params as any)?.thresholdTime || '21:00';

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

    if (mode === 'EMPTY_ONLY' || mode === 'REBALANCE') {
      existingAssignments.forEach((a) => {
        if (a.source === 'LOCK') {
          resultAssignmentsMap.set(`${a.nurseId}_${a.date}`, a);
          preservedLocksCount++;
        } else if (a.source === 'MANUAL') {
          resultAssignmentsMap.set(`${a.nurseId}_${a.date}`, a);
          preservedManualCount++;
        } else if (mode === 'EMPTY_ONLY' && a.source === 'GENERATED') {
          resultAssignmentsMap.set(`${a.nurseId}_${a.date}`, a);
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
          id: `asgn-lock-${lock.nurseId}-${lock.date}`,
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
        resultAssignmentsMap.set(key, lockAssignment);
        preservedLocksCount++;
      }
    });

    // 3. Clinic setup, the previous roster and quick lookups
    const clinic = resolveClinicSetup(clinicSetup);
    const openHours = openingHourSlots(clinic);
    const dutyMapGlobal = new Map(dutyWindows.map((d) => [d.id, d]));
    const activeDuties = dutyWindows.filter((d) => d.active !== false);
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
    const isLate = (duty?: DutyWindow) => !!duty && duty.endTime >= lateThreshold;

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
          initialPreservedDutyHours += calculateDutyDurationHours(dutyMapGlobal.get(asgn.dutyWindowId));
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
    const removeShift = (asgn: Assignment, isWeekend: boolean) => {
      resultAssignmentsMap.delete(`${asgn.nurseId}_${asgn.date}`);
      createdCount = Math.max(0, createdCount - 1);
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

    // Each nurse's fixed point (0 to 1) for when she floats, see the float pass
    const floatPhase = (nurseId: string): number => tieOrder(nurseId, 'float') / 4294967296;

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
          statusText: `Optimizing Day ${dayIdx + 1} of ${totalDays} (${date})...`,
          percent: Math.round(((dayIdx + 1) / totalDays) * 100),
        });
        await new Promise((resolve) => setTimeout(resolve, 8));
      }

      // Nurses in a fresh, fair order for today (used for ties)
      const dayOrder = [...sortedNurses].sort((a, b) => tieOrder(a.id, date) - tieOrder(b.id, date));
      const existingToday = () => Array.from(resultAssignmentsMap.values()).filter((a) => a.date === date);

      // Retained shifts today count toward today's counters
      existingToday().forEach((asgn) => {
        const state = nurseStates.get(asgn.nurseId);
        if (state && isNurseClinicAssignment(asgn)) state.nurseClinicCount += 1;
      });

      // 5.0 Public holiday: one nurse covers the clinic; doctor sessions are ignored.
      if (isHoliday) {
        if (existingToday().length === 0) {
          const holidayDuties = dutiesCovering(clinic.openTime, clinic.closeTime);
          let best: { nurse: Nurse; duty: DutyWindow; score: number } | null = null;
          for (const duty of holidayDuties) {
            for (const nurse of dayOrder) {
              if (!fitsHardRules(nurse, date, duty, calculateDutyDurationHours(duty))) continue;
              let score = coveredMinutes(duty, clinic.openTime, clinic.closeTime) / 6; // cover the opening hours first
              if (isSenior(nurse)) score += 60;
              if (canBeFreeNurse(nurse, roles)) score += 30;
              score += hoursBehindPace(nurse.id, dayIdx) * 1.5;
              score -= (nurseStates.get(nurse.id)?.holidaysWorked || 0) * 40; // share holidays out
              if (!best || score > best.score) best = { nurse, duty, score };
            }
          }
          if (best) {
            placeShift(
              {
                id: `asgn-gen-${best.nurse.id}-${date}-HOL`,
                scheduleId: schedule.id,
                nurseId: best.nurse.id,
                date,
                dutyWindowId: best.duty.id,
                kind: 'CLINICAL_ROLE',
                clinicalRoleId: nurseClinicRole.id,
                locked: false,
                source: 'GENERATED',
                note: 'Public holiday cover (on call doctor)',
              },
              isWeekend,
              true,
              true
            );
          } else {
            unmetSlotsCount++;
          }
        }
        continue;
      }

      // 5.1 Today's jobs
      const coveredDoctorIds = new Set(existingToday().filter((a) => a.kind === 'DOCTOR' && a.doctorId).map((a) => a.doctorId!));
      const allDaySessions: DoctorSession[] = [];
      const seenDoctors = new Set<string>();
      sessions
        .filter((s) => !s.cancelled && s.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .forEach((s) => {
          // Doctors work one session a day; a duplicate entry is ignored.
          if (seenDoctors.has(s.doctorId)) return;
          seenDoctors.add(s.doctorId);
          allDaySessions.push(s);
        });
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
            priority: ncSeverity === 'HARD' ? 110 : 75,
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
          candidateCohorts = [
            { tierRank: 1, nurses: dayOrder.filter((n) => prefersDoctor(n, (r) => r === 1)) },
            { tierRank: 2, nurses: dayOrder.filter((n) => prefersDoctor(n, (r) => r === 2)) },
            { tierRank: 3, nurses: dayOrder.filter((n) => prefersDoctor(n, (r) => r >= 3)) },
            { tierRank: 4, nurses: dayOrder.filter((n) => !prefersDoctor(n) && prefersSpec(n, (r) => r === 1)) },
            { tierRank: 5, nurses: dayOrder.filter((n) => !prefersDoctor(n) && !prefersSpec(n, (r) => r === 1) && prefersSpec(n)) },
            { tierRank: 6, nurses: dayOrder.filter((n) => !prefersDoctor(n) && !prefersSpec(n)) },
          ];
        } else {
          const role = roles.find((r) => r.id === slot.targetId);
          const matchesRole = (p: NursePreference, rank?: number) =>
            p.kind === 'CLINICAL_ROLE' &&
            (rank === undefined || p.rank === rank) &&
            (p.refId === slot.targetId || (!!role && (p.refId.toLowerCase() === role.acronym.toLowerCase() || p.refId.toLowerCase() === role.name.toLowerCase())));
          candidateCohorts = [
            { tierRank: 1, nurses: dayOrder.filter((n) => n.preferences?.some((p) => matchesRole(p, 1))) },
            { tierRank: 2, nurses: dayOrder.filter((n) => !n.preferences?.some((p) => matchesRole(p, 1)) && n.preferences?.some((p) => matchesRole(p, 2))) },
            { tierRank: 3, nurses: dayOrder.filter((n) => !n.preferences?.some((p) => matchesRole(p, 1) || matchesRole(p, 2)) && n.preferences?.some((p) => matchesRole(p))) },
            { tierRank: 4, nurses: dayOrder.filter((n) => !n.preferences?.some((p) => matchesRole(p)) && n.capabilityIds.includes(slot.targetId)) },
            { tierRank: 5, nurses: dayOrder.filter((n) => !n.preferences?.some((p) => matchesRole(p)) && !n.capabilityIds.includes(slot.targetId)) },
          ];
        }

        let bestNurse: Nurse | null = null;
        let chosenDuty: DutyWindow = fullDayDuty;
        let matchedPairingTier = 0;

        for (const cohort of candidateCohorts) {
          if (cohort.nurses.length === 0) continue;
          let cohortBest: { nurse: Nurse; duty: DutyWindow } | null = null;

          for (const tier of tiersToEvaluate) {
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
                if (!fitsHardRules(nurse, date, candidateDuty, shiftHours)) continue;

                const state = nurseStates.get(nurse.id)!;
                const limits = nurseTargetMap.get(nurse.id);
                let score = 0;

                // How much of the job the shift covers
                const slotMinutes = Math.max(1, toMinutes(slot.endTime) - toMinutes(slot.startTime));
                const coverShare = coveredMinutes(candidateDuty, slot.startTime, slot.endTime) / slotMinutes;
                score += coverShare >= 1 ? 40 : coverShare * 20;

                // Pacing: prefer not to bring a nurse up to the consecutive days limit
                if (getConsecutiveDaysWorkedEndingYesterday(nurse.id, date) >= maxConsecutiveDays - 1) {
                  score -= 60;
                }

                if (isNurseClinicSlot) {
                  if (isExclusiveNurseClinic(nurse, roles)) score += 200;
                  score -= state.nurseClinicCount * 25;
                  const ncPref = nurse.preferences?.find((p) => p.kind === 'CLINICAL_ROLE' && ncRoleIds.has(p.refId));
                  if (ncPref) score += ncPref.rank === 1 ? 40 : 20;
                  // Nurses with their own doctors are kept for doctor clinics
                  if (nurse.preferences?.some((p) => p.kind === 'DOCTOR')) score -= 50;
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

                // Hours: favour nurses behind their pace; a nurse who reached her goal comes last
                if (limits && state.totalDutyHoursEarned >= limits.dutyTarget) score -= 150;
                else score += hoursBehindPace(nurse.id, dayIdx) * 1.5;

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
            if (tierBest) {
              cohortBest = tierBest;
              break;
            }
          }

          if (cohortBest) {
            bestNurse = cohortBest.nurse;
            chosenDuty = cohortBest.duty;
            matchedPairingTier = cohort.tierRank;
            break;
          }
        }

        if (slot.kind === 'DOCTOR') doctorSessionsTotal++;
        if (!bestNurse) {
          unmetSlotsCount++;
          continue;
        }

        placeShift(
          {
            id: `asgn-gen-${bestNurse.id}-${date}-${slot.kind}${isNurseClinicSlot ? '-nc' : ''}`,
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
              if (isExclusiveNurseClinic(nurse, roles)) score += 50;
              if (isWeekend) score -= (nurseStates.get(nurse.id)?.weekendsWorked || 0) * 25;
              if (!added || score > added.score) added = { nurse, duty, score };
            }
            if (added) break; // best duty first
          }
          if (!added) break; // nobody qualified is free: the validator will flag the gap
          placeShift(
            {
              id: `asgn-gen-${added.nurse.id}-${date}-free`,
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

        // A: a senior who needs hours joins as an extra nurse (nobody loses a shift)
        let done = false;
        for (const senior of seniors) {
          if (hoursBehindPace(senior.id, dayIdx) <= 0) break;
          const duty = dutiesCovering(clinic.openTime, clinic.closeTime).find((d) => fitsHardRules(senior, date, d, calculateDutyDurationHours(d)));
          if (!duty) continue;
          const free = canBeFreeNurse(senior, roles);
          placeShift(
            {
              id: `asgn-gen-${senior.id}-${date}-SENIOR`,
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

        // B: otherwise a senior takes over a generated junior's job; the junior may still float later
        if (!done) {
          const juniorShifts = existingToday().filter((a) => a.source === 'GENERATED' && !a.locked);
          outer: for (const senior of seniors) {
            for (const asgn of juniorShifts) {
              const duty = dutyMapGlobal.get(asgn.dutyWindowId);
              if (!duty) continue;
              if (asgn.kind === 'DOCTOR' && asgn.doctorId) {
                if (!canWorkWithDoctor(senior, asgn.doctorId, allDaySessions.find((s) => s.doctorId === asgn.doctorId))) continue;
              }
              if (isNurseClinicAssignment(asgn) && !canBeFreeNurse(senior, roles)) continue;
              if (asgn.kind === 'CLINICAL_ROLE' && asgn.clinicalRoleId) {
                const role = roles.find((r) => r.id === asgn.clinicalRoleId);
                if (role?.acronym === 'PHL' && !senior.capabilityIds.includes(role.id)) continue;
              }
              if (!fitsHardRules(senior, date, duty, calculateDutyDurationHours(duty))) continue;
              removeShift(asgn, isWeekend);
              placeShift(
                { ...asgn, id: `asgn-gen-${senior.id}-${date}-H1SWAP`, nurseId: senior.id },
                isWeekend,
                false,
                isNurseClinicAssignment(asgn)
              );
              break outer;
            }
          }
        }
      }

      // 5.5 Float shifts: only for nurses who are behind their pace, so nobody falls short of
      // her hours goal and hours stay spread over the whole period.
      for (const nurse of dayOrder) {
        if (resultAssignmentsMap.has(`${nurse.id}_${date}`)) continue;
        const state = nurseStates.get(nurse.id)!;
        const limits = nurseTargetMap.get(nurse.id);
        if (!limits || state.totalDutyHoursEarned >= limits.dutyTarget) continue;
        // Keep a one day margin under the consecutive days limit while the rule is on
        if (getConsecutiveDaysWorkedEndingYesterday(nurse.id, date) >= maxConsecutiveDays - 1) continue;

        const poolTiers = [activeDuties.filter((d) => d.isPriority), activeDuties.filter((d) => !d.isPriority), [earlyDuty]];
        let selected: DutyWindow | null = null;
        for (const tier of poolTiers) {
          for (const cand of tier) {
            const hours = calculateDutyDurationHours(cand);
            // Behind pace by enough for this shift. Each nurse has her own fixed point
            // between 0 and one shift, so spare nurses don't all float on the same days;
            // on the last day anyone short by half a shift or more floats.
            const threshold = dayIdx === totalDays - 1 ? hours / 2 : hours * floatPhase(nurse.id);
            if (hoursBehindPace(nurse.id, dayIdx) < threshold) continue;
            if (maxHoursEnabled && state.totalDutyHoursEarned + hours > limits.maxAllowedHours) continue;
            if (!fitsHardRules(nurse, date, cand, hours)) continue;
            selected = cand;
            break;
          }
          if (selected) break;
        }
        if (!selected) continue;

        // A nurse with a specialty in her profile floats in that specialty, otherwise in the general pool.
        const canTakeSpecialty = nurse.isClinicNurse && !isExclusiveNurseClinic(nurse, roles);
        const specPref = canTakeSpecialty ? nurse.preferences?.find((p) => p.kind === 'SPECIALTY') : undefined;
        const spec = specPref ? specialties.find((s) => specialtyMatchesPref(specPref.refId, s)) : null;
        placeShift(
          {
            id: `asgn-gen-${nurse.id}-${date}-POOL`,
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
        statusText: 'Deterministic generation pass complete.',
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
