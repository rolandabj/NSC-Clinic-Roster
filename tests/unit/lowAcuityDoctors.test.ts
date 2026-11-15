import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SchedulingEngine } from '../../src/services/engine/SchedulingEngine';
import { ScheduleValidator } from '../../src/services/validation/ScheduleValidator';
import { checkAssignment } from '../../src/services/engine/assignmentChecks';
import { outsideNurseList } from '../../src/services/engine/nurseList';
import { assignmentCoversDoctor, assignmentDoctorIds, isFreeDuring } from '../../src/services/engine/clinicModel';
import { summarizeNurseHours } from '../../src/services/reports/hoursAccounting';
import { filterDoctors } from '../../src/services/doctors/doctorForm';
import { cellLookupsOf, cellViewOf } from '../../src/components/workbook/grid/cellView';
import { shiftDetail } from '../../src/services/publish/nurseRosterService';
import { countChangedCells } from '../../src/services/dashboard/dashboardSummary';
import { computeScheduleDiff } from '../../src/services/history/diffEngine';
import { buildRosterAnalysis, problemRule } from '../../src/services/export/analysisExportService';
import { ANNUAL_LEAVE, DAY_DUTY, SENIOR, hoursOnlyRules, makeLock, makeNurse, makeSchedule } from './fixtures';
import type { Assignment, ClinicalRole, Doctor, DoctorSession, DutyWindow, Specialty } from '../../src/types';

const EARLY_DUTY: DutyWindow = {
  id: 'duty-e',
  name: 'Early',
  acronym: 'E',
  startTime: '09:00',
  endTime: '13:00',
  color: '#0e7490',
  active: true,
};

const EXTENDED_DUTY: DutyWindow = {
  id: 'duty-x',
  name: 'Extended',
  acronym: 'X',
  startTime: '09:00',
  endTime: '19:00',
  color: '#7c3aed',
  active: true,
};

const CARD: Specialty = { id: 'sp-card', name: 'Cardiology', code: 'CARD' } as Specialty;
const DERM: Specialty = { id: 'sp-derm', name: 'Dermatology', code: 'DERM' } as Specialty;
const NC_ROLE: ClinicalRole = {
  id: 'role-nurse-clinic',
  name: 'Nurse Clinic',
  acronym: 'NC',
  description: 'Free nurse',
  defaultDailyQuota: 1,
};
const PHL_ROLE: ClinicalRole = {
  id: 'role-phl',
  name: 'Blood Collection',
  acronym: 'PHL',
  description: 'Phlebotomy',
  defaultDailyQuota: 0,
};

const DR_LEE: Doctor = {
  id: 'doc-lee',
  fullName: 'Dr Lee',
  specialtyIds: [CARD.id],
  weeklyPattern: [],
  lowAcuity: true,
  active: true,
} as Doctor;

const DR_PATEL: Doctor = {
  id: 'doc-patel',
  fullName: 'Dr Patel',
  specialtyIds: [CARD.id],
  weeklyPattern: [],
  lowAcuity: true,
  active: true,
} as Doctor;

const DR_OMAR: Doctor = {
  id: 'doc-omar',
  fullName: 'Dr Omar',
  specialtyIds: [CARD.id],
  weeklyPattern: [],
  lowAcuity: true,
  active: true,
} as Doctor;

const DR_RAY_NORMAL: Doctor = {
  id: 'doc-ray',
  fullName: 'Dr Ray',
  specialtyIds: [CARD.id],
  weeklyPattern: [],
  lowAcuity: false,
  active: true,
} as Doctor;

const DR_SKIN_LOW: Doctor = {
  id: 'doc-skin',
  fullName: 'Dr Skin',
  specialtyIds: [DERM.id],
  weeklyPattern: [],
  lowAcuity: true,
  active: true,
} as Doctor;

const makeSession = (
  id: string,
  doctorId: string,
  date: string,
  startTime = '09:00',
  endTime = '17:00',
  specialtyId = CARD.id
): DoctorSession =>
  ({
    id,
    doctorId,
    date,
    startTime,
    endTime,
    specialtyId,
    source: 'PATTERN',
    cancelled: false,
  }) as DoctorSession;

