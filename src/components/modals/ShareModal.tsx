/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Share dialog: links to view the published roster, and invitations for colleagues.
 */

import React, { useState, useEffect, useId } from 'react';
import {
  X,
  Share2,
  Globe,
  Lock,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Mail,
  UserPlus,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { syncPublicRoster, removePublicRoster } from '../../services/publish/publicRosterService';
import { ensurePublicRosters } from '../../services/publish/publicRosterService';
import { authService } from '../../services/auth/authService';
import { canEditClinicData } from '../../services/auth/access';
import {
  Schedule,
  ScheduleVersion,
  ShareLink,
  Invitation,
} from '../../types';
import { getRepository } from '../../services/repository';
import { useDialogA11y } from '../common/useDialogA11y';
import { notify, confirmDialog, type NoticeTone } from '../common/dialogs';

interface ShareModalProps {
  schedule: Schedule;
  latestPublishedVersion: ScheduleVersion | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPreview: (token: string) => void;
}

type TabType = 'view_links' | 'invite_editors';

export const ShareModal: React.FC<ShareModalProps> = ({
  schedule,
  latestPublishedVersion,
  isOpen,
  onClose,
  onOpenPreview,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('view_links');
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // New link state
  const [isPublic, setIsPublic] = useState(true);
  const [allowedEmailsInput, setAllowedEmailsInput] = useState('');

  // New invitation state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'EDITOR' | 'VIEWER'>('EDITOR');

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const repo = getRepository();

  const loadData = async () => {
    try {
      const [links, invites] = await Promise.all([
        repo.list('shareLinks'),
        repo.list('invitations'),
      ]);
      const schedLinks = links.filter((l) => l.scheduleId === schedule.id);
      setShareLinks(schedLinks);
      // Links made before public snapshots existed get one now (editors only).
      if (canEditClinicData(authService.getCurrentUser())) void ensurePublicRosters(schedLinks);
      setInvitations(invites.filter((i) => i.scheduleId === schedule.id));
    } catch (err) {
      console.error('Error loading share links:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, schedule.id]);

  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const triggerToast = (msg: string, tone: NoticeTone = 'success') => notify(msg, tone);

  // --- CREATE VIEW-ONLY LINK ---
  const handleCreateShareLink = async () => {
    if (!latestPublishedVersion) {
      notify('Publish the roster first. A link only ever shows the published roster, never your unpublished changes.', 'warning');
      return;
    }

    try {
      const emails = allowedEmailsInput
        .split(/[,\n]/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0 && e.includes('@'));

      const newLink: ShareLink = {
        id: uuidv4(),
        scheduleId: schedule.id,
        token: `sh_${crypto.randomUUID()}`,
        role: 'VIEWER',
        public: isPublic,
        allowedEmails: isPublic ? [] : emails,
        createdAt: new Date().toISOString(),
        revoked: false,
        pointsToVersionId: latestPublishedVersion.id,
      };

      await repo.create('shareLinks', newLink);
      await syncPublicRoster(newLink);
      triggerToast('Link made.');
      setAllowedEmailsInput('');
      loadData();
    } catch (err: any) {
      notify(`Couldn't make the link: ${err.message}`, 'error');
    }
  };

  // --- REGENERATE TOKEN ---
  const handleRegenerateToken = async (link: ShareLink) => {
    const ok = await confirmDialog({
      title: 'Make a new link?',
      message: 'This replaces the link with a new one. People with the old link will lose access, so you will need to send them the new one.',
      confirmLabel: 'Make new link',
      danger: true,
    });
    if (!ok) return;
    const newToken = `sh_${crypto.randomUUID()}`;
    try {
      // Regenerating keeps the link's revoked state; the old token stops working.
      await repo.update('shareLinks', link.id, { token: newToken });
      await removePublicRoster(link.token);
      await syncPublicRoster({ ...link, token: newToken });
      triggerToast('New link made. The old link no longer works.');
    } catch (err: any) {
      notify(`Couldn't make a new link: ${err.message}`, 'error');
    }
    loadData();
  };

  // --- REVOKE / UNREVOKE LINK ---
  const handleToggleRevoke = async (link: ShareLink) => {
    try {
      const revoked = !link.revoked;
      await repo.update('shareLinks', link.id, { revoked });
      await syncPublicRoster({ ...link, revoked });
      triggerToast(link.revoked ? 'Link turned back on.' : 'Link turned off.');
    } catch (err: any) {
      notify(`Couldn't change the link: ${err.message}`, 'error');
    }
    loadData();
  };

  // --- DELETE LINK ---
  const handleDeleteLink = async (linkId: string) => {
    const ok = await confirmDialog({
      title: 'Delete this link?',
      message: 'People with this link will lose access. This cannot be undone.',
      confirmLabel: 'Delete link',
      danger: true,
    });
    if (!ok) return;
    try {
      const link = shareLinks.find((l) => l.id === linkId);
      // The public copy goes first: it can't be found once its link record is gone.
      if (link) await removePublicRoster(link.token, repo);
      await repo.remove('shareLinks', linkId);
      triggerToast('Link deleted.');
    } catch (err: any) {
      notify(`Couldn't delete the link: ${err.message}`, 'error');
    }
    loadData();
  };

  // --- COPY LINK ---
  const handleCopyLink = (token: string) => {
    const origin = window.location.origin;
    const url = `${origin}/#published?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
    triggerToast('Link copied.');
  };

  // --- INVITE EDITOR / VIEWER ---
  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      notify('Please enter a valid email address.', 'warning');
      return;
    }

    try {
      const newInvite: Invitation = {
        id: uuidv4(),
        scheduleId: schedule.id,
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      await repo.create('invitations', newInvite);
      // No email is sent from here: the person signs in with Google and the owner approves them.
      triggerToast(`Invitation saved for ${newInvite.email}. No email is sent: ask them to sign in to the app, then approve them in Settings, Access & permissions.`);
      setInviteEmail('');
      loadData();
    } catch (err: any) {
      notify(`Couldn't save the invitation: ${err.message}`, 'error');
    }
  };

  const handleRemoveInvitation = async (invId: string) => {
    await repo.remove('invitations', invId);
    triggerToast('Invitation removed.');
    loadData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="text-base font-bold text-slate-900">Share</h2>
              </div>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                {schedule.name} · links to the published roster and invitations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 bg-white text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('view_links')}
            className={`py-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'view_links'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>Links to view ({shareLinks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invite_editors')}
            className={`py-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'invite_editors'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            <span>Invite colleagues ({invitations.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: VIEW-ONLY SHARE LINKS */}
          {activeTab === 'view_links' && (
            <div className="space-y-4">
              {/* Informational Banner */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-indigo-900 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                  <span>Links only show the published roster</span>
                </div>
                <p>
                  {latestPublishedVersion
                    ? `People with a link see version ${latestPublishedVersion.number}, the last one you published.`
                    : 'Nothing has been published yet.'}{' '}
                  Changes you haven't published stay private until you publish them.
                </p>
              </div>

              {/* Create New Link Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <h3 className="font-bold text-slate-900 text-xs">Make a new link</h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accessMode"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="text-indigo-600"
                      />
                      <span className="font-medium text-slate-800">Anyone with the link</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accessMode"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="text-indigo-600"
                      />
                      <span className="font-medium text-slate-800">Only people I name</span>
                      <span className="text-[10px] text-slate-500">(they sign in with Google)</span>
                    </label>
                  </div>

                  {!isPublic && (
                    <div className="space-y-1 pt-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Email addresses (separate them with commas or put one on each line):
                      </label>
                      <textarea
                        rows={2}
                        aria-label="Email addresses allowed to open the link"
                        value={allowedEmailsInput}
                        onChange={(e) => setAllowedEmailsInput(e.target.value)}
                        placeholder="nurse.mariam@gmail.com, doctor.ali@gmail.com"
                        className="w-full p-2 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleCreateShareLink}
                    disabled={!latestPublishedVersion}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded font-medium cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Make link</span>
                  </button>
                </div>
              </div>

              {/* Existing Links List */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Links:</h4>

                {shareLinks.length > 0 ? (
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded overflow-hidden">
                    {shareLinks.map((link) => (
                      <div
                        key={link.id}
                        className={`p-3 bg-white space-y-2 ${link.revoked ? 'opacity-50 bg-slate-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {link.public ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                                <Globe className="w-3 h-3" aria-hidden="true" /> Anyone with the link
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                <Lock className="w-3 h-3" aria-hidden="true" /> {link.allowedEmails.length} named {link.allowedEmails.length === 1 ? 'person' : 'people'}
                              </span>
                            )}

                            {link.revoked ? (
                              <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                                Turned off
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                On
                              </span>
                            )}

                            <span className="text-[10px] text-slate-400 font-mono">
                              Created {new Date(link.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {!link.revoked && (
                              <button
                                type="button"
                                onClick={() => onOpenPreview(link.token)}
                                className="inline-flex items-center gap-1 px-2 py-1 border border-slate-200 hover:bg-slate-100 text-indigo-700 rounded font-medium text-[11px] cursor-pointer"
                                title="See what people with this link see"
                              >
                                <Eye className="w-3 h-3" aria-hidden="true" />
                                <span>Preview</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleCopyLink(link.token)}
                              disabled={link.revoked}
                              className="inline-flex items-center gap-1 px-2 py-1 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded font-medium text-[11px] cursor-pointer"
                              title="Copy the link"
                            >
                              {copiedToken === link.token ? (
                                <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-500" aria-hidden="true" />
                              )}
                              <span>{copiedToken === link.token ? 'Copied!' : 'Copy link'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRegenerateToken(link)}
                              className="p-1 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded cursor-pointer"
                              title="Make a new link (the old one stops working)"
                              aria-label="Make a new link (the old one stops working)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleRevoke(link)}
                              className="px-2 py-1 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded text-[11px] cursor-pointer"
                              title={link.revoked ? 'Let people open this link again' : 'Stop the link working for now'}
                            >
                              {link.revoked ? 'Turn on' : 'Turn off'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                              title="Delete this link"
                              aria-label="Delete this link"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {/* URL snippet */}
                        <div className="font-mono text-[11px] bg-slate-50 p-1.5 rounded text-slate-600 truncate border border-slate-200">
                          {window.location.origin}/#published?token={link.token}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded">
                    No links yet. Use "Make link" above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INVITE EDITORS & COLLABORATORS */}
          {activeTab === 'invite_editors' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded text-purple-900 space-y-1 text-[11px]">
                <p className="font-bold">Who can do what:</p>
                <p>
                  <strong>Editors</strong> can change shifts and leave on the roster. <strong>Viewers</strong> can only look at it.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSendInvitation} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <h3 className="font-bold text-slate-900 text-xs">Invite a colleague</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="email"
                      required
                      aria-label="Colleague's email address"
                      placeholder="name@gmail.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <select
                      aria-label="What they can do"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium bg-white"
                    >
                      <option value="EDITOR">Editor (can change the roster)</option>
                      <option value="VIEWER">Viewer (can only look)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Save invitation</span>
                  </button>
                </div>
              </form>

              {/* Invitations List */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Invitations:</h4>
                {invitations.length > 0 ? (
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded overflow-hidden">
                    {invitations.map((inv) => (
                      <div key={inv.id} className="p-3 bg-white flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{inv.email}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                inv.role === 'EDITOR'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {inv.role === 'EDITOR' ? 'Editor' : 'Viewer'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              {inv.status === 'PENDING' ? 'Waiting' : inv.status === 'ACCEPTED' ? 'Accepted' : 'Cancelled'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Invited on {new Date(inv.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRemoveInvitation(inv.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                            title="Remove invitation"
                            aria-label={`Remove invitation for ${inv.email}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded">
                    No colleagues invited yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Only people you allow can change the roster.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
