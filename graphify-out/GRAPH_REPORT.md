# Graph Report - NSC-Clinic-Roster  (2026-10-06)

## Corpus Check
- 201 files · ~245,651 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1476 nodes · 5446 edges · 67 communities (60 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 137 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14a2b8dc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- ExportModal.tsx
- SchedulingEngine.ts
- clinicModel.test.ts
- quotaTracker
- authService.ts
- getRepository
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
- I18nManager
- compilerOptions
- doctorScheduleService.ts
- FirestoreRepository.ts
- FirestoreRepository
- devDependencies
- PublishModal.tsx
- usePresence.ts
- rosterSaving.test.ts
- scripts
- types/index.ts
- scheduleTransactions.test.ts
- dateFormatter.ts
- lastResort.test.ts
- QuickCellPopup.tsx
- yearToDate.ts
- nurseRosterService.ts
- What You Must Do When Invoked
- LiveCollectionCache
- analysisExport.test.ts
- hoursTopUp.test.ts
- assignmentChecks.ts
- makeSchedule
- newRosterDates.ts
- nurseClinicFloat.test.ts
- HistoryView.tsx
- server.ts
- WorkbookGrid.tsx
- graphify reference: extra exports and benchmark
- navigation.ts
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
- makeNurse
- ref_node_assert
- NSC Clinic Roster: complete project guide
- ClinicRoster
- continuousHours.test.ts
- fixtures.ts
- CreateScheduleModal.tsx
- README.md

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 93 edges
2. `Assignment` - 84 edges
3. `Nurse` - 80 edges
4. `Schedule` - 80 edges
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
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts

## Import Cycles
- None detected.

## Communities (67 total, 7 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (67): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseFairnessMetrics, ProposedSwap, PublishModalProps (+59 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (65): 10. Hours, jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES (+57 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (48): 6. Clinic model (the business rules in plain English), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+40 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 5 - "authService.ts"
Cohesion: 0.12
Nodes (21): 4. Navigation and app shell, LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps (+13 more)

### Community 6 - "getRepository"
Cohesion: 0.06
Nodes (99): 7. Rules, lucide-react, react, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState (+91 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (23): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+15 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.12
Nodes (19): express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer() (+11 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (34): 13. Screens in detail, AllRequestsPanel(), AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+26 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.12
Nodes (10): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, SubscribeCallback, Unsubscribe (+2 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.14
Nodes (26): 3. Users, roles and access, Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId() (+18 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.18
Nodes (11): ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup(), initializeDatabaseIfEmpty() (+3 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "doctorScheduleService.ts"
Cohesion: 0.31
Nodes (10): EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult (+2 more)

### Community 22 - "FirestoreRepository.ts"
Cohesion: 0.28
Nodes (11): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+3 more)

### Community 23 - "FirestoreRepository"
Cohesion: 0.36
Nodes (3): 11. Saving, live updates, versions, FirestoreRepository, sanitizePayload()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.05
Nodes (62): 12. Publishing and nurse links, nodemailer, uuid, Request, emailRouter, emailFailureMessage(), EmailReadiness, EmailService (+54 more)

### Community 26 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 27 - "rosterSaving.test.ts"
Cohesion: 0.22
Nodes (4): SENIOR, DOCTOR, generateAll(), handEdit

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.07
Nodes (28): CellChoice, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, InternalSlot, ApprovalStatus, AssignmentKind, DoctorSessionSource (+20 more)

### Community 30 - "scheduleTransactions.test.ts"
Cohesion: 0.17
Nodes (7): CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS, apps, { initializeTestEnvironment }, requireRules

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "lastResort.test.ts"
Cohesion: 0.11
Nodes (14): isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES, DR_PCC (+6 more)

### Community 33 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 34 - "yearToDate.ts"
Cohesion: 0.13
Nodes (20): nurseClinicRoleOf(), YearToDateCounts, daysBefore(), loadClinicSetup(), isLateDuty(), clamp(), KEYS, YEAR_SEED_CAP (+12 more)

### Community 35 - "nurseRosterService.ts"
Cohesion: 0.06
Nodes (57): RFC-5545, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), dateLabel(), PublishedRosterSheet(), DayEntry (+49 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 38 - "analysisExport.test.ts"
Cohesion: 0.12
Nodes (17): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+9 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "assignmentChecks.ts"
Cohesion: 0.60
Nodes (5): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate()

### Community 41 - "makeSchedule"
Cohesion: 0.10
Nodes (20): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeSchedule(), LATE, run(), account(), CARD (+12 more)

### Community 42 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 45 - "HistoryView.tsx"
Cohesion: 0.06
Nodes (47): MenuButton(), MenuButtonProps, MenuItem, DeleteScheduleModal(), DeleteVersionModal(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps (+39 more)

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.15
Nodes (23): Other engine files, cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso(), SOURCE_WORDS, WEEKDAY_ABBR, withDr() (+15 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 55 - "navigation.ts"
Cohesion: 0.16
Nodes (14): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, DICTIONARY (+6 more)

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

### Community 66 - "makeNurse"
Cohesion: 0.13
Nodes (12): ScheduleValidator, ctx(), EARLY, LATE, makeNurse(), LATE, schedule, wishFindings() (+4 more)

### Community 67 - "ref_node_assert"
Cohesion: 0.13
Nodes (10): computeScheduleDiff(), formatAssignment(), diff(), LATE, nurse, nurses, published, refs (+2 more)

### Community 68 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.12
Nodes (15): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+7 more)

### Community 69 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 71 - "continuousHours.test.ts"
Cohesion: 0.18
Nodes (10): balance(), duties, first, history, long, nurse, periods, previousShifts (+2 more)

### Community 74 - "fixtures.ts"
Cohesion: 0.21
Nodes (9): ANNUAL_LEAVE, UNPAID_LEAVE, D, E, L, NC, PHL, SENIOR (+1 more)

### Community 75 - "CreateScheduleModal.tsx"
Cohesion: 0.25
Nodes (13): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate() (+5 more)

## Knowledge Gaps
- **426 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+421 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 523 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `SchedulesView.tsx`, `ExportModal.tsx`, `authService.ts`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `doctorScheduleService.ts`, `PublishModal.tsx`, `usePresence.ts`, `QuickCellPopup.tsx`, `nurseRosterService.ts`, `makeSchedule`, `HistoryView.tsx`, `WorkbookGrid.tsx`, `navigation.ts`, `NSC Clinic Roster: complete project guide`, `CreateScheduleModal.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `SchedulesView.tsx`, `ExportModal.tsx`, `QuickCellPopup.tsx`, `nurseRosterService.ts`, `authService.ts`, `package.json`, `AppShell.tsx`, `CreateScheduleModal.tsx`, `HistoryView.tsx`, `App.tsx`, `AvailabilityView.tsx`, `DashboardView.tsx`, `WorkbookGrid.tsx`, `doctorScheduleService.ts`, `navigation.ts`, `PublishModal.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `Assignment` connect `SchedulesView.tsx` to `ExportModal.tsx`, `SchedulingEngine.ts`, `clinicModel.test.ts`, `getRepository`, `DashboardView.tsx`, `doctorScheduleService.ts`, `PublishModal.tsx`, `rosterSaving.test.ts`, `types/index.ts`, `lastResort.test.ts`, `yearToDate.ts`, `nurseRosterService.ts`, `analysisExport.test.ts`, `assignmentChecks.ts`, `makeSchedule`, `nurseClinicFloat.test.ts`, `HistoryView.tsx`, `WorkbookGrid.tsx`, `makeNurse`, `ref_node_assert`, `NSC Clinic Roster: complete project guide`, `continuousHours.test.ts`, `fixtures.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _426 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1342968985245408 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06702702702702702 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09887005649717515 - nodes in this community are weakly interconnected._