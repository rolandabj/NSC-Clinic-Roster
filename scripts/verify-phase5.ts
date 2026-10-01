/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 verification harness (no test runner dependency — run with tsx).
 *
 * Proves that the hours **reports, exports and UI accounting** resolve the same authoritative
 * full-time target as the engine and the validator (Phase 5 parity):
 *   1. The report target follows the working-hours period when one matches the schedule window.
 *   2. The report falls back to `schedule.hoursTargetFullTime` when no period applies.
 *   3. Engine, validator and report agree on one target for the same schedule.
 *   4. The Excel export's Hours sheet carries the same target (period wins over fallback).
 *   5. Clinic metrics aggregate the report rows unchanged.
 *
 * The fixture deliberately sets `hoursTargetFullTime = 160` while the matching working-hours
 * period is 40h, so any consumer still reading the fallback is caught.
 *
 * Usage: npx tsx scripts/verify-phase5.ts   (or: npm run verify:phase5)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { SchedulingEngine } from '../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../src/services/validation/ScheduleValidator';
import {
  calculateClinicHoursMetrics,
  calculateNurseHoursAccounting,
  resolveFullTimeTargetHours,
} from '../src/services/reports/hoursAccounting';
import { exportRosterToExcel } from '../src/services/export/rosterExportService';
import {
  Assignment,
  DutyWindow,
  LeaveType,
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

// --------------------------------------------------------------------------- fixture

const START = '2026-11-01';
const END = '2026-11-07'; // 7 days
const PERIOD_HOURS = 40;

const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
};

const SCHEDULE: Schedule = {
  id: 'sch-phase5', name: 'Phase 5 parity', startDate: START, endDate: END, blockWeeks: 1,
  // Deliberately "wrong": the period target (40h) must win everywhere.
  hoursTargetFullTime: 160,
  status: 'DRAFT', activeVersionNumber: 1,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
};

const PERIOD: WorkingHoursPeriod = {
  id: 'whp-phase5', year: '2026', name: 'Parity period',
  startDate: START, endDate: END, workingHours: PERIOD_HOURS,
  createdAt: '2026-01-01T00:00:00Z',
};

const SENIORITY: SeniorityLevel[] = [
  { id: 'seniority-senior', name: 'Charge Nurse', rank: 1, isSenior: true, color: '#4f46e5' },
  { id: 'seniority-staff', name: 'Staff Nurse', rank: 3, isSenior: false, color: '#0ea5e9' },
];

const DUTY_D: DutyWindow = {
  id: 'duty-d', name: 'Full Day', acronym: 'D', startTime: '09:00', endTime: '17:00',
  color: '#3b82f6', active: true, isPriority: true, priorityRank: 100,
};

const LEAVE_TYPES: LeaveType[] = [
  { id: 'lt-ro', name: 'Request Off', acronym: 'RO', creditedHours: 0, countsTowardHoursTarget: false, color: '#94a3b8', active: true },
  { id: 'lt-al', name: 'Annual Leave', acronym: 'AL', creditedHours: 8, countsTowardHoursTarget: true, color: '#f59e0b', active: true },
];

const makeNurse = (id: string, name: string, contractPercent = 100): Nurse => ({
  id, fullName: name, gmail: `${id}@example.com`, employeeCode: id.toUpperCase(),
  seniorityLevelId: 'seniority-senior', contractPercent, dateOfBirth: '1990-01-01',
  capabilityIds: [], isClinicNurse: true, preferences: [], active: true,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
});

const NURSE = makeNurse('n-ft', 'A Fulltimer');
const PART_TIMER = makeNurse('n-pt', 'B Parttimer', 50);

async function generateAssignments(): Promise<Assignment[]> {
  const result = await SchedulingEngine.generate(
    SCHEDULE, 'GENERATE_ALL', [], [NURSE], SENIORITY, [DUTY_D], [], [], [], [], [], [],
    undefined, [PERIOD], [], LEAVE_TYPES, []
  );
  return result.assignments;
}

const accounting = (
  nurse: Nurse,
  assignments: Assignment[],
  periods: WorkingHoursPeriod[]
) =>
  calculateNurseHoursAccounting(
    nurse, SCHEDULE, assignments, [DUTY_D], [], LEAVE_TYPES,
    SENIORITY, [], [], [], [], periods
  );

