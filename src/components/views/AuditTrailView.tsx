/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Audit trail (Phase 8): who changed what, newest first, 100 records at a time with "Load more"
 * (listPage, ordered by time only, so no new Firestore index is needed), and the total from a
 * count query. The filter and the search look through the records loaded so far. "What
 * changed" opens on the shared Dialog and lists the fields that changed, before and after,
 * with the full records under it. Words in services/audit/auditWords.ts.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Download, History, Search } from 'lucide-react';
import type { ClinicContextState } from '../../types/navigation';
import type { AuditEvent } from '../../types';
import { getRepository } from '../../services/repository';
import { countOf, listPage } from '../../services/repository/paging';
import { AUDIT_ACTIONS, actionWord, changedFields, entityWord, filterAudit, type AuditFilters } from '../../services/audit/auditWords';
import { formatDateTime, localTodayIso } from '../../utils/dateUtils';
import { toCsv, downloadCsv, CsvValue } from '../../utils/csv';
import { Button, Card, DataTable, Dialog, EmptyState, ErrorState, Field, Input, LoadingState, PageHeader, Select, type Column } from '../ui';

/** Records read at a time. */
export const AUDIT_PAGE_SIZE = 100;

interface AuditTrailViewProps {
  context: ClinicContextState;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = () => {
  const repo = getRepository();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [cursor, setCursor] = useState<unknown>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<AuditFilters>({ action: 'ALL', search: '' });
  const [open, setOpen] = useState<AuditEvent | null>(null);

  const load = async (from?: unknown) => {
    setLoading(true);
    setError('');
    try {
      const page = await listPage(repo, 'audit', { orderBy: 'timestamp', direction: 'desc', limit: AUDIT_PAGE_SIZE, cursor: from });
      setEvents((prev) => (from === undefined ? page.items : [...prev, ...page.items]));
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // The total is only shown beside the list: a count that fails leaves it out.
    countOf(repo, 'audit')
      .then(setTotal)
      .catch(() => setTotal(null));
  }, []);

  const shown = useMemo(() => filterAudit(events, filters), [events, filters]);
  const filtering = filters.action !== 'ALL' || filters.search.trim() !== '';

  // The file keeps its column names; it holds the records shown.
  const handleExportCsv = () => {
    const rows: CsvValue[][] = shown.map((ev) => [ev.timestamp, ev.actor, ev.action, ev.entity, ev.entityId, ev.note || '']);
    downloadCsv(`audit_trail_${localTodayIso()}.csv`, toCsv([['Timestamp', 'Actor', 'Action', 'Entity', 'Entity ID', 'Note'], ...rows]));
  };

  const columns: Column<AuditEvent>[] = [
    { key: 'when', header: 'When', sortValue: (ev) => ev.timestamp, cell: (ev) => <span className="whitespace-nowrap font-normal">{formatDateTime(ev.timestamp)}</span> },
    { key: 'who', header: 'Who', sortValue: (ev) => ev.actor, cell: (ev) => <span className="break-all">{ev.actor}</span> },
    { key: 'what', header: 'What', sortValue: (ev) => actionWord(ev.action), cell: (ev) => actionWord(ev.action) },
    { key: 'record', header: 'Record', sortValue: (ev) => entityWord(ev.entity), cell: (ev) => entityWord(ev.entity) },
    { key: 'note', header: 'Note', cell: (ev) => <span className="text-ink-muted">{ev.note || 'No note'}</span> },
    {
      key: 'open',
      header: 'What changed',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (ev) =>
        ev.before !== undefined || ev.after !== undefined ? (
          <Button size="sm" onClick={() => setOpen(ev)} aria-label={`What changed for ${entityWord(ev.entity)} on ${formatDateTime(ev.timestamp)}`}>
            What changed
          </Button>
        ) : null,
    },
  ];

  const changes = open ? changedFields(open.before, open.after) : [];
  const countWords =
    total !== null && total > events.length ? `The newest ${events.length} of ${total} records` : `${events.length} ${events.length === 1 ? 'record' : 'records'}`;

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6">
      <PageHeader
        title="Audit trail"
        meta={<span>Who changed what, newest first: rosters, shifts, pinned days, requests and sent rosters.</span>}
        actions={
          <Button icon={Download} onClick={handleExportCsv} disabled={shown.length === 0}>
            Download (CSV)
          </Button>
        }
      />

      <div role="search" aria-label="Filter the audit trail" className="grid grid-cols-1 gap-3 rounded-lg border border-line bg-surface p-3 shadow-card sm:grid-cols-2">
        <Field label="Search" hint="Who, the record or the note">
          {(p) => (
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted" />
              <Input {...p} type="search" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} className="pl-8" />
            </div>
          )}
        </Field>
        <Field label="Kind of change">
          {(p) => (
            <Select {...p} value={filters.action} onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value as AuditFilters['action'] }))}>
              <option value="ALL">All changes</option>
              {AUDIT_ACTIONS.map((a) => (
                <option key={a} value={a}>
                  {actionWord(a)}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Card
        title="Changes"
        actions={<span className="text-sm text-ink-muted">{filtering ? `${shown.length} found in ${countWords.toLowerCase()}` : countWords}</span>}
        bodyClassName=""
      >
        {error && events.length === 0 ? (
          <ErrorState title="The audit trail could not be loaded" onRetry={() => load()}>
            {error}
          </ErrorState>
        ) : loading && events.length === 0 ? (
          <LoadingState label="Loading the audit trail…" />
        ) : (
          <>
            {filtering && hasMore && (
              <p className="border-b border-line px-4 py-2 text-sm text-ink-muted">The search and the filter look through the records loaded. Load more to look further back.</p>
            )}
            <DataTable
              caption="Changes"
              columns={columns}
              rows={shown}
              rowKey={(ev) => ev.id}
              empty={
                <EmptyState icon={History} title={events.length ? 'No change matches' : 'No changes yet'}>
                  {events.length ? 'Change the search or the filter, or load more.' : 'Changes appear here as rosters are made, published and changed.'}
                </EmptyState>
              }
            />
            {(hasMore || error) && (
              <div className="flex flex-wrap items-center justify-center gap-3 border-t border-line p-3">
                {error && <span className="text-sm font-semibold text-danger">Could not load more: {error}</span>}
                <Button busy={loading} onClick={() => load(cursor)}>
                  {error ? 'Try again' : `Load ${AUDIT_PAGE_SIZE} more`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      <Dialog
        open={!!open}
        onClose={() => setOpen(null)}
        size="lg"
        title="What changed"
        description={open ? `${actionWord(open.action)}: ${entityWord(open.entity)}, by ${open.actor} on ${formatDateTime(open.timestamp)}.` : undefined}
        footer={
          <Button variant="primary" onClick={() => setOpen(null)}>
            Done
          </Button>
        }
      >
        {open && (
          <div className="space-y-4 text-sm">
            {open.note && <p className="rounded-lg bg-sunken px-3 py-2 text-ink">{open.note}</p>}
            {changes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <caption className="sr-only">Fields that changed</caption>
                  <thead className="bg-sunken text-xs font-semibold text-ink-muted">
                    <tr>
                      <th scope="col" className="px-3 py-2">Field</th>
                      <th scope="col" className="px-3 py-2">Before</th>
                      <th scope="col" className="px-3 py-2">After</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {changes.map((c) => (
                      <tr key={c.field}>
                        <th scope="row" className="px-3 py-2 align-top font-semibold">{c.field}</th>
                        <td className="max-w-xs px-3 py-2 align-top break-words text-ink-muted">{c.before}</td>
                        <td className="max-w-xs px-3 py-2 align-top break-words">{c.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-ink-muted">No field changed.</p>
            )}
            <details className="rounded-lg border border-line">
              <summary className="cursor-pointer px-3 py-2 font-semibold">The records as saved</summary>
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
                {(['before', 'after'] as const).map((side) => (
                  <div key={side} className="min-w-0 space-y-1">
                    <p className="text-xs font-semibold text-ink-muted">{side === 'before' ? 'Before' : 'After'}</p>
                    <pre className="max-h-60 overflow-auto rounded bg-sunken p-3 font-mono text-xs text-ink">
                      {open[side] === undefined ? (side === 'before' ? 'Nothing before' : 'Nothing after') : JSON.stringify(open[side], null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </Dialog>
    </div>
  );
};
