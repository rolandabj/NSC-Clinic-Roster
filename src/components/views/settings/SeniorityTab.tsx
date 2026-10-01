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

  /** Asks before the last senior level stops being senior (no day could then meet the senior rule). */
  const confirmNotLastSenior = async (level: SeniorityLevel | Partial<SeniorityLevel>, willBeSenior: boolean) => {
    const othersSenior = seniority.some((l) => l.id !== level.id && l.isSenior);
    const wasSenior = !!seniority.find((l) => l.id === level.id)?.isSenior;
    if (willBeSenior || !wasSenior || othersSenior) return true;
    return confirmDialog({
      title: 'No senior level left',
      message: `"${level.name}" is the only senior level. Without one, no day can meet the "senior nurse on duty each day" rule, and every roster will show that problem. Continue?`,
      confirmLabel: 'Continue',
      danger: true,
    });
  };

  const handleToggleSenior = withSaveErrors('change the senior setting', async (level: SeniorityLevel) => {
    if (!(await confirmNotLastSenior(level, !level.isSenior))) return;
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
    const sameName = seniority.find((l) => l.name.trim().toLowerCase() === nameClean.toLowerCase() && l.id !== level.id);
    if (sameName) {
      notify(`There is already a level called "${sameName.name}".`, 'warning');
      return;
    }
    if (level.id && !(await confirmNotLastSenior(level, !!level.isSenior))) return;
    if (level.id) {
      await repo.update('seniorityLevels', level.id, {
        name: nameClean,
        color: level.color || '#4f46e5',
        isSenior: !!level.isSenior,
      });
      triggerSaveNotification(`Seniority level "${nameClean}" updated.`);
    } else {
      const newRank = seniority.reduce((max, l) => Math.max(max, l.rank || 0), 0) + 1;
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
      // Close the gap in the ranks (1, 2, 3 ...).
      const renumbered = seniority
        .filter((l) => l.id !== id)
        .sort((a, b) => (a.rank || 0) - (b.rank || 0))
        .map((l, i) => ({ ...l, rank: i + 1 }))
        .filter((l, i) => l.rank !== seniority.find((o) => o.id === l.id)?.rank);
      if (renumbered.length > 0) await repo.bulkUpsert('seniorityLevels', renumbered);
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
    await moveLevel(draggedSeniorityIndex, targetIndex);
  };

  const moveLevel = async (fromIndex: number, targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= seniority.length || fromIndex === targetIndex) return;
    const updated = [...seniority];
    const [movedItem] = updated.splice(fromIndex, 1);
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
            <h2 className="text-sm font-semibold text-slate-900">Seniority levels</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The order sets how staff are sorted in reports. Nurses at a senior level count for the rule &quot;at least one senior nurse on duty each day&quot;.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSeniority({
                id: '',
                name: '',
                rank: seniority.reduce((max, l) => Math.max(max, l.rank || 0), 0) + 1,
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
                <th className="py-2.5 px-3 w-24 text-center"><span className="sr-only">Order</span></th>
                <th className="py-2.5 px-3 w-16">Rank</th>
                <th className="py-2.5 px-3">Seniority Level Name</th>
                <th className="py-2.5 px-3">Senior?</th>
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
                    className={`transition-colors ${
                      isDragging
                        ? 'opacity-40 bg-indigo-50/60'
                        : isOver
                        ? 'bg-indigo-50/90 ring-2 ring-indigo-500 ring-inset'
                        : 'hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <td className="py-2.5 px-2 text-center">
                      <div className="inline-flex items-center gap-0.5">
                        <div
                          className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-700 inline-flex items-center justify-center rounded hover:bg-slate-100 transition-colors"
                          title="Drag to reorder"
                          aria-hidden="true"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <button
                          type="button"
                          aria-label={`Move ${level.name} up`}
                          disabled={idx === 0}
                          onClick={() => moveLevel(idx, idx - 1)}
                          className="px-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${level.name} down`}
                          disabled={idx === seniority.length - 1}
                          onClick={() => moveLevel(idx, idx + 1)}
                          className="px-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        >
                          ▼
                        </button>
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
                        <span>{level.isSenior ? 'Senior' : 'Not senior'}</span>
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
                  Senior level
                </span>
              </label>
              <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
                Nurses at this level count for the rule &quot;at least one senior nurse on duty each day&quot;.
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
