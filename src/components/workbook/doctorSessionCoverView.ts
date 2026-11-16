import type { Assignment, DoctorSession, DutyWindow } from '../../types';
import { assignmentCoversDoctor, effectiveDoctorCoverage, resolveDoctorCoverage, simultaneousDoctorIntervals, uncoveredParts } from '../../services/engine/clinicModel';
import { assignmentCanCoverDoctor, type DoctorCoverageContext } from '../../services/engine/assignmentPresence';

export interface DoctorSessionCoverView {
  rows: { nurseId: string; name: string; startTime: string; endTime: string; sharedText: string }[];
  gaps: { start: string; end: string }[];
  needsReview: boolean;
  summary: string;
}

/** Every qualified nurse interval for one clinic, with exact handover and gap times. */
export function doctorSessionCoverView(session: DoctorSession, assignments: Assignment[], duties: DutyWindow[], ctx: DoctorCoverageContext): DoctorSessionCoverView {
  if (session.cancelled) return { rows: [], gaps: [], needsReview: false, summary: 'Cancelled clinic' };
  const rows: DoctorSessionCoverView['rows'] = [];
  let needsReview = false;
  const dutyMap = new Map(duties.map(d => [d.id, d]));
  for (const a of assignments.filter(a => a.date === session.date && assignmentCoversDoctor(a, session.doctorId))) {
    const duty = dutyMap.get(a.dutyWindowId);
    const resolved = resolveDoctorCoverage(a, duty, ctx.sessions);
    if (!duty || resolved.problems.length || !assignmentCanCoverDoctor(a, ctx, session.doctorId)) {
      needsReview = true;
      continue;
    }
    const nurse = ctx.nurses.find(n => n.id === a.nurseId)!;
    for (const r of effectiveDoctorCoverage(a, duty, ctx.sessions).filter(r => r.doctorId === session.doctorId)) {
      const shared = simultaneousDoctorIntervals(a, duty, ctx.sessions).flatMap(t => {
        const startTime = t.startTime > r.startTime ? t.startTime : r.startTime;
        const endTime = t.endTime < r.endTime ? t.endTime : r.endTime;
        return startTime < endTime ? [`${startTime} to ${endTime}`] : [];
      });
      rows.push({ nurseId: nurse.id, name: nurse.fullName, startTime: r.startTime, endTime: r.endTime,
        sharedText: shared.length ? `Shared cover: ${shared.join(', ')}` : '' });
    }
  }
  rows.sort((a, b) => a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime) || a.name.localeCompare(b.name));
  const gaps = uncoveredParts(session.startTime, session.endTime, rows);
  const summary = [...rows.map(r => `${r.name}: ${r.startTime} to ${r.endTime}${r.sharedText ? ` (${r.sharedText})` : ''}`),
    ...gaps.map(g => `No nurse: ${g.start} to ${g.end}`), ...(needsReview ? ['Doctor cover needs review'] : [])].join('\n');
  return { rows, gaps, needsReview, summary };
}
