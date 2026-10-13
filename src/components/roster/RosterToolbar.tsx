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
import { MenuButton } from '../common/MenuButton';
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

/** The roster screen's toolbar: the roster, its save status, and the main actions (the rest under More). */
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
  <div className="relative bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-[45]">
    <div className="flex flex-wrap items-center gap-2 min-w-0">
      <button
        onClick={onOpenPicker}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-300 hover:border-indigo-400 hover:bg-slate-50 rounded text-slate-800 font-bold transition-colors cursor-pointer min-w-0"
        title="Open another roster, or create a new one"
      >
        <FolderOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
        <span className="truncate max-w-[160px] sm:max-w-[220px]">{activeSchedule ? activeSchedule.name : 'Choose a roster'}</span>
        <span className="text-[10px] text-slate-500 font-normal" aria-hidden="true">▾</span>
      </button>

      {activeSchedule && (
        <>
          <span className="text-slate-600 tabular-nums hidden md:inline">
            {formatDate(activeSchedule.startDate)} to {formatDate(activeSchedule.endDate)}
          </span>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded font-semibold ${
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
                className="text-[11px] px-1.5 py-0.5 rounded inline-flex items-center gap-1 border bg-slate-50 text-slate-700 border-slate-200 hidden lg:inline-flex"
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
        <span role="alert" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1">
          <span>Could not load the roster ({loadError}). Changes will not be saved.</span>
          <button onClick={onReload} className="underline cursor-pointer">
            Reload
          </button>
        </span>
      ) : saveError ? (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1 max-w-md" role="alert">
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
        <span className="text-[11px] text-slate-500" role="status">Saving…</span>
      ) : (
        lastAutosavedAt && (
          <span className="text-[11px] text-slate-500 inline-flex items-center gap-1" title={`Last saved at ${lastAutosavedAt}. Every change is saved as you make it.`}>
            <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
            All changes saved
          </span>
        )
      )}

      {othersHere.length > 0 && (
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded px-2 py-0.5"
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
        className="inline-flex items-center gap-1 px-2 py-1.5 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50 text-slate-700 cursor-pointer disabled:cursor-not-allowed"
        title="Undo the last change (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Undo</span>
      </button>
      <button
        disabled={!canRedo}
        onClick={onRedo}
        className="inline-flex items-center gap-1 px-2 py-1.5 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50 text-slate-700 cursor-pointer disabled:cursor-not-allowed"
        title="Redo the change you undid (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Redo</span>
      </button>

      <MenuButton
        align="right"
        disabled={!activeSchedule}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        title="Fill the roster with shifts"
        label={
          <>
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        title="Send the roster to the nurses"
        label={
          <>
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
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
        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold cursor-pointer"
        title="More actions"
        label={
          <>
            <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">More</span>
          </>
        }
        items={[
          { label: 'New roster…', icon: <Plus className="w-3.5 h-3.5 text-indigo-600" />, onSelect: () => onMenu('new') },
          {
            label: 'Keep a copy…',
            hint: 'Changes save by themselves; this keeps a named copy to go back to',
            icon: <Save className="w-3.5 h-3.5 text-indigo-600" />,
            disabled: !activeSchedule,
            onSelect: () => onMenu('copy'),
          },
          {
            label: 'Backup copies…',
            hint: 'Kept by themselves before each fill or clear',
            icon: <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />,
            disabled: !activeSchedule,
            onSelect: () => onMenu('backups'),
          },
          { label: 'Compare saved copies', icon: <Diff className="w-3.5 h-3.5 text-indigo-600" />, disabled: !activeSchedule, onSelect: () => onMenu('compare') },
          { label: 'Export or print…', icon: <Download className="w-3.5 h-3.5 text-indigo-600" />, disabled: !activeSchedule, onSelect: () => onMenu('export') },
          { label: 'Share links…', icon: <Share2 className="w-3.5 h-3.5 text-indigo-600" />, disabled: !activeSchedule, onSelect: () => onMenu('share') },
          {
            label: 'Fairness…',
            hint: 'Weekends, late shifts and holidays per nurse',
            icon: <Scale className="w-3.5 h-3.5 text-amber-700" />,
            separatorBefore: true,
            disabled: !activeSchedule,
            onSelect: () => onMenu('fairness'),
          },
          {
            label: 'Templates and copy last roster…',
            icon: <Layers className="w-3.5 h-3.5 text-indigo-600" />,
            disabled: !activeSchedule,
            onSelect: () => onMenu('templates'),
          },
          { label: 'Swap two nurses’ shifts…', icon: <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />, disabled: !activeSchedule, onSelect: () => onMenu('swap') },
        ]}
      />
    </div>
  </div>
);
