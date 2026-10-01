import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine, resolveRule, LATE_DUTY_RULE_WORDS } from '../../src/services/engine/SchedulingEngine';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';
import type { Rule } from '../../src/types';

const H2_KEYWORDS = ['consecutive duties', 'consecutive working days', 'consecutive days'];

test('max consecutive days does not pick up the late duties rule by name', () => {
  const rules = [
    { id: 'r-s1', name: 'Maximum 3 consecutive duties ending at 21:00', enabled: true } as Rule,
    { id: 'r-h2', name: 'Max consecutive working days', enabled: true } as Rule,
  ];
  assert.equal(resolveRule(rules, 'MAX_CONSECUTIVE_DAYS', undefined, H2_KEYWORDS, LATE_DUTY_RULE_WORDS)?.id, 'r-h2');
});

test('a rule tagged for another template is never matched by name', () => {
  const rules = [
    { id: 'r-s1', name: 'Consecutive duties', templateKey: 'MAX_CONSECUTIVE_LATE_DUTIES', enabled: true } as Rule,
  ];
  assert.equal(resolveRule(rules, 'MAX_CONSECUTIVE_DAYS', undefined, H2_KEYWORDS), undefined);
});

async function generateWeek(extraRules: Rule[]) {
  const result = await SchedulingEngine.generate(
    makeSchedule({ hoursTargetFullTime: 56 }), // 7 days x 8h
    'GENERATE_ALL',
    [],
    [makeNurse('n1')],
    [SENIOR],
    [DAY_DUTY],
    [],
    [],
    [],
    [],
    [],
    [...hoursOnlyRules(), ...extraRules],
    undefined,
    [],
    [],
    [ANNUAL_LEAVE]
  );
  return result.assignments.length;
}

const h2 = (overrides: Partial<Rule>) =>
  ({
    id: 'rule-h2',
    name: 'Max consecutive working days',
    templateKey: 'MAX_CONSECUTIVE_DAYS',
    enabled: true,
    severity: 'HARD',
    value: 6,
    ...overrides,
  }) as unknown as Rule;

test('max consecutive days (HARD, 6) stops the 7th day in a row', async () => {
  assert.equal(await generateWeek([h2({})]), 6);
});

test('max consecutive days switched off is not enforced', async () => {
  assert.equal(await generateWeek([h2({ enabled: false })]), 7);
});

test('max consecutive days set to SOFT is not a hard stop', async () => {
  assert.equal(await generateWeek([h2({ severity: 'SOFT' })]), 7);
});
