import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HoursHistory, hoursHistoryOverlaps, resolveNurseHoursBalance } from '../../src/services/hours/hoursBalance';
import { loadHoursHistory } from '../../src/services/hours/hoursHistoryService';
import { calculateNurseHoursAccounting, summarizeNurseHours } from '../../src/services/reports/hoursAccounting';
import { RosterPublishService } from '../../src/services/publish/rosterPublishService';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { assertScheduleRangeAvailable, mergeScheduleRanges } from '../../src/services/schedule/scheduleRanges';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, Schedule, WorkingHoursPeriod } from '../../src/types';

const periods: WorkingHoursPeriod[] = [
  { id: 'oct', year: '2026', name: 'October', startDate: '2026-10-19', endDate: '2026-11-18', workingHours: 230 },
  { id: 'nov', year: '2026', name: 'November', startDate: '2026-11-19', endDate: '2026-12-18', workingHours: 210 },
];
const first = makeSchedule({ id: 'first', startDate: '2026-10-19', endDate: '2026-11-01', status: 'PUBLISHED' });
const second = makeSchedule({ id: 'second', startDate: '2026-11-02', endDate: '2026-11-18' });
const third = makeSchedule({ id: 'third', startDate: '2026-11-19', endDate: '2026-12-18' });
const nurse = makeNurse('n1');
const long = { ...DAY_DUTY, id: 'long', endTime: '21:00' };
const duties = [DAY_DUTY, long];
const previousShifts = Array.from({ length: 10 }, (_, i) => ({
  id: `old-${i}`, scheduleId: first.id, nurseId: nurse.id, date: `2026-10-${19 + i}`, dutyWindowId: long.id,
  kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'MANUAL', locked: false,
} as Assignment));
const history: HoursHistory = { schedules: [first, second, third], assignments: previousShifts };
const balance = (schedule: Schedule, input: HoursHistory = history) => resolveNurseHoursBalance(nurse, schedule, duties, [], [], periods, input);

test('partial roster starts at 104 hours and 120 earlier hours leave 110 in the same period', () => {
  assert.equal(balance(first).targetHours, 104);
  const result = balance(second);
  assert.equal(result.baseTargetHours, 126);
  assert.equal(result.carriedHours, -16);
  assert.equal(result.targetHours, 110);
  assert.equal(result.previousCreditedHours, 120);
});

test('what a period leaves over moves into the next period; days without a published roster carry nothing', () => {
  // October to November closed 16.1 h ahead (120 h worked for a 103.9 h share): November to December asks 16 h less.
  const result = balance(third);
  assert.equal(result.baseTargetHours, 210);
  assert.equal(result.carriedHours, -16.1);
  assert.equal(result.targetHours, 193.9);
  const draftFirst = balance(second, { schedules: [{ ...first, status: 'DRAFT' }, second], assignments: previousShifts });
  assert.equal(draftFirst.carriedHours, 0);
  assert.equal(draftFirst.targetHours, 126);
});

test('only published rosters count: drafts and archived rosters carry nothing', () => {
  for (const [status, target] of [['DRAFT', 126], ['ARCHIVED', 126], ['PUBLISHED', 110]] as const) {
    const input = { schedules: [{ ...first, status }, second, third], assignments: previousShifts };
    assert.equal(balance(second, input).targetHours, target, status);
    assert.equal(balance(first, input).targetHours, 104);
  }
  // A loaded history names the rosters it read as published, whatever their status says now.
  assert.equal(balance(second, { ...history, schedules: [{ ...first, status: 'DRAFT' }, second], countedScheduleIds: ['first'] }).targetHours, 110);
});

test('a nurse who was not on the earlier roster (joined later) carries nothing', () => {
  const newcomer = makeNurse('new');
  const result = resolveNurseHoursBalance(newcomer, second, duties, [], [], periods, history);
  assert.equal(result.carriedHours, 0);
  assert.equal(result.targetHours, 126);
});

test('approved leave replaces a shift on the same day; leave that does not count adds no goal', () => {
  const leaves = [makeLeave({ startDate: '2026-10-19', endDate: '2026-10-19' })];
  const result = resolveNurseHoursBalance(nurse, second, duties, leaves, [ANNUAL_LEAVE], periods, history);
  assert.equal(result.previousCreditedHours, 116); // 120 minus 12 plus 8
  assert.equal(result.targetHours, 114);
  const unpaid = { ...ANNUAL_LEAVE, id: 'unpaid', countsTowardHoursTarget: false };
  const off = [makeLeave({ id: 'u', leaveTypeId: 'unpaid', startDate: '2026-10-29', endDate: '2026-11-01' })];
  const withUnpaid = resolveNurseHoursBalance(nurse, second, duties, off, [unpaid], periods, history);
  assert.equal(withUnpaid.previousCreditedHours, 120);
  assert.equal(withUnpaid.cumulativeTargetHours, 200); // 10 counted days before plus the 17 days of this roster
  assert.equal(withUnpaid.targetHours, 80);
});

