/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Nurse skills tab (stored as clinical roles).
 *
 * Two skills are built in and drive the roster generator:
 *   - Nurse Clinic (NC): the nurse may run Nurse Clinic.
 *   - Blood collection (PHL): the Nurse Clinic nurse must have it.
 * Their code can't change and they can't be deleted, because the generator
 * finds them by code. Their hours follow the clinic's opening hours.
 *
 * Any other skill is an extra daily job: the generator assigns that many
 * nurses with the skill each day, in its time window.
 */

import React, { useEffect, useId, useState } from 'react';
import { Plus, Trash2, Edit2, Lock } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { ClinicalRole, Nurse } from '../../../types';
import { bloodCollectionRole, nurseClinicRoleOf } from '../../../services/engine/clinicModel';
import { notify, confirmDialog } from '../../common/dialogs';
import { SaveNotifier, SettingsDialog, withSaveErrors } from './shared';

interface NurseSkillsTabProps {
  clinicalRoles: ClinicalRole[];
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

const RESERVED_CODES = ['NC', 'PHL'];

const BUILT_IN = [
  {
    key: 'NC',
    id: 'role-nurse-clinic',
    name: 'Nurse Clinic',
    description: 'Can run Nurse Clinic.',
    explain:
      'Nurses with this skill can be the Nurse Clinic nurse. The number needed each hour is set by the Nurse Clinic rule in Rules, and the hours follow the clinic opening hours.',
  },
  {
    key: 'PHL',
    id: 'role-phl',
    name: 'Blood collection',
    description: 'Can take blood.',
    explain:
      'The Nurse Clinic nurse also does blood collection, so she needs this skill too. Nurses without it can still float or work with doctors.',
  },
] as const;

export const NurseSkillsTab: React.FC<NurseSkillsTabProps> = ({ clinicalRoles, loadData, triggerSaveNotification }) => {
  const repo = getRepository();
  const dialogTitleId = useId();
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [editing, setEditing] = useState<ClinicalRole | null>(null);

  useEffect(() => {
    repo
      .list('nurses')
      .then(setNurses)
      .catch((err) => console.warn('Could not load nurses for the skills page:', err));
  }, [clinicalRoles]);

  const ncRole = nurseClinicRoleOf(clinicalRoles);
  const phlRole = bloodCollectionRole(clinicalRoles);
  const builtInRole = (key: 'NC' | 'PHL') => (key === 'NC' ? ncRole : phlRole);
  const isBuiltIn = (role: ClinicalRole) => role.id === ncRole?.id || role.id === phlRole?.id;
  const otherSkills = clinicalRoles.filter((r) => !isBuiltIn(r));

  const nursesWith = (role: ClinicalRole) =>
    nurses.filter(
      (n) =>
        n.active !== false &&
        (n.capabilityIds.includes(role.id) || (role.id === ncRole?.id && n.capabilityIds.includes('role-nurse-clinic')))
    );

  const handleSetUpBuiltIn = withSaveErrors('add the skill', async (key: 'NC' | 'PHL') => {
    const def = BUILT_IN.find((b) => b.key === key)!;
    await repo.create('clinicalRoles', {
      id: def.id,
      name: def.name,
      acronym: def.key,
      description: def.description,
      defaultDailyQuota: 1,
    });
    triggerSaveNotification(`"${def.name}" added. Tick it on the nurses who have it.`);
    loadData();
  });

  const handleSave = withSaveErrors('save the skill', async (role: ClinicalRole) => {
    const name = (role.name || '').trim();
    if (!name) {
      notify('Please enter a name.', 'warning');
      return;
    }

    if (role.id && isBuiltIn(role)) {
      // Built in skills: only the name and description can change.
      await repo.update('clinicalRoles', role.id, { name, description: (role.description || '').trim() });
    } else {
      const code = (role.acronym || '').trim().toUpperCase();
      if (!/^[A-Z0-9]{1,4}$/.test(code)) {
        notify('The code must be 1 to 4 letters or numbers.', 'warning');
        return;
      }
      if (RESERVED_CODES.includes(code)) {
        notify(`${code} is used by a built in skill. Choose another code.`, 'warning');
        return;
      }
      const duplicate = clinicalRoles.find((r) => r.acronym.toUpperCase() === code && r.id !== role.id);
      if (duplicate) {
        notify(`The code ${code} is already used by "${duplicate.name}".`, 'warning');
        return;
      }
      const perDay = Number(role.defaultDailyQuota);
      if (!Number.isInteger(perDay) || perDay < 1 || perDay > 20) {
        notify('Nurses needed per day must be a whole number from 1 to 20.', 'warning');
        return;
      }
      const startTime = role.defaultStartTime || '09:00';
      const endTime = role.defaultEndTime || '13:00';
      if (startTime >= endTime) {
        notify('The end time must be after the start time.', 'warning');
        return;
      }
      const fields = {
        name,
        acronym: code,
        description: (role.description || '').trim(),
        defaultDailyQuota: perDay,
        defaultStartTime: startTime,
        defaultEndTime: endTime,
      };
      if (role.id) await repo.update('clinicalRoles', role.id, fields);
      else await repo.create('clinicalRoles', fields);
    }
    triggerSaveNotification(`"${name}" saved.`);
    setEditing(null);
    loadData();
  });

  const handleDelete = withSaveErrors('delete the skill', async (role: ClinicalRole) => {
    const holders = nursesWith(role);
    if (holders.length > 0) {
      notify(
        `"${role.name}" is ticked on ${holders.length} nurse${holders.length === 1 ? '' : 's'} (${holders
          .slice(0, 5)
          .map((n) => n.fullName)
          .join(', ')}${holders.length > 5 ? ', …' : ''}). Untick it on their profiles first.`,
        'warning'
      );
      return;
    }
    if (
      await confirmDialog({
        title: 'Delete skill',
        message: `Delete "${role.name}"? The roster generator will stop assigning this job. Shifts already in rosters keep their code.`,
        confirmLabel: 'Delete',
        danger: true,
      })
    ) {
      await repo.remove('clinicalRoles', role.id);
      triggerSaveNotification(`"${role.name}" deleted.`);
      loadData();
    }
  });

  const editingBuiltIn = !!editing?.id && isBuiltIn(editing);

  return (
    <>
      <div className="space-y-6 text-xs">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Nurse skills</h2>
          <p className="text-slate-500 mt-0.5">Skills you tick on a nurse's profile. The roster generator uses them to decide who can do which job.</p>
        </div>

        {/* Built in skills */}
        <div className="grid gap-3 md:grid-cols-2">
          {BUILT_IN.map((def) => {
            const role = builtInRole(def.key);
            const count = role ? nursesWith(role).length : 0;
            return (
              <div key={def.key} className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-indigo-700">{def.key}</span>
                      <span className="font-semibold text-slate-900">{role?.name || def.name}</span>
                      <span className="inline-flex items-center gap-0.5 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                        <Lock className="w-2.5 h-2.5" aria-hidden="true" /> Built in
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{def.explain}</p>
                  </div>
                  {role && (
                    <button
                      type="button"
                      aria-label={`Edit ${role.name}`}
                      onClick={() => setEditing(role)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer shrink-0"
                    >
                      <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
                {role ? (
                  <p className={`text-[11px] font-medium ${count === 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                    {count === 0 ? 'No active nurse has this skill yet.' : `${count} active nurse${count === 1 ? '' : 's'} have this skill.`}
                  </p>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-amber-800">Not set up, so the generator doesn't check this skill.</p>
                    <button
                      type="button"
                      onClick={() => handleSetUpBuiltIn(def.key)}
                      className="shrink-0 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer"
                    >
                      Set up
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Other skills (extra daily jobs) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Other skills</h3>
              <p className="text-slate-500 mt-0.5">
                Each one is an extra daily job: the generator assigns that many nurses with the skill each day, during its hours.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditing({ id: '', name: '', acronym: '', description: '', defaultDailyQuota: 1, defaultStartTime: '09:00', defaultEndTime: '13:00' })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add skill</span>
            </button>
          </div>

          {otherSkills.length === 0 ? (
            <p className="p-4 rounded border border-dashed border-slate-300 text-center text-slate-500">
              No other skills. Add one only if the clinic has another daily job, such as wound care.
            </p>
          ) : (
            <div className="border border-slate-200 rounded overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Nurses per day</th>
                    <th className="py-2.5 px-3">Hours</th>
                    <th className="py-2.5 px-3">Nurses with it</th>
                    <th className="py-2.5 px-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {otherSkills.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{role.acronym}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-slate-800">{role.name}</span>
                        {role.description && <span className="block text-[11px] text-slate-500">{role.description}</span>}
                      </td>
                      <td className="py-2.5 px-3 font-mono">{role.defaultDailyQuota || 1}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {role.defaultStartTime || '09:00'} to {role.defaultEndTime || '13:00'}
                      </td>
                      <td className="py-2.5 px-3">{nursesWith(role).length}</td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          aria-label={`Edit ${role.name}`}
                          onClick={() => setEditing(role)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${role.name}`}
                          onClick={() => handleDelete(role)}
                          className="p-1 hover:bg-red-50 rounded text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <SettingsDialog
          onClose={() => setEditing(null)}
          labelledBy={dialogTitleId}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          panelClassName="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
        >
          <h3 id={dialogTitleId} className="text-sm font-bold text-slate-900">
            {editing.id ? `Edit ${editing.name || 'skill'}` : 'Add skill'}
          </h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="skill-name" className="block font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                id="skill-name"
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Wound care"
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>

            {editingBuiltIn ? (
              <p className="text-[11px] text-slate-500">
                The code <span className="font-mono font-bold">{editing.acronym}</span> is fixed, because the roster generator finds this skill by its code.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="skill-code" className="block font-medium text-slate-700 mb-1">
                      Code (shown on the roster)
                    </label>
                    <input
                      id="skill-code"
                      type="text"
                      maxLength={4}
                      value={editing.acronym}
                      onChange={(e) => setEditing({ ...editing, acronym: e.target.value.toUpperCase() })}
                      placeholder="WND"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label htmlFor="skill-per-day" className="block font-medium text-slate-700 mb-1">
                      Nurses needed per day
                    </label>
                    <input
                      id="skill-per-day"
                      type="number"
                      min={1}
                      max={20}
                      step={1}
                      value={editing.defaultDailyQuota}
                      onChange={(e) => setEditing({ ...editing, defaultDailyQuota: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="skill-start" className="block font-medium text-slate-700 mb-1">
                      From
                    </label>
                    <input
                      id="skill-start"
                      type="time"
                      value={editing.defaultStartTime || '09:00'}
                      onChange={(e) => setEditing({ ...editing, defaultStartTime: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="skill-end" className="block font-medium text-slate-700 mb-1">
                      To
                    </label>
                    <input
                      id="skill-end"
                      type="time"
                      value={editing.defaultEndTime || '13:00'}
                      onChange={(e) => setEditing({ ...editing, defaultEndTime: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="skill-description" className="block font-medium text-slate-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="skill-description"
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(editing)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
            >
              Save
            </button>
          </div>
        </SettingsDialog>
      )}
    </>
  );
};
