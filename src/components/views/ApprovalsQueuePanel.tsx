/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Requests screen's Waiting tab (UI overhaul Phase 6, slice 4): the leave and the day off
 * or shift requests still waiting for a decision, each approved or declined after a short
 * question with an optional note for the nurse. Planners and managers (canApprove() in
 * firestore.rules) see it.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Check, RefreshCw, X } from 'lucide-react';
import { UserProfile } from '../../services/auth/authService';
import { listPendingApprovals, decideRequest } from '../../services/requests/staffRequestService';
import { decisionTitle, waitingDayText, waitingLeaveText } from '../../services/requests/waitingRequests';
import type { DutyWindow } from '../../types';
import { notify } from '../common/dialogs';
import { Button, DataTable, Dialog, EmptyState, ErrorState, Field, LoadingState, Textarea, type Column } from '../ui';

interface ApprovalsQueuePanelProps {
  currentUser?: UserProfile;
  dutyWindows?: DutyWindow[];
  /** After each decision, with the number still waiting. */
  onRequestDecided?: (waiting: number) => void;
  /** After each load, with the number waiting (for the counts beside the tab and in the menu). */
  onLoaded?: (waiting: number) => void;
}

interface Waiting {
  id: string;
  kind: 'LEAVE' | 'AVAILABILITY';
  nurseName: string;
  nurseCode: string;
  what: string;
  note?: string;
}

export const ApprovalsQueuePanel: React.FC<ApprovalsQueuePanelProps> = ({ currentUser, dutyWindows = [], onRequestDecided, onLoaded }) => {
  const [leaves, setLeaves] = useState<Waiting[]>([]);
  const [days, setDays] = useState<Waiting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [decision, setDecision] = useState<{ item: Waiting; decision: 'APPROVED' | 'REJECTED' } | null>(null);
  const [note, setNote] = useState('');

  // Only the latest load is shown: one started before the shift names arrived may finish last.
  const loadRun = useRef(0);
  const load = async () => {
    const run = ++loadRun.current;
    setIsLoading(true);
    try {
      const data = await listPendingApprovals();
      if (run !== loadRun.current) return undefined;
      setLeaves(
        data.leaveRequests.map((l) => ({ id: l.id, kind: 'LEAVE', nurseName: l.nurseName, nurseCode: l.nurseCode, what: waitingLeaveText(l), note: l.note }))
      );
      setDays(
        data.availabilityRequests.map((a) => ({ id: a.id, kind: 'AVAILABILITY', nurseName: a.nurseName, nurseCode: a.nurseCode, what: waitingDayText(a, dutyWindows), note: a.note }))
      );
      setLoadError(false);
      const waiting = data.leaveRequests.length + data.availabilityRequests.length;
      onLoaded?.(waiting);
      return waiting;
    } catch (err) {
      if (run !== loadRun.current) return undefined;
      console.error('[ApprovalsQueuePanel] fetch error:', err);
      setLoadError(true);
      return undefined;
    } finally {
      if (run === loadRun.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // The shift names arrive with the screen's data; the words follow them.
  }, [dutyWindows.length]);

  const open = (item: Waiting, d: 'APPROVED' | 'REJECTED') => {
    setNote('');
    setDecision({ item, decision: d });
  };

  const decide = async () => {
    if (!decision) return;
    setIsBusy(true);
    try {
      await decideRequest(currentUser, decision.item.kind, decision.item.id, decision.decision, note.trim() || undefined);
      notify(`${decision.item.nurseName}'s request ${decision.decision === 'APPROVED' ? 'approved' : 'declined'}.`, 'success');
      setDecision(null);
      const waiting = await load();
      if (waiting !== undefined) onRequestDecided?.(waiting);
    } catch (err: any) {
      notify(`The decision was not saved: ${err.message}`, 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const columns = (whatHeader: string): Column<Waiting>[] => [
    {
      key: 'nurse',
      header: 'Nurse',
      sortValue: (r) => r.nurseName,
      cell: (r) => (
        <span className="block">
          <span className="block">{r.nurseName}</span>
          {r.nurseCode && <span className="block text-xs font-normal text-ink-muted">{r.nurseCode}</span>}
        </span>
      ),
    },
    { key: 'what', header: whatHeader, cell: (r) => r.what },
    { key: 'note', header: 'Note', cell: (r) => (r.note ? <span className="block max-w-64">{r.note}</span> : <span className="text-ink-muted">None</span>) },
    {
      key: 'decide',
      header: 'Decision',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (r) => (
        <span className="inline-flex gap-2">
          <Button size="sm" variant="primary" icon={Check} disabled={isBusy} onClick={() => open(r, 'APPROVED')} aria-label={`Approve ${r.nurseName}: ${r.what}`}>
            Approve
          </Button>
          <Button size="sm" icon={X} disabled={isBusy} onClick={() => open(r, 'REJECTED')} aria-label={`Decline ${r.nurseName}: ${r.what}`}>
            Decline
          </Button>
        </span>
      ),
    },
  ];

  const total = leaves.length + days.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-muted" role="status">
          {isLoading ? 'Loading…' : loadError ? '' : total === 0 ? 'Nothing is waiting.' : `${total} ${total === 1 ? 'request is' : 'requests are'} waiting for a decision.`}
        </p>
        <Button icon={RefreshCw} onClick={load} disabled={isLoading || isBusy}>
          Refresh
        </Button>
      </div>

      {isLoading && total === 0 ? (
        <LoadingState label="Loading the waiting requests…" />
      ) : loadError ? (
        <ErrorState title="The waiting requests couldn't be loaded" onRetry={load}>
          Check your internet connection and try again.
        </ErrorState>
      ) : total === 0 ? (
        <EmptyState icon={Check} title="Nothing is waiting">
          Every request has been approved or declined. You can see them all in the All day off and shift requests tab.
        </EmptyState>
      ) : (
        <>
          {leaves.length > 0 && (
            <section aria-labelledby="waiting-leave" className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
              <h3 id="waiting-leave" className="border-b border-line px-4 py-3 font-semibold text-ink">
                Leave ({leaves.length})
              </h3>
              <DataTable caption="Leave waiting" rows={leaves} rowKey={(r) => r.id} columns={columns('Leave')} />
            </section>
          )}
          {days.length > 0 && (
            <section aria-labelledby="waiting-days" className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
              <h3 id="waiting-days" className="border-b border-line px-4 py-3 font-semibold text-ink">
                Days off and shifts ({days.length})
              </h3>
              <DataTable caption="Days off and shifts waiting" rows={days} rowKey={(r) => r.id} columns={columns('Asks for')} />
            </section>
          )}
        </>
      )}

      <Dialog
        open={!!decision}
        onClose={() => setDecision(null)}
        size="sm"
        title={decision ? decisionTitle(decision.decision, decision.item.nurseName) : ''}
        description={decision?.item.what}
        footer={
          <>
            <Button onClick={() => setDecision(null)}>Cancel</Button>
            <Button variant={decision?.decision === 'APPROVED' ? 'primary' : 'danger'} icon={decision?.decision === 'APPROVED' ? Check : X} busy={isBusy} onClick={decide}>
              {decision?.decision === 'APPROVED' ? 'Approve' : 'Decline'}
            </Button>
          </>
        }
      >
        <Field label="Note for the nurse" optional hint="The nurse sees it under My requests. It is also in their email when those emails are turned on.">
          {(f) => <Textarea {...f} rows={3} value={note} onChange={(e) => setNote(e.target.value)} />}
        </Field>
      </Dialog>
    </div>
  );
};
