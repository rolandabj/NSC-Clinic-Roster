/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * How this clinic runs, shared by the scheduling engine and the validator so
 * both judge a roster the same way:
 *
 *   - The clinic is open every day, from the clinic profile's opening time to
 *     its closing time (default 09:00 to 21:00).
 *   - Each doctor works one session a day and gets one nurse. Her shift must
 *     overlap the session; covering all of it is preferred, partial cover is
 *     accepted.
 *   - At every opening hour there must be one "free" nurse: a nurse who is not
 *     with a doctor at that hour and is qualified for blood collection. She
 *     runs Nurse Clinic and blood collection together.
 *   - At least one senior nurse works each day (any shift).
 *   - On a public holiday only the on call doctor works, and one nurse covers
 *     the clinic for the opening hours; doctor sessions that day are ignored.
 *   - Rosters run back to back, so the last days of the previous roster count
 *     for consecutive days, rest and late duty rules.
 */

import type { HoursHistory } from '../hours/hoursBalance';

import { Assignment, AvailabilityRequest, ClinicalRole, Doctor, DoctorCoverageInterval, DoctorSession, DutyWindow, Nurse } from '../../types';

/** One nurse's totals over the earlier rosters of this calendar year. */
export interface YearToDateCounts {
  /** Days worked on a weekend day. */
  weekendDays: number;
  /** Public holidays worked. */
  holidays: number;
  /** Shifts ending at or after the late time. */
  lateShifts: number;
  /** Shifts running Nurse Clinic. */
  nurseClinic: number;
  /** Earlier rosters in which she had at least one shift. */
  rosters: number;
}

/** Year to date totals by nurse id. */
export type YearToDate = Record<string, YearToDateCounts>;

export interface ClinicSetup {
  hoursHistory?: HoursHistory;
  /** 'HH:mm', default '09:00' */
  openTime?: string;
  /** 'HH:mm', default '21:00' */
  closeTime?: string;
  /** Public holiday dates (YYYY-MM-DD). */
  holidayDates?: Iterable<string>;
  /** Public holiday names by date, for messages. */
  holidayNames?: Record<string, string>;
  /** Shifts from the roster just before this one (read only, for the rules that look back). */
  priorAssignments?: Assignment[];
  /** Fixed shifts after this roster, read only for rest, runs and rolling hours limits. */
  followingAssignments?: Assignment[];
  /** Weekends, holidays, late shifts and Nurse Clinic so far this year (earlier rosters only). */
  yearToDate?: YearToDate;
  /** Nurses' availability requests for this roster's dates (any status), and days off taken for its public holidays. */
  availabilityRequests?: AvailabilityRequest[];
}

export interface ResolvedClinicSetup {
  openTime: string;
  closeTime: string;
  holidays: Set<string>;
  priorAssignments: Assignment[];
  followingAssignments: Assignment[];
}

export const DEFAULT_OPEN_TIME = '09:00';
export const DEFAULT_CLOSE_TIME = '21:00';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export function resolveClinicSetup(setup?: ClinicSetup): ResolvedClinicSetup {
  const openTime = setup?.openTime && TIME.test(setup.openTime) ? setup.openTime : DEFAULT_OPEN_TIME;
  let closeTime = setup?.closeTime && TIME.test(setup.closeTime) ? setup.closeTime : DEFAULT_CLOSE_TIME;
  if (closeTime <= openTime) closeTime = DEFAULT_CLOSE_TIME > openTime ? DEFAULT_CLOSE_TIME : '23:59';
  return {
    openTime,
    closeTime,
    holidays: new Set(setup?.holidayDates || []),
    priorAssignments: setup?.priorAssignments || [],
    followingAssignments: setup?.followingAssignments || [],
  };
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

function fromMinutes(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** The opening hours split into one hour checks ([start, end) pairs, the last one may be shorter). */
export function openingHourSlots(setup: ResolvedClinicSetup): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];
  const close = toMinutes(setup.closeTime);
  for (let t = toMinutes(setup.openTime); t < close; t += 60) {
    slots.push({ start: fromMinutes(t), end: fromMinutes(Math.min(t + 60, close)) });
  }
  return slots;
}

