import type { Assignment, AvailabilityRequest, ClinicalRole, Doctor, DoctorSession, DutyWindow, LeaveEntry, LockEntry, Nurse, Specialty } from '../../types';
import { assignmentCoversDoctor, assignmentDoctorIds, canBeFreeNurse, coverageSlots, doctorSessionsOn, isFreeDuring, overlaps, uncoveredParts, effectiveDoctorCoverage, freeDoctorIntervals, simultaneousDoctorIntervals, type ResolvedClinicSetup } from './clinicModel';
import { doctorPairingProblems } from './doctorPairing';
import { isFloatShift } from './floatShift';
import { outsideNurseList } from './nurseList';
import { isExclusiveNurseClinic } from './nurseClinicUtils';
import { assignmentCanCoverDoctor, nurseIsAvailable } from './assignmentPresence';
import { subtractDoctorCoverage, withDoctorCoverage } from './timedAllocation';
import { LAST_RESORT_NOTE, isLastResortShift } from './lastResort';
import { applyPreferenceFocus } from './preferenceOrder';

export interface FloatCoverContext {
  assignments: Assignment[];
  nurses: Nurse[];
  duties: DutyWindow[];
  doctors: Doctor[];
  specialties: Specialty[];
  sessions: DoctorSession[];
  roles: ClinicalRole[];
  leave: LeaveEntry[];
  locks: LockEntry[];
  requests: AvailabilityRequest[];
  clinic: ResolvedClinicSetup;
  minFreeNurses: number;
  /** Generation must preserve retained duties, even when an unpinned Float could be moved by hand. */
  movable?: (a: Assignment) => boolean;
}
export interface FloatReplacement {
  doctorId: string;
  floats: Assignment[];
  /** Proposed shifts only. The caller decides whether to apply them. Hours and dates never change. */
  changes: Assignment[];
}
export interface FloatCoverResult { replacement?: FloatReplacement; searchLimited: boolean }

const coverageContext = (ctx: FloatCoverContext) => ({ nurses: ctx.nurses, roles: ctx.roles, doctors: ctx.doctors,
  specialties: ctx.specialties, sessions: ctx.sessions, leaveEntries: ctx.leave, locks: ctx.locks, availabilityRequests: ctx.requests });

/** A preference exception may provide separate cover, but never clinical permission. */
function canProvideCover(ctx: FloatCoverContext, assignment: Assignment, doctorId?: string): boolean {
  const proposal = doctorId ? { ...assignment, kind: 'DOCTOR' as const, doctorId, secondDoctorId: undefined,
    note: LAST_RESORT_NOTE } : { ...assignment, note: LAST_RESORT_NOTE };
  return assignmentCanCoverDoctor(proposal, coverageContext(ctx), doctorId);
}

function withCoverNote(ctx: FloatCoverContext, assignment: Assignment, note: string): Assignment {
  const nurse = ctx.nurses.find(n => n.id === assignment.nurseId);
  const outside = nurse && outsideNurseList(nurse, assignment, ctx);
  return { ...assignment, note: outside && !outside.eligibility ? LAST_RESORT_NOTE
    : isLastResortShift({ note }) ? 'Separate doctor cover using available Float time' : note };
}

function preferenceRank(ctx: FloatCoverContext, assignment: Assignment, doctorId: string): number {
  const nurse = ctx.nurses.find(n => n.id === assignment.nurseId);
  if (!nurse) return Infinity;
  const proposal = { ...assignment, kind: 'DOCTOR' as const, doctorId, secondDoctorId: undefined };
  return Math.min(Infinity, ...(applyPreferenceFocus(nurse).preferences || []).filter(p =>
    (p.kind === 'DOCTOR' || p.kind === 'SPECIALTY') && !outsideNurseList({ preferences: [p] }, proposal, ctx)).map(p => p.rank));
}

