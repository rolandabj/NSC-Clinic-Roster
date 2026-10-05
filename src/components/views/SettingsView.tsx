/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Clinic Settings: the tab bar, the data several tabs share (clinic profile,
 * entity lists, email settings) and their
 * auto-save machinery. Each tab's content lives in ./settings/<Name>Tab.tsx.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  CheckCircle2,
  Database,
  ShieldCheck,
  CalendarRange,
} from 'lucide-react';
import { ClinicContextState } from '../../types/navigation';
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
  DEFAULT_EMAIL_SETTINGS,
} from '../../types/settings';
import { SEED_CLINIC_PROFILE } from '../../services/seed/seedData';
import { notify } from '../common/dialogs';
import { AccessManagementPanel } from './AccessManagementPanel';
import { WorkingHoursPeriodsPanel } from './WorkingHoursPeriodsPanel';
import { SaveStatus, SettingsTab } from './settings/shared';
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
  onUpdateClinicProfile?: (profile: ClinicProfile) => void;
  onUpdateClinicName?: (name: string) => void;
  onOpenAcceptance?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  context,
  onUpdateClinicProfile,
  onUpdateClinicName,
  onOpenAcceptance,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    try {
      const saved = localStorage.getItem('clinic_roster_settings_active_tab') as SettingsTab;
      // 'acceptance' was a removed tab
      if (saved && (saved as string) !== 'acceptance') return saved;
    } catch {
      // ignore
    }
    return 'clinic';
  });
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

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

  const triggerSaveNotification = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3500);
  };

  // --- 1. Clinic Profile Auto-Save & Persistence ---
  const onUpdateClinicProfileRef = useRef(onUpdateClinicProfile);
  onUpdateClinicProfileRef.current = onUpdateClinicProfile;
  const onUpdateClinicNameRef = useRef(onUpdateClinicName);
  onUpdateClinicNameRef.current = onUpdateClinicName;

  const [clinicSaveStatus, setClinicSaveStatus] = useState<SaveStatus>('saved');
  const clinicDebounceTimerRef = useRef<any>(null);
  const latestClinicRef = useRef<ClinicProfile | null>(clinic);
  latestClinicRef.current = clinic;

  const persistClinicProfile = useCallback(
    async (targetClinic: ClinicProfile, showNotification = false) => {
      try {
        setClinicSaveStatus('saving');
        const clinicToSave: ClinicProfile = {
          ...targetClinic,
          id: targetClinic.id || 'clinic-primary',
          name: (targetClinic.name || '').trim() || 'Outpatient Clinic',
          timezone: (targetClinic.timezone || '').trim() || 'Asia/Dubai',
          address: targetClinic.address || '',
          phone: targetClinic.phone || '',
          weekendDays: targetClinic.weekendDays || getWeekendDays(),
          openTime: targetClinic.openTime || '09:00',
          closeTime: targetClinic.closeTime || '21:00',
          updatedAt: new Date().toISOString(),
        };

        await repo.bulkUpsert('clinics', [clinicToSave]);
        setClinicWeekendDays(clinicToSave.weekendDays);

        // Persist directly to localStorage for instantaneous recovery on refresh
        localStorage.setItem('clinic_roster_clinic_profile', JSON.stringify(clinicToSave));
        localStorage.setItem('clinic_roster_clinic_name', clinicToSave.name);
        localStorage.setItem('clinic_roster_clinic_timezone', clinicToSave.timezone);

        if (typeof document !== 'undefined') {
          document.title = `${clinicToSave.name} — Clinical Roster`;
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('clinic-name-updated', { detail: clinicToSave.name }));
        }

        onUpdateClinicProfileRef.current?.(clinicToSave);
        onUpdateClinicNameRef.current?.(clinicToSave.name);

        setClinicSaveStatus('saved');
        if (showNotification) {
          triggerSaveNotification('Clinic profile updated and saved permanently.');
        }
      } catch (err: any) {
        console.error('Failed to save clinic profile:', err);
        setClinicSaveStatus('error');
        // Auto saves fail quietly otherwise, so always say so.
        notify(`The clinic profile was not saved: ${err?.message || 'unknown error'}`, 'error');
      }
    },
    [repo]
  );

  const updateClinicField = useCallback(
    (updates: Partial<ClinicProfile>, immediate = false) => {
      if (!latestClinicRef.current) return;
      const nextClinic = { ...latestClinicRef.current, ...updates };
      setClinic(nextClinic);
      latestClinicRef.current = nextClinic;
      setClinicSaveStatus('saving');

      if (clinicDebounceTimerRef.current) {
        clearTimeout(clinicDebounceTimerRef.current);
        clinicDebounceTimerRef.current = null;
      }

      if (immediate) {
        persistClinicProfile(nextClinic);
      } else {
        clinicDebounceTimerRef.current = setTimeout(() => {
          persistClinicProfile(nextClinic);
        }, 500);
      }
    },
    [persistClinicProfile]
  );

  const flushClinicSave = useCallback(() => {
    if (clinicDebounceTimerRef.current) {
      clearTimeout(clinicDebounceTimerRef.current);
      clinicDebounceTimerRef.current = null;
    }
    if (latestClinicRef.current) {
      persistClinicProfile(latestClinicRef.current);
    }
  }, [persistClinicProfile]);

  const handleSaveClinicProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latestClinicRef.current) return;
    flushClinicSave();
    triggerSaveNotification('Clinic profile updated and saved permanently.');
  };

  // --- 10. Email Settings Auto-Save ---
  const [emailSaveStatus, setEmailSaveStatus] = useState<SaveStatus>('saved');
  const emailDebounceTimerRef = useRef<any>(null);
  const latestEmailConfigRef = useRef<EmailSettingsConfig>(emailConfig);
  latestEmailConfigRef.current = emailConfig;

  // Load the clinic's shared email settings (this browser's copy shows until they arrive)
  useEffect(() => {
    loadEmailSettings(getRepository()).then((shared) => {
      setEmailConfig(shared);
      latestEmailConfigRef.current = shared;
    });
  }, []);

  const persistEmailConfig = useCallback(
    async (configToSave: EmailSettingsConfig, showNotification = false) => {
      try {
        setEmailSaveStatus('saving');
        // Shared by the whole clinic, so every planner uses the same Sandbox / Live mode
        await saveEmailSettings(getRepository(), configToSave, authService.getCurrentUser()?.email);
        setEmailSaveStatus('saved');
        if (showNotification) {
          triggerSaveNotification('Email settings saved for everyone.');
        }
      } catch (err: any) {
        console.error('Failed to save email config:', err);
        setEmailSaveStatus('error');
        notify(`Email settings were not saved: ${err?.message || err}`, 'error');
      }
    },
    []
  );

  const updateEmailConfigField = useCallback(
    (updates: Partial<EmailSettingsConfig>, immediate = false) => {
      const nextConfig = { ...latestEmailConfigRef.current, ...updates };
      setEmailConfig(nextConfig);
      latestEmailConfigRef.current = nextConfig;
      setEmailSaveStatus('saving');

      if (emailDebounceTimerRef.current) {
        clearTimeout(emailDebounceTimerRef.current);
        emailDebounceTimerRef.current = null;
      }

      if (immediate) {
        persistEmailConfig(nextConfig);
      } else {
        emailDebounceTimerRef.current = setTimeout(() => {
          persistEmailConfig(nextConfig);
        }, 500);
      }
    },
    [persistEmailConfig]
  );

  const flushEmailSave = useCallback(() => {
    if (emailDebounceTimerRef.current) {
      clearTimeout(emailDebounceTimerRef.current);
      emailDebounceTimerRef.current = null;
    }
    persistEmailConfig(latestEmailConfigRef.current);
  }, [persistEmailConfig]);

  // --- Unified Commit Guard (Tab Switch, Unmount, Page Refresh / Unload) ---
  const flushAllSettingsRef = useRef<() => void>(() => {});

  const flushAllSettings = useCallback(() => {
    // 1. Flush Clinic Profile only if timer is active
    if (clinicDebounceTimerRef.current) {
      clearTimeout(clinicDebounceTimerRef.current);
      clinicDebounceTimerRef.current = null;
      if (latestClinicRef.current) {
        persistClinicProfile(latestClinicRef.current);
      }
    }

    // 2. Flush Email Settings only if timer is active
    if (emailDebounceTimerRef.current) {
      clearTimeout(emailDebounceTimerRef.current);
      emailDebounceTimerRef.current = null;
      if (latestEmailConfigRef.current) {
        persistEmailConfig(latestEmailConfigRef.current);
      }
    }
  }, [persistClinicProfile, persistEmailConfig]);

  flushAllSettingsRef.current = flushAllSettings;

  // Global beforeunload listener & unmount commit guard
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushAllSettingsRef.current?.();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      flushAllSettingsRef.current?.();
    };
  }, []);

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    flushEmailSave();
    triggerSaveNotification('Email settings updated.');
  };

  const handleTabSwitch = (newTab: SettingsTab) => {
    flushAllSettings();
    setActiveTab(newTab);
    try {
      localStorage.setItem('clinic_roster_settings_active_tab', newTab);
    } catch {
      // ignore
    }
  };


  const currentUser = authService.getCurrentUser();
  const isMasterAdmin = currentUser?.email?.toLowerCase() === 'rolandabj@gmail.com' || currentUser?.role === 'OWNER';

  // Settings pages, grouped in the side menu
  const tabGroups: { title: string; tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] }[] = [
    {
      title: 'Clinic',
      tabs: [
        { id: 'clinic', label: 'Clinic profile', icon: Building2 },
        { id: 'holidays', label: 'Public holidays', icon: Flag },
        { id: 'working-hours-periods', label: 'Time periods', icon: CalendarRange },
      ],
    },
    {
      title: 'Scheduling',
      tabs: [
        { id: 'rules', label: 'Rules', icon: Sliders },
        { id: 'duties', label: 'Shifts', icon: Clock },
      ],
    },
    {
      title: 'Staff',
      tabs: [
        { id: 'leave', label: 'Leave types', icon: CalendarCheck },
        { id: 'seniority', label: 'Seniority', icon: Shield },
        { id: 'clinical-roles', label: 'Nurse skills', icon: Stethoscope },
        { id: 'specialties', label: 'Specialties', icon: Tags },
      ],
    },
    {
      title: 'Access & system',
      tabs: [
        ...(isMasterAdmin ? [{ id: 'access-roles' as SettingsTab, label: 'Access & permissions', icon: ShieldCheck }] : []),
        { id: 'email', label: 'Email', icon: Mail },
        ...(isMasterAdmin ? [{ id: 'database' as SettingsTab, label: 'Database & backup', icon: Database }] : []),
      ],
    },
  ];
  const tabs = tabGroups.flatMap((g) => g.tabs);

  // A tab saved in this browser may not be available to the current user
  // (e.g. Access & Permissions after signing in as someone else).
  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) setActiveTab('clinic');
  }, [activeTab, isMasterAdmin]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Save Notification */}
      {saveBanner && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Set up your clinic, staff and the rules the roster follows.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
      {/* Side menu (a dropdown on small screens) */}
      <nav aria-label="Settings pages" className="md:sticky md:top-4 md:self-start">
        <label className="md:hidden block">
          <span className="sr-only">Settings page</span>
          <select
            value={activeTab}
            onChange={(e) => handleTabSwitch(e.target.value as SettingsTab)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          >
            {tabGroups.map((group) => (
              <optgroup key={group.title} label={group.title}>
                {group.tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="hidden md:block space-y-5">
          {tabGroups.map((group) => (
            <div key={group.title}>
              <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{group.title}</p>
              <ul className="space-y-0.5">
                {group.tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <li key={tab.id}>
                      <button
                        type="button"
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => handleTabSwitch(tab.id)}
                        className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                          isActive ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} aria-hidden="true" />
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* TAB CONTENT PANELS */}
      <div className="min-w-0 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        {/* 0. ACCESS & ROLES MANAGEMENT (MASTER ADMIN ONLY) */}
        {activeTab === 'access-roles' && isMasterAdmin && <AccessManagementPanel currentUser={currentUser || undefined} />}

        {/* 1. CLINIC PROFILE */}
        {activeTab === 'clinic' && clinic && (
          <ClinicTab
            clinic={clinic}
            clinicSaveStatus={clinicSaveStatus}
            updateClinicField={updateClinicField}
            flushClinicSave={flushClinicSave}
            handleSaveClinicProfile={handleSaveClinicProfile}
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
          <WorkingHoursPeriodsPanel
            onNotify={(msg) => {
              setSaveBanner(msg);
              setTimeout(() => setSaveBanner(null), 3000);
            }}
          />
        )}

        {/* 10. EMAIL NOTIFICATION SETTINGS (GOOGLE-ONLY COMMUNICATIONS) */}
        {activeTab === 'email' && (
          <EmailTab
            context={context}
            emailConfig={emailConfig}
            emailSaveStatus={emailSaveStatus}
            updateEmailConfigField={updateEmailConfigField}
            flushEmailSave={flushEmailSave}
            handleSaveEmailConfig={handleSaveEmailConfig}
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
