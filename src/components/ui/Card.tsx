/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The page header (breadcrumb, title, a line of facts, actions) and the card that holds each
 * part of a screen, with its heading and actions.
 */

import React, { useId } from 'react';
import { ChevronRight } from 'lucide-react';
import { cx } from './cx';

export interface Crumb {
  label: string;
  /** Opens that screen; the last crumb is the current page and has none. */
  onClick?: () => void;
}

export const PageHeader: React.FC<{
  title: React.ReactNode;
  breadcrumb?: Crumb[];
  /** One line under the title: dates, a status badge, the save state. */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, breadcrumb, meta, actions }) => (
  <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
    <div className="min-w-0">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
            {breadcrumb.map((crumb, i) => {
              const last = i === breadcrumb.length - 1;
              return (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight aria-hidden="true" className="size-4" />}
                  {crumb.onClick && !last ? (
                    <button type="button" onClick={crumb.onClick} className="rounded py-0.5 hover:text-ink hover:underline">
                      {crumb.label}
                    </button>
                  ) : (
                    <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      <h1 className="mt-0.5 text-2xl font-semibold text-ink">{title}</h1>
      {meta && <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">{meta}</div>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Card: React.FC<{
  title?: React.ReactNode;
  /** Buttons or links at the right of the card's heading. */
  actions?: React.ReactNode;
  /** 3 for a card inside a section that already has a heading. */
  headingLevel?: 2 | 3;
  className?: string;
  /** The space inside the card; tables and lists that run to the edges pass ''. */
  bodyClassName?: string;
  children: React.ReactNode;
}> = ({ title, actions, headingLevel = 2, className, bodyClassName = 'p-4', children }) => {
  const headingId = useId();
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return (
    <section aria-labelledby={title ? headingId : undefined} className={cx('rounded-lg border border-line bg-surface shadow-card', className)}>
      {title && (
        <header className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
          <Heading id={headingId} className="text-base font-semibold text-ink">
            {title}
          </Heading>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
};
