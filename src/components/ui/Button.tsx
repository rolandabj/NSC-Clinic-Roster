/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Buttons in the approved look (design-system/nsc-clinic-roster/MASTER.md): 36 px high on a
 * laptop (32 px for small ones in tables), at least 44 px on a touch screen.
 *
 *   <Button variant="primary" icon={Send} onClick={...}>Publish</Button>
 *   <IconButton label="Close" icon={X} onClick={...} />
 */

import React from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';
import { cx } from './cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-strong',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-sunken',
  ghost: 'text-brand-strong hover:bg-brand-soft',
  danger: 'bg-danger text-white hover:bg-danger-strong',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-2.5 text-sm pointer-coarse:min-h-11',
  md: 'h-9 gap-2 px-3.5 text-sm pointer-coarse:min-h-11',
  lg: 'h-12 gap-2 px-5 text-base',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: the one main action; secondary: the others; ghost: links in a row; danger: deletes. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  /** Shows a turning icon and refuses more clicks while the work goes on. */
  busy?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  busy = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const Icon = busy ? Loader2 : icon;
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-md font-semibold whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {Icon && <Icon aria-hidden="true" className={cx(size === 'lg' ? 'size-5' : 'size-4', busy && 'animate-spin')} />}
      {children}
    </button>
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Read out, and shown as a tooltip, since the button shows only its icon. */
  label: string;
  icon: LucideIcon;
  /** outline draws a border, for an icon button that sits among other buttons. */
  variant?: 'plain' | 'outline';
  ref?: React.Ref<HTMLButtonElement>;
}

export const IconButton: React.FC<IconButtonProps> = ({ label, icon: Icon, variant = 'plain', className, ...props }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    {...props}
    className={cx(
      'inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 hover:bg-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:size-11',
      variant === 'outline' && 'border border-line-strong bg-surface',
      className
    )}
  >
    <Icon aria-hidden="true" className="size-5" />
  </button>
);