/** Find separate doctor cover using current Float duties, preserving required free nurse cover. */
export function separateLowAcuityCover(ctx: FloatCoverContext, pair: Assignment): FloatCoverResult {
  const none = { searchLimited: false };
  if (!pair.secondDoctorId || pair.doctorCoverage !== undefined || doctorPairingProblems(pair, ctx.doctors).length || ctx.clinic.holidays.has(pair.date)) return none;
  const day = ctx.assignments.filter(a => a.date === pair.date);
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const nurses = new Map(ctx.nurses.map(n => [n.id, n]));
  const pairDuty = duties.get(pair.dutyWindowId);
  if (!pairDuty) return none;
  const sessions = doctorSessionsOn(ctx.sessions, pair.date);
  const present = (a: Assignment) => nurseIsAvailable(nurses.get(a.nurseId), pair.date,
    { leaveEntries: ctx.leave, locks: ctx.locks, availabilityRequests: ctx.requests });
  const available = day.filter(a => {
    const n = nurses.get(a.nurseId), d = duties.get(a.dutyWindowId);
    return a.doctorCoverage === undefined && isFloatShift(a) && a.nurseId !== pair.nurseId && !a.locked && a.source !== 'LOCK' &&
      (!ctx.movable || ctx.movable(a)) && d && n && present(a) && n.isClinicNurse && !isExclusiveNurseClinic(n, ctx.roles) &&
      day.filter(other => other.nurseId === n.id).length === 1 &&
      !ctx.locks.some(lock => lock.nurseId === n.id && lock.date === pair.date);
  });
  if (!available.length) return none;
  const slots = coverageSlots(ctx.clinic, day.map(a => duties.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d), sessions,
    day.flatMap(a => effectiveDoctorCoverage(a, duties.get(a.dutyWindowId), sessions)));
  const freeCounts = (list: Assignment[]) => slots.map(h => new Set(list.filter(a =>
    present(a) && canBeFreeNurse(nurses.get(a.nurseId), ctx.roles) &&
    list.filter(other => other.nurseId === a.nurseId).every(other => isFreeDuring(other, duties.get(other.dutyWindowId), sessions, h.start, h.end)))
    .map(a => a.nurseId)).size);
  const before = freeCounts(day);
  const safe = (changes: Assignment[]) => {
    const changed = new Map(changes.map(a => [a.id, a]));
    return freeCounts(day.map(a => changed.get(a.id) || a)).every((n, i) => n >= Math.min(ctx.minFreeNurses, before[i]));
  };
  let examined = 0;
  // Prefer one Float for either doctor before trying handovers. Keep the primary doctor when both choices fit.
  for (const allowHandover of [false, true]) for (const doctorId of [...assignmentDoctorIds(pair)].reverse()) {
    const session = sessions.find(s => s.doctorId === doctorId);
    if (!session) continue;
    const start = session.startTime > pairDuty.startTime ? session.startTime : pairDuty.startTime;
    const end = session.endTime < pairDuty.endTime ? session.endTime : pairDuty.endTime;
    if (start >= end) continue;
    const remainingDoctorId = assignmentDoctorIds(pair).find(id => id !== doctorId)!;
    const single = withCoverNote(ctx, { ...pair, doctorId: remainingDoctorId, secondDoctorId: undefined, allocationReview: undefined },
      pair.note || 'Separate doctor cover using available Float time');
    const candidates = available.filter(a => overlaps(duties.get(a.dutyWindowId)!.startTime, duties.get(a.dutyWindowId)!.endTime, start, end) &&
      canProvideCover(ctx, a, doctorId))
      .sort((a, b) => preferenceRank(ctx, a, doctorId) - preferenceRank(ctx, b, doctorId) ||
        duties.get(b.dutyWindowId)!.endTime.localeCompare(duties.get(a.dutyWindowId)!.endTime) || a.id.localeCompare(b.id));
    const existing = day.filter(a => a.id !== pair.id && present(a) && assignmentCoversDoctor(a, doctorId) &&
      assignmentCanCoverDoctor(a, coverageContext(ctx), doctorId))
      .flatMap(a => effectiveDoctorCoverage(a, duties.get(a.dutyWindowId), sessions).filter(r => r.doctorId === doctorId));
    if (!uncoveredParts(start, end, existing).length || uncoveredParts(start, end, [...existing, ...candidates.map(a => duties.get(a.dutyWindowId)!)]).length) continue;
    const convert = (a: Assignment): Assignment => withCoverNote(ctx, { ...a, kind: 'DOCTOR', doctorId, secondDoctorId: undefined,
      clinicalRoleId: undefined, specialtyId: undefined, allocationReview: undefined }, 'Separate doctor cover using an available Float nurse');
    const changesFor = (selected: Assignment[]) => [single, ...selected.map(convert)];
    // Taking over the complete contribution of the paired duty avoids introducing a new doctor gap.
    const search = (selected: Assignment[]): Assignment[] | undefined => {
      if (++examined > 512) return undefined;
      const gaps = uncoveredParts(start, end, [...existing, ...selected.map(a => duties.get(a.dutyWindowId)!)]);
      if (!gaps.length) return selected;
      for (const a of candidates) {
        const d = duties.get(a.dutyWindowId)!;
        if (selected.includes(a) || d.startTime > gaps[0].start || d.endTime <= gaps[0].start) continue;
        const next = [...selected, a];
        if (!safe(changesFor(next))) continue;
        const found = search(next);
        if (found) return found;
      }
      return undefined;
    };
    const whole = candidates.find(a => !uncoveredParts(start, end, [...existing, duties.get(a.dutyWindowId)!]).length && safe(changesFor([a])));
    const selected = whole ? [whole] : allowHandover ? search([]) : undefined;
    if (selected) return { replacement: { doctorId, floats: selected, changes: changesFor(selected) }, searchLimited: false };
  }
  return { searchLimited: examined > 512 };
}

