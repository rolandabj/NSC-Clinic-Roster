/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The checks behind the swap and fairness dialogs, so a move they allow never
 * turns into a "Must fix" afterwards. A moved shift must:
 *   1. pass the hard rule checks for one cell (checkAssignment), with the end of
 *      the previous roster and the nurses' approved days off;
 *   2. fit the receiving nurse's list of doctors and specialties (listProblem);
 *   3. leave the roster check with no "Must fix" it doesn't show now, and none made
 *      bigger (rules about the whole roster: a senior nurse each day, the most hours
 *      allowed, and so on).
 * A swap that breaks only a nurse's list may still be saved as an agreed exception
 * (the owner's decision of 2026-10-06): the shift is marked, and the roster check
 * shows it as "Check". Fairness suggestions never make such a move.
 */

import type { Assignment, LockEntry, Nurse } from '../../types';
import type { ValidationFinding } from '../validation/ScheduleValidator';
import { AssignmentCheckContext, checkAssignment, listProblem } from './assignmentChecks';
import { AGREED_EXCEPTION_NOTE } from './lastResort';
import { formatDate } from '../../utils/dateUtils';

/** The roster check on a list of shifts, with everything else as it is now. */
export type RosterCheck = (assignments: Assignment[]) => ValidationFinding[];

/** The rest of the check context (the shifts are added by each check). */
export type MoveContext = Omit<AssignmentCheckContext, 'assignments'>;

/**
 * What the roster check shows after a change that it didn't show before: "Must fix"
 * (ERROR) findings under a new id or made bigger (more hours over the limit, a longer
 * gap), or "Check" (WARN) findings under an id it didn't show at all.
 */
export function newFindings(before: ValidationFinding[], after: ValidationFinding[], severity: 'ERROR' | 'WARN'): ValidationFinding[] {
  const had = new Map<string, ValidationFinding>();
  for (const f of before) if (f.severity === 'ERROR' || (severity === 'WARN' && f.severity === 'WARN')) had.set(f.id, f);
  return after.filter((f) => {
    if (f.severity !== severity) return false;
    const old = had.get(f.id);
    if (!old) return true;
    return severity === 'ERROR' && old.severity === 'ERROR' && f.amount !== undefined && old.amount !== undefined && f.amount > old.amount + 1e-6;
  });
}

/** A shift that can't be given away: pinned on the roster or by a pin for that day. */
export function isPinnedShift(shift: Assignment, locks: LockEntry[]): boolean {
  return (
    !!shift.locked ||
    shift.source === 'LOCK' ||
    locks.some((l) => l.nurseId === shift.nurseId && l.date === shift.date && l.mode === 'ASSIGNMENT')
  );
}

export interface SwapCheck {
  /** Why the first nurse can't give their shift away or take the second nurse's one. */
  issuesA: string[];
  /** The same for the second nurse. */
  issuesB: string[];
  /** "Must fix" findings of the roster check that the swap adds or makes bigger (rules about the whole roster). */
  rosterIssues: string[];
  /** The second nurse's shift is outside the first nurse's list (the reason), or null. */
  listA: string | null;
  /** The first nurse's shift is outside the second nurse's list, or null. */
  listB: string | null;
  /** New "Check" findings after the swap (shown, never blocking); with the exception marks when needed. */
  checks: string[];
  /** The swap breaks no rule. */
  ok: boolean;
  /** The swap breaks only a nurse's list: it may be saved as an agreed exception. */
  exceptionOnly: boolean;
}

/**
 * Checks a swap: `shiftA` (the first nurse's) goes to the second nurse and
 * `shiftB` to the first. `before` is the roster check on the roster as it is now.
 */
export function checkSwap(input: {
  assignments: Assignment[];
  /** Shifts from the roster just before this one (rest and days in a row at its start). */
  prior?: Assignment[];
  shiftA: Assignment;
  shiftB: Assignment;
  ctx: MoveContext;
  checkRoster: RosterCheck;
  before: ValidationFinding[];
}): SwapCheck {
  const { shiftA, shiftB, ctx } = input;
  const name = (id: string) => ctx.nurses.find((n) => n.id === id)?.fullName || 'This nurse';
  const issuesA: string[] = [];
  const issuesB: string[] = [];
  if (isPinnedShift(shiftA, ctx.locks)) issuesA.push(`${name(shiftA.nurseId)}'s shift on ${formatDate(shiftA.date)} is a pinned day and can't be swapped`);
  if (isPinnedShift(shiftB, ctx.locks)) issuesB.push(`${name(shiftB.nurseId)}'s shift on ${formatDate(shiftB.date)} is a pinned day and can't be swapped`);

  // The shifts as the swap saves them (a hand change with the swap's note; the reason typed doesn't matter here).
  const notes = swapNotes(name(shiftA.nurseId), name(shiftB.nurseId), 'agreed between the nurses');
  const toA: Assignment = { ...shiftB, nurseId: shiftA.nurseId, source: 'MANUAL', note: notes.b };
  const toB: Assignment = { ...shiftA, nurseId: shiftB.nurseId, source: 'MANUAL', note: notes.a };
  const after = input.assignments.map((x) => (x.id === shiftA.id ? toB : x.id === shiftB.id ? toA : x));
  const cellCtx: AssignmentCheckContext = { ...ctx, assignments: [...(input.prior || []), ...after] };
  issuesA.push(...checkAssignment(cellCtx, toA));
  issuesB.push(...checkAssignment(cellCtx, toB));
  const listA = listProblem(cellCtx, toA);
  const listB = listProblem(cellCtx, toB);

  const rosterIssues: string[] = [];
  const checks: string[] = [];
  // The roster check only when each shift passes on its own (it would repeat the same reasons).
  if (issuesA.length === 0 && issuesB.length === 0) {
    const mark = (s: Assignment, outside: string | null) => (outside ? { ...s, note: `${AGREED_EXCEPTION_NOTE}. ${s.note}` } : s);
    const marked = after.map((x) => (x === toA ? mark(toA, listA) : x === toB ? mark(toB, listB) : x));
    const found = input.checkRoster(marked);
    rosterIssues.push(...newFindings(input.before, found, 'ERROR').map((f) => f.message));
    checks.push(...newFindings(input.before, found, 'WARN').map((f) => f.message));
  }

  const blocked = issuesA.length > 0 || issuesB.length > 0 || rosterIssues.length > 0;
  return {
    issuesA,
    issuesB,
    rosterIssues,
    listA,
    listB,
    checks,
    ok: !blocked && !listA && !listB,
    exceptionOnly: !blocked && (!!listA || !!listB),
  };
}

/**
 * The notes of the two swapped shifts (for swapShifts: `a` goes with the first
 * nurse's shift to the second nurse, `b` the other way). A shift taken outside the
 * nurse's list as an agreed exception starts with the exception mark.
 */
export function swapNotes(
  nameA: string,
  nameB: string,
  reason: string,
  exception: { toA: boolean; toB: boolean } = { toA: false, toB: false }
): { a: string; b: string } {
  const mark = (yes: boolean, text: string) => (yes ? `${AGREED_EXCEPTION_NOTE}. ${text}` : text);
  return {
    a: mark(exception.toB, `Swapped with ${nameA}. Reason: ${reason}`),
    b: mark(exception.toA, `Swapped with ${nameB}. Reason: ${reason}`),
  };
}

/** The fields a fairness move gives the moved shift. */
export function rebalancedFields(from: Pick<Nurse, 'fullName'>): Partial<Assignment> {
  return { source: 'GENERATED', note: `Rebalanced from ${from.fullName}` };
}

export interface MoveSuggestion {
  id: string;
  date: string;
  dutyName: string;
  overloadedNurse: Nurse;
  underloadedNurse: Nurse;
  assignmentA: Assignment;
  reason: string;
}

/**
 * Fairness suggestions: shifts that move from a nurse with too many hours or late
 * shifts to one with fewer. Each move is checked against the roster as it would be
 * after the moves before it: the hard rules for the cell, the receiving nurse's list
 * (never an exception here) and, when given, the roster check (no new "Must fix").
 * The roster check takes a while on a big roster, so it runs at most
 * `maxRosterChecks` times; no move is suggested without it.
 */
export function suggestMoves(input: {
  overloaded: { nurse: Nurse; hoursDelta: number }[];
  underloaded: { nurse: Nurse }[];
  assignments: Assignment[];
  prior?: Assignment[];
  ctx: MoveContext;
  checkRoster?: RosterCheck;
  /** The roster check on the roster as it is now (needed with checkRoster). */
  before?: ValidationFinding[];
  max?: number;
  maxRosterChecks?: number;
}): MoveSuggestion[] {
  const { ctx, prior = [], max = 6, maxRosterChecks = 12 } = input;
  const dutyMap = new Map(ctx.dutyWindows.map((d) => [d.id, d]));
  const before = input.checkRoster ? input.before || input.checkRoster(input.assignments) : [];
  const moves: MoveSuggestion[] = [];
  let working = [...input.assignments];
  const used = new Set<string>();
  let rosterChecks = 0;

  for (const over of input.overloaded) {
    for (const under of input.underloaded) {
      if (over.nurse.id === under.nurse.id) continue;
      const candidates = working.filter((a) => a.nurseId === over.nurse.id && !isPinnedShift(a, ctx.locks) && !used.has(a.id));
      for (const shift of candidates) {
        const moved: Assignment = { ...shift, ...rebalancedFields(over.nurse), nurseId: under.nurse.id };
        const next = working.map((a) => (a.id === shift.id ? moved : a));
        const cellCtx: AssignmentCheckContext = { ...ctx, assignments: [...prior, ...next] };
        if (checkAssignment(cellCtx, moved).length > 0 || listProblem(cellCtx, moved)) continue;
        if (input.checkRoster) {
          if (rosterChecks >= maxRosterChecks) return moves;
          rosterChecks++;
          if (newFindings(before, input.checkRoster(next), 'ERROR').length > 0) continue;
        }
        working = next;
        used.add(shift.id);
        const dw = dutyMap.get(shift.dutyWindowId);
        moves.push({
          id: `swap-${shift.id}-${under.nurse.id}`,
          date: shift.date,
          dutyName: dw ? `${dw.name} (${dw.startTime}–${dw.endTime})` : 'Shift',
          overloadedNurse: over.nurse,
          underloadedNurse: under.nurse,
          assignmentA: shift,
          reason: over.hoursDelta > 0 ? `${over.nurse.fullName} is ${over.hoursDelta}h over their goal` : `${over.nurse.fullName} has many late shifts`,
        });
        if (moves.length >= max) return moves;
      }
    }
  }
  return moves;
}
