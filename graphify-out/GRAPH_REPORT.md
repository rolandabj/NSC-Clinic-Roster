# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 177 files · ~218,859 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1317 nodes · 4795 edges · 65 communities (58 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 119 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03c5bf2a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Nurse
- SettingsView.tsx
- rosterPdfService.ts
- clinicModel.test.ts
- PublishView.tsx
- CreateScheduleModal.tsx
- AvailabilityView.tsx
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
- seedRunner.ts
- firebaseIdentityService.ts
- navigation.ts
- compilerOptions
- nurseRoster.test.ts
- getRepository
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
- RulesTab.tsx
- yearToDate.ts
- analysisExport.test.ts
- What You Must Do When Invoked
- fixtures.ts
- yearFairness.test.ts
- ref_node_assert
- hoursRules.test.ts
- preferenceFocus.test.ts
- explainCell.test.ts
- ClinicContextState
- calendar.ts
- applyPreferenceFocus
- IRepository
- WorkbookGrid.tsx
- SchedulingEngine.ts
- HistoryView.tsx
- explainCell.ts
- dialogs.tsx
- graphify reference: extra exports and benchmark
- assignmentChecks.ts
- hoursPolicy.ts
- DatabaseTab.tsx
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 86 edges
2. `Nurse` - 77 edges
3. `Assignment` - 76 edges
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

## Communities (65 total, 7 thin omitted)

### Community 0 - "Nurse"
Cohesion: 0.09
Nodes (94): 5. Data model (Firestore collections), Request, BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, ExportTab, WEEKDAY_NAMES, FairnessModalProps (+86 more)

### Community 1 - "SettingsView.tsx"
Cohesion: 0.15
Nodes (36): confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), DatabaseTabProps, DutiesTab(), DutiesTabProps (+28 more)

### Community 2 - "rosterPdfService.ts"
Cohesion: 0.11
Nodes (21): jspdf, jspdf-autotable, chunk(), exportRosterToPdf(), firstName(), GRID, HEAD_FILL, hexToRgb() (+13 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.09
Nodes (35): 12. Publishing and nurse links, nodemailer, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+27 more)

### Community 5 - "CreateScheduleModal.tsx"
Cohesion: 0.21
Nodes (15): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getPeriodDailyRate(), PeriodProratingBreakdown (+7 more)

### Community 6 - "AvailabilityView.tsx"
Cohesion: 0.21
Nodes (18): ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, NurseSelfServicePanel(), cancelAvailabilityRequest(), cancelLeaveRequest(), countPendingApprovals(), daysInclusive() (+10 more)

