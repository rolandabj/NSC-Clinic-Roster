# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 268 files · ~323,675 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 3, (none) 3, .example 1)

## Summary
- 2127 nodes · 6838 edges · 114 communities (104 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 223 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d135e84a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- ExportModal.tsx
- hoursBalance.ts
- clinicModel.test.ts
- icsExportService.ts
- authService.ts
- getRepository
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- staffRequestService.ts
- App.tsx
- CollectionSyncer
- DashboardView.tsx
- makeNurse
- firebaseIdentityService.ts
- react
- compilerOptions
- DoctorsView.tsx
- NurseTimesheetModal.tsx
- EntityForCollection
- devDependencies
- emailService.ts
- seedRunner.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- analysisExport.test.ts
- dateFormatter.ts
- Hardening Controls
- dialogs.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- MenuButton.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- quotaTracker
- PublishModal.tsx
- published-rules.mjs
- SchedulingEngine.ts
- fixtures.ts
- yearToDate.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
- Incremental Implementation
- handMoveChecks.ts
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
- Planning and Task Breakdown
- Find Skills
- nurseRoster.test.ts
- ScheduleVersion
- Source-Driven Development
- fakeAuth.ts
- SchedulesView.tsx
- NurseSelfServicePanel.tsx
- doctorWeekChange.test.ts
- teamRoster.test.ts
- README.md
- MyRosterView.tsx
- sharing.test.ts
- scheduleTransactions.test.ts
- FirestoreRepository.ts
- savingSafety.test.ts
- DoctorsScheduleSheet.tsx
- types/index.ts
- engineRules.test.ts
- Phases
- ClinicRoster
- NSC Clinic Roster: complete project guide
- harness/vite.config.ts
- holidayLeave.ts
- geminiApi.test.ts
- UI overhaul: checklist
- harness/main.tsx
- nurseRosterService.ts
- createLiveReconciler
- Finish a change
- authorizedFetch
- hoursRules.test.ts
- lastResort.test.ts
- context7
- newRosterDates.ts
- firestore-rules-reviewer.md
- dateDefaults.ts
- firebase-mcp.sh
- usePresence.ts
- start.sh
- stop.sh
- IRepository.ts
- AvailabilityView.tsx
- preferenceFocus.test.ts
- firebaseConfig.ts
- WhoCanCover.tsx
- weekHours.test.ts
- liveCollectionCache.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 86 edges
4. `Nurse` - 82 edges
5. `DutyWindow` - 81 edges
6. `react` - 76 edges
7. `useDialogA11y()` - 70 edges
8. `Doctor` - 70 edges
9. `lucide-react` - 63 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `Phase 3: roster grid speed and structure` --references--> `CollectionSyncer`  [INFERRED]
  tasks/plan.md → src/services/repository/collectionSyncer.ts

## Import Cycles
- None detected.

## Communities (114 total, 10 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.16
Nodes (62): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+54 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (54): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps (+46 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.13
Nodes (25): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), hoursCheckpoints(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+17 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "icsExportService.ts"
Cohesion: 0.22
Nodes (15): RFC-5545, calendarRouter, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact() (+7 more)

### Community 5 - "authService.ts"
Cohesion: 0.12
Nodes (25): LoginPageProps, signOutSafely(), AppShellProps, TopBar(), TopBarProps, AuthModal(), AuthModalProps, ApprovalsQueuePanelProps (+17 more)

### Community 6 - "getRepository"
Cohesion: 0.06
Nodes (82): Report, What to check, What to look at, confirmDialog(), dismissNotice(), notify(), setState(), BulkImportModal() (+74 more)

### Community 7 - "authService"
Cohesion: 0.15
Nodes (3): authService, computePrivileges(), getAppAuth()

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.11
Nodes (29): 4. Navigation and app shell, PageLoading(), AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+21 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "staffRequestService.ts"
Cohesion: 0.16
Nodes (20): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+12 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (11): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+3 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.14
Nodes (4): 11. Saving, live updates, versions, CollectionSyncer, fingerprint(), planSync()

### Community 16 - "DashboardView.tsx"
Cohesion: 0.17
Nodes (23): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+15 more)

### Community 17 - "makeNurse"
Cohesion: 0.13
Nodes (22): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+14 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "react"
Cohesion: 0.13
Nodes (27): lucide-react, react, openStack, useDialogA11y(), CreateScheduleModalProps, DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal() (+19 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "DoctorsView.tsx"
Cohesion: 0.24
Nodes (14): DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, doctorFromDate(), nextDay(), PatternSessionPlan (+6 more)

### Community 22 - "NurseTimesheetModal.tsx"
Cohesion: 0.22
Nodes (14): 3. Users, roles and access, usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), AuditTrailViewProps (+6 more)

### Community 23 - "EntityForCollection"
Cohesion: 0.36
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.16
Nodes (14): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+6 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.20
Nodes (15): DatabaseTab(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+7 more)

### Community 27 - "IRepository"
Cohesion: 0.10
Nodes (15): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, applyHolidayChangeToLeave(), saveHolidayLeave(), fingerprint(), syncScheduleAssignments() (+7 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (32): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+24 more)

### Community 30 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+11 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.21
Nodes (11): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, NoticeTone, PendingConfirm (+3 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.15
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 38 - "MenuButton.tsx"
Cohesion: 0.50
Nodes (3): MenuButton(), MenuButtonProps, MenuItem

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (13): express, express-rate-limit, helmet, createApiApp(), startServer(), authMiddleware(), AuthUser, BackendRole (+5 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

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
Nodes (28): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), checkEmailReadiness(), EmailReadiness (+20 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (70): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+62 more)

### Community 49 - "fixtures.ts"
Cohesion: 0.09
Nodes (19): diff(), LATE, nurse, ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, LONG (+11 more)

### Community 50 - "yearToDate.ts"
Cohesion: 0.13
Nodes (23): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+15 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+7 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoveChecks.ts"
Cohesion: 0.25
Nodes (15): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FairnessModal(), SwapManagerModal(), listProblem(), checkSwap() (+7 more)

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

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "nurseRoster.test.ts"
Cohesion: 0.21
Nodes (8): fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), NURSE_TOKEN_PATTERN, base, dutyWindows, refs, schedule

### Community 69 - "ScheduleVersion"
Cohesion: 0.18
Nodes (15): DeleteVersionModalProps, ShareModal(), ShareModalProps, TabType, loadPublishedRoster(), PublishedRosterViewProps, withoutBackups(), ensurePublicRosters() (+7 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 72 - "SchedulesView.tsx"
Cohesion: 0.14
Nodes (25): CreateScheduleModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet(), HolidayDayOffPicker(), HolidayDayOffPickerProps, LeaveAndLocksSheet() (+17 more)

### Community 73 - "NurseSelfServicePanel.tsx"
Cohesion: 0.31
Nodes (10): NurseSelfServicePanel(), leaveCreditInRange(), nurseLeaveHoursInRange(), cancelAvailabilityRequest(), cancelLeaveRequest(), daysInclusive(), listMyRequests(), requireNurseId() (+2 more)

### Community 74 - "doctorWeekChange.test.ts"
Cohesion: 0.17
Nodes (10): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+2 more)

### Community 75 - "teamRoster.test.ts"
Cohesion: 0.21
Nodes (13): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), PublishedRosterView(), addDaysIso(), buildTeamRosterSheet(), syncNurseRosters(), safeColor() (+5 more)

