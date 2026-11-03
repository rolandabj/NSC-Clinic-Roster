/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Settings, Access and permissions (owner only): the people waiting for approval, everyone with
 * an account and what they can do, a check of any email, and staff without an account.
 * Rebuilt on the shared parts in Phase 8, slice 1e.
 */

import React, { useState, useEffect } from 'react';
import { Check, RefreshCw, UserCheck, UserPlus, UserX, X } from 'lucide-react';
import { UserProfile } from '../../services/auth/authService';
import { getRepository } from '../../services/repository';
import { UserAccessRecord, Nurse, Doctor, UserAccessRole } from '../../types';
import { Badge, Button, Checkbox, DataTable, Dialog, EmptyState, Field, Input, LoadingState, Notice, Select, type Column } from '../ui';
import { accessStatusWord, accessWords, roleWords } from '../../services/auth/accessWords';
import { notify, confirmDialog, type NoticeTone } from '../common/dialogs';

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

  // New Whitelist User Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserAccessRole>('VIEWER');
  const [newIsManager, setNewIsManager] = useState(false);
  const [newLinkedNurseId, setNewLinkedNurseId] = useState('');
  const [checkEmail, setCheckEmail] = useState('');

  const triggerToast = (msg: string, tone: NoticeTone = 'success') => notify(msg, tone);

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
      triggerToast(`The list of people could not be loaded: ${err?.message || err}`, 'error');
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
      notify('Enter an email address like name@gmail.com.', 'warning');
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

      triggerToast(`${key} can now use the app: ${roleWords(appRole).toLowerCase()}${isManager ? ', and can approve requests for leave, days off and shifts' : ''}.`);
      await fetchDirectory();
      return true;
    } catch (err: any) {
      notify(`The approval was not saved: ${err.message}`, 'error');
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
      notify('The owner’s access cannot be changed.', 'warning');
      return;
    }
    setIsBusy(true);
    try {
      const clean: Partial<UserAccessRecord> = { ...updates };
      if ('linkedNurseId' in updates) clean.linkedNurseId = updates.linkedNurseId || '';
      if (clean.appRole) clean.appRole = clean.appRole === 'EDITOR' ? 'EDITOR' : 'VIEWER';
      await saveAccessRecord(existing.email, clean);

      triggerToast('Access updated.');
      await fetchDirectory();
    } catch (err: any) {
      notify(`The change was not saved: ${err.message}`, 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleRevokeUser = async (userId: string, email: string) => {
    if (email.trim().toLowerCase() === MASTER_EMAIL) {
      notify('The owner’s access cannot be removed.', 'warning');
      return;
    }
    const ok = await confirmDialog({
      title: 'Remove access?',
      message: `${email} will no longer be able to use the app. You can give access back later.`,
      confirmLabel: 'Remove access',
      danger: true,
    });
    if (!ok) return;
    setIsBusy(true);
    try {
      await saveAccessRecord(email, { status: 'REVOKED' });

      triggerToast(`Access removed for ${email}.`);
      await fetchDirectory();
    } catch (err: any) {
      notify(`Access was not removed: ${err.message}`, 'error');
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

  // Each waiting person's choices before Approve (kept in state, not read from the page).
  const [pendingChoices, setPendingChoices] = useState<Record<string, { role: UserAccessRole; isManager: boolean; nurseId: string }>>({});
  const choiceFor = (u: UserAccessRecord) =>
    pendingChoices[u.id] || {
      role: 'VIEWER' as UserAccessRole,
      isManager: false,
      nurseId: nurses.find((n) => n.gmail?.toLowerCase() === u.email.toLowerCase())?.id || '',
    };
  const setChoice = (u: UserAccessRecord, change: Partial<{ role: UserAccessRole; isManager: boolean; nurseId: string }>) =>
    setPendingChoices((prev) => ({ ...prev, [u.id]: { ...choiceFor(u), ...change } }));

  const pendingUsers = users.filter((u) => u.status === 'PENDING');
  const q = searchQuery.toLowerCase().trim();
  const filteredUsers = users.filter(
    (u) => (!q || u.email.toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q)) && (statusFilter === 'ALL' || u.status === statusFilter)
  );
  const isOwnerEmail = (email: string) => email.trim().toLowerCase() === MASTER_EMAIL;
  const nurseOptions = (
    <>
      <option value="">None</option>
      {nurses.map((nurse) => (
        <option key={nurse.id} value={nurse.id}>
          {nurse.fullName} ({nurse.employeeCode})
        </option>
      ))}
    </>
  );

  const columns: Column<UserAccessRecord>[] = [
    {
      key: 'person',
      header: 'Person',
      cell: (u) => (
        <span className="block min-w-0">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-ink">{u.name || u.email.split('@')[0]}</span>
            {isOwnerEmail(u.email) && <Badge tone="brand">Owner</Badge>}
          </span>
          <span className="block truncate text-xs text-ink-muted">{u.email}</span>
        </span>
      ),
      sortValue: (u) => u.name || u.email,
      phone: 'title',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (u) => (
        <Badge tone={u.status === 'APPROVED' ? 'success' : u.status === 'PENDING' ? 'warning' : 'danger'}>{accessStatusWord(u.status)}</Badge>
      ),
      sortValue: (u) => u.status,
    },
    {
      key: 'role',
      header: 'What they can do',
      cell: (u) =>
        isOwnerEmail(u.email) ? (
          <span className="text-ink">Everything</span>
        ) : (
          <Select
            aria-label={`What ${u.email} can do`}
            value={u.appRole || 'VIEWER'}
            disabled={isBusy}
            onChange={(e) => handleUpdateRole(u.id, { appRole: e.target.value as UserAccessRole })}
            className="min-w-48"
          >
            <option value="VIEWER">{roleWords('VIEWER')}</option>
            <option value="EDITOR">{roleWords('EDITOR')}</option>
          </Select>
        ),
    },
    {
      key: 'manager',
      header: 'Can approve requests',
      cell: (u) =>
        isOwnerEmail(u.email) ? (
          <span className="text-ink">Yes</span>
        ) : (
          <Checkbox
            checked={u.isManager === true}
            disabled={isBusy}
            onChange={(e) => handleUpdateRole(u.id, { isManager: e.target.checked })}
            label={<span className="sr-only">{`${u.email} can approve requests`}</span>}
          />
        ),
    },
    {
      key: 'nurse',
      header: 'Nurse record',
      cell: (u) =>
        isOwnerEmail(u.email) ? (
          <span className="text-ink-muted">None</span>
        ) : (
          <Select
            aria-label={`Nurse record of ${u.email}`}
            value={u.linkedNurseId || ''}
            disabled={isBusy}
            onChange={(e) => handleUpdateRole(u.id, { linkedNurseId: e.target.value || undefined })}
            className="min-w-44"
          >
            {nurseOptions}
          </Select>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (u) =>
        isOwnerEmail(u.email) ? null : u.status === 'REVOKED' ? (
          <Button size="sm" icon={UserCheck} disabled={isBusy} onClick={() => handleUpdateRole(u.id, { status: 'APPROVED' })} aria-label={`Give access back to ${u.email}`}>
            Give access back
          </Button>
        ) : (
          <Button size="sm" icon={UserX} disabled={isBusy} className="text-danger" onClick={() => handleRevokeUser(u.id, u.email)} aria-label={`Remove access of ${u.email}`}>
            Remove access
          </Button>
        ),
    },
  ];

  // Check an email, and staff without an account.
  const accountEmails = new Set(users.map((u) => u.email.trim().toLowerCase()));
  const staff = [
    ...nurses.filter((n) => n.active !== false).map((n) => ({ id: n.id, name: n.fullName, email: n.gmail || '', kind: 'Nurse', nurseId: n.id })),
    ...doctors.filter((d) => d.active !== false).map((d) => ({ id: d.id, name: d.fullName, email: d.gmail || '', kind: 'Doctor', nurseId: '' })),
  ];
  const withoutAccount = staff
    .filter((p) => !p.email || !accountEmails.has(p.email.trim().toLowerCase()))
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));
  const checkQuery = checkEmail.trim().toLowerCase();
  const checkRecord = checkQuery ? users.find((u) => u.email.trim().toLowerCase() === checkQuery) : undefined;
  const checkProfiles = checkQuery ? staff.filter((p) => p.email.trim().toLowerCase() === checkQuery) : [];
  const checkLinked = checkRecord?.linkedNurseId ? nurses.find((n) => n.id === checkRecord.linkedNurseId) : undefined;

  const openAdd = (email = '', name = '', nurseId = '') => {
    setNewEmail(email);
    setNewName(name);
    setNewRole('VIEWER');
    setNewIsManager(false);
    setNewLinkedNurseId(nurseId);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Access and permissions</h2>
          <p className="mt-1 max-w-2xl text-ink-muted">
            Who can open the app and what they can do. People sign in with their Google account and wait until you approve them here. Or add
            them first, so they get in the first time they sign in.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button icon={RefreshCw} busy={isLoading} disabled={isBusy} onClick={fetchDirectory}>
            Refresh
          </Button>
          <Button variant="primary" icon={UserPlus} onClick={() => openAdd()}>
            Add a person
          </Button>
        </div>
      </div>

      {isLoading && users.length === 0 ? (
        <LoadingState label="Loading who has access…" />
      ) : (
        <>
          <section aria-labelledby="access-waiting" className="space-y-2">
            <h3 id="access-waiting" className="text-base font-semibold text-ink">
              Waiting for your approval ({pendingUsers.length})
            </h3>
            {pendingUsers.length === 0 ? (
              <p className="text-ink-muted">Nobody is waiting. When someone signs in for the first time, they show here.</p>
            ) : (
              <ul className="divide-y divide-line rounded-lg border border-warning-line bg-warning-soft" aria-label="Waiting for your approval">
                {pendingUsers.map((u) => {
                  const c = choiceFor(u);
                  const name = u.name || nurses.find((n) => n.gmail?.toLowerCase() === u.email.toLowerCase())?.fullName || u.email.split('@')[0];
                  return (
                    <li key={u.id} className="space-y-3 p-4">
                      <div>
                        <p className="font-semibold text-ink">{name}</p>
                        <p className="text-ink-muted">{u.email}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="What they can do">
                          {(f) => (
                            <Select {...f} value={c.role} onChange={(e) => setChoice(u, { role: e.target.value as UserAccessRole })}>
                              <option value="VIEWER">{roleWords('VIEWER')}</option>
                              <option value="EDITOR">{roleWords('EDITOR')}</option>
                            </Select>
                          )}
                        </Field>
                        <Field label="Their nurse record" optional>
                          {(f) => (
                            <Select {...f} value={c.nurseId} onChange={(e) => setChoice(u, { nurseId: e.target.value })}>
                              {nurseOptions}
                            </Select>
                          )}
                        </Field>
                      </div>
                      <Checkbox
                        checked={c.isManager}
                        onChange={(e) => setChoice(u, { isManager: e.target.checked })}
                        label="Can approve requests for leave, days off and shifts"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="primary"
                          icon={Check}
                          busy={isBusy}
                          onClick={() => handleApproveUser(u.email, c.role, c.isManager, c.nurseId || undefined, u.name)}
                          aria-label={`Approve ${u.email}`}
                        >
                          Approve
                        </Button>
                        <Button icon={X} disabled={isBusy} onClick={() => handleRevokeUser(u.id, u.email)} aria-label={`Decline ${u.email}`}>
                          Decline
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="access-people" className="space-y-3">
            <h3 id="access-people" className="text-base font-semibold text-ink">
              People with an account ({users.length})
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-2xl">
              <Field label="Search">
                {(f) => <Input {...f} type="search" placeholder="Name or email" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />}
              </Field>
              <Field label="Status">
                {(f) => (
                  <Select {...f} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
                    <option value="ALL">Everyone</option>
                    <option value="APPROVED">{accessStatusWord('APPROVED')}</option>
                    <option value="PENDING">{accessStatusWord('PENDING')}</option>
                    <option value="REVOKED">{accessStatusWord('REVOKED')}</option>
                  </Select>
                )}
              </Field>
            </div>
            <DataTable
              caption="People with an account"
              rows={filteredUsers}
              rowKey={(u) => u.id}
              columns={columns}
              initialSort={{ key: 'person', direction: 'ascending' }}
              empty={<EmptyState title={users.length === 0 ? 'Nobody has an account yet' : 'Nobody matches these filters'} />}
            />
          </section>

          <section aria-labelledby="access-check" className="space-y-3">
            <div>
              <h3 id="access-check" className="text-base font-semibold text-ink">
                Check an email
              </h3>
              <p className="text-ink-muted">What someone can do in the app, and which staff record their email belongs to.</p>
            </div>
            <Field label="Email" className="sm:w-96">
              {(f) => <Input {...f} type="email" placeholder="name@gmail.com" value={checkEmail} onChange={(e) => setCheckEmail(e.target.value)} />}
            </Field>
            {checkQuery && (
              <Notice tone="info" title={accessWords(checkRecord, isOwnerEmail(checkQuery))} live>
                Staff record:{' '}
                {checkProfiles.length > 0 ? checkProfiles.map((p) => `${p.name} (${p.kind.toLowerCase()})`).join(', ') : 'none with this email'}.
                {checkLinked ? ` Linked to the nurse ${checkLinked.fullName}, so they can ask for leave.` : ''}
              </Notice>
            )}
          </section>

          <section aria-labelledby="access-without" className="space-y-3">
            <div>
              <h3 id="access-without" className="text-base font-semibold text-ink">
                Staff without an account ({withoutAccount.length})
              </h3>
              <p className="text-ink-muted">Active nurses and doctors whose email has no account yet. Add them first, so they get in the first time they sign in.</p>
            </div>
            {withoutAccount.length === 0 ? (
              <p className="text-ink-muted">Everyone has an account.</p>
            ) : (
              <ul className="divide-y divide-line rounded-lg border border-line" aria-label="Staff without an account">
                {withoutAccount.map((p) => (
                  <li key={`${p.kind}-${p.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-2">
                    <span className="min-w-0">
                      <span className="font-semibold text-ink">{p.name}</span> <span className="text-ink-muted">{p.kind}</span>
                      <span className="block truncate text-ink-muted">{p.email || 'No email in their record'}</span>
                    </span>
                    {p.email && (
                      <Button size="sm" icon={UserPlus} onClick={() => openAdd(p.email.trim().toLowerCase(), p.name, p.nurseId)} aria-label={`Add ${p.name} before their first sign in`}>
                        Add first
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {/* Add a person before they first sign in (Phase 7, slice 4: on the shared Dialog). */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add a person"
        description="They get this access the first time they sign in with this Google account."
        footer={
          <>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="add-person" icon={Check} busy={isBusy}>
              Add the person
            </Button>
          </>
        }
      >
        <form id="add-person" onSubmit={handleAddUserSubmit} className="space-y-4 text-sm">
          <Field label="Google account email" hint="For example nurse.name@gmail.com.">
            {(f) => <Input {...f} type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />}
          </Field>
          <Field label="Full name" optional>
            {(f) => <Input {...f} value={newName} onChange={(e) => setNewName(e.target.value)} />}
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="What they can do">
              {(f) => (
                <Select {...f} value={newRole} onChange={(e) => setNewRole(e.target.value as UserAccessRole)}>
                  <option value="VIEWER">{roleWords('VIEWER')}</option>
                  <option value="EDITOR">{roleWords('EDITOR')}</option>
                </Select>
              )}
            </Field>
            <Field label="Their nurse record" optional>
              {(f) => (
                <Select {...f} value={newLinkedNurseId} onChange={(e) => setNewLinkedNurseId(e.target.value)}>
                  <option value="">None</option>
                  {nurses.map((nurse) => (
                    <option key={nurse.id} value={nurse.id}>
                      {nurse.fullName}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <Checkbox
            checked={newIsManager}
            onChange={(e) => setNewIsManager(e.target.checked)}
            label="Can approve requests for leave, days off and shifts"
            hint="Lets them approve or decline nurses' requests. It doesn't let them change rosters, staff or settings."
          />
        </form>
      </Dialog>
    </div>
  );
};
