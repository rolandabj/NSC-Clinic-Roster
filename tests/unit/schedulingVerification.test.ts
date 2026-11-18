import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, DoctorSession, Nurse, Rule } from '../../src/types';
import { runSchedulingWorker } from '../../src/services/engine/schedulingWorkerRunner';
import { searchSchedule } from '../../src/services/engine/schedulingSearch';
import type { SchedulingRunInput } from '../../src/services/engine/workerProtocol';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeLock, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-18', tomorrow = '2026-11-19';
const minute = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
const doctor = (id: string, lowAcuity = false) => ({ id, fullName: `Dr ${id}`, active: true, lowAcuity, specialtyIds: [], weeklyPattern: [] });
const session = (doctorId: string, day = date, startTime = '09:00', endTime = '17:00'): DoctorSession => ({
  id: `${doctorId}-${day}`, doctorId, date: day, startTime, endTime, specialtyId: '', source: 'MANUAL', cancelled: false,
});
const nurse = (id: string, ids: string[], extra: Partial<Nurse> = {}) => makeNurse(id, {
  preferences: ids.map((refId, index) => ({ kind: 'DOCTOR' as const, refId, rank: index + 1 })),
  doctorEligibility: { doctorIds: ids, specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-18T08:00:00Z' }, ...extra,
});
const shift = (nurseId: string, day = date, extra: Partial<Assignment> = {}): Assignment => ({
  id: `${nurseId}-${day}`, nurseId, date: day, scheduleId: 'sched-1', dutyWindowId: DAY_DUTY.id,
  kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'GENERATED', locked: false, ...extra,
});
const rules = (): Rule[] => [...hoursOnlyRules(),
  { id: 'rule-h1', name: 'Senior', templateKey: 'SENIOR_ON_DUTY', enabled: false, severity: 'HARD', value: 0 } as Rule,
  { id: 'rule-h7-max-hours', name: 'Maximum hours', templateKey: 'MAX_WORKING_HOURS_PER_PERIOD', enabled: true, severity: 'HARD', value: 100 } as Rule,
];
function input(nurses: Nurse[], sessions: DoctorSession[], extra: Partial<SchedulingRunInput> = {}): SchedulingRunInput {
  return { schedule: makeSchedule({ startDate: date, endDate: sessions.at(-1)?.date || date, hoursTargetFullTime: 8 }),
    mode: 'GENERATE_ALL', nurses, sessions, doctors: [...new Set(sessions.map(s => s.doctorId))].map(id => doctor(id)),
    assignments: [], seniorityLevels: [SENIOR], dutyWindows: [DAY_DUTY], roles: [], specialties: [], locks: [], leaveEntries: [],
    leaveTypes: [], workingHoursPeriods: [], rules: rules(), clinicSetup: { openTime: '09:00', closeTime: '17:00' }, ...extra };
}
async function run(data: SchedulingRunInput) {
  const before = JSON.stringify(data);
  const result = await runSchedulingWorker({ type: 'start', jobId: 'verification', input: data, startedAtMs: 1000, budgetMs: 120000 },
    undefined, { now: () => 1001, search: (candidate, options) => searchSchedule(candidate,
      { ...options, now: () => 1001, maxRounds: 2, maxExamined: 500 }) });
  assert.equal(JSON.stringify(data), before, 'the worker must not mutate its input');
  assert.equal(result.validation.errorCount, 0);
  return result;
}

/** Enumerate every whole session choice in tiny clinics whose ordinary sessions overlap.
 * This oracle knows no engine matching, scoring, interval or validation helpers. */
function exhaustiveOrdinaryCover(data: SchedulingRunInput, blocked = new Set<string>(), fixed = new Map<string, string>(), ncMinimum = 0) {
  const dates = [...new Set(data.sessions.map(s => s.date))];
  const cells = dates.flatMap(day => data.nurses.map(n => ({ nurse: n, day, key: `${n.id}|${day}` })));
  let best = 0;
  const paid = new Map<string, number>(), covered = new Set<string>(), nc = new Map<string, number>();
  function visit(index: number, total: number) {
    if (index === cells.length) {
      if (dates.every(day => (nc.get(day) || 0) >= ncMinimum)) best = Math.max(best, total);
      return;
    }
    const { nurse: n, day, key } = cells[index];
    const choices = blocked.has(key) ? ['OFF'] : fixed.has(key) ? [fixed.get(key)!]
      : ['OFF', ...data.sessions.filter(s => s.date === day && n.doctorEligibility!.doctorIds.includes(s.doctorId)).map(s => s.doctorId)];
    for (const choice of choices) {
      if (choice === 'OFF') { visit(index + 1, total); continue; }
      if ((paid.get(n.id) || 0) + 8 > data.schedule.hoursTargetFullTime * n.contractPercent / 100) continue;
      const clinic = data.sessions.find(s => s.date === day && s.doctorId === choice);
      const coverKey = `${day}|${choice}`;
      if (clinic && covered.has(coverKey)) continue;
      paid.set(n.id, (paid.get(n.id) || 0) + 8);
      if (clinic) covered.add(coverKey);
      if (choice === 'NC') nc.set(day, (nc.get(day) || 0) + 1);
      visit(index + 1, total + (clinic ? minute(clinic.endTime) - minute(clinic.startTime) : 0));
      paid.set(n.id, paid.get(n.id)! - 8);
      covered.delete(coverKey);
      if (choice === 'NC') nc.set(day, nc.get(day)! - 1);
    }
  }
  visit(0, 0);
  return best;
}

/** Count literal minute claims from the returned records, independent of the app's calculations. */
function audit(data: SchedulingRunInput, assignments: Assignment[], unavailable = new Set<string>(), ncMinimum = 0) {
  const claims = new Map<string, Set<string>>(), cells = new Set<string>(), paid = new Map<string, number>();
  let concurrentMinutes = 0;
  for (const a of assignments) {
    const key = `${a.nurseId}|${a.date}`;
    assert.ok(!cells.has(key), 'a nurse has at most one paid shift per date'); cells.add(key);
    assert.ok(!unavailable.has(key), 'an unavailable nurse has no shift');
    const n = data.nurses.find(n => n.id === a.nurseId)!;
    const duty = data.dutyWindows.find(d => d.id === a.dutyWindowId)!;
    assert.ok(n?.active && duty?.active);
    paid.set(n.id, (paid.get(n.id) || 0) + minute(duty.endTime) - minute(duty.startTime));
    const ranges = a.doctorCoverage || [];
    assert.ok(new Set(ranges.map(r => r.doctorId)).size <= 2);
    const ownClaims = new Map<number, Set<string>>();
    for (const range of ranges) {
      assert.ok(n.doctorEligibility!.doctorIds.includes(range.doctorId), 'every covered doctor is clinically permitted');
      const clinic = data.sessions.find(s => s.doctorId === range.doctorId && s.date === a.date)!;
      assert.ok(clinic && minute(range.startTime) >= Math.max(minute(duty.startTime), minute(clinic.startTime)) &&
        minute(range.endTime) <= Math.min(minute(duty.endTime), minute(clinic.endTime)) && range.startTime < range.endTime);
      for (let m = minute(range.startTime); m < minute(range.endTime); m++) {
        const coverKey = `${a.date}|${range.doctorId}|${m}`;
        const covered = claims.get(coverKey) || new Set<string>(); covered.add(a.nurseId); claims.set(coverKey, covered);
        assert.equal(covered.size, 1, 'automatic output never has two nurses for one doctor minute');
        const own = ownClaims.get(m) || new Set<string>(); own.add(range.doctorId); ownClaims.set(m, own);
      }
    }
    for (const doctors of ownClaims.values()) if (doctors.size > 1) {
      assert.equal(doctors.size, 2);
      assert.ok([...doctors].every(id => data.doctors.find(d => d.id === id)?.lowAcuity));
      concurrentMinutes++;
    }
  }
  for (const n of data.nurses) assert.ok((paid.get(n.id) || 0) <= data.schedule.hoursTargetFullTime * n.contractPercent / 100 * 60);
  let missingMinutes = 0;
  for (const s of data.sessions) for (let m = minute(s.startTime); m < minute(s.endTime); m++) {
    if (!claims.has(`${s.date}|${s.doctorId}|${m}`)) missingMinutes++;
  }
  for (const day of new Set(data.sessions.map(s => s.date))) for (let m = 540; m < 1020; m++) {
    const free = assignments.filter(a => {
      const n = data.nurses.find(n => n.id === a.nurseId)!, duty = data.dutyWindows.find(d => d.id === a.dutyWindowId)!;
      return a.date === day && n.capabilityIds.includes('role-nurse-clinic') && minute(duty.startTime) <= m && minute(duty.endTime) > m &&
        !(a.doctorCoverage || []).some(r => minute(r.startTime) <= m && minute(r.endTime) > m);
    });
    assert.ok(free.length >= ncMinimum, 'required Nurse Clinic cover remains available every minute');
  }
  return { missingMinutes, concurrentMinutes, paid };
}

for (const [name, eligibility, doctorIds, expectedMissing] of [
  ['scarce matching chain', [['a', 'b'], ['a', 'c'], ['c']], ['a', 'b', 'c'], 0],
  ['unqualified doctor remains uncovered', [['a', 'b'], ['a']], ['a', 'b', 'c'], 480],
  ['four doctors with three nurses', [['a', 'd'], ['b'], ['c']], ['a', 'b', 'c', 'd'], 480],
  ['two nurses restricted to one doctor', [['a'], ['a']], ['a', 'b'], 480],
] as const) test(`the real worker matches independent exhaustive cover for ${name}`, async () => {
  const nurses = eligibility.map((ids, i) => nurse(`n${i}`, [...ids]));
  const data = input(nurses, doctorIds.map(id => session(id)));
  const demand = data.sessions.length * 480;
  const best = exhaustiveOrdinaryCover(data);
  assert.equal(demand - best, expectedMissing);
  const result = await run(data);
  const actual = audit(data, result.assignments);
  assert.equal(actual.missingMinutes, demand - best);
  assert.equal(actual.concurrentMinutes, 0);
});

test('the exhaustive hours bound permits moving a smaller gap to another date', async () => {
  const data = input([nurse('one', ['a', 'b'])], [session('a', date, '09:00', '13:00'), session('b', tomorrow)], {
    assignments: [shift('one', date, { kind: 'DOCTOR', doctorId: 'a', clinicalRoleId: undefined,
      doctorCoverage: [{ doctorId: 'a', startTime: '09:00', endTime: '13:00' }] })],
  });
  assert.equal(exhaustiveOrdinaryCover(data), 480);
  const result = await run(data);
  assert.equal(audit(data, result.assignments).missingMinutes, 240);
});

test('the exhaustive clinic reservation does not trade protected Nurse Clinic for doctor cover', async () => {
  const nc = shift('nc', date, { source: 'MANUAL', clinicalRoleId: 'role-nurse-clinic', note: 'Keep Nurse Clinic here' });
  const data = input([nurse('nc', [], { isClinicNurse: false, capabilityIds: ['role-nurse-clinic'] }),
    nurse('one', ['a', 'b', 'c']), nurse('two', ['a', 'b', 'c'])], ['a', 'b', 'c'].map(id => session(id)), {
    assignments: [nc], roles: [{ id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1 }],
    rules: rules().map(r => r.id === 'rule-nurse-clinic' || r.id === 'rule-nurse-plus-one' ? { ...r, enabled: true, severity: 'HARD', value: 1 } : r),
  });
  assert.equal(exhaustiveOrdinaryCover(data, new Set(), new Map([['nc|' + date, 'NC']]), 1), 960);
  const result = await run(data);
  assert.equal(audit(data, result.assignments, new Set(), 1).missingMinutes, 480);
  assert.deepEqual(result.assignments.find(a => a.id === nc.id), nc);
});

test('an approved day off is excluded by the oracle and by the complete worker', async () => {
  const data = input([nurse('off', ['a']), nurse('present', ['b'])], [session('a'), session('b')], {
    mode: 'EMPTY_ONLY', assignments: [shift('off'), shift('present')], locks: [makeLock('off', date, { mode: 'OFF' })],
  });
  const blocked = new Set(['off|' + date]);
  assert.equal(exhaustiveOrdinaryCover(data, blocked), 480);
  const result = await run(data);
  assert.equal(audit(data, result.assignments, blocked).missingMinutes, 480);
});

test('sequential ordinary doctors fill one paid duty without simultaneous cover', async () => {
  const data = input([nurse('one', ['a', 'b'])], [session('a', date, '09:00', '13:00'), session('b', date, '13:00', '17:00')], {
    mode: 'EMPTY_ONLY', assignments: [shift('one')],
  });
  const result = await run(data);
  const actual = audit(data, result.assignments);
  assert.equal(actual.missingMinutes, 0);
  assert.equal(actual.concurrentMinutes, 0);
  assert.equal(actual.paid.get('one'), 480);
});

test('one nurse can cover two low acuity doctors only with the necessary shared minutes', async () => {
  const data = input([nurse('one', ['a', 'b'])], [session('a'), session('b')], {
    doctors: [doctor('a', true), doctor('b', true)], mode: 'EMPTY_ONLY', assignments: [shift('one')],
  });
  const result = await run(data);
  const actual = audit(data, result.assignments);
  assert.equal(actual.missingMinutes, 0);
  assert.equal(actual.concurrentMinutes, 960 - 480, 'demand exceeds the only paid nurse by eight hours');
  assert.ok(result.validation.findings.some(f => f.severity === 'INFO' && f.id.startsWith('low-acuity-cover-')));
});

test('partial Float cover removes exactly the avoidable sharing and retains paid identities', async () => {
  const first = shift('one', date, { kind: 'DOCTOR', doctorId: 'a', secondDoctorId: 'b', clinicalRoleId: undefined,
    doctorCoverage: ['a', 'b'].map(doctorId => ({ doctorId, startTime: '09:00', endTime: '17:00' })) });
  const half = { ...DAY_DUTY, id: 'half', endTime: '13:00' };
  const second = shift('two', date, { dutyWindowId: half.id });
  const data = input([nurse('one', ['a', 'b']), nurse('two', ['b'], { contractPercent: 50 })], [session('a'), session('b')], {
    mode: 'EMPTY_ONLY', assignments: [first, second], doctors: [doctor('a', true), doctor('b', true)], dutyWindows: [DAY_DUTY, half],
  });
  const result = await run(data);
  const actual = audit(data, result.assignments);
  assert.equal(actual.missingMinutes, 0);
  assert.equal(actual.concurrentMinutes, 960 - (480 + 240), 'only the four hours without Float need sharing');
  for (const saved of [first, second]) {
    const next = result.assignments.find(a => a.id === saved.id)!;
    assert.equal(next.nurseId, saved.nurseId); assert.equal(next.date, saved.date); assert.equal(next.dutyWindowId, saved.dutyWindowId);
  }
  const floatCover = result.assignments.find(a => a.id === second.id)!;
  assert.deepEqual(floatCover.doctorCoverage, [{ doctorId: 'b', startTime: '09:00', endTime: '13:00' }]);
});
