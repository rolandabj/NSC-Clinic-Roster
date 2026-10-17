/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reading a collection one page at a time (Phase 7, slice 6b; the email log on Sent rosters
 * shows 25 sends at a time). Firestore pages on the server, ordered by one field so no new
 * index is needed; a repository that cannot page (the test page, the unit tests) is read in
 * full and paged here, with the same result.
 */

import { CollectionName, EntityForCollection } from '../../types';
import { IRepository } from './IRepository';

export interface PageRequest {
  /** One field to order by (a single field index, which Firestore keeps for every field). */
  orderBy: string;
  direction: 'asc' | 'desc';
  limit: number;
  /** Where the page before ended: the `cursor` of that page. Leave out for the first page. */
  cursor?: unknown;
}

export interface Page<T> {
  items: T[];
  /** More records are kept after this page. */
  hasMore: boolean;
  /** Pass to the next request to carry on after this page. */
  cursor?: unknown;
}

/** Pages a list already in memory: ordered by the field, then by id so equal values keep one order. */
export function pageFromList<T extends { id: string }>(list: T[], req: PageRequest): Page<T> {
  const value = (x: T) => String((x as Record<string, unknown>)[req.orderBy] ?? '');
  const sign = req.direction === 'asc' ? 1 : -1;
  const sorted = [...list].sort((a, b) => sign * (value(a).localeCompare(value(b)) || a.id.localeCompare(b.id)));
  const start = typeof req.cursor === 'number' ? req.cursor : 0;
  const items = sorted.slice(start, start + req.limit);
  const end = start + items.length;
  return { items, hasMore: end < sorted.length, cursor: end };
}

export async function listPage<C extends CollectionName>(
  repo: IRepository,
  collection: C,
  req: PageRequest
): Promise<Page<EntityForCollection<C>>> {
  if (repo.listPage) return repo.listPage(collection, req);
  return pageFromList((await repo.list(collection)) as (EntityForCollection<C> & { id: string })[], req);
}
