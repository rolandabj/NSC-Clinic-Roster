import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, DoctorSession, DutyWindow } from '../../src/types';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { dayTotalsOf } from '../../src/components/workbook/grid/dayTotals';
import { makeNurse, makeSchedule, SENIOR } from './fixtures';

const date = '2026-12-18';
const nurse = makeNurse('n1');
const nurse2 = makeNurse('n2');
const duty = (id: string, startTime: string, endTime: string): DutyWindow =>
  ({ id, name: id, acronym: id, startTime, endTime, active: true, color: '#000000' });
const session = (doctorId = 'doctor', startTime = '09:00', endTime = '21:00'): DoctorSession =>
  ({ id: doctorId, doctorId, date, startTime, endTime, source: 'MANUAL', cancelled: false } as DoctorSession);
const shift = (nurseId: string, dutyWindowId: string, doctorId?: string): Assignment =>
  ({ id: `${nurseId}-${dutyWindowId}`, scheduleId: 'sched-1', date, nurseId, dutyWindowId,
    kind: doctorId ? 'DOCTOR' : 'CLINICAL_ROLE', doctorId, source: 'MANUAL', locked: false } as Assignment);
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 12 });
const check = (shifts: Assignment[], duties: DutyWindow[], sessions: DoctorSession[] = [], holiday = false) =>
  ScheduleValidator.validate(schedule, shifts, [nurse, nurse2], [SENIOR], duties, sessions, [], [], [], [],
    [], [], [], [], { holidayDates: holiday ? [date] : [] });

test('a short Nurse Clinic gap is checked at exact shift boundaries', () => {
  const report = check([shift('n1', 'early'), shift('n2', 'late')],
    [duty('early', '09:00', '09:20'), duty('late', '09:40', '21:00')]);
  const gaps = report.findings.filter(f => f.id.startsWith('cov-gap-'));
  assert.equal(gaps.length, 1);
  assert.match(gaps[0].message, /09:20 to 09:40/);
  assert.equal(gaps[0].amount, 1 / 3);
});

test('a doctor nurse becomes free at the exact session end', () => {
  const report = check([shift('n1', 'full', 'doctor')], [duty('full', '09:00', '21:00')],
    [session('doctor', '09:00', '18:30')]);
  const gaps = report.findings.filter(f => f.id.startsWith('cov-gap-'));
  assert.match(gaps[0].message, /09:00 to 18:30/);
  assert.equal(gaps[0].amount, 9.5);
});

test('doctor shortages remain visible when Nurse Clinic is covered', () => {
  const report = check([shift('n1', 'full')], [duty('full', '09:00', '21:00')], [session()]);
  const c = report.hourlyCoverageMap[date]['09:00'];
  assert.equal(c.deficit, 0);
  assert.equal(c.uncoveredDoctors, 1);
  assert.equal(c.coveredDoctors, 0);
  assert.equal(c.end, '10:00');
  assert.equal(report.findings.find(f => f.id.startsWith('unassigned-session-'))?.amount, 12);
});

test('partial doctor cover records the exact missing duration and affected nurse', () => {
  const report = check([shift('n1', 'late', 'doctor')], [duty('late', '09:30', '21:00')], [session()]);
  const f = report.findings.find(f => f.id.startsWith('session-partial-'))!;
  assert.equal(f.amount, 0.5);
  assert.equal(f.hour, '09:00');
  assert.deepEqual(f.cellRefs, [{ nurseId: 'n1', date }]);
});

test('overlapping nurses on one doctor are flagged for only their shared session time', () => {
  const report = check([shift('n1', 'early', 'doctor'), shift('n2', 'late', 'doctor')],
    [duty('early', '09:00', '19:00'), duty('late', '11:00', '21:00')], [session()]);
  const f = report.findings.find(f => f.id.startsWith('session-overlap-'))!;
  assert.ok(f);
  assert.equal(f.severity, 'WARN');
  assert.equal(f.amount, 8);
  assert.match(f.message, /11:00 to 19:00/);
  assert.deepEqual(f.affectedNurseIds.sort(), ['n1', 'n2']);
});

test('a touching handover is not duplicate coverage', () => {
  const report = check([shift('n1', 'early', 'doctor'), shift('n2', 'late', 'doctor')],
    [duty('early', '09:00', '15:30'), duty('late', '15:30', '21:00')], [session()]);
  assert.ok(!report.findings.some(f => /^session-(overlap|partial)-/.test(f.id)));
  assert.equal(report.hourlyCoverageMap[date]['15:30'].uncoveredDoctors, 0);
});

test('duplicate records for one nurse do not create a second nurse or doctor overlap warning', () => {
  const s = shift('n1', 'full', 'doctor');
  const report = check([s, { ...s, id: 'duplicate' }], [duty('full', '09:00', '21:00')], [session()]);
  assert.equal(report.hourlyCoverageMap[date]['09:00'].nurses, 1);
  assert.ok(!report.findings.some(f => f.id.startsWith('session-overlap-')));
});

test('holiday coverage also detects gaps shorter than an hour and ignores doctor demand', () => {
  const report = check([shift('n1', 'early'), shift('n2', 'late')],
    [duty('early', '09:00', '09:20'), duty('late', '09:40', '21:00')], [session()], true);
  const c = report.hourlyCoverageMap[date]['09:20'];
  assert.equal(c.deficit, 1);
  assert.equal(c.uncoveredDoctors, 0);
  assert.equal(c.holiday, true);
});

test('day totals sum actual interval durations instead of counting intervals as hours', () => {
  const report = check([shift('n1', 'late')], [duty('late', '09:30', '21:00')]);
  const total = dayTotalsOf([date], [], [], [nurse], [SENIOR], report.hourlyCoverageMap).get(date)!;
  assert.equal(total.gapHours, 0.5);
});

test('doctor overlap outside the session and cancelled sessions are ignored', () => {
  const report = check([shift('n1', 'full', 'doctor'), shift('n2', 'late', 'doctor')],
    [duty('full', '09:00', '21:00'), duty('late', '18:30', '21:00')],
    [session('doctor', '09:00', '18:30'), { ...session('cancelled'), cancelled: true }]);
  assert.ok(!report.findings.some(f => f.id.startsWith('session-overlap-')));
  assert.equal(report.hourlyCoverageMap[date]['18:30'].doctors, 0);
});

test('a duplicate float record cannot make a nurse with a doctor count as free', () => {
  const report = check([shift('n1', 'full', 'doctor'), shift('n1', 'full')],
    [duty('full', '09:00', '21:00')], [session()]);
  assert.equal(report.hourlyCoverageMap[date]['09:00'].freeNurses, 0);
  assert.equal(report.hourlyCoverageMap[date]['09:00'].deficit, 1);
});
