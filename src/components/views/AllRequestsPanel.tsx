/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * All requests: every day off and shift request of every nurse, whatever its
 * decision (waiting, approved or declined). Planners and managers can approve,
 * decline, put back to waiting, change or delete any of them. An approved day
 * off keeps its pinned day off in step (see staffRequestService). On the shared
 * table, fields and dialog since Phase 7, slice 2.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Check, Pencil, RefreshCw, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { UserProfile } from '../../services/auth/authService';
import {
  decideRequest,
  deleteAvailabilityRequest,
  listAllAvailabilityRequests,
  reopenAvailabilityRequest,
  updateAvailabilityRequest,
} from '../../services/requests/staffRequestService';
import { AvailabilityRequest, DutyWindow, Nurse } from '../../types';
import { formatDayDate, localTodayIso } from '../../utils/dateUtils';
import { confirmDialog, notify } from '../common/dialogs';
import { Badge, Button, DataTable, DateInput, Dialog, ErrorState, Field, Input, LoadingState, Notice, Select, type Column, type Tone } from '../ui';

interface AllRequestsPanelProps {
  currentUser?: UserProfile;
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  onChanged?: () => void;
}

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
type KindFilter = 'ALL' | 'DAY_OFF' | 'SHIFT';

const STATUS: Record<AvailabilityRequest['status'], { label: string; tone: Tone }> = {
  PENDING: { label: 'Waiting', tone: 'warning' },
  APPROVED: { label: 'Approved', tone: 'success' },
  REJECTED: { label: 'Declined', tone: 'neutral' },
};

interface Draft {
  id: string;
  nurseName: string;
  date: string;
  available: boolean;
  preferredDutyWindowId: string;
  note: string;
}

