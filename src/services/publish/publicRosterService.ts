/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Public Roster Snapshots
 * A share link opens without signing in by reading ONE Firestore document,
 * publicRosters/{token}. The document holds only what the read only roster
 * page needs (no emails, dates of birth or notes). Firestore rules allow
 * reading it by its token, never listing, and honour revocation and
 * restricted email lists.
 */

import {
  ShareLink,
  Schedule,
  ScheduleVersion,
  Nurse,
  DutyWindow,
  LeaveType,
  SeniorityLevel,
  Doctor,
  ClinicalRole,
  Specialty,
} from '../../types';
import { getRepository } from '../repository';

/**
 * Bumped when the snapshot's contents change (2: only this roster's people and
 * dates, generic leave, no employee codes), so older snapshots are rebuilt.
 */
export const PUBLIC_ROSTER_FORMAT = 2;

export interface PublicRosterDoc {
  id: string;
  format?: number;
  token: string;
  scheduleId: string;
  versionId: string;
  isPublic: boolean;
  allowedEmails: string[];
  revoked: boolean;
  clinicName: string;
  timezone: string;
  updatedAt: string;
  schedule: Pick<Schedule, 'id' | 'name' | 'startDate' | 'endDate' | 'blockWeeks' | 'status'>;
  version: Pick<ScheduleVersion, 'id' | 'scheduleId' | 'number' | 'timestamp' | 'isPublished'> & {
    snapshot: { assignments: any[]; leaveEntries: any[] };
  };
  nurses: Pick<Nurse, 'id' | 'fullName' | 'seniorityLevelId' | 'active'>[];
  dutyWindows: Pick<DutyWindow, 'id' | 'name' | 'acronym' | 'startTime' | 'endTime' | 'color'>[];
  leaveTypes: Pick<LeaveType, 'id' | 'name' | 'acronym' | 'color'>[];
  seniorityLevels: Pick<SeniorityLevel, 'id' | 'name' | 'rank' | 'color'>[];
  doctors: Pick<Doctor, 'id' | 'fullName' | 'specialtyIds'>[];
  clinicalRoles: Pick<ClinicalRole, 'id' | 'name' | 'acronym'>[];
  specialties: Pick<Specialty, 'id' | 'name' | 'code'>[];
}

function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
}

/**
 * Creates or refreshes the public snapshot for a share link.
 * Revoked links have their snapshot removed.
 */
/** The one leave type a public roster shows (the real type stays private). */
const PUBLIC_LEAVE_TYPE = { id: 'leave', name: 'Leave', acronym: 'L', color: '#94a3b8' };

