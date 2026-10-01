/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Rules tab.
 *
 * Every rule the roster generator and the checker use, written as a plain
 * sentence with its number in place. Each rule has an on/off switch and a
 * "Must" (never broken) or "Try to" (followed when possible) choice. Changes
 * save straight away.
 */

import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, Lock, Minus, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { RuleSyncService } from '../../../services/rules/ruleSyncService';
import { Rule, RuleTemplateKey } from '../../../types';
import { HoursPolicyConfig } from '../../../types/settings';
import { confirmDialog } from '../../common/dialogs';
import { SaveNotifier } from './shared';

interface RulesTabProps {
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
  /** Writes rule values that mirror Hours Policy fields back into the hours policy. */
  syncHoursPolicyFromRule: (updates: Partial<HoursPolicyConfig>) => void;
}

interface NumberField {
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

interface RuleDef {
  key: RuleTemplateKey;
  id: string;
  title: string;
  /** The sentence, with {value} (and {time}) where the inputs go. */
  sentence: string;
  help: string;
  value?: NumberField;
  /** The rule has a "late" time (params.thresholdTime). */
  hasTime?: boolean;
  /** What "Try to" means for this rule, shown on hover. */
  softMeaning?: string;
}

interface RuleGroup {
  title: string;
  description: string;
  rules: RuleDef[];
}

const GROUPS: RuleGroup[] = [
  {
    title: 'Clinic coverage',
    description: 'Who must be on duty every day.',
    rules: [
      {
        key: 'DEDICATED_NURSE_CLINIC',
        id: 'rule-nurse-clinic',
        title: 'Nurse Clinic',
        sentence: 'Keep {value} nurse(s) at Nurse Clinic every day, not with a doctor.',
        help: 'Only nurses with the Nurse Clinic option in their profile are chosen. She also does blood collection.',
        value: { min: 1, max: 5 },
      },
      {
        key: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS',
        id: 'rule-nurse-plus-one',
        title: 'Free nurse every hour',
        sentence: 'Keep at least {value} free nurse(s) at every opening hour.',
        help: 'A free nurse is not with a doctor at that hour. The Nurse Clinic nurse counts, and so does a doctor’s nurse after her doctor leaves. Not checked on public holidays.',
        value: { min: 1, max: 5 },
      },
      {
        key: 'SENIOR_ON_DUTY',
        id: 'rule-h1',
        title: 'Senior nurse',
        sentence: 'At least one senior nurse is on duty every day.',
        help: 'Any shift counts; she does not need to cover all opening hours.',
      },
    ],
  },
  {
    title: 'Working hours',
    description: 'How far a nurse may go past her hours goal for the period.',
    rules: [
      {
        key: 'MAX_WORKING_HOURS_PER_PERIOD',
        id: 'rule-h7-max-hours',
        title: 'Hours limit',
        sentence: 'A nurse works at most {value} of her hours goal.',
        help: '100% means never over her goal. Above 100%, she may go over by at most one shift (8 hours), and only when a doctor or the free nurse would otherwise have nobody.',
        value: { min: 100, max: 150, step: 5, unit: '%' },
        softMeaning: 'Going over is only reported, not stopped.',
      },
    ],
  },
  {
    title: 'Days in a row and rest',
    description: 'Keeps shifts safe and spread out.',
    rules: [
      {
        key: 'MAX_CONSECUTIVE_DAYS',
        id: 'rule-h2',
        title: 'Days in a row',
        sentence: 'A nurse works at most {value} days in a row.',
        help: 'The last days of the previous roster count too.',
        value: { min: 1, max: 14 },
        softMeaning: 'Longer runs are avoided where possible.',
      },
      {
        key: 'MIN_REST_HOURS',
        id: 'rule-h3',
        title: 'Rest between shifts',
        sentence: 'At least {value} hours of rest between the end of one shift and the start of the next.',
        help: 'For example, a shift ending at 21:00 and the next one starting at 09:00 gives 12 hours of rest.',
        value: { min: 0, max: 24 },
        softMeaning: 'Short rest is only reported, not stopped.',
      },
      {
        key: 'MAX_CONSECUTIVE_LATE_DUTIES',
        id: 'rule-s1',
        title: 'Late shifts in a row',
        sentence: 'A nurse works at most {value} late shifts in a row. A shift is late when it ends at or after {time}.',
        help: 'With 2, a nurse who worked two late shifts gets an earlier shift or a day off next.',
        value: { min: 1, max: 14 },
        hasTime: true,
        softMeaning: 'Longer runs are avoided where possible.',
      },
    ],
  },
];

/** Rules that are always applied; shown for information only. */
const ALWAYS_ON: { key: RuleTemplateKey; title: string; sentence: string }[] = [
  { key: 'MAX_DUTIES_PER_DAY', title: 'One shift a day', sentence: 'A nurse works at most one shift a day.' },
  {
    key: 'STRICT_PROFILE_ALLOCATION',
    title: 'Doctors in the profile',
    sentence: 'A nurse with doctors or specialties in her profile only works with those.',
  },
];

const KNOWN_KEYS = new Set<string>([...GROUPS.flatMap((g) => g.rules.map((r) => r.key)), ...ALWAYS_ON.map((r) => r.key)]);

function findRule(rules: Rule[], def: { key: string; id?: string }): Rule | undefined {
  return rules.find((r) => r.templateKey === def.key) || (def.id ? rules.find((r) => r.id === def.id) : undefined);
}

/** On/off switch. */
const Toggle: React.FC<{ on: boolean; label: string; onChange: () => void }> = ({ on, label, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
      on ? 'bg-indigo-600' : 'bg-slate-300'
    }`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
  </button>
);

/** "Must" / "Try to" choice. */
const Strictness: React.FC<{ value: 'HARD' | 'SOFT'; disabled: boolean; softMeaning?: string; onChange: (v: 'HARD' | 'SOFT') => void; label: string }> = ({
  value,
  disabled,
  softMeaning,
  onChange,
  label,
}) => (
  <div role="radiogroup" aria-label={label} className={`inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-[11px] ${disabled ? 'opacity-50' : ''}`}>
    {(['HARD', 'SOFT'] as const).map((option) => (
      <button
        key={option}
        type="button"
        role="radio"
        aria-checked={value === option}
        disabled={disabled}
        title={option === 'HARD' ? 'Never broken' : softMeaning || 'Followed when possible'}
        onClick={() => onChange(option)}
        className={`rounded px-2 py-0.5 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          value === option ? 'bg-white text-indigo-700 font-semibold shadow-xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {option === 'HARD' ? 'Must' : 'Try to'}
      </button>
    ))}
  </div>
);

