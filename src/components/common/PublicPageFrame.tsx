/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The frame of the pages opened from a link without signing in (the read receipt page, the
 * published roster): a top bar with the app's name and the clinic, and the page under it
 * (UI overhaul Phase 5, slice 3).
 */

import React from 'react';
import { CalendarRange } from 'lucide-react';
import { cx } from '../ui';

export const PublicPageFrame: React.FC<{ clinicName?: string; wide?: boolean; children: React.ReactNode }> = ({ clinicName, wide, children }) => (
  <div className="min-h-dvh bg-canvas text-base text-ink">
    <header className="border-b border-line bg-surface">
      <div className={cx('mx-auto flex h-14 items-center gap-2.5 px-4', wide ? 'max-w-[1600px] sm:px-6' : 'max-w-xl')}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-white">
          <CalendarRange aria-hidden="true" className="size-5" />
        </span>
        <p className="shrink-0 font-bold">NSC Clinic Roster</p>
        {clinicName && <p className="min-w-0 flex-1 truncate text-right text-sm text-ink-muted">{clinicName}</p>}
      </div>
    </header>
    <main className={cx('mx-auto px-4 py-5', wide ? 'max-w-[1600px] sm:px-6' : 'max-w-xl')}>{children}</main>
  </div>
);

/** A message in the middle of a public page: an icon, a heading, the words and an optional action. */
export const PublicMessage: React.FC<{ icon: React.ReactNode; title: string; children?: React.ReactNode; action?: React.ReactNode; live?: boolean }> = ({
  icon,
  title,
  children,
  action,
  live,
}) => (
  <section role={live ? 'status' : undefined} className="space-y-3 rounded-xl border border-line bg-surface p-6 text-center shadow-card">
    <div className="mx-auto flex justify-center">{icon}</div>
    <h1 className="text-xl font-semibold">{title}</h1>
    {children && <div className="text-ink-muted">{children}</div>}
    {action && <div className="pt-1">{action}</div>}
  </section>
);
