/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Seed → engine bridge (Phase 4).
 *
 * A freshly seeded environment must be generated with the exact same engine contract the
 * live app uses, otherwise demo data behaves differently from real data:
 *   - working-hours periods supply the authoritative full-time target (Q1),
 *   - doctors supply specialty/profile context for doctor sessions (H8),
 *   - leave types supply type-driven leave credits (RO/DO = 0, match-duty = 8),
 *   - history assignments carry cross-boundary streaks into the roster.
 *
 * Both seed runners (client `seedRunner` and server `serverSeedRunner`) build their engine
 * call from this module so the two datasets can no longer drift apart.
 */

import {
  Assignment,
  Doctor,
  DoctorSession,
  LeaveType,
  WeeklyPatternSlot,
  WorkingHoursPeriod,
} from '../../types';
import { SEED_DOCTORS, SEED_LEAVE_TYPES, SEED_WORKING_HOURS_PERIODS } from './seedData';

/** October 2026 — the month every seeded session and roster covers. */
export const SEED_SCHEDULE_YEAR = 2026;
export const SEED_SCHEDULE_MONTH_INDEX = 9; // 0-indexed: October
export const SEED_SCHEDULE_DAY_COUNT = 31;

/**
 * Expands each seed doctor's weekly pattern into concrete DoctorSession records for October 2026.
 */
export function buildSeedDoctorSessions(): DoctorSession[] {
  const expandedSessions: DoctorSession[] = [];

  for (let day = 1; day <= SEED_SCHEDULE_DAY_COUNT; day++) {
    const dateObj = new Date(Date.UTC(SEED_SCHEDULE_YEAR, SEED_SCHEDULE_MONTH_INDEX, day));
    const weekday = dateObj.getUTCDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const isoDate = `2026-10-${String(day).padStart(2, '0')}`;

    SEED_DOCTORS.forEach((doctor) => {
      doctor.weeklyPattern.forEach((pattern: WeeklyPatternSlot) => {
        if (pattern.weekday === weekday) {
          expandedSessions.push({
            id: `sess-${doctor.id}-${isoDate}-${pattern.startTime.replace(':', '')}`,
            doctorId: doctor.id,
            date: isoDate,
            startTime: pattern.startTime,
            endTime: pattern.endTime,
            specialtyId: doctor.specialtyIds[0],
            room: pattern.room,
            source: 'PATTERN',
            cancelled: false,
          });
        }
      });
    });
  }

  return expandedSessions;
}

/** The trailing `SchedulingEngine.generate` inputs a freshly seeded baseline must supply. */
export interface SeedEngineExtras {
  workingHoursPeriods: WorkingHoursPeriod[];
  doctors: Doctor[];
  leaveTypes: LeaveType[];
  historyAssignments: Assignment[];
}

/**
 * Returns the seed engine inputs. History is intentionally empty: a freshly seeded database
 * has no earlier roster, so the cross-boundary H2 / late-streak lookback must not invent one.
 */
export function seedEngineExtras(): SeedEngineExtras {
  return {
    workingHoursPeriods: SEED_WORKING_HOURS_PERIODS,
    doctors: SEED_DOCTORS,
    leaveTypes: SEED_LEAVE_TYPES,
    historyAssignments: [],
  };
}
