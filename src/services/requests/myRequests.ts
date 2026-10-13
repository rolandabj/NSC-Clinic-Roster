import type { AvailabilityRequest, DutyWindow, LeaveEntry, LeaveType } from '../../types';
import { formatDate } from '../../utils/dateUtils';

/**
 * A nurse's own requests (UI overhaul Phase 5, slice 2): one list of leave, days off and wanted
 * shifts, each with a clear status and the reviewer's note, and the checks made before a new
 * request is sent.
 */

export type RequestStatus = 'Waiting' | 'Approved' | 'Declined';

export interface MyRequest {
  id: string;
  kind: 'leave' | 'day';
  /** "Annual Leave", "Day off", "Day shift wanted". */
  what: string;
  /** "18-11-2026", or "20-11-2026 to 22-11-2026". */
  when: string;
  /** The first and last day, for sorting and for upcoming or past. */
  from: string;
  to: string;
  status: RequestStatus;
  /** The nurse's own note. */
  note?: string;
  reviewer?: string;
  reviewNote?: string;
  /** Only a request still waiting can be withdrawn (see firestore.rules). */
  canCancel: boolean;
}

export function leaveStatus(l: Pick<LeaveEntry, 'status' | 'approved'>): RequestStatus {
  if (l.status === 'REJECTED') return 'Declined';
  if (l.status === 'APPROVED' || l.approved) return 'Approved';
  return 'Waiting';
}

export function dayStatus(a: Pick<AvailabilityRequest, 'status'>): RequestStatus {
  return a.status === 'APPROVED' ? 'Approved' : a.status === 'REJECTED' ? 'Declined' : 'Waiting';
}

const range = (from: string, to: string) => (from === to ? formatDate(from) : `${formatDate(from)} to ${formatDate(to)}`);

/** The nurse's requests by date: those still to come (or under way) and those already past. */
export function myRequestList(
  leaves: LeaveEntry[],
  days: AvailabilityRequest[],
  today: string,
  leaveTypes: LeaveType[],
  dutyWindows: DutyWindow[]
): { upcoming: MyRequest[]; past: MyRequest[] } {
  const items: MyRequest[] = [
    ...leaves.map((l) => ({
      id: l.id,
      kind: 'leave' as const,
      what: leaveTypes.find((t) => t.id === l.leaveTypeId)?.name || 'Leave',
      when: range(l.startDate, l.endDate),
      from: l.startDate,
      to: l.endDate,
      status: leaveStatus(l),
      note: l.note,
      reviewer: l.reviewedByUserName,
      reviewNote: l.reviewNotes,
      canCancel: l.status === 'PENDING',
    })),
    ...days.map((a) => ({
      id: a.id,
      kind: 'day' as const,
      what: a.available
        ? `${dutyWindows.find((d) => d.id === a.preferredDutyWindowId)?.name || 'A'} shift wanted`
        : 'Day off',
      when: formatDate(a.date),
      from: a.date,
      to: a.date,
      status: dayStatus(a),
      note: a.note,
      reviewer: a.reviewedByUserName,
      reviewNote: a.reviewNotes,
      canCancel: a.status === 'PENDING',
    })),
  ].sort((a, b) => a.from.localeCompare(b.from) || a.what.localeCompare(b.what));
  return { upcoming: items.filter((r) => r.to >= today), past: items.filter((r) => r.to < today).reverse() };
}

type Errors<K extends string> = Partial<Record<K, string>>;

/** Checks before a leave request is sent; an empty object means it can go. */
export function checkLeaveRequest(
  r: { startDate: string; endDate: string },
  today: string,
  existing: LeaveEntry[]
): Errors<'startDate' | 'endDate'> {
  const errors: Errors<'startDate' | 'endDate'> = {};
  if (!r.startDate) errors.startDate = 'Enter the first day, like 18-11-2026.';
  if (!r.endDate) errors.endDate = 'Enter the last day, like 18-11-2026.';
  if (!r.startDate || !r.endDate) return errors;
  if (r.endDate < r.startDate) return { endDate: 'The last day is before the first day.' };
  if (r.startDate < today) return { startDate: 'The first day has passed. Choose today or a later day.' };
  const clash = existing.find((l) => leaveStatus(l) !== 'Declined' && l.startDate <= r.endDate && l.endDate >= r.startDate);
  if (clash) return { startDate: `You already asked for leave from ${formatDate(clash.startDate)} to ${formatDate(clash.endDate)}.` };
  return errors;
}

/** Checks before a day off or a wanted shift is sent. */
export function checkDayRequest(r: { date: string }, today: string, existing: AvailabilityRequest[]): Errors<'date'> {
  if (!r.date) return { date: 'Enter the day, like 18-11-2026.' };
  if (r.date < today) return { date: 'This day has passed. Choose today or a later day.' };
  if (existing.some((a) => a.date === r.date && dayStatus(a) !== 'Declined')) {
    return { date: `You already asked about ${formatDate(r.date)}. Cancel that request first to change it.` };
  }
  return {};
}
