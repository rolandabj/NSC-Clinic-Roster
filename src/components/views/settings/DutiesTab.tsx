/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Duties tab.
 */

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Star } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { DutyWindow } from '../../../types';
import { resolveClinicSetup, toMinutes, uncoveredParts } from '../../../services/engine/clinicModel';
import { notify, confirmDialog } from '../../common/dialogs';
import { DUTY_COLOR_PALETTE, SaveNotifier, SettingsDialog, withSaveErrors, ColourField } from './shared';
import { Checkbox, Field, Input } from '../../ui';

interface DutiesTabProps {
  duties: DutyWindow[];
  openTime?: string;
  closeTime?: string;
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Shift length in hours, minutes included (07:30 to 15:00 is 7.5). */
function shiftHours(d: Pick<DutyWindow, 'startTime' | 'endTime'>): number {
  if (!TIME.test(d.startTime || '') || !TIME.test(d.endTime || '')) return 0;
  return (toMinutes(d.endTime) - toMinutes(d.startTime)) / 60;
}

export const DutiesTab: React.FC<DutiesTabProps> = ({ duties, openTime, closeTime, loadData, triggerSaveNotification }) => {
  const repo = getRepository();

  const [editingDuty, setEditingDuty] = useState<DutyWindow | null>(null);
  const [isDutyModalOpen, setIsDutyModalOpen] = useState(false);

  // Opening hours that no active shift covers: nobody could be rostered then.
  const setup = resolveClinicSetup({ openTime, closeTime });
  const activeDuties = duties.filter((d) => d.active !== false && TIME.test(d.startTime || '') && TIME.test(d.endTime || ''));
  const gaps = uncoveredParts(setup.openTime, setup.closeTime, activeDuties);

  const handleSaveDuty = withSaveErrors('save the shift', async (duty: Partial<DutyWindow>) => {
    // Acronym unique check
    const acronymClean = (duty.acronym || '').trim().toUpperCase();
    if (!acronymClean || acronymClean.length > 5) {
      notify('Enter a short name of 1 to 5 letters.', 'warning');
      return;
    }
    const duplicate = duties.find(
      (d) => d.acronym.toUpperCase() === acronymClean && d.id !== duty.id
    );
    if (duplicate) {
      notify(`The shift ${duplicate.name} already has the short name ${acronymClean}.`, 'warning');
      return;
    }

    const name = (duty.name || '').trim();
    if (!name) {
      notify('Enter a name for the shift.', 'warning');
      return;
    }
    if (!TIME.test(duty.startTime || '') || !TIME.test(duty.endTime || '')) {
      notify('Enter when the shift starts and ends.', 'warning');
      return;
    }
    if (duty.startTime! >= duty.endTime!) {
      notify('The end time must be after the start time.', 'warning');
      return;
    }
    if (duty.color && !/^#[0-9a-f]{6}$/i.test(duty.color)) {
      notify('The colour must be a hex code like #3b82f6.', 'warning');
      return;
    }

    if (duty.id) {
      const { id, ...fields } = duty;
      await repo.update('dutyWindows', id, { ...fields, name, acronym: acronymClean } as any);
      triggerSaveNotification(`Duty "${duty.name}" updated.`);
    } else {
      await repo.create('dutyWindows', {
        name,
        acronym: acronymClean,
        startTime: duty.startTime || '09:00',
        endTime: duty.endTime || '21:00',
        color: duty.color || '#3b82f6',
        active: duty.active !== false,
        isPriority: Boolean(duty.isPriority),
        priorityRank: duty.priorityRank || 100,
      });
      triggerSaveNotification(`Duty "${duty.name}" created.`);
    }
    setIsDutyModalOpen(false);
    setEditingDuty(null);
    loadData();
  });

  const handleToggleDutyPriority = withSaveErrors('change the shift priority', async (duty: DutyWindow) => {
    const nextPriority = !duty.isPriority;
    await repo.update('dutyWindows', duty.id, { isPriority: nextPriority } as any);
    triggerSaveNotification(
      nextPriority
        ? `Duty "${duty.name}" marked as Priority (will be scheduled first).`
        : `Duty "${duty.name}" set to Standard priority.`
    );
    loadData();
  });

  const handleDeleteDuty = withSaveErrors('delete the shift', async (duty: DutyWindow) => {
    // A shift used in a roster, a pinned shift or a template is archived instead,
    // so those rosters keep showing it.
    const [assignments, locks, templates, requests] = await Promise.all([
      repo.list('assignments', { field: 'dutyWindowId', operator: '==', value: duty.id }),
      repo.list('locks'),
      repo.list('templates'),
      repo.list('availabilityRequests'),
    ]);
    const inLocks =
      locks.some((l: any) => l.dutyWindowId === duty.id) ||
      requests.some((r: any) => r.preferredDutyWindowId === duty.id || r.dutyWindowId === duty.id);
    const inTemplates = templates.some((t: any) => JSON.stringify(t).includes(`"${duty.id}"`));
    if (assignments.length > 0 || inLocks || inTemplates) {
      const where = [
        assignments.length > 0 ? `${assignments.length} roster shift${assignments.length === 1 ? '' : 's'}` : '',
        inLocks ? 'pinned shifts or requests' : '',
        inTemplates ? 'a template' : '',
      ]
        .filter(Boolean)
        .join(', ');
      if (duty.active === false) {
        notify(`"${duty.name}" is used in ${where}, so it can't be deleted. It is already archived.`, 'info');
        return;
      }
      if (
        await confirmDialog({
          title: 'Archive shift',
          message: `"${duty.name}" is used in ${where}, so it can't be deleted. Archive it instead? Archived shifts stay on old rosters but are not used for new ones.`,
          confirmLabel: 'Archive',
        })
      ) {
        await repo.update('dutyWindows', duty.id, { active: false } as any);
        triggerSaveNotification(`"${duty.name}" archived.`);
        loadData();
      }
      return;
    }
    if (
      await confirmDialog({
        title: 'Delete shift',
        message: `Delete the shift "${duty.name}"? It isn't used in any roster.`,
        confirmLabel: 'Delete',
        danger: true,
      })
    ) {
      await repo.remove('dutyWindows', duty.id);
      triggerSaveNotification(`"${duty.name}" deleted.`);
      loadData();
    }
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Shifts</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The shifts nurses can work, each with a short code (up to 5 letters) and a colour. Shifts may overlap, for example 09:00 to 21:00 and 11:00 to 21:00.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingDuty({
                id: '',
                name: '',
                acronym: '',
                startTime: '09:00',
                endTime: '21:00',
                color: DUTY_COLOR_PALETTE[0],
                active: true,
                isPriority: false,
                priorityRank: 100,
              });
              setIsDutyModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add shift</span>
          </button>
        </div>

        {gaps.length > 0 && (
          <div className="p-3 rounded border border-amber-200 bg-amber-50 text-amber-900 text-xs">
            No active shift covers {gaps.map((g) => `${g.start} to ${g.end}`).join(' and ')}, but the clinic is open then
            ({setup.openTime} to {setup.closeTime}). Nobody can be rostered for those hours.
          </div>
        )}

        <div className="border border-slate-200 rounded overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="py-2.5 px-3">Acronym</th>
                <th className="py-2.5 px-3">Duty Name</th>
                <th className="py-2.5 px-3">Scheduling Priority</th>
                <th className="py-2.5 px-3">Operating Hours</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Palette Color</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {duties.map((duty) => {
                const durationHours = shiftHours(duty);
                return (
                  <tr key={duty.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-white font-mono font-bold text-[11px]"
                        style={{ backgroundColor: duty.color }}
                      >
                        {duty.acronym}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{duty.name}</td>
                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleDutyPriority(duty)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
                          duty.isPriority
                            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        title={
                          duty.isPriority
                            ? 'Priority Duty: The generator will attempt to schedule this duty first. Click to toggle.'
                            : 'Standard Duty: Scheduled if priority duties cannot fill requirements. Click to set as priority.'
                        }
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            duty.isPriority ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                          }`}
                        />
                        <span>{duty.isPriority ? 'Priority Duty' : 'Standard'}</span>
                      </button>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {duty.startTime} – {duty.endTime}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 tabular-nums">
                      {durationHours > 0 ? `${durationHours} hours` : 'Times missing'}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded border border-slate-300"
                          style={{ backgroundColor: duty.color }}
                        />
                        <span className="font-mono text-slate-400 text-[10px]">{duty.color}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          duty.active !== false
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {duty.active !== false ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          aria-label="Edit duty"
                          onClick={() => {
                            setEditingDuty(duty);
                            setIsDutyModalOpen(true);
                          }}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                          title="Edit duty"
                        >
                          <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          aria-label={`Delete or archive ${duty.name}`}
                          onClick={() => handleDeleteDuty(duty)}
                          className="p-1 hover:bg-red-50 rounded text-red-600 cursor-pointer"
                          title="Delete, or archive if it is in use"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isDutyModalOpen && editingDuty && (
        <SettingsDialog
          title={editingDuty.id ? 'Change the shift' : 'Add a shift'}
          onClose={() => setIsDutyModalOpen(false)}
          onSave={() => handleSaveDuty(editingDuty)}
          saveLabel={editingDuty.id ? 'Save changes' : 'Add the shift'}
        >
          <Field label="Name" hint="For example: Middle shift.">
            {(f) => <Input {...f} value={editingDuty.name} onChange={(e) => setEditingDuty({ ...editingDuty, name: e.target.value })} />}
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Short name" hint="Up to 5 letters, shown in the roster.">
              {(f) => <Input {...f} maxLength={5} value={editingDuty.acronym} onChange={(e) => setEditingDuty({ ...editingDuty, acronym: e.target.value.toUpperCase() })} className="font-mono uppercase" />}
            </Field>
            <ColourField label="Colour" value={editingDuty.color || '#3b82f6'} palette={DUTY_COLOR_PALETTE} onChange={(color) => setEditingDuty({ ...editingDuty, color })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Starts">
              {(f) => <Input {...f} type="time" value={editingDuty.startTime} onChange={(e) => setEditingDuty({ ...editingDuty, startTime: e.target.value })} />}
            </Field>
            <Field label="Ends">
              {(f) => <Input {...f} type="time" value={editingDuty.endTime} onChange={(e) => setEditingDuty({ ...editingDuty, endTime: e.target.value })} />}
            </Field>
          </div>
          <Checkbox
            checked={Boolean(editingDuty.isPriority)}
            onChange={(e) => setEditingDuty({ ...editingDuty, isPriority: e.target.checked })}
            label="Use this shift first"
            hint="Filling the roster tries this shift first. If the rules (such as the rest between shifts) can't be met with it, other shifts are used."
          />
          <Checkbox
            checked={editingDuty.active}
            onChange={(e) => setEditingDuty({ ...editingDuty, active: e.target.checked })}
            label="Active"
            hint="Only active shifts can be put on the roster."
          />
        </SettingsDialog>
      )}
    </>
  );
};
