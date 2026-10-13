import React from 'react';
import { ClipboardPaste, Copy, Edit2, Trash2 } from 'lucide-react';

/** The menu a right click opens on a cell: more options, copy, paste and clear. */
export const CellContextMenu: React.FC<{
  x: number;
  y: number;
  canPaste: boolean;
  onClose: () => void;
  onMore: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onClear: () => void;
}> = ({ x, y, canPaste, onClose, onMore, onCopy, onPaste, onClear }) => {
  // Every choice closes the menu after it runs.
  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };
  return (
    <div
      className="fixed z-50 bg-white border border-slate-200 rounded shadow-xl py-1 text-xs w-44 animate-in fade-in duration-75"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      <button onClick={run(onMore)} className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer flex items-center gap-2">
        <Edit2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        <span>More options…</span>
      </button>
      <button onClick={run(onCopy)} className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer flex items-center gap-2">
        <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        <span>Copy</span>
      </button>
      <button
        disabled={!canPaste}
        onClick={run(onPaste)}
        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
      >
        <ClipboardPaste className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        <span>Paste</span>
      </button>
      <div className="h-px bg-slate-100 my-1" />
      <button onClick={run(onClear)} className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2">
        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Clear</span>
      </button>
    </div>
  );
};
