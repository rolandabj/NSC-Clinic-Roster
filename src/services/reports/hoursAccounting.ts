/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hours Accounting, Contract Proportions & Payroll Ledger Service (Phase 9)
 */

import { HoursHistory, NurseHoursBalance, countHoursInRange, dutyDurationHours, nurseContractShare, resolveNurseHoursBalance } from '../hours/hoursBalance';

import { isWeekendDay } from '../../utils/weekend';
import {
  Schedule,
  Assignment,
  Nurse,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  SeniorityLevel,
  Doctor,
  ClinicalRole,
  Specialty,
  NurseHoursQuota,
  WorkingHoursPeriod,
} from '../../types';
import { resolveFullTimeTarget, leaveCreditOnDate } from '../hours/hoursPolicy';

export type HoursAccountingStatus =
  | 'OPTIMAL'        // 90% - 110%
  | 'UNDER'          // 75% - 89%
  | 'CRITICAL_UNDER' // < 75%
  | 'OVER'           // 111% - 120%
  | 'CRITICAL_OVER'; // > 120%

export interface NurseDayTimelineEntry {
  date: string;
  dayIndex: number; // 1-31
  weekday: number;  // 0 = Sun, 6 = Sat
  weekdayName: string;
  isWeekend: boolean;
  type: 'DUTY' | 'LEAVE' | 'OFF';
  dutyWindow?: DutyWindow;
  assignment?: Assignment;
  doctor?: Doctor;
  clinicalRole?: ClinicalRole;
  specialty?: Specialty;
  leaveEntry?: LeaveEntry;
  leaveType?: LeaveType;
  hoursEarned: number;
  isCredited: boolean;
  notes?: string;
  source?: string;
}

export interface NurseHoursAccounting {
  balance: NurseHoursBalance;
  closingBalanceHours: number;
  nurse: Nurse;
  seniority?: SeniorityLevel;
  contractPercent: number;
  fullTimeTargetHours: number;
  targetHours: number;
  dutyHours: number;
  leaveHours: number;
  totalEarnedHours: number;
  varianceHours: number;
  pacePercent: number;
  status: HoursAccountingStatus;
  
  // Shift & Weekend Equity metrics
  totalShiftsCount: number;
  weekendShiftsCount: number;
  lateDutiesCount: number;
  dutyCountsByAcronym: Record<string, number>;
  
  // Leave Breakdown
  leaveBreakdown: Record<
    string,
    {
      leaveTypeId: string;
      name: string;
      acronym: string;
      color: string;
      daysCount: number;
      hoursCredited: number;
      countsTowardHoursTarget: boolean;
    }
  >;

  // Quota Balances
  quotas: Array<{
    leaveTypeId: string;
    leaveTypeName: string;
    annualQuotaDays?: number;
    usedDays?: number;
    remainingDays?: number;
    annualQuotaHours: number;
    usedHours: number;
    remainingHours: number;
  }>;

  // Day-by-Day Chronological Timesheet
  timeline: NurseDayTimelineEntry[];
}

export interface ClinicHoursMetrics {
  totalNurses: number;
  activeNurses: number;
  totalContractedTargetHours: number;
  totalDutyHoursWorked: number;
  totalLeaveHoursCredited: number;
  totalEarnedHours: number;
  clinicFulfillmentPercent: number;
  
  // Overtime and Deficit summaries
  totalOvertimeHours: number;
  totalDeficitHours: number;
  nursesInDeficitCount: number;
  nursesOnTrackCount: number;
  nursesInOvertimeCount: number;

  // Equity & Fairness metrics
  averageHoursPerFte: number;
  hoursFairnessIndex: number; // 0-100 score where 100 is perfectly equitable
  averageWeekendShiftsPerNurse: number;
  minWeekendShifts: number;
  maxWeekendShifts: number;
  weekendSpread: number; // max - min

  // Duty Window Distribution
  dutyTypeDistribution: Record<
    string,
    {
      dutyWindow: DutyWindow;
      shiftsCount: number;
      totalHours: number;
      percentageOfHours: number;
    }
  >;

  // Seniority Hours Distribution
  seniorityDistribution: Record<
    string,
    {
      seniority: SeniorityLevel;
      nursesCount: number;
      targetHours: number;
      earnedHours: number;
      fulfillmentPercent: number;
    }
  >;
}

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Calculates exact duty duration from duty window start & end times.
 */
