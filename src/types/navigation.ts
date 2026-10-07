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