### Community 7 - "authService"
Cohesion: 0.05
Nodes (19): authorizedFetch(), authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider (+11 more)

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (28): firebase, name, private, type, version, autoprefixer, cors, date-fns (+20 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (22): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.17
Nodes (13): express, startServer(), authMiddleware(), BackendRole, Express, requireAuth(), requireOwner, requirePlanner (+5 more)

### Community 13 - "authService.ts"
Cohesion: 0.26
Nodes (10): LoginPageProps, AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL, UserPrivileges (+2 more)

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.12
Nodes (10): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, SubscribeCallback, Unsubscribe (+2 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (22): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+14 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.12
Nodes (18): daysBefore(), findPreviousSchedule(), loadClinicSetup(), cacheKey(), earlierRostersThisYear(), latestPublishedVersion(), loadEarlierRosters(), loadYearToDate() (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "navigation.ts"
Cohesion: 0.14
Nodes (18): 3. Users, roles and access, NAV_ITEMS, SidebarProps, TopBar(), ShortcutItem, SHORTCUTS, ShortcutsModalProps, canAccessRoute() (+10 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "nurseRoster.test.ts"
Cohesion: 0.13
Nodes (21): RFC-5545, PublishedRosterView(), loadPublishedRoster(), buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate() (+13 more)

### Community 22 - "getRepository"
Cohesion: 0.19
Nodes (22): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), DeleteVersionModalProps, FairnessModal() (+14 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "analysisExportService.ts"
Cohesion: 0.13
Nodes (31): 10. Hours, xlsx, ExportModal(), fmtHours(), ANALYSIS_FORMAT, ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis() (+23 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.16
Nodes (22): MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet() (+14 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.06
Nodes (32): PREFERENCE_FOCUS_LABELS, othersOnRoster(), STALE_MS, TAB_ID, usePresence(), ApprovalStatus, AuditAction, AuditEvent (+24 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (23): ViewerData, DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate() (+15 more)

### Community 33 - "RulesTab.tsx"
Cohesion: 0.07
Nodes (31): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 7. Rules, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+23 more)

### Community 34 - "yearToDate.ts"
Cohesion: 0.13
Nodes (19): nurseClinicRoleOf(), YearToDate, YearToDateCounts, isLateDuty(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+11 more)

### Community 35 - "analysisExport.test.ts"
Cohesion: 0.12
Nodes (16): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+8 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.20
Nodes (7): LATE, nurse, ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, H2_KEYWORDS

### Community 38 - "yearFairness.test.ts"
Cohesion: 0.20
Nodes (14): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+6 more)

### Community 39 - "ref_node_assert"
Cohesion: 0.15
Nodes (7): ScheduleValidator, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 40 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 41 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 42 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 43 - "ClinicContextState"
Cohesion: 0.11
Nodes (21): TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+13 more)

### Community 44 - "calendar.ts"
Cohesion: 0.43
Nodes (5): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), NurseRosterDoc

### Community 45 - "applyPreferenceFocus"
Cohesion: 0.33
Nodes (6): 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, applyPreferenceFocus(), isPairing()

### Community 46 - "IRepository"
Cohesion: 0.15
Nodes (15): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, repositoryManager, IRepository, deleteDoctorShift() (+7 more)

### Community 47 - "WorkbookGrid.tsx"
Cohesion: 0.14
Nodes (20): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+12 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.14
Nodes (29): bloodCollectionRole(), canBeFreeNurse(), coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes(), hoursToCover() (+21 more)

### Community 49 - "HistoryView.tsx"
Cohesion: 0.17
Nodes (16): 11. Saving, live updates, versions, DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), VersionCompareModal(), VersionViewModal(), HistoryView(), WEEKDAY_NAMES (+8 more)

### Community 50 - "explainCell.ts"
Cohesion: 0.17
Nodes (18): Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+10 more)

### Community 51 - "dialogs.tsx"
Cohesion: 0.19
Nodes (11): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, NoticeTone, PendingConfirm (+3 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "assignmentChecks.ts"
Cohesion: 0.42
Nodes (7): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), isExclusiveNurseClinic(), resolveRule()

### Community 54 - "hoursPolicy.ts"
Cohesion: 0.33
Nodes (8): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange()

### Community 55 - "DatabaseTab.tsx"
Cohesion: 0.50
Nodes (7): DatabaseTab(), defaultFirebaseConfig, checkBackup(), clearDatabase(), downloadFullDatabaseBackup(), getDatabaseStatistics(), importFullDatabaseBackup()

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

## Knowledge Gaps
- **361 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+356 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 441 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `Nurse`, `SettingsView.tsx`, `PublishView.tsx`, `CreateScheduleModal.tsx`, `AvailabilityView.tsx`, `package.json`, `AppShell.tsx`, `authService.ts`, `App.tsx`, `DashboardView.tsx`, `navigation.ts`, `SchedulesView.tsx`, `types/index.ts`, `nurseRosterService.ts`, `RulesTab.tsx`, `ClinicContextState`, `IRepository`, `WorkbookGrid.tsx`, `HistoryView.tsx`, `explainCell.ts`, `dialogs.tsx`, `DatabaseTab.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `Nurse`, `SettingsView.tsx`, `PublishView.tsx`, `CreateScheduleModal.tsx`, `AvailabilityView.tsx`, `package.json`, `AppShell.tsx`, `authService.ts`, `App.tsx`, `DashboardView.tsx`, `navigation.ts`, `SchedulesView.tsx`, `nurseRosterService.ts`, `RulesTab.tsx`, `ClinicContextState`, `IRepository`, `WorkbookGrid.tsx`, `HistoryView.tsx`, `dialogs.tsx`, `DatabaseTab.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Nurse` to `rosterPdfService.ts`, `clinicModel.test.ts`, `PublishView.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `nurseRoster.test.ts`, `getRepository`, `analysisExportService.ts`, `SchedulesView.tsx`, `types/index.ts`, `nurseRosterService.ts`, `yearToDate.ts`, `analysisExport.test.ts`, `fixtures.ts`, `yearFairness.test.ts`, `ref_node_assert`, `hoursRules.test.ts`, `explainCell.test.ts`, `IRepository`, `WorkbookGrid.tsx`, `SchedulingEngine.ts`, `HistoryView.tsx`, `explainCell.ts`, `assignmentChecks.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _361 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Nurse` be split into smaller, more focused modules?**
  _Cohesion score 0.08939740655987796 - nodes in this community are weakly interconnected._
- **Should `SettingsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14799154334038056 - nodes in this community are weakly interconnected._
- **Should `rosterPdfService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._