/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Public Holidays tab.
 */

import React, { useId, useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { PublicHoliday } from '../../../types';
import { notify, confirmDialog } from '../../common/dialogs';
import { SaveNotifier, SettingsDialog, withSaveErrors } from './shared';

interface HolidaysTabProps {
  holidays: PublicHoliday[];
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

export const HolidaysTab: React.FC<HolidaysTabProps> = ({ holidays, loadData, triggerSaveNotification }) => {
  const repo = getRepository();
  const holidayModalTitleId = useId();

  const [editingHoliday, setEditingHoliday] = useState<PublicHoliday | null>(null);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  const handleSaveHoliday = withSaveErrors('save the holiday', async (hol: Partial<PublicHoliday>) => {
    if (!hol.date || !hol.name) {
      notify('Date and holiday name are required.', 'warning');
      return;
    }
    if (hol.id) {
      await repo.update('holidays', hol.id, hol as any);
      triggerSaveNotification(`Holiday "${hol.name}" updated.`);
    } else {
      await repo.create('holidays', {
        date: hol.date,
        name: hol.name,
        country: hol.country || 'AE',
        hijriNote: hol.hijriNote,
      });
      triggerSaveNotification(`Holiday "${hol.name}" added.`);
    }
    setIsHolidayModalOpen(false);
    setEditingHoliday(null);
    loadData();
  });

  const handleDeleteHoliday = withSaveErrors('delete the holiday', async (id: string, name: string) => {
    if (
      await confirmDialog({
        title: 'Delete public holiday',
        message: `Delete public holiday "${name}"?`,
        confirmLabel: 'Delete',
        danger: true,
      })
    ) {
      await repo.remove('holidays', id);
      triggerSaveNotification(`Holiday "${name}" deleted.`);
      loadData();
    }
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">UAE Public Holidays (2025–2027)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official observatory holidays. Approximate Hijri-based dates should be verified each year upon lunar sighting confirmation.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingHoliday({
                id: '',
                date: '2026-10-29',
                name: '',
                country: 'AE',
                hijriNote: '',
              });
              setIsHolidayModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Public Holiday</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Holiday Name</th>
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3">Hijri Equivalent / Notes</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holidays.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                    {h.date}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{h.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{h.country}</td>
                  <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">
                    {h.hijriNote || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        aria-label={`Edit holiday ${h.name}`}
                        onClick={() => {
                          setEditingHoliday(h);
                          setIsHolidayModalOpen(true);
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        aria-label={`Delete holiday ${h.name}`}
                        onClick={() => handleDeleteHoliday(h.id, h.name)}
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

      {isHolidayModalOpen && editingHoliday && (
        <SettingsDialog
          onClose={() => setIsHolidayModalOpen(false)}
          labelledBy={holidayModalTitleId}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          panelClassName="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4 text-xs"
        >
          <h3 id={holidayModalTitleId} className="text-sm font-bold text-slate-900">
            {editingHoliday.id ? 'Edit Public Holiday' : 'Add Public Holiday'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Holiday Name</label>
              <input
                aria-label="Holiday Name"
                type="text"
                value={editingHoliday.name}
                onChange={(e) =>
                  setEditingHoliday({ ...editingHoliday, name: e.target.value })
                }
                placeholder="e.g. National Day"
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Date (YYYY-MM-DD)</label>
              <input
                aria-label="Date (YYYY-MM-DD)"
                type="date"
                value={editingHoliday.date}
                onChange={(e) =>
                  setEditingHoliday({ ...editingHoliday, date: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Hijri Equivalent Note (Optional)
              </label>
              <input
                aria-label="Hijri Equivalent Note (Optional)"
                type="text"
                value={editingHoliday.hijriNote || ''}
                onChange={(e) =>
                  setEditingHoliday({ ...editingHoliday, hijriNote: e.target.value })
                }
                placeholder="e.g. Shawwal 1 (approximate)"
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-600"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsHolidayModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveHoliday(editingHoliday)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
            >
              Save Holiday
            </button>
          </div>
        </SettingsDialog>
      )}
    </>
  );
};
