import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTeamRosterSheet, syncNurseRosters, buildNurseRosterDoc, todayIso, addDaysIso } from '../../src/services/publish/nurseRosterService';
import { buildNurseRosterIcs } from '../../src/services/export/icsExportService';
import { makeNurse, makeSchedule, DAY_DUTY } from './fixtures';
import type { ScheduleVersion, Assignment } from '../../src/types';

const today = todayIso('Asia/Dubai');
const schedule = makeSchedule({ startDate: today, endDate: addDaysIso(today, 6) });
const nurses = [makeNurse('n1', { fullName: 'Amy', gmail: 'private@example.org', notes: 'Private profile' }), makeNurse('n2', { fullName: 'Bea' })];
const assignment = (nurseId: string, date: string, id = nurseId): Assignment => ({ id, nurseId, date, scheduleId: schedule.id, dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: 'doc1', source: 'MANUAL', locked: false, note: 'Private assignment note' });
const published: ScheduleVersion = { id: 'v1', scheduleId: schedule.id, number: 1, timestamp: '2026-10-01', author: 'Planner', note: 'Private version note', isPublished: true,
  snapshot: { schedule, assignments: [assignment('n1', schedule.startDate), assignment('n2', schedule.startDate)], leaveEntries: [{ id: 'l1', nurseId: 'n2', startDate: schedule.startDate, endDate: schedule.startDate, leaveTypeId: 'SICK_PRIVATE', approved: true, hoursCredited: 8 }], locks: [], rulesSnapshot: [] } };
const refs = { nurses, dutyWindows: [DAY_DUTY], doctors: [{ id: 'doc1', fullName: 'Dr Amal', gmail: 'doctor@example.org' }], clinicalRoles: [], specialties: [] };

test('team sheets contain published shifts and generic leave, with no private staff data', () => {
  const sheet = buildTeamRosterSheet({ ...refs, schedule, version: published });
  assert.equal(sheet.nurses.length, 2);
  assert.equal(sheet.nurses[0].cells[0].detail, 'With Dr Amal');
  assert.deepEqual(sheet.nurses[1].cells, [{ date: schedule.startDate, leave: true }]);
  const text = JSON.stringify(sheet);
  for (const secret of ['private@example.org', 'doctor@example.org', 'Private profile', 'Private assignment note', 'SICK_PRIVATE', 'Private version note']) assert.equal(text.includes(secret), false);
});

test('team sheet uses published dates even after draft dates change', () => {
  const sheet = buildTeamRosterSheet({ ...refs, schedule: { ...schedule, startDate: '2030-01-01' }, version: published });
  assert.equal(sheet.startDate, schedule.startDate);
  assert.equal(sheet.nurses[0].cells.length, 1);
});

test('personal calendar does not include teammates and suppresses shifts on leave days', () => {
  const teamRosters = [buildTeamRosterSheet({ ...refs, schedule, version: published })];
  const doc = buildNurseRosterDoc({ ...refs, nurse: nurses[1], token: 'nr_test', schedules: [schedule], versions: [published], today: schedule.startDate, teamRosters });
  assert.equal(doc.shifts.length, 0);
  assert.deepEqual(doc.leaveDays, [schedule.startDate]);
  assert.equal(buildNurseRosterIcs(doc).includes('Dr Amal'), false);
});

test('publishing refreshes old nurse links with the new team snapshot despite a stale version cache', async () => {
  const saved: any[] = [];
  const draft = { ...published, id: 'draft', number: 99, isPublished: false, snapshot: { ...published.snapshot, assignments: [assignment('n2', '2026-10-09', 'draft-only')] } };
  const data: Record<string, any[]> = { ...refs, schedules: [schedule], versions: [draft], nurseLinks: nurses.map(n => ({ id: n.id, nurseId: n.id, token: `nr_${n.id}`, revoked: false })), clinics: [{ name: 'Clinic', timezone: 'Asia/Dubai', weekendDays: [5, 6] }] };
  const repo = { list: async (name: string) => data[name] || [], create: async (_name: string, doc: any) => { saved.push(doc); return doc; } };
  const result = await syncNurseRosters(repo as any, undefined, [published]);
  assert.equal(result.synced, 2);
  assert.equal(result.failed.length, 0);
  assert.equal(saved[0].teamRosters[0].version, 1);
  assert.deepEqual(saved[0].teamRosters[0].weekendDays, [5, 6]);
  assert.equal(saved[0].teamRosters[0].nurses[1].cells.some((c: any) => c.date === '2026-10-09'), false);
  assert.equal(saved[1].shifts.length, 0);
});
