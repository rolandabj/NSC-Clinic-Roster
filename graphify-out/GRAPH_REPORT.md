# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 181 files · ~223,127 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1341 nodes · 4903 edges · 67 communities (59 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 120 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2025d5e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- getRepository
- ExportModal.tsx
- clinicModel.test.ts
- useDialogA11y
- WorkingHoursPeriodsPanel.tsx
- AvailabilityView.tsx
- quotaTracker
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- authService
- App.tsx
- EntityForCollection
- DashboardView.tsx
- seedRunner.ts
- firebaseIdentityService.ts
- Sidebar.tsx
- compilerOptions
- yearToDate.ts
- ClinicContextState
- FirestoreRepository
- devDependencies
- DoctorsView.tsx
- SchedulesView.tsx
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- PublishView.tsx
- RulesTab.tsx
- requestFindings.test.ts
- analysisExport.test.ts
- What You Must Do When Invoked
- emailService.ts
- makeNurse
- ref_node_assert
- fixtures.ts
- preferenceFocus.test.ts
- LiveCollectionCache
- nurseClinicFloat.test.ts
- IRepository.ts
- QuickCellPopup.tsx
- IRepository
- WorkbookGrid.tsx
- SchedulingEngine.ts
- explainCell.test.ts
- NSC Clinic Roster: complete project guide
- react
- graphify reference: extra exports and benchmark
- lastResort.test.ts
- hoursPolicy.ts
- weekend.ts
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ShareModal.tsx
- diffEngine.ts

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 86 edges
2. `Assignment` - 79 edges
3. `Nurse` - 77 edges
4. `DutyWindow` - 75 edges
5. `Schedule` - 74 edges
6. `react` - 69 edges
7. `ClinicalRole` - 63 edges
8. `useDialogA11y()` - 62 edges
9. `Doctor` - 62 edges
10. `lucide-react` - 61 edges

## Surprising Connections (you probably didn't know these)
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts

## Import Cycles
- None detected.

## Communities (67 total, 8 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.17
Nodes (56): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, ProposedSwap, PublishModalProps, ShareModalProps (+48 more)

