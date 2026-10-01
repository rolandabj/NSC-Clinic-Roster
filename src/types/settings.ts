/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Email settings model
 */

export type EmailProviderType = 'GOOGLE' | 'MOCK' | 'SMTP';

export interface EmailSettingsConfig {
  provider: EmailProviderType;
  mockMode: boolean; // default true (Safe Sandbox)
  senderName: string;
  senderEmail: string; // e.g. rolandabj@gmail.com
  googleAppPassword?: string; // Optional for live Google SMTP dispatch
  smtpHost?: string; // default smtp.gmail.com
  smtpPort?: number; // default 587
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettingsConfig = {
  provider: 'GOOGLE',
  mockMode: true,
  senderName: 'Dr. Roland / Clinical Director',
  senderEmail: 'rolandabj@gmail.com',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpSecure: false,
};
