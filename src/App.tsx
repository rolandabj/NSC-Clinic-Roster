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

// The signed in app and the public roster page load on demand, so the sign in
// screen and public links don't download the whole app first.
const AppShell = lazy(() => import('./components/layout/AppShell').then((m) => ({ default: m.AppShell })));
const PublishedRosterView = lazy(() =>
  import('./components/views/PublishedRosterView').then((m) => ({ default: m.PublishedRosterView }))
);

function parsePublicLink(): { kind: 'published' | 'ack'; token: string; nurse?: string } | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  const [route, query = ''] = hash.split('?');
  const params = new URLSearchParams(query);
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
  if (!currentUser) {
    const publicLink = parsePublicLink();
    if (publicLink?.kind === 'ack') {
      return <AcknowledgePage token={publicLink.token} clinicName={clinicName} />;
    }
    if (publicLink?.kind === 'published') {
      return (
        <Suspense fallback={<PageLoading />}>
          <PublishedRosterView
            shareToken={publicLink.token}
            nurseIdParam={publicLink.nurse}
            onExitPreview={() => {
              window.location.href = window.location.origin;
            }}
          />
        </Suspense>
      );
    }
  }

  // 3. Everything else requires sign in.
  if (!currentUser) {
    return <LoginPage clinicName={clinicName} onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // 4. Authenticated session: render AppShell
  return (
    <Suspense fallback={<PageLoading label="Opening the roster…" />}>
      <AppShell currentUser={currentUser} />
    </Suspense>
  );
}


