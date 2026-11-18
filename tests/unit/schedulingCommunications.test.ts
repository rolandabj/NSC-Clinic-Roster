import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as XLSX from 'xlsx';
import type { Assignment, Doctor, DoctorSession, ScheduleVersion } from '../../src/types';
import { runSchedulingWorker } from '../../src/services/engine/schedulingWorkerRunner';
import { schedulingClockMs, type SchedulingRunInput } from '../../src/services/engine/workerProtocol';
import { recordManualDoctorOverlaps } from '../../src/services/engine/manualDoctorOverlap';
import { approveAllocation } from '../../src/services/engine/allocationReview';
import { buildRosterAnalysis } from '../../src/services/export/analysisExportService';
import { exportRosterToCsvLong, exportRosterToCsvMatrix, exportRosterToExcel } from '../../src/services/export/rosterExportService';
import { exportRosterToPdf } from '../../src/services/export/rosterPdfService';
import { buildNurseIcs, buildNurseRosterIcs } from '../../src/services/export/icsExportService';
import { buildNurseRosterDoc, buildTeamRosterSheet, formatRosterAsText } from '../../src/services/publish/nurseRosterService';
import { RosterPublishService } from '../../src/services/publish/rosterPublishService';
import { syncPublicRoster, type PublicRosterDoc } from '../../src/services/publish/publicRosterService';
import { repositoryManager } from '../../src/services/repository';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-22';
const roundTrip = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const unfold = (ics: string) => ics.replace(/\r\n /g, '');
const csvRows = (csv: string): unknown[][] => XLSX.utils.sheet_to_json(
  XLSX.read(csv, { type: 'string', raw: true }).Sheets.Sheet1, { header: 1, raw: true });
const doctors: Doctor[] = ['a', 'b'].map((id, i) => ({ id, fullName: i ? 'Dr Beta' : 'Dr Alpha', active: true,
  lowAcuity: false, specialtyIds: [], weeklyPattern: [] }));
const clinic = (doctorId: string, startTime: string, endTime: string): DoctorSession => ({ id: `clinic-${doctorId}`,
  doctorId, date, startTime, endTime, specialtyId: '', source: 'MANUAL', cancelled: false });
function input(shared = false): SchedulingRunInput {
  return { schedule: makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }), mode: 'GENERATE_ALL',
    options: { keepManual: true }, assignments: [], nurses: [makeNurse('amy', { fullName: 'Amy', notes: 'PROFILE_PRIVATE',
      doctorEligibility: { doctorIds: ['a', 'b'], specialtyIds: [], reviewedBy: 'ELIGIBILITY_PRIVATE', reviewedAt: '2026-11-18T10:00:00Z' },
      preferences: [{ kind: 'DOCTOR', refId: 'a', rank: 1 }, { kind: 'DOCTOR', refId: 'b', rank: 2 }] })],
    doctors: doctors.map(d => ({ ...d, lowAcuity: shared })),
    sessions: shared ? [clinic('a', '09:00', '17:00'), clinic('b', '09:00', '17:00')]
      : [clinic('a', '09:00', '12:30'), clinic('b', '13:45', '17:00')],
    seniorityLevels: [SENIOR], dutyWindows: [DAY_DUTY], roles: [], specialties: [], rules: hoursOnlyRules(),
    leaveEntries: [], leaveTypes: [], locks: [], workingHoursPeriods: [], clinicSetup: { openTime: '09:00', closeTime: '17:00' } };
}
async function generated(shared = false) {
  const data = input(shared);
  const result = await runSchedulingWorker({ type: 'start', jobId: 'communications', input: data,
    startedAtMs: schedulingClockMs(), budgetMs: 5000 });
  assert.equal(result.validation.errorCount, 0);
  assert.equal(result.search.finalUncoveredDoctorMinutes, 0);
  return { ...roundTrip(data), assignments: roundTrip(result.assignments) };
}
function version(data: SchedulingRunInput): ScheduleVersion {
  return { id: 'published', scheduleId: data.schedule.id, number: 1, timestamp: '2026-11-22T04:00:00Z', author: 'PLANNER_PRIVATE',
    note: 'VERSION_PRIVATE', isPublished: true, snapshot: { schedule: { ...data.schedule, status: 'PUBLISHED' },
      assignments: data.assignments, leaveEntries: data.leaveEntries, locks: data.locks, rulesSnapshot: data.rules } };
}
function exportInput(data: SchedulingRunInput) {
  return { ...data, clinicName: 'Test Clinic', timezone: 'Asia/Dubai', availabilityRequests: [],
    exportedAt: '2026-11-22T04:00:00Z' };
}
function personal(data: SchedulingRunInput, nurseId = 'amy') {
  return buildNurseRosterDoc({ ...data, token: 'nr_test', nurse: data.nurses.find(n => n.id === nurseId)!,
    clinic: { name: 'Test Clinic', timezone: 'Asia/Dubai' }, schedules: [data.schedule], versions: [version(data)],
    clinicalRoles: data.roles, today: date });
}
function email(data: SchedulingRunInput, nurseId = 'amy') {
  return RosterPublishService.generatePersonalEmailHtml({ ...data, clinicName: 'Test Clinic', version: version(data),
    nurse: data.nurses.find(n => n.id === nurseId)!, ackToken: 'ack' });
}
function noPrivateProfileData(value: unknown) {
  const text = JSON.stringify(value);
  for (const secret of ['PROFILE_PRIVATE', 'ELIGIBILITY_PRIVATE', 'PLANNER_PRIVATE', 'VERSION_PRIVATE', 'OVERLAP_PRIVATE',
    'REVIEWER_PRIVATE', 'REVIEW_REASON_PRIVATE']) {
    assert.equal(text.includes(secret), false, `private account or profile text leaked: ${secret}`);
  }
}

