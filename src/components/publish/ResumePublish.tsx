/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Sending stopped after 12 of 40 nurses", with Resume (Phase 7, slice 7). Shown on the roster
 * screen and on Sent rosters, for planners, when the roster's newest publish stopped partway
 * (resumePublish.ts). Resume emails only the nurses still waiting or not sent, from the same
 * version, and then writes the audit entry.
 */

import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { PublishLog } from '../../types';
import { getRepository } from '../../services/repository';
import { findStoppedPublish, planResume, runResume, stoppedWords, type ResumePlan, type ResumeResult } from '../../services/publish/resumePublish';
import { loadEmailSettings } from '../../services/settings/emailSettingsStore';
import { checkEmailReadiness } from '../../services/email/emailReadiness';
import { formatDateTime } from '../../utils/dateUtils';
import { notify } from '../common/dialogs';
import { Button, Dialog, Notice } from '../ui';

export const ResumePublish: React.FC<{
  scheduleId: string | null | undefined;
  scheduleName: string;
  clinicName: string;
  actor: string;
  /** After a resume, so the screen can read its data again. */
  onResumed?: () => void;
}> = ({ scheduleId, scheduleName, clinicName, actor, onResumed }) => {
  const repo = getRepository();
  const [stopped, setStopped] = useState<PublishLog | null>(null);
  const [plan, setPlan] = useState<ResumePlan | null>(null);
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [error, setError] = useState('');
  const [versionNumber, setVersionNumber] = useState<number | null>(null);

  const look = async () => {
    if (!scheduleId) {
      setStopped(null);
      return;
    }
    try {
      const logs = await repo.list('emailLog', { field: 'scheduleId', operator: '==', value: scheduleId });
      const found = findStoppedPublish(logs, scheduleId, Date.now());
      setStopped(found);
      if (found) {
        const [nurses, version] = await Promise.all([repo.list('nurses'), repo.get('versions', found.versionId)]);
        setPlan(planResume(found, nurses));
        setVersionNumber(version?.number ?? null);
      }
    } catch {
      // Not knowing about a stopped send must never stop the screen.
      setStopped(null);
    }
  };

  useEffect(() => {
    look();
  }, [scheduleId]);

  if (!stopped || !plan) return null;

  const waitingWords = `${plan.total - plan.done} ${plan.total - plan.done === 1 ? 'nurse has' : 'nurses have'} not been sent`;

  const handleResume = async () => {
    setRunning(true);
    setError('');
    setProgress({ done: 0, total: plan.send.length });
    try {
      const emailConfig = await loadEmailSettings(repo, true);
      if (plan.send.length > 0 && !emailConfig.mockMode && emailConfig.provider !== 'MOCK') {
        const status = await checkEmailReadiness(true);
        if (!status.ready) throw new Error(status.message);
      }
      const r = await runResume(repo, stopped.id, {
        actor,
        clinicName,
        emailConfig,
        onProgress: (done, total) => setProgress({ done, total }),
      });
      setResult(r);
      onResumed?.();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setRunning(false);
    }
  };

  const close = () => {
    setOpen(false);
    if (result) {
      notify(`Sending of version ${result.versionNumber} finished: ${result.sent} sent${result.failed ? `, ${result.failed} not sent` : ''}.`, result.failed ? 'warning' : 'success');
      setResult(null);
      look();
    }
  };

  return (
    <>
      <Notice
        tone="warning"
        title={`${stoppedWords(stopped)} (${scheduleName})`}
        action={
          <Button size="sm" variant="primary" icon={Send} onClick={() => setOpen(true)}>
            Resume sending
          </Button>
        }
      >
        {versionNumber ? `Version ${versionNumber}` : 'The roster'} was published on {formatDateTime(stopped.sentAt)}, but {waitingWords}, probably
        because the page was closed while the emails were going out.
      </Notice>

      <Dialog
        open={open}
        onClose={close}
        closeDisabled={running}
        title="Resume sending?"
        description={`${scheduleName}${versionNumber ? `, version ${versionNumber}` : ''}. No new version is made: the nurses get the same email as the others.`}
        footer={
          result ? (
            <Button variant="primary" onClick={close}>
              Done
            </Button>
          ) : (
            <>
              <Button disabled={running} onClick={close}>
                Cancel
              </Button>
              <Button variant="primary" icon={Send} busy={running} disabled={plan.send.length === 0} onClick={handleResume}>
                {plan.send.length > 0 ? `Email ${plan.send.length === 1 ? '1 nurse' : `${plan.send.length} nurses`}` : 'Nobody to email'}
              </Button>
            </>
          )
        }
      >
        <div className="space-y-3 text-sm">
          {!result && (
            <p>
              {plan.done} of {plan.total} {plan.total === 1 ? 'nurse' : 'nurses'} {plan.done === 1 ? 'was' : 'were'} emailed before sending stopped.{' '}
              {plan.send.length > 0
                ? `${plan.send.length === 1 ? 'This nurse is' : `These ${plan.send.length} nurses are`} emailed now: ${plan.send.map((s) => s.nurse.fullName).join(', ')}.`
                : ''}
            </p>
          )}
          {plan.skipped.length > 0 && !result && (
            <Notice tone="warning" title="Not sent">
              <ul className="list-disc space-y-0.5 pl-5">
                {plan.skipped.map((s) => (
                  <li key={s.nurseId}>
                    {s.nurseName}: {s.reason}
                  </li>
                ))}
              </ul>
            </Notice>
          )}
          {running && (
            <>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-line"
                role="progressbar"
                aria-label="Emails sent"
                aria-valuemin={0}
                aria-valuemax={progress.total || 1}
                aria-valuenow={progress.done}
              >
                <div className="h-full bg-brand transition-all duration-150" style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} />
              </div>
              <p className="text-ink-muted">
                {progress.done} of {progress.total} sent. Keep this page open until sending finishes.
              </p>
            </>
          )}
          {error && (
            <Notice tone="danger" title="Sending stopped again" live>
              {error} Check Settings, Email, then try again.
            </Notice>
          )}
          {result && (
            <Notice tone={result.failed ? 'warning' : 'success'} title={`Sending of version ${result.versionNumber} finished`} live>
              {result.sent} sent{result.failed ? `, ${result.failed} not sent (see Sent rosters, then Emails sent)` : ''}.
            </Notice>
          )}
        </div>
      </Dialog>
    </>
  );
};
