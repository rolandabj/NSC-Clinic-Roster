import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBackup } from '../../src/services/seed/seedRunner';

const backup = (collections: Record<string, unknown>, extra: Record<string, unknown> = {}) =>
  JSON.stringify({ app: 'ClinicRoster', exportedAt: '2026-09-01T10:00:00.000Z', collections, ...extra });

test('a good backup is accepted and counted', () => {
  const r = checkBackup(backup({ nurses: [{ id: 'n1' }, { id: 'n2' }], doctors: [{ id: 'd1' }], schedules: [] }));
  assert.equal(r.ok, true);
  assert.equal(r.total, 3);
  assert.equal(r.counts.nurses, 2);
  assert.equal(r.exportedAt, '2026-09-01T10:00:00.000Z');
});

test('user access and history in the file are left alone', () => {
  const r = checkBackup(backup({ nurses: [{ id: 'n1' }], userAccess: [{ id: 'x@y.com' }], audit: [{ id: 'a1' }] }));
  assert.equal(r.ok, true);
  assert.equal(r.total, 1);
  assert.deepEqual(r.skipped.sort(), ['audit', 'userAccess']);
  assert.equal(r.counts.userAccess, undefined);
});

test('files that would only delete data, or are not backups, are refused', () => {
  assert.equal(checkBackup('not json').ok, false);
  assert.equal(checkBackup(JSON.stringify({ collections: { nurses: [{ id: 'n1' }] } })).ok, false);
  assert.equal(checkBackup(backup({})).ok, false);
  assert.equal(checkBackup(backup({ nurses: [] })).ok, false);
  assert.equal(checkBackup(backup({ userAccess: [{ id: 'x@y.com' }] })).ok, false);
});

test('records without a usable id are refused', () => {
  assert.equal(checkBackup(backup({ nurses: { id: 'n1' } })).ok, false);
  assert.equal(checkBackup(backup({ nurses: [{ name: 'A' }] })).ok, false);
  assert.equal(checkBackup(backup({ nurses: [{ id: '' }] })).ok, false);
  assert.equal(checkBackup(backup({ nurses: [{ id: 'a/b' }] })).ok, false);
});
