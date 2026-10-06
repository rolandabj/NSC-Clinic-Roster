# Graph Report - NSC-Clinic-Roster  (2026-10-06)

## Corpus Check
- 216 files · ~267,092 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1588 nodes · 5878 edges · 76 communities (70 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 162 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `573566f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- ExportModal.tsx
- ScheduleValidator.ts
- clinicModel.test.ts
- nurseRosterService.ts
- authService.ts
- SettingsView.tsx
- authService
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- getRepository
- App.tsx
- CollectionSyncer
- DashboardView.tsx
- seedRunner.ts
- firebaseIdentityService.ts
- react
- compilerOptions
- RulesTab.tsx
- IRepository.ts
- EntityForCollection
- devDependencies
- PublishModal.tsx
- ReportsView.tsx
- versionRestore.test.ts
- scripts
- types/index.ts
- assignmentChecks.ts
- dateFormatter.ts
- lastResort.test.ts
- CreateScheduleModal.tsx
- SchedulingEngine.ts
- IRepository
- What You Must Do When Invoked
- LiveCollectionCache
- fixtures.ts
- hoursTopUp.test.ts
- publicRosterService.ts
- makeNurse
- NSC Clinic Roster: complete project guide
- ref_node_assert
- createApiApp
- quotaTracker
- explainCell.test.ts
- server.ts
- hoursBalance.ts
- WorkbookGrid.tsx
- savingSafety.test.ts
- PublishedRosterView.tsx
- graphify reference: extra exports and benchmark
- continuousHours.test.ts
- icsExportService.ts
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
- approvedDayOff.test.ts
- Sidebar.tsx
- teamRoster.test.ts
- DatabaseTab.tsx
- hoursRules.test.ts
- weekHours.test.ts
- createLiveReconciler
- WhoCanCover.tsx
- weekend.ts
- engineRules.test.ts
- README.md

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 95 edges
2. `Assignment` - 93 edges
3. `Schedule` - 84 edges
4. `DutyWindow` - 80 edges
5. `Nurse` - 80 edges
6. `react` - 72 edges
7. `useDialogA11y()` - 64 edges
8. `lucide-react` - 63 edges
9. `ClinicalRole` - 63 edges
10. `Doctor` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
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

## Communities (76 total, 6 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.06
Nodes (115): 5. Data model (Firestore collections), uuid, MenuButton(), MenuButtonProps, MenuItem, BulkImportModalProps, DeleteScheduleModal(), DeleteScheduleModalProps (+107 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (49): 10. Hours, jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES (+41 more)

### Community 2 - "ScheduleValidator.ts"
Cohesion: 0.17
Nodes (28): 7. Rules, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), isFreeDuring() (+20 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (22): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), dayMonth() (+14 more)

### Community 5 - "authService.ts"
Cohesion: 0.14
Nodes (20): signOutSafely(), TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, AllRequestsPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps (+12 more)

### Community 6 - "SettingsView.tsx"
Cohesion: 0.10
Nodes (41): ClinicTab(), ClinicTabProps, DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab(), HolidaysTabProps (+33 more)

### Community 7 - "authService"
Cohesion: 0.08
Nodes (13): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, othersOnRoster() (+5 more)

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.18
Nodes (20): AppShell(), bootstrap(), AppShellProps, AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+12 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.17
Nodes (13): express, express-rate-limit, helmet, authMiddleware(), BackendRole, Express, requireOwner, requirePlanner (+5 more)

### Community 13 - "getRepository"
Cohesion: 0.13
Nodes (38): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+30 more)

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (14): 4. Navigation and app shell, App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+6 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.11
Nodes (9): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+1 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.13
Nodes (21): SidebarProps, Card(), DashboardView(), DashboardViewProps, loadPlannerData(), longDate(), PlannerData, readStoredId() (+13 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.18
Nodes (11): ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup(), initializeDatabaseIfEmpty() (+3 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "react"
Cohesion: 0.16
Nodes (26): lucide-react, react, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice() (+18 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+15 more)

### Community 22 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 23 - "EntityForCollection"
Cohesion: 0.32
Nodes (4): FirestoreRepository, sanitizePayload(), toScheduleRange(), EntityForCollection

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.07
Nodes (48): nodemailer, Request, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+40 more)

### Community 26 - "ReportsView.tsx"
Cohesion: 0.08
Nodes (37): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), SortField (+29 more)

### Community 27 - "versionRestore.test.ts"
Cohesion: 0.19
Nodes (9): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, fingerprint(), syncScheduleAssignments(), october, octoberVersion (+1 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.07
Nodes (29): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, DoctorSessionSource, EmailLogKind, EmailLogStatus, InvitationStatus, LockMode (+21 more)

### Community 30 - "assignmentChecks.ts"
Cohesion: 0.23
Nodes (15): Other engine files, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), resolveRule(), addDays() (+7 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): isLastResortShift(), LAST_RESORT_NOTE, SchedulingEngine, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 33 - "CreateScheduleModal.tsx"
Cohesion: 0.21
Nodes (15): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), PeriodProratingBreakdown, WorkingHoursCalculationResult (+7 more)

### Community 34 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (32): FairnessModal(), coveredMinutes(), hoursToCover(), toMinutes(), FLOAT_ROLE_ID, isPendingLeave(), consecutiveLateRuleOf(), InternalSlot (+24 more)

### Community 35 - "IRepository"
Cohesion: 0.16
Nodes (7): repositoryManager, IRepository, DeleteDoctorShiftParams, PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult, WEEKDAY_FULL_NAMES, WeeklyPatternSlot

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "fixtures.ts"
Cohesion: 0.09
Nodes (25): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+17 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "publicRosterService.ts"
Cohesion: 0.25
Nodes (10): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+2 more)

### Community 41 - "makeNurse"
Cohesion: 0.12
Nodes (21): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy(), generateAll() (+13 more)

### Community 42 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.09
Nodes (20): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+12 more)

### Community 43 - "ref_node_assert"
Cohesion: 0.12
Nodes (10): ctx(), EARLY, LATE, CARD, EARLY, FULL, LATE, NC (+2 more)

### Community 44 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "hoursBalance.ts"
Cohesion: 0.13
Nodes (26): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+18 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (25): 6. Clinic model (the business rules in plain English), How a run works, findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish (+17 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (8): clearYearToDateCache(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps, { initializeTestEnvironment }, requireRules

### Community 51 - "PublishedRosterView.tsx"
Cohesion: 0.27
Nodes (10): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), loadPublicRoster() (+2 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 54 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

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

### Community 66 - "Sidebar.tsx"
Cohesion: 0.20
Nodes (11): NAV_ITEMS, Sidebar(), ShortcutItem, SHORTCUTS, ShortcutsModalProps, DICTIONARY, i18n, Language (+3 more)

### Community 67 - "teamRoster.test.ts"
Cohesion: 0.26
Nodes (13): loadViewerData(), addDaysIso(), buildNurseRosterDoc(), buildTeamRosterSheet(), latestPublishedVersions(), shiftDetail(), syncNurseRosters(), todayIso() (+5 more)

### Community 68 - "DatabaseTab.tsx"
Cohesion: 0.73
Nodes (5): DatabaseTab(), checkBackup(), clearDatabase(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 69 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 70 - "weekHours.test.ts"
Cohesion: 0.15
Nodes (6): ScheduleValidator, EARLY, LATE, shifts, LONG, OCT

### Community 71 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 72 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 73 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 74 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

## Knowledge Gaps
- **451 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+446 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 570 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `ExportModal.tsx`, `nurseRosterService.ts`, `authService.ts`, `SettingsView.tsx`, `authService`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `ReportsView.tsx`, `CreateScheduleModal.tsx`, `fixtures.ts`, `publicRosterService.ts`, `NSC Clinic Roster: complete project guide`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `Sidebar.tsx`, `DatabaseTab.tsx`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `ExportModal.tsx`, `nurseRosterService.ts`, `authService.ts`, `SettingsView.tsx`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `ReportsView.tsx`, `CreateScheduleModal.tsx`, `publicRosterService.ts`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `Sidebar.tsx`, `DatabaseTab.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `Assignment` connect `SchedulesView.tsx` to `ExportModal.tsx`, `ScheduleValidator.ts`, `clinicModel.test.ts`, `nurseRosterService.ts`, `DashboardView.tsx`, `react`, `PublishModal.tsx`, `ReportsView.tsx`, `versionRestore.test.ts`, `types/index.ts`, `assignmentChecks.ts`, `lastResort.test.ts`, `SchedulingEngine.ts`, `fixtures.ts`, `makeNurse`, `ref_node_assert`, `explainCell.test.ts`, `hoursBalance.ts`, `WorkbookGrid.tsx`, `savingSafety.test.ts`, `continuousHours.test.ts`, `icsExportService.ts`, `teamRoster.test.ts`, `hoursRules.test.ts`, `weekHours.test.ts`, `engineRules.test.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _451 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06402877697841726 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08506493506493507 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._