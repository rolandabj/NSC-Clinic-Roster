// Test page only: made up data for the sample of the proposed look (a two week roster,
// six nurses, three doctors). Dates are kept as YYYY-MM-DD and shown as DD-MM-YYYY.
import type { ProblemKind } from './ui';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ddmmyyyy = (iso: string) => `${iso.slice(8, 10)}-${iso.slice(5, 7)}-${iso.slice(0, 4)}`;
export const weekdayOf = (iso: string) => WEEKDAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()];
/** "Mon 16-11-2026" */
export const dayLabel = (iso: string) => `${weekdayOf(iso)} ${ddmmyyyy(iso)}`;

export const DAYS = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 10, 16 + i));
  const iso = date.toISOString().slice(0, 10);
  return { iso, weekday: WEEKDAYS[date.getUTCDay()], day: date.getUTCDate(), weekend: [0, 6].includes(date.getUTCDay()) };
});
export const ROSTER = { name: 'November', from: DAYS[0].iso, to: DAYS[DAYS.length - 1].iso };

/** Shift times and the colours a planner chose for them in Settings. */
export const SHIFTS: Record<string, { start: string; end: string; color: string }> = {
  D: { start: '09:00', end: '17:00', color: '#2563eb' },
  E: { start: '13:00', end: '21:00', color: '#7c3aed' },
};
export const LEAVE = { AL: { name: 'Annual leave', color: '#10b981' } };
const DOCTORS: Record<string, { name: string; room: string }> = {
  Lee: { name: 'Dr Lee', room: 'R1' },
  Ray: { name: 'Dr Ray', room: 'R2' },
  Khan: { name: 'Dr Khan', room: 'R3' },
};

export type Cell =
  | { kind: 'shift'; code: string; with: string; short: string; doctor?: string; room?: string; pinned: boolean }
  | { kind: 'leave'; code: 'AL' }
  | { kind: 'off' }
  | null;

/** "D Lee*" is a D shift with Dr Lee, pinned; "E Float", "AL" (leave), "OFF" (day off), "" (nothing). */
function parse(text: string): Cell {
  if (!text) return null;
  if (text === 'OFF') return { kind: 'off' };
  if (text === 'AL') return { kind: 'leave', code: 'AL' };
  const pinned = text.endsWith('*');
  const [code, who] = text.replace('*', '').split(' ');
  const doctor = DOCTORS[who];
  if (doctor) return { kind: 'shift', code, with: doctor.name, short: doctor.name, doctor: doctor.name, room: doctor.room, pinned };
  return who === 'Blood'
    ? { kind: 'shift', code, with: 'Blood collection', short: 'PHL', pinned }
    : { kind: 'shift', code, with: who, short: who, pinned };
}

const rows: [string, string, string, number, string[]][] = [
  ['amy', 'Amy', 'Senior', 80, ['D Lee*', 'E Float', 'D Khan', 'AL', 'AL', '', '', 'D Lee', 'E Float', 'D Float', 'E Float', 'E Float', '', '']],
  ['mary', 'Mary', 'Staff', 80, ['D Float', 'D Ray', 'D Float', 'D Lee*', 'E Float', '', '', 'D Float', 'D Ray', 'E Float', 'D Lee', 'D Float', '', '']],
  ['nina', 'Nina', 'Staff', 80, ['E Float', 'D Float', 'E Float', 'E Float', 'D Ray', '', '', 'E Float', 'D Float', 'D Khan', 'E Float', 'D Ray', '', '']],
  ['sara', 'Sara', 'Senior', 80, ['D Blood', 'D Blood', 'D Blood', 'D Float', 'D Blood', '', '', 'OFF', 'D Blood', 'D Blood', 'D Float', 'D Blood', '', '']],
  ['huda', 'Huda', 'Staff', 60, ['', 'E Float', 'D Float', 'D Blood', '', '', '', 'E Float', 'E Float', 'E Float', 'D Blood', 'E Float', '', '']],
  ['joy', 'Joy', 'Staff', 80, ['E Float', '', 'E Float', 'E Float', 'E Float', '', '', '', 'AL', 'AL', 'AL', 'AL', '', '']],
];

export const NURSES = rows.map(([id, name, level, goal, cells]) => {
  const parsed = cells.map(parse);
  const worked = parsed.filter((c) => c?.kind === 'shift').length * 8;
  const leave = parsed.filter((c) => c?.kind === 'leave').length * 8;
  return { id, name, level, goal, cells: parsed, worked, leave, total: worked + leave, difference: worked + leave - goal };
});
export type Nurse = (typeof NURSES)[number];

export interface Problem {
  id: string;
  kind: ProblemKind;
  nurseId?: string;
  day?: string;
  text: string;
}

const joy = NURSES.find((n) => n.id === 'joy')!;
export const PROBLEMS: Problem[] = [
  { id: 'p1', kind: 'must', nurseId: 'nina', day: '2026-11-20', text: 'Nina asked for this day off but has a shift with Dr Ray.' },
  { id: 'p2', kind: 'must', day: '2026-11-18', text: 'No senior nurse on the evening shift.' },
  { id: 'p3', kind: 'check', nurseId: 'huda', day: '2026-11-25', text: 'Huda works three evenings in a row.' },
  { id: 'p4', kind: 'check', nurseId: 'joy', text: `Joy is ${-joy.difference} h short of the goal for this roster.` },
  { id: 'p5', kind: 'note', nurseId: 'mary', day: '2026-11-17', text: "Dr Ray is not on Mary's list of doctors." },
];
export const problemAt = (nurseId: string, day: string) => PROBLEMS.find((p) => p.nurseId === nurseId && p.day === day);
export const dayProblems = (day: string) => PROBLEMS.filter((p) => !p.nurseId && p.day === day);
export const countOf = (kind: ProblemKind) => PROBLEMS.filter((p) => p.kind === kind).length;

export type RequestStatus = 'Waiting' | 'Approved' | 'Declined';
export interface StaffRequest {
  id: string;
  nurse: string;
  type: string;
  from: string;
  to?: string;
  sent: string;
  status: RequestStatus;
}
export const REQUESTS: StaffRequest[] = [
  { id: 'r1', nurse: 'Mary', type: 'Annual leave', from: '2026-12-14', to: '2026-12-18', sent: '2026-10-05', status: 'Waiting' },
  { id: 'r2', nurse: 'Amy', type: 'Day off', from: '2026-12-07', sent: '2026-10-04', status: 'Waiting' },
  { id: 'r3', nurse: 'Sara', type: 'Day off', from: '2026-11-23', sent: '2026-10-02', status: 'Approved' },
  { id: 'r4', nurse: 'Nina', type: 'Day off', from: '2026-11-20', sent: '2026-10-01', status: 'Approved' },
  { id: 'r5', nurse: 'Joy', type: 'Swap with Huda', from: '2026-11-26', sent: '2026-09-30', status: 'Declined' },
];

/** A light tint of a stored colour, worked out here so the text on it can be checked for contrast. */
export function tint(hex: string, amount = 0.1): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(255 - (255 - c) * amount);
  const [r, g, b] = [mix((n >> 16) & 255), mix((n >> 8) & 255), mix(n & 255)];
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
