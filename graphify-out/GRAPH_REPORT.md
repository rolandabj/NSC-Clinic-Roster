# Graph Report - NSC-Clinic-Roster  (2026-10-04)

## Corpus Check
- 185 files · ~232,698 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1391 nodes · 5061 edges · 65 communities (57 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b06a9467`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- analysisExportService.ts
- .generate
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
- seedRunner.ts
- firebaseIdentityService.ts
- Sidebar.tsx
- compilerOptions
- yearToDate.ts
- ClinicContextState
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
- nurseRosterService.ts
- IRepository
- staffRequestService.ts
- What You Must Do When Invoked
- LiveCollectionCache
- lastResort.test.ts
- hoursTopUp.test.ts
- fixtures.ts
- makeNurse
- SchedulingEngine.ts
- nurseClinicFloat.test.ts
- hoursPolicy.ts
- ref_node_test
- vite.config.ts
- authService.ts
- NSC Clinic Roster: complete project guide
- icsExportService.ts
- ScheduleValidator.ts
- syncScheduleAssignments
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
- `16. History of work (for context)` --references--> `syncDayOffLock()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/requests/staffRequestService.ts
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

## Communities (65 total, 8 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.06
Nodes (129): 5. Data model (Firestore collections), jspdf, jspdf-autotable, BulkImportModalProps, DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), EditDoctorShiftModalProps (+121 more)

### Community 1 - "analysisExportService.ts"
Cohesion: 0.13
Nodes (25): 10. Hours, 6. Clinic model (the business rules in plain English), xlsx, ExportModal(), fmtHours(), doctorSessionsOn(), isExclusiveNurseClinic(), ANALYSIS_FORMAT (+17 more)

### Community 2 - ".generate"
Cohesion: 0.14
Nodes (24): bloodCollectionRole(), canBeFreeNurse(), coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover(), isFreeDuring() (+16 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.09
Nodes (39): 12. Publishing and nurse links, nodemailer, uuid, Request, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+31 more)

### Community 5 - "WorkbookGrid.tsx"
Cohesion: 0.14
Nodes (20): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+12 more)

### Community 6 - "getRepository"
Cohesion: 0.05
Nodes (104): 7. Rules, lucide-react, react, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState (+96 more)

### Community 7 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (23): firebase, name, private, type, version, autoprefixer, cors, date-fns (+15 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (23): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+15 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.13
Nodes (17): express, express-rate-limit, helmet, vite, startServer(), authMiddleware(), AuthUser, BackendRole (+9 more)

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.15
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.17
Nodes (22): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+14 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.13
Nodes (19): DatabaseTab(), removeNurseRoster(), revokeNurseLink(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult (+11 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.19
Nodes (14): 3. Users, roles and access, NAV_ITEMS, Sidebar(), SidebarProps, DashboardViewProps, canAccessRoute(), canEditClinicData(), VIEWER_ROUTES (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (25): FairnessModal(), ClinicSetup, nurseClinicRoleOf(), daysBefore(), findPreviousSchedule(), loadClinicSetup(), consecutiveLateRuleOf(), isLateDuty() (+17 more)

### Community 22 - "ClinicContextState"
Cohesion: 0.12
Nodes (20): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps (+12 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "AvailabilityView.tsx"
Cohesion: 0.20
Nodes (20): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+12 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.07
Nodes (50): MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, SwapManagerModal() (+42 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.07
Nodes (29): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus (+21 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 33 - "nurseRosterService.ts"
Cohesion: 0.17
Nodes (21): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), addDaysIso() (+13 more)

### Community 34 - "IRepository"
Cohesion: 0.15
Nodes (9): repositoryManager, IRepository, DeleteDoctorShiftParams, PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult, WEEKDAY_FULL_NAMES, deleteEntireSchedule(), ScheduleDeleteResult (+1 more)

### Community 35 - "staffRequestService.ts"
Cohesion: 0.24
Nodes (14): NurseSelfServicePanel(), cancelAvailabilityRequest(), cancelLeaveRequest(), dayOffLockId(), daysInclusive(), isPendingLeave(), listMyRequests(), listPendingApprovals() (+6 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.20
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "lastResort.test.ts"
Cohesion: 0.14
Nodes (9): ScheduleValidator, DR_PEDS, ENT, FULL, PEDS, RULES, EARLY, LATE (+1 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "fixtures.ts"
Cohesion: 0.12
Nodes (21): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+13 more)

### Community 41 - "makeNurse"
Cohesion: 0.14
Nodes (17): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+9 more)

### Community 42 - "SchedulingEngine.ts"
Cohesion: 0.16
Nodes (14): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, isLastResortShift(), LAST_RESORT_NOTE, applyPreferenceFocus(), InternalSlot (+6 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "hoursPolicy.ts"
Cohesion: 0.29
Nodes (10): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditOnDate(), leaveCreditPerDay() (+2 more)

### Community 45 - "ref_node_test"
Cohesion: 0.12
Nodes (13): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, D, E, L (+5 more)

### Community 47 - "authService.ts"
Cohesion: 0.26
Nodes (7): authorizedFetch(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, UserAccessRecord

### Community 48 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.25
Nodes (7): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide

### Community 49 - "icsExportService.ts"
Cohesion: 0.11
Nodes (26): RFC-5545, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), PublishedRosterView(), loadPublishedRoster(), buildNurseIcs(), buildNurseRosterIcs() (+18 more)

### Community 50 - "ScheduleValidator.ts"
Cohesion: 0.15
Nodes (22): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay(), ExplainNurseDayInput (+14 more)

### Community 51 - "syncScheduleAssignments"
Cohesion: 0.29
Nodes (6): 11. Saving, live updates, versions, 17. Known quirks and ideas for later, WalkthroughModal(), WalkthroughModalProps, fingerprint(), syncScheduleAssignments()

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

### Community 71 - "IRepository.ts"
Cohesion: 0.48
Nodes (4): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CollectionName

## Knowledge Gaps
- **399 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+394 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 490 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `Assignment`, `nurseRosterService.ts`, `staffRequestService.ts`, `PublishView.tsx`, `WorkbookGrid.tsx`, `package.json`, `AppShell.tsx`, `ref_node_test`, `App.tsx`, `DashboardView.tsx`, `ScheduleValidator.ts`, `Sidebar.tsx`, `syncScheduleAssignments`, `ClinicContextState`, `AvailabilityView.tsx`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `Assignment`, `nurseRosterService.ts`, `staffRequestService.ts`, `PublishView.tsx`, `WorkbookGrid.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `Sidebar.tsx`, `ClinicContextState`, `AvailabilityView.tsx`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `analysisExportService.ts`, `.generate`, `clinicModel.test.ts`, `PublishView.tsx`, `WorkbookGrid.tsx`, `getRepository`, `DashboardView.tsx`, `yearToDate.ts`, `SchedulesView.tsx`, `types/index.ts`, `sharing.test.ts`, `nurseRosterService.ts`, `lastResort.test.ts`, `fixtures.ts`, `makeNurse`, `SchedulingEngine.ts`, `nurseClinicFloat.test.ts`, `ref_node_test`, `icsExportService.ts`, `ScheduleValidator.ts`, `syncScheduleAssignments`, `explainCell.test.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _399 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.05574855252274607 - nodes in this community are weakly interconnected._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1282051282051282 - nodes in this community are weakly interconnected._
- **Should `.generate` be split into smaller, more focused modules?**
  _Cohesion score 0.1354679802955665 - nodes in this community are weakly interconnected._