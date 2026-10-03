# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 185 files · ~231,852 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1390 nodes · 5059 edges · 64 communities (55 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `929de5f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- ExportModal.tsx
- rosterPdfService.ts
- clinicModel.test.ts
- PublishView.tsx
- AssignmentKind
- getRepository
- firebaseConfig.ts
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- authService
- App.tsx
- EntityForCollection
- useDialogA11y
- seedRunner.ts
- firebaseIdentityService.ts
- Sidebar.tsx
- compilerOptions
- weekend.ts
- authService.ts
- FirestoreRepository
- devDependencies
- AvailabilityView.tsx
- SchedulesView
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- lastResort.test.ts
- ReportsView.tsx
- IRepository
- ref_node_assert
- What You Must Do When Invoked
- LiveCollectionCache
- requestFindings.test.ts
- hoursTopUp.test.ts
- fixtures.ts
- makeNurse
- preferenceOrder.ts
- nurseClinicFloat.test.ts
- hoursAccounting.ts
- usePresence.ts
- vite.config.ts
- IsoDateString
- DashboardView.tsx
- WhoCanCover.tsx
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

## Communities (64 total, 9 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.06
Nodes (152): 5. Data model (Firestore collections), 6. Clinic model (the business rules in plain English), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModal(), FairnessModalProps, NurseFairnessMetrics (+144 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.20
Nodes (16): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+8 more)

### Community 2 - "rosterPdfService.ts"
Cohesion: 0.13
Nodes (19): chunk(), exportRosterToPdf(), firstName(), GRID, HEAD_FILL, hexToRgb(), HOLIDAY_HEAD, INK (+11 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.08
Nodes (49): 12. Publishing and nurse links, nodemailer, uuid, Request, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+41 more)

### Community 6 - "getRepository"
Cohesion: 0.06
Nodes (95): 7. Rules, lucide-react, react, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState (+87 more)

### Community 7 - "firebaseConfig.ts"
Cohesion: 0.13
Nodes (8): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

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
Nodes (18): express, express-rate-limit, helmet, vite, startServer(), authMiddleware(), AuthUser, BackendRole (+10 more)

### Community 13 - "authService"
Cohesion: 0.14
Nodes (4): authorizedFetch(), authService, computePrivileges(), getAppAuth()

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.15
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "useDialogA11y"
Cohesion: 0.17
Nodes (22): openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, CHANGE_LABELS, VersionCompareModal() (+14 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.14
Nodes (14): 11. Saving, live updates, versions, fingerprint(), syncScheduleAssignments(), ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+6 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (15): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, canAccessRoute() (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 22 - "authService.ts"
Cohesion: 0.13
Nodes (21): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps (+13 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "AvailabilityView.tsx"
Cohesion: 0.07
Nodes (53): 0. Quick start for a new chat, 13. Screens in detail, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 3. Users, roles and access (+45 more)

### Community 26 - "SchedulesView"
Cohesion: 0.07
Nodes (47): MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, readStoredScheduleId() (+39 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.10
Nodes (20): ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus, InvitationStatus, LockMode (+12 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "lastResort.test.ts"
Cohesion: 0.11
Nodes (14): isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES, DR_PCC (+6 more)

### Community 33 - "ReportsView.tsx"
Cohesion: 0.21
Nodes (15): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), SortField, TabMode (+7 more)

### Community 34 - "IRepository"
Cohesion: 0.22
Nodes (8): removeNurseRoster(), revokeNurseLink(), repositoryManager, IRepository, deleteEntireSchedule(), clearDatabase(), writeInitializationState(), saveEmailSettings()

### Community 35 - "ref_node_assert"
Cohesion: 0.15
Nodes (7): ctx(), EARLY, LATE, diff(), LATE, nurse, DAY_DUTY

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.20
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "requestFindings.test.ts"
Cohesion: 0.14
Nodes (8): ScheduleValidator, SENIOR, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.17
Nodes (8): DR_G, DR_O, EARLY, FULL, NINE_SEVEN, NO_EXTRAS, OBGYN, ORTHO

### Community 40 - "fixtures.ts"
Cohesion: 0.10
Nodes (23): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+15 more)

### Community 41 - "makeNurse"
Cohesion: 0.16
Nodes (17): SchedulingEngine, clearYearToDateCache(), hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account() (+9 more)

### Community 42 - "preferenceOrder.ts"
Cohesion: 0.22
Nodes (9): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference (+1 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "hoursAccounting.ts"
Cohesion: 0.27
Nodes (13): 10. Hours, ReportsView(), fmtHours(), HoursAccountingSheet(), leaveCreditOnDate(), resolveFullTimeTarget(), calculateClinicHoursMetrics(), calculateDutyDurationHours() (+5 more)

### Community 45 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 49 - "DashboardView.tsx"
Cohesion: 0.06
Nodes (70): RFC-5545, Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId() (+62 more)

### Community 50 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

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

### Community 71 - "IRepository.ts"
Cohesion: 0.48
Nodes (4): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CollectionName

## Knowledge Gaps
- **398 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+393 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 489 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `SchedulesView.tsx`, `ExportModal.tsx`, `ReportsView.tsx`, `PublishView.tsx`, `package.json`, `AppShell.tsx`, `usePresence.ts`, `App.tsx`, `useDialogA11y`, `DashboardView.tsx`, `WhoCanCover.tsx`, `Sidebar.tsx`, `authService.ts`, `AvailabilityView.tsx`, `SchedulesView`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `SchedulesView.tsx`, `ExportModal.tsx`, `ReportsView.tsx`, `PublishView.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `useDialogA11y`, `DashboardView.tsx`, `Sidebar.tsx`, `authService.ts`, `AvailabilityView.tsx`, `SchedulesView`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Assignment` connect `SchedulesView.tsx` to `ExportModal.tsx`, `rosterPdfService.ts`, `clinicModel.test.ts`, `PublishView.tsx`, `getRepository`, `useDialogA11y`, `seedRunner.ts`, `SchedulesView`, `types/index.ts`, `lastResort.test.ts`, `ReportsView.tsx`, `ref_node_assert`, `requestFindings.test.ts`, `fixtures.ts`, `makeNurse`, `nurseClinicFloat.test.ts`, `hoursAccounting.ts`, `DashboardView.tsx`, `explainCell.test.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _398 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05540575243965074 - nodes in this community are weakly interconnected._
- **Should `rosterPdfService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._