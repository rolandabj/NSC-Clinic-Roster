/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Enterprise Directory & SSO tab.
 */

import React, { useState } from 'react';
import { CalendarCheck, Shield, Stethoscope, Sparkles, Check, RefreshCw, Users, Search } from 'lucide-react';
import { RoleDirectoryService } from '../../../services/auth/directoryService';
import { DirectorySummary } from './shared';

interface DirectoryTabProps {
  directoryEntries: any[];
  directorySummary: DirectorySummary;
  isLoadingDirectory: boolean;
  loadDirectory: () => void;
}

export const DirectoryTab: React.FC<DirectoryTabProps> = ({
  directoryEntries,
  directorySummary,
  isLoadingDirectory,
  loadDirectory,
}) => {
  const [emailTestInput, setEmailTestInput] = useState('');
  const [emailTestResult, setEmailTestResult] = useState<any | null>(null);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');

  const handleTestEmailMatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailTestInput.trim()) return;
    setIsTestingEmail(true);
    try {
      const identity = await RoleDirectoryService.resolveRoleFromEmail(emailTestInput.trim());
      setEmailTestResult({ status: 'ok', ...identity });
    } catch (err: any) {
      setEmailTestResult({
        status: 'error',
        message: err.message || 'Simulation error.',
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header / Intro */}
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Enterprise Role Directory &amp; Google SSO Mapping Engine</span>
          </h2>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Live mapping of clinical staff and institution emails to RBAC roles (OWNER, PLANNER, STAFF, VIEWER) with privilege computation and offline simulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadDirectory}
            disabled={isLoadingDirectory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDirectory ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isLoadingDirectory ? 'Syncing...' : 'Refresh Directory'}</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-900 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-300">ADMIN DIRECTORS</span>
            <Shield className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
            {directorySummary.owners ?? 0}
          </div>
          <p className="text-[10px] text-indigo-700/80 dark:text-indigo-400">Full governance &amp; settings</p>
        </div>

        <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-900 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-teal-900 dark:text-teal-300">ROSTER PLANNERS</span>
            <CalendarCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-teal-900 dark:text-teal-100">
            {directorySummary.planners ?? 0}
          </div>
          <p className="text-[10px] text-teal-700/80 dark:text-teal-400">Charge &amp; Senior Nurses</p>
        </div>

        <div className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-900 dark:text-blue-300">CLINICAL STAFF</span>
            <Stethoscope className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
            {directorySummary.staff ?? 0}
          </div>
          <p className="text-[10px] text-blue-700/80 dark:text-blue-400">Staff Nurses &amp; Doctors</p>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-slate-800/40 dark:border-slate-700 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">TOTAL REGISTERED</span>
            <Users className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {directoryEntries.length}
          </div>
          <p className="text-[10px] text-slate-500">Institutional accounts</p>
        </div>
      </div>

      {/* Email Matching & Permission Simulator */}
      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              <span>Email Matching &amp; RBAC Simulator</span>
            </h3>
            <p className="text-slate-500 text-[11px]">
              Test any Google email address against the directory engine to preview its resolved entity, assigned role, and privilege matrix.
            </p>
          </div>
        </div>

        {/* Input & Form */}
        <form onSubmit={handleTestEmailMatch} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              aria-label="Email address to test"
              type="email"
              placeholder="Enter email address (e.g. maryam.nuaimi.rn@gmail.com, doctor@clinic.ae)..."
              value={emailTestInput}
              onChange={(e) => setEmailTestInput(e.target.value)}
              className="w-full px-3 py-2 pl-8 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            type="submit"
            disabled={isTestingEmail || !emailTestInput.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTestingEmail ? 'Evaluating Match...' : 'Simulate Role Match'}</span>
          </button>
        </form>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
          <span className="text-slate-500 font-medium">Quick Test:</span>
          {[
            { label: 'Director (Owner)', email: 'rolandabj@gmail.com' },
          ].map((preset) => (
            <button
              key={preset.email}
              type="button"
              onClick={() => {
                setEmailTestInput(preset.email);
                setTimeout(() => {
                  RoleDirectoryService.resolveRoleFromEmail(preset.email)
                    .then((identity) => setEmailTestResult({ status: 'ok', ...identity }))
                    .catch((err) => setEmailTestResult({ status: 'error', message: err.message }));
                }, 50);
              }}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-600 dark:text-slate-300 font-mono text-[10px] cursor-pointer transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Simulation Result Card */}
        {emailTestResult && (
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                  {emailTestResult.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {emailTestResult.name || emailTestResult.email}
                    </span>
                    {emailTestResult.nurseCode && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {emailTestResult.nurseCode}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">{emailTestResult.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded font-bold font-mono text-[11px] border ${
                    emailTestResult.role === 'OWNER'
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300'
                      : emailTestResult.role === 'PLANNER'
                      ? 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950 dark:text-teal-300'
                      : emailTestResult.role === 'STAFF'
                      ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  RESOLVED: {emailTestResult.role}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  [{emailTestResult.matchedEntity}]
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
              "{emailTestResult.description}"
            </p>

            {/* Privilege Breakdown Matrix */}
            {emailTestResult.privileges && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase mb-1.5">
                  Computed Privilege Matrix:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {Object.entries(emailTestResult.privileges).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                          value
                            ? 'bg-emerald-100 text-emerald-800 font-bold'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {value ? '✓' : '×'}
                      </span>
                      <span className={value ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                        {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Staff Directory Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">
              Registered Clinical Personnel &amp; Google Mappings
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
              {directoryEntries.length} Accounts
            </span>
          </div>

          <div className="w-full sm:w-64 relative">
            <input
              aria-label="Search directory"
              type="text"
              placeholder="Search name, code, or email..."
              value={directorySearchQuery}
              onChange={(e) => setDirectorySearchQuery(e.target.value)}
              className="w-full px-2.5 py-1.5 pl-7 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-xs"
            />
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2.5" />
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Personnel / Code</th>
                <th className="py-2.5 px-3">Clinical Role &amp; Seniority</th>
                <th className="py-2.5 px-3">Google Workspace Email</th>
                <th className="py-2.5 px-3">Computed RBAC Role</th>
                <th className="py-2.5 px-3">Change Role</th>
                <th className="py-2.5 px-3 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {directoryEntries
                .filter((entry) => {
                  if (!directorySearchQuery) return true;
                  const q = directorySearchQuery.toLowerCase();
                  return (
                    entry.name?.toLowerCase().includes(q) ||
                    entry.email?.toLowerCase().includes(q) ||
                    entry.employeeCode?.toLowerCase().includes(q) ||
                    entry.seniorityName?.toLowerCase().includes(q)
                  );
                })
                .map((entry) => {
                  const effectiveRole = entry.role;
                  return (
                    <tr
                      key={entry.id || entry.email}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                            {entry.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              <span>{entry.name}</span>
                              {entry.type === 'ADMIN' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-semibold">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            {entry.employeeCode && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {entry.employeeCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {entry.seniorityName || entry.type || 'Staff Member'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {entry.email || '—'}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] border ${
                            effectiveRole === 'OWNER'
                              ? 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300'
                              : effectiveRole === 'PLANNER'
                              ? 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950 dark:text-teal-300'
                              : effectiveRole === 'STAFF'
                              ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {effectiveRole}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="text-[11px] text-slate-500">
                          Roles are set in Access &amp; Permissions
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-medium">
                          <Check className="w-3 h-3" />
                          <span>SSO Active</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
