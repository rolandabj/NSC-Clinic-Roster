import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeLeave, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, DutyWindow, Rule, SeniorityLevel, WorkingHoursPeriod } from '../../src/types';

// The engine's own repair steps used to break hard rules the day pass had kept; the
// checker then reported "must fix" problems on rosters a valid fill could avoid.

const JUNIOR: SeniorityLevel = { id: 'jun', name: 'Staff', rank: 2, isSenior: false, color: '#111' };
const LEVELS = [SENIOR, JUNIOR];
const NC = { id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1, defaultStartTime: '09:00', defaultEndTime: '21:00' } as any;
const PHL = { id: 'role-phl', name: 'Blood collection', acronym: 'PHL', description: '', defaultDailyQuota: 1, defaultStartTime: '09:00', defaultEndTime: '21:00' } as any;
const duty = (id: string, startTime: string, endTime: string): DutyWindow =>
  ({ id, name: id.toUpperCase(), acronym: id.toUpperCase(), startTime, endTime, color: '#000', active: true }) as DutyWindow;
const rule = (id: string, templateKey: string, value: number, extra: object = {}) =>
  ({ id, name: templateKey, templateKey, value, severity: 'HARD', enabled: true, ...extra }) as unknown as Rule;
const doctor = (id: string, specialtyIds: string[] = []) => ({ id, fullName: `Dr ${id}`, specialtyIds, weeklyPattern: [], active: true }) as any;
const session = (doctorId: string, date: string, startTime: string, endTime: string, specialtyId = '') =>
  ({ id: `s-${doctorId}-${date}`, doctorId, date, startTime, endTime, specialtyId, source: 'MANUAL', cancelled: false }) as any;
const shift = (id: string, nurseId: string, date: string, dutyWindowId: string, extra: Partial<Assignment> = {}) =>
  ({ id, scheduleId: 'sched-1', nurseId, date, dutyWindowId, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'MANUAL', ...extra }) as Assignment;

async function fill(opts: {
  schedule: any; nurses: any[]; duties: DutyWindow[]; roles?: any[]; sessions?: any[]; doctors?: any[]; specialties?: any[];
  leave?: any[]; rules?: Rule[]; setup?: any; existing?: Assignment[]; mode?: any; periods?: WorkingHoursPeriod[];
}) {
  const roles = opts.roles || [];
  const result = await SchedulingEngine.generate(
    opts.schedule, opts.mode || 'GENERATE_ALL', opts.existing || [], opts.nurses, LEVELS, opts.duties, roles, opts.specialties || [],
    opts.sessions || [], [], opts.leave || [], opts.rules || [], undefined, opts.periods || [], opts.doctors || [], [ANNUAL_LEAVE], opts.setup || {}
  );
  const report = ScheduleValidator.validate(
    opts.schedule, result.assignments, opts.nurses, LEVELS, opts.duties, opts.sessions || [], opts.leave || [], [], roles,
    opts.rules || [], opts.periods || [], opts.specialties || [], opts.doctors || [], [ANNUAL_LEAVE], opts.setup || {},
    opts.setup?.availabilityRequests || []
  );
  const errors = (prefix: string) => report.findings.filter((f) => f.severity === 'ERROR' && f.id.startsWith(prefix)).map((f) => f.message);
  return { result, report, errors };
}

test('the senior step never takes away the free nurse', async () => {
  // The senior can't take blood. Swapping her into a junior's shift that was the free nurse
  // left 9 to 1 without one, although the other junior was free to cover.
  const E = duty('e', '09:00', '17:00');
  const L = duty('l', '13:00', '21:00');
  const D = duty('d', '09:00', '21:00');
  const { errors } = await fill({
    schedule: makeSchedule({ startDate: '2026-10-07', endDate: '2026-10-08', hoursTargetFullTime: 16 }),
    nurses: [
      makeNurse('j1', { seniorityLevelId: JUNIOR.id, capabilityIds: [NC.id, PHL.id] }),
      makeNurse('j2', { seniorityLevelId: JUNIOR.id, capabilityIds: [NC.id, PHL.id] }),
      makeNurse('s1', { capabilityIds: [] }),
    ],
    duties: [E, L, D],
    roles: [NC, PHL],
    existing: [shift('m1', 's1', '2026-10-08', 'e')],
  });
  assert.deepEqual(errors('cov-gap'), []);
  assert.deepEqual(errors('h1-senior'), []);
});

