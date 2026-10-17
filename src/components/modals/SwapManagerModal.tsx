/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Swap dialog: two nurses exchange shifts. The swap is checked as the roster
 * check would see it (handMoveChecks): the rules for each moved shift, each
 * nurse's list of doctors, and the rules about the whole roster, so a swap never
 * leaves a new or bigger "Must fix". A swap outside a nurse's list is refused unless the
 * planner agrees to it as an exception (it then shows as "Check"). The swap is
 * recorded under the signed in user. On the shared Dialog since Phase 7, slice 3b.
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Schedule,
  Assignment,
  AvailabilityRequest,
  Nurse,
  DutyWindow,
  Rule,
  LeaveEntry,
  LockEntry,
  ClinicalRole,
  Doctor,
  DoctorSession,
  Specialty,
  SwapRequest,
} from '../../types';
import { getRepository } from '../../services/repository';
import { checkSwap, RosterCheck, SwapCheck, swapNotes } from '../../services/engine/handMoveChecks';
import { readableTextOn } from '../../utils/colorContrast';
import { Button, Dialog, Field, Input, Notice, Select } from '../ui';
import { notify } from '../common/dialogs';
import { authService } from '../../services/auth/authService';
import { formatDate } from '../../utils/dateUtils';
import { swapShifts } from '../../services/schedule/shiftMoves';

/** One empty list for absent props, so the checks below aren't redone on every render. */
const NONE: never[] = [];

interface SwapManagerModalProps {
  schedule: Schedule;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  roles: ClinicalRole[];
  doctors: Doctor[];
  specialties: Specialty[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  rules?: Rule[];
  /** Doctors' clinics (a doctor without a profile counts the clinic's specialty for the nurse's list). */
  sessions?: DoctorSession[];
  /** The nurses' requests: an approved day off is a day off. */
  availabilityRequests?: AvailabilityRequest[];
  /** Shifts from the roster just before this one, for rest and days in a row at its start. */
  priorAssignments?: Assignment[];
  /** The roster check on a changed list of shifts, with everything else as now. */
  checkRoster: RosterCheck;
  isOpen: boolean;
  onClose: () => void;
  onApplySwap: (updated: Assignment[], note: string) => void;
}

export const SwapManagerModal: React.FC<SwapManagerModalProps> = ({
  schedule,
  assignments,
  nurses,
  dutyWindows,
  roles,
  doctors,
  specialties,
  leaveEntries,
  locks,
  rules = NONE,
  sessions = NONE,
  availabilityRequests = NONE,
  priorAssignments = NONE,
  checkRoster,
  isOpen,
  onClose,
  onApplySwap,
}) => {
  const [nurseAId, setNurseAId] = useState<string>(nurses[0]?.id || '');
  const [assignmentAId, setAssignmentAId] = useState<string>('');

  const [nurseBId, setNurseBId] = useState<string>(nurses[1]?.id || '');

  // Pick default nurses once the staff list has loaded
  React.useEffect(() => {
    if (!nurseAId && nurses[0]) setNurseAId(nurses[0].id);
    if (!nurseBId && nurses[1]) setNurseBId(nurses[1].id);
  }, [nurses, nurseAId, nurseBId]);
  const [assignmentBId, setAssignmentBId] = useState<string>('');

  const [swapReason, setSwapReason] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  const nurseMap = useMemo(() => new Map(nurses.map((n) => [n.id, n])), [nurses]);
  const dutyMap = useMemo(() => new Map(dutyWindows.map((d) => [d.id, d])), [dutyWindows]);
  const docMap = useMemo(() => new Map(doctors.map((d) => [d.id, d])), [doctors]);
  const roleMap = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);

  const nurseAAsgns = useMemo(
    () => assignments.filter((a) => a.nurseId === nurseAId).sort((a, b) => a.date.localeCompare(b.date)),
    [assignments, nurseAId]
  );

  const nurseBAsgns = useMemo(
    () => assignments.filter((a) => a.nurseId === nurseBId).sort((a, b) => a.date.localeCompare(b.date)),
    [assignments, nurseBId]
  );

  // Initialize selected assignments if not set
  React.useEffect(() => {
    if (nurseAAsgns.length > 0 && (!assignmentAId || !nurseAAsgns.some((a) => a.id === assignmentAId))) {
      setAssignmentAId(nurseAAsgns[0].id);
    }
  }, [nurseAAsgns, assignmentAId]);

  React.useEffect(() => {
    if (nurseBAsgns.length > 0 && (!assignmentBId || !nurseBAsgns.some((a) => a.id === assignmentBId))) {
      setAssignmentBId(nurseBAsgns[0].id);
    }
  }, [nurseBAsgns, assignmentBId]);

  const selectedAsgnA = useMemo(() => assignments.find((a) => a.id === assignmentAId), [assignments, assignmentAId]);
  const selectedAsgnB = useMemo(() => assignments.find((a) => a.id === assignmentBId), [assignments, assignmentBId]);

