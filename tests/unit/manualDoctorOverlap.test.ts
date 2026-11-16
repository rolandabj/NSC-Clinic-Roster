import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Assignment, Doctor, DoctorSession, DutyWindow } from '../../src/types';
import { recordManualDoctorOverlaps, manualDoctorOverlapAllowed, type ManualDoctorOverlapContext } from '../../src/services/engine/manualDoctorOverlap';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { DAY_DUTY, SENIOR, hoursOnlyRules, makeNurse, makeSchedule } from './fixtures';

const date = '2026-11-18';
const doctor = { id: 'doctor', fullName: 'Dr Morgan', active: true, weeklyPattern: [], specialtyIds: [] } as Doctor;
const session = { id: 'session', doctorId: doctor.id, date, startTime: '09:00', endTime: '17:00', source: 'MANUAL', cancelled: false } as DoctorSession;
const nurses = [makeNurse('one'), makeNurse('two'), makeNurse('three')];
const context: ManualDoctorOverlapContext = { nurses, doctors: [doctor], sessions: [session], specialties: [], roles: [], leaveEntries: [], dutyWindows: [DAY_DUTY] };
const shift = (id: string, nurseId: string, startTime = '09:00', endTime = '17:00'): Assignment => ({
  id, nurseId, scheduleId: 'sched-1', date, dutyWindowId: DAY_DUTY.id, kind: 'DOCTOR', doctorId: doctor.id,
  doctorCoverage: [{ doctorId: doctor.id, startTime, endTime }], locked: false, source: 'MANUAL',
});
const now = '2026-11-16T10:00:00Z';
const recorded = (list: Assignment[], edited = list[list.length - 1], ctx = context) =>
  list.map(a => a.id === edited.id ? recordManualDoctorOverlaps(edited, list, ctx, 'planner', now) : a);
const allowed = (list: Assignment[], start = '13:00', end = '17:00', ctx = context, ids = ['one', 'two']) =>
  manualDoctorOverlapAllowed(list, doctor.id, date, start, end, ids, ctx);
const validate = (list: Assignment[], ctx = context) => ScheduleValidator.validate(
  makeSchedule({ startDate: date, endDate: date, hoursTargetFullTime: 8 }), list, ctx.nurses as typeof nurses, [SENIOR],
  ctx.dutyWindows, ctx.sessions, [...ctx.leaveEntries], [...(ctx.locks || [])], ctx.roles, hoursOnlyRules(), [], ctx.specialties, ctx.doctors,
  [], { openTime: '09:00', closeTime: '17:00' }, [...(ctx.availabilityRequests || [])]);

