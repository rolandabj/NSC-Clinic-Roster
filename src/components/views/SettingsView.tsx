/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Clinic Settings: the tab bar, the data several tabs share (clinic profile,
 * entity lists, email settings). Clinic and opening hours, and Email, are drafts saved only by
 * Save, with Cancel and a warning before leaving with unsaved changes (Phase 8, slice 1b). Each tab's content lives in ./settings/<Name>Tab.tsx.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Clock,
  CalendarCheck,
  Shield,
  Stethoscope,
  Tags,
  Sliders,
  Flag,
  Mail,
  Database,
  ShieldCheck,
  CalendarRange,
} from 'lucide-react';
import { AddressChange, ClinicContextState } from '../../types/navigation';
import { useAppContext } from '../common/AppContext';
import { getRepository } from '../../services/repository';
import { authService } from '../../services/auth/authService';
import { getWeekendDays, setClinicWeekendDays } from '../../utils/weekend';
import {
  ClinicProfile,
  DutyWindow,
  LeaveType,
  SeniorityLevel,
  ClinicalRole,
  Specialty,
  Rule,
  PublicHoliday,
} from '../../types';
import {
  EmailSettingsConfig,
} from '../../types/settings';
import { Badge, Field, PageHeader, Select, cx } from '../ui';
import { addLeaveGuard, isChanged } from '../common/leaveGuard';
import { SEED_CLINIC_PROFILE } from '../../services/seed/seedData';
import { notify } from '../common/dialogs';
import { AccessManagementPanel } from './AccessManagementPanel';
import { WorkingHoursPeriodsPanel } from './WorkingHoursPeriodsPanel';
import { SettingsTab } from './settings/shared';
import { ClinicTab } from './settings/ClinicTab';
import { DutiesTab } from './settings/DutiesTab';
import { LeaveTab } from './settings/LeaveTab';
import { SeniorityTab } from './settings/SeniorityTab';
import { NurseSkillsTab } from './settings/NurseSkillsTab';
import { SpecialtiesTab } from './settings/SpecialtiesTab';
import { RulesTab } from './settings/RulesTab';
import { HolidaysTab } from './settings/HolidaysTab';
import { EmailTab } from './settings/EmailTab';
import { DatabaseTab } from './settings/DatabaseTab';
import { cachedEmailSettings, loadEmailSettings, saveEmailSettings } from '../../services/settings/emailSettingsStore';

