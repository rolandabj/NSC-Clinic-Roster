import type { Assignment, Schedule } from '../../types';
import { ScheduleValidator, type ValidationFinding } from '../validation/ScheduleValidator';
import { getWeekendDays, setClinicWeekendDays } from '../../utils/weekend';
import { SchedulingEngine } from './SchedulingEngine';
import { assignmentCanCoverDoctor, nurseIsAvailable } from './assignmentPresence';
import { doctorSessionsOn, effectiveDoctorCoverage, resolveClinicSetup } from './clinicModel';
import { applyPreferenceFocus } from './preferenceOrder';
import { outsideNurseList } from './nurseList';
import { createSchedulingObjective, type SchedulingObjectiveInput, type SchedulingScore } from './schedulingObjective';
import { normalizeGeneratedDoctorCoverage } from './timedAllocation';
import { searchSchedule } from './schedulingSearch';
import { MAX_SCHEDULING_RUN_MS, SCHEDULING_VALIDATION_RESERVE_MS, schedulingClockMs,
  type SchedulingRunInput, type SchedulingRunResult, type SchedulingSearchSummary,
  type SchedulingWorkerProgress, type SchedulingWorkerRequest } from './workerProtocol';

interface WorkerSearchInput extends SchedulingObjectiveInput { initialAssignments: Assignment[] }
interface WorkerSearchOptions {
  deadlineMs?: number;
  now?: () => number;
  isCancelled?: () => boolean;
  yieldControl?: () => Promise<void>;
  onProgress?: (progress: { elapsedMs: number; bestUncoveredDoctorMinutes: number; examinedStates: number; acceptedExchanges: number }) => void;
}
interface WorkerSearchResult {
  assignments: Assignment[];
  findings: ValidationFinding[];
  score: SchedulingScore;
  termination: 'exhausted' | 'deadline' | 'limit';
  examined: number;
  accepted: number;
  elapsedMs: number;
}
type WorkerSearch = (input: WorkerSearchInput, options?: WorkerSearchOptions) => Promise<WorkerSearchResult>;
export interface SchedulingWorkerDependencies {
  now?: () => number;
  isCancelled?: () => boolean;
  generate?: typeof SchedulingEngine.generate;
  search?: WorkerSearch;
}

export class SchedulingRunnerCancelledError extends Error {
  constructor() { super('Filling was cancelled. Nothing was saved.'); this.name = 'AbortError'; }
}
export class SchedulingRunnerTimeoutError extends Error {
  constructor() { super('The schedule search exceeded its time limit. Nothing was saved. Try again.'); this.name = 'SchedulingTimeoutError'; }
}
export class SchedulingRunnerValidationError extends Error {
  constructor() { super('The final schedule did not pass the safety checks. Nothing was saved. Try again.'); this.name = 'SchedulingValidationError'; }
}

function selectedDates(input: SchedulingRunInput): string[] {
  const dates: string[] = [], range = input.options?.onlyDates;
  for (let day = new Date(`${input.schedule.startDate}T00:00:00Z`); day.toISOString().slice(0, 10) <= input.schedule.endDate;
    day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10);
    if (!range || date >= range.start && date <= range.end) dates.push(date);
  }
  return dates;
}

function validate(input: SchedulingRunInput, assignments: Assignment[], schedule = input.schedule) {
  return ScheduleValidator.validate(schedule, assignments, input.nurses, input.seniorityLevels, input.dutyWindows,
    input.sessions, input.leaveEntries, input.locks, input.roles, input.rules, input.workingHoursPeriods,
    input.specialties, input.doctors, input.leaveTypes, input.clinicSetup, input.clinicSetup.availabilityRequests || []);
}

/** Existing Empty only duties keep their paid place and length while their doctor times may improve. */
function emptyOnlySeedInput(input: SchedulingRunInput): Assignment[] {
  if (input.mode !== 'EMPTY_ONLY') return input.assignments;
  const nurses = new Map(input.nurses.map(n => [n.id, n]));
  return input.assignments.map(a => a.source === 'GENERATED' && !a.locked &&
    nurseIsAvailable(nurses.get(a.nurseId), a.date, { leaveEntries: input.leaveEntries, locks: input.locks,
      availabilityRequests: input.clinicSetup.availabilityRequests || [] }) ? { ...a, source: 'MANUAL' as const } : a);
}

