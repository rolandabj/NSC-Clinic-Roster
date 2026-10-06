/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Analysis export: one JSON file with everything about a roster, made to be
 * read by a program (or handed to Claude) to study how the engine filled it.
 *
 * It holds the clinic setup (shifts, rules, leave types, skills, specialties,
 * opening hours, holidays), every nurse with her preferences and hours, every
 * doctor, each day with its doctor sessions and who covered them, every shift,
 * leave, request and pinned day, and every problem the checker finds now.
 * Each record carries both its ids and readable names, so it can be joined
 * back to the app's data and still read on its own.
 *
 * Left out on purpose: email addresses, dates of birth and free text notes on
 * nurse profiles (not needed to study the roster).
 */

import { countHoursInRange } from '../hours/hoursBalance';
import {
  Assignment,
  AvailabilityRequest,
  ClinicalRole,
  Doctor,
  DoctorSession,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  LockEntry,
  Nurse,
  Rule,
  Schedule,
  SeniorityLevel,
  Specialty,
  WorkingHoursPeriod,
} from '../../types';
import {
  ClinicSetup,
  canBeFreeNurse,
  coveredMinutes,
  doctorSessionsOn,
  resolveClinicSetup,
  toMinutes,
  uncoveredParts,
} from '../engine/clinicModel';
import { isExclusiveNurseClinic } from '../engine/nurseClinicUtils';
import { isFloatShift } from '../engine/floatShift';
import { isLateDuty, lateDutyThreshold } from '../engine/SchedulingEngine';
import { isPendingLeave } from '../engine/leaveStatus';
import { leaveCreditOnDate, resolveFullTimeTarget } from '../hours/hoursPolicy';
import { calculateDutyDurationHours, summarizeNurseHours } from '../reports/hoursAccounting';
import { ScheduleValidator, ValidationReport } from '../validation/ScheduleValidator';
import { getWeekendDays, isWeekendDate } from '../../utils/weekend';
import { getScheduleDates } from './rosterExportService';

export const ANALYSIS_FORMAT = 'nsc-roster-analysis';
export const ANALYSIS_FORMAT_VERSION = 1;

export interface RosterAnalysisInput {
  clinicName: string;
  timezone?: string;
  schedule: Schedule;
  versionNumber?: number;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  leaveEntries: LeaveEntry[];
  leaveTypes: LeaveType[];
  seniorityLevels: SeniorityLevel[];
  doctors: Doctor[];
  sessions: DoctorSession[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  rules: Rule[];
  workingHoursPeriods?: WorkingHoursPeriod[];
  locks: LockEntry[];
  availabilityRequests: AvailabilityRequest[];
  /** Opening hours, holidays, previous roster and year to date totals, as the engine sees them. */
  clinicSetup?: ClinicSetup;
  /** Time stamp written in the file (defaults to now). */
  exportedAt?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const round1 = (n: number) => Math.round(n * 10) / 10;
const minutesBetween = (start: string, end: string) => Math.max(0, toMinutes(end) - toMinutes(start));
const weekdayOf = (date: string) => WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];

/** A short guide to the file, written into it so the file explains itself. */
const FIELD_GUIDE: string[] = [
  'One roster exported for analysis. Ids match the app database; names are added for reading.',
  'hours: one shift per day counts its real length; an approved leave day counts the leave hours instead of any shift on it.',
  'nurses[].hours.target = full time target x contract percent. difference = total minus target.',
  'days[].hoursNeeded: doctorSessions = sum of doctor session lengths (ignored on public holidays); freeNurse = opening hours, because every opening hour needs one free nurse (Nurse Clinic); total = both.',
  'days[].hoursRostered = sum of the shift lengths of nurses working that day (leave days not counted).',
  'days[].doctorSessions[].nurses: nurses assigned to that doctor that day, with the minutes of the session their shift covers; uncovered lists the parts of the session no assigned nurse covers.',
  'preferenceRank on a doctor shift: the best rank the nurse gave that doctor by name, or one of the doctor\'s specialties (null = not in her list). nurse.preferenceFocus decides whether doctors or specialties come first when both need her.',
  'source: GENERATED = filled by the engine, MANUAL = changed by hand, LOCK = from a pinned day.',
  'problems: every finding from the checker at export time. severity ERROR = must fix, WARN = check, INFO = note.',
  'requests[].honoured: a day off request is honoured when she has no shift that day; a shift request when she has a shift (of the asked shift type, if one was given).',
  'hourlyCoverage[date][HH:mm]: nurses on duty, doctors in session, free nurses, and free nurses still missing at that opening hour.',
  'previousRosterTail: shifts from the last days of the roster before this one; the engine uses them for days in a row, rest and late runs.',
];

/**
 * Builds the analysis object. Pure: it reads only its input, so the same
 * roster always gives the same file (apart from exportedAt).
 */
export function buildRosterAnalysis(input: RosterAnalysisInput) {
  const {
    schedule,
    assignments: allAssignments,
    nurses,
    dutyWindows,
    leaveEntries,
    leaveTypes,
    seniorityLevels,
    doctors,
    sessions,
    roles,
    specialties,
    rules,
    workingHoursPeriods = [],
    locks,
    availabilityRequests,
    clinicSetup,
  } = input;

  const dates = getScheduleDates(schedule.startDate, schedule.endDate);
  const inRange = (date: string) => date >= schedule.startDate && date <= schedule.endDate;
  const assignments = allAssignments.filter((a) => a.scheduleId === schedule.id && inRange(a.date));

  const dutyMap = new Map(dutyWindows.map((d) => [d.id, d]));
  const nurseMap = new Map(nurses.map((n) => [n.id, n]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d]));
  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const specialtyMap = new Map(specialties.map((s) => [s.id, s]));
  const seniorityMap = new Map(seniorityLevels.map((s) => [s.id, s]));
  const leaveTypeMap = new Map(leaveTypes.map((t) => [t.id, t]));

