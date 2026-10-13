import { startTransition, useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import type {
  Assignment,
  AvailabilityRequest,
  ClinicalRole,
  Doctor,
  DoctorSession,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  LockEntry,
  Nurse,
  Rule,
  Schedule,
  SeniorityLevel,
  Specialty,
  WorkingHoursPeriod,
} from '../../types';
import type { ClinicSetup } from '../../services/engine/clinicModel';
import type { HoursHistory } from '../../services/hours/hoursBalance';
import { ScheduleValidator, ValidationReport } from '../../services/validation/ScheduleValidator';
import { afterNextFrame, createCheckScheduler } from '../../services/validation/checkScheduler';

/** Everything the roster check reads besides the roster, its shifts and the clinic setup. */
export interface CheckInputs {
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
}

const EMPTY_REPORT: ValidationReport = {
  scheduleId: '',
  timestamp: '',
  errorCount: 0,
  warnCount: 0,
  infoCount: 0,
  findings: [],
  hourlyCoverageMap: {},
};

/**
 * The roster screen's check: the problem report, and the requests that bring it up to date.
 *
 * The check is kept out of the way: a request (`runValidation`) waits until the screen has
 * drawn (`afterNextFrame`), requests made meanwhile run it once with the newest list, and its
 * result is drawn as a transition, which a key press can interrupt. Opening a full size roster
 * asked for it four times in a row (about 60 ms each). What the check reads: the screen's
 * lists as last drawn (`inputs`), plus lists set since then and not drawn yet (a request
 * passes them as `overrides`).
 */
export function useRosterChecks(o: {
  /** The screen's lists as drawn now. */
  inputs: CheckInputs;
  activeSchedule: Schedule | null;
  availabilityRequests: AvailabilityRequest[];
  /** Only to give `checkRoster` a new identity when the hours history changes. */
  hoursHistory: HoursHistory | undefined;
  clinicSetupRef: MutableRefObject<ClinicSetup | undefined>;
  availabilityRequestsRef: MutableRefObject<AvailabilityRequest[]>;
  /**
   * True for the roster that is open now. A request for another roster (an edit's delayed
   * check, or a check after an await, when another roster was opened meanwhile) is dropped:
   * it would show that roster's problems on this one, and replace this one's own check.
   */
  isOpen: (scheduleId: string) => boolean;
}) {
  const { inputs, activeSchedule, availabilityRequests, hoursHistory, clinicSetupRef, availabilityRequestsRef, isOpen } = o;
  const [validationReport, setValidationReport] = useState<ValidationReport>(EMPTY_REPORT);
  const checkInputsRef = useRef<CheckInputs>(inputs);
  checkInputsRef.current = inputs;
  // The hours history the last check used (a history loaded again unchanged needs no check).
  const lastCheckedHistoryRef = useRef<HoursHistory | undefined>(undefined);
  const [checks] = useState(() =>
    createCheckScheduler<{ sched: Schedule; list: Assignment[] }>({
      later: afterNextFrame,
      run: ({ sched, list }) => {
        const x = checkInputsRef.current;
        lastCheckedHistoryRef.current = clinicSetupRef.current?.hoursHistory;
        const report = ScheduleValidator.validate(
          sched,
          list,
          x.nurses,
          x.seniorityLevels,
          x.dutyWindows,
          x.sessions,
          x.leaveEntries,
          x.locks,
          x.roles,
          x.rules,
          x.workingHoursPeriods,
          x.specialties,
          x.doctors,
          x.leaveTypes,
          clinicSetupRef.current,
          availabilityRequestsRef.current
        );
        startTransition(() => setValidationReport(report));
      },
    })
  );
  useEffect(() => () => checks.cancel(), [checks]);

  const runValidation = (sched: Schedule, list: Assignment[], overrides: Partial<CheckInputs> = {}) => {
    if (!isOpen(sched.id)) return;
    checkInputsRef.current = { ...checkInputsRef.current, ...overrides };
    checks.request({ sched, list });
  };

  /**
   * The roster check on another list of shifts, with everything else as now: the swap
   * and fairness dialogs compare it with the roster as it is, so a move they allow
   * never leaves a new Must fix. A new function only when what the check reads changes
   * (the clinic setup changes with the hours history).
   */
  const x = inputs;
  const checkRoster = useCallback(
    (list: Assignment[]) =>
      activeSchedule
        ? ScheduleValidator.validate(
            activeSchedule,
            list,
            x.nurses,
            x.seniorityLevels,
            x.dutyWindows,
            x.sessions,
            x.leaveEntries,
            x.locks,
            x.roles,
            x.rules,
            x.workingHoursPeriods,
            x.specialties,
            x.doctors,
            x.leaveTypes,
            clinicSetupRef.current,
            availabilityRequests
          ).findings
        : [],
    [activeSchedule, x.nurses, x.seniorityLevels, x.dutyWindows, x.sessions, x.leaveEntries, x.locks, x.roles, x.rules, x.workingHoursPeriods, x.specialties, x.doctors, x.leaveTypes, availabilityRequests, hoursHistory]
  );

  return { validationReport, setValidationReport, checks, runValidation, checkRoster, lastCheckedHistoryRef };
}
