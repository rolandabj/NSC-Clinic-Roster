/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 verification harness (no test runner dependency — run with tsx).
 *
 * Proves that the nurse-facing published email summary (RosterPublishService) now agrees with
 * the engine, validator, reports and exports (Phase 5 parity extended to the publish surface):
 *   1. Contract target comes from the working-hours period (schedule fallback only when absent),
 *      and is prorated by the nurse's contract percentage.
 *   2. Leave credit is type-driven and counted per day (AL 2 days = 16h, RO = 0h) — the email
 *      previously credited one flat 8h day per leave entry.
 *   3. Leave credit is clipped to the schedule window.
 *   4. A 'match_duty' leave type credits DEFAULT_DUTY_HOURS (8h) per day in the window.
 *   5. Duty hours and target shown in the email equal the hours report for the same roster.
 *
 * Fixture: `hoursTargetFullTime = 160` while the matching period is 40h, so any consumer still
 * reading the fallback (or a flat leave credit) fails the check.
 *
 * Usage: npx tsx scripts/verify-phase6.ts   (or: npm run verify:phase6)
 */

import assert from 'node:assert/strict';
import { RosterPublishService } from '../src/services/publish/rosterPublishService';
import { calculateNurseHoursAccounting } from '../src/services/reports/hoursAccounting';
import { clippedLeaveCredit } from '../src/services/leave/leaveCredit';
import {
  Assignment,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  Nurse,
  Schedule,
  ScheduleVersion,
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

// --------------------------------------------------------------------------- fixture

const START = '2026-11-01';
const END = '2026-11-07';
const PERIOD_HOURS = 40;

const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
};
const DATES = Array.from({ length: 7 }, (_, i) => addDays(START, i));

const SCHEDULE: Schedule = {
  id: 'sch-phase6', name: 'Phase 6 publish parity', startDate: START, endDate: END, blockWeeks: 1,
  // Deliberately "wrong": the period target (40h) must win in the email too.
  hoursTargetFullTime: 160,
  status: 'DRAFT', activeVersionNumber: 1,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
};

const PERIOD: WorkingHoursPeriod = {
  id: 'whp-phase6', year: '2026', name: 'Parity period',
  startDate: START, endDate: END, workingHours: PERIOD_HOURS,
  createdAt: '2026-01-01T00:00:00Z',
};

const VERSION: ScheduleVersion = {
  id: 'ver-phase6', scheduleId: SCHEDULE.id, number: 2, timestamp: '2026-01-01T00:00:00Z',
  author: 'Verify', note: 'Phase 6',
  snapshot: { schedule: SCHEDULE, assignments: [], leaveEntries: [], locks: [], rulesSnapshot: [] },
  isPublished: true,
};

const SENIORITY: SeniorityLevel[] = [
  { id: 'seniority-senior', name: 'Charge Nurse', rank: 1, isSenior: true, color: '#4f46e5' },
];

const DUTY_D: DutyWindow = {
  id: 'duty-d', name: 'Full Day', acronym: 'D', startTime: '09:00', endTime: '17:00',
  color: '#3b82f6', active: true, isPriority: true, priorityRank: 100,
};

const LT_AL: LeaveType = { id: 'lt-al', name: 'Annual Leave', acronym: 'AL', creditedHours: 8, countsTowardHoursTarget: true, color: '#f59e0b', active: true };
const LT_RO: LeaveType = { id: 'lt-ro', name: 'Request Off', acronym: 'RO', creditedHours: 0, countsTowardHoursTarget: false, color: '#94a3b8', active: true };
const LT_MATCH: LeaveType = { id: 'lt-md', name: 'Match Duty', acronym: 'MD', creditedHours: 'match_duty', countsTowardHoursTarget: true, color: '#22c55e', active: true };

const NURSE: Nurse = {
  id: 'n-ft', fullName: 'A Fulltimer', gmail: 'n-ft@example.com', employeeCode: 'N-FT',
  seniorityLevelId: 'seniority-senior', contractPercent: 100, dateOfBirth: '1990-01-01',
  capabilityIds: [], isClinicNurse: true, preferences: [], active: true,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
};
const PART_TIMER: Nurse = { ...NURSE, id: 'n-pt', fullName: 'B Parttimer', employeeCode: 'N-PT', contractPercent: 50 };

