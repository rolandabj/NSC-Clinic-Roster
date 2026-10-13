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

/**
 * The one problem count: each kind with its icon, number and word ("28 must fix", "6 to check",
 * "3 notes"), kinds with none left out. `wordsFrom: 'md'` shows only the icons and numbers
 * below 768 px (`'xl'`: below 1280 px); screen readers always hear the words. `none` is shown when there are no problems.
 */
export const ProblemCounts: React.FC<{ mustFix: number; toCheck: number; notes: number; wordsFrom?: 'md' | 'xl'; none?: string; className?: string }> = ({
  mustFix,
  toCheck,
  notes,
  wordsFrom,
  none = 'No problems',
  className,
}) => {
  const items = [
    { kind: 'must' as const, n: mustFix, word: 'must fix' },
    { kind: 'check' as const, n: toCheck, word: 'to check' },
    { kind: 'note' as const, n: notes, word: notes === 1 ? 'note' : 'notes' },
  ].filter((i) => i.n > 0);
  if (items.length === 0) return <span className={className}>{none}</span>;
  return (
    <span className={cx('inline-flex items-center gap-2 whitespace-nowrap', className)}>
      {items.map(({ kind, n, word }, i) => {
        const { icon: Icon, text } = PROBLEM_MARKS[kind];
        return (
          <span key={kind} className={cx('inline-flex items-center gap-1 tabular-nums', text)}>
            {/* A pause between the kinds for screen readers; the icons part them on screen. */}
            {i > 0 && <span className="sr-only">, </span>}
            <Icon aria-hidden="true" className="size-3.5 shrink-0" />
            {wordsFrom ? (
              <span>
                {n}
                <span className={wordsFrom === 'xl' ? 'sr-only xl:not-sr-only' : 'sr-only md:not-sr-only'}> {word}</span>
              </span>
            ) : (
              <span>{`${n} ${word}`}</span>
            )}
          </span>
        );
      })}
    </span>
  );
};
