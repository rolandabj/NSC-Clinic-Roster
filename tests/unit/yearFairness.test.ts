import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { computeYearToDate, earlierRostersThisYear, latestPublishedVersion } from '../../src/services/fairness/yearToDate';
import { yearToDateSeeds } from '../../src/services/fairness/yearSeed';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, DoctorSession, DutyWindow, ScheduleVersion } from '../../src/types';
import type { YearToDate } from '../../src/services/engine/clinicModel';

const LATE: DutyWindow = { ...DAY_DUTY, id: 'duty-l', name: 'Late', acronym: 'L', startTime: '13:00', endTime: '21:00' };

function shift(nurseId: string, date: string, overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: `a-${nurseId}-${date}`,
    scheduleId: 'old',
    nurseId,
    date,
    dutyWindowId: DAY_DUTY.id,
    kind: 'CLINICAL_ROLE',
    clinicalRoleId: 'role-float',
    locked: false,
    source: 'GENERATED',
    ...overrides,
  };
}

test('computeYearToDate counts weekend days, holidays, late shifts and Nurse Clinic per nurse', () => {
  const january = makeSchedule({ id: 'jan', startDate: '2026-01-01', endDate: '2026-01-31' });
  const february = makeSchedule({ id: 'feb', startDate: '2026-02-01', endDate: '2026-02-28' });
  const ytd = computeYearToDate({
    rosters: [
      {
        schedule: january,
        assignments: [
          shift('n1', '2026-01-01'), // holiday (Thursday)
          shift('n1', '2026-01-03', { dutyWindowId: LATE.id }), // Saturday, late
          shift('n1', '2026-01-03', { id: 'dup', dutyWindowId: LATE.id }), // same day again: not counted twice
          shift('n1', '2026-01-04', { clinicalRoleId: 'role-nurse-clinic' }), // Sunday, Nurse Clinic
          shift('n2', '2026-01-05', { dutyWindowId: LATE.id }), // Monday, late
          shift('n2', '2026-02-07'), // outside January's dates: not counted for January
        ],
      },
      { schedule: february, assignments: [shift('n1', '2026-02-07', { clinicalRoleId: 'role-nc-custom' })] },
    ],
    dutyWindows: [DAY_DUTY, LATE],
    holidayDates: ['2026-01-01'],
    roles: [{ id: 'role-nc-custom', name: 'Nurse Clinic', acronym: 'NC', defaultDailyQuota: 1 } as any],
  });
  assert.deepEqual(ytd.n1, { weekendDays: 3, holidays: 1, lateShifts: 1, nurseClinic: 2, rosters: 2 });
  assert.deepEqual(ytd.n2, { weekendDays: 0, holidays: 0, lateShifts: 1, nurseClinic: 0, rosters: 1 });
});

test('a later late time counts fewer shifts as late', () => {
  const ytd = computeYearToDate({
    rosters: [{ schedule: makeSchedule(), assignments: [shift('n1', '2026-10-05', { dutyWindowId: LATE.id })] }],
    dutyWindows: [DAY_DUTY, LATE],
    holidayDates: [],
    lateThreshold: '21:30',
  });
  assert.equal(ytd.n1.lateShifts, 0);
});

test('only earlier rosters of the same year count, and the latest published version is used', () => {
  const current = makeSchedule({ id: 'cur', startDate: '2026-10-05', endDate: '2026-10-11' });
  const list = [
    current,
    makeSchedule({ id: 'sep', startDate: '2026-09-01', endDate: '2026-09-30', status: 'PUBLISHED' }),
    makeSchedule({ id: 'old-year', startDate: '2025-12-01', endDate: '2025-12-31' }),
    makeSchedule({ id: 'archived', startDate: '2026-03-01', endDate: '2026-03-31', status: 'ARCHIVED' }),
    makeSchedule({ id: 'later', startDate: '2026-11-01', endDate: '2026-11-30' }),
  ];
  assert.deepEqual(earlierRostersThisYear(current, list).map((s) => s.id), ['sep']);

  const version = (number: number, overrides: Partial<ScheduleVersion> = {}) =>
    ({ id: `v${number}`, scheduleId: 'sep', number, isPublished: true, snapshot: { assignments: [] }, ...overrides }) as any;
  const latest = latestPublishedVersion([version(1), version(3, { kind: 'BACKUP' }), version(2), version(4, { isPublished: false })]);
  assert.equal(latest?.id, 'v2');
});

