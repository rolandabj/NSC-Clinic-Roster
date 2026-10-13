import type { AvailabilityRequest, Assignment, LeaveEntry, LockEntry, Nurse, PublicHoliday } from '../../types';
import type { ValidationFinding } from '../../services/validation/ScheduleValidator';
import { pendingLeaveOn, requestOn } from '../../services/engine/explainCell';
import { isWeekendDay } from '../../utils/weekend';
import { cellSummary, cellViewOf, type CellLookups } from '../workbook/grid/cellView';
import { isDayProblem } from '../workbook/grid/dayProblems';

/**
 * The roster on a phone (UI overhaul Phase 4, slice 5): a read only view of one day at a time.
 * A phone is a screen under 700 px wide or under 500 px high, so a phone held either way; a
 * tablet edits the roster, held upright or sideways (the owner's decision of 13-10-2026; the
 * smallest iPad is 744 px wide held upright).
 */
export function isPhoneSize(width: number, height: number): boolean {
  return width < 700 || height < 500;
}

/** The same rule as a media query, for `matchMedia`. */
export const PHONE_QUERY = '(max-width: 699.98px), (max-height: 499.98px)';

/** The day shown first: the day a link names, else today, else the roster's first day. */
export function firstDayShown(dates: readonly string[], today: string, linked?: string): string {
  if (linked && dates.includes(linked)) return linked;
  if (dates.includes(today)) return today;
  return dates[0];
}

export interface DayRow {
  nurseId: string;
  name: string;
  /** What the nurse has that day, in a few words ("Lee #1 09:00 to 17:00, Day shift", "No shift"). */
  summary: string;
  /** The kind of the worst problem on the nurse's day. */
  problemKind: 'none' | 'must' | 'check';
  /** The shift's or the leave's colour, for the card's edge ('' for none). */
  color: string;
}

export interface DayProblem {
  id: string;
  kind: 'must' | 'check' | 'note';
  message: string;
}

const KIND: Record<ValidationFinding['severity'], DayProblem['kind']> = { ERROR: 'must', WARN: 'check', INFO: 'note' };
const ORDER: Record<DayProblem['kind'], number> = { must: 0, check: 1, note: 2 };

/** One day of the roster for the phone: each nurse's day in words, and the day's problems (Must fix first). */
export function dayViewOf(
  date: string,
  data: {
    nurses: Nurse[];
    assignments: Assignment[];
    leaveEntries: LeaveEntry[];
    locks: LockEntry[];
    availabilityRequests?: AvailabilityRequest[];
    holidays: PublicHoliday[];
    lookups: CellLookups;
    findings: ValidationFinding[];
    today: string;
  }
): { rows: DayRow[]; problems: DayProblem[] } {
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  const day = {
    dateStr: date,
    isWeekend: isWeekendDay(weekday),
    holiday: data.holidays.find((h) => h.date === date),
    isToday: date === data.today,
  };
  const onDay = data.findings.filter((f) => f.date === date || f.cellRefs.some((r) => r.date === date));
  const rows = data.nurses.map((nurse) => {
    const leave = data.leaveEntries.find((l) => l.nurseId === nurse.id && l.approved && date >= l.startDate && date <= l.endDate);
    // As in the grid: a nurse's card shows the problems about their shift, not those about the whole day.
    const cellFindings = onDay.filter((f) => f.severity !== 'INFO' && !isDayProblem(f) && f.cellRefs.some((r) => r.nurseId === nurse.id && r.date === date));
    const view = cellViewOf(
      {
        nurse,
        day,
        assignment: data.assignments.find((a) => a.nurseId === nurse.id && a.date === date),
        lock: data.locks.find((l) => l.nurseId === nurse.id && l.date === date),
        leave,
        pendingLeave: leave ? undefined : pendingLeaveOn(data.leaveEntries, nurse.id, date),
        request: requestOn(data.availabilityRequests, nurse.id, date),
        problems: cellFindings.map((f) => f.message),
        problemsMustFix: cellFindings.some((f) => f.severity === 'ERROR'),
      },
      data.lookups
    );
    return { nurseId: nurse.id, name: nurse.fullName, summary: cellSummary(view), problemKind: view.problemKind, color: view.color };
  });
  const problems = onDay
    .map((f) => ({ id: f.id, kind: KIND[f.severity], message: f.message }))
    .sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);
  return { rows, problems };
}
