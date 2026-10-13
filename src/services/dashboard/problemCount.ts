/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The open roster's problem count, shared with the top bar: whichever screen checks a roster
 * (the roster screen or the dashboard) reports it through the app context (reportProblems).
 */

import type { ClinicContextState } from '../../types/navigation';
import { formatDateRange } from '../../utils/dateUtils';

/** How many problems of each kind a roster has. */
export interface ProblemTally {
  mustFix: number;
  toCheck: number;
  notes: number;
}

export interface ProblemCount extends ProblemTally {
  /** Empty when no roster is open (for example the last one was deleted). */
  scheduleId: string;
  name: string;
  startDate: string;
  endDate: string;
}

/**
 * The one count, in words, used everywhere: "28 must fix · 6 to check · 3 notes". Kinds with
 * none are left out; "No problems" when there are none at all.
 */
export function problemCountWords(t: ProblemTally): string {
  const parts = [
    t.mustFix > 0 ? `${t.mustFix} must fix` : '',
    t.toCheck > 0 ? `${t.toCheck} to check` : '',
    t.notes > 0 ? `${t.notes} ${t.notes === 1 ? 'note' : 'notes'}` : '',
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'No problems';
}

/**
 * The app frame with this problem count. The same frame object when nothing it shows changed,
 * so the screens under it are not drawn again (the roster screen reports after every check).
 */
export function withProblemCount(prev: ClinicContextState, detail: ProblemCount): ClinicContextState {
  const next = {
    activeScheduleId: detail.scheduleId || null,
    activeScheduleName: detail.scheduleId ? detail.name : '',
    activeSchedulePeriod: detail.scheduleId ? formatDateRange(detail.startDate, detail.endDate) : '',
  };
  // No roster open: no count to show.
  const problems: ProblemTally | null = detail.scheduleId ? { mustFix: detail.mustFix, toCheck: detail.toCheck, notes: detail.notes } : null;
  const sameProblems =
    prev.problems === problems ||
    (!!prev.problems && !!problems && prev.problems.mustFix === problems.mustFix && prev.problems.toCheck === problems.toCheck && prev.problems.notes === problems.notes);
  const same = sameProblems && (Object.keys(next) as (keyof typeof next)[]).every((k) => prev[k] === next[k]);
  return same ? prev : { ...prev, ...next, problems };
}