interface SettingsViewProps {
  context: ClinicContextState;
  onOpenAcceptance?: () => void;
  /** The tab the address names (#settings?tab=email). */
  tab?: string;
  onAddressChange?: AddressChange;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  context,
  onOpenAcceptance,
  tab,
  onAddressChange,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    if (tab) return tab as SettingsTab;
    try {
      const saved = localStorage.getItem('clinic_roster_settings_active_tab') as SettingsTab;
      // 'acceptance' was a removed tab
      if (saved && (saved as string) !== 'acceptance') return saved;
    } catch {
      // ignore
    }
    return 'clinic';
  });

  // Entities state loaded from repository
  const [clinic, setClinic] = useState<ClinicProfile | null>(null);
  const [duties, setDuties] = useState<DutyWindow[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [seniority, setSeniority] = useState<SeniorityLevel[]>([]);
  const [clinicalRoles, setClinicalRoles] = useState<ClinicalRole[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);

  const [emailConfig, setEmailConfig] = useState<EmailSettingsConfig>(() => {
    return cachedEmailSettings();
  });

  const repo = getRepository();

  const loadData = async () => {
    try {
      const c = await repo.list('clinics');
      if (c.length > 0) {
        setClinic(c[0]);
      } else {
        const rawSaved = localStorage.getItem('clinic_roster_clinic_profile');
        if (rawSaved) {
          try {
            const parsed = JSON.parse(rawSaved);
            setClinic(parsed);
          } catch {
            setClinic(SEED_CLINIC_PROFILE);
          }
        } else {
          setClinic(SEED_CLINIC_PROFILE);
        }
      }

      const d = await repo.list('dutyWindows');
      setDuties(d);

      const lt = await repo.list('leaveTypes');
      setLeaveTypes(lt);

      const s = await repo.list('seniorityLevels');
      setSeniority(s.sort((a, b) => a.rank - b.rank));

      const cr = await repo.list('clinicalRoles');
      setClinicalRoles(cr);

      const sp = await repo.list('specialties');
      setSpecialties(sp);

      const r = await repo.list('rules');
      setRules(r);

      const h = await repo.list('holidays');
      setHolidays(h.sort((a, b) => a.date.localeCompare(b.date)));
    } catch (err) {
      console.error('Error loading settings data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerSaveNotification = (msg: string) => notify(msg, 'success');

  // --- Clinic and opening hours, and Email: a draft each, saved only by Save (Phase 8, slice 1b) ---
  // The app context shows the clinic's new name and time zone in the menu and the top bar.
  const updateClinic = useAppContext()?.updateClinic;
  const updateClinicRef = useRef(updateClinic);
  updateClinicRef.current = updateClinic;

  const [clinicDraft, setClinicDraft] = useState<ClinicProfile | null>(null);
  const [clinicSaving, setClinicSaving] = useState(false);
  // The draft starts as the saved profile, and again whenever the saved one is loaded.
  useEffect(() => setClinicDraft(clinic), [clinic]);
  const clinicChanged = isChanged(clinic, clinicDraft);

  const saveClinic = async () => {
    if (!clinicDraft || clinicSaving) return;
    setClinicSaving(true);
    try {
      const clinicToSave: ClinicProfile = {
        ...clinicDraft,
        id: clinicDraft.id || 'clinic-primary',
        name: (clinicDraft.name || '').trim() || 'Outpatient Clinic',
        timezone: (clinicDraft.timezone || '').trim() || 'Asia/Dubai',
        address: clinicDraft.address || '',
        phone: clinicDraft.phone || '',
        weekendDays: clinicDraft.weekendDays || getWeekendDays(),
        openTime: clinicDraft.openTime || '09:00',
        closeTime: clinicDraft.closeTime || '21:00',
        updatedAt: new Date().toISOString(),
      };
      await repo.bulkUpsert('clinics', [clinicToSave]);
      setClinicWeekendDays(clinicToSave.weekendDays);
      // Kept in this browser too, so a reload shows the profile at once.
      localStorage.setItem('clinic_roster_clinic_profile', JSON.stringify(clinicToSave));
      localStorage.setItem('clinic_roster_clinic_name', clinicToSave.name);
      localStorage.setItem('clinic_roster_clinic_timezone', clinicToSave.timezone);
      updateClinicRef.current?.({ name: clinicToSave.name, timezone: clinicToSave.timezone });
      setClinic(clinicToSave);
      triggerSaveNotification('Clinic and opening hours saved.');
    } catch (err: any) {
      console.error('Failed to save clinic profile:', err);
      notify(`The clinic and opening hours were not saved: ${err?.message || 'unknown error'}`, 'error');
    } finally {
      setClinicSaving(false);
    }
  };

  const [emailDraft, setEmailDraft] = useState<EmailSettingsConfig>(emailConfig);
  const [emailSaving, setEmailSaving] = useState(false);
  useEffect(() => setEmailDraft(emailConfig), [emailConfig]);
  const emailChanged = isChanged(emailConfig, emailDraft);

  // Load the clinic's shared email settings (this browser's copy shows until they arrive)
  useEffect(() => {
    loadEmailSettings(getRepository()).then((shared) => setEmailConfig(shared));
  }, []);

  const saveEmail = async () => {
    if (emailSaving) return;
    setEmailSaving(true);
    try {
      // Shared by the whole clinic, so every planner uses the same test mode or live setting.
      await saveEmailSettings(getRepository(), emailDraft, authService.getCurrentUser()?.email);
      setEmailConfig(emailDraft);
      triggerSaveNotification('Email settings saved for everyone.');
    } catch (err: any) {
      console.error('Failed to save email config:', err);
      notify(`The email settings were not saved: ${err?.message || err}`, 'error');
    } finally {
      setEmailSaving(false);
    }
  };

  // Unsaved changes: named in the menu, asked about before leaving Settings or closing the tab.
  const unsavedSections = [clinicChanged ? 'Clinic and opening hours' : '', emailChanged ? 'Email' : ''].filter(Boolean);
  const unsavedRef = useRef(unsavedSections);
  unsavedRef.current = unsavedSections;
  useEffect(() => {
    const removeGuard = addLeaveGuard(() =>
      unsavedRef.current.length === 0
        ? null
        : unsavedRef.current.length === 1
          ? `${unsavedRef.current[0]} has changes that are not saved.`
          : `${unsavedRef.current[0]}, and ${unsavedRef.current[1]}, have changes that are not saved.`
    );
    const warn = (e: BeforeUnloadEvent) => {
      if (unsavedRef.current.length === 0) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => {
      removeGuard();
      window.removeEventListener('beforeunload', warn);
    };
  }, []);

  // Drafts stay while moving between sections, so nothing is lost on the way.
  const handleTabSwitch = (newTab: SettingsTab) => {
    setActiveTab(newTab);
    // A new step for Back, which then returns to the tab before.
    onAddressChange?.({ tab: newTab }, 'push');
    try {
      localStorage.setItem('clinic_roster_settings_active_tab', newTab);
    } catch {
      // ignore
    }
  };


  const currentUser = authService.getCurrentUser();
  const isMasterAdmin = currentUser?.email?.toLowerCase() === 'rolandabj@gmail.com' || currentUser?.role === 'OWNER';

  // Settings sections, grouped in the side menu (UI overhaul Phase 8, slice 1a).
  const tabGroups: { title: string; tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] }[] = [
    {
      title: 'Clinic',
      tabs: [
        { id: 'clinic', label: 'Clinic and opening hours', icon: Building2 },
        { id: 'holidays', label: 'Public holidays', icon: Flag },
        { id: 'working-hours-periods', label: 'Time periods', icon: CalendarRange },
      ],
    },
    {
      title: 'Roster rules',
      tabs: [
        { id: 'rules', label: 'Rules', icon: Sliders },
        { id: 'duties', label: 'Shifts', icon: Clock },
        { id: 'leave', label: 'Leave types', icon: CalendarCheck },
        { id: 'seniority', label: 'Nurse levels', icon: Shield },
        { id: 'clinical-roles', label: 'Nurse skills', icon: Stethoscope },
        { id: 'specialties', label: 'Specialties', icon: Tags },
      ],
    },
    ...(isMasterAdmin
      ? [{ title: 'People and access', tabs: [{ id: 'access-roles' as SettingsTab, label: 'Access and permissions', icon: ShieldCheck }] }]
      : []),
    { title: 'Email', tabs: [{ id: 'email', label: 'Email', icon: Mail }] },
    ...(isMasterAdmin ? [{ title: 'Data and backup', tabs: [{ id: 'database' as SettingsTab, label: 'Data and backup', icon: Database }] }] : []),
  ];
  const tabs = tabGroups.flatMap((g) => g.tabs);

  // A tab saved in this browser may not be available to the current user
  // (e.g. Access & Permissions after signing in as someone else).
  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) setActiveTab('clinic');
  }, [activeTab, isMasterAdmin]);

  // The address names the open tab. Back, Forward or a link to another tab opens it; an
  // address without a tab gets the open one, so the link can be copied.
  useEffect(() => {
    if (!tab) onAddressChange?.({ tab: activeTab }, 'replace');
    else if (tab !== activeTab) {
      setActiveTab(tab as SettingsTab);
    }
  }, [tab]);
  useEffect(() => {
    if (tab && tab !== activeTab) onAddressChange?.({ tab: activeTab }, 'replace');
    // Only when the tab changes here without a click (a tab this person may not open).
  }, [activeTab]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 text-ink sm:p-6">
      <PageHeader title="Settings" meta={<span>Set up the clinic, the roster rules, who can use the app and email.</span>} />

      <div className="grid gap-5 md:grid-cols-[14rem_minmax(0,1fr)]">
      {/* The sections: a link each, so the address names the open one (a dropdown on a phone). */}
      <nav aria-label="Settings sections" className="md:sticky md:top-4 md:self-start">
        <Field label="Settings section" className="md:hidden">
          {(f) => (
            <Select {...f} value={activeTab} onChange={(e) => handleTabSwitch(e.target.value as SettingsTab)}>
              {tabGroups.map((group) => (
                <optgroup key={group.title} label={group.title}>
                  {group.tabs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          )}
        </Field>
        <div className="hidden space-y-4 md:block">
          {tabGroups.map((group) => (
            <div key={group.title}>
              <h2 className="px-2.5 pb-1 text-xs font-semibold text-ink-muted">{group.title}</h2>
              <ul className="space-y-0.5">
                {group.tabs.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <li key={t.id}>
                      <a
                        href={`#settings?tab=${t.id}`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={(e) => {
                          // A plain click opens the section here; Ctrl, Shift or the middle button opens it elsewhere.
                          if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
                          e.preventDefault();
                          handleTabSwitch(t.id);
                        }}
                        className={cx(
                          'flex min-h-9 items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors pointer-coarse:min-h-11',
                          isActive ? 'bg-brand-soft font-semibold text-brand-strong' : 'text-ink-muted hover:bg-sunken hover:text-ink'
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        <span>{t.label}</span>
                        {((t.id === 'clinic' && clinicChanged) || (t.id === 'email' && emailChanged)) && (
                          <Badge tone="warning" className="ml-auto">
                            Not saved
                          </Badge>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* TAB CONTENT PANELS */}
      <div className="min-w-0 rounded-lg border border-line bg-surface p-4 shadow-card sm:p-6">
        {/* 0. ACCESS & ROLES MANAGEMENT (MASTER ADMIN ONLY) */}
        {activeTab === 'access-roles' && isMasterAdmin && <AccessManagementPanel currentUser={currentUser || undefined} />}

        {/* 1. CLINIC PROFILE */}
        {activeTab === 'clinic' && clinicDraft && (
          <ClinicTab
            draft={clinicDraft}
            onChange={(updates) => setClinicDraft((d) => (d ? { ...d, ...updates } : d))}
            changed={clinicChanged}
            saving={clinicSaving}
            onSave={saveClinic}
            onCancel={() => setClinicDraft(clinic)}
          />
        )}

        {/* 3. DUTY WINDOWS ("acceptable duty") */}
        {activeTab === 'duties' && (
          <DutiesTab
            duties={duties}
            openTime={clinic?.openTime}
            closeTime={clinic?.closeTime}
            loadData={loadData}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {/* 3. LEAVE TYPES */}
        {activeTab === 'leave' && (
          <LeaveTab leaveTypes={leaveTypes} loadData={loadData} triggerSaveNotification={triggerSaveNotification} />
        )}

        {/* 4. SENIORITY LEVELS */}
        {activeTab === 'seniority' && (
          <SeniorityTab
            seniority={seniority}
            setSeniority={setSeniority}
            loadData={loadData}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {/* 5. NURSE SKILLS */}
        {activeTab === 'clinical-roles' && (
          <NurseSkillsTab
            clinicalRoles={clinicalRoles}
            loadData={loadData}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {/* 6. SPECIALTIES */}
        {activeTab === 'specialties' && (
          <SpecialtiesTab
            specialties={specialties}
            loadData={loadData}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {/* 7. RULES & CUSTOM RULE BUILDER */}
        {activeTab === 'rules' && (
          <RulesTab
            rules={rules}
            setRules={setRules}
            loadData={loadData}
            triggerSaveNotification={triggerSaveNotification}
          />
        )}

        {/* 8. PUBLIC HOLIDAYS */}
        {activeTab === 'holidays' && (
          <HolidaysTab holidays={holidays} loadData={loadData} triggerSaveNotification={triggerSaveNotification} />
        )}

        {/* 9b. DEDICATED TIME PERIODS & WORKING HOURS */}
        {activeTab === 'working-hours-periods' && (
          <WorkingHoursPeriodsPanel />
        )}

        {/* 10. EMAIL NOTIFICATION SETTINGS (GOOGLE-ONLY COMMUNICATIONS) */}
        {activeTab === 'email' && (
          <EmailTab
            context={context}
            draft={emailDraft}
            onChange={(updates) => setEmailDraft((d) => ({ ...d, ...updates }))}
            changed={emailChanged}
            saving={emailSaving}
            onSave={saveEmail}
            onCancel={() => setEmailDraft(emailConfig)}
          />
        )}

        {/* 12. DATABASE & STORAGE MANAGEMENT */}
        {activeTab === 'database' && isMasterAdmin && (
          <DatabaseTab loadData={loadData} triggerSaveNotification={triggerSaveNotification} />
        )}
      </div>
      </div>
    </div>
  );
};

export default SettingsView;