  // The roster check on the roster as it is now, to compare the swap with.
  const before = useMemo(() => checkRoster(assignments), [checkRoster, assignments]);

  // Both moved shifts, each nurse's list and the whole roster after the swap.
  const validation = useMemo<SwapCheck>(() => {
    const refused = (reason: string): SwapCheck => ({
      issuesA: [reason],
      issuesB: [],
      rosterIssues: [],
      listA: null,
      listB: null,
      checks: [],
      ok: false,
      exceptionOnly: false,
    });
    if (!selectedAsgnA || !selectedAsgnB || selectedAsgnA.nurseId !== nurseAId || selectedAsgnB.nurseId !== nurseBId) {
      return refused('Choose a shift for both nurses');
    }
    if (nurseAId === nurseBId) return refused('Choose two different nurses');
    if (!nurseMap.get(nurseAId) || !nurseMap.get(nurseBId)) return refused('One of these nurses could not be found');
    return checkSwap({
      assignments,
      prior: priorAssignments,
      shiftA: selectedAsgnA,
      shiftB: selectedAsgnB,
      ctx: { nurses, dutyWindows, leaveEntries, locks, roles, rules, availabilityRequests, doctors, specialties, sessions },
      checkRoster,
      before,
    });
  }, [
    selectedAsgnA,
    selectedAsgnB,
    nurseAId,
    nurseBId,
    nurseMap,
    assignments,
    priorAssignments,
    nurses,
    dutyWindows,
    leaveEntries,
    locks,
    roles,
    rules,
    availabilityRequests,
    doctors,
    specialties,
    sessions,
    checkRoster,
    before,
  ]);
  /** What the swap would break in each nurse's list (for the exception). */
  const listReasons = [validation.listA, validation.listB].filter((r): r is string => !!r);

  if (!isOpen) return null;

