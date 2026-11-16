import type { Assignment, AvailabilityRequest, ClinicalRole, Doctor, DoctorSession, DutyWindow, LeaveEntry, LockEntry, Nurse, Specialty } from '../../types';
import { assignmentCoversDoctor, assignmentDoctorIds, canBeFreeNurse, coverageSlots, doctorSessionsOn, isFreeDuring, overlaps, uncoveredParts, type ResolvedClinicSetup } from './clinicModel';
import { doctorPairingProblems } from './doctorPairing';
import { isFloatShift } from './floatShift';
import { outsideNurseList } from './nurseList';
import { isExclusiveNurseClinic } from './nurseClinicUtils';
import { nurseIsAvailable } from './assignmentPresence';

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

/** Find separate doctor cover using current Float duties, preserving required free nurse cover. */
export function separateLowAcuityCover(ctx: FloatCoverContext, pair: Assignment): FloatCoverResult {
  const none = { searchLimited: false };
  if (!pair.secondDoctorId || doctorPairingProblems(pair, ctx.doctors).length || ctx.clinic.holidays.has(pair.date)) return none;
  const day = ctx.assignments.filter(a => a.date === pair.date);
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const nurses = new Map(ctx.nurses.map(n => [n.id, n]));
  const pairDuty = duties.get(pair.dutyWindowId);
  if (!pairDuty) return none;
  const sessions = doctorSessionsOn(ctx.sessions, pair.date);
  const refs = { doctors: ctx.doctors, specialties: ctx.specialties, sessions };
  const present = (a: Assignment) => nurseIsAvailable(nurses.get(a.nurseId), pair.date,
    { leaveEntries: ctx.leave, locks: ctx.locks, availabilityRequests: ctx.requests });
  const available = day.filter(a => {
    const n = nurses.get(a.nurseId), d = duties.get(a.dutyWindowId);
    return isFloatShift(a) && a.nurseId !== pair.nurseId && !a.locked && a.source !== 'LOCK' &&
      (!ctx.movable || ctx.movable(a)) && d && n && present(a) && n.isClinicNurse && !isExclusiveNurseClinic(n, ctx.roles) &&
      day.filter(other => other.nurseId === n.id).length === 1 &&
      !ctx.locks.some(lock => lock.nurseId === n.id && lock.date === pair.date);
  });
  if (!available.length) return none;
  const slots = coverageSlots(ctx.clinic, day.map(a => duties.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d), sessions);
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
    const single: Assignment = { ...pair, doctorId: remainingDoctorId, secondDoctorId: undefined, allocationReview: undefined };
    const candidates = available.filter(a => overlaps(duties.get(a.dutyWindowId)!.startTime, duties.get(a.dutyWindowId)!.endTime, start, end) &&
      !outsideNurseList(nurses.get(a.nurseId)!, { ...a, kind: 'DOCTOR', doctorId, secondDoctorId: undefined }, refs))
      .sort((a, b) => duties.get(b.dutyWindowId)!.endTime.localeCompare(duties.get(a.dutyWindowId)!.endTime) || a.id.localeCompare(b.id));
    const existing = day.filter(a => a.id !== pair.id && present(a) && assignmentCoversDoctor(a, doctorId) &&
      nurses.get(a.nurseId)?.isClinicNurse && !outsideNurseList(nurses.get(a.nurseId)!, a, refs))
      .map(a => duties.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d);
    if (!uncoveredParts(start, end, existing).length || uncoveredParts(start, end, [...existing, ...candidates.map(a => duties.get(a.dutyWindowId)!)]).length) continue;
    const convert = (a: Assignment): Assignment => ({ ...a, kind: 'DOCTOR', doctorId, secondDoctorId: undefined,
      clinicalRoleId: undefined, specialtyId: undefined, allocationReview: undefined, note: 'Separate doctor cover using an available Float nurse' });
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
  for (const pair of ctx.assignments) {
    if (!pair.secondDoctorId || !maySplit(pair)) continue;
    const result = separateLowAcuityCover({ ...ctx, assignments }, pair);
    if (!result.replacement) continue;
    const changes = new Map(result.replacement.changes.map(a => [a.id, a]));
    assignments = assignments.map(a => changes.get(a.id) || a);
  }
  return assignments;
}