test('the head start is relative to the average, scaled by contract and capped at 3', () => {
  const full = makeNurse('full');
  const half = makeNurse('half', { contractPercent: 50 });
  const busy = makeNurse('busy');
  const ytd: YearToDate = {
    full: { weekendDays: 10, holidays: 0, lateShifts: 0, nurseClinic: 0, rosters: 5 },
    half: { weekendDays: 5, holidays: 0, lateShifts: 0, nurseClinic: 0, rosters: 5 },
    busy: { weekendDays: 30, holidays: 0, lateShifts: 0, nurseClinic: 0, rosters: 5 },
  };
  const seeds = yearToDateSeeds(ytd, [full, half, busy]);
  // 45 weekend days over 2.5 full time shares of 5 rosters: 18 expected for a full timer, 9 for a half timer.
  assert.equal(seeds.get('busy')?.weekendDays, 3); // 12 above, capped
  assert.equal(seeds.get('full')?.weekendDays, -3); // 8 below, capped
  assert.ok(Math.abs((seeds.get('half')?.weekendDays ?? 0) + 3) < 1e-9); // 4 below her 9, capped
  assert.equal(yearToDateSeeds(undefined, [full]).size, 0);
});

/** Two equal nurses, one doctor every day for two weeks: each nurse works 7 of the 14 days. */
async function twoWeeks(yearToDate?: YearToDate) {
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-18', hoursTargetFullTime: 56 });
  const sessions: DoctorSession[] = [];
  for (let d = 5; d <= 18; d++) {
    const date = `2026-10-${String(d).padStart(2, '0')}`;
    sessions.push({ id: `s-${date}`, doctorId: 'doc1', date, startTime: '09:00', endTime: '17:00', source: 'PATTERN', cancelled: false } as DoctorSession);
  }
  const result = await SchedulingEngine.generate(
    schedule,
    'GENERATE_ALL',
    [],
    [makeNurse('n1'), makeNurse('n2')],
    [SENIOR],
    [DAY_DUTY],
    [],
    [],
    sessions,
    [],
    [],
    hoursOnlyRules(),
    undefined,
    [],
    [],
    [],
    { yearToDate }
  );
  const weekendDays = (id: string) =>
    result.assignments.filter((a) => a.nurseId === id && ['2026-10-10', '2026-10-11', '2026-10-17', '2026-10-18'].includes(a.date)).length;
  return { result, n1: weekendDays('n1'), n2: weekendDays('n2') };
}

test('a nurse with more weekends earlier this year gets fewer weekend days this roster', async () => {
  const counts = (weekendDays: number) => ({ weekendDays, holidays: 0, lateShifts: 0, nurseClinic: 0, rosters: 8 });
  const even = await twoWeeks();
  const n1Busier = await twoWeeks({ n1: counts(20), n2: counts(10) });
  const n2Busier = await twoWeeks({ n1: counts(10), n2: counts(20) });

  for (const run of [even, n1Busier, n2Busier]) {
    assert.equal(run.result.unmetSlotsCount, 0); // the doctor still has a nurse every day
    assert.equal(run.n1 + run.n2, 4);
  }
  assert.equal(even.n1, even.n2); // without the year to date the weekends are shared evenly
  assert.ok(n1Busier.n1 < n1Busier.n2, `n1 ${n1Busier.n1} vs n2 ${n1Busier.n2}`);
  assert.ok(n2Busier.n2 < n2Busier.n1, `n1 ${n2Busier.n1} vs n2 ${n2Busier.n2}`);
});
