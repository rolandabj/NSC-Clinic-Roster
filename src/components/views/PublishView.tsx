/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Sent rosters (#publish): what was sent for the open roster and what came back. Read replies
 * (who confirmed they have seen it, with reminders), the emails sent (25 sends at a time, newest
 * first) and the nurses' private links. Publishing itself happens only on the roster screen
 * (Phase 7, slice 6b: one publish flow).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Copy, Download, Eye, Mail, RefreshCw, Send } from 'lucide-react';
import { ClinicContextState } from '../../types/navigation';
import { escapeHtml } from '../../utils/escapeHtml';
import { getRepository } from '../../services/repository';
import { listPage } from '../../services/repository/paging';
import { Schedule, ScheduleVersion, NurseLink, Nurse, PublishLog, Acknowledgment, ShareLink, EmailLogKind } from '../../types';
import { RosterPublishService } from '../../services/publish/rosterPublishService';
import { ensurePublicRosters } from '../../services/publish/publicRosterService';
import { ensureNurseLink, regenerateNurseLink, syncNurseRosters, nurseLinkUrl } from '../../services/publish/nurseRosterService';
import { emailKindLabel, sendResult } from '../../services/publish/sentRosters';
import { ResumePublish } from '../publish/ResumePublish';
import { canEditClinicData } from '../../services/auth/access';
import { authService } from '../../services/auth/authService';
import { toCsv, downloadCsv, CsvValue } from '../../utils/csv';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { notify, confirmDialog } from '../common/dialogs';
import { EmailHtmlPreview } from '../common/EmailHtmlPreview';
import { loadEmailSettings } from '../../services/settings/emailSettingsStore';
import { withoutBackups } from '../../services/history/versionList';
import {
  Badge,
  Button,
  Card,
  DataTable,
  Dialog,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  Notice,
  PageHeader,
  Select,
  TabPanel,
  Tabs,
  type Column,
} from '../ui';

interface PublishViewProps {
  context: ClinicContextState;
}

type SentTab = 'replies' | 'emails' | 'links';

/** How many sends the email log shows at a time. */
export const SENDS_PER_PAGE = 25;

