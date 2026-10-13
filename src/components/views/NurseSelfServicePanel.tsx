/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A nurse's own requests (UI overhaul Phase 5, slice 2), made for phones: their upcoming leave,
 * days off and wanted shifts as cards with a clear Waiting, Approved or Declined and the
 * reviewer's note, past ones behind a button, and the two forms, which check a request before
 * it is sent.
 */

import React, { useEffect, useRef, useState } from 'react';
import { CalendarPlus, CircleCheck, CircleX, Clock, History, Plus } from 'lucide-react';
import { UserProfile } from '../../services/auth/authService';
import {
  listMyRequests,
  submitLeaveRequest,
  submitAvailabilityRequest,
  cancelLeaveRequest,
  cancelAvailabilityRequest,
} from '../../services/requests/staffRequestService';
import { checkDayRequest, checkLeaveRequest, myRequestList, type MyRequest, type RequestStatus } from '../../services/requests/myRequests';
import { LeaveEntry, AvailabilityRequest, LeaveType, Nurse, DutyWindow } from '../../types';
import { localTodayIso } from '../../utils/dateUtils';
import { requestDefaults } from '../../utils/dateDefaults';
import { notify, confirmDialog, type NoticeTone } from '../common/dialogs';
import { Badge, Button, DateInput, Dialog, Field, Notice, Select, Textarea, cx, wholeDates, type Tone } from '../ui';

interface NurseSelfServicePanelProps {
  currentUser?: UserProfile;
  nurses?: Nurse[];
  leaveTypes?: LeaveType[];
  dutyWindows?: DutyWindow[];
  onDataChanged?: () => void;
  /** 1 when the panel is the whole page (a nurse's view), else 2 under the page's own heading. */
  headingLevel?: 1 | 2;
}

const STATUS: Record<RequestStatus, { tone: Tone; icon: typeof Clock }> = {
  Waiting: { tone: 'warning', icon: Clock },
  Approved: { tone: 'success', icon: CircleCheck },
  Declined: { tone: 'neutral', icon: CircleX },
};

/** Puts the focus on the first field with an error after a form was sent with errors. */
function useFocusFirstError(errors: object, box: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (Object.keys(errors).length) box.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);
}

