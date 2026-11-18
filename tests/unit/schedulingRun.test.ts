import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { GenerationInputs } from '../../src/services/schedule/generationSaveGuard';
import type { SchedulingRunResult } from '../../src/services/engine/workerProtocol';
import { startSchedulingRun } from '../../src/services/schedule/schedulingRun';
import { DAY_DUTY, SENIOR, makeNurse, makeSchedule } from './fixtures';

const inputs = (): GenerationInputs => ({ schedule: makeSchedule({ startDate: '2026-11-18', endDate: '2026-11-18' }),
  assignments: [], nurses: [makeNurse('n')], doctors: [{ id: 'doctor', fullName: 'Dr One', active: true,
    weeklyPattern: [{ weekday: 3, startTime: '09:00', endTime: '17:00' }], specialtyIds: [] }],
  dutyWindows: [DAY_DUTY], seniorityLevels: [SENIOR], sessions: [], roles: [], specialties: [], rules: [],
  locks: [], leaveEntries: [], leaveTypes: [], workingHoursPeriods: [], clinicSetup: {} });
const result = (input: GenerationInputs): SchedulingRunResult => ({ scheduleId: input.schedule.id,
  assignments: [], createdCount: 0, preservedLocksCount: 0, preservedManualCount: 0, unmetSlotsCount: 0,
  generationDurationMs: 1, search: { termination: 'exhausted', initialUncoveredDoctorMinutes: 0,
    finalUncoveredDoctorMinutes: 0, examined: 1, accepted: 0, elapsedMs: 1, remainingHardProblems: 0, remainingNurseClinicMinutes: 0 },
  validation: { scheduleId: input.schedule.id, timestamp: '', errorCount: 0, warnCount: 0, infoCount: 0, findings: [], hourlyCoverageMap: {} } });
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }
function setup() {
  const input = inputs(), gate = deferred<SchedulingRunResult>();
  const events: string[] = []; let cancellations = 0, workerInput: GenerationInputs | undefined;
  const options = { repo: {} as any, scheduleId: input.schedule.id, mode: 'GENERATE_ALL' as const,
    assertLocalCurrent: () => {}, onCommitStart: () => events.push('saving'),
    commit: async (commit: { addedSessions: unknown[] }) => { events.push(`commit:${commit.addedSessions.length}`); },
    dependencies: { loadInputs: async () => { events.push('read'); return input; },
      assertCurrent: async () => { events.push('check'); return structuredClone(input); },
      startWorker: (worker: GenerationInputs) => { workerInput = worker; events.push('worker');
        return { promise: gate.promise, cancel: () => { cancellations++; } }; } } };
  return { input, gate, events, options, get workerInput() { return workerInput; }, get cancellations() { return cancellations; } };
}
const tick = () => new Promise<void>(resolve => setImmediate(resolve));

