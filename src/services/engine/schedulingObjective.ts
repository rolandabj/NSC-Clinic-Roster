import type { Assignment, AvailabilityRequest, ClinicalRole, Doctor, DoctorSession, DutyWindow, LeaveEntry, LeaveType,
  LockEntry, Nurse, Rule, Schedule, SeniorityLevel, Specialty, WorkingHoursPeriod } from '../../types';
import { ScheduleValidator, type ValidationFinding } from '../validation/ScheduleValidator';
import { checkAssignment } from './assignmentChecks';
import { assignmentCanCoverDoctor, nurseIsAvailable } from './assignmentPresence';
import { applyPreferenceFocus } from './preferenceOrder';
import { outsideNurseList } from './nurseList';
import { hasAllocationReview } from './allocationReview';
import { isAgreedException, isLastResortShift } from './lastResort';
import { canBeFreeNurse, coverageSlots, doctorCoverageFingerprint, doctorSessionsOn, effectiveDoctorCoverage, isFreeDuring,
  nurseClinicRoleOf, bloodCollectionRole, resolveClinicSetup, toMinutes, uncoveredParts, type ClinicSetup } from './clinicModel';
import { isFloatShift } from './floatShift';
import { resolveRule, LATE_DUTY_RULE_WORDS } from './SchedulingEngine';
import { countHoursInRange, dutyDurationHours, nurseContractShare, resolveNurseHoursBalance } from '../hours/hoursBalance';
import { yearToDateSeeds } from '../fairness/yearSeed';
import { getWeekendDays } from '../../utils/weekend';

export interface SchedulingObjectiveInput {
  schedule: Schedule;
  nurses: Nurse[];
  seniorityLevels: SeniorityLevel[];
  dutyWindows: DutyWindow[];
  sessions: DoctorSession[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  roles: ClinicalRole[];
  rules: Rule[];
  workingHoursPeriods?: WorkingHoursPeriod[];
  specialties?: Specialty[];
  doctors?: Doctor[];
  leaveTypes?: LeaveType[];
  clinicSetup?: ClinicSetup;
  availabilityRequests?: AvailabilityRequest[];
  baselineAssignments?: Assignment[];
  selectedDates?: string[];
  keepManual?: boolean;
  /** Empty only fills may reallocate work inside an existing generated duty, but keep its paid fields. */
  preservePaidDuties?: boolean;
  weekendDays?: number[];
}

/** Every field is a cost. Earlier fields always take precedence over later ones. */
export interface SchedulingScore {
  hardViolations: number;
  hardMagnitude: number;
  requiredNurseClinicMinutes: number;
  uncoveredDoctorMinutes: number;
  concurrentDoctorMinutes: number;
  handovers: number;
  hoursImbalance: number;
  preferencePenalty: number;
  fairnessPenalty: number;
  changedDutyCount: number;
}
export interface DoctorCoverageGap { date: string; doctorId: string; startTime: string; endTime: string; missingMinutes: number }

const FIELDS: (keyof SchedulingScore)[] = ['hardViolations', 'hardMagnitude', 'requiredNurseClinicMinutes',
  'uncoveredDoctorMinutes', 'concurrentDoctorMinutes', 'handovers', 'hoursImbalance', 'preferencePenalty', 'fairnessPenalty', 'changedDutyCount'];
const EPSILON = 1e-7;

export function compareSchedulingScores(a: SchedulingScore, b: SchedulingScore): number {
  for (const field of FIELDS) {
    const difference = a[field] - b[field];
    if (Math.abs(difference) > EPSILON) return difference < 0 ? -1 : 1;
  }
  return 0;
}

function canonical(value: unknown): string {
  const clean = (item: unknown): unknown => Array.isArray(item) ? item.map(clean)
    : item && typeof item === 'object' ? Object.fromEntries(Object.entries(item)
      .filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => [key, clean(v)])) : item;
  return JSON.stringify(clean(value));
}
const cellKey = (a: Pick<Assignment, 'nurseId' | 'date'>) => `${a.nurseId}|${a.date}`;
const gapFinding = (finding: ValidationFinding) => /^(cov-gap-|holiday-gap-|holiday-no-nurse-)/.test(finding.id);
const residualStaffingFinding = (finding: ValidationFinding) => /^(cov-gap-|nc-coverage-|holiday-gap-|holiday-no-nurse-|h1-senior-)/.test(finding.id);

