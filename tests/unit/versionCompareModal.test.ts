import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VersionCompareModal } from '../../src/components/modals/VersionCompareModal';
import { makeSchedule, makeNurse, DAY_DUTY } from './fixtures';
import type { Assignment, ScheduleVersion } from '../../src/types';

const emptyProps = {
  versions: [],
  activeAssignments: [],
  nurses: [],
  dutyWindows: [],
  doctors: [],
  roles: [],
  specialties: [],
  onClose: () => {},
};

test('the closed comparison dialog does not crash History while its roster is loading', () => {
  const html = renderToStaticMarkup(React.createElement(VersionCompareModal, {
    ...emptyProps,
    schedule: undefined,
    isOpen: false,
  }));
  assert.equal(html, '');
});

test('the comparison dialog waits for a roster even when asked to open', () => {
  const html = renderToStaticMarkup(React.createElement(VersionCompareModal, {
    ...emptyProps,
    schedule: null,
    isOpen: true,
  }));
  assert.equal(html, '');
});

test('a loaded roster still compares its saved version with the current draft', () => {
  const schedule = makeSchedule();
  const assignment: Assignment = {
    id: 'shift1', scheduleId: schedule.id, nurseId: 'n1', date: schedule.startDate,
    dutyWindowId: DAY_DUTY.id, kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-nc',
    source: 'MANUAL', locked: false,
  };
  const version: ScheduleVersion = {
    id: 'v1', scheduleId: schedule.id, number: 1,
    timestamp: '2026-10-04T12:00:00Z', author: 'Planner', note: 'Saved roster',
    isPublished: false,
    snapshot: { schedule, assignments: [assignment], leaveEntries: [], locks: [], rulesSnapshot: [] },
  };
  const html = renderToStaticMarkup(React.createElement(VersionCompareModal, {
    ...emptyProps,
    schedule,
    versions: [version],
    nurses: [makeNurse('n1')],
    dutyWindows: [DAY_DUTY],
    initialBaseVersionId: version.id,
    initialTargetVersionId: 'DRAFT',
    isOpen: true,
  }));
  assert.match(html, /Compare versions/);
  assert.match(html, /1 removed/);
  assert.match(html, /Version 1/);
  assert.match(html, /Roster now/);
});
