/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ClinicRoster Configuration Bootstrap (Phase 1)
 *
 * Guarantees that the *configuration* the deterministic scheduling engine reads is
 * always present and reachable through the active repository, in every storage mode
 * (Server API / Firestore / localStorage):
 *
 *   1. System clinical roles  — Nurse Clinic (NC) and Float Pool (FLT).
 *   2. Canonical clinical rules — the H1–H8 / S1 catalogue the engine resolves by
 *      templateKey. Only created when the rules collection is empty, so user-customised
 *      rules are never overwritten.
 *   3. Dedicated working-hours periods — the authoritative full-time hours targets.
 *
 * This is configuration only: it never creates nurses, doctors, schedules, assignments,
 * leave or demo data, and it is skipped entirely when the database carries the explicit
 * CLEARED tombstone (an administrator has wiped the environment on purpose).
 */

import { IRepository } from '../repository/IRepository';
import { ClinicalRole } from '../../types';
import { SEED_CLINICAL_ROLES, SEED_WORKING_HOURS_PERIODS } from './seedData';
import { CANONICAL_RULES_SPEC } from '../rules/canonicalRules';
import { resolveRule } from '../engine/SchedulingEngine';

/** Ids of the clinical roles the engine relies on internally. */
export const SYSTEM_CLINICAL_ROLE_IDS = ['role-nurse-clinic', 'role-float'] as const;

/** True when a role definition from the catalogue already exists (by id, acronym or NC name). */
function clinicalRoleExists(existing: ClinicalRole[], role: ClinicalRole): boolean {
  const name = (role.name || '').toLowerCase();
  return existing.some((r) => {
    if (r.id === role.id) return true;
    if (role.acronym && r.acronym && r.acronym.toUpperCase() === role.acronym.toUpperCase()) return true;
    if (role.id === 'role-nurse-clinic') {
      return name.includes('nurse clinic') || (r.name || '').toLowerCase().includes('nurse clinic');
    }
    return false;
  });
}

export interface ConfigurationBootstrapSummary {
  skipped: boolean;
  clinicalRolesAdded: number;
  rulesAdded: number;
  rulesSkippedBecausePopulated: boolean;
  workingHoursPeriodsAdded: number;
}

const EMPTY_SUMMARY: ConfigurationBootstrapSummary = {
  skipped: true,
  clinicalRolesAdded: 0,
  rulesAdded: 0,
  rulesSkippedBecausePopulated: false,
  workingHoursPeriodsAdded: 0,
};

/**
 * True when the repository carries the explicit CLEARED tombstone.
 */
async function isConfigurationWiped(repo: IRepository): Promise<boolean> {
  try {
    const meta = await repo.get('systemMetadata', 'initialization_state');
    return (meta as any)?.status === 'CLEARED';
  } catch {
    return false;
  }
}

/**
 * Creates any missing system clinical roles (Nurse Clinic, Float Pool).
 */
export async function ensureSystemClinicalRoles(repo: IRepository): Promise<number> {
  const existing = await repo.list('clinicalRoles');
  const systemRoles = SEED_CLINICAL_ROLES.filter((r) =>
    (SYSTEM_CLINICAL_ROLE_IDS as readonly string[]).includes(r.id)
  );

  let added = 0;
  for (const role of systemRoles) {
    if (clinicalRoleExists(existing, role)) continue;
    await repo.create('clinicalRoles', role);
    existing.push(role);
    added += 1;
  }
  return added;
}

/**
 * Creates the canonical rule rows when they are missing.
 * When `onlyWhenEmpty` is true and the collection already has entries, nothing is written —
 * the existing (possibly user-customised) rule set is left untouched.
 */
export async function ensureCanonicalRules(
  repo: IRepository,
  options: { onlyWhenEmpty?: boolean } = {}
): Promise<{ added: number; skippedBecausePopulated: boolean; total: number }> {
  const existing = await repo.list('rules');
  const onlyWhenEmpty = options.onlyWhenEmpty ?? false;

  if (onlyWhenEmpty && existing.length > 0) {
    return { added: 0, skippedBecausePopulated: true, total: existing.length };
  }

  let added = 0;
  for (const spec of CANONICAL_RULES_SPEC) {
    const matched = resolveRule(existing, spec.templateKey, spec.canonicalId, spec.semanticKeywords);
    if (matched) continue;
    await repo.create('rules', {
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
    });
    existing.push({ ...spec, id: spec.canonicalId });
    added += 1;
  }

  return { added, skippedBecausePopulated: false, total: existing.length };
}

/**
 * Writes the dedicated working-hours periods when the collection is empty.
 * These periods are the authoritative full-time hours targets for a schedule period.
 */
export async function ensureWorkingHoursPeriods(repo: IRepository): Promise<number> {
  const existing = await repo.list('workingHoursPeriods');
  if (existing.length > 0) return 0;
  await repo.bulkUpsert('workingHoursPeriods', SEED_WORKING_HOURS_PERIODS);
  return SEED_WORKING_HOURS_PERIODS.length;
}

/**
 * Runs the configuration bootstrap. Returns a summary of what was written.
 * NOTE: skipped when the database carries the explicit CLEARED tombstone — an administrator
 * wipe is respected. In that state the configuration is restored on demand from the UI
 * (Settings → sync standard rules / working-hours periods panel).
 */
export async function ensureConfigurationDefaults(
  repo: IRepository,
  options: { logPrefix?: string } = {}
): Promise<ConfigurationBootstrapSummary> {
  const logPrefix = options.logPrefix || '[ConfigurationBootstrap]';

  if (await isConfigurationWiped(repo)) {
    console.info(`${logPrefix} Database carries the CLEARED tombstone — configuration bootstrap skipped.`);
    return { ...EMPTY_SUMMARY };
  }

  try {
    const clinicalRolesAdded = await ensureSystemClinicalRoles(repo);
    const rules = await ensureCanonicalRules(repo, { onlyWhenEmpty: true });
    const workingHoursPeriodsAdded = await ensureWorkingHoursPeriods(repo);

    const summary: ConfigurationBootstrapSummary = {
      skipped: false,
      clinicalRolesAdded,
      rulesAdded: rules.added,
      rulesSkippedBecausePopulated: rules.skippedBecausePopulated,
      workingHoursPeriodsAdded,
    };

    if (clinicalRolesAdded > 0 || rules.added > 0 || workingHoursPeriodsAdded > 0) {
      console.info(
        `${logPrefix} Configuration ensured: ${clinicalRolesAdded} system role(s), ` +
          `${rules.added} canonical rule(s), ${workingHoursPeriodsAdded} working-hours period(s).`
      );
    }

    return summary;
  } catch (err) {
    console.warn(`${logPrefix} Configuration bootstrap warning:`, err);
    return { ...EMPTY_SUMMARY, skipped: false };
  }
}
