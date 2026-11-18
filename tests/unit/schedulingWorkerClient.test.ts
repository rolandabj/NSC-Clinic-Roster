import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSchedulingCancelled, SchedulingTimeoutError, startSchedulingWorker,
  type SchedulingWorkerPort } from '../../src/services/engine/schedulingWorkerClient';
import type { SchedulingRunInput, SchedulingRunResult, SchedulingWorkerRequest,
  SchedulingWorkerResponse } from '../../src/services/engine/workerProtocol';
import { makeSchedule } from './fixtures';

const input = (): SchedulingRunInput => ({ schedule: makeSchedule(), mode: 'GENERATE_ALL', assignments: [], nurses: [],
  seniorityLevels: [], dutyWindows: [], roles: [], specialties: [], sessions: [], locks: [], leaveEntries: [], rules: [],
  workingHoursPeriods: [], doctors: [], leaveTypes: [], clinicSetup: {} });
const result = (scheduleId: string): SchedulingRunResult => ({ scheduleId, assignments: [], createdCount: 0,
  preservedLocksCount: 0, preservedManualCount: 0, unmetSlotsCount: 0, generationDurationMs: 1,
  validation: { scheduleId, timestamp: '', findings: [], errorCount: 0, warnCount: 0, infoCount: 0, hourlyCoverageMap: {} },
  search: { termination: 'exhausted', initialUncoveredDoctorMinutes: 0, finalUncoveredDoctorMinutes: 0,
    examined: 1, accepted: 0, elapsedMs: 1, remainingHardProblems: 0, remainingNurseClinicMinutes: 0 } });
class FakeWorker {
  onmessage: SchedulingWorkerPort['onmessage'] = null;
  onerror: SchedulingWorkerPort['onerror'] = null;
  onmessageerror: SchedulingWorkerPort['onmessageerror'] = null;
  sent: SchedulingWorkerRequest[] = [];
  terminations = 0;
  postMessage(message: SchedulingWorkerRequest) { this.sent.push(message); }
  terminate() { this.terminations++; }
  reply(response: SchedulingWorkerResponse) { this.onmessage?.call(this as any, { data: response } as MessageEvent); }
}
function fixture(data = input(), budgetMs = 1000) {
  const worker = new FakeWorker(); const progress: unknown[] = [];
  const job = startSchedulingWorker(data, { workerFactory: () => worker, budgetMs, onProgress: p => progress.push(p) });
  return { worker, job, progress, id: worker.sent[0]?.jobId };
}
test('the worker receives a detached complete input and only the final matching result resolves', async () => {
  const data = input(); const f = fixture(data);
  data.schedule.name = 'Changed after starting';
  assert.notEqual(f.worker.sent[0].input.schedule.name, data.schedule.name);
  f.worker.reply({ type: 'result', jobId: 'older job', result: result(data.schedule.id) });
  assert.equal(f.worker.terminations, 0);
  f.worker.reply({ type: 'result', jobId: f.id, result: result(data.schedule.id) });
  assert.equal((await f.job.promise).scheduleId, data.schedule.id);
  assert.equal(f.worker.terminations, 1);
  assert.equal(f.worker.onmessage, null);
});
test('progress carries summary data while assignments remain private until the final result', async () => {
  const f = fixture();
  const progress = { phase: 'searching' as const, elapsedMs: 12, remainingMs: 988, currentDay: 0, totalDays: 7,
    currentDate: '', statusText: 'Improving cover', percent: 50, bestUncoveredDoctorMinutes: 30, examinedStates: 24 };
  f.worker.reply({ type: 'progress', jobId: f.id, progress });
  assert.deepEqual(f.progress, [progress]); assert.ok(!('assignments' in (f.progress[0] as object)));
  f.worker.reply({ type: 'result', jobId: f.id, result: result(input().schedule.id) });
  await f.job.promise;
});
test('cancel immediately terminates the worker and rejects once even when an old result arrives', async () => {
  const f = fixture(); const late = f.worker.onmessage;
  f.job.cancel(); f.job.cancel();
  await assert.rejects(f.job.promise, isSchedulingCancelled);
  late?.call(f.worker as any, { data: { type: 'result', jobId: f.id, result: result(input().schedule.id) } } as MessageEvent);
  assert.equal(f.worker.terminations, 1);
});
test('a hung worker is terminated within the requested budget and yields no result', async () => {
  const f = fixture(input(), 10);
  await assert.rejects(f.job.promise, SchedulingTimeoutError);
  assert.equal(f.worker.terminations, 1);
});
test('worker crashes and unreadable messages fail closed and release the worker', async () => {
  const failed = fixture();
  failed.worker.onerror?.call(failed.worker as any, { message: 'private stack', preventDefault() {} } as ErrorEvent);
  await assert.rejects(failed.job.promise, /stopped unexpectedly/);
  assert.equal(failed.worker.terminations, 1);
  const unreadable = fixture();
  unreadable.worker.onmessageerror?.call(unreadable.worker as any, {} as MessageEvent);
  await assert.rejects(unreadable.job.promise, /could not be read/);
  assert.equal(unreadable.worker.terminations, 1);
});
test('an invalid final result and worker failure never resolve as a saved candidate', async () => {
  const invalid = fixture();
  invalid.worker.reply({ type: 'result', jobId: invalid.id, result: {} as SchedulingRunResult });
  await assert.rejects(invalid.job.promise, /invalid result/);
  const failed = fixture();
  failed.worker.reply({ type: 'error', jobId: failed.id, message: 'The candidate did not pass validation.', code: 'validation' });
  await assert.rejects(failed.job.promise, /did not pass validation/);
});
test('a construction or postMessage failure rejects without keeping a worker alive', async () => {
  const data = input();
  await assert.rejects(startSchedulingWorker(data, { workerFactory: () => { throw new Error('unsupported'); } }).promise, /unsupported/);
  const worker = new FakeWorker(); worker.postMessage = () => { throw new Error('clone failed'); };
  await assert.rejects(startSchedulingWorker(data, { workerFactory: () => worker }).promise, /clone failed/);
  assert.equal(worker.terminations, 1);
});
test('separate jobs cannot complete each other and budgets cannot exceed two minutes', async () => {
  const first = fixture(); const second = fixture();
  first.worker.reply({ type: 'result', jobId: second.id, result: result(input().schedule.id) });
  assert.equal(first.worker.terminations, 0);
  first.job.cancel(); second.job.cancel();
  await Promise.all([assert.rejects(first.job.promise, isSchedulingCancelled), assert.rejects(second.job.promise, isSchedulingCancelled)]);
  const worker = new FakeWorker(); const long = startSchedulingWorker(input(), { workerFactory: () => worker, budgetMs: 900_000 });
  assert.equal(worker.sent[0].budgetMs, 120_000);
  long.cancel(); await assert.rejects(long.promise, isSchedulingCancelled);
});
test('a device clock change cannot consume or extend the search budget', async () => {
  const realNow = Date.now;
  let wallTime = realNow();
  Date.now = () => wallTime;
  try {
    const forward = fixture(); wallTime += 3_600_000;
    forward.worker.reply({ type: 'result', jobId: forward.worker.sent[0].jobId, result: result(input().schedule.id) });
    assert.equal((await forward.job.promise).scheduleId, input().schedule.id);
  } finally { Date.now = realNow; }
});