/** Two full-day duties on days 0–1 → 16h duty hours. */
const DUTIES: Assignment[] = [0, 1].map((i) => ({
  id: `asgn-${i}`, scheduleId: SCHEDULE.id, nurseId: NURSE.id, date: DATES[i],
  dutyWindowId: DUTY_D.id, kind: 'CLINICAL_ROLE' as const, clinicalRoleId: 'role-float',
  locked: false, source: 'GENERATED' as const,
}));

const makeLeave = (over: Partial<LeaveEntry> & Pick<LeaveEntry, 'leaveTypeId' | 'startDate' | 'endDate'>): LeaveEntry => ({
  id: `leave-${over.leaveTypeId}-${over.startDate}`,
  nurseId: NURSE.id,
  // 0 (not a positive snapshot) keeps the credit type-driven, which is what we verify here.
  hoursCredited: 0,
  approved: true,
  ...over,
});

interface EmailOptions {
  nurse?: Nurse;
  assignments?: Assignment[];
  leaveEntries?: LeaveEntry[];
  leaveTypes?: LeaveType[];
  periods?: WorkingHoursPeriod[];
}

function emailFor(opts: EmailOptions = {}) {
  const nurse = opts.nurse ?? NURSE;
  return RosterPublishService.generatePersonalEmailHtml({
    clinicName: 'Parity Clinic',
    schedule: SCHEDULE,
    version: VERSION,
    nurse,
    assignments: opts.assignments ?? DUTIES,
    dutyWindows: [DUTY_D],
    doctors: [],
    roles: [],
    specialties: [],
    leaveEntries: opts.leaveEntries ?? [],
    leaveTypes: opts.leaveTypes ?? [LT_AL, LT_RO, LT_MATCH],
    workingHoursPeriods: opts.periods ?? [PERIOD],
    ackToken: 'ack-phase6-token',
  });
}

/** Reads one metric cell out of the rendered email HTML (e.g. "Contract Target" → 40). */
function emailMetric(html: string, label: string): number {
  const re = new RegExp(`${label}</div>\\s*<div[^>]*>\\s*([+-]?\\d+)h`, 'm');
  const match = html.match(re);
  assert.ok(match, `metric "${label}" not found in the email HTML`);
  return Number(match![1]);
}

