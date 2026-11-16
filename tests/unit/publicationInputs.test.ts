import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertPublicationCurrent, type PublicationInputs } from '../../src/services/publish/publicationInputs';
import { makeNurse, makeSchedule, makeLeave, SENIOR, DAY_DUTY } from './fixtures';
import type { AvailabilityRequest, Assignment, Schedule } from '../../src/types';
import type { ClinicSetup } from '../../src/services/engine/clinicModel';
import type { IRepository } from '../../src/services/repository/IRepository';
const expected = (): PublicationInputs => ({ schedule: makeSchedule(), assignments: [], nurses: [makeNurse('a'), makeNurse('b')],
  seniorityLevels: [SENIOR], dutyWindows: [DAY_DUTY], sessions: [], leaveEntries: [], locks: [], roles: [], rules: [],
  workingHoursPeriods: [], specialties: [], doctors: [], leaveTypes: [],
  clinicSetup: { availabilityRequests: [], priorAssignments: [], followingAssignments: [] } });
function repository(input: PublicationInputs, failCollection?: string) {
  const setup = input.clinicSetup;
  const prior = setup.priorAssignments || [], following = setup.followingAssignments || [];
  const schedules: Schedule[] = [input.schedule];
  for (const a of [...prior, ...following]) if (!schedules.some(s => s.id === a.scheduleId)) schedules.push(makeSchedule({
    id: a.scheduleId, startDate: a.date, endDate: a.date,
  }));
  const tables: Record<string, unknown[]> = { assignments: [...input.assignments, ...prior, ...following], nurses: input.nurses, seniorityLevels: input.seniorityLevels,
    dutyWindows: input.dutyWindows, doctorSessions: input.sessions, leaveEntries: input.leaveEntries, locks: input.locks,
    clinicalRoles: input.roles, rules: input.rules, workingHoursPeriods: input.workingHoursPeriods, specialties: input.specialties,
    doctors: input.doctors, leaveTypes: input.leaveTypes, schedules,
    clinics: [{ id: 'clinic', openTime: setup.openTime, closeTime: setup.closeTime }],
    holidays: [...(setup.holidayDates || [])].map(date => ({ id: date, date, name: setup.holidayNames?.[date] })),
    availabilityRequests: setup.availabilityRequests || [], versions: [],
  };
  return { get: async () => input.schedule,
    list: async (name: string, filter?: { field: string; value: unknown }) => {
      if (name === failCollection) throw new Error(`${name} unavailable`);
      const rows = tables[name] || [];
      return filter ? rows.filter(row => (row as Record<string, unknown>)[filter.field] === filter.value) : rows;
    } } as unknown as IRepository;
}
test('publication tolerates collection order and harmless update timestamps', async () => {
  const input = expected(); const fresh = { ...input, nurses: [...input.nurses].reverse().map(n => ({ ...n, updatedAt: 'later' })) };
  await assert.doesNotReject(() => assertPublicationCurrent(repository(fresh), input));
});
test('publication refuses an eligibility change that was not in the checked preview', async () => {
  const input = expected(); const fresh = { ...input, nurses: input.nurses.map(n => ({ ...n,
    doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedAt: '2026-11-15T10:00:00Z', reviewedBy: 'planner' } })) };
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication refuses newly recorded leave before saving a version or sending', async () => {
  const input = expected(); const fresh = { ...input, leaveEntries: [{ id: 'leave', nurseId: 'a', startDate: input.schedule.startDate,
    endDate: input.schedule.endDate, approved: true }] } as PublicationInputs;
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication refuses a changed doctor session', async () => {
  const input = expected(); const fresh = { ...input, sessions: [{ id: 's', doctorId: 'd', date: input.schedule.startDate,
    startTime: '09:00', endTime: '21:00' }] } as PublicationInputs;
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication tolerates inactive profiles omitted from the roster screen', async () => {
  const input = expected(); const fresh = { ...input, nurses: [...input.nurses, makeNurse('inactive', { active: false })] };
  await assert.doesNotReject(() => assertPublicationCurrent(repository(fresh), input));
});
test('publication refuses a new rule after preview', async () => {
  const input = expected(); const fresh = { ...input, rules: [{ id: 'new-rule', type: 'HARD', enabled: true }] } as unknown as PublicationInputs;
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});

const dayOff = (status: AvailabilityRequest['status'] = 'APPROVED'): AvailabilityRequest => ({
  id: 'request', nurseId: 'a', date: '2026-10-05', available: false, status,
  submittedByNurseId: 'a', submittedAt: '2026-10-01T08:00:00Z',
});
const context = (changes: Partial<ClinicSetup> = {}): ClinicSetup => ({ availabilityRequests: [], priorAssignments: [], followingAssignments: [], ...changes });
const boundaryShift = (date: string, scheduleId: string): Assignment => ({ id: `shift-${date}`, scheduleId,
  nurseId: 'a', date, dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'GENERATED', locked: false });
