import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildNurseRosterDoc,
  formatRosterAsText,
  shiftDetail,
  latestPublishedVersions,
  NURSE_TOKEN_PATTERN,
} from '../../src/services/publish/nurseRosterService';
import { buildNurseRosterIcs } from '../../src/services/export/icsExportService';
import type { Assignment, ScheduleVersion, Schedule, LeaveEntry } from '../../src/types';

const refs = {
  doctors: [
    { id: 'doc-amal', fullName: 'Amal' },
    { id: 'doc-dr', fullName: 'Dr. Omar Saleh' },
  ],
  clinicalRoles: [
    { id: 'role-nurse-clinic', name: 'Nurse Clinic' },
    { id: 'role-phl', name: 'Blood Collection' },
  ],
  specialties: [{ id: 'sp-card', name: 'Cardiology' }],
};

const dutyWindows = [
  { id: 'dw-e', name: 'Early', acronym: 'E', startTime: '09:00', endTime: '17:00' },
  { id: 'dw-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00' },
];

const schedule: Schedule = {
  id: 's1',
  name: 'December',
  startDate: '2026-12-01',
  endDate: '2026-12-31',
  blockWeeks: 4,
  hoursTargetFullTime: 160,
  status: 'PUBLISHED',
  activeVersionNumber: 2,
  createdAt: 'x',
  updatedAt: 'x',
};

function asg(id: string, nurseId: string, date: string, extra: Partial<Assignment> = {}): Assignment {
  return { id, scheduleId: 's1', nurseId, date, dutyWindowId: 'dw-e', kind: 'DOCTOR', locked: false, source: 'MANUAL', ...extra };
}

function version(
  number: number,
  assignments: Assignment[],
  extra: Partial<ScheduleVersion> = {},
  leaveEntries: LeaveEntry[] = []
): ScheduleVersion {
  return {
    id: `v${number}${extra.kind || ''}${extra.isPublished === false ? 'd' : ''}`,
    scheduleId: 's1',
    number,
    timestamp: `2026-11-2${number}T00:00:00Z`,
    author: 'P',
    note: '',
    snapshot: { schedule, assignments, leaveEntries, locks: [], rulesSnapshot: [] },
    isPublished: true,
    ...extra,
  };
}

const base = {
  token: 'nr_00000000-0000-4000-8000-000000000000',
  nurse: { id: 'n1', fullName: 'Fatma Ali' },
  clinic: { name: 'Al Shifa', timezone: 'Asia/Dubai' },
  schedules: [schedule],
  dutyWindows,
  today: '2026-12-01',
  nowIso: '2026-12-01T00:00:00Z',
  ...refs,
};

test('shift wording is plain', () => {
  assert.equal(shiftDetail({ doctorId: 'doc-amal' }, refs), 'With Dr Amal');
  assert.equal(shiftDetail({ doctorId: 'doc-dr' }, refs), 'With Dr. Omar Saleh');
  assert.equal(shiftDetail({ clinicalRoleId: 'role-nurse-clinic' }, refs), 'Nurse Clinic');
  assert.equal(shiftDetail({ clinicalRoleId: 'role-phl' }, refs), 'Blood Collection');
  assert.equal(shiftDetail({ specialtyId: 'sp-card' }, refs), 'Department: Cardiology');
  assert.equal(shiftDetail({}, refs), 'General Pool');
});

test('only her shifts, from the latest published version', () => {
  const v1 = version(1, [asg('a1', 'n1', '2026-12-01', { doctorId: 'doc-amal' }), asg('a2', 'n1', '2026-12-02')]);
  const v2 = version(2, [
    asg('a1', 'n1', '2026-12-01', { doctorId: 'doc-amal' }),
    asg('a3', 'n2', '2026-12-01', { clinicalRoleId: 'role-phl' }),
    asg('a4', 'n1', '2026-12-03', { dutyWindowId: 'dw-l', specialtyId: 'sp-card', kind: 'SPECIALTY' }),
  ]);
  const draft = version(3, [asg('a9', 'n1', '2026-12-09')], { isPublished: false });
  const backup = version(4, [asg('a8', 'n1', '2026-12-08')], { kind: 'BACKUP' });

  const doc = buildNurseRosterDoc({ ...base, versions: [v1, draft, v2, backup] });
  assert.deepEqual(
    doc.shifts.map((s) => [s.date, s.acronym, s.detail]),
    [
      ['2026-12-01', 'E', 'With Dr Amal'],
      ['2026-12-03', 'L', 'Department: Cardiology'],
    ]
  );
  assert.equal(doc.id, base.token);
  assert.equal(doc.nurseName, 'Fatma Ali');
  assert.equal(doc.clinicName, 'Al Shifa');
  assert.equal(doc.timezone, 'Asia/Dubai');
  assert.equal(doc.revoked, false);
  assert.equal(doc.shifts[0].scheduleName, 'December');
  assert.equal(latestPublishedVersions([v1, draft, v2, backup]).get('s1')?.id, v2.id);
});

