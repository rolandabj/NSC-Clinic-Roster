/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Edit Doctor Shift Modal
 * Change a doctor's clinic on one day, or on that weekday every week. On the shared Dialog since
 * Phase 7, slice 3b; a refusal shows in the dialog.
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { Doctor, DoctorSession, Schedule, Specialty } from '../../types';
import {
  WEEKDAY_FULL_NAMES,
  getWeekdayFromIsoDate,
} from '../../services/schedule/doctorScheduleService';
import { formatDate } from '../../utils/dateUtils';
import { Badge, Button, Dialog, Field, Input, Notice, cx } from '../ui';

export interface EditDoctorShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  date: string; // YYYY-MM-DD
  existingSession: DoctorSession | null;
  specialties: Specialty[];
  schedule: Schedule | null;
  onSaveShift: (params: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    specialtyId: string;
    updateScope: 'THIS_DATE_ONLY' | 'RECURRING_ALL_MATCHING_DAYS';
  }) => Promise<void>;
  onDeleteShift: (params: {
    sessionId?: string;
    doctorId: string;
    date: string;
    deleteScope: 'THIS_DATE_ONLY' | 'REMOVE_RECURRING_PATTERN';
  }) => Promise<void>;
}

const TIME_PRESETS = [
  { label: 'Morning', start: '09:00', end: '13:00' },
  { label: 'Afternoon', start: '13:00', end: '17:00' },
  { label: 'Normal day', start: '09:00', end: '17:00' },
  { label: 'Evening', start: '17:00', end: '21:00' },
  { label: 'Long day', start: '09:00', end: '21:00' },
];

