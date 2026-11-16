import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { publicationReport } from '../../src/services/publish/publicationChecks';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { followingRosterFindings, mergeFollowingRosterFindings } from '../../src/services/engine/surroundingRosterChecks';
import { checkAssignment } from '../../src/services/engine/assignmentChecks';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, DutyWindow, Rule } from '../../src/types';

const date = '2026-11-15';
const nurse = makeNurse('amy');
const long: DutyWindow = { ...DAY_DUTY, id: 'long', startTime: '09:00', endTime: '21:00' };
const early: DutyWindow = { ...DAY_DUTY, id: 'early', startTime: '07:00', endTime: '15:00' };
const shiftDate = (days: number) => new Date(Date.UTC(2026, 10, 15 + days)).toISOString().slice(0, 10);
const shift = (offset: number, duty = DAY_DUTY.id, scheduleId = 'next'): Assignment => ({ id: `${scheduleId}-${offset}`, scheduleId,
  nurseId: nurse.id, date: shiftDate(offset), dutyWindowId: duty, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'MANUAL', locked: false });
const generate = (duties: DutyWindow[], followingAssignments: Assignment[], rules: Rule[] = hoursOnlyRules()) =>
  SchedulingEngine.generate(makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: Number(duties[0].endTime.slice(0, 2)) - Number(duties[0].startTime.slice(0, 2)) }),
    'GENERATE_ALL', [], [nurse], [SENIOR], duties, [], [], [], [], [], rules, undefined, [], [], [], { followingAssignments } as any);

test('generation protects minimum rest before a duty in the next saved roster', async () => {
  const following = [shift(1, early.id)];
  const original = JSON.stringify(following);
  const result = await generate([long, { ...early, active: false }], following);
  assert.ok(result.assignments.every(a => a.dutyWindowId !== long.id));
  assert.equal(JSON.stringify(following), original);
  assert.ok(result.assignments.every(a => a.scheduleId !== 'next'));
});
test('generation counts fixed following duties in the consecutive day limit', async () => {
  const result = await generate([DAY_DUTY], [1, 2, 3, 4, 5, 6].map(i => shift(i)));
  assert.equal(result.assignments.length, 0);
});
test('generation counts fixed following duties in the consecutive late limit', async () => {
  const result = await generate([long], [1, 2, 3].map(i => shift(i, long.id)));
  assert.equal(result.assignments.length, 0);
});
test('generation protects rolling week hours that finish in the next saved roster', async () => {
  const twelve = { ...long, startTime: '07:00', endTime: '19:00' };
  const result = await generate([twelve], [1, 2, 3, 4, 5].map(i => shift(i, twelve.id)));
  assert.equal(result.assignments.length, 0);
});
test('manual checks use read only surrounding duties when checking the next day', () => {
  const cell = { ...shift(0, long.id, 'sched-1'), source: 'MANUAL' as const };
  const reasons = checkAssignment({ assignments: [cell], surroundingAssignments: [shift(1, early.id)], nurses: [nurse],
    dutyWindows: [long, early], leaveEntries: [], locks: [], roles: [], rules: hoursOnlyRules() } as any, cell);
  assert.ok(reasons.some(reason => reason.includes('rest before the next')));
});

const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 12 });
const boundary = (own: Assignment[], next: Assignment[], rules = hoursOnlyRules(), end = date, prior: Assignment[] = []) =>
  followingRosterFindings({ ...schedule, endDate: end }, own, [nurse], [DAY_DUTY, long, early], [], rules,
    { followingAssignments: next, priorAssignments: prior });
const rule = (templateKey: string, value: number, extra: Partial<Rule> = {}): Rule =>
  ({ id: templateKey, templateKey, value, enabled: true, severity: 'HARD', ...extra } as Rule);

