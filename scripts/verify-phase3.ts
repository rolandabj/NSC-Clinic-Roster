/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3 verification harness (no test runner dependency — run with tsx).
 *
 * Proves, against real code paths:
 *   E4  H1 senior fixer gaps:
 *     - never brings a senior in on a day they hold an OFF lock;
 *     - displaces a GENERATED assignment even when a locked assignment sits first on the window;
 *     - runs after the +1 / float passes, so windows those passes populate are repaired too;
 *     - never drops a required credential (Phlebotomy/IV) while fixing seniority.
 *   E9  split doctor sessions:
 *     - each session slot resolves its OWN specialty (a doctor's day can be split across
 *       departments), instead of the doctor's first session of the day;
 *     - coverage is time-based: a duty window only covers a session it actually spans, so a
 *       morning shift no longer hides an uncovered evening session;
 *     - the engine does not staff a doctor's second session when the first assignment already
 *       spans it, and the validator agrees with the engine session-by-session.
 *   Q3  duty-selection rules:
 *     - an all-inactive duty configuration never gets used;
 *     - a session-spanning duty wins over a later duty that only pays an overhang bonus.
 *
 * Usage: npx tsx scripts/verify-phase3.ts   (or: npm run verify:phase3)
 */

import assert from 'node:assert/strict';
import { SchedulingEngine } from '../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../src/services/validation/ScheduleValidator';
import {
  Assignment,
  ClinicalRole,
  DoctorSession,
  DutyWindow,
  LeaveEntry,
  LockEntry,
  Nurse,
  NursePreference,
  Rule,
  Schedule,
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

// --------------------------------------------------------------------------- fixtures

const DAY = '2026-11-01';

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0];
}

const SENIORITY: SeniorityLevel[] = [
  { id: 'seniority-senior', name: 'Charge Nurse', rank: 1, isSenior: true, color: '#4f46e5' },
  { id: 'seniority-staff', name: 'Staff Nurse', rank: 3, isSenior: false, color: '#0ea5e9' },
];

const DUTY_D: DutyWindow = {
  id: 'duty-d', name: 'Full Day', acronym: 'D', startTime: '09:00', endTime: '17:00',
  color: '#3b82f6', active: true, isPriority: true, priorityRank: 100,
};
const DUTY_E: DutyWindow = {
  id: 'duty-e', name: 'Early', acronym: 'E', startTime: '09:00', endTime: '13:00',
  color: '#22c55e', active: true, isPriority: false, priorityRank: 50,
};
const DUTY_L: DutyWindow = {
  id: 'duty-l', name: 'Late', acronym: 'L', startTime: '16:00', endTime: '20:00',
  color: '#f59e0b', active: true, isPriority: false, priorityRank: 50,
};

const ROLE_IV: ClinicalRole = {
  id: 'role-iv', name: 'Blood Collection & IV', acronym: 'PHL',
  description: 'Phlebotomy', defaultDailyQuota: 2, defaultStartTime: '09:00', defaultEndTime: '17:00',
};

const SPEC_PCC: Specialty = { id: 'spec-pcc', name: 'Primary Care', code: 'PCC' };
const SPEC_PED: Specialty = { id: 'spec-ped', name: 'Pediatrics', code: 'PED' };

function makeNurse(
  id: string,
  fullName: string,
  seniorityLevelId: string = 'seniority-staff',
  extra: Partial<Nurse> = {}
): Nurse {
  return {
    id, fullName,
    gmail: `${id}@example.com`, employeeCode: id.toUpperCase(),
    seniorityLevelId, contractPercent: 100, dateOfBirth: '1990-01-01',
    capabilityIds: [], isClinicNurse: true, preferences: [], active: true,
    createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
    ...extra,
  };
}

const pref = (kind: 'DOCTOR' | 'SPECIALTY' | 'CLINICAL_ROLE', refId: string, rank = 1): NursePreference =>
  ({ kind, refId, rank }) as NursePreference;

const noNurseClinicRule: Rule = {
  id: 'rule-nc', name: 'No dedicated nurse clinic', templateKey: 'DEDICATED_NURSE_CLINIC',
  scope: 'PER_DAY', metric: 'DUTIES_WITH_END_TIME_X_COUNT', operator: 'MIN', value: 1,
  severity: 'HARD', enabled: false,
};

