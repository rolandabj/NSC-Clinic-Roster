import { runSchedulingWorker } from './schedulingWorkerRunner';
import type { SchedulingWorkerRequest, SchedulingWorkerResponse } from './workerProtocol';

interface SchedulingWorkerScope {
  onmessage: ((event: MessageEvent<unknown>) => void) | null;
  postMessage(message: SchedulingWorkerResponse): void;
}
const scope = self as unknown as SchedulingWorkerScope;
let started = false;

// A dedicated module worker owns one private run. The client terminates it on
// cancellation, timeout, completion or crash: https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate
scope.onmessage = event => {
  const request = event.data as Partial<SchedulingWorkerRequest> | null;
  if (started || !request || request.type !== 'start' || typeof request.jobId !== 'string' || !request.input) return;
  started = true;
  void runSchedulingWorker(request as SchedulingWorkerRequest,
    progress => scope.postMessage({ type: 'progress', jobId: request.jobId!, progress }))
    .then(result => scope.postMessage({ type: 'result', jobId: request.jobId!, result }))
    .catch((error: unknown) => {
      const name = error instanceof Error ? error.name : '';
      scope.postMessage({ type: 'error', jobId: request.jobId!,
        message: error instanceof Error ? error.message : 'The schedule search stopped. Nothing was saved. Try again.',
        code: name === 'SchedulingTimeoutError' ? 'deadline' : name === 'SchedulingValidationError' ? 'validation' : 'failed' });
    });
};
