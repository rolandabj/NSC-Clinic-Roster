# Graph Report - NSC-Clinic-Roster  (2026-10-05)

## Corpus Check
- 200 files · ~242,817 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1465 nodes · 5421 edges · 71 communities (64 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 135 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `de8b1b28`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- ExportModal.tsx
- SchedulingEngine.ts
- clinicModel.test.ts
- IRepository
- AvailabilityView.tsx
- getRepository
- authService
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- staffRequestService.ts
- App.tsx
- EntityForCollection
- DashboardView.tsx
- seedRunner.ts
- firebaseIdentityService.ts
- ShortcutsModal.tsx
- compilerOptions
- analysisExportService.ts
- react
- FirestoreRepository
- devDependencies
- PublishModal.tsx
- nurseRosterService.ts
- HistoryView.tsx
- scripts
- types/index.ts
- scheduleTransactions.test.ts
- dateFormatter.ts
- lastResort.test.ts
- createApiApp
- WarningsSheet.tsx
- MyRosterView.tsx
- What You Must Do When Invoked
- LiveCollectionCache
- ref_node_assert
- hoursTopUp.test.ts
- RulesTab.tsx
- makeNurse
- PublishedRosterView.tsx
- nurseClinicFloat.test.ts
- hoursPolicy.ts
- SchedulesView.tsx
- NurseTimesheetModal.tsx
- server.ts
- ShareModal.tsx
- WorkbookGrid.tsx
- preferenceFocus.test.ts
- DoctorSession
- graphify reference: extra exports and benchmark
- rosterSaving.test.ts
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
- newRosterDates.ts
- fixtures.ts
- FirestoreRepository.ts
- continuousHours.test.ts
- hoursRules.test.ts
- ScheduleValidator.ts
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
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts
- `13. Screens in detail` --references--> `EditDoctorShiftModal()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/modals/EditDoctorShiftModal.tsx

## Import Cycles
- None detected.

## Communities (71 total, 7 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.10
Nodes (84): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseFairnessMetrics, ProposedSwap, PublishModalProps (+76 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (44): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+36 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (37): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, bloodCollectionRole(), canBeFreeNurse(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes() (+29 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "IRepository"
Cohesion: 0.15
Nodes (9): removeNurseRoster(), revokeNurseLink(), repositoryManager, IRepository, PopulateRecurringDoctorSessionsParams, deleteEntireSchedule(), ScheduleDeleteResult, writeInitializationState() (+1 more)

### Community 5 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (23): LoginPageProps, NAV_ITEMS, SidebarProps, TopBarProps, AuthModalProps, AuditTrailViewProps, AvailabilityViewProps, WEEKDAY_ABBR (+15 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (42): confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DutiesTab() (+34 more)

### Community 7 - "authService"
Cohesion: 0.07
Nodes (12): authService, computePrivileges(), defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider (+4 more)

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.13
Nodes (26): 4. Navigation and app shell, AppShell(), bootstrap(), AppShellProps, AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+18 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (15): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+7 more)

### Community 13 - "staffRequestService.ts"
Cohesion: 0.12
Nodes (34): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+26 more)

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.12
Nodes (9): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, CollectionName, EntityForCollection (+1 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.17
Nodes (19): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+11 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.19
Nodes (17): DatabaseTab(), DatabaseTabProps, ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats (+9 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "ShortcutsModal.tsx"
Cohesion: 0.13
Nodes (9): ShortcutItem, SHORTCUTS, ShortcutsModalProps, DICTIONARY, i18n, I18nManager, Language, t() (+1 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "analysisExportService.ts"
Cohesion: 0.13
Nodes (20): resolveClinicSetup(), isLateDuty(), ANALYSIS_FORMAT, ANALYSIS_FORMAT_VERSION, buildRosterAnalysis(), countBy(), FIELD_GUIDE, PROBLEM_RULES (+12 more)

### Community 22 - "react"
Cohesion: 0.12
Nodes (27): lucide-react, react, react-dom, uuid, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState (+19 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.08
Nodes (45): 12. Publishing and nurse links, nodemailer, Request, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+37 more)

### Community 26 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (25): loadViewerData(), addDaysIso(), buildNurseRosterDoc(), buildTeamRosterSheet(), latestPublishedVersions(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, NURSE_TOKEN_PATTERN (+17 more)

### Community 27 - "HistoryView.tsx"
Cohesion: 0.28
Nodes (11): 11. Saving, live updates, versions, DeleteVersionModal(), VersionCompareModal(), VersionViewModal(), HistoryView(), WEEKDAY_NAMES, computeScheduleDiff(), formatAssignment() (+3 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.09
Nodes (25): AccessManagementPanelProps, othersOnRoster(), STALE_MS, TAB_ID, usePresence(), ApprovalStatus, AuditAction, AuditEvent (+17 more)

### Community 30 - "scheduleTransactions.test.ts"
Cohesion: 0.17
Nodes (7): CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS, apps, { initializeTestEnvironment }, requireRules

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "lastResort.test.ts"
Cohesion: 0.11
Nodes (14): isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES, DR_PCC (+6 more)

### Community 33 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 34 - "WarningsSheet.tsx"
Cohesion: 0.27
Nodes (9): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding (+1 more)

### Community 35 - "MyRosterView.tsx"
Cohesion: 0.18
Nodes (18): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+10 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 38 - "ref_node_assert"
Cohesion: 0.13
Nodes (5): ctx(), EARLY, LATE, LATE, nurse

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "RulesTab.tsx"
Cohesion: 0.07
Nodes (34): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 7. Rules, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+26 more)

### Community 41 - "makeNurse"
Cohesion: 0.15
Nodes (17): SchedulingEngine, clearYearToDateCache(), hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account() (+9 more)

### Community 42 - "PublishedRosterView.tsx"
Cohesion: 0.18
Nodes (19): RFC-5545, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, buildNurseIcs(), buildNurseRosterIcs(), downloadIcsFile(), escapeIcsText() (+11 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "hoursPolicy.ts"
Cohesion: 0.29
Nodes (10): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditOnDate(), leaveCreditPerDay() (+2 more)

### Community 45 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (34): MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), CreateScheduleModalProps, DeleteScheduleModal(), FairnessModal(), SwapManagerModal() (+26 more)

### Community 46 - "NurseTimesheetModal.tsx"
Cohesion: 0.32
Nodes (9): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), csvCell(), downloadCsv() (+1 more)

### Community 47 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 48 - "ShareModal.tsx"
Cohesion: 0.36
Nodes (8): 16. History of work (for context), ShareModal(), TabType, ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster(), Invitation

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (25): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+17 more)

### Community 50 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 51 - "DoctorSession"
Cohesion: 0.25
Nodes (14): EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), DeleteDoctorShiftResult, getWeekdayFromIsoDate(), PopulateRecurringDoctorSessionsResult (+6 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "rosterSaving.test.ts"
Cohesion: 0.33
Nodes (3): DOCTOR, handEdit, leave()

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
Cohesion: 0.13
Nodes (11): ScheduleValidator, DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run() (+3 more)

### Community 66 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 67 - "fixtures.ts"
Cohesion: 0.11
Nodes (22): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+14 more)

### Community 69 - "FirestoreRepository.ts"
Cohesion: 0.29
Nodes (7): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), mergeScheduleRanges(), ScheduleOverlap, ScheduleRange

### Community 71 - "continuousHours.test.ts"
Cohesion: 0.18
Nodes (10): balance(), duties, first, history, long, nurse, periods, previousShifts (+2 more)

### Community 74 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 75 - "ScheduleValidator.ts"
Cohesion: 0.14
Nodes (29): 10. Hours, Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay() (+21 more)

## Knowledge Gaps
- **422 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+417 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 520 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `ExportModal.tsx`, `AvailabilityView.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `staffRequestService.ts`, `App.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `ShortcutsModal.tsx`, `PublishModal.tsx`, `HistoryView.tsx`, `types/index.ts`, `WarningsSheet.tsx`, `MyRosterView.tsx`, `RulesTab.tsx`, `makeNurse`, `PublishedRosterView.tsx`, `SchedulesView.tsx`, `NurseTimesheetModal.tsx`, `ShareModal.tsx`, `WorkbookGrid.tsx`, `DoctorSession`, `ScheduleValidator.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `ExportModal.tsx`, `AvailabilityView.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `staffRequestService.ts`, `App.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `ShortcutsModal.tsx`, `PublishModal.tsx`, `HistoryView.tsx`, `types/index.ts`, `WarningsSheet.tsx`, `MyRosterView.tsx`, `RulesTab.tsx`, `PublishedRosterView.tsx`, `SchedulesView.tsx`, `NurseTimesheetModal.tsx`, `ShareModal.tsx`, `WorkbookGrid.tsx`, `DoctorSession`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `uuid` connect `react` to `Assignment`, `SchedulingEngine.ts`, `FirestoreRepository.ts`, `package.json`, `staffRequestService.ts`, `ShareModal.tsx`, `PublishModal.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _422 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.09668025626092021 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09176470588235294 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09080841638981174 - nodes in this community are weakly interconnected._