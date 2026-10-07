/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Staff Self Service Requests (leave and availability) and Manager Approvals.
 * Everything is stored in Firestore. The Firestore security rules decide who
 * may do what: staff linked to a nurse profile file and cancel their own
 * PENDING requests; managers and editors approve or reject them.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  AvailabilityRequest,
  LeaveEntry,
  LeaveType,
  LockEntry,
  Nurse,
} from '../../types';
import { getRepository } from '../repository';
import { withHolidaysAtZero } from '../hours/holidayLeave';
import { UserProfile } from '../auth/authService';
import { canApproveRequests } from '../auth/access';

const DAY_MS = 1000 * 60 * 60 * 24;

function daysInclusive(startDate: string, endDate: string): number {
  const s = new Date(startDate).getTime();
  const e = new Date(endDate).getTime();
  return Math.max(1, Math.round((e - s) / DAY_MS) + 1);
}

function isPendingLeave(l: LeaveEntry): boolean {
  return l.status === 'PENDING' || (l.status === undefined && l.approved === false);
}

export interface PendingLeaveItem extends LeaveEntry {
  nurseName: string;
  nurseEmail: string;
  nurseCode: string;
  leaveTypeName: string;
  leaveTypeColor: string;
}

export interface PendingAvailabilityItem extends AvailabilityRequest {
  nurseName: string;
  nurseEmail: string;
  nurseCode: string;
}

/**
 * Leave and availability requests of the signed in staff member.
 * The owner (who is not linked to a nurse) sees everyone's requests.
 */
export async function listMyRequests(
  user: UserProfile | null | undefined
): Promise<{ leaves: LeaveEntry[]; availability: AvailabilityRequest[] }> {
  const repo = getRepository();
  const nurseId = user?.linkedNurseId;

  if (!nurseId) {
    if (user?.role === 'OWNER') {
      const [leaves, availability] = await Promise.all([
        repo.list('leaveEntries'),
        repo.list('availabilityRequests'),
      ]);
      return { leaves, availability };
    }
    return { leaves: [], availability: [] };
  }

  const [leaves, availability] = await Promise.all([
    repo.list('leaveEntries', { field: 'nurseId', operator: '==', value: nurseId }),
    repo.list('availabilityRequests', { field: 'nurseId', operator: '==', value: nurseId }),
  ]);
  return { leaves, availability };
}

function requireNurseId(user: UserProfile | null | undefined): string {
  const nurseId = user?.linkedNurseId;
  if (!nurseId) {
    throw new Error(
      'Your account is not linked to a nurse profile yet. Ask the clinic administrator to link it in Access Management.'
    );
  }
  return nurseId;
}

/**
 * Files a PENDING leave request for the signed in nurse, after checking the
 * annual leave quota for that leave type.
 */
