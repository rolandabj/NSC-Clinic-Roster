import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ANALYSIS_FORMAT,
  analysisFileName,
  buildRosterAnalysis,
  problemRule,
  RosterAnalysisInput,
} from '../../src/services/export/analysisExportService';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeLock, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, AvailabilityRequest, Doctor, DoctorSession, DutyWindow, Specialty } from '../../src/types';

const LATE: DutyWindow = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00' };
const CARD = { id: 'sp-card', name: 'Cardiology', code: 'CARD' } as Specialty;
const KHAN = { id: 'doc-khan', fullName: 'Dr Khan', specialtyIds: [CARD.id], weeklyPattern: [], active: true } as Doctor;
const SCHEDULE = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-07', hoursTargetFullTime: 24 });

const SESSIONS = [
  { id: 's1', doctorId: KHAN.id, date: '2026-10-05', startTime: '09:00', endTime: '17:00', specialtyId: CARD.id, source: 'PATTERN', cancelled: false },
  { id: 's2', doctorId: KHAN.id, date: '2026-10-06', startTime: '09:00', endTime: '19:00', specialtyId: CARD.id, source: 'PATTERN', cancelled: false },
  { id: 's3', doctorId: KHAN.id, date: '2026-10-07', startTime: '09:00', endTime: '17:00', specialtyId: CARD.id, source: 'PATTERN', cancelled: false },
] as DoctorSession[];

const shift = (id: string, nurseId: string, date: string, overrides: Partial<Assignment> = {}): Assignment => ({
  id,
  scheduleId: SCHEDULE.id,
  nurseId,
  date,
  dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR',
  doctorId: KHAN.id,
  locked: false,
  source: 'GENERATED',
  ...overrides,
});

function input(overrides: Partial<RosterAnalysisInput> = {}): RosterAnalysisInput {
  const amy = makeNurse('amy', {
    fullName: 'Amy',
    preferences: [{ kind: 'SPECIALTY', refId: CARD.id, rank: 1 }],
    notes: 'private note',
  });
  const ben = makeNurse('ben', { fullName: 'Ben', contractPercent: 50 });
  const requests: AvailabilityRequest[] = [
    { id: 'r1', nurseId: 'ben', date: '2026-10-06', available: false, status: 'APPROVED', submittedByNurseId: 'ben', submittedAt: '' },
    { id: 'r2', nurseId: 'amy', date: '2026-10-07', available: false, status: 'PENDING', submittedByNurseId: 'amy', submittedAt: '' },
  ];
  return {
    clinicName: 'NSC Clinic',
    schedule: SCHEDULE,
    assignments: [
      shift('a1', 'amy', '2026-10-05'),
      shift('a2', 'ben', '2026-10-06'),
      shift('a3', 'amy', '2026-10-07'),
      // another roster's shift is ignored
      shift('x1', 'amy', '2026-10-06', { scheduleId: 'other' }),
    ],
    nurses: [amy, ben],
    dutyWindows: [DAY_DUTY, LATE],
    leaveEntries: [makeLeave({ id: 'lv1', nurseId: 'ben', startDate: '2026-10-07', endDate: '2026-10-07' })],
    leaveTypes: [ANNUAL_LEAVE],
    seniorityLevels: [SENIOR],
    doctors: [KHAN],
    sessions: SESSIONS,
    roles: [],
    specialties: [CARD],
    rules: hoursOnlyRules(),
    locks: [makeLock('amy', '2026-10-05')],
    availabilityRequests: requests,
    clinicSetup: { holidayDates: [] },
    exportedAt: '2026-10-03T00:00:00.000Z',
    ...overrides,
  };
}

test('the file says what it is and leaves out private profile fields', () => {
  const a = buildRosterAnalysis(input());
  assert.equal(a.format, ANALYSIS_FORMAT);
  assert.equal(a.roster.id, SCHEDULE.id);
  const text = JSON.stringify(a);
  assert.ok(!text.includes('@example.com'), 'no email addresses');
  assert.ok(!text.includes('1990-01-01'), 'no dates of birth');
  assert.ok(!text.includes('private note'), 'no profile notes');
  assert.equal(a.nurses.find((n) => n.id === 'amy')?.hasEmail, true);
});

test('shifts carry names, hours and the nurse\'s rank for the doctor; other rosters are left out', () => {
  const a = buildRosterAnalysis(input());
  assert.equal(a.shifts.length, 3);
  const first = a.shifts[0];
  assert.equal(first.nurse, 'Amy');
  assert.equal(first.doctor, 'Dr Khan');
  assert.equal(first.shift, 'D');
  assert.equal(first.hours, 8);
  assert.equal(first.preferenceRank, 1);
  assert.equal(first.preferenceMatchedBy, 'SPECIALTY');
  const benShift = a.shifts.find((s) => s.nurseId === 'ben');
  assert.equal(benShift?.preferenceRank, null);
});

