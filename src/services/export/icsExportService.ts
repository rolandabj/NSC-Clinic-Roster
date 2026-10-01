/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Builds an iCalendar (.ics) file of one nurse's shifts in the browser, so
 * staff can add their roster to Google Calendar, Apple Calendar or Outlook.
 * Times are converted from the clinic's time zone to UTC, which every
 * calendar app understands without extra time zone definitions.
 */

import { Assignment, DutyWindow, Doctor, ClinicalRole, Specialty } from '../../types';

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

/** Folds lines longer than 75 octets per RFC 5545. */
function foldLine(line: string): string {
  if (line.length <= 74) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 74));
  rest = rest.slice(74);
  while (rest.length > 0) {
    chunks.push(' ' + rest.slice(0, 73));
    rest = rest.slice(73);
  }
  return chunks.join('\r\n');
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
