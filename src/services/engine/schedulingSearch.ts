import type { Assignment, DoctorSession, DutyWindow, Nurse } from '../../types';
import type { ValidationFinding } from '../validation/ScheduleValidator';
import { createSchedulingObjective, type DoctorCoverageGap, type SchedulingObjectiveInput, type SchedulingScore } from './schedulingObjective';
import { assignmentCanCoverDoctor, nurseIsAvailable } from './assignmentPresence';
import { assignmentDoctorIds, canBeFreeNurse, coverageSlots, doctorSessionsOn, effectiveDoctorCoverage, freeDoctorIntervals,
  isFreeDuring, nurseClinicRoleOf, resolveClinicSetup, toMinutes, overlaps } from './clinicModel';
import { checkAssignment } from './assignmentChecks';
import { outsideNurseList } from './nurseList';
import { isExclusiveNurseClinic } from './nurseClinicUtils';
import { FLOAT_ROLE_ID, isFloatShift } from './floatShift';
import { LAST_RESORT_NOTE } from './lastResort';
import { withDoctorCoverage, normalizeGeneratedDoctorCoverage } from './timedAllocation';
import { resolveRule } from './SchedulingEngine';
import { dutyDurationHours, resolveNurseHoursBalance, countHoursInRange } from '../hours/hoursBalance';
import { shiftHoursAllowed } from '../hours/hoursPolicy';

export interface SchedulingSearchInput extends SchedulingObjectiveInput {
  initialAssignments: Assignment[];
  preservePaidDuties?: boolean;
}
export interface SchedulingSearchProgress {
  elapsedMs: number;
  bestUncoveredDoctorMinutes: number;
  examinedStates: number;
  acceptedExchanges: number;
}
export interface SchedulingSearchOptions {
  /** Absolute monotonic clock, shared with the worker client. */
  deadlineMs?: number;
  now?: () => number;
  isCancelled?: () => boolean;
  yieldControl?: () => Promise<void>;
  onProgress?: (progress: SchedulingSearchProgress) => void;
  maxStates?: number;
  maxChangedDuties?: number;
  maxExamined?: number;
  /** A deterministic limit for small clinic verification; normal runs use the time budget. */
  maxRounds?: number;
  /** Dedupe history has a fixed memory budget; small fixtures may lower it. */
  maxRetainedKeyBytes?: number;
}
export interface SchedulingSearchResult {
  assignments: Assignment[];
  score: SchedulingScore;
  findings: ValidationFinding[];
  termination: 'exhausted' | 'deadline' | 'limit';
  examined: number;
  accepted: number;
  elapsedMs: number;
}
export class SchedulingSearchCancelledError extends Error {
  constructor() { super('Schedule search cancelled. Nothing was saved.'); this.name = 'SchedulingSearchCancelledError'; }
}
class SearchDeadline extends Error {}
class SearchLimit extends Error {}
interface State { assignments: Assignment[]; score: SchedulingScore; findings: ValidationFinding[]; key: string }
interface Job { kind: 'doctor' | 'nurseClinic' | 'senior'; date: string; startTime: string; endTime: string; doctorId?: string; dedicated?: boolean }
interface Placement { assignments: Assignment[]; changed: Set<string>; removed: Assignment[] }
const cell = (a: Pick<Assignment, 'nurseId' | 'date'>) => `${a.nurseId}|${a.date}`;
const clock = () => performance.timeOrigin + performance.now();
const minutes = (a: { startTime: string; endTime: string }) => toMinutes(a.endTime) - toMinutes(a.startTime);
const jobKey = (a: Job) => `${a.kind}|${a.date}|${a.doctorId || ''}|${a.startTime}|${a.endTime}|${a.dedicated || false}`;

/** Compact deterministic 128 bit history key. A collision can only skip a proposal;
 * admission and final validation always inspect the complete candidate itself. */
