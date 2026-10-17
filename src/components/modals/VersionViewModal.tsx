/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * History's Open larger: one saved version's whole roster across nearly the whole screen, with
 * Restore and Delete for planners. On the shared Dialog since Phase 7, slice 5b; the table is the
 * same one as History's Roster tab (VersionRoster).
 */

import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { ScheduleVersion, Nurse, DutyWindow, Doctor, ClinicalRole, Specialty, Schedule, LeaveType, SeniorityLevel } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';
import { versionKind, versionKindLabel, versionName } from '../../services/history/versionKinds';
import { VersionRoster } from '../history/VersionRoster';
import { Button, Dialog } from '../ui';

interface VersionViewModalProps {
  version: ScheduleVersion | null;
  schedule?: Schedule | null;
  nurses: Nurse[];
  dutyWindows: DutyWindow[];
  doctors: Doctor[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  leaveTypes?: LeaveType[];
  seniorityLevels?: SeniorityLevel[];
  isOpen: boolean;
  onClose: () => void;
  onRestore?: (version: ScheduleVersion) => void;
  onDelete?: (version: ScheduleVersion) => void;
}

export const VersionViewModal: React.FC<VersionViewModalProps> = ({
  version,
  schedule,
  nurses,
  dutyWindows,
  doctors,
  roles,
  specialties,
  leaveTypes = [],
  seniorityLevels = [],
  isOpen,
  onClose,
  onRestore,
  onDelete,
}) => {
  if (!isOpen || !version) return null;
  const rosterName = version.snapshot.schedule?.name || schedule?.name || 'a roster';
  const kept = version.kind === 'BACKUP' ? 'Kept' : 'Saved';

  return (
    <Dialog
      open
      onClose={onClose}
      size="full"
      title={`${versionName(version)} of ${rosterName}`}
      description={`${versionKindLabel(versionKind(version))}. ${kept} by ${version.author || 'a planner'} on ${formatDateTime(version.timestamp)}.${version.note ? ` ${version.note}` : ''}`}
      footer={
        <>
          {onDelete && (
            <Button icon={Trash2} className="text-danger sm:mr-auto" onClick={() => onDelete(version)}>
              Delete
            </Button>
          )}
          {onRestore && (
            <Button icon={RotateCcw} onClick={() => onRestore(version)}>
              Restore
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <VersionRoster
        version={version}
        nurses={nurses}
        dutyWindows={dutyWindows}
        doctors={doctors}
        roles={roles}
        specialties={specialties}
        leaveTypes={leaveTypes}
        seniorityLevels={seniorityLevels}
        startWhole
      />
    </Dialog>
  );
};