test('engine automatically pairs two low acuity doctors on the same day onto one nurse and counts shift hours once', async () => {
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-05', hoursTargetFullTime: 8 });
  const amy = makeNurse('amy', {
    fullName: 'Amy',
    preferences: [{ kind: 'SPECIALTY', refId: CARD.id, rank: 1 }],
  });
  const sessions = [
    makeSession('s-lee', DR_LEE.id, '2026-10-05', '09:00', '17:00'),
    makeSession('s-patel', DR_PATEL.id, '2026-10-05', '09:00', '17:00'),
  ];
  const duties = [DAY_DUTY];
  const rules = hoursOnlyRules();
  const doctors = [DR_LEE, DR_PATEL];

  const res = await SchedulingEngine.generate(
    schedule,
    'GENERATE_ALL',
    [],
    [amy],
    [SENIOR],
    duties,
    [],
    [CARD],
    sessions,
    [],
    [],
    rules,
    undefined,
    [],
    doctors,
    []
  );

  assert.equal(res.assignments.length, 1);
  const shift = res.assignments[0];
  assert.equal(shift.nurseId, 'amy');
  assert.equal(shift.kind, 'DOCTOR');
  assert.deepEqual(new Set(assignmentDoctorIds(shift)), new Set([DR_LEE.id, DR_PATEL.id]));
  assert.ok(assignmentCoversDoctor(shift, DR_LEE.id));
  assert.ok(assignmentCoversDoctor(shift, DR_PATEL.id));

  const dutyMap = new Map(duties.map((d) => [d.id, d]));
  const hours = summarizeNurseHours(amy, schedule, res.assignments, dutyMap, [], []);
  assert.equal(hours.dutyHours, 8);
  assert.equal(hours.totalHours, 8);

  const report = ScheduleValidator.validate(
    schedule,
    res.assignments,
    [amy],
    [SENIOR],
    duties,
    sessions,
    [],
    [],
    [],
    rules,
    [],
    [CARD],
    doctors,
    []
  );
  assert.equal(report.errorCount, 0, report.findings.map((f) => `${f.id}: ${f.message}`).join('; '));
});

test('engine widens a shift to cover two staggered low acuity clinics on the same day', async () => {
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-05', hoursTargetFullTime: 8 });
  const amy = makeNurse('amy', {
    fullName: 'Amy',
    preferences: [{ kind: 'SPECIALTY', refId: CARD.id, rank: 1 }],
  });
  const ben = makeNurse('ben', {
    fullName: 'Ben',
    preferences: [{ kind: 'SPECIALTY', refId: CARD.id, rank: 1 }],
  });
  const sessions = [
    makeSession('s-lee', DR_LEE.id, '2026-10-05', '09:00', '13:00'),
    makeSession('s-patel', DR_PATEL.id, '2026-10-05', '13:00', '17:00'),
  ];
  const duties = [EARLY_DUTY, DAY_DUTY];
  const rules = hoursOnlyRules();
  const doctors = [DR_LEE, DR_PATEL];

  const res = await SchedulingEngine.generate(
    schedule,
    'GENERATE_ALL',
    [],
    [amy, ben],
    [SENIOR],
    duties,
    [],
    [CARD],
    sessions,
    [],
    [],
    rules,
    undefined,
    [],
    doctors,
    []
  );

  const docShifts = res.assignments.filter((a) => a.kind === 'DOCTOR');
  assert.equal(docShifts.length, 1);
  assert.equal(docShifts[0].dutyWindowId, DAY_DUTY.id);
  assert.deepEqual(new Set(assignmentDoctorIds(docShifts[0])), new Set([DR_LEE.id, DR_PATEL.id]));
});

