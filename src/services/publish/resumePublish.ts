/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Resume a stopped publish (Phase 7, slice 7). Before sending, the email log lists every nurse to
 * email as Waiting, each with the receipt token made in advance, and it is updated after each
 * email. A publish that stops partway (the tab closed, the computer slept) leaves the rest
 * Waiting. Later, the roster screen and Sent rosters offer Resume: it emails only the nurses
 * still waiting or not sent, from the same version (no new version), with the same confirm
 * links, and then writes the audit entry the stopped publish never wrote.
 */

import { IRepository } from '../repository/IRepository';
import { EmailLogStatus, EmailRecipientLog, Nurse, PublishLog, ScheduleVersion } from '../../types';
import { EmailSettingsConfig } from '../../types/settings';
import { RosterPublishService } from './rosterPublishService';
import { recipientsForLog } from './emailLogSize';
import { nurseLinkUrl } from './nurseRosterService';
import { computeScheduleDiff } from '../history/diffEngine';
import { loadClinicSetup } from '../engine/clinicSetupService';

/** With no news from a send for this long, it has stopped (each email takes a few seconds). */
export const STOPPED_AFTER_MS = 3 * 60 * 1000;

const lastNews = (log: PublishLog) => Date.parse(log.updatedAt || log.sentAt);
const isDone = (r: EmailRecipientLog) => r.status === 'SENT' || r.status === 'MOCK_SENT';

/** A send that can be resumed: a publish still marked as sending, with its list of nurses made before sending. */
export function isResumable(log: PublishLog): boolean {
  return (
    (log.kind === 'PUBLISH' || log.kind === 'CHANGE') &&
    log.status === 'SENDING' &&
    log.recipients.length > 0 &&
    log.recipients.every((r) => !!r.ackToken) &&
    log.recipients.some((r) => !isDone(r))
  );
}

/** The newest send of the roster that stopped partway, or null. */
export function findStoppedPublish(logs: PublishLog[], scheduleId: string, now: number): PublishLog | null {
  return (
    logs
      .filter((l) => l.scheduleId === scheduleId && isResumable(l) && now - lastNews(l) > STOPPED_AFTER_MS)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0] || null
  );
}

export function stoppedWords(log: PublishLog): string {
  const done = log.recipients.filter(isDone).length;
  return `Sending stopped after ${done} of ${log.recipients.length} ${log.recipients.length === 1 ? 'nurse' : 'nurses'}`;
}

export interface ResumePlan {
  /** The nurses to email now, each with the token made before the publish stopped. */
  send: { nurse: Nurse; ackToken: string }[];
  /** Already emailed (or in test mode). */
  done: number;
  total: number;
  /** Still waiting but not emailed now, with the reason. */
  skipped: { nurseId: string; nurseName: string; reason: string }[];
}

export function planResume(log: PublishLog, nurses: Nurse[]): ResumePlan {
  const byId = new Map(nurses.map((n) => [n.id, n]));
  const plan: ResumePlan = { send: [], done: 0, total: log.recipients.length, skipped: [] };
  for (const r of log.recipients) {
    if (isDone(r)) {
      plan.done++;
      continue;
    }
    const nurse = byId.get(r.nurseId);
    const reason = !nurse ? 'no longer listed' : !nurse.active ? 'no longer active' : !nurse.gmail ? 'no email address' : '';
    if (reason) plan.skipped.push({ nurseId: r.nurseId, nurseName: r.nurseName, reason });
    else plan.send.push({ nurse: nurse!, ackToken: r.ackToken! });
  }
  return plan;
}

/** The overall result of a send, from each nurse's result. */
export function overallSendStatus(list: EmailRecipientLog[], mockMode: boolean): EmailLogStatus {
  if (list.length === 0) return mockMode ? 'MOCK_SENT' : 'SENT';
  const failed = list.filter((r) => r.status === 'FAILED' || r.status === 'WAITING').length;
  if (failed === list.length) return 'FAILED';
  if (failed > 0) return 'PARTIAL';
  return list.every((r) => r.status === 'MOCK_SENT') ? 'MOCK_SENT' : 'SENT';
}

export interface ResumeOptions {
  actor: string;
  clinicName: string;
  /** The clinic's email settings, checked by the caller (as for a publish). */
  emailConfig: EmailSettingsConfig;
  onProgress?: (done: number, total: number) => void;
}

export interface ResumeResult {
  sent: number;
  failed: number;
  skipped: ResumePlan['skipped'];
  versionNumber: number;
}

