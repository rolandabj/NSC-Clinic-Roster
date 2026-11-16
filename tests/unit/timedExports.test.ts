import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as XLSX from 'xlsx';
import { buildRosterAnalysis, type RosterAnalysisInput } from '../../src/services/export/analysisExportService';
import { exportRosterToCsvLong, exportRosterToCsvMatrix, exportRosterToExcel, type RosterExportOptions } from '../../src/services/export/rosterExportService';
import { exportRosterToPdf } from '../../src/services/export/rosterPdfService';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Doctor, DoctorSession } from '../../src/types';

const date = '2026-11-22';
const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 });
const doctors = ['one', 'two'].map(id => ({ id, fullName: id === 'one' ? 'Dr Alpha' : 'Dr Beta', active: true,
  lowAcuity: true, specialtyIds: [], weeklyPattern: [] } as Doctor));
const sessions = doctors.map(d => ({ id: d.id, doctorId: d.id, date, startTime: '09:00', endTime: '17:00', cancelled: false, source: 'MANUAL' } as DoctorSession));
const nurses = [makeNurse('amy', { fullName: 'Alice' }), makeNurse('ben', { fullName: 'Ben' })];
const pair: Assignment = { id: 'pair', scheduleId: schedule.id, nurseId: 'amy', date, dutyWindowId: DAY_DUTY.id,
  kind: 'DOCTOR', doctorId: 'one', secondDoctorId: 'two', source: 'MANUAL', locked: false };
const cover = (doctorId: string, startTime: string, endTime: string) => ({ doctorId, startTime, endTime });
const timed = (assignment: Assignment, doctorCoverage: unknown): Assignment => ({ ...assignment, doctorCoverage } as Assignment);
const data = (assignments: Assignment[], clinics = sessions): RosterAnalysisInput => ({ clinicName: 'Test Clinic', schedule, assignments, nurses,
  doctors, sessions: clinics, dutyWindows: [DAY_DUTY], seniorityLevels: [SENIOR], roles: [], specialties: [], leaveEntries: [],
  leaveTypes: [], locks: [], rules: hoursOnlyRules(), availabilityRequests: [], clinicSetup: { openTime: '09:00', closeTime: '17:00' }, exportedAt: '2026-11-16T12:00:00Z' });
const exportData = (assignments: Assignment[], clinics = sessions): RosterExportOptions => data(assignments, clinics);
const report = (assignments: Assignment[], clinics = sessions) => buildRosterAnalysis(data(assignments, clinics)) as any;
const rowsOf = (csv: string): any[][] => XLSX.utils.sheet_to_json(XLSX.read(csv, { type: 'string', raw: true }).Sheets.Sheet1, { header: 1, raw: true });
const handover = () => [timed({ ...pair, secondDoctorId: undefined }, [cover('one', '09:00', '13:15')]),
  timed({ ...pair, id: 'handover', nurseId: 'ben', secondDoctorId: undefined }, [cover('one', '13:15', '17:00')])];