test('a real generated sequential duty survives reload and reaches pages, text, email and both calendar feeds with one paid shift', async () => {
  const data = await generated();
  assert.equal(data.assignments.length, 1);
  assert.deepEqual(data.assignments[0].doctorCoverage, [
    { doctorId: 'a', startTime: '09:00', endTime: '12:30' },
    { doctorId: 'b', startTime: '13:45', endTime: '17:00' },
  ]);
  const doc = personal(data);
  const team = buildTeamRosterSheet({ ...data, version: version(data), clinicalRoles: data.roles });
  const message = email(data);
  const text = formatRosterAsText(doc);
  const rawIcs = unfold(buildNurseIcs({ ...data, calendarName: 'Amy', clinicName: 'Test Clinic', timezone: 'Asia/Dubai',
    nurseId: 'amy', clinicalRoles: data.roles }));
  const privateIcs = unfold(buildNurseRosterIcs(doc));
  assert.equal(doc.shifts.length, 1);
  assert.equal(doc.shifts[0].assignmentId, data.assignments[0].id);
  assert.equal(team.nurses[0].cells.length, 1);
  for (const output of [doc.shifts[0].detail, team.nurses[0].cells[0].detail!, text, message.html, rawIcs, privateIcs]) {
    assert.match(output, /Dr Alpha 09:00 to 12:30/);
    assert.match(output, /Float 12:30 to 13:45/);
    assert.match(output, /Dr Beta 13:45 to 17:00/);
    noPrivateProfileData(output);
  }
  assert.match(message.bodyPreview, /Total: 8h/);
  for (const calendar of [rawIcs, privateIcs]) {
    assert.equal((calendar.match(/BEGIN:VEVENT/g) || []).length, 1);
    assert.match(calendar, /DTSTART:20261122T050000Z/);
    assert.match(calendar, /DTEND:20261122T130000Z/);
  }
});

