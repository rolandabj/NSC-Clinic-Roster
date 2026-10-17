import React from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { Schedule } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { Badge, Button, Dialog, IconButton, cx } from '../ui';

interface RosterPickerProps {
  schedules: Schedule[];
  activeScheduleId?: string;
  /** The roster's hours goal as a short chip (for example "184h Target"), with its tooltip. */
  periodChipOf: (s: Schedule) => { label: string; tooltip: string; isExact: boolean };
  onClose: () => void;
  /** Another roster was chosen (the dialog has closed). */
  onPick: (s: Schedule) => void;
  onDelete: (s: Schedule) => void;
  onNew: () => void;
}

/**
 * "Open a roster": the list of rosters, newest first, each with Open and Delete, and New roster.
 * On the shared Dialog since Phase 7, slice 3a; the row and its Delete are two buttons side by
 * side (Delete was a button inside a clickable row).
 */
export const RosterPicker: React.FC<RosterPickerProps> = ({ schedules, activeScheduleId, periodChipOf, onClose, onPick, onDelete, onNew }) => (
  <Dialog
    open
    onClose={onClose}
    title="Open a roster"
    description="Newest first."
    footer={
      <>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            onClose();
            onNew();
          }}
        >
          New roster
        </Button>
      </>
    }
  >
    <ul className="space-y-2 text-sm">
      {[...schedules]
        .sort((a, b) => b.startDate.localeCompare(a.startDate))
        .map((s) => {
          const isActive = s.id === activeScheduleId;
          const chip = periodChipOf(s);
          return (
            <li key={s.id} className={cx('flex items-stretch gap-1 rounded-lg border', isActive ? 'border-brand bg-brand-soft' : 'border-line')}>
              <button
                type="button"
                aria-current={isActive ? 'true' : undefined}
                onClick={() => {
                  onClose();
                  if (!isActive) onPick(s);
                }}
                className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg p-3 text-left hover:bg-sunken"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{s.name}</span>
                    {isActive && <Badge tone="brand">Open now</Badge>}
                    <Badge tone={s.status === 'PUBLISHED' ? 'success' : 'neutral'}>
                      {s.status === 'PUBLISHED' ? 'Published' : 'Draft'}, version {s.activeVersionNumber || 1}
                    </Badge>
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {formatDate(s.startDate)} to {formatDate(s.endDate)}, full time goal {s.hoursTargetFullTime} h
                  </span>
                  <span className="mt-1 block text-xs text-ink-muted" title={chip.tooltip}>
                    {chip.label}
                  </span>
                </span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
              </button>
              <IconButton label={`Delete the roster ${s.name}`} icon={Trash2} onClick={() => onDelete(s)} className="m-1.5 self-center" />
            </li>
          );
        })}
    </ul>
  </Dialog>
);
