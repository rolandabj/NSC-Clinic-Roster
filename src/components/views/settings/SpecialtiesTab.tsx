/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Specialties tab.
 */

import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { Specialty } from '../../../types';
import { localTodayIso } from '../../../utils/dateUtils';
import { notify, confirmDialog } from '../../common/dialogs';
import { SaveNotifier, SettingsDialog, withSaveErrors } from './shared';
import { Field, Input } from '../../ui';

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

  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);

  const handleSaveSpecialty = withSaveErrors('save the specialty', async (sp: Partial<Specialty>) => {
    const codeClean = (sp.code || '').trim().toUpperCase();
    const name = (sp.name || '').trim();
    if (!name) {
      notify('Enter a name for the specialty.', 'warning');
      return;
    }
    if (!/^[A-Z0-9]{2,5}$/.test(codeClean)) {
      notify('Enter a code of 2 to 5 letters or numbers, for example CARD or PED.', 'warning');
      return;
    }
    const duplicate = specialties.find((x) => x.code.toUpperCase() === codeClean && x.id !== sp.id);
    if (duplicate) {
      notify(`${duplicate.name} already has the code ${codeClean}.`, 'warning');
      return;
    }
    sp = { ...sp, name };
    if (sp.id) {
      await repo.update('specialties', sp.id, { name: sp.name, code: codeClean });
      triggerSaveNotification(`Specialty "${sp.name}" updated.`);
    } else {
      await repo.create('specialties', {
        name,
        code: codeClean,
      });
      triggerSaveNotification(`Specialty "${sp.name}" created.`);
    }
    setIsSpecialtyModalOpen(false);
    setEditingSpecialty(null);
    loadData();
  });

  const handleDeleteSpecialty = withSaveErrors('delete the specialty', async (id: string, name: string) => {
    // Doctors, upcoming sessions and nurse preferences that still point at it would break.
    const today = localTodayIso();
    const [doctors, sessions, nurses, locks, templates] = await Promise.all([
      repo.list('doctors'),
      repo.list('doctorSessions', { field: 'specialtyId', operator: '==', value: id }),
      repo.list('nurses'),
      repo.list('locks'),
      repo.list('templates'),
    ]);
    const inLocksOrTemplates =
      locks.some((l: any) => l.targetRefId === id || l.specialtyId === id) ||
      templates.some((t: any) => JSON.stringify(t).includes(`"${id}"`));
    const doctorsUsing = doctors.filter((d) => (d.specialtyIds || []).includes(id));
    const upcoming = sessions.filter((x) => x.date >= today && !x.cancelled);
    const nursesUsing = nurses.filter((n) => (n.preferences || []).some((p) => p.kind === 'SPECIALTY' && p.refId === id));
    const uses = [
      doctorsUsing.length ? `${doctorsUsing.length} doctor${doctorsUsing.length === 1 ? '' : 's'} (${doctorsUsing.slice(0, 3).map((d) => d.fullName).join(', ')}${doctorsUsing.length > 3 ? ', …' : ''})` : '',
      upcoming.length ? `${upcoming.length} upcoming session${upcoming.length === 1 ? '' : 's'}` : '',
      nursesUsing.length ? `the preferences of ${nursesUsing.length} nurse${nursesUsing.length === 1 ? '' : 's'}` : '',
      inLocksOrTemplates ? 'pinned shifts or a template' : '',
    ].filter(Boolean);
    if (uses.length > 0) {
      notify(`"${name}" is still used by ${uses.join(', ')}. Change those first, then delete it.`, 'warning');
      return;
    }
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
              The doctors' specialties, each with a short code (2 to 5 letters). Used to group doctors and for nurses' pairing preferences.
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
          size="sm"
          title={editingSpecialty.id ? 'Change the specialty' : 'Add a specialty'}
          onClose={() => setIsSpecialtyModalOpen(false)}
          onSave={() => handleSaveSpecialty(editingSpecialty)}
          saveLabel={editingSpecialty.id ? 'Save changes' : 'Add the specialty'}
        >
          <Field label="Name" hint="For example: Ophthalmology.">
            {(f) => <Input {...f} value={editingSpecialty.name} onChange={(e) => setEditingSpecialty({ ...editingSpecialty, name: e.target.value })} />}
          </Field>
          <Field label="Code" hint="2 to 5 letters, for example OPHT.">
            {(f) => (
              <Input {...f} maxLength={5} value={editingSpecialty.code} onChange={(e) => setEditingSpecialty({ ...editingSpecialty, code: e.target.value.toUpperCase() })} className="font-mono uppercase" />
            )}
          </Field>
        </SettingsDialog>
      )}
    </>
  );
};
