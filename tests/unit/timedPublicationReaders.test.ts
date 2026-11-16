import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, ScheduleVersion } from '../../src/types';
import { allocationSignature, approveAllocation, hasAllocationReview } from '../../src/services/engine/allocationReview';
import { computeScheduleDiff } from '../../src/services/history/diffEngine';
import { countChangedCells } from '../../src/services/dashboard/dashboardSummary';
import { buildNurseRosterDoc, buildTeamRosterSheet, shiftDetail } from '../../src/services/publish/nurseRosterService';
import { buildNurseIcs, buildNurseRosterIcs, nurseShiftUid, shortHash } from '../../src/services/export/icsExportService';
import { RosterPublishService } from '../../src/services/publish/rosterPublishService';
import { PUBLIC_ROSTER_FORMAT, syncPublicRoster } from '../../src/services/publish/publicRosterService';
import { repositoryManager } from '../../src/services/repository';
import { DAY_DUTY, SENIOR, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-22';
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 });
const nurse = makeNurse('amy', { fullName: 'Amy', notes: 'Private nurse note' });
const doctors = ['one', 'two'].map((id, i) => ({ id, fullName: `Dr ${i ? 'Taylor' : 'Morgan'}`, specialtyIds: [], weeklyPattern: [], active: true, lowAcuity: true } as Doctor));
const refs = { doctors, clinicalRoles: [], specialties: [], dutyWindows: [DAY_DUTY] };
const legacy: Assignment = { id: 'a', scheduleId: schedule.id, nurseId: nurse.id, date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: 'one', secondDoctorId: 'two', locked: false, source: 'MANUAL' };
const timed: Assignment = { ...legacy, doctorCoverage: [
  { doctorId: 'one', startTime: '09:00', endTime: '13:00' },
  { doctorId: 'two', startTime: '13:00', endTime: '17:00' },
] };
const changed: Assignment = { ...timed, doctorCoverage: [
  { doctorId: 'one', startTime: '09:00', endTime: '13:15' },
  { doctorId: 'two', startTime: '13:15', endTime: '17:00' },
] };
const published = (a: Assignment): ScheduleVersion => ({ id: 'v', scheduleId: schedule.id, number: 1, timestamp: '2026-11-15T10:00:00Z', author: 'Planner', note: '', isPublished: true,
  snapshot: { schedule, assignments: [a], leaveEntries: [], locks: [], rulesSnapshot: [] } });
const docInput = (a = timed) => ({ ...refs, token: 'nr_test', nurse, clinic: { name: 'Clinic', timezone: 'Asia/Dubai' }, schedules: [schedule], versions: [published(a)], today: date });
const diff = (a: Assignment, b: Assignment) => computeScheduleDiff([a], [b], [nurse], [DAY_DUTY], doctors, [], []);
const unfolded = (ics: string) => ics.replace(/\r\n /g, '');
const uid = (ics: string) => unfolded(ics).split('\r\n').find(l => l.startsWith('UID:'));

