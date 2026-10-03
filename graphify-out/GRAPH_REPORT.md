# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 184 files · ~229,430 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1378 nodes · 5037 edges · 60 communities (55 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c1efe03b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- analysisExportService.ts
- HistoryView.tsx
- clinicModel.test.ts
- PublishView.tsx
- WorkbookGrid.tsx
- getRepository
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
- IRepository
- firebaseIdentityService.ts
- Sidebar.tsx
- compilerOptions
- yearToDate.ts
- authService.ts
- FirestoreRepository
- devDependencies
- AvailabilityView.tsx
- SchedulesView.tsx
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- sharing.test.ts
- rosterSaving.test.ts
- analysisExport.test.ts
- What You Must Do When Invoked
- emailService.ts
- ref_node_assert
- fixtures.ts
- makeNurse
- nurseClinicFloat.test.ts
- hoursPolicy.ts
- SchedulingEngine.ts
- nurseRosterService.ts
- explainCell.ts
- graphify reference: extra exports and benchmark
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
- explainCell.test.ts
- preferenceFocus.test.ts
- yearSeed.ts
- IRepository.ts

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 91 edges
2. `Assignment` - 80 edges
3. `Nurse` - 79 edges
4. `DutyWindow` - 77 edges
5. `Schedule` - 74 edges
6. `react` - 70 edges
7. `useDialogA11y()` - 64 edges
8. `ClinicalRole` - 63 edges
9. `lucide-react` - 62 edges
10. `Doctor` - 62 edges

## Surprising Connections (you probably didn't know these)
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts
- `4. Navigation and app shell` --references--> `AppShell()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/layout/AppShell.tsx
- `13. Screens in detail` --references--> `DoctorsScheduleSheet()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/DoctorsScheduleSheet.tsx

## Import Cycles
- None detected.

## Communities (60 total, 5 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.10
Nodes (85): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModal(), EditDoctorShiftModalProps, TIME_PRESETS, ExportModalProps, ExportTab, WEEKDAY_NAMES (+77 more)

### Community 1 - "analysisExportService.ts"
Cohesion: 0.21
Nodes (14): resolveClinicSetup(), ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy(), downloadRosterAnalysis(), FIELD_GUIDE, minutesBetween() (+6 more)

### Community 2 - "HistoryView.tsx"
Cohesion: 0.06
Nodes (58): 11. Saving, live updates, versions, jspdf, jspdf-autotable, xlsx, DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), ExportModal() (+50 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.13
Nodes (31): 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), withoutBackups() (+23 more)

### Community 5 - "WorkbookGrid.tsx"
Cohesion: 0.14
Nodes (21): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+13 more)

### Community 6 - "getRepository"
Cohesion: 0.06
Nodes (100): 7. Rules, lucide-react, react, uuid, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost() (+92 more)