export async function submitLeaveRequest(
  user: UserProfile | null | undefined,
  input: { leaveTypeId: string; startDate: string; endDate: string; note?: string }
): Promise<LeaveEntry> {
  const nurseId = requireNurseId(user);
  const { leaveTypeId, startDate, endDate, note } = input;

  if (!leaveTypeId || !startDate || !endDate) {
    throw new Error('Leave type, start date, and end date are required.');
  }
  if (endDate < startDate) {
    throw new Error('The end date must be on or after the start date.');
  }

  const repo = getRepository();
  const [leaveTypes, nurse, existing, holidays] = await Promise.all([
    repo.list('leaveTypes') as Promise<LeaveType[]>,
    repo.get('nurses', nurseId) as Promise<Nurse | null>,
    repo.list('leaveEntries', { field: 'nurseId', operator: '==', value: nurseId }) as Promise<LeaveEntry[]>,
    // Public holidays inside the leave count 0 h (the period hours already leave them out).
    repo.list('holidays').catch(() => []),
  ]);

  const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);
  const requestedDays = daysInclusive(startDate, endDate);
  const hoursPerDay = typeof leaveType?.creditedHours === 'number' ? leaveType.creditedHours : 8;

  // Annual quota (stored in days; large multiples of 8 are legacy hour values)
  const rawQuota = nurse?.leaveQuotas?.[leaveTypeId];
  if (typeof rawQuota === 'number' && rawQuota > 0) {
    const quotaDays = rawQuota > 40 && rawQuota % 8 === 0 ? rawQuota / 8 : rawQuota;
    const year = startDate.slice(0, 4);
    const usedDays = existing
      .filter(
        (le) =>
          le.leaveTypeId === leaveTypeId &&
          le.startDate.startsWith(`${year}-`) &&
          le.status !== 'REJECTED'
      )
      .reduce((sum, le) => sum + daysInclusive(le.startDate, le.endDate), 0);

    if (usedDays + requestedDays > quotaDays) {
      throw new Error(
        `Leave quota exceeded: ${usedDays} of ${quotaDays} ${leaveType?.name || 'leave'} days for ${year} are already requested or scheduled. ` +
          `Requesting ${requestedDays} more day(s) exceeds the annual limit by ${usedDays + requestedDays - quotaDays} day(s).`
      );
    }
  }

  const now = new Date().toISOString();
  const entry: LeaveEntry = {
    id: `leave-req-${uuidv4()}`,
    nurseId,
    leaveTypeId,
    startDate,
    endDate,
    note: note || undefined,
    approved: false,
    status: 'PENDING',
    hoursCredited: requestedDays * hoursPerDay,
    submittedByNurseId: nurseId,
    submittedAt: now,
  };
  return repo.create('leaveEntries', withHolidaysAtZero(entry, holidays));
}

/**
 * Files a PENDING availability request (preferred duty or requested day off).
 */
export async function submitAvailabilityRequest(
  user: UserProfile | null | undefined,
  input: { date: string; available: boolean; preferredDutyWindowId?: string; note?: string }
): Promise<AvailabilityRequest> {
  const nurseId = requireNurseId(user);
  if (!input.date) throw new Error('Date is required.');

  const request: AvailabilityRequest = {
    id: `avail-req-${uuidv4()}`,
    nurseId,
    date: input.date,
    available: Boolean(input.available),
    preferredDutyWindowId: input.preferredDutyWindowId || undefined,
    note: input.note || undefined,
    status: 'PENDING',
    submittedByNurseId: nurseId,
    submittedAt: new Date().toISOString(),
  };
  return getRepository().create('availabilityRequests', request);
}

export async function cancelLeaveRequest(id: string): Promise<void> {
  await getRepository().remove('leaveEntries', id);
}

export async function cancelAvailabilityRequest(id: string): Promise<void> {
  await getRepository().remove('availabilityRequests', id);
}

/**
 * Pending leave and availability requests across all nurses (managers).
 */
export async function listPendingApprovals(): Promise<{
  leaveRequests: PendingLeaveItem[];
  availabilityRequests: PendingAvailabilityItem[];
}> {
  const repo = getRepository();
  const [leaves, availability, nurses, leaveTypes] = await Promise.all([
    repo.list('leaveEntries'),
    repo.list('availabilityRequests', { field: 'status', operator: '==', value: 'PENDING' }),
    repo.list('nurses'),
    repo.list('leaveTypes'),
  ]);

  const nurseMap = new Map(nurses.map((n) => [n.id, n]));
  const leaveTypeMap = new Map(leaveTypes.map((lt) => [lt.id, lt]));

  return {
    leaveRequests: leaves.filter(isPendingLeave).map((l) => {
      const nurse = nurseMap.get(l.nurseId);
      const leaveType = leaveTypeMap.get(l.leaveTypeId);
      return {
        ...l,
        nurseName: nurse?.fullName || 'Unknown Nurse',
        nurseEmail: nurse?.gmail || '',
        nurseCode: nurse?.employeeCode || '',
        leaveTypeName: leaveType?.name || 'Leave',
        leaveTypeColor: leaveType?.color || '#3b82f6',
      };
    }),
    availabilityRequests: availability.map((a) => {
      const nurse = nurseMap.get(a.nurseId);
      return {
        ...a,
        nurseName: nurse?.fullName || 'Unknown Nurse',
        nurseEmail: nurse?.gmail || '',
        nurseCode: nurse?.employeeCode || '',
      };
    }),
  };
}

