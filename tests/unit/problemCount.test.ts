import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { problemCountWords, withProblemCount } from '../../src/services/dashboard/problemCount';
import { ProblemCounts } from '../../src/components/ui';
import type { ClinicContextState } from '../../src/types/navigation';

// One problem count everywhere (UI overhaul Phase 4, slice 1): the approved form is
// "2 must fix · 2 to check · 1 note", each kind with its own icon and word. The top bar, the
// steps, the Problems tab, the status bar under the grid and the Problems panel used four
// different counts (34, 28, 34 and "28 must fix · 6 to check").

test('the count in words leaves out the kinds with none', () => {
  assert.equal(problemCountWords({ mustFix: 28, toCheck: 6, notes: 3 }), '28 must fix · 6 to check · 3 notes');
  assert.equal(problemCountWords({ mustFix: 2, toCheck: 2, notes: 1 }), '2 must fix · 2 to check · 1 note');
  assert.equal(problemCountWords({ mustFix: 0, toCheck: 1, notes: 0 }), '1 to check');
  assert.equal(problemCountWords({ mustFix: 0, toCheck: 0, notes: 0 }), 'No problems');
});

const frame = {
  clinicName: 'Test Clinic',
  timezone: 'Asia/Dubai',
  problems: null,
  activeScheduleId: null,
  activeScheduleName: '',
  activeSchedulePeriod: '',
} as unknown as ClinicContextState;
const november = { scheduleId: 'nov', name: 'November', startDate: '2026-11-16', endDate: '2026-11-29', mustFix: 28, toCheck: 6, notes: 3 };

test('the frame knows no count until a screen has checked the roster', () => {
  assert.equal(frame.problems, null);
  const known = withProblemCount(frame, november);
  assert.deepEqual(known.problems, { mustFix: 28, toCheck: 6, notes: 3 });
  assert.equal(known.activeSchedulePeriod, '16-11-2026 to 29-11-2026');
  assert.equal(withProblemCount(known, november), known, 'the same count keeps the frame');
  assert.notEqual(withProblemCount(known, { ...november, notes: 4 }), known, 'a new note changes it');
});

test('no roster open: no count', () => {
  const known = withProblemCount(frame, november);
  const none = withProblemCount(known, { scheduleId: '', name: '', startDate: '', endDate: '', mustFix: 0, toCheck: 0, notes: 0 });
  assert.equal(none.problems, null);
  assert.equal(none.activeScheduleId, null);
});

test('the count is shown with each kind\'s icon and word, and read out in full', () => {
  const html = renderToStaticMarkup(React.createElement(ProblemCounts, { mustFix: 28, toCheck: 6, notes: 3 }));
  assert.match(html, />28 must fix</);
  assert.match(html, />6 to check</);
  assert.match(html, />3 notes</);
  assert.equal((html.match(/<svg/g) || []).length, 3, 'one icon for each kind');
  assert.equal((html.match(/aria-hidden="true"/g) || []).length, 3, 'the icons are not read out');

  // Short form (a phone's top bar): the numbers show, the words are still read out.
  const short = renderToStaticMarkup(React.createElement(ProblemCounts, { mustFix: 28, toCheck: 6, notes: 0, wordsFrom: 'md' }));
  assert.match(short, /28<span class="sr-only md:not-sr-only"> must fix<\/span>/);
  assert.doesNotMatch(short, /note/);

  assert.match(renderToStaticMarkup(React.createElement(ProblemCounts, { mustFix: 0, toCheck: 0, notes: 0 })), />No problems</);
});
