// Test page only: first drafts of the shared parts for the proposed look (Phase 2). After the
// owner approves the look, the real ones are built in src/components/ui/ with tests.
import React, { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, CircleAlert, CircleCheck, Info, OctagonAlert, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { useDialogA11y } from '../../src/components/common/useDialogA11y';

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-strong',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-sunken',
  ghost: 'text-brand-strong hover:bg-brand-soft',
};
// 32 and 36 px on a laptop; at least 44 px wherever the screen is touched.
const SIZES: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-2.5 text-sm pointer-coarse:min-h-11',
  md: 'h-9 gap-2 px-3.5 text-sm pointer-coarse:min-h-11',
  lg: 'h-12 gap-2 px-5 text-base',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; icon?: LucideIcon }) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-md font-semibold whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {Icon && <Icon aria-hidden="true" className={size === 'lg' ? 'size-5' : 'size-4'} />}
      {children}
    </button>
  );
}

/** A button that shows only an icon: its name is read out and shown as a tooltip. */
export function IconButton({
  label,
  icon: Icon,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: LucideIcon }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={cx(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 hover:bg-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:size-11',
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}

export type Tone = 'neutral' | 'brand' | 'danger' | 'warning' | 'success' | 'info';

const TONES: Record<Tone, string> = {
  neutral: 'bg-sunken text-ink-muted',
  brand: 'bg-brand-soft text-brand-strong',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
  success: 'bg-success-soft text-success',
  info: 'bg-info-soft text-info',
};

/** A short status word, always with its icon or its word, never colour alone. */
export function Badge({ tone = 'neutral', icon: Icon, children }: { tone?: Tone; icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap', TONES[tone])}>
      {Icon && <Icon aria-hidden="true" className="size-3.5" />}
      {children}
    </span>
  );
}

/** Must fix, Check and Note: the roster's three kinds of problem, each with its own shape. */
export const PROBLEM = {
  must: { word: 'Must fix', icon: OctagonAlert, tone: 'danger' as Tone, text: 'text-danger' },
  check: { word: 'Check', icon: TriangleAlert, tone: 'warning' as Tone, text: 'text-warning' },
  note: { word: 'Note', icon: Info, tone: 'info' as Tone, text: 'text-info' },
};
export type ProblemKind = keyof typeof PROBLEM;

export function Card({
  title,
  actions,
  children,
  className,
  bodyClassName = 'p-4',
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cx('rounded-lg border border-line bg-surface shadow-card', className)}>
      {title && (
        <header className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function Notice({
  tone = 'info',
  title,
  children,
  action,
}: {
  tone?: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  const Icon = { info: Info, warning: TriangleAlert, danger: OctagonAlert, success: CircleCheck }[tone];
  const box = {
    info: 'border-info/30 bg-info-soft',
    warning: 'border-warning-line/40 bg-warning-soft',
    danger: 'border-danger-line/40 bg-danger-soft',
    success: 'border-success/30 bg-success-soft',
  }[tone];
  const ink = { info: 'text-info', warning: 'text-warning', danger: 'text-danger', success: 'text-success' }[tone];
  return (
    <div className={cx('flex flex-wrap items-start gap-3 rounded-lg border px-4 py-3', box)}>
      <Icon aria-hidden="true" className={cx('mt-0.5 size-5 shrink-0', ink)} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{title}</p>
        {children && <div className="mt-0.5 text-ink-muted">{children}</div>}
      </div>
      {action}
    </div>
  );
}

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  countTone?: Tone;
}

/** The ARIA tabs pattern: one Tab stop, arrow keys, Home and End. Scrolls sideways on a phone. */
export function Tabs({
  label,
  tabs,
  value,
  onChange,
  idPrefix,
}: {
  label: string;
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, tabs.findIndex((t) => t.id === value));
  const go = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => go(index + 1),
      ArrowLeft: () => go(index - 1),
      Home: () => go(0),
      End: () => go(tabs.length - 1),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex gap-1 overflow-x-auto border-b border-line px-2">
      {tabs.map((t, i) => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cx(
              '-mb-px inline-flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm whitespace-nowrap transition-colors duration-150',
              selected ? 'border-brand font-semibold text-brand-strong' : 'border-transparent font-medium text-ink-muted hover:text-ink',
            )}
          >
            {t.label}
            {t.count != null && (
              <span className={cx('rounded-full px-1.5 text-xs font-semibold tabular-nums', TONES[t.countTone || 'neutral'])}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  idPrefix,
  id,
  value,
  focusable,
  children,
}: {
  idPrefix: string;
  id: string;
  value: string;
  focusable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      hidden={id !== value}
      tabIndex={focusable ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export const inputClass =
  'block h-9 w-full rounded-md border border-control bg-surface px-3 text-sm text-ink transition-colors duration-150 pointer-coarse:h-11 pointer-coarse:text-base aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger-line';

interface FieldProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

/** YYYY-MM-DD from "21-12-2026" (or 21/12/2026, 21.12.2026), or '' when it is not a real date. */
export function parseDayMonthYear(text: string): string {
  const m = text.trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (!m) return '';
  const [d, month, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, month - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== d) return '';
  return date.toISOString().slice(0, 10);
}
const showDate = (iso: string) => (iso ? `${iso.slice(8, 10)}-${iso.slice(5, 7)}-${iso.slice(0, 4)}` : '');

/**
 * A date shown and typed as DD-MM-YYYY whatever the browser's language (the browser's own
 * date field shows 12/21/2026 on a computer set to US English), with the browser's calendar
 * on a button. onChange gets YYYY-MM-DD, or '' while the text is not a real date.
 */
export function DateInput({
  value,
  onChange,
  onBlur,
  inputRef,
  ...field
}: FieldProps & {
  value: string;
  onChange: (iso: string) => void;
  onBlur?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const [text, setText] = useState(showDate(value));
  const calendar = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (value && parseDayMonthYear(text) !== value) setText(showDate(value));
    // Only a new value from outside (the calendar) replaces what was typed.
  }, [value]);
  return (
    <div className="relative">
      <input
        {...field}
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="DD-MM-YYYY"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(parseDayMonthYear(e.target.value));
        }}
        onBlur={onBlur}
        className={cx(inputClass, 'pr-11')}
      />
      <input
        ref={calendar}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full opacity-0"
      />
      <button
        type="button"
        aria-label="Choose from a calendar"
        title="Choose from a calendar"
        onClick={() => calendar.current?.showPicker?.()}
        className="absolute top-0.5 right-0.5 flex size-8 items-center justify-center rounded text-ink-muted transition-colors duration-150 hover:bg-sunken hover:text-ink pointer-coarse:top-0 pointer-coarse:right-0 pointer-coarse:size-11"
      >
        <CalendarDays aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}

/** A label above its field, an optional hint, and the error under the field. */
export function Field({
  label,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (props: FieldProps) => React.ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error && (
        <p id={errorId} className="flex items-start gap-1.5 text-sm font-semibold text-danger">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** A dialog over the page that fits a laptop screen: title, content that scrolls, buttons. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const ref = useDialogA11y<HTMLDivElement>(open, onClose);
  const titleId = useId();
  const descriptionId = useId();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="enter flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col rounded-t-xl bg-surface shadow-dialog sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-ink-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton label="Close" icon={X} onClick={onClose} className="-mt-1 -mr-2" />
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-3 sm:flex-row sm:justify-end">{footer}</div>
      </div>
    </div>
  );
}
