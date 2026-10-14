/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A nurse's leave allowance for one kind of leave (the owner's rule of 14-10-2026): always in
 * days, read exactly as typed. Each leave day's hours are set on their own and never change
 * the allowance or the days used. (Large multiples of 8 were once taken for old hour values
 * and divided by 8, so 48 days read as 6; the live data has none, so that guess is gone.)
 */

/** The allowance in days, or null when none is set. */
export function allowanceDays(raw: unknown): number | null {
  return typeof raw === 'number' && raw > 0 ? raw : null;
}
