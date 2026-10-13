/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Which presence records count as "also here" (pure, so it can be tested).
 */

import { PresenceRecord } from '../../types';

/** A record not refreshed for this long belongs to a closed or hidden tab. */
export const STALE_MS = 150 * 1000;

/** Other people (not my own other tabs) who have this roster open now, one entry per person. */
export function othersOnRoster(records: PresenceRecord[], myUid: string | undefined, scheduleId: string | null, now = Date.now()) {
  if (!scheduleId) return [];
  const byPerson = new Map<string, PresenceRecord>();
  for (const p of records) {
    if (p.uid === myUid || p.scheduleId !== scheduleId) continue;
    const age = now - Number(p.at);
    if (!(age < STALE_MS && age > -STALE_MS)) continue;
    byPerson.set(p.uid, p);
  }
  return [...byPerson.values()];
}

/**
 * True when two "also here" lists show the same people (same user ids, names and emails, in
 * order). A heartbeat only refreshes a record's time, which nobody sees, so it changes nothing.
 */
export function samePeople(a: PresenceRecord[], b: PresenceRecord[]): boolean {
  return a.length === b.length && a.every((p, i) => p.uid === b[i].uid && p.name === b[i].name && p.email === b[i].email);
}
