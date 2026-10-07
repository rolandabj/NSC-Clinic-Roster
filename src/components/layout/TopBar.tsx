import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  ChevronDown,
  Keyboard,
  ShieldCheck,
  Shield,
  LogOut,
  Menu,
} from 'lucide-react';
import { ClinicContextState } from '../../types/navigation';
import { authService, MASTER_ADMIN_EMAIL } from '../../services/auth/authService';
import { signOutSafely } from '../common/signOut';
import { canEditClinicData } from '../../services/auth/access';

interface TopBarProps {
  context: ClinicContextState;
  onNavigateToSchedules: () => void;
  onOpenWarnings: () => void;
  onOpenAuthModal: () => void;
  onOpenShortcuts?: () => void;
  onOpenAcceptance?: () => void;
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
  onOpenAcceptance,
  onOpenMenu,
  isMenuOpen = false,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isMasterAdmin =
    context.currentUser?.email?.toLowerCase() === MASTER_ADMIN_EMAIL ||
    context.currentUser?.role === 'OWNER';

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await signOutSafely();
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-5 gap-2 flex items-center justify-between z-20 shrink-0 transition-colors">
      {/* Zone 1: Clinic Context & Active Schedule */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            className="lg:hidden p-2 -ml-1 rounded text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-semibold text-slate-900 dark:text-white text-sm tracking-tight truncate">
            {context.clinicName}
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline tabular-nums">
            {context.timezone}
          </span>
        </div>

        {/* Schedule Selector Pill/Dropdown affordance */}
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

        {/* The roster shortcut, for people who can open the roster */}
        {canEditClinicData(authService.getCurrentUser()) && (
        <button
          onClick={onNavigateToSchedules}
          className="group hidden md:flex items-center gap-2 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
          title="Switch or manage active schedule"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[200px]">
                {context.activeScheduleName || 'No Active Schedule'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" aria-hidden="true" />
            </div>
            {context.activeSchedulePeriod ? (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums leading-none">
                {context.activeSchedulePeriod}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 italic leading-none">
                Click to manage schedules
              </span>
            )}
          </div>
        </button>
        )}
      </div>

      {/* Zone 2 & 3: Alerts, Utilities & Auth Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Keyboard Shortcuts Trigger */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="hidden lg:inline-flex p-1.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Keyboard Shortcuts Cheat-sheet (?)"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4 text-slate-500" aria-hidden="true" />
          </button>
        )}

        {/* System Acceptance Verification Trigger */}
        {onOpenAcceptance && (
          <button
            onClick={onOpenAcceptance}
            className="px-2 py-1 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
            title="System Acceptance Checklist & Verification Suite"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span className="text-[11px]">Verification</span>
          </button>
        )}

        {/* The roster's problem count, for people who can open the roster */}
        {canEditClinicData(authService.getCurrentUser()) && (
        <button
          onClick={onOpenWarnings}
          className={`relative p-2 rounded border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
            context.warningCount > 0
              ? 'border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
          title="Open the roster and its problems"
          aria-label={`${context.warningCount} problems on the roster`}
        >
          {context.warningCount > 0 ? (
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          ) : (
            <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          )}
          <span className="tabular-nums font-semibold">
            {context.warningCount}
          </span>
          <span className="text-[11px] font-normal text-slate-600 dark:text-slate-400 hidden md:inline">
            {context.warningCount === 1 ? 'problem' : 'problems'}
          </span>
        </button>
        )}

        {/* User Account / Profile Menu */}
        {context.currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800 transition-colors cursor-pointer text-left shadow-2xs"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                isMasterAdmin ? 'bg-indigo-600' : 'bg-teal-600'
              }`}>
                {context.currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {context.currentUser.name}
                </span>
                <span className={`text-[10px] font-bold ${
                  isMasterAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-600 dark:text-teal-400'
                }`}>
                  {isMasterAdmin ? 'Administrator' : 'Clinic Staff'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in duration-100"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                {/* User Identity Header */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{context.currentUser.name}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isMasterAdmin
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    }`}>
                      {isMasterAdmin ? 'OWNER' : (context.currentUser.role || 'STAFF')}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-mono truncate">{context.currentUser.email}</p>
                </div>

                {/* Account Details / RBAC inspector */}
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
                  <span>Clinical Access &amp; Permissions</span>
                </button>

                {/* Sign Out Button */}
                <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