test('boundary validation reports next roster rest with a cell reference on this roster', () => {
  const result = boundary([shift(0, long.id, 'sched-1')], [shift(1, early.id)]);
  const rest = result.find(f => f.id.startsWith('h3-rest-next-'));
  assert.equal(rest?.severity, 'ERROR');
  assert.match(rest!.message, /10 h rest/);
  assert.deepEqual(rest?.cellRefs, [{ nurseId: nurse.id, date }]);
});
test('a consecutive day run can bridge previous, current and following rosters', () => {
  const found = boundary([shift(0, DAY_DUTY.id, 'sched-1')], [shift(1), shift(2)],
    [...hoursOnlyRules(), rule('MAX_CONSECUTIVE_DAYS', 4)], date, [shift(-2), shift(-1)]);
  assert.match(found.find(f => f.id.startsWith('h2-days-next-'))!.message, /5 shifts in a row/);
});
test('next roster limits respect Try to, disabled settings and zero minimum rest', () => {
  const own = [shift(0, long.id, 'sched-1')], next = [shift(1, early.id)];
  assert.equal(boundary(own, next, [...hoursOnlyRules(), rule('MIN_REST_HOURS', 11, { severity: 'SOFT' })])
    .find(f => f.id.startsWith('h3-rest-next-'))?.severity, 'WARN');
  assert.ok(!boundary(own, next, [...hoursOnlyRules(), rule('MIN_REST_HOURS', 11, { enabled: false })]).length);
  assert.ok(!boundary(own, next, [...hoursOnlyRules(), rule('MIN_REST_HOURS', 0)]).length);
  assert.ok(!boundary(own, [1, 2, 3].map(i => shift(i, long.id)),
    [...hoursOnlyRules(), rule('MAX_CONSECUTIVE_LATE_DUTIES', 3, { enabled: false })]).some(f => f.id.startsWith('s1-late-next-')));
});
test('next roster late duties use the configured threshold and maximum', () => {
  const settings = [...hoursOnlyRules(), rule('MAX_CONSECUTIVE_LATE_DUTIES', 2, { params: { thresholdTime: '17:00' } })];
  assert.ok(boundary([shift(0, DAY_DUTY.id, 'sched-1')], [shift(1), shift(2)], settings).some(f => f.id.startsWith('s1-late-next-')));
  assert.ok(!boundary([shift(0, DAY_DUTY.id, 'sched-1')], [shift(1)], settings).some(f => f.id.startsWith('s1-late-next-')));
});
test('a rolling hours finding uses all three rosters and is merged without a duplicate', () => {
  const own = [0, 1, 2, 3, 4, 5].map(i => shift(i, long.id, 'sched-1'));
  const next = [shift(6, long.id)];
  const found = boundary(own, next, hoursOnlyRules(), shiftDate(5));
  const hours = found.filter(f => f.id.startsWith('h9-week-hours-'));
  assert.equal(hours.length, 1);
  assert.equal(hours[0].amount, 84);
  const earlier = { ...hours[0], id: `h9-week-hours-${nurse.id}-${date}-${shiftDate(5)}`, amount: 72 };
  const merged = mergeFollowingRosterFindings([earlier], found);
  assert.equal(merged.filter(f => f.id.startsWith('h9-week-hours-')).length, 1);
  assert.equal(merged.find(f => f.id.startsWith('h9-week-hours-'))?.amount, 84);
  assert.equal(hours[0].cellRefs.length, 6);
});
test('future only violations and injected shifts within this roster are not reported as its boundary conflicts', () => {
  const own = [shift(0, DAY_DUTY.id, 'sched-1')];
  assert.deepEqual(boundary(own, [10, 11, 12, 13, 14, 15, 16].map(i => shift(i, long.id))), []);
  assert.deepEqual(boundary(own, [shift(0, long.id)]), []);
});
test('boundary checks preserve their inputs and omit duties that do not touch current work', () => {
  const own = [shift(0, long.id, 'sched-1')], next = [shift(1, early.id)];
  const before = JSON.stringify([own, next]);
  boundary(own, next);
  assert.equal(JSON.stringify([own, next]), before);
  assert.deepEqual(boundary([], next), []);
});
test('manual checks include neighbouring rolling hours without adding a second editable duty', () => {
  const cell = shift(0, long.id, 'sched-1');
  const reasons = checkAssignment({ assignments: [cell], surroundingAssignments: [1, 2, 3, 4, 5].map(i => shift(i, long.id)),
    nurses: [nurse], dutyWindows: [long], leaveEntries: [], locks: [], roles: [], rules: hoursOnlyRules() }, cell);
  assert.ok(reasons.some(reason => /72h in 7 days/.test(reason)));
});

