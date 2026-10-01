/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 2 verification harness (no test runner dependency — run with tsx).
 *
 * Proves, against real code paths:
 *   1. Leave credits come from the leave type (RO/DO = 0, numeric = per-day rate,
 *      'match_duty' = 8) and never from a hardcoded `|| 8`.
 *   2. Leave credits are clipped to the schedule window (E7).
 *   3. Preserved/locked duty hours are counted exactly once by the engine (E1).
 *   4. The consecutive-days lookback sees the days before the schedule start (E8).
 *   5. The validator and the hours-accounting reports agree with the engine (parity).
 *
 * Usage: npx tsx scripts/verify-phase2.ts   (or: npm run verify:phase2)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SchedulingEngine } from '../src/services/engine/SchedulingEngine';
import { JsonFileRepository } from '../server/db/jsonStore';
import { validateScheduleById } from '../server/services/validation/scheduleValidator';
import { ScheduleValidator } from '../src/services/validation/ScheduleValidator';
import { calculateNurseHoursAccounting } from '../src/services/reports/hoursAccounting';
import {
  clippedLeaveCredit,
  creditHoursForDateRange,
  creditHoursForLeave,
  getInclusiveLeaveDays,
  resolveLeaveHoursPerDay,
  resolveLeaveTypeHoursPerDay,
} from '../src/services/leave/leaveCredit';
import {
  Assignment,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  LockEntry,
  Nurse,
  Schedule,
  SeniorityLevel,
  WorkingHoursPeriod,
} from '../src/types';

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: CheckResult[] = [];

async function check(name: string, fn: () => Promise<string> | string): Promise<void> {
  try {
    const detail = await fn();
    results.push({ name, passed: true, detail });
  } catch (err: any) {
    results.push({ name, passed: false, detail: err?.message || String(err) });
  }
}

// --------------------------------------------------------------------------- fixtures

const START = '2026-11-01';
const END = '2026-11-07';
const DATES = [1, 2, 3, 4, 5, 6, 7].map((d) => `2026-11-0${d}`);

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
}

const DUTY_D: DutyWindow = {
  id: 'duty-full-day',
  name: 'Full Day',
  acronym: 'D',
  startTime: '09:00',
  endTime: '17:00',
  color: '#3b82f6',
  active: true,
  isPriority: true,
  priorityRank: 100,
};

const PERIOD: WorkingHoursPeriod = {
  id: 'period-verify-7d',
  year: '2026',
  name: 'Verify 7-day window',
  startDate: START,
  endDate: END,
  workingHours: 40,
  createdAt: '2026-01-01T00:00:00Z',
};

const SENIORITY: SeniorityLevel[] = [
  { id: 'seniority-staff', name: 'Staff Nurse', rank: 3, isSenior: false, color: '#0ea5e9' },
];