### Community 1 - "getRepository"
Cohesion: 0.13
Nodes (45): confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), NursesView(), ClinicTab(), ClinicTabProps, DatabaseTabProps (+37 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.08
Nodes (50): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps (+42 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "useDialogA11y"
Cohesion: 0.15
Nodes (23): useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, fmtHours(), NurseTimesheetModal(), SOURCE_LABELS (+15 more)

### Community 5 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.25
Nodes (12): WorkingHoursPeriodsPanel(), WorkingHoursPeriodsPanelProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate() (+4 more)

### Community 6 - "AvailabilityView.tsx"
Cohesion: 0.21
Nodes (19): ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, NurseSelfServicePanel(), leaveCreditInRange(), cancelAvailabilityRequest(), cancelLeaveRequest(), countPendingApprovals() (+11 more)

### Community 7 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (24): firebase, name, private, type, version, autoprefixer, cors, date-fns (+16 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.14
Nodes (24): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+16 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.11
Nodes (21): express, express-rate-limit, helmet, vite, startServer(), authMiddleware(), AuthUser, BackendRole (+13 more)

### Community 13 - "authService"
Cohesion: 0.11
Nodes (10): authorizedFetch(), authService, computePrivileges(), defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp() (+2 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (11): react-dom, App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.13
Nodes (10): 11. Saving, live updates, versions, computeScheduleDiff(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+2 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.12
Nodes (29): 3. Users, roles and access, Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId() (+21 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.21
Nodes (17): DatabaseTab(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+9 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (15): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, canAccessRoute() (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (24): YearToDate, YearToDateCounts, daysBefore(), findPreviousSchedule(), loadClinicSetup(), consecutiveLateRuleOf(), isLateDuty(), lateDutyThreshold() (+16 more)

### Community 22 - "ClinicContextState"
Cohesion: 0.12
Nodes (20): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps (+12 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "DoctorsView.tsx"
Cohesion: 0.19
Nodes (18): 13. Screens in detail, BulkImportModal(), CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView(), WEEKDAY_NAMES (+10 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (28): MenuButton(), MenuButtonProps, MenuItem, FairnessModal(), SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId() (+20 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.05
Nodes (40): CellChoice, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, InternalSlot, othersOnRoster(), STALE_MS, TAB_ID (+32 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "PublishView.tsx"
Cohesion: 0.06
Nodes (65): RFC-5545, 12. Publishing and nurse links, calendarRouter, EmailHtmlPreview(), PublishModal(), Step, DayEntry, LoadState (+57 more)

### Community 33 - "RulesTab.tsx"
Cohesion: 0.11
Nodes (28): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+20 more)

### Community 34 - "requestFindings.test.ts"
Cohesion: 0.14
Nodes (8): ScheduleValidator, SENIOR, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 35 - "analysisExport.test.ts"
Cohesion: 0.14
Nodes (14): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+6 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "emailService.ts"
Cohesion: 0.21
Nodes (10): nodemailer, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult, ServerEmailConfig (+2 more)

### Community 38 - "makeNurse"
Cohesion: 0.19
Nodes (15): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+7 more)

### Community 39 - "ref_node_assert"
Cohesion: 0.17
Nodes (6): ctx(), EARLY, LATE, LATE, nurse, DAY_DUTY

### Community 40 - "fixtures.ts"
Cohesion: 0.21
Nodes (9): ANNUAL_LEAVE, UNPAID_LEAVE, D, E, L, NC, PHL, SENIOR (+1 more)

### Community 41 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "IRepository.ts"
Cohesion: 0.21
Nodes (8): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS, CollectionName

### Community 45 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 46 - "IRepository"
Cohesion: 0.21
Nodes (6): fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository, DeleteDoctorShiftParams, PopulateRecurringDoctorSessionsParams

### Community 47 - "WorkbookGrid.tsx"
Cohesion: 0.14
Nodes (25): 10. Hours, cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso(), SOURCE_WORDS, WEEKDAY_ABBR, withDr() (+17 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.12
Nodes (41): bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes() (+33 more)

### Community 49 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 50 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.09
Nodes (22): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 7. Rules (+14 more)

### Community 51 - "react"
Cohesion: 0.14
Nodes (21): lucide-react, react, uuid, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice() (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 54 - "hoursPolicy.ts"
Cohesion: 0.32
Nodes (7): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditPerDay(), leaveDaysInRange()

### Community 55 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 56 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 57 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 58 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 59 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 65 - "ShareModal.tsx"
Cohesion: 0.52
Nodes (6): ShareModal(), TabType, ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster()

### Community 66 - "diffEngine.ts"
Cohesion: 0.33
Nodes (5): AssignmentDiffItem, ChangeType, formatAssignment(), FormattedAssignmentState, WEEKDAY_NAMES

## Knowledge Gaps
- **372 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+367 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 455 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `getRepository`, `ExportModal.tsx`, `useDialogA11y`, `WorkingHoursPeriodsPanel.tsx`, `AvailabilityView.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `Sidebar.tsx`, `ClinicContextState`, `DoctorsView.tsx`, `SchedulesView.tsx`, `types/index.ts`, `PublishView.tsx`, `RulesTab.tsx`, `QuickCellPopup.tsx`, `WorkbookGrid.tsx`, `NSC Clinic Roster: complete project guide`, `ShareModal.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `getRepository`, `ExportModal.tsx`, `useDialogA11y`, `WorkingHoursPeriodsPanel.tsx`, `AvailabilityView.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `Sidebar.tsx`, `ClinicContextState`, `DoctorsView.tsx`, `SchedulesView.tsx`, `PublishView.tsx`, `RulesTab.tsx`, `QuickCellPopup.tsx`, `WorkbookGrid.tsx`, `ShareModal.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `NSC Clinic Roster: complete project guide` connect `NSC Clinic Roster: complete project guide` to `PublishView.tsx`, `Assignment`, `analysisExport.test.ts`, `AppShell.tsx`, `EntityForCollection`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `DoctorsView.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _372 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.12525252525252525 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0771478667445938 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._