  const clinic = resolveClinicSetup(clinicSetup);
  const holidays = clinic.holidays;
  const lateThreshold = lateDutyThreshold(rules);
  const fullTime = resolveFullTimeTarget(schedule, workingHoursPeriods);
  const openingMinutes = minutesBetween(clinic.openTime, clinic.closeTime);

  const nurseName = (id: string) => nurseMap.get(id)?.fullName || id;
  const dutyHours = (id: string) => round1(calculateDutyDurationHours(dutyMap.get(id)));
  const isSenior = (n?: Nurse) => !!(n && seniorityMap.get(n.seniorityLevelId)?.isSenior);

  /** Best rank the nurse gave this doctor, by name or by one of the doctor's specialties. */
  const pairingRank = (nurse: Nurse | undefined, doctorId: string, sessionSpecialtyId?: string) => {
    if (!nurse) return { rank: null as number | null, by: null as 'DOCTOR' | 'SPECIALTY' | null };
    const doctor = doctorMap.get(doctorId);
    const specs = new Set([...(doctor?.specialtyIds || []), ...(sessionSpecialtyId ? [sessionSpecialtyId] : [])]);
    let best: { rank: number | null; by: 'DOCTOR' | 'SPECIALTY' | null } = { rank: null, by: null };
    for (const p of nurse.preferences || []) {
      const hit = (p.kind === 'DOCTOR' && p.refId === doctorId) || (p.kind === 'SPECIALTY' && specs.has(p.refId));
      if (hit && (best.rank === null || p.rank < best.rank)) best = { rank: p.rank, by: p.kind as 'DOCTOR' | 'SPECIALTY' };
    }
    return best;
  };

