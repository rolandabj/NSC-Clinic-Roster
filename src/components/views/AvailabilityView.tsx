import { leaveCreditInRange } from '../../services/hours/hoursPolicy';
import { planHolidayLeaveTidy, saveHolidayLeave, withHolidaysAtZero } from '../../services/hours/holidayLeave';
import { leaveApprovalFields } from '../../services/engine/leaveStatus';
import { confirmDialog, notify, type NoticeTone } from '../common/dialogs';
import { Button, IconButton, Notice, PageHeader, Tabs, cx } from '../ui';
import { moveInGrid, pickStep, type GridCell } from '../../services/availability/leaveGridPick';
import { leaveClash } from '../../services/availability/leaveClash';
import { allowanceDays } from '../../services/hours/leaveAllowance';
import { readableTextOn } from '../../utils/colorContrast';
import { isWeekendDay } from '../../utils/weekend';
import React, { useState, useEffect, useMemo, useId, useRef } from 'react';
import { useDialogA11y } from '../common/useDialogA11y';
import {
  CalendarCheck2,
  ListChecks,
  Lock,
  Unlock,
  Plus,
  Upload,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Flag,
  Pin,
  Trash2,
  Edit2,
  Shield,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Filter,
  Save,
  X,
  Droplets,
  Clock,
  Sparkles,
  Info,
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
  LockMode,
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
  const [csvImportLog, setCsvImportLog] = useState<string | null>(null);

  // Notification Toast
  const [isDeletingLeave, setIsDeletingLeave] = useState(false);
  const [isOverridingLock, setIsOverridingLock] = useState(false);

  // Dialog keyboard and screen reader support
  const leaveTitleId = useId();
  const lockTitleId = useId();
  const overrideTitleId = useId();
  const csvTitleId = useId();
  const leaveDialogRef = useDialogA11y<HTMLDivElement>(isLeaveModalOpen && !!editingLeaveEntry, () => {
    setIsLeaveModalOpen(false);
    setEditingLeaveEntry(null);
  });
  const lockDialogRef = useDialogA11y<HTMLDivElement>(isLockModalOpen && !!editingLockEntry, () => setIsLockModalOpen(false));
  const overrideDialogRef = useDialogA11y<HTMLDivElement>(isOverrideModalOpen && !!activeLockToOverride, () => {
    // Same as "Keep Pinned", which is disabled while the override is saving
    if (isOverridingLock) return;
    setIsOverrideModalOpen(false);
    setActiveLockToOverride(null);
    setOverrideInput('');
  });
  const csvDialogRef = useDialogA11y<HTMLDivElement>(isCsvModalOpen, () => setIsCsvModalOpen(false));

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
    // In days, as typed (the owner's rule of 14-10-2026).
    const quotaDays = allowanceDays(nurse.leaveQuotas?.[leaveType.id]);
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
    const quotaDays = allowanceDays(selectedNurseForLeave.leaveQuotas?.[selectedTypeForLeave.id]);
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

    const start = editingLeaveEntry.startDate!;
    const end = editingLeaveEntry.endDate || start;
    if (start > end) {
      triggerToast('Start date must be before or equal to end date.', 'error');
      return;
    }
    // A leave must not cover another leave or a pinned day of the same nurse (Checkpoint 6).
    const clash = leaveClash(editingLeaveEntry.nurseId, start, end, leaveEntries, locks, editingLeaveEntry.id);
    if (clash) {
      triggerToast(clash, 'error');
      return;
    }

    const lt = leaveTypes.find((l) => l.id === editingLeaveEntry.leaveTypeId);
    const daySpan = countDaysBetween(start, end);
    const dailyCredit = lt ? (typeof lt.creditedHours === 'number' ? lt.creditedHours : 8) : 8;
    const totalCredits = dailyCredit * daySpan;

    // Strict Quota Ceiling Enforcement: Block save if quota would be exceeded
    if (leaveQuotaInfo && leaveQuotaInfo.isExceeded) {
      triggerToast(
        `Cannot schedule leave: ${selectedNurseForLeave?.fullName || 'Staff'} has already scheduled ${leaveQuotaInfo.alreadyUsedDays} of ${leaveQuotaInfo.quotaDays} allowed ${selectedTypeForLeave?.name || 'leave'} days for ${leaveQuotaInfo.year}. Requesting ${leaveQuotaInfo.requestedDays} day(s) exceeds the annual limit by ${leaveQuotaInfo.excessDays} day(s).`,
        'error'
      );
      return;
    }

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
        triggerToast(`Updated leave entry (${daySpan} day(s), ${totalCredits}h credited).`);
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
        triggerToast(`Recorded ${lt?.name} for ${daySpan} day(s) (${totalCredits}h credited).`);
      }
      setIsLeaveModalOpen(false);
      setEditingLeaveEntry(null);
      setSelectedCellDate(null);
      loadData();
    } catch (err: any) {
      triggerToast(`Error saving leave: ${err.message}`, 'error');
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
      triggerToast('Selected leave entry removed successfully. Other leaves remain untouched.');
    } catch (err: any) {
      console.error('Failed to delete leave entry:', err);
      triggerToast(`Failed to delete leave entry: ${err?.message || 'Error occurred'}`, 'error');
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
      triggerToast(`Removed leave on ${targetDate}. All other days remain active.`);
    } catch (err: any) {
      console.error('Failed to remove date from leave:', err);
      triggerToast(`Failed to update leave: ${err?.message || 'Error occurred'}`, 'error');
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
        note: `User confirmed OVERRIDE protocol to unlock pinned day on ${formatDate(activeLockToOverride.date)}.`,
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
  const handleProcessLeaveCsv = async () => {
    if (!csvContent.trim()) {
      triggerToast('Please paste CSV content.', 'warning');
      return;
    }

    try {
      const lines = csvContent.trim().split('\n');
      let successCount = 0;
      let errorCount = 0;
      const logs: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('gmail') || line.startsWith('Gmail')) continue; // Skip header

        const parts = line.split(',').map((p) => p.trim());
        if (parts.length < 4) {
          logs.push(`Row ${i + 1}: Insufficient columns (expected: gmail, acronym, startDate, endDate)`);
          errorCount++;
          continue;
        }

        const [gmail, acronym, startDate, endDate] = parts;
        const nurse = nurses.find((n) => n.gmail.toLowerCase() === gmail.toLowerCase());
        if (!nurse) {
          logs.push(`Row ${i + 1}: Nurse with Gmail "${gmail}" not found.`);
          errorCount++;
          continue;
        }

        const lt = leaveTypes.find((l) => l.acronym.toUpperCase() === acronym.toUpperCase());
        if (!lt) {
          logs.push(`Row ${i + 1}: Leave type with acronym "${acronym}" not found.`);
          errorCount++;
          continue;
        }

        const daySpan =
          Math.round(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        const totalCredits = (typeof lt.creditedHours === 'number' ? lt.creditedHours : 8) * daySpan;

        // Quota Check
        const quotaDays = allowanceDays(nurse.leaveQuotas?.[lt.id]);
        if (quotaDays !== null) {
          const year = startDate.slice(0, 4);
          const yearPrefix = `${year}-`;
          const used = leaveEntries
            .filter((le) => le.nurseId === nurse.id && le.leaveTypeId === lt.id && le.startDate.startsWith(yearPrefix))
            .reduce((sum, le) => sum + countDaysBetween(le.startDate, le.endDate), 0);
          if (used + daySpan > quotaDays) {
            logs.push(`Row ${i + 1}: Quota exceeded for ${nurse.fullName} (${used + daySpan}/${quotaDays} days of ${lt.name}). Skipped.`);
            errorCount++;
            continue;
          }
        }

        await repo.create('leaveEntries', withHolidaysAtZero({
          nurseId: nurse.id,
          leaveTypeId: lt.id,
          startDate,
          endDate,
          note: 'Imported via CSV',
          approved: true,
          hoursCredited: totalCredits,
        }, holidays));
        successCount++;
      }

      setCsvImportLog(`Import complete: ${successCount} entries added, ${errorCount} errors.`);
      triggerToast(`Imported ${successCount} leave records.`);
      loadData();
    } catch (err: any) {
      triggerToast(`CSV Import failed: ${err.message}`, 'error');
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
                    <th scope="col" className="sticky left-0 z-10 w-48 border-r border-line bg-sunken px-3 py-2 text-left font-semibold">
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

      {/* --- MODAL 1: RECORD / EDIT LEAVE ENTRY --- */}
      {isLeaveModalOpen && editingLeaveEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            ref={leaveDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={leaveTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <h3 id={leaveTitleId} className="text-sm font-bold text-slate-900">
                  {editingLeaveEntry.id ? 'Edit Leave Entry' : 'Record Staff Leave'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  setEditingLeaveEntry(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveLeaveEntry} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nurse</label>
                <select aria-label="Nurse"
                  value={editingLeaveEntry.nurseId}
                  onChange={(e) =>
                    setEditingLeaveEntry({ ...editingLeaveEntry, nurseId: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-medium"
                >
                  {nurses.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.fullName} ({n.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Leave Type</label>
                <select aria-label="Leave Type"
                  value={editingLeaveEntry.leaveTypeId}
                  onChange={(e) =>
                    setEditingLeaveEntry({ ...editingLeaveEntry, leaveTypeId: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-medium"
                >
                  {leaveTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.name} [{lt.acronym}] —{' '}
                      {typeof lt.creditedHours === 'number' ? `${lt.creditedHours}h` : 'Match duty'}{' '}
                      credit {lt.countsTowardHoursTarget ? '(Counts toward target)' : '(0h)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                  <input aria-label="Start Date"
                    type="date"
                    required
                    value={editingLeaveEntry.startDate}
                    onChange={(e) =>
                      setEditingLeaveEntry({ ...editingLeaveEntry, startDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date</label>
                  <input aria-label="End Date"
                    type="date"
                    required
                    value={editingLeaveEntry.endDate}
                    onChange={(e) =>
                      setEditingLeaveEntry({ ...editingLeaveEntry, endDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              {/* Real-time Annual Quota Status & Ceiling Banner */}
              {leaveQuotaInfo && (
                <div
                  className={`p-2.5 rounded-lg border text-xs space-y-1.5 transition-colors ${
                    leaveQuotaInfo.isExceeded
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : leaveQuotaInfo.remainingDays === 0
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      {leaveQuotaInfo.isExceeded ? (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span>
                        {selectedTypeForLeave?.name} Annual Quota ({leaveQuotaInfo.year})
                      </span>
                    </span>
                    <span className="font-mono font-bold">
                      {leaveQuotaInfo.alreadyUsedDays} / {leaveQuotaInfo.quotaDays} days used
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                    <span>
                      This request: <strong>{leaveQuotaInfo.requestedDays} day(s)</strong>
                    </span>
                    <span>
                      {leaveQuotaInfo.isExceeded ? (
                        <strong className="text-rose-700">
                          Exceeds annual quota by {leaveQuotaInfo.excessDays} day{leaveQuotaInfo.excessDays > 1 ? 's' : ''}!
                        </strong>
                      ) : (
                        <span>
                          Remaining after: <strong>{leaveQuotaInfo.quotaDays - leaveQuotaInfo.totalDaysAfter} day(s)</strong>
                        </span>
                      )}
                    </span>
                  </div>

                  {leaveQuotaInfo.isExceeded && (
                    <div className="text-[11px] text-rose-700 font-medium bg-rose-100/70 p-1.5 rounded border border-rose-200">
                      Scheduling blocked: {selectedNurseForLeave?.fullName} cannot be allocated more than {leaveQuotaInfo.quotaDays} days of {selectedTypeForLeave?.name} in {leaveQuotaInfo.year}.
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes / Reason</label>
                <input aria-label="Notes / Reason"
                  type="text"
                  value={editingLeaveEntry.note || ''}
                  onChange={(e) =>
                    setEditingLeaveEntry({ ...editingLeaveEntry, note: e.target.value })
                  }
                  placeholder="e.g. Annual holiday or medical certificate"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Approval Status</span>
                  <p className="text-[10px] text-slate-500">
                    Approved leave is honored strictly by the scheduling engine.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingLeaveEntry({
                      ...editingLeaveEntry,
                      approved: !editingLeaveEntry.approved,
                    })
                  }
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    editingLeaveEntry.approved !== false
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {editingLeaveEntry.approved !== false ? 'Approved ✓' : 'Waiting'}
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                {editingLeaveEntry.id && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* If multi-day span and user clicked a specific cell */}
                    {editingLeaveEntry.startDate !== editingLeaveEntry.endDate &&
                    selectedCellDate &&
                    selectedCellDate >= (editingLeaveEntry.startDate || '') &&
                    selectedCellDate <= (editingLeaveEntry.endDate || '') ? (
                      <>
                        <button
                          type="button"
                          disabled={isDeletingLeave}
                          onClick={() =>
                            handleDeleteSingleDayFromLeave(
                              editingLeaveEntry as LeaveEntry,
                              selectedCellDate
                            )
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors border border-red-200 text-xs"
                          title="Deletes ONLY this selected day, keeping all other days of this leave intact"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Delete Only {formatDate(selectedCellDate)}</span>
                        </button>
                        <button
                          type="button"
                          disabled={isDeletingLeave}
                          onClick={() => handleDeleteLeave(editingLeaveEntry as LeaveEntry)}
                          className="text-slate-500 hover:text-red-600 hover:bg-slate-100 px-2 py-1.5 rounded text-[11px] cursor-pointer disabled:opacity-50 transition-colors"
                          title="Deletes the entire multi-day leave"
                        >
                          Delete Full Range ({formatDate(editingLeaveEntry.startDate)} – {formatDate(editingLeaveEntry.endDate)})
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={isDeletingLeave}
                        onClick={() => handleDeleteLeave(editingLeaveEntry as LeaveEntry)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors border border-red-200 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isDeletingLeave ? 'Deleting...' : 'Delete Leave Entry'}</span>
                      </button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLeaveModalOpen(false);
                      setEditingLeaveEntry(null);
                      setSelectedCellDate(null);
                    }}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={leaveQuotaInfo?.isExceeded || isDeletingLeave}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded font-medium cursor-pointer shadow-xs"
                    title={leaveQuotaInfo?.isExceeded ? 'Leave quota exceeded for this staff member' : undefined}
                  >
                    Save Leave Entry
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: PIN SHIFT LOCK --- */}
      {isLockModalOpen && editingLockEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            ref={lockDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={lockTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <h3 id={lockTitleId} className="text-sm font-bold text-slate-900">Pin a day</h3>
              </div>
              <button
                onClick={() => setIsLockModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] leading-relaxed">
              <strong>A pinned day</strong> stays as it is when a roster is filled. Removing the pin later asks you to type OVERRIDE.
            </div>

            <form onSubmit={handleSaveLockEntry} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nurse</label>
                <select aria-label="Nurse"
                  value={editingLockEntry.nurseId}
                  onChange={(e) =>
                    setEditingLockEntry({ ...editingLockEntry, nurseId: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-medium"
                >
                  {nurses.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.fullName} ({n.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Date</label>
                <input aria-label="Date"
                  type="date"
                  required
                  value={editingLockEntry.date}
                  onChange={(e) =>
                    setEditingLockEntry({ ...editingLockEntry, date: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">What is pinned</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingLockEntry({ ...editingLockEntry, mode: 'ASSIGNMENT' })
                    }
                    className={`py-1.5 px-3 rounded border font-medium text-xs cursor-pointer ${
                      editingLockEntry.mode === 'ASSIGNMENT'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    A shift
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingLockEntry({ ...editingLockEntry, mode: 'OFF' })}
                    className={`py-1.5 px-3 rounded border font-medium text-xs cursor-pointer ${
                      editingLockEntry.mode === 'OFF'
                        ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    A day off
                  </button>
                </div>
              </div>

              {editingLockEntry.mode === 'ASSIGNMENT' && (
                <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Duty Window</label>
                    <select aria-label="Duty Window"
                      value={editingLockEntry.dutyWindowId}
                      onChange={(e) =>
                        setEditingLockEntry({
                          ...editingLockEntry,
                          dutyWindowId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      {dutyWindows.map((dw) => (
                        <option key={dw.id} value={dw.id}>
                          {dw.name} [{dw.acronym}] ({dw.startTime}–{dw.endTime})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Target Assignment Pairing
                    </label>
                    <select aria-label="Target Assignment Pairing"
                      value={editingLockEntry.targetRefId}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        const isDoc = doctors.some((d) => d.id === targetId);
                        const isRole = clinicalRoles.some((r) => r.id === targetId);
                        setEditingLockEntry({
                          ...editingLockEntry,
                          targetRefId: targetId,
                          assignmentKind: isDoc ? 'DOCTOR' : isRole ? 'CLINICAL_ROLE' : 'SPECIALTY',
                        });
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      <optgroup label="Doctors">
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.fullName}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Clinical Roles">
                        {clinicalRoles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.acronym})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Specialties (Pool)">
                        {specialties.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.code})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Note</label>
                <input aria-label="Note"
                  type="text"
                  value={editingLockEntry.note || ''}
                  onChange={(e) =>
                    setEditingLockEntry({ ...editingLockEntry, note: e.target.value })
                  }
                  placeholder="For example, asked for by the clinic manager"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLockModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium cursor-pointer shadow-xs"
                >
                  Pin the day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: LOCK OVERRIDE PROTOCOL --- */}
      {isOverrideModalOpen && activeLockToOverride && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            ref={overrideDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={overrideTitleId}
            className="bg-white rounded-lg border border-red-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-xs animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-5 h-5 shrink-0" aria-hidden="true" />
              <h3 id={overrideTitleId} className="text-sm font-bold text-slate-900">
                Remove the pin?
              </h3>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-xs">
                This day is pinned for {formatDate(activeLockToOverride.date)}, so filling a roster leaves it as it is.
              </p>
              <p className="text-[11px] text-red-800">
                Nurse:{' '}
                <strong>
                  {nurses.find((n) => n.id === activeLockToOverride.nurseId)?.fullName}
                </strong>{' '}
                · What is pinned: <strong>{activeLockToOverride.mode === 'OFF' ? 'A day off' : 'A shift'}</strong>
              </p>
              {activeLockToOverride.note && (
                <p className="text-[10px] text-red-700 italic">
                  Note: "{activeLockToOverride.note}"
                </p>
              )}
              {activeLockToOverride.mode === 'OFF' && activeLockToOverride.id.startsWith('lock-off-') && (
                <p className="text-[11px] text-red-800">
                  If this day off comes from an approved request, removing the pin also declines the request. You can approve it
                  again in Requests, under All day off and shift requests.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700">
                  To remove the pin, type OVERRIDE:
                </label>
                <button
                  type="button"
                  onClick={() => setOverrideInput('OVERRIDE')}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
                >
                  Fill in OVERRIDE
                </button>
              </div>
              <input aria-label="Type OVERRIDE to confirm"
                type="text"
                value={overrideInput}
                onChange={(e) => setOverrideInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleExecuteLockOverride();
                  }
                }}
                placeholder="OVERRIDE"
                className="w-full px-3 py-2 border-2 border-red-300 rounded font-mono font-bold text-center tracking-wider text-sm focus:outline-none focus:border-red-500 uppercase"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isOverridingLock}
                onClick={() => {
                  setIsOverrideModalOpen(false);
                  setActiveLockToOverride(null);
                  setOverrideInput('');
                }}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer disabled:opacity-50"
              >
                Keep the pin
              </button>
              <button
                type="button"
                disabled={isOverridingLock || overrideInput.trim().toUpperCase() !== 'OVERRIDE'}
                onClick={handleExecuteLockOverride}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-50"
              >
                {isOverridingLock ? 'Removing the pin…' : 'Remove the pin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: CSV LEAVE IMPORT --- */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            ref={csvDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={csvTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <h3 id={csvTitleId} className="text-sm font-bold text-slate-900">Import Leave via CSV</h3>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-slate-600 text-[11px]">
                Paste CSV rows with the following column headers:
                <br />
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800 text-[10px]">
                  gmail, leaveType acronym, startDate, endDate
                </code>
              </p>
              <textarea aria-label="CSV leave rows"
                rows={6}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="maryam.nuaimi.rn@gmail.com, AL, 2026-10-12, 2026-10-16&#10;fatima.alzahra.nurse@gmail.com, SL, 2026-10-05, 2026-10-06"
                className="w-full p-2.5 border border-slate-300 rounded font-mono text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {csvImportLog && (
              <div className="p-2.5 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-slate-800">
                {csvImportLog}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleProcessLeaveCsv}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer shadow-xs"
              >
                Import Entries
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
