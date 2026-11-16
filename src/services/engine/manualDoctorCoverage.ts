import type { Assignment, DoctorCoverageInterval, DoctorSession, DutyWindow } from '../../types';
import { assignmentDoctorIds, canonicalDoctorCoverage, doctorCoverageProblems, effectiveDoctorCoverage } from './clinicModel';

type ManualDoctorChoice = Pick<Assignment, 'date' | 'kind' | 'doctorId' | 'secondDoctorId' | 'doctorCoverage' | 'dutyWindowId'>;

/** Resolve an explicit hand edit without turning saved partial cover into a whole session. */
export function manualDoctorCoverageOf(next: ManualDoctorChoice, duty: Pick<DutyWindow, 'startTime' | 'endTime'> | undefined,
  sessions: readonly DoctorSession[], previous?: ManualDoctorChoice): DoctorCoverageInterval[] | undefined {
  if (next.kind !== 'DOCTOR') return undefined;
  const unchanged = previous?.kind === next.kind && previous.date === next.date &&
    previous.doctorId === next.doctorId && (previous.secondDoctorId || '') === (next.secondDoctorId || '');
  const explicit = next.doctorCoverage !== undefined ? next.doctorCoverage : unchanged ? previous?.doctorCoverage : undefined;
  const doctorCoverage = explicit === undefined
    ? effectiveDoctorCoverage({ ...next, doctorCoverage: undefined }, duty, sessions)
    : explicit;
  const problems = doctorCoverageProblems({ ...next, doctorCoverage }, duty, sessions);
  if (problems.length) throw new Error(problems.join(' '));
  return canonicalDoctorCoverage(doctorCoverage);
}

/** Safe editable rows. Malformed saved data starts incomplete instead of becoming full cover. */
export function doctorCoverageDraftOf(next: ManualDoctorChoice, duty: Pick<DutyWindow, 'startTime' | 'endTime'> | undefined,
  sessions: readonly DoctorSession[]): DoctorCoverageInterval[] {
  const ids = assignmentDoctorIds(next);
  const raw: unknown = next.doctorCoverage;
  let rows: DoctorCoverageInterval[] = [];
  if (raw === undefined) rows = effectiveDoctorCoverage(next, duty, sessions);
  else if (Array.isArray(raw)) rows = Array.from(raw).map(row => {
    const named = typeof row?.doctorId === 'string' && ids.includes(row.doctorId);
    return { doctorId: named ? row.doctorId : ids[0] || '',
      startTime: named && typeof row?.startTime === 'string' ? row.startTime : '',
      endTime: named && typeof row?.endTime === 'string' ? row.endTime : '' };
  });
  for (const doctorId of ids) if (!rows.some(row => row.doctorId === doctorId)) rows.push({ doctorId, startTime: '', endTime: '' });
  return rows;
}
