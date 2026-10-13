/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Read-Only Published Roster Page (Phase 12)
 * Mobile & Desktop Responsive, Block Navigation, Nurse Filters & Personal Link Support.
 */

import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, Loader2, TriangleAlert } from 'lucide-react';
import { Button } from '../ui';
import { PublicMessage, PublicPageFrame } from '../common/PublicPageFrame';
import type { Schedule, ScheduleVersion, Nurse, DutyWindow, Doctor, ClinicalRole, Specialty } from '../../types';
import { getRepository } from '../../services/repository';
import { authService } from '../../services/auth/authService';
import { loadPublicRoster } from '../../services/publish/publicRosterService';
import { buildNurseIcs, downloadIcsFile } from '../../services/export/icsExportService';
import { withoutBackups } from '../../services/history/versionList';
import { buildTeamRosterSheet } from '../../services/publish/nurseRosterService';
import { PublishedRosterSheet } from '../roster/PublishedRosterSheet';

interface PublishedRosterViewProps {
  shareToken?: string;
  nurseIdParam?: string;
  onExitPreview?: () => void;
}


export const PublishedRosterView: React.FC<PublishedRosterViewProps> = ({
  shareToken,
  nurseIdParam,
  onExitPreview,
}) => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [version, setVersion] = useState<ScheduleVersion | null>(null);

  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [dutyWindows, setDutyWindows] = useState<DutyWindow[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [roles, setClinicalRoles] = useState<ClinicalRole[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  // Navigation & Filtering
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);
  const [linkStatus, setLinkStatus] = useState('');
  const [clinicTimezone, setClinicTimezone] = useState<string>(() => {
    try {
      return localStorage.getItem('clinic_roster_clinic_timezone') || 'Asia/Dubai';
    } catch {
      return 'Asia/Dubai';
    }
  });
  const [clinicLabel, setClinicLabel] = useState<string>(() => {
    try {
      return localStorage.getItem('clinic_roster_clinic_name') || 'Clinic';
    } catch {
      return 'Clinic';
    }
  });

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    async function loadPublishedRoster() {
      setLoading(true);
      setAccessDeniedMessage(null);
      try {
        // A share link reads exactly one public snapshot document (works without signing in).
        if (shareToken) {
          const snap = await loadPublicRoster(shareToken);
          if (!snap) {
            setAccessDeniedMessage(
              currentUser
                ? 'This link is not valid for your account. It may have been turned off, replaced, or shared only with other staff.'
                : 'This link is not valid. It may have been turned off or replaced, or it is shared only with signed in staff. Ask the clinic for a new link, or sign in with an authorized account.'
            );
            return;
          }
          setNurses(snap.nurses as Nurse[]);
          setDutyWindows(snap.dutyWindows as DutyWindow[]);
          setDoctors(snap.doctors as Doctor[]);
          setClinicalRoles(snap.clinicalRoles as ClinicalRole[]);
          setSpecialties(snap.specialties as Specialty[]);
          setSchedule(snap.schedule as Schedule);
          if (snap.timezone) setClinicTimezone(snap.timezone);
          if (snap.clinicName) setClinicLabel(snap.clinicName);
          setVersion(snap.version as unknown as ScheduleVersion);

        } else if (currentUser) {
          // Signed in preview without a token: latest published version.
          const repo = getRepository();
          const [schedList, vList, nList, dwList, dList, rList, spList] = await Promise.all([
            repo.list('schedules'),
            repo.list('versions').then(withoutBackups),
            repo.list('nurses'),
            repo.list('dutyWindows'),
            repo.list('doctors'),
            repo.list('clinicalRoles'),
            repo.list('specialties'),
          ]);
          setNurses(nList.filter((n) => n.active));
          setDutyWindows(dwList);
          setDoctors(dList);
          setClinicalRoles(rList);
          setSpecialties(spList);

          const published = vList.filter((v) => v.isPublished).sort((a, b) => (b.publishedAt || b.timestamp).localeCompare(a.publishedAt || a.timestamp));
          const targetVersion = published[0] || null;
          const targetSchedule = targetVersion ? schedList.find((s) => s.id === targetVersion.scheduleId) || null : null;
          if (targetSchedule && targetVersion) {
            setSchedule(targetSchedule);
            setVersion(targetVersion);
          }
        }

      } catch (err: any) {
        console.error('Error loading published roster:', err);
        setAccessDeniedMessage('The published roster could not be loaded. Check your connection and reopen the link.');
      } finally {
        setLoading(false);
      }
    }

    loadPublishedRoster();
  }, [shareToken, nurseIdParam]);

  const backButton = onExitPreview && (
    <Button size="lg" icon={ArrowLeft} onClick={onExitPreview}>
      Back to the app
    </Button>
  );

  if (loading) {
    return (
      <PublicPageFrame clinicName={clinicLabel}>
        <div className="pt-6">
          <PublicMessage live icon={<Loader2 className="size-8 animate-spin text-brand" aria-hidden="true" />} title="Opening the published roster…" />
        </div>
      </PublicPageFrame>
    );
  }

  if (accessDeniedMessage) {
    return (
      <PublicPageFrame clinicName={clinicLabel}>
        <div className="pt-6">
          <PublicMessage icon={<Lock className="size-10 text-warning" aria-hidden="true" />} title="This link does not open the roster" action={backButton}>
            {accessDeniedMessage}
          </PublicMessage>
        </div>
      </PublicPageFrame>
    );
  }

  if (!schedule || !version) {
    return (
      <PublicPageFrame clinicName={clinicLabel}>
        <div className="pt-6">
          <PublicMessage icon={<TriangleAlert className="size-10 text-warning" aria-hidden="true" />} title="No published roster yet" action={backButton}>
            The roster has not been published yet.
          </PublicMessage>
        </div>
      </PublicPageFrame>
    );
  }

  const sheet = buildTeamRosterSheet({ schedule, version, nurses, dutyWindows, doctors, clinicalRoles: roles, specialties });
  return (
    <PublicPageFrame clinicName={clinicLabel} wide>
      <div className="space-y-5">
        {onExitPreview && <div>{backButton}</div>}
        <h1 className="text-2xl font-semibold">Published roster</h1>
        <PublishedRosterSheet key={version.id} sheet={sheet} clinicName={clinicLabel} timezone={clinicTimezone} initialNurseId={nurseIdParam} myNurseId={currentUser?.linkedNurseId} nurseActions={nurseId => <>
          <button type="button" onClick={() => {
          const nurse = nurses.find(n => n.id === nurseId);
          downloadIcsFile(`${schedule.name} ${nurse?.fullName || 'shifts'}.ics`, buildNurseIcs({
            calendarName: `${clinicLabel} roster`, clinicName: clinicLabel, timezone: clinicTimezone,
            nurseId, assignments: version.snapshot.assignments.filter(a => !version.snapshot.leaveEntries?.some(l => l.nurseId === nurseId && l.approved && a.date >= l.startDate && a.date <= l.endDate)), dutyWindows, doctors, clinicalRoles: roles, specialties,
          }));
          }}>Add shifts to calendar</button>
          {shareToken && <button type="button" onClick={async () => {
            try { await navigator.clipboard.writeText(`${window.location.origin}/#published?token=${encodeURIComponent(shareToken)}&nurse=${encodeURIComponent(nurseId)}`); setLinkStatus('Personal roster link copied.'); }
            catch { setLinkStatus('Could not copy. Copy the page address from your browser instead.'); }
          }}>Copy personal link</button>}
        </>} />
        {linkStatus && <p role="status" className="text-ink-muted">{linkStatus}</p>}
      </div>
    </PublicPageFrame>
  );
};
