import React, { useState, useEffect, useRef, useId } from 'react';
import { useDialogA11y } from '../common/useDialogA11y';
import { notify, confirmDialog } from '../common/dialogs';
import {
  CalendarRange,
  Plus,
  Sparkles,
  Download,
  Share2,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  AlertTriangle,
  ChevronRight,
  Check,
  X,
  Trash2,
  Shield,
  Save,
  History,
  Diff,
  FolderOpen,
  Scale,
  ArrowLeftRight,
  Maximize2,
  Minimize2,
  Star,
  Undo2,
  Redo2,
  RotateCcw,
  MoreHorizontal,
} from 'lucide-react';
import { MenuButton } from '../common/MenuButton';
import { PageLoading } from '../common/PageLoading';
import { ProblemsPanel } from '../workbook/ProblemsPanel';
import { WhoCanCover } from '../workbook/WhoCanCover';
import { nurseClinicRoleOf } from '../../services/engine/clinicModel';
import { ClinicContextState } from '../../types/navigation';
import { getRepository } from '../../services/repository';
import { CollectionSyncer } from '../../services/repository/collectionSyncer';
import { chooseScheduleToOpen } from '../../services/schedule/openSchedule';
import { quotaTracker, QuotaExceededError } from '../../services/firebase/quotaTracker';
import {
  Schedule,
  ScheduleVersion,
  Assignment,
  Nurse,
  Doctor,
  DoctorSession,
  LockEntry,
  LeaveEntry,
  ClinicalRole,
  Specialty,
  SeniorityLevel,
  DutyWindow,
  Rule,
  PublicHoliday,
  LeaveType,
  NurseHoursQuota,
  WorkingHoursPeriod,
} from '../../types';
import { loadClinicSetup } from '../../services/engine/clinicSetupService';
import type { ClinicSetup } from '../../services/engine/clinicModel';
import { SchedulingEngine } from '../../services/engine/SchedulingEngine';
import { calculateWorkingHoursForDateRange } from '../../services/periods/workingHoursPeriodService';
import {
  GenerationPreflightSummary,
  GenerationProgress,
  RegenerateMode,
} from '../../services/engine/types';
import { ScheduleValidator, ValidationReport } from '../../services/validation/ScheduleValidator';
import { WorkbookGrid } from '../workbook/WorkbookGrid';
import { DoctorsScheduleSheet } from '../workbook/DoctorsScheduleSheet';
import { CoverageSheet } from '../workbook/CoverageSheet';
import { WarningsSheet } from '../workbook/WarningsSheet';
import { LeaveAndLocksSheet } from '../workbook/LeaveAndLocksSheet';
import { HoursAccountingSheet } from '../workbook/HoursAccountingSheet';
import { VersionCompareModal } from '../modals/VersionCompareModal';
import { ExportModal } from '../modals/ExportModal';
import { ShareModal } from '../modals/ShareModal';
import { PublishModal } from '../modals/PublishModal';
import { FairnessModal } from '../modals/FairnessModal';
import { TemplateModal } from '../modals/TemplateModal';
import { SwapManagerModal } from '../modals/SwapManagerModal';
import { CreateScheduleModal } from '../modals/CreateScheduleModal';
import { DeleteScheduleModal } from '../modals/DeleteScheduleModal';
import { deleteEntireSchedule } from '../../services/schedule/scheduleDeletionService';
import { populateRecurringDoctorSessionsForSchedule } from '../../services/schedule/doctorScheduleService';
import { formatDate } from '../../utils/dateUtils';

/** One undo step: the roster's shifts, pinned days and leave at that moment. */
interface RosterSnapshot {
  scheduleId: string;
  assignments: Assignment[];
  locks: LockEntry[];
  leaveEntries: LeaveEntry[];
}

const OPEN_SCHEDULE_KEY = 'clinic_roster_active_schedule_id';

function readStoredScheduleId(): string | null {
  try {
    return localStorage.getItem(OPEN_SCHEDULE_KEY);
  } catch {
    return null;
  }
}

function storeScheduleId(id: string | null): void {
  try {
    if (id) localStorage.setItem(OPEN_SCHEDULE_KEY, id);
    else localStorage.removeItem(OPEN_SCHEDULE_KEY);
  } catch {
    // ignore
  }
}

interface SchedulesViewProps {
  context: ClinicContextState;
  onOpenSharePreview?: (token: string) => void;
  initialOpenCreate?: boolean;
}

