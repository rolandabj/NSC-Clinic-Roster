/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Server-Side Transactional Email Service
 * Supports Google Gmail SMTP (smtp.gmail.com, port 587, TLS) and MOCK Safe Sandbox mode.
 */

import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { EmailSettingsConfig, DEFAULT_EMAIL_SETTINGS } from '../../../src/types/settings';

/**
 * Validates that an email is a valid format and eligible Google / Google Workspace account
 */
export function isGoogleAccountEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
  scheduleId?: string;
  nurseId?: string;
  versionId?: string;
  config?: Partial<EmailSettingsConfig>;
}

export interface SendEmailResult {
  success: boolean;
  provider: string;
  messageId: string;
  recipients: string[];
  status: 'SENT' | 'MOCK_SENT' | 'FAILED';
  error?: string;
}

export interface EmailReadiness {
  ready: boolean;
  message: string;
  sender: string;
}

/** Do not return SMTP responses or credentials to the browser. */
export function emailFailureMessage(err: any): string {
  if (err?.code === 'EAUTH') return 'Google rejected the sending account credentials. Update GOOGLE_SMTP_USER and GOOGLE_APP_PASSWORD in the server secrets, then redeploy. Use a Google app password, not the account password.';
  if (['ETIMEDOUT', 'ECONNECTION', 'ECONNREFUSED', 'EDNS', 'ESOCKET'].includes(err?.code)) return 'The server could not connect to the email provider. Check SMTP_HOST, SMTP_PORT and the server network, then try again.';
  if (err?.code === 'EENVELOPE') return 'The email provider rejected the sender or recipient address. Check the sending account and the nurse email address.';
  return 'The email provider could not complete the request. Check the server email configuration and try again.';
}

/** The email settings plus the SMTP connection, which only the server environment provides. */
interface ServerEmailConfig extends EmailSettingsConfig {
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  googleAppPassword?: string;
  smtpSecure?: boolean;
}

// SMTP connection settings and credentials may only come from the server
// environment (AI Studio Secrets). They are never taken from stored clinic
// settings or from a request, so they cannot be redirected to another server.
const SMTP_CONNECTION_KEYS = ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'googleAppPassword', 'smtpSecure'] as const;

// Fields a caller may override per request.
const REQUEST_OVERRIDE_KEYS = ['provider', 'mockMode', 'senderName'] as const;

function withoutConnectionSettings(config: any): Partial<EmailSettingsConfig> {
  if (!config || typeof config !== 'object') return {};
  const clean: any = { ...config };
  for (const key of SMTP_CONNECTION_KEYS) delete clean[key];
  return clean;
}

