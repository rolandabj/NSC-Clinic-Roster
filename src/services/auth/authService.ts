/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Firebase Authentication Client Service
 * Google sign in through Firebase Auth is the only way to sign in.
 * The user's role is read from their userAccess record in Firestore
 * (document id = lowercased email). Firestore security rules enforce the
 * same records, so the UI and the database always agree.
 */

import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserRole, UserAccessRecord } from '../../types';
import { getAppAuth, getAppFirestore } from '../firebase/firebaseConfig';

export const MASTER_ADMIN_EMAIL = 'rolandabj@gmail.com';

export interface UserPrivileges {
  canEditClinicSettings: boolean;
  canCreateSchedules: boolean;
  canPublishSchedules: boolean;
  canRunSolver: boolean;
  canEditRosterAssignments: boolean;
  canApproveSwaps: boolean;
  canApproveLeave: boolean;
  canApproveAvailability: boolean;
  canRequestSwaps: boolean;
  canAcknowledgeShifts: boolean;
  canViewSchedules: boolean;
  canExportReports: boolean;
  canManageStaff: boolean;
  canConfigureWebhooks: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  appRole?: 'VIEWER' | 'EDITOR';
  isManager?: boolean;
  accessStatus?: 'APPROVED' | 'PENDING' | 'REVOKED';
  linkedNurseId?: string;
  isLocal: boolean;
  nurseCode?: string;
  matchedEntity?: string;
  seniorityName?: string;
  privileges?: UserPrivileges;
  lastVerified?: string;
}

