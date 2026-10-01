import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import type { Assignment, DoctorSession } from '../../src/types';
import { makeNurse, makeSchedule, SENIOR } from './fixtures';

// A small clinic: full day, early and late duties; a free nurse must do blood collection.
const D = { id: 'd', name: 'Full', acronym: 'D', startTime: '09:00', endTime: '21:00', color: '#000', active: true };
const E = { id: 'e', name: 'Early', acronym: 'E', startTime: '09:00', endTime: '17:00', color: '#000', active: true };
const L = { id: 'l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00', color: '#000', active: true };
const DUTIES: any[] = [D, E, L];
const HOURS: Record<string, number> = { d: 12, e: 8, l: 8 };
const JUNIOR = { id: 'jun', name: 'Staff', rank: 2, isSenior: false, color: '#111' };
const LEVELS: any[] = [SENIOR, JUNIOR];
const PHL = { id: 'role-phl', name: 'Blood Collection', acronym: 'PHL', defaultDailyQuota: 1 };
const NC = { id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', defaultDailyQuota: 1 };
const ROLES: any[] = [PHL, NC];
const DOCTORS: any[] = ['A', 'B', 'C', 'D'].map((x) => ({ id: 'doc' + x, fullName: 'Dr ' + x, specialtyIds: [], weeklyPattern: [], active: true }));
const HOLIDAY = '2026-11-20';

function nurses(count: number, seniors = 3) {
  return Array.from({ length: count }, (_, i) =>
    makeNurse('n' + i, {
      fullName: 'Nurse ' + String.fromCharCode(65 + i),
      seniorityLevelId: i < seniors ? SENIOR.id : JUNIOR.id,
      capabilityIds: i % 2 === 0 ? [PHL.id] : [],
    })
  );
}

function month(): DoctorSession[] {
  const out: DoctorSession[] = [];
  for (let d = 1; d <= 28; d++) {
    const date = `2026-11-${String(d).padStart(2, '0')}`;
    const weekday = new Date(date + 'T00:00:00Z').getUTCDay();
    DOCTORS.forEach((doc, i) => {
      if ((weekday !== 0 && weekday !== 6) || i < 2) {
        out.push({ id: `s-${doc.id}-${date}`, doctorId: doc.id, date, startTime: i % 2 ? '13:00' : '09:00', endTime: i % 2 ? '21:00' : '17:00', specialtyId: 'spec', source: 'PATTERN', cancelled: false } as DoctorSession);
      }
    });
  }
  return out;
}

const SCHEDULE = makeSchedule({ startDate: '2026-11-01', endDate: '2026-11-28', hoursTargetFullTime: 160 });

async function generate(staff = nurses(10), opts: { existing?: Assignment[]; prior?: Assignment[]; sessions?: DoctorSession[] } = {}) {
  const sessions = opts.sessions || month();
  const setup = { holidayDates: [HOLIDAY], priorAssignments: opts.prior || [] };
  const result = await SchedulingEngine.generate(
    SCHEDULE, opts.existing ? 'EMPTY_ONLY' : 'GENERATE_ALL', opts.existing || [], staff, LEVELS, DUTIES, ROLES, [], sessions, [], [], [], undefined, [], DOCTORS, [], setup
  );
  const report = ScheduleValidator.validate(SCHEDULE, result.assignments, staff, LEVELS, DUTIES, sessions, [], [], ROLES, [], [], [], DOCTORS, [], setup);
  return { result, report, sessions, staff };
}

const errorsOf = (report: any, prefix: string) => report.findings.filter((f: any) => f.severity === 'ERROR' && f.id.startsWith(prefix));

test('hours are spread evenly over the month and every doctor gets a nurse', async () => {
  for (const count of [7, 10, 14]) {
    const { result } = await generate(nurses(count));
    const weeks = [0, 0, 0, 0];
    result.assignments.forEach((a) => (weeks[Math.floor((+a.date.slice(8) - 1) / 7)] += HOURS[a.dutyWindowId]));
    const avg = weeks.reduce((x, y) => x + y, 0) / 4;
    weeks.forEach((w) => assert.ok(Math.abs(w - avg) / avg < 0.25, `${count} nurses: weeks ${weeks.join('/')}`));
    assert.equal(result.unmetSlotsCount, 0, `${count} nurses`);
  }
});

test('the generated month passes the checker: free nurse every hour, a senior every day', async () => {
  const { report } = await generate();
  assert.deepEqual(report.findings.filter((f: any) => f.severity === 'ERROR').map((f: any) => f.message), []);
});

test('the Nurse Clinic nurse is qualified for blood collection and not with a doctor', async () => {
  const { result, staff } = await generate();
  const nc = result.assignments.filter((a) => a.clinicalRoleId === NC.id);
  assert.ok(nc.length >= 27);
  nc.forEach((a) => assert.ok(staff.find((n) => n.id === a.nurseId)!.capabilityIds.includes(PHL.id)));
  assert.equal(result.assignments.filter((a) => a.clinicalRoleId === PHL.id).length, 0, 'no separate blood collection nurse');
});

test('a doctor\'s nurse always overlaps the doctor\'s session', async () => {
  const { result, sessions } = await generate();
  result.assignments.filter((a) => a.kind === 'DOCTOR').forEach((a) => {
    const s = sessions.find((x) => x.doctorId === a.doctorId && x.date === a.date)!;
    const d = DUTIES.find((x) => x.id === a.dutyWindowId);
    assert.ok(d.startTime < s.endTime && d.endTime > s.startTime, `${a.date} ${a.doctorId}`);
  });
});

test('on a public holiday one nurse covers the clinic and doctor sessions are ignored', async () => {
  const { result } = await generate();
  const holiday = result.assignments.filter((a) => a.date === HOLIDAY);
  assert.equal(holiday.length, 1);
  assert.equal(holiday[0].kind, 'CLINICAL_ROLE');
  assert.equal(holiday[0].dutyWindowId, 'd'); // the whole opening hours
});

test('the checker reports a day without a senior nurse', async () => {
  const { report } = await generate(nurses(10, 0));
  assert.ok(errorsOf(report, 'h1-senior-').length > 0);
});

test('the last days of the previous roster count for consecutive days', async () => {
  const staff = nurses(10);
  const prior: Assignment[] = ['26', '27', '28', '29', '30', '31'].map((d) => ({
    id: `p-${d}`, scheduleId: 'oct', nurseId: 'n0', date: `2026-10-${d}`, dutyWindowId: 'e', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED',
  } as Assignment));
  const { result, report } = await generate(staff, { prior });
  // 6 days in a row already: n0 must be off on the 1st
  assert.ok(!result.assignments.some((a) => a.nurseId === 'n0' && a.date === '2026-11-01'));
  assert.equal(errorsOf(report, 'h2-days-n0').length, 0);
});

test('shifts already fixed later in the month are respected (no 7 days in a row)', async () => {
  const staff = nurses(10);
  const fixed: Assignment[] = ['06', '07'].map((d) => ({
    id: `m-${d}`, scheduleId: SCHEDULE.id, nurseId: 'n1', date: `2026-11-${d}`, dutyWindowId: 'e', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'MANUAL',
  } as Assignment));
  const { report } = await generate(staff, { existing: fixed });
  assert.equal(errorsOf(report, 'h2-days-n1').length, 0);
});

// One doctor, 09:00 to 21:00, for the preference and cover tests below
const ONE_DAY = makeSchedule({ startDate: '2026-11-02', endDate: '2026-11-02', hoursTargetFullTime: 12 });
const DR_X = { id: 'docX', fullName: 'Dr X', specialtyIds: [], weeklyPattern: [], active: true };
const LONG_SESSION = [{ id: 's-x', doctorId: 'docX', date: '2026-11-02', startTime: '09:00', endTime: '21:00', specialtyId: 'spec', source: 'PATTERN', cancelled: false } as DoctorSession];
const NINE_TO_SEVEN = { id: 'x97', name: '9-7', acronym: '9-7', startTime: '09:00', endTime: '19:00', color: '#000', active: true };
const prefers = (rank: number) => [{ kind: 'DOCTOR', refId: 'docX', rank }] as any;
const freeNurse = makeNurse('free', { capabilityIds: [PHL.id], seniorityLevelId: SENIOR.id });

async function oneDay(staff: any[], duties: any[], rules: any[] = [], prior: Assignment[] = []) {
  const result = await SchedulingEngine.generate(
    ONE_DAY, 'GENERATE_ALL', [], staff, LEVELS, duties, ROLES, [], LONG_SESSION, [], [], rules, undefined, [], [DR_X] as any, [], { priorAssignments: prior }
  );
  return result.assignments.filter((a) => a.kind === 'DOCTOR');
}

test('preference order is exact: rank 3 beats rank 5, even when the rank 5 nurse is senior', async () => {
  const staff = [freeNurse, makeNurse('rank5', { preferences: prefers(5) }), makeNurse('rank3', { seniorityLevelId: JUNIOR.id, preferences: prefers(3) })];
  const withDoctor = await oneDay(staff, DUTIES);
  assert.equal(withDoctor[0]?.nurseId, 'rank3');
});

test('full cover comes before preference: a lower ranked nurse who covers the whole session wins', async () => {
  // The first choice nurse worked a late shift yesterday and may not do two in a row.
  const lateRule = { id: 'rule-s1', name: 'Consecutive late duties', templateKey: 'MAX_CONSECUTIVE_LATE_DUTIES', enabled: true, severity: 'HARD', value: 1 } as any;
  const prior = [{ id: 'p', scheduleId: 'prev', nurseId: 'first', date: '2026-11-01', dutyWindowId: 'l', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED' } as Assignment];
  const staff = [freeNurse, makeNurse('first', { preferences: prefers(1) }), makeNurse('second', { preferences: prefers(2) })];
  const withDoctor = await oneDay(staff, [D, L, NINE_TO_SEVEN], [lateRule], prior);
  assert.equal(withDoctor.length, 1);
  assert.equal(withDoctor[0].nurseId, 'second');
  assert.equal(withDoctor[0].dutyWindowId, 'd');
});

test('a doctor only partly covered gets a second nurse for the missing hours', async () => {
  // No shift covers 09:00 to 21:00, so the doctor needs two nurses.
  const staff = [freeNurse, makeNurse('a', { preferences: prefers(1) }), makeNurse('b', { preferences: prefers(2) })];
  const withDoctor = await oneDay(staff, [NINE_TO_SEVEN, L], []);
  assert.equal(withDoctor.length, 2);
  const ends = withDoctor.map((a) => (a.dutyWindowId === 'l' ? '21:00' : '19:00')).sort();
  assert.deepEqual(ends, ['19:00', '21:00']);
});

test('nobody goes over her hours goal when there are enough nurses', async () => {
  for (const count of [10, 14]) {
    const { result } = await generate(nurses(count));
    const hours = new Map<string, number>();
    result.assignments.forEach((a) => hours.set(a.nurseId, (hours.get(a.nurseId) || 0) + HOURS[a.dutyWindowId]));
    hours.forEach((h, id) => assert.ok(h <= 160, `${count} nurses: ${id} has ${h}h`));
  }
});

test('hours are kept back so the last days are staffed like the others', async () => {
  const { result } = await generate(nurses(10));
  const last = result.assignments.filter((a) => a.date >= '2026-11-26' && a.kind === 'DOCTOR').length;
  // 26 to 28 Nov: Thu and Fri have 4 doctors, Sat has 2
  assert.equal(last, 10);
});
