/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Clinic Settings: the tab bar, the data several tabs share (clinic profile,
 * entity lists, hours policy, email settings, staff directory) and their
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
  Calculator,
  Mail,
  Cloud,
  CheckCircle2,
  Database,
  ShieldCheck,
  Users,
  CalendarRange,
} from 'lucide-react';
import { ClinicContextState } from '../../types/navigation';
import { getRepository } from '../../services/repository';
import { authService } from '../../services/auth/authService';
import { RoleDirectoryService } from '../../services/auth/directoryService';
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
  WebhookConfig,
  WebhookEndpoint,
} from '../../types';
import {
  HoursPolicyConfig,
  EmailSettingsConfig,
  DEFAULT_HOURS_POLICY,
  DEFAULT_EMAIL_SETTINGS,
} from '../../types/settings';
import { SEED_CLINIC_PROFILE } from '../../services/seed/seedData';
import { notify } from '../common/dialogs';
import { AccessManagementPanel } from './AccessManagementPanel';
import { WorkingHoursPeriodsPanel } from './WorkingHoursPeriodsPanel';
import { DirectorySummary, SaveStatus, SettingsTab } from './settings/shared';
import { ClinicTab } from './settings/ClinicTab';
import { DirectoryTab } from './settings/DirectoryTab';
import { DutiesTab } from './settings/DutiesTab';
import { LeaveTab } from './settings/LeaveTab';
import { SeniorityTab } from './settings/SeniorityTab';
import { ClinicalRolesTab } from './settings/ClinicalRolesTab';
import { SpecialtiesTab } from './settings/SpecialtiesTab';
import { RulesTab } from './settings/RulesTab';
import { HolidaysTab } from './settings/HolidaysTab';
import { HoursPolicyTab } from './settings/HoursPolicyTab';
import { EmailTab } from './settings/EmailTab';
import { IntegrationsTab } from './settings/IntegrationsTab';
import { DatabaseTab } from './settings/DatabaseTab';

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

  // Local hours policy & email settings
  const [hoursPolicy, setHoursPolicy] = useState<HoursPolicyConfig>(() => {
    const raw = localStorage.getItem('clinic_roster_hours_policy');
    return raw ? JSON.parse(raw) : DEFAULT_HOURS_POLICY;
  });

  const [emailConfig, setEmailConfig] = useState<EmailSettingsConfig>(() => {
    const raw = localStorage.getItem('clinic_roster_email_config');
    return raw ? JSON.parse(raw) : DEFAULT_EMAIL_SETTINGS;
  });

  // Webhooks & ChatOps State
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
  const [webhookTestResults, setWebhookTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  // Enterprise Role Directory & Email Mapping Engine State (Sub-Phase 4.4)
  // Loaded here because the Email tab also shows the directory's staff count.
  const [directoryEntries, setDirectoryEntries] = useState<any[]>([]);
  const [directorySummary, setDirectorySummary] = useState<DirectorySummary>({
    owners: 0,
    planners: 0,
    staff: 0,
    viewers: 0,
  });
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);

  const repo = getRepository();

  const loadDirectory = async () => {
    setIsLoadingDirectory(true);
    try {
      const entries = await RoleDirectoryService.getDirectoryStaff();
      setDirectoryEntries(entries as any);
      setDirectorySummary({
        owners: entries.filter((e) => e.role === 'OWNER').length,
        planners: entries.filter((e) => e.role === 'PLANNER' || (e.role === 'EDITOR' && e.isManager)).length,
        staff: entries.filter((e) => e.type === 'NURSE' || e.type === 'DOCTOR' || e.role === 'STAFF').length,
        viewers: entries.filter((e) => e.role === 'VIEWER' && e.type !== 'NURSE' && e.type !== 'DOCTOR').length,
      });
    } catch (err) {
      console.warn('Could not load the staff directory:', err);
    } finally {
      setIsLoadingDirectory(false);
    }
  };

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
          workingDays: targetClinic.workingDays || [true, true, true, true, true, true, true],
          weekendDays: targetClinic.weekendDays || getWeekendDays(),
          openTime: targetClinic.openTime || '09:00',
          closeTime: targetClinic.closeTime || '21:00',
          defaultBlockWeeks: targetClinic.defaultBlockWeeks || 2,
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
        if (showNotification) {
          notify(`Failed to save clinic profile: ${err.message}`, 'error');
        }
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

  // --- Webhooks & ChatOps Handlers ---
  // Note: no tab currently renders a webhook editor, so these are not wired to any UI.
  const handleToggleWebhooksEnabled = (enabled: boolean) => {
    if (!clinic) return;
    const currentConfig: WebhookConfig = clinic.webhookConfig || { enabled: false, endpoints: [] };
    const nextConfig: WebhookConfig = {
      ...currentConfig,
      enabled,
    };
    updateClinicField({ webhookConfig: nextConfig }, true);
  };

  const handleAddWebhookEndpoint = () => {
    if (!clinic) return;
    const currentConfig: WebhookConfig = clinic.webhookConfig || { enabled: true, endpoints: [] };
    const newEndpoint: WebhookEndpoint = {
      id: `wh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `Alerts Channel #${(currentConfig.endpoints?.length || 0) + 1}`,
      platform: 'SLACK',
      url: '',
      enabled: true,
      events: {
        rosterPublished: true,
        shiftSwapFinalized: true,
        severeViolationDetected: true,
      },
    };
    const nextConfig: WebhookConfig = {
      ...currentConfig,
      enabled: true,
      endpoints: [...(currentConfig.endpoints || []), newEndpoint],
    };
    updateClinicField({ webhookConfig: nextConfig }, true);
  };

  const handleUpdateWebhookEndpoint = (id: string, updates: Partial<WebhookEndpoint>) => {
    if (!clinic || !clinic.webhookConfig) return;
    const endpoints = (clinic.webhookConfig.endpoints || []).map((ep) =>
      ep.id === id ? { ...ep, ...updates } : ep
    );
    updateClinicField({ webhookConfig: { ...clinic.webhookConfig, endpoints } }, true);
  };

  const handleRemoveWebhookEndpoint = (id: string) => {
    if (!clinic || !clinic.webhookConfig) return;
    const endpoints = (clinic.webhookConfig.endpoints || []).filter((ep) => ep.id !== id);
    updateClinicField({ webhookConfig: { ...clinic.webhookConfig, endpoints } }, true);
  };

  const handleTestWebhook = async (endpoint: WebhookEndpoint) => {
    setTestingWebhookId(endpoint.id);
    setWebhookTestResults((prev) => ({
      ...prev,
      [endpoint.id]: { success: false, message: 'Testing dispatch...' },
    }));
    try {
      const res = await fetch('/api/webhook/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authService.getToken() || ''}`,
        },
        body: JSON.stringify({ endpoint }),
      });
      const json = await res.json();
      if (json.data && json.data.success) {
        setWebhookTestResults((prev) => ({
          ...prev,
          [endpoint.id]: {
            success: true,
            message: `Connected successfully! (HTTP ${json.data.statusCode || 200})`,
          },
        }));
      } else {
        setWebhookTestResults((prev) => ({
          ...prev,
          [endpoint.id]: {
            success: false,
            message: json.data?.error || json.message || 'Connection failed',
          },
        }));
      }
    } catch (err: any) {
      setWebhookTestResults((prev) => ({
        ...prev,
        [endpoint.id]: { success: false, message: err.message || 'Network error' },
      }));
    } finally {
      setTestingWebhookId(null);
    }
  };

  // --- 9. Hours Policy Auto-Save & Bidirectional Sync ---
  const [hoursPolicySaveStatus, setHoursPolicySaveStatus] = useState<SaveStatus>('saved');
  const hoursPolicyDebounceTimerRef = useRef<any>(null);
  const latestHoursPolicyRef = useRef<HoursPolicyConfig>(hoursPolicy);
  latestHoursPolicyRef.current = hoursPolicy;

  // Rules tab: a rule value that mirrors an hours policy field was changed.
  const syncHoursPolicyFromRule = (updates: Partial<HoursPolicyConfig>) => {
    const nextPolicy = { ...latestHoursPolicyRef.current, ...updates };
    setHoursPolicy(nextPolicy);
    latestHoursPolicyRef.current = nextPolicy;
    localStorage.setItem('clinic_roster_hours_policy', JSON.stringify(nextPolicy));
  };

  const persistHoursPolicy = useCallback(
    async (policyToSave: HoursPolicyConfig, showNotification = false) => {
      try {
        setHoursPolicySaveStatus('saving');
        localStorage.setItem('clinic_roster_hours_policy', JSON.stringify(policyToSave));

        // Sync rules in repository and in local rules state
        try {
          const allRules = await repo.list('rules');
          const h2 = allRules.find(
            (r) =>
              r.id === 'rule-h2' ||
              r.templateKey === 'MAX_CONSECUTIVE_DAYS' ||
              r.metric === 'CONSECUTIVE_WORKING_DAYS'
          );
          if (h2 && h2.value !== policyToSave.maxConsecutiveDays) {
            await repo.update('rules', h2.id, { value: policyToSave.maxConsecutiveDays });
            setRules((prev) =>
              prev.map((r) => (r.id === h2.id ? { ...r, value: policyToSave.maxConsecutiveDays } : r))
            );
          }

          const h3 = allRules.find((r) => r.id === 'rule-h3' || r.templateKey === 'MIN_REST_HOURS');
          if (h3 && h3.value !== policyToSave.minRestBetweenDuties) {
            await repo.update('rules', h3.id, { value: policyToSave.minRestBetweenDuties });
            setRules((prev) =>
              prev.map((r) => (r.id === h3.id ? { ...r, value: policyToSave.minRestBetweenDuties } : r))
            );
          }

          const h4 = allRules.find((r) => r.id === 'rule-h4' || r.templateKey === 'MAX_DUTIES_PER_DAY');
          if (h4 && h4.value !== policyToSave.maxDutiesPerDay) {
            await repo.update('rules', h4.id, { value: policyToSave.maxDutiesPerDay });
            setRules((prev) =>
              prev.map((r) => (r.id === h4.id ? { ...r, value: policyToSave.maxDutiesPerDay } : r))
            );
          }
        } catch (ruleErr) {
          console.warn('Could not sync rules with hours policy:', ruleErr);
        }

        setHoursPolicySaveStatus('saved');
        if (showNotification) {
          triggerSaveNotification('Hours policy configuration saved permanently.');
        }
      } catch (err) {
        console.error('Failed to save hours policy:', err);
        setHoursPolicySaveStatus('error');
      }
    },
    [repo]
  );

  const updateHoursPolicyField = useCallback(
    (updates: Partial<HoursPolicyConfig>, immediate = false) => {
      const nextPolicy = { ...latestHoursPolicyRef.current, ...updates };
      setHoursPolicy(nextPolicy);
      latestHoursPolicyRef.current = nextPolicy;
      setHoursPolicySaveStatus('saving');

      if (hoursPolicyDebounceTimerRef.current) {
        clearTimeout(hoursPolicyDebounceTimerRef.current);
        hoursPolicyDebounceTimerRef.current = null;
      }

      if (immediate) {
        persistHoursPolicy(nextPolicy);
      } else {
        hoursPolicyDebounceTimerRef.current = setTimeout(() => {
          persistHoursPolicy(nextPolicy);
        }, 500);
      }
    },
    [persistHoursPolicy]
  );

  const flushHoursPolicySave = useCallback(() => {
    if (hoursPolicyDebounceTimerRef.current) {
      clearTimeout(hoursPolicyDebounceTimerRef.current);
      hoursPolicyDebounceTimerRef.current = null;
    }
    persistHoursPolicy(latestHoursPolicyRef.current);
  }, [persistHoursPolicy]);

  const handleSaveHoursPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    flushHoursPolicySave();
    triggerSaveNotification('Hours policy configuration saved permanently.');
  };

  // --- 10. Email Settings Auto-Save ---
  const [emailSaveStatus, setEmailSaveStatus] = useState<SaveStatus>('saved');
  const emailDebounceTimerRef = useRef<any>(null);
  const latestEmailConfigRef = useRef<EmailSettingsConfig>(emailConfig);
  latestEmailConfigRef.current = emailConfig;

  const persistEmailConfig = useCallback(
    (configToSave: EmailSettingsConfig, showNotification = false) => {
      try {
        setEmailSaveStatus('saving');
        localStorage.setItem('clinic_roster_email_config', JSON.stringify(configToSave));
        setEmailSaveStatus('saved');
        if (showNotification) {
          triggerSaveNotification('Email settings updated and saved.');
        }
      } catch (err) {
        console.error('Failed to save email config:', err);
        setEmailSaveStatus('error');
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

    // 2. Flush Hours Policy only if timer is active
    if (hoursPolicyDebounceTimerRef.current) {
      clearTimeout(hoursPolicyDebounceTimerRef.current);
      hoursPolicyDebounceTimerRef.current = null;
      if (latestHoursPolicyRef.current) {
        persistHoursPolicy(latestHoursPolicyRef.current);
      }
    }

    // 3. Flush Email Settings only if timer is active
    if (emailDebounceTimerRef.current) {
      clearTimeout(emailDebounceTimerRef.current);
      emailDebounceTimerRef.current = null;
      if (latestEmailConfigRef.current) {
        persistEmailConfig(latestEmailConfigRef.current);
      }
    }
  }, [persistClinicProfile, persistHoursPolicy, persistEmailConfig]);

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

  useEffect(() => {
    loadDirectory();
  }, []);

  useEffect(() => {
    if (activeTab === 'directory') {
      loadDirectory();
    }
  }, [activeTab]);

  const currentUser = authService.getCurrentUser();
  const isMasterAdmin = currentUser?.email?.toLowerCase() === 'rolandabj@gmail.com' || currentUser?.role === 'OWNER';

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    ...(isMasterAdmin
      ? [{ id: 'access-roles' as SettingsTab, label: 'Access & Permissions', icon: ShieldCheck }]
      : []),
    { id: 'clinic', label: 'Clinic', icon: Building2 },
    { id: 'directory', label: 'Enterprise Directory & SSO', icon: Users },
    { id: 'duties', label: 'Duties', icon: Clock },
    { id: 'leave', label: 'Leave', icon: CalendarCheck },
    { id: 'seniority', label: 'Seniority', icon: Shield },
    { id: 'clinical-roles', label: 'Clinical Roles', icon: Stethoscope },
    { id: 'specialties', label: 'Specialties', icon: Tags },
    { id: 'rules', label: 'Rules', icon: Sliders },
    { id: 'holidays', label: 'Public Holidays', icon: Flag },
    { id: 'hours-policy', label: 'Hours Policy', icon: Calculator },
    { id: 'working-hours-periods', label: 'Dedicated Time Periods', icon: CalendarRange },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'integrations', label: 'Integrations', icon: Cloud },
    { id: 'database', label: 'Database & Storage', icon: Database },
  ];

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinic Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure clinic operating parameters, acceptable duties, leave rules, seniority ranks, public holidays, hours policy, and cloud integrations.
          </p>
        </div>
      </div>

      {/* Tab Navigation Ribbon */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1 pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-xs">
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

        {/* 2. ENTERPRISE DIRECTORY & GOOGLE SSO (Sub-Phase 4.4) */}
        {activeTab === 'directory' && (
          <DirectoryTab
            directoryEntries={directoryEntries}
            directorySummary={directorySummary}
            isLoadingDirectory={isLoadingDirectory}
            loadDirectory={loadDirectory}
          />
        )}

        {/* 3. DUTY WINDOWS ("acceptable duty") */}
        {activeTab === 'duties' && (
          <DutiesTab duties={duties} loadData={loadData} triggerSaveNotification={triggerSaveNotification} />
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

        {/* 5. CLINICAL ROLES */}
        {activeTab === 'clinical-roles' && (
          <ClinicalRolesTab
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
            syncHoursPolicyFromRule={syncHoursPolicyFromRule}
          />
        )}

        {/* 8. PUBLIC HOLIDAYS */}
        {activeTab === 'holidays' && (
          <HolidaysTab holidays={holidays} loadData={loadData} triggerSaveNotification={triggerSaveNotification} />
        )}

        {/* 9. HOURS POLICY */}
        {activeTab === 'hours-policy' && (
          <HoursPolicyTab
            hoursPolicy={hoursPolicy}
            hoursPolicySaveStatus={hoursPolicySaveStatus}
            updateHoursPolicyField={updateHoursPolicyField}
            flushHoursPolicySave={flushHoursPolicySave}
            handleSaveHoursPolicy={handleSaveHoursPolicy}
            setActiveTab={setActiveTab}
          />
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
            directorySummary={directorySummary}
          />
        )}

        {/* 11. INTEGRATIONS (FIREBASE LOCAL / CLOUD SWITCH) */}
        {activeTab === 'integrations' && <IntegrationsTab />}

        {/* 12. DATABASE & STORAGE MANAGEMENT */}
        {activeTab === 'database' && (
          <DatabaseTab loadData={loadData} triggerSaveNotification={triggerSaveNotification} />
        )}
      </div>
    </div>
  );
};
