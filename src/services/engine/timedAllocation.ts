import type { Assignment, ClinicalRole, Doctor, DoctorCoverageInterval, DoctorSession, DutyWindow, Nurse } from '../../types';
import { assignmentDoctorIds, canBeFreeNurse, canonicalDoctorCoverage, coverageSlots, doctorCoverageFingerprint,
  doctorSessionsOn, effectiveDoctorCoverage, freeDoctorIntervals, isFreeDuring, resolveDoctorCoverage,
  toMinutes, uncoveredParts, type ResolvedClinicSetup, type TimeRange } from './clinicModel';
import { FLOAT_ROLE_ID, isFloatShift } from './floatShift';

export interface TimedAllocationContext {
  assignments: Assignment[];
  dates: readonly string[];
  sessions: DoctorSession[];
  duties: DutyWindow[];
  nurses: Nurse[];
  doctors: Doctor[];
  roles: ClinicalRole[];
  clinic: ResolvedClinicSetup;
  minFreeNurses: number;
  movable: (assignment: Assignment) => boolean;
  present: (assignment: Assignment) => boolean;
  canCover: (assignment: Assignment, session: DoctorSession) => boolean;
  canPair: (nurseId: string, session: DoctorSession) => boolean;
  /** Checks configured duty extensions against the current complete roster. */
  canExtend?: (assignment: Assignment, duty: DutyWindow) => boolean;
  /** Keeps the caller's current roster and paid hours counters in step. */
  onChange?: (previous: Assignment, next: Assignment) => void;
}

/** Subtract only matching doctors, with an exclusive end at each handover. */
export function subtractDoctorCoverage(intervals: readonly DoctorCoverageInterval[], blockers: readonly DoctorCoverageInterval[]): DoctorCoverageInterval[] {
  return canonicalDoctorCoverage(intervals.flatMap(range => uncoveredParts(range.startTime, range.endTime,
    blockers.filter(other => other.doctorId === range.doctorId))
    .map(part => ({ doctorId: range.doctorId, startTime: part.start, endTime: part.end }))));
}

/** Materialize an automatic duty without carrying a manual overlap approval. */
export function withDoctorCoverage(assignment: Assignment, intervals: readonly DoctorCoverageInterval[]): Assignment {
  const cover = canonicalDoctorCoverage(intervals);
  const { manualDoctorOverlaps: _manualDoctorOverlaps, ...base } = assignment;
  if (!cover.length) return { ...base, kind: 'CLINICAL_ROLE', clinicalRoleId: FLOAT_ROLE_ID,
    doctorId: undefined, secondDoctorId: undefined, specialtyId: undefined, doctorCoverage: undefined, allocationReview: null };
  const ids = [...new Set(cover.map(r => r.doctorId))];
  if (ids.length > 2) throw new Error('A nurse may cover at most two doctors on one date.');
  const doctorId = assignment.doctorId && ids.includes(assignment.doctorId) ? assignment.doctorId : ids[0];
  const next: Assignment = { ...base, kind: 'DOCTOR', doctorId, secondDoctorId: ids.find(id => id !== doctorId),
    clinicalRoleId: undefined, specialtyId: undefined, doctorCoverage: cover };
  if (doctorCoverageFingerprint(next) !== doctorCoverageFingerprint(assignment) || assignment.kind !== next.kind ||
    assignment.doctorId !== next.doctorId || assignment.secondDoctorId !== next.secondDoctorId) next.allocationReview = null;
  return next;
}

const minutes = (ranges: readonly TimeRange[]) => ranges.reduce((sum, r) => sum + toMinutes(r.endTime) - toMinutes(r.startTime), 0);

/** Prefer one full session nurse, preserving every protected duty exactly as saved. */
export function normalizeGeneratedDoctorCoverage(ctx: TimedAllocationContext): Assignment[] {
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const result = [...ctx.assignments];
  for (const date of ctx.dates) {
    if (ctx.clinic.holidays.has(date)) continue;
    const sessions = doctorSessionsOn(ctx.sessions, date);
    const day = result.filter(a => a.date === date);
    const ranges = (a: Assignment) => effectiveDoctorCoverage(a, duties.get(a.dutyWindowId), sessions)
      .filter(r => { const session = sessions.find(s => s.doctorId === r.doctorId); return session && ctx.present(a) && ctx.canCover(a, session); });
    const fixed = day.filter(a => !ctx.movable(a));
    const occupied = fixed.flatMap(ranges);
    const generated = day.filter(a => ctx.movable(a) && a.kind === 'DOCTOR').sort((a, b) => {
      const full = (cell: Assignment) => sessions.filter(s => ranges(cell).some(r => r.doctorId === s.doctorId &&
        r.startTime <= s.startTime && r.endTime >= s.endTime)).length;
      const shared = (cell: Assignment) => assignmentDoctorIds(cell).length > 1 ? 1 : 0;
      return shared(a) - shared(b) || full(b) - full(a) ||
        (duties.get(a.dutyWindowId)?.startTime || '').localeCompare(duties.get(b.dutyWindowId)?.startTime || '') || a.id.localeCompare(b.id);
    });
    for (const previous of generated) {
      const intervals = subtractDoctorCoverage(ranges(previous), occupied);
      const next = withDoctorCoverage(previous, intervals);
      result[result.findIndex(a => a.id === previous.id)] = next;
      occupied.push(...intervals);
      ctx.onChange?.(previous, next);
    }
  }
  return result;
}

