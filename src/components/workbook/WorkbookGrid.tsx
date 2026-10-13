import type { HoursHistory } from '../../services/hours/hoursBalance';
import { isWeekendDay } from '../../utils/weekend';
import React, { memo, useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
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
  AssignmentSource,
  WorkingHoursPeriod,
  AvailabilityRequest,
} from '../../types';
import { ValidationReport, ValidationFinding } from '../../services/validation/ScheduleValidator';
import { calculateDutyDurationHours, summarizeNurseHours, NurseHoursSummary } from '../../services/reports/hoursAccounting';
import { formatDate } from '../../utils/dateUtils';
import { isExclusiveNurseClinic } from '../../services/engine/nurseClinicUtils';
import { applyPreferenceFocus } from '../../services/engine/preferenceOrder';
import { confirmDialog, notify } from '../common/dialogs';
import { coveredMinutes, doctorSessionsOn, nurseClinicRoleOf, toMinutes } from '../../services/engine/clinicModel';
import { isFloatShift } from '../../services/engine/floatShift';
import { QuickCellPopup, QuickWorkOption, QuickLeaveOption, QuickDayNote, QuickWish } from './grid/QuickCellPopup';
import { GridRowActions, rowViewsOf } from './grid/GridRow';
import { dayTotalsOf } from './grid/dayTotals';
import { SelectionView } from './grid/SelectionView';
import { GridStatusBar } from './grid/GridStatusBar';
import { GridLegend } from './grid/GridLegend';
import { GridToolbar } from './grid/GridToolbar';
import { GridTable } from './grid/GridTable';
import { CellEditorDialog, type CellChoice } from './grid/CellEditorDialog';
import { useGridSelection } from './grid/useGridSelection';
import { useGridKeyboard } from './grid/useGridKeyboard';
import { useRowsInSteps } from './grid/rowsInSteps';
import { CellContextMenu } from './grid/CellContextMenu';
import { CellView, cellLookupsOf, cellViewOf, reuseCellViews } from './grid/cellView';
import { HOURS_COLUMN, PopupRef, TOTALS_ROW, createGridSelection } from './grid/gridSelection';
import { describeRequest, explainNurseDay, isPendingLeave, pendingLeaveOn, requestOn, RequestWords } from '../../services/engine/explainCell';

interface WorkbookGridProps {
  schedule: Schedule;
  workingHoursPeriods?: WorkingHoursPeriod[];
  hoursHistory?: HoursHistory;
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
  onNavigateTab?: (tab: 'roster' | 'doctors' | 'coverage' | 'warnings' | 'leave') => void;
  isAllDaysExpanded?: boolean;
  onToggleExpandDays?: () => void;
  /**
   * Go to a cell from outside the grid: select it, scroll it into view and flash it.
   * Change the nonce to ask again for the same cell. The page showing the grid makes
   * sure the right days are shown first; the grid waits a few frames for the cell.
   */
  focusRequest?: { nurseId: string; date: string; nonce: number };
  /** The nurses' requests for this roster (a day off or a shift), shown as small marks in the cells. */
  availabilityRequests?: AvailabilityRequest[];
  /**
   * False while another sheet is open: the grid stays mounted (zoom, selection and scroll are
   * kept, and coming back does not build it again) but is hidden and takes no keys.
   */
  isActive?: boolean;
}

/** Hours rounded for reading: whole hours, or one decimal when needed. */
const fmtHours = (n: number): string => String(Math.round(n * 10) / 10);

/** A day as YYYY-MM-DD in the viewer's own time zone. */
const localTodayIso = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const cellKeyOf = (nurseId: string, date: string) => `${nurseId}|${date}`;

/** Problems about a whole day (not one nurse's shift), shown on the day's heading. */
const DAY_PROBLEM_IDS = /^(cov-gap-|h1-senior-|evening-tail-|holiday-|nc-coverage-|role-quota-|session-partial-|unassigned-session-)/;
const isDayProblem = (f: ValidationFinding) => DAY_PROBLEM_IDS.test(f.id);

