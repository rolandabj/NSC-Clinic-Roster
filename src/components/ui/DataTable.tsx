/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A table of records: a sunken header row (which stays in view when the table has a
 * maxHeight), columns that sort when their header is clicked, the first column as each row's
 * header, and on a phone one card for each row instead of a table that runs off the screen.
 *
 *   <DataTable caption="Requests from nurses" rows={requests} rowKey={(r) => r.id} columns={[
 *     { key: 'nurse', header: 'Nurse', cell: (r) => r.nurse, sortValue: (r) => r.nurse },
 *     { key: 'actions', header: 'Decision', hideHeader: true, phone: 'actions', cell: (r) => ... },
 *   ]} />
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { cx } from './cx';

export type SortDirection = 'ascending' | 'descending';
export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Makes the column sortable by this value. */
  sortValue?: (row: T) => string | number | null | undefined;
  align?: 'left' | 'right';
  /** The header is read out but not shown (for a column of buttons). */
  hideHeader?: boolean;
  /**
   * On a phone: 'title' is the card's heading (the first column by default), 'detail' a
   * labelled line (the default), 'actions' the card's foot, 'hide' left out.
   */
  phone?: 'title' | 'detail' | 'actions' | 'hide';
  className?: string;
}

/**
 * The rows in the order of the sorted column: numbers by size, words alphabetically (2 before
 * 10, upper and lower case alike), empty values last whichever the direction. Ties keep their
 * order. With no sort, or a column that cannot sort, the rows stay as they are.
 */
export function sortRows<T>(rows: T[], columns: Column<T>[], sort: SortState | null): T[] {
  const column = sort && columns.find((c) => c.key === sort.key);
  if (!column?.sortValue) return rows;
  const valueOf = column.sortValue;
  const sign = sort!.direction === 'ascending' ? 1 : -1;
  return rows
    .map((row, index) => ({ row, index, value: valueOf(row) }))
    .sort((a, b) => {
      const aEmpty = a.value === null || a.value === undefined || a.value === '';
      const bEmpty = b.value === null || b.value === undefined || b.value === '';
      if (aEmpty || bEmpty) return aEmpty === bEmpty ? a.index - b.index : aEmpty ? 1 : -1;
      const order =
        typeof a.value === 'number' && typeof b.value === 'number'
          ? a.value - b.value
          : String(a.value).localeCompare(String(b.value), 'en', { numeric: true, sensitivity: 'base' });
      return order * sign || a.index - b.index;
    })
    .map((x) => x.row);
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  initialSort = null,
  empty,
  maxHeight,
  className,
}: {
  /** Read out as the table's name. */
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  initialSort?: SortState | null;
  /** Shown instead of the table when there are no rows (an EmptyState). */
  empty?: React.ReactNode;
  /** A height such as '28rem': the table scrolls inside it and its header stays in view. */
  maxHeight?: string;
  className?: string;
}) {
  const [sort, setSort] = useState<SortState | null>(initialSort);
  if (rows.length === 0 && empty) return <>{empty}</>;
  const sorted = sortRows(rows, columns, sort);
  const toggle = (key: string) =>
    setSort((s) => (s?.key === key ? { key, direction: s.direction === 'ascending' ? 'descending' : 'ascending' } : { key, direction: 'ascending' }));
  const phoneRole = (c: Column<T>, i: number) => c.phone ?? (i === 0 ? 'title' : 'detail');

  return (
    <div className={className}>
      <div className="hidden overflow-auto sm:block" style={maxHeight ? { maxHeight } : undefined}>
        <table className="w-full text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className={cx('bg-sunken text-left text-xs font-semibold text-ink-muted', maxHeight && 'sticky top-0 z-10')}>
            <tr>
              {columns.map((c) => {
                const sortedHere = sort?.key === c.key ? sort.direction : undefined;
                const Arrow = sortedHere === 'ascending' ? ChevronUp : sortedHere === 'descending' ? ChevronDown : ChevronsUpDown;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={c.sortValue ? sortedHere || 'none' : undefined}
                    className={cx('border-b border-line px-3 py-2 whitespace-nowrap', c.align === 'right' && 'text-right')}
                  >
                    {c.hideHeader ? (
                      <span className="sr-only">{c.header}</span>
                    ) : c.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggle(c.key)}
                        className={cx('-mx-1 -my-1 inline-flex min-h-6 items-center gap-1 rounded px-1 hover:text-ink', c.align === 'right' && 'flex-row-reverse')}
                      >
                        {c.header}
                        <Arrow aria-hidden="true" className={cx('size-3.5', !sortedHere && 'opacity-50')} />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((row) => (
              <tr key={rowKey(row)} className="h-11 hover:bg-sunken">
                {columns.map((c, i) => {
                  const Cell = i === 0 ? 'th' : 'td';
                  return (
                    <Cell
                      key={c.key}
                      scope={i === 0 ? 'row' : undefined}
                      className={cx(
                        'px-3 py-1.5 align-middle',
                        i === 0 ? 'text-left font-semibold text-ink' : 'text-ink',
                        c.align === 'right' && 'text-right tabular-nums',
                        c.className
                      )}
                    >
                      {c.cell(row)}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul aria-label={caption} className="divide-y divide-line sm:hidden">
        {sorted.map((row) => (
          <li key={rowKey(row)} className="space-y-2 px-4 py-3">
            {columns.map((c, i) =>
              phoneRole(c, i) === 'title' ? (
                <div key={c.key} className="font-semibold text-ink">
                  {c.cell(row)}
                </div>
              ) : null
            )}
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              {columns.map((c, i) =>
                phoneRole(c, i) === 'detail' ? (
                  <React.Fragment key={c.key}>
                    <dt className="text-ink-muted">{c.header}</dt>
                    <dd className="min-w-0 text-ink">{c.cell(row)}</dd>
                  </React.Fragment>
                ) : null
              )}
            </dl>
            {columns.map((c, i) =>
              phoneRole(c, i) === 'actions' ? (
                <div key={c.key} className="flex flex-wrap gap-2">
                  {c.cell(row)}
                </div>
              ) : null
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
