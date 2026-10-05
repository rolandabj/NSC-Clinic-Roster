import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Printer, Users, UserRound } from 'lucide-react';
import type { TeamRosterSheet } from '../../types';
import { addDaysIso, weekdayOf } from '../../services/publish/nurseRosterService';
import { dutyDurationHours } from '../../services/hours/hoursBalance';
import { safeColor } from '../../utils/escapeHtml';
import './publishedRosterSheet.css';

const dateLabel = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export function PublishedRosterSheet({ sheet, clinicName, myNurseId, initialNurseId, timezone = 'Asia/Dubai', nurseActions }: {
  sheet: TeamRosterSheet; clinicName: string; myNurseId?: string; initialNurseId?: string; timezone?: string;
  nurseActions?: (nurseId: string) => React.ReactNode;
}) {
  const [nurseId, setNurseId] = useState(initialNurseId || myNurseId || 'ALL');
  const [block, setBlock] = useState(0);
  const [daysPerPage, setDaysPerPage] = useState(14);
  const dates: string[] = [];
  for (let date = sheet.startDate; date <= sheet.endDate; date = addDaysIso(date, 1)) dates.push(date);
  const pageCount = Math.max(1, Math.ceil(dates.length / daysPerPage));
  const currentBlock = Math.min(block, pageCount - 1);
  const visibleDates = dates.slice(currentBlock * daysPerPage, (currentBlock + 1) * daysPerPage);
  const rows = sheet.nurses.filter(n => nurseId === 'ALL' || n.id === nurseId);
  const duties = new Map(sheet.duties.map(d => [d.id, d]));
  const printedPages = Array.from({ length: Math.ceil(dates.length / 14) }, (_, i) => dates.slice(i * 14, (i + 1) * 14));

  const printRows = Array.from({ length: Math.max(1, Math.ceil(rows.length / 12)) }, (_, i) => rows.slice(i * 12, (i + 1) * 12));
  const renderPage = (pageDates: string[], page: number, total: number, pageRows = rows) => (
    <section className="roster-paper" key={page}>
      <header className="roster-paper-heading">
        <div><p className="roster-eyebrow">{clinicName || 'Clinic'} · Nursing roster</p>
          <h2>{sheet.name}</h2><p>{dateLabel(sheet.startDate)} to {dateLabel(sheet.endDate)} · {sheet.startDate.slice(0, 4)}</p>
        </div>
        <div className="roster-edition"><span>Published · Version {sheet.version}</span><p>{timezone}</p><p>Page {page + 1} of {total}</p></div>
      </header>
      <div className="roster-table-scroll" tabIndex={0} role="region" aria-label="Published nursing roster">
        <table className="roster-paper-table">
          <caption className="sr-only">{sheet.name}, {nurseId === 'ALL' ? 'team schedule' : 'personal schedule'}, {dateLabel(pageDates[0] || sheet.startDate)} to {dateLabel(pageDates.at(-1) || sheet.endDate)}</caption>
          <thead><tr><th scope="col" className="roster-name">Nursing team <small>{dateLabel(pageDates[0] || sheet.startDate)} to {dateLabel(pageDates.at(-1) || sheet.endDate)}</small></th>
            {pageDates.map(date => <th scope="col" key={date} className={(sheet.weekendDays || [6, 0]).includes(new Date(`${date}T00:00:00Z`).getUTCDay()) ? 'roster-weekend' : ''}><small>{weekdayOf(date)}</small><strong>{Number(date.slice(8))}</strong><small>{dateLabel(date).split(' ')[1]}</small></th>)}
            <th scope="col" className="roster-total">Shift<small>hours</small></th>
          </tr></thead>
          <tbody>{pageRows.map(nurse => {
            const cells = new Map(nurse.cells.map(c => [c.date, c]));
            const totalHours = nurse.cells.reduce((sum, c) => sum + (pageDates.includes(c.date) && !c.leave ? dutyDurationHours(duties.get(c.dutyId || '') as any) : 0), 0);
            return <tr key={nurse.id} className={nurse.id === myNurseId ? 'roster-my-row' : ''}>
              <th scope="row" className="roster-name">{nurse.name}{nurse.id === myNurseId && <small className="roster-you">You</small>}</th>
              {pageDates.map(date => {
                const cell = cells.get(date), duty = duties.get(cell?.dutyId || '');
                return <td key={date} className={cell?.leave ? 'roster-leave' : !cell ? 'roster-off' : ''} style={duty && !cell?.leave ? { backgroundColor: `color-mix(in srgb, ${safeColor(duty.color, '#64748b')} 15%, white)` } : undefined}>
                  {cell?.leave ? <><b>LV</b><small>Leave</small></> : duty ? <><b>{duty.acronym}</b><small className="roster-time">{duty.startTime}<br />{duty.endTime}</small><small className="roster-detail">{cell?.detail?.replace(/^With /, '')}</small></> : cell ? <><b>Shift</b><small>Ask planner</small></> : <><span>OFF</span><small>Day off</small></>}
                </td>;
              })}
              <td className="roster-total"><b>{Math.round(totalHours * 10) / 10}</b><small>h</small></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="p-5 text-sm text-slate-500">No published shifts for this selection.</p>}
      <footer className="roster-paper-footer">
        <div className="roster-legend">{sheet.duties.map(d => <span key={d.id}><i style={{ backgroundColor: safeColor(d.color, '#64748b') }} /><b>{d.acronym}</b> {d.startTime} to {d.endTime}</span>)}<span><b>LV</b> Leave</span><span><b>OFF</b> Day off</span></div>
        <p>Shift hours cover the dates shown and exclude leave credit. Only published shifts appear here.</p>
      </footer>
    </section>
  );

  return <div className="published-roster-sheet">
    <div className="roster-controls">
      <div className="roster-view-switch" role="group" aria-label="Schedule view">
        {myNurseId && <button type="button" aria-pressed={nurseId === myNurseId} onClick={() => setNurseId(myNurseId)}><UserRound size={16} />My schedule</button>}
        <button type="button" aria-pressed={nurseId === 'ALL'} onClick={() => setNurseId('ALL')}><Users size={16} />Team schedule</button>
      </div>
      <div className="roster-control-actions">
        <select aria-label="Filter by nurse" value={nurseId} onChange={e => setNurseId(e.target.value)}><option value="ALL">All nurses</option>{sheet.nurses.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}</select>
        <select aria-label="Days per page" value={daysPerPage} onChange={e => { setDaysPerPage(Number(e.target.value)); setBlock(0); }}><option value={7}>7 days</option><option value={14}>14 days</option><option value={31}>Full month</option></select>
        <button type="button" onClick={() => window.print()}><Printer size={16} />Print roster</button>
        {nurseId !== 'ALL' && nurseActions?.(nurseId)}
      </div>
    </div>
    <div className="roster-pagination"><p>{nurseId === 'ALL' ? `${rows.length} nurses · Published team schedule` : `${rows[0]?.name || 'Nurse'} · Published schedule`}</p><div>
      <button aria-label="Previous dates" disabled={currentBlock === 0} onClick={() => setBlock(currentBlock - 1)}><ChevronLeft size={17} /></button><span>{dateLabel(visibleDates[0] || sheet.startDate)} to {dateLabel(visibleDates.at(-1) || sheet.endDate)}</span><button aria-label="Next dates" disabled={currentBlock >= pageCount - 1} onClick={() => setBlock(currentBlock + 1)}><ChevronRight size={17} /></button>
    </div></div>
    <div className="roster-screen-pages"><p className="mb-2 text-xs text-slate-500 sm:hidden">Swipe across the grid to see more dates. Names stay in view.</p>{renderPage(visibleDates, currentBlock, pageCount)}</div>
    <div className="roster-print-pages">{printedPages.flatMap((part, index) => printRows.map((pageRows, rowIndex) => renderPage(part, index * printRows.length + rowIndex, printedPages.length * printRows.length, pageRows)))}</div>
  </div>;
}
