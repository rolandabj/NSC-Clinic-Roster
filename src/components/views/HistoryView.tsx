/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * History: every saved copy, automatic backup and published version of every roster, with one
 * set of filters. Pick one to see its shifts, what changed since, and to download, restore or
 * delete it. Restore and delete are for planners; deleting a whole roster is only in the
 * roster's More menu (Phase 7, slice 5).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { usePermissions } from '../common/usePermissions';
import { notify } from '../common/dialogs';
import { ChevronLeft, ChevronRight, Diff, Download, History, Lock, Maximize2, RotateCcw, Search, Trash2 } from 'lucide-react';
import { ClinicContextState } from '../../types/navigation';
import { getRepository } from '../../services/repository';
import { restoreVersion } from '../../services/history/versionRestore';
import {
  Schedule,
  ScheduleVersion,
  Assignment,
  Nurse,
  DutyWindow,
  Doctor,
  DoctorSession,
  ClinicalRole,
  Specialty,
  LeaveEntry,
  LeaveType,
  SeniorityLevel,
  Rule,
} from '../../types';
import { computeScheduleDiff, ScheduleVersionDiff, type ChangeType } from '../../services/history/diffEngine';
import {
  filterVersions,
  versionKind,
  versionKindLabel,
  versionName,
  versionYears,
  type VersionFilters,
  type VersionKind,
} from '../../services/history/versionKinds';
import { VersionRoster, shiftTargetName } from '../history/VersionRoster';
import { VersionCompareModal } from '../modals/VersionCompareModal';
import { VersionViewModal } from '../modals/VersionViewModal';
import { ExportModal } from '../modals/ExportModal';
import { DeleteVersionModal } from '../modals/DeleteVersionModal';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import {
  Badge,
  Button,
  Card,
  DataTable,
  Dialog,
  EmptyState,
  ErrorState,
  Field,
  IconButton,
  Input,
  LoadingState,
  Notice,
  PageHeader,
  Select,
  TabPanel,
  Tabs,
  cx,
  type Column,
  type Tone,
} from '../ui';

interface HistoryViewProps {
  context: ClinicContextState;
}

const KIND_TONES: Record<VersionKind, Tone> = { SAVED: 'neutral', BACKUP: 'warning', PUBLISHED: 'success' };

const CHANGE_WORDS: Record<ChangeType, { word: string; tone: Tone }> = {
  ADDED: { word: 'Added', tone: 'success' },
  REMOVED: { word: 'Removed', tone: 'danger' },
  MODIFIED: { word: 'Changed', tone: 'info' },
};

const NO_FILTERS: VersionFilters = { kind: 'ALL', year: 'ALL', search: '', order: 'NEWEST' };

type StudioTab = 'ROSTER' | 'CHANGES' | 'SHIFTS' | 'DETAILS';

