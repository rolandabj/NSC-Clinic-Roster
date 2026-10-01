/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4 verification harness (no test runner dependency — run with tsx).
 *
 * Proves, against real code paths, that a freshly seeded environment is generated with the
 * same engine contract the live app uses:
 *   1. The seeded window's authoritative target is period-derived (prorated across the two
 *      working-hours cycles it straddles), not the legacy schedule fallback.
 *   2. Both seed runners (client + server) expand doctor sessions through one shared bridge
 *      and pass the extra engine inputs (periods, doctors, leave types, history).
 *   3. The engine consumes those extras: with periods it resolves the period target, without
 *      them it falls back to `schedule.hoursTargetFullTime` and produces a different roster.
 *   4. The server seeder writes the config the engine contract needs, and that store config
 *      drives the engine to the period target.
 *   5. The configuration bootstrap guarantees the engine's leave-type inputs additively.
 *
 * NOTE: the demo payload (SEED_NURSES / SEED_DOCTORS) is intentionally empty in this repo
 * (production-clean policy), so the seeded roster itself is empty by design. The checks below
 * therefore exercise the contract with a synthetic roster on the real seeded configuration.
 *
 * Usage: npx tsx scripts/verify-phase4.ts   (or: npm run verify:phase4)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { JsonFileRepository } from '../server/db/jsonStore';
import { populateServerSeedData } from '../server/services/seed/serverSeedRunner';
import { ensureConfigurationDefaults } from '../src/services/seed/configDefaults';
import { calculateWorkingHoursForDateRange } from '../src/services/periods/workingHoursPeriodService';
import { SchedulingEngine } from '../src/services/engine/SchedulingEngine';
import type { GenerationResult } from '../src/services/engine/types';
import {
  SEED_CLINICAL_ROLES,
  SEED_DOCTORS,
  SEED_DUTY_WINDOWS,
  SEED_LEAVE_ENTRIES,
  SEED_LEAVE_TYPES,
  SEED_LOCKS,
  SEED_RULES,
  SEED_SCHEDULE,
  SEED_SENIORITY_LEVELS,
  SEED_SPECIALTIES,
  SEED_WORKING_HOURS_PERIODS,
} from '../src/services/seed/seedData';
import { buildSeedDoctorSessions, seedEngineExtras } from '../src/services/seed/seedEngineInputs';
import { buildOctober2026DoctorSessions as buildClientSeedSessions } from '../src/services/seed/seedRunner';
import { buildOctober2026DoctorSessions as buildServerSeedSessions } from '../server/services/seed/serverSeedRunner';
import {
  Assignment,
  ClinicalRole,
  Doctor,
  DoctorSession,
  DutyWindow,
  LeaveType,
  Nurse,
  SeniorityLevel,
  Specialty,
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

function tempRepo(prefix: string): { repo: JsonFileRepository; dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return { repo: new JsonFileRepository(dir), dir };
}

const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
};

// --------------------------------------------------------- synthetic roster fixtures

const SYNTH_DOCTOR: Doctor = {
  id: 'doc-phase4', fullName: 'Dr. Phase Four', specialtyIds: [SEED_SPECIALTIES[0].id],
  weeklyPattern: [], active: true,
} as Doctor;

const synthNurse = (id: string, name: string, seniorityLevelId: string): Nurse => ({
  id, fullName: name, gmail: `${id}@example.com`, employeeCode: id.toUpperCase(),
  seniorityLevelId, contractPercent: 100, dateOfBirth: '1990-01-01',
  capabilityIds: [], isClinicNurse: true, preferences: [], active: true,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
});

const SYNTH_NURSES: Nurse[] = [
  synthNurse('n4-charge', 'A Charge', 'seniority-charge'),
  synthNurse('n4-staff1', 'B Staff', SEED_SENIORITY_LEVELS[SEED_SENIORITY_LEVELS.length - 1].id),
  synthNurse('n4-staff2', 'C Staff', SEED_SENIORITY_LEVELS[SEED_SENIORITY_LEVELS.length - 1].id),
];

function synthSessions(days: number): DoctorSession[] {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(SEED_SCHEDULE.startDate, i);
    return {
      id: `sess-phase4-${i}`, doctorId: SYNTH_DOCTOR.id, date,
      startTime: '09:00', endTime: '13:00', specialtyId: SEED_SPECIALTIES[0].id,
      room: 'R1', source: 'MANUAL', cancelled: false,
    } as DoctorSession;
  });
}

