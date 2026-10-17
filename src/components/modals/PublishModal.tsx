/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Publish dialog: checks the roster for problems, saves a new version,
 * previews each nurse's email and sends them. On the shared Dialog, with its steps
 * shown, since Phase 7, slice 6a.
 */

import type { HoursHistory } from '../../services/hours/hoursBalance';

import React, { useState, useEffect, useId, useRef } from 'react';
import { notify } from '../common/dialogs';
import { AlertTriangle, Check, ChevronRight, Mail, RotateCcw, Send, XCircle } from 'lucide-react';
import { Badge, Button, Checkbox, Dialog, Field, Input, Notice, Select, Textarea, cx } from '../ui';
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
  WorkingHoursPeriod,
  LockEntry,
} from '../../types';
import { ClinicContextState } from '../../types/navigation';
import { loadClinicSetup } from '../../services/engine/clinicSetupService';
import { ScheduleValidator, ValidationReport } from '../../services/validation/ScheduleValidator';
import { computeScheduleDiff, ScheduleVersionDiff } from '../../services/history/diffEngine';
import { RosterPublishService } from '../../services/publish/rosterPublishService';
import { recipientsForLog } from '../../services/publish/emailLogSize';
import { overallSendStatus } from '../../services/publish/resumePublish';
import { EmailSettingsConfig } from '../../types/settings';
import { getRepository } from '../../services/repository';
import { syncPublicRoster } from '../../services/publish/publicRosterService';
import { ensureNurseLink, syncNurseRosters, nurseLinkUrl } from '../../services/publish/nurseRosterService';
import { EmailHtmlPreview } from '../common/EmailHtmlPreview';
import { cachedEmailSettings, loadEmailSettings } from '../../services/settings/emailSettingsStore';
import { checkEmailReadiness } from '../../services/email/emailReadiness';

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
  /** Shown as a "Show problems" button when publishing is blocked; the dialog closes first. */
  onShowProblems?: () => void;
}

type Step = 'VALIDATION' | 'DETAILS' | 'PREVIEW' | 'SENDING' | 'DONE';

