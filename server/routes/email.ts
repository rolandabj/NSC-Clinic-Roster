/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Server Email Dispatch API
 * Sends emails built in the browser (roster notices, reminders, test emails)
 * through Google SMTP. SMTP credentials come only from the server environment.
 */

import { Router, Request, Response } from 'express';
import { requirePlanner } from '../middleware/auth';
import { escapeHtml } from '../../src/utils/escapeHtml';
import { EmailService, isGoogleAccountEmail } from '../services/email/emailService';
import { fetchStaffEmails } from '../services/auth/firebaseIdentityService';

export const emailRouter = Router();

/**
 * POST /api/email/test
 * Dispatches a test email, or a roster email built in the browser, via Google (SMTP or Mock mode).
 * Guarded: owner or editors only (managers can't send), and only to the clinic's staff or to the
 * sender. SMTP settings always come from the server environment.
 */
emailRouter.post('/email/test', requirePlanner, async (req: Request, res: Response) => {
  try {
    const {
      to,
      provider = 'GOOGLE',
      config,
      subject: reqSubject,
      html: reqHtml,
      scheduleId,
      nurseId,
      versionId,
    } = req.body;

    if (!isGoogleAccountEmail(to)) {
      res.status(400).json({
        error: 'InvalidRecipient',
        message: `Recipient email "${to}" must be a valid Google account (@gmail.com or Google Workspace).`,
      });
      return;
    }

    // Only to the clinic's own staff, or to the person sending it (e.g. a test
    // email). The clinic's Gmail account can't be used to email anyone else.
    const recipient = String(to).trim().toLowerCase();
    const sender = String(req.user?.email || '').trim().toLowerCase();
    if (recipient !== sender) {
      let staffEmails: Set<string>;
      try {
        staffEmails = await fetchStaffEmails((req as any).firebaseIdToken || '');
      } catch (lookupErr: any) {
        console.error('[EmailAPI] Staff email lookup failed:', lookupErr);
        res.status(503).json({ error: 'LookupFailed', message: 'Could not check the recipient against the staff list. Try again.' });
        return;
      }
      if (!staffEmails.has(recipient)) {
        res.status(403).json({
          error: 'RecipientNotStaff',
          message: `Emails can only go to the clinic's nurses and doctors, or to yourself. ${to} is not on the staff list.`,
        });
        return;
      }
    }

    const effectiveProvider = provider === 'MOCK' ? 'MOCK' : 'GOOGLE';
    const subject = reqSubject || `[Test] Clinic Roster Google Email Dispatch (${effectiveProvider})`;
    const html = reqHtml || `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0284c7; margin-top: 0;">Clinic Roster Google Email Test</h2>
        <p>This is an automated test verifying that transactional email dispatching is working as expected via Google.</p>
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 13px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Provider:</strong> Google (${effectiveProvider})</p>
          <p style="margin: 4px 0;"><strong>Recipient:</strong> ${escapeHtml(to)}</p>
          <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
        <p style="color: #64748b; font-size: 12px;">ClinicRoster Operational Dispatch System</p>
      </div>
    `;

    const result = await EmailService.send({
      to,
      subject,
      html,
      scheduleId,
      nurseId,
      versionId,
      config: { provider: effectiveProvider, ...(config || {}) },
    });

    res.json({ status: 'ok', data: result });
  } catch (err: any) {
    console.error('[EmailAPI] POST /api/email/test error:', err);
    res.status(500).json({ error: 'ServerError', message: err.message });
  }
});