/** Coverage checks split at every shift, session and opening hour boundary. */
export function coverageSlots(
  setup: ResolvedClinicSetup,
  duties: DutyWindow[],
  sessions: DoctorSession[] = [],
  extraIntervals: readonly TimeRange[] = []
): { start: string; end: string }[] {
  const boundaries = new Set([setup.openTime, setup.closeTime, ...openingHourSlots(setup).map(h => h.start)]);
  for (const range of [...duties, ...sessions, ...extraIntervals]) {
    for (const time of [range.startTime, range.endTime]) {
      if (TIME.test(time) && time > setup.openTime && time < setup.closeTime) boundaries.add(time);
    }
  }
  const times = [...boundaries].sort();
  return times.slice(0, -1).map((start, i) => ({ start, end: times[i + 1] }));
}

/** True when the time ranges overlap (touching ends don't count). */
export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && aEnd > bStart;
}

/** The blood collection role (acronym PHL), if the clinic has one set up. */
export function bloodCollectionRole(roles: ClinicalRole[]): ClinicalRole | undefined {
  return roles.find((r) => r.acronym === 'PHL');
}

/** The Nurse Clinic role, if the clinic has one set up. */
export function nurseClinicRoleOf(roles: ClinicalRole[]): ClinicalRole | undefined {
  return roles.find((r) => r.id === 'role-nurse-clinic' || r.acronym === 'NC' || r.name.toLowerCase().includes('nurse clinic'));
}

/**
 * Can this nurse be the free nurse (Nurse Clinic and blood collection)? She needs the
 * Nurse Clinic option ticked in her profile, and the blood collection skill, whenever
 * the clinic has those roles set up. A nurse without them can still float.
 */
export function canBeFreeNurse(nurse: Nurse | undefined, roles: ClinicalRole[]): boolean {
  if (!nurse) return false;
  const nc = nurseClinicRoleOf(roles);
  if (nc && !nurse.capabilityIds.includes(nc.id) && !nurse.capabilityIds.includes('role-nurse-clinic')) return false;
  const phl = bloodCollectionRole(roles);
  return !phl || nurse.capabilityIds.includes(phl.id);
}

/** Distinct doctor ids covered by this shift (at most two, in sequence or sharing low acuity clinics). */
export function assignmentDoctorIds(
  assignment: Pick<Assignment, 'kind' | 'doctorId' | 'secondDoctorId'> | undefined
): string[] {
  if (!assignment || assignment.kind !== 'DOCTOR') return [];
  const ids: string[] = [];
  if (assignment.doctorId) ids.push(assignment.doctorId);
  if (assignment.secondDoctorId && assignment.secondDoctorId !== assignment.doctorId) {
    ids.push(assignment.secondDoctorId);
  }
  return ids;
}

/** True when this shift covers the given doctor as either primary or second doctor. */
export function assignmentCoversDoctor(
  assignment: Pick<Assignment, 'kind' | 'doctorId' | 'secondDoctorId'> | undefined,
  doctorId: string
): boolean {
  if (!assignment || assignment.kind !== 'DOCTOR' || !doctorId) return false;
  return assignment.doctorId === doctorId || assignment.secondDoctorId === doctorId;
}

/**
 * Is this shift a free nurse during [start, end)? She must be on duty then, and
 * not with any of her assigned doctors at that time: a doctor's nurse whose shift
 * runs past the clinic session is free once all of her doctors have left.
 */
export function isFreeDuring(
  assignment: Assignment,
  duty: DutyWindow | undefined,
  daySessions: DoctorSession[],
  start: string,
  end: string
): boolean {
  if (!duty || !overlaps(duty.startTime, duty.endTime, start, end)) return false;
  if (assignment.doctorCoverage !== undefined) {
    const resolved = resolveDoctorCoverage(assignment, duty, daySessions);
    if (resolved.problems.length || duty.startTime > start || duty.endTime < end) return false;
    return !resolved.intervals.some(r => overlaps(r.startTime, r.endTime, start, end));
  }
  const doctorIds = assignmentDoctorIds(assignment);
  if (doctorIds.length === 0) return true;
  return !doctorIds.some((docId) => {
    const session = daySessions.find((s) => s.doctorId === docId);
    return !!session && overlaps(session.startTime, session.endTime, start, end);
  });
}

