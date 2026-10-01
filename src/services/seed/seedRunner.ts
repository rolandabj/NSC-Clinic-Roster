/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Database start up checks, default working hours periods, wiping, statistics
 * and full backup export and import.
 */

import { IRepository } from '../repository/IRepository';
import { SEED_WORKING_HOURS_PERIODS } from './seedData';
import { CollectionName } from '../../types';
import { removePublicRoster } from '../publish/publicRosterService';

export const ALL_COLLECTIONS: CollectionName[] = [
  'clinics',
  'dutyWindows',
  'leaveTypes',
  'seniorityLevels',
  'clinicalRoles',
  'specialties',
  'nurses',
  'doctors',
  'doctorSessions',
  'leaveEntries',
  'locks',
  'rules',
  'schedules',
  'assignments',
  'versions',
  'shareLinks',
  'invitations',
  'emailLog',
  'acknowledgments',
  'holidays',
  'quotas',
  'audit',
  'templates',
  'swaps',
  'userAccess',
  'availabilityRequests',
  'systemMetadata',
  'workingHoursPeriods',
];

/**
 * Checks whether the client database has been explicitly marked as CLEARED
 */
export async function isClientDatabaseCleared(repo: IRepository): Promise<boolean> {
  try {
    if (typeof window !== 'undefined' && localStorage.getItem('clinic_roster_database_cleared') === 'true') {
      return true;
    }
    const meta = await repo.get('systemMetadata', 'initialization_state');
    if (meta?.status === 'CLEARED') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('clinic_roster_database_cleared', 'true');
      }
      return true;
    }
    return false;
  } catch {
    return typeof window !== 'undefined' && localStorage.getItem('clinic_roster_database_cleared') === 'true';
  }
}

export const isDatabaseMarkedCleared = isClientDatabaseCleared;

/**
 * Initialize database if empty: Never auto-seed demo data in production
 */
export async function initializeDatabaseIfEmpty(repo: IRepository): Promise<boolean> {
  // Demo data auto-seed permanently disabled to preserve clean production state
  return false;
}

/**
 * Ensures that the standard Dedicated Working Hours Periods are seeded if empty
 */
export async function ensureWorkingHoursPeriodsDefaults(repo: IRepository): Promise<void> {
  try {
    const isCleared = await isClientDatabaseCleared(repo);
    if (isCleared) return;

    const existing = await repo.list('workingHoursPeriods');
    if (existing.length === 0) {
      await repo.bulkUpsert('workingHoursPeriods', SEED_WORKING_HOURS_PERIODS);
      console.info('[ClinicRoster] Seeded 12 standard dedicated working hours periods (2025-2026).');
    }
  } catch (err) {
    console.warn('[ClinicRoster] ensureWorkingHoursPeriodsDefaults warning:', err);
  }
}

/** Collections a restore never touches: who may sign in, and the history of changes. */
const RESTORE_SKIPS: CollectionName[] = ['userAccess', 'audit'];

export interface ClearResult {
  /** Collections that could not be emptied (the rest were). */
  failed: string[];
}

/**
 * Wipe all clinic data. The user access list is always kept, so approved staff
 * keep their accounts; `keepAudit` also keeps the history of changes.
 */
export async function clearDatabase(repo: IRepository, options?: { keepAudit?: boolean }): Promise<ClearResult> {
  console.info('[ClinicRoster] Initiating database wipe...');
  const failed: string[] = [];

  // 1. Public roster snapshots cannot be listed (by design), so remove them
  //    through the share links that point to them.
  try {
    const links = await repo.list('shareLinks');
    for (const link of links) {
      if (link.token) await removePublicRoster(link.token);
    }
  } catch (e) {
    console.warn('[ClinicRoster] Could not remove public roster snapshots:', e);
    failed.push('public roster links');
  }

  // 2. Wipe the clinic data collections.
  for (const col of ALL_COLLECTIONS) {
    if (col === 'systemMetadata' || col === 'userAccess') continue;
    if (col === 'audit' && options?.keepAudit) continue;
    try {
      await repo.clearCollection(col);
    } catch (e) {
      console.warn(`[ClinicRoster] Could not clear collection ${col}:`, e);
      failed.push(col);
    }
  }

  // 3. Record that the database was cleared.
  await writeInitializationState(repo, 'CLEARED', 'All clinic records cleared by the owner');

  // 4. Set the local flag and drop cached clinic details.
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('clinic_roster_database_cleared', 'true');
      localStorage.removeItem('clinic_roster_clinic_name');
      localStorage.removeItem('clinic_roster_clinic_timezone');
      localStorage.removeItem('clinic_roster_active_schedule_id');
    } catch {
      // ignore
    }
  }

  return { failed };
}

