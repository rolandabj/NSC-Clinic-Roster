// Test page only: the planner's roster screen in the proposed look (?view=sample). Add
// &open=publish to open the publish dialog at once. The data is made up (data.ts).
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  CalendarRange,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  CloudCheck,
  Ellipsis,
  FilePen,
  History,
  LayoutDashboard,
  Menu,
  Pin,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { useDialogA11y } from '../../src/components/common/useDialogA11y';
import { Badge, Button, Card, DateInput, Dialog, Field, IconButton, Notice, PROBLEM, TabPanel, Tabs, cx, inputClass, type ProblemKind, type Tone } from './ui';
import {
  DAYS,
  LEAVE,
  NURSES,
  PROBLEMS,
  REQUESTS,
  ROSTER,
  SHIFTS,
  countOf,
  dayLabel,
  dayProblems,
  ddmmyyyy,
  problemAt,
  tint,
  type Cell,
  type Nurse,
  type Problem,
  type RequestStatus,
  type StaffRequest,
} from './data';

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Rosters', icon: CalendarRange, current: true },
  { label: 'Availability', icon: CalendarCheck2 },
  { label: 'Nurses', icon: Users },
  { label: 'Doctors', icon: Stethoscope },
  { label: 'History', icon: History },
  { label: 'Publish', icon: Send },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Audit trail', icon: ShieldCheck },
  { label: 'Settings', icon: Settings },
];

const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));
const rosterDates = `${ddmmyyyy(ROSTER.from)} to ${ddmmyyyy(ROSTER.to)}`;

function describe(cell: Cell): string {
  if (!cell) return 'No shift';
  if (cell.kind === 'off') return 'Day off';
  if (cell.kind === 'leave') return LEAVE[cell.code].name;
  const s = SHIFTS[cell.code];
  return `${cell.with}, ${cell.code} ${s.start} to ${s.end}`;
}

// ---------------------------------------------------------------- app frame

function Brand() {
  return (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-white">
        <CalendarRange aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-bold text-ink">NSC Clinic Roster</span>
        <span className="block truncate text-xs text-ink-muted">Test Clinic</span>
      </span>
    </>
  );
}

