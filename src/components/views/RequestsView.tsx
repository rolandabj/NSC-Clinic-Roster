/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Requests (UI overhaul Phase 6, slice 4): the leave, days off and shifts nurses asked for, as
 * its own menu item for the people who decide them (planners and managers). Waiting holds the
 * requests still to decide; All holds every day off and shift request, decided or not. The
 * address keeps the open tab (#requests?tab=all).
 */
import React, { useEffect, useState } from 'react';
import { authService } from '../../services/auth/authService';
import { countPendingApprovals } from '../../services/requests/staffRequestService';
import { getRepository } from '../../services/repository';
import type { DutyWindow, Nurse } from '../../types';
import type { AddressChange, ClinicContextState } from '../../types/navigation';
import { PageHeader, TabPanel, Tabs } from '../ui';
import { AllRequestsPanel } from './AllRequestsPanel';
import { ApprovalsQueuePanel } from './ApprovalsQueuePanel';

interface RequestsViewProps {
  context: ClinicContextState;
  /** The open tab from the address: 'all', else Waiting. */
  tab?: string;
  onAddressChange?: AddressChange;
  /** The number still waiting, for the count beside Requests in the menu. */
  onWaitingChange?: (waiting: number) => void;
}

export const RequestsView: React.FC<RequestsViewProps> = ({ tab, onAddressChange, onWaitingChange }) => {
  const currentUser = authService.getCurrentUser();
  const open = tab === 'all' ? 'all' : 'waiting';
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [dutyWindows, setDutyWindows] = useState<DutyWindow[]>([]);
  const [waiting, setWaiting] = useState<number | undefined>(undefined);

  useEffect(() => {
    const repo = getRepository();
    Promise.all([repo.list('nurses'), repo.list('dutyWindows')])
      .then(([n, d]) => {
        setNurses(n);
        setDutyWindows(d);
      })
      .catch((err) => console.error('[RequestsView] load error:', err));
  }, []);

  const decided = (count: number) => {
    setWaiting(count);
    onWaitingChange?.(count);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6">
      <PageHeader title="Requests" meta={<span>The leave, days off and shifts nurses asked for.</span>} />
      <Tabs
        label="Requests"
        idPrefix="requests"
        value={open}
        onChange={(id) => onAddressChange?.({ tab: id === 'all' ? 'all' : undefined }, 'push')}
        tabs={[
          { id: 'waiting', label: 'Waiting', count: waiting, countTone: 'warning' },
          { id: 'all', label: 'All day off and shift requests' },
        ]}
      />
      <TabPanel idPrefix="requests" id="waiting" value={open}>
        {open === 'waiting' && (
          <ApprovalsQueuePanel currentUser={currentUser || undefined} dutyWindows={dutyWindows} onLoaded={decided} />
        )}
      </TabPanel>
      <TabPanel idPrefix="requests" id="all" value={open}>
        {open === 'all' && (
          <AllRequestsPanel
            currentUser={currentUser || undefined}
            nurses={nurses}
            dutyWindows={dutyWindows}
            // A decision here changes the number waiting beside Requests in the menu (Checkpoint 6).
            onChanged={() => countPendingApprovals().then(decided).catch(() => {})}
          />
        )}
      </TabPanel>
    </div>
  );
};
