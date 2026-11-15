import { test } from 'node:test';
import { rosterReviewText } from '../../src/services/export/rosterReviewText';
import { approveAllocation } from '../../src/services/engine/allocationReview';
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

test('analysis includes clinical eligibility without exposing the reviewer account', () => {
  const nurses = [makeNurse('amy', { doctorEligibility: { doctorIds: [KHAN.id], specialtyIds: [],
    reviewedBy: 'private-reviewer-account', reviewedAt: '2026-11-15T10:00:00Z' } })];
  const a = buildRosterAnalysis(input({ nurses }));
  assert.deepEqual(a.nurses[0].doctorEligibility, { doctorIds: [KHAN.id], specialtyIds: [],
    reviewed: true, reviewedAt: '2026-11-15T10:00:00Z' });
  assert.ok(!JSON.stringify(a).includes('private-reviewer-account'));
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
  // The 7 day hours rule and days outside every period
  assert.equal(problemRule('h9-week-hours-n1-2026-10-25'), 'h9-week-hours');
  assert.equal(problemRule('period-gap-2026-12-19'), 'period-gap');
});

test('file name', () => {
  assert.equal(analysisFileName('NSC Clinic', SCHEDULE, 3), 'nsc_clinic_analysis_2026-10-05_2026-10-07_v3.json');
});


test('analysis exports exact coverage intervals and groups shared doctor coverage warnings', () => {
  const a = buildRosterAnalysis(input({
    assignments: [shift('a1', 'amy', '2026-10-05'),
      shift('b1', 'ben', '2026-10-05', { dutyWindowId: LATE.id })],
  }));
  assert.equal(a.hourlyCoverage['2026-10-05']['13:00'].coveredDoctors, 1);
  assert.equal(a.hourlyCoverage['2026-10-05']['17:00'].uncoveredDoctors, 0);
  assert.equal(a.hourlyCoverage['2026-10-06']['09:00'].uncoveredDoctors, 1);
  assert.equal(a.hourlyCoverage['2026-10-06']['09:00'].end, '10:00');
  assert.equal(a.problems.filter(p => p.rule === 'session-overlap').length, 1);
  assert.equal(a.summary.problems.byRule['session-overlap'].WARN, 1);
});

// Stage 5: clinical permission, ranked preferences and publication checks are separate.
function reviewInput(overrides: Partial<RosterAnalysisInput> = {}): RosterAnalysisInput {
  return input({ schedule: { ...SCHEDULE, endDate: SCHEDULE.startDate, hoursTargetFullTime: 8 },
    nurses: [makeNurse('amy', { fullName: 'Amy' })], assignments: [shift('a1', 'amy', SCHEDULE.startDate)],
    sessions: [SESSIONS[0]], leaveEntries: [], availabilityRequests: [], locks: [], ...overrides });
}
const verified = { doctorIds: [KHAN.id], specialtyIds: [], reviewedBy: 'private-clinical-reviewer', reviewedAt: '2026-11-15T10:00:00Z' };

test('eligible nonpreferred pairings are not reported as outside the nurse profile', () => {
  const a = buildRosterAnalysis(reviewInput({ nurses: [makeNurse('amy', { doctorEligibility: verified })] }));
  assert.equal(a.shifts[0].preferenceRank, null);
  assert.equal(a.shifts[0].allocation.allowedByProfile, true);
  assert.equal(a.shifts[0].allocation.clinicalEligibility, 'REVIEWED');
  assert.equal(a.summary.doctorSessions.pairedOutsideList, 0);
  assert.equal(a.summary.doctorSessions.pairedWithoutMatchingPreference, 1);
  assert.equal(a.review.publication.canProceed, true);
});

test('a preferred but clinically ineligible pairing has an eligibility action and blocks publication', () => {
  const a = buildRosterAnalysis(reviewInput({ nurses: [makeNurse('amy', { preferences: [{ kind: 'DOCTOR', refId: KHAN.id, rank: 1 }],
    doctorEligibility: { ...verified, doctorIds: [] } })] }));
  assert.equal(a.shifts[0].preferenceRank, 1);
  assert.equal(a.shifts[0].allocation.allowedByProfile, false);
  assert.equal(a.shifts[0].allocation.exceptionReview, 'NOT_PERMITTED');
  assert.equal(a.review.publication.canProceed, false);
  assert.ok(a.review.userActions.some(x => x.type === 'REVIEW_ELIGIBILITY'));
  assert.ok(!a.review.userActions.some(x => x.type === 'REVIEW_PAIRING'));
});

test('the report distinguishes a clean draft check from missing cover that blocks publication', () => {
  const a = buildRosterAnalysis(reviewInput({ sessions: [{ ...SESSIONS[0], endTime: '19:00' }] }));
  assert.equal(a.summary.problems.ERROR, 0);
  assert.equal(a.review.publication.canProceed, false);
  assert.ok(a.review.publication.blockers.some(x => x.rule === 'session-partial'));
  assert.equal(a.review.coverage.uncoveredDoctorMinutes, 120);
  assert.deepEqual(a.review.coverage.doctorGaps.map(g => [g.start, g.end, g.minutes]), [['17:00', '19:00', 120]]);
  assert.ok(a.review.userActions.some(x => x.type === 'ARRANGE_COVER'));
});

