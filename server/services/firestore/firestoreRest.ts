/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Firestore REST helpers
 * The server has no service account, so it reads documents that the security
 * rules let anyone read (by their id) through the public REST API, without
 * credentials. The rules apply exactly as they do for a signed out browser.
 * Reads and writes for a signed in caller use that caller's own ID token.
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

/** The REST address of one document. */
function documentUrl(collection: string, id: string): string {
  const { projectId, databaseId } = getFirebaseProjectConfig();
  if (!projectId) throw new Error('No Firebase project configured.');
  return (
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/${encodeURIComponent(databaseId || '(default)')}` +
    `/documents/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`
  );
}

/** Reads one document, with the caller's ID token when one is given (null when missing or refused). */
async function readDocument(collection: string, id: string, idToken?: string, withSaveTime = false): Promise<Record<string, any> | null> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (idToken) headers.Authorization = `Bearer ${idToken}`;
  const res = await fetch(documentUrl(collection, id), { headers, signal: AbortSignal.timeout(10_000) });
  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) throw new Error(`Firestore returned ${res.status}`);
  const json: any = await res.json();
  const doc: Record<string, any> = { id, ...fromFirestoreFields(json?.fields || {}) };
  // When Firestore last saved the document, by its own clock. Set after the fields, so no field can stand in for it.
  if (withSaveTime) doc._updateTime = typeof json?.updateTime === 'string' ? json.updateTime : undefined;
  return doc;
}

/**
 * Reads one document without credentials. Returns null when it does not exist
 * or the rules refuse it (a revoked or unknown link both read as "not found").
 * Throws for other failures (network, Firestore unavailable).
 */
export async function getPublicDocument(collection: string, id: string): Promise<Record<string, any> | null> {
  return readDocument(collection, id);
}

/**
 * Reads one document as the signed in caller, with their own ID token, so the
 * security rules decide exactly as they do in that person's browser. Returns
 * null when it does not exist or the rules refuse it. `_updateTime` is when
 * Firestore last saved the document (an ISO time from Firestore's clock).
 */
export async function getDocumentAs(collection: string, id: string, idToken: string): Promise<Record<string, any> | null> {
  if (!idToken) return null;
  return readDocument(collection, id, idToken, true);
}

/**
 * Sets text fields on one existing document as the signed in caller, with their own
 * ID token, so the security rules decide exactly as in that person's browser. Only
 * the named fields change. Throws when the write is refused or fails.
 */
export async function setTextFieldsAs(collection: string, id: string, fields: Record<string, string>, idToken: string): Promise<void> {
  if (!idToken) throw new Error('Sign in required.');
  const names = Object.keys(fields);
  const params = new URLSearchParams();
  for (const name of names) params.append('updateMask.fieldPaths', name);
  params.append('currentDocument.exists', 'true');
  const body = { fields: Object.fromEntries(names.map((name) => [name, { stringValue: fields[name] }])) };
  const res = await fetch(`${documentUrl(collection, id)}?${params}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Firestore returned ${res.status}`);
}