  const approvedLeaveOn = (nurseId: string, date: string) =>
    leaveEntries.find((le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate);

  // Shifts by nurse and date (the first one counts, as in the hours rule).
  const shiftOf = new Map<string, Assignment>();
  for (const a of assignments) {
    const key = `${a.nurseId}|${a.date}`;
    if (!shiftOf.has(key)) shiftOf.set(key, a);
  }

  // The checker, run now, so the problems match the shifts in this file.
  const report: ValidationReport = ScheduleValidator.validate(
    schedule,
    assignments,
    nurses,
    seniorityLevels,
    dutyWindows,
    sessions,
    leaveEntries,
    locks,
    roles,
    rules,
    workingHoursPeriods,
    specialties,
    doctors,
    leaveTypes,
    clinicSetup,
    availabilityRequests
  );

  // ---- Shifts ----
  const shifts = [...assignments]
    .sort((a, b) => a.date.localeCompare(b.date) || nurseName(a.nurseId).localeCompare(nurseName(b.nurseId)))
    .map((a) => {
      const nurse = nurseMap.get(a.nurseId);
      const duty = dutyMap.get(a.dutyWindowId);
      const session = a.doctorId ? doctorSessionsOn(sessions, a.date).find((s) => s.doctorId === a.doctorId) : undefined;
      const pairing = a.doctorId ? pairingRank(nurse, a.doctorId, session?.specialtyId) : null;
      const specialtyRank =
        !a.doctorId && a.specialtyId
          ? (nurse?.preferences || []).find((p) => p.kind === 'SPECIALTY' && p.refId === a.specialtyId)?.rank ?? null
          : null;
      return {
        id: a.id,
        date: a.date,
        weekday: weekdayOf(a.date),
        nurseId: a.nurseId,
        nurse: nurseName(a.nurseId),
        dutyWindowId: a.dutyWindowId,
        shift: duty?.acronym || null,
        start: duty?.startTime || null,
        end: duty?.endTime || null,
        hours: dutyHours(a.dutyWindowId),
        late: isLateDuty(duty, lateThreshold),
        kind: a.kind,
        doctorId: a.doctorId || null,
        doctor: a.doctorId ? doctorMap.get(a.doctorId)?.fullName || a.doctorId : null,
        doctorSession: session ? { start: session.startTime, end: session.endTime } : null,
        specialtyId: a.specialtyId || null,
        specialty: a.specialtyId ? specialtyMap.get(a.specialtyId)?.name || a.specialtyId : null,
        clinicalRoleId: a.clinicalRoleId || null,
        clinicalRole: isFloatShift(a) ? 'Float' : a.clinicalRoleId ? roleMap.get(a.clinicalRoleId)?.acronym || a.clinicalRoleId : null,
        float: isFloatShift(a),
        preferenceRank: pairing ? pairing.rank : specialtyRank,
        preferenceMatchedBy: pairing ? pairing.by : specialtyRank !== null ? 'SPECIALTY' : null,
        source: a.source,
        pinned: !!a.locked,
        onApprovedLeave: !!approvedLeaveOn(a.nurseId, a.date),
        note: a.note || null,
      };
    });

  // ---- Leave ----
  const leave = leaveEntries
    .filter((le) => le.endDate >= schedule.startDate && le.startDate <= schedule.endDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((le) => {
      const type = leaveTypeMap.get(le.leaveTypeId);
      const days = dates.filter((d) => d >= le.startDate && d <= le.endDate);
      return {
        id: le.id,
        nurseId: le.nurseId,
        nurse: nurseName(le.nurseId),
        leaveTypeId: le.leaveTypeId,
        type: type?.acronym || null,
        typeName: type?.name || null,
        startDate: le.startDate,
        endDate: le.endDate,
        daysInRoster: days.length,
        status: le.status || (le.approved ? 'APPROVED' : 'PENDING'),
        approved: !!le.approved,
        pending: isPendingLeave(le),
        hoursCreditedInRoster: le.approved
          ? round1(days.reduce((sum, d) => sum + leaveCreditOnDate(le, type, d), 0))
          : 0,
        countsTowardHours: type ? type.countsTowardHoursTarget !== false : true,
      };
    });

  // ---- Requests ----
  const requests = availabilityRequests
    .filter((r) => inRange(r.date))
    .sort((a, b) => a.date.localeCompare(b.date) || nurseName(a.nurseId).localeCompare(nurseName(b.nurseId)))
    .map((r) => {
      const shift = shiftOf.get(`${r.nurseId}|${r.date}`);
      const type = r.available ? 'SHIFT' : 'DAY_OFF';
      const honoured = r.available
        ? !!shift && (!r.preferredDutyWindowId || shift.dutyWindowId === r.preferredDutyWindowId)
        : !shift;
      return {
        id: r.id,
        date: r.date,
        nurseId: r.nurseId,
        nurse: nurseName(r.nurseId),
        type,
        preferredShift: r.preferredDutyWindowId ? dutyMap.get(r.preferredDutyWindowId)?.acronym || r.preferredDutyWindowId : null,
        status: r.status,
        honoured,
        actualShift: shift ? dutyMap.get(shift.dutyWindowId)?.acronym || shift.dutyWindowId : null,
      };
    });

  // ---- Pinned days ----
  const pinnedDays = locks
    .filter((l) => inRange(l.date))
    .sort((a, b) => a.date.localeCompare(b.date) || nurseName(a.nurseId).localeCompare(nurseName(b.nurseId)))
    .map((l) => {
      const target = l.targetRefId
        ? doctorMap.get(l.targetRefId)?.fullName ||
          specialtyMap.get(l.targetRefId)?.name ||
          roleMap.get(l.targetRefId)?.acronym ||
          l.targetRefId
        : null;
      return {
        id: l.id,
        date: l.date,
        nurseId: l.nurseId,
        nurse: nurseName(l.nurseId),
        mode: l.mode,
        shift: l.dutyWindowId ? dutyMap.get(l.dutyWindowId)?.acronym || l.dutyWindowId : null,
        assignmentKind: l.assignmentKind || null,
        targetId: l.targetRefId || null,
        target,
        fromApprovedDayOffRequest: l.id.startsWith('lock-off-'),
      };
    });

  // ---- Problems ----
  const problems = report.findings.map((f) => ({
    id: f.id,
    rule: problemRule(f.id),
    severity: f.severity,
    category: f.category,
    message: f.message,
    date: f.date || null,
    hour: f.hour || null,
    nurseIds: f.affectedNurseIds,
    nurses: f.affectedNurseIds.map(nurseName),
    cells: f.cellRefs,
  }));
  const problemsByRule: Record<string, { ERROR: number; WARN: number; INFO: number }> = {};
  for (const p of problems) {
    const bucket = (problemsByRule[p.rule] ||= { ERROR: 0, WARN: 0, INFO: 0 });
    bucket[p.severity as 'ERROR' | 'WARN' | 'INFO'] += 1;
  }

  // ---- Days ----
  const days = dates.map((date) => {
    const isHoliday = holidays.has(date);
    const daySessions = doctorSessionsOn(sessions, date);
    const dayShifts = assignments.filter((a) => a.date === date && !approvedLeaveOn(a.nurseId, date));
    const workingNurseIds = Array.from(new Set(dayShifts.map((a) => a.nurseId)));

    const doctorSessions = daySessions.map((s) => {
      const withDoctor = dayShifts.filter((a) => a.kind === 'DOCTOR' && a.doctorId === s.doctorId);
      const coverDuties = withDoctor.map((a) => dutyMap.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d);
      return {
        sessionId: s.id,
        doctorId: s.doctorId,
        doctor: doctorMap.get(s.doctorId)?.fullName || s.doctorId,
        specialtyId: s.specialtyId,
        specialty: specialtyMap.get(s.specialtyId)?.name || s.specialtyId,
        start: s.startTime,
        end: s.endTime,
        hours: round1(minutesBetween(s.startTime, s.endTime) / 60),
        room: s.room || null,
        source: s.source,
        nurses: withDoctor.map((a) => {
          const duty = dutyMap.get(a.dutyWindowId);
          const pairing = pairingRank(nurseMap.get(a.nurseId), s.doctorId, s.specialtyId);
          return {
            nurseId: a.nurseId,
            nurse: nurseName(a.nurseId),
            shift: duty?.acronym || null,
            coveredMinutes: duty ? coveredMinutes(duty, s.startTime, s.endTime) : 0,
            preferenceRank: pairing.rank,
            preferenceMatchedBy: pairing.by,
            source: a.source,
          };
        }),
        uncovered: uncoveredParts(s.startTime, s.endTime, coverDuties),
      };
    });

    const doctorHours = isHoliday ? 0 : doctorSessions.reduce((sum, s) => sum + s.hours, 0);
    const freeNurseHours = openingMinutes / 60;
    const rostered = dayShifts.reduce((sum, a) => sum + calculateDutyDurationHours(dutyMap.get(a.dutyWindowId)), 0);
    const dayProblems = problems.filter((p) => p.date === date);

    return {
      date,
      weekday: weekdayOf(date),
      weekend: isWeekendDate(date),
      publicHoliday: isHoliday,
      hoursNeeded: {
        doctorSessions: round1(doctorHours),
        freeNurse: round1(freeNurseHours),
        total: round1(doctorHours + freeNurseHours),
      },
      hoursRostered: round1(rostered),
      nursesWorking: workingNurseIds.length,
      seniorsWorking: workingNurseIds.filter((id) => isSenior(nurseMap.get(id))).length,
      freeNurseCapableWorking: workingNurseIds.filter((id) => canBeFreeNurse(nurseMap.get(id), roles)).length,
      shiftsByType: countBy(dayShifts.map((a) => dutyMap.get(a.dutyWindowId)?.acronym || a.dutyWindowId)),
      doctorSessions,
      nurseClinic: dayShifts
        .filter((a) => a.kind === 'CLINICAL_ROLE' && !isFloatShift(a))
        .map((a) => ({
          nurseId: a.nurseId,
          nurse: nurseName(a.nurseId),
          role: a.clinicalRoleId ? roleMap.get(a.clinicalRoleId)?.acronym || a.clinicalRoleId : null,
          shift: dutyMap.get(a.dutyWindowId)?.acronym || null,
        })),
      floats: dayShifts
        .filter((a) => isFloatShift(a))
        .map((a) => ({ nurseId: a.nurseId, nurse: nurseName(a.nurseId), shift: dutyMap.get(a.dutyWindowId)?.acronym || null })),
      onLeave: leave
        .filter((le) => date >= le.startDate && date <= le.endDate)
        .map((le) => ({ nurseId: le.nurseId, nurse: le.nurse, type: le.type, status: le.status })),
      dayOffRequests: requests.filter((r) => r.date === date && r.type === 'DAY_OFF').map((r) => r.nurse),
      pinned: pinnedDays.filter((l) => l.date === date).map((l) => ({ nurse: l.nurse, mode: l.mode, shift: l.shift })),
      problems: {
        ERROR: dayProblems.filter((p) => p.severity === 'ERROR').length,
        WARN: dayProblems.filter((p) => p.severity === 'WARN').length,
        INFO: dayProblems.filter((p) => p.severity === 'INFO').length,
      },
    };
  });

  // ---- Nurses ----
  const nurseRows = [...nurses]
    .sort((a, b) => a.fullName.localeCompare(b.fullName))
    .map((n) => {
      const hours = summarizeNurseHours(n, schedule, assignments, dutyMap, leaveEntries, leaveTypeMap, workingHoursPeriods, undefined, clinicSetup?.hoursHistory);
      const mine = shifts.filter((s) => s.nurseId === n.id && !s.onApprovedLeave);
      const prefs = [...(n.preferences || [])].sort((a, b) => a.rank - b.rank);
      // Longest run of working days in a row inside this roster.
      let run = 0;
      let longestRun = 0;
      for (const d of dates) {
        run = shiftOf.has(`${n.id}|${d}`) && !approvedLeaveOn(n.id, d) ? run + 1 : 0;
        longestRun = Math.max(longestRun, run);
      }
      const ytd = clinicSetup?.yearToDate?.[n.id];
      return {
        id: n.id,
        name: n.fullName,
        employeeCode: n.employeeCode,
        active: n.active,
        hasEmail: !!(n.gmail && n.gmail.includes('@')),
        seniority: seniorityMap.get(n.seniorityLevelId)?.name || null,
        senior: isSenior(n),
        contractPercent: n.contractPercent ?? null,
        isClinicNurse: !!n.isClinicNurse,
        exclusiveNurseClinic: isExclusiveNurseClinic(n, roles),
        canBeFreeNurse: canBeFreeNurse(n, roles),
        skills: (n.capabilityIds || []).map((id) => roleMap.get(id)?.acronym || id),
        preferenceFocus: n.preferenceFocus || 'LIST',
        preferences: prefs.map((p) => ({
          rank: p.rank,
          kind: p.kind,
          refId: p.refId,
          name:
            p.kind === 'DOCTOR'
              ? doctorMap.get(p.refId)?.fullName || p.refId
              : p.kind === 'SPECIALTY'
              ? specialtyMap.get(p.refId)?.name || p.refId
              : roleMap.get(p.refId)?.acronym || p.refId,
        })),
        hours: {
          target: hours.targetHours,
          shifts: hours.dutyHours,
          leave: hours.leaveHours,
          total: hours.totalHours,
          difference: hours.closingBalanceHours,
          baseTarget: hours.balance.baseTargetHours,
          carriedHoursOwed: hours.balance.carriedHours,
          previousCreditedHours: hours.balance.previousCreditedHours,
          cumulativeTarget: hours.balance.cumulativeTargetHours,
          trackingStartDate: hours.balance.trackingStartDate,
          heldBackToNextPeriod: hours.balance.deferredHours,
          writtenOff: hours.balance.writtenOffHours,
          periodParts: hours.balance.parts.map((p) => ({
            period: p.name, start: p.startDate, end: p.endDate, base: p.baseHours, carried: p.carriedHours, target: p.targetHours,
            worked: Math.round(countHoursInRange(n.id, p.startDate, p.endDate, assignments, dutyWindows, leaveEntries, leaveTypes).totalHours * 10) / 10,
          })),
          percentOfTarget: hours.percent,
        },
        counts: {
          shifts: mine.length,
          byShiftType: countBy(mine.map((s) => s.shift || s.dutyWindowId)),
          byKind: countBy(mine.map((s) => s.kind)),
          weekendShifts: mine.filter((s) => isWeekendDate(s.date)).length,
          holidayShifts: mine.filter((s) => holidays.has(s.date)).length,
          lateShifts: mine.filter((s) => s.late).length,
          nurseClinicShifts: mine.filter((s) => s.kind === 'CLINICAL_ROLE' && !s.float).length,
          floatShifts: mine.filter((s) => s.float).length,
          withFirstChoice: mine.filter((s) => s.preferenceRank === 1).length,
          withOtherChoice: mine.filter((s) => s.preferenceRank !== null && s.preferenceRank > 1).length,
          doctorShiftsOutsideList: mine.filter((s) => s.kind === 'DOCTOR' && s.preferenceRank === null).length,
          generated: mine.filter((s) => s.source === 'GENERATED').length,
          manual: mine.filter((s) => s.source === 'MANUAL').length,
          pinned: mine.filter((s) => s.pinned).length,
          leaveDays: dates.filter((d) => approvedLeaveOn(n.id, d)).length,
          daysOff: dates.filter((d) => !shiftOf.has(`${n.id}|${d}`) && !approvedLeaveOn(n.id, d)).length,
          longestRunOfWorkingDays: longestRun,
          dayOffRequests: requests.filter((r) => r.nurseId === n.id && r.type === 'DAY_OFF').length,
          dayOffRequestsHonoured: requests.filter((r) => r.nurseId === n.id && r.type === 'DAY_OFF' && r.honoured).length,
          problems: problems.filter((p) => p.nurseIds.includes(n.id)).length,
        },
        yearToDateBeforeThisRoster: ytd || null,
      };
    });

  // ---- Totals ----
  const totalTarget = nurseRows.filter((n) => n.active).reduce((s, n) => s + n.hours.target, 0);
  const totalWorked = nurseRows.reduce((s, n) => s + n.hours.total, 0);
  const allSessions = days.flatMap((d) => (d.publicHoliday ? [] : d.doctorSessions));
  const doctorShifts = shifts.filter((s) => s.kind === 'DOCTOR' && !s.onApprovedLeave);

  const summary = {
    days: dates.length,
    activeNurses: nurses.filter((n) => n.active).length,
    activeDoctors: doctors.filter((d) => d.active).length,
    shifts: shifts.length,
    shiftsBySource: countBy(shifts.map((s) => s.source)),
    shiftsByType: countBy(shifts.map((s) => s.shift || s.dutyWindowId)),
    shiftsByKind: countBy(shifts.map((s) => s.kind)),
    hours: {
      fullTimeTarget: fullTime.hours,
      fullTimeTargetSource: fullTime.source,
      nurseTargetsTotal: round1(totalTarget),
      workedTotal: round1(totalWorked),
      shiftHoursTotal: round1(nurseRows.reduce((s, n) => s + n.hours.shifts, 0)),
      leaveHoursTotal: round1(nurseRows.reduce((s, n) => s + n.hours.leave, 0)),
      differenceTotal: round1(totalWorked - totalTarget),
      clinicCoverNeeded: round1(days.reduce((s, d) => s + d.hoursNeeded.total, 0)),
      clinicCoverRostered: round1(days.reduce((s, d) => s + d.hoursRostered, 0)),
      nursesUnder90Percent: nurseRows.filter((n) => n.active && n.hours.percentOfTarget < 90).map((n) => n.name),
      nursesOver110Percent: nurseRows.filter((n) => n.active && n.hours.percentOfTarget > 110).map((n) => n.name),
    },
    doctorSessions: {
      total: allSessions.length,
      withNoNurse: allSessions.filter((s) => s.nurses.length === 0).length,
      partlyCovered: allSessions.filter((s) => s.nurses.length > 0 && s.uncovered.length > 0).length,
      pairedWithRank1: doctorShifts.filter((s) => s.preferenceRank === 1).length,
      pairedWithRank2: doctorShifts.filter((s) => s.preferenceRank === 2).length,
      pairedWithRank3Plus: doctorShifts.filter((s) => s.preferenceRank !== null && s.preferenceRank >= 3).length,
      pairedOutsideList: doctorShifts.filter((s) => s.preferenceRank === null).length,
    },
    problems: {
      ERROR: report.errorCount,
      WARN: report.warnCount,
      INFO: report.infoCount,
      byRule: problemsByRule,
    },
    requests: {
      total: requests.length,
      honoured: requests.filter((r) => r.honoured).length,
      dayOff: requests.filter((r) => r.type === 'DAY_OFF').length,
      dayOffHonoured: requests.filter((r) => r.type === 'DAY_OFF' && r.honoured).length,
      shift: requests.filter((r) => r.type === 'SHIFT').length,
      shiftHonoured: requests.filter((r) => r.type === 'SHIFT' && r.honoured).length,
    },
    pinnedDays: pinnedDays.length,
    leaveEntries: leave.length,
  };

  return {
    format: ANALYSIS_FORMAT,
    formatVersion: ANALYSIS_FORMAT_VERSION,
    exportedAt: input.exportedAt || new Date().toISOString(),
    guide: FIELD_GUIDE,
    clinic: {
      name: input.clinicName,
      timezone: input.timezone || null,
      openTime: clinic.openTime,
      closeTime: clinic.closeTime,
      weekendDays: getWeekendDays().map((d) => WEEKDAYS[d]),
      publicHolidays: dates.filter((d) => holidays.has(d)),
    },
    roster: {
      id: schedule.id,
      name: schedule.name,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      status: schedule.status,
      version: input.versionNumber ?? schedule.activeVersionNumber ?? 1,
      periodName: fullTime.periodName || schedule.periodName || null,
      fullTimeTargetHours: fullTime.hours,
      fullTimeTargetSource: fullTime.source,
    },
    summary,
    settings: {
      shiftTypes: dutyWindows.map((d) => ({
        id: d.id,
        acronym: d.acronym,
        name: d.name,
        start: d.startTime,
        end: d.endTime,
        hours: dutyHours(d.id),
        active: d.active,
        late: isLateDuty(d, lateThreshold),
        usedFirst: !!d.isPriority,
        priorityRank: d.priorityRank ?? null,
      })),
      lateShiftThreshold: lateThreshold,
      rules: rules.map((r) => ({
        id: r.id,
        templateKey: r.templateKey || null,
        name: r.name,
        value: r.value,
        severity: r.severity,
        enabled: r.enabled,
        params: r.params || null,
      })),
      leaveTypes: leaveTypes.map((t) => ({
        id: t.id,
        acronym: t.acronym,
        name: t.name,
        creditedHours: t.creditedHours,
        countsTowardHours: t.countsTowardHoursTarget !== false,
        active: t.active,
      })),
      seniorityLevels: seniorityLevels.map((s) => ({ id: s.id, name: s.name, rank: s.rank, senior: s.isSenior })),
      skills: roles.map((r) => ({
        id: r.id,
        acronym: r.acronym,
        name: r.name,
        dailyQuota: r.defaultDailyQuota,
        start: r.defaultStartTime || null,
        end: r.defaultEndTime || null,
      })),
      specialties: specialties.map((s) => ({ id: s.id, code: s.code, name: s.name })),
      workingHoursPeriods: workingHoursPeriods
        .filter((p) => p.endDate >= schedule.startDate && p.startDate <= schedule.endDate)
        .map((p) => ({ id: p.id, name: p.name, startDate: p.startDate, endDate: p.endDate, hours: p.workingHours })),
    },
    nurses: nurseRows,
    doctors: [...doctors]
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
      .map((d) => ({
        id: d.id,
        name: d.fullName,
        active: d.active,
        specialties: d.specialtyIds.map((id) => specialtyMap.get(id)?.name || id),
        weeklyPattern: (d.weeklyPattern || []).map((p) => ({ weekday: WEEKDAYS[p.weekday], start: p.startTime, end: p.endTime })),
        sessionsInRoster: allSessions.filter((s) => s.doctorId === d.id).length,
        sessionsWithNoNurse: allSessions.filter((s) => s.doctorId === d.id && s.nurses.length === 0).length,
        nursesWorkedWith: countBy(doctorShifts.filter((s) => s.doctorId === d.id).map((s) => s.nurse)),
      })),
    days,
    shifts,
    leave,
    requests,
    pinnedDays,
    problems,
    hourlyCoverage: report.hourlyCoverageMap,
    previousRosterTail: (clinicSetup?.priorAssignments || [])
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((a) => ({
        date: a.date,
        nurseId: a.nurseId,
        nurse: nurseName(a.nurseId),
        shift: dutyMap.get(a.dutyWindowId)?.acronym || a.dutyWindowId,
        end: dutyMap.get(a.dutyWindowId)?.endTime || null,
      })),
  };
}

export type RosterAnalysis = ReturnType<typeof buildRosterAnalysis>;

/** The checker's finding id prefixes, longest first, so 'h7-hours-over-' wins over 'hours-over-'. */
const PROBLEM_RULES = [
  'cov-gap', 'dayoff-lock', 'evening-tail', 'exclusive-nc-doctor-conflict', 'h1-senior', 'h2-days', 'h3-rest',
  'h4-dup', 'h6-phl-capability', 'h7-hours-over', 'h7-period', 'h8-doctor-allocation', 'h8-specialty-allocation', 'h9-week-hours', 'holiday-gap',
  'holiday-no-nurse', 'holiday-senior', 'hours-deferred', 'hours-history-unavailable', 'hours-low', 'hours-over',
  'hours-part-short', 'hours-written-off', 'leave-overlap', 'missing-gmail', 'nc-coverage',
  'nc-doctor-conflict', 'nc-not-qualified', 'pending-leave-shift', 'period-gap', 'request-dayoff-shift', 'request-shift',
  'role-quota', 's1-late', 'scale-ratio-warning', 'schedule-overlap', 'session-no-overlap', 'session-partial', 'unassigned-session',
].sort((a, b) => b.length - a.length);

/** Which check a finding came from, e.g. 'cov-gap-2026-10-05-09:00' gives 'cov-gap'. */
export function problemRule(findingId: string): string {
  return PROBLEM_RULES.find((r) => findingId === r || findingId.startsWith(`${r}-`)) || findingId;
}

function countBy(values: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) out[v] = (out[v] || 0) + 1;
  return out;
}

/** File name for the analysis export. */
export function analysisFileName(clinicName: string, schedule: Schedule, versionNumber?: number): string {
  const safe = (s: string) => s.replace(/[^a-zA-Z0-9_\-.]/g, '_').toLowerCase();
  const v = versionNumber ?? schedule.activeVersionNumber ?? 1;
  return `${safe(clinicName)}_analysis_${schedule.startDate}_${schedule.endDate}_v${v}.json`;
}

/** Builds the analysis and downloads it as a JSON file. */
export function downloadRosterAnalysis(input: RosterAnalysisInput): RosterAnalysis {
  const analysis = buildRosterAnalysis(input);
  if (typeof document !== 'undefined') {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', analysisFileName(input.clinicName, input.schedule, input.versionNumber));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return analysis;
}
