import type { Assignment, AvailabilityRequest, ClinicalRole, Doctor, DoctorSession, LeaveEntry, LockEntry, Nurse, Specialty } from '../../types';
import { assignmentDoctorIds } from './clinicModel';
import { hasAllocationReview } from './allocationReview';
import { isAgreedException, isLastResortShift } from './lastResort';
import { outsideNurseList } from './nurseList';
import { isExclusiveNurseClinic } from './nurseClinicUtils';

export interface AvailabilityContext {
  leaveEntries: readonly LeaveEntry[];
  locks?: readonly LockEntry[];
  availabilityRequests?: readonly AvailabilityRequest[];
}
export interface DoctorCoverageContext extends AvailabilityContext {
  nurses: readonly Nurse[];
  roles: ClinicalRole[];
  doctors: Doctor[];
  specialties: Specialty[];
  sessions: DoctorSession[];
}

/** A saved shift does not make an absent or inactive nurse available for cover. */
export function nurseIsAvailable(nurse: Nurse | undefined, date: string, ctx: AvailabilityContext): boolean {
  return !!nurse?.active &&
    !ctx.leaveEntries.some(le => le.nurseId === nurse.id && le.approved && le.startDate <= date && le.endDate >= date) &&
    !(ctx.locks || []).some(lock => lock.nurseId === nurse.id && lock.date === date && lock.mode === 'OFF') &&
    !(ctx.availabilityRequests || []).some(r => r.nurseId === nurse.id && r.date === date && !r.available && r.status === 'APPROVED');
}

/** Check one named doctor, or all the shift's doctors when no id is supplied. */
export function assignmentCanCoverDoctor(a: Assignment, ctx: DoctorCoverageContext, doctorId?: string): boolean {
  const nurse = ctx.nurses.find(n => n.id === a.nurseId);
  if (!nurseIsAvailable(nurse, a.date, ctx) || !nurse?.isClinicNurse || isExclusiveNurseClinic(nurse, ctx.roles)) return false;
  const ids = assignmentDoctorIds(a);
  if (!ids.length || (doctorId && !ids.includes(doctorId))) return false;
  return (doctorId ? [doctorId] : ids).every(id => {
    const outside = outsideNurseList(nurse, { ...a, doctorId: id, secondDoctorId: undefined }, ctx);
    if (!outside) return true;
    // Legacy allocation exceptions remain reviewable. They cannot grant clinical permission.
    return !outside.eligibility && (isLastResortShift(a) || isAgreedException(a) || hasAllocationReview(a));
  });
}
