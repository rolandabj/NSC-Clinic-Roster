#!/usr/bin/env node
/**
 * Compares the Firestore rules published in Firebase with firestore.rules in the repo
 * (the owner publishes rules by hand in the Firebase console, so they can differ).
 * Uses the read only service account key in FIREBASE_SERVICE_ACCOUNT (the key file's
 * JSON, or the same in base64), with the rules of the app's own named database.
 * Exit 0: the same. 1: different (the difference is printed). 2: no key, or an error.
 * Secrets go to curl through stdin, never in its arguments, and are never printed.
 */

import { execFileSync } from 'node:child_process';
import { createSign } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function fail(message) {
  console.error(message);
  process.exit(2);
}

/** curl through the session's proxy; `input` goes in on stdin (headers or a form body). */
function curl(args, input) {
  try {
    return JSON.parse(execFileSync('curl', ['-sS', '--fail-with-body', ...args], { input, encoding: 'utf8' }));
  } catch (err) {
    fail(`Request failed: ${String(err.stdout || '').slice(0, 400) || 'no response'}`);
  }
}

const raw = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
if (!raw) fail('No Firebase key: add FIREBASE_SERVICE_ACCOUNT in the cloud environment settings (PROJECT_GUIDE.md, section 14), then start a new session.');
let key;
try {
  key = JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'));
} catch {
  fail('FIREBASE_SERVICE_ACCOUNT is not a service account key (the key file\'s JSON, or the same in base64).');
}
if (!key.client_email || !key.private_key) fail('FIREBASE_SERVICE_ACCOUNT has no client_email or private_key.');

const { projectId, firestoreDatabaseId } = JSON.parse(readFileSync(join(root, 'firebase-applet-config.json'), 'utf8'));
const database = firestoreDatabaseId || '(default)';

// A short lived access token for the service account (read only Firebase scope).
const b64url = (value) => Buffer.from(value).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const claims = {
  iss: key.client_email,
  scope: 'https://www.googleapis.com/auth/firebase.readonly',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 600,
};
const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify(claims))}`;
const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
const { access_token: token } = curl(
  ['-H', 'Content-Type: application/x-www-form-urlencoded', '--data-binary', '@-', 'https://oauth2.googleapis.com/token'],
  `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${unsigned}.${signature}`
);
const get = (url) => curl(['-H', '@-', url], `Authorization: Bearer ${token}\n`);

// The release of the app's database: cloud.firestore for the default one, cloud.firestore/<id> for a named one.
const api = 'https://firebaserules.googleapis.com/v1';
const releases = get(`${api}/projects/${projectId}/releases?pageSize=100`).releases || [];
const wanted = `projects/${projectId}/releases/cloud.firestore${database === '(default)' ? '' : `/${database}`}`;
const release = releases.find((r) => r.name === wanted);
if (!release) {
  const names = releases.map((r) => r.name.split('/releases/')[1]).join(', ') || 'none';
  fail(`No published Firestore rules found for the database ${database}. Published releases: ${names}.`);
}

const ruleset = get(`${api}/${release.rulesetName}`);
const published = (ruleset.source?.files || []).map((f) => f.content).join('\n');
const local = readFileSync(join(root, 'firestore.rules'), 'utf8');
const tidy = (text) => text.replace(/\r\n/g, '\n').trimEnd();

if (tidy(published) === tidy(local)) {
  console.log(`The published rules (published ${release.updateTime}) match firestore.rules.`);
  process.exit(0);
}
const dir = mkdtempSync(join(tmpdir(), 'published-rules-'));
writeFileSync(join(dir, 'published.rules'), `${tidy(published)}\n`);
console.log(`The published rules (published ${release.updateTime}) differ from firestore.rules (minus: published, plus: the repo):`);
try {
  execFileSync('diff', ['-u', join(dir, 'published.rules'), join(root, 'firestore.rules')], { stdio: 'inherit' });
} catch {
  // diff exits 1 when the files differ
}
process.exit(1);