test('a roster with no published version shows nothing', () => {
  const doc = buildNurseRosterDoc({ ...base, versions: [version(1, [asg('a1', 'n1', '2026-12-01')], { isPublished: false })] });
  assert.equal(doc.shifts.length, 0);
});

test('leave is plain days, approved only, clipped to the roster and the last 31 days', () => {
  const leave: LeaveEntry[] = [
    { id: 'l1', nurseId: 'n1', leaveTypeId: 'sick', startDate: '2026-12-30', endDate: '2027-01-02', approved: true, hoursCredited: 8 },
    { id: 'l2', nurseId: 'n1', leaveTypeId: 'al', startDate: '2026-12-10', endDate: '2026-12-10', approved: false, hoursCredited: 8 },
    { id: 'l3', nurseId: 'n2', leaveTypeId: 'al', startDate: '2026-12-11', endDate: '2026-12-11', approved: true, hoursCredited: 8 },
  ];
  const doc = buildNurseRosterDoc({ ...base, versions: [version(1, [], {}, leave)] });
  assert.deepEqual(doc.leaveDays, ['2026-12-30', '2026-12-31']);
  assert.equal(JSON.stringify(doc).includes('sick'), false);

  // Rosters that ended more than 31 days ago are left out.
  const later = buildNurseRosterDoc({ ...base, today: '2027-02-15', versions: [version(1, [asg('a1', 'n1', '2026-12-01')], {}, leave)] });
  assert.equal(later.shifts.length, 0);
  assert.equal(later.leaveDays.length, 0);
});

test('copy as text reads well in WhatsApp', () => {
  const text = formatRosterAsText(
    {
      nurseName: 'Fatma Ali',
      shifts: [
        { date: '2026-11-30', startTime: '09:00', endTime: '17:00', acronym: 'E', shiftName: 'Early', detail: 'Nurse Clinic', scheduleName: 'x' },
        { date: '2026-12-01', startTime: '09:00', endTime: '17:00', acronym: 'E', shiftName: 'Early', detail: 'With Dr Amal', scheduleName: 'x' },
        { date: '2026-12-03', startTime: '13:00', endTime: '21:00', acronym: 'L', shiftName: 'Late', detail: 'Nurse Clinic', scheduleName: 'x' },
      ],
      leaveDays: ['2026-12-02'],
    },
    '2026-12-01'
  );
  assert.equal(
    text,
    'Fatma Ali, shifts\nTue 01-12: E 09:00 to 17:00, with Dr Amal\nWed 02-12: Leave\nThu 03-12: L 13:00 to 21:00, Nurse Clinic'
  );
  assert.equal(formatRosterAsText({ nurseName: 'A', shifts: [], leaveDays: [] }), 'A, shifts\nNo shifts yet');
});

test('calendar feed has stable events in UTC and leave as all day', () => {
  const ics = buildNurseRosterIcs({
    nurseId: 'n1',
    nurseName: 'Fatma Ali',
    clinicName: 'Al Shifa',
    timezone: 'Asia/Dubai',
    shifts: [{ date: '2026-12-01', startTime: '09:00', endTime: '17:00', acronym: 'E', shiftName: 'Early', detail: 'With Dr Amal', scheduleName: 'December' }],
    leaveDays: ['2026-12-31'],
  });
  assert.match(ics, /DTSTART:20261201T050000Z/);
  assert.match(ics, /UID:n1-2026-12-01-0900@clinicroster/);
  assert.match(ics, /DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101/);
  assert.equal(ics.includes('nr_'), false);
});

test('token format is strict', () => {
  assert.ok(NURSE_TOKEN_PATTERN.test('nr_0f8fad5b-d9cb-469f-a165-70867728950e'));
  assert.ok(!NURSE_TOKEN_PATTERN.test('nr_../../x'));
  assert.ok(!NURSE_TOKEN_PATTERN.test('sh_0f8fad5b-d9cb-469f-a165-70867728950e'));
});

test('Firestore REST values become plain JSON', async () => {
  const { fromFirestoreFields } = await import('../../server/services/firestore/firestoreRest');
  const plain = fromFirestoreFields({
    nurseName: { stringValue: 'Fatma' },
    revoked: { booleanValue: false },
    count: { integerValue: '3' },
    leaveDays: { arrayValue: { values: [{ stringValue: '2026-12-02' }] } },
    empty: { arrayValue: {} },
    shifts: { arrayValue: { values: [{ mapValue: { fields: { date: { stringValue: '2026-12-01' }, note: { nullValue: null } } } }] } },
  });
  assert.deepEqual(plain, {
    nurseName: 'Fatma',
    revoked: false,
    count: 3,
    leaveDays: ['2026-12-02'],
    empty: [],
    shifts: [{ date: '2026-12-01', note: null }],
  });
});
