import type { Assignment, Doctor, DoctorSession } from '../../types';
import { doctorCoverageProblems, simultaneousDoctorIntervals, type TimeRange } from './clinicModel';

/** Concurrent two doctor cover requires low acuity; explicit sequential cover does not. */
export function doctorPairingProblems(cell: Pick<Assignment, 'kind' | 'doctorId' | 'secondDoctorId' | 'doctorCoverage'> & Partial<Pick<Assignment, 'date'>>,
  doctors: Doctor[], timing?: { duty?: TimeRange; sessions?: readonly DoctorSession[] }): string[] {
  if (cell.doctorCoverage !== undefined) {
    const problems = doctorCoverageProblems(cell, timing?.duty, timing?.sessions);
    if (problems.length) return problems;
    if (!simultaneousDoctorIntervals(cell, timing?.duty, timing?.sessions).length) return [];
  }
  if (!cell.secondDoctorId) return [];
  if (cell.kind !== 'DOCTOR' || !cell.doctorId) return ['Choose a doctor shift and a first doctor before adding a second doctor.'];
  if (cell.secondDoctorId === cell.doctorId) return ['A shift cannot name the same doctor twice.'];
  return [cell.doctorId, cell.secondDoctorId].flatMap(id => {
    const doctor = doctors.find(d => d.id === id);
    return doctor?.lowAcuity ? [] : [`${doctor?.fullName || 'The selected doctor'} is not marked as low acuity. Give this doctor separate nurse cover.`];
  });
}