test('engine caps low acuity pairing at two doctors per nurse and never pairs a normal doctor with a low acuity doctor', async () => {
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-05', hoursTargetFullTime: 8 });
  const amy = makeNurse('amy', { fullName: 'Amy' });
  const ben = makeNurse('ben', { fullName: 'Ben' });
  const cara = makeNurse('cara', { fullName: 'Cara' });
  const rules = hoursOnlyRules();

  // Three low acuity doctors: at most two share one nurse, the third gets another nurse.
  const threeLowSessions = [
    makeSession('s1', DR_LEE.id, '2026-10-05'),
    makeSession('s2', DR_PATEL.id, '2026-10-05'),
    makeSession('s3', DR_OMAR.id, '2026-10-05'),
  ];
  const resThree = await SchedulingEngine.generate(
    schedule,
    'GENERATE_ALL',
    [],
    [amy, ben, cara],
    [SENIOR],
    [DAY_DUTY],
    [],
    [CARD],
    threeLowSessions,
    [],
    [],
    rules,
    undefined,
    [],
    [DR_LEE, DR_PATEL, DR_OMAR],
    []
  );
  const threeDocShifts = resThree.assignments.filter((a) => a.kind === 'DOCTOR');
  assert.equal(threeDocShifts.length, 2);
  const counts = threeDocShifts.map((a) => assignmentDoctorIds(a).length).sort();
  assert.deepEqual(counts, [1, 2]);

  // One normal doctor and one low acuity doctor: must use two separate nurses.
  const mixedSessions = [
    makeSession('m1', DR_RAY_NORMAL.id, '2026-10-05'),
    makeSession('m2', DR_LEE.id, '2026-10-05'),
  ];
  const resMixed = await SchedulingEngine.generate(
    schedule,
    'GENERATE_ALL',
    [],
    [amy, ben],
    [SENIOR],
    [DAY_DUTY],
    [],
    [CARD],
    mixedSessions,
    [],
    [],
    rules,
    undefined,
    [],
    [DR_RAY_NORMAL, DR_LEE],
    []
  );
  const mixedDocShifts = resMixed.assignments.filter((a) => a.kind === 'DOCTOR');
  assert.equal(mixedDocShifts.length, 2);
  for (const s of mixedDocShifts) {
    assert.equal(s.secondDoctorId, undefined);
  }
});

test('pinned shift with secondTargetRefId materializes secondDoctorId and covers both low acuity doctors', async () => {
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-05', hoursTargetFullTime: 8 });
  const amy = makeNurse('amy', { fullName: 'Amy' });
  const lock = makeLock('amy', '2026-10-05', {
    dutyWindowId: DAY_DUTY.id,
    assignmentKind: 'DOCTOR',
    targetRefId: DR_LEE.id,
    secondTargetRefId: DR_PATEL.id,
  });
  const sessions = [
    makeSession('s1', DR_LEE.id, '2026-10-05'),
    makeSession('s2', DR_PATEL.id, '2026-10-05'),
  ];
  const rules = hoursOnlyRules();
  const res = await SchedulingEngine.generate(
    schedule,
    'GENERATE_ALL',
    [],
    [amy],
    [SENIOR],
    [DAY_DUTY],
    [],
    [CARD],
    sessions,
    [lock],
    [],
    rules,
    undefined,
    [],
    [DR_LEE, DR_PATEL],
    []
  );

  assert.equal(res.assignments.length, 1);
  assert.equal(res.assignments[0].locked, true);
  assert.equal(res.assignments[0].doctorId, DR_LEE.id);
  assert.equal(res.assignments[0].secondDoctorId, DR_PATEL.id);
  assert.equal(res.unmetSlotsCount, 0);
});

test('isFreeDuring treats a paired nurse as busy during either doctor session and free outside both', () => {
  const sessions = [
    makeSession('s-lee', DR_LEE.id, '2026-10-05', '09:00', '13:00'),
    makeSession('s-patel', DR_PATEL.id, '2026-10-05', '13:00', '17:00'),
  ];
  const paired: Assignment = {
    id: 'a1',
    scheduleId: 'sched-1',
    nurseId: 'amy',
    date: '2026-10-05',
    dutyWindowId: EXTENDED_DUTY.id,
    kind: 'DOCTOR',
    doctorId: DR_LEE.id,
    secondDoctorId: DR_PATEL.id,
    locked: false,
    source: 'GENERATED',
  };

  assert.equal(isFreeDuring(paired, EXTENDED_DUTY, sessions, '09:00', '10:00'), false);
  assert.equal(isFreeDuring(paired, EXTENDED_DUTY, sessions, '14:00', '15:00'), false);
  assert.equal(isFreeDuring(paired, EXTENDED_DUTY, sessions, '17:00', '19:00'), true);
});

