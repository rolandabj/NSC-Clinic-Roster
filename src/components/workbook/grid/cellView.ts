import type {
  Assignment,
  AvailabilityRequest,
  ClinicalRole,
  Doctor,
  DutyWindow,
  LeaveEntry,
  LeaveType,
  LockEntry,
  Nurse,
  Specialty,
} from '../../../types';
import { leaveCreditOnDate } from '../../../services/hours/hoursPolicy';
import { nurseClinicRoleOf } from '../../../services/engine/clinicModel';
import { isFloatShift } from '../../../services/engine/floatShift';
import { describeRequest } from '../../../services/engine/explainCell';
import { formatDayDate } from '../../../utils/dateUtils';
import { tint } from '../../../utils/colorContrast';

/**
 * What one roster grid cell shows, worked out ahead of drawing it.
 *
 * Every field is a plain value (text, number, true or false), so two views can be
 * compared field by field: `reuseCellViews` keeps the old object when nothing changed,
 * and the memoized cell is then not drawn again.
 */
export interface CellView {
  /** `${nurseId}|${date}`, as in the cell's `data-cell`. */
  key: string;
  nurseId: string;
  date: string;
  content: 'leave' | 'off' | 'shift' | 'pendingLeave' | 'empty';
  /** A pinned day (a lock) is on this cell. */
  pinned: boolean;
  leaveAcronym: string;
  dutyAcronym: string;
  /** The shift's start and end times, on the cell's second and third lines ('' when there is no shift). */
  startTime: string;
  endTime: string;
  /** The colour of the shift or the leave the cell shows (its edge), and the soft fill behind it; '' for none. */
  color: string;
  fill: string;
  dutyPriority: boolean;
  /** The shift was changed by hand. */
  handChange: boolean;
  isNurseClinic: boolean;
  isFloatPool: boolean;
  /** The doctor or department is not on the nurse's list. */
  mismatch: boolean;
  /** The doctor, department or task in short ("Lee", "NC", "Float"), on the cell's first line. */
  label: string;
  /** "#1", "#2"..., "Pool", "!" (not on the nurse's list), or none. */
  rankBadge: string | null;
  /** Leave waiting for approval: its colour and letters ('' when there is none). */
  pendingLeaveColor: string;
  pendingLeaveAcronym: string;
  hasPendingLeave: boolean;
  /** The small clock for leave waiting for approval under a shift, a day off or leave. */
  pendingMark: boolean;
  /** The nurse's request mark: round for a day off, square for a shift. */
  requestMark: 'none' | 'dayOff' | 'shift';
  requestMismatch: boolean;
  requestPending: boolean;
  hasProblems: boolean;
  /** The kind of the cell's worst problem, for its icon: must fix, to check, or none. */
  problemKind: 'none' | 'must' | 'check';
  isToday: boolean;
  /** Column shading: today, public holiday or weekend. */
  dayShade: string;
  /** The tooltip. */
  title: string;
  /**
   * The spoken name: what the cell shows first (so it matches what is seen), then the end time
   * and the shift, the nurse and the day, and its marks.
   */
  ariaLabel: string;
}

/** Lookups shared by every cell, built once per change of the lists they come from. */
export interface CellLookups {
  dutyMap: Map<string, DutyWindow>;
  dutyWindows: DutyWindow[];
  doctorMap: Map<string, Doctor>;
  roleMap: Map<string, ClinicalRole>;
  specialtyMap: Map<string, Specialty>;
  leaveTypeMap: Map<string, LeaveType>;
  nurseClinicRoleId?: string;
  /** Each doctor's short name for the cells (`shortDoctorNames`). */
  doctorShort: Map<string, string>;
}

/** A doctor's name without "Dr" in front. */
const withoutDr = (name: string) => name.replace(/^dr\.?\s+/i, '').trim();

/**
 * Doctor names for the cells (the owner's choice of 13-10-2026): the first name without "Dr"
 * ("Ahmed"), with the surname's initial when two doctors share the first name ("Ahmed H.",
 * "Ahmed K."), and the whole name when even that is shared.
 */