test("the repair step never takes away another day's only senior", async () => {
  // Sara (senior) was placed on Monday for the senior rule; to lengthen her Tuesday shift
  // with Dr Lee, the repair step removed her Monday shift and left Monday without a senior.
  const LONG = duty('l', '09:00', '21:00');
  const S = makeNurse('s', { preferences: [{ kind: 'DOCTOR', refId: 'lee', rank: 1 }] as any });
  const J = makeNurse('j', { seniorityLevelId: JUNIOR.id, isClinicNurse: false, contractPercent: 200 });
  const { errors } = await fill({
    schedule: makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-06', hoursTargetFullTime: 16 }),
    nurses: [S, J],
    duties: [DAY_DUTY, LONG],
    roles: [NC],
    doctors: [doctor('lee')],
    sessions: [session('lee', '2026-10-06', '09:00', '21:00')],
    existing: [shift('manual-j', 'j', '2026-10-05', DAY_DUTY.id)],
    rules: hoursOnlyRules(),
    setup: { availabilityRequests: [{ id: 'r1', nurseId: 's', date: '2026-10-05', available: true, preferredDutyWindowId: DAY_DUTY.id, status: 'PENDING' }] },
  });
  assert.deepEqual(errors('h1-senior'), []);
});

test('the repair step stays within the hours limit at a period end', async () => {
  const periods: WorkingHoursPeriod[] = [
    { id: 'oct', year: '2026', name: 'Oct19-Nov18', startDate: '2026-10-19', endDate: '2026-11-18', workingHours: 230 },
    { id: 'nov', year: '2026', name: 'Nov19-Dec18', startDate: '2026-11-19', endDate: '2026-12-18', workingHours: 210 },
  ];
  const schedule = makeSchedule({ id: 'r', startDate: '2026-11-17', endDate: '2026-11-22', hoursTargetFullTime: 0 });
  const { errors } = await fill({
    schedule,
    nurses: [makeNurse('s', { preferences: [{ kind: 'DOCTOR', refId: 'lee', rank: 1 }] as any })],
    duties: [DAY_DUTY, duty('l', '09:00', '21:00')],
    roles: [NC],
    doctors: [doctor('lee')],
    sessions: [session('lee', '2026-11-18', '09:00', '21:00')],
    existing: [{ ...shift('m1', 's', '2026-11-17', DAY_DUTY.id), scheduleId: 'r' }],
    rules: hoursOnlyRules(),
    periods,
    setup: { hoursHistory: { schedules: [schedule], assignments: [] } },
  });
  assert.deepEqual(errors('h7-period'), []);
});

test('the repair step never makes a run of late shifts', async () => {
  const S = duty('s', '09:00', '19:00');
  const L = duty('l', '13:00', '21:00');
  const A = duty('a', '09:00', '15:00');
  const E = duty('e', '09:00', '17:00');
  const { errors } = await fill({
    schedule: makeSchedule({ startDate: '2026-10-07', endDate: '2026-10-09', hoursTargetFullTime: 24 }),
    nurses: [makeNurse('n')],
    duties: [S, L, A, E],
    doctors: ['docX', 'docY', 'docZ'].map((id) => doctor(id)),
    sessions: [session('docY', '2026-10-07', '13:00', '21:00'), session('docX', '2026-10-08', '15:00', '19:00'), session('docZ', '2026-10-09', '09:00', '17:00')],
    rules: [
      ...hoursOnlyRules(),
      rule('rule-s1', 'MAX_CONSECUTIVE_LATE_DUTIES', 1, { params: { thresholdTime: '21:00' } }),
      rule('rule-h7-max-hours', 'MAX_WORKING_HOURS_PER_PERIOD', 100),
      rule('rule-h1', 'SENIOR_ON_DUTY', 1, { enabled: false }),
    ],
  });
  assert.deepEqual(errors('s1-late'), []);
});

test("leave alone never breaks the hours limit (a part time nurse's long leave)", async () => {
  const periods: WorkingHoursPeriod[] = [{ id: 'p1', year: '2026', name: 'Oct19-Nov18', startDate: '2026-10-19', endDate: '2026-11-18', workingHours: 230 }];
  const { result, errors } = await fill({
    schedule: makeSchedule({ startDate: '2026-10-19', endDate: '2026-11-18', hoursTargetFullTime: 230 }),
    nurses: [makeNurse('half', { contractPercent: 50 }), makeNurse('full')],
    duties: [DAY_DUTY],
    leave: [makeLeave({ id: 'lv', nurseId: 'half', startDate: '2026-10-19', endDate: '2026-11-03' })], // 16 days x 8 h = 128 h, goal 115 h
    rules: hoursOnlyRules(),
    periods,
  });
  assert.equal(result.assignments.filter((a) => a.nurseId === 'half').length, 0);
  assert.deepEqual(errors('h7'), []);
});

