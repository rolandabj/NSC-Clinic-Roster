import { isWeekendDay } from '../../utils/weekend';
import { leaveCreditOnDate } from '../../services/hours/hoursPolicy';
import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import {
  FileSpreadsheet,
  Undo2,
  Redo2,
  Copy,
  ClipboardPaste,
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye,
  Layers,
  Shield,
  ShieldAlert,
  Clock,
  Droplets,
  Calendar,
  X,
  Check,
  Search,
  Filter,
  Users,
  Stethoscope,
  Info,
  Sliders,
  ChevronDown,
  Edit2,
  Trash2,
  Star,
} from 'lucide-react';
import {
  Schedule,
  Assignment,
  Nurse,
  Doctor,
  DoctorSession,
  LockEntry,
  LeaveEntry,
  LeaveType,
  DutyWindow,
  SeniorityLevel,
  ClinicalRole,
  Specialty,
  Rule,
  PublicHoliday,
  AssignmentKind,
  AssignmentSource,
  WorkingHoursPeriod,
  AvailabilityRequest,
} from '../../types';
import { ValidationReport, ValidationFinding } from '../../services/validation/ScheduleValidator';
import { calculateDutyDurationHours, summarizeNurseHours, NurseHoursSummary } from '../../services/reports/hoursAccounting';
import { formatDate } from '../../utils/dateUtils';
import { isExclusiveNurseClinic } from '../../services/engine/nurseClinicUtils';
import { applyPreferenceFocus } from '../../services/engine/preferenceOrder';
import { useDialogA11y } from '../common/useDialogA11y';
import { confirmDialog, notify } from '../common/dialogs';
import { coveredMinutes, doctorSessionsOn, nurseClinicRoleOf, toMinutes } from '../../services/engine/clinicModel';
import { isFloatShift } from '../../services/engine/floatShift';
import { QuickCellPopup, QuickWorkOption, QuickLeaveOption, QuickDayNote, QuickWish } from './grid/QuickCellPopup';
import { describeRequest, explainNurseDay, isPendingLeave, pendingLeaveOn, requestOn, RequestWords } from '../../services/engine/explainCell';

interface WorkbookGridProps {
  schedule: Schedule;
  workingHoursPeriods?: WorkingHoursPeriod[];
  assignments: Assignment[];
  nurses: Nurse[];
  doctors: Doctor[];
  sessions: DoctorSession[];
  locks: LockEntry[];
  leaveEntries: LeaveEntry[];
  leaveTypes: LeaveType[];
  dutyWindows: DutyWindow[];
  seniorityLevels: SeniorityLevel[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  holidays: PublicHoliday[];
  validationReport: ValidationReport;
  /** The roster rules, so "why is this cell empty" follows the same limits (defaults are used without them). */
  rules?: Rule[];
  /** Shifts from the roster just before this one (for rest and days in a row at the start). */
  priorAssignments?: Assignment[];
  currentBlockIndex: number;
  onBlockChange: (index: number) => void;
  onAssignmentsChange: (next: Assignment[]) => void;
  onLocksChange?: (next: LockEntry[]) => void;
  onLeaveEntriesChange?: (next: LeaveEntry[]) => void;
  /** One cell edit that changes shifts, pinned days and leave together (one save, one undo step). */
  onCellEdit?: (edit: { assignments: Assignment[]; locks: LockEntry[]; leaveEntries: LeaveEntry[] }) => void;
  onJumpToCell?: (nurseId: string, date: string) => void;
  onOpenLockOverrideModal?: (lock: LockEntry) => void;
  onNavigateTab?: (tab: 'roster' | 'doctors' | 'coverage' | 'warnings' | 'leave' | 'legend') => void;
  isAllDaysExpanded?: boolean;
  onToggleExpandDays?: () => void;
  isExpandedView?: boolean;
  onToggleExpandView?: () => void;
  /**
   * Go to a cell from outside the grid: select it, scroll it into view and flash it.
   * Change the nonce to ask again for the same cell. The page showing the grid makes
   * sure the right days are shown first; the grid waits a few frames for the cell.
   */
  focusRequest?: { nurseId: string; date: string; nonce: number };
  /** The nurses' requests for this roster (a day off or a shift), shown as small marks in the cells. */
  availabilityRequests?: AvailabilityRequest[];
}

/** Everything one cell edit needs, as the big editor collects it. */
interface CellChoice {
  category: 'DUTY' | 'LEAVE';
  dutyId: string;
  kind: AssignmentKind;
  targetRefId: string;
  note: string;
  leaveTypeId: string;
  /** false = kept (pinned) when the roster is filled again. */
  allowOverwrite: boolean;
  /** Hours this leave day counts ('' = the leave type's default). */
  leaveHours: string;
}

/** Hours rounded for reading: whole hours, or one decimal when needed. */
const fmtHours = (n: number): string => String(Math.round(n * 10) / 10);

/** A day as YYYY-MM-DD in the viewer's own time zone. */
const localTodayIso = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const cellKeyOf = (nurseId: string, date: string) => `${nurseId}|${date}`;

const SOURCE_WORDS: Record<string, string> = {
  GENERATED: 'Filled in by Fill roster',
  MANUAL: 'Changed by hand',
  LOCK: 'Pinned by hand',
};

/** A doctor's name with "Dr" in front, unless it already has it. */
const withDr = (name: string) => (/^dr\.?\s/i.test(name) ? name : `Dr ${name}`);

/** Problems about a whole day (not one nurse's shift), shown on the day's heading. */
const DAY_PROBLEM_IDS = /^(cov-gap-|h1-senior-|evening-tail-|holiday-|nc-coverage-|role-quota-|session-partial-|unassigned-session-)/;
const isDayProblem = (f: ValidationFinding) => DAY_PROBLEM_IDS.test(f.id);

const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WorkbookGrid: React.FC<WorkbookGridProps> = ({
  workingHoursPeriods = [],
  schedule,
  assignments,
  nurses,
  doctors,
  sessions,
  locks,
  leaveEntries,
  leaveTypes,
  dutyWindows,
  seniorityLevels,
  roles,
  specialties,
  holidays,
  validationReport,
  rules = [],
  priorAssignments = [],
  currentBlockIndex,
  onBlockChange,
  onAssignmentsChange,
  onLocksChange,
  onLeaveEntriesChange,
  onCellEdit,
  onOpenLockOverrideModal,
  onNavigateTab,
  isAllDaysExpanded = false,
  onToggleExpandDays,
  isExpandedView = false,
  onToggleExpandView,
  focusRequest,
  availabilityRequests = [],
}) => {
  // Navigation & Zoom (Supports 75% compact fit, 90%, 100%, 115%)
  const [zoomLevel, setZoomLevel] = useState<75 | 90 | 100 | 115>(100);
  const [groupBy, setGroupBy] = useState<'NONE' | 'SENIORITY'>('NONE');
  const [highlightViolations, setHighlightViolations] = useState(true);

  // Selection & Focus
  const [selectedCell, setSelectedCell] = useState<{ nurseId: string; date: string } | null>(null);
  // Cell briefly flashed after "Go to cell"
  const [flashCellKey, setFlashCellKey] = useState<string | null>(null);
  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  // Small popup next to a clicked cell (one tap choices)
  const [quickPopup, setQuickPopup] = useState<{ nurseId: string; date: string; focusOnOpen: boolean } | null>(null);

  // Inline Editor Popover
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTarget, setEditorTarget] = useState<{ nurseId: string; date: string } | null>(null);
  const [editorCategory, setEditorCategory] = useState<'DUTY' | 'LEAVE'>('DUTY');
  const [editorDutyId, setEditorDutyId] = useState<string>(dutyWindows[0]?.id || '');
  const [editorKind, setEditorKind] = useState<AssignmentKind>('DOCTOR');
  const [editorTargetRefId, setEditorTargetRefId] = useState<string>('');
  const [editorNote, setEditorNote] = useState<string>('');
  const [editorLeaveTypeId, setEditorLeaveTypeId] = useState<string>(leaveTypes[0]?.id || '');
  const [editorAllowOverwrite, setEditorAllowOverwrite] = useState<boolean>(false);
  // Hours this leave day counts for this nurse ('' = the leave type's default from Settings).
  const [editorLeaveHours, setEditorLeaveHours] = useState<string>('');

