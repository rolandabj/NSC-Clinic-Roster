/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Delete a roster: what goes with it, and a tick box before Delete, since it cannot be undone.
 * On the shared Dialog since Phase 7, slice 3a.
 */

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Schedule } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { Badge, Button, Checkbox, Dialog, Notice } from '../ui';

interface DeleteScheduleModalProps {
  isOpen: boolean;
  schedule: Schedule | null;
  shiftCount?: number;
  versionCount?: number;
  onClose: () => void;
  onConfirmDelete: (schedule: Schedule) => Promise<void> | void;
}

export const DeleteScheduleModal: React.FC<DeleteScheduleModalProps> = ({
  isOpen,
  schedule,
  shiftCount,
  versionCount,
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
  }, [isOpen, schedule]);

  if (!isOpen || !schedule) return null;

  const handleDelete = async () => {
    if (!confirmed || isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirmDelete(schedule);
    } finally {
      setIsDeleting(false);
    }
  };

  const counts = [
    shiftCount !== undefined ? `${shiftCount} ${shiftCount === 1 ? 'shift' : 'shifts'}` : '',
    versionCount !== undefined ? `${versionCount} saved ${versionCount === 1 ? 'copy' : 'copies'}` : '',
  ].filter(Boolean);

  return (
    <Dialog
      open
      // Closing is blocked while the delete is running.
      onClose={() => !isDeleting && onClose()}
      role="alertdialog"
      // It can open over Open a roster.
      stacked
      title={`Delete the roster ${schedule.name}?`}
      description="This cannot be undone."
      footer={
        <>
          <Button disabled={isDeleting} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" icon={Trash2} busy={isDeleting} disabled={!confirmed} onClick={handleDelete}>
            Delete the roster
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="space-y-1 rounded-lg border border-line bg-sunken p-3">
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{schedule.name}</span>
            <Badge tone={schedule.status === 'PUBLISHED' ? 'success' : 'neutral'}>
              {schedule.status === 'PUBLISHED' ? 'Published' : schedule.status === 'DRAFT' ? 'Draft' : 'Archived'}
            </Badge>
          </p>
          <p className="text-ink-muted">
            {formatDate(schedule.startDate)} to {formatDate(schedule.endDate)}, a goal of {schedule.hoursTargetFullTime} h for a full time nurse
          </p>
          {counts.length > 0 && <p className="text-ink-muted">{counts.join(' and ')}</p>}
        </div>
        <Notice tone="danger" title="Everything in this roster is deleted">
          All its shifts, saved copies, share links and the record of emails sent. It also leaves the roster list and every report. Later rosters
          recalculate their hours balances from the history that is left.
        </Notice>
        <Checkbox
          checked={confirmed}
          disabled={isDeleting}
          onChange={(e) => setConfirmed(e.target.checked)}
          label={`I want to delete the roster ${schedule.name} with all its shifts and history.`}
        />
      </div>
    </Dialog>
  );
};
