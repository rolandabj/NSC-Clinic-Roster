/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Rules tab.
 *
 * Every rule the roster generator and the checker use, written as a plain
 * sentence with its number in place. Each rule has an on/off switch and a
 * "Must" (never broken) or "Try to" (followed when possible) choice. Changes
 * are a draft, saved only by Save, with Cancel (UI overhaul Phase 8, slice 1c).
 */

import React, { useEffect, useState } from 'react';
import { ChevronDown, Lock, Minus, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { RuleSyncService } from '../../../services/rules/ruleSyncService';
import { Rule, RuleTemplateKey } from '../../../types';
import { LATE_DUTY_RULE_WORDS, resolveRule } from '../../../services/engine/SchedulingEngine';
import { WEEK_HOURS_DEFAULT, WEEK_HOURS_RULE } from '../../../services/engine/weekHours';
import { confirmDialog, notify } from '../../common/dialogs';
import { Badge, Button, IconButton, Notice, cx } from '../../ui';
import { SaveBar, SaveNotifier } from './shared';

interface RulesTabProps {
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
  changed: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
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
  /** The value the roster generator uses when none is set. */
  fallback?: number;
  /** Words in an older rule's name that the generator also matches (see resolveRule). */
  keywords: string[];
  excludeKeywords?: string[];
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
        keywords: ['dedicated nurse clinic', 'nurse clinic coverage'],
        fallback: 1,
        title: 'Nurse Clinic',
        sentence: 'Keep {value} nurse(s) at Nurse Clinic every day, not with a doctor.',
        help: 'Only nurses with the Nurse Clinic option in their profile are chosen. That nurse also does blood collection.',
        value: { min: 1, max: 5 },
      },
      {
        key: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS',
        id: 'rule-nurse-plus-one',
        keywords: ['additional nurse', 'above doctors', 'plus one'],
        fallback: 1,
        title: 'Free nurse every hour',
        sentence: 'Keep at least {value} free nurse(s) at every opening hour.',
        help: 'A free nurse is not with a doctor at that hour. The Nurse Clinic nurse counts, and so does a doctor’s nurse once their doctor leaves. Not checked on public holidays.',
        value: { min: 1, max: 5 },
      },
      {
        key: 'SENIOR_ON_DUTY',
        id: 'rule-h1',
        keywords: ['senior nurse', 'senior on duty'],
        title: 'Senior nurse',
        sentence: 'At least one senior nurse is on duty every day.',
        help: 'Any shift counts; the senior nurse does not need to cover all opening hours.',
      },
    ],
  },
  {
    title: 'Working hours',
    description: 'How many hours a nurse may work: in the period, and in any 7 days.',
    rules: [
      {
        key: 'MAX_WORKING_HOURS_PER_PERIOD',
        id: 'rule-h7-max-hours',
        keywords: ['working hours', 'max hours', 'period hours', 'overwork', 'hour limit'],
        fallback: 105,
        title: 'Hours limit',
        sentence: 'A nurse works at most {value} of their hours goal.',
        help: '100% means never over their goal. Above 100%, a nurse may go over by at most one shift (8 hours), and only when a doctor or the free nurse would otherwise have nobody.',
        value: { min: 100, max: 150, step: 5, unit: '%' },
        softMeaning: 'Going over is only reported, not stopped.',
      },
      {
        key: 'MAX_HOURS_IN_7_DAYS',
        id: WEEK_HOURS_RULE.id,
        keywords: WEEK_HOURS_RULE.keywords,
        fallback: WEEK_HOURS_DEFAULT,
        title: 'Hours in any 7 days',
        sentence: 'A nurse works at most {value} hours in any 7 days in a row.',
        help: 'Shift hours only, not leave. The last days of the previous roster count too, so a week across two rosters is checked as one week. This keeps hours a nurse is catching up from piling into one week.',
        value: { min: 24, max: 96 },
        softMeaning: 'More hours are only reported, not stopped.',
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
        keywords: ['consecutive shifts', 'consecutive duties', 'consecutive working days', 'consecutive days'],
        excludeKeywords: LATE_DUTY_RULE_WORDS,
        fallback: 6,
        title: 'Maximum consecutive shifts',
        sentence: 'A nurse works at most {value} shifts in a row (a nurse works one shift a day, so this is also the most days in a row).',
        help: 'Change the number to allow more or fewer shifts in a row. The last days of the previous roster count too.',
        value: { min: 1, max: 14 },
        softMeaning: 'Longer runs are avoided where possible.',
      },
      {
        key: 'MIN_REST_HOURS',
        id: 'rule-h3',
        keywords: ['rest between duties', 'minimum rest'],
        fallback: 11,
        title: 'Rest between shifts',
        sentence: 'At least {value} hours of rest between the end of one shift and the start of the next.',
        help: 'For example, a shift ending at 21:00 and the next one starting at 09:00 gives 12 hours of rest.',
        value: { min: 0, max: 24 },
        softMeaning: 'Short rest is only reported, not stopped.',
      },
      {
        key: 'MAX_CONSECUTIVE_LATE_DUTIES',
        id: 'rule-s1',
        keywords: ['consecutive late', 'consecutive night', 'ending at 21:00', 'late duties'],
        fallback: 3,
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
    sentence: 'A nurse with doctors or specialties in their profile only works with those.',
  },
];

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const KNOWN_KEYS = new Set<string>([...GROUPS.flatMap((g) => g.rules.map((r) => r.key)), ...ALWAYS_ON.map((r) => r.key)]);

/** Finds a rule the same way the roster generator does, so both always mean the same rule. */
function findRule(rules: Rule[], def: { key: string; id?: string; keywords?: string[]; excludeKeywords?: string[] }): Rule | undefined {
  return resolveRule(rules, def.key, def.id, def.keywords, def.excludeKeywords);
}

const ZERO_MEANS_DEFAULT = new Set<string>(['MAX_WORKING_HOURS_PER_PERIOD', 'MAX_HOURS_IN_7_DAYS', 'MAX_CONSECUTIVE_DAYS', 'MAX_CONSECUTIVE_LATE_DUTIES']);

/** The number the generator actually uses for this rule. */
function effectiveValue(def: RuleDef, rule: Rule): number {
  const v = Number(rule.value);
  if (rule.value === undefined || rule.value === null || !Number.isFinite(v)) return def.fallback ?? def.value?.min ?? 0;
  // The generator reads these as "0 means use the default"; the others use a 0 as it is.
  if (v === 0 && ZERO_MEANS_DEFAULT.has(def.key)) return def.fallback ?? def.value?.min ?? 0;
  return v;
}

/** A time box that saves when you leave it (not on every key press). */
const TimeBox: React.FC<{ value: string; disabled: boolean; label: string; onCommit: (v: string) => void; className: string }> = ({
  value,
  disabled,
  label,
  onCommit,
  className,
}) => {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <input
      type="time"
      aria-label={label}
      disabled={disabled}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (/^([01]\d|2[0-3]):[0-5]\d$/.test(draft) && draft !== value) onCommit(draft);
        else setDraft(value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className={className}
    />
  );
};

/** On/off switch (24 px high, so it is easy to hit). */
const Toggle: React.FC<{ on: boolean; label: string; onChange: () => void }> = ({ on, label, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onChange}
    className={cx('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors', on ? 'bg-brand' : 'bg-control')}
  >
    <span className={cx('inline-block size-5 rounded-full bg-white shadow transition-transform', on ? 'translate-x-5' : 'translate-x-0.5')} />
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
  <div role="radiogroup" aria-label={label} className={cx('inline-flex rounded-md border border-line-strong bg-sunken p-0.5 text-sm', disabled && 'opacity-50')}>
    {(['HARD', 'SOFT'] as const).map((option) => (
      <button
        key={option}
        type="button"
        role="radio"
        aria-checked={value === option}
        disabled={disabled}
        title={option === 'HARD' ? 'Never broken' : softMeaning || 'Followed when possible'}
        onClick={() => onChange(option)}
        className={cx(
          'min-h-6 rounded px-2.5 font-medium transition-colors',
          value === option ? 'bg-surface font-semibold text-brand-strong shadow-card ring-1 ring-line' : 'text-ink-muted hover:text-ink'
        )}
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
    <span className={cx('inline-flex items-center gap-1 align-middle', disabled && 'opacity-50')}>
      <span className="inline-flex items-center rounded-md border border-control bg-surface">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={disabled || value <= field.min}
          onClick={() => commit(value - step)}
          className="flex size-6 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40"
        >
          <Minus className="size-3.5" aria-hidden="true" />
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
          className="h-6 w-11 border-x border-line text-center font-semibold tabular-nums text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={disabled || value >= field.max}
          onClick={() => commit(value + step)}
          className="flex size-6 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      </span>
      {field.unit && <span className="text-ink-muted">{field.unit}</span>}
    </span>
  );
};

export const RulesTab: React.FC<RulesTabProps> = ({ rules, setRules, loadData, triggerSaveNotification, changed, saving, onSave, onCancel }) => {
  const repo = getRepository();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showOther, setShowOther] = useState(false);

  // A change goes into the draft; Save writes it (SettingsView, ruleDraft.ts).
  const saveRule = (rule: Rule, updates: Partial<Rule>, _message?: string) =>
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, ...updates } : r)));

  const addMissingRules = async () => {
    setIsSyncing(true);
    try {
      const result = await RuleSyncService.syncStandardRules();
      setRules(result.rules);
      triggerSaveNotification('The missing rules were added.');
      loadData();
    } catch (err) {
      console.error('Failed to add standard rules:', err);
      notify('The missing rules could not be added.', 'error');
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
            value={effectiveValue(def, rule)}
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
          <TimeBox
            key={i}
            label={`${def.title}: late from`}
            disabled={!enabled}
            value={time}
            onCommit={(v) => saveRule(rule, { params: { ...(rule.params || {}), thresholdTime: v } }, `${def.title}: late from ${v}.`)}
            className={cx('mx-0.5 h-7 rounded-md border border-control bg-surface px-1.5 align-middle font-semibold tabular-nums text-ink', !enabled && 'opacity-50')}
          />
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Rules</h2>
          <p className="mt-1 max-w-2xl text-ink-muted">
            The rules the roster generator and the roster check follow. <strong className="text-ink">Must</strong> rules are never broken;{' '}
            <strong className="text-ink">Try to</strong> rules are followed when possible. Changes apply the next time you fill or check a roster.
          </p>
        </div>
        {missingCount > 0 && (
          <Button icon={RefreshCw} busy={isSyncing} disabled={changed} onClick={addMissingRules} className="shrink-0">
            Add {missingCount === 1 ? 'the missing rule' : `the ${missingCount} missing rules`}
          </Button>
        )}
      </div>
      {changed && missingCount > 0 && (
        <Notice tone="info" title="Save or cancel your changes first">
          Missing rules can be added once your changes are saved or cancelled.
        </Notice>
      )}

      {GROUPS.map((group) => (
        <section key={group.title} aria-labelledby={`rules-${slug(group.title)}`} className="space-y-2">
          <div>
            <h3 id={`rules-${slug(group.title)}`} className="text-base font-semibold text-ink">
              {group.title}
            </h3>
            <p className="text-ink-muted">{group.description}</p>
          </div>
          <div className="divide-y divide-line overflow-hidden rounded-lg border border-line">
            {group.rules.map((def) => {
              const rule = findRule(rules, def);
              if (!rule) {
                return (
                  <div key={def.key} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="font-medium text-ink">{def.title}</p>
                      <p className="text-ink-muted">Not set up yet: until it is added, the roster generator and the roster check use the usual setting.</p>
                    </div>
                    <Button size="sm" busy={isSyncing} disabled={changed} onClick={addMissingRules}>
                      Add
                    </Button>
                  </div>
                );
              }
              const enabled = rule.enabled !== false;
              const severity = (rule.severity || 'HARD') as 'HARD' | 'SOFT';
              return (
                <div key={rule.id} className={cx('flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between', !enabled && 'bg-sunken')}>
                  <div className="min-w-0 flex-1">
                    <p className={cx('font-semibold', enabled ? 'text-ink' : 'text-ink-muted')}>{def.title}</p>
                    <p className={cx('mt-1 leading-8', enabled ? 'text-ink' : 'text-ink-muted')}>{renderSentence(def, rule, enabled)}</p>
                    <p className="mt-0.5 text-ink-muted">{enabled ? def.help : 'Switched off: the roster generator and the roster check leave this rule out.'}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:pt-0.5">
                    <Strictness
                      value={severity}
                      disabled={!enabled}
                      softMeaning={def.softMeaning}
                      label={`${def.title}: must or try to`}
                      onChange={(v) => saveRule(rule, { severity: v })}
                    />
                    <Toggle on={enabled} label={`${def.title} on`} onChange={() => saveRule(rule, { enabled: !enabled })} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section aria-labelledby="rules-always" className="space-y-2">
        <h3 id="rules-always" className="text-base font-semibold text-ink">
          Always applied
        </h3>
        <div className="divide-y divide-line rounded-lg border border-line">
          {ALWAYS_ON.map((r) => (
            <div key={r.key} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-semibold text-ink">{r.title}</p>
                <p className="text-ink-muted">{r.sentence}</p>
              </div>
              <Badge icon={Lock}>Always on</Badge>
            </div>
          ))}
        </div>
      </section>

      {otherRules.length > 0 && (
        <section className="space-y-2">
          <Button size="sm" variant="ghost" icon={ChevronDown} aria-expanded={showOther} onClick={() => setShowOther((v) => !v)}>
            Other saved rules ({otherRules.length}). The roster generator does not use these.
          </Button>
          {showOther && (
            <div className="divide-y divide-line rounded-lg border border-dashed border-line-strong">
              {otherRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between gap-3 px-4 py-2">
                  <span className="text-ink-muted">{rule.name}</span>
                  <IconButton
                    label={`Delete ${rule.name}`}
                    icon={Trash2}
                    disabled={changed}
                    onClick={async () => {
                      if (
                        await confirmDialog({
                          title: 'Delete this rule?',
                          message: `Delete "${rule.name}"? The roster generator does not use it.`,
                          confirmLabel: 'Delete',
                          danger: true,
                        })
                      ) {
                        try {
                          await repo.remove('rules', rule.id);
                          triggerSaveNotification('Rule deleted.');
                          loadData();
                        } catch (err: any) {
                          notify(`The rule could not be deleted: ${err?.message || 'unknown error'}.`, 'error');
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <SaveBar changed={changed} saving={saving} onSave={onSave} onCancel={onCancel} />
    </div>
  );
};