export const calculateDutyDurationHours = dutyDurationHours;
export const contractShare = nurseContractShare;

export interface NurseHoursSummary {
  balance: NurseHoursBalance;
  closingBalanceHours: number;
  dutyHours: number;
  leaveHours: number;
  totalHours: number;
  targetHours: number;
  /** Total as a percent of the goal (can be above 100). */
  percent: number;
}

/**
 * The one rule for counting a nurse's hours, used by the grid, emails, PDF,
 * fairness and the checker (the Hours tab uses the same rule day by day):
 * - an approved leave day counts the leave's hours for that day, not a shift
 *   that may also be there;
 * - any other day counts one shift (duplicates once), by its real length;
 * - the goal is the full time target times the nurse's contract.
 * The range defaults to the whole roster.
 */
export function summarizeNurseHours(
  nurse: Pick<Nurse, 'id' | 'contractPercent'>,
  schedule: Pick<Schedule, 'startDate' | 'endDate' | 'hoursTargetFullTime' | 'periodName'>,
  assignments: Assignment[],
  dutyWindows: DutyWindow[] | Map<string, DutyWindow>,
  leaveEntries: LeaveEntry[],
  leaveTypes: LeaveType[] | Map<string, LeaveType>,
  workingHoursPeriods: WorkingHoursPeriod[] = [],
  range: { start: string; end: string } = { start: schedule.startDate, end: schedule.endDate },
  hoursHistory?: HoursHistory
): NurseHoursSummary {
  const tally = countHoursInRange(nurse.id, range.start, range.end, assignments, dutyWindows, leaveEntries, leaveTypes);
  const balance = resolveNurseHoursBalance(nurse, schedule as Schedule, dutyWindows, leaveEntries, leaveTypes, workingHoursPeriods, hoursHistory);
  const round1 = (n: number) => Math.round(n * 10) / 10;
  const totalHours = round1(tally.totalHours);
  return {
    dutyHours: round1(tally.dutyHours), leaveHours: round1(tally.leaveHours), totalHours,
    targetHours: balance.targetHours,
    percent: balance.targetHours > 0 ? Math.round(totalHours / balance.targetHours * 100) : 100,
    balance,
    closingBalanceHours: round1(balance.previousCreditedHours + totalHours - balance.cumulativeTargetHours),
  };
}

/**
 * Calculates hours accounting and complete timesheet timeline for a single nurse.
 */