test('excess credit can cover a whole later roster and the remaining surplus is retained', () => {
  const allDay = { ...long, startTime: '09:00', endTime: '09:00' };
  const more = Array.from({ length: 13 }, (_, i) => ({ ...previousShifts[0], id: `many-${i}`, date: `2026-10-${19 + i}` }));
  const input = { schedules: [first, second], assignments: more };
  const result = calculateNurseHoursAccounting(nurse, second, [], [allDay], [], [], [], [], [], [], [], periods, input);
  assert.equal(result.targetHours, 0);
  assert.equal(result.closingBalanceHours, 82);
});

test('splitting a period into three rosters preserves its full target after rounding', () => {
  const pieces = [makeSchedule({ id: 'a', startDate: '2026-10-19', endDate: '2026-10-21', status: 'PUBLISHED' }),
    makeSchedule({ id: 'b', startDate: '2026-10-22', endDate: '2026-10-24', status: 'PUBLISHED' }),
    makeSchedule({ id: 'c', startDate: '2026-10-25', endDate: '2026-11-18' })];
  const onEach = pieces.map(p => ({ ...previousShifts[0], id: `on-${p.id}`, scheduleId: p.id, date: p.startDate }));
  const targets = pieces.map(s => balance(s, { schedules: pieces, assignments: onEach }).baseTargetHours);
  assert.deepEqual(targets, [22, 23, 185]);
  assert.equal(targets.reduce((a, b) => a + b), 230);
});

test('part time cumulative targets are rounded after the contract share is applied', () => {
  const result = resolveNurseHoursBalance({ ...nurse, contractPercent: 50 }, second, duties, [], [], periods, history);
  assert.equal(result.cumulativeTargetHours, 115);
  assert.equal(result.targetHours, 0);
  assert.equal(result.carriedHours, -68);
});

test('only the published shifts in the history count; orphan and out of range shifts do not', () => {
  assert.equal(balance(second, { ...history, assignments: previousShifts.slice(0, 9) }).targetHours, 122);
  const extras = [{ ...previousShifts[0], id: 'orphan', scheduleId: 'gone' },
    { ...previousShifts[0], id: 'outside', date: '2026-10-18' }, { ...previousShifts[0], id: 'duplicate' }];
  assert.equal(balance(second, { ...history, assignments: [...previousShifts, ...extras] }).targetHours, 110);
});

test('a roster spanning two periods has distinct cumulative targets at the boundary', () => {
  const crossing = makeSchedule({ id: 'cross', startDate: '2026-11-02', endDate: '2026-11-30' });
  const input = { schedules: [first, crossing], assignments: previousShifts };
  assert.equal(resolveNurseHoursBalance(nurse, crossing, duties, [], [], periods, input, '2026-11-18').targetHours, 110);
  assert.equal(balance(crossing, input).targetHours, 194);
});

test('reports and the grid use the same carried target and closing balance', () => {
  const shifts = [{ ...previousShifts[0], id: 'new', date: '2026-11-02', scheduleId: second.id }];
  const summary = summarizeNurseHours(nurse, second, shifts, duties, [], [], periods, undefined, history);
  const report = calculateNurseHoursAccounting(nurse, second, shifts, duties, [], [], [], [], [], [], [], periods, history);
  assert.equal(summary.targetHours, 110);
  assert.equal(report.targetHours, summary.targetHours);
  assert.equal(report.closingBalanceHours, -98);
  assert.equal(summary.closingBalanceHours, report.closingBalanceHours);
});

