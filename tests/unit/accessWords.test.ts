import test from 'node:test';
import assert from 'node:assert/strict';
import { accessStatusWord, accessWords, roleWords } from '../../src/services/auth/accessWords';

// Settings, Access and permissions (Phase 8, slice 1e): what a person can do, in plain words.

const rec = (over: Record<string, unknown> = {}) =>
  ({ id: 'a@x.com', email: 'a@x.com', status: 'APPROVED', appRole: 'VIEWER', isManager: false, approvedBy: 'o', createdAt: '' , ...over }) as any;

test('each role and status has a plain word', () => {
  assert.equal(roleWords('VIEWER'), 'Look only');
  assert.equal(roleWords('EDITOR'), 'Change rosters, staff and settings');
  assert.equal(accessStatusWord('APPROVED'), 'Has access');
  assert.equal(accessStatusWord('PENDING'), 'Waiting for approval');
  assert.equal(accessStatusWord('REVOKED'), 'Access removed');
});

test('an email is described from its account', () => {
  assert.equal(accessWords(undefined, true), 'Owner: can do everything, including access and backups.');
  assert.equal(accessWords(undefined, false), 'No account. This person can sign in, but must wait for your approval before seeing anything.');
  assert.equal(accessWords(rec({ status: 'PENDING' }), false), 'Waiting for your approval. They can’t see anything yet.');
  assert.equal(accessWords(rec({ status: 'REVOKED' }), false), 'Access removed. They can’t see anything.');
  assert.equal(accessWords(rec(), false), 'Can look at rosters.');
  assert.equal(accessWords(rec({ appRole: 'EDITOR', isManager: true }), false), 'Can look at and change rosters, staff and settings, and can approve requests for leave, days off and shifts.');
});
