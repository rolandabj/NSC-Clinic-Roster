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
