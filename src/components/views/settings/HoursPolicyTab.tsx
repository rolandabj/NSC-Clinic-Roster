/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Hours Policy tab.
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, Save, Check, RefreshCw } from 'lucide-react';
import { HoursPolicyConfig } from '../../../types/settings';
import { SaveStatus, SettingsTab } from './shared';

interface HoursPolicyTabProps {
  hoursPolicy: HoursPolicyConfig;
  hoursPolicySaveStatus: SaveStatus;
  updateHoursPolicyField: (updates: Partial<HoursPolicyConfig>, immediate?: boolean) => void;
  flushHoursPolicySave: () => void;
  handleSaveHoursPolicy: (e: React.FormEvent) => void;
  setActiveTab: (tab: SettingsTab) => void;
}

export const HoursPolicyTab: React.FC<HoursPolicyTabProps> = ({
  hoursPolicy,
  hoursPolicySaveStatus,
  updateHoursPolicyField,
  flushHoursPolicySave,
  handleSaveHoursPolicy,
  setActiveTab,
}) => {

  return (
    <form onSubmit={handleSaveHoursPolicy} className="space-y-4 max-w-2xl text-xs">
      <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Hours Accounting &amp; Working Limits Policy</h2>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Standard rest intervals, working limits, and leave crediting policy. Full-time target hours per cycle are configured in{' '}
            <button
              type="button"
              onClick={() => setActiveTab('working-hours-periods')}
              className="text-indigo-600 hover:text-indigo-800 underline font-semibold cursor-pointer"
            >
              Dedicated Time Periods
            </button>
            .
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          {hoursPolicySaveStatus === 'saving' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200 shadow-2xs">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
              <span>Saving...</span>
            </span>
          )}
          {hoursPolicySaveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>All changes saved ✓</span>
            </span>
          )}
          {hoursPolicySaveStatus === 'error' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200 shadow-2xs">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>Error saving</span>
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Max Duties / Nurse / Day
            </label>
            <input
              aria-label="Max Duties / Nurse / Day"
              type="number"
              value={hoursPolicy.maxDutiesPerDay}
              onChange={(e) =>
                updateHoursPolicyField({ maxDutiesPerDay: Number(e.target.value) })
              }
              onBlur={flushHoursPolicySave}
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Default = 1</span>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Min Rest Between Duties
            </label>
            <input
              aria-label="Min Rest Between Duties"
              type="number"
              value={hoursPolicy.minRestBetweenDuties}
              onChange={(e) =>
                updateHoursPolicyField({ minRestBetweenDuties: Number(e.target.value) })
              }
              onBlur={flushHoursPolicySave}
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Default = 11 hours
            </span>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Max Consecutive Days
            </label>
            <input
              aria-label="Max Consecutive Days"
              type="number"
              value={hoursPolicy.maxConsecutiveDays}
              onChange={(e) =>
                updateHoursPolicyField({ maxConsecutiveDays: Number(e.target.value) })
              }
              onBlur={flushHoursPolicySave}
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Default = 6 days</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hoursPolicy.leaveCreditsCountTowardTarget}
              onChange={(e) =>
                updateHoursPolicyField(
                  { leaveCreditsCountTowardTarget: e.target.checked },
                  true
                )
              }
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <div>
              <span className="font-semibold text-slate-800">
                Master Toggle: Leave credits count toward hours target
              </span>
              <p className="text-[11px] text-slate-500">
                When enabled, approved leave days (BL, AL, PH, SL) contribute credited hours to the nurse's contracted target.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={hoursPolicySaveStatus === 'saving'}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{hoursPolicySaveStatus === 'saving' ? 'Saving...' : 'Save Hours Policy'}</span>
        </button>
        {hoursPolicySaveStatus === 'saved' && (
          <span className="text-slate-500 text-[11px] flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Auto-saved to database &amp; synced with rules
          </span>
        )}
      </div>
    </form>
  );
};
