# Graph Report - NSC-Clinic-Roster  (2026-10-04)

## Corpus Check
- 193 files · ~239,058 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1432 nodes · 5302 edges · 76 communities (69 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 132 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d325fd5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- ExportModal.tsx
- analysisExportService.ts
- clinicModel.test.ts
- IRepository
- ScheduleValidator.ts
- confirmDialog
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
- react
- FirestoreRepository
- devDependencies
- getRepository
- HistoryView.tsx
- I18nManager
- scripts
- types/index.ts
- scheduleTransactions.test.ts
- dateFormatter.ts
- sharing.test.ts
- CreateScheduleModal.tsx
- nurseRosterService.ts
- What You Must Do When Invoked
- LiveCollectionCache
- ref_node_assert
- hoursTopUp.test.ts
- RulesTab.tsx
- makeNurse
- icsExportService.ts
- nurseClinicFloat.test.ts
- hoursPolicy.ts
- SchedulesView.tsx
- rosterExportService.ts
- requestFindings.test.ts
- NSC Clinic Roster: complete project guide
- WorkbookGrid.tsx
- SettingsView.tsx
- doctorScheduleService.ts
- graphify reference: extra exports and benchmark
- dialogs.tsx
- emailService.ts
- calendar.ts
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
- lastResort.test.ts
- FirestoreRepository.ts
- WarningsSheet.tsx
- continuousHours.test.ts
- SchedulingEngine.ts
- repository/index.ts
- hoursRules.test.ts
- WhoCanCover.tsx
- README.md

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 93 edges
2. `Assignment` - 84 edges
3. `Nurse` - 80 edges
4. `Schedule` - 80 edges
5. `DutyWindow` - 78 edges
6. `react` - 71 edges
7. `useDialogA11y()` - 64 edges
8. `ClinicalRole` - 63 edges
9. `lucide-react` - 62 edges
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
- `13. Screens in detail` --references--> `AllRequestsPanel()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/views/AllRequestsPanel.tsx

## Import Cycles
- None detected.

## Communities (76 total, 7 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.07
Nodes (105): 3. Users, roles and access, 5. Data model (Firestore collections), uuid, Request, EmailHtmlPreview(), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps (+97 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (35): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+27 more)

### Community 2 - "analysisExportService.ts"
Cohesion: 0.12
Nodes (32): 6. Clinic model (the business rules in plain English), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover() (+24 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "IRepository"
Cohesion: 0.13
Nodes (18): 12. Publishing and nurse links, PublishModal(), PublishView(), ensureNurseLink(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink(), syncNurseRosters() (+10 more)

### Community 5 - "ScheduleValidator.ts"
Cohesion: 0.14
Nodes (30): 10. Hours, fmtHours(), HoursAccountingSheet(), BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift (+22 more)

### Community 6 - "confirmDialog"
Cohesion: 0.14
Nodes (30): confirmDialog(), DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab(), HolidaysTabProps, BUILT_IN_LEAVE_CODES (+22 more)

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
Cohesion: 0.14
Nodes (25): 4. Navigation and app shell, AppShell(), bootstrap(), AppShellProps, AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+17 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (15): express, express-rate-limit, helmet, vite, startServer(), authMiddleware(), BackendRole, Express (+7 more)

### Community 13 - "authService"
Cohesion: 0.08
Nodes (14): authorizedFetch(), authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider (+6 more)

### Community 14 - "App.tsx"
Cohesion: 0.14
Nodes (13): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps, LoadErrorBoundary (+5 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.15
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (24): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+16 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.15
Nodes (12): latestPublishedVersion(), loadEarlierRosters(), ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup() (+4 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.23
Nodes (10): NAV_ITEMS, SidebarProps, DashboardViewProps, DICTIONARY, i18n, Language, t(), Translations (+2 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.11
Nodes (26): FairnessModal(), YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), consecutiveLateRuleOf(), isLateDuty(), lateDutyThreshold() (+18 more)

### Community 22 - "react"
Cohesion: 0.12
Nodes (31): lucide-react, react, notify(), openStack, useDialogA11y(), TopBarProps, AuthModal(), AuthModalProps (+23 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "getRepository"
Cohesion: 0.14
Nodes (25): 16. History of work (for context), ShareModal(), TabType, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE (+17 more)

### Community 26 - "HistoryView.tsx"
Cohesion: 0.13
Nodes (18): 11. Saving, live updates, versions, DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), CHANGE_LABELS, VersionCompareModal(), VersionViewModal(), HistoryView() (+10 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.07
Nodes (30): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, DoctorSessionSource, EmailLogKind, EmailLogStatus, Invitation, InvitationStatus (+22 more)

### Community 30 - "scheduleTransactions.test.ts"
Cohesion: 0.14
Nodes (6): __dirname, distServer, __filename, apps, { initializeTestEnvironment }, requireRules

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 34 - "CreateScheduleModal.tsx"
Cohesion: 0.26
Nodes (12): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+4 more)

### Community 35 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (25): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), downloadIcsFile() (+17 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.20
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "ref_node_assert"
Cohesion: 0.11
Nodes (10): clearYearToDateCache(), ctx(), EARLY, LATE, LATE, nurse, DAY_DUTY, LATE (+2 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (22): 7. Rules, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef (+14 more)

### Community 41 - "makeNurse"
Cohesion: 0.15
Nodes (22): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+14 more)

### Community 42 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "hoursPolicy.ts"
Cohesion: 0.29
Nodes (10): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditOnDate(), leaveCreditPerDay() (+2 more)

### Community 45 - "SchedulesView.tsx"
Cohesion: 0.24
Nodes (14): MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet() (+6 more)

### Community 46 - "rosterExportService.ts"
Cohesion: 0.15
Nodes (22): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), SortField (+14 more)

### Community 47 - "requestFindings.test.ts"
Cohesion: 0.17
Nodes (7): ScheduleValidator, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 48 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.18
Nodes (9): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, WalkthroughModal() (+1 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.13
Nodes (24): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+16 more)

### Community 50 - "SettingsView.tsx"
Cohesion: 0.24
Nodes (13): ClinicTab(), ClinicTabProps, EmailTab(), EmailTabProps, SaveStatus, SettingsView(), SettingsViewProps, WorkingHoursPeriodsPanel() (+5 more)

### Community 51 - "doctorScheduleService.ts"
Cohesion: 0.31
Nodes (11): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), PopulateRecurringDoctorSessionsResult (+3 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 54 - "emailService.ts"
Cohesion: 0.21
Nodes (11): nodemailer, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult, ServerEmailConfig (+3 more)

### Community 55 - "calendar.ts"
Cohesion: 0.53
Nodes (4): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument()

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

### Community 66 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 67 - "fixtures.ts"
Cohesion: 0.14
Nodes (12): EARLY, input(), LATE, softHoursLimit, week, ANNUAL_LEAVE, makeLeave(), SENIOR (+4 more)

### Community 68 - "lastResort.test.ts"
Cohesion: 0.20
Nodes (6): SchedulingEngine, DR_PEDS, ENT, FULL, PEDS, RULES

### Community 69 - "FirestoreRepository.ts"
Cohesion: 0.27
Nodes (8): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), mergeScheduleRanges(), ScheduleOverlap, ScheduleRange, CollectionName

### Community 70 - "WarningsSheet.tsx"
Cohesion: 0.27
Nodes (9): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding (+1 more)

### Community 71 - "continuousHours.test.ts"
Cohesion: 0.18
Nodes (10): balance(), duties, first, history, long, nurse, periods, previousShifts (+2 more)

### Community 72 - "SchedulingEngine.ts"
Cohesion: 0.15
Nodes (14): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FLOAT_ROLE_ID, isLastResortShift(), LAST_RESORT_NOTE, InternalSlot (+6 more)

### Community 73 - "repository/index.ts"
Cohesion: 0.38
Nodes (8): DatabaseTab(), defaultFirebaseConfig, StorageMode, checkBackup(), clearDatabase(), downloadFullDatabaseBackup(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 74 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 75 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

## Knowledge Gaps
- **414 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+409 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 508 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `ExportModal.tsx`, `confirmDialog`, `package.json`, `AppShell.tsx`, `authService`, `App.tsx`, `DashboardView.tsx`, `Sidebar.tsx`, `getRepository`, `HistoryView.tsx`, `CreateScheduleModal.tsx`, `nurseRosterService.ts`, `ref_node_assert`, `RulesTab.tsx`, `SchedulesView.tsx`, `rosterExportService.ts`, `NSC Clinic Roster: complete project guide`, `WorkbookGrid.tsx`, `SettingsView.tsx`, `doctorScheduleService.ts`, `dialogs.tsx`, `WarningsSheet.tsx`, `repository/index.ts`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `ExportModal.tsx`, `confirmDialog`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `Sidebar.tsx`, `getRepository`, `HistoryView.tsx`, `CreateScheduleModal.tsx`, `nurseRosterService.ts`, `RulesTab.tsx`, `SchedulesView.tsx`, `rosterExportService.ts`, `WorkbookGrid.tsx`, `SettingsView.tsx`, `doctorScheduleService.ts`, `dialogs.tsx`, `WarningsSheet.tsx`, `repository/index.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `ExportModal.tsx`, `analysisExportService.ts`, `clinicModel.test.ts`, `ScheduleValidator.ts`, `DashboardView.tsx`, `yearToDate.ts`, `react`, `HistoryView.tsx`, `types/index.ts`, `sharing.test.ts`, `nurseRosterService.ts`, `ref_node_assert`, `makeNurse`, `icsExportService.ts`, `nurseClinicFloat.test.ts`, `SchedulesView.tsx`, `rosterExportService.ts`, `requestFindings.test.ts`, `WorkbookGrid.tsx`, `doctorScheduleService.ts`, `fixtures.ts`, `continuousHours.test.ts`, `SchedulingEngine.ts`, `hoursRules.test.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _414 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.07492618110236221 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09716599190283401 - nodes in this community are weakly interconnected._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11806543385490754 - nodes in this community are weakly interconnected._