import { leaveCreditInRange } from '../../services/hours/hoursPolicy';
import { planHolidayLeaveTidy, saveHolidayLeave, withHolidaysAtZero } from '../../services/hours/holidayLeave';
import { leaveApprovalFields } from '../../services/engine/leaveStatus';
import { confirmDialog, notify, type NoticeTone } from '../common/dialogs';
import { Button, DateInput, Dialog, Field, IconButton, Input, Notice, PageHeader, Select, Switch, Tabs, Textarea, cx } from '../ui';
import { moveInGrid, pickStep, type GridCell } from '../../services/availability/leaveGridPick';
import { leaveClash } from '../../services/availability/leaveClash';
import { planLeaveImport } from '../../services/availability/leaveImport';
import { allowanceFor } from '../../services/hours/leaveAllowance';
import { readableTextOn } from '../../utils/colorContrast';
import { isWeekendDay } from '../../utils/weekend';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Lock,
  Plus,
  Upload,
  Flag,
  Pin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
} from 'lucide-react';
import { ClinicContextState } from '../../types/navigation';
import { getRepository } from '../../services/repository';
import {
  Nurse,
  LeaveType,
  LeaveEntry,
  LockEntry,
  DutyWindow,
  Doctor,
  Specialty,
  ClinicalRole,
  PublicHoliday,
  IsoDateString,
} from '../../types';
import { formatDate, formatDayDate } from '../../utils/dateUtils';
import { countPendingApprovals, decideRequest } from '../../services/requests/staffRequestService';
import { canApproveRequests, canEditClinicData } from '../../services/auth/access';
import { authService } from '../../services/auth/authService';
import { NurseSelfServicePanel } from './NurseSelfServicePanel';

interface AvailabilityViewProps {
  context: ClinicContextState;
}

