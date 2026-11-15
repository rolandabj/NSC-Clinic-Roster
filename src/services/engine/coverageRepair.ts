/** Small, transactional repairs after generation and hours top up. */
import type { Assignment, ClinicalRole, DoctorSession, DutyWindow, Nurse } from '../../types';
import type { ValidationFinding } from '../validation/ScheduleValidator';
import { assignmentCoversDoctor, canBeFreeNurse, coverageSlots, doctorSessionsOn, isFreeDuring, nurseClinicRoleOf, overlaps, toMinutes,
  uncoveredParts, type ResolvedClinicSetup } from './clinicModel';
import { FLOAT_ROLE_ID } from './floatShift';

export interface CoverageRepairContext {
  assignments: Assignment[];
  dates: string[];
  sessions: DoctorSession[];
  nurses: Nurse[];
  duties: DutyWindow[];
  roles: ClinicalRole[];
  clinic: ResolvedClinicSetup;
  minFreeNurses: number;
  /** Keep nurse hours unchanged at each working period boundary as well as overall. */
  hoursCheckpoints?: readonly string[];
  movable: (assignment: Assignment) => boolean;
  canWorkOnDate: (nurseId: string, date: string) => boolean;
  canPair: (nurseId: string, session: DoctorSession) => boolean;
  /** Full roster check on the complete proposed transaction, with prior roster history. */
  validate: (assignments: Assignment[]) => ValidationFinding[];
}
interface RepairTarget { date: string; session?: DoctorSession }
interface Gap { start: string; end: string; deficit?: number }
interface DayCoverage {
  doctors: Map<string, Gap[]>;
  qualified: Map<string, Gap[]>;
  free: Gap[];
  missing: number;
  freeMissing: number;
  overlap: number;
}
const EPSILON = 1e-8;
const minutes = (gap: Gap) => toMinutes(gap.end) - toMinutes(gap.start);

/** Whether the new missing time was already missing, with at least that deficit. */
function preservesGaps(before: Gap[], after: Gap[]): boolean {
  return after.every(gap => {
    let cursor = gap.start;
    for (const old of before) {
      if (old.end <= cursor || (old.deficit || 1) < (gap.deficit || 1)) continue;
      if (old.start > cursor) return false;
      cursor = old.end;
      if (cursor >= gap.end) return true;
    }
    return false;
  });
}

/**
 * Keep each nurse's total hours, every previously covered minute and all retained duties.
 * A candidate remains private until the complete roster passes the checks. Search limits
 * are deterministic so large or impossible rosters cannot keep the repair loop running.
 */