test('a nurse with leave may take a shift up to the hours limit, as the checker allows', async () => {
  // 40 h week, 4 leave days (32 h): a 10 h shift makes 42 h, the 105% limit. The engine
  // refused it (it measured 5% of the 8 h left, not of the 40 h goal) and left Dr A alone.
  const X = duty('x', '09:00', '19:00');
  const { result, errors, report } = await fill({
    schedule: makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-11', hoursTargetFullTime: 40 }),
    nurses: [makeNurse('n1')],
    duties: [X],
    leave: [makeLeave({ id: 'lv', nurseId: 'n1', startDate: '2026-10-05', endDate: '2026-10-08' })],
    doctors: [doctor('docA')],
    sessions: [session('docA', '2026-10-09', '09:00', '19:00')],
    rules: hoursOnlyRules(),
  });
  assert.ok(result.assignments.some((a) => a.doctorId === 'docA'), 'Dr A gets the nurse');
  assert.deepEqual(errors('h7'), []);
  assert.equal(report.findings.filter((f) => f.id.startsWith('unassigned-session')).length, 0);
});

test("strict allocation follows the doctor's profile, as the checker does", async () => {
  // Dr A's profile says Cardiology; one old session was saved under Pediatrics. The engine
  // took that old session's specialty as his too and paired Mary (Pediatrics only) with him.
  const specialties = [{ id: 'sp-card', name: 'Cardiology', code: 'CARD' }, { id: 'sp-ped', name: 'Pediatrics', code: 'PED' }];
  const { errors } = await fill({
    schedule: makeSchedule({ startDate: '2026-10-07', endDate: '2026-10-08', hoursTargetFullTime: 16 }),
    nurses: [makeNurse('mary', { preferences: [{ kind: 'SPECIALTY', refId: 'sp-ped', rank: 1 }] as any })],
    duties: [DAY_DUTY],
    doctors: [doctor('docA', ['sp-card'])],
    specialties,
    sessions: [session('docA', '2026-10-07', '09:00', '17:00', 'sp-ped'), session('docA', '2026-10-08', '09:00', '17:00', 'sp-card')],
    rules: hoursOnlyRules(),
  });
  assert.deepEqual(errors('h8'), []);
});

test('Fill empty cells only respects an approved day off', async () => {
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-06', hoursTargetFullTime: 16 });
  const old = { ...shift('g1', 'n', '2026-10-05', DAY_DUTY.id), source: 'GENERATED' as const };
  const { result } = await fill({
    schedule,
    nurses: [makeNurse('n')],
    duties: [DAY_DUTY],
    existing: [old],
    mode: 'EMPTY_ONLY',
    rules: hoursOnlyRules(),
    setup: { availabilityRequests: [{ id: 'r', nurseId: 'n', date: '2026-10-05', available: false, status: 'APPROVED' }] },
  });
  assert.equal(result.assignments.some((a) => a.date === '2026-10-05'), false);
});

test('the free nurse step tries later hours when nobody can start at opening time', async () => {
  // Everyone worked until 11 pm the day before, so with 11 h rest nobody can start at 9.
  // The step gave up for the whole day; an 11 to 7 shift covers from 11.
  const N = duty('n', '14:00', '23:00');
  const nurses = ['a', 'b', 'c'].map((id) => makeNurse(id, { capabilityIds: [NC.id, PHL.id] }));
  const prior = nurses.map((n) => ({ ...shift('p' + n.id, n.id, '2026-10-07', 'n'), scheduleId: 'prev', source: 'GENERATED' as const }));
  const { report } = await fill({
    schedule: makeSchedule({ startDate: '2026-10-08', endDate: '2026-10-08', hoursTargetFullTime: 8 }),
    nurses,
    duties: [N, duty('e', '09:00', '17:00'), duty('m', '11:00', '19:00'), duty('l', '13:00', '21:00')],
    roles: [NC, PHL],
    setup: { priorAssignments: prior },
  });
  const gaps = report.findings.filter((f) => f.id.startsWith('cov-gap')).map((f) => f.message);
  assert.equal(gaps.length, 1);
  assert.match(gaps[0], /09:00 to 11:00/);
});
