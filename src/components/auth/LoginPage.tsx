/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Sign in page shown before entering the clinic workspace.
 */

import React, { useEffect, useState } from 'react';
import { Building2, ExternalLink, Loader2 } from 'lucide-react';
import { authService, UserProfile } from '../../services/auth/authService';
import { PublicPageFrame } from '../common/PublicPageFrame';
import { IconButton, Notice } from '../ui';
import { X } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess?: (user: UserProfile) => void;
  clinicName?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, clinicName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  const [displayName, setDisplayName] = useState<string>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('clinic_roster_clinic_name') : null;
    if (clinicName && clinicName !== 'Hope Valley Polyclinic' && clinicName !== 'Outpatient Clinic') return clinicName;
    if (stored && stored !== 'Hope Valley Polyclinic' && stored !== 'Outpatient Clinic') return stored;
    return 'American Hospital Nad Al Sheba OutPatient clinic';
  });

  useEffect(() => {
    document.title = 'Sign in · NSC Clinic Roster';
  }, []);

  useEffect(() => {
    if (clinicName) {
      setDisplayName(clinicName);
    }
  }, [clinicName]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await authService.signInWithGoogle();
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign in did not finish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicPageFrame clinicName={displayName}>
      <div className="mx-auto max-w-md pt-6">
        <section className="space-y-5 rounded-xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <div className="space-y-2 text-center">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Building2 className="size-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">{displayName}</h1>
            <p className="text-sm text-ink-muted">
              Sign in with your Google account to open the clinic roster.
            </p>
          </div>

          {errorMessage && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Notice tone="danger" live title="Could not sign in" className="flex-1">
                  {errorMessage}
                </Notice>
                <IconButton label="Close message" icon={X} onClick={() => setErrorMessage(null)} />
              </div>
              {isInIframe && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-sunken px-3 py-2 text-xs text-ink-muted">
                  <span>Sign in popups can be blocked inside an embedded frame.</span>
                  <a
                    href={typeof window !== 'undefined' ? window.location.href : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-control bg-surface px-2.5 py-1 text-xs font-semibold text-ink hover:bg-sunken"
                  >
                    <span>Open in a new tab</span>
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          )}

          {isInIframe && !errorMessage && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-sunken px-3 py-2 text-xs text-ink-muted">
              <span>Using the preview frame? You can also open the app in its own tab.</span>
              <a
                href={typeof window !== 'undefined' ? window.location.href : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-control bg-surface px-2.5 py-1 text-xs font-semibold text-ink hover:bg-sunken"
              >
                <span>Open in a new tab</span>
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            aria-busy={isLoading || undefined}
            className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-control bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-card transition-colors hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin text-brand" aria-hidden="true" />
                <span>Signing in with Google…</span>
              </>
            ) : (
              <>
                <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        </section>
      </div>
    </PublicPageFrame>
  );
};