export function calculateNurseHoursAccounting(
  nurse: Nurse,
  schedule: Schedule,
  assignments: Assignment[],
  dutyWindows: DutyWindow[],
  leaveEntries: LeaveEntry[],
  leaveTypes: LeaveType[],
  seniorityLevels: SeniorityLevel[],
  doctors: Doctor[],
  roles: ClinicalRole[],
  specialties: Specialty[],
  quotas: NurseHoursQuota[] = [],
  workingHoursPeriods: WorkingHoursPeriod[] = [],
  hoursHistory?: HoursHistory
): NurseHoursAccounting {
  const dutyMap = new Map(dutyWindows.map((d) => [d.id, d]));
  const leaveTypeMap = new Map(leaveTypes.map((l) => [l.id, l]));
  const seniorityMap = new Map(seniorityLevels.map((s) => [s.id, s]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d]));
  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const specialtyMap = new Map(specialties.map((s) => [s.id, s]));

  const seniority = seniorityMap.get(nurse.seniorityLevelId);
  // Shared rule, same as the engine and validator
  const fullTimeTargetHours = resolveFullTimeTarget(schedule, workingHoursPeriods).hours;
  const balance = resolveNurseHoursBalance(nurse, schedule, dutyWindows, leaveEntries, leaveTypes, workingHoursPeriods, hoursHistory);
  const targetHours = balance.targetHours;

  // Filter nurse assignments in schedule period
  const nurseAssignments = assignments.filter(
    (a) => a.nurseId === nurse.id && a.date >= schedule.startDate && a.date <= schedule.endDate
  );
  const asgnByDate = new Map<string, Assignment>();
  // One shift per day: the first one, as in summarizeNurseHours.
  nurseAssignments.forEach((a) => {
    if (!asgnByDate.has(a.date)) asgnByDate.set(a.date, a);
  });

  // Filter approved nurse leave entries overlapping schedule period
  const nurseLeaves = leaveEntries.filter(
    (le) =>
      le.nurseId === nurse.id &&
      le.approved &&
      !(le.endDate < schedule.startDate || le.startDate > schedule.endDate)
  );

  // Duty totals are counted from the day timeline below, so they always match
  // what the timeline shows (a leave day is not also a duty day, and a day
  // counts one duty even if it has duplicate assignments).
  let dutyHours = 0;
  let totalShiftsCount = 0;
  let weekendShiftsCount = 0;
  let lateDutiesCount = 0;
  const dutyCountsByAcronym: Record<string, number> = {};

  // Calculate leave hours and leave breakdown
  let leaveHours = 0;
  const leaveBreakdown: NurseHoursAccounting['leaveBreakdown'] = {};

  // Build day-by-day map of schedule dates
  const start = new Date(schedule.startDate);
  const end = new Date(schedule.endDate);
  const timeline: NurseDayTimelineEntry[] = [];

  let cur = new Date(start);
  let dayIndex = 1;

  while (cur <= end) {
    const dateStr = cur.toISOString().split('T')[0];
    const weekday = cur.getUTCDay();
    const isWeekend = isWeekendDay(weekday);

    const asgn = asgnByDate.get(dateStr);
    const leave = nurseLeaves.find((le) => dateStr >= le.startDate && dateStr <= le.endDate);

    let type: 'DUTY' | 'LEAVE' | 'OFF' = 'OFF';
    let hoursEarned = 0;
    let isCredited = false;
    let dutyWindow: DutyWindow | undefined;
    let leaveType: LeaveType | undefined;
    let doctor: Doctor | undefined;
    let clinicalRole: ClinicalRole | undefined;
    let specialty: Specialty | undefined;
    let notes = '';

    if (leave) {
      type = 'LEAVE';
      leaveType = leaveTypeMap.get(leave.leaveTypeId);
      // Hours this one day credits (an entry's hoursCredited is its total, spread over its days)
      const credits = Math.round(leaveCreditOnDate(leave, leaveType, dateStr) * 100) / 100;

      if (leaveType?.countsTowardHoursTarget !== false) {
        hoursEarned = credits;
        isCredited = true;
        leaveHours += credits;
      }

      if (leaveType) {
        if (!leaveBreakdown[leaveType.id]) {
          leaveBreakdown[leaveType.id] = {
            leaveTypeId: leaveType.id,
            name: leaveType.name,
            acronym: leaveType.acronym,
            color: leaveType.color,
            daysCount: 0,
            hoursCredited: 0,
            countsTowardHoursTarget: leaveType.countsTowardHoursTarget !== false,
          };
        }
        leaveBreakdown[leaveType.id].daysCount += 1;
        if (leaveType.countsTowardHoursTarget !== false) {
          leaveBreakdown[leaveType.id].hoursCredited += credits;
        }
      }
      notes = leave.note || leaveType?.name || 'Approved Leave';
    } else if (asgn) {
      type = 'DUTY';
      dutyWindow = dutyMap.get(asgn.dutyWindowId);
      hoursEarned = calculateDutyDurationHours(dutyWindow);
      isCredited = true;

      dutyHours += hoursEarned;
      totalShiftsCount += 1;
      if (isWeekend) weekendShiftsCount += 1;
      if (dutyWindow && dutyWindow.endTime >= '21:00') lateDutiesCount += 1;
      const acronym = dutyWindow?.acronym || 'D';
      dutyCountsByAcronym[acronym] = (dutyCountsByAcronym[acronym] || 0) + 1;

      if (asgn.doctorId) doctor = doctorMap.get(asgn.doctorId);
      if (asgn.clinicalRoleId) clinicalRole = roleMap.get(asgn.clinicalRoleId);
      if (asgn.specialtyId) specialty = specialtyMap.get(asgn.specialtyId);
      notes = asgn.note || '';
    }

    timeline.push({
      date: dateStr,
      dayIndex,
      weekday,
      weekdayName: WEEKDAY_NAMES[weekday],
      isWeekend,
      type,
      dutyWindow,
      assignment: asgn,
      doctor,
      clinicalRole,
      specialty,
      leaveEntry: leave,
      leaveType,
      hoursEarned,
      isCredited,
      notes,
      source: asgn?.source || (leave ? 'APPROVED_LEAVE' : 'REST_DAY'),
    });

    cur.setUTCDate(cur.getUTCDate() + 1);
    dayIndex++;
  }

  leaveHours = Math.round(leaveHours * 10) / 10;
  const totalEarnedHours = Math.round((dutyHours + leaveHours) * 10) / 10;
  const varianceHours = Math.round((balance.previousCreditedHours + totalEarnedHours - balance.cumulativeTargetHours) * 10) / 10;
  const pacePercent = targetHours > 0 ? Math.round((totalEarnedHours / targetHours) * 100) : 100;

  const balancePercent = balance.cumulativeTargetHours > 0 ? (balance.previousCreditedHours + totalEarnedHours) / balance.cumulativeTargetHours * 100 : 100;
  let status: HoursAccountingStatus = 'OPTIMAL';
  if (balancePercent < 75) {
    status = 'CRITICAL_UNDER';
  } else if (balancePercent < 90) {
    status = 'UNDER';
  } else if (balancePercent > 120) {
    status = 'CRITICAL_OVER';
  } else if (balancePercent > 110) {
    status = 'OVER';
  }

  // Quotas calculations in DAYS (Annual Leave, Public Holiday, Birthday Leave; Sick Leave has no quota ceiling)
  const quotaRows = leaveTypes
    .filter(
      (lt) =>
        lt.active &&
        lt.id !== 'leave-sl' &&
        lt.acronym !== 'SL' &&
        !lt.name.toLowerCase().includes('sick')
    )
    .map((lt) => {
      const rawQuota = nurse.leaveQuotas?.[lt.id];
      const annualQuotaDays =
        typeof rawQuota === 'number' && rawQuota > 0
          ? rawQuota > 40 && rawQuota % 8 === 0
            ? rawQuota / 8
            : rawQuota
          : lt.acronym === 'AL'
          ? 30
          : lt.acronym === 'PH'
          ? 10
          : lt.acronym === 'BL'
          ? 1
          : 0;

      const usedDays = leaveBreakdown[lt.id]?.daysCount || 0;
      const annualQuotaHours = annualQuotaDays * 8;
      const usedHours = leaveBreakdown[lt.id]?.hoursCredited || 0;

      return {
        leaveTypeId: lt.id,
        leaveTypeName: lt.name,
        annualQuotaDays,
        usedDays,
        remainingDays: Math.max(0, annualQuotaDays - usedDays),
        annualQuotaHours,
        usedHours,
        remainingHours: Math.max(0, annualQuotaHours - usedHours),
      };
    });

  return {
    nurse,
    balance,
    closingBalanceHours: varianceHours,
    seniority,
    contractPercent: nurse.contractPercent,
    fullTimeTargetHours,
    targetHours,
    dutyHours: Math.round(dutyHours * 10) / 10,
    leaveHours,
    totalEarnedHours,
    varianceHours,
    pacePercent,
    status,
    totalShiftsCount,
    weekendShiftsCount,
    lateDutiesCount,
    dutyCountsByAcronym,
    leaveBreakdown,
    quotas: quotaRows,
    timeline,
  };
}

