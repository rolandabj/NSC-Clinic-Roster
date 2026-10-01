/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PDF export of the schedule: the nurses' roster grid and the doctors' clinic
 * sessions grid, laid out like the Schedules screen (one column per day,
 * colour coded cells, weekends shaded), with a header on every page, page
 * numbers and a legend. The PDF library loads only when an export runs.
 *
 *   A3 landscape: the whole period on one page width (up to 31 days)
 *   A4 landscape: the period split into parts of up to 16 days
 */

import {
  Assignment,
  ClinicalRole,
  Doctor,
  DoctorSession,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  Nurse,
  Schedule,
  SeniorityLevel,
  Specialty,
} from '../../types';
import { isWeekendDate } from '../../utils/weekend';
import { calculateDutyDurationHours } from '../reports/hoursAccounting';
import { nurseLeaveHoursInRange } from '../hours/hoursPolicy';
import { getScheduleDates } from './rosterExportService';

export interface RosterPdfOptions {
  clinicName: string;
  schedule: Schedule;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  leaveEntries: LeaveEntry[];
  leaveTypes: LeaveType[];
  seniorityLevels: SeniorityLevel[];
  doctors: Doctor[];
  sessions: DoctorSession[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  versionNumber?: number;
  /** Days to include (default: the whole schedule). */
  dates?: string[];
  pageSize?: 'a3' | 'a4';
  includeNurses?: boolean;
  includeDoctors?: boolean;
  /** Public holiday dates, marked in the column headers. */
  holidayDates?: string[];
  /** 'download' (default) saves the file; 'bytes' returns it instead (used by tests). */
  output?: 'download' | 'bytes';
}

type RGB = [number, number, number];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const INK: RGB = [30, 41, 59];
const MUTED: RGB = [100, 116, 139];
const GRID: RGB = [203, 213, 225];
const HEAD_FILL: RGB = [241, 245, 249];
const WEEKEND_FILL: RGB = [248, 250, 252];
const WEEKEND_HEAD: RGB = [226, 232, 240];
const HOLIDAY_HEAD: RGB = [254, 226, 226];
const SESSION_FILL: RGB = [224, 231, 255];
const MISSING_FILL: RGB = [254, 226, 226];
const MISSING_TEXT: RGB = [185, 28, 28];

function hexToRgb(hex: string | undefined, fallback: RGB): RGB {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** A pale version of a colour, so dark text stays readable on it. */
function tint([r, g, b]: RGB, amount = 0.78): RGB {
  return [Math.round(r + (255 - r) * amount), Math.round(g + (255 - g) * amount), Math.round(b + (255 - b) * amount)];
}

/** "09:00" -> "9", "18:30" -> "18:30" */
function shortTime(t: string): string {
  const [h, m] = t.split(':');
  return m === '00' ? String(Number(h)) : `${Number(h)}:${m}`;
}

function firstName(fullName: string): string {
  return fullName.replace(/^Dr\.?\s+/i, '').trim().split(/\s+/)[0] || fullName;
}

function chunk<T>(list: T[], size: number): T[][] {
  const parts: T[][] = [];
  for (let i = 0; i < list.length; i += size) parts.push(list.slice(i, i + size));
  return parts;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase() || 'clinic';
}

/** Builds the PDF and downloads it (or returns its bytes with output: 'bytes'). */
export async function exportRosterToPdf(options: RosterPdfOptions): Promise<ArrayBuffer | void> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const autoTable = autoTableModule.default;

  const {
    clinicName,
    schedule,
    assignments,
    nurses,
    dutyWindows,
    leaveEntries,
    leaveTypes,
    seniorityLevels,
    doctors,
    sessions,
    roles,
    specialties,
    versionNumber = schedule.activeVersionNumber || 1,
    pageSize = 'a3',
    includeNurses = true,
    includeDoctors = true,
  } = options;
  const allDates = options.dates && options.dates.length > 0 ? options.dates : getScheduleDates(schedule.startDate, schedule.endDate);
  const holidays = new Set(options.holidayDates || []);

  const dutyMap = new Map(dutyWindows.map((d) => [d.id, d]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d]));
  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const specialtyMap = new Map(specialties.map((s) => [s.id, s]));
  const leaveTypeMap = new Map(leaveTypes.map((l) => [l.id, l]));
  const seniorityMap = new Map(seniorityLevels.map((s) => [s.id, s]));
  const nurseMap = new Map(nurses.map((n) => [n.id, n]));
  const shiftByNurseDate = new Map(assignments.map((a) => [`${a.nurseId}_${a.date}`, a]));

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: pageSize });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const daysPerPart = pageSize === 'a3' ? 31 : 16;
  const nameWidth = 42;
  const totalWidth = 16;
  const generatedAt = new Date().toLocaleString();
  const baseFontSize = pageSize === 'a3' ? 7 : 6.8;

  const drawPageFrame = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...INK);
    doc.text(clinicName, margin, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(`${title}  ·  ${schedule.name}  ·  ${schedule.startDate} to ${schedule.endDate}`, margin, 17.5);
    doc.text(`Version ${versionNumber}  ·  Generated ${generatedAt}`, pageWidth - margin, 12, { align: 'right' });
    doc.setDrawColor(...GRID);
    doc.line(margin, 20, pageWidth - margin, 20);
    doc.setFontSize(7.5);
    doc.text(`Page ${doc.getNumberOfPages()} of {total}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
  };

  const dayHead = (date: string) => {
    const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
    return `${weekday}\n${Number(date.slice(8, 10))}${holidays.has(date) ? '\nPH' : ''}`;
  };
  const headFillFor = (date: string): RGB => (holidays.has(date) ? HOLIDAY_HEAD : isWeekendDate(date) ? WEEKEND_HEAD : HEAD_FILL);

  /**
   * Table settings shared by both grids. Every day column gets the same width, and
   * when there are few rows they are made taller (with slightly larger text) so the
   * grid fills the page instead of sitting in its top third.
   */
  const baseTable = (dates: string[], rowCount: number) => {
    const dayWidth = (pageWidth - 2 * margin - nameWidth - totalWidth) / Math.max(1, dates.length);
    const usableHeight = pageHeight - 23 - 12 - 12; // header, footer, column heads
    const rowHeight = Math.min(16, Math.max(7, usableHeight / Math.max(1, rowCount)));
    const fontSize = Math.min(baseFontSize + 1.2, baseFontSize + (rowHeight - 9) * 0.25);
    const columnStyles: Record<number, any> = { 0: { cellWidth: nameWidth, halign: 'left' }, [dates.length + 1]: { cellWidth: totalWidth } };
    dates.forEach((_, i) => (columnStyles[i + 1] = { cellWidth: dayWidth }));
    return {
    theme: 'grid' as const,
    startY: 23,
    margin: { top: 23, left: margin, right: margin, bottom: 10 },
    styles: {
      font: 'helvetica',
      fontSize,
      cellPadding: 0.8,
      minCellHeight: rowHeight,
      halign: 'center' as const,
      valign: 'middle' as const,
      textColor: INK,
      lineColor: GRID,
      lineWidth: 0.15,
      overflow: 'linebreak' as const,
    },
    headStyles: { fillColor: HEAD_FILL, textColor: INK, fontStyle: 'bold' as const, fontSize: fontSize + 0.4, minCellHeight: 8 },
    columnStyles,
    rowPageBreak: 'avoid' as const,
    };
  };

  let firstSection = true;
  const startSection = () => {
    if (!firstSection) doc.addPage();
    firstSection = false;
  };

  // 1. Nurses' roster
  if (includeNurses) {
    const totals = new Map<string, number>();
    nurses.forEach((n) => {
      let hours = 0;
      allDates.forEach((d) => {
        const a = shiftByNurseDate.get(`${n.id}_${d}`);
        if (a) hours += calculateDutyDurationHours(dutyMap.get(a.dutyWindowId));
      });
      hours += nurseLeaveHoursInRange(n.id, leaveEntries, leaveTypes, allDates[0], allDates[allDates.length - 1]);
      totals.set(n.id, Math.round(hours * 10) / 10);
    });

    chunk(allDates, daysPerPart).forEach((dates, part, parts) => {
      startSection();
      const fills = new Map<string, RGB>();
      const body = nurses.map((nurse) => {
        const seniority = seniorityMap.get(nurse.seniorityLevelId)?.name || '';
        const row: string[] = [`${nurse.fullName}${seniority ? `\n${seniority}` : ''}`];
        dates.forEach((date, i) => {
          const leave = leaveEntries.find((le) => le.nurseId === nurse.id && le.approved && date >= le.startDate && date <= le.endDate);
          const a = shiftByNurseDate.get(`${nurse.id}_${date}`);
          if (leave) {
            const lt = leaveTypeMap.get(leave.leaveTypeId);
            row.push(lt?.acronym || 'LEAVE');
            fills.set(`${nurse.id}_${i}`, tint(hexToRgb(lt?.color, [16, 185, 129]), 0.7));
          } else if (a) {
            const duty = dutyMap.get(a.dutyWindowId);
            let target = '';
            if (a.kind === 'DOCTOR' && a.doctorId) target = firstName(doctorMap.get(a.doctorId)?.fullName || 'Dr');
            else if (a.clinicalRoleId === 'role-float' || a.note?.toLowerCase().includes('float')) target = 'Float';
            else if (a.clinicalRoleId) target = roleMap.get(a.clinicalRoleId)?.acronym || (a.clinicalRoleId === 'role-nurse-clinic' ? 'NC' : 'Role');
            else if (a.specialtyId) target = specialtyMap.get(a.specialtyId)?.code || 'Pool';
            row.push(`${duty?.acronym || 'Duty'}\n${target}`);
            fills.set(`${nurse.id}_${i}`, tint(hexToRgb(duty?.color, [79, 70, 229])));
          } else {
            row.push('');
          }
        });
        row.push(`${totals.get(nurse.id) ?? 0}h`);
        return row;
      });

      const title = parts.length > 1 ? `Nurses' Roster (part ${part + 1} of ${parts.length})` : "Nurses' Roster";
      autoTable(doc, {
        ...baseTable(dates, nurses.length),
        head: [['Nurse', ...dates.map(dayHead), 'Total']],
        body,
        didParseCell: (data: any) => {
          const col = data.column.index;
          if (data.section === 'head' && col >= 1 && col <= dates.length) data.cell.styles.fillColor = headFillFor(dates[col - 1]);
          if (data.section !== 'body') return;
          if (col === 0) {
            data.cell.styles.fontStyle = 'bold';
            return;
          }
          if (col > dates.length) {
            data.cell.styles.fontStyle = 'bold';
            return;
          }
          const nurse = nurses[data.row.index];
          const fill = nurse ? fills.get(`${nurse.id}_${col - 1}`) : undefined;
          if (fill) data.cell.styles.fillColor = fill;
          else if (isWeekendDate(dates[col - 1]) || holidays.has(dates[col - 1])) data.cell.styles.fillColor = WEEKEND_FILL;
        },
        didDrawPage: () => drawPageFrame(title),
      } as any);
    });
  }

  // 2. Doctors' clinic sessions
  if (includeDoctors) {
    const inRange = new Set(allDates);
    const doctorIds = Array.from(new Set(sessions.filter((s) => inRange.has(s.date)).map((s) => s.doctorId)));
    const doctorRows = doctorIds
      .map((id) => doctorMap.get(id))
      .filter((d): d is Doctor => !!d)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    chunk(allDates, daysPerPart).forEach((dates, part, parts) => {
      startSection();
      const fills = new Map<string, { fill: RGB; text?: RGB }>();
      const body = doctorRows.map((dr) => {
        const specialty = dr.specialtyIds?.map((id) => specialtyMap.get(id)?.name).find(Boolean) || '';
        const row: string[] = [`${dr.fullName}${specialty ? `\n${specialty}` : ''}`];
        let count = 0;
        dates.forEach((date, i) => {
          const sess = sessions.find((s) => s.doctorId === dr.id && s.date === date);
          if (!sess) return row.push('');
          if (sess.cancelled) {
            fills.set(`${dr.id}_${i}`, { fill: WEEKEND_FILL, text: MUTED });
            return row.push('Cancelled');
          }
          count++;
          const paired = assignments
            .filter((a) => a.kind === 'DOCTOR' && a.doctorId === dr.id && a.date === date)
            .map((a) => firstName(nurseMap.get(a.nurseId)?.fullName || '?'));
          const time = `${shortTime(sess.startTime)}–${shortTime(sess.endTime)}`;
          if (paired.length === 0) {
            fills.set(`${dr.id}_${i}`, { fill: MISSING_FILL, text: MISSING_TEXT });
            return row.push(`${time}\nNo nurse`);
          }
          fills.set(`${dr.id}_${i}`, { fill: SESSION_FILL });
          return row.push(`${time}\n${paired.join(' + ')}`);
        });
        row.push(String(count));
        return row;
      });

      const title = parts.length > 1 ? `Doctors' Clinic Sessions (part ${part + 1} of ${parts.length})` : "Doctors' Clinic Sessions";
      autoTable(doc, {
        ...baseTable(dates, doctorRows.length),
        head: [['Doctor', ...dates.map(dayHead), 'Sessions']],
        body,
        didParseCell: (data: any) => {
          const col = data.column.index;
          if (data.section === 'head' && col >= 1 && col <= dates.length) data.cell.styles.fillColor = headFillFor(dates[col - 1]);
          if (data.section !== 'body') return;
          if (col === 0 || col > dates.length) {
            data.cell.styles.fontStyle = 'bold';
            return;
          }
          const dr = doctorRows[data.row.index];
          const style = dr ? fills.get(`${dr.id}_${col - 1}`) : undefined;
          if (style) {
            data.cell.styles.fillColor = style.fill;
            if (style.text) data.cell.styles.textColor = style.text;
          } else if (isWeekendDate(dates[col - 1]) || holidays.has(dates[col - 1])) {
            data.cell.styles.fillColor = WEEKEND_FILL;
          }
        },
        didDrawPage: () => drawPageFrame(title),
      } as any);
    });
  }

  // 3. Legend: under the last grid when it fits, otherwise on its own page
  const activeDutyCount = dutyWindows.filter((d) => d.active !== false).length;
  const legendHeight = 8 + activeDutyCount * 5.5 + (leaveTypes.length > 0 ? 8 + leaveTypes.length * 5.5 : 0) + 30;
  const lastY: number = (doc as any).lastAutoTable?.finalY ?? 23;
  let y: number;
  if (!firstSection && lastY + 10 + legendHeight < pageHeight - 10) {
    y = lastY + 12;
  } else {
    doc.addPage();
    drawPageFrame('Legend');
    y = 30;
  }
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...INK);
  doc.text('Shifts', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  dutyWindows
    .filter((d) => d.active !== false)
    .forEach((d) => {
      doc.setFillColor(...tint(hexToRgb(d.color, [79, 70, 229])));
      doc.setDrawColor(...GRID);
      doc.rect(margin, y - 3.2, 8, 4.2, 'FD');
      doc.setTextColor(...INK);
      doc.text(`${d.acronym}   ${d.startTime}–${d.endTime}   (${calculateDutyDurationHours(d)}h)`, margin + 11, y);
      y += 5.5;
    });
  if (leaveTypes.length > 0) {
    y += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Leave', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    leaveTypes.forEach((lt) => {
      doc.setFillColor(...tint(hexToRgb(lt.color, [16, 185, 129]), 0.7));
      doc.rect(margin, y - 3.2, 8, 4.2, 'FD');
      doc.text(`${lt.acronym}   ${lt.name}`, margin + 11, y);
      y += 5.5;
    });
  }
  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Reading the grids', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  [
    "Nurses' roster: the shift on top, then the doctor's first name, NC (Nurse Clinic), Float, or a specialty code.",
    "Doctors' sessions: the session hours (9–18:30 means 09:00 to 18:30), then the nurse or nurses with the doctor.",
    'Red cells: a doctor session with no nurse. Shaded columns: weekends. PH: public holiday.',
    'Total: duty hours plus credited leave hours in the days shown.',
  ].forEach((line) => {
    doc.text(line, margin, y);
    y += 5;
  });

  if (typeof (doc as any).putTotalPages === 'function') (doc as any).putTotalPages('{total}');
  if (options.output === 'bytes') return doc.output('arraybuffer');
  doc.save(`${sanitizeFileName(clinicName)}_${allDates[0]}_${allDates[allDates.length - 1]}_v${versionNumber}.pdf`);
}
