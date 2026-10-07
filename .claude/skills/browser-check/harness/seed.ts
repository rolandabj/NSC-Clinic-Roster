// Test page only: a small clinic with a draft November roster, two doctors with their
// clinics, and a nurse with a list (Mary: Dr Lee only). Change it freely in _preview/.
// ?seed=fair adds shifts so Amy is well over her goal (fairness suggestions).
// ?seed=big makes a full size clinic (see the end of this file).
const now = '2026-10-01T08:00:00Z';

const nurse = (id: string, name: string, extra: any = {}) => ({
  id,
  fullName: name,
  gmail: `${id}@example.com`,
  employeeCode: id.toUpperCase(),
  seniorityLevelId: 'sen',
  contractPercent: 100,
  dateOfBirth: '1990-01-01',
  capabilityIds: ['role-nurse-clinic', 'role-phl'],
  isClinicNurse: true,
  preferences: [],
  active: true,
  createdAt: now,
  updatedAt: now,
  ...extra,
});
const duty = (id: string, acronym: string, start: string, end: string, isPriority = false) => ({
  id, name: acronym, acronym, startTime: start, endTime: end, color: '#4f46e5', active: true, isPriority,
});
const november = {
  id: 'nov', name: 'November', startDate: '2026-11-16', endDate: '2026-11-29', blockWeeks: 2, hoursTargetFullTime: 80,
  status: 'DRAFT', activeVersionNumber: 1, createdAt: now, updatedAt: now,
};
/** A shift: with a doctor's id it is a shift with that doctor, else a float. */
const shift = (nurseId: string, date: string, doctorId?: string) => ({
  id: `nov-${nurseId}-${date}`, scheduleId: 'nov', nurseId, date, dutyWindowId: 'd95',
  ...(doctorId ? { kind: 'DOCTOR', doctorId } : { kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float' }),
  locked: false, source: 'GENERATED',
});
const clinic = (doctorId: string, date: string, specialtyId: string) => ({
  id: `s-${doctorId}-${date}`, doctorId, date, startTime: '09:00', endTime: '17:00', specialtyId, room: 'R1', source: 'PATTERN', cancelled: false,
});

const shifts = [
  shift('mary', '2026-11-16', 'lee'), shift('amy', '2026-11-16'),
  shift('nina', '2026-11-17', 'ray'), shift('sara', '2026-11-17'),
  shift('amy', '2026-11-19'), shift('mary', '2026-11-19'),
  shift('nina', '2026-11-20'), shift('sara', '2026-11-20'),
];
if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('seed') === 'fair') {
  for (const d of ['18', '21', '22', '23', '24', '25', '26', '27', '28', '29']) shifts.push(shift('amy', `2026-11-${d}`));
  for (const d of ['22', '25', '28']) shifts.push(shift('sara', `2026-11-${d}`));
}

export const seed: Record<string, any[]> = {
  clinics: [{ id: 'c1', name: 'Test Clinic', timezone: 'Asia/Dubai', weekendDays: [6, 0], openTime: '09:00', closeTime: '21:00' }],
  dutyWindows: [duty('d95', 'D', '09:00', '17:00', true), duty('d19', 'E', '13:00', '21:00', true)],
  clinicalRoles: [
    { id: 'role-nurse-clinic', name: 'Nurse Clinic', acronym: 'NC', description: '', defaultDailyQuota: 1, defaultStartTime: '09:00', defaultEndTime: '21:00' },
    { id: 'role-phl', name: 'Blood collection', acronym: 'PHL', description: '', defaultDailyQuota: 1, defaultStartTime: '09:00', defaultEndTime: '21:00' },
  ],
  seniorityLevels: [
    { id: 'sen', name: 'Senior', rank: 1, isSenior: true, color: '#000' },
    { id: 'jun', name: 'Staff', rank: 2, isSenior: false, color: '#555' },
  ],
  nurses: [
    nurse('amy', 'Amy'),
    nurse('mary', 'Mary', { seniorityLevelId: 'jun', preferences: [{ kind: 'DOCTOR', refId: 'lee', rank: 1 }] }),
    nurse('nina', 'Nina', { seniorityLevelId: 'jun' }),
    nurse('sara', 'Sara'),
  ],
  specialties: [{ id: 'ortho', name: 'Orthopaedics', code: 'ORTHO' }, { id: 'ent', name: 'ENT', code: 'ENT' }],
  doctors: [
    { id: 'lee', fullName: 'Dr Lee', gmail: 'lee@example.com', specialtyIds: ['ortho'], weeklyPattern: [{ weekday: 1, startTime: '09:00', endTime: '17:00', room: 'R1' }], active: true },
    { id: 'ray', fullName: 'Dr Ray', gmail: 'ray@example.com', specialtyIds: ['ent'], weeklyPattern: [{ weekday: 2, startTime: '09:00', endTime: '17:00', room: 'R1' }], active: true },
  ],
  doctorSessions: [clinic('lee', '2026-11-16', 'ortho'), clinic('lee', '2026-11-23', 'ortho'), clinic('ray', '2026-11-17', 'ent'), clinic('ray', '2026-11-24', 'ent')],
  rules: [],
  holidays: [],
  quotas: [],
  availabilityRequests: [],
  locks: [],
  audit: [],
  swaps: [],
  leaveTypes: [{ id: 'lt-al', name: 'Annual Leave', acronym: 'AL', color: '#10b981', creditedHours: 8, countsTowardHoursTarget: true, active: true }],
  leaveEntries: [{ id: 'lv-nina', nurseId: 'nina', leaveTypeId: 'lt-al', startDate: '2026-10-26', endDate: '2026-10-27', approved: true, status: 'APPROVED', hoursCredited: 16 }],
  workingHoursPeriods: [],
  schedules: [november],
  assignments: shifts,
  versions: [
    {
      id: 'v-nov-1', scheduleId: 'nov', number: 1, timestamp: '2026-10-02T08:00:00Z', author: 'Owner', note: 'First fill', isPublished: false,
      snapshot: { schedule: november, assignments: shifts, leaveEntries: [], locks: [], rulesSnapshot: [] },
    },
  ],
};

// ?seed=big: a full size clinic for timing the roster grid and checking long names:
// 60 nurses (every fourth a senior, every third with a first choice doctor), 12 doctors on
// weekdays, and a 31 day roster from 02-11-2026 filled five days in seven.
if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('seed') === 'big') {
  const days: string[] = [];
  for (let d = new Date('2026-11-02T00:00:00Z'); days.length < 31; d = new Date(d.getTime() + 86400000)) days.push(d.toISOString().slice(0, 10));
  Object.assign(november, { startDate: days[0], endDate: days[30], blockWeeks: 5, hoursTargetFullTime: 184 });
  const names = ['Amina', 'Bea', 'Carla', 'Dana', 'Eva', 'Fatima', 'Grace', 'Hana', 'Iris', 'Joy', 'Kim', 'Lina', 'Maya', 'Nora', 'Olga', 'Priya', 'Rana', 'Sofia', 'Tala', 'Uma'];
  const bigNurses = Array.from({ length: 60 }, (_, i) =>
    nurse(`n${i + 1}`, `${names[i % 20]} ${String.fromCharCode(65 + Math.floor(i / 20))}. Long Surname ${i + 1}`, {
      seniorityLevelId: i % 4 === 0 ? 'sen' : 'jun',
      preferences: i % 3 === 0 ? [{ kind: 'DOCTOR', refId: `doc${(i % 12) + 1}`, rank: 1 }] : [],
    })
  );
  const bigDoctors = Array.from({ length: 12 }, (_, i) => ({
    id: `doc${i + 1}`, fullName: `Dr Doctor ${i + 1}`, gmail: `doc${i + 1}@example.com`, specialtyIds: [i % 2 ? 'ortho' : 'ent'],
    weeklyPattern: [1, 2, 3, 4, 5].filter((w) => (w + i) % 2 === 0 || w === 1).map((weekday) => ({ weekday, startTime: '09:00', endTime: '17:00', room: `R${i + 1}` })),
    active: true,
  }));
  const sessions: any[] = [];
  for (const date of days) {
    const wd = new Date(date + 'T00:00:00Z').getUTCDay();
    for (const doc of bigDoctors) if (doc.weeklyPattern.some((p) => p.weekday === wd)) sessions.push(clinic(doc.id, date, doc.specialtyIds[0]));
  }
  const bigShifts: any[] = [];
  days.forEach((date, di) => {
    const daySessions = sessions.filter((s) => s.date === date);
    bigNurses.forEach((n, ni) => {
      if ((di + ni) % 7 >= 5) return;
      bigShifts.push(shift(n.id, date, ni < daySessions.length ? daySessions[ni].doctorId : undefined));
    });
  });
  Object.assign(seed, { nurses: bigNurses, doctors: bigDoctors, doctorSessions: sessions, assignments: bigShifts, leaveEntries: [] });
  seed.versions[0].snapshot.assignments = bigShifts;
}

// ?seed=clean: a one day roster (Wednesday 18-11-2026, no doctors) with no "Must fix" problems,
// so the publish dialog can go on to sending: Amy, the only active nurse, runs Nurse Clinic
// from 09:00 to 21:00. ?email=live switches email out of test mode (sends then go to
// /api/email/test, which a Playwright script can answer with page.route).
const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
if (params?.get('seed') === 'clean') {
  Object.assign(november, { startDate: '2026-11-18', endDate: '2026-11-18', blockWeeks: 1, hoursTargetFullTime: 12 });
  seed.dutyWindows.push(duty('d921', 'F', '09:00', '21:00'));
  for (const n of seed.nurses) if (n.id !== 'amy') n.active = false;
  const amyDay = { ...shift('amy', '2026-11-18'), dutyWindowId: 'd921', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-nurse-clinic' };
  Object.assign(seed, { assignments: [amyDay], doctorSessions: [], leaveEntries: [] });
  seed.versions[0].snapshot.assignments = [amyDay];
}
if (params?.get('email') === 'live') {
  seed.systemMetadata = [{ id: 'email_settings', emailMockMode: false, emailSenderName: 'Test Clinic' }];
}
