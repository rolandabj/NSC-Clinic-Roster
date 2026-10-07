// Test page only: a nurse's own page in the proposed look, made for phones first
// (?view=sample-nurse): 16 px text and buttons at least 44 px high. Made up data (data.ts).
import React, { useState } from 'react';
import { CalendarPlus, CalendarRange, CircleCheck, CircleX, Clock, Plus } from 'lucide-react';
import { Badge, Button, Notice } from './ui';
import { DAYS, NURSES, ROSTER, SHIFTS, ddmmyyyy, dayLabel } from './data';

const mary = NURSES.find((n) => n.id === 'mary')!;
const shifts = mary.cells.flatMap((cell, i) => (cell?.kind === 'shift' ? [{ cell, day: DAYS[i] }] : []));

const REQUESTS = [
  { id: 'q1', what: 'Annual leave', dates: ['14-12-2026', '18-12-2026'], status: 'Waiting' as const },
  { id: 'q2', what: 'Day off', dates: ['23-12-2026'], status: 'Approved' as const, note: 'Approved. Enjoy the day.', by: 'Pat Planner' },
  { id: 'q3', what: 'Swap with Nina', dates: ['26-11-2026'], status: 'Declined' as const, note: 'Please ask again for another day.', by: 'Pat Planner' },
];
const STATUS = {
  Waiting: { tone: 'warning' as const, icon: Clock },
  Approved: { tone: 'success' as const, icon: CircleCheck },
  Declined: { tone: 'neutral' as const, icon: CircleX },
};

function where(cell: (typeof shifts)[number]['cell']) {
  return cell.doctor ? `With ${cell.doctor}, room ${cell.room}` : `${cell.with} nurse`;
}

export function NurseSample() {
  const [seen, setSeen] = useState(false);
  const [next, ...rest] = shifts;
  return (
    <div className="min-h-dvh text-base">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:font-semibold focus:shadow-pop"
      >
        Skip to main content
      </a>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-xl items-center gap-2.5 px-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-white">
            <CalendarRange aria-hidden="true" className="size-5" />
          </span>
          <p className="min-w-0 flex-1 truncate font-bold text-ink">NSC Clinic Roster</p>
          <p className="text-sm text-ink-muted">Test Clinic</p>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-xl space-y-6 px-4 py-5 outline-none">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Mary's shifts</h1>
          <p className="mt-1 text-ink-muted">
            {ROSTER.name} roster, {ddmmyyyy(ROSTER.from)} to {ddmmyyyy(ROSTER.to)}
          </p>
          <p className="text-sm text-ink-muted">Published on 05-10-2026</p>
        </div>

        {seen ? (
          <Notice tone="success" title="Thank you. The planner can see that you have seen your shifts." />
        ) : (
          <Notice
            tone="info"
            title="Please confirm you have seen your shifts"
            action={
              <Button variant="primary" size="lg" onClick={() => setSeen(true)} className="w-full sm:w-auto">
                I have seen them
              </Button>
            }
          >
            The planner then knows you have your roster.
          </Notice>
        )}

        <section aria-labelledby="next-shift" className="rounded-xl border border-brand/30 bg-brand-soft p-4">
          <h2 id="next-shift" className="text-sm font-semibold text-brand-strong">
            Next shift
          </h2>
          <p className="mt-1 text-xl font-semibold text-ink">{dayLabel(next.day.iso)}</p>
          <p className="text-ink">
            {SHIFTS[next.cell.code].start} to {SHIFTS[next.cell.code].end}, {next.cell.code} shift
          </p>
          <p className="text-ink-muted">{where(next.cell)}</p>
          <Button size="lg" icon={CalendarPlus} className="mt-3 w-full sm:w-auto">
            Add to my calendar
          </Button>
        </section>

        <section aria-labelledby="coming-up">
          <h2 id="coming-up" className="mb-2 text-lg font-semibold text-ink">
            Coming up
          </h2>
          <ul className="space-y-2">
            {rest.map(({ cell, day }) => (
              <li key={day.iso} className="flex items-center gap-4 rounded-lg border border-line bg-surface px-4 py-3 shadow-card">
                <div aria-hidden="true" className="w-12 shrink-0 text-center">
                  <p className="text-sm font-semibold text-ink-muted">{day.weekday}</p>
                  <p className="text-2xl leading-none font-semibold text-ink tabular-nums">{day.day}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="sr-only">{dayLabel(day.iso)}</p>
                  <p className="font-semibold text-ink">
                    {SHIFTS[cell.code].start} to {SHIFTS[cell.code].end}
                  </p>
                  <p className="text-ink-muted">{where(cell)}</p>
                  <p aria-hidden="true" className="text-sm text-ink-muted">
                    {dayLabel(day.iso)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="my-requests">
          <h2 id="my-requests" className="mb-2 text-lg font-semibold text-ink">
            My requests
          </h2>
          <ul className="space-y-2">
            {REQUESTS.map((r) => (
              <li key={r.id} className="rounded-lg border border-line bg-surface px-4 py-3 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{r.what}</p>
                    <p className="text-ink-muted">
                      {r.dates.map((d, i) => (
                        <React.Fragment key={d}>
                          {i > 0 && ' to '}
                          <span className="whitespace-nowrap">{d}</span>
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                  <Badge tone={STATUS[r.status].tone} icon={STATUS[r.status].icon}>
                    {r.status}
                  </Badge>
                </div>
                {r.note && (
                  <p className="mt-2 rounded-md bg-sunken px-3 py-2 text-sm text-ink">
                    <span className="font-semibold">{r.by}:</span> {r.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <Button variant="primary" size="lg" icon={Plus} className="mt-3 w-full">
            Ask for leave or a day off
          </Button>
        </section>
      </main>
    </div>
  );
}
