# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 226 files · ~281,675 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1680 nodes · 6250 edges · 84 communities (77 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 198 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6824d819`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- rosterPdfService.ts
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- react
- shared.tsx
- authService
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- AllRequestsPanel.tsx
- App.tsx
- EntityForCollection
- DashboardView.tsx
- fixtures.ts
- firebaseIdentityService.ts
- useDialogA11y
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
- assignmentChecks.ts
- dateFormatter.ts
- hoursAccounting.ts
- dialogs.tsx
- ExportModal.tsx
- hoursPolicy.ts
- What You Must Do When Invoked
- LiveCollectionCache
- FairnessModal.tsx
- hoursTopUp.test.ts
- teamRoster.test.ts
- makeNurse
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- createApiApp
- quotaTracker
- doctorWeekChange.test.ts
- server.ts
- SchedulingEngine.ts
- ScheduleValidator.ts
- savingSafety.test.ts
- getRepository
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
- Doctor
- Find Skills
- repository/index.ts
- ref_node_assert
- AvailabilityView.tsx
- createLiveReconciler
- SchedulesView
- navigation.ts
- weekHours.test.ts
- holidayLeave.ts
- README.md
- staffRequestService.ts
- handMoves.test.ts
- SettingsView.tsx
- ClinicContextState
- ClinicRoster
- WhoCanCover.tsx
- weekend.ts

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

## Communities (84 total, 7 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.21
Nodes (47): 5. Data model (Firestore collections), BulkImportModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, SwapManagerModalProps, TemplateModalProps, VersionCompareModalProps (+39 more)

### Community 1 - "rosterPdfService.ts"
Cohesion: 0.11
Nodes (21): jspdf, jspdf-autotable, chunk(), exportRosterToPdf(), firstName(), GRID, HEAD_FILL, hexToRgb() (+13 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.18
Nodes (17): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+9 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (31): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), ViewerData, DayEntry, LoadState, mondayOf(), MONTHS (+23 more)

### Community 5 - "react"
Cohesion: 0.23
Nodes (13): lucide-react, react, LoginPageProps, signOutSafely(), AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+5 more)

### Community 6 - "shared.tsx"
Cohesion: 0.11
Nodes (20): DatabaseTabProps, DutiesTabProps, shiftHours(), HolidaysTabProps, BUILT_IN_LEAVE_CODES, isBuiltInCode(), LeaveTabProps, BUILT_IN (+12 more)

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
Cohesion: 0.15
Nodes (24): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+16 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (14): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+6 more)

### Community 13 - "AllRequestsPanel.tsx"
Cohesion: 0.18
Nodes (15): 16. History of work (for context), AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+7 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.12
Nodes (10): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, rebaseEdit() (+2 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (24): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+16 more)

### Community 17 - "fixtures.ts"
Cohesion: 0.08
Nodes (29): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+21 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "useDialogA11y"
Cohesion: 0.14
Nodes (25): openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), ShortcutItem, SHORTCUTS, ShortcutsModalProps (+17 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 22 - "seedRunner.ts"
Cohesion: 0.13
Nodes (22): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+14 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.06
Nodes (58): nodemailer, Request, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+50 more)

### Community 26 - "yearToDate.ts"
Cohesion: 0.14
Nodes (21): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+13 more)