  // Right-Click Context Menu
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nurseId: string;
    date: string;
  } | null>(null);

  // Legend Drawer
  const [isLegendDrawerOpen, setIsLegendDrawerOpen] = useState(false);

  // Clipboard buffer
  const [clipboardAssignment, setClipboardAssignment] = useState<Assignment | null>(null);

  // Cell editor dialog: Esc, focus trap and focus restore
  const editorTitleId = useId();
  const editorDialogRef = useDialogA11y<HTMLDivElement>(isEditorOpen && !!editorTarget, () => setIsEditorOpen(false));

  // Latest roster data, read after an awaited confirmation so a clear never
  // writes back data that changed while the dialog was open.
  const latestDataRef = useRef({ assignments, locks, leaveEntries });
  latestDataRef.current = { assignments, locks, leaveEntries };

  // Compute Active Block Dates
  const start = new Date(schedule.startDate);
  const end = new Date(schedule.endDate);
  const totalDays =
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const blockSizeDays = schedule.blockWeeks * 7;
  const numBlocks = Math.ceil(totalDays / blockSizeDays);

  const blockStartDay = isAllDaysExpanded ? 1 : currentBlockIndex * blockSizeDays + 1;
  const blockEndDay = isAllDaysExpanded ? totalDays : Math.min((currentBlockIndex + 1) * blockSizeDays, totalDays);

  const blockDates: string[] = [];
  for (let day = blockStartDay; day <= blockEndDay; day++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + (day - 1));
    blockDates.push(d.toISOString().split('T')[0]);
  }

  // Day columns: weekend (clinic setting), public holiday and today
  const todayIso = localTodayIso();
  const holidayByDate = new Map(holidays.map((h) => [h.date, h]));
  const dayInfo = blockDates.map((dateStr) => {
    const dateObj = new Date(dateStr);
    const weekday = dateObj.getUTCDay();
    return {
      dateStr,
      day: dateObj.getUTCDate(),
      weekday,
      isWeekend: isWeekendDay(weekday),
      holiday: holidayByDate.get(dateStr),
      isToday: dateStr === todayIso,
    };
  });

  // Lookup maps
  const dutyMap = useMemo(() => new Map(dutyWindows.map((d) => [d.id, d])), [dutyWindows]);
  const nurseMap = new Map(nurses.map((n) => [n.id, n]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d]));
  const specialtyMap = new Map(specialties.map((s) => [s.id, s]));
  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const seniorityMap = new Map(seniorityLevels.map((s) => [s.id, s]));

  // Problems from the roster check, by where they show on the grid:
  //  - about one cell (a shift on leave, too little rest...): a red corner on that cell;
  //  - about a whole day (no free nurse, no senior nurse, a doctor with no nurse...):
  //    a badge on that day's heading, not a mark on every shift of the day;
  //  - about a nurse (hours, no email): a mark by the nurse's name.
  const cellViolationMessages = new Map<string, string[]>();
  const dayProblems = new Map<string, { messages: string[]; mustFix: boolean }>();
  const nurseProblems = new Map<string, { messages: string[]; mustFix: boolean }>();
  const addTo = (map: Map<string, { messages: string[]; mustFix: boolean }>, key: string, f: ValidationFinding) => {
    const entry = map.get(key) || { messages: [], mustFix: false };
    if (!entry.messages.includes(f.message)) entry.messages.push(f.message);
    entry.mustFix = entry.mustFix || f.severity === 'ERROR';
    map.set(key, entry);
  };
  validationReport.findings.forEach((f) => {
    // Notes (requests not followed, leave waiting for approval) have their own marks, not the red one.
    if (f.severity === 'INFO') return;
    if (isDayProblem(f)) {
      const date = f.date || f.id.match(/\d{4}-\d{2}-\d{2}/)?.[0];
      if (date) addTo(dayProblems, date, f);
      return;
    }
    if (f.cellRefs.length === 0) {
      f.affectedNurseIds.forEach((id) => addTo(nurseProblems, id, f));
      return;
    }
    f.cellRefs.forEach((r) => {
      const k = `${r.nurseId}_${r.date}`;
      const list = cellViolationMessages.get(k) || [];
      if (!list.includes(f.message)) list.push(f.message);
      cellViolationMessages.set(k, list);
    });
  });
  // How many problems the marks show on the days on screen (for the switch's label).
  const shownDates = new Set(blockDates);
  const shownProblemCount = validationReport.findings.filter(
    (f) =>
      f.severity !== 'INFO' &&
      (isDayProblem(f)
        ? shownDates.has(f.date || f.id.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '')
        : f.cellRefs.length === 0
        ? f.affectedNurseIds.length > 0
        : f.cellRefs.some((r) => shownDates.has(r.date)))
  ).length;

  // Group nurses if requested
  // The selected cell may be on days not shown now (after paging); then the first cell takes Tab.
  const selectedCellShown =
    !!selectedCell && blockDates.includes(selectedCell.date) && nurses.some((n) => n.id === selectedCell.nurseId);
  const displayNurses = [...nurses].sort((a, b) => {
    if (groupBy === 'SENIORITY') {
      const rankA = seniorityMap.get(a.seniorityLevelId)?.rank || 99;
      const rankB = seniorityMap.get(b.seniorityLevelId)?.rank || 99;
      if (rankA !== rankB) return rankA - rankB;
    }
    return a.fullName.localeCompare(b.fullName);
  });

  // Hours per nurse, counted by the shared rule (same as the Hours tab, emails and PDF).
  const leaveTypeMap = useMemo(() => new Map(leaveTypes.map((l) => [l.id, l])), [leaveTypes]);
  const hoursByNurse = useMemo(() => {
    const map = new Map<string, NurseHoursSummary>();
    for (const n of nurses) {
      map.set(n.id, summarizeNurseHours(n, schedule, assignments, dutyMap, leaveEntries, leaveTypeMap, workingHoursPeriods));
    }
    return map;
  }, [nurses, schedule, assignments, dutyMap, leaveEntries, leaveTypeMap, workingHoursPeriods]);

  const getNurseHoursProgress = (nurse: Nurse) => {
    const h = hoursByNurse.get(nurse.id)!;
    return { totalHours: h.totalHours, targetHours: h.targetHours, percent: h.percent, dutyHours: h.dutyHours, leaveHours: h.leaveHours };
  };

  // Hours inside the page of days shown
  const blockStart = blockDates[0];
  const blockEnd = blockDates[blockDates.length - 1];
  const blockHoursByNurse = useMemo(() => {
    const map = new Map<string, NurseHoursSummary>();
    if (!blockStart || !blockEnd) return map;
    for (const n of nurses) {
      map.set(
        n.id,
        summarizeNurseHours(n, schedule, assignments, dutyMap, leaveEntries, leaveTypeMap, workingHoursPeriods, {
          start: blockStart,
          end: blockEnd,
        })
      );
    }
    return map;
  }, [nurses, schedule, assignments, dutyMap, leaveEntries, leaveTypeMap, workingHoursPeriods, blockStart, blockEnd]);

  // Per cell lookups, keyed `${nurseId}_${date}`, so each cell does not scan every list.
  const rosterStart = schedule.startDate;
  const rosterEnd = schedule.endDate;
  const inRosterDates = (date: string) => date >= rosterStart && date <= rosterEnd;
  const assignmentByCell = useMemo(() => {
    const map = new Map<string, Assignment>();
    for (const a of assignments) {
      const k = `${a.nurseId}_${a.date}`;
      if (!map.has(k)) map.set(k, a);
    }
    return map;
  }, [assignments]);
  const lockByCell = useMemo(() => {
    const map = new Map<string, LockEntry>();
    for (const l of locks) {
      const k = `${l.nurseId}_${l.date}`;
      if (!map.has(k)) map.set(k, l);
    }
    return map;
  }, [locks]);
  /** Approved and waiting leave on each day of this roster (the first entry in the list wins, as with find). */
  const leaveByCell = useMemo(() => {
    const approved = new Map<string, LeaveEntry>();
    const pending = new Map<string, LeaveEntry>();
    for (const le of leaveEntries) {
      const isApproved = !!le.approved;
      const waiting = isPendingLeave(le);
      if (!isApproved && !waiting) continue;
      const from = le.startDate > rosterStart ? le.startDate : rosterStart;
      const to = le.endDate < rosterEnd ? le.endDate : rosterEnd;
      for (let day = from, i = 0; day <= to && i < 400; i++) {
        const k = `${le.nurseId}_${day}`;
        if (isApproved && !approved.has(k)) approved.set(k, le);
        if (waiting && !pending.has(k)) pending.set(k, le);
        const [y, m, d] = day.split('-').map(Number);
        day = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
      }
    }
    return { approved, pending };
  }, [leaveEntries, rosterStart, rosterEnd]);
  /** Requests on this roster's dates that still count (refused ones are left out). */
  const requestsByCell = useMemo(() => {
    const map = new Map<string, AvailabilityRequest[]>();
    for (const r of availabilityRequests) {
      if (r.status === 'REJECTED' || !inRosterDates(r.date)) continue;
      const k = `${r.nurseId}_${r.date}`;
      const list = map.get(k);
      if (list) list.push(r);
      else map.set(k, [r]);
    }
    return map;
  }, [availabilityRequests, rosterStart, rosterEnd]);
  const assignmentOn = (nurseId: string, date: string) => assignmentByCell.get(`${nurseId}_${date}`);
  const lockOn = (nurseId: string, date: string) => lockByCell.get(`${nurseId}_${date}`);
  const approvedLeaveOn = (nurseId: string, date: string) =>
    inRosterDates(date)
      ? leaveByCell.approved.get(`${nurseId}_${date}`)
      : leaveEntries.find((le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate);
  const waitingLeaveOn = (nurseId: string, date: string) =>
    inRosterDates(date) ? leaveByCell.pending.get(`${nurseId}_${date}`) : pendingLeaveOn(leaveEntries, nurseId, date);
  const cellRequestOn = (nurseId: string, date: string) =>
    requestOn(inRosterDates(date) ? requestsByCell.get(`${nurseId}_${date}`) : availabilityRequests, nurseId, date);

  const getNurseBlockHours = (nurse: Nurse) => {
    const h = blockHoursByNurse.get(nurse.id);
    return { blockTotal: h?.totalHours ?? 0, bDuty: h?.dutyHours ?? 0, bLeave: h?.leaveHours ?? 0 };
  };

  // Day totals under the grid: doctors in session, nurses on duty, hours without a free nurse, senior on duty.
  const dayTotals = useMemo(() => {
    const seniorIds = new Set(seniorityLevels.filter((s) => s.isSenior).map((s) => s.id));
    const levelById = new Map(nurses.map((n) => [n.id, n.seniorityLevelId]));
    return new Map(
      blockDates.map((date) => {
        const onDuty = new Set(assignments.filter((a) => a.date === date).map((a) => a.nurseId));
        const hours = validationReport.hourlyCoverageMap?.[date];
        return [
          date,
          {
            doctors: doctorSessionsOn(sessions, date).length,
            nurses: onDuty.size,
            gapHours: hours ? Object.values(hours).filter((h) => h.deficit > 0).length : undefined,
            hasSenior: seniorIds.size === 0 ? undefined : [...onDuty].some((id) => seniorIds.has(levelById.get(id) || '')),
          },
        ] as const;
      })
    );
  }, [blockDates.join(','), assignments, sessions, nurses, seniorityLevels, validationReport]);

  // What the big editor starts with for a cell (also the base of every one tap choice)
  const computeEditorDefaults = (nurseId: string, date: string): CellChoice => {
    const existingLock = locks.find((l) => l.nurseId === nurseId && l.date === date);
    const existingLeave = leaveEntries.find(
      (le) => le.nurseId === nurseId && date >= le.startDate && date <= le.endDate
    );
    const existingAsgn = assignments.find((a) => a.nurseId === nurseId && a.date === date);

    const ownHours = existingLeave?.dayHours?.[date];
    const leaveHours = typeof ownHours === 'number' ? String(ownHours) : '';
    if (existingLeave) {
      return {
        category: 'LEAVE',
        leaveTypeId: existingLeave.leaveTypeId,
        allowOverwrite: !existingLock,
        note: existingLeave.note || '',
        dutyId: dutyWindows[0]?.id || '',
        kind: 'DOCTOR',
        targetRefId: doctors[0]?.id || '',
        leaveHours,
      };
    }
    if (existingLock?.mode === 'OFF') {
      return {
        category: 'LEAVE',
        leaveTypeId: leaveTypes.find((l) => l.acronym === 'RO')?.id || leaveTypes[0]?.id || '',
        allowOverwrite: false,
        note: existingLock.note || 'Pinned day off',
        dutyId: dutyWindows[0]?.id || '',
        kind: 'DOCTOR',
        targetRefId: doctors[0]?.id || '',
        leaveHours,
      };
    }
    if (existingAsgn) {
      return {
        category: 'DUTY',
        dutyId: existingAsgn.dutyWindowId,
        kind: existingAsgn.kind,
        targetRefId: existingAsgn.doctorId || existingAsgn.clinicalRoleId || existingAsgn.specialtyId || '',
        note: existingAsgn.note || '',
        allowOverwrite: !existingAsgn.locked && existingAsgn.source !== 'LOCK' && !existingLock,
        leaveTypeId: leaveTypes.find((l) => l.acronym === 'BL')?.id || leaveTypes[0]?.id || '',
        leaveHours,
      };
    }
    // Empty cell
    const targetNurse = nurseMap.get(nurseId);
    const isTargetExclusiveNC = targetNurse ? isExclusiveNurseClinic(targetNurse, roles) : false;
    const ncRole = nurseClinicRoleOf(roles);
    return {
      category: 'DUTY',
      dutyId: dutyWindows[0]?.id || '',
      kind: isTargetExclusiveNC ? 'CLINICAL_ROLE' : 'DOCTOR',
      targetRefId: isTargetExclusiveNC ? ncRole?.id || roles[0]?.id || '' : doctors[0]?.id || '',
      note: isTargetExclusiveNC ? 'Nurse Clinic only (not with a doctor)' : '',
      allowOverwrite: false, // Default to kept (pinned)
      leaveTypeId: leaveTypes.find((l) => l.acronym === 'BL')?.id || leaveTypes[0]?.id || '',
      leaveHours,
    };
  };

  // Open the big Cell Editor for Duty Shift or Leave
  const openCellEditor = (nurseId: string, date: string) => {
    setSelectedCell({ nurseId, date });
    setContextMenu(null);
    setQuickPopup(null);
    setEditorTarget({ nurseId, date });

    const d = computeEditorDefaults(nurseId, date);
    setEditorCategory(d.category);
    setEditorDutyId(d.dutyId);
    setEditorKind(d.kind);
    setEditorTargetRefId(d.targetRefId);
    setEditorNote(d.note);
    setEditorLeaveTypeId(d.leaveTypeId);
    setEditorAllowOverwrite(d.allowOverwrite);
    setEditorLeaveHours(d.leaveHours);

    setIsEditorOpen(true);
  };

  // Cell Click / Navigation: a click selects the cell and opens the small popup
  const openQuickPopup = (nurseId: string, date: string, focusOnOpen = false) => {
    setSelectedCell({ nurseId, date });
    setContextMenu(null);
    setQuickPopup({ nurseId, date, focusOnOpen });
  };

  const handleCellClick = (nurseId: string, date: string) => {
    openQuickPopup(nurseId, date);
  };

  const handleCellDoubleClick = (nurseId: string, date: string) => {
    openCellEditor(nurseId, date);
  };

  // The popup belongs to one cell: moving the selection away closes it.
  useEffect(() => {
    if (quickPopup && (selectedCell?.nurseId !== quickPopup.nurseId || selectedCell?.date !== quickPopup.date)) {
      setQuickPopup(null);
    }
  }, [selectedCell, quickPopup]);

  // Keyboard focus follows the selection while it is in the grid (arrow keys).
  useEffect(() => {
    if (!selectedCell) return;
    const active = document.activeElement as HTMLElement | null;
    if (!active || !tableRef.current?.contains(active) || !active.dataset.cell) return;
    const key = cellKeyOf(selectedCell.nurseId, selectedCell.date);
    if (active.dataset.cell === key) return;
    const cell = findCellElement(key);
    if (cell) {
      cell.focus({ preventScroll: true });
      cell.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [selectedCell]);

  const findCellElement = (key: string): HTMLElement | null => {
    const root = tableRef.current;
    if (!root) return null;
    const sel = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(key) : key.replace(/"/g, '\\"');
    return root.querySelector<HTMLElement>(`[data-cell="${sel}"]`);
  };

  // "Go to cell" from outside: select, scroll to the middle, focus and flash.
  useEffect(() => {
    if (!focusRequest) return;
    const { nurseId, date } = focusRequest;
    const key = cellKeyOf(nurseId, date);
    setSelectedCell({ nurseId, date });
    setQuickPopup(null);
    setContextMenu(null);

    let tries = 0;
    let frame = 0;
    let flashTimer: ReturnType<typeof setTimeout> | undefined;
    const attempt = () => {
      const cell = findCellElement(key);
      const box = gridScrollRef.current;
      if (!cell || !box) {
        // The days may still be changing: try again on the next frames.
        if (tries++ < 10) frame = requestAnimationFrame(attempt);
        return;
      }
      // Centre the cell in the part of the grid not covered by the sticky name column and headers.
      const boxRect = box.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();
      const stickyLeft = (tableRef.current?.querySelector('tbody th') as HTMLElement | null)?.offsetWidth || 0;
      const stickyTop = (tableRef.current?.querySelector('thead') as HTMLElement | null)?.offsetHeight || 0;
      const visibleW = boxRect.width - stickyLeft;
      const stickyBottom = (tableRef.current?.querySelector('tfoot') as HTMLElement | null)?.offsetHeight || 0;
      const visibleH = boxRect.height - stickyTop - stickyBottom;
      box.scrollTo({
        left: box.scrollLeft + (cellRect.left - boxRect.left - stickyLeft) - (visibleW - cellRect.width) / 2,
        top: box.scrollTop + (cellRect.top - boxRect.top - stickyTop) - (visibleH - cellRect.height) / 2,
        behavior: 'smooth',
      });
      cell.focus({ preventScroll: true });
      setFlashCellKey(key);
      flashTimer = setTimeout(() => setFlashCellKey((k) => (k === key ? null : k)), 1500);
    };
    frame = requestAnimationFrame(attempt);
    return () => {
      cancelAnimationFrame(frame);
      if (flashTimer) clearTimeout(flashTimer);
    };
    // Only a new request (nonce) starts this.
  }, [focusRequest?.nonce]);

  // Keyboard navigation (Arrows, Enter, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditorOpen) return;
      if (!selectedCell) return;
      // A dialog (e.g. the clear cell confirmation) is open: its keys are its own.
      if (document.querySelector('[aria-modal="true"]')) return;

      // Never take over keys while the user is typing somewhere else (search boxes,
      // other sheets, dialogs) or while a button or link has keyboard focus.
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      // Tab from the cell with the popup open goes into the popup.
      if (e.key === 'Tab' && !e.shiftKey && quickPopup && target?.dataset?.cell) {
        const first = document.querySelector<HTMLElement>('[data-quick-popup] button');
        if (first) {
          e.preventDefault();
          first.focus();
          return;
        }
      }
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable ||
        (e.key === 'Tab' && target && target !== document.body) ||
        // Enter, Space and Delete on a focused button or link belong to it, not to the grid.
        (target && target !== document.body && !!target.closest('button, a[href], [role="button"]'))
      ) {
        return;
      }

      const currentNurseIndex = displayNurses.findIndex((n) => n.id === selectedCell.nurseId);
      const currentDateIndex = blockDates.indexOf(selectedCell.date);

      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        if (currentDateIndex > 0) {
          setSelectedCell({
            nurseId: selectedCell.nurseId,
            date: blockDates[currentDateIndex - 1],
          });
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault();
        if (currentDateIndex < blockDates.length - 1) {
          setSelectedCell({
            nurseId: selectedCell.nurseId,
            date: blockDates[currentDateIndex + 1],
          });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentDateIndex > 0) {
          setSelectedCell({
            nurseId: selectedCell.nurseId,
            date: blockDates[currentDateIndex - 1],
          });
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentNurseIndex < displayNurses.length - 1) {
          setSelectedCell({
            nurseId: displayNurses[currentNurseIndex + 1].id,
            date: selectedCell.date,
          });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentNurseIndex > 0) {
          setSelectedCell({
            nurseId: displayNurses[currentNurseIndex - 1].id,
            date: selectedCell.date,
          });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCellDoubleClick(selectedCell.nurseId, selectedCell.date);
      } else if (e.key === ' ') {
        // Space opens the small popup with its quick choices.
        e.preventDefault();
        openQuickPopup(selectedCell.nurseId, selectedCell.date, true);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteCellAssignment(selectedCell.nurseId, selectedCell.date);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const asgn = assignments.find(
          (a) => a.nurseId === selectedCell.nurseId && a.date === selectedCell.date
        );
        if (asgn) setClipboardAssignment(asgn);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (clipboardAssignment) {
          handlePasteAssignment(selectedCell.nurseId, selectedCell.date);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isEditorOpen, displayNurses, blockDates, assignments, clipboardAssignment, quickPopup]);

  // Context Menu
  const handleContextMenu = (e: React.MouseEvent, nurseId: string, date: string) => {
    e.preventDefault();
    setSelectedCell({ nurseId, date });
    setQuickPopup(null);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nurseId,
      date,
    });
  };

  // Helper to add days to ISO date string (YYYY-MM-DD)
  const addDaysToIso = (dateStr: string, days: number): string => {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
  };

  // Helper to count days between two ISO date strings (inclusive)
  const countDaysBetween = (startStr: string, endStr: string): number => {
    const s = new Date(startStr + 'T00:00:00Z').getTime();
    const e = new Date(endStr + 'T00:00:00Z').getTime();
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
  };

  /**
   * Safely removes only the targeted date for a nurse from leave entries.
   * If a leave entry spans multiple days (e.g. 5 days of Annual Leave),
   * only the selected day is removed (by advancing startDate, regressing endDate,
   * or splitting into two valid entries), strictly preserving all other days.
   */
  const removeDateFromLeaves = (
    entries: LeaveEntry[],
    nurseId: string,
    targetDate: string
  ): LeaveEntry[] => {
    const result: LeaveEntry[] = [];

    for (const entry of entries) {
      // Only approved leave is shown in the grid, so only approved leave is changed here.
      // Pending and rejected requests are left for the manager to decide.
      if (
        !entry.approved ||
        entry.nurseId !== nurseId ||
        targetDate < entry.startDate ||
        targetDate > entry.endDate
      ) {
        result.push(entry);
        continue;
      }

      // Target date matches this nurse and this leave entry
      // Case 1: Single day leave: only this one selected entry is removed
      if (entry.startDate === entry.endDate) {
        continue;
      }

      // Case 2: Multi-day span: shrink or split, preserving all other days of the leave
      const totalSpanDays = countDaysBetween(entry.startDate, entry.endDate);
      const hoursPerDay = entry.hoursCredited ? entry.hoursCredited / totalSpanDays : 8;

      if (entry.startDate === targetDate) {
        // Remove only the first day of the span
        const newStart = addDaysToIso(entry.startDate, 1);
        const remainingDays = countDaysBetween(newStart, entry.endDate);
        result.push({
          ...entry,
          startDate: newStart,
          hoursCredited: Math.round(remainingDays * hoursPerDay * 100) / 100,
        });
      } else if (entry.endDate === targetDate) {
        // Remove only the last day of the span
        const newEnd = addDaysToIso(entry.endDate, -1);
        const remainingDays = countDaysBetween(entry.startDate, newEnd);
        result.push({
          ...entry,
          endDate: newEnd,
          hoursCredited: Math.round(remainingDays * hoursPerDay * 100) / 100,
        });
      } else {
        // Target is in the middle: split into two separate valid leave entries
        const end1 = addDaysToIso(targetDate, -1);
        const days1 = countDaysBetween(entry.startDate, end1);
        result.push({
          ...entry,
          id: `${entry.id}-p1-${Date.now()}`,
          startDate: entry.startDate,
          endDate: end1,
          hoursCredited: Math.round(days1 * hoursPerDay * 100) / 100,
        });

        const start2 = addDaysToIso(targetDate, 1);
        const days2 = countDaysBetween(start2, entry.endDate);
        result.push({
          ...entry,
          id: `${entry.id}-p2-${Date.now()}`,
          startDate: start2,
          endDate: entry.endDate,
          hoursCredited: Math.round(days2 * hoursPerDay * 100) / 100,
        });
      }
    }

    return result;
  };

  /** Sends one cell edit up (as a single change when the page supports it). */
  const emitCellEdit = (nextAssignments: Assignment[], nextLocks: LockEntry[], nextLeaves: LeaveEntry[]) => {
    if (onCellEdit) {
      onCellEdit({ assignments: nextAssignments, locks: nextLocks, leaveEntries: nextLeaves });
      return;
    }
    onAssignmentsChange(nextAssignments);
    if (onLocksChange) onLocksChange(nextLocks);
    if (onLeaveEntriesChange) onLeaveEntriesChange(nextLeaves);
  };

  /**
   * Saves one choice for one cell (Duty Shift or Leave). The big editor and the
   * popup's one tap choices both save through here. Returns false when nothing was saved.
   */
  const saveCellChoice = async (
    target: { nurseId: string; date: string },
    choice: CellChoice
  ): Promise<boolean> => {
    const { nurseId, date } = target;
    const {
      category: editorCategory,
      dutyId: editorDutyId,
      kind: editorKind,
      targetRefId: editorTargetRefId,
      note: editorNote,
      leaveTypeId: editorLeaveTypeId,
      allowOverwrite: editorAllowOverwrite,
      leaveHours: editorLeaveHours,
    } = choice;
    // Replacing a pinned day is confirmed, as clearing one is.
    if (locks.some((l) => l.nurseId === nurseId && l.date === date)) {
      const ok = await confirmDialog({
        title: 'Replace a pinned day?',
        message: 'This day is pinned. Saving replaces what is pinned with your new choice.',
        confirmLabel: 'Replace',
      });
      if (!ok) return false;
    }
    // Latest data, in case it changed while the confirmation was open.
    const { assignments, locks: currentLocks, leaveEntries } = latestDataRef.current;

    const nextAssignments = assignments.filter((a) => !(a.nurseId === nurseId && a.date === date));
    const nextLocks = currentLocks.filter((l) => !(l.nurseId === nurseId && l.date === date));
    let nextLeaves = removeDateFromLeaves(leaveEntries, nurseId, date);

    if (editorCategory === 'DUTY') {
      const isLocked = !editorAllowOverwrite;

      const newAssignment: Assignment = {
        id: `asgn-manual-${nurseId}-${date}-${Date.now()}`,
        scheduleId: schedule.id,
        nurseId,
        date,
        dutyWindowId: editorDutyId,
        kind: editorKind,
        doctorId: editorKind === 'DOCTOR' ? editorTargetRefId : undefined,
        clinicalRoleId: editorKind === 'CLINICAL_ROLE' ? editorTargetRefId : undefined,
        specialtyId: editorKind === 'SPECIALTY' ? editorTargetRefId : undefined,
        locked: isLocked,
        source: isLocked ? 'LOCK' : 'MANUAL',
        note: editorNote.trim() || (isLocked ? 'Pinned duty shift' : undefined),
      };
      nextAssignments.push(newAssignment);

      if (isLocked) {
        const newLock: LockEntry = {
          id: `lock-${nurseId}-${date}-${Date.now()}`,
          nurseId,
          date,
          mode: 'ASSIGNMENT',
          dutyWindowId: editorDutyId,
          assignmentKind: editorKind,
          targetRefId: editorTargetRefId,
          note: editorNote.trim() || 'Pinned duty assignment',
          createdAt: new Date().toISOString(),
        };
        nextLocks.push(newLock);
      }
    } else {
      // LEAVE / DAY OFF
      const lt = leaveTypes.find((l) => l.id === editorLeaveTypeId) || leaveTypes[0];
      const isProtected = !editorAllowOverwrite;
      const defaultHours = typeof lt?.creditedHours === 'number' ? lt.creditedHours : 8;
      const typed = editorLeaveHours.trim();
      const ownHours = typed === '' ? undefined : Number(typed);
      if (ownHours !== undefined && (!Number.isFinite(ownHours) || ownHours < 0 || ownHours > 24)) {
        notify('Hours for this day must be a number from 0 to 24.', 'warning');
        return false;
      }
      const dayHoursOverride = ownHours !== undefined && ownHours !== defaultHours ? ownHours : undefined;
      const creditedHours = dayHoursOverride ?? defaultHours;
      const withDay = (entry: LeaveEntry): LeaveEntry => {
        const rest = { ...(entry.dayHours || {}) };
        delete rest[date];
        const dayHours = dayHoursOverride !== undefined ? { ...rest, [date]: dayHoursOverride } : rest;
        const { dayHours: _old, ...base } = entry;
        return Object.keys(dayHours).length > 0 ? { ...base, dayHours } : base;
      };

      // Same leave already on this day: only its hours (and note) change, the leave isn't split.
      const sameLeave = leaveEntries.find(
        (le) => le.nurseId === nurseId && le.approved && le.leaveTypeId === lt?.id && date >= le.startDate && date <= le.endDate
      );
      if (sameLeave) {
        nextLeaves = leaveEntries.map((le) =>
          le.id === sameLeave.id ? withDay({ ...le, note: editorNote.trim() || undefined }) : le
        );
        if (isProtected) {
          nextLocks.push({
            id: `lock-${nurseId}-${date}-${Date.now()}`,
            nurseId,
            date,
            mode: 'OFF',
            note: `Pinned ${lt?.name || 'Leave'}`,
            createdAt: new Date().toISOString(),
          });
        }
        emitCellEdit(nextAssignments, nextLocks, nextLeaves);
        return true;
      }

      // Leave a planner enters is always approved (it is shown and counted, and the
      // generator never puts a shift on it). Pinning also adds a day off lock, which
      // keeps the day off even if the leave is later removed.
      const newLeave: LeaveEntry = {
        id: `leave-${nurseId}-${date}-${Date.now()}`,
        nurseId,
        leaveTypeId: lt ? lt.id : 'leave-ro',
        startDate: date,
        endDate: date,
        approved: true,
        status: 'APPROVED',
        hoursCredited: creditedHours,
        note: editorNote.trim() || undefined,
        ...(dayHoursOverride !== undefined ? { dayHours: { [date]: dayHoursOverride } } : {}),
      };
      nextLeaves.push(newLeave);

      if (isProtected) {
        const newLock: LockEntry = {
          id: `lock-${nurseId}-${date}-${Date.now()}`,
          nurseId,
          date,
          mode: 'OFF',
          note: `Pinned ${lt?.name || 'Leave'}`,
          createdAt: new Date().toISOString(),
        };
        nextLocks.push(newLock);
      }
    }

    emitCellEdit(nextAssignments, nextLocks, nextLeaves);
    return true;
  };

  // Big editor Save
  const handleSaveEditorAssignment = async () => {
    if (!editorTarget) return;
    const saved = await saveCellChoice(editorTarget, {
      category: editorCategory,
      dutyId: editorDutyId,
      kind: editorKind,
      targetRefId: editorTargetRefId,
      note: editorNote,
      leaveTypeId: editorLeaveTypeId,
      allowOverwrite: editorAllowOverwrite,
      leaveHours: editorLeaveHours,
    });
    if (saved) setIsEditorOpen(false);
  };

  const handleDeleteCellAssignment = async (nurseId: string, date: string) => {
    // Clearing a pinned shift or approved leave needs a confirmation
    const hasLock = locks.some((l) => l.nurseId === nurseId && l.date === date);
    const hasApprovedLeave = leaveEntries.some(
      (le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate
    );
    if (hasLock || hasApprovedLeave) {
      const what = hasLock && hasApprovedLeave ? 'a pinned day and approved leave' : hasLock ? 'a pinned day' : 'approved leave';
      const ok = await confirmDialog({
        title: 'Clear this cell?',
        message: `This day has ${what}. Clear it anyway?`,
        confirmLabel: 'Clear cell',
        danger: true,
      });
      if (!ok) return;
    }
    const latest = latestDataRef.current;
    const nextAssignments = latest.assignments.filter((a) => !(a.nurseId === nurseId && a.date === date));
    const nextLocks = latest.locks.filter((l) => !(l.nurseId === nurseId && l.date === date));
    // Remove ONLY the selected date from leave entries, preserving all other days/leaves
    const nextLeaves = removeDateFromLeaves(latest.leaveEntries, nurseId, date);

    emitCellEdit(nextAssignments, nextLocks, nextLeaves);

    setIsEditorOpen(false);
  };

  const handlePasteAssignment = (nurseId: string, date: string) => {
    if (!clipboardAssignment) return;
    const isLocked = locks.some((l) => l.nurseId === nurseId && l.date === date);
    if (isLocked) return;
    const onLeave = leaveEntries.some(
      (le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate
    );
    if (onLeave) return;

    const filtered = assignments.filter((a) => !(a.nurseId === nurseId && a.date === date));
    const pasted: Assignment = {
      ...clipboardAssignment,
      id: `asgn-manual-${nurseId}-${date}-${Date.now()}`,
      nurseId,
      date,
      // A pasted copy is never pinned: pins come with a lock entry
      locked: false,
      source: 'MANUAL',
    };
    onAssignmentsChange([...filtered, pasted]);
  };

  /** True when a nurse's specialty preference points at one of these specialties (by id, code or name). */
  const specialtyPrefMatches = (refId: string, specialtyIds: string[]): boolean => {
    if (specialtyIds.includes(refId)) return true;
    const ref = refId.toLowerCase();
    return specialtyIds.some((sid) => {
      const sp = specialtyMap.get(sid);
      if (!sp) return false;
      const code = sp.code.toLowerCase();
      return (
        ref === code ||
        ref === sp.name.toLowerCase() ||
        (code === 'pcc' && ref.includes('pcc')) ||
        (code === 'ped' && (ref.includes('ped') || ref.includes('pedia')))
      );
    });
  };

  /** The shift that covers most of [start, end), keeping the current one when it covers as much. */
  const bestDutyFor = (start: string | undefined, end: string | undefined, currentDutyId?: string): DutyWindow | undefined => {
    const active = dutyWindows.filter((d) => d.active !== false);
    const pool = active.length > 0 ? active : dutyWindows;
    if (!start || !end) return pool.find((d) => d.id === currentDutyId) || pool[0];
    const len = (d: DutyWindow) => toMinutes(d.endTime) - toMinutes(d.startTime);
    const ranked = [...pool].sort(
      (a, b) =>
        coveredMinutes(b, start, end) - coveredMinutes(a, start, end) ||
        Number(b.id === currentDutyId) - Number(a.id === currentDutyId) ||
        len(a) - len(b) ||
        Number(!!b.isPriority) - Number(!!a.isPriority)
    );
    return ranked[0] && coveredMinutes(ranked[0], start, end) > 0 ? ranked[0] : pool.find((d) => d.id === currentDutyId) || pool[0];
  };

  /** Closes the popup and puts keyboard focus back on its cell (after a choice in the popup). */
  const closePopupToCell = () => {
    if (quickPopup) findCellElement(cellKeyOf(quickPopup.nurseId, quickPopup.date))?.focus({ preventScroll: true });
    setQuickPopup(null);
  };

  // The popup's one tap choices for a cell. Each makes the same change the big
  // editor would make for that choice (same defaults, same save).
  const buildQuickOptions = (nurseId: string, date: string) => {
    const nurse = nurseMap.get(nurseId);
    const base = computeEditorDefaults(nurseId, date);
    const asgn = assignments.find((a) => a.nurseId === nurseId && a.date === date);
    const leave = leaveEntries.find(
      (le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate
    );
    const target = { nurseId, date };
    const pick = (choice: Partial<CellChoice>) => () => {
      closePopupToCell();
      // A quick choice is a hand change, not a pinned day (pinning is in More options),
      // so a wrong tap can be changed with another tap.
      void saveCellChoice(target, { ...base, note: '', leaveHours: '', allowOverwrite: true, ...choice });
    };
    const shiftWords = (d?: DutyWindow) => (d ? `${d.acronym} shift ${d.startTime} to ${d.endTime}` : '');

    const work: QuickWorkOption[] = [];
    const exclusiveNC = nurse ? isExclusiveNurseClinic(nurse, roles) : false;

    // Doctors in session that day in the nurse's own order (her doctors and departments
    // as her list and her "which comes first" setting rank them, like the generator), then the rest.
    if (!exclusiveNC) {
      const prefs = nurse ? applyPreferenceFocus(nurse).preferences || [] : [];
      const docRankOf = (s: DoctorSession) => prefs.find((p) => p.kind === 'DOCTOR' && p.refId === s.doctorId)?.rank ?? Infinity;
      const specRankOf = (s: DoctorSession) => {
        const specIds = [s.specialtyId, ...(doctorMap.get(s.doctorId)?.specialtyIds || [])].filter(Boolean);
        return Math.min(Infinity, ...prefs.filter((p) => p.kind === 'SPECIALTY' && specialtyPrefMatches(p.refId, specIds)).map((p) => p.rank));
      };
      const rankOf = (s: DoctorSession) => Math.min(docRankOf(s), specRankOf(s));
      const daySessions = doctorSessionsOn(sessions, date)
        .filter((s) => doctorMap.has(s.doctorId))
        .sort((a, b) => rankOf(a) - rankOf(b) || a.startTime.localeCompare(b.startTime));
      for (const sess of daySessions.slice(0, 8)) {
        const doc = doctorMap.get(sess.doctorId)!;
        const duty = bestDutyFor(sess.startTime, sess.endTime, asgn?.dutyWindowId);
        work.push({
          key: `doc-${sess.doctorId}`,
          label: doc.fullName,
          detail: `${sess.startTime} to ${sess.endTime}${duty ? ` · ${shiftWords(duty)}` : ''}`,
          tag: docRankOf(sess) < Infinity ? 'Usual' : specRankOf(sess) < Infinity ? 'Usual department' : undefined,
          current: asgn?.kind === 'DOCTOR' && asgn.doctorId === sess.doctorId,
          onSelect: pick({ category: 'DUTY', kind: 'DOCTOR', targetRefId: sess.doctorId, dutyId: duty?.id || base.dutyId }),
        });
      }
    }

    // Nurse Clinic first, then the other clinic tasks.
    const nc = nurseClinicRoleOf(roles);
    const orderedRoles = nc ? [nc, ...roles.filter((r) => r.id !== nc.id)] : roles;
    for (const role of orderedRoles) {
      const duty = asgn ? dutyMap.get(asgn.dutyWindowId) : bestDutyFor(role.defaultStartTime, role.defaultEndTime);
      work.push({
        key: `role-${role.id}`,
        label: role.id === nc?.id ? 'Nurse Clinic' : role.name,
        detail: shiftWords(duty || dutyMap.get(base.dutyId)),
        current: asgn?.kind === 'CLINICAL_ROLE' && asgn.clinicalRoleId === role.id,
        onSelect: pick({ category: 'DUTY', kind: 'CLINICAL_ROLE', targetRefId: role.id, dutyId: duty?.id || base.dutyId }),
      });
    }

    // The nurse's usual departments (a department shift without a set doctor).
    if (!exclusiveNC) {
      const specPrefs = (nurse?.preferences || []).filter((p) => p.kind === 'SPECIALTY').sort((a, b) => a.rank - b.rank);
      for (const p of specPrefs) {
        const sp = specialties.find((x) => x.id === p.refId || specialtyPrefMatches(p.refId, [x.id]));
        if (!sp || work.some((w) => w.key === `spec-${sp.id}`)) continue;
        const duty = (asgn && dutyMap.get(asgn.dutyWindowId)) || dutyMap.get(base.dutyId);
        work.push({
          key: `spec-${sp.id}`,
          label: `${sp.name} (any doctor)`,
          detail: shiftWords(duty),
          current: asgn?.kind === 'SPECIALTY' && asgn.specialtyId === sp.id,
          onSelect: pick({ category: 'DUTY', kind: 'SPECIALTY', targetRefId: sp.id, dutyId: duty?.id || base.dutyId }),
        });
      }
    }

    const leaveOpts: QuickLeaveOption[] = leaveTypes
      .filter((lt) => lt.active !== false)
      .map((lt) => {
        const isCurrent = leave?.leaveTypeId === lt.id;
        return {
          key: lt.id,
          label: lt.name,
          acronym: lt.acronym,
          color: lt.color,
          current: isCurrent,
          // Choosing the leave already there keeps its own hours and note.
          onSelect: isCurrent
            ? pick({ category: 'LEAVE', leaveTypeId: lt.id, leaveHours: base.leaveHours, note: leave?.note || '' })
            : pick({ category: 'LEAVE', leaveTypeId: lt.id }),
        };
      });

    return { work, leave: leaveOpts };
  };

  /**
   * A nurse's wishes for a day: leave waiting for approval (unless approved leave
   * is already there) and her request (a day off or a shift), in plain words.
   */
  const wishesOn = (nurseId: string, date: string, asgn?: Assignment) => {
    const hasApprovedLeave = !!approvedLeaveOn(nurseId, date);
    const pendingLeave = hasApprovedLeave ? undefined : waitingLeaveOn(nurseId, date);
    const pendingLeaveType = pendingLeave ? leaveTypeMap.get(pendingLeave.leaveTypeId) : undefined;
    const pendingLeaveText = pendingLeave
      ? `Leave asked for, waiting for approval: ${pendingLeaveType?.name || 'Leave'}`
      : '';
    const request = cellRequestOn(nurseId, date);
    const givenDutyId = (asgn || assignmentOn(nurseId, date))?.dutyWindowId;
    const requestWords: RequestWords | undefined = request ? describeRequest(request, dutyWindows, givenDutyId) : undefined;
    return { pendingLeave, pendingLeaveType, pendingLeaveText, request, requestWords };
  };

  /** What a cell holds, in words (for the popup and screen readers). */
  const describeCell = (nurseId: string, date: string): string => {
    const asgn = assignments.find((a) => a.nurseId === nurseId && a.date === date);
    const lock = locks.find((l) => l.nurseId === nurseId && l.date === date);
    const leave = leaveEntries.find(
      (le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate
    );
    const pinned = lock ? ', pinned' : '';
    if (leave) return `${leaveTypeMap.get(leave.leaveTypeId)?.name || 'Leave'}${pinned}`;
    if (lock?.mode === 'OFF') return 'Day off, pinned';
    if (!asgn) return '';
    const duty = dutyMap.get(asgn.dutyWindowId);
    if (isFloatShift(asgn)) return `${duty ? `${duty.name} shift` : 'Shift'}, float${pinned}`;
    const what = asgn.doctorId
      ? doctorMap.get(asgn.doctorId)?.fullName || 'a doctor'
      : asgn.clinicalRoleId
      ? asgn.clinicalRoleId === nurseClinicRoleOf(roles)?.id
        ? 'Nurse Clinic'
        : roleMap.get(asgn.clinicalRoleId)?.name || 'a clinic task'
      : asgn.specialtyId
      ? specialtyMap.get(asgn.specialtyId)?.name || 'a department'
      : '';
    return `${duty ? `${duty.name} shift` : 'Shift'}${what ? ` with ${what}` : ''}${pinned}`;
  };

  // Zoom sizing classes
  const cellHeightClass = zoomLevel === 75 ? 'h-6' : zoomLevel === 90 ? 'h-7' : zoomLevel === 115 ? 'h-10' : 'h-8';
  const cellFontSizeClass = zoomLevel === 75 ? 'text-[10px]' : zoomLevel === 90 ? 'text-[10px]' : zoomLevel === 115 ? 'text-xs' : 'text-[11px]';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-100 font-sans select-none">
      {/* 6.1 Shared Toolbar ("Ribbon-Lite", Row 2: Edit Ops & Block Nav) */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-20">
        <div className="flex items-center gap-2">
          {/* Block Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              disabled={isAllDaysExpanded || currentBlockIndex === 0}
              onClick={() => onBlockChange(currentBlockIndex - 1)}
              className="p-1 rounded hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
              title="Show the earlier days"
              aria-label="Show the earlier days"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <span className="font-mono font-bold text-slate-800 px-2 tabular-nums">
              {isAllDaysExpanded
                ? `All ${totalDays} days, ${formatDate(blockDates[0] || '')} to ${formatDate(blockDates[blockDates.length - 1] || '')}`
                : `Days ${formatDate(blockDates[0] || '')} to ${formatDate(blockDates[blockDates.length - 1] || '')}`}
            </span>
            <button
              disabled={isAllDaysExpanded || currentBlockIndex >= numBlocks - 1}
              onClick={() => onBlockChange(currentBlockIndex + 1)}
              className="p-1 rounded hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
              title="Show the later days"
              aria-label="Show the later days"
            >
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {onToggleExpandDays && (
            <button
              onClick={onToggleExpandDays}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer transition-colors ${
                isAllDaysExpanded
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title={isAllDaysExpanded ? `Show ${(schedule.blockWeeks || 2) * 7} days at a time` : 'Show every day of the roster'}
            >
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAllDaysExpanded ? `All ${blockDates.length} days ✓` : 'Show all days'}</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1 text-slate-600">
            <span className="text-[11px] text-slate-400">Group:</span>
            <select
              aria-label="Group nurses"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="px-1.5 py-1 border border-slate-200 rounded bg-white text-xs"
            >
              <option value="NONE">None</option>
              <option value="SENIORITY">By seniority</option>
            </select>
          </div>

          <button
            type="button"
            role="switch"
            onClick={() => setHighlightViolations(!highlightViolations)}
            aria-checked={highlightViolations}
            title={
              highlightViolations
                ? 'Problem marks are on: a red corner on a cell, a badge on a day, a mark by a nurse. Click to hide them.'
                : 'Problem marks are off. Click to show them.'
            }
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs cursor-pointer ${
              highlightViolations
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <span
              aria-hidden="true"
              className={`relative inline-block w-6 h-3.5 rounded-full transition-colors ${highlightViolations ? 'bg-amber-500' : 'bg-slate-300'}`}
            >
              <span
                className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all ${highlightViolations ? 'left-3' : 'left-0.5'}`}
              />
            </span>
            Problem marks ({shownProblemCount} on these days)
          </button>
        </div>

        {/* Right Side Tools: Zoom, Legend Drawer, & Expand View */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setZoomLevel(75)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                zoomLevel === 75 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
              }`}
              title="Smaller, to fit more days"
            >
              75%
            </button>
            <button
              onClick={() => setZoomLevel(90)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                zoomLevel === 90 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
              }`}
            >
              90%
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                zoomLevel === 100 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
              }`}
            >
              100%
            </button>
            <button
              onClick={() => setZoomLevel(115)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                zoomLevel === 115 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
              }`}
            >
              115%
            </button>
          </div>

          <button
            onClick={() => setIsLegendDrawerOpen(!isLegendDrawerOpen)}
            aria-expanded={isLegendDrawerOpen}
            className="px-2.5 py-1 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-medium cursor-pointer"
          >
            Legend ▾
          </button>

          {onToggleExpandView && (
            <button
              onClick={onToggleExpandView}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors shadow-2xs ${
                isExpandedView
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
              title={isExpandedView ? 'Exit expanded screen view (Esc)' : 'Expand schedule view to full screen'}
            >
              {isExpandedView ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Leave full screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                  <span>Full screen</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 6.2 ROSTER SHEET MAIN GRID VIEWPORT */}
      <div className="flex-1 flex overflow-hidden relative">
        <div ref={gridScrollRef} className="flex-1 overflow-auto bg-slate-200 p-px scroll-pb-16">
          <table ref={tableRef} className="border-collapse bg-white text-xs w-max" role="grid" aria-label="Nurse roster">
            {/* Sticky Header Row 1: Week Spans */}
            <thead className="sticky top-0 z-30 bg-slate-100 border-b border-slate-300">
              <tr className="border-b border-slate-200">
                <th
                  className="sticky left-0 bg-slate-100 z-40 border-r-2 border-slate-300 py-1 px-3 text-left font-semibold text-slate-700 text-xs shadow-xs"
                >
                  Nurses
                </th>
                <th
                  colSpan={blockDates.length}
                  className="py-1 px-2 text-center font-mono text-[11px] text-slate-600 bg-slate-100 border-r border-slate-300"
                >
                  {isAllDaysExpanded ? (
                    <span className="font-bold text-indigo-700">All {totalDays} days of the roster</span>
                  ) : (
                    <span>
                      Weeks {currentBlockIndex * schedule.blockWeeks + 1} to{' '}
                      {Math.min((currentBlockIndex + 1) * schedule.blockWeeks, Math.ceil(totalDays / 7))}
                    </span>
                  )}
                </th>
                <th className="py-1 px-2 text-center font-mono text-[11px] text-slate-600 bg-slate-100">
                  These days
                </th>
              </tr>

              {/* Sticky Header Row 2: Day-name + Date */}
              <tr className="bg-slate-50 text-slate-700">
                {/* Sticky Left Column: Nurse, seniority and hours */}
                <th className="sticky left-0 bg-slate-50 z-40 border-r-2 border-slate-300 py-1.5 px-3 text-left font-semibold text-slate-800 w-60 min-w-60 max-w-60 shadow-xs">
                  <span className="block">Nurse</span>
                  <span className="block text-[10px] font-normal text-slate-500">Hours worked / goal for the whole roster</span>
                </th>

                {/* Date Columns */}
                {dayInfo.map(({ dateStr, day, weekday, isWeekend, holiday, isToday }) => (
                  <th
                    key={dateStr}
                    scope="col"
                    title={`${WEEKDAY_ABBR[weekday]} ${formatDate(dateStr)}${isToday ? ' · Today' : ''}${holiday ? ` · Public holiday: ${holiday.name}` : isWeekend ? ' · Weekend' : ''}`}
                    aria-label={`${WEEKDAY_ABBR[weekday]} ${formatDate(dateStr)}${isToday ? ', today' : ''}${holiday ? `, public holiday: ${holiday.name}` : isWeekend ? ', weekend' : ''}`}
                    className={`py-1 px-1 text-center font-mono border-r border-slate-200 min-w-[50px] ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : holiday
                        ? 'bg-cyan-100 text-cyan-900 font-bold'
                        : isWeekend
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-normal leading-tight">
                      {isToday ? 'Today' : WEEKDAY_ABBR[weekday]}
                    </div>
                    <div className="flex items-center justify-center gap-0.5 text-xs font-bold">
                      <span>{day}</span>
                      {holiday && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full inline-block ${isToday ? 'bg-white' : 'bg-cyan-600'}`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    {highlightViolations && dayProblems.has(dateStr) && (() => {
                      const dp = dayProblems.get(dateStr)!;
                      return (
                        <button
                          type="button"
                          onClick={() => onNavigateTab && onNavigateTab('warnings')}
                          title={dp.messages.join('\n')}
                          aria-label={`${dp.messages.length} problem${dp.messages.length === 1 ? '' : 's'} on ${formatDate(dateStr)}: ${dp.messages.join('. ')}`}
                          className={`mt-0.5 mx-auto flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold font-sans cursor-pointer ${
                            dp.mustFix ? 'bg-rose-600 text-white' : 'bg-amber-400 text-amber-950'
                          }`}
                        >
                          {dp.messages.length}
                        </button>
                      );
                    })()}
                  </th>
                ))}

                <th className="py-1 px-2 text-center font-mono text-[11px] text-slate-600 bg-slate-50">
                  Hours
                </th>
              </tr>
            </thead>

            {/* Table Body: Nurse Rows */}
            <tbody className="divide-y divide-slate-200 font-mono">
              {displayNurses.map((nurse, nurseIndex) => {
                const seniority = seniorityMap.get(nurse.seniorityLevelId);
                const hasPhl = nurse.capabilityIds?.includes('role-phl');
                const { totalHours, targetHours, percent } = getNurseHoursProgress(nurse);
                const blockHours = getNurseBlockHours(nurse);

                // Hours line: over in red, within about 2 h of the goal in green, short in amber.
                const diff = Math.round((totalHours - targetHours) * 10) / 10;
                const hoursTone = targetHours <= 0 ? 'none' : diff > 2 ? 'over' : diff < -2 ? 'short' : 'ok';
                const hoursNote =
                  targetHours <= 0
                    ? ''
                    : diff > 0
                    ? `${fmtHours(diff)} h over`
                    : diff < 0
                    ? `${fmtHours(-diff)} h short`
                    : 'on goal';
                const hoursLine =
                  targetHours > 0
                    ? `${fmtHours(totalHours)} / ${fmtHours(targetHours)} h · ${hoursNote}`
                    : `${fmtHours(totalHours)} h`;
                const toneText =
                  hoursTone === 'over' ? 'text-rose-700 font-semibold' : hoursTone === 'ok' ? 'text-emerald-700' : hoursTone === 'short' ? 'text-amber-700' : 'text-slate-600';
                // Bar: when over the goal, the whole bar is the hours worked, the goal
                // part is green and the hours over show as a red segment.
                const overShare = totalHours > targetHours && totalHours > 0 ? (totalHours - targetHours) / totalHours : 0;
                const fillPercent = overShare > 0 ? 100 - overShare * 100 : Math.min(100, Math.max(0, percent));
                const barColor = hoursTone === 'short' ? 'bg-amber-500' : 'bg-emerald-500';

                return (
                  <tr key={nurse.id} className="hover:bg-slate-50/60">
                    {/* Sticky Left Column: Nurse, seniority and hours */}
                    <th
                      scope="row"
                      className="sticky left-0 bg-white z-20 border-r-2 border-slate-300 py-1 px-2.5 text-left font-normal w-60 min-w-60 max-w-60 shadow-xs"
                      title={`${nurse.fullName}${seniority ? ` · ${seniority.name}` : ''} · ${nurse.contractPercent}% of full time · Whole roster: ${hoursLine}`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-slate-900 truncate text-xs font-sans">{nurse.fullName}</span>
                        {seniority && (
                          <span
                            className="text-[10px] font-medium px-1 rounded shrink-0 font-sans"
                            style={{ backgroundColor: `${seniority.color}15`, color: seniority.color }}
                          >
                            {seniority.name}
                          </span>
                        )}
                        {nurse.contractPercent !== 100 && (
                          <span className="text-[10px] text-slate-500 shrink-0 font-sans">{nurse.contractPercent}% time</span>
                        )}
                        {highlightViolations && nurseProblems.has(nurse.id) && (() => {
                          const np = nurseProblems.get(nurse.id)!;
                          return (
                            <button
                              type="button"
                              onClick={() => onNavigateTab && onNavigateTab('warnings')}
                              title={np.messages.join('\n')}
                              aria-label={`${np.messages.length} problem${np.messages.length === 1 ? '' : 's'} for ${nurse.fullName}: ${np.messages.join('. ')}`}
                              className={`shrink-0 flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold font-sans cursor-pointer ${
                                np.mustFix ? 'bg-rose-600 text-white' : 'bg-amber-400 text-amber-950'
                              }`}
                            >
                              {np.messages.length}
                            </button>
                          );
                        })()}
                        {hasPhl && (
                          <span title="Blood collection and IV nurse" className="text-rose-600 text-xs font-bold shrink-0 ml-auto">
                            🩸
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[11px] font-sans whitespace-nowrap ${toneText}`}>{hoursLine}</span>
                        {targetHours > 0 && (
                          <div
                            className="flex-1 min-w-8 h-1.5 rounded bg-slate-100 overflow-hidden flex"
                            role="img"
                            aria-label={`${fmtHours(totalHours)} of ${fmtHours(targetHours)} hours, ${hoursNote}`}
                          >
                            <div className={`h-full ${barColor}`} style={{ width: `${fillPercent}%` }} />
                            {overShare > 0 && <div className="h-full bg-rose-500" style={{ width: `${overShare * 100}%` }} />}
                          </div>
                        )}
                      </div>
                    </th>

                    {/* Matrix Cells */}
                    {dayInfo.map(({ dateStr, isWeekend, holiday, isToday }, dateIndex) => {
                      const asgn = assignmentOn(nurse.id, dateStr);
                      const lock = lockOn(nurse.id, dateStr);
                      const leave = approvedLeaveOn(nurse.id, dateStr);

                      const cellKey = cellKeyOf(nurse.id, dateStr);
                      const isSelected =
                        selectedCell?.nurseId === nurse.id && selectedCell?.date === dateStr;
                      // Without a selection the first cell is the grid's way in for the Tab key.
                      const isTabStop = selectedCellShown ? isSelected : nurseIndex === 0 && dateIndex === 0;
                      const problemMessages = cellViolationMessages.get(`${nurse.id}_${dateStr}`) || [];
                      const hasViolation = highlightViolations && problemMessages.length > 0;
                      const isFlashing = flashCellKey === cellKey;
                      const isPopupCell = quickPopup?.nurseId === nurse.id && quickPopup?.date === dateStr;

                      const duty = asgn ? dutyMap.get(asgn.dutyWindowId) : undefined;
                      const leaveType = leave ? leaveTypes.find((l) => l.id === leave.leaveTypeId) : undefined;
                      const { pendingLeave, pendingLeaveType, pendingLeaveText, requestWords } = wishesOn(nurse.id, dateStr, asgn);
                      const pendingLeaveColor = pendingLeaveType?.color || '#f59e0b';
                      // Leave waiting for approval: diagonal stripes behind whatever the cell shows.
                      const pendingHatch = pendingLeave
                        ? `repeating-linear-gradient(135deg, ${pendingLeaveColor}40 0 3px, transparent 3px 7px)`
                        : undefined;

                      let doctorName = '';
                      const isNurseClinic =
                        asgn?.clinicalRoleId === 'role-nurse-clinic' ||
                        (!!asgn?.clinicalRoleId && asgn.clinicalRoleId === nurseClinicRoleOf(roles)?.id) ||
                        asgn?.note?.toLowerCase().includes('nurse clinic');

                      const isFloatPool =
                        (!!asgn && isFloatShift(asgn)) ||
                        asgn?.note?.toLowerCase().includes('float pool') ||
                        asgn?.note?.toLowerCase().includes('general clinic');

                      if (asgn && isFloatShift(asgn)) {
                        // Not with a doctor: the roster says Float (not a department)
                        doctorName = 'FLOAT';
                      } else if (asgn?.doctorId) {
                        const d = doctorMap.get(asgn.doctorId);
                        doctorName = d ? d.fullName.replace(/^dr\.?\s+/i, '') : '';
                      } else if (asgn?.clinicalRoleId) {
                        const r = roleMap.get(asgn.clinicalRoleId);
                        if (asgn.clinicalRoleId === 'role-float') {
                          doctorName = 'FLOAT';
                        } else {
                          doctorName = r ? r.acronym : (isNurseClinic ? 'NC' : 'ROLE');
                        }
                      } else if (asgn?.specialtyId) {
                        const s = specialtyMap.get(asgn.specialtyId);
                        doctorName = s ? s.code : 'POOL';
                      } else if (isNurseClinic) {
                        doctorName = 'NC';
                      } else if (isFloatPool) {
                        doctorName = 'FLOAT';
                      }

                      const docObj = asgn?.doctorId ? doctorMap.get(asgn.doctorId) : null;
                      const docPref = asgn?.doctorId ? nurse.preferences?.find((p) => p.kind === 'DOCTOR' && p.refId === asgn.doctorId) : null;
                      const specPref = !docPref && docObj && docObj.specialtyIds
                        ? nurse.preferences?.find(
                            (p) =>
                              p.kind === 'SPECIALTY' &&
                              (docObj.specialtyIds.includes(p.refId) ||
                                docObj.specialtyIds.some((sid) => {
                                  const sCode = specialtyMap.get(sid)?.code?.toLowerCase();
                                  return sCode && p.refId.toLowerCase().includes(sCode);
                                }))
                          )
                        : null;

                      // Check strict allocation match vs profile
                      const hasSpecificAllocations = nurse.preferences?.some(
                        (p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY'
                      );
                      let isAllocationMismatch = false;
                      let mismatchReason = '';

                      if (asgn && hasSpecificAllocations) {
                        if (asgn.kind === 'DOCTOR' && asgn.doctorId) {
                          const docSpecIds = docObj?.specialtyIds || [];
                          const matchesDoc = nurse.preferences?.some(
                            (p) => p.kind === 'DOCTOR' && p.refId === asgn.doctorId
                          );
                          const matchesSpec = nurse.preferences?.some((p) => {
                            if (p.kind !== 'SPECIALTY') return false;
                            if (docSpecIds.includes(p.refId)) return true;
                            const pRefLower = p.refId.toLowerCase();
                            for (const sid of docSpecIds) {
                              const sObj = specialtyMap.get(sid);
                              if (sObj) {
                                if (
                                  pRefLower === sObj.code.toLowerCase() ||
                                  pRefLower === sObj.name.toLowerCase() ||
                                  (sObj.code.toLowerCase() === 'pcc' && pRefLower.includes('pcc')) ||
                                  (sObj.code.toLowerCase() === 'ped' && (pRefLower.includes('ped') || pRefLower.includes('pedia')))
                                ) {
                                  return true;
                                }
                              }
                            }
                            return false;
                          });

                          if (!matchesDoc && !matchesSpec) {
                            isAllocationMismatch = true;
                            mismatchReason = `${docObj ? withDr(docObj.fullName) : 'This doctor'} is not one of ${nurse.fullName}'s usual doctors or departments.`;
                          }
                        } else if (asgn.kind === 'SPECIALTY' && asgn.specialtyId && !isFloatShift(asgn)) {
                          const specObj = specialtyMap.get(asgn.specialtyId);
                          const matchesSpec = nurse.preferences?.some((p) => {
                            if (p.kind !== 'SPECIALTY') return false;
                            if (p.refId === asgn.specialtyId) return true;
                            if (specObj) {
                              const pRefLower = p.refId.toLowerCase();
                              if (
                                pRefLower === specObj.code.toLowerCase() ||
                                pRefLower === specObj.name.toLowerCase() ||
                                (specObj.code.toLowerCase() === 'pcc' && pRefLower.includes('pcc')) ||
                                (specObj.code.toLowerCase() === 'ped' && (pRefLower.includes('ped') || pRefLower.includes('pedia')))
                              ) {
                                return true;
                              }
                            }
                            return false;
                          });

                          if (!matchesSpec) {
                            isAllocationMismatch = true;
                            mismatchReason = `${specObj?.name || 'This department'} is not one of ${nurse.fullName}'s usual departments.`;
                          }
                        }
                      }

                      const docRankBadge = isAllocationMismatch
                        ? '!'
                        : docPref
                        ? `#${docPref.rank}`
                        : specPref
                        ? `#${specPref.rank}`
                        : isFloatPool
                        ? null
                        : asgn?.doctorId
                        ? 'Pool'
                        : null;

                      const pairingDesc = isNurseClinic
                        ? 'Nurse Clinic (no doctor)'
                        : isFloatPool
                        ? 'Float (not with a doctor)'
                        : asgn?.clinicalRoleId
                        ? `Clinic task: ${roleMap.get(asgn.clinicalRoleId)?.name || doctorName}`
                        : asgn?.doctorId
                        ? `With Dr ${doctorName}${
                            docPref
                              ? ` (usual doctor, choice ${docPref.rank})`
                              : specPref
                              ? ` (usual department, choice ${specPref.rank})`
                              : isAllocationMismatch
                              ? ' (not one of this nurse’s usual doctors)'
                              : ' (any nurse)'
                          }`
                        : asgn?.specialtyId
                        ? `Department: ${specialtyMap.get(asgn.specialtyId)?.name || doctorName}${
                            specPref
                              ? ` (usual department, choice ${specPref.rank})`
                              : isAllocationMismatch
                              ? ' (not one of this nurse’s usual departments)'
                              : ''
                          }`
                        : doctorName;

                      const isHandChange = asgn?.source === 'MANUAL';
                      const contentWords = leave
                        ? `${leaveType?.name || 'Leave'}: ${fmtHours(leaveCreditOnDate(leave, leaveType, dateStr))} h counted this day${
                            leave.dayHours?.[dateStr] !== undefined ? ' (set for this day)' : ''
                          }${lock ? ', pinned' : ''}`
                        : lock?.mode === 'OFF'
                        ? 'Day off, pinned'
                        : asgn
                        ? `${duty?.name || 'Shift'} shift${duty ? ` (${duty.startTime} to ${duty.endTime})` : ''}${
                            duty?.isPriority ? ', used first' : ''
                          } · ${pairingDesc} · ${SOURCE_WORDS[asgn.source] || asgn.source}${lock && asgn.source !== 'LOCK' ? ', pinned' : ''}${
                            isAllocationMismatch ? `\n${mismatchReason}` : ''
                          }`
                        : 'Nothing yet';
                      const wishWords = [pendingLeaveText, requestWords?.text].filter(Boolean).join('\n');
                      const dayWords = `${holiday ? ` (public holiday: ${holiday.name})` : isWeekend ? ' (weekend)' : ''}${isToday ? ' (today)' : ''}`;
                      const cellTitle = `${contentWords}${wishWords ? `\n${wishWords}` : ''}${
                        problemMessages.length > 0 ? `\nProblems:\n${problemMessages.map((m) => `• ${m}`).join('\n')}` : ''
                      }`;
                      const cellAria = `${nurse.fullName}, ${formatDate(dateStr)}${dayWords}: ${contentWords.replace(/\n/g, '. ')}${
                        wishWords ? `. ${wishWords.replace(/\n/g, '. ')}` : ''
                      }${
                        problemMessages.length > 0 ? `. ${problemMessages.length === 1 ? 'Problem' : 'Problems'}: ${problemMessages.join('. ')}` : ''
                      }`;

                      // Column shading: today, public holiday, weekend.
                      const dayShade = isToday
                        ? 'bg-indigo-50/70'
                        : holiday
                        ? 'bg-cyan-50'
                        : isWeekend
                        ? 'bg-slate-100'
                        : '';

                      return (
                        <td
                          key={dateStr}
                          data-cell={cellKey}
                          tabIndex={isTabStop ? 0 : -1}
                          onClick={() => handleCellClick(nurse.id, dateStr)}
                          onDoubleClick={() => handleCellDoubleClick(nurse.id, dateStr)}
                          onContextMenu={(e) => handleContextMenu(e, nurse.id, dateStr)}
                          onFocus={() => {
                            if (!isSelected) setSelectedCell({ nurseId: nurse.id, date: dateStr });
                          }}
                          aria-selected={isSelected}
                          aria-haspopup="dialog"
                          aria-expanded={isPopupCell}
                          aria-label={cellAria}
                          title={cellTitle}
                          style={pendingHatch ? { backgroundImage: pendingHatch } : undefined}
                          className={`border-r border-b border-slate-200 p-0.5 text-center align-middle cursor-pointer relative transition-shadow duration-700 focus:outline-none ${cellFontSizeClass} ${
                            isToday ? 'border-x-indigo-300' : ''
                          } ${
                            isFlashing
                              ? 'ring-4 ring-amber-400 z-10 bg-amber-50 duration-150'
                              : isSelected
                              ? 'ring-2 ring-indigo-600 z-10 bg-indigo-50/50'
                              : `${dayShade} hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-400`
                          }`}
                        >
                          {/* Problem marker: small red corner */}
                          {hasViolation && (
                            <span
                              aria-hidden="true"
                              className="absolute top-0 right-0 w-0 h-0 border-t-8 border-l-8 border-t-red-600 border-l-transparent z-10 pointer-events-none"
                            />
                          )}
                          {/* Request mark, top left: round for a day off, square for a shift; hollow while waiting for approval; amber when not followed. */}
                          {requestWords && (
                            <span
                              aria-hidden="true"
                              className={`absolute top-0.5 left-0.5 w-1.5 h-1.5 z-10 pointer-events-none border ${
                                requestWords.dayOff ? 'rounded-full' : 'rounded-[1px]'
                              } ${
                                requestWords.mismatch
                                  ? requestWords.pending
                                    ? 'border-amber-500 bg-white'
                                    : 'border-amber-500 bg-amber-500'
                                  : requestWords.pending
                                  ? 'border-sky-600 bg-white'
                                  : 'border-sky-600 bg-sky-600'
                              }`}
                            />
                          )}
                          {/* Leave waiting for approval under a shift or a pinned day off */}
                          {pendingLeave && (asgn || lock?.mode === 'OFF' || leave) && (
                            <Clock
                              aria-hidden="true"
                              className="absolute bottom-0.5 left-0.5 w-2 h-2 z-10 pointer-events-none text-slate-600"
                            />
                          )}
                          {/* 1. Leave Cell Rendering */}
                          {leave ? (
                            <div
                              className={`w-full ${cellHeightClass} rounded flex items-center justify-center gap-0.5 font-bold text-white shadow-2xs`}
                              style={{ backgroundColor: leaveType?.color || '#f59e0b' }}
                            >
                              <span>{leaveType?.acronym || 'L'}</span>
                              {lock && <Lock className="w-2.5 h-2.5 text-white" aria-hidden="true" />}
                            </div>
                          ) : lock?.mode === 'OFF' ? (
                            // 2. Lock Off
                            <div className={`w-full ${cellHeightClass} rounded border border-dashed border-amber-400 bg-amber-50 flex items-center justify-center font-bold text-amber-900 text-[10px]`}>
                              <Lock className="w-2.5 h-2.5 text-amber-600 mr-0.5" aria-hidden="true" />
                              <span>OFF</span>
                            </div>
                          ) : asgn ? (
                            // 3. Assignment Cell (Duty + Pairing Label)
                            <div
                              className={`w-full ${cellHeightClass} rounded flex flex-col items-center justify-center leading-none px-0.5 border ${
                                hasViolation || isAllocationMismatch
                                  ? 'ring-1.5 ring-rose-500 border-rose-400 bg-rose-50/70 shadow-xs'
                                  : isNurseClinic
                                  ? 'bg-teal-50/70 border-teal-300'
                                  : isFloatPool
                                  ? 'bg-indigo-50/40 border-indigo-200'
                                  : ''
                              }`}
                              style={{
                                backgroundColor: (hasViolation || isAllocationMismatch)
                                  ? undefined
                                  : isNurseClinic
                                  ? undefined
                                  : isFloatPool
                                  ? undefined
                                  : `${duty?.color || '#3b82f6'}18`,
                                borderColor: (hasViolation || isAllocationMismatch)
                                  ? undefined
                                  : isNurseClinic
                                  ? undefined
                                  : isFloatPool
                                  ? undefined
                                  : duty?.color || '#3b82f6',
                              }}
                            >
                              <div className="flex items-center gap-0.5">
                                <span
                                  className={`font-bold text-[10px] ${
                                    isNurseClinic ? 'text-teal-800' : ''
                                  }`}
                                  style={{
                                    color: isNurseClinic ? undefined : duty?.color || '#1e40af',
                                  }}
                                >
                                  {duty?.acronym || 'D'}
                                </span>
                                {duty?.isPriority && (
                                  <span className="text-[10px] text-amber-500 font-bold leading-none" aria-hidden="true">
                                    ★
                                  </span>
                                )}
                                {lock && <Lock className="w-2.5 h-2.5 text-amber-600" aria-hidden="true" />}
                                {isHandChange && !lock && <Edit2 className="w-2.5 h-2.5 text-slate-500" aria-hidden="true" />}
                              </div>
                              <div className="flex items-center gap-0.5 max-w-[48px] justify-center">
                                <span
                                  className={`text-[10px] font-semibold truncate ${
                                    isAllocationMismatch
                                      ? 'text-rose-900 font-bold'
                                      : isNurseClinic
                                      ? 'text-teal-900 font-bold bg-teal-100/80 px-1 py-0.2 rounded border border-teal-300'
                                      : isFloatPool
                                      ? 'text-indigo-800 font-bold'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  {doctorName}
                                </span>
                                {docRankBadge && (
                                  <span
                                    aria-hidden="true"
                                    className={`text-[10px] font-bold px-0.5 rounded leading-none shrink-0 ${
                                      docRankBadge === '!'
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300 font-extrabold'
                                        : docRankBadge === '#1'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : docRankBadge === '#2'
                                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                                    }`}
                                  >
                                    {docRankBadge}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : pendingLeave ? (
                            // 4. Leave waiting for approval (shown lighter, on stripes)
                            <div
                              className={`w-full ${cellHeightClass} rounded border border-dashed flex items-center justify-center font-bold text-[10px] opacity-80`}
                              style={{ borderColor: pendingLeaveColor, color: pendingLeaveColor }}
                              aria-hidden="true"
                            >
                              <span className="bg-white/80 px-0.5 rounded">{pendingLeaveType?.acronym || 'L'}</span>
                            </div>
                          ) : (
                            // 5. Empty Cell
                            <div className={`w-full ${cellHeightClass} flex items-center justify-center text-slate-300`} aria-hidden="true">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Hours inside the days shown */}
                    <td
                      className="py-1 px-2 text-center text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200"
                      title={`These days: ${fmtHours(blockHours.bDuty)} h shifts + ${fmtHours(blockHours.bLeave)} h leave. Whole roster: ${hoursLine}`}
                    >
                      <span>{fmtHours(blockHours.blockTotal)} h</span>
                      <span className="block text-[10px] font-normal text-slate-500">
                        {fmtHours(totalHours)} h in all
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Day totals: stays at the bottom while the nurse rows scroll */}
            <tfoot className="sticky bottom-0 z-30 bg-slate-50 border-t-2 border-slate-300 font-sans">
              <tr>
                <th
                  scope="row"
                  className="sticky left-0 bg-slate-100 z-40 border-r-2 border-slate-300 py-1 px-2.5 text-left font-normal w-60 min-w-60 max-w-60 shadow-xs"
                >
                  <span className="block text-xs font-semibold text-slate-800">Day totals</span>
                  <span className="block text-[10px] text-slate-500 leading-tight">
                    Doctors · nurses · hours without a free nurse · senior
                  </span>
                </th>
                {dayInfo.map(({ dateStr, isWeekend, holiday }) => {
                  const t = dayTotals.get(dateStr);
                  if (!t) return <td key={dateStr} />;
                  const gapWords =
                    t.gapHours === undefined
                      ? ''
                      : t.gapHours === 0
                      ? 'a free nurse every opening hour'
                      : `${t.gapHours} ${t.gapHours === 1 ? 'hour' : 'hours'} without a free nurse`;
                  const seniorWords = t.hasSenior === undefined ? '' : t.hasSenior ? 'a senior nurse on duty' : 'no senior nurse on duty';
                  const summary = [
                    `${formatDate(dateStr)}: ${t.doctors} ${t.doctors === 1 ? 'doctor' : 'doctors'} in session`,
                    `${t.nurses} ${t.nurses === 1 ? 'nurse' : 'nurses'} on duty`,
                    gapWords,
                    seniorWords,
                  ]
                    .filter(Boolean)
                    .join(', ');
                  return (
                    <td
                      key={dateStr}
                      title={summary}
                      className={`py-0.5 px-0.5 text-center border-r border-slate-200 text-[10px] leading-tight align-top ${
                        holiday ? 'bg-cyan-50' : isWeekend ? 'bg-slate-100' : 'bg-slate-50'
                      }`}
                    >
                      <span className="sr-only">{summary}</span>
                      <span aria-hidden="true" className="flex flex-col items-center gap-px">
                        <span className="flex items-center gap-1 text-slate-700 font-mono">
                          <span className="inline-flex items-center gap-px">
                            <Stethoscope className="w-2.5 h-2.5 text-slate-400" />
                            {t.doctors}
                          </span>
                          <span className="inline-flex items-center gap-px">
                            <Users className="w-2.5 h-2.5 text-slate-400" />
                            {t.nurses}
                          </span>
                        </span>
                        {t.gapHours !== undefined &&
                          (t.gapHours === 0 ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <span className="inline-flex items-center gap-px font-bold text-rose-700">
                              <Clock className="w-2.5 h-2.5" />
                              {t.gapHours} h
                            </span>
                          ))}
                        {t.hasSenior !== undefined &&
                          (t.hasSenior ? (
                            <span className="text-emerald-700 font-semibold">✓ Senior</span>
                          ) : (
                            <span className="text-rose-700 font-bold whitespace-nowrap">No senior</span>
                          ))}
                      </span>
                    </td>
                  );
                })}
                <td className="bg-slate-50" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 6.6 Collapsible Right Drawer: the one Legend */}
        {isLegendDrawerOpen && (
          <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 text-xs shadow-lg animate-in slide-in-from-right duration-150 z-30" role="region" aria-label="Legend">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-bold text-slate-800">Legend</span>
              <button
                onClick={() => setIsLegendDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close legend"
                title="Close legend"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
                  Shifts
                </h4>
                <div className="space-y-1">
                  {dutyWindows.map((dw) => (
                    <div key={dw.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="min-w-5 h-5 px-0.5 rounded text-white font-mono font-bold text-[10px] flex items-center justify-center"
                          style={{ backgroundColor: dw.color }}
                        >
                          {dw.acronym}
                        </span>
                        <span className="text-slate-800 font-medium">{dw.name}</span>
                        {dw.isPriority && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                            Used first
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-slate-500 text-[10px]">
                        {dw.startTime} to {dw.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
                  Leave and days off
                </h4>
                <div className="space-y-1">
                  {leaveTypes.map((lt) => (
                    <div key={lt.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="min-w-5 h-5 px-0.5 rounded text-white font-mono font-bold text-[10px] flex items-center justify-center"
                          style={{ backgroundColor: lt.color }}
                        >
                          {lt.acronym}
                        </span>
                        <span className="text-slate-800">{lt.name}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[10px]">
                        {typeof lt.creditedHours === 'number' ? `${lt.creditedHours} h a day` : '8 h a day'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
                  Marks in a cell
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                    <span>Pinned: kept when the roster is filled again</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-5 rounded border border-dashed border-amber-400 bg-amber-50 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                      OFF
                    </span>
                    <span>Pinned day off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    <span>Hand change (not pinned)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative w-6 h-5 rounded border border-slate-300 bg-white shrink-0" aria-hidden="true">
                      <span className="absolute top-0 right-0 w-0 h-0 border-t-8 border-l-8 border-t-red-600 border-l-transparent" />
                    </span>
                    <span>Problem with this shift: tap or point at the cell to read it</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-5 flex items-center justify-center shrink-0" aria-hidden="true">
                      <span className="min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                    </span>
                    <span>Problems about a whole day (on the day's heading) or a nurse (by the name); red must be fixed, amber to check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-5 rounded border border-dashed border-amber-500 text-amber-600 font-bold text-[10px] flex items-center justify-center shrink-0"
                      style={{ backgroundImage: 'repeating-linear-gradient(135deg, #f59e0b40 0 3px, transparent 3px 7px)' }}
                      aria-hidden="true"
                    >
                      AL
                    </span>
                    <span>Leave asked for, waiting for approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
                    <span>Leave waiting for approval on a day with a shift</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 flex items-center justify-center gap-0.5 shrink-0" aria-hidden="true">
                      <span className="w-1.5 h-1.5 rounded-full border border-sky-600 bg-sky-600" />
                      <span className="w-1.5 h-1.5 rounded-full border border-sky-600 bg-white" />
                    </span>
                    <span>Asked for this day off (hollow: waiting for approval)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 flex items-center justify-center gap-0.5 shrink-0" aria-hidden="true">
                      <span className="w-1.5 h-1.5 rounded-[1px] border border-sky-600 bg-sky-600" />
                      <span className="w-1.5 h-1.5 rounded-[1px] border border-sky-600 bg-white" />
                    </span>
                    <span>Asked for a shift (point at the cell to see which)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 flex items-center justify-center gap-0.5 shrink-0" aria-hidden="true">
                      <span className="w-1.5 h-1.5 rounded-full border border-amber-500 bg-amber-500" />
                      <span className="w-1.5 h-1.5 rounded-[1px] border border-amber-500 bg-amber-500" />
                    </span>
                    <span>Request not followed: a shift on a day asked off, or another shift than the one asked for</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold w-3.5 text-center shrink-0" aria-hidden="true">★</span>
                    <span>Shift used first when filling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-5 rounded text-teal-900 font-mono font-bold text-[10px] flex items-center justify-center bg-teal-100 border border-teal-300 shrink-0">
                      NC
                    </span>
                    <span>Nurse Clinic (no doctor)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">#1</span>
                    <span>One of the nurse’s usual doctors (1 = first choice)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 shrink-0">Pool</span>
                    <span>Doctor shared by any nurse</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-1 rounded bg-rose-100 text-rose-800 border border-rose-300 shrink-0">!</span>
                    <span>Not one of the nurse’s usual doctors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-600 font-bold" aria-hidden="true">🩸</span>
                    <span>Blood collection and IV nurse</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
                  Days
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-5 rounded bg-slate-200 border border-slate-300 shrink-0" aria-hidden="true" />
                    <span>Weekend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-5 rounded bg-cyan-100 border border-cyan-300 shrink-0" aria-hidden="true" />
                    <span>Public holiday (point at the date for its name)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-5 rounded bg-indigo-600 shrink-0" aria-hidden="true" />
                    <span>Today</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
                  Day totals (under the grid)
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>Doctors in session that day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>Nurses on duty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-px text-[10px] font-bold text-rose-700 shrink-0">
                      <Clock className="w-2.5 h-2.5" aria-hidden="true" />2 h
                    </span>
                    <span>
                      Opening hours without a free nurse (<Check className="inline w-3 h-3 text-emerald-600" aria-label="check mark" /> when every hour has one)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-rose-700 whitespace-nowrap shrink-0">No senior</span>
                    <span>No senior nurse on duty that day</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase">
                  Hours
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-1.5 rounded bg-emerald-500 shrink-0" aria-hidden="true" />
                    <span>Within about 2 h of the goal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-1.5 rounded bg-amber-500 shrink-0" aria-hidden="true" />
                    <span>Short of the goal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-1.5 rounded overflow-hidden flex shrink-0" aria-hidden="true">
                      <span className="w-4 bg-emerald-500" />
                      <span className="w-2 bg-rose-500" />
                    </span>
                    <span>Over the goal (red part = hours over)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="h-7 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-600 shrink-0 select-none">
        <div className="flex items-center gap-4">
          {selectedCell ? (
            <div className="flex items-center gap-1.5 font-mono text-slate-800">
              <span className="font-bold">
                {nurseMap.get(selectedCell.nurseId)?.fullName}
              </span>
              <span>·</span>
              <span>{formatDate(selectedCell.date)}</span>
            </div>
          ) : (
            <span className="text-slate-500">Click a cell to change it</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {(() => {
            // The day of the selected cell (else the first day shown): opening hours missing a free nurse.
            const checkDate = selectedCell?.date || blockDates[0] || schedule.startDate;
            const dayMap = validationReport.hourlyCoverageMap[checkDate];
            if (!dayMap || Object.keys(dayMap).length === 0) {
              return <span className="text-slate-500">Coverage: not checked yet</span>;
            }
            const shortHours = Object.keys(dayMap).filter((h) => dayMap[h].deficit > 0).sort();
            return (
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('coverage')}
                className={`flex items-center gap-1 cursor-pointer px-1.5 py-0.5 rounded ${
                  shortHours.length > 0
                    ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Open the Coverage tab"
              >
                <span className="text-slate-500">Coverage {formatDate(checkDate)}:</span>
                <span>
                  {shortHours.length === 0
                    ? 'every hour covered'
                    : `${shortHours.length} hour${shortHours.length === 1 ? '' : 's'} without a free nurse (from ${shortHours[0]})`}
                </span>
              </button>
            );
          })()}

          <button
            onClick={() => onNavigateTab && onNavigateTab('warnings')}
            className={`flex items-center gap-1 font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
              validationReport.errorCount > 0
                ? 'bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 border border-rose-200'
                : validationReport.warnCount > 0
                ? 'bg-amber-50 text-amber-800 font-bold hover:bg-amber-100 border border-amber-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Open the Problems tab"
          >
            <span className="text-slate-500">Problems:</span>
            <span>
              {validationReport.errorCount + validationReport.warnCount === 0
                ? 'none'
                : `${validationReport.errorCount} must fix · ${validationReport.warnCount} to check`}
            </span>
          </button>
        </div>
      </div>

      {/* --- INLINE CELL SHIFT & LEAVE EDITOR MODAL --- */}
      {isEditorOpen && editorTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-100">
          <div
            ref={editorDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={editorTitleId}
            className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-xs animate-in zoom-in-95 duration-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span id={editorTitleId} className="font-bold text-slate-900 text-sm">
                    {nurseMap.get(editorTarget.nurseId)?.fullName}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                    {formatDate(editorTarget.date)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Choose a shift or leave for this day.
                </span>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 cursor-pointer"
                aria-label="Close editor"
                title="Close editor"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Category Segmented Tabs: Duty Shift vs Leave / Day Off */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setEditorCategory('DUTY')}
                className={`py-2 px-3 rounded-md font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  editorCategory === 'DUTY'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Shift</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorCategory('LEAVE')}
                className={`py-2 px-3 rounded-md font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  editorCategory === 'LEAVE'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Leave or day off</span>
              </button>
            </div>

            {/* DUTY SHIFT CONFIGURATION */}
            {editorCategory === 'DUTY' && (
              <div className="space-y-3.5 animate-in fade-in duration-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    1. Choose the shift
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dutyWindows.map((dw) => {
                      const isSelected = editorDutyId === dw.id;
                      return (
                        <button
                          key={dw.id}
                          type="button"
                          onClick={() => setEditorDutyId(dw.id)}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="font-bold text-xs"
                              style={{ color: dw.color || '#1e40af' }}
                            >
                              {dw.name} ({dw.acronym})
                            </span>
                            {dw.isPriority ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100/80 border border-amber-200 px-1.5 py-0.2 rounded">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                                Used first
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                            {dw.startTime} to {dw.endTime}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    2. Who or what the nurse works with
                  </label>
                  {(() => {
                    const activeNurse = editorTarget ? nurseMap.get(editorTarget.nurseId) : undefined;
                    const isTargetExclusiveNC = activeNurse ? isExclusiveNurseClinic(activeNurse, roles) : false;

                    return (
                      <>
                        {isTargetExclusiveNC && (editorKind === 'DOCTOR' || editorKind === 'SPECIALTY') && (
                          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-start gap-2 mb-2 animate-in fade-in duration-100">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold block text-[11px]">
                                Works in Nurse Clinic only
                              </span>
                              <span className="text-[10px] text-amber-800 leading-tight block">
                                {activeNurse?.fullName} works in Nurse Clinic only, with no doctor. Putting them with a doctor or a department will show as a problem.
                              </span>
                            </div>
                          </div>
                        )}
                        {(() => {
                          const nurseSpecificPrefs = activeNurse?.preferences?.filter(
                            (p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY'
                          ) || [];

                          if (!isTargetExclusiveNC && nurseSpecificPrefs.length > 0) {
                            let isMismatch = false;
                            let warnText = '';

                            if (editorKind === 'DOCTOR') {
                              const selDoc = doctors.find((d) => d.id === editorTargetRefId);
                              const selDocSpecIds = selDoc?.specialtyIds || [];
                              const matchesDoc = nurseSpecificPrefs.some((p) => p.kind === 'DOCTOR' && p.refId === editorTargetRefId);
                              const matchesSpec = nurseSpecificPrefs.some((p) => {
                                if (p.kind !== 'SPECIALTY') return false;
                                if (selDocSpecIds.includes(p.refId)) return true;
                                const pRefLower = p.refId.toLowerCase();
                                for (const sid of selDocSpecIds) {
                                  const sObj = specialtyMap.get(sid);
                                  if (sObj) {
                                    if (
                                      pRefLower === sObj.code.toLowerCase() ||
                                      pRefLower === sObj.name.toLowerCase() ||
                                      (sObj.code.toLowerCase() === 'pcc' && pRefLower.includes('pcc')) ||
                                      (sObj.code.toLowerCase() === 'ped' && (pRefLower.includes('ped') || pRefLower.includes('pedia')))
                                    ) {
                                      return true;
                                    }
                                  }
                                }
                                return false;
                              });

                              if (!matchesDoc && !matchesSpec) {
                                isMismatch = true;
                                warnText = `${selDoc ? withDr(selDoc.fullName) : 'This doctor'} is not one of ${activeNurse?.fullName}'s usual doctors or departments. This will show as a problem.`;
                              }
                            } else if (editorKind === 'SPECIALTY') {
                              const selSpec = specialties.find((s) => s.id === editorTargetRefId);
                              const matchesSpec = nurseSpecificPrefs.some((p) => {
                                if (p.kind !== 'SPECIALTY') return false;
                                if (p.refId === editorTargetRefId) return true;
                                if (selSpec) {
                                  const pRefLower = p.refId.toLowerCase();
                                  if (
                                    pRefLower === selSpec.code.toLowerCase() ||
                                    pRefLower === selSpec.name.toLowerCase() ||
                                    (selSpec.code.toLowerCase() === 'pcc' && pRefLower.includes('pcc')) ||
                                    (selSpec.code.toLowerCase() === 'ped' && (pRefLower.includes('ped') || pRefLower.includes('pedia')))
                                  ) {
                                    return true;
                                  }
                                }
                                return false;
                              });

                              if (!matchesSpec) {
                                isMismatch = true;
                                warnText = `${selSpec?.name || 'This department'} is not one of ${activeNurse?.fullName}'s usual departments. This will show as a problem.`;
                              }
                            }

                            if (isMismatch) {
                              return (
                                <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-900 text-xs flex items-start gap-2 mb-2 animate-in fade-in duration-100">
                                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-semibold block text-[11px]">
                                      Not one of this nurse’s usual doctors
                                    </span>
                                    <span className="text-[10px] text-rose-800 leading-tight block">
                                      {warnText}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          }
                          return null;
                        })()}
                        <div className="grid grid-cols-3 gap-1.5 mb-2">
                          {(['DOCTOR', 'CLINICAL_ROLE', 'SPECIALTY'] as AssignmentKind[]).map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => {
                                setEditorKind(k);
                                if (k === 'DOCTOR') setEditorTargetRefId(doctors[0]?.id || '');
                                if (k === 'CLINICAL_ROLE') setEditorTargetRefId(roles[0]?.id || '');
                                if (k === 'SPECIALTY') setEditorTargetRefId(specialties[0]?.id || '');
                              }}
                              className={`py-1.5 rounded-md border text-xs font-semibold cursor-pointer text-center transition-all ${
                                editorKind === k
                                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {k === 'CLINICAL_ROLE' ? (isTargetExclusiveNC ? 'Clinic task (Nurse Clinic)' : 'Clinic task') : k === 'DOCTOR' ? 'With a doctor' : 'Department (any doctor)'}
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}

                  <select
                    aria-label="Who or what the nurse works with"
                    value={editorTargetRefId}
                    onChange={(e) => setEditorTargetRefId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-medium text-slate-800"
                  >
                    {editorKind === 'DOCTOR' &&
                      doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.fullName} ({specialties.find((s) => s.id === d.specialtyIds[0])?.name || 'Clinic'})
                        </option>
                      ))}
                    {editorKind === 'CLINICAL_ROLE' &&
                      roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.acronym}) · {r.defaultStartTime || '09:00'} to {r.defaultEndTime || '13:00'}
                        </option>
                      ))}
                    {editorKind === 'SPECIALTY' &&
                      specialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code}), any doctor
                        </option>
                      ))}
                  </select>
                  {(() => {
                    const activeNurse = editorTarget ? nurseMap.get(editorTarget.nurseId) : undefined;
                    const nurseSpecificPrefs = activeNurse?.preferences?.filter(
                      (p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY'
                    ) || [];
                    if (nurseSpecificPrefs.length > 0) {
                      const tags = nurseSpecificPrefs.map((p) => {
                        if (p.kind === 'DOCTOR') {
                          const doc = doctorMap.get(p.refId);
                          return `${doc ? withDr(doc.fullName) : 'A doctor'} (#${p.rank})`;
                        } else {
                          const sp = specialtyMap.get(p.refId);
                          return `${sp ? sp.name : 'Specialty'} (#${p.rank})`;
                        }
                      }).join(', ');
                      return (
                        <div className="mt-1 text-[10px] text-indigo-700 bg-indigo-50/60 rounded px-2 py-0.5 border border-indigo-100">
                          <strong>Usually works with:</strong> {tags}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            )}

            {/* LEAVE / DAY OFF CONFIGURATION */}
            {editorCategory === 'LEAVE' && (
              <div className="space-y-3.5 animate-in fade-in duration-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    1. Choose the leave or day off
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {leaveTypes.map((lt) => {
                      const isSelected = editorLeaveTypeId === lt.id;
                      return (
                        <button
                          key={lt.id}
                          type="button"
                          onClick={() => setEditorLeaveTypeId(lt.id)}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className="font-bold text-[10px] px-1.5 py-0.5 rounded text-white"
                              style={{ backgroundColor: lt.color || '#f59e0b' }}
                            >
                              {lt.acronym}
                            </span>
                            <span className="font-bold text-slate-800 text-xs truncate">
                              {lt.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            {typeof lt.creditedHours === 'number' ? `${lt.creditedHours} h a day` : '8 h a day'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {(() => {
                  const lt = leaveTypes.find((l) => l.id === editorLeaveTypeId);
                  if (lt && lt.countsTowardHoursTarget === false) {
                    return <p className="text-[11px] text-slate-500">This leave doesn't count toward the hours goal.</p>;
                  }
                  const def = typeof lt?.creditedHours === 'number' ? lt.creditedHours : 8;
                  return (
                    <div>
                      <label htmlFor="editor-leave-hours" className="block font-semibold text-slate-700 mb-1">
                        Hours counted for this day
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="editor-leave-hours"
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          value={editorLeaveHours}
                          onChange={(e) => setEditorLeaveHours(e.target.value)}
                          placeholder={String(def)}
                          className="w-20 px-2 py-1 border border-slate-300 rounded font-mono text-center"
                        />
                        <span className="text-[11px] text-slate-500">
                          {editorLeaveHours.trim() === ''
                            ? `Default: ${def} h (Settings > Leave types)`
                            : `Only this day, for this nurse. Default is ${def} h.`}
                        </span>
                        {editorLeaveHours.trim() !== '' && (
                          <button
                            type="button"
                            onClick={() => setEditorLeaveHours('')}
                            className="text-[11px] text-indigo-700 underline cursor-pointer"
                          >
                            Use default
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Kept when the roster is filled again (pinned) */}
            <div className="pt-2 border-t border-slate-100">
              <label htmlFor="editor-keep-cell" className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                <input
                  id="editor-keep-cell"
                  type="checkbox"
                  checked={!editorAllowOverwrite}
                  onChange={(e) => setEditorAllowOverwrite(!e.target.checked)}
                  aria-describedby="editor-keep-cell-help"
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <Lock className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>Keep this when the roster is filled again</span>
              </label>
              <p id="editor-keep-cell-help" className="text-[11px] text-slate-500 mt-1 ml-6">
                Ticked, this day is pinned and Fill roster leaves it as it is. Not ticked, Fill roster may change it.
              </p>
            </div>

            {/* Note */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Note (optional)
              </label>
              <input
                type="text"
                value={editorNote}
                onChange={(e) => setEditorNote(e.target.value)}
                aria-label="Note (optional)"
                placeholder="For example: swapped with Fatma"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (editorTarget) {
                    handleDeleteCellAssignment(editorTarget.nurseId, editorTarget.date);
                  }
                }}
                className="text-red-600 hover:text-red-700 font-semibold cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditorAssignment}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold cursor-pointer shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- RIGHT CLICK CONTEXT MENU --- */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white border border-slate-200 rounded shadow-xl py-1 text-xs w-44 animate-in fade-in duration-75"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            onClick={() => {
              handleCellDoubleClick(contextMenu.nurseId, contextMenu.date);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer flex items-center gap-2"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>More options…</span>
          </button>
          <button
            onClick={() => {
              const asgn = assignments.find(
                (a) => a.nurseId === contextMenu.nurseId && a.date === contextMenu.date
              );
              if (asgn) setClipboardAssignment(asgn);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Copy</span>
          </button>
          <button
            disabled={!clipboardAssignment}
            onClick={() => {
              handlePasteAssignment(contextMenu.nurseId, contextMenu.date);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Paste</span>
          </button>
          <div className="h-px bg-slate-100 my-1" />
          <button
            onClick={() => {
              handleDeleteCellAssignment(contextMenu.nurseId, contextMenu.date);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* --- SMALL POPUP NEXT TO A CLICKED CELL --- */}
      {quickPopup && !isEditorOpen && (() => {
        const { nurseId, date } = quickPopup;
        const lock = locks.find((l) => l.nurseId === nurseId && l.date === date);
        const hasContent =
          !!lock ||
          assignments.some((a) => a.nurseId === nurseId && a.date === date) ||
          leaveEntries.some((le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate);
        const options = lock ? { work: [], leave: [] } : buildQuickOptions(nurseId, date);
        // An empty cell says why: the nurse is off, or which shifts she is free for.
        let dayNote: QuickDayNote | undefined;
        if (!hasContent) {
          const why = explainNurseDay({
            nurseId,
            date,
            schedule,
            assignments,
            nurses,
            dutyWindows,
            leaveEntries,
            locks,
            roles,
            rules,
            seniorityLevels,
            workingHoursPeriods,
            leaveTypes,
            sessions,
            doctors,
            priorAssignments,
            availabilityRequests,
          });
          // Requests and leave waiting for approval are shown in their own line at the top.
          const notes = why.notes.filter((n) => !/^(Asked for this day off|Has leave waiting for approval)/.test(n));
          if (why.status === 'BLOCKED') {
            dayNote = { tone: 'off', title: 'Why this nurse is off:', lines: why.reasons };
          } else if (why.status === 'AVAILABLE') {
            const h = why.hours.goal > 0 ? `${fmtHours(why.hours.worked)} / ${fmtHours(why.hours.goal)} h` : `${fmtHours(why.hours.worked)} h`;
            dayNote = {
              tone: 'free',
              title: `Free to work: ${why.possibleShifts.map((p) => p.label).join(', ')} (${h})`,
              lines: notes,
            };
          }
        }
        const wish = wishesOn(nurseId, date);
        const wishes: QuickWish[] = [];
        if (wish.pendingLeave) {
          wishes.push({ text: `${wish.pendingLeaveText}${wish.pendingLeave.note ? `: ${wish.pendingLeave.note}` : ''}`, notFollowed: false });
        }
        if (wish.request && wish.requestWords) {
          wishes.push({
            text: `${wish.requestWords.text}${wish.request.note ? `: ${wish.request.note}` : ''}`,
            notFollowed: wish.requestWords.mismatch,
          });
        }
        return (
          <QuickCellPopup
            key={cellKeyOf(nurseId, date)}
            cellKey={cellKeyOf(nurseId, date)}
            nurseName={nurseMap.get(nurseId)?.fullName || 'Nurse'}
            dateLabel={formatDate(date)}
            currentLabel={describeCell(nurseId, date)}
            problems={cellViolationMessages.get(`${nurseId}_${date}`) || []}
            dayNote={dayNote}
            wishes={wishes}
            pinned={!!lock}
            onUnpin={
              lock && onOpenLockOverrideModal
                ? () => {
                    closePopupToCell();
                    onOpenLockOverrideModal(lock);
                  }
                : undefined
            }
            workOptions={options.work}
            leaveOptions={options.leave}
            onClear={
              hasContent
                ? () => {
                    closePopupToCell();
                    void handleDeleteCellAssignment(nurseId, date);
                  }
                : undefined
            }
            onMore={() => {
              // Focus the cell first so closing the editor brings focus back to it.
              closePopupToCell();
              openCellEditor(nurseId, date);
            }}
            onClose={() => setQuickPopup(null)}
            focusOnOpen={quickPopup.focusOnOpen}
          />
        );
      })()}
    </div>
  );
};
