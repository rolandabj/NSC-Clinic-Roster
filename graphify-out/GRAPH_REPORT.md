# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 181 files · ~223,287 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1342 nodes · 4904 edges · 66 communities (60 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 120 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3ce6fb3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- getRepository
- ExportModal.tsx
- clinicModel.test.ts
- PublishModal
- explainCell.ts
- ScheduleValidator.ts
- firebaseConfig.ts
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
- authService.ts
- FirestoreRepository
- devDependencies
- analysisExportService.ts
- SchedulesView.tsx
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- nurseRosterService.ts
- ruleSyncService.ts
- makeNurse
- analysisExport.test.ts
- What You Must Do When Invoked
- emailService.ts
- ref_node_assert
- makeSchedule
- fixtures.ts
- yearFairness.test.ts
- LiveCollectionCache
- nurseClinicFloat.test.ts
- usePresence.ts
- newRosterDates.ts
- IRepository
- WorkbookGrid.tsx
- SchedulingEngine.ts
- explainCell.test.ts
- NSC Clinic Roster: complete project guide
- rosterSaving.test.ts
- graphify reference: extra exports and benchmark
- lastResort.test.ts
- hoursPolicy.ts
- checkAssignment
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- preferenceOrder.ts

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
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts
- `13. Screens in detail` --references--> `announceProblems()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/dashboard/problemCount.ts

## Import Cycles
- None detected.

## Communities (66 total, 6 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.08
Nodes (98): 5. Data model (Firestore collections), Request, BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseFairnessMetrics, ProposedSwap (+90 more)

### Community 1 - "getRepository"
Cohesion: 0.06
Nodes (97): 7. Rules, lucide-react, react, uuid, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost() (+89 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (33): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, FLOAT_ROLE_ID (+25 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishModal"
Cohesion: 0.22
Nodes (15): 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), PublishView(), ensureNurseLink(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+7 more)

### Community 5 - "explainCell.ts"
Cohesion: 0.16
Nodes (17): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, BlockedShift, explainDay(), explainNurseDay(), ExplainNurseDayInput (+9 more)

### Community 6 - "ScheduleValidator.ts"
Cohesion: 0.22
Nodes (11): ProblemsPanelProps, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, isLastResortShift(), LAST_RESORT_NOTE, FindingCategory, FindingSeverity (+3 more)

### Community 7 - "firebaseConfig.ts"
Cohesion: 0.13
Nodes (8): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (25): firebase, name, private, type, version, autoprefixer, cors, date-fns (+17 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (23): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+15 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.13
Nodes (18): express, express-rate-limit, helmet, vite, startServer(), authMiddleware(), AuthUser, BackendRole (+10 more)

### Community 13 - "authService"
Cohesion: 0.14
Nodes (4): authorizedFetch(), authService, computePrivileges(), getAppAuth()

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (13): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+5 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.13
Nodes (11): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, FirebaseClientConfig, SubscribeCallback (+3 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.14
Nodes (29): 3. Users, roles and access, Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId() (+21 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.18
Nodes (10): ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup(), initializeDatabaseIfEmpty(), isClientDatabaseCleared() (+2 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (13): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, DICTIONARY (+5 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.27
Nodes (12): nurseClinicRoleOf(), isLateDuty(), cacheKey(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion(), loadEarlierRosters() (+4 more)

### Community 22 - "authService.ts"
Cohesion: 0.13
Nodes (21): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps (+13 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "analysisExportService.ts"
Cohesion: 0.21
Nodes (12): ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy(), downloadRosterAnalysis(), FIELD_GUIDE, PROBLEM_RULES, problemRule() (+4 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.05
Nodes (80): 13. Screens in detail, MenuButton(), MenuButtonProps, MenuItem, openStack, useDialogA11y(), CreateScheduleModal(), CreateScheduleModalProps (+72 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.09
Nodes (21): ApprovalStatus, BlockWeeks, DoctorSessionSource, EmailLogKind, EmailLogStatus, Invitation, InvitationStatus, LockMode (+13 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "nurseRosterService.ts"
Cohesion: 0.07
Nodes (48): RFC-5545, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), DayEntry, LoadState, mondayOf(), MONTHS (+40 more)

### Community 33 - "ruleSyncService.ts"
Cohesion: 0.33
Nodes (6): RuleDef, CANONICAL_RULES_SPEC, CanonicalRuleDef, MAX_CONSECUTIVE_SHIFTS_NAME, RuleSyncResult, RuleTemplateKey

### Community 34 - "makeNurse"
Cohesion: 0.18
Nodes (8): ctx(), EARLY, LATE, nurses(), makeNurse(), LATE, schedule, wishFindings()

### Community 35 - "analysisExport.test.ts"
Cohesion: 0.21
Nodes (12): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+4 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "emailService.ts"
Cohesion: 0.21
Nodes (11): nodemailer, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult, ServerEmailConfig (+3 more)

### Community 38 - "ref_node_assert"
Cohesion: 0.14
Nodes (8): LATE, nurse, DAY_DUTY, SENIOR, LATE, run(), dutyHours(), generate()

### Community 39 - "makeSchedule"
Cohesion: 0.22
Nodes (7): ScheduleValidator, makeSchedule(), account(), EARLY, LATE, restFindings(), shifts

### Community 40 - "fixtures.ts"
Cohesion: 0.21
Nodes (9): ANNUAL_LEAVE, UNPAID_LEAVE, D, E, L, NC, PHL, SENIOR (+1 more)

### Community 41 - "yearFairness.test.ts"
Cohesion: 0.12
Nodes (14): SchedulingEngine, clearYearToDateCache(), hoursOnlyRules(), CARD, doctorOfAmy(), KHAN, LATE, LEE (+6 more)

### Community 42 - "LiveCollectionCache"
Cohesion: 0.20
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 45 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 46 - "IRepository"
Cohesion: 0.22
Nodes (3): repositoryManager, IRepository, PopulateRecurringDoctorSessionsParams

### Community 47 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (26): 6. Clinic model (the business rules in plain English), findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (37): bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover(), isFreeDuring() (+29 more)

### Community 49 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 50 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 11. Saving, live updates, versions, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+8 more)

### Community 51 - "rosterSaving.test.ts"
Cohesion: 0.33
Nodes (3): DOCTOR, generateAll(), handEdit

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 54 - "hoursPolicy.ts"
Cohesion: 0.22
Nodes (15): 10. Hours, CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditOnDate() (+7 more)

### Community 55 - "checkAssignment"
Cohesion: 0.40
Nodes (5): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate()

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

### Community 65 - "preferenceOrder.ts"
Cohesion: 0.40
Nodes (4): isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus

## Knowledge Gaps
- **373 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+368 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 456 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `Assignment`, `nurseRosterService.ts`, `ExportModal.tsx`, `ScheduleValidator.ts`, `package.json`, `AppShell.tsx`, `usePresence.ts`, `App.tsx`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `NSC Clinic Roster: complete project guide`, `Sidebar.tsx`, `authService.ts`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `Assignment`, `nurseRosterService.ts`, `ExportModal.tsx`, `ScheduleValidator.ts`, `package.json`, `AppShell.tsx`, `App.tsx`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `Sidebar.tsx`, `authService.ts`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `getRepository`, `ExportModal.tsx`, `clinicModel.test.ts`, `explainCell.ts`, `ScheduleValidator.ts`, `DashboardView.tsx`, `yearToDate.ts`, `analysisExportService.ts`, `SchedulesView.tsx`, `types/index.ts`, `nurseRosterService.ts`, `makeNurse`, `analysisExport.test.ts`, `ref_node_assert`, `makeSchedule`, `fixtures.ts`, `yearFairness.test.ts`, `nurseClinicFloat.test.ts`, `WorkbookGrid.tsx`, `SchedulingEngine.ts`, `explainCell.test.ts`, `NSC Clinic Roster: complete project guide`, `rosterSaving.test.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _373 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.08183393309342929 - nodes in this community are weakly interconnected._
- **Should `getRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.05717382468500203 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0931174089068826 - nodes in this community are weakly interconnected._