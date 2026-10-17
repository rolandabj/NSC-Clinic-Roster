/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Compare dialog: what changed between two saved versions of a roster (or the roster now).
 * On the shared Dialog since Phase 7, slice 5b.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Download, Lock, RotateCcw } from 'lucide-react';
import {
  ScheduleVersion,
  Assignment,
  Nurse,
  DutyWindow,
  Doctor,
  ClinicalRole,
  Specialty,
  Schedule,
} from '../../types';
import {
  computeScheduleDiff,
  ScheduleVersionDiff,
  AssignmentDiffItem,
  type ChangeType,
} from '../../services/history/diffEngine';
import { toCsv, downloadCsv, CsvValue } from '../../utils/csv';
import { formatDate } from '../../utils/dateUtils';
import { readableTextOn } from '../../utils/colorContrast';
import { versionName } from '../../services/history/versionKinds';
import { Badge, Button, DataTable, Dialog, Field, Input, Notice, Select, type Column, type Tone } from '../ui';

const CHANGE_LABELS: Record<ChangeType, string> = { ADDED: 'Added', REMOVED: 'Removed', MODIFIED: 'Changed' };
const CHANGE_TONES: Record<ChangeType, Tone> = { ADDED: 'success', REMOVED: 'danger', MODIFIED: 'info' };

