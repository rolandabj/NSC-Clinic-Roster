import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  CalendarCheck2,
  Users,
  Stethoscope,
  History,
  Send,
  BarChart3,
  Settings,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { AppRoute } from '../../types/navigation';
import { authService, UserProfile } from '../../services/auth/authService';
import { canAccessRoute } from '../../services/auth/access';
import { IconButton, cx } from '../ui';
import { APP_NAME, SCREEN_NAMES } from './screenTitles';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  /** The clinic's name, shown under the app's name. */
  clinicName?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  /** Shown as the slide in menu on narrow screens: a Close button replaces the collapse toggle. */
  onClose?: () => void;
}

// Plain English labels (the app is English only since 07-10-2026), from the screens' names.
export const NAV_ITEMS: { id: AppRoute; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: SCREEN_NAMES.dashboard, icon: LayoutDashboard },
  { id: 'schedules', label: SCREEN_NAMES.schedules, icon: CalendarRange },
  { id: 'availability', label: SCREEN_NAMES.availability, icon: CalendarCheck2 },
  { id: 'nurses', label: SCREEN_NAMES.nurses, icon: Users },
  { id: 'doctors', label: SCREEN_NAMES.doctors, icon: Stethoscope },
  { id: 'history', label: SCREEN_NAMES.history, icon: History },
  { id: 'publish', label: SCREEN_NAMES.publish, icon: Send },
  { id: 'reports', label: SCREEN_NAMES.reports, icon: BarChart3 },
  { id: 'audit', label: SCREEN_NAMES.audit, icon: ShieldCheck },
  { id: 'settings', label: SCREEN_NAMES.settings, icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  clinicName,
  isCollapsed = false,
  onToggleCollapse,
  onClose,
}) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());

  useEffect(() => authService.subscribe(setUser), []);

  const visibleItems = NAV_ITEMS.filter((item) => canAccessRoute(user, item.id));

  return (
    <aside
      className={cx(
        'flex h-full shrink-0 flex-col border-r border-line bg-surface select-none transition-[width] duration-200',
        // The slide in menu is a little wider, so the app's name fits beside its Close button.
        onClose ? 'w-64' : isCollapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* The app's name and the clinic (with Close in the slide in menu) */}
      <div className={cx('flex h-14 shrink-0 items-center gap-2.5 border-b border-line', isCollapsed ? 'justify-center px-2' : 'px-3')}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-white" title={isCollapsed ? APP_NAME : undefined}>
          <CalendarRange className="size-5" aria-hidden="true" />
          {isCollapsed && <span className="sr-only">{APP_NAME}</span>}
        </span>
        {!isCollapsed && (
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-bold text-ink">{APP_NAME}</span>
            {clinicName && <span className="block truncate text-xs text-ink-muted">{clinicName}</span>}
          </span>
        )}
        {onClose && <IconButton label="Close menu" icon={X} onClick={onClose} className="-mr-1" />}
      </div>

      {/* The screens this person may open */}
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 py-2">
        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    // A plain click opens the screen here; Ctrl, Shift or the middle button opens it elsewhere.
                    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                  title={isCollapsed ? item.label : undefined}
                  aria-label={isCollapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={cx(
                    'flex h-9 items-center gap-2.5 rounded-md text-sm transition-colors duration-150 pointer-coarse:h-11',
                    isCollapsed ? 'justify-center px-0' : 'px-2.5',
                    isActive ? 'bg-brand-soft font-semibold text-brand-strong' : 'font-medium text-ink-muted hover:bg-sunken hover:text-ink'
                  )}
                >
                  <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Hiding the labels leaves more room for the roster */}
      {onToggleCollapse && !onClose && (
        <div className="shrink-0 border-t border-line p-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Show the menu labels (Ctrl+\\)' : 'Hide the menu labels (Ctrl+\\)'}
            aria-label={isCollapsed ? 'Show the menu labels' : undefined}
            className={cx(
              'flex h-9 w-full items-center gap-2.5 rounded-md text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-sunken hover:text-ink',
              isCollapsed ? 'justify-center' : 'px-2.5'
            )}
          >
            {isCollapsed ? <PanelLeftOpen className="size-[18px]" aria-hidden="true" /> : <PanelLeftClose className="size-[18px]" aria-hidden="true" />}
            {!isCollapsed && 'Hide labels'}
          </button>
        </div>
      )}
    </aside>
  );
};
