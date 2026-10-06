# Graph Report - NSC-Clinic-Roster  (2026-10-06)

## Corpus Check
- 202 files · ~252,402 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1495 nodes · 5516 edges · 69 communities (62 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 140 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6b439a2b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- ExportModal.tsx
- SchedulingEngine.ts
- clinicModel.test.ts
- nurseRosterService.ts
- authService.ts
- SettingsView.tsx
- authService
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- AvailabilityView.tsx
- App.tsx
- EntityForCollection
- DashboardView.tsx
- seedRunner.ts
- firebaseIdentityService.ts
- react
- compilerOptions
- RulesTab.tsx
- scheduleRanges.ts
- FirestoreRepository
- devDependencies
- PublishView.tsx
- ref_node_assert
- IRepository
- scripts
- types/index.ts
- FirestoreRepository.ts
- dateFormatter.ts
- lastResort.test.ts
- CreateScheduleModal.tsx
- HistoryView.tsx
- icsExportService.ts
- What You Must Do When Invoked
- LiveCollectionCache
- fixtures.ts
- hoursTopUp.test.ts
- getRepository
- makeNurse
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- createApiApp
- SchedulesView.tsx
- explainCell.test.ts
- server.ts
- hoursBalance.ts
- WorkbookGrid.tsx
- graphify reference: extra exports and benchmark
- continuousHours.test.ts
- quotaTracker
- I18nManager
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- approvedDayOff.test.ts
- requestFindings.test.ts
- Sidebar.tsx
- hoursAccounting.ts
- QuickCellPopup.tsx
- README.md

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 93 edges
2. `Assignment` - 84 edges
3. `Schedule` - 81 edges
4. `Nurse` - 80 edges
5. `DutyWindow` - 78 edges
6. `react` - 72 edges
7. `useDialogA11y()` - 64 edges
8. `lucide-react` - 63 edges
9. `ClinicalRole` - 63 edges
10. `Doctor` - 62 edges

## Surprising Connections (you probably didn't know these)
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts
- `4. Navigation and app shell` --references--> `AppShell()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/layout/AppShell.tsx

## Import Cycles
- None detected.

## Communities (69 total, 7 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.12
Nodes (76): 5. Data model (Firestore collections), Request, BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseFairnessMetrics, ProposedSwap (+68 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (41): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+33 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.12
Nodes (42): 6. Clinic model (the business rules in plain English), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+34 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.11
Nodes (35): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+27 more)

### Community 5 - "authService.ts"
Cohesion: 0.13
Nodes (21): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailView(), AuditTrailViewProps (+13 more)

### Community 6 - "SettingsView.tsx"
Cohesion: 0.11
Nodes (42): ClinicTab(), ClinicTabProps, DatabaseTab(), DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab() (+34 more)

### Community 7 - "authService"
Cohesion: 0.08
Nodes (13): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, othersOnRoster() (+5 more)

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (21): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.17
Nodes (12): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+4 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.11
Nodes (39): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+31 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.15
Nodes (8): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, CollectionName, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.20
Nodes (20): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+12 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.14
Nodes (14): toScheduleRange(), SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+6 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "react"
Cohesion: 0.14
Nodes (29): lucide-react, react, uuid, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState (+21 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): 7. Rules, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef (+15 more)

### Community 22 - "scheduleRanges.ts"
Cohesion: 0.47
Nodes (8): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap

### Community 23 - "FirestoreRepository"
Cohesion: 0.36
Nodes (3): 11. Saving, live updates, versions, FirestoreRepository, sanitizePayload()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishView.tsx"
Cohesion: 0.07
Nodes (44): 12. Publishing and nurse links, nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail() (+36 more)

### Community 26 - "ref_node_assert"
Cohesion: 0.10
Nodes (12): ctx(), EARLY, LATE, LATE, nurse, DAY_DUTY, nurses, published (+4 more)

### Community 27 - "IRepository"
Cohesion: 0.25
Nodes (3): repositoryManager, IRepository, PopulateRecurringDoctorSessionsParams

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.06
Nodes (33): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind (+25 more)

### Community 30 - "FirestoreRepository.ts"
Cohesion: 0.19
Nodes (7): FirebaseClientConfig, SubscribeCallback, Unsubscribe, ScheduleRange, apps, { initializeTestEnvironment }, requireRules

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "lastResort.test.ts"
Cohesion: 0.11
Nodes (14): isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES, DR_PCC (+6 more)

### Community 33 - "CreateScheduleModal.tsx"
Cohesion: 0.12
Nodes (28): CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, earlierPeriodTotals(), calculateWorkingHoursForDateRange() (+20 more)

### Community 34 - "HistoryView.tsx"
Cohesion: 0.07
Nodes (43): DeleteScheduleModal(), DeleteVersionModal(), FairnessModal(), VersionCompareModal(), VersionViewModal(), HistoryView(), WEEKDAY_NAMES, nurseClinicRoleOf() (+35 more)

### Community 35 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 38 - "fixtures.ts"
Cohesion: 0.12
Nodes (20): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+12 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "getRepository"
Cohesion: 0.57
Nodes (7): ShareModal(), TabType, ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster(), getRepository()

### Community 41 - "makeNurse"
Cohesion: 0.14
Nodes (18): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+10 more)

### Community 42 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.07
Nodes (28): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+20 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 45 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (26): 4. Navigation and app shell, MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId() (+18 more)

### Community 46 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (25): 10. Hours, activeCarry(), closePeriod(), countedEarlierRosters(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+17 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.15
Nodes (25): CellChoice, cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso(), SOURCE_WORDS, WEEKDAY_ABBR, withDr() (+17 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 54 - "quotaTracker"
Cohesion: 0.14
Nodes (8): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

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

### Community 60 - "NSC Clinic Roster"
Cohesion: 0.50
Nodes (3): Always, with every change (owner's standing instruction), graphify, NSC Clinic Roster

### Community 65 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 66 - "requestFindings.test.ts"
Cohesion: 0.14
Nodes (8): ScheduleValidator, SENIOR, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 70 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (14): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, DICTIONARY (+6 more)

### Community 71 - "hoursAccounting.ts"
Cohesion: 0.15
Nodes (24): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField, TabMode (+16 more)

### Community 75 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

## Knowledge Gaps
- **432 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+427 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 530 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `ExportModal.tsx`, `nurseRosterService.ts`, `authService.ts`, `SettingsView.tsx`, `authService`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `PublishView.tsx`, `ref_node_assert`, `CreateScheduleModal.tsx`, `HistoryView.tsx`, `getRepository`, `NSC Clinic Roster: complete project guide`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `Sidebar.tsx`, `hoursAccounting.ts`, `QuickCellPopup.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `ExportModal.tsx`, `nurseRosterService.ts`, `authService.ts`, `SettingsView.tsx`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `PublishView.tsx`, `CreateScheduleModal.tsx`, `HistoryView.tsx`, `getRepository`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `Sidebar.tsx`, `hoursAccounting.ts`, `QuickCellPopup.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `getRepository()` connect `getRepository` to `Assignment`, `CreateScheduleModal.tsx`, `ExportModal.tsx`, `HistoryView.tsx`, `nurseRosterService.ts`, `authService.ts`, `SettingsView.tsx`, `hoursAccounting.ts`, `authService`, `SchedulesView.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `react`, `RulesTab.tsx`, `FirestoreRepository`, `PublishView.tsx`, `IRepository`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _432 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.11542390194075587 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09929078014184398 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11843137254901961 - nodes in this community are weakly interconnected._