/** Minimum nurse changes needed to follow the available coverage across a session. */
function handoverCount(ranges: { startTime: string; endTime: string; nurseId: string }[]): number {
  const bounds = [...new Set(ranges.flatMap(r => [r.startTime, r.endTime]))].sort();
  let costs = new Map<string, number>();
  for (let i = 0; i < bounds.length - 1; i++) {
    const active = new Set(ranges.filter(r => r.startTime <= bounds[i] && r.endTime >= bounds[i + 1]).map(r => r.nurseId));
    if (!active.size) continue;
    const next = new Map<string, number>();
    for (const nurseId of active) next.set(nurseId, costs.size
      ? Math.min(...[...costs].map(([prior, cost]) => cost + (prior === nurseId ? 0 : 1))) : 0);
    costs = next;
  }
  return costs.size ? Math.min(...costs.values()) : 0;
}

/** Compile fixed lookup data once for the many candidates considered during a search. */
export function createSchedulingObjective(input: SchedulingObjectiveInput) {
  const { schedule, dutyWindows, sessions, leaveEntries, locks, roles, rules, seniorityLevels } = input;
  const doctors = input.doctors || [], specialties = input.specialties || [], leaveTypes = input.leaveTypes || [];
  const workingHoursPeriods = input.workingHoursPeriods || [];
  const nurses = input.nurses.map(applyPreferenceFocus);
  const nurseMap = new Map(nurses.map(n => [n.id, n]));
  const dutyMap = new Map(dutyWindows.map(d => [d.id, d]));
  const clinic = resolveClinicSetup(input.clinicSetup);
  const requests = [...new Map([...(input.clinicSetup?.availabilityRequests || []), ...(input.availabilityRequests || [])]
    .map(r => [r.id, r])).values()];
  const presence = { leaveEntries, locks, availabilityRequests: requests };
  const doctorContext = { ...presence, nurses, roles, doctors, specialties, sessions };
  const dates: string[] = [];
  for (let day = new Date(`${schedule.startDate}T00:00:00Z`); day.toISOString().slice(0, 10) <= schedule.endDate;
    day.setUTCDate(day.getUTCDate() + 1)) dates.push(day.toISOString().slice(0, 10));
  const selected = new Set(input.selectedDates || dates);
  const selectedDates = dates.filter(date => selected.has(date));
  const daySessions = new Map(dates.map(date => [date, clinic.holidays.has(date) ? [] : doctorSessionsOn(sessions, date)]));
  const baseline = input.baselineAssignments || [];
  const baselineByCell = new Map(baseline.map(a => [cellKey(a), a]));
  const fixed = (a: Assignment) => !selected.has(a.date) || a.locked || a.source === 'LOCK' ||
    a.source === 'MANUAL' && input.keepManual !== false;
  const scopedLocks = new Map<string, LockEntry>();
  for (const lock of locks.filter(l => l.date >= schedule.startDate && l.date <= schedule.endDate)) {
    const key = `${lock.nurseId}|${lock.date}`;
    // An explicit day off cannot be displaced by another shift pin for that date.
    if (scopedLocks.get(key)?.mode !== 'OFF') scopedLocks.set(key, lock);
  }
  const matchesLockFields = (a: Assignment, lock: LockEntry) => {
    const kind = lock.assignmentKind || 'CLINICAL_ROLE';
    const target = kind === 'DOCTOR' ? a.doctorId : kind === 'SPECIALTY' ? a.specialtyId : a.clinicalRoleId;
    return lock.mode === 'ASSIGNMENT' && lock.dutyWindowId === a.dutyWindowId && kind === a.kind &&
      (lock.targetRefId || '') === (target || '') &&
      (kind === 'DOCTOR' ? lock.secondTargetRefId || '' : '') === (a.secondDoctorId || '') && doctorCoverageFingerprint(a) ===
      doctorCoverageFingerprint({ kind, doctorId: kind === 'DOCTOR' ? lock.targetRefId : undefined,
        secondDoctorId: kind === 'DOCTOR' ? lock.secondTargetRefId : undefined, doctorCoverage: lock.doctorCoverage });
  };
  const matchesLock = (a: Assignment) => {
    const lock = scopedLocks.get(cellKey(a));
    return !!lock && a.locked && a.source === 'LOCK' && matchesLockFields(a, lock);
  };
  const protectedChanges = (assignments: Assignment[], reference = baseline): number => {
    const byCell = new Map(assignments.map(a => [cellKey(a), a]));
    const originals = new Map(reference.map(a => [cellKey(a), a]));
    const changes = new Set<string>();
    for (const original of reference) {
      const key = cellKey(original), next = byCell.get(key), lock = scopedLocks.get(key);
      // The requested date range is fixed before considering any new pin outside it.
      if (!selected.has(original.date)) {
        if (canonical(next) !== canonical(original)) changes.add(key);
        continue;
      }
      if (lock) continue; // The explicit pin is checked below and overrides a stale cell.
      if (fixed(original) && canonical(next) !== canonical(original)) changes.add(key);
      if (input.preservePaidDuties && original.source === 'GENERATED' && !original.locked &&
        nurseIsAvailable(nurseMap.get(original.nurseId), original.date, presence) &&
        (!next || next.id !== original.id || next.nurseId !== original.nurseId || next.date !== original.date || next.dutyWindowId !== original.dutyWindowId)) changes.add(key);
    }
    for (const [key, lock] of scopedLocks) {
      if (!selected.has(lock.date)) continue;
      const next = byCell.get(key), original = originals.get(key);
      if (lock.mode === 'OFF') { if (next) changes.add(key); continue; }
      if (!next || !matchesLockFields(next, lock)) { changes.add(key); continue; }
      const existingPin = original && (original.locked || original.source === 'LOCK') && matchesLockFields(original, lock);
      if (existingPin ? canonical(next) !== canonical(original) : !matchesLock(next)) changes.add(key);
    }
    const originalCells = new Set(reference.map(cellKey));
    for (const a of assignments) if (a.scheduleId !== schedule.id || !originalCells.has(cellKey(a)) && !selected.has(a.date)) changes.add(cellKey(a));
    return changes.size;
  };
  const availability = new Map<string, boolean>();
  const present = (a: Assignment) => {
    const key = cellKey(a);
    if (!availability.has(key)) availability.set(key, nurseIsAvailable(nurseMap.get(a.nurseId), a.date, presence));
    return availability.get(key)!;
  };
  const permitted = new Map<string, boolean>();
  const canCover = (a: Assignment, doctorId: string) => {
    const exception = isLastResortShift(a) || isAgreedException(a) || hasAllocationReview(a);
    const key = `${a.nurseId}|${a.date}|${doctorId}|${exception}`;
    if (!permitted.has(key)) permitted.set(key, assignmentCanCoverDoctor(a, doctorContext, doctorId));
    return permitted.get(key)!;
  };
  const qualified = new Set(nurses.filter(n => canBeFreeNurse(n, roles)).map(n => n.id));
  const ncRole = nurseClinicRoleOf(roles), phl = bloodCollectionRole(roles);
  const ncRule = resolveRule(rules, 'DEDICATED_NURSE_CLINIC', 'rule-nurse-clinic', ['nurse clinic coverage', 'dedicated nurse clinic', 'nurse clinic']);
  const plusRule = resolveRule(rules, 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', 'rule-nurse-plus-one', ['additional nurse', 'above doctors', 'plus one']);
  const hardQuota = (rule: Rule | undefined) => rule?.enabled === false || rule?.severity === 'SOFT' ? 0 : Math.max(0, rule?.value ?? 1);
  const minFree = hardQuota(plusRule), minDedicated = hardQuota(ncRule);
  const isDedicated = (a: Assignment) => a.kind === 'CLINICAL_ROLE' && (a.clinicalRoleId === ncRole?.id ||
    a.clinicalRoleId === 'role-nurse-clinic' || !!phl && a.clinicalRoleId === phl.id || !!a.note?.toLowerCase().includes('nurse clinic'));
  const lateRule = resolveRule(rules, 'MAX_CONSECUTIVE_LATE_DUTIES', 'rule-s1', LATE_DUTY_RULE_WORDS);
  const lateTime = typeof lateRule?.params?.thresholdTime === 'string' ? lateRule.params.thresholdTime : '21:00';
  const weekends = new Set(input.weekendDays || getWeekendDays());
  const seeds = yearToDateSeeds(input.clinicSetup?.yearToDate, nurses);
  const target = new Map(nurses.filter(n => n.active).map(n => [n.id, resolveNurseHoursBalance(n, schedule, dutyMap,
    leaveEntries, leaveTypes, workingHoursPeriods, input.clinicSetup?.hoursHistory).targetHours * 60]));
  const leaveMinutes = new Map(nurses.map(n => [n.id, countHoursInRange(n.id, schedule.startDate, schedule.endDate,
    [], dutyMap, leaveEntries, leaveTypes).leaveHours * 60]));
  const hasLeave = (a: Assignment) => leaveEntries.some(l => l.approved && l.nurseId === a.nurseId && l.startDate <= a.date && l.endDate >= a.date);
  const rankCache = new Map<string, number>();
  const unranked = Math.max(0, ...nurses.flatMap(n => (n.preferences || []).map(p => p.rank))) + 1;
  const rank = (nurseId: string, doctorId: string, date: string) => {
    const key = `${nurseId}|${doctorId}|${date}`;
    if (!rankCache.has(key)) {
      const nurse = nurseMap.get(nurseId);
      const choices = nurse?.preferences?.filter(p => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY') || [];
      const probe = { kind: 'DOCTOR' as const, doctorId, date };
      const ranks = choices.filter(p => !outsideNurseList({ preferences: [p] }, probe, { doctors, specialties, sessions })).map(p => p.rank);
      rankCache.set(key, ranks.length ? Math.min(...ranks) : unranked);
    }
    return rankCache.get(key)!;
  };

  const validate = (assignments: Assignment[]): ValidationFinding[] => ScheduleValidator.validate(schedule, assignments, nurses, seniorityLevels,
    dutyWindows, sessions, leaveEntries, locks, roles, rules, workingHoursPeriods, specialties, doctors, leaveTypes,
    input.clinicSetup, requests).findings;

  function coverage(assignments: Assignment[]) {
    const day = new Map<string, Assignment[]>();
    const intervals = new Map<string, ReturnType<typeof effectiveDoctorCoverage>>();
    const covered = new Map<string, { startTime: string; endTime: string; nurseId: string }[]>();
    let concurrentDoctorMinutes = 0, preferencePenalty = 0;
    for (const a of assignments) {
      if (a.scheduleId !== schedule.id || !selected.has(a.date)) continue;
      const list = day.get(a.date) || []; list.push(a); day.set(a.date, list);
      const ranges = effectiveDoctorCoverage(a, dutyMap.get(a.dutyWindowId), daySessions.get(a.date) || []);
      intervals.set(a.id, ranges);
      const eligible = ranges.filter(r => canCover(a, r.doctorId));
      for (const r of eligible) {
        const key = `${a.date}|${r.doctorId}`;
        const list = covered.get(key) || []; list.push({ ...r, nurseId: a.nurseId }); covered.set(key, list);
        preferencePenalty += (toMinutes(r.endTime) - toMinutes(r.startTime)) * rank(a.nurseId, r.doctorId, a.date);
      }
      const bounds = [...new Set(eligible.flatMap(r => [r.startTime, r.endTime]))].sort();
      for (let i = 0; i < bounds.length - 1; i++) if (new Set(eligible.filter(r => r.startTime <= bounds[i] && r.endTime >= bounds[i + 1])
        .map(r => r.doctorId)).size > 1) concurrentDoctorMinutes += toMinutes(bounds[i + 1]) - toMinutes(bounds[i]);
    }
    const gaps: DoctorCoverageGap[] = [];
    let handovers = 0, requiredNurseClinicMinutes = 0;
    const dedicatedDeficit = new Map<string, number>();
    for (const date of selectedDates) {
      const current = day.get(date) || [], clinics = daySessions.get(date) || [];
      for (const session of clinics) {
        const cover = covered.get(`${date}|${session.doctorId}`) || [];
        gaps.push(...uncoveredParts(session.startTime, session.endTime, cover).map(r => ({ date, doctorId: session.doctorId,
          startTime: r.start, endTime: r.end, missingMinutes: toMinutes(r.end) - toMinutes(r.start) })));
        handovers += handoverCount(cover);
      }
      const holiday = clinic.holidays.has(date), quota = holiday ? 1 : minFree;
      const checks = coverageSlots(clinic, current.map(a => dutyMap.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d),
        clinics, current.flatMap(a => intervals.get(a.id) || []));
      for (const h of checks) {
        const presentNurses = new Set(current.filter(a => {
          const duty = dutyMap.get(a.dutyWindowId);
          if (!present(a) || !duty || duty.startTime > h.start || duty.endTime < h.end) return false;
          return holiday || qualified.has(a.nurseId) && current.filter(other => other.nurseId === a.nurseId)
            .every(other => isFreeDuring(other, dutyMap.get(other.dutyWindowId), clinics, h.start, h.end));
        }).map(a => a.nurseId));
        requiredNurseClinicMinutes += Math.max(0, quota - presentNurses.size) * (toMinutes(h.end) - toMinutes(h.start));
      }
      dedicatedDeficit.set(date, holiday ? 0 : Math.max(0, minDedicated - new Set(current.filter(a => present(a) && dutyMap.has(a.dutyWindowId) &&
        qualified.has(a.nurseId) && isDedicated(a)).map(a => a.nurseId)).size));
    }
    return { gaps, concurrentDoctorMinutes, handovers, requiredNurseClinicMinutes, preferencePenalty, dedicatedDeficit };
  }

  function score(assignments: Assignment[], suppliedFindings?: ValidationFinding[]): SchedulingScore {
    const metrics = coverage(assignments);
    const findings = suppliedFindings || validate(assignments);
    const hard = findings.filter(f => f.severity === 'ERROR' && !gapFinding(f) &&
      !(f.id.startsWith('nc-coverage-') && f.date && selected.has(f.date)));
    // This quota is known without calling the validator, including during cheap candidate ranking.
    const dedicatedShortages = [...metrics.dedicatedDeficit.values()].filter(value => value > 0);
    const paid = new Map(leaveMinutes);
    const counts = new Map(nurses.filter(n => n.active).map(n => [n.id, { weekendDays: 0, lateShifts: 0, holidays: 0, nurseClinic: 0 }]));
    const unique = new Map<string, Assignment>();
    for (const a of assignments) if (a.scheduleId === schedule.id && a.date >= schedule.startDate && a.date <= schedule.endDate && !unique.has(cellKey(a))) unique.set(cellKey(a), a);
    for (const a of unique.values()) {
      const duty = dutyMap.get(a.dutyWindowId);
      if (!hasLeave(a)) paid.set(a.nurseId, (paid.get(a.nurseId) || 0) + dutyDurationHours(duty) * 60);
      const count = counts.get(a.nurseId);
      if (!count || !present(a) || !duty) continue;
      if (weekends.has(new Date(`${a.date}T00:00:00Z`).getUTCDay())) count.weekendDays++;
      if (duty.endTime >= lateTime) count.lateShifts++;
      if (clinic.holidays.has(a.date)) count.holidays++;
      if (isDedicated(a)) count.nurseClinic++;
    }
    let hoursImbalance = 0;
    for (const [nurseId, minutes] of target) hoursImbalance += Math.abs((paid.get(nurseId) || 0) - minutes);
    let fairnessPenalty = 0;
    for (const field of ['weekendDays', 'lateShifts', 'holidays', 'nurseClinic'] as const) {
      const ratios = nurses.filter(n => n.active).map(n => ((counts.get(n.id)?.[field] || 0) + (seeds.get(n.id)?.[field] || 0)) / Math.max(0.1, nurseContractShare(n)));
      const average = ratios.length ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length : 0;
      fairnessPenalty += ratios.reduce((sum, value) => sum + Math.abs(value - average), 0);
    }
    let preferencePenalty = metrics.preferencePenalty;
    for (const request of requests) {
      if (request.status === 'REJECTED' || !selected.has(request.date)) continue;
      const a = unique.get(`${request.nurseId}|${request.date}`);
      const follows = request.available ? !request.preferredDutyWindowId || a?.dutyWindowId === request.preferredDutyWindowId : !a;
      if (!follows) preferencePenalty += (request.status === 'APPROVED' ? 2 : 1) * (toMinutes(clinic.closeTime) - toMinutes(clinic.openTime));
    }
    const dutySignature = (a: Assignment) => canonical([a.dutyWindowId, isFloatShift(a) ? 'FLOAT' : a.kind,
      a.doctorId || '', a.secondDoctorId || '', a.clinicalRoleId || '', a.specialtyId || '',
      effectiveDoctorCoverage(a, dutyMap.get(a.dutyWindowId), daySessions.get(a.date) || [])]);
    const byCell = new Map(assignments.map(a => [cellKey(a), a]));
    const cells = new Set([...baselineByCell.keys(), ...byCell.keys()]);
    let changedDutyCount = 0;
    for (const key of cells) {
      const before = baselineByCell.get(key), after = byCell.get(key);
      if (!before || !after || dutySignature(before) !== dutySignature(after)) changedDutyCount++;
    }
    const fixedChanges = protectedChanges(assignments);
    return { hardViolations: hard.length + fixedChanges + dedicatedShortages.length,
      hardMagnitude: fixedChanges + hard.reduce((sum, f) => sum + Math.max(0, f.amount ?? 1), 0) +
        dedicatedShortages.reduce((sum, value) => sum + value, 0),
      requiredNurseClinicMinutes: metrics.requiredNurseClinicMinutes,
      uncoveredDoctorMinutes: metrics.gaps.reduce((sum, g) => sum + g.missingMinutes, 0),
      concurrentDoctorMinutes: metrics.concurrentDoctorMinutes, handovers: metrics.handovers,
      hoursImbalance, preferencePenalty, fairnessPenalty, changedDutyCount };
  }

  function admissible(before: Assignment[], after: Assignment[], beforeFindings = validate(before), afterFindings = validate(after)): boolean {
    const reference = input.baselineAssignments || before;
    if (protectedChanges(after, reference)) return false;
    const originalByCell = new Map(reference.map(a => [cellKey(a), a]));
    const seen = new Set<string>();
    const ids = new Set<string>();
    for (const a of after) {
      const key = cellKey(a);
      if (seen.has(key) || ids.has(a.id) || a.scheduleId !== schedule.id) return false;
      seen.add(key);
      ids.add(a.id);
      const original = originalByCell.get(key);
      const unchanged = original && canonical(original) === canonical(a);
      if (a.source !== 'GENERATED') {
        if (!unchanged && (!matchesLock(a) || a.manualDoctorOverlaps?.length || a.allocationReview)) return false;
        continue;
      }
      if (unchanged && fixed(original)) continue;
      if (a.manualDoctorOverlaps?.length || a.locked || !dutyMap.has(a.dutyWindowId)) return false;
      if (unchanged) continue;
      const duty = dutyMap.get(a.dutyWindowId)!;
      if (duty.active === false || !present(a)) return false;
      const reasons = checkAssignment({ assignments: after, surroundingAssignments: [...clinic.priorAssignments, ...clinic.followingAssignments],
        nurses, dutyWindows, leaveEntries, locks, roles, rules, availabilityRequests: requests, doctors, specialties, sessions }, a);
      if (reasons.length) return false;
    }
    const previous = new Map(beforeFindings.filter(f => f.severity === 'ERROR').map(f => [f.id, f]));
    for (const finding of afterFindings.filter(f => f.severity === 'ERROR')) {
      if (gapFinding(finding)) continue;
      const old = previous.get(finding.id);
      if (residualStaffingFinding(finding)) {
        if (!old || (finding.amount ?? 0) > (old.amount ?? 0) + EPSILON) return false;
        continue;
      }
      const implicated = after.filter(a => finding.cellRefs.some(cell => cell.nurseId === a.nurseId && cell.date === a.date) ||
        !finding.cellRefs.length && finding.affectedNurseIds.includes(a.nurseId));
      if (implicated.some(a => {
        const original = originalByCell.get(cellKey(a));
        return a.source === 'GENERATED' && !(original && fixed(original) && canonical(original) === canonical(a));
      })) return false;
      if (!old || (finding.amount ?? 0) > (old.amount ?? 0) + EPSILON ||
        finding.amount === undefined && old.amount === undefined && finding.message !== old.message) return false;
    }
    const priorCoverage = coverage(before), nextCoverage = coverage(after);
    // The validator reports one finding per date even when several dedicated
    // nurses are missing, so finding identity alone cannot measure this deficit.
    for (const [date, deficit] of nextCoverage.dedicatedDeficit) {
      if (deficit > (priorCoverage.dedicatedDeficit.get(date) || 0)) return false;
    }
    return nextCoverage.requiredNurseClinicMinutes <= priorCoverage.requiredNurseClinicMinutes + EPSILON;
  }

  return { score, validate, admissible, coverageGaps: (assignments: Assignment[]) => coverage(assignments).gaps,
    compare: compareSchedulingScores };
}