export async function countPendingApprovals(): Promise<number> {
  const { leaveRequests, availabilityRequests } = await listPendingApprovals();
  return leaveRequests.length + availabilityRequests.length;
}

/**
 * Approves or rejects a request. An approved day off also creates an OFF
 * lock; rejecting a previously approved day off removes that lock again.
 */
export async function decideRequest(
  reviewer: UserProfile | null | undefined,
  kind: 'LEAVE' | 'AVAILABILITY',
  requestId: string,
  decision: 'APPROVED' | 'REJECTED',
  notes?: string
): Promise<void> {
  // Same people as canApprove() in firestore.rules: the owner, editors and managers
  if (!canApproveRequests(reviewer)) {
    throw new Error('Approvals are restricted to planners, clinical managers and the clinic administrator.');
  }

  const repo = getRepository();
  const reviewerId = reviewer!.uid;
  const reviewerName = reviewer!.name || reviewer!.email;
  const now = new Date().toISOString();

  if (kind === 'LEAVE') {
    const existing = await repo.get('leaveEntries', requestId);
    if (!existing) throw new Error('Leave request not found.');

    await repo.update('leaveEntries', requestId, {
      approved: decision === 'APPROVED',
      status: decision,
      reviewedByUserId: reviewerId,
      reviewedByUserName: reviewerName,
      reviewedAt: now,
      reviewNotes: notes || existing.reviewNotes,
    });

    await repo.create('audit', {
      id: `audit-${uuidv4()}`,
      actor: reviewerName,
      action: 'UPDATE',
      entity: 'LeaveEntry',
      entityId: requestId,
      note: `Leave request for nurse ${existing.nurseId} (${existing.startDate} to ${existing.endDate}) was ${decision} by ${reviewerName}`,
      timestamp: now,
    });
    return;
  }

  const existing = await repo.get('availabilityRequests', requestId);
  if (!existing) throw new Error('Availability request not found.');

  await repo.update('availabilityRequests', requestId, {
    status: decision,
    reviewedByUserId: reviewerId,
    reviewedByUserName: reviewerName,
    reviewedAt: now,
    reviewNotes: notes || existing.reviewNotes,
  });

  await syncDayOffLock(existing, existing.available === false && decision === 'APPROVED');

  await repo.create('audit', {
    id: `audit-${uuidv4()}`,
    actor: reviewerName,
    action: 'UPDATE',
    entity: 'AvailabilityRequest',
    entityId: requestId,
    note: `Availability request for nurse ${existing.nurseId} on ${existing.date} was ${decision} by ${reviewerName}`,
    timestamp: now,
  });
}

/** The pinned day off that goes with an approved day off request. */
const dayOffLockId = (r: Pick<AvailabilityRequest, 'nurseId' | 'date'>) => `lock-off-${r.nurseId}-${r.date}`;

/**
 * Keeps the pinned day off in step with a day off request: `wanted` adds it (and
 * removes a pinned shift that day, since an approved day off wins), otherwise the
 * day off pin made for the request is removed.
 */
