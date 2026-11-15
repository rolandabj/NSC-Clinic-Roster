import type { Assignment, Doctor } from '../../types';

/** A second doctor is allowed only when both distinct doctors have low acuity profiles. */
export function doctorPairingProblems(cell: Pick<Assignment, 'kind' | 'doctorId' | 'secondDoctorId'>, doctors: Doctor[]): string[] {
  if (!cell.secondDoctorId) return [];
  if (cell.kind !== 'DOCTOR' || !cell.doctorId) return ['Choose a doctor shift and a first doctor before adding a second doctor.'];
  if (cell.secondDoctorId === cell.doctorId) return ['A shift cannot name the same doctor twice.'];
  return [cell.doctorId, cell.secondDoctorId].flatMap(id => {
    const doctor = doctors.find(d => d.id === id);
    return doctor?.lowAcuity ? [] : [`${doctor?.fullName || 'The selected doctor'} is not marked as low acuity. Give this doctor separate nurse cover.`];
  });
}
