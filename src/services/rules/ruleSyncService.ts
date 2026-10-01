/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Rule Management Synchronization & Canonical Template Engine (Phase 3)
 */

import { Rule } from '../../types';
import { CANONICAL_RULES_SPEC } from './canonicalRules';
import { getRepository } from '../repository';
import { resolveRule } from '../engine/SchedulingEngine';

// Canonical rule catalogue extracted to a pure-data module so the server bootstrap
// can reuse it without importing the client repository singleton.
export { CANONICAL_RULES_SPEC } from './canonicalRules';
export type { CanonicalRuleDef } from './canonicalRules';

export interface RuleSyncResult {
  added: number;
  updated: number;
  unchanged: number;
  total: number;
  rules: Rule[];
}

export class RuleSyncService {
  /**
   * Synchronizes and repairs all canonical rules in the persistent repository.
   * If an existing rule matches a canonical specification by templateKey, id, or semantic keywords:
   *  - Ensures templateKey is present and set
   *  - Retains user-customized value and severity if already set, or sets canonical defaults if missing
   * If a canonical rule does not exist, creates it.
   */
  public static async syncStandardRules(): Promise<RuleSyncResult> {
    const repo = getRepository();
    const existingRules = await repo.list('rules');

    let addedCount = 0;
    let updatedCount = 0;
    let unchangedCount = 0;

    for (const spec of CANONICAL_RULES_SPEC) {
      // Find matching rule in database
      const matched = resolveRule(
        existingRules,
        spec.templateKey,
        spec.canonicalId,
        spec.semanticKeywords
      );

      if (matched) {
        // Check if templateKey, name, or params need synchronization
        const needsUpdate =
          !matched.templateKey ||
          matched.templateKey !== spec.templateKey ||
          (spec.params?.thresholdTime && (!matched.params || !matched.params.thresholdTime));

        if (needsUpdate) {
          const updates: Partial<Rule> = {
            templateKey: spec.templateKey,
          };
          if (spec.params?.thresholdTime && (!matched.params || !matched.params.thresholdTime)) {
            updates.params = { ...matched.params, thresholdTime: spec.params.thresholdTime };
          }
          await repo.update('rules', matched.id, updates);
          matched.templateKey = spec.templateKey;
          if (updates.params) {
            matched.params = updates.params;
          }
          updatedCount++;
        } else {
          unchangedCount++;
        }
      } else {
        // Create canonical rule
        const newRule: Rule = {
          id: spec.canonicalId,
          name: spec.name,
          templateKey: spec.templateKey,
          scope: spec.scope,
          metric: spec.metric,
          operator: spec.operator,
          value: spec.value,
          severity: spec.severity,
          enabled: spec.enabled,
          params: spec.params,
        };
        await repo.create('rules', newRule);
        existingRules.push(newRule);
        addedCount++;
      }
    }

    // Deduplicate rules by templateKey if multiple exist (keep canonicalId preference)
    const freshRules = await repo.list('rules');
    const seenTemplates = new Map<string, Rule>();
    for (const r of freshRules) {
      if (!r.templateKey) {
        // If an untemplated rule semantically matches a canonical rule, assign templateKey
        for (const spec of CANONICAL_RULES_SPEC) {
          const lowerName = (r.name || '').toLowerCase();
          if (spec.semanticKeywords.some((k) => lowerName.includes(k.toLowerCase()))) {
            r.templateKey = spec.templateKey;
            await repo.update('rules', r.id, { templateKey: spec.templateKey });
            break;
          }
        }
      }

      if (r.templateKey) {
        const existing = seenTemplates.get(r.templateKey);
        if (existing) {
          // If duplicate exists, keep the one with canonical ID 'rule-*', remove the other
          const toRemove = r.id.startsWith('rule-') ? existing : r;
          const toKeep = r.id.startsWith('rule-') ? r : existing;
          await repo.remove('rules', toRemove.id);
          seenTemplates.set(r.templateKey, toKeep);
        } else {
          seenTemplates.set(r.templateKey, r);
        }
      }
    }

    // Refresh final list
    const finalRules = await repo.list('rules');

    return {
      added: addedCount,
      updated: updatedCount,
      unchanged: unchangedCount,
      total: finalRules.length,
      rules: finalRules,
    };
  }
}
