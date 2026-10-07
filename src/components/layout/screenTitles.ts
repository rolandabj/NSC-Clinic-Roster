/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The app's one name, each screen's name (the menu uses them too) and the browser tab title
 * of each screen: the screen first, then the app ("Rosters · NSC Clinic Roster").
 */

import type { AppRoute } from '../../types/navigation';

export const APP_NAME = 'NSC Clinic Roster';

export const SCREEN_NAMES: Record<AppRoute, string> = {
  dashboard: 'Dashboard',
  schedules: 'Rosters',
  availability: 'Availability',
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

/** "Rosters · NSC Clinic Roster", or with a detail first: "Email · Settings · NSC Clinic Roster". */
export function screenTitle(route: AppRoute, detail?: string): string {
  return [detail, SCREEN_NAMES[route], APP_NAME].filter(Boolean).join(' · ');
}
