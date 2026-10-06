import { Schedule } from '../../types';

export type ScheduleRange = Pick<Schedule, 'id' | 'name' | 'startDate' | 'endDate'>;

export interface ScheduleOverlap {
  first: ScheduleRange;
  second: ScheduleRange;
}

/** Every roster holds its dates, whatever its status; a record without dates holds none. */
export function holdsDates(s: Partial<ScheduleRange> | undefined): s is ScheduleRange {
  return !!s && typeof s.startDate === 'string' && typeof s.endDate === 'string' && !!s.startDate && !!s.endDate;
}

/** The parts of a roster the date calendar keeps (no undefined values, which Firestore refuses). */
export function toScheduleRange(s: Partial<Schedule> & { id: string }): ScheduleRange {
  return { id: s.id, name: s.name || s.id, startDate: s.startDate || '', endDate: s.endDate || '' };
}

export function rangesOverlap(a: ScheduleRange, b: ScheduleRange): boolean {
  return a.id !== b.id && holdsDates(a) && holdsDates(b) && a.startDate <= b.endDate && a.endDate >= b.startDate;
}

export function findScheduleOverlaps(schedules: ScheduleRange[]): ScheduleOverlap[] {
  const sorted = [...new Map(schedules.filter(holdsDates).map(s => [s.id, s])).values()]
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id));
  const overlaps: ScheduleOverlap[] = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length && sorted[j].startDate <= sorted[i].endDate; j++) {
      overlaps.push({ first: sorted[i], second: sorted[j] });
    }
  }
  return overlaps;
}

function assertValidDates(candidate: ScheduleRange): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(candidate.endDate)
    || !Number.isFinite(Date.parse(candidate.startDate)) || !Number.isFinite(Date.parse(candidate.endDate))
    || new Date(candidate.startDate).toISOString().slice(0, 10) !== candidate.startDate
    || new Date(candidate.endDate).toISOString().slice(0, 10) !== candidate.endDate
    || candidate.startDate > candidate.endDate) {
    throw new Error('Choose valid roster dates, with the end on or after the start.');
  }
}

/** The first roster whose dates overlap the candidate's. */
export function findRangeConflict(candidate: ScheduleRange, schedules: ScheduleRange[]): ScheduleRange | undefined {
  return schedules.find(s => rangesOverlap(candidate, s));
}

export function assertScheduleRangeAvailable(candidate: ScheduleRange, schedules: ScheduleRange[]): void {
  assertValidDates(candidate);
  const other = findRangeConflict(candidate, schedules);
  if (other) throw new Error(`These dates overlap "${other.name}" (${other.startDate} to ${other.endDate}). Open that roster or choose different dates.`);
}

/** Shared by every transactional roster write, including imports. */
export function mergeScheduleRanges(existing: Record<string, ScheduleRange>, changes: ScheduleRange[]): Record<string, ScheduleRange> {
  const merged = { ...existing };
  for (const change of changes) merged[change.id] = change;
  for (const change of changes) {
    const old = existing[change.id];
    // Publishing or renaming old overlapping records must remain possible to save.
    // Date changes and newly created records always require free dates.
    if (!old || old.startDate !== change.startDate || old.endDate !== change.endDate) {
      assertScheduleRangeAvailable(change, Object.values(merged));
    }
  }
  return merged;
}
