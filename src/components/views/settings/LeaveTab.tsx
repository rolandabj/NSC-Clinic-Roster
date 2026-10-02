/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Leave tab.
 */

import React, { useId, useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { LeaveType } from '../../../types';
import { notify, confirmDialog } from '../../common/dialogs';
import { LEAVE_COLOR_PALETTE, SaveNotifier, SettingsDialog, withSaveErrors } from './shared';

interface LeaveTabProps {
  leaveTypes: LeaveType[];
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

/** Codes the app looks up directly (quick buttons, reports, public holidays). */
const BUILT_IN_LEAVE_CODES = ['AL', 'PH', 'BL', 'SL', 'RO', 'DO'];
const isBuiltInCode = (code?: string) => !!code && BUILT_IN_LEAVE_CODES.includes(code.trim().toUpperCase());

export const LeaveTab: React.FC<LeaveTabProps> = ({ leaveTypes, loadData, triggerSaveNotification }) => {
  const repo = getRepository();
  const leaveModalTitleId = useId();

  const [editingLeave, setEditingLeave] = useState<LeaveType | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const handleSaveLeaveType = withSaveErrors('save the leave type', async (lt: Partial<LeaveType>) => {
    const name = (lt.name || '').trim();
    if (!name) {
      notify('Please enter a name.', 'warning');
      return;
    }
    const original = leaveTypes.find((l) => l.id === lt.id);
    if (original && isBuiltInCode(original.acronym)) {
      lt = { ...lt, acronym: original.acronym };
    }
    const acronymClean = (lt.acronym || '').trim().toUpperCase();
    if (!acronymClean || acronymClean.length > 3) {
      notify('Leave acronym is required and must be 1 to 3 characters.', 'warning');
      return;
    }
    const duplicate = leaveTypes.find(
      (l) => l.acronym.toUpperCase() === acronymClean && l.id !== lt.id
    );
    if (duplicate) {
      notify(`Acronym "${acronymClean}" is already in use by "${duplicate.name}".`, 'warning');
      return;
    }

    const hours = typeof lt.creditedHours === 'number' ? lt.creditedHours : lt.creditedHours === undefined || lt.creditedHours === 'match_duty' ? 8 : NaN;
    if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
      notify('Hours per leave day must be a number from 0 to 24.', 'warning');
      return;
    }

    if (lt.id) {
      const { id, ...fields } = lt;
      await repo.update('leaveTypes', id!, { ...fields, name, acronym: acronymClean, creditedHours: hours } as any);
      triggerSaveNotification(`Leave type "${lt.name}" updated.`);
    } else {
      await repo.create('leaveTypes', {
        name,
        acronym: acronymClean,
        creditedHours: hours,
        countsTowardHoursTarget: lt.countsTowardHoursTarget ?? true,
        color: lt.color || '#f59e0b',
        active: lt.active !== false,
      });
      triggerSaveNotification(`Leave type "${lt.name}" created.`);
    }
    setIsLeaveModalOpen(false);
    setEditingLeave(null);
    loadData();
  });

  const handleDeleteLeaveType = withSaveErrors('delete the leave type', async (id: string, name: string) => {
    const type = leaveTypes.find((l) => l.id === id);
    if (type && isBuiltInCode(type.acronym)) {
      notify(`"${name}" (${type.acronym}) is built in: the app finds it by its code for quick buttons, reports and holidays. It can't be deleted.`, 'warning');
      return;
    }
    // Check if in use in leaveEntries
    const existingEntries = await repo.list('leaveEntries', {
      field: 'leaveTypeId',
      operator: '==',
      value: id,
    });
    if (existingEntries.length > 0) {
      notify(
        `Cannot delete "${name}": It is currently assigned to ${existingEntries.length} leave entry/entries in the roster database.`,
        'warning'
      );
      return;
    }

    if (
      await confirmDialog({
        title: 'Delete leave type',
        message: `Are you sure you want to delete leave type "${name}"?`,
        confirmLabel: 'Delete',
        danger: true,
      })
    ) {
      await repo.remove('leaveTypes', id);
      // Drop its yearly allowance from the nurses' profiles.
      const nurses = await repo.list('nurses');
      const withQuota = nurses.filter((n) => n.leaveQuotas && id in n.leaveQuotas);
      // A merge write would keep the removed key, so the whole nurse is written back.
      const cleaned = withQuota.map((n) => {
        const { [id]: _removed, ...rest } = n.leaveQuotas!;
        return { ...n, leaveQuotas: rest };
      });
      if (cleaned.length > 0) await repo.bulkUpsert('nurses', cleaned, { replace: true });
      triggerSaveNotification(`Leave type "${name}" deleted.`);
      loadData();
    }
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Leave types</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The kinds of leave, how many hours a leave day counts, and whether it counts toward a nurse's hours target.
              Built in codes (AL, PH, BL, SL, RO, DO) can't be changed or deleted.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingLeave({
                id: '',
                name: '',
                acronym: '',
                creditedHours: 8,
                countsTowardHoursTarget: true,
                color: LEAVE_COLOR_PALETTE[0],
                active: true,
              });
              setIsLeaveModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Leave Type</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="py-2.5 px-3">Acronym</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Credited Hours</th>
                <th className="py-2.5 px-3">Counts Toward Target</th>
                <th className="py-2.5 px-3">Badge Color</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaveTypes.map((lt) => (
                <tr key={lt.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-white font-mono font-bold text-[11px]"
                      style={{ backgroundColor: lt.color }}
                    >
                      {lt.acronym}
                    </span>
                    {isBuiltInCode(lt.acronym) && (
                      <span className="ml-1.5 text-[10px] text-slate-400" title="The app finds this leave type by its code">
                        built in
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{lt.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {typeof lt.creditedHours === 'number' ? `${lt.creditedHours}h` : '8h'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                        lt.countsTowardHoursTarget
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {lt.countsTowardHoursTarget ? 'Counts Toward Target (ON)' : 'Zero Credits (OFF)'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="w-3.5 h-3.5 rounded border border-slate-300 inline-block"
                      style={{ backgroundColor: lt.color }}
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        aria-label="Edit leave type"
                        onClick={() => {
                          setEditingLeave(lt);
                          setIsLeaveModalOpen(true);
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                        title="Edit leave type"
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        aria-label="Delete leave type"
                        onClick={() => handleDeleteLeaveType(lt.id, lt.name)}
                        className="p-1 hover:bg-red-50 rounded text-red-600 cursor-pointer"
                        title="Delete leave type"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isLeaveModalOpen && editingLeave && (
        <SettingsDialog
          onClose={() => setIsLeaveModalOpen(false)}
          labelledBy={leaveModalTitleId}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          panelClassName="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
        >
          <h3 id={leaveModalTitleId} className="text-sm font-bold text-slate-900">
            {editingLeave.id ? 'Edit Leave Type' : 'Add Leave Type'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Leave Name</label>
              <input
                aria-label="Leave Name"
                type="text"
                value={editingLeave.name}
                onChange={(e) => setEditingLeave({ ...editingLeave, name: e.target.value })}
                placeholder="e.g. Compassionate Leave"
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Acronym (max 3 chars)
                </label>
                <input
                  aria-label="Acronym (max 3 chars)"
                  type="text"
                  maxLength={3}
                  disabled={!!editingLeave.id && isBuiltInCode(leaveTypes.find((l) => l.id === editingLeave.id)?.acronym)}
                  title="Built in codes can't be changed"
                  value={editingLeave.acronym}
                  onChange={(e) =>
                    setEditingLeave({ ...editingLeave, acronym: e.target.value.toUpperCase() })
                  }
                  placeholder="CL"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold uppercase"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Badge Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    aria-label="Badge Color"
                    type="color"
                    value={editingLeave.color}
                    onChange={(e) => setEditingLeave({ ...editingLeave, color: e.target.value })}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    aria-label="Badge Color (hex)"
                    type="text"
                    value={editingLeave.color}
                    onChange={(e) => setEditingLeave({ ...editingLeave, color: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="leave-credited-hours" className="block font-medium text-slate-700 mb-1">
                Hours counted per leave day
              </label>
              <input
                id="leave-credited-hours"
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={typeof editingLeave.creditedHours === 'number' ? editingLeave.creditedHours : 8}
                onChange={(e) =>
                  setEditingLeave({
                    ...editingLeave,
                    creditedHours: e.target.value === '' ? ('' as any) : Number(e.target.value),
                  })
                }
                className="w-20 px-2 py-1 border border-slate-300 rounded font-mono text-center"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                The default for every day of this leave. To count a different number for one nurse on one day, open that day in the roster.
              </span>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={editingLeave.countsTowardHoursTarget}
                  onChange={(e) =>
                    setEditingLeave({
                      ...editingLeave,
                      countsTowardHoursTarget: e.target.checked,
                    })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-slate-700">Counts toward roster target hours</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveLeaveType(editingLeave)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
            >
              Save Leave Type
            </button>
          </div>
        </SettingsDialog>
      )}
    </>
  );
};
