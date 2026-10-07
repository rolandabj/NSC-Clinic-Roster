/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * What a list or screen shows when it has nothing yet, while it loads, and when loading
 * failed (with Try again).
 */

import React from 'react';
import { Inbox, Loader2, OctagonAlert, RotateCcw, type LucideIcon } from 'lucide-react';
import { Button } from './Button';

export const EmptyState: React.FC<{
  icon?: LucideIcon;
  title: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ icon: Icon = Inbox, title, action, children }) => (
  <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
    <span className="flex size-12 items-center justify-center rounded-full bg-sunken text-ink-muted">
      <Icon aria-hidden="true" className="size-6" />
    </span>
    <p className="font-semibold text-ink">{title}</p>
    {children && <div className="max-w-md text-sm text-ink-muted">{children}</div>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div role="status" className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-ink-muted">
    <Loader2 aria-hidden="true" className="size-5 animate-spin text-brand" />
    {label}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  /** Shown with a Try again button that runs this. */
  onRetry?: () => void;
  retryLabel?: string;
  children?: React.ReactNode;
}> = ({ title = 'This could not be loaded', onRetry, retryLabel = 'Try again', children }) => (
  <div role="alert" className="flex flex-col items-center gap-2 px-4 py-10 text-center">
    <span className="flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
      <OctagonAlert aria-hidden="true" className="size-6" />
    </span>
    <p className="font-semibold text-ink">{title}</p>
    {children && <div className="max-w-md text-sm text-ink-muted">{children}</div>}
    {onRetry && (
      <Button icon={RotateCcw} onClick={onRetry} className="mt-2">
        {retryLabel}
      </Button>
    )}
  </div>
);
