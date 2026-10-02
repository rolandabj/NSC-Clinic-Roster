/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Turns the year to date totals into a small head start (or handicap) for the
 * scheduling engine's fairness counters. Each nurse is compared with the clinic
 * average for her contract and the rosters she was part of, and the difference
 * is capped, so earlier rosters nudge this one rather than decide it.
 */

import { Nurse } from '../../types';
import { YearToDate, YearToDateCounts } from '../engine/clinicModel';

export interface YearSeed {
  weekendDays: number;
  holidays: number;
  lateShifts: number;
  nurseClinic: number;
}

/** How far above (positive) or below the average a nurse may start, in shifts or days. */
export const YEAR_SEED_CAP = 3;

const KEYS: (keyof YearSeed)[] = ['weekendDays', 'holidays', 'lateShifts', 'nurseClinic'];

const clamp = (value: number, cap: number) => Math.max(-cap, Math.min(cap, value));

/**
 * Per nurse: her year to date count minus what an average nurse with the same
 * contract and the same number of rosters would have, capped at plus or minus
 * YEAR_SEED_CAP. A 50% nurse is compared with half the full time count. Nurses
 * with no earlier rosters this year start at 0.
 */
export function yearToDateSeeds(
  yearToDate: YearToDate | undefined,
  nurses: Nurse[],
  cap = YEAR_SEED_CAP
): Map<string, YearSeed> {
  const seeds = new Map<string, YearSeed>();
  if (!yearToDate) return seeds;
  const share = (n: Nurse) => Math.max(0.1, (n.contractPercent ?? 100) / 100);
  const counted = nurses.filter((n) => (yearToDate[n.id]?.rosters || 0) > 0);
  // Each nurse's weight is her contract share times the rosters she worked in.
  const totalWeight = counted.reduce((sum, n) => sum + share(n) * yearToDate[n.id].rosters, 0);
  if (totalWeight <= 0) return seeds;
  const ratePer = (key: keyof YearSeed) =>
    counted.reduce((sum, n) => sum + (yearToDate[n.id][key as keyof YearToDateCounts] || 0), 0) / totalWeight;
  const rates = Object.fromEntries(KEYS.map((k) => [k, ratePer(k)])) as Record<keyof YearSeed, number>;
  counted.forEach((n) => {
    const ytd = yearToDate[n.id];
    const expected = share(n) * ytd.rosters;
    const seed = {} as YearSeed;
    KEYS.forEach((k) => {
      seed[k] = clamp((ytd[k] || 0) - rates[k] * expected, cap);
    });
    seeds.set(n.id, seed);
  });
  return seeds;
}
