import type { Assignment, Doctor, DoctorSession, Schedule, Specialty } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { checkAssignment, listProblem, type AssignmentCheckContext } from '../engine/assignmentChecks';
import { assignmentDoctorIds, doctorCoverageProblems } from '../engine/clinicModel';
import { newFindings, type RosterCheck } from '../engine/handMoveChecks';
import { manualDoctorCoverageOf } from '../engine/manualDoctorCoverage';
import { nurseIsAvailable } from '../engine/assignmentPresence';

export type TemplateDutyPattern = Pick<Assignment, 'dutyWindowId' | 'kind' | 'doctorId' | 'secondDoctorId' |
  'doctorCoverage' | 'clinicalRoleId' | 'specialtyId' | 'note'>;
export interface TemplateCoverageInput extends AssignmentCheckContext {
  schedule: Schedule;
  doctors: Doctor[];
  sessions: DoctorSession[];
  specialties: Specialty[];
  checkRoster: RosterCheck;
}
export interface TemplateCoveragePlan {
  result: Assignment[];
  added: number;
  nurseCount: number;
  replaced: number;
  replacedOnly: number;
  removedOnly: number;
  inputFingerprint: string;
  addedIds: string[];
}

const fingerprint = ({ checkRoster: _checkRoster, ...input }: TemplateCoverageInput) => JSON.stringify(input);
const readable = (message: string) => message.replace(/\b\d{4}-\d{2}-\d{2}\b/g, formatDate);

function checkPlan(plan: TemplateCoveragePlan, input: TemplateCoverageInput): void {
  const context = { ...input, assignments: plan.result };
  const added = new Set(plan.addedIds);
  for (const assignment of plan.result.filter(a => added.has(a.id))) {
    const duty = input.dutyWindows.find(d => d.id === assignment.dutyWindowId);
    const timing = doctorCoverageProblems(assignment, duty, input.sessions || []);
    const reasons = [...timing, ...checkAssignment(context, assignment)];
    const outside = listProblem(context, assignment);
    if (outside) reasons.push(outside);
    if (reasons.length) throw new Error(readable(reasons.join(' ')));
  }
  const after = input.checkRoster(plan.result);
  const copiedCells = new Set(plan.result.filter(a => added.has(a.id)).map(a => `${a.nurseId}|${a.date}`));
  const automaticOverlap = after.find(f => f.id.startsWith('session-overlap-') &&
    f.cellRefs.some(cell => copiedCells.has(`${cell.nurseId}|${cell.date}`)));
  if (automaticOverlap) throw new Error(`This template or copy would add a Must fix: ${readable(automaticOverlap.message)} Automatic cover cannot overlap another nurse for the same doctor.`);
  const addedErrors = newFindings(input.checkRoster(input.assignments), after, 'ERROR');
  if (addedErrors.length) throw new Error(`This template or copy would add a Must fix: ${readable(addedErrors[0].message)} Correct the pattern or roster before filling.`);
}

/** Build automatic copies without widening recorded times or inheriting manual review intent. */
export function buildTemplateCoveragePlan(input: TemplateCoverageInput,
  shiftFor: (nurseId: string, weekday: number) => TemplateDutyPattern | undefined,
  newId: () => string = () => crypto.randomUUID()): TemplateCoveragePlan {
  const kept = input.assignments.filter(a => a.source === 'LOCK' || a.source === 'MANUAL' || a.locked);
  const keptKeys = new Set(kept.map(a => `${a.nurseId}|${a.date}`));
  const blocked = new Set(input.locks.map(l => `${l.nurseId}|${l.date}`));
  const added: Assignment[] = [];
  for (let day = new Date(`${input.schedule.startDate}T00:00:00Z`); day.toISOString().slice(0, 10) <= input.schedule.endDate;
    day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10);
    for (const nurse of input.nurses) {
      const key = `${nurse.id}|${date}`;
      if (!nurseIsAvailable(nurse, date, input) || keptKeys.has(key) || blocked.has(key)) continue;
      const source = shiftFor(nurse.id, day.getUTCDay());
      if (!source) continue;
      const duty = input.dutyWindows.find(d => d.id === source.dutyWindowId && d.active !== false);
      if (!duty) throw new Error('A copied shift uses a shift type that is no longer available. Correct the pattern before filling.');
      const next: Assignment = { id: newId(), scheduleId: input.schedule.id, nurseId: nurse.id, date,
        dutyWindowId: source.dutyWindowId, kind: source.kind,
        doctorId: source.kind === 'DOCTOR' ? source.doctorId : undefined,
        secondDoctorId: source.kind === 'DOCTOR' ? source.secondDoctorId : undefined,
        clinicalRoleId: source.kind === 'CLINICAL_ROLE' ? source.clinicalRoleId : undefined,
        specialtyId: source.kind === 'SPECIALTY' ? source.specialtyId : undefined, note: source.note,
        ...(source.doctorCoverage !== undefined ? { doctorCoverage: source.doctorCoverage } : {}),
        source: 'GENERATED', locked: false };
      if (next.kind === 'DOCTOR') {
        if (assignmentDoctorIds(next).some(id => !input.doctors.some(d => d.id === id && d.active !== false))) {
          throw new Error('A copied shift names a doctor who is no longer active. Correct the pattern before filling.');
        }
        next.doctorCoverage = manualDoctorCoverageOf(next, duty, input.sessions);
      }
      else {
        const problems = doctorCoverageProblems(next, duty, input.sessions || []);
        if (problems.length) throw new Error(problems.join(' '));
      }
      added.push(next);
    }
  }
  const addedKeys = new Set(added.map(a => `${a.nurseId}|${a.date}`));
  const dropped = input.assignments.filter(a => !kept.includes(a));
  const replacedOnly = dropped.filter(a => addedKeys.has(`${a.nurseId}|${a.date}`)).length;
  const plan: TemplateCoveragePlan = { result: [...kept, ...added], added: added.length,
    nurseCount: new Set(added.map(a => a.nurseId)).size, replaced: dropped.length, replacedOnly,
    removedOnly: dropped.length - replacedOnly, inputFingerprint: fingerprint(input), addedIds: added.map(a => a.id) };
  checkPlan(plan, input);
  return plan;
}

/** Confirmation never permits an older candidate to overwrite a changed roster or clinic. */
export function assertTemplateCoverageCurrent(plan: TemplateCoveragePlan, input: TemplateCoverageInput): void {
  if (plan.inputFingerprint !== fingerprint(input)) throw new Error('The roster or clinic details changed. Close this dialog and try again.');
  checkPlan(plan, input);
}
