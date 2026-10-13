import React from 'react';
import {
  ArrowLeftRight,
  Check,
  Clock,
  Diff,
  Download,
  FolderOpen,
  History,
  Layers,
  MoreHorizontal,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Scale,
  Send,
  Share2,
  Sparkles,
  Trash2,
  Undo2,
} from 'lucide-react';
import type { PresenceRecord, Schedule } from '../../types';
import type { RegenerateMode } from '../../services/engine/types';
import { MenuButton, type MenuItem } from '../common/MenuButton';
import { formatDate } from '../../utils/dateUtils';

/** The entries of the toolbar's More menu. */
export type RosterMenuItem = 'new' | 'copy' | 'backups' | 'compare' | 'export' | 'share' | 'fairness' | 'templates' | 'swap';

interface RosterToolbarProps {
  activeSchedule: Schedule | null;
  /** The roster's hours goal as a short chip, with its tooltip. */
  periodChip?: { label: string; tooltip: string };
  loadError: string | null;
  saveError: string | null;
  /** A failed save waits, so Retry now can be offered. */
  canRetry: boolean;
  isSaving: boolean;
  lastAutosavedAt: string | null;
  /** Other planners with this roster open. */
  othersHere: PresenceRecord[];
  canUndo: boolean;
  canRedo: boolean;
  /** A version of this roster was published at some time. */
  hasPublished: boolean;
  /** Cells that differ from the last published version. */
  changedSincePublish: number;
  onOpenPicker: () => void;
  onReload: () => void;
  onRetry: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFill: (mode: RegenerateMode) => void;
  onPublish: (mode: 'PUBLISH' | 'CHANGE') => void;
  onMenu: (item: RosterMenuItem) => void;
}

const ICON = 'w-3.5 h-3.5 text-indigo-600';

/**
 * More's entries in four named groups (UI overhaul Phase 4, slice 3): Roster (a new one, or one
 * started from a template or the last roster), Copies (keep, restore, compare), Share and export,
 * and Tools. Only New roster can be used with no roster open.
 */
export function moreMenuItems({ hasRoster, onMenu }: { hasRoster: boolean; onMenu: (item: RosterMenuItem) => void }): MenuItem[] {
  const off = !hasRoster;
  return [
    { group: 'Roster', label: 'New roster…', icon: <Plus className={ICON} />, onSelect: () => onMenu('new') },
    { group: 'Roster', label: 'Templates and copy last roster…', icon: <Layers className={ICON} />, disabled: off, onSelect: () => onMenu('templates') },
    {
      group: 'Copies',
      label: 'Keep a copy…',
      hint: 'Changes save by themselves; this keeps a named copy to go back to',
      icon: <Save className={ICON} />,
      disabled: off,
      onSelect: () => onMenu('copy'),
    },
    {
      group: 'Copies',
      label: 'Backup copies…',
      hint: 'Kept by themselves before each fill or clear',
      icon: <RotateCcw className={ICON} />,
      disabled: off,
      onSelect: () => onMenu('backups'),
    },
    { group: 'Copies', label: 'Compare saved copies', icon: <Diff className={ICON} />, disabled: off, onSelect: () => onMenu('compare') },
    { group: 'Share and export', label: 'Export or print…', icon: <Download className={ICON} />, disabled: off, onSelect: () => onMenu('export') },
    { group: 'Share and export', label: 'Share links…', icon: <Share2 className={ICON} />, disabled: off, onSelect: () => onMenu('share') },
    {
      group: 'Tools',
      label: 'Fairness…',
      hint: 'Weekends, late shifts and holidays per nurse',
      icon: <Scale className="w-3.5 h-3.5 text-amber-700" />,
      disabled: off,
      onSelect: () => onMenu('fairness'),
    },
    { group: 'Tools', label: 'Swap two nurses’ shifts…', icon: <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />, disabled: off, onSelect: () => onMenu('swap') },
  ];
}

