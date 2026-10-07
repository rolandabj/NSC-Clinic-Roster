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
import { BackendRole } from '../middleware/auth';

export const authRouter = Router();

/** Informational privilege matrix for the signed in user (Firestore rules enforce access). */
function computePrivileges(role: BackendRole, isManager: boolean) {
  const isOwner = role === 'OWNER';
  const isEditorOrOwner = isOwner || role === 'EDITOR' || role === 'PLANNER';
  // Same as canApprove() in firestore.rules: editors or managers.
  const canApprove = isEditorOrOwner || isManager;
  return {
    canEditClinicSettings: isOwner,
    canCreateSchedules: isEditorOrOwner,
    canPublishSchedules: isEditorOrOwner,
    canRunSolver: isEditorOrOwner,
    canEditRosterAssignments: isEditorOrOwner,
    canApproveSwaps: isEditorOrOwner, // swaps are saved by planners (the rules let only editors write swaps)
    canApproveLeave: canApprove,
    canApproveAvailability: canApprove,
    canRequestSwaps: true,
    canAcknowledgeShifts: true,
    canViewSchedules: true,
    canExportReports: isEditorOrOwner || isManager,
    canManageStaff: isOwner,
  };
}

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

  const privileges = computePrivileges(req.user.role, req.user.isManager ?? false);

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

  const privileges = computePrivileges(req.user.role, req.user.isManager ?? false);

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
