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

// Checkpoint 8: the "Your access" dialog lists what the signed in person can do, in plain words.
import { computePrivileges } from '../../src/services/auth/authService';
import { youCanDo } from '../../src/services/auth/accessWords';

test('Your access lists what each person can do, in plain words', () => {
  const owner = youCanDo(computePrivileges('OWNER'));
  assert.deepEqual(owner.map((x) => x.words), [
    'Change rosters, staff and settings',
    'Fill rosters automatically',
    'Publish rosters',
    'Approve leave and days off',
    'Approve shift swaps',
    'Download reports',
    'Give people access and restore backups',
  ]);
  assert.ok(owner.every((x) => x.allowed));
  const viewer = youCanDo(computePrivileges('VIEWER'));
  assert.ok(viewer.every((x) => !x.allowed), JSON.stringify(viewer));
  const manager = youCanDo(computePrivileges('VIEWER', true));
  assert.deepEqual(manager.filter((x) => x.allowed).map((x) => x.words), ['Approve leave and days off', 'Download reports']);
  const editor = youCanDo(computePrivileges('EDITOR'));
  assert.deepEqual(editor.filter((x) => !x.allowed).map((x) => x.words), ['Give people access and restore backups']);
});
