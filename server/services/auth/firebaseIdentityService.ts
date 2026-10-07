/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Firebase Identity Service
 * Verifies Firebase Auth ID tokens (signature, issuer, audience, expiry) using
 * Google's public signing keys, then resolves the caller's clinic role from
 * their userAccess record in Firestore. The record is read with the caller's
 * own ID token, so Firestore security rules apply and no service account
 * credentials are needed on the server.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { AuthUser } from '../../middleware/auth';

export const MASTER_ADMIN_EMAIL = 'rolandabj@gmail.com';

const FIREBASE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const jwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));

interface FirebaseProjectConfig {
  projectId: string;
  databaseId: string;
}

let cachedProjectConfig: FirebaseProjectConfig | null = null;

/**
 * Reads the Firebase project id and Firestore database id from the environment,
 * falling back to the firebase-applet-config.json file that AI Studio provisions.
 */
export function getFirebaseProjectConfig(): FirebaseProjectConfig {
  if (cachedProjectConfig) return cachedProjectConfig;

  let fileConfig: any = {};
  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (err) {
    console.warn('[FirebaseIdentity] Could not read firebase-applet-config.json:', (err as Error).message);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || fileConfig.projectId || '';
  const databaseId = process.env.FIRESTORE_DATABASE_ID || fileConfig.firestoreDatabaseId || '(default)';

  if (!projectId) {
    console.error('[FirebaseIdentity] No Firebase project id configured: every request will be unauthenticated.');
  }

  cachedProjectConfig = { projectId, databaseId };
  return cachedProjectConfig;
}

// Short lived cache of verified identities, keyed by a hash of the token.
const IDENTITY_CACHE_TTL_MS = 60 * 1000;
const IDENTITY_CACHE_MAX = 500;
const identityCache = new Map<string, { user: AuthUser | null; expiresAt: number }>();

function cacheKey(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function readCache(key: string): AuthUser | null | undefined {
  const entry = identityCache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    identityCache.delete(key);
    return undefined;
  }
  return entry.user;
}

function writeCache(key: string, user: AuthUser | null, tokenExpSeconds?: number) {
  if (identityCache.size >= IDENTITY_CACHE_MAX) {
    const oldest = identityCache.keys().next().value;
    if (oldest) identityCache.delete(oldest);
  }
  const tokenExpiryMs = tokenExpSeconds ? tokenExpSeconds * 1000 : Date.now() + IDENTITY_CACHE_TTL_MS;
  identityCache.set(key, {
    user,
    expiresAt: Math.min(Date.now() + IDENTITY_CACHE_TTL_MS, tokenExpiryMs),
  });
}

interface AccessRecordFields {
  status?: string;
  appRole?: string;
  isManager?: boolean;
  linkedNurseId?: string;
  name?: string;
}

/**
 * Reads userAccess/{email} from Firestore using the caller's ID token.
 */
async function fetchAccessRecord(email: string, idToken: string): Promise<AccessRecordFields | null> {
  const { projectId, databaseId } = getFirebaseProjectConfig();
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/${encodeURIComponent(databaseId)}/documents/userAccess/${encodeURIComponent(email)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${idToken}` },
      signal: controller.signal,
    });
    if (res.status === 404 || res.status === 403) return null;
    if (!res.ok) {
      throw new Error(`Firestore access lookup failed (HTTP ${res.status})`);
    }
    const json: any = await res.json();
    const fields = json.fields || {};
    return {
      status: fields.status?.stringValue,
      appRole: fields.appRole?.stringValue,
      isManager: fields.isManager?.booleanValue === true,
      linkedNurseId: fields.linkedNurseId?.stringValue || undefined,
      name: fields.name?.stringValue,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Verifies a Firebase ID token and resolves the caller's clinic identity.
 * Returns null when the token is invalid or the user is not approved.
 */
export async function resolveFirebaseUser(idToken: string): Promise<AuthUser | null> {
  const { projectId } = getFirebaseProjectConfig();
  if (!projectId || !idToken) return null;

  const key = cacheKey(idToken);
  const cached = readCache(key);
  if (cached !== undefined) return cached;

  let payload: any;
  try {
    const verified = await jwtVerify(idToken, jwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ['RS256'],
    });
    payload = verified.payload;
  } catch {
    // Invalid, expired or foreign token: cache the rejection briefly to avoid repeated work.
    writeCache(key, null);
    return null;
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  if (!payload.sub || !email || payload.email_verified !== true) {
    writeCache(key, null, payload.exp);
    return null;
  }

  const displayName = typeof payload.name === 'string' && payload.name ? payload.name : email.split('@')[0];

  let user: AuthUser | null = null;

  if (email === MASTER_ADMIN_EMAIL) {
    user = {
      uid: payload.sub,
      name: displayName,
      email,
      role: 'OWNER',
      appRole: 'EDITOR',
      isManager: true,
      accessStatus: 'APPROVED',
      isLocal: false,
    };
  } else {
    let record: AccessRecordFields | null = null;
    try {
      record = await fetchAccessRecord(email, idToken);
    } catch (err) {
      // Do not cache lookup failures: the next request retries.
      console.warn('[FirebaseIdentity] Access record lookup error:', (err as Error).message);
      return null;
    }

    if (record && record.status === 'APPROVED') {
      user = {
        uid: payload.sub,
        name: record.name || displayName,
        email,
        // A manager approves requests but is not an editor (same as firestore.rules)
        role: record.appRole === 'EDITOR' ? 'EDITOR' : 'VIEWER',
        appRole: record.appRole === 'EDITOR' ? 'EDITOR' : 'VIEWER',
        isManager: record.isManager === true,
        accessStatus: 'APPROVED',
        linkedNurseId: record.linkedNurseId,
        isLocal: false,
      };
    }
  }

  writeCache(key, user, payload.exp);
  return user;
}

/**
 * The clinic's staff email addresses (nurses' and doctors' gmail fields), read
 * from Firestore with the caller's ID token. Used to limit who the email
 * endpoint may send to. Cached briefly per caller.
 */
const staffEmailCache = new Map<string, { emails: Set<string>; at: number }>();
export async function fetchStaffEmails(idToken: string): Promise<Set<string>> {
  const key = cacheKey(idToken);
  const hit = staffEmailCache.get(key);
  if (hit && Date.now() - hit.at < 60_000) return hit.emails;

  const { projectId, databaseId } = getFirebaseProjectConfig();
  const base =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/${encodeURIComponent(databaseId)}/documents/`;
  const emails = new Set<string>();
  for (const collection of ['nurses', 'doctors']) {
    let pageToken = '';
    for (let page = 0; page < 20; page++) {
      const url = `${base}${collection}?pageSize=300&mask.fieldPaths=gmail${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
      if (!res.ok) throw new Error(`Staff email lookup failed (HTTP ${res.status})`);
      const json: any = await res.json();
      for (const d of json.documents || []) {
        const email = d.fields?.gmail?.stringValue;
        if (email) emails.add(String(email).trim().toLowerCase());
      }
      if (!json.nextPageToken) break;
      pageToken = json.nextPageToken;
    }
  }
  staffEmailCache.set(key, { emails, at: Date.now() });
  if (staffEmailCache.size > 200) staffEmailCache.delete(staffEmailCache.keys().next().value as string);
  return emails;
}