### Community 27 - "IRepository"
Cohesion: 0.09
Nodes (21): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments() (+13 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.05
Nodes (38): CellChoice, isPairing(), PREFERENCE_FOCUS_LABELS, InternalSlot, othersOnRoster(), STALE_MS, TAB_ID, usePresence() (+30 more)

### Community 30 - "assignmentChecks.ts"
Cohesion: 0.17
Nodes (19): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), nurseClinicRoleOf(), namesSpecialty(), OutsideList (+11 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "hoursAccounting.ts"
Cohesion: 0.15
Nodes (26): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), SortField (+18 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 34 - "ExportModal.tsx"
Cohesion: 0.26
Nodes (18): xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, analysisFileName(), downloadRosterAnalysis(), exportRosterToCsvLong() (+10 more)

### Community 35 - "hoursPolicy.ts"
Cohesion: 0.27
Nodes (10): LeaveAndLocksSheet(), CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay() (+2 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "FairnessModal.tsx"
Cohesion: 0.18
Nodes (21): Other engine files, uuid, FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap, NONE, SwapManagerModal() (+13 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 41 - "makeNurse"
Cohesion: 0.10
Nodes (26): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+18 more)

### Community 42 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.18
Nodes (10): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, WalkthroughModal() (+2 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (44): 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes() (+36 more)

### Community 49 - "ScheduleValidator.ts"
Cohesion: 0.10
Nodes (37): 7. Rules, findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption (+29 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.12
Nodes (10): clearYearToDateCache(), forgetCachedRoster(), afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps (+2 more)

### Community 51 - "getRepository"
Cohesion: 0.34
Nodes (18): confirmDialog(), notify(), BulkImportModal(), TemplateModal(), AccessManagementPanel(), NursesView(), DutiesTab(), HolidaysTab() (+10 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "continuousHours.test.ts"
Cohesion: 0.15
Nodes (12): duties, first, goal8(), history, long, nurse, p8, periods (+4 more)

### Community 54 - "icsExportService.ts"
Cohesion: 0.15
Nodes (19): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+11 more)

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

### Community 66 - "Doctor"
Cohesion: 0.26
Nodes (14): EditDoctorShiftModalProps, TIME_PRESETS, DoctorsScheduleSheetProps, WEEKDAY_ABBR, DeleteDoctorShiftParams, DeleteDoctorShiftResult, PatternSessionPlan, PopulateRecurringDoctorSessionsParams (+6 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "repository/index.ts"
Cohesion: 0.21
Nodes (10): DatabaseTab(), defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, StorageMode, checkBackup() (+2 more)

### Community 69 - "ref_node_assert"
Cohesion: 0.09
Nodes (13): ctx(), EARLY, LATE, LATE, nurse, D, E, L (+5 more)

### Community 70 - "AvailabilityView.tsx"
Cohesion: 0.31
Nodes (12): 3. Users, roles and access, ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, canApproveRequests(), canEditClinicData(), leaveApprovalFields(), countPendingApprovals() (+4 more)

### Community 71 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 72 - "SchedulesView"
Cohesion: 0.06
Nodes (52): 13. Screens in detail, MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps (+44 more)

### Community 73 - "navigation.ts"
Cohesion: 0.23
Nodes (10): NAV_ITEMS, SidebarProps, VIEWER_ROUTES, DICTIONARY, i18n, Language, t(), Translations (+2 more)

### Community 74 - "weekHours.test.ts"
Cohesion: 0.09
Nodes (10): ScheduleValidator, JUNIOR, LEVELS, NC, PHL, EARLY, LATE, shifts (+2 more)

### Community 75 - "holidayLeave.ts"
Cohesion: 0.28
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday() (+4 more)

### Community 77 - "staffRequestService.ts"
Cohesion: 0.32
Nodes (10): NurseSelfServicePanel(), cancelAvailabilityRequest(), cancelLeaveRequest(), daysInclusive(), listMyRequests(), PendingAvailabilityItem, PendingLeaveItem, requireNurseId() (+2 more)

### Community 78 - "handMoves.test.ts"
Cohesion: 0.06
Nodes (27): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, AMY, BEA, CARA, DAN, DOCTORS (+19 more)

### Community 79 - "SettingsView.tsx"
Cohesion: 0.31
Nodes (9): ClinicTab(), ClinicTabProps, SaveStatus, SettingsViewProps, WorkingHoursPeriodsPanelProps, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ClinicProfile (+1 more)

### Community 80 - "ClinicContextState"
Cohesion: 0.17
Nodes (12): TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+4 more)

### Community 81 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 82 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 83 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

## Knowledge Gaps
- **487 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+482 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 612 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `nurseRosterService.ts`, `shared.tsx`, `package.json`, `AppShell.tsx`, `AllRequestsPanel.tsx`, `App.tsx`, `DashboardView.tsx`, `fixtures.ts`, `useDialogA11y`, `RulesTab.tsx`, `PublishModal.tsx`, `types/index.ts`, `hoursAccounting.ts`, `dialogs.tsx`, `ExportModal.tsx`, `FairnessModal.tsx`, `NSC Clinic Roster: complete project guide`, `ScheduleValidator.ts`, `getRepository`, `Doctor`, `repository/index.ts`, `AvailabilityView.tsx`, `SchedulesView`, `navigation.ts`, `staffRequestService.ts`, `SettingsView.tsx`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Assignment` connect `SchedulesView.tsx` to `rosterPdfService.ts`, `hoursBalance.ts`, `clinicModel.test.ts`, `nurseRosterService.ts`, `react`, `DashboardView.tsx`, `fixtures.ts`, `useDialogA11y`, `PublishModal.tsx`, `yearToDate.ts`, `IRepository`, `types/index.ts`, `assignmentChecks.ts`, `hoursAccounting.ts`, `ExportModal.tsx`, `FairnessModal.tsx`, `teamRoster.test.ts`, `makeNurse`, `nurseClinicFloat.test.ts`, `doctorWeekChange.test.ts`, `SchedulingEngine.ts`, `ScheduleValidator.ts`, `savingSafety.test.ts`, `continuousHours.test.ts`, `icsExportService.ts`, `Doctor`, `ref_node_assert`, `weekHours.test.ts`, `handMoves.test.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `nurseRosterService.ts`, `shared.tsx`, `package.json`, `AppShell.tsx`, `AllRequestsPanel.tsx`, `App.tsx`, `DashboardView.tsx`, `useDialogA11y`, `RulesTab.tsx`, `PublishModal.tsx`, `hoursAccounting.ts`, `dialogs.tsx`, `ExportModal.tsx`, `FairnessModal.tsx`, `ScheduleValidator.ts`, `getRepository`, `Doctor`, `repository/index.ts`, `AvailabilityView.tsx`, `SchedulesView`, `navigation.ts`, `staffRequestService.ts`, `SettingsView.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _487 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rosterPdfService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `nurseRosterService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12100840336134454 - nodes in this community are weakly interconnected._