async function main(): Promise<void> {
  // 1 — Contract target ------------------------------------------------------
  await check('Email contract target follows the working-hours period (and contract %)', () => {
    const fullTime = emailFor();
    assert.equal(emailMetric(fullTime.html, 'Contract Target'), PERIOD_HOURS, 'full-time email target is not period-derived');

    const partTime = emailFor({ nurse: PART_TIMER });
    assert.equal(
      emailMetric(partTime.html, 'Contract Target'),
      Math.round(PERIOD_HOURS / 2),
      '50% nurse email target is not prorated from the period target'
    );

    const fallback = emailFor({ periods: [] });
    assert.equal(
      emailMetric(fallback.html, 'Contract Target'),
      SCHEDULE.hoursTargetFullTime,
      'without periods the email should fall back to schedule.hoursTargetFullTime'
    );
    return `Period → ${PERIOD_HOURS}h, 50% → ${Math.round(PERIOD_HOURS / 2)}h, no periods → ${SCHEDULE.hoursTargetFullTime}h (fallback).`;
  });

  // 2 — Leave credits --------------------------------------------------------
  await check('Email leave credit is type-driven and counted per day (AL 16h / RO 0h)', () => {
    const alLeave = makeLeave({ leaveTypeId: LT_AL.id, startDate: DATES[4], endDate: DATES[5] });
    const al = emailFor({ leaveEntries: [alLeave], leaveTypes: [LT_AL, LT_RO, LT_MATCH] });
    assert.equal(emailMetric(al.html, 'Leave Credited'), 16, '2 AL days should credit 16h (was a flat 8h per entry)');
    assert.equal(emailMetric(al.html, 'Duties Worked'), 16, 'duty hours changed unexpectedly');

    const roLeave = makeLeave({ leaveTypeId: LT_RO.id, startDate: DATES[4], endDate: DATES[5] });
    const ro = emailFor({ leaveEntries: [roLeave], leaveTypes: [LT_AL, LT_RO, LT_MATCH] });
    assert.equal(emailMetric(ro.html, 'Leave Credited'), 0, 'RO must credit 0h');
    assert.ok(
      ro.bodyPreview.includes('Total: 16h'),
      `RO run total should stay at the 16 duty hours, got: ${ro.bodyPreview}`
    );
    return `AL 2 days → 16h credited (net ${emailMetric(al.html, 'Net Balance')}h); RO 2 days → 0h credited (total stays 16h).`;
  });

  // 3 — Window clipping ------------------------------------------------------
  await check('Email leave credit is clipped to the schedule window', () => {
    // 5-day AL straddling the schedule start: only the 2 in-window days may credit.
    const straddling = makeLeave({
      leaveTypeId: LT_AL.id, startDate: addDays(START, -3), endDate: addDays(START, 1),
    });
    const payload = emailFor({ leaveEntries: [straddling] });
    const expected = clippedLeaveCredit(straddling, LT_AL, SCHEDULE.startDate, SCHEDULE.endDate);
    assert.equal(expected, 16, `harness expectation drifted: clippedLeaveCredit returned ${expected}`);
    assert.equal(
      emailMetric(payload.html, 'Leave Credited'),
      expected,
      `email credited ${emailMetric(payload.html, 'Leave Credited')}h instead of the clipped ${expected}h`
    );
    return `5-day AL straddling the start credits ${expected}h (2 in-window days), identical to leaveCredit.`;
  });

  // 4 — match_duty -----------------------------------------------------------
  await check('match_duty leave credits DEFAULT_DUTY_HOURS per in-window day', () => {
    const matchLeave = makeLeave({ leaveTypeId: LT_MATCH.id, startDate: DATES[4], endDate: DATES[5] });
    const payload = emailFor({ leaveEntries: [matchLeave], leaveTypes: [LT_AL, LT_RO, LT_MATCH] });
    assert.equal(
      emailMetric(payload.html, 'Leave Credited'),
      16,
      `match_duty should credit 8h/day → 16h, got ${emailMetric(payload.html, 'Leave Credited')}h`
    );
    return 'Two match-duty days credit 16h (8h/day), matching the report and validator.';
  });

  // 5 — Cross-surface parity --------------------------------------------------
  await check('Email duty hours and target equal the hours report for the same roster', () => {
    const alLeave = makeLeave({ leaveTypeId: LT_AL.id, startDate: DATES[4], endDate: DATES[5] });
    const leaveEntries = [alLeave];
    const payload = emailFor({ leaveEntries, leaveTypes: [LT_AL, LT_RO, LT_MATCH] });

    const report = calculateNurseHoursAccounting(
      NURSE, SCHEDULE, DUTIES, [DUTY_D], leaveEntries, [LT_AL, LT_RO, LT_MATCH],
      SENIORITY, [], [], [], [], [PERIOD]
    );

    assert.equal(emailMetric(payload.html, 'Duties Worked'), Math.round(report.dutyHours), 'duty hours diverge from the report');
    assert.equal(emailMetric(payload.html, 'Leave Credited'), Math.round(report.leaveHours), 'leave credit diverges from the report');
    assert.equal(emailMetric(payload.html, 'Contract Target'), report.targetHours, 'target diverges from the report');
    assert.equal(
      emailMetric(payload.html, 'Net Balance'),
      Math.round(report.totalEarnedHours - report.targetHours),
      'net balance diverges from the report'
    );
    assert.ok(
      payload.bodyPreview.includes(`Total: ${Math.round(report.totalEarnedHours)}h`),
      `body preview total diverges from the report: ${payload.bodyPreview}`
    );
    return `Email and report agree: ${Math.round(report.dutyHours)}h duty + ${Math.round(report.leaveHours)}h leave vs ${report.targetHours}h target → ${Math.round(report.varianceHours)}h balance.`;
  });

  // ---------------------------------------------------------------- report

  const passed = results.filter((r) => r.passed).length;
  console.log('\n=== Phase 6 verification ===');
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.name}\n      ${r.detail}`);
  }
  console.log(`\n${passed}/${results.length} checks passed.`);

  if (passed !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Phase6Verify] Fatal:', err);
  process.exit(1);
});
