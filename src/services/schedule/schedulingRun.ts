import type { DoctorSession } from '../../types';
import { parseDayMonthYear } from '../../utils/dateUtils';
import type { IRepository } from '../repository/IRepository';
import { resolveClinicSetup } from '../engine/clinicModel';
import { MAX_SCHEDULING_RUN_MS, schedulingClockMs, type SchedulingRunInput, type SchedulingRunResult,
  type SchedulingWorkerProgress } from '../engine/workerProtocol';
import { SchedulingCancelledError, SchedulingTimeoutError, startSchedulingWorker, type SchedulingWorkerJob } from '../engine/schedulingWorkerClient';
import { assertGenerationInputsCurrent, cloneGenerationInputs, loadGenerationInputs, type GenerationInputs } from './generationSaveGuard';
import { generateDoctorSessionsForDateRange, missingPatternSessions } from './doctorScheduleService';

export interface SchedulingCommit {
  baseline: GenerationInputs;
  fresh: GenerationInputs;
  result: SchedulingRunResult;
  addedSessions: DoctorSession[];
}
interface SchedulingRunDependencies {
  loadInputs: typeof loadGenerationInputs;
  assertCurrent: typeof assertGenerationInputsCurrent;
  startWorker: typeof startSchedulingWorker;
  clock: () => number;
}
export interface SchedulingRunOptions {
  repo: IRepository;
  scheduleId: string;
  mode: SchedulingRunInput['mode'];
  options?: SchedulingRunInput['options'];
  onProgress?: (progress: SchedulingWorkerProgress) => void;
  /** Detect local edits or a switched roster as well as server changes. */
  assertLocalCurrent?: () => void;
  onCommitStart?: () => void;
  /** The only place where backups, clinics or the final roster may be written. */
  commit: (commit: SchedulingCommit) => Promise<void>;
  budgetMs?: number;
  /** Tests replace asynchronous boundaries, never the production persistence checks. */
  dependencies?: Partial<SchedulingRunDependencies>;
}
export interface SchedulingRun {
  promise: Promise<SchedulingRunResult>;
  cancel: () => void;
  isCommitting: () => boolean;
}

/** Keep computation and validation private until one explicit commit cutoff. */
export function startSchedulingRun(options: SchedulingRunOptions): SchedulingRun {
  const deps: SchedulingRunDependencies = { loadInputs: loadGenerationInputs, assertCurrent: assertGenerationInputsCurrent,
    startWorker: startSchedulingWorker, clock: schedulingClockMs, ...options.dependencies };
  const startedAt = deps.clock();
  const budget = Number.isFinite(options.budgetMs) ? Math.max(1, Math.min(MAX_SCHEDULING_RUN_MS, options.budgetMs!)) : MAX_SCHEDULING_RUN_MS;
  const deadline = startedAt + budget;
  let committing = false;
  let cancelled: Error | undefined;
  let worker: SchedulingWorkerJob | undefined;
  let workerStopped = false;
  let rejectCancellation!: (error: Error) => void;
  const cancellation = new Promise<never>((_, reject) => { rejectCancellation = reject; });
  const stopWorker = () => { if (worker && !workerStopped) { workerStopped = true; worker.cancel(); } };
  const cancel = (error: Error) => {
    if (committing || cancelled) return;
    cancelled = error; stopWorker(); rejectCancellation(error);
  };
  const assertActive = () => {
    if (cancelled) throw cancelled;
    if (deps.clock() >= deadline) throw new SchedulingTimeoutError();
    options.assertLocalCurrent?.();
  };
  const wait = <T>(pending: Promise<T>): Promise<T> => Promise.race([pending, cancellation]);
  const timer = setTimeout(() => cancel(new SchedulingTimeoutError()), budget);
  const report = (phase: 'constructing' | 'validating', statusText: string, input?: GenerationInputs) =>
    options.onProgress?.({ phase, elapsedMs: Math.max(0, deps.clock() - startedAt), remainingMs: Math.max(0, deadline - deps.clock()),
      currentDay: 0, totalDays: 0, currentDate: input?.schedule.startDate || '', percent: phase === 'validating' ? 99 : 0, statusText });
  const promise = (async () => {
    try {
      assertActive(); report('constructing', 'Loading the current roster and clinic details…');
      const baseline = cloneGenerationInputs(await wait(deps.loadInputs(options.repo, options.scheduleId)));
      assertActive();
      const range = options.mode === 'CLEAR_GENERATED' ? undefined : options.options?.onlyDates;
      const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && parseDayMonthYear(value) === value;
      if (range && (!validDate(range.start) || !validDate(range.end) || range.start > range.end ||
        range.start < baseline.schedule.startDate || range.end > baseline.schedule.endDate)) {
        throw new Error('Choose valid dates within the roster, with the first day before or on the last day.');
      }
      const clinic = resolveClinicSetup(baseline.clinicSetup);
      const addedSessions = options.mode === 'CLEAR_GENERATED' ? [] : missingPatternSessions(
        generateDoctorSessionsForDateRange(range?.start || baseline.schedule.startDate, range?.end || baseline.schedule.endDate, baseline.doctors)
          .filter(s => !clinic.holidays.has(s.date)), baseline.sessions);
      const input: SchedulingRunInput = { ...cloneGenerationInputs(baseline), mode: options.mode, options: { ...options.options, onlyDates: range },
        sessions: [...baseline.sessions, ...addedSessions] };
      // No missing clinic, backup or candidate has been written at this point.
      assertActive();
      worker = deps.startWorker(input, { budgetMs: Math.max(1, deadline - deps.clock()), onProgress: progress => {
        if (cancelled || committing) return;
        options.onProgress?.({ ...progress, elapsedMs: Math.max(0, deps.clock() - startedAt), remainingMs: Math.max(0, deadline - deps.clock()) });
      } });
      const result = await wait(worker.promise);
      assertActive(); report('validating', 'Checking the latest clinic details before saving…', baseline);
      const fresh = await wait(deps.assertCurrent(options.repo, baseline));
      assertActive();
      // Cancel remains effective through the last read. From here saving must finish or report a save failure.
      committing = true; clearTimeout(timer); options.onCommitStart?.();
      await options.commit({ baseline, fresh, result, addedSessions });
      return result;
    } finally { clearTimeout(timer); stopWorker(); }
  })();
  return { promise, cancel: () => cancel(new SchedulingCancelledError()), isCommitting: () => committing };
}