test('generation keeps missing pattern clinics private until the checked final commit', async () => {
  const s = setup(), run = startSchedulingRun(s.options); await tick();
  assert.deepEqual(s.events, ['read', 'worker']); assert.equal(s.workerInput?.sessions.length, 1);
  assert.equal(s.input.sessions.length, 0);
  s.gate.resolve(result(s.input)); await run.promise;
  assert.deepEqual(s.events, ['read', 'worker', 'check', 'saving', 'commit:1']);
});
test('cancel during worker search commits no backup, clinics or assignments', async () => {
  const s = setup(), run = startSchedulingRun(s.options); await tick(); run.cancel();
  await assert.rejects(run.promise, { name: 'AbortError' });
  s.gate.resolve(result(s.input)); await tick();
  assert.equal(s.cancellations, 1); assert.deepEqual(s.events, ['read', 'worker']);
});
test('cancel remains effective after worker result while server validation is pending', async () => {
  const s = setup(), check = deferred<GenerationInputs>();
  s.options.dependencies.assertCurrent = async () => { s.events.push('check'); return check.promise; };
  const run = startSchedulingRun(s.options); await tick(); s.gate.resolve(result(s.input)); await tick(); run.cancel();
  await assert.rejects(run.promise, { name: 'AbortError' });
  check.resolve(s.input); await tick(); assert.deepEqual(s.events, ['read', 'worker', 'check']);
});
test('a changed server input or local input rejects the result before any commit', async () => {
  for (const change of ['server', 'local']) {
    const s = setup();
    let localChanged = false;
    if (change === 'server') s.options.dependencies.assertCurrent = async () => { throw new Error('Server changed'); };
    else s.options.assertLocalCurrent = () => { if (localChanged) throw new Error('Local changed'); };
    const run = startSchedulingRun(s.options); await tick(); localChanged = change === 'local'; s.gate.resolve(result(s.input));
    await assert.rejects(run.promise, /changed/i); assert.ok(!s.events.includes('saving'));
  }
});
test('cancel during initial reads never starts a worker or commits a candidate', async () => {
  const s = setup(), read = deferred<GenerationInputs>(); s.options.dependencies.loadInputs = async () => read.promise;
  const run = startSchedulingRun(s.options); run.cancel(); await assert.rejects(run.promise, { name: 'AbortError' });
  read.resolve(s.input); await tick(); assert.deepEqual(s.events, []);
});
test('deadline expiry after the worker result stops validation and saving', async () => {
  const s = setup(); let now = 0;
  const run = startSchedulingRun({ ...s.options, budgetMs: 50, dependencies: { ...s.options.dependencies, clock: () => now } });
  await tick(); now = 51; s.gate.resolve(result(s.input));
  await assert.rejects(run.promise, { name: 'SchedulingTimeoutError' }); assert.ok(!s.events.includes('saving'));
});
test('commit is a clear cancellation cutoff and a failed save never reports success', async () => {
  const s = setup(); let run: ReturnType<typeof startSchedulingRun>;
  s.options.commit = async () => { run.cancel(); throw new Error('Save failed'); };
  run = startSchedulingRun(s.options); await tick(); s.gate.resolve(result(s.input));
  await assert.rejects(run.promise, /Save failed/); assert.equal(run.isCommitting(), true);
});
test('clearing does not propose missing doctor clinics', async () => {
  const s = setup(), run = startSchedulingRun({ ...s.options, mode: 'CLEAR_GENERATED' }); await tick();
  assert.equal(s.workerInput?.sessions.length, 0); s.gate.resolve(result(s.input)); await run.promise;
  assert.ok(s.events.includes('commit:0'));
});

for (const [description, range] of [
  ['missing first date', { start: '', end: '2026-11-20' }],
  ['missing last date', { start: '2026-11-18', end: '' }],
  ['day first date', { start: '18-11-2026', end: '2026-11-20' }],
  ['unpadded ISO date', { start: '2026-11-8', end: '2026-11-20' }],
  ['reversed dates', { start: '2026-11-20', end: '2026-11-18' }],
  ['first date before the authoritative roster', { start: '2026-11-17', end: '2026-11-20' }],
  ['last date after the authoritative roster', { start: '2026-11-18', end: '2026-11-21' }],
] as const) test('generation rejects a range with ' + description + ' before worker or commit', async () => {
  const s = setup(); s.input.schedule.endDate = '2026-11-20';
  const run = startSchedulingRun({ ...s.options, options: { onlyDates: range } });
  s.gate.resolve(result(s.input));
  await assert.rejects(run.promise, /valid dates within the roster/);
  assert.deepEqual(s.events, ['read']);
  assert.equal(s.workerInput, undefined);
});

test('generation rejects a nonexistent calendar date even inside the roster bounds', async () => {
  const s = setup(); s.input.schedule.endDate = '2026-12-01';
  const run = startSchedulingRun({ ...s.options, options: { onlyDates: { start: '2026-11-31', end: '2026-12-01' } } });
  s.gate.resolve(result(s.input));
  await assert.rejects(run.promise, /valid dates within the roster/);
  assert.deepEqual(s.events, ['read']); assert.equal(s.workerInput, undefined);
});

test('a fill range can include both authoritative roster boundaries', async () => {
  const s = setup(); s.input.schedule.endDate = '2026-11-20';
  const run = startSchedulingRun({ ...s.options, options: { onlyDates: {
    start: s.input.schedule.startDate, end: s.input.schedule.endDate,
  } } });
  await tick(); s.gate.resolve(result(s.input)); await run.promise;
  assert.ok(s.events.includes('worker')); assert.ok(s.events.includes('commit:1'));
});

test('clearing ignores a previous fill range and still clears the whole roster', async () => {
  const s = setup(), run = startSchedulingRun({ ...s.options, mode: 'CLEAR_GENERATED',
    options: { onlyDates: { start: 'not a date', end: '2026-11-01' } } });
  await tick(); s.gate.resolve(result(s.input)); await run.promise;
  assert.equal((s.workerInput as { options?: { onlyDates?: unknown } })?.options?.onlyDates, undefined);
  assert.ok(s.events.includes('commit:0'));
});
