import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AppRoute, ClinicContextState } from '../../types/navigation';
import { LocalModeBanner } from './LocalModeBanner';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DashboardView } from '../views/DashboardView';
import { SettingsView } from '../views/SettingsView';
import { AuthModal } from '../modals/AuthModal';
import { PageLoading } from '../common/PageLoading';
import { useDialogA11y } from '../common/useDialogA11y';
import { ShortcutsModal } from '../modals/ShortcutsModal';
import { repositoryManager } from '../../services/repository';
import {
  initializeDatabaseIfEmpty,
  isDatabaseMarkedCleared,
  ensureWorkingHoursPeriodsDefaults,
} from '../../services/seed/seedRunner';
import { testFirestoreConnection } from '../../services/firebase/firebaseConfig';
import { canAccessRoute } from '../../services/auth/access';
import { setClinicWeekendDays } from '../../utils/weekend';
import { authService, UserProfile } from '../../services/auth/authService';
import { RosterPublishService } from '../../services/publish/rosterPublishService';
import { quotaTracker } from '../../services/firebase/quotaTracker';
import { Check, AlertTriangle, X } from 'lucide-react';
import { LoadErrorBoundary } from '../common/LoadErrorBoundary';
import { chooseScheduleToOpen } from '../../services/schedule/openSchedule';
import { todayIso } from '../../services/publish/nurseRosterService';
import { formatDateRange } from '../../utils/dateUtils';
import { PROBLEMS_EVENT, ProblemCount } from '../../services/dashboard/problemCount';

// Screens load on demand, so the first page does not download the whole app.
const SchedulesView = lazy(() => import('../views/SchedulesView').then((m) => ({ default: m.SchedulesView })));
const AvailabilityView = lazy(() => import('../views/AvailabilityView').then((m) => ({ default: m.AvailabilityView })));
const NursesView = lazy(() => import('../views/NursesView').then((m) => ({ default: m.NursesView })));
const DoctorsView = lazy(() => import('../views/DoctorsView').then((m) => ({ default: m.DoctorsView })));
const HistoryView = lazy(() => import('../views/HistoryView').then((m) => ({ default: m.HistoryView })));
const PublishView = lazy(() => import('../views/PublishView').then((m) => ({ default: m.PublishView })));
const ReportsView = lazy(() => import('../views/ReportsView').then((m) => ({ default: m.ReportsView })));
const PublishedRosterView = lazy(() => import('../views/PublishedRosterView').then((m) => ({ default: m.PublishedRosterView })));
const MyRosterView = lazy(() => import('../views/MyRosterView').then((m) => ({ default: m.MyRosterView })));
const AuditTrailView = lazy(() => import('../views/AuditTrailView').then((m) => ({ default: m.AuditTrailView })));

interface AppShellProps {
  currentUser?: UserProfile | null;
}

