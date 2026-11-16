import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession, DutyWindow } from '../../src/types';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { effectiveDoctorCoverage, overlaps, resolveClinicSetup } from '../../src/services/engine/clinicModel';
import { fillTimedDoctorGaps, normalizeGeneratedDoctorCoverage } from '../../src/services/engine/timedAllocation';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLock, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-18';
const doctors: Doctor[] = ['a', 'b'].map(id => ({ id, fullName: `Doctor ${id}`, active: true, weeklyPattern: [], specialtyIds: [] } as Doctor));
const session = (doctorId: string, startTime = '09:00', endTime = '17:00'): DoctorSession => ({ id: `s-${doctorId}`, doctorId, date,
  startTime, endTime, cancelled: false, source: 'MANUAL' } as DoctorSession);
const generated = (id: string, nurseId = id, doctorId = 'a'): Assignment => ({ id, nurseId, scheduleId: 'sched-1', date,
  dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId, locked: false, source: 'GENERATED' });
const context = (assignments: Assignment[], sessions = [session('a')], duties = [DAY_DUTY]) => ({ assignments, sessions, duties,
  dates: [date], doctors, nurses: assignments.map(a => makeNurse(a.nurseId)), roles: [], clinic: resolveClinicSetup({ openTime: '09:00', closeTime: '17:00' }),
  minFreeNurses: 0, movable: (a: Assignment) => a.source === 'GENERATED' && !a.locked, present: () => true,
  canCover: () => true, canPair: () => true, canExtend: () => true });

test('generated handover covers only missing doctor times and retains paid duties', () => {
  const early: DutyWindow = { ...DAY_DUTY, id: 'early', endTime: '15:00' };
  const late: DutyWindow = { ...DAY_DUTY, id: 'late', startTime: '13:00', endTime: '21:00' };
  const list = [{ ...generated('early'), dutyWindowId: early.id }, { ...generated('late'), dutyWindowId: late.id }];
  const result = normalizeGeneratedDoctorCoverage(context(list, [session('a', '09:00', '21:00')], [early, late]));
  assert.deepEqual(result.find(a => a.id === 'early')?.doctorCoverage, [{ doctorId: 'a', startTime: '09:00', endTime: '15:00' }]);
  assert.deepEqual(result.find(a => a.id === 'late')?.doctorCoverage, [{ doctorId: 'a', startTime: '15:00', endTime: '21:00' }]);
  assert.deepEqual(result.map(a => a.dutyWindowId), ['early', 'late']);
});

test('one nurse spanning the full session is preferred to redundant partial generated cover', () => {
  const half = { ...DAY_DUTY, id: 'half', endTime: '13:00' };
  const list = [{ ...generated('half'), dutyWindowId: half.id }, generated('full')];
  const result = normalizeGeneratedDoctorCoverage(context(list, [session('a')], [half, DAY_DUTY]));
  assert.equal(result.find(a => a.id === 'half')?.kind, 'CLINICAL_ROLE');
  assert.deepEqual(result.find(a => a.id === 'full')?.doctorCoverage, [{ doctorId: 'a', startTime: '09:00', endTime: '17:00' }]);
});

test('protected explicit manual cover is never widened or trimmed by generation normalization', () => {
  const manual: Assignment = { ...generated('manual'), source: 'MANUAL', doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }] };
  const before = JSON.stringify(manual);
  const result = normalizeGeneratedDoctorCoverage(context([manual, generated('next')]));
  assert.equal(result[0], manual);
  assert.equal(JSON.stringify(manual), before);
  assert.deepEqual(result[1].doctorCoverage, [{ doctorId: 'a', startTime: '13:00', endTime: '17:00' }]);
});

test('one nurse covers sequential ordinary doctors within their existing paid duty', () => {
  const own = { ...generated('own'), doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }] };
  const result = fillTimedDoctorGaps(context([own], [session('a', '09:00', '13:00'), session('b', '13:00', '17:00')]));
  assert.deepEqual(result[0].doctorCoverage, [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }, { doctorId: 'b', startTime: '13:00', endTime: '17:00' }]);
  assert.equal(result[0].secondDoctorId, 'b');
  assert.equal(result[0].dutyWindowId, DAY_DUTY.id);
});

