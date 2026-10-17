/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Database & Storage tab.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Trash2, AlertTriangle, Download, Upload, RefreshCw, X } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import {
  checkBackup,
  clearDatabase,
  downloadFullDatabaseBackup,
  importFullDatabaseBackup,
  getDatabaseStatistics,
  DatabaseStats,
} from '../../../services/seed/seedRunner';
import { notify } from '../../common/dialogs';
import { useAppContext } from '../../common/AppContext';
import { defaultFirebaseConfig } from '../../../services/firebase/firebaseConfig';
import { SaveNotifier, SettingsDialog } from './shared';
import { formatDateTime } from '../../../utils/dateUtils';
import { Button, Field, Input, Notice, Textarea } from '../../ui';

interface DatabaseTabProps {
  loadData: () => Promise<void>;
  triggerSaveNotification: SaveNotifier;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ loadData, triggerSaveNotification }) => {
  // Tells the app all data was deleted: the top bar forgets the roster and screens load again.
  const clinicDataCleared = useAppContext()?.clinicDataCleared;
  const repo = getRepository();

  // Database & Storage management state
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [clearConfirmInput, setClearConfirmInput] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [backupStatusMessage, setBackupStatusMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [isBusyAction, setIsBusyAction] = useState(false);

  // --- 12. Database & Seed Data Management (Phase 15) ---
  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const stats = await getDatabaseStatistics(repo);
      setDbStats(stats);
    } catch (e) {
      console.error('Failed to load database stats:', e);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Statistics are (re)loaded each time this tab is opened.
  useEffect(() => {
    loadStats();
  }, []);

  const handleClearDatabase = async () => {
    if (clearConfirmInput.trim() !== 'CLEAR') {
      notify('Please type CLEAR to confirm.', 'warning');
      return;
    }
    setIsBusyAction(true);
    try {
      // A copy of everything is saved first; if that fails nothing is deleted.
      try {
        await downloadFullDatabaseBackup(repo, 'before_wipe');
      } catch (err: any) {
        notify(`Nothing was deleted, because the safety backup could not be made. ${err.message || ''}`, 'error');
        return;
      }
      const { failed } = await clearDatabase(repo);
      await loadData();
      await loadStats();
      setIsClearConfirmOpen(false);
      setClearConfirmInput('');
      clinicDataCleared?.();
      if (failed.length > 0) {
        notify(`Some data could not be deleted: ${failed.join(', ')}. A backup was downloaded before the wipe.`, 'error');
      } else {
        triggerSaveNotification('All clinic data was deleted. A backup was downloaded first. User access was kept.');
      }
    } catch (err: any) {
      notify(`The wipe failed: ${err.message}`, 'error');
    } finally {
      setIsBusyAction(false);
    }
  };

  const handleExportBackup = async () => {
    setIsBusyAction(true);
    try {
      await downloadFullDatabaseBackup(repo);
      triggerSaveNotification('Backup downloaded.');
    } catch (err: any) {
      notify(`The backup failed: ${err.message}`, 'error');
    } finally {
      setIsBusyAction(false);
    }
  };

  const backupCheck = useMemo(() => (importJsonText.trim() ? checkBackup(importJsonText) : null), [importJsonText]);

  const handleImportBackup = async () => {
    if (!backupCheck?.ok) return;
    setIsBusyAction(true);
    setBackupStatusMessage(null);
    try {
      // A copy of the current data is saved first; if that fails nothing is changed.
      try {
        await downloadFullDatabaseBackup(repo, 'before_restore');
      } catch (err: any) {
        setBackupStatusMessage({
          text: `Nothing was changed, because a backup of the current data could not be made. ${err.message || ''}`,
          error: true,
        });
        return;
      }
      const result = await importFullDatabaseBackup(repo, importJsonText);
      await loadData();
      await loadStats();
      if (result.success) {
        setIsImportModalOpen(false);
        setImportJsonText('');
        triggerSaveNotification('The backup was restored. A copy of the old data was downloaded first.');
      } else {
        setBackupStatusMessage({ text: result.message, error: true });
      }
    } catch (err: any) {
      setBackupStatusMessage({ text: err.message || 'The restore failed.', error: true });
    } finally {
      setIsBusyAction(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="space-y-6 text-xs">
        {/* Live Database Statistics Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Records in the database
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                How many records the clinic has saved. Data is stored in Cloud Firestore (project{' '}
                <span className="font-mono">{defaultFirebaseConfig.projectId}</span>, database{' '}
                <span className="font-mono">{defaultFirebaseConfig.firestoreDatabaseId || '(default)'}</span>).
              </p>
            </div>
            <button
              type="button"
              onClick={loadStats}
              disabled={isLoadingStats}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Nurses</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{dbStats?.nursesCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Doctors</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{dbStats?.doctorsCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Sessions</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{dbStats?.sessionsCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Assignments</span>
              <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">{dbStats?.assignmentsCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Leave Entries</span>
              <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{dbStats?.leaveEntriesCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Pinned Locks</span>
              <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">{dbStats?.locksCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Safety Rules</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{dbStats?.rulesCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Versions</span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{dbStats?.versionsCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Templates</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{dbStats?.templatesCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Shift Swaps</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{dbStats?.swapsCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Audit Events</span>
              <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">{dbStats?.auditCount ?? '—'}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Holidays</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{dbStats?.holidaysCount ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Database Backup & Migration Suite */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Backup and restore
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Download a copy of all clinic data (staff, rosters, settings, history), or put a copy back. A backup of the current data always downloads before a restore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleExportBackup}
              disabled={isBusyAction}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download backup</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setImportJsonText('');
                setBackupStatusMessage(null);
                setIsImportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-medium transition-colors shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Restore from a backup...</span>
            </button>
          </div>
        </div>

        {/* Danger Zone: Clear Database */}
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-950 bg-red-50/40 dark:bg-red-950/20 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <h4 className="text-sm font-bold text-red-900 dark:text-red-300">Danger Zone</h4>
          </div>
          <p className="text-[11px] text-red-700 dark:text-red-400 leading-relaxed">
            Delete all clinic data (staff, rosters, settings and history) to start again from scratch. User access is kept, and a backup downloads first.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setClearConfirmInput('');
                setIsClearConfirmOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors shadow-xs cursor-pointer text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete all clinic data...</span>
            </button>
          </div>
        </div>
      </div>

      {isClearConfirmOpen && (
        <SettingsDialog
          size="sm"
          title="Delete all clinic data?"
          description="Staff, doctors, rosters, settings and history are deleted for everyone. A backup downloads first, and user access is kept."
          onClose={() => {
            if (isBusyAction) return;
            setIsClearConfirmOpen(false);
            setClearConfirmInput('');
          }}
          footer={
            <>
              <Button
                disabled={isBusyAction}
                onClick={() => {
                  setIsClearConfirmOpen(false);
                  setClearConfirmInput('');
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" icon={Trash2} busy={isBusyAction} disabled={clearConfirmInput.trim() !== 'CLEAR'} onClick={handleClearDatabase}>
                Download a backup and delete
              </Button>
            </>
          }
        >
          <Field label="To delete everything, type CLEAR">
            {(f) => (
              <Input
                {...f}
                autoComplete="off"
                value={clearConfirmInput}
                onChange={(e) => setClearConfirmInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isBusyAction && clearConfirmInput.trim() === 'CLEAR') {
                    e.preventDefault();
                    handleClearDatabase();
                  }
                }}
                className="font-mono uppercase"
              />
            )}
          </Field>
        </SettingsDialog>
      )}

      {isImportModalOpen && (
        <SettingsDialog
          title="Restore from a backup"
          // A restore in progress keeps the dialog open, like its disabled Cancel button.
          onClose={() => !isBusyAction && setIsImportModalOpen(false)}
          footer={
            <>
              <Button disabled={isBusyAction} onClick={() => setIsImportModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon={Upload} busy={isBusyAction} disabled={!backupCheck?.ok} onClick={handleImportBackup}>
                Download a backup and restore
              </Button>
            </>
          }
        >
          <Field label="Backup file (.json)">
            {(f) => (
              <input
                {...f}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="block text-sm text-ink-muted file:mr-3 file:h-9 file:rounded-md file:border file:border-line-strong file:bg-surface file:px-3 file:text-sm file:font-semibold file:text-ink hover:file:bg-sunken"
              />
            )}
          </Field>
          <Field label="Or paste the backup text">
            {(f) => <Textarea {...f} rows={6} value={importJsonText} onChange={(e) => setImportJsonText(e.target.value)} className="font-mono" />}
          </Field>
          {backupCheck && !backupCheck.ok && <Notice tone="danger" live title={backupCheck.error} />}
          {backupCheck?.ok && (
            <Notice
              tone="warning"
              title={`This backup${backupCheck.exportedAt ? ` of ${formatDateTime(backupCheck.exportedAt)}` : ''} has ${backupCheck.total} records (${
                ['nurses', 'doctors', 'schedules', 'assignments']
                  .filter((c) => backupCheck.counts[c])
                  .map((c) => `${backupCheck.counts[c]} ${c === 'schedules' ? 'rosters' : c === 'assignments' ? 'shifts' : c}`)
                  .join(', ') || 'settings only'
              }).`}
            >
              Restoring replaces all current clinic data for everyone. A backup of the current data downloads first. User access and the history of changes
              stay as they are.
            </Notice>
          )}
          {backupStatusMessage && <Notice tone={backupStatusMessage.error ? 'danger' : 'success'} live title={backupStatusMessage.text} />}
        </SettingsDialog>
      )}
    </>
  );
};