/**
 * Calculates high-level executive clinic hours accounting metrics and fairness indicators.
 */
export function calculateClinicHoursMetrics(
  nurseRows: NurseHoursAccounting[],
  dutyWindows: DutyWindow[],
  seniorityLevels: SeniorityLevel[]
): ClinicHoursMetrics {
  const totalNurses = nurseRows.length;
  const activeNurses = nurseRows.filter((r) => r.nurse.active).length;

  const totalContractedTargetHours = nurseRows.reduce((sum, r) => sum + r.targetHours, 0);
  const totalDutyHoursWorked = nurseRows.reduce((sum, r) => sum + r.dutyHours, 0);
  const totalLeaveHoursCredited = nurseRows.reduce((sum, r) => sum + r.leaveHours, 0);
  const totalEarnedHours = totalDutyHoursWorked + totalLeaveHoursCredited;

  const clinicFulfillmentPercent =
    totalContractedTargetHours > 0
      ? Math.round((totalEarnedHours / totalContractedTargetHours) * 100)
      : 100;

  let totalOvertimeHours = 0;
  let totalDeficitHours = 0;
  let nursesInDeficitCount = 0;
  let nursesOnTrackCount = 0;
  let nursesInOvertimeCount = 0;

  nurseRows.forEach((r) => {
    if (r.varianceHours > 0) {
      totalOvertimeHours += r.varianceHours;
    } else if (r.varianceHours < 0) {
      totalDeficitHours += Math.abs(r.varianceHours);
    }

    if (r.status === 'UNDER' || r.status === 'CRITICAL_UNDER') {
      nursesInDeficitCount += 1;
    } else if (r.status === 'OPTIMAL') {
      nursesOnTrackCount += 1;
    } else {
      nursesInOvertimeCount += 1;
    }
  });

  // Calculate Average Hours per Full-Time Equivalent (FTE)
  const totalFte = nurseRows.reduce((sum, r) => sum + r.contractPercent / 100, 0);
  const averageHoursPerFte = totalFte > 0 ? Math.round(totalEarnedHours / totalFte) : 0;

  // Fairness Equity Index (spread among full-time nurses)
  const fullTimeRows = nurseRows.filter((r) => r.contractPercent === 100);
  let hoursFairnessIndex = 100;
  if (fullTimeRows.length > 1) {
    const hours = fullTimeRows.map((r) => r.totalEarnedHours);
    const mean = hours.reduce((s, h) => s + h, 0) / hours.length;
    const variance =
      hours.reduce((s, h) => s + Math.pow(h - mean, 2), 0) / hours.length;
    const stdDev = Math.sqrt(variance);
    // 0 stdDev = 100 fairness score; stdDev of 20 hours drops score to ~70
    hoursFairnessIndex = Math.max(0, Math.round(100 - stdDev * 1.5));
  }

  // Weekend shifts equity
  const weekendCounts = nurseRows.map((r) => r.weekendShiftsCount);
  const averageWeekendShiftsPerNurse =
    nurseRows.length > 0
      ? Math.round(
          (weekendCounts.reduce((s, c) => s + c, 0) / nurseRows.length) * 10
        ) / 10
      : 0;
  const minWeekendShifts = weekendCounts.length > 0 ? Math.min(...weekendCounts) : 0;
  const maxWeekendShifts = weekendCounts.length > 0 ? Math.max(...weekendCounts) : 0;
  const weekendSpread = maxWeekendShifts - minWeekendShifts;

  // Duty Window Distribution
  const dutyTypeDistribution: ClinicHoursMetrics['dutyTypeDistribution'] = {};
  dutyWindows.forEach((dw) => {
    let count = 0;
    nurseRows.forEach((r) => {
      count += r.dutyCountsByAcronym[dw.acronym] || 0;
    });
    const hours = count * calculateDutyDurationHours(dw);
    const pct = totalDutyHoursWorked > 0 ? Math.round((hours / totalDutyHoursWorked) * 100) : 0;
    dutyTypeDistribution[dw.id] = {
      dutyWindow: dw,
      shiftsCount: count,
      totalHours: hours,
      percentageOfHours: pct,
    };
  });

  // Seniority Hours Distribution
  const seniorityDistribution: ClinicHoursMetrics['seniorityDistribution'] = {};
  seniorityLevels.forEach((sl) => {
    const matchingNurses = nurseRows.filter(
      (r) => r.nurse.seniorityLevelId === sl.id
    );
    const target = matchingNurses.reduce((s, n) => s + n.targetHours, 0);
    const earned = matchingNurses.reduce((s, n) => s + n.totalEarnedHours, 0);
    seniorityDistribution[sl.id] = {
      seniority: sl,
      nursesCount: matchingNurses.length,
      targetHours: target,
      earnedHours: earned,
      fulfillmentPercent: target > 0 ? Math.round((earned / target) * 100) : 100,
    };
  });

  return {
    totalNurses,
    activeNurses,
    totalContractedTargetHours,
    totalDutyHoursWorked,
    totalLeaveHoursCredited,
    totalEarnedHours,
    clinicFulfillmentPercent,
    totalOvertimeHours,
    totalDeficitHours,
    nursesInDeficitCount,
    nursesOnTrackCount,
    nursesInOvertimeCount,
    averageHoursPerFte,
    hoursFairnessIndex,
    averageWeekendShiftsPerNurse,
    minWeekendShifts,
    maxWeekendShifts,
    weekendSpread,
    dutyTypeDistribution,
    seniorityDistribution,
  };
}