const NURSE: Nurse = {
  id: 'nurse-1',
  fullName: 'Nurse One',
  gmail: 'nurse.one@example.com',
  employeeCode: 'N1',
  seniorityLevelId: 'seniority-staff',
  contractPercent: 100,
  dateOfBirth: '1990-01-01',
  capabilityIds: [],
  isClinicNurse: true,
  preferences: [],
  active: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const SCHEDULE: Schedule = {
  id: 'sch-verify-7d',
  name: 'Verify 7-day schedule',
  startDate: START,
  endDate: END,
  blockWeeks: 1,
  hoursTargetFullTime: 160, // deliberately wrong on purpose: the period (40h) must win
  status: 'DRAFT',
  activeVersionNumber: 1,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const LEAVE_TYPE_RO: LeaveType = {
  id: 'lt-ro', name: 'Request Off', acronym: 'RO',
  creditedHours: 0, countsTowardHoursTarget: false, color: '#94a3b8', active: true,
};
const LEAVE_TYPE_DO: LeaveType = {
  id: 'lt-do', name: 'Day Off', acronym: 'DO',
  creditedHours: 0, countsTowardHoursTarget: false, color: '#64748b', active: true,
};
const LEAVE_TYPE_AL: LeaveType = {
  id: 'lt-al', name: 'Annual Leave', acronym: 'AL',
  creditedHours: 8, countsTowardHoursTarget: true, color: '#22c55e', active: true,
};
const LEAVE_TYPE_PH: LeaveType = {
  id: 'lt-ph', name: 'Public Holiday', acronym: 'PH',
  creditedHours: 'match_duty', countsTowardHoursTarget: true, color: '#f59e0b', active: true,
};
const LEAVE_TYPES = [LEAVE_TYPE_RO, LEAVE_TYPE_DO, LEAVE_TYPE_AL, LEAVE_TYPE_PH];

function makeLeave(
  overrides: Partial<LeaveEntry> & Pick<LeaveEntry, 'startDate' | 'endDate' | 'leaveTypeId' | 'hoursCredited'>
): LeaveEntry {
  return {
    id: `leave-${overrides.leaveTypeId}-${overrides.startDate}`,
    nurseId: NURSE.id,
    approved: true,
    ...overrides,
  };
}

function makeDutyLock(date: string): LockEntry {
  return {
    id: `lock-${date}`,
    nurseId: NURSE.id,
    date,
    mode: 'ASSIGNMENT',
    dutyWindowId: DUTY_D.id,
    assignmentKind: 'CLINICAL_ROLE',
    targetRefId: 'role-nurse-clinic',
    scheduleId: SCHEDULE.id,
    note: 'Pinned duty',
    createdAt: '2026-01-01T00:00:00Z',
  };
}

interface RunOptions {
  locks?: LockEntry[];
  leaveEntries?: LeaveEntry[];
  leaveTypes?: LeaveType[];
  history?: Assignment[];
}

async function runEngine(options: RunOptions = {}) {
  return SchedulingEngine.generate(
    SCHEDULE,
    'GENERATE_ALL',
    [],
    [NURSE],
    SENIORITY,
    [DUTY_D],
    [], // clinicalRoles (engine falls back to the built-in Nurse Clinic role)
    [], // specialties
    [], // doctorSessions
    options.locks ?? [],
    options.leaveEntries ?? [],
    [], // rules
    undefined,
    [PERIOD],
    [], // doctors
    options.leaveTypes ?? [],
    options.history ?? []
  );
}

const assignedDates = (assignments: Assignment[]): string[] =>
  assignments.filter((a) => a.nurseId === NURSE.id).map((a) => a.date).sort();

// ------------------------------------------------------------------------------ main

async function main(): Promise<void> {
  // ------------------------------------------------------------------ helper unit checks

  await check('RO/DO leave types credit 0 hours (day-off semantics)', () => {
    const ro = makeLeave({ leaveTypeId: 'lt-ro', startDate: DATES[1], endDate: DATES[2], hoursCredited: 0 });
    const doLeave = makeLeave({ leaveTypeId: 'lt-do', startDate: DATES[1], endDate: DATES[2], hoursCredited: 0 });
    assert.equal(creditHoursForLeave(ro, LEAVE_TYPE_RO), 0, 'RO credited hours');
    assert.equal(creditHoursForLeave(doLeave, LEAVE_TYPE_DO), 0, 'DO credited hours');
    assert.equal(clippedLeaveCredit(ro, LEAVE_TYPE_RO, START, END), 0, 'RO clipped credit');
    return 'RO and DO both resolve to 0h.';
  });

  await check('A legacy 8h snapshot on a 0-credit type is ignored', () => {
    // Legacy rows created before the fix could carry hoursCredited: 8 on an RO entry.
    const legacyRo = makeLeave({ leaveTypeId: 'lt-ro', startDate: DATES[1], endDate: DATES[2], hoursCredited: 8 });
    assert.equal(creditHoursForLeave(legacyRo, LEAVE_TYPE_RO), 0, 'legacy RO snapshot leaked into credits');
    return 'countsTowardHoursTarget=false always wins over the stored snapshot.';
  });

  await check('Numeric leave types credit their configured hours per day', () => {
    const al = makeLeave({ leaveTypeId: 'lt-al', startDate: DATES[1], endDate: DATES[3], hoursCredited: 24 });
    assert.equal(resolveLeaveTypeHoursPerDay(LEAVE_TYPE_AL), 8);
    assert.equal(creditHoursForLeave(al, LEAVE_TYPE_AL), 24);
    return 'AL 8h/day over 3 days = 24h.';
  });

  await check("'match_duty' leave types credit a standard 8h duty day", () => {
    assert.equal(resolveLeaveTypeHoursPerDay(LEAVE_TYPE_PH), 8);
    assert.equal(
      creditHoursForDateRange(DATES[1], DATES[1], LEAVE_TYPE_PH),
      8,
      'single-day PH credit'
    );
    return "'match_duty' resolves to 8h/day.";
  });

  await check('A positive stored snapshot is honoured and pro-rated', () => {
    // 4-day leave stored with a custom 16h total (4h/day); only 2 days fall in the window.
    const custom = makeLeave({ leaveTypeId: 'lt-al', startDate: DATES[0], endDate: DATES[3], hoursCredited: 16 });
    assert.equal(resolveLeaveHoursPerDay(custom, LEAVE_TYPE_AL), 4, 'per-day rate');
    assert.equal(clippedLeaveCredit(custom, LEAVE_TYPE_AL, DATES[0], DATES[1]), 8, '2 in-window days × 4h');
    return 'Custom 4h/day snapshot is pro-rated per day, not treated as 8.';
  });

  await check('Leave is clipped to the schedule window (E7)', () => {
    // 5-day AL span: 3 days before the window, 2 days inside (Nov 1-2), 0 after.
    const straddling = makeLeave({
      leaveTypeId: 'lt-al',
      startDate: addDays(START, -3),
      endDate: addDays(START, 1),
      hoursCredited: 40,
    });
    assert.equal(getInclusiveLeaveDays(straddling.startDate, straddling.endDate), 5);
    assert.equal(creditHoursForLeave(straddling, LEAVE_TYPE_AL), 40, 'whole-entry credit');
    assert.equal(
      clippedLeaveCredit(straddling, LEAVE_TYPE_AL, START, END),
      16,
      'in-window credit should be exactly 2 days × 8h'
    );
    const outside = makeLeave({
      leaveTypeId: 'lt-al',
      startDate: addDays(START, -5),
      endDate: addDays(START, -1),
      hoursCredited: 40,
    });
    assert.equal(clippedLeaveCredit(outside, LEAVE_TYPE_AL, START, END), 0, 'no-overlap leave credit');
    return 'Straddling leave credits 16h (2 in-window days), non-overlapping leave credits 0h.';
  });

  // ------------------------------------------------------------------- engine behaviour

  await check('Baseline engine run on the 7-day / 40h window schedules 5 duty days', async () => {
    const result = await runEngine();
    assert.equal(
      result.assignments.length,
      5,
      `expected 5 assignments (H7 cap 42h / 8h shifts), got ${result.assignments.length}`
    );
    assert.deepEqual(assignedDates(result.assignments), DATES.slice(0, 5));
    return `Assignments on ${assignedDates(result.assignments).join(', ')} (40h of a 42h cap).`;
  });

  await check('E1: a preserved lock is counted exactly once by the H7 hours cap', async () => {
    // With double counting the locked 8h is debited twice from day 1, leaving room for only
    // 4 assignments; counting it once leaves room for 5.
    const result = await runEngine({ locks: [makeDutyLock(DATES[0])] });
    assert.equal(result.preservedLocksCount, 1, 'lock was not preserved');
    assert.equal(
      result.assignments.length,
      5,
      `expected 5 assignments with 1 preserved lock, got ${result.assignments.length}`
    );
    return 'Locked day 1 + 4 generated days = 40h against the 42h cap (single count).';
  });

  await check('E2: an RO day off does not consume the duty-hours cap', async () => {
    // RO on days 2-3 must credit 0h; the nurse is still blocked from duty on those days,
    // but the other 5 days remain schedulable (5 assignments: days 1, 4, 5, 6, 7).
    const ro = makeLeave({ leaveTypeId: 'lt-ro', startDate: DATES[1], endDate: DATES[2], hoursCredited: 0 });
    const result = await runEngine({
      locks: [makeDutyLock(DATES[0])],
      leaveEntries: [ro],
      leaveTypes: LEAVE_TYPES,
    });
    assert.deepEqual(
      assignedDates(result.assignments),
      [DATES[0], DATES[3], DATES[4], DATES[5], DATES[6]],
      `RO leave suppressed duty capacity: ${assignedDates(result.assignments).join(', ')}`
    );
    return 'RO credited 0h → 5 duty days preserved around the day off.';
  });

  await check('E2: an AL leave occupies the contract cap (duty capacity shrinks)', async () => {
    // AL on days 2-3 credits 16h → duty target 24h → cap 25h → days 1, 4, 5 only.
    const al = makeLeave({ leaveTypeId: 'lt-al', startDate: DATES[1], endDate: DATES[2], hoursCredited: 16 });
    const result = await runEngine({
      locks: [makeDutyLock(DATES[0])],
      leaveEntries: [al],
      leaveTypes: LEAVE_TYPES,
    });
    assert.deepEqual(
      assignedDates(result.assignments),
      [DATES[0], DATES[3], DATES[4]],
      `AL credit did not reduce the cap: ${assignedDates(result.assignments).join(', ')}`
    );
    return 'AL credited 16h → 3 duty days (24h duty + 16h leave = 40h contract cap).';
  });

  await check('E7: a boundary-straddling AL leave only debits its in-window days', async () => {
    // The leave starts 3 days before the window and ends 1 day after. Only 1 day (8h) may be
    // credited; crediting the whole 40h span would zero the nurse's target entirely.
    const straddling = makeLeave({
      leaveTypeId: 'lt-al',
      startDate: addDays(START, -3),
      endDate: addDays(START, 1),
      hoursCredited: 40,
    });
    const result = await runEngine({ leaveEntries: [straddling], leaveTypes: LEAVE_TYPES });
    // Crediting the whole 40h span instead would leave the nurse with 2h of duty capacity
    // (0 assignments) instead of the correct 24h (3 shifts).
    assert.deepEqual(
      assignedDates(result.assignments),
      [DATES[2], DATES[3], DATES[4]],
      `straddling leave was not clipped: ${assignedDates(result.assignments).join(', ')}`
    );
    return 'Clipped to 16h → 3 duty days: 16h leave + 24h duty = 40h contract.';
  });

  await check('E8: consecutive-day streaks continue across the schedule boundary', async () => {
    // The nurse worked the 6 days immediately before the schedule. H2 must block day 1,
    // and the history must NOT count toward this schedule's hours.
    const history: Assignment[] = [-6, -5, -4, -3, -2, -1].map((offset, index) => ({
      id: `hist-${index}`,
      scheduleId: 'sch-previous',
      nurseId: NURSE.id,
      date: addDays(START, offset),
      dutyWindowId: DUTY_D.id,
      kind: 'CLINICAL_ROLE',
      clinicalRoleId: 'role-nurse-clinic',
      locked: false,
      source: 'GENERATED',
    }));
    const result = await runEngine({ history });
    const dates = assignedDates(result.assignments);
    assert.ok(!dates.includes(DATES[0]), `H2 ignored the pre-schedule streak (assigned ${dates.join(', ')})`);
    assert.deepEqual(
      dates,
      [DATES[1], DATES[2], DATES[3], DATES[4], DATES[5]],
      `expected duty on days 2-6, got ${dates.join(', ')}`
    );
    return 'Day 1 blocked by H2 (6 prior consecutive days); history stayed out of the hours cap.';
  });

  // -------------------------------------------------------------------- parity checks

  await check('Reports parity: hours accounting credits the same clipped leave hours', async () => {
    const straddling = makeLeave({
      leaveTypeId: 'lt-al',
      startDate: addDays(START, -3),
      endDate: addDays(START, 1),
      hoursCredited: 40,
    });
    const result = await runEngine({ leaveEntries: [straddling], leaveTypes: LEAVE_TYPES });
    const accounting = calculateNurseHoursAccounting(
      NURSE,
      SCHEDULE,
      result.assignments,
      [DUTY_D],
      [straddling],
      LEAVE_TYPES,
      SENIORITY,
      [],
      [],
      []
    );
    assert.equal(accounting.leaveHours, 16, `report credited ${accounting.leaveHours}h of leave`);
    assert.equal(
      accounting.totalEarnedHours,
      accounting.dutyHours + 16,
      'total earned hours diverged from duty + clipped leave'
    );
    for (const date of [DATES[0], DATES[1]]) {
      const leaveDay = accounting.timeline.find((t) => t.date === date);
      assert.equal(leaveDay?.type, 'LEAVE', `${date} was not reported as leave`);
      assert.equal(leaveDay?.hoursEarned, 8, `${date} credited ${leaveDay?.hoursEarned}h`);
    }
    const dayAfter = accounting.timeline.find((t) => t.date === DATES[2]);
    assert.equal(dayAfter?.type, 'DUTY', 'day 3 should be back on duty');
    return `Report: ${accounting.dutyHours}h duty + 16h leave = ${accounting.totalEarnedHours}h.`;
  });

  await check('Validator parity: no false hours findings for clipped leave or RO days off', async () => {
    const straddling = makeLeave({
      leaveTypeId: 'lt-al',
      startDate: addDays(START, -3),
      endDate: addDays(START, 1),
      hoursCredited: 40,
    });
    const clippedRun = await runEngine({ leaveEntries: [straddling], leaveTypes: LEAVE_TYPES });
    const clippedReport = ScheduleValidator.validate(
      SCHEDULE,
      clippedRun.assignments,
      [NURSE],
      SENIORITY,
      [DUTY_D],
      [],
      [straddling],
      [],
      [],
      [],
      [PERIOD],
      [],
      [],
      LEAVE_TYPES
    );
    const clippedAccounting = calculateNurseHoursAccounting(
      NURSE, SCHEDULE, clippedRun.assignments, [DUTY_D], [straddling], LEAVE_TYPES,
      SENIORITY, [], [], [], [], [PERIOD]
    );
    // The validator's period target is 40h and the report's earned total is 40h, so a single
    // HOURS_IMBALANCE finding would prove the two disagree (unclipped leave would read 64h;
    // zero credit would read 24h and trip the <75% pace warning).
    assert.equal(
      clippedAccounting.totalEarnedHours,
      40,
      `report earned ${clippedAccounting.totalEarnedHours}h instead of 40h`
    );
    const clippedHoursFindings = clippedReport.findings.filter(
      (f) => f.category === 'HOURS_IMBALANCE'
    );
    assert.equal(
      clippedHoursFindings.length,
      0,
      `hours findings: ${clippedHoursFindings.map((f) => f.message).join(' | ')}`
    );
    // Phase 5 parity: the report now resolves the same authoritative target as the engine and
    // the validator (the working-hours period wins over schedule.hoursTargetFullTime = 160h).
    assert.equal(
      clippedAccounting.targetHours,
      PERIOD.workingHours,
      `report target ${clippedAccounting.targetHours}h != period target ${PERIOD.workingHours}h`
    );
    assert.equal(
      clippedAccounting.fullTimeTargetHours,
      PERIOD.workingHours,
      'report full-time target is not period-derived'
    );

    const ro = makeLeave({ leaveTypeId: 'lt-ro', startDate: DATES[1], endDate: DATES[2], hoursCredited: 0 });
    const roRun = await runEngine({ locks: [makeDutyLock(DATES[0])], leaveEntries: [ro], leaveTypes: LEAVE_TYPES });
    const roReport = ScheduleValidator.validate(
      SCHEDULE,
      roRun.assignments,
      [NURSE],
      SENIORITY,
      [DUTY_D],
      [],
      [ro],
      [],
      [],
      [],
      [PERIOD],
      [],
      [],
      LEAVE_TYPES
    );
    const roHoursFindings = roReport.findings.filter((f) => f.category === 'HOURS_IMBALANCE');
    assert.equal(
      roHoursFindings.length,
      0,
      `RO run hours findings: ${roHoursFindings.map((f) => f.message).join(' | ')}`
    );
    return `Validator and report agree (total ${clippedAccounting.totalEarnedHours}h); RO run stays on target at 0h credited.`;
  });

  await check('Server path: validateScheduleById agrees with the engine (period target, clipped leave)', async () => {
    const straddling = makeLeave({
      leaveTypeId: 'lt-al',
      startDate: addDays(START, -3),
      endDate: addDays(START, 1),
      hoursCredited: 40,
    });
    const pending = makeLeave({
      id: 'leave-pending',
      leaveTypeId: 'lt-al',
      startDate: DATES[5],
      endDate: DATES[6],
      hoursCredited: 16,
      approved: false,
      status: 'PENDING',
    });

    const run = await runEngine({ leaveEntries: [straddling], leaveTypes: LEAVE_TYPES });
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phase2-server-'));
    try {
      const repo = new JsonFileRepository(tmpDir);
      await repo.bulkUpsert('schedules', [SCHEDULE]);
      await repo.bulkUpsert('nurses', [NURSE]);
      await repo.bulkUpsert('seniorityLevels', SENIORITY);
      await repo.bulkUpsert('dutyWindows', [DUTY_D]);
      await repo.bulkUpsert('clinicalRoles', []);
      await repo.bulkUpsert('rules', []);
      await repo.bulkUpsert('workingHoursPeriods', [PERIOD]);
      await repo.bulkUpsert('specialties', []);
      await repo.bulkUpsert('doctors', []);
      await repo.bulkUpsert('leaveTypes', LEAVE_TYPES);
      // The pending 16h request must not be counted while it is unapproved.
      await repo.bulkUpsert('leaveEntries', [straddling, pending]);
      await repo.bulkUpsert('assignments', run.assignments);

      const report = await validateScheduleById(SCHEDULE.id, repo);
      const hoursFindings = report.findings.filter((f) => f.category === 'HOURS_IMBALANCE');
      assert.equal(
        hoursFindings.length,
        0,
        `server report hours findings: ${hoursFindings.map((f) => f.message).join(' | ')}`
      );
      return 'Server validator counted 24h duty + 16h approved leave against the 40h period, ignoring the pending request.';
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  // ---------------------------------------------------------------- report

  const passed = results.filter((r) => r.passed).length;
  console.log('\n=== Phase 2 verification ===');
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.name}\n      ${r.detail}`);
  }
  console.log(`\n${passed}/${results.length} checks passed.`);

  if (passed !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Phase2Verify] Fatal:', err);
  process.exit(1);
});