test('publication refuses an approved day off added after preview even without a pin', async () => {
  const input = expected();
  const fresh = { ...input, clinicSetup: context({ availabilityRequests: [dayOff()] }) };
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication accepts unchanged pending and rejected requests as current input', async () => {
  for (const status of ['PENDING', 'REJECTED'] as const) {
    const input = { ...expected(), clinicSetup: context({ availabilityRequests: [dayOff(status)] }) };
    await assert.doesNotReject(() => assertPublicationCurrent(repository(input), input));
  }
});
test('publication refuses an availability read failure rather than treating requests as empty', async () => {
  const input = expected();
  await assert.rejects(() => assertPublicationCurrent(repository(input, 'availabilityRequests'), input), /availabilityRequests|availability|requests/i);
});
test('publication refuses a following roster duty changed after preview', async () => {
  const input = { ...expected(), clinicSetup: context({ followingAssignments: [boundaryShift('2026-10-12', 'next')] }) };
  const fresh = { ...input, clinicSetup: context({ followingAssignments: [{ ...boundaryShift('2026-10-12', 'next'), dutyWindowId: 'different' }] }) };
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication refuses a preceding roster duty changed after preview', async () => {
  const input = { ...expected(), clinicSetup: context({ priorAssignments: [boundaryShift('2026-10-04', 'previous')] }) };
  const fresh = { ...input, clinicSetup: context({ priorAssignments: [{ ...boundaryShift('2026-10-04', 'previous'), dutyWindowId: 'different' }] }) };
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication ignores a request outside the roster and its holiday days off', async () => {
  const input = expected();
  const fresh = { ...input, clinicSetup: context({ availabilityRequests: [{ ...dayOff(), date: '2027-01-01' }] }) };
  await assert.doesNotReject(() => assertPublicationCurrent(repository(fresh), input));
});
test('publication refuses changed clinic opening hours', async () => {
  const input = { ...expected(), clinicSetup: context({ openTime: '09:00', closeTime: '21:00' }) };
  const fresh = { ...input, clinicSetup: { ...input.clinicSetup, closeTime: '20:00' } };
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication refuses a public holiday added after preview', async () => {
  const input = expected();
  const fresh = { ...input, clinicSetup: context({ holidayDates: ['2026-10-05'] }) };
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication returns the freshly verified availability context for the final validation', async () => {
  const input = { ...expected(), clinicSetup: context({ availabilityRequests: [dayOff()] }) };
  const fresh = await assertPublicationCurrent(repository(input), input);
  assert.deepEqual(fresh.availabilityRequests, [dayOff()]);
});

test('publication refuses changed leave affecting a following roster boundary duty', async () => {
  const input = { ...expected(), clinicSetup: context({ followingAssignments: [boundaryShift('2026-10-12', 'next')] }) };
  const fresh = { ...input, leaveEntries: [makeLeave({ nurseId: 'a', startDate: '2026-10-12', endDate: '2026-10-12' })] };
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication refuses a timing only doctor coverage change after preview', async () => {
  const a: Assignment = { ...boundaryShift('2026-10-05', 'sched-1'), kind: 'DOCTOR', doctorId: 'one',
    doctorCoverage: [{ doctorId: 'one', startTime: '09:00', endTime: '13:00' }] };
  const input = { ...expected(), assignments: [a] };
  const fresh = { ...input, assignments: [{ ...a, doctorCoverage: [{ doctorId: 'one', startTime: '09:00', endTime: '14:00' }] }] };
  await assert.rejects(() => assertPublicationCurrent(repository(fresh), input), /changed/);
});
test('publication treats reordered equivalent explicit coverage as the same input', async () => {
  const a: Assignment = { ...boundaryShift('2026-10-05', 'sched-1'), kind: 'DOCTOR', doctorId: 'one', secondDoctorId: 'two',
    doctorCoverage: [{ doctorId: 'one', startTime: '09:00', endTime: '13:00' }, { doctorId: 'two', startTime: '13:00', endTime: '17:00' }] };
  const input = { ...expected(), assignments: [a] };
  const fresh = { ...input, assignments: [{ ...a, doctorCoverage: [...a.doctorCoverage!].reverse() }] };
  await assert.doesNotReject(() => assertPublicationCurrent(repository(fresh), input));
});
test('publication accepts touching intervals split differently when doctor coverage is unchanged', async () => {
  const a: Assignment = { ...boundaryShift('2026-10-05', 'sched-1'), kind: 'DOCTOR', doctorId: 'one',
    doctorCoverage: [{ doctorId: 'one', startTime: '09:00', endTime: '13:00' }] };
  const input = { ...expected(), assignments: [a] };
  const fresh = { ...input, assignments: [{ ...a, doctorCoverage: [
    { doctorId: 'one', startTime: '11:00', endTime: '13:00' }, { doctorId: 'one', startTime: '09:00', endTime: '11:00' },
  ] }] };
  await assert.doesNotReject(() => assertPublicationCurrent(repository(fresh), input));
});
