import React from 'react';
import { BookOpen, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';
import { GRID_KEY_ID } from './GridLegend';

export type GridZoom = 75 | 90 | 100 | 115;

interface GridToolbarProps {
  isAllDaysExpanded: boolean;
  currentBlockIndex: number;
  numBlocks: number;
  totalDays: number;
  /** The days shown. */
  blockDates: string[];
  /** The roster's days shown at a time, in weeks. */
  blockWeeks: number;
  onBlockChange: (index: number) => void;
  onToggleExpandDays?: () => void;
  groupBy: 'NONE' | 'SENIORITY';
  onGroupBy: (group: 'NONE' | 'SENIORITY') => void;
  /** The Problem marks switch. */
  showProblems: boolean;
  onToggleMarks: () => void;
  zoomLevel: GridZoom;
  onZoom: (zoom: GridZoom) => void;
  /** The Key drawer: what the codes, marks and colors in the grid mean. */
  isKeyOpen: boolean;
  onToggleKey: () => void;
}

/** The grid's toolbar: the days shown, show all days, grouping, Problem marks, zoom and the Key. */
export const GridToolbar: React.FC<GridToolbarProps> = ({
  isAllDaysExpanded,
  currentBlockIndex,
  numBlocks,
  totalDays,
  blockDates,
  blockWeeks,
  onBlockChange,
  onToggleExpandDays,
  groupBy,
  onGroupBy,
  showProblems,
  onToggleMarks,
  zoomLevel,
  onZoom,
  isKeyOpen,
  onToggleKey,
}) => (
  <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-20">
    <div className="flex items-center gap-2">
      {/* Block Navigation */}
      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
        <button
          disabled={isAllDaysExpanded || currentBlockIndex === 0}
          onClick={() => onBlockChange(currentBlockIndex - 1)}
          className="p-1 rounded hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
          title="Show the earlier days"
          aria-label="Show the earlier days"
        >
          <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <span className="font-mono font-bold text-slate-800 px-2 tabular-nums">
          {isAllDaysExpanded
            ? `All ${totalDays} days, ${formatDate(blockDates[0] || '')} to ${formatDate(blockDates[blockDates.length - 1] || '')}`
            : `Days ${formatDate(blockDates[0] || '')} to ${formatDate(blockDates[blockDates.length - 1] || '')}`}
        </span>
        <button
          disabled={isAllDaysExpanded || currentBlockIndex >= numBlocks - 1}
          onClick={() => onBlockChange(currentBlockIndex + 1)}
          className="p-1 rounded hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
          title="Show the later days"
          aria-label="Show the later days"
        >
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {onToggleExpandDays && (
        <button
          onClick={onToggleExpandDays}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer transition-colors ${
            isAllDaysExpanded
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
          title={isAllDaysExpanded ? `Show ${(blockWeeks || 2) * 7} days at a time` : 'Show every day of the roster'}
        >
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isAllDaysExpanded ? `All ${blockDates.length} days ✓` : 'Show all days'}</span>
        </button>
      )}

      <div className="h-4 w-px bg-slate-200" />

      <div className="flex items-center gap-1 text-slate-600">
        <span className="text-[11px] text-slate-400">Group:</span>
        <select
          aria-label="Group nurses"
          value={groupBy}
          onChange={(e) => onGroupBy(e.target.value as 'NONE' | 'SENIORITY')}
          className="px-1.5 py-1 border border-slate-200 rounded bg-white text-xs"
        >
          <option value="NONE">None</option>
          <option value="SENIORITY">By seniority</option>
        </select>
      </div>

      <button
        type="button"
        role="switch"
        onClick={() => onToggleMarks()}
        aria-checked={showProblems}
        title={
          showProblems
            ? 'Problem marks are on: a red corner on a cell, a badge on a day, a mark by a nurse. Click to hide them.'
            : 'Problem marks are off. Click to show them.'
        }
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs cursor-pointer ${
          showProblems
            ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
            : 'border-slate-200 text-slate-600'
        }`}
      >
        <span
          aria-hidden="true"
          className={`relative inline-block w-6 h-3.5 rounded-full transition-colors ${showProblems ? 'bg-amber-500' : 'bg-slate-300'}`}
        >
          <span
            className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all ${showProblems ? 'left-3' : 'left-0.5'}`}
          />
        </span>
        Problem marks
      </button>
    </div>

    {/* Right side: zoom and the Key */}
    <div className="flex items-center gap-2">
      <div className="inline-flex rounded border border-slate-200 p-0.5 bg-slate-50">
        <button
          onClick={() => onZoom(75)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
            zoomLevel === 75 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
          }`}
          title="Smaller, to fit more days"
        >
          75%
        </button>
        <button
          onClick={() => onZoom(90)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
            zoomLevel === 90 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
          }`}
        >
          90%
        </button>
        <button
          onClick={() => onZoom(100)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
            zoomLevel === 100 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
          }`}
        >
          100%
        </button>
        <button
          onClick={() => onZoom(115)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
            zoomLevel === 115 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
          }`}
        >
          115%
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleKey}
        aria-expanded={isKeyOpen}
        aria-controls={GRID_KEY_ID}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded font-medium cursor-pointer ${
          isKeyOpen ? 'border-indigo-300 bg-indigo-50 text-indigo-800' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
        Key
      </button>

    </div>
  </div>
);
