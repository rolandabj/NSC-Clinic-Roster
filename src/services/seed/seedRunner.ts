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

/**
 * Wipe all collections from the repository and coordinate with backend server
 */
export async function clearDatabase(repo: IRepository): Promise<void> {
  console.info('[ClinicRoster] Initiating database wipe...');

  // 1. Public roster snapshots cannot be listed (by design), so remove them
  //    through the share links that point to them.
  try {
    const links = await repo.list('shareLinks');
    for (const link of links) {
      if (link.token) await removePublicRoster(link.token);
    }
  } catch (e) {
    console.warn('[ClinicRoster] Could not remove public roster snapshots:', e);
  }

  // 2. Wipe all clinic data collections. The user access list is kept, so
  //    approved staff keep their accounts.
  for (const col of ALL_COLLECTIONS) {
    if (col === 'systemMetadata' || col === 'userAccess') continue;
    try {
      await repo.clearCollection(col);
    } catch (e) {
      console.warn(`[ClinicRoster] Could not clear collection ${col}:`, e);
    }
  }

  // 3. Write persistent CLEARED tombstone in active repository
  try {
    const existing = await repo.get('systemMetadata', 'initialization_state');
    const now = new Date().toISOString();
    if (existing) {
      await repo.update('systemMetadata', 'initialization_state', {
        status: 'CLEARED',
        clearedAt: now,
        clearedBy: 'Administrator',
        note: 'All client database records cleared by administrator',
      });
    } else {
      await repo.create('systemMetadata', {
        id: 'initialization_state',
        status: 'CLEARED',
        clearedAt: now,
        clearedBy: 'Administrator',
        note: 'All client database records cleared by administrator',
      });
    }
    console.info('[ClinicRoster] Persistent CLEARED tombstone recorded in client repository.');
  } catch (tErr) {
    console.warn('[ClinicRoster] Warning writing CLEARED tombstone to client repository:', tErr);
  }

  // 4. Set localStorage tombstone flag & purge stale cache keys
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
 * Full Database JSON Backup Export
 */
export async function exportFullDatabaseBackup(repo: IRepository): Promise<string> {
  const exportPayload: Record<string, any[]> = {};

  for (const col of ALL_COLLECTIONS) {
    try {
      const records = await repo.list(col);
      exportPayload[col] = records;
    } catch {
      exportPayload[col] = [];
    }
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

/**
 * Full Database JSON Backup Import
 */
export async function importFullDatabaseBackup(
  repo: IRepository,
  jsonString: string
): Promise<{ success: boolean; message: string; recordCounts?: Record<string, number> }> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.collections) {
      return { success: false, message: 'Invalid backup file format: Missing "collections" map.' };
    }

    const collections = parsed.collections as Record<string, any[]>;
    const counts: Record<string, number> = {};

    // Clear existing
    await clearDatabase(repo);

    // Import each collection
    for (const col of ALL_COLLECTIONS) {
      const records = collections[col];
      if (Array.isArray(records) && records.length > 0) {
        await repo.bulkUpsert(col, records);
        counts[col] = records.length;
      } else {
        counts[col] = 0;
      }
    }

    return {
      success: true,
      message: `Database successfully restored from backup (${parsed.exportedAt || 'earlier export'}).`,
      recordCounts: counts,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to import backup: ${err.message || 'Malformed JSON'}`,
    };
  }
}