function restoreSeed(input: SchedulingRunInput, constructed: Assignment[], dates: string[]): Assignment[] {
  const selected = new Set(dates), originalById = new Map(input.assignments.map(a => [a.id, a]));
  let result = [...input.assignments.filter(a => !selected.has(a.date)), ...constructed.filter(a => selected.has(a.date))];
  if (input.mode !== 'EMPTY_ONLY') return result;
  result = result.map(a => {
    const original = originalById.get(a.id);
    if (original?.source !== 'GENERATED' || a.source !== 'MANUAL') return a;
    const { manualDoctorOverlaps: _inherited, ...restored } = a;
    return { ...restored, source: original.source };
  });
  const nurses = new Map(input.nurses.map(n => [n.id, n]));
  const presence = { leaveEntries: input.leaveEntries, locks: input.locks,
    availabilityRequests: input.clinicSetup.availabilityRequests || [] };
  const context = { ...presence, nurses: input.nurses, doctors: input.doctors, roles: input.roles,
    specialties: input.specialties, sessions: input.sessions };
  return normalizeGeneratedDoctorCoverage({ assignments: result, dates, sessions: input.sessions, duties: input.dutyWindows,
    nurses: input.nurses, doctors: input.doctors, roles: input.roles, clinic: resolveClinicSetup(input.clinicSetup), minFreeNurses: 0,
    movable: a => a.source === 'GENERATED' && !a.locked && selected.has(a.date),
    present: a => nurseIsAvailable(nurses.get(a.nurseId), a.date, presence),
    canCover: (a, session) => assignmentCanCoverDoctor(a, context, session.doctorId), canPair: () => false });
}

function clearAssignments(input: SchedulingRunInput, dates: string[]): Assignment[] {
  const selected = new Set(dates);
  const pinned = new Set(input.locks.filter(lock => lock.mode === 'ASSIGNMENT').map(lock => `${lock.nurseId}|${lock.date}`));
  return input.assignments.filter(a => !selected.has(a.date) || a.locked || a.source === 'LOCK' ||
    pinned.has(`${a.nurseId}|${a.date}`) || a.source === 'MANUAL' && !input.options?.clearIncludeManual);
}

/** Count the final contributions, since exchanges can change every constructor pairing counter. */
function finalPairings(input: SchedulingRunInput, assignments: Assignment[], dates: string[]) {
  const selected = new Set(dates), clinic = resolveClinicSetup(input.clinicSetup);
  const nurses = new Map(input.nurses.map(applyPreferenceFocus).map(n => [n.id, n]));
  const duties = new Map(input.dutyWindows.map(d => [d.id, d]));
  const context = { nurses: input.nurses, doctors: input.doctors, sessions: input.sessions, roles: input.roles,
    specialties: input.specialties, leaveEntries: input.leaveEntries, locks: input.locks,
    availabilityRequests: input.clinicSetup.availabilityRequests || [] };
  const stats = { doctorSessionsTotal: 0, doctorPriority1PairingsCount: 0, doctorPriority2PairingsCount: 0,
    doctorPriority3PlusPairingsCount: 0, doctorSpecialtyPairingsCount: 0, doctorFallbackPairingsCount: 0 };
  let unassignedSessions = 0;
  for (const date of selected) {
    if (clinic.holidays.has(date)) continue;
    const sessions = doctorSessionsOn(input.sessions, date);
    for (const session of sessions) {
      stats.doctorSessionsTotal++;
      const cover = assignments.filter(a => a.date === date && assignmentCanCoverDoctor(a, context, session.doctorId) &&
        effectiveDoctorCoverage(a, duties.get(a.dutyWindowId), sessions).some(r => r.doctorId === session.doctorId));
      if (!cover.length) unassignedSessions++;
      for (const a of cover) {
        const preferences = nurses.get(a.nurseId)?.preferences || [];
        const namedRank = Math.min(Infinity, ...preferences.filter(p => p.kind === 'DOCTOR' && p.refId === session.doctorId).map(p => p.rank));
        if (namedRank === 1) stats.doctorPriority1PairingsCount++;
        else if (namedRank === 2) stats.doctorPriority2PairingsCount++;
        else if (Number.isFinite(namedRank)) stats.doctorPriority3PlusPairingsCount++;
        else if (preferences.some(p => p.kind === 'SPECIALTY' && !outsideNurseList({ preferences: [p] },
          { kind: 'DOCTOR', doctorId: session.doctorId, date }, input))) stats.doctorSpecialtyPairingsCount++;
        else stats.doctorFallbackPairingsCount++;
      }
    }
  }
  return { ...stats, unassignedSessions };
}

