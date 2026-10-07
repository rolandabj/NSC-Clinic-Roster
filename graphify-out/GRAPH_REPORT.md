# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 224 files · ~280,639 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1666 nodes · 6237 edges · 81 communities (74 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 198 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c8e7f09f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- rosterPdfService.ts
- hoursBalance.ts
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
- EntityForCollection
- DashboardView.tsx
- makeNurse
- firebaseIdentityService.ts
- react
- compilerOptions
- RulesTab.tsx
- IRepository.ts
- FirestoreRepository
- devDependencies
- PublishModal.tsx
- yearToDate.ts
- IRepository
- scripts
- types/index.ts
- assignmentChecks.ts
- dateFormatter.ts
- sharing.test.ts
- notify
- analysisExportService.ts
- hoursPolicy.ts
- What You Must Do When Invoked
- LiveCollectionCache
- 8. The roster engine (`src/services/engine/SchedulingEngine.ts`)
- hoursTopUp.test.ts
- teamRoster.test.ts
- makeSchedule
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- createApiApp
- quotaTracker
- doctorWeekChange.test.ts
- server.ts
- SchedulingEngine.ts
- WorkbookGrid.tsx
- savingSafety.test.ts
- calendar.ts
- graphify reference: extra exports and benchmark
- continuousHours.test.ts
- PublishedRosterView.tsx
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
- usePresence.ts
- MenuButton.tsx
- seedRunner.ts
- fixtures.ts
- weekHours.test.ts
- createLiveReconciler
- doctorScheduleService.ts
- yearSeed.ts
- engineRules.test.ts
- holidayLeave.ts
- README.md
- lastResort.test.ts
- handMoves.test.ts
- preferenceOrder.ts
- RuleTemplateKey

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 96 edges
3. `Schedule` - 85 edges
4. `Nurse` - 82 edges
5. `DutyWindow` - 81 edges
6. `react` - 74 edges
7. `Doctor` - 70 edges
8. `useDialogA11y()` - 66 edges
9. `lucide-react` - 63 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `9. Checking a roster (`src/services/validation/ScheduleValidator.ts`)` --references--> `recordHolidayDayOff()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/requests/staffRequestService.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx

## Import Cycles
- None detected.

## Communities (81 total, 7 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.06
Nodes (131): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, TIME_PRESETS, ExportModalProps, ExportTab, WEEKDAY_NAMES, FairnessModalProps (+123 more)

### Community 1 - "rosterPdfService.ts"
Cohesion: 0.10
Nodes (36): jspdf, jspdf-autotable, xlsx, ExportModal(), fmtHours(), isFloatShift(), exportRosterToCsvLong(), exportRosterToCsvMatrix() (+28 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (35): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay(), ExplainNurseDayInput (+27 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (25): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+17 more)

### Community 5 - "authService.ts"
Cohesion: 0.08
Nodes (37): 3. Users, roles and access, LoginPageProps, signOutSafely(), AppShellProps, NAV_ITEMS, Sidebar(), SidebarProps, TopBar() (+29 more)

### Community 6 - "SettingsView.tsx"
Cohesion: 0.11
Nodes (38): AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), BUILT_IN_LEAVE_CODES (+30 more)

### Community 7 - "authService"
Cohesion: 0.07
Nodes (21): CreateScheduleModal(), CreateScheduleModalProps, authService, computePrivileges(), defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore() (+13 more)

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
Cohesion: 0.18
Nodes (11): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+3 more)

### Community 13 - "getRepository"
Cohesion: 0.12
Nodes (37): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+29 more)

### Community 14 - "App.tsx"
Cohesion: 0.17
Nodes (11): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+3 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.12
Nodes (9): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+1 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (19): PageLoading(), Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList() (+11 more)

### Community 17 - "makeNurse"
Cohesion: 0.08
Nodes (22): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+14 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "react"
Cohesion: 0.14
Nodes (23): lucide-react, react, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal() (+15 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.17
Nodes (16): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup, RulesTab() (+8 more)

### Community 22 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.08
Nodes (49): 12. Publishing and nurse links, nodemailer, Request, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService (+41 more)

### Community 26 - "yearToDate.ts"
Cohesion: 0.20
Nodes (15): YearToDate, daysBefore(), loadClinicSetup(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion(), loadEarlierRosters() (+7 more)

### Community 27 - "IRepository"
Cohesion: 0.10
Nodes (19): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+11 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.09
Nodes (21): ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus, Invitation, InvitationStatus (+13 more)

### Community 30 - "assignmentChecks.ts"
Cohesion: 0.13
Nodes (30): Other engine files, FairnessModal(), checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween(), shiftDate() (+22 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 33 - "notify"
Cohesion: 0.13
Nodes (23): uuid, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners (+15 more)

### Community 34 - "analysisExportService.ts"
Cohesion: 0.18
Nodes (16): coveredMinutes(), toMinutes(), leaveApprovalFields(), ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy(), downloadRosterAnalysis() (+8 more)

### Community 35 - "hoursPolicy.ts"
Cohesion: 0.31
Nodes (9): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange() (+1 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 38 - "8. The roster engine (`src/services/engine/SchedulingEngine.ts`)"
Cohesion: 0.67
Nodes (3): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "teamRoster.test.ts"
Cohesion: 0.24
Nodes (12): loadViewerData(), buildNurseRosterDoc(), buildTeamRosterSheet(), latestPublishedVersions(), shiftDetail(), syncNurseRosters(), todayIso(), nurses (+4 more)

### Community 41 - "makeSchedule"
Cohesion: 0.09
Nodes (23): SchedulingEngine, hoursOnlyRules(), makeSchedule(), SENIOR, LATE, run(), account(), CARD (+15 more)

### Community 42 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.10
Nodes (18): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+10 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 45 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 46 - "doctorWeekChange.test.ts"
Cohesion: 0.15
Nodes (11): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+3 more)

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.13
Nodes (34): 7. Rules, bloodCollectionRole(), canBeFreeNurse(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes(), hoursToCover() (+26 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.13
Nodes (24): 6. Clinic model (the business rules in plain English), findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption (+16 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.12
Nodes (9): clearYearToDateCache(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, rebaseEdit(), apps, { initializeTestEnvironment } (+1 more)

### Community 51 - "calendar.ts"
Cohesion: 0.43
Nodes (5): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), NurseRosterDoc

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 54 - "PublishedRosterView.tsx"
Cohesion: 0.12
Nodes (24): RFC-5545, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, buildNurseIcs(), buildNurseRosterIcs(), downloadIcsFile(), escapeIcsText() (+16 more)

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

### Community 66 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 67 - "MenuButton.tsx"
Cohesion: 0.50
Nodes (3): MenuButton(), MenuButtonProps, MenuItem

### Community 68 - "seedRunner.ts"
Cohesion: 0.17
Nodes (17): DatabaseTab(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats (+9 more)

### Community 69 - "fixtures.ts"
Cohesion: 0.12
Nodes (17): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), UNPAID_LEAVE, LONG, NOV, OCT, D (+9 more)

### Community 70 - "weekHours.test.ts"
Cohesion: 0.25
Nodes (3): CANONICAL_RULES_SPEC, LONG, OCT

### Community 71 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 72 - "doctorScheduleService.ts"
Cohesion: 0.22
Nodes (16): EditDoctorShiftModal(), DoctorsScheduleSheet(), deleteDoctorShift(), doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), missingPatternSessions(), nextDay() (+8 more)

### Community 73 - "yearSeed.ts"
Cohesion: 0.33
Nodes (6): YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 74 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 75 - "holidayLeave.ts"
Cohesion: 0.25
Nodes (13): 10. Hours, HolidaysTab(), HolidaysTabProps, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave() (+5 more)

### Community 77 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 78 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (23): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+15 more)

### Community 79 - "preferenceOrder.ts"
Cohesion: 0.40
Nodes (4): isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus

### Community 80 - "RuleTemplateKey"
Cohesion: 0.67
Nodes (3): RuleDef, CanonicalRuleDef, RuleTemplateKey

## Knowledge Gaps
- **476 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+471 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 600 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `hoursBalance.ts`, `nurseRosterService.ts`, `authService.ts`, `SettingsView.tsx`, `authService`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `notify`, `NSC Clinic Roster: complete project guide`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `usePresence.ts`, `MenuButton.tsx`, `seedRunner.ts`, `fixtures.ts`, `holidayLeave.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `Assignment` connect `SchedulesView.tsx` to `rosterPdfService.ts`, `hoursBalance.ts`, `clinicModel.test.ts`, `nurseRosterService.ts`, `DashboardView.tsx`, `makeNurse`, `PublishModal.tsx`, `yearToDate.ts`, `IRepository`, `types/index.ts`, `assignmentChecks.ts`, `sharing.test.ts`, `notify`, `analysisExportService.ts`, `teamRoster.test.ts`, `makeSchedule`, `nurseClinicFloat.test.ts`, `doctorWeekChange.test.ts`, `SchedulingEngine.ts`, `WorkbookGrid.tsx`, `savingSafety.test.ts`, `continuousHours.test.ts`, `PublishedRosterView.tsx`, `fixtures.ts`, `weekHours.test.ts`, `engineRules.test.ts`, `handMoves.test.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `notify`, `nurseRosterService.ts`, `authService.ts`, `SettingsView.tsx`, `authService`, `seedRunner.ts`, `package.json`, `AppShell.tsx`, `holidayLeave.ts`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `WorkbookGrid.tsx`, `RulesTab.tsx`, `PublishedRosterView.tsx`, `PublishModal.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _476 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05787139689578714 - nodes in this community are weakly interconnected._
- **Should `rosterPdfService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09581646423751687 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10241820768136557 - nodes in this community are weakly interconnected._