test('a fresh manual save records the exact actual overlap without a reason or approval', () => {
  const list = [shift('first', 'one'), shift('second', 'two', '13:00')];
  const before = JSON.stringify(list);
  const after = recorded(list);
  assert.equal(JSON.stringify(list), before);
  assert.deepEqual(after[1].manualDoctorOverlaps?.map(r => [r.doctorId, r.date, r.startTime, r.endTime, r.nurseIds]),
    [[doctor.id, date, '13:00', '17:00', ['one', 'two']]]);
  assert.equal(after[1].manualDoctorOverlaps?.[0].recordedBy, 'planner');
  assert.equal(after[1].manualDoctorOverlaps?.[0].recordedAt, now);
  assert.equal(allowed(after), true);
  assert.equal(allowed(after, '12:59'), false);
});
test('unrecorded generated and legacy manual overlaps are errors instead of implicit permission', () => {
  for (const source of ['GENERATED', 'MANUAL'] as const) {
    const report = validate([shift('first', 'one'), { ...shift('second', 'two', '13:00'), source }]);
    assert.equal(report.findings.find(f => f.id.startsWith('session-overlap-'))?.severity, 'ERROR');
  }
});
test('recorded manual overlap is Check and its scope is split from any new uncovered permission', () => {
  const after = recorded([shift('first', 'one'), shift('second', 'two', '13:00')]);
  const report = validate(after);
  assert.equal(report.findings.find(f => f.id.startsWith('session-overlap-'))?.severity, 'WARN');
  assert.match(report.findings.find(f => f.id.startsWith('session-overlap-'))!.message, /saved by a planner/);
});
test('changing either member timing, nurse, duty or source invalidates the recorded overlap', () => {
  const after = recorded([shift('first', 'one'), shift('second', 'two', '13:00')]);
  const changes: Partial<Assignment>[] = [
    { doctorCoverage: [{ doctorId: doctor.id, startTime: '09:00', endTime: '16:00' }] },
    { nurseId: 'three' }, { dutyWindowId: 'changed' }, { source: 'GENERATED' }, { id: 'copied' },
  ];
  for (const patch of changes) {
    const list = after.map(a => a.id === 'first' ? { ...a, ...patch } : a);
    assert.equal(allowed(list), false, JSON.stringify(patch));
  }
  assert.equal(allowed(after.map(a => a.id === 'second' ? { ...a, source: 'GENERATED' } : a)), false);
});
test('changed duty and session bounds invalidate legacy recorded cover even when the shift id stays the same', () => {
  const legacy = [shift('first', 'one'), shift('second', 'two')].map(a => ({ ...a, doctorCoverage: undefined }));
  const after = recorded(legacy);
  assert.equal(allowed(after), true);
  const duty = { ...DAY_DUTY, endTime: '16:00' };
  assert.equal(allowed(after, '13:00', '16:00', { ...context, dutyWindows: [duty] }), false);
  assert.equal(allowed(after, '13:00', '16:00', { ...context, sessions: [{ ...session, endTime: '16:00' }] }), false);
});
test('materializing unchanged legacy cover does not invent or lose saved manual intent', () => {
  const legacy = [shift('first', 'one'), shift('second', 'two')].map(a => ({ ...a, doctorCoverage: undefined }));
  const after = recorded(legacy);
  const explicit = after.map(a => ({ ...a, doctorCoverage: [{ doctorId: doctor.id, startTime: '09:00', endTime: '17:00' }] }));
  assert.equal(allowed(explicit), true);
  assert.deepEqual(explicit[1].manualDoctorOverlaps, after[1].manualDoctorOverlaps);
});
test('third nurse cover and removed members cannot inherit a two nurse permission', () => {
  const after = recorded([shift('first', 'one'), shift('second', 'two', '13:00')]);
  assert.equal(allowed([...after, shift('third', 'three', '14:00')], '14:00', '17:00', context, ['one', 'two', 'three']), false);
  assert.equal(allowed(after.slice(1)), false);
  const fresh = recorded([...after, shift('third', 'three', '14:00')]);
  assert.equal(allowed(fresh, '14:00', '17:00', context, ['one', 'two', 'three']), true);
});
test('recording a manual save strips inherited permission when no eligible overlap remains', () => {
  const after = recorded([shift('first', 'one'), shift('second', 'two', '13:00')]);
  const copy = { ...after[1], id: 'copy', date: '2026-11-19' };
  const saved = recordManualDoctorOverlaps(copy, [copy], context, 'planner', now);
  assert.equal(saved.manualDoctorOverlaps, undefined);
  assert.equal(recordManualDoctorOverlaps({ ...copy, source: 'GENERATED' }, [copy], context, 'planner', now).manualDoctorOverlaps, undefined);
});
test('manual overlap provenance never waives clinical eligibility or approved availability', () => {
  const after = recorded([shift('first', 'one'), shift('second', 'two', '13:00')]);
  const denied = { ...context, nurses: [nurses[0], { ...nurses[1], doctorEligibility: { doctorIds: [], specialtyIds: [], reviewedBy: 'lead', reviewedAt: now } }] };
  assert.equal(allowed(after, '13:00', '17:00', denied), false);
  assert.ok(validate(after, denied).findings.some(f => f.severity === 'ERROR' && f.id.startsWith('h8-doctor-allocation-')));
  const absent = { ...context, leaveEntries: [{ id: 'leave', nurseId: 'two', startDate: date, endDate: date, leaveTypeId: 'annual', approved: true, hoursCredited: 8 }] };
  assert.equal(allowed(after, '13:00', '17:00', absent), false);
});
test('an actual handover overlap keeps its note and requires manual provenance', () => {
  const duties: DutyWindow[] = [{ ...DAY_DUTY, id: 'early', endTime: '15:00' }, { ...DAY_DUTY, id: 'late', startTime: '13:00' }];
  const ctx = { ...context, dutyWindows: duties };
  const list = [{ ...shift('first', 'one', '09:00', '15:00'), dutyWindowId: 'early' }, { ...shift('second', 'two', '13:00'), dutyWindowId: 'late' }];
  assert.equal(validate(list, ctx).findings.find(f => f.id.startsWith('session-overlap-'))?.severity, 'ERROR');
  const findings = validate(recorded(list, list[1], ctx), ctx).findings;
  assert.equal(findings.find(f => f.id.startsWith('session-overlap-'))?.severity, 'WARN');
  assert.equal(findings.find(f => f.id.startsWith('session-handover-'))?.severity, 'INFO');
});
test('invalid or copied provenance metadata is ignored safely', () => {
  const list = [shift('first', 'one'), shift('second', 'two', '13:00')];
  for (const raw of [null, {}, [null], [{ startTime: 'bad' }]]) {
    const changed = list.map(a => a.id === 'second' ? { ...a, manualDoctorOverlaps: raw } as Assignment : a);
    assert.doesNotThrow(() => allowed(changed));
    assert.equal(allowed(changed), false);
  }
  const after = recorded(list);
  const third = { ...shift('third', 'three'), manualDoctorOverlaps: after[1].manualDoctorOverlaps };
  assert.equal(allowed([after[0], third]), false);
});
test('a planner can save a pinned manual duty overlap without an extra approval', () => {
  const list = [shift('first', 'one'), { ...shift('pin', 'two', '13:00'), locked: true, source: 'LOCK' as const }];
  const after = recorded(list);
  assert.equal(allowed(after), true);
  assert.equal(validate(after).findings.find(f => f.id.startsWith('session-overlap-'))?.severity, 'WARN');
  const freshAutomaticPin = { ...after[1], id: 'rebuilt-pin' };
  assert.equal(allowed([after[0], freshAutomaticPin]), false);
});
test('only the saved manual interval is Check when a longer overlap remains', () => {
  const after = recorded([shift('first', 'one'), shift('second', 'two', '13:00')]);
  const scoped = after.map(a => a.id === 'second' ? { ...a, manualDoctorOverlaps: a.manualDoctorOverlaps!.map(r => ({ ...r, endTime: '15:00' })) } : a);
  const findings = validate(scoped).findings.filter(f => f.id.startsWith('session-overlap-'));
  assert.deepEqual(findings.map(f => [f.hour, f.severity, f.amount]), [['13:00', 'WARN', 2], ['15:00', 'ERROR', 2]]);
});
