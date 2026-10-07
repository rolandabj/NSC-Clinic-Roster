import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Send, X } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  DataTable,
  DateInput,
  Dialog,
  ErrorState,
  Field,
  IconButton,
  Input,
  LoadingState,
  Notice,
  PageHeader,
  ProblemBadge,
  Switch,
  TabPanel,
  Tabs,
  nextTabIndex,
  sortRows,
  type Column,
} from '../../src/components/ui';

// The shared parts of the approved look (UI overhaul Phase 2): what screen readers and the
// keyboard get from each, so screens built from them start out accessible.

const h = React.createElement;
const html = (el: React.ReactElement) => renderToStaticMarkup(el);

test('a button is a plain button unless asked, hides its icon from screen readers, and is held while busy', () => {
  const plain = html(h(Button, { icon: Send }, 'Publish'));
  assert.match(plain, /^<button type="button"/);
  assert.match(plain, /<svg[^>]*aria-hidden="true"/);
  assert.match(html(h(Button, { type: 'submit' }, 'Save')), /type="submit"/);
  const busy = html(h(Button, { busy: true }, 'Saving'));
  assert.match(busy, /disabled=""/);
  assert.match(busy, /aria-busy="true"/);
  assert.match(busy, /animate-spin/);
});

test('an icon button is named by its label, which is also its tooltip', () => {
  const out = html(h(IconButton, { label: 'Close menu', icon: X }));
  assert.match(out, /aria-label="Close menu"/);
  assert.match(out, /title="Close menu"/);
});

test('badges carry their word; problem badges their word and icon', () => {
  assert.match(html(h(Badge, { tone: 'success', children: 'Approved' })), />Approved<\/span>$/);
  const must = html(h(ProblemBadge, { kind: 'must' }));
  assert.match(must, /Must fix/);
  assert.match(must, /<svg/);
  assert.match(html(h(ProblemBadge, { kind: 'check' }, '2 to check')), /2 to check/);
});

test('a field links its label, hint and error to the input, and marks the input wrong only with an error', () => {
  const ok = html(h(Field, { label: 'Note', hint: 'The nurse sees it', optional: true, children: (p) => h(Input, p) }));
  const id = ok.match(/<label for="([^"]+)"/)![1];
  assert.match(ok, new RegExp(`<input id="${id}" aria-describedby="${id}-hint"`));
  assert.doesNotMatch(ok, /aria-invalid/);
  assert.match(ok, /\(optional\)/);
  const bad = html(h(Field, { label: 'Last day', hint: 'DD-MM-YYYY', error: 'The last day is before the first day.', children: (p) => h(Input, p) }));
  const badId = bad.match(/<label for="([^"]+)"/)![1];
  assert.match(bad, new RegExp(`aria-describedby="${badId}-hint ${badId}-error" aria-invalid="true"`));
  assert.match(bad, new RegExp(`<p id="${badId}-error"[^>]*>.*The last day is before the first day\\.</p>`));
});

test('a date field shows the date as DD-MM-YYYY and offers the calendar on a named button', () => {
  const out = html(h(DateInput, { id: 'd', value: '2026-12-21', onChange: () => {} }));
  assert.match(out, /value="21-12-2026"/);
  assert.match(out, /placeholder="DD-MM-YYYY"/);
  assert.match(out, /aria-label="Choose from a calendar"/);
  assert.match(out, /type="date" tabindex="-1" aria-hidden="true"/);
});

test('a switch says whether it is on', () => {
  assert.match(html(h(Switch, { label: 'Email nurses', checked: true, onChange: () => {} })), /role="switch" aria-checked="true"/);
  assert.match(html(h(Switch, { label: 'Email nurses', checked: false, onChange: () => {} })), /aria-checked="false"/);
});

test('tabs follow the ARIA pattern: one Tab stop, each tab tied to its panel', () => {
  const tabs = [
    { id: 'roster', label: 'Roster' },
    { id: 'problems', label: 'Problems', count: 5 },
  ];
  const out = html(h(Tabs, { label: 'Roster sheets', idPrefix: 's', value: 'problems', onChange: () => {}, tabs }));
  assert.match(out, /role="tablist" aria-label="Roster sheets"/);
  assert.match(out, /id="s-tab-roster" aria-selected="false" aria-controls="s-panel-roster" tabindex="-1"/);
  assert.match(out, /id="s-tab-problems" aria-selected="true" aria-controls="s-panel-problems" tabindex="0"/);
  const panel = html(h(TabPanel, { idPrefix: 's', id: 'roster', value: 'problems', children: 'grid' }));
  assert.match(panel, /role="tabpanel" id="s-panel-roster" aria-labelledby="s-tab-roster" hidden=""/);
});

test('arrow keys move round the tabs, Home and End go to the ends, other keys are left alone', () => {
  assert.equal(nextTabIndex('ArrowRight', 2, 3), 0);
  assert.equal(nextTabIndex('ArrowLeft', 0, 3), 2);
  assert.equal(nextTabIndex('Home', 2, 3), 0);
  assert.equal(nextTabIndex('End', 0, 3), 2);
  assert.equal(nextTabIndex('Enter', 1, 3), null);
});

