import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countChangedCells, nextRosterNeeded, receiptSummary, todayAtClinic } from '../../src/services/dashboard/dashboardSummary';
import { DAY_DUTY, SENIOR, makeLeave, makeNurse } from './fixtures';
import type { Assignment } from '../../src/types';

const shift = (nurseId: string, date: string, extra: Partial<Assignment> = {}) =>
  ({ id: `${nurseId}-${date}`, scheduleId: 's', nurseId, date, dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', locked: false, source: 'GENERATED', ...extra }) as Assignment;

test('changes since publish: changed, added, removed and pinned cells count once each', () => {
  const before = [shift('a', '2026-10-05'), shift('b', '2026-10-05'), shift('c', '2026-10-05')];
  const now = [shift('a', '2026-10-05'), shift('b', '2026-10-05', { doctorId: 'd1' }), shift('d', '2026-10-05'), shift('c', '2026-10-05', { locked: true })];
  // b changed, c pinned, d added = 3
  assert.equal(countChangedCells(before, now), 3);
  assert.equal(countChangedCells(before, before), 0);
  assert.equal(countChangedCells(before, []), 3);
});

test('today at the clinic: who works, the senior check and who is on leave', () => {
  const nurses = [makeNurse('a', { fullName: 'Ana', seniorityLevelId: SENIOR.id }), makeNurse('b', { fullName: 'Bo', seniorityLevelId: 'staff' }), makeNurse('c', { fullName: 'Cy' })];
  const info = todayAtClinic({
    date: '2026-10-05',
    assignments: [shift('b', '2026-10-05'), shift('a', '2026-10-06'), shift('c', '2026-10-05')],
    nurses,
    dutyWindows: [DAY_DUTY],
    seniorityLevels: [SENIOR],
    leaveEntries: [makeLeave({ nurseId: 'c', startDate: '2026-10-05', endDate: '2026-10-05' })],
    detailOf: () => 'Nurse Clinic',
  });
  // Cy has approved leave that day: listed on leave, not on duty.
  assert.deepEqual(info.onDuty.map((e) => e.name), ['Bo']);
  assert.deepEqual(info.onLeave.map((e) => e.name), ['Cy']);
  assert.equal(info.hasSenior, false);
});

test('read receipts count only the given version', () => {
  const acks = [
    { id: '1', scheduleId: 's', nurseId: 'a', versionId: 'v2', token: 't1', sentAt: '', ackAt: '2026-10-01' },
    { id: '2', scheduleId: 's', nurseId: 'b', versionId: 'v2', token: 't2', sentAt: '' },
    { id: '3', scheduleId: 's', nurseId: 'c', versionId: 'v1', token: 't3', sentAt: '' },
  ];
  assert.deepEqual(receiptSummary(acks, 'v2'), { sent: 2, confirmed: 1, waitingNurseIds: ['b'] });
});

test('the next roster is asked for only when the last one ends within three weeks', () => {
  const rosters = [{ startDate: '2026-10-01', endDate: '2026-10-31' }];
  assert.deepEqual(nextRosterNeeded(rosters, '2026-10-15'), { from: '2026-11-01' });
  assert.equal(nextRosterNeeded(rosters, '2026-10-03'), null);
  assert.equal(nextRosterNeeded([], '2026-10-15'), null);
});

test('the next roster never starts in the past, and archived rosters are ignored', () => {
  assert.deepEqual(nextRosterNeeded([{ startDate: '2026-06-01', endDate: '2026-06-30' }], '2026-10-15'), { from: '2026-10-15' });
  assert.deepEqual(
    nextRosterNeeded(
      [
        { startDate: '2026-10-01', endDate: '2026-10-31' },
        { startDate: '2026-11-01', endDate: '2026-11-30', status: 'ARCHIVED' },
      ],
      '2026-10-15'
    ),
    { from: '2026-11-01' }
  );
});

test('a nurse with two shifts shows twice, and inactive nurses are left out', () => {
  const late = { ...DAY_DUTY, id: 'late', acronym: 'L', startTime: '13:00', endTime: '21:00' };
  const info = todayAtClinic({
    date: '2026-10-05',
    assignments: [shift('a', '2026-10-05', { dutyWindowId: 'late' }), shift('a', '2026-10-05'), shift('x', '2026-10-05')],
    nurses: [makeNurse('a', { fullName: 'Ana' }), makeNurse('x', { fullName: 'Xi', active: false })],
    dutyWindows: [DAY_DUTY, late],
    seniorityLevels: [SENIOR],
    leaveEntries: [],
    detailOf: () => '',
  });
  assert.deepEqual(info.onDuty.map((e) => `${e.name} ${e.acronym}`), [`Ana ${DAY_DUTY.acronym}`, 'Ana L']);
});
