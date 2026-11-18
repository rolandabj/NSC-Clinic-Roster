import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment } from '../../src/types';
import type { IRepository } from '../../src/services/repository/IRepository';
import { assertGenerationInputsCurrent, cloneGenerationInputs, generationInputFingerprint, loadGenerationInputs } from '../../src/services/schedule/generationSaveGuard';
import { DAY_DUTY, SENIOR, makeNurse, makeSchedule } from './fixtures';

const current = makeSchedule();
const shift = (id: string, date: string, scheduleId = current.id): Assignment => ({ id, scheduleId, date,
  nurseId: 'a', dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', locked: false, source: 'GENERATED' });
function database() {
  const server: Record<string, any[]> = structuredClone({
    schedules: [current,
      makeSchedule({ id: 'previous', startDate: '2026-09-28', endDate: '2026-10-04', status: 'PUBLISHED' }),
      makeSchedule({ id: 'older', startDate: '2026-01-01', endDate: '2026-01-07', status: 'PUBLISHED' }),
      makeSchedule({ id: 'next', startDate: '2026-10-12', endDate: '2026-10-18' })],
    assignments: [{ ...shift('current', current.startDate), kind: 'DOCTOR', doctorId: 'doctor',
      doctorCoverage: [{ doctorId: 'doctor', startTime: '09:00', endTime: '13:00' }] },
      shift('previous-shift', '2026-10-04', 'previous'), shift('older-shift', '2026-01-02', 'older'),
      shift('next-shift', '2026-10-12', 'next')],
    nurses: [makeNurse('a'), makeNurse('b')], seniorityLevels: [SENIOR], dutyWindows: [DAY_DUTY],
    doctorSessions: [{ id: 'session', doctorId: 'doctor', date: current.startDate,
      startTime: '09:00', endTime: '17:00', cancelled: false, specialtyId: 'specialty', source: 'MANUAL' }],
    doctors: [{ id: 'doctor', fullName: 'Dr Lee', active: true, specialtyIds: ['specialty'], weeklyPattern: [] }],
    specialties: [{ id: 'specialty', name: 'General', code: 'GEN' }], clinicalRoles: [], rules: [], leaveTypes: [],
    leaveEntries: [], locks: [], workingHoursPeriods: [{ id: 'period', name: 'Period', year: 2026,
      startDate: '2026-09-19', endDate: '2026-10-18', workingHours: 210 }],
    clinics: [{ id: 'clinic', name: 'Clinic', openTime: '09:00', closeTime: '21:00', weekendDays: [6, 0] }], holidays: [],
    availabilityRequests: [], versions: [],
  });
  const cached = structuredClone(server);
  const calls = { fresh: [] as string[], ordinary: [] as string[], writes: 0, fail: '' };
  const read = (tables: Record<string, any[]>, collection: string, filter?: { field: string; value: unknown }) => {
    const list = tables[collection] || [];
    return structuredClone(filter ? list.filter(row => row[filter.field] === filter.value) : list);
  };
  const repo = {
    async list(collection: string, filter?: { field: string; value: unknown }) { calls.ordinary.push(collection); return read(cached, collection, filter); },
    async get(collection: string, id: string) { calls.ordinary.push(collection); return read(cached, collection).find(row => row.id === id) || null; },
    async listFresh(collection: string, filter?: { field: string; value: unknown }) {
      calls.fresh.push(collection); if (calls.fail === collection || calls.fail === `${collection}:${filter?.value}`) throw new Error('offline ' + collection); return read(server, collection, filter);
    },
    async getFresh(collection: string, id: string) {
      calls.fresh.push(collection); if (calls.fail === collection) throw new Error('offline ' + collection); return read(server, collection).find(row => row.id === id) || null;
    },
    async create() { calls.writes++; throw new Error('must not write'); },
    async update() { calls.writes++; throw new Error('must not write'); },
  } as unknown as IRepository;
  return { repo, server, cached, calls };
}

test('generation snapshots are detached from later local edits', async () => {
  const { repo } = database(); const input = await loadGenerationInputs(repo, current.id);
  const saved = cloneGenerationInputs(input); const expected = generationInputFingerprint(saved);
  input.nurses[0].fullName = 'Changed'; input.assignments[0].doctorCoverage![0].endTime = '14:00';
  assert.equal(generationInputFingerprint(saved), expected);
  assert.notEqual(generationInputFingerprint(input), expected);
});
test('a final generation read bypasses stale normal repository and hours history caches', async () => {
  const { repo, server, calls } = database(); const expected = await loadGenerationInputs(repo, current.id);
  server.assignments.find(a => a.id === 'older-shift').dutyWindowId = 'different';
  await assert.rejects(() => assertGenerationInputsCurrent(repo, expected), /changed/);
  assert.deepEqual(calls.ordinary, []);
  assert.equal(calls.writes, 0);
});
test('collection ordering, harmless timestamps and equivalent timing do not invalidate a generation snapshot', async () => {
  const { repo, server } = database(); const expected = await loadGenerationInputs(repo, current.id);
  for (const list of Object.values(server)) list.reverse();
  server.nurses[0].updatedAt = 'later';
  const a = server.assignments.find(a => a.id === 'current');
  a.doctorCoverage = [{ doctorId: 'doctor', startTime: '11:00', endTime: '13:00' }, { doctorId: 'doctor', startTime: '09:00', endTime: '11:00' }];
  await assert.doesNotReject(() => assertGenerationInputsCurrent(repo, expected));
});
const changes: [string, (server: Record<string, any[]>) => void][] = [
  ['roster dates', tables => { tables.schedules.find(s => s.id === current.id).endDate = '2026-10-12'; }],
  ['a duty outside selected fill dates', tables => { tables.assignments.push(shift('outside', '2026-10-11')); }],
  ['doctor cover times', tables => { tables.assignments.find(a => a.id === 'current').doctorCoverage[0].endTime = '14:00'; }],
  ['a pairing review', tables => { tables.assignments.find(a => a.id === 'current').allocationReview = { signature: 'review', reviewedBy: 'lead', reviewedAt: '2026-11-17T10:00:00Z', reason: 'Checked' }; }],
  ['availability approval without a pin', tables => { tables.availabilityRequests.push({ id: 'off', nurseId: 'a', date: current.startDate, status: 'APPROVED', available: false }); }],
  ['pinned days', tables => { tables.locks.push({ id: 'pin', nurseId: 'a', date: current.startDate, mode: 'OFF' }); }],
  ['approved leave', tables => { tables.leaveEntries.push({ id: 'leave', nurseId: 'a', startDate: current.startDate, endDate: current.endDate, approved: true }); }],
  ['clinical eligibility', tables => { tables.nurses[0].doctorEligibility = { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-17T10:00:00Z' }; }],
  ['nurse activation', tables => { tables.nurses[0].active = false; }],
  ['duty windows', tables => { tables.dutyWindows[0].endTime = '18:00'; }],
  ['doctor sessions', tables => { tables.doctorSessions[0].endTime = '18:00'; }],
  ['rules', tables => { tables.rules.push({ id: 'rule', enabled: true, severity: 'HARD', value: 5 }); }],
  ['working hours periods', tables => { tables.workingHoursPeriods[0].workingHours = 200; }],
  ['opening hours', tables => { tables.clinics[0].closeTime = '20:00'; }],
  ['clinic weekend days', tables => { tables.clinics[0].weekendDays = [5, 6]; }],
  ['public holidays', tables => { tables.holidays.push({ id: 'holiday', date: current.startDate, name: 'Holiday' }); }],
  ['following roster duties', tables => { tables.assignments.find(a => a.id === 'next-shift').dutyWindowId = 'other'; }],
  ['prior roster duties', tables => { tables.assignments.find(a => a.id === 'previous-shift').dutyWindowId = 'other'; }],
  ['earlier published contract data', tables => { tables.versions.push({ id: 'published', scheduleId: 'previous', number: 1, isPublished: true, snapshot: { assignments: [], contractPercents: { a: 50 } } }); }],
];
for (const [name, change] of changes) test('generation refuses changed ' + name + ' before any save', async () => {
  const { repo, server, calls } = database(); const expected = await loadGenerationInputs(repo, current.id);
  change(server); await assert.rejects(() => assertGenerationInputsCurrent(repo, expected), /changed/);
  assert.equal(calls.writes, 0);
});
for (const collection of ['availabilityRequests', 'assignments', 'schedules', 'workingHoursPeriods', 'clinics']) {
  test('a failed required ' + collection + ' reread cannot save a candidate', async () => {
    const { repo, calls } = database(); const expected = await loadGenerationInputs(repo, current.id);
    calls.fail = collection; await assert.rejects(() => assertGenerationInputsCurrent(repo, expected), /offline|could not|unavailable|requests/i);
    assert.equal(calls.writes, 0);
  });
}
test('generation ignores unrelated inactive profiles and outside availability requests', async () => {
  const { repo, server } = database(); const expected = await loadGenerationInputs(repo, current.id);
  server.nurses.push(makeNurse('inactive', { active: false }));
  server.availabilityRequests.push({ id: 'outside', nurseId: 'a', date: '2027-01-01', status: 'APPROVED', available: false });
  await assert.doesNotReject(() => assertGenerationInputsCurrent(repo, expected));
});

test('generation carries the server weekend definition into the worker and fairness totals', async () => {
  const { repo, server } = database();
  server.clinics[0].weekendDays = [5, 5, 6, -1, 9];
  server.assignments.push(shift('friday', '2026-01-02', 'older'));
  const input = await loadGenerationInputs(repo, current.id);
  assert.deepEqual(input.weekendDays, [5, 6]);
  assert.equal(input.clinicSetup.yearToDate?.a.weekendDays, 1);
});

test('missing clinic weekend setting uses the clinic default and remains serializable', async () => {
  const { repo, server } = database(); delete server.clinics[0].weekendDays;
  const input = await loadGenerationInputs(repo, current.id);
  assert.deepEqual(input.weekendDays, [0, 6]);
  assert.deepEqual(cloneGenerationInputs(input).weekendDays, input.weekendDays);
});

test('an unavailable required fairness read cannot silently become empty worker context', async () => {
  const { repo, calls } = database();
  calls.fail = 'versions:older';
  await assert.rejects(() => loadGenerationInputs(repo, current.id), /offline/);
  assert.equal(calls.writes, 0);
});