export const PublishView: React.FC<PublishViewProps> = ({ context }) => {
  const canEdit = canEditClinicData(authService.getCurrentUser());
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [activeTab, setActiveTab] = useState<SentTab>('replies');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [versions, setVersions] = useState<ScheduleVersion[]>([]);
  const [acknowledgments, setAcknowledgments] = useState<Acknowledgment[]>([]);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  // Each nurse's private link (nurse id to link); editors only.
  const [nurseLinks, setNurseLinks] = useState<Map<string, NurseLink>>(new Map());
  const [busyLinkNurseId, setBusyLinkNurseId] = useState<string | null>(null);

  // The email log, one page of sends at a time (newest first).
  const [sends, setSends] = useState<PublishLog[]>([]);
  const [sendsCursor, setSendsCursor] = useState<unknown>(undefined);
  const [moreSends, setMoreSends] = useState(false);
  const [isLoadingSends, setIsLoadingSends] = useState(false);
  const [kindFilter, setKindFilter] = useState<'ALL' | EmailLogKind>('ALL');
  const [openSend, setOpenSend] = useState<PublishLog | null>(null);
  const [viewingEmail, setViewingEmail] = useState<{ subject: string; recipientName: string; recipientEmail: string; html: string } | null>(null);

  const repo = getRepository();

  const loadSends = async (from?: unknown) => {
    setIsLoadingSends(true);
    try {
      const page = await listPage(repo, 'emailLog', { orderBy: 'sentAt', direction: 'desc', limit: SENDS_PER_PAGE, cursor: from });
      setSends((prev) => (from === undefined ? page.items : [...prev, ...page.items]));
      setSendsCursor(page.cursor);
      setMoreSends(page.hasMore);
    } catch (err: any) {
      notify(`The emails sent could not be loaded: ${err?.message || err}`, 'error');
    } finally {
      setIsLoadingSends(false);
    }
  };

  const loadData = async () => {
    try {
      const [schedList, nList, vList, ackList, linkList] = await Promise.all([
        repo.list('schedules'),
        repo.list('nurses'),
        repo.list('versions').then(withoutBackups),
        repo.list('acknowledgments'),
        repo.list('shareLinks'),
      ]);
      const uniqueSchedules = Array.from(new Map(schedList.map((s) => [s.id, s])).values());
      setSchedules(uniqueSchedules);
      setNurses(nList.filter((n) => n.active));
      setVersions(vList);
      setAcknowledgments(ackList);
      setShareLinks(linkList);
      setActiveSchedule(uniqueSchedules.find((s) => s.id === context.activeScheduleId) || uniqueSchedules[0] || null);
      if (canEdit) {
        // Links made before public snapshots existed get one now.
        void ensurePublicRosters(linkList);
        repo
          .list('nurseLinks')
          .then((list) => setNurseLinks(new Map(list.filter((l) => !l.revoked).map((l) => [l.nurseId || l.id, l]))))
          .catch((err) => console.warn('Could not load private nurse links:', err));
      }
      setLoadState('ready');
    } catch (err) {
      console.error('Error loading Sent rosters:', err);
      setLoadState('failed');
    }
  };

  useEffect(() => {
    loadData();
    // The email log is for planners (firestore.rules); only planners reach this screen today.
    if (canEdit) loadSends();
  }, []);

  const scheduleName = (id: string) => schedules.find((s) => s.id === id)?.name || 'A deleted roster';
  const versionNumber = (id: string) => versions.find((v) => v.id === id)?.number;

  // --- READ REPLIES ---
  const latestAck = (nurseId: string) => {
    if (!activeSchedule) return null;
    const acks = acknowledgments
      .filter((a) => a.scheduleId === activeSchedule.id && a.nurseId === nurseId)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
    return acks[0] || null;
  };
  const sentCount = nurses.filter((n) => latestAck(n.id)).length;
  const seenCount = nurses.filter((n) => latestAck(n.id)?.ackAt).length;
  const waiting = nurses.filter((n) => {
    const ack = latestAck(n.id);
    return ack && !ack.ackAt;
  });

  /**
   * Sends a reminder for the nurse's latest roster not yet confirmed, with the same confirm link
   * as the first email, so the same token records the reply. Returns the delivery status.
   */
  const sendReminder = async (nurse: Nurse): Promise<string> => {
    if (!activeSchedule) throw new Error('No roster is open.');
    const ack = latestAck(nurse.id);
    if (!ack) throw new Error(`${nurse.fullName} has not been sent this roster yet. Publish it first.`);
    if (ack.ackAt) return 'ALREADY_ACKNOWLEDGED';
    const version = versions.find((v) => v.id === ack.versionId);
    const link = shareLinks.find((l) => l.scheduleId === activeSchedule.id && !l.revoked && l.public);
    const email = RosterPublishService.generateReminderEmailHtml({
      clinicName: context.clinicName,
      scheduleName: activeSchedule.name,
      versionNumber: version?.number,
      nurse,
      ackToken: ack.token,
      shareToken: link?.token,
      privateRosterUrl: nurseLinks.get(nurse.id) ? nurseLinkUrl(nurseLinks.get(nurse.id)!.token) : undefined,
    });
    const { recipientLog } = await RosterPublishService.dispatchEmail(
      await loadEmailSettings(repo, true),
      nurse.gmail,
      nurse,
      email.subject,
      email.bodyPreview,
      email.html,
      activeSchedule.id,
      ack.versionId,
      ack.token
    );
    const nowIso = new Date().toISOString();
    await repo.update('acknowledgments', ack.id, { lastReminderSentAt: nowIso, reminderCount: (ack.reminderCount || 0) + 1 });
    await repo.create('emailLog', {
      id: `remind-${crypto.randomUUID()}`,
      scheduleId: activeSchedule.id,
      versionId: ack.versionId,
      kind: 'REMINDER',
      recipients: [recipientLog],
      status: recipientLog.status === 'SENT' ? 'SENT' : recipientLog.status === 'MOCK_SENT' ? 'MOCK_SENT' : 'FAILED',
      sentAt: nowIso,
    });
    if (recipientLog.status === 'FAILED') throw new Error(recipientLog.errorMessage || 'The email could not be sent.');
    return recipientLog.status;
  };

  const refreshAfterReminders = () => {
    loadData();
    if (canEdit) loadSends();
  };

  const handleSendReminder = async (nurse: Nurse) => {
    try {
      const status = await sendReminder(nurse);
      notify(
        status === 'MOCK_SENT'
          ? `Reminder for ${nurse.fullName} recorded (test mode, nothing emailed).`
          : `Reminder sent to ${nurse.fullName} (${nurse.gmail}).`,
        'success'
      );
    } catch (err: any) {
      notify(`The reminder could not be sent: ${err.message}`, 'error');
    }
    refreshAfterReminders();
  };

  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const handleRemindAll = async () => {
    if (waiting.length === 0) return;
    const ok = await confirmDialog({
      title: 'Send reminders?',
      message: `Send a reminder to the ${waiting.length === 1 ? 'nurse who has' : `${waiting.length} nurses who have`} not confirmed they have seen the roster?`,
      confirmLabel: 'Send reminders',
    });
    if (!ok) return;
    setIsSendingReminders(true);
    const failures: string[] = [];
    for (const nurse of waiting) {
      try {
        await sendReminder(nurse);
      } catch (err: any) {
        failures.push(`${nurse.fullName}: ${err.message}`);
      }
    }
    setIsSendingReminders(false);
    refreshAfterReminders();
    if (failures.length > 0) {
      notify(`${waiting.length - failures.length} reminders sent, ${failures.length} not sent:\n\n${failures.join('\n')}`, 'warning');
    } else {
      notify(`Reminders sent to ${waiting.length === 1 ? '1 nurse' : `${waiting.length} nurses`}.`, 'success');
    }
  };

  const handleDownloadReplies = () => {
    if (!activeSchedule) return;
    const rows: CsvValue[][] = [['Nurse', 'Code', 'Email', 'Version', 'Sent', 'Seen']];
    nurses.forEach((nurse) => {
      const ack = latestAck(nurse.id);
      rows.push([
        nurse.fullName,
        nurse.employeeCode,
        nurse.gmail,
        ack ? versionNumber(ack.versionId) ?? '' : '',
        ack ? formatDateTime(ack.sentAt) : 'Not sent',
        ack?.ackAt ? formatDateTime(ack.ackAt) : ack ? 'Waiting' : '',
      ]);
    });
    downloadCsv(`${activeSchedule.name} read replies.csv`, toCsv(rows));
  };

  // --- PRIVATE LINKS ---
  const rememberLink = (link: NurseLink) => setNurseLinks((prev) => new Map(prev).set(link.nurseId, link));
  const copyText = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(done, 'success');
    } catch {
      notify("The link couldn't be copied. Select it and copy it instead.", 'warning');
    }
  };

  /** Copies the nurse's private link, making it first when they have none yet. */
  const handleCopyPrivateLink = async (nurse: Nurse) => {
    setBusyLinkNurseId(nurse.id);
    try {
      let link = nurseLinks.get(nurse.id);
      if (!link) {
        link = await ensureNurseLink(repo, nurse.id);
        rememberLink(link);
        const result = await syncNurseRosters(repo, [nurse.id]);
        if (result.failed.length > 0) notify(`The link was made, but ${nurse.fullName}'s page couldn't be updated: ${result.failed[0]}`, 'warning');
      }
      await copyText(nurseLinkUrl(link.token), `Private link for ${nurse.fullName} copied.`);
    } catch (err: any) {
      notify(`The private link couldn't be made: ${err?.message || err}`, 'error');
    } finally {
      setBusyLinkNurseId(null);
    }
  };

  const handleRegeneratePrivateLink = async (nurse: Nurse) => {
    const ok = await confirmDialog({
      title: `Make a new link for ${nurse.fullName}?`,
      message: 'The old link stops working. Send them the new one.',
      confirmLabel: 'Make a new link',
      danger: true,
    });
    if (!ok) return;
    setBusyLinkNurseId(nurse.id);
    try {
      const { link, syncError } = await regenerateNurseLink(repo, nurse.id);
      rememberLink(link);
      await copyText(nurseLinkUrl(link.token), `New private link for ${nurse.fullName} copied. The old link no longer works.`);
      if (syncError) notify(`The new link was made, but ${nurse.fullName}'s page couldn't be updated: ${syncError}`, 'warning');
    } catch (err: any) {
      notify(`A new link couldn't be made: ${err?.message || err}`, 'error');
    } finally {
      setBusyLinkNurseId(null);
    }
  };

  const [isRefreshingPages, setIsRefreshingPages] = useState(false);
  const handleRefreshPrivatePages = async () => {
    setIsRefreshingPages(true);
    try {
      const result = await syncNurseRosters(repo);
      if (result.failed.length > 0) notify(`${result.synced} pages updated, ${result.failed.length} not updated:\n\n${result.failed.join('\n')}`, 'warning');
      else notify(`${result.synced === 1 ? '1 private page' : `${result.synced} private pages`} updated.`, 'success');
    } catch (err: any) {
      notify(`The private pages couldn't be updated: ${err?.message || err}`, 'error');
    } finally {
      setIsRefreshingPages(false);
    }
  };

  /** What View email shows for an email whose text the log did not keep (see emailLogSize.ts). */
  const notKeptHtml = (summary: string) =>
    '<div style="font-family:sans-serif;font-size:14px;line-height:1.5;color:#1e293b">' +
    '<p>This email was sent. Its full text was not kept, to keep the record small.</p>' +
    `<p><strong>Summary:</strong> ${escapeHtml(summary || 'none')}</p></div>`;

  const shownSends = useMemo(() => sends.filter((s) => kindFilter === 'ALL' || s.kind === kindFilter), [sends, kindFilter]);

  const replyColumns: Column<Nurse>[] = [
    {
      key: 'nurse',
      header: 'Nurse',
      cell: (n) => (
        <span>
          <span className="block font-medium text-ink">{n.fullName}</span>
          <span className="block text-xs text-ink-muted">{n.gmail || 'No email address'}</span>
        </span>
      ),
      sortValue: (n) => n.fullName,
      phone: 'title',
    },
    {
      key: 'version',
      header: 'Version',
      cell: (n) => {
        const ack = latestAck(n.id);
        const num = ack ? versionNumber(ack.versionId) : undefined;
        return ack ? (num ? `Version ${num}` : 'A version no longer kept') : <span className="text-ink-muted">Not sent</span>;
      },
    },
    { key: 'sent', header: 'Sent', cell: (n) => (latestAck(n.id) ? formatDateTime(latestAck(n.id)!.sentAt) : ''), sortValue: (n) => latestAck(n.id)?.sentAt || '' },
    {
      key: 'reply',
      header: 'Reply',
      cell: (n) => {
        const ack = latestAck(n.id);
        if (!ack) return <span className="text-ink-muted">Not sent yet</span>;
        if (ack.ackAt) return <Badge tone="success">Seen on {formatDate(ack.ackAt)}</Badge>;
        return (
          <Badge tone="warning">
            Waiting{ack.reminderCount ? `, ${ack.reminderCount === 1 ? '1 reminder' : `${ack.reminderCount} reminders`} sent` : ''}
          </Badge>
        );
      },
      sortValue: (n) => (latestAck(n.id)?.ackAt ? 2 : latestAck(n.id) ? 1 : 0),
    },
    ...(canEdit
      ? [
          {
            key: 'actions',
            header: 'Actions',
            hideHeader: true,
            phone: 'actions' as const,
            align: 'right' as const,
            cell: (n: Nurse) => {
              const ack = latestAck(n.id);
              return ack && !ack.ackAt ? (
                <Button size="sm" icon={Bell} onClick={() => handleSendReminder(n)} aria-label={`Send a reminder to ${n.fullName}`}>
                  Remind
                </Button>
              ) : null;
            },
          },
        ]
      : []),
  ];

  const sendColumns: Column<PublishLog>[] = [
    { key: 'sentAt', header: 'Sent', cell: (s) => formatDateTime(s.sentAt), sortValue: (s) => s.sentAt },
    { key: 'roster', header: 'Roster', cell: (s) => <span className="font-medium text-ink">{scheduleName(s.scheduleId)}</span>, sortValue: (s) => scheduleName(s.scheduleId), phone: 'title' },
    {
      key: 'kind',
      header: 'What',
      cell: (s) => {
        const num = versionNumber(s.versionId);
        return `${emailKindLabel(s.kind)}${num ? `, version ${num}` : ''}`;
      },
      sortValue: (s) => emailKindLabel(s.kind),
    },
    {
      key: 'result',
      header: 'Result',
      cell: (s) => {
        const r = sendResult(s);
        return <Badge tone={r.tone}>{r.words}</Badge>;
      },
    },
    {
      key: 'open',
      header: 'Open',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (s) => (
        <Button size="sm" icon={Eye} onClick={() => setOpenSend(s)} aria-label={`Open the email sent on ${formatDateTime(s.sentAt)}`}>
          Open
        </Button>
      ),
    },
  ];

  const tabs = [
    { id: 'replies', label: 'Read replies', ...(waiting.length > 0 ? { count: waiting.length, countTone: 'warning' as const } : {}) },
    { id: 'emails', label: 'Emails sent' },
    { id: 'links', label: 'Private links' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6">
      <PageHeader
        title="Sent rosters"
        meta={
          activeSchedule && (
            <>
              <span className="font-medium text-ink">{activeSchedule.name}</span>
              <span>
                {formatDate(activeSchedule.startDate)} to {formatDate(activeSchedule.endDate)}
              </span>
              <Badge tone={activeSchedule.status === 'PUBLISHED' ? 'success' : 'neutral'}>
                {activeSchedule.status === 'PUBLISHED' ? 'Published' : 'Draft'}, version {activeSchedule.activeVersionNumber || 1}
              </Badge>
            </>
          )
        }
        actions={
          canEdit && (
            <Button
              icon={Send}
              onClick={() => {
                window.location.hash = activeSchedule ? `schedules?roster=${encodeURIComponent(activeSchedule.id)}` : 'schedules';
              }}
            >
              Publish from the roster
            </Button>
          )
        }
      />

      {loadState === 'loading' && <LoadingState label="Loading Sent rosters…" />}
      {loadState === 'failed' && (
        <ErrorState
          title="Sent rosters could not be loaded"
          onRetry={() => {
            setLoadState('loading');
            loadData();
            if (canEdit) loadSends();
          }}
        />
      )}

      {loadState === 'ready' && (
        <>
          {canEdit && activeSchedule && (
            <ResumePublish
              scheduleId={activeSchedule.id}
              scheduleName={activeSchedule.name}
              clinicName={context.clinicName}
              actor={context.currentUser?.name || context.currentUser?.email || 'Planner'}
              onResumed={() => {
                loadData();
                loadSends();
              }}
            />
          )}
          <Notice tone="info" title="Rosters are published from the roster screen">
            Open the roster, then Publish. This screen shows what was sent and who has confirmed they have seen it.
          </Notice>

          <Card bodyClassName="">
            <Tabs label="Sent rosters" idPrefix="sent" value={activeTab} onChange={(id) => setActiveTab(id as SentTab)} tabs={tabs} className="px-4" />

            <TabPanel idPrefix="sent" id="replies" value={activeTab} className="space-y-4 p-4">
              {!activeSchedule ? (
                <EmptyState title="No roster yet">Create a roster and publish it; replies show here.</EmptyState>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-ink-muted" aria-live="polite">
                      {sentCount === 0
                        ? `${activeSchedule.name} has not been sent to any nurse yet.`
                        : `${seenCount} of ${sentCount} ${sentCount === 1 ? 'nurse has' : 'nurses have'} confirmed they have seen ${activeSchedule.name}.`}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {canEdit && (
                        <Button icon={Bell} busy={isSendingReminders} disabled={waiting.length === 0} onClick={handleRemindAll}>
                          {waiting.length > 0 ? `Remind the ${waiting.length} waiting` : 'Nobody is waiting'}
                        </Button>
                      )}
                      <Button icon={Download} onClick={handleDownloadReplies}>
                        Download (CSV)
                      </Button>
                    </div>
                  </div>
                  <DataTable
                    caption={`Read replies for ${activeSchedule.name}`}
                    rows={nurses}
                    rowKey={(n) => n.id}
                    columns={replyColumns}
                    initialSort={{ key: 'nurse', direction: 'ascending' }}
                    empty={<EmptyState title="No active nurses" />}
                  />
                </>
              )}
            </TabPanel>

            <TabPanel idPrefix="sent" id="emails" value={activeTab} className="space-y-4 p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <Field label="What was sent" className="w-full sm:w-64">
                  {(f) => (
                    <Select {...f} value={kindFilter} onChange={(e) => setKindFilter(e.target.value as typeof kindFilter)}>
                      <option value="ALL">All emails</option>
                      <option value="PUBLISH">The whole roster</option>
                      <option value="CHANGE">Changes only</option>
                      <option value="REMINDER">Reminders</option>
                      <option value="TEST">Test emails</option>
                    </Select>
                  )}
                </Field>
                <p className="text-ink-muted" aria-live="polite">
                  {kindFilter === 'ALL' ? `${sends.length}` : `${shownSends.length} of the ${sends.length}`} newest emails shown
                  {moreSends ? ', older ones are kept' : ''}.
                </p>
              </div>
              {sends.length === 0 && isLoadingSends ? (
                <LoadingState label="Loading the emails sent…" />
              ) : (
                <DataTable
                  caption="Emails sent, newest first"
                  rows={shownSends}
                  rowKey={(s) => s.id}
                  columns={sendColumns}
                  initialSort={{ key: 'sentAt', direction: 'descending' }}
                  empty={<EmptyState icon={Mail} title={sends.length === 0 ? 'Nothing sent yet' : 'No emails of this kind among those shown'} />}
                />
              )}
              {moreSends && (
                <div className="flex justify-center">
                  <Button busy={isLoadingSends} onClick={() => loadSends(sendsCursor)}>
                    Show {SENDS_PER_PAGE} older emails
                  </Button>
                </div>
              )}
            </TabPanel>

            <TabPanel idPrefix="sent" id="links" value={activeTab} className="space-y-4 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="max-w-2xl text-ink-muted">
                  Each nurse has their own link to My schedule and Team schedule, without signing in. It is in their roster email after each
                  publish, and the pages update when you publish. Keep the links within the clinic.
                </p>
                {canEdit && (
                  <Button icon={RefreshCw} busy={isRefreshingPages} onClick={handleRefreshPrivatePages}>
                    Update all pages
                  </Button>
                )}
              </div>
              {!canEdit ? (
                <Notice tone="info" title="For planners">
                  Only planners can see and share private links.
                </Notice>
              ) : (
                <ul className="divide-y divide-line rounded-lg border border-line" aria-label="Private links">
                  {nurses.map((n) => {
                    const link = nurseLinks.get(n.id);
                    const busy = busyLinkNurseId === n.id;
                    return (
                      <li key={n.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-ink">{n.fullName}</p>
                          <p className="text-sm text-ink-muted">{link ? 'Private link ready' : 'No link yet'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            icon={Copy}
                            busy={busy}
                            onClick={() => handleCopyPrivateLink(n)}
                            aria-label={`${link ? 'Copy the private link' : 'Make and copy a private link'} for ${n.fullName}`}
                          >
                            {link ? 'Copy the link' : 'Make a link'}
                          </Button>
                          {link && (
                            <Button size="sm" icon={RefreshCw} disabled={busy} onClick={() => handleRegeneratePrivateLink(n)} aria-label={`Make a new link for ${n.fullName}`}>
                              Make a new link
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </TabPanel>
          </Card>
        </>
      )}

      {/* One send: who it went to, and each email. */}
      <Dialog
        open={!!openSend && !viewingEmail}
        onClose={() => setOpenSend(null)}
        size="lg"
        title={openSend ? `${emailKindLabel(openSend.kind)}, ${scheduleName(openSend.scheduleId)}` : ''}
        description={openSend ? `Sent on ${formatDateTime(openSend.sentAt)}. ${sendResult(openSend).words}.` : undefined}
        footer={<Button onClick={() => setOpenSend(null)}>Close</Button>}
      >
        {openSend &&
          (openSend.recipients.length === 0 ? (
            <EmptyState title="Nobody was emailed" />
          ) : (
            <ul className="divide-y divide-line rounded-lg border border-line text-sm" aria-label="Emails in this send">
              {openSend.recipients.map((r) => (
                <li key={r.nurseId + r.email} className="flex flex-wrap items-center gap-2 p-3">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{r.nurseName}</span>
                    <span className="block text-ink-muted">{r.email || 'No email address'}</span>
                    {r.status === 'FAILED' && <span className="block text-danger">{r.errorMessage || 'Not sent'}</span>}
                  </span>
                  <Badge tone={r.status === 'SENT' ? 'success' : r.status === 'FAILED' ? 'danger' : r.status === 'MOCK_SENT' ? 'neutral' : 'warning'}>
                    {r.status === 'SENT' ? 'Sent' : r.status === 'FAILED' ? 'Not sent' : r.status === 'MOCK_SENT' ? 'Test mode' : 'Waiting'}
                  </Badge>
                  {r.status !== 'FAILED' && (
                    <Button
                      size="sm"
                      icon={Eye}
                      aria-label={`View the email to ${r.nurseName}`}
                      onClick={() =>
                        setViewingEmail({ subject: r.subject, recipientName: r.nurseName, recipientEmail: r.email, html: r.fullBodyHtml || notKeptHtml(r.bodyPreview) })
                      }
                    >
                      View email
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ))}
      </Dialog>

      <Dialog
        open={!!viewingEmail}
        onClose={() => setViewingEmail(null)}
        size="lg"
        title={viewingEmail ? `Email to ${viewingEmail.recipientName}` : ''}
        description={viewingEmail ? `${viewingEmail.recipientEmail}. Subject: ${viewingEmail.subject}` : undefined}
        footer={<Button onClick={() => setViewingEmail(null)}>Back</Button>}
      >
        {viewingEmail && <EmailHtmlPreview html={viewingEmail.html} className="h-[28rem]" />}
      </Dialog>
    </div>
  );
};
