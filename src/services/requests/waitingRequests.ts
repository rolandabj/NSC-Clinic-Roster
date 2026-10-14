/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Requests screen's Waiting tab (UI overhaul Phase 6, slice 4): each waiting request
 * in words, with its dates as DD-MM-YYYY, and the title of the question before a decision.
 */

import type { AvailabilityRequest, DutyWindow, LeaveEntry } from '../../types';
import { formatDayDate } from '../../utils/dateUtils';

/** "Annual Leave, Fri 20-11-2026 to Sun 22-11-2026", or one day. */
export function waitingLeaveText(l: Pick<LeaveEntry, 'startDate' | 'endDate'> & { leaveTypeName?: string }): string {
  const days = l.startDate === l.endDate ? formatDayDate(l.startDate) : `${formatDayDate(l.startDate)} to ${formatDayDate(l.endDate)}`;
  return `${l.leaveTypeName || 'Leave'}, ${days}`;
}

/** "Day off on Wed 18-11-2026", or "Wants to work the D shift on Wed 18-11-2026". */
export function waitingDayText(a: Pick<AvailabilityRequest, 'date' | 'available' | 'preferredDutyWindowId'>, shifts: Pick<DutyWindow, 'id' | 'name'>[]): string {
  const day = formatDayDate(a.date);
  if (!a.available) return `Day off on ${day}`;
  const shift = shifts.find((s) => s.id === a.preferredDutyWindowId);
  return shift ? `Wants to work the ${shift.name} on ${day}` : `Wants to work on ${day}`;
}

export function decisionTitle(decision: 'APPROVED' | 'REJECTED', nurseName: string): string {
  return `${decision === 'APPROVED' ? 'Approve' : 'Decline'} ${nurseName}'s request?`;
}
