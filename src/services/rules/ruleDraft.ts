/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings, Rules saved only by Save (Phase 8, slice 1c): the rules a draft changed, with only
 * the fields it changed, so Save writes nothing else. Adding the standard rules and deleting an
 * old rule happen at once, elsewhere.
 */

import { Rule } from '../../types';

const FIELDS = ['name', 'value', 'severity', 'enabled', 'params'] as const;

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export function ruleChanges(saved: Rule[], draft: Rule[]): { id: string; updates: Partial<Rule> }[] {
  const byId = new Map(saved.map((r) => [r.id, r]));
  const out: { id: string; updates: Partial<Rule> }[] = [];
  for (const d of draft) {
    const s = byId.get(d.id);
    if (!s) continue;
    const updates: Partial<Rule> = {};
    for (const f of FIELDS) if (!same(s[f], d[f])) (updates as Record<string, unknown>)[f] = d[f];
    if (Object.keys(updates).length > 0) out.push({ id: d.id, updates });
  }
  return out;
}

/**
 * The draft over a new copy of the saved rules (Checkpoint 8): each rule the draft changed keeps
 * its changed fields; the others take the new copy; rules added since come in and rules deleted
 * go. So a reload after a list tab saves, Add missing rules, Delete or a failed save loses no edit.
 */
export function rebaseRules(previousSaved: Rule[], draft: Rule[], nextSaved: Rule[]): Rule[] {
  const changes = new Map(ruleChanges(previousSaved, draft).map((c) => [c.id, c.updates]));
  return nextSaved.map((r) => {
    const updates = changes.get(r.id);
    return updates ? { ...r, ...updates } : r;
  });
}