test('overlap protection includes shared boundary dates and repeated reservations; archived rosters hold no dates', () => {
  assert.doesNotThrow(() => assertScheduleRangeAvailable(second, [first]));
  assert.throws(() => assertScheduleRangeAvailable({ ...second, startDate: '2026-11-01' }, [first]), /overlap/);
  assert.doesNotThrow(() => assertScheduleRangeAvailable({ ...first, id: 'copy' }, [{ ...first, status: 'ARCHIVED' } as Schedule]));
  const reserved = mergeScheduleRanges({}, [first]);
  assert.throws(() => mergeScheduleRanges(reserved, [{ ...first, id: 'other-planner' }]), /overlap/);
  assert.throws(() => mergeScheduleRanges({}, [first, { ...first, id: 'imported-copy' }]), /overlap/);
  // Taking a roster out of the archive needs its dates free again.
  const withArchived = mergeScheduleRanges(reserved, [{ ...first, id: 'old', status: 'ARCHIVED' }]);
  assert.throws(() => mergeScheduleRanges(withArchived, [{ ...first, id: 'old', status: 'DRAFT' }]), /overlap/);
  // A backup restore keeps old overlaps as they were, but never invalid dates.
  assert.doesNotThrow(() => mergeScheduleRanges({}, [first, { ...first, id: 'old-copy' }], { acceptOverlaps: true }));
  assert.throws(() => mergeScheduleRanges({}, [{ ...first, endDate: '2026-10-01' }], { acceptOverlaps: true }), /valid roster dates/);
});

test('existing overlaps block generation and produce a publishing error without deleting records', async () => {
  const duplicate = { ...first, id: 'duplicate' };
  const input = { schedules: [first, duplicate], assignments: previousShifts };
  assert.equal(hoursHistoryOverlaps(first, input).length, 1);
  await assert.rejects(SchedulingEngine.generate(first, 'GENERATE_ALL', [], [nurse], [SENIOR], duties,
    [], [], [], [], [], hoursOnlyRules(), undefined, periods, [], [], { hoursHistory: input }), /overlap/);
  const report = ScheduleValidator.validate(first, [], [nurse], [SENIOR], duties, [], [], [], [], hoursOnlyRules(),
    periods, [], [], [], { hoursHistory: input });
  assert.ok(report.findings.some(f => f.id.startsWith('schedule-overlap-') && f.severity === 'ERROR'));
});

test('generation respects the carried goal and validation checks the same adjusted ceiling', async () => {
  const generated = await SchedulingEngine.generate(second, 'GENERATE_ALL', [], [nurse], [SENIOR], duties,
    [], [], [], [], [], hoursOnlyRules(), undefined, periods, [], [], { hoursHistory: history });
  const total = summarizeNurseHours(nurse, second, generated.assignments, duties, [], [], periods, undefined, history);
  assert.ok(total.totalHours > 0);
  assert.ok(total.totalHours <= 116, `Generated ${total.totalHours} for the adjusted 110 hour goal`);
  const over = Array.from({ length: 11 }, (_, i) => ({ ...previousShifts[0], id: `over-${i}`, scheduleId: second.id,
    date: `2026-11-${String(2 + i).padStart(2, '0')}` }));
  const checked = ScheduleValidator.validate(second, over, [nurse], [SENIOR], duties, [], [], [], [], hoursOnlyRules(), periods, [], [], [], { hoursHistory: history });
  assert.ok(checked.findings.some(f => f.id.startsWith('h7-hours-over-') && f.message.includes('110')));
});

test('generation and validation reserve the later period budget until its dates begin', async () => {
  const crossing = makeSchedule({ id: 'cross', startDate: '2026-11-02', endDate: '2026-11-30' });
  const input = { schedules: [first, crossing], assignments: previousShifts };
  const generated = await SchedulingEngine.generate(crossing, 'GENERATE_ALL', [], [nurse], [SENIOR], duties,
    [], [], [], [], [], hoursOnlyRules(), undefined, periods, [], [], { hoursHistory: input });
  const prefix = summarizeNurseHours(nurse, crossing, generated.assignments, duties, [], [], periods,
    { start: crossing.startDate, end: '2026-11-18' }, input);
  assert.ok(prefix.totalHours <= 116, `The first period received ${prefix.totalHours} hours`);
  const tooEarly = Array.from({ length: 11 }, (_, i) => ({ ...previousShifts[0], id: `early-${i}`, scheduleId: crossing.id,
    date: `2026-11-${String(2 + i).padStart(2, '0')}` }));
  const report = ScheduleValidator.validate(crossing, tooEarly, [nurse], [SENIOR], duties, [], [], [], [], hoursOnlyRules(), periods, [], [], [], { hoursHistory: input });
  assert.ok(report.findings.some(f => f.id === 'h7-period-n1-2026-11-18'));
});

test('leave saved in the history is the leave that counts on earlier days', () => {
  const historicalLeave = makeLeave({ startDate: '2026-10-19', endDate: '2026-10-19' });
  const result = resolveNurseHoursBalance(nurse, second, duties, [], [ANNUAL_LEAVE], periods,
    { ...history, leaveEntries: [historicalLeave] });
  assert.equal(result.previousCreditedHours, 116);
  assert.equal(result.targetHours, 114);
});

