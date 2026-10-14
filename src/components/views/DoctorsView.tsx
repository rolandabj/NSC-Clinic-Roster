import React, { useState, useEffect, useId, useRef } from 'react';
import { useDialogA11y } from '../common/useDialogA11y';
import { notify, confirmDialog, type NoticeTone } from '../common/dialogs';
import {
  Stethoscope,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  AlertCircle,
  RotateCcw,
  Save,
  X,
  CalendarRange,
  ChevronRight,
  Filter,
  Check,
  Ban,
  RefreshCw,
  Upload,
  Search,
  Loader2,
} from 'lucide-react';
import { ClinicContextState } from '../../types/navigation';
import { getRepository } from '../../services/repository';
import {
  Doctor,
  Specialty,
  WeeklyPatternSlot,
  DoctorSession,
  IsoDateString,
  SeniorityLevel,
  ClinicalRole,
  Schedule,
  PublicHoliday,
} from '../../types';
import { BulkImportModal } from '../modals/BulkImportModal';
import { DoctorWeekChangeDialog, WeekChangePreview } from '../modals/DoctorWeekChangeDialog';
import {
  doctorFromDate,
  planPatternSessions,
  populateRecurringDoctorSessionsForSchedule,
  saveDoctorSessions,
  weekChanged,
} from '../../services/schedule/doctorScheduleService';
import { formatDate, formatDayDate, localTodayIso } from '../../utils/dateUtils';
import { defaultPatternRange, defaultSessionDate } from '../../utils/dateDefaults';
import { checkDoctorForm, doctorCounts, filterDoctors, usualWeekLines, WEEKDAY_NAMES, type DoctorFilters } from '../../services/doctors/doctorForm';
import { Badge, Button, Checkbox, DataTable, Dialog, EmptyState, Field, IconButton, Input, Notice, PageHeader, Select, Textarea, cx, type Column } from '../ui';

interface DoctorsViewProps {
  context: ClinicContextState;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({ context }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [sessions, setSessions] = useState<DoctorSession[]>([]);
  const [seniorityLevels, setSeniorityLevels] = useState<SeniorityLevel[]>([]);
  const [clinicalRoles, setClinicalRoles] = useState<ClinicalRole[]>([]);
  // Rosters and public holidays: a week change reaches the days already set up (see weekChange).
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  /** A saved doctor whose week changed while rosters are set up: asks "from which date?". */
  const [weekChange, setWeekChange] = useState<{ before?: Doctor; after: Doctor } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<DoctorFilters['status']>('ALL');

  // Active Doctor Detail / Calendar
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // Doctor Form Modal
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<{
    id?: string;
    fullName: string;
    gmail: string;
    specialtyIds: string[];
    weeklyPattern: WeeklyPatternSlot[];
    notes: string;
    active: boolean;
  }>({
    fullName: '',
    gmail: '',
    specialtyIds: [],
    weeklyPattern: [],
    notes: '',
    active: true,
  });

  // Doctor Form Modal States
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newSpecialtyName, setNewSpecialtyName] = useState('');
  const [isAddingSpecialty, setIsAddingSpecialty] = useState(false);
  // Each field is checked as it is filled in: its message shows once the field has been
  // left, or for every field after Save was pressed (Phase 6, slice 3).
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [triedSave, setTriedSave] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const detailHeadingRef = useRef<HTMLHeadingElement>(null);

  // Expand Pattern Modal
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [expandRange, setExpandRange] = useState<{
    startDate: string;
    endDate: string;
    targetDoctorId: string;
  }>({
    // Replaced by the open roster's dates each time the dialog opens (defaultPatternRange).
    startDate: localTodayIso(),
    endDate: localTodayIso(),
    targetDoctorId: 'ALL',
  });

  // Ad-hoc Session Modal
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Partial<DoctorSession> | null>(null);


  // Dialog keyboard and screen reader support
  const expandTitleId = useId();
  const sessionTitleId = useId();
  const expandDialogRef = useDialogA11y<HTMLDivElement>(isExpandModalOpen, () => setIsExpandModalOpen(false));
  const sessionDialogRef = useDialogA11y<HTMLDivElement>(isSessionModalOpen && !!editingSession, () => setIsSessionModalOpen(false));

  const repo = getRepository();

