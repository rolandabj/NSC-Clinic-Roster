/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Saves a list the user edits (a roster's shifts, pinned days, leave) by
 * writing only what changed since it was loaded or last saved.
 *
 * Why: the old saves deleted every database record missing from the browser's
 * copy. A leave request filed, or a shift added by another planner, after the
 * page opened was then deleted by the next click. Here a record is only
 * deleted when this browser had it and the user removed it.
 *
 * Saves run one at a time. While one runs, newer edits wait and only the
 * latest state is saved next. A failed save is kept and can be retried.
 */

import { IRepository } from './IRepository';
import { CollectionName, EntityForCollection } from '../../types';

/** Stable JSON form of a record, ignoring undefined fields and key order. */
export function fingerprint(record: object): string {
  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort()) {
    const value = (record as any)[key];
    if (value !== undefined && value !== null) clean[key] = value;
  }
  return JSON.stringify(clean);
}

interface Known<T> {
  item: T;
  print: string;
}

export interface SyncPlan<T> {
  removeIds: string[];
  upserts: T[];
}

/**
 * What to write to turn the known saved state into the desired one. Only known
 * records that are in scope can be removed; records nobody here saw are never touched.
 */
export function planSync<T extends { id: string }>(
  known: Map<string, Known<T>>,
  desired: T[],
  inScope: (item: T) => boolean
): SyncPlan<T> {
  const desiredIds = new Set(desired.map((d) => d.id));
  const removeIds = [...known.entries()]
    .filter(([id, k]) => !desiredIds.has(id) && inScope(k.item))
    .map(([id]) => id);
  const upserts = desired.filter((d) => known.get(d.id)?.print !== fingerprint(d));
  return { removeIds, upserts };
}

export class CollectionSyncer<C extends CollectionName> {
  private known = new Map<string, Known<EntityForCollection<C>>>();
  private desired: { items: EntityForCollection<C>[]; inScope: (item: EntityForCollection<C>) => boolean } | null = null;
  private dirty = false;
  private running: Promise<void> | null = null;
  /** Why the last save failed (cleared by the next successful save). */
  lastError: unknown = null;

  constructor(
    private readonly repo: IRepository,
    private readonly collection: C,
    private readonly onChange?: () => void
  ) {}

  /** Records now known to be saved (just loaded from the database). */
  remember(items: EntityForCollection<C>[]): void {
    for (const item of items) this.known.set(item.id, { item, print: fingerprint(item) });
  }

  /** True while a save is running, waiting, or failed and not yet retried. */
  hasUnsaved(): boolean {
    return this.dirty || this.running !== null || this.lastError !== null;
  }

  /** Saves the desired state; resolves true when it (and anything queued) is saved. */
  save(items: EntityForCollection<C>[], inScope: (item: EntityForCollection<C>) => boolean = () => true): Promise<boolean> {
    this.desired = { items, inScope };
    this.dirty = true;
    if (!this.running) {
      this.running = this.loop().finally(() => {
        this.running = null;
        this.onChange?.();
      });
      this.onChange?.();
    }
    return this.running.then(() => this.lastError === null);
  }

  /** Resolves when no save is running (a failed one stays failed). */
  async idle(): Promise<void> {
    while (this.running) await this.running;
  }

  /** Tries the last failed save again. */
  retry(): Promise<boolean> | null {
    if (!this.desired || this.lastError === null) return null;
    return this.save(this.desired.items, this.desired.inScope);
  }

  private async loop(): Promise<void> {
    while (this.dirty && this.desired) {
      this.dirty = false;
      const { items, inScope } = this.desired;
      try {
        await this.write(items, inScope);
        this.lastError = null;
      } catch (err) {
        this.lastError = err;
        console.error(`[CollectionSyncer] Saving ${this.collection} failed:`, err);
        return;
      }
    }
  }

  private async write(items: EntityForCollection<C>[], inScope: (item: EntityForCollection<C>) => boolean): Promise<void> {
    const { removeIds, upserts } = planSync(this.known, items, inScope);
    if (removeIds.length > 0) {
      await this.repo.bulkRemove(this.collection, removeIds);
      for (const id of removeIds) this.known.delete(id);
    }
    if (upserts.length > 0) {
      // Whole documents, so a cleared field (e.g. a removed doctor) is cleared in the database too.
      await this.repo.bulkUpsert(this.collection, upserts, { replace: true });
      for (const item of upserts) this.known.set(item.id, { item, print: fingerprint(item) });
    }
  }
}
