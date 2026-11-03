/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Your access" (Checkpoint 8, on the shared Dialog), opened from the account menu: who is
 * signed in, their role, a notice while their account waits for approval or after access was
 * removed, and what they can do in plain words (accessWords.youCanDo). The owner gets a link to
 * Settings, Access and permissions.
 */

import React, { useEffect, useState } from 'react';
import { Check, LogOut, RefreshCw, X } from 'lucide-react';
import type { ClinicContextState } from '../../types/navigation';
import { authService, computePrivileges, UserProfile, MASTER_ADMIN_EMAIL } from '../../services/auth/authService';
import { roleLabel } from '../../services/auth/access';
import { youCanDo } from '../../services/auth/accessWords';
import { signOutSafely } from '../common/signOut';
import { notify } from '../common/dialogs';
import { Button, Dialog, Notice, cx } from '../ui';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: ClinicContextState;
  onUserChanged?: (user: UserProfile | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [checking, setChecking] = useState(false);

  useEffect(() => authService.subscribe(setCurrentUser), []);

  const handleSignOut = async () => {
    onClose();
    await signOutSafely();
  };

  const checkAgain = async () => {
    setChecking(true);
    try {
      const refreshed = await authService.refreshProfile();
      if (refreshed?.accessStatus === 'APPROVED') window.location.reload();
      else notify('Your account is still waiting for approval.', 'info');
    } catch (err: any) {
      notify(err?.message || 'Your account could not be checked. Check the connection and try again.', 'error');
    } finally {
      setChecking(false);
    }
  };

  const privileges = currentUser ? currentUser.privileges || computePrivileges(currentUser.role, !!currentUser.isManager) : null;
  const isOwner = currentUser?.role === 'OWNER';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      size="md"
      title="Your access"
      description={currentUser ? 'Who you are signed in as, and what you can do in the app.' : 'You are not signed in.'}
      footer={
        <>
          {currentUser && (
            <Button variant="secondary" icon={LogOut} onClick={handleSignOut} className="sm:mr-auto">
              Sign out
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </>
      }
    >
      {currentUser && privileges && (
        <div className="space-y-4 text-sm">
          {currentUser.accessStatus === 'PENDING' && (
            <Notice
              tone="warning"
              title="Waiting for approval"
              action={
                <Button size="sm" icon={RefreshCw} busy={checking} onClick={checkAgain}>
                  Check again
                </Button>
              }
            >
              The clinic owner ({MASTER_ADMIN_EMAIL}) must approve your account before you can see anything. Once they do, your role starts straight away.
            </Notice>
          )}
          {currentUser.accessStatus === 'REVOKED' && (
            <Notice tone="danger" title="Access removed">
              The clinic owner ({MASTER_ADMIN_EMAIL}) removed access for {currentUser.email}. Ask them if you need it back.
            </Notice>
          )}

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg border border-line p-3">
            <dt className="text-ink-muted">Name</dt>
            <dd className="min-w-0 font-semibold text-ink">
              {currentUser.name}
              {currentUser.nurseCode && <span className="font-normal text-ink-muted"> ({currentUser.nurseCode})</span>}
            </dd>
            <dt className="text-ink-muted">Email</dt>
            <dd className="min-w-0 break-all text-ink">{currentUser.email}</dd>
            <dt className="text-ink-muted">Role</dt>
            <dd className="text-ink">
              {roleLabel(currentUser)}
              {currentUser.seniorityName && <span className="text-ink-muted">, {currentUser.seniorityName}</span>}
            </dd>
          </dl>

          <section aria-labelledby="your-access-can" className="space-y-2">
            <h3 id="your-access-can" className="font-semibold text-ink">
              What you can do
            </h3>
            <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {youCanDo(privileges).map((item) => (
                <li key={item.words} className={cx('flex items-start gap-2', item.allowed ? 'text-ink' : 'text-ink-muted')}>
                  {item.allowed ? (
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                  )}
                  <span>
                    <span className="sr-only">{item.allowed ? 'Yes: ' : 'No: '}</span>
                    {item.words}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-ink-muted">Everyone signed in can look at the published rosters.</p>
          </section>

          {isOwner && (
            <p>
              <a href="#settings?tab=access-roles" onClick={onClose} className="inline-flex min-h-6 items-center font-semibold text-brand underline-offset-2 hover:underline">
                Change who has access in Settings, Access and permissions
              </a>
            </p>
          )}
        </div>
      )}
    </Dialog>
  );
};