/**
 * The roster screen's toolbar: the roster, its save status, and the main actions (the rest under
 * More). It fits on one line from 1024 px: the dates show from 1536 px (the top bar shows them
 * too), the hours goal from 1280 px, and Undo and Redo only their icons below 1280 px.
 */
export const RosterToolbar: React.FC<RosterToolbarProps> = ({
  activeSchedule,
  periodChip,
  loadError,
  saveError,
  canRetry,
  isSaving,
  lastAutosavedAt,
  othersHere,
  canUndo,
  canRedo,
  hasPublished,
  changedSincePublish,
  onOpenPicker,
  onReload,
  onRetry,
  onUndo,
  onRedo,
  onFill,
  onPublish,
  onMenu,
}) => (
  <div className="relative bg-surface border-b border-line px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-[45]">
    <div className="flex flex-wrap items-center gap-2 min-w-0">
      <button
        onClick={onOpenPicker}
        className="inline-flex h-9 items-center gap-1.5 px-3 border border-line-strong hover:bg-sunken rounded-md text-sm text-ink font-semibold transition-colors cursor-pointer min-w-0 pointer-coarse:min-h-11"
        title="Open another roster, or create a new one"
      >
        <FolderOpen className="size-4 text-indigo-600 shrink-0" aria-hidden="true" />
        <span className="truncate max-w-[160px] sm:max-w-[220px]">{activeSchedule ? activeSchedule.name : 'Choose a roster'}</span>
        <span className="text-xs text-ink-muted font-normal" aria-hidden="true">▾</span>
      </button>

      {activeSchedule && (
        <>
          <span className="text-sm text-ink-muted hidden 2xl:inline">
            {formatDate(activeSchedule.startDate)} to {formatDate(activeSchedule.endDate)}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded font-semibold whitespace-nowrap ${
              activeSchedule.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
            title={`Saved copy number ${activeSchedule.activeVersionNumber || 1}`}
          >
            {activeSchedule.status === 'PUBLISHED' ? 'Published' : 'Draft'} · v{activeSchedule.activeVersionNumber || 1}
          </span>
          {periodChip && (() => {
            const chip = periodChip;
            return (
              <span
                className="text-xs px-1.5 py-0.5 rounded items-center gap-1 border bg-slate-50 text-slate-700 border-slate-200 whitespace-nowrap hidden xl:inline-flex"
                title={chip.tooltip}
              >
                <Clock className="w-3 h-3 text-indigo-600" aria-hidden="true" />
                <span>{chip.label}</span>
              </span>
            );
          })()}
        </>
      )}

      {/* Save status (changes save by themselves; this says whether they did) */}
      {loadError ? (
        <span role="alert" className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1">
          <span>Could not load the roster ({loadError}). Changes will not be saved.</span>
          <button onClick={onReload} className="underline cursor-pointer">
            Reload
          </button>
        </span>
      ) : saveError ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1 max-w-md" role="alert">
          <span className="truncate" title={saveError}>{saveError}</span>
          {canRetry && (
            <button
              onClick={onRetry}
              className="underline cursor-pointer shrink-0"
            >
              Retry now
            </button>
          )}
        </span>
      ) : isSaving ? (
        <span className="text-xs text-ink-muted whitespace-nowrap" role="status">Saving…</span>
      ) : (
        lastAutosavedAt && (
          <span className="text-xs text-ink-muted inline-flex items-center gap-1 whitespace-nowrap" title={`Last saved at ${lastAutosavedAt}. Every change is saved as you make it.`}>
            <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
            All changes saved
          </span>
        )
      )}

      {othersHere.length > 0 && (
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded px-2 py-0.5"
          title={othersHere.map((p) => `${p.name} (${p.email})`).join(', ')}
          role="status"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" aria-hidden="true" />
          {othersHere.length === 1 ? `${othersHere[0].name} is also here` : `${othersHere.length} others are also here`}
        </span>
      )}
    </div>

    <div className="flex items-center gap-1.5">
      <button
        disabled={!canUndo}
        onClick={onUndo}
        className="inline-flex h-9 items-center gap-1.5 px-2.5 border border-line-strong rounded-md text-sm font-medium disabled:opacity-50 hover:bg-sunken text-ink cursor-pointer disabled:cursor-not-allowed pointer-coarse:min-h-11"
        title="Undo the last change (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 className="size-4" aria-hidden="true" />
        <span className="hidden xl:inline">Undo</span>
      </button>
      <button
        disabled={!canRedo}
        onClick={onRedo}
        className="inline-flex h-9 items-center gap-1.5 px-2.5 border border-line-strong rounded-md text-sm font-medium disabled:opacity-50 hover:bg-sunken text-ink cursor-pointer disabled:cursor-not-allowed pointer-coarse:min-h-11"
        title="Redo the change you undid (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="size-4" aria-hidden="true" />
        <span className="hidden xl:inline">Redo</span>
      </button>

      <MenuButton
        align="right"
        disabled={!activeSchedule}
        className="inline-flex h-9 items-center gap-1.5 px-3 border border-line-strong bg-surface hover:bg-sunken text-ink text-sm rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 pointer-coarse:min-h-11"
        title="Fill the roster with shifts"
        label={
          <>
            <Sparkles className="size-4 text-brand" aria-hidden="true" />
            <span>Fill roster</span>
            <span aria-hidden="true">▾</span>
          </>
        }
        items={[
          {
            label: 'Fill the whole roster',
            hint: 'Pinned days, leave and your hand changes are kept',
            icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />,
            onSelect: () => onFill('GENERATE_ALL'),
          },
          {
            label: 'Fill empty cells only',
            hint: 'Every shift already on the roster stays',
            icon: <Plus className="w-3.5 h-3.5 text-indigo-600" />,
            onSelect: () => onFill('EMPTY_ONLY'),
          },
          {
            label: 'Clear filled shifts…',
            hint: 'Removes the shifts the app filled in',
            icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
            danger: true,
            separatorBefore: true,
            onSelect: () => onFill('CLEAR_GENERATED'),
          },
        ]}
      />

      <MenuButton
        align="right"
        disabled={!activeSchedule}
        className="inline-flex h-9 items-center gap-1.5 px-3 bg-brand hover:bg-brand-strong text-white text-sm rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 pointer-coarse:min-h-11"
        title="Send the roster to the nurses"
        label={
          <>
            <Send className="size-4" aria-hidden="true" />
            <span>Publish</span>
            <span aria-hidden="true">▾</span>
          </>
        }
        items={[
          {
            label: 'Publish the roster',
            hint: 'Email every nurse their shifts',
            icon: <Send className="w-3.5 h-3.5 text-emerald-600" />,
            onSelect: () => onPublish('PUBLISH'),
          },
          {
            label: 'Send changes only',
            hint: hasPublished
              ? changedSincePublish > 0
                ? `${changedSincePublish} cell${changedSincePublish === 1 ? '' : 's'} changed since the last publish`
                : 'Nothing has changed since the last publish'
              : 'Publish the roster once first',
            icon: <History className="w-3.5 h-3.5 text-amber-600" />,
            disabled: !hasPublished,
            onSelect: () => onPublish('CHANGE'),
          },
        ]}
      />

      <MenuButton
        align="right"
        ariaLabel="More actions"
        className="inline-flex h-9 items-center gap-1.5 px-3 border border-line-strong hover:bg-sunken text-ink text-sm rounded-md font-semibold cursor-pointer pointer-coarse:min-h-11"
        title="More actions"
        label={
          <>
            <MoreHorizontal className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">More</span>
          </>
        }
        items={moreMenuItems({ hasRoster: !!activeSchedule, onMenu })}
      />
    </div>
  </div>
);
