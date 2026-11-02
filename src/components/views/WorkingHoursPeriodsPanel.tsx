/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WorkingHoursPeriodsPanel
 * Configuration section for Dedicated Time Periods & Target Working Hours.
 * Allows clinical administrators to enter, edit, delete, and test working hours
 * per roster period and verifies prorated hours calculations for short-range schedules.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, RotateCcw, Check } from 'lucide-react';
import { WorkingHoursPeriod } from '../../types';
import { Button, DataTable, DateInput, Dialog, EmptyState, ErrorState, Field, IconButton, Input, LoadingState, Notice, Select, type Column } from '../ui';
import { nextPeriodDefaults } from '../../services/hours/nextPeriod';
import { formatDate } from '../../utils/dateUtils';
import { getRepository } from '../../services/repository';
import { SEED_WORKING_HOURS_PERIODS } from '../../services/seed/seedData';
import {
  calculateWorkingHoursForDateRange,
  getInclusiveDays,
} from '../../services/periods/workingHoursPeriodService';
import { localTodayIso } from '../../utils/dateUtils';
import { notify, type NoticeTone } from '../common/dialogs';

export const WorkingHoursPeriodsPanel: React.FC = () => {
  const [periods, setPeriods] = useState<WorkingHoursPeriod[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [formYear, setFormYear] = useState<string>('2026');
  const [formName, setFormName] = useState<string>('');
  const [formStartDate, setFormStartDate] = useState<string>('2026-01-19');
  const [formEndDate, setFormEndDate] = useState<string>('2026-02-18');
  const [formWorkingHours, setFormWorkingHours] = useState<number | string>(227);
  const [formNote, setFormNote] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Delete State
  const [deletingPeriod, setDeletingPeriod] = useState<WorkingHoursPeriod | null>(null);

  // Restore Baseline Confirmation
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState<boolean>(false);

  // Dialog keyboard and screen reader support

  // Interactive Prorating Tester State
  const [testStartDate, setTestStartDate] = useState<string>('2026-01-19');
  const [testEndDate, setTestEndDate] = useState<string>('2026-02-01'); // 14-day sample

  const showToast = (msg: string, tone: NoticeTone = 'success') => notify(msg, tone);

  const loadPeriods = async () => {
    try {
      setIsLoading(true);
      const repo = getRepository();
      // An empty list is kept as it is: the standard periods are only loaded when asked.
      setPeriods(await repo.list('workingHoursPeriods'));
      setLoadError(null);
    } catch (err: any) {
      console.error('Failed to load working hours periods:', err);
      setLoadError(err?.message || 'unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  // Sorted periods chronologically by startDate
  const sortedPeriods = useMemo(() => {
    return [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [periods]);

  // Distinct Years
  const availableYears = useMemo(() => {
    const set = new Set<string>();
    sortedPeriods.forEach((p) => {
      if (p.year) set.add(p.year);
    });
    return Array.from(set).sort();
  }, [sortedPeriods]);

  // Filtered Periods
  const filteredPeriods = useMemo(() => {
    return sortedPeriods.filter((p) => {
      if (yearFilter !== 'ALL' && p.year !== yearFilter) return false;
      return true;
    });
  }, [sortedPeriods, yearFilter]);

  // Show uncovered date gaps and warn when configured periods run out soon.
  const coverageWarnings = useMemo(() => {
    const warnings: string[] = [];
    const dayAfter = (d: string) => {
      const [y, m, dd] = d.split('-').map(Number);
      return new Date(Date.UTC(y, m - 1, dd + 1)).toISOString().split('T')[0];
    };
    const dayBefore = (d: string) => {
      const [y, m, dd] = d.split('-').map(Number);
      return new Date(Date.UTC(y, m - 1, dd - 1)).toISOString().split('T')[0];
    };
    for (let i = 1; i < sortedPeriods.length; i++) {
      const prevEnd = sortedPeriods.slice(0, i).reduce((max, p) => (p.endDate > max ? p.endDate : max), '');
      const next = sortedPeriods[i];
      if (next.startDate > dayAfter(prevEnd)) {
        warnings.push(`No period covers ${formatDate(dayAfter(prevEnd))} to ${formatDate(dayBefore(next.startDate))}.`);
      }
    }
    const today = localTodayIso();
    const lastEnd = sortedPeriods.reduce((max, p) => (p.endDate > max ? p.endDate : max), '');
    const soon = localTodayIso(90);
    if (!lastEnd) warnings.push('There are no time periods, so each roster uses its own goal hours.');
    else if (lastEnd < soon) {
      warnings.push(
        `${lastEnd < today ? 'The periods ended' : 'The periods end'} on ${formatDate(lastEnd)}. Add the next ones; dates after that use each roster's own goal hours.`
      );
    }
    return warnings;
  }, [sortedPeriods]);

  // The tester starts on the period that holds today (or the latest one), once the periods load.
  const testerSet = React.useRef(false);
  useEffect(() => {
    if (testerSet.current || sortedPeriods.length === 0) return;
    testerSet.current = true;
    const today = localTodayIso();
    const current = sortedPeriods.find((p) => p.startDate <= today && p.endDate >= today) || sortedPeriods[sortedPeriods.length - 1];
    setTestStartDate(current.startDate);
    setTestEndDate(current.endDate);
  }, [sortedPeriods]);

  // Interactive Prorating Test Result
  const testCalculation = useMemo(() => {
    return calculateWorkingHoursForDateRange(testStartDate, testEndDate, sortedPeriods);
  }, [testStartDate, testEndDate, sortedPeriods]);

  // Open Create Modal
  // A new period starts at the next cycle (the day after the latest one ends); it always started
  // at 19-01-2026 before (Phase 8, slice 1d). The hours are left for the planner to type.
  const handleOpenCreateModal = () => {
    const next = nextPeriodDefaults(periods, localTodayIso());
    setEditingPeriodId(null);
    setFormYear(next.year);
    setFormName(next.name);
    setFormStartDate(next.startDate);
    setFormEndDate(next.endDate);
    setFormWorkingHours('');
    setFormNote('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (period: WorkingHoursPeriod) => {
    setEditingPeriodId(period.id);
    setFormYear(period.year);
    setFormName(period.name);
    setFormStartDate(period.startDate);
    setFormEndDate(period.endDate);
    setFormWorkingHours(period.workingHours);
    setFormNote(period.note || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = formName.trim();
    const trimmedYear = formYear.trim();
    const hoursNum = typeof formWorkingHours === 'string' ? parseFloat(formWorkingHours) : formWorkingHours;

    if (!trimmedYear) {
      setFormError('Enter the year, for example 2026.');
      return;
    }
    if (!trimmedName) {
      setFormError('Enter a name for the period, for example Dec19-Jan18.');
      return;
    }
    if (!formStartDate || !formEndDate) {
      setFormError(`Enter the ${!formStartDate ? 'first' : 'last'} day, like 19-01-2026.`);
      return;
    }
    if (formStartDate > formEndDate) {
      setFormError('The last day is before the first day.');
      return;
    }
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 1000) {
      setFormError('Enter the goal hours as a number above 0.');
      return;
    }
    if (loadError) {
      setFormError('The periods could not be loaded, so overlaps can\'t be checked. Refresh the page first.');
      return;
    }
    const overlap = periods.find(
      (p) => p.id !== editingPeriodId && p.startDate <= formEndDate && p.endDate >= formStartDate
    );
    if (overlap) {
      setFormError(
        `These dates overlap ${overlap.name} (${formatDate(overlap.startDate)} to ${formatDate(overlap.endDate)}). Each day can only be in one period.`
      );
      return;
    }
    // Half hours are kept; anything finer is rounded.
    const hours = Math.round(hoursNum * 2) / 2;

    try {
      setIsSaving(true);
      const repo = getRepository();
      const now = new Date().toISOString();

      if (editingPeriodId) {
        // Update
        const updated = await repo.update('workingHoursPeriods', editingPeriodId, {
          year: trimmedYear,
          name: trimmedName,
          startDate: formStartDate,
          endDate: formEndDate,
          workingHours: hours,
          // An empty note (not undefined) so clearing it is saved.
          note: formNote.trim(),
          updatedAt: now,
        });

        setPeriods((prev) => prev.map((p) => (p.id === editingPeriodId ? updated : p)));
        showToast(`Period "${trimmedName}" updated.`);
      } else {
        // Create
        const newId = `whp-${trimmedYear.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
        const created = await repo.create('workingHoursPeriods', {
          id: newId,
          year: trimmedYear,
          name: trimmedName,
          startDate: formStartDate,
          endDate: formEndDate,
          workingHours: hours,
          // An empty note (not undefined) so clearing it is saved.
          note: formNote.trim(),
          createdAt: now,
          updatedAt: now,
        });

        setPeriods((prev) => [...prev, created]);
        showToast(`Period "${trimmedName}" added (${hours} h).`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving working hours period:', err);
      setFormError(err.message || 'The time period could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingPeriod) return;
    try {
      const repo = getRepository();
      await repo.remove('workingHoursPeriods', deletingPeriod.id);
      setPeriods((prev) => prev.filter((p) => p.id !== deletingPeriod.id));
      showToast(`Period "${deletingPeriod.name}" deleted.`);
      setDeletingPeriod(null);
    } catch (err) {
      console.error('Failed to delete period:', err);
      showToast('Error deleting period.', 'error');
    }
  };

  // Handle Restore Standard 2025-2026 Baseline
  const handleRestoreBaseline = async () => {
    try {
      setIsLoading(true);
      const repo = getRepository();
      // Read the current list again, so a stale or failed load can't hide the clinic's own periods.
      const periods = await repo.list('workingHoursPeriods');
      // Standard periods that would overlap one of the clinic's own periods are skipped.
      const seedIds = new Set(SEED_WORKING_HOURS_PERIODS.map((p) => p.id));
      const own = periods.filter((p) => !seedIds.has(p.id));
      const toAdd = SEED_WORKING_HOURS_PERIODS.filter(
        (seed) => !own.some((p) => p.startDate <= seed.endDate && p.endDate >= seed.startDate)
      );
      await repo.bulkUpsert('workingHoursPeriods', toAdd);
      const reloaded = await repo.list('workingHoursPeriods');
      setPeriods(reloaded);
      setIsRestoreConfirmOpen(false);
      const skipped = SEED_WORKING_HOURS_PERIODS.length - toAdd.length;
      showToast(`${toAdd.length} usual periods loaded.${skipped ? ` ${skipped} left out because they overlap your own periods.` : ''}`);
    } catch (err) {
      console.error('Failed to restore standard periods:', err);
      showToast('The usual periods could not be loaded.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formDurationDays = useMemo(() => {
    return getInclusiveDays(formStartDate, formEndDate);
  }, [formStartDate, formEndDate]);

  const formDailyRate = useMemo(() => {
    const hours = typeof formWorkingHours === 'string' ? parseFloat(formWorkingHours) || 0 : formWorkingHours;
    return formDurationDays > 0 ? (hours / formDurationDays).toFixed(2) : '0';
  }, [formWorkingHours, formDurationDays]);

  // The hours of any dates (the tester), in words.
  const testWords = (() => {
    const t = testCalculation;
    if (!testStartDate || !testEndDate || testEndDate < testStartDate) return 'Pick a first and a last day.';
    if (t.isExactMatch && t.breakdown[0]) return `Exactly the period ${t.breakdown[0].periodName}.`;
    if (t.fallbackDays === t.totalScheduleDays) return 'No time period covers these dates, so a roster on them uses its own goal hours.';
    const parts = t.breakdown.map((b) => `${b.daysCovered} of the ${b.periodTotalDays} days of ${b.periodName}`).join(', and ');
    return `${parts}.${t.fallbackDays > 0 ? ` ${t.fallbackDays === 1 ? '1 day is' : `${t.fallbackDays} days are`} in no period and add no hours.` : ''}`;
  })();
  const fmtHours = (h: number) => `${Math.round(h * 10) / 10} h`;

  const periodColumns: Column<WorkingHoursPeriod>[] = [
    {
      key: 'name',
      header: 'Period',
      cell: (p) => (
        <span>
          <span className="block whitespace-nowrap font-semibold text-ink">
            {p.name} <span className="font-normal text-ink-muted">{p.year}</span>
          </span>
          {p.note && <span className="block text-xs text-ink-muted">{p.note}</span>}
        </span>
      ),
      sortValue: (p) => p.startDate,
      phone: 'title',
    },
    {
      key: 'dates',
      header: 'Dates',
      cell: (p) => (
        <span className="whitespace-nowrap">
          {formatDate(p.startDate)} to {formatDate(p.endDate)}
        </span>
      ),
      sortValue: (p) => p.startDate,
    },
    { key: 'days', header: 'Days', align: 'right', cell: (p) => getInclusiveDays(p.startDate, p.endDate), sortValue: (p) => getInclusiveDays(p.startDate, p.endDate) },
    { key: 'goal', header: 'Goal, full time', align: 'right', cell: (p) => <span className="font-semibold text-ink">{fmtHours(p.workingHours)}</span>, sortValue: (p) => p.workingHours },
    { key: 'half', header: 'Half time', align: 'right', cell: (p) => fmtHours(p.workingHours * 0.5), sortValue: (p) => p.workingHours },
    {
      key: 'actions',
      header: 'Actions',
      hideHeader: true,
      phone: 'actions',
      align: 'right',
      cell: (p) => (
        <span className="inline-flex gap-1">
          <IconButton label={`Change ${p.name} ${p.year}`} icon={Edit2} onClick={() => handleOpenEditModal(p)} />
          <IconButton label={`Delete ${p.name} ${p.year}`} icon={Trash2} onClick={() => setDeletingPeriod(p)} />
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5 text-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Time periods</h2>
          <p className="mt-1 max-w-2xl text-ink-muted">
            The clinic's cycles (for example 19 January to 18 February) and the goal hours of a full time nurse in each. A roster across two
            periods takes its share of each.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button icon={RotateCcw} disabled={!!loadError || isLoading} onClick={() => setIsRestoreConfirmOpen(true)}>
            Load the usual periods
          </Button>
          <Button variant="primary" icon={Plus} disabled={!!loadError || isLoading} onClick={handleOpenCreateModal}>
            New time period
          </Button>
        </div>
      </div>

      {loadError && (
        <ErrorState title="The time periods could not be loaded">
          {loadError}. Refresh the page to try again.
        </ErrorState>
      )}

      {!isLoading && !loadError && coverageWarnings.length > 0 && (
        <Notice tone="warning" title="Some dates have no time period">
          <p>A roster on dates that no period covers uses its own goal hours. If a roster only partly falls in a period, the dates outside it add no hours.</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {coverageWarnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Notice>
      )}

      <div className="space-y-5">
        <div className="min-w-0 space-y-3">
          {availableYears.length > 1 && (
            <Field label="Year" className="w-full sm:w-48">
              {(f) => (
                <Select {...f} value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                  <option value="ALL">All years</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          )}
          {isLoading ? (
            <LoadingState label="Loading the time periods…" />
          ) : (
            <DataTable
              caption="Time periods"
              rows={filteredPeriods}
              rowKey={(p) => p.id}
              columns={periodColumns}
              initialSort={{ key: 'name', direction: 'ascending' }}
              empty={
                <EmptyState title={loadError ? 'The periods could not be loaded' : 'No time periods yet'}>
                  {loadError ? undefined : 'Add one, or load the usual periods of 2025 and 2026.'}
                </EmptyState>
              }
            />
          )}
        </div>

        <section aria-labelledby="period-tester" className="max-w-2xl space-y-3 rounded-lg border border-line p-4">
          <div>
            <h3 id="period-tester" className="text-base font-semibold text-ink">
              Goal hours for any dates
            </h3>
            <p className="text-ink-muted">What a full time nurse's goal would be for a roster on these dates.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="From">{(f) => <DateInput {...f} value={testStartDate} onChange={setTestStartDate} />}</Field>
            <Field label="To">{(f) => <DateInput {...f} value={testEndDate} onChange={setTestEndDate} />}</Field>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-line bg-sunken p-3">
              <dt className="text-ink-muted">Full time</dt>
              <dd className="text-xl font-semibold text-ink tabular-nums">{fmtHours(testCalculation.targetHours)}</dd>
            </div>
            <div className="rounded-lg border border-line bg-sunken p-3">
              <dt className="text-ink-muted">Half time</dt>
              <dd className="text-xl font-semibold text-ink tabular-nums">{fmtHours(testCalculation.targetHours * 0.5)}</dd>
            </div>
          </dl>
          <p className="text-ink" aria-live="polite">
            {testCalculation.totalScheduleDays > 0 && `${testCalculation.totalScheduleDays === 1 ? '1 day' : `${testCalculation.totalScheduleDays} days`}. `}
            {testWords}
          </p>
        </section>
      </div>

      {/* The three dialogs, on the shared Dialog since Phase 7, slice 4. */}
      <Dialog
        open={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={editingPeriodId ? 'Change the time period' : 'New time period'}
        description="The dates of a period and the goal hours of a full time nurse in it."
        footer={
          <>
            <Button disabled={isSaving} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="time-period" icon={Check} busy={isSaving}>
              {editingPeriodId ? 'Save changes' : 'Add the period'}
            </Button>
          </>
        }
      >
        <form id="time-period" onSubmit={handleSavePeriod} noValidate className="space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Year" hint="For example 2026, or 2025-2026.">
              {(f) => <Input {...f} value={formYear} onChange={(e) => setFormYear(e.target.value)} />}
            </Field>
            <Field label="Name" hint="For example Jan19-Feb18.">
              {(f) => <Input {...f} value={formName} onChange={(e) => setFormName(e.target.value)} />}
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First day">{(f) => <DateInput {...f} value={formStartDate} onChange={setFormStartDate} />}</Field>
            <Field label="Last day">{(f) => <DateInput {...f} value={formEndDate} onChange={setFormEndDate} />}</Field>
          </div>
          <Field label="Goal hours for a full time nurse" hint={`${formDurationDays === 1 ? '1 day' : `${formDurationDays} days`}, about ${formDailyRate} hours a day.`}>
            {(f) => <Input {...f} type="number" min={1} max={500} step={1} value={formWorkingHours} onChange={(e) => setFormWorkingHours(e.target.value)} className="w-32" />}
          </Field>
          <Field label="Note" optional hint="For example: Ramadan hours.">
            {(f) => <Input {...f} value={formNote} onChange={(e) => setFormNote(e.target.value)} />}
          </Field>
          {formError && <Notice tone="danger" live title={formError} />}
        </form>
      </Dialog>

      <Dialog
        open={!!deletingPeriod}
        onClose={() => setDeletingPeriod(null)}
        role="alertdialog"
        size="sm"
        title="Delete the time period?"
        description={deletingPeriod ? `${deletingPeriod.name} ${deletingPeriod.year}, a goal of ${deletingPeriod.workingHours} h.` : undefined}
        footer={
          <>
            <Button onClick={() => setDeletingPeriod(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete the period
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink">Roster dates that no other period covers use their own goal hours.</p>
      </Dialog>

      <Dialog
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        title="Load the usual periods of 2025 and 2026?"
        description="This adds the usual periods below, except any that overlap your own periods. If you changed any of them, your changes are replaced by the usual hours. Other periods are kept."
        footer={
          <>
            <Button onClick={() => setIsRestoreConfirmOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleRestoreBaseline}>
              Load the usual periods
            </Button>
          </>
        }
      >
        <ul className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-ink sm:grid-cols-2">
          {[
            ['19 December to 18 January', 210],
            ['19 January to 18 February', 227],
            ['19 February to 18 March', 145],
            ['19 March to 18 April', 207],
            ['19 April to 18 May', 220],
            ['19 May to 18 June', 230],
            ['19 June to 18 July', 200],
            ['19 July to 18 August', 230],
            ['19 August to 18 September', 220],
            ['19 September to 18 October', 210],
            ['19 October to 18 November', 230],
            ['19 November to 18 December', 210],
          ].map(([when, hours]) => (
            <li key={when as string}>
              {when}: {hours} h
            </li>
          ))}
        </ul>
      </Dialog>
    </div>
  );
};
