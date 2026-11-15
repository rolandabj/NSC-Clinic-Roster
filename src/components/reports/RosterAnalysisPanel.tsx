import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { buildRosterAnalysis, downloadRosterAnalysis, downloadRosterReview, type RosterAnalysisInput } from '../../services/export/analysisExportService';
import { reviewDuration } from '../../services/export/rosterReviewText';
import { formatDate } from '../../utils/dateUtils';
import { notify } from '../common/dialogs';
import { Button, Notice } from '../ui';

export function RosterAnalysisPanel({ input }: { input: RosterAnalysisInput }) {
  const analysis = useMemo(() => buildRosterAnalysis(input), [input]);
  const { review } = analysis;
  const download = (kind: 'JSON' | 'TEXT') => {
    try {
      if (kind === 'JSON') downloadRosterAnalysis(input); else downloadRosterReview(input);
      notify(kind === 'JSON' ? 'Full report downloaded.' : 'Action list downloaded.', 'success');
    } catch (error) {
      notify(`The report could not be created: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };
  return <section aria-label="Roster review" className="space-y-4">
    <Notice tone={review.publication.canProceed ? 'info' : 'danger'}
      title={review.publication.canProceed ? 'No problems block publication' : 'Fix before publishing'}>
      <p>{review.publication.blockerCount} {review.publication.blockerCount === 1 ? 'problem' : 'problems'} to fix before publishing. {review.publication.checkCount} {review.publication.checkCount === 1 ? 'check' : 'checks'} to review.</p>
      <p>The Publish dialog checks the roster again before sending.</p>
    </Notice>
    <dl className="grid gap-3 sm:grid-cols-2">
      <div><dt className="text-ink-muted">Missing doctor cover</dt><dd className="font-semibold">{reviewDuration(review.coverage.uncoveredDoctorMinutes)}</dd></div>
      <div><dt className="text-ink-muted">Missing Nurse Clinic cover</dt><dd className="font-semibold">{reviewDuration(review.coverage.missingNurseClinicMinutes)} of nurse time</dd></div>
      {!!review.coverage.missingHolidayCoverMinutes && <div><dt className="text-ink-muted">Missing holiday cover</dt><dd className="font-semibold">{reviewDuration(review.coverage.missingHolidayCoverMinutes)} of nurse time</dd></div>}
      <div><dt className="text-ink-muted">Pairing exceptions needing review</dt><dd className="font-semibold">{review.pairingExceptions.pending + review.pairingExceptions.stale}</dd></div>
      <div><dt className="text-ink-muted">Clinical eligibility profiles to check</dt><dd className="font-semibold">{review.profileReviews.length}</dd></div>
    </dl>
    {!!(review.coverage.doctorGaps.length + review.coverage.nurseClinicGaps.length + review.coverage.holidayGaps.length) && <details className="rounded border border-line p-3">
      <summary className="cursor-pointer font-semibold">Exact coverage gaps</summary>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-ink-muted">
        {review.coverage.doctorGaps.map((gap, i) => <li key={`doctor-${i}`}>{formatDate(gap.date)}: {gap.doctor}, {gap.start} to {gap.end} ({reviewDuration(gap.minutes)}).</li>)}
        {review.coverage.nurseClinicGaps.map((gap, i) => <li key={`nc-${i}`}>{formatDate(gap.date)}: Nurse Clinic, {gap.start} to {gap.end}. Nurses missing: {gap.nursesMissing}.</li>)}
        {review.coverage.holidayGaps.map((gap, i) => <li key={`holiday-${i}`}>{formatDate(gap.date)}: holiday cover, {gap.start} to {gap.end}. Nurses missing: {gap.nursesMissing}.</li>)}
      </ul>
    </details>}
    {!!review.userActions.length && <details className="rounded border border-line p-3">
      <summary className="cursor-pointer font-semibold">Actions before publication</summary>
      <ol className="mt-2 list-decimal space-y-3 pl-5">{review.userActions.map(action => <li key={action.id}>
        <p>{action.message}</p><p className="text-ink-muted">{action.instruction}</p>
      </li>)}</ol>
    </details>}
    {!!review.profileReviews.length && <details className="rounded border border-line p-3">
      <summary className="cursor-pointer font-semibold">Profiles needing clinical eligibility review</summary>
      <p className="mt-2 text-ink-muted">Confirm the doctors and specialties each nurse can cover. Preferences rank work and do not confirm clinical eligibility.</p>
      <ul className="mt-2 list-disc pl-5">{review.profileReviews.map(profile => <li key={profile.nurseId}>{profile.nurse}</li>)}</ul>
    </details>}
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" icon={Download} onClick={() => download('JSON')}>Download the full report</Button>
      <Button icon={Download} onClick={() => download('TEXT')}>Download action list</Button>
    </div>
  </section>;
}
