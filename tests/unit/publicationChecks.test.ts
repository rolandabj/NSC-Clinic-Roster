import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allocationSignature, approveAllocation, hasAllocationReview } from '../../src/services/engine/allocationReview';
import { applyAllocationDrafts, publicationReport } from '../../src/services/publish/publicationChecks';
import { makeNurse } from './fixtures';
import type { Assignment, Doctor } from '../../src/types';
import type { ValidationFinding, ValidationReport } from '../../src/services/validation/ScheduleValidator';
const a = { id: 'a', scheduleId: 's', nurseId: 'n', date: '2026-12-18', dutyWindowId: 'd', kind: 'DOCTOR', doctorId: 'derma', source: 'GENERATED', locked: false } as Assignment;
const nurse = makeNurse('n', { preferences: [{ kind: 'SPECIALTY', refId: 'peds', rank: 1 }] });
const refs = { doctors: [{ id: 'derma', fullName: 'Dr D', specialtyIds: ['derma'] } as Doctor],
  specialties: [{ id: 'derma', name: 'Dermatology', code: 'D' }], sessions: [] };
const report = (findings: ValidationFinding[] = []): ValidationReport => ({ scheduleId: 's', timestamp: '', findings,
  errorCount: 0, warnCount: findings.length, infoCount: 0, hourlyCoverageMap: {} });
const finding = (id: string) => ({ id, severity: 'WARN', category: 'COVERAGE_GAP', message: id, affectedNurseIds: [], cellRefs: [] } as ValidationFinding);

test('doctor gaps block publication even when the draft checker labels them warnings', () => {
  for (const id of ['session-partial-s', 'unassigned-session-s', 'session-no-overlap-s']) {
    assert.equal(publicationReport(report([finding(id)]), [], [], refs).errorCount, 1);
  }
});

test('last resort and agreed exception note prefixes alone cannot authorize publication', () => {
  for (const note of ['Last resort: none of the nurses who list this doctor was free', 'Agreed exception: not in the nurse list']) {
    assert.equal(publicationReport(report(), [{ ...a, note }], [nurse], refs).errorCount, 1);
  }
});

test('a valid explicit review allows a legacy exception but becomes stale after any pairing change', () => {
  const reviewed = { ...a, allocationReview: approveAllocation(a, 'planner', 'Confirmed with the clinic lead', '2026-11-15T10:00:00Z') };
  assert.ok(hasAllocationReview(reviewed));
  assert.equal(publicationReport(report(), [reviewed], [nurse], refs).errorCount, 0);
  for (const change of [{ date: '2026-12-17' }, { nurseId: 'other' }, { doctorId: 'other' }, { dutyWindowId: 'late' }, { id: 'copied' }]) {
    assert.equal(hasAllocationReview({ ...reviewed, ...change }), false);
  }
});

test('a clinical eligibility violation remains a blocker even when a review exists', () => {
  const reviewed = { ...a, allocationReview: approveAllocation(a, 'planner', 'Approved', '2026-11-15T10:00:00Z') };
  const restricted = { ...nurse, doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedAt: '2026-11-15T10:00:00Z', reviewedBy: 'planner' } };
  const f = { ...finding('h8-doctor-allocation-n-2026-12-18'), severity: 'ERROR' as const, category: 'RULE_VIOLATION' as const, affectedNurseIds: ['n'], date: a.date };
  assert.equal(publicationReport(report([f]), [reviewed], [restricted], refs).errorCount, 1);
});

test('draft confirmation is bound to the exact shift and requires a reason and signed in reviewer', () => {
  const drafts = { a: { signature: allocationSignature(a), reason: 'Confirmed', confirmed: true } };
  assert.ok(hasAllocationReview(applyAllocationDrafts([a], drafts, 'planner', '2026-11-15T10:00:00Z')[0]));
  assert.equal(hasAllocationReview(applyAllocationDrafts([{ ...a, doctorId: 'changed' }], drafts, 'planner', '2026-11-15T10:00:00Z')[0]), false);
  assert.equal(hasAllocationReview(applyAllocationDrafts([a], drafts, '', '2026-11-15T10:00:00Z')[0]), false);
  assert.equal(hasAllocationReview(applyAllocationDrafts([a], { a: { ...drafts.a, reason: '' } }, 'planner', '2026-11-15T10:00:00Z')[0]), false);
});

test('publication checks can be repeated without duplicating or retaining stale review blockers', () => {
  const first = publicationReport(report(), [a], [nurse], refs);
  const second = publicationReport(first, [a], [nurse], refs);
  assert.equal(second.errorCount, first.errorCount);
  const reviewed = { ...a, allocationReview: approveAllocation(a, 'planner', 'Confirmed', '2026-11-15T10:00:00Z') };
  assert.equal(publicationReport(first, [reviewed], [nurse], refs).errorCount, 0);
});
