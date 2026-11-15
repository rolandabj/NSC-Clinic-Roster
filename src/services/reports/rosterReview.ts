import type { Assignment, Nurse } from '../../types';
import { hasAllocationReview } from '../engine/allocationReview';
import { assignmentDoctorIds, toMinutes } from '../engine/clinicModel';
import { hasReviewedDoctorEligibility, outsideNurseList } from '../engine/nurseList';
import { publicationReport, type AllocationRefs } from '../publish/publicationChecks';
import { problemRule } from '../validation/findingRule';
import type { ValidationFinding, ValidationReport } from '../validation/ScheduleValidator';

/** Permission under a saved profile does not imply a matching ranked preference. */
export function allocationAssessment(assignment: Assignment, nurse: Nurse | undefined, refs: AllocationRefs) {
  const clinicalEligibility = !nurse ? 'MISSING_NURSE' : nurse.doctorEligibility == null ? 'LEGACY'
    : hasReviewedDoctorEligibility(nurse) ? 'REVIEWED' : 'UNREVIEWED';
  const outside = nurse ? outsideNurseList(nurse, assignment, refs) : null;
  const exceptionReview = !outside ? 'NOT_REQUIRED' : outside.eligibility ? 'NOT_PERMITTED'
    : hasAllocationReview(assignment) ? 'REVIEWED' : assignment.allocationReview ? 'STALE' : 'PENDING';
  return {
    clinicalEligibility, allowedByProfile: !!nurse && !outside, exceptionReview,
    doctors: assignmentDoctorIds(assignment).map(doctorId => ({
      doctorId, doctor: refs.doctors.find(d => d.id === doctorId)?.fullName || doctorId,
      allowedByProfile: !!nurse && !outsideNurseList(nurse, { ...assignment, doctorId, secondDoctorId: undefined }, refs),
    })),
  };
}
interface ReviewSession {
  sessionId: string; doctorId: string; doctor: string; date: string;
  uncovered: { start: string; end: string }[];
}
type ActionType = 'ARRANGE_COVER' | 'REVIEW_ELIGIBILITY' | 'REVIEW_PAIRING' | 'FIX_ROSTER';
function actionFor(f: ValidationFinding, nurses: Nurse[]): { type: ActionType; instruction: string } {
  if (/^(unassigned-session-|session-partial-|session-no-overlap-)/.test(f.id)) return {
    type: 'ARRANGE_COVER', instruction: 'Assign an eligible nurse for the missing session time, or correct the doctor clinic hours.',
  };
  if (/^low-acuity-float-/.test(f.id)) return {
    type: 'ARRANGE_COVER', instruction: 'Use eligible Float nurses for separate doctor cover while preserving required Nurse Clinic cover. Shared cover is a last resort.',
  };
  if (/^(holiday-gap-|holiday-no-nurse-)/.test(f.id)) return {
    type: 'ARRANGE_COVER', instruction: 'Arrange nurse cover for the missing holiday opening hours.',
  };
  if (/^(cov-gap-|nc-coverage-)/.test(f.id)) return {
    type: 'ARRANGE_COVER', instruction: 'Arrange qualified Nurse Clinic cover for the missing time.',
  };
  if (/^allocation-review-/.test(f.id) || (/^h8-/.test(f.id) &&
    !nurses.some(n => f.affectedNurseIds.includes(n.id) && n.doctorEligibility != null))) return {
    type: 'REVIEW_PAIRING', instruction: 'Confirm this pairing with the clinic lead, then record a reason and approve it in Publish.',
  };
  if (/^h8-/.test(f.id)) return {
    type: 'REVIEW_ELIGIBILITY', instruction: 'Verify clinical eligibility, then change the shift or correct the nurse profile.',
  };
  return { type: 'FIX_ROSTER', instruction: 'Correct the roster or clinic detail shown in this problem and check the roster again.' };
}

/** Read only diagnostics. Publication decisions always use the shared publication policy. */
export function buildRosterReview(report: ValidationReport, assignments: Assignment[], nurses: Nurse[], refs: AllocationRefs, sessions: ReviewSession[]) {
  const published = publicationReport(report, assignments, nurses, refs);
  const blockers = published.findings.filter(f => f.severity === 'ERROR').map(f => ({
    id: f.id, rule: problemRule(f.id), date: f.date || null, message: f.message,
    nurseIds: f.affectedNurseIds, nurses: f.affectedNurseIds.map(id => nurses.find(n => n.id === id)?.fullName || id),
    ...actionFor(f, nurses),
  }));
  const doctorGaps = sessions.flatMap(s => s.uncovered.map(gap => ({
    sessionId: s.sessionId, doctorId: s.doctorId, doctor: s.doctor, date: s.date,
    start: gap.start, end: gap.end, minutes: toMinutes(gap.end) - toMinutes(gap.start),
  })));
  const nurseClinicGaps: { date: string; start: string; end: string; nursesMissing: number; missingNurseMinutes: number }[] = [];
  const holidayGaps: typeof nurseClinicGaps = [];
  for (const [date, slots] of Object.entries(report.hourlyCoverageMap).sort(([a], [b]) => a.localeCompare(b))) {
    for (const [start, slot] of Object.entries(slots).sort(([a], [b]) => a.localeCompare(b))) {
      if (!slot.end || slot.deficit <= 0) continue;
      const missingNurseMinutes = (toMinutes(slot.end) - toMinutes(start)) * slot.deficit;
      const gaps = slot.holiday ? holidayGaps : nurseClinicGaps;
      const previous = gaps.at(-1);
      if (previous?.date === date && previous.end === start && previous.nursesMissing === slot.deficit) {
        previous.end = slot.end; previous.missingNurseMinutes += missingNurseMinutes;
      } else gaps.push({ date, start, end: slot.end, nursesMissing: slot.deficit, missingNurseMinutes });
    }
  }
  const assessments = assignments.map(a => allocationAssessment(a, nurses.find(n => n.id === a.nurseId), refs));
  // One pairing can have both an H8 finding and a pending review finding.
  const userActions = blockers.filter((b, index) => index === blockers.findIndex(other =>
    other.type === b.type && other.date === b.date && [...other.nurseIds].sort().join('|') === [...b.nurseIds].sort().join('|') &&
    (b.type === 'REVIEW_PAIRING' || other.id === b.id)));
  return {
    publication: { canProceed: blockers.length === 0, blockerCount: blockers.length, checkCount: published.warnCount, blockers },
    coverage: { uncoveredDoctorMinutes: doctorGaps.reduce((sum, g) => sum + g.minutes, 0), doctorGaps,
      missingNurseClinicMinutes: nurseClinicGaps.reduce((sum, g) => sum + g.missingNurseMinutes, 0), nurseClinicGaps,
      missingHolidayCoverMinutes: holidayGaps.reduce((sum, g) => sum + g.missingNurseMinutes, 0), holidayGaps },
    pairingExceptions: {
      pending: assessments.filter(a => a.exceptionReview === 'PENDING').length,
      reviewed: assessments.filter(a => a.exceptionReview === 'REVIEWED').length,
      stale: assessments.filter(a => a.exceptionReview === 'STALE').length,
    },
    profileReviews: nurses.filter(n => n.active && n.isClinicNurse && !hasReviewedDoctorEligibility(n)).map(n => ({
      nurseId: n.id, nurse: n.fullName, clinicalEligibility: n.doctorEligibility == null ? 'LEGACY' : 'UNREVIEWED',
      instruction: 'Confirm the doctors and specialties this nurse can cover in their clinical eligibility profile.',
    })),
    userActions,
  };
}
