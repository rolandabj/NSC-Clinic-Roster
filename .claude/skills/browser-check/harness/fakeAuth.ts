// Test page only: a signed in user, no Firebase. Exports what the real authService does.
// ?as= picks who is signed in: owner (default), planner, manager, nurse (Mary), or none (signed out).
export const MASTER_ADMIN_EMAIL = 'rolandabj@gmail.com';

/** Same rules as computePrivileges in src/services/auth/authService.ts. */
export function computePrivileges(role: string, isManager = false) {
  const isOwner = role === 'OWNER';
  const isEditorOrOwner = isOwner || role === 'EDITOR' || role === 'PLANNER';
  const canApprove = isOwner || isManager;
  return {
    canEditClinicSettings: isOwner,
    canCreateSchedules: isEditorOrOwner,
    canPublishSchedules: isEditorOrOwner,
    canRunSolver: isEditorOrOwner,
    canEditRosterAssignments: isEditorOrOwner,
    canApproveSwaps: canApprove,
    canApproveLeave: canApprove,
    canApproveAvailability: canApprove,
    canRequestSwaps: true,
    canAcknowledgeShifts: true,
    canViewSchedules: true,
    canExportReports: isEditorOrOwner || isManager,
    canManageStaff: isOwner,
  } as any;
}

const PEOPLE: Record<string, any> = {
  owner: { uid: 'u1', email: MASTER_ADMIN_EMAIL, name: 'Owner', role: 'OWNER', isManager: true },
  planner: { uid: 'u2', email: 'planner@example.com', name: 'Pat Planner', role: 'EDITOR', appRole: 'EDITOR', isManager: false },
  manager: { uid: 'u3', email: 'manager@example.com', name: 'Max Manager', role: 'VIEWER', appRole: 'VIEWER', isManager: true },
  nurse: { uid: 'u4', email: 'mary@example.com', name: 'Mary', role: 'VIEWER', appRole: 'VIEWER', isManager: false, linkedNurseId: 'mary' },
};

const as = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('as') || 'owner' : 'owner';
const person = PEOPLE[as];
const user: any = person
  ? { ...person, isLocal: false, accessStatus: 'APPROVED', privileges: computePrivileges(person.role, person.isManager) }
  : null;

export const authService: any = {
  getCurrentUser: () => user,
  subscribe: (cb: any) => {
    cb(user);
    return () => {};
  },
  whenReady: async () => user,
  isInitialized: () => true,
  signOut: async () => {},
  signInWithGoogle: async () => user,
  getTokenState: () => ({ hasToken: !!user }),
  getIdToken: async () => (user ? 'token' : null),
};

export class AuthService {}

export async function authorizedFetch(input: string, init: RequestInit = {}) {
  return fetch(input, init);
}
