/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The open roster's problem count, shared with the top bar: whichever screen checks a roster
 * (the roster screen or the dashboard) reports it through the app context (reportProblems).
 */

export interface ProblemCount {
  /** Empty when no roster is open (for example the last one was deleted). */
  scheduleId: string;
  name: string;
  startDate: string;
  endDate: string;
  mustFix: number;
  toCheck: number;
}
