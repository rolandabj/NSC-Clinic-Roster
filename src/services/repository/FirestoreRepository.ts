/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cloud Firestore Repository Implementation
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  runTransaction,
  getDocsFromServer,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CollectionName, EntityForCollection, Schedule } from '../../types';
import { mergeScheduleRanges, rangesOverlap, ScheduleRange, toScheduleRange } from '../schedule/scheduleRanges';
import { IRepository, SubscribeCallback, Unsubscribe } from './IRepository';
import { quotaTracker } from '../firebase/quotaTracker';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LiveCollectionCache } from './liveCollectionCache';

// Firestore allows at most 500 writes in one batch; stay safely below it.
const BATCH_LIMIT = 450;
const SCHEDULE_CALENDAR = 'scheduleCalendar';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

function sanitizePayload(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(sanitizePayload).filter((item) => item !== undefined);
  }
  if (typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        clean[key] = sanitizePayload(val);
      }
    }
    return clean;
  }
  return obj;
}

export class FirestoreRepository implements IRepository {
  private db: Firestore;
  private app: FirebaseApp;
  private cache: LiveCollectionCache;

  /** One transaction serializes date reservations across all planner sessions. */
  private async writeSchedules(
    items: Partial<Schedule>[],
    removeIds: string[] = [],
    replace = false
  ): Promise<Schedule[]> {
    const calendarRef = doc(this.db, 'systemMetadata', SCHEDULE_CALENDAR);
    // Bootstrap the index from existing rosters. Once created, every roster
    // mutation updates it in the same transaction as the roster document.
    const calendar = await getDoc(calendarRef);
    const legacy = calendar.exists() ? [] : (await getDocsFromServer(collection(this.db, 'schedules'))).docs
      .map(s => ({ ...s.data(), id: s.id } as Schedule));
    return runTransaction(this.db, async transaction => {
      const snapshot = await transaction.get(calendarRef);
      const existing: Record<string, ScheduleRange> = snapshot.exists()
        ? { ...(snapshot.data().ranges as Record<string, ScheduleRange>) }
        : Object.fromEntries(legacy.map(s => [s.id, toScheduleRange(s)]));
      const documents = await Promise.all(items.map(item => transaction.get(doc(this.db, 'schedules', item.id!))));
      const next = items.map((item, i) => sanitizePayload({ ...(replace ? {} : documents[i].data()), ...item }) as Schedule);
      // A change to a roster that no longer exists would save a half empty record.
      next.forEach((s, i) => {
        if (!replace && !documents[i].exists() && !s.startDate) throw new Error('This roster no longer exists. Reload the page.');
      });
      // The calendar can be out of date (a roster deleted from an old open tab or the
      // Firebase console): before refusing dates, check the conflicting roster itself.
      const changedIds = new Set(next.map(s => s.id));
      const conflicts = new Set<string>();
      for (const s of next) {
        const range = toScheduleRange(s);
        Object.values(existing).forEach(other => {
          if (!changedIds.has(other.id) && rangesOverlap(range, other)) conflicts.add(other.id);
        });
      }
      const conflictDocs = await Promise.all([...conflicts].map(id => transaction.get(doc(this.db, 'schedules', id))));
      conflictDocs.forEach(d => {
        if (!d.exists()) delete existing[d.id];
        else existing[d.id] = toScheduleRange({ ...(d.data() as Schedule), id: d.id });
      });
      const ranges = mergeScheduleRanges(existing, next.map(toScheduleRange));
      for (const id of removeIds) delete ranges[id];
      for (const item of next) transaction.set(doc(this.db, 'schedules', item.id), item);
      for (const id of removeIds) transaction.delete(doc(this.db, 'schedules', id));
      transaction.set(calendarRef, sanitizePayload({ id: SCHEDULE_CALENDAR, ranges }));
      return next;
    });
  }