### Community 7 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (25): firebase, name, private, type, version, autoprefixer, cors, date-fns (+17 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.18
Nodes (19): AppShell(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView, PublishedRosterView (+11 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.14
Nodes (16): express, express-rate-limit, helmet, vite, startServer(), authMiddleware(), AuthUser, BackendRole (+8 more)

### Community 13 - "authService"
Cohesion: 0.11
Nodes (9): authorizedFetch(), authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider (+1 more)

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.17
Nodes (4): CollectionSyncer, fingerprint(), planSync(), EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.15
Nodes (24): bootstrap(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId() (+16 more)

### Community 17 - "IRepository"
Cohesion: 0.12
Nodes (21): removeNurseRoster(), revokeNurseLink(), removePublicRoster(), repositoryManager, IRepository, deleteEntireSchedule(), ScheduleDeleteResult, ALL_COLLECTIONS (+13 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (15): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, canAccessRoute() (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.14
Nodes (23): FairnessModal(), nurseClinicRoleOf(), daysBefore(), findPreviousSchedule(), loadClinicSetup(), consecutiveLateRuleOf(), isLateDuty(), lateDutyThreshold() (+15 more)

### Community 22 - "authService.ts"
Cohesion: 0.13
Nodes (21): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps (+13 more)

### Community 23 - "FirestoreRepository"
Cohesion: 0.13
Nodes (5): FirestoreRepository, sanitizePayload(), LiveCollectionCache, entry, matchesFilter()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "AvailabilityView.tsx"
Cohesion: 0.08
Nodes (46): 0. Quick start for a new chat, 13. Screens in detail, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 3. Users, roles and access (+38 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (28): 4. Navigation and app shell, MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId() (+20 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.05
Nodes (48): CreateScheduleModal(), CreateScheduleModalProps, isPairing(), PREFERENCE_FOCUS_LABELS, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod() (+40 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 33 - "rosterSaving.test.ts"
Cohesion: 0.33
Nodes (3): DOCTOR, handEdit, leave()

### Community 35 - "analysisExport.test.ts"
Cohesion: 0.15
Nodes (14): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+6 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "emailService.ts"
Cohesion: 0.21
Nodes (10): nodemailer, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult, ServerEmailConfig (+2 more)

### Community 38 - "ref_node_assert"
Cohesion: 0.10
Nodes (13): ScheduleValidator, SENIOR, DR_PEDS, ENT, FULL, PEDS, RULES, LATE (+5 more)

### Community 40 - "fixtures.ts"
Cohesion: 0.14
Nodes (12): LATE, nurse, ANNUAL_LEAVE, DAY_DUTY, UNPAID_LEAVE, D, E, L (+4 more)

### Community 41 - "makeNurse"
Cohesion: 0.15
Nodes (17): SchedulingEngine, clearYearToDateCache(), hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account() (+9 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "hoursPolicy.ts"
Cohesion: 0.22
Nodes (15): 10. Hours, CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditOnDate() (+7 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.13
Nodes (31): 6. Clinic model (the business rules in plain English), Entry points, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME (+23 more)

### Community 49 - "nurseRosterService.ts"
Cohesion: 0.07
Nodes (49): RFC-5545, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), DayEntry, LoadState, mondayOf() (+41 more)

### Community 50 - "explainCell.ts"
Cohesion: 0.14
Nodes (22): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), How a run works, Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift (+14 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

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

### Community 67 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 69 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 70 - "yearSeed.ts"
Cohesion: 0.29
Nodes (7): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 71 - "IRepository.ts"
Cohesion: 0.17
Nodes (10): Desired, Known, SyncPlan, FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry, ListFilter (+2 more)

## Knowledge Gaps
- **390 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+385 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 478 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `Assignment`, `HistoryView.tsx`, `PublishView.tsx`, `WorkbookGrid.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `nurseRosterService.ts`, `explainCell.ts`, `Sidebar.tsx`, `authService.ts`, `AvailabilityView.tsx`, `SchedulesView.tsx`, `types/index.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `Assignment`, `HistoryView.tsx`, `PublishView.tsx`, `WorkbookGrid.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `nurseRosterService.ts`, `Sidebar.tsx`, `authService.ts`, `AvailabilityView.tsx`, `SchedulesView.tsx`, `types/index.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `analysisExportService.ts`, `HistoryView.tsx`, `clinicModel.test.ts`, `PublishView.tsx`, `WorkbookGrid.tsx`, `getRepository`, `DashboardView.tsx`, `yearToDate.ts`, `SchedulesView.tsx`, `types/index.ts`, `sharing.test.ts`, `rosterSaving.test.ts`, `analysisExport.test.ts`, `ref_node_assert`, `fixtures.ts`, `makeNurse`, `nurseClinicFloat.test.ts`, `SchedulingEngine.ts`, `nurseRosterService.ts`, `explainCell.ts`, `explainCell.test.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _390 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.09900990099009901 - nodes in this community are weakly interconnected._
- **Should `HistoryView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056692242114237 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._