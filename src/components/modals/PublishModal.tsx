/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Schedule Publish Wizard & Email Notification Modal (Phase 13)
 * Full Validation Gate, Versioning, Per-Nurse HTML Email Preview, Diff Generation & Dispatch.
 */

import React, { useState, useEffect, useId, useRef } from 'react';
import { useDialogA11y } from '../common/useDialogA11y';
import { notify } from '../common/dialogs';
import {
  X,
  Send,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Mail,
  User,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Layers,
  Lock,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Schedule,
  ScheduleVersion,
  Assignment,
  Nurse,
  DutyWindow,
  Doctor,
  DoctorSession,
  ClinicalRole,
  Specialty,
  SeniorityLevel,
  Rule,
  LeaveEntry,
  LeaveType,
  PublishLog,
  EmailRecipientLog,
  Acknowledgment,
  ShareLink,
  WorkingHoursPeriod,
  LockEntry,
} from '../../types';
import { ClinicContextState } from '../../types/navigation';
import { loadClinicSetup } from '../../services/engine/clinicSetupService';
import { ScheduleValidator, ValidationReport } from '../../services/validation/ScheduleValidator';
import { computeScheduleDiff, ScheduleVersionDiff } from '../../services/history/diffEngine';
import { RosterPublishService } from '../../services/publish/rosterPublishService';
import { EmailSettingsConfig, DEFAULT_EMAIL_SETTINGS } from '../../types/settings';
import { getRepository } from '../../services/repository';
import { syncPublicRoster } from '../../services/publish/publicRosterService';
import { escapeHtml } from '../../utils/escapeHtml';
import { EmailHtmlPreview } from '../common/EmailHtmlPreview';
import { cachedEmailSettings, loadEmailSettings } from '../../services/settings/emailSettingsStore';

