/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Export dialog: a PDF of the nurses' and doctors' rosters, an Excel workbook,
 * CSV files, a printed page for each nurse, and a full JSON file for analysis.
 */

import { hoursHistoryOverlaps } from '../../services/hours/hoursBalance';
import { loadClinicSetup } from '../../services/engine/clinicSetupService';
import { getRepository } from '../../services/repository';

import { resolveFullTimeTarget } from '../../services/hours/hoursPolicy';
import React, { useEffect, useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Info,
  FileJson,
} from 'lucide-react';
import {
  Schedule,
  Assignment,
  Nurse,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  SeniorityLevel,
  Doctor,
  DoctorSession,
  ClinicalRole,
  Specialty,
  Rule,
  WorkingHoursPeriod,
  LockEntry,
  AvailabilityRequest,
} from '../../types';
import type { ClinicSetup } from '../../services/engine/clinicModel';
import { analysisFileName, downloadRosterAnalysis } from '../../services/export/analysisExportService';
import {
  exportRosterToExcel,
  exportRosterToCsvMatrix,
  exportRosterToCsvLong,
  getScheduleDates,
} from '../../services/export/rosterExportService';
import { notify } from '../common/dialogs';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { Button, Checkbox, Dialog, Field, LoadingState, Notice, Select, TabPanel, Tabs, cx } from '../ui';
import {
  calculateNurseHoursAccounting,
  calculateDutyDurationHours,
  NurseHoursAccounting,
} from '../../services/reports/hoursAccounting';
import { isFloatShift } from '../../services/engine/floatShift';

interface ExportModalProps {
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
  rules?: Rule[];
  workingHoursPeriods?: WorkingHoursPeriod[];
  currentBlockIndex?: number;
  blockDates?: string[];
  versionNumber?: number;
  /** Public holiday dates, marked in the PDF. */
  holidayDates?: string[];
  /** For the analysis file: pinned days, nurses' requests and the clinic setup the engine uses. */
  locks?: LockEntry[];
  availabilityRequests?: AvailabilityRequest[];
  clinicSetup?: ClinicSetup;
  timezone?: string;
  isOpen: boolean;
  onClose: () => void;
}

type ExportTab = 'excel' | 'csv' | 'print_roster' | 'print_packets' | 'analysis';

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Hours as printed: at most one decimal. */
const fmtHours = (h: number) => `${Math.round((h || 0) * 10) / 10}h`;

