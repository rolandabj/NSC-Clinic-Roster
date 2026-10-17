import test from 'node:test';
import assert from 'node:assert/strict';
import { filterVersions, versionKind, versionKindLabel, versionName, versionYears } from '../../src/services/history/versionKinds';
import { ScheduleVersion } from '../../src/types';

// History's one set of filters and its plain names (Phase 7, slice 5).

const v = (over: Partial<ScheduleVersion> & { id: string }): ScheduleVersion =>
  ({
    scheduleId: 's1',
    number: 1,
    timestamp: '2026-10-01T09:00:00.000Z',
    author: 'Ana',
    note: '',
    isPublished: false,
    snapshot: { schedule: { id: 's1', name: 'November 2026', startDate: '2026-11-01', endDate: '2026-11-30' }, assignments: [], leaveEntries: [], locks: [], rulesSnapshot: [] },
    ...over,
  }) as ScheduleVersion;

const saved = v({ id: 'a', number: 2, note: 'Before the fill', timestamp: '2026-10-02T09:00:00.000Z' });
const published = v({ id: 'b', number: 3, isPublished: true, author: 'Ben', timestamp: '2026-10-05T09:00:00.000Z' });
const backup = v({ id: 'c', number: 0, kind: 'BACKUP', note: 'Before clearing', timestamp: '2026-10-03T09:00:00.000Z' });
const lastYear = v({
  id: 'd',
  number: 1,
  timestamp: '2025-12-20T09:00:00.000Z',
  snapshot: { schedule: { id: 's2', name: 'January 2026', startDate: '2026-01-01', endDate: '2026-01-31' } } as ScheduleVersion['snapshot'],
});
const all = [saved, published, backup, lastYear];
const none = { kind: 'ALL', year: 'ALL', search: '', order: 'NEWEST' } as const;

test('each version has one of three kinds, with a plain name', () => {
  assert.equal(versionKind(saved), 'SAVED');
  assert.equal(versionKind(published), 'PUBLISHED');
  assert.equal(versionKind(backup), 'BACKUP');
  assert.equal(versionKindLabel('SAVED'), 'Saved copy');
  assert.equal(versionKindLabel('BACKUP'), 'Automatic backup');
  assert.equal(versionKindLabel('PUBLISHED'), 'Published version');
  assert.equal(versionName(published), 'Version 3');
  // Backups take no version number.
  assert.equal(versionName(backup), 'Automatic backup');
});

test('newest first by default, oldest first when asked', () => {
  assert.deepEqual(filterVersions(all, none).map((x) => x.id), ['b', 'c', 'a', 'd']);
  assert.deepEqual(filterVersions(all, { ...none, order: 'OLDEST' }).map((x) => x.id), ['d', 'a', 'c', 'b']);
});

test('the kind filter keeps one kind', () => {
  assert.deepEqual(filterVersions(all, { ...none, kind: 'BACKUP' }).map((x) => x.id), ['c']);
  assert.deepEqual(filterVersions(all, { ...none, kind: 'PUBLISHED' }).map((x) => x.id), ['b']);
  assert.deepEqual(filterVersions(all, { ...none, kind: 'SAVED' }).map((x) => x.id), ['a', 'd']);
});

test('the year matches the roster dates or the day it was saved', () => {
  assert.deepEqual(versionYears(all), ['2026', '2025']);
  // Saved in 2025 for a roster in 2026: found under both years.
  assert.deepEqual(filterVersions(all, { ...none, year: '2025' }).map((x) => x.id), ['d']);
  assert.equal(filterVersions(all, { ...none, year: '2026' }).length, 4);
});

test('search finds the note, the person, the roster and the version number', () => {
  const ids = (search: string) => filterVersions(all, { ...none, search }).map((x) => x.id);
  assert.deepEqual(ids('fill'), ['a']);
  assert.deepEqual(ids('BEN'), ['b']);
  assert.deepEqual(ids('january'), ['d']);
  assert.deepEqual(ids('version 3'), ['b']);
  assert.deepEqual(ids('backup'), ['c']);
  assert.deepEqual(ids('  '), ['b', 'c', 'a', 'd']);
});
