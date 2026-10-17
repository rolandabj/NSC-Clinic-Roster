/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Share dialog: links to view the published roster. The Invitations tab, which saved invitations
 * nothing read, was removed in Phase 7, slice 6a (the owner's choice): access is given in Settings,
 * Access and permissions.
 */

import React, { useState, useEffect } from 'react';
import { Check, Copy, Eye, RotateCcw, Share2, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { syncPublicRoster, removePublicRoster } from '../../services/publish/publicRosterService';
import { ensurePublicRosters } from '../../services/publish/publicRosterService';
import { authService } from '../../services/auth/authService';
import { canEditClinicData, permissionsFor } from '../../services/auth/access';
import {
  Schedule,
  ScheduleVersion,
  ShareLink,
} from '../../types';
import { getRepository } from '../../services/repository';
import { formatDate } from '../../utils/dateUtils';
import { Badge, Button, Dialog, EmptyState, Field, IconButton, Notice, Textarea } from '../ui';
import { notify, confirmDialog, type NoticeTone } from '../common/dialogs';

interface ShareModalProps {
  schedule: Schedule;
  latestPublishedVersion: ScheduleVersion | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPreview: (token: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  schedule,
  latestPublishedVersion,
  isOpen,
  onClose,
  onOpenPreview,
}) => {
  // Access to the app is given in Settings, Access and permissions, which only the owner opens.
  const isOwner = permissionsFor(authService.getCurrentUser()).isOwner;
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);

  // New link state
  const [isPublic, setIsPublic] = useState(true);
  const [allowedEmailsInput, setAllowedEmailsInput] = useState('');

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const repo = getRepository();

  const loadData = async () => {
    try {
      const links = await repo.list('shareLinks');
      const schedLinks = links.filter((l) => l.scheduleId === schedule.id);
      setShareLinks(schedLinks);
      // Links made before public snapshots existed get one now (editors only).
      if (canEditClinicData(authService.getCurrentUser())) void ensurePublicRosters(schedLinks);
    } catch (err) {
      console.error('Error loading share links:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, schedule.id]);


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

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title="Share links"
      description={`${schedule.name}: links that let people look at the published roster.`}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4 text-sm">
          <div className="space-y-4">
            <Notice tone="info" title="Links only show the published roster">
              {latestPublishedVersion ? `People with a link see version ${latestPublishedVersion.number}, the last one you published.` : 'Nothing has been published yet.'}{' '}
              Changes you haven't published stay private until you publish them.
            </Notice>

            <section aria-labelledby="share-new" className="space-y-3 rounded-lg border border-line p-4">
              <h3 id="share-new" className="font-semibold text-ink">
                Make a new link
              </h3>
              <fieldset className="flex flex-wrap gap-x-6 gap-y-2">
                <legend className="sr-only">Who can open it</legend>
                <label className="flex items-center gap-2">
                  <input type="radio" name="accessMode" className="size-4 accent-brand" checked={isPublic} onChange={() => setIsPublic(true)} />
                  Anyone with the link
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="accessMode" className="size-4 accent-brand" checked={!isPublic} onChange={() => setIsPublic(false)} />
                  Only people I name (they sign in with Google)
                </label>
              </fieldset>
              {!isPublic && (
                <Field label="Email addresses" hint="Separate them with commas, or put one on each line.">
                  {(f) => <Textarea {...f} rows={2} value={allowedEmailsInput} onChange={(e) => setAllowedEmailsInput(e.target.value)} className="font-mono" />}
                </Field>
              )}
              <Button variant="primary" icon={Share2} disabled={!latestPublishedVersion} onClick={handleCreateShareLink}>
                Make the link
              </Button>
            </section>

            {shareLinks.length > 0 ? (
              <ul className="divide-y divide-line rounded-lg border border-line" aria-label="Links">
                {shareLinks.map((link, i) => {
                  const who = link.public ? 'Anyone with the link' : `${link.allowedEmails.length} named ${link.allowedEmails.length === 1 ? 'person' : 'people'}`;
                  const name = `link ${i + 1} (${who.toLowerCase()})`;
                  return (
                    <li key={link.id} className="space-y-2 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex flex-wrap items-center gap-2">
                          <Badge tone={link.public ? 'info' : 'warning'}>{who}</Badge>
                          <Badge tone={link.revoked ? 'danger' : 'success'}>{link.revoked ? 'Turned off' : 'On'}</Badge>
                          <span className="text-xs text-ink-muted">Made {formatDate(link.createdAt)}</span>
                        </span>
                        <span className="flex flex-wrap items-center gap-1.5">
                          {!link.revoked && (
                            <Button size="sm" icon={Eye} aria-label={`Preview ${name}`} onClick={() => onOpenPreview(link.token)}>
                              Preview
                            </Button>
                          )}
                          <Button size="sm" icon={copiedToken === link.token ? Check : Copy} disabled={link.revoked} aria-label={`Copy ${name}`} onClick={() => handleCopyLink(link.token)}>
                            {copiedToken === link.token ? 'Copied' : 'Copy link'}
                          </Button>
                          <Button size="sm" aria-label={`${link.revoked ? 'Turn on' : 'Turn off'} ${name}`} onClick={() => handleToggleRevoke(link)}>
                            {link.revoked ? 'Turn on' : 'Turn off'}
                          </Button>
                          <IconButton label={`Make a new link for ${name} (the old link stops working)`} icon={RotateCcw} onClick={() => handleRegenerateToken(link)} />
                          <IconButton label={`Delete ${name}`} icon={Trash2} onClick={() => handleDeleteLink(link.id)} />
                        </span>
                      </div>
                      <p className="truncate rounded border border-line bg-sunken px-2 py-1 font-mono text-xs text-ink-muted">
                        {window.location.origin}/#published?token={link.token}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState icon={Share2} title="No links yet">
                Use Make the link above.
              </EmptyState>
            )}
          </div>
        <Notice
          tone="info"
          title="To give a colleague access to the app"
          action={
            isOwner && (
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  window.location.hash = 'settings?tab=access-roles';
                }}
              >
                Open Access and permissions
              </Button>
            )
          }
        >
          {isOwner
            ? 'Add them in Settings, Access and permissions. The links here only let people look at the published roster.'
            : 'Ask the clinic owner to add them in Settings, Access and permissions. The links here only let people look at the published roster.'}
        </Notice>

      </div>
    </Dialog>
  );
};
