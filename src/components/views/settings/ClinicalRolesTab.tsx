/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Clinical Roles tab.
 */

import React, { useId, useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { ClinicalRole } from '../../../types';
import { notify, confirmDialog } from '../../common/dialogs';
import { SaveNotifier, SettingsDialog } from './shared';

interface ClinicalRolesTabProps {
  clinicalRoles: ClinicalRole[];
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

export const ClinicalRolesTab: React.FC<ClinicalRolesTabProps> = ({
  clinicalRoles,
  loadData,
  triggerSaveNotification,
}) => {
  const repo = getRepository();
  const clinicalRoleModalTitleId = useId();

  const [editingClinicalRole, setEditingClinicalRole] = useState<ClinicalRole | null>(null);
  const [isClinicalRoleModalOpen, setIsClinicalRoleModalOpen] = useState(false);

  const handleSaveClinicalRole = async (role: Partial<ClinicalRole>) => {
    const acronymClean = (role.acronym || '').trim().toUpperCase();
    if (!acronymClean || acronymClean.length > 4) {
      notify('Acronym required (max 4 chars).', 'warning');
      return;
    }
    const startTime = role.defaultStartTime || '09:00';
    const endTime = role.defaultEndTime || '13:00';

    if (startTime >= endTime) {
      notify('Operating End Time must be later than Operating Start Time.', 'warning');
      return;
    }

    if (role.id) {
      await repo.update('clinicalRoles', role.id, {
        ...role,
        acronym: acronymClean,
        defaultStartTime: startTime,
        defaultEndTime: endTime,
      } as any);
      triggerSaveNotification(`Role "${role.name}" updated.`);
    } else {
      await repo.create('clinicalRoles', {
        name: role.name || 'New Role',
        acronym: acronymClean,
        description: role.description || '',
        defaultDailyQuota: role.defaultDailyQuota || 1,
        defaultStartTime: startTime,
        defaultEndTime: endTime,
      });
      triggerSaveNotification(`Role "${role.name}" added.`);
    }
    setIsClinicalRoleModalOpen(false);
    setEditingClinicalRole(null);
    loadData();
  };

  const handleDeleteClinicalRole = async (id: string, name: string) => {
    if (
      await confirmDialog({
        title: 'Delete clinical role',
        message: `Delete clinical role "${name}"?`,
        confirmLabel: 'Delete',
        danger: true,
      })
    ) {
      await repo.remove('clinicalRoles', id);
      triggerSaveNotification(`Role "${name}" deleted.`);
      loadData();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Clinical Support Roles</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clinical assignments requiring specific nurse capability credentials (e.g. Blood Collection &amp; IV) and daily staffing quotas.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingClinicalRole({
                id: '',
                name: '',
                acronym: '',
                description: '',
                defaultDailyQuota: 1,
                defaultStartTime: '09:00',
                defaultEndTime: '13:00',
              });
              setIsClinicalRoleModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Clinical Role</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="py-2.5 px-3">Acronym</th>
                <th className="py-2.5 px-3">Role Name</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Daily Quota</th>
                <th className="py-2.5 px-3">Default Window</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clinicalRoles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                    {role.acronym}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{role.name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{role.description}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                    {role.defaultDailyQuota} nurse/day
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span>
                        {role.defaultStartTime || '09:00'} – {role.defaultEndTime || '13:00'}
                      </span>
                      {(() => {
                        const [sh, sm] = (role.defaultStartTime || '09:00').split(':').map(Number);
                        const [eh, em] = (role.defaultEndTime || '13:00').split(':').map(Number);
                        const diffHours = ((eh * 60 + em) - (sh * 60 + sm)) / 60;
                        return diffHours > 0 ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                            {diffHours}h
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        aria-label={`Edit clinical role ${role.name}`}
                        onClick={() => {
                          setEditingClinicalRole(role);
                          setIsClinicalRoleModalOpen(true);
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        aria-label={`Delete clinical role ${role.name}`}
                        onClick={() => handleDeleteClinicalRole(role.id, role.name)}
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

      {isClinicalRoleModalOpen && editingClinicalRole && (
        <SettingsDialog
          onClose={() => setIsClinicalRoleModalOpen(false)}
          labelledBy={clinicalRoleModalTitleId}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          panelClassName="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
        >
          <h3 id={clinicalRoleModalTitleId} className="text-sm font-bold text-slate-900">
            {editingClinicalRole.id ? 'Edit Clinical Role' : 'Add Clinical Role'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Role Name</label>
              <input
                aria-label="Role Name"
                type="text"
                value={editingClinicalRole.name}
                onChange={(e) =>
                  setEditingClinicalRole({ ...editingClinicalRole, name: e.target.value })
                }
                placeholder="e.g. Wound Care Specialist"
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Acronym</label>
                <input
                  aria-label="Acronym"
                  type="text"
                  maxLength={4}
                  value={editingClinicalRole.acronym}
                  onChange={(e) =>
                    setEditingClinicalRole({
                      ...editingClinicalRole,
                      acronym: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="WND"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold uppercase"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Daily Staffing Quota
                </label>
                <input
                  aria-label="Daily Staffing Quota"
                  type="number"
                  value={editingClinicalRole.defaultDailyQuota}
                  onChange={(e) =>
                    setEditingClinicalRole({
                      ...editingClinicalRole,
                      defaultDailyQuota: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center"
                />
              </div>
            </div>

            {/* Operating Time Window */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Operating Start Time
                </label>
                <input
                  aria-label="Operating Start Time"
                  type="time"
                  value={editingClinicalRole.defaultStartTime || '09:00'}
                  onChange={(e) =>
                    setEditingClinicalRole({
                      ...editingClinicalRole,
                      defaultStartTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs bg-white"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Operating End Time
                </label>
                <input
                  aria-label="Operating End Time"
                  type="time"
                  value={editingClinicalRole.defaultEndTime || '13:00'}
                  onChange={(e) =>
                    setEditingClinicalRole({
                      ...editingClinicalRole,
                      defaultEndTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Description</label>
              <textarea
                aria-label="Description"
                value={editingClinicalRole.description}
                onChange={(e) =>
                  setEditingClinicalRole({
                    ...editingClinicalRole,
                    description: e.target.value,
                  })
                }
                rows={2}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsClinicalRoleModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveClinicalRole(editingClinicalRole)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
            >
              Save Role
            </button>
          </div>
        </SettingsDialog>
      )}
    </>
  );
};
