# Graph Report - NSC-Clinic-Roster  (2026-10-06)

## Corpus Check
- 219 files · ~271,393 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1609 nodes · 5983 edges · 79 communities (71 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 170 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fdc89cfd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- dutyDurationHours
- explainCell.ts
- clinicModel.test.ts
- nurseRosterService.ts
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
- EntityForCollection
- DashboardView.tsx
- fixtures.ts
- firebaseIdentityService.ts
- getRepository
- compilerOptions
- RulesTab.tsx
- seedRunner.ts
- FirestoreRepository
- devDependencies
- PublishModal.tsx
- yearToDate.ts
- IRepository
- scripts
- types/index.ts
- ScheduleValidator.ts
- dateFormatter.ts
- ref_node_assert
- dialogs.tsx
- SchedulingEngine.ts
- analysisExportService.ts
- What You Must Do When Invoked
- scheduleTransactions.test.ts
- analysisExport.test.ts
- hoursTopUp.test.ts
- publicRosterService.ts
- makeNurse
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- apiApp.ts
- quotaTracker
- requestFindings.test.ts
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
- ClinicTab.tsx
- DatabaseTab.tsx
- hoursRules.test.ts
- weekHours.test.ts
- createLiveReconciler
- SchedulesView.tsx
- ClinicRoster
- engineRules.test.ts
- holidayLeave.ts
- README.md
- lastResort.test.ts
- shiftIds.test.ts

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 96 edges
2. `Assignment` - 94 edges
3. `Schedule` - 84 edges
4. `DutyWindow` - 80 edges
5. `Nurse` - 80 edges
6. `react` - 73 edges
7. `useDialogA11y()` - 64 edges
8. `lucide-react` - 63 edges
9. `ClinicalRole` - 63 edges
10. `Doctor` - 63 edges

## Surprising Connections (you probably didn't know these)
- `9. Checking a roster (`src/services/validation/ScheduleValidator.ts`)` --references--> `recordHolidayDayOff()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/requests/staffRequestService.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `11. Saving, live updates, versions` --references--> `signOutSafely()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/signOut.ts

## Import Cycles
- None detected.

## Communities (79 total, 8 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.06
Nodes (131): 5. Data model (Firestore collections), jspdf, jspdf-autotable, uuid, xlsx, BulkImportModalProps, EditDoctorShiftModalProps, ExportModal() (+123 more)

### Community 1 - "dutyDurationHours"
Cohesion: 0.36
Nodes (9): ReportsView(), fmtHours(), HoursAccountingSheet(), dutyDurationHours(), hoursHistoryOverlaps(), calculateClinicHoursMetrics(), calculateDutyDurationHours, calculateNurseHoursAccounting() (+1 more)

### Community 2 - "explainCell.ts"
Cohesion: 0.12
Nodes (26): 7. Rules, ClinicSetup, BlockedShift, describeRequest(), explainDay(), explainNurseDay(), ExplainNurseDayInput, pendingLeaveOn() (+18 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.11
Nodes (37): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), loadViewerData(), LoadState, mondayOf(), MONTHS, MyRosterView() (+29 more)

### Community 5 - "authService.ts"
Cohesion: 0.13
Nodes (22): LoginPageProps, signOutSafely(), AppShellProps, TopBar(), TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps (+14 more)

### Community 6 - "notify"
Cohesion: 0.18
Nodes (31): confirmDialog(), notify(), AccessManagementPanel(), DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab() (+23 more)

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
Cohesion: 0.13
Nodes (24): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+16 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (11): AuthUser, BackendRole, Express, Request, requireOwner, ROLE_HIERARCHY, authRouter, DispatchResult (+3 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (38): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+30 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.16
Nodes (4): 11. Saving, live updates, versions, saveHolidayLeave(), CollectionSyncer, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (20): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+12 more)

### Community 17 - "fixtures.ts"
Cohesion: 0.14
Nodes (11): ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, LONG, NOV, OCT, OCT (+3 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "getRepository"
Cohesion: 0.20
Nodes (20): lucide-react, react, openStack, useDialogA11y(), BulkImportModal(), CreateScheduleModal(), CreateScheduleModalProps, DeleteScheduleModal() (+12 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+15 more)

### Community 22 - "seedRunner.ts"
Cohesion: 0.12
Nodes (25): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+17 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.08
Nodes (39): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+31 more)

### Community 26 - "yearToDate.ts"
Cohesion: 0.17
Nodes (19): FairnessModal(), nurseClinicRoleOf(), YearToDate, daysBefore(), loadClinicSetup(), isLateDuty(), computeYearToDate(), earlierRostersThisYear() (+11 more)

### Community 27 - "IRepository"
Cohesion: 0.11
Nodes (15): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments() (+7 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.07
Nodes (32): isPairing(), PREFERENCE_FOCUS_LABELS, othersOnRoster(), STALE_MS, TAB_ID, usePresence(), addDays(), iso() (+24 more)

### Community 30 - "ScheduleValidator.ts"
Cohesion: 0.17
Nodes (20): Other engine files, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), isLastResortShift(), LAST_RESORT_NOTE (+12 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "ref_node_assert"
Cohesion: 0.12
Nodes (10): ctx(), EARLY, LATE, DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC (+2 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 34 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (32): Entry points, bloodCollectionRole(), canBeFreeNurse(), coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover() (+24 more)

### Community 35 - "analysisExportService.ts"
Cohesion: 0.19
Nodes (15): resolveClinicSetup(), ANALYSIS_FORMAT, ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy(), downloadRosterAnalysis(), FIELD_GUIDE (+7 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "scheduleTransactions.test.ts"
Cohesion: 0.12
Nodes (9): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS, apps, { initializeTestEnvironment } (+1 more)

### Community 38 - "analysisExport.test.ts"
Cohesion: 0.14
Nodes (14): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+6 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "publicRosterService.ts"
Cohesion: 0.24
Nodes (11): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+3 more)

### Community 41 - "makeNurse"
Cohesion: 0.13
Nodes (18): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), CARD (+10 more)

### Community 42 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.18
Nodes (10): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+2 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "apiApp.ts"
Cohesion: 0.17
Nodes (13): express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer() (+5 more)

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "requestFindings.test.ts"
Cohesion: 0.15
Nodes (8): ScheduleValidator, LATE, schedule, wishFindings(), EARLY, LATE, restFindings(), shifts

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (34): 10. Hours, leaveCountingOnHoliday(), askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+26 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (23): 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), How a run works, findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption (+15 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.11
Nodes (14): clearYearToDateCache(), forgetCachedRoster(), Desired, fingerprint(), Known, planSync(), SyncPlan, afterShiftsSaved() (+6 more)

### Community 51 - "PublishedRosterView.tsx"
Cohesion: 0.48
Nodes (5): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, withoutBackups(), loadPublicRoster()

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
Cohesion: 0.16
Nodes (15): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, canAccessRoute() (+7 more)

### Community 67 - "ClinicTab.tsx"
Cohesion: 0.21
Nodes (10): ClinicTab(), ClinicTabProps, EmailTabProps, SaveStatus, WEEKDAY_NAMES, SettingsViewProps, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS (+2 more)

### Community 68 - "DatabaseTab.tsx"
Cohesion: 0.57
Nodes (6): DatabaseTab(), defaultFirebaseConfig, checkBackup(), clearDatabase(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 69 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 71 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 72 - "SchedulesView.tsx"
Cohesion: 0.08
Nodes (44): MenuButton(), MenuButtonProps, MenuItem, EditDoctorShiftModal(), TIME_PRESETS, SwapManagerModal(), VersionCompareModal(), readStoredScheduleId() (+36 more)

### Community 73 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 74 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 75 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (9): applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy(), withHolidaysAtZero() (+1 more)

### Community 77 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 78 - "shiftIds.test.ts"
Cohesion: 0.25
Nodes (7): dates, doctors, fill(), LATE, nurses, schedule, sessions

## Knowledge Gaps
- **454 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+449 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 575 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `Assignment`, `nurseRosterService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `fixtures.ts`, `RulesTab.tsx`, `PublishModal.tsx`, `types/index.ts`, `dialogs.tsx`, `publicRosterService.ts`, `NSC Clinic Roster: complete project guide`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `Sidebar.tsx`, `ClinicTab.tsx`, `DatabaseTab.tsx`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `Assignment`, `nurseRosterService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `dialogs.tsx`, `publicRosterService.ts`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `Sidebar.tsx`, `ClinicTab.tsx`, `DatabaseTab.tsx`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `explainCell.ts`, `clinicModel.test.ts`, `nurseRosterService.ts`, `DashboardView.tsx`, `fixtures.ts`, `getRepository`, `PublishModal.tsx`, `yearToDate.ts`, `IRepository`, `types/index.ts`, `ScheduleValidator.ts`, `ref_node_assert`, `SchedulingEngine.ts`, `analysisExportService.ts`, `analysisExport.test.ts`, `makeNurse`, `nurseClinicFloat.test.ts`, `requestFindings.test.ts`, `hoursBalance.ts`, `WorkbookGrid.tsx`, `savingSafety.test.ts`, `continuousHours.test.ts`, `icsExportService.ts`, `hoursRules.test.ts`, `weekHours.test.ts`, `SchedulesView.tsx`, `engineRules.test.ts`, `shiftIds.test.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _454 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.055424528301886794 - nodes in this community are weakly interconnected._
- **Should `explainCell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12096774193548387 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._