  /** Saves the swap; `asException` when the planner agreed to it outside a nurse's list. */
  const handleExecuteSwap = async (asException = false) => {
    if (!selectedAsgnA || !selectedAsgnB) return;
    if (!(validation.ok || (asException && validation.exceptionOnly))) return;
    setIsExecuting(true);

    try {
      const nurseA = nurseMap.get(nurseAId);
      const nurseB = nurseMap.get(nurseBId);
      // The person signed in records (and so approves) the swap.
      const user = authService.getCurrentUser();
      const recordedBy = user?.name || user?.email || 'Planner';
      const reasonText = swapReason.trim() || 'agreed between the nurses';
      // A shift taken outside the nurse's list is marked, so the roster check shows it as Check.
      const exception = { toA: asException && !!validation.listA, toB: asException && !!validation.listB };
      const exceptionText = asException ? ` as an agreed exception (${listReasons.join('; ')})` : '';

      // Both shifts change nurse, so both get new ids (see shiftMoves).
      const updatedAssignments = swapShifts(
        assignments,
        selectedAsgnA,
        selectedAsgnB,
        swapNotes(nurseA?.fullName || 'the first nurse', nurseB?.fullName || 'the second nurse', reasonText, exception)
      );

      // Record SwapRequest and AuditEvent
      const repo = getRepository();
      const nowIso = new Date().toISOString();

      const swapRecord: SwapRequest = {
        id: uuidv4(),
        scheduleId: schedule.id,
        nurseAId,
        dateA: selectedAsgnA.date,
        assignmentAId: selectedAsgnA.id,
        dutyWindowAId: selectedAsgnA.dutyWindowId,
        nurseBId,
        dateB: selectedAsgnB.date,
        assignmentBId: selectedAsgnB.id,
        dutyWindowBId: selectedAsgnB.dutyWindowId,
        reason: swapReason.trim(),
        status: 'APPROVED',
        requestedBy: recordedBy,
        createdAt: nowIso,
        resolvedAt: nowIso,
      };

      await repo.create('swaps', swapRecord);

      await repo.create('audit', {
        actor: recordedBy,
        action: 'SWAP',
        entity: 'Assignment',
        entityId: `${selectedAsgnA.id}<->${selectedAsgnB.id}`,
        before: { nurseA: nurseAId, nurseB: nurseBId },
        after: { nurseA: nurseBId, nurseB: nurseAId },
        note: `Shift swap between ${nurseA?.fullName} and ${nurseB?.fullName}${exceptionText}, recorded by ${recordedBy}: ${reasonText}`,
        timestamp: nowIso,
      });

      onApplySwap(
        updatedAssignments,
        `Swapped shifts between ${nurseA?.fullName} (${formatDate(selectedAsgnA.date)}) and ${nurseB?.fullName} (${formatDate(selectedAsgnB.date)})${
          asException ? ' as an agreed exception' : ''
        }`
      );
      onClose();
    } catch (err: any) {
      notify(`Couldn't save the swap: ${err.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const summaryOf = (asgn?: Assignment) => {
    if (!asgn) return <p className="text-ink-muted">No shift chosen.</p>;
    const dw = dutyMap.get(asgn.dutyWindowId);
    let target = 'Clinic';
    if (asgn.doctorId) target = docMap.get(asgn.doctorId)?.fullName || 'Doctor';
    else if (asgn.clinicalRoleId) target = roleMap.get(asgn.clinicalRoleId)?.name || 'Clinic task';
    return (
      <div className="space-y-1 rounded-lg border border-line bg-sunken p-3">
        <p className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-ink">{formatDate(asgn.date)}</span>
          <span className="rounded px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: dw?.color || '#4f46e5', color: readableTextOn(dw?.color || '#4f46e5') }}>
            {dw?.acronym} ({dw?.startTime} to {dw?.endTime})
          </span>
        </p>
        <p className="text-ink-muted">Working with: {target}</p>
      </div>
    );
  };

  /** One nurse's side: who, the shift they give away, and whether they can take the other's. */
  const side = (
    label: 'First nurse' | 'Second nurse',
    nurseId: string,
    setNurseId: (id: string) => void,
    asgns: Assignment[],
    asgnId: string,
    setAsgnId: (id: string) => void,
    selected: Assignment | undefined,
    issues: string[],
    list: string | null | undefined,
    other: string
  ) => (
    <section className="space-y-3 rounded-lg border border-line p-3">
      <Field label={label}>
        {(f) => (
          <Select {...f} value={nurseId} onChange={(e) => setNurseId(e.target.value)}>
            {nurses.map((n) => (
              <option key={n.id} value={n.id}>
                {n.fullName}
                {n.employeeCode ? ` (${n.employeeCode})` : ''}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label={`${label}'s shift to give away`}>
        {(f) => (
          <Select {...f} value={asgnId} onChange={(e) => setAsgnId(e.target.value)}>
            {asgns.map((a) => {
              const dw = dutyMap.get(a.dutyWindowId);
              return (
                <option key={a.id} value={a.id}>
                  {formatDate(a.date)}, {dw?.name} ({dw?.acronym})
                </option>
              );
            })}
            {asgns.length === 0 && <option value="">No shifts on this roster</option>}
          </Select>
        )}
      </Field>
      {summaryOf(selected)}
      {issues.length > 0 ? (
        <Notice tone="danger" title="Can't swap">
          <ul className="list-disc pl-5">
            {issues.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </Notice>
      ) : list ? (
        <Notice tone="warning" title="Outside the nurse's list">
          {list}
        </Notice>
      ) : (
        <Notice tone="success" title={`Can take the ${other} nurse's shift`} />
      )}
    </section>
  );

  return (
    <Dialog
      open
      onClose={onClose}
      size="xl"
      title="Swap shifts"
      description="Both nurses' new shifts are checked against the clinic rules before saving."
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          {validation.exceptionOnly ? (
            <Button variant="primary" icon={ArrowLeftRight} busy={isExecuting} onClick={() => handleExecuteSwap(true)}>
              Swap anyway as an exception
            </Button>
          ) : (
            <Button variant="primary" icon={ArrowLeftRight} busy={isExecuting} disabled={!validation.ok} onClick={() => handleExecuteSwap()}>
              Swap shifts
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {side('First nurse', nurseAId, setNurseAId, nurseAAsgns, assignmentAId, setAssignmentAId, selectedAsgnA, validation.issuesA, validation.listA, 'second')}
          {side('Second nurse', nurseBId, setNurseBId, nurseBAsgns, assignmentBId, setAssignmentBId, selectedAsgnB, validation.issuesB, validation.listB, 'first')}
        </div>
        <Field label="Reason" optional hint="Kept in the roster history. For example: Mariam has a training day on Saturday.">
          {(f) => <Input {...f} value={swapReason} onChange={(e) => setSwapReason(e.target.value)} />}
        </Field>
        {validation.rosterIssues.length > 0 && (
          <Notice tone="danger" title="Can't swap: the roster check would show a new Must fix, or make one bigger.">
            <ul className="list-disc pl-5">
              {validation.rosterIssues.slice(0, 4).map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
            {validation.rosterIssues.length > 4 && <p>And {validation.rosterIssues.length - 4} more.</p>}
          </Notice>
        )}
        {validation.exceptionOnly && (
          <Notice tone="warning" title={`${listReasons.join('. ')}.`}>
            Nurses work only with the doctors and specialties in their list, so this swap is refused unless you agree to it as an exception. The shift is then
            marked as an agreed exception, and the roster check shows it as Check, not Must fix.
          </Notice>
        )}
        {validation.checks.length > 0 && (
          <Notice tone="warning" live title="After the swap, the roster check will show these as Check, not Must fix:">
            <ul className="list-disc pl-5">
              {validation.checks.slice(0, 4).map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
            {validation.checks.length > 4 && <p>And {validation.checks.length - 4} more.</p>}
          </Notice>
        )}
      </div>
    </Dialog>
  );
};
