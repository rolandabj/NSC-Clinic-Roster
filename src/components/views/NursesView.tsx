import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  Percent,
  Edit2,
  Trash2,
  AlertTriangle,
  GripVertical,
  Info,
  Droplets,
  Heart,
  Save,
  X,
  Upload,
  Stethoscope,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { AddressChange, ClinicContextState } from '../../types/navigation';
import { getRepository } from '../../services/repository';
import { isExclusiveNurseClinic } from '../../services/engine/nurseClinicUtils';
import {
  Nurse,
  SeniorityLevel,
  ClinicalRole,
  Specialty,
  Doctor,
  NursePreference,
  PreferenceFocus,
  LeaveType,
} from '../../types';
import { PREFERENCE_FOCUS_LABELS } from '../../services/engine/preferenceOrder';
import { BulkImportModal } from '../modals/BulkImportModal';
import { notify, confirmDialog, type NoticeTone } from '../common/dialogs';
import { revokeNurseLink } from '../../services/publish/nurseRosterService';
import { filterNurses, nurseCounts, type NurseFilters } from '../../services/nurses/nurseList';
import { checkNurseForm, movePreference } from '../../services/nurses/nurseForm';
import { localTodayIso } from '../../utils/dateUtils';
import { Badge, Button, Checkbox, DataTable, DateInput, Dialog, EmptyState, Field, IconButton, Input, Notice, PageHeader, Select, Textarea, cx, type Column } from '../ui';

interface NursesViewProps {
  context: ClinicContextState;
  /** The nurse the address names (#nurses?nurse=mary): their details open. */
  nurseId?: string;
  onAddressChange?: AddressChange;
}

