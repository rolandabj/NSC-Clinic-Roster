/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Short status words (Waiting, Approved, Draft) and the roster's problem marks. A status is
 * never shown by colour alone: each badge has its word, and its icon where it has one.
 */

import React from 'react';
import { Info, OctagonAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import { cx } from './cx';

export type Tone = 'neutral' | 'brand' | 'danger' | 'warning' | 'success' | 'info';

/** Background and text of each tone; every pair reads at 4.5:1 or more. */
export const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-sunken text-ink-muted',
  brand: 'bg-brand-soft text-brand-strong',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
  success: 'bg-success-soft text-success',
  info: 'bg-info-soft text-info',
};

export const Badge: React.FC<{ tone?: Tone; icon?: LucideIcon; className?: string; children: React.ReactNode }> = ({
  tone = 'neutral',
  icon: Icon,
  className,
  children,
}) => (
  <span className={cx('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap', TONE_CLASSES[tone], className)}>
    {Icon && <Icon aria-hidden="true" className="size-3.5 shrink-0" />}
    {children}
  </span>
);

/** The roster's three kinds of problem, each with its own shape, colour and word. */
export const PROBLEM_MARKS = {
  must: { word: 'Must fix', icon: OctagonAlert, tone: 'danger', text: 'text-danger' },
  check: { word: 'Check', icon: TriangleAlert, tone: 'warning', text: 'text-warning' },
  note: { word: 'Note', icon: Info, tone: 'info', text: 'text-info' },
} as const satisfies Record<string, { word: string; icon: LucideIcon; tone: Tone; text: string }>;

export type ProblemKind = keyof typeof PROBLEM_MARKS;

/** "Must fix", "Check" or "Note" with its icon; children replace the word (e.g. "2 must fix"). */
export const ProblemBadge: React.FC<{ kind: ProblemKind; children?: React.ReactNode }> = ({ kind, children }) => {
  const mark = PROBLEM_MARKS[kind];
  return (
    <Badge tone={mark.tone} icon={mark.icon}>
      {children ?? mark.word}
    </Badge>
  );
};