test('analysis uses explicit doctor interval unions and leaves duty hours counted once', () => {
  const a = report([timed(pair, [cover('one', '09:00', '17:00'), cover('two', '13:15', '17:00')])]);
  assert.equal(a.shifts[0].hours, 8);
  assert.equal(a.shifts[0].busyMinutes, 480);
  assert.equal(a.shifts[0].floatMinutes, 0);
  assert.equal(a.days[0].doctorSessions[1].nurses[0].coveredMinutes, 225);
  assert.deepEqual(a.days[0].doctorSessions[1].uncovered, [{ start: '09:00', end: '13:15' }]);
});
test('sequential clinics touching at 19:00 retain their own times and one duty total', () => {
  const longDuty = { ...DAY_DUTY, endTime: '21:00' };
  const clinics = [{ ...sessions[0], endTime: '19:00' }, { ...sessions[1], startTime: '19:00', endTime: '21:00' }];
  const input = { ...data([timed(pair, [cover('one', '09:00', '19:00'), cover('two', '19:00', '21:00')])], clinics), dutyWindows: [longDuty] };
  const a = buildRosterAnalysis(input) as any;
  assert.equal(a.shifts[0].hours, 12);
  assert.equal(a.shifts[0].busyMinutes, 720);
  assert.equal(a.days[0].doctorSessions[0].nurses[0].coveredMinutes, 600);
  assert.equal(a.days[0].doctorSessions[1].nurses[0].coveredMinutes, 120);
  assert.deepEqual(a.days[0].doctorSessions[1].uncovered, []);
});
test('analysis derives partial Float intervals without changing whole Float shift flags or counts', () => {
  const a = report([timed({ ...pair, secondDoctorId: undefined }, [cover('one', '09:00', '13:15')])], [sessions[0]]);
  assert.equal(a.shifts[0].float, false);
  assert.equal(a.nurses[0].counts.floatShifts, 0);
  assert.equal(a.shifts[0].floatMinutes, 225);
  assert.deepEqual(a.shifts[0].freeIntervals, [{ startTime: '13:15', endTime: '17:00' }]);
  assert.equal(a.days[0].floatMinutes, 225);
  assert.equal(a.days[0].doctorBusyMinutes, 255);
});
test('explicit empty or invalid timing never falls back to legacy whole duty doctor coverage', () => {
  for (const ranges of [[], [cover('unknown', '09:00', '17:00')], [cover('one', 'bad', '17:00')]]) {
    const a = report([timed({ ...pair, secondDoctorId: undefined }, ranges)], [sessions[0]]);
    assert.deepEqual(a.shifts[0].effectiveDoctorCoverage, []);
    assert.equal(a.shifts[0].floatMinutes, 0);
    assert.deepEqual(a.days[0].doctorSessions[0].uncovered, [{ start: '09:00', end: '17:00' }]);
  }
});
test('analysis whitelists timed fields, preserves input and omits profile private data', () => {
  const source = data([timed({ ...pair, secondDoctorId: undefined }, [{ ...cover('one', '09:00', '13:15'), reviewer: 'private-reviewer', gmail: 'private@example.com' }])], [sessions[0]]);
  const before = JSON.stringify(source);
  const a = buildRosterAnalysis(source) as any;
  assert.equal(JSON.stringify(source), before);
  assert.deepEqual(a.shifts[0].doctorCoverage, [cover('one', '09:00', '13:15')]);
  assert.ok(!JSON.stringify(a).includes('private-reviewer'));
  assert.ok(!JSON.stringify(a).includes('private@example.com'));
});
test('legacy absence retains whole duty coverage and CSV matrix cell text', () => {
  const single = { ...pair, secondDoctorId: undefined };
  const a = report([single], [sessions[0]]);
  assert.equal(a.days[0].doctorSessions[0].nurses[0].coveredMinutes, 480);
  assert.equal(a.shifts[0].doctorCoverage, undefined);
  assert.equal(rowsOf(exportRosterToCsvMatrix(exportData([single], [sessions[0]])))[1][3], 'D-Alpha');
});
test('CSV keeps one duty row and escapes readable timed names without splitting or doubling hours', () => {
  const input = exportData([timed(pair, [cover('one', '09:00', '13:15'), cover('two', '13:15', '17:00')])]);
  input.doctors = [{ ...doctors[0], fullName: 'Dr "Alpha", East\nClinic' }, doctors[1]];
  const csv = exportRosterToCsvLong(input);
  const rows = rowsOf(csv);
  assert.equal(rows.length, 2);
  assert.equal(Number(rows[1][7]), 8);
  assert.ok(csv.includes('Dr ""Alpha"", East\nClinic'));
  assert.ok(rows[1].some((cell: unknown) => typeof cell === 'string' && cell.includes('13:15') && cell.includes('Dr Beta')));
  const matrix = rowsOf(exportRosterToCsvMatrix(input));
  assert.ok(matrix[1][3].includes('13:15'));
});
test('Excel doctor sheet includes every timed handover nurse and duty row hours once', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'nsc-timed-excel-'));
  const previous = process.cwd();
  try {
    process.chdir(folder);
    const workbook = await exportRosterToExcel(exportData(handover(), [sessions[0]]));
    const doctorRows = XLSX.utils.sheet_to_json(workbook.Sheets.Doctors, { header: 1 }) as any[][];
    const text = doctorRows.flat().join('\n');
    assert.match(text, /Alice.*09:00 to 13:15/s);
    assert.match(text, /Ben.*13:15 to 17:00/s);
    const longRows = XLSX.utils.sheet_to_json(workbook.Sheets.Long, { header: 1 }) as any[][];
    assert.equal(longRows.length, 3);
    assert.equal(Number(longRows[1][10]), 8);
  } finally { process.chdir(previous); await rm(folder, { recursive: true, force: true }); }
});
test('PDF bytes contain the actual handover boundary and both nurses', async () => {
  const output = await exportRosterToPdf({ ...exportData(handover(), [sessions[0]]), includeNurses: false, output: 'bytes' });
  assert.ok(output instanceof ArrayBuffer);
  const text = Buffer.from(output!).toString('latin1');
  assert.ok(text.startsWith('%PDF-'));
  assert.ok(text.includes('13:15'));
  assert.ok(text.includes('Alice'));
  assert.ok(text.includes('Ben'));
});
test('analysis reports an exact gap between timed handovers instead of the whole duty', () => {
  const assignments = handover();
  assignments[1].doctorCoverage![0].startTime = '14:05';
  const a = report(assignments, [sessions[0]]);
  assert.deepEqual(a.days[0].doctorSessions[0].uncovered, [{ start: '13:15', end: '14:05' }]);
  assert.equal(a.review.coverage.uncoveredDoctorMinutes, 50);
  assert.equal(a.days[0].doctorSessions[0].nurses[1].coveredMinutes, 175);
});
test('Excel doctor cover excludes absent and clinically ineligible nurses', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'nsc-timed-eligibility-'));
  const previous = process.cwd();
  try {
    process.chdir(folder);
    const input = exportData(handover(), [sessions[0]]);
    input.availabilityRequests = [{ id: 'off', nurseId: 'amy', date, available: false, status: 'APPROVED' } as any];
    input.nurses = [nurses[0], { ...nurses[1], doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'planner', reviewedAt: '2026-11-16' } }];
    const workbook = await exportRosterToExcel(input);
    const doctorRows = XLSX.utils.sheet_to_json(workbook.Sheets.Doctors, { header: 1 }) as any[][];
    assert.equal(doctorRows[1][9], 'Unassigned 09:00 to 17:00');
  } finally { process.chdir(previous); await rm(folder, { recursive: true, force: true }); }
});
test('PDF nurse duty includes timed doctor work and remaining Float time', async () => {
  const output = await exportRosterToPdf({ ...exportData([timed({ ...pair, secondDoctorId: undefined },
    [cover('one', '09:00', '13:15')])], [sessions[0]]), includeDoctors: false, output: 'bytes' });
  const text = Buffer.from(output!).toString('latin1');
  assert.ok(text.includes('13:15'));
  assert.ok(text.includes('Float'));
  assert.ok(text.includes('Dr Alpha'));
});
test('analysis keeps pin times without exporting unexpected fields', () => {
  const input = data([timed({ ...pair, secondDoctorId: undefined }, [cover('one', '09:00', '13:15')])], [sessions[0]]);
  input.locks = [{ id: 'pin', nurseId: 'amy', date, mode: 'SHIFT', assignmentKind: 'DOCTOR', targetRefId: 'one',
    dutyWindowId: DAY_DUTY.id, doctorCoverage: [{ ...cover('one', '09:00', '13:15'), reviewedBy: 'private-account' }] } as any];
  const a = buildRosterAnalysis(input);
  assert.deepEqual(a.pinnedDays[0].doctorCoverage, [cover('one', '09:00', '13:15')]);
  assert.ok(!JSON.stringify(a).includes('private-account'));
});
test('dedicated Nurse Clinic free time never becomes Float minutes or a Float shift', () => {
  const a = report([{ ...pair, kind: 'CLINICAL_ROLE', doctorId: undefined, secondDoctorId: undefined,
    clinicalRoleId: 'role-nurse-clinic' }], []);
  assert.deepEqual(a.shifts[0].freeIntervals, [{ startTime: '09:00', endTime: '17:00' }]);
  assert.equal(a.shifts[0].float, false);
  assert.equal(a.shifts[0].floatMinutes, 0);
  assert.equal(a.days[0].floatMinutes, 0);
  assert.equal(a.nurses[0].counts.floatShifts, 0);
});