/** A time range within one clinic day. */
export interface TimeRange { startTime: string; endTime: string }
export type DoctorCoverageRef = Pick<Assignment, 'kind' | 'doctorId' | 'secondDoctorId' | 'doctorCoverage'> & Partial<Pick<Assignment, 'date'>>;
type CoverageDisplayRef = Pick<Assignment, 'doctorId' | 'secondDoctorId' | 'doctorCoverage'> & Partial<Pick<Assignment, 'kind'>>;
export interface ResolvedDoctorCoverage { intervals: DoctorCoverageInterval[]; problems: string[] }

function validCoverageInterval(value: unknown): value is DoctorCoverageInterval {
  if (!value || typeof value !== 'object') return false;
  const r = value as Partial<DoctorCoverageInterval>;
  return typeof r.doctorId === 'string' && !!r.doctorId.trim() && typeof r.startTime === 'string' &&
    typeof r.endTime === 'string' && TIME.test(r.startTime) && TIME.test(r.endTime) && r.startTime < r.endTime;
}

/** Canonical time order, with repeated and touching cover for the same doctor joined. */
export function canonicalDoctorCoverage(intervals: readonly DoctorCoverageInterval[]): DoctorCoverageInterval[] {
  if (!Array.isArray(intervals) || !Array.from(intervals).every(validCoverageInterval)) return [];
  const sorted = intervals.map(r => ({ doctorId: r.doctorId, startTime: r.startTime, endTime: r.endTime }))
    .sort((a, b) => a.doctorId.localeCompare(b.doctorId) || a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime));
  const result: DoctorCoverageInterval[] = [];
  for (const r of sorted) {
    const last = result[result.length - 1];
    if (last?.doctorId === r.doctorId && r.startTime <= last.endTime) last.endTime = last.endTime > r.endTime ? last.endTime : r.endTime;
    else result.push(r);
  }
  return result.sort((a, b) => a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime) || a.doctorId.localeCompare(b.doctorId));
}

function coverageStructureProblems(a: CoverageDisplayRef, duty?: TimeRange): string[] {
  const raw: unknown = a.doctorCoverage;
  if (!Array.isArray(raw)) return ['Doctor cover times must be a list of valid intervals.'];
  if (!Array.from(raw).every(validCoverageInterval)) return ['Doctor cover needs a doctor and valid start and end times, such as 09:00 to 13:00.'];
  const problems: string[] = [];
  const ids = [a.doctorId, a.secondDoctorId].filter((id): id is string => !!id);
  const intervalIds = new Set(raw.map(r => r.doctorId));
  if (intervalIds.size > 2) problems.push('A nurse may cover at most two distinct doctors on one date.');
  if (a.kind && a.kind !== 'DOCTOR') {
    problems.push('Doctor cover times require a doctor duty.');
  } else {
    if (!a.doctorId) problems.push('Choose a first doctor before setting doctor cover times.');
    if (a.secondDoctorId && a.secondDoctorId === a.doctorId) problems.push('A shift cannot name the same doctor twice.');
    if (raw.some(r => !ids.includes(r.doctorId))) problems.push('Doctor cover times must name only the doctors on this duty.');
    if (ids.some(id => !intervalIds.has(id))) problems.push('Each doctor on this duty needs explicit cover times.');
  }
  if (duty && (!TIME.test(duty.startTime) || !TIME.test(duty.endTime) || duty.startTime >= duty.endTime ||
    raw.some(r => r.startTime < duty.startTime || r.endTime > duty.endTime))) {
    problems.push('Doctor cover times must stay within the nurse duty.');
  }
  return problems;
}