/** A small number box with − and + buttons; saves on +/−, Enter or leaving the box. */
const Stepper: React.FC<{ value: number; field: NumberField; disabled: boolean; label: string; onCommit: (v: number) => void }> = ({
  value,
  field,
  disabled,
  label,
  onCommit,
}) => {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const step = field.step || 1;
  const clamp = (n: number) => Math.min(field.max, Math.max(field.min, n));
  const commit = (n: number) => {
    const next = clamp(Math.round(n / step) * step);
    setDraft(String(next));
    if (next !== value) onCommit(next);
  };
  return (
    <span className={`inline-flex items-center gap-1 align-middle ${disabled ? 'opacity-50' : ''}`}>
      <span className="inline-flex items-center rounded-md border border-slate-300 bg-white">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={disabled || value <= field.min}
          onClick={() => commit(value - step)}
          className="px-1 py-0.5 text-slate-500 hover:text-slate-900 disabled:opacity-40"
        >
          <Minus className="h-3 w-3" aria-hidden="true" />
        </button>
        <input
          type="number"
          inputMode="numeric"
          aria-label={label}
          disabled={disabled}
          min={field.min}
          max={field.max}
          step={step}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            const n = Number(draft);
            if (draft.trim() === '' || Number.isNaN(n)) setDraft(String(value));
            else commit(n);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          className="w-10 border-x border-slate-200 py-0.5 text-center font-semibold tabular-nums text-slate-900 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={disabled || value >= field.max}
          onClick={() => commit(value + step)}
          className="px-1 py-0.5 text-slate-500 hover:text-slate-900 disabled:opacity-40"
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
        </button>
      </span>
      {field.unit && <span className="text-slate-600">{field.unit}</span>}
    </span>
  );
};

