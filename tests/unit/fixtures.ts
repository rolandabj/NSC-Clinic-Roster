/**
 * Small, fixed test data for the scheduling engine, validator and hours reports.
 */
import type {
  DutyWindow,
  LeaveEntry,
  LeaveType,
  LockEntry,
  Nurse,
  Rule,
  Schedule,
  SeniorityLevel,
} from '../../src/types';

export const DAY_DUTY: DutyWindow = {
  id: 'duty-d',
  name: 'Day',
  acronym: 'D',
  startTime: '09:00',
  endTime: '17:00',
  color: '#4f46e5',
  active: true,
};

export const SENIOR: SeniorityLevel = { id: 'sen', name: 'Senior Nurse', rank: 1, isSenior: true, color: '#000000' };

export function makeNurse(id: string, overrides: Partial<Nurse> = {}): Nurse {
  return {
    id,
    fullName: `Nurse ${id}`,
    gmail: `${id}@example.com`,
    employeeCode: id.toUpperCase(),
    seniorityLevelId: SENIOR.id,
    contractPercent: 100,
    dateOfBirth: '1990-01-01',
    capabilityIds: [],
    isClinicNurse: true,
    preferences: [],
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

export function makeSchedule(overrides: Partial<Schedule> = {}): Schedule {
  return {
    id: 'sched-1',
    name: 'Test week',
    startDate: '2026-10-05',
    endDate: '2026-10-11',
    blockWeeks: 1,
    hoursTargetFullTime: 40,
    status: 'DRAFT',
    activeVersionNumber: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  } as Schedule;
}

export const ANNUAL_LEAVE: LeaveType = {
  id: 'lt-al',
  name: 'Annual Leave',
  acronym: 'AL',
  color: '#10b981',
  creditedHours: 8,
  countsTowardHoursTarget: true,
  active: true,
} as LeaveType;

export const UNPAID_LEAVE: LeaveType = {
  id: 'lt-unpaid',
  name: 'Unpaid Leave',
  acronym: 'UL',
  color: '#999999',
  creditedHours: 8,
  countsTowardHoursTarget: false,
  active: true,
} as LeaveType;

export function makeLeave(overrides: Partial<LeaveEntry>): LeaveEntry {
  return {
    id: 'leave-1',
    nurseId: 'n1',
    leaveTypeId: ANNUAL_LEAVE.id,
    startDate: '2026-10-05',
    endDate: '2026-10-05',
    approved: true,
    status: 'APPROVED',
    hoursCredited: 8,
    ...overrides,
  };
}

export function makeLock(nurseId: string, date: string, overrides: Partial<LockEntry> = {}): LockEntry {
  return {
    id: `lock-${nurseId}-${date}`,
    nurseId,
    date,
    mode: 'ASSIGNMENT',
    dutyWindowId: DAY_DUTY.id,
    assignmentKind: 'CLINICAL_ROLE',
    targetRefId: 'role-float',
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

/** Rules that keep the engine focused on hours (no nurse clinic or +1 coverage demand). */
export function hoursOnlyRules(): Rule[] {
  return [
    {
      id: 'rule-nurse-clinic',
      name: 'Dedicated Nurse Clinic',
      templateKey: 'DEDICATED_NURSE_CLINIC',
      enabled: false,
      severity: 'SOFT',
      value: 0,
    } as unknown as Rule,
    {
      id: 'rule-nurse-plus-one',
      name: 'Additional nurse above doctors',
      templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS',
      enabled: false,
      severity: 'SOFT',
      value: 0,
    } as unknown as Rule,
  ];
}