function makeSchedule(startDate: string, endDate: string): Schedule {
  return {
    id: 'sch-phase3', name: 'Phase 3 schedule', startDate, endDate, blockWeeks: 1,
    hoursTargetFullTime: 160, status: 'DRAFT', activeVersionNumber: 1,
    createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
  };
}

function periodFor(schedule: Schedule, hours: number): WorkingHoursPeriod {
  return {
    id: `period-${schedule.startDate}`, year: '2026', name: 'Verify',
    startDate: schedule.startDate, endDate: schedule.endDate, workingHours: hours,
    createdAt: '2026-01-01T00:00:00Z',
  };
}

function makeSession(
  id: string, doctorId: string, date: string, startTime: string, endTime: string, specialtyId: string
): DoctorSession {
  return {
    id, doctorId, date, startTime, endTime, specialtyId, room: 'Suite 1',
    source: 'MANUAL', cancelled: false,
  };
}

function historyStreak(nurseId: string, startDate: string, days: number): Assignment[] {
  return Array.from({ length: days }, (_, i) => ({
    id: `hist-${nurseId}-${i}`,
    scheduleId: 'sch-previous',
    nurseId,
    date: addDays(startDate, -(days - i)),
    dutyWindowId: DUTY_D.id,
    kind: 'CLINICAL_ROLE' as const,
    clinicalRoleId: 'role-iv',
    locked: false,
    source: 'GENERATED' as const,
  }));
}

interface RunOptions {
  schedule: Schedule;
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  sessions?: DoctorSession[];
  doctors?: any[];
  roles?: ClinicalRole[];
  specialties?: Specialty[];
  locks?: LockEntry[];
  leaveEntries?: LeaveEntry[];
  rules?: Rule[];
  history?: Assignment[];
  hours?: number;
}

async function runEngine(opts: RunOptions): Promise<Assignment[]> {
  const result = await SchedulingEngine.generate(
    opts.schedule,
    'GENERATE_ALL',
    [],
    opts.nurses,
    SENIORITY,
    opts.dutyWindows,
    opts.roles ?? [],
    opts.specialties ?? [],
    opts.sessions ?? [],
    opts.locks ?? [],
    opts.leaveEntries ?? [],
    opts.rules ?? [],
    undefined,
    [periodFor(opts.schedule, opts.hours ?? 40)],
    opts.doctors ?? [],
    [], // leaveTypes
    opts.history ?? []
  );
  return result.assignments;
}

function validate(
  schedule: Schedule,
  assignments: Assignment[],
  nurses: Nurse[],
  dutyWindows: DutyWindow[],
  sessions: DoctorSession[],
  opts: { hours?: number; roles?: ClinicalRole[]; specialties?: Specialty[]; rules?: Rule[] } = {}
): ReturnType<typeof ScheduleValidator.validate> {
  return ScheduleValidator.validate(
    schedule, assignments, nurses, SENIORITY, dutyWindows, sessions,
    [], [], opts.roles ?? [], opts.rules ?? [],
    [periodFor(schedule, opts.hours ?? 40)], opts.specialties ?? [], [], []
  );
}

const dutyById = (duties: DutyWindow[], id: string) => duties.find((d) => d.id === id)!;

/** A doctor session is covered when some assignment's duty spans the session's hours. */
const coveringAssignment = (
  assignments: Assignment[],
  duties: DutyWindow[],
  sess: DoctorSession
): Assignment | undefined =>
  assignments.find((a) => {
    if (a.date !== sess.date || a.kind !== 'DOCTOR' || a.doctorId !== sess.doctorId) return false;
    const duty = duties.find((d) => d.id === a.dutyWindowId);
    return Boolean(duty && duty.startTime <= sess.startTime && duty.endTime >= sess.endTime);
  });

// ------------------------------------------------------------------------------ main

