/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Lock Scope Utility (Phase 1)
 * Locks (pinned days) belong to exactly one schedule. Historically LockEntry had no
 * scheduleId, so scoping was approximated by "date falls inside the schedule window",
 * which leaked locks between overlapping schedules.
 *
 * Resolution rules (deterministic, backwards compatible):
 * 1. If the lock carries a scheduleId, it belongs to that schedule only.
 * 2. Otherwise (legacy / untagged lock) fall back to the date-window rule so existing
 *    data keeps working until the backfill migration tags it.
 */

import { LockEntry, Schedule } from '../../types';

type ScheduleScope = Pick<Schedule, 'id' | 'startDate' | 'endDate'>;
type LockLike = { date: string; scheduleId?: string };

/**
 * True when a lock applies to the given schedule.
 */
export function isLockInSchedule(
  lock: LockLike | null | undefined,
  schedule: ScheduleScope | null | undefined
): boolean {
  if (!lock || !schedule) return false;
  if (lock.scheduleId) return lock.scheduleId === schedule.id;
  return lock.date >= schedule.startDate && lock.date <= schedule.endDate;
}

/**
 * Returns only the locks that apply to the given schedule.
 */
export function filterLocksForSchedule<T extends LockLike>(
  locks: T[] | null | undefined,
  schedule: ScheduleScope | null | undefined
): T[] {
  if (!locks || locks.length === 0 || !schedule) return [];
  return locks.filter((lock) => isLockInSchedule(lock, schedule));
}

/**
 * Resolves which schedule a lock created for a bare date should belong to.
 * Deterministic: prefers the schedule with the latest startDate covering the date,
 * then the lexicographically smallest id (for stable results when two schedules
 * start on the same day).
 */
export function resolveScheduleIdForLockDate(
  schedules: ScheduleScope[] | null | undefined,
  date: string
): string | undefined {
  if (!schedules || schedules.length === 0 || !date) return undefined;
  const covering = schedules.filter((s) => date >= s.startDate && date <= s.endDate);
  if (covering.length === 0) return undefined;
  const sorted = [...covering].sort(
    (a, b) => b.startDate.localeCompare(a.startDate) || a.id.localeCompare(b.id)
  );
  return sorted[0].id;
}

/**
 * Tags a lock with the schedule it belongs to. Existing tags are preserved.
 */
export function tagLockWithSchedule<T extends LockLike>(
  lock: T,
  scheduleId: string | undefined
): T {
  if (!scheduleId || lock.scheduleId) return lock;
  return { ...lock, scheduleId };
}

/**
 * Convenience: scoped generic filter used by callers that hold a full lock list.
 */
export function scopeLocks<T extends LockEntry>(
  locks: T[] | null | undefined,
  schedule: ScheduleScope | null | undefined
): T[] {
  return filterLocksForSchedule(locks, schedule);
}
