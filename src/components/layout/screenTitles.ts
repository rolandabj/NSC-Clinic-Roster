/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The app's one name, each screen's name (the menu uses them too) and the browser tab title
 * of each screen: the screen first, then the app ("Rosters · NSC Clinic Roster").
 */

import type { AppRoute } from '../../types/navigation';
import { canEditClinicData } from '../../services/auth/access';
import type { UserProfile } from '../../services/auth/authService';

export const APP_NAME = 'NSC Clinic Roster';

export const SCREEN_NAMES: Record<AppRoute, string> = {
  dashboard: 'Dashboard',
  schedules: 'Rosters',
  availability: 'Leave and days off',
  requests: 'Requests',
  nurses: 'Nurses',
  doctors: 'Doctors',
  history: 'History',
  publish: 'Publish',
  reports: 'Reports',
  audit: 'Audit trail',
  settings: 'Settings',
  published: 'Shared roster',
  me: 'My shifts',
};

/**
 * A screen's name for this person: Availability is the planner's "Leave and days off" grid,
 * and for everyone else their own requests (UI overhaul Phase 6, slice 4).
 */
export function screenName(route: AppRoute, user?: Pick<UserProfile, 'role'> | null): string {
  if (route === 'availability' && !canEditClinicData(user as UserProfile | null)) return 'My requests';
  return SCREEN_NAMES[route];
}

/** "Rosters · NSC Clinic Roster", or with a detail first: "Email · Settings · NSC Clinic Roster". */
export function screenTitle(route: AppRoute, detail?: string, user?: Pick<UserProfile, 'role'> | null): string {
  return [detail, user === undefined ? SCREEN_NAMES[route] : screenName(route, user), APP_NAME].filter(Boolean).join(' · ');
}
