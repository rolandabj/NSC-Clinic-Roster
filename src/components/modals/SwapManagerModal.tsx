/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Swap dialog: two nurses exchange shifts. The swap is checked as the roster
 * check would see it (handMoveChecks): the rules for each moved shift, each
 * nurse's list of doctors, and the rules about the whole roster, so a swap never
 * leaves a new or bigger "Must fix". A swap outside a nurse's list is refused unless the
 * planner agrees to it as an exception (it then shows as "Check"). The swap is
 * recorded under the signed in user.
 */

import React, { useState, useMemo, useId } from 'react';
import {
  X,
  ArrowLeftRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
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
import { useDialogA11y } from '../common/useDialogA11y';
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

  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, onClose);

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

  const renderAssignmentSummary = (asgn?: Assignment) => {
    if (!asgn) return <div className="text-slate-400 italic">No shift selected</div>;
    const dw = dutyMap.get(asgn.dutyWindowId);
    let target = 'Clinic';
    if (asgn.doctorId) target = docMap.get(asgn.doctorId)?.fullName || 'Doctor';
    else if (asgn.clinicalRoleId) target = roleMap.get(asgn.clinicalRoleId)?.name || 'Role';

    return (
      <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900">{formatDate(asgn.date)}</span>
          <span
            className="px-2 py-0.5 rounded text-white font-bold font-mono text-[10px]"
            style={{ backgroundColor: dw?.color || '#4f46e5' }}
          >
            {dw?.acronym} ({dw?.startTime}–{dw?.endTime})
          </span>
        </div>
        <div className="text-[11px] text-slate-600 font-medium">Working with: {target}</div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs font-sans text-slate-800"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="text-base font-bold text-slate-900">
                  Swap shifts
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Both nurses' new shifts are checked against the clinic rules before saving
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NURSE A */}
            <div className="p-3 border border-slate-200 rounded-lg space-y-3 bg-white shadow-2xs">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                <span>First nurse</span>
              </span>

              <select
                aria-label="First nurse"
                value={nurseAId}
                onChange={(e) => setNurseAId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-medium"
              >
                {nurses.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.fullName} ({n.employeeCode})
                  </option>
                ))}
              </select>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Shift to give away:
                </label>
                <select
                  aria-label="First nurse's shift to give away"
                  value={assignmentAId}
                  onChange={(e) => setAssignmentAId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-[11px]"
                >
                  {nurseAAsgns.map((a) => {
                    const dw = dutyMap.get(a.dutyWindowId);
                    return (
                      <option key={a.id} value={a.id}>
                        {formatDate(a.date)} — {dw?.name} ({dw?.acronym})
                      </option>
                    );
                  })}
                  {nurseAAsgns.length === 0 && <option value="">No shifts on this roster</option>}
                </select>
              </div>

              {renderAssignmentSummary(selectedAsgnA)}

              {/* Validation Feedback A */}
              {validation.issuesA.length > 0 ? (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                    <span>Can't swap:</span>
                  </div>
                  {validation.issuesA.map((msg, i) => (
                    <div key={i}>• {msg}</div>
                  ))}
                </div>
              ) : validation.listA ? (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-amber-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                    <span>Outside the list:</span>
                  </div>
                  <div>• {validation.listA}</div>
                </div>
              ) : (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px] flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Can take the second nurse's shift</span>
                </div>
              )}
            </div>

            {/* NURSE B */}
            <div className="p-3 border border-slate-200 rounded-lg space-y-3 bg-white shadow-2xs">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                <span>Second nurse</span>
              </span>

              <select
                aria-label="Second nurse"
                value={nurseBId}
                onChange={(e) => setNurseBId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-medium"
              >
                {nurses.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.fullName} ({n.employeeCode})
                  </option>
                ))}
              </select>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Shift to give away:
                </label>
                <select
                  aria-label="Second nurse's shift to give away"
                  value={assignmentBId}
                  onChange={(e) => setAssignmentBId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-[11px]"
                >
                  {nurseBAsgns.map((a) => {
                    const dw = dutyMap.get(a.dutyWindowId);
                    return (
                      <option key={a.id} value={a.id}>
                        {formatDate(a.date)} — {dw?.name} ({dw?.acronym})
                      </option>
                    );
                  })}
                  {nurseBAsgns.length === 0 && <option value="">No shifts on this roster</option>}
                </select>
              </div>

              {renderAssignmentSummary(selectedAsgnB)}

              {/* Validation Feedback B */}
              {validation.issuesB.length > 0 ? (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                    <span>Can't swap:</span>
                  </div>
                  {validation.issuesB.map((msg, i) => (
                    <div key={i}>• {msg}</div>
                  ))}
                </div>
              ) : validation.listB ? (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-amber-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                    <span>Outside the list:</span>
                  </div>
                  <div>• {validation.listB}</div>
                </div>
              ) : (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px] flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Can take the first nurse's shift</span>
                </div>
              )}
            </div>
          </div>

          {/* Reason Field */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-800 text-xs">
              Reason (kept in the roster history):
            </label>
            <input
              type="text"
              aria-label="Reason for the swap"
              placeholder="For example: Mariam has a training day on Saturday"
              value={swapReason}
              onChange={(e) => setSwapReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {validation.rosterIssues.length > 0 && (
          <div className="mx-4 mb-3 p-2.5 rounded border border-rose-200 bg-rose-50 text-rose-800 text-xs space-y-1">
            <p className="font-bold">Can't swap: the roster check would show a new Must fix, or make one bigger.</p>
            {validation.rosterIssues.slice(0, 4).map((msg, i) => (
              <p key={i}>• {msg}</p>
            ))}
            {validation.rosterIssues.length > 4 && <p>And {validation.rosterIssues.length - 4} more.</p>}
          </div>
        )}

        {validation.exceptionOnly && (
          <div className="mx-4 mb-3 p-2.5 rounded border border-amber-300 bg-amber-50 text-amber-900 text-xs space-y-1">
            <p className="font-bold">{listReasons.join('. ')}.</p>
            <p>
              Nurses work only with the doctors and specialties in their list, so this swap is refused unless you agree to it as an
              exception. The shift is then marked as an agreed exception, and the roster check shows it as Check, not Must fix.
            </p>
          </div>
        )}

        {validation.checks.length > 0 && (
          <div role="status" className="mx-4 mb-3 p-2.5 rounded border border-amber-200 bg-amber-50 text-amber-900 text-xs space-y-1">
            <p className="font-semibold">After the swap the roster check will show (Check, not Must fix):</p>
            {validation.checks.slice(0, 4).map((msg, i) => (
              <p key={i}>• {msg}</p>
            ))}
            {validation.checks.length > 4 && <p>And {validation.checks.length - 4} more.</p>}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium cursor-pointer"
          >
            Cancel
          </button>

          {validation.exceptionOnly ? (
            <button
              type="button"
              disabled={isExecuting}
              onClick={() => handleExecuteSwap(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold cursor-pointer shadow-xs disabled:opacity-40 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
              <span>Swap anyway as an exception</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!validation.ok || isExecuting}
              onClick={() => handleExecuteSwap()}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer shadow-xs disabled:opacity-40 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
              <span>Swap shifts</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
