/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A nurse's doctor and specialty choices in the order the generator should use them.
 * Her list is one ordered list of doctors and specialties; her "preferenceFocus"
 * setting can move all her doctors (or all her specialties) to the front.
 */

import type { Nurse, NursePreference, PreferenceFocus } from '../../types';

export const PREFERENCE_FOCUS_LABELS: Record<PreferenceFocus, string> = {
  LIST: 'Follow my list order',
  DOCTOR: 'Preferred doctors first',
  SPECIALTY: 'Specialty first',
};

const isPairing = (p: NursePreference) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY';

/**
 * Her preferences with the doctor and specialty ranks reordered by her setting.
 * The rank numbers she used are kept (only who holds which number changes), so
 * clinical role choices that share the list are not moved. With 'LIST' (or no
 * setting, or only one kind of choice) the nurse is returned unchanged.
 */
export function applyPreferenceFocus(nurse: Nurse): Nurse {
  const focus = nurse.preferenceFocus || 'LIST';
  const prefs = nurse.preferences || [];
  if (focus === 'LIST') return nurse;
  const pairing = prefs.filter(isPairing);
  if (!pairing.some((p) => p.kind === 'DOCTOR') || !pairing.some((p) => p.kind === 'SPECIALTY')) return nurse;

  const firstKind = focus === 'DOCTOR' ? 'DOCTOR' : 'SPECIALTY';
  const byRank = (a: NursePreference, b: NursePreference) => a.rank - b.rank;
  const rankNumbers = pairing.map((p) => p.rank).sort((a, b) => a - b);
  const reordered = [
    ...pairing.filter((p) => p.kind === firstKind).sort(byRank),
    ...pairing.filter((p) => p.kind !== firstKind).sort(byRank),
  ];
  const newRank = new Map<NursePreference, number>(reordered.map((p, i) => [p, rankNumbers[i]]));
  return { ...nurse, preferences: prefs.map((p) => (newRank.has(p) ? { ...p, rank: newRank.get(p)! } : p)) };
}