test('the actual roster validator and publication policy block a next roster rest conflict', () => {
  const own = [shift(0, long.id, 'sched-1')];
  const report = ScheduleValidator.validate(schedule, own, [nurse], [SENIOR], [long, early], [], [], [], [], hoursOnlyRules(),
    [], [], [], [], { followingAssignments: [shift(1, early.id)] });
  assert.ok(report.findings.some(f => f.id.startsWith('h3-rest-next-') && f.severity === 'ERROR'));
  const published = publicationReport(report, own, [nurse], { doctors: [], specialties: [], sessions: [] });
  assert.ok(published.errorCount > 0);
  assert.ok(published.findings.some(f => f.id.startsWith('h3-rest-next-') && f.severity === 'ERROR'));
});
test('the actual roster validator reports one complete rolling hours run across the end', () => {
  const twelve = { ...long, startTime: '07:00', endTime: '19:00' };
  const own = [0, 1, 2, 3, 4, 5].map(i => shift(i, twelve.id, 'sched-1'));
  const report = ScheduleValidator.validate({ ...schedule, endDate: shiftDate(5), hoursTargetFullTime: 72 }, own,
    [nurse], [SENIOR], [twelve], [], [], [], [], hoursOnlyRules(), [], [], [], [],
    { followingAssignments: [shift(6, twelve.id)] });
  const hours = report.findings.filter(f => f.id.startsWith('h9-week-hours-'));
  assert.equal(hours.length, 1);
  assert.equal(hours[0].amount, 84);
  assert.equal(hours[0].severity, 'ERROR');
  assert.equal(hours[0].cellRefs.length, 6);
  const published = publicationReport(report, own, [nurse], { doctors: [], specialties: [], sessions: [] });
  assert.equal(published.findings.filter(f => f.id.startsWith('h9-week-hours-')).length, 1);
});
test('the actual roster check keeps next roster Try to warnings and disabled limits distinct', () => {
  const own = [shift(0, long.id, 'sched-1')], followingAssignments = [shift(1, early.id)];
  const validate = (setting: Rule) => ScheduleValidator.validate(schedule, own, [nurse], [SENIOR], [long, early], [], [], [], [],
    [...hoursOnlyRules(), setting], [], [], [], [], { followingAssignments });
  assert.equal(validate(rule('MIN_REST_HOURS', 11, { severity: 'SOFT' })).findings.find(f => f.id.startsWith('h3-rest-next-'))?.severity, 'WARN');
  assert.ok(!validate(rule('MIN_REST_HOURS', 11, { enabled: false })).findings.some(f => f.id.startsWith('h3-rest-next-')));
});
test('the actual roster check does not count next roster staffing or unrelated violations as this roster', () => {
  const own = [shift(0, DAY_DUTY.id, 'sched-1')];
  const report = ScheduleValidator.validate({ ...schedule, hoursTargetFullTime: 8 }, own, [nurse], [SENIOR], [DAY_DUTY, long],
    [], [], [], [], hoursOnlyRules(), [], [], [], [], { followingAssignments: [10, 11, 12, 13, 14, 15, 16].map(i => shift(i, long.id)) });
  assert.equal(report.errorCount, 0);
  assert.equal(Object.keys(report.hourlyCoverageMap).length, 1);
  assert.equal(report.hourlyCoverageMap[date]['09:00'].nurses, 1);
});
