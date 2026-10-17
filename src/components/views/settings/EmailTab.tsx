/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Email tab.
 */

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button, Checkbox, Field, Input, Notice, cx } from '../../ui';
import { ClinicContextState } from '../../../types/navigation';
import { getRepository } from '../../../services/repository';
import { authorizedFetch } from '../../../services/auth/authService';
import { checkEmailReadiness, EmailReadiness } from '../../../services/email/emailReadiness';
import { readEmailResponse } from '../../../services/email/emailResponse';
import { escapeHtml } from '../../../utils/escapeHtml';
import { EmailSettingsConfig } from '../../../types/settings';
import { SaveBar } from './shared';

interface EmailTabProps {
  context: ClinicContextState;
  draft: EmailSettingsConfig;
  onChange: (updates: Partial<EmailSettingsConfig>) => void;
  changed: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const EmailTab: React.FC<EmailTabProps> = ({ context, draft: emailConfig, onChange, changed, saving, onSave, onCancel }) => {
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
    setTestEmailResult('Sending the test email…');
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
      setTestEmailResult(`✓ Test email sent to ${sender}.`);
    } else if (status === 'MOCK_SENT') {
      setTestEmailResult(`✓ Test mode: the test email to ${sender} was kept but not sent.`);
    } else {
      setTestEmailResult(`✗ ${errorMessage}`);
    }
  };

  const testFailed = testEmailResult?.startsWith('✗');
  return (
    <form
      className="space-y-5 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div>
        <h2 className="text-lg font-semibold text-ink">Email</h2>
        <p className="mt-1 text-ink-muted">
          Roster emails are sent from the clinic's email account set up on the server. These settings are shared by everyone who publishes.
        </p>
      </div>

      <section aria-labelledby="email-connection" className="max-w-2xl space-y-2 rounded-lg border border-line p-4">
        <h3 id="email-connection" className="font-semibold text-ink">
          Email connection
        </h3>
        <p role="status" className={readiness?.ready ? 'text-success' : 'text-danger'}>
          {readiness?.message || 'Checking the server…'}
        </p>
        {readiness?.sender && (
          <p>
            Sending account: <strong>{readiness.sender}</strong>
          </p>
        )}
        <Button busy={checking} onClick={checkConnection}>
          Check the connection without sending
        </Button>
      </section>

      <div className="max-w-2xl space-y-5">
        <Field label="Sender name" hint="The name nurses see on roster emails.">
          {(f) => <Input {...f} placeholder="Clinic Roster" value={emailConfig.senderName} onChange={(e) => onChange({ senderName: e.target.value })} />}
        </Field>

        <fieldset className="space-y-2">
          <legend className="font-semibold text-ink">Sending</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { mock: true, title: 'Test mode', hint: 'Emails are made and kept in Sent rosters, but nothing is emailed. For trying things out.' },
              { mock: false, title: 'Live', hint: "Publishing a roster emails each nurse on it, from the clinic's email account." },
            ].map((o) => (
              <label
                key={o.title}
                className={cx(
                  'flex cursor-pointer gap-2 rounded-lg border p-3',
                  emailConfig.mockMode === o.mock ? 'border-brand bg-brand-soft' : 'border-line hover:bg-sunken'
                )}
              >
                <input
                  type="radio"
                  name="email-mode"
                  className="mt-0.5 size-4 accent-brand"
                  checked={emailConfig.mockMode === o.mock}
                  onChange={() => onChange({ mockMode: o.mock, provider: 'GOOGLE' })}
                />
                <span>
                  <span className="block font-semibold text-ink">{o.title}</span>
                  <span className="block text-ink-muted">{o.hint}</span>
                </span>
              </label>
            ))}
          </div>
          {!emailConfig.mockMode && (
            <Notice tone="warning" title="Live: real emails go out">
              Each publish emails the nurses on the roster.
            </Notice>
          )}
        </fieldset>

        <Checkbox
          checked={emailConfig.requestDecisionEmails === true}
          onChange={(e) => onChange({ requestDecisionEmails: e.target.checked })}
          label="Email nurses when their request is approved or declined"
          hint="When a planner or manager approves or declines a request for leave, a day off or a shift, the nurse gets a short email that says so, with any note. In test mode the email is not sent."
        />

        <div className="space-y-2">
          <Button icon={Send} onClick={handleSendTestEmail}>
            Send a test email to me{context.currentUser?.email ? ` (${context.currentUser.email})` : ''}
          </Button>
          {testEmailResult && (
            <Notice
              tone={testFailed ? 'danger' : testEmailResult.startsWith('✓') ? 'success' : 'info'}
              title={testFailed ? 'The test email was not sent' : 'Test email'}
              live
            >
              {testEmailResult.replace(/^[✓✗] /, '')}
            </Notice>
          )}
        </div>
      </div>

      <SaveBar changed={changed} saving={saving} onSave={onSave} onCancel={onCancel} />
    </form>
  );
};
