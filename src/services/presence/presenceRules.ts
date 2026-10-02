/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Which presence records count as "also here" (pure, so it can be tested).
 */

import { PresenceRecord } from '../../types';

/** A record not refreshed for this long belongs to a closed tab. */
export const STALE_MS = 75 * 1000;

/** People other than me who have this roster open now. */
export function othersOnRoster(records: PresenceRecord[], myId: string | undefined, scheduleId: string | null, now = Date.now()) {
  if (!scheduleId) return [];
  return records.filter((p) => p.id !== myId && p.scheduleId === scheduleId && now - Date.parse(p.at) < STALE_MS);
}
