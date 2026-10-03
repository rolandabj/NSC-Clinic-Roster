# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 182 files · ~224,568 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1352 nodes · 4931 edges · 74 communities (68 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 120 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d668289`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- shared.tsx
- ExportModal.tsx
- clinicModel.test.ts
- PublishView.tsx
- explainCell.ts
- react
- quotaTracker
- firestore-rules/package.json
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
- navigation.ts
- compilerOptions
- yearToDate.ts
- authService.ts
- IRepository.ts
- devDependencies
- analysisExportService.ts
- SchedulesView.tsx
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- icsExportService.ts
- RulesTab.tsx
- requestFindings.test.ts
- fixtures.ts
- What You Must Do When Invoked
- emailService.ts
- ref_node_assert
- SettingsView.tsx
- hoursRules.test.ts
- makeNurse
- LiveCollectionCache
- rosterSaving.test.ts
- getRepository
- rules.test.mjs
- IRepository
- WorkbookGrid.tsx
- SchedulingEngine.ts
- nurseRosterService.ts
- NSC Clinic Roster: complete project guide
- ClinicContextState
- graphify reference: extra exports and benchmark
- lastResort.test.ts
- hoursPolicy.ts
- MyRosterView.tsx
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
- access.ts
- computeScheduleDiff
- repository/index.ts
- firebaseConfig.ts
- yearSeed.ts
- applyPreferenceFocus
- calendar.ts
- liveCollectionCache.ts

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
- `4. Navigation and app shell` --references--> `AppShell()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/layout/AppShell.tsx

## Import Cycles
- None detected.

## Communities (74 total, 6 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.12
Nodes (72): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseFairnessMetrics, ProposedSwap, PublishModalProps (+64 more)

### Community 1 - "shared.tsx"
Cohesion: 0.13
Nodes (26): DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab(), HolidaysTabProps, BUILT_IN_LEAVE_CODES, isBuiltInCode() (+18 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (61): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+53 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.15
Nodes (28): 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink() (+20 more)

### Community 5 - "explainCell.ts"
Cohesion: 0.22
Nodes (14): Other engine files, BlockedShift, explainDay(), explainNurseDay(), ExplainNurseDayInput, pendingLeaveOn(), plainReason(), PossibleShift (+6 more)

### Community 6 - "react"
Cohesion: 0.13
Nodes (33): lucide-react, react, uuid, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState (+25 more)

### Community 7 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 8 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (25): firebase, name, private, type, version, autoprefixer, cors, date-fns (+17 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.17
Nodes (21): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.14
Nodes (16): express, express-rate-limit, helmet, vite, startServer(), authMiddleware(), AuthUser, BackendRole (+8 more)

### Community 13 - "authService"
Cohesion: 0.14
Nodes (4): authorizedFetch(), authService, computePrivileges(), getAppAuth()

### Community 14 - "App.tsx"
Cohesion: 0.14
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.17
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.15
Nodes (24): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+16 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.14
Nodes (14): daysBefore(), findPreviousSchedule(), loadClinicSetup(), ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+6 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "navigation.ts"
Cohesion: 0.18
Nodes (12): NAV_ITEMS, SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DICTIONARY, i18n, Language (+4 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.16
Nodes (20): FairnessModal(), nurseClinicRoleOf(), YearToDate, isLateDuty(), lateDutyThreshold(), cacheKey(), computeYearToDate(), earlierRostersThisYear() (+12 more)

### Community 22 - "authService.ts"
Cohesion: 0.26
Nodes (10): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL, UserPrivileges, UserProfile (+2 more)

### Community 23 - "IRepository.ts"
Cohesion: 0.18
Nodes (6): FirebaseClientConfig, FirestoreRepository, sanitizePayload(), SubscribeCallback, Unsubscribe, CollectionName

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "analysisExportService.ts"
Cohesion: 0.17
Nodes (15): VersionViewModal(), FLOAT_ROLE_ID, isFloatShift(), isExclusiveNurseClinic(), ANALYSIS_FORMAT_VERSION, buildRosterAnalysis(), countBy(), FIELD_GUIDE (+7 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.06
Nodes (60): 13. Screens in detail, MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), SwapManagerModal() (+52 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.06
Nodes (31): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus (+23 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "icsExportService.ts"
Cohesion: 0.12
Nodes (23): RFC-5545, PublishedRosterView(), loadPublishedRoster(), buildNurseIcs(), buildNurseRosterIcs(), downloadIcsFile(), escapeIcsText(), foldLine() (+15 more)

### Community 33 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (22): 7. Rules, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef (+14 more)

### Community 34 - "requestFindings.test.ts"
Cohesion: 0.17
Nodes (7): ScheduleValidator, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 35 - "fixtures.ts"
Cohesion: 0.13
Nodes (20): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+12 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "emailService.ts"
Cohesion: 0.21
Nodes (10): nodemailer, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult, ServerEmailConfig (+2 more)

### Community 38 - "ref_node_assert"
Cohesion: 0.18
Nodes (5): ctx(), EARLY, LATE, LATE, nurse

### Community 39 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (17): AccessManagementPanel(), ClinicTab(), ClinicTabProps, EmailTab(), EmailTabProps, SeniorityTab(), SaveStatus, SpecialtiesTab() (+9 more)

### Community 40 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 41 - "makeNurse"
Cohesion: 0.17
Nodes (15): clearYearToDateCache(), hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+7 more)

### Community 43 - "rosterSaving.test.ts"
Cohesion: 0.12
Nodes (11): SchedulingEngine, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run() (+3 more)

### Community 44 - "getRepository"
Cohesion: 0.24
Nodes (18): ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, NurseSelfServicePanel(), getRepository(), cancelAvailabilityRequest(), cancelLeaveRequest(), daysInclusive() (+10 more)

### Community 45 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 46 - "IRepository"
Cohesion: 0.15
Nodes (11): removeNurseRoster(), revokeNurseLink(), removePublicRoster(), repositoryManager, IRepository, deleteEntireSchedule(), ScheduleDeleteResult, clearDatabase() (+3 more)

### Community 47 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (24): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, ProblemsPanelProps (+16 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.17
Nodes (28): bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes() (+20 more)

### Community 49 - "nurseRosterService.ts"
Cohesion: 0.21
Nodes (12): dayMonth(), formatRosterAsText(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, nurseCalendarUrl(), nurseWebcalUrl(), origin(), RegenerateNurseLinkResult (+4 more)

### Community 50 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.15
Nodes (11): 0. Quick start for a new chat, 10. Hours, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+3 more)

### Community 51 - "ClinicContextState"
Cohesion: 0.17
Nodes (12): 4. Navigation and app shell, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+4 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 54 - "hoursPolicy.ts"
Cohesion: 0.29
Nodes (10): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditOnDate(), leaveCreditPerDay() (+2 more)

### Community 55 - "MyRosterView.tsx"
Cohesion: 0.31
Nodes (10): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), addDaysIso() (+2 more)

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

### Community 66 - "access.ts"
Cohesion: 0.39
Nodes (6): 3. Users, roles and access, TopBar(), canAccessRoute(), canApproveRequests(), canEditClinicData(), VIEWER_ROUTES

### Community 67 - "computeScheduleDiff"
Cohesion: 0.29
Nodes (6): 11. Saving, live updates, versions, computeScheduleDiff(), formatAssignment(), fingerprint(), syncScheduleAssignments(), diff()

### Community 68 - "repository/index.ts"
Cohesion: 0.43
Nodes (6): DatabaseTab(), defaultFirebaseConfig, StorageMode, checkBackup(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 69 - "firebaseConfig.ts"
Cohesion: 0.33
Nodes (4): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 70 - "yearSeed.ts"
Cohesion: 0.33
Nodes (6): YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 71 - "applyPreferenceFocus"
Cohesion: 0.33
Nodes (6): 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, applyPreferenceFocus(), GenerationResult

### Community 72 - "calendar.ts"
Cohesion: 0.53
Nodes (4): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument()

### Community 73 - "liveCollectionCache.ts"
Cohesion: 0.40
Nodes (4): CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

## Knowledge Gaps
- **378 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+373 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 463 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `shared.tsx`, `ExportModal.tsx`, `PublishView.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `navigation.ts`, `authService.ts`, `SchedulesView.tsx`, `RulesTab.tsx`, `SettingsView.tsx`, `getRepository`, `WorkbookGrid.tsx`, `NSC Clinic Roster: complete project guide`, `MyRosterView.tsx`, `access.ts`, `repository/index.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `shared.tsx`, `access.ts`, `ExportModal.tsx`, `PublishView.tsx`, `repository/index.ts`, `RulesTab.tsx`, `SettingsView.tsx`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `navigation.ts`, `authService.ts`, `MyRosterView.tsx`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `ExportModal.tsx`, `clinicModel.test.ts`, `PublishView.tsx`, `explainCell.ts`, `react`, `DashboardView.tsx`, `yearToDate.ts`, `analysisExportService.ts`, `SchedulesView.tsx`, `types/index.ts`, `icsExportService.ts`, `requestFindings.test.ts`, `fixtures.ts`, `ref_node_assert`, `hoursRules.test.ts`, `makeNurse`, `rosterSaving.test.ts`, `WorkbookGrid.tsx`, `SchedulingEngine.ts`, `nurseRosterService.ts`, `computeScheduleDiff`, `applyPreferenceFocus`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _378 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.11627906976744186 - nodes in this community are weakly interconnected._
- **Should `shared.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13068181818181818 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06664198445020363 - nodes in this community are weakly interconnected._