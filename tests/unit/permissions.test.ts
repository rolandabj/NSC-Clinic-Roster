import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canAccessRoute, permissionsFor } from '../../src/services/auth/access';
import { computePrivileges, type UserProfile } from '../../src/services/auth/authService';

const person = (role: UserProfile['role'], extra: Partial<UserProfile> = {}): UserProfile =>
  ({ uid: 'u', name: 'X', email: 'x@example.com', role, isLocal: false, ...extra }) as UserProfile;

// Screens show only what firestore.rules allow (isEditor, canApprove), so nobody meets a
// button that fails with "Missing or insufficient permissions". Downloads (canExport) are kept
// to planners and managers by choice: the rules let approved users read that data.

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

test('each role opens the screens it may use: planners all, everyone else the viewer screens', () => {
  const planner = person('EDITOR');
  const nurse = person('VIEWER', { linkedNurseId: 'mary' });
  const manager = person('VIEWER', { isManager: true });
  for (const route of ['schedules', 'nurses', 'doctors', 'publish', 'audit', 'settings'] as const) {
    assert.equal(canAccessRoute(planner, route), true, `planner ${route}`);
    assert.equal(canAccessRoute(nurse, route), false, `nurse ${route}`);
    assert.equal(canAccessRoute(manager, route), false, `manager ${route}`);
  }
  for (const route of ['dashboard', 'availability', 'history', 'reports', 'published'] as const) {
    assert.equal(canAccessRoute(nurse, route), true, `nurse ${route}`);
  }
});

test('only planners approve swaps, because only editors may save them', () => {
  assert.equal(computePrivileges('EDITOR').canApproveSwaps, true);
  assert.equal(computePrivileges('VIEWER', true).canApproveSwaps, false);
});
