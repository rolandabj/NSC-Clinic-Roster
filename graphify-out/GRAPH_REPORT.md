# Graph Report - NSC-Clinic-Roster  (2026-10-04)

## Corpus Check
- 186 files · ~233,140 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1393 nodes · 5076 edges · 73 communities (67 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 128 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c534c1dc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- ExportModal.tsx
- SchedulingEngine.ts
- clinicModel.test.ts
- PublishView.tsx
- explainCell.ts
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
- DashboardView.tsx
- seedRunner.ts
- firebaseIdentityService.ts
- Sidebar.tsx
- compilerOptions
- yearToDate.ts
- authService.ts
- FirestoreRepository
- devDependencies
- AllRequestsPanel.tsx
- Schedule
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- sharing.test.ts
- analysisExportService.ts
- workingHoursPeriodService.ts
- staffRequestService.ts
- What You Must Do When Invoked
- LiveCollectionCache
- fixtures.ts
- hoursTopUp.test.ts
- analysisExport.test.ts
- makeNurse
- preferenceFocus.test.ts
- nurseClinicFloat.test.ts
- hoursPolicy.ts
- SchedulesView.tsx
- hoursAccounting.ts
- requestFindings.test.ts
- NSC Clinic Roster: complete project guide
- WorkbookGrid.tsx
- IRepository
- doctorScheduleService.ts
- graphify reference: extra exports and benchmark
- AvailabilityView.tsx
- syncScheduleAssignments
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
- CreateScheduleModal.tsx
- explainCell.test.ts
- lastResort.test.ts
- IRepository.ts
- assignmentChecks.ts
- clinicSetupService.ts
- GenerationResult

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 91 edges
2. `Assignment` - 81 edges
3. `Nurse` - 79 edges
4. `DutyWindow` - 77 edges
5. `Schedule` - 74 edges
6. `react` - 71 edges
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

## Communities (73 total, 6 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.20
Nodes (48): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseFairnessMetrics, ProposedSwap, PublishModalProps (+40 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (40): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModal() (+32 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.16
Nodes (28): bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover() (+20 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.08
Nodes (49): 12. Publishing and nurse links, nodemailer, uuid, Request, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+41 more)

### Community 5 - "explainCell.ts"
Cohesion: 0.15
Nodes (21): Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+13 more)

### Community 6 - "getRepository"
Cohesion: 0.05
Nodes (106): 7. Rules, lucide-react, react, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState (+98 more)

### Community 7 - "firebaseConfig.ts"
Cohesion: 0.13
Nodes (8): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (26): firebase, name, private, type, version, autoprefixer, cors, date-fns (+18 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.14
Nodes (24): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+16 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (14): express, express-rate-limit, helmet, startServer(), authMiddleware(), AuthUser, BackendRole, Express (+6 more)

### Community 13 - "authService"
Cohesion: 0.14
Nodes (4): authorizedFetch(), authService, computePrivileges(), getAppAuth()

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.16
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.06
Nodes (68): RFC-5545, Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId() (+60 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.16
Nodes (14): ALL_COLLECTIONS, BackupCheck, clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup() (+6 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (15): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, canAccessRoute() (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.14
Nodes (21): nurseClinicRoleOf(), YearToDate, YearToDateCounts, isLateDuty(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+13 more)

### Community 22 - "authService.ts"
Cohesion: 0.13
Nodes (21): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps (+13 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "AllRequestsPanel.tsx"
Cohesion: 0.20
Nodes (14): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+6 more)

### Community 26 - "Schedule"
Cohesion: 0.11
Nodes (29): 11. Saving, live updates, versions, DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), ShareModalProps, CHANGE_LABELS, VersionCompareModal(), SOURCE_LABELS (+21 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.09
Nodes (24): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource (+16 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 33 - "analysisExportService.ts"
Cohesion: 0.11
Nodes (28): 10. Hours, 6. Clinic model (the business rules in plain English), cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso(), withDr(), WorkbookGrid() (+20 more)

### Community 34 - "workingHoursPeriodService.ts"
Cohesion: 0.46
Nodes (7): calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown

### Community 35 - "staffRequestService.ts"
Cohesion: 0.29
Nodes (11): NurseSelfServicePanel(), cancelAvailabilityRequest(), cancelLeaveRequest(), daysInclusive(), isPendingLeave(), listMyRequests(), PendingAvailabilityItem, PendingLeaveItem (+3 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.20
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "fixtures.ts"
Cohesion: 0.12
Nodes (14): LATE, nurse, ANNUAL_LEAVE, DAY_DUTY, UNPAID_LEAVE, D, E, L (+6 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "analysisExport.test.ts"
Cohesion: 0.15
Nodes (14): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+6 more)

### Community 41 - "makeNurse"
Cohesion: 0.13
Nodes (18): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+10 more)

### Community 42 - "preferenceFocus.test.ts"
Cohesion: 0.18
Nodes (11): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus, CARD, KHAN, LATE (+3 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "hoursPolicy.ts"
Cohesion: 0.33
Nodes (8): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange()

### Community 45 - "SchedulesView.tsx"
Cohesion: 0.20
Nodes (16): CoverageSheet(), LeaveAndLocksSheet(), ProblemsPanel(), ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheet() (+8 more)

### Community 46 - "hoursAccounting.ts"
Cohesion: 0.19
Nodes (15): fmtHours(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, SortField, TabMode, fmtHours(), HoursAccountingSheet() (+7 more)

### Community 47 - "requestFindings.test.ts"
Cohesion: 0.14
Nodes (8): ScheduleValidator, SENIOR, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 48 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.25
Nodes (7): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.22
Nodes (11): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+3 more)

### Community 50 - "IRepository"
Cohesion: 0.24
Nodes (6): removeNurseRoster(), revokeNurseLink(), repositoryManager, IRepository, deleteEntireSchedule(), saveEmailSettings()

### Community 51 - "doctorScheduleService.ts"
Cohesion: 0.29
Nodes (11): 13. Screens in detail, EditDoctorShiftModal(), DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult (+3 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AvailabilityView.tsx"
Cohesion: 0.38
Nodes (10): 3. Users, roles and access, ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, canApproveRequests(), canEditClinicData(), countPendingApprovals(), decideRequest() (+2 more)

### Community 54 - "syncScheduleAssignments"
Cohesion: 0.29
Nodes (5): 17. Known quirks and ideas for later, WalkthroughModal(), WalkthroughModalProps, fingerprint(), syncScheduleAssignments()

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

### Community 66 - "CreateScheduleModal.tsx"
Cohesion: 0.29
Nodes (10): CreateScheduleModal(), CreateScheduleModalProps, WorkingHoursCalculationResult, generateDoctorSessionsForDateRange(), populateRecurringDoctorSessionsForSchedule(), addDays(), iso(), monthEnd() (+2 more)

### Community 67 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 68 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 69 - "IRepository.ts"
Cohesion: 0.48
Nodes (4): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CollectionName

### Community 70 - "assignmentChecks.ts"
Cohesion: 0.60
Nodes (5): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate()

### Community 71 - "clinicSetupService.ts"
Cohesion: 0.53
Nodes (5): daysBefore(), findPreviousSchedule(), loadClinicSetup(), consecutiveLateRuleOf(), lateDutyThreshold()

### Community 72 - "GenerationResult"
Cohesion: 0.50
Nodes (4): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, GenerationResult

## Knowledge Gaps
- **400 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+395 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 491 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `Assignment`, `ExportModal.tsx`, `PublishView.tsx`, `explainCell.ts`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `Sidebar.tsx`, `authService.ts`, `AllRequestsPanel.tsx`, `Schedule`, `types/index.ts`, `staffRequestService.ts`, `fixtures.ts`, `SchedulesView.tsx`, `hoursAccounting.ts`, `WorkbookGrid.tsx`, `doctorScheduleService.ts`, `AvailabilityView.tsx`, `syncScheduleAssignments`, `CreateScheduleModal.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `Assignment`, `ExportModal.tsx`, `CreateScheduleModal.tsx`, `staffRequestService.ts`, `PublishView.tsx`, `package.json`, `AppShell.tsx`, `SchedulesView.tsx`, `App.tsx`, `hoursAccounting.ts`, `DashboardView.tsx`, `WorkbookGrid.tsx`, `Sidebar.tsx`, `doctorScheduleService.ts`, `AvailabilityView.tsx`, `authService.ts`, `AllRequestsPanel.tsx`, `Schedule`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `ExportModal.tsx`, `SchedulingEngine.ts`, `clinicModel.test.ts`, `PublishView.tsx`, `explainCell.ts`, `getRepository`, `DashboardView.tsx`, `yearToDate.ts`, `Schedule`, `types/index.ts`, `sharing.test.ts`, `analysisExportService.ts`, `fixtures.ts`, `analysisExport.test.ts`, `makeNurse`, `nurseClinicFloat.test.ts`, `SchedulesView.tsx`, `hoursAccounting.ts`, `requestFindings.test.ts`, `WorkbookGrid.tsx`, `doctorScheduleService.ts`, `syncScheduleAssignments`, `explainCell.test.ts`, `assignmentChecks.ts`, `clinicSetupService.ts`, `GenerationResult`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _400 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08928571428571429 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `PublishView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07552447552447553 - nodes in this community are weakly interconnected._