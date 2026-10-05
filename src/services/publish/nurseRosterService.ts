/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Private Nurse Links
 * Each nurse has one private link (nurseLinks/{nurseId}, editors only) whose
 * random token is the id of her page, nurseRosters/{token}. The page holds only
 * her own calendar and cleaned published team sheets, so the link opens
 * without signing in. Firestore rules allow
 * reading it by its token (never listing) until it is revoked.
 *
 * Everything here takes the repository as a parameter and imports no Firebase
 * code, so the pure parts can be unit tested.
 */

import type {
  ClinicProfile,
  ClinicalRole,
  Doctor,
  DutyWindow,
  Nurse,
  NurseLink,
  NurseRosterDoc,
  NurseRosterShift,
  Schedule,
  ScheduleVersion,
  Specialty,
  Assignment,
  TeamRosterSheet,
} from '../../types';
import type { IRepository } from '../repository/IRepository';

/** How far back a private page still shows shifts (so last week stays visible). */
export const NURSE_ROSTER_LOOKBACK_DAYS = 31;
import { isFloatShift } from '../engine/floatShift';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Today as 'YYYY-MM-DD' in the given time zone (the browser's when none is given). */
export function todayIso(timeZone?: string, now: Date = new Date()): string {
  try {
    // en-CA formats dates as YYYY-MM-DD.
    return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

/** Adds days to a 'YYYY-MM-DD' date. */
export function addDaysIso(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Weekday short name ('Mon') of a 'YYYY-MM-DD' date. */
export function weekdayOf(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const origin = () => (typeof window !== 'undefined' ? window.location.origin : '');

/** The nurse's private page, e.g. https://clinic.example/#me?t=nr_... */
export function nurseLinkUrl(token: string): string {
  return `${origin()}/#me?t=${encodeURIComponent(token)}`;
}

/** The calendar feed of the nurse's private page (served by the server). */
export function nurseCalendarUrl(token: string): string {
  return `${origin()}/calendar/${encodeURIComponent(token)}.ics`;
}

/** The same feed as a webcal:// link, which phones open straight in their calendar app. */
export function nurseWebcalUrl(token: string): string {
  return nurseCalendarUrl(token).replace(/^https?:\/\//, 'webcal://');
}

export const NURSE_TOKEN_PATTERN = /^nr_[0-9a-f-]{36}$/;

function newToken(): string {
  return `nr_${crypto.randomUUID()}`;
}

/**
 * The nurse's private link: reused while it works, otherwise a new one is made.
 * The repository has no transactions, so after making a link it is read back:
 * when two editors made one at the same time, the link saved last wins and the
 * page written for the losing token (if any) is removed.
 */
export async function ensureNurseLink(repo: IRepository, nurseId: string): Promise<NurseLink> {
  const existing = await repo.get('nurseLinks', nurseId);
  if (existing && !existing.revoked && existing.token) return existing;
  const link: NurseLink = {
    id: nurseId,
    nurseId,
    token: newToken(),
    createdAt: new Date().toISOString(),
    revoked: false,
  };
  await repo.create('nurseLinks', link);
  const saved = await repo.get('nurseLinks', nurseId);
  if (saved && !saved.revoked && saved.token && saved.token !== link.token) {
    await removeNurseRoster(repo, link.token).catch(() => undefined);
    return saved;
  }
  return link;
}

/**
 * Stops a page from opening: it is marked revoked first (so even if the delete
 * fails the rules already refuse it), then deleted.
 */
async function removeNurseRoster(repo: IRepository, token: string): Promise<void> {
  const existing = await repo.get('nurseRosters', token).catch(() => null);
  if (existing) await repo.update('nurseRosters', token, { revoked: true });
  await repo.remove('nurseRosters', token);
}

/** Stops the nurse's private link working. A later ensureNurseLink makes a new one. */
export async function revokeNurseLink(repo: IRepository, nurseId: string): Promise<void> {
  const link = await repo.get('nurseLinks', nurseId);
  if (!link) return;
  if (link.token) await removeNurseRoster(repo, link.token);
  await repo.update('nurseLinks', nurseId, { revoked: true });
}

export interface RegenerateNurseLinkResult {
  link: NurseLink;
  /** Set when the new link was made but her page could not be written. */
  syncError?: string;
}

/** Replaces the nurse's private link: the old one stops working, the new one shows her shifts. */
export async function regenerateNurseLink(repo: IRepository, nurseId: string): Promise<RegenerateNurseLinkResult> {
  await revokeNurseLink(repo, nurseId);
  const link = await ensureNurseLink(repo, nurseId);
  try {
    const result = await syncNurseRosters(repo, [nurseId]);
    if (result.failed.length > 0) return { link, syncError: result.failed[0] };
  } catch (err: any) {
    return { link, syncError: String(err?.message || err) };
  }
  return { link };
}

// ---------------------------------------------------------------------------
// Building a nurse's page (pure)
// ---------------------------------------------------------------------------

type ShiftRefs = {
  doctors: Pick<Doctor, 'id' | 'fullName'>[];
  clinicalRoles: Pick<ClinicalRole, 'id' | 'name'>[];
  specialties: Pick<Specialty, 'id' | 'name'>[];
};

/**
 * What the nurse does on a shift, in plain words: "With Dr Amal", "Nurse Clinic",
 * "Blood Collection", or "Float" as in the emails.
 */
export function shiftDetail(
  a: Pick<Assignment, 'doctorId' | 'clinicalRoleId' | 'specialtyId'>,
  refs: ShiftRefs
): string {
  if (isFloatShift(a)) return 'Float';
  if (a.doctorId) {
    const name = refs.doctors.find((d) => d.id === a.doctorId)?.fullName?.trim();
    if (!name) return 'With a doctor';
    return /^dr\b/i.test(name) ? `With ${name}` : `With Dr ${name}`;
  }
  if (a.clinicalRoleId) return refs.clinicalRoles.find((r) => r.id === a.clinicalRoleId)?.name || 'Clinical role';
  if (a.specialtyId) {
    const name = refs.specialties.find((s) => s.id === a.specialtyId)?.name;
    return name ? `Department: ${name}` : 'Department';
  }
  return 'Float';
}

/** Each roster's latest published version (automatic backups never count). */
export function latestPublishedVersions(versions: ScheduleVersion[]): Map<string, ScheduleVersion> {
  const latest = new Map<string, ScheduleVersion>();
  for (const v of versions) {
    if (!v.isPublished || v.kind === 'BACKUP' || !v.snapshot) continue;
    const prev = latest.get(v.scheduleId);
    if (
      !prev ||
      (v.number || 0) > (prev.number || 0) ||
      ((v.number || 0) === (prev.number || 0) && (v.publishedAt || v.timestamp || '') > (prev.publishedAt || prev.timestamp || ''))
    ) {
      latest.set(v.scheduleId, v);
    }
  }
  return latest;
}

export interface BuildNurseRosterInput extends ShiftRefs {
  token: string;
  nurse: Pick<Nurse, 'id' | 'fullName'>;
  clinic?: Pick<ClinicProfile, 'name' | 'timezone'> | null;
  schedules: Pick<Schedule, 'id' | 'name' | 'startDate' | 'endDate'>[];
  versions: ScheduleVersion[];
  dutyWindows: Pick<DutyWindow, 'id' | 'name' | 'acronym' | 'startTime' | 'endTime'>[];
  /** 'YYYY-MM-DD'; defaults to today in the clinic's time zone. */
  today?: string;
  nowIso?: string;
  teamRosters?: TeamRosterSheet[];
}

/**
 * One nurse's page from the latest published version of every roster that ends
 * on or after (today minus 31 days): her shifts with plain wording, and her
 * approved leave as plain days (the leave type stays private).
 */
export function buildNurseRosterDoc(input: BuildNurseRosterInput): NurseRosterDoc {
  const timezone = input.clinic?.timezone || 'Asia/Dubai';
  const today = input.today || todayIso(timezone);
  const cutoff = addDaysIso(today, -NURSE_ROSTER_LOOKBACK_DAYS);
  const dutyMap = new Map(input.dutyWindows.map((d) => [d.id, d]));
  const latest = latestPublishedVersions(input.versions);

  const shifts = new Map<string, NurseRosterShift>();
  const leaveDays = new Set<string>();

  for (const schedule of input.schedules) {
    if (!schedule.endDate || schedule.endDate < cutoff) continue;
    const version = latest.get(schedule.id);
    if (!version) continue;
    const from = schedule.startDate > cutoff ? schedule.startDate : cutoff;
    const to = schedule.endDate;
    const inRange = (d: string) => d >= from && d <= to;

    for (const a of version.snapshot.assignments || []) {
      if (a.nurseId !== input.nurse.id || !inRange(a.date)) continue;
      const duty = dutyMap.get(a.dutyWindowId);
      if (!duty) continue;
      const shift: NurseRosterShift = {
        date: a.date,
        startTime: duty.startTime,
        endTime: duty.endTime,
        acronym: duty.acronym,
        shiftName: duty.name,
        detail: shiftDetail(a, input),
        scheduleName: schedule.name,
      };
      shifts.set(`${a.date}|${duty.startTime}|${duty.acronym}|${shift.detail}`, shift);
    }

    for (const le of version.snapshot.leaveEntries || []) {
      if (le.nurseId !== input.nurse.id || !le.approved || le.status === 'REJECTED') continue;
      let day = le.startDate < from ? from : le.startDate;
      const last = le.endDate > to ? to : le.endDate;
      for (let i = 0; day <= last && i < 400; i++, day = addDaysIso(day, 1)) leaveDays.add(day);
    }
  }

  return {
    id: input.token,
    token: input.token,
    nurseId: input.nurse.id,
    nurseName: input.nurse.fullName,
    clinicName: input.clinic?.name || '',
    timezone,
    revoked: false,
    updatedAt: input.nowIso || new Date().toISOString(),
    shifts: [...shifts.values()].filter(s => !leaveDays.has(s.date)).sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)),
    leaveDays: [...leaveDays].sort(),
    ...(input.teamRosters ? { teamRosters: input.teamRosters } : {}),
  };
}

/** Build only the latest published snapshot. Draft shifts and private staff fields never enter the sheet. */
export function buildTeamRosterSheet(input: ShiftRefs & {
  schedule: Pick<Schedule, 'id' | 'name' | 'startDate' | 'endDate'>;
  version: ScheduleVersion;
  nurses: Pick<Nurse, 'id' | 'fullName' | 'active'>[];
  dutyWindows: Pick<DutyWindow, 'id' | 'name' | 'acronym' | 'startTime' | 'endTime' | 'color'>[];
  weekendDays?: number[];
}): TeamRosterSheet {
  const { version } = input;
  // Dates are part of the published snapshot, not the mutable draft.
  const schedule = version.snapshot.schedule || input.schedule;
  const inRange = (date: string) => date >= schedule.startDate && date <= schedule.endDate;
  const assignments = version.snapshot.assignments.filter(a => inRange(a.date) && (!a.scheduleId || a.scheduleId === schedule.id));
  const leaves = (version.snapshot.leaveEntries || []).filter(l => l.approved && l.status !== 'REJECTED' && l.endDate >= schedule.startDate && l.startDate <= schedule.endDate);
  const present = new Set([...assignments.map(a => a.nurseId), ...leaves.map(l => l.nurseId)]);
  const usedDuties = new Set(assignments.map(a => a.dutyWindowId));
  return {
    scheduleId: schedule.id, name: schedule.name, startDate: schedule.startDate, endDate: schedule.endDate,
    version: version.number, publishedAt: version.publishedAt || version.timestamp,
    weekendDays: input.weekendDays || [6, 0],
    duties: input.dutyWindows.filter(d => usedDuties.has(d.id)).map(d => ({ id: d.id, name: d.name, acronym: d.acronym, startTime: d.startTime, endTime: d.endTime, color: d.color || '#64748b' })),
    nurses: input.nurses.filter(n => n.active || present.has(n.id)).map(n => {
      const cells = new Map<string, TeamRosterSheet['nurses'][number]['cells'][number]>();
      for (const a of assignments.filter(a => a.nurseId === n.id)) {
        if (!cells.has(a.date)) cells.set(a.date, { date: a.date, dutyId: a.dutyWindowId, detail: shiftDetail(a, input) });
      }
      for (const l of leaves.filter(l => l.nurseId === n.id)) {
        const end = l.endDate < schedule.endDate ? l.endDate : schedule.endDate;
        for (let day = l.startDate > schedule.startDate ? l.startDate : schedule.startDate; day <= end; day = addDaysIso(day, 1)) {
          cells.set(day, { date: day, leave: true });
        }
      }
      return { id: n.id, name: n.fullName, cells: [...cells.values()].sort((a, b) => a.date.localeCompare(b.date)) };
    }).sort((a, b) => a.name.localeCompare(b.name)),
  };
}

// ---------------------------------------------------------------------------
// Copy as text (pure)
// ---------------------------------------------------------------------------

/** 'YYYY-MM-DD' as 'DD-MM'. */
function dayMonth(date: string): string {
  const [, m, d] = date.split('-');
  return `${d}-${m}`;
}

/**
 * A plain text list that reads well in WhatsApp, e.g.
 * "Fatma Ali, shifts\nMon 01-12: E 09:00 to 17:00, with Dr Amal".
 * Only days from `fromDate` on are listed (all days when it is not given).
 */
export function formatRosterAsText(
  doc: Pick<NurseRosterDoc, 'nurseName' | 'shifts' | 'leaveDays'>,
  fromDate?: string
): string {
  const lines: { date: string; time: string; text: string }[] = [];
  for (const s of doc.shifts || []) {
    if (fromDate && s.date < fromDate) continue;
    const detail = s.detail ? `, ${s.detail.replace(/^With /, 'with ')}` : '';
    lines.push({
      date: s.date,
      time: s.startTime,
      text: `${weekdayOf(s.date)} ${dayMonth(s.date)}: ${s.acronym} ${s.startTime} to ${s.endTime}${detail}`,
    });
  }
  for (const day of doc.leaveDays || []) {
    if (fromDate && day < fromDate) continue;
    lines.push({ date: day, time: '', text: `${weekdayOf(day)} ${dayMonth(day)}: Leave` });
  }
  lines.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const body = lines.length > 0 ? lines.map((l) => l.text).join('\n') : 'No shifts yet';
  return `${doc.nurseName}, shifts\n${body}`;
}

// ---------------------------------------------------------------------------
// Writing pages
// ---------------------------------------------------------------------------

export interface SyncNurseRostersResult {
  synced: number;
  /** The nurses whose page was written. */
  syncedIds: string[];
  /** One plain message per nurse whose page could not be written. */
  failed: string[];
}

/**
 * Rebuilds and writes the private pages of the given nurses (default: every
 * active nurse with a working link). Each page is written whole, so shifts
 * that were removed from the roster disappear. Nurses without a working link
 * are skipped; one failed page never stops the others.
 */
export async function syncNurseRosters(repo: IRepository, nurseIds?: string[], justPublished: ScheduleVersion[] = []): Promise<SyncNurseRostersResult> {
  const [nurses, links, schedules, clinics, dutyWindows, doctors, clinicalRoles, specialties] = await Promise.all([
    repo.list('nurses'),
    repo.list('nurseLinks'),
    repo.list('schedules'),
    repo.list('clinics'),
    repo.list('dutyWindows'),
    repo.list('doctors'),
    repo.list('clinicalRoles'),
    repo.list('specialties'),
  ]);
  const clinic = clinics[0] || null;
  const today = todayIso(clinic?.timezone || 'Asia/Dubai');
  const cutoff = addDaysIso(today, -NURSE_ROSTER_LOOKBACK_DAYS);

  // Only the versions of rosters that can still show on a page.
  const recentSchedules = schedules.filter((s) => s.endDate && s.endDate >= cutoff);
  const versionLists = await Promise.all(
    recentSchedules.map((s) => repo.list('versions', { field: 'scheduleId', operator: '==', value: s.id }))
  );
  // A live cache may not yet contain the version whose write just completed.
  const versions = [...versionLists.flat(), ...justPublished];
  const latest = latestPublishedVersions(versions);
  const teamRosters = recentSchedules.filter(s => latest.has(s.id)).map(schedule => buildTeamRosterSheet({
    schedule, version: latest.get(schedule.id)!, nurses, dutyWindows, doctors, clinicalRoles, specialties, weekendDays: clinic?.weekendDays,
  })).sort((a, b) => a.startDate.localeCompare(b.startDate));

  const linkMap = new Map(links.filter((l) => !l.revoked && l.token).map((l) => [l.nurseId || l.id, l]));
  const nurseMap = new Map(nurses.map((n) => [n.id, n]));
  const targets = nurseIds
    ? nurseIds.filter((id) => nurseMap.has(id))
    : nurses.filter((n) => n.active && linkMap.has(n.id)).map((n) => n.id);

  const result: SyncNurseRostersResult = { synced: 0, syncedIds: [], failed: [] };
  const nowIso = new Date().toISOString();
  for (const nurseId of targets) {
    const link = linkMap.get(nurseId);
    const nurse = nurseMap.get(nurseId)!;
    if (!link) continue;
    try {
      const doc = buildNurseRosterDoc({
        token: link.token,
        nurse,
        clinic,
        schedules: recentSchedules,
        versions,
        dutyWindows,
        doctors,
        clinicalRoles,
        specialties,
        today,
        nowIso,
        teamRosters,
      });
      // create() replaces the whole document.
      await repo.create('nurseRosters', doc);
      result.synced++;
      result.syncedIds.push(nurseId);
    } catch (err: any) {
      result.failed.push(`${nurse.fullName}: ${err?.message || err}`);
    }
  }
  return result;
}
