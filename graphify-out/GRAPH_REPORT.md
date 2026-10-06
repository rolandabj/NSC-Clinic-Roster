# Graph Report - NSC-Clinic-Roster  (2026-10-06)

## Corpus Check
- 202 files · ~250,595 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1494 nodes · 5515 edges · 79 communities (72 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 140 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aee61276`
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
- NurseTimesheetModal.tsx
- compilerOptions
- DoctorsScheduleSheet.tsx
- scheduleRanges.ts
- FirestoreRepository
- devDependencies
- PublishView.tsx
- ref_node_assert
- IRepository
- scripts
- types/index.ts
- FirestoreRepository.ts
- dateFormatter.ts
- lastResort.test.ts
- CreateScheduleModal.tsx
- yearToDate.ts
- icsExportService.ts
- What You Must Do When Invoked
- LiveCollectionCache
- fixtures.ts
- hoursTopUp.test.ts
- emailService.ts
- makeNurse
- WhoCanCover.tsx
- nurseClinicFloat.test.ts
- createApiApp
- SchedulesView.tsx
- explainCell.test.ts
- server.ts
- hoursPolicy.ts
- WorkbookGrid.tsx
- preferenceFocus.test.ts
- EmailTab.tsx
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
- approvedDayOff.test.ts
- requestFindings.test.ts
- VersionCompareModal.tsx
- NSC Clinic Roster: complete project guide
- ClinicRoster
- Sidebar.tsx
- hoursBalance.ts
- usePresence.ts
- HistoryView.tsx
- hoursRules.test.ts
- QuickCellPopup.tsx
- README.md
- PublishedRosterView.tsx
- firebaseConfig.ts

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 93 edges
2. `Assignment` - 84 edges
3. `Schedule` - 81 edges
4. `Nurse` - 80 edges
5. `DutyWindow` - 78 edges
6. `react` - 72 edges
7. `useDialogA11y()` - 64 edges
8. `lucide-react` - 63 edges
9. `ClinicalRole` - 63 edges
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

## Communities (79 total, 7 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.16
Nodes (61): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseFairnessMetrics, ProposedSwap, PublishModalProps (+53 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (40): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, FLOAT_ROLE_ID (+32 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (45): FairnessModal(), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+37 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (26): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+18 more)

### Community 5 - "authService.ts"
Cohesion: 0.13
Nodes (21): 4. Navigation and app shell, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, AllRequestsPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps (+13 more)

### Community 6 - "getRepository"
Cohesion: 0.05
Nodes (104): 7. Rules, lucide-react, react, uuid, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost() (+96 more)

### Community 7 - "authService"
Cohesion: 0.15
Nodes (3): authService, computePrivileges(), getAppAuth()

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (21): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (15): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, Request (+7 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (35): 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+27 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps, LoadErrorBoundary (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.14
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (23): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+15 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.14
Nodes (18): removeNurseRoster(), revokeNurseLink(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "NurseTimesheetModal.tsx"
Cohesion: 0.26
Nodes (12): fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), AuditAction, AuditEvent (+4 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "DoctorsScheduleSheet.tsx"
Cohesion: 0.27
Nodes (11): 13. Screens in detail, EditDoctorShiftModal(), DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift(), currentWeekendDays (+3 more)

### Community 22 - "scheduleRanges.ts"
Cohesion: 0.40
Nodes (9): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+1 more)

### Community 23 - "FirestoreRepository"
Cohesion: 0.36
Nodes (3): 11. Saving, live updates, versions, FirestoreRepository, sanitizePayload()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishView.tsx"
Cohesion: 0.18
Nodes (17): 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), PublishTab, PublishView(), ensureNurseLink(), nurseLinkUrl(), regenerateNurseLink() (+9 more)

### Community 26 - "ref_node_assert"
Cohesion: 0.13
Nodes (10): ctx(), EARLY, LATE, DAY_DUTY, nurses, published, refs, schedule (+2 more)

### Community 27 - "IRepository"
Cohesion: 0.13
Nodes (12): 16. History of work (for context), removePublicRoster(), repositoryManager, IRepository, DeleteDoctorShiftParams, PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult, SaveDoctorShiftParams (+4 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.07
Nodes (28): CellChoice, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, InternalSlot, ApprovalStatus, AssignmentKind, DoctorSessionSource (+20 more)

### Community 30 - "FirestoreRepository.ts"
Cohesion: 0.14
Nodes (11): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS, CollectionName (+3 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "lastResort.test.ts"
Cohesion: 0.11
Nodes (14): isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES, DR_PCC (+6 more)

### Community 33 - "CreateScheduleModal.tsx"
Cohesion: 0.19
Nodes (17): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate() (+9 more)

### Community 34 - "yearToDate.ts"
Cohesion: 0.15
Nodes (19): nurseClinicRoleOf(), YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds() (+11 more)

### Community 35 - "icsExportService.ts"
Cohesion: 0.12
Nodes (23): RFC-5545, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText() (+15 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 38 - "fixtures.ts"
Cohesion: 0.15
Nodes (16): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+8 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "emailService.ts"
Cohesion: 0.19
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+5 more)

### Community 41 - "makeNurse"
Cohesion: 0.20
Nodes (14): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+6 more)

### Community 42 - "WhoCanCover.tsx"
Cohesion: 0.25
Nodes (10): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps (+2 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 45 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (28): MenuButton(), MenuButtonProps, MenuItem, PageLoading(), SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId() (+20 more)

### Community 46 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "hoursPolicy.ts"
Cohesion: 0.29
Nodes (10): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditOnDate(), leaveCreditPerDay() (+2 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.13
Nodes (28): cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso(), SOURCE_WORDS, WEEKDAY_ABBR, withDr(), WorkbookGrid() (+20 more)

### Community 50 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 51 - "EmailTab.tsx"
Cohesion: 0.29
Nodes (9): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), escapeHtml(), configured (+1 more)

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

### Community 65 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 66 - "requestFindings.test.ts"
Cohesion: 0.14
Nodes (8): ScheduleValidator, SENIOR, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 67 - "VersionCompareModal.tsx"
Cohesion: 0.18
Nodes (12): CHANGE_LABELS, VersionCompareModal(), AssignmentDiffItem, ChangeType, computeScheduleDiff(), formatAssignment(), FormattedAssignmentState, ScheduleVersionDiff (+4 more)

### Community 68 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.18
Nodes (10): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+2 more)

### Community 69 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 70 - "Sidebar.tsx"
Cohesion: 0.22
Nodes (11): NAV_ITEMS, Sidebar(), SidebarProps, DashboardViewProps, DICTIONARY, i18n, Language, t() (+3 more)

### Community 71 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (33): 10. Hours, NurseTimesheetModalProps, SortField, TabMode, fmtHours(), HoursAccountingSheet(), activeCarry(), closePeriod() (+25 more)

### Community 72 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 73 - "HistoryView.tsx"
Cohesion: 0.39
Nodes (7): DeleteScheduleModal(), DeleteVersionModal(), VersionViewModal(), HistoryView(), WEEKDAY_NAMES, fingerprint(), syncScheduleAssignments()

### Community 74 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 75 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 77 - "PublishedRosterView.tsx"
Cohesion: 0.48
Nodes (6): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), buildTeamRosterSheet(), loadPublicRoster()

### Community 78 - "firebaseConfig.ts"
Cohesion: 0.40
Nodes (4): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider

## Knowledge Gaps
- **430 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+425 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 528 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `Assignment`, `ExportModal.tsx`, `nurseRosterService.ts`, `authService.ts`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `NurseTimesheetModal.tsx`, `DoctorsScheduleSheet.tsx`, `PublishView.tsx`, `ref_node_assert`, `CreateScheduleModal.tsx`, `WhoCanCover.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `EmailTab.tsx`, `VersionCompareModal.tsx`, `NSC Clinic Roster: complete project guide`, `Sidebar.tsx`, `hoursBalance.ts`, `usePresence.ts`, `HistoryView.tsx`, `QuickCellPopup.tsx`, `PublishedRosterView.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `Assignment`, `ExportModal.tsx`, `nurseRosterService.ts`, `authService.ts`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `NurseTimesheetModal.tsx`, `DoctorsScheduleSheet.tsx`, `PublishView.tsx`, `CreateScheduleModal.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `EmailTab.tsx`, `VersionCompareModal.tsx`, `Sidebar.tsx`, `hoursBalance.ts`, `HistoryView.tsx`, `QuickCellPopup.tsx`, `PublishedRosterView.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `getRepository()` connect `getRepository` to `Assignment`, `CreateScheduleModal.tsx`, `SchedulingEngine.ts`, `ExportModal.tsx`, `nurseRosterService.ts`, `hoursBalance.ts`, `usePresence.ts`, `HistoryView.tsx`, `SchedulesView.tsx`, `AvailabilityView.tsx`, `PublishedRosterView.tsx`, `DashboardView.tsx`, `NurseTimesheetModal.tsx`, `EmailTab.tsx`, `DoctorsScheduleSheet.tsx`, `FirestoreRepository`, `PublishView.tsx`, `IRepository`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _430 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09990749306197964 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._