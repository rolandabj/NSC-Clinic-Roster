import test from 'node:test';
import assert from 'node:assert/strict';
import { findStoppedPublish, planResume, runResume, stoppedWords, STOPPED_AFTER_MS } from '../../src/services/publish/resumePublish';
import { makeNurse, makeSchedule, DAY_DUTY } from './fixtures';
import type { PublishLog, ScheduleVersion } from '../../src/types';
import { DEFAULT_EMAIL_SETTINGS } from '../../src/types/settings';

// Resume a stopped publish (Phase 7, slice 7): the email log names every nurse before sending
// (Waiting, with the receipt token made in advance), so a publish stopped partway (a closed tab)
// can carry on later, from the same version, to the nurses still waiting or not sent.

const rec = (nurseId: string, status: string, extra: Record<string, unknown> = {}) =>
  ({ email: `${nurseId}@example.com`, nurseId, nurseName: `Nurse ${nurseId}`, subject: '', bodyPreview: '', fullBodyHtml: '', status, ackToken: `ack-${nurseId}`, ...extra }) as any;

const stopped = (over: Partial<PublishLog> = {}): PublishLog =>
  ({
    id: 'pub-1',
    scheduleId: 'sched-1',
    versionId: 'v2',
    kind: 'PUBLISH',
    status: 'SENDING',
    sentAt: '2026-10-17T08:00:00.000Z',
    updatedAt: '2026-10-17T08:01:00.000Z',
    recipients: [rec('a', 'SENT'), rec('b', 'MOCK_SENT'), rec('c', 'FAILED', { errorMessage: 'Mailbox full' }), rec('d', 'WAITING'), rec('e', 'WAITING')],
    ...over,
  }) as PublishLog;

const now = Date.parse('2026-10-17T08:01:00.000Z') + STOPPED_AFTER_MS + 1000;

test('a send with no news for a while, with nurses still waiting, has stopped', () => {
  assert.equal(findStoppedPublish([stopped()], 'sched-1', now)?.id, 'pub-1');
  assert.equal(stoppedWords(stopped()), 'Sending stopped after 2 of 5 nurses');
});

test('a send still running, finished, of another roster, or from before this change is not offered', () => {
  const recent = Date.parse('2026-10-17T08:01:30.000Z');
  assert.equal(findStoppedPublish([stopped()], 'sched-1', recent), null, 'still running: the last email was 30 seconds ago');
  assert.equal(findStoppedPublish([stopped({ status: 'PARTIAL' })], 'sched-1', now), null);
  assert.equal(findStoppedPublish([stopped()], 'other', now), null);
  const old = stopped({ recipients: [rec('a', 'SENT', { ackToken: undefined })] });
  assert.equal(findStoppedPublish([old], 'sched-1', now), null, 'no plan of who was to be emailed');
  assert.equal(findStoppedPublish([stopped({ kind: 'REMINDER' })], 'sched-1', now), null);
});

test('only the newest stopped send of a roster is offered', () => {
  const older = stopped({ id: 'pub-0', sentAt: '2026-10-10T08:00:00.000Z', updatedAt: '2026-10-10T08:00:00.000Z' });
  assert.equal(findStoppedPublish([older, stopped()], 'sched-1', now)?.id, 'pub-1');
});

test('the plan sends to the nurses waiting or not sent, with their own receipt tokens', () => {
  const nurses = ['a', 'b', 'c', 'd', 'e'].map((id) => makeNurse(id));
  const plan = planResume(stopped(), nurses);
  assert.deepEqual(plan.send.map((s) => [s.nurse.id, s.ackToken]), [['c', 'ack-c'], ['d', 'ack-d'], ['e', 'ack-e']]);
  assert.equal(plan.done, 2);
  assert.equal(plan.total, 5);
  assert.deepEqual(plan.skipped, []);
});

test('a nurse no longer active or without an email is named, not emailed', () => {
  const nurses = [makeNurse('a'), makeNurse('b'), makeNurse('c', { active: false }), makeNurse('d', { gmail: '' })];
  const plan = planResume(stopped(), nurses);
  assert.deepEqual(plan.send.map((s) => s.nurse.id), []);
  assert.deepEqual(
    plan.skipped.map((s) => [s.nurseName, s.reason]),
    [['Nurse c', 'no longer active'], ['Nurse d', 'no email address'], ['Nurse e', 'no longer listed']]
  );
});

function fakeRepo(initial: Record<string, any[]>) {
  const data: Record<string, Map<string, any>> = {};
  for (const [c, items] of Object.entries(initial)) data[c] = new Map(items.map((x) => [x.id, x]));
  const col = (name: string) => (data[name] ||= new Map());
  const repo: any = {
    async get(name: string, id: string) { return col(name).get(id) || null; },
    async list(name: string, filter?: { field: string; value: any }) {
      const all = [...col(name).values()];
      return filter ? all.filter((x) => x[filter.field] === filter.value) : all;
    },
    async create(name: string, item: any) { const id = item.id || `id-${col(name).size + 1}`; col(name).set(id, { ...item, id }); return { ...item, id }; },
    async update(name: string, id: string, patch: any) { const n = { ...(col(name).get(id) || { id }), ...patch }; col(name).set(id, n); return n; },
    async remove(name: string, id: string) { col(name).delete(id); },
  };
  return { repo, col };
}

