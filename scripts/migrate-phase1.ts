/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 1 data migration (idempotent, safe to re-run).
 *
 *   1. Materialises the `workingHoursPeriods` collection file — the authoritative
 *      full-time hours targets per dedicated period (Q1 decision).
 *   2. Stamps legacy `LockEntry` rows with the `scheduleId` of the schedule that owns
 *      their date, so a pin can never leak into another (overlapping) schedule.
 *      Locks whose date is covered by no schedule are left untagged (they keep the
 *      legacy date-window fallback) and are reported.
 *
 * Usage:
 *   npx tsx scripts/migrate-phase1.ts            # apply
 *   npx tsx scripts/migrate-phase1.ts --dry-run  # report only
 */

import path from 'node:path';
import { JsonFileRepository } from '../server/db/jsonStore';
import { ensureWorkingHoursPeriods } from '../src/services/seed/configDefaults';
import { resolveScheduleIdForLockDate } from '../src/services/schedule/lockScope';
import { LockEntry, Schedule } from '../src/types';

const dryRun = process.argv.includes('--dry-run');
const dataDir = process.env.DATA_DIR || path.resolve(process.cwd(), 'data', 'db');

async function main(): Promise<void> {
  const repo = new JsonFileRepository(dataDir);
  console.log(`[Phase1Migration] Data directory: ${dataDir}${dryRun ? '  (DRY RUN)' : ''}`);

  // ---------------------------------------------------------------- 1. Periods
  const existingPeriods = await repo.list('workingHoursPeriods');
  if (dryRun) {
    console.log(`[Phase1Migration] workingHoursPeriods present: ${existingPeriods.length}`);
  } else if (existingPeriods.length === 0) {
    const added = await ensureWorkingHoursPeriods(repo);
    console.log(`[Phase1Migration] Seeded ${added} dedicated working-hours periods.`);
  } else {
    console.log(
      `[Phase1Migration] workingHoursPeriods already populated (${existingPeriods.length} rows) — left untouched.`
    );
  }

  // ------------------------------------------------------------------- 2. Locks
  const schedules = (await repo.list('schedules')) as Schedule[];
  const locks = (await repo.list('locks')) as LockEntry[];
  const untagged = locks.filter((l) => !l.scheduleId);

  console.log(
    `[Phase1Migration] Locks: ${locks.length} total, ${untagged.length} untagged (legacy).`
  );
  if (schedules.length === 0) {
    console.log('[Phase1Migration] No schedules exist — nothing to stamp.');
    return;
  }

  let stamped = 0;
  let unresolved = 0;
  const unresolvedSample: string[] = [];

  for (const lock of untagged) {
    const scheduleId = resolveScheduleIdForLockDate(schedules, lock.date);
    if (!scheduleId) {
      unresolved += 1;
      if (unresolvedSample.length < 10) unresolvedSample.push(`${lock.id}@${lock.date}`);
      continue;
    }
    if (!dryRun) {
      await repo.update('locks', lock.id, { scheduleId });
    }
    stamped += 1;
  }

  console.log(
    `[Phase1Migration] ${dryRun ? 'Would stamp' : 'Stamped'} ${stamped} lock(s) with a scheduleId; ` +
      `${unresolved} lock(s) fall outside every schedule window (left untagged).`
  );
  if (unresolvedSample.length > 0) {
    console.log(`[Phase1Migration] Unresolved sample: ${unresolvedSample.join(', ')}`);
  }

  // ------------------------------------------------------------ 3. Audit entry
  if (!dryRun && stamped > 0) {
    await repo.create('audit', {
      actor: 'Phase 1 Migration',
      action: 'UPDATE',
      entity: 'LockEntry',
      entityId: 'migrate-phase1',
      note: `Stamped ${stamped} legacy lock(s) with their owning scheduleId (${unresolved} left untagged outside all schedule windows).`,
      timestamp: new Date().toISOString(),
    });
    console.log('[Phase1Migration] Audit entry written.');
  }

  console.log('[Phase1Migration] Done.');
}

main().catch((err) => {
  console.error('[Phase1Migration] Failed:', err);
  process.exit(1);
});
