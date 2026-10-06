/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * What "leave waiting for approval" means, shared by the generator, the cell
 * explanations and the grid (a small module so none of them import each other).
 */

import type { LeaveEntry } from '../../types';

/** Leave a nurse asked for that is not decided yet (the same test as the requests page). */
export function isPendingLeave(le: Pick<LeaveEntry, 'status' | 'approved'>): boolean {
  return le.status === 'PENDING' || (le.status === undefined && le.approved === false);
}

/**
 * What the Approved / Pending switch of the leave editor saves. A leave keeps its
 * approval twice: `approved` (read by the roster, the generator and the hours) and
 * `status` (read by the approval pages and the nurse's own page), so both are set
 * together and can never disagree. Approving also records who decided; a declined
 * leave left on "Pending" stays declined.
 */
export function leaveApprovalFields(
  approved: boolean,
  before: Pick<LeaveEntry, 'approved' | 'status'> | undefined,
  reviewer?: { uid: string; name?: string; email?: string } | null,
  now: string = new Date().toISOString()
): Pick<LeaveEntry, 'approved' | 'status' | 'reviewedByUserId' | 'reviewedByUserName' | 'reviewedAt'> {
  if (!approved) return { approved: false, status: before?.status === 'REJECTED' ? 'REJECTED' : 'PENDING' };
  const wasApproved = before?.status === 'APPROVED' || (before?.status === undefined && before?.approved === true);
  if (wasApproved || !reviewer) return { approved: true, status: 'APPROVED' };
  return { approved: true, status: 'APPROVED', reviewedByUserId: reviewer.uid, reviewedByUserName: reviewer.name || reviewer.email, reviewedAt: now };
}
