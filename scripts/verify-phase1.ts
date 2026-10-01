/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 1 verification harness (no test runner dependency — run with tsx).
 *
 * Proves, against real code paths:
 *   1. Collection plumbing: workingHoursPeriods is a first-class server collection.
 *   2. Configuration bootstrap is present and idempotent (roles, rules, periods).
 *   3. Lock scoping: tagged locks match by scheduleId, legacy locks by date window.
 *   4. Engine isolation: a foreign schedule's OFF lock no longer suppresses a duty.
 *   5. Float Pool system role exists with a 0 quota and generates no daily slots.
 *   6. Validator surfaces missing-specialty sessions and OFF-lock breaches.
 *   7. Doctor pattern expansion no longer emits the orphan 'spec-gp' specialty.
 *
 * Usage: npx tsx scripts/verify-phase1.ts
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { JsonFileRepository, ALL_COLLECTIONS } from '../server/db/jsonStore';
import { ensureServerConfigurationDefaults } from '../server/services/seed/serverSeedRunner';
import {
  ensureCanonicalRules,
  ensureConfigurationDefaults,
  ensureSystemClinicalRoles,
} from '../src/services/seed/configDefaults';
import { filterLocksForSchedule, resolveScheduleIdForLockDate } from '../src/services/schedule/lockScope';
import { SchedulingEngine } from '../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../src/services/validation/ScheduleValidator';
import { generateDoctorSessionsForDateRange } from '../src/services/schedule/doctorScheduleService';
import { SEED_CLINICAL_ROLES, SEED_RULES } from '../src/services/seed/seedData';
import {
  Assignment,
  ClinicalRole,
  Doctor,
  DoctorSession,
  DutyWindow,
  LeaveEntry,
  LockEntry,
  Nurse,
  Schedule,
  SeniorityLevel,
  Specialty,
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

const DUTY_D: DutyWindow = {
  id: 'duty-full-day',
  name: 'Full Day',
  acronym: 'D',
  startTime: '09:00',
  endTime: '21:00',
  color: '#3b82f6',
  active: true,
  isPriority: true,
  priorityRank: 100,
};

const SENIORITY: SeniorityLevel[] = [
  { id: 'seniority-staff', name: 'Staff Nurse', rank: 3, isSenior: false, color: '#0ea5e9' },
  { id: 'seniority-charge', name: 'Charge Nurse', rank: 1, isSenior: true, color: '#4f46e5' },
];

const SPECIALTY: Specialty = { id: 'spec-card', name: 'Cardiology', code: 'CARD' };

function makeNurse(id: string, fullName: string, seniorityLevelId = 'seniority-staff'): Nurse {
  return {
    id,
    fullName,
    gmail: `${id}@example.com`,
    employeeCode: id.toUpperCase(),
    seniorityLevelId,
    contractPercent: 100,
    dateOfBirth: '1990-01-01',
    capabilityIds: [],
    isClinicNurse: true,
    preferences: [],
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };
}

const DOCTOR: Doctor = {
  id: 'doc-1',
  fullName: 'Dr. Test',
  specialtyIds: [SPECIALTY.id],
  weeklyPattern: [],
  active: true,
};

function makeSchedule(id: string, startDate: string, endDate: string): Schedule {
  return {
    id,
    name: id,
    startDate,
    endDate,
    blockWeeks: 2,
    hoursTargetFullTime: 24,
    status: 'DRAFT',
    activeVersionNumber: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };
}

function makeSessions(dates: string[]): DoctorSession[] {
  return dates.map((date) => ({
    id: `sess-${date}`,
    doctorId: DOCTOR.id,
    date,
    startTime: '09:00',
    endTime: '13:00',
    specialtyId: SPECIALTY.id,
    room: 'Suite 101',
    source: 'MANUAL',
    cancelled: false,
  }));
}

// ------------------------------------------------------------------------------ main

async function main(): Promise<void> {
  const phase1Source = fs.readFileSync(path.resolve('server/routes/crud.ts'), 'utf-8');

  // 1 — Collection plumbing
  await check('workingHoursPeriods is a first-class server collection', () => {
    assert.ok(
      (ALL_COLLECTIONS as string[]).includes('workingHoursPeriods'),
      'jsonStore ALL_COLLECTIONS is missing workingHoursPeriods'
    );
    assert.ok(
      phase1Source.includes("'workingHoursPeriods'"),
      'crud ALLOWED_COLLECTIONS is missing workingHoursPeriods'
    );
    return 'Present in jsonStore ALL_COLLECTIONS and CRUD allow-list.';
  });

  // 2 — Configuration bootstrap
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phase1-verify-'));
  const repo = new JsonFileRepository(tmpDir);

  await check('Configuration bootstrap writes roles, canonical rules and periods', async () => {
    const first = await ensureConfigurationDefaults(repo, { logPrefix: '[verify]' });
    assert.equal(first.clinicalRolesAdded, 2, `expected 2 system roles, got ${first.clinicalRolesAdded}`);
    assert.equal(first.rulesAdded, 9, `expected 9 canonical rules, got ${first.rulesAdded}`);
    assert.equal(first.workingHoursPeriodsAdded, 12, `expected 12 periods, got ${first.workingHoursPeriodsAdded}`);

    const roles = await repo.list('clinicalRoles');
    const rules = await repo.list('rules');
    const periods = await repo.list('workingHoursPeriods');
    assert.ok(roles.some((r) => r.id === 'role-nurse-clinic'), 'Nurse Clinic role missing');
    assert.ok(roles.some((r) => r.id === 'role-float'), 'Float Pool role missing');
    assert.equal(rules.length, 9, `expected 9 rules, got ${rules.length}`);
    assert.equal(periods.length, 12, `expected 12 periods, got ${periods.length}`);
    return `2 roles, 9 rules, 12 periods written.`;
  });

  await check('Server cold-start bootstrap (the exact function app.ts calls) works on a fresh database', async () => {
    const freshDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phase1-server-'));
    const freshRepo = new JsonFileRepository(freshDir);
    const summary = await ensureServerConfigurationDefaults(freshRepo);
    assert.equal(summary.clinicalRolesAdded, 2, `roles: ${summary.clinicalRolesAdded}`);
    assert.equal(summary.rulesAdded, 9, `rules: ${summary.rulesAdded}`);
    assert.equal(summary.workingHoursPeriodsAdded, 12, `periods: ${summary.workingHoursPeriodsAdded}`);

    const rules = await freshRepo.list('rules');
    assert.ok(rules.some((r) => r.templateKey === 'SENIOR_ON_DUTY'), 'H1 rule missing');
    assert.ok(rules.some((r) => r.templateKey === 'MAX_CONSECUTIVE_LATE_DUTIES'), 'S1 rule missing');

    // A wiped database (explicit CLEARED tombstone) must NOT be auto-repopulated.
    await freshRepo.create('systemMetadata', {
      id: 'initialization_state',
      status: 'CLEARED',
      note: 'test tombstone',
    } as any);
    const wipedSummary = await ensureServerConfigurationDefaults(freshRepo);
    assert.equal(wipedSummary.skipped, true, 'CLEARED tombstone was not respected');
    fs.rmSync(freshDir, { recursive: true, force: true });
    return 'Fresh DB → 2 roles, 9 rules, 12 periods; CLEARED DB → bootstrap skipped.';
  });

  await check('Configuration bootstrap is idempotent', async () => {
    const second = await ensureConfigurationDefaults(repo, { logPrefix: '[verify]' });
    assert.equal(second.clinicalRolesAdded, 0, 'roles were re-created');
    assert.equal(second.rulesAdded, 0, 'rules were re-created');
    assert.equal(second.workingHoursPeriodsAdded, 0, 'periods were re-created');
    assert.equal(second.rulesSkippedBecausePopulated, true, 'populated rule set was not respected');

    const rules = await repo.list('rules');
    assert.equal(rules.length, 9, `rule count drifted to ${rules.length}`);
    const templates = rules.map((r) => r.templateKey);
    assert.equal(new Set(templates).size, templates.length, 'duplicate rule templateKeys detected');
    return 'Second run added nothing; no duplicate templateKeys.';
  });

  await check('ensureCanonicalRules never overwrites a user rule set', async () => {
    const res = await ensureCanonicalRules(repo, { onlyWhenEmpty: true });
    assert.equal(res.added, 0, 'onlyWhenEmpty did not guard the existing rule set');
    assert.equal(res.skippedBecausePopulated, true, 'populated flag not reported');
    return 'Existing 9-rule catalogue preserved.';
  });

  await check('System role bootstrap re-adds a deleted Float Pool role only', async () => {
    await repo.remove('clinicalRoles', 'role-float');
    const added = await ensureSystemClinicalRoles(repo);
    assert.equal(added, 1, `expected 1 role re-added, got ${added}`);
    const roles = await repo.list('clinicalRoles');
    assert.ok(roles.some((r) => r.id === 'role-float'), 'Float Pool role not restored');
    assert.equal(roles.filter((r) => r.id === 'role-nurse-clinic').length, 1, 'NC role duplicated');
    return 'Float Pool restored, no duplicates.';
  });

  // 3 — Lock scoping
  const scheduleA = makeSchedule('sched-A', '2026-10-01', '2026-10-31');
  const scheduleB = makeSchedule('sched-B', '2026-10-15', '2026-11-14');

  await check('Tagged locks match by scheduleId only; legacy locks fall back to the date window', () => {
    const locks: LockEntry[] = [
      { id: 'l-a', nurseId: 'n1', date: '2026-10-20', mode: 'OFF', scheduleId: 'sched-A', createdAt: 'x' },
      { id: 'l-legacy-overlap', nurseId: 'n2', date: '2026-10-20', mode: 'OFF', createdAt: 'x' },
      { id: 'l-legacy-b-only', nurseId: 'n3', date: '2026-11-01', mode: 'OFF', createdAt: 'x' },
    ];

    const forA = filterLocksForSchedule(locks, scheduleA).map((l) => l.id);
    const forB = filterLocksForSchedule(locks, scheduleB).map((l) => l.id);
    assert.deepEqual(forA, ['l-a', 'l-legacy-overlap'], `schedule A got ${forA.join(',')}`);
    assert.deepEqual(forB, ['l-legacy-overlap', 'l-legacy-b-only'], `schedule B got ${forB.join(',')}`);

    assert.equal(resolveScheduleIdForLockDate([scheduleA, scheduleB], '2026-10-20'), 'sched-B');
    assert.equal(resolveScheduleIdForLockDate([scheduleA, scheduleB], '2026-11-20'), undefined);
    return 'A: 2 locks (tagged + legacy), B: 2 locks; overlapping date resolves to the newest schedule.';
  });

  // 4 — Engine isolation of foreign OFF locks
  const engineSchedule = makeSchedule('sched-engine', '2026-10-01', '2026-10-03');
  const engineNurses = [makeNurse('nurse-1', 'Alice Adams')];
  const engineSessions = makeSessions(['2026-10-01', '2026-10-02', '2026-10-03']);
  const noLeaves: LeaveEntry[] = [];
  const roles: ClinicalRole[] = SEED_CLINICAL_ROLES;

  const runEngine = (locks: LockEntry[]) =>
    SchedulingEngine.generate(
      engineSchedule,
      'GENERATE_ALL',
      [] as Assignment[],
      engineNurses,
      SENIORITY,
      [DUTY_D],
      roles,
      [SPECIALTY],
      engineSessions,
      locks,
      noLeaves,
      SEED_RULES,
      undefined,
      undefined,
      [DOCTOR]
    );

  await check('A foreign schedule OFF lock no longer suppresses an assignment', async () => {
    const foreignLocks: LockEntry[] = [
      { id: 'l-foreign', nurseId: 'nurse-1', date: '2026-10-02', mode: 'OFF', scheduleId: 'sched-other', createdAt: 'x' },
    ];
    const result = await runEngine(foreignLocks);
    const onBlockedDate = result.assignments.find(
      (a) => a.nurseId === 'nurse-1' && a.date === '2026-10-02'
    );
    assert.ok(onBlockedDate, 'foreign OFF lock still blocked the duty');
    return `Nurse assigned on 2026-10-02 (${result.assignments.length} assignments total).`;
  });

  await check("The schedule's own OFF lock is still honoured", async () => {
    const ownLocks: LockEntry[] = [
      { id: 'l-own', nurseId: 'nurse-1', date: '2026-10-02', mode: 'OFF', scheduleId: 'sched-engine', createdAt: 'x' },
    ];
    const result = await runEngine(ownLocks);
    const onBlockedDate = result.assignments.find(
      (a) => a.nurseId === 'nurse-1' && a.date === '2026-10-02'
    );
    assert.equal(onBlockedDate, undefined, 'own OFF lock was ignored');
    return 'No assignment on the pinned OFF date.';
  });

  await check('Generation stays deterministic with schedule-scoped locks', async () => {
    const ownLocks: LockEntry[] = [
      { id: 'l-own', nurseId: 'nurse-1', date: '2026-10-02', mode: 'OFF', scheduleId: 'sched-engine', createdAt: 'x' },
    ];
    const run1 = await runEngine(ownLocks);
    const run2 = await runEngine(ownLocks);
    const signature = (as: Assignment[]) =>
      as
        .map((a) => `${a.nurseId}_${a.date}_${a.dutyWindowId}_${a.kind}`)
        .sort()
        .join('|');
    assert.equal(signature(run1.assignments), signature(run2.assignments), 'runs diverged');
    return `${run1.assignments.length} assignments, identical across runs.`;
  });

  await check('An ASSIGNMENT lock on the owning schedule is preserved', async () => {
    const locks: LockEntry[] = [
      {
        id: 'l-assign',
        nurseId: 'nurse-1',
        date: '2026-10-01',
        mode: 'ASSIGNMENT',
        dutyWindowId: DUTY_D.id,
        assignmentKind: 'CLINICAL_ROLE',
        targetRefId: 'role-nurse-clinic',
        scheduleId: 'sched-engine',
        createdAt: 'x',
      },
    ];
    const result = await runEngine(locks);
    const locked = result.assignments.find((a) => a.nurseId === 'nurse-1' && a.date === '2026-10-01');
    assert.ok(locked, 'locked assignment missing');
    assert.equal(locked!.source, 'LOCK', 'lock not materialised with source LOCK');
    assert.equal(result.preservedLocksCount >= 1, true, 'preservedLocksCount not reported');
    return 'Locked cell preserved with source=LOCK.';
  });

  // 5 — Float Pool system role
  await check('Float Pool role is on-demand only (quota 0, no daily slots)', async () => {
    const floatRole = SEED_CLINICAL_ROLES.find((r) => r.id === 'role-float');
    assert.ok(floatRole, 'role-float missing from the clinical role catalogue');
    assert.equal(floatRole!.defaultDailyQuota, 0, 'Float Pool quota must be 0');

    const result = await runEngine([]);
    const floatQuotaFindings = result.assignments.filter(
      (a) => a.clinicalRoleId === 'role-float' && a.note?.includes('quota')
    );
    assert.equal(floatQuotaFindings.length, 0, 'Float Pool was expanded into a fixed daily slot');
    return 'Quota 0 — engine never expands it into a daily slot; float pass still labels its assignments FLT.';
  });

  // 6 — Validator findings
  await check('Validator reports OFF-lock breaches and missing session specialties', () => {
    const schedule = makeSchedule('sched-val', '2026-10-01', '2026-10-01');
    const assignments: Assignment[] = [
      {
        id: 'asgn-1',
        scheduleId: schedule.id,
        nurseId: 'nurse-1',
        date: '2026-10-01',
        dutyWindowId: DUTY_D.id,
        kind: 'DOCTOR',
        doctorId: DOCTOR.id,
        locked: false,
        source: 'GENERATED',
      },
    ];
    const locks: LockEntry[] = [
      { id: 'l-off', nurseId: 'nurse-1', date: '2026-10-01', mode: 'OFF', scheduleId: schedule.id, createdAt: 'x' },
    ];
    const sessions: DoctorSession[] = [
      { ...makeSessions(['2026-10-01'])[0], specialtyId: '' },
    ];

    const report = ScheduleValidator.validate(
      schedule,
      assignments,
      engineNurses,
      SENIORITY,
      [DUTY_D],
      sessions,
      noLeaves,
      locks,
      roles,
      SEED_RULES,
      [],
      [SPECIALTY],
      [DOCTOR]
    );

    const ids = report.findings.map((f) => f.id);
    assert.ok(
      ids.some((id) => id.startsWith('lock-off-conflict-nurse-1')),
      `missing OFF-lock finding (got: ${ids.join(', ')})`
    );
    assert.ok(
      ids.some((id) => id.startsWith('session-missing-specialty-')),
      `missing specialty DATA_ISSUE (got: ${ids.join(', ')})`
    );
    assert.ok(
      !ids.some((id) => id.includes('FLT') || id.includes('role-float')),
      'quota-0 Float Pool role wrongly reported as an unmet daily quota'
    );
    return 'OFF-lock breach and missing specialty reported; no false Float Pool quota warning.';
  });

  // 7 — Doctor session specialty
  await check("Recurring expansion no longer emits the orphan 'spec-gp' specialty", () => {
    const doctorNoSpecialty: Doctor = { ...DOCTOR, id: 'doc-2', specialtyIds: [] };
    const generated = generateDoctorSessionsForDateRange(
      '2026-10-01',
      '2026-10-07',
      [{ ...doctorNoSpecialty, weeklyPattern: [{ weekday: 4, startTime: '09:00', endTime: '13:00' }] }]
    );
    assert.ok(generated.length > 0, 'no sessions generated for the weekly pattern');
    assert.ok(
      generated.every((s) => s.specialtyId === ''),
      'a fallback specialty id was emitted'
    );
    assert.ok(
      generated.every((s) => s.specialtyId !== 'spec-gp'),
      "'spec-gp' orphan still present"
    );
    return `${generated.length} sessions with an empty specialtyId (surfaced by the validator instead).`;
  });

  // ---------------------------------------------------------------- report
  const passed = results.filter((r) => r.passed).length;
  console.log('\n=== Phase 1 verification ===');
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.name}\n      ${r.detail}`);
  }
  console.log(`\n${passed}/${results.length} checks passed.`);

  fs.rmSync(tmpDir, { recursive: true, force: true });

  if (passed !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Phase1Verify] Fatal:', err);
  process.exit(1);
});