interface VersionCompareModalProps {
  // History mounts this dialog before its async roster lookup has finished.
  schedule?: Schedule | null;
  versions: ScheduleVersion[];
  activeAssignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  doctors: Doctor[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  initialBaseVersionId?: string;
  initialTargetVersionId?: string;
  isOpen: boolean;
  onClose: () => void;
  onRestoreVersion?: (version: ScheduleVersion) => void;
  /** Shows "Download changes (CSV)": planners and managers (History passes canExport). */
  canDownload?: boolean;
}

export const VersionCompareModal: React.FC<VersionCompareModalProps> = ({
  schedule,
  versions,
  activeAssignments,
  nurses,
  dutyWindows,
  doctors,
  roles,
  specialties,
  initialBaseVersionId,
  initialTargetVersionId,
  isOpen,
  onClose,
  onRestoreVersion,
  canDownload = true,
}) => {
  // 'DRAFT' represents active current draft
  const [baseId, setBaseId] = useState<string>(() => {
    if (initialBaseVersionId) return initialBaseVersionId;
    if (versions.length > 1) return versions[1].id;
    if (versions.length === 1) return versions[0].id;
    return 'DRAFT';
  });

  const [targetId, setTargetId] = useState<string>(() => {
    if (initialTargetVersionId) return initialTargetVersionId;
    return 'DRAFT';
  });

  // The modal stays mounted, so the versions to compare are set again each time it opens
  // (and when the roster's versions change): by default the latest published one against now.
  useEffect(() => {
    if (!isOpen || !schedule) return;
    const known = (id?: string) => !!id && (id === 'DRAFT' || versions.some((v) => v.id === id));
    const latestPublished = [...versions].filter((v) => v.isPublished).sort((a, b) => b.number - a.number)[0];
    setBaseId(known(initialBaseVersionId) ? initialBaseVersionId! : latestPublished?.id || versions[0]?.id || 'DRAFT');
    setTargetId(known(initialTargetVersionId) ? initialTargetVersionId! : 'DRAFT');
  }, [isOpen, initialBaseVersionId, initialTargetVersionId, schedule?.id, versions.length]);

  const [searchQuery, setSearchQuery] = useState('');
  const [changeTypeFilter, setChangeTypeFilter] = useState<'ALL' | 'ADDED' | 'REMOVED' | 'MODIFIED'>('ALL');
  const [nurseFilter, setNurseFilter] = useState<string>('ALL');

  // Compute diff
  const diffResult: ScheduleVersionDiff = useMemo(() => {
    const baseVer = versions.find((v) => v.id === baseId);
    const targetVer = versions.find((v) => v.id === targetId);

    const baseAsgns = baseId === 'DRAFT' ? activeAssignments : baseVer?.snapshot.assignments || [];
    const targetAsgns = targetId === 'DRAFT' ? activeAssignments : targetVer?.snapshot.assignments || [];

    const label = (id: string, v?: ScheduleVersion) => (id === 'DRAFT' ? 'The roster now' : v ? versionName(v) : 'A version no longer kept');
    const baseLabel = label(baseId, baseVer);
    const targetLabel = label(targetId, targetVer);

    return computeScheduleDiff(
      baseAsgns,
      targetAsgns,
      nurses,
      dutyWindows,
      doctors,
      roles,
      specialties,
      baseLabel,
      targetLabel,
      baseVer?.number,
      targetVer?.number
    );
  }, [
    baseId,
    targetId,
    versions,
    activeAssignments,
    nurses,
    dutyWindows,
    doctors,
    roles,
    specialties,
  ]);

  if (!isOpen || !schedule) return null;

  const filteredChanges = diffResult.allChanges.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.nurseName.toLowerCase().includes(q) ||
      formatDate(item.date).includes(q) ||
      item.description.toLowerCase().includes(q);
    const matchesType = changeTypeFilter === 'ALL' || item.changeType === changeTypeFilter;
    const matchesNurse = nurseFilter === 'ALL' || item.nurseId === nurseFilter;
    return matchesSearch && matchesType && matchesNurse;
  });

  const handleExportDiffCsv = () => {
    const headers = [
      'Date',
      'Day of Week',
      'Nurse',
      'Change',
      'Shift before',
      'Times before',
      'Working with before',
      'Shift after',
      'Times after',
      'Working with after',
      'Summary',
    ];

    const rows: CsvValue[][] = [headers];
    diffResult.allChanges.forEach((c) => {
      rows.push([
        c.date,
        c.weekday,
        c.nurseName,
        CHANGE_LABELS[c.changeType] || c.changeType,
        c.before ? c.before.dutyAcronym : '',
        c.before ? c.before.dutyTimes : '',
        c.before ? c.before.targetName : '',
        c.after ? c.after.dutyAcronym : '',
        c.after ? c.after.dutyTimes : '',
        c.after ? c.after.targetName : '',
        c.description,
      ]);
    });

    downloadCsv(`changes-${diffResult.baseVersionLabel}-to-${diffResult.targetVersionLabel}.csv`.replace(/\s+/g, '-').toLowerCase(), toCsv(rows));
  };

  const shiftCell = (state: AssignmentDiffItem['before']) =>
    state ? (
      <span className="flex items-center gap-2">
        <span
          className="rounded px-1.5 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: state.dutyColor, color: readableTextOn(state.dutyColor) }}
        >
          {state.dutyAcronym}
        </span>
        <span>
          <span className="block text-ink">{state.targetName}</span>
          <span className="block text-xs text-ink-muted">{state.dutyTimes.replace(/\s*[-–]\s*/, ' to ')}</span>
        </span>
        {state.locked && <Lock aria-label="Pinned day" className="size-3.5 shrink-0 text-warning" />}
      </span>
    ) : (
      <span className="text-ink-muted">No shift</span>
    );

  const columnName = (label: string) => (label === 'The roster now' ? 'On the roster now' : `In ${label.toLowerCase()}`);
  const columns: Column<AssignmentDiffItem>[] = [
    {
      key: 'date',
      header: 'Date',
      cell: (c) => (
        <span className="whitespace-nowrap">
          {c.weekday} {formatDate(c.date)}
        </span>
      ),
      sortValue: (c) => c.date,
    },
    { key: 'nurse', header: 'Nurse', cell: (c) => <span className="font-medium text-ink">{c.nurseName}</span>, sortValue: (c) => c.nurseName, phone: 'title' },
    {
      key: 'change',
      header: 'Change',
      cell: (c) => <Badge tone={CHANGE_TONES[c.changeType]}>{CHANGE_LABELS[c.changeType]}</Badge>,
      sortValue: (c) => CHANGE_LABELS[c.changeType],
    },
    { key: 'before', header: columnName(diffResult.baseVersionLabel), cell: (c) => shiftCell(c.before) },
    { key: 'after', header: columnName(diffResult.targetVersionLabel), cell: (c) => shiftCell(c.after) },
  ];

  const optionLabel = (v: ScheduleVersion) =>
    `${versionName(v)}${v.note ? `, ${v.note}` : ''} (${formatDate(v.timestamp)})`;
  const baseVersion = versions.find((v) => v.id === baseId);
  const canRestoreBase = !!onRestoreVersion && !!baseVersion && baseVersion.kind !== 'BACKUP';

  return (
    <Dialog
      open
      onClose={onClose}
      size="xl"
      title="Compare versions"
      description={`Every shift of ${schedule.name} that was added, removed or changed between the two.`}
      footer={
        <>
          {canDownload && (
            <Button icon={Download} onClick={handleExportDiffCsv} className="sm:mr-auto">
              Download the changes (CSV)
            </Button>
          )}
          {canRestoreBase && (
            <Button icon={RotateCcw} onClick={() => onRestoreVersion!(baseVersion!)}>
              Restore {versionName(baseVersion!).toLowerCase()}
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="From">
            {(f) => (
              <Select {...f} value={baseId} onChange={(e) => setBaseId(e.target.value)}>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {optionLabel(v)}
                  </option>
                ))}
                <option value="DRAFT">The roster now</option>
              </Select>
            )}
          </Field>
          <Field label="To">
            {(f) => (
              <Select {...f} value={targetId} onChange={(e) => setTargetId(e.target.value)}>
                <option value="DRAFT">The roster now</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {optionLabel(v)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <p className="flex flex-wrap items-center gap-2" aria-live="polite">
          <Badge>
            {diffResult.totalChangesCount} {diffResult.totalChangesCount === 1 ? 'change' : 'changes'}
          </Badge>
          <Badge tone="success">{diffResult.addedCount} added</Badge>
          <Badge tone="danger">{diffResult.removedCount} removed</Badge>
          <Badge tone="info">{diffResult.modifiedCount} changed</Badge>
        </p>

        {diffResult.totalChangesCount === 0 ? (
          <Notice tone="success" title="No differences">
            Both have the same shifts.
          </Notice>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Search the changes">
                {(f) => (
                  <Input {...f} type="search" placeholder="Nurse, date or doctor" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                )}
              </Field>
              <Field label="Nurse">
                {(f) => (
                  <Select {...f} value={nurseFilter} onChange={(e) => setNurseFilter(e.target.value)}>
                    <option value="ALL">All nurses</option>
                    {nurses.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.fullName}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Change">
                {(f) => (
                  <Select {...f} value={changeTypeFilter} onChange={(e) => setChangeTypeFilter(e.target.value as typeof changeTypeFilter)}>
                    <option value="ALL">All changes ({diffResult.totalChangesCount})</option>
                    <option value="MODIFIED">Changed ({diffResult.modifiedCount})</option>
                    <option value="ADDED">Added ({diffResult.addedCount})</option>
                    <option value="REMOVED">Removed ({diffResult.removedCount})</option>
                  </Select>
                )}
              </Field>
            </div>
            <DataTable
              caption={`Changes from ${diffResult.baseVersionLabel.toLowerCase()} to ${diffResult.targetVersionLabel.toLowerCase()}`}
              rows={filteredChanges}
              rowKey={(c) => c.id}
              columns={columns}
              initialSort={{ key: 'date', direction: 'ascending' }}
              empty={<p className="px-4 py-8 text-center text-ink-muted">No changes match these filters.</p>}
            />
            <p className="text-ink-muted">
              Showing {filteredChanges.length} of {diffResult.totalChangesCount} changes
            </p>
          </>
        )}
      </div>
    </Dialog>
  );
};
