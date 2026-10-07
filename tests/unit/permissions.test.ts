import { test } from 'node:test';
import assert from 'node:assert/strict';
import { permissionsFor } from '../../src/services/auth/access';
import { computePrivileges, type UserProfile } from '../../src/services/auth/authService';

const person = (role: UserProfile['role'], extra: Partial<UserProfile> = {}): UserProfile =>
  ({ uid: 'u', name: 'X', email: 'x@example.com', role, isLocal: false, ...extra }) as UserProfile;

// Screens show only what firestore.rules allow (isEditor, canApprove), so nobody meets a
// button that fails with "Missing or insufficient permissions".

test('the owner and planners can change the roster, approve requests and download exports', () => {
  for (const user of [person('OWNER'), person('EDITOR'), person('PLANNER')]) {
    const p = permissionsFor(user);
    assert.equal(p.canEdit, true, user.role);
    assert.equal(p.canApprove, true, user.role);
    assert.equal(p.canExport, true, user.role);
  }
  assert.equal(permissionsFor(person('OWNER')).isOwner, true);
  assert.equal(permissionsFor(person('EDITOR')).isOwner, false);
});

test('a manager approves requests and downloads exports but does not change the roster', () => {
  const p = permissionsFor(person('VIEWER', { isManager: true }));
  assert.deepEqual([p.canEdit, p.canApprove, p.canExport], [false, true, true]);
});

test("a nurse sees their own things only: no roster changes, approvals or other people's exports", () => {
  const p = permissionsFor(person('VIEWER', { linkedNurseId: 'mary' }));
  assert.deepEqual([p.canEdit, p.canApprove, p.canExport], [false, false, false]);
  assert.equal(p.linkedNurseId, 'mary');
});

test('someone not signed in can do nothing', () => {
  const p = permissionsFor(null);
  assert.deepEqual([p.canEdit, p.canApprove, p.canExport, p.isOwner], [false, false, false, false]);
});

test('the privileges shown in the account dialog agree: planners can approve, as the rules allow', () => {
  assert.equal(computePrivileges('EDITOR').canApproveLeave, true);
  assert.equal(computePrivileges('VIEWER', true).canApproveLeave, true);
  assert.equal(computePrivileges('VIEWER').canApproveLeave, false);
});
