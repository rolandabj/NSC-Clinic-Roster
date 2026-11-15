import type { Assignment, ClinicalRole, Doctor, DoctorSession, DutyWindow, LeaveEntry, LeaveType, LockEntry,
  Nurse, Rule, Schedule, SeniorityLevel, Specialty, WorkingHoursPeriod } from '../../types';
import type { IRepository } from '../repository/IRepository';

export interface PublicationInputs {
  schedule: Schedule; assignments: Assignment[]; nurses: Nurse[]; seniorityLevels: SeniorityLevel[];
  dutyWindows: DutyWindow[]; sessions: DoctorSession[]; leaveEntries: LeaveEntry[]; locks: LockEntry[];
  roles: ClinicalRole[]; rules: Rule[]; workingHoursPeriods: WorkingHoursPeriod[];
  specialties: Specialty[]; doctors: Doctor[]; leaveTypes: LeaveType[];
}
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key, v]) => v !== undefined && !['createdAt', 'updatedAt', 'allocationReview'].includes(key))
    .sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => [key, canonical(v)]));
  return value;
}
function content(input: PublicationInputs) {
  const { schedule: s } = input;
  return canonical({ ...input,
    schedule: { id: s.id, name: s.name, startDate: s.startDate, endDate: s.endDate,
      hoursTargetFullTime: s.hoursTargetFullTime, workingHoursPeriodId: s.workingHoursPeriodId },
    assignments: input.assignments.filter(a => a.scheduleId === s.id),
    nurses: input.nurses.filter(n => n.active),
    doctors: input.doctors.filter(d => d.active),
    sessions: input.sessions.filter(x => x.date >= s.startDate && x.date <= s.endDate),
    leaveEntries: input.leaveEntries.filter(x => x.startDate <= s.endDate && x.endDate >= s.startDate),
    locks: input.locks.filter(x => x.date >= s.startDate && x.date <= s.endDate),
  });
}

/** Recheck authoritative inputs before any publication or review writes. Never publish a stale preview. */
export async function assertPublicationCurrent(repo: IRepository, expected: PublicationInputs): Promise<void> {
  const [schedule, assignments, nurses, seniorityLevels, dutyWindows, sessions, leaveEntries, locks, roles, rules,
    workingHoursPeriods, specialties, doctors, leaveTypes] = await Promise.all([
    repo.get('schedules', expected.schedule.id), repo.list('assignments', { field: 'scheduleId', operator: '==', value: expected.schedule.id }),
    repo.list('nurses'), repo.list('seniorityLevels'), repo.list('dutyWindows'), repo.list('doctorSessions'),
    repo.list('leaveEntries'), repo.list('locks'), repo.list('clinicalRoles'), repo.list('rules'),
    repo.list('workingHoursPeriods'), repo.list('specialties'), repo.list('doctors'), repo.list('leaveTypes'),
  ]);
  if (!schedule || JSON.stringify(content(expected)) !== JSON.stringify(content({ schedule, assignments, nurses,
    seniorityLevels, dutyWindows, sessions, leaveEntries, locks, roles, rules, workingHoursPeriods, specialties, doctors, leaveTypes }))) {
    throw new Error('The roster or clinic details changed. Close this dialog and reload the page to review the latest roster before publishing.');
  }
}
