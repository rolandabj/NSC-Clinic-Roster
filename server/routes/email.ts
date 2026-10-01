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

export const emailRouter = Router();

/**
 * POST /api/email/test
 * Dispatches a test email, or a roster email built in the browser, via Google (SMTP or Mock mode).
 * Guarded: Requires Planner or Owner role. SMTP settings always come from the server environment.
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
