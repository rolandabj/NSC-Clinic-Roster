/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * New roster dialog: dates, how many weeks each page of the roster shows,
 * the full time hours goal, and whether to fill the shifts straight away.
 */

import React, { useState, useEffect, useMemo, useId } from 'react';
import {
  X,
  Calendar,
  CalendarRange,
  Clock,
  Sparkles,
  Info,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  Stethoscope,
} from 'lucide-react';
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
import { useDialogA11y } from '../common/useDialogA11y';
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
  const titleId = useId();
  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, onClose);

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
      startFormatted: start.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }),
      endFormatted: end.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }),
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

  // Helper to construct automatic schedule name
  const generateSuggestedName = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return `Schedule — ${clinicName.split(' ')[0]}`;
    const start = new Date(startStr + 'T00:00:00Z');
    const end = new Date(endStr + 'T00:00:00Z');
    if (start > end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return `Schedule — ${clinicName.split(' ')[0]}`;
    }

    const startMonth = start.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
    const startYear = start.getUTCFullYear();
    const endYear = end.getUTCFullYear();
    const startDay = start.getUTCDate();

    // Check if it's a full calendar month (e.g., 1st to end of month)
    const nextMonthFirst = new Date(Date.UTC(startYear, start.getUTCMonth() + 1, 1));
    const lastDayOfMonth = new Date(nextMonthFirst.getTime() - 86400000).getUTCDate();

    const shortClinic = clinicName.replace(' Outpatient Clinic', '').replace(' Clinic', '');

    if (startDay === 1 && end.getUTCDate() === lastDayOfMonth && startMonth === endMonth) {
      return `${startMonth} ${startYear} — ${shortClinic}`;
    }

    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth} ${startDay}–${end.getUTCDate()}, ${startYear} — ${shortClinic}`;
    }

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}, ${endYear} — ${shortClinic}`;
  };

  // Sync schedule name and suggested/prorated hours when dates change
  useEffect(() => {
    if (metrics.isValid) {
      if (!isNameManuallyEdited) {
        setScheduleName(generateSuggestedName(startDate, endDate));
      }
      if (periodCalculation) {
        setHoursTarget(periodCalculation.targetHours);
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
    const shortClinic = clinicName.replace(' Outpatient Clinic', '').replace(' Clinic', '');
    setScheduleName(`${p.year} ${p.name} — ${shortClinic}`);
  };

  // Check for date range overlap with existing schedules
  const overlappingSchedule = existingSchedules.find((s) => {
    return (
      (startDate >= s.startDate && startDate <= s.endDate) ||
      (endDate >= s.startDate && endDate <= s.endDate) ||
      (startDate <= s.startDate && endDate >= s.endDate)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!startDate || !endDate) {
      setErrorMessage('Please choose a start date and an end date.');
      return;
    }

    if (startDate > endDate) {
      setErrorMessage('The start date can\'t be after the end date.');
      return;
    }

    if (!scheduleName.trim()) {
      setErrorMessage('Please give this roster a name.');
      return;
    }

    if (metrics.totalDays < 3) {
      setErrorMessage('A roster must be at least 3 days long.');
      return;
    }

    const parsedTargetHours = parseFloat(String(hoursTarget).trim());
    if (isNaN(parsedTargetHours) || parsedTargetHours < 0) {
      setErrorMessage('Please enter the full time hours goal as a number (for example 160, 176 or 227).');
      return;
    }

    setIsSubmitting(true);

    try {
      const repo = getRepository();
      const latestSchedules = await repo.list('schedules');
      const conflict = latestSchedules.find(s => s.startDate <= endDate && s.endDate >= startDate);
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
        note: `Roster created (${startDate} to ${endDate})`,
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
        note: `Created schedule "${newSchedule.name}" covering ${startDate} to ${endDate} (${metrics.totalDays} days, ${blockWeeks}w blocks, ${parsedTargetHours}h target${
          autoFillDoctorSchedules
            ? `, ${populatedDoctorSessionsCount} recurring doctor sessions auto-populated`
            : ', doctor auto-fill disabled'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden text-xs flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
              <CalendarRange className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 id={titleId} className="text-sm font-bold text-slate-900">New roster</h3>
              <p className="text-[11px] text-slate-500">
                Choose the dates, how many weeks each page shows, and the nurses' hours goal.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
              <span role="alert" className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* Quick Dedicated Period Preset Selector */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="dedicated-period-select" className="flex items-center gap-1.5 text-indigo-950 font-bold text-xs">
                <Clock className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <span>Use a saved time period:</span>
              </label>
              <span className="text-[10px] text-indigo-600 font-medium">Fills in the dates and full time hours</span>
            </div>

            <select
              id="dedicated-period-select"
              value={selectedPeriodId}
              onChange={(e) => handleSelectDedicatedPeriodPreset(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              <option value="">Choose a time period (for example 2026 Jan 19 to Feb 18, 227h)…</option>
              {workingHoursPeriods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.year} {p.name} ({p.startDate} to {p.endDate}) · {p.workingHours}h full time
                </option>
              ))}
            </select>
          </div>

          {/* Primary Date Selectors: Start Date & End Date */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
              <Calendar className="w-4 h-4 text-indigo-600" aria-hidden="true" />
              <span>Dates:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Start date <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    aria-label="Start date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-2xs"
                  />
                </div>
                {metrics.isValid && metrics.startFormatted && (
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {metrics.startFormatted}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  End date <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={startDate}
                    aria-label="End date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-2xs"
                  />
                </div>
                {metrics.isValid && metrics.endFormatted && (
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {metrics.endFormatted}
                  </span>
                )}
              </div>
            </div>

            {/* Informative Dedicated Period / Prorating Banner */}
            {periodCalculation && metrics.isValid && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                  periodCalculation.isExactMatch
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      periodCalculation.isExactMatch ? 'text-emerald-600' : 'text-indigo-600'
                    }`}
                  />
                  <div className="min-w-0">
                    <span className="font-bold block truncate">
                      {periodCalculation.isExactMatch ? (
                        <>✓ Time period: {periodCalculation.matchedPeriod?.name} ({periodCalculation.targetHours}h for a full time nurse)</>
                      ) : (
                        <>✓ Worked out from {periodCalculation.description}</>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {periodCalculation.isExactMatch
                        ? `${periodCalculation.totalScheduleDays} days, the whole time period`
                        : `${periodCalculation.totalScheduleDays} days = ${periodCalculation.targetHours} working hours`}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-white border border-slate-200 shadow-2xs">
                    {periodCalculation.targetHours}h full time
                  </span>
                  {periodCalculation.isProrated && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                      Part of a period
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Live Duration Readout & Calculated Metrics Card */}
            {metrics.isValid ? (
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 px-2 py-0.5 bg-white border border-slate-200 rounded font-mono">
                    {metrics.totalDays} days
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="font-semibold text-slate-700">
                    {metrics.weeks} weeks
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="font-semibold text-indigo-700">
                    {metrics.numBlocks} page{metrics.numBlocks === 1 ? '' : 's'} of {blockWeeks} week{blockWeeks === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 text-rose-600 font-semibold text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>The end date must be on or after the start date.</span>
              </div>
            )}

            {/* Overlap notice */}
            {overlappingSchedule && (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[10px] flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  These dates overlap the roster{' '}
                  <strong>"{overlappingSchedule.name}"</strong> ({overlappingSchedule.startDate} to {overlappingSchedule.endDate}). Open that roster or choose different dates. Rosters cannot overlap because hours carry forward.
                  {onOpenExisting && (
                    <>
                      {' '}
                      <button
                        type="button"
                        onClick={() => onOpenExisting(overlappingSchedule)}
                        className="font-semibold underline cursor-pointer"
                      >
                        Open "{overlappingSchedule.name}" instead
                      </button>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Schedule Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-700 font-semibold">
                Roster name <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsNameManuallyEdited(false);
                  setScheduleName(generateSuggestedName(startDate, endDate));
                }}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline flex items-center gap-1"
              >
                <RefreshCw className="w-2.5 h-2.5" aria-hidden="true" />
                <span>Use the usual name</span>
              </button>
            </div>
            <input
              type="text"
              required
              aria-label="Roster name"
              value={scheduleName}
              onChange={(e) => {
                setScheduleName(e.target.value);
                setIsNameManuallyEdited(true);
              }}
              placeholder={`For example: November 2026 — ${clinicName}`}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs"
            />
          </div>

          {/* Page length and full time hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Weeks on each page
              </label>
              <select
                aria-label="Weeks on each page"
                value={blockWeeks}
                onChange={(e) => setBlockWeeks(Number(e.target.value) as BlockWeeks)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
              >
                <option value={1}>1 week (7 days)</option>
                <option value={2}>2 weeks (14 days), recommended</option>
                <option value={3}>3 weeks (21 days)</option>
                <option value={4}>4 weeks (28 days)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                The roster screen shows this many weeks at a time.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-semibold">
                  Hours goal for a full time nurse
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  min="0"
                  aria-label="Hours goal for a full time nurse"
                  value={hoursTarget}
                  onChange={(e) => setHoursTarget(e.target.value)}
                  placeholder="For example 160, 176 or 80"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs transition-colors"
                />
                <span className="font-mono text-slate-500 shrink-0 font-medium">hrs</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span>
                  {String(hoursTarget).trim() !== '' && !isNaN(parseFloat(String(hoursTarget)))
                    ? `A nurse on a 50% contract: ${(parseFloat(String(hoursTarget)) * 0.5).toFixed(1).replace(/\.0$/, '')}h`
                    : 'Enter the hours goal'}
                </span>
              </div>
            </div>
          </div>

          {/* Recurring Doctor Schedules Auto-Fill Option */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoFillDoctorSchedules}
                  onChange={(e) => setAutoFillDoctorSchedules(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <Stethoscope className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Add the doctors' weekly clinics</span>
                </div>
              </label>

              {autoFillDoctorSchedules && metrics.isValid && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                  about {estimatedDoctorSessionsCount} clinics
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
              Adds every active doctor's usual weekly clinics to all {metrics.totalDays > 0 ? `${metrics.totalDays} days` : 'days'} of the roster, so you can see which clinics need a nurse.
            </p>
          </div>

          {/* Generator Execution Strategy */}
          <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-2">
            <span className="text-slate-800 font-semibold text-xs block">
              How to start:
            </span>
            <div className="space-y-1.5">
              <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 cursor-pointer transition-colors shadow-2xs">
                <input
                  type="radio"
                  name="generation_mode"
                  checked={generateImmediately}
                  onChange={() => setGenerateImmediately(true)}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                    <span>Fill the shifts for me</span>
                    <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Fills shifts around the doctors' clinics, blood collection, rest between shifts and a senior nurse each day. You can change anything afterwards.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 cursor-pointer transition-colors shadow-2xs">
                <input
                  type="radio"
                  name="generation_mode"
                  checked={!generateImmediately}
                  onChange={() => setGenerateImmediately(false)}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Start with an empty roster
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Add shifts yourself, or fill the roster from a saved template.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !metrics.isValid || !!overlappingSchedule}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>Creating the roster…</span>
                </>
              ) : generateImmediately ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Create and fill roster</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Create empty roster</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
