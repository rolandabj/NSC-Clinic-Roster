/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Master Admin Access & Role Management Console (Phase 4.1)
 * Accessible exclusively by the Medical Director / System Owner (rolandabj@gmail.com).
 * Manages in-app user whitelist, pending Google account approvals, role assignments,
 * and Manager Approver designations.
 */

import React, { useState, useEffect, useId } from 'react';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  Lock,
  Mail,
  UserPlus,
  Check,
  X,
  ChevronDown,
} from 'lucide-react';
import { UserProfile } from '../../services/auth/authService';
import { getRepository } from '../../services/repository';
import { UserAccessRecord, Nurse, Doctor, UserAccessRole, UserAccessStatus } from '../../types';
import { useDialogA11y } from '../common/useDialogA11y';
import { notify, confirmDialog } from '../common/dialogs';

interface AccessManagementPanelProps {
  currentUser?: UserProfile;
}

export const AccessManagementPanel: React.FC<AccessManagementPanelProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<UserAccessRecord[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REVOKED'>('ALL');
  const [isBusy, setIsBusy] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Whitelist User Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const addTitleId = useId();
  const addDialogRef = useDialogA11y<HTMLDivElement>(isAddModalOpen, () => setIsAddModalOpen(false));
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserAccessRole>('VIEWER');
  const [newIsManager, setNewIsManager] = useState(false);
  const [newLinkedNurseId, setNewLinkedNurseId] = useState('');
  const [checkEmail, setCheckEmail] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Access records are stored in Firestore with the lowercased email as the
  // document id, which is what the Firestore security rules look up.
  const MASTER_EMAIL = 'rolandabj@gmail.com';

  const fetchDirectory = async () => {
    setIsLoading(true);
    try {
      const repo = getRepository();
      const [userList, nurseList, doctorList] = await Promise.all([
        repo.list('userAccess'),
        repo.list('nurses'),
        repo.list('doctors'),
      ]);
      setUsers(userList as UserAccessRecord[]);
      setNurses(nurseList as Nurse[]);
      setDoctors(doctorList as Doctor[]);
    } catch (err: any) {
      console.error('[AccessManagementPanel] fetch error:', err);
      triggerToast(`Could not load the access directory: ${err?.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  /**
   * Writes an access record under its email key. Records created before this
   * change used other ids; those are moved to the email key and the old copy removed.
   */
  const saveAccessRecord = async (email: string, fields: Partial<UserAccessRecord>) => {
    const repo = getRepository();
    const key = email.trim().toLowerCase();
    const legacy = users.filter((u) => u.email?.trim().toLowerCase() === key && u.id !== key);
    const base = users.find((u) => u.id === key) || legacy[0];
    const now = new Date().toISOString();

    await repo.update('userAccess', key, {
      ...(base || {}),
      ...fields,
      id: key,
      email: key,
      createdAt: base?.createdAt || now,
      updatedAt: now,
    } as UserAccessRecord);

    for (const old of legacy) {
      await repo.remove('userAccess', old.id);
    }
  };

  const handleApproveUser = async (
    email: string,
    appRole: UserAccessRole,
    isManager: boolean,
    linkedNurseId?: string,
    name?: string
  ) => {
    const key = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
      notify('Please enter a valid email address.', 'warning');
      return false;
    }
    // Link the matching nurse profile automatically (by Gmail) so the user can
    // file their own leave and availability requests.
    const matchedNurse = !linkedNurseId
      ? nurses.find((n) => n.gmail && n.gmail.trim().toLowerCase() === key)
      : undefined;
    const nurseLink = linkedNurseId || matchedNurse?.id || '';

    setIsBusy(true);
    try {
      await saveAccessRecord(key, {
        name: name || matchedNurse?.fullName || key.split('@')[0],
        status: 'APPROVED',
        appRole: appRole === 'EDITOR' ? 'EDITOR' : 'VIEWER',
        isManager: Boolean(isManager),
        linkedNurseId: nurseLink,
        approvedBy: currentUser?.email || MASTER_EMAIL,
        approvedAt: new Date().toISOString(),
      });

      triggerToast(`Approved access for ${key}: ${appRole === 'EDITOR' ? 'can edit' : 'can view'}${isManager ? ', can approve leave' : ''}.`);
      await fetchDirectory();
      return true;
    } catch (err: any) {
      notify(`Approval error: ${err.message}`, 'error');
      return false;
    } finally {
      setIsBusy(false);
    }
  };

  const handleUpdateRole = async (
    userId: string,
    updates: Partial<UserAccessRecord>
  ) => {
    const existing = users.find((u) => u.id === userId);
    if (!existing) return;
    if (existing.email.trim().toLowerCase() === MASTER_EMAIL) {
      notify('The Master Administrator account cannot be modified or degraded.', 'warning');
      return;
    }
    setIsBusy(true);
    try {
      const clean: Partial<UserAccessRecord> = { ...updates };
      if ('linkedNurseId' in updates) clean.linkedNurseId = updates.linkedNurseId || '';
      if (clean.appRole) clean.appRole = clean.appRole === 'EDITOR' ? 'EDITOR' : 'VIEWER';
      await saveAccessRecord(existing.email, clean);

      triggerToast('User access and privileges updated successfully.');
      await fetchDirectory();
    } catch (err: any) {
      notify(`Update error: ${err.message}`, 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleRevokeUser = async (userId: string, email: string) => {
    if (email.trim().toLowerCase() === MASTER_EMAIL) {
      notify('The Master Administrator account cannot be revoked.', 'warning');
      return;
    }
    const ok = await confirmDialog({
      title: 'Revoke access?',
      message: `Are you sure you want to revoke access for ${email}?`,
      confirmLabel: 'Revoke access',
      danger: true,
    });
    if (!ok) return;
    setIsBusy(true);
    try {
      await saveAccessRecord(email, { status: 'REVOKED' });

      triggerToast(`Access revoked for ${email}.`);
      await fetchDirectory();
    } catch (err: any) {
      notify(`Revocation error: ${err.message}`, 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const approved = await handleApproveUser(
      newEmail.trim().toLowerCase(),
      newRole,
      newIsManager,
      newLinkedNurseId || undefined,
      newName.trim() || undefined
    );
    if (!approved) return;
    setIsAddModalOpen(false);
    setNewEmail('');
    setNewName('');
    setNewRole('VIEWER');
    setNewIsManager(false);
    setNewLinkedNurseId('');
  };

  // Pending requests table
  const pendingUsers = users.filter((u) => u.status === 'PENDING');

  // Filtered active users table
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return u.status === statusFilter;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-indigo-900 text-white p-5 rounded-lg border border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-800/80 border border-indigo-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">Master Administrator Access &amp; Roles Console</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-800 text-indigo-200 text-[10px] font-mono border border-indigo-700">
                rolandabj@gmail.com
              </span>
            </div>
            <p className="text-indigo-200 text-[11px] mt-0.5 max-w-2xl">
              Sole governance authority for {(typeof window !== 'undefined' ? localStorage.getItem('clinic_roster_clinic_name') : null) || 'American Hospital Nad Al Sheba OutPatient clinic'}. Approve pending Google Workspace logins, designate clinical managers, and delegate roster editing rights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchDirectory}
            disabled={isLoading || isBusy}
            className="px-3 py-1.5 rounded bg-indigo-800 hover:bg-indigo-700 text-indigo-100 font-medium border border-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded bg-white text-indigo-900 hover:bg-indigo-50 font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-700" aria-hidden="true" />
            <span>Pre-Approve User</span>
          </button>
        </div>
      </div>

      {/* 1. PENDING ACCESS REQUESTS SECTION */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-xs">
              Pending Google Account Requests ({pendingUsers.length})
            </h3>
          </div>
          <span className="text-[11px] text-amber-800 font-medium">
            Accounts awaiting your administrator authorization to enter the application
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="p-4 bg-white/80 border border-amber-200/60 rounded text-center text-slate-500 text-[11px]">
            No pending access requests. All Google sign-ins have been resolved.
          </div>
        ) : (
          <div className="border border-amber-200 rounded overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-100/60 text-amber-900 font-bold border-b border-amber-200 text-[11px]">
                  <th className="py-2 px-3">Google Identity / Email</th>
                  <th className="py-2 px-3">Requested Name</th>
                  <th className="py-2 px-3">Assign Role</th>
                  <th className="py-2 px-3">Can approve leave?</th>
                  <th className="py-2 px-3">Link Staff Profile</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {pendingUsers.map((pending) => {
                  const matchedNurse = nurses.find(
                    (n) => n.gmail?.toLowerCase() === pending.email.toLowerCase()
                  );
                  return (
                    <tr key={pending.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{pending.email}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {pending.id}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                        {pending.name || matchedNurse?.fullName || 'Google User'}
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          id={`role-select-${pending.id}`}
                          defaultValue="VIEWER"
                          className="px-2 py-1 border border-slate-300 rounded bg-white font-medium text-slate-800"
                        >
                          <option value="VIEWER">Can view</option>
                          <option value="EDITOR">Can edit (rosters, staff, settings)</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            id={`manager-check-${pending.id}`}
                            defaultChecked={false}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-[11px] font-medium text-slate-700">Can approve leave</span>
                        </label>
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          id={`nurse-select-${pending.id}`}
                          defaultValue={matchedNurse?.id || ''}
                          className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-800 max-w-[180px] truncate"
                        >
                          <option value="">-- Unlinked Staff --</option>
                          {nurses.map((nurse) => (
                            <option key={nurse.id} value={nurse.id}>
                              {nurse.fullName} ({nurse.employeeCode})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const roleEl = document.getElementById(`role-select-${pending.id}`) as HTMLSelectElement;
                            const mgrEl = document.getElementById(`manager-check-${pending.id}`) as HTMLInputElement;
                            const nurseEl = document.getElementById(`nurse-select-${pending.id}`) as HTMLSelectElement;
                            handleApproveUser(
                              pending.email,
                              roleEl.value as UserAccessRole,
                              mgrEl.checked,
                              nurseEl.value || undefined,
                              pending.name
                            );
                          }}
                          disabled={isBusy}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Approve Access</span>
                        </button>
                        <button
                          onClick={() => handleRevokeUser(pending.id, pending.email)}
                          disabled={isBusy}
                          className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Reject</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. ACTIVE USER WHITELIST & ROLES TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Institutional User Whitelist &amp; Role Directory ({users.length})</span>
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Configure in-app capabilities, roster editing authority, and leave/availability approval permissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input aria-label="Search staff"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name or email..."
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none w-56 text-[11px]"
              />
            </div>
            <select aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 font-medium text-[11px]"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved Only</option>
              <option value="PENDING">Pending Only</option>
              <option value="REVOKED">Revoked Only</option>
            </select>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3">User / Google Email</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Roster Role</th>
                <th className="py-2.5 px-3">Can approve leave?</th>
                <th className="py-2.5 px-3">Linked Nurse Profile</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isMasterAdmin = user.email.toLowerCase() === 'rolandabj@gmail.com';
                const linkedNurse = nurses.find((n) => n.id === user.linkedNurseId);

                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 truncate">{user.name || user.email.split('@')[0]}</span>
                            {isMasterAdmin && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                MASTER ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono block truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {user.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>APPROVED</span>
                        </span>
                      )}
                      {user.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>PENDING</span>
                        </span>
                      )}
                      {user.status === 'REVOKED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <UserX className="w-3 h-3" />
                          <span>REVOKED</span>
                        </span>
                      )}
                    </td>

                    {/* Roster Role */}
                    <td className="py-3 px-3">
                      {isMasterAdmin ? (
                        <span className="font-bold text-indigo-700 font-mono text-[11px]">OWNER / EDITOR</span>
                      ) : (
                        <select aria-label={`Roster role for ${user.email}`}
                          value={user.appRole || 'VIEWER'}
                          onChange={(e) =>
                            handleUpdateRole(user.id, { appRole: e.target.value as UserAccessRole })
                          }
                          disabled={isBusy}
                          className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="VIEWER">Can view</option>
                          <option value="EDITOR">Can edit (rosters, staff, settings)</option>
                        </select>
                      )}
                    </td>

                    {/* Manager Approver */}
                    <td className="py-3 px-3">
                      {isMasterAdmin ? (
                        <span className="font-bold text-emerald-700">Permanent Approver ✓</span>
                      ) : (
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={user.isManager === true}
                            onChange={(e) =>
                              handleUpdateRole(user.id, { isManager: e.target.checked })
                            }
                            disabled={isBusy}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={`text-[11px] font-medium ${user.isManager ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>
                            {user.isManager ? 'Can approve leave' : 'No'}
                          </span>
                        </label>
                      )}
                    </td>

                    {/* Linked Nurse Profile */}
                    <td className="py-3 px-3">
                      {isMasterAdmin ? (
                        <span className="text-slate-400 italic">N/A (Clinical Director)</span>
                      ) : (
                        <select aria-label={`Linked nurse profile for ${user.email}`}
                          value={user.linkedNurseId || ''}
                          onChange={(e) =>
                            handleUpdateRole(user.id, { linkedNurseId: e.target.value || undefined })
                          }
                          disabled={isBusy}
                          className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-800 max-w-[180px] truncate"
                        >
                          <option value="">-- No Nurse Linked --</option>
                          {nurses.map((nurse) => (
                            <option key={nurse.id} value={nurse.id}>
                              {nurse.fullName} ({nurse.employeeCode})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right space-x-1.5">
                      {isMasterAdmin ? (
                        <span className="text-slate-400 text-[10px] font-mono">Protected</span>
                      ) : (
                        <>
                          {user.status === 'REVOKED' ? (
                            <button
                              onClick={() => handleUpdateRole(user.id, { status: 'APPROVED' })}
                              disabled={isBusy}
                              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Restore Access</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRevokeUser(user.id, user.email)}
                              disabled={isBusy}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Revoke</span>
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. CHECK AN EMAIL, AND STAFF WITHOUT AN ACCOUNT */}
      {(() => {
        const accountEmails = new Set(users.map((u) => u.email.trim().toLowerCase()));
        const staff = [
          ...nurses.filter((n) => n.active !== false).map((n) => ({ id: n.id, name: n.fullName, email: n.gmail || '', kind: 'Nurse', nurseId: n.id })),
          ...doctors.filter((d) => d.active !== false).map((d) => ({ id: d.id, name: d.fullName, email: d.gmail || '', kind: 'Doctor', nurseId: '' })),
        ];
        const withoutAccount = staff
          .filter((p) => !p.email || !accountEmails.has(p.email.trim().toLowerCase()))
          .sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));

        const query = checkEmail.trim().toLowerCase();
        const record = query ? users.find((u) => u.email.trim().toLowerCase() === query) : undefined;
        const profiles = query ? staff.filter((p) => p.email.trim().toLowerCase() === query) : [];
        const isOwnerEmail = query === MASTER_EMAIL;
        const linked = record?.linkedNurseId ? nurses.find((n) => n.id === record.linkedNurseId) : undefined;
        const describe = () => {
          if (isOwnerEmail) return 'Owner: can do everything, including access and backups.';
          if (!record) return 'No account. This person can sign in, but must wait for your approval before seeing anything.';
          if (record.status === 'PENDING') return 'Waiting for your approval. They can\'t see anything yet.';
          if (record.status === 'REVOKED') return 'Access removed. They can\'t see anything.';
          const role = record.appRole === 'EDITOR' ? 'Can view and edit rosters, staff and settings' : 'Can view rosters';
          return `${role}${record.isManager ? ', and can approve leave and availability' : ''}.`;
        };

        return (
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Check an email</h3>
              <p className="text-slate-500 text-[11px] mt-0.5">See what someone can do in the app, and which staff profile their email belongs to.</p>
            </div>
            <input
              aria-label="Email to check"
              type="email"
              value={checkEmail}
              onChange={(e) => setCheckEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full sm:w-80 px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none text-[11px]"
            />
            {query && (
              <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1 text-[11px] text-slate-700">
                <p className="font-semibold text-slate-900">{describe()}</p>
                <p>
                  Staff profile:{' '}
                  {profiles.length > 0 ? profiles.map((p) => `${p.name} (${p.kind.toLowerCase()})`).join(', ') : 'none with this email'}
                  {linked ? `. Linked to nurse ${linked.fullName}, so they can request leave.` : ''}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Staff without an app account ({withoutAccount.length})</h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Active nurses and doctors whose email has no account yet. Approve them ahead of time so they get in on first sign in.
              </p>
              {withoutAccount.length === 0 ? (
                <p className="mt-2 text-[11px] text-slate-500">Everyone has an account.</p>
              ) : (
                <ul className="mt-2 divide-y divide-slate-100 border border-slate-200 rounded">
                  {withoutAccount.map((p) => (
                    <li key={`${p.kind}-${p.id}`} className="flex items-center justify-between gap-3 px-3 py-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900">{p.name}</span>
                        <span className="ml-1.5 text-slate-400">{p.kind}</span>
                        <span className="block text-[11px] text-slate-500 font-mono truncate">{p.email || 'No email on the profile'}</span>
                      </div>
                      {p.email && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewEmail(p.email.trim().toLowerCase());
                            setNewName(p.name);
                            setNewRole('VIEWER');
                            setNewIsManager(false);
                            setNewLinkedNurseId(p.nurseId);
                            setIsAddModalOpen(true);
                          }}
                          className="shrink-0 px-2.5 py-1 rounded border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold cursor-pointer"
                        >
                          Approve ahead
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })()}

      {/* 4. PRE-APPROVE USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
          <div
            ref={addDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={addTitleId}
            className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-xs"
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <h3 id={addTitleId} className="font-bold text-slate-900 text-sm">Pre-Approve Institutional User</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-5 space-y-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Google Workspace / Gmail Address <span className="text-rose-500">*</span>
                </label>
                <input aria-label="Google Workspace / Gmail Address"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nurse.name@gmail.com"
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Staff Member Full Name</label>
                <input aria-label="Staff Member Full Name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Fatima Al-Zahra"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Roster Role</label>
                  <select aria-label="Roster Role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserAccessRole)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="VIEWER">Can view</option>
                    <option value="EDITOR">Can edit (rosters, staff, settings)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Link Nurse Profile</label>
                  <select aria-label="Link Nurse Profile"
                    value={newLinkedNurseId}
                    onChange={(e) => setNewLinkedNurseId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="">-- Optional --</option>
                    {nurses.map((nurse) => (
                      <option key={nurse.id} value={nurse.id}>
                        {nurse.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded bg-indigo-50/60 border border-indigo-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsManager}
                    onChange={(e) => setNewIsManager(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-bold text-indigo-900 block">Can approve leave and availability</span>
                    <span className="text-[10px] text-indigo-700">
                      Lets this user approve or decline nurses' leave and availability requests. It doesn't let them edit rosters, staff or settings.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pre-Approve &amp; Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
