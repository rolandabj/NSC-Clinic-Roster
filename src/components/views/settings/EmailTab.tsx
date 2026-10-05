/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Email tab.
 */

import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertTriangle, Send, Save, Check, RefreshCw } from 'lucide-react';
import { ClinicContextState } from '../../../types/navigation';
import { getRepository } from '../../../services/repository';
import { authorizedFetch } from '../../../services/auth/authService';
import { checkEmailReadiness, EmailReadiness } from '../../../services/email/emailReadiness';
import { readEmailResponse } from '../../../services/email/emailResponse';
import { escapeHtml } from '../../../utils/escapeHtml';
import { EmailSettingsConfig } from '../../../types/settings';
import { SaveStatus } from './shared';

interface EmailTabProps {
  context: ClinicContextState;
  emailConfig: EmailSettingsConfig;
  emailSaveStatus: SaveStatus;
  updateEmailConfigField: (updates: Partial<EmailSettingsConfig>, immediate?: boolean) => void;
  flushEmailSave: () => void;
  handleSaveEmailConfig: (e: React.FormEvent) => void;
}

export const EmailTab: React.FC<EmailTabProps> = ({
  context,
  emailConfig,
  emailSaveStatus,
  updateEmailConfigField,
  flushEmailSave,
  handleSaveEmailConfig,
}) => {
  const repo = getRepository();

  // Test email status
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<EmailReadiness>();
  const [checking, setChecking] = useState(false);
  useEffect(() => {
    let active = true;
    checkEmailReadiness().then(r => { if (active) setReadiness(r); }).catch(err => {
      if (active) setReadiness({ ready: false, sender: '', message: err.message });
    });
    return () => { active = false; };
  }, []);
  const checkConnection = async () => {
    setChecking(true);
    try { setReadiness(await checkEmailReadiness(true)); }
    catch (err: any) { setReadiness({ ready: false, sender: '', message: err.message }); }
    finally { setChecking(false); }
  };

  const handleSendTestEmail = async () => {
    setTestEmailResult('Dispatching test email...');
    // The test goes to whoever is signed in (the server only sends to staff or to the sender)
    const sender = context.currentUser?.email || '';
    if (!sender) {
      setTestEmailResult('Sign in again to send a test email.');
      return;
    }
    const isMock = emailConfig.mockMode || emailConfig.provider === 'MOCK';
    const subject = `[Test] Clinic Roster Google Email Dispatch (${isMock ? 'MOCK' : 'GOOGLE'})`;

    // Ask the server to send; report what really happened.
    let status: 'SENT' | 'MOCK_SENT' | 'FAILED' = 'FAILED';
    let errorMessage = '';
    try {
      const res = await authorizedFetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: sender,
          provider: isMock ? 'MOCK' : 'GOOGLE',
          config: { provider: isMock ? 'MOCK' : 'GOOGLE', mockMode: isMock, senderName: emailConfig.senderName },
        }),
      });
      const json = await readEmailResponse(res);
      if (res.ok && (json.data?.status === 'SENT' || json.data?.status === 'MOCK_SENT')) {
        status = json.data.status;
      } else {
        errorMessage = json.data?.error || json.message || `Server returned ${res.status}`;
      }
    } catch (err: any) {
      errorMessage = err?.message || 'The server could not be reached';
    }

    try {
      await repo.create('emailLog', {
        id: `elog-test-${Date.now()}`,
        scheduleId: 'test-dispatch',
        versionId: 'test',
        kind: 'TEST',
        recipients: [{
          email: sender,
          nurseId: 'test-recipient',
          nurseName: emailConfig.senderName || 'Clinical Director',
          subject,
          bodyPreview: `Test notification verifying Google transactional email dispatch to ${sender}.`,
          fullBodyHtml: `<p>Test email to ${escapeHtml(sender)}</p>`,
          status,
          errorMessage: errorMessage || undefined,
        }],
        status,
        sentAt: new Date().toISOString(),
      });
    } catch {
      // the result below is still shown
    }

    if (status === 'SENT') {
      setTestEmailResult(`✓ Test email sent through Google SMTP to ${sender}.`);
    } else if (status === 'MOCK_SENT') {
      setTestEmailResult(`✓ Sandbox mode: the test email to ${sender} was logged but not sent.`);
    } else {
      setTestEmailResult(`✗ The test email was not sent: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSaveEmailConfig} className="space-y-4 max-w-2xl text-xs">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Mail className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Google Email Communications &amp; Notifications
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">
            Roster emails are sent by the clinic account configured on the server. Check the connection and choose Live to send real emails.
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          {emailSaveStatus === 'saving' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200 shadow-2xs">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
              <span>Saving...</span>
            </span>
          )}
          {emailSaveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>All changes saved ✓</span>
            </span>
          )}
          {emailSaveStatus === 'error' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200 shadow-2xs">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>Error saving</span>
            </span>
          )}
        </div>
      </div>

      {/* Sender */}
      <section className="p-4 rounded-lg border border-slate-200 bg-white space-y-2" aria-label="Email connection">
        <h3 className="font-semibold text-slate-900">Email connection</h3>
        <p role="status" className={readiness?.ready ? 'text-emerald-700' : 'text-rose-700'}>{readiness?.message || 'Checking server configuration…'}</p>
        {readiness?.sender && <p>Sending account: <strong>{readiness.sender}</strong></p>}
        <button type="button" disabled={checking} onClick={checkConnection} className="rounded border border-slate-300 px-3 py-2 font-semibold disabled:opacity-50">
          {checking ? 'Checking connection…' : 'Check connection without sending'}
        </button>
      </section>
      <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs">
        <label htmlFor="email-sender-name" className="block font-semibold text-slate-800">
          Sender name
        </label>
        <input
          id="email-sender-name"
          type="text"
          placeholder="Clinic Roster"
          value={emailConfig.senderName}
          onChange={(e) => updateEmailConfigField({ senderName: e.target.value })}
          onBlur={flushEmailSave}
          className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
        />
        <p className="text-[11px] text-slate-500">
          The name staff see on roster emails. Emails are sent from the clinic's email account set up on the server.
        </p>
      </div>

      {/* Dispatch Mode & Google Sandbox Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              Dispatch Mode
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Choose how notifications are handled during roster publication.
            </p>
          </div>
          <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => updateEmailConfigField({ mockMode: true, provider: 'GOOGLE' }, true)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                emailConfig.mockMode
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Safe Sandbox
            </button>
            <button
              type="button"
              onClick={() => updateEmailConfigField({ mockMode: false, provider: 'GOOGLE' }, true)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                !emailConfig.mockMode
                  ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Live Google Dispatch
            </button>
          </div>
        </div>

        {emailConfig.mockMode ? (
          <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-md text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
            <strong>Safe Sandbox Active:</strong> Published rosters generate full responsive HTML emails that are logged directly to the in-app <em>Email Log</em> table without dispatching real network emails. Perfect for testing and schedule validation.
          </div>
        ) : (
          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-md text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
            <strong>Live:</strong> publishing a roster emails each nurse on it, from the clinic's email account. This setting is shared by everyone who publishes.
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={emailSaveStatus === 'saving'}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{emailSaveStatus === 'saving' ? 'Saving...' : 'Save Email Settings'}</span>
        </button>

        <button
          type="button"
          onClick={handleSendTestEmail}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md font-medium transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-slate-500" />
          <span>Send a test email to me{context.currentUser?.email ? ` (${context.currentUser.email})` : ''}</span>
        </button>

        {emailSaveStatus === 'saved' && (
          <span className="text-slate-500 text-[11px] flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Auto-saved
          </span>
        )}
      </div>

      {testEmailResult && (
        <div
          role="status"
          className={`p-3 border rounded-md text-[11px] flex items-center gap-2 ${
            testEmailResult.startsWith('✗')
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${testEmailResult.startsWith('✗') ? 'text-rose-600' : 'text-emerald-600'}`} />
          <span>{testEmailResult}</span>
        </div>
      )}
    </form>
  );
};
