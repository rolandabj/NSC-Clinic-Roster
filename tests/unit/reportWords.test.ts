import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REPORT_TABS,
  barShare,
  differenceWords,
  filterReportRows,
  reportTab,
  statusTone,
  statusWord,
} from '../../src/services/reports/reportWords';

// Reports in plain words (Phase 8): status words in normal case, the difference as hours ahead
// or short, the filters, and the tab the address names.

test('each status has a plain word in normal case and a tone', () => {
  assert.equal(statusWord('OPTIMAL'), 'On goal');
  assert.equal(statusWord('UNDER'), 'A little short');
  assert.equal(statusWord('CRITICAL_UNDER'), 'Very short');
  assert.equal(statusWord('OVER'), 'A little over');
  assert.equal(statusWord('CRITICAL_OVER'), 'Too many hours');
  assert.equal(statusTone('OPTIMAL'), 'success');
  assert.equal(statusTone('UNDER'), 'warning');
  assert.equal(statusTone('CRITICAL_UNDER'), 'danger');
  assert.equal(statusTone('OVER'), 'info');
  assert.equal(statusTone('CRITICAL_OVER'), 'warning');
});

test('the difference reads as hours ahead or short, never OT or DEF', () => {
  assert.equal(differenceWords(12), '12 h ahead');
  assert.equal(differenceWords(-8.5), '8.5 h short');
  assert.equal(differenceWords(0), 'Even');
  assert.equal(differenceWords(0.04), 'Even');
  assert.equal(differenceWords(3.26), '3.3 h ahead');
});

const row = (name: string, code: string, status: string, contract: number, seniority = 's1') =>
  ({ nurse: { fullName: name, employeeCode: code, seniorityLevelId: seniority }, status, contractPercent: contract }) as any;

test('the filters keep the rows that match every choice', () => {
  const rows = [row('Mary Tan', 'N01', 'OPTIMAL', 100), row('Sara Lim', 'N02', 'UNDER', 50, 's2'), row('Ann Koh', 'N03', 'OVER', 100)];
  const all = { search: '', status: 'ALL', seniority: 'ALL', contract: 'ALL' } as const;
  assert.equal(filterReportRows(rows, all).length, 3);
  assert.deepEqual(filterReportRows(rows, { ...all, search: 'sara' }).map((r) => r.nurse.fullName), ['Sara Lim']);
  assert.deepEqual(filterReportRows(rows, { ...all, search: 'n03' }).map((r) => r.nurse.fullName), ['Ann Koh']);
  assert.deepEqual(filterReportRows(rows, { ...all, status: 'UNDER' }).map((r) => r.nurse.fullName), ['Sara Lim']);
  assert.deepEqual(filterReportRows(rows, { ...all, contract: 'FULL' }).map((r) => r.nurse.fullName), ['Mary Tan', 'Ann Koh']);
  assert.deepEqual(filterReportRows(rows, { ...all, contract: 'PART' }).map((r) => r.nurse.fullName), ['Sara Lim']);
  assert.deepEqual(filterReportRows(rows, { ...all, seniority: 's2' }).map((r) => r.nurse.fullName), ['Sara Lim']);
  assert.equal(filterReportRows(rows, { ...all, search: '  ' }).length, 3);
});

test('the address names the open tab; anything else opens Hours', () => {
  assert.deepEqual(REPORT_TABS.map((t) => t.id), ['hours', 'fairness', 'leave']);
  assert.equal(reportTab('fairness'), 'fairness');
  assert.equal(reportTab('leave'), 'leave');
  assert.equal(reportTab(undefined), 'hours');
  assert.equal(reportTab('quotas'), 'hours');
});

test('a bar is its share of the longest, kept between 0 and 100', () => {
  assert.equal(barShare(2, 4), 50);
  assert.equal(barShare(0, 4), 0);
  assert.equal(barShare(3, 0), 0);
  assert.equal(barShare(5, 4), 100);
  assert.equal(barShare(-1, 4), 0);
});
