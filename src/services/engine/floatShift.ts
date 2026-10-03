/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Float shifts: a nurse on duty who is not with a doctor and not running a clinic
 * job (Nurse Clinic, blood collection). The roster shows them as "Float".
 */

import { Assignment } from '../../types';

/** The job id the engine gives a float shift (there is no clinical role record for it). */
export const FLOAT_ROLE_ID = 'role-float';

/**
 * True for a float shift. Rosters filled before floats were labelled this way
 * put a department (specialty) on them instead; a shift with a department and
 * no doctor counts as a float too.
 */
export function isFloatShift(
  a: Pick<Assignment, 'doctorId' | 'clinicalRoleId' | 'specialtyId'> & { kind?: Assignment['kind'] }
): boolean {
  if (a.doctorId) return false;
  if (a.clinicalRoleId) return a.clinicalRoleId === FLOAT_ROLE_ID;
  return a.kind === 'SPECIALTY' || !!a.specialtyId;
}