test('a paired shift reports both doctors, missing second doctor cover and hours counted once', () => {
  const second = { ...KHAN, id: 'second', fullName: 'Dr Second', lowAcuity: true };
  const a = buildRosterAnalysis(reviewInput({ doctors: [{ ...KHAN, lowAcuity: true }, second],
    nurses: [makeNurse('amy', { doctorEligibility: { ...verified, doctorIds: [KHAN.id, second.id] } })],
    assignments: [shift('pair', 'amy', SCHEDULE.startDate, { secondDoctorId: second.id })],
    sessions: [SESSIONS[0], { ...SESSIONS[0], id: 's-second', doctorId: second.id, endTime: '19:00' }] }));
  assert.deepEqual(a.shifts[0].allocation.doctors.map(d => [d.doctorId, d.allowedByProfile]), [[KHAN.id, true], [second.id, true]]);
  assert.equal(a.review.coverage.uncoveredDoctorMinutes, 120);
  assert.equal(a.review.coverage.doctorGaps[0].doctorId, second.id);
  assert.equal(a.summary.hours.shiftHoursTotal, 8);
});

test('free nurse gaps keep exact minutes and multiply missing nurse capacity by the rule quota', () => {
  const odd = { ...DAY_DUTY, startTime: '09:20' };
  const a = buildRosterAnalysis(reviewInput({ dutyWindows: [odd], sessions: [],
    assignments: [shift('float', 'amy', SCHEDULE.startDate, { kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'role-float' })],
    rules: hoursOnlyRules().map(r => r.templateKey === 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS' ? { ...r, enabled: true, severity: 'HARD', value: 2 } : r),
    clinicSetup: { openTime: '09:00', closeTime: '17:00' } }));
  assert.equal(a.review.coverage.missingNurseClinicMinutes, 500);
  assert.deepEqual(a.review.coverage.nurseClinicGaps.map(g => [g.start, g.end, g.nursesMissing]), [['09:00', '09:20', 2], ['09:20', '17:00', 1]]);
});

test('profile review recommendations do not invent clinical approval or block legacy profiles automatically', () => {
  const a = buildRosterAnalysis(reviewInput({ nurses: [makeNurse('amy'), makeNurse('inactive', { active: false }),
    makeNurse('new', { doctorEligibility: { ...verified, reviewedBy: '', reviewedAt: '' } }),
    makeNurse('nc-only', { isClinicNurse: false })] }));
  assert.deepEqual(new Set(a.review.profileReviews.map(n => n.nurseId)), new Set(['amy', 'new']));
  assert.equal(a.shifts[0].allocation.clinicalEligibility, 'LEGACY');
  assert.equal(a.review.publication.canProceed, true);
});

test('a stale pairing review stays pending and exported review data contains no reviewer or reason', () => {
  const assignment = shift('review', 'amy', SCHEDULE.startDate, { note: 'Last resort: none of the nurses who list this doctor was free' });
  const legacy = makeNurse('amy', { preferences: [{ kind: 'DOCTOR', refId: 'other', rank: 1 }] });
  assignment.allocationReview = approveAllocation(assignment, 'private-pair-reviewer', 'private-review-reason', '2026-11-15T10:00:00Z');
  const valid = buildRosterAnalysis(reviewInput({ nurses: [legacy], assignments: [assignment] }));
  assert.equal(valid.shifts[0].allocation.exceptionReview, 'REVIEWED');
  assert.equal(valid.review.pairingExceptions.reviewed, 1);
  const stale = buildRosterAnalysis(reviewInput({ nurses: [legacy], assignments: [{ ...assignment, id: 'copied' }] }));
  assert.equal(stale.shifts[0].allocation.exceptionReview, 'STALE');
  assert.equal(stale.review.pairingExceptions.stale, 1);
  assert.equal(stale.review.publication.canProceed, false);
  for (const report of [valid, stale]) {
    assert.ok(!JSON.stringify(report).includes('private-pair-reviewer'));
    assert.ok(!JSON.stringify(report).includes('private-review-reason'));
  }
});

test('public holiday doctor clinics do not create false uncovered doctor totals', () => {
  const a = buildRosterAnalysis(reviewInput({ assignments: [], clinicSetup: { holidayDates: [SCHEDULE.startDate] } }));
  assert.equal(a.review.coverage.uncoveredDoctorMinutes, 0);
  assert.deepEqual(a.review.coverage.doctorGaps, []);
  assert.equal(a.review.coverage.missingNurseClinicMinutes, 0, 'holiday cover does not require Nurse Clinic qualification');
  assert.equal(a.review.coverage.missingHolidayCoverMinutes, 720);
  assert.ok(a.review.userActions.some(x => x.instruction.includes('holiday opening hours')));
});

test('one manual legacy exception produces one user action even with two blocking findings', () => {
  const a = buildRosterAnalysis(reviewInput({ nurses: [makeNurse('amy', { preferences: [{ kind: 'DOCTOR', refId: 'other', rank: 1 }] })] }));
  assert.equal(a.review.publication.blockerCount, 2);
  assert.equal(a.review.userActions.filter(x => x.type === 'REVIEW_PAIRING').length, 1);
  assert.equal(a.review.pairingExceptions.pending, 1);
});

test('the readable action list keeps exact gap times and leaves out private review details', () => {
  const data = reviewInput({ sessions: [{ ...SESSIONS[0], endTime: '19:20' }], nurses: [makeNurse('amy', { doctorEligibility: verified })] });
  const before = JSON.stringify(data);
  const a = buildRosterAnalysis(data);
  const text = rosterReviewText(a);
  assert.ok(text.includes('Missing doctor cover: 2h 20m'));
  assert.ok(text.includes('05-10-2026: Dr Khan, 17:00 to 19:20'));
  assert.ok(text.includes('Fix before publishing.'));
  assert.ok(!text.includes('private-clinical-reviewer'));
  assert.equal(JSON.stringify(data), before, 'reporting does not change saved roster inputs');
  assert.deepEqual(buildRosterAnalysis(data), a);
});
