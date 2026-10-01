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
import { UserProfile } from '../auth/authService';

const DAY_MS = 1000 * 60 * 60 * 24;

function daysInclusive(startDate: string, endDate: string): number {
  const s = new Date(startDate).getTime();
  const e = new Date(endDate).getTime();
  return Math.max(1, Math.round((e - s) / DAY_MS) + 1);
}

export function isManagerOrOwner(user?: UserProfile | null): boolean {
  return !!user && (user.role === 'OWNER' || user.isManager === true);
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
  const [leaveTypes, nurse, existing] = await Promise.all([
    repo.list('leaveTypes') as Promise<LeaveType[]>,
    repo.get('nurses', nurseId) as Promise<Nurse | null>,
    repo.list('leaveEntries', { field: 'nurseId', operator: '==', value: nurseId }) as Promise<LeaveEntry[]>,
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
  return repo.create('leaveEntries', entry);
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
  if (!isManagerOrOwner(reviewer)) {
    throw new Error('Approvals are restricted to clinical managers and the clinic administrator.');
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

  if (existing.available === false) {
    const lockId = `lock-off-${existing.nurseId}-${existing.date}`;
    if (decision === 'APPROVED') {
      const locks = (await repo.list('locks', {
        field: 'nurseId',
        operator: '==',
        value: existing.nurseId,
      })) as LockEntry[];
      const sameDay = locks.filter((l) => l.date === existing.date);
      // An approved day off wins over a pinned shift on the same day.
      for (const l of sameDay.filter((l) => l.mode !== 'OFF')) {
        await repo.remove('locks', l.id);
      }
      if (!sameDay.some((l) => l.mode === 'OFF')) {
        await repo.create('locks', {
          id: lockId,
          nurseId: existing.nurseId,
          date: existing.date,
          mode: 'OFF',
          note: `Approved day off request: ${existing.note || 'Rest day'}`,
          createdAt: now,
        });
      }
    } else {
      const lock = await repo.get('locks', lockId);
      if (lock) await repo.remove('locks', lockId);
    }
  }

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