async function main(): Promise<void> {
  // ------------------------------------------------------------------ E4: H1 fixer gaps

  await check('E4a: the H1 fixer never uses a senior who holds an OFF lock that day', async () => {
    const schedule = makeSchedule(DAY, addDays(DAY, 2)); // 3 days, 24h period
    const senior = makeNurse('n-senior', 'A Senior', 'seniority-senior');
    const junior = makeNurse('n-junior', 'B Junior');
    const locks: LockEntry[] = [DAY, addDays(DAY, 1), addDays(DAY, 2)].map((date, i) => ({
      id: `lock-off-${i}`, nurseId: senior.id, date, mode: 'OFF' as const,
      scheduleId: schedule.id, note: 'Locked off', createdAt: '2026-01-01T00:00:00Z',
    }));

    const assignments = await runEngine({
      schedule, nurses: [senior, junior], dutyWindows: [DUTY_D],
      locks, hours: 24,
    });

    assert.ok(
      !assignments.some((a) => a.nurseId === senior.id),
      'the OFF-locked senior was assigned by the H1 fixer'
    );
    const juniorDays = assignments.filter((a) => a.nurseId === junior.id).length;
    assert.equal(juniorDays, 3, `junior should staff the NC window on all 3 days, got ${juniorDays}`);

    const report = validate(schedule, assignments, [senior, junior], [DUTY_D], [], { hours: 24 });
    const h1 = report.findings.filter((f) => f.id.startsWith('h1-senior-'));
    assert.ok(h1.length > 0, 'the unfixable H1 gap was not surfaced by the validator');
    return `No swap for the locked senior; junior staffs all 3 days and the validator reports ${h1.length} H1 finding(s) for the manager to resolve.`;
  });

  await check('E4b: the H1 fixer displaces a generated junior even when a lock sits first on the window', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const lockedJunior = makeNurse('n-j1', 'A LockedJunior');
    const generatedJunior = makeNurse('n-j2', 'B GenJunior', 'seniority-staff', {
      preferences: [pref('CLINICAL_ROLE', ROLE_IV.id, 1)], // wins the second PHL slot
    });
    const senior = makeNurse('n-senior', 'C Senior', 'seniority-senior');

    const locks: LockEntry[] = [{
      id: 'lock-assign', nurseId: lockedJunior.id, date: DAY, mode: 'ASSIGNMENT',
      dutyWindowId: DUTY_D.id, assignmentKind: 'CLINICAL_ROLE', targetRefId: ROLE_IV.id,
      scheduleId: schedule.id, note: 'Pinned', createdAt: '2026-01-01T00:00:00Z',
    }];

    const assignments = await runEngine({
      schedule,
      nurses: [lockedJunior, generatedJunior, senior],
      dutyWindows: [DUTY_D],
      roles: [ROLE_IV],
      locks,
      // Keep the senior out of the float pass (already at target) so the fixer is the only
      // pass that can reach H1 on this window.
      history: historyStreak(senior.id, DAY, 5),
      hours: 40,
    });

    const locked = assignments.find((a) => a.nurseId === lockedJunior.id);
    assert.ok(locked && locked.source === 'LOCK', 'the locked assignment was not preserved');
    const windowAssignments = assignments.filter((a) => a.dutyWindowId === DUTY_D.id);
    assert.ok(
      windowAssignments.some((a) => a.nurseId === senior.id),
      `H1 fixer did not displace the generated junior (window: ${windowAssignments.map((a) => a.nurseId).join(', ')})`
    );
    assert.ok(
      !windowAssignments.some((a) => a.nurseId === generatedJunior.id),
      'the generated junior was not displaced'
    );
    return 'Locked cell untouched; the generated junior was swapped for the free senior.';
  });

  await check('E4c: the H1 fixer runs after the float pass (windows it populates are repaired)', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const junior = makeNurse('n-junior', 'A Junior');
    const senior = makeNurse('n-senior', 'B Senior', 'seniority-senior');
    // Disable the Nurse Clinic slot so the slot pass creates nothing and the day is shaped by
    // the float pass alone — exactly the case the old, pre-float fixer could never see.
    const assignments = await runEngine({
      schedule, nurses: [junior, senior], dutyWindows: [DUTY_D, DUTY_E],
      rules: [noNurseClinicRule],
      history: historyStreak(senior.id, DAY, 5), // float skips the senior; the fixer may still use them
      hours: 40,
    });

    assert.equal(assignments.length, 1, `expected a single float assignment, got ${assignments.length}`);
    assert.equal(
      assignments[0].nurseId,
      senior.id,
      `float window left junior-only (${assignments[0].nurseId}) — the fixer did not run after the float pass`
    );
    return 'Float pass staffed the window with a junior; the end-of-day fixer swapped in the free senior.';
  });

  await check('E4d: the H1 fixer refuses to displace a PHL assignment for an uncredentialled senior', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const capableJunior = makeNurse('n-cap', 'A Capable', 'seniority-staff', {
      capabilityIds: [ROLE_IV.id],
      preferences: [pref('CLINICAL_ROLE', ROLE_IV.id, 1)],
    });
    const seniorWithoutCredential = makeNurse('n-senior', 'B Senior', 'seniority-senior');

    const assignments = await runEngine({
      schedule,
      nurses: [capableJunior, seniorWithoutCredential],
      dutyWindows: [DUTY_D],
      roles: [ROLE_IV],
      rules: [noNurseClinicRule],
      // At target, so the float pass leaves the senior free for the fixer to try.
      history: historyStreak(seniorWithoutCredential.id, DAY, 5),
      hours: 40,
    });

    const phl = assignments.filter((a) => a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId === ROLE_IV.id);
    assert.ok(phl.length > 0, 'no PHL assignment was produced at all');
    assert.ok(
      phl.every((a) => a.nurseId === capableJunior.id),
      `a nurse without the PHL credential was put on the PHL slot (${phl.map((a) => a.nurseId).join(', ')})`
    );
    assert.ok(
      !assignments.some((a) => a.nurseId === seniorWithoutCredential.id),
      'the uncredentialled senior was assigned by the fixer'
    );

    const report = validate(schedule, assignments, [capableJunior, seniorWithoutCredential], [DUTY_D], [], {
      hours: 40, roles: [ROLE_IV], rules: [noNurseClinicRule],
    });
    assert.equal(
      report.findings.filter((f) => f.id.startsWith('h1-senior-')).length,
      1,
      'the credential-blocked H1 gap should be surfaced by the validator'
    );
    return 'The uncredentialled senior was not swapped in; the PHL window keeps its capable junior and the validator flags the H1 gap.';
  });

  await check('E4e: an empty duty window is reported only when it overlaps a clinic session', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const morningOnly = [makeSession('sess-m', 'doc-1', DAY, '09:00', '13:00', SPEC_PCC.id)];
    const morningAndEvening = [
      ...morningOnly,
      makeSession('sess-e', 'doc-1', DAY, '16:00', '20:00', SPEC_PCC.id),
    ];
    const nurse = makeNurse('n-a', 'A Senior', 'seniority-senior');
    const assignments: Assignment[] = [{
      id: 'asgn-morning', scheduleId: schedule.id, nurseId: nurse.id, date: DAY,
      dutyWindowId: DUTY_E.id, kind: 'DOCTOR', doctorId: 'doc-1', locked: false, source: 'MANUAL',
    }];

    // DUTY_L (16:00–20:00) is empty, but the day has no evening clinic → it is simply unused.
    const quietDay = validate(schedule, assignments, [nurse], [DUTY_E, DUTY_L], morningOnly, {
      specialties: [SPEC_PCC],
    });
    assert.equal(
      quietDay.findings.filter((f) => f.id.startsWith('h1-empty-duty-')).length,
      0,
      'an unused shift shape outside clinic hours was reported as an H1 gap'
    );

    // Add an evening clinic → the empty DUTY_L now overlaps clinic hours and must be reported.
    const clinicDay = validate(schedule, assignments, [nurse], [DUTY_E, DUTY_L], morningAndEvening, {
      specialties: [SPEC_PCC],
    });
    assert.deepEqual(
      clinicDay.findings.filter((f) => f.id.startsWith('h1-empty-duty-')).map((f) => f.id),
      [`h1-empty-duty-${DAY}-${DUTY_L.id}`],
      'an empty duty window overlapping an evening clinic session was not reported'
    );
    // The staffed window keeps its senior, so no seniority finding is produced for it.
    assert.equal(
      clinicDay.findings.filter((f) => f.id.startsWith('h1-senior-')).length,
      0,
      'a false seniority finding was produced for the staffed window'
    );
    return 'Empty evening shift is silent without an evening clinic and reported once an evening clinic exists.';
  });

  // ------------------------------------------------------------- E9: split doctor sessions

  await check('E9a: each session slot resolves its own specialty (split session across departments)', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const doctor = { id: 'doc-1', fullName: 'Dr. Split', specialtyIds: ['spec-pcc', 'spec-ped'], weeklyPattern: [], active: true };
    const sessions = [
      makeSession('sess-pcc', doctor.id, DAY, '09:00', '13:00', SPEC_PCC.id),
      makeSession('sess-ped', doctor.id, DAY, '16:00', '20:00', SPEC_PED.id),
    ];
    const pccNurse = makeNurse('n-pcc', 'A PccNurse', 'seniority-staff', {
      preferences: [pref('SPECIALTY', SPEC_PCC.id, 1)],
    });
    const pedNurse = makeNurse('n-ped', 'B PedNurse', 'seniority-staff', {
      preferences: [pref('SPECIALTY', SPEC_PED.id, 1)],
    });

    const assignments = await runEngine({
      schedule, nurses: [pccNurse, pedNurse], dutyWindows: [DUTY_E, DUTY_L],
      sessions, doctors: [doctor], specialties: [SPEC_PCC, SPEC_PED],
    });

    const morning = coveringAssignment(assignments, [DUTY_E, DUTY_L], sessions[0]);
    const evening = coveringAssignment(assignments, [DUTY_E, DUTY_L], sessions[1]);
    assert.ok(morning, 'morning (PCC) session not covered');
    assert.ok(evening, 'evening (PED) session not covered');
    assert.equal(morning!.nurseId, pccNurse.id, 'the morning (PCC) session was not staffed by the PCC-allocated nurse');
    assert.equal(evening!.nurseId, pedNurse.id, 'the evening (PED) session was not staffed by the PED-allocated nurse');
    assert.equal(morning!.dutyWindowId, DUTY_E.id, 'morning session landed on a duty window that does not span it');
    assert.equal(evening!.dutyWindowId, DUTY_L.id, 'evening session landed on a duty window that does not span it');

    const report = validate(schedule, assignments, [pccNurse, pedNurse], [DUTY_E, DUTY_L], sessions, {
      specialties: [SPEC_PCC, SPEC_PED],
    });
    assert.equal(
      report.findings.filter((f) => f.id.startsWith('unassigned-session-')).length,
      0,
      'validator still reports an uncovered split session'
    );
    return 'PCC nurse on the morning early duty, PED nurse on the evening late duty — both sessions covered, no findings.';
  });

  await check('E9b: the engine does not staff a second session already spanned by the first duty', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const doctor = { id: 'doc-1', fullName: 'Dr. One', specialtyIds: [SPEC_PCC.id], weeklyPattern: [], active: true };
    const sessions = [
      makeSession('sess-1', doctor.id, DAY, '09:00', '13:00', SPEC_PCC.id),
      makeSession('sess-2', doctor.id, DAY, '13:00', '17:00', SPEC_PCC.id),
    ];
    const nurseA = makeNurse('n-a', 'A Nurse', 'seniority-staff', { preferences: [pref('DOCTOR', doctor.id, 1)] });
    const nurseB = makeNurse('n-b', 'B Nurse', 'seniority-staff', { preferences: [pref('DOCTOR', doctor.id, 2)] });

    const assignments = await runEngine({
      schedule, nurses: [nurseA, nurseB], dutyWindows: [DUTY_D], sessions,
      doctors: [doctor], specialties: [SPEC_PCC],
    });

    const doctorAssignments = assignments.filter((a) => a.kind === 'DOCTOR' && a.doctorId === doctor.id);
    assert.equal(
      doctorAssignments.length,
      1,
      `expected one assignment covering both sessions, got ${doctorAssignments.length}`
    );
    assert.equal(doctorAssignments[0].dutyWindowId, DUTY_D.id);
    assert.equal(doctorAssignments[0].nurseId, nurseA.id);
    assert.ok(coveringAssignment(assignments, [DUTY_D], sessions[0]), 'session 1 not covered');
    assert.ok(coveringAssignment(assignments, [DUTY_D], sessions[1]), 'session 2 not covered');
    return 'One full-day assignment covers both sessions; the second nurse was not double-booked.';
  });

  await check('E9c: the validator flags a split session no duty window spans', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const sessions = [
      makeSession('sess-m', 'doc-1', DAY, '09:00', '13:00', SPEC_PCC.id),
      makeSession('sess-e', 'doc-1', DAY, '13:00', '17:00', SPEC_PCC.id),
    ];
    const nurse = makeNurse('n-a', 'A Nurse');
    // Morning only: the early duty ends at 13:00, so the afternoon session is NOT covered.
    const morningOnly: Assignment[] = [{
      id: 'asgn-morning', scheduleId: schedule.id, nurseId: nurse.id, date: DAY,
      dutyWindowId: DUTY_E.id, kind: 'DOCTOR', doctorId: 'doc-1', locked: false, source: 'MANUAL',
    }];

    const report = validate(schedule, morningOnly, [nurse], [DUTY_E, DUTY_D], sessions, { specialties: [SPEC_PCC] });
    const uncovered = report.findings.filter((f) => f.id.startsWith('unassigned-session-'));
    assert.deepEqual(
      uncovered.map((f) => f.id),
      ['unassigned-session-sess-e'],
      `expected only the afternoon session to be flagged, got ${uncovered.map((f) => f.id).join(', ') || 'none'}`
    );

    // Same doctor, same sessions, but a full-day duty spans both → no findings.
    const fullDay: Assignment[] = [{ ...morningOnly[0], id: 'asgn-full', dutyWindowId: DUTY_D.id }];
    const coveredReport = validate(schedule, fullDay, [nurse], [DUTY_D], sessions, { specialties: [SPEC_PCC] });
    assert.equal(
      coveredReport.findings.filter((f) => f.id.startsWith('unassigned-session-')).length,
      0,
      'a full-day duty spanning both sessions was still reported as uncovered'
    );
    return 'Morning-only duty flags the afternoon session; a full-day duty covering both is accepted.';
  });

  await check('E9d: engine and validator agree session-by-session across a mixed week', async () => {
    const start = DAY;
    const end = addDays(DAY, 4); // 5 days, 40h period
    const schedule = makeSchedule(start, end);
    const sessions: DoctorSession[] = [];
    const doctors = [
      { id: 'doc-1', fullName: 'Dr. One', specialtyIds: ['spec-pcc'], weeklyPattern: [], active: true },
      { id: 'doc-2', fullName: 'Dr. Two', specialtyIds: ['spec-ped'], weeklyPattern: [], active: true },
    ];
    for (let i = 0; i < 5; i++) {
      const date = addDays(start, i);
      sessions.push(makeSession(`s1-${i}`, 'doc-1', date, '09:00', '13:00', SPEC_PCC.id));
      // doc-1 has a split evening clinic on two of the days
      if (i % 2 === 0) sessions.push(makeSession(`s2-${i}`, 'doc-1', date, '16:00', '20:00', SPEC_PCC.id));
      sessions.push(makeSession(`s3-${i}`, 'doc-2', date, '09:00', '13:00', SPEC_PED.id));
    }
    const pccNurses = [
      makeNurse('n-1', 'A Pcc', 'seniority-staff', { preferences: [pref('SPECIALTY', SPEC_PCC.id, 1)] }),
      makeNurse('n-2', 'B Pcc', 'seniority-staff', { preferences: [pref('SPECIALTY', SPEC_PCC.id, 2)] }),
    ];
    const pedNurses = [
      makeNurse('n-3', 'C Ped', 'seniority-senior', { preferences: [pref('SPECIALTY', SPEC_PED.id, 1)] }),
      makeNurse('n-4', 'D Ped', 'seniority-staff', { preferences: [pref('SPECIALTY', SPEC_PED.id, 2)] }),
    ];
    const nurses = [...pccNurses, ...pedNurses];
    const dutyWindows = [DUTY_D, DUTY_E, DUTY_L];

    const assignments = await runEngine({
      schedule, nurses, dutyWindows, sessions, doctors, specialties: [SPEC_PCC, SPEC_PED],
    });
    const report = validate(schedule, assignments, nurses, dutyWindows, sessions, {
      specialties: [SPEC_PCC, SPEC_PED],
    });

    // Invariant A: every session is either covered by a duty window that spans it, or flagged.
    const flaggedIds = new Set(
      report.findings.filter((f) => f.id.startsWith('unassigned-session-')).map((f) => f.id)
    );
    for (const sess of sessions) {
      const covered = Boolean(coveringAssignment(assignments, dutyWindows, sess));
      const flagged = flaggedIds.has(`unassigned-session-${sess.id}`);
      assert.equal(
        covered,
        !flagged,
        `${sess.id} on ${sess.date}: covered=${covered} but validator flagged=${flagged}`
      );
    }

    // Invariant B: every staffed duty window is either senior-covered or reported by the validator.
    const h1Flagged = new Set(
      report.findings.filter((f) => f.id.startsWith('h1-senior-')).map((f) => f.id)
    );
    const windowsByDate = new Map<string, Set<string>>();
    assignments.forEach((a) => {
      if (!windowsByDate.has(a.date)) windowsByDate.set(a.date, new Set());
      windowsByDate.get(a.date)!.add(a.dutyWindowId);
    });
    let staffedWindows = 0;
    windowsByDate.forEach((windowIds, date) => {
      windowIds.forEach((dutyId) => {
        const onWindow = assignments.filter((a) => a.date === date && a.dutyWindowId === dutyId);
        if (onWindow.length === 0) return;
        staffedWindows += 1;
        const hasSenior = onWindow.some((a) => {
          const n = nurses.find((x) => x.id === a.nurseId);
          return n && SENIORITY.find((s) => s.id === n.seniorityLevelId)?.isSenior === true;
        });
        const flagged = h1Flagged.has(`h1-senior-${date}-${dutyId}`);
        assert.equal(
          hasSenior,
          !flagged,
          `${date} ${dutyId}: senior=${hasSenior} but validator flagged=${flagged}`
        );
      });
    });

    return `${sessions.length} sessions and ${staffedWindows} staffed duty windows agree between engine and validator.`;
  });

  // ---------------------------------------------------------------- Q3: duty selection

  await check('Q3a: an all-inactive duty configuration is never staffed', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const nurse = makeNurse('n-a', 'A Nurse');
    const inactive: DutyWindow[] = [
      { ...DUTY_D, active: false },
      { ...DUTY_E, active: false },
    ];

    const assignments = await runEngine({ schedule, nurses: [nurse], dutyWindows: inactive, hours: 40 });
    assert.equal(
      assignments.length,
      0,
      `engine staffed an inactive duty window (${assignments.map((a) => a.dutyWindowId).join(', ')})`
    );
    return 'No assignment is produced when every duty window is switched off.';
  });

  await check('Q3b: a duty spanning the slot beats a later duty paying only the overhang bonus', async () => {
    const schedule = makeSchedule(DAY, DAY);
    const doctor = { id: 'doc-1', fullName: 'Dr. One', specialtyIds: [SPEC_PCC.id], weeklyPattern: [], active: true };
    const sessions = [makeSession('sess-m', doctor.id, DAY, '09:00', '13:00', SPEC_PCC.id)];
    const nurse = makeNurse('n-a', 'A Nurse', 'seniority-staff', { preferences: [pref('DOCTOR', doctor.id, 1)] });

    // DUTY_E spans the morning session exactly; DUTY_L starts in the afternoon and pays the
    // +45 overhang bonus path. The coverage term must keep the morning session on DUTY_E.
    const assignments = await runEngine({
      schedule, nurses: [nurse], dutyWindows: [DUTY_E, DUTY_L], sessions,
      doctors: [doctor], specialties: [SPEC_PCC],
    });
    const morning = assignments.find((a) => a.kind === 'DOCTOR' && a.doctorId === doctor.id);
    assert.ok(morning, 'the morning session was not staffed at all');
    assert.equal(
      morning!.dutyWindowId,
      DUTY_E.id,
      `session landed on ${morning!.dutyWindowId} (a duty window that does not span it)`
    );
    return 'Morning session placed on the duty window that spans it, not the later overhang duty.';
  });

  // ---------------------------------------------------------------- report

  const passed = results.filter((r) => r.passed).length;
  console.log('\n=== Phase 3 verification ===');
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.name}\n      ${r.detail}`);
  }
  console.log(`\n${passed}/${results.length} checks passed.`);

  if (passed !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Phase3Verify] Fatal:', err);
  process.exit(1);
});
