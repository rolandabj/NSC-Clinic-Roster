/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The open roster's problem count, shared with the top bar: whichever screen
 * checks a roster (the schedule screen or the dashboard) announces the result.
 */

export const PROBLEMS_EVENT = 'clinic-roster-problems';

export interface ProblemCount {
  scheduleId: string;
  mustFix: number;
  toCheck: number;
}

export function announceProblems(count: ProblemCount): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ProblemCount>(PROBLEMS_EVENT, { detail: count }));
}