/** Runs only private computation. The browser receives assignments after the last validation. */
export async function runSchedulingWorker(request: SchedulingWorkerRequest,
  onProgress?: (progress: SchedulingWorkerProgress) => void,
  dependencies: SchedulingWorkerDependencies = {}): Promise<SchedulingRunResult> {
  const now = dependencies.now || schedulingClockMs;
  const budget = Number.isFinite(request.budgetMs) ? Math.max(1, Math.min(MAX_SCHEDULING_RUN_MS, request.budgetMs)) : MAX_SCHEDULING_RUN_MS;
  const deadline = request.startedAtMs + budget;
  const searchDeadline = deadline - Math.min(SCHEDULING_VALIDATION_RESERVE_MS, Math.max(1, budget / 4));
  // The final check uses a separate snapshot that construction and search never receive.
  // A candidate cannot authorize its own changes by accidentally editing its baseline.
  const originalInput = structuredClone(request.input);
  const input = structuredClone(originalInput), dates = selectedDates(originalInput);
  const checkActive = () => {
    if (dependencies.isCancelled?.()) throw new SchedulingRunnerCancelledError();
    if (!Number.isFinite(request.startedAtMs) || now() >= deadline) throw new SchedulingRunnerTimeoutError();
  };
  const emit = (phase: SchedulingWorkerProgress['phase'], statusText: string, percent: number,
    extra: Partial<Pick<SchedulingWorkerProgress, 'currentDay' | 'currentDate' | 'bestUncoveredDoctorMinutes' | 'examinedStates' | 'acceptedExchanges'>> = {}) => {
    checkActive();
    onProgress?.({ phase, currentDay: extra.currentDay || 0, totalDays: dates.length, currentDate: extra.currentDate || '',
      statusText, percent, elapsedMs: Math.max(0, now() - request.startedAtMs), remainingMs: Math.max(0, deadline - now()),
      bestUncoveredDoctorMinutes: extra.bestUncoveredDoctorMinutes, examinedStates: extra.examinedStates,
      acceptedExchanges: extra.acceptedExchanges });
  };
  checkActive();
  const previousWeekends = [...getWeekendDays()];
  // Each dedicated worker has its own module state and no localStorage. Construction
  // and search therefore share the serialized clinic weekend rather than a browser default.
  setClinicWeekendDays(input.weekendDays);
  try {
    if (input.mode === 'CLEAR_GENERATED') {
      emit('validating', 'Checking the cleared roster', 96);
      const assignments = clearAssignments(input, dates);
      const validation = validate(input, assignments);
      checkActive();
      return { scheduleId: input.schedule.id, assignments, createdCount: 0,
        preservedLocksCount: assignments.filter(a => a.locked || a.source === 'LOCK').length,
        preservedManualCount: assignments.filter(a => a.source === 'MANUAL').length, unmetSlotsCount: 0,
        generationDurationMs: Math.max(0, now() - request.startedAtMs), validation,
        search: { termination: 'clear', initialUncoveredDoctorMinutes: 0, finalUncoveredDoctorMinutes: 0, examined: 0,
          accepted: 0, elapsedMs: Math.max(0, now() - request.startedAtMs), remainingHardProblems: validation.errorCount,
          remainingNurseClinicMinutes: 0 } };
    }
    emit('constructing', 'Building a starting roster', 1);
    const generate = dependencies.generate || SchedulingEngine.generate;
    const constructed = await generate(input.schedule, input.mode, emptyOnlySeedInput(input), input.nurses,
      input.seniorityLevels, input.dutyWindows, input.roles, input.specialties, input.sessions, input.locks,
      input.leaveEntries, input.rules, progress => {
        emit('constructing', progress.statusText, Math.max(1, Math.min(45, progress.percent * 0.45)),
          { currentDay: progress.currentDay, currentDate: progress.currentDate });
      }, input.workingHoursPeriods, input.doctors, input.leaveTypes, input.clinicSetup, input.options);
    checkActive();
    const schedule: Schedule = { ...input.schedule,
      ...(constructed.effectiveFullTimeTarget ? { hoursTargetFullTime: constructed.effectiveFullTimeTarget } : {}),
      ...(constructed.periodName ? { periodName: constructed.periodName } : {}) };
    const objectiveInput: WorkerSearchInput = { ...input, schedule: { ...schedule }, baselineAssignments: input.assignments,
      initialAssignments: restoreSeed(input, constructed.assignments, dates), selectedDates: [...dates],
      keepManual: input.options?.keepManual, preservePaidDuties: input.mode === 'EMPTY_ONLY', weekendDays: input.weekendDays };
    const objective = createSchedulingObjective(objectiveInput);
    const initialFindings = objective.validate(objectiveInput.initialAssignments);
    const initialScore = objective.score(objectiveInput.initialAssignments, initialFindings);
    emit('searching', 'Searching for better doctor cover', 46, { bestUncoveredDoctorMinutes: initialScore.uncoveredDoctorMinutes });
    let chosen: WorkerSearchResult = { assignments: objectiveInput.initialAssignments, findings: initialFindings,
      score: initialScore, termination: 'deadline', examined: 0, accepted: 0, elapsedMs: 0 };
    if (now() < searchDeadline) {
      const search: WorkerSearch = dependencies.search || searchSchedule;
      chosen = await search(objectiveInput, { deadlineMs: searchDeadline, now, isCancelled: dependencies.isCancelled,
        yieldControl: () => new Promise(resolve => setTimeout(resolve, 0)), onProgress: progress => {
          emit('searching', 'Searching for better doctor cover', Math.min(94, 46 + 48 * Math.max(0, now() - request.startedAtMs) /
            Math.max(1, searchDeadline - request.startedAtMs)), { bestUncoveredDoctorMinutes: progress.bestUncoveredDoctorMinutes,
            examinedStates: progress.examinedStates, acceptedExchanges: progress.acceptedExchanges });
        } });
    }
    checkActive();
    emit('validating', 'Checking the final roster', 96, { bestUncoveredDoctorMinutes: chosen.score.uncoveredDoctorMinutes,
      examinedStates: chosen.examined, acceptedExchanges: chosen.accepted });
    const finalObjective = createSchedulingObjective({ ...originalInput, schedule, baselineAssignments: originalInput.assignments,
      selectedDates: dates, keepManual: originalInput.options?.keepManual,
      preservePaidDuties: originalInput.mode === 'EMPTY_ONLY', weekendDays: originalInput.weekendDays });
    const validation = validate(originalInput, chosen.assignments, schedule);
    const baselineFindings = finalObjective.validate(originalInput.assignments);
    if (!finalObjective.admissible(originalInput.assignments, chosen.assignments, baselineFindings, validation.findings)) throw new SchedulingRunnerValidationError();
    const finalScore = finalObjective.score(chosen.assignments, validation.findings);
    checkActive();
    const originalIds = new Set(originalInput.assignments.map(a => a.id));
    const finalStats = finalPairings(originalInput, chosen.assignments, dates);
    const nonDoctorJobs = new Set(validation.findings.filter(f => f.severity === 'ERROR' &&
      /^(cov-gap-|nc-coverage-|role-quota-|holiday-gap-|holiday-no-nurse-)/.test(f.id)).map(f => `${f.date}|${f.category}`)).size;
    const summary: SchedulingSearchSummary = { termination: chosen.termination, initialUncoveredDoctorMinutes: initialScore.uncoveredDoctorMinutes,
      finalUncoveredDoctorMinutes: finalScore.uncoveredDoctorMinutes, examined: chosen.examined, accepted: chosen.accepted,
      elapsedMs: Math.max(0, now() - request.startedAtMs), remainingHardProblems: validation.errorCount,
      remainingNurseClinicMinutes: finalScore.requiredNurseClinicMinutes };
    const { unassignedSessions, ...pairingCounts } = finalStats;
    return { ...constructed, ...pairingCounts, scheduleId: input.schedule.id, assignments: chosen.assignments,
      createdCount: chosen.assignments.filter(a => a.source === 'GENERATED' && !originalIds.has(a.id)).length,
      preservedLocksCount: chosen.assignments.filter(a => a.source === 'LOCK' || a.locked).length,
      preservedManualCount: chosen.assignments.filter(a => a.source === 'MANUAL').length,
      unmetSlotsCount: unassignedSessions + nonDoctorJobs, generationDurationMs: summary.elapsedMs, search: summary, validation };
  } finally {
    setClinicWeekendDays(previousWeekends);
  }
}
