/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Specialties tab.
 */

import React, { useId, useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { Specialty } from '../../../types';
import { notify, confirmDialog } from '../../common/dialogs';
import { SaveNotifier, SettingsDialog, withSaveErrors } from './shared';

interface SpecialtiesTabProps {
  specialties: Specialty[];
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

export const SpecialtiesTab: React.FC<SpecialtiesTabProps> = ({
  specialties,
  loadData,
  triggerSaveNotification,
}) => {
  const repo = getRepository();
  const specialtyModalTitleId = useId();

  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);

  const handleSaveSpecialty = withSaveErrors('save the specialty', async (sp: Partial<Specialty>) => {
    const codeClean = (sp.code || '').trim().toUpperCase();
    if (!codeClean || codeClean.length < 2 || codeClean.length > 5) {
      notify('Code must be 2 to 5 characters (e.g. CARD, PED).', 'warning');
      return;
    }
    if (sp.id) {
      await repo.update('specialties', sp.id, { name: sp.name, code: codeClean });
      triggerSaveNotification(`Specialty "${sp.name}" updated.`);
    } else {
      await repo.create('specialties', {
        name: sp.name || 'New Specialty',
        code: codeClean,
      });
      triggerSaveNotification(`Specialty "${sp.name}" created.`);
    }
    setIsSpecialtyModalOpen(false);
    setEditingSpecialty(null);
    loadData();
  });

  const handleDeleteSpecialty = withSaveErrors('delete the specialty', async (id: string, name: string) => {
    if (
      await confirmDialog({
        title: 'Delete specialty',
        message: `Delete specialty "${name}"?`,
        confirmLabel: 'Delete',
        danger: true,
      })
    ) {
      await repo.remove('specialties', id);
      triggerSaveNotification(`Specialty "${name}" deleted.`);
      loadData();
    }
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Clinic Specialties</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clinical specialty departments (3–5 char codes) used for doctor categorization and nurse pairing preferences.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSpecialty({
                id: '',
                name: '',
                code: '',
              });
              setIsSpecialtyModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Specialty</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded overflow-hidden max-w-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="py-2.5 px-3">Specialty Code</th>
                <th className="py-2.5 px-3">Specialty Name</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {specialties.map((sp) => (
                <tr key={sp.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                    {sp.code}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">{sp.name}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        aria-label={`Edit specialty ${sp.name}`}
                        onClick={() => {
                          setEditingSpecialty(sp);
                          setIsSpecialtyModalOpen(true);
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        aria-label={`Delete specialty ${sp.name}`}
                        onClick={() => handleDeleteSpecialty(sp.id, sp.name)}
                        className="p-1 hover:bg-red-50 rounded text-red-600 cursor-pointer"
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

      {isSpecialtyModalOpen && editingSpecialty && (
        <SettingsDialog
          onClose={() => setIsSpecialtyModalOpen(false)}
          labelledBy={specialtyModalTitleId}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          panelClassName="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4 text-xs"
        >
          <h3 id={specialtyModalTitleId} className="text-sm font-bold text-slate-900">
            {editingSpecialty.id ? 'Edit Specialty' : 'Add Specialty'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Specialty Name</label>
              <input
                aria-label="Specialty Name"
                type="text"
                value={editingSpecialty.name}
                onChange={(e) =>
                  setEditingSpecialty({ ...editingSpecialty, name: e.target.value })
                }
                placeholder="e.g. Ophthalmology"
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Code (3–5 characters)
              </label>
              <input
                aria-label="Code (3–5 characters)"
                type="text"
                maxLength={5}
                value={editingSpecialty.code}
                onChange={(e) =>
                  setEditingSpecialty({
                    ...editingSpecialty,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="OPHT"
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold uppercase"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSpecialtyModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveSpecialty(editingSpecialty)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
            >
              Save Specialty
            </button>
          </div>
        </SettingsDialog>
      )}
    </>
  );
};