export const SchedulesView: React.FC<SchedulesViewProps> = ({
  context,
  onOpenSharePreview,
  initialOpenCreate = false,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null);
  const activeScheduleRef = useRef<Schedule | null>(null);
  activeScheduleRef.current = activeSchedule;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [sessions, setSessions] = useState<DoctorSession[]>([]);
  const [locks, setLocks] = useState<LockEntry[]>([]);
  const [leaveEntries, setLeaveEntries] = useState<LeaveEntry[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [roles, setClinicalRoles] = useState<ClinicalRole[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [seniorityLevels, setSeniorityLevels] = useState<SeniorityLevel[]>([]);
  const [dutyWindows, setDutyWindows] = useState<DutyWindow[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  // Opening hours, public holidays and the end of the previous roster, for the engine and the checker
  const clinicSetupRef = useRef<ClinicSetup | undefined>(undefined);
  const [quotas, setQuotas] = useState<NurseHoursQuota[]>([]);

  // Validation Report state
  const [validationReport, setValidationReport] = useState<ValidationReport>({
    scheduleId: '',
    timestamp: '',
    errorCount: 0,
    warnCount: 0,
    infoCount: 0,
    findings: [],
    hourlyCoverageMap: {},
  });

  // Create Schedule Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  useEffect(() => {
    if (initialOpenCreate) {
      setIsNewModalOpen(true);
    }
  }, [initialOpenCreate]);

  // Pre-flight & Generation Modal
  const [isPreflightModalOpen, setIsPreflightModalOpen] = useState(false);
  const [preflightSummary, setPreflightSummary] = useState<GenerationPreflightSummary | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGenerationMode, setActiveGenerationMode] = useState<RegenerateMode>('GENERATE_ALL');
  const [clearIncludeManual, setClearIncludeManual] = useState(false);
  // Generate All keeps cells changed by hand unless this is unticked.
  const [keepManualOnGenerate, setKeepManualOnGenerate] = useState(true);
  // Fill only these dates (the rest of the roster stays as it is).
  const [fillRange, setFillRange] = useState<{ enabled: boolean; start: string; end: string }>({ enabled: false, start: '', end: '' });

  // Active Block & Tab selection in Workbook View
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'roster' | 'doctors' | 'coverage' | 'warnings' | 'leave' | 'hours' | 'legend'>('roster');

  // Unpin a day dialog
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [activeLockToOverride, setActiveLockToOverride] = useState<LockEntry | null>(null);

  // Save with Note Modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveNote, setSaveNote] = useState('');
  const [versions, setVersions] = useState<ScheduleVersion[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishWizardMode, setPublishWizardMode] = useState<'PUBLISH' | 'CHANGE'>('PUBLISH');
  const [isSchedulePickerOpen, setIsSchedulePickerOpen] = useState(false);
  const [isDeleteScheduleModalOpen, setIsDeleteScheduleModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
  // Counts shown in the delete dialog, for the roster being deleted (not the open one).
  const [deleteCounts, setDeleteCounts] = useState<{ shifts: number; versions: number } | null>(null);
  const [isFairnessModalOpen, setIsFairnessModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [lastAutosavedAt, setLastAutosavedAt] = useState<string | null>(null);
  // Save status shown in the toolbar: saving, saved, or why the last save failed.
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Set when the clinic details (holidays, opening hours, previous roster) could not be loaded.
  const [clinicSetupError, setClinicSetupError] = useState<string | null>(null);
  // Changes are only written after the workspace loaded completely; otherwise a
  // partly loaded (empty) roster could overwrite the real one.
  const workspaceLoadedRef = useRef(false);
  // The roster that is open, kept across reloads of the page data (and in this
  // browser), so saving or publishing never switches to another roster.
  const openScheduleIdRef = useRef<string | null>(readStoredScheduleId());
  // Guards against an older "open roster" load finishing after a newer one.
  const openRequestRef = useRef(0);
  // True while a roster (or the page data) is loading: edits wait, so nothing is
  // edited on a list that is about to be replaced.
  const loadingRef = useRef(true);
  const [workingHoursPeriods, setWorkingHoursPeriods] = useState<WorkingHoursPeriod[]>([]);

  // Undo/Redo (50 steps). Each step holds the shifts, pinned days and leave
  // together, and the roster it belongs to, so it can never be applied to another roster.
  const [undoStack, setUndoStack] = useState<RosterSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<RosterSnapshot[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Problems side panel, and a request for the grid to show one cell ("Show in grid").
  const [isProblemsOpen, setIsProblemsOpen] = useState(false);
  const [focusRequest, setFocusRequest] = useState<{ nurseId: string; date: string; nonce: number } | undefined>(undefined);
  // True until the page data first loaded, so an empty roster list isn't shown while loading.
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Expanded View & All Days Mode
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isAllDaysExpanded, setIsAllDaysExpanded] = useState(false);

  // Dialog keyboard and screen reader support
  const saveTitleId = useId();
  const overrideTitleId = useId();
  const preflightTitleId = useId();
  const pickerTitleId = useId();
  const saveDialogRef = useDialogA11y<HTMLDivElement>(isSaveModalOpen, () => setIsSaveModalOpen(false));
  const overrideDialogRef = useDialogA11y<HTMLDivElement>(isOverrideModalOpen && !!activeLockToOverride, () =>
    setIsOverrideModalOpen(false)
  );
  const preflightDialogRef = useDialogA11y<HTMLDivElement>(isPreflightModalOpen && !!preflightSummary, () => {
    // Can't be closed while a generation run is in progress (same as the Cancel button)
    if (!isGenerating) setIsPreflightModalOpen(false);
  });
  const pickerDialogRef = useDialogA11y<HTMLDivElement>(isSchedulePickerOpen, () => setIsSchedulePickerOpen(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpandedView) {
        setIsExpandedView(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpandedView]);

  const repo = getRepository();

  // Saving: only what changed since it was loaded or last saved is written, one
  // save at a time, and records this browser never saw are never deleted.
  const [, setSyncTick] = useState(0);
  const syncersRef = useRef<{
    assignments: CollectionSyncer<'assignments'>;
    locks: CollectionSyncer<'locks'>;
    leaveEntries: CollectionSyncer<'leaveEntries'>;
  } | null>(null);
  if (!syncersRef.current) {
    const onChange = () => setSyncTick((t) => t + 1);
    syncersRef.current = {
      assignments: new CollectionSyncer(repo, 'assignments', onChange),
      locks: new CollectionSyncer(repo, 'locks', onChange),
      leaveEntries: new CollectionSyncer(repo, 'leaveEntries', onChange),
    };
  }
  const syncers = syncersRef.current;
  const hasUnsavedChanges = () =>
    syncers.assignments.hasUnsaved() || syncers.locks.hasUnsaved() || syncers.leaveEntries.hasUnsaved();

  const loadData = async () => {
    try {
      setLoadError(null);
      loadingRef.current = true;
      // Edits still being saved finish first, so the reload doesn't undo them on screen.
      await Promise.all([syncers.assignments.idle(), syncers.locks.idle(), syncers.leaveEntries.idle()]);
      // Undo steps hold whole lists from before the reload; applying one now could
      // remove or revert changes other people made meanwhile.
      setUndoStack([]);
      setRedoStack([]);
      const [
        schedList,
        nList,
        dList,
        sessList,
        lkList,
        leList,
        ltList,
        crList,
        spList,
        sList,
        dwList,
        rList,
        hList,
        qList,
        whpList,
      ] = await Promise.all([
        repo.list('schedules'),
        // Shifts and versions are loaded for the open roster only (see openSchedule).
        repo.list('nurses'),
        repo.list('doctors'),
        repo.list('doctorSessions'),
        repo.list('locks'),
        repo.list('leaveEntries'),
        repo.list('leaveTypes'),
        repo.list('clinicalRoles'),
        repo.list('specialties'),
        repo.list('seniorityLevels'),
        repo.list('dutyWindows'),
        repo.list('rules'),
        repo.list('holidays'),
        repo.list('quotas'),
        repo.list('workingHoursPeriods'),
      ]);

      const sortedWhp = [...whpList].sort((a, b) => a.startDate.localeCompare(b.startDate));
      setWorkingHoursPeriods(sortedWhp);

      // Leave records are never deleted while loading (an older clean up here removed
      // real public holiday leave every time the page opened).
      const activeLeaveList = leList;

      const uniqueSchedules = Array.from(new Map(schedList.map((s) => [s.id, s])).values());
      setSchedules(uniqueSchedules);
      setNurses(nList.filter((n) => n.active));
      setDoctors(dList.filter((d) => d.active));
      setSessions(sessList);
      setLocks(lkList);
      setLeaveEntries(activeLeaveList);
      syncers.locks.replaceKnown(lkList);
      syncers.leaveEntries.replaceKnown(activeLeaveList);
      setLeaveTypes(ltList);
      setClinicalRoles(crList);
      setSpecialties(spList);
      setSeniorityLevels(sList);
      setDutyWindows(dwList);
      setRules(rList);
      setHolidays(hList);
      setQuotas(qList);

      const current = chooseScheduleToOpen(uniqueSchedules, openScheduleIdRef.current, context.activeScheduleId);
      if (current) {
        await openSchedule(current, {
          nurses: nList.filter((n) => n.active),
          seniorityLevels: sList,
          dutyWindows: dwList,
          sessions: sessList,
          leaveEntries: leList,
          locks: lkList,
          roles: crList,
          rules: rList,
          workingHoursPeriods: sortedWhp,
          specialties: spList,
          doctors: dList,
          leaveTypes: ltList,
        });
      } else {
        setActiveSchedule(null);
        setAssignments([]);
        setVersions([]);
      }
      workspaceLoadedRef.current = true;
      loadingRef.current = false;
      setIsFirstLoad(false);
    } catch (err: any) {
      console.error('Error loading schedule workspace:', err);
      workspaceLoadedRef.current = false;
      loadingRef.current = false;
      setIsFirstLoad(false);
      setLoadError(err?.message || 'The schedule workspace could not be loaded.');
    }
  };

  /** Everything the checker needs, taken from the current state unless given. */
  type CheckInputs = {
    nurses: Nurse[];
    seniorityLevels: SeniorityLevel[];
    dutyWindows: DutyWindow[];
    sessions: DoctorSession[];
    leaveEntries: LeaveEntry[];
    locks: LockEntry[];
    roles: ClinicalRole[];
    rules: Rule[];
    workingHoursPeriods: WorkingHoursPeriod[];
    specialties: Specialty[];
    doctors: Doctor[];
    leaveTypes: LeaveType[];
  };
  const currentCheckInputs = (): CheckInputs => ({
    nurses,
    seniorityLevels,
    dutyWindows,
    sessions,
    leaveEntries,
    locks,
    roles,
    rules,
    workingHoursPeriods,
    specialties,
    doctors,
    leaveTypes,
  });

  const runValidation = (sched: Schedule, list: Assignment[], overrides: Partial<CheckInputs> = {}) => {
    const x = { ...currentCheckInputs(), ...overrides };
    setValidationReport(
      ScheduleValidator.validate(
        sched,
        list,
        x.nurses,
        x.seniorityLevels,
        x.dutyWindows,
        x.sessions,
        x.leaveEntries,
        x.locks,
        x.roles,
        x.rules,
        x.workingHoursPeriods,
        x.specialties,
        x.doctors,
        x.leaveTypes,
        clinicSetupRef.current
      )
    );
  };

  /**
   * Opens one roster: loads its shifts and versions, resets undo and the
   * problem list, and remembers it so later reloads stay on it.
   */
  const openSchedule = async (sched: Schedule, inputs?: CheckInputs) => {
    const request = ++openRequestRef.current;
    const switching = openScheduleIdRef.current !== sched.id || activeScheduleRef.current?.id !== sched.id;
    loadingRef.current = true;
    openScheduleIdRef.current = sched.id;
    storeScheduleId(sched.id);
    setActiveSchedule(sched);
    if (switching) {
      // Undo steps and the problem list belong to the roster they were made on.
      setUndoStack([]);
      setRedoStack([]);
      setSelectedBlockIndex(0);
      setAssignments([]); // never show (or edit) the old roster's shifts under the new one
      setValidationReport((prev) => ({ ...prev, scheduleId: sched.id, findings: [], errorCount: 0, warnCount: 0, infoCount: 0 }));
    }
    // Let edits that are still being saved finish first, so the reload includes them.
    await Promise.all([syncers.assignments.idle(), syncers.locks.idle(), syncers.leaveEntries.idle()]);
    let list: Assignment[];
    let vList: ScheduleVersion[];
    let setup: ClinicSetup | undefined;
    try {
      [list, vList, setup] = await Promise.all([
        repo.list('assignments', { field: 'scheduleId', operator: '==', value: sched.id }),
        repo.list('versions', { field: 'scheduleId', operator: '==', value: sched.id }),
        loadClinicSetup(repo, sched).catch((err) => {
          console.error('Could not load the clinic details for this roster:', err);
          return undefined;
        }),
      ]);
    } catch (err) {
      if (request === openRequestRef.current) {
        workspaceLoadedRef.current = false;
        loadingRef.current = false;
      }
      throw err;
    }
    if (request !== openRequestRef.current) return; // a newer roster was opened meanwhile
    // What is saved for this roster is exactly what was just loaded.
    syncers.assignments.replaceKnown(list, (a) => a.scheduleId === sched.id);
    loadingRef.current = false;
    clinicSetupRef.current = setup;
    setClinicSetupError(
      setup ? null : 'Public holidays, opening hours and the previous roster could not be loaded. Reload the page before generating.'
    );
    setAssignments(list);
    setVersions([...vList].sort((a, b) => b.number - a.number));
    runValidation(sched, list, inputs);
  };

  /** Runs a save and shows its outcome in the toolbar. */
  const trackSave = async (save: Promise<boolean>, what: string): Promise<boolean> => {
    setIsSaving(true);
    const ok = await save;
    const failed = [syncers.assignments, syncers.locks, syncers.leaveEntries].find((x) => x.lastError !== null);
    setIsSaving(hasUnsavedChanges() && !failed);
    if (failed) {
      const err: any = failed.lastError;
      setSaveError(
        err instanceof QuotaExceededError
          ? err.message
          : `${what} not saved: ${err?.message || 'the database could not be reached'}. Retrying automatically.`
      );
    } else if (ok) {
      setSaveError(null);
      setLastAutosavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
    return ok;
  };

  const notLoadedMessage = 'Not saved: the workspace did not load completely. Reload the page before editing.';

  /** Saves a roster's shifts (only the changed ones). */
  const persistAssignments = async (scheduleId: string, list: Assignment[]): Promise<boolean> => {
    if (!workspaceLoadedRef.current) {
      setSaveError(notLoadedMessage);
      return false;
    }
    const withSchedule = list.map((a) => (a.scheduleId ? a : { ...a, scheduleId }));
    return trackSave(syncers.assignments.save(withSchedule, (a) => a.scheduleId === scheduleId, scheduleId), 'Shifts');
  };

  const persistLocks = (next: LockEntry[]) => {
    if (!workspaceLoadedRef.current) {
      setSaveError(notLoadedMessage);
      return Promise.resolve(false);
    }
    return trackSave(syncers.locks.save(next), 'Pinned days');
  };

  const persistLeave = (next: LeaveEntry[]) => {
    if (!workspaceLoadedRef.current) {
      setSaveError(notLoadedMessage);
      return Promise.resolve(false);
    }
    return trackSave(syncers.leaveEntries.save(next), 'Leave');
  };

  useEffect(() => {
    loadData();
  }, []);

  // Every edit is saved straight away. This timer only retries a save that
  // failed (for example while offline or when the daily quota is used up).
  useEffect(() => {
    const retryTimer = setInterval(() => {
      if (quotaTracker.isQuotaExceeded()) return;
      for (const [what, syncer] of [
        ['Shifts', syncers.assignments],
        ['Pinned days', syncers.locks],
        ['Leave', syncers.leaveEntries],
      ] as const) {
        const retry = syncer.retry();
        if (retry) void trackSave(retry, what);
      }
    }, 30000);
    return () => clearInterval(retryTimer);
  }, []);

  // Warn before closing the tab while a change is still being saved (or failed).
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges()) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Debounce timer ref for live validation
  const validationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const snapshotNow = (): RosterSnapshot | null =>
    activeSchedule ? { scheduleId: activeSchedule.id, assignments, locks, leaveEntries } : null;

  /**
   * Applies one edit (shifts, pinned days and leave together): one undo step,
   * one save per changed list, and one check with all three.
   */
  const applyEdit = (
    edit: { assignments?: Assignment[]; locks?: LockEntry[]; leaveEntries?: LeaveEntry[] },
    options: { recordUndo?: boolean } = {}
  ) => {
    if (!activeSchedule) return;
    if (loadingRef.current) {
      triggerToast('The roster is still loading. Try again in a moment.');
      return;
    }
    const sched = activeSchedule;
    if (options.recordUndo !== false) {
      const before = snapshotNow();
      if (before) setUndoStack((prev) => [before, ...prev].slice(0, 50));
      setRedoStack([]);
    }
    const nextAssignments = edit.assignments ?? assignments;
    const nextLocks = edit.locks ?? locks;
    const nextLeave = edit.leaveEntries ?? leaveEntries;
    if (edit.assignments) {
      setAssignments(nextAssignments);
      void persistAssignments(sched.id, nextAssignments);
    }
    if (edit.locks) {
      setLocks(nextLocks);
      void persistLocks(nextLocks);
    }
    if (edit.leaveEntries) {
      setLeaveEntries(nextLeave);
      void persistLeave(nextLeave);
    }
    if (validationTimerRef.current) clearTimeout(validationTimerRef.current);
    validationTimerRef.current = setTimeout(
      () => runValidation(sched, nextAssignments, { locks: nextLocks, leaveEntries: nextLeave }),
      300
    );
  };

  const handleAssignmentsChange = (next: Assignment[]) => applyEdit({ assignments: next });
  const handleLocksChange = (next: LockEntry[]) => applyEdit({ locks: next });
  const handleLeaveEntriesChange = (next: LeaveEntry[]) => applyEdit({ leaveEntries: next });

  const handleSessionsChange = (nextSessions: DoctorSession[]) => {
    setSessions(nextSessions);
    if (activeSchedule) runValidation(activeSchedule, assignments, { sessions: nextSessions });
  };

  // Calculate blocks for active schedule
  const getScheduleBlocks = () => {
    if (!activeSchedule) return [];
    const start = new Date(activeSchedule.startDate);
    const end = new Date(activeSchedule.endDate);
    const totalDays =
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const blockSizeDays = activeSchedule.blockWeeks * 7;
    const numBlocks = Math.ceil(totalDays / blockSizeDays);

    const blocks: { index: number; label: string; startDay: number; endDay: number; startDate: string; endDate: string }[] = [];
    for (let b = 0; b < numBlocks; b++) {
      const bStartDay = b * blockSizeDays + 1;
      const bEndDay = Math.min((b + 1) * blockSizeDays, totalDays);

      const bStartDateObj = new Date(start);
      bStartDateObj.setUTCDate(start.getUTCDate() + (bStartDay - 1));
      const bEndDateObj = new Date(start);
      bEndDateObj.setUTCDate(start.getUTCDate() + (bEndDay - 1));

      const bStartStr = bStartDateObj.toISOString().split('T')[0];
      const bEndStr = bEndDateObj.toISOString().split('T')[0];

      blocks.push({
        index: b,
        label: `Part ${b + 1} of ${numBlocks} (${formatDate(bStartStr)} to ${formatDate(bEndStr)})`,
        startDay: bStartDay,
        endDay: bEndDay,
        startDate: bStartStr,
        endDate: bEndStr,
      });
    }
    return blocks;
  };

  const blocks = getScheduleBlocks();
  const currentBlock = blocks[selectedBlockIndex] || blocks[0];

  // Duration readout helper
  // --- CREATE SCHEDULE FLOW ---
  const handleScheduleCreated = async (createdSchedule: Schedule, generateImmediately: boolean) => {
    openScheduleIdRef.current = createdSchedule.id;
    storeScheduleId(createdSchedule.id);
    await loadData();
    triggerToast(`Roster "${createdSchedule.name}" created.`);

    if (generateImmediately) {
      handleOpenPreflight('GENERATE_ALL', createdSchedule);
    }
  };

  useEffect(() => {
    if (!scheduleToDelete) {
      setDeleteCounts(null);
      return;
    }
    if (scheduleToDelete.id === activeSchedule?.id) {
      setDeleteCounts({ shifts: assignments.length, versions: versions.length });
      return;
    }
    let cancelled = false;
    const by = { field: 'scheduleId', operator: '==' as const, value: scheduleToDelete.id };
    Promise.all([repo.list('assignments', by), repo.list('versions', by)])
      .then(([a, v]) => {
        if (!cancelled) setDeleteCounts({ shifts: a.length, versions: v.length });
      })
      .catch(() => {
        if (!cancelled) setDeleteCounts(null);
      });
    return () => {
      cancelled = true;
    };
  }, [scheduleToDelete?.id]);

  // --- DELETE SCHEDULE FLOW ---
  const handleConfirmDeleteSchedule = async (sched: Schedule) => {
    try {
      // A save still running for this roster would write its shifts back after the delete.
      await syncers.assignments.idle();
      const result = await deleteEntireSchedule(repo, sched.id, context.currentUser?.name || 'Admin');
      syncers.assignments.forgetScope(sched.id, (a) => a.scheduleId === sched.id);

      const remainingSchedules = schedules.filter((s) => s.id !== sched.id);
      setSchedules(remainingSchedules);

      setIsDeleteScheduleModalOpen(false);
      setScheduleToDelete(null);
      triggerToast(`Roster "${result.scheduleName}" was deleted.`);

      if (activeSchedule?.id === sched.id) {
        const nextSched = chooseScheduleToOpen(remainingSchedules, null, null);
        if (nextSched) {
          await openSchedule(nextSched);
        } else {
          openScheduleIdRef.current = null;
          storeScheduleId(null);
          setActiveSchedule(null);
          setAssignments([]);
          setVersions([]);
          setUndoStack([]);
          setRedoStack([]);
        }
      }
    } catch (err: any) {
      console.error('Delete schedule failed:', err);
      notify(`Delete schedule failed: ${err.message || 'Unknown error'}`, 'error');
    }
  };

  // Helper to determine Dedicated Period or Prorated chip for a schedule
  const getSchedulePeriodChip = (sched: Schedule) => {
    if (sched.periodName) {
      const isExact = !sched.periodName.toLowerCase().includes('prorated');
      return {
        label: isExact ? `Period: ${sched.periodName} · ${sched.hoursTargetFullTime}h` : sched.periodName,
        tooltip: `Period target: ${sched.hoursTargetFullTime}h FT contracted hours`,
        isExact,
      };
    }

    if (workingHoursPeriods.length > 0 && sched.startDate && sched.endDate) {
      const calc = calculateWorkingHoursForDateRange(sched.startDate, sched.endDate, workingHoursPeriods);
      if (calc.isExactMatch && calc.matchedPeriod) {
        return {
          label: `Period: ${calc.matchedPeriod.name} · ${sched.hoursTargetFullTime || calc.targetHours}h`,
          tooltip: `Exact match for dedicated cycle ${calc.matchedPeriod.name} (${calc.targetHours}h FT)`,
          isExact: true,
        };
      }
      return {
        label: `${calc.totalScheduleDays}d Prorated · ${sched.hoursTargetFullTime || calc.targetHours}h`,
        tooltip: calc.description,
        isExact: false,
      };
    }

    return {
      label: `${sched.hoursTargetFullTime || 160}h Target`,
      tooltip: `Standard target: ${sched.hoursTargetFullTime || 160} working hours`,
      isExact: false,
    };
  };

  // Keep the clinic details current when another roster is opened or holidays change
  useEffect(() => {
    if (!activeSchedule) return;
    let cancelled = false;
    loadClinicSetup(repo, activeSchedule)
      .then((setup) => {
        if (cancelled) return;
        clinicSetupRef.current = setup;
        setClinicSetupError(null);
      })
      .catch((err) => {
        console.error('Could not load the clinic details:', err);
        if (!cancelled) setClinicSetupError('Public holidays, opening hours and the previous roster could not be loaded. Reload the page before generating.');
      });
    return () => {
      cancelled = true;
    };
  }, [activeSchedule?.id, activeSchedule?.startDate, holidays]);

  // --- OPEN GENERATION PRE-FLIGHT ---
  const handleOpenPreflight = async (mode: RegenerateMode, targetSchedule?: Schedule) => {
    const sched = targetSchedule || activeSchedule;
    if (!sched) return;

    let currentSessions = sessions;

    // The doctors' weekly sessions are only added when the run starts. Here they
    // are worked out without saving, so cancelling this dialog changes nothing.
    if (mode !== 'CLEAR_GENERATED' && sched.startDate && sched.endDate && doctors.length > 0) {
      try {
        const preview = await populateRecurringDoctorSessionsForSchedule({
          repo,
          startDate: sched.startDate,
          endDate: sched.endDate,
          doctors,
          dryRun: true,
        });
        if (preview.newSessions.length > 0) currentSessions = [...sessions, ...preview.newSessions];
      } catch (err) {
        console.error('Could not check the doctors\' weekly sessions:', err);
      }
    }

    const summary = SchedulingEngine.computePreflight(
      sched,
      nurses,
      doctors,
      currentSessions,
      locks,
      leaveEntries,
      roles,
      rules,
      dutyWindows,
      workingHoursPeriods
    );

    setActiveGenerationMode(mode);
    setClearIncludeManual(false);
    setKeepManualOnGenerate(true);
    setFillRange({ enabled: false, start: sched.startDate, end: sched.endDate });
    setPreflightSummary(summary);
    setGenerationProgress(null);
    setIsPreflightModalOpen(true);
  };

  // --- TOGGLE NURSE CLINIC HARD/SOFT RULE FROM PRE-FLIGHT MODAL ---
  const handleUpdateNurseClinicRule = async (severity: 'HARD' | 'SOFT', enabled: boolean) => {
    try {
      const existing = rules.find(
        (r) => r.templateKey === 'DEDICATED_NURSE_CLINIC' || r.id === 'rule-nurse-clinic'
      );
      let updatedRules = [...rules];
      if (existing) {
        await repo.update('rules', existing.id, { severity, enabled });
        updatedRules = rules.map((r) =>
          r.id === existing.id ? { ...r, severity, enabled } : r
        );
      } else {
        const created = await repo.create('rules', {
          id: 'rule-nurse-clinic',
          name: 'Dedicated nurse clinic coverage (not assigned to doctor)',
          templateKey: 'DEDICATED_NURSE_CLINIC',
          scope: 'PER_DAY',
          metric: 'DUTIES_WITH_END_TIME_X_COUNT',
          operator: 'MIN',
          value: 1,
          severity,
          enabled,
        });
        updatedRules.push(created);
      }
      setRules(updatedRules);

      const targetSched = activeSchedule;
      if (targetSched) {
        const summary = SchedulingEngine.computePreflight(
          targetSched,
          nurses,
          doctors,
          sessions,
          locks,
          leaveEntries,
          roles,
          updatedRules,
          dutyWindows,
          workingHoursPeriods
        );
        setPreflightSummary(summary);
      }
    } catch (err) {
      console.error('Failed to update nurse clinic rule:', err);
    }
  };

  // --- RUN DETERMINISTIC ENGINE PASS ---
  const handleExecuteGeneration = async () => {
    if (!activeSchedule) return;
    setIsGenerating(true);

    try {
      // Fresh clinic details for this roster (holidays or the previous roster may have changed).
      // Without them the generator would ignore public holidays and the previous roster.
      let generationClinicSetup: ClinicSetup;
      try {
        generationClinicSetup = await loadClinicSetup(repo, activeSchedule);
      } catch (err: any) {
        setClinicSetupError('Public holidays, opening hours and the previous roster could not be loaded.');
        triggerToast(`Not filled: the clinic details could not be loaded (${err?.message || 'database unavailable'}). Try again.`);
        setIsGenerating(false);
        return;
      }
      clinicSetupRef.current = generationClinicSetup;
      setClinicSetupError(null);

      // A backup copy of the roster as it is now, so a fill or clear can be undone
      // even after leaving the page (More > Backup copies).
      let backupKept = false;
      if (assignments.length > 0) {
        try {
          await saveBackup(activeSchedule, activeGenerationMode === 'CLEAR_GENERATED' ? 'Before clearing' : 'Before filling');
          backupKept = true;
        } catch (err: any) {
          const goOn = await confirmDialog({
            title: 'No backup copy',
            message: `A backup copy of the roster couldn't be saved (${err?.message || err}). Go on anyway? Undo still works until you leave the page.`,
            confirmLabel: 'Go on',
            danger: true,
          });
          if (!goOn) {
            setIsGenerating(false);
            return;
          }
        }
      }
      const backupNote = backupKept ? ' A backup copy was kept (More, Backup copies).' : '';
      const beforeRun = snapshotNow();
      if (beforeRun) setUndoStack((prev) => [beforeRun, ...prev].slice(0, 50));
      setRedoStack([]);

      if (activeGenerationMode === 'CLEAR_GENERATED') {
        const result = await SchedulingEngine.generate(
          activeSchedule,
          'CLEAR_GENERATED',
          assignments,
          nurses,
          seniorityLevels,
          dutyWindows,
          roles,
          specialties,
          sessions,
          locks,
          leaveEntries,
          rules,
          (progress) => {
            setGenerationProgress(progress);
          },
          workingHoursPeriods,
          doctors,
          leaveTypes,
          generationClinicSetup
        );

        let finalAssignments = result.assignments;
        if (clearIncludeManual) {
          finalAssignments = finalAssignments.filter((a) => a.source === 'LOCK');
        }

        setAssignments(finalAssignments);
        const clearSaved = await persistAssignments(activeSchedule.id, finalAssignments);

        const report = ScheduleValidator.validate(
          activeSchedule,
          finalAssignments,
          nurses,
          seniorityLevels,
          dutyWindows,
          sessions,
          leaveEntries,
          locks,
          roles,
          rules,
          workingHoursPeriods,
          specialties,
          doctors,
          leaveTypes,
          clinicSetupRef.current
        );
        setValidationReport(report);

        const clearedCount = assignments.length - finalAssignments.length;
        triggerToast(
          clearSaved
            ? `Cleared ${clearedCount} shifts. ${finalAssignments.length} shifts kept (pinned${clearIncludeManual ? '' : ' or changed by hand'}).${backupNote}`
            : `Cleared ${clearedCount} shifts on screen, but saving failed. See the message at the top.`
        );
        setIsPreflightModalOpen(false);
        setIsGenerating(false);
        return;
      }

      // STEP 1: Guarantee doctor's recurring schedule is filled first for the entire schedule period
      let currentSessions = sessions;
      if (activeSchedule.startDate && activeSchedule.endDate && doctors.length > 0) {
        try {
          const fillResult = await populateRecurringDoctorSessionsForSchedule({
            repo,
            startDate: activeSchedule.startDate,
            endDate: activeSchedule.endDate,
            doctors,
          });
          if (fillResult.createdCount > 0) {
            currentSessions = await repo.list('doctorSessions');
            setSessions(currentSessions);
          }
        } catch (fillErr) {
          console.error('Failed to auto-populate doctor recurring schedule before generation:', fillErr);
        }
      }

      // Filling only some dates: shifts outside them are passed in as hand changes, so
      // they stay and still count for hours and rest, and are put back unchanged after.
      const useRange = fillRange.enabled && !!fillRange.start && !!fillRange.end;
      const inRange = (date: string) => !useRange || (date >= fillRange.start && date <= fillRange.end);
      const engineInput = useRange
        ? assignments
            .filter(
              (a) => !inRange(a.date) || activeGenerationMode !== 'GENERATE_ALL' || keepManualOnGenerate || a.source !== 'MANUAL'
            )
            .map((a) => (inRange(a.date) ? a : { ...a, source: 'MANUAL' as const }))
        : assignments;

      const engineResult = await SchedulingEngine.generate(
        activeSchedule,
        activeGenerationMode,
        engineInput,
        nurses,
        seniorityLevels,
        dutyWindows,
        roles,
        specialties,
        currentSessions,
        locks,
        leaveEntries,
        rules,
        (progress) => {
          setGenerationProgress(progress);
        },
        workingHoursPeriods,
        doctors,
          leaveTypes,
          generationClinicSetup,
          { keepManual: useRange || activeGenerationMode !== 'GENERATE_ALL' || keepManualOnGenerate }
      );
      const result = useRange
        ? {
            ...engineResult,
            assignments: [
              ...assignments.filter((a) => !inRange(a.date)),
              ...engineResult.assignments.filter((a) => inRange(a.date)),
            ],
          }
        : engineResult;

      // If engine resolved an authoritative period target, synchronize the schedule record
      let effectiveSchedule = activeSchedule;
      if (
        result.effectiveFullTimeTarget &&
        (result.effectiveFullTimeTarget !== activeSchedule.hoursTargetFullTime ||
          (result.periodName && result.periodName !== activeSchedule.periodName))
      ) {
        const scheduleUpdates: Partial<Schedule> = {
          hoursTargetFullTime: result.effectiveFullTimeTarget,
        };
        if (result.periodName) {
          scheduleUpdates.periodName = result.periodName;
        }
        await repo.update('schedules', activeSchedule.id, scheduleUpdates);
        effectiveSchedule = {
          ...activeSchedule,
          ...scheduleUpdates,
        };
        setActiveSchedule(effectiveSchedule);
        setSchedules((prev) =>
          prev.map((s) => (s.id === effectiveSchedule.id ? effectiveSchedule : s))
        );
      }

      setAssignments(result.assignments);
      const generatedSaved = await persistAssignments(effectiveSchedule.id, result.assignments);

      const report = ScheduleValidator.validate(
        effectiveSchedule,
        result.assignments,
        nurses,
        seniorityLevels,
        dutyWindows,
        currentSessions,
        leaveEntries,
        locks,
        roles,
        rules,
        workingHoursPeriods,
        specialties,
        doctors,
          leaveTypes,
          clinicSetupRef.current
      );
      setValidationReport(report);

      const overtimeCount = report.findings.filter(
        (f) => f.category === 'HOURS_IMBALANCE' && f.id.startsWith('hours-over-')
      ).length;

      if (!generatedSaved) {
        triggerToast('The roster was filled, but saving failed. See the message at the top; it retries automatically.');
        setIsPreflightModalOpen(false);
        setIsGenerating(false);
        return;
      }
      triggerToast(
        `Roster filled: ${result.assignments.length} shifts.` +
          (overtimeCount > 0 ? ` ${overtimeCount} nurse${overtimeCount === 1 ? ' is' : 's are'} over their hours.` : '') +
          (report.errorCount > 0 ? ` ${report.errorCount} problem${report.errorCount === 1 ? '' : 's'} to fix.` : ' No problems to fix.') +
          backupNote
      );
      // Show what still needs fixing next to the grid.
      if (report.errorCount > 0) setIsProblemsOpen(true);
      setIsPreflightModalOpen(false);
      setIsGenerating(false);
    } catch (err: any) {
      triggerToast(`Could not fill the roster: ${err.message}`);
      setIsGenerating(false);
    }
  };

  // --- BACKUP COPIES ---
  const BACKUPS_KEPT = 5;
  /** Keeps a copy of the roster as it is now; only the last few backups are kept. */
  const saveBackup = async (sched: Schedule, note: string) => {
    const saved = await repo.list('versions', { field: 'scheduleId', operator: '==', value: sched.id });
    const number = Math.max(sched.activeVersionNumber || 1, ...saved.map((v) => v.number || 0)) + 1;
    const inRange = (start: string, end: string) => end >= sched.startDate && start <= sched.endDate;
    const created = await repo.create('versions', {
      scheduleId: sched.id,
      number,
      timestamp: new Date().toISOString(),
      author: context.currentUser?.name || context.currentUser?.email || 'Planner',
      note,
      kind: 'BACKUP',
      snapshot: {
        schedule: sched,
        assignments,
        leaveEntries: leaveEntries.filter((l) => inRange(l.startDate, l.endDate)),
        locks: locks.filter((l) => inRange(l.date, l.date)),
        rulesSnapshot: rules,
      },
      isPublished: false,
    });
    const older = saved
      .filter((v) => v.kind === 'BACKUP')
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(BACKUPS_KEPT - 1);
    // Removing old backups is tidying up; a failure here doesn't matter.
    await Promise.all(older.map((v) => repo.remove('versions', v.id).catch(() => {})));
    const gone = new Set(older.map((v) => v.id));
    setVersions((prev) => [created, ...prev.filter((v) => !gone.has(v.id))].sort((a, b) => b.number - a.number));
  };

  const [isBackupsOpen, setIsBackupsOpen] = useState(false);
  const backupsTitleId = useId();
  const backupsDialogRef = useDialogA11y<HTMLDivElement>(isBackupsOpen, () => setIsBackupsOpen(false));
  const backups = versions
    .filter((v) => v.kind === 'BACKUP' && v.scheduleId === activeSchedule?.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  /** Puts a backup's shifts back (pinned days and leave are not changed by filling, so they stay). Undo works. */
  const handleRestoreBackup = async (backup: ScheduleVersion) => {
    if (!activeSchedule) return;
    const ok = await confirmDialog({
      title: 'Restore this backup?',
      message: `The roster's shifts go back to how they were on ${new Date(backup.timestamp).toLocaleString()} (${backup.snapshot.assignments.length} shift${backup.snapshot.assignments.length === 1 ? '' : 's'}). Pinned days and leave stay as they are now. You can undo this.`,
      confirmLabel: 'Restore',
      danger: true,
    });
    if (!ok) return;
    applyEdit({ assignments: backup.snapshot.assignments.map((a) => ({ ...a, scheduleId: activeSchedule.id })) });
    setIsBackupsOpen(false);
    triggerToast('Backup restored.');
  };

  // --- SAVE A NAMED COPY (VERSION) ---
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const handleSaveVersion = async () => {
    if (!activeSchedule || isSavingVersion) return;
    setIsSavingVersion(true);
    try {
      const sched = activeSchedule;
      // The number comes from the versions saved so far, read fresh, so two saves
      // (or two planners) don't get the same number.
      const saved = await repo.list('versions', { field: 'scheduleId', operator: '==', value: sched.id });
      const nextVerNumber = Math.max(sched.activeVersionNumber || 1, ...saved.map((v) => v.number || 0)) + 1;
      const now = new Date().toISOString();
      // Only the leave and pinned days of this roster's dates are kept with it.
      const inRange = (start: string, end: string) => end >= sched.startDate && start <= sched.endDate;
      const created = await repo.create('versions', {
        scheduleId: sched.id,
        number: nextVerNumber,
        timestamp: now,
        author: context.currentUser?.name || context.currentUser?.email || 'Planner',
        note: saveNote.trim() || 'Saved copy',
        snapshot: {
          schedule: sched,
          assignments,
          leaveEntries: leaveEntries.filter((l) => inRange(l.startDate, l.endDate)),
          locks: locks.filter((l) => inRange(l.date, l.date)),
          rulesSnapshot: rules,
        },
        isPublished: false,
      });
      await repo.update('schedules', sched.id, { activeVersionNumber: nextVerNumber, updatedAt: now });
      const updatedSched = { ...sched, activeVersionNumber: nextVerNumber, updatedAt: now };
      setActiveSchedule(updatedSched);
      setSchedules((prev) => prev.map((x) => (x.id === sched.id ? updatedSched : x)));
      setVersions([created, ...saved].sort((a, b) => b.number - a.number));
      triggerToast(`Kept a copy as v${nextVerNumber}.`);
      setIsSaveModalOpen(false);
      setSaveNote('');
    } catch (err: any) {
      notify(`Save failed: ${err.message}`, 'error');
    } finally {
      setIsSavingVersion(false);
    }
  };

  // --- UNPIN A DAY ---
  const handleExecuteLockOverride = async () => {
    if (!activeLockToOverride) return;

    try {
      const lock = activeLockToOverride;
      // The pinned shift becomes a normal hand edit, so later fills may change it.
      const unpinned = assignments.map((a) =>
        a.nurseId === lock.nurseId && a.date === lock.date && (a.locked || a.source === 'LOCK')
          ? { ...a, locked: false, source: 'MANUAL' as const }
          : a
      );
      applyEdit({ locks: locks.filter((l) => l.id !== lock.id), assignments: unpinned });
      await repo.create('audit', {
        actor: context.currentUser?.name || 'Admin',
        action: 'OVERRIDE_LOCK',
        entity: 'LockEntry',
        entityId: activeLockToOverride.id,
        before: activeLockToOverride,
        note: `Unpinned ${formatDate(activeLockToOverride.date)}.`,
        timestamp: new Date().toISOString(),
      });

      triggerToast('Day unpinned.');
      setIsOverrideModalOpen(false);
      setActiveLockToOverride(null);
    } catch (err: any) {
      triggerToast(`Could not unpin: ${err.message}`);
    }
  };

  // Undo / Redo: a step restores shifts, pinned days and leave together, and
  // only ever on the roster it was recorded for.
  const restoreSnapshot = (target: RosterSnapshot) => {
    applyEdit(
      { assignments: target.assignments, locks: target.locks, leaveEntries: target.leaveEntries },
      { recordUndo: false }
    );
  };

  const handleUndo = () => {
    const previous = undoStack[0];
    const now = snapshotNow();
    if (!previous || !now) return;
    if (previous.scheduleId !== now.scheduleId) {
      setUndoStack([]);
      setRedoStack([]);
      return;
    }
    setRedoStack((prev) => [now, ...prev].slice(0, 50));
    setUndoStack(undoStack.slice(1));
    restoreSnapshot(previous);
    triggerToast('Undone.');
  };

  const handleRedo = () => {
    const next = redoStack[0];
    const now = snapshotNow();
    if (!next || !now) return;
    if (next.scheduleId !== now.scheduleId) {
      setUndoStack([]);
      setRedoStack([]);
      return;
    }
    setUndoStack((prev) => [now, ...prev].slice(0, 50));
    setRedoStack(redoStack.slice(1));
    restoreSnapshot(next);
    triggerToast('Redone.');
  };

  // Ctrl/Cmd+Z undoes, Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z redoes (not while typing in a box).
  const undoRedoRef = useRef({ handleUndo, handleRedo });
  undoRedoRef.current = { handleUndo, handleRedo };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoRedoRef.current.handleUndo();
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault();
        undoRedoRef.current.handleRedo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // "Show in grid": open the roster tab on the right days, then the grid scrolls
  // to the cell, selects it and flashes it.
  const handleJumpToCell = (nurseId: string, date: string) => {
    setActiveTab('roster');
    if (!isAllDaysExpanded) {
      const targetBlockIdx = blocks.findIndex((b) => date >= b.startDate && date <= b.endDate);
      if (targetBlockIdx !== -1) setSelectedBlockIndex(targetBlockIdx);
    }
    setFocusRequest({ nurseId, date, nonce: Date.now() });
    // On a phone the panel covers the grid, so it closes to show the cell.
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 640px)').matches) setIsProblemsOpen(false);
  };

  // A handled "Show in grid" must not run again when the Roster tab is opened later.
  useEffect(() => {
    if (activeTab !== 'roster') setFocusRequest(undefined);
  }, [activeTab]);

  /** "Add" in Who could cover: a Nurse Clinic shift for a nurse free that day (a hand change). */
  const handleAddNurseClinicShift = (nurseId: string, date: string, dutyWindowId: string) => {
    if (!activeSchedule) return;
    const added: Assignment = {
      id: `asgn-man-${activeSchedule.id}-${nurseId}-${date}-${Date.now()}`,
      scheduleId: activeSchedule.id,
      nurseId,
      date,
      dutyWindowId,
      kind: 'CLINICAL_ROLE',
      clinicalRoleId: nurseClinicRoleOf(roles)?.id || 'role-nurse-clinic',
      locked: false,
      source: 'MANUAL',
    };
    applyEdit({ assignments: [...assignments, added] });
    triggerToast(`${nurseName(nurseId)} added to Nurse Clinic on ${formatDate(date)}.`);
  };

  const hasPublished = versions.some((v) => v.isPublished && v.scheduleId === activeSchedule?.id);

  // Cells that differ from the last published version (what "Send changes" would send).
  const lastPublished = versions
    .filter((v) => v.isPublished && v.scheduleId === activeSchedule?.id)
    .sort((a, b) => b.number - a.number)[0];
  const changedSincePublish = (() => {
    if (!lastPublished) return 0;
    const sig = (a: Assignment) =>
      `${a.dutyWindowId}|${a.kind}|${a.doctorId || ''}|${a.clinicalRoleId || ''}|${a.specialtyId || ''}`;
    const cells = (list: Assignment[]) => {
      const m = new Map<string, string>();
      for (const a of list) m.set(`${a.nurseId}|${a.date}`, sig(a));
      return m;
    };
    const before = cells(lastPublished.snapshot.assignments);
    const now = cells(assignments);
    let changed = 0;
    for (const [key, value] of now) if (before.get(key) !== value) changed++;
    for (const key of before.keys()) if (!now.has(key)) changed++;
    return changed;
  })();
  const openPublish = (mode: 'PUBLISH' | 'CHANGE') => {
    setPublishWizardMode(mode);
    setIsPublishModalOpen(true);
  };

  // The step bar: create, fill, fix problems, publish. The first step not done is the current one.
  const mustFix = validationReport.errorCount;
  const stepState = [
    !!activeSchedule,
    assignments.length > 0,
    assignments.length > 0 && mustFix === 0,
    activeSchedule?.status === 'PUBLISHED' && changedSincePublish === 0,
  ];
  const currentStep = stepState.findIndex((done) => !done);
  const steps: { label: string; done: boolean; current: boolean; onClick?: () => void }[] = [
    { label: 'Create', onClick: undefined },
    { label: assignments.length > 0 ? 'Filled' : 'Fill', onClick: () => handleOpenPreflight(assignments.length > 0 ? 'EMPTY_ONLY' : 'GENERATE_ALL') },
    {
      label: assignments.length === 0 ? 'Fix problems' : mustFix > 0 ? `Fix problems (${mustFix})` : 'No problems to fix',
      onClick: () => {
        setActiveTab('roster');
        setIsProblemsOpen(true);
      },
    },
    {
      label:
        hasPublished && changedSincePublish > 0
          ? `Send changes (${changedSincePublish})`
          : activeSchedule?.status === 'PUBLISHED'
          ? 'Published'
          : 'Publish',
      onClick: () => openPublish(hasPublished ? 'CHANGE' : 'PUBLISH'),
    },
  ].map((step, i) => ({ ...step, done: stepState[i], current: i === currentStep }));

  const nurseName = (id: string) => nurses.find((n) => n.id === id)?.fullName || 'Unknown nurse';

  // Block dates array for current block (or full month if all days expanded)
  const blockDates: string[] = [];
  if (activeSchedule) {
    const s = new Date(activeSchedule.startDate);
    const e = new Date(activeSchedule.endDate);
    const totalDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const startDay = isAllDaysExpanded ? 1 : (currentBlock ? currentBlock.startDay : 1);
    const endDay = isAllDaysExpanded ? totalDays : (currentBlock ? currentBlock.endDay : totalDays);
    for (let day = startDay; day <= endDay; day++) {
      const d = new Date(s);
      d.setUTCDate(s.getUTCDate() + (day - 1));
      blockDates.push(d.toISOString().split('T')[0]);
    }
  }

  return (
    <div
      className={`flex flex-col overflow-hidden bg-slate-50 select-none ${
        isExpandedView
          ? 'fixed inset-0 z-40 bg-slate-50 shadow-2xl animate-in fade-in duration-150'
          : 'h-full'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar: the roster, save status, and the few main actions (the rest under More) */}
      <div className="relative bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-[45]">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <button
            onClick={() => {
              repo.list('schedules').then((schedList) => {
                const unique = Array.from(new Map(schedList.map((s) => [s.id, s])).values());
                setSchedules(unique);
              });
              setIsSchedulePickerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-300 hover:border-indigo-400 hover:bg-slate-50 rounded text-slate-800 font-bold transition-colors cursor-pointer min-w-0"
            title="Open another roster, or create a new one"
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[160px] sm:max-w-[220px]">{activeSchedule ? activeSchedule.name : 'Choose a roster'}</span>
            <span className="text-[10px] text-slate-500 font-normal" aria-hidden="true">▾</span>
          </button>

          {activeSchedule && (
            <>
              <span className="text-slate-600 tabular-nums hidden md:inline">
                {formatDate(activeSchedule.startDate)} to {formatDate(activeSchedule.endDate)}
              </span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded font-semibold ${
                  activeSchedule.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
                title={`Saved copy number ${activeSchedule.activeVersionNumber || 1}`}
              >
                {activeSchedule.status === 'PUBLISHED' ? 'Published' : 'Draft'} · v{activeSchedule.activeVersionNumber || 1}
              </span>
              {(() => {
                const chip = getSchedulePeriodChip(activeSchedule);
                return (
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded inline-flex items-center gap-1 border bg-slate-50 text-slate-700 border-slate-200 hidden lg:inline-flex"
                    title={chip.tooltip}
                  >
                    <Clock className="w-3 h-3 text-indigo-600" aria-hidden="true" />
                    <span>{chip.label}</span>
                  </span>
                );
              })()}
            </>
          )}

          {/* Save status (changes save by themselves; this says whether they did) */}
          {loadError ? (
            <span role="alert" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1">
              <span>Could not load the roster ({loadError}). Changes will not be saved.</span>
              <button onClick={() => loadData()} className="underline cursor-pointer">
                Reload
              </button>
            </span>
          ) : saveError ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1 max-w-md" role="alert">
              <span className="truncate" title={saveError}>{saveError}</span>
              {hasUnsavedChanges() && (
                <button
                  onClick={() => {
                    quotaTracker.reset();
                    for (const [what, syncer] of [
                      ['Shifts', syncers.assignments],
                      ['Pinned days', syncers.locks],
                      ['Leave', syncers.leaveEntries],
                    ] as const) {
                      const retry = syncer.retry();
                      if (retry) void trackSave(retry, what);
                    }
                  }}
                  className="underline cursor-pointer shrink-0"
                >
                  Retry now
                </button>
              )}
            </span>
          ) : isSaving ? (
            <span className="text-[11px] text-slate-500" role="status">Saving…</span>
          ) : (
            lastAutosavedAt && (
              <span className="text-[11px] text-slate-500 inline-flex items-center gap-1" title={`Last saved at ${lastAutosavedAt}. Every change is saved as you make it.`}>
                <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                All changes saved
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={undoStack.length === 0}
            onClick={handleUndo}
            className="inline-flex items-center gap-1 px-2 py-1.5 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50 text-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Undo the last change (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            disabled={redoStack.length === 0}
            onClick={handleRedo}
            className="inline-flex items-center gap-1 px-2 py-1.5 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50 text-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Redo the change you undid (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Redo</span>
          </button>

          <MenuButton
            align="right"
            disabled={!activeSchedule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Fill the roster with shifts"
            label={
              <>
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Fill roster</span>
                <span aria-hidden="true">▾</span>
              </>
            }
            items={[
              {
                label: 'Fill the whole roster',
                hint: 'Pinned days, leave and your hand changes are kept',
                icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />,
                onSelect: () => handleOpenPreflight('GENERATE_ALL'),
              },
              {
                label: 'Fill empty cells only',
                hint: 'Every shift already on the roster stays',
                icon: <Plus className="w-3.5 h-3.5 text-indigo-600" />,
                onSelect: () => handleOpenPreflight('EMPTY_ONLY'),
              },
              {
                label: 'Clear filled shifts…',
                hint: 'Removes the shifts the app filled in',
                icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
                danger: true,
                separatorBefore: true,
                onSelect: () => handleOpenPreflight('CLEAR_GENERATED'),
              },
            ]}
          />

          <MenuButton
            align="right"
            disabled={!activeSchedule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Send the roster to the nurses"
            label={
              <>
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Publish</span>
                <span aria-hidden="true">▾</span>
              </>
            }
            items={[
              {
                label: 'Publish the roster',
                hint: 'Email every nurse their shifts',
                icon: <Send className="w-3.5 h-3.5 text-emerald-600" />,
                onSelect: () => openPublish('PUBLISH'),
              },
              {
                label: 'Send changes only',
                hint: hasPublished
                  ? changedSincePublish > 0
                    ? `${changedSincePublish} cell${changedSincePublish === 1 ? '' : 's'} changed since the last publish`
                    : 'Nothing has changed since the last publish'
                  : 'Publish the roster once first',
                icon: <History className="w-3.5 h-3.5 text-amber-600" />,
                disabled: !hasPublished,
                onSelect: () => openPublish('CHANGE'),
              },
            ]}
          />

          <MenuButton
            align="right"
            ariaLabel="More actions"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold cursor-pointer"
            title="More actions"
            label={
              <>
                <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">More</span>
              </>
            }
            items={[
              { label: 'New roster…', icon: <Plus className="w-3.5 h-3.5 text-indigo-600" />, onSelect: () => setIsNewModalOpen(true) },
              {
                label: 'Keep a copy…',
                hint: 'Changes save by themselves; this keeps a named copy to go back to',
                icon: <Save className="w-3.5 h-3.5 text-indigo-600" />,
                disabled: !activeSchedule,
                onSelect: () => setIsSaveModalOpen(true),
              },
              {
                label: 'Backup copies…',
                hint: 'Kept by themselves before each fill or clear',
                icon: <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />,
                disabled: !activeSchedule,
                onSelect: () => setIsBackupsOpen(true),
              },
              { label: 'Compare saved copies', icon: <Diff className="w-3.5 h-3.5 text-indigo-600" />, disabled: !activeSchedule, onSelect: () => setIsCompareModalOpen(true) },
              { label: 'Export or print…', icon: <Download className="w-3.5 h-3.5 text-indigo-600" />, disabled: !activeSchedule, onSelect: () => setIsExportModalOpen(true) },
              { label: 'Share links…', icon: <Share2 className="w-3.5 h-3.5 text-indigo-600" />, disabled: !activeSchedule, onSelect: () => setIsShareModalOpen(true) },
              {
                label: 'Fairness…',
                hint: 'Weekends, late shifts and holidays per nurse',
                icon: <Scale className="w-3.5 h-3.5 text-amber-700" />,
                separatorBefore: true,
                disabled: !activeSchedule,
                onSelect: () => setIsFairnessModalOpen(true),
              },
              {
                label: 'Templates and copy last roster…',
                icon: <Layers className="w-3.5 h-3.5 text-indigo-600" />,
                disabled: !activeSchedule,
                onSelect: () => setIsTemplateModalOpen(true),
              },
              { label: 'Swap two nurses’ shifts…', icon: <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />, disabled: !activeSchedule, onSelect: () => setIsSwapModalOpen(true) },
              {
                label: isExpandedView ? 'Leave full screen' : 'Full screen',
                hint: isExpandedView ? 'Or press Esc' : undefined,
                icon: isExpandedView ? <Minimize2 className="w-3.5 h-3.5 text-indigo-600" /> : <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />,
                separatorBefore: true,
                onSelect: () => setIsExpandedView(!isExpandedView),
              },
            ]}
          />
        </div>
      </div>

      {/* Steps: where this roster is, and the next thing to do */}
      {activeSchedule && (
        <nav aria-label="Roster steps" className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-1.5 shrink-0 overflow-x-auto">
          <ol className="flex items-center gap-1 text-[11px] whitespace-nowrap">
            {steps.map((step, i) => (
              <li key={step.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />}
                <button
                  type="button"
                  onClick={step.onClick}
                  disabled={!step.onClick}
                  aria-current={step.current ? 'step' : undefined}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-semibold transition-colors ${
                    step.onClick ? 'cursor-pointer hover:bg-white' : 'cursor-default'
                  } ${step.current ? 'bg-white text-indigo-800 ring-1 ring-indigo-300' : step.done ? 'text-emerald-800' : 'text-slate-600'}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      step.done ? 'bg-emerald-600 text-white' : step.current ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                    aria-hidden="true"
                  >
                    {step.done ? <Check className="w-2.5 h-2.5" /> : i + 1}
                  </span>
                  <span>{step.label}</span>
                  <span className="sr-only">{step.done ? '(done)' : ''}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {clinicSetupError && (
        <div role="alert" className="mx-4 mt-2 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {clinicSetupError} Filling the roster is blocked until they load.
        </div>
      )}

      {/* Main Viewport: Swappable Workbook Sheets */}
      <div className="flex-1 overflow-hidden relative flex">
        <div className="flex-1 min-w-0 overflow-hidden relative">
        {!activeSchedule && isFirstLoad && !loadError ? (
          <PageLoading label="Loading the roster…" />
        ) : !activeSchedule ? (
          <div className="h-full flex items-center justify-center p-8 text-center bg-slate-50">
            <div className="max-w-md bg-white border border-slate-200 rounded-lg p-8 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <CalendarRange className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No rosters yet</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Create a roster for the dates you need, then fill it with shifts.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setIsNewModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Create a roster</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'roster' && (
              <WorkbookGrid
                workingHoursPeriods={workingHoursPeriods}
                schedule={activeSchedule}
                assignments={assignments}
                nurses={nurses}
                doctors={doctors}
                sessions={sessions}
                locks={locks}
                leaveEntries={leaveEntries}
                leaveTypes={leaveTypes}
                dutyWindows={dutyWindows}
                seniorityLevels={seniorityLevels}
                roles={roles}
                specialties={specialties}
                holidays={holidays}
                validationReport={validationReport}
                currentBlockIndex={selectedBlockIndex}
                onBlockChange={(idx) => setSelectedBlockIndex(idx)}
                onAssignmentsChange={handleAssignmentsChange}
                onLocksChange={handleLocksChange}
                onLeaveEntriesChange={handleLeaveEntriesChange}
                onCellEdit={(edit) => applyEdit(edit)}
                rules={rules}
                focusRequest={focusRequest}
                onNavigateTab={(tab) => {
                  // The grid's problem links open the side panel instead of leaving the grid.
                  if (tab === 'warnings') setIsProblemsOpen(true);
                  else setActiveTab(tab);
                }}
                isAllDaysExpanded={isAllDaysExpanded}
                onToggleExpandDays={() => setIsAllDaysExpanded(!isAllDaysExpanded)}
                isExpandedView={isExpandedView}
                onToggleExpandView={() => setIsExpandedView(!isExpandedView)}
                onOpenLockOverrideModal={(lock) => {
                  setActiveLockToOverride(lock);
                  setIsOverrideModalOpen(true);
                }}
              />
            )}

            {activeTab === 'doctors' && (
              <DoctorsScheduleSheet
                doctors={doctors}
                sessions={sessions}
                specialties={specialties}
                blockDates={blockDates}
                schedule={activeSchedule}
                isAllDaysExpanded={isAllDaysExpanded}
                onToggleExpandDays={() => setIsAllDaysExpanded(!isAllDaysExpanded)}
                onDoctorsChange={(nextDocs) => setDoctors(nextDocs)}
                onSessionsChange={handleSessionsChange}
                assignments={assignments}
                nurses={nurses}
              />
            )}

            {activeTab === 'coverage' && (
              <CoverageSheet
                blockDates={blockDates}
                assignments={assignments}
                dutyWindows={dutyWindows}
                roles={roles}
                nurses={nurses}
                seniorityLevels={seniorityLevels}
                validationReport={validationReport}
              />
            )}

            {activeTab === 'warnings' && (
              <WarningsSheet
                validationReport={validationReport}
                onGoToCell={handleJumpToCell}
              />
            )}

            {activeTab === 'leave' && (
              <LeaveAndLocksSheet
                scheduleStartDate={activeSchedule.startDate}
                scheduleEndDate={activeSchedule.endDate}
                leaveEntries={leaveEntries}
                locks={locks}
                nurses={nurses}
                leaveTypes={leaveTypes}
                dutyWindows={dutyWindows}
                onGoToCell={handleJumpToCell}
              />
            )}

            {activeTab === 'hours' && (
              <HoursAccountingSheet
                schedule={activeSchedule}
                assignments={assignments}
                nurses={nurses}
                dutyWindows={dutyWindows}
                leaveEntries={leaveEntries}
                leaveTypes={leaveTypes}
                seniorityLevels={seniorityLevels}
                doctors={doctors}
                roles={roles}
                specialties={specialties}
                quotas={quotas}
                workingHoursPeriods={workingHoursPeriods}
              />
            )}

            {activeTab === 'legend' && (
              <div className="p-6 max-w-4xl mx-auto space-y-4 text-xs">
                <h2 className="text-base font-bold text-slate-800">
                  Key: shift and leave codes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded space-y-2">
                    <span className="font-semibold text-slate-700 block">Shifts</span>
                    {dutyWindows.map((dw) => (
                      <div key={dw.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white px-2 py-0.5 rounded font-mono" style={{ backgroundColor: dw.color }}>
                            {dw.acronym}
                          </span>
                          <span className="font-medium text-slate-800">{dw.name}</span>
                          {dw.isPriority ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              Filled first
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">
                              Standard
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-slate-500">{dw.startTime}–{dw.endTime}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded space-y-2">
                    <span className="font-semibold text-slate-700 block">Leave types (hours counted per day)</span>
                    {leaveTypes.map((lt) => (
                      <div key={lt.id} className="flex items-center justify-between">
                        <span className="font-bold text-white px-2 py-0.5 rounded font-mono" style={{ backgroundColor: lt.color }}>
                          {lt.acronym}
                        </span>
                        <span className="font-medium text-slate-800">{lt.name}</span>
                        <span className="font-mono text-slate-500">{typeof lt.creditedHours === 'number' ? `${lt.creditedHours} h` : '8 h'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        </div>
        {isProblemsOpen && activeSchedule && (
          <ProblemsPanel
            validationReport={validationReport}
            nurseName={nurseName}
            onShowInGrid={handleJumpToCell}
            onOpenFullList={() => {
              setIsProblemsOpen(false);
              setActiveTab('warnings');
            }}
            onClose={() => setIsProblemsOpen(false)}
            renderHelp={(f) =>
              f.date ? (
                <WhoCanCover
                  date={f.date}
                  hour={f.hour}
                  schedule={activeSchedule}
                  assignments={assignments}
                  nurses={nurses}
                  dutyWindows={dutyWindows}
                  leaveEntries={leaveEntries}
                  locks={locks}
                  roles={roles}
                  rules={rules}
                  seniorityLevels={seniorityLevels}
                  workingHoursPeriods={workingHoursPeriods}
                  leaveTypes={leaveTypes}
                  sessions={sessions}
                  doctors={doctors}
                  onPick={(nurseId, dutyWindowId) => handleAddNurseClinicShift(nurseId, f.date!, dutyWindowId)}
                />
              ) : null
            }
          />
        )}
      </div>

      {/* Sheet tabs along the bottom */}
      <div className="h-9 bg-slate-200 border-t border-slate-300 px-2 flex items-center gap-1 shrink-0 overflow-x-auto select-none">
        {[
          { id: 'roster', label: 'Roster' },
          { id: 'doctors', label: 'Doctors' },
          { id: 'coverage', label: 'Coverage by hour' },
          { id: 'warnings', label: `Problems (${validationReport.errorCount + validationReport.warnCount})` },
          { id: 'leave', label: 'Leave and pinned days' },
          { id: 'hours', label: 'Hours' },
          { id: 'legend', label: 'Key' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={`px-3 py-1 text-xs font-medium rounded-t transition-colors cursor-pointer border-t border-x ${
              activeTab === tab.id
                ? 'bg-white text-indigo-700 border-slate-300 shadow-xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-50 border-transparent hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- SAVE VERSION WITH NOTE MODAL --- */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            ref={saveDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={saveTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3 text-xs"
          >
            <h3 id={saveTitleId} className="font-bold text-slate-900 text-sm">Keep a copy</h3>
            <p className="text-[11px] text-slate-500">
              Your changes are already saved. This keeps a named copy of the roster as it is now (shifts, pinned days and leave), so you can look at it or compare with it later.
            </p>
            <input
              type="text"
              value={saveNote}
              onChange={(e) => setSaveNote(e.target.value)}
              aria-label="Name for this copy"
              placeholder="For example: before moving the Thursday sessions"
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
            />
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveVersion}
                disabled={isSavingVersion}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
              >
                {isSavingVersion ? 'Keeping…' : 'Keep copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BACKUP COPIES --- */}
      {isBackupsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            ref={backupsDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={backupsTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-4 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 id={backupsTitleId} className="font-bold text-slate-900 text-sm">Backup copies</h3>
              <button
                type="button"
                onClick={() => setIsBackupsOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[11px] text-slate-600">
              A copy is kept by itself each time the roster is filled or cleared. The last {BACKUPS_KEPT} are kept.
            </p>
            {backups.length === 0 ? (
              <p className="p-4 text-center text-slate-500 border border-dashed border-slate-300 rounded">No backup copies yet.</p>
            ) : (
              <ul className="space-y-1.5 max-h-80 overflow-y-auto">
                {backups.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-2 p-2 border border-slate-200 rounded">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{b.note}</p>
                      <p className="text-[11px] text-slate-500">
                        {new Date(b.timestamp).toLocaleString()} · {b.snapshot.assignments.length} shift{b.snapshot.assignments.length === 1 ? '' : 's'} · {b.author}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestoreBackup(b)}
                      className="shrink-0 px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-50 font-semibold text-indigo-700 cursor-pointer"
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* --- UNPIN A DAY --- */}
      {isOverrideModalOpen && activeLockToOverride && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            ref={overrideDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={overrideTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-xs animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 shrink-0 text-amber-600" aria-hidden="true" />
              <h3 id={overrideTitleId} className="text-sm font-bold text-slate-900">
                Unpin this day?
              </h3>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {nurseName(activeLockToOverride.nurseId)} on {formatDate(activeLockToOverride.date)} is pinned, so filling the
              roster never changes it. If you unpin it, the shift stays for now as a hand change, and you can then edit it.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOverrideModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
              >
                Keep pinned
              </button>
              <button
                type="button"
                onClick={handleExecuteLockOverride}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold cursor-pointer transition-colors shadow-xs"
              >
                Unpin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FILL ROSTER DIALOG --- */}
      {isPreflightModalOpen && preflightSummary && (() => {
        const isClear = activeGenerationMode === 'CLEAR_GENERATED';
        const filledCount = assignments.filter((a) => a.source === 'GENERATED').length;
        const manualCount = assignments.filter((a) => a.source === 'MANUAL').length;
        const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
        const title = isClear
          ? 'Clear filled shifts'
          : activeGenerationMode === 'EMPTY_ONLY'
          ? 'Fill empty cells only'
          : 'Fill the whole roster';
        const kept = [
          plural(preflightSummary.existingLocksCount, 'pinned day'),
          plural(preflightSummary.existingLeaveDaysCount, 'leave day'),
        ];
        if (activeGenerationMode === 'GENERATE_ALL' && keepManualOnGenerate && manualCount > 0) kept.push(plural(manualCount, 'hand change'));
        const nurseClinicChoice = !preflightSummary.nurseClinicRuleEnabled
          ? 'OFF'
          : preflightSummary.nurseClinicRuleSeverity === 'HARD'
          ? 'HARD'
          : 'SOFT';
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div
            ref={preflightDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={preflightTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col text-xs animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                {isClear ? (
                  <Trash2 className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                )}
                <h3 id={preflightTitleId} className="text-sm font-bold text-slate-900 truncate">
                  {title}: {preflightSummary.scheduleName}
                </h3>
              </div>
              {!isGenerating && (
                <button
                  onClick={() => setIsPreflightModalOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                  aria-label="Close"
                  title="Close"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {isClear ? (
                <>
                  <p className="text-slate-800 leading-relaxed text-[13px]">
                    This removes the {plural(filledCount, 'shift')} the app filled in.{' '}
                    {clearIncludeManual
                      ? `Your ${plural(manualCount, 'hand change')} are removed too.`
                      : manualCount > 0
                      ? `Your ${plural(manualCount, 'hand change')} stay.`
                      : ''}{' '}
                    Pinned days and leave always stay. You can undo this.
                  </p>
                  {manualCount > 0 && (
                    <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded cursor-pointer text-slate-800 font-medium">
                      <input
                        type="checkbox"
                        checked={clearIncludeManual}
                        onChange={(e) => setClearIncludeManual(e.target.checked)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                      <span>Also remove the {plural(manualCount, 'shift')} I changed by hand</span>
                    </label>
                  )}
                </>
              ) : (
                <>
                  <p className="text-slate-800 leading-relaxed text-[13px]">
                    <strong>Kept:</strong> {kept.join(', ')}
                    {activeGenerationMode === 'EMPTY_ONLY' ? `, and every shift already on the roster (${assignments.length})` : ''}.{' '}
                    {activeGenerationMode === 'GENERATE_ALL' && (
                      <>
                        <strong>Replaced:</strong>{' '}
                        {plural(filledCount + (keepManualOnGenerate ? 0 : manualCount), 'shift')}
                        {keepManualOnGenerate || manualCount === 0 ? ' the app filled in before' : ', including your hand changes'}.
                      </>
                    )}
                  </p>
                  {activeGenerationMode === 'GENERATE_ALL' && manualCount > 0 && (
                    <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded cursor-pointer text-slate-800 font-medium">
                      <input
                        type="checkbox"
                        checked={keepManualOnGenerate}
                        onChange={(e) => setKeepManualOnGenerate(e.target.checked)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                      <span>Keep the {plural(manualCount, 'shift')} I changed by hand</span>
                    </label>
                  )}
                  <fieldset className="p-2 bg-slate-50 border border-slate-200 rounded space-y-2" disabled={isGenerating}>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
                      <input
                        type="checkbox"
                        checked={fillRange.enabled}
                        onChange={(e) => setFillRange((r) => ({ ...r, enabled: e.target.checked }))}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                      <span>Only fill some dates</span>
                    </label>
                    {fillRange.enabled && (
                      <div className="flex flex-wrap items-center gap-2 pl-6">
                        <label className="flex items-center gap-1.5">
                          <span className="text-slate-600">From</span>
                          <input
                            type="date"
                            value={fillRange.start}
                            min={preflightSummary.startDate}
                            max={preflightSummary.endDate}
                            onChange={(e) => setFillRange((r) => ({ ...r, start: e.target.value }))}
                            className="px-2 py-1 border border-slate-300 rounded bg-white"
                          />
                        </label>
                        <label className="flex items-center gap-1.5">
                          <span className="text-slate-600">to</span>
                          <input
                            type="date"
                            value={fillRange.end}
                            min={fillRange.start || preflightSummary.startDate}
                            max={preflightSummary.endDate}
                            onChange={(e) => setFillRange((r) => ({ ...r, end: e.target.value }))}
                            className="px-2 py-1 border border-slate-300 rounded bg-white"
                          />
                        </label>
                        <span className="text-[11px] text-slate-500 basis-full">Every shift outside these dates stays as it is.</span>
                      </div>
                    )}
                  </fieldset>

                  <p className="text-slate-600 leading-relaxed">
                    {plural(preflightSummary.activeNursesCount, 'nurse')} ({preflightSummary.bloodCollectionNursesCount} can take blood) and{' '}
                    {plural(preflightSummary.doctorSessionsCount, 'doctor session')} over {plural(preflightSummary.totalDays, 'day')}. Doctors get
                    their nurses first, then Nurse Clinic and the other jobs are filled.
                    {preflightSummary.targetWorkingHoursFullTime
                      ? ` A full time nurse aims for ${preflightSummary.targetWorkingHoursFullTime} h${
                          preflightSummary.detectedPeriodName ? ` (${preflightSummary.detectedPeriodName})` : ''
                        }.`
                      : ''}
                  </p>

                  <fieldset className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2" disabled={isGenerating}>
                    <legend className="font-semibold text-slate-900 px-1">A free nurse for Nurse Clinic every opening hour</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      {(
                        [
                          { id: 'HARD', label: 'Never broken', hint: 'Filled before the doctors’ second nurses', run: () => handleUpdateNurseClinicRule('HARD', true) },
                          { id: 'SOFT', label: 'When possible', hint: 'Doctors first, then Nurse Clinic', run: () => handleUpdateNurseClinicRule('SOFT', true) },
                          { id: 'OFF', label: 'Off', hint: 'No Nurse Clinic shifts', run: () => handleUpdateNurseClinicRule('SOFT', false) },
                        ] as const
                      ).map((opt) => (
                        <label
                          key={opt.id}
                          className={`p-2 rounded border cursor-pointer ${
                            nurseClinicChoice === opt.id ? 'bg-white border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                            <input
                              type="radio"
                              name="nurse-clinic-rule"
                              checked={nurseClinicChoice === opt.id}
                              onChange={opt.run}
                            />
                            {opt.label}
                          </span>
                          <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight">{opt.hint}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {preflightSummary.eveningCoverageAlert && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{preflightSummary.eveningCoverageAlert}</span>
                    </div>
                  )}
                  {preflightSummary.staffingScaleWarning && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{preflightSummary.staffingScaleWarning}</span>
                    </div>
                  )}
                </>
              )}

              {isGenerating && generationProgress && (
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded" role="status">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-700 font-semibold">{generationProgress.statusText}</span>
                    <span className="text-indigo-600 font-bold">{generationProgress.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-100" style={{ width: `${generationProgress.percent}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 flex items-center justify-end gap-2 border-t border-slate-100 shrink-0">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setIsPreflightModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGenerating || (!isClear && fillRange.enabled && (!fillRange.start || !fillRange.end || fillRange.start > fillRange.end))}
                onClick={handleExecuteGeneration}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 ${
                  isClear ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white rounded font-semibold cursor-pointer shadow-xs disabled:opacity-50 transition-colors`}
              >
                {isClear ? <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> : <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>
                  {isGenerating
                    ? isClear
                      ? 'Clearing…'
                      : 'Filling…'
                    : isClear
                    ? 'Clear shifts'
                    : activeGenerationMode === 'EMPTY_ONLY'
                    ? 'Fill empty cells'
                    : 'Fill roster'}
                </span>
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* --- VERSION COMPARE & DIFF MODAL (Phase 10) --- */}
      {activeSchedule && (
        <VersionCompareModal
          schedule={activeSchedule}
          versions={versions}
          activeAssignments={assignments}
          nurses={nurses}
          dutyWindows={dutyWindows}
          doctors={doctors}
          roles={roles}
          specialties={specialties}
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}

      {/* --- EXPORT & PRINT CENTER MODAL (Phase 11) --- */}
      {activeSchedule && (
        <ExportModal
          workingHoursPeriods={workingHoursPeriods}
          clinicName={context.clinicName}
          schedule={activeSchedule}
          assignments={assignments}
          nurses={nurses}
          dutyWindows={dutyWindows}
          leaveEntries={leaveEntries}
          leaveTypes={leaveTypes}
          seniorityLevels={seniorityLevels}
          doctors={doctors}
          sessions={sessions}
          roles={roles}
          specialties={specialties}
          rules={rules}
          currentBlockIndex={selectedBlockIndex}
          blockDates={blockDates}
          versionNumber={activeSchedule.activeVersionNumber || 1}
          holidayDates={holidays.map((h) => h.date)}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* --- SHARE & INVITE MODAL (Phase 12) --- */}
      {activeSchedule && (
        <ShareModal
          schedule={activeSchedule}
          latestPublishedVersion={versions.find((v) => v.isPublished) || null}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onOpenPreview={(token) => onOpenSharePreview?.(token)}
        />
      )}

      {/* --- PUBLISH WIZARD MODAL (Phase 13) --- */}
      {activeSchedule && (
        <PublishModal
          context={context}
          schedule={activeSchedule}
          assignments={assignments}
          nurses={nurses}
          dutyWindows={dutyWindows}
          doctors={doctors}
          sessions={sessions}
          roles={roles}
          specialties={specialties}
          seniorityLevels={seniorityLevels}
          rules={rules}
          leaveEntries={leaveEntries}
          leaveTypes={leaveTypes}
          versions={versions}
          workingHoursPeriods={workingHoursPeriods}
          locks={locks}
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          onPublishComplete={() => {
            loadData();
            setToastMessage('Roster published.');
            setTimeout(() => setToastMessage(null), 3000);
          }}
          initialMode={publishWizardMode}
          onShowProblems={() => {
            setActiveTab('roster');
            setIsProblemsOpen(true);
          }}
        />
      )}

      {/* --- SCHEDULE PICKER --- */}
      {isSchedulePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
          <div
            ref={pickerDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={pickerTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <h3 id={pickerTitleId} className="text-sm font-bold text-slate-900">Open a roster</h3>
              </div>
              <button
                onClick={() => setIsSchedulePickerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* My Schedules Section */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 text-xs block">Rosters</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {[...schedules].sort((a, b) => b.startDate.localeCompare(a.startDate)).map((s) => {
                  const isActive = s.id === activeSchedule?.id;
                  const pickSchedule = () => {
                    setIsSchedulePickerOpen(false);
                    if (s.id !== activeSchedule?.id) {
                      openSchedule(s).catch((err) => notify(`Could not open "${s.name}": ${err?.message || err}`, 'error'));
                    }
                  };
                  return (
                    // Not a <button>: it holds the delete button
                    <div
                      key={s.id}
                      onClick={pickSchedule}
                      role="button"
                      tabIndex={0}
                      aria-current={isActive ? 'true' : undefined}
                      onKeyDown={(e) => {
                        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          pickSchedule();
                        }
                      }}
                      className={`p-3 rounded border cursor-pointer transition-colors flex items-center justify-between ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{s.name}</span>
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]">
                              Open now
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                            {s.status === 'PUBLISHED' ? 'Published' : 'Draft'} · v{s.activeVersionNumber || 1}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {formatDate(s.startDate)} to {formatDate(s.endDate)} · full time goal {s.hoursTargetFullTime} h
                        </p>
                        {(() => {
                          const chip = getSchedulePeriodChip(s);
                          return (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                                  chip.isExact
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }`}
                                title={chip.tooltip}
                              >
                                {chip.label}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setScheduleToDelete(s);
                            setIsDeleteScheduleModalOpen(true);
                          }}
                          className="p-1.5 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title={`Delete roster "${s.name}"`}
                          aria-label={`Delete roster "${s.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsSchedulePickerOpen(false);
                  setIsNewModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>New roster</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSchedulePickerOpen(false)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FAIRNESS & PARITY MODAL (Phase 14.1) --- */}
      {isFairnessModalOpen && activeSchedule && (
        <FairnessModal
          schedule={activeSchedule}
          assignments={assignments}
          nurses={nurses}
          dutyWindows={dutyWindows}
          holidays={holidays}
          seniorityLevels={seniorityLevels}
          leaveEntries={leaveEntries}
          locks={locks}
          roles={roles}
          rules={rules}
          leaveTypes={leaveTypes}
          workingHoursPeriods={workingHoursPeriods}
          isOpen={isFairnessModalOpen}
          onClose={() => setIsFairnessModalOpen(false)}
          onApplyAssignments={(updated, note) => {
            handleAssignmentsChange(updated);
            setToastMessage(note);
          }}
        />
      )}

      {/* --- ROSTER TEMPLATES & COPY PERIOD MODAL (Phase 14.2) --- */}
      {isTemplateModalOpen && activeSchedule && (
        <TemplateModal
          schedule={activeSchedule}
          assignments={assignments}
          nurses={nurses}
          dutyWindows={dutyWindows}
          leaveEntries={leaveEntries}
          locks={locks}
          allSchedules={schedules}
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onApplyAssignments={(updated, note) => {
            handleAssignmentsChange(updated);
            setToastMessage(note);
          }}
        />
      )}

      {/* --- SHIFT SWAP MANAGER MODAL (Phase 14.3) --- */}
      {isSwapModalOpen && activeSchedule && (
        <SwapManagerModal
          schedule={activeSchedule}
          assignments={assignments}
          nurses={nurses}
          dutyWindows={dutyWindows}
          seniorityLevels={seniorityLevels}
          roles={roles}
          doctors={doctors}
          specialties={specialties}
          leaveEntries={leaveEntries}
          locks={locks}
          rules={rules}
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          onApplySwap={(updated, note) => {
            handleAssignmentsChange(updated);
            setToastMessage(note);
          }}
        />
      )}

      {/* --- CREATE SCHEDULE MODAL --- */}
      {isNewModalOpen && (
        <CreateScheduleModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onScheduleCreated={handleScheduleCreated}
          clinicName={context.clinicName}
          existingSchedules={schedules}
          onOpenExisting={(s) => {
            setIsNewModalOpen(false);
            if (s.id !== activeSchedule?.id) {
              openSchedule(s).catch((err) => notify(`Could not open "${s.name}": ${err?.message || err}`, 'error'));
            }
          }}
        />
      )}

      {/* --- DELETE SCHEDULE VERIFICATION MODAL --- */}
      <DeleteScheduleModal
        isOpen={isDeleteScheduleModalOpen}
        schedule={scheduleToDelete}
        shiftCount={deleteCounts?.shifts ?? 0}
        versionCount={deleteCounts?.versions ?? 0}
        onClose={() => {
          setIsDeleteScheduleModalOpen(false);
          setScheduleToDelete(null);
        }}
        onConfirmDelete={handleConfirmDeleteSchedule}
      />
    </div>
  );
};
