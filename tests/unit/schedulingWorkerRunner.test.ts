import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment } from '../../src/types';
import { createSchedulingObjective } from '../../src/services/engine/schedulingObjective';
import { runSchedulingWorker, type SchedulingWorkerDependencies } from '../../src/services/engine/schedulingWorkerRunner';
import { schedulingClockMs, type SchedulingRunInput, type SchedulingWorkerProgress, type SchedulingWorkerRequest } from '../../src/services/engine/workerProtocol';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLock, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-18';
function input(extra: Partial<SchedulingRunInput> = {}): SchedulingRunInput {
  return { schedule: makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }), mode: 'GENERATE_ALL',
    assignments: [], nurses: [makeNurse('one'), makeNurse('two')], seniorityLevels: [SENIOR], dutyWindows: [DAY_DUTY],
    sessions: [{ id: 'session', doctorId: 'doctor', date, startTime: '09:00', endTime: '17:00', specialtyId: '', source: 'MANUAL', cancelled: false }],
    doctors: [{ id: 'doctor', fullName: 'Dr Morgan', active: true, specialtyIds: [], weeklyPattern: [] }],
    roles: [], specialties: [], locks: [], leaveEntries: [], rules: hoursOnlyRules(), workingHoursPeriods: [], leaveTypes: [], clinicSetup: {}, ...extra };
}
const shift = (id = 'one', nurseId = id, fields: Partial<Assignment> = {}): Assignment => ({ id, nurseId, scheduleId: 'sched-1', date,
  dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: 'doctor', source: 'GENERATED', locked: false,
  doctorCoverage: [{ doctorId: 'doctor', startTime: '09:00', endTime: '17:00' }], ...fields });
const request = (data = input(), fields: Partial<SchedulingWorkerRequest> = {}): SchedulingWorkerRequest => ({
  type: 'start', jobId: 'job', input: data, startedAtMs: 1000, budgetMs: 120000, ...fields });
const generated = (assignments: Assignment[]) => ({ scheduleId: 'sched-1', assignments, createdCount: assignments.length,
  preservedLocksCount: 0, preservedManualCount: 0, unmetSlotsCount: 0, generationDurationMs: 1 });
const passthrough: NonNullable<SchedulingWorkerDependencies['search']> = async data => {
  const objective = createSchedulingObjective(data);
  const findings = objective.validate(data.initialAssignments);
  return { assignments: data.initialAssignments, findings, score: objective.score(data.initialAssignments, findings),
    termination: 'exhausted', examined: 1, accepted: 0, elapsedMs: 1 };
};

test('worker runner emits only summary progress and returns one final validated result', async () => {
  const progress: SchedulingWorkerProgress[] = [];
  const result = await runSchedulingWorker(request(), p => progress.push(p), { now: () => 1001,
    generate: async (...args) => { args[12]?.({ currentDay: 1, totalDays: 1, currentDate: date, statusText: 'Filling', percent: 50,
      assignments: ['private candidate'] } as any); return generated([shift()]); }, search: passthrough });
  assert.equal(result.assignments.length, 1);
  assert.equal(result.validation.findings.some(f => f.severity === 'ERROR'), false);
  assert.equal(result.search.finalUncoveredDoctorMinutes, 0);
  assert.ok(progress.some(p => p.phase === 'constructing'));
  assert.ok(progress.some(p => p.phase === 'searching'));
  assert.ok(progress.some(p => p.phase === 'validating'));
  assert.ok(progress.every(p => !('assignments' in p)));
});

test('the worker gives the search all selected dates and reserves the last ten seconds', async () => {
  const data = input({ options: { onlyDates: { start: date, end: date }, keepManual: true }, weekendDays: [5, 6] });
  let inspected = false;
  await runSchedulingWorker(request(data), undefined, { now: () => 1001, generate: async () => generated([shift()]),
    search: async (ctx, options) => {
      inspected = true;
      assert.deepEqual(ctx.selectedDates, [date]); assert.deepEqual(ctx.weekendDays, [5, 6]);
      assert.equal(options?.deadlineMs, 111000);
      assert.deepEqual(ctx.baselineAssignments, data.assignments);
      return passthrough(ctx, options);
    } });
  assert.ok(inspected);
});

test('cancellation before or after construction cannot return an intermediate candidate', async () => {
  let generatedCalls = 0, searched = false, cancelled = true;
  const deps: SchedulingWorkerDependencies = { now: () => 1001, isCancelled: () => cancelled,
    generate: async () => { generatedCalls++; cancelled = true; return generated([shift()]); },
    search: async (ctx, options) => { searched = true; return passthrough(ctx, options); } };
  await assert.rejects(() => runSchedulingWorker(request(), undefined, deps), { name: 'AbortError' });
  assert.equal(generatedCalls, 0);
  cancelled = false;
  await assert.rejects(() => runSchedulingWorker(request(), undefined, deps), { name: 'AbortError' });
  assert.equal(generatedCalls, 1); assert.equal(searched, false);
});

