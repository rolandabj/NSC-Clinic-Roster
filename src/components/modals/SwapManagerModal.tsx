/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Swap dialog: two nurses exchange shifts. Both moved shifts are checked
 * against the clinic rules (rest, leave, pinned days, senior nurse each day)
 * before the swap is saved, and the swap is recorded under the signed in user.
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
  Nurse,
  DutyWindow,
  SeniorityLevel,
  Rule,
  LeaveEntry,
  LockEntry,
  ClinicalRole,
  Doctor,
  Specialty,
  SwapRequest,
} from '../../types';
import { getRepository } from '../../services/repository';
import { checkAssignment } from '../../services/engine/assignmentChecks';
import { useDialogA11y } from '../common/useDialogA11y';
import { notify } from '../common/dialogs';
import { authService } from '../../services/auth/authService';
import { resolveRule } from '../../services/engine/SchedulingEngine';
import { formatDate } from '../../utils/dateUtils';

interface SwapManagerModalProps {
  schedule: Schedule;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  seniorityLevels: SeniorityLevel[];
  roles: ClinicalRole[];
  doctors: Doctor[];
  specialties: Specialty[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  rules?: Rule[];
  isOpen: boolean;
  onClose: () => void;
  onApplySwap: (updated: Assignment[], note: string) => void;
}

export const SwapManagerModal: React.FC<SwapManagerModalProps> = ({
  schedule,
  assignments,
  nurses,
  dutyWindows,
  seniorityLevels,
  roles,
  doctors,
  specialties,
  leaveEntries,
  locks,
  rules = [],
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
  const seniorityMap = useMemo(() => new Map(seniorityLevels.map((s) => [s.id, s])), [seniorityLevels]);

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

  // Validation: Both directions
  const validation = useMemo(() => {
    const issuesA: string[] = [];
    const issuesB: string[] = [];
    // Shown but not blocking (rules set to "followed when possible").
    const notes: string[] = [];

    if (!selectedAsgnA || !selectedAsgnB) {
      return { isValid: false, issuesA: ['Choose a shift for both nurses'], issuesB: [], notes: [] };
    }

    if (nurseAId === nurseBId) {
      return { isValid: false, issuesA: ['Choose two different nurses'], issuesB: [], notes: [] };
    }

    const nurseA = nurseMap.get(nurseAId);
    const nurseB = nurseMap.get(nurseBId);
    if (!nurseA || !nurseB) return { isValid: false, issuesA: ['One of these nurses could not be found'], issuesB: [], notes: [] };

    // Pinned shifts cannot be given away
    const isPinned = (asgn: Assignment) =>
      asgn.locked ||
      asgn.source === 'LOCK' ||
      locks.some((l) => l.nurseId === asgn.nurseId && l.date === asgn.date && l.mode === 'ASSIGNMENT');
    if (isPinned(selectedAsgnA)) issuesA.push(`${nurseA.fullName}'s shift on ${formatDate(selectedAsgnA.date)} is a pinned day and can't be swapped`);
    if (isPinned(selectedAsgnB)) issuesB.push(`${nurseB.fullName}'s shift on ${formatDate(selectedAsgnB.date)} is a pinned day and can't be swapped`);

    // Check both moved cells against the roster as it would be after the swap
    // (same hard rules as the scheduling engine).
    const movedToA: Assignment = { ...selectedAsgnB, nurseId: nurseAId };
    const movedToB: Assignment = { ...selectedAsgnA, nurseId: nurseBId };
    const afterSwap = assignments.map((a) =>
      a.id === selectedAsgnA.id ? movedToB : a.id === selectedAsgnB.id ? movedToA : a
    );
    const ctx = { assignments: afterSwap, nurses, dutyWindows, leaveEntries, locks, roles, rules };
    issuesA.push(...checkAssignment(ctx, movedToA));
    issuesB.push(...checkAssignment(ctx, movedToB));

    // One senior nurse on duty each day (the same rule the roster check uses):
    // the swap may not take away the only senior nurse on either day.
    const seniorRule = resolveRule(rules, 'SENIOR_ON_DUTY', 'rule-h1', ['senior nurse', 'senior on duty']);
    if (!seniorRule || seniorRule.enabled !== false) {
      const isSenior = (nurseId: string) => {
        const level = seniorityMap.get(nurseMap.get(nurseId)?.seniorityLevelId || '');
        return !!level?.isSenior;
      };
      const hasSenior = (list: Assignment[], date: string) => list.some((a) => a.date === date && isSenior(a.nurseId));
      const lostSenior = (date: string) => hasSenior(assignments, date) && !hasSenior(afterSwap, date);
      // A rule set to "followed when possible" only warns, as in the roster check.
      const blocking = seniorRule?.severity !== 'SOFT';
      if (lostSenior(selectedAsgnA.date)) {
        (blocking ? issuesA : notes).push(
          `After the swap there would be no senior nurse on duty on ${formatDate(selectedAsgnA.date)}. Each day needs one senior nurse.`
        );
      }
      if (selectedAsgnB.date !== selectedAsgnA.date && lostSenior(selectedAsgnB.date)) {
        (blocking ? issuesB : notes).push(
          `After the swap there would be no senior nurse on duty on ${formatDate(selectedAsgnB.date)}. Each day needs one senior nurse.`
        );
      }
    }

    return {
      isValid: issuesA.length === 0 && issuesB.length === 0,
      issuesA,
      issuesB,
      notes,
    };
  }, [selectedAsgnA, selectedAsgnB, nurseAId, nurseBId, nurseMap, seniorityMap, locks, leaveEntries, assignments, nurses, dutyWindows, roles, rules]);

  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const handleExecuteSwap = async () => {
    if (!selectedAsgnA || !selectedAsgnB || !validation.isValid) return;
    setIsExecuting(true);

    try {
      const nurseA = nurseMap.get(nurseAId);
      const nurseB = nurseMap.get(nurseBId);
      // The person signed in records (and so approves) the swap.
      const user = authService.getCurrentUser();
      const recordedBy = user?.name || user?.email || 'Planner';
      const reasonText = swapReason.trim() || 'agreed between the nurses';

      const updatedAssignments = assignments.map((a) => {
        if (a.id === selectedAsgnA.id) {
          return {
            ...a,
            nurseId: nurseBId,
            source: 'MANUAL' as const,
            note: `Swapped with ${nurseA?.fullName}. Reason: ${reasonText}`,
          };
        }
        if (a.id === selectedAsgnB.id) {
          return {
            ...a,
            nurseId: nurseAId,
            source: 'MANUAL' as const,
            note: `Swapped with ${nurseB?.fullName}. Reason: ${reasonText}`,
          };
        }
        return a;
      });

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
        note: `Shift swap between ${nurseA?.fullName} and ${nurseB?.fullName}, recorded by ${recordedBy}: ${reasonText}`,
        timestamp: nowIso,
      });

      onApplySwap(
        updatedAssignments,
        `Swapped shifts between ${nurseA?.fullName} (${formatDate(selectedAsgnA.date)}) and ${nurseB?.fullName} (${formatDate(selectedAsgnB.date)})`
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

        {validation.notes.length > 0 && (
          <div role="status" className="mx-4 mb-3 p-2.5 rounded border border-amber-200 bg-amber-50 text-amber-900 text-xs space-y-1">
            {validation.notes.map((msg, i) => (
              <p key={i}>{msg} You can still swap, because this rule is followed when possible.</p>
            ))}
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

          <button
            type="button"
            disabled={!validation.isValid || isExecuting}
            onClick={handleExecuteSwap}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer shadow-xs disabled:opacity-40 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
            <span>Swap shifts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
