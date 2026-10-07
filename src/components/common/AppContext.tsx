/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * What the whole signed in app shares (AppShell provides it): the clinic, the open roster and
 * its problem count, the person signed in and what they may do, and the few things screens
 * tell the app: a new problem count, the clinic's saved profile, all data deleted. It replaces
 * the window events the screens used before. Outside AppShell (the test page's single
 * screens, unit tests) there is no context, and screens carry on without it.
 */

import { createContext, useContext } from 'react';
import type { ClinicContextState } from '../../types/navigation';
import type { Permissions } from '../../services/auth/access';
import type { ProblemCount } from '../../services/dashboard/problemCount';

export interface AppContextValue {
  clinic: ClinicContextState;
  permissions: Permissions;
  /** The open roster's problem count, for the top bar (from the roster screen and the dashboard). */
  reportProblems: (count: ProblemCount) => void;
  /** The clinic's profile was saved in Settings. */
  updateClinic: (profile: { name: string; timezone?: string }) => void;
  /** All clinic data was deleted (Settings, Database and backup). */
  clinicDataCleared: () => void;
  /** Goes up by one each time the clinic data is deleted, so screens load it again. */
  dataVersion: number;
}

export const AppContext = createContext<AppContextValue | null>(null);

/** The app's shared state, or null outside the signed in app. */
export const useAppContext = (): AppContextValue | null => useContext(AppContext);
