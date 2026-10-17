import test from 'node:test';
import assert from 'node:assert/strict';
import { addLeaveGuard, leaveReason, isChanged } from '../../src/components/common/leaveGuard';

// Unsaved changes in Settings (Phase 8, slice 1b): the app asks before leaving the screen.

test('with no screen holding unsaved changes, leaving needs no question', () => {
  assert.equal(leaveReason(), null);
});

test('a screen with unsaved changes gives the reason, until it is removed', () => {
  let dirty = true;
  const remove = addLeaveGuard(() => (dirty ? 'Clinic and opening hours has changes that are not saved.' : null));
  assert.equal(leaveReason(), 'Clinic and opening hours has changes that are not saved.');
  dirty = false;
  assert.equal(leaveReason(), null);
  dirty = true;
  remove();
  assert.equal(leaveReason(), null);
});

test('a draft is changed only when a value differs from the saved one', () => {
  const saved = { name: 'Clinic', weekendDays: [6, 0], phone: '' };
  assert.equal(isChanged(saved, { ...saved }), false);
  assert.equal(isChanged(saved, { ...saved, weekendDays: [6, 0] }), false);
  assert.equal(isChanged(saved, { ...saved, name: 'Clinic 2' }), true);
  assert.equal(isChanged(saved, { ...saved, weekendDays: [5, 6] }), true);
  assert.equal(isChanged(null, { ...saved }), false, 'nothing loaded yet is not a change');
});
