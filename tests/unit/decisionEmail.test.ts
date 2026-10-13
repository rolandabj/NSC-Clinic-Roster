import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { decisionEmail } from '../../src/services/requests/decisionEmail';
import { createRequestsRouter } from '../../server/routes/requests';
import { createApiApp } from '../../server/apiApp';
import type { SendEmailPayload } from '../../server/services/email/emailService';

// UI overhaul Phase 5, slice 4: the email a nurse gets when a planner or manager decides a request.

test('an approved leave request names the leave, the days and who approved it', () => {
  const email = decisionEmail({
    request: { kind: 'leave', leaveTypeName: 'Annual Leave', startDate: '2026-11-20', endDate: '2026-11-22' },
    status: 'APPROVED',
    nurseName: 'Mary Ann Lee',
    reviewerName: 'Sam Ortiz',
    senderName: 'Clinic Roster',
  });
  assert.equal(email.subject, 'Your Annual Leave request for 20-11-2026 to 22-11-2026 was approved');
  assert.match(email.text, /^Hello Mary,/);
  assert.match(email.text, /Your Annual Leave request for 20-11-2026 to 22-11-2026 was approved by Sam Ortiz\./);
  assert.match(email.text, /My requests/);
  assert.doesNotMatch(email.text, /Note from/);
  assert.match(email.text, /Clinic Roster$/);
});

test('a declined day off gives the one day and the reviewer note', () => {
  const email = decisionEmail({
    request: { kind: 'day', available: false, date: '2026-11-18' },
    status: 'REJECTED',
    nurseName: 'Lee',
    reviewerName: 'Sam Ortiz',
    reviewNote: 'Two nurses are already off that day.',
    senderName: 'Clinic Roster',
  });
  assert.equal(email.subject, 'Your day off request for 18-11-2026 was declined');
  assert.match(email.text, /was declined by Sam Ortiz\./);
  assert.match(email.text, /Note from Sam Ortiz: Two nurses are already off that day\./);
});

test('a wanted shift uses the shift name, and a missing name falls back to "shift"', () => {
  const named = decisionEmail({
    request: { kind: 'day', available: true, shiftName: 'Day', date: '2026-11-18' },
    status: 'APPROVED', nurseName: 'Lee', senderName: 'Clinic Roster',
  });
  assert.equal(named.subject, 'Your Day shift request for 18-11-2026 was approved');
  assert.match(named.text, /was approved\./, 'no reviewer name means no "by"');
  const unnamed = decisionEmail({
    request: { kind: 'day', available: true, date: '2026-11-18' },
    status: 'APPROVED', nurseName: 'Lee', senderName: 'Clinic Roster',
  });
  assert.equal(unnamed.subject, 'Your shift request for 18-11-2026 was approved');
});

test('the email cannot carry markup or extra header lines', () => {
  const email = decisionEmail({
    request: { kind: 'leave', leaveTypeName: 'Leave\r\nBcc: x@example.com', startDate: '2026-11-20', endDate: '2026-11-20' },
    status: 'APPROVED',
    nurseName: '<b>Lee</b>',
    reviewerName: 'Sam',
    reviewNote: '<script>alert(1)</script>',
    senderName: 'Clinic Roster',
  });
  assert.doesNotMatch(email.subject, /[\r\n]/);
  assert.doesNotMatch(email.html, /<script>|<b>/);
  assert.match(email.html, /&lt;script&gt;/);
});

// ---------------------------------------------------------------------------
// The route: POST /api/requests/:id/notify
// ---------------------------------------------------------------------------

const NOW = Date.parse('2026-11-01T10:00:00Z');
const decidedAt = new Date(NOW - 60_000).toISOString();

function clinicData(overrides: Record<string, Record<string, any> | null> = {}) {
  const docs: Record<string, Record<string, any> | null> = {
    'systemMetadata/email_settings': { emailMockMode: true, emailSenderName: 'Clinic Roster', emailRequestDecisions: true },
    'availabilityRequests/r1': { id: 'r1', nurseId: 'n1', date: '2026-11-18', available: false, status: 'APPROVED', reviewedAt: decidedAt, reviewedByUserName: 'Sam Ortiz' },
    'leaveEntries/l1': { id: 'l1', nurseId: 'n1', leaveTypeId: 'lt1', startDate: '2026-11-20', endDate: '2026-11-22', status: 'REJECTED', approved: false, reviewedAt: decidedAt, reviewedByUserName: 'Sam Ortiz' },
    'leaveTypes/lt1': { id: 'lt1', name: 'Annual Leave' },
    'nurses/n1': { id: 'n1', fullName: 'Mary Lee', gmail: 'mary.lee@example.com' },
    ...overrides,
  };
  return docs;
}

type User = { role: string; isManager?: boolean; email?: string };

