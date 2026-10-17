/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * New roster dialog: dates, how many weeks each page of the roster shows,
 * the full time hours goal, and whether to fill the shifts straight away.
 */

import { findRangeConflict } from '../../services/schedule/scheduleRanges';
import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Sparkles } from 'lucide-react';
import { Schedule, BlockWeeks, WorkingHoursPeriod, Doctor } from '../../types';
import { getRepository } from '../../services/repository';
import {
  calculateWorkingHoursForDateRange,
  WorkingHoursCalculationResult,
} from '../../services/periods/workingHoursPeriodService';
import {
  generateDoctorSessionsForDateRange,
  populateRecurringDoctorSessionsForSchedule,
} from '../../services/schedule/doctorScheduleService';
import { formatDate, formatDayDate } from '../../utils/dateUtils';
import { suggestRosterName } from '../../services/schedule/rosterName';
import { Badge, Button, Checkbox, DateInput, Dialog, Field, Input, Notice, Select, cx } from '../ui';
import { authService } from '../../services/auth/authService';
import { suggestNewRosterDates } from '../../services/schedule/newRosterDates';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreated: (createdSchedule: Schedule, generateImmediately: boolean) => void;
  clinicName?: string;
  existingSchedules?: Schedule[];
  /** Opens a roster that already covers these dates instead of making a new one. */
  onOpenExisting?: (schedule: Schedule) => void;
}

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  onScheduleCreated,
  clinicName = (typeof window !== 'undefined' ? localStorage.getItem('clinic_roster_clinic_name') : null) || 'American Hospital Nad Al Sheba OutPatient clinic',
  existingSchedules = [],
  onOpenExisting,
}) => {
  // The new roster starts the day after the last one ends.
  const [suggested] = useState(() => suggestNewRosterDates(existingSchedules));

  const [startDate, setStartDate] = useState(suggested.start);
  const [endDate, setEndDate] = useState(suggested.end);
  const [scheduleName, setScheduleName] = useState('');
  const [isNameManuallyEdited, setIsNameManuallyEdited] = useState(false);
  const [blockWeeks, setBlockWeeks] = useState<BlockWeeks>(2);
  const [hoursTarget, setHoursTarget] = useState<string | number>('');
  const [generateImmediately, setGenerateImmediately] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dedicated Roster Periods
  const [workingHoursPeriods, setWorkingHoursPeriods] = useState<WorkingHoursPeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');

  // Active Doctors & Recurring Schedule Auto-Fill
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [autoFillDoctorSchedules, setAutoFillDoctorSchedules] = useState<boolean>(true);

  useEffect(() => {
    const repo = getRepository();
    repo.list('workingHoursPeriods').then((list) => {
      const sorted = [...list].sort((a, b) => a.startDate.localeCompare(b.startDate));
      setWorkingHoursPeriods(sorted);
      // A working hours period that starts on the suggested date gives the end date.
      const period = sorted.find((p) => p.startDate === suggested.start);
      if (period) setEndDate((current) => (current === suggested.end ? period.endDate : current));
    }).catch((err) => {
      console.error('Failed to load working hours periods:', err);
    });

    repo.list('doctors').then((docList) => {
      setDoctors(docList);
    }).catch((err) => {
      console.error('Failed to load doctors in CreateScheduleModal:', err);
    });
  }, []);

  // Compute duration metrics
  const getDurationMetrics = (startStr: string, endStr: string, blocks: number) => {
    if (!startStr || !endStr) {
      return { totalDays: 0, weeks: 0, numBlocks: 0, isValid: false, suggestedHours: 160 };
    }
    const start = new Date(startStr + 'T00:00:00Z');
    const end = new Date(endStr + 'T00:00:00Z');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { totalDays: 0, weeks: 0, numBlocks: 0, isValid: false, suggestedHours: 160 };
    }

    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) {
      return { totalDays: 0, weeks: 0, numBlocks: 0, isValid: false, suggestedHours: 160 };
    }

    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
    const weeks = parseFloat((totalDays / 7).toFixed(1));
    const blockSizeDays = blocks * 7;
    const numBlocks = Math.ceil(totalDays / blockSizeDays);

    // Standard clinical outpatient target: ~40h/week (8h/day x 5 working days per 7 calendar days)
    const suggestedHours = Math.max(24, Math.round((totalDays * 8 * 5) / 7));

    return {
      totalDays,
      weeks,
      numBlocks,
      isValid: true,
      suggestedHours,
      startFormatted: formatDayDate(startStr),
      endFormatted: formatDayDate(endStr),
    };
  };

  const metrics = getDurationMetrics(startDate, endDate, blockWeeks);

  // Real-time calculation triggers calculateWorkingHoursForDateRange
  const periodCalculation: WorkingHoursCalculationResult | null = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) return null;
    return calculateWorkingHoursForDateRange(startDate, endDate, workingHoursPeriods);
  }, [startDate, endDate, workingHoursPeriods]);

  // Live estimate of recurring doctor sessions across the chosen date span
  const estimatedDoctorSessionsCount: number = useMemo(() => {
    if (!metrics.isValid || !startDate || !endDate || doctors.length === 0) return 0;
    return generateDoctorSessionsForDateRange(startDate, endDate, doctors).length;
  }, [metrics.isValid, startDate, endDate, doctors]);

  // The name offered for the roster: plain words, no dashes (services/schedule/rosterName).
  const generateSuggestedName = (startStr: string, endStr: string) => suggestRosterName(startStr, endStr);

  // Sync schedule name and suggested/prorated hours when dates change
  useEffect(() => {
    if (metrics.isValid) {
      if (!isNameManuallyEdited) {
        setScheduleName(generateSuggestedName(startDate, endDate));
      }
      if (periodCalculation) {
        setHoursTarget(periodCalculation.targetHours > 0 ? periodCalculation.targetHours : metrics.suggestedHours);
        if (periodCalculation.isExactMatch && periodCalculation.matchedPeriod) {
          setSelectedPeriodId(periodCalculation.matchedPeriod.id);
        } else {
          setSelectedPeriodId('');
        }
      } else {
        setHoursTarget(metrics.suggestedHours);
      }
    }
  }, [startDate, endDate, periodCalculation?.targetHours]);

  // Apply Quick Dedicated Period Preset
  const handleSelectDedicatedPeriodPreset = (periodId: string) => {
    setSelectedPeriodId(periodId);
    if (!periodId) return;
    const p = workingHoursPeriods.find((item) => item.id === periodId);
    if (!p) return;
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setHoursTarget(p.workingHours);
    setIsNameManuallyEdited(false);
    setScheduleName(`${p.name} ${p.year}`);
  };

  // Check for date range overlap with existing schedules
  const candidateRange = { id: '', name: '', startDate, endDate };
  const overlappingSchedule = startDate && endDate ? (findRangeConflict(candidateRange, existingSchedules) as Schedule | undefined) : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!startDate || !endDate) {
      setErrorMessage(`Enter the ${!startDate ? 'first' : 'last'} day, like 16-11-2026.`);
      return;
    }

    if (startDate > endDate) {
      setErrorMessage('The last day is before the first day.');
      return;
    }

    if (!scheduleName.trim()) {
      setErrorMessage('Give the roster a name.');
      return;
    }

    if (metrics.totalDays < 3) {
      setErrorMessage('A roster must be at least 3 days long.');
      return;
    }

    const parsedTargetHours = parseFloat(String(hoursTarget).trim());
    if (isNaN(parsedTargetHours) || parsedTargetHours < 0) {
      setErrorMessage('Enter the goal hours for a full time nurse as a number, for example 160, 176 or 227.');
      return;
    }

    setIsSubmitting(true);

    try {
      const repo = getRepository();
      const latestSchedules = await repo.list('schedules');
      const conflict = findRangeConflict(candidateRange, latestSchedules);
      if (conflict) throw new Error(`These dates overlap "${conflict.name}". Open that roster or choose different dates.`);
      const user = authService.getCurrentUser();
      const author = user?.name || user?.email || 'Planner';

      const newSchedule = await repo.create('schedules', {
        name: scheduleName.trim(),
        startDate,
        endDate,
        blockWeeks,
        hoursTargetFullTime: Math.round(parsedTargetHours),
        workingHoursPeriodId: periodCalculation?.isExactMatch ? periodCalculation.matchedPeriod?.id : undefined,
        periodName: periodCalculation?.isExactMatch
          ? periodCalculation.matchedPeriod?.name
          : periodCalculation?.isProrated
          ? `${metrics.totalDays} days, part of a period · ${Math.round(parsedTargetHours)}h`
          : undefined,
        status: 'DRAFT',
        activeVersionNumber: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Initialize checkpoint v1
      await repo.create('versions', {
        scheduleId: newSchedule.id,
        number: 1,
        timestamp: new Date().toISOString(),
        author,
        note: `Roster created (${formatDate(startDate)} to ${formatDate(endDate)})`,
        snapshot: {
          schedule: newSchedule,
          assignments: [],
          leaveEntries: [],
          locks: [],
          rulesSnapshot: [],
        },
        isPublished: false,
      });

      // Auto-fill recurring doctor clinic sessions for schedule duration
      let populatedDoctorSessionsCount = 0;
      if (autoFillDoctorSchedules && doctors.length > 0) {
        try {
          const docFillResult = await populateRecurringDoctorSessionsForSchedule({
            repo,
            startDate,
            endDate,
            doctors,
          });
          populatedDoctorSessionsCount = docFillResult.createdCount;
        } catch (docErr) {
          console.error('Failed to auto-populate doctor sessions:', docErr);
        }
      }

      // Log audit trail
      await repo.create('audit', {
        actor: author,
        action: 'CREATE',
        entity: 'Schedule',
        entityId: newSchedule.id,
        note: `Created the roster "${newSchedule.name}" from ${formatDate(startDate)} to ${formatDate(endDate)} (${metrics.totalDays} days, ${blockWeeks} ${blockWeeks === 1 ? 'week' : 'weeks'} on each page, a goal of ${parsedTargetHours} h${
          autoFillDoctorSchedules ? `, ${populatedDoctorSessionsCount} doctors' clinics added from their usual weeks` : ", doctors' clinics not added"
        }).`,
        timestamp: new Date().toISOString(),
      });

      onScheduleCreated(newSchedule, generateImmediately);
      onClose();
    } catch (err: any) {
      setErrorMessage(`Couldn't create the roster: ${err.message || 'unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const halfTime = String(hoursTarget).trim() !== '' && !isNaN(parseFloat(String(hoursTarget))) ? (parseFloat(String(hoursTarget)) * 0.5).toFixed(1).replace(/\.0$/, '') : '';
  const startChoice = (on: boolean) => cx('flex items-start gap-3 rounded-lg border p-3', on ? 'border-brand bg-brand-soft' : 'border-line hover:bg-sunken');

  return (
    <Dialog
      open
      onClose={() => !isSubmitting && onClose()}
      size="lg"
      title="New roster"
      description="Choose the dates, how many weeks each page shows, and the goal hours of a full time nurse."
      footer={
        <>
          <Button disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="new-roster"
            icon={generateImmediately ? Sparkles : PlusCircle}
            busy={isSubmitting}
            disabled={!metrics.isValid || !!overlappingSchedule}
          >
            {generateImmediately ? 'Create and fill roster' : 'Create empty roster'}
          </Button>
        </>
      }
    >
      <form id="new-roster" onSubmit={handleSubmit} noValidate className="space-y-5 text-sm">
        {workingHoursPeriods.length > 0 && (
          <Field label="Use a saved time period" optional hint="Fills in the dates and the goal hours.">
            {(f) => (
              <Select {...f} value={selectedPeriodId} onChange={(e) => handleSelectDedicatedPeriodPreset(e.target.value)}>
                <option value="">None</option>
                {workingHoursPeriods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.year} ({formatDate(p.startDate)} to {formatDate(p.endDate)}), {p.workingHours} h full time
                  </option>
                ))}
              </Select>
            )}
          </Field>
        )}

        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold text-ink">Dates</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First day" hint={metrics.isValid ? metrics.startFormatted : undefined}>
              {(f) => <DateInput {...f} value={startDate} onChange={setStartDate} />}
            </Field>
            <Field label="Last day" hint={metrics.isValid ? metrics.endFormatted : undefined}>
              {(f) => <DateInput {...f} min={startDate} value={endDate} onChange={setEndDate} />}
            </Field>
          </div>
          {metrics.isValid ? (
            <p className="text-ink-muted">
              {metrics.totalDays} days ({metrics.weeks} weeks), shown as {metrics.numBlocks} {metrics.numBlocks === 1 ? 'page' : 'pages'} of {blockWeeks}{' '}
              {blockWeeks === 1 ? 'week' : 'weeks'}.
            </p>
          ) : (
            startDate && endDate && <Notice tone="danger" title="The last day is before the first day." />
          )}
          {periodCalculation && metrics.isValid && (
            <Notice
              tone={periodCalculation.isExactMatch ? 'success' : 'info'}
              title={
                periodCalculation.targetHours === 0
                  ? "No time period covers these dates. The roster's own goal is used."
                  : periodCalculation.isExactMatch
                    ? `Time period: ${periodCalculation.matchedPeriod?.name} (${periodCalculation.targetHours} h for a full time nurse)`
                    : `Worked out from ${periodCalculation.description}`
              }
            >
              {periodCalculation.targetHours === 0
                ? `${metrics.totalDays} days, using the roster's goal.`
                : periodCalculation.isExactMatch
                  ? `${periodCalculation.totalScheduleDays} days, the whole time period.`
                  : `${periodCalculation.totalScheduleDays} days make ${periodCalculation.targetHours} working hours${periodCalculation.isProrated ? ' (part of a period)' : ''}.`}
            </Notice>
          )}
          {overlappingSchedule && (
            <Notice
              tone="warning"
              title={`These dates overlap the roster ${overlappingSchedule.name} (${formatDate(overlappingSchedule.startDate)} to ${formatDate(overlappingSchedule.endDate)}).`}
              action={
                onOpenExisting && (
                  <Button size="sm" onClick={() => onOpenExisting(overlappingSchedule)}>
                    Open {overlappingSchedule.name}
                  </Button>
                )
              }
            >
              Choose other dates, or open that roster. Rosters cannot overlap, because hours carry forward from one to the next.
            </Notice>
          )}
        </fieldset>

        <Field label="Roster name">
          {(f) => (
            <div className="flex flex-wrap items-center gap-2">
              <Input
                {...f}
                className="min-w-0 flex-1"
                value={scheduleName}
                onChange={(e) => {
                  setScheduleName(e.target.value);
                  setIsNameManuallyEdited(true);
                }}
              />
              {isNameManuallyEdited && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsNameManuallyEdited(false);
                    setScheduleName(generateSuggestedName(startDate, endDate));
                  }}
                >
                  Use the usual name
                </Button>
              )}
            </div>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Weeks on each page" hint="The roster screen shows this many weeks at a time.">
            {(f) => (
              <Select {...f} value={blockWeeks} onChange={(e) => setBlockWeeks(Number(e.target.value) as BlockWeeks)}>
                <option value={1}>1 week (7 days)</option>
                <option value={2}>2 weeks (14 days), recommended</option>
                <option value={3}>3 weeks (21 days)</option>
                <option value={4}>4 weeks (28 days)</option>
              </Select>
            )}
          </Field>
          <Field label="Goal hours for a full time nurse" hint={halfTime ? `A nurse on a 50% contract: ${halfTime} h.` : 'For example 160, 176 or 80.'}>
            {(f) => <Input {...f} type="number" step="any" min="0" value={hoursTarget} onChange={(e) => setHoursTarget(e.target.value)} />}
          </Field>
        </div>

        <Checkbox
          checked={autoFillDoctorSchedules}
          onChange={(e) => setAutoFillDoctorSchedules(e.target.checked)}
          label={
            <span className="inline-flex flex-wrap items-center gap-2">
              Add the doctors' weekly clinics
              {autoFillDoctorSchedules && metrics.isValid && <Badge tone="success">about {estimatedDoctorSessionsCount} clinics</Badge>}
            </span>
          }
          hint={`Adds every active doctor's usual weekly clinics to all ${metrics.totalDays > 0 ? `${metrics.totalDays} days` : 'days'} of the roster, so you can see which clinics need a nurse.`}
        />

        <fieldset className="space-y-2">
          <legend className="mb-2 font-semibold text-ink">How to start</legend>
          <label className={startChoice(generateImmediately)}>
            <input type="radio" name="generation_mode" className="mt-0.5 size-4 accent-brand" checked={generateImmediately} onChange={() => setGenerateImmediately(true)} />
            <span>
              <span className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                Fill the shifts for me <Badge tone="brand">Recommended</Badge>
              </span>
              <span className="mt-0.5 block text-ink-muted">
                Fills shifts around the doctors' clinics, blood collection, rest between shifts and a senior nurse each day. You can change anything afterwards.
              </span>
            </span>
          </label>
          <label className={startChoice(!generateImmediately)}>
            <input type="radio" name="generation_mode" className="mt-0.5 size-4 accent-brand" checked={!generateImmediately} onChange={() => setGenerateImmediately(false)} />
            <span>
              <span className="block font-semibold text-ink">Start with an empty roster</span>
              <span className="mt-0.5 block text-ink-muted">Add shifts yourself, or fill the roster from a saved template.</span>
            </span>
          </label>
        </fieldset>

        {errorMessage && <Notice tone="danger" live title={errorMessage} />}
      </form>
    </Dialog>
  );
};
