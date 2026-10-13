import { test } from 'node:test';
import assert from 'node:assert/strict';
import { myShiftDays } from '../../src/services/publish/myShifts';
import type { NurseRosterDoc, NurseRosterShift } from '../../src/types';

// A nurse's own page on a phone (UI overhaul Phase 5, slice 1): the next shift first, then the
// days coming up as cards, and the days before today kept behind a button.

const shift = (date: string, startTime = '09:00'): NurseRosterShift => ({
  date,
  startTime,
  endTime: '17:00',
  acronym: 'D',
  shiftName: 'Day',
  detail: 'With Dr Lee',
  scheduleName: 'November',
});
const doc = (shifts: NurseRosterShift[], leaveDays: string[] = []) => ({ shifts, leaveDays }) as unknown as NurseRosterDoc;

test('the next shift is the first one from today, the rest come up in order, earlier days are kept apart', () => {
  const days = myShiftDays(doc([shift('2026-11-20'), shift('2026-11-16'), shift('2026-11-18')], ['2026-11-19']), '2026-11-17');
  assert.equal(days.next?.date, '2026-11-18');
  assert.deepEqual(days.comingUp.map((d) => `${d.date}${d.leave ? ' leave' : ''}`), ['2026-11-19 leave', '2026-11-20']);
  assert.deepEqual(days.earlier.map((d) => d.date), ['2026-11-16']);
});

test("today's shift is the next one, and two shifts on one day stay together, earliest first", () => {
  const days = myShiftDays(doc([shift('2026-11-17', '14:00'), shift('2026-11-17', '07:00')]), '2026-11-17');
  assert.equal(days.next?.date, '2026-11-17');
  assert.deepEqual(days.next?.shifts.map((s) => s.startTime), ['07:00', '14:00']);
});

test('leave before the next shift is listed, and there may be no next shift at all', () => {
  const onlyLeave = myShiftDays(doc([], ['2026-11-18']), '2026-11-17');
  assert.equal(onlyLeave.next, undefined);
  assert.deepEqual(onlyLeave.comingUp.map((d) => d.date), ['2026-11-18']);
  const nothing = myShiftDays(doc([]), '2026-11-17');
  assert.equal(nothing.next, undefined);
  assert.deepEqual(nothing.comingUp, []);
});
