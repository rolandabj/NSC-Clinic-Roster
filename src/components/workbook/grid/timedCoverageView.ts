import type { Assignment, Doctor, DoctorSession, DutyWindow } from '../../../types';
import { doctorCoverageText, freeDoctorIntervals, resolveDoctorCoverage, simultaneousDoctorIntervals } from '../../../services/engine/clinicModel';

export type CoverageViewMode = 'legacy' | 'single' | 'sequential' | 'shared' | 'float' | 'review';
export interface TimedCoverageView {
  coverageMode: CoverageViewMode;
  coverageBadge: string;
  coverageText: string;
  /** Alternating name and time lines. Plain text keeps memoized cell views stable. */
  coverageLines: string;
  coverageSharingText: string;
}

/** Timed display only. Legacy duties keep their existing labels. */
export function timedCoverageViewOf(a: Assignment | undefined, duty: DutyWindow | undefined,
  doctors: Doctor[], sessions?: DoctorSession[], shortNames?: Map<string, string>): TimedCoverageView {
  const legacy: TimedCoverageView = { coverageMode: 'legacy', coverageBadge: '', coverageText: '', coverageLines: '', coverageSharingText: '' };
  if (!a || a.doctorCoverage === undefined) return legacy;
  const resolved = resolveDoctorCoverage(a, duty, sessions);
  const text = doctorCoverageText(a, doctors, duty);
  if (resolved.problems.length || text === 'Doctor cover needs review') return {
    coverageMode: 'review', coverageBadge: 'Review cover', coverageText: 'Doctor cover needs review',
    coverageLines: 'Doctor cover\nNeeds review', coverageSharingText: '',
  };
  const shared = simultaneousDoctorIntervals(a, duty, sessions);
  const ids = new Set(resolved.intervals.map(r => r.doctorId));
  const mode: CoverageViewMode = shared.length ? 'shared' : ids.size > 1 ? 'sequential' : ids.size ? 'single' : 'float';
  const rows = resolved.intervals.map(r => ({ ...r, label: shortNames?.get(r.doctorId) || doctors.find(d => d.id === r.doctorId)?.fullName || 'Doctor' }));
  rows.push(...freeDoctorIntervals(a, duty, sessions).map(r => ({ ...r, doctorId: '', label: 'Float' })));
  rows.sort((a, b) => a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime) || a.label.localeCompare(b.label));
  return {
    coverageMode: mode,
    coverageBadge: mode === 'shared' ? '2 doctors' : mode === 'sequential' ? 'Sequential cover' : mode === 'float' ? 'Float' : 'Timed cover',
    coverageText: text,
    coverageLines: rows.flatMap(r => [r.label, `${r.startTime} to ${r.endTime}`]).join('\n'),
    coverageSharingText: shared.length ? `Shared cover: ${shared.map(r => `${r.startTime} to ${r.endTime}`).join(', ')}.` : '',
  };
}
