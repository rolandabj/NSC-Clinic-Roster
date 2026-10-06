# Graph Report - NSC-Clinic-Roster  (2026-10-06)

## Corpus Check
- 212 files · ~258,543 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1549 nodes · 5704 edges · 79 communities (73 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 153 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae1e4336`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- ExportModal.tsx
- SchedulingEngine.ts
- clinicModel.test.ts
- nurseRosterService.ts
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
- notify
- compilerOptions
- RulesTab.tsx
- IRepository.ts
- FirestoreRepository
- devDependencies
- PublishModal.tsx
- ref_node_assert
- IRepository
- scripts
- types/index.ts
- scheduleTransactions.test.ts
- dateFormatter.ts
- sharing.test.ts
- CreateScheduleModal.tsx
- yearToDate.ts
- react
- What You Must Do When Invoked
- LiveCollectionCache
- fixtures.ts
- hoursTopUp.test.ts
- publicRosterService.ts
- yearFairness.test.ts
- ClinicRoster
- nurseClinicFloat.test.ts
- createApiApp
- SchedulesView.tsx
- makeNurse
- server.ts
- hoursPolicy.ts
- WorkbookGrid.tsx
- savingSafety.test.ts
- resolveNurseHoursBalance
- graphify reference: extra exports and benchmark
- continuousHours.test.ts
- quotaTracker
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
- makeSchedule
- NurseSkillsTab.tsx
- analysisExportService.ts
- repository/index.ts
- hoursRules.test.ts
- preferenceFocus.test.ts
- useDialogA11y
- lastResort.test.ts
- NSC Clinic Roster: complete project guide
- WhoCanCover.tsx
- usePresence.ts
- README.md
- rosterSaving.test.ts
- 17. Known quirks and ideas for later

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 95 edges
2. `Assignment` - 90 edges
3. `Schedule` - 84 edges
4. `Nurse` - 80 edges
5. `DutyWindow` - 79 edges
6. `react` - 72 edges
7. `useDialogA11y()` - 64 edges
8. `lucide-react` - 63 edges
9. `ClinicalRole` - 63 edges
10. `Doctor` - 63 edges

## Surprising Connections (you probably didn't know these)
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `11. Saving, live updates, versions` --references--> `signOutSafely()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/signOut.ts
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts

## Import Cycles
- None detected.

## Communities (79 total, 6 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.09
Nodes (91): 5. Data model (Firestore collections), uuid, BulkImportModalProps, EditDoctorShiftModalProps, TIME_PRESETS, ExportModalProps, FairnessModalProps, NurseFairnessMetrics (+83 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (40): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+32 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.13
Nodes (35): 6. Clinic model (the business rules in plain English), How a run works, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes() (+27 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.06
Nodes (60): RFC-5545, dateLabel(), PublishedRosterSheet(), loadViewerData(), DayEntry, LoadState, mondayOf(), MONTHS (+52 more)

### Community 5 - "authService.ts"
Cohesion: 0.09
Nodes (31): LoginPageProps, AppShellProps, NAV_ITEMS, SidebarProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+23 more)

### Community 6 - "getRepository"
Cohesion: 0.29
Nodes (20): confirmDialog(), TemplateModal(), AccessManagementPanel(), ClinicTab(), DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab() (+12 more)

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
Cohesion: 0.15
Nodes (24): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+16 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.17
Nodes (13): express, express-rate-limit, helmet, authMiddleware(), BackendRole, Express, requireOwner, requirePlanner (+5 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (37): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+29 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.12
Nodes (9): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection (+1 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (18): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+10 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.18
Nodes (11): ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup(), initializeDatabaseIfEmpty() (+3 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "notify"
Cohesion: 0.14
Nodes (20): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+12 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (22): 7. Rules, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef (+14 more)

### Community 22 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 23 - "FirestoreRepository"
Cohesion: 0.28
Nodes (3): FirestoreRepository, sanitizePayload(), toScheduleRange()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.08
Nodes (49): 12. Publishing and nurse links, nodemailer, Request, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+41 more)

### Community 26 - "ref_node_assert"
Cohesion: 0.18
Nodes (6): LATE, nurse, DAY_DUTY, generateWeek(), H2_KEYWORDS, emptyProps

### Community 27 - "IRepository"
Cohesion: 0.12
Nodes (12): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository (+4 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.09
Nodes (27): lucide-react, isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind (+19 more)

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
Cohesion: 0.17
Nodes (19): CreateScheduleModal(), CreateScheduleModalProps, earlierPeriodTotals(), shiftIsoDate(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod() (+11 more)

### Community 34 - "yearToDate.ts"
Cohesion: 0.11
Nodes (25): FairnessModal(), YearToDate, YearToDateCounts, isLateDuty(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+17 more)

### Community 35 - "react"
Cohesion: 0.15
Nodes (15): react, ClinicTabProps, BUILT_IN_LEAVE_CODES, isBuiltInCode(), LeaveTabProps, LEAVE_COLOR_PALETTE, SaveStatus, SettingsDialogProps (+7 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "fixtures.ts"
Cohesion: 0.14
Nodes (17): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+9 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "publicRosterService.ts"
Cohesion: 0.23
Nodes (11): ShareModal(), ShareModalProps, TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster() (+3 more)

### Community 41 - "yearFairness.test.ts"
Cohesion: 0.11
Nodes (14): SchedulingEngine, hoursOnlyRules(), LATE, run(), generate(), dates, doctors, fill() (+6 more)

### Community 42 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 45 - "SchedulesView.tsx"
Cohesion: 0.10
Nodes (32): MenuButton(), MenuButtonProps, MenuItem, EditDoctorShiftModal(), SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId() (+24 more)

### Community 46 - "makeNurse"
Cohesion: 0.16
Nodes (9): ctx(), EARLY, LATE, EARLY, input(), LATE, softHoursLimit, week (+1 more)

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "hoursPolicy.ts"
Cohesion: 0.28
Nodes (8): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditPerDay(), leaveDaysInRange(), nurseLeaveHoursInRange()

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (26): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+18 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.15
Nodes (6): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues

### Community 51 - "resolveNurseHoursBalance"
Cohesion: 0.14
Nodes (18): 10. Hours, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, Other engine files, explainNurseDay(), plainReason(), round1(), shiftDate() (+10 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 54 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

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

### Community 65 - "makeSchedule"
Cohesion: 0.12
Nodes (14): ScheduleValidator, DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run() (+6 more)

### Community 66 - "NurseSkillsTab.tsx"
Cohesion: 0.20
Nodes (10): DatabaseTabProps, HolidaysTabProps, BUILT_IN, NurseSkillsTabProps, RESERVED_CODES, RulesTabProps, SeniorityTabProps, SaveNotifier (+2 more)

### Community 67 - "analysisExportService.ts"
Cohesion: 0.23
Nodes (10): ANALYSIS_FORMAT_VERSION, buildRosterAnalysis(), countBy(), FIELD_GUIDE, PROBLEM_RULES, problemRule(), RosterAnalysis, round1() (+2 more)

### Community 68 - "repository/index.ts"
Cohesion: 0.42
Nodes (7): DatabaseTab(), defaultFirebaseConfig, StorageMode, checkBackup(), clearDatabase(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 69 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 70 - "preferenceFocus.test.ts"
Cohesion: 0.22
Nodes (7): CARD, doctorOfAmy(), KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 71 - "useDialogA11y"
Cohesion: 0.10
Nodes (36): openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, fmtHours(), NurseTimesheetModal() (+28 more)

### Community 72 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 73 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.29
Nodes (7): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide

### Community 74 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 75 - "usePresence.ts"
Cohesion: 0.43
Nodes (5): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord

### Community 77 - "rosterSaving.test.ts"
Cohesion: 0.29
Nodes (4): DOCTOR, generateAll(), handEdit, leave()

### Community 78 - "17. Known quirks and ideas for later"
Cohesion: 0.50
Nodes (3): 17. Known quirks and ideas for later, WalkthroughModal(), WalkthroughModalProps

## Knowledge Gaps
- **442 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+437 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 550 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `ExportModal.tsx`, `nurseRosterService.ts`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `notify`, `RulesTab.tsx`, `PublishModal.tsx`, `ref_node_assert`, `types/index.ts`, `CreateScheduleModal.tsx`, `publicRosterService.ts`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `NurseSkillsTab.tsx`, `repository/index.ts`, `useDialogA11y`, `WhoCanCover.tsx`, `usePresence.ts`, `17. Known quirks and ideas for later`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `types/index.ts` to `Assignment`, `ExportModal.tsx`, `nurseRosterService.ts`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `notify`, `RulesTab.tsx`, `PublishModal.tsx`, `CreateScheduleModal.tsx`, `react`, `publicRosterService.ts`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `NurseSkillsTab.tsx`, `repository/index.ts`, `useDialogA11y`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `I18nManager` connect `I18nManager` to `authService.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _442 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.08757297748123437 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10083256244218317 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12775842044134728 - nodes in this community are weakly interconnected._