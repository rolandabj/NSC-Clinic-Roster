/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The words of the Sent rosters screen (Phase 7, slice 6b): each kind of email by a plain name,
 * and what became of a send, in words with a tone for its badge.
 */

import { EmailLogKind, PublishLog } from '../../types';

const KIND_LABELS: Record<EmailLogKind, string> = {
  PUBLISH: 'The whole roster',
  CHANGE: 'Changes only',
  REMINDER: 'Reminder',
  TEST: 'Test email',
};

export const emailKindLabel = (kind: EmailLogKind): string => KIND_LABELS[kind] || 'Email';

export interface SendResult {
  words: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
}

export function sendResult(log: PublishLog): SendResult {
  const count = (status: string) => log.recipients.filter((r) => r.status === status).length;
  const sent = count('SENT');
  const test = count('MOCK_SENT');
  const failed = count('FAILED');
  if (log.status === 'SENDING') return { words: `Stopped or still sending: ${sent + test} sent so far`, tone: 'warning' };
  if (log.recipients.length === 0) return { words: 'Published, nobody emailed', tone: 'neutral' };
  const parts = [sent > 0 ? `${sent} sent` : '', test > 0 ? `${test} in test mode, not emailed` : '', failed > 0 ? `${failed} not sent` : ''].filter(Boolean);
  const tone = failed === 0 ? (sent > 0 ? 'success' : 'neutral') : sent + test > 0 ? 'warning' : 'danger';
  return { words: parts.join(', '), tone };
}
