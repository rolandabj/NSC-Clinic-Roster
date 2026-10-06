import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  doctorFromDate,
  generateDoctorSessionsForDateRange,
  missingPatternSessions,
  planPatternSessions,
  weekChanged,
  weekOn,
} from '../../src/services/schedule/doctorScheduleService';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { leaveApprovalFields } from '../../src/services/engine/leaveStatus';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';

// Batch 4 (owner's answers of 2026-10-06): a doctor's week changed on the Doctors screen
// reaches the days already set up from a date the planner chooses.

const MONDAYS = [{ weekday: 1, startTime: '09:00', endTime: '17:00' }];
const TUESDAYS = [{ weekday: 2, startTime: '09:00', endTime: '17:00' }];
const LEE = { id: 'lee', fullName: 'Dr Lee', specialtyIds: ['ortho'], active: true, weeklyPattern: MONDAYS } as unknown as Doctor;
const ROSTERS = [{ startDate: '2026-10-19', endDate: '2026-11-01' }, { startDate: '2026-11-02', endDate: '2026-11-29' }];
const session = (date: string, extra: Partial<DoctorSession> = {}) =>
  ({ id: `s-${date}`, doctorId: 'lee', date, startTime: '09:00', endTime: '17:00', specialtyId: 'ortho', room: 'Suite 101', source: 'PATTERN', cancelled: false, ...extra }) as DoctorSession;
// Mondays already set up in both rosters; on 9 Nov Dr Lee works 11 to 7 (changed by hand for that day).
const MONDAY_SESSIONS = ['2026-10-19', '2026-10-26', '2026-11-02', '2026-11-16', '2026-11-23'].map((d) => session(d))
  .concat(session('2026-11-09', { startTime: '11:00', endTime: '19:00', source: 'MANUAL' }));

test('Dr Lee moves from Mondays to Tuesdays from 2 November: only the days from then change', () => {
  const after = doctorFromDate(LEE, { ...LEE, weeklyPattern: TUESDAYS }, '2026-11-02');
  assert.deepEqual(after.previousWeeklyPattern, MONDAYS, 'the old week is kept for the days before');
  const plan = planPatternSessions({ doctor: after, sessions: MONDAY_SESSIONS, from: '2026-11-02', setUpRanges: ROSTERS, holidayDates: ['2026-11-24'] });

  assert.deepEqual(plan.remove.map((s) => s.date), ['2026-11-02', '2026-11-16', '2026-11-23'], "Dr Lee's Mondays from 2 Nov go");
  assert.deepEqual(plan.upsert.map((s) => s.date), ['2026-11-03', '2026-11-10', '2026-11-17'], 'Tuesdays come, not on the holiday of 24 Nov');
  assert.deepEqual(plan.handChangedDays, ['2026-11-09'], 'the day changed by hand stays');
  assert.ok(plan.upsert.every((s) => s.source === 'PATTERN' && s.startTime === '09:00' && s.doctorId === 'lee'));

  // Filling the October roster again later keeps its old week: no Tuesday before 2 Nov.
  const fill = missingPatternSessions(generateDoctorSessionsForDateRange('2026-10-19', '2026-11-01', [after]), MONDAY_SESSIONS);
  assert.deepEqual(fill, []);
  assert.deepEqual(weekOn(after, '2026-10-27'), MONDAYS);
  assert.deepEqual(weekOn(after, '2026-11-03'), TUESDAYS);
});

test('new hours on the same day replace the old clinic; a longer clinic keeps its record', () => {
  const later = planPatternSessions({
    doctor: doctorFromDate(LEE, { ...LEE, weeklyPattern: [{ weekday: 1, startTime: '13:00', endTime: '21:00' }] }, '2026-11-16'),
    sessions: MONDAY_SESSIONS, from: '2026-11-16', setUpRanges: ROSTERS, holidayDates: [],
  });
  assert.deepEqual(later.remove.map((s) => s.date), ['2026-11-16', '2026-11-23']);
  assert.deepEqual(later.upsert.map((s) => `${s.date} ${s.startTime}`), ['2026-11-16 13:00', '2026-11-23 13:00']);

  const longer = planPatternSessions({
    doctor: doctorFromDate(LEE, { ...LEE, weeklyPattern: [{ weekday: 1, startTime: '09:00', endTime: '19:00' }] }, '2026-11-16'),
    sessions: MONDAY_SESSIONS, from: '2026-11-16', setUpRanges: ROSTERS, holidayDates: [],
  });
  assert.deepEqual(longer.remove, []);
  assert.deepEqual(longer.upsert.map((s) => `${s.id} ${s.endTime}`), ['s-2026-11-16 19:00', 's-2026-11-23 19:00']);

  // Without the change being applied, a later fill never adds a second clinic on a day kept from the old week.
  const newWeek = { ...LEE, weeklyPattern: [{ weekday: 1, startTime: '13:00', endTime: '21:00' }] } as Doctor;
  assert.deepEqual(missingPatternSessions(generateDoctorSessionsForDateRange('2026-11-16', '2026-11-16', [newWeek]), MONDAY_SESSIONS), []);
});

