/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hours tab: each nurse's shift and leave hours against their goal.
 */

import { hoursHistoryOverlaps, type HoursHistory } from '../../services/hours/hoursBalance';

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Clock,
  Download,
  Search,
  Filter,
  Users,
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Schedule,
  Assignment,
  Nurse,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  SeniorityLevel,
  Doctor,
  ClinicalRole,
  Specialty,
  NurseHoursQuota,
  WorkingHoursPeriod,
} from '../../types';
import {
  calculateNurseHoursAccounting,
  calculateClinicHoursMetrics,
  NurseHoursAccounting,
  HoursAccountingStatus,
} from '../../services/reports/hoursAccounting';
import { NurseTimesheetModal } from '../modals/NurseTimesheetModal';

/** Hours as shown to people: at most one decimal (sums of many shifts can carry long decimals). */
const fmtHours = (h: number) => `${Math.round(h * 10) / 10}h`;

interface HoursAccountingSheetProps {
  schedule: Schedule;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  leaveEntries: LeaveEntry[];
  leaveTypes: LeaveType[];
  seniorityLevels: SeniorityLevel[];
  doctors: Doctor[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  quotas: NurseHoursQuota[];
  workingHoursPeriods?: WorkingHoursPeriod[];
  hoursHistory?: HoursHistory;
  onGoToReports?: () => void;
}

export const HoursAccountingSheet: React.FC<HoursAccountingSheetProps> = ({
  schedule,
  assignments,
  nurses,
  dutyWindows,
  leaveEntries,
  leaveTypes,
  seniorityLevels,
  doctors,
  roles,
  specialties,
  quotas,
  onGoToReports,
  workingHoursPeriods = [],
  hoursHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | HoursAccountingStatus>('ALL');
  const [selectedNurse, setSelectedNurse] = useState<NurseHoursAccounting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compute accounting rows
  const nurseRows: NurseHoursAccounting[] = useMemo(() => {
    if (hoursHistoryOverlaps(schedule, hoursHistory).length) return [];
    return nurses.map((nurse) =>
      calculateNurseHoursAccounting(
        nurse,
        schedule,
        assignments,
        dutyWindows,
        leaveEntries,
        leaveTypes,
        seniorityLevels,
        doctors,
        roles,
        specialties,
        quotas,
        workingHoursPeriods,
        hoursHistory
      )
    );
  }, [
    schedule,
    assignments,
    nurses,
    dutyWindows,
    leaveEntries,
    leaveTypes,
    seniorityLevels,
    doctors,
    roles,
    specialties,
    quotas,
    workingHoursPeriods,
    hoursHistory,
  ]);

  const metrics = useMemo(() => {
    return calculateClinicHoursMetrics(nurseRows, dutyWindows, seniorityLevels);
  }, [nurseRows, dutyWindows, seniorityLevels]);

  const filteredRows = useMemo(() => {
    return nurseRows.filter((r) => {
      const matchSearch =
        r.nurse.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.nurse.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [nurseRows, searchQuery, statusFilter]);

  const handleOpenTimesheet = (row: NurseHoursAccounting) => {
    setSelectedNurse(row);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 select-none overflow-hidden text-xs">
      {/* Top Sheet Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <span className="font-bold text-slate-800">
              Hours ({schedule.name})
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Goal: <strong className="text-slate-900">{fmtHours(metrics.totalContractedTargetHours)}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
              Shifts: <strong>{fmtHours(metrics.totalDutyHoursWorked)}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700">
              Leave: <strong>{fmtHours(metrics.totalLeaveHoursCredited)}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Share of goal: <strong>{metrics.clinicFulfillmentPercent}%</strong>
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <input aria-label="Search nurse"
            type="text"
            placeholder="Search nurse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-2.5 py-1 border border-slate-200 rounded text-xs w-44 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <select aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2 py-1 border border-slate-200 rounded text-xs bg-white text-slate-700"
          >
            <option value="ALL">All nurses ({nurseRows.length})</option>
            <option value="OPTIMAL">On goal</option>
            <option value="UNDER">A little short</option>
            <option value="CRITICAL_UNDER">Very short</option>
            <option value="OVER">A little over</option>
            <option value="CRITICAL_OVER">Too many hours</option>
          </select>
        </div>
      </div>

      <p className="px-4 py-2 text-[11px] text-slate-600">Goals include hours carried from earlier published rosters, with their shifts as saved now (drafts and archived rosters do not count). A positive closing balance means hours ahead; a negative balance means hours owed.</p>
      {/* Main Table */}
      <div className="flex-1 overflow-auto bg-white p-3">
        <div className="border border-slate-200 rounded overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium font-mono">
              <tr>
                <th className="py-2 px-3">Nurse</th>
                <th className="py-2 px-3 text-center">Contract</th>
                <th className="py-2 px-3">Adjusted goal</th>
                <th className="py-2 px-3">Shifts</th>
                <th className="py-2 px-3">Leave</th>
                <th className="py-2 px-3">Total (shifts + leave)</th>
                <th className="py-2 px-3">Closing balance</th>
                <th className="py-2 px-3 text-center">Weekends</th>
                <th className="py-2 px-3 text-center">Late shifts</th>
                <th className="py-2 px-3 w-36">Share of goal</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredRows.map((r) => {
                const isUnder = r.status === 'UNDER' || r.status === 'CRITICAL_UNDER';
                return (
                  <tr
                    key={r.nurse.id}
                    onClick={() => handleOpenTimesheet(r)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleOpenTimesheet(r);
                      }
                    }}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-2 px-3">
                      <span className="font-semibold text-slate-900 block font-sans">
                        {r.nurse.fullName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {r.nurse.employeeCode} · {r.seniority?.name || 'Staff'}
                      </span>
                    </td>

                    <td className="py-2 px-3 text-center font-bold text-slate-700">
                      {r.contractPercent}%
                    </td>

                    <td className="py-2 px-3 font-bold text-slate-800">
                      {fmtHours(r.targetHours)}
                      <span className="block text-[10px] font-normal text-slate-500">
                        Base {Math.round(r.balance.baseTargetHours * 10) / 10}h · {Math.round(Math.abs(r.balance.carriedHours) * 10) / 10}h {r.balance.carriedHours >= 0 ? 'owed from before' : 'ahead from before'}
                      </span>
                      {r.parts.length > 1 && r.parts.map((p) => (
                        <span key={p.startDate} className={`block text-[10px] font-normal ${p.workedHours < p.targetHours - 4 ? 'text-amber-700' : 'text-slate-500'}`}>
                          {p.name} part: {Math.round(p.workedHours * 10) / 10} of {p.targetHours}h
                        </span>
                      ))}
                    </td>

                    <td className="py-2 px-3 text-indigo-700 font-semibold">
                      {fmtHours(r.dutyHours)}
                    </td>

                    <td className="py-2 px-3 text-amber-700 font-semibold">
                      {fmtHours(r.leaveHours)}
                    </td>

                    <td className="py-2 px-3 font-bold text-slate-900">
                      {fmtHours(r.totalEarnedHours)}
                    </td>

                    <td className="py-2 px-3">
                      <span
                        className={`font-bold ${
                          r.status === 'OVER' || r.status === 'CRITICAL_OVER'
                            ? 'text-rose-600'
                            : r.status === 'UNDER' || r.status === 'CRITICAL_UNDER'
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {r.varianceHours > 0 ? `+${fmtHours(r.varianceHours)}` : fmtHours(r.varianceHours)}
                      </span>
                    </td>

                    <td className="py-2 px-3 text-center">
                      <span className="font-bold text-slate-700">{r.weekendShiftsCount}</span>
                    </td>

                    <td className="py-2 px-3 text-center text-slate-700">
                      {r.lateDutiesCount}
                    </td>

                    <td className="py-2 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-800">{r.pacePercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${
                              r.status === 'OPTIMAL'
                                ? 'bg-emerald-500'
                                : isUnder
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, r.pacePercent)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-2 px-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'OPTIMAL'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : r.status === 'CRITICAL_UNDER'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : r.status === 'UNDER'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {r.status === 'OPTIMAL' && 'On goal'}
                        {r.status === 'UNDER' && 'A little short'}
                        {r.status === 'CRITICAL_UNDER' && 'Very short'}
                        {r.status === 'OVER' && 'A little over'}
                        {r.status === 'CRITICAL_OVER' && 'Too many hours'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <NurseTimesheetModal
        schedule={schedule}
        accounting={selectedNurse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