interface SeedRunConfig {
  dutyWindows: DutyWindow[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  seniorityLevels: SeniorityLevel[];
  nurses: Nurse[];
  sessions: DoctorSession[];
  doctors: Doctor[];
  periods: WorkingHoursPeriod[];
  leaveTypes: LeaveType[];
}

async function runWithConfig(config: SeedRunConfig): Promise<GenerationResult> {
  return SchedulingEngine.generate(
    SEED_SCHEDULE,
    'GENERATE_ALL',
    [],
    config.nurses,
    config.seniorityLevels,
    config.dutyWindows,
    config.roles,
    config.specialties,
    config.sessions,
    SEED_LOCKS,
    SEED_LEAVE_ENTRIES,
    SEED_RULES,
    undefined,
    config.periods,
    config.doctors,
    config.leaveTypes,
    [] // history — a fresh seed has no earlier roster
  );
}

/** The real seeded configuration plus the synthetic roster used to exercise the contract. */
function seedRunConfig(overrides: Partial<SeedRunConfig> = {}): SeedRunConfig {
  const extras = seedEngineExtras();
  return {
    dutyWindows: SEED_DUTY_WINDOWS,
    roles: SEED_CLINICAL_ROLES,
    specialties: SEED_SPECIALTIES,
    seniorityLevels: SEED_SENIORITY_LEVELS,
    nurses: SYNTH_NURSES,
    sessions: synthSessions(10),
    doctors: [SYNTH_DOCTOR, ...extras.doctors],
    periods: extras.workingHoursPeriods,
    leaveTypes: extras.leaveTypes,
    ...overrides,
  };
}

async function main(): Promise<void> {
  // 1 — The seeded window target is period-derived ----------------
  await check('Seed window target is derived from the working-hours periods (prorated)', () => {
    const calc = calculateWorkingHoursForDateRange(
      SEED_SCHEDULE.startDate,
      SEED_SCHEDULE.endDate,
      SEED_WORKING_HOURS_PERIODS
    );
    assert.ok(calc.targetHours > 0, 'no period target for the seeded schedule window');
    assert.equal(calc.isExactMatch, false, 'the seeded window unexpectedly matches a single period');
    assert.equal(calc.isProrated, true, 'the seeded window should be prorated across two cycles');
    assert.equal(calc.breakdown.length, 2, `expected 2 contributing periods, got ${calc.breakdown.length}`);
    const contributed = calc.breakdown.reduce((s, b) => s + b.contributedHours, 0);
    assert.ok(
      Math.abs(contributed - calc.targetHours) <= 1,
      `breakdown contributions (${contributed}h) do not add up to the target (${calc.targetHours}h)`
    );
    assert.ok(
      calc.targetHours > SEED_SCHEDULE.hoursTargetFullTime,
      `period target ${calc.targetHours}h should exceed the legacy fallback ${SEED_SCHEDULE.hoursTargetFullTime}h`
    );
    return `Oct 2026 target = ${calc.targetHours}h (${calc.breakdown
      .map((b) => `${b.periodName} ${Math.round(b.contributedHours)}h`)
      .join(' + ')}); legacy fallback was ${SEED_SCHEDULE.hoursTargetFullTime}h.`;
  });

  // 2 — Both seed runners share one bridge ------------------------
  await check('Client and server seed runners share the session expansion and engine extras', () => {
    const shared = buildSeedDoctorSessions();
    const client = buildClientSeedSessions();
    const server = buildServerSeedSessions();
    assert.equal(
      JSON.stringify(client),
      JSON.stringify(shared),
      'the client seed runner does not use the shared session expansion'
    );
    assert.equal(
      JSON.stringify(server),
      JSON.stringify(shared),
      'the server seed runner does not use the shared session expansion'
    );

    const extras = seedEngineExtras();
    assert.equal(extras.workingHoursPeriods.length, 12, 'seed extras must carry the 12 periods');
    assert.equal(extras.doctors.length, SEED_DOCTORS.length, 'seed extras must carry the seed doctors');
    assert.equal(extras.leaveTypes.length, 6, 'seed extras must carry the 6 leave types');
    assert.equal(extras.historyAssignments.length, 0, 'a fresh seed must not invent history');

    const ro = extras.leaveTypes.find((lt) => lt.acronym === 'RO');
    const doType = extras.leaveTypes.find((lt) => lt.acronym === 'DO');
    const al = extras.leaveTypes.find((lt) => lt.acronym === 'AL');
    assert.ok(ro && ro.creditedHours === 0 && ro.countsTowardHoursTarget === false, 'RO must credit 0h');
    assert.ok(doType && doType.creditedHours === 0, 'DO must credit 0h');
    assert.ok(al && al.creditedHours === 8 && al.countsTowardHoursTarget === true, 'AL must credit 8h');

    // The runners must actually feed the extras into their engine call.
    const repoRoot = process.cwd();
    const runnerSources = [
      fs.readFileSync(path.join(repoRoot, 'src', 'services', 'seed', 'seedRunner.ts'), 'utf8'),
      fs.readFileSync(
        path.join(repoRoot, 'server', 'services', 'seed', 'serverSeedRunner.ts'),
        'utf8'
      ),
    ];
    runnerSources.forEach((source, i) => {
      const label = i === 0 ? 'client' : 'server';
      assert.ok(source.includes('seedEngineInputs'), `${label} seed runner does not use the shared bridge`);
      assert.ok(source.includes('seedEngineExtras()'), `${label} seed runner does not build the engine extras`);
      assert.ok(
        source.includes('seedExtras.workingHoursPeriods') &&
          source.includes('seedExtras.doctors') &&
          source.includes('seedExtras.leaveTypes') &&
          source.includes('seedExtras.historyAssignments'),
        `${label} seed runner does not pass every extra to the engine`
      );
    });

    const demoNote =
      shared.length === 0
        ? ' (demo nurses/doctors are intentionally empty — production-clean policy)'
        : '';
    return `${shared.length} shared sessions identical in both runners${demoNote}; extras: 12 periods, ${extras.doctors.length} doctors, 6 leave types, no history.`;
  });

  // 3 — The engine consumes the extras ----------------------------
  await check('Engine resolves the period target with the seed extras (legacy fallback without)', async () => {
    const periodTarget = calculateWorkingHoursForDateRange(
      SEED_SCHEDULE.startDate,
      SEED_SCHEDULE.endDate,
      SEED_WORKING_HOURS_PERIODS
    ).targetHours;

    const withPeriods = await runWithConfig(seedRunConfig());
    assert.ok(withPeriods.assignments.length > 0, 'the contract run produced no assignments');
    assert.equal(
      withPeriods.effectiveFullTimeTarget,
      periodTarget,
      `engine target ${withPeriods.effectiveFullTimeTarget}h != period target ${periodTarget}h`
    );
    assert.ok(withPeriods.periodName, 'a period name should be reported when periods are supplied');

    const legacy = await runWithConfig(seedRunConfig({ periods: [] }));
    assert.equal(
      legacy.effectiveFullTimeTarget,
      SEED_SCHEDULE.hoursTargetFullTime,
      `without periods the engine should fall back to ${SEED_SCHEDULE.hoursTargetFullTime}h`
    );
    assert.notEqual(
      legacy.assignments.length,
      withPeriods.assignments.length,
      'period-driven and legacy runs produced identical rosters — the extras are not consumed'
    );
    return `With periods: ${withPeriods.assignments.length} assignments at target ${withPeriods.effectiveFullTimeTarget}h ` +
      `(${withPeriods.periodName}); legacy: ${legacy.assignments.length} assignments at ${legacy.effectiveFullTimeTarget}h.`;
  });

  // 4 — The seeded store carries the contract's config -------------
  await check('Server seeder writes the config the engine contract reads', async () => {
    const { repo, dir } = tempRepo('phase4-seed-');
    try {
      await populateServerSeedData(repo);
      const [periods, leaveTypes, roles, rules, dutyWindows, schedules, nurses, doctors, assignments] =
        await Promise.all([
          repo.list('workingHoursPeriods'),
          repo.list('leaveTypes'),
          repo.list('clinicalRoles'),
          repo.list('rules'),
          repo.list('dutyWindows'),
          repo.list('schedules'),
          repo.list('nurses'),
          repo.list('doctors'),
          repo.list('assignments'),
        ]);

      assert.equal(periods.length, 12, `expected 12 seeded periods, got ${periods.length}`);
      assert.equal(leaveTypes.length, 6, `expected 6 seeded leave types, got ${leaveTypes.length}`);
      assert.ok(roles.length >= 2, `expected system roles, got ${roles.length}`);
      assert.equal(rules.length, 9, `expected 9 canonical rules, got ${rules.length}`);
      assert.equal(dutyWindows.length, 3, `expected 3 seeded duty windows, got ${dutyWindows.length}`);
      assert.equal(schedules.length, 1, `expected 1 seeded schedule, got ${schedules.length}`);
      // Demo payload is intentionally empty (production-clean policy).
      assert.equal(nurses.length, 0, 'seeded nurses should be empty in the production-clean dataset');
      assert.equal(doctors.length, 0, 'seeded doctors should be empty in the production-clean dataset');
      assert.equal(assignments.length, 0, 'seeded assignments should be empty in the production-clean dataset');

      // The store's configuration is exactly what the runners pass to the engine.
      const extras = seedEngineExtras();
      assert.equal(
        JSON.stringify(periods),
        JSON.stringify(extras.workingHoursPeriods),
        'seeded periods differ from the engine extras'
      );
      assert.equal(
        JSON.stringify(leaveTypes),
        JSON.stringify(extras.leaveTypes),
        'seeded leave types differ from the engine extras'
      );

      // Store-loaded configuration drives the engine to the same period target.
      const periodTarget = calculateWorkingHoursForDateRange(
        SEED_SCHEDULE.startDate,
        SEED_SCHEDULE.endDate,
        periods as WorkingHoursPeriod[]
      ).targetHours;
      const engineResult = await runWithConfig(
        seedRunConfig({
          dutyWindows: dutyWindows as DutyWindow[],
          periods: periods as WorkingHoursPeriod[],
          leaveTypes: leaveTypes as LeaveType[],
          roles: roles as ClinicalRole[],
          doctors: [SYNTH_DOCTOR],
        })
      );
      assert.equal(
        engineResult.effectiveFullTimeTarget,
        periodTarget,
        `store config resolved ${engineResult.effectiveFullTimeTarget}h, expected ${periodTarget}h`
      );
      return `Seed store: 12 periods, 6 leave types, 9 rules, 3 duty windows; demo payload empty by design; ` +
        `store config drives the engine to ${periodTarget}h.`;
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  // 5 — Bootstrap guarantees the leave-type inputs -----------------
  await check('Configuration bootstrap ensures leave types additively', async () => {
    const { repo, dir } = tempRepo('phase4-bootstrap-');
    const custom = tempRepo('phase4-custom-');
    try {
      const first = await ensureConfigurationDefaults(repo, { logPrefix: '[verify]' });
      assert.equal(first.leaveTypesAdded, 6, `expected 6 leave types, got ${first.leaveTypesAdded}`);
      const seeded = (await repo.list('leaveTypes')) as LeaveType[];
      assert.equal(seeded.length, 6, `expected 6 leave types in the repo, got ${seeded.length}`);
      const ro = seeded.find((lt) => lt.acronym === 'RO');
      assert.ok(ro && ro.creditedHours === 0 && !ro.countsTowardHoursTarget, 'RO bootstrap row is wrong');

      const second = await ensureConfigurationDefaults(repo, { logPrefix: '[verify]' });
      assert.equal(second.leaveTypesAdded, 0, 'leave types were re-created on the second run');
      assert.equal((await repo.list('leaveTypes')).length, 6, 'leave type count drifted');

      // A customised (non-empty) set must never be overwritten.
      await custom.repo.create('leaveTypes', {
        id: 'leave-custom', name: 'Custom Leave', acronym: 'CUS', creditedHours: 4,
        countsTowardHoursTarget: true, color: '#000000', active: true,
      } as any);
      const customSummary = await ensureConfigurationDefaults(custom.repo, { logPrefix: '[verify]' });
      assert.equal(customSummary.leaveTypesAdded, 0, 'a customised leave-type set was overwritten');
      const customTypes = await custom.repo.list('leaveTypes');
      assert.equal(customTypes.length, 1, `custom leave-type set changed (${customTypes.length} rows)`);
      return 'Fresh DB → 6 standard leave types (RO/DO = 0h); second run adds none; custom sets untouched.';
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(custom.dir, { recursive: true, force: true });
    }
  });

  // ---------------------------------------------------------------- report

  const passed = results.filter((r) => r.passed).length;
  console.log('\n=== Phase 4 verification ===');
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.name}\n      ${r.detail}`);
  }
  console.log(`\n${passed}/${results.length} checks passed.`);

  if (passed !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Phase4Verify] Fatal:', err);
  process.exit(1);
});
