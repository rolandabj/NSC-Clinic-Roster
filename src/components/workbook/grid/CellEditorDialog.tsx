import React, { useState } from 'react';
import { Calendar, Check, Star, Stethoscope, Trash2 } from 'lucide-react';
import type { AssignmentKind, ClinicalRole, Doctor, DutyWindow, LeaveType, Nurse, PublicHoliday, Specialty } from '../../../types';
import { isExclusiveNurseClinic } from '../../../services/engine/nurseClinicUtils';
import { formatDayDate } from '../../../utils/dateUtils';
import { readableTextOn } from '../../../utils/colorContrast';
import { Button, Checkbox, Dialog, Field, Input, Notice, Select, cx } from '../../ui';

/** A choice among a few, as a pressed or not pressed button. */
const choiceClass = (on: boolean) =>
  cx('rounded-lg border p-3 text-left transition-colors', on ? 'border-brand bg-brand-soft ring-1 ring-brand' : 'border-line hover:bg-sunken');

/** Everything one cell edit needs, as the full editor collects it. */
export interface CellChoice {
  category: 'DUTY' | 'LEAVE';
  dutyId: string;
  kind: AssignmentKind;
  targetRefId: string;
  note: string;
  leaveTypeId: string;
  /** false = kept (pinned) when the roster is filled again. */
  allowOverwrite: boolean;
  /** Hours this leave day counts ('' = the leave type's default). */
  leaveHours: string;
}

/** A doctor's name with "Dr" in front, unless it already has it. */
const withDr = (name: string) => (/^dr\.?\s/i.test(name) ? name : `Dr ${name}`);