test('sequential cover may use a permitted configured duty extension and respects refusal', () => {
  const short = { ...DAY_DUTY, id: 'short', endTime: '13:00' };
  const own = { ...generated('own'), dutyWindowId: short.id, doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }] };
  const ctx = context([own], [session('a', '09:00', '13:00'), session('b', '13:00', '17:00')], [short, DAY_DUTY]);
  assert.equal(fillTimedDoctorGaps(ctx)[0].dutyWindowId, DAY_DUTY.id);
  assert.equal(fillTimedDoctorGaps({ ...ctx, canExtend: () => false })[0].dutyWindowId, short.id);
});

test('automatic sequential generation uses one duty for two ordinary doctors without overlap', async () => {
  const result = await SchedulingEngine.generate(makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }), 'GENERATE_ALL', [],
    [makeNurse('n')], [SENIOR], [DAY_DUTY], [], [], [session('a', '09:00', '13:00'), session('b', '13:00', '17:00')], [], [], hoursOnlyRules(), undefined, [], doctors);
  assert.equal(result.assignments.length, 1);
  assert.deepEqual(result.assignments[0].doctorCoverage, [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }, { doctorId: 'b', startTime: '13:00', endTime: '17:00' }]);
  assert.equal(result.unmetSlotsCount, 0);
  assert.equal(result.doctorSessionsTotal, 2);
  assert.equal(result.doctorFallbackPairingsCount, 2);
});

test('filling a timed pin keeps its saved assignment identity and intervals', async () => {
  const pinned: Assignment = { ...generated('existing-id', 'n'), locked: true, source: 'LOCK',
    doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }] };
  const pin = makeLock('n', date, { assignmentKind: 'DOCTOR', targetRefId: 'a', doctorCoverage: pinned.doctorCoverage });
  const result = await SchedulingEngine.generate(makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }), 'GENERATE_ALL', [pinned],
    [makeNurse('n')], [SENIOR], [DAY_DUTY], [], [], [session('a')], [pin], [], hoursOnlyRules(), undefined, [], doctors);
  assert.equal(result.assignments[0].id, 'existing-id');
  assert.deepEqual(result.assignments[0].doctorCoverage, pinned.doctorCoverage);
});

test('a selected date fill keeps generated duties outside the requested range fixed', async () => {
  const prior = { ...generated('prior', 'n'), date: '2026-11-17' };
  const result = await SchedulingEngine.generate(makeSchedule({ startDate: prior.date, endDate: date, hoursTargetFullTime: 16 }), 'GENERATE_ALL', [prior],
    [makeNurse('n')], [SENIOR], [DAY_DUTY], [], [], [session('a')], [], [], hoursOnlyRules(), undefined, [], doctors, [], undefined,
    { onlyDates: { start: date, end: date } });
  assert.equal(result.assignments.find(a => a.id === prior.id), prior);
});

test('matching pins keep their assignment identity when legacy optional references are null', async () => {
  const pinned = { ...generated('legacy-pin', 'n'), locked: true, source: 'LOCK',
    secondDoctorId: null, clinicalRoleId: null, specialtyId: null,
    doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }] } as unknown as Assignment;
  const pin = makeLock('n', date, { assignmentKind: 'DOCTOR', targetRefId: 'a', doctorCoverage: pinned.doctorCoverage });
  const result = await SchedulingEngine.generate(makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }), 'GENERATE_ALL', [pinned],
    [makeNurse('n')], [SENIOR], [DAY_DUTY], [], [], [session('a')], [pin], [], hoursOnlyRules(), undefined, [], doctors);
  assert.equal(result.assignments[0].id, pinned.id);
});

test('generated exact intervals never overlap another nurse for the same doctor', () => {
  const result = normalizeGeneratedDoctorCoverage(context([generated('a'), generated('b')]));
  const intervals = result.flatMap(a => effectiveDoctorCoverage(a, DAY_DUTY, [session('a')]).map(r => ({ ...r, nurseId: a.nurseId })));
  assert.equal(intervals.some((a, i) => intervals.slice(i + 1).some(b => a.nurseId !== b.nurseId && a.doctorId === b.doctorId && overlaps(a.startTime, a.endTime, b.startTime, b.endTime))), false);
});