test('uncovered dates do not accrue target hours in a partly covered roster', () => {
  const partial = makeSchedule({ id: 'partial', startDate: '2026-11-16', endDate: '2026-11-25', hoursTargetFullTime: 999 });
  const result = resolveNurseHoursBalance(nurse, partial, duties, [], [], [periods[0]], { schedules: [partial], assignments: [] });
  assert.equal(result.targetHours, 22); // Only 3 covered days at 230h per 31 day period accrue a target
});


test('personal roster emails show the same adjusted goal and carried balance as reports', () => {
  const email = RosterPublishService.generatePersonalEmailHtml({
    clinicName: 'Clinic', schedule: second, version: { number: 1 } as any, nurse,
    assignments: [], dutyWindows: duties, doctors: [], roles: [], specialties: [], leaveEntries: [], leaveTypes: [],
    ackToken: 'test-only', workingHoursPeriods: periods, hoursHistory: history,
  });
  assert.match(email.html, />110h</);
  assert.match(email.html, /Base goal: 126h/);
  assert.match(email.html, /16h ahead/);
});

test('a goal is the same whether or not the hours history has loaded (rounded once)', () => {
  const p227: WorkingHoursPeriod[] = [{ id: 'p', year: '2026', name: 'P', startDate: '2026-10-01', endDate: '2026-10-31', workingHours: 227 }];
  const short = makeSchedule({ id: 'short', startDate: '2026-10-01', endDate: '2026-10-05' });
  const half = { ...nurse, contractPercent: 50 };
  const without = resolveNurseHoursBalance(half, short, duties, [], [], p227).targetHours;
  const withEmpty = resolveNurseHoursBalance(half, short, duties, [], [], p227, { schedules: [short], assignments: [] }).targetHours;
  assert.equal(without, 18); // 227 / 31 x 5 days x 50% = 18.3
  assert.equal(withEmpty, without);
});

test('a roster with its own target is prorated up to a checkpoint, with or without history', () => {
  const december = makeSchedule({ id: 'dec', startDate: '2026-12-01', endDate: '2026-12-31', hoursTargetFullTime: 160 });
  const without = resolveNurseHoursBalance(nurse, december, duties, [], [], [], undefined, '2026-12-15').targetHours;
  const withHistory = resolveNurseHoursBalance(nurse, december, duties, [], [], [], { schedules: [december], assignments: [] }, '2026-12-15').targetHours;
  assert.equal(without, 77); // 160 / 31 x 15 days
  assert.equal(withHistory, without);
  assert.equal(resolveNurseHoursBalance(nurse, december, duties, [], [], []).targetHours, 160);
});

test('an old overlap between two other rosters does not block this roster', () => {
  const a = makeSchedule({ id: 'old-a', startDate: '2025-01-01', endDate: '2025-01-31' });
  const b = makeSchedule({ id: 'old-b', startDate: '2025-01-15', endDate: '2025-02-15' });
  assert.equal(hoursHistoryOverlaps(second, { ...history, schedules: [a, b, ...history.schedules] }).length, 0);
  assert.equal(hoursHistoryOverlaps(a, { ...history, schedules: [a, b] }).length, 1);
});

test('a record without dates is never reported as an overlap and never crashes the check', () => {
  const broken = { id: 'broken', name: 'Broken' } as Schedule;
  assert.doesNotThrow(() => hoursHistoryOverlaps(second, { ...history, schedules: [broken, ...history.schedules] }));
  assert.doesNotThrow(() => assertScheduleRangeAvailable(second, [broken]));
});

test('a contract change applies from its own roster: earlier days keep the contract they were published with', () => {
  const half = { ...nurse, contractPercent: 50 };
  const recorded = { ...history, contractPercents: { first: { [nurse.id]: 100 } } };
  const result = resolveNurseHoursBalance(half, second, duties, [], [], periods, recorded);
  // Full time for October 19 to November 1 (104h, she worked 120h), then half time for this roster (63h)
  assert.equal(result.cumulativeTargetHours, 167);
  assert.equal(result.baseTargetHours, 63);
  assert.equal(result.targetHours, 47);
  // Without the record (older published versions), today's contract is used
  assert.equal(resolveNurseHoursBalance(half, second, duties, [], [], periods, history).targetHours, 0);
});

