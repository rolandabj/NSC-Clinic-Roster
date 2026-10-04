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
import React, { useEffect, useId, useState } from 'react';
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
import { useDialogA11y } from '../common/useDialogA11y';
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
  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, onClose);

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
  if (historyError || !clinicSetup?.hoursHistory || overlap) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Export roster" className="rounded bg-white p-6 max-w-lg">
        <p role="status">{historyError || (overlap ? `Resolve the overlap between "${overlap.first.name}" and "${overlap.second.name}" before exporting hours.` : 'Loading saved hours history…')}</p>
        <button type="button" onClick={onClose} className="mt-4 rounded border px-3 py-2">Close</button>
      </div>
    </div>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150 print:static print:p-0 print:bg-white">
      {/* Modal Container (Hidden during native print, print section rendered below) */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs print:hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Download className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="text-base font-bold text-slate-900">Export and print</h2>
              </div>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                {schedule.name} · version {versionNumber} ({schedule.startDate} to {schedule.endDate})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 bg-white text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('print_roster')}
            className={`py-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'print_roster'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-rose-600" aria-hidden="true" />
            <span>PDF (nurses and doctors)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('excel')}
            className={`py-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'excel'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            className={`py-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'csv'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('print_packets')}
            className={`py-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'print_packets'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" aria-hidden="true" />
            <span>A page for each nurse</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analysis')}
            className={`py-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'analysis'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileJson className="w-4 h-4 text-amber-600" aria-hidden="true" />
            <span>Full report for analysis</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* TAB 1: Excel */}
          {activeTab === 'excel' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-emerald-950">
                    Excel workbook (.xlsx)
                  </h3>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed font-sans">
                  A workbook with several sheets: shift codes, the doctor each nurse works with, and shift colours.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> Roster: the calendar
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> Legend: shift codes and rules
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> Long: one row per shift
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> Hours: each nurse's hours
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> Doctors: doctors' clinics
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> File name: <code>{clinicName.toLowerCase().replace(/\s+/g, '_')}_{schedule.startDate}_v{versionNumber}.xlsx</code>
                  </span>
                </div>
              </div>

              {/* Scope Radio */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="font-semibold text-slate-800 text-xs block">Days to include:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="excelScope"
                      checked={excelScope === 'ALL'}
                      onChange={() => setExcelScope('ALL')}
                      className="text-indigo-600"
                    />
                    <span>Whole roster ({allDates.length} days)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="excelScope"
                      checked={excelScope === 'ACTIVE_BLOCK'}
                      onChange={() => setExcelScope('ACTIVE_BLOCK')}
                      className="text-indigo-600"
                    />
                    <span>Only the days on screen ({blockDates.length} days)</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadExcel}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download Excel file</span>
              </button>
            </div>
          )}

          {/* TAB 2: CSV */}
          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flavor 1: Matrix CSV */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                    <h3 className="font-bold text-slate-900">Calendar layout</h3>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Like the roster screen: one row per nurse and one column per day, with shift codes and the doctor each nurse works with.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadCsvMatrix}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Download calendar CSV</span>
                  </button>
                </div>

                {/* Flavor 2: Long Format CSV */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />
                    <h3 className="font-bold text-slate-900">One row per shift</h3>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Each shift on its own row: date, employee code, hours, shift times, doctor, whether it is a pinned day, and how it was set. Useful for other spreadsheets and reports.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadCsvLong}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Download shifts CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PDF: nurses' roster and doctors' sessions */}
          {activeTab === 'print_roster' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-600" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-rose-950">Schedule PDF: Nurses &amp; Doctors</h3>
                </div>
                <p className="text-xs text-rose-950/80 leading-relaxed">
                  Downloads a PDF laid out like the Schedules screen: every nurse with her shift and job for each day,
                  then every doctor with the session hours and the nurse with them. Cells are colour coded by shift,
                  weekends are shaded, sessions without a nurse are red, and a legend is added at the end.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <fieldset className="p-3 border border-slate-200 rounded space-y-1.5">
                  <legend className="px-1 font-semibold text-slate-700">A4 landscape</legend>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pdf-layout" checked={!pdfSplit} onChange={() => setPdfSplit(false)} />
                    <span>Whole period on one page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pdf-layout" checked={pdfSplit} onChange={() => setPdfSplit(true)} />
                    <span>Split into halves (larger text)</span>
                  </label>
                </fieldset>
                <fieldset className="p-3 border border-slate-200 rounded space-y-1.5">
                  <legend className="px-1 font-semibold text-slate-700">Days</legend>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pdf-scope" checked={pdfScope === 'ALL'} onChange={() => setPdfScope('ALL')} />
                    <span>Whole roster ({allDates.length} days)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pdf-scope"
                      checked={pdfScope === 'ACTIVE_BLOCK'}
                      disabled={blockDates.length === 0}
                      onChange={() => setPdfScope('ACTIVE_BLOCK')}
                    />
                    <span>Only the days on screen ({blockDates.length} days)</span>
                  </label>
                </fieldset>
                <fieldset className="p-3 border border-slate-200 rounded space-y-1.5">
                  <legend className="px-1 font-semibold text-slate-700">Include</legend>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={pdfIncludeNurses} onChange={(e) => setPdfIncludeNurses(e.target.checked)} />
                    <span>Nurses&apos; roster ({nurses.length})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={pdfIncludeDoctors} onChange={(e) => setPdfIncludeDoctors(e.target.checked)} />
                    <span>Doctors&apos; sessions ({doctors.length})</span>
                  </label>
                </fieldset>
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isPdfBusy}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{isPdfBusy ? 'Creating the PDF…' : 'Download PDF'}</span>
              </button>
            </div>
          )}

          {/* Full report for analysis (JSON) */}
          {activeTab === 'analysis' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-amber-950">Full roster report (.json)</h3>
                </div>
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  One file with everything about this roster, made to be read by a program or given to Claude to study
                  how the roster was filled and to improve the way it is generated. It is not meant to be opened in Excel.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-amber-950">
                  {[
                    'Shift types, rules, leave types, skills',
                    'Nurses: preferences, hours goal and hours worked',
                    'Doctors and their sessions each day',
                    'Who worked with which doctor, and her rank for him',
                    'Hours the clinic needs and hours rostered, per day',
                    'Every problem the checker finds now',
                    'Leave, day off and shift requests (followed or not)',
                    'Pinned days and the end of the previous roster',
                  ].map((label) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" /> {label}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-amber-900/80 pt-1">
                  Email addresses, dates of birth and profile notes are left out. File name:{' '}
                  <code>{analysisFileName(clinicName, schedule, versionNumber)}</code>
                </p>
              </div>

              {!clinicSetup && (
                <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded p-2">
                  Opening hours, public holidays and the previous roster are not loaded yet, so the file will use the
                  default opening hours and no holidays. Reload the page first for a complete report.
                </p>
              )}

              <button
                type="button"
                onClick={handleDownloadAnalysis}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download full report</span>
              </button>
            </div>
          )}

          {/* TAB 4: Per-Nurse Packets */}
          {activeTab === 'print_packets' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-purple-950">A page for each nurse</h3>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed font-sans">
                  Prints one page per nurse for the whole roster: their hours goal, shift hours, leave hours and every day's shift in date order.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-semibold text-slate-700 text-xs">Print for:</span>
                <select
                  aria-label="Print for"
                  value={selectedNurseId}
                  onChange={(e) => setSelectedNurseId(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded font-medium bg-white text-slate-800"
                >
                  <option value="ALL">All nurses ({nurses.length} pages)</option>
                  {nurses.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.fullName} ({n.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleTriggerPrint}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print {selectedNurseId === 'ALL' ? 'pages' : 'page'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Version {versionNumber} · {clinicName}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

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
                  NURSES' ROSTER · {schedule.name} ({schedule.startDate} to {schedule.endDate})
                </p>
              </div>
              <div className="text-right font-mono text-[10px]">
                <p className="font-bold">VERSION {versionNumber}</p>
                <p className="text-slate-600">Printed: {new Date().toLocaleString()}</p>
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
                    <p>{schedule.startDate} to {schedule.endDate}</p>
                    <p className="text-slate-600">Printed: {new Date().toLocaleDateString()}</p>
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
    </div>
  );
};
