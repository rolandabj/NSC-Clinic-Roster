import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { checkAssignment } from '../../src/services/engine/assignmentChecks';
import { explainNurseDay } from '../../src/services/engine/explainCell';
import { CANONICAL_RULES_SPEC } from '../../src/services/rules/ruleSyncService';
import { weeksOverLimit } from '../../src/services/engine/weekHours';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Rule, WorkingHoursPeriod } from '../../src/types';

// The owner's decision of 2026-10-06: at most 60 h in any 7 days in a row ("must"), on top of
// the hours limit of the period, so catching up never piles into one week.

const LONG = { ...DAY_DUTY, id: 'long', name: 'Long', acronym: 'LD', startTime: '07:00', endTime: '19:00' }; // 12 h, not late
const OCT: WorkingHoursPeriod = { id: 'oct', year: '2026', name: 'Oct19-Nov18', startDate: '2026-10-19', endDate: '2026-11-18', workingHours: 230 };
const day = (i: number) => new Date(Date.UTC(2026, 9, 19 + i)).toISOString().slice(0, 10);
const shift = (nurseId: string, date: string, dutyWindowId = LONG.id, scheduleId = 'oct'): Assignment =>
  ({ id: `${nurseId}-${date}`, scheduleId, nurseId, date, dutyWindowId, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'MANUAL' }) as Assignment;
const weekRule = (overrides: Partial<Rule> = {}) =>
  ({ id: 'rule-h9-week-hours', name: 'Most hours in any 7 days', templateKey: 'MAX_HOURS_IN_7_DAYS', enabled: true, severity: 'HARD', value: 60, ...overrides }) as unknown as Rule;
const hoursByDate = (list: Assignment[]) => (d: string) => (list.some((a) => a.date === d) ? 12 : 0);

test('the generator keeps every 7 days in a row within 60 h, with the same hours for the month', async () => {
  // A month of 12 h shifts (230 h): with up to 6 shifts in a row allowed, it gave 72 h weeks before.
  const schedule = makeSchedule({ id: 'oct', startDate: OCT.startDate, endDate: OCT.endDate, hoursTargetFullTime: 0 });
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], [makeNurse('a')], [SENIOR], [LONG], [], [], [], [], [],
    hoursOnlyRules(), undefined, [OCT]);
  assert.deepEqual(weeksOverLimit(OCT.startDate, OCT.endDate, hoursByDate(result.assignments), 60), []);
  assert.equal(result.assignments.length * 12, 228, 'still 19 shifts of 12 h');

  // The number can be changed: 48 h means at most 4 long shifts in any 7 days.
  const at48 = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], [makeNurse('a')], [SENIOR], [LONG], [], [], [], [], [],
    [...hoursOnlyRules(), weekRule({ value: 48 })], undefined, [OCT]);
  assert.deepEqual(weeksOverLimit(OCT.startDate, OCT.endDate, hoursByDate(at48.assignments), 48), []);
});

test('a week across two rosters counts as one week', async () => {
  // She worked 4 x 12 h at the end of the roster before (Oct 15 to 18).
  const prior = ['2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'].map((d) => shift('a', d, LONG.id, 'sep'));
  const schedule = makeSchedule({ id: 'oct', startDate: OCT.startDate, endDate: OCT.endDate, hoursTargetFullTime: 0 });
  const result = await SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], [makeNurse('a')], [SENIOR], [LONG], [], [], [], [], [],
    hoursOnlyRules(), undefined, [OCT], [], [], { priorAssignments: prior });
  const all = [...prior, ...result.assignments];
  assert.deepEqual(weeksOverLimit(OCT.startDate, OCT.endDate, hoursByDate(all), 60), []);
  // Oct 15 to 21 already has 48 h, so at most one more long shift on Oct 19 to 21.
  assert.ok(result.assignments.filter((a) => a.date <= '2026-10-21').length <= 1);
});

test('the checker reports a week over the limit once, with its shifts', () => {
  const schedule = makeSchedule({ id: 'oct', startDate: day(0), endDate: day(13), hoursTargetFullTime: 0 });
  // Six long shifts on Oct 19 to 24 (72 h), then a day off and two more.
  const shifts = [0, 1, 2, 3, 4, 5, 7, 8].map((i) => shift('a', day(i)));
  const validate = (rules: Rule[], leave: any[] = []) =>
    ScheduleValidator.validate(schedule, shifts, [makeNurse('a')], [SENIOR], [LONG], [], leave, [], [], [...hoursOnlyRules(), ...rules], [OCT])
      .findings.filter((f) => f.id.startsWith('h9-week-hours'));

  const found = validate([]);
  assert.equal(found.length, 1, 'one finding for the busy stretch (not one per day)');
  assert.equal(found[0].severity, 'ERROR');
  assert.match(found[0].message, /72 h in 7 days/);
  assert.match(found[0].message, /most allowed: 60 h/);
  assert.deepEqual(found[0].cellRefs.map((c) => c.date), [0, 1, 2, 3, 4, 5].map(day), 'the six shifts of that week');

  assert.equal(validate([weekRule({ severity: 'SOFT' })])[0]?.severity, 'WARN', '"Try to" is only a warning');
  assert.equal(validate([weekRule({ enabled: false })]).length, 0, 'switched off');
  assert.equal(validate([weekRule({ value: 72 })]).length, 0, '72 h allowed');
  // A shift on a day of approved leave counts no shift hours (the leave counts that day).
  assert.equal(validate([], [makeLeave({ nurseId: 'a', startDate: day(2), endDate: day(2) })]).length, 0);
});

test('moving a shift by hand and "Who could cover?" follow the same limit', () => {
  const week = [0, 1, 2, 3, 4].map((i) => shift('a', day(i))); // 60 h on Oct 19 to 23
  const sixth = shift('a', day(5));
  const ctx = { assignments: [...week, sixth], nurses: [makeNurse('a')], dutyWindows: [DAY_DUTY, LONG], leaveEntries: [], locks: [], roles: [], rules: [] };
  assert.deepEqual(checkAssignment(ctx, sixth), ['Nurse a would work 72h in 7 days (maximum 60h)']);
  assert.deepEqual(checkAssignment({ ...ctx, rules: [weekRule({ value: 72 })] }, sixth), []);

  const schedule = makeSchedule({ id: 'oct', startDate: day(0), endDate: day(13), hoursTargetFullTime: 0 });
  const explained = explainNurseDay({ nurseId: 'a', date: day(5), schedule, assignments: week, nurses: [makeNurse('a')],
    dutyWindows: [DAY_DUTY, LONG], leaveEntries: [], locks: [], roles: [], rules: [], workingHoursPeriods: [OCT] });
  assert.equal(explained.status, 'BLOCKED');
  assert.ok(explained.reasons.includes('Would be 72 hours in 7 days; the limit is 60 hours.'), explained.reasons.join(' | '));
  assert.ok(explained.reasons.includes('Would be 68 hours in 7 days; the limit is 60 hours.'), 'the 8 h shift too');
});

test('the standard rules include the 7 day limit (60 h, must)', () => {
  const spec = CANONICAL_RULES_SPEC.find((r) => r.templateKey === 'MAX_HOURS_IN_7_DAYS');
  assert.ok(spec);
  assert.equal(spec!.value, 60);
  assert.equal(spec!.severity, 'HARD');
  assert.equal(spec!.windowDays, 7);
});