/** Recheck generated pairs after top up has made the day's final Float duties available. */
export function applySeparateFloatCover(ctx: FloatCoverContext, maySplit: (a: Assignment) => boolean): Assignment[] {
  let assignments = ctx.assignments;
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const nurses = new Map(ctx.nurses.map(n => [n.id, n]));
  const present = (a: Assignment) => nurseIsAvailable(nurses.get(a.nurseId), a.date,
    { leaveEntries: ctx.leave, locks: ctx.locks, availabilityRequests: ctx.requests });
  const movable = (a: Assignment) => a.source === 'GENERATED' && !a.locked &&
    (!ctx.movable || ctx.movable(a)) && !ctx.locks.some(l => l.nurseId === a.nurseId && l.date === a.date);
  for (const original of ctx.assignments) {
    const first = assignments.find(a => a.id === original.id)!;
    if (!first.secondDoctorId || !movable(first) || !maySplit(first) || ctx.clinic.holidays.has(first.date)) continue;
    const sessions = doctorSessionsOn(ctx.sessions, original.date);
    const pairNurse = nurses.get(first.nurseId);
    if (!present(first) || !pairNurse?.isClinicNurse || !canProvideCover(ctx, first) ||
      doctorPairingProblems(first, ctx.doctors, { duty: duties.get(first.dutyWindowId), sessions }).length) continue;
    const pairCover = effectiveDoctorCoverage(first, duties.get(first.dutyWindowId), sessions);
    const candidates = assignments.filter(a => {
      const n = nurses.get(a.nurseId);
      return a.date === first.date && a.nurseId !== first.nurseId && movable(a) && present(a) &&
        n?.isClinicNurse && !isExclusiveNurseClinic(n, ctx.roles) && (isFloatShift(a) || a.kind === 'DOCTOR') &&
        assignments.filter(other => other.date === a.date && other.nurseId === a.nurseId).length === 1;
    });
    let complete = false;
    // Prefer giving either complete doctor contribution to one nurse before a handover.
    for (const doctorId of [...assignmentDoctorIds(first)].reverse()) {
      const contribution = pairCover.filter(r => r.doctorId === doctorId);
      for (const candidate of [...candidates].sort((a, b) => preferenceRank(ctx, a, doctorId) - preferenceRank(ctx, b, doctorId) || a.id.localeCompare(b.id))) {
        if (assignmentDoctorIds(candidate).filter(id => id !== doctorId).length >= 2 ||
          !canProvideCover(ctx, candidate, doctorId)) continue;
        const free = freeDoctorIntervals(candidate, duties.get(candidate.dutyWindowId), sessions);
        if (!contribution.length || contribution.some(r => uncoveredParts(r.startTime, r.endTime, free).length)) continue;
        const nextPair = withCoverNote(ctx, withDoctorCoverage(first, pairCover.filter(r => r.doctorId !== doctorId)),
          first.note || 'Separate doctor cover using available Float time');
        const nextHelper = withCoverNote(ctx, withDoctorCoverage(candidate,
          [...effectiveDoctorCoverage(candidate, duties.get(candidate.dutyWindowId), sessions), ...contribution]), 'Doctor cover using available Float time');
        const after = assignments.map(a => a.id === first.id ? nextPair : a.id === candidate.id ? nextHelper : a);
        if (!preservesFreeNurseCover(ctx, assignments, after, first.date)) continue;
        assignments = after; complete = true; break;
      }
      if (complete) break;
    }
    if (complete) continue;
    const whole = separateLowAcuityCover({ ...ctx, assignments, movable }, first).replacement;
    let preferred = whole ? new Set(whole.floats.map(a => a.id)) : undefined;
    // A single nurse who can relieve every shared minute avoids an unnecessary handover.
    if (!preferred) {
      const shared = simultaneousDoctorIntervals(first, duties.get(first.dutyWindowId), sessions);
      for (const candidate of assignments.filter(a => a.date === original.date && a.id !== original.id && movable(a))) {
        const relief = timedFloatRelief({ ...ctx, assignments, movable: a => movable(a) && a.id === candidate.id }, first);
        if (shared.length && shared.every(r => uncoveredParts(r.startTime, r.endTime, relief).length === 0)) {
          preferred = new Set([candidate.id]); break;
        }
      }
    }
    // Recalculate after every transfer. In particular, a Float consumed for one slice
    // cannot still count as the free Nurse Clinic nurse in another overlapping slice.
    for (let step = 0; step < 512; step++) {
      const pair = assignments.find(a => a.id === original.id)!;
      if (!pair.secondDoctorId) break;
      const relief = timedFloatRelief({ ...ctx, assignments,
        movable: a => movable(a) && (!preferred || preferred.has(a.id)) }, pair)[0];
      if (!relief) {
        if (preferred) { preferred = undefined; continue; }
        break;
      }
      const helper = assignments.find(a => a.id === relief.floatAssignment.id)!;
      const transferred = { doctorId: relief.doctorId, startTime: relief.startTime, endTime: relief.endTime };
      const nextPair = withDoctorCoverage(pair, subtractDoctorCoverage(
        effectiveDoctorCoverage(pair, duties.get(pair.dutyWindowId), sessions), [transferred]));
      const nextHelper = withDoctorCoverage(helper, [...effectiveDoctorCoverage(helper, duties.get(helper.dutyWindowId), sessions), transferred]);
      assignments = assignments.map(a => a.id === pair.id ? withCoverNote(ctx, nextPair, pair.note || 'Separate doctor cover using available Float time')
        : a.id === helper.id ? withCoverNote(ctx, nextHelper, 'Doctor cover using available Float time') : a);
    }
  }
  return assignments;
}

