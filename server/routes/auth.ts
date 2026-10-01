/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Server Authentication Routes
 * Sign in happens in the browser with Firebase Auth (Google). The server only
 * verifies Firebase ID tokens (see middleware/auth.ts); it never issues its own
 * session tokens.
 */

import { Router, Request, Response } from 'express';
import { requireOwner } from '../middleware/auth';
import { RoleDirectoryService } from '../services/auth/roleDirectoryService';
import { getServerRepository } from '../db/index';

export const authRouter = Router();

/**
 * GET /api/auth/me
 * Returns current authenticated session information
 */
authRouter.get('/me', (req: Request, res: Response) => {
  if (!req.user) {
    res.json({
      authenticated: false,
      user: null,
    });
    return;
  }

  const privileges = RoleDirectoryService.computePrivileges(req.user.role, req.user.isManager ?? false);

  res.json({
    authenticated: true,
    user: {
      ...req.user,
      privileges,
    },
    privileges,
  });
});

/**
 * GET /api/auth/verify
 * Verifies the incoming Bearer token and returns authentication status
 */
authRouter.get('/verify', (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      valid: false,
      authenticated: false,
      error: 'Unauthorized',
      message: 'No valid Bearer session token provided.',
    });
    return;
  }

  const privileges = RoleDirectoryService.computePrivileges(req.user.role, req.user.isManager ?? false);

  res.json({
    valid: true,
    authenticated: true,
    user: {
      ...req.user,
      privileges,
    },
    privileges,
  });
});

/**
 * POST /api/auth/logout
 * Sign out happens in the browser (Firebase Auth). Kept for API compatibility.
 */
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Signed out.' });
});
/**
 * GET /api/auth/directory
 * Lists registered staff accounts and their mapped Google RBAC privileges
 */
authRouter.get('/directory', requireOwner, async (_req: Request, res: Response) => {
  try {
    const entries = await RoleDirectoryService.getDirectoryStaff();
    const summary = {
      owners: entries.filter((e) => e.role === 'OWNER').length,
      planners: entries.filter((e) => e.role === 'PLANNER' || (e.role === 'EDITOR' && e.isManager)).length,
      staff: entries.filter((e) => e.type === 'NURSE' || e.type === 'DOCTOR' || e.role === 'STAFF').length,
      viewers: entries.filter((e) => e.role === 'VIEWER' && e.type !== 'NURSE' && e.type !== 'DOCTOR').length,
      pending: entries.filter((e) => e.accessStatus === 'PENDING').length,
      approved: entries.filter((e) => e.accessStatus === 'APPROVED').length,
    };

    const repo = getServerRepository();
    const clinics = (await repo.list('clinics')) as any[];
    const activeClinic = clinics[0];
    const clinicName = activeClinic?.name || 'Outpatient Clinic';
    const clinicId = activeClinic?.id || 'clinic-primary';

    res.json({
      status: 'ok',
      clinic: {
        id: clinicId,
        name: clinicName,
      },
      totalRegistered: entries.length,
      summary,
      entries,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

/**
 * POST /api/auth/directory/test-match
 * Simulates role matching for an email address (owner only)
 */
authRouter.post('/directory/test-match', requireOwner, async (req: Request, res: Response) => {
  const { email, name } = req.body || {};

  if (!email || typeof email !== 'string') {
    res.status(400).json({
      status: 'error',
      message: 'An email address is required in the request body.',
    });
    return;
  }

  try {
    const matchedIdentity = await RoleDirectoryService.resolveRoleFromEmail(email, name);
    res.json({
      status: 'ok',
      email: matchedIdentity.email,
      name: matchedIdentity.name,
      role: matchedIdentity.role,
      appRole: matchedIdentity.appRole,
      isManager: matchedIdentity.isManager,
      accessStatus: matchedIdentity.accessStatus,
      matchedEntity: matchedIdentity.matchedEntity,
      isRegisteredStaff: matchedIdentity.isRegisteredStaff,
      nurseCode: matchedIdentity.nurseCode,
      seniorityLevel: matchedIdentity.seniorityLevel,
      privileges: matchedIdentity.privileges,
      description: matchedIdentity.description,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

