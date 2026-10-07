/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * One publish is one email log document, and Firestore refuses a document over 1 MiB.
 * The log keeps each nurse's whole email (for "View HTML" on the Publish screen) only while
 * they fit in a budget; past it, an email keeps its subject, summary and status but not its
 * body, and is marked htmlNotKept. About 25 whole monthly emails fit (25 KB each).
 */
import type { EmailRecipientLog } from '../../types';

/** Bytes of whole emails one log keeps, leaving room for the rest of the record. */
export const EMAIL_LOG_HTML_BUDGET = 700_000;

const encoder = new TextEncoder();

/** Size of an email body as Firestore counts it (UTF-8 bytes). */
export function htmlBytes(html: string | undefined): number {
  return html ? encoder.encode(html).length : 0;
}

export function recipientsForLog(recipients: EmailRecipientLog[], budget = EMAIL_LOG_HTML_BUDGET): EmailRecipientLog[] {
  let used = 0;
  return recipients.map((recipient) => {
    const size = htmlBytes(recipient.fullBodyHtml);
    if (used + size <= budget) {
      used += size;
      return recipient;
    }
    return { ...recipient, fullBodyHtml: '', htmlNotKept: true };
  });
}
