import type { Assignment, ClinicalRole, Doctor, DoctorSession, DutyWindow, LeaveEntry, LeaveType, LockEntry,
  Nurse, Rule, Schedule, SeniorityLevel, Specialty, WorkingHoursPeriod } from '../../types';
import type { IRepository } from '../repository/IRepository';
import { doctorCoverageFingerprint, resolveClinicSetup, type ClinicSetup } from '../engine/clinicModel';
import { loadClinicSetup } from '../engine/clinicSetupService';
import { loadYearToDate } from '../fairness/yearToDate';
import { lateDutyThreshold } from '../engine/SchedulingEngine';
import { DEFAULT_WEEKEND_DAYS } from '../../utils/weekend';

/** The complete immutable input shared by generation, the worker and the final save check. */
export interface GenerationInputs {
  schedule: Schedule;
  assignments: Assignment[];
  nurses: Nurse[];
  seniorityLevels: SeniorityLevel[];
  dutyWindows: DutyWindow[];
  sessions: DoctorSession[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  roles: ClinicalRole[];
  rules: Rule[];
  workingHoursPeriods: WorkingHoursPeriod[];
  specialties: Specialty[];
  doctors: Doctor[];
  leaveTypes: LeaveType[];
  clinicSetup: ClinicSetup;
  /** The clinic's server definition, passed explicitly to the detached worker. */
  weekendDays?: number[];
}

/** Detach nested intervals and context so a later edit cannot rewrite what the worker used. */
export function cloneGenerationInputs(input: GenerationInputs): GenerationInputs {
  return structuredClone({ ...input, clinicSetup: { ...input.clinicSetup,
    holidayDates: input.clinicSetup.holidayDates ? [...input.clinicSetup.holidayDates] : undefined } });
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return Array.from(value, canonical)
    .sort((a, b) => String(JSON.stringify(a)).localeCompare(String(JSON.stringify(b))));
  if (value instanceof Set) return canonical([...value]);
  if (value instanceof Map) return canonical([...value.entries()]);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key, v]) => v !== undefined && key !== 'createdAt' && key !== 'updatedAt')
    .sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => [key, canonical(v)]));
  return value;
}
function assignmentContent(a: Assignment): unknown {
  return { ...a,
    doctorId: a.doctorId || undefined, secondDoctorId: a.secondDoctorId || undefined,
    clinicalRoleId: a.clinicalRoleId || undefined, specialtyId: a.specialtyId || undefined,
    ...(a.doctorCoverage === undefined ? {} : { doctorCoverage: doctorCoverageFingerprint(a) }) };
}
function lockContent(lock: LockEntry): unknown {
  return { ...lock, targetRefId: lock.targetRefId || undefined, secondTargetRefId: lock.secondTargetRefId || undefined,
    ...(lock.doctorCoverage === undefined ? {} : { doctorCoverage: doctorCoverageFingerprint({ kind: lock.assignmentKind,
      doctorId: lock.targetRefId, secondDoctorId: lock.secondTargetRefId, doctorCoverage: lock.doctorCoverage }) }) };
}

/** Compare every generation input, including history and saved manual intent, without timestamp noise. */
export function generationInputFingerprint(input: GenerationInputs): string {
  const { schedule, clinicSetup, ...lists } = input;
  const clinic = resolveClinicSetup(clinicSetup);
  const inRoster = (date?: string) => !!date && date >= schedule.startDate && date <= schedule.endDate;
  const history = clinicSetup.hoursHistory;
  return JSON.stringify(canonical({ ...lists, schedule,
    assignments: input.assignments.filter(a => a.scheduleId === schedule.id).map(assignmentContent),
    nurses: input.nurses.filter(n => n.active), doctors: input.doctors.filter(d => d.active),
    sessions: input.sessions.filter(s => inRoster(s.date)), locks: input.locks.map(lockContent),
    clinicSetup: { ...clinicSetup, openTime: clinic.openTime, closeTime: clinic.closeTime,
      holidayDates: [...clinic.holidays],
      priorAssignments: clinic.priorAssignments.map(assignmentContent), followingAssignments: clinic.followingAssignments.map(assignmentContent),
      availabilityRequests: (clinicSetup.availabilityRequests || []).filter(r => inRoster(r.date) || inRoster(r.holidayDate)),
      ...(history ? { hoursHistory: { ...history, assignments: history.assignments.map(assignmentContent) } } : {}),
    },
  }));
}

/** A new identity also bypasses the earlier roster cache used by hours and fairness calculations. */
function freshReadRepository(repo: IRepository): IRepository {
  return Object.assign(Object.create(repo), {
    list: (repo.listFresh || repo.list).bind(repo),
    get: (repo.getFresh || repo.get).bind(repo),
  }) as IRepository;
}

/** Load the authoritative inputs. Any required read failure aborts without writing a backup or result. */
export async function loadGenerationInputs(repo: IRepository, scheduleId: string): Promise<GenerationInputs> {
  const fresh = freshReadRepository(repo);
  const schedule = await fresh.get('schedules', scheduleId);
  if (!schedule) throw new Error('The roster changed or was removed. Reload before filling.');
  const [assignments, nurses, seniorityLevels, dutyWindows, sessions, leaveEntries, locks, roles, rules,
    workingHoursPeriods, specialties, doctors, leaveTypes, clinicSetup, clinics] = await Promise.all([
    fresh.list('assignments', { field: 'scheduleId', operator: '==', value: scheduleId }),
    fresh.list('nurses'), fresh.list('seniorityLevels'), fresh.list('dutyWindows'), fresh.list('doctorSessions'),
    fresh.list('leaveEntries'), fresh.list('locks'), fresh.list('clinicalRoles'), fresh.list('rules'),
    fresh.list('workingHoursPeriods'), fresh.list('specialties'), fresh.list('doctors'), fresh.list('leaveTypes'),
    // The general loader tolerates missing fairness data for read only views. A fill
    // requires it, so load it explicitly below and propagate any server read failure.
    loadClinicSetup(fresh, schedule, { withYearToDate: false }), fresh.list('clinics'),
  ]);
  const configuredWeekend: unknown = clinics[0]?.weekendDays;
  const weekendDays = [...new Set(Array.isArray(configuredWeekend)
    ? configuredWeekend.filter((day): day is number => Number.isInteger(day) && day >= 0 && day <= 6)
    : DEFAULT_WEEKEND_DAYS)].sort((a, b) => a - b);
  clinicSetup.yearToDate = await loadYearToDate(fresh, schedule, dutyWindows, clinicSetup.holidayDates || [], {
    lateThreshold: lateDutyThreshold(rules), roles, schedules: clinicSetup.hoursHistory?.schedules, weekendDays,
  });
  return cloneGenerationInputs({ schedule, assignments, nurses: nurses.filter(n => n.active), seniorityLevels,
    dutyWindows, sessions, leaveEntries, locks, roles, rules, workingHoursPeriods, specialties,
    doctors: doctors.filter(d => d.active), leaveTypes, clinicSetup, weekendDays });
}

/** Only the final candidate may reach persistence, and only while its original inputs still match. */
export async function assertGenerationInputsCurrent(repo: IRepository, expected: GenerationInputs): Promise<GenerationInputs> {
  const fresh = await loadGenerationInputs(repo, expected.schedule.id);
  if (generationInputFingerprint(expected) !== generationInputFingerprint(fresh)) {
    throw new Error('The roster or clinic details changed during filling. Reload and fill again before saving a result.');
  }
  return fresh;
}