const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AvailabilityView: React.FC<AvailabilityViewProps> = ({ context }) => {
  const currentUser = authService.getCurrentUser();
  const canEdit = canEditClinicData(currentUser);
  // Planners and managers approve requests and see every request, decided or not
  // (canApprove() in firestore.rules); the owner is a planner.
  const canManageRequests = canApproveRequests(currentUser);
  // Anyone who is not a planner sees only their own requests ("My requests"); deciding
  // requests moved to the Requests screen (UI overhaul Phase 6, slice 4).
  const onlyOwnRequests = !canEdit;
  // A planner who is also a nurse can ask for their own leave from a second tab.
  const ownRequestsTab = canEdit && !!currentUser?.linkedNurseId;
  const [activeTab, setActiveTab] = useState<'calendar' | 'self-service'>(canEdit ? 'calendar' : 'self-service');
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(0);

  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveEntries, setLeaveEntries] = useState<LeaveEntry[]>([]);
  const [locks, setLocks] = useState<LockEntry[]>([]);
  const [dutyWindows, setDutyWindows] = useState<DutyWindow[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [clinicalRoles, setClinicalRoles] = useState<ClinicalRole[]>([]);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);

  // Active Month & Period
  // Opens on the current month (it used to open on October 2026 whatever the date).
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => new Date().getMonth()); // 0-based

  // Drag selection state for date range leave creation
  const [dragStart, setDragStart] = useState<{ nurseId: string; day: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ nurseId: string; day: number } | null>(null);
  // The first day picked by a click, the day with the grid's one Tab stop, and what is read out.
  const [pickStart, setPickStart] = useState<GridCell | null>(null);
  const [gridFocus, setGridFocus] = useState<[number, number]>([0, 0]);
  const [gridStatus, setGridStatus] = useState('');
  const dragEndedRef = useRef(false);
  // Fewer nurses after a reload: the Tab stop moves to the last row, so the grid keeps it.
  useEffect(() => {
    setGridFocus(([r, c]) => [Math.max(0, Math.min(r, nurses.length - 1)), c]);
  }, [nurses.length]);
  // Another month: a leave half picked is dropped, and the Tab stop stays on the grid.
  useEffect(() => {
    setPickStart(null);
    setGridFocus(([r, c]) => [r, Math.min(c, 27)]);
  }, [currentMonthIndex, currentYear]);

  // Leave Entry Modal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [editingLeaveEntry, setEditingLeaveEntry] = useState<Partial<LeaveEntry> | null>(null);
  const [selectedCellDate, setSelectedCellDate] = useState<string | null>(null);
  const [leaveError, setLeaveError] = useState('');
  // A changed nurse, kind or date clears the last refusal.
  useEffect(() => setLeaveError(''), [editingLeaveEntry?.nurseId, editingLeaveEntry?.leaveTypeId, editingLeaveEntry?.startDate, editingLeaveEntry?.endDate, isLeaveModalOpen]);

  // Lock Entry Modal
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [editingLockEntry, setEditingLockEntry] = useState<Partial<LockEntry> | null>(null);

  // Lock Override Modal (when user clicks an existing lock)
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [activeLockToOverride, setActiveLockToOverride] = useState<LockEntry | null>(null);
  const [overrideInput, setOverrideInput] = useState('');

  // CSV Import Modal
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [csvImportLog, setCsvImportLog] = useState<{ added: number; messages: string[] } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Notification Toast
  const [isDeletingLeave, setIsDeletingLeave] = useState(false);
  const [isOverridingLock, setIsOverridingLock] = useState(false);

  const closeLeaveDialog = () => {
    setIsLeaveModalOpen(false);
    setEditingLeaveEntry(null);
    setSelectedCellDate(null);
  };
  const closeOverrideDialog = () => {
    // Not while the pin is being removed.
    if (isOverridingLock) return;
    setIsOverrideModalOpen(false);
    setActiveLockToOverride(null);
    setOverrideInput('');
  };

  const repo = getRepository();

  const loadData = async () => {
    try {
      const [nList, ltList, leList, lkList, dwList, dList, spList, crList, hList] =
        await Promise.all([
          repo.list('nurses'),
          repo.list('leaveTypes'),
          repo.list('leaveEntries'),
          repo.list('locks'),
          repo.list('dutyWindows'),
          repo.list('doctors'),
          repo.list('specialties'),
          repo.list('clinicalRoles'),
          repo.list('holidays'),
        ]);
      setNurses(nList.filter((n) => n.active));
      setLeaveTypes(ltList);
      setLeaveEntries(leList);
      setLocks(lkList);
      setDutyWindows(dwList);
      setDoctors(dList);
      setSpecialties(spList);
      setClinicalRoles(crList);
      setHolidays(hList);

      // People who approve requests see how many are waiting
      if (canManageRequests) {
        try {
          setPendingApprovalsCount(await countPendingApprovals());
        } catch {
          // ignore background count error
        }
      }
    } catch (err) {
      console.error('Failed to load availability data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg: string, tone: NoticeTone = 'success') => notify(msg, tone);

  // Month date helpers
  const daysInMonth = new Date(Date.UTC(currentYear, currentMonthIndex + 1, 0)).getUTCDate();
  const monthName = new Date(Date.UTC(currentYear, currentMonthIndex, 1)).toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });

  const todayObj = new Date();
  const todayYear = todayObj.getFullYear();
  const todayMonthIndex = todayObj.getMonth();
  const todayDateNumber = todayObj.getDate();
  const isViewingCurrentMonth = currentYear === todayYear && currentMonthIndex === todayMonthIndex;

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonthIndex(now.getMonth());
    setTimeout(() => {
      const todayEl = document.getElementById(`availability-day-${now.getDate()}`);
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 60);
  };

  const getIsoDate = (day: number): IsoDateString => {
    const dStr = String(day).padStart(2, '0');
    const mStr = String(currentMonthIndex + 1).padStart(2, '0');
    return `${currentYear}-${mStr}-${dStr}`;
  };

  const addDaysToIso = (dateStr: string, days: number): string => {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
  };

  // What a kind of leave counts, under its name in the leave editor.
  const leaveHoursHint = (lt?: LeaveType) => {
    if (!lt) return undefined;
    const hours = typeof lt.creditedHours === 'number' ? `Counts ${lt.creditedHours} h a day` : "Counts the hours of the nurse's shift each day";
    return lt.countsTowardHoursTarget === false ? `${hours}, outside the goal hours.` : `${hours}.`;
  };

  const countDaysBetween = (startStr: string, endStr: string): number => {
    const s = new Date(startStr + 'T00:00:00Z').getTime();
    const e = new Date(endStr + 'T00:00:00Z').getTime();
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
  };

  // Find leave for nurse on a specific date
  const findLeaveForNurseDate = (nurseId: string, isoDate: string): LeaveEntry | undefined => {
    return leaveEntries.find(
      (le) => le.nurseId === nurseId && isoDate >= le.startDate && isoDate <= le.endDate
    );
  };

  // Find lock for nurse on a specific date
  const findLockForNurseDate = (nurseId: string, isoDate: string): LockEntry | undefined => {
    return locks.find((lk) => lk.nurseId === nurseId && lk.date === isoDate);
  };

  // Calculate annual leave quota usage for a nurse in DAYS
  const getLeaveQuotaBadge = (nurse: Nurse, leaveType: LeaveType) => {
    // In days, as typed; none set is 0 (the owner's rules of 14-10-2026 and 17-10-2026).
    const quotaDays = allowanceFor(nurse, leaveType);
    if (quotaDays === null) return null;

    // Sum scheduled days for this nurse and leave type across the year
    const yearPrefix = `${currentYear}-`;
    const usedDays = leaveEntries
      .filter((le) => le.nurseId === nurse.id && le.leaveTypeId === leaveType.id && le.startDate.startsWith(yearPrefix))
      .reduce((sum, le) => sum + countDaysBetween(le.startDate, le.endDate), 0);

    const isExceeded = usedDays > quotaDays;
    const isFull = usedDays === quotaDays;

    return {
      text: `${usedDays}/${quotaDays}d`,
      usedDays,
      quotaDays,
      isExceeded,
      isFull,
    };
  };

  // Real-time quota analysis for the active Leave Entry modal
  const selectedNurseForLeave = nurses.find((n) => n.id === editingLeaveEntry?.nurseId);
  const selectedTypeForLeave = leaveTypes.find((l) => l.id === editingLeaveEntry?.leaveTypeId);

  const leaveQuotaInfo = useMemo(() => {
    if (!editingLeaveEntry || !selectedNurseForLeave || !selectedTypeForLeave) return null;
    const quotaDays = allowanceFor(selectedNurseForLeave, selectedTypeForLeave);
    if (quotaDays === null) return null;
    const start = editingLeaveEntry.startDate || '';
    const end = editingLeaveEntry.endDate || start;
    const year = start ? start.slice(0, 4) : String(currentYear);
    const yearPrefix = `${year}-`;

    const otherLeaves = leaveEntries.filter(
      (le) =>
        le.nurseId === selectedNurseForLeave.id &&
        le.leaveTypeId === selectedTypeForLeave.id &&
        le.startDate.startsWith(yearPrefix) &&
        le.id !== editingLeaveEntry.id
    );

    const alreadyUsedDays = otherLeaves.reduce(
      (sum, le) => sum + countDaysBetween(le.startDate, le.endDate),
      0
    );

    const requestedDays = start && end && start <= end ? countDaysBetween(start, end) : 0;
    const totalDaysAfter = alreadyUsedDays + requestedDays;
    const remainingDays = Math.max(0, quotaDays - alreadyUsedDays);
    const isExceeded = totalDaysAfter > quotaDays;
    const excessDays = totalDaysAfter - quotaDays;

    return {
      quotaDays,
      alreadyUsedDays,
      requestedDays,
      remainingDays,
      totalDaysAfter,
      isExceeded,
      excessDays,
      year,
    };
  }, [editingLeaveEntry, selectedNurseForLeave, selectedTypeForLeave, leaveEntries, currentYear]);

  // --- LEAVE ACTIONS ---
  const handleSaveLeaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeaveEntry || !editingLeaveEntry.nurseId || !editingLeaveEntry.leaveTypeId) return;

    // A refusal shows in the dialog, beside Save, not in a corner message (Phase 7).
    const start = editingLeaveEntry.startDate || '';
    const end = editingLeaveEntry.endDate || '';
    if (!start || !end) {
      setLeaveError(`Enter the ${!start ? 'first' : 'last'} day, like 19-10-2026.`);
      return;
    }
    if (start > end) {
      setLeaveError('The last day is before the first day.');
      return;
    }
    // A leave must not cover another leave or a pinned day of the same nurse (Checkpoint 6).
    const clash = leaveClash(editingLeaveEntry.nurseId, start, end, leaveEntries, locks, editingLeaveEntry.id);
    if (clash) {
      setLeaveError(clash);
      return;
    }

    const lt = leaveTypes.find((l) => l.id === editingLeaveEntry.leaveTypeId);
    const daySpan = countDaysBetween(start, end);
    const dailyCredit = lt ? (typeof lt.creditedHours === 'number' ? lt.creditedHours : 8) : 8;
    const totalCredits = dailyCredit * daySpan;

    // Strict Quota Ceiling Enforcement: Block save if quota would be exceeded
    if (leaveQuotaInfo && leaveQuotaInfo.isExceeded) return;

    // A public holiday inside the leave counts 0 h: the period hours already leave it out.
    const { dayHours } = withHolidaysAtZero({ startDate: start, endDate: end, dayHours: editingLeaveEntry.dayHours }, holidays);
    // The Approved / Pending switch sets both approval marks (roster and approval pages).
    const saved = editingLeaveEntry.id ? leaveEntries.find((l) => l.id === editingLeaveEntry.id) : undefined;
    const approval = leaveApprovalFields(editingLeaveEntry.approved ?? true, saved, currentUser);
    try {
      if (editingLeaveEntry.id) {
        await repo.update('leaveEntries', editingLeaveEntry.id, {
          nurseId: editingLeaveEntry.nurseId,
          leaveTypeId: editingLeaveEntry.leaveTypeId,
          startDate: start,
          endDate: end,
          note: editingLeaveEntry.note,
          ...approval,
          hoursCredited: totalCredits,
          ...(dayHours ? { dayHours } : {}),
        });
        triggerToast(`Leave changed: ${daySpan} ${daySpan === 1 ? 'day' : 'days'}, ${totalCredits} h counted.`);
      } else {
        await repo.create('leaveEntries', {
          nurseId: editingLeaveEntry.nurseId,
          leaveTypeId: editingLeaveEntry.leaveTypeId,
          startDate: start,
          endDate: end,
          note: editingLeaveEntry.note || '',
          ...approval,
          hoursCredited: totalCredits,
          ...(dayHours ? { dayHours } : {}),
        });
        triggerToast(`${lt?.name} recorded: ${daySpan} ${daySpan === 1 ? 'day' : 'days'}, ${totalCredits} h counted.`);
      }
      setIsLeaveModalOpen(false);
      setEditingLeaveEntry(null);
      setSelectedCellDate(null);
      loadData();
    } catch (err: any) {
      setLeaveError(`The leave was not saved: ${err.message}`);
    }
  };

  const handleDeleteLeave = async (entry: LeaveEntry) => {
    if (!entry || !entry.id || isDeletingLeave) return;
    setIsDeletingLeave(true);
    try {
      await repo.remove('leaveEntries', entry.id);
      setIsLeaveModalOpen(false);
      setEditingLeaveEntry(null);
      setSelectedCellDate(null);
      await loadData();
      triggerToast('Leave deleted. Other leaves stay as they are.');
    } catch (err: any) {
      console.error('Failed to delete leave entry:', err);
      triggerToast(`The leave was not deleted: ${err?.message || 'try again'}`, 'error');
    } finally {
      setIsDeletingLeave(false);
    }
  };

  /**
   * Deletes ONLY the clicked single day from a multi-day leave span,
   * preserving all other days of the leave (by advancing startDate,
   * regressing endDate, or splitting into two valid records).
   */
  const handleDeleteSingleDayFromLeave = async (entry: LeaveEntry, targetDate: string) => {
    if (!entry || !entry.id || isDeletingLeave) return;
    setIsDeletingLeave(true);
    try {
      const totalSpanDays = countDaysBetween(entry.startDate, entry.endDate);
      const hoursPerDay = entry.hoursCredited ? entry.hoursCredited / totalSpanDays : 8;

      if (entry.startDate === entry.endDate || totalSpanDays <= 1) {
        // Single day leave: simply remove this entry
        await repo.remove('leaveEntries', entry.id);
      } else if (entry.startDate === targetDate) {
        // Target is the first day: advance startDate by 1 day
        const newStart = addDaysToIso(entry.startDate, 1);
        const remainingDays = countDaysBetween(newStart, entry.endDate);
        await repo.update('leaveEntries', entry.id, {
          startDate: newStart,
          hoursCredited: Math.round(remainingDays * hoursPerDay),
        });
      } else if (entry.endDate === targetDate) {
        // Target is the last day: regress endDate by 1 day
        const newEnd = addDaysToIso(entry.endDate, -1);
        const remainingDays = countDaysBetween(entry.startDate, newEnd);
        await repo.update('leaveEntries', entry.id, {
          endDate: newEnd,
          hoursCredited: Math.round(remainingDays * hoursPerDay),
        });
      } else {
        // Target is in the middle: split into two distinct records
        const end1 = addDaysToIso(targetDate, -1);
        const days1 = countDaysBetween(entry.startDate, end1);
        await repo.update('leaveEntries', entry.id, {
          endDate: end1,
          hoursCredited: Math.round(days1 * hoursPerDay),
        });

        const start2 = addDaysToIso(targetDate, 1);
        const days2 = countDaysBetween(start2, entry.endDate);
        // The second part keeps its days' own hours (a public holiday stays at 0 h).
        const ownHours = Object.fromEntries(Object.entries(entry.dayHours || {}).filter(([d]) => d >= start2 && d <= entry.endDate));
        const { dayHours: secondDays } = withHolidaysAtZero({ startDate: start2, endDate: entry.endDate, dayHours: ownHours }, holidays);
        await repo.create('leaveEntries', {
          nurseId: entry.nurseId,
          leaveTypeId: entry.leaveTypeId,
          startDate: start2,
          endDate: entry.endDate,
          note: entry.note,
          approved: entry.approved,
          hoursCredited: Math.round(days2 * hoursPerDay),
          ...(secondDays && Object.keys(secondDays).length > 0 ? { dayHours: secondDays } : {}),
        });
      }

      setIsLeaveModalOpen(false);
      setEditingLeaveEntry(null);
      setSelectedCellDate(null);
      await loadData();
      triggerToast(`Removed ${formatDayDate(targetDate)} from the leave. The other days stay as they are.`);
    } catch (err: any) {
      console.error('Failed to remove date from leave:', err);
      triggerToast(`The leave was not changed: ${err?.message || 'try again'}`, 'error');
    } finally {
      setIsDeletingLeave(false);
    }
  };

  // --- LOCK ACTIONS ---
  const handleSaveLockEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLockEntry || !editingLockEntry.nurseId || !editingLockEntry.date) return;

    try {
      if (editingLockEntry.id) {
        await repo.update('locks', editingLockEntry.id, {
          mode: editingLockEntry.mode || 'ASSIGNMENT',
          dutyWindowId: editingLockEntry.dutyWindowId,
          assignmentKind: editingLockEntry.assignmentKind,
          targetRefId: editingLockEntry.targetRefId,
          note: editingLockEntry.note,
        });
        triggerToast('Pinned day updated.');
      } else {
        await repo.create('locks', {
          nurseId: editingLockEntry.nurseId,
          date: editingLockEntry.date,
          mode: editingLockEntry.mode || 'ASSIGNMENT',
          dutyWindowId: editingLockEntry.dutyWindowId,
          assignmentKind: editingLockEntry.assignmentKind,
          targetRefId: editingLockEntry.targetRefId,
          note: editingLockEntry.note || '',
          createdAt: new Date().toISOString(),
        });
        triggerToast('Day pinned. Filling a roster leaves it as it is.');
      }
      setIsLockModalOpen(false);
      setEditingLockEntry(null);
      loadData();
    } catch (err: any) {
      triggerToast(`The pinned day was not saved: ${err.message}`, 'error');
    }
  };

  // Override Lock (Executes lock removal protocol and records audit event)
  const handleExecuteLockOverride = async () => {
    if (!activeLockToOverride || isOverridingLock) return;
    // The lock is only removed after the user typed OVERRIDE
    if (overrideInput.trim().toUpperCase() !== 'OVERRIDE') return;
    setIsOverridingLock(true);

    try {
      await repo.remove('locks', activeLockToOverride.id);
      // An approved day off stays a day off while its request is approved: unpinning declines it
      if (activeLockToOverride.mode === 'OFF') {
        const theirs = await repo.list('availabilityRequests', { field: 'nurseId', operator: '==', value: activeLockToOverride.nurseId });
        const request = theirs.find((r) => !r.available && r.status === 'APPROVED' && r.date === activeLockToOverride.date);
        if (request) {
          await decideRequest(currentUser, 'AVAILABILITY', request.id, 'REJECTED', 'Declined when the pinned day off was removed.');
        }
      }
      // Write an AuditEvent for lock removal
      await repo.create('audit', {
        actor: context.currentUser?.name || 'Admin',
        action: 'OVERRIDE_LOCK',
        entity: 'LockEntry',
        entityId: activeLockToOverride.id,
        before: activeLockToOverride,
        note: `Pin removed on ${formatDate(activeLockToOverride.date)} after the OVERRIDE check.`,
        timestamp: new Date().toISOString(),
      });

      triggerToast('Pinned day removed.');
      setIsOverrideModalOpen(false);
      setActiveLockToOverride(null);
      setOverrideInput('');
      await loadData();
    } catch (err: any) {
      console.error('Lock override failed:', err);
      triggerToast(`The pinned day was not removed: ${err?.message || 'try again'}`, 'error');
    } finally {
      setIsOverridingLock(false);
    }
  };

  // --- PUBLIC HOLIDAY LEAVE ---
  // Public holidays are already left out of the period hours (owner's decision of 2026-10-06),
  // so nobody gets leave hours for them. "Tidy" removes the public holiday leave the old
  // "Apply Public Holidays as PH" button gave everyone, and makes other leave count 0 h on
  // the month's holidays.
  const monthHolidays = holidays.filter((h) => h.date.startsWith(`${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`));
  const holidayTidy = useMemo(() => planHolidayLeaveTidy(leaveEntries, leaveTypes, monthHolidays), [leaveEntries, leaveTypes, holidays, currentYear, currentMonthIndex]);
  const handleTidyHolidayLeave = async () => {
    const { remove, zero } = holidayTidy;
    if (remove.length + zero.length === 0) return;
    const parts = [
      remove.length > 0 ? `delete ${remove.length} public holiday leave ${remove.length === 1 ? 'entry' : 'entries'} (it counted the holiday twice and kept the nurse from working it)` : '',
      zero.length > 0 ? `make ${zero.length} other leave ${zero.length === 1 ? 'entry' : 'entries'} count 0 h on the holiday` : '',
    ].filter(Boolean);
    const ok = await confirmDialog({
      title: 'Tidy public holiday leave',
      message: `Public holidays are already left out of the period hours, so nobody gets leave hours for them. For the holidays of ${monthName} ${currentYear} this will ${parts.join(' and ')}. Hours of rosters with these days are worked out again. This cannot be undone.`,
      confirmLabel: 'Tidy',
      danger: remove.length > 0,
    });
    if (!ok) return;
    try {
      await saveHolidayLeave(repo, zero, remove.map((le) => le.id));
      triggerToast(`Public holiday leave tidied: ${remove.length} deleted, ${zero.length} set to 0 h on the holiday.`);
      loadData();
    } catch (err: any) {
      triggerToast(`Could not tidy the public holiday leave: ${err?.message || err}`, 'error');
      loadData();
    }
  };

  // --- CSV IMPORT LEAVE ---
  // Each row is checked as the leave editor checks a leave; the refused rows are listed (Phase 7).
  const handleProcessLeaveCsv = async () => {
    if (!csvContent.trim()) {
      setCsvImportLog({ added: 0, messages: ['Paste the rows to import first.'] });
      return;
    }
    const plan = planLeaveImport(csvContent, { nurses, leaveTypes, leaveEntries, locks });
    setIsImporting(true);
    let added = 0;
    try {
      for (const row of plan.add) {
        const lt = leaveTypes.find((l) => l.id === row.leaveTypeId);
        await repo.create('leaveEntries', withHolidaysAtZero({
          nurseId: row.nurseId,
          leaveTypeId: row.leaveTypeId,
          startDate: row.startDate,
          endDate: row.endDate,
          note: 'Imported from CSV',
          ...leaveApprovalFields(true, undefined, currentUser),
          hoursCredited: (typeof lt?.creditedHours === 'number' ? lt.creditedHours : 8) * row.days,
        }, holidays));
        added++;
      }
      setCsvImportLog({ added, messages: plan.messages });
    } catch (err: any) {
      setCsvImportLog({ added, messages: [...plan.messages, `The import stopped: ${err.message}`] });
    } finally {
      setIsImporting(false);
      loadData();
    }
  };

  // Leave by click or by drag (Phase 6, slice 5; WCAG 2.5.7). A click on an empty day starts
  // the leave, a second click on the same row ends it; dragging across days still works.
  const openLeaveRange = (nurseId: string, from: number, to: number) => {
    // The days between must be free too (Checkpoint 6).
    const clash = leaveClash(nurseId, getIsoDate(from), getIsoDate(to), leaveEntries, locks);
    if (clash) {
      setGridStatus(clash);
      triggerToast(clash, 'warning');
      return;
    }
    setEditingLeaveEntry({
      nurseId,
      leaveTypeId: leaveTypes[0]?.id || '',
      startDate: getIsoDate(from),
      endDate: getIsoDate(to),
      note: '',
      approved: true,
    });
    setIsLeaveModalOpen(true);
  };

  const cancelPick = (say = true) => {
    setPickStart(null);
    if (say) setGridStatus('Stopped. No leave was started.');
  };

  const pickDay = (nurseId: string, day: number) => {
    // A drag that just ended has already opened the leave.
    if (dragEndedRef.current) {
      dragEndedRef.current = false;
      return;
    }
    const step = pickStep(pickStart, { nurseId, day });
    setPickStart(step.start);
    if (step.range) {
      setGridStatus('');
      openLeaveRange(step.range.nurseId, step.range.from, step.range.to);
    } else {
      const name = nurses.find((n) => n.id === nurseId)?.fullName || 'the nurse';
      setGridStatus(`Leave for ${name} starts ${formatDayDate(getIsoDate(day))}. Choose the last day, or press Esc to stop.`);
    }
  };

  const onGridKey = (e: React.KeyboardEvent, row: number, col: number) => {
    // A key press is never the click that follows a drag.
    dragEndedRef.current = false;
    if (e.key === 'Escape' && pickStart) {
      e.preventDefault();
      e.stopPropagation();
      cancelPick();
      return;
    }
    const next = moveInGrid(row, col, e.key, nurses.length, daysInMonth);
    if (!next) return;
    e.preventDefault();
    setGridFocus(next);
    (e.currentTarget.closest('table')?.querySelector(`[data-cell="${next[0]}-${next[1]}"]`) as HTMLElement | null)?.focus();
  };

  const handleCellMouseDown = (nurseId: string, day: number) => {
    // A drag ending on another day sends no click to a day, so each press starts afresh.
    dragEndedRef.current = false;
    setDragStart({ nurseId, day });
    setDragCurrent({ nurseId, day });
  };

  const handleCellMouseEnter = (nurseId: string, day: number) => {
    if (dragStart && dragStart.nurseId === nurseId) {
      setDragCurrent({ nurseId, day });
    }
  };

  const handleCellMouseUp = (nurseId: string, day: number) => {
    // A drag over more than one day opens the leave; a click on one day is handled by pickDay.
    if (dragStart && dragStart.nurseId === nurseId && dragStart.day !== day) {
      dragEndedRef.current = true;
      setPickStart(null);
      openLeaveRange(nurseId, Math.min(dragStart.day, day), Math.max(dragStart.day, day));
    }
    setDragStart(null);
    setDragCurrent(null);
  };

  return (
    <div className={onlyOwnRequests ? 'px-4 py-5' : 'mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6'}>
      {/* A nurse sees only their own requests (Phase 5): no planner heading and no tabs. */}
      {!onlyOwnRequests && (
      <>
      <PageHeader
        title="Leave and days off"
        meta={<span>Leave, days off and pinned days for each nurse. Leave counts 0 h on public holidays.</span>}
        actions={
          canEdit && (
            <>
              {holidayTidy.remove.length + holidayTidy.zero.length > 0 && (
                <Button icon={Flag} onClick={handleTidyHolidayLeave} title="Public holidays are already left out of the period hours: leave counts 0 h on them">
                  Tidy public holiday leave ({holidayTidy.remove.length + holidayTidy.zero.length})
                </Button>
              )}
              <Button
                icon={Upload}
                onClick={() => {
                  setCsvImportLog(null);
                  setIsCsvModalOpen(true);
                }}
              >
                Import leave from CSV
              </Button>
              <Button
                icon={Pin}
                onClick={() => {
                  setEditingLockEntry({
                    nurseId: nurses[0]?.id || '',
                    date: getIsoDate(isViewingCurrentMonth ? todayDateNumber : 1),
                    mode: 'ASSIGNMENT',
                    dutyWindowId: dutyWindows[0]?.id || '',
                    assignmentKind: 'DOCTOR',
                    targetRefId: doctors[0]?.id || '',
                    note: '',
                  });
                  setIsLockModalOpen(true);
                }}
              >
                Pin a day
              </Button>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  const defaultDate = getIsoDate(isViewingCurrentMonth ? todayDateNumber : 1);
                  setEditingLeaveEntry({
                    nurseId: nurses[0]?.id || '',
                    leaveTypeId: leaveTypes[0]?.id || '',
                    startDate: defaultDate,
                    endDate: defaultDate,
                    note: '',
                    approved: true,
                  });
                  setIsLeaveModalOpen(true);
                }}
              >
                Record leave
              </Button>
            </>
          )
        }
      />

      {/* Requests moved to their own screen (Phase 6, slice 4): a pointer when some wait. */}
      {canManageRequests && pendingApprovalsCount > 0 && (
        <Notice
          tone="warning"
          title={`${pendingApprovalsCount} ${pendingApprovalsCount === 1 ? 'request is' : 'requests are'} waiting for a decision`}
          action={
            <a href="#requests" className="inline-flex h-9 items-center rounded-md border border-line-strong bg-surface px-3.5 text-sm font-semibold text-ink hover:bg-sunken">
              Open Requests
            </a>
          }
        >
          Leave, days off and shifts that nurses asked for are decided in Requests.
        </Notice>
      )}

      {ownRequestsTab && (
        <Tabs
          label="Leave and days off"
          idPrefix="availability"
          value={activeTab}
          onChange={(id: string) => setActiveTab(id as 'calendar' | 'self-service')}
          panelId="availability-panel"
          tabs={[
            { id: 'calendar', label: 'Leave grid' },
            { id: 'self-service', label: 'My requests' },
          ]}
        />
      )}
      </>
      )}

      {/* With the My requests tab, both views sit in its one tab panel. */}
      <div id="availability-panel" role={ownRequestsTab ? 'tabpanel' : undefined} aria-labelledby={ownRequestsTab ? `availability-tab-${activeTab}` : undefined}>
      {/* VIEW PANEL 2: NURSE SELF-SERVICE PORTAL */}
      {activeTab === 'self-service' && (
        <NurseSelfServicePanel
          headingLevel={onlyOwnRequests ? 1 : 2}
          currentUser={currentUser || undefined}
          nurses={nurses}
          leaveTypes={leaveTypes}
          dutyWindows={dutyWindows}
          onDataChanged={loadData}
        />
      )}

      {/* VIEW PANEL 3: THE LEAVE GRID (Phase 6, slice 5: click to start and click to end, the arrow keys, readable colours) */}
      {activeTab === 'calendar' && canEdit && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3">
            <div className="flex items-center gap-1">
              <IconButton
                icon={ChevronLeft}
                label="Previous month"
                onClick={() => {
                  if (currentMonthIndex === 0) {
                    setCurrentMonthIndex(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonthIndex(currentMonthIndex - 1);
                  }
                }}
              />
              <h2 className="min-w-36 text-center text-base font-semibold text-ink tabular-nums">
                {monthName} {currentYear}
              </h2>
              <IconButton
                icon={ChevronRight}
                label="Next month"
                onClick={() => {
                  if (currentMonthIndex === 11) {
                    setCurrentMonthIndex(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonthIndex(currentMonthIndex + 1);
                  }
                }}
              />
              <Button size="sm" onClick={handleGoToToday} className="ml-1" aria-pressed={isViewingCurrentMonth}>
                Today
              </Button>
            </div>

            {/* The key: each kind of leave with its letters, and a pinned day */}
            <ul aria-label="Key" className="flex flex-wrap items-center gap-2 text-xs">
              {leaveTypes.map((lt) => (
                <li
                  key={lt.id}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold"
                  style={{ backgroundColor: lt.color, color: readableTextOn(lt.color) }}
                >
                  {lt.acronym}
                  <span className="font-normal">
                    {lt.name}, {typeof lt.creditedHours === 'number' ? `${lt.creditedHours} h` : 'hours of the shift'}
                  </span>
                </li>
              ))}
              <li className="inline-flex items-center gap-1 rounded border border-dashed border-warning-line bg-warning-soft px-1.5 py-0.5 font-semibold text-warning">
                <Pin className="size-3.5" aria-hidden="true" />
                Pinned day
              </li>
            </ul>
          </div>

          <p className="text-sm text-ink-muted" id="leave-grid-help">
            Click the first day of a nurse's leave, then the last day. For a single day, click that day twice. You can also drag across the days. With the keyboard, the arrow keys move between days, Enter picks a day and Esc stops.
          </p>
          <p className="sr-only" role="status" aria-live="polite">
            {gridStatus}
          </p>
          {pickStart && (
            <Notice
              tone="info"
              title={`Leave for ${nurses.find((n) => n.id === pickStart.nurseId)?.fullName || 'the nurse'} starts ${formatDayDate(getIsoDate(pickStart.day))}`}
              action={
                <Button size="sm" onClick={() => cancelPick()}>
                  Stop
                </Button>
              }
            >
              Now click the last day on the same row.
            </Notice>
          )}

          <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
            <div className="overflow-x-auto" onMouseLeave={() => setDragCurrent(dragStart)}>
              <table className="w-full border-collapse text-xs" aria-describedby="leave-grid-help">
                <caption className="sr-only">
                  Leave and pinned days, {monthName} {currentYear}
                </caption>
                <thead>
                  <tr className="border-b border-line bg-sunken text-ink">
                    <th scope="col" className="sticky left-0 z-10 w-48 min-w-48 border-r border-line bg-sunken px-3 py-2 text-left font-semibold">
                      Nurse
                    </th>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const isoDate = getIsoDate(day);
                      const weekday = new Date(Date.UTC(currentYear, currentMonthIndex, day)).getUTCDay();
                      const isWeekend = isWeekendDay(weekday);
                      const holiday = holidays.find((h) => h.date === isoDate);
                      const isToday = isViewingCurrentMonth && day === todayDateNumber;
                      return (
                        <th
                          id={`availability-day-${day}`}
                          key={day}
                          scope="col"
                          aria-label={`${formatDayDate(isoDate, 'long')}${isToday ? ', today' : ''}${holiday ? `, public holiday: ${holiday.name}` : ''}`}
                          className={cx(
                            'relative min-w-10 border-r border-line px-1 py-1.5 text-center',
                            isToday ? 'bg-brand text-white' : holiday ? 'bg-info-soft text-info' : isWeekend ? 'bg-canvas text-ink' : 'text-ink'
                          )}
                        >
                          <span className="block font-normal">{WEEKDAY_ABBR[weekday]}</span>
                          <span className="flex items-center justify-center gap-0.5 font-semibold tabular-nums">
                            {day}
                            {holiday && <Flag className="size-3" aria-hidden="true" />}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {nurses.map((nurse, row) => {
                    const alType = leaveTypes.find((l) => l.acronym === 'AL');
                    const alBadge = alType ? getLeaveQuotaBadge(nurse, alType) : null;
                    const phType = leaveTypes.find((l) => l.acronym === 'PH');
                    const phBadge = phType ? getLeaveQuotaBadge(nurse, phType) : null;
                    const blType = leaveTypes.find((l) => l.acronym === 'BL');
                    const blBadge = blType ? getLeaveQuotaBadge(nurse, blType) : null;
                    const quota = (label: string, b: NonNullable<typeof alBadge>, title: string) => (
                      <span
                        className={cx(
                          'rounded border px-1 text-xs tabular-nums',
                          b.isExceeded ? 'border-danger-line bg-danger-soft font-semibold text-danger' : b.isFull ? 'border-warning-line bg-warning-soft text-warning' : 'border-line bg-sunken text-ink'
                        )}
                        title={title}
                      >
                        {label} {b.text}
                      </span>
                    );

                    return (
                      <tr key={nurse.id}>
                        <th scope="row" className="sticky left-0 z-10 border-r border-line bg-surface px-3 py-1.5 text-left font-normal">
                          <div className="flex items-center justify-between gap-1">
                            <div className="min-w-0">
                              <span className="block max-w-32 truncate font-semibold text-ink">{nurse.fullName}</span>
                              {nurse.employeeCode && <span className="text-xs text-ink-muted">{nurse.employeeCode}</span>}
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-0.5">
                              {alBadge && quota('AL', alBadge, `Annual leave: ${alBadge.usedDays} of ${alBadge.quotaDays} days in ${currentYear}`)}
                              {phBadge && quota('PH', phBadge, `Public holiday: ${phBadge.usedDays} of ${phBadge.quotaDays} days in ${currentYear}`)}
                              {blBadge && quota('BL', blBadge, `Birthday leave: ${blBadge.usedDays} of ${blBadge.quotaDays} days in ${currentYear}`)}
                            </div>
                          </div>
                        </th>

                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                          const col = day - 1;
                          const isoDate = getIsoDate(day);
                          const leave = findLeaveForNurseDate(nurse.id, isoDate);
                          const lock = findLockForNurseDate(nurse.id, isoDate);
                          const weekday = new Date(Date.UTC(currentYear, currentMonthIndex, day)).getUTCDay();
                          const isWeekend = isWeekendDay(weekday);
                          const isToday = isViewingCurrentMonth && day === todayDateNumber;
                          const leaveType = leave ? leaveTypes.find((l) => l.id === leave.leaveTypeId) : undefined;
                          const dayText = formatDayDate(isoDate);

                          // Inside the range being dragged, or the first day picked by a click.
                          let inRange = false;
                          if (dragStart && dragCurrent && dragStart.nurseId === nurse.id) {
                            inRange = day >= Math.min(dragStart.day, dragCurrent.day) && day <= Math.max(dragStart.day, dragCurrent.day);
                          }
                          const isPickStart = pickStart?.nurseId === nurse.id && pickStart.day === day;

                          const cellProps = {
                            'data-cell': `${row}-${col}`,
                            tabIndex: gridFocus[0] === row && gridFocus[1] === col ? 0 : -1,
                            onFocus: () => setGridFocus([row, col]),
                            onKeyDown: (e: React.KeyboardEvent) => onGridKey(e, row, col),
                          };

                          return (
                            <td
                              key={day}
                              onMouseDown={() => handleCellMouseDown(nurse.id, day)}
                              onMouseEnter={() => handleCellMouseEnter(nurse.id, day)}
                              onMouseUp={() => handleCellMouseUp(nurse.id, day)}
                              className={cx(
                                'relative select-none border-r border-line px-0.5 py-1 text-center',
                                inRange || isPickStart ? 'bg-brand-soft ring-2 ring-brand ring-inset' : isToday ? 'bg-brand-soft/40' : isWeekend ? 'bg-canvas' : 'bg-surface'
                              )}
                            >
                              {lock ? (
                                <button
                                  type="button"
                                  {...cellProps}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveLockToOverride(lock);
                                    setOverrideInput('');
                                    setIsOverrideModalOpen(true);
                                  }}
                                  aria-label={`${nurse.fullName}, ${dayText}: ${lock.mode === 'OFF' ? 'Pinned day off' : 'Pinned shift'}. Open to change or remove the pin.`}
                                  title={`Pinned ${lock.mode === 'OFF' ? 'day off' : 'shift'}`}
                                  className="flex h-8 w-full items-center justify-center gap-0.5 rounded border border-dashed border-warning-line bg-warning-soft text-xs font-semibold text-warning"
                                >
                                  <Pin className="size-3 shrink-0" aria-hidden="true" />
                                  {lock.mode === 'OFF' ? 'Off' : 'Shift'}
                                </button>
                              ) : leave ? (
                                <button
                                  type="button"
                                  {...cellProps}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingLeaveEntry(leave);
                                    setSelectedCellDate(isoDate);
                                    setIsLeaveModalOpen(true);
                                  }}
                                  aria-label={`${nurse.fullName}, ${dayText}: ${leaveType?.acronym || 'L'}, ${leaveType?.name || 'leave'}${leave.approved === false ? ', waiting' : ''}. Open to change it.`}
                                  title={`${leaveType?.name || 'Leave'} (${Math.round(leaveCreditInRange(leave, leaveType, leave.startDate, leave.endDate) * 10) / 10} h counted)`}
                                  className={cx('flex h-8 w-full items-center justify-center rounded text-xs font-semibold', leave.approved === false && 'border-2 border-dashed border-ink/40')}
                                  style={{ backgroundColor: leaveType?.color || '#f59e0b', color: readableTextOn(leaveType?.color || '#f59e0b') }}
                                >
                                  {leaveType?.acronym || 'L'}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  {...cellProps}
                                  onClick={() => pickDay(nurse.id, day)}
                                  aria-pressed={isPickStart || undefined}
                                  aria-label={`${nurse.fullName}, ${dayText}: no leave${isPickStart ? ', first day of the new leave' : ''}`}
                                  className="flex h-8 w-full items-center justify-center rounded text-ink-muted hover:bg-sunken"
                                >
                                  <span aria-hidden="true">·</span>
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-ink-muted">
            Pinned days and approved leave stay as they are when a roster is filled. This clinic has {locks.length} pinned {locks.length === 1 ? 'day' : 'days'} and {leaveEntries.length} {leaveEntries.length === 1 ? 'leave' : 'leaves'}.
          </p>
        </div>
      )}
      </div>

      {/* The four dialogs on the shared Dialog (Phase 7, slice 1). */}
      <Dialog
        open={isLeaveModalOpen && !!editingLeaveEntry}
        onClose={closeLeaveDialog}
        title={editingLeaveEntry?.id ? 'Change leave' : 'Record leave'}
        description={selectedNurseForLeave?.fullName}
        footer={
          editingLeaveEntry && (
            <>
              {editingLeaveEntry.id && (
                <span className="flex flex-col-reverse gap-2 sm:mr-auto sm:flex-row">
                  {editingLeaveEntry.startDate !== editingLeaveEntry.endDate &&
                  selectedCellDate &&
                  selectedCellDate >= (editingLeaveEntry.startDate || '') &&
                  selectedCellDate <= (editingLeaveEntry.endDate || '') ? (
                    <>
                      <Button icon={Trash2} disabled={isDeletingLeave} onClick={() => handleDeleteSingleDayFromLeave(editingLeaveEntry as LeaveEntry, selectedCellDate)}>
                        Delete {formatDayDate(selectedCellDate)} only
                      </Button>
                      <Button disabled={isDeletingLeave} onClick={() => handleDeleteLeave(editingLeaveEntry as LeaveEntry)}>
                        Delete all {countDaysBetween(editingLeaveEntry.startDate || '', editingLeaveEntry.endDate || '')} days
                      </Button>
                    </>
                  ) : (
                    <Button icon={Trash2} busy={isDeletingLeave} onClick={() => handleDeleteLeave(editingLeaveEntry as LeaveEntry)}>
                      Delete the leave
                    </Button>
                  )}
                </span>
              )}
              <Button onClick={closeLeaveDialog}>Cancel</Button>
              <Button variant="primary" type="submit" form="leave-editor" icon={Save} disabled={!!leaveQuotaInfo?.isExceeded || isDeletingLeave}>
                {editingLeaveEntry.id ? 'Save changes' : 'Record leave'}
              </Button>
            </>
          )
        }
      >
        {editingLeaveEntry && (
          <form id="leave-editor" onSubmit={handleSaveLeaveEntry} noValidate className="space-y-4 text-sm">
            <Field label="Nurse">
              {(f) => (
                <Select {...f} value={editingLeaveEntry.nurseId} onChange={(e) => setEditingLeaveEntry({ ...editingLeaveEntry, nurseId: e.target.value })}>
                  {nurses.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.fullName}
                      {n.employeeCode ? ` (${n.employeeCode})` : ''}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Kind of leave" hint={leaveHoursHint(selectedTypeForLeave)}>
              {(f) => (
                <Select {...f} value={editingLeaveEntry.leaveTypeId} onChange={(e) => setEditingLeaveEntry({ ...editingLeaveEntry, leaveTypeId: e.target.value })}>
                  {leaveTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.name} ({lt.acronym})
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First day">
                {(f) => <DateInput {...f} value={editingLeaveEntry.startDate || ''} onChange={(iso) => setEditingLeaveEntry({ ...editingLeaveEntry, startDate: iso })} />}
              </Field>
              <Field label="Last day">
                {(f) => <DateInput {...f} value={editingLeaveEntry.endDate || ''} onChange={(iso) => setEditingLeaveEntry({ ...editingLeaveEntry, endDate: iso })} />}
              </Field>
            </div>

            {leaveQuotaInfo && (
              <Notice
                tone={leaveQuotaInfo.isExceeded ? 'danger' : leaveQuotaInfo.totalDaysAfter === leaveQuotaInfo.quotaDays ? 'warning' : 'info'}
                title={`${selectedTypeForLeave?.name} in ${leaveQuotaInfo.year}: ${leaveQuotaInfo.alreadyUsedDays} of ${leaveQuotaInfo.quotaDays} days used`}
              >
                {leaveQuotaInfo.quotaDays === 0
                  ? `${selectedNurseForLeave?.fullName} has no ${selectedTypeForLeave?.name} allowance for ${leaveQuotaInfo.year}. Set the days allowed in their nurse record first.`
                  : leaveQuotaInfo.isExceeded
                    ? `This leave is ${leaveQuotaInfo.requestedDays} ${leaveQuotaInfo.requestedDays === 1 ? 'day' : 'days'}, which is ${leaveQuotaInfo.excessDays} more than the ${leaveQuotaInfo.remainingDays} ${leaveQuotaInfo.remainingDays === 1 ? 'day' : 'days'} left.`
                    : `This leave is ${leaveQuotaInfo.requestedDays} ${leaveQuotaInfo.requestedDays === 1 ? 'day' : 'days'}, leaving ${leaveQuotaInfo.quotaDays - leaveQuotaInfo.totalDaysAfter} ${leaveQuotaInfo.quotaDays - leaveQuotaInfo.totalDaysAfter === 1 ? 'day' : 'days'}.`}
              </Notice>
            )}

            <Field label="Note" optional>
              {(f) => <Input {...f} value={editingLeaveEntry.note || ''} onChange={(e) => setEditingLeaveEntry({ ...editingLeaveEntry, note: e.target.value })} />}
            </Field>
            <Switch
              label="Approved"
              hint="Approved leave stays as it is when a roster is filled. Turn it off to keep the leave waiting for a decision."
              checked={editingLeaveEntry.approved !== false}
              onChange={(approved) => setEditingLeaveEntry({ ...editingLeaveEntry, approved })}
            />
            {leaveError && <Notice tone="danger" live title={leaveError} />}
          </form>
        )}
      </Dialog>

      <Dialog
        open={isLockModalOpen && !!editingLockEntry}
        onClose={() => setIsLockModalOpen(false)}
        title="Pin a day"
        description="A pinned day stays as it is when a roster is filled. Removing the pin later asks you to type OVERRIDE."
        footer={
          <>
            <Button onClick={() => setIsLockModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="pin-editor" icon={Lock}>
              Pin the day
            </Button>
          </>
        }
      >
        {editingLockEntry && (
          <form id="pin-editor" onSubmit={handleSaveLockEntry} noValidate className="space-y-4 text-sm">
            <Field label="Nurse">
              {(f) => (
                <Select {...f} value={editingLockEntry.nurseId} onChange={(e) => setEditingLockEntry({ ...editingLockEntry, nurseId: e.target.value })}>
                  {nurses.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.fullName}
                      {n.employeeCode ? ` (${n.employeeCode})` : ''}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Day">
              {(f) => <DateInput {...f} value={editingLockEntry.date || ''} onChange={(iso) => setEditingLockEntry({ ...editingLockEntry, date: iso })} />}
            </Field>
            <Field label="What is pinned">
              {(f) => (
                <Select {...f} value={editingLockEntry.mode || 'ASSIGNMENT'} onChange={(e) => setEditingLockEntry({ ...editingLockEntry, mode: e.target.value as LockEntry['mode'] })}>
                  <option value="ASSIGNMENT">A shift</option>
                  <option value="OFF">A day off</option>
                </Select>
              )}
            </Field>
            {editingLockEntry.mode !== 'OFF' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Shift">
                  {(f) => (
                    <Select {...f} value={editingLockEntry.dutyWindowId} onChange={(e) => setEditingLockEntry({ ...editingLockEntry, dutyWindowId: e.target.value })}>
                      {dutyWindows.map((dw) => (
                        <option key={dw.id} value={dw.id}>
                          {dw.name} ({dw.startTime} to {dw.endTime})
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="Works with">
                  {(f) => (
                    <Select
                      {...f}
                      value={editingLockEntry.targetRefId}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        const isDoc = doctors.some((d) => d.id === targetId);
                        const isRole = clinicalRoles.some((r) => r.id === targetId);
                        setEditingLockEntry({ ...editingLockEntry, targetRefId: targetId, assignmentKind: isDoc ? 'DOCTOR' : isRole ? 'CLINICAL_ROLE' : 'SPECIALTY' });
                      }}
                    >
                      <optgroup label="Doctors">
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.fullName}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Nurse roles">
                        {clinicalRoles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.acronym})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Specialties">
                        {specialties.map((sp) => (
                          <option key={sp.id} value={sp.id}>
                            {sp.name}
                          </option>
                        ))}
                      </optgroup>
                    </Select>
                  )}
                </Field>
              </div>
            )}
            <Field label="Note" optional hint="For example, asked for by the clinic manager.">
              {(f) => <Input {...f} value={editingLockEntry.note || ''} onChange={(e) => setEditingLockEntry({ ...editingLockEntry, note: e.target.value })} />}
            </Field>
          </form>
        )}
      </Dialog>

      <Dialog
        open={isOverrideModalOpen && !!activeLockToOverride}
        onClose={closeOverrideDialog}
        role="alertdialog"
        size="sm"
        title="Remove the pin?"
        description={
          activeLockToOverride &&
          `${nurses.find((n) => n.id === activeLockToOverride.nurseId)?.fullName || 'A nurse'}, ${formatDayDate(activeLockToOverride.date)}: ${activeLockToOverride.mode === 'OFF' ? 'a day off' : 'a shift'}.`
        }
        footer={
          <>
            <Button disabled={isOverridingLock} onClick={closeOverrideDialog}>
              Keep the pin
            </Button>
            <Button variant="danger" busy={isOverridingLock} disabled={overrideInput.trim().toUpperCase() !== 'OVERRIDE'} onClick={handleExecuteLockOverride}>
              Remove the pin
            </Button>
          </>
        }
      >
        {activeLockToOverride && (
          <div className="space-y-4 text-sm">
            <p className="text-ink">Filling a roster leaves this day as it is while it is pinned.</p>
            {activeLockToOverride.note && <p className="text-ink-muted">Note: {activeLockToOverride.note}</p>}
            {activeLockToOverride.mode === 'OFF' && activeLockToOverride.id.startsWith('lock-off-') && (
              <Notice tone="warning" title="This may decline a request">
                If this day off comes from an approved request, removing the pin also declines the request. You can approve it again in Requests, under All day off and shift requests.
              </Notice>
            )}
            <Field label="To remove the pin, type OVERRIDE">
              {(f) => (
                <Input
                  {...f}
                  autoComplete="off"
                  value={overrideInput}
                  onChange={(e) => setOverrideInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleExecuteLockOverride();
                    }
                  }}
                  className="font-mono tracking-wider uppercase"
                />
              )}
            </Field>
          </div>
        )}
      </Dialog>

      <Dialog
        open={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        size="lg"
        title="Import leave from CSV"
        description="Each row is checked the same way as a leave recorded by hand. Imported leave is approved."
        footer={
          <>
            <Button onClick={() => setIsCsvModalOpen(false)}>Close</Button>
            <Button variant="primary" icon={Upload} busy={isImporting} onClick={handleProcessLeaveCsv}>
              Import
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <Field
            label="Rows to import"
            hint={
              <>
                One leave on each line: the nurse's email, the short name of the kind of leave, the first day and the last day. For example:{' '}
                <code className="font-mono text-ink">mary@example.com, AL, 12-10-2026, 16-10-2026</code>
              </>
            }
          >
            {(f) => <Textarea {...f} rows={6} value={csvContent} onChange={(e) => setCsvContent(e.target.value)} className="font-mono" />}
          </Field>
          {csvImportLog && (
            <Notice
              live
              tone={csvImportLog.messages.length === 0 ? 'success' : csvImportLog.added === 0 ? 'danger' : 'warning'}
              title={`${csvImportLog.added} ${csvImportLog.added === 1 ? 'leave' : 'leaves'} imported${csvImportLog.messages.length ? `, ${csvImportLog.messages.length} ${csvImportLog.messages.length === 1 ? 'row' : 'rows'} not imported` : ''}.`}
            >
              {csvImportLog.messages.length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {csvImportLog.messages.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}
            </Notice>
          )}
        </div>
      </Dialog>
    </div>
  );
};
