import test from 'node:test';
import assert from 'node:assert/strict';
import { actionWord, changedFields, entityWord, filterAudit, valueWords } from '../../src/services/audit/auditWords';

// The audit trail in plain words (Phase 8): each action and kind of record by name, what a
// change did field by field, and the search and filter over the records loaded.

test('each action and kind of record has a plain name', () => {
  assert.equal(actionWord('CREATE'), 'Added');
  assert.equal(actionWord('UPDATE'), 'Changed');
  assert.equal(actionWord('DELETE'), 'Deleted');
  assert.equal(actionWord('RESTORE'), 'Restored');
  assert.equal(actionWord('PUBLISH'), 'Published');
  assert.equal(actionWord('SWAP'), 'Swapped shifts');
  assert.equal(actionWord('OVERRIDE_LOCK'), 'Changed a pinned day');
  assert.equal(actionWord('LOCK'), 'Pinned a day');
  assert.equal(actionWord('REBALANCE'), 'Fairness moves');
  assert.equal(actionWord('TEMPLATE_APPLY'), 'Template applied');
  assert.equal(entityWord('Schedule'), 'Roster');
  assert.equal(entityWord('Assignment'), 'Shift');
  assert.equal(entityWord('LockEntry'), 'Pinned day');
  assert.equal(entityWord('AvailabilityRequest'), 'Request');
  assert.equal(entityWord('LeaveEntry'), 'Leave');
  assert.equal(entityWord('ScheduleVersion'), 'Roster version');
  assert.equal(entityWord('SomethingNew'), 'Something new');
});

test('a value reads plainly', () => {
  assert.equal(valueWords(undefined), 'Not set');
  assert.equal(valueWords(null), 'Not set');
  assert.equal(valueWords(''), 'Empty');
  assert.equal(valueWords(true), 'Yes');
  assert.equal(valueWords(false), 'No');
  assert.equal(valueWords(12), '12');
  assert.equal(valueWords('PUBLISHED'), 'PUBLISHED');
  assert.equal(valueWords('2026-11-16'), '16-11-2026');
  assert.match(valueWords('2026-11-03T10:00:00.000Z'), /^03-11-2026 \d{2}:\d{2}$/);
  assert.equal(valueWords(['a', 'b']), 'a, b');
  assert.equal(valueWords({ x: 1 }), '{"x":1}');
});

test('only the fields that changed are listed, in name order', () => {
  const rows = changedFields({ status: 'DRAFT', name: 'Nov', same: 1, gone: 'x' }, { status: 'PUBLISHED', name: 'Nov', same: 1, added: true });
  assert.deepEqual(rows, [
    { field: 'added', before: 'Not set', after: 'Yes' },
    { field: 'gone', before: 'x', after: 'Not set' },
    { field: 'status', before: 'DRAFT', after: 'PUBLISHED' },
  ]);
  assert.deepEqual(changedFields(undefined, { a: 1 }), [{ field: 'a', before: 'Not set', after: '1' }]);
  assert.deepEqual(changedFields({ a: [1, 2] }, { a: [1, 2] }), []);
  assert.deepEqual(changedFields('old', 'new'), [{ field: 'Value', before: 'old', after: 'new' }]);
  assert.deepEqual(changedFields(undefined, undefined), []);
});

const ev = (over: Record<string, unknown>) => ({ id: 'e', actor: 'owner@x.com', action: 'UPDATE', entity: 'Schedule', entityId: 's1', timestamp: '2026-11-03T08:00:00Z', ...over }) as any;

test('the filter and search keep the matching records', () => {
  const list = [ev({ id: '1', action: 'PUBLISH', note: 'Version 3 sent' }), ev({ id: '2', actor: 'mary@x.com', entity: 'Assignment' }), ev({ id: '3', action: 'DELETE' })];
  assert.equal(filterAudit(list, { action: 'ALL', search: '' }).length, 3);
  assert.deepEqual(filterAudit(list, { action: 'PUBLISH', search: '' }).map((e) => e.id), ['1']);
  assert.deepEqual(filterAudit(list, { action: 'ALL', search: 'MARY' }).map((e) => e.id), ['2']);
  assert.deepEqual(filterAudit(list, { action: 'ALL', search: 'version 3' }).map((e) => e.id), ['1']);
  assert.deepEqual(filterAudit(list, { action: 'ALL', search: 'shift' }).map((e) => e.id), ['2']);
  assert.deepEqual(filterAudit(list, { action: 'ALL', search: 'roster' }).map((e) => e.id), ['1', '3']);
});
