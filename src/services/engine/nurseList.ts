/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Strict allocation (rule H8), as the roster check reads it, shared with the hand
 * checks (swaps and fairness moves): a nurse with doctors or specialties in their list
 * works only with those doctors, or with doctors of those specialties. A doctor's
 * specialties are those of their profile (a session's own specialty counts only for a
 * doctor without a profile). A nurse with an empty list works with anyone.
 */

import type { Assignment, Doctor, DoctorSession, Nurse, Specialty } from '../../types';

export interface OutsideList {
  kind: 'DOCTOR' | 'SPECIALTY';
  /** The doctor's name, or the specialty as "Name (CODE)". */
  name: string;
  /** For a doctor: the name of their specialty ("Department" when unknown). */
  specialtyName: string;
}

/** True when the nurse's specialty entry names one of these specialties (by id, code or name). */
function namesSpecialty(ref: string, specialtyIds: string[], specialties: Specialty[]): boolean {
  if (specialtyIds.includes(ref)) return true;
  const refLower = ref.toLowerCase();
  return specialtyIds.some((sid) => {
    const sp = specialties.find((s) => s.id === sid);
    if (!sp) return false;
    const code = sp.code.toLowerCase();
    return (
      refLower === code ||
      refLower === sp.name.toLowerCase() ||
      (code === 'pcc' && refLower.includes('pcc')) ||
      (code === 'ped' && (refLower.includes('ped') || refLower.includes('pedia')))
    );
  });
}

/** What makes this cell break the nurse's list (null when it fits, or the nurse has no list). */
export function outsideNurseList(
  nurse: Pick<Nurse, 'preferences'>,
  cell: Pick<Assignment, 'kind' | 'doctorId' | 'specialtyId' | 'date'>,
  refs: { doctors: Doctor[]; specialties: Specialty[]; sessions: DoctorSession[] }
): OutsideList | null {
  const prefs = nurse.preferences || [];
  if (!prefs.some((p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY')) return null;
  const specialtyRefs = prefs.filter((p) => p.kind === 'SPECIALTY').map((p) => p.refId);

  if (cell.kind === 'DOCTOR' && cell.doctorId) {
    const doctor = refs.doctors.find((d) => d.id === cell.doctorId);
    const session = refs.sessions.find((s) => s.doctorId === cell.doctorId && s.date === cell.date && !s.cancelled);
    const sessionSpecialty = session?.specialtyId || doctor?.specialtyIds?.[0];
    const specialtyIds = doctor?.specialtyIds || (sessionSpecialty ? [sessionSpecialty] : []);
    if (prefs.some((p) => p.kind === 'DOCTOR' && p.refId === cell.doctorId)) return null;
    if (specialtyRefs.some((ref) => namesSpecialty(ref, specialtyIds, refs.specialties))) return null;
    return {
      kind: 'DOCTOR',
      name: doctor ? doctor.fullName : 'Doctor',
      specialtyName: refs.specialties.find((s) => specialtyIds.includes(s.id))?.name || 'Department',
    };
  }
  if (cell.kind === 'SPECIALTY' && cell.specialtyId) {
    if (specialtyRefs.some((ref) => namesSpecialty(ref, [cell.specialtyId!], refs.specialties))) return null;
    const specialty = refs.specialties.find((s) => s.id === cell.specialtyId);
    return { kind: 'SPECIALTY', name: specialty ? `${specialty.name} (${specialty.code})` : 'Specialty', specialtyName: specialty?.name || 'Specialty' };
  }
  return null;
}
