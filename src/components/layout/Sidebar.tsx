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
  Activity,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { AppRoute, NavItem } from '../../types/navigation';
import { authService, UserProfile } from '../../services/auth/authService';
import { canAccessRoute } from '../../services/auth/access';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  /** Shown as the slide in menu on narrow screens: a Close button replaces the collapse toggle. */
  onClose?: () => void;
}

// Plain English labels (the app is English only since 07-10-2026).
export const NAV_ITEMS: { id: AppRoute; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedules', label: 'Rosters', icon: CalendarRange },
  { id: 'availability', label: 'Availability', icon: CalendarCheck2 },
  { id: 'nurses', label: 'Nurses', icon: Users },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'history', label: 'History', icon: History },
  { id: 'publish', label: 'Publish', icon: Send },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'audit', label: 'Audit trail', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  onClose,
}) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());

  useEffect(() => authService.subscribe(setUser), []);

  const visibleItems = NAV_ITEMS.filter((item) => canAccessRoute(user, item.id));

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-56'
      } bg-slate-900 text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-800 transition-all duration-200`}
    >
      {/* App Branding & Collapse Toggle */}
      <div className={`h-14 ${isCollapsed ? 'px-2' : 'px-3'} flex items-center justify-between border-b border-slate-800`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          {onClose ? (
            <span className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white shrink-0" aria-hidden="true">
              <Activity className="w-4 h-4" />
            </span>
          ) : (
            <button
              type="button"
              className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white shrink-0 cursor-pointer"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'ClinicRoster'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Activity className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-white text-sm tracking-tight leading-tight truncate">
                ClinicRoster
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wide leading-tight truncate">
                NURSING SCHEDULER
              </span>
            </div>
          )}
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        ) : onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar (Ctrl+\\)' : 'Collapse sidebar to expand view (Ctrl+\\)'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav aria-label="Main" className={`flex-1 ${isCollapsed ? 'px-1.5' : 'px-2'} py-3 space-y-1 overflow-y-auto`}>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          const label = item.label;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? label : undefined}
              aria-label={isCollapsed ? label : undefined}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
              } rounded text-xs font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} aria-hidden="true" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </div>
            </button>
          );
        })}
      </nav>

    </aside>
  );
};