async function writeInitializationState(repo: IRepository, status: 'CLEARED' | 'RESTORED', note: string): Promise<void> {
  try {
    const now = new Date().toISOString();
    const fields = { status, clearedAt: now, clearedBy: 'Owner', note };
    const existing = await repo.get('systemMetadata', 'initialization_state');
    if (existing) {
      await repo.update('systemMetadata', 'initialization_state', fields);
    } else {
      await repo.create('systemMetadata', { id: 'initialization_state', ...fields });
    }
  } catch (err) {
    console.warn('[ClinicRoster] Could not record the database state:', err);
  }
}

/**
 * Full Database Statistics
 */
export interface DatabaseStats {
  nursesCount: number;
  doctorsCount: number;
  sessionsCount: number;
  schedulesCount: number;
  assignmentsCount: number;
  leaveEntriesCount: number;
  locksCount: number;
  rulesCount: number;
  holidaysCount: number;
  versionsCount: number;
  templatesCount: number;
  swapsCount: number;
  auditCount: number;
  workingHoursPeriodsCount?: number;
  lastUpdated: string;
}

export async function getDatabaseStatistics(repo: IRepository): Promise<DatabaseStats> {
  const [
    nurses,
    doctors,
    sessions,
    schedules,
    assignments,
    leaveEntries,
    locks,
    rules,
    holidays,
    versions,
    templates,
    swaps,
    audit,
    periods,
  ] = await Promise.all([
    repo.list('nurses'),
    repo.list('doctors'),
    repo.list('doctorSessions'),
    repo.list('schedules'),
    repo.list('assignments'),
    repo.list('leaveEntries'),
    repo.list('locks'),
    repo.list('rules'),
    repo.list('holidays'),
    repo.list('versions'),
    repo.list('templates'),
    repo.list('swaps'),
    repo.list('audit'),
    repo.list('workingHoursPeriods'),
  ]);

  return {
    nursesCount: nurses.length,
    doctorsCount: doctors.length,
    sessionsCount: sessions.length,
    schedulesCount: schedules.length,
    assignmentsCount: assignments.length,
    leaveEntriesCount: leaveEntries.length,
    locksCount: locks.length,
    rulesCount: rules.length,
    holidaysCount: holidays.length,
    versionsCount: versions.length,
    templatesCount: templates.length,
    swapsCount: swaps.length,
    auditCount: audit.length,
    workingHoursPeriodsCount: periods.length,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Full database backup as JSON. Fails (naming the collections) rather than
 * leaving parts out, so a backup taken before a wipe is never silently incomplete.
 */
export async function exportFullDatabaseBackup(repo: IRepository): Promise<string> {
  const exportPayload: Record<string, any[]> = {};
  const failed: string[] = [];

  for (const col of ALL_COLLECTIONS) {
    try {
      exportPayload[col] = await repo.list(col);
    } catch {
      failed.push(col);
    }
  }
  if (failed.length > 0) {
    throw new Error(`Could not read ${failed.join(', ')}.`);
  }

  const backupEnvelope = {
    app: 'ClinicRoster',
    version: '1.0.0',
    phase: 15,
    exportedAt: new Date().toISOString(),
    collections: exportPayload,
  };

  return JSON.stringify(backupEnvelope, null, 2);
}

/** Saves a full backup to the user's downloads. Throws if the backup can't be made. */
export async function downloadFullDatabaseBackup(repo: IRepository, label = 'full_backup'): Promise<void> {
  const json = await exportFullDatabaseBackup(repo);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const link = document.createElement('a');
  link.href = url;
  link.download = `clinic_roster_${label}_${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface BackupCheck {
  ok: boolean;
  /** Why the file can't be used (when not ok). */
  error?: string;
  exportedAt?: string;
  /** Records the restore would write, per collection. */
  counts: Record<string, number>;
  total: number;
  /** Collections in the file that a restore leaves alone (user access, history). */
  skipped: string[];
}

/** Checks a backup file without changing anything. */
export function checkBackup(jsonString: string): BackupCheck {
  const fail = (error: string): BackupCheck => ({ ok: false, error, counts: {}, total: 0, skipped: [] });
  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return fail('This is not a valid JSON file.');
  }
  if (!parsed || typeof parsed !== 'object' || parsed.app !== 'ClinicRoster') {
    return fail('This file is not a Clinic Roster backup.');
  }
  const collections = parsed.collections;
  if (!collections || typeof collections !== 'object' || Array.isArray(collections)) {
    return fail('The backup has no data in it.');
  }

  const counts: Record<string, number> = {};
  const skipped: string[] = [];
  let total = 0;
  for (const [name, records] of Object.entries(collections)) {
    if (!(ALL_COLLECTIONS as string[]).includes(name)) continue;
    if (!Array.isArray(records)) return fail(`"${name}" in the backup is not a list of records.`);
    const bad = records.findIndex((r: any) => !r || typeof r !== 'object' || typeof r.id !== 'string' || !r.id.trim() || r.id.includes('/'));
    if (bad >= 0) return fail(`Record ${bad + 1} in "${name}" has no valid id.`);
    if ((RESTORE_SKIPS as string[]).includes(name)) {
      if (records.length > 0) skipped.push(name);
      continue;
    }
    counts[name] = records.length;
    total += records.length;
  }
  if (total === 0) return fail('The backup is empty, so restoring it would only delete data.');

  return {
    ok: true,
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : undefined,
    counts,
    total,
    skipped,
  };
}

/**
 * Restores a backup: checks the file first (nothing is deleted if it fails),
 * then replaces the clinic data. The user access list and the history of
 * changes are kept as they are and never taken from the file.
 */
export async function importFullDatabaseBackup(
  repo: IRepository,
  jsonString: string
): Promise<{ success: boolean; message: string; recordCounts?: Record<string, number> }> {
  const check = checkBackup(jsonString);
  if (!check.ok) return { success: false, message: check.error || 'The backup file could not be read.' };

  const collections = JSON.parse(jsonString).collections as Record<string, any[]>;
  const cleared = await clearDatabase(repo, { keepAudit: true });

  const failed = [...cleared.failed];
  const counts: Record<string, number> = {};
  for (const col of ALL_COLLECTIONS) {
    if (RESTORE_SKIPS.includes(col)) continue;
    const records = collections[col];
    if (!Array.isArray(records) || records.length === 0) continue;
    try {
      const keep = col === 'systemMetadata' ? records.filter((r) => r.id !== 'initialization_state') : records;
      await repo.bulkUpsert(col, keep as any);
      counts[col] = keep.length;
    } catch (e) {
      console.warn(`[ClinicRoster] Could not restore ${col}:`, e);
      failed.push(col);
    }
  }

  await writeInitializationState(repo, 'RESTORED', `Restored from a backup made ${check.exportedAt || 'earlier'}`);
  try {
    localStorage.removeItem('clinic_roster_database_cleared');
  } catch {
    // ignore
  }

  if (failed.length > 0) {
    return {
      success: false,
      message: `The restore was only partly done. These could not be restored: ${failed.join(', ')}. Your automatic backup was downloaded before the restore, so you can try again.`,
      recordCounts: counts,
    };
  }
  return { success: true, message: 'The backup was restored.', recordCounts: counts };
}
