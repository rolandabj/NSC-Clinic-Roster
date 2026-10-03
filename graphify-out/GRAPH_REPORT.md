# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 163 files · ~203,282 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .example 1, (none) 1, .lock 1)

## Summary
- 1227 nodes · 4590 edges · 49 communities (45 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 118 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `28fca584`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- getRepository
- hoursAccounting.ts
- clinicModel.test.ts
- PublishView.tsx
- WorkingHoursPeriodsPanel.tsx
- useDialogA11y
- authService
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- authService.ts
- App.tsx
- EntityForCollection
- DashboardView.tsx
- IRepository
- firebaseIdentityService.ts
- Sidebar.tsx
- compilerOptions
- PublishedRosterView.tsx
- quotaTracker
- FirestoreRepository
- devDependencies
- IRepository.ts
- LiveCollectionCache
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- nurseRosterService.ts
- NSC Clinic Roster: complete project guide
- yearToDate.ts
- makeNurse
- fixtures.ts
- ref_node_assert
- yearFairness.test.ts
- makeSchedule
- hoursRules.test.ts
- preferenceFocus.test.ts
- explainCell.test.ts
- CreateScheduleModal.tsx
- calendar.ts
- preferenceOrder.ts
- newRosterDates.ts
- AssignmentKind
- IsoDateString

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 86 edges
2. `Nurse` - 75 edges
3. `Assignment` - 73 edges
4. `DutyWindow` - 72 edges
5. `Schedule` - 72 edges
6. `react` - 69 edges
7. `useDialogA11y()` - 62 edges
8. `lucide-react` - 61 edges
9. `ClinicalRole` - 61 edges
10. `notify()` - 59 edges

## Surprising Connections (you probably didn't know these)
- `How a run works` --references--> `applyPreferenceFocus()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/preferenceOrder.ts
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx

## Import Cycles
- None detected.

## Communities (49 total, 4 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.05
Nodes (145): 5. Data model (Firestore collections), MenuButton(), MenuButtonProps, MenuItem, BulkImportModalProps, EditDoctorShiftModalProps, TIME_PRESETS, ExportModalProps (+137 more)

### Community 1 - "getRepository"
Cohesion: 0.05
Nodes (102): 7. Rules, lucide-react, react, uuid, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost() (+94 more)

### Community 2 - "hoursAccounting.ts"
Cohesion: 0.06
Nodes (70): 10. Hours, jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES (+62 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.10
Nodes (37): 12. Publishing and nurse links, nodemailer, Request, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload (+29 more)

### Community 5 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.28
Nodes (10): WorkingHoursPeriodsPanelProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+2 more)

### Community 6 - "useDialogA11y"
Cohesion: 0.07
Nodes (53): 13. Screens in detail, openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, EditDoctorShiftModal() (+45 more)

### Community 7 - "authService"
Cohesion: 0.14
Nodes (4): authorizedFetch(), authService, computePrivileges(), getAppAuth()

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (26): firebase, name, private, type, version, autoprefixer, cors, date-fns (+18 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (23): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+15 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (14): express, express-rate-limit, helmet, startServer(), authMiddleware(), AuthUser, BackendRole, Express (+6 more)

### Community 13 - "authService.ts"
Cohesion: 0.13
Nodes (20): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps (+12 more)

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.14
Nodes (8): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection, now

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (23): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+15 more)

### Community 17 - "IRepository"
Cohesion: 0.09
Nodes (21): 11. Saving, live updates, versions, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository, deleteEntireSchedule() (+13 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.13
Nodes (19): 3. Users, roles and access, NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps (+11 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "PublishedRosterView.tsx"
Cohesion: 0.12
Nodes (24): RFC-5545, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, WEEKDAY_NAMES, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText() (+16 more)

### Community 22 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "IRepository.ts"
Cohesion: 0.20
Nodes (8): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, FirebaseClientConfig, SubscribeCallback, Unsubscribe, CollectionName

### Community 26 - "LiveCollectionCache"
Cohesion: 0.21
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.08
Nodes (24): STALE_MS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus, Invitation (+16 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (23): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), downloadIcsFile() (+15 more)

### Community 33 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.10
Nodes (21): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`) (+13 more)

### Community 34 - "yearToDate.ts"
Cohesion: 0.13
Nodes (21): YearToDate, YearToDateCounts, daysBefore(), findPreviousSchedule(), loadClinicSetup(), isLateDuty(), clamp(), KEYS (+13 more)

### Community 35 - "makeNurse"
Cohesion: 0.16
Nodes (10): 15. Tests, ctx(), EARLY, LATE, nurses(), makeLock(), makeNurse(), LATE (+2 more)

### Community 36 - "fixtures.ts"
Cohesion: 0.22
Nodes (8): ANNUAL_LEAVE, makeLeave(), SENIOR, UNPAID_LEAVE, DOCTOR, generateAll(), handEdit, leave()

### Community 37 - "ref_node_assert"
Cohesion: 0.19
Nodes (5): LATE, nurse, DAY_DUTY, generateWeek(), H2_KEYWORDS

### Community 38 - "yearFairness.test.ts"
Cohesion: 0.20
Nodes (7): SchedulingEngine, hoursOnlyRules(), LATE, run(), generate(), LATE, twoWeeks()

### Community 39 - "makeSchedule"
Cohesion: 0.24
Nodes (6): makeSchedule(), account(), EARLY, LATE, restFindings(), shifts

### Community 40 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 41 - "preferenceFocus.test.ts"
Cohesion: 0.22
Nodes (7): CARD, doctorOfAmy(), KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 42 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 43 - "CreateScheduleModal.tsx"
Cohesion: 0.43
Nodes (6): CreateScheduleModal(), CreateScheduleModalProps, WorkingHoursCalculationResult, generateDoctorSessionsForDateRange(), populateRecurringDoctorSessionsForSchedule(), BlockWeeks

### Community 44 - "calendar.ts"
Cohesion: 0.53
Nodes (4): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument()

### Community 45 - "preferenceOrder.ts"
Cohesion: 0.40
Nodes (5): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus

### Community 46 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

## Knowledge Gaps
- **307 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+302 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 377 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `SchedulesView.tsx`, `NSC Clinic Roster: complete project guide`, `hoursAccounting.ts`, `nurseRosterService.ts`, `PublishView.tsx`, `WorkingHoursPeriodsPanel.tsx`, `useDialogA11y`, `package.json`, `AppShell.tsx`, `CreateScheduleModal.tsx`, `authService.ts`, `App.tsx`, `DashboardView.tsx`, `Sidebar.tsx`, `PublishedRosterView.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `SchedulesView.tsx`, `nurseRosterService.ts`, `hoursAccounting.ts`, `PublishView.tsx`, `WorkingHoursPeriodsPanel.tsx`, `useDialogA11y`, `package.json`, `AppShell.tsx`, `CreateScheduleModal.tsx`, `authService.ts`, `App.tsx`, `DashboardView.tsx`, `Sidebar.tsx`, `PublishedRosterView.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `getRepository()` connect `getRepository` to `SchedulesView.tsx`, `nurseRosterService.ts`, `hoursAccounting.ts`, `PublishView.tsx`, `WorkingHoursPeriodsPanel.tsx`, `useDialogA11y`, `CreateScheduleModal.tsx`, `DashboardView.tsx`, `IRepository`, `Sidebar.tsx`, `PublishedRosterView.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _307 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05498050813281355 - nodes in this community are weakly interconnected._
- **Should `getRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.05336832895888014 - nodes in this community are weakly interconnected._
- **Should `hoursAccounting.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05909351692484223 - nodes in this community are weakly interconnected._