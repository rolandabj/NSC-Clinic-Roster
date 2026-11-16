import type { Assignment, DutyWindow, ManualDoctorOverlap } from '../../types';
import { assignmentCanCoverDoctor, type DoctorCoverageContext } from './assignmentPresence';
import { assignmentDoctorIds, doctorSessionsOn, effectiveDoctorCoverage, overlaps } from './clinicModel';

export interface ManualDoctorOverlapContext extends DoctorCoverageContext {
  dutyWindows: DutyWindow[];
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const sorted = (values: readonly string[]) => [...new Set(values)].sort();
const sameIds = (a: readonly string[], b: readonly string[]) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));

/** Bind the saved intent to both shifts and the real clinic and duty times they use. */
function memberSignature(a: Assignment, ctx: ManualDoctorOverlapContext): string {
  const duty = ctx.dutyWindows.find(d => d.id === a.dutyWindowId);
  const ids = assignmentDoctorIds(a);
  const sessions = doctorSessionsOn(ctx.sessions, a.date).filter(s => ids.includes(s.doctorId))
    .map(s => [s.doctorId, s.startTime, s.endTime, s.specialtyId || '']).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return JSON.stringify([a.id, a.scheduleId, a.nurseId, a.date, a.dutyWindowId, a.kind, a.doctorId || '',
    a.secondDoctorId || '', a.specialtyId || '', a.clinicalRoleId || '', a.source, a.locked, duty?.startTime, duty?.endTime,
    sessions, effectiveDoctorCoverage(a, duty, ctx.sessions)]);
}

function coverageOn(assignments: Assignment[], doctorId: string, date: string, ctx: ManualDoctorOverlapContext) {
  return assignments.filter(a => a.date === date && assignmentCanCoverDoctor(a, ctx, doctorId)).flatMap(a => {
    const duty = ctx.dutyWindows.find(d => d.id === a.dutyWindowId);
    return effectiveDoctorCoverage(a, duty, ctx.sessions).filter(r => r.doctorId === doctorId)
      .map(r => ({ ...r, assignment: a }));
  });
}

/** Only explicit planner saves call this. Copying or generating a shift cannot inherit intent. */
export function recordManualDoctorOverlaps(edited: Assignment, afterAssignments: Assignment[], ctx: ManualDoctorOverlapContext,
  recordedBy: string, recordedAt: string): Assignment {
  const { manualDoctorOverlaps: _inherited, ...clean } = edited;
  if ((clean.source !== 'MANUAL' && clean.source !== 'LOCK') || !recordedBy.trim() || !Number.isFinite(Date.parse(recordedAt))) return clean;
  const assignments = [...afterAssignments.filter(a => a.id !== clean.id), clean]
    .filter(a => a.scheduleId === clean.scheduleId && a.date === clean.date);
  const records: ManualDoctorOverlap[] = [];
  for (const doctorId of assignmentDoctorIds(clean)) {
    const coverage = coverageOn(assignments, doctorId, clean.date, ctx);
    const bounds = sorted(coverage.flatMap(r => [r.startTime, r.endTime]));
    for (let i = 0; i < bounds.length - 1; i++) {
      const startTime = bounds[i], endTime = bounds[i + 1];
      const members = [...new Map(coverage.filter(r => overlaps(r.startTime, r.endTime, startTime, endTime))
        .map(r => [r.assignment.id, r.assignment])).values()].sort((a, b) => a.id.localeCompare(b.id));
      const nurseIds = sorted(members.map(a => a.nurseId));
      if (nurseIds.length < 2 || !members.some(a => a.id === clean.id)) continue;
      const identities = members.map(a => ({ assignmentId: a.id, signature: memberSignature(a, ctx) }));
      const last = records[records.length - 1];
      if (last?.doctorId === doctorId && last.endTime === startTime && JSON.stringify(last.members) === JSON.stringify(identities)) {
        last.endTime = endTime;
      } else records.push({ doctorId, date: clean.date, startTime, endTime, nurseIds, members: identities,
        recordedBy: recordedBy.trim(), recordedAt });
    }
  }
  return records.length ? { ...clean, manualDoctorOverlaps: records } : clean;
}

function isRecord(value: unknown): value is ManualDoctorOverlap {
  if (!value || typeof value !== 'object') return false;
  const r = value as ManualDoctorOverlap;
  return typeof r.doctorId === 'string' && typeof r.date === 'string' && typeof r.startTime === 'string' &&
    typeof r.endTime === 'string' && TIME.test(r.startTime) && TIME.test(r.endTime) && r.startTime < r.endTime &&
    typeof r.recordedBy === 'string' && !!r.recordedBy.trim() && typeof r.recordedAt === 'string' && Number.isFinite(Date.parse(r.recordedAt)) &&
    Array.isArray(r.nurseIds) && r.nurseIds.length >= 2 && Array.from(r.nurseIds).every(id => typeof id === 'string' && !!id) &&
    Array.isArray(r.members) && r.members.length >= 2 && Array.from(r.members).every(m => !!m && typeof m.assignmentId === 'string' && typeof m.signature === 'string');
}

/** Exact intervals at which the validator must reconsider the saved overlap permission. */
export function manualDoctorOverlapBoundaries(assignments: Assignment[], doctorId: string, date: string): string[] {
  return sorted(assignments.flatMap(a => Array.isArray(a.manualDoctorOverlaps) ? a.manualDoctorOverlaps : [])
    .filter(isRecord).filter(r => r.doctorId === doctorId && r.date === date).flatMap(r => [r.startTime, r.endTime]));
}

/** Saved intent applies only while every involved assignment and real time range still matches. */
export function manualDoctorOverlapAllowed(assignments: Assignment[], doctorId: string, date: string, startTime: string,
  endTime: string, nurseIds: string[], ctx: ManualDoctorOverlapContext): boolean {
  if (!TIME.test(startTime) || !TIME.test(endTime) || startTime >= endTime || sorted(nurseIds).length < 2) return false;
  const coverage = coverageOn(assignments, doctorId, date, ctx);
  if (coverage.some(r => overlaps(r.startTime, r.endTime, startTime, endTime) && (r.startTime > startTime || r.endTime < endTime))) return false;
  const members = [...new Map(coverage.filter(r => r.startTime <= startTime && r.endTime >= endTime)
    .map(r => [r.assignment.id, r.assignment])).values()].sort((a, b) => a.id.localeCompare(b.id));
  if (!sameIds(members.map(a => a.nurseId), nurseIds)) return false;
  const identities = members.map(a => ({ assignmentId: a.id, signature: memberSignature(a, ctx) }));
  return members.some(owner => (owner.source === 'MANUAL' || owner.source === 'LOCK') && Array.isArray(owner.manualDoctorOverlaps) &&
    owner.manualDoctorOverlaps.some(raw => {
      if (!isRecord(raw) || raw.doctorId !== doctorId || raw.date !== date || raw.startTime > startTime || raw.endTime < endTime ||
        !sameIds(raw.nurseIds, nurseIds) || raw.members.length !== identities.length) return false;
      const recorded = [...raw.members].sort((a, b) => a.assignmentId.localeCompare(b.assignmentId));
      return JSON.stringify(recorded) === JSON.stringify(identities);
    }));
}
