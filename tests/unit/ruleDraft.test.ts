import test from 'node:test';
import assert from 'node:assert/strict';
import { ruleChanges } from '../../src/services/rules/ruleDraft';
import type { Rule } from '../../src/types';

// Settings, Rules saved only by Save (Phase 8, slice 1c): only the rules that changed are written,
// and only the fields that changed.

const rule = (id: string, over: Partial<Rule> = {}): Rule =>
  ({ id, name: `Rule ${id}`, templateKey: 'MAX_CONSECUTIVE_DAYS', severity: 'HARD', enabled: true, value: 5, params: { thresholdTime: '21:00' }, ...over }) as Rule;

test('nothing changed gives no writes', () => {
  const saved = [rule('a'), rule('b')];
  assert.deepEqual(ruleChanges(saved, saved.map((r) => ({ ...r }))), []);
});

test('each changed rule is written with only its changed fields', () => {
  const saved = [rule('a'), rule('b'), rule('c')];
  const draft = [rule('a', { value: 6 }), rule('b'), rule('c', { enabled: false, severity: 'SOFT', params: { thresholdTime: '20:00' } })];
  assert.deepEqual(ruleChanges(saved, draft), [
    { id: 'a', updates: { value: 6 } },
    { id: 'c', updates: { severity: 'SOFT', enabled: false, params: { thresholdTime: '20:00' } } },
  ]);
});

test('a rule only in the draft or only saved is not written here (added and deleted elsewhere)', () => {
  assert.deepEqual(ruleChanges([rule('a')], [rule('a'), rule('new')]), []);
  assert.deepEqual(ruleChanges([rule('a'), rule('gone')], [rule('a')]), []);
});
