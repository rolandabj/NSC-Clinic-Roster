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
  const [showPast, setShowPast] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const thisYear = today.slice(0, 4);
  const sorted = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  const pastCount = sorted.filter((h) => h.date.slice(0, 4) < thisYear).length;
  const visible = showPast ? sorted : sorted.filter((h) => h.date.slice(0, 4) >= thisYear);
  const years = Array.from(new Set(visible.map((h) => h.date.slice(0, 4))));

  const handleSaveHoliday = withSaveErrors('save the holiday', async (hol: Partial<PublicHoliday>) => {
    const name = (hol.name || '').trim();
    const date = hol.date || '';
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !name) {
      notify('Date and holiday name are required.', 'warning');
      return;
    }
    const sameDay = holidays.find((h) => h.date === hol.date && h.id !== hol.id);
    if (sameDay) {
      notify(`${hol.date} is already a public holiday ("${sameDay.name}").`, 'warning');
      return;
    }
    hol = { ...hol, name, hijriNote: (hol.hijriNote || '').trim() };
    if (hol.id) {
      const { id, ...fields } = hol;
      await repo.update('holidays', id, fields as any);
      triggerSaveNotification(`Holiday "${hol.name}" updated.`);
    } else {
      await repo.create('holidays', {
        date,
        name,
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
            <h2 className="text-sm font-semibold text-slate-900">Public holidays</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              On these days only the on call doctor works and one nurse covers the clinic. Check moon sighting dates each year.
              Changes apply to a roster when it is generated or checked again.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingHoliday({
                id: '',
                date: today,
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

        {pastCount > 0 && (
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer w-fit">
            <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="rounded" />
            <span>Show past years ({pastCount})</span>
          </label>
        )}

        {visible.length === 0 ? (
          <p className="p-4 rounded border border-dashed border-slate-300 text-center text-xs text-slate-500">
            No public holidays for {thisYear} or later yet. Add them so holiday cover is planned.
          </p>
        ) : (
          years.map((year) => (
            <div key={year} className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-700">{year}</h3>
              <div className="border border-slate-200 rounded overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                    <tr>
                      <th className="py-2 px-3 w-32">Date</th>
                      <th className="py-2 px-3">Holiday</th>
                      <th className="py-2 px-3">Note</th>
                      <th className="py-2 px-3 text-right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible
                      .filter((h) => h.date.startsWith(year))
                      .map((h) => (
                        <tr key={h.id} className={`hover:bg-slate-50/80 ${h.date < today ? 'text-slate-400' : ''}`}>
                          <td className="py-2 px-3 font-mono font-semibold whitespace-nowrap">
                            {new Date(`${h.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                          </td>
                          <td className="py-2 px-3 font-medium">{h.name}</td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">{h.hijriNote || ''}</td>
                          <td className="py-2 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
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
                              type="button"
                              aria-label={`Delete holiday ${h.name}`}
                              onClick={() => handleDeleteHoliday(h.id, h.name)}
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
            </div>
          ))
        )}
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
