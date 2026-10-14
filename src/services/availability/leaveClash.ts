/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A leave must not cover another leave or a pinned day of the same nurse (Checkpoint 6):
 * the grid shows one thing a day, and the hours would count twice.
 */

import type { LeaveEntry, LockEntry } from '../../types';
import { formatDayDate } from '../../utils/dateUtils';

/** Why the leave cannot be saved, naming the first day that clashes, or null when it can. */
export function leaveClash(
  nurseId: string,
  startDate: string,
  endDate: string,
  leaves: Pick<LeaveEntry, 'id' | 'nurseId' | 'startDate' | 'endDate' | 'status'>[],
  pins: Pick<LockEntry, 'nurseId' | 'date'>[],
  ignoreLeaveId?: string
): string | null {
  const other = leaves
    .filter((l) => l.nurseId === nurseId && l.id !== ignoreLeaveId && l.status !== 'REJECTED')
    .filter((l) => l.startDate <= endDate && l.endDate >= startDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  if (other) return `This nurse already has leave on ${formatDayDate(other.startDate > startDate ? other.startDate : startDate)}.`;
  const pin = pins
    .filter((p) => p.nurseId === nurseId && p.date >= startDate && p.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (pin) return `This nurse has a pinned day on ${formatDayDate(pin.date)}. Remove the pin first.`;
  return null;
}
