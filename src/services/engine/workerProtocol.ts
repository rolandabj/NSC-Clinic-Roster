import type { GenerationInputs } from '../schedule/generationSaveGuard';
import type { GenerationProgress, GenerationResult, RegenerateMode } from './types';
import type { ValidationReport } from '../validation/ScheduleValidator';

export const MAX_SCHEDULING_RUN_MS = 120_000;
export const SCHEDULING_VALIDATION_RESERVE_MS = 10_000;

/** An absolute monotonic clock shared across window and worker time origins. */
export function schedulingClockMs(): number { return performance.timeOrigin + performance.now(); }

/** Structured clone data only. The worker never receives repositories or save callbacks. */
export interface SchedulingRunInput extends GenerationInputs {
  mode: RegenerateMode;
  options?: { keepManual?: boolean; onlyDates?: { start: string; end: string }; clearIncludeManual?: boolean };
}

export interface SchedulingWorkerProgress extends GenerationProgress {
  phase: 'constructing' | 'searching' | 'validating';
  elapsedMs: number;
  remainingMs: number;
  bestUncoveredDoctorMinutes?: number;
  examinedStates?: number;
  acceptedExchanges?: number;
}

export interface SchedulingSearchSummary {
  termination: 'exhausted' | 'deadline' | 'limit' | 'clear';
  initialUncoveredDoctorMinutes: number;
  finalUncoveredDoctorMinutes: number;
  examined: number;
  accepted: number;
  elapsedMs: number;
  remainingHardProblems: number;
  remainingNurseClinicMinutes: number;
}

export interface SchedulingRunResult extends GenerationResult {
  search: SchedulingSearchSummary;
  validation: ValidationReport;
}

export interface SchedulingWorkerRequest {
  type: 'start';
  jobId: string;
  input: SchedulingRunInput;
  startedAtMs: number;
  budgetMs: number;
}

export type SchedulingWorkerResponse =
  | { type: 'progress'; jobId: string; progress: SchedulingWorkerProgress }
  | { type: 'result'; jobId: string; result: SchedulingRunResult }
  | { type: 'error'; jobId: string; message: string; code?: 'deadline' | 'validation' | 'failed' };
