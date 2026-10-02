/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Coverage tab: the roster checker's hour by hour results, so this tab, the
 * problem list and the generator all apply the same clinic rules:
 *   - a free nurse (not with a doctor, able to run Nurse Clinic) every opening hour;
 *   - one senior nurse on duty each day;
 *   - on a public holiday, one nurse covering the opening hours.
 */

import React, { useEffect, useState } from 'react';
import { Activity, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Assignment, DutyWindow, ClinicalRole, Nurse, SeniorityLevel } from '../../types';
import { ValidationReport } from '../../services/validation/ScheduleValidator';
import { bloodCollectionRole } from '../../services/engine/clinicModel';
import { formatDate } from '../../utils/dateUtils';

interface CoverageSheetProps {
  blockDates: string[];
  assignments: Assignment[];
  dutyWindows: DutyWindow[];
  roles: ClinicalRole[];
  nurses: Nurse[];
  seniorityLevels: SeniorityLevel[];
  validationReport: ValidationReport;
}

export const CoverageSheet: React.FC<CoverageSheetProps> = ({
  blockDates,
  assignments,
  dutyWindows,
  roles,
  nurses,
  seniorityLevels,
  validationReport,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(blockDates[0] || '');
  // Follow the page of days when it changes.
  useEffect(() => {
    if (!blockDates.includes(selectedDate)) setSelectedDate(blockDates[0] || '');
  }, [blockDates.join(',')]);

  const dutyMap = new Map(dutyWindows.map((d) => [d.id, d]));
  const nurseMap = new Map(nurses.map((n) => [n.id, n]));
  const seniorLevelIds = new Set(seniorityLevels.filter((s) => s.isSenior).map((s) => s.id));
  const phlRole = bloodCollectionRole(roles);

  const dayAssignments = assignments.filter((a) => a.date === selectedDate && dutyMap.has(a.dutyWindowId));
  const dayHours = validationReport.hourlyCoverageMap[selectedDate] || {};
  const hourKeys = Object.keys(dayHours).sort();
  const isHoliday = hourKeys.some((h) => dayHours[h].holiday);

  const seniorToday = dayAssignments.some((a) => {
    const n = nurseMap.get(a.nurseId);
    return !!n && seniorLevelIds.has(n.seniorityLevelId);
  });
  const bloodToday = new Set(
    dayAssignments
      .filter((a) => !phlRole || nurseMap.get(a.nurseId)?.capabilityIds.includes(phlRole.id))
      .map((a) => a.nurseId)
  ).size;

  // Every hour in this page of days that is short of a free nurse.
  const gaps = blockDates.flatMap((date) => {
    const map = validationReport.hourlyCoverageMap[date] || {};
    return Object.keys(map)
      .sort()
      .filter((hour) => map[hour].deficit > 0)
      .map((hour) => ({ date, hour, ...map[hour] }));
  });

  const checked = Object.keys(validationReport.hourlyCoverageMap).length > 0;

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden text-xs">
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" aria-hidden="true" />
          <span className="font-bold text-slate-800">Coverage by hour</span>
        </div>
        <label className="flex items-center gap-1.5">
          <span className="text-slate-600 font-medium">Day:</span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1 border border-slate-300 rounded font-bold text-xs bg-white text-slate-800 cursor-pointer"
          >
            {blockDates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {!checked ? (
          <p className="p-4 rounded border border-dashed border-slate-300 bg-white text-center text-slate-500">
            The roster hasn't been checked yet. Make a change or generate it to see coverage.
          </p>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{formatDate(selectedDate)}</h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isHoliday
                    ? 'Public holiday: one nurse needs to be on duty for every opening hour.'
                    : 'Each opening hour needs a free nurse: one not with a doctor at that hour, who can run Nurse Clinic.'}
                </p>
              </div>

              {hourKeys.length === 0 ? (
                <p className="text-slate-500">No opening hours to check on this day.</p>
              ) : (
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {hourKeys.map((hour) => {
                    const c = dayHours[hour];
                    const short = c.deficit > 0;
                    return (
                      <div
                        key={hour}
                        className={`min-w-[64px] rounded border p-1.5 text-center ${
                          short ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'
                        }`}
                        aria-label={`${hour}: ${c.nurses} nurses, ${c.doctors} doctors, ${c.freeNurses ?? 0} free nurse${(c.freeNurses ?? 0) === 1 ? '' : 's'}${short ? ', missing a free nurse' : ''}`}
                      >
                        <span className="block font-mono text-[10px] text-slate-600">{hour}</span>
                        <span className="block text-[11px] text-slate-800">
                          <strong>{c.nurses}</strong> nurses
                        </span>
                        {!c.holiday && <span className="block text-[11px] text-slate-600">{c.doctors} doctors</span>}
                        <span
                          className={`mt-1 block rounded px-1 text-[10px] font-semibold ${
                            short ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {short ? (c.holiday ? 'Nobody' : 'No free nurse') : c.holiday ? 'Covered' : `${c.freeNurses ?? 0} free`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-1.5 border border-slate-200 rounded p-3 bg-slate-50">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                    Senior nurse on duty this day
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      dayAssignments.length === 0
                        ? 'bg-slate-200 text-slate-600'
                        : seniorToday
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {dayAssignments.length === 0 ? 'No shifts yet' : seniorToday ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-700">Nurses on duty who can take blood</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      bloodToday >= 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {bloodToday}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
              <div className="p-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50">
                <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <h3 className="font-bold text-slate-800 text-xs">Hours with too few nurses on these days ({gaps.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Day</th>
                      <th className="py-2 px-3">Hour</th>
                      <th className="py-2 px-3">Doctors</th>
                      <th className="py-2 px-3">Nurses on duty</th>
                      <th className="py-2 px-3">What's missing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {gaps.map((g) => (
                      <tr
                        key={`${g.date}-${g.hour}`}
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => setSelectedDate(g.date)}
                      >
                        <td className="py-2 px-3 font-semibold text-slate-800">{formatDate(g.date)}</td>
                        <td className="py-2 px-3 font-mono text-slate-700">{g.hour}</td>
                        <td className="py-2 px-3 text-slate-800">{g.holiday ? 'Holiday' : g.doctors}</td>
                        <td className="py-2 px-3 text-slate-800">{g.nurses}</td>
                        <td className="py-2 px-3 text-rose-700">
                          {g.holiday
                            ? 'No nurse on duty'
                            : g.nurses > g.doctors
                            ? 'A free nurse who can run Nurse Clinic (the nurses on duty are with doctors or lack the skill)'
                            : 'A free nurse for Nurse Clinic'}
                        </td>
                      </tr>
                    ))}
                    {gaps.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" aria-hidden="true" />
                          Every opening hour on these days has the nurse it needs.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