interface CellEditorDialogProps {
  /** The cell being changed. */
  editorTarget: { nurseId: string; date: string };
  /** What the editor starts with (the cell as it is, or the defaults for an empty cell). */
  defaults: CellChoice;
  nurseMap: Map<string, Nurse>;
  doctors: Doctor[];
  doctorMap: Map<string, Doctor>;
  dutyWindows: DutyWindow[];
  leaveTypes: LeaveType[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  specialtyMap: Map<string, Specialty>;
  holidayByDate: Map<string, PublicHoliday>;
  onClose: () => void;
  /** Saves the choice; the grid closes the editor once it is saved. */
  onSave: (choice: CellChoice) => void;
  /** Clears the cell (and closes the editor). */
  onClear: () => void;
}

/**
 * The full cell editor (double click, Enter, or More in the popup): a shift with its doctor,
 * department or clinic task, or leave or a day off; whether it is kept when the roster is
 * filled again; leave hours for the day; and a note. On the shared Dialog since Phase 7, slice 3b.
 */
export const CellEditorDialog: React.FC<CellEditorDialogProps> = ({
  editorTarget,
  defaults,
  nurseMap,
  doctors,
  doctorMap,
  dutyWindows,
  leaveTypes,
  roles,
  specialties,
  specialtyMap,
  holidayByDate,
  onClose,
  onSave,
  onClear,
}) => {
  const [editorCategory, setEditorCategory] = useState<'DUTY' | 'LEAVE'>(defaults.category);
  const [editorDutyId, setEditorDutyId] = useState(defaults.dutyId);
  const [editorKind, setEditorKind] = useState<AssignmentKind>(defaults.kind);
  const [editorTargetRefId, setEditorTargetRefId] = useState(defaults.targetRefId);
  const [editorNote, setEditorNote] = useState(defaults.note);
  const [editorLeaveTypeId, setEditorLeaveTypeId] = useState(defaults.leaveTypeId);
  const [editorAllowOverwrite, setEditorAllowOverwrite] = useState(defaults.allowOverwrite);
  // Hours this leave day counts for this nurse ('' = the leave type's default from Settings).
  const [editorLeaveHours, setEditorLeaveHours] = useState(defaults.leaveHours);
  const save = () =>
    onSave({
      category: editorCategory,
      dutyId: editorDutyId,
      kind: editorKind,
      targetRefId: editorTargetRefId,
      note: editorNote,
      leaveTypeId: editorLeaveTypeId,
      allowOverwrite: editorAllowOverwrite,
      leaveHours: editorLeaveHours,
    });

  const activeNurse = nurseMap.get(editorTarget.nurseId);
  const isTargetExclusiveNC = activeNurse ? isExclusiveNurseClinic(activeNurse, roles) : false;
  const nurseSpecificPrefs = activeNurse?.preferences?.filter((p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY') || [];

  /** Why the doctor or department chosen is not one of the nurse's usual ones, or ''. */
  const mismatch = (() => {
    if (isTargetExclusiveNC || nurseSpecificPrefs.length === 0) return '';
    const matchesCode = (refId: string, sp?: Specialty) => {
      if (!sp) return false;
      const ref = refId.toLowerCase();
      return (
        ref === sp.code.toLowerCase() ||
        ref === sp.name.toLowerCase() ||
        (sp.code.toLowerCase() === 'pcc' && ref.includes('pcc')) ||
        (sp.code.toLowerCase() === 'ped' && (ref.includes('ped') || ref.includes('pedia')))
      );
    };
    if (editorKind === 'DOCTOR') {
      const selDoc = doctors.find((d) => d.id === editorTargetRefId);
      const selDocSpecIds = selDoc?.specialtyIds || [];
      const matchesDoc = nurseSpecificPrefs.some((p) => p.kind === 'DOCTOR' && p.refId === editorTargetRefId);
      const matchesSpec = nurseSpecificPrefs.some(
        (p) => p.kind === 'SPECIALTY' && (selDocSpecIds.includes(p.refId) || selDocSpecIds.some((sid) => matchesCode(p.refId, specialtyMap.get(sid))))
      );
      if (!matchesDoc && !matchesSpec)
        return `${selDoc ? withDr(selDoc.fullName) : 'This doctor'} is not one of ${activeNurse?.fullName}'s usual doctors or departments. This will show as a problem.`;
    } else if (editorKind === 'SPECIALTY') {
      const selSpec = specialties.find((sp) => sp.id === editorTargetRefId);
      const matchesSpec = nurseSpecificPrefs.some((p) => p.kind === 'SPECIALTY' && (p.refId === editorTargetRefId || matchesCode(p.refId, selSpec)));
      if (!matchesSpec) return `${selSpec?.name || 'This department'} is not one of ${activeNurse?.fullName}'s usual departments. This will show as a problem.`;
    }
    return '';
  })();

  const usual = nurseSpecificPrefs
    .map((p) => {
      if (p.kind === 'DOCTOR') {
        const doc = doctorMap.get(p.refId);
        return `${doc ? withDr(doc.fullName) : 'A doctor'} (number ${p.rank})`;
      }
      const sp = specialtyMap.get(p.refId);
      return `${sp ? sp.name : 'A department'} (number ${p.rank})`;
    })
    .join(', ');

  const leaveType = leaveTypes.find((l) => l.id === editorLeaveTypeId);
  const holiday = holidayByDate.get(editorTarget.date);
  const typeHours = typeof leaveType?.creditedHours === 'number' ? leaveType.creditedHours : 8;
  // A public holiday counts 0 h: the period hours already leave it out.
  const defaultHours = holiday ? 0 : typeHours;

  return (
    <Dialog
      open
      onClose={onClose}
      title={`${activeNurse?.fullName || 'Nurse'}, ${formatDayDate(editorTarget.date)}`}
      description="Choose a shift, a leave or a day off."
      footer={
        <>
          <Button icon={Trash2} onClick={onClear} className="sm:mr-auto">
            Clear the day
          </Button>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Check} onClick={save}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-5 text-sm">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-sunken p-1" role="group" aria-label="Shift or leave">
          {(
            [
              ['DUTY', 'Shift', Stethoscope],
              ['LEAVE', 'Leave or day off', Calendar],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={editorCategory === id}
              onClick={() => setEditorCategory(id)}
              className={cx(
                'flex min-h-9 items-center justify-center gap-2 rounded-md px-3 font-semibold transition-colors',
                editorCategory === id ? 'bg-surface text-brand-strong shadow-card' : 'text-ink-muted hover:text-ink'
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {editorCategory === 'DUTY' && (
          <>
            <fieldset className="space-y-2">
              <legend className="mb-2 font-semibold text-ink">The shift</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {dutyWindows.map((dw) => (
                  <button key={dw.id} type="button" aria-pressed={editorDutyId === dw.id} onClick={() => setEditorDutyId(dw.id)} className={choiceClass(editorDutyId === dw.id)}>
                    <span className="flex items-center gap-2 font-semibold text-ink">
                      <span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ backgroundColor: dw.color || '#1e40af' }} />
                      {dw.name} ({dw.acronym})
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {dw.startTime} to {dw.endTime}
                    </span>
                    {dw.isPriority && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-warning">
                        <Star aria-hidden="true" className="size-3" /> Used first
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="mb-2 font-semibold text-ink">Who or what the nurse works with</legend>
              {isTargetExclusiveNC && (editorKind === 'DOCTOR' || editorKind === 'SPECIALTY') && (
                <Notice tone="warning" title="Works in Nurse Clinic only">
                  {activeNurse?.fullName} works in Nurse Clinic only, with no doctor. Putting them with a doctor or a department will show as a problem.
                </Notice>
              )}
              {mismatch && (
                <Notice tone="danger" title="Not one of this nurse's usual doctors">
                  {mismatch}
                </Notice>
              )}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(['DOCTOR', 'CLINICAL_ROLE', 'SPECIALTY'] as AssignmentKind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={editorKind === k}
                    onClick={() => {
                      setEditorKind(k);
                      if (k === 'DOCTOR') setEditorTargetRefId(doctors[0]?.id || '');
                      if (k === 'CLINICAL_ROLE') setEditorTargetRefId(roles[0]?.id || '');
                      if (k === 'SPECIALTY') setEditorTargetRefId(specialties[0]?.id || '');
                    }}
                    className={cx(choiceClass(editorKind === k), 'py-2 text-center font-semibold text-ink')}
                  >
                    {k === 'CLINICAL_ROLE' ? (isTargetExclusiveNC ? 'Clinic task (Nurse Clinic)' : 'Clinic task') : k === 'DOCTOR' ? 'With a doctor' : 'Department (any doctor)'}
                  </button>
                ))}
              </div>
              <Field label={editorKind === 'DOCTOR' ? 'Doctor' : editorKind === 'CLINICAL_ROLE' ? 'Clinic task' : 'Department'} hint={usual ? `Usually works with: ${usual}` : undefined}>
                {(f) => (
                  <Select {...f} value={editorTargetRefId} onChange={(e) => setEditorTargetRefId(e.target.value)}>
                    {editorKind === 'DOCTOR' &&
                      doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.fullName} ({specialties.find((sp) => sp.id === d.specialtyIds[0])?.name || 'Clinic'})
                        </option>
                      ))}
                    {editorKind === 'CLINICAL_ROLE' &&
                      roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.acronym}), {r.defaultStartTime || '09:00'} to {r.defaultEndTime || '13:00'}
                        </option>
                      ))}
                    {editorKind === 'SPECIALTY' &&
                      specialties.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} ({sp.code}), any doctor
                        </option>
                      ))}
                  </Select>
                )}
              </Field>
            </fieldset>
          </>
        )}

        {editorCategory === 'LEAVE' && (
          <>
            <fieldset className="space-y-2">
              <legend className="mb-2 font-semibold text-ink">The leave or day off</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {leaveTypes.map((lt) => (
                  <button key={lt.id} type="button" aria-pressed={editorLeaveTypeId === lt.id} onClick={() => setEditorLeaveTypeId(lt.id)} className={choiceClass(editorLeaveTypeId === lt.id)}>
                    <span className="flex items-center gap-2">
                      <span className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ backgroundColor: lt.color || '#f59e0b', color: readableTextOn(lt.color || '#f59e0b') }}>
                        {lt.acronym}
                      </span>
                      <span className="min-w-0 font-semibold break-words text-ink">{lt.name}</span>
                    </span>
                    <span className="mt-1 block text-xs text-ink-muted">{typeof lt.creditedHours === 'number' ? `${lt.creditedHours} h a day` : '8 h a day'}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            {leaveType && leaveType.countsTowardHoursTarget === false ? (
              <p className="text-ink-muted">This leave doesn't count toward the goal hours.</p>
            ) : (
              <Field
                label="Hours counted for this day"
                optional
                hint={
                  editorLeaveHours.trim() === ''
                    ? holiday
                      ? `Public holiday (${holiday.name}): 0 h. The period hours already leave it out.`
                      : `Empty uses the kind of leave's ${defaultHours} h (Settings, Leave types).`
                    : `Only this day, for this nurse. The usual is ${defaultHours} h.`
                }
              >
                {(f) => (
                  <div className="flex items-center gap-2">
                    <Input {...f} type="number" min={0} max={24} step={0.5} value={editorLeaveHours} onChange={(e) => setEditorLeaveHours(e.target.value)} placeholder={String(defaultHours)} className="w-24" />
                    {editorLeaveHours.trim() !== '' && (
                      <Button size="sm" variant="ghost" onClick={() => setEditorLeaveHours('')}>
                        Use the usual hours
                      </Button>
                    )}
                  </div>
                )}
              </Field>
            )}
          </>
        )}

        <Checkbox
          checked={!editorAllowOverwrite}
          onChange={(e) => setEditorAllowOverwrite(!e.target.checked)}
          label="Keep this when the roster is filled again"
          hint="Ticked, this day is pinned and Fill roster leaves it as it is. Not ticked, Fill roster may change it."
        />
        <Field label="Note" optional hint="For example: swapped with Fatma.">
          {(f) => <Input {...f} value={editorNote} onChange={(e) => setEditorNote(e.target.value)} />}
        </Field>
      </div>
    </Dialog>
  );
};