test('strict nurse list, checkAssignment and ScheduleValidator enforce low acuity pairing rules', () => {
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-05', hoursTargetFullTime: 8 });
  const amy = makeNurse('amy', {
    fullName: 'Amy',
    capabilityIds: [NC_ROLE.id, PHL_ROLE.id],
    preferences: [{ kind: 'SPECIALTY', refId: CARD.id, rank: 1 }],
  });
  const doctors = [DR_LEE, DR_PATEL, DR_RAY_NORMAL, DR_SKIN_LOW];
  const specialties = [CARD, DERM];

  // H8 check: Dr Lee (Cardiology) is on Amy's list, Dr Skin (Dermatology) is not.
  const listMismatchCell: Assignment = {
    id: 'a-list',
    scheduleId: schedule.id,
    nurseId: amy.id,
    date: '2026-10-05',
    dutyWindowId: DAY_DUTY.id,
    kind: 'DOCTOR',
    doctorId: DR_LEE.id,
    secondDoctorId: DR_SKIN_LOW.id,
    locked: false,
    source: 'MANUAL',
  };
  const h8 = outsideNurseList(amy, listMismatchCell, { doctors, specialties, sessions: [] });
  assert.ok(h8 && h8.name.includes('Dr Skin'));

  const validPairCell: Assignment = {
    ...listMismatchCell,
    id: 'a-ok',
    secondDoctorId: DR_PATEL.id,
  };
  assert.equal(outsideNurseList(amy, validPairCell, { doctors, specialties, sessions: [] }), null);

  const baseCtx = {
    assignments: [validPairCell],
    nurses: [amy],
    dutyWindows: [DAY_DUTY],
    leaveEntries: [],
    locks: [],
    roles: [NC_ROLE, PHL_ROLE],
    rules: hoursOnlyRules(),
    doctors,
  };
  assert.deepEqual(checkAssignment(baseCtx, validPairCell), []);

  // Duplicate doctor is rejected.
  const duplicateCell: Assignment = { ...validPairCell, secondDoctorId: DR_LEE.id };
  const dupReasons = checkAssignment({ ...baseCtx, assignments: [duplicateCell] }, duplicateCell);
  assert.ok(dupReasons.some((r) => r.includes('same doctor twice')));

  // Normal doctor paired with low acuity doctor is rejected by checkAssignment and ScheduleValidator.
  const nonLowCell: Assignment = { ...validPairCell, secondDoctorId: DR_RAY_NORMAL.id };
  const nonLowReasons = checkAssignment({ ...baseCtx, assignments: [nonLowCell] }, nonLowCell);
  assert.ok(nonLowReasons.some((r) => r.includes('is not marked as low acuity')));

  const sessions = [
    makeSession('s1', DR_LEE.id, '2026-10-05'),
    makeSession('s2', DR_RAY_NORMAL.id, '2026-10-05'),
  ];
  const report = ScheduleValidator.validate(
    schedule,
    [nonLowCell],
    [amy],
    [SENIOR],
    [DAY_DUTY],
    sessions,
    [],
    [],
    [NC_ROLE, PHL_ROLE],
    hoursOnlyRules(),
    [],
    specialties,
    doctors,
    []
  );
  const pairError = report.findings.find((f) => f.id.startsWith('low-acuity-pair-'));
  assert.ok(pairError, 'expected low-acuity-pair finding');
  assert.equal(pairError.severity, 'ERROR');
});