/** A full handover can free the paired nurse while consuming Float time elsewhere. */
function preservesFreeNurseCover(ctx: FloatCoverContext, before: Assignment[], after: Assignment[], date: string): boolean {
  if (ctx.minFreeNurses <= 0) return true;
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const nurses = new Map(ctx.nurses.map(n => [n.id, n]));
  const sessions = doctorSessionsOn(ctx.sessions, date);
  const present = (a: Assignment) => nurseIsAvailable(nurses.get(a.nurseId), date,
    { leaveEntries: ctx.leave, locks: ctx.locks, availabilityRequests: ctx.requests });
  const count = (list: Assignment[], start: string, end: string) => new Set(list.filter(a => a.date === date &&
    present(a) && canBeFreeNurse(nurses.get(a.nurseId), ctx.roles) && list.filter(other => other.date === date && other.nurseId === a.nurseId)
      .every(other => isFreeDuring(other, duties.get(other.dutyWindowId), sessions, start, end))).map(a => a.nurseId)).size;
  const checks = coverageSlots(ctx.clinic, ctx.duties, sessions,
    [...before, ...after].filter(a => a.date === date).flatMap(a => effectiveDoctorCoverage(a, duties.get(a.dutyWindowId), sessions)));
  return checks.every(h => count(after, h.start, h.end) >= Math.min(ctx.minFreeNurses, count(before, h.start, h.end)));
}

export interface TimedFloatRelief {
  doctorId: string;
  floatAssignment: Assignment;
  startTime: string;
  endTime: string;
}

