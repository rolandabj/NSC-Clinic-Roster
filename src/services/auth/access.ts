/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Which screens each role sees. This only shapes the UI: the Firestore
 * security rules are what actually allow or refuse each read and write.
 */

import { AppRoute } from '../../types/navigation';
import { UserProfile } from './authService';

/** Owner and editors can change clinic data (same as isEditor() in firestore.rules). */
export function canEditClinicData(user?: UserProfile | null): boolean {
  if (!user) return false;
  return user.role === 'OWNER' || user.role === 'EDITOR' || user.role === 'PLANNER';
}

/** Owner, editors and managers can approve leave and availability (canApprove() in firestore.rules). */
export function canApproveRequests(user?: UserProfile | null): boolean {
  return canEditClinicData(user) || user?.isManager === true;
}

const VIEWER_ROUTES: AppRoute[] = ['dashboard', 'availability', 'history', 'reports', 'published'];

export function canAccessRoute(user: UserProfile | null | undefined, route: AppRoute): boolean {
  if (canEditClinicData(user)) return true;
  return VIEWER_ROUTES.includes(route);
}
