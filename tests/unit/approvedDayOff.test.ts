import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import type { AvailabilityRequest, DoctorSession, Rule } from '../../src/types';
import { makeNurse, makeSchedule, SENIOR } from './fixtures';

const FULL = { id: 'd', name: '9-9', acronym: '9-9', startTime: '09:00', endTime: '21:00', color: '#000', active: true };
const NINE_SEVEN = { id: 'n7', name: '9-7', acronym: '9-7', startTime: '09:00', endTime: '19:00', color: '#000', active: true };
const ORTHO = { id: 'sp-ortho', name: 'Orthopedics', code: 'ORTH' };
const DR = { id: 'doc-o', fullName: 'Dr Ortho', specialtyIds: [ORTHO.id], weeklyPattern: [], active: true };
const DATE = '2026-10-22';
const RULES = [
  { id: 'rule-nurse-clinic', name: 'NC', templateKey: 'DEDICATED_NURSE_CLINIC', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-nurse-plus-one', name: 'Plus one', templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS', enabled: false, severity: 'SOFT', value: 0 },
  { id: 'rule-h1', name: 'Senior', templateKey: 'SENIOR_ON_DUTY', enabled: false, severity: 'SOFT', value: 0 },
] as unknown as Rule[];
const session = (endTime = '18:30') =>
  ({ id: 's', doctorId: DR.id, date: DATE, startTime: '09:00', endTime, specialtyId: ORTHO.id, source: 'PATTERN', cancelled: false }) as DoctorSession;
const roland = () => makeNurse('roland', { fullName: 'Roland', preferences: [{ kind: 'SPECIALTY', refId: ORTHO.id, rank: 1 }] });
const dayOff = (status: AvailabilityRequest['status']): AvailabilityRequest => ({
  id: 'r1', nurseId: 'roland', date: DATE, available: false, status, submittedByNurseId: 'roland', submittedAt: '',
});

async function run(requests: AvailabilityRequest[], sessions = [session()], duties: any[] = [NINE_SEVEN]) {
  const schedule = makeSchedule({ startDate: DATE, endDate: DATE, hoursTargetFullTime: 12 });
  const { assignments } = await SchedulingEngine.generate(
    schedule, 'GENERATE_ALL', [], [roland()], [SENIOR], duties, [], [ORTHO], sessions, [], [], RULES,
    undefined, [], [DR] as any, [], { availabilityRequests: requests }
  );
  return { schedule, assignments };
}

test('an approved day off is kept free even after its pin was removed', async () => {
  const { assignments } = await run([dayOff('APPROVED')]);
  assert.equal(assignments.filter((a) => a.nurseId === 'roland').length, 0);
});

test('a declined day off request does not stop a shift', async () => {
  const { assignments } = await run([dayOff('REJECTED')]);
  assert.equal(assignments.filter((a) => a.nurseId === 'roland').length, 1);
});

test('a shift on an approved day off is a Check; on a pending one only a Note', () => {
  const schedule = makeSchedule({ startDate: DATE, endDate: DATE, hoursTargetFullTime: 12 });
  const shift = { id: 'a', scheduleId: schedule.id, nurseId: 'roland', date: DATE, dutyWindowId: NINE_SEVEN.id, kind: 'DOCTOR', doctorId: DR.id, locked: false, source: 'MANUAL' } as any;
  const severityWith = (status: AvailabilityRequest['status']) =>
    ScheduleValidator.validate(schedule, [shift], [roland()], [SENIOR], [NINE_SEVEN] as any, [session()], [], [], [], RULES, [], [ORTHO], [DR] as any, [], undefined, [dayOff(status)])
      .findings.find((f) => f.id.startsWith('request-dayoff-shift'))?.severity;
  assert.equal(severityWith('APPROVED'), 'WARN');
  assert.equal(severityWith('PENDING'), 'INFO');
});