export async function syncPublicRoster(link: ShareLink): Promise<void> {
  const repo = getRepository();

  if (link.revoked) {
    await removePublicRoster(link.token);
    return;
  }

  const [version, schedule, nurses, dutyWindows, leaveTypes, seniorityLevels, doctors, clinicalRoles, specialties, clinics] =
    await Promise.all([
      repo.get('versions', link.pointsToVersionId),
      repo.get('schedules', link.scheduleId),
      repo.list('nurses'),
      repo.list('dutyWindows'),
      repo.list('leaveTypes'),
      repo.list('seniorityLevels'),
      repo.list('doctors'),
      repo.list('clinicalRoles'),
      repo.list('specialties'),
      repo.list('clinics'),
    ]);

  if (!version || !schedule) {
    throw new Error('The shared version or schedule no longer exists.');
  }

  // Only what this roster shows: its shifts, and approved leave clipped to its dates. Leave is
  // shown as a plain "Leave" (whether it is sick, annual or other leave stays private).
  const inRoster = (d: string) => d >= schedule.startDate && d <= schedule.endDate;
  const snapshotAssignments = (version.snapshot?.assignments || [])
    .filter((a) => inRoster(a.date))
    .map((a) => pick(a, ['id', 'nurseId', 'date', 'dutyWindowId', 'kind', 'doctorId', 'specialtyId', 'clinicalRoleId']));
  const snapshotLeave = (version.snapshot?.leaveEntries || [])
    .filter((le) => le.approved && le.endDate >= schedule.startDate && le.startDate <= schedule.endDate)
    .map((le) => ({
      id: le.id,
      nurseId: le.nurseId,
      leaveTypeId: PUBLIC_LEAVE_TYPE.id,
      startDate: le.startDate < schedule.startDate ? schedule.startDate : le.startDate,
      endDate: le.endDate > schedule.endDate ? schedule.endDate : le.endDate,
      approved: true,
    }));
  // Only the people on this roster (no employee codes or other details).
  const nurseIds = new Set([...snapshotAssignments.map((a) => a.nurseId), ...snapshotLeave.map((l) => l.nurseId)]);
  const doctorIds = new Set(snapshotAssignments.map((a) => a.doctorId).filter(Boolean) as string[]);

  const doc: PublicRosterDoc = {
    id: link.token,
    format: PUBLIC_ROSTER_FORMAT,
    token: link.token,
    scheduleId: schedule.id,
    versionId: version.id,
    isPublic: link.public === true,
    allowedEmails: link.public ? [] : (link.allowedEmails || []).map((e) => e.trim().toLowerCase()),
    revoked: false,
    clinicName: clinics[0]?.name || '',
    timezone: clinics[0]?.timezone || 'Asia/Dubai',
    updatedAt: new Date().toISOString(),
    schedule: pick(schedule, ['id', 'name', 'startDate', 'endDate', 'blockWeeks', 'status']),
    version: {
      ...pick(version, ['id', 'scheduleId', 'number', 'timestamp', 'isPublished']),
      snapshot: { assignments: snapshotAssignments, leaveEntries: snapshotLeave },
    },
    nurses: nurses.filter((n) => nurseIds.has(n.id)).map((n) => pick(n, ['id', 'fullName', 'seniorityLevelId', 'active'])),
    dutyWindows: dutyWindows.map((d) => pick(d, ['id', 'name', 'acronym', 'startTime', 'endTime', 'color'])),
    leaveTypes: [PUBLIC_LEAVE_TYPE],
    seniorityLevels: seniorityLevels.map((s) => pick(s, ['id', 'name', 'rank', 'color'])),
    doctors: doctors.filter((d) => doctorIds.has(d.id)).map((d) => pick(d, ['id', 'fullName', 'specialtyIds'])),
    clinicalRoles: clinicalRoles.map((r) => pick(r, ['id', 'name', 'acronym'])),
    specialties: specialties.map((s) => pick(s, ['id', 'name', 'code'])),
  };

  await repo.create('publicRosters', doc);
}

/**
 * Removes a link's public snapshot. It is marked revoked first, so even if the delete
 * fails the database rules already refuse to show it. Errors are passed on to the caller.
 */
export async function removePublicRoster(token: string): Promise<void> {
  const repo = getRepository();
  const existing = await repo.get('publicRosters', token).catch(() => null);
  if (existing) await repo.update('publicRosters', token, { revoked: true } as any);
  await repo.remove('publicRosters', token);
}

/**
 * Reads a public roster snapshot by its share token (works without signing in).
 * Returns null when the link does not exist, was revoked, or is restricted to
 * other email addresses.
 */
export async function loadPublicRoster(token: string): Promise<PublicRosterDoc | null> {
  try {
    return (await getRepository().get('publicRosters', token)) as unknown as PublicRosterDoc | null;
  } catch (err) {
    // Firestore rules deny the read for revoked, restricted or unknown links.
    return null;
  }
}

/**
 * Creates missing snapshots for active share links, and rebuilds ones saved in an
 * older format (which could show more than the roster page needs). Called when an
 * editor opens the share or publish screens. Failures are logged, never thrown.
 */
export async function ensurePublicRosters(links: ShareLink[]): Promise<void> {
  const repo = getRepository();
  for (const link of links) {
    if (link.revoked || !link.token || !link.pointsToVersionId) continue;
    try {
      const existing = await repo.get('publicRosters', link.token);
      if (!existing || (existing as unknown as PublicRosterDoc).format !== PUBLIC_ROSTER_FORMAT) {
        await syncPublicRoster(link);
      }
    } catch (err) {
      console.warn('[publicRosterService] Could not create snapshot for share link:', err);
    }
  }
}
