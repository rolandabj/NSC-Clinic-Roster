import type { Assignment, Nurse } from '../../types';
import { allocationSignature } from '../../services/engine/allocationReview';
import { pendingAllocationReviews, type AllocationDrafts, type AllocationRefs } from '../../services/publish/publicationChecks';
import { Checkbox, Field, Input, Notice } from '../ui';
import { formatDate } from '../../utils/dateUtils';

export function AllocationReviews({ assignments, nurses, refs, drafts, onChange }: {
  assignments: Assignment[]; nurses: Nurse[]; refs: AllocationRefs; drafts: AllocationDrafts;
  onChange: (drafts: AllocationDrafts) => void;
}) {
  const pending = pendingAllocationReviews(assignments, nurses, refs);
  if (!pending.length) return null;
  return <Notice tone="warning" title="Review pairing exceptions">
    <p>Check that each nurse can cover this doctor or specialty and record why this pairing is needed.</p>
    <div className="mt-3 space-y-4">{pending.map(({ assignment: a, nurse, outside }) => {
      const signature = allocationSignature(a);
      const draft = drafts[a.id]?.signature === signature ? drafts[a.id] : { signature, reason: '', confirmed: false };
      return <fieldset key={a.id} className="space-y-2 rounded border border-warning-line p-3">
        <legend className="font-semibold">{nurse.fullName} with {outside.name}, {formatDate(a.date)}</legend>
        <Field label={`Reason for ${nurse.fullName}'s pairing exception on ${formatDate(a.date)}`}>
          {f => <Input {...f} value={draft.reason} onChange={e => onChange({ ...drafts,
            [a.id]: { signature, reason: e.target.value, confirmed: false } })} />}
        </Field>
        <Checkbox label={`Approve this pairing exception for ${nurse.fullName} on ${formatDate(a.date)}`}
          checked={draft.confirmed} disabled={!draft.reason.trim()} onChange={e => onChange({ ...drafts,
            [a.id]: { ...draft, confirmed: e.target.checked } })} />
      </fieldset>;
    })}</div>
  </Notice>;
}
