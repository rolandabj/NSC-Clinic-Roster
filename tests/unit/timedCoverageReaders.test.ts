import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';
import { cellLookupsOf, cellViewOf, reuseCellViews } from '../../src/components/workbook/grid/cellView';
import { doctorSessionCoverView } from '../../src/components/workbook/doctorSessionCoverView';
import { timedCoverageViewOf } from '../../src/components/workbook/grid/timedCoverageView';
import { dayViewOf } from '../../src/components/roster/dayView';
import { ANNUAL_LEAVE, DAY_DUTY, makeLeave, makeNurse } from './fixtures';

const date = '2026-11-18';
const nurse = makeNurse('amy');
const doctors = ['one', 'two'].map((id, i) => ({ id, fullName: i ? 'Dr Taylor Clinician' : 'Dr Morgan Practitioner',
  specialtyIds: [], active: true, lowAcuity: false, weeklyPattern: [] } as Doctor));
const sessions = doctors.map(d => ({ id: d.id, doctorId: d.id, date, startTime: '09:00', endTime: '17:00', source: 'MANUAL', cancelled: false } as DoctorSession));
const base: Assignment = { id: 'timed', scheduleId: 'test', nurseId: nurse.id, date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: 'one', secondDoctorId: 'two', source: 'MANUAL', locked: false };
const sequential = { ...base, doctorCoverage: [{ doctorId: 'one', startTime: '09:00', endTime: '13:00' }, { doctorId: 'two', startTime: '13:00', endTime: '17:00' }] };
const lookups = (profiles = doctors) => cellLookupsOf({ dutyWindows: [DAY_DUTY], doctors: profiles, roles: [], specialties: [], leaveTypes: [], sessions });
const view = (assignment = sequential, profiles = doctors) => cellViewOf({ nurse, day: { dateStr: date, isToday: false, isWeekend: false }, assignment, problems: [] }, lookups(profiles));

test('sequential normal doctor cover has exact visible times and no shared low acuity claim', () => {
  const v = view();
  assert.equal(v.coverageMode, 'sequential');
  assert.equal(v.coverageBadge, 'Sequential cover');
  assert.match(v.coverageLines, /Morgan\n09:00 to 13:00/);
  assert.match(v.coverageLines, /Taylor\n13:00 to 17:00/);
  assert.match(v.ariaLabel, /Dr Morgan Practitioner.*09:00 to 13:00/s);
  assert.match(v.ariaLabel, /Dr Taylor Clinician.*13:00 to 17:00/s);
  assert.doesNotMatch(v.title, /low acuity|shared cover|2 doctors/i);
});
test('shared timed cover names only the actual overlap in its explanatory text', () => {
  const a = { ...base, doctorCoverage: [{ doctorId: 'one', startTime: '09:00', endTime: '14:00' }, { doctorId: 'two', startTime: '13:00', endTime: '17:00' }] };
  const v = view(a, doctors.map(d => ({ ...d, lowAcuity: true })));
  assert.equal(v.coverageMode, 'shared');
  assert.equal(v.coverageBadge, '2 doctors');
  assert.match(v.title, /Shared cover: 13:00 to 14:00/);
  assert.match(v.coverageLines, /Morgan\n09:00 to 14:00/);
  assert.match(v.coverageLines, /Taylor\n13:00 to 17:00/);
});
test('the timed grid shows derived Float gaps without changing the paid duty times', () => {
  const a = { ...base, secondDoctorId: undefined, doctorCoverage: [{ doctorId: 'one', startTime: '11:00', endTime: '15:00' }] };
  const v = view(a);
  assert.match(v.coverageLines, /Float\n09:00 to 11:00/);
  assert.match(v.coverageLines, /Float\n15:00 to 17:00/);
  assert.equal(v.startTime, '09:00');
  assert.equal(v.endTime, '17:00');
});
test('invalid timed coverage gets review text instead of invented Float cover', () => {
  const a = { ...base, doctorCoverage: [{ doctorId: 'one', startTime: '17:00', endTime: '09:00' }] };
  const v = view(a);
  assert.equal(v.coverageMode, 'review');
  assert.equal(v.coverageBadge, 'Review cover');
  assert.match(v.ariaLabel, /needs review/i);
  assert.doesNotMatch(v.coverageLines, /Float/);
});
test('phone day summaries carry timed cover and Float details', () => {
  const a = { ...base, secondDoctorId: undefined, doctorCoverage: [{ doctorId: 'one', startTime: '11:00', endTime: '15:00' }] };
  const day = dayViewOf(date, { nurses: [nurse], assignments: [a], leaveEntries: [], locks: [], holidays: [], lookups: lookups(), findings: [], today: date });
  assert.match(day.rows[0].summary, /11:00 to 15:00/);
  assert.match(day.rows[0].summary, /Float.*09:00 to 11:00/s);
});
test('timed cell fields remain primitive and unchanged timed views are reused', () => {
  const a = view();
  assert.ok(Object.values(a).every(value => value == null || typeof value !== 'object'));
  const old = new Map([[a.key, a]]);
  assert.equal(reuseCellViews(old, new Map([[a.key, view()]])).get(a.key), a);
});
test('legacy paired cells retain their existing label without a fabricated timed timeline', () => {
  const v = cellViewOf({ nurse, day: { dateStr: date, isToday: false, isWeekend: false }, assignment: base, problems: [] }, lookups());
  assert.equal(v.pairedDoctors, true);
  assert.equal(v.coverageMode, 'legacy');
  assert.equal(v.coverageLines, '');
});