test('partial Float cover is allocated before only the remaining low acuity shared times', () => {
  const short = { ...DAY_DUTY, id: 'half', endTime: '13:00' };
  const own = { ...generated('own'), doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '17:00' }] };
  const helper: Assignment = { ...generated('helper'), kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', doctorId: undefined, dutyWindowId: short.id };
  const ctx = { ...context([own, helper], [session('a'), session('b')], [short, DAY_DUTY]),
    doctors: doctors.map(d => ({ ...d, lowAcuity: true })), canExtend: () => false };
  const before = JSON.stringify(ctx.assignments);
  const result = fillTimedDoctorGaps(ctx);
  assert.deepEqual(result.find(a => a.id === 'helper')?.doctorCoverage, [{ doctorId: 'b', startTime: '09:00', endTime: '13:00' }]);
  assert.deepEqual(result.find(a => a.id === 'own')?.doctorCoverage, [{ doctorId: 'a', startTime: '09:00', endTime: '17:00' },
    { doctorId: 'b', startTime: '13:00', endTime: '17:00' }]);
  assert.equal(JSON.stringify(ctx.assignments), before);
});

test('simultaneous ordinary doctor cover is never added even with a remaining shortage', () => {
  const own = { ...generated('own'), doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '17:00' }] };
  const result = fillTimedDoctorGaps(context([own], [session('a'), session('b')]));
  assert.equal(result[0].secondDoctorId, undefined);
  assert.deepEqual(result[0].doctorCoverage, own.doctorCoverage);
});

test('Float relief never consumes the last required Nurse Clinic nurse', () => {
  const own = { ...generated('own'), doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '17:00' }] };
  const helper: Assignment = { ...generated('helper'), kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', doctorId: undefined };
  const ctx = { ...context([own, helper], [session('a'), session('b')]), minFreeNurses: 1,
    roles: [{ id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 }],
    nurses: [makeNurse('own'), makeNurse('helper', { capabilityIds: ['role-nurse-clinic'] })],
    doctors: doctors.map(d => ({ ...d, lowAcuity: true })) };
  const result = fillTimedDoctorGaps(ctx);
  assert.equal(result.find(a => a.id === 'helper')?.kind, 'CLINICAL_ROLE');
  assert.equal(result.find(a => a.id === 'own')?.secondDoctorId, 'b');
});

test('a nurse never acquires a third distinct doctor through residual Float time', () => {
  const own = { ...generated('own'), secondDoctorId: 'b', doctorCoverage: [
    { doctorId: 'a', startTime: '09:00', endTime: '11:00' }, { doctorId: 'b', startTime: '11:00', endTime: '13:00' }] };
  const result = fillTimedDoctorGaps(context([own], [session('a', '09:00', '11:00'), session('b', '11:00', '13:00'), session('c', '13:00', '17:00')]));
  assert.deepEqual(result[0].doctorCoverage, own.doctorCoverage);
});

test('new exact cover still requires clinical eligibility and available staff', () => {
  const own: Assignment = { ...generated('own'), kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', doctorId: undefined };
  const ctx = context([own]);
  assert.equal(fillTimedDoctorGaps({ ...ctx, canPair: () => false })[0], own);
  assert.equal(fillTimedDoctorGaps({ ...ctx, present: () => false })[0], own);
});

test('configured maximum hours alone governs a sequential duty extension', async () => {
  const short = { ...DAY_DUTY, id: 'short', endTime: '13:00' };
  const schedule = makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 4 });
  const sessions = [session('a', '09:00', '13:00'), session('b', '13:00', '17:00')];
  const generate = (disabled: boolean) => SchedulingEngine.generate(schedule, 'GENERATE_ALL', [], [makeNurse('n')], [SENIOR], [short, DAY_DUTY],
    [], [], sessions, [], [], [...hoursOnlyRules(), { id: 'rule-h7-max-hours', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', name: 'Maximum working hours',
      enabled: !disabled, severity: 'HARD', value: 105 } as any], undefined, [], doctors);
  const limited = await generate(false), unlimited = await generate(true);
  assert.equal(limited.assignments[0].dutyWindowId, short.id);
  assert.equal(limited.assignments[0].secondDoctorId, undefined);
  assert.equal(unlimited.assignments[0].dutyWindowId, DAY_DUTY.id);
  assert.equal(unlimited.assignments[0].doctorCoverage?.length, 2);
});