test('the hours history loads every earlier published roster (any period) as saved now, never drafts', async () => {
  const lists: Record<string, any[]> = {
    schedules: [
      first,
      makeSchedule({ id: 'draft', startDate: '2026-10-10', endDate: '2026-10-18', status: 'DRAFT' }),
      makeSchedule({ id: 'earlier-period', startDate: '2026-09-19', endDate: '2026-10-18', status: 'PUBLISHED' }),
      second,
    ],
    workingHoursPeriods: periods,
    leaveEntries: [],
    versions: [
      { id: 'v1', scheduleId: 'first', number: 2, isPublished: true, timestamp: '1', snapshot: { assignments: previousShifts.slice(0, 5), contractPercents: { n1: 100 } } },
      { id: 'v0', scheduleId: 'first', number: 1, isPublished: true, timestamp: '0', snapshot: { assignments: previousShifts } },
      { id: 'vs', scheduleId: 'earlier-period', number: 1, isPublished: true, timestamp: '0', snapshot: { assignments: [] } },
      { id: 'vd', scheduleId: 'draft', number: 1, isPublished: false, timestamp: '0', snapshot: { assignments: previousShifts } },
    ],
    // Saved after publishing: a change to a published roster counts as soon as it is saved
    // (the owner's rule of 2026-10-06; "Send changes" only tells the nurses).
    assignments: previousShifts,
  };
  const read: string[] = [];
  const repo = {
    list: async (name: string, filter?: { field: string; value: any }) => {
      read.push(filter ? `${name}:${filter.value}` : name);
      return (lists[name] || []).filter((x) => !filter || x[filter.field] === filter.value);
    },
  } as any;
  const loaded = await loadHoursHistory(repo, second);
  assert.deepEqual([...loaded.countedScheduleIds!].sort(), ['earlier-period', 'first']);
  assert.equal(loaded.assignments.length, 10, 'the shifts as saved now (the latest published version had 5)');
  // Loaded again: every roster comes from the session cache.
  const rosterReads = () => read.filter((r) => r.startsWith('versions') || r.startsWith('assignments')).length;
  const reads = rosterReads();
  await loadHoursHistory(repo, second);
  assert.equal(rosterReads(), reads, 'no second read of a roster');
  // The contracts stay those of the latest publish; a draft's shifts are never read.
  assert.deepEqual(loaded.contractPercents, { first: { n1: 100 } });
  assert.deepEqual(read.filter((r) => r.startsWith('assignments')).sort(), ['assignments:earlier-period', 'assignments:first']);
  assert.equal(resolveNurseHoursBalance(nurse, second, duties, [], [], periods, loaded).previousCreditedHours, 120);
});

// Four back to back periods of 8 h a day, with 8 h shifts, so the numbers stay simple.
const DAY8 = DAY_DUTY; // 09:00 to 17:00
const p8: WorkingHoursPeriod[] = [
  { id: 'sep', year: '2026', name: 'September', startDate: '2026-09-19', endDate: '2026-10-18', workingHours: 240 },
  { id: 'oct8', year: '2026', name: 'October', startDate: '2026-10-19', endDate: '2026-11-18', workingHours: 248 },
  { id: 'nov8', year: '2026', name: 'November', startDate: '2026-11-19', endDate: '2026-12-18', workingHours: 240 },
  { id: 'dec8', year: '2026', name: 'December', startDate: '2026-12-19', endDate: '2027-01-18', workingHours: 248 },
];
const roster8 = (p: WorkingHoursPeriod, status: Schedule['status'] = 'PUBLISHED') => makeSchedule({ id: `r-${p.id}`, startDate: p.startDate, endDate: p.endDate, status });
const everyDay = (p: WorkingHoursPeriod, skip = 0) => {
  const days: Assignment[] = [];
  for (let d = new Date(`${p.startDate}T00:00:00Z`); d.toISOString().slice(0, 10) <= p.endDate; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push({ id: `${p.id}-${days.length}`, scheduleId: `r-${p.id}`, nurseId: nurse.id, date: d.toISOString().slice(0, 10),
      dutyWindowId: DAY8.id, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'MANUAL', locked: false } as Assignment);
  }
  return days.slice(skip);
};
const goal8 = (p: WorkingHoursPeriod, history: HoursHistory) => resolveNurseHoursBalance(nurse, roster8(p, 'DRAFT'), [DAY8], [], [], p8, history);