const context = (nurses = [nurse, makeNurse('ben')]) => ({ nurses, roles: [], doctors, specialties: [], sessions, leaveEntries: [], locks: [], availabilityRequests: [] });
test('the doctor view lists both nurses in a complete handover with their exact cover times', () => {
  const duties = [{ ...DAY_DUTY, id: 'early', endTime: '13:00' }, { ...DAY_DUTY, id: 'late', startTime: '13:00' }];
  const assignments = [{ ...base, secondDoctorId: undefined, dutyWindowId: 'early' },
    { ...base, id: 'helper', nurseId: 'ben', secondDoctorId: undefined, dutyWindowId: 'late' }];
  const result = doctorSessionCoverView(sessions[0], assignments, duties, context());
  assert.deepEqual(result.rows.map(r => [r.nurseId, r.startTime, r.endTime]), [['amy', '09:00', '13:00'], ['ben', '13:00', '17:00']]);
  assert.deepEqual(result.gaps, []);
  assert.equal(result.needsReview, false);
});
test('the doctor view reports exact gaps between explicit cover intervals', () => {
  const assignments = [{ ...base, secondDoctorId: undefined, doctorCoverage: [
    { doctorId: 'one', startTime: '09:00', endTime: '12:30' }, { doctorId: 'one', startTime: '13:15', endTime: '17:00' },
  ] }];
  const result = doctorSessionCoverView(sessions[0], assignments, [DAY_DUTY], context());
  assert.deepEqual(result.gaps, [{ start: '12:30', end: '13:15' }]);
  assert.match(result.summary, /No nurse: 12:30 to 13:15/);
});
test('the doctor view cannot present an inactive or absent nurse as coverage', () => {
  const a = { ...base, secondDoctorId: undefined };
  const inactive = doctorSessionCoverView(sessions[0], [a], [DAY_DUTY], context([{ ...nurse, active: false }]));
  assert.equal(inactive.rows.length, 0);
  assert.equal(inactive.needsReview, true);
  assert.deepEqual(inactive.gaps, [{ start: '09:00', end: '17:00' }]);
  const absent = doctorSessionCoverView(sessions[0], [a], [DAY_DUTY], { ...context(), availabilityRequests: [
    { id: 'off', nurseId: nurse.id, date, available: false, status: 'APPROVED' as const, submittedByNurseId: nurse.id, submittedAt: '2026-11-16T08:00:00Z' },
  ] });
  assert.equal(absent.rows.length, 0);
});
test('historical timed displays use saved intervals without requiring current clinics', () => {
  const old = timedCoverageViewOf(sequential, DAY_DUTY, doctors);
  assert.equal(old.coverageMode, 'sequential');
  assert.match(old.coverageText, /Dr Morgan Practitioner 09:00 to 13:00/);
  assert.equal(timedCoverageViewOf(sequential, DAY_DUTY, doctors, []).coverageMode, 'review');
});

test('leave and pinned days off hide any conflicting timed assignment display', () => {
  const data = cellLookupsOf({ dutyWindows: [DAY_DUTY], doctors, roles: [], specialties: [], leaveTypes: [ANNUAL_LEAVE], sessions });
  const facts = { nurse, day: { dateStr: date, isToday: false, isWeekend: false }, assignment: sequential, problems: [] };
  const leave = cellViewOf({ ...facts, leave: makeLeave({ nurseId: nurse.id, startDate: date, endDate: date }) }, data);
  assert.equal(leave.content, 'leave');
  assert.equal(leave.coverageMode, 'legacy');
  assert.equal(leave.coverageLines, '');
  const off = cellViewOf({ ...facts, lock: { id: 'off', nurseId: nurse.id, date, mode: 'OFF', createdAt: '2026-11-16T10:00:00Z' } }, data);
  assert.equal(off.content, 'off');
  assert.equal(off.coverageMode, 'legacy');
});
