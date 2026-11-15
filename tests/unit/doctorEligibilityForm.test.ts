import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eligibilityNeedsReview, reviewedDoctorEligibility } from '../../src/services/nurses/doctorEligibilityForm';
const now = '2026-11-15T10:00:00Z';
const saved = { doctorIds: ['peds'], specialtyIds: [], reviewedAt: now, reviewedBy: 'first-planner' };

test('editing other profile fields retains the original eligibility review', () => {
  assert.equal(eligibilityNeedsReview({ ...saved }, saved), false);
  assert.equal(reviewedDoctorEligibility({ ...saved }, saved, false, 'another-planner', now), saved);
  assert.equal(reviewedDoctorEligibility(null, null, false, '', now), null);
});

test('new or changed eligibility needs explicit confirmation and the signed in account', () => {
  const changed = { ...saved, doctorIds: ['derma'] };
  assert.throws(() => reviewedDoctorEligibility(changed, saved, false, 'planner', now));
  assert.throws(() => reviewedDoctorEligibility(changed, saved, true, '', now));
  assert.deepEqual(reviewedDoctorEligibility(changed, saved, true, 'planner', now)!.doctorIds, ['derma']);
});

test('a reviewed empty list is supported and cannot silently revert to legacy unrestricted allocation', () => {
  const empty = { doctorIds: [], specialtyIds: [], reviewedAt: '', reviewedBy: '' };
  assert.ok(eligibilityNeedsReview(empty, null));
  const reviewed = reviewedDoctorEligibility(empty, null, true, 'planner', now)!;
  assert.deepEqual(reviewed.doctorIds, []);
  assert.throws(() => reviewedDoctorEligibility(null, reviewed, true, 'planner', now));
});