test('a shortfall is carried at most twice, then written off', () => {
  // September: one shift missing (8 h short). October and November: exactly their own hours.
  const sepShort = { schedules: [roster8(p8[0])], assignments: everyDay(p8[0], 1) };
  assert.equal(goal8(p8[1], sepShort).targetHours, 256, 'October asks the 8 h back (first carry)');
  const octExact = { schedules: [roster8(p8[0]), roster8(p8[1])], assignments: [...everyDay(p8[0], 1), ...everyDay(p8[1])] };
  assert.equal(goal8(p8[2], octExact).targetHours, 248, 'not made up in October: November asks again (second carry)');
  const novExact = { schedules: [...octExact.schedules, roster8(p8[2])], assignments: [...octExact.assignments, ...everyDay(p8[2])] };
  const december = goal8(p8[3], novExact);
  assert.equal(december.targetHours, 248, 'carried twice: December asks only its own hours');
  assert.equal(december.writtenOffHours, 8);
});

test('a shortfall made up in the next period is settled', () => {
  // October makes up September's 8 h with two longer shifts (+4 h each).
  const longDay = { ...DAY8, id: 'long8', endTime: '21:00' }; // 12 h
  const octWithExtra = everyDay(p8[1]).map((a, i) => (i < 2 ? { ...a, dutyWindowId: longDay.id } : a)); // +8 h
  const history = { schedules: [roster8(p8[0]), roster8(p8[1])], assignments: [...everyDay(p8[0], 1), ...octWithExtra] };
  const november = resolveNurseHoursBalance(nurse, roster8(p8[2], 'DRAFT'), [DAY8, longDay], [], [], p8, history);
  assert.equal(november.targetHours, 240);
  assert.equal(november.carriedHours, 0);
});

test('catching up never asks more than 10% of a period on top; the rest waits for the next period', () => {
  // September: 5 shifts missing (40 h short). October may ask at most 24.8 h extra.
  const sepVeryShort = { schedules: [roster8(p8[0])], assignments: everyDay(p8[0], 5) };
  const october = goal8(p8[1], sepVeryShort);
  assert.equal(october.targetHours, 272.8);
  assert.equal(october.deferredHours, 15.2);
  // October then works only its own 248 h:
  const octOwn = { schedules: [roster8(p8[0]), roster8(p8[1])], assignments: [...everyDay(p8[0], 5), ...everyDay(p8[1])] };
  const november = goal8(p8[2], octOwn);
  assert.equal(november.targetHours, 264, 'still 40 h owed: November asks its 10% (24 h), the rest is written off after it');
});

test('hours ahead are carried in full (a lighter period never overworks anyone)', () => {
  const longDay = { ...DAY8, id: 'long8', endTime: '21:00' };
  const sepAhead = { schedules: [roster8(p8[0])], assignments: everyDay(p8[0]).map((a, i) => (i < 10 ? { ...a, dutyWindowId: longDay.id } : a)) };
  const october = resolveNurseHoursBalance(nurse, roster8(p8[1], 'DRAFT'), [DAY8, longDay], [], [], p8, sepAhead);
  assert.equal(october.carriedHours, -40);
  assert.equal(october.targetHours, 208);
});

test('a roster that crosses a period end has one part per period, each with its own goal', () => {
  const crossing = makeSchedule({ id: 'cross', startDate: '2026-11-02', endDate: '2026-12-01' });
  const result = balance(crossing, { schedules: [first, crossing], assignments: previousShifts });
  assert.deepEqual(result.parts.map(p => [p.name, p.startDate, p.endDate, p.baseHours, p.carriedHours, p.targetHours]), [
    ['October', '2026-11-02', '2026-11-18', 126, -16, 110],
    ['November', '2026-11-19', '2026-12-01', 91, 0, 91],
  ]);
  assert.equal(result.targetHours, 201);
});

