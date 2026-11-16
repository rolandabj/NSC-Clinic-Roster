import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, ManualDoctorOverlap } from '../../src/types';
import { writeManualOverlapAudits } from '../../src/services/schedule/manualOverlapAudit';

const record: ManualDoctorOverlap = { doctorId: 'doctor', date: '2026-11-18', startTime: '13:15', endTime: '14:00',
  nurseIds: ['amy', 'mary'], members: [{ assignmentId: 'manual', signature: 'first' }, { assignmentId: 'other', signature: 'second' }],
  recordedBy: 'planner', recordedAt: '2026-11-16T10:00:00Z' };
const shift: Assignment = { id: 'manual', scheduleId: 'roster', nurseId: 'amy', date: record.date,
  kind: 'DOCTOR', doctorId: record.doctorId, dutyWindowId: 'day', source: 'MANUAL', locked: false,
  manualDoctorOverlaps: [record] };
function database(saved: Assignment[] = [shift]) {
  const collections: Record<string, Map<string, any>> = { assignments: new Map(saved.map(a => [a.id, a])), audit: new Map() };
  let fail = false;
  const repo: any = { async get(collection: string, id: string) { return collections[collection].get(id) || null; },
    async create(collection: string, item: any) { if (fail) { fail = false; throw new Error('offline'); }
      collections[collection].set(item.id, item); return item; } };
  return { repo, collections, failAudit() { fail = true; } };
}
test('manual overlap audit is written only after the actual shift was saved', async () => {
  const db = database([]);
  await writeManualOverlapAudits(db.repo, [shift]);
  assert.equal(db.collections.audit.size, 0);
  db.collections.assignments.set(shift.id, shift);
  await writeManualOverlapAudits(db.repo, [shift], { doctors: [{ id: 'doctor', fullName: 'Dr Lee' }],
    nurses: [{ id: 'amy', fullName: 'Amy' }, { id: 'mary', fullName: 'Mary' }] });
  const event = [...db.collections.audit.values()][0];
  assert.equal(event.action, 'UPDATE'); assert.equal(event.entity, 'Assignment');
  assert.match(event.note, /18-11-2026.*13:15 to 14:00/);
  assert.match(event.note, /Dr Lee/); assert.match(event.note, /Amy and Mary/);
  assert.ok(!JSON.stringify(event).includes('signature'));
});
test('audit reconciliation is repeatable and a failed audit retries without changing saved duties', async () => {
  const db = database(); const before = JSON.stringify(shift);
  db.failAudit(); await assert.rejects(() => writeManualOverlapAudits(db.repo, [shift]), /offline/);
  assert.equal(db.collections.audit.size, 0);
  await writeManualOverlapAudits(db.repo, [shift]);
  await writeManualOverlapAudits(db.repo, [shift]);
  assert.equal(db.collections.audit.size, 1); assert.equal(JSON.stringify(shift), before);
});
test('superseded, inherited automatic and malformed overlap records do not create audit events', async () => {
  const db = database([{ ...shift, manualDoctorOverlaps: undefined }]);
  await writeManualOverlapAudits(db.repo, [shift]);
  await writeManualOverlapAudits(db.repo, [{ ...shift, source: 'GENERATED' }]);
  await writeManualOverlapAudits(db.repo, [{ ...shift, manualDoctorOverlaps: [null as any] }]);
  const malformed = { ...shift, manualDoctorOverlaps: [{ ...record, startTime: 'early', endTime: 'late' }] };
  db.collections.assignments.set(shift.id, malformed);
  await writeManualOverlapAudits(db.repo, [malformed]);
  assert.equal(db.collections.audit.size, 0);
});
test('concurrent audit reconciliation records one event per exact manual overlap', async () => {
  const db = database();
  await Promise.all([writeManualOverlapAudits(db.repo, [shift]), writeManualOverlapAudits(db.repo, [shift])]);
  assert.equal(db.collections.audit.size, 1);
});
