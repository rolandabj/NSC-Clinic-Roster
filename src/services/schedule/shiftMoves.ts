/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Moving shifts between nurses (a swap, a fairness move). A moved shift always
 * gets a new id: generated ids name the nurse and the day
 * (asgn-gen-{roster}-{nurse}-{date}-...), so a shift that kept its id after
 * moving to Mary could meet a new shift the next fill makes for Amy on that day
 * with the same id, and only one of the two would be saved.
 */

import { v4 as uuidv4 } from 'uuid';
import { Assignment } from '../../types';

export const newMovedShiftId = (): string => `asgn-moved-${uuidv4()}`;

/** The shift as another nurse's, under a new id (other fields as given). */
export function moveShift(
  shift: Assignment,
  toNurseId: string,
  fields: Partial<Assignment> = {},
  newId: () => string = newMovedShiftId
): Assignment {
  return { ...shift, ...fields, nurseId: toNurseId, id: newId() };
}

/**
 * Swaps two shifts between their nurses: shiftA goes to shiftB's nurse and the
 * other way round, both as hand changes with their notes. The old records are
 * gone from the list, so saving it deletes them.
 */
export function swapShifts(
  assignments: Assignment[],
  shiftA: Assignment,
  shiftB: Assignment,
  notes: { a: string; b: string },
  newId: () => string = newMovedShiftId
): Assignment[] {
  return assignments.map((x) => {
    if (x.id === shiftA.id) return moveShift(x, shiftB.nurseId, { source: 'MANUAL', note: notes.a }, newId);
    if (x.id === shiftB.id) return moveShift(x, shiftA.nurseId, { source: 'MANUAL', note: notes.b }, newId);
    return x;
  });
}
