import React, { useEffect, useId, useRef, useState } from 'react';
import { Bell, ChevronDown, Keyboard, LogOut, Menu, Shield, ShieldAlert } from 'lucide-react';
import { ClinicContextState } from '../../types/navigation';
import { authService } from '../../services/auth/authService';
import { signOutSafely } from '../common/signOut';
import { canEditClinicData, roleLabel } from '../../services/auth/access';
import { IconButton, cx } from '../ui';

interface TopBarProps {
  context: ClinicContextState;
  onNavigateToSchedules: () => void;
  onOpenWarnings: () => void;
  onOpenAuthModal: () => void;
  onOpenShortcuts?: () => void;
  /** Opens the menu on narrow screens, where the sidebar is hidden. */
  onOpenMenu?: () => void;
  isMenuOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  context,
  onNavigateToSchedules,
  onOpenWarnings,
  onOpenAuthModal,
  onOpenShortcuts,
  onOpenMenu,
  isMenuOpen = false,
}) => {
  const user = authService.getCurrentUser();
  const canOpenRoster = canEditClinicData(user);

  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line bg-surface px-2 sm:px-5">
      {/* The clinic, and the open roster for people who can open the roster */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {onOpenMenu && <IconButton label="Open menu" icon={Menu} onClick={onOpenMenu} aria-expanded={isMenuOpen} className="lg:hidden" />}
        <p className="min-w-0 truncate text-sm">
          <span className="font-semibold text-ink">{context.clinicName}</span>
          <span className="hidden text-ink-muted sm:inline"> · {context.timezone}</span>
        </p>

        {canOpenRoster && (
          <>
            <span className="hidden h-6 w-px bg-line md:block" aria-hidden="true" />
            <button
              type="button"
              onClick={onNavigateToSchedules}
              className="hidden items-center gap-2 rounded-md border border-line px-2.5 py-1 text-left transition-colors duration-150 hover:border-line-strong hover:bg-sunken md:flex"
              title="Open the roster"
            >
              <span className="flex flex-col">
                <span className="max-w-[200px] truncate text-xs font-semibold text-ink">{context.activeScheduleName || 'No roster open'}</span>
                <span className="text-xs leading-tight text-ink-muted">{context.activeSchedulePeriod || 'Open the rosters'}</span>
              </span>
              <ChevronDown className="size-4 text-ink-muted" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onOpenShortcuts && (
          <span className="hidden lg:inline-flex">
            <IconButton label="Keyboard shortcuts (?)" icon={Keyboard} variant="outline" onClick={onOpenShortcuts} />
          </span>
        )}

        {/* The open roster's problem count */}
        {canOpenRoster && (
          <button
            type="button"
            onClick={onOpenWarnings}
            className={cx(
              'flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-sm transition-colors duration-150 pointer-coarse:h-11',
              context.warningCount > 0
                ? 'border-warning-line/40 bg-warning-soft text-warning hover:border-warning-line'
                : 'border-line bg-surface text-ink-muted hover:bg-sunken'
            )}
            title="Open the roster and its problems"
          >
            {context.warningCount > 0 ? <ShieldAlert className="size-4" aria-hidden="true" /> : <Bell className="size-4" aria-hidden="true" />}
            <span className="font-semibold tabular-nums">{context.warningCount}</span>{' '}
            {/* The word shows from 768 px; screen readers always hear it. */}
            <span className="sr-only md:not-sr-only">{context.warningCount === 1 ? 'problem' : 'problems'}</span>
            <span className="sr-only"> on the roster</span>
          </button>
        )}

        {context.currentUser && <AccountMenu name={context.currentUser.name} email={context.currentUser.email} role={roleLabel(user)} onOpenAccess={onOpenAuthModal} />}
      </div>
    </header>
  );
};

/** The account button and its panel: who is signed in, their access, and Sign out. */
const AccountMenu: React.FC<{ name: string; email: string; role: string; onOpenAccess: () => void }> = ({ name, email, role, onOpenAccess }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          close();
        }
      }}
      onBlur={(e) => {
        // Tabbing out of the panel closes it.
        if (open && wrapRef.current && !wrapRef.current.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 rounded-md px-1.5 text-left transition-colors duration-150 hover:bg-sunken pointer-coarse:h-11"
      >
        <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-strong">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden flex-col leading-tight lg:flex">
          <span className="text-sm font-semibold text-ink">{name}</span>
          <span className="text-xs text-ink-muted">{role}</span>
        </span>
        <span className="sr-only lg:hidden">{name}, account</span>
        <ChevronDown className="size-4 text-ink-muted" aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} className="animate-in fade-in absolute right-0 z-50 mt-1.5 w-64 rounded-lg border border-line bg-surface py-1 text-sm shadow-pop">
          <div className="border-b border-line px-3.5 py-2.5">
            <p className="flex items-center justify-between gap-2">
              <span className="truncate font-semibold text-ink">{name}</span>
              <span className="rounded bg-brand-soft px-1.5 py-0.5 text-xs font-semibold text-brand-strong">{role}</span>
            </p>
            <p className="truncate text-xs text-ink-muted">{email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenAccess();
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-ink transition-colors duration-150 hover:bg-sunken"
          >
            <Shield className="size-4 text-ink-muted" aria-hidden="true" />
            Your access
          </button>
          <div className="border-t border-line pt-1">
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await signOutSafely();
              }}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left font-semibold text-danger transition-colors duration-150 hover:bg-danger-soft"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
