import React, { useState, useEffect, useCallback, Suspense, lazy, useId } from 'react';
import { AppRoute, ClinicContextState } from '../../types/navigation';
import { LocalModeBanner } from './LocalModeBanner';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DashboardView } from '../views/DashboardView';
import { AuthModal } from '../modals/AuthModal';
import { PageLoading } from '../common/PageLoading';
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
import { CheckCircle2, Check, AlertTriangle, X } from 'lucide-react';
import { useDialogA11y } from '../common/useDialogA11y';

// Screens load on demand, so the first page does not download the whole app.
const SchedulesView = lazy(() => import('../views/SchedulesView').then((m) => ({ default: m.SchedulesView })));
const AvailabilityView = lazy(() => import('../views/AvailabilityView').then((m) => ({ default: m.AvailabilityView })));
const NursesView = lazy(() => import('../views/NursesView').then((m) => ({ default: m.NursesView })));
const DoctorsView = lazy(() => import('../views/DoctorsView').then((m) => ({ default: m.DoctorsView })));
const HistoryView = lazy(() => import('../views/HistoryView').then((m) => ({ default: m.HistoryView })));
const PublishView = lazy(() => import('../views/PublishView').then((m) => ({ default: m.PublishView })));
const ReportsView = lazy(() => import('../views/ReportsView').then((m) => ({ default: m.ReportsView })));
const SettingsView = lazy(() => import('../views/SettingsView').then((m) => ({ default: m.SettingsView })));
const PublishedRosterView = lazy(() => import('../views/PublishedRosterView').then((m) => ({ default: m.PublishedRosterView })));
const AuditTrailView = lazy(() => import('../views/AuditTrailView').then((m) => ({ default: m.AuditTrailView })));

/** "Schedule receipt confirmed" dialog shown after a nurse acknowledges a roster. */
const AckNoticeDialog: React.FC<{ message: string; onDismiss: () => void; onContinue: () => void }> = ({
  message,
  onDismiss,
  onContinue,
}) => {
  const titleId = useId();
  const ref = useDialogA11y<HTMLDivElement>(true, onDismiss);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-sm w-full p-5 text-center space-y-4 text-xs"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h3 id={titleId} className="font-bold text-slate-900 text-sm">Schedule Receipt Confirmed!</h3>
          <p className="text-slate-600 text-xs mt-1 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onContinue}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer transition-colors shadow-xs"
        >
          Continue to Workspace
        </button>
      </div>
    </div>
  );
};

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
  const [ackNotice, setAckNotice] = useState<string | null>(null);

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

        // Fetch active schedule if present
        const schedules = await repo.list('schedules');
        if (schedules.length > 0) {
          const activeSched = schedules[0];
          setClinicContext((prev) => ({
            ...prev,
            activeScheduleName: activeSched.name,
            activeSchedulePeriod: `${activeSched.startDate} – ${activeSched.endDate}`,
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

      if (parsed.ackToken) {
        RosterPublishService.acknowledgeByToken(parsed.ackToken).then((success) => {
          if (success) {
            setAckNotice('Your shift schedule receipt has been officially acknowledged and verified.');
          }
        });
      }
    };

    if (initialUrl.ackToken) {
      RosterPublishService.acknowledgeByToken(initialUrl.ackToken).then((success) => {
        if (success) {
          setAckNotice('Your shift schedule receipt has been officially acknowledged and verified.');
        }
      });
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: AppRoute) => {
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

  // If in published view mode (read-only standalone page for external links or preview)
  if (currentRoute === 'published') {
    return (
      <Suspense fallback={<PageLoading />}>
        <PublishedRosterView
          shareToken={shareTokenParam}
          nurseIdParam={nurseIdParam}
          onExitPreview={() => navigateTo('schedules')}
        />
      </Suspense>
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
        {/* Left Nav */}
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        {/* Right Content Area */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden bg-slate-50">
          <TopBar
            context={clinicContext}
            onNavigateToSchedules={() => navigateTo('schedules')}
            onOpenWarnings={() => navigateTo('schedules')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
          />

          <main className="flex-1 min-h-0 overflow-y-auto">
            <Suspense fallback={<PageLoading />}>{renderCurrentView()}</Suspense>
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

      {/* Digital Acknowledgment Receipt Modal (Phase 13) */}
      {ackNotice && (
        <AckNoticeDialog
          message={ackNotice}
          onDismiss={() => setAckNotice(null)}
          onContinue={() => {
            setAckNotice(null);
            navigateTo('schedules');
          }}
        />
      )}
    </div>
  );
};
