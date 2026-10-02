/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Saved versions without the automatic backup copies (kept before each fill or
 * clear). Backups are listed only under Backup copies, never as versions.
 */

import { ScheduleVersion } from '../../types';

export const withoutBackups = (list: ScheduleVersion[]): ScheduleVersion[] => list.filter((v) => v.kind !== 'BACKUP');
