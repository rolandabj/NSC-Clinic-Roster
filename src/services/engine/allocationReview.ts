import type { Assignment, AllocationReview } from '../../types';

/** A review belongs to one saved shift and pairing, not to a reusable note prefix. */
export function allocationSignature(a: Assignment): string {
  return JSON.stringify([a.id, a.scheduleId, a.nurseId, a.date, a.dutyWindowId, a.kind,
    a.doctorId || null, a.specialtyId || null]);
}

export function hasAllocationReview(a: Assignment): boolean {
  const r = a.allocationReview;
  return !!r && r.signature === allocationSignature(a) && typeof r.reviewedBy === 'string' && !!r.reviewedBy.trim() &&
    typeof r.reason === 'string' && !!r.reason.trim() && typeof r.reviewedAt === 'string' && Number.isFinite(Date.parse(r.reviewedAt));
}

export function approveAllocation(a: Assignment, reviewedBy: string, reason: string, reviewedAt: string): AllocationReview {
  if (!reviewedBy.trim() || !reason.trim() || !Number.isFinite(Date.parse(reviewedAt))) {
    throw new Error('A pairing review requires a signed in reviewer, a reason and a valid review time.');
  }
  return { signature: allocationSignature(a), reviewedBy, reason: reason.trim(), reviewedAt };
}
