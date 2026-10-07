import { UserRole } from './index';

export type AppRoute =
  | 'dashboard'
  | 'schedules'
  | 'availability'
  | 'nurses'
  | 'doctors'
  | 'history'
  | 'publish'
  | 'reports'
  | 'audit'
  | 'settings'
  | 'published'
  | 'me';

/**
 * A screen changed what is open on it (a roster, sheet, nurse or settings tab) and the address
 * follows: 'push' adds a step to Back (a new tab), 'replace' does not.
 */
export type AddressChange = (params: Record<string, string | undefined>, mode: 'push' | 'replace') => void;

export interface NavItem {
  id: AppRoute;
  label: string;
  iconName: string;
  badge?: number | string;
}

export interface ClinicContextState {
  clinicName: string;
  timezone: string;
  activeScheduleName: string;
  activeSchedulePeriod: string;
  activeScheduleId: string | null;
  warningCount: number;
  isLocalMode: boolean;
  currentUser: {
    name: string;
    email: string;
    role: UserRole;
    isLocal: boolean;
    /** Can approve leave and day off requests without being a planner. */
    isManager?: boolean;
    /** The nurse profile this account belongs to, if any. */
    linkedNurseId?: string;
  } | null;
}
