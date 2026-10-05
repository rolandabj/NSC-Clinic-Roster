import { test } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { EmailService } from '../../server/services/email/emailService';
import { loadEmailSettings, saveEmailSettings } from '../../src/services/settings/emailSettingsStore';
import { RosterPublishService } from '../../src/services/publish/rosterPublishService';
import { authService } from '../../src/services/auth/authService';
import { makeNurse } from './fixtures';
import { readEmailResponse } from '../../src/services/email/emailResponse';
import { checkEmailReadiness } from '../../src/services/email/emailReadiness';

const live = { provider: 'GOOGLE' as const, mockMode: false, senderName: 'Clinic' };
const configured = { ...live, smtpUser: 'clinic@example.org', googleAppPassword: 'abcd efgh ijkl mnop', smtpPort: 465 };

test('HTML returned with HTTP 200 reproduces the screenshot and is never treated as sent', async t => {
  t.mock.method(authService, 'getFreshToken', async () => 'test-token');
  t.mock.method(globalThis, 'fetch', async () => new Response('<!doctype html><html><body>App preview</body></html>', { status: 200, headers: { 'Content-Type': 'text/html' } }));
  const result = await RosterPublishService.dispatchEmail(live, 'nurse@example.org', makeNurse('n1'), 'Roster', '', '<p>Roster</p>', 's1', 'v1', 'ack-test');
  assert.equal(result.recipientLog.status, 'FAILED');
  assert.match(result.recipientLog.errorMessage!, /email API returned a web page/);
  await assert.rejects(checkEmailReadiness(true), /server routing/);
});

test('an HTML error page and invalid JSON produce clear email API errors', async () => {
  await assert.rejects(readEmailResponse(new Response('<html>Gateway error</html>', { status: 502 })), /web page/);
  await assert.rejects(readEmailResponse(new Response('not json', { status: 503 })), /unreadable response \(HTTP 503\)/);
  await assert.rejects(readEmailResponse(new Response('null')), /unreadable response/);
  assert.deepEqual(await readEmailResponse(new Response('{"message":"Sign in required."}', { status: 401 })), { message: 'Sign in required.' });
});

test('shared Live setting overrides a stale browser MOCK provider', async t => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const cache = new Map([['clinic_roster_email_config', JSON.stringify({ ...live, provider: 'MOCK', mockMode: true })]]);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (k: string) => cache.get(k), setItem: (k: string, v: string) => cache.set(k, v) } });
  t.after(() => { if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor); else delete (globalThis as any).localStorage; });
  const settings = await loadEmailSettings({ get: async () => ({ emailMockMode: false, emailSenderName: 'Clinic' }) } as any, true);
  assert.equal(settings.provider, 'GOOGLE');
  assert.equal(settings.mockMode, false);
  const before = cache.get('clinic_roster_email_config');
  await assert.rejects(saveEmailSettings({ get: async () => ({}), update: async () => { throw new Error('permission denied'); } } as any, { ...live, mockMode: true }));
  assert.equal(cache.get('clinic_roster_email_config'), before, 'a failed save must not change the browser mode');
});

test('publishing does not use cached settings when the shared settings cannot be read', async () => {
  await assert.rejects(loadEmailSettings({ get: async () => { throw new Error('offline'); } } as any, true), /shared email settings/);
});

test('missing SMTP secrets are diagnosed without attempting a connection', async t => {
  t.mock.method(EmailService, 'getConfig', () => ({ ...live }));
  t.mock.method(nodemailer, 'createTransport', () => { throw new Error('must not connect'); });
  const status = await EmailService.checkConnection();
  assert.equal(status.ready, false);
  assert.match(status.message, /GOOGLE_SMTP_USER and GOOGLE_APP_PASSWORD/);
  const sent = await EmailService.send({ to: 'nurse@example.org', subject: 'Roster', html: '', config: live });
  assert.equal(sent.status, 'FAILED');
});

test('SMTP preflight verifies without sending and uses TLS on port 465', async t => {
  let options: any, verified = 0, closed = 0;
  t.mock.method(EmailService, 'getConfig', () => configured);
  t.mock.method(nodemailer, 'createTransport', (config: any) => {
    options = config;
    return { verify: async () => { verified++; }, close: () => { closed++; }, sendMail: () => { throw new Error('must not send'); } };
  });
  const result = await EmailService.checkConnection();
  assert.equal(result.ready, true);
  assert.equal(verified, 1); assert.equal(closed, 1);
  assert.equal(options.secure, true);
  assert.equal(options.auth.pass, 'abcdefghijklmnop');
  assert.equal(JSON.stringify(result).includes('abcdefghijklmnop'), false);
});

test('SMTP authentication errors explain the remedy without returning the provider response', async t => {
  t.mock.method(EmailService, 'getConfig', () => configured);
  t.mock.method(nodemailer, 'createTransport', () => ({ verify: async () => { throw Object.assign(new Error('secret raw response'), { code: 'EAUTH' }); }, close() {} }));
  const result = await EmailService.checkConnection();
  assert.equal(result.ready, false);
  assert.match(result.message, /Google app password/);
  assert.equal(result.message.includes('secret raw response'), false);
});

test('SMTP reports success only when the provider accepts the recipient', async t => {
  t.mock.method(EmailService, 'getConfig', () => configured);
  let accept = false;
  t.mock.method(nodemailer, 'createTransport', () => ({ close() {}, sendMail: async () => ({ messageId: 'mail1', accepted: accept ? ['nurse@example.org'] : [], rejected: accept ? [] : ['nurse@example.org'] }) }));
  const payload = { to: 'nurse@example.org', subject: 'Roster', html: '<p>Roster</p>', config: live };
  assert.equal((await EmailService.send(payload)).status, 'FAILED');
  accept = true;
  assert.equal((await EmailService.send(payload)).status, 'SENT');
});

test('sandbox never opens SMTP and reports MOCK_SENT', async t => {
  t.mock.method(EmailService, 'getConfig', () => configured);
  t.mock.method(nodemailer, 'createTransport', () => { throw new Error('must not connect'); });
  assert.equal((await EmailService.send({ to: 'nurse@example.org', subject: 'Roster', html: '', config: { ...live, mockMode: true } })).status, 'MOCK_SENT');
});

test('browser dispatch refreshes authentication and preserves the server failure message', async t => {
  t.mock.method(authService, 'getFreshToken', async () => 'fresh-test-token');
  t.mock.method(globalThis, 'fetch', async (_url: any, init: any) => {
    assert.equal(init.headers.Authorization, 'Bearer fresh-test-token');
    assert.equal(JSON.parse(init.body).config.mockMode, false);
    return new Response(JSON.stringify({ data: { status: 'FAILED', error: 'Email is not configured.' } }), { status: 200 });
  });
  const result = await RosterPublishService.dispatchEmail(live, 'nurse@example.org', makeNurse('n1'), 'Roster', 'Preview', '<p>Roster</p>', 's1', 'v1', 'ack-test');
  assert.equal(result.recipientLog.status, 'FAILED');
  assert.equal(result.recipientLog.errorMessage, 'Email is not configured.');
});
