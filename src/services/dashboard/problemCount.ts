/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The open roster's problem count, shared with the top bar: whichever screen checks a roster
 * (the roster screen or the dashboard) reports it through the app context (reportProblems).
 */

import type { ClinicContextState } from '../../types/navigation';
import { formatDateRange } from '../../utils/dateUtils';

export interface ProblemCount {
  /** Empty when no roster is open (for example the last one was deleted). */
  scheduleId: string;
  name: string;
  startDate: string;
  endDate: string;
  mustFix: number;
  toCheck: number;
}

/**
 * The app frame with this problem count. The same frame object when nothing it shows changed,
 * so the screens under it are not drawn again (the roster screen reports after every check).
 */
export function withProblemCount(prev: ClinicContextState, detail: ProblemCount): ClinicContextState {
  const next = {
    warningCount: detail.mustFix + detail.toCheck,
    activeScheduleId: detail.scheduleId || null,
    activeScheduleName: detail.scheduleId ? detail.name : '',
    activeSchedulePeriod: detail.scheduleId ? formatDateRange(detail.startDate, detail.endDate) : '',
  };
  const same = (Object.keys(next) as (keyof typeof next)[]).every((k) => prev[k] === next[k]);
  return same ? prev : { ...prev, ...next };
}
