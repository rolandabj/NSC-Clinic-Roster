/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Live collection cache.
 *
 * Every screen used to call getDocs on whole collections each time it opened,
 * so moving between pages read the same documents from Firestore again and
 * again (each document counts against the daily read quota). Instead, the
 * first full read of a collection starts a Firestore live listener. Firestore
 * charges for the documents once, then only for documents that change, and
 * the listener keeps the copy current with edits made by other users. Later
 * reads of that collection, filtered or not, are answered from it.
 *
 * Safety rules:
 *   - A collection is answered from the cache only after a snapshot that
 *     Firestore confirmed with the server (never an empty offline guess).
 *   - Any listener error drops the cache for that collection, so the next read
 *     goes to Firestore and fails loudly if Firestore is failing.
 *   - Each read rebuilds the objects from the snapshot, so callers can change
 *     what they get back without changing the cache.
 */

import {
  Firestore,
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { quotaTracker } from '../firebase/quotaTracker';

export interface ListFilter {
  field: string;
  operator: '==' | '!=';
  value: any;
}

/** Collections that are written often and read rarely; they are not kept live. */
const UNCACHED_COLLECTIONS = new Set<string>(['audit', 'emailLog']);

/** How long to wait for the first server confirmed snapshot before reading directly. */
const FIRST_SNAPSHOT_TIMEOUT_MS = 20_000;

/** Same matching as a Firestore where() clause: a missing field never matches. */
export function matchesFilter(item: Record<string, any>, filter: ListFilter): boolean {
  const value = item[filter.field];
  if (value === undefined) return false;
  return filter.operator === '==' ? value === filter.value : value !== filter.value;
}

interface CacheEntry {
  docs: QueryDocumentSnapshot[] | null;
  ready: Promise<boolean>;
  stop: () => void;
}

export class LiveCollectionCache {
  private entries = new Map<string, CacheEntry>();

  constructor(private db: Firestore) {}

  isCacheable(colName: string): boolean {
    return !UNCACHED_COLLECTIONS.has(colName);
  }

  /** Stops every listener and forgets every copy (on sign in, sign out or user change). */
  reset(): void {
    for (const entry of this.entries.values()) entry.stop();
    this.entries.clear();
  }

  private drop(colName: string, entry: CacheEntry): void {
    if (this.entries.get(colName) === entry) {
      entry.stop();
      this.entries.delete(colName);
    }
  }

  private start(colName: string): CacheEntry {
    let settle: (ok: boolean) => void = () => {};
    let settled = false;
    const finish = (ok: boolean) => {
      if (!settled) {
        settled = true;
        settle(ok);
      }
    };
    const entry: CacheEntry = {
      docs: null,
      ready: new Promise<boolean>((resolve) => (settle = resolve)),
      stop: () => {},
    };

    const timer = setTimeout(() => {
      if (!entry.docs) {
        finish(false);
        this.drop(colName, entry);
      }
    }, FIRST_SNAPSHOT_TIMEOUT_MS);

    const unsubscribe = onSnapshot(
      collection(this.db, colName),
      { includeMetadataChanges: true },
      (snapshot) => {
        if (!entry.docs && snapshot.metadata.fromCache) return; // wait for the server
        entry.docs = snapshot.docs;
        clearTimeout(timer);
        finish(true);
      },
      (error) => {
        quotaTracker.notifyQuotaExceeded(error);
        console.warn(`[LiveCollectionCache] "${colName}" listener stopped:`, error?.message || error);
        clearTimeout(timer);
        finish(false);
        this.drop(colName, entry);
      }
    );
    entry.stop = () => {
      clearTimeout(timer);
      unsubscribe();
      finish(false);
    };
    this.entries.set(colName, entry);
    return entry;
  }

  /**
   * Returns the collection's documents (optionally filtered), or null when the
   * caller must read from Firestore directly. A filtered read never starts a
   * listener, because a user may only be allowed to query part of a collection.
   */
  async list(colName: string, filter?: ListFilter): Promise<any[] | null> {
    if (!this.isCacheable(colName)) return null;
    let entry = this.entries.get(colName);
    if (!entry) {
      if (filter) return null;
      entry = this.start(colName);
    }
    const ok = await entry.ready;
    if (!ok || !entry.docs || this.entries.get(colName) !== entry) return null;
    const items = entry.docs.map((d) => ({ id: d.id, ...d.data() }));
    return filter ? items.filter((item) => matchesFilter(item, filter)) : items;
  }

  /**
   * Returns { item } from a ready copy of the collection (item is null when the
   * document does not exist), or null when the caller must read directly.
   */
  getDoc(colName: string, id: string): { item: any | null } | null {
    const entry = this.entries.get(colName);
    if (!entry?.docs) return null;
    const found = entry.docs.find((d) => d.id === id);
    return { item: found ? { id: found.id, ...found.data() } : null };
  }
}
