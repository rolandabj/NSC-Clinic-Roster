/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Form fields: the label above the field, "(optional)" after it where it applies, a hint
 * under the label, and the error under the field with an icon and a red border. Field links
 * them all for screen readers and passes the ids to the input it renders:
 *
 *   <Field label="First day" error={firstError}>
 *     {(p) => <DateInput {...p} value={first} onChange={setFirst} />}
 *   </Field>
 */

import React, { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, CircleAlert } from 'lucide-react';
import { formatDate, parseDayMonthYear } from '../../utils/dateUtils';
import { cx } from './cx';

/** 36 px on a laptop, 44 px and 16 px text on a touch screen (so phones do not zoom in). */
export const inputClass =
  'block h-9 w-full rounded-md border border-control bg-surface px-3 text-sm text-ink transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-sunken pointer-coarse:h-11 pointer-coarse:text-base aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger-line';

/** What Field passes to the input it renders. */
export interface FieldInputProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

export const Field: React.FC<{
  label: string;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (props: FieldInputProps) => React.ReactNode;
}> = ({ label, hint, error, optional, className, children }) => {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx('space-y-1.5', className)}>
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
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { ref?: React.Ref<HTMLSelectElement> };
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> };

export const Input: React.FC<InputProps> = ({ className, ...props }) => <input {...props} className={cx(inputClass, className)} />;

export const Select: React.FC<SelectProps> = ({ className, ...props }) => <select {...props} className={cx(inputClass, 'pr-8', className)} />;

export const Textarea: React.FC<TextareaProps> = ({ className, rows = 3, ...props }) => (
  <textarea rows={rows} {...props} className={cx(inputClass, 'h-auto py-2', className)} />
);

/** A tick box with its label beside it; the whole line can be clicked. */
export const Checkbox: React.FC<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: React.ReactNode; hint?: React.ReactNode }
> = ({ label, hint, className, ...props }) => {
  const hintId = useId();
  return (
    <label className={cx('flex items-start gap-2.5 text-sm text-ink', props.disabled && 'opacity-50', className)}>
      <input type="checkbox" {...props} aria-describedby={hint ? hintId : undefined} className="mt-0.5 size-5 shrink-0 accent-brand" />
      <span>
        {label}
        {hint && (
          <span id={hintId} className="block text-xs text-ink-muted">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
};

/** An on and off switch for a setting that takes effect at once; its label is part of it. */
export const Switch: React.FC<{
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}> = ({ label, checked, onChange, hint, disabled, className }) => {
  const hintId = useId();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={hint ? hintId : undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx('flex min-h-9 items-start gap-3 rounded-md text-left text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-11', className)}
    >
      <span
        aria-hidden="true"
        className={cx(
          'mt-0.5 flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150',
          checked ? 'bg-brand' : 'bg-control'
        )}
      >
        <span className={cx('size-5 rounded-full bg-white shadow-card transition-transform duration-150', checked && 'translate-x-4')} />
      </span>
      <span>
        <span className="font-semibold">{label}</span>
        {hint && (
          <span id={hintId} className="block text-xs text-ink-muted">
            {hint}
          </span>
        )}
      </span>
    </button>
  );
};

/**
 * A date shown and typed as DD-MM-YYYY whatever the browser's language (the browser's own
 * date field shows 12/21/2026 on a computer set to US English), with the browser's calendar
 * on a button. onChange gets YYYY-MM-DD, or '' while the text is not a real date, so the form
 * can show an error when the field is left.
 */
export const DateInput: React.FC<
  FieldInputProps & {
    value: string;
    onChange: (iso: string) => void;
    onBlur?: () => void;
    disabled?: boolean;
    min?: string;
    max?: string;
    ref?: React.Ref<HTMLInputElement>;
  }
> = ({ value, onChange, onBlur, disabled, min, max, ref, ...field }) => {
  const [text, setText] = useState(formatDate(value));
  const calendar = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Only a new value from outside (the calendar, a reset) replaces what was typed.
    if (value && parseDayMonthYear(text) !== value) setText(formatDate(value));
  }, [value]);
  return (
    <div className="relative">
      <input
        {...field}
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="DD-MM-YYYY"
        value={text}
        disabled={disabled}
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
        value={value || ''}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full opacity-0"
      />
      <button
        type="button"
        aria-label="Choose from a calendar"
        title="Choose from a calendar"
        disabled={disabled}
        onClick={() => calendar.current?.showPicker?.()}
        className="absolute top-0.5 right-0.5 flex size-8 items-center justify-center rounded text-ink-muted transition-colors duration-150 hover:bg-sunken hover:text-ink disabled:cursor-not-allowed pointer-coarse:top-0 pointer-coarse:right-0 pointer-coarse:size-11"
      >
        <CalendarDays aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
};
