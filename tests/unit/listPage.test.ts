import test from 'node:test';
import assert from 'node:assert/strict';
import { listPage, pageFromList } from '../../src/services/repository/paging';

// One page at a time (Phase 7, slice 6b): the email log shows 25 sends, newest first, with
// "Show 25 more". Repositories that cannot page (the test page, the tests) fall back to the list.

const logs = Array.from({ length: 60 }, (_, i) => ({ id: `log${String(i).padStart(2, '0')}`, sentAt: `2026-11-${String((i % 28) + 1).padStart(2, '0')}T08:00:00Z` }));

test('a page holds the newest first, and says whether more are kept', () => {
  const first = pageFromList(logs, { orderBy: 'sentAt', direction: 'desc', limit: 25 });
  assert.equal(first.items.length, 25);
  assert.equal(first.hasMore, true);
  for (let i = 1; i < first.items.length; i++) assert.ok(first.items[i - 1].sentAt >= first.items[i].sentAt);
});

test('the next page carries on after the last one, with no record twice or missed', () => {
  const seen: string[] = [];
  let page = pageFromList(logs, { orderBy: 'sentAt', direction: 'desc', limit: 25 });
  seen.push(...page.items.map((x) => x.id));
  while (page.hasMore) {
    page = pageFromList(logs, { orderBy: 'sentAt', direction: 'desc', limit: 25, cursor: page.cursor });
    seen.push(...page.items.map((x) => x.id));
  }
  assert.equal(seen.length, 60);
  assert.equal(new Set(seen).size, 60);
});

test('the last page says no more are kept', () => {
  const page = pageFromList(logs.slice(0, 10), { orderBy: 'sentAt', direction: 'asc', limit: 25 });
  assert.equal(page.items.length, 10);
  assert.equal(page.hasMore, false);
});

test('a repository without paging is read in full and paged here', async () => {
  const repo = { list: async () => logs } as any;
  const page = await listPage(repo, 'emailLog', { orderBy: 'sentAt', direction: 'desc', limit: 25 });
  assert.equal(page.items.length, 25);
  assert.equal(page.hasMore, true);
});

test('a repository that pages is asked for the page', async () => {
  let asked: any = null;
  const repo = {
    list: async () => assert.fail('the whole list should not be read'),
    listPage: async (col: string, req: any) => {
      asked = { col, ...req };
      return { items: logs.slice(0, 25), hasMore: true, cursor: 'c1' };
    },
  } as any;
  const page = await listPage(repo, 'emailLog', { orderBy: 'sentAt', direction: 'desc', limit: 25 });
  assert.equal(page.items.length, 25);
  assert.deepEqual(asked, { col: 'emailLog', orderBy: 'sentAt', direction: 'desc', limit: 25 });
});