  constructor(config: FirebaseClientConfig) {
    if (!getApps().length) {
      this.app = initializeApp(config);
    } else {
      this.app = getApp();
    }
    const dbId = config.firestoreDatabaseId;
    if (dbId && dbId !== '(default)') {
      this.db = getFirestore(this.app, dbId);
    } else {
      this.db = getFirestore(this.app);
    }
    this.cache = new LiveCollectionCache(this.db);
    // A cached copy belongs to the user who could read it: drop it whenever
    // the signed in user changes, so the next user's reads go through the rules.
    let lastUid: string | null | undefined;
    onAuthStateChanged(getAuth(this.app), (user) => {
      const uid = user?.uid ?? null;
      if (uid !== lastUid) {
        lastUid = uid;
        this.cache.reset();
      }
    });
  }

  async list<T extends CollectionName>(
    colName: T,
    filter?: { field: string; operator: '==' | '!='; value: any }
  ): Promise<EntityForCollection<T>[]> {
    const cached = await this.cache.list(colName, filter);
    if (cached) return cached as EntityForCollection<T>[];
    try {
      const colRef = collection(this.db, colName);
      const q = filter ? query(colRef, where(filter.field, filter.operator, filter.value)) : query(colRef);
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as EntityForCollection<T>));
    } catch (err: any) {
      quotaTracker.notifyQuotaExceeded(err);
      console.warn(`[FirestoreRepository] list failed for ${colName}:`, err?.message || err);
      // Never pretend a failed read is an empty collection: screens would show
      // an empty roster and a later save could delete the real records.
      throw err;
    }
  }

  async get<T extends CollectionName>(
    colName: T,
    id: string
  ): Promise<EntityForCollection<T> | null> {
    const cached = this.cache.getDoc(colName, id);
    if (cached) return cached.item as EntityForCollection<T> | null;
    try {
      const docRef = doc(this.db, colName, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as EntityForCollection<T>;
    } catch (err: any) {
      quotaTracker.notifyQuotaExceeded(err);
      console.warn(`[FirestoreRepository] get failed for ${colName}/${id}:`, err?.message || err);
      throw err;
    }
  }

  async create<T extends CollectionName>(
    colName: T,
    data: Omit<EntityForCollection<T>, 'id'> & { id?: string }
  ): Promise<EntityForCollection<T>> {
    quotaTracker.assertWritable();
    const docId = data.id || uuidv4();
    const docRef = doc(this.db, colName, docId);
    const entity = sanitizePayload({ ...data, id: docId }) as EntityForCollection<T>;
    try {
      if (colName === 'schedules') return (await this.writeSchedules([entity as Schedule], [], true))[0] as EntityForCollection<T>;
      if (colName === 'systemMetadata' && docId === SCHEDULE_CALENDAR) throw new Error('The roster calendar is maintained automatically.');
      await setDoc(docRef, entity);
      return entity;
    } catch (err: any) {
      quotaTracker.notifyQuotaExceeded(err);
      throw err;
    }
  }

  async update<T extends CollectionName>(
    colName: T,
    id: string,
    data: Partial<EntityForCollection<T>>
  ): Promise<EntityForCollection<T>> {
    quotaTracker.assertWritable();
    const docRef = doc(this.db, colName, id);
    const cleanData = sanitizePayload(data);
    try {
      if (colName === 'schedules') return (await this.writeSchedules([{ ...cleanData, id }]))[0] as EntityForCollection<T>;
      if (colName === 'systemMetadata' && id === SCHEDULE_CALENDAR) throw new Error('The roster calendar is maintained automatically.');
      await setDoc(docRef, cleanData, { merge: true });
      const cached = this.cache.getDoc(colName, id);
      if (cached?.item) return cached.item as EntityForCollection<T>;
      try {
        const snap = await getDoc(docRef);
        return { id: snap.id, ...snap.data() } as EntityForCollection<T>;
      } catch (readErr: any) {
        console.warn(`[FirestoreRepository] Read-after-write failed for ${colName}/${id}:`, readErr?.message || readErr);
        return { id, ...cleanData } as EntityForCollection<T>;
      }
    } catch (err: any) {
      quotaTracker.notifyQuotaExceeded(err);
      throw err;
    }
  }

  async remove<T extends CollectionName>(
    colName: T,
    id: string
  ): Promise<void> {
    quotaTracker.assertWritable();
    const docRef = doc(this.db, colName, id);
    try {
      if (colName === 'schedules') { await this.writeSchedules([], [id]); return; }
      if (colName === 'systemMetadata' && id === SCHEDULE_CALENDAR) return;
      await deleteDoc(docRef);
    } catch (err: any) {
      quotaTracker.notifyQuotaExceeded(err);
      throw err;
    }
  }

  /**
   * Writes many documents in batches (Firestore allows at most 500 writes per
   * batch). By default fields are merged into existing documents; with
   * { replace: true } each document is overwritten, so fields that were
   * removed from the item are removed from the database too.
   */
  async bulkUpsert<T extends CollectionName>(
    colName: T,
    items: EntityForCollection<T>[],
    options?: { replace?: boolean }
  ): Promise<void> {
    if (!items || items.length === 0) return;
    // Fail loudly instead of skipping, so the caller can tell the user nothing was saved.
    quotaTracker.assertWritable();
    try {
      if (colName === 'schedules') {
        // A roster import is all or nothing, including its date reservations.
        if (items.length >= BATCH_LIMIT) throw new Error('Import fewer than 450 rosters at a time.');
        await this.writeSchedules(items as Schedule[], [], options?.replace === true);
        return;
      }
      if (colName === 'systemMetadata') items = items.filter(item => item.id !== SCHEDULE_CALENDAR);
      for (let i = 0; i < items.length; i += BATCH_LIMIT) {
        const chunk = items.slice(i, i + BATCH_LIMIT);
        const batch = writeBatch(this.db);
        for (const item of chunk) {
          const docRef = doc(this.db, colName, (item as any).id);
          if (options?.replace) {
            batch.set(docRef, sanitizePayload(item));
          } else {
            batch.set(docRef, sanitizePayload(item), { merge: true });
          }
        }
        await batch.commit();
      }
    } catch (err: any) {
      quotaTracker.notifyQuotaExceeded(err);
      throw err;
    }
  }

  async bulkRemove<T extends CollectionName>(
    colName: T,
    ids: string[]
  ): Promise<void> {
    if (!ids || ids.length === 0) return;
    quotaTracker.assertWritable();
    try {
      if (colName === 'schedules') {
        for (let i = 0; i < ids.length; i += BATCH_LIMIT) await this.writeSchedules([], ids.slice(i, i + BATCH_LIMIT));
        return;
      }
      if (colName === 'systemMetadata') ids = ids.filter(id => id !== SCHEDULE_CALENDAR);
      for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
        const chunk = ids.slice(i, i + BATCH_LIMIT);
        const batch = writeBatch(this.db);
        for (const id of chunk) {
          const docRef = doc(this.db, colName, id);
          batch.delete(docRef);
        }
        await batch.commit();
      }
    } catch (err: any) {
      quotaTracker.notifyQuotaExceeded(err);
      throw err;
    }
  }

  async clearCollection<T extends CollectionName>(colName: T): Promise<void> {
    const items = await this.list(colName);
    const ids = items.map((item: any) => item?.id).filter(Boolean);
    if (ids.length > 0) {
      await this.bulkRemove(colName, ids);
    }
  }

  subscribe<T extends CollectionName>(
    colName: T,
    callback: SubscribeCallback<EntityForCollection<T>>,
    filter?: { field: string; operator: '=='; value: any },
    options?: { includeMetadataChanges?: boolean }
  ): Unsubscribe {
    const colRef = collection(this.db, colName);
    const target = filter ? query(colRef, where(filter.field, filter.operator, filter.value)) : colRef;
    return onSnapshot(
      target,
      { includeMetadataChanges: !!options?.includeMetadataChanges },
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as EntityForCollection<T>[];
        callback(items, { fromThisDevice: snapshot.metadata.hasPendingWrites });
      },
      (error) => {
        quotaTracker.notifyQuotaExceeded(error);
        console.warn(`[FirestoreRepository] Live updates for "${colName}" stopped:`, error.message);
      }
    );
  }
}
