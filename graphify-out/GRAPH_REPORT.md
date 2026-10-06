# Graph Report - NSC-Clinic-Roster  (2026-10-06)

## Corpus Check
- 213 files · ~261,199 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1562 nodes · 5751 edges · 77 communities (71 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 155 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cd5d53f2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- ExportModal.tsx
- SchedulingEngine.ts
- clinicModel.test.ts
- nurseRosterService.ts
- ClinicContextState
- notify
- authService.ts
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
- dialogs.tsx
- compilerOptions
- RulesTab.tsx
- IRepository.ts
- FirestoreRepository
- devDependencies
- PublishModal.tsx
- ReportsView.tsx
- IRepository
- scripts
- types/index.ts
- scheduleTransactions.test.ts
- dateFormatter.ts
- sharing.test.ts
- CreateScheduleModal.tsx
- analysisExportService.ts
- SettingsView.tsx
- What You Must Do When Invoked
- LiveCollectionCache
- fixtures.ts
- hoursTopUp.test.ts
- publicRosterService.ts
- makeSchedule
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- createApiApp
- SchedulesView.tsx
- makeNurse
- server.ts
- hoursBalance.ts
- WorkbookGrid.tsx
- savingSafety.test.ts
- react
- graphify reference: extra exports and benchmark
- continuousHours.test.ts
- icsExportService.ts
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
- navigation.ts
- PublishedRosterView.tsx
- repository/index.ts
- ref_node_assert
- preferenceFocus.test.ts
- HistoryView.tsx
- lastResort.test.ts
- shiftIds.test.ts
- engineRules.test.ts
- getRepository
- README.md

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 95 edges
2. `Assignment` - 91 edges
3. `Schedule` - 84 edges
4. `DutyWindow` - 80 edges
5. `Nurse` - 80 edges
6. `react` - 72 edges
7. `useDialogA11y()` - 64 edges
8. `lucide-react` - 63 edges
9. `ClinicalRole` - 63 edges
10. `Doctor` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `11. Saving, live updates, versions` --references--> `signOutSafely()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/signOut.ts

## Import Cycles
- None detected.

## Communities (77 total, 6 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.21
Nodes (50): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, ProposedSwap, PublishModalProps, SwapManagerModalProps (+42 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (40): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, analysisFileName() (+32 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (42): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+34 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (29): dateLabel(), PublishedRosterSheet(), ViewerData, DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView() (+21 more)

### Community 5 - "ClinicContextState"
Cohesion: 0.11
Nodes (22): LoginPageProps, signOutSafely(), AppShellProps, TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, AllRequestsPanelProps (+14 more)

### Community 6 - "notify"
Cohesion: 0.16
Nodes (29): confirmDialog(), notify(), DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab(), HolidaysTabProps (+21 more)

### Community 7 - "authService.ts"
Cohesion: 0.05
Nodes (23): authService, computePrivileges(), UserPrivileges, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider (+15 more)

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.13
Nodes (24): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+16 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.17
Nodes (13): express, express-rate-limit, helmet, authMiddleware(), BackendRole, Express, requireOwner, requirePlanner (+5 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.14
Nodes (30): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+22 more)

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (11): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+3 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.13
Nodes (8): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.17
Nodes (22): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+14 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.16
Nodes (14): ALL_COLLECTIONS, BackupCheck, clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup() (+6 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (21): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+13 more)

### Community 22 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 23 - "FirestoreRepository"
Cohesion: 0.25
Nodes (3): FirestoreRepository, sanitizePayload(), toScheduleRange()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.08
Nodes (48): 12. Publishing and nurse links, nodemailer, Request, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+40 more)

### Community 26 - "ReportsView.tsx"
Cohesion: 0.14
Nodes (23): fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), SortField, TabMode (+15 more)

### Community 27 - "IRepository"
Cohesion: 0.13
Nodes (14): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments() (+6 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.07
Nodes (27): CellChoice, isPairing(), PREFERENCE_FOCUS_LABELS, InternalSlot, ApprovalStatus, AssignmentKind, DoctorSessionSource, EmailLogKind (+19 more)

### Community 30 - "scheduleTransactions.test.ts"
Cohesion: 0.33
Nodes (3): apps, { initializeTestEnvironment }, requireRules

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 33 - "CreateScheduleModal.tsx"
Cohesion: 0.12
Nodes (28): CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, calculateWorkingHoursForDateRange(), findExactMatchingPeriod() (+20 more)

### Community 34 - "analysisExportService.ts"
Cohesion: 0.09
Nodes (40): FairnessModal(), NurseFairnessMetrics, ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, nurseClinicRoleOf(), resolveClinicSetup() (+32 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.22
Nodes (14): AccessManagementPanel(), ClinicTab(), ClinicTabProps, SaveStatus, SettingsTab, WEEKDAY_NAMES, SettingsView(), SettingsViewProps (+6 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.31
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 38 - "fixtures.ts"
Cohesion: 0.15
Nodes (19): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+11 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "publicRosterService.ts"
Cohesion: 0.31
Nodes (7): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster(), deleteEntireSchedule(), ScheduleDeleteResult

### Community 41 - "makeSchedule"
Cohesion: 0.11
Nodes (13): SchedulingEngine, clearYearToDateCache(), makeSchedule(), LATE, run(), EARLY, LATE, restFindings() (+5 more)

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
Cohesion: 0.13
Nodes (24): MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet() (+16 more)

### Community 46 - "makeNurse"
Cohesion: 0.11
Nodes (15): ctx(), EARLY, LATE, EARLY, input(), LATE, softHoursLimit, week (+7 more)

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "hoursBalance.ts"
Cohesion: 0.09
Nodes (35): 10. Hours, NurseTimesheetModalProps, activeCarry(), closePeriod(), earlierPeriodTotals(), HoursPart, HoursSchedule, Leftover (+27 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.15
Nodes (20): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, cellKeyOf() (+12 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.15
Nodes (6): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues

### Community 51 - "react"
Cohesion: 0.23
Nodes (14): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModalProps, ShareModal() (+6 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 54 - "icsExportService.ts"
Cohesion: 0.17
Nodes (17): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+9 more)

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

### Community 66 - "navigation.ts"
Cohesion: 0.15
Nodes (16): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, canAccessRoute() (+8 more)

### Community 67 - "PublishedRosterView.tsx"
Cohesion: 0.19
Nodes (11): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), buildTeamRosterSheet(), loadPublicRoster(), nurses, published (+3 more)

### Community 68 - "repository/index.ts"
Cohesion: 0.43
Nodes (5): DatabaseTab(), defaultFirebaseConfig, StorageMode, checkBackup(), getDatabaseStatistics()

### Community 69 - "ref_node_assert"
Cohesion: 0.16
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 70 - "preferenceFocus.test.ts"
Cohesion: 0.22
Nodes (7): CARD, doctorOfAmy(), KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 71 - "HistoryView.tsx"
Cohesion: 0.12
Nodes (25): DeleteScheduleModal(), DeleteVersionModal(), DeleteVersionModalProps, ShareModalProps, CHANGE_LABELS, VersionCompareModal(), SOURCE_LABELS, VersionViewModal() (+17 more)

### Community 72 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 73 - "shiftIds.test.ts"
Cohesion: 0.21
Nodes (9): moveShift(), swapShifts(), dates, doctors, fill(), LATE, nurses, schedule (+1 more)

### Community 74 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 75 - "getRepository"
Cohesion: 0.50
Nodes (8): NurseSelfServicePanel(), getRepository(), cancelAvailabilityRequest(), cancelLeaveRequest(), listMyRequests(), requireNurseId(), submitAvailabilityRequest(), submitLeaveRequest()

## Knowledge Gaps
- **446 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+441 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 559 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `ExportModal.tsx`, `nurseRosterService.ts`, `ClinicContextState`, `notify`, `authService.ts`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `dialogs.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `ReportsView.tsx`, `CreateScheduleModal.tsx`, `analysisExportService.ts`, `SettingsView.tsx`, `NSC Clinic Roster: complete project guide`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `navigation.ts`, `PublishedRosterView.tsx`, `repository/index.ts`, `HistoryView.tsx`, `getRepository`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `ExportModal.tsx`, `nurseRosterService.ts`, `ClinicContextState`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `dialogs.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `ReportsView.tsx`, `CreateScheduleModal.tsx`, `analysisExportService.ts`, `SettingsView.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `navigation.ts`, `PublishedRosterView.tsx`, `repository/index.ts`, `HistoryView.tsx`, `getRepository`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Schedule` connect `Assignment` to `ExportModal.tsx`, `SchedulingEngine.ts`, `nurseRosterService.ts`, `AppShell.tsx`, `DashboardView.tsx`, `IRepository.ts`, `FirestoreRepository`, `PublishModal.tsx`, `ReportsView.tsx`, `IRepository`, `types/index.ts`, `CreateScheduleModal.tsx`, `analysisExportService.ts`, `fixtures.ts`, `publicRosterService.ts`, `SchedulesView.tsx`, `hoursBalance.ts`, `WorkbookGrid.tsx`, `react`, `continuousHours.test.ts`, `icsExportService.ts`, `PublishedRosterView.tsx`, `HistoryView.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _446 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09565217391304348 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._