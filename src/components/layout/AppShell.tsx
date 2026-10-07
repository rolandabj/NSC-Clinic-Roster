import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { AddressChange, AppRoute, ClinicContextState } from '../../types/navigation';
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
import { TriangleAlert, X } from 'lucide-react';
import { IconButton } from '../ui';
import { screenTitle } from './screenTitles';
import { addressHash, readAddress } from '../../services/navigation/address';
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

    // An unknown screen, or one this person may not open, becomes the dashboard (and the
    // address is corrected below, so the menu shows where they are).
    const route: AppRoute = validRoutes.includes(baseRoute) ? baseRoute : 'dashboard';
    return {
      route: canAccessRoute(authService.getCurrentUser(), route) ? route : 'dashboard',
      token,
      nurse,
      ackToken,
    };
  };

  const initialUrl = parseUrlState();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initialUrl.route);
  // What the address names on the screen: a roster, sheet, nurse, day or settings tab.
  const [routeParams, setRouteParams] = useState<Record<string, string>>(() => readAddress(window.location.hash).params);
  const currentRouteRef = useRef(currentRoute);
  currentRouteRef.current = currentRoute;
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
      isManager: initialUser?.isManager,
      linkedNurseId: initialUser?.linkedNurseId,
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
          prev.currentUser.isLocal === user.isLocal &&
          prev.currentUser.isManager === user.isManager &&
          prev.currentUser.linkedNurseId === user.linkedNurseId
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
            isManager: user.isManager,
            linkedNurseId: user.linkedNurseId,
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
      syncAddress(parsed.route);
      setShareTokenParam(parsed.token);
      setNurseIdParam(parsed.nurse);
      setRouteParams(readAddress(window.location.hash).params);

      // Receipt links open the confirm page (see App.tsx); nothing is confirmed automatically.
    };

    // Back and Forward between addresses the screens added (a new tab) come here too.
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // A screen changed what is open on it: the address follows, adding a step to Back for 'push'.
  const updateAddress = useCallback<AddressChange>((params, mode) => {
    const next = addressHash(currentRouteRef.current, params);
    if (window.location.hash === next) return;
    const url = `${window.location.pathname}${window.location.search}${next}`;
    if (mode === 'push') window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
    setRouteParams(readAddress(next).params);
  }, []);

  // Keeps the address in step with the screen shown, for example #dashboard after a
  // link to a screen this person may not open (also when that screen is already showing).
  const syncAddress = (route: AppRoute) => {
    if (route === 'published' || route === 'me') return;
    const shown = window.location.hash.replace('#', '').split('?')[0];
    if (shown !== route) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${route}`);
    }
  };
  useEffect(() => syncAddress(currentRoute), [currentRoute]);

  // The browser tab names the screen shown ("Rosters · NSC Clinic Roster").
  useEffect(() => {
    document.title = screenTitle(currentRoute);
  }, [currentRoute]);

  // "Skip to main content" moves the keyboard past the menu and the top bar. It is a button,
  // because a link to #main would change the address, which picks the screen.
  const mainRef = useRef<HTMLElement>(null);

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
          onExitPreview={() => navigateTo(canAccessRoute(authService.getCurrentUser(), 'schedules') ? 'schedules' : 'dashboard')}
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
            address={routeParams}
            onAddressChange={updateAddress}
          />
        );
      case 'availability':
        return <AvailabilityView context={clinicContext} />;
      case 'nurses':
        return <NursesView context={clinicContext} nurseId={routeParams.nurse} onAddressChange={updateAddress} />;
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
            tab={routeParams.tab}
            onAddressChange={updateAddress}
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-canvas text-ink">
      <button
        type="button"
        onClick={() => mainRef.current?.focus()}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-pop"
      >
        Skip to main content
      </button>

      {/* The database's free daily limit is used up: changes are not saved until it resets */}
      {isQuotaExceeded && !isQuotaBannerDismissed && (
        <div role="alert" className="z-50 flex shrink-0 items-start justify-between gap-3 border-b border-warning-line/40 bg-warning-soft px-4 py-2.5 text-sm">
          <div className="flex min-w-0 items-start gap-2.5">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
            <p className="text-ink">
              <strong className="font-semibold">Changes are not being saved today.</strong>{' '}
              <span className="text-ink-muted">
                The database reached its free daily limit. Saved data is safe. Screens show &quot;Not saved&quot; for anything that
                could not be stored, and saving starts again by itself after midnight Pacific time. A paid Firebase plan removes the limit.
              </span>{' '}
              <a
                href="https://console.firebase.google.com/project/gen-lang-client-0671372661/firestore/databases/ai-studio-clinicroster-1845fa77-65a1-4351-a0d8-2f23afdb1499/data?openUpgradeDialog=true"
                target="_blank"
                rel="noreferrer"
                className="font-semibold whitespace-nowrap text-brand-strong underline"
              >
                Open the database in Firebase
              </a>
            </p>
          </div>
          <IconButton label="Close this notice" icon={X} onClick={() => setIsQuotaBannerDismissed(true)} className="-my-1.5" />
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
            clinicName={clinicContext.clinicName}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        </div>

        {/* The same menu, sliding in on narrower screens */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-ink/50" aria-hidden="true" onClick={() => setIsMenuOpen(false)} />
            <div ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu" className="animate-in slide-in-from-left relative flex h-full shadow-dialog">
              <Sidebar currentRoute={currentRoute} onNavigate={navigateTo} clinicName={clinicContext.clinicName} onClose={() => setIsMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Right Content Area */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-canvas">
          <TopBar
            context={clinicContext}
            onNavigateToSchedules={() => navigateTo('schedules')}
            onOpenWarnings={() => navigateTo('schedules')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenMenu={() => setIsMenuOpen(true)}
            isMenuOpen={isMenuOpen}
          />

          <main ref={mainRef} tabIndex={-1} className="flex-1 min-h-0 overflow-y-auto outline-none">
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
