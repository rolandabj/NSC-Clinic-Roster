import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import type { RosterStep, RosterStepAction } from './rosterSteps';

/** The roster screen's step bar: where this roster is, and the next thing to do. */
export const RosterSteps: React.FC<{ steps: RosterStep[]; onStep: (action: RosterStepAction) => void }> = ({ steps, onStep }) => (
  <nav aria-label="Roster steps" className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-1.5 shrink-0 overflow-x-auto">
    <ol className="flex items-center gap-1 text-[11px] whitespace-nowrap">
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />}
          <button
            type="button"
            onClick={step.action ? () => onStep(step.action!) : undefined}
            disabled={!step.action}
            aria-current={step.current ? 'step' : undefined}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-semibold transition-colors ${
              step.action ? 'cursor-pointer hover:bg-white' : 'cursor-default'
            } ${step.current ? 'bg-white text-indigo-800 ring-1 ring-indigo-300' : step.done ? 'text-emerald-800' : 'text-slate-600'}`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                step.done ? 'bg-emerald-600 text-white' : step.current ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
              aria-hidden="true"
            >
              {step.done ? <Check className="w-2.5 h-2.5" /> : i + 1}
            </span>
            <span>{step.label}</span>
            <span className="sr-only">{step.done ? '(done)' : ''}</span>
          </button>
        </li>
      ))}
    </ol>
  </nav>
);
