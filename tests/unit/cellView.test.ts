import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cellLookupsOf, cellViewOf, reuseCellViews, shortDoctorNames, type CellDay, type CellFacts, type CellView } from '../../src/components/workbook/grid/cellView';
import { ANNUAL_LEAVE, DAY_DUTY, makeLeave, makeLock, makeNurse } from './fixtures';
import type { Assignment, AvailabilityRequest, ClinicalRole, Doctor, Specialty } from '../../src/types';

// What each roster grid cell shows, worked out once per change (UI overhaul Phase 3, slice 1),
// so a cell is drawn again only when what it shows has changed. Phase 4, slice 4: the doctor or
// role on the first line and the start time on the second, short doctor names, the problem's
// kind, and a spoken name that starts with what the cell shows.

const LEE = { id: 'doc-lee', fullName: 'Dr Lee', specialtyIds: ['spec-card'] } as Doctor;
const RAY = { id: 'doc-ray', fullName: 'Ray', specialtyIds: ['spec-ent'] } as Doctor;
const CARDIOLOGY = { id: 'spec-card', code: 'CARD', name: 'Cardiology' } as Specialty;
const ENT = { id: 'spec-ent', code: 'ENT', name: 'Ear, nose and throat' } as Specialty;
const NURSE_CLINIC = { id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC' } as ClinicalRole;

const lookups = cellLookupsOf({
  dutyWindows: [DAY_DUTY],
  doctors: [LEE, RAY],
  roles: [NURSE_CLINIC],
  specialties: [CARDIOLOGY, ENT],
  leaveTypes: [ANNUAL_LEAVE],
});

// Amy's list names Dr Lee first and no department.
const amy = makeNurse('n1', {
  fullName: 'Amy Khan',
  preferences: [{ kind: 'DOCTOR', refId: LEE.id, rank: 1 }],
});
const TUESDAY: CellDay = { dateStr: '2026-10-06', isWeekend: false, isToday: false };

function shift(extra: Partial<Assignment> = {}): Assignment {
  return {
    id: 'a1',
    scheduleId: 's1',
    nurseId: 'n1',
    date: '2026-10-06',
    dutyWindowId: DAY_DUTY.id,
    kind: 'DOCTOR',
    doctorId: LEE.id,
    locked: false,
    source: 'MANUAL',
    ...extra,
  } as Assignment;
}

function view(facts: Partial<CellFacts> = {}, day = TUESDAY, nurse = amy): CellView {
  return cellViewOf({ nurse, day, problems: [], ...facts }, lookups);
}

test('an empty cell is read as "No shift", then the nurse and the day', () => {
  const v = view();
  assert.equal(v.key, 'n1|2026-10-06');
  assert.equal(v.content, 'empty');
  assert.equal(v.title, 'Nothing yet');
  assert.equal(v.ariaLabel, 'No shift. Amy Khan, Tue 06-10-2026');
  assert.equal(v.hasProblems, false);
  assert.equal(v.problemKind, 'none');
});

test('doctors get short names: the name without "Dr", or the surname when that is long', () => {
  const names = shortDoctorNames([
    { id: 'a', fullName: 'Dr Lee' },
    { id: 'b', fullName: 'Ray' },
    { id: 'c', fullName: 'Dr Doctor 12' },
    { id: 'd', fullName: 'Dr Ahmed Al Hashimi' },
    { id: 'e', fullName: 'Dr. Sara Al Hashimi' },
    { id: 'f', fullName: 'Dr Mariam Siddiqui' },
  ] as Doctor[]);
  assert.deepEqual(Object.fromEntries(names), { a: 'Lee', b: 'Ray', c: 'Doctor 12', d: 'A. Hashimi', e: 'S. Hashimi', f: 'Siddiqui' });
});

test('a shift shows the doctor and "#1" on the first line, the start time on the second, and is read in that order', () => {
  const v = view({ assignment: shift() });
  assert.equal(v.content, 'shift');
  assert.equal(v.dutyAcronym, 'D');
  assert.equal(v.color, DAY_DUTY.color);
  assert.equal(v.label, 'Lee');
  assert.equal(v.rankBadge, '#1');
  assert.equal(v.startTime, '09:00');
  assert.equal(v.mismatch, false);
  assert.equal(v.handChange, true);
  assert.equal(v.ariaLabel, 'Lee #1 09:00 to 17:00, Day shift. Amy Khan, Tue 06-10-2026. With Dr Lee (usual doctor, choice 1). Changed by hand');
});

test('a doctor outside the nurse\'s list is marked "!" with the reason', () => {
  const v = view({ assignment: shift({ doctorId: RAY.id, source: 'GENERATED' }) });
  assert.equal(v.mismatch, true);
  assert.equal(v.rankBadge, '!');
  assert.equal(v.handChange, false);
  assert.equal(
    v.title,
    'Day shift (09:00 to 17:00) · With Dr Ray (not one of this nurse’s usual doctors) · Filled in by Fill roster\n' +
      'Dr Ray is not one of Amy Khan\'s usual doctors or departments.'
  );
});

test('a Nurse Clinic shift shows NC', () => {
  const v = view({ assignment: shift({ kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: NURSE_CLINIC.id }) });
  assert.equal(v.isNurseClinic, true);
  assert.equal(v.label, 'NC');
  assert.equal(v.rankBadge, null);
  assert.match(v.ariaLabel, /^NC 09:00 to 17:00, Day shift\. .*Nurse Clinic \(no doctor\)/);
});

test('a float shift shows Float', () => {
  const v = view({ assignment: shift({ kind: 'CLINICAL_ROLE', doctorId: undefined, clinicalRoleId: 'role-float' }) });
  assert.equal(v.isFloatPool, true);
  assert.equal(v.label, 'Float');
  assert.match(v.ariaLabel, /Float \(not with a doctor\)/);
});

test('approved leave that is pinned shows its letters, its hours and the pin', () => {
  const leave = makeLeave({ startDate: '2026-10-06', endDate: '2026-10-06' });
  const v = view({ leave, lock: makeLock('n1', '2026-10-06') });
  assert.equal(v.content, 'leave');
  assert.equal(v.leaveAcronym, 'AL');
  assert.equal(v.color, ANNUAL_LEAVE.color);
  assert.equal(v.pinned, true);
  assert.equal(v.title, 'Annual Leave: 8 h counted this day, pinned');
  assert.equal(v.ariaLabel, 'AL, Annual Leave: 8 hours counted on this day. Amy Khan, Tue 06-10-2026. Pinned');
});

test('a pinned day off says so', () => {
  const v = view({ lock: makeLock('n1', '2026-10-06', { mode: 'OFF' }) });
  assert.equal(v.content, 'off');
  assert.equal(v.title, 'Day off, pinned');
  assert.equal(v.ariaLabel, 'Day off. Amy Khan, Tue 06-10-2026. Pinned');
});

test('leave waiting for approval shows lighter on an empty cell, and as a clock under a shift', () => {
  const pendingLeave = makeLeave({ startDate: '2026-10-06', endDate: '2026-10-06', approved: false, status: 'PENDING' });
  const empty = view({ pendingLeave });
  assert.equal(empty.content, 'pendingLeave');
  assert.equal(empty.pendingLeaveAcronym, 'AL');
  assert.equal(empty.pendingMark, false);
  assert.equal(empty.title, 'Nothing yet\nLeave asked for, waiting for approval: Annual Leave');
  assert.equal(empty.ariaLabel, 'AL, leave asked for, waiting for approval. Amy Khan, Tue 06-10-2026. Leave asked for, waiting for approval: Annual Leave');

  const underShift = view({ pendingLeave, assignment: shift() });
  assert.equal(underShift.content, 'shift');
  assert.equal(underShift.pendingMark, true);
  assert.equal(underShift.pendingLeaveColor, ANNUAL_LEAVE.color);
  assert.equal(underShift.color, DAY_DUTY.color);
});

test('a day off request on a day with a shift is marked as not followed', () => {
  const request = { id: 'r1', nurseId: 'n1', date: '2026-10-06', available: false, status: 'APPROVED' } as AvailabilityRequest;
  const v = view({ request, assignment: shift() });
  assert.equal(v.requestMark, 'dayOff');
  assert.equal(v.requestMismatch, true);
  assert.equal(v.requestPending, false);
  assert.match(v.ariaLabel, /\. Asked for this day off, has Day$/);
});

test('problems are listed in the tooltip and read out last, with their kind', () => {
  const v = view({ assignment: shift(), problems: ['Too little rest', 'Over the hours limit'], problemsMustFix: true });
  assert.equal(v.hasProblems, true);
  assert.equal(v.problemKind, 'must');
  assert.match(v.title, /\nProblems:\n• Too little rest\n• Over the hours limit$/);
  assert.match(v.ariaLabel, /\. Must fix: Too little rest\. Over the hours limit$/);
  const check = view({ problems: ['One'] });
  assert.equal(check.problemKind, 'check');
  assert.equal(check.ariaLabel, 'No shift. Amy Khan, Tue 06-10-2026. Check: One');
});

test('the day is named and shaded: today, a public holiday, a weekend', () => {
  assert.match(view({}, { ...TUESDAY, isToday: true }).ariaLabel, /Tue 06-10-2026 \(today\)$/);
  const holiday = view({}, { ...TUESDAY, holiday: { name: 'National Day' } });
  assert.match(holiday.ariaLabel, /\(public holiday: National Day\)/);
  assert.equal(holiday.dayShade, 'bg-cyan-50');
  const weekend = view({}, { ...TUESDAY, isWeekend: true });
  assert.match(weekend.ariaLabel, /\(weekend\)/);
  assert.equal(weekend.dayShade, 'bg-slate-100');
  assert.equal(view().dayShade, '');
});

test('views that did not change are kept as the same objects, so their cells are not drawn again', () => {
  const before = new Map([
    ['n1|2026-10-06', view({ assignment: shift() })],
    ['n1|2026-10-07', view({}, { ...TUESDAY, dateStr: '2026-10-07' })],
  ]);
  const after = new Map([
    ['n1|2026-10-06', view({ assignment: shift() })],
    ['n1|2026-10-07', view({ assignment: shift({ date: '2026-10-07' }) }, { ...TUESDAY, dateStr: '2026-10-07' })],
  ]);
  const kept = reuseCellViews(before, after);
  assert.equal(kept.get('n1|2026-10-06'), before.get('n1|2026-10-06'));
  assert.notEqual(kept.get('n1|2026-10-07'), before.get('n1|2026-10-07'));
  assert.equal(kept.get('n1|2026-10-07')?.content, 'shift');
  assert.equal(reuseCellViews(undefined, after), after);
});