export async function repairCoverage(ctx: CoverageRepairContext) {
  const duties = new Map(ctx.duties.map(d => [d.id, d]));
  const nurses = new Map(ctx.nurses.map(n => [n.id, n]));
  const hours = (a: Assignment) => {
    const d = duties.get(a.dutyWindowId);
    return d ? (toMinutes(d.endTime) - toMinutes(d.startTime)) / 60 : 0;
  };
  const dailySessions = new Map(ctx.dates.map(date => [date,
    ctx.clinic.holidays.has(date) ? [] : doctorSessionsOn(ctx.sessions, date)]));
  const coverage = (date: string, list: Assignment[]): DayCoverage => {
    const day = list.filter(a => a.date === date);
    const sessions = dailySessions.get(date) || [];
    const doctorGaps = new Map<string, Gap[]>();
    const qualified = new Map<string, Gap[]>();
    let missing = 0, overlap = 0;
    for (const sess of sessions) {
      const linked = day.filter(a => assignmentCoversDoctor(a, sess.doctorId));
      const gaps = uncoveredParts(sess.startTime, sess.endTime,
        linked.map(a => duties.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d));
      qualified.set(sess.id, uncoveredParts(sess.startTime, sess.endTime,
        linked.filter(a => ctx.canPair(a.nurseId, sess)).map(a => duties.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d)));
      doctorGaps.set(sess.id, gaps); missing += gaps.reduce((sum, g) => sum + minutes(g), 0);
      const bounds = [...new Set([sess.startTime, sess.endTime, ...linked.flatMap(a => {
        const d = duties.get(a.dutyWindowId); return d ? [d.startTime, d.endTime] : [];
      })])].filter(t => t >= sess.startTime && t <= sess.endTime).sort();
      for (let i = 0; i < bounds.length - 1; i++) {
        const count = new Set(linked.filter(a => {
          const d = duties.get(a.dutyWindowId);
          return d && overlaps(d.startTime, d.endTime, bounds[i], bounds[i + 1]);
        }).map(a => a.nurseId)).size;
        overlap += Math.max(0, count - 1) * (toMinutes(bounds[i + 1]) - toMinutes(bounds[i]));
      }
    }
    const free: Gap[] = [];
    const quota = ctx.clinic.holidays.has(date) ? 1 : ctx.minFreeNurses;
    const checks = coverageSlots(ctx.clinic,
      day.map(a => duties.get(a.dutyWindowId)).filter((d): d is DutyWindow => !!d), sessions);
    for (const h of checks) {
      const onDuty = day.filter(a => {
        const d = duties.get(a.dutyWindowId);
        return d && overlaps(d.startTime, d.endTime, h.start, h.end);
      });
      const freeIds = [...new Set(onDuty.map(a => a.nurseId))].filter(id => ctx.clinic.holidays.has(date) ||
        (canBeFreeNurse(nurses.get(id), ctx.roles) && onDuty.filter(a => a.nurseId === id)
          .every(a => isFreeDuring(a, duties.get(a.dutyWindowId), sessions, h.start, h.end))));
      const deficit = Math.max(0, quota - freeIds.length);
      if (deficit) free.push({ ...h, deficit });
    }
    return { doctors: doctorGaps, qualified, free, missing, overlap,
      freeMissing: free.reduce((sum, g) => sum + minutes(g) * g.deficit!, 0) };
  };
  let assignments = [...ctx.assignments];
  let states = new Map(ctx.dates.map(date => [date, coverage(date, assignments)]));
  let findings: ValidationFinding[] | undefined;
  let examined = 0, targetChecks = 0, validated = 0, repairedCount = 0;
  const candidateLimit = 16000;
  const perTargetLimit = 1600;
  const duration = (list: Assignment[], id: string, through?: string) => list.filter(a => a.nurseId === id && (!through || a.date <= through)).reduce((sum, a) => sum + hours(a), 0);
  const fixedFinding = (f: ValidationFinding) => f.severity === 'ERROR' || f.category === 'RULE_VIOLATION' ||
    /^(role-quota-|holiday-|h7-|hours-over-|hours-part-short-)/.test(f.id);
  const editable = (a: Assignment) => a.source === 'GENERATED' && !a.locked && !a.secondDoctorId &&
    duties.get(a.dutyWindowId)?.active === true && ctx.movable(a) && !ctx.clinic.holidays.has(a.date);
  const occupied = (id: string, date: string) => assignments.some(a => a.nurseId === id && a.date === date);
  const canFill = (id: string, target: RepairTarget) => target.session
    ? ctx.canPair(id, target.session)
    : ctx.clinic.holidays.has(target.date) || canBeFreeNurse(nurses.get(id), ctx.roles);
  const pair = (a: Assignment, target: RepairTarget): Assignment => {
    if (target.session) return { ...a, date: target.date, kind: 'DOCTOR', doctorId: target.session.doctorId, secondDoctorId: undefined,
      specialtyId: undefined, clinicalRoleId: undefined, note: 'Moved to cover the doctor session' };
    const nc = nurseClinicRoleOf(ctx.roles)?.id || 'role-nurse-clinic';
    const hasNc = assignments.some(a => a.date === target.date && a.kind === 'CLINICAL_ROLE' && a.clinicalRoleId === nc);
    return { ...a, date: target.date, kind: 'CLINICAL_ROLE', doctorId: undefined, secondDoctorId: undefined, specialtyId: undefined,
      clinicalRoleId: hasNc || ctx.clinic.holidays.has(target.date) ? FLOAT_ROLE_ID : nc,
      note: hasNc || ctx.clinic.holidays.has(target.date) ? 'Float' : 'Nurse Clinic cover' };
  };
  const tryChange = async (changes: Map<string, Assignment | null>): Promise<boolean> => {
    if (examined >= candidateLimit || targetChecks >= perTargetLimit || validated >= 80) return false;
    examined++; targetChecks++;
    if (examined % 100 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    const affected = new Set<string>();
    const changedNurses = new Set<string>();
    for (const [id, next] of changes) {
      const old = assignments.find(a => a.id === id);
      if (!old || !editable(old)) return false;
      affected.add(old.date); changedNurses.add(old.nurseId);
      if (!next) continue;
      if (!ctx.dates.includes(next.date) || !ctx.canWorkOnDate(next.nurseId, next.date) ||
        !nurses.has(next.nurseId) || nurses.get(next.nurseId)?.active === false) return false;
      if (next.kind === 'DOCTOR') {
        const sess = dailySessions.get(next.date)?.find(s => s.doctorId === next.doctorId);
        if (!sess || !ctx.canPair(next.nurseId, sess)) return false;
      }
      affected.add(old.date); affected.add(next.date);
      changedNurses.add(old.nurseId); changedNurses.add(next.nurseId);
    }
    const apply = () => assignments.flatMap(a => changes.has(a.id) ? (changes.get(a.id) ? [changes.get(a.id)!] : []) : [a]);
    const after = apply();
    const cells = new Set(after.map(a => `${a.nurseId}|${a.date}`));
    if (cells.size !== after.length) return false;
    for (const id of changedNurses) {
      if (Math.abs(duration(after, id) - duration(assignments, id)) > EPSILON) return false;
      for (const end of ctx.hoursCheckpoints || []) {
        if (Math.abs(duration(after, id, end) - duration(assignments, id, end)) > EPSILON) return false;
      }
    }
    let missingGain = 0, freeGain = 0, overlapGain = 0;
    const updated = new Map<string, DayCoverage>();
    for (const date of affected) {
      const before = states.get(date)!;
      const next = coverage(date, after); updated.set(date, next);
      if (!preservesGaps(before.free, next.free)) return false;
      for (const [id, gaps] of next.doctors) if (!preservesGaps(before.doctors.get(id) || [], gaps)) return false;
      for (const [id, gaps] of next.qualified) if (!preservesGaps(before.qualified.get(id) || [], gaps)) return false;
      missingGain += before.missing - next.missing;
      freeGain += before.freeMissing - next.freeMissing;
      overlapGain += before.overlap - next.overlap;
    }
    if (freeGain <= EPSILON && missingGain <= EPSILON && overlapGain <= EPSILON) return false;
    findings ??= ctx.validate(assignments);
    const previous = new Map(findings.filter(fixedFinding).map(f => [f.id, f]));
    const nextFindings = ctx.validate(after); validated++;
    if (nextFindings.filter(fixedFinding).some(f => {
      const old = previous.get(f.id);
      if (!old || (f.amount ?? 0) > (old.amount ?? 0) + EPSILON) return true;
      // Some rules still describe size only in their message. Reject a changed
      // existing problem rather than assuming the unchanged id means it stayed safe.
      return f.amount === undefined && old.amount === undefined && f.message !== old.message;
    })) return false;
    // Give moved cells fresh ids, as manual swaps do. Rejected candidates never reach here.
    for (const a of after) {
      const old = assignments.find(x => x.id === a.id);
      if (old && (old.date !== a.date || old.nurseId !== a.nurseId)) {
        let id = `asgn-repair-${a.scheduleId}-${a.nurseId}-${a.date}-${repairedCount}`;
        while (after.some(x => x !== a && x.id === id)) id += '-1';
        changes.set(old.id, { ...a, id });
      }
    }
    assignments = apply();
    states = new Map([...states, ...updated]); findings = nextFindings; repairedCount++;
    return true;
  };

  const tryFundedExtension = async (recipient: Assignment, extended: Assignment,
    donor: Assignment, shortened: Assignment | null): Promise<boolean> => {
    const job = dailySessions.get(donor.date)?.find(s => donor.kind === 'DOCTOR' && s.doctorId === donor.doctorId);
    if (!job) return false;
    const helpers = assignments.filter(a => editable(a) && a.nurseId !== recipient.nurseId &&
      a.date !== donor.date && !occupied(a.nurseId, donor.date) && ctx.canWorkOnDate(a.nurseId, donor.date) &&
      ctx.canPair(a.nurseId, job));
    for (const helper of helpers) for (const d of ctx.duties.filter(d => d.active &&
      Math.abs((toMinutes(d.endTime) - toMinutes(d.startTime)) / 60 - hours(helper)) <= EPSILON &&
      overlaps(d.startTime, d.endTime, job.startTime, job.endTime))) {
      const replacement = { ...helper, date: donor.date, dutyWindowId: d.id, kind: 'DOCTOR' as const,
        doctorId: job.doctorId, specialtyId: undefined, clinicalRoleId: undefined,
        note: 'Moved to keep doctor cover while hours are used on another day' };
      // If the helper covers the entire job, the donor can float; otherwise they can
      // share the job so no part of its session is lost.
      const alternatives = shortened ? [{ ...shortened, kind: 'CLINICAL_ROLE' as const,
        doctorId: undefined, clinicalRoleId: FLOAT_ROLE_ID, note: 'Float' }, shortened] : [null];
      for (const alternative of alternatives) {
        if (await tryChange(new Map([[recipient.id, extended], [donor.id, alternative], [helper.id, replacement]]))) return true;
        if (examined >= candidateLimit || targetChecks >= perTargetLimit || validated >= 80) return false;
      }
    }
    return false;
  };

  // Each accepted change improves coverage or removes redundant cover. Restart from the
  // earliest session after a change, so stale candidates never overwrite a previous repair.
  for (let round = 0; round < 24 && examined < candidateLimit && validated < 80; round++) {
    let changed = false;
    const targets: RepairTarget[] = [...dailySessions.values()].flat()
      .filter(s => states.get(s.date)!.doctors.get(s.id)!.length > 0).map(session => ({ date: session.date, session }));
    targets.push(...ctx.dates.filter(date => states.get(date)!.free.length > 0).map(date => ({ date })));
    for (const target of targets) {
      targetChecks = 0;
      const donors = assignments.filter(a => editable(a) && canFill(a.nurseId, target));
      for (const donor of donors) {
        if (donor.date !== target.date && occupied(donor.nurseId, target.date)) continue;
        if (await tryChange(new Map([[donor.id, pair(donor, target)]]))) { changed = true; break; }
      }
      if (changed) break;
      // A nurse on an optional duty today can take over the donor's job on another
      // date, or their job today, while the donor takes the uncovered doctor.
      for (const donor of donors) {
        if (donor.date !== target.date && occupied(donor.nurseId, target.date)) continue;
        for (const support of assignments.filter(a => editable(a) && a.date === target.date && a.nurseId !== donor.nurseId)) {
          if (donor.date !== target.date && occupied(support.nurseId, donor.date)) continue;
          const replacement: Assignment = { ...donor, id: support.id, nurseId: support.nurseId,
            dutyWindowId: support.dutyWindowId, note: 'Moved to keep existing cover during a staffing exchange' };
          if (await tryChange(new Map([[donor.id, pair(donor, target)], [support.id, replacement]]))) {
            changed = true; break;
          }
        }
        if (changed) break;
      }
      if (changed) break;
      if (!target.session) continue;
      // Extend partial cover using exactly the same nurse hours reclaimed elsewhere.
      for (const recipient of assignments.filter(a => editable(a) && a.date === target.date &&
        a.kind === 'DOCTOR' && a.doctorId === target.session?.doctorId && canFill(a.nurseId, target))) {
        const old = duties.get(recipient.dutyWindowId);
        if (!old) continue;
        for (const longer of ctx.duties.filter(d => d.active && d.startTime <= old.startTime && d.endTime >= old.endTime)) {
          const extra = (toMinutes(longer.endTime) - toMinutes(longer.startTime)) / 60 - hours(recipient);
          if (extra <= EPSILON) continue;
          for (const donor of assignments.filter(a => editable(a) && a.nurseId === recipient.nurseId && a.date !== target.date)) {
            const extended = { ...recipient, dutyWindowId: longer.id, note: 'Longer shift using hours moved from another day' };
            if (Math.abs(hours(donor) - extra) <= EPSILON &&
              (await tryChange(new Map([[recipient.id, extended], [donor.id, null]])) ||
                await tryFundedExtension(recipient, extended, donor, null))) { changed = true; break; }
            for (const shorter of ctx.duties.filter(d => d.active)) {
              const saved = hours(donor) - (toMinutes(shorter.endTime) - toMinutes(shorter.startTime)) / 60;
              if (Math.abs(saved - extra) > EPSILON) continue;
              const shortened = { ...donor, dutyWindowId: shorter.id, note: 'Shorter shift to keep hours for doctor cover on another day' };
              if (await tryChange(new Map([[recipient.id, extended], [donor.id, shortened]])) ||
                await tryFundedExtension(recipient, extended, donor, shortened)) { changed = true; break; }
            }
            if (changed) break;
          }
          if (changed) break;
        }
        if (changed) break;
      }
      if (changed) break;
    }
    if (changed) continue;
    // A fully redundant generated doctor's duty can become a float at the same hours.
    targetChecks = 0;
    for (const a of assignments.filter(a => editable(a) && a.kind === 'DOCTOR')) {
      if (await tryChange(new Map([[a.id, { ...a, kind: 'CLINICAL_ROLE', doctorId: undefined,
        specialtyId: undefined, clinicalRoleId: FLOAT_ROLE_ID, note: 'Float after another nurse covered the doctor' }]]))) {
        changed = true; break;
      }
    }
    if (!changed) break;
  }
  return { assignments, repairedCount, examined, validated };
}
