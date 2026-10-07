# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 251 files · ~303,767 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 3, (none) 2, .example 1)

## Summary
- 1954 nodes · 6558 edges · 107 communities (95 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 200 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `56ebcf69`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- analysisExportService.ts
- hoursBalance.ts
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
- AllRequestsPanel.tsx
- App.tsx
- EntityForCollection
- DashboardView.tsx
- fixtures.ts
- firebaseIdentityService.ts
- react
- compilerOptions
- RulesTab.tsx
- seedRunner.ts
- FirestoreRepository
- devDependencies
- emailService.ts
- yearToDate.ts
- IRepository
- scripts
- collectionSyncer.ts
- FairnessModal
- dateFormatter.ts
- Hardening Controls
- dialogs.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- formatDate
- hoursTopUp.test.ts
- Optimization Patterns
- makeNurse
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- quotaTracker
- PublishModal.tsx
- published-rules.mjs
- SchedulingEngine.ts
- WorkbookGrid.tsx
- savingSafety.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
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
- getRepository
- Find Skills
- repository/index.ts
- hoursRules.test.ts
- ref_node_assert
- createLiveReconciler
- DoctorsView.tsx
- navigation.ts
- weekHours.test.ts
- publicHolidays.test.ts
- README.md
- staffRequestService.ts
- sharing.test.ts
- workingHoursPeriodService.ts
- FirestoreRepository.ts
- ClinicRoster
- WhoCanCover.tsx
- types/index.ts
- engineRules.test.ts
- HistoryView.tsx
- newRosterDates.ts
- SchedulesView.tsx
- harness/vite.config.ts
- continuousHours.test.ts
- AvailabilityView.tsx
- NurseTimesheetModal.tsx
- harness/main.tsx
- clinicSetupService.ts
- fakeAuth.ts
- Finish a change
- DoctorsScheduleSheet.tsx
- hoursPolicy.ts
- lastResort.test.ts
- context7
- emailSettingsStore.ts
- firestore-rules-reviewer.md
- plain-english-reviewer.md
- firebase-mcp.sh
- example.cjs
- start.sh
- stop.sh

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 85 edges
4. `Nurse` - 82 edges
5. `DutyWindow` - 81 edges
6. `react` - 75 edges
7. `Doctor` - 70 edges
8. `useDialogA11y()` - 66 edges
9. `lucide-react` - 63 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx

## Import Cycles
- None detected.

## Communities (107 total, 12 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.17
Nodes (58): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+50 more)

### Community 1 - "analysisExportService.ts"
Cohesion: 0.08
Nodes (53): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+45 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (32): NurseTimesheetModal(), NurseTimesheetModalProps, ReportsView(), SortField, TabMode, fmtHours(), HoursAccountingSheet(), askedCarry() (+24 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (30): dateLabel(), PublishedRosterSheet(), LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate() (+22 more)

### Community 5 - "authService.ts"
Cohesion: 0.16
Nodes (17): signOutSafely(), TopBarProps, AuthModal(), AuthModalProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps (+9 more)

### Community 6 - "notify"
Cohesion: 0.16
Nodes (29): confirmDialog(), notify(), DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab(), HolidaysTabProps (+21 more)

### Community 7 - "authService"
Cohesion: 0.14
Nodes (4): authorizedFetch(), authService, computePrivileges(), getAppAuth()

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (22): PageLoading(), AppShell(), bootstrap(), AppShellProps, AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.14
Nodes (16): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+8 more)

### Community 13 - "AllRequestsPanel.tsx"
Cohesion: 0.15
Nodes (18): AccessManagementPanelProps, AllRequestsPanel(), AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+10 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps, LoadErrorBoundary (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.14
Nodes (5): 11. Saving, live updates, versions, CollectionSyncer, fingerprint(), planSync(), EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (24): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+16 more)

