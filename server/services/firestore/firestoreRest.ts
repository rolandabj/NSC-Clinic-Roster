/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Firestore REST helpers
 * The server has no service account, so it reads documents that the security
 * rules let anyone read (by their id) through the public REST API, without
 * credentials. The rules apply exactly as they do for a signed out browser.
 */

import { getFirebaseProjectConfig } from '../auth/firebaseIdentityService';

/** Converts one Firestore REST value ({ stringValue: 'x' }, { mapValue: ... }) to plain JSON. */
export function fromFirestoreValue(value: any): any {
  if (!value || typeof value !== 'object') return null;
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('referenceValue' in value) return value.referenceValue;
  if ('bytesValue' in value) return value.bytesValue;
  if ('geoPointValue' in value) return value.geoPointValue;
  if ('arrayValue' in value) return (value.arrayValue?.values || []).map(fromFirestoreValue);
  if ('mapValue' in value) return fromFirestoreFields(value.mapValue?.fields || {});
  return null;
}

/** Converts a REST document's `fields` to a plain object. */
export function fromFirestoreFields(fields: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [key, v] of Object.entries(fields || {})) out[key] = fromFirestoreValue(v);
  return out;
}

/**
 * Reads one document without credentials. Returns null when it does not exist
 * or the rules refuse it (a revoked or unknown link both read as "not found").
 * Throws for other failures (network, Firestore unavailable).
 */
export async function getPublicDocument(collection: string, id: string): Promise<Record<string, any> | null> {
  const { projectId, databaseId } = getFirebaseProjectConfig();
  if (!projectId) throw new Error('No Firebase project configured.');
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/${encodeURIComponent(databaseId || '(default)')}` +
    `/documents/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10_000) });
  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) throw new Error(`Firestore returned ${res.status}`);
  const json: any = await res.json();
  return { id, ...fromFirestoreFields(json?.fields || {}) };
}