export const AppShell: React.FC<AppShellProps> = ({ currentUser: propUser }) => {
  // Extract route, token, and nurse from URL
  const parseUrlState = (): { route: AppRoute; token?: string; nurse?: string; ackToken?: string } => {
    const hash = window.location.hash.replace('#', '');
    const search = window.location.search;

    const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : search);
    const token = urlParams.get('token') || undefined;
    const nurse = urlParams.get('nurse') || undefined;
    const ackToken = urlParams.get('ackToken') || (hash.startsWith('ack') ? urlParams.get('token') || undefined : undefined);

    const baseRoute = hash.split('?')[0] as AppRoute;
    // A nurse's private page (#me?t=TOKEN); its token is never a share token.
    if (baseRoute === 'me') {
      return { route: 'me', token: urlParams.get('t') || undefined };
    }
    const validRoutes: AppRoute[] = [
      'dashboard',
      'schedules',
      'availability',
      'nurses',
      'doctors',
      'history',
      'publish',
      'reports',
      'audit',
      'settings',
      'published',
    ];

    if (baseRoute === 'published' || (token && !ackToken) || search.includes('token=')) {
      return { route: 'published', token, nurse, ackToken };
    }

    return {
      route: validRoutes.includes(baseRoute) ? baseRoute : 'dashboard',
      token,
      nurse,
      ackToken,
    };
  };

  const initialUrl = parseUrlState();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initialUrl.route);
  const [shareTokenParam, setShareTokenParam] = useState<string | undefined>(initialUrl.token);
  const [nurseIdParam, setNurseIdParam] = useState<string | undefined>(initialUrl.nurse);

  const initialUser = propUser || authService.getCurrentUser();
  const isInitiallyCleared =
    typeof window !== 'undefined' && localStorage.getItem('clinic_roster_database_cleared') === 'true';

  const rawClinicName = typeof window !== 'undefined' ? localStorage.getItem('clinic_roster_clinic_name') : null;
  const initialClinicName =
    rawClinicName && rawClinicName !== 'Hope Valley Polyclinic' && rawClinicName !== 'Outpatient Clinic'
      ? rawClinicName
      : 'American Hospital Nad Al Sheba OutPatient clinic';
  const initialClinicTimezone =
    (typeof window !== 'undefined' && localStorage.getItem('clinic_roster_clinic_timezone')) ||
    'Asia/Dubai';

  const [clinicContext, setClinicContext] = useState<ClinicContextState>({
    clinicName: initialClinicName,
    timezone: initialClinicTimezone,
    activeScheduleName: 'No Active Schedule',
    activeSchedulePeriod: '',
    activeScheduleId: '',
    warningCount: 0,
    isLocalMode: !repositoryManager.getIsCloudMode(),
    currentUser: {
      name: initialUser?.name || 'Unauthenticated User',
      email: initialUser?.email || '',
      role: initialUser?.role || 'VIEWER',
      isLocal: initialUser?.isLocal ?? false,
    },
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [openCreateInSchedules, setOpenCreateInSchedules] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(() => quotaTracker.isQuotaExceeded());
  const [isQuotaBannerDismissed, setIsQuotaBannerDismissed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('clinic_roster_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('clinic_roster_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Below 1024 px the sidebar is hidden and opens as a slide in menu from the top bar.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useDialogA11y<HTMLDivElement>(isMenuOpen, () => setIsMenuOpen(false));
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const wide = window.matchMedia('(min-width: 1024px)');
    // A window made wider shows the sidebar again, so the menu closes (and stops holding the focus).
    const onChange = () => {
      if (wide.matches) setIsMenuOpen(false);
    };
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  const handleUpdateClinicProfile = useCallback((profile: any) => {
    setClinicContext((prev) => {
      if (prev.clinicName === profile.name && prev.timezone === (profile.timezone || prev.timezone)) {
        return prev;
      }
      return {
        ...prev,
        clinicName: profile.name,
        timezone: profile.timezone || prev.timezone,
      };
    });
  }, []);

  const handleUpdateClinicName = useCallback((name: string) => {
    setClinicContext((prev) => {
      if (prev.clinicName === name) return prev;
      return { ...prev, clinicName: name };
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const unsub = authService.subscribe((user: UserProfile | null) => {
      setClinicContext((prev) => {
        if (!user) {
          return {
            ...prev,
            currentUser: {
              name: 'Unauthenticated User',
              email: '',
              role: 'VIEWER',
              isLocal: false,
            },
          };
        }
        if (
          prev.currentUser &&
          prev.currentUser.name === user.name &&
          prev.currentUser.email === user.email &&
          prev.currentUser.role === user.role &&
          prev.currentUser.isLocal === user.isLocal
        ) {
          return prev;
        }
        return {
          ...prev,
          currentUser: {
            name: user.name,
            email: user.email,
            role: user.role,
            isLocal: user.isLocal,
          },
        };
      });
    });
    return unsub;
  }, []);

  useEffect(() => {
    return quotaTracker.subscribe((exceeded) => {
      setIsQuotaExceeded(exceeded);
    });
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        await testFirestoreConnection();
        const repo = repositoryManager.getRepo();

        // Fetch active clinic profile if present
        const clinics = await repo.list('clinics');
        if (clinics.length > 0) {
          const mainClinic = clinics[0];
          const rawName = mainClinic.name;
          const resolvedName =
            rawName && rawName !== 'Hope Valley Polyclinic' && rawName !== 'Outpatient Clinic'
              ? rawName
              : 'American Hospital Nad Al Sheba OutPatient clinic';
          setClinicContext((prev) => ({
            ...prev,
            clinicName: resolvedName,
            timezone: mainClinic.timezone || 'Asia/Dubai',
          }));
          setClinicWeekendDays(mainClinic.weekendDays);
          if (typeof document !== 'undefined') {
            document.title = `${resolvedName} — Clinical Roster`;
          }
          try {
            // Cached so the login page and public links can show the clinic name.
            localStorage.setItem('clinic_roster_clinic_name', resolvedName);
          } catch {}
        }

        // The roster to show as current: the one last opened in this browser, else
        // the one covering today, else the latest (same choice as the schedule screen).
        const schedules = await repo.list('schedules');
        let storedId: string | null = null;
        try {
          storedId = localStorage.getItem('clinic_roster_active_schedule_id');
        } catch {}
        const activeSched = chooseScheduleToOpen(schedules, storedId, null, todayIso(clinics[0]?.timezone));
        if (activeSched) {
          setClinicContext((prev) => ({
            ...prev,
            activeScheduleName: activeSched.name,
            activeSchedulePeriod: formatDateRange(activeSched.startDate, activeSched.endDate),
            activeScheduleId: activeSched.id,
          }));
        } else {
          setClinicContext((prev) => ({
            ...prev,
            activeScheduleName: 'No Active Schedule',
            activeSchedulePeriod: '',
            activeScheduleId: '',
          }));
        }
      } catch (err) {
        console.error('Failed to initialize database context:', err);
      } finally {
        setIsInitialized(true);
      }
    }
    bootstrap();

    // The open roster's problem count, for the top bar and the dashboard.
    const handleProblems = (e: Event) => {
      const detail = (e as CustomEvent<ProblemCount>).detail;
      if (!detail) return;
      // The roster's name, dates and count always change together.
      setClinicContext((prev) => ({
        ...prev,
        warningCount: detail.mustFix + detail.toCheck,
        activeScheduleId: detail.scheduleId || null,
        activeScheduleName: detail.scheduleId ? detail.name : 'No Active Schedule',
        activeSchedulePeriod: detail.scheduleId ? formatDateRange(detail.startDate, detail.endDate) : '',
      }));
    };
    window.addEventListener(PROBLEMS_EVENT, handleProblems);

    const handleClinicCleared = () => {
      setClinicContext((prev) => ({
        ...prev,
        clinicName: 'Outpatient Clinic',
        activeScheduleName: 'No Active Schedule',
        activeSchedulePeriod: '',
        activeScheduleId: '',
        warningCount: 0,
      }));
    };

    const handleClinicNameUpdated = (e: any) => {
      if (e.detail) {
        setClinicContext((prev) => ({
          ...prev,
          clinicName: e.detail,
        }));
        if (typeof document !== 'undefined') {
          document.title = `${e.detail} — Clinical Roster`;
        }
      }
    };

    window.addEventListener('clinic-roster-cleared', handleClinicCleared);
    window.addEventListener('clinic-name-updated', handleClinicNameUpdated);
    return () => {
      window.removeEventListener(PROBLEMS_EVENT, handleProblems);
      window.removeEventListener('clinic-roster-cleared', handleClinicCleared);
      window.removeEventListener('clinic-name-updated', handleClinicNameUpdated);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseUrlState();
      setCurrentRoute(parsed.route);
      setShareTokenParam(parsed.token);
      setNurseIdParam(parsed.nurse);

      // Receipt links open the confirm page (see App.tsx); nothing is confirmed automatically.
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: AppRoute) => {
    setIsMenuOpen(false);
    if (route !== 'schedules') {
      setOpenCreateInSchedules(false);
    }
    setCurrentRoute(route);
    window.location.hash = route;
  };

  const handleOpenPublishedPreview = (token: string) => {
    setShareTokenParam(token);
    setCurrentRoute('published');
    window.location.hash = `published?token=${token}`;
  };

  // A nurse's private page, opened inside the app (the same page as without signing in).
  if (currentRoute === 'me') {
    return (
      <LoadErrorBoundary><Suspense fallback={<PageLoading />}>
        <MyRosterView token={shareTokenParam || ''} />
      </Suspense></LoadErrorBoundary>
    );
  }

  // If in published view mode (read-only standalone page for external links or preview)
  if (currentRoute === 'published') {
    return (
      <LoadErrorBoundary><Suspense fallback={<PageLoading />}>
        <PublishedRosterView
          shareToken={shareTokenParam}
          nurseIdParam={nurseIdParam}
          onExitPreview={() => navigateTo('schedules')}
        />
      </Suspense></LoadErrorBoundary>
    );
  }

  const renderCurrentView = () => {
    // Screens a role cannot use fall back to the dashboard.
    const route: AppRoute = canAccessRoute(authService.getCurrentUser(), currentRoute) ? currentRoute : 'dashboard';
    switch (route) {
      case 'dashboard':
        return (
          <DashboardView
            context={clinicContext}
            onNavigate={navigateTo}
            onOpenCreateSchedule={() => {
              setOpenCreateInSchedules(true);
              navigateTo('schedules');
            }}
          />
        );
      case 'schedules':
        return (
          <SchedulesView
            context={clinicContext}
            onOpenSharePreview={handleOpenPublishedPreview}
            initialOpenCreate={openCreateInSchedules}
          />
        );
      case 'availability':
        return <AvailabilityView context={clinicContext} />;
      case 'nurses':
        return <NursesView context={clinicContext} />;
      case 'doctors':
        return <DoctorsView context={clinicContext} />;
      case 'history':
        return <HistoryView context={clinicContext} />;
      case 'publish':
        return <PublishView context={clinicContext} />;
      case 'reports':
        return <ReportsView context={clinicContext} />;
      case 'audit':
        return <AuditTrailView context={clinicContext} />;
      case 'settings':
        return (
          <SettingsView
            context={clinicContext}
            onUpdateClinicProfile={handleUpdateClinicProfile}
            onUpdateClinicName={handleUpdateClinicName}
          />
        );
      default:
        return (
          <DashboardView
            context={clinicContext}
            onNavigate={navigateTo}
            onOpenCreateSchedule={() => {
              setOpenCreateInSchedules(true);
              navigateTo('schedules');
            }}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* Cloud Quota Limit Notice Banner */}
      {isQuotaExceeded && !isQuotaBannerDismissed && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs flex items-center justify-between shrink-0 z-50">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <span className="p-1 rounded-md bg-amber-200/60 dark:bg-amber-800/60 text-amber-800 dark:text-amber-200 shrink-0">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <strong className="font-semibold mr-1">Firestore Free Daily Quota Reached:</strong>
              <span className="text-amber-800/90 dark:text-amber-300/90">
                The database reached its free daily limit. Saved data is safe, but <strong>new changes are not being saved</strong>. Screens show
                &quot;Not saved&quot; for anything that could not be stored, and the roster retries automatically after the quota resets at
                midnight Pacific time. Upgrading the Firebase plan removes the limit.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://console.firebase.google.com/project/gen-lang-client-0671372661/firestore/databases/ai-studio-clinicroster-1845fa77-65a1-4351-a0d8-2f23afdb1499/data?openUpgradeDialog=true"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-xs whitespace-nowrap"
            >
              Manage Database in Firebase
            </a>
            <button
              onClick={() => setIsQuotaBannerDismissed(true)}
              className="p-1 text-amber-700 dark:text-amber-400 hover:text-amber-950 dark:hover:text-white rounded transition-colors"
              title="Dismiss notice"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Dismissible Local Mode Banner */}
      {clinicContext.isLocalMode && (
        <LocalModeBanner onNavigateToSettings={() => navigateTo('settings')} />
      )}

      {/* Main Layout: Left Sidebar + (TopBar + Content Viewport) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Nav (1024 px and wider) */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={navigateTo}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        </div>

        {/* The same menu, sliding in on narrower screens */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50" aria-hidden="true" onClick={() => setIsMenuOpen(false)} />
            <div ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu" className="relative flex h-full shadow-xl">
              <Sidebar currentRoute={currentRoute} onNavigate={navigateTo} onClose={() => setIsMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Right Content Area */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-slate-50">
          <TopBar
            context={clinicContext}
            onNavigateToSchedules={() => navigateTo('schedules')}
            onOpenWarnings={() => navigateTo('schedules')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenMenu={() => setIsMenuOpen(true)}
            isMenuOpen={isMenuOpen}
          />

          <main className="flex-1 min-h-0 overflow-y-auto">
            <LoadErrorBoundary resetKey={currentRoute}><Suspense fallback={<PageLoading />}>{renderCurrentView()}</Suspense></LoadErrorBoundary>
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        context={clinicContext}
        onNavigateToSettings={() => navigateTo('settings')}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

    </div>
  );
};