### Community 17 - "fixtures.ts"
Cohesion: 0.08
Nodes (27): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+19 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "react"
Cohesion: 0.19
Nodes (16): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), CreateScheduleModalProps, DeleteScheduleModalProps (+8 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 22 - "seedRunner.ts"
Cohesion: 0.14
Nodes (17): saveRosterBackup(), restoreVersion(), removeNurseRoster(), revokeNurseLink(), ALL_COLLECTIONS, BackupCheck, clearDatabase(), ClearResult (+9 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.20
Nodes (12): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+4 more)

### Community 26 - "yearToDate.ts"
Cohesion: 0.15
Nodes (17): YearToDate, YearToDateCounts, isLateDuty(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds() (+9 more)

### Community 27 - "IRepository"
Cohesion: 0.15
Nodes (13): VersionRestoreResult, pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster(), fingerprint(), syncScheduleAssignments() (+5 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "collectionSyncer.ts"
Cohesion: 0.18
Nodes (8): othersOnRoster(), STALE_MS, Desired, Known, SyncPlan, CollectionName, PresenceRecord, now

### Community 30 - "FairnessModal"
Cohesion: 0.25
Nodes (15): Other engine files, FairnessModal(), SwapManagerModal(), checkSwap(), isPinnedShift(), newFindings(), rebalancedFields(), suggestMoves() (+7 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "formatDate"
Cohesion: 0.18
Nodes (13): HolidayDayOffPicker(), HolidayDayOffPickerProps, LeaveAndLocksSheet(), ProblemsPanel(), SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheet() (+5 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "makeNurse"
Cohesion: 0.14
Nodes (18): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+10 more)

### Community 42 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.12
Nodes (15): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 4. Navigation and app shell, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`) (+7 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "PublishModal.tsx"
Cohesion: 0.13
Nodes (28): 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), canEditClinicData() (+20 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (49): 7. Rules, checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+41 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.09
Nodes (34): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, ProblemsPanelProps (+26 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (9): forgetCachedRoster(), afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps, { initializeTestEnvironment } (+1 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

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

### Community 66 - "getRepository"
Cohesion: 0.21
Nodes (17): AccessManagementPanel(), ClinicTab(), ClinicTabProps, EmailTab(), EmailTabProps, SaveStatus, SettingsTab, WEEKDAY_NAMES (+9 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "repository/index.ts"
Cohesion: 0.18
Nodes (11): DatabaseTab(), defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, TAB_ID, StorageMode (+3 more)

### Community 69 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 70 - "ref_node_assert"
Cohesion: 0.09
Nodes (14): BACKUPS_KEPT, ctx(), EARLY, LATE, LATE, nurse, nurses, published (+6 more)

### Community 71 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 72 - "DoctorsView.tsx"
Cohesion: 0.15
Nodes (24): DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, doctorFromDate(), generateDoctorSessionsForDateRange(), missingPatternSessions() (+16 more)

### Community 73 - "navigation.ts"
Cohesion: 0.16
Nodes (15): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, canAccessRoute(), VIEWER_ROUTES (+7 more)

### Community 74 - "weekHours.test.ts"
Cohesion: 0.15
Nodes (6): ScheduleValidator, EARLY, LATE, shifts, LONG, OCT

### Community 75 - "publicHolidays.test.ts"
Cohesion: 0.21
Nodes (14): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday() (+6 more)

### Community 77 - "staffRequestService.ts"
Cohesion: 0.29
Nodes (11): NurseSelfServicePanel(), cancelAvailabilityRequest(), cancelLeaveRequest(), daysInclusive(), isPendingLeave(), listMyRequests(), PendingAvailabilityItem, PendingLeaveItem (+3 more)

### Community 78 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 79 - "workingHoursPeriodService.ts"
Cohesion: 0.31
Nodes (10): earlierPeriodTotals(), shiftIsoDate(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate() (+2 more)

### Community 80 - "FirestoreRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 81 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 82 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (32): 6. Clinic model (the business rules in plain English), applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, BlockWeeks, DoctorSessionSource, EmailLogKind (+24 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "HistoryView.tsx"
Cohesion: 0.14
Nodes (19): DeleteVersionModal(), SOURCE_LABELS, VersionViewModal(), WEEKDAY_NAMES, HistoryView(), WEEKDAY_NAMES, AssignmentDiffItem, ChangeType (+11 more)

### Community 86 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 87 - "SchedulesView.tsx"
Cohesion: 0.19
Nodes (15): MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), DeleteScheduleModal(), VersionCompareModal(), readStoredScheduleId(), SchedulesView() (+7 more)

### Community 88 - "harness/vite.config.ts"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 89 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 90 - "AvailabilityView.tsx"
Cohesion: 0.29
Nodes (12): 3. Users, roles and access, ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, canApproveRequests(), leaveApprovalFields(), InternalSlot, saveHolidayLeave() (+4 more)

### Community 91 - "NurseTimesheetModal.tsx"
Cohesion: 0.23
Nodes (10): fmtHours(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), AuditTrailViewProps, AuditAction, AuditEvent, csvCell() (+2 more)

### Community 93 - "clinicSetupService.ts"
Cohesion: 0.35
Nodes (7): daysBefore(), loadClinicSetup(), loadEarlierRosters(), loadPublishedRoster(), loadYearToDate(), rosterKey(), loadHoursHistory()

### Community 94 - "fakeAuth.ts"
Cohesion: 0.20
Nodes (6): AuthService, MASTER_ADMIN_EMAIL, user, Browser check, Steps, Things that went wrong before

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "DoctorsScheduleSheet.tsx"
Cohesion: 0.42
Nodes (8): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift()

### Community 97 - "hoursPolicy.ts"
Cohesion: 0.31
Nodes (9): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange() (+1 more)

### Community 98 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "emailSettingsStore.ts"
Cohesion: 0.47
Nodes (4): cache(), saveEmailSettings(), DEFAULT_EMAIL_SETTINGS, EmailProviderType

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **660 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+655 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 812 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `analysisExportService.ts`, `hoursBalance.ts`, `nurseRosterService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `AllRequestsPanel.tsx`, `App.tsx`, `DashboardView.tsx`, `fixtures.ts`, `RulesTab.tsx`, `dialogs.tsx`, `formatDate`, `NSC Clinic Roster: complete project guide`, `PublishModal.tsx`, `WorkbookGrid.tsx`, `getRepository`, `repository/index.ts`, `DoctorsView.tsx`, `navigation.ts`, `staffRequestService.ts`, `WhoCanCover.tsx`, `HistoryView.tsx`, `SchedulesView.tsx`, `AvailabilityView.tsx`, `NurseTimesheetModal.tsx`, `harness/main.tsx`, `DoctorsScheduleSheet.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `getRepository`, `nurseRosterService.ts`, `authService.ts`, `repository/index.ts`, `navigation.ts`, `AppShell.tsx`, `App.tsx`, `PublishModal.tsx`, `DashboardView.tsx`, `react`, `SchedulesView.tsx`, `AvailabilityView.tsx`, `fakeAuth.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `analysisExportService.ts`, `hoursBalance.ts`, `clinicModel.test.ts`, `nurseRosterService.ts`, `DashboardView.tsx`, `fixtures.ts`, `react`, `yearToDate.ts`, `IRepository`, `makeNurse`, `nurseClinicFloat.test.ts`, `PublishModal.tsx`, `SchedulingEngine.ts`, `WorkbookGrid.tsx`, `savingSafety.test.ts`, `handMoves.test.ts`, `icsExportService.ts`, `hoursRules.test.ts`, `ref_node_assert`, `DoctorsView.tsx`, `weekHours.test.ts`, `publicHolidays.test.ts`, `sharing.test.ts`, `types/index.ts`, `engineRules.test.ts`, `HistoryView.tsx`, `SchedulesView.tsx`, `continuousHours.test.ts`, `clinicSetupService.ts`, `DoctorsScheduleSheet.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _660 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08196721311475409 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._