test('switching a doctor off removes the days from that date; a new doctor starts on a date', () => {
  const off = planPatternSessions({ doctor: doctorFromDate(LEE, { ...LEE, active: false }, '2026-11-10'), sessions: MONDAY_SESSIONS, from: '2026-11-10', setUpRanges: ROSTERS, holidayDates: [] });
  assert.deepEqual(off.remove.map((s) => s.date), ['2026-11-16', '2026-11-23']);
  assert.deepEqual(off.upsert, []);

  const ray = doctorFromDate(undefined, { ...LEE, id: 'ray', weeklyPattern: TUESDAYS }, '2026-11-10');
  const start = planPatternSessions({ doctor: ray, sessions: [], from: '2026-11-10', setUpRanges: ROSTERS, holidayDates: [] });
  assert.deepEqual(start.upsert.map((s) => s.date), ['2026-11-10', '2026-11-17', '2026-11-24']);
  assert.deepEqual(weekOn(ray, '2026-11-03'), [], 'nothing before the first day');

  assert.equal(weekChanged(LEE, { ...LEE }), false, 'a new name or email is no week change');
  assert.equal(weekChanged(LEE, { ...LEE, weeklyPattern: TUESDAYS }), true);
  assert.equal(weekChanged(LEE, { ...LEE, active: false }), true);
  assert.equal(weekChanged(undefined, ray), true);
});

test('the checker notes a nurse still with a doctor who has no clinic that day', () => {
  const schedule = makeSchedule({ startDate: '2026-11-16', endDate: '2026-11-17', hoursTargetFullTime: 0 });
  const mary = makeNurse('mary', { fullName: 'Mary' });
  const withLee = { id: 'a1', scheduleId: 'sched-1', nurseId: 'mary', date: '2026-11-17', dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: 'lee', locked: false, source: 'GENERATED' } as Assignment;
  const check = (sessions: DoctorSession[]) =>
    ScheduleValidator.validate(schedule, [withLee], [mary], [SENIOR], [DAY_DUTY], sessions, [], [], [], hoursOnlyRules(), [], [], [LEE])
      .findings.filter((f) => f.id.startsWith('doctor-not-in-clinic'));
  const found = check([]);
  assert.equal(found.length, 1);
  assert.equal(found[0].severity, 'WARN');
  assert.match(found[0].message, /Mary is with Dr Lee on Tue 17-11-2026, but Dr Lee has no clinic that day/);
  assert.equal(check([session('2026-11-17')]).length, 0);
});

test('the leave switch sets both approval marks', () => {
  const planner = { uid: 'u1', name: 'Planner', email: 'p@example.com' };
  // Bea's request, waiting, switched to Approved: approved everywhere, with who decided.
  const approved = leaveApprovalFields(true, { approved: false, status: 'PENDING' }, planner, 'T');
  assert.deepEqual(approved, { approved: true, status: 'APPROVED', reviewedByUserId: 'u1', reviewedByUserName: 'Planner', reviewedAt: 'T' });
  // Cara's approved leave switched to Pending: waiting again, on the approval page too.
  assert.deepEqual(leaveApprovalFields(false, { approved: true, status: 'APPROVED' }, planner), { approved: false, status: 'PENDING' });
  // A declined leave saved with another change stays declined; an approved one keeps who decided.
  assert.deepEqual(leaveApprovalFields(false, { approved: false, status: 'REJECTED' }, planner), { approved: false, status: 'REJECTED' });
  assert.deepEqual(leaveApprovalFields(true, { approved: true, status: 'APPROVED' }, planner), { approved: true, status: 'APPROVED' });
});
