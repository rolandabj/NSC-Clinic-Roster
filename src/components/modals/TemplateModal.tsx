/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Templates dialog: save a roster's weekly pattern, fill a roster from a
 * saved template, or copy the weekly pattern of an earlier roster.
 */

import React, { useState, useEffect, useId } from 'react';
import {
  X,
  Layers,
  Copy,
  Save,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Schedule,
  Assignment,
  Nurse,
  DutyWindow,
  RosterTemplate,
  TemplateSlotPattern,
  LeaveEntry,
  LockEntry,
} from '../../types';
import { getRepository } from '../../services/repository';
import { useDialogA11y } from '../common/useDialogA11y';
import { notify, confirmDialog, type NoticeTone } from '../common/dialogs';
import { authService } from '../../services/auth/authService';

interface TemplateModalProps {
  schedule: Schedule;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  allSchedules: Schedule[];
  isOpen: boolean;
  onClose: () => void;
  onApplyAssignments: (updated: Assignment[], note: string) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  schedule,
  assignments,
  nurses,
  dutyWindows,
  leaveEntries,
  locks,
  allSchedules,
  isOpen,
  onClose,
  onApplyAssignments,
}) => {
  const [activeTab, setActiveTab] = useState<'SAVE' | 'APPLY' | 'COPY_PERIOD'>('SAVE');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<RosterTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedSourceScheduleId, setSelectedSourceScheduleId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const repo = getRepository();

  const loadTemplates = async () => {
    try {
      const list = await repo.list('templates');
      setSavedTemplates(list);
      if (list.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(list[0].id);
      }
    } catch (e) {
      console.error('Error loading templates:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      setTemplateName(`${schedule.name} weekly pattern`);
      const otherSchedules = allSchedules.filter((s) => s.id !== schedule.id);
      if (otherSchedules.length > 0) {
        setSelectedSourceScheduleId(otherSchedules[0].id);
      }
    }
  }, [isOpen, schedule.id]);

  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const triggerToast = (msg: string, tone: NoticeTone = 'success') => notify(msg, tone);

  // 1. SAVE CURRENT AS TEMPLATE
  const handleSaveAsTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    try {
      const patterns: TemplateSlotPattern[] = [];
      const seen = new Set<string>();

      for (const a of assignments) {
        const dObj = new Date(a.date);
        const weekday = dObj.getUTCDay();
        const key = `${a.nurseId}_${weekday}`;

        if (!seen.has(key)) {
          seen.add(key);
          patterns.push({
            nurseId: a.nurseId,
            weekday,
            dutyWindowId: a.dutyWindowId,
            kind: a.kind,
            targetRefId: a.doctorId || a.clinicalRoleId || a.specialtyId,
          });
        }
      }

      const newTemplate: RosterTemplate = {
        id: uuidv4(),
        name: templateName.trim(),
        description: templateDescription.trim(),
        patterns,
        sourceScheduleId: schedule.id,
        createdAt: new Date().toISOString(),
      };

      await repo.create('templates', newTemplate);
      triggerToast('Template saved.');
      loadTemplates();
      setActiveTab('APPLY');
    } catch (err: any) {
      notify(`Couldn't save the template: ${err.message}`, 'error');
    }
  };

  /** The signed in planner's name for the history log. */
  const actorName = () => {
    const user = authService.getCurrentUser();
    return user?.name || user?.email || 'Planner';
  };

  /**
   * Works out what filling the roster would do, without saving anything.
   * `shiftFor` gives the shift a nurse should have on a weekday, or nothing.
   * Pinned days, approved leave and shifts set by hand are kept; every other
   * existing shift is replaced.
   */
  const planFill = (
    shiftFor: (nurseId: string, weekday: number) => Omit<Assignment, 'id' | 'scheduleId' | 'nurseId' | 'date' | 'locked' | 'source'> | undefined
  ) => {
    const lockedNurseDates = new Set(locks.map((l) => `${l.nurseId}_${l.date}`));
    const leaveNurseDates = new Set(
      leaveEntries.filter((le) => le.approved).flatMap((le) => {
        const dates: string[] = [];
        const cur = new Date(le.startDate);
        const end = new Date(le.endDate);
        while (cur <= end) {
          dates.push(`${le.nurseId}_${cur.toISOString().split('T')[0]}`);
          cur.setUTCDate(cur.getUTCDate() + 1);
        }
        return dates;
      })
    );

    // Keep locked and manual assignments
    const kept = assignments.filter((a) => a.source === 'LOCK' || a.source === 'MANUAL' || a.locked);
    const keptKeys = new Set(kept.map((a) => `${a.nurseId}_${a.date}`));
    const replaced = assignments.length - kept.length;
    const knownDuties = new Set(dutyWindows.map((d) => d.id));
    const activeNurses = nurses.filter((n) => n.active !== false);

    const added: Assignment[] = [];
    const cur = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    while (cur <= end) {
      const dateStr = cur.toISOString().split('T')[0];
      const weekday = cur.getUTCDay();
      for (const nurse of activeNurses) {
        const key = `${nurse.id}_${dateStr}`;
        if (keptKeys.has(key) || lockedNurseDates.has(key) || leaveNurseDates.has(key)) continue;
        const shift = shiftFor(nurse.id, weekday);
        // Only weekdays the source gives this nurse, and only shifts that still exist.
        if (!shift || !knownDuties.has(shift.dutyWindowId)) continue;
        added.push({
          ...shift,
          id: uuidv4(),
          scheduleId: schedule.id,
          nurseId: nurse.id,
          date: dateStr,
          locked: false,
          source: 'GENERATED',
        });
      }
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    // Filled shifts that go: on a day that gets a new shift they are replaced,
    // otherwise they are only removed.
    const addedKeys = new Set(added.map((a) => `${a.nurseId}_${a.date}`));
    const dropped = assignments.filter((a) => !kept.includes(a));
    const replacedOnly = dropped.filter((a) => addedKeys.has(`${a.nurseId}_${a.date}`)).length;
    return {
      result: [...kept, ...added],
      added: added.length,
      nurseCount: new Set(added.map((a) => a.nurseId)).size,
      replaced,
      replacedOnly,
      removedOnly: dropped.length - replacedOnly,
    };
  };

  /** Asks before filling the roster, saying exactly how many shifts change. */
  const confirmFill = (plan: ReturnType<typeof planFill>, title: string) => {
    if (plan.added === 0 && plan.replaced === 0) {
      notify('There is nothing to fill: no nurse has a shift on these weekdays, or every day is already pinned, on leave or set by hand.', 'info');
      return Promise.resolve(false);
    }
    const fill = `This will fill ${plan.added} shift${plan.added === 1 ? '' : 's'} for ${plan.nurseCount} nurse${plan.nurseCount === 1 ? '' : 's'}`;
    const plural = (n: number) => `${n} shift${n === 1 ? '' : 's'}`;
    const replace =
      (plan.replacedOnly > 0 ? `, replacing ${plural(plan.replacedOnly)} filled in before` : '') +
      (plan.removedOnly > 0 ? `, and remove ${plural(plan.removedOnly)} filled in before on days it leaves empty` : '');
    return confirmDialog({
      title,
      message: `${fill}${replace}. Pinned days, leave and shifts you set by hand are kept.`,
      confirmLabel: 'Fill the roster',
      danger: plan.replaced > 0,
    });
  };

  // 2. APPLY TEMPLATE TO CURRENT SCHEDULE
  const handleApplyTemplate = async () => {
    const template = savedTemplates.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    // One shift per nurse per weekday, as the template gives it (the first one if a template has two).
    const byNurseWeekday = new Map<string, TemplateSlotPattern>();
    for (const p of template.patterns || []) {
      const key = `${p.nurseId}_${Number(p.weekday)}`;
      if (!byNurseWeekday.has(key)) byNurseWeekday.set(key, p);
    }
    const plan = planFill((nurseId, weekday) => {
      const p = byNurseWeekday.get(`${nurseId}_${weekday}`);
      if (!p) return undefined;
      return {
        dutyWindowId: p.dutyWindowId,
        kind: p.kind,
        doctorId: p.kind === 'DOCTOR' ? p.targetRefId : undefined,
        clinicalRoleId: p.kind === 'CLINICAL_ROLE' ? p.targetRefId : undefined,
        specialtyId: p.kind === 'SPECIALTY' ? p.targetRefId : undefined,
        note: `From template "${template.name}"`,
      };
    });
    if (!(await confirmFill(plan, `Use template "${template.name}"?`))) return;

    setIsProcessing(true);
    try {
      await repo.create('audit', {
        actor: actorName(),
        action: 'TEMPLATE_APPLY',
        entity: 'Schedule',
        entityId: schedule.id,
        note: `Applied roster template "${template.name}": ${plan.added} shifts filled, ${plan.replaced} replaced.`,
        timestamp: new Date().toISOString(),
      });

      onApplyAssignments(plan.result, `Applied template "${template.name}"`);
      onClose();
    } catch (err: any) {
      notify(`Couldn't use the template: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. COPY PREVIOUS PERIOD / COPY LAST MONTH
  const handleCopyPreviousPeriod = async () => {
    if (!selectedSourceScheduleId) return;
    setIsProcessing(true);

    try {
      const sourceAsgns = await repo.list('assignments', { field: 'scheduleId', operator: '==', value: selectedSourceScheduleId });
      const sourceSchedule = allSchedules.find((s) => s.id === selectedSourceScheduleId);

      // Build weekday pattern from source schedule
      const patternsByNurseWeekday = new Map<string, Assignment>();
      for (const a of sourceAsgns) {
        const d = new Date(a.date);
        const w = d.getUTCDay();
        const key = `${a.nurseId}_${w}`;
        if (!patternsByNurseWeekday.has(key)) {
          patternsByNurseWeekday.set(key, a);
        }
      }

      const plan = planFill((nurseId, weekday) => {
        const p = patternsByNurseWeekday.get(`${nurseId}_${weekday}`);
        if (!p) return undefined;
        return {
          dutyWindowId: p.dutyWindowId,
          kind: p.kind,
          doctorId: p.doctorId,
          clinicalRoleId: p.clinicalRoleId,
          specialtyId: p.specialtyId,
          note: `Copied from ${sourceSchedule?.name || 'an earlier roster'}`,
        };
      });
      if (!(await confirmFill(plan, `Copy from ${sourceSchedule?.name || 'the earlier roster'}?`))) return;

      await repo.create('audit', {
        actor: actorName(),
        action: 'UPDATE',
        entity: 'Schedule',
        entityId: schedule.id,
        note: `Copied assignments from ${sourceSchedule?.name}: ${plan.added} shifts filled, ${plan.replaced} replaced.`,
        timestamp: new Date().toISOString(),
      });

      onApplyAssignments(plan.result, `Copied from ${sourceSchedule?.name}`);
      onClose();
    } catch (err: any) {
      notify(`Couldn't copy the earlier roster: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirmDialog({
      title: 'Delete template?',
      message: 'The template is deleted. Rosters already filled from it are not changed.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    await repo.remove('templates', id);
    loadTemplates();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs font-sans text-slate-800"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="text-base font-bold text-slate-900">
                  Templates
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Save a weekly pattern, or fill this roster from a template or an earlier roster
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('SAVE')}
            className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
              activeTab === 'SAVE'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Save as template
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('APPLY')}
            className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
              activeTab === 'APPLY'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Use a template ({savedTemplates.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('COPY_PERIOD')}
            className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
              activeTab === 'COPY_PERIOD'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Copy an earlier roster
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: SAVE */}
          {activeTab === 'SAVE' && (
            <form onSubmit={handleSaveAsTemplate} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-600 text-[11px] leading-relaxed">
                Saves which shift each nurse works on each weekday in <strong>{schedule.name}</strong> ({assignments.length} shifts), so you can use the same pattern again.
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-800 text-xs">
                  Template name <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  required
                  aria-label="Template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-medium text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-800 text-xs">
                  Description (optional)
                </label>
                <textarea
                  rows={2}
                  aria-label="Template description"
                  placeholder="For example: usual pattern for a normal month"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save template</span>
              </button>
            </form>
          )}

          {/* TAB 2: APPLY */}
          {activeTab === 'APPLY' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-600 text-[11px] leading-relaxed">
                Fills this roster from a saved template. Each nurse only gets shifts on the weekdays the template gives them. Pinned days, approved leave and shifts you set by hand are kept. You will see how many shifts change before anything is saved.
              </div>

              {savedTemplates.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedTemplates.map((t) => {
                    const isSelected = t.id === selectedTemplateId;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTemplateId(t.id)}
                        className={`p-3 rounded border cursor-pointer transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {/* The row stays clickable with the mouse; this button gives keyboard users the same action. */}
                        <button
                          type="button"
                          onClick={() => setSelectedTemplateId(t.id)}
                          aria-pressed={isSelected}
                          className="flex-1 text-left cursor-pointer"
                        >
                          <span className="block font-bold">{t.name}</span>
                          <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
                            {t.patterns.length} weekly shift{t.patterns.length === 1 ? '' : 's'} · saved {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                          {t.description && (
                            <span className="block text-[11px] text-slate-600 mt-1 italic">{t.description}</span>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTemplate(t.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Delete template"
                            aria-label={`Delete template ${t.name}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 border border-slate-200 rounded text-center text-slate-400 text-xs">
                  No saved templates yet. Use "Save as template" to save this roster's weekly pattern.
                </div>
              )}

              {savedTemplates.length > 0 && (
                <button
                  type="button"
                  disabled={!selectedTemplateId || isProcessing}
                  onClick={handleApplyTemplate}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer shadow-xs disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Fill roster from template</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: COPY PREVIOUS MONTH */}
          {activeTab === 'COPY_PERIOD' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-600 text-[11px] leading-relaxed">
                Copies each nurse's weekly pattern from an earlier roster (for example last month's) into this one, weekday by weekday. Pinned days, approved leave and shifts you set by hand are kept. You will see how many shifts change before anything is saved.
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-800 text-xs">
                  Roster to copy from:
                </label>
                <select
                  aria-label="Roster to copy from"
                  value={selectedSourceScheduleId}
                  onChange={(e) => setSelectedSourceScheduleId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-medium text-xs bg-white"
                >
                  {allSchedules
                    .filter((s) => s.id !== schedule.id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startDate} to {s.endDate} · {s.status === 'PUBLISHED' ? 'published' : s.status === 'DRAFT' ? 'draft' : s.status.toLowerCase()})
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="button"
                disabled={!selectedSourceScheduleId || isProcessing}
                onClick={handleCopyPreviousPeriod}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer shadow-xs disabled:opacity-40"
              >
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Copy weekly pattern</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
