/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A box with a message inside a screen or dialog: its icon, a bold first line, more text if
 * needed, and an optional action. For a short message that closes by itself, use notify().
 */

import React from 'react';
import { CircleCheck, Info, OctagonAlert, TriangleAlert } from 'lucide-react';
import { cx } from './cx';

export type NoticeKind = 'info' | 'warning' | 'danger' | 'success';

const KINDS: Record<NoticeKind, { icon: typeof Info; box: string; ink: string }> = {
  info: { icon: Info, box: 'border-info/30 bg-info-soft', ink: 'text-info' },
  warning: { icon: TriangleAlert, box: 'border-warning-line/40 bg-warning-soft', ink: 'text-warning' },
  danger: { icon: OctagonAlert, box: 'border-danger-line/40 bg-danger-soft', ink: 'text-danger' },
  success: { icon: CircleCheck, box: 'border-success/30 bg-success-soft', ink: 'text-success' },
};

export const Notice: React.FC<{
  tone?: NoticeKind;
  title: React.ReactNode;
  action?: React.ReactNode;
  /** Read out as soon as it appears (for a message shown after something happened). */
  live?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ tone = 'info', title, action, live, className, children }) => {
  const { icon: Icon, box, ink } = KINDS[tone];
  return (
    <div
      role={live ? (tone === 'danger' ? 'alert' : 'status') : undefined}
      className={cx('flex flex-wrap items-start gap-3 rounded-lg border px-4 py-3 text-sm', box, className)}
    >
      <Icon aria-hidden="true" className={cx('mt-0.5 size-5 shrink-0', ink)} />
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-ink">{title}</div>
        {children && <div className="mt-0.5 text-ink-muted">{children}</div>}
      </div>
      {action}
    </div>
  );
};