test('real generated sequential coverage agrees across independent analysis totals, both CSV layouts, Excel and PDF bytes', async () => {
  const data = await generated();
  const before = JSON.stringify(data);
  const report = buildRosterAnalysis(exportInput(data));
  assert.equal(report.review.coverage.uncoveredDoctorMinutes, 0);
  assert.equal(report.summary.hours.workedTotal, 8);
  assert.equal(report.shifts[0].busyMinutes, 405);
  assert.equal(report.shifts[0].floatMinutes, 75);
  const long = csvRows(exportRosterToCsvLong(exportInput(data)));
  assert.equal(long.length, 2);
  assert.equal(Number(long[1][7]), 8);
  assert.match(String(long[1][13]), /Dr Alpha 09:00 to 12:30/);
  assert.match(String(long[1][13]), /Dr Beta 13:45 to 17:00/);
  assert.match(String(csvRows(exportRosterToCsvMatrix(exportInput(data)))[1][3]), /12:30/);
  const pdf = await exportRosterToPdf({ ...exportInput(data), output: 'bytes' });
  const pdfText = Buffer.from(pdf!).toString('latin1');
  for (const expected of ['%PDF-', 'Amy', 'Dr Alpha', 'Dr Beta', '12:30', '13:45', 'Float']) assert.ok(pdfText.includes(expected));
  const folder = await mkdtemp(join(tmpdir(), 'nsc-scheduler-communications-'));
  const previous = process.cwd();
  try {
    process.chdir(folder);
    const workbook = await exportRosterToExcel(exportInput(data));
    const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets.Doctors, { header: 1 });
    assert.deepEqual(rows.slice(1).map(row => [row[2], row[4], row[5], row[9]]), [
      ['Dr Alpha', '09:00', '12:30', 'Amy 09:00 to 12:30'],
      ['Dr Beta', '13:45', '17:00', 'Amy 13:45 to 17:00'],
    ]);
  } finally { process.chdir(previous); await rm(folder, { recursive: true, force: true }); }
  assert.equal(JSON.stringify(data), before);
  noPrivateProfileData(report);
});

test('real last resort shared cover remains two doctor sessions but one duty in reports and communications', async () => {
  const data = await generated(true);
  assert.equal(data.assignments.length, 1);
  assert.deepEqual(new Set(data.assignments[0].doctorCoverage?.map(r => r.doctorId)), new Set(['a', 'b']));
  const report = buildRosterAnalysis(exportInput(data));
  assert.equal(report.summary.hours.workedTotal, 8);
  assert.equal(report.shifts[0].busyMinutes, 480);
  assert.equal(report.review.coverage.uncoveredDoctorMinutes, 0);
  assert.equal(report.days[0].doctorSessions.length, 2);
  assert.equal(report.days[0].doctorSessions.reduce((sum, s) => sum + s.nurses[0].coveredMinutes, 0), 960);
  assert.ok(report.problems.some(p => p.rule === 'low-acuity-cover' && p.severity === 'INFO'));
  const doc = personal(data);
  const message = email(data);
  for (const output of [doc.shifts[0].detail, message.html, unfold(buildNurseRosterIcs(doc))]) {
    assert.match(output, /Dr Alpha 09:00 to 17:00/);
    assert.match(output, /Dr Beta 09:00 to 17:00/);
  }
  assert.equal(doc.shifts.length, 1);
  assert.match(message.bodyPreview, /Total: 8h/);
  assert.equal((buildNurseRosterIcs(doc).match(/BEGIN:VEVENT/g) || []).length, 1);
});

test('published public snapshot retains actual worker coverage after reload while excluding planner and profile secrets', async t => {
  const data = await generated();
  const tables: Record<string, unknown[]> = { ...Object.fromEntries(Object.entries(data).filter(([, v]) => Array.isArray(v))),
    clinicalRoles: data.roles, clinics: [{ name: 'Test Clinic', timezone: 'Asia/Dubai' }] };
  let saved: PublicRosterDoc | undefined;
  const repo = { get: async (name: string) => name === 'versions' ? version(data) : data.schedule,
    list: async (name: string) => tables[name] || [], create: async (_name: string, doc: PublicRosterDoc) => { saved = roundTrip(doc); return doc; } };
  t.mock.method(repositoryManager, 'getRepo', () => repo as any);
  await syncPublicRoster({ id: 'share', token: 'token', scheduleId: data.schedule.id, pointsToVersionId: 'published',
    role: 'VIEWER', createdAt: '2026-11-22T04:00:00Z', public: true, revoked: false, allowedEmails: [] });
  assert.deepEqual(saved!.version.snapshot.assignments[0].doctorCoverage, data.assignments[0].doctorCoverage);
  assert.deepEqual(saved!.doctors.map(d => d.fullName), ['Dr Alpha', 'Dr Beta']);
  assert.equal(saved!.version.snapshot.assignments.length, 1);
  noPrivateProfileData(saved);
  assert.equal(JSON.stringify(saved).includes('amy@example.com'), false);
});

