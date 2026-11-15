import type { NurseDoctorEligibility } from '../../types';

const ids = (list: string[]) => [...new Set(list)].sort().join('\n');
export function eligibilityNeedsReview(draft: NurseDoctorEligibility | null, saved?: NurseDoctorEligibility | null): boolean {
  if (!draft) return false;
  return !saved || !saved.reviewedBy?.trim() || !Number.isFinite(Date.parse(saved.reviewedAt)) ||
    ids(draft.doctorIds) !== ids(saved.doctorIds) || ids(draft.specialtyIds) !== ids(saved.specialtyIds);
}

/** Changing preferences or another profile field never silently changes eligibility. */
export function reviewedDoctorEligibility(draft: NurseDoctorEligibility | null, saved: NurseDoctorEligibility | null | undefined,
  confirmed: boolean, actor: string, now: string): NurseDoctorEligibility | null {
  if (!draft) {
    if (saved) throw new Error('Edit the eligibility choices instead of returning to the old profile rules.');
    return null;
  }
  if (!eligibilityNeedsReview(draft, saved)) return saved!;
  if (!confirmed || !actor.trim() || !Number.isFinite(Date.parse(now))) throw new Error('Confirm clinical eligibility before saving.');
  return { doctorIds: [...new Set(draft.doctorIds)], specialtyIds: [...new Set(draft.specialtyIds)], reviewedBy: actor, reviewedAt: now };
}
