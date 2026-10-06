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
 * Saves run one at a time. Each scope (for shifts: one roster) keeps its own
 * latest unsaved state, so a newer save for one roster never replaces an
 * unsaved one for another. A failed save is kept until it is retried.
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

interface Desired<T> {
  items: T[];
  inScope: (item: T) => boolean;
}

export class CollectionSyncer<C extends CollectionName> {
  private known = new Map<string, Known<EntityForCollection<C>>>();
  /** Latest unsaved state per scope, waiting to be written. */
  private pending = new Map<string, Desired<EntityForCollection<C>>>();
  /** States that failed to save, per scope, with the reason. */
  private failed = new Map<string, Desired<EntityForCollection<C>> & { error: unknown }>();
  private running: Promise<void> | null = null;
  /** The scope being written now (it is no longer pending, but not yet saved). */
  private writingScope: string | null = null;

  constructor(
    private readonly repo: IRepository,
    private readonly collection: C,
    private readonly onChange?: () => void,
    /** Called after a change of one scope was written (not when there was nothing to write). */
    private readonly onSaved?: (scope: string) => void
  ) {}

  /** True when a save for this scope failed and waits for a retry. */
  hasFailed(scope: string): boolean {
    return this.failed.has(scope);
  }

  /** Why the oldest unresolved save failed (null when nothing failed). */
  get lastError(): unknown {
    const first = this.failed.values().next();
    return first.done ? null : first.value.error;
  }

  /** Records now known to be saved (just loaded from the database). */
  remember(items: EntityForCollection<C>[]): void {
    for (const item of items) this.known.set(item.id, { item, print: fingerprint(item) });
  }

  /**
   * Replaces what is known to be saved for one scope with a fresh load, so
   * records deleted elsewhere are forgotten instead of deleted again later.
   */
  replaceKnown(items: EntityForCollection<C>[], inScope: (item: EntityForCollection<C>) => boolean = () => true): void {
    for (const [id, k] of this.known) if (inScope(k.item)) this.known.delete(id);
    this.remember(items);
  }

  /**
   * True when a fresh copy from the database (for one scope) differs from what
   * this browser knows is saved: someone else changed it.
   */
  differsFromKnown(items: EntityForCollection<C>[], inScope: (item: EntityForCollection<C>) => boolean = () => true): boolean {
    let knownCount = 0;
    for (const k of this.known.values()) if (inScope(k.item)) knownCount++;
    if (knownCount !== items.length) return true;
    return items.some((item) => this.known.get(item.id)?.print !== fingerprint(item));
  }

  /** Drops a scope entirely (e.g. a deleted roster): nothing more is saved for it. */
  forgetScope(scope: string, inScope: (item: EntityForCollection<C>) => boolean): void {
    this.pending.delete(scope);
    this.failed.delete(scope);
    for (const [id, k] of this.known) if (inScope(k.item)) this.known.delete(id);
    this.onChange?.();
  }

  /**
   * The newest state of a scope that is not saved yet (waiting or failed), if
   * any. A screen that loads the scope again shows this instead of the
   * database copy, so what it shows is what the retry will save.
   */
  unsaved(scope: string): EntityForCollection<C>[] | undefined {
    return (this.pending.get(scope) || this.failed.get(scope))?.items;
  }

  /**
   * A fresh load of one scope: returns what the screen should show. Normally the
   * loaded copy (which becomes what is known to be saved). When a change made here
   * is not saved yet, the screen keeps showing that change, so the retry saves
   * exactly what is shown, and what this browser knew stays the base for it, so a
   * record someone else added meanwhile is never deleted by the retry.
   */
  adoptLoaded(
    items: EntityForCollection<C>[],
    scope: string,
    inScope: (item: EntityForCollection<C>) => boolean = () => true
  ): EntityForCollection<C>[] {
    const unsaved = this.unsaved(scope);
    if (unsaved) return unsaved;
    this.replaceKnown(items, inScope);
    return items;
  }

