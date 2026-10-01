/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Email settings model
 */

export type EmailProviderType = 'GOOGLE' | 'MOCK' | 'SMTP';

export interface EmailSettingsConfig {
  provider: EmailProviderType;
  /** Sandbox (true): nothing is sent. Shared by the whole clinic. */
  mockMode: boolean;
  /** The name shown as the sender. The address is the server's Gmail account. */
  senderName: string;
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettingsConfig = {
  provider: 'GOOGLE',
  mockMode: true,
  senderName: 'Dr. Roland / Clinical Director',
};