test('the engine fills each period part of a crossing roster, catching up early, within the roster goal', async () => {
  const late = { ...DAY_DUTY, id: 'late', startTime: '13:00', endTime: '21:00' };
  const team = ['n1', 'n2', 'n3', 'n4'].map(id => makeNurse(id));
  // n1 worked only 72 h (owes 32 h of October); the others 108 h.
  const earlier = team.flatMap(n => Array.from({ length: n.id === 'n1' ? 6 : 9 }, (_, i) => ({ ...previousShifts[0],
    id: `e-${n.id}-${i}`, nurseId: n.id, date: `2026-10-${19 + i}` })));
  const crossing = makeSchedule({ id: 'cross', startDate: '2026-11-02', endDate: '2026-12-01' });
  const input = { schedules: [first, crossing], assignments: earlier };
  const all = [DAY_DUTY, long, late];
  const generated = await SchedulingEngine.generate(crossing, 'GENERATE_ALL', [], team, [SENIOR], all,
    [], [], [], [], [], hoursOnlyRules(), undefined, periods, [], [], { hoursHistory: input });
  const worked = (s: string, e: string) => summarizeNurseHours(team[0], crossing, generated.assignments, all, [], [], periods, { start: s, end: e }, input).totalHours;
  const goal = resolveNurseHoursBalance(team[0], crossing, all, [], [], periods, input);
  // Catching up asks at most 10% of each part's own hours (owner's decision of 2026-10-06):
  // 12.6 h of the 32 h in October's part (126 h), the rest moves on and November's part
  // (91 h) asks 9.1 h of it.
  assert.deepEqual(goal.parts.map(p => [p.targetHours, p.carriedHours]), [[138.6, 12.6], [100.1, 9.1]]);
  assert.ok(worked('2026-11-02', '2026-11-18') >= 138.6 - 12, `October part: ${worked('2026-11-02', '2026-11-18')} of 138.6`);
  assert.ok(worked('2026-11-02', '2026-11-10') >= 66 + 6, `first week catches up: ${worked('2026-11-02', '2026-11-10')}`);
  // The whole roster stays within her goal plus the usual margin (October's shortfall may be made up straight after).
  assert.ok(worked('2026-11-02', '2026-12-01') <= 238.7 + 8, `whole roster: ${worked('2026-11-02', '2026-12-01')} of 238.7`);
});

test('a period part of one day at the end of a roster is still staffed', async () => {
  const P = { id: 'sp-p', name: 'Pediatrics', code: 'PEDS' };
  const team = ['a', 'b', 'c', 'd', 'e'].map(id => makeNurse(id, { preferences: [{ kind: 'SPECIALTY', refId: P.id, rank: 1 }] }));
  const doctors = ['d1', 'd2'].map(id => ({ id, fullName: id, specialtyIds: [P.id], weeklyPattern: [], active: true }));
  const roster = makeSchedule({ id: 'r', startDate: '2026-11-05', endDate: '2026-11-19' }); // November 19 starts the next period
  const sessions = [];
  for (let d = 5; d <= 19; d++) for (const doc of doctors) sessions.push({ id: `${doc.id}-${d}`, doctorId: doc.id,
    date: `2026-11-${String(d).padStart(2, '0')}`, startTime: '09:00', endTime: '17:00', specialtyId: P.id, source: 'PATTERN', cancelled: false });
  const generated = await SchedulingEngine.generate(roster, 'GENERATE_ALL', [], team, [SENIOR], duties, [], [P], sessions as any,
    [], [], hoursOnlyRules(), undefined, periods, doctors as any, [], { hoursHistory: { schedules: [roster], assignments: [] } });
  const lastDay = generated.assignments.filter(a => a.date === '2026-11-19');
  assert.equal(lastDay.filter(a => a.doctorId).length, 2, 'both doctors have a nurse on the one day of the new period');
});

test('the checker reports a period part that ends short, and hours held back or written off', () => {
  const crossing = makeSchedule({ id: 'cross', startDate: '2026-11-02', endDate: '2026-12-01' });
  const input = { schedules: [first, crossing], assignments: previousShifts };
  const few = Array.from({ length: 6 }, (_, i) => ({ ...previousShifts[0], id: `f-${i}`, scheduleId: 'cross', date: `2026-11-${String(2 + i).padStart(2, '0')}` }));
  const report = ScheduleValidator.validate(crossing, few, [nurse], [SENIOR], duties, [], [], [], [], hoursOnlyRules(), periods, [], [], [], { hoursHistory: input });
  const short = report.findings.find(f => f.id === 'hours-part-short-n1-2026-11-18');
  assert.ok(short, 'October part short');
  assert.match(short!.message, /72 of 110 h for the October period/);
  assert.ok(report.findings.some(f => f.id === 'hours-part-short-n1-2026-12-01'));
  // Held back and written off notes
  const sepVeryShort = { schedules: [roster8(p8[0])], assignments: everyDay(p8[0], 5) };
  const octReport = ScheduleValidator.validate(roster8(p8[1], 'DRAFT'), [], [nurse], [SENIOR], [DAY8], [], [], [], [], hoursOnlyRules(), p8, [], [], [], { hoursHistory: sepVeryShort });
  assert.ok(octReport.findings.some(f => f.id === 'hours-deferred-n1' && f.severity === 'INFO'));
});

