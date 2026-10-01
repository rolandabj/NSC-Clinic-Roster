/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Clinic tab.
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, Save, Check, RefreshCw } from 'lucide-react';
import { ClinicProfile } from '../../../types';
import { getWeekendDays } from '../../../utils/weekend';
import { SaveStatus, WEEKDAY_NAMES } from './shared';

interface ClinicTabProps {
  clinic: ClinicProfile;
  clinicSaveStatus: SaveStatus;
  updateClinicField: (updates: Partial<ClinicProfile>, immediate?: boolean) => void;
  flushClinicSave: () => void;
  handleSaveClinicProfile: (e: React.FormEvent) => void;
}

export const ClinicTab: React.FC<ClinicTabProps> = ({
  clinic,
  clinicSaveStatus,
  updateClinicField,
  flushClinicSave,
  handleSaveClinicProfile,
}) => {

  return (
    <form onSubmit={handleSaveClinicProfile} className="space-y-5 max-w-2xl text-xs">
      <div className="border-b border-slate-100 pb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Clinic Profile &amp; Scheduling Baseline</h2>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Baseline clinic credentials and default operating hours for schedule generation.
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          {clinicSaveStatus === 'saving' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200 shadow-2xs">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
              <span>Saving...</span>
            </span>
          )}
          {clinicSaveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>All changes saved ✓</span>
            </span>
          )}
          {clinicSaveStatus === 'error' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200 shadow-2xs">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>Error saving</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block font-medium text-slate-700 mb-1">Clinic Name</label>
          <input
            aria-label="Clinic Name"
            type="text"
            value={clinic.name}
            onChange={(e) => updateClinicField({ name: e.target.value })}
            onBlur={flushClinicSave}
            required
            className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Clinic Timezone</label>
          <input
            aria-label="Clinic Timezone"
            type="text"
            value={clinic.timezone}
            onChange={(e) => updateClinicField({ timezone: e.target.value })}
            onBlur={flushClinicSave}
            className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono bg-slate-50 text-slate-700"
          />
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Dates and hours are calculated in this timezone (default: Asia/Dubai).
          </span>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Default Block Weeks</label>
          <select
            aria-label="Default Block Weeks"
            value={clinic.defaultBlockWeeks}
            onChange={(e) =>
              updateClinicField({ defaultBlockWeeks: Number(e.target.value) as any }, true)
            }
            className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
          >
            <option value={1}>1 Week (7-day blocks)</option>
            <option value={2}>2 Weeks (14-day blocks - Default)</option>
            <option value={3}>3 Weeks (21-day blocks)</option>
            <option value={4}>4 Weeks (28-day blocks)</option>
          </select>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Controls default workbook pagination and PDF print block spans.
          </span>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Daily Clinic Open Time</label>
          <input
            aria-label="Daily Clinic Open Time"
            type="time"
            value={clinic.openTime}
            onChange={(e) => updateClinicField({ openTime: e.target.value })}
            onBlur={flushClinicSave}
            required
            className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Daily Clinic Close Time</label>
          <input
            aria-label="Daily Clinic Close Time"
            type="time"
            value={clinic.closeTime}
            onChange={(e) => updateClinicField({ closeTime: e.target.value })}
            onBlur={flushClinicSave}
            required
            className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-slate-700 mb-1.5">Working Days</label>
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_NAMES.map((name, idx) => {
              const isChecked = clinic.workingDays[idx];
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => {
                    const next = [...clinic.workingDays];
                    next[idx] = !next[idx];
                    updateClinicField({ workingDays: next }, true);
                  }}
                  className={`px-3 py-1 rounded border text-xs font-medium cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  {name} {isChecked ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-slate-700 mb-1.5">Weekend Days</label>
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_NAMES.map((name, idx) => {
              const weekend = clinic.weekendDays || getWeekendDays();
              const isWeekend = weekend.includes(idx);
              return (
                <button
                  type="button"
                  key={`weekend-${name}`}
                  aria-pressed={isWeekend}
                  onClick={() => {
                    const next = isWeekend ? weekend.filter((d) => d !== idx) : [...weekend, idx];
                    updateClinicField({ weekendDays: next }, true);
                  }}
                  className={`px-3 py-1 rounded border text-xs font-medium cursor-pointer transition-colors ${
                    isWeekend
                      ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  {name} {isWeekend ? '✓' : ''}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Used for weekend shading, weekend fairness and the scheduler's weekend balancing. UAE default: Saturday and Sunday.
          </p>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Clinic Address (Optional)</label>
          <input
            aria-label="Clinic Address (Optional)"
            type="text"
            value={clinic.address || ''}
            onChange={(e) => updateClinicField({ address: e.target.value })}
            onBlur={flushClinicSave}
            placeholder="e.g. Jumeirah Medical District, Dubai"
            className="w-full px-3 py-1.5 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
          <input
            aria-label="Phone Number (Optional)"
            type="text"
            value={clinic.phone || ''}
            onChange={(e) => updateClinicField({ phone: e.target.value })}
            onBlur={flushClinicSave}
            placeholder="+971 4 300 0000"
            className="w-full px-3 py-1.5 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={clinicSaveStatus === 'saving'}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{clinicSaveStatus === 'saving' ? 'Saving...' : 'Save Clinic Profile'}</span>
        </button>
        {clinicSaveStatus === 'saved' && (
          <span className="text-slate-500 text-[11px] flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Auto-saved to database
          </span>
        )}
      </div>
    </form>
  );
};
