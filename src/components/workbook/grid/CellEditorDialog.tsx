import React, { useId, useState } from 'react';
import { AlertTriangle, Calendar, Check, Lock, Star, Stethoscope, Trash2, X } from 'lucide-react';
import type { AssignmentKind, ClinicalRole, Doctor, DutyWindow, LeaveType, Nurse, PublicHoliday, Specialty } from '../../../types';
import { isExclusiveNurseClinic } from '../../../services/engine/nurseClinicUtils';
import { useDialogA11y } from '../../common/useDialogA11y';
import { formatDate } from '../../../utils/dateUtils';

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
 * filled again; leave hours for the day; and a note.
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
  // Esc, focus trap and focus restore.
  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(true, onClose);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-100">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-xs animate-in zoom-in-95 duration-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span id={titleId} className="font-bold text-slate-900 text-sm">
                {nurseMap.get(editorTarget.nurseId)?.fullName}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                {formatDate(editorTarget.date)}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Choose a shift or leave for this day.
            </span>
          </div>
          <button
            onClick={() => onClose()}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 cursor-pointer"
            aria-label="Close editor"
            title="Close editor"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Category Segmented Tabs: Duty Shift vs Leave / Day Off */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setEditorCategory('DUTY')}
            className={`py-2 px-3 rounded-md font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              editorCategory === 'DUTY'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Shift</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorCategory('LEAVE')}
            className={`py-2 px-3 rounded-md font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              editorCategory === 'LEAVE'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Leave or day off</span>
          </button>
        </div>

        {/* DUTY SHIFT CONFIGURATION */}
        {editorCategory === 'DUTY' && (
          <div className="space-y-3.5 animate-in fade-in duration-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                1. Choose the shift
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dutyWindows.map((dw) => {
                  const isSelected = editorDutyId === dw.id;
                  return (
                    <button
                      key={dw.id}
                      type="button"
                      onClick={() => setEditorDutyId(dw.id)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-bold text-xs"
                          style={{ color: dw.color || '#1e40af' }}
                        >
                          {dw.name} ({dw.acronym})
                        </span>
                        {dw.isPriority ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100/80 border border-amber-200 px-1.5 py-0.2 rounded">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                            Used first
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {dw.startTime} to {dw.endTime}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                2. Who or what the nurse works with
              </label>
              {(() => {
                const activeNurse = editorTarget ? nurseMap.get(editorTarget.nurseId) : undefined;
                const isTargetExclusiveNC = activeNurse ? isExclusiveNurseClinic(activeNurse, roles) : false;

                return (
                  <>
                    {isTargetExclusiveNC && (editorKind === 'DOCTOR' || editorKind === 'SPECIALTY') && (
                      <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-start gap-2 mb-2 animate-in fade-in duration-100">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block text-[11px]">
                            Works in Nurse Clinic only
                          </span>
                          <span className="text-[10px] text-amber-800 leading-tight block">
                            {activeNurse?.fullName} works in Nurse Clinic only, with no doctor. Putting them with a doctor or a department will show as a problem.
                          </span>
                        </div>
                      </div>
                    )}
                    {(() => {
                      const nurseSpecificPrefs = activeNurse?.preferences?.filter(
                        (p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY'
                      ) || [];

                      if (!isTargetExclusiveNC && nurseSpecificPrefs.length > 0) {
                        let isMismatch = false;
                        let warnText = '';

                        if (editorKind === 'DOCTOR') {
                          const selDoc = doctors.find((d) => d.id === editorTargetRefId);
                          const selDocSpecIds = selDoc?.specialtyIds || [];
                          const matchesDoc = nurseSpecificPrefs.some((p) => p.kind === 'DOCTOR' && p.refId === editorTargetRefId);
                          const matchesSpec = nurseSpecificPrefs.some((p) => {
                            if (p.kind !== 'SPECIALTY') return false;
                            if (selDocSpecIds.includes(p.refId)) return true;
                            const pRefLower = p.refId.toLowerCase();
                            for (const sid of selDocSpecIds) {
                              const sObj = specialtyMap.get(sid);
                              if (sObj) {
                                if (
                                  pRefLower === sObj.code.toLowerCase() ||
                                  pRefLower === sObj.name.toLowerCase() ||
                                  (sObj.code.toLowerCase() === 'pcc' && pRefLower.includes('pcc')) ||
                                  (sObj.code.toLowerCase() === 'ped' && (pRefLower.includes('ped') || pRefLower.includes('pedia')))
                                ) {
                                  return true;
                                }
                              }
                            }
                            return false;
                          });

                          if (!matchesDoc && !matchesSpec) {
                            isMismatch = true;
                            warnText = `${selDoc ? withDr(selDoc.fullName) : 'This doctor'} is not one of ${activeNurse?.fullName}'s usual doctors or departments. This will show as a problem.`;
                          }
                        } else if (editorKind === 'SPECIALTY') {
                          const selSpec = specialties.find((s) => s.id === editorTargetRefId);
                          const matchesSpec = nurseSpecificPrefs.some((p) => {
                            if (p.kind !== 'SPECIALTY') return false;
                            if (p.refId === editorTargetRefId) return true;
                            if (selSpec) {
                              const pRefLower = p.refId.toLowerCase();
                              if (
                                pRefLower === selSpec.code.toLowerCase() ||
                                pRefLower === selSpec.name.toLowerCase() ||
                                (selSpec.code.toLowerCase() === 'pcc' && pRefLower.includes('pcc')) ||
                                (selSpec.code.toLowerCase() === 'ped' && (pRefLower.includes('ped') || pRefLower.includes('pedia')))
                              ) {
                                return true;
                              }
                            }
                            return false;
                          });

                          if (!matchesSpec) {
                            isMismatch = true;
                            warnText = `${selSpec?.name || 'This department'} is not one of ${activeNurse?.fullName}'s usual departments. This will show as a problem.`;
                          }
                        }

                        if (isMismatch) {
                          return (
                            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-900 text-xs flex items-start gap-2 mb-2 animate-in fade-in duration-100">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold block text-[11px]">
                                  Not one of this nurse’s usual doctors
                                </span>
                                <span className="text-[10px] text-rose-800 leading-tight block">
                                  {warnText}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      }
                      return null;
                    })()}
                    <div className="grid grid-cols-3 gap-1.5 mb-2">
                      {(['DOCTOR', 'CLINICAL_ROLE', 'SPECIALTY'] as AssignmentKind[]).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => {
                            setEditorKind(k);
                            if (k === 'DOCTOR') setEditorTargetRefId(doctors[0]?.id || '');
                            if (k === 'CLINICAL_ROLE') setEditorTargetRefId(roles[0]?.id || '');
                            if (k === 'SPECIALTY') setEditorTargetRefId(specialties[0]?.id || '');
                          }}
                          className={`py-1.5 rounded-md border text-xs font-semibold cursor-pointer text-center transition-all ${
                            editorKind === k
                              ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {k === 'CLINICAL_ROLE' ? (isTargetExclusiveNC ? 'Clinic task (Nurse Clinic)' : 'Clinic task') : k === 'DOCTOR' ? 'With a doctor' : 'Department (any doctor)'}
                        </button>
                      ))}
                    </div>
                  </>
                );
              })()}

              <select
                aria-label="Who or what the nurse works with"
                value={editorTargetRefId}
                onChange={(e) => setEditorTargetRefId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-medium text-slate-800"
              >
                {editorKind === 'DOCTOR' &&
                  doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({specialties.find((s) => s.id === d.specialtyIds[0])?.name || 'Clinic'})
                    </option>
                  ))}
                {editorKind === 'CLINICAL_ROLE' &&
                  roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.acronym}) · {r.defaultStartTime || '09:00'} to {r.defaultEndTime || '13:00'}
                    </option>
                  ))}
                {editorKind === 'SPECIALTY' &&
                  specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code}), any doctor
                    </option>
                  ))}
              </select>
              {(() => {
                const activeNurse = editorTarget ? nurseMap.get(editorTarget.nurseId) : undefined;
                const nurseSpecificPrefs = activeNurse?.preferences?.filter(
                  (p) => p.kind === 'DOCTOR' || p.kind === 'SPECIALTY'
                ) || [];
                if (nurseSpecificPrefs.length > 0) {
                  const tags = nurseSpecificPrefs.map((p) => {
                    if (p.kind === 'DOCTOR') {
                      const doc = doctorMap.get(p.refId);
                      return `${doc ? withDr(doc.fullName) : 'A doctor'} (#${p.rank})`;
                    } else {
                      const sp = specialtyMap.get(p.refId);
                      return `${sp ? sp.name : 'Specialty'} (#${p.rank})`;
                    }
                  }).join(', ');
                  return (
                    <div className="mt-1 text-[10px] text-indigo-700 bg-indigo-50/60 rounded px-2 py-0.5 border border-indigo-100">
                      <strong>Usually works with:</strong> {tags}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

        {/* LEAVE / DAY OFF CONFIGURATION */}
        {editorCategory === 'LEAVE' && (
          <div className="space-y-3.5 animate-in fade-in duration-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                1. Choose the leave or day off
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {leaveTypes.map((lt) => {
                  const isSelected = editorLeaveTypeId === lt.id;
                  return (
                    <button
                      key={lt.id}
                      type="button"
                      onClick={() => setEditorLeaveTypeId(lt.id)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="font-bold text-[10px] px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: lt.color || '#f59e0b' }}
                        >
                          {lt.acronym}
                        </span>
                        <span className="font-bold text-slate-800 text-xs truncate">
                          {lt.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {typeof lt.creditedHours === 'number' ? `${lt.creditedHours} h a day` : '8 h a day'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {(() => {
              const lt = leaveTypes.find((l) => l.id === editorLeaveTypeId);
              if (lt && lt.countsTowardHoursTarget === false) {
                return <p className="text-[11px] text-slate-500">This leave doesn't count toward the hours goal.</p>;
              }
              const typeHours = typeof lt?.creditedHours === 'number' ? lt.creditedHours : 8;
              const holiday = editorTarget ? holidayByDate.get(editorTarget.date) : undefined;
              // A public holiday counts 0 h: the period hours already leave it out.
              const def = holiday ? 0 : typeHours;
              return (
                <div>
                  <label htmlFor="editor-leave-hours" className="block font-semibold text-slate-700 mb-1">
                    Hours counted for this day
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="editor-leave-hours"
                      type="number"
                      min={0}
                      max={24}
                      step={0.5}
                      value={editorLeaveHours}
                      onChange={(e) => setEditorLeaveHours(e.target.value)}
                      placeholder={String(def)}
                      className="w-20 px-2 py-1 border border-slate-300 rounded font-mono text-center"
                    />
                    <span className="text-[11px] text-slate-500">
                      {editorLeaveHours.trim() === ''
                        ? holiday
                          ? `Public holiday (${holiday.name}): 0 h, the period hours already leave it out`
                          : `Default: ${def} h (Settings > Leave types)`
                        : `Only this day, for this nurse. Default is ${def} h.`}
                    </span>
                    {editorLeaveHours.trim() !== '' && (
                      <button
                        type="button"
                        onClick={() => setEditorLeaveHours('')}
                        className="text-[11px] text-indigo-700 underline cursor-pointer"
                      >
                        Use default
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Kept when the roster is filled again (pinned) */}
        <div className="pt-2 border-t border-slate-100">
          <label htmlFor="editor-keep-cell" className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
            <input
              id="editor-keep-cell"
              type="checkbox"
              checked={!editorAllowOverwrite}
              onChange={(e) => setEditorAllowOverwrite(!e.target.checked)}
              aria-describedby="editor-keep-cell-help"
              className="w-4 h-4 accent-amber-600 cursor-pointer"
            />
            <Lock className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>Keep this when the roster is filled again</span>
          </label>
          <p id="editor-keep-cell-help" className="text-[11px] text-slate-500 mt-1 ml-6">
            Ticked, this day is pinned and Fill roster leaves it as it is. Not ticked, Fill roster may change it.
          </p>
        </div>

        {/* Note */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Note (optional)
          </label>
          <input
            type="text"
            value={editorNote}
            onChange={(e) => setEditorNote(e.target.value)}
            aria-label="Note (optional)"
            placeholder="For example: swapped with Fatma"
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
          />
        </div>

        {/* Footer Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (editorTarget) {
                onClear();
              }
            }}
            className="text-red-600 hover:text-red-700 font-semibold cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