export async function runResume(repo: IRepository, logId: string, opts: ResumeOptions): Promise<ResumeResult> {
  const log = await repo.get('emailLog', logId);
  if (!log) throw new Error('This send is no longer in Sent rosters.');
  if (!isResumable(log)) throw new Error('This send has already finished or was resumed.');
  // Claim it at once, so another screen sees it running and does not offer Resume too.
  await repo.update('emailLog', log.id, { updatedAt: new Date().toISOString() });

  const [schedule, version, nurses, dutyWindows, doctors, roles, specialties, leaveTypes, periods, links, versions] = await Promise.all([
    repo.get('schedules', log.scheduleId),
    repo.get('versions', log.versionId),
    repo.list('nurses'),
    repo.list('dutyWindows'),
    repo.list('doctors'),
    repo.list('clinicalRoles'),
    repo.list('specialties'),
    repo.list('leaveTypes'),
    repo.list('workingHoursPeriods'),
    repo.list('nurseLinks').catch(() => []),
    repo.list('versions', { field: 'scheduleId', operator: '==', value: log.scheduleId }),
  ]);
  if (!schedule) throw new Error('The roster of this send has been deleted, so it cannot be resumed.');
  if (!version) throw new Error('The version of this send is no longer kept, so it cannot be resumed.');

  // Changes only: the same changes as the stopped publish, from the published version before this one.
  let changesByNurse: Record<string, any[]> = {};
  if (log.kind === 'CHANGE') {
    const before = (versions as ScheduleVersion[])
      .filter((v) => v.isPublished && v.kind !== 'BACKUP' && v.number < version.number)
      .sort((a, b) => b.number - a.number)[0];
    if (before) {
      changesByNurse = computeScheduleDiff(before.snapshot.assignments, version.snapshot.assignments, nurses, dutyWindows, doctors, roles, specialties)
        .changesByNurse;
    }
  }
  let hoursHistory;
  try {
    hoursHistory = (await loadClinicSetup(repo, schedule)).hoursHistory;
  } catch {
    hoursHistory = undefined;
  }
  const tokens = new Map(links.filter((l) => !l.revoked).map((l) => [l.nurseId || l.id, l.token]));

  const plan = planResume(log, nurses);
  let recipients = [...log.recipients];
  let sent = 0;
  let failed = 0;
  for (const { nurse, ackToken } of plan.send) {
    let result: EmailRecipientLog;
    try {
      const email = RosterPublishService.generatePersonalEmailHtml({
        clinicName: opts.clinicName,
        schedule,
        version,
        nurse,
        assignments: version.snapshot.assignments,
        dutyWindows,
        doctors,
        roles,
        specialties,
        leaveEntries: version.snapshot.leaveEntries || [],
        leaveTypes,
        changes: changesByNurse[nurse.id] || [],
        generalNote: log.message,
        shareToken: log.shareToken,
        privateRosterUrl: tokens.get(nurse.id) ? nurseLinkUrl(tokens.get(nurse.id)!) : undefined,
        ackToken,
        isChangeAlert: log.kind === 'CHANGE',
        workingHoursPeriods: periods,
        hoursHistory,
      });
      const dispatched = await RosterPublishService.dispatchEmail(
        opts.emailConfig, nurse.gmail, nurse, email.subject, email.bodyPreview, email.html, schedule.id, version.id, ackToken
      );
      result = { ...dispatched.recipientLog, ackToken };
      // A read receipt only for a nurse really emailed; if it can't be saved the email still went.
      if (result.status === 'SENT') await repo.create('acknowledgments', dispatched.acknowledgment).catch(() => {});
    } catch (err: any) {
      result = { email: nurse.gmail, nurseId: nurse.id, nurseName: nurse.fullName, subject: '', bodyPreview: '', fullBodyHtml: '', status: 'FAILED', errorMessage: err?.message || String(err), ackToken };
    }
    if (result.status === 'FAILED') failed++;
    else sent++;
    recipients = recipients.map((r) => (r.nurseId === nurse.id ? result : r));
    await repo
      .update('emailLog', log.id, { recipients: recipientsForLog(recipients), updatedAt: new Date().toISOString() })
      .catch(() => {});
    opts.onProgress?.(sent + failed, plan.send.length);
  }
  // Nurses who can't be emailed now are recorded as not sent, with the reason.
  recipients = recipients.map((r) => {
    const skip = plan.skipped.find((s) => s.nurseId === r.nurseId);
    return skip ? { ...r, status: 'FAILED' as const, errorMessage: `${skip.reason[0].toUpperCase()}${skip.reason.slice(1)}.` } : r;
  });
  const status = overallSendStatus(recipients, opts.emailConfig.mockMode);
  await repo.update('emailLog', log.id, { recipients: recipientsForLog(recipients), status, updatedAt: new Date().toISOString() });

  const emailed = recipients.filter((r) => r.status === 'SENT').length;
  const test = recipients.filter((r) => r.status === 'MOCK_SENT').length;
  const notSent = recipients.filter((r) => r.status === 'FAILED').length;
  await repo
    .create('audit', {
      scheduleId: schedule.id,
      actor: opts.actor,
      action: 'PUBLISH',
      entity: 'Schedule',
      entityId: schedule.id,
      note: `Resumed sending of version ${version.number} (${log.kind === 'CHANGE' ? 'changes only' : 'the whole roster'}): ${emailed} emailed, ${test} in test mode, ${notSent} not sent.`,
      timestamp: new Date().toISOString(),
    })
    .catch(() => {});
  return { sent, failed: failed + plan.skipped.length, skipped: plan.skipped, versionNumber: version.number };
}