  /** Forgets everything: unsaved states and what is known (on sign out, so nothing is saved for the next account). */
  reset(): void {
    this.pending.clear();
    this.failed.clear();
    this.known.clear();
    this.onChange?.();
  }

  /** Drops the unsaved state of a scope (the planner chose to reload without it). */
  discard(scope: string): void {
    this.pending.delete(scope);
    this.failed.delete(scope);
    this.onChange?.();
  }

  /** True while a save is running, waiting, or failed and not yet retried. */
  hasUnsaved(scope?: string): boolean {
    if (scope !== undefined) return this.pending.has(scope) || this.failed.has(scope) || this.writingScope === scope;
    return this.pending.size > 0 || this.running !== null || this.failed.size > 0;
  }

  /** Saves the desired state of one scope; resolves true when it is saved. */
  save(
    items: EntityForCollection<C>[],
    inScope: (item: EntityForCollection<C>) => boolean = () => true,
    scope = 'all'
  ): Promise<boolean> {
    this.pending.set(scope, { items, inScope });
    this.failed.delete(scope); // the newer state replaces the failed one for this scope
    return this.run().then(() => !this.failed.has(scope) && !this.pending.has(scope));
  }

  /** Resolves when no save is running (a failed one stays failed). */
  async idle(): Promise<void> {
    while (this.running) await this.running;
  }

  /** Tries every failed save again; null when nothing failed. */
  retry(): Promise<boolean> | null {
    if (this.failed.size === 0) return null;
    for (const [scope, f] of this.failed) {
      if (!this.pending.has(scope)) this.pending.set(scope, { items: f.items, inScope: f.inScope });
    }
    this.failed.clear();
    return this.run().then(() => this.failed.size === 0);
  }

  private run(): Promise<void> {
    if (!this.running) {
      this.running = this.loop().finally(() => {
        this.running = null;
        this.onChange?.();
      });
      this.onChange?.();
    }
    return this.running;
  }

  private async loop(): Promise<void> {
    while (this.pending.size > 0) {
      const [scope, desired] = this.pending.entries().next().value as [string, Desired<EntityForCollection<C>>];
      this.pending.delete(scope);
      this.writingScope = scope;
      let wrote = false;
      try {
        wrote = await this.write(desired.items, desired.inScope);
      } catch (err) {
        console.error(`[CollectionSyncer] Saving ${this.collection} (${scope}) failed:`, err);
        // Kept for a retry, unless a newer state for this scope is already waiting.
        if (!this.pending.has(scope)) this.failed.set(scope, { ...desired, error: err });
      } finally {
        this.writingScope = null;
      }
      // What follows a save never makes the save itself count as failed.
      if (wrote) {
        try {
          this.onSaved?.(scope);
        } catch (err) {
          console.warn(`[CollectionSyncer] After saving ${this.collection} (${scope}):`, err);
        }
      }
    }
  }

  /** Writes what changed; true when anything was written. */
  private async write(items: EntityForCollection<C>[], inScope: (item: EntityForCollection<C>) => boolean): Promise<boolean> {
    const { removeIds, upserts } = planSync(this.known, items, inScope);
    if (removeIds.length + upserts.length === 0) return false;
    if (this.repo.bulkWrite) {
      // One write: new and changed records first, then removals, in as few batches as
      // possible, so a write cut short leaves the old records, never empty cells.
      await this.repo.bulkWrite(this.collection, { upserts, removeIds, replace: true });
      for (const id of removeIds) this.known.delete(id);
      for (const item of upserts) this.known.set(item.id, { item, print: fingerprint(item) });
      return true;
    }
    if (removeIds.length > 0) {
      await this.repo.bulkRemove(this.collection, removeIds);
      for (const id of removeIds) this.known.delete(id);
    }
    if (upserts.length > 0) {
      // Whole documents, so a cleared field (e.g. a removed doctor) is cleared in the database too.
      await this.repo.bulkUpsert(this.collection, upserts, { replace: true });
      for (const item of upserts) this.known.set(item.id, { item, print: fingerprint(item) });
    }
    return true;
  }
}