export const HistoryView: React.FC<HistoryViewProps> = ({ context }) => {
  // Restore and delete need a planner (firestore.rules refuses everyone else). Downloads are kept
  // to planners and managers: a screen choice, since the rules let approved users read this data.
  const { canEdit, canExport } = usePermissions();
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [versions, setVersions] = useState<ScheduleVersion[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [dutyWindows, setDutyWindows] = useState<DutyWindow[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [sessions, setSessions] = useState<DoctorSession[]>([]);
  const [roles, setClinicalRoles] = useState<ClinicalRole[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [leaveEntries, setLeaveEntries] = useState<LeaveEntry[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [seniorityLevels, setSeniorityLevels] = useState<SeniorityLevel[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);

  const [filters, setFilters] = useState<VersionFilters>(NO_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [studioTab, setStudioTab] = useState<StudioTab>('ROSTER');


  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareBaseId, setCompareBaseId] = useState<string | undefined>(undefined);
  const [compareTargetId, setCompareTargetId] = useState<string | undefined>(undefined);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<ScheduleVersion | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<ScheduleVersion | null>(null);

  const repo = getRepository();

  const loadData = async () => {
    try {
      const [schedList, asgnList, vList, nList, dwList, dList, sessList, crList, spList, leList, ltList, sList, rList] =
        await Promise.all([
          repo.list('schedules'),
          repo.list('assignments'),
          repo.list('versions'),
          repo.list('nurses'),
          repo.list('dutyWindows'),
          repo.list('doctors'),
          repo.list('doctorSessions'),
          repo.list('clinicalRoles'),
          repo.list('specialties'),
          repo.list('leaveEntries'),
          repo.list('leaveTypes'),
          repo.list('seniorityLevels'),
          repo.list('rules'),
        ]);
      setSchedules(Array.from(new Map(schedList.map((s) => [s.id, s])).values()));
      setAllAssignments(asgnList);
      setVersions(vList);
      setNurses(nList);
      setDutyWindows(dwList);
      setDoctors(dList);
      setSessions(sessList);
      setClinicalRoles(crList);
      setSpecialties(spList);
      setLeaveEntries(leList);
      setLeaveTypes(ltList);
      setSeniorityLevels(sList);
      setRules(rList);
      setLoadState('ready');
    } catch (err) {
      console.error('Error loading History:', err);
      setLoadState('failed');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const shown = useMemo(() => filterVersions(versions, filters), [versions, filters]);
  const years = useMemo(() => versionYears(versions), [versions]);
  const filtered = filters.kind !== 'ALL' || filters.year !== 'ALL' || filters.search.trim() !== '';

  // The version open on the right: the one picked, or else the first one in the list.
  const selectedVersion = shown.find((v) => v.id === selectedId) || shown[0] || null;
  const selectedIndex = selectedVersion ? shown.indexOf(selectedVersion) : -1;
  const prevVersion = selectedIndex > 0 ? shown[selectedIndex - 1] : null;
  const nextVersion = selectedIndex >= 0 && selectedIndex < shown.length - 1 ? shown[selectedIndex + 1] : null;

  const scheduleMap = useMemo(() => new Map(schedules.map((s) => [s.id, s])), [schedules]);
  // The roster of the version open on the right, as it is now, and its shifts now.
  const roster = selectedVersion ? scheduleMap.get(selectedVersion.scheduleId) || null : null;
  const rosterAssignments = useMemo(
    () => (selectedVersion ? allAssignments.filter((a) => a.scheduleId === selectedVersion.scheduleId) : []),
    [allAssignments, selectedVersion]
  );
  const effectiveSchedule = selectedVersion?.snapshot.schedule || roster;

  /** The roster's current version (backups have no number, so never). */
  const isCurrent = (v: ScheduleVersion) => v.kind !== 'BACKUP' && v.number === scheduleMap.get(v.scheduleId)?.activeVersionNumber;

  const pick = (v: ScheduleVersion) => setSelectedId(v.id);

  const askRestore = (v: ScheduleVersion) => {
    if (v.kind === 'BACKUP') {
      notify('Automatic backups are restored from the roster screen: More, then Backup copies.', 'info');
      return;
    }
    setVersionToRestore(v);
  };

  // A version goes back into its own roster (History lists every roster's versions).
  const handleConfirmRestore = async () => {
    if (!versionToRestore || isRestoring) return;
    setIsRestoring(true);
    try {
      const result = await restoreVersion(repo, versionToRestore, context.currentUser?.name || context.currentUser?.email || 'Planner');
      notify(
        `Version ${versionToRestore.number} of ${result.schedule.name} restored as version ${result.newVersionNumber}. A backup of the shifts before it was kept.`,
        'success'
      );
      setVersionToRestore(null);
      await loadData();
    } catch (err: any) {
      notify(`The version could not be restored: ${err.message}`, 'error');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleConfirmDelete = async (ver: ScheduleVersion) => {
    try {
      await repo.remove('versions', ver.id);
      await repo.create('audit', {
        scheduleId: ver.scheduleId,
        actor: context.currentUser?.name || 'Planner',
        action: 'DELETE',
        entity: 'ScheduleVersion',
        entityId: ver.id,
        note: `Deleted ${versionName(ver).toLowerCase()} of ${ver.snapshot?.schedule?.name || 'a roster'} ("${ver.note || 'no note'}")`,
        timestamp: new Date().toISOString(),
      });
      setVersions((list) => list.filter((v) => v.id !== ver.id));
      if (selectedId === ver.id) setSelectedId(null);
      setVersionToDelete(null);
      notify(`${versionName(ver)} deleted.`, 'success');
    } catch (err: any) {
      console.error('Delete failed:', err);
      notify(`The version could not be deleted: ${err.message || 'unknown error'}`, 'error');
    }
  };

  const openCompare = (base: ScheduleVersion) => {
    setCompareBaseId(base.id);
    setCompareTargetId('DRAFT');
    setIsCompareOpen(true);
  };

  // What changed from the version open on the right to its roster now.
  const diff: ScheduleVersionDiff | null = useMemo(() => {
    if (!selectedVersion) return null;
    return computeScheduleDiff(
      selectedVersion.snapshot.assignments || [],
      rosterAssignments,
      nurses,
      dutyWindows,
      doctors,
      roles,
      specialties,
      versionName(selectedVersion),
      'The roster now'
    );
  }, [selectedVersion, rosterAssignments, nurses, dutyWindows, doctors, roles, specialties]);

  const dutyMap = useMemo(() => new Map(dutyWindows.map((d) => [d.id, d])), [dutyWindows]);
  const nurseMap = useMemo(() => new Map(nurses.map((n) => [n.id, n])), [nurses]);
  const doctorMap = useMemo(() => new Map(doctors.map((d) => [d.id, d])), [doctors]);
  const roleMap = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);
  const specialtyMap = useMemo(() => new Map(specialties.map((s) => [s.id, s])), [specialties]);

  const shiftTarget = (a: Assignment) => shiftTargetName(a, { doctors: doctorMap, roles: roleMap, specialties: specialtyMap });

  const shiftColumns: Column<Assignment>[] = [
    { key: 'date', header: 'Date', cell: (a) => formatDate(a.date), sortValue: (a) => a.date },
    {
      key: 'nurse',
      header: 'Nurse',
      cell: (a) => <span className="font-medium text-ink">{nurseMap.get(a.nurseId)?.fullName || 'A nurse no longer listed'}</span>,
      sortValue: (a) => nurseMap.get(a.nurseId)?.fullName || '',
      phone: 'title',
    },
    {
      key: 'shift',
      header: 'Shift',
      cell: (a) => {
        const duty = dutyMap.get(a.dutyWindowId);
        return duty ? `${duty.acronym}, ${duty.name}` : 'A shift no longer listed';
      },
      sortValue: (a) => dutyMap.get(a.dutyWindowId)?.name || '',
    },
    { key: 'for', header: 'With', cell: (a) => shiftTarget(a) || 'Not set', sortValue: (a) => shiftTarget(a) },
    {
      key: 'pinned',
      header: 'Pinned',
      cell: (a) => (a.locked ? <Badge tone="warning" icon={Lock}>Pinned</Badge> : <span className="text-ink-muted">No</span>),
      sortValue: (a) => (a.locked ? 1 : 0),
    },
  ];

  const changeColumns: Column<ScheduleVersionDiff['allChanges'][number]>[] = [
    { key: 'date', header: 'Date', cell: (c) => formatDate(c.date), sortValue: (c) => c.date },
    { key: 'nurse', header: 'Nurse', cell: (c) => <span className="font-medium text-ink">{c.nurseName}</span>, sortValue: (c) => c.nurseName, phone: 'title' },
    {
      key: 'change',
      header: 'Change',
      cell: (c) => <Badge tone={CHANGE_WORDS[c.changeType].tone}>{CHANGE_WORDS[c.changeType].word}</Badge>,
      sortValue: (c) => CHANGE_WORDS[c.changeType].word,
    },
    {
      key: 'before',
      header: selectedVersion ? `In ${versionName(selectedVersion).toLowerCase()}` : 'Before',
      cell: (c) => (c.before ? `${c.before.dutyAcronym}, ${c.before.targetName}` : 'No shift'),
    },
    { key: 'after', header: 'On the roster now', cell: (c) => (c.after ? `${c.after.dutyAcronym}, ${c.after.targetName}` : 'No shift') },
  ];

  const kindCount = (kind: VersionKind) => versions.filter((v) => versionKind(v) === kind).length;
  const restoreRoster = versionToRestore ? scheduleMap.get(versionToRestore.scheduleId) : undefined;
  const restoreShiftCount = versionToRestore?.snapshot?.assignments?.length || 0;

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6">
      <PageHeader
        title="History"
        meta={
          <span>
            Saved copies, automatic backups and published versions of every roster
            {loadState === 'ready' && `: ${versions.length} in all`}
          </span>
        }
        actions={
          selectedVersion && (
            <Button icon={Diff} onClick={() => openCompare(selectedVersion)}>
              Compare versions
            </Button>
          )
        }
      />

      {loadState === 'loading' && <LoadingState label="Loading History…" />}
      {loadState === 'failed' && (
        <ErrorState
          title="History could not be loaded"
          onRetry={() => {
            setLoadState('loading');
            loadData();
          }}
        />
      )}

      {loadState === 'ready' && versions.length === 0 && (
        <Card>
          <EmptyState icon={History} title="Nothing saved yet">
            A roster's saved copies, automatic backups and published versions are listed here. Keep a copy from the roster screen (More, then Keep a
            copy), or publish a roster.
          </EmptyState>
        </Card>
      )}

      {loadState === 'ready' && versions.length > 0 && (
        <>
          {/* One set of filters for the whole screen. */}
          <div role="search" aria-label="Filter History" className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-surface p-3 shadow-card lg:grid-cols-4">
            <Field label="Search" className="col-span-2 lg:col-span-1">
              {(f) => (
                <div className="relative">
                  <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted" />
                  <Input
                    {...f}
                    type="search"
                    className="pl-8"
                    placeholder="Note, person or roster"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              )}
            </Field>
            <Field label="Kind">
              {(f) => (
                <Select {...f} value={filters.kind} onChange={(e) => setFilters({ ...filters, kind: e.target.value as VersionFilters['kind'] })}>
                  <option value="ALL">All kinds ({versions.length})</option>
                  <option value="SAVED">Saved copies ({kindCount('SAVED')})</option>
                  <option value="BACKUP">Automatic backups ({kindCount('BACKUP')})</option>
                  <option value="PUBLISHED">Published versions ({kindCount('PUBLISHED')})</option>
                </Select>
              )}
            </Field>
            <Field label="Year">
              {(f) => (
                <Select {...f} value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
                  <option value="ALL">All years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Order">
              {(f) => (
                <Select {...f} value={filters.order} onChange={(e) => setFilters({ ...filters, order: e.target.value as VersionFilters['order'] })}>
                  <option value="NEWEST">Newest first</option>
                  <option value="OLDEST">Oldest first</option>
                </Select>
              )}
            </Field>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            {/* The list: each item is one button; the actions are beside the version open on the right. */}
            <section aria-labelledby="history-list-heading" className="overflow-hidden rounded-lg border border-line bg-surface shadow-card min-w-0 lg:col-span-4">
              <header className="flex min-h-12 items-center justify-between gap-2 border-b border-line px-4 py-2">
                <h2 id="history-list-heading" className="text-base font-semibold text-ink">
                  Versions
                </h2>
                <span className="text-sm text-ink-muted" aria-live="polite">
                  {filtered ? `${shown.length} of ${versions.length}` : `${versions.length}`}
                </span>
              </header>
              {shown.length === 0 ? (
                <EmptyState
                  title="No versions match these filters"
                  action={
                    <Button size="sm" onClick={() => setFilters(NO_FILTERS)}>
                      Clear the filters
                    </Button>
                  }
                />
              ) : (
                <ul className="max-h-[42rem] divide-y divide-line overflow-y-auto" aria-label="Versions">
                  {shown.map((ver) => {
                    const kind = versionKind(ver);
                    const selected = selectedVersion?.id === ver.id;
                    const shiftCount = ver.snapshot.assignments?.length || 0;
                    return (
                      <li key={ver.id}>
                        <button
                          type="button"
                          onClick={() => pick(ver)}
                          aria-current={selected ? 'true' : undefined}
                          className={cx(
                            'block w-full border-l-4 px-4 py-3 text-left transition-colors',
                            selected ? 'border-l-brand bg-brand-soft' : 'border-l-transparent hover:bg-sunken'
                          )}
                        >
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-ink">{versionName(ver)}</span>
                            {kind !== 'BACKUP' && <Badge tone={KIND_TONES[kind]}>{versionKindLabel(kind)}</Badge>}
                            {isCurrent(ver) && <Badge tone="brand">Current</Badge>}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-ink">{ver.snapshot?.schedule?.name || 'A roster'}</span>
                          {ver.note && <span className="mt-0.5 line-clamp-2 block text-sm text-ink-muted">{ver.note}</span>}
                          <span className="mt-1 block text-xs text-ink-muted">
                            {formatDateTime(ver.timestamp)}, {ver.author || 'a planner'}, {shiftCount} {shiftCount === 1 ? 'shift' : 'shifts'}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* The version open on the right. */}
            <div className="min-w-0 lg:col-span-8">
              {selectedVersion ? (
                <section aria-labelledby="history-version-heading" className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
                  <header className="space-y-3 border-b border-line p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 id="history-version-heading" className="text-lg font-semibold text-ink">
                          {versionName(selectedVersion)} of {effectiveSchedule?.name || 'a roster'}
                        </h2>
                        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
                          <Badge tone={KIND_TONES[versionKind(selectedVersion)]}>{versionKindLabel(versionKind(selectedVersion))}</Badge>
                          {isCurrent(selectedVersion) && <Badge tone="brand">Current</Badge>}
                          <span>
                            {selectedVersion.kind === 'BACKUP' ? 'Kept' : 'Saved'} by {selectedVersion.author || 'a planner'} on{' '}
                            {formatDateTime(selectedVersion.timestamp)}
                          </span>
                        </p>
                        {selectedVersion.note && <p className="mt-1 text-sm text-ink">{selectedVersion.note}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <IconButton
                          label={prevVersion ? `Previous in the list: ${versionName(prevVersion)}` : 'Previous in the list'}
                          icon={ChevronLeft}
                          disabled={!prevVersion}
                          onClick={() => prevVersion && pick(prevVersion)}
                        />
                        <IconButton
                          label={nextVersion ? `Next in the list: ${versionName(nextVersion)}` : 'Next in the list'}
                          icon={ChevronRight}
                          disabled={!nextVersion}
                          onClick={() => nextVersion && pick(nextVersion)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" icon={Maximize2} onClick={() => setIsViewOpen(true)}>
                        Open larger
                      </Button>
                      {canExport && (
                        <Button size="sm" icon={Download} onClick={() => setIsExportOpen(true)}>
                          Download
                        </Button>
                      )}
                      {canEdit && selectedVersion.kind !== 'BACKUP' && roster && (
                        <Button size="sm" variant="primary" icon={RotateCcw} onClick={() => askRestore(selectedVersion)}>
                          Restore
                        </Button>
                      )}
                      {canEdit && (
                        <Button size="sm" icon={Trash2} className="text-danger" onClick={() => setVersionToDelete(selectedVersion)}>
                          Delete
                        </Button>
                      )}
                    </div>
                    {selectedVersion.kind === 'BACKUP' && canEdit && roster && (
                      <Notice tone="info" title="Restore it from the roster screen">
                        Automatic backups are restored from the roster screen (More, then Backup copies), where the restore can be undone.
                      </Notice>
                    )}
                    {!roster && (
                      <Notice tone="warning" title="The roster has been deleted">
                        This version can be looked at but not restored.
                      </Notice>
                    )}
                  </header>

                  <Tabs
                    label="Parts of this version"
                    idPrefix="history"
                    value={studioTab}
                    onChange={(id) => setStudioTab(id as StudioTab)}
                    className="px-4"
                    tabs={[
                      { id: 'ROSTER', label: 'Roster' },
                      { id: 'CHANGES', label: 'What changed', count: diff?.totalChangesCount ?? 0 },
                      { id: 'SHIFTS', label: 'Shifts', count: selectedVersion.snapshot.assignments?.length || 0 },
                      { id: 'DETAILS', label: 'Details' },
                    ]}
                  />

                  <TabPanel idPrefix="history" id="ROSTER" value={studioTab} className="p-4">
                    <VersionRoster
                      key={selectedVersion.id}
                      version={selectedVersion}
                      nurses={nurses}
                      dutyWindows={dutyWindows}
                      doctors={doctors}
                      roles={roles}
                      specialties={specialties}
                      leaveTypes={leaveTypes}
                      seniorityLevels={seniorityLevels}
                    />
                  </TabPanel>

                  <TabPanel idPrefix="history" id="CHANGES" value={studioTab} className="space-y-4 p-4">
                    {diff && (
                      <>
                        <p className="text-sm text-ink-muted">
                          What changed on {effectiveSchedule?.name || 'the roster'} since this version was{' '}
                          {selectedVersion.kind === 'BACKUP' ? 'kept' : 'saved'}.
                        </p>
                        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {[
                            { label: 'Changes', value: diff.totalChangesCount },
                            { label: 'Shifts added', value: diff.addedCount },
                            { label: 'Shifts removed', value: diff.removedCount },
                            { label: 'Shifts changed', value: diff.modifiedCount },
                          ].map((s) => (
                            <div key={s.label} className="rounded-lg border border-line bg-sunken p-3">
                              <dt className="text-sm text-ink-muted">{s.label}</dt>
                              <dd className="text-xl font-semibold text-ink tabular-nums">{s.value}</dd>
                            </div>
                          ))}
                        </dl>
                        {diff.totalChangesCount > 0 ? (
                          <DataTable
                            caption={`Changes since ${versionName(selectedVersion).toLowerCase()}`}
                            rows={diff.allChanges}
                            rowKey={(c) => c.id}
                            columns={changeColumns}
                            initialSort={{ key: 'date', direction: 'ascending' }}
                            maxHeight="28rem"
                          />
                        ) : (
                          <Notice tone="success" title="Nothing has changed">
                            The roster's shifts are the same as in this version.
                          </Notice>
                        )}
                        <div className="flex justify-end">
                          <Button size="sm" icon={Diff} onClick={() => openCompare(selectedVersion)}>
                            Compare side by side
                          </Button>
                        </div>
                      </>
                    )}
                  </TabPanel>

                  <TabPanel idPrefix="history" id="SHIFTS" value={studioTab} className="p-4">
                    <DataTable
                      caption={`Shifts in ${versionName(selectedVersion).toLowerCase()}`}
                      rows={selectedVersion.snapshot.assignments || []}
                      rowKey={(a) => a.id}
                      columns={shiftColumns}
                      initialSort={{ key: 'date', direction: 'ascending' }}
                      maxHeight="32rem"
                      empty={<EmptyState title="No shifts">This version was kept before any shifts were on the roster.</EmptyState>}
                    />
                  </TabPanel>

                  <TabPanel idPrefix="history" id="DETAILS" value={studioTab} className="p-4">
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        { label: 'Roster', value: effectiveSchedule?.name || 'Not known' },
                        {
                          label: 'Roster dates',
                          value: effectiveSchedule ? `${formatDate(effectiveSchedule.startDate)} to ${formatDate(effectiveSchedule.endDate)}` : 'Not known',
                        },
                        { label: 'Kind', value: versionKindLabel(versionKind(selectedVersion)) },
                        {
                          label: "The roster's current version",
                          value: roster ? `Version ${roster.activeVersionNumber || 1}` : 'The roster has been deleted',
                        },
                        { label: 'Shifts', value: selectedVersion.snapshot.assignments?.length || 0 },
                        { label: 'Leave entries', value: selectedVersion.snapshot.leaveEntries?.length || 0 },
                        { label: 'Pinned days', value: selectedVersion.snapshot.locks?.length || 0 },
                        ...(selectedVersion.publishedAt ? [{ label: 'Published', value: formatDateTime(selectedVersion.publishedAt) }] : []),
                      ].map((d) => (
                        <div key={d.label} className="rounded-lg border border-line p-3">
                          <dt className="text-sm text-ink-muted">{d.label}</dt>
                          <dd className="font-semibold text-ink">{d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </TabPanel>
                </section>
              ) : (
                <Card>
                  <EmptyState title="No version open">Pick a version from the list to see its shifts.</EmptyState>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

      <Dialog
        open={!!versionToRestore}
        onClose={() => !isRestoring && setVersionToRestore(null)}
        title="Restore this version?"
        footer={
          <>
            <Button disabled={isRestoring} onClick={() => setVersionToRestore(null)}>
              Cancel
            </Button>
            <Button variant="primary" icon={RotateCcw} busy={isRestoring} disabled={!restoreRoster} onClick={handleConfirmRestore}>
              Restore
            </Button>
          </>
        }
      >
        {versionToRestore && (
          <div className="space-y-3 text-sm">
            {restoreRoster ? (
              <>
                <p>
                  The shifts of <strong>{restoreRoster.name}</strong> are replaced by the {restoreShiftCount}{' '}
                  {restoreShiftCount === 1 ? 'shift' : 'shifts'} in version {versionToRestore.number}, and version{' '}
                  {(restoreRoster.activeVersionNumber || 1) + 1} records the restore.
                </p>
                <p className="text-ink-muted">
                  A backup of the shifts as they are now is kept first, so you can go back (roster screen, More, then Backup copies). Pinned days
                  and leave are not changed.
                </p>
              </>
            ) : (
              <Notice tone="warning" title="The roster has been deleted">
                This version cannot be restored.
              </Notice>
            )}
          </div>
        )}
      </Dialog>

      <DeleteVersionModal
        isOpen={!!versionToDelete}
        version={versionToDelete}
        scheduleName={versionToDelete?.snapshot?.schedule?.name || 'the roster'}
        isCurrentActiveDraft={!!versionToDelete && isCurrent(versionToDelete)}
        onClose={() => setVersionToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      {selectedVersion && (
        <VersionCompareModal
          schedule={roster}
          // Only the versions of the same roster can be compared with each other.
          versions={versions.filter((v) => v.scheduleId === selectedVersion.scheduleId)}
          activeAssignments={rosterAssignments}
          nurses={nurses}
          dutyWindows={dutyWindows}
          doctors={doctors}
          roles={roles}
          specialties={specialties}
          initialBaseVersionId={compareBaseId}
          initialTargetVersionId={compareTargetId}
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          canDownload={canExport}
          onRestoreVersion={
            canEdit
              ? (v) => {
                  setIsCompareOpen(false);
                  askRestore(v);
                }
              : undefined
          }
        />
      )}

      <VersionViewModal
        version={isViewOpen ? selectedVersion : null}
        schedule={roster}
        nurses={nurses}
        dutyWindows={dutyWindows}
        doctors={doctors}
        roles={roles}
        specialties={specialties}
        leaveTypes={leaveTypes}
        seniorityLevels={seniorityLevels}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        onRestore={
          canEdit && selectedVersion?.kind !== 'BACKUP' && roster
            ? (v) => {
                setIsViewOpen(false);
                askRestore(v);
              }
            : undefined
        }
        onDelete={
          canEdit
            ? (v) => {
                setIsViewOpen(false);
                setVersionToDelete(v);
              }
            : undefined
        }
      />

      {selectedVersion && effectiveSchedule && (
        <ExportModal
          clinicName={context.clinicName}
          schedule={effectiveSchedule}
          assignments={selectedVersion.snapshot.assignments || []}
          nurses={nurses}
          dutyWindows={dutyWindows}
          leaveEntries={selectedVersion.snapshot.leaveEntries || leaveEntries}
          leaveTypes={leaveTypes}
          seniorityLevels={seniorityLevels}
          doctors={doctors}
          sessions={sessions}
          roles={roles}
          specialties={specialties}
          rules={selectedVersion.snapshot.rulesSnapshot || rules}
          versionNumber={selectedVersion.number}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
};