function Nav({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-line px-4">
        <Brand />
        {onClose && <IconButton label="Close menu" icon={X} onClick={onClose} className="-mr-2" />}
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {NAV.map(({ label, icon: Icon, current }) => (
            <li key={label}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-current={current ? 'page' : undefined}
                className={cx(
                  'flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-150 pointer-coarse:h-11',
                  current ? 'bg-brand-soft font-semibold text-brand-strong' : 'font-medium text-ink-muted hover:bg-sunken hover:text-ink',
                )}
              >
                <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/** Below 1024 px the menu opens over the page from the Menu button. */
function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useDialogA11y<HTMLDivElement>(open, onClose);
  useEffect(() => {
    const wide = matchMedia('(min-width: 1024px)');
    const close = () => wide.matches && onClose();
    wide.addEventListener('change', close);
    return () => wide.removeEventListener('change', close);
  }, [onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" className="enter absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-dialog">
        <Nav onClose={onClose} />
      </div>
    </div>
  );
}

function TopBar({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-surface px-2 sm:px-5">
      <IconButton label="Open menu" icon={Menu} onClick={onMenu} aria-expanded={menuOpen} className="lg:hidden" />
      <div className="flex min-w-0 flex-1 items-center gap-2.5 lg:hidden">
        <Brand />
      </div>
      <p className="hidden min-w-0 flex-1 truncate text-sm lg:block">
        <span className="font-semibold text-ink">Test Clinic</span>
        <span className="text-ink-muted"> · Asia/Dubai</span>
      </p>
      <button
        type="button"
        aria-haspopup="menu"
        className="flex h-9 items-center gap-2 rounded-md px-1.5 transition-colors duration-150 hover:bg-sunken pointer-coarse:h-11"
      >
        <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-strong">
          O
        </span>
        <span className="sr-only text-sm font-semibold text-ink sm:not-sr-only">Owner</span>
      </button>
    </header>
  );
}

// ---------------------------------------------------------------- page top

function PageHeader({ onPublish }: { onPublish: () => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-sm text-ink-muted">
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="inline-block rounded py-0.5 hover:text-ink hover:underline">
                Rosters
              </a>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page">November</li>
          </ol>
        </nav>
        <h1 className="mt-0.5 text-2xl font-semibold text-ink">November roster</h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
          <span>{rosterDates}</span>
          <Badge tone="neutral" icon={FilePen}>
            Draft, version 1
          </Badge>
          <span className="inline-flex items-center gap-1 text-success">
            <CloudCheck aria-hidden="true" className="size-4" />
            All changes saved
          </span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button icon={Sparkles}>Fill roster</Button>
        <Button variant="primary" icon={Send} onClick={onPublish}>
          Publish
        </Button>
        <IconButton label="More actions" icon={Ellipsis} aria-haspopup="menu" className="border border-line-strong" />
      </div>
    </div>
  );
}

const STEPS = [
  { label: 'Create', state: 'done' },
  { label: 'Fill', state: 'done' },
  { label: 'Fix problems', state: 'current', note: `${countOf('must')} must fix` },
  { label: 'Publish', state: 'next' },
];

function Steps() {
  const current = STEPS.findIndex((s) => s.state === 'current');
  return (
    <nav aria-label="Steps to publish">
      <p className="text-sm text-ink sm:hidden">
        <span className="text-ink-muted">
          Step {current + 1} of {STEPS.length}:
        </span>{' '}
        <span className="font-semibold">{STEPS[current].label}</span>
        <span className="text-danger"> · {STEPS[current].note}</span>
      </p>
      <ol className="hidden flex-wrap items-center gap-x-1 gap-y-2 sm:flex">
        {STEPS.map((s, i) => (
          <li key={s.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden="true" className="size-4 text-ink-muted" />}
            <span
              aria-current={s.state === 'current' ? 'step' : undefined}
              className={cx(
                'inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm',
                s.state === 'current' ? 'bg-brand-soft font-semibold text-brand-strong ring-1 ring-brand/40' : s.state === 'done' ? 'text-ink' : 'text-ink-muted',
              )}
            >
              <span
                aria-hidden="true"
                className={cx(
                  'flex size-5 items-center justify-center rounded-full text-xs font-bold',
                  s.state === 'done' ? 'bg-success text-white' : s.state === 'current' ? 'bg-brand text-white' : 'bg-surface text-ink-muted ring-1 ring-control',
                )}
              >
                {s.state === 'done' ? <Check className="size-3.5" /> : i + 1}
              </span>
              {s.label}
              {s.state === 'done' && <span className="sr-only">, done</span>}
              {s.note && <span className="font-normal text-danger">· {s.note}</span>}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Stats() {
  const shifts = NURSES.reduce((n, nurse) => n + nurse.cells.filter((c) => c?.kind === 'shift').length, 0);
  const stats: { label: string; value: string | number; hint: string; kind?: ProblemKind }[] = [
    { label: 'Shifts', value: shifts, hint: `for ${NURSES.length} nurses` },
    { label: 'Must fix', value: countOf('must'), hint: 'Fix these before you publish', kind: 'must' },
    { label: 'To check', value: countOf('check'), hint: 'Look at these, then decide', kind: 'check' },
    { label: 'Sent to nurses', value: 'Not yet', hint: 'Publishing emails each nurse' },
  ];
  return (
    <ul aria-label="Roster summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => {
        const P = s.kind && PROBLEM[s.kind];
        return (
          <li key={s.label} className="rounded-lg border border-line bg-surface p-4 shadow-card">
            <p className="flex items-center gap-1.5 text-sm font-medium text-ink-muted">
              {P && <P.icon aria-hidden="true" className={cx('size-4', P.text)} />}
              {s.label}
            </p>
            <p className={cx('mt-1 text-2xl font-semibold tabular-nums', P ? P.text : 'text-ink')}>{s.value}</p>
            <p className="mt-0.5 text-xs text-ink-muted">{s.hint}</p>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------- roster

function Legend() {
  const swatch = (color: string) => (
    <span aria-hidden="true" className="h-3.5 w-4 rounded-sm border-l-[3px]" style={{ backgroundColor: tint(color), borderLeftColor: color }} />
  );
  return (
    <ul aria-label="Key" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
      {(['must', 'check', 'note'] as ProblemKind[]).map((k) => {
        const P = PROBLEM[k];
        return (
          <li key={k} className="inline-flex items-center gap-1">
            <P.icon aria-hidden="true" className={cx('size-3.5', P.text)} />
            {P.word}
          </li>
        );
      })}
      <li className="inline-flex items-center gap-1">
        <Pin aria-hidden="true" className="size-3.5 text-brand-strong" />
        Pinned day
      </li>
      {Object.entries(SHIFTS).map(([code, s]) => (
        <li key={code} className="inline-flex items-center gap-1 tabular-nums">
          {swatch(s.color)}
          {code} {s.start} to {s.end}
        </li>
      ))}
      <li className="inline-flex items-center gap-1">
        {swatch(LEAVE.AL.color)}
        Leave
      </li>
    </ul>
  );
}

function GridCell({
  nurse,
  day,
  cell,
  tabbable,
  cellRef,
  onFocus,
}: {
  nurse: Nurse;
  day: string;
  cell: Cell;
  tabbable: boolean;
  cellRef: (el: HTMLButtonElement | null) => void;
  onFocus: () => void;
}) {
  const problem = problemAt(nurse.id, day);
  const P = problem && PROBLEM[problem.kind];
  const pinned = cell?.kind === 'shift' && cell.pinned;
  let lines: string[] = [];
  let color: string | undefined;
  if (cell?.kind === 'shift') {
    lines = [cell.short, SHIFTS[cell.code].start];
    color = SHIFTS[cell.code].color;
  } else if (cell?.kind === 'leave') {
    lines = ['Leave', cell.code];
    color = LEAVE[cell.code].color;
  } else if (cell?.kind === 'off') {
    lines = ['Day off'];
  }
  // Spoken name: what the cell shows, then the rest of the shift, whose day it is and its marks.
  const rest = cell?.kind === 'shift' ? ` to ${SHIFTS[cell.code].end} (${cell.code} shift)` : cell ? '' : 'No shift';
  const hidden = [rest, `. ${nurse.name}, ${dayLabel(day)}.`, pinned && ' Pinned.', P && ` ${P.word}: ${problem!.text}`].filter(Boolean).join('');
  return (
    <button
      ref={cellRef}
      type="button"
      tabIndex={tabbable ? 0 : -1}
      onFocus={onFocus}
      className={cx(
        'flex h-11 w-full flex-col items-start justify-center rounded px-1 text-left text-xs leading-tight transition-[filter] duration-150 hover:brightness-95 focus-visible:outline-offset-0',
        color && 'border-l-[3px]',
        tabbable ? 'ring-2 ring-brand ring-inset' : problem?.kind === 'must' && 'ring-1 ring-danger-line ring-inset',
      )}
      style={color ? { backgroundColor: tint(color), borderLeftColor: color } : undefined}
    >
      {lines[0] && <span className={cx('max-w-full truncate font-semibold', cell?.kind === 'off' ? 'text-ink-muted' : 'text-ink')}>{lines[0]}</span>}
      {(lines[1] || pinned || P) && (
        <span className="flex max-w-full items-center gap-0.5 whitespace-nowrap text-ink-muted tabular-nums">
          {lines[1] && <span> {lines[1]}</span>}
          {pinned && <Pin aria-hidden="true" className="size-3 shrink-0 text-brand-strong" />}
          {P && <P.icon aria-hidden="true" className={cx('size-3.5 shrink-0', P.text)} />}
        </span>
      )}
      <span className="sr-only">{hidden}</span>
    </button>
  );
}

function HoursCell({ nurse }: { nurse: Nurse }) {
  const d = nurse.difference;
  return (
    <>
      <span className="block text-sm font-semibold tabular-nums">
        {nurse.total} of {nurse.goal} h
      </span>
      <span className={cx('block text-xs tabular-nums', d < 0 ? 'font-semibold text-warning' : 'text-ink-muted')}>
        {d === 0 ? 'On goal' : d < 0 ? `${-d} h short` : `${d} h over`}
      </span>
    </>
  );
}

type Position = { r: number; c: number };

function RosterGrid({
  pos,
  setPos,
  cellRefs,
}: {
  pos: Position;
  setPos: (p: Position) => void;
  cellRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
}) {
  const move = (r: number, c: number) => {
    const next = { r: clamp(r, 0, NURSES.length - 1), c: clamp(c, 0, DAYS.length - 1) };
    setPos(next);
    cellRefs.current.get(`${next.r}|${next.c}`)?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const steps: Record<string, Position> = { ArrowRight: { r: 0, c: 1 }, ArrowLeft: { r: 0, c: -1 }, ArrowDown: { r: 1, c: 0 }, ArrowUp: { r: -1, c: 0 } };
    const step = steps[e.key];
    if (step) {
      e.preventDefault();
      move(pos.r + step.r, pos.c + step.c);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      move(pos.r, e.key === 'Home' ? 0 : DAYS.length - 1);
    }
  };
  const selected = NURSES[pos.r];
  const selectedCell = selected.cells[pos.c];
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5">
        <p className="text-sm text-ink-muted">
          {dayLabel(ROSTER.from)} to {dayLabel(ROSTER.to)}
        </p>
        <Legend />
      </div>
      <div className="overflow-x-auto border-y border-line">
        <table role="grid" aria-label="November roster" onKeyDown={onKeyDown} className="w-full min-w-[66.5rem] table-fixed border-separate border-spacing-0">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-20 w-32 border-r border-b border-line bg-surface px-3 py-2 text-left text-xs font-semibold text-ink-muted">
                Nurse
              </th>
              {DAYS.map((d) => (
                <th key={d.iso} scope="col" className={cx('border-b border-line px-1 py-1.5 text-center', d.weekend ? 'bg-sunken' : 'bg-surface')}>
                  <span className="block text-xs font-medium text-ink-muted">{d.weekday}</span>
                  <span className="block text-sm font-semibold text-ink tabular-nums">{d.day}</span>
                </th>
              ))}
              <th scope="col" className="sticky right-0 z-20 w-24 border-b border-l border-line bg-surface px-3 py-2 text-right text-xs font-semibold text-ink-muted">
                Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {NURSES.map((n, r) => (
              <tr key={n.id}>
                <th scope="row" className="sticky left-0 z-10 border-r border-b border-line bg-surface px-3 py-1 text-left font-normal">
                  <span className="block text-sm font-semibold text-ink">{n.name}</span>
                  <span className="block text-xs text-ink-muted">{n.level}</span>
                </th>
                {n.cells.map((cell, c) => (
                  <td key={DAYS[c].iso} className={cx('border-b border-line p-0.5', DAYS[c].weekend && 'bg-sunken')}>
                    <GridCell
                      nurse={n}
                      day={DAYS[c].iso}
                      cell={cell}
                      tabbable={pos.r === r && pos.c === c}
                      onFocus={() => setPos({ r, c })}
                      cellRef={(el) => {
                        if (el) cellRefs.current.set(`${r}|${c}`, el);
                      }}
                    />
                  </td>
                ))}
                <td className="sticky right-0 z-10 border-b border-l border-line bg-surface px-3 py-1 text-right">
                  <HoursCell nurse={n} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="sticky left-0 z-10 border-r border-line bg-sunken px-3 py-2 text-left text-xs font-semibold text-ink-muted">
                Nurses on shift
              </th>
              {DAYS.map((d, c) => {
                const on = NURSES.filter((n) => n.cells[c]?.kind === 'shift').length;
                return (
                  <td key={d.iso} className="bg-sunken px-1 py-2 text-center text-sm font-semibold text-ink tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      {d.weekend ? '' : on}
                      {dayProblems(d.iso).map((p) => {
                        const P = PROBLEM[p.kind];
                        return (
                          <span key={p.id} role="img" aria-label={`${P.word}: ${p.text}`} title={`${P.word}: ${p.text}`}>
                            <P.icon aria-hidden="true" className={cx('size-4', P.text)} />
                          </span>
                        );
                      })}
                    </span>
                  </td>
                );
              })}
              <td className="sticky right-0 z-10 border-l border-line bg-sunken" />
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2.5 text-sm">
        <p className="text-ink-muted">
          <span className="font-semibold text-ink">
            {selected.name}, {dayLabel(DAYS[pos.c].iso)}:
          </span>{' '}
          {describe(selectedCell)}
          {selectedCell?.kind === 'shift' && selectedCell.pinned ? ' (pinned)' : ''}. Arrow keys move, Enter changes the shift.
        </p>
        <ProblemCount />
      </div>
    </>
  );
}

function ProblemCount() {
  return (
    <p className="text-sm">
      <span className="font-semibold text-danger">{countOf('must')} must fix</span>
      <span className="text-ink-muted"> · </span>
      <span className="font-semibold text-warning">{countOf('check')} to check</span>
      <span className="text-ink-muted"> · </span>
      <span className="text-info">{countOf('note')} note</span>
    </p>
  );
}

/** On a phone the roster is read only, one day at a time. */
function DayView({ index, setIndex }: { index: number; setIndex: (i: number) => void }) {
  const day = DAYS[index];
  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <IconButton label="Previous day" icon={ChevronLeft} disabled={index === 0} onClick={() => setIndex(index - 1)} className="border border-line-strong" />
        <h3 aria-live="polite" className="text-base font-semibold text-ink">
          {dayLabel(day.iso)}
        </h3>
        <IconButton
          label="Next day"
          icon={ChevronRight}
          disabled={index === DAYS.length - 1}
          onClick={() => setIndex(index + 1)}
          className="border border-line-strong"
        />
      </div>
      {dayProblems(day.iso).map((p) => (
        <Notice key={p.id} tone="danger" title={PROBLEM[p.kind].word}>
          {p.text}
        </Notice>
      ))}
      <ul className="divide-y divide-line rounded-lg border border-line">
        {NURSES.map((n) => {
          const cell = n.cells[index];
          const problem = problemAt(n.id, day.iso);
          const P = problem && PROBLEM[problem.kind];
          return (
            <li key={n.id} className="flex items-start justify-between gap-3 px-3 py-2.5">
              <div>
                <p className="font-semibold text-ink">{n.name}</p>
                <p className="text-xs text-ink-muted">{n.level}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-right text-sm">
                <p className={cx('font-semibold', cell ? 'text-ink' : 'text-ink-muted')}>{cell?.kind === 'shift' ? cell.with : describe(cell)}</p>
                {cell?.kind === 'shift' && (
                  <p className="text-ink-muted tabular-nums">
                    {cell.code} {SHIFTS[cell.code].start} to {SHIFTS[cell.code].end}
                  </p>
                )}
                {P && (
                  <Badge tone={P.tone} icon={P.icon}>
                    {P.word}
                  </Badge>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-ink-muted">To change the roster, open it on a laptop or tablet.</p>
    </div>
  );
}

function ProblemList({ onShow }: { onShow: (p: Problem) => void }) {
  return (
    <ul className="divide-y divide-line">
      {PROBLEMS.map((p) => {
        const P = PROBLEM[p.kind];
        const nurse = NURSES.find((n) => n.id === p.nurseId);
        const where = [nurse?.name, p.day && dayLabel(p.day)].filter(Boolean).join(', ') || 'Whole roster';
        return (
          <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
            <span className="w-20 shrink-0">
              <Badge tone={P.tone} icon={P.icon}>
                {P.word}
              </Badge>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">{p.text}</p>
              <p className="text-xs text-ink-muted">{where}</p>
            </div>
            <Button size="sm" variant="ghost" icon={ArrowRight} onClick={() => onShow(p)}>
              Show in grid
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function HoursTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">Hours for each nurse on this roster</caption>
        <thead className="border-b border-line bg-sunken text-xs font-semibold text-ink-muted">
          <tr>
            <th scope="col" className="px-4 py-2 text-left">
              Nurse
            </th>
            <th scope="col" className="px-4 py-2 text-right">
              Goal
            </th>
            <th scope="col" className="px-4 py-2 text-right">
              Worked
            </th>
            <th scope="col" className="px-4 py-2 text-right">
              Leave
            </th>
            <th scope="col" className="px-4 py-2 text-right">
              Difference
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {NURSES.map((n) => (
            <tr key={n.id} className="hover:bg-sunken">
              <th scope="row" className="px-4 py-2 text-left font-semibold text-ink">
                {n.name}
              </th>
              <td className="px-4 py-2 text-right tabular-nums">{n.goal} h</td>
              <td className="px-4 py-2 text-right tabular-nums">{n.worked} h</td>
              <td className="px-4 py-2 text-right tabular-nums">{n.leave} h</td>
              <td className={cx('px-4 py-2 text-right tabular-nums', n.difference < 0 ? 'font-semibold text-warning' : 'text-ink-muted')}>
                {n.difference === 0 ? 'On goal' : n.difference < 0 ? `${-n.difference} h short` : `${n.difference} h over`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RosterCard() {
  const [tab, setTab] = useState('roster');
  const [pos, setPos] = useState<Position>({ r: 0, c: 0 });
  const [dayIndex, setDayIndex] = useState(0);
  const cellRefs = useRef(new Map<string, HTMLButtonElement>());
  const showInGrid = (p: Problem) => {
    const r = Math.max(0, NURSES.findIndex((n) => n.id === p.nurseId));
    const c = Math.max(0, DAYS.findIndex((d) => d.iso === p.day));
    setTab('roster');
    setPos({ r, c });
    setDayIndex(c);
    requestAnimationFrame(() => cellRefs.current.get(`${r}|${c}`)?.focus());
  };
  return (
    <section aria-labelledby="roster-heading" className="rounded-lg border border-line bg-surface shadow-card">
      <h2 id="roster-heading" className="sr-only">
        Roster
      </h2>
      <Tabs
        label="Roster sheets"
        idPrefix="sheet"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'roster', label: 'Roster' },
          { id: 'problems', label: 'Problems', count: PROBLEMS.length, countTone: 'danger' },
          { id: 'hours', label: 'Hours' },
        ]}
      />
      <TabPanel idPrefix="sheet" id="roster" value={tab}>
        <div className="hidden md:block">
          <RosterGrid pos={pos} setPos={setPos} cellRefs={cellRefs} />
        </div>
        <div className="md:hidden">
          <DayView index={dayIndex} setIndex={setDayIndex} />
        </div>
      </TabPanel>
      <TabPanel idPrefix="sheet" id="problems" value={tab}>
        <div className="border-b border-line px-4 py-2.5">
          <ProblemCount />
        </div>
        <ProblemList onShow={showInGrid} />
      </TabPanel>
      <TabPanel idPrefix="sheet" id="hours" value={tab} focusable>
        <HoursTable />
      </TabPanel>
    </section>
  );
}

// ---------------------------------------------------------------- requests and leave

const STATUS: Record<RequestStatus, { tone: Tone; icon: typeof Clock }> = {
  Waiting: { tone: 'warning', icon: Clock },
  Approved: { tone: 'success', icon: CircleCheck },
  Declined: { tone: 'neutral', icon: CircleX },
};

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge tone={STATUS[status].tone} icon={STATUS[status].icon}>
      {status}
    </Badge>
  );
}

const day = (iso: string) => <span className="whitespace-nowrap">{ddmmyyyy(iso)}</span>;
const datesOf = (r: StaffRequest) =>
  r.to ? (
    <>
      {day(r.from)} to {day(r.to)}
    </>
  ) : (
    day(r.from)
  );

function RequestsCard({
  requests,
  onDecide,
  className,
}: {
  requests: StaffRequest[];
  onDecide: (r: StaffRequest, status: RequestStatus) => void;
  className?: string;
}) {
  const waiting = requests.filter((r) => r.status === 'Waiting').length;
  const decide = (r: StaffRequest, wide: boolean) =>
    r.status === 'Waiting' && (
      <span className={cx('flex gap-2', wide ? 'justify-end' : '')}>
        <Button size="sm" onClick={() => onDecide(r, 'Approved')} aria-label={`Approve ${r.nurse}'s request`} className={wide ? '' : 'flex-1'}>
          Approve
        </Button>
        <Button size="sm" onClick={() => onDecide(r, 'Declined')} aria-label={`Decline ${r.nurse}'s request`} className={wide ? '' : 'flex-1'}>
          Decline
        </Button>
      </span>
    );
  return (
    <Card
      className={className}
      bodyClassName=""
      title={
        <>
          Requests <span className="ml-1 text-sm font-normal text-ink-muted">{waiting} waiting</span>
        </>
      }
      actions={
        <Button size="sm" variant="ghost" icon={ArrowRight}>
          All requests
        </Button>
      }
    >
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <caption className="sr-only">Requests from nurses, newest first</caption>
          <thead className="border-b border-line bg-sunken text-left text-xs font-semibold text-ink-muted">
            <tr>
              <th scope="col" className="px-3 py-2">
                Nurse
              </th>
              <th scope="col" className="px-3 py-2">
                Request
              </th>
              <th scope="col" className="px-3 py-2">
                Dates
              </th>
              <th scope="col" className="px-3 py-2">
                Status
              </th>
              <th scope="col" className="px-3 py-2">
                <span className="sr-only">Decision</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {requests.map((r) => (
              <tr key={r.id} className="h-11 hover:bg-sunken">
                <th scope="row" className="px-3 py-1.5 whitespace-nowrap text-left font-semibold text-ink">
                  {r.nurse}
                </th>
                <td className="px-3 py-1.5 whitespace-nowrap">
                  <span className="block">{r.type}</span>
                  <span className="block text-xs text-ink-muted">Sent {ddmmyyyy(r.sent)}</span>
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap tabular-nums">{datesOf(r)}</td>
                <td className="px-3 py-1.5 whitespace-nowrap">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3 py-1.5 whitespace-nowrap">{decide(r, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-line sm:hidden">
        {requests.map((r) => (
          <li key={r.id} className="space-y-2 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-ink">{r.nurse}</p>
                <p className="text-sm text-ink-muted">
                  {r.type}, <span className="tabular-nums">{datesOf(r)}</span>
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            {decide(r, false)}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function LeaveForm({ onSaved }: { onSaved: (message: string) => void }) {
  const [nurseId, setNurseId] = useState('joy');
  const [first, setFirst] = useState('2026-12-21');
  const [last, setLast] = useState('2026-12-18');
  const [left, setLeft] = useState({ first: false, last: false });
  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);
  const format = (what: string) => `Enter the ${what} as DD-MM-YYYY, for example 21-12-2026.`;
  const firstError = left.first && !first ? format('first day') : undefined;
  const lastError =
    left.last && !last
      ? format('last day')
      : first && last && last < first
        ? 'The last day is before the first day. Choose the first day or a later one.'
        : undefined;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeft({ first: true, last: true });
    if (!first || firstError) return firstRef.current?.focus();
    if (!last || lastError) return lastRef.current?.focus();
    const nurse = NURSES.find((n) => n.id === nurseId)!;
    onSaved(`Leave saved for ${nurse.name}, ${ddmmyyyy(first)} to ${ddmmyyyy(last)}.`);
  };
  return (
    <Card title="Add leave for a nurse" bodyClassName="@container p-4">
      <form noValidate onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 @md:grid-cols-2">
          <Field label="Nurse">
            {(p) => (
              <select {...p} className={inputClass} value={nurseId} onChange={(e) => setNurseId(e.target.value)}>
                {NURSES.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Kind of leave">
            {(p) => (
              <select {...p} className={inputClass} defaultValue="AL">
                <option value="AL">Annual leave</option>
                <option value="SL">Sick leave</option>
                <option value="TR">Training</option>
              </select>
            )}
          </Field>
          <Field label="First day" error={firstError}>
            {(p) => <DateInput {...p} inputRef={firstRef} value={first} onChange={setFirst} onBlur={() => setLeft((l) => ({ ...l, first: true }))} />}
          </Field>
          <Field label="Last day" error={lastError}>
            {(p) => <DateInput {...p} inputRef={lastRef} value={last} onChange={setLast} onBlur={() => setLeft((l) => ({ ...l, last: true }))} />}
          </Field>
        </div>
        <Field label="Note" optional hint="The nurse sees this note in their email.">
          {(p) => <textarea {...p} rows={2} className={cx(inputClass, 'h-auto py-2')} />}
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="primary" icon={Save}>
            Save leave
          </Button>
          <Button>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------- publish and messages

function PublishDialog({ open, onClose, onPublish }: { open: boolean; onClose: () => void; onPublish: () => void }) {
  const [copy, setCopy] = useState(true);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Publish the November roster?"
      description={`Each of the ${NURSES.length} nurses gets an email with their shifts.`}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Send} onClick={onPublish}>
            Publish and email nurses
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Notice tone="danger" title={`${countOf('must')} problems still need fixing`}>
          You can publish anyway, but the roster breaks the clinic's rules on Wed 18-11-2026 and Fri 20-11-2026.
        </Notice>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-ink-muted">Roster</dt>
          <dd className="font-semibold text-ink">November, version 1</dd>
          <dt className="text-ink-muted">Dates</dt>
          <dd className="text-ink">{rosterDates}</dd>
          <dt className="text-ink-muted">Nurses</dt>
          <dd className="text-ink">{NURSES.map((n) => n.name).join(', ')}</dd>
        </dl>
        <label className="flex items-start gap-2.5 text-sm text-ink">
          <input type="checkbox" checked={copy} onChange={(e) => setCopy(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-brand" />
          Send me a copy of each email
        </label>
      </div>
    </Dialog>
  );
}

function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:justify-end">
      {message && (
        <div className="enter pointer-events-auto flex max-w-md items-start gap-3 rounded-lg bg-ink px-4 py-3 text-sm text-white shadow-pop">
          <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success-soft" />
          <p className="flex-1">{message}</p>
          <button type="button" onClick={onClose} aria-label="Close message" className="-m-1 rounded p-1 text-white hover:bg-white/10">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- page

export function PlannerSample() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(() => new URLSearchParams(location.search).get('open') === 'publish');
  const [requests, setRequests] = useState(REQUESTS);
  const [toast, setToast] = useState<string | null>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeToast = useCallback(() => setToast(null), []);
  const decide = (r: StaffRequest, status: RequestStatus) => {
    setRequests((all) => all.map((x) => (x.id === r.id ? { ...x, status } : x)));
    setToast(`${status === 'Approved' ? 'Approved' : 'Declined'}. ${r.nurse} gets an email about it.`);
  };
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:font-semibold focus:shadow-pop"
      >
        Skip to main content
      </a>
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 border-r border-line lg:block">
          <Nav />
        </aside>
        <Drawer open={menuOpen} onClose={closeMenu} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar menuOpen={menuOpen} onMenu={() => setMenuOpen(true)} />
          <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1400px] flex-1 space-y-4 px-4 py-5 outline-none sm:px-6">
            <PageHeader onPublish={() => setPublishOpen(true)} />
            <Steps />
            <Stats />
            <RosterCard />
            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
              <RequestsCard requests={requests} onDecide={decide} />
              <LeaveForm onSaved={setToast} />
            </div>
          </main>
        </div>
      </div>
      <PublishDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={() => {
          setPublishOpen(false);
          setToast(`The roster was published and ${NURSES.length} nurses were emailed.`);
        }}
      />
      <Toast message={toast} onClose={closeToast} />
    </>
  );
}