/** Explicit cover is authoritative. Invalid explicit data never becomes full duty cover. */
export function resolveDoctorCoverage(a: DoctorCoverageRef, duty: TimeRange | undefined,
  daySessions?: readonly DoctorSession[]): ResolvedDoctorCoverage {
  const date = a.date || daySessions?.find(s => !s.cancelled)?.date;
  const sessions = date ? doctorSessionsOn([...(daySessions || [])], date) : [];
  if (a.doctorCoverage === undefined) {
    if (!duty) return { intervals: [], problems: [] };
    return { intervals: canonicalDoctorCoverage(assignmentDoctorIds(a).flatMap(doctorId => {
      const session = sessions.find(s => s.doctorId === doctorId);
      if (!session) return [];
      const startTime = duty.startTime > session.startTime ? duty.startTime : session.startTime;
      const endTime = duty.endTime < session.endTime ? duty.endTime : session.endTime;
      return startTime < endTime ? [{ doctorId, startTime, endTime }] : [];
    })), problems: [] };
  }
  const problems = coverageStructureProblems(a, duty);
  if (!duty) problems.push('The duty for doctor cover times is missing.');
  if (!problems.length && daySessions !== undefined) for (const r of a.doctorCoverage) {
    const session = sessions.find(s => s.doctorId === r.doctorId);
    if (!session || !TIME.test(session.startTime) || !TIME.test(session.endTime) || session.startTime >= session.endTime ||
      r.startTime < session.startTime || r.endTime > session.endTime) {
      problems.push('Doctor cover times must stay within the active doctor session.');
      break;
    }
  }
  return { intervals: problems.length ? [] : canonicalDoctorCoverage(a.doctorCoverage), problems };
}

export function effectiveDoctorCoverage(a: DoctorCoverageRef, duty: TimeRange | undefined,
  daySessions?: readonly DoctorSession[]): DoctorCoverageInterval[] {
  return resolveDoctorCoverage(a, duty, daySessions).intervals;
}

export function doctorCoverageProblems(a: DoctorCoverageRef, duty: TimeRange | undefined,
  daySessions?: readonly DoctorSession[]): string[] {
  return resolveDoctorCoverage(a, duty, daySessions).problems;
}

/** The exact periods during which one nurse is assigned to both doctors. */
export function simultaneousDoctorIntervals(a: DoctorCoverageRef, duty: TimeRange | undefined,
  daySessions?: readonly DoctorSession[]): TimeRange[] {
  const intervals = effectiveDoctorCoverage(a, duty, daySessions);
  const boundaries = [...new Set(intervals.flatMap(r => [r.startTime, r.endTime]))].sort();
  const result: TimeRange[] = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const startTime = boundaries[i], endTime = boundaries[i + 1];
    const ids = new Set(intervals.filter(r => overlaps(r.startTime, r.endTime, startTime, endTime)).map(r => r.doctorId));
    if (ids.size < 2) continue;
    const last = result[result.length - 1];
    if (last?.endTime === startTime) last.endTime = endTime;
    else result.push({ startTime, endTime });
  }
  return result;
}

/** Duty time outside all doctor cover; invalid explicit cover never supplies free time. */
export function freeDoctorIntervals(a: DoctorCoverageRef, duty: TimeRange | undefined,
  daySessions?: readonly DoctorSession[]): TimeRange[] {
  if (!duty) return [];
  const resolved = resolveDoctorCoverage(a, duty, daySessions);
  return resolved.problems.length ? [] : uncoveredParts(duty.startTime, duty.endTime, resolved.intervals)
    .map(r => ({ startTime: r.start, endTime: r.end }));
}

function stableCoverageRaw(value: unknown): string {
  try {
    const seen = new WeakSet<object>();
    const normalize = (v: unknown): unknown => {
      if (!v || typeof v !== 'object') return typeof v === 'bigint' ? String(v) : v;
      if (seen.has(v)) return '[circular]';
      seen.add(v);
      return Array.isArray(v) ? v.map(normalize) : Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([k, item]) => [k, normalize(item)]));
    };
    return JSON.stringify(normalize(value)) ?? String(value);
  } catch { return '[unreadable doctor cover]'; }
}

/** A stable semantic identity for explicit timing; absent timing preserves legacy identities. */
export function doctorCoverageFingerprint(a: CoverageDisplayRef): string | undefined {
  if (a.doctorCoverage === undefined) return undefined;
  return coverageStructureProblems(a).length
    ? `invalid:${stableCoverageRaw(a.doctorCoverage)}`
    : `coverage:${JSON.stringify(canonicalDoctorCoverage(a.doctorCoverage))}`;
}