export const RulesTab: React.FC<RulesTabProps> = ({ rules, setRules, loadData, triggerSaveNotification, syncHoursPolicyFromRule }) => {
  const repo = getRepository();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showOther, setShowOther] = useState(false);

  const saveRule = async (rule: Rule, updates: Partial<Rule>, message: string) => {
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, ...updates } : r)));
    try {
      await repo.update('rules', rule.id, updates);
      triggerSaveNotification(message);
    } catch (err: any) {
      triggerSaveNotification(`Not saved: ${err?.message || err}`);
      loadData();
      return;
    }
    // Keep the Hours Policy tab in step with these two rules
    if (updates.value !== undefined) {
      if (rule.templateKey === 'MAX_CONSECUTIVE_DAYS') syncHoursPolicyFromRule({ maxConsecutiveDays: updates.value });
      if (rule.templateKey === 'MIN_REST_HOURS') syncHoursPolicyFromRule({ minRestBetweenDuties: updates.value });
    }
  };

  const addMissingRules = async () => {
    setIsSyncing(true);
    try {
      const result = await RuleSyncService.syncStandardRules();
      setRules(result.rules);
      triggerSaveNotification('Standard rules checked; any missing ones were added.');
      loadData();
    } catch (err) {
      console.error('Failed to add standard rules:', err);
      triggerSaveNotification('The standard rules could not be added.');
    } finally {
      setIsSyncing(false);
    }
  };

  const shownIds = new Set(
    [...GROUPS.flatMap((g) => g.rules), ...ALWAYS_ON].map((def) => findRule(rules, def)?.id).filter(Boolean) as string[]
  );
  const otherRules = rules.filter((r) => !shownIds.has(r.id) && !(r.templateKey && KNOWN_KEYS.has(r.templateKey)));
  const missingCount = GROUPS.flatMap((g) => g.rules).filter((def) => !findRule(rules, def)).length;

  const renderSentence = (def: RuleDef, rule: Rule, enabled: boolean) => {
    const parts = def.sentence.split(/(\{value\}|\{time\})/);
    return parts.map((part, i) => {
      if (part === '{value}' && def.value) {
        return (
          <Stepper
            key={i}
            value={Number(rule.value) || def.value.min}
            field={def.value}
            disabled={!enabled}
            label={def.title}
            onCommit={(v) => saveRule(rule, { value: v }, `${def.title}: set to ${v}${def.value?.unit === '%' ? '%' : ''}.`)}
          />
        );
      }
      if (part === '{time}') {
        const time = (rule.params as any)?.thresholdTime || '21:00';
        return (
          <input
            key={i}
            type="time"
            aria-label={`${def.title}: late from`}
            disabled={!enabled}
            value={time}
            onChange={(e) => {
              if (e.target.value && e.target.value !== time) {
                saveRule(rule, { params: { ...(rule.params || {}), thresholdTime: e.target.value } }, `${def.title}: late from ${e.target.value}.`);
              }
            }}
            className={`mx-0.5 rounded-md border border-slate-300 bg-white px-1.5 py-0.5 align-middle font-semibold tabular-nums text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              enabled ? '' : 'opacity-50'
            }`}
          />
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Scheduling rules</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            These rules guide the roster generator and the roster checker. Change a number and it saves straight away.
            <span className="ml-1 text-slate-600">
              <strong className="font-semibold text-slate-800">Must</strong> rules are never broken;{' '}
              <strong className="font-semibold text-slate-800">Try to</strong> rules are followed when possible.
            </span>
          </p>
        </div>
        {missingCount > 0 && (
          <button
            type="button"
            onClick={addMissingRules}
            disabled={isSyncing}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} aria-hidden="true" />
            {isSyncing ? 'Adding…' : `Add ${missingCount} missing rule${missingCount === 1 ? '' : 's'}`}
          </button>
        )}
      </div>

      {/* Rule groups */}
      {GROUPS.map((group) => (
        <section key={group.title} aria-labelledby={`rules-${group.title}`} className="space-y-2">
          <div>
            <h3 id={`rules-${group.title}`} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {group.title}
            </h3>
            <p className="text-xs text-slate-400">{group.description}</p>
          </div>
          <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
            {group.rules.map((def) => {
              const rule = findRule(rules, def);
              if (!rule) {
                return (
                  <div key={def.key} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-700">{def.title}</p>
                      <p className="text-xs text-slate-400">This rule is not set up yet.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addMissingRules}
                      disabled={isSyncing}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                );
              }
              const enabled = rule.enabled !== false;
              const severity = (rule.severity || 'HARD') as 'HARD' | 'SOFT';
              return (
                <div key={rule.id} className={`flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between ${enabled ? '' : 'bg-slate-50/60'}`}>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${enabled ? 'text-slate-900' : 'text-slate-500'}`}>{def.title}</p>
                    <p className={`mt-1 text-sm leading-7 ${enabled ? 'text-slate-700' : 'text-slate-400'}`}>{renderSentence(def, rule, enabled)}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{enabled ? def.help : 'Switched off: the generator and the checker ignore this rule.'}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:pt-0.5">
                    <Strictness
                      value={severity}
                      disabled={!enabled}
                      softMeaning={def.softMeaning}
                      label={`${def.title}: must or try to`}
                      onChange={(v) => saveRule(rule, { severity: v }, `${def.title}: ${v === 'HARD' ? 'must' : 'try to'}.`)}
                    />
                    <Toggle
                      on={enabled}
                      label={`${def.title} ${enabled ? 'on' : 'off'}`}
                      onChange={() => saveRule(rule, { enabled: !enabled }, `${def.title} switched ${enabled ? 'off' : 'on'}.`)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Always applied */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Always applied</h3>
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
          {ALWAYS_ON.map((r) => (
            <div key={r.key} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{r.title}</p>
                <p className="text-sm text-slate-600">{r.sentence}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Always on
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Old custom rules the generator does not use */}
      {otherRules.length > 0 && (
        <section className="space-y-2">
          <button
            type="button"
            onClick={() => setShowOther((v) => !v)}
            aria-expanded={showOther}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showOther ? '' : '-rotate-90'}`} aria-hidden="true" />
            Other saved rules ({otherRules.length}) — not used by the roster generator
          </button>
          {showOther && (
            <div className="divide-y divide-slate-100 rounded-lg border border-dashed border-slate-300 bg-white">
              {otherRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="text-slate-600">{rule.name}</span>
                  <button
                    type="button"
                    aria-label={`Delete ${rule.name}`}
                    onClick={async () => {
                      if (
                        await confirmDialog({
                          title: 'Delete rule',
                          message: `Delete "${rule.name}"? It is not used by the roster generator.`,
                          confirmLabel: 'Delete',
                          danger: true,
                        })
                      ) {
                        await repo.remove('rules', rule.id);
                        triggerSaveNotification('Rule deleted.');
                        loadData();
                      }
                    }}
                    className="rounded p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        Changes apply the next time you generate or check a roster.
      </p>
    </div>
  );
};