### Community 77 - "MyRosterView.tsx"
Cohesion: 0.26
Nodes (13): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), downloadIcsFile() (+5 more)

### Community 78 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 79 - "scheduleTransactions.test.ts"
Cohesion: 0.20
Nodes (7): nurse(), Steps, apps, { initializeTestEnvironment }, planner(), requireRules, nurses()

### Community 80 - "FirestoreRepository.ts"
Cohesion: 0.32
Nodes (11): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+3 more)

### Community 81 - "savingSafety.test.ts"
Cohesion: 0.15
Nodes (8): Desired, Known, SyncPlan, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, CollectionName

### Community 82 - "DoctorsScheduleSheet.tsx"
Cohesion: 0.36
Nodes (9): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift() (+1 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (30): uuid, AccessManagementPanelProps, NursesViewProps, isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes() (+22 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "Phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+12 more)

### Community 86 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 87 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.20
Nodes (9): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, WalkthroughModal() (+1 more)

### Community 88 - "harness/vite.config.ts"
Cohesion: 0.27
Nodes (6): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, clinicApi()

### Community 89 - "holidayLeave.ts"
Cohesion: 0.36
Nodes (9): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy(), withHolidaysAtZero() (+1 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.10
Nodes (6): context, publishNovember(), Single(), start(), user, react-dom

### Community 93 - "nurseRosterService.ts"
Cohesion: 0.16
Nodes (17): BuildNurseRosterInput, dayMonth(), ensureNurseLink(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, origin(), regenerateNurseLink(), RegenerateNurseLinkResult (+9 more)

### Community 94 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 97 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 98 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (8): 16. History of work (for context), addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 104 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 107 - "IRepository.ts"
Cohesion: 0.31
Nodes (5): removePublicRoster(), SubscribeCallback, Unsubscribe, deleteEntireSchedule(), ScheduleDeleteResult

### Community 108 - "AvailabilityView.tsx"
Cohesion: 0.33
Nodes (8): ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, leaveApprovalFields(), InternalSlot, decideRequest(), IsoDateString, LockMode

### Community 109 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 110 - "firebaseConfig.ts"
Cohesion: 0.33
Nodes (5): defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 111 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 113 - "liveCollectionCache.ts"
Cohesion: 0.40
Nodes (4): CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

## Knowledge Gaps
- **761 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+756 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 929 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `ExportModal.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `staffRequestService.ts`, `App.tsx`, `DashboardView.tsx`, `DoctorsView.tsx`, `NurseTimesheetModal.tsx`, `seedRunner.ts`, `WorkbookGrid.tsx`, `dialogs.tsx`, `MenuButton.tsx`, `PublishModal.tsx`, `fixtures.ts`, `ScheduleVersion`, `SchedulesView.tsx`, `NurseSelfServicePanel.tsx`, `teamRoster.test.ts`, `MyRosterView.tsx`, `DoctorsScheduleSheet.tsx`, `types/index.ts`, `NSC Clinic Roster: complete project guide`, `harness/main.tsx`, `usePresence.ts`, `AvailabilityView.tsx`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `ExportModal.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `staffRequestService.ts`, `App.tsx`, `DashboardView.tsx`, `DoctorsView.tsx`, `NurseTimesheetModal.tsx`, `seedRunner.ts`, `WorkbookGrid.tsx`, `dialogs.tsx`, `PublishModal.tsx`, `ScheduleVersion`, `SchedulesView.tsx`, `NurseSelfServicePanel.tsx`, `teamRoster.test.ts`, `MyRosterView.tsx`, `DoctorsScheduleSheet.tsx`, `types/index.ts`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `authService.ts`, `ScheduleVersion`, `fakeAuth.ts`, `SchedulesView.tsx`, `getRepository`, `AppShell.tsx`, `usePresence.ts`, `AvailabilityView.tsx`, `App.tsx`, `PublishModal.tsx`, `DashboardView.tsx`, `react`, `types/index.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _761 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07244843997884717 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._