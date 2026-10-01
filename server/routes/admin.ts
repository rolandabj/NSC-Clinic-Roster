/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Server Admin Maintenance & User Management Routes (Phase 2)
 * Provides database statistics, health indicators, dataset re-seeding,
 * and the background acknowledgment chaser. User access is managed in Firestore.
 */

import { Router, Request, Response } from 'express';
import { getServerRepository } from '../db/index';
import {
  getServerDatabaseStats,
  reseedServerDatabase,
  clearServerDatabase,
} from '../services/seed/serverSeedRunner';
import { requireOwner, requirePlanner } from '../middleware/auth';
import { acknowledgmentChaser } from '../services/jobs/acknowledgmentChaser';
import { MASTER_ADMIN_EMAIL } from '../services/auth/roleDirectoryService';

export const adminRouter = Router();

/**
 * GET /api/admin/stats
 * Returns document counts across all collections
 */
adminRouter.get('/stats', requireOwner, async (_req: Request, res: Response) => {
  try {
    const repo = getServerRepository();
    const collectionCounts = await getServerDatabaseStats(repo);

    let totalRecords = 0;
    for (const count of Object.values(collectionCounts)) {
      totalRecords += count;
    }

    res.json({
      status: 'ok',
      totalRecords,
      counts: collectionCounts,
      storageType: 'file-backed-json',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[AdminAPI] Failed to fetch stats:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve database statistics',
      error: err.message,
    });
  }
});

/**
 * POST /api/admin/reseed
 * Permanently decommissioned for production compliance.
 */
adminRouter.post('/reseed', requireOwner, async (_req: Request, res: Response) => {
  res.status(410).json({
    status: 'error',
    message: 'Demo data re-seeding has been permanently decommissioned for production compliance.',
  });
});

/**
 * POST /api/admin/clear
 * Permanently wipes all database records across all server collections and records a CLEARED tombstone.
 * Guarded: Requires OWNER role (rolandabj@gmail.com).
 */
adminRouter.post('/clear', requireOwner, async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email || 'Master Administrator';

    // Strict Master Admin verification: requires OWNER role and the master admin email
    const isMasterAdmin =
      req.user?.role === 'OWNER' &&
      req.user?.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

    if (!isMasterAdmin) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Clear database is strictly restricted to Master Administrator (${MASTER_ADMIN_EMAIL}).`,
      });
      return;
    }

    console.info(`[AdminAPI] Triggering server database wipe by ${userEmail}...`);
    const repo = getServerRepository();
    await clearServerDatabase(repo, userEmail);
    const updatedCounts = await getServerDatabaseStats(repo);

    let totalRecords = 0;
    for (const [col, count] of Object.entries(updatedCounts)) {
      if (col !== 'systemMetadata') {
        totalRecords += count;
      }
    }

    res.json({
      status: 'ok',
      message: 'All server database records have been permanently cleared and tombstoned.',
      totalRecords,
      counts: updatedCounts,
      tombstone: 'CLEARED',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[AdminAPI] Failed to clear database:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear database records',
      error: err.message,
    });
  }
});

/**
 * GET /api/admin/chaser/status
 * Returns current status, run counts, and statistics of the Acknowledgment Chaser job
 */
adminRouter.get('/chaser/status', requirePlanner, async (_req: Request, res: Response) => {
  try {
    const status = acknowledgmentChaser.getStatus();
    res.json({ status: 'ok', data: status });
  } catch (err: any) {
    res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/**
 * POST /api/admin/chaser/run
 * Manually invokes a chaser cycle with optional custom threshold
 * Guarded: Requires Planner or Owner
 */
adminRouter.post('/chaser/run', requirePlanner, async (req: Request, res: Response) => {
  try {
    const thresholdHours = req.body?.thresholdHours !== undefined ? Number(req.body.thresholdHours) : undefined;
    const result = await acknowledgmentChaser.runChaserCycle(thresholdHours);
    res.json({ status: 'ok', data: result });
  } catch (err: any) {
    console.error('[AdminAPI] Chaser run failed:', err);
    res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/**
 * POST /api/admin/chaser/configure
 * Dynamically updates interval, threshold, or enabled status
 * Guarded: Requires Owner
 */
adminRouter.post('/chaser/configure', requireOwner, async (req: Request, res: Response) => {
  try {
    const { intervalMinutes, thresholdHours, enabled } = req.body;
    const status = acknowledgmentChaser.configure({
      intervalMinutes: intervalMinutes !== undefined ? Number(intervalMinutes) : undefined,
      thresholdHours: thresholdHours !== undefined ? Number(thresholdHours) : undefined,
      enabled: enabled !== undefined ? Boolean(enabled) : undefined,
    });
    res.json({ status: 'ok', data: status });
  } catch (err: any) {
    res.status(500).json({ error: 'ServerError', message: err.message });
  }
});
