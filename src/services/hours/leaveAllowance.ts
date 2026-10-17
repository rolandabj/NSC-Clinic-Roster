/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A nurse's leave allowance for one kind of leave (the owner's rule of 14-10-2026): always in
 * days, read exactly as typed. Each leave day's hours are set on their own and never change
 * the allowance or the days used. (Large multiples of 8 were once taken for old hour values
 * and divided by 8, so 48 days read as 6; the live data has none, so that guess is gone.)
 *
 * Only what is set counts (the owner's rule of 17-10-2026): a box left empty or set to 0 is
 * 0 days, so that leave is refused until an allowance is typed. Nothing is assumed.
 */

import type { LeaveType, Nurse } from '../../types';

type Kind = Pick<LeaveType, 'id' | 'name' | 'acronym' | 'creditedHours'>;

/** Whether a kind of leave has an allowance: not sick leave, not RO or DO, not a 0 hour kind. */
export function takesAllowance(lt: Kind): boolean {
  const acronym = (lt.acronym || '').toUpperCase();
  if (lt.id === 'leave-sl' || acronym === 'SL' || (lt.name || '').toLowerCase().includes('sick')) return false;
  if (acronym === 'RO' || acronym === 'DO') return false;
  return lt.creditedHours !== 0;
}

/** The nurse's allowance in days (0 when none is set), or null for a kind without a limit. */
export function allowanceFor(nurse: Pick<Nurse, 'leaveQuotas'> | null | undefined, lt: Kind): number | null {
  if (!takesAllowance(lt)) return null;
  const raw = nurse?.leaveQuotas?.[lt.id];
  return typeof raw === 'number' && raw >= 0 ? raw : 0;
}
