// Test page only: an in memory database with live listeners, as window.__repo.
// window.__repo.col('assignments') reads what was saved; failWrites = true makes saves fail.
import { seed } from './seed';

type Listener = { col: string; filter?: { field: string; value: any }; cb: (items: any[], info: any) => void };
const clone = (x: any) => JSON.parse(JSON.stringify(x));

class MemoryRepo {
  data: Record<string, Map<string, any>> = {};
  listeners: Listener[] = [];
  failWrites = false;
  writes = 0;

  constructor(initial: Record<string, any[]>) {
    for (const [c, items] of Object.entries(initial)) this.data[c] = new Map(items.map((x) => [x.id, clone(x)]));
  }
  col(c: string) {
    return (this.data[c] ||= new Map());
  }
  items(c: string, filter?: { field: string; value: any }) {
    const all = [...this.col(c).values()].map(clone);
    return filter ? all.filter((x) => x[filter.field] === filter.value) : all;
  }
  notify(c: string) {
    for (const l of this.listeners.filter((x) => x.col === c)) setTimeout(() => l.cb(this.items(c, l.filter), { fromThisDevice: false }), 20);
  }
  check() {
    if (this.failWrites) throw new Error('Quota used up (test)');
    this.writes++;
  }
  async list(c: string, filter?: any) {
    return this.items(c, filter);
  }
  async get(c: string, id: string) {
    const x = this.col(c).get(id);
    return x ? clone(x) : null;
  }
  async create(c: string, d: any) {
    this.check();
    const id = d.id || `${c}-${Math.random().toString(36).slice(2, 9)}`;
    this.col(c).set(id, clone({ ...d, id }));
    this.notify(c);
    return clone({ ...d, id });
  }
  async update(c: string, id: string, d: any) {
    this.check();
    const n = { ...(this.col(c).get(id) || {}), ...clone(d), id };
    this.col(c).set(id, n);
    this.notify(c);
    return clone(n);
  }
  async remove(c: string, id: string) {
    this.check();
    this.col(c).delete(id);
    this.notify(c);
  }
  async bulkUpsert(c: string, items: any[], o?: any) {
    if (!items.length) return;
    this.check();
    for (const x of items) this.col(c).set(x.id, clone(o?.replace ? x : { ...(this.col(c).get(x.id) || {}), ...x }));
    this.notify(c);
  }
  async bulkRemove(c: string, ids: string[]) {
    if (!ids.length) return;
    this.check();
    for (const id of ids) this.col(c).delete(id);
    this.notify(c);
  }
  async bulkWrite(c: string, ch: { upserts: any[]; removeIds: string[] }) {
    this.check();
    for (const x of ch.upserts) this.col(c).set(x.id, clone(x));
    for (const id of ch.removeIds) this.col(c).delete(id);
    this.notify(c);
  }
  async clearCollection(c: string) {
    this.col(c).clear();
    this.notify(c);
  }
  subscribe(c: string, cb: any, filter?: any) {
    const l = { col: c, filter, cb };
    this.listeners.push(l);
    setTimeout(() => cb(this.items(c, filter), { fromThisDevice: false }), 20);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== l);
    };
  }
}

const repo = new MemoryRepo(seed);
(window as any).__repo = repo;

export const getRepository = () => repo as any;
export const repositoryManager = { getRepo: () => repo, getMode: () => 'FIRESTORE', getIsCloudMode: () => true };
export class FirestoreRepository {}
