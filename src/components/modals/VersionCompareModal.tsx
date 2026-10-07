/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Compare dialog: what changed between two saved versions of a roster (or the roster now).
 */

import React, { useState, useMemo, useEffect, useId } from 'react';
import {
  X,
  Diff,
  ArrowRight,
  Filter,
  Search,
  Download,
  RotateCcw,
  CheckCircle2,
  Calendar,
  User,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';
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
} from '../../services/history/diffEngine';
import { toCsv, downloadCsv, CsvValue } from '../../utils/csv';
import { useDialogA11y } from '../common/useDialogA11y';
import { formatDate } from '../../utils/dateUtils';

const CHANGE_LABELS: Record<string, string> = { ADDED: 'Added', REMOVED: 'Removed', MODIFIED: 'Changed' };

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

    const baseLabel = baseId === 'DRAFT' ? 'Roster now' : `Version ${baseVer?.number || '?'}`;
    const targetLabel = targetId === 'DRAFT' ? 'Roster now' : `Version ${targetVer?.number || '?'}`;

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

  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen && !!schedule, onClose);

  if (!isOpen || !schedule) return null;

  const filteredChanges = diffResult.allChanges.filter((item) => {
    const matchesSearch =
      item.nurseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      changeTypeFilter === 'ALL' || item.changeType === changeTypeFilter;

    const matchesNurse =
      nurseFilter === 'ALL' || item.nurseId === nurseFilter;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs"
      >
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Diff className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="text-base font-bold text-slate-900">Compare versions</h2>
              </div>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Shows every shift that was added, removed or changed between two versions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canDownload && (
            <button
              type="button"
              onClick={handleExportDiffCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>Download changes (CSV)</span>
            </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Version Pickers Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Base Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">From:</span>
              <select
                aria-label="Compare from (older version)"
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    Version {v.number} — {v.note || 'no note'} ({new Date(v.timestamp).toLocaleDateString()})
                  </option>
                ))}
                <option value="DRAFT">Roster now (not saved as a version)</option>
              </select>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />

            {/* Target Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">To:</span>
              <select
                aria-label="Compare to (newer version)"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
              >
                <option value="DRAFT">Roster now (not saved as a version)</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    Version {v.number} — {v.note || 'no note'} ({new Date(v.timestamp).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-bold">
              {diffResult.totalChangesCount} change{diffResult.totalChangesCount === 1 ? '' : 's'}
            </span>
            <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-bold">
              {diffResult.addedCount} added
            </span>
            <span className="px-2 py-1 rounded bg-rose-50 text-rose-700 font-bold">
              {diffResult.removedCount} removed
            </span>
            <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-bold">
              {diffResult.modifiedCount} changed
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-1 items-center gap-2 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                aria-label="Search changes"
                placeholder="Search by nurse, date or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Nurse:</span>
              <select
                aria-label="Filter by nurse"
                value={nurseFilter}
                onChange={(e) => setNurseFilter(e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-700"
              >
                <option value="ALL">All nurses</option>
                {nurses.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Change:</span>
              <select
                aria-label="Filter by change type"
                value={changeTypeFilter}
                onChange={(e) => setChangeTypeFilter(e.target.value as any)}
                className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-700"
              >
                <option value="ALL">All changes ({diffResult.totalChangesCount})</option>
                <option value="MODIFIED">Changed only ({diffResult.modifiedCount})</option>
                <option value="ADDED">Added only ({diffResult.addedCount})</option>
                <option value="REMOVED">Removed only ({diffResult.removedCount})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table of Changes */}
        <div className="flex-1 overflow-y-auto">
          {filteredChanges.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-100 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-3">Nurse</th>
                  <th className="py-2.5 px-3">Change</th>
                  <th className="py-2.5 px-3">Before ({diffResult.baseVersionLabel})</th>
                  <th className="py-2.5 px-2 text-center"><span className="sr-only">to</span></th>
                  <th className="py-2.5 px-3">After ({diffResult.targetVersionLabel})</th>
                  <th className="py-2.5 px-4 text-right">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredChanges.map((change) => {
                  const isMod = change.changeType === 'MODIFIED';
                  const isAdd = change.changeType === 'ADDED';
                  const isRem = change.changeType === 'REMOVED';

                  return (
                    <tr
                      key={change.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isAdd
                          ? 'bg-emerald-50/20'
                          : isRem
                          ? 'bg-rose-50/20'
                          : 'bg-indigo-50/15'
                      }`}
                    >
                      <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <span>{formatDate(change.date)}</span>
                        <span className="text-slate-400 font-normal ml-1">({change.weekday})</span>
                      </td>

                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                        {change.nurseName}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isAdd
                              ? 'bg-emerald-100 text-emerald-800'
                              : isRem
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {CHANGE_LABELS[change.changeType] || change.changeType}
                        </span>
                      </td>

                      {/* Before State */}
                      <td className="py-2.5 px-3">
                        {change.before ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="px-1.5 py-0.5 rounded text-white font-bold text-[10px]"
                              style={{ backgroundColor: change.before.dutyColor }}
                            >
                              {change.before.dutyAcronym}
                            </span>
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                {change.before.targetName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {change.before.dutyTimes}
                              </span>
                            </div>
                            {change.before.locked && (
                              <Lock className="w-3 h-3 text-amber-600 ml-1" aria-label="Pinned day" />
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None / Off</span>
                        )}
                      </td>

                      {/* Arrow */}
                      <td className="py-2.5 px-2 text-center text-slate-400">
                        <ArrowRight className="w-3.5 h-3.5 mx-auto" />
                      </td>

                      {/* After State */}
                      <td className="py-2.5 px-3">
                        {change.after ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="px-1.5 py-0.5 rounded text-white font-bold text-[10px]"
                              style={{ backgroundColor: change.after.dutyColor }}
                            >
                              {change.after.dutyAcronym}
                            </span>
                            <div>
                              <span className="font-semibold text-slate-900 block">
                                {change.after.targetName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {change.after.dutyTimes}
                              </span>
                            </div>
                            {change.after.locked && (
                              <Lock className="w-3 h-3 text-amber-600 ml-1" aria-label="Pinned day" />
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None / Off</span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-2.5 px-4 text-right font-sans text-[11px] text-slate-600">
                        {change.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" aria-hidden="true" />
              {diffResult.totalChangesCount === 0 ? (
                <>
                  <p className="font-medium text-slate-700">No differences.</p>
                  <p className="text-[11px]">Both versions have exactly the same shifts.</p>
                </>
              ) : (
                <p className="font-medium text-slate-700">No changes match your search or filters.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Showing {filteredChanges.length} of {diffResult.totalChangesCount} changes
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
