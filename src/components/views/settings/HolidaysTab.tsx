/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Public Holidays tab.
 */

import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { PublicHoliday } from '../../../types';
import { formatDate, localTodayIso } from '../../../utils/dateUtils';
import { applyHolidayChangeToLeave } from '../../../services/hours/holidayLeave';
import { notify, confirmDialog } from '../../common/dialogs';
import { SaveNotifier, SettingsDialog, withSaveErrors } from './shared';
import { DateInput, Field, Input } from '../../ui';

interface HolidaysTabProps {
  holidays: PublicHoliday[];
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
}

export const HolidaysTab: React.FC<HolidaysTabProps> = ({ holidays, loadData, triggerSaveNotification }) => {
  const repo = getRepository();

  const [editingHoliday, setEditingHoliday] = useState<PublicHoliday | null>(null);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const today = localTodayIso();
  const thisYear = today.slice(0, 4);
  const sorted = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  const pastCount = sorted.filter((h) => h.date.slice(0, 4) < thisYear).length;
  const visible = showPast ? sorted : sorted.filter((h) => h.date.slice(0, 4) >= thisYear);
  const years = Array.from(new Set(visible.map((h) => h.date.slice(0, 4))));

  /** Leave on the changed dates follows the holidays; the holiday itself is already saved when this fails. */
  const leaveFollows = async (before: string[], after: string[]): Promise<number> => {
    try {
      return await applyHolidayChangeToLeave(repo, before, after);
    } catch (err: any) {
      notify(`The holiday is saved, but leave on that day could not be updated (${err?.message || err}). Use Tidy public holiday leave on Leave and days off.`, 'warning');
      return 0;
    }
  };

  const handleSaveHoliday = withSaveErrors('save the holiday', async (hol: Partial<PublicHoliday>) => {
    const name = (hol.name || '').trim();
    const date = hol.date || '';
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !name) {
      notify('Enter the name and the date of the holiday.', 'warning');
      return;
    }
    const sameDay = holidays.find((h) => h.date === hol.date && h.id !== hol.id);
    if (sameDay) {
      notify(`${formatDate(hol.date)} is already a public holiday (${sameDay.name}).`, 'warning');
      return;
    }
    hol = { ...hol, name, hijriNote: (hol.hijriNote || '').trim() };
    const before = holidays.map((h) => h.date);
    const after = [...holidays.filter((h) => h.id !== hol.id).map((h) => h.date), date];
    if (hol.id) {
      const { id, ...fields } = hol;
      await repo.update('holidays', id, fields as any);
    } else {
      await repo.create('holidays', {
        date,
        name,
        country: hol.country || 'AE',
        hijriNote: hol.hijriNote,
      });
    }
    // Leave counts 0 h on a public holiday (the period hours already leave it out).
    const leaveChanged = await leaveFollows(before, after);
    const leaveNote = leaveChanged > 0 ? ` Leave on that day now counts 0 h (${leaveChanged} ${leaveChanged === 1 ? 'entry' : 'entries'}).` : '';
    triggerSaveNotification(`Holiday "${hol.name}" ${hol.id ? 'updated' : 'added'}.${leaveNote}`);
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
      // Leave on that day counts its usual hours again.
      const leaveChanged = await leaveFollows(holidays.map((h) => h.date), holidays.filter((h) => h.id !== id).map((h) => h.date));
      triggerSaveNotification(`Holiday "${name}" deleted.${leaveChanged > 0 ? ` Leave on that day counts its usual hours again (${leaveChanged}).` : ''}`);
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
              On these days only the on call doctor works and one nurse covers the clinic, who then takes another day off of their choosing.
              The period hours already leave these days out, so leave counts 0 h on them. Check moon sighting dates each year.
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
          size="sm"
          title={editingHoliday.id ? 'Change the public holiday' : 'Add a public holiday'}
          onClose={() => setIsHolidayModalOpen(false)}
          onSave={() => handleSaveHoliday(editingHoliday)}
          saveLabel={editingHoliday.id ? 'Save changes' : 'Add the public holiday'}
        >
          <Field label="Name" hint="For example: National Day.">
            {(f) => <Input {...f} value={editingHoliday.name} onChange={(e) => setEditingHoliday({ ...editingHoliday, name: e.target.value })} />}
          </Field>
          <Field label="Date">
            {(f) => <DateInput {...f} value={editingHoliday.date || ''} onChange={(iso) => setEditingHoliday({ ...editingHoliday, date: iso })} />}
          </Field>
          <Field label="Hijri date" optional hint="For example: Shawwal 1 (approximate).">
            {(f) => <Input {...f} value={editingHoliday.hijriNote || ''} onChange={(e) => setEditingHoliday({ ...editingHoliday, hijriNote: e.target.value })} />}
          </Field>
        </SettingsDialog>
      )}
    </>
  );
};
