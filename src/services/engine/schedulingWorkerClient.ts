import { MAX_SCHEDULING_RUN_MS, schedulingClockMs, type SchedulingRunInput, type SchedulingRunResult,
  type SchedulingWorkerProgress, type SchedulingWorkerRequest, type SchedulingWorkerResponse } from './workerProtocol';

export type SchedulingWorkerPort = Pick<Worker, 'postMessage' | 'terminate' | 'onmessage' | 'onerror' | 'onmessageerror'>;
export interface SchedulingWorkerOptions {
  onProgress?: (progress: SchedulingWorkerProgress) => void;
  /** Smaller budgets are useful for small fixtures; callers cannot exceed two minutes. */
  budgetMs?: number;
  /** Test seam. Production always creates a dedicated browser worker. */
  workerFactory?: () => SchedulingWorkerPort;
}
export interface SchedulingWorkerJob { promise: Promise<SchedulingRunResult>; cancel: () => void }

export class SchedulingCancelledError extends Error {
  constructor() { super('Filling was cancelled. Nothing was saved.'); this.name = 'AbortError'; }
}
export class SchedulingTimeoutError extends Error {
  constructor() { super('The schedule search exceeded its time limit. Nothing was saved. Try again.'); this.name = 'SchedulingTimeoutError'; }
}
export class SchedulingWorkerError extends Error {
  constructor(message = 'The schedule search stopped unexpectedly. Nothing was saved. Try again.') {
    super(message); this.name = 'SchedulingWorkerError';
  }
}
export function isSchedulingCancelled(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

// Vite requires this literal constructor form to bundle the separate module worker.
// https://vite.dev/guide/features.html#web-workers
const browserWorker = (): SchedulingWorkerPort => new Worker(new URL('./scheduling.worker.ts', import.meta.url), { type: 'module' });
let nextJobId = 0;

/** One private worker per fill. Cancellation terminates it before any result can be applied. */
export function startSchedulingWorker(input: SchedulingRunInput, options: SchedulingWorkerOptions = {}): SchedulingWorkerJob {
  const startedAtMs = schedulingClockMs();
  const budgetMs = Number.isFinite(options.budgetMs)
    ? Math.max(1, Math.min(MAX_SCHEDULING_RUN_MS, Math.floor(options.budgetMs!))) : MAX_SCHEDULING_RUN_MS;
  const jobId = `scheduling-${startedAtMs}-${++nextJobId}`;
  let worker: SchedulingWorkerPort | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let settled = false;
  let rejectRun: (error: unknown) => void = () => {};
  const cleanup = () => {
    if (timeout !== undefined) clearTimeout(timeout);
    if (!worker) return;
    worker.onmessage = null; worker.onerror = null; worker.onmessageerror = null;
    // terminate() stops the worker at once, without waiting for synchronous search loops.
    // https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate
    worker.terminate();
  };
  const fail = (error: unknown) => {
    if (settled) return;
    settled = true; cleanup(); rejectRun(error);
  };
  const promise = new Promise<SchedulingRunResult>((resolve, reject) => {
    rejectRun = reject;
    try {
      const snapshot = structuredClone(input);
      worker = (options.workerFactory || browserWorker)();
      worker.onmessage = (event: MessageEvent<SchedulingWorkerResponse>) => {
        if (settled || !event.data || event.data.jobId !== jobId) return;
        const response = event.data;
        if (response.type === 'progress') {
          try { options.onProgress?.(response.progress); } catch (error) { fail(error); }
        } else if (response.type === 'error') {
          fail(response.code === 'deadline' ? new SchedulingTimeoutError() : new SchedulingWorkerError(response.message));
        } else if (response.type === 'result') {
          if (!response.result || response.result.scheduleId !== snapshot.schedule.id ||
            !Array.isArray(response.result.assignments) || !response.result.search || !response.result.validation) {
            fail(new SchedulingWorkerError('The schedule search returned an invalid result. Nothing was saved. Try again.'));
            return;
          }
          if (schedulingClockMs() - startedAtMs >= budgetMs) { fail(new SchedulingTimeoutError()); return; }
          settled = true; cleanup(); resolve(response.result);
        }
      };
      worker.onerror = event => { event.preventDefault?.(); fail(new SchedulingWorkerError()); };
      worker.onmessageerror = () => fail(new SchedulingWorkerError('The schedule search result could not be read. Nothing was saved. Try again.'));
      timeout = setTimeout(() => fail(new SchedulingTimeoutError()), Math.max(0, budgetMs - (schedulingClockMs() - startedAtMs)));
      const request: SchedulingWorkerRequest = { type: 'start', jobId, input: snapshot, startedAtMs, budgetMs };
      worker.postMessage(request);
    } catch (error) { fail(error instanceof Error ? error : new SchedulingWorkerError()); }
  });
  return { promise, cancel: () => fail(new SchedulingCancelledError()) };
}