export function shortDoctorNames(doctors: Pick<Doctor, 'id' | 'fullName'>[]): Map<string, string> {
  const parts = doctors.map((d) => {
    const name = withoutDr(d.fullName);
    const words = name.split(/\s+/);
    const first = words[0];
    const withInitial = words.length > 1 ? `${first} ${words[words.length - 1][0]}.` : first;
    return { id: d.id, name, first, withInitial };
  });
  const count = (key: 'first' | 'withInitial') => {
    const m = new Map<string, number>();
    for (const p of parts) m.set(p[key], (m.get(p[key]) || 0) + 1);
    return m;
  };
  const firsts = count('first');
  const initials = count('withInitial');
  return new Map(
    parts.map((p) => [p.id, firsts.get(p.first) === 1 ? p.first : initials.get(p.withInitial) === 1 ? p.withInitial : p.name])
  );
}

export function cellLookupsOf(lists: {
  dutyWindows: DutyWindow[];
  doctors: Doctor[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  leaveTypes: LeaveType[];
}): CellLookups {
  return {
    dutyMap: new Map(lists.dutyWindows.map((d) => [d.id, d])),
    dutyWindows: lists.dutyWindows,
    doctorMap: new Map(lists.doctors.map((d) => [d.id, d])),
    roleMap: new Map(lists.roles.map((r) => [r.id, r])),
    specialtyMap: new Map(lists.specialties.map((s) => [s.id, s])),
    leaveTypeMap: new Map(lists.leaveTypes.map((l) => [l.id, l])),
    nurseClinicRoleId: nurseClinicRoleOf(lists.roles)?.id,
    doctorShort: shortDoctorNames(lists.doctors),
  };
}

/** The day of a column. */
export interface CellDay {
  dateStr: string;
  isWeekend: boolean;
  holiday?: { name: string };
  isToday: boolean;
}

/** What is on one nurse's day. */
export interface CellFacts {
  nurse: Nurse;
  day: CellDay;
  assignment?: Assignment;
  lock?: LockEntry;
  /** Approved leave. */
  leave?: LeaveEntry;
  /** Leave waiting for approval (left out when approved leave is there). */
  pendingLeave?: LeaveEntry;
  request?: AvailabilityRequest;
  /** The roster check's problems about this cell. */
  problems: string[];
  /** One of them must be fixed (else they are to check). */
  problemsMustFix?: boolean;
}

const SOURCE_WORDS: Record<string, string> = {
  GENERATED: 'Filled in by Fill roster',
  MANUAL: 'Changed by hand',
  LOCK: 'Pinned by hand',
};

/** The shift's source, as the end of the spoken name. */
const SOURCE_SPOKEN: Record<string, string> = {
  GENERATED: 'Filled in by Fill roster',
  MANUAL: 'Changed by hand',
  LOCK: 'Pinned by hand',
};

/** A doctor's name with "Dr" in front, unless it already has it. */
const withDr = (name: string) => (/^dr\.?\s/i.test(name) ? name : `Dr ${name}`);

/** Hours rounded for reading: whole hours, or one decimal when needed. */
const fmtHours = (n: number): string => String(Math.round(n * 10) / 10);

/** Does a department on the nurse's list (`refId`) match this department? */
function specialtyMatches(refId: string, spec: Specialty): boolean {
  const ref = refId.toLowerCase();
  const code = spec.code.toLowerCase();
  return (
    ref === code ||
    ref === spec.name.toLowerCase() ||
    (code === 'pcc' && ref.includes('pcc')) ||
    (code === 'ped' && (ref.includes('ped') || ref.includes('pedia')))
  );
}

export function cellViewOf(facts: CellFacts, lookups: CellLookups): CellView {
  const { nurse, day, assignment: asgn, lock, leave, pendingLeave, request, problems, problemsMustFix } = facts;
  const { dutyMap, doctorMap, roleMap, specialtyMap, leaveTypeMap } = lookups;
  const { dateStr, isWeekend, holiday, isToday } = day;

  const duty = asgn ? dutyMap.get(asgn.dutyWindowId) : undefined;
  const leaveType = leave ? leaveTypeMap.get(leave.leaveTypeId) : undefined;
  const pendingLeaveType = pendingLeave ? leaveTypeMap.get(pendingLeave.leaveTypeId) : undefined;
  const pendingLeaveText = pendingLeave ? `Leave asked for, waiting for approval: ${pendingLeaveType?.name || 'Leave'}` : '';
  const requestWords = request ? describeRequest(request, lookups.dutyWindows, asgn?.dutyWindowId) : undefined;

  let doctorName = '';
  const isNurseClinic =
    asgn?.clinicalRoleId === 'role-nurse-clinic' ||
    (!!asgn?.clinicalRoleId && asgn.clinicalRoleId === lookups.nurseClinicRoleId) ||
    !!asgn?.note?.toLowerCase().includes('nurse clinic');

  const isFloatPool =
    (!!asgn && isFloatShift(asgn)) ||
    !!asgn?.note?.toLowerCase().includes('float pool') ||
    !!asgn?.note?.toLowerCase().includes('general clinic');

  if (asgn && isFloatShift(asgn)) {
    // Not with a doctor: the roster says Float (not a department)
    doctorName = 'Float';
  } else if (asgn?.doctorId) {
    const d = doctorMap.get(asgn.doctorId);
    doctorName = d ? withoutDr(d.fullName) : '';
  } else if (asgn?.clinicalRoleId) {
    const r = roleMap.get(asgn.clinicalRoleId);
    if (asgn.clinicalRoleId === 'role-float') {
      doctorName = 'Float';
    } else {
      doctorName = r ? r.acronym : isNurseClinic ? 'NC' : 'ROLE';
    }
  } else if (asgn?.specialtyId) {
    const s = specialtyMap.get(asgn.specialtyId);
    doctorName = s ? s.code : 'POOL';
  } else if (isNurseClinic) {
    doctorName = 'NC';
  } else if (isFloatPool) {
    doctorName = 'Float';
  }
  // The cell shows the doctor's short name; the tooltip and the spoken name say who in full.
  const shownName = asgn?.doctorId && !isFloatShift(asgn) ? lookups.doctorShort.get(asgn.doctorId) || doctorName : doctorName;

  const docObj = asgn?.doctorId ? doctorMap.get(asgn.doctorId) : undefined;
  const docPref = asgn?.doctorId ? nurse.preferences?.find((p) => p.kind === 'DOCTOR' && p.refId === asgn.doctorId) : undefined;
  const specPref =
    !docPref && docObj && docObj.specialtyIds
      ? nurse.preferences?.find(
          (p) =>
            p.kind === 'SPECIALTY' &&
            (docObj.specialtyIds.includes(p.refId) ||
              docObj.specialtyIds.some((sid) => {
                const sCode = specialtyMap.get(sid)?.code?.toLowerCase();
                return sCode && p.refId.toLowerCase().includes(sCode);
              }))
        )
      : undefined;

  // The doctor or department against the nurse's list.
  const hasSpecificAllocations = nurse.preferences?.some((p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY');
  let mismatch = false;
  let mismatchReason = '';
  if (asgn && hasSpecificAllocations) {
    if (asgn.kind === 'DOCTOR' && asgn.doctorId) {
      const docSpecIds = docObj?.specialtyIds || [];
      const matchesDoc = nurse.preferences?.some((p) => p.kind === 'DOCTOR' && p.refId === asgn.doctorId);
      const matchesSpec = nurse.preferences?.some((p) => {
        if (p.kind !== 'SPECIALTY') return false;
        if (docSpecIds.includes(p.refId)) return true;
        return docSpecIds.some((sid) => {
          const sObj = specialtyMap.get(sid);
          return !!sObj && specialtyMatches(p.refId, sObj);
        });
      });
      if (!matchesDoc && !matchesSpec) {
        mismatch = true;
        mismatchReason = `${docObj ? withDr(docObj.fullName) : 'This doctor'} is not one of ${nurse.fullName}'s usual doctors or departments.`;
      }
    } else if (asgn.kind === 'SPECIALTY' && asgn.specialtyId && !isFloatShift(asgn)) {
      const specObj = specialtyMap.get(asgn.specialtyId);
      const matchesSpec = nurse.preferences?.some((p) => {
        if (p.kind !== 'SPECIALTY') return false;
        if (p.refId === asgn.specialtyId) return true;
        return !!specObj && specialtyMatches(p.refId, specObj);
      });
      if (!matchesSpec) {
        mismatch = true;
        mismatchReason = `${specObj?.name || 'This department'} is not one of ${nurse.fullName}'s usual departments.`;
      }
    }
  }


  const pairingDesc = isNurseClinic
    ? 'Nurse Clinic (no doctor)'
    : isFloatPool
    ? 'Float (not with a doctor)'
    : asgn?.clinicalRoleId
    ? `Clinic task: ${roleMap.get(asgn.clinicalRoleId)?.name || doctorName}`
    : asgn?.doctorId
    ? `With Dr ${doctorName}${
        docPref
          ? ` (usual doctor, choice ${docPref.rank})`
          : specPref
          ? ` (usual department, choice ${specPref.rank})`
          : mismatch
          ? ' (not one of this nurse’s usual doctors)'
          : ' (any nurse)'
      }`
    : asgn?.specialtyId
    ? `Department: ${specialtyMap.get(asgn.specialtyId)?.name || doctorName}${
        specPref ? ` (usual department, choice ${specPref.rank})` : mismatch ? ' (not one of this nurse’s usual departments)' : ''
      }`
    : doctorName;

  const contentWords = leave
    ? `${leaveType?.name || 'Leave'}: ${fmtHours(leaveCreditOnDate(leave, leaveType, dateStr))} h counted this day${
        leave.dayHours?.[dateStr] !== undefined ? ' (set for this day)' : ''
      }${lock ? ', pinned' : ''}`
    : lock?.mode === 'OFF'
    ? 'Day off, pinned'
    : asgn
    ? `${duty?.name || 'Shift'} shift${duty ? ` (${duty.startTime} to ${duty.endTime})` : ''}${duty?.isPriority ? ', used first' : ''} · ${pairingDesc} · ${
        SOURCE_WORDS[asgn.source] || asgn.source
      }${lock && asgn.source !== 'LOCK' ? ', pinned' : ''}${mismatch ? `\n${mismatchReason}` : ''}`
    : 'Nothing yet';
  const wishWords = [pendingLeaveText, requestWords?.text].filter(Boolean).join('\n');
  const dayWords = `${holiday ? ` (public holiday: ${holiday.name})` : isWeekend ? ' (weekend)' : ''}${isToday ? ' (today)' : ''}`;
  const title = `${contentWords}${wishWords ? `\n${wishWords}` : ''}${
    problems.length > 0 ? `\nProblems:\n${problems.map((m) => `• ${m}`).join('\n')}` : ''
  }`;
  // Spoken: what the cell shows, the rest of it, whose day it is, then its marks.
  const content = leave ? 'leave' : lock?.mode === 'OFF' ? 'off' : asgn ? 'shift' : pendingLeave ? 'pendingLeave' : 'empty';
  const rankBadge = mismatch ? '!' : docPref ? `#${docPref.rank}` : specPref ? `#${specPref.rank}` : isFloatPool ? null : asgn?.doctorId ? 'Pool' : null;
  const leaveCredit = leave ? leaveCreditOnDate(leave, leaveType, dateStr) : 0;
  const leaveHours = leave
    ? `${fmtHours(leaveCredit)} ${leaveCredit === 1 ? 'hour' : 'hours'} counted on this day${leave.dayHours?.[dateStr] !== undefined ? ' (set for this day)' : ''}`
    : '';
  const shown =
    content === 'leave'
      ? `${leaveType?.acronym || 'L'}, ${leaveType?.name || 'Leave'}: ${leaveHours}`
      : content === 'off'
      ? 'Day off'
      : content === 'shift'
      ? `${[shownName, rankBadge, duty?.startTime, duty?.endTime].filter(Boolean).join(' ')}, ${duty ? `${duty.name} shift` : 'shift'}${duty?.isPriority ? ', used first' : ''}`
      : content === 'pendingLeave'
      ? `${pendingLeaveType?.acronym || 'L'}, leave asked for, waiting for approval`
      : 'No shift';
  const marks = [
    content === 'shift' ? pairingDesc : '',
    content === 'shift' ? `${SOURCE_SPOKEN[asgn!.source] || asgn!.source}${lock && asgn!.source !== 'LOCK' ? ', pinned' : ''}` : lock ? 'Pinned' : '',
    mismatch ? mismatchReason.replace(/\.$/, '') : '',
    ...wishWords.split('\n'),
    problems.length > 0 ? `${problemsMustFix ? 'Must fix' : 'Check'}: ${problems.join('. ')}` : '',
  ].filter(Boolean);
  const ariaLabel = `${shown}. ${nurse.fullName}, ${formatDayDate(dateStr)}${dayWords}${marks.length ? `. ${marks.join('. ')}` : ''}`;
  const color = leave ? leaveType?.color || '#f59e0b' : asgn ? duty?.color || '#3b82f6' : '';

  return {
    key: `${nurse.id}|${dateStr}`,
    nurseId: nurse.id,
    date: dateStr,
    content,
    pinned: !!lock,
    leaveAcronym: leave ? leaveType?.acronym || 'L' : '',
    dutyAcronym: asgn ? duty?.acronym || 'D' : '',
    startTime: asgn && !leave && lock?.mode !== 'OFF' ? duty?.startTime || '' : '',
    endTime: asgn && !leave && lock?.mode !== 'OFF' ? duty?.endTime || '' : '',
    color,
    fill: color ? tint(color, 0.14) : '',
    dutyPriority: !!duty?.isPriority,
    handChange: asgn?.source === 'MANUAL',
    isNurseClinic,
    isFloatPool,
    mismatch,
    label: shownName,
    rankBadge,
    pendingLeaveColor: pendingLeave ? pendingLeaveType?.color || '#f59e0b' : '',
    pendingLeaveAcronym: pendingLeave ? pendingLeaveType?.acronym || 'L' : '',
    hasPendingLeave: !!pendingLeave,
    pendingMark: !!pendingLeave && (!!asgn || lock?.mode === 'OFF' || !!leave),
    requestMark: requestWords ? (requestWords.dayOff ? 'dayOff' : 'shift') : 'none',
    requestMismatch: !!requestWords?.mismatch,
    requestPending: !!requestWords?.pending,
    hasProblems: problems.length > 0,
    problemKind: problems.length === 0 ? 'none' : problemsMustFix ? 'must' : 'check',
    isToday,
    dayShade: isToday ? 'bg-indigo-50/70' : holiday ? 'bg-cyan-50' : isWeekend ? 'bg-slate-100' : '',
    title,
    ariaLabel,
  };
}

function sameView(a: CellView, b: CellView): boolean {
  for (const k of Object.keys(b) as (keyof CellView)[]) {
    if (a[k] !== b[k]) return false;
  }
  return Object.keys(a).length === Object.keys(b).length;
}

/**
 * The new views, with each one that did not change replaced by the old object,
 * so a memoized cell sees the same view and is not drawn again.
 */
export function reuseCellViews(
  previous: Map<string, CellView> | undefined,
  next: Map<string, CellView>
): Map<string, CellView> {
  if (!previous) return next;
  const out = new Map<string, CellView>();
  for (const [key, view] of next) {
    const old = previous.get(key);
    out.set(key, old && sameView(old, view) ? old : view);
  }
  return out;
}