test('nurse hours: goal from the contract, shifts and leave counted once', () => {
  const a = buildRosterAnalysis(input());
  const amy = a.nurses.find((n) => n.id === 'amy')!;
  const ben = a.nurses.find((n) => n.id === 'ben')!;
  assert.deepEqual(amy.hours, { target: 24, shifts: 16, leave: 0, total: 16, difference: -8, percentOfTarget: 67,
    baseTarget: 24, carriedHoursOwed: 0, previousCreditedHours: 0, cumulativeTarget: 24, trackingStartDate: SCHEDULE.startDate,
    heldBackToNextPeriod: 0, writtenOff: 0,
    periodParts: [{ period: SCHEDULE.name, start: SCHEDULE.startDate, end: SCHEDULE.endDate, base: 24, carried: 0, target: 24, worked: 16 }] });
  assert.equal(ben.hours.target, 12);
  assert.equal(ben.hours.shifts, 8);
  assert.equal(ben.hours.leave, 8);
  assert.equal(amy.counts.withFirstChoice, 2);
  assert.equal(ben.counts.doctorShiftsOutsideList, 1);
  assert.equal(ben.counts.leaveDays, 1);
});

test('days: hours needed, hours rostered and doctor session cover', () => {
  const a = buildRosterAnalysis(input());
  const day2 = a.days.find((d) => d.date === '2026-10-06')!;
  // 10 h doctor session + 12 h of free nurse (09:00 to 21:00 by default)
  assert.deepEqual(day2.hoursNeeded, { doctorSessions: 10, freeNurse: 12, total: 22 });
  assert.equal(day2.hoursRostered, 8);
  const session = day2.doctorSessions[0];
  assert.equal(session.nurses[0].nurse, 'Ben');
  assert.equal(session.nurses[0].coveredMinutes, 480);
  assert.deepEqual(session.uncovered, [{ start: '17:00', end: '19:00' }]);
  assert.deepEqual(day2.dayOffRequests, ['Ben']);
});

test('requests say whether they were followed; pinned days and leave are listed', () => {
  const a = buildRosterAnalysis(input());
  const benOff = a.requests.find((r) => r.id === 'r1')!;
  const amyOff = a.requests.find((r) => r.id === 'r2')!;
  assert.equal(benOff.type, 'DAY_OFF');
  assert.equal(benOff.honoured, false); // Ben works that day
  assert.equal(amyOff.honoured, false); // Amy works that day too
  assert.equal(a.summary.requests.dayOff, 2);
  assert.equal(a.pinnedDays.length, 1);
  assert.equal(a.pinnedDays[0].nurse, 'Amy');
  assert.equal(a.leave.length, 1);
  assert.equal(a.leave[0].type, 'AL');
  assert.equal(a.leave[0].hoursCreditedInRoster, 8);
});

test('problems come from the checker, grouped by rule', () => {
  const a = buildRosterAnalysis(input());
  assert.equal(a.problems.length, a.summary.problems.ERROR + a.summary.problems.WARN + a.summary.problems.INFO);
  const partial = a.problems.find((p) => p.rule === 'session-partial');
  assert.ok(partial, 'the 17:00 to 19:00 gap in Dr Khan\'s session is reported');
  assert.ok(a.summary.problems.byRule['session-partial']);
});

test('problemRule picks the longest matching check name', () => {
  assert.equal(problemRule('h7-hours-over-amy'), 'h7-hours-over');
  assert.equal(problemRule('hours-over-amy'), 'hours-over');
  assert.equal(problemRule('cov-gap-2026-10-05-09:00'), 'cov-gap');
  assert.equal(problemRule('scale-ratio-warning'), 'scale-ratio-warning');
  assert.equal(problemRule('something-new'), 'something-new');
  // Hours checks of rosters that cross a period end, and roster overlaps
  assert.equal(problemRule('hours-part-short-n1-2026-11-18'), 'hours-part-short');
  assert.equal(problemRule('hours-deferred-n1'), 'hours-deferred');
  assert.equal(problemRule('hours-written-off-n1'), 'hours-written-off');
  assert.equal(problemRule('h7-period-n1-2026-11-18'), 'h7-period');
  assert.equal(problemRule('schedule-overlap-a-b'), 'schedule-overlap');
});

test('file name', () => {
  assert.equal(analysisFileName('NSC Clinic', SCHEDULE, 3), 'nsc_clinic_analysis_2026-10-05_2026-10-07_v3.json');
});
