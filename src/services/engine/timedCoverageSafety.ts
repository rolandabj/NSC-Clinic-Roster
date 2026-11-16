import type { LockEntry } from '../../types';
import { doctorCoverageFingerprint } from './clinicModel';

/** Do not overwrite a pin that changed while its editor was open. */
export function assertTimedPinCurrent(saved: LockEntry | null, expected: LockEntry | undefined): void {
  const identity = (pin: LockEntry) => JSON.stringify([pin.id, pin.nurseId, pin.date, pin.mode, pin.dutyWindowId,
    pin.assignmentKind, pin.targetRefId, pin.secondTargetRefId || '', pin.note || '',
    doctorCoverageFingerprint({ kind: pin.assignmentKind, doctorId: pin.targetRefId,
      secondDoctorId: pin.secondTargetRefId, doctorCoverage: pin.doctorCoverage })]);
  if (!saved || !expected || identity(saved) !== identity(expected)) {
    throw new Error('This pin has changed. Close this dialog and open the pin again.');
  }
}
