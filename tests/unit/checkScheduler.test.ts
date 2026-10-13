import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCheckScheduler } from '../../src/services/validation/checkScheduler';
import { sameHoursHistory } from '../../src/services/hours/hoursHistoryService';
import type { HoursHistory } from '../../src/services/hours/hoursBalance';

// The roster check kept out of the way (UI overhaul Phase 3, slice 5): requests made close
// together run the check once, after the screen has drawn; opening a full size roster asked
// for it four times in a row (about 60 ms each).

/** A scheduler driven by hand: `later` keeps the callback until `tick` runs it. */
function manualTimer() {
  let queued: (() => void) | null = null;
  let scheduled = 0;
  return {
    later: (fn: () => void) => {
      scheduled++;
      queued = fn;
      return () => {
        queued = null;
      };
    },
    tick: () => {
      const fn = queued;
      queued = null;
      fn?.();
    },
    get scheduled() {
      return scheduled;
    },
  };
}

test('requests made before the check runs are checked once, with the newest one', () => {
  const timer = manualTimer();
  const runs: string[] = [];
  const checks = createCheckScheduler<string>({ later: timer.later, run: (r) => runs.push(r) });
  checks.request('first');
  checks.request('second');
  checks.request('newest');
  assert.deepEqual(runs, [], 'nothing runs at once');
  assert.equal(timer.scheduled, 1, 'one run waits');
  timer.tick();
  assert.deepEqual(runs, ['newest']);
  timer.tick();
  assert.deepEqual(runs, ['newest'], 'and only once');
});

test('a request after the check ran is checked again', () => {
  const timer = manualTimer();
  const runs: string[] = [];
  const checks = createCheckScheduler<string>({ later: timer.later, run: (r) => runs.push(r) });
  checks.request('a');
  timer.tick();
  checks.request('b');
  timer.tick();
  assert.deepEqual(runs, ['a', 'b']);
});

test('a waiting check can be dropped (another roster opened, or a fill showed its own result)', () => {
  const timer = manualTimer();
  const runs: string[] = [];
  const checks = createCheckScheduler<string>({ later: timer.later, run: (r) => runs.push(r) });
  checks.request('old roster');
  checks.cancel();
  timer.tick();
  assert.deepEqual(runs, []);
  assert.equal(checks.waiting, false);
});

test('a waiting check can be run at once', () => {
  const timer = manualTimer();
  const runs: string[] = [];
  const checks = createCheckScheduler<string>({ later: timer.later, run: (r) => runs.push(r) });
  checks.request('now please');
  assert.equal(checks.waiting, true);
  checks.flush();
  assert.deepEqual(runs, ['now please']);
  timer.tick();
  assert.deepEqual(runs, ['now please']);
});

const history = (extra: Partial<HoursHistory> = {}): HoursHistory => ({
  schedules: [{ id: 'oct', name: 'October', startDate: '2026-10-01', endDate: '2026-10-31' } as never],
  assignments: [{ id: 'a1', scheduleId: 'oct', nurseId: 'amy', date: '2026-10-05', dutyWindowId: 'D' } as never],
  leaveEntries: [],
  countedScheduleIds: ['oct'],
  contractPercents: { oct: { amy: 100 } },
  ...extra,
});

test('a history loaded again with the same content counts as the same', () => {
  assert.equal(sameHoursHistory(history(), history()), true);
  const h = history();
  assert.equal(sameHoursHistory(h, h), true);
  assert.equal(sameHoursHistory(undefined, history()), false);
  assert.equal(sameHoursHistory(history(), history({ countedScheduleIds: [] })), false);
  const moved = history();
  moved.assignments = [{ ...moved.assignments[0], dutyWindowId: 'L' }];
  assert.equal(sameHoursHistory(history(), moved), false, 'a changed shift in an earlier roster');
  assert.equal(sameHoursHistory(history(), history({ contractPercents: { oct: { amy: 80 } } })), false);
});