export function computePrivileges(role: UserRole, isManager: boolean = false): UserPrivileges {
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
    canConfigureWebhooks: isOwner,
  };
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];
  private initialized: boolean = false;
  private readyPromise: Promise<UserProfile | null>;
  private resolveReady!: (user: UserProfile | null) => void;

  // Current Firebase ID token, refreshed automatically by the Firebase SDK
  private idToken: string | null = null;
  // De-duplicates profile resolution when sign in and the token listener fire together
  private pendingResolution: { uid: string; promise: Promise<UserProfile> } | null = null;

  private constructor() {
    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });
    this.init();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public whenReady(): Promise<UserProfile | null> {
    return this.readyPromise;
  }

  private markReady() {
    if (!this.initialized) {
      this.initialized = true;
      this.resolveReady(this.currentUser);
    }
  }

  private init() {
    let auth;
    try {
      auth = getAppAuth();
    } catch (err) {
      console.error('[AuthService] Firebase Auth could not be initialized:', err);
      this.markReady();
      return;
    }

    onIdTokenChanged(auth, async (fbUser) => {
      if (!fbUser) {
        this.idToken = null;
        if (this.currentUser) {
          this.currentUser = null;
          this.notify();
        }
        this.markReady();
        return;
      }

      try {
        this.idToken = await fbUser.getIdToken();
      } catch (err) {
        console.warn('[AuthService] Could not read Firebase ID token:', err);
      }

      if (!this.currentUser || this.currentUser.uid !== fbUser.uid) {
        try {
          this.currentUser = await this.resolveProfileOnce(fbUser);
        } catch (err: any) {
          console.warn('[AuthService] Access not granted:', err?.message || err);
          this.currentUser = null;
        }
        this.notify();
      }
      this.markReady();
    });
  }

  /**
   * Returns the current Firebase ID token for API authorization.
   * The token is kept fresh by the Firebase SDK token listener.
   */
  public getBearerToken(): string | null {
    return this.idToken;
  }

  public getToken(): string | null {
    return this.idToken;
  }

  /**
   * Returns a guaranteed fresh ID token (refreshing it if it is close to expiry).
   */
  public async getFreshToken(): Promise<string | null> {
    const fbUser = getAppAuth().currentUser;
    if (!fbUser) return null;
    this.idToken = await fbUser.getIdToken();
    return this.idToken;
  }

  public getTokenState(): {
    hasSessionToken: boolean;
    hasIdToken: boolean;
    hasAccessToken: boolean;
    expiresAt?: number;
  } {
    return {
      hasSessionToken: false,
      hasIdToken: !!this.idToken,
      hasAccessToken: false,
    };
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public subscribe(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.currentUser);
      } catch (err) {
        console.error('[AuthService] Listener notification error:', err);
      }
    });
  }

  private resolveProfileOnce(fbUser: FirebaseUser): Promise<UserProfile> {
    if (this.pendingResolution && this.pendingResolution.uid === fbUser.uid) {
      return this.pendingResolution.promise;
    }
    const promise = this.resolveProfile(fbUser).finally(() => {
      if (this.pendingResolution?.promise === promise) {
        this.pendingResolution = null;
      }
    });
    this.pendingResolution = { uid: fbUser.uid, promise };
    return promise;
  }

  /**
   * Resolves the signed in Firebase user to a clinic profile using their
   * userAccess record. Unknown users get a PENDING access request filed for
   * the owner to approve, and are signed out.
   */
  private async resolveProfile(fbUser: FirebaseUser): Promise<UserProfile> {
    const email = (fbUser.email || '').trim().toLowerCase();
    if (!email || !fbUser.emailVerified) {
      await this.signOutQuietly();
      throw new Error('Your Google account has no verified email address.');
    }

    const db = getAppFirestore();
    const accessRef = doc(db, 'userAccess', email);
    const name = fbUser.displayName || email.split('@')[0];
    const now = new Date().toISOString();

    if (email === MASTER_ADMIN_EMAIL) {
      // Keep an owner record in the whitelist so it appears in access management.
      try {
        const snap = await getDoc(accessRef);
        if (!snap.exists()) {
          const ownerRecord: UserAccessRecord = {
            id: email,
            email,
            name,
            status: 'APPROVED',
            appRole: 'EDITOR',
            isManager: true,
            approvedBy: MASTER_ADMIN_EMAIL,
            approvedAt: now,
            createdAt: now,
          };
          await setDoc(accessRef, ownerRecord);
        }
      } catch (err) {
        console.warn('[AuthService] Could not ensure owner access record:', err);
      }

      return {
        uid: fbUser.uid,
        name,
        email,
        photoURL: fbUser.photoURL || undefined,
        role: 'OWNER',
        appRole: 'EDITOR',
        isManager: true,
        accessStatus: 'APPROVED',
        isLocal: false,
        matchedEntity: 'CLINIC_OWNER',
        privileges: computePrivileges('OWNER', true),
        lastVerified: now,
      };
    }

    const snap = await getDoc(accessRef);

    if (!snap.exists()) {
      try {
        await setDoc(accessRef, {
          id: email,
          email,
          name,
          status: 'PENDING',
          appRole: 'VIEWER',
          isManager: false,
          approvedBy: '',
          createdAt: now,
        });
      } catch (err) {
        console.warn('[AuthService] Could not file access request:', err);
      }
      await this.signOutQuietly();
      throw new Error(
        'Your access request has been sent to the clinic administrator. You can sign in once it is approved.'
      );
    }

    const record = snap.data() as UserAccessRecord;

    if (record.status === 'PENDING') {
      await this.signOutQuietly();
      throw new Error('Your access request is still awaiting approval by the clinic administrator.');
    }

    if (record.status !== 'APPROVED') {
      await this.signOutQuietly();
      throw new Error('Access for this account has been revoked. Contact the clinic administrator.');
    }

    const role: UserRole = record.appRole === 'EDITOR' ? 'EDITOR' : 'VIEWER';
    const isManager = record.isManager === true;

    return {
      uid: fbUser.uid,
      name: record.name || name,
      email,
      photoURL: fbUser.photoURL || undefined,
      role,
      appRole: record.appRole || 'VIEWER',
      isManager,
      accessStatus: 'APPROVED',
      linkedNurseId: record.linkedNurseId,
      isLocal: false,
      privileges: computePrivileges(role, isManager),
      lastVerified: now,
    };
  }

  /**
   * Re-reads the signed in user's access record (e.g. after the owner changed their role).
   */
  public async refreshProfile(): Promise<UserProfile | null> {
    const fbUser = getAppAuth().currentUser;
    if (!fbUser) return null;
    try {
      this.currentUser = await this.resolveProfile(fbUser);
    } catch (err) {
      this.currentUser = null;
      this.notify();
      throw err;
    }
    this.notify();
    return this.currentUser;
  }

  /**
   * Google sign in with the Firebase Google provider (account chooser popup).
   */
  public async signInWithGoogle(): Promise<UserProfile> {
    const auth = getAppAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    let fbUser: FirebaseUser;
    try {
      const result = await signInWithPopup(auth, provider);
      fbUser = result.user;
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        throw new Error('The sign in popup was blocked. Allow popups for this site, or open the app in a new tab, then try again.');
      }
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign in was cancelled.');
      }
      throw new Error(err?.message || 'Google sign in failed. Please try again.');
    }

    this.idToken = await fbUser.getIdToken();
    const profile = await this.resolveProfileOnce(fbUser);
    this.currentUser = profile;
    this.notify();
    return profile;
  }

  private async signOutQuietly(): Promise<void> {
    try {
      await firebaseSignOut(getAppAuth());
    } catch (e) {
      console.warn('[AuthService] Firebase sign out note:', e);
    }
  }

  public async signOut(): Promise<void> {
    this.idToken = null;
    try {
      localStorage.removeItem('clinic_user_profile');
      localStorage.removeItem('clinic_roster_session_token');
    } catch {}
    await this.signOutQuietly();
    this.currentUser = null;
    this.notify();
  }
}

export const authService = AuthService.getInstance();

/**
 * fetch() wrapper that attaches the signed in user's Firebase ID token.
 */
export async function authorizedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = await authService.getFreshToken();
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
}