/** Keep required free nurse cover at every changed minute, including partial Float time. */
function keepsFreeCover(ctx: TimedAllocationContext, before: Assignment[], after: Assignment[], date: string): boolean {
  if (ctx.minFreeNurses <= 0) return true;
  const sessions = doctorSessionsOn(ctx.sessions, date);
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const nurses = new Map(ctx.nurses.map(n => [n.id, n]));
  const dayBefore = before.filter(a => a.date === date), dayAfter = after.filter(a => a.date === date);
  const bounds = [...dayBefore, ...dayAfter].flatMap(a => effectiveDoctorCoverage(a, duties.get(a.dutyWindowId), sessions));
  const checks = coverageSlots(ctx.clinic, ctx.duties, sessions, bounds);
  const count = (list: Assignment[], start: string, end: string) => new Set(list.filter(a => ctx.present(a) &&
    canBeFreeNurse(nurses.get(a.nurseId), ctx.roles) && list.filter(other => other.nurseId === a.nurseId)
      .every(other => isFreeDuring(other, duties.get(other.dutyWindowId), sessions, start, end))).map(a => a.nurseId)).size;
  return checks.every(h => count(dayAfter, h.start, h.end) >= Math.min(ctx.minFreeNurses, count(dayBefore, h.start, h.end)));
}

/**
 * Fill same day gaps from existing paid duties before permitting simultaneous cover.
 * This bounded construction does not perform the wider exchanges reserved for Stage 4.
 */
export function fillTimedDoctorGaps(ctx: TimedAllocationContext): Assignment[] {
  let result = [...ctx.assignments];
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const doctors = new Map(ctx.doctors.map(d => [d.id, d]));
  const active = ctx.duties.filter(d => d.active !== false)
    .sort((a, b) => minutes([a]) - minutes([b]) || a.id.localeCompare(b.id));
  for (const date of ctx.dates) {
    if (ctx.clinic.holidays.has(date)) continue;
    const sessions = doctorSessionsOn(ctx.sessions, date).sort((a, b) => a.startTime.localeCompare(b.startTime) || a.doctorId.localeCompare(b.doctorId));
    // Separate cover, including partial Float help, always gets the first complete pass.
    for (const allowShared of [false, true]) {
      for (const session of sessions) {
        for (let round = 0; round < ctx.assignments.length + 2; round++) {
          const day = result.filter(a => a.date === date);
          const covered = day.filter(a => ctx.present(a) && ctx.canCover(a, session))
            .flatMap(a => effectiveDoctorCoverage(a, duties.get(a.dutyWindowId), sessions).filter(r => r.doctorId === session.doctorId));
          const gaps = uncoveredParts(session.startTime, session.endTime, covered);
          if (!gaps.length) break;
          let best: { previous: Assignment; next: Assignment; list: Assignment[]; added: number; extra: number; existing: number } | undefined;
          for (const previous of day) {
            if (!ctx.movable(previous) || !ctx.present(previous) || !(previous.kind === 'DOCTOR' || isFloatShift(previous)) ||
              !ctx.canPair(previous.nurseId, session)) continue;
            const oldDuty = duties.get(previous.dutyWindowId);
            if (!oldDuty) continue;
            const resolved = resolveDoctorCoverage(previous, oldDuty, sessions);
            if (resolved.problems.length) continue;
            const ownIds = assignmentDoctorIds(previous);
            if (!ownIds.includes(session.doctorId) && ownIds.length >= 2) continue;
            if (allowShared && (!doctors.get(session.doctorId)?.lowAcuity || ownIds.some(id => !doctors.get(id)?.lowAcuity))) continue;
            for (const duty of active) {
              if (duty.startTime > oldDuty.startTime || duty.endTime < oldDuty.endTime ||
                (duty.id !== oldDuty.id && (!ctx.canExtend || !ctx.canExtend(previous, duty)))) continue;
              const free = allowShared ? [duty] : freeDoctorIntervals({ ...previous,
                ...(previous.kind === 'DOCTOR' ? { doctorCoverage: resolved.intervals } : {}) }, duty, sessions);
              const addedRanges = gaps.flatMap(gap => free.flatMap(range => {
                const startTime = [gap.start, range.startTime, duty.startTime].sort().at(-1)!;
                const endTime = [gap.end, range.endTime, duty.endTime].sort()[0];
                return startTime < endTime ? [{ doctorId: session.doctorId, startTime, endTime }] : [];
              }));
              const added = minutes(addedRanges);
              if (!added) continue;
              const next = withDoctorCoverage({ ...previous, dutyWindowId: duty.id }, [...resolved.intervals, ...addedRanges]);
              const list = result.map(a => a.id === previous.id ? next : a);
              if (!keepsFreeCover(ctx, result, list, date)) continue;
              const extra = minutes([duty]) - minutes([oldDuty]);
              const existing = ownIds.includes(session.doctorId) ? 1 : 0;
              if (!best || added > best.added || added === best.added && (existing > best.existing ||
                existing === best.existing && (extra < best.extra || extra === best.extra && previous.id.localeCompare(best.previous.id) < 0))) {
                best = { previous, next, list, added, extra, existing };
              }
            }
          }
          if (!best) break;
          result = best.list;
          ctx.onChange?.(best.previous, best.next);
        }
      }
    }
  }
  return result;
}