async function main(): Promise<void> {
  const assignments = await generateAssignments();

  // 1 — Period target wins in the report --------------------------
  await check('Report target follows the working-hours period (not the schedule fallback)', () => {
    const acct = accounting(NURSE, assignments, [PERIOD]);
    assert.equal(
      acct.fullTimeTargetHours,
      PERIOD_HOURS,
      `full-time target ${acct.fullTimeTargetHours}h != period ${PERIOD_HOURS}h`
    );
    assert.equal(acct.targetHours, PERIOD_HOURS, `100% nurse target ${acct.targetHours}h != ${PERIOD_HOURS}h`);

    const partTime = accounting(PART_TIMER, assignments, [PERIOD]);
    assert.equal(
      partTime.targetHours,
      Math.round(PERIOD_HOURS / 2),
      `50% nurse target ${partTime.targetHours}h != ${Math.round(PERIOD_HOURS / 2)}h`
    );
    return `100% → ${acct.targetHours}h, 50% → ${partTime.targetHours}h, both period-derived (fallback would be 160h/80h).`;
  });

  // 2 — Fallback semantics, shared with the engine -----------------
  await check('Report falls back to the schedule target without periods (edge case matches engine)', async () => {
    const acct = accounting(NURSE, assignments, []);
    assert.equal(acct.fullTimeTargetHours, SCHEDULE.hoursTargetFullTime, 'fallback target is wrong');
    assert.equal(acct.targetHours, SCHEDULE.hoursTargetFullTime, 'fallback 100% target is wrong');

    // A period list that does not overlap the window resolves to the standard weekly
    // proration (40h/week) — the same edge case the engine resolves, so the two must agree.
    const unrelated: WorkingHoursPeriod = {
      ...PERIOD, id: 'whp-elsewhere', startDate: '2027-01-01', endDate: '2027-01-31',
    };
    const unrelatedAcct = accounting(NURSE, assignments, [unrelated]);
    const unrelatedEngine = await SchedulingEngine.generate(
      SCHEDULE, 'GENERATE_ALL', [], [NURSE], SENIORITY, [DUTY_D], [], [], [], [], [], [],
      undefined, [unrelated], [], LEAVE_TYPES, []
    );
    assert.equal(
      unrelatedAcct.targetHours,
      unrelatedEngine.effectiveFullTimeTarget,
      `edge-case targets disagree (report ${unrelatedAcct.targetHours}h vs engine ${unrelatedEngine.effectiveFullTimeTarget}h)`
    );
    return `No period → ${acct.targetHours}h (schedule fallback); non-overlapping period → ${unrelatedAcct.targetHours}h, identical to the engine.`;
  });

  // 3 — Engine / validator / report agree -------------------------
  await check('Engine, validator and report resolve one target for the same schedule', async () => {
    const engineResult = await SchedulingEngine.generate(
      SCHEDULE, 'GENERATE_ALL', [], [NURSE], SENIORITY, [DUTY_D], [], [], [], [], [], [],
      undefined, [PERIOD], [], LEAVE_TYPES, []
    );
    const report = accounting(NURSE, engineResult.assignments, [PERIOD]);
    assert.equal(engineResult.effectiveFullTimeTarget, PERIOD_HOURS, 'engine target is not period-derived');
    assert.equal(report.targetHours, engineResult.effectiveFullTimeTarget, 'report and engine targets disagree');

    // A partial roster (first 2 days only) sits far below the 40h target, so the validator must
    // report the deficit *against the period target* if it resolved the same number.
    const partial = engineResult.assignments.filter((a) => a.date < addDays(START, 2));
    const validation = ScheduleValidator.validate(
      SCHEDULE, partial, [NURSE], SENIORITY, [DUTY_D], [],
      [], [], [], [], [PERIOD], [], [], LEAVE_TYPES
    );
    const hourFindings = validation.findings.filter((f) => f.category === 'HOURS_IMBALANCE');
    assert.ok(hourFindings.length > 0, 'expected the validator to report the hours deficit of a partial roster');
    assert.ok(
      hourFindings.every((f) => f.message.includes(`target ${PERIOD_HOURS}h`)),
      `validator target is not ${PERIOD_HOURS}h: ${hourFindings.map((f) => f.message).join(' | ')}`
    );
    assert.ok(
      hourFindings.every((f) => !f.message.includes(`target ${SCHEDULE.hoursTargetFullTime}h`)),
      'validator fell back to schedule.hoursTargetFullTime'
    );
    return `Engine, validator and report all at ${PERIOD_HOURS}h (validator: "${hourFindings[0].message}").`;
  });

  // 4 — Excel export parity ----------------------------------------
  await check('Excel export Hours sheet carries the period target', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phase5-export-'));
    const cwd = process.cwd();
    const readHoursSheet = (periods: WorkingHoursPeriod[] | undefined): any[][] => {
      process.chdir(tmpDir);
      try {
        const wb = exportRosterToExcel({
          clinicName: 'Parity Clinic', schedule: SCHEDULE, assignments,
          nurses: [NURSE], dutyWindows: [DUTY_D], leaveEntries: [], leaveTypes: LEAVE_TYPES,
          seniorityLevels: SENIORITY, doctors: [], sessions: [], roles: [], specialties: [],
          workingHoursPeriods: periods,
        } as any);
        const sheet = wb.Sheets['Hours'];
        assert.ok(sheet, 'Hours sheet missing from the export');
        return XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      } finally {
        process.chdir(cwd);
      }
    };

    try {
      const withPeriods = readHoursSheet([PERIOD]);
      const header = withPeriods[0].map((h: any) => String(h));
      const targetCol = header.indexOf('Target Hours');
      assert.ok(targetCol >= 0, `Target Hours column missing (header: ${header.join(', ')})`);
      const row = withPeriods.find((r) => String(r[1]) === NURSE.fullName);
      assert.ok(row, 'the exported nurse row is missing');
      assert.equal(
        row[targetCol],
        PERIOD_HOURS,
        `exported target ${row[targetCol]}h != period ${PERIOD_HOURS}h`
      );

      // The Roster sheet header line must state the same authoritative target.
      process.chdir(tmpDir);
      let rosterHeaderTarget = '';
      try {
        const wb = exportRosterToExcel({
          clinicName: 'Parity Clinic', schedule: SCHEDULE, assignments,
          nurses: [NURSE], dutyWindows: [DUTY_D], leaveEntries: [], leaveTypes: LEAVE_TYPES,
          seniorityLevels: SENIORITY, doctors: [], sessions: [], roles: [], specialties: [],
          workingHoursPeriods: [PERIOD],
        } as any);
        const rosterRows = XLSX.utils.sheet_to_json(wb.Sheets['Roster'], { header: 1 }) as any[][];
        // Row 0 is the clinic/title banner; row 1 carries the period + target line.
        rosterHeaderTarget = String(rosterRows[1]?.[5] || '');
      } finally {
        process.chdir(cwd);
      }
      assert.equal(
        rosterHeaderTarget,
        `Target: ${PERIOD_HOURS}h Full-Time`,
        `Roster header states "${rosterHeaderTarget}" instead of the period target`
      );

      const withoutPeriods = readHoursSheet(undefined);
      const fallbackCol = withoutPeriods[0].map((h: any) => String(h)).indexOf('Target Hours');
      const fallbackRow = withoutPeriods.find((r) => String(r[1]) === NURSE.fullName);
      assert.equal(
        fallbackRow![fallbackCol],
        SCHEDULE.hoursTargetFullTime,
        'without periods the export should fall back to schedule.hoursTargetFullTime'
      );
      return `Hours sheet target: ${row[targetCol]}h with the period, ${fallbackRow![fallbackCol]}h without it.`;
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  // 5 — Clinic metrics aggregate the rows -------------------------
  await check('Clinic metrics aggregate the period-derived rows unchanged', () => {
    const rows = [accounting(NURSE, assignments, [PERIOD]), accounting(PART_TIMER, assignments, [PERIOD])];
    const metrics = calculateClinicHoursMetrics(rows, [DUTY_D], SENIORITY);
    const expected = rows.reduce((s, r) => s + r.targetHours, 0);
    assert.equal(
      metrics.totalContractedTargetHours,
      expected,
      `metrics total ${metrics.totalContractedTargetHours}h != row sum ${expected}h`
    );
    assert.equal(expected, PERIOD_HOURS + Math.round(PERIOD_HOURS / 2), 'row sum is not period-derived');
    assert.equal(
      resolveFullTimeTargetHours(SCHEDULE, [PERIOD]),
      PERIOD_HOURS,
      'resolver disagrees with the aggregated rows'
    );
    return `Clinic target ${metrics.totalContractedTargetHours}h = 40h + 20h from the period-derived rows.`;
  });

  // ---------------------------------------------------------------- report

  const passed = results.filter((r) => r.passed).length;
  console.log('\n=== Phase 5 verification ===');
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.name}\n      ${r.detail}`);
  }
  console.log(`\n${passed}/${results.length} checks passed.`);

  if (passed !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Phase5Verify] Fatal:', err);
  process.exit(1);
});
