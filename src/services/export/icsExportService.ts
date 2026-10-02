/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Builds an iCalendar (.ics) file of one nurse's shifts in the browser, so
 * staff can add their roster to Google Calendar, Apple Calendar or Outlook.
 * Times are converted from the clinic's time zone to UTC, which every
 * calendar app understands without extra time zone definitions.
 */

import type { Assignment, DutyWindow, Doctor, ClinicalRole, Specialty, NurseRosterDoc, NurseRosterShift } from '../../types';

interface IcsParams {
  calendarName: string;
  clinicName: string;
  timezone: string;
  nurseId: string;
  assignments: Pick<Assignment, 'id' | 'nurseId' | 'date' | 'dutyWindowId' | 'doctorId' | 'clinicalRoleId' | 'specialtyId'>[];
  dutyWindows: Pick<DutyWindow, 'id' | 'name' | 'acronym' | 'startTime' | 'endTime'>[];
  doctors: Pick<Doctor, 'id' | 'fullName'>[];
  clinicalRoles: Pick<ClinicalRole, 'id' | 'name'>[];
  specialties: Pick<Specialty, 'id' | 'name'>[];
}

/** Offset in milliseconds between UTC and the given time zone at an instant. */
function timeZoneOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - utcMs;
}

/** Converts a wall clock date and time in a time zone to a UTC Date. */
export function zonedTimeToUtc(date: string, time: string, timeZone: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const wallAsUtc = Date.UTC(y, m - 1, d, hh || 0, mm || 0);
  let tz = timeZone;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
  } catch {
    tz = 'UTC';
  }
  let utc = wallAsUtc - timeZoneOffsetMs(wallAsUtc, tz);
  // Second pass handles daylight saving transitions.
  utc = wallAsUtc - timeZoneOffsetMs(utc, tz);
  return new Date(utc);
}

function formatIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Escapes text values per RFC 5545. */
function escapeIcsText(value: string): string {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

const utf8 = new TextEncoder();

/**
 * Folds lines longer than 75 octets of UTF-8 per RFC 5545. Each continuation
 * line starts with a space, which counts toward its 75 octets, and a character
 * is never split across lines.
 */
export function foldLine(line: string): string {
  if (utf8.encode(line).length <= 75) return line;
  const chunks: string[] = [];
  let current = '';
  let size = 0;
  let limit = 75;
  for (const ch of line) {
    const n = utf8.encode(ch).length;
    if (size + n > limit) {
      chunks.push(current);
      current = ' ';
      size = 1;
      limit = 75;
    }
    current += ch;
    size += n;
  }
  chunks.push(current);
  return chunks.join('\r\n');
}

/** A short stable hash (FNV-1a, base 36) so event ids stay the same between feeds. */
export function shortHash(value: string): string {
  let h = 0x811c9dc5;
  for (const byte of utf8.encode(value)) {
    h ^= byte;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

/** The event id of a shift on a nurse's page: two shifts on the same day and time never share one. */
export function nurseShiftUid(nurseId: string, s: Pick<NurseRosterShift, 'date' | 'startTime' | 'acronym' | 'detail'>): string {
  const acronym = String(s.acronym || '').replace(/[^A-Za-z0-9]/g, '') || 'shift';
  return `${nurseId}-${s.date}-${s.startTime.replace(':', '')}-${acronym}-${shortHash(s.detail || '')}@clinicroster`;
}

export function buildNurseIcs(params: IcsParams): string {
  const dutyMap = new Map(params.dutyWindows.map((d) => [d.id, d]));
  const doctorMap = new Map(params.doctors.map((d) => [d.id, d]));
  const roleMap = new Map(params.clinicalRoles.map((r) => [r.id, r]));
  const specialtyMap = new Map(params.specialties.map((s) => [s.id, s]));
  const stamp = formatIcsDate(new Date());

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ClinicRoster//Nurse Roster//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(params.calendarName)}`,
  ];

  const mine = params.assignments
    .filter((a) => a.nurseId === params.nurseId)
    .sort((a, b) => a.date.localeCompare(b.date));

  for (const a of mine) {
    const duty = dutyMap.get(a.dutyWindowId);
    if (!duty) continue;

    const start = zonedTimeToUtc(a.date, duty.startTime, params.timezone);
    let end = zonedTimeToUtc(a.date, duty.endTime, params.timezone);
    if (end.getTime() <= start.getTime()) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000); // overnight duty
    }

    let pairing = 'General Pool';
    if (a.doctorId) pairing = doctorMap.get(a.doctorId)?.fullName || 'Doctor';
    else if (a.clinicalRoleId) pairing = roleMap.get(a.clinicalRoleId)?.name || 'Clinical Role';
    else if (a.specialtyId) pairing = specialtyMap.get(a.specialtyId)?.name || 'Specialty';

    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeIcsText(`${a.id || `${a.nurseId}-${a.date}`}@clinicroster`)}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(`${duty.acronym} ${duty.name} · ${pairing}`)}`,
      `LOCATION:${escapeIcsText(params.clinicName)}`,
      `DESCRIPTION:${escapeIcsText(`${duty.startTime}–${duty.endTime} · ${pairing}`)}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

export function downloadIcsFile(fileName: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.replace(/[^a-zA-Z0-9._ -]/g, '_');
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The parts of a nurse's private page that her calendar needs. */
type NurseRosterIcsInput = Pick<NurseRosterDoc, 'nurseId' | 'nurseName' | 'clinicName' | 'timezone' | 'shifts' | 'leaveDays'>;

/** Next calendar day of a 'YYYY-MM-DD' date, as 'YYYYMMDD' (all day events end the day after). */
function nextDayCompact(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, '');
}

/**
 * Builds the .ics file of a nurse's private page (her shifts, and leave as all
 * day events). Event ids are stable, so a subscribed calendar updates the same
 * events instead of adding copies. Pure: also used by the server's calendar feed.
 */
export function buildNurseRosterIcs(doc: NurseRosterIcsInput): string {
  const stamp = formatIcsDate(new Date());
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ClinicRoster//Nurse Roster//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(`${doc.nurseName} shifts`)}`,
    // Calendar apps that honour it check for changes every few hours.
    'REFRESH-INTERVAL;VALUE=DURATION:PT4H',
    'X-PUBLISHED-TTL:PT4H',
  ];

  const shifts = [...(doc.shifts || [])].sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  for (const s of shifts) {
    const start = zonedTimeToUtc(s.date, s.startTime, doc.timezone);
    let end = zonedTimeToUtc(s.date, s.endTime, doc.timezone);
    if (end.getTime() <= start.getTime()) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000); // overnight duty
    }
    const summary = s.detail ? `${s.acronym} ${s.shiftName} · ${s.detail}` : `${s.acronym} ${s.shiftName}`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeIcsText(nurseShiftUid(doc.nurseId, s))}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `LOCATION:${escapeIcsText(doc.clinicName)}`,
      `DESCRIPTION:${escapeIcsText(`${s.startTime} to ${s.endTime}${s.detail ? ` · ${s.detail}` : ''}${s.scheduleName ? ` · ${s.scheduleName}` : ''}`)}`,
      'END:VEVENT'
    );
  }

  for (const day of [...(doc.leaveDays || [])].sort()) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeIcsText(`${doc.nurseId}-${day}-leave@clinicroster`)}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day.replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${nextDayCompact(day)}`,
      'SUMMARY:Leave',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
