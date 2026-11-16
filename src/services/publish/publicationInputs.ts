import type { Assignment, ClinicalRole, Doctor, DoctorSession, DutyWindow, LeaveEntry, LeaveType, LockEntry,
  Nurse, Rule, Schedule, SeniorityLevel, Specialty, WorkingHoursPeriod } from '../../types';
import type { IRepository } from '../repository/IRepository';
import { doctorCoverageFingerprint, resolveClinicSetup, type ClinicSetup } from '../engine/clinicModel';
import { loadClinicSetup } from '../engine/clinicSetupService';

export interface PublicationInputs {
  schedule: Schedule; assignments: Assignment[]; nurses: Nurse[]; seniorityLevels: SeniorityLevel[];
  dutyWindows: DutyWindow[]; sessions: DoctorSession[]; leaveEntries: LeaveEntry[]; locks: LockEntry[];
  roles: ClinicalRole[]; rules: Rule[]; workingHoursPeriods: WorkingHoursPeriod[];
  specialties: Specialty[]; doctors: Doctor[]; leaveTypes: LeaveType[];
  /** The clinic and availability context used by the checked preview. */
  clinicSetup: ClinicSetup;
}
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key, v]) => v !== undefined && !['createdAt', 'updatedAt', 'allocationReview'].includes(key))
    .sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => [key, canonical(v)]));
  return value;
}
function content(input: PublicationInputs) {
  const { schedule: s, clinicSetup: setup, ...lists } = input;
  const clinic = resolveClinicSetup(setup);
  const inRoster = (date?: string) => !!date && date >= s.startDate && date <= s.endDate;
  const boundaryDates = [s.startDate, s.endDate, ...clinic.priorAssignments.map(a => a.date), ...clinic.followingAssignments.map(a => a.date)].sort();
  const boundaryStart = boundaryDates[0], boundaryEnd = boundaryDates[boundaryDates.length - 1];
  const timed = (a: Assignment) => a.doctorCoverage === undefined ? a : { ...a, doctorCoverage: doctorCoverageFingerprint(a) };
  const timedLock = (lock: LockEntry) => lock.doctorCoverage === undefined ? lock : { ...lock,
    doctorCoverage: doctorCoverageFingerprint({ kind: lock.assignmentKind, doctorId: lock.targetRefId,
      secondDoctorId: lock.secondTargetRefId, doctorCoverage: lock.doctorCoverage }),
  };
  return canonical({ ...lists,
    clinicSetup: { openTime: clinic.openTime, closeTime: clinic.closeTime,
      holidayDates: [...clinic.holidays].filter(inRoster),
      priorAssignments: clinic.priorAssignments.map(timed), followingAssignments: clinic.followingAssignments.map(timed),
      availabilityRequests: (setup.availabilityRequests || []).filter(r => inRoster(r.date) || inRoster(r.holidayDate)),
    },
    schedule: { id: s.id, name: s.name, startDate: s.startDate, endDate: s.endDate,
      hoursTargetFullTime: s.hoursTargetFullTime, workingHoursPeriodId: s.workingHoursPeriodId },
    assignments: input.assignments.filter(a => a.scheduleId === s.id).map(timed),
    nurses: input.nurses.filter(n => n.active),
    doctors: input.doctors.filter(d => d.active),
    sessions: input.sessions.filter(x => x.date >= s.startDate && x.date <= s.endDate),
    leaveEntries: input.leaveEntries.filter(x => x.startDate <= boundaryEnd && x.endDate >= boundaryStart),
    locks: input.locks.filter(x => x.date >= s.startDate && x.date <= s.endDate).map(timedLock),
  });
}

/** Recheck authoritative inputs before any publication or review writes. Never publish a stale preview. */
export async function assertPublicationCurrent(repo: IRepository, expected: PublicationInputs): Promise<ClinicSetup> {
  const [schedule, assignments, nurses, seniorityLevels, dutyWindows, sessions, leaveEntries, locks, roles, rules,
    workingHoursPeriods, specialties, doctors, leaveTypes, clinicSetup] = await Promise.all([
    repo.get('schedules', expected.schedule.id), repo.list('assignments', { field: 'scheduleId', operator: '==', value: expected.schedule.id }),
    repo.list('nurses'), repo.list('seniorityLevels'), repo.list('dutyWindows'), repo.list('doctorSessions'),
    repo.list('leaveEntries'), repo.list('locks'), repo.list('clinicalRoles'), repo.list('rules'),
    repo.list('workingHoursPeriods'), repo.list('specialties'), repo.list('doctors'), repo.list('leaveTypes'),
    loadClinicSetup(repo, expected.schedule, { withYearToDate: false }),
  ]);
  if (!schedule || JSON.stringify(content(expected)) !== JSON.stringify(content({ schedule, assignments, nurses,
    seniorityLevels, dutyWindows, sessions, leaveEntries, locks, roles, rules, workingHoursPeriods, specialties, doctors, leaveTypes, clinicSetup }))) {
    throw new Error('The roster or clinic details changed. Close this dialog and reload the page to review the latest roster before publishing.');
  }
  return clinicSetup;
}