test('legacy allocation review signatures remain byte identical', () => {
  assert.equal(allocationSignature(legacy), JSON.stringify(['a', schedule.id, 'amy', date, DAY_DUTY.id, 'DOCTOR', 'one', null, 'two']));
  assert.equal(allocationSignature({ ...legacy, secondDoctorId: undefined }), JSON.stringify(['a', schedule.id, 'amy', date, DAY_DUTY.id, 'DOCTOR', 'one', null]));
});
test('adding or changing explicit coverage invalidates an allocation review', () => {
  const oldReview = approveAllocation(legacy, 'lead', 'Reviewed', '2026-11-15T10:00:00Z');
  assert.ok(!hasAllocationReview({ ...timed, allocationReview: oldReview }));
  const review = approveAllocation(timed, 'lead', 'Reviewed', '2026-11-15T10:00:00Z');
  assert.ok(!hasAllocationReview({ ...changed, allocationReview: review }));
});
test('equivalent interval order and touching splits preserve the exact allocation review', () => {
  const review = approveAllocation(timed, 'lead', 'Reviewed', '2026-11-15T10:00:00Z');
  const equivalent = { ...timed, doctorCoverage: [timed.doctorCoverage![1],
    { doctorId: 'one', startTime: '11:00', endTime: '13:00' }, { doctorId: 'one', startTime: '09:00', endTime: '11:00' }] };
  assert.ok(hasAllocationReview({ ...equivalent, allocationReview: review }));
});
test('the dashboard counts a timing only edit once', () => {
  assert.equal(countChangedCells([timed], [changed]), 1);
});
test('history describes timing only doctor changes', () => {
  const result = diff(timed, changed);
  assert.equal(result.modifiedCount, 1);
  assert.match(result.allChanges[0].before!.targetName, /13:00/);
  assert.match(result.allChanges[0].after!.targetName, /13:15/);
  assert.match(result.allChanges[0].description, /doctor cover/);
});
test('equivalent coverage ordering does not create dashboard or history changes', () => {
  const equivalent = { ...timed, doctorCoverage: [...timed.doctorCoverage!].reverse() };
  assert.equal(countChangedCells([timed], [equivalent]), 0);
  assert.equal(diff(timed, equivalent).totalChangesCount, 0);
});
test('sequential doctor detail shows both exact coverage intervals', () => {
  const detail = shiftDetail(timed, refs);
  assert.match(detail, /Dr Morgan 09:00 to 13:00/);
  assert.match(detail, /Dr Taylor 13:00 to 17:00/);
});
test('partial doctor detail includes the remaining Float time', () => {
  const a = { ...timed, secondDoctorId: undefined, doctorCoverage: [timed.doctorCoverage![0]] };
  const detail = shiftDetail(a, refs);
  assert.match(detail, /Dr Morgan 09:00 to 13:00/);
  assert.match(detail, /Float 13:00 to 17:00/);
});
test('invalid explicit timing never falls back to reassuring doctor names', () => {
  assert.equal(shiftDetail({ ...timed, doctorCoverage: [] }, refs), 'Doctor cover needs review');
});
test('private roster shifts keep one paid duty and explicit doctor times', () => {
  const doc = buildNurseRosterDoc(docInput());
  assert.equal(doc.shifts.length, 1);
  assert.equal(doc.shifts[0].assignmentId, timed.id);
  assert.equal(doc.shifts[0].startTime, '09:00');
  assert.equal(doc.shifts[0].endTime, '17:00');
  assert.match(doc.shifts[0].detail, /13:00/);
});
test('published team cells include timed cover without private notes', () => {
  const sheet = buildTeamRosterSheet({ ...refs, schedule, version: published(timed), nurses: [nurse] });
  assert.match(sheet.nurses[0].cells[0].detail!, /Dr Morgan 09:00 to 13:00/);
  assert.ok(!JSON.stringify(sheet).includes('Private nurse note'));
});
test('raw calendar exports keep one full duty event with the doctor timeline', () => {
  const ics = unfolded(buildNurseIcs({ calendarName: 'Amy', clinicName: 'Clinic', timezone: 'Asia/Dubai', nurseId: nurse.id,
    assignments: [timed], ...refs }));
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.match(ics, /DTSTART:20261122T050000Z/);
  assert.match(ics, /DTEND:20261122T130000Z/);
  assert.match(ics, /Dr Morgan 09:00 to 13:00/);
  assert.match(ics, /Dr Taylor 13:00 to 17:00/);
});
test('private calendar timing edits update the same event rather than change its identity', () => {
  const before = buildNurseRosterIcs(buildNurseRosterDoc(docInput(timed)));
  const after = buildNurseRosterIcs(buildNurseRosterDoc(docInput(changed)));
  assert.equal(uid(before), uid(after));
  assert.match(unfolded(after), /13:15/);
});
test('legacy private calendar event identity stays unchanged', () => {
  const shift = { date, startTime: '09:00', acronym: 'D', detail: 'With Dr Morgan' };
  assert.equal(nurseShiftUid('amy', shift), `amy-${date}-0900-D-${shortHash(shift.detail)}@clinicroster`);
  assert.equal(buildNurseRosterDoc(docInput(legacy)).shifts[0].assignmentId, undefined);
});
test('personal email rows show cover times and count the paid duty once', () => {
  const email = RosterPublishService.generatePersonalEmailHtml({ clinicName: 'Clinic', schedule, version: published(timed), nurse,
    assignments: [timed], dutyWindows: [DAY_DUTY], doctors, roles: [], specialties: [], leaveEntries: [], leaveTypes: [], ackToken: 'ack' });
  assert.match(email.html, /Dr Morgan 09:00 to 13:00/);
  assert.match(email.html, /Dr Taylor 13:00 to 17:00/);
  assert.match(email.bodyPreview, /Total: 8h/);
});
test('public snapshots retain only the three timing fields and mark the newer format', async t => {
  const malicious = { ...timed, note: 'PRIVATE', doctorCoverage: timed.doctorCoverage!.map(c => ({ ...c, reviewedBy: 'PRIVATE_ACTOR', extra: 'PRIVATE' })) };
  const tables: Record<string, unknown[]> = { nurses: [nurse], dutyWindows: [DAY_DUTY], seniorityLevels: [SENIOR], doctors,
    clinicalRoles: [], specialties: [], clinics: [{ name: 'Clinic', timezone: 'Asia/Dubai' }] };
  let saved: any;
  const repo = { get: async (name: string) => name === 'versions' ? published(malicious) : schedule,
    list: async (name: string) => tables[name] || [], create: async (_name: string, doc: unknown) => { saved = doc; return doc; } };
  t.mock.method(repositoryManager, 'getRepo', () => repo as any);
  await syncPublicRoster({ id: 'share', token: 'token', scheduleId: schedule.id, pointsToVersionId: 'v', public: true, revoked: false, allowedEmails: [] } as any);
  assert.ok(PUBLIC_ROSTER_FORMAT >= 3);
  assert.equal(saved.format, PUBLIC_ROSTER_FORMAT);
  assert.deepEqual(saved.version.snapshot.assignments[0].doctorCoverage, timed.doctorCoverage);
  assert.ok(!JSON.stringify(saved).includes('PRIVATE'));
});