export const EditDoctorShiftModal: React.FC<EditDoctorShiftModalProps> = ({
  isOpen,
  onClose,
  doctor,
  date,
  existingSession,
  specialties,
  schedule,
  onSaveShift,
  onDeleteShift,
}) => {
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('13:00');
  const [room, setRoom] = useState<string>('');
  const [specialtyId, setSpecialtyId] = useState<string>('');
  const [updateScope, setUpdateScope] = useState<'THIS_DATE_ONLY' | 'RECURRING_ALL_MATCHING_DAYS'>('THIS_DATE_ONLY');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteScope, setDeleteScope] = useState<'THIS_DATE_ONLY' | 'REMOVE_RECURRING_PATTERN'>('THIS_DATE_ONLY');
  const [formError, setFormError] = useState('');

  const weekdayIndex = date ? getWeekdayFromIsoDate(date) : 0;
  const weekdayName = WEEKDAY_FULL_NAMES[weekdayIndex];

  // Check if doctor has a recurring pattern for this weekday
  const recurringPatternSlot = doctor?.weeklyPattern?.find((p) => p.weekday === weekdayIndex);
  const isExistingRecurring = existingSession?.source === 'PATTERN' || !!recurringPatternSlot;

  useEffect(() => {
    if (isOpen && doctor) {
      if (existingSession) {
        setStartTime(existingSession.startTime);
        setEndTime(existingSession.endTime);
        setRoom(existingSession.room || '');
        // The session keeps the doctor's specialty (it can't be changed here)
        setSpecialtyId(
          existingSession.specialtyId && doctor.specialtyIds.includes(existingSession.specialtyId)
            ? existingSession.specialtyId
            : doctor.specialtyIds[0] || ''
        );
        // A change starts as "this date only"; changing every matching weekday is a deliberate choice.
        setUpdateScope('THIS_DATE_ONLY');
      } else if (recurringPatternSlot) {
        setStartTime(recurringPatternSlot.startTime);
        setEndTime(recurringPatternSlot.endTime);
        setRoom(recurringPatternSlot.room || '');
        setSpecialtyId(doctor.specialtyIds[0] || '');
        setUpdateScope('THIS_DATE_ONLY');
      } else {
        setStartTime('09:00');
        setEndTime('13:00');
        setRoom('');
        setSpecialtyId(doctor.specialtyIds[0] || '');
        setUpdateScope('THIS_DATE_ONLY');
      }
      setShowDeleteConfirm(false);
      setFormError('');
      setIsSaving(false);
      setIsDeleting(false);
    }
  }, [isOpen, doctor, date, existingSession, recurringPatternSlot, specialties]);

  if (!isOpen || !doctor || !date) return null;

  // Calculate duration in hours
  const calculateDuration = () => {
    try {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60;
      return (diff / 60).toFixed(1);
    } catch {
      return '4.0';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime || endTime <= startTime) {
      setFormError('The clinic must end after it starts.');
      return;
    }
    setFormError('');
    setIsSaving(true);
    try {
      await onSaveShift({
        doctorId: doctor.id,
        date,
        startTime,
        endTime,
        room: room.trim(),
        specialtyId: specialtyId || doctor.specialtyIds[0] || '',
        updateScope,
      });
      onClose();
    } catch (err: any) {
      console.error('Failed to save shift:', err);
      setFormError(`The clinic was not saved: ${err.message || 'try again'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteShift({
        sessionId: existingSession?.id,
        doctorId: doctor.id,
        date,
        deleteScope,
      });
      onClose();
    } catch (err: any) {
      console.error('Failed to delete shift:', err);
      setFormError(`The clinic was not removed: ${err.message || 'try again'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const specialty = specialties.find((x) => x.id === specialtyId);
  const radioRow = (on: boolean) => cx('flex items-start gap-3 rounded-lg border p-3', on ? 'border-brand bg-brand-soft' : 'border-line hover:bg-sunken');

  return (
    <Dialog
      open
      onClose={onClose}
      title={existingSession ? "Change the doctor's clinic" : "Add a doctor's clinic"}
      description={`${doctor.fullName}, ${weekdayName} ${formatDate(date)}`}
      footer={
        <>
          {existingSession && !showDeleteConfirm && (
            <Button icon={Trash2} onClick={() => setShowDeleteConfirm(true)} className="sm:mr-auto">
              Remove the clinic
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="doctor-shift" icon={CheckCircle2} busy={isSaving}>
            Save
          </Button>
        </>
      }
    >
      <form id="doctor-shift" onSubmit={handleSave} noValidate className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-sunken p-3">
          <span>
            <span className="block text-ink-muted">Now on {formatDate(date)}</span>
            <span className="font-semibold text-ink">
              {existingSession ? `${existingSession.startTime} to ${existingSession.endTime}${existingSession.room ? `, ${existingSession.room}` : ''}` : 'No clinic'}
            </span>
          </span>
          <span className="flex flex-wrap gap-2">
            {isExistingRecurring && <Badge tone="brand">Every {weekdayName}</Badge>}
            <Badge>{calculateDuration().replace(/\.0$/, '')} hours</Badge>
          </span>
        </div>

        <fieldset>
          <legend className="mb-2 font-semibold text-ink">Usual times</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TIME_PRESETS.map((p) => {
              const on = startTime === p.start && endTime === p.end;
              return (
                <button
                  key={p.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setStartTime(p.start);
                    setEndTime(p.end);
                  }}
                  className={cx('rounded-lg border p-2.5 text-left', on ? 'border-brand bg-brand-soft ring-1 ring-brand' : 'border-line hover:bg-sunken')}
                >
                  <span className="block font-semibold text-ink">{p.label}</span>
                  <span className="block text-xs text-ink-muted">
                    {p.start} to {p.end}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start time">{(f) => <Input {...f} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />}</Field>
          <Field label="End time">{(f) => <Input {...f} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />}</Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Room" optional hint="For example: Room 2.">
            {(f) => <Input {...f} value={room} onChange={(e) => setRoom(e.target.value)} />}
          </Field>
          <div>
            <p className="mb-1 font-semibold text-ink">Specialty</p>
            <p className="text-ink-muted">{specialty ? `${specialty.name} (${specialty.code})` : "No specialty in the doctor's profile"}</p>
            <p className="text-xs text-ink-muted">Set in the doctor's profile on the Doctors screen.</p>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-2 font-semibold text-ink">Which days to change</legend>
          <label className={radioRow(updateScope === 'THIS_DATE_ONLY')}>
            <input type="radio" name="updateScope" className="mt-0.5 size-4 accent-brand" checked={updateScope === 'THIS_DATE_ONLY'} onChange={() => setUpdateScope('THIS_DATE_ONLY')} />
            <span>
              <span className="block font-semibold text-ink">This day only ({formatDate(date)})</span>
              <span className="block text-xs text-ink-muted">Other {weekdayName}s stay as they are.</span>
            </span>
          </label>
          <label className={radioRow(updateScope === 'RECURRING_ALL_MATCHING_DAYS')}>
            <input
              type="radio"
              name="updateScope"
              className="mt-0.5 size-4 accent-brand"
              checked={updateScope === 'RECURRING_ALL_MATCHING_DAYS'}
              onChange={() => setUpdateScope('RECURRING_ALL_MATCHING_DAYS')}
            />
            <span>
              <span className="block font-semibold text-ink">Every {weekdayName}</span>
              <span className="block text-xs text-ink-muted">
                Changes {doctor.fullName}&apos;s usual week, and every {weekdayName} on this roster.
              </span>
            </span>
          </label>
        </fieldset>

        {showDeleteConfirm && (
          <div role="group" aria-label="Remove the clinic" className="space-y-3 rounded-lg border border-danger-line/40 bg-danger-soft p-3">
            <p className="font-semibold text-ink">Which of {doctor.fullName}&apos;s clinics should be removed?</p>
            <label className="flex items-center gap-2">
              <input type="radio" name="deleteScope" className="size-4 accent-brand" checked={deleteScope === 'THIS_DATE_ONLY'} onChange={() => setDeleteScope('THIS_DATE_ONLY')} />
              Only on {formatDate(date)}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="deleteScope"
                className="size-4 accent-brand"
                checked={deleteScope === 'REMOVE_RECURRING_PATTERN'}
                onChange={() => setDeleteScope('REMOVE_RECURRING_PATTERN')}
              />
              Every {weekdayName} (also removed from the usual week)
            </label>
            <div className="flex flex-wrap gap-2">
              <Button variant="danger" size="sm" busy={isDeleting} onClick={handleDelete}>
                Remove
              </Button>
              <Button size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Keep the clinic
              </Button>
            </div>
          </div>
        )}
        {formError && <Notice tone="danger" live title={formError} />}
      </form>
    </Dialog>
  );
};
