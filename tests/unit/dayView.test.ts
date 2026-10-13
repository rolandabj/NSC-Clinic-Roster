import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayViewOf, firstDayShown, isPhoneSize } from '../../src/components/roster/dayView';
import { cellLookupsOf, cellSummary, cellViewOf } from '../../src/components/workbook/grid/cellView';
import { ANNUAL_LEAVE, DAY_DUTY, makeLeave, makeNurse } from './fixtures';
import type { Assignment, Doctor } from '../../src/types';
import type { ValidationFinding } from '../../src/services/validation/ScheduleValidator';

// The roster on a phone (UI overhaul Phase 4, slice 5): a read only view of one day at a time,
// with each nurse's shift in words, the day's problems, and a note that changes need a laptop
// or tablet. A phone is a screen under 700 px wide or under 500 px high, so a phone held either
// way; a tablet edits the roster held upright or sideways (the owner's decision of 13-10-2026).

test('a phone is under 700 px wide or under 500 px high; tablets and laptops are not phones', () => {
  assert.equal(isPhoneSize(390, 844), true, 'a phone held upright');
  assert.equal(isPhoneSize(844, 390), true, 'a phone held sideways');
  assert.equal(isPhoneSize(744, 1133), false, 'the smallest iPad held upright');
  assert.equal(isPhoneSize(1024, 768), false, 'a tablet held sideways');
  assert.equal(isPhoneSize(1366, 768), false, 'a laptop');
});

test('the day shown first: the linked day, else today, else the first day of the roster', () => {
  const dates = ['2026-11-16', '2026-11-17', '2026-11-18'];
  assert.equal(firstDayShown(dates, '2026-11-17', '2026-11-18'), '2026-11-18');
  assert.equal(firstDayShown(dates, '2026-11-17'), '2026-11-17');
  assert.equal(firstDayShown(dates, '2026-12-25'), '2026-11-16');
  assert.equal(firstDayShown(dates, '2026-11-17', '2027-01-01'), '2026-11-17', 'a link to a day outside the roster');
});

const LEE = { id: 'lee', fullName: 'Dr Lee', specialtyIds: [] } as unknown as Doctor;
const lookups = cellLookupsOf({ dutyWindows: [DAY_DUTY], doctors: [LEE], roles: [], specialties: [], leaveTypes: [ANNUAL_LEAVE] });
const amy = makeNurse('amy', { fullName: 'Amy', preferences: [{ kind: 'DOCTOR', refId: 'lee', rank: 1 }] });
const mary = makeNurse('mary', { fullName: 'Mary' });
const nina = makeNurse('nina', { fullName: 'Nina' });
const shift = { id: 'a1', scheduleId: 's', nurseId: 'amy', date: '2026-11-17', dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: 'lee', source: 'GENERATED', locked: false } as Assignment;
const finding = (id: string, severity: 'ERROR' | 'WARN' | 'INFO', message: string, extra: Partial<ValidationFinding> = {}) =>
  ({ id, category: 'COVERAGE_GAP', severity, message, affectedNurseIds: [], cellRefs: [], ...extra }) as ValidationFinding;

test("a cell's summary is the start of its spoken name, with \"to\" between the times", () => {
  const v = cellViewOf({ nurse: amy, day: { dateStr: '2026-11-17', isWeekend: false, isToday: false }, assignment: shift, problems: [] }, lookups);
  assert.equal(cellSummary(v), 'Lee #1 09:00 to 17:00, Day shift');
});

test("the day view lists each nurse's day in words, and the day's problems, Must fix first", () => {
  const day = dayViewOf('2026-11-17', {
    nurses: [amy, mary, nina],
    assignments: [shift],
    leaveEntries: [makeLeave({ nurseId: 'mary', startDate: '2026-11-17', endDate: '2026-11-17' })],
    locks: [],
    availabilityRequests: [],
    holidays: [],
    lookups,
    findings: [
      finding('gap', 'WARN', 'No free nurse from 17:00', { date: '2026-11-17' }),
      finding('rest', 'ERROR', 'Amy has too little rest', { cellRefs: [{ nurseId: 'amy', date: '2026-11-17' }] }),
      finding('other', 'ERROR', 'Another day', { date: '2026-11-18' }),
      finding('note', 'INFO', 'A request was not followed', { date: '2026-11-17' }),
    ],
    today: '2026-10-13',
  });
  assert.deepEqual(
    day.rows.map((r) => `${r.name}: ${r.summary}`),
    ['Amy: Lee #1 09:00 to 17:00, Day shift', 'Mary: AL, Annual Leave: 8 hours counted on this day', 'Nina: No shift']
  );
  assert.equal(day.rows[0].problemKind, 'must', "Amy's cell has a Must fix");
  assert.deepEqual(
    day.problems.map((p) => `${p.kind}: ${p.message}`),
    ['must: Amy has too little rest', 'check: No free nurse from 17:00', 'note: A request was not followed']
  );
});

// Checkpoint 4 review: a name with an initial ("Ahmed H.") cut the words short, and the phone
// marked every nurse on duty with a problem about the whole day, which the grid shows only on
// the day's heading.

test('a doctor name with an initial keeps the whole summary', () => {
  const two = cellLookupsOf({
    dutyWindows: [DAY_DUTY],
    doctors: [{ id: 'a', fullName: 'Dr Ahmed Hashimi', specialtyIds: [] }, { id: 'b', fullName: 'Dr Ahmed Khan', specialtyIds: [] }] as unknown as Doctor[],
    roles: [],
    specialties: [],
    leaveTypes: [],
  });
  const v = cellViewOf({ nurse: mary, day: { dateStr: '2026-11-17', isWeekend: false, isToday: false }, assignment: { ...shift, nurseId: 'mary', doctorId: 'a' }, problems: [] }, two);
  assert.equal(cellSummary(v), 'Ahmed H. Pool 09:00 to 17:00, Day shift');
});

test('problems about the whole day are listed for the day, not marked on each nurse', () => {
  const day = dayViewOf('2026-11-17', {
    nurses: [amy],
    assignments: [shift],
    leaveEntries: [],
    locks: [],
    holidays: [],
    lookups,
    findings: [finding('cov-gap-2026-11-17-14', 'ERROR', 'No free nurse from 14:00', { date: '2026-11-17', cellRefs: [{ nurseId: 'amy', date: '2026-11-17' }] })],
    today: '2026-10-13',
  });
  assert.equal(day.rows[0].problemKind, 'none');
  assert.deepEqual(day.problems.map((p) => p.message), ['No free nurse from 14:00']);
});

