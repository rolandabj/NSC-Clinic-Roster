/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * All requests: every day off and shift request of every nurse, whatever its
 * decision (waiting, approved or declined). Planners and managers can approve,
 * decline, put back to waiting, change or delete any of them. An approved day
 * off keeps its pinned day off in step (see staffRequestService).
 */

import React, { useEffect, useId, useMemo, useState } from 'react';
import { Check, Pencil, RefreshCw, RotateCcw, Trash2, X } from 'lucide-react';
import { UserProfile } from '../../services/auth/authService';
import {
  decideRequest,
  deleteAvailabilityRequest,
  listAllAvailabilityRequests,
  reopenAvailabilityRequest,
  updateAvailabilityRequest,
} from '../../services/requests/staffRequestService';
import { AvailabilityRequest, DutyWindow, Nurse } from '../../types';
import { formatDate, localTodayIso } from '../../utils/dateUtils';
import { confirmDialog, notify } from '../common/dialogs';
import { useDialogA11y } from '../common/useDialogA11y';

interface AllRequestsPanelProps {
  currentUser?: UserProfile;
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  onChanged?: () => void;
}

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
type KindFilter = 'ALL' | 'DAY_OFF' | 'SHIFT';

const STATUS_LABEL: Record<AvailabilityRequest['status'], string> = {
  PENDING: 'Waiting',
  APPROVED: 'Approved',
  REJECTED: 'Declined',
};
const STATUS_STYLE: Record<AvailabilityRequest['status'], string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  REJECTED: 'bg-slate-100 text-slate-600 border-slate-200',
};
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekdayOf = (date: string) => WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];

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
  const editTitleId = useId();
  const editDialogRef = useDialogA11y<HTMLDivElement>(!!draft, () => setDraft(null));

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
      title: 'Delete request',
      message: `Delete ${name}'s ${describe(r).toLowerCase()} request for ${formatDate(r.date)}?${
        !r.available && r.status === 'APPROVED' ? ' The pinned day off goes too, so she can be given a shift that day.' : ''
      }`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (ok) run(r.id, () => deleteAvailabilityRequest(currentUser, r.id), 'Request deleted.');
  };

  const saveDraft = async () => {
    if (!draft) return;
    if (!draft.date) {
      notify('Choose a date.', 'warning');
      return;
    }
    const d = draft;
    setDraft(null);
    run(
      d.id,
      () =>
        updateAvailabilityRequest(currentUser, d.id, {
          date: d.date,
          available: d.available,
          preferredDutyWindowId: d.available ? d.preferredDutyWindowId || null : null,
          note: d.note,
        }),
      'Request changed.'
    );
  };

  const selectClass = 'px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-800 text-xs';

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">All day off and shift requests</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every request, whether it is waiting, approved or declined. Approving a day off pins it on the roster; declining,
              putting it back to waiting or deleting it removes that pin, so the nurse can be given a shift that day.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Refresh
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5">
            <span className="text-slate-600">Status</span>
            <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className={selectClass}>
              <option value="ALL">All</option>
              <option value="PENDING">Waiting</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Declined</option>
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            <span className="text-slate-600">Type</span>
            <select aria-label="Type" value={kind} onChange={(e) => setKind(e.target.value as KindFilter)} className={selectClass}>
              <option value="ALL">All</option>
              <option value="DAY_OFF">Day off</option>
              <option value="SHIFT">Shift</option>
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            <span className="text-slate-600">Nurse</span>
            <select aria-label="Nurse" value={nurseId} onChange={(e) => setNurseId(e.target.value)} className={selectClass}>
              <option value="ALL">All nurses</option>
              {[...nurses].sort((a, b) => a.fullName.localeCompare(b.fullName)).map((n) => (
                <option key={n.id} value={n.id}>
                  {n.fullName}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            <span className="text-slate-600">From</span>
            <input type="date" aria-label="From date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={selectClass} />
          </label>
          <span className="text-slate-500">{shown.length} shown</span>
        </div>
      </div>

      {loadError && (
        <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-3">The requests could not be loaded: {loadError}</p>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">Nurse</th>
              <th className="px-3 py-2 font-semibold">Request</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Note</th>
              <th className="px-3 py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">Loading…</td>
              </tr>
            )}
            {!isLoading && shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">No requests match these filters.</td>
              </tr>
            )}
            {!isLoading &&
              shown.map((r) => {
                const nurse = nurseMap.get(r.nurseId);
                const busy = busyId === r.id;
                const btn = 'inline-flex items-center gap-1 px-2 py-1 rounded border text-[11px] cursor-pointer disabled:opacity-50';
                return (
                  <tr key={r.id} className="align-top">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{formatDate(r.date)}</span>
                      <span className="text-slate-500"> {weekdayOf(r.date)}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-800">{nurse?.fullName || 'Unknown nurse'}</td>
                    <td className="px-3 py-2 text-slate-800">{describe(r)}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${STATUS_STYLE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      {r.reviewedByUserName && r.status !== 'PENDING' && (
                        <div className="text-[10px] text-slate-500 mt-0.5">by {r.reviewedByUserName}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-600 max-w-[16rem]">
                      {r.note || '—'}
                      {r.reviewNotes && <div className="text-[10px] text-slate-500 mt-0.5">Decision note: {r.reviewNotes}</div>}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap justify-end gap-1">
                        {r.status !== 'APPROVED' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => run(r.id, () => decideRequest(currentUser, 'AVAILABILITY', r.id, 'APPROVED'), 'Request approved.')}
                            className={`${btn} border-emerald-300 text-emerald-800 hover:bg-emerald-50`}
                          >
                            <Check className="w-3 h-3" aria-hidden="true" /> Approve
                          </button>
                        )}
                        {r.status !== 'REJECTED' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => run(r.id, () => decideRequest(currentUser, 'AVAILABILITY', r.id, 'REJECTED'), 'Request declined.')}
                            className={`${btn} border-slate-300 text-slate-700 hover:bg-slate-50`}
                          >
                            <X className="w-3 h-3" aria-hidden="true" /> Decline
                          </button>
                        )}
                        {r.status !== 'PENDING' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => run(r.id, () => reopenAvailabilityRequest(currentUser, r.id), 'Request put back to waiting.')}
                            className={`${btn} border-slate-300 text-slate-700 hover:bg-slate-50`}
                          >
                            <RotateCcw className="w-3 h-3" aria-hidden="true" /> Back to waiting
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setDraft({
                              id: r.id,
                              nurseName: nurse?.fullName || 'Unknown nurse',
                              date: r.date,
                              available: r.available,
                              preferredDutyWindowId: r.preferredDutyWindowId || '',
                              note: r.note || '',
                            })
                          }
                          className={`${btn} border-indigo-300 text-indigo-700 hover:bg-indigo-50`}
                        >
                          <Pencil className="w-3 h-3" aria-hidden="true" /> Change
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDelete(r)}
                          className={`${btn} border-rose-300 text-rose-700 hover:bg-rose-50`}
                        >
                          <Trash2 className="w-3 h-3" aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            ref={editDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={editTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-xs"
          >
            <h3 id={editTitleId} className="text-sm font-bold text-slate-900">
              Change {draft.nurseName}&apos;s request
            </h3>
            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">Date</span>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-300 rounded"
              />
            </label>
            <fieldset className="space-y-1">
              <legend className="font-semibold text-slate-700">Request</legend>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!draft.available} onChange={() => setDraft({ ...draft, available: false })} />
                <span>Day off</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={draft.available} onChange={() => setDraft({ ...draft, available: true })} />
                <span>A shift</span>
              </label>
            </fieldset>
            {draft.available && (
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Shift asked for</span>
                <select
                  value={draft.preferredDutyWindowId}
                  onChange={(e) => setDraft({ ...draft, preferredDutyWindowId: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="">Any shift</option>
                  {dutyWindows
                    .filter((d) => d.active !== false)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.acronym} ({d.startTime} to {d.endTime})
                      </option>
                    ))}
                </select>
              </label>
            )}
            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">Note</span>
              <input
                type="text"
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-300 rounded"
              />
            </label>
            <p className="text-slate-500">The decision stays as it is. An approved day off moves its pin to the new date.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
