// Test page only: a signed in owner, no Firebase. Exports what the real authService does.
export const MASTER_ADMIN_EMAIL = 'rolandabj@gmail.com';

export function computePrivileges() {
  return { canEditClinicData: true, canApproveRequests: true, canManageAccess: true } as any;
}

const user: any = { uid: 'u1', email: MASTER_ADMIN_EMAIL, name: 'Owner', role: 'OWNER', isManager: true, privileges: computePrivileges() };

export const authService: any = {
  getCurrentUser: () => user,
  subscribe: (cb: any) => {
    cb(user);
    return () => {};
  },
  whenReady: async () => user,
  isInitialized: () => true,
  signOut: async () => {},
  getTokenState: () => ({ hasToken: true }),
  getIdToken: async () => 'token',
};

export class AuthService {}

export async function authorizedFetch(input: string, init: RequestInit = {}) {
  return fetch(input, init);
}