export const ExportModal: React.FC<ExportModalProps> = ({
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
  rules = [],
  currentBlockIndex = 0,
  blockDates = [],
  versionNumber = schedule.activeVersionNumber || 1,
  isOpen,
  onClose,
  workingHoursPeriods: providedPeriods = [],
  holidayDates = [],
  locks = [],
  availabilityRequests = [],
  clinicSetup: providedClinicSetup,
  timezone,
}) => {
  const [loadedClinicSetup, setLoadedClinicSetup] = useState<ClinicSetup>();
  const [loadedPeriods, setLoadedPeriods] = useState<WorkingHoursPeriod[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const clinicSetup = providedClinicSetup || loadedClinicSetup;
  const workingHoursPeriods = providedPeriods.length ? providedPeriods : loadedPeriods;
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoadedClinicSetup(undefined);
    setHistoryError(null);
    const repo = getRepository();
    Promise.all([loadClinicSetup(repo, schedule, { withYearToDate: false }), repo.list('workingHoursPeriods')])
      .then(([setup, periods]) => { if (!cancelled) { setLoadedClinicSetup(setup); setLoadedPeriods(periods); } })
      .catch(() => { if (!cancelled) setHistoryError('The saved hours history could not be loaded. Close this dialog and try again.'); });
    return () => { cancelled = true; };
  }, [isOpen, schedule.id]);
  const [activeTab, setActiveTab] = useState<ExportTab>('print_roster');
  const [pdfSplit, setPdfSplit] = useState(false);
  const [pdfScope, setPdfScope] = useState<'ALL' | 'ACTIVE_BLOCK'>('ALL');
  const [pdfIncludeNurses, setPdfIncludeNurses] = useState(true);
  const [pdfIncludeDoctors, setPdfIncludeDoctors] = useState(true);
  const [isPdfBusy, setIsPdfBusy] = useState(false);
  const [excelScope, setExcelScope] = useState<'ALL' | 'ACTIVE_BLOCK'>('ALL');
  const [selectedNurseId, setSelectedNurseId] = useState<string>('ALL');

  // Start downloading the Excel library as soon as the dialog opens, so the
  // file is ready when the user clicks (browsers may block a late download).
  useEffect(() => {
    if (isOpen) {
      import('xlsx').catch(() => {});
      import('jspdf').catch(() => {});
      import('jspdf-autotable').catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const overlap = hoursHistoryOverlaps(schedule, clinicSetup?.hoursHistory)[0];
  if (historyError || !clinicSetup?.hoursHistory || overlap)
    return (
      <Dialog open onClose={onClose} size="sm" title="Export or print" footer={<Button onClick={onClose}>Close</Button>}>
        {historyError || overlap ? (
          <Notice tone="danger" live title={historyError || `Fix the overlap between ${overlap!.first.name} and ${overlap!.second.name} before exporting hours.`} />
        ) : (
          <LoadingState label="Loading the saved hours history…" />
        )}
      </Dialog>
    );

  const dutyMap = new Map(dutyWindows.map((d) => [d.id, d]));
  const nurseMap = new Map(nurses.map((n) => [n.id, n]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d]));
  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const specialtyMap = new Map(specialties.map((s) => [s.id, s]));
  const seniorityMap = new Map(seniorityLevels.map((s) => [s.id, s]));
  const leaveTypeMap = new Map(leaveTypes.map((l) => [l.id, l]));

  const allDates = getScheduleDates(schedule.startDate, schedule.endDate);
  const activeDates = excelScope === 'ACTIVE_BLOCK' && blockDates.length > 0 ? blockDates : allDates;

  // 1. Download Excel
  const handleDownloadExcel = async () => {
    try {
      await exportRosterToExcel({
      workingHoursPeriods,
      hoursHistory: clinicSetup?.hoursHistory,
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
      rules,
      versionNumber,
      blockDates: excelScope === 'ACTIVE_BLOCK' ? blockDates : undefined,
      });
    } catch (err: any) {
      notify(`The Excel file could not be created: ${err?.message || err}`, 'error');
    }
  };

  // PDF: nurses' roster and doctors' sessions, laid out like the Schedules screen
  const handleDownloadPdf = async () => {
    if (!pdfIncludeNurses && !pdfIncludeDoctors) {
      notify('Choose the nurses, the doctors, or both.', 'warning');
      return;
    }
    setIsPdfBusy(true);
    try {
      const { exportRosterToPdf } = await import('../../services/export/rosterPdfService');
      await exportRosterToPdf({
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
        versionNumber,
        dates: pdfScope === 'ACTIVE_BLOCK' && blockDates.length > 0 ? blockDates : undefined,
        split: pdfSplit,
        includeNurses: pdfIncludeNurses,
        includeDoctors: pdfIncludeDoctors,
        holidayDates,
      });
      notify('PDF downloaded.', 'success');
    } catch (err: any) {
      notify(`The PDF could not be created: ${err?.message || err}`, 'error');
    } finally {
      setIsPdfBusy(false);
    }
  };

  // 2. Download CSV Matrix
  const handleDownloadCsvMatrix = () => {
    exportRosterToCsvMatrix({
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
      versionNumber,
      blockDates: excelScope === 'ACTIVE_BLOCK' ? blockDates : undefined,
    });
  };

  // 3. Download CSV Long
  const handleDownloadCsvLong = () => {
    exportRosterToCsvLong({
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
      versionNumber,
    });
  };

  // 5. Analysis file (JSON): everything about the roster, for study by a program or Claude
  const handleDownloadAnalysis = () => {
    try {
      const analysis = downloadRosterAnalysis({
        clinicName,
        timezone,
        schedule,
        versionNumber,
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
        rules,
        workingHoursPeriods,
        locks,
        availabilityRequests,
        clinicSetup,
      });
      notify(
        `Analysis file downloaded: ${analysis.shifts.length} shifts, ${analysis.problems.length} problems.`,
        'success'
      );
    } catch (err: any) {
      notify(`The analysis file could not be created: ${err?.message || err}`, 'error');
    }
  };

  // 4. Trigger Native Print
  const handleTriggerPrint = () => {
    window.print();
  };

  // Compute per-nurse accounting for printable packets
  const nurseAccountingList: NurseHoursAccounting[] = nurses.map((nurse) =>
    calculateNurseHoursAccounting(
      nurse,
      schedule,
      assignments,
      dutyWindows,
      leaveEntries,
      leaveTypes,
      seniorityLevels,
      doctors,
      roles,
      specialties,
      [],
      workingHoursPeriods,
      clinicSetup?.hoursHistory
    )
  );

  const displayNursesForPackets =
    selectedNurseId === 'ALL'
      ? nurseAccountingList
      : nurseAccountingList.filter((n) => n.nurse.id === selectedNurseId);

  const block = (title: string, text: React.ReactNode, children?: React.ReactNode) => (
    <section className="space-y-2 rounded-lg border border-line p-4">
      <h3 className="font-semibold text-ink">{title}</h3>
      <div className="text-ink-muted">{text}</div>
      {children}
    </section>
  );
  const radio = (name: string, checked: boolean, onChange: () => void, label: React.ReactNode, disabled?: boolean) => (
    <label className={cx('flex items-center gap-2', disabled && 'opacity-50')}>
      <input type="radio" name={name} className="size-4 accent-brand" checked={checked} disabled={disabled} onChange={onChange} />
      {label}
    </label>
  );

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        size="lg"
        title="Export or print"
        description={`${schedule.name}, version ${versionNumber} (${formatDate(schedule.startDate)} to ${formatDate(schedule.endDate)}).`}
        footer={<Button onClick={onClose}>Close</Button>}
      >
        <div className="space-y-4 text-sm">
          <Tabs
            label="Export"
            idPrefix="export"
            value={activeTab}
            onChange={(id) => setActiveTab(id as ExportTab)}
            tabs={[
              { id: 'print_roster', label: 'PDF' },
              { id: 'excel', label: 'Excel' },
              { id: 'csv', label: 'CSV' },
              { id: 'print_packets', label: 'A page for each nurse' },
              { id: 'analysis', label: 'Full report' },
            ]}
          />

          <TabPanel idPrefix="export" id="print_roster" value={activeTab}>
            <div className="space-y-4">
              {block(
                'Roster PDF: nurses and doctors',
                'A PDF laid out like the roster screen: every nurse with their shift and job for each day, then every doctor with the clinic hours and the nurse with them. Cells are coloured by shift, weekends are shaded, clinics without a nurse are red, and a key comes at the end.'
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <fieldset className="space-y-2 rounded-lg border border-line p-3">
                  <legend className="px-1 font-semibold text-ink">A4 landscape</legend>
                  {radio('pdf-layout', !pdfSplit, () => setPdfSplit(false), 'The whole roster on one page')}
                  {radio('pdf-layout', pdfSplit, () => setPdfSplit(true), 'In two halves (larger text)')}
                </fieldset>
                <fieldset className="space-y-2 rounded-lg border border-line p-3">
                  <legend className="px-1 font-semibold text-ink">Days</legend>
                  {radio('pdf-scope', pdfScope === 'ALL', () => setPdfScope('ALL'), `Whole roster (${allDates.length} days)`)}
                  {radio('pdf-scope', pdfScope === 'ACTIVE_BLOCK', () => setPdfScope('ACTIVE_BLOCK'), `Only the days on screen (${blockDates.length} days)`, blockDates.length === 0)}
                </fieldset>
                <fieldset className="space-y-2 rounded-lg border border-line p-3">
                  <legend className="px-1 font-semibold text-ink">Include</legend>
                  <Checkbox checked={pdfIncludeNurses} onChange={(e) => setPdfIncludeNurses(e.target.checked)} label={`Nurses' roster (${nurses.length})`} />
                  <Checkbox checked={pdfIncludeDoctors} onChange={(e) => setPdfIncludeDoctors(e.target.checked)} label={`Doctors' clinics (${doctors.length})`} />
                </fieldset>
              </div>
              <Button variant="primary" icon={Download} busy={isPdfBusy} onClick={handleDownloadPdf}>
                Download the PDF
              </Button>
            </div>
          </TabPanel>

          <TabPanel idPrefix="export" id="excel" value={activeTab}>
            <div className="space-y-4">
              {block(
                'Excel workbook (.xlsx)',
                'A workbook with several sheets: Roster (the calendar), Legend (shift codes and rules), Long (one row for each shift), Hours (each nurse\'s hours) and Doctors (the doctors\' clinics), with shift codes, the doctor each nurse works with and shift colours.',
                <p className="text-xs text-ink-muted">
                  File name: <code className="font-mono">{clinicName.toLowerCase().replace(/\s+/g, '_')}_{schedule.startDate}_v{versionNumber}.xlsx</code>
                </p>
              )}
              <fieldset className="space-y-2">
                <legend className="mb-2 font-semibold text-ink">Days to include</legend>
                {radio('excelScope', excelScope === 'ALL', () => setExcelScope('ALL'), `Whole roster (${allDates.length} days)`)}
                {radio('excelScope', excelScope === 'ACTIVE_BLOCK', () => setExcelScope('ACTIVE_BLOCK'), `Only the days on screen (${blockDates.length} days)`)}
              </fieldset>
              <Button variant="primary" icon={Download} onClick={handleDownloadExcel}>
                Download the Excel file
              </Button>
            </div>
          </TabPanel>

          <TabPanel idPrefix="export" id="csv" value={activeTab}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {block(
                'Calendar layout',
                'Like the roster screen: one row for each nurse and one column for each day, with shift codes and the doctor each nurse works with.',
                <Button icon={Download} onClick={handleDownloadCsvMatrix}>
                  Download the calendar CSV
                </Button>
              )}
              {block(
                'One row for each shift',
                'Each shift on its own row: date, employee code, hours, shift times, doctor, whether it is a pinned day, and how it was set. Useful for other spreadsheets and reports.',
                <Button icon={Download} onClick={handleDownloadCsvLong}>
                  Download the shifts CSV
                </Button>
              )}
            </div>
          </TabPanel>

          <TabPanel idPrefix="export" id="print_packets" value={activeTab}>
            <div className="space-y-4">
              {block('A page for each nurse', "Prints one page for each nurse for the whole roster: their goal hours, shift hours, leave hours and every day's shift in date order.")}
              <Field label="Print for">
                {(f) => (
                  <Select {...f} value={selectedNurseId} onChange={(e) => setSelectedNurseId(e.target.value)}>
                    <option value="ALL">All nurses ({nurses.length} pages)</option>
                    {nurses.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.fullName}
                        {n.employeeCode ? ` (${n.employeeCode})` : ''}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Button variant="primary" icon={Printer} onClick={handleTriggerPrint}>
                Print {selectedNurseId === 'ALL' ? 'the pages' : 'the page'}
              </Button>
            </div>
          </TabPanel>

          <TabPanel idPrefix="export" id="analysis" value={activeTab}>
            <div className="space-y-4">
              {block(
                'Full roster report (.json)',
                'One file with everything about this roster, made to be read by a program or given to Claude to study how the roster was filled and to improve the way it is filled. It is not meant to be opened in Excel.',
                <>
                  <ul className="list-disc space-y-0.5 pl-5 text-ink-muted">
                    {[
                      'Shift types, rules, kinds of leave, skills',
                      'Nurses: preferences, goal hours and hours worked',
                      'Doctors and their clinics each day',
                      "Who worked with which doctor, and the doctor's place in the nurse's list",
                      'Hours the clinic needs and hours rostered, each day',
                      'Every problem the roster check finds now',
                      'Leave, day off and shift requests (followed or not)',
                      'Pinned days and the end of the previous roster',
                    ].map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-ink-muted">
                    Email addresses, dates of birth and profile notes are left out. File name: <code className="font-mono">{analysisFileName(clinicName, schedule, versionNumber)}</code>
                  </p>
                </>
              )}
              {!clinicSetup && (
                <Notice tone="warning" title="Some clinic details are not loaded yet">
                  Opening hours, public holidays and the previous roster are not loaded yet, so the file uses the usual opening hours and no holidays. Reload
                  the page first for a complete report.
                </Notice>
              )}
              <Button variant="primary" icon={Download} onClick={handleDownloadAnalysis}>
                Download the full report
              </Button>
            </div>
          </TabPanel>
        </div>
      </Dialog>

      {/* ========================================================================= */}
      {/* NATIVE PRINT CONTAINER (Visible ONLY when window.print() is called)      */}
      {/* ========================================================================= */}
      <div className="hidden print:block w-full bg-white text-black p-4 text-[10px]">
        {/* Render Mode A: Standard Roster Print */}
        {(activeTab === 'print_roster' || activeTab === 'excel' || activeTab === 'csv') && (
          <div className="space-y-4">
            {/* Clinic & Schedule Print Header */}
            <div className="border-b-2 border-black pb-2 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight uppercase">{clinicName}</h1>
                <p className="text-xs text-slate-700 mt-0.5">
                  NURSES' ROSTER · {schedule.name} ({formatDate(schedule.startDate)} to {formatDate(schedule.endDate)})
                </p>
              </div>
              <div className="text-right font-mono text-[10px]">
                <p className="font-bold">VERSION {versionNumber}</p>
                <p className="text-slate-600">Printed: {formatDateTime(new Date())}</p>
                <p className="text-slate-600">Base full time goal: {resolveFullTimeTarget(schedule, workingHoursPeriods).hours}h</p>
              </div>
            </div>

            {/* Roster Table */}
            <table className="w-full border-collapse border border-black text-[9px] font-mono">
              <thead>
                <tr className="bg-slate-100 text-black border-b border-black">
                  <th className="border border-black p-1 text-left">Nurse</th>
                  <th className="border border-black p-1 text-center w-10">Contract</th>
                  <th className="border border-black p-1 text-center w-12">Total</th>
                  {activeDates.map((d) => {
                    const dayObj = new Date(d);
                    const weekday = WEEKDAY_NAMES[dayObj.getUTCDay()];
                    const dayNum = d.split('-')[2];
                    return (
                      <th key={d} className="border border-black p-0.5 text-center min-w-[26px]">
                        <div>{weekday}</div>
                        <div className="font-bold">{dayNum}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {nurses.map((nurse) => {
                  const seniority = seniorityMap.get(nurse.seniorityLevelId);
                  const acct = nurseAccountingList.find((n) => n.nurse.id === nurse.id);

                  return (
                    <tr key={nurse.id} className="border-b border-black">
                      <td className="border border-black p-1 font-sans font-semibold">
                        <div>{nurse.fullName}</div>
                        <div className="text-[8px] text-slate-500 font-mono">
                          {nurse.employeeCode} · {seniority?.name || 'Staff'}
                        </div>
                      </td>
                      <td className="border border-black p-1 text-center font-bold">
                        {nurse.contractPercent}%
                      </td>
                      <td className="border border-black p-1 text-center font-bold">
                        {fmtHours(acct?.totalEarnedHours || 0)}
                      </td>
                      {activeDates.map((dateStr) => {
                        const asgn = assignments.find((a) => a.nurseId === nurse.id && a.date === dateStr);
                        const leave = leaveEntries.find(
                          (le) => le.nurseId === nurse.id && le.approved && dateStr >= le.startDate && dateStr <= le.endDate
                        );

                        if (leave) {
                          const lt = leaveTypeMap.get(leave.leaveTypeId);
                          return (
                            <td key={dateStr} className="border border-black p-0.5 text-center font-bold bg-amber-100">
                              {lt?.acronym || 'L'}
                            </td>
                          );
                        } else if (asgn) {
                          const duty = dutyMap.get(asgn.dutyWindowId);
                          let targetCode = '';
                          if (asgn.doctorId) {
                            targetCode = doctorMap.get(asgn.doctorId)?.fullName.split(' ')[1] || 'Dr';
                          } else if (asgn.clinicalRoleId) {
                            targetCode = roleMap.get(asgn.clinicalRoleId)?.acronym || 'PHL';
                          }
                          return (
                            <td key={dateStr} className="border border-black p-0.5 text-center">
                              <div className="font-bold">{duty?.acronym || 'D'}</div>
                              {targetCode && <div className="text-[7px] text-slate-600 truncate max-w-[28px]">{targetCode}</div>}
                            </td>
                          );
                        } else {
                          return (
                            <td key={dateStr} className="border border-black p-0.5 text-center text-slate-300">
                              —
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Print Legend */}
            <div className="border border-black p-2 mt-4 text-[9px] flex items-start justify-between gap-6 print-avoid-break">
              <div>
                <span className="font-bold block uppercase mb-1">Shifts:</span>
                <div className="flex flex-wrap gap-3">
                  {dutyWindows.map((dw) => (
                    <span key={dw.id}>
                      <strong>[{dw.acronym}]</strong> {dw.name} ({dw.startTime}–{dw.endTime})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold block uppercase mb-1">Leave codes:</span>
                <div className="flex flex-wrap gap-3">
                  {leaveTypes.map((lt) => (
                    <span key={lt.id}>
                      <strong>[{lt.acronym}]</strong> {lt.name} ({typeof lt.creditedHours === 'number' ? fmtHours(lt.creditedHours) : 'counts as the shift'})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Mode B: Per-Nurse Packets */}
        {activeTab === 'print_packets' && (
          <div>
            {displayNursesForPackets.map((item, index) => (
              <div
                key={item.nurse.id}
                className={`p-6 border border-black ${
                  index < displayNursesForPackets.length - 1 ? 'print-page-break' : ''
                }`}
              >
                {/* Nurse Packet Header */}
                <div className="border-b-2 border-black pb-3 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold uppercase">{clinicName}</h1>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      Roster for {item.nurse.fullName}
                    </h2>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">
                      Employee code: {item.nurse.employeeCode} · {item.seniority?.name || 'Staff nurse'} · {item.contractPercent}% contract
                    </p>
                  </div>
                  <div className="text-right font-mono text-[10px]">
                    <p className="font-bold">{schedule.name}</p>
                    <p>{formatDate(schedule.startDate)} to {formatDate(schedule.endDate)}</p>
                    <p className="text-slate-600">Printed: {formatDate(new Date())}</p>
                  </div>
                </div>

                {/* Nurse Hours Summary KPI Grid */}
                <div className="grid grid-cols-5 gap-3 my-4 p-3 border border-black font-mono text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Hours goal</span>
                    <span className="font-bold text-sm">{fmtHours(item.targetHours)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Shift hours</span>
                    <span className="font-bold text-sm">{fmtHours(item.dutyHours)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Leave hours</span>
                    <span className="font-bold text-sm">{fmtHours(item.leaveHours)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total</span>
                    <span className="font-bold text-sm">{fmtHours(item.totalEarnedHours)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Difference from goal</span>
                    <span className="font-bold text-sm">
                      {item.varianceHours > 0 ? `+${fmtHours(item.varianceHours)}` : fmtHours(item.varianceHours)}
                    </span>
                  </div>
                </div>

                {/* Day-by-Day Chronological Shift Log */}
                <table className="w-full border-collapse border border-black text-[9px] font-mono">
                  <thead>
                    <tr className="bg-slate-100 border-b border-black">
                      <th className="border border-black p-1 text-left">Date</th>
                      <th className="border border-black p-1 text-left">Weekday</th>
                      <th className="border border-black p-1 text-left">Shift or leave</th>
                      <th className="border border-black p-1 text-left">Times</th>
                      <th className="border border-black p-1 text-left">Doctor or job</th>
                      <th className="border border-black p-1 text-right">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.timeline.map((entry) => (
                      <tr key={entry.date} className="border-b border-slate-300">
                        <td className="border border-black p-1 font-bold">{entry.date}</td>
                        <td className="border border-black p-1">{entry.weekdayName}</td>
                        <td className="border border-black p-1">
                          {entry.dutyWindow
                            ? `${entry.dutyWindow.name} (${entry.dutyWindow.acronym})`
                            : entry.leaveType
                            ? `${entry.leaveType.name} (${entry.leaveType.acronym})`
                            : 'Day off'}
                        </td>
                        <td className="border border-black p-1">
                          {entry.dutyWindow ? `${entry.dutyWindow.startTime}–${entry.dutyWindow.endTime}` : '—'}
                        </td>
                        <td className="border border-black p-1 font-sans">
                          {entry.assignment && isFloatShift(entry.assignment)
                            ? 'Float'
                            : entry.doctor
                            ? entry.doctor.fullName
                            : entry.clinicalRole
                            ? entry.clinicalRole.name
                            : entry.specialty
                            ? entry.specialty.name
                            : '—'}
                        </td>
                        <td className="border border-black p-1 text-right font-bold">
                          {entry.hoursEarned > 0 ? fmtHours(entry.hoursEarned) : '0h'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Signature / Footer */}
                <div className="mt-8 pt-4 border-t border-black flex items-center justify-between text-[9px] font-mono">
                  <div>
                    <span>Nurse Signature: _______________________</span>
                  </div>
                  <div>
                    <span>Charge nurse: _______________________</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
