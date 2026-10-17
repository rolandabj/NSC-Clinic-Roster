/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * History's plain names and its one set of filters (Phase 7, slice 5). Every version is one of
 * three kinds: a saved copy (kept by a planner, or made by a restore), an automatic backup (kept
 * before a fill, a clear or a restore) or a published version (sent to the nurses).
 */

import { ScheduleVersion } from '../../types';

export type VersionKind = 'SAVED' | 'BACKUP' | 'PUBLISHED';

const KIND_LABELS: Record<VersionKind, string> = {
  SAVED: 'Saved copy',
  BACKUP: 'Automatic backup',
  PUBLISHED: 'Published version',
};

export const versionKind = (v: ScheduleVersion): VersionKind =>
  v.kind === 'BACKUP' ? 'BACKUP' : v.isPublished ? 'PUBLISHED' : 'SAVED';

export const versionKindLabel = (kind: VersionKind): string => KIND_LABELS[kind];

/** "Version 3"; backups take no version number, so they are named by their kind. */
export const versionName = (v: ScheduleVersion): string =>
  v.kind === 'BACKUP' ? KIND_LABELS.BACKUP : `Version ${v.number}`;

export interface VersionFilters {
  kind: VersionKind | 'ALL';
  /** A year such as "2026", or "ALL". */
  year: string;
  search: string;
  order: 'NEWEST' | 'OLDEST';
}

/** The years of a version: the year it was saved and the year its roster starts. */
const yearsOf = (v: ScheduleVersion): string[] => {
  const years = [v.timestamp?.slice(0, 4), v.snapshot?.schedule?.startDate?.slice(0, 4)];
  return years.filter((y): y is string => !!y && /^\d{4}$/.test(y));
};

/** Every year found in the list, newest first. */
export const versionYears = (list: ScheduleVersion[]): string[] =>
  Array.from(new Set(list.flatMap(yearsOf))).sort((a, b) => b.localeCompare(a));

export const filterVersions = (list: ScheduleVersion[], f: VersionFilters): ScheduleVersion[] => {
  const q = f.search.toLowerCase().trim();
  const matchesSearch = (v: ScheduleVersion) =>
    !q ||
    [v.note, v.author, v.snapshot?.schedule?.name, versionName(v), versionKindLabel(versionKind(v))]
      .some((text) => (text || '').toLowerCase().includes(q));
  const newestFirst = (a: ScheduleVersion, b: ScheduleVersion) =>
    b.timestamp.localeCompare(a.timestamp) || b.number - a.number;
  return list
    .filter((v) => f.kind === 'ALL' || versionKind(v) === f.kind)
    .filter((v) => f.year === 'ALL' || yearsOf(v).includes(f.year))
    .filter(matchesSearch)
    .sort((a, b) => (f.order === 'NEWEST' ? newestFirst(a, b) : newestFirst(b, a)));
};