export const NursesView: React.FC<NursesViewProps> = ({ context, nurseId, onAddressChange }) => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [seniorityLevels, setSeniorityLevels] = useState<SeniorityLevel[]>([]);
  const [clinicalRoles, setClinicalRoles] = useState<ClinicalRole[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeniorityFilter, setSelectedSeniorityFilter] = useState<string>('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    fullName: string;
    gmail: string;
    employeeCode: string;
    seniorityLevelId: string;
    contractPercent: number;
    dateOfBirth: string;
    capabilityIds: string[];
    isClinicNurse: boolean;
    preferences: NursePreference[];
    preferenceFocus: PreferenceFocus;
    leaveQuotas: Record<string, number>;
    active: boolean;
    notes: string;
  }>({
    fullName: '',
    gmail: '',
    employeeCode: '',
    seniorityLevelId: '',
    contractPercent: 100,
    dateOfBirth: '1995-01-01',
    capabilityIds: [],
    isClinicNurse: true,
    preferences: [],
    preferenceFocus: 'LIST',
    leaveQuotas: {},
    active: true,
    notes: '',
  });

  const isOnlyNcCapability =
    formData.capabilityIds.length > 0 &&
    formData.capabilityIds.every(
      (cid) =>
        cid === 'role-nurse-clinic' ||
        clinicalRoles.find((r) => r.id === cid)?.acronym === 'NC' ||
        clinicalRoles.find((r) => r.id === cid)?.name.toLowerCase().includes('nurse clinic')
    );
  const isConfiguredExclusiveNC = !formData.isClinicNurse && isOnlyNcCapability;

  // Each field is checked as it is filled in: its message shows once the field has been
  // left, or for every field after Save was pressed (Phase 6, slice 2).
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [triedSave, setTriedSave] = useState(false);
  const allErrors = checkNurseForm(formData, nurses, formData.id, localTodayIso());
  const errorFor = (field: string) => (triedSave || touched.has(field) ? allErrors[field] : undefined);
  const leave = (field: string) => () => setTouched((t) => (t.has(field) ? t : new Set(t).add(field)));
  const formRef = useRef<HTMLFormElement>(null);

  // Preferences: the one chosen to add, what was last moved (its button keeps the focus), and what is read out.
  const [prefToAdd, setPrefToAdd] = useState('');
  const [prefFocus, setPrefFocus] = useState<{ key: string; button: 'up' | 'down' } | null>(null);
  const [prefStatus, setPrefStatus] = useState('');

  // Drag and drop state for preferences priority
  const [draggedPrefIdx, setDraggedPrefIdx] = useState<number | null>(null);
  const [dragOverPrefIdx, setDragOverPrefIdx] = useState<number | null>(null);


  const repo = getRepository();

  const loadAllData = async () => {
    try {
      const [nList, sList, crList, spList, dList, ltList] = await Promise.all([
        repo.list('nurses'),
        repo.list('seniorityLevels'),
        repo.list('clinicalRoles'),
        repo.list('specialties'),
        repo.list('doctors'),
        repo.list('leaveTypes'),
      ]);
      setNurses(nList);
      setSeniorityLevels(sList.sort((a, b) => a.rank - b.rank));
      setClinicalRoles(crList);
      setSpecialties(spList);
      setDoctors(dList);
      setLeaveTypes(ltList);
    } catch (err) {
      console.error('Error loading nurses data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerNotification = (msg: string, tone: NoticeTone = 'success') => notify(msg, tone);

  const handleOpenAdd = () => {
    const defaultSeniority = seniorityLevels[2]?.id || seniorityLevels[0]?.id || '';
    setEditingNurse(null);
    setFormData({
      fullName: '',
      gmail: '',
      employeeCode: `N-${100 + nurses.length + 1}`,
      seniorityLevelId: defaultSeniority,
      contractPercent: 100,
      dateOfBirth: '',
      capabilityIds: [],
      isClinicNurse: true,
      preferences: [],
      preferenceFocus: 'LIST',
      leaveQuotas: {},
      active: true,
      notes: '',
    });
    setTouched(new Set());
    setTriedSave(false);
    setPrefToAdd('');
    setPrefStatus('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (nurse: Nurse) => {
    setEditingNurse(nurse);
    const rawQuotas = nurse.leaveQuotas || {};
    const normalizedQuotas: Record<string, number> = {};
    for (const [k, v] of Object.entries(rawQuotas)) {
      const lt = leaveTypes.find((l) => l.id === k);
      const isSick = lt?.id === 'leave-sl' || lt?.acronym?.toUpperCase() === 'SL' || lt?.name?.toLowerCase().includes('sick');
      if (!isSick && typeof v === 'number' && v > 0) {
        // Convert legacy hours to days if > 40 and divisible by 8 (e.g. 240h -> 30d)
        normalizedQuotas[k] = v > 40 && v % 8 === 0 ? v / 8 : v;
      }
    }

    setFormData({
      id: nurse.id,
      fullName: nurse.fullName,
      gmail: nurse.gmail,
      employeeCode: nurse.employeeCode,
      seniorityLevelId: nurse.seniorityLevelId,
      contractPercent: nurse.contractPercent,
      dateOfBirth: nurse.dateOfBirth,
      capabilityIds: nurse.capabilityIds || [],
      isClinicNurse: nurse.isClinicNurse !== false,
      preferences: nurse.preferences || [],
      preferenceFocus: nurse.preferenceFocus || 'LIST',
      leaveQuotas: normalizedQuotas,
      active: nurse.active,
      notes: nurse.notes || '',
    });
    setTouched(new Set());
    setTriedSave(false);
    setPrefToAdd('');
    setPrefStatus('');
    setIsModalOpen(true);
  };

  // A link to a nurse opens their details once the list has loaded.
  const linkHandledRef = useRef(!nurseId);
  useEffect(() => {
    if (!nurseId || nurses.length === 0) return;
    linkHandledRef.current = true;
    if (isModalOpen && editingNurse?.id === nurseId) return;
    const nurse = nurses.find((n) => n.id === nurseId);
    if (nurse) handleOpenEdit(nurse);
  }, [nurseId, nurses.length]);

  // The address follows the open details (#nurses?nurse=mary), so the link can be copied.
  // Back is left alone: opening details is not a new step.
  useEffect(() => {
    if (!linkHandledRef.current) return;
    const open = isModalOpen && editingNurse ? editingNurse.id : undefined;
    if (open !== nurseId) onAddressChange?.({ nurse: open }, 'replace');
  }, [isModalOpen, editingNurse?.id]);

  const handleSaveNurse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(allErrors).length) {
      setTriedSave(true);
      // The first field to fix gets the focus, so its message is read out.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    // Sanitize leave quotas: only store non-negative days, purge sick leave completely
    const cleanQuotas: Record<string, number> = {};
    for (const [k, v] of Object.entries(formData.leaveQuotas)) {
      const lt = leaveTypes.find((l) => l.id === k);
      const isSick =
        lt?.id === 'leave-sl' ||
        lt?.acronym?.toUpperCase() === 'SL' ||
        lt?.name?.toLowerCase().includes('sick');
      if (!isSick && typeof v === 'number' && v > 0) {
        cleanQuotas[k] = Math.round(v);
      }
    }

    const isOnlyNcCapability =
      formData.capabilityIds.length > 0 &&
      formData.capabilityIds.every(
        (cid) =>
          cid === 'role-nurse-clinic' ||
          clinicalRoles.find((r) => r.id === cid)?.acronym === 'NC' ||
          clinicalRoles.find((r) => r.id === cid)?.name.toLowerCase().includes('nurse clinic')
      );
    const isConfiguredExclusiveNC = !formData.isClinicNurse && isOnlyNcCapability;
    const finalPreferences = isConfiguredExclusiveNC
      ? formData.preferences.filter((p) => p.kind !== 'DOCTOR' && p.kind !== 'SPECIALTY')
      : formData.preferences;

    try {
      if (formData.id) {
        await repo.update('nurses', formData.id, {
          fullName: formData.fullName.trim(),
          gmail: formData.gmail.trim().toLowerCase(),
          employeeCode: formData.employeeCode.trim(),
          seniorityLevelId: formData.seniorityLevelId,
          contractPercent: Number(formData.contractPercent),
          dateOfBirth: formData.dateOfBirth,
          capabilityIds: formData.capabilityIds,
          isClinicNurse: formData.isClinicNurse,
          preferences: finalPreferences,
          preferenceFocus: formData.preferenceFocus,
          leaveQuotas: cleanQuotas,
          active: formData.active,
          notes: formData.notes,
          updatedAt: new Date().toISOString(),
        });
        // A nurse made inactive no longer has a private page.
        if (!formData.active && nurses.find((n) => n.id === formData.id)?.active) {
          await revokeNurseLink(repo, formData.id).catch((err) => console.warn('Could not stop the private link:', err));
        }
        triggerNotification(`Updated profile for ${formData.fullName}.`);
      } else {
        await repo.create('nurses', {
          fullName: formData.fullName.trim(),
          gmail: formData.gmail.trim().toLowerCase(),
          employeeCode: formData.employeeCode.trim(),
          seniorityLevelId: formData.seniorityLevelId,
          contractPercent: Number(formData.contractPercent),
          dateOfBirth: formData.dateOfBirth,
          capabilityIds: formData.capabilityIds,
          isClinicNurse: formData.isClinicNurse,
          preferences: finalPreferences,
          preferenceFocus: formData.preferenceFocus,
          leaveQuotas: cleanQuotas,
          active: formData.active,
          notes: formData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        triggerNotification(`Added nurse ${formData.fullName}.`);
      }
      setIsModalOpen(false);
      loadAllData();
    } catch (err: any) {
      notify(`Error saving nurse: ${err.message}`, 'error');
    }
  };

  // Leaving the clinic: inactive keeps the nurse's history and leaves them out of new rosters.
  const handleMakeInactive = async (id: string, name: string) => {
    try {
      await repo.update('nurses', id, { active: false, updatedAt: new Date().toISOString() });
      // An inactive nurse no longer has a private page.
      await revokeNurseLink(repo, id).catch((err) => console.warn('Could not stop the private link:', err));
      triggerNotification(`${name} is inactive. New rosters leave them out.`);
      setIsModalOpen(false);
      loadAllData();
    } catch (err: any) {
      notify(`Could not make ${name} inactive: ${err.message}`, 'error');
    }
  };

  const handleDeleteNurse = async (id: string, name: string, active: boolean) => {
    const ok = await confirmDialog({
      title: `Remove ${name} for good?`,
      message: active
        ? `This deletes ${name} and turns off the page they use to see their shifts. It cannot be undone. If they are leaving the clinic, make them inactive instead: their history stays and new rosters leave them out.`
        : `This deletes ${name}. It cannot be undone.`,
      confirmLabel: 'Remove for good',
      danger: true,
    });
    if (!ok) return;
    try {
      // Their private link stops working too (it would otherwise keep showing their shifts).
      await revokeNurseLink(repo, id).catch((err) => console.warn('Could not stop the private link:', err));
      await repo.remove('nurses', id);
      triggerNotification(`${name} is removed.`);
      setIsModalOpen(false);
      loadAllData();
    } catch (err: any) {
      notify(`Could not remove ${name}: ${err.message}`, 'error');
    }
  };

  // Preference list helpers
  const prefKey = (p: NursePreference) => `${p.kind}:${p.refId}`;
  const prefTitle = (p: NursePreference) => {
    const doc = doctors.find((d) => d.id === p.refId);
    const sp = specialties.find((x) => x.id === p.refId);
    return doc ? doc.fullName : sp ? sp.name : p.refId;
  };

  const handleAddPreference = () => {
    if (!prefToAdd) return;
    const [kind, refId] = prefToAdd.split(':') as ['DOCTOR' | 'SPECIALTY', string];
    if (formData.preferences.some((p) => p.kind === kind && p.refId === refId)) return;
    const added: NursePreference = { kind, refId, rank: formData.preferences.length + 1 };
    setFormData({ ...formData, preferences: [...formData.preferences, added] });
    setPrefToAdd('');
    setPrefStatus(`${prefTitle(added)} added as number ${added.rank}.`);
  };

  const handleReorderPreference = (from: number, to: number, button?: 'up' | 'down') => {
    const list = movePreference(formData.preferences, from, to);
    if (list === formData.preferences) return;
    const moved = list[to];
    setFormData({ ...formData, preferences: list });
    setPrefStatus(`${prefTitle(moved)} is now number ${to + 1} of ${list.length}.`);
    // At the top or bottom that button is turned off, so the focus goes to the other one.
    if (button) setPrefFocus({ key: prefKey(moved), button: to === 0 ? 'down' : to === list.length - 1 ? 'up' : button });
  };

  useEffect(() => {
    if (!prefFocus) return;
    formRef.current?.querySelector<HTMLElement>(`[data-pref="${prefFocus.key}"] [data-move="${prefFocus.button}"]`)?.focus();
    setPrefFocus(null);
  }, [prefFocus]);

  const handleRemovePreference = (index: number) => {
    const removed = formData.preferences[index];
    const list = formData.preferences.filter((_, i) => i !== index).map((p, i) => ({ ...p, rank: i + 1 }));
    setFormData({ ...formData, preferences: list });
    setPrefStatus(`${prefTitle(removed)} removed.`);
  };

  const toggleCapability = (roleId: string) => {
    const current = new Set(formData.capabilityIds);
    if (current.has(roleId)) {
      current.delete(roleId);
    } else {
      current.add(roleId);
    }
    setFormData({ ...formData, capabilityIds: Array.from(current) });
  };

  const filteredNurses = filterNurses(nurses, { query: searchQuery, levelId: selectedSeniorityFilter, status: activeStatusFilter });
  const counts = nurseCounts(nurses);
  const filtersOn = searchQuery.trim() !== '' || selectedSeniorityFilter !== 'ALL' || activeStatusFilter !== 'ALL';
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSeniorityFilter('ALL');
    setActiveStatusFilter('ALL');
  };

  // A preference as the list shows it: "#1 Dr Lee (CARD)" or "#2 CARD".
  const preferenceLabel = (pref: NursePreference) => {
    const doc = doctors.find((d) => d.id === pref.refId);
    if (doc) {
      const spec = specialties.find((s) => doc.specialtyIds?.includes(s.id));
      return `#${pref.rank} ${doc.fullName}${spec ? ` (${spec.code || spec.name})` : ''}`;
    }
    const sp = specialties.find((s) => s.id === pref.refId);
    return `#${pref.rank} ${sp?.name || sp?.code || pref.refId}`;
  };

  const columns: Column<Nurse>[] = [
    {
      key: 'name',
      header: 'Nurse',
      sortValue: (n) => n.fullName,
      cell: (n) => (
        <span className="block">
          <span className="block">{n.fullName}</span>
          {n.employeeCode && <span className="block text-xs font-normal text-ink-muted">{n.employeeCode}</span>}
        </span>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      sortValue: (n) => seniorityLevels.find((s) => s.id === n.seniorityLevelId)?.name,
      cell: (n) => {
        const level = seniorityLevels.find((s) => s.id === n.seniorityLevelId);
        if (!level) return <span className="text-ink-muted">Not set</span>;
        return (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: level.color }} />
            {level.name}
            {/* The mark only when the level's own name does not already say it. */}
            {level.isSenior && !/senior/i.test(level.name) && <Badge tone="info">Senior</Badge>}
          </span>
        );
      },
    },
    {
      key: 'email',
      header: 'Email',
      sortValue: (n) => n.gmail,
      cell: (n) => (n.gmail ? <span className="break-all">{n.gmail}</span> : <span className="text-ink-muted">None</span>),
    },
    {
      key: 'contract',
      header: 'Contract',
      align: 'right',
      sortValue: (n) => n.contractPercent,
      cell: (n) => (
        <span className="whitespace-nowrap">
          {n.contractPercent}%<span className="text-ink-muted">, {n.contractPercent >= 100 ? 'full time' : 'part time'}</span>
        </span>
      ),
    },
    {
      key: 'skills',
      header: 'Skills',
      cell: (n) => {
        if (isExclusiveNurseClinic(n, clinicalRoles)) return <Badge tone="success" icon={Stethoscope}>Nurse clinic only</Badge>;
        const phl = n.capabilityIds?.includes('role-phl');
        if (!phl && !n.isClinicNurse) return <span className="text-ink-muted">None</span>;
        return (
          <span className="flex flex-wrap gap-1">
            {phl && <Badge tone="danger" icon={Droplets}>Blood and IV</Badge>}
            {n.isClinicNurse && <Badge tone="info">Clinic nurse</Badge>}
          </span>
        );
      },
    },
    {
      key: 'preferences',
      header: 'Preferences',
      cell: (n) => {
        if (isExclusiveNurseClinic(n, clinicalRoles)) return <span className="text-ink-muted">No doctors</span>;
        const prefs = [...(n.preferences || [])].sort((a, b) => a.rank - b.rank);
        if (prefs.length === 0) return <span className="text-ink-muted">None, goes where needed</span>;
        return (
          <span className="block max-w-64">
            {prefs.slice(0, 2).map((p) => (
              <span key={`${p.kind}-${p.refId}`} className="block truncate">
                {preferenceLabel(p)}
              </span>
            ))}
            {prefs.length > 2 && <span className="block text-ink-muted">and {prefs.length - 2} more</span>}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (n) => (n.active ? 'Active' : 'Inactive'),
      cell: (n) => <Badge tone={n.active ? 'success' : 'neutral'}>{n.active ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (n) => (
        <Button size="sm" icon={Edit2} onClick={() => handleOpenEdit(n)} aria-label={`Edit ${n.fullName}`}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6">
      <PageHeader
        title="Nurses"
        meta={
          <span>
            {counts.total} {counts.total === 1 ? 'nurse' : 'nurses'}, {counts.active} active
          </span>
        }
        actions={
          <>
            <Button icon={Upload} onClick={() => setIsBulkImportOpen(true)}>
              Import from CSV
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
              Add nurse
            </Button>
          </>
        }
      />

      <search aria-label="Find nurses" className="grid grid-cols-1 gap-3 rounded-lg border border-line bg-surface p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
        <Field label="Search">
          {(f) => (
            <Input
              {...f}
              type="search"
              placeholder="Name, employee code or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </Field>
        <Field label="Level">
          {(f) => (
            <Select {...f} value={selectedSeniorityFilter} onChange={(e) => setSelectedSeniorityFilter(e.target.value)}>
              <option value="ALL">All levels</option>
              {seniorityLevels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Status">
          {(f) => (
            <Select {...f} value={activeStatusFilter} onChange={(e) => setActiveStatusFilter(e.target.value as NurseFilters['status'])}>
              <option value="ALL">Active and inactive</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          )}
        </Field>
      </search>

      <p className="sr-only" role="status" aria-live="polite">
        {filtersOn ? `${filteredNurses.length} of ${counts.total} nurses shown.` : ''}
      </p>

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
        <DataTable
          caption="Nurses"
          rows={filteredNurses}
          rowKey={(n) => n.id}
          columns={columns}
          initialSort={{ key: 'name', direction: 'ascending' }}
          empty={
            nurses.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No nurses yet"
                action={
                  <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
                    Add nurse
                  </Button>
                }
              >
                Add the clinic's nurses, or import them from a CSV file.
              </EmptyState>
            ) : (
              <EmptyState icon={Search} title="No nurse matches" action={<Button onClick={clearFilters}>Clear the search and filters</Button>}>
                Try another name, or show all levels and both active and inactive nurses.
              </EmptyState>
            )
          }
        />
      </div>

      {/* NURSE PROFILE MODAL */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
        title={editingNurse ? `Edit ${editingNurse.fullName}` : 'Add nurse'}
        description="Each field is checked as you fill it in."
        footer={
          <>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="nurse-editor" icon={Save}>
              {editingNurse ? 'Save changes' : 'Add nurse'}
            </Button>
          </>
        }
      >
        <form id="nurse-editor" ref={formRef} onSubmit={handleSaveNurse} noValidate className="space-y-6 text-sm">
          {triedSave && Object.keys(allErrors).length > 0 && (
            <Notice tone="danger" title={Object.keys(allErrors).length === 1 ? '1 field needs fixing' : `${Object.keys(allErrors).length} fields need fixing`}>
              The cursor is in the first one. Each message is under its field.
            </Notice>
          )}

          <section aria-labelledby="nurse-details" className="space-y-3">
            <h3 id="nurse-details" className="text-base font-semibold text-ink">
              Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errorFor('fullName')}>
                {(f) => (
                  <Input
                    {...f}
                    autoComplete="off"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    onBlur={leave('fullName')}
                  />
                )}
              </Field>
              <Field label="Email" hint="Rosters and the private page are sent here." error={errorFor('gmail')}>
                {(f) => (
                  <Input
                    {...f}
                    type="email"
                    autoComplete="off"
                    placeholder="name@gmail.com"
                    value={formData.gmail}
                    onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                    onBlur={leave('gmail')}
                  />
                )}
              </Field>
              <Field label="Employee code" optional error={errorFor('employeeCode')}>
                {(f) => (
                  <Input
                    {...f}
                    autoComplete="off"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    onBlur={leave('employeeCode')}
                  />
                )}
              </Field>
              <Field label="Date of birth" hint="For birthday leave." error={errorFor('dateOfBirth')}>
                {(f) => (
                  <DateInput
                    {...f}
                    value={formData.dateOfBirth}
                    onChange={(iso) => setFormData({ ...formData, dateOfBirth: iso })}
                    onBlur={leave('dateOfBirth')}
                    max={localTodayIso()}
                  />
                )}
              </Field>
            </div>
          </section>

          <section aria-labelledby="nurse-contract" className="space-y-3">
            <h3 id="nurse-contract" className="text-base font-semibold text-ink">
              Level and contract
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Level" hint="A senior level counts for the senior on duty rule.">
                {(f) => (
                  <Select {...f} value={formData.seniorityLevelId} onChange={(e) => setFormData({ ...formData, seniorityLevelId: e.target.value })}>
                    {seniorityLevels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name}
                        {lvl.isSenior && !/senior/i.test(lvl.name) ? ' (senior)' : ''}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field
                label="Contract (%)"
                hint={
                  allErrors.contractPercent
                    ? 'From 10 to 100.'
                    : formData.contractPercent === 100
                      ? 'Full time: all of the goal hours.'
                      : `Part time: ${formData.contractPercent}% of the goal hours.`
                }
                error={errorFor('contractPercent')}
              >
                {(f) => (
                  <Input
                    {...f}
                    type="number"
                    inputMode="numeric"
                    min={10}
                    max={100}
                    step={1}
                    className="w-28"
                    value={Number.isNaN(formData.contractPercent) ? '' : formData.contractPercent}
                    onChange={(e) => setFormData({ ...formData, contractPercent: e.target.value === '' ? NaN : Number(e.target.value) })}
                    onBlur={leave('contractPercent')}
                  />
                )}
              </Field>
            </div>
          </section>

          <fieldset className="space-y-3">
            <legend className="text-base font-semibold text-ink">Skills</legend>
            <Checkbox
              label="Clinic nurse"
              hint="Works with the doctors in their clinics."
              checked={formData.isClinicNurse}
              onChange={(e) => setFormData({ ...formData, isClinicNurse: e.target.checked })}
            />
            {clinicalRoles.map((role) => (
              <Checkbox
                key={role.id}
                label={`${role.name} (${role.acronym})`}
                hint={role.description}
                checked={formData.capabilityIds.includes(role.id)}
                onChange={() => toggleCapability(role.id)}
              />
            ))}
            {isConfiguredExclusiveNC && (
              <Notice tone="info" title="Nurse clinic only">
                This nurse is not a clinic nurse, so new rosters put them only in the nurse clinic, never with a doctor.
              </Notice>
            )}
          </fieldset>

          <section aria-labelledby="nurse-prefs" className="space-y-3">
            <div>
              <h3 id="nurse-prefs" className="text-base font-semibold text-ink">
                Preferences
              </h3>
              <p className="text-ink-muted">
                The doctors and specialties this nurse works with, most wanted first. A nurse with preferences is put only with them; a nurse without goes where needed.
              </p>
            </div>
            {isConfiguredExclusiveNC ? (
              <Notice tone="info" title="No preferences for the nurse clinic only">
                {formData.preferences.length > 0 ? (
                  <>
                    The {formData.preferences.length === 1 ? 'preference' : `${formData.preferences.length} preferences`} below will be cleared when you save.
                  </>
                ) : (
                  'Doctors and specialties do not apply to this nurse.'
                )}
              </Notice>
            ) : (
              <>
                <div className="flex flex-wrap items-end gap-2">
                  <Field label="Add a doctor or specialty" className="min-w-0 flex-1">
                    {(f) => (
                      <Select {...f} value={prefToAdd} onChange={(e) => setPrefToAdd(e.target.value)}>
                        <option value="">Choose…</option>
                        <optgroup label="Doctors">
                          {[...doctors]
                            .filter((d) => !formData.preferences.some((p) => p.kind === 'DOCTOR' && p.refId === d.id))
                            .sort((a, b) => a.fullName.localeCompare(b.fullName))
                            .map((d) => {
                              const docSpecs = specialties.filter((x) => d.specialtyIds?.includes(x.id)).map((x) => x.name).join(', ');
                              return (
                                <option key={d.id} value={`DOCTOR:${d.id}`}>
                                  {d.fullName}
                                  {docSpecs ? ` (${docSpecs})` : ''}
                                </option>
                              );
                            })}
                        </optgroup>
                        <optgroup label="Specialties">
                          {[...specialties]
                            .filter((x) => !formData.preferences.some((p) => p.kind === 'SPECIALTY' && p.refId === x.id))
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((x) => (
                              <option key={x.id} value={`SPECIALTY:${x.id}`}>
                                {x.name}
                              </option>
                            ))}
                        </optgroup>
                      </Select>
                    )}
                  </Field>
                  <Button icon={Plus} onClick={handleAddPreference} disabled={!prefToAdd}>
                    Add
                  </Button>
                </div>

                {formData.preferences.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-line p-3 text-ink-muted">None, goes where needed.</p>
                ) : (
                  <ol aria-label="Preferences, most wanted first" className="space-y-2">
                    {formData.preferences.map((pref, idx) => {
                      const title = prefTitle(pref);
                      const doc = doctors.find((d) => d.id === pref.refId);
                      const kindLabel = doc
                        ? specialties.filter((x) => doc.specialtyIds?.includes(x.id)).map((x) => x.name).join(', ') || 'Doctor'
                        : 'Specialty';
                      const last = idx === formData.preferences.length - 1;
                      return (
                        <li
                          key={prefKey(pref)}
                          data-pref={prefKey(pref)}
                          draggable
                          onDragStart={(e) => {
                            setDraggedPrefIdx(idx);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (dragOverPrefIdx !== idx) setDragOverPrefIdx(idx);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedPrefIdx !== null) handleReorderPreference(draggedPrefIdx, idx);
                            setDraggedPrefIdx(null);
                            setDragOverPrefIdx(null);
                          }}
                          onDragEnd={() => {
                            setDraggedPrefIdx(null);
                            setDragOverPrefIdx(null);
                          }}
                          className={cx(
                            'flex flex-wrap items-center gap-2 rounded-lg border bg-surface p-2',
                            dragOverPrefIdx === idx && draggedPrefIdx !== idx ? 'border-brand ring-2 ring-brand/40' : 'border-line',
                            draggedPrefIdx === idx && 'opacity-50'
                          )}
                        >
                          <GripVertical aria-hidden="true" className="size-4 shrink-0 cursor-grab text-ink-muted" />
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-strong">
                            {pref.rank}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-ink">{title}</span>
                            <span className="block text-xs text-ink-muted">{kindLabel}</span>
                          </span>
                          <span className="flex gap-1">
                            <IconButton
                              data-move="up"
                              icon={ChevronUp}
                              label={`Move ${title} up`}
                              disabled={idx === 0}
                              onClick={() => handleReorderPreference(idx, idx - 1, 'up')}
                            />
                            <IconButton
                              data-move="down"
                              icon={ChevronDown}
                              label={`Move ${title} down`}
                              disabled={last}
                              onClick={() => handleReorderPreference(idx, idx + 1, 'down')}
                            />
                            <IconButton icon={X} label={`Remove ${title}`} onClick={() => handleRemovePreference(idx)} />
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}
                <p className="sr-only" role="status" aria-live="polite">
                  {prefStatus}
                </p>

                {formData.preferences.some((p) => p.kind === 'DOCTOR') && formData.preferences.some((p) => p.kind === 'SPECIALTY') && (
                  <fieldset className="space-y-2 rounded-lg border border-line p-3">
                    <legend className="px-1 font-semibold text-ink">When their doctors and their specialties need a nurse on the same day</legend>
                    {(Object.keys(PREFERENCE_FOCUS_LABELS) as PreferenceFocus[]).map((focus) => (
                      <label key={focus} className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="preferenceFocus"
                          className="mt-1 size-4"
                          checked={formData.preferenceFocus === focus}
                          onChange={() => setFormData({ ...formData, preferenceFocus: focus })}
                        />
                        <span>
                          <span className="font-semibold text-ink">{PREFERENCE_FOCUS_LABELS[focus]}</span>
                          <span className="block text-ink-muted">
                            {focus === 'LIST'
                              ? 'Uses the order of the list above, top first.'
                              : focus === 'DOCTOR'
                                ? 'Their named doctors come before their specialties, whatever the order above.'
                                : 'Their specialties come before their named doctors, whatever the order above.'}
                          </span>
                        </span>
                      </label>
                    ))}
                    <p className="text-xs text-ink-muted">For each doctor, a nurse who named that doctor comes before a nurse who only chose the doctor's specialty.</p>
                  </fieldset>
                )}
              </>
            )}
          </section>

          <section aria-labelledby="nurse-quotas" className="space-y-3">
            <div>
              <h3 id="nurse-quotas" className="text-base font-semibold text-ink">
                Leave days a year
              </h3>
              <p className="text-ink-muted">Days allowed each calendar year. Keep a box empty for no limit. Sick leave has no limit.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {leaveTypes
                .filter(
                  (lt) =>
                    lt.id !== 'leave-sl' &&
                    lt.acronym?.toUpperCase() !== 'SL' &&
                    !lt.name.toLowerCase().includes('sick') &&
                    !['RO', 'DO'].includes(lt.acronym?.toUpperCase() || '') &&
                    lt.creditedHours !== 0
                )
                .map((lt) => (
                  <Field key={lt.id} label={`${lt.name} (${lt.acronym})`} optional error={errorFor(`quota:${lt.id}`)}>
                    {(f) => (
                      <Input
                        {...f}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={366}
                        step={1}
                        value={formData.leaveQuotas[lt.id] ?? ''}
                        onChange={(e) => {
                          const next = { ...formData.leaveQuotas };
                          if (e.target.value === '') delete next[lt.id];
                          else next[lt.id] = Number(e.target.value);
                          setFormData({ ...formData, leaveQuotas: next });
                        }}
                        onBlur={leave(`quota:${lt.id}`)}
                      />
                    )}
                  </Field>
                ))}
            </div>
          </section>

          <section aria-labelledby="nurse-status" className="space-y-3">
            <h3 id="nurse-status" className="text-base font-semibold text-ink">
              Status and notes
            </h3>
            <Checkbox
              label="Active"
              hint="Active nurses are put on new rosters."
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            />
            <Field label="Notes" optional>
              {(f) => <Textarea {...f} rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />}
            </Field>
          </section>

          {/* Leaving the clinic: inactive first, removing for good second (Phase 6). */}
          {editingNurse && (
            <section aria-labelledby="nurse-leaving" className="space-y-2 rounded-lg border border-line p-3 text-sm">
              <h3 id="nurse-leaving" className="font-semibold text-ink">
                Leaving the clinic
              </h3>
              <p className="text-ink-muted">
                {editingNurse.active
                  ? 'Make the nurse inactive: their history stays and new rosters leave them out. Remove them only if they were added by mistake.'
                  : 'This nurse is inactive. Remove them only if they were added by mistake.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {editingNurse.active && (
                  <Button type="button" onClick={() => handleMakeInactive(editingNurse.id, editingNurse.fullName)}>
                    Make inactive
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  icon={Trash2}
                  className="text-danger hover:bg-danger-soft"
                  onClick={() => handleDeleteNurse(editingNurse.id, editingNurse.fullName, editingNurse.active)}
                >
                  Remove for good
                </Button>
              </div>
            </section>
          )}
        </form>
      </Dialog>

      {/* Bulk CSV Import Modal (Phase 14.6) */}
      <BulkImportModal
        seniorityLevels={seniorityLevels}
        specialties={specialties}
        roles={clinicalRoles}
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportComplete={() => {
          loadAllData();
          triggerNotification('Nurses imported successfully from CSV.');
        }}
      />
    </div>
  );
};
