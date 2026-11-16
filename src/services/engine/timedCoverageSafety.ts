import type { Assignment, LockEntry, Schedule } from '../../types';
import type { RegenerateMode } from './types';
import { doctorCoverageFingerprint } from './clinicModel';

/** Timed records are readable before the automatic timed allocation writers are enabled. */
export function assertTimedFillSupported(schedule: Pick<Schedule, 'id' | 'startDate' | 'endDate'>,
  mode: RegenerateMode, assignments: readonly Assignment[], locks: readonly LockEntry[]): void {
  if (mode === 'CLEAR_GENERATED') return;
  const inRange = (date: string) => date >= schedule.startDate && date <= schedule.endDate;
  if (assignments.some(a => a.scheduleId === schedule.id && inRange(a.date) && a.doctorCoverage !== undefined) ||
    locks.some(l => inRange(l.date) && l.doctorCoverage !== undefined)) {
    throw new Error('This roster has timed doctor cover. Clear or unpin those duties before filling.');
  }
}

/** Notes and pins may change without dropping a timed duty's existing doctor intervals. */
export function preserveTimedDoctorCoverage(previous: Assignment | undefined, next: Assignment): Assignment {
  if (previous?.doctorCoverage === undefined) return next;
  if (previous.nurseId !== next.nurseId || previous.date !== next.date || previous.dutyWindowId !== next.dutyWindowId ||
    previous.kind !== next.kind || previous.doctorId !== next.doctorId || previous.secondDoctorId !== next.secondDoctorId) {
    throw new Error('This duty has timed doctor cover. Clear the duty before changing its shift or doctors.');
  }
  return { ...next, doctorCoverage: previous.doctorCoverage };
}

/** The separate pin editor may update only the note on an existing timed pin. */
export function timedPinNoteUpdate(previous: LockEntry, edited: Partial<LockEntry>): Pick<LockEntry, 'note'> {
  const identity = (pin: Partial<LockEntry>) => JSON.stringify([pin.nurseId, pin.date, pin.mode, pin.dutyWindowId,
    pin.assignmentKind, pin.targetRefId, pin.secondTargetRefId || '',
    doctorCoverageFingerprint({ kind: pin.assignmentKind, doctorId: pin.targetRefId,
      secondDoctorId: pin.secondTargetRefId, doctorCoverage: pin.doctorCoverage })]);
  if (identity(previous) !== identity(edited)) {
    throw new Error('This timed pin has changed. Close this dialog and open the pin again.');
  }
  return { note: edited.note };
}
