/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings, Data and backup (owner only): the record counts (counted by Firestore, Phase 8
 * slice 1f), download a backup, restore one, and delete all clinic data.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Trash2, Download, Upload, RefreshCw } from 'lucide-react';
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
  const [statsError, setStatsError] = useState('');
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [clearConfirmInput, setClearConfirmInput] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [backupStatusMessage, setBackupStatusMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [isBusyAction, setIsBusyAction] = useState(false);

  // --- 12. Database & Seed Data Management (Phase 15) ---
  const loadStats = async () => {
    setIsLoadingStats(true);
    setStatsError('');
    try {
      const stats = await getDatabaseStatistics(repo);
      setDbStats(stats);
    } catch (e: any) {
      console.error('Failed to load database stats:', e);
      setStatsError(e?.message || String(e));
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
      notify('Type CLEAR to delete everything.', 'warning');
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
        notify(`Some data could not be deleted: ${failed.join(', ')}. A backup was downloaded first.`, 'error');
      } else {
        triggerSaveNotification('All clinic data was deleted. A backup was downloaded first. User access was kept.');
      }
    } catch (err: any) {
      notify(`The data was not deleted: ${err.message}`, 'error');
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
      notify(`The backup was not downloaded: ${err.message}`, 'error');
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
      <div className="space-y-6 text-sm">
        <div>
          <h2 className="text-lg font-semibold text-ink">Data and backup</h2>
          <p className="mt-1 max-w-2xl text-ink-muted">How much the clinic has saved, a backup of everything to keep, and putting a backup back.</p>
        </div>

        <section aria-labelledby="data-counts" className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 id="data-counts" className="text-base font-semibold text-ink">
                What is saved
              </h3>
              <p className="text-ink-muted">
                Counted in Cloud Firestore (project {defaultFirebaseConfig.projectId}, database {defaultFirebaseConfig.firestoreDatabaseId || 'default'}).
              </p>
            </div>
            <Button size="sm" icon={RefreshCw} busy={isLoadingStats} onClick={loadStats}>
              Count again
            </Button>
          </div>
          {statsError && (
            <Notice tone="danger" title="The records could not be counted" live>
              {statsError}
            </Notice>
          )}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-busy={isLoadingStats}>
            {(
              [
            ['Nurses', dbStats?.nursesCount],
            ['Doctors', dbStats?.doctorsCount],
            ['Doctor clinics', dbStats?.sessionsCount],
            ['Rosters', dbStats?.schedulesCount],
            ['Shifts', dbStats?.assignmentsCount],
            ['Leave entries', dbStats?.leaveEntriesCount],
            ['Pinned days', dbStats?.locksCount],
            ['Rules', dbStats?.rulesCount],
            ['Saved versions', dbStats?.versionsCount],
            ['Templates', dbStats?.templatesCount],
            ['Swaps', dbStats?.swapsCount],
            ['History of changes', dbStats?.auditCount],
            ['Public holidays', dbStats?.holidaysCount],
            ['Time periods', dbStats?.workingHoursPeriodsCount],
              ] as [string, number | undefined][]
            ).map(([label, count]) => (
              <div key={label} className="rounded-lg border border-line bg-sunken p-3">
                <dt className="text-ink-muted">{label}</dt>
                <dd className="text-xl font-semibold text-ink tabular-nums">{count ?? '…'}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="data-backup" className="space-y-3 rounded-lg border border-line p-4">
          <div>
            <h3 id="data-backup" className="text-base font-semibold text-ink">
              Backup and restore
            </h3>
            <p className="text-ink-muted">
              Download a backup of all clinic data (staff, rosters, settings and history), or put a backup back. A backup of the current data always
              downloads before a restore.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" icon={Download} busy={isBusyAction} onClick={handleExportBackup}>
              Download a backup
            </Button>
            <Button
              icon={Upload}
              onClick={() => {
                setImportJsonText('');
                setBackupStatusMessage(null);
                setIsImportModalOpen(true);
              }}
            >
              Restore from a backup
            </Button>
          </div>
        </section>

        <section aria-labelledby="data-delete" className="space-y-3 rounded-lg border border-danger-line bg-danger-soft p-4">
          <div>
            <h3 id="data-delete" className="text-base font-semibold text-danger">
              Delete all clinic data
            </h3>
            <p className="text-ink">
              Deletes staff, rosters, settings and history to start again. User access is kept, and a backup downloads first.
            </p>
          </div>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => {
              setClearConfirmInput('');
              setIsClearConfirmOpen(true);
            }}
          >
            Delete all clinic data
          </Button>
        </section>
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
