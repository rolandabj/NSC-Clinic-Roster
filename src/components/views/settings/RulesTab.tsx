/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings > Rules tab.
 */

import React, { useId, useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { getRepository } from '../../../services/repository';
import { RuleSyncService } from '../../../services/rules/ruleSyncService';
import { Rule } from '../../../types';
import { HoursPolicyConfig } from '../../../types/settings';
import { notify, confirmDialog } from '../../common/dialogs';
import { SaveNotifier, SettingsDialog } from './shared';

interface RulesTabProps {
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
  loadData: () => void;
  triggerSaveNotification: SaveNotifier;
  /** Writes rule values that mirror Hours Policy fields back into the hours policy. */
  syncHoursPolicyFromRule: (updates: Partial<HoursPolicyConfig>) => void;
}

export const RulesTab: React.FC<RulesTabProps> = ({
  rules,
  setRules,
  loadData,
  triggerSaveNotification,
  syncHoursPolicyFromRule,
}) => {
  const repo = getRepository();
  const customRuleModalTitleId = useId();

  // Custom rule modal
  const [isCustomRuleModalOpen, setIsCustomRuleModalOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    name: 'Custom Duty Rule',
    scope: 'PER_NURSE',
    metric: 'CONSECUTIVE_DUTIES_ENDING_AT_OR_AFTER',
    operator: 'MAX',
    value: 3,
    severity: 'SOFT',
    params: { thresholdTime: '21:00' },
    enabled: true,
  });

  const [ruleDrafts, setRuleDrafts] = useState<Record<string, string>>({});

  const handleToggleRule = async (rule: Rule) => {
    const nextEnabled = !rule.enabled;
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: nextEnabled } : r)));
    await repo.update('rules', rule.id, { enabled: nextEnabled });
    triggerSaveNotification(`Rule "${rule.name}" ${nextEnabled ? 'enabled' : 'disabled'}.`);
  };

  const handleUpdateRuleValue = async (rule: Rule, value: number, severity: 'HARD' | 'SOFT') => {
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, value, severity } : r)));
    await repo.update('rules', rule.id, { value, severity });

    // Keep hours policy in sync with rule values
    let policyUpdates: Partial<HoursPolicyConfig> | null = null;
    if (rule.id === 'rule-h2' || rule.templateKey === 'MAX_CONSECUTIVE_DAYS' || rule.metric === 'CONSECUTIVE_WORKING_DAYS') {
      policyUpdates = { maxConsecutiveDays: value };
    } else if (rule.id === 'rule-h3' || rule.templateKey === 'MIN_REST_HOURS') {
      policyUpdates = { minRestBetweenDuties: value };
    } else if (rule.id === 'rule-h4' || rule.templateKey === 'MAX_DUTIES_PER_DAY') {
      policyUpdates = { maxDutiesPerDay: value };
    }

    if (policyUpdates) {
      syncHoursPolicyFromRule(policyUpdates);
    }

    triggerSaveNotification(`Updated rule "${rule.name}".`);
  };

  const [isSyncingRules, setIsSyncingRules] = useState(false);

  const handleEnsureStandardRules = async () => {
    setIsSyncingRules(true);
    try {
      const syncResult = await RuleSyncService.syncStandardRules();
      // Ensure dedicated nurse clinic clinical role also exists
      const roles = await repo.list('clinicalRoles');
      const hasNcRole = roles.some(
        (r) => r.id === 'role-nurse-clinic' || r.acronym === 'NC' || r.name.toLowerCase().includes('nurse clinic')
      );
      if (!hasNcRole) {
        await repo.create('clinicalRoles', {
          id: 'role-nurse-clinic',
          name: 'Nurse Clinic',
          acronym: 'NC',
          description: 'Dedicated nurse-led clinic (triage, dressings, vitals & injections) — independent of doctor sessions',
          defaultDailyQuota: 1,
          defaultStartTime: '09:00',
          defaultEndTime: '17:00',
        });
      }
      setRules(syncResult.rules);
      triggerSaveNotification(`All standard clinical rules synchronized (${syncResult.total} rules verified).`);
      loadData();
    } catch (err) {
      console.error('Failed to ensure standard rules:', err);
      triggerSaveNotification('Failed to verify standard rules.');
    } finally {
      setIsSyncingRules(false);
    }
  };

  const handleSaveCustomRule = async () => {
    if (!newRule.name) {
      notify('Please enter a rule name.', 'warning');
      return;
    }
    await repo.create('rules', {
      name: newRule.name,
      templateKey: newRule.templateKey,
      scope: newRule.scope || 'PER_NURSE',
      metric: newRule.metric || 'CONSECUTIVE_DUTIES_ENDING_AT_OR_AFTER',
      operator: newRule.operator || 'MAX',
      value: Number(newRule.value) || 3,
      severity: newRule.severity || 'SOFT',
      params: newRule.params,
      enabled: true,
    });
    setIsCustomRuleModalOpen(false);
    triggerSaveNotification(`Custom rule "${newRule.name}" added to engine.`);
    loadData();
  };

  const handleDeleteRule = async (id: string, name: string) => {
    if (
      await confirmDialog({
        title: 'Remove rule',
        message: `Remove rule "${name}"?`,
        confirmLabel: 'Remove',
        danger: true,
      })
    ) {
      await repo.remove('rules', id);
      triggerSaveNotification(`Rule removed.`);
      loadData();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Constraint Rules &amp; Presets</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure scheduling engine constraints (Hard constraints cannot be breached; Soft constraints optimize scoring). Build custom rules for consecutive shifts or hours.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnsureStandardRules}
              disabled={isSyncingRules}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-teal-300 bg-teal-50/80 hover:bg-teal-100 text-teal-800 rounded text-xs font-medium cursor-pointer shadow-2xs transition-colors disabled:opacity-50"
              title="Synchronize all 9 canonical clinical rules with Firestore database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-teal-600 ${isSyncingRules ? 'animate-spin' : ''}`} />
              <span>{isSyncingRules ? 'Synchronizing...' : 'Synchronize Standard Rules'}</span>
            </button>
            <button
              onClick={() => {
                setNewRule({
                  name: 'Custom Duty Rule',
                  scope: 'PER_NURSE',
                  metric: 'CONSECUTIVE_DUTIES_ENDING_AT_OR_AFTER',
                  operator: 'MAX',
                  value: 3,
                  severity: 'SOFT',
                  params: { thresholdTime: '21:00' },
                  enabled: true,
                });
                setIsCustomRuleModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Build Custom Rule</span>
            </button>
          </div>
        </div>

        {/* FEATURED: Dedicated Nurse Clinic Rule Card & Controls */}
        {(() => {
          const ncRule = rules.find(
            (r) => r.templateKey === 'DEDICATED_NURSE_CLINIC' || r.id === 'rule-nurse-clinic'
          );
          return (
            <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-lg space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    🩺
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">
                        Dedicated Nurse Clinic Rule (Independent of Doctor Sessions)
                      </h3>
                      <span className="font-mono text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">
                        NC · Unpaired
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 max-w-2xl">
                      Allocates 1 nurse solely to the Nurse Clinic (dressings, triage, vitals &amp; injections) who is <strong>not assigned to any doctor</strong> for each day of the schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ncRule ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 text-[11px]">Nurses/Day:</span>
                        <input
                          aria-label="Nurse Clinic nurses per day"
                          type="number"
                          min="1"
                          max="5"
                          value={ruleDrafts[ncRule.id] !== undefined ? ruleDrafts[ncRule.id] : ncRule.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRuleDrafts((prev) => ({ ...prev, [ncRule.id]: val }));
                          }}
                          onBlur={() => {
                            const raw = ruleDrafts[ncRule.id];
                            if (raw !== undefined) {
                              const parsed = Number(raw);
                              if (!isNaN(parsed) && parsed > 0) {
                                handleUpdateRuleValue(ncRule, parsed, ncRule.severity);
                              }
                              setRuleDrafts((prev) => {
                                const next = { ...prev };
                                delete next[ncRule.id];
                                return next;
                              });
                            }
                          }}
                          className="w-14 px-1.5 py-1 border border-teal-300 rounded font-mono text-center text-xs bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <select
                        aria-label="Nurse Clinic rule severity"
                        value={ncRule.severity}
                        onChange={(e) =>
                          handleUpdateRuleValue(ncRule, ncRule.value, e.target.value as any)
                        }
                        className="px-2 py-1 border border-teal-300 rounded text-xs bg-white text-slate-800"
                      >
                        <option value="HARD">HARD (Blocks Doctor Pairing)</option>
                        <option value="SOFT">SOFT (Fills After Doctors)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleToggleRule(ncRule)}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                          ncRule.enabled
                            ? 'bg-teal-600 text-white hover:bg-teal-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {ncRule.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEnsureStandardRules}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Enable &amp; Initialize Rule
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-teal-800 bg-teal-100/60 p-2 rounded flex items-center justify-between">
                <span>
                  {ncRule?.enabled
                    ? ncRule.severity === 'HARD'
                      ? '✓ Active: Guaranteed Priority 120 slot. The engine reserves 1 nurse for Dedicated Nurse Clinic before filling any doctor sessions, preventing doctor-nurse pairing.'
                      : 'ℹ Active (Soft): The engine pairs doctors first (Priority 100), and assigns remaining available nurses to Nurse Clinic (Priority 75).'
                    : '⚠ Disabled: Nurses will only be assigned to doctors and general phlebotomy; no dedicated nurse clinic nurse will be scheduled.'}
                </span>
                <span className="font-mono text-[10px] text-teal-900 font-semibold shrink-0 ml-2">
                  Scope: PER_DAY · Quota: {ncRule?.value ?? 1}/day
                </span>
              </div>
            </div>
          );
        })()}

        {/* FEATURED: At Least +1 Additional Nurse Above Doctors During Operating Hours */}
        {(() => {
          const plusOneRule = rules.find(
            (r) =>
              r.templateKey === 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS' ||
              r.id === 'rule-nurse-plus-one'
          );
          return (
            <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-lg space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    👥
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">
                        At Least +1 Additional Nurse Above Doctors (Operating Hours Coverage)
                      </h3>
                      <span className="font-mono text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                        +1 Over Doctors · Shift Overhang
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 max-w-2xl">
                      Ensures at least 1 additional nurse is present above the active doctor count at all times of clinic operating hours. The additional nurse can be dedicated to Nurse Clinic or scheduled on extended hours whose assigned doctor finishes early (e.g. nurse working 9am–9pm with doctor scheduled 9am–6pm counts as additional from 6pm–9pm). Nurse-clinic-enabled nurses are prioritized.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {plusOneRule ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 text-[11px]">Min Additional:</span>
                        <input
                          aria-label="Minimum additional nurses above doctors"
                          type="number"
                          min="1"
                          max="5"
                          value={
                            ruleDrafts[plusOneRule.id] !== undefined
                              ? ruleDrafts[plusOneRule.id]
                              : plusOneRule.value
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setRuleDrafts((prev) => ({ ...prev, [plusOneRule.id]: val }));
                          }}
                          onBlur={() => {
                            const raw = ruleDrafts[plusOneRule.id];
                            if (raw !== undefined) {
                              const parsed = Number(raw);
                              if (!isNaN(parsed) && parsed > 0) {
                                handleUpdateRuleValue(plusOneRule, parsed, plusOneRule.severity);
                              }
                              setRuleDrafts((prev) => {
                                const next = { ...prev };
                                delete next[plusOneRule.id];
                                return next;
                              });
                            }
                          }}
                          className="w-14 px-1.5 py-1 border border-indigo-300 rounded font-mono text-center text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <select
                        aria-label="Additional nurse rule severity"
                        value={plusOneRule.severity}
                        onChange={(e) =>
                          handleUpdateRuleValue(plusOneRule, plusOneRule.value, e.target.value as any)
                        }
                        className="px-2 py-1 border border-indigo-300 rounded text-xs bg-white text-slate-800"
                      >
                        <option value="HARD">HARD (Enforces +1 Nurses Every Hour)</option>
                        <option value="SOFT">SOFT (Prefers Overhang &amp; Float)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleToggleRule(plusOneRule)}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                          plusOneRule.enabled
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {plusOneRule.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEnsureStandardRules}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Enable &amp; Initialize Rule
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-indigo-800 bg-indigo-100/60 p-2 rounded flex items-center justify-between">
                <span>
                  {plusOneRule?.enabled
                    ? plusOneRule.severity === 'HARD'
                      ? `✓ Active: Engine guarantees active nurses >= (active doctors + ${plusOneRule?.value ?? 1}) for all operating hours. Prioritizes nurse-clinic-enabled staff for overhang & evening windows.`
                      : 'ℹ Active (Soft): Engine scores duty overhang and floats to favor maintaining additional nurses without failing generation.'
                    : '⚠ Disabled: Schedule requires only 1:1 doctor-to-nurse pairing during clinic sessions.'}
                </span>
                <span className="font-mono text-[10px] text-indigo-900 font-semibold shrink-0 ml-2">
                  Scope: PER_DUTY_WINDOW · Additional: +{plusOneRule?.value ?? 1}
                </span>
              </div>
            </div>
          );
        })()}

        {/* FEATURED: Maximum Working Hours Limit Per Period (Rule H7) */}
        {(() => {
          const maxHoursRule = rules.find(
            (r) =>
              r.templateKey === 'MAX_WORKING_HOURS_PER_PERIOD' ||
              r.id === 'rule-h7-max-hours' ||
              (r.name && r.name.toLowerCase().includes('max working hours'))
          );
          return (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    ⏱️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">
                        Maximum Working Hours Limit &amp; Overwork Cap (Rule H7)
                      </h3>
                      <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        H7 · Burnout Prevention
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 max-w-2xl">
                      Caps total duty hours earned across the schedule period. Full-time period target is prorated by each nurse&apos;s contract percentage. When set to HARD, the scheduling engine strictly prohibits assigning any duty that breaches the maximum allowable limit across all 6 passes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {maxHoursRule ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 text-[11px]">Cap (% of Contract):</span>
                        <input
                          aria-label="Max working hours cap (% of contract)"
                          type="number"
                          min="100"
                          max="125"
                          value={
                            ruleDrafts[maxHoursRule.id] !== undefined
                              ? ruleDrafts[maxHoursRule.id]
                              : maxHoursRule.value
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setRuleDrafts((prev) => ({ ...prev, [maxHoursRule.id]: val }));
                          }}
                          onBlur={() => {
                            const raw = ruleDrafts[maxHoursRule.id];
                            if (raw !== undefined) {
                              const parsed = Number(raw);
                              if (!isNaN(parsed) && parsed >= 100) {
                                handleUpdateRuleValue(maxHoursRule, parsed, maxHoursRule.severity);
                              }
                              setRuleDrafts((prev) => {
                                const next = { ...prev };
                                delete next[maxHoursRule.id];
                                return next;
                              });
                            }
                          }}
                          className="w-16 px-1.5 py-1 border border-emerald-300 rounded font-mono text-center text-xs bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                        <span className="text-slate-400 text-xs">%</span>
                      </div>

                      <select
                        aria-label="Max working hours rule severity"
                        value={maxHoursRule.severity}
                        onChange={(e) =>
                          handleUpdateRuleValue(maxHoursRule, maxHoursRule.value, e.target.value as any)
                        }
                        className="px-2 py-1 border border-emerald-300 rounded text-xs bg-white text-slate-800"
                      >
                        <option value="HARD">HARD (Strict Overwork Prohibition)</option>
                        <option value="SOFT">SOFT (Flexible Overtime Advisory)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleToggleRule(maxHoursRule)}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                          maxHoursRule.enabled
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {maxHoursRule.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEnsureStandardRules}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Enable &amp; Initialize Rule
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 bg-emerald-100/60 p-2 rounded flex items-center justify-between">
                <span>
                  {maxHoursRule?.enabled
                    ? maxHoursRule.severity === 'HARD'
                      ? `✓ Active: Hard ceiling enforced at max(target, min(target + 8h, round(target × ${((maxHoursRule.value || 105) / 100).toFixed(2)}))). Prevents all overwork violations in generation & pre-publish validation.`
                      : 'ℹ Active (Soft): Evaluates nurse hours deficit and soft scoring to balance hours across staff without rejecting shifts.'
                    : '⚠ Disabled: Nurses may be scheduled for unlimited shifts without period working hours capping.'}
                </span>
                <span className="font-mono text-[10px] text-emerald-900 font-semibold shrink-0 ml-2">
                  Scope: PER_NURSE · Cap: {maxHoursRule?.value ?? 105}%
                </span>
              </div>
            </div>
          );
        })()}

        {/* FEATURED: Maximum Consecutive Late Duties Ending at 21:00 (Rule S1) */}
        {(() => {
          const lateRule = rules.find(
            (r) =>
              r.templateKey === 'MAX_CONSECUTIVE_LATE_DUTIES' ||
              r.id === 'rule-s1' ||
              (r.name && (r.name.toLowerCase().includes('consecutive late') || r.name.toLowerCase().includes('consecutive night')))
          );
          return (
            <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-lg space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    🌙
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">
                        Maximum Consecutive Late Duties Ending at 21:00 (Rule S1)
                      </h3>
                      <span className="font-mono text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                        S1 · Night/Late Duty Restriction
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 max-w-2xl">
                      Restricts consecutive evening duties ending at or after 21:00 (e.g. 13:00–21:00 or 09:00–21:00). When set to HARD, the engine looks back across preceding calendar days and strictly blocks assigning a { (lateRule?.value ?? 3) + 1 }th consecutive late duty across all assignment and float passes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {lateRule ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 text-[11px]">Max Consecutive:</span>
                        <input
                          aria-label="Max consecutive late duties"
                          type="number"
                          min="1"
                          max="7"
                          value={
                            ruleDrafts[lateRule.id] !== undefined
                              ? ruleDrafts[lateRule.id]
                              : lateRule.value
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setRuleDrafts((prev) => ({ ...prev, [lateRule.id]: val }));
                          }}
                          onBlur={() => {
                            const raw = ruleDrafts[lateRule.id];
                            if (raw !== undefined) {
                              const parsed = Number(raw);
                              if (!isNaN(parsed) && parsed > 0) {
                                handleUpdateRuleValue(lateRule, parsed, lateRule.severity);
                              }
                              setRuleDrafts((prev) => {
                                const next = { ...prev };
                                delete next[lateRule.id];
                                return next;
                              });
                            }
                          }}
                          className="w-14 px-1.5 py-1 border border-purple-300 rounded font-mono text-center text-xs bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                        <span className="text-slate-500 text-[11px] ml-1">Threshold:</span>
                        <span className="font-mono text-xs bg-purple-100/80 text-purple-900 px-1.5 py-0.5 rounded font-bold">
                          {lateRule.params?.thresholdTime || '21:00'}
                        </span>
                      </div>

                      <select
                        aria-label="Late duty rule severity"
                        value={lateRule.severity}
                        onChange={(e) =>
                          handleUpdateRuleValue(lateRule, lateRule.value, e.target.value as any)
                        }
                        className="px-2 py-1 border border-purple-300 rounded text-xs bg-white text-slate-800"
                      >
                        <option value="HARD">HARD (Inviolable Block)</option>
                        <option value="SOFT">SOFT (Pacing Penalty)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleToggleRule(lateRule)}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                          lateRule.enabled
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {lateRule.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEnsureStandardRules}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Enable &amp; Initialize Rule
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-purple-800 bg-purple-100/60 p-2 rounded flex items-center justify-between">
                <span>
                  {lateRule?.enabled
                    ? lateRule.severity === 'HARD'
                      ? `✓ Active: Hard constraint enforced. Nurses working ${lateRule.value} consecutive duties ending at or after 21:00 will never be assigned or extended to a late duty on the following day.`
                      : `ℹ Active (Soft): Applies a progressive scoring penalty (-50 / -150) when nurses approach or reach ${lateRule.value} consecutive late duties.`
                    : '⚠ Disabled: Nurses may be assigned to consecutive late duties without restriction.'}
                </span>
                <span className="font-mono text-[10px] text-purple-900 font-semibold shrink-0 ml-2">
                  Scope: PER_NURSE · Max: {lateRule?.value ?? 3} in a row
                </span>
              </div>
            </div>
          );
        })()}

        {/* List of Remaining Standard & Custom Rules */}
        {(() => {
          const otherRules = rules.filter(
            (r) =>
              r.templateKey !== 'DEDICATED_NURSE_CLINIC' &&
              r.templateKey !== 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS' &&
              r.templateKey !== 'MAX_WORKING_HOURS_PER_PERIOD' &&
              r.templateKey !== 'MAX_CONSECUTIVE_LATE_DUTIES' &&
              r.id !== 'rule-nurse-clinic' &&
              r.id !== 'rule-nurse-plus-one' &&
              r.id !== 'rule-h7-max-hours' &&
              r.id !== 'rule-s1'
          );

          return (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Additional Clinical Constraints &amp; Custom Rules ({otherRules.length})
                </h3>
                <span className="text-[11px] text-slate-500">
                  Standard safety constraints and custom builder rules
                </span>
              </div>

              {otherRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-3.5 rounded border transition-colors ${
                    rule.enabled
                      ? 'bg-white border-slate-200 shadow-2xs'
                      : 'bg-slate-50/80 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rule.severity === 'HARD'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rule.severity}
                        </span>
                        <span className="font-semibold text-slate-800 text-xs">{rule.name}</span>
                        {rule.templateKey && (
                          <span className="font-mono text-[10px] text-slate-400">
                            ({rule.templateKey})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Scope: <strong className="text-slate-700 font-mono">{rule.scope}</strong> · Metric: <span className="font-mono text-slate-600">{rule.metric}</span> {rule.params?.thresholdTime ? `(Threshold: ${rule.params.thresholdTime})` : ''} · Condition: <span className="font-mono font-semibold text-slate-800">{rule.operator} {rule.value}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 text-[11px]">Value:</span>
                        <input
                          aria-label={`Value for ${rule.name}`}
                          type="number"
                          value={ruleDrafts[rule.id] !== undefined ? ruleDrafts[rule.id] : rule.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRuleDrafts((prev) => ({ ...prev, [rule.id]: val }));
                          }}
                          onBlur={() => {
                            const raw = ruleDrafts[rule.id];
                            if (raw !== undefined) {
                              const parsed = Number(raw);
                              if (!isNaN(parsed) && raw.trim() !== '') {
                                handleUpdateRuleValue(rule, parsed, rule.severity);
                              }
                              setRuleDrafts((prev) => {
                                const next = { ...prev };
                                delete next[rule.id];
                                return next;
                              });
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-16 px-1.5 py-1 border border-slate-300 rounded font-mono text-center text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <select
                        aria-label={`Severity for ${rule.name}`}
                        value={rule.severity}
                        onChange={(e) =>
                          handleUpdateRuleValue(rule, rule.value, e.target.value as any)
                        }
                        className="px-2 py-1 border border-slate-300 rounded text-xs bg-white text-slate-800"
                      >
                        <option value="HARD">HARD</option>
                        <option value="SOFT">SOFT</option>
                      </select>

                      <button
                        onClick={() => handleToggleRule(rule)}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                          rule.enabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </button>

                      {!rule.templateKey && (
                        <button
                          aria-label="Delete custom rule"
                          onClick={() => handleDeleteRule(rule.id, rule.name)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                          title="Delete custom rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {isCustomRuleModalOpen && (
        <SettingsDialog
          onClose={() => setIsCustomRuleModalOpen(false)}
          labelledBy={customRuleModalTitleId}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          panelClassName="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 text-xs"
        >
          <h3 id={customRuleModalTitleId} className="text-sm font-bold text-slate-900">Custom Scheduling Rule Builder</h3>
          <p className="text-[11px] text-slate-500">
            Formulate a custom constraint metric evaluated during deterministic generation and live cell editing.
          </p>

          {/* Quick Presets / Templates */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Load Standard Preset</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setNewRule({
                    name: 'Dedicated nurse clinic coverage (not assigned to doctor)',
                    templateKey: 'DEDICATED_NURSE_CLINIC',
                    scope: 'PER_DAY',
                    metric: 'DUTIES_WITH_END_TIME_X_COUNT',
                    operator: 'MIN',
                    value: 1,
                    severity: 'HARD',
                    enabled: true,
                  })
                }
                className="p-2 border border-teal-200 bg-teal-50/70 hover:bg-teal-100/70 text-left rounded text-[11px] cursor-pointer transition-colors"
              >
                <span className="font-bold text-teal-900 block">🩺 Dedicated Nurse Clinic</span>
                <span className="text-[10px] text-teal-700">1 nurse/day unpaired from doctor</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewRule({
                    name: 'No more than 3 consecutive duties ending at 21:00',
                    templateKey: 'MAX_CONSECUTIVE_LATE_DUTIES',
                    scope: 'PER_NURSE',
                    metric: 'CONSECUTIVE_DUTIES_ENDING_AT_OR_AFTER',
                    params: { thresholdTime: '21:00' },
                    operator: 'MAX',
                    value: 3,
                    severity: 'SOFT',
                    enabled: true,
                  })
                }
                className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left rounded text-[11px] cursor-pointer transition-colors"
              >
                <span className="font-bold text-slate-800 block">🌙 Max 3 Consecutive Late Ends</span>
                <span className="text-[10px] text-slate-500">Soft limit on shifts ending 21:00</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewRule({
                    name: 'At least one additional nurse above doctors during clinic operating hours',
                    templateKey: 'MIN_ADDITIONAL_NURSE_OVER_DOCTORS',
                    scope: 'PER_DUTY_WINDOW',
                    metric: 'DUTIES_WITH_END_TIME_X_COUNT',
                    operator: 'MIN',
                    value: 1,
                    severity: 'HARD',
                    enabled: true,
                  })
                }
                className="p-2 border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-left rounded text-[11px] cursor-pointer transition-colors sm:col-span-2"
              >
                <span className="font-bold text-indigo-900 block">👥 +1 Additional Nurse Over Doctors</span>
                <span className="text-[10px] text-indigo-700">Maintains &gt;= (Doctors + 1) nurses; prioritizes nurse-clinic enabled overhang</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Rule Name</label>
              <input
                aria-label="Rule Name"
                type="text"
                value={newRule.name || ''}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g. Max 3 consecutive late duties ending at 21:00"
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Evaluation Scope</label>
                <select
                  aria-label="Evaluation Scope"
                  value={newRule.scope}
                  onChange={(e) => setNewRule({ ...newRule, scope: e.target.value as any })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="PER_NURSE">PER_NURSE</option>
                  <option value="PER_DAY">PER_DAY</option>
                  <option value="PER_DUTY_WINDOW">PER_DUTY_WINDOW</option>
                  <option value="PER_PERIOD">PER_PERIOD</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Severity</label>
                <select
                  aria-label="Severity"
                  value={newRule.severity}
                  onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as any })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="SOFT">SOFT (Scored / Warning)</option>
                  <option value="HARD">HARD (Blocks Generation)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Metric Definition</label>
              <select
                aria-label="Metric Definition"
                value={newRule.metric}
                onChange={(e) => setNewRule({ ...newRule, metric: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono"
              >
                <option value="CONSECUTIVE_DUTIES_ENDING_AT_OR_AFTER">
                  CONSECUTIVE_DUTIES_ENDING_AT_OR_AFTER
                </option>
                <option value="CONSECUTIVE_WORKING_DAYS">CONSECUTIVE_WORKING_DAYS</option>
                <option value="TOTAL_HOURS_IN_WINDOW">TOTAL_HOURS_IN_WINDOW</option>
                <option value="WEEKENDS_OFF_COUNT">WEEKENDS_OFF_COUNT</option>
                <option value="HOLIDAYS_WORKED_COUNT">HOLIDAYS_WORKED_COUNT</option>
                <option value="DUTIES_WITH_END_TIME_X_COUNT">DUTIES_WITH_END_TIME_X_COUNT</option>
              </select>
            </div>

            {newRule.metric === 'CONSECUTIVE_DUTIES_ENDING_AT_OR_AFTER' && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  End-Time Threshold (e.g. 21:00)
                </label>
                <input
                  aria-label="End-Time Threshold (e.g. 21:00)"
                  type="time"
                  value={newRule.params?.thresholdTime || '21:00'}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      params: { ...newRule.params, thresholdTime: e.target.value },
                    })
                  }
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded font-mono text-center"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Comparison Operator</label>
                <select
                  aria-label="Comparison Operator"
                  value={newRule.operator}
                  onChange={(e) => setNewRule({ ...newRule, operator: e.target.value as any })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono"
                >
                  <option value="MAX">MAX (Cannot exceed)</option>
                  <option value="MIN">MIN (Must reach at least)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Threshold Value (N)</label>
                <input
                  aria-label="Threshold Value (N)"
                  type="number"
                  value={newRule.value}
                  onChange={(e) => setNewRule({ ...newRule, value: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-center"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCustomRuleModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCustomRule}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium cursor-pointer"
            >
              Add Rule to Engine
            </button>
          </div>
        </SettingsDialog>
      )}
    </>
  );
};
