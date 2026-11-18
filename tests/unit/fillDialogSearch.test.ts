import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FillDialog, type FillRunProgress } from '../../src/components/roster/FillDialog';
import type { GenerationPreflightSummary } from '../../src/services/engine/types';

const summary: GenerationPreflightSummary = { scheduleName: 'November', startDate: '2026-11-19', endDate: '2026-12-18',
  totalDays: 30, totalBlocks: 5, activeNursesCount: 13, activeDoctorsCount: 8, doctorSessionsCount: 170,
  bloodCollectionNursesCount: 13, existingLocksCount: 1, existingLeaveDaysCount: 0, estimatedTotalAssignments: 200,
  nurseClinicRuleEnabled: true, nurseClinicRuleSeverity: 'HARD' };
const render = (runProgress?: FillRunProgress, extra: object = {}) => renderToStaticMarkup(React.createElement(FillDialog, {
  mode: 'GENERATE_ALL', summary, assignments: [], fillRange: { enabled: false, start: summary.startDate, end: summary.endDate },
  keepManual: true, clearIncludeManual: false, isGenerating: !!runProgress, progress: runProgress ? {
    currentDay: 1, totalDays: 30, currentDate: summary.startDate, statusText: 'Checking exchanges', percent: 45,
  } : null, runProgress, onCancel: () => {}, onClose: () => {}, onRun: () => {},
  setFillRange: () => {}, setKeepManual: () => {}, setClearIncludeManual: () => {}, onNurseClinicRule: () => {}, ...extra,
}));

test('the fill plan explains the bounded search and automatic final save before starting', () => {
  const html = render();
  assert.match(html, /up to two minutes/i);
  assert.match(html, /Only the final checked result is saved/);
  assert.doesNotMatch(html, /beam|candidate states|worker/i);
});

test('search progress keeps cancellation available and shows useful cover and elapsed time', () => {
  const html = render({ phase: 'searching', elapsedMs: 45000, uncoveredDoctorMinutes: 90 });
  assert.match(html, /Elapsed: 45 seconds/);
  assert.match(html, /Missing doctor cover in the best result: 1 h 30 min/);
  assert.match(html, /Cancel stops the search without saving/);
  assert.match(html, /<button[^>]*>Cancel search<\/button>/);
  assert.doesNotMatch(html.match(/<button[^>]*>Cancel search<\/button>/)?.[0] || '', / disabled=/);
  assert.match(html, /role="progressbar"[^>]*aria-label="Roster search progress"/);
  assert.match(html, /aria-valuenow="45"/);
});

test('a limited search never calls the remaining gap unavoidable', () => {
  const html = render({ phase: 'searching', elapsedMs: 109000, uncoveredDoctorMinutes: 31 * 60, searchLimited: true });
  assert.match(html, /Remaining gaps may still have another solution/);
  assert.doesNotMatch(html, /unavoidable|impossible|proved/i);
});

test('final saving disables cancellation with an explicit reason', () => {
  const html = render({ phase: 'saving', elapsedMs: 112000, uncoveredDoctorMinutes: 0 });
  assert.match(html, /Saving the checked result/);
  assert.match(html, /The search is finished and the final result is being saved/);
  assert.match(html, /<button[^>]*disabled=""[^>]*>Cancel search<\/button>/);
  assert.doesNotMatch(html, /Cancel stops the search without saving/);
});

test('search locks all preflight options and guards repeated cancellation', () => {
  const html = render({ phase: 'validating', elapsedMs: 110000 }, { isCancelling: true });
  assert.match(html, /Cancelling without saving/);
  assert.match(html, /<button[^>]*disabled=""[^>]*>Cancelling<\/button>/);
  assert.match(html, /<fieldset[^>]*disabled=""/);
});

test('fill dates outside the roster cannot start a search', () => {
  const html = render(undefined, { fillRange: { enabled: true, start: '2026-11-18', end: summary.endDate } });
  assert.match(html, /Choose dates within this roster/);
  assert.match(html, /<button[^>]*disabled=""[^>]*>.*?Fill roster<\/button>/);
});