test('a closed dialog renders nothing; an open one is a named modal dialog', () => {
  assert.equal(html(h(Dialog, { open: false, onClose: () => {}, title: 'Publish?', children: 'x' })), '');
  const out = html(h(Dialog, { open: true, onClose: () => {}, title: 'Publish the November roster?', description: 'Six nurses get an email.', children: 'x' }));
  const titleId = out.match(/<h2 id="([^"]+)"/)![1];
  assert.match(out, new RegExp(`role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-describedby="`));
  assert.match(out, /aria-label="Close"/);
  assert.match(html(h(Dialog, { open: true, onClose: () => {}, title: 'Delete?', role: 'alertdialog', children: 'x' })), /role="alertdialog"/);
});

test('cards and page headers give the right headings', () => {
  assert.match(html(h(PageHeader, { title: 'November roster', breadcrumb: [{ label: 'Rosters', onClick: () => {} }, { label: 'November' }] })), /<nav aria-label="Breadcrumb">.*<span aria-current="page">November<\/span>.*<h1/);
  const card = html(h(Card, { title: 'Requests', children: 'rows' }));
  const headingId = card.match(/<h2 id="([^"]+)"/)![1];
  assert.match(card, new RegExp(`<section aria-labelledby="${headingId}"`));
  assert.match(html(h(Card, { title: 'Hours', headingLevel: 3, children: 'x' })), /<h3 /);
});

test('loading is read out politely, a failure at once with Try again', () => {
  assert.match(html(h(LoadingState, {})), /role="status"/);
  const err = html(h(ErrorState, { onRetry: () => {} }, 'The network is down.'));
  assert.match(err, /role="alert"/);
  assert.match(err, /Try again/);
  assert.doesNotMatch(html(h(Notice, { title: 'Saved' })), /role=/);
  assert.match(html(h(Notice, { tone: 'danger', title: 'Not saved', live: true })), /role="alert"/);
});

interface Row {
  name: string;
  hours: number | null;
}
const columns: Column<Row>[] = [
  { key: 'name', header: 'Nurse', cell: (r) => r.name, sortValue: (r) => r.name },
  { key: 'hours', header: 'Hours', cell: (r) => r.hours, sortValue: (r) => r.hours, align: 'right' },
  { key: 'actions', header: 'Decision', cell: () => 'Approve', hideHeader: true, phone: 'actions' },
];

test('rows sort by number or by word, with empty values last either way and ties kept in order', () => {
  const rows: Row[] = [
    { name: 'nina', hours: 10 },
    { name: 'Amy', hours: null },
    { name: 'mary 2', hours: 2 },
    { name: 'Mary 10', hours: 10 },
  ];
  const names = (sorted: Row[]) => sorted.map((r) => r.name);
  assert.deepEqual(names(sortRows(rows, columns, { key: 'hours', direction: 'ascending' })), ['mary 2', 'nina', 'Mary 10', 'Amy']);
  assert.deepEqual(names(sortRows(rows, columns, { key: 'hours', direction: 'descending' })), ['nina', 'Mary 10', 'mary 2', 'Amy']);
  assert.deepEqual(names(sortRows(rows, columns, { key: 'name', direction: 'ascending' })), ['Amy', 'mary 2', 'Mary 10', 'nina']);
  assert.deepEqual(names(sortRows(rows, columns, null)), names(rows));
  assert.deepEqual(names(sortRows(rows, columns, { key: 'actions', direction: 'ascending' })), names(rows));
});

test('a table names itself, marks its sorted column, and has a card for each row on a phone', () => {
  const rows: Row[] = [
    { name: 'Amy', hours: 80 },
    { name: 'Mary', hours: 72 },
  ];
  const out = html(h(DataTable<Row>, { caption: 'Hours for each nurse', columns, rows, rowKey: (r) => r.name, initialSort: { key: 'hours', direction: 'descending' } }));
  assert.match(out, /<caption class="sr-only">Hours for each nurse<\/caption>/);
  assert.match(out, /<th scope="col" aria-sort="none"[^>]*><button type="button"[^>]*>Nurse/);
  assert.match(out, /<th scope="col" aria-sort="descending"/);
  assert.match(out, /<span class="sr-only">Decision<\/span>/);
  assert.match(out, /<th scope="row"[^>]*>Amy<\/th>/);
  assert.match(out, /<ul aria-label="Hours for each nurse" class="divide-y divide-line sm:hidden">/);
  assert.match(out, /<dt class="text-ink-muted">Hours<\/dt><dd class="min-w-0 text-ink">80<\/dd>/);
  const empty = html(h(DataTable<Row>, { caption: 'x', columns, rows: [], rowKey: (r) => r.name, empty: h('p', null, 'No nurses yet') }));
  assert.equal(empty, '<p>No nurses yet</p>');
});
