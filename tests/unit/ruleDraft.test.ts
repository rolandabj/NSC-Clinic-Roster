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

// Checkpoint 8 review: a new copy of the saved rules (after a list tab saves, Add missing rules,
// Delete, or a save that failed partway) keeps the changes the draft made.
import { rebaseRules } from '../../src/services/rules/ruleDraft';

test('a reload keeps the draft’s changes, adds new rules and drops deleted ones', () => {
  const before = [rule('a'), rule('b'), rule('c')];
  const draft = [rule('a', { value: 9 }), rule('b'), rule('c', { enabled: false })];
  const after = [rule('a'), rule('b', { name: 'Renamed' }), rule('d')];
  const next = rebaseRules(before, draft, after);
  assert.deepEqual(next.map((r) => r.id), ['a', 'b', 'd']);
  assert.equal(next[0].value, 9, 'the unsaved change to a stays');
  assert.equal(next[1].name, 'Renamed', 'b had no change, so it takes the saved copy');
  assert.deepEqual(ruleChanges(after, next), [{ id: 'a', updates: { value: 9 } }]);
});

test('a save that failed partway keeps what was not saved', () => {
  const before = [rule('a'), rule('b')];
  const draft = [rule('a', { value: 9 }), rule('b', { value: 7 })];
  const fresh = [rule('a', { value: 9 }), rule('b')];
  const next = rebaseRules(before, draft, fresh);
  assert.deepEqual(ruleChanges(fresh, next), [{ id: 'b', updates: { value: 7 } }]);
});
