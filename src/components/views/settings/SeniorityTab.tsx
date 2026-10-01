/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Seniority tab.
 */

import React, { useId, useState } from 'react';
import { Shield, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { SeniorityLevel } from '../../../types';
import { notify, confirmDialog } from '../../common/dialogs';
import { SENIORITY_COLOR_PALETTE, SaveNotifier, SettingsDialog, withSaveErrors } from './shared';

interface SeniorityTabProps {
  seniority: SeniorityLevel[];
  setSeniority: React.Dispatch<React.SetStateAction<SeniorityLevel[]>>;
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

export const SeniorityTab: React.FC<SeniorityTabProps> = ({
  seniority,
  setSeniority,
  loadData,
  triggerSaveNotification,
}) => {
  const repo = getRepository();
  const seniorityModalTitleId = useId();

  const [editingSeniority, setEditingSeniority] = useState<SeniorityLevel | null>(null);
  const [isSeniorityModalOpen, setIsSeniorityModalOpen] = useState(false);
  const [draggedSeniorityIndex, setDraggedSeniorityIndex] = useState<number | null>(null);
  const [dragOverSeniorityIndex, setDragOverSeniorityIndex] = useState<number | null>(null);

  const handleToggleSenior = withSaveErrors('change the senior setting', async (level: SeniorityLevel) => {
    await repo.update('seniorityLevels', level.id, {
      isSenior: !level.isSenior,
    });
    triggerSaveNotification(`Updated senior status for ${level.name}.`);
    loadData();
  });

  const handleSaveSeniority = withSaveErrors('save the seniority level', async (level: Partial<SeniorityLevel>) => {
    const nameClean = (level.name || '').trim();
    if (!nameClean) {
      notify('Seniority level name is required.', 'warning');
      return;
    }
    if (level.id) {
      await repo.update('seniorityLevels', level.id, {
        name: nameClean,
        color: level.color || '#4f46e5',
        isSenior: !!level.isSenior,
      });
      triggerSaveNotification(`Seniority level "${nameClean}" updated.`);
    } else {
      const newRank = seniority.length + 1;
      await repo.create('seniorityLevels', {
        name: nameClean,
        rank: newRank,
        color: level.color || '#4f46e5',
        isSenior: !!level.isSenior,
      });
      triggerSaveNotification(`Seniority level "${nameClean}" created.`);
    }
    setIsSeniorityModalOpen(false);
    setEditingSeniority(null);
    loadData();
  });

  const handleDeleteSeniority = withSaveErrors('delete the seniority level', async (id: string, name: string) => {
    const nursesUsing = await repo.list('nurses', {
      field: 'seniorityLevelId',
      operator: '==',
      value: id,
    });
    if (nursesUsing.length > 0) {
      notify(
        `Cannot delete "${name}": It is currently assigned to ${nursesUsing.length} nurse(s).`,
        'warning'
      );
      return;
    }
    if (
      await confirmDialog({
        title: 'Delete seniority level',
        message: `Are you sure you want to delete seniority level "${name}"?`,
        confirmLabel: 'Delete',
        danger: true,
      })
    ) {
      await repo.remove('seniorityLevels', id);
      triggerSaveNotification(`Seniority level "${name}" removed.`);
      loadData();
    }
  });

  const handleDropSeniority = async (targetIndex: number) => {
    if (draggedSeniorityIndex === null || draggedSeniorityIndex === targetIndex) {
      setDraggedSeniorityIndex(null);
      setDragOverSeniorityIndex(null);
      return;
    }
    const updated = [...seniority];
    const [movedItem] = updated.splice(draggedSeniorityIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Recalculate 1-based ranks
    const updatedWithRanks = updated.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
    setSeniority(updatedWithRanks);
    setDraggedSeniorityIndex(null);
    setDragOverSeniorityIndex(null);

    // Save all ranks atomically to repository
    try {
      await repo.bulkUpsert('seniorityLevels', updatedWithRanks);
      triggerSaveNotification('Seniority hierarchy reordered and saved.');
    } catch (err: any) {
      console.error('Failed to save seniority ranks:', err);
      notify(`The new seniority order was not saved: ${err?.message || err}`, 'error');
      loadData();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Seniority Levels &amp; H1 Rule Configuration</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranks define staff seniority hierarchy. Drag rows to reorder precedence. Toggling &quot;Is Senior&quot; designates nurses who fulfill Hard Rule H1 (&quot;At least one senior nurse on every duty window&quot;).
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSeniority({
                id: '',
                name: '',
                rank: seniority.length + 1,
                isSenior: false,
                color: SENIORITY_COLOR_PALETTE[0],
              });
              setIsSeniorityModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Seniority Level</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center" title="Drag to reorder"></th>
                <th className="py-2.5 px-3 w-16">Rank</th>
                <th className="py-2.5 px-3">Seniority Level Name</th>
                <th className="py-2.5 px-3">Is Senior (Fulfills H1)</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {seniority.map((level, idx) => {
                const isDragging = draggedSeniorityIndex === idx;
                const isOver = dragOverSeniorityIndex === idx;
                return (
                  <tr
                    key={level.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', String(idx));
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggedSeniorityIndex(idx);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (dragOverSeniorityIndex !== idx) {
                        setDragOverSeniorityIndex(idx);
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverSeniorityIndex === idx) {
                        setDragOverSeniorityIndex(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropSeniority(idx);
                    }}
                    onDragEnd={() => {
                      setDraggedSeniorityIndex(null);
                      setDragOverSeniorityIndex(null);
                    }}
                    className={`transition-colors select-none ${
                      isDragging
                        ? 'opacity-40 bg-indigo-50/60'
                        : isOver
                        ? 'bg-indigo-50/90 ring-2 ring-indigo-500 ring-inset'
                        : 'hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <td className="py-2.5 px-2 text-center">
                      <div
                        className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-700 inline-flex items-center justify-center rounded hover:bg-slate-100 transition-colors"
                        title="Drag to reorder hierarchy rank"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                      #{level.rank}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: level.color }}
                        />
                        {level.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleSenior(level)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                          level.isSenior
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{level.isSenior ? 'Senior Staff (Senior on Duty ✓)' : 'Standard Staff'}</span>
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          aria-label="Edit seniority level"
                          onClick={() => {
                            setEditingSeniority(level);
                            setIsSeniorityModalOpen(true);
                          }}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                          title="Edit seniority level"
                        >
                          <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          aria-label="Delete seniority level"
                          onClick={() => handleDeleteSeniority(level.id, level.name)}
                          className="p-1 hover:bg-red-50 rounded text-red-600 cursor-pointer"
                          title="Delete seniority level"
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

      {isSeniorityModalOpen && editingSeniority && (
        <SettingsDialog
          onClose={() => setIsSeniorityModalOpen(false)}
          labelledBy={seniorityModalTitleId}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          panelClassName="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
        >
          <h3 id={seniorityModalTitleId} className="text-sm font-bold text-slate-900">
            {editingSeniority.id ? 'Edit Seniority Level' : 'Add Seniority Level'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Seniority Level Name
              </label>
              <input
                aria-label="Seniority Level Name"
                type="text"
                value={editingSeniority.name}
                onChange={(e) =>
                  setEditingSeniority({ ...editingSeniority, name: e.target.value })
                }
                placeholder="e.g. Charge Nurse, Staff Nurse"
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Badge Color</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  aria-label="Badge Color"
                  type="color"
                  value={editingSeniority.color || '#4f46e5'}
                  onChange={(e) =>
                    setEditingSeniority({ ...editingSeniority, color: e.target.value })
                  }
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  aria-label="Badge Color (hex)"
                  type="text"
                  value={editingSeniority.color || '#4f46e5'}
                  onChange={(e) =>
                    setEditingSeniority({ ...editingSeniority, color: e.target.value })
                  }
                  className="w-24 px-2 py-1.5 border border-slate-300 rounded font-mono text-[11px]"
                />
                <div className="flex items-center gap-1.5 ml-auto">
                  {SENIORITY_COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditingSeniority({ ...editingSeniority, color: c })}
                      className={`w-5 h-5 rounded-full border cursor-pointer transition-transform ${
                        editingSeniority.color === c
                          ? 'scale-110 ring-2 ring-indigo-500 ring-offset-1 border-white'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                      aria-label={`Use color ${c}`}
                      aria-pressed={editingSeniority.color === c}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingSeniority.isSenior}
                  onChange={(e) =>
                    setEditingSeniority({
                      ...editingSeniority,
                      isSenior: e.target.checked,
                    })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-slate-800">
                  Designate as Senior Staff (Fulfills Hard Rule H1)
                </span>
              </label>
              <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
                When enabled, nurses with this rank fulfill the Hard Rule H1 requirement: &quot;At least one senior nurse on every duty window&quot;.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSeniorityModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveSeniority(editingSeniority)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
            >
              Save Seniority Level
            </button>
          </div>
        </SettingsDialog>
      )}
    </>
  );
};
