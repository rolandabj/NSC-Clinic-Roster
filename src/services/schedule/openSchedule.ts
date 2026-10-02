/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Schedule } from '../../types';

/** Local date (YYYY-MM-DD). */
function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * The roster to open: the one already open (or last opened in this browser),
 * else the one the app chose, else the roster that includes today, else the
 * one that starts last.
 */
export function chooseScheduleToOpen(
  list: Schedule[],
  openId: string | null,
  contextId?: string | null,
  today: string = todayLocal()
): Schedule | undefined {
  if (list.length === 0) return undefined;
  const byId = (id?: string | null) => (id ? list.find((s) => s.id === id) : undefined);
  return (
    byId(openId) ||
    byId(contextId) ||
    list.find((s) => s.startDate <= today && s.endDate >= today) ||
    [...list].sort((a, b) => b.startDate.localeCompare(a.startDate))[0]
  );
}