const TEST_MODE_TEXT = 'Test mode: nothing is actually emailed.';

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
  onShowProblems,
}) => {
  const [hoursHistory, setHoursHistory] = useState<HoursHistory>();
  const hoursHistoryRef = useRef<HoursHistory | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState<Step>('VALIDATION');
  // Closing or reloading the tab while emails go out would leave the rest of the nurses
  // without their email, so the browser asks first.
  useEffect(() => {
    if (currentStep !== 'SENDING') return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [currentStep]);
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
  // `nurseTokens`: each nurse's private link token (nurse id to token), for her email.
  const runRef = useRef<{
    version: ScheduleVersion;
    shareToken?: string;
    nurseTokens?: Record<string, string>;
    logId: string;
    recipients: EmailRecipientLog[];
  } | null>(null);

  // Email Config
  const [emailConfig, setEmailConfig] = useState<EmailSettingsConfig>(() => cachedEmailSettings());
  const [emailIssue, setEmailIssue] = useState('');
  const sendingRef = useRef(false);
  // The clinic's shared Sandbox / Live setting (not just this browser's)
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setEmailIssue('');
    loadEmailSettings(getRepository(), true).then(async config => {
      if (!active) return;
      setEmailConfig(config);
      if (!config.mockMode) {
        const status = await checkEmailReadiness();
        if (active && !status.ready) setEmailIssue(status.message);
      }
    }).catch(err => { if (active) setEmailIssue(err.message); });
    return () => { active = false; };
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
          ? `Shift changes for ${schedule.name}`
          : `Roster for ${schedule.name}`
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
          setHoursHistory(setup.hoursHistory);
          hoursHistoryRef.current = setup.hoursHistory;
          setValidationReport(
            ScheduleValidator.validate(
              schedule, assignments, nurses, seniorityLevels, dutyWindows, sessions, leaveEntries, locks,
              roles, rules, workingHoursPeriods, specialties, doctors, leaveTypes, setup
            )
          );
        })
        .catch((err) => {
          console.warn('[PublishModal] Clinic details could not be loaded for the check:', err);
          if (checkId === validationRunRef.current) setValidationReport(previous => previous ? ({ ...previous, errorCount: previous.errorCount + 1,
            findings: [...previous.findings, { id: 'hours-history-unavailable', category: 'RULE_VIOLATION', severity: 'ERROR',
              message: 'The saved hours history could not be loaded. Close this dialog and try again before publishing.', affectedNurseIds: [], cellRefs: [] }] }) : previous);
        })
        .finally(() => {
          if (checkId === validationRunRef.current) setIsClinicCheckPending(false);
        });

      // 2. Find latest published version for diffing
      // Only this roster's versions (it is given every roster's).
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

  const noEmailId = useId();

  if (!isOpen) return null;

  // Shown at the top of the preview and send steps when the clinic's email setting is in test mode.
  const testModeBanner = emailConfig.mockMode ? (
    <Notice tone="warning" title={TEST_MODE_TEXT}>
      You can change this in Settings, Email.
    </Notice>
  ) : null;

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
          author: context.currentUser?.name || context.currentUser?.email || 'Planner',
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
        privateRosterUrl: nurseLinkUrl('preview'),
        ackToken: 'preview-token',
        isChangeAlert: publishKind === 'CHANGE',
        workingHoursPeriods,
        hoursHistory,
      })
    : null;

  // --- PUBLISH AND SEND ---
  /** Overall result of a send, from each recipient's result. */
  const overallStatus = (list: EmailRecipientLog[]): PublishLog['status'] => overallSendStatus(list, emailConfig.mockMode);

  /**
   * Saves the published version, share links and an email log once per publish.
   * If a step fails, the next try continues with the version already saved
   * instead of making a second one.
   */
  const savePublish = async (logs: string[]) => {
    const setup = await loadClinicSetup(repo, schedule);
    const freshCheck = ScheduleValidator.validate(schedule, assignments, nurses, seniorityLevels, dutyWindows, sessions,
      leaveEntries, locks, roles, rules, workingHoursPeriods, specialties, doctors, leaveTypes, setup);
    setValidationReport(freshCheck);
    if (freshCheck.errorCount > 0) throw new Error('The roster has problems that must be fixed before publishing. Review Problems and try again.');
    hoursHistoryRef.current = setup.hoursHistory;
    setHoursHistory(setup.hoursHistory);
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

    // Each nurse's private page (personal calendar and team sheets) gets the new version. Like the share
    // link snapshots above, a problem here never stops the publish.
    const addWarning = (msg: string) => {
      logs.push(`⚠ ${msg}`);
      setPublishWarnings((prev) => (prev.includes(msg) ? prev : [...prev, msg]));
    };
    try {
      const activeIds = new Set(nurses.filter((n) => n.active).map((n) => n.id));
      const onRoster = new Set<string>([
        ...assignments.filter((a) => a.scheduleId === schedule.id || !a.scheduleId).map((a) => a.nurseId),
        ...leaveEntries
          .filter((l) => l.approved && l.endDate >= schedule.startDate && l.startDate <= schedule.endDate)
          .map((l) => l.nurseId),
        ...selectedNurseIds,
      ]);
      const ids = [...onRoster].filter((id) => activeIds.has(id));
      const nurseTokens: Record<string, string> = {};
      let linkFailures = 0;
      for (const id of ids) {
        try {
          nurseTokens[id] = (await ensureNurseLink(repo, id)).token;
        } catch {
          linkFailures++;
        }
      }
      // Every nurse with a link is refreshed, so a nurse taken off this roster loses its old shifts too.
      const synced = await syncNurseRosters(repo, undefined, [newVersion]);
      // Only pages that were written are linked in the emails.
      const written = new Set(synced.syncedIds);
      run.nurseTokens = Object.fromEntries(Object.entries(nurseTokens).filter(([id]) => written.has(id)));
      if (linkFailures > 0 || synced.failed.length > 0) {
        addWarning(
          `${linkFailures + synced.failed.length} nurse private page(s) couldn't be updated. Open Publish, Private links, to update them.`
        );
      }
    } catch (nurseErr: any) {
      addWarning(`Nurse private pages couldn't be updated (${nurseErr?.message || nurseErr}). Open Publish, Private links, to update them.`);
    }

    // The log is written before sending with every nurse to email as Waiting, each with the
    // receipt token made now, and updated after each email. A publish that stops partway (a
    // closed tab) can then be resumed later to the nurses still waiting (resumePublish.ts).
    const logId = `pub-${schedule.id}-${Date.now()}`;
    run.shareToken = includeLink ? publicLink?.token : undefined;
    run.recipients = nurses
      .filter((n) => selectedNurseIds.has(n.id))
      .map((n) => ({
        email: n.gmail,
        nurseId: n.id,
        nurseName: n.fullName,
        subject: '',
        bodyPreview: '',
        fullBodyHtml: '',
        status: 'WAITING' as const,
        ackToken: `ack-${uuidv4()}`,
      }));
    const pubLog: PublishLog = {
      id: logId,
      scheduleId: schedule.id,
      versionId,
      kind: publishKind,
      recipients: run.recipients,
      status: 'SENDING',
      sentAt: nowIso,
      updatedAt: new Date().toISOString(),
      ...(generalBroadcastNote.trim() ? { message: generalBroadcastNote.trim() } : {}),
      ...(run.shareToken ? { shareToken: run.shareToken } : {}),
    };
    await repo.create('emailLog', pubLog);
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
        contractPercents: Object.fromEntries(nurses.map((n) => [n.id, n.contractPercent ?? 100])),
      },
      isPublished: true,
      publishedAt: nowIso,
    };
    await repo.create('versions', newVersion);
    runRef.current = { version: newVersion, logId: '', recipients: [] };
    setCreatedVersion(newVersion);
  };

  /** Sends to the given nurses; one failed email never stops the others. */
  const sendTo = async (targetNurses: Nurse[], logs: string[], sendingConfig: EmailSettingsConfig) => {
    const run = runRef.current!;
    let done = 0;
    for (const nurse of targetNurses) {
      // The token listed for the nurse before sending (a nurse added on a retry gets a new one).
      const ackToken = run.recipients.find((r) => r.nurseId === nurse.id)?.ackToken || `ack-${uuidv4()}`;
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
          privateRosterUrl: run.nurseTokens?.[nurse.id] ? nurseLinkUrl(run.nurseTokens[nurse.id]) : undefined,
          ackToken,
          isChangeAlert: publishKind === 'CHANGE',
          workingHoursPeriods,
          hoursHistory: hoursHistoryRef.current,
        });
        const result = await RosterPublishService.dispatchEmail(
          sendingConfig,
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
        if (recipientLog.status === 'SENT') {
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
      recipientLog = { ...recipientLog, ackToken };
      run.recipients = run.recipients.some((r) => r.nurseId === nurse.id)
        ? run.recipients.map((r) => (r.nurseId === nurse.id ? recipientLog : r))
        : [...run.recipients, recipientLog];
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
        await repo.update('emailLog', run.logId, { recipients: recipientsForLog(run.recipients), status: 'SENDING', updatedAt: new Date().toISOString() });
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
    await repo.update('emailLog', run.logId, { recipients: recipientsForLog(run.recipients), status, updatedAt: new Date().toISOString() });
    setSendResults([...run.recipients]);
    setCurrentStep('DONE');
    if (isRetry) {
      onSendUpdated?.();
      return;
    }
    const failed = run.recipients.filter((r) => r.status === 'FAILED').length;
    const sent = run.recipients.filter((r) => r.status === 'SENT').length;
    const simulated = run.recipients.filter((r) => r.status === 'MOCK_SENT').length;
    await repo
      .create('audit', {
        actor: context.currentUser?.name || context.currentUser?.email || 'Planner',
        action: 'PUBLISH',
        entity: 'Schedule',
        entityId: schedule.id,
        note: `Published version ${run.version.number} (${publishKind === 'CHANGE' ? 'changes only' : 'the whole roster'}): ${sent} emailed, ${simulated} in test mode, ${failed} not sent.`,
        timestamp: new Date().toISOString(),
      })
      .catch(() => {});
    onPublishComplete(run.version);
  };

  const handlePublishAndSend = async () => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setCurrentStep('SENDING');
    setProgressPercent(0);
    const logs: string[] = [];
    try {
      setEmailIssue('');
      const sendingConfig = await prepareEmail();
      if (!runRef.current?.logId) await savePublish(logs);
      const sentIds = new Set(runRef.current?.recipients.filter((r) => r.status === 'SENT' || r.status === 'MOCK_SENT').map((r) => r.nurseId));
      await sendTo(nurses.filter((n) => selectedNurseIds.has(n.id) && !sentIds.has(n.id)), logs, sendingConfig);
      await finishSend();
    } catch (err: any) {
      // Nothing is saved or sent twice: publishing again carries on from where it stopped.
      notify(`Publishing stopped: ${err.message}`, 'error');
      setEmailIssue(err.message);
      if (runRef.current?.logId) {
        setSendResults([...runRef.current.recipients]);
        setCurrentStep('DONE');
      } else {
        setCurrentStep('PREVIEW');
      }
    } finally { sendingRef.current = false; }
  };

  const handleRetryFailed = async () => {
    if (sendingRef.current) return;
    const run = runRef.current;
    if (!run) return;
    sendingRef.current = true;
    const doneIds = new Set(run.recipients.filter((r) => r.status === 'SENT' || r.status === 'MOCK_SENT').map((r) => r.nurseId));
    const retry = nurses.filter((n) => selectedNurseIds.has(n.id) && !doneIds.has(n.id));
    setCurrentStep('SENDING');
    setProgressPercent(0);
    const logs: string[] = [];
    try {
      setEmailIssue('');
      const sendingConfig = await prepareEmail();
      await sendTo(retry, logs, sendingConfig);
      await finishSend(true);
    } catch (err: any) {
      notify(`Sending stopped: ${err.message}`, 'error');
      setEmailIssue(err.message);
      setSendResults([...run.recipients]);
      setCurrentStep('DONE');
    } finally { sendingRef.current = false; }
  };

  const prepareEmail = async () => {
    const config = await loadEmailSettings(repo, true);
    setEmailConfig(config);
    if (selectedNurseIds.size > 0 && !config.mockMode && config.provider !== 'MOCK') {
      setSendLogs(['Checking the email connection before publishing…']);
      const status = await checkEmailReadiness(true);
      if (!status.ready) throw new Error(status.message);
    }
    return config;
  };

  const STEPS: { id: Step; label: string }[] = [
    { id: 'VALIDATION', label: 'Check' },
    { id: 'DETAILS', label: 'Message' },
    { id: 'PREVIEW', label: 'Preview' },
    { id: 'SENDING', label: 'Send' },
    { id: 'DONE', label: 'Done' },
  ];
  const stepIndex = STEPS.findIndex((st) => st.id === currentStep);
  const nextNumber = (schedule.activeVersionNumber || 1) + 1;
  const withEmail = nurses.filter((n) => n.active && n.gmail);
  const noEmail = nurses.filter((n) => n.active && !n.gmail);
  const changedIds = new Set(
    Object.entries(computedDiff?.changesByNurse || {})
      .filter(([, list]) => list.length > 0)
      .map(([id]) => id)
  );
  const toggleNurse = (id: string) =>
    setSelectedNurseIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const nursesWord = (n: number) => `${n} ${n === 1 ? 'nurse' : 'nurses'}`;
  // Not sent: failed, or still waiting because sending stopped.
  const notSent = (r: EmailRecipientLog) => r.status === 'FAILED' || r.status === 'WAITING';
  const failedCount = sendResults.filter(notSent).length;

  const footer = (() => {
    switch (currentStep) {
      case 'VALIDATION':
        return (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              busy={isClinicCheckPending}
              disabled={
                !isOwner ||
                isClinicCheckPending ||
                (validationReport?.errorCount ?? 0) > 0 ||
                ((validationReport?.warnCount ?? 0) > 0 && !acknowledgeWarnings)
              }
              onClick={() => setCurrentStep('DETAILS')}
            >
              {isClinicCheckPending ? 'Checking the roster…' : 'Continue'}
            </Button>
          </>
        );
      case 'DETAILS':
        return (
          <>
            <Button onClick={() => setCurrentStep('VALIDATION')}>Back</Button>
            <Button variant="primary" disabled={!versionNote.trim()} onClick={() => setCurrentStep('PREVIEW')}>
              Preview the emails
            </Button>
          </>
        );
      case 'PREVIEW':
        return (
          <>
            <Button onClick={() => setCurrentStep('DETAILS')}>Back</Button>
            <Button variant="primary" icon={Send} onClick={handlePublishAndSend}>
              {selectedNurseIds.size > 0 ? `Publish and email ${nursesWord(selectedNurseIds.size)}` : 'Publish without emails'}
            </Button>
          </>
        );
      case 'SENDING':
        return (
          <Button variant="primary" busy disabled>
            Sending…
          </Button>
        );
      case 'DONE':
        return (
          <>
            {failedCount > 0 && (
              <Button icon={RotateCcw} onClick={handleRetryFailed}>
                Send the {failedCount} not sent again
              </Button>
            )}
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </>
        );
    }
  })();

  return (
    <Dialog
      open
      onClose={onClose}
      // Closing while emails go out would leave the rest of the nurses without their email.
      closeDisabled={currentStep === 'SENDING'}
      size="lg"
      title={publishKind === 'CHANGE' ? `Publish the changes to ${schedule.name}` : `Publish ${schedule.name}`}
      description={
        <span className="flex flex-wrap items-center gap-2">
          <span>{createdVersion ? `Published as version ${createdVersion.number}.` : `It will be version ${nextNumber}.`}</span>
          <Badge tone={emailConfig.mockMode ? 'warning' : 'neutral'} icon={Mail}>
            {emailConfig.mockMode ? 'Test mode: nothing is emailed' : 'Emails go from the clinic account'}
          </Badge>
        </span>
      }
      footer={footer}
    >
      <div className="space-y-4 text-sm">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm" aria-label="Steps">
          {STEPS.map((st, i) => (
            <li key={st.id} className="flex items-center gap-1" aria-current={i === stepIndex ? 'step' : undefined}>
              {i > 0 && <ChevronRight aria-hidden="true" className="size-4 text-ink-muted" />}
              <span
                className={cx(
                  'flex items-center gap-1.5 rounded-full px-2 py-0.5',
                  i === stepIndex ? 'bg-brand-soft font-semibold text-brand-strong' : i < stepIndex ? 'text-ink' : 'text-ink-muted'
                )}
              >
                {i < stepIndex ? (
                  <Check aria-hidden="true" className="size-4 text-success" />
                ) : (
                  <span aria-hidden="true" className="tabular-nums">
                    {i + 1}.
                  </span>
                )}
                {st.label}
                {i < stepIndex && <span className="sr-only"> (done)</span>}
              </span>
            </li>
          ))}
        </ol>

        {emailIssue && (
          <Notice tone="danger" title="Email needs attention" live>
            <p>{emailIssue}</p>
            <p className="mt-1">Check Settings, Email, then try again.</p>
          </Notice>
        )}

        {!isOwner && (
          <Notice tone="danger" title="You can't publish rosters">
            Only the clinic owner and people who can edit rosters can publish. Ask one of them to publish this roster.
          </Notice>
        )}

        {/* Step 1: the roster check. */}
        {currentStep === 'VALIDATION' && isOwner && validationReport && (
          <div className="space-y-3">
            <p className="text-ink-muted">Before nurses are emailed, the roster is checked against the clinic's rules. Problems that must be fixed stop publishing.</p>
            <dl className="grid grid-cols-3 gap-3">
              <div className={cx('rounded-lg border p-3', validationReport.errorCount > 0 ? 'border-danger-line bg-danger-soft' : 'border-line bg-sunken')}>
                <dt className={validationReport.errorCount > 0 ? 'text-danger' : 'text-ink-muted'}>Must fix</dt>
                <dd className="text-2xl font-semibold text-ink tabular-nums">{validationReport.errorCount}</dd>
              </div>
              <div className={cx('rounded-lg border p-3', validationReport.warnCount > 0 ? 'border-warning-line bg-warning-soft' : 'border-line bg-sunken')}>
                <dt className={validationReport.warnCount > 0 ? 'text-warning' : 'text-ink-muted'}>To check</dt>
                <dd className="text-2xl font-semibold text-ink tabular-nums">{validationReport.warnCount}</dd>
              </div>
              <div className="rounded-lg border border-line bg-sunken p-3">
                <dt className="text-ink-muted">Nurses to email</dt>
                <dd className="text-2xl font-semibold text-ink tabular-nums">{selectedNurseIds.size}</dd>
              </div>
            </dl>

            {validationReport.errorCount > 0 && (
              <Notice
                tone="danger"
                title={`Must fix (${validationReport.errorCount}) before publishing`}
                action={
                  onShowProblems && (
                    <Button
                      size="sm"
                      onClick={() => {
                        onClose();
                        onShowProblems();
                      }}
                    >
                      Show problems
                    </Button>
                  )
                }
              >
                <ul className="list-disc space-y-1 pl-5">
                  {validationReport.findings
                    .filter((f) => f.severity === 'ERROR')
                    .slice(0, 5)
                    .map((f, i) => (
                      <li key={i}>{f.message}</li>
                    ))}
                </ul>
                {validationReport.errorCount > 5 && <p className="mt-1">And {validationReport.errorCount - 5} more.</p>}
              </Notice>
            )}

            {validationReport.errorCount === 0 && validationReport.warnCount > 0 && (
              <Notice tone="warning" title={`To check (${validationReport.warnCount})`}>
                <ul className="list-disc space-y-1 pl-5">
                  {validationReport.findings
                    .filter((f) => f.severity === 'WARN')
                    .slice(0, 4)
                    .map((f, i) => (
                      <li key={i}>{f.message}</li>
                    ))}
                </ul>
                {validationReport.warnCount > 4 && <p className="mt-1">And {validationReport.warnCount - 4} more.</p>}
                <Checkbox
                  className="mt-3"
                  checked={acknowledgeWarnings}
                  onChange={(e) => setAcknowledgeWarnings(e.target.checked)}
                  label={`I have checked ${validationReport.warnCount === 1 ? 'this problem' : `these ${validationReport.warnCount} problems`} and want to publish`}
                />
              </Notice>
            )}

            {validationReport.errorCount === 0 && validationReport.warnCount === 0 && (
              <Notice tone="success" title="No problems found">
                The roster is ready to publish.
              </Notice>
            )}
          </div>
        )}

        {/* Step 2: what to send, the notes and who gets it. */}
        {currentStep === 'DETAILS' && (
          <div className="space-y-4">
            <fieldset className="space-y-2">
              <legend className="font-semibold text-ink">What to send</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { kind: 'PUBLISH' as const, title: 'The whole roster', hint: 'Each nurse gets all their shifts for the period.' },
                  { kind: 'CHANGE' as const, title: 'Changes only', hint: 'Each nurse sees which of their shifts changed since the last published roster.' },
                ].map((o) => (
                  <label
                    key={o.kind}
                    className={cx(
                      'flex cursor-pointer gap-2 rounded-lg border p-3',
                      publishKind === o.kind ? 'border-brand bg-brand-soft' : 'border-line hover:bg-sunken'
                    )}
                  >
                    <input
                      type="radio"
                      name="publishKind"
                      className="mt-0.5 size-4 accent-brand"
                      checked={publishKind === o.kind}
                      onChange={() => setPublishKind(o.kind)}
                    />
                    <span>
                      <span className="block font-semibold text-ink">{o.title}</span>
                      <span className="block text-ink-muted">{o.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Field label="Note for this version" hint="Kept with this version in History.">
              {(f) => (
                <Input
                  {...f}
                  required
                  placeholder="For example: November roster, agreed with the clinic lead"
                  value={versionNote}
                  onChange={(e) => setVersionNote(e.target.value)}
                />
              )}
            </Field>

            <Field label="Message to all nurses" optional>
              {(f) => (
                <Textarea
                  {...f}
                  rows={2}
                  placeholder="For example: Thursday clinics start at 15:00 this month. Ask the planner about swaps."
                  value={generalBroadcastNote}
                  onChange={(e) => setGeneralBroadcastNote(e.target.value)}
                />
              )}
            </Field>

            <Checkbox
              checked={includeLink}
              onChange={(e) => setIncludeLink(e.target.checked)}
              label="Include a link to view the roster online"
              hint={
                hasPublicLink
                  ? "Uses the roster's share link. Anyone who has the link can open it."
                  : 'Makes a share link for this roster. Anyone who has the link can open it; you can remove it later in Share links.'
              }
            />

            <fieldset className="space-y-2">
              <legend className="font-semibold text-ink">
                Send to {selectedNurseIds.size} of {nursesWord(withEmail.length)}
              </legend>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => setSelectedNurseIds(new Set(withEmail.map((n) => n.id)))}>
                  All
                </Button>
                {computedDiff && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedNurseIds(new Set(withEmail.filter((n) => changedIds.has(n.id)).map((n) => n.id)))}
                  >
                    Only nurses with changes ({withEmail.filter((n) => changedIds.has(n.id)).length})
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setSelectedNurseIds(new Set())}>
                  None
                </Button>
              </div>
              <ul className="max-h-48 divide-y divide-line overflow-y-auto rounded-lg border border-line" aria-label="Nurses to email">
                {withEmail.map((n) => (
                  <li key={n.id} className="flex items-center gap-2 px-3 py-1.5">
                    <Checkbox
                      checked={selectedNurseIds.has(n.id)}
                      onChange={() => toggleNurse(n.id)}
                      label={
                        <span>
                          {n.fullName} <span className="text-ink-muted">{n.gmail}</span>
                        </span>
                      }
                    />
                    {changedIds.has(n.id) && (
                      <Badge tone="warning" className="ml-auto">
                        Changed
                      </Badge>
                    )}
                  </li>
                ))}
                {noEmail.map((n) => (
                  <li key={n.id} className="flex items-center gap-2 bg-sunken px-3 py-1.5 text-ink-muted">
                    <span>{n.fullName}</span>
                    <Badge tone="warning" className="ml-auto">
                      No email address
                    </Badge>
                  </li>
                ))}
              </ul>
              {noEmail.length > 0 && (
                <p id={noEmailId} className="text-warning">
                  {noEmail.length === 1 ? '1 nurse has' : `${noEmail.length} nurses have`} no email address and won't be emailed. Add it in Nurses.
                </p>
              )}
            </fieldset>
          </div>
        )}

        {/* Step 3: each nurse's email as they will get it. */}
        {currentStep === 'PREVIEW' && (
          <div className="space-y-3">
            {testModeBanner}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <Field label="Preview the email for" className="w-full sm:w-80">
                {(f) => (
                  <Select {...f} value={previewNurseId} onChange={(e) => setPreviewNurseId(e.target.value)}>
                    {withEmail.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.fullName} ({n.gmail})
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <p className="text-ink-muted">
                {nursesWord(selectedNurseIds.size)} {emailConfig.mockMode ? 'would be emailed (test mode)' : 'will be emailed'}
              </p>
            </div>
            {previewPayload && (
              <div className="overflow-hidden rounded-lg border border-line">
                <p className="truncate border-b border-line bg-sunken px-3 py-2">
                  Subject: <strong>{previewPayload.subject}</strong>
                </p>
                <EmailHtmlPreview html={previewPayload.html} className="h-80" />
              </div>
            )}
          </div>
        )}

        {/* Step 4: sending. */}
        {currentStep === 'SENDING' && (
          <div className="space-y-3">
            {testModeBanner}
            <div className="flex items-center justify-between font-semibold text-ink">
              <span>{emailConfig.mockMode ? 'Pretending to send the emails' : 'Sending the emails'}…</span>
              <span className="tabular-nums">{progressPercent}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-label="Emails sent"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <div className="h-full bg-brand transition-all duration-150" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-ink-muted">Keep this window open until sending finishes.</p>
            <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-line p-3" aria-live="polite" aria-label="Sending">
              {sendLogs.map((log, i) => {
                const mark = log.charAt(0);
                const text = /^[✓✗⚠] /.test(log) ? log.slice(2) : log;
                return (
                  <li key={i} className={cx('flex items-start gap-1.5', mark === '✗' ? 'text-danger' : mark === '⚠' ? 'text-warning' : 'text-ink')}>
                    {mark === '✓' && <Check aria-label="Sent:" className="mt-0.5 size-4 shrink-0 text-success" />}
                    {mark === '✗' && <XCircle aria-label="Not sent:" className="mt-0.5 size-4 shrink-0" />}
                    {mark === '⚠' && <AlertTriangle aria-label="Note:" className="mt-0.5 size-4 shrink-0" />}
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Step 5: done. */}
        {currentStep === 'DONE' &&
          createdVersion &&
          (() => {
            const failed = sendResults.filter(notSent);
            const sent = sendResults.length - failed.length;
            const testMode = sendResults.length > 0 && sendResults.every((r) => r.status === 'MOCK_SENT' || notSent(r)) && sent > 0;
            const emails = (n: number) => `${n} ${n === 1 ? 'email' : 'emails'}`;
            return (
              <div className="space-y-3">
                <Notice
                  tone={failed.length === 0 ? 'success' : 'warning'}
                  live
                  title={
                    failed.length === 0
                      ? testMode
                        ? `Published version ${createdVersion.number} (test mode: ${emails(sent)} not really sent)`
                        : `Published version ${createdVersion.number} and emailed ${nursesWord(sent)}`
                      : `Published version ${createdVersion.number}: ${emails(failed.length)} not sent`
                  }
                >
                  Nurses can confirm they have seen it. Their replies show on Sent rosters.
                </Notice>
                {failed.length > 0 && (
                  <Notice tone="danger" title="Not sent">
                    <ul className="list-disc space-y-0.5 pl-5">
                      {failed.map((r) => (
                        <li key={r.nurseId}>
                          {r.nurseName} ({r.email || 'no email'}): {r.status === 'WAITING' ? 'not sent yet' : r.errorMessage || 'unknown error'}
                        </li>
                      ))}
                    </ul>
                  </Notice>
                )}
                {publishWarnings.length > 0 && (
                  <Notice tone="warning" title="Also note">
                    {publishWarnings.map((w, i) => (
                      <p key={i}>{w}</p>
                    ))}
                  </Notice>
                )}
              </div>
            );
          })()}
      </div>
    </Dialog>
  );
};
