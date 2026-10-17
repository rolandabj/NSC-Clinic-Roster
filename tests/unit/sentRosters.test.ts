import test from 'node:test';
import assert from 'node:assert/strict';
import { emailKindLabel, sendResult } from '../../src/services/publish/sentRosters';
import { PublishLog } from '../../src/types';

// The words of the Sent rosters screen (Phase 7, slice 6b).

const rec = (status: string) => ({ email: 'a@x', nurseId: 'n', nurseName: 'N', subject: 's', bodyPreview: '', fullBodyHtml: '', status }) as any;
const log = (status: PublishLog['status'], recipients: string[]): PublishLog =>
  ({ id: 'l', scheduleId: 's', versionId: 'v', kind: 'PUBLISH', status, sentAt: '2026-11-01T08:00:00Z', recipients: recipients.map(rec) }) as PublishLog;

test('each kind of email has a plain name', () => {
  assert.equal(emailKindLabel('PUBLISH'), 'The whole roster');
  assert.equal(emailKindLabel('CHANGE'), 'Changes only');
  assert.equal(emailKindLabel('REMINDER'), 'Reminder');
  assert.equal(emailKindLabel('TEST'), 'Test email');
});

test('a send says how many went, in words', () => {
  assert.deepEqual(sendResult(log('SENT', ['SENT', 'SENT'])), { words: '2 sent', tone: 'success' });
  assert.deepEqual(sendResult(log('SENT', ['SENT'])), { words: '1 sent', tone: 'success' });
  assert.deepEqual(sendResult(log('MOCK_SENT', ['MOCK_SENT', 'MOCK_SENT'])), { words: '2 in test mode, not emailed', tone: 'neutral' });
  assert.deepEqual(sendResult(log('PARTIAL', ['SENT', 'FAILED', 'FAILED'])), { words: '1 sent, 2 not sent', tone: 'warning' });
  assert.deepEqual(sendResult(log('FAILED', ['FAILED'])), { words: '1 not sent', tone: 'danger' });
});

test('a send still marked as sending says it may have stopped', () => {
  assert.deepEqual(sendResult(log('SENDING', ['SENT', 'SENT'])), { words: 'Stopped or still sending: 2 sent so far', tone: 'warning' });
});

test('a publish with nobody to email says so', () => {
  assert.deepEqual(sendResult(log('SENT', [])), { words: 'Published, nobody emailed', tone: 'neutral' });
});
