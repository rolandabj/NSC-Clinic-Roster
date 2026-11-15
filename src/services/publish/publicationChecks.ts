import type { Assignment, Doctor, DoctorSession, Nurse, Specialty } from '../../types';
import type { ValidationFinding, ValidationReport } from '../validation/ScheduleValidator';
import { allocationSignature, approveAllocation, hasAllocationReview } from '../engine/allocationReview';
import { outsideNurseList } from '../engine/nurseList';
import { formatDate } from '../../utils/dateUtils';

export interface AllocationDraft { signature: string; reason: string; confirmed: boolean }
export type AllocationDrafts = Record<string, AllocationDraft>;
export interface AllocationRefs { doctors: Doctor[]; specialties: Specialty[]; sessions: DoctorSession[] }

export function pendingAllocationReviews(assignments: Assignment[], nurses: Nurse[], refs: AllocationRefs) {
  return assignments.flatMap(assignment => {
    const nurse = nurses.find(n => n.id === assignment.nurseId);
    if (!nurse || nurse.doctorEligibility != null || hasAllocationReview(assignment)) return [];
    const outside = outsideNurseList(nurse, assignment, refs);
    return outside ? [{ assignment, nurse, outside }] : [];
  });
}

export function applyAllocationDrafts(assignments: Assignment[], drafts: AllocationDrafts, actor: string, now: string): Assignment[] {
  return assignments.map(a => {
    const draft = drafts[a.id];
    if (!actor || !draft?.confirmed || !draft.reason.trim() || draft.signature !== allocationSignature(a)) return a;
    return { ...a, allocationReview: approveAllocation(a, actor, draft.reason, now) };
  });
}

/** Publishing is stricter than draft checking: doctor gaps and unreviewed exceptions block it. */
export function publicationReport(report: ValidationReport, assignments: Assignment[], nurses: Nurse[], refs: AllocationRefs): ValidationReport {
  const findings: ValidationFinding[] = report.findings.filter(f => !f.id.startsWith('allocation-review-')).map(f => {
    if (/^(unassigned-session-|session-partial-|session-no-overlap-|doctor-not-in-clinic-)/.test(f.id)) return { ...f, severity: 'ERROR' };
    if (/^h8-(doctor|specialty)-allocation-/.test(f.id)) {
      const reviewed = assignments.find(a => a.date === f.date && f.affectedNurseIds.includes(a.nurseId) && hasAllocationReview(a));
      const nurse = reviewed && nurses.find(n => n.id === reviewed.nurseId);
      if (nurse && nurse.doctorEligibility == null) return { ...f, severity: 'WARN',
        message: `${nurse.fullName}: the pairing exception on ${formatDate(reviewed!.date)} has been explicitly reviewed.` };
    }
    return f;
  });
  for (const { assignment: a, nurse, outside } of pendingAllocationReviews(assignments, nurses, refs)) {
    findings.push({ id: `allocation-review-${a.id}`, category: 'RULE_VIOLATION', severity: 'ERROR',
      message: `${nurse.fullName} with ${outside.name} on ${formatDate(a.date)} needs an explicit pairing review before publishing.`,
      affectedNurseIds: [nurse.id], cellRefs: [{ nurseId: nurse.id, date: a.date }], date: a.date });
  }
  return { ...report, findings, errorCount: findings.filter(f => f.severity === 'ERROR').length,
    warnCount: findings.filter(f => f.severity === 'WARN').length, infoCount: findings.filter(f => f.severity === 'INFO').length };
}
