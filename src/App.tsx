/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Root Application Gate (Phase 3)
 * Enforces strict authentication requirement: users must log in before accessing
 * any clinical rosters, scheduling sheets, or management views.
 */

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { PageLoading } from './components/common/PageLoading';
import { AcknowledgePage } from './components/views/AcknowledgePage';
import { authService, UserProfile } from './services/auth/authService';
import { Building2, Loader2 } from 'lucide-react';
import { LoadErrorBoundary } from './components/common/LoadErrorBoundary';

// The signed in app and the public roster page load on demand, so the sign in
// screen and public links don't download the whole app first.
const AppShell = lazy(() => import('./components/layout/AppShell').then((m) => ({ default: m.AppShell })));
const PublishedRosterView = lazy(() =>
  import('./components/views/PublishedRosterView').then((m) => ({ default: m.PublishedRosterView }))
);
const MyRosterView = lazy(() => import('./components/views/MyRosterView').then((m) => ({ default: m.MyRosterView })));

function parsePublicLink(): { kind: 'published' | 'ack' | 'me'; token: string; nurse?: string } | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  const [route, query = ''] = hash.split('?');
  const params = new URLSearchParams(query);
  // A nurse's private page (#me?t=TOKEN).
  if (route === 'me') return { kind: 'me', token: params.get('t') || '' };
  const token = params.get('token') || params.get('ackToken') || '';
  if (!token) return null;
  if (route === 'ack') return { kind: 'ack', token };
  if (route === 'published') return { kind: 'published', token, nurse: params.get('nurse') || undefined };
  return null;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(!authService.isInitialized());
  const [clinicName, setClinicName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('clinic_roster_clinic_name');
      if (stored && stored !== 'Hope Valley Polyclinic' && stored !== 'Outpatient Clinic') {
        return stored;
      }
    }
    return 'American Hospital Nad Al Sheba OutPatient clinic';
  });

  useEffect(() => {
    // 1. Await the initial Firebase Auth session check
    authService.whenReady().then((user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });

    // 2. Subscribe to reactive auth updates (e.g. login, logout, token refresh)
    const unsub = authService.subscribe((user) => {
      setCurrentUser(user);
    });

    // The clinic name shown before sign in comes from the browser cache; it is
    // refreshed from Firestore once a user signs in.

    const handleClinicNameUpdated = (e: any) => {
      if (e.detail) {
        setClinicName(e.detail);
      }
    };
    window.addEventListener('clinic-name-updated', handleClinicNameUpdated);

    return () => {
      window.removeEventListener('clinic-name-updated', handleClinicNameUpdated);
      unsub();
    };
  }, []);

  // 1. Splash Screen while checking initial credentials
  if (isAuthChecking) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none">
        <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-base font-bold text-white tracking-tight">
              {clinicName}
            </h1>
            <p className="text-xs text-slate-400">Verifying clinic credentials...</p>
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500 mt-2" />
        </div>
      </div>
    );
  }

  // 2. Links that work without signing in: shared rosters (#published?token=...)
  // and roster receipt confirmations (#ack?token=...). Signed in users get the
  // same links inside the full app below.
  // A receipt link always shows the confirm page (signed in or not), so the receipt is
  // only confirmed by pressing its button.
  const ackLink = parsePublicLink();
  if (ackLink?.kind === 'ack') {
    return <AcknowledgePage token={ackLink.token} clinicName={clinicName} />;
  }
  // A nurse's private page looks the same signed in or not (it shows only her own shifts).
  if (ackLink?.kind === 'me') {
    return (
      <LoadErrorBoundary><Suspense fallback={<PageLoading />}>
        <MyRosterView token={ackLink.token} />
      </Suspense></LoadErrorBoundary>
    );
  }
  if (!currentUser) {
    const publicLink = parsePublicLink();
    if (publicLink?.kind === 'published') {
      return (
        <LoadErrorBoundary><Suspense fallback={<PageLoading />}>
          <PublishedRosterView
            shareToken={publicLink.token}
            nurseIdParam={publicLink.nurse}
            onExitPreview={() => {
              window.location.href = window.location.origin;
            }}
          />
        </Suspense></LoadErrorBoundary>
      );
    }
  }

  // 3. Everything else requires sign in.
  if (!currentUser) {
    return <LoginPage clinicName={clinicName} onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // 4. Authenticated session: render AppShell
  return (
    <LoadErrorBoundary><Suspense fallback={<PageLoading label="Opening the roster…" />}>
      <AppShell currentUser={currentUser} />
    </Suspense></LoadErrorBoundary>
  );
}