  const loadData = async () => {
    try {
      const [dList, spList, sessList, slList, crList, schedList, holList] = await Promise.all([
        repo.list('doctors'),
        repo.list('specialties'),
        repo.list('doctorSessions'),
        repo.list('seniorityLevels'),
        repo.list('clinicalRoles'),
        repo.list('schedules'),
        repo.list('holidays'),
      ]);
      setDoctors(dList);
      setSpecialties(spList);
      setSessions(sessList);
      setSeniorityLevels(slList);
      setClinicalRoles(crList);
      setSchedules(schedList);
      setHolidays(holList);

      if (dList.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(dList[0].id);
      }
    } catch (err) {
      console.error('Error loading doctors data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerNotification = (msg: string, tone: NoticeTone = 'success') => notify(msg, tone);

  const handleQuickAddSpecialty = async (name: string, code?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const generatedCode = code || trimmed.slice(0, 4).toUpperCase();
      const created = await repo.create('specialties', {
        name: trimmed,
        code: generatedCode,
      });
      setSpecialties((prev) => [...prev, created]);
      setFormData((prev) => ({
        ...prev,
        specialtyIds: Array.from(new Set([...prev.specialtyIds, created.id])),
      }));
      setNewSpecialtyName('');
      setIsAddingSpecialty(false);
      setInlineError(null);
      triggerNotification(`Specialty "${trimmed}" added.`);
    } catch (err: any) {
      setInlineError(`Failed to add specialty: ${err.message}`);
    }
  };

  // Doctor Add / Edit Handlers
  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setInlineError(null);
    setNewSpecialtyName('');
    setIsAddingSpecialty(false);
    setTouched(new Set());
    setTriedSave(false);
    setFormData({
      fullName: '',
      gmail: '',
      specialtyIds: specialties.length > 0 ? [specialties[0].id] : [],
      weeklyPattern: [
        { weekday: 0, startTime: '09:00', endTime: '13:00', room: '' },
      ],
      notes: '',
      active: true,
    });
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc);
    setInlineError(null);
    setNewSpecialtyName('');
    setIsAddingSpecialty(false);
    setTouched(new Set());
    setTriedSave(false);
    setFormData({
      id: doc.id,
      fullName: doc.fullName,
      gmail: doc.gmail || '',
      specialtyIds: doc.specialtyIds || [],
      weeklyPattern: doc.weeklyPattern || [],
      notes: doc.notes || '',
      active: doc.active,
    });
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (Object.keys(allErrors).length) {
      setTriedSave(true);
      // The first field to fix gets the focus, so its message is read out.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    const trimmedName = formData.fullName.trim();
    let finalSpecialtyIds = [...formData.specialtyIds];

    if (finalSpecialtyIds.length === 0) {
      // No specialties in the clinic at all: General Practice is added
      try {
        const defaultSpec = await repo.create('specialties', {
          name: 'General Practice',
          code: 'GP',
        });
        setSpecialties((prev) => [...prev, defaultSpec]);
        finalSpecialtyIds = [defaultSpec.id];
      } catch (specErr: any) {
        setInlineError(`Failed to create default specialty: ${specErr.message}`);
        return;
      }
    }

    const before = formData.id ? doctors.find((d) => d.id === formData.id) : undefined;
    const after: Doctor = {
      ...(before || {}),
      id: formData.id || '',
      fullName: trimmedName,
      gmail: formData.gmail.trim() || '',
      specialtyIds: finalSpecialtyIds,
      weeklyPattern: formData.weeklyPattern,
      notes: formData.notes.trim() || '',
      active: formData.active,
    };
    await commitDoctor(before, after);
  };

  // Saves a doctor. A changed week (or a doctor added, or switched on or off) while days are
  // already set up asks from which date they follow it; otherwise it starts today.
  const commitDoctor = async (before: Doctor | undefined, after: Doctor) => {
    if (weekChanged(before, after)) {
      if (planWeek(before, after, today).changedDays.length > 0) {
        setWeekChange({ before, after });
        return;
      }
      try {
        await saveDoctorWeek(before, after, today);
      } catch (err: any) {
        setInlineError(`The doctor could not be saved: ${err?.message || 'check the connection and try again.'}`);
      }
      return;
    }

    setIsSaving(true);
    const fields = {
      fullName: after.fullName,
      gmail: after.gmail || '',
      specialtyIds: after.specialtyIds,
      weeklyPattern: after.weeklyPattern,
      notes: after.notes || '',
      active: after.active,
    };
    try {
      if (before) {
        await repo.update('doctors', before.id, fields);
        triggerNotification(`${after.fullName} updated.`);
      } else {
        const created = await repo.create('doctors', fields);
        triggerNotification(`${after.fullName} added.`);
        setSelectedDoctorId(created.id);
      }
      setIsDoctorModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error('[DoctorsView] Error saving doctor:', err);
      setInlineError(`The doctor could not be saved: ${err.message || 'check the connection and try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Leaving the clinic: inactive keeps the doctor's history; their clinics stop from a date
  // chosen in the week change question when days are already set up.
  const handleMakeInactive = async (doc: Doctor) => {
    await commitDoctor(doc, { ...doc, active: false });
  };

  // --- A doctor's week changed: the days already set up follow it from a chosen date ---
  const today = localTodayIso();
  const setUpRanges = (from: string) =>
    schedules.filter((s) => s.status !== 'ARCHIVED' && s.endDate >= from).map((s) => ({ startDate: s.startDate, endDate: s.endDate }));
  const planWeek = (before: Doctor | undefined, after: Doctor, from: string, sessionList = sessions) =>
    planPatternSessions({
      doctor: doctorFromDate(before, { ...after, id: after.id || '__new__' }, from),
      sessions: sessionList,
      from,
      setUpRanges: setUpRanges(from),
      holidayDates: holidays.map((h) => h.date),
    });
  const describeWeek = (d?: Pick<Doctor, 'weeklyPattern' | 'active'>): string => {
    if (!d) return 'not in the clinic yet';
    if (d.active === false) return 'switched off (no clinics)';
    const slots = [...(d.weeklyPattern || [])].sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime));
    return slots.length === 0 ? 'no clinics' : slots.map((p) => `${WEEKDAY_NAMES[p.weekday]}s ${p.startTime} to ${p.endTime}`).join(', ');
  };
  const weekPreview = (before: Doctor | undefined, after: Doctor, from: string): WeekChangePreview => {
    const plan = planWeek(before, after, from);
    const rosterNames = schedules
      .filter((s) => s.status !== 'ARCHIVED' && plan.changedDays.some((d) => d >= s.startDate && d <= s.endDate))
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((s) => s.name);
    return { changedDays: plan.changedDays.length, handChangedDays: plan.handChangedDays.length, rosterNames };
  };
  /** Saves the doctor with the week starting on `from`, then puts the days already set up on it. */
  const saveDoctorWeek = async (before: Doctor | undefined, after: Doctor, from: string) => {
    setIsSaving(true);
    try {
      const withDate = doctorFromDate(before, after, from);
      const { id, ...fields } = withDate;
      const saved = before ? await repo.update('doctors', before.id, fields) : await repo.create('doctors', fields as Omit<Doctor, 'id'>);
      const doctor = { ...withDate, id: saved.id };
      const plan = planPatternSessions({
        doctor,
        sessions: await repo.list('doctorSessions'),
        from,
        setUpRanges: setUpRanges(from),
        holidayDates: holidays.map((h) => h.date),
      });
      await saveDoctorSessions(repo, plan.upsert, plan.remove.map((x) => x.id));
      triggerNotification(
        `${before ? `${after.fullName} updated` : `${after.fullName} added`}` +
          (plan.changedDays.length > 0 ? `: ${plan.changedDays.length} day${plan.changedDays.length === 1 ? '' : 's'} already set up follow the new week from ${formatDate(from)}.` : '.')
      );
      if (!before) setSelectedDoctorId(saved.id);
      setWeekChange(null);
      setIsDoctorModalOpen(false);
      await loadData();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDoctor = async (id: string, name: string, active: boolean) => {
    const ok = await confirmDialog({
      title: `Remove ${name} for good?`,
      message: active
        ? `This deletes ${name} and all their clinics, past and coming. It cannot be undone. If they are leaving the clinic, make them inactive instead: their history stays and their clinics stop from a date you choose.`
        : `This deletes ${name} and all their clinics, past and coming. It cannot be undone.`,
      confirmLabel: 'Remove for good',
      danger: true,
    });
    if (ok) {
      setIsDoctorModalOpen(false);
      await repo.remove('doctors', id);
      // Remove associated sessions
      const docSessions = await repo.list('doctorSessions', {
        field: 'doctorId',
        operator: '==',
        value: id,
      });
      for (const s of docSessions) {
        await repo.remove('doctorSessions', s.id);
      }
      triggerNotification(`${name} removed.`);
      setSelectedDoctorId(null);
      loadData();
    }
  };

  // Weekly Pattern Row Handlers
  const handleAddPatternRow = () => {
    setFormData({
      ...formData,
      weeklyPattern: [
        ...formData.weeklyPattern,
        { weekday: 1, startTime: '09:00', endTime: '13:00', room: '' },
      ],
    });
  };

  const handleRemovePatternRow = (idx: number) => {
    setFormData({
      ...formData,
      weeklyPattern: formData.weeklyPattern.filter((_, i) => i !== idx),
    });
  };

  const handlePatternChange = (
    idx: number,
    field: keyof WeeklyPatternSlot,
    value: any
  ) => {
    const list = [...formData.weeklyPattern];
    list[idx] = { ...list[idx], [field]: value };
    setFormData({ ...formData, weeklyPattern: list });
  };

  // Expand Pattern to Sessions for a date range
  const handleExpandPatternToSessions = async () => {
    try {
      const targetDocs =
        expandRange.targetDoctorId === 'ALL'
          ? doctors
          : doctors.filter((d) => d.id === expandRange.targetDoctorId);

      if (expandRange.startDate > expandRange.endDate) {
        notify('Start date must be before or equal to end date.', 'warning');
        return;
      }

      const result = await populateRecurringDoctorSessionsForSchedule({
        repo,
        startDate: expandRange.startDate,
        endDate: expandRange.endDate,
        doctors: targetDocs,
        overwriteExisting: true,
      });

      triggerNotification(
        `Usual weeks put on dates: ${result.createdCount} ${result.createdCount === 1 ? 'clinic' : 'clinics'} from ${formatDate(expandRange.startDate)} to ${formatDate(expandRange.endDate)}.`
      );
      setIsExpandModalOpen(false);
      loadData();
    } catch (err: any) {
      notify(`Error expanding sessions: ${err.message}`, 'error');
    }
  };

  // Toggle Session Cancel / Override
  const handleToggleCancelSession = async (sess: DoctorSession) => {
    const nextCancelled = !sess.cancelled;
    await repo.update('doctorSessions', sess.id, { cancelled: nextCancelled });
    triggerNotification(
      nextCancelled
        ? `The clinic of ${doctors.find((d) => d.id === sess.doctorId)?.fullName || 'the doctor'} on ${formatDayDate(sess.date)} cancelled.`
        : `The clinic on ${formatDayDate(sess.date)} restored.`
    );
    loadData();
  };

  // Save Ad-hoc Session Override
  const handleSaveAdHocSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !editingSession.doctorId || !editingSession.date) return;

    try {
      if (editingSession.id) {
        await repo.update('doctorSessions', editingSession.id, {
          startTime: editingSession.startTime,
          endTime: editingSession.endTime,
          room: editingSession.room,
          cancelled: editingSession.cancelled,
          source: 'MANUAL',
        });
        triggerNotification(`The clinic of ${formatDayDate(editingSession.date || '')} updated.`);
      } else {
        await repo.create('doctorSessions', {
          doctorId: editingSession.doctorId,
          date: editingSession.date,
          startTime: editingSession.startTime || '09:00',
          endTime: editingSession.endTime || '13:00',
          specialtyId: editingSession.specialtyId || specialties[0]?.id || '',
          room: editingSession.room || '',
          source: 'MANUAL',
          cancelled: false,
        });
        triggerNotification(`Clinic added on ${formatDayDate(editingSession.date || '')}.`);
      }
      setIsSessionModalOpen(false);
      setEditingSession(null);
      loadData();
    } catch (err: any) {
      notify(`Failed to save session: ${err.message}`, 'error');
    }
  };

  const allErrors = checkDoctorForm(formData, doctors, formData.id, specialties.length > 0);
  const errorFor = (field: string) => (triedSave || touched.has(field) ? allErrors[field] : undefined);
  const leave = (field: string) => () => setTouched((t) => (t.has(field) ? t : new Set(t).add(field)));

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedDoctorSessions = sessions
    .filter((s) => s.doctorId === selectedDoctorId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const counts = doctorCounts(doctors);
  const filteredDoctors = filterDoctors(doctors, { query: searchQuery, specialtyId: selectedSpecialtyFilter, status: statusFilter });
  const filtersOn = searchQuery.trim() !== '' || selectedSpecialtyFilter !== 'ALL' || statusFilter !== 'ALL';
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialtyFilter('ALL');
    setStatusFilter('ALL');
  };
  const showClinics = (id: string) => {
    setSelectedDoctorId(id);
    // On a narrow screen the clinics are under the list: move there.
    requestAnimationFrame(() => detailHeadingRef.current?.focus());
  };
  const openExpand = () => {
    setExpandRange((r) => ({ ...r, ...defaultPatternRange(schedules, context.activeScheduleId ?? undefined, localTodayIso()) }));
    setIsExpandModalOpen(true);
  };

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      header: 'Doctor',
      sortValue: (d) => d.fullName,
      cell: (d) => (
        <span className="block">
          <span className="block">{d.fullName}</span>
          {d.notes && <span className="block max-w-56 truncate text-xs font-normal text-ink-muted">{d.notes}</span>}
        </span>
      ),
    },
    {
      key: 'specialties',
      header: 'Specialties',
      sortValue: (d) => specialties.filter((s) => d.specialtyIds?.includes(s.id)).map((s) => s.name).join(', '),
      cell: (d) => {
        const list = specialties.filter((s) => d.specialtyIds?.includes(s.id));
        return list.length ? list.map((s) => s.name).join(', ') : <span className="text-ink-muted">None</span>;
      },
    },
    {
      key: 'week',
      header: 'Usual week',
      cell: (d) => {
        const lines = usualWeekLines(d.weeklyPattern);
        if (lines.length === 0) return <span className="text-ink-muted">No clinics</span>;
        return (
          <span className="block whitespace-nowrap">
            {lines.slice(0, 2).map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
            {lines.length > 2 && <span className="block text-ink-muted">and {lines.length - 2} more</span>}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (d) => (d.active ? 'Active' : 'Inactive'),
      cell: (d) => <Badge tone={d.active ? 'success' : 'neutral'}>{d.active ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (d) => (
        <span className="inline-flex flex-wrap justify-end gap-2">
          <Button size="sm" icon={CalendarRange} aria-pressed={selectedDoctorId === d.id} onClick={() => showClinics(d.id)} aria-label={`Clinics of ${d.fullName}`}>
            Clinics
          </Button>
          <Button size="sm" icon={Edit2} onClick={() => handleOpenEditDoctor(d)} aria-label={`Edit ${d.fullName}`}>
            Edit
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6">
      <PageHeader
        title="Doctors"
        meta={
          <span>
            {counts.total} {counts.total === 1 ? 'doctor' : 'doctors'}, {counts.active} active
          </span>
        }
        actions={
          <>
            <Button icon={Upload} onClick={() => setIsBulkImportOpen(true)}>
              Import from CSV
            </Button>
            <Button icon={RefreshCw} onClick={openExpand}>
              Put usual weeks on dates
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleOpenAddDoctor}>
              Add doctor
            </Button>
          </>
        }
      />

      <Notice tone="info" title="The roster does not plan the doctors">
        Enter each doctor's clinics here. New rosters then put nurses with them.
      </Notice>

      <search aria-label="Find doctors" className="grid grid-cols-1 gap-3 rounded-lg border border-line bg-surface p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
        <Field label="Search">
          {(f) => <Input {...f} type="search" placeholder="Name or note" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />}
        </Field>
        <Field label="Specialty">
          {(f) => (
            <Select {...f} value={selectedSpecialtyFilter} onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}>
              <option value="ALL">All specialties</option>
              {[...specialties]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </Select>
          )}
        </Field>
        <Field label="Status">
          {(f) => (
            <Select {...f} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as DoctorFilters['status'])}>
              <option value="ALL">Active and inactive</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          )}
        </Field>
      </search>

      <p className="sr-only" role="status" aria-live="polite">
        {filtersOn ? `${filteredDoctors.length} of ${counts.total} doctors shown.` : ''}
      </p>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card xl:col-span-7">
          <DataTable
            caption="Doctors"
            rows={filteredDoctors}
            rowKey={(d) => d.id}
            columns={columns}
            initialSort={{ key: 'name', direction: 'ascending' }}
            rowClassName={(d) => (d.id === selectedDoctorId ? 'bg-brand-soft hover:bg-brand-soft' : undefined)}
            empty={
              doctors.length === 0 ? (
                <EmptyState
                  icon={Stethoscope}
                  title="No doctors yet"
                  action={
                    <Button variant="primary" icon={Plus} onClick={handleOpenAddDoctor}>
                      Add doctor
                    </Button>
                  }
                >
                  Add the clinic's doctors with their usual week, or import them from a CSV file.
                </EmptyState>
              ) : (
                <EmptyState icon={Search} title="No doctor matches" action={<Button onClick={clearFilters}>Clear the search and filters</Button>}>
                  Try another name, or show all specialties and both active and inactive doctors.
                </EmptyState>
              )
            }
          />
        </div>

        <section aria-labelledby="doctor-clinics" className="space-y-4 rounded-lg border border-line bg-surface p-4 shadow-card xl:col-span-5">
          {selectedDoctor ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 id="doctor-clinics" ref={detailHeadingRef} tabIndex={-1} className="text-lg font-semibold text-ink focus:outline-none">
                    Clinics of {selectedDoctor.fullName}
                  </h2>
                  <p className="text-sm text-ink-muted">
                    {selectedDoctorSessions.length} {selectedDoctorSessions.length === 1 ? 'clinic' : 'clinics'} on the calendar.
                  </p>
                </div>
                <Button
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setEditingSession({
                      doctorId: selectedDoctor.id,
                      date: defaultSessionDate(schedules, context.activeScheduleId ?? undefined, localTodayIso()),
                      startTime: '09:00',
                      endTime: '13:00',
                      specialtyId: selectedDoctor.specialtyIds[0],
                      room: '',
                      source: 'MANUAL',
                      cancelled: false,
                    });
                    setIsSessionModalOpen(true);
                  }}
                >
                  Add a clinic
                </Button>
              </div>

              <div className="rounded-lg bg-sunken p-3 text-sm">
                <h3 className="font-semibold text-ink">Usual week</h3>
                {usualWeekLines(selectedDoctor.weeklyPattern).length > 0 ? (
                  <ul className="mt-1 space-y-0.5">
                    {usualWeekLines(selectedDoctor.weeklyPattern).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-ink-muted">No usual week.</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-ink">On the calendar</h3>
                {selectedDoctorSessions.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-line p-3 text-sm text-ink-muted">
                    No clinics on the calendar yet. Put usual weeks on dates to add this doctor's usual week to the roster's days.
                  </p>
                ) : (
                  <ul className="max-h-96 divide-y divide-line overflow-y-auto rounded-lg border border-line">
                    {selectedDoctorSessions.map((sess) => {
                      const spec = specialties.find((x) => x.id === sess.specialtyId);
                      const day = formatDayDate(sess.date);
                      return (
                        <li key={sess.id} className={cx('flex flex-wrap items-center justify-between gap-2 p-2.5 text-sm', sess.cancelled && 'bg-sunken')}>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={cx('font-semibold text-ink', sess.cancelled && 'line-through')}>{day}</span>
                              <span className="tabular-nums">
                                {sess.startTime} to {sess.endTime}
                              </span>
                              {sess.cancelled && <Badge tone="danger">Cancelled</Badge>}
                              {sess.source !== 'PATTERN' && !sess.cancelled && <Badge tone="info">Added by hand</Badge>}
                            </div>
                            <div className="text-xs text-ink-muted">
                              {[sess.room || 'No room', spec?.name].filter(Boolean).join(', ')}
                            </div>
                          </div>
                          <span className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleToggleCancelSession(sess)} aria-label={`${sess.cancelled ? 'Restore' : 'Cancel'} the clinic of ${day}`}>
                              {sess.cancelled ? 'Restore' : 'Cancel'}
                            </Button>
                            <IconButton
                              icon={Edit2}
                              label={`Change the clinic of ${day}`}
                              onClick={() => {
                                setEditingSession(sess);
                                setIsSessionModalOpen(true);
                              }}
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <EmptyState icon={Stethoscope} title="No doctor chosen">
              <h2 id="doctor-clinics" className="sr-only">
                Clinics
              </h2>
              {doctors.length === 0 ? 'Add a doctor to set up their clinics.' : 'Choose Clinics beside a doctor to see and change their clinics.'}
            </EmptyState>
          )}
        </section>
      </div>

      {/* DOCTOR ADD / EDIT (Phase 6, slice 3: the shared dialog and fields) */}
      <Dialog
        open={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        size="lg"
        title={editingDoctor ? `Edit ${editingDoctor.fullName}` : 'Add doctor'}
        description="Each field is checked as you fill it in."
        footer={
          <>
            <Button onClick={() => setIsDoctorModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="doctor-editor" icon={Save} busy={isSaving}>
              {editingDoctor ? 'Save changes' : 'Add doctor'}
            </Button>
          </>
        }
      >
        <form id="doctor-editor" ref={formRef} onSubmit={handleSaveDoctor} noValidate className="space-y-6 text-sm">
          {triedSave && Object.keys(allErrors).length > 0 && (
            <Notice tone="danger" title={Object.keys(allErrors).length === 1 ? '1 field needs fixing' : `${Object.keys(allErrors).length} fields need fixing`}>
              The cursor is in the first one. Each message is under its field.
            </Notice>
          )}
          {inlineError && (
            <Notice live tone="danger" title="Not saved">
              {inlineError}
            </Notice>
          )}

          <section aria-labelledby="doctor-details" className="space-y-3">
            <h3 id="doctor-details" className="text-base font-semibold text-ink">
              Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errorFor('fullName')}>
                {(f) => (
                  <Input
                    {...f}
                    autoComplete="off"
                    placeholder="Dr Ali Hassan"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    onBlur={leave('fullName')}
                  />
                )}
              </Field>
              <Field label="Email" optional error={errorFor('gmail')}>
                {(f) => (
                  <Input
                    {...f}
                    type="email"
                    autoComplete="off"
                    value={formData.gmail}
                    onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                    onBlur={leave('gmail')}
                  />
                )}
              </Field>
            </div>
            <Field label="Note" optional hint="For example, their role or the patients they see.">
              {(f) => <Input {...f} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />}
            </Field>
          </section>

          <fieldset className="space-y-3" aria-describedby={errorFor('specialtyIds') ? 'doctor-specialty-error' : undefined}>
            <legend className="text-base font-semibold text-ink">Specialties</legend>
            {specialties.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[...specialties]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((sp, i) => (
                    <Checkbox
                      key={sp.id}
                      label={sp.name}
                      checked={formData.specialtyIds.includes(sp.id)}
                      aria-invalid={i === 0 && errorFor('specialtyIds') ? true : undefined}
                      onChange={(e) => {
                        const ids = e.target.checked ? [...formData.specialtyIds, sp.id] : formData.specialtyIds.filter((x) => x !== sp.id);
                        setFormData({ ...formData, specialtyIds: ids });
                        setTouched((t) => new Set(t).add('specialtyIds'));
                      }}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-ink-muted">The clinic has no specialties yet. Saving adds General Practice, or add one below.</p>
            )}
            {errorFor('specialtyIds') && (
              <p id="doctor-specialty-error" className="text-sm font-semibold text-danger">
                {errorFor('specialtyIds')}
              </p>
            )}
            {isAddingSpecialty ? (
              <div className="flex flex-wrap items-end gap-2">
                <Field label="New specialty" className="min-w-0 flex-1">
                  {(f) => <Input {...f} placeholder="Dermatology" value={newSpecialtyName} onChange={(e) => setNewSpecialtyName(e.target.value)} />}
                </Field>
                <Button onClick={() => handleQuickAddSpecialty(newSpecialtyName)} disabled={!newSpecialtyName.trim()}>
                  Add
                </Button>
                <Button variant="ghost" onClick={() => setIsAddingSpecialty(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="ghost" icon={Plus} onClick={() => setIsAddingSpecialty(true)} className="-ml-3">
                New specialty
              </Button>
            )}
          </fieldset>

          <section aria-labelledby="doctor-week" className="space-y-3">
            <div>
              <h3 id="doctor-week" className="text-base font-semibold text-ink">
                Usual week
              </h3>
              <p className="text-ink-muted">The days and times of this doctor's clinics each week. The button Put usual weeks on dates adds them to the roster's days.</p>
            </div>
            {formData.weeklyPattern.length === 0 ? (
              <p className="rounded-lg border border-dashed border-line p-3 text-ink-muted">No clinics in the usual week.</p>
            ) : (
              <ol aria-label="Clinics in the usual week" className="space-y-2">
                {formData.weeklyPattern.map((pat, idx) => {
                  const error = errorFor(`pattern:${idx}`);
                  const n = idx + 1;
                  return (
                    <li key={idx} className={cx('rounded-lg border p-3', error ? 'border-danger-line' : 'border-line')}>
                      <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
                        <Field label={`Day, clinic ${n}`}>
                          {(f) => (
                            <Select {...f} value={pat.weekday} onChange={(e) => handlePatternChange(idx, 'weekday', Number(e.target.value))} onBlur={leave(`pattern:${idx}`)}>
                              {WEEKDAY_NAMES.map((name, w) => (
                                <option key={w} value={w}>
                                  {name}
                                </option>
                              ))}
                            </Select>
                          )}
                        </Field>
                        <Field label="Starts">
                          {(f) => (
                            <Input
                              {...f}
                              type="time"
                              aria-invalid={error ? true : undefined}
                              aria-describedby={error ? `doctor-week-error-${idx}` : f['aria-describedby']}
                              value={pat.startTime}
                              onChange={(e) => handlePatternChange(idx, 'startTime', e.target.value)}
                              onBlur={leave(`pattern:${idx}`)}
                            />
                          )}
                        </Field>
                        <Field label="Ends">
                          {(f) => (
                            <Input
                              {...f}
                              type="time"
                              aria-invalid={error ? true : undefined}
                              aria-describedby={error ? `doctor-week-error-${idx}` : f['aria-describedby']}
                              value={pat.endTime}
                              onChange={(e) => handlePatternChange(idx, 'endTime', e.target.value)}
                              onBlur={leave(`pattern:${idx}`)}
                            />
                          )}
                        </Field>
                        <Field label="Room" optional>
                          {(f) => <Input {...f} value={pat.room || ''} onChange={(e) => handlePatternChange(idx, 'room', e.target.value)} />}
                        </Field>
                        <IconButton icon={Trash2} label={`Remove clinic ${n}`} onClick={() => handleRemovePatternRow(idx)} />
                      </div>
                      {error && (
                        <p id={`doctor-week-error-${idx}`} role="alert" className="mt-2 text-sm font-semibold text-danger">
                          {error}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
            <Button icon={Plus} onClick={handleAddPatternRow}>
              Add a clinic to the week
            </Button>
          </section>

          <section aria-labelledby="doctor-status" className="space-y-3">
            <h3 id="doctor-status" className="text-base font-semibold text-ink">
              Status
            </h3>
            <Checkbox
              label="Active"
              hint="New rosters put nurses with the clinics of active doctors."
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            />
          </section>

          {/* Leaving the clinic: inactive first, removing for good second (Phase 6). */}
          {editingDoctor && (
            <section aria-labelledby="doctor-leaving" className="space-y-2 rounded-lg border border-line p-3">
              <h3 id="doctor-leaving" className="font-semibold text-ink">
                Leaving the clinic
              </h3>
              <p className="text-ink-muted">
                {editingDoctor.active
                  ? 'Make the doctor inactive: their history stays, and their clinics stop from a date you choose. Remove them only if they were added by mistake.'
                  : 'This doctor is inactive. Remove them only if they were added by mistake.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {editingDoctor.active && (
                  <Button onClick={() => handleMakeInactive(editingDoctor)} disabled={isSaving}>
                    Make inactive
                  </Button>
                )}
                <Button
                  variant="ghost"
                  icon={Trash2}
                  className="text-danger hover:bg-danger-soft"
                  onClick={() => handleDeleteDoctor(editingDoctor.id, editingDoctor.fullName, editingDoctor.active)}
                >
                  Remove for good
                </Button>
              </div>
            </section>
          )}
        </form>
      </Dialog>

      {/* EXPAND PATTERN MODAL */}
      {weekChange && (
        <DoctorWeekChangeDialog
          doctorName={weekChange.after.fullName}
          beforeText={describeWeek(weekChange.before)}
          afterText={describeWeek(weekChange.after)}
          minDate={today}
          lastSetUpDate={setUpRanges(today).reduce<string | undefined>((last, r) => (!last || r.endDate > last ? r.endDate : last), undefined)}
          preview={(date) => weekPreview(weekChange.before, weekChange.after, date)}
          onConfirm={(date) => saveDoctorWeek(weekChange.before, weekChange.after, date)}
          onCancel={() => setWeekChange(null)}
        />
      )}

      {isExpandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            ref={expandDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={expandTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
          >
            <h3 id={expandTitleId} className="text-sm font-bold text-slate-900">
              Put usual weeks on dates
            </h3>
            <p className="text-[11px] text-slate-500">
              Puts each doctor's usual week on every day of this range. Days changed or cancelled by hand for one date stay as they are; other days follow the week, and clinics the week no longer has are removed.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Doctor</label>
                <select aria-label="Target Doctor"
                  value={expandRange.targetDoctorId}
                  onChange={(e) =>
                    setExpandRange({ ...expandRange, targetDoctorId: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="ALL">All Active Doctors ({doctors.length})</option>
                  {[...doctors]
                    .sort((a, b) => a.fullName.localeCompare(b.fullName))
                    .map((d) => {
                      const docSpec = specialties
                        .filter((s) => d.specialtyIds?.includes(s.id))
                        .map((s) => s.name)
                        .join(', ');
                      return (
                        <option key={d.id} value={d.id}>
                          {d.fullName}{docSpec ? ` — ${docSpec}` : ''}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                  <input aria-label="Start Date"
                    type="date"
                    value={expandRange.startDate}
                    onChange={(e) =>
                      setExpandRange({ ...expandRange, startDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date</label>
                  <input aria-label="End Date"
                    type="date"
                    value={expandRange.endDate}
                    onChange={(e) =>
                      setExpandRange({ ...expandRange, endDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsExpandModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExpandPatternToSessions}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
              >
                Expand Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AD-HOC SESSION OVERRIDE MODAL */}
      {isSessionModalOpen && editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            ref={sessionDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={sessionTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4 text-xs"
          >
            <h3 id={sessionTitleId} className="text-sm font-bold text-slate-900">
              {editingSession.id ? 'Edit Clinic Session' : 'Add Ad-hoc Session'}
            </h3>

            <form onSubmit={handleSaveAdHocSession} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Date</label>
                <input aria-label="Date"
                  type="date"
                  required
                  value={editingSession.date}
                  onChange={(e) =>
                    setEditingSession({ ...editingSession, date: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Time</label>
                  <input aria-label="Start Time"
                    type="time"
                    required
                    value={editingSession.startTime}
                    onChange={(e) =>
                      setEditingSession({ ...editingSession, startTime: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Time</label>
                  <input aria-label="End Time"
                    type="time"
                    required
                    value={editingSession.endTime}
                    onChange={(e) =>
                      setEditingSession({ ...editingSession, endTime: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Room / Suite</label>
                <input aria-label="Room / Suite"
                  type="text"
                  value={editingSession.room || ''}
                  onChange={(e) =>
                    setEditingSession({ ...editingSession, room: e.target.value })
                  }
                  placeholder="Suite 101"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSessionModalOpen(false);
                    setEditingSession(null);
                  }}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal (opens on the doctors tab) */}
      <BulkImportModal
        seniorityLevels={seniorityLevels}
        specialties={specialties}
        roles={clinicalRoles}
        initialTab="DOCTORS"
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportComplete={() => {
          setIsBulkImportOpen(false);
          loadData();
        }}
      />
    </div>
  );
};