function dedupeKey(value: string): string {
  let a = 1779033703, b = 3144134277, c = 1013904242, d = 2773480762;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    a = b ^ Math.imul(a ^ code, 597399067);
    b = c ^ Math.imul(b ^ code, 2869860233);
    c = d ^ Math.imul(c ^ code, 951274213);
    d = a ^ Math.imul(d ^ code, 2716044179);
  }
  a = Math.imul(c ^ a >>> 18, 597399067);
  b = Math.imul(d ^ b >>> 22, 2869860233);
  c = Math.imul(a ^ c >>> 17, 951274213);
  d = Math.imul(b ^ d >>> 19, 2716044179);
  return [a, b, c, d].map(part => (part >>> 0).toString(16).padStart(8, '0')).join('');
}

/** Search private candidates only. The caller alone decides whether to save the final checked result. */
export async function searchSchedule(input: SchedulingSearchInput, options: SchedulingSearchOptions = {}): Promise<SchedulingSearchResult> {
  const now = options.now || clock, started = now();
  const deadline = Math.min(options.deadlineMs ?? started + 110_000, started + 110_000);
  const width = Math.max(1, Math.min(24, options.maxStates ?? 24));
  const maxChanged = Math.max(1, Math.min(6, options.maxChangedDuties ?? 6));
  const maxExamined = Math.max(0, options.maxExamined ?? Infinity);
  const defaultKeyBudget = 64 * 1024 * 1024;
  const maxRetainedKeyBytes = Number.isFinite(options.maxRetainedKeyBytes)
    ? Math.max(0, Math.min(defaultKeyBudget, options.maxRetainedKeyBytes!)) : defaultKeyBudget;
  const maxTransactionKeyBytes = Math.min(16 * 1024 * 1024, maxRetainedKeyBytes);
  const objective = createSchedulingObjective({ ...input, baselineAssignments: input.baselineAssignments || input.initialAssignments });
  const clinic = resolveClinicSetup(input.clinicSetup);
  const dates: string[] = [];
  for (let d = new Date(`${input.schedule.startDate}T00:00:00Z`); d.toISOString().slice(0, 10) <= input.schedule.endDate; d.setUTCDate(d.getUTCDate() + 1)) {
    const date = d.toISOString().slice(0, 10);
    if (!input.selectedDates || input.selectedDates.includes(date)) dates.push(date);
  }
  const selected = new Set(dates), nurses = [...input.nurses].sort((a, b) => a.id.localeCompare(b.id));
  const nurseMap = new Map(nurses.map(n => [n.id, n])), dutyMap = new Map(input.dutyWindows.map(d => [d.id, d]));
  const doctors = input.doctors || [], specialties = input.specialties || [], sessions = input.sessions;
  const doctorsById = new Map(doctors.map(d => [d.id, d]));
  const daySessions = new Map(dates.map(date => [date, clinic.holidays.has(date) ? [] : doctorSessionsOn(sessions, date)]));
  const requests = [...new Map([...(input.clinicSetup?.availabilityRequests || []), ...(input.availabilityRequests || [])].map(r => [r.id, r])).values()];
  const presence = { leaveEntries: input.leaveEntries, locks: input.locks, availabilityRequests: requests };
  const coverContext = { ...presence, nurses, roles: input.roles, doctors, specialties, sessions };
  const baseline = new Map((input.baselineAssignments || input.initialAssignments).map(a => [cell(a), a]));
  const fixed = (a: Assignment) => !selected.has(a.date) || a.locked || a.source === 'LOCK' || a.source === 'MANUAL' && input.keepManual !== false;
  const movable = (a: Assignment) => selected.has(a.date) && !a.locked && a.source === 'GENERATED' && !input.locks.some(l => l.nurseId === a.nurseId && l.date === a.date);
  const paidFixed = (a: Assignment) => input.preservePaidDuties === true && baseline.has(cell(a));
  const present = (a: Assignment) => nurseIsAvailable(nurseMap.get(a.nurseId), a.date, presence);
  const eligible = (n: Nurse, doctorId: string, date: string) => {
    if (!nurseIsAvailable(n, date, presence) || !n.isClinicNurse || isExclusiveNurseClinic(n, input.roles) || doctorsById.get(doctorId)?.active === false) return false;
    const outside = outsideNurseList(n, { kind: 'DOCTOR', doctorId, date }, { doctors, specialties, sessions });
    return !outside?.eligibility;
  };
  const plus = resolveRule(input.rules, 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', 'rule-nurse-plus-one', ['additional nurse', 'above doctors', 'plus one']);
  const nc = resolveRule(input.rules, 'DEDICATED_NURSE_CLINIC', 'rule-nurse-clinic', ['nurse clinic coverage', 'dedicated nurse clinic', 'nurse clinic']);
  const senior = resolveRule(input.rules, 'SENIOR_ON_DUTY', 'rule-h1', ['senior nurse', 'senior on duty']);
  const hardQuota = (rule: typeof plus) => rule?.enabled === false || rule?.severity === 'SOFT' ? 0 : Math.max(0, rule?.value ?? 1);
  const minFree = hardQuota(plus), minDedicated = hardQuota(nc), seniorRequired = hardQuota(senior) > 0;
  const ncRoleId = nurseClinicRoleOf(input.roles)?.id || 'role-nurse-clinic';
  const seniorIds = new Set(input.seniorityLevels.filter(s => s.isSenior).map(s => s.id));
  const qualified = new Set(nurses.filter(n => canBeFreeNurse(n, input.roles)).map(n => n.id));
  const dedicated = (a: Assignment) => a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId === ncRoleId;
  const activeDuties = input.dutyWindows.filter(d => d.active !== false);
  const h7 = resolveRule(input.rules, 'MAX_WORKING_HOURS_PER_PERIOD', 'rule-h7-max-hours', ['maximum working hours', 'maximum hours per period']);
  const h7Hard = h7?.enabled !== false && h7?.severity !== 'SOFT';
  const maxPaid = new Map(nurses.map(n => {
    const target = resolveNurseHoursBalance(n, input.schedule, dutyMap, input.leaveEntries, input.leaveTypes || [],
      input.workingHoursPeriods || [], input.clinicSetup?.hoursHistory).targetHours;
    const leave = countHoursInRange(n.id, input.schedule.startDate, input.schedule.endDate, [], dutyMap, input.leaveEntries, input.leaveTypes || []).leaveHours;
    return [n.id, h7Hard ? shiftHoursAllowed(target, leave, (h7?.value ?? 105) / 100) : Infinity];
  }));
  const ranges = (a: Assignment) => effectiveDoctorCoverage(a, dutyMap.get(a.dutyWindowId), daySessions.get(a.date) || [])
    .filter(r => assignmentCanCoverDoctor(a, coverContext, r.doctorId));
  const busy = (a: Assignment) => ranges(a).reduce((sum, r) => sum + minutes(r), 0);
  const stateKey = (assignments: Assignment[]) => JSON.stringify([...assignments].sort((a, b) => cell(a).localeCompare(cell(b)))
    .map(a => [a.id, a.nurseId, a.date, a.dutyWindowId, a.kind, a.doctorId || '', a.secondDoctorId || '', a.clinicalRoleId || '', a.specialtyId || '',
      a.doctorCoverage || null, a.note?.startsWith(LAST_RESORT_NOTE) || false]));
  let examined = 0, accepted = 0, limited = false, yieldedAt = started, reportedAt = started, operations = 0;
  const checkpoint = () => {
    if (options.isCancelled?.()) throw new SchedulingSearchCancelledError();
    if (now() >= deadline) throw new SearchDeadline();
    if (examined >= maxExamined) throw new SearchLimit();
  };
  const tick = async () => {
    const current = now();
    if (current - reportedAt >= 500) report();
    if (++operations % 16 || current - yieldedAt < 8) return;
    await (options.yieldControl?.() || new Promise<void>(resolve => setTimeout(resolve, 0)));
    yieldedAt = now(); checkpoint();
  };

  const staffingJobs = (assignments: Assignment[]): Job[] => {
    const jobs: Job[] = [];
    for (const date of dates) {
      const day = assignments.filter(a => a.date === date), clinics = daySessions.get(date) || [], holiday = clinic.holidays.has(date);
      const quota = holiday ? 1 : minFree;
      const hasDedicated = new Set(day.filter(a => present(a) && qualified.has(a.nurseId) && dedicated(a)).map(a => a.nurseId)).size;
      for (const interval of coverageSlots(clinic, day.map(a => dutyMap.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d), clinics, day.flatMap(ranges))) {
        const free = new Set(day.filter(a => {
          const duty = dutyMap.get(a.dutyWindowId);
          return present(a) && duty && duty.startTime <= interval.start && duty.endTime >= interval.end &&
            (holiday || qualified.has(a.nurseId) && day.filter(other => other.nurseId === a.nurseId)
              .every(other => isFreeDuring(other, dutyMap.get(other.dutyWindowId), clinics, interval.start, interval.end)));
        }).map(a => a.nurseId)).size;
        if (free < quota) {
          const last = jobs[jobs.length - 1];
          if (last?.kind === 'nurseClinic' && last.date === date && last.endTime === interval.start && last.dedicated === (hasDedicated < minDedicated)) last.endTime = interval.end;
          else jobs.push({ kind: 'nurseClinic', date, startTime: interval.start, endTime: interval.end, dedicated: hasDedicated < minDedicated });
        }
      }
      if (!holiday && hasDedicated < minDedicated && !jobs.some(j => j.date === date && j.kind === 'nurseClinic' && j.dedicated)) {
        jobs.push({ kind: 'nurseClinic', date, startTime: clinic.openTime, endTime: clinic.closeTime, dedicated: true });
      }
      if (seniorRequired && !day.some(a => present(a) && dutyMap.has(a.dutyWindowId) && seniorIds.has(nurseMap.get(a.nurseId)?.seniorityLevelId || ''))) {
        jobs.push({ kind: 'senior', date, startTime: clinic.openTime, endTime: clinic.closeTime });
      }
    }
    return jobs;
  };
  const doctorJob = (gap: DoctorCoverageGap): Job => ({ kind: 'doctor', ...gap });
  const jobEligible = (n: Nurse, job: Job) => job.kind === 'doctor' ? eligible(n, job.doctorId!, job.date)
    : nurseIsAvailable(n, job.date, presence) && (job.kind === 'senior' ? seniorIds.has(n.seniorityLevelId) : clinic.holidays.has(job.date) || qualified.has(n.id));
  const jobsFor = (list: Assignment[]) => [...staffingJobs(list), ...objective.coverageGaps(list).sort((a, b) =>
    nurses.filter(n => eligible(n, a.doctorId, a.date)).length - nurses.filter(n => eligible(n, b.doctorId, b.date)).length ||
    b.missingMinutes - a.missingMinutes || a.date.localeCompare(b.date) || a.doctorId.localeCompare(b.doctorId)).map(doctorJob)];

  function build(job: Job, nurse: Nurse, duty: DutyWindow, previous: Assignment | undefined, preserve: boolean, share: boolean): Assignment | undefined {
    const base: Assignment = { id: previous?.id || `asgn-search-${input.schedule.id}-${nurse.id}-${job.date}`,
      nurseId: nurse.id, scheduleId: input.schedule.id, date: job.date, dutyWindowId: duty.id, source: 'GENERATED', locked: false,
      kind: 'CLINICAL_ROLE', clinicalRoleId: FLOAT_ROLE_ID };
    if (job.kind !== 'doctor') return { ...base, clinicalRoleId: job.kind === 'nurseClinic' && job.dedicated ? ncRoleId : FLOAT_ROLE_ID,
      note: job.kind === 'senior' ? 'Senior cover improved by schedule search' : 'Nurse Clinic cover improved by schedule search' };
    let own = preserve && previous?.kind === 'DOCTOR' ? effectiveDoctorCoverage(previous, dutyMap.get(previous.dutyWindowId), daySessions.get(job.date) || []) : [];
    if (own.some(r => r.startTime < duty.startTime || r.endTime > duty.endTime)) return undefined;
    const ids = [...new Set([...own.map(r => r.doctorId), job.doctorId!])];
    if (ids.length > 2 || share && ids.some(id => !doctorsById.get(id)?.lowAcuity)) return undefined;
    const free = share || !own.length ? [duty] : freeDoctorIntervals({ ...previous!, doctorCoverage: own }, duty, daySessions.get(job.date) || []);
    const extra = free.flatMap(range => {
      const startTime = [range.startTime, duty.startTime, job.startTime].sort().at(-1)!;
      const endTime = [range.endTime, duty.endTime, job.endTime].sort()[0];
      return startTime < endTime ? [{ doctorId: job.doctorId!, startTime, endTime }] : [];
    });
    if (!extra.length) return undefined;
    const next = withDoctorCoverage(base, [...own, ...extra]);
    const outside = assignmentDoctorIds(next).some(doctorId => !!outsideNurseList(nurse, { ...next, doctorId, secondDoctorId: undefined }, { doctors, specialties, sessions }));
    next.note = outside ? LAST_RESORT_NOTE : 'Doctor cover improved by schedule search';
    return next;
  }

  function* placements(job: Job, list: Assignment[], used: Set<string>): Generator<Placement> {
    const ordered = nurses.filter(n => jobEligible(n, job)).sort((a, b) => {
      const own = (n: Nurse) => list.find(s => s.nurseId === n.id && s.date === job.date);
      const weight = (n: Nurse) => { const a = own(n); return a ? isFloatShift(a) ? 0 : 1 : 2; };
      return weight(a) - weight(b) || a.id.localeCompare(b.id);
    });
    for (const nurse of ordered) {
      checkpoint();
      const key = `${nurse.id}|${job.date}`, previous = list.find(a => cell(a) === key);
      if (used.has(key) || previous && (!movable(previous) || fixed(previous))) continue;
      if (!previous && input.locks.some(l => l.nurseId === nurse.id && l.date === job.date)) continue;
      const duties = activeDuties.filter(d => (!previous || !paidFixed(previous) || d.id === previous.dutyWindowId) &&
        overlaps(d.startTime, d.endTime, job.startTime, job.endTime)).sort((a, b) => {
        const covered = (d: DutyWindow) => Math.min(toMinutes(d.endTime), toMinutes(job.endTime)) - Math.max(toMinutes(d.startTime), toMinutes(job.startTime));
        return covered(b) - covered(a) || minutes(a) - minutes(b) || a.id.localeCompare(b.id);
      });
      const local = new Set<string>();
      for (const duty of duties) for (const mode of job.kind === 'doctor' ? [0, 1, 2] : [1]) {
        checkpoint();
        const replacement = build(job, nurse, duty, previous, mode !== 1, mode === 2);
        if (!replacement) continue;
        const next = previous ? list.map(a => a === previous ? replacement : a) : [...list, replacement];
        const keyNext = dedupeKey(stateKey(next));
        if (local.has(keyNext)) continue; local.add(keyNext);
        const changed = new Set([...used, key]);
        const removed = previous ? [previous] : [];
        yield { assignments: next, changed, removed };
        if (changed.size >= maxChanged) continue;
        const reasons = checkAssignment({ assignments: next, surroundingAssignments: [...clinic.priorAssignments, ...clinic.followingAssignments],
          nurses, dutyWindows: input.dutyWindows, leaveEntries: input.leaveEntries, locks: input.locks, roles: input.roles, rules: input.rules,
          availabilityRequests: requests, doctors, specialties, sessions }, replacement);
        const nurseHours = next.filter(a => a.nurseId === nurse.id).reduce((sum, a) => sum + dutyDurationHours(dutyMap.get(a.dutyWindowId)), 0);
        const needsDonor = reasons.length > 0 || nurseHours > (maxPaid.get(nurse.id) ?? Infinity) + 1e-7;
        const donors = list.filter(a => a.nurseId === nurse.id && a.date !== job.date && movable(a) && !paidFixed(a) && !used.has(cell(a)))
          .filter(a => needsDonor || isFloatShift(a)).sort((a, b) => {
            const adjacent = (a: Assignment) => Math.abs(new Date(a.date).getTime() - new Date(job.date).getTime()) <= 86_400_000 ? 0 : 1;
            return (needsDonor && reasons.length ? adjacent(a) - adjacent(b) : 0) || busy(a) - busy(b) || a.date.localeCompare(b.date);
          });
        const selections = donors.map(a => [a]);
        if (needsDonor) for (let count = 2; count <= Math.min(maxChanged - changed.size, donors.length); count++) selections.push(donors.slice(0, count));
        for (const removedDonors of selections) {
          checkpoint();
          const cells = new Set([...changed, ...removedDonors.map(cell)]);
          if (cells.size > maxChanged) continue;
          const ids = new Set(removedDonors.map(a => a.id));
          yield { assignments: next.filter(a => !ids.has(a.id)), changed: cells, removed: [...removed, ...removedDonors] };
        }
      }
    }
  }

  function* transactions(job: Job, state: State): Generator<Assignment[]> {
    const originalStaffing = staffingJobs(state.assignments);
    const stack: { assignments: Assignment[]; changed: Set<string>; pending: Job[] }[] = [{ assignments: state.assignments, changed: new Set(), pending: [job] }];
    const local = new Set<string>(); let expanded = 0, localKeyBytes = 0;
    while (stack.length) {
      checkpoint();
      if (++expanded > 128) { limited = true; break; }
      const partial = stack.pop()!, target = partial.pending[0];
      if (!target) continue;
      let branches = 0;
      for (const placed of placements(target, partial.assignments, partial.changed)) {
        checkpoint();
        const key = dedupeKey(stateKey(placed.assignments));
        if (local.has(key)) continue;
        // Count UTF 16 storage conservatively, including keys for rejected proposals.
        const keyBytes = key.length * 2;
        if (localKeyBytes + keyBytes > maxTransactionKeyBytes) throw new SearchLimit();
        localKeyBytes += keyBytes; local.add(key);
        yield placed.assignments;
        if (placed.changed.size >= maxChanged) continue;
        const gaps = objective.coverageGaps(placed.assignments);
        const lost = placed.removed.flatMap(a => ranges(a).flatMap(r => gaps.filter(g => g.date === a.date && g.doctorId === r.doctorId &&
          overlaps(g.startTime, g.endTime, r.startTime, r.endTime)).map(doctorJob)));
        const newStaffing = staffingJobs(placed.assignments).filter(j => !originalStaffing.some(old => old.kind === j.kind && old.date === j.date &&
          old.dedicated === j.dedicated && old.startTime <= j.startTime && old.endTime >= j.endTime));
        const pending = [...newStaffing, ...lost, ...partial.pending.slice(1)];
        const unique = [...new Map(pending.map(j => [jobKey(j), j])).values()];
        if (unique.length && branches++ < 16) stack.push({ assignments: placed.assignments, changed: placed.changed, pending: unique });
        else if (unique.length) limited = true;
      }
    }
  }

  if (options.isCancelled?.()) throw new SchedulingSearchCancelledError();
  let initial = [...input.initialAssignments];
  if (now() < deadline) {
    const normalized = normalizeGeneratedDoctorCoverage({ assignments: initial, dates, sessions, duties: input.dutyWindows,
      nurses, doctors, roles: input.roles, clinic, minFreeNurses: minFree,
      movable, present, canCover: (a, s: DoctorSession) => assignmentCanCoverDoctor(a, coverContext, s.doctorId),
      canPair: (nurseId, s) => eligible(nurseMap.get(nurseId)!, s.doctorId, s.date) });
    if (objective.admissible(initial, normalized)) initial = normalized;
  }
  const initialFindings = objective.validate(initial);
  let best: State = { assignments: initial, findings: initialFindings, score: objective.score(initial, initialFindings), key: stateKey(initial) };
  let frontier = [best];
  const initialHistoryKey = dedupeKey(best.key);
  const visited = new Set<string>([initialHistoryKey]);
  let retainedKeyBytes = initialHistoryKey.length * 2;
  let termination: SchedulingSearchResult['termination'] = 'exhausted';
  function report() {
    reportedAt = now();
    options.onProgress?.({ elapsedMs: Math.max(0, reportedAt - started), bestUncoveredDoctorMinutes: best.score.uncoveredDoctorMinutes,
      examinedStates: examined, acceptedExchanges: accepted });
  }
  try {
    checkpoint(); report();
    if (retainedKeyBytes > maxRetainedKeyBytes) throw new SearchLimit();
    let rounds = 0;
    while (frontier.length) {
      if (rounds++ >= (options.maxRounds ?? Infinity)) { termination = 'limit'; break; }
      const ranked: { assignments: Assignment[]; score: SchedulingScore; key: string; parent: State }[] = [];
      const admitted = new Map<string, State>();
      const flush = async () => {
        for (const candidate of ranked) {
          checkpoint();
          const findings = objective.validate(candidate.assignments);
          if (!objective.admissible(candidate.parent.assignments, candidate.assignments, candidate.parent.findings, findings)) { await tick(); continue; }
          const score = objective.score(candidate.assignments, findings);
          const state: State = { assignments: candidate.assignments, key: candidate.key, findings, score };
          accepted++;
          if (objective.compare(score, best.score) < 0) { best = state; report(); }
          admitted.set(state.key, state);
          if (admitted.size > width) {
            const ordered = [...admitted.values()].sort((a, b) => objective.compare(a.score, b.score) || a.key.localeCompare(b.key));
            admitted.delete(ordered[ordered.length - 1].key);
          }
          await tick();
        }
        ranked.length = 0;
      };
      for (const state of frontier) {
        checkpoint();
        for (const job of jobsFor(state.assignments)) {
          checkpoint();
          for (const candidate of transactions(job, state)) {
            checkpoint();
            const key = stateKey(candidate);
            const historyKey = dedupeKey(key);
            if (visited.has(historyKey)) continue;
            const keyBytes = historyKey.length * 2;
            if (retainedKeyBytes + keyBytes > maxRetainedKeyBytes) throw new SearchLimit();
            retainedKeyBytes += keyBytes;
            visited.add(historyKey); examined++;
            const changed = candidate.filter(a => !state.assignments.some(old => old === a));
            if (changed.some(a => checkAssignment({ assignments: candidate, surroundingAssignments: [...clinic.priorAssignments, ...clinic.followingAssignments],
              nurses, dutyWindows: input.dutyWindows, leaveEntries: input.leaveEntries, locks: input.locks, roles: input.roles,
              rules: input.rules, availabilityRequests: requests, doctors, specialties, sessions }, a).length > 0)) { await tick(); continue; }
            ranked.push({ assignments: candidate, score: objective.score(candidate, []), key, parent: state });
            ranked.sort((a, b) => objective.compare(a.score, b.score) || a.key.localeCompare(b.key));
            if (ranked.length > width * 4) ranked.length = width * 4;
            // Validate throughout exploration, so a deadline returns an improved checked
            // candidate instead of losing every proposal from an unfinished beam round.
            if (ranked.length >= Math.max(8, width)) await flush();
            await tick();
          }
        }
      }
      checkpoint();
      await flush();
      frontier = [...admitted.values()].sort((a, b) => objective.compare(a.score, b.score) || a.key.localeCompare(b.key));
      report();
    }
    if (limited) termination = 'limit';
  } catch (error) {
    if (error instanceof SearchDeadline) termination = 'deadline';
    else if (error instanceof SearchLimit) termination = 'limit';
    else throw error;
  }
  if (options.isCancelled?.()) throw new SchedulingSearchCancelledError();
  report();
  return { assignments: best.assignments, score: best.score, findings: best.findings, termination, examined, accepted, elapsedMs: Math.max(0, now() - started) };
}
