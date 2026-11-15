import { test } from 'node:test';
import assert from 'node:assert/strict';
import { futureCapacity, type CapacityJob } from '../../src/services/engine/futureCapacity';

const job = (id: string, date: string, hours: number, nurseIds: string[]): CapacityJob => ({ id, date, hours, nurseIds });

test('shared nurse hours are not counted twice for different specialties', () => {
  const jobs = [job('peds', '2026-12-17', 8, ['mary']), job('ent', '2026-12-18', 8, ['mary'])];
  const capacity = futureCapacity(jobs, new Map([['mary', 8]]));
  assert.equal(capacity.coverableHours, 8);
  assert.equal(capacity.optionalHours('mary'), 0);
});

test('a nurse keeps hours needed on a date when the other eligible nurse is unavailable', () => {
  const jobs = [job('peds', '2026-12-18', 12, ['alaa'])];
  const capacity = futureCapacity(jobs, new Map([['alaa', 12], ['noveline', 210]]));
  assert.equal(capacity.optionalHours('alaa'), 0);
  assert.equal(capacity.optionalHours('noveline'), 210);
});

test('Nurse Clinic and doctor demand compete for the same nurse budget', () => {
  const jobs = [job('peds', '2026-12-17', 12, ['mary']), job('nc', '2026-12-18', 12, ['mary', 'rachel'])];
  const capacity = futureCapacity(jobs, new Map([['mary', 12], ['rachel', 12], ['trainee', 12]]));
  assert.equal(capacity.coverableHours, 24);
  assert.equal(capacity.optionalHours('mary'), 0);
  assert.equal(capacity.optionalHours('rachel'), 0);
  assert.equal(capacity.optionalHours('trainee'), 12);
});

test('one nurse cannot supply two full shifts on the same future date', () => {
  const jobs = [job('peds', '2026-12-18', 12, ['mary']), job('nc', '2026-12-18', 12, ['mary'])];
  const capacity = futureCapacity(jobs, new Map([['mary', 24]]));
  assert.equal(capacity.coverableHours, 12);
  assert.equal(capacity.optionalHours('mary'), 12);
});

test('an impossible specialty does not prevent protecting other achievable coverage', () => {
  const jobs = [job('derma', '2026-12-17', 12, []), job('peds', '2026-12-18', 12, ['alaa'])];
  const capacity = futureCapacity(jobs, new Map([['alaa', 20]]));
  assert.equal(capacity.coverableHours, 12);
  assert.equal(capacity.optionalHours('alaa'), 8);
});

test('redundant capacity is available for optional duties and inputs are not mutated', () => {
  const jobs = [job('peds', '2026-12-18', 12, ['alaa', 'noveline'])];
  const budgets = new Map([['alaa', 20], ['noveline', 12]]);
  const capacity = futureCapacity(jobs, budgets);
  assert.equal(capacity.optionalHours('alaa'), 20);
  assert.equal(capacity.optionalHours('noveline'), 12);
  assert.equal(budgets.get('alaa'), 20);
  assert.deepEqual(jobs[0].nurseIds, ['alaa', 'noveline']);
  // Once Alaa spends optional hours, the next snapshot must protect Noveline.
  assert.equal(futureCapacity(jobs, new Map([['alaa', 0], ['noveline', 12]])).optionalHours('noveline'), 0);
});
