/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Templates dialog: save a roster's weekly pattern, fill a roster from a
 * saved template, or copy the weekly pattern of an earlier roster. On the shared Dialog and Tabs
 * since Phase 7, slice 3b.
 */

import React, { useState, useEffect } from 'react';
import { Copy, Layers, Save, Sparkles, Trash2 } from 'lucide-react';
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
import { formatDate } from '../../utils/dateUtils';
import { Button, Dialog, EmptyState, Field, IconButton, Input, Select, TabPanel, Tabs, Textarea, cx } from '../ui';
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
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title="Templates and copy last roster"
      description="Save a weekly pattern, or fill this roster from a template or an earlier roster."
      footer={<Button onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4 text-sm">
        <Tabs
          label="Templates"
          idPrefix="templates"
          value={activeTab}
          onChange={(id) => setActiveTab(id as typeof activeTab)}
          tabs={[
            { id: 'SAVE', label: 'Save as template' },
            { id: 'APPLY', label: 'Use a template', count: savedTemplates.length },
            { id: 'COPY_PERIOD', label: 'Copy an earlier roster' },
          ]}
        />

        <TabPanel idPrefix="templates" id="SAVE" value={activeTab}>
          <form onSubmit={handleSaveAsTemplate} className="space-y-4">
            <p className="text-ink-muted">
              Saves which shift each nurse works on each weekday in <strong className="text-ink">{schedule.name}</strong> ({assignments.length} shifts), so
              you can use the same pattern again.
            </p>
            <Field label="Template name">{(f) => <Input {...f} required value={templateName} onChange={(e) => setTemplateName(e.target.value)} />}</Field>
            <Field label="Description" optional hint="For example: the usual pattern for a normal month.">
              {(f) => <Textarea {...f} rows={2} value={templateDescription} onChange={(e) => setTemplateDescription(e.target.value)} />}
            </Field>
            <Button variant="primary" type="submit" icon={Save}>
              Save the template
            </Button>
          </form>
        </TabPanel>

        <TabPanel idPrefix="templates" id="APPLY" value={activeTab}>
          <div className="space-y-4">
            <p className="text-ink-muted">
              Fills this roster from a saved template. Each nurse only gets shifts on the weekdays the template gives them. Pinned days, approved leave and
              shifts you set by hand are kept. You will see how many shifts change before anything is saved.
            </p>
            {savedTemplates.length > 0 ? (
              <ul className="space-y-2" aria-label="Saved templates">
                {savedTemplates.map((t) => {
                  const isSelected = t.id === selectedTemplateId;
                  return (
                    <li key={t.id} className={cx('flex items-stretch gap-1 rounded-lg border', isSelected ? 'border-brand bg-brand-soft' : 'border-line')}>
                      <button type="button" aria-pressed={isSelected} onClick={() => setSelectedTemplateId(t.id)} className="min-w-0 flex-1 rounded-lg p-3 text-left hover:bg-sunken">
                        <span className="block font-semibold text-ink">{t.name}</span>
                        <span className="mt-0.5 block text-xs text-ink-muted">
                          {t.patterns.length} weekly {t.patterns.length === 1 ? 'shift' : 'shifts'}, saved {formatDate(t.createdAt)}
                        </span>
                        {t.description && <span className="mt-1 block text-xs text-ink-muted">{t.description}</span>}
                      </button>
                      <IconButton label={`Delete the template ${t.name}`} icon={Trash2} onClick={(e) => handleDeleteTemplate(t.id, e)} className="m-1.5 self-center" />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState icon={Layers} title="No saved templates yet">
                Use Save as template to save this roster's weekly pattern.
              </EmptyState>
            )}
            {savedTemplates.length > 0 && (
              <Button variant="primary" icon={Sparkles} busy={isProcessing} disabled={!selectedTemplateId} onClick={handleApplyTemplate}>
                Fill the roster from the template
              </Button>
            )}
          </div>
        </TabPanel>

        <TabPanel idPrefix="templates" id="COPY_PERIOD" value={activeTab}>
          <div className="space-y-4">
            <p className="text-ink-muted">
              Copies each nurse's weekly pattern from an earlier roster (for example last month's) into this one, weekday by weekday. Pinned days, approved
              leave and shifts you set by hand are kept. You will see how many shifts change before anything is saved.
            </p>
            <Field label="Roster to copy from">
              {(f) => (
                <Select {...f} value={selectedSourceScheduleId} onChange={(e) => setSelectedSourceScheduleId(e.target.value)}>
                  {allSchedules
                    .filter((sc) => sc.id !== schedule.id)
                    .map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name} ({formatDate(sc.startDate)} to {formatDate(sc.endDate)}, {sc.status === 'PUBLISHED' ? 'published' : sc.status === 'DRAFT' ? 'draft' : sc.status.toLowerCase()})
                      </option>
                    ))}
                </Select>
              )}
            </Field>
            <Button variant="primary" icon={Copy} busy={isProcessing} disabled={!selectedSourceScheduleId} onClick={handleCopyPreviousPeriod}>
              Copy the weekly pattern
            </Button>
          </div>
        </TabPanel>
      </div>
    </Dialog>
  );
};
