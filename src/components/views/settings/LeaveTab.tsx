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
import { LEAVE_COLOR_PALETTE, SaveNotifier, SettingsDialog } from './shared';

interface LeaveTabProps {
  leaveTypes: LeaveType[];
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

export const LeaveTab: React.FC<LeaveTabProps> = ({ leaveTypes, loadData, triggerSaveNotification }) => {
  const repo = getRepository();
  const leaveModalTitleId = useId();

  const [editingLeave, setEditingLeave] = useState<LeaveType | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const handleSaveLeaveType = async (lt: Partial<LeaveType>) => {
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

    if (lt.id) {
      await repo.update('leaveTypes', lt.id, lt as any);
      triggerSaveNotification(`Leave type "${lt.name}" updated.`);
    } else {
      await repo.create('leaveTypes', {
        name: lt.name || 'New Leave',
        acronym: acronymClean,
        creditedHours: lt.creditedHours ?? 8,
        countsTowardHoursTarget: lt.countsTowardHoursTarget ?? true,
        color: lt.color || '#f59e0b',
        active: lt.active !== false,
      });
      triggerSaveNotification(`Leave type "${lt.name}" created.`);
    }
    setIsLeaveModalOpen(false);
    setEditingLeave(null);
    loadData();
  };

  const handleDeleteLeaveType = async (id: string, name: string) => {
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
      triggerSaveNotification(`Leave type "${name}" deleted.`);
      loadData();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Leave Types &amp; Credited Hours</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage allowable leave types, credited hours (e.g. 8h or match duty), and whether they count toward the roster target hours.
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
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{lt.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {lt.creditedHours === 'match_duty' ? 'Match Duty Hours' : `${lt.creditedHours}h`}
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
              <label className="block font-medium text-slate-700 mb-1">Credited Hours</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="credType"
                    checked={typeof editingLeave.creditedHours === 'number'}
                    onChange={() => setEditingLeave({ ...editingLeave, creditedHours: 8 })}
                  />
                  <span>Fixed Hours:</span>
                </label>
                {typeof editingLeave.creditedHours === 'number' && (
                  <input
                    aria-label="Fixed credited hours"
                    type="number"
                    value={editingLeave.creditedHours}
                    onChange={(e) =>
                      setEditingLeave({
                        ...editingLeave,
                        creditedHours: Number(e.target.value),
                      })
                    }
                    className="w-16 px-2 py-1 border border-slate-300 rounded font-mono text-center"
                  />
                )}
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="credType"
                    checked={editingLeave.creditedHours === 'match_duty'}
                    onChange={() => setEditingLeave({ ...editingLeave, creditedHours: 'match_duty' })}
                  />
                  <span>Match Duty Hours</span>
                </label>
              </div>
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
