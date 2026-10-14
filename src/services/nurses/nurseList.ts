/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Nurses screen's list (UI overhaul Phase 6): which nurses the search and the
 * filters leave, and the counts in the page's heading.
 */

import type { Nurse } from '../../types';

export interface NurseFilters {
  /** Part of a name, an employee code or an email address. */
  query: string;
  /** A seniority level id, or 'ALL'. */
  levelId: string;
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
}

export function filterNurses(nurses: Nurse[], { query, levelId, status }: NurseFilters): Nurse[] {
  const q = query.trim().toLowerCase();
  return nurses.filter((n) => {
    // Records saved by older versions may have no email or code.
    const found = !q || [n.fullName, n.employeeCode, n.gmail].some((text) => (text || '').toLowerCase().includes(q));
    const level = levelId === 'ALL' || n.seniorityLevelId === levelId;
    const state = status === 'ALL' || (status === 'ACTIVE') === !!n.active;
    return found && level && state;
  });
}

export function nurseCounts(nurses: Nurse[]): { total: number; active: number } {
  return { total: nurses.length, active: nurses.filter((n) => n.active).length };
}
