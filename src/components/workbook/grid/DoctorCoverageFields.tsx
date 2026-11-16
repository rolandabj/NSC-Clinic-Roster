import type { Doctor, DoctorCoverageInterval, DoctorSession, DutyWindow } from '../../../types';
import { useId } from 'react';
import { doctorSessionsOn } from '../../../services/engine/clinicModel';
import { Button, Field, Input } from '../../ui';

interface DoctorCoverageFieldsProps {
  doctorIds: string[];
  doctors: readonly Pick<Doctor, 'id' | 'fullName'>[];
  value: DoctorCoverageInterval[];
  onChange: (intervals: DoctorCoverageInterval[]) => void;
  date: string;
  duty?: Pick<DutyWindow, 'startTime' | 'endTime'>;
  sessions: readonly DoctorSession[];
  error?: string;
}

/** Exact doctor periods. Controlled time inputs keep incomplete edits visible until validation. */
export function DoctorCoverageFields({ doctorIds, doctors, value, onChange, date, duty, sessions, error }: DoctorCoverageFieldsProps) {
  const errorId = useId();
  const clinics = doctorSessionsOn([...sessions], date);
  const update = (index: number, field: 'startTime' | 'endTime', time: string) =>
    onChange(value.map((row, i) => i === index ? { ...row, [field]: time } : row));
  return <div className="space-y-3">
    {error && <span id={errorId} className="sr-only">{error}</span>}
    <p className="text-ink-muted">Set each doctor's cover times. Duty time outside these periods is Float. Times may meet without overlap.</p>
    {doctorIds.map(doctorId => {
      const name = doctors.find(d => d.id === doctorId)?.fullName || 'Doctor';
      const clinic = clinics.find(s => s.doctorId === doctorId);
      const periods = value.map((row, index) => ({ row, index })).filter(item => item.row.doctorId === doctorId);
      const min = duty && clinic ? (duty.startTime > clinic.startTime ? duty.startTime : clinic.startTime) : duty?.startTime;
      const max = duty && clinic ? (duty.endTime < clinic.endTime ? duty.endTime : clinic.endTime) : duty?.endTime;
      return <fieldset key={doctorId} className="space-y-2 rounded-lg border border-line p-3">
        <legend className="px-1 font-semibold text-ink">{name} cover times</legend>
        <p className="text-xs text-ink-muted">{clinic ? `Clinic ${clinic.startTime} to ${clinic.endTime}.` : 'No active clinic on this day.'}</p>
        {periods.map(({ row, index }, periodIndex) => <div key={index} className="grid grid-cols-2 gap-2">
          <Field label={`${name}, period ${periodIndex + 1} starts`}>
            {f => <Input {...f} type="time" required min={min} max={max} value={row.startTime} aria-invalid={error ? true : undefined}
              aria-describedby={error ? [f['aria-describedby'], errorId].filter(Boolean).join(' ') : f['aria-describedby']}
              onChange={event => update(index, 'startTime', event.target.value)} />}
          </Field>
          <Field label={`${name}, period ${periodIndex + 1} ends`}>
            {f => <Input {...f} type="time" required min={min} max={max} value={row.endTime} aria-invalid={error ? true : undefined}
              aria-describedby={error ? [f['aria-describedby'], errorId].filter(Boolean).join(' ') : f['aria-describedby']}
              onChange={event => update(index, 'endTime', event.target.value)} />}
          </Field>
          {periods.length > 1 && <Button size="sm" variant="ghost" className="col-span-2 justify-self-start"
            aria-label={`Remove ${name} period ${periodIndex + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))}>Remove period</Button>}
        </div>)}
        <Button size="sm" onClick={() => onChange([...value, { doctorId, startTime: '', endTime: '' }])}>
          Add another period for {name}
        </Button>
      </fieldset>;
    })}
  </div>;
}
