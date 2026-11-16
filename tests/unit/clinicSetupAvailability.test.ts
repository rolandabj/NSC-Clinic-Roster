import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, AvailabilityRequest, Schedule } from '../../src/types';
import type { IRepository } from '../../src/services/repository/IRepository';
import { loadClinicSetup } from '../../src/services/engine/clinicSetupService';
import { DAY_DUTY, makeSchedule } from './fixtures';

const schedule = makeSchedule();
const previous = makeSchedule({ id: 'previous', startDate: '2026-09-28', endDate: '2026-10-04' });
const following = makeSchedule({ id: 'following', startDate: '2026-10-12', endDate: '2026-10-18', status: 'PUBLISHED' });
const shift = (roster: Schedule, date: string): Assignment => ({ id: `${roster.id}-${date}`, scheduleId: roster.id,
  nurseId: 'n1', date, dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'GENERATED', locked: false });
function repository(options: { fail?: string; rosters?: Schedule[]; assignments?: Assignment[]; requests?: AvailabilityRequest[] } = {}) {
  const tables: Record<string, unknown[]> = { schedules: options.rosters || [previous, schedule, following],
    assignments: options.assignments || [shift(previous, previous.endDate), shift(following, following.startDate)],
    availabilityRequests: options.requests || [] };
  const reads: { name: string; filter?: { field: string; value: string } }[] = [];
  const repo = { list: async (name: string, filter?: { field: string; value: string }) => {
    reads.push({ name, filter });
    if (name === options.fail) throw new Error('Test read unavailable');
    const rows = tables[name] || [];
    return filter ? rows.filter(row => (row as Record<string, unknown>)[filter.field] === filter.value) : rows;
  } } as unknown as IRepository;
  return { repo, reads };
}
test('clinic setup cannot silently treat a failed availability read as an empty request list', async () => {
  const { repo } = repository({ fail: 'availabilityRequests' });
  await assert.rejects(() => loadClinicSetup(repo, schedule, { withYearToDate: false }), /availability|requests/i);
});
test('an empty availability list is valid and remains distinguishable from a failed read', async () => {
  const { repo } = repository();
  const setup = await loadClinicSetup(repo, schedule, { withYearToDate: false });
  assert.deepEqual(setup.availabilityRequests, []);
});
test('clinic setup reads neighbouring rosters as fixed context on both sides', async () => {
  const { repo } = repository();
  const setup = await loadClinicSetup(repo, schedule, { withYearToDate: false });
  assert.deepEqual(setup.priorAssignments?.map(a => a.date), ['2026-10-04']);
  assert.deepEqual(setup.followingAssignments?.map(a => a.date), ['2026-10-12']);
});
test('following roster context excludes archived rosters, far dates and rows outside their own roster', async () => {
  const archived = { ...following, id: 'archived', status: 'ARCHIVED' as const };
  const distant = { ...following, id: 'distant', startDate: '2026-12-01', endDate: '2026-12-07' };
  const { repo, reads } = repository({ rosters: [schedule, following, archived, distant],
    assignments: [shift(following, '2026-10-12'), shift(following, '2026-10-20'), shift(archived, '2026-10-12'), shift(distant, '2026-12-01')] });
  const setup = await loadClinicSetup(repo, schedule, { withYearToDate: false });
  assert.deepEqual(setup.followingAssignments?.map(a => a.date), ['2026-10-12']);
  assert.ok(!reads.some(r => r.name === 'assignments' && r.filter?.value === 'archived'));
  assert.ok(!reads.some(r => r.name === 'assignments' && r.filter?.value === 'distant'));
});
test('a failure reading surrounding assignments stops loading rather than ignoring future safety', async () => {
  const { repo } = repository({ fail: 'assignments', rosters: [schedule, following] });
  await assert.rejects(() => loadClinicSetup(repo, schedule, { withYearToDate: false }), /unavailable/);
});
test('holiday linked requests remain in context even when the chosen day off is outside the roster', async () => {
  const request = { id: 'holiday-off', nurseId: 'n1', date: '2026-10-20', holidayDate: '2026-10-06', available: false, status: 'APPROVED' } as AvailabilityRequest;
  const irrelevant = { ...request, id: 'other-off', holidayDate: '2026-11-01' };
  const { repo } = repository({ requests: [request, irrelevant] });
  assert.deepEqual((await loadClinicSetup(repo, schedule, { withYearToDate: false })).availabilityRequests, [request]);
});
