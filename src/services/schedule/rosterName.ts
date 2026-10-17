/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The name offered for a new roster (Phase 7, slice 3c): "November 2026", "16 to 29 November
 * 2026" or "16 November to 13 December 2026". It replaced names in US date style with dashes
 * ("Nov 16 – Dec 13, 2026 — Clinic").
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function suggestRosterName(startDate: string, endDate: string): string {
  const parse = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) } : null;
  };
  const a = parse(startDate);
  const b = parse(endDate);
  if (!a || !b || startDate > endDate) return 'New roster';
  const lastDay = new Date(Date.UTC(b.y, b.m + 1, 0)).getUTCDate();
  if (a.y === b.y && a.m === b.m) {
    if (a.d === 1 && b.d === lastDay) return `${MONTHS[a.m]} ${a.y}`;
    return `${a.d} to ${b.d} ${MONTHS[a.m]} ${a.y}`;
  }
  if (a.y === b.y) return `${a.d} ${MONTHS[a.m]} to ${b.d} ${MONTHS[b.m]} ${b.y}`;
  return `${a.d} ${MONTHS[a.m]} ${a.y} to ${b.d} ${MONTHS[b.m]} ${b.y}`;
}
