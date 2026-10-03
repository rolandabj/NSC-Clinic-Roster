/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Last resort pairing: when none of the nurses who list a doctor (or his
 * specialty) can work with him that day, the engine gives him a nurse from
 * outside her list rather than leaving him alone. The shift carries this note,
 * so the checker reports it as "Check" instead of "Must fix".
 */

import { Assignment } from '../../types';

export const LAST_RESORT_NOTE = 'Last resort: none of the nurses who list this doctor was free';

export function isLastResortShift(a: Pick<Assignment, 'note'>): boolean {
  return !!a.note && a.note.startsWith(LAST_RESORT_NOTE);
}
