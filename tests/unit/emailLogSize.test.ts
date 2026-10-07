import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recipientsForLog, htmlBytes } from '../../src/services/publish/emailLogSize';
import type { EmailRecipientLog } from '../../src/types';

const sent = (nurseId: string, html: string, status: EmailRecipientLog['status'] = 'SENT'): EmailRecipientLog => ({
  email: `${nurseId}@example.com`, nurseId, nurseName: nurseId, subject: 'Your roster', bodyPreview: 'Shifts', fullBodyHtml: html, status,
});

// One publish is one email log document, and Firestore refuses a document over 1 MiB: about 40
// nurses' whole emails (25 KB each) would make the last update of a publish fail.

test('a normal publish keeps every whole email', () => {
  const recipients = [sent('amy', '<p>a</p>'), sent('mary', '<p>b</p>')];
  assert.deepEqual(recipientsForLog(recipients, 1000), recipients);
});

test('past the budget, the log keeps the first emails whole and only the summary of the others', () => {
  const big = 'x'.repeat(400);
  const kept = recipientsForLog([sent('a', big), sent('b', big), sent('c', big)], 1000);
  assert.equal(kept[0].fullBodyHtml, big);
  assert.equal(kept[1].fullBodyHtml, big);
  assert.equal(kept[2].fullBodyHtml, '');
  assert.equal(kept[2].htmlNotKept, true);
  assert.equal(kept[2].subject, 'Your roster');
  assert.equal(kept[2].status, 'SENT');
  assert.ok(kept.reduce((n, r) => n + htmlBytes(r.fullBodyHtml), 0) <= 1000);
});

test('the budget counts bytes, so names in Arabic weigh what Firestore counts', () => {
  assert.equal(htmlBytes('abc'), 3);
  assert.equal(htmlBytes('مريم'), 8);
  const kept = recipientsForLog([sent('a', 'مريم'.repeat(100))], 700);
  assert.equal(kept[0].htmlNotKept, true);
});

test('a failed email without a body costs nothing and is kept as it is', () => {
  const failed = sent('nina', '', 'FAILED');
  assert.deepEqual(recipientsForLog([failed], 0), [failed]);
});

test('the default budget leaves room for a 40 nurse publish of 25 KB emails', () => {
  const email = 'x'.repeat(25_000);
  const kept = recipientsForLog(Array.from({ length: 40 }, (_, i) => sent(`n${i}`, email)));
  const bytes = kept.reduce((n, r) => n + htmlBytes(r.fullBodyHtml), 0);
  assert.ok(bytes <= 700_000, `${bytes} bytes kept`);
  assert.ok(kept.some((r) => r.htmlNotKept), 'some emails are not kept whole');
  assert.equal(kept[0].htmlNotKept, undefined);
});