test('worker preserves a saved manual handover overlap while public, nurse, email and calendar payloads omit its provenance', async t => {
  const data = input();
  data.nurses.push(makeNurse('ben', { fullName: 'Ben' }));
  data.sessions = [clinic('a', '09:00', '17:00')];
  const manual = (id: string, nurseId: string, startTime: string, endTime: string): Assignment => ({ id, nurseId, date,
    scheduleId: data.schedule.id, dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: 'a', source: 'MANUAL',
    locked: false, note: 'SHIFT_NOTE_PRIVATE', doctorCoverage: [{ doctorId: 'a', startTime, endTime }] });
  const amy = manual('amy-manual', 'amy', '09:00', '13:00');
  amy.allocationReview = approveAllocation(amy, 'REVIEWER_PRIVATE', 'REVIEW_REASON_PRIVATE', '2026-11-22T04:00:00Z');
  const ben = manual('ben-manual', 'ben', '12:00', '17:00');
  const context = { ...data, availabilityRequests: [] };
  data.assignments = [amy, recordManualDoctorOverlaps(ben, [amy, ben], context, 'OVERLAP_PRIVATE', '2026-11-22T04:00:00Z')];
  const baseline = roundTrip(data.assignments);
  const result = await runSchedulingWorker({ type: 'start', jobId: 'manual', input: data, startedAtMs: schedulingClockMs(), budgetMs: 5000 });
  assert.deepEqual(result.assignments, baseline);
  assert.ok(result.validation.findings.some(f => f.id.startsWith('session-overlap-') && f.severity === 'WARN' && f.amount === 1));
  data.assignments = roundTrip(result.assignments);
  const report = buildRosterAnalysis(exportInput(data));
  assert.equal(report.summary.hours.workedTotal, 16);
  assert.equal(report.review.coverage.uncoveredDoctorMinutes, 0);
  assert.deepEqual(report.days[0].doctorSessions[0].uncovered, []);
  for (const nurse of data.nurses) {
    const doc = personal(data, nurse.id);
    const outputs = [doc, email(data, nurse.id), buildNurseRosterIcs(doc)];
    for (const output of outputs) {
      noPrivateProfileData(output);
      assert.equal(JSON.stringify(output).includes('SHIFT_NOTE_PRIVATE'), false);
      assert.equal(JSON.stringify(output).includes('manualDoctorOverlaps'), false);
      assert.equal(JSON.stringify(output).includes('allocationReview'), false);
    }
    assert.match(email(data, nurse.id).bodyPreview, /Total: 8h/);
    assert.equal((buildNurseRosterIcs(doc).match(/BEGIN:VEVENT/g) || []).length, 1);
  }
  let published: PublicRosterDoc | undefined;
  const tables: Record<string, unknown[]> = { nurses: data.nurses, doctors: data.doctors, dutyWindows: data.dutyWindows,
    seniorityLevels: data.seniorityLevels, clinics: [{ name: 'Test Clinic', timezone: 'Asia/Dubai' }] };
  t.mock.method(repositoryManager, 'getRepo', () => ({ get: async (name: string) => name === 'versions' ? version(data) : data.schedule,
    list: async (name: string) => tables[name] || [], create: async (_name: string, doc: PublicRosterDoc) => { published = roundTrip(doc); return doc; } }) as any);
  await syncPublicRoster({ id: 'share', token: 'token', scheduleId: data.schedule.id, pointsToVersionId: 'published',
    role: 'VIEWER', createdAt: '2026-11-22T04:00:00Z', public: true, revoked: false, allowedEmails: [] });
  assert.equal(published!.version.snapshot.assignments.length, 2);
  assert.equal(JSON.stringify(published).includes('manualDoctorOverlaps'), false);
  assert.equal(JSON.stringify(published).includes('allocationReview'), false);
  assert.equal(JSON.stringify(published).includes('SHIFT_NOTE_PRIVATE'), false);
  noPrivateProfileData(published);
});
