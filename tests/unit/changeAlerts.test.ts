import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeScheduleDiff } from '../../src/services/history/diffEngine';
import { DAY_DUTY, makeNurse } from './fixtures';
import type { Assignment, DutyWindow } from '../../src/types';

const LATE: DutyWindow = { ...DAY_DUTY, id: 'duty-l', acronym: 'L', name: 'Late', startTime: '13:00', endTime: '21:00' };
const shift = (nurseId: string, date: string, extra: Partial<Assignment> = {}) =>
  ({ id: `${nurseId}-${date}`, scheduleId: 's', nurseId, date, dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', locked: false, source: 'GENERATED', ...extra }) as Assignment;

// Ids with an underscore used to break the key split.
const nurse = makeNurse('nurse_1');

const diff = (before: Assignment[], after: Assignment[]) =>
  computeScheduleDiff(before, after, [nurse], [DAY_DUTY, LATE], [], [], []);

test("a nurse's changes are listed in date order, and ids with underscores work", () => {
  const before = [shift('nurse_1', '2026-10-09'), shift('nurse_1', '2026-10-05')];
  const after = [shift('nurse_1', '2026-10-09', { dutyWindowId: LATE.id }), shift('nurse_1', '2026-10-05', { dutyWindowId: LATE.id })];
  const d = diff(before, after);
  assert.deepEqual(d.changesByNurse['nurse_1'].map((c) => c.date), ['2026-10-05', '2026-10-09']);
  assert.equal(d.changesByNurse['nurse_1'][0].nurseName, nurse.fullName);
});

test('pinning a shift is not emailed as a change, but still shows when comparing versions', () => {
  const d = diff([shift('nurse_1', '2026-10-05')], [shift('nurse_1', '2026-10-05', { locked: true })]);
  assert.equal(d.changesByNurse['nurse_1'], undefined);
  assert.equal(d.allChanges.length, 1);
});