test('resuming sends from the same version, records each result, and writes the audit entry once', async () => {
  const schedule = makeSchedule({ status: 'PUBLISHED', activeVersionNumber: 2 });
  const nurses = ['a', 'b', 'c', 'd', 'e'].map((id) => makeNurse(id));
  const shift = { id: 's1', scheduleId: schedule.id, nurseId: 'd', date: schedule.startDate, dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', source: 'MANUAL', locked: false };
  const version: ScheduleVersion = {
    id: 'v2', scheduleId: schedule.id, number: 2, timestamp: '2026-10-17T08:00:00.000Z', author: 'Ana', note: 'October',
    snapshot: { schedule, assignments: [shift as any], leaveEntries: [], locks: [], rulesSnapshot: [] }, isPublished: true, publishedAt: '2026-10-17T08:00:00.000Z',
  };
  const { repo, col } = fakeRepo({
    schedules: [schedule], versions: [version], nurses, dutyWindows: [DAY_DUTY], emailLog: [stopped()],
  });
  const progress: number[] = [];
  const result = await runResume(repo, 'pub-1', {
    actor: 'Ana',
    clinicName: 'Test Clinic',
    emailConfig: { ...DEFAULT_EMAIL_SETTINGS, mockMode: true },
    onProgress: (done) => progress.push(done),
  });
  assert.equal(result.sent, 3);
  assert.equal(result.failed, 0);
  assert.equal(col('versions').size, 1, 'no new version');
  const log = col('emailLog').get('pub-1');
  assert.equal(log.status, 'SENT', 'one real email before, the rest in test mode');
  assert.deepEqual(log.recipients.map((r: any) => r.status), ['SENT', 'MOCK_SENT', 'MOCK_SENT', 'MOCK_SENT', 'MOCK_SENT']);
  assert.equal(log.recipients.find((r: any) => r.nurseId === 'd').ackToken, 'ack-d', 'the token made in advance is kept');
  assert.deepEqual(progress, [1, 2, 3]);
  const audit = [...col('audit').values()];
  assert.equal(audit.length, 1);
  assert.equal(audit[0].action, 'PUBLISH');
  assert.match(audit[0].note, /Resumed sending of version 2/);
});

test('a send that is no longer stopped is not resumed twice', async () => {
  const { repo } = fakeRepo({ emailLog: [stopped({ status: 'SENT' })] });
  await assert.rejects(
    runResume(repo, 'pub-1', { actor: 'Ana', clinicName: 'Test Clinic', emailConfig: { ...DEFAULT_EMAIL_SETTINGS, mockMode: true } }),
    /already finished/
  );
});

// Checkpoint 7 review: no second resume while one runs, a notice that can always be cleared.

const resumeOpts = { actor: 'Ana', clinicName: 'Test Clinic', emailConfig: { ...DEFAULT_EMAIL_SETTINGS, mockMode: true } };

test('a send with news in the last 3 minutes is not resumed (another screen is sending it)', async () => {
  const { repo } = fakeRepo({ emailLog: [stopped({ updatedAt: new Date().toISOString() })] });
  await assert.rejects(runResume(repo, 'pub-1', resumeOpts), /is still being sent/);
});

test('a resume stops when another screen takes the send over', async () => {
  const schedule = makeSchedule({ status: 'PUBLISHED', activeVersionNumber: 2 });
  const version = { id: 'v2', scheduleId: schedule.id, number: 2, timestamp: '2026-10-17T08:00:00.000Z', author: 'Ana', note: '', snapshot: { schedule, assignments: [], leaveEntries: [], locks: [], rulesSnapshot: [] }, isPublished: true };
  const { repo, col } = fakeRepo({ schedules: [schedule], versions: [version], nurses: ['a', 'b', 'c', 'd', 'e'].map((id) => makeNurse(id)), emailLog: [stopped()] });
  let emailed = 0;
  await runResume(repo, 'pub-1', {
    ...resumeOpts,
    onProgress: () => {
      emailed++;
      // Another screen claims the send after the first email.
      if (emailed === 1) col('emailLog').set('pub-1', { ...col('emailLog').get('pub-1'), claim: 'someone-else' });
    },
  });
  assert.equal(emailed, 1, 'only the first email went from this screen');
});

test('a send with nobody left who can be emailed is recorded as finished', async () => {
  const schedule = makeSchedule({ status: 'PUBLISHED', activeVersionNumber: 2 });
  const version = { id: 'v2', scheduleId: schedule.id, number: 2, timestamp: '2026-10-17T08:00:00.000Z', author: 'Ana', note: '', snapshot: { schedule, assignments: [], leaveEntries: [], locks: [], rulesSnapshot: [] }, isPublished: true };
  const nurses = [makeNurse('a'), makeNurse('b'), makeNurse('c', { active: false }), makeNurse('d', { gmail: '' })];
  const { repo, col } = fakeRepo({ schedules: [schedule], versions: [version], nurses, emailLog: [stopped()] });
  const result = await runResume(repo, 'pub-1', resumeOpts);
  assert.equal(result.sent, 0);
  assert.notEqual(col('emailLog').get('pub-1').status, 'SENDING');
  assert.equal([...col('audit').values()].length, 1);
});

test('a send whose version or roster was deleted is closed, not left stopped', async () => {
  const { repo, col } = fakeRepo({ nurses: ['a', 'b', 'c', 'd', 'e'].map((id) => makeNurse(id)), emailLog: [stopped()] });
  const result = await runResume(repo, 'pub-1', resumeOpts);
  const log = col('emailLog').get('pub-1');
  assert.equal(result.sent, 0);
  assert.equal(log.status, 'PARTIAL');
  assert.match(log.recipients.find((r: any) => r.nurseId === 'd').errorMessage, /deleted/);
});
