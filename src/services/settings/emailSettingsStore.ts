/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Email settings shared by the whole clinic: Sandbox or Live, and the sender
 * name. They are stored in Firestore (systemMetadata/email_settings) so every
 * planner on every computer uses the same mode; this browser keeps a copy for
 * a quick start. The sending account itself is set on the server.
 */

import { IRepository } from '../repository/IRepository';
import { DEFAULT_EMAIL_SETTINGS, EmailSettingsConfig } from '../../types/settings';

const DOC_ID = 'email_settings';
const CACHE_KEY = 'clinic_roster_email_config';

/** The last settings seen in this browser (defaults when none or unreadable). */
export function cachedEmailSettings(): EmailSettingsConfig {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? { ...DEFAULT_EMAIL_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_EMAIL_SETTINGS };
  } catch {
    return { ...DEFAULT_EMAIL_SETTINGS };
  }
}

function cache(config: EmailSettingsConfig) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(config));
  } catch {
    // storage unavailable: the shared copy in Firestore still applies
  }
}

/** Reads the clinic's shared settings (falls back to this browser's copy when unreadable). */
export async function loadEmailSettings(repo: IRepository): Promise<EmailSettingsConfig> {
  const local = cachedEmailSettings();
  try {
    const shared = await repo.get('systemMetadata', DOC_ID);
    if (!shared) return local;
    const config: EmailSettingsConfig = {
      ...local,
      mockMode: shared.emailMockMode !== false,
      senderName: shared.emailSenderName || local.senderName,
    };
    cache(config);
    return config;
  } catch (err) {
    console.warn('[EmailSettings] Shared email settings could not be read; using this browser\'s copy.', err);
    return local;
  }
}

/** Saves the shared settings for everyone (throws if Firestore refuses). */
export async function saveEmailSettings(repo: IRepository, config: EmailSettingsConfig, byEmail?: string): Promise<void> {
  cache(config);
  const existing = await repo.get('systemMetadata', DOC_ID).catch(() => null);
  const data = {
    emailMockMode: config.mockMode !== false,
    emailSenderName: config.senderName || DEFAULT_EMAIL_SETTINGS.senderName,
    updatedAt: new Date().toISOString(),
    updatedBy: byEmail || '',
  };
  if (existing) await repo.update('systemMetadata', DOC_ID, data);
  else await repo.create('systemMetadata', { id: DOC_ID, ...data });
}
