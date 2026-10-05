# Graph Report - roster-review  (2026-10-05)

## Corpus Check
- 201 files · ~244,252 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 1471 nodes · 5428 edges · 77 communities (68 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 135 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5cb46faf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- ExportModal.tsx
- SchedulingEngine.ts
- clinicModel.test.ts
- repositoryManager
- authService.ts
- notify
- authService
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- AvailabilityView.tsx
- App.tsx
- FirestoreRepository.ts
- DashboardView.tsx
- IRepository
- firebaseIdentityService.ts
- I18nManager
- compilerOptions
- weekend.ts
- getRepository
- FirestoreRepository
- devDependencies
- PublishModal.tsx
- teamRoster.test.ts
- VersionCompareModal
- scripts
- types/index.ts
- liveCollectionCache.ts
- dateFormatter.ts
- sharing.test.ts
- createApiApp
- yearToDate.ts
- nurseRosterService.ts
- What You Must Do When Invoked
- LiveCollectionCache
- analysisExport.test.ts
- hoursTopUp.test.ts
- RulesTab.tsx
- makeNurse
- icsExportService.ts
- nurseClinicFloat.test.ts
- hoursPolicy.ts
- SchedulesView
- hoursAccounting.ts
- server.ts
- publicRosterService.ts
- WorkbookGrid.tsx
- emailService.ts
- lucide-react
- graphify reference: extra exports and benchmark
- EmailTab.tsx
- dialogs.tsx
- Sidebar.tsx
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
- fixtures.ts
- NSC Clinic Roster: complete project guide
- ClinicRoster
- lastResort.test.ts
- continuousHours.test.ts
- PublishedRosterView.tsx
- scheduleTransactions.test.ts
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
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts
- `4. Navigation and app shell` --references--> `AppShell()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/layout/AppShell.tsx

## Import Cycles
- None detected.

## Communities (77 total, 9 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.10
Nodes (83): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModal(), EditDoctorShiftModalProps, TIME_PRESETS, ExportModalProps, FairnessModalProps, NurseFairnessMetrics (+75 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (43): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, VersionViewModal() (+35 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (41): FairnessModal(), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+33 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 5 - "authService.ts"
Cohesion: 0.13
Nodes (21): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps (+13 more)

### Community 6 - "notify"
Cohesion: 0.14
Nodes (35): confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), DatabaseTabProps, DutiesTab(), DutiesTabProps (+27 more)

### Community 7 - "authService"
Cohesion: 0.06
Nodes (17): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs() (+9 more)

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.17
Nodes (22): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (15): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+7 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.11
Nodes (38): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+30 more)

### Community 14 - "App.tsx"
Cohesion: 0.14
Nodes (13): 4. Navigation and app shell, App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+5 more)

### Community 15 - "FirestoreRepository.ts"
Cohesion: 0.13
Nodes (11): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, FirebaseClientConfig, SubscribeCallback (+3 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.15
Nodes (24): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+16 more)

### Community 17 - "IRepository"
Cohesion: 0.10
Nodes (28): DatabaseTab(), removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments(), IRepository, deleteEntireSchedule(), assertScheduleRangeAvailable() (+20 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 22 - "getRepository"
Cohesion: 0.18
Nodes (18): react, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps (+10 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.17
Nodes (25): 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink() (+17 more)

### Community 26 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 27 - "VersionCompareModal"
Cohesion: 0.50
Nodes (5): 11. Saving, live updates, versions, VersionCompareModal(), computeScheduleDiff(), formatAssignment(), diff()

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.06
Nodes (32): isPairing(), PREFERENCE_FOCUS_LABELS, InternalSlot, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind (+24 more)

### Community 30 - "liveCollectionCache.ts"
Cohesion: 0.33
Nodes (4): CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 33 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 34 - "yearToDate.ts"
Cohesion: 0.14
Nodes (20): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+12 more)

### Community 35 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (27): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+19 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 38 - "analysisExport.test.ts"
Cohesion: 0.15
Nodes (14): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+6 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): 7. Rules, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef (+15 more)

### Community 41 - "makeNurse"
Cohesion: 0.21
Nodes (13): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy(), generateAll() (+5 more)

### Community 42 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "hoursPolicy.ts"
Cohesion: 0.31
Nodes (9): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange() (+1 more)

### Community 45 - "SchedulesView"
Cohesion: 0.07
Nodes (38): MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), CreateScheduleModalProps, readStoredScheduleId(), SchedulesView(), storeScheduleId() (+30 more)

### Community 46 - "hoursAccounting.ts"
Cohesion: 0.15
Nodes (23): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), SortField (+15 more)

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "publicRosterService.ts"
Cohesion: 0.25
Nodes (10): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+2 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (28): 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, findCell(), QuickCellPopup(), QuickCellPopupProps (+20 more)

### Community 50 - "emailService.ts"
Cohesion: 0.20
Nodes (11): uuid, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+3 more)

### Community 51 - "lucide-react"
Cohesion: 0.28
Nodes (11): lucide-react, ClinicTab(), ClinicTabProps, SaveStatus, SettingsViewProps, WorkingHoursPeriodsPanel(), WorkingHoursPeriodsPanelProps, SEED_CLINIC_PROFILE (+3 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "EmailTab.tsx"
Cohesion: 0.29
Nodes (9): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), escapeHtml(), configured (+1 more)

### Community 54 - "dialogs.tsx"
Cohesion: 0.19
Nodes (11): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, NoticeTone, PendingConfirm (+3 more)

### Community 55 - "Sidebar.tsx"
Cohesion: 0.23
Nodes (10): NAV_ITEMS, SidebarProps, DashboardViewProps, DICTIONARY, i18n, Language, t(), Translations (+2 more)

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
Cohesion: 0.17
Nodes (7): ScheduleValidator, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 67 - "fixtures.ts"
Cohesion: 0.11
Nodes (15): LATE, nurse, EARLY, input(), LATE, softHoursLimit, week, ANNUAL_LEAVE (+7 more)

### Community 68 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.18
Nodes (10): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+2 more)

### Community 69 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 70 - "lastResort.test.ts"
Cohesion: 0.20
Nodes (6): SchedulingEngine, DR_PEDS, ENT, FULL, PEDS, RULES

### Community 71 - "continuousHours.test.ts"
Cohesion: 0.18
Nodes (10): balance(), duties, first, history, long, nurse, periods, previousShifts (+2 more)

### Community 72 - "PublishedRosterView.tsx"
Cohesion: 0.39
Nodes (7): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), withoutBackups(), buildTeamRosterSheet(), loadPublicRoster()

### Community 73 - "scheduleTransactions.test.ts"
Cohesion: 0.33
Nodes (3): apps, { initializeTestEnvironment }, requireRules

### Community 74 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 75 - "ScheduleValidator.ts"
Cohesion: 0.18
Nodes (25): 10. Hours, BlockedShift, explainNurseDay(), ExplainNurseDayInput, pendingLeaveOn(), plainReason(), PossibleShift, requestOn() (+17 more)

## Knowledge Gaps
- **426 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+421 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 523 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `SchedulesView.tsx`, `ExportModal.tsx`, `authService.ts`, `notify`, `authService`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `PublishModal.tsx`, `nurseRosterService.ts`, `RulesTab.tsx`, `SchedulesView`, `hoursAccounting.ts`, `publicRosterService.ts`, `WorkbookGrid.tsx`, `lucide-react`, `EmailTab.tsx`, `dialogs.tsx`, `Sidebar.tsx`, `fixtures.ts`, `NSC Clinic Roster: complete project guide`, `PublishedRosterView.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `SchedulesView.tsx`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `getRepository`, `PublishModal.tsx`, `nurseRosterService.ts`, `RulesTab.tsx`, `SchedulesView`, `hoursAccounting.ts`, `publicRosterService.ts`, `WorkbookGrid.tsx`, `EmailTab.tsx`, `dialogs.tsx`, `Sidebar.tsx`, `PublishedRosterView.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Assignment` connect `SchedulesView.tsx` to `ExportModal.tsx`, `SchedulingEngine.ts`, `clinicModel.test.ts`, `DashboardView.tsx`, `IRepository`, `getRepository`, `PublishModal.tsx`, `teamRoster.test.ts`, `types/index.ts`, `sharing.test.ts`, `yearToDate.ts`, `nurseRosterService.ts`, `analysisExport.test.ts`, `icsExportService.ts`, `nurseClinicFloat.test.ts`, `hoursAccounting.ts`, `WorkbookGrid.tsx`, `requestFindings.test.ts`, `fixtures.ts`, `continuousHours.test.ts`, `hoursRules.test.ts`, `ScheduleValidator.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _426 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10410224695938981 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0963265306122449 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11008325624421832 - nodes in this community are weakly interconnected._