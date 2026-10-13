import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rosterSteps } from '../../src/components/roster/rosterSteps';

// The roster screen's step bar (Create, Fill, Fix problems, Publish), moved out of the roster
// screen in UI overhaul Phase 3, slice 7. The first step not done is the current one.

const base = { hasRoster: true, shiftCount: 0, mustFix: 0, published: false, hasPublished: false, changedSincePublish: 0 };
const view = (steps: ReturnType<typeof rosterSteps>) => steps.map((s) => `${s.label}${s.done ? ' done' : ''}${s.current ? ' current' : ''}${s.action ? ` [${s.action}]` : ''}`);

test('a new roster with no shifts: fill is next', () => {
  assert.deepEqual(view(rosterSteps(base)), ['Create done', 'Fill current [fillAll]', 'Fix problems [problems]', 'Publish [publish]']);
});

test('a filled roster with problems: fixing them is next, and Fill fills empty cells only', () => {
  assert.deepEqual(view(rosterSteps({ ...base, shiftCount: 40, mustFix: 28 })), [
    'Create done',
    'Filled done [fillEmpty]',
    'Fix problems (28) current [problems]',
    'Publish [publish]',
  ]);
});

test('no problems: publishing is next', () => {
  assert.deepEqual(view(rosterSteps({ ...base, shiftCount: 40 })), ['Create done', 'Filled done [fillEmpty]', 'No problems to fix done [problems]', 'Publish current [publish]']);
});

test('published with changes since: send the changes', () => {
  assert.deepEqual(view(rosterSteps({ ...base, shiftCount: 40, published: true, hasPublished: true, changedSincePublish: 3 })), [
    'Create done',
    'Filled done [fillEmpty]',
    'No problems to fix done [problems]',
    'Send changes (3) current [change]',
  ]);
  assert.deepEqual(view(rosterSteps({ ...base, shiftCount: 40, published: true, hasPublished: true })).at(-1), 'Published done [change]');
});
