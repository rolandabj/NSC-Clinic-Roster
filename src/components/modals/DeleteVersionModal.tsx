/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Delete one version from History: what it holds, what deleting it means, and a tick box before
 * Delete, since it cannot be undone. Deleting a whole roster is only in the roster's More menu.
 * On the shared Dialog since Phase 7, slice 5.
 */

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { ScheduleVersion } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';
import { versionKind, versionKindLabel, versionName } from '../../services/history/versionKinds';
import { Badge, Button, Checkbox, Dialog, Notice } from '../ui';

interface DeleteVersionModalProps {
  isOpen: boolean;
  version: ScheduleVersion | null;
  scheduleName: string;
  isCurrentActiveDraft: boolean;
  onClose: () => void;
  onConfirmDelete: (version: ScheduleVersion) => Promise<void> | void;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const DeleteVersionModal: React.FC<DeleteVersionModalProps> = ({
  isOpen,
  version,
  scheduleName,
  isCurrentActiveDraft,
  onClose,
  onConfirmDelete,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmed(false);
      setIsDeleting(false);
    }
  }, [isOpen, version]);

  if (!isOpen || !version) return null;

  const name = versionName(version);
  const kind = versionKind(version);
  const shiftCount = version.snapshot.assignments?.length || 0;
  const leaveCount = version.snapshot.leaveEntries?.length || 0;
  const pinCount = version.snapshot.locks?.length || 0;

  const handleDelete = async () => {
    if (!confirmed || isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirmDelete(version);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open
      // Closing is blocked while the delete is running.
      onClose={() => !isDeleting && onClose()}
      role="alertdialog"
      // It can open over Open larger.
      stacked
      title={`Delete ${name.toLowerCase()} of ${scheduleName}?`}
      description="This cannot be undone."
      footer={
        <>
          <Button disabled={isDeleting} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" icon={Trash2} busy={isDeleting} disabled={!confirmed} onClick={handleDelete}>
            Delete
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="space-y-1 rounded-lg border border-line bg-sunken p-3">
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{name}</span>
            <Badge tone={kind === 'PUBLISHED' ? 'success' : kind === 'BACKUP' ? 'warning' : 'neutral'}>{versionKindLabel(kind)}</Badge>
            {isCurrentActiveDraft && <Badge tone="brand">Current</Badge>}
          </p>
          {version.note && <p className="text-ink">{version.note}</p>}
          <p className="text-ink-muted">
            {kind === 'BACKUP' ? 'Kept' : 'Saved'} by {version.author || 'a planner'} on {formatDateTime(version.timestamp)}
          </p>
          <p className="text-ink-muted">
            {plural(shiftCount, 'shift', 'shifts')}, {plural(leaveCount, 'leave entry', 'leave entries')} and {plural(pinCount, 'pinned day', 'pinned days')}
          </p>
        </div>
        {kind === 'PUBLISHED' && (
          <Notice tone="warning" title="This version was published">
            Nurses were sent it, and their share links and "I've seen it" replies may still point to it.
          </Notice>
        )}
        {isCurrentActiveDraft && (
          <Notice tone="info" title="This is the roster's current version">
            The shifts on the roster stay as they are; only this saved copy is deleted.
          </Notice>
        )}
        <Checkbox
          checked={confirmed}
          disabled={isDeleting}
          onChange={(e) => setConfirmed(e.target.checked)}
          label={`I understand this cannot be undone. Delete ${name.toLowerCase()}.`}
        />
      </div>
    </Dialog>
  );
};
