import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertPublicationCurrent, type PublicationInputs } from '../../src/services/publish/publicationInputs';
import { makeNurse, makeSchedule, SENIOR, DAY_DUTY } from './fixtures';
import type { IRepository } from '../../src/services/repository/IRepository';
const expected = (): PublicationInputs => ({ schedule: makeSchedule(), assignments: [], nurses: [makeNurse('a'), makeNurse('b')],
  seniorityLevels: [SENIOR], dutyWindows: [DAY_DUTY], sessions: [], leaveEntries: [], locks: [], roles: [], rules: [],
  workingHoursPeriods: [], specialties: [], doctors: [], leaveTypes: [] });
function repository(input: PublicationInputs) {
  const tables: Record<string, unknown[]> = { assignments: input.assignments, nurses: input.nurses, seniorityLevels: input.seniorityLevels,
    dutyWindows: input.dutyWindows, doctorSessions: input.sessions, leaveEntries: input.leaveEntries, locks: input.locks,
    clinicalRoles: input.roles, rules: input.rules, workingHoursPeriods: input.workingHoursPeriods, specialties: input.specialties,
    doctors: input.doctors, leaveTypes: input.leaveTypes };
  return { get: async () => input.schedule, list: async (name: string) => tables[name] || [] } as unknown as IRepository;
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