/** Read only: identify actual shared minutes that an eligible free nurse could cover. */
export function timedFloatRelief(ctx: FloatCoverContext, pair: Assignment): TimedFloatRelief[] {
  const day = ctx.assignments.filter(a => a.date === pair.date);
  const sessions = doctorSessionsOn(ctx.sessions, pair.date);
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const nurses = new Map(ctx.nurses.map(n => [n.id, n]));
  const duty = duties.get(pair.dutyWindowId);
  if (ctx.clinic.holidays.has(pair.date) ||
    doctorPairingProblems(pair, ctx.doctors, { duty, sessions }).length) return [];
  const shared = simultaneousDoctorIntervals(pair, duty, sessions);
  if (!shared.length) return [];
  const present = (a: Assignment) => nurseIsAvailable(nurses.get(a.nurseId), pair.date,
    { leaveEntries: ctx.leave, locks: ctx.locks, availabilityRequests: ctx.requests });
  const free = new Map(day.map(a => [a.id, freeDoctorIntervals(a, duties.get(a.dutyWindowId), sessions)]));
  const candidates = day.filter(a => {
    const n = nurses.get(a.nurseId);
    return a.nurseId !== pair.nurseId && present(a) && n?.isClinicNurse && !isExclusiveNurseClinic(n, ctx.roles) &&
      !a.locked && a.source !== 'LOCK' && (!ctx.movable || ctx.movable(a)) &&
      !ctx.locks.some(lock => lock.nurseId === a.nurseId && lock.date === pair.date) &&
      day.filter(other => other.nurseId === a.nurseId).length === 1 &&
      (isFloatShift(a) || a.kind === 'DOCTOR') && (free.get(a.id) || []).length > 0;
  }).sort((a, b) => a.id.localeCompare(b.id));
  const candidatesByDoctor = new Map(assignmentDoctorIds(pair).map(doctorId => [doctorId,
    [...candidates].sort((a, b) => preferenceRank(ctx, a, doctorId) - preferenceRank(ctx, b, doctorId) || a.id.localeCompare(b.id))]));
  const boundaries = [...new Set([ctx.clinic.openTime, ctx.clinic.closeTime,
    ...shared.flatMap(r => [r.startTime, r.endTime]),
    ...day.flatMap(a => (free.get(a.id) || []).flatMap(r => [r.startTime, r.endTime])),
    ...day.flatMap(a => effectiveDoctorCoverage(a, duties.get(a.dutyWindowId), sessions).flatMap(r => [r.startTime, r.endTime]))])].sort();
  const results: TimedFloatRelief[] = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const startTime = boundaries[i], endTime = boundaries[i + 1];
    if (!shared.some(r => r.startTime <= startTime && r.endTime >= endTime)) continue;
    const freeNurses = new Set(day.filter(a => present(a) && canBeFreeNurse(nurses.get(a.nurseId), ctx.roles) &&
      day.filter(other => other.nurseId === a.nurseId).every(other => isFreeDuring(other, duties.get(other.dutyWindowId), sessions, startTime, endTime)))
      .map(a => a.nurseId)).size;
    const quota = startTime >= ctx.clinic.openTime && endTime <= ctx.clinic.closeTime ? ctx.minFreeNurses : 0;
    let chosen: TimedFloatRelief | undefined;
    for (const doctorId of [...assignmentDoctorIds(pair)].reverse()) {
      for (const a of candidatesByDoctor.get(doctorId) || []) {
        const ownIds = assignmentDoctorIds(a);
        if (!ownIds.includes(doctorId) && ownIds.length >= 2) continue;
        if (!(free.get(a.id) || []).some(r => r.startTime <= startTime && r.endTime >= endTime)) continue;
        const n = nurses.get(a.nurseId)!;
        if (!canProvideCover(ctx, a, doctorId)) continue;
        const cost = canBeFreeNurse(n, ctx.roles) ? 1 : 0;
        if (freeNurses - cost < Math.min(quota, freeNurses)) continue;
        chosen = { doctorId, floatAssignment: a, startTime, endTime };
        break;
      }
      if (chosen) break;
    }
    if (!chosen) continue;
    const last = results[results.length - 1];
    if (last && last.doctorId === chosen.doctorId && last.floatAssignment.id === chosen.floatAssignment.id && last.endTime === chosen.startTime) last.endTime = chosen.endTime;
    else results.push(chosen);
  }
  return results;
}