interface PublishModalProps {
  context: ClinicContextState;
  schedule: Schedule;
  assignments: Assignment[];
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  doctors: Doctor[];
  sessions: DoctorSession[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  seniorityLevels: SeniorityLevel[];
  rules: Rule[];
  leaveEntries: LeaveEntry[];
  leaveTypes: LeaveType[];
  versions: ScheduleVersion[];
  workingHoursPeriods?: WorkingHoursPeriod[];
  locks?: LockEntry[];
  isOpen: boolean;
  onClose: () => void;
  onPublishComplete: (version: ScheduleVersion) => void;
  /** After resending failed emails (the email log changed, nothing was published). */
  onSendUpdated?: () => void;
  initialMode?: 'PUBLISH' | 'CHANGE';
}

type Step = 'VALIDATION' | 'DETAILS' | 'PREVIEW' | 'SENDING' | 'DONE';

export const PublishModal: React.FC<PublishModalProps> = ({
  context,
  schedule,
  assignments,
  nurses,
  dutyWindows,
  doctors,
  sessions,
  roles,
  specialties,
  seniorityLevels,
  rules,
  leaveEntries,
  leaveTypes,
  versions,
  workingHoursPeriods = [],
  locks = [],
  isOpen,
  onClose,
  onPublishComplete,
  onSendUpdated,
  initialMode = 'PUBLISH',
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('VALIDATION');
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);

  // Version & Mode Details
  const [publishKind, setPublishKind] = useState<'PUBLISH' | 'CHANGE'>(initialMode);
  const [versionNote, setVersionNote] = useState('');
  const [generalBroadcastNote, setGeneralBroadcastNote] = useState('');
  // Whether the emails link to the roster online (a share link anyone who has it can open).
  const [includeLink, setIncludeLink] = useState(false);
  const [hasPublicLink, setHasPublicLink] = useState(false);
  // Outcome of the last send, per nurse, and problems that didn't stop the publish.
  const [sendResults, setSendResults] = useState<EmailRecipientLog[]>([]);
  const [publishWarnings, setPublishWarnings] = useState<string[]>([]);
  // A publish already saved (version, link, log), so a retry only re-sends the failed emails.
  // `logId` is empty until every save step has finished, so a retry resumes from the step that failed.
  const runRef = useRef<{ version: ScheduleVersion; shareToken?: string; logId: string; recipients: EmailRecipientLog[] } | null>(null);

  // Email Config
  const [emailConfig, setEmailConfig] = useState<EmailSettingsConfig>(() => cachedEmailSettings());
  // The clinic's shared Sandbox / Live setting (not just this browser's)
  useEffect(() => {
    if (isOpen) loadEmailSettings(getRepository()).then(setEmailConfig).catch(() => {});
  }, [isOpen]);

  // Diff against previous published version
  const [previousPublishedVersion, setPreviousPublishedVersion] = useState<ScheduleVersion | null>(null);
  const [computedDiff, setComputedDiff] = useState<ScheduleVersionDiff | null>(null);

  // Preview selection
  const [previewNurseId, setPreviewNurseId] = useState<string>('');
  const [selectedNurseIds, setSelectedNurseIds] = useState<Set<string>>(new Set());

  // Sending Progress
  const [progressPercent, setProgressPercent] = useState(0);
  const [sendLogs, setSendLogs] = useState<string[]>([]);
  const [createdVersion, setCreatedVersion] = useState<ScheduleVersion | null>(null);

  // Latest roster check run, and whether its clinic details are still loading
  const validationRunRef = useRef(0);
  const [isClinicCheckPending, setIsClinicCheckPending] = useState(false);
  // Owner and editors may publish (the same people the database rules allow to write versions).
  const isOwner = ['OWNER', 'EDITOR', 'PLANNER'].includes(context.currentUser?.role || '');
  const repo = getRepository();

  /** Changes since the latest published version (same as shown in the change alert). */
  const computedDiffFor = (publishedList: ScheduleVersion[]) => {
    const lastPub = [...publishedList].sort((a, b) => b.number - a.number)[0];
    return computeScheduleDiff(
      lastPub.snapshot.assignments,
      assignments,
      nurses,
      dutyWindows,
      doctors,
      roles,
      specialties,
      `v${lastPub.number}`,
      `v${(schedule.activeVersionNumber || 1) + 1}`,
      lastPub.number,
      (schedule.activeVersionNumber || 1) + 1
    );
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('VALIDATION');
      setAcknowledgeWarnings(false);
      // The mode the dialog was opened with (it stays mounted between openings).
      setPublishKind(initialMode);
      runRef.current = null;
      setSendResults([]);
      setPublishWarnings([]);
      setCreatedVersion(null);
      // Off until this roster's links are known, so a choice from the last opening never carries over.
      setIncludeLink(false);
      setHasPublicLink(false);
      repo
        .list('shareLinks', { field: 'scheduleId', operator: '==', value: schedule.id })
        .then((links) => {
          const has = links.some((l) => l.public && !l.revoked);
          setHasPublicLink(has);
          setIncludeLink(has);
        })
        .catch(() => {
          setHasPublicLink(false);
          setIncludeLink(false);
        });
      setVersionNote(
        initialMode === 'CHANGE'
          ? `Change Alert — Shift adjustments for ${schedule.name}`
          : `Official Roster Release — ${schedule.name}`
      );
      setGeneralBroadcastNote('');
      setProgressPercent(0);
      setSendLogs([]);

      // 1. Run live validation
      const report = ScheduleValidator.validate(
        schedule,
        assignments,
        nurses,
        seniorityLevels,
        dutyWindows,
        sessions,
        leaveEntries,
        locks,
        roles,
        rules,
        workingHoursPeriods,
        specialties,
        doctors,
        leaveTypes
      );
      setValidationReport(report);
      // Check again with the clinic's opening hours, public holidays and the previous roster.
      // Only the latest check may update the report (the dialog can reopen meanwhile).
      const checkId = ++validationRunRef.current;
      setIsClinicCheckPending(true);
      loadClinicSetup(repo, schedule)
        .then((setup) => {
          if (checkId !== validationRunRef.current) return;
          setValidationReport(
            ScheduleValidator.validate(
              schedule, assignments, nurses, seniorityLevels, dutyWindows, sessions, leaveEntries, locks,
              roles, rules, workingHoursPeriods, specialties, doctors, leaveTypes, setup
            )
          );
        })
        .catch((err) => console.warn('[PublishModal] Clinic details could not be loaded for the check:', err))
        .finally(() => {
          if (checkId === validationRunRef.current) setIsClinicCheckPending(false);
        });

      // 2. Find latest published version for diffing
      // Only this roster's versions (the Publish page passes every roster's).
      const publishedList = versions.filter((v) => v.isPublished && v.scheduleId === schedule.id);
      if (publishedList.length > 0) {
        publishedList.sort((a, b) => b.number - a.number);
        const lastPub = publishedList[0];
        setPreviousPublishedVersion(lastPub);

        const diff = computeScheduleDiff(
          lastPub.snapshot.assignments,
          assignments,
          nurses,
          dutyWindows,
          doctors,
          roles,
          specialties,
          `v${lastPub.number}`,
          `v${(schedule.activeVersionNumber || 1) + 1}`,
          lastPub.number,
          (schedule.activeVersionNumber || 1) + 1
        );
        setComputedDiff(diff);
      } else {
        setPreviousPublishedVersion(null);
        setComputedDiff(null);
      }

      // 3. Recipients: everyone with an email, or for a change alert only nurses whose shifts changed.
      const activeNursesWithGmail = nurses.filter((n) => n.active && n.gmail);
      const changedIds = new Set(
        Object.entries(
          (publishedList.length > 0 ? computedDiffFor(publishedList) : null)?.changesByNurse || {}
        )
          .filter(([, list]) => list.length > 0)
          .map(([id]) => id)
      );
      const recipients =
        initialMode === 'CHANGE' && publishedList.length > 0
          ? activeNursesWithGmail.filter((n) => changedIds.has(n.id))
          : activeNursesWithGmail;
      setSelectedNurseIds(new Set(recipients.map((n) => n.id)));
      setPreviewNurseId((recipients[0] || activeNursesWithGmail[0])?.id || '');
    }
  }, [isOpen, schedule.id, initialMode]);

  const titleId = useId();
  // Esc does nothing while emails are being dispatched, so a stray key press can't hide a running publish.
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, () => {
    if (currentStep !== 'SENDING') onClose();
  });

  if (!isOpen) return null;

  // Selected nurse for preview
  const previewNurse = nurses.find((n) => n.id === previewNurseId) || nurses[0];

  // Generate preview email for selected nurse
  const previewPayload = previewNurse
    ? RosterPublishService.generatePersonalEmailHtml({
        clinicName: context.clinicName,
        schedule,
        version: {
          id: 'temp-preview',
          scheduleId: schedule.id,
          number: (schedule.activeVersionNumber || 1) + 1,
          timestamp: new Date().toISOString(),
          author: context.currentUser?.name || 'Administrator',
          note: versionNote,
          snapshot: {
            schedule,
            assignments,
            leaveEntries,
            locks,
            rulesSnapshot: rules,
          },
          isPublished: true,
          publishedAt: new Date().toISOString(),
        },
        nurse: previewNurse,
        assignments,
        dutyWindows,
        doctors,
        roles,
        specialties,
        leaveEntries,
        leaveTypes,
        changes: computedDiff?.changesByNurse[previewNurse.id] || [],
        generalNote: generalBroadcastNote,
        shareToken: includeLink ? 'preview' : undefined,
        ackToken: 'preview-token',
        isChangeAlert: publishKind === 'CHANGE',
        workingHoursPeriods,
      })
    : null;

  // --- PUBLISH AND SEND ---
  /** Overall result of a send, from each recipient's result. */
  const overallStatus = (list: EmailRecipientLog[]): PublishLog['status'] => {
    if (list.length === 0) return emailConfig.mockMode ? 'MOCK_SENT' : 'SENT';
    const failed = list.filter((r) => r.status === 'FAILED').length;
    if (failed === list.length) return 'FAILED';
    if (failed > 0) return 'PARTIAL';
    return list.every((r) => r.status === 'MOCK_SENT') ? 'MOCK_SENT' : 'SENT';
  };

  /**
   * Saves the published version, share links and an email log once per publish.
   * If a step fails, the next try continues with the version already saved
   * instead of making a second one.
   */
  const savePublish = async (logs: string[]) => {
    if (!runRef.current) await saveVersion();
    const run = runRef.current!;
    const { version: newVersion } = run;
    const versionId = newVersion.id;
    const newVersionNumber = newVersion.number;
    const nowIso = newVersion.timestamp;
    await repo.update('schedules', schedule.id, { status: 'PUBLISHED', activeVersionNumber: newVersionNumber, updatedAt: nowIso });

    // Every link of this roster (revoked ones too, so a restored link shows the latest version)
    // points to the new version; active links get a fresh public snapshot.
    const links = await repo.list('shareLinks', { field: 'scheduleId', operator: '==', value: schedule.id });
    let publicLink = links.find((l) => l.public && !l.revoked);
    if (includeLink && !publicLink) {
      // Only when the planner chose to include a link (the dialog says anyone with it can open it).
      publicLink = {
        id: uuidv4(),
        scheduleId: schedule.id,
        token: `sh_${crypto.randomUUID()}`,
        role: 'VIEWER',
        public: true,
        allowedEmails: [],
        createdAt: nowIso,
        revoked: false,
        pointsToVersionId: versionId,
      };
      await repo.create('shareLinks', publicLink);
      links.push(publicLink);
    }
    for (const link of links) {
      if (link.pointsToVersionId !== versionId) await repo.update('shareLinks', link.id, { pointsToVersionId: versionId });
      if (link.revoked) continue;
      try {
        await syncPublicRoster({ ...link, pointsToVersionId: versionId });
      } catch (syncErr: any) {
        // A snapshot problem must not stop the publish; the link can be refreshed from Share.
        const msg = `A share link couldn't be refreshed (${syncErr?.message || syncErr}). Open Share to refresh it.`;
        logs.push(`⚠ ${msg}`);
        setPublishWarnings((prev) => (prev.includes(msg) ? prev : [...prev, msg]));
      }
    }

    // The log is written before sending, and updated after each email, so an interrupted
    // publish still shows who was emailed.
    const logId = `pub-${schedule.id}-${Date.now()}`;
    const pubLog: PublishLog = {
      id: logId,
      scheduleId: schedule.id,
      versionId,
      kind: publishKind,
      recipients: [],
      status: 'SENDING',
      sentAt: nowIso,
    };
    await repo.create('emailLog', pubLog);
    run.shareToken = includeLink ? publicLink?.token : undefined;
    run.logId = logId;
    return run;
  };

  /** Writes the new version and remembers it, so it is never written twice. */
  const saveVersion = async () => {
    const scheduleVersions = await repo.list('versions', { field: 'scheduleId', operator: '==', value: schedule.id });
    const newVersionNumber = Math.max(schedule.activeVersionNumber || 1, ...scheduleVersions.map((v) => v.number || 0)) + 1;
    const versionId = `v-${schedule.id}-${newVersionNumber}-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const inRoster = (start: string, end: string) => end >= schedule.startDate && start <= schedule.endDate;

    const newVersion: ScheduleVersion = {
      id: versionId,
      scheduleId: schedule.id,
      number: newVersionNumber,
      timestamp: nowIso,
      author: context.currentUser?.name || context.currentUser?.email || 'Planner',
      note: versionNote.trim(),
      snapshot: {
        schedule,
        assignments,
        // Only this roster's leave and pinned days are kept with the version.
        leaveEntries: leaveEntries.filter((l) => inRoster(l.startDate, l.endDate)),
        locks: locks.filter((l) => inRoster(l.date, l.date)),
        rulesSnapshot: rules,
      },
      isPublished: true,
      publishedAt: nowIso,
    };
    await repo.create('versions', newVersion);
    runRef.current = { version: newVersion, logId: '', recipients: [] };
    setCreatedVersion(newVersion);
  };

  /** Sends to the given nurses; one failed email never stops the others. */
  const sendTo = async (targetNurses: Nurse[], logs: string[]) => {
    const run = runRef.current!;
    let done = 0;
    for (const nurse of targetNurses) {
      const ackToken = `ack-${uuidv4()}`;
      let recipientLog: EmailRecipientLog;
      try {
        const payload = RosterPublishService.generatePersonalEmailHtml({
          clinicName: context.clinicName,
          schedule,
          version: run.version,
          nurse,
          assignments,
          dutyWindows,
          doctors,
          roles,
          specialties,
          leaveEntries,
          leaveTypes,
          changes: computedDiff?.changesByNurse[nurse.id] || [],
          generalNote: generalBroadcastNote,
          shareToken: run.shareToken,
          ackToken,
          isChangeAlert: publishKind === 'CHANGE',
          workingHoursPeriods,
        });
        const result = await RosterPublishService.dispatchEmail(
          emailConfig,
          nurse.gmail,
          nurse,
          payload.subject,
          payload.bodyPreview,
          payload.html,
          schedule.id,
          run.version.id,
          ackToken
        );
        recipientLog = result.recipientLog;
        // A read receipt is only expected from a nurse who was actually emailed. If saving it
        // fails the email still went out, so it stays "sent" (a retry would email them twice).
        if (recipientLog.status !== 'FAILED') {
          try {
            await repo.create('acknowledgments', result.acknowledgment);
          } catch (ackErr: any) {
            const msg = `${nurse.fullName} was emailed, but their read receipt couldn't be saved (${ackErr?.message || ackErr}), so their confirm link won't work.`;
            logs.push(`⚠ ${msg}`);
            setPublishWarnings((prev) => [...prev, msg]);
          }
        }
      } catch (err: any) {
        recipientLog = {
          email: nurse.gmail,
          nurseId: nurse.id,
          nurseName: nurse.fullName,
          subject: '',
          bodyPreview: '',
          fullBodyHtml: '',
          status: 'FAILED',
          errorMessage: err?.message || String(err),
        };
      }
      run.recipients = [...run.recipients.filter((r) => r.nurseId !== nurse.id), recipientLog];
      const ok = recipientLog.status !== 'FAILED';
      logs.push(
        ok
          ? `✓ ${nurse.fullName}${recipientLog.status === 'MOCK_SENT' ? ' (test mode, not sent)' : ''}`
          : `✗ ${nurse.fullName}: ${recipientLog.errorMessage || 'not sent'}`
      );
      setSendLogs([...logs]);
      done++;
      setProgressPercent(Math.round((done / Math.max(1, targetNurses.length)) * 100));
      try {
        await repo.update('emailLog', run.logId, { recipients: run.recipients, status: 'SENDING' });
      } catch {
        // the final update below tries again
      }
      await new Promise((r) => setTimeout(r, 60));
    }
  };

  /** Records the result. A retry only updates the email log; the publish was already recorded. */
  const finishSend = async (isRetry = false) => {
    const run = runRef.current!;
    const status = overallStatus(run.recipients);
    await repo.update('emailLog', run.logId, { recipients: run.recipients, status });
    setSendResults([...run.recipients]);
    setCurrentStep('DONE');
    if (isRetry) {
      onSendUpdated?.();
      return;
    }
    const failed = run.recipients.filter((r) => r.status === 'FAILED').length;
    await repo
      .create('audit', {
        actor: context.currentUser?.name || context.currentUser?.email || 'Planner',
        action: 'PUBLISH',
        entity: 'Schedule',
        entityId: schedule.id,
        note: `Published v${run.version.number} (${publishKind}): ${run.recipients.length - failed} emailed, ${failed} failed.`,
        timestamp: new Date().toISOString(),
      })
      .catch(() => {});
    onPublishComplete(run.version);
  };

  const handleExecuteDispatch = async () => {
    setCurrentStep('SENDING');
    setProgressPercent(0);
    const logs: string[] = [];
    try {
      if (!runRef.current?.logId) await savePublish(logs);
      await sendTo(nurses.filter((n) => selectedNurseIds.has(n.id)), logs);
      await finishSend();
    } catch (err: any) {
      // Nothing is saved or sent twice: publishing again carries on from where it stopped.
      notify(`Publishing stopped: ${err.message}`, 'error');
      if (runRef.current?.logId) {
        setSendResults([...runRef.current.recipients]);
        setCurrentStep('DONE');
      } else {
        setCurrentStep('PREVIEW');
      }
    }
  };

  const handleRetryFailed = async () => {
    const run = runRef.current;
    if (!run) return;
    const doneIds = new Set(run.recipients.filter((r) => r.status !== 'FAILED').map((r) => r.nurseId));
    const retry = nurses.filter((n) => selectedNurseIds.has(n.id) && !doneIds.has(n.id));
    setCurrentStep('SENDING');
    setProgressPercent(0);
    const logs: string[] = [];
    try {
      await sendTo(retry, logs);
      await finishSend(true);
    } catch (err: any) {
      notify(`Sending stopped: ${err.message}`, 'error');
      setSendResults([...run.recipients]);
      setCurrentStep('DONE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Send className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="text-base font-bold text-slate-900">
                  {publishKind === 'CHANGE' ? 'Publish Schedule Change Alerts' : 'Publish Official Duty Roster'}
                </h2>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-slate-500 font-mono">
                  {schedule.name} · Target: v{(schedule.activeVersionNumber || 1) + 1}
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">
                  <Mail className="w-3 h-3 text-rose-600" />
                  <span>Email from the clinic account ({emailConfig.mockMode ? 'Sandbox, nothing is sent' : 'Live'})</span>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={currentStep === 'SENDING'}
            aria-label="Close"
            title={currentStep === 'SENDING' ? 'Wait until sending finishes' : 'Close'}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Wizard Step Breadcrumbs */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
          <span className={currentStep === 'VALIDATION' ? 'text-indigo-600 font-bold' : ''}>
            1. Check
          </span>
          <span>›</span>
          <span className={currentStep === 'DETAILS' ? 'text-indigo-600 font-bold' : ''}>
            2. Message
          </span>
          <span>›</span>
          <span className={currentStep === 'PREVIEW' ? 'text-indigo-600 font-bold' : ''}>
            3. Preview
          </span>
          <span>›</span>
          <span className={currentStep === 'SENDING' ? 'text-indigo-600 font-bold' : ''}>
            4. Send
          </span>
          <span>›</span>
          <span className={currentStep === 'DONE' ? 'text-emerald-600 font-bold' : ''}>
            5. Done
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* OWNER CHECK */}
          {!isOwner && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <span>You can't publish rosters</span>
              </div>
              <p className="text-xs leading-relaxed">
                Only the clinic owner and people who can edit rosters can publish. Ask one of them to publish this roster.
              </p>
            </div>
          )}

          {/* STEP 1: VALIDATION GATE */}
          {currentStep === 'VALIDATION' && isOwner && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <h3 className="font-bold text-slate-800 text-xs">Pre-Publish Clinical Rule Audit</h3>
                <p className="text-slate-500 text-[11px]">
                  Before broadcasting to nurses, ClinicRoster verifies that all hard clinical safety constraints are satisfied.
                </p>
              </div>

              {validationReport && (
                <div className="space-y-3">
                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className={`p-3 rounded border text-center ${
                        validationReport.errorCount > 0
                          ? 'border-rose-300 bg-rose-50 text-rose-900'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      }`}
                    >
                      <div className="text-2xl font-bold font-mono">{validationReport.errorCount}</div>
                      <div className="text-[10px] font-semibold uppercase mt-0.5">
                        {validationReport.errorCount > 0 ? 'Hard Errors (Blocking)' : 'Zero Hard Errors'}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded border text-center ${
                        validationReport.warnCount > 0
                          ? 'border-amber-300 bg-amber-50 text-amber-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-2xl font-bold font-mono">{validationReport.warnCount}</div>
                      <div className="text-[10px] font-semibold uppercase mt-0.5">Warnings (Review)</div>
                    </div>

                    <div className="p-3 rounded border border-slate-200 bg-slate-50 text-slate-700 text-center">
                      <div className="text-2xl font-bold font-mono">{nurses.length}</div>
                      <div className="text-[10px] font-semibold uppercase mt-0.5">Recipient Staff</div>
                    </div>
                  </div>

                  {/* Findings breakdown */}
                  {validationReport.errorCount > 0 && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-900 space-y-2 text-xs">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Hard Constraint Violations Detected:</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[11px]">
                        {validationReport.findings
                          .filter((f) => f.severity === 'ERROR')
                          .slice(0, 5)
                          .map((f, i) => (
                            <li key={i}>{f.message}</li>
                          ))}
                      </ul>
                      <p className="font-semibold text-rose-800 text-[11px] pt-1">
                        Publishing is blocked. Please resolve errors in the Roster Grid or apply a Lock Override.
                      </p>
                    </div>
                  )}

                  {validationReport.errorCount === 0 && validationReport.warnCount > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 space-y-2 text-xs">
                      <div className="font-bold flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Schedule Warnings ({validationReport.warnCount}):</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[11px]">
                        {validationReport.findings
                          .filter((f) => f.severity === 'WARN')
                          .slice(0, 4)
                          .map((f, i) => (
                            <li key={i}>{f.message}</li>
                          ))}
                      </ul>
                      <div className="pt-2 border-t border-amber-200">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                          <input
                            type="checkbox"
                            checked={acknowledgeWarnings}
                            onChange={(e) => setAcknowledgeWarnings(e.target.checked)}
                            className="rounded text-indigo-600"
                          />
                          <span>I have reviewed these {validationReport.warnCount} warnings and confirm publication</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {validationReport.errorCount === 0 && validationReport.warnCount === 0 && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>All clinical constraints verified. Schedule is 100% compliant and ready to publish.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: VERSION NOTE & MODE */}
          {currentStep === 'DETAILS' && (
            <div className="space-y-4">
              {/* Mode Selector */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="font-bold text-slate-800 text-xs block">Publishing Notification Mode:</span>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded border cursor-pointer flex flex-col gap-1 transition-colors ${
                      publishKind === 'PUBLISH'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Full Schedule Broadcast</span>
                      <input
                        type="radio"
                        name="publishKind"
                        checked={publishKind === 'PUBLISH'}
                        onChange={() => setPublishKind('PUBLISH')}
                        className="text-indigo-600"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Standard release. Each nurse receives their complete roster for the period.
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded border cursor-pointer flex flex-col gap-1 transition-colors ${
                      publishKind === 'CHANGE'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Schedule Change Alert</span>
                      <input
                        type="radio"
                        name="publishKind"
                        checked={publishKind === 'CHANGE'}
                        onChange={() => setPublishKind('CHANGE')}
                        className="text-indigo-600"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Revision update. Highlights personal shift changes against the previous version.
                    </span>
                  </label>
                </div>
              </div>

              {/* Version Note */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800 text-xs">
                  Version Release Note <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  aria-label="Version release note"
                  placeholder="e.g. Official October release approved by Clinical Director"
                  value={versionNote}
                  onChange={(e) => setVersionNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-medium text-xs focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400">
                  Kept with this version in the roster's history.
                </p>
              </div>

              {/* General Broadcast Note */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800 text-xs">
                  Optional Broadcast Message to Staff:
                </label>
                <textarea
                  rows={2}
                  aria-label="Optional broadcast message to staff"
                  placeholder="e.g. Please note Dr. Yusuf's Thursday sessions start at 15:00. Contact supervisor for swaps."
                  value={generalBroadcastNote}
                  onChange={(e) => setGeneralBroadcastNote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Link to the roster online */}
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <label className="flex items-start gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeLink}
                    onChange={(e) => setIncludeLink(e.target.checked)}
                    className="rounded text-indigo-600 mt-0.5"
                  />
                  <span>
                    Include a link to view the roster online
                    <span className="block text-[11px] font-normal text-slate-500">
                      {hasPublicLink
                        ? 'Uses the roster\'s existing share link. Anyone who has the link can open it.'
                        : 'Creates a share link for this roster. Anyone who has the link can open it; you can remove it later in Share.'}
                    </span>
                  </span>
                </label>
              </div>

              {/* Recipients */}
              {(() => {
                const withEmail = nurses.filter((n) => n.active && n.gmail);
                const noEmail = nurses.filter((n) => n.active && !n.gmail);
                const changedIds = new Set(
                  Object.entries(computedDiff?.changesByNurse || {})
                    .filter(([, list]) => list.length > 0)
                    .map(([id]) => id)
                );
                const toggle = (id: string) =>
                  setSelectedNurseIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                return (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">
                        Send to {selectedNurseIds.size} of {withEmail.length} nurses
                      </span>
                      <span className="flex gap-2 text-[11px]">
                        <button type="button" className="text-indigo-700 underline cursor-pointer" onClick={() => setSelectedNurseIds(new Set(withEmail.map((n) => n.id)))}>
                          All
                        </button>
                        {computedDiff && (
                          <button type="button" className="text-indigo-700 underline cursor-pointer" onClick={() => setSelectedNurseIds(new Set(withEmail.filter((n) => changedIds.has(n.id)).map((n) => n.id)))}>
                            Only nurses with changes ({withEmail.filter((n) => changedIds.has(n.id)).length})
                          </button>
                        )}
                        <button type="button" className="text-indigo-700 underline cursor-pointer" onClick={() => setSelectedNurseIds(new Set())}>
                          None
                        </button>
                      </span>
                    </div>
                    <div className="max-h-40 overflow-y-auto border border-slate-200 rounded divide-y divide-slate-100">
                      {withEmail.map((n) => (
                        <label key={n.id} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-50">
                          <input type="checkbox" checked={selectedNurseIds.has(n.id)} onChange={() => toggle(n.id)} className="rounded" />
                          <span className="text-slate-800">{n.fullName}</span>
                          <span className="text-slate-400 text-[11px] truncate">{n.gmail}</span>
                          {changedIds.has(n.id) && <span className="ml-auto text-[10px] text-amber-700">changed</span>}
                        </label>
                      ))}
                    </div>
                    {noEmail.length > 0 && (
                      <p className="text-[11px] text-amber-800">
                        {noEmail.length} nurse{noEmail.length === 1 ? ' has' : 's have'} no email address and won't be emailed: {noEmail.map((n) => n.fullName).join(', ')}.
                        Add it in Nurses.
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* STEP 3: PREVIEW PER-NURSE HTML EMAIL */}
          {currentStep === 'PREVIEW' && (
            <div className="space-y-4">
              {/* Nurse selector toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-800 text-xs">Inspect Nurse Email:</span>
                  <select
                    aria-label="Inspect nurse email"
                    value={previewNurseId}
                    onChange={(e) => setPreviewNurseId(e.target.value)}
                    className="px-2.5 py-1 border border-slate-300 rounded bg-white text-xs font-semibold text-slate-800"
                  >
                    {nurses
                      .filter((n) => n.active && n.gmail)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.fullName} ({n.gmail})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                    <Mail className="w-3 h-3 text-rose-600" />
                    <span>Email from the clinic account ({emailConfig.mockMode ? 'Sandbox, nothing is sent' : 'Live'})</span>
                  </span>
                  <span className="text-slate-400">·</span>
                  <span><strong>{selectedNurseIds.size} staff</strong> ({emailConfig.mockMode ? 'Safe Sandbox' : 'Live Google'})</span>
                </div>
              </div>

              {/* HTML Preview Box */}
              {previewPayload && (
                <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-100">
                  <div className="p-2.5 bg-slate-200/80 border-b border-slate-300 flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <span className="truncate max-w-md">Subject: <strong>{previewPayload.subject}</strong></span>
                    <span>Format: Responsive HTML</span>
                  </div>

                  <div className="p-4 max-h-[360px] overflow-y-auto bg-slate-50">
                    <EmailHtmlPreview html={previewPayload.html} className="h-[320px]" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SENDING PROGRESS */}
          {currentStep === 'SENDING' && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-slate-800">
                  {emailConfig.mockMode ? 'Test mode: nothing is really sent' : 'Sending emails'}…
                </span>
                <span className="font-bold text-indigo-600 text-sm">{progressPercent}%</span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <ul className="border border-slate-200 rounded p-3 bg-white text-[11px] space-y-1 max-h-48 overflow-y-auto" aria-live="polite">
                {sendLogs.map((log, i) => (
                  <li key={i} className={log.startsWith('✗') ? 'text-rose-700' : log.startsWith('⚠') ? 'text-amber-700' : 'text-slate-700'}>
                    {log}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* STEP 5: DONE */}
          {currentStep === 'DONE' && createdVersion && (() => {
            const failed = sendResults.filter((r) => r.status === 'FAILED');
            const sent = sendResults.length - failed.length;
            const testMode = sendResults.length > 0 && sendResults.every((r) => r.status === 'MOCK_SENT' || r.status === 'FAILED') && sent > 0;
            return (
              <div className="space-y-4 py-2">
                <div className="text-center space-y-1">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                      failed.length === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {failed.length === 0 ? <CheckCircle2 className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {failed.length === 0
                      ? testMode
                        ? `Published v${createdVersion.number} (test mode: ${sent} emails not really sent)`
                        : `Published v${createdVersion.number} and emailed ${sent} nurse${sent === 1 ? '' : 's'}`
                      : `Published v${createdVersion.number}: ${failed.length} email${failed.length === 1 ? '' : 's'} not sent`}
                  </h3>
                  <p className="text-xs text-slate-600">Nurses can confirm they've seen it. Replies show on the Publish page.</p>
                </div>

                {failed.length > 0 && (
                  <div className="p-3 rounded border border-rose-200 bg-rose-50 text-xs text-rose-900 space-y-1">
                    <p className="font-semibold">Not sent:</p>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {failed.map((r) => (
                        <li key={r.nurseId}>
                          {r.nurseName} ({r.email || 'no email'}): {r.errorMessage || 'unknown error'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {publishWarnings.length > 0 && (
                  <div className="p-3 rounded border border-amber-200 bg-amber-50 text-xs text-amber-900 space-y-1">
                    {publishWarnings.map((w, i) => (
                      <p key={i}>{w}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {currentStep === 'VALIDATION' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  !isOwner ||
                  isClinicCheckPending ||
                  (validationReport?.errorCount ?? 0) > 0 ||
                  ((validationReport?.warnCount ?? 0) > 0 && !acknowledgeWarnings)
                }
                onClick={() => setCurrentStep('DETAILS')}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer disabled:opacity-40 shadow-xs"
              >
                <span>{isClinicCheckPending ? 'Checking the roster…' : 'Continue to Version Details'}</span>
              </button>
            </>
          )}

          {currentStep === 'DETAILS' && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep('VALIDATION')}
                className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                disabled={!versionNote.trim()}
                onClick={() => setCurrentStep('PREVIEW')}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer disabled:opacity-40 shadow-xs"
              >
                <span>Preview Email Dispatches</span>
              </button>
            </>
          )}

          {currentStep === 'PREVIEW' && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep('DETAILS')}
                className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleExecuteDispatch}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Publish and email {selectedNurseIds.size} nurse{selectedNurseIds.size === 1 ? '' : 's'}</span>
              </button>
            </>
          )}

          {currentStep === 'DONE' && (
            <div className="w-full flex items-center justify-end gap-2">
              {sendResults.some((r) => r.status === 'FAILED') && (
                <button
                  type="button"
                  onClick={handleRetryFailed}
                  className="px-4 py-2 border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 rounded font-bold cursor-pointer"
                >
                  Retry the {sendResults.filter((r) => r.status === 'FAILED').length} not sent
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded font-bold cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