const WorkbookGridView: React.FC<WorkbookGridProps> = ({
  workingHoursPeriods = [],
  hoursHistory,
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
  focusRequest,
  availabilityRequests = [],
  isActive = true,
}) => {
  // Navigation & Zoom (Supports 75% compact fit, 90%, 100%, 115%)
  const [zoomLevel, setZoomLevel] = useState<75 | 90 | 100 | 115>(100);
  const [groupBy, setGroupBy] = useState<'NONE' | 'SENIORITY'>('NONE');
  const [highlightViolations, setHighlightViolations] = useState(true);

  // The selected cell, its popup and the cell flashed after "Show in grid" live in a small
  // store, not in this component's state, so a key press draws only the cells it changes.
  const [selection] = useState(createGridSelection);
  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  // Inline Editor Popover
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTarget, setEditorTarget] = useState<{ nurseId: string; date: string } | null>(null);
  // What the editor starts with (`CellEditorDialog` keeps the choice while it is open).
  const [editorDefaults, setEditorDefaults] = useState<CellChoice | null>(null);

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

  // The days shown, the same arrays from one render to the next while they do not change.
  const scheduleStart = schedule.startDate;
  const blockDates = useMemo(() => {
    const first = new Date(scheduleStart);
    const dates: string[] = [];
    for (let day = blockStartDay; day <= blockEndDay; day++) {
      const d = new Date(first);
      d.setUTCDate(first.getUTCDate() + (day - 1));
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [scheduleStart, blockStartDay, blockEndDay]);

  // Day columns: weekend (clinic setting), public holiday and today
  const todayIso = localTodayIso();
  const holidayByDate = useMemo(() => new Map(holidays.map((h) => [h.date, h])), [holidays]);
  const dayInfo = useMemo(() => {
    return blockDates.map((dateStr) => {
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
  }, [blockDates, holidayByDate, todayIso]);

  // Lookup maps
  const cellLookups = useMemo(
    () => cellLookupsOf({ dutyWindows, doctors, roles, specialties, leaveTypes }),
    [dutyWindows, doctors, roles, specialties, leaveTypes]
  );
  const { dutyMap, doctorMap, specialtyMap, roleMap } = cellLookups;
  const nurseMap = useMemo(() => new Map(nurses.map((n) => [n.id, n])), [nurses]);
  const seniorityMap = useMemo(() => new Map(seniorityLevels.map((s) => [s.id, s])), [seniorityLevels]);

  // Problems from the roster check, by where they show on the grid:
  //  - about one cell (a shift on leave, too little rest...): a red corner on that cell;
  //  - about a whole day (no free nurse, no senior nurse, a doctor with no nurse...):
  //    a badge on that day's heading, not a mark on every shift of the day;
  //  - about a nurse (hours, no email): a mark by the nurse's name.
  const { cellViolationMessages, cellMustFix, dayProblems, nurseProblems } = useMemo(() => {
    const cellViolationMessages = new Map<string, string[]>();
    // Cells with a problem that must be fixed (the others are to check).
    const cellMustFix = new Set<string>();
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
        if (f.severity === 'ERROR') cellMustFix.add(k);
      });
    });
    return { cellViolationMessages, cellMustFix, dayProblems, nurseProblems };
  }, [validationReport]);

  // Group nurses if requested
  const displayNurses = useMemo(
    () =>
      [...nurses].sort((a, b) => {
        if (groupBy === 'SENIORITY') {
          const rankA = seniorityMap.get(a.seniorityLevelId)?.rank || 99;
          const rankB = seniorityMap.get(b.seniorityLevelId)?.rank || 99;
          if (rankA !== rankB) return rankA - rankB;
        }
        return a.fullName.localeCompare(b.fullName);
      }),
    [nurses, groupBy, seniorityMap]
  );

  // Hours per nurse, counted by the shared rule (same as the Hours tab, emails and PDF).
  const leaveTypeMap = useMemo(() => new Map(leaveTypes.map((l) => [l.id, l])), [leaveTypes]);
  const hoursByNurse = useMemo(() => {
    const map = new Map<string, NurseHoursSummary>();
    for (const n of nurses) {
      map.set(n.id, summarizeNurseHours(n, schedule, assignments, dutyMap, leaveEntries, leaveTypeMap, workingHoursPeriods, undefined, hoursHistory));
    }
    return map;
  }, [nurses, schedule, assignments, dutyMap, leaveEntries, leaveTypeMap, workingHoursPeriods, hoursHistory]);

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
        }, hoursHistory)
      );
    }
    return map;
  }, [nurses, schedule, assignments, dutyMap, leaveEntries, leaveTypeMap, workingHoursPeriods, hoursHistory, blockStart, blockEnd]);

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

  // What each cell shows, worked out once per change of the roster, its problems or the days
  // shown. A view that did not change stays the same object, so its cell is not drawn again.
  const previousViewsRef = useRef<Map<string, CellView> | undefined>(undefined);
  const cellViews = useMemo(() => {
    const views = new Map<string, CellView>();
    for (const nurse of displayNurses) {
      for (const day of dayInfo) {
        const date = day.dateStr;
        const leave = approvedLeaveOn(nurse.id, date);
        const view = cellViewOf(
          {
            nurse,
            day,
            assignment: assignmentOn(nurse.id, date),
            lock: lockOn(nurse.id, date),
            leave,
            pendingLeave: leave ? undefined : waitingLeaveOn(nurse.id, date),
            request: cellRequestOn(nurse.id, date),
            problems: cellViolationMessages.get(`${nurse.id}_${date}`) || [],
            problemsMustFix: cellMustFix.has(`${nurse.id}_${date}`),
          },
          cellLookups
        );
        views.set(view.key, view);
      }
    }
    return reuseCellViews(previousViewsRef.current, views);
  }, [displayNurses, dayInfo, assignmentByCell, lockByCell, leaveByCell, requestsByCell, leaveEntries, availabilityRequests, cellViolationMessages, cellMustFix, cellLookups]);
  previousViewsRef.current = cellViews;
  // What a cell holds, for the line under the grid: the first part of its spoken name.
  const cellWords = useCallback((nurseId: string, date: string) => previousViewsRef.current?.get(cellKeyOf(nurseId, date))?.ariaLabel.split('. ')[0] || '', []);

  // The Tab stop is the selected cell when it is on the days shown, else the first cell.
  const firstCellKey = displayNurses[0] && blockDates[0] ? cellKeyOf(displayNurses[0].id, blockDates[0]) : null;
  const shownCellKeys = useMemo(
    () =>
      new Set([
        ...displayNurses.flatMap((n) => [...blockDates, HOURS_COLUMN].map((d) => cellKeyOf(n.id, d))),
        ...blockDates.map((d) => cellKeyOf(TOTALS_ROW, d)),
      ]),
    [displayNurses, blockDates]
  );
  selection.setLayout(firstCellKey, shownCellKeys);

  // Each nurse's cells as one list, kept while none of them changed (so the row is not drawn again).
  const previousRowsRef = useRef<Map<string, CellView[]> | undefined>(undefined);
  const rowViews = useMemo(
    () => rowViewsOf(cellViews, displayNurses.map((n) => n.id), blockDates, previousRowsRef.current),
    [cellViews, displayNurses, blockDates]
  );
  previousRowsRef.current = rowViews;
  // Cells that kept their props but gained or lost the Tab stop are told once the grid is drawn.
  useLayoutEffect(() => selection.flushLayout());

  // Day totals under the grid: doctors in session, nurses on duty, hours without a free nurse, senior on duty.
  const dayTotals = useMemo(
    () => dayTotalsOf(blockDates, assignments, sessions, nurses, seniorityLevels, validationReport.hourlyCoverageMap),
    [blockDates, assignments, sessions, nurses, seniorityLevels, validationReport]
  );

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
    selection.select({ nurseId, date });
    selection.closePopup();
    setContextMenu(null);
    setEditorTarget({ nurseId, date });

    setEditorDefaults(computeEditorDefaults(nurseId, date));
    setIsEditorOpen(true);
  };

  // Cell Click / Navigation: a click selects the cell and opens the small popup
  const openQuickPopup = (nurseId: string, date: string, focusOnOpen = false) => {
    setContextMenu(null);
    selection.openPopup({ nurseId, date, focusOnOpen });
  };

  const handleCellClick = (nurseId: string, date: string) => {
    openQuickPopup(nurseId, date);
  };

  const handleCellDoubleClick = (nurseId: string, date: string) => {
    openCellEditor(nurseId, date);
  };

  // Hidden while another sheet is open: the popup and the right click menu close, so they
  // do not take the next Esc on that sheet or come back with the grid.
  useEffect(() => {
    if (isActive) return;
    selection.closePopup();
    setContextMenu(null);
  }, [isActive]);

  // Focus follows the selection, and "Show in grid" brings a cell into view (`useGridSelection`).
  const { findCellElement } = useGridSelection({ selection, tableRef, gridScrollRef, focusRequest, onRequest: () => setContextMenu(null) });

  // Keys on the grid: arrows and Tab move, Enter, Space, Delete, copy and paste (`useGridKeyboard`).
  const onGridKeyDown = useGridKeyboard({
    selection,
    enabled: isActive && !isEditorOpen,
    // The arrow keys go on to the nurses' hours and the days' totals.
    nurseIds: [...displayNurses.map((n) => n.id), TOTALS_ROW],
    dates: [...blockDates, HOURS_COLUMN],
    onEnter: handleCellDoubleClick,
    onSpace: (nurseId, date) => openQuickPopup(nurseId, date, true),
    onDelete: (nurseId, date) => handleDeleteCellAssignment(nurseId, date),
    onCopy: (nurseId, date) => {
      const asgn = assignmentOn(nurseId, date);
      if (asgn) setClipboardAssignment(asgn);
    },
    onPaste: (nurseId, date) => {
      if (clipboardAssignment) handlePasteAssignment(nurseId, date);
    },
  });

  // Context Menu
  const handleContextMenu = (e: React.MouseEvent, nurseId: string, date: string) => {
    e.preventDefault();
    selection.select({ nurseId, date });
    selection.closePopup();
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
      // A public holiday counts 0 h unless hours are typed: the period hours already leave it out.
      const dayHoursOverride =
        ownHours !== undefined ? (ownHours !== defaultHours ? ownHours : undefined) : holidayByDate.has(date) ? 0 : undefined;
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
  const handleSaveEditorAssignment = async (choice: CellChoice) => {
    if (!editorTarget) return;
    const saved = await saveCellChoice(editorTarget, choice);
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
    const { popup } = selection.getState();
    if (popup) findCellElement(cellKeyOf(popup.nurseId, popup.date))?.focus({ preventScroll: true });
    selection.closePopup();
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

  // The cells' actions: one object for the life of the grid, calling the latest handlers,
  // so a memoized cell is not drawn again because a handler was made anew.
  const cellHandlersRef = useRef<GridRowActions | null>(null);
  cellHandlersRef.current = {
    click: handleCellClick,
    doubleClick: handleCellDoubleClick,
    contextMenu: handleContextMenu,
    select: (nurseId, date) => selection.select({ nurseId, date }),
    openProblems: () => onNavigateTab && onNavigateTab('warnings'),
  };
  const cellActions = useMemo<GridRowActions>(
    () => ({
      click: (nurseId, date) => cellHandlersRef.current!.click(nurseId, date),
      doubleClick: (nurseId, date) => cellHandlersRef.current!.doubleClick(nurseId, date),
      contextMenu: (e, nurseId, date) => cellHandlersRef.current!.contextMenu(e, nurseId, date),
      select: (nurseId, date) => cellHandlersRef.current!.select(nurseId, date),
      openProblems: () => cellHandlersRef.current!.openProblems(),
    }),
    []
  );

  // Zoom sizing classes
  // Cells 44 px high and 64 px wide at 100 % (the design system asks for at least 60; 64 fits a problem's icon with the start time), smaller or larger with the zoom.
  const cellHeightClass = zoomLevel === 75 ? 'h-8' : zoomLevel === 90 ? 'h-9' : zoomLevel === 115 ? 'h-12' : 'h-11';
  const cellFontSizeClass = zoomLevel === 75 ? 'text-[10px]' : zoomLevel === 90 ? 'text-[11px]' : zoomLevel === 115 ? 'text-sm' : 'text-xs';
  const rowLimit = useRowsInSteps(displayNurses.length, schedule.id);
  const dayWidth = zoomLevel === 75 ? 50 : zoomLevel === 90 ? 56 : zoomLevel === 115 ? 76 : 64;

  return (
    <div className={`flex flex-col h-full overflow-hidden bg-slate-100 font-sans select-none ${isActive ? '' : 'hidden'}`}>
      {/* 6.1 Shared Toolbar ("Ribbon-Lite", Row 2: Edit Ops & Block Nav) */}
      <GridToolbar
        isAllDaysExpanded={isAllDaysExpanded}
        currentBlockIndex={currentBlockIndex}
        numBlocks={numBlocks}
        totalDays={totalDays}
        blockDates={blockDates}
        blockWeeks={schedule.blockWeeks}
        onBlockChange={onBlockChange}
        onToggleExpandDays={onToggleExpandDays}
        groupBy={groupBy}
        onGroupBy={setGroupBy}
        showProblems={highlightViolations}
        onToggleMarks={() => setHighlightViolations(!highlightViolations)}
        zoomLevel={zoomLevel}
        onZoom={setZoomLevel}
        isKeyOpen={isLegendDrawerOpen}
        onToggleKey={() => setIsLegendDrawerOpen(!isLegendDrawerOpen)}
      />

      {/* 6.2 ROSTER SHEET MAIN GRID VIEWPORT */}
      <div className="flex-1 flex overflow-hidden relative">
        <div ref={gridScrollRef} onKeyDown={onGridKeyDown} className="flex-1 overflow-auto bg-slate-200 p-px scroll-pb-16">
          <GridTable
            tableRef={tableRef}
            dayInfo={dayInfo}
            blockDates={blockDates}
            isAllDaysExpanded={isAllDaysExpanded}
            totalDays={totalDays}
            currentBlockIndex={currentBlockIndex}
            blockWeeks={schedule.blockWeeks}
            displayNurses={displayNurses}
            rowLimit={rowLimit}
            seniorityMap={seniorityMap}
            rowViews={rowViews}
            hoursByNurse={hoursByNurse}
            blockHoursByNurse={blockHoursByNurse}
            dayProblems={dayProblems}
            nurseProblems={nurseProblems}
            dayTotals={dayTotals}
            showProblems={highlightViolations}
            heightClass={cellHeightClass}
            fontClass={cellFontSizeClass}
            dayWidth={dayWidth}
            selection={selection}
            actions={cellActions}
          />
        </div>

        {/* The Key drawer beside the grid */}
        {isLegendDrawerOpen && <GridLegend dutyWindows={dutyWindows} leaveTypes={leaveTypes} onClose={() => setIsLegendDrawerOpen(false)} />}
      </div>

      {/* Footer Status Bar */}
      <GridStatusBar
        selection={selection}
        nurseMap={nurseMap}
        firstDate={blockDates[0] || schedule.startDate}
        cellWords={cellWords}
        validationReport={validationReport}
        onOpenCoverage={() => onNavigateTab && onNavigateTab('coverage')}
        onOpenProblems={() => onNavigateTab && onNavigateTab('warnings')}
      />

      {/* --- INLINE CELL SHIFT & LEAVE EDITOR MODAL --- */}
      {isEditorOpen && editorTarget && editorDefaults && (
        <CellEditorDialog
          key={cellKeyOf(editorTarget.nurseId, editorTarget.date)}
          editorTarget={editorTarget}
          defaults={editorDefaults}
          nurseMap={nurseMap}
          doctors={doctors}
          doctorMap={doctorMap}
          dutyWindows={dutyWindows}
          leaveTypes={leaveTypes}
          roles={roles}
          specialties={specialties}
          specialtyMap={specialtyMap}
          holidayByDate={holidayByDate}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveEditorAssignment}
          onClear={() => handleDeleteCellAssignment(editorTarget.nurseId, editorTarget.date)}
        />
      )}

      {/* --- RIGHT CLICK CONTEXT MENU --- */}
      {contextMenu && (
        <CellContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          canPaste={!!clipboardAssignment}
          onClose={() => setContextMenu(null)}
          onMore={() => handleCellDoubleClick(contextMenu.nurseId, contextMenu.date)}
          onCopy={() => {
            const asgn = assignments.find((a) => a.nurseId === contextMenu.nurseId && a.date === contextMenu.date);
            if (asgn) setClipboardAssignment(asgn);
          }}
          onPaste={() => handlePasteAssignment(contextMenu.nurseId, contextMenu.date)}
          onClear={() => handleDeleteCellAssignment(contextMenu.nurseId, contextMenu.date)}
        />
      )}

      {/* --- SMALL POPUP NEXT TO A CLICKED CELL --- */}
      <SelectionView selection={selection} render={({ popup }) => popup && !isEditorOpen && renderQuickPopup(popup)} />
    </div>
  );

  /** The popup next to a clicked cell, drawn by `SelectionView` whenever it opens or moves. */
  function renderQuickPopup(quickPopup: PopupRef) {
    const { nurseId, date } = quickPopup;
    const lock = locks.find((l) => l.nurseId === nurseId && l.date === date);
    const hasContent =
      !!lock ||
      assignments.some((a) => a.nurseId === nurseId && a.date === date) ||
      leaveEntries.some((le) => le.nurseId === nurseId && le.approved && date >= le.startDate && date <= le.endDate);
    const options = lock ? { work: [], leave: [] } : buildQuickOptions(nurseId, date);
    // An empty cell says why: the nurse is off, or which shifts the nurse is free for.
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
        hoursHistory,
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
        onClose={() => selection.closePopup()}
        focusOnOpen={quickPopup.focusOnOpen}
      />
    );
  }
};

/**
 * The roster grid, drawn again only when its own props change: the roster screen passes
 * stable handlers, so its other updates (saving, presence, fill progress) leave the grid alone.
 */
export const WorkbookGrid = memo(WorkbookGridView);
