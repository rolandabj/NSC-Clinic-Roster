import type { Assignment, Doctor, ManualDoctorOverlap, Nurse } from '../../types';
import type { IRepository } from '../repository/IRepository';
import { formatDate } from '../../utils/dateUtils';

interface Names {
  doctors?: readonly Pick<Doctor, 'id' | 'fullName'>[];
  nurses?: readonly Pick<Nurse, 'id' | 'fullName'>[];
}
const running = new WeakMap<IRepository, Promise<void>>();
const completed = new WeakMap<IRepository, Set<string>>();
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const validRecord = (r: ManualDoctorOverlap | null | undefined, owner: Assignment): r is ManualDoctorOverlap =>
  !!r && typeof r.doctorId === 'string' && r.date === owner.date && typeof r.startTime === 'string' &&
  typeof r.endTime === 'string' && TIME.test(r.startTime) && TIME.test(r.endTime) && r.startTime < r.endTime && typeof r.recordedBy === 'string' && !!r.recordedBy.trim() &&
  typeof r.recordedAt === 'string' && Number.isFinite(Date.parse(r.recordedAt)) && Array.isArray(r.members) && r.members.length >= 2 &&
  Array.from(r.members).every(m => !!m && typeof m.assignmentId === 'string' && typeof m.signature === 'string') &&
  r.members.some(m => m.assignmentId === owner.id) && Array.isArray(r.nurseIds) && r.nurseIds.length >= 2 &&
  new Set(r.nurseIds).size >= 2 && Array.from(r.nurseIds).every(id => typeof id === 'string' && !!id);

async function eventId(a: Assignment, record: ManualDoctorOverlap): Promise<string> {
  const key = JSON.stringify([a.scheduleId, a.id, record.doctorId, record.date, record.startTime, record.endTime,
    [...record.nurseIds].sort(), [...record.members].sort((x, y) => x.assignmentId.localeCompare(y.assignmentId)),
    record.recordedBy, record.recordedAt]);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
  return `manual-doctor-overlap-${Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('')}`;
}

/** Reconcile saved manual intent into the audit trail, including after a failed save is retried. */
export async function writeManualOverlapAudits(repo: IRepository, assignments: readonly Assignment[], names: Names = {}): Promise<void> {
  const previous = running.get(repo) || Promise.resolve();
  const next = previous.catch(() => {}).then(async () => {
    const known = completed.get(repo) || new Set<string>();
    completed.set(repo, known);
    for (const a of assignments) {
      if ((a.source !== 'MANUAL' && a.source !== 'LOCK') || !Array.isArray(a.manualDoctorOverlaps)) continue;
      const records = a.manualDoctorOverlaps.filter(r => validRecord(r, a));
      if (!records.length) continue;
      // Read the stored shift: a failed or superseded local edit must never look saved in Audit trail.
      const saved = await repo.get('assignments', a.id);
      if (!saved || saved.scheduleId !== a.scheduleId || !Array.isArray(saved.manualDoctorOverlaps)) continue;
      for (const record of records) {
        if (!saved.manualDoctorOverlaps.some(r => JSON.stringify(r) === JSON.stringify(record))) continue;
        const id = await eventId(a, record);
        if (known.has(id)) continue;
        if (!(await repo.get('audit', id))) {
          const doctor = names.doctors?.find(d => d.id === record.doctorId)?.fullName || 'the doctor';
          const nurses = record.nurseIds.map(nurseId => names.nurses?.find(n => n.id === nurseId)?.fullName || 'a nurse').join(' and ');
          await repo.create('audit', { id, actor: record.recordedBy, action: 'UPDATE', entity: 'Assignment', entityId: a.id,
            after: { Doctor: doctor, Date: record.date, Time: `${record.startTime} to ${record.endTime}`, Nurses: nurses },
            note: `Manual doctor overlap saved for ${doctor} on ${formatDate(record.date)} from ${record.startTime} to ${record.endTime}: ${nurses}.`,
            timestamp: record.recordedAt });
        }
        known.add(id);
      }
    }
  });
  running.set(repo, next);
  try { await next; } finally { if (running.get(repo) === next) running.delete(repo); }
}
