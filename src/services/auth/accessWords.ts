/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings, Access and permissions in plain words (Phase 8, slice 1e): each role and status, and
 * what a person with an email can do in the app.
 */

import { UserAccessRecord, UserAccessRole, UserAccessStatus } from '../../types';
import type { UserPrivileges } from './authService';

export const roleWords = (role: UserAccessRole): string => (role === 'EDITOR' ? 'Change rosters, staff and settings' : 'Look only');

export const accessStatusWord = (status: UserAccessStatus): string =>
  status === 'APPROVED' ? 'Has access' : status === 'PENDING' ? 'Waiting for approval' : 'Access removed';

export function accessWords(record: UserAccessRecord | undefined, isOwner: boolean): string {
  if (isOwner) return 'Owner: can do everything, including access and backups.';
  if (!record) return 'No account. This person can sign in, but must wait for your approval before seeing anything.';
  if (record.status === 'PENDING') return 'Waiting for your approval. They can’t see anything yet.';
  if (record.status === 'REVOKED') return 'Access removed. They can’t see anything.';
  const role = record.appRole === 'EDITOR' ? 'Can look at and change rosters, staff and settings' : 'Can look at rosters';
  return `${role}${record.isManager ? ', and can approve requests for leave, days off and shifts' : ''}.`;
}

/** What the signed in person can do, for the "Your access" dialog (Checkpoint 8). */
export function youCanDo(p: UserPrivileges): { words: string; allowed: boolean }[] {
  return [
    { words: 'Change rosters, staff and settings', allowed: p.canEditRosterAssignments },
    { words: 'Fill rosters automatically', allowed: p.canRunSolver },
    { words: 'Publish rosters', allowed: p.canPublishSchedules },
    { words: 'Approve leave and days off', allowed: p.canApproveLeave },
    { words: 'Approve shift swaps', allowed: p.canApproveSwaps },
    { words: 'Download reports', allowed: p.canExportReports },
    { words: 'Give people access and restore backups', allowed: p.canManageStaff },
  ];
}