async function syncDayOffLock(request: Pick<AvailabilityRequest, 'nurseId' | 'date' | 'note'>, wanted: boolean): Promise<void> {
  const repo = getRepository();
  if (!wanted) {
    const lock = await repo.get('locks', dayOffLockId(request));
    if (lock) await repo.remove('locks', lock.id);
    return;
  }
  const locks = (await repo.list('locks', { field: 'nurseId', operator: '==', value: request.nurseId })) as LockEntry[];
  const sameDay = locks.filter((l) => l.date === request.date);
  for (const l of sameDay.filter((l) => l.mode !== 'OFF')) await repo.remove('locks', l.id);
  if (!sameDay.some((l) => l.mode === 'OFF')) {
    await repo.create('locks', {
      id: dayOffLockId(request),
      nurseId: request.nurseId,
      date: request.date,
      mode: 'OFF',
      note: `Approved day off request: ${request.note || 'Rest day'}`,
      createdAt: new Date().toISOString(),
    });
  }
}

/**
 * Records the day off a nurse takes for working a public holiday (owner's decision of
 * 2026-10-06): an approved day off request linked to the holiday, with its pinned day
 * off. A day off already linked to the holiday moves to the new date; a day off request
 * she already made for that date is linked and approved instead of adding a second one.
 */
export async function recordHolidayDayOff(
  reviewer: UserProfile | null | undefined,
  input: { nurseId: string; holidayDate: string; holidayName?: string; date: string }
): Promise<AvailabilityRequest> {
  if (!canApproveRequests(reviewer)) throw new Error('Only planners and managers can record a day off.');
  const { nurseId, holidayDate, date } = input;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Choose the day off.');
  if (date === holidayDate) throw new Error('The day off must be another day than the public holiday.');
  const repo = getRepository();
  const now = new Date().toISOString();
  const reviewed = { reviewedByUserId: reviewer!.uid, reviewedByUserName: reviewer!.name || reviewer!.email, reviewedAt: now };
  const note = `Day off for the public holiday${input.holidayName ? ` ${input.holidayName}` : ''} (${holidayDate})`;
  const hers = (await repo.list('availabilityRequests', { field: 'nurseId', operator: '==', value: nurseId })) as AvailabilityRequest[];
  const live = hers.filter((r) => !r.available && r.status !== 'REJECTED');
  const linked = live.find((r) => r.holidayDate === holidayDate);
  const sameDay = live.find((r) => r.date === date);

  let saved: AvailabilityRequest;
  if (linked) {
    // Moving it: the old day loses its pin, the new day gets one.
    if (linked.status === 'APPROVED' && linked.date !== date) await syncDayOffLock(linked, false);
    saved = { ...linked, date, status: 'APPROVED', ...reviewed };
    await repo.update('availabilityRequests', linked.id, { date, status: 'APPROVED', ...reviewed });
  } else if (sameDay) {
    saved = { ...sameDay, holidayDate, status: 'APPROVED', note: sameDay.note || note, ...reviewed };
    await repo.update('availabilityRequests', sameDay.id, { holidayDate, status: 'APPROVED', note: saved.note, ...reviewed });
  } else {
    saved = {
      id: `avail-req-${uuidv4()}`,
      nurseId,
      date,
      available: false,
      note,
      holidayDate,
      status: 'APPROVED',
      submittedByNurseId: nurseId,
      submittedAt: now,
      ...reviewed,
    };
    await repo.create('availabilityRequests', saved);
  }
  await syncDayOffLock(saved, true);
  await repo.create('audit', {
    id: `audit-${uuidv4()}`,
    actor: reviewed.reviewedByUserName,
    action: 'UPDATE',
    entity: 'AvailabilityRequest',
    entityId: saved.id,
    note: `Day off on ${date} recorded for nurse ${nurseId} for working the public holiday on ${holidayDate}.`,
    timestamp: now,
  });
  return saved;
}

/** Every day off and shift request of every nurse, newest date first (for planners and managers). */
export async function listAllAvailabilityRequests(): Promise<AvailabilityRequest[]> {
  const list = await getRepository().list('availabilityRequests');
  return [...list].sort((a, b) => b.date.localeCompare(a.date) || (b.submittedAt || '').localeCompare(a.submittedAt || ''));
}

/**
 * Changes a request after it was filed or decided: the date, a day off or a shift, the
 * shift asked for, the note. Its decision stays; an approved day off moves its pin with it.
 */
