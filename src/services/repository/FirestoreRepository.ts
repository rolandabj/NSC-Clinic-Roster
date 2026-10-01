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
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CollectionName, EntityForCollection } from '../../types';
import { IRepository, SubscribeCallback, Unsubscribe } from './IRepository';
import { quotaTracker } from '../firebase/quotaTracker';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LiveCollectionCache } from './liveCollectionCache';

// Firestore allows at most 500 writes in one batch; stay safely below it.
const BATCH_LIMIT = 450;

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
      await setDoc(docRef, cleanData, { merge: true });
      const cached = this.cache.getDoc(colName, id);
      if (cached?.item) return cached.item as EntityForCollection<T>;
      const snap = await getDoc(docRef);
      return { id: snap.id, ...snap.data() } as EntityForCollection<T>;
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
    callback: SubscribeCallback<EntityForCollection<T>>
  ): Unsubscribe {
    const colRef = collection(this.db, colName);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as EntityForCollection<T>[];
        callback(items);
      },
      (error) => {
        quotaTracker.notifyQuotaExceeded(error);
        console.warn(`[FirestoreRepository] Live updates for "${colName}" stopped:`, error.message);
      }
    );
  }
}