test('expired startup is rejected and construction consuming search time returns only checked seed', async () => {
  let constructed = false, searched = false, now = 121001;
  const deps: SchedulingWorkerDependencies = { now: () => now,
    generate: async () => { constructed = true; now = 111001; return generated([shift()]); },
    search: async (ctx, options) => { searched = true; return passthrough(ctx, options); } };
  await assert.rejects(() => runSchedulingWorker(request(), undefined, deps), { name: 'SchedulingTimeoutError' });
  assert.equal(constructed, false);
  now = 1001;
  const result = await runSchedulingWorker(request(), undefined, deps);
  assert.equal(searched, false); assert.equal(result.search.termination, 'deadline');
  assert.equal(result.validation.errorCount, 0);
});

test('final independent validation refuses automatic overlap returned by a search', async () => {
  await assert.rejects(() => runSchedulingWorker(request(), undefined, { now: () => 1001,
    generate: async () => generated([shift()]), search: async (ctx, options) => passthrough({ ...ctx,
      initialAssignments: [shift(), shift('two')] }, options) }), /did not pass/);
});

test('a protected manual duty cannot be changed by the private search result', async () => {
  const manual = shift('saved', 'one', { source: 'MANUAL', note: 'Keep this exactly' });
  await assert.rejects(() => runSchedulingWorker(request(input({ assignments: [manual] })), undefined, { now: () => 1001,
    generate: async () => generated([manual]), search: async (ctx, options) => passthrough({ ...ctx,
      initialAssignments: [{ ...manual, note: 'Replaced' }] }, options) }), /did not pass/);
});

test('a search cannot rewrite its baseline to make a changed protected duty pass final validation', async () => {
  const manual = shift('saved', 'one', { source: 'MANUAL', note: 'Original protected note' });
  const data = input({ assignments: [manual] }); const before = JSON.stringify(data);
  await assert.rejects(() => runSchedulingWorker(request(data), undefined, { now: () => 1001,
    generate: async () => generated([manual]), search: async (ctx, options) => {
      ctx.baselineAssignments![0].note = 'Changed baseline';
      return passthrough({ ...ctx, initialAssignments: ctx.baselineAssignments! }, options);
    } }), /did not pass/);
  assert.equal(JSON.stringify(data), before);
});

test('clear removes requested manual duties without search and always retains pinned records', async () => {
  const manual = shift('manual', 'one', { source: 'MANUAL' });
  const pinned = shift('pinned', 'two', { source: 'MANUAL', locked: true });
  const data = input({ assignments: [manual, pinned], mode: 'CLEAR_GENERATED', options: { clearIncludeManual: true } });
  const result = await runSchedulingWorker(request(data), undefined, { now: () => 1001,
    generate: async () => { throw new Error('clear does not construct a search seed'); },
    search: async () => { throw new Error('clear never searches'); } });
  assert.deepEqual(result.assignments, [pinned]); assert.equal(result.search.termination, 'clear');
});

test('partial fills keep original records outside the selected dates, including lock-only dates', async () => {
  const earlier = { ...shift('earlier'), date: '2026-11-17', note: 'Fixed outside selection' };
  const data = input({ schedule: makeSchedule({ startDate: earlier.date, endDate: date, hoursTargetFullTime: 16 }),
    assignments: [earlier], locks: [makeLock('two', earlier.date)], options: { onlyDates: { start: date, end: date } } });
  const seed = [earlier, shift(), { ...shift('new-outside', 'two'), date: earlier.date, locked: true, source: 'LOCK' as const }];
  const result = await runSchedulingWorker(request(data), undefined, { now: () => 1001,
    generate: async () => generated(seed), search: passthrough });
  assert.deepEqual(result.assignments.find(a => a.date === earlier.date), earlier);
  assert.equal(result.assignments.some(a => a.id === 'new-outside'), false);
});

test('Empty only seed protection retains paid fields without leaking temporary manual sources', async () => {
  const existing = shift('existing', 'one', { kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', doctorId: undefined, doctorCoverage: undefined });
  const data = input({ assignments: [existing], mode: 'EMPTY_ONLY' });
  const result = await runSchedulingWorker(request(data), undefined, { now: () => 1001,
    generate: async (...args) => {
      assert.equal(args[2][0].source, 'MANUAL');
      return generated(args[2]);
    }, search: passthrough });
  assert.equal(result.assignments[0].source, 'GENERATED');
  assert.equal(result.assignments[0].dutyWindowId, existing.dutyWindowId);
  assert.equal(result.preservedManualCount, 0);
});

test('the actual constructor and search return only a valid final roster without changing the input', async () => {
  const data = input({ nurses: [makeNurse('one')] });
  const before = JSON.stringify(data);
  const result = await runSchedulingWorker(request(data, { startedAtMs: schedulingClockMs(), budgetMs: 3000 }));
  assert.equal(result.search.finalUncoveredDoctorMinutes, 0);
  assert.equal(result.validation.errorCount, 0);
  assert.equal(result.assignments.filter(a => a.kind === 'DOCTOR').length, 1);
  assert.equal(result.doctorSessionsTotal, 1);
  assert.equal(JSON.stringify(data), before);
});