export const AllRequestsPanel: React.FC<AllRequestsPanelProps> = ({ currentUser, nurses, dutyWindows, onChanged }) => {
  const [requests, setRequests] = useState<AvailabilityRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [kind, setKind] = useState<KindFilter>('ALL');
  const [nurseId, setNurseId] = useState('ALL');
  const [fromDate, setFromDate] = useState(localTodayIso(-31));
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftError, setDraftError] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  // A changed date or request clears the last refusal.
  useEffect(() => setDraftError(''), [draft?.date, draft?.available, draft?.preferredDutyWindowId]);

  const nurseMap = useMemo(() => new Map(nurses.map((n) => [n.id, n])), [nurses]);
  const dutyMap = useMemo(() => new Map(dutyWindows.map((d) => [d.id, d])), [dutyWindows]);

  const load = async () => {
    setIsLoading(true);
    try {
      setRequests(await listAllAvailabilityRequests());
      setLoadError(null);
    } catch (err: any) {
      setLoadError(err?.message || String(err));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const shown = requests.filter(
    (r) =>
      (status === 'ALL' || r.status === status) &&
      (kind === 'ALL' || (kind === 'DAY_OFF' ? !r.available : r.available)) &&
      (nurseId === 'ALL' || r.nurseId === nurseId) &&
      (!fromDate || r.date >= fromDate)
  );

  /** Runs one change, then reloads the list and tells the rest of the page. */
  const run = async (id: string, action: () => Promise<unknown>, done: string) => {
    setBusyId(id);
    try {
      await action();
      notify(done, 'success');
      await load();
      onChanged?.();
    } catch (err: any) {
      notify(`Not saved: ${err?.message || err}`, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const describe = (r: AvailabilityRequest) =>
    r.available
      ? `Shift${r.preferredDutyWindowId ? `: ${dutyMap.get(r.preferredDutyWindowId)?.acronym || 'unknown shift'}` : ''}`
      : 'Day off';

  const handleDelete = async (r: AvailabilityRequest) => {
    const name = nurseMap.get(r.nurseId)?.fullName || 'this nurse';
    const ok = await confirmDialog({
      title: 'Delete the request?',
      message: `Delete ${name}'s ${describe(r).toLowerCase()} request for ${formatDayDate(r.date)}?${
        !r.available && r.status === 'APPROVED' ? ' The pinned day off goes too, so the nurse can be given a shift that day.' : ''
      }`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (ok) run(r.id, () => deleteAvailabilityRequest(currentUser, r.id), 'Request deleted.');
  };

  const openDraft = (r: AvailabilityRequest) => {
    setDraftError('');
    setDraft({
      id: r.id,
      nurseName: nurseMap.get(r.nurseId)?.fullName || 'Unknown nurse',
      date: r.date,
      available: r.available,
      preferredDutyWindowId: r.preferredDutyWindowId || '',
      note: r.note || '',
    });
  };

  // The dialog stays open until the change is saved; a refusal shows in it (Phase 7).
  const saveDraft = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!draft) return;
    if (!draft.date) {
      setDraftError('Enter the date, like 18-11-2026.');
      return;
    }
    setIsSavingDraft(true);
    try {
      await updateAvailabilityRequest(currentUser, draft.id, {
        date: draft.date,
        available: draft.available,
        preferredDutyWindowId: draft.available ? draft.preferredDutyWindowId || null : null,
        note: draft.note,
      });
      setDraft(null);
      notify('Request changed.', 'success');
      await load();
      onChanged?.();
    } catch (err: any) {
      setDraftError(`The request was not saved: ${err?.message || err}`);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const nameOf = (r: AvailabilityRequest) => nurseMap.get(r.nurseId)?.fullName || 'Unknown nurse';
  const what = (r: AvailabilityRequest) => `${nameOf(r)}: ${describe(r).toLowerCase()} on ${formatDayDate(r.date)}`;

  const columns: Column<AvailabilityRequest>[] = [
    { key: 'date', header: 'Date', sortValue: (r) => r.date, cell: (r) => <span className="whitespace-nowrap">{formatDayDate(r.date)}</span> },
    { key: 'nurse', header: 'Nurse', sortValue: nameOf, cell: nameOf, phone: 'title' },
    { key: 'request', header: 'Request', cell: describe },
    {
      key: 'status',
      header: 'Status',
      sortValue: (r) => STATUS[r.status].label,
      cell: (r) => (
        <span className="block">
          <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>
          {r.reviewedByUserName && r.status !== 'PENDING' && <span className="mt-0.5 block text-xs text-ink-muted">by {r.reviewedByUserName}</span>}
        </span>
      ),
    },
    {
      key: 'note',
      header: 'Note',
      cell: (r) => (
        <span className="block max-w-64">
          {r.note || <span className="text-ink-muted">None</span>}
          {r.reviewNotes && <span className="mt-0.5 block text-xs text-ink-muted">Decision note: {r.reviewNotes}</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (r) => {
        const busy = busyId === r.id;
        return (
          <span className="inline-flex flex-wrap justify-end gap-2">
            {r.status !== 'APPROVED' && (
              <Button size="sm" icon={Check} disabled={busy} aria-label={`Approve ${what(r)}`} onClick={() => run(r.id, () => decideRequest(currentUser, 'AVAILABILITY', r.id, 'APPROVED'), 'Request approved.')}>
                Approve
              </Button>
            )}
            {r.status !== 'REJECTED' && (
              <Button size="sm" icon={X} disabled={busy} aria-label={`Decline ${what(r)}`} onClick={() => run(r.id, () => decideRequest(currentUser, 'AVAILABILITY', r.id, 'REJECTED'), 'Request declined.')}>
                Decline
              </Button>
            )}
            {r.status !== 'PENDING' && (
              <Button size="sm" icon={RotateCcw} disabled={busy} aria-label={`Put back to waiting: ${what(r)}`} onClick={() => run(r.id, () => reopenAvailabilityRequest(currentUser, r.id), 'Request put back to waiting.')}>
                Put back to waiting
              </Button>
            )}
            <Button size="sm" icon={Pencil} disabled={busy} aria-label={`Change ${what(r)}`} onClick={() => openDraft(r)}>
              Change
            </Button>
            <Button size="sm" icon={Trash2} disabled={busy} aria-label={`Delete ${what(r)}`} onClick={() => handleDelete(r)}>
              Delete
            </Button>
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-lg border border-line bg-surface p-4 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink">All day off and shift requests</h2>
            <p className="mt-0.5 text-sm text-ink-muted">
              Every request, whether it is waiting, approved or declined. Approving a day off pins it on the roster. Declining,
              putting it back to waiting or deleting it unpins it, so the nurse can be given a shift that day.
            </p>
          </div>
          <Button icon={RefreshCw} onClick={load} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <Field label="Status">
            {(f) => (
              <Select {...f} value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
                <option value="ALL">All</option>
                <option value="PENDING">Waiting</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Declined</option>
              </Select>
            )}
          </Field>
          <Field label="Type">
            {(f) => (
              <Select {...f} value={kind} onChange={(e) => setKind(e.target.value as KindFilter)}>
                <option value="ALL">All</option>
                <option value="DAY_OFF">Day off</option>
                <option value="SHIFT">Shift</option>
              </Select>
            )}
          </Field>
          <Field label="Nurse">
            {(f) => (
              <Select {...f} value={nurseId} onChange={(e) => setNurseId(e.target.value)}>
                <option value="ALL">All nurses</option>
                {[...nurses].sort((a, b) => a.fullName.localeCompare(b.fullName)).map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.fullName}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="From">
            {(f) => <DateInput {...f} value={fromDate} onChange={setFromDate} />}
          </Field>
          <p className="text-sm text-ink-muted lg:pb-2" role="status">
            {shown.length} {shown.length === 1 ? 'request' : 'requests'} shown
          </p>
        </div>
      </div>

      {isLoading && requests.length === 0 ? (
        <LoadingState label="Loading the requests…" />
      ) : loadError ? (
        <ErrorState title="The requests couldn't be loaded" onRetry={load}>
          {loadError}
        </ErrorState>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
          <DataTable
            caption="All day off and shift requests"
            rows={shown}
            rowKey={(r) => r.id}
            columns={columns}
            initialSort={{ key: 'date', direction: 'ascending' }}
            empty={<p className="px-4 py-8 text-center text-ink-muted">No requests match these filters.</p>}
          />
        </div>
      )}

      <Dialog
        open={!!draft}
        onClose={() => !isSavingDraft && setDraft(null)}
        title={draft ? `Change ${draft.nurseName}'s request` : ''}
        description="The decision stays as it is. If the request is an approved day off, the pinned day off moves to the new date."
        footer={
          <>
            <Button disabled={isSavingDraft} onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="request-editor" icon={Save} busy={isSavingDraft}>
              Save changes
            </Button>
          </>
        }
      >
        {draft && (
          <form id="request-editor" onSubmit={saveDraft} noValidate className="space-y-4 text-sm">
            <Field label="Date">
              {(f) => <DateInput {...f} value={draft.date} onChange={(iso) => setDraft({ ...draft, date: iso })} />}
            </Field>
            <Field label="Request">
              {(f) => (
                <Select {...f} value={draft.available ? 'SHIFT' : 'OFF'} onChange={(e) => setDraft({ ...draft, available: e.target.value === 'SHIFT' })}>
                  <option value="OFF">A day off</option>
                  <option value="SHIFT">A shift</option>
                </Select>
              )}
            </Field>
            {draft.available && (
              <Field label="Shift asked for">
                {(f) => (
                  <Select {...f} value={draft.preferredDutyWindowId} onChange={(e) => setDraft({ ...draft, preferredDutyWindowId: e.target.value })}>
                    <option value="">Any shift</option>
                    {dutyWindows
                      .filter((d) => d.active !== false)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.startTime} to {d.endTime})
                        </option>
                      ))}
                  </Select>
                )}
              </Field>
            )}
            <Field label="Note" optional>
              {(f) => <Input {...f} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />}
            </Field>
            {draftError && <Notice tone="danger" live title={draftError} />}
          </form>
        )}
      </Dialog>
    </div>
  );
};