export async function updateAvailabilityRequest(
  reviewer: UserProfile | null | undefined,
  requestId: string,
  changes: { date?: string; available?: boolean; preferredDutyWindowId?: string | null; note?: string }
): Promise<AvailabilityRequest> {
  if (!canApproveRequests(reviewer)) throw new Error('Only planners and managers can change requests.');
  const repo = getRepository();
  const existing = await repo.get('availabilityRequests', requestId);
  if (!existing) throw new Error('Request not found.');
  const next: AvailabilityRequest = {
    ...existing,
    date: changes.date || existing.date,
    available: changes.available ?? existing.available,
    preferredDutyWindowId:
      (changes.available ?? existing.available)
        ? changes.preferredDutyWindowId === undefined
          ? existing.preferredDutyWindowId
          : changes.preferredDutyWindowId || undefined
        : undefined,
    note: changes.note === undefined ? existing.note : changes.note || undefined,
  };
  const wasApprovedOff = existing.status === 'APPROVED' && existing.available === false;
  const isApprovedOff = next.status === 'APPROVED' && next.available === false;
  if (wasApprovedOff && (!isApprovedOff || next.date !== existing.date)) await syncDayOffLock(existing, false);
  await repo.update('availabilityRequests', requestId, {
    date: next.date,
    available: next.available,
    preferredDutyWindowId: next.preferredDutyWindowId ?? null,
    note: next.note ?? null,
  } as any);
  if (isApprovedOff) await syncDayOffLock(next, true);
  await repo.create('audit', {
    id: `audit-${uuidv4()}`,
    actor: reviewer!.name || reviewer!.email,
    action: 'UPDATE',
    entity: 'AvailabilityRequest',
    entityId: requestId,
    before: existing,
    after: next,
    note: `Request for nurse ${existing.nurseId} changed (${existing.date} to ${next.date}).`,
    timestamp: new Date().toISOString(),
  });
  return next;
}

/** Deletes a request whatever its decision; an approved day off also loses its pin. */
export async function deleteAvailabilityRequest(reviewer: UserProfile | null | undefined, requestId: string): Promise<void> {
  if (!canApproveRequests(reviewer)) throw new Error('Only planners and managers can delete requests.');
  const repo = getRepository();
  const existing = await repo.get('availabilityRequests', requestId);
  if (!existing) return;
  if (existing.available === false && existing.status === 'APPROVED') await syncDayOffLock(existing, false);
  await repo.remove('availabilityRequests', requestId);
  await repo.create('audit', {
    id: `audit-${uuidv4()}`,
    actor: reviewer!.name || reviewer!.email,
    action: 'DELETE',
    entity: 'AvailabilityRequest',
    entityId: requestId,
    before: existing,
    note: `Request for nurse ${existing.nurseId} on ${existing.date} deleted.`,
    timestamp: new Date().toISOString(),
  });
}

/** Puts a decided request back to waiting for a decision (an approved day off loses its pin). */
export async function reopenAvailabilityRequest(reviewer: UserProfile | null | undefined, requestId: string): Promise<void> {
  if (!canApproveRequests(reviewer)) throw new Error('Only planners and managers can change requests.');
  const repo = getRepository();
  const existing = await repo.get('availabilityRequests', requestId);
  if (!existing) throw new Error('Request not found.');
  if (existing.available === false && existing.status === 'APPROVED') await syncDayOffLock(existing, false);
  await repo.update('availabilityRequests', requestId, { status: 'PENDING' });
  await repo.create('audit', {
    id: `audit-${uuidv4()}`,
    actor: reviewer!.name || reviewer!.email,
    action: 'UPDATE',
    entity: 'AvailabilityRequest',
    entityId: requestId,
    note: `Request for nurse ${existing.nurseId} on ${existing.date} put back to waiting for a decision.`,
    timestamp: new Date().toISOString(),
  });
}