function pickRequestOverrides(config: any): Partial<EmailSettingsConfig> {
  if (!config || typeof config !== 'object') return {};
  const picked: any = {};
  for (const key of REQUEST_OVERRIDE_KEYS) {
    if (config[key] !== undefined) picked[key] = config[key];
  }
  if (picked.provider !== undefined && picked.provider !== 'MOCK' && picked.provider !== 'GOOGLE') {
    delete picked.provider;
  }
  if (picked.senderName !== undefined) picked.senderName = String(picked.senderName).replace(/["<>\r\n]/g, '').slice(0, 100);
  return picked;
}

export class EmailService {
  private static transport(config: ServerEmailConfig) {
    const user = (config.smtpUser || '').trim();
    const pass = config.googleAppPassword ? config.googleAppPassword.replace(/\s/g, '') : config.smtpPass || '';
    const port = config.smtpPort || 587;
    return nodemailer.createTransport({
      host: config.smtpHost || 'smtp.gmail.com', port,
      secure: port === 465, requireTLS: true,
      auth: { user, pass },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    });
  }

  public static readiness(): EmailReadiness {
    const config = this.getConfig();
    const missing = [!config.smtpUser?.trim() && 'GOOGLE_SMTP_USER', !(config.googleAppPassword || config.smtpPass)?.trim() && 'GOOGLE_APP_PASSWORD'].filter(Boolean);
    return { ready: missing.length === 0, sender: config.smtpUser?.trim() || '',
      message: missing.length ? `Email is not configured. Add ${missing.join(' and ')} in AI Studio server secrets, then redeploy.` : 'Sending account configured. Check the connection before sending.' };
  }

  /** Authenticates to SMTP without sending an email. */
  public static async checkConnection(): Promise<EmailReadiness> {
    const status = this.readiness();
    if (!status.ready) return status;
    const transport = this.transport(this.getConfig());
    try {
      await transport.verify();
      return { ...status, message: 'Email connection verified. Ready to send.' };
    } catch (err) {
      return { ...status, ready: false, message: emailFailureMessage(err) };
    } finally { transport.close(); }
  }
  /**
   * Resolves effective email configuration from repository or environment
   */
  public static getConfig(): ServerEmailConfig {
    const defaults = withoutConnectionSettings(DEFAULT_EMAIL_SETTINGS);

    return <ServerEmailConfig>{
      ...defaults,
      // Environment (AI Studio Secrets) provides the provider and SMTP credentials
      ...(process.env.EMAIL_PROVIDER ? { provider: process.env.EMAIL_PROVIDER as any } : {}),
      ...(process.env.EMAIL_SENDER_NAME ? { senderName: process.env.EMAIL_SENDER_NAME } : {}),
      ...(process.env.GOOGLE_SMTP_USER || process.env.SMTP_USER ? { smtpUser: process.env.GOOGLE_SMTP_USER || process.env.SMTP_USER } : {}),
      ...(process.env.GOOGLE_APP_PASSWORD || process.env.SMTP_PASS ? { smtpPass: process.env.GOOGLE_APP_PASSWORD || process.env.SMTP_PASS } : {}),
      ...(process.env.GOOGLE_APP_PASSWORD ? { googleAppPassword: process.env.GOOGLE_APP_PASSWORD } : {}),
      ...(process.env.SMTP_HOST ? { smtpHost: process.env.SMTP_HOST } : {}),
      ...(process.env.SMTP_PORT ? { smtpPort: parseInt(process.env.SMTP_PORT, 10) } : {}),
    };
  }

  /**
   * Dispatches email exclusively via Google SMTP or Mock Safe Sandbox mode
   */
  public static async send(payload: SendEmailPayload): Promise<SendEmailResult> {
    const baseConfig = this.getConfig();
    const config: ServerEmailConfig = { ...baseConfig, ...pickRequestOverrides(payload.config) };

    const rawList = Array.isArray(payload.to) ? payload.to : [payload.to];
    // Filter and normalize recipient emails
    const toList = rawList
      .map((e) => e.trim().toLowerCase())
      .filter((e) => isGoogleAccountEmail(e));

    if (toList.length === 0) {
      return {
        success: false,
        provider: 'GOOGLE',
        messageId: `err-${uuidv4().slice(0, 8)}`,
        recipients: rawList,
        status: 'FAILED',
        error: 'No valid recipient Google accounts provided.',
      };
    }

    const fromName = String(payload.fromName || config.senderName || 'Clinic Rostering').replace(/["<>\r\n]/g, '');
    // Gmail SMTP only sends as the authenticated account, so the sender is the SMTP user when set.
    const fromEmail = config.smtpUser || 'rolandabj@gmail.com';
    const fromAddress = `"${fromName}" <${fromEmail}>`;

    let result: SendEmailResult;

    // 1. MOCK Provider / Safe Sandbox Mode
    if (config.provider === 'MOCK' || config.mockMode) {
      const mockId = `mock-${uuidv4().slice(0, 8)}`;
      console.log(`[EmailService:GOOGLE-MOCK] Logged to: ${toList.join(', ')} | From: ${fromAddress} | Subject: ${payload.subject}`);

      result = {
        success: true,
        provider: 'GOOGLE',
        messageId: mockId,
        recipients: toList,
        status: 'MOCK_SENT',
      };
    }
    // 2. Live Google SMTP Provider (smtp.gmail.com, port 587, STARTTLS)
    else {
      try {
        const readiness = this.readiness();
        if (!readiness.ready) return { success: false, provider: 'GOOGLE', messageId: '', recipients: toList, status: 'FAILED', error: readiness.message };
        const transporter = this.transport(config);

        const info = await transporter.sendMail({
          from: fromAddress,
          to: toList.join(', '),
          subject: payload.subject,
          html: payload.html,
          text: payload.text || payload.html.replace(/<[^>]*>/g, ''),
        }).finally(() => transporter.close());
        if (!info.accepted?.length || info.rejected?.length) {
          throw Object.assign(new Error('Recipient rejected'), { code: 'EENVELOPE' });
        }

        result = {
          success: true,
          provider: 'GOOGLE',
          messageId: info.messageId || `g-smtp-${uuidv4().slice(0, 8)}`,
          recipients: toList,
          status: 'SENT',
        };
      } catch (err: any) {
        console.error('[EmailService:GOOGLE-SMTP] Dispatch Error:', err?.code || 'UNKNOWN');
        result = {
          success: false,
          provider: 'GOOGLE',
          messageId: `err-${uuidv4().slice(0, 8)}`,
          recipients: toList,
          status: 'FAILED',
          error: emailFailureMessage(err),
        };
      }
    }

    // The browser records the dispatch in the Firestore email log.
    console.log(`[EmailService] ${result.status} to ${toList.length} recipient(s): "${payload.subject}"`);

    return result;
  }
}
