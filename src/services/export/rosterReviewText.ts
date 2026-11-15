import type { RosterAnalysis } from './analysisExportService';
import { formatDate, formatDateTime } from '../../utils/dateUtils';

export function reviewDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}h${rest ? ` ${rest}m` : ''}` : `${rest}m`;
}

/** A readable action list with the same counts and policy as the JSON report. */
export function rosterReviewText(analysis: RosterAnalysis): string {
  const { review, roster } = analysis;
  const lines = [analysis.clinic.name, `Roster: ${roster.name}`,
    `Dates: ${formatDate(roster.startDate)} to ${formatDate(roster.endDate)}`,
    `Report created: ${formatDateTime(analysis.exportedAt)}`, '',
    review.publication.canProceed ? 'No problems block publication.' : 'Fix before publishing.',
    `Problems to fix before publishing: ${review.publication.blockerCount}`,
    `Checks to review: ${review.publication.checkCount}`,
    `Missing doctor cover: ${reviewDuration(review.coverage.uncoveredDoctorMinutes)}`,
    `Missing Nurse Clinic cover: ${reviewDuration(review.coverage.missingNurseClinicMinutes)} of nurse time`,
    `Missing holiday cover: ${reviewDuration(review.coverage.missingHolidayCoverMinutes)} of nurse time`,
    `Pairing exceptions needing review: ${review.pairingExceptions.pending + review.pairingExceptions.stale}`,
    'The Publish dialog checks the roster again before sending.', '', 'Doctor coverage gaps'];
  if (!review.coverage.doctorGaps.length) lines.push('None.');
  for (const gap of review.coverage.doctorGaps) lines.push(`${formatDate(gap.date)}: ${gap.doctor}, ${gap.start} to ${gap.end} (${reviewDuration(gap.minutes)}).`);
  lines.push('', 'Nurse Clinic coverage gaps');
  if (!review.coverage.nurseClinicGaps.length) lines.push('None.');
  for (const gap of review.coverage.nurseClinicGaps) lines.push(`${formatDate(gap.date)}: ${gap.start} to ${gap.end}, ${gap.nursesMissing} ${gap.nursesMissing === 1 ? 'nurse' : 'nurses'} missing (${reviewDuration(gap.missingNurseMinutes)} of nurse time).`);
  lines.push('', 'Holiday coverage gaps');
  if (!review.coverage.holidayGaps.length) lines.push('None.');
  for (const gap of review.coverage.holidayGaps) lines.push(`${formatDate(gap.date)}: ${gap.start} to ${gap.end}, ${gap.nursesMissing} ${gap.nursesMissing === 1 ? 'nurse' : 'nurses'} missing.`);
  lines.push('', 'Actions before publication');
  if (!review.userActions.length) lines.push('No problems block publication. Review any checks in Publish.');
  for (const [i, action] of review.userActions.entries()) lines.push(`${i + 1}. ${action.message}`, `   ${action.instruction}`);
  lines.push('', 'Clinical eligibility profiles to check');
  if (!review.profileReviews.length) lines.push('None.');
  for (const profile of review.profileReviews) lines.push(`${profile.nurse}: clinical eligibility needs confirmation. ${profile.instruction}`);
  lines.push('', 'Preferences rank work. They do not confirm clinical eligibility.',
    'Arrange cover or correct the clinic sessions for remaining gaps.');
  return lines.join('\n') + '\n';
}