export const NurseSelfServicePanel: React.FC<NurseSelfServicePanelProps> = ({
  currentUser,
  leaveTypes = [],
  dutyWindows = [],
  onDataChanged,
  headingLevel = 2,
}) => {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const SubHeading = headingLevel === 1 ? 'h2' : 'h3';
  const [myLeaves, setMyLeaves] = useState<LeaveEntry[]>([]);
  const [myAvailability, setMyAvailability] = useState<AvailabilityRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const today = localTodayIso();

  // Leave form (it starts a week ahead).
  const [chosenLeaveTypeId, setLeaveTypeId] = useState(leaveTypes[0]?.id || '');
  // The kinds of leave can arrive after the form was made: the first one stands until one is chosen
  // (the form used to send a made up 'leave-annual' when the list came late).
  const leaveTypeId = leaveTypes.some((t) => t.id === chosenLeaveTypeId) ? chosenLeaveTypeId : leaveTypes[0]?.id || '';
  const [initialDates] = useState(() => requestDefaults(today));
  const [leaveStartDate, setLeaveStartDate] = useState(initialDates.leaveStartDate);
  const [leaveEndDate, setLeaveEndDate] = useState(initialDates.leaveEndDate);
  const [leaveNote, setLeaveNote] = useState('');
  const [leaveErrors, setLeaveErrors] = useState<{ startDate?: string; endDate?: string }>({});
  const leaveBox = useRef<HTMLFormElement>(null);
  useFocusFirstError(leaveErrors, leaveBox);

  // Day off or wanted shift form.
  const [availDate, setAvailDate] = useState(initialDates.dayOffDate);
  const [availIsAvailable, setAvailIsAvailable] = useState(false);
  const [availPreferredDutyId, setAvailPreferredDutyId] = useState('');
  const [availNote, setAvailNote] = useState('');
  const [dayErrors, setDayErrors] = useState<{ date?: string }>({});
  const dayBox = useRef<HTMLFormElement>(null);
  useFocusFirstError(dayErrors, dayBox);

  const triggerToast = (msg: string, tone: NoticeTone = 'success') => notify(msg, tone);

  const fetchMyData = async () => {
    setIsLoading(true);
    try {
      const { leaves, availability } = await listMyRequests(currentUser);
      setMyLeaves(leaves);
      setMyAvailability(availability);
    } catch (err: any) {
      console.error('[NurseSelfService] fetch error:', err);
      triggerToast('Could not load your requests. Try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = checkLeaveRequest({ startDate: leaveStartDate, endDate: leaveEndDate }, today, myLeaves);
    setLeaveErrors(errors);
    if (Object.keys(errors).length) return;
    setIsBusy(true);
    try {
      await submitLeaveRequest(currentUser, {
        leaveTypeId,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        note: leaveNote.trim() || undefined,
      });

      triggerToast('Your leave request is sent. The planner will look at it.');
      setIsLeaveModalOpen(false);
      setLeaveNote('');
      await fetchMyData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      console.error('[MyRequests] send leave:', err);
      notify('Could not send your leave request. Try again.', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSubmitAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = checkDayRequest({ date: availDate }, today, myAvailability);
    setDayErrors(errors);
    if (Object.keys(errors).length) return;
    setIsBusy(true);
    try {
      await submitAvailabilityRequest(currentUser, {
        date: availDate,
        available: availIsAvailable,
        preferredDutyWindowId: availPreferredDutyId || undefined,
        note: availNote.trim() || undefined,
      });

      triggerToast(`Your request for ${availIsAvailable ? 'a shift' : 'a day off'} is sent. The planner will look at it.`);
      setIsAvailModalOpen(false);
      setAvailNote('');
      await fetchMyData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      console.error('[MyRequests] send day:', err);
      notify('Could not send your request. Try again.', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleCancelLeave = async (id: string) => {
    const ok = await confirmDialog({
      title: 'Cancel this leave request?',
      message: 'The planner will no longer see it.',
      confirmLabel: 'Cancel request',
      cancelLabel: 'Keep request',
      danger: true,
    });
    if (!ok) return;
    setIsBusy(true);
    try {
      await cancelLeaveRequest(id);
      triggerToast('Your leave request is cancelled.');
      await fetchMyData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      console.error('[MyRequests] cancel:', err);
      notify('Could not cancel the request. Try again.', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleCancelAvailability = async (id: string) => {
    const ok = await confirmDialog({
      title: 'Cancel this request?',
      message: 'The planner will no longer see it.',
      confirmLabel: 'Cancel request',
      cancelLabel: 'Keep request',
      danger: true,
    });
    if (!ok) return;
    setIsBusy(true);
    try {
      await cancelAvailabilityRequest(id);
      triggerToast('Your request is cancelled.');
      await fetchMyData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      console.error('[MyRequests] cancel:', err);
      notify('Could not cancel the request. Try again.', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const list = myRequestList(myLeaves, myAvailability, today, leaveTypes, dutyWindows);
  const card = (r: MyRequest, muted = false) => {
    const { tone, icon } = STATUS[r.status];
    return (
      <li key={`${r.kind}-${r.id}`} className={cx('rounded-lg border border-line bg-surface px-4 py-3 shadow-card', muted && 'opacity-80')}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-ink">{r.what}</p>
            <p className="text-ink-muted">{wholeDates(r.when)}</p>
          </div>
          <Badge tone={tone} icon={icon}>
            {r.status}
          </Badge>
        </div>
        {r.note && <p className="mt-1 text-ink-muted">Your note: {r.note}</p>}
        {(r.reviewNote || r.reviewer) && r.status !== 'Waiting' && (
          <p className="mt-2 rounded-md bg-sunken px-3 py-2 text-sm text-ink">
            {r.reviewer && <span className="font-semibold">{r.reviewer}: </span>}
            {r.reviewNote || (r.status === 'Approved' ? 'Approved.' : 'Declined.')}
          </p>
        )}
        {r.canCancel && (
          <Button
            variant="ghost"
            size="lg"
            disabled={isBusy}
            onClick={() => (r.kind === 'leave' ? handleCancelLeave(r.id) : handleCancelAvailability(r.id))}
            className="mt-1 -ml-3 text-danger hover:bg-danger-soft"
          >
            Cancel request
          </Button>
        )}
      </li>
    );
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 text-base text-ink">
      <div>
        <Heading className="text-2xl font-semibold">My requests</Heading>
        <p className="mt-1 text-ink-muted">Ask for leave, a day off or a shift you would like. The planner looks at each request and decides.</p>
      </div>

      {!currentUser?.linkedNurseId ? (
        <Notice tone="warning" title="This account cannot send requests yet.">
          It is not linked to a nurse. The clinic owner can link it in Settings, Access & permissions.
        </Notice>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => {
              setLeaveErrors({});
              setIsLeaveModalOpen(true);
            }}
          >
            Ask for leave
          </Button>
          <Button
            size="lg"
            icon={CalendarPlus}
            onClick={() => {
              setDayErrors({});
              setIsAvailModalOpen(true);
            }}
          >
            Ask for a day off or a shift
          </Button>
        </div>
      )}

      <section aria-labelledby="upcoming-requests">
        <SubHeading id="upcoming-requests" className="mb-2 text-lg font-semibold">
          Coming up
        </SubHeading>
        {isLoading ? (
          <p className="text-ink-muted" role="status">
            Loading your requests…
          </p>
        ) : list.upcoming.length === 0 ? (
          <p className="rounded-lg border border-line bg-surface p-4 text-ink-muted">You have no requests for the days coming up.</p>
        ) : (
          <ul className="space-y-2">{list.upcoming.map((r) => card(r))}</ul>
        )}
      </section>

      {list.past.length > 0 && (
        <section aria-label="Past requests">
          <Button variant="ghost" size="lg" icon={History} onClick={() => setShowPast((v) => !v)} aria-expanded={showPast} className="-ml-3">
            {showPast ? 'Hide past requests' : `Show past requests (${list.past.length})`}
          </Button>
          {showPast && <ul className="mt-2 space-y-2">{list.past.map((r) => card(r, true))}</ul>}
        </section>
      )}

      <Dialog
        open={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Ask for leave"
        description="The planner sees your request and decides."
        footer={
          <>
            <Button onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="leave-request" busy={isBusy}>
              Send request
            </Button>
          </>
        }
      >
        <form id="leave-request" ref={leaveBox} onSubmit={handleSubmitLeave} noValidate className="space-y-4">
          <Field label="Kind of leave">
            {(f) => (
              <Select {...f} value={leaveTypeId} onChange={(e) => setLeaveTypeId(e.target.value)}>
                {leaveTypes.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First day" error={leaveErrors.startDate}>
              {(f) => <DateInput {...f} value={leaveStartDate} onChange={setLeaveStartDate} min={today} />}
            </Field>
            <Field label="Last day" error={leaveErrors.endDate}>
              {(f) => <DateInput {...f} value={leaveEndDate} onChange={setLeaveEndDate} min={leaveStartDate || today} />}
            </Field>
          </div>
          <Field label="Note for the planner" optional>
            {(f) => <Textarea {...f} value={leaveNote} onChange={(e) => setLeaveNote(e.target.value)} />}
          </Field>
        </form>
      </Dialog>

      <Dialog
        open={isAvailModalOpen}
        onClose={() => setIsAvailModalOpen(false)}
        title="Ask for a day off or a shift"
        description="The planner sees your request and decides."
        footer={
          <>
            <Button onClick={() => setIsAvailModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="day-request" busy={isBusy}>
              Send request
            </Button>
          </>
        }
      >
        <form id="day-request" ref={dayBox} onSubmit={handleSubmitAvailability} noValidate className="space-y-4">
          <Field label="Day" error={dayErrors.date}>
            {(f) => <DateInput {...f} value={availDate} onChange={setAvailDate} min={today} />}
          </Field>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">What would you like?</legend>
            {[
              { value: false, label: 'A day off', hint: 'You are not put on a shift that day.' },
              { value: true, label: 'A shift', hint: 'You would like to work that day.' },
            ].map((o) => (
              <label
                key={o.label}
                className={cx(
                  'flex min-h-11 cursor-pointer items-start gap-3 rounded-md border px-3 py-2',
                  availIsAvailable === o.value ? 'border-brand bg-brand-soft' : 'border-line bg-surface'
                )}
              >
                <input
                  type="radio"
                  name="day-request-kind"
                  checked={availIsAvailable === o.value}
                  onChange={() => setAvailIsAvailable(o.value)}
                  className="mt-1 size-4 accent-brand"
                />
                <span>
                  <span className="block font-semibold">{o.label}</span>
                  <span className="block text-sm text-ink-muted">{o.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
          {availIsAvailable && (
            <Field label="Which shift" optional>
              {(f) => (
                <Select {...f} value={availPreferredDutyId} onChange={(e) => setAvailPreferredDutyId(e.target.value)}>
                  <option value="">Any shift</option>
                  {dutyWindows.map((dw) => (
                    <option key={dw.id} value={dw.id}>
                      {dw.name} ({dw.startTime} to {dw.endTime})
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          )}
          <Field label="Note for the planner" optional>
            {(f) => <Textarea {...f} value={availNote} onChange={(e) => setAvailNote(e.target.value)} />}
          </Field>
        </form>
      </Dialog>
    </div>
  );
};