/** Readable explicit cover for saved staff communications, with free duty time when known. */
export function doctorCoverageText(a: CoverageDisplayRef, doctors: readonly Pick<Doctor, 'id' | 'fullName'>[], duty?: TimeRange): string {
  if (a.doctorCoverage === undefined) return '';
  if (coverageStructureProblems(a, duty).length) return 'Doctor cover needs review';
  const intervals = canonicalDoctorCoverage(a.doctorCoverage);
  if (intervals.some(r => !doctors.some(d => d.id === r.doctorId))) return 'Doctor cover needs review';
  const lines = intervals.map(r => ({ startTime: r.startTime, endTime: r.endTime,
    label: doctors.find(d => d.id === r.doctorId)!.fullName }));
  if (duty) lines.push(...uncoveredParts(duty.startTime, duty.endTime, intervals)
    .map(r => ({ startTime: r.start, endTime: r.end, label: 'Float' })));
  return lines.sort((a, b) => a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime) || a.label.localeCompare(b.label))
    .map(r => `${r.label} ${r.startTime} to ${r.endTime}`).join('\n');
}

/** Minutes of [start, end) that a duty covers. */
export function coveredMinutes(duty: TimeRange, start: string, end: string): number {
  const from = Math.max(toMinutes(duty.startTime), toMinutes(start));
  const to = Math.min(toMinutes(duty.endTime), toMinutes(end));
  return Math.max(0, to - from);
}

/** The parts of [start, end) that none of the duties cover. */
export function uncoveredParts(start: string, end: string, duties: readonly TimeRange[]): { start: string; end: string }[] {
  const parts: { start: string; end: string }[] = [];
  let cursor = toMinutes(start);
  const stop = toMinutes(end);
  const sorted = [...duties].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
  for (const d of sorted) {
    const ds = toMinutes(d.startTime);
    const de = toMinutes(d.endTime);
    if (de <= cursor) continue;
    if (ds > cursor) parts.push({ start: fromMinutes(cursor), end: fromMinutes(Math.min(ds, stop)) });
    cursor = Math.max(cursor, de);
    if (cursor >= stop) break;
  }
  if (cursor < stop) parts.push({ start: fromMinutes(cursor), end: fromMinutes(stop) });
  return parts.filter((p) => p.start < p.end);
}

/**
 * Hours of shifts needed to cover [start, end) with the given duties: one shift
 * if one covers it all, otherwise the fewest shifts that do (e.g. 10h + 8h for
 * 09:00 to 21:00 when the longest shift is 10 hours).
 */
export function hoursToCover(start: string, end: string, duties: DutyWindow[]): number {
  const hoursOf = (d: DutyWindow) => (toMinutes(d.endTime) - toMinutes(d.startTime)) / 60;
  const full = duties.filter((d) => d.startTime <= start && d.endTime >= end);
  if (full.length > 0) return Math.min(...full.map(hoursOf));
  let cursor = toMinutes(start);
  const stop = toMinutes(end);
  let total = 0;
  for (let guard = 0; cursor < stop && guard < 24; guard++) {
    const startingNow = duties.filter((d) => toMinutes(d.startTime) <= cursor && toMinutes(d.endTime) > cursor);
    let next: DutyWindow | undefined;
    if (startingNow.length > 0) {
      next = startingNow.sort((a, b) => toMinutes(b.endTime) - toMinutes(a.endTime) || hoursOf(a) - hoursOf(b))[0];
    } else {
      next = duties
        .filter((d) => toMinutes(d.startTime) > cursor && toMinutes(d.startTime) < stop)
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))[0];
      if (!next) break;
    }
    total += hoursOf(next);
    cursor = toMinutes(next.endTime);
  }
  return total;
}

/**
 * A day's doctor sessions, one per doctor (a doctor works one session a day; a
 * duplicate entry is ignored). The generator and the checker both use this, so
 * they always keep the same session: the earliest start, then the longest.
 */
export function doctorSessionsOn(sessions: DoctorSession[], date: string): DoctorSession[] {
  const seen = new Set<string>();
  return sessions
    .filter((s) => !s.cancelled && s.date === date)
    .sort(
      (a, b) =>
        a.startTime.localeCompare(b.startTime) ||
        b.endTime.localeCompare(a.endTime) ||
        a.doctorId.localeCompare(b.doctorId) ||
        a.id.localeCompare(b.id)
    )
    .filter((s) => {
      if (seen.has(s.doctorId)) return false;
      seen.add(s.doctorId);
      return true;
    });
}