async function call(user: User | null, path: string, body: unknown, docs = clinicData()) {
  const sent: SendEmailPayload[] = [];
  const reads: Array<[string, string]> = [];
  const router = createRequestsRouter({
    readDocument: async (collection, id, token) => {
      reads.push([`${collection}/${id}`, token]);
      return docs[`${collection}/${id}`] ?? null;
    },
    send: async (payload) => {
      sent.push(payload);
      return { success: true, provider: 'GOOGLE', messageId: 'm1', recipients: [String(payload.to)], status: 'MOCK_SENT' };
    },
    now: () => NOW,
  });
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    if (user) {
      (req as any).user = { uid: 'u1', name: 'Sam Ortiz', email: user.email || 'sam@example.com', ...user };
      (req as any).firebaseIdToken = 'caller-token';
    }
    next();
  });
  app.use('/api/requests', router);
  const server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  try {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { status: res.status, json: await res.json(), sent, reads };
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

const editor: User = { role: 'EDITOR' };
const manager: User = { role: 'VIEWER', isManager: true };

test('the route sends a decided day off to that nurse only, read with the caller\'s own token', async () => {
  const r = await call(manager, '/api/requests/r1/notify', { kind: 'day', to: 'someone@example.com', html: '<p>x</p>' });
  assert.equal(r.status, 200);
  assert.equal(r.json.data.status, 'MOCK_SENT');
  assert.equal(r.sent.length, 1);
  assert.equal(r.sent[0].to, 'mary.lee@example.com', 'the recipient comes from the nurse record, never the request body');
  assert.equal(r.sent[0].subject, 'Your day off request for 18-11-2026 was approved');
  assert.doesNotMatch(r.sent[0].html, /<p>x<\/p>/, 'the body is written by the server');
  assert.deepEqual(r.sent[0].config, { mockMode: true, senderName: 'Clinic Roster' }, 'Sandbox comes from the shared settings');
  assert.ok(r.reads.every(([, token]) => token === 'caller-token'));
});

test('the route writes a leave decision with the leave type name', async () => {
  const r = await call(editor, '/api/requests/l1/notify', { kind: 'leave' });
  assert.equal(r.status, 200);
  assert.equal(r.sent[0].subject, 'Your Annual Leave request for 20-11-2026 to 22-11-2026 was declined');
});

test('only planners and managers may ask for the email', async () => {
  const nurse = await call({ role: 'VIEWER' }, '/api/requests/r1/notify', { kind: 'day' });
  assert.equal(nurse.status, 403);
  assert.equal(nurse.sent.length, 0);
  const signedOut = await call(null, '/api/requests/r1/notify', { kind: 'day' });
  assert.equal(signedOut.status, 401);
  assert.equal(signedOut.sent.length, 0);
});

test('nothing is sent while the Settings switch is off', async () => {
  const r = await call(editor, '/api/requests/r1/notify', { kind: 'day' }, clinicData({
    'systemMetadata/email_settings': { emailMockMode: false, emailRequestDecisions: false },
  }));
  assert.equal(r.status, 200);
  assert.equal(r.json.data.status, 'OFF');
  assert.equal(r.sent.length, 0);
  const noSettings = await call(editor, '/api/requests/r1/notify', { kind: 'day' }, clinicData({ 'systemMetadata/email_settings': null }));
  assert.equal(noSettings.json.data.status, 'OFF', 'the switch starts off');
});

test('a request still waiting, an old decision or an unknown request is not emailed', async () => {
  const waiting = await call(editor, '/api/requests/r1/notify', { kind: 'day' }, clinicData({
    'availabilityRequests/r1': { id: 'r1', nurseId: 'n1', date: '2026-11-18', available: false, status: 'PENDING' },
  }));
  assert.equal(waiting.status, 409);
  const old = await call(editor, '/api/requests/r1/notify', { kind: 'day' }, clinicData({
    'availabilityRequests/r1': { id: 'r1', nurseId: 'n1', date: '2026-11-18', available: false, status: 'APPROVED', reviewedAt: new Date(NOW - 60 * 60_000).toISOString() },
  }));
  assert.equal(old.status, 409);
  const unknown = await call(editor, '/api/requests/nope/notify', { kind: 'day' });
  assert.equal(unknown.status, 404);
  const badKind = await call(editor, '/api/requests/r1/notify', { kind: 'nurses' });
  assert.equal(badKind.status, 400);
  assert.equal(waiting.sent.length + old.sent.length + unknown.sent.length + badKind.sent.length, 0);
});

test('a nurse without an email address gets nothing, and the planner is told', async () => {
  const r = await call(editor, '/api/requests/r1/notify', { kind: 'day' }, clinicData({ 'nurses/n1': { id: 'n1', fullName: 'Mary Lee' } }));
  assert.equal(r.status, 422);
  assert.equal(r.sent.length, 0);
});

test('the same decision is emailed once', async () => {
  const sent: SendEmailPayload[] = [];
  const router = createRequestsRouter({
    readDocument: async (c, id) => clinicData()[`${c}/${id}`] ?? null,
    send: async (p) => { sent.push(p); return { success: true, provider: 'GOOGLE', messageId: 'm', recipients: [], status: 'MOCK_SENT' }; },
    now: () => NOW,
  });
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => { (req as any).user = { uid: 'u1', role: 'EDITOR' }; next(); });
  app.use('/api/requests', router);
  const server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  try {
    const post = () => fetch(`http://127.0.0.1:${port}/api/requests/r1/notify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"kind":"day"}',
    }).then((res) => res.json());
    assert.equal((await post()).data.status, 'MOCK_SENT');
    assert.equal((await post()).data.status, 'ALREADY_SENT');
    assert.equal(sent.length, 1);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('the full API refuses the route to anyone not signed in', async () => {
  const server = createApiApp().listen(0);
  const { port } = server.address() as AddressInfo;
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/requests/r1/notify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"kind":"day"}',
    });
    assert.equal(res.status, 401);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

// ---------------------------------------------------------------------------
// The browser asks for the email after each approve or decline.
// ---------------------------------------------------------------------------

test('approving or declining a request asks the server to email the nurse', async (t) => {
  const { repositoryManager } = await import('../../src/services/repository');
  const { decideRequest } = await import('../../src/services/requests/staffRequestService');
  const { authService } = await import('../../src/services/auth/authService');
  const docs = new Map<string, any>([
    ['leaveEntries/l1', { id: 'l1', nurseId: 'n1', startDate: '2026-11-20', endDate: '2026-11-22', status: 'PENDING' }],
    ['availabilityRequests/r1', { id: 'r1', nurseId: 'n1', date: '2026-11-18', available: true, status: 'PENDING' }],
  ]);
  const repo = {
    get: async (c: string, id: string) => docs.get(`${c}/${id}`) ?? null,
    update: async (c: string, id: string, data: any) => { docs.set(`${c}/${id}`, { ...docs.get(`${c}/${id}`), ...data }); },
    create: async (_c: string, data: any) => data,
    list: async () => [],
    remove: async () => {},
  };
  const previous = (repositoryManager as any).activeRepo;
  (repositoryManager as any).activeRepo = repo;
  t.after(() => { (repositoryManager as any).activeRepo = previous; });
  t.mock.method(authService, 'getFreshToken', async () => 'planner-token');
  const asked: Array<{ url: string; body: any; auth: string | null }> = [];
  t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    asked.push({ url, body: JSON.parse(String(init.body)), auth: new Headers(init.headers).get('Authorization') });
    return new Response('{"data":{"status":"MOCK_SENT"}}', { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
  const planner = { uid: 'u1', name: 'Sam', email: 'sam@example.com', role: 'EDITOR', appRole: 'EDITOR' } as any;

  await decideRequest(planner, 'LEAVE', 'l1', 'APPROVED');
  await decideRequest(planner, 'AVAILABILITY', 'r1', 'REJECTED', 'Full that day.');
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(asked.map((a) => [a.url, a.body.kind, a.auth]), [
    ['/api/requests/l1/notify', 'leave', 'Bearer planner-token'],
    ['/api/requests/r1/notify', 'day', 'Bearer planner-token'],
  ]);
  assert.deepEqual(Object.keys(asked[0].body), ['kind'], 'the browser sends no email text and no address');
});

test('a failed email request never fails the decision', async (t) => {
  const { emailDecision } = await import('../../src/services/requests/staffRequestService');
  const { authService } = await import('../../src/services/auth/authService');
  t.mock.method(authService, 'getFreshToken', async () => 'planner-token');
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('offline'); });
  t.mock.method(console, 'warn', () => {});
  await assert.doesNotReject(emailDecision('day', 'r1'));
});

test('the Settings switch is saved for the whole clinic and starts off', async (t) => {
  const { loadEmailSettings, saveEmailSettings } = await import('../../src/services/settings/emailSettingsStore');
  const store = new Map<string, string>();
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) } });
  t.after(() => { if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor); else delete (globalThis as any).localStorage; });

  assert.equal((await loadEmailSettings({ get: async () => ({ emailMockMode: true }) } as any)).requestDecisionEmails, false);
  let saved: any;
  await saveEmailSettings({ get: async () => null, create: async (_c: string, d: any) => { saved = d; } } as any,
    { provider: 'GOOGLE', mockMode: true, senderName: 'Clinic', requestDecisionEmails: true });
  assert.equal(saved.emailRequestDecisions, true, 'stored where the server reads it');
  assert.equal((await loadEmailSettings({ get: async () => saved } as any)).requestDecisionEmails, true);
});

test('a request without a date still reads as a sentence', () => {
  const email = decisionEmail({ request: { kind: 'day', available: false, date: '' }, status: 'APPROVED', nurseName: 'Lee', senderName: 'Clinic Roster' });
  assert.equal(email.subject, 'Your day off request was approved');
});
