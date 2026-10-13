import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withProblemCount } from '../../src/services/dashboard/problemCount';
import { samePeople } from '../../src/services/presence/presenceRules';
import type { ClinicContextState } from '../../src/types/navigation';
import type { PresenceRecord } from '../../src/types';

// Fewer redraws of the roster screen (UI overhaul Phase 3, slice 6): the app frame and the
// "also here" list keep their state when nothing they show has changed, so the screen under
// them is not drawn again for nothing.

const frame = {
  clinicId: 'c1',
  clinicName: 'Test Clinic',
  timezone: 'Asia/Dubai',
  problems: { mustFix: 28, toCheck: 6, notes: 0 },
  activeScheduleId: 'nov',
  activeScheduleName: 'November',
  activeSchedulePeriod: '16-11-2026 to 29-11-2026',
} as unknown as ClinicContextState;

const november = { scheduleId: 'nov', name: 'November', startDate: '2026-11-16', endDate: '2026-11-29', mustFix: 28, toCheck: 6, notes: 0 };

test('the same problem count for the same roster keeps the frame as it is', () => {
  assert.equal(withProblemCount(frame, november), frame);
});

test('a new count, or another roster, changes the frame', () => {
  const fewer = withProblemCount(frame, { ...november, toCheck: 5 });
  assert.notEqual(fewer, frame);
  assert.deepEqual(fewer.problems, { mustFix: 28, toCheck: 5, notes: 0 });
  const december = withProblemCount(frame, { ...november, scheduleId: 'dec', name: 'December', startDate: '2026-12-01', endDate: '2026-12-31' });
  assert.equal(december.activeScheduleName, 'December');
  assert.equal(december.activeSchedulePeriod, '01-12-2026 to 31-12-2026');
  assert.equal(december.clinicName, 'Test Clinic', 'the rest of the frame stays');
});

test('no roster open clears the roster and the count', () => {
  const none = withProblemCount(frame, { scheduleId: '', name: '', startDate: '', endDate: '', mustFix: 0, toCheck: 0, notes: 0 });
  assert.equal(none.activeScheduleId, null);
  assert.equal(none.activeScheduleName, '');
  assert.equal(none.activeSchedulePeriod, '');
  assert.equal(none.problems, null);
  assert.equal(withProblemCount(none, { scheduleId: '', name: '', startDate: '', endDate: '', mustFix: 0, toCheck: 0, notes: 0 }), none);
});

const here = (uid: string, name: string, at = 1000): PresenceRecord =>
  ({ id: `${uid}_tab`, uid, name, email: `${uid}@example.com`, scheduleId: 'nov', at }) as PresenceRecord;

test('the "also here" list counts as the same while the same people are on it', () => {
  // A heartbeat only moves `at`: nothing on screen changes.
  assert.equal(samePeople([here('u1', 'Lina', 1000)], [here('u1', 'Lina', 61000)]), true);
  assert.equal(samePeople([], []), true);
  assert.equal(samePeople([here('u1', 'Lina')], []), false);
  assert.equal(samePeople([here('u1', 'Lina')], [here('u2', 'Omar')]), false);
  assert.equal(samePeople([here('u1', 'Lina')], [here('u1', 'Lina K')]), false, 'a new name shows');
});
