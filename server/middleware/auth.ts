/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Authentication & Role-Based Access Control (RBAC) Middleware
 * Accepts only Firebase Auth ID tokens, verified cryptographically.
 * Roles come from the caller's approved userAccess record in Firestore.
 */

import { Request, Response, NextFunction } from 'express';
import { ShareLink, Acknowledgment } from '../../src/types';
import { resolveFirebaseUser } from '../services/auth/firebaseIdentityService';

export type BackendRole = 'OWNER' | 'PLANNER' | 'EDITOR' | 'STAFF' | 'VIEWER';

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  role: BackendRole;
  appRole?: 'VIEWER' | 'EDITOR';
  isManager?: boolean;
  accessStatus?: 'APPROVED' | 'PENDING' | 'REVOKED';
  linkedNurseId?: string;
  isLocal: boolean;
}

// Global declaration merge for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      shareLink?: ShareLink;
      acknowledgment?: Acknowledgment;
    }
  }
}

/**
 * Standard role inheritance hierarchy:
 * OWNER > PLANNER/EDITOR > STAFF > VIEWER
 */
const ROLE_HIERARCHY: Record<BackendRole, BackendRole[]> = {
  OWNER: ['OWNER', 'PLANNER', 'EDITOR', 'STAFF', 'VIEWER'],
  PLANNER: ['PLANNER', 'EDITOR', 'STAFF', 'VIEWER'],
  EDITOR: ['PLANNER', 'EDITOR', 'STAFF', 'VIEWER'],
  STAFF: ['STAFF', 'VIEWER'],
  VIEWER: ['VIEWER'],
};

/**
 * Verify a Firebase ID token and resolve the approved clinic user.
 */
export async function verifyToken(token: string): Promise<AuthUser | null> {
  if (!token) return null;
  return resolveFirebaseUser(token.trim());
}

/**
 * Base Authentication Middleware
 * Parses Authorization: Bearer <token> and sets req.user if valid.
 * Does not reject requests itself; route guards below do that.
 */
export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return next();
  }

  try {
    const user = await verifyToken(token);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    console.warn('[AuthMiddleware] Token verification warning:', err);
  }

  next();
}

/**
 * Require active authentication guard
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Sign in required. Provide a valid Firebase ID token as a Bearer token.',
    });
    return;
  }
  next();
}

/**
 * Require one or more specific roles
 */
export function requireRole(allowedRoles: BackendRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Sign in required.',
      });
      return;
    }

    const userRole = req.user.role;
    const effectiveRoles = ROLE_HIERARCHY[userRole] || [userRole];

    const hasPermission = allowedRoles.some((r) => effectiveRoles.includes(r));
    if (!hasPermission) {
      res.status(403).json({
        error: 'Forbidden',
        message: `User role '${userRole}' is not permitted to perform this action. Required: ${allowedRoles.join(', ')}.`,
      });
      return;
    }

    next();
  };
}

/**
 * Convenience Role Guards
 */
export const requireOwner = requireRole(['OWNER']);
export const requirePlanner = requireRole(['OWNER', 'PLANNER', 'EDITOR']);