test('the ledger reads the whole published history: an old shortfall made up later is not mistaken for hours ahead', () => {
  // Seven 30 day periods of 240 h (8 h a day). P0 40 h short, P1 makes them up, P3 10 h short, P4 makes them up.
  const P: WorkingHoursPeriod[] = Array.from({ length: 7 }, (_, k) => ({ id: `p${k}`, year: '2026', name: `P${k}`,
    startDate: new Date(Date.UTC(2026, 0, 1 + 30 * k)).toISOString().slice(0, 10),
    endDate: new Date(Date.UTC(2026, 0, 30 + 30 * k)).toISOString().slice(0, 10), workingHours: 240 }));
  const twelve = { ...DAY_DUTY, id: 'twelve', endTime: '21:00' };
  const rosterOf = (k: number, status: Schedule['status'] = 'PUBLISHED') => makeSchedule({ id: `r${k}`, startDate: P[k].startDate, endDate: P[k].endDate, status });
  const shiftsIn = (k: number, plus: number) => {
    const out: Assignment[] = [];
    let extra = plus;
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.UTC(2026, 0, 1 + 30 * k + i)).toISOString().slice(0, 10);
      let duty = DAY_DUTY.id;
      if (extra >= 4) { duty = twelve.id; extra -= 4; } else if (extra <= -8) { extra += 8; continue; }
      out.push({ ...previousShifts[0], id: `s${k}-${i}`, scheduleId: `r${k}`, date, dutyWindowId: duty });
    }
    return out;
  };
  const history = { schedules: [0, 1, 2, 3, 4].map(k => rosterOf(k)), assignments: [-40, 40, 0, -10, 10].flatMap((d, k) => shiftsIn(k, d)) };
  const p5 = resolveNurseHoursBalance(nurse, rosterOf(5, 'DRAFT'), [DAY_DUTY, twelve], [], [], P, history);
  assert.equal(p5.carriedHours, 0);
  assert.equal(p5.targetHours, 240);
});

test('a roster whose first day falls in a gap before its period still carries', () => {
  const pA: WorkingHoursPeriod[] = [{ id: 'A', year: '2026', name: 'A', startDate: '2026-09-01', endDate: '2026-09-30', workingHours: 240 },
    { id: 'B', year: '2026', name: 'B', startDate: '2026-10-05', endDate: '2026-11-03', workingHours: 240 }];
  const ra = makeSchedule({ id: 'ra', startDate: '2026-09-01', endDate: '2026-09-30', status: 'PUBLISHED' });
  const short80 = Array.from({ length: 20 }, (_, i) => ({ ...previousShifts[0], id: `x${i}`, scheduleId: 'ra', date: `2026-09-${String(i + 1).padStart(2, '0')}`, dutyWindowId: DAY_DUTY.id }));
  const goals = ['2026-10-05', '2026-10-01'].map(start => {
    const r = makeSchedule({ id: 'rr', startDate: start, endDate: '2026-10-31' });
    return resolveNurseHoursBalance(nurse, r, [DAY_DUTY], [], [], pA, { schedules: [ra, r], assignments: short80 });
  });
  // 80 h owed; this roster's own hours are 216 h, so it asks 10% of them (21.6 h) and 58.4 h wait.
  assert.deepEqual(goals.map(g => [g.carriedHours, g.deferredHours]), [[21.6, 58.4], [21.6, 58.4]]);
});

test('leave alone (a bulk public holiday) does not put a nurse on an earlier roster', () => {
  const holiday = makeLeave({ startDate: '2026-10-25', endDate: '2026-10-25' });
  const result = resolveNurseHoursBalance(nurse, second, duties, [holiday], [ANNUAL_LEAVE], periods,
    { schedules: [first, second], assignments: [], leaveEntries: [holiday] });
  assert.equal(result.carriedHours, 0);
  assert.equal(result.targetHours, 126);
});

test('a nurse who joined during an earlier roster counts from her first shift on it', () => {
  // September roster: only the existing team. October roster: Amy joins on November 12 and works every day after.
  const amy = makeNurse('amy');
  const sepRoster = roster8(p8[0]);
  const octRoster = roster8(p8[1]);
  const teamShift = { ...everyDay(p8[0])[0], nurseId: 'someone-else' };
  const amyShifts = everyDay(p8[1]).filter(a => a.date >= '2026-11-12').map(a => ({ ...a, nurseId: 'amy' }));
  const november = resolveNurseHoursBalance(amy, roster8(p8[2], 'DRAFT'), [DAY8], [], [], p8,
    { schedules: [sepRoster, octRoster], assignments: [teamShift, ...amyShifts] });
  assert.equal(november.carriedHours, 0, 'she worked her share since she joined');
  assert.equal(november.targetHours, 240);
});
