import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hoursDisplay, rowViewsOf } from '../../src/components/workbook/grid/GridRow';
import { dayTotalsOf } from '../../src/components/workbook/grid/dayTotals';
import type { CellView } from '../../src/components/workbook/grid/cellView';
import type { Assignment, DoctorSession, Nurse, SeniorityLevel } from '../../src/types';

// The roster grid's rows and day totals (UI overhaul Phase 3, slice 3): worked out once per
// change, and a row is drawn again only when its cells, hours or problems change.

test('the hours line says how far a nurse is from their goal', () => {
  const short = hoursDisplay(64, 80, 80);
  assert.equal(short.hoursLine, '64 / 80 h · 16 h short');
  assert.equal(short.tone, 'short');
  assert.equal(short.fillPercent, 80);
  assert.equal(short.overShare, 0);

  const onGoal = hoursDisplay(81.5, 80, 102);
  assert.equal(onGoal.hoursLine, '81.5 / 80 h · 1.5 h over');
  assert.equal(onGoal.tone, 'ok', 'within about 2 h of the goal');

  const over = hoursDisplay(100, 80, 125);
  assert.equal(over.tone, 'over');
  assert.equal(over.overShare, 0.2);
  assert.equal(over.fillPercent, 80);

  const noGoal = hoursDisplay(12, 0, 0);
  assert.equal(noGoal.hoursLine, '12 h');
  assert.equal(noGoal.hoursNote, '');
  assert.equal(noGoal.tone, 'none');
});

const view = (key: string, extra: Partial<CellView> = {}) => ({ key, content: 'empty', ...extra }) as CellView;

test('a row keeps its list of cells while none of its cells changed', () => {
  const a1 = view('amy|d1');
  const a2 = view('amy|d2');
  const m1 = view('mary|d1');
  const m2 = view('mary|d2');
  const first = rowViewsOf(new Map([[a1.key, a1], [a2.key, a2], [m1.key, m1], [m2.key, m2]]), ['amy', 'mary'], ['d1', 'd2']);
  assert.deepEqual(first.get('amy'), [a1, a2]);

  const m2Changed = view('mary|d2', { content: 'shift' });
  const second = rowViewsOf(new Map([[a1.key, a1], [a2.key, a2], [m1.key, m1], [m2Changed.key, m2Changed]]), ['amy', 'mary'], ['d1', 'd2'], first);
  assert.equal(second.get('amy'), first.get('amy'), "Amy's row is the same list");
  assert.notEqual(second.get('mary'), first.get('mary'));
  assert.deepEqual(second.get('mary'), [m1, m2Changed]);
});

test('day totals count doctors, nurses on duty, hours without a free nurse and a senior nurse', () => {
  const nurses = [
    { id: 'amy', seniorityLevelId: 'sen' },
    { id: 'mary', seniorityLevelId: 'jun' },
  ] as Nurse[];
  const levels = [
    { id: 'sen', isSenior: true },
    { id: 'jun', isSenior: false },
  ] as SeniorityLevel[];
  const shift = (nurseId: string, date: string) => ({ nurseId, date }) as Assignment;
  const assignments = [shift('amy', '2026-11-16'), shift('amy', '2026-11-16'), shift('mary', '2026-11-16'), shift('mary', '2026-11-17')];
  const sessions = [{ id: 's1', doctorId: 'lee', date: '2026-11-16', startTime: '09:00', endTime: '13:00' }] as unknown as DoctorSession[];
  const coverage = { '2026-11-16': { '09:00': { deficit: 0 }, '17:00': { deficit: 1 }, '18:00': { deficit: 2 } } };
  const totals = dayTotalsOf(['2026-11-16', '2026-11-17', '2026-11-18'], assignments, sessions, nurses, levels, coverage as never);

  assert.deepEqual(totals.get('2026-11-16'), { doctors: 1, nurses: 2, gapHours: 2, hasSenior: true });
  assert.deepEqual(totals.get('2026-11-17'), { doctors: 0, nurses: 1, gapHours: undefined, hasSenior: false });
  assert.deepEqual(totals.get('2026-11-18'), { doctors: 0, nurses: 0, gapHours: undefined, hasSenior: false });

  const noLevels = dayTotalsOf(['2026-11-16'], assignments, sessions, nurses, [], coverage as never);
  assert.equal(noLevels.get('2026-11-16')?.hasSenior, undefined, 'unknown without senior levels');
});