test('grid view, nurse detail, diff, dashboard and analysis export handle low acuity pairs', () => {
  const doctors = [DR_LEE, DR_PATEL, DR_RAY_NORMAL, DR_SKIN_LOW];
  const specialties = [CARD, DERM];

  // Doctor search finds low acuity profiles.
  const lowFound = filterDoctors(doctors, { query: 'low acuity', specialtyId: 'ALL', status: 'ALL' });
  assert.deepEqual(
    lowFound.map((d) => d.id),
    [DR_LEE.id, DR_PATEL.id, DR_SKIN_LOW.id]
  );

  const amy = makeNurse('amy', {
    fullName: 'Amy',
    preferences: [
      { kind: 'DOCTOR', refId: DR_LEE.id, rank: 1 },
      { kind: 'DOCTOR', refId: DR_PATEL.id, rank: 2 },
    ],
  });
  const baseAsgn: Assignment = {
    id: 'a1',
    scheduleId: 'sched-1',
    nurseId: amy.id,
    date: '2026-10-05',
    dutyWindowId: DAY_DUTY.id,
    kind: 'DOCTOR',
    doctorId: DR_LEE.id,
    locked: false,
    source: 'GENERATED',
  };
  const pairedAsgn: Assignment = {
    ...baseAsgn,
    secondDoctorId: DR_PATEL.id,
  };

  // Grid cell formatting and rank badge.
  const lookups = cellLookupsOf({
    dutyWindows: [DAY_DUTY],
    doctors,
    roles: [],
    specialties,
    leaveTypes: [ANNUAL_LEAVE],
  });
  const view = cellViewOf(
    {
      nurse: amy,
      day: { dateStr: '2026-10-05', isWeekend: false, isToday: false },
      assignment: pairedAsgn,
      problems: [],
    },
    lookups
  );
  assert.equal(view.label, 'Lee + Patel');
  assert.equal(view.rankBadge, '#2');
  assert.equal(view.mismatch, false);
  assert.ok(view.title.includes('With Dr Lee and Dr Patel'));

  const mismatchView = cellViewOf(
    {
      nurse: amy,
      day: { dateStr: '2026-10-05', isWeekend: false, isToday: false },
      assignment: { ...baseAsgn, secondDoctorId: DR_SKIN_LOW.id },
      problems: [],
    },
    lookups
  );
  assert.equal(mismatchView.mismatch, true);
  assert.equal(mismatchView.rankBadge, '!');

  // Published nurse wording.
  assert.equal(shiftDetail(pairedAsgn, { doctors, clinicalRoles: [], specialties }), 'With Dr Lee and Dr Patel');

  // Dashboard changed cell count and version diff detect secondDoctorId changes.
  assert.equal(countChangedCells([baseAsgn], [pairedAsgn]), 1);
  const diff = computeScheduleDiff([baseAsgn], [pairedAsgn], [amy], [DAY_DUTY], doctors, [], specialties);
  assert.equal(diff.modifiedCount, 1);
  assert.equal(diff.allChanges[0].after?.targetName, 'Dr Lee + Dr Patel');

  // Analysis JSON export records both doctors and low acuity metadata.
  const schedule = makeSchedule({ startDate: '2026-10-05', endDate: '2026-10-05', hoursTargetFullTime: 8 });
  const sessions = [
    makeSession('s1', DR_LEE.id, '2026-10-05'),
    makeSession('s2', DR_PATEL.id, '2026-10-05'),
  ];
  const analysis = buildRosterAnalysis({
    clinicName: 'NSC Clinic',
    schedule,
    assignments: [pairedAsgn],
    nurses: [amy],
    dutyWindows: [DAY_DUTY],
    leaveEntries: [],
    leaveTypes: [ANNUAL_LEAVE],
    seniorityLevels: [SENIOR],
    doctors: [DR_LEE, DR_PATEL],
    sessions,
    roles: [],
    specialties: [CARD],
    rules: hoursOnlyRules(),
    locks: [
      makeLock(amy.id, '2026-10-05', {
        assignmentKind: 'DOCTOR',
        targetRefId: DR_LEE.id,
        secondTargetRefId: DR_PATEL.id,
      }),
    ],
    availabilityRequests: [],
    clinicSetup: { holidayDates: [] },
    exportedAt: '2026-10-05T00:00:00.000Z',
  });
  assert.equal(analysis.shifts[0].doctor, 'Dr Lee');
  assert.equal(analysis.shifts[0].secondDoctor, 'Dr Patel');
  assert.equal(analysis.shifts[0].secondDoctorId, DR_PATEL.id);
  assert.equal(analysis.pinnedDays[0].secondTarget, 'Dr Patel');
  assert.equal(analysis.days[0].doctorSessions.every((ds) => ds.nurses.some((n) => n.nurseId === amy.id)), true);
  assert.equal(analysis.doctors.find((d) => d.id === DR_LEE.id)?.lowAcuity, true);
  assert.equal(analysis.doctors.find((d) => d.id === DR_PATEL.id)?.nursesWorkedWith.Amy, 1);
  assert.equal(problemRule('low-acuity-pair-amy-2026-10-05'), 'low-acuity-pair');
});
