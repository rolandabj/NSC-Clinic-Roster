import type { Assignment, DoctorSession, Nurse, SeniorityLevel } from '../../../types';
import type { ValidationReport } from '../../../services/validation/ScheduleValidator';
import { doctorSessionsOn } from '../../../services/engine/clinicModel';

/** One day's totals under the grid. */
export interface DayTotal {
  /** Doctors in session. */
  doctors: number;
  /** Nurses with a shift. */
  nurses: number;
  /** Opening hours without a free nurse (unknown until the roster is checked). */
  gapHours?: number;
  /** A senior nurse on duty (unknown when no seniority level is senior). */
  hasSenior?: boolean;
}

/** The day totals for the days shown, reading the shifts once instead of once for each day. */
export function dayTotalsOf(
  dates: readonly string[],
  assignments: readonly Assignment[],
  sessions: DoctorSession[],
  nurses: readonly Nurse[],
  seniorityLevels: readonly SeniorityLevel[],
  hourlyCoverageMap: ValidationReport['hourlyCoverageMap'] | undefined
): Map<string, DayTotal> {
  const seniorIds = new Set(seniorityLevels.filter((s) => s.isSenior).map((s) => s.id));
  const levelById = new Map(nurses.map((n) => [n.id, n.seniorityLevelId]));
  const shown = new Set(dates);
  const onDutyByDate = new Map<string, Set<string>>();
  for (const a of assignments) {
    if (!shown.has(a.date)) continue;
    let set = onDutyByDate.get(a.date);
    if (!set) onDutyByDate.set(a.date, (set = new Set()));
    set.add(a.nurseId);
  }
  return new Map(
    dates.map((date) => {
      const onDuty = onDutyByDate.get(date) || new Set<string>();
      const hours = hourlyCoverageMap?.[date];
      return [
        date,
        {
          doctors: doctorSessionsOn(sessions, date).length,
          nurses: onDuty.size,
          gapHours: hours ? Object.values(hours).filter((h) => h.deficit > 0).length : undefined,
          hasSenior: seniorIds.size === 0 ? undefined : [...onDuty].some((id) => seniorIds.has(levelById.get(id) || '')),
        },
      ] as const;
    })
  );
}
