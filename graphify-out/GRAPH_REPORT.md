# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 293 files · ~343,560 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2314 nodes · 7442 edges · 105 communities (95 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 273 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0b57d277`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- DashboardView.tsx
- ExportModal.tsx
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
- AvailabilityView.tsx
- App.tsx
- CollectionSyncer
- preferenceFocus.test.ts
- makeSchedule
- firebaseIdentityService.ts
- formatDate
- compilerOptions
- yearToDate.ts
- createLiveReconciler
- FirestoreRepository
- devDependencies
- PublishedRosterView.tsx
- FirestoreRepository.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- PlannerSample.tsx
- DoctorsView.tsx
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- nurseClinicFloat.test.ts
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- nurseRosterService.ts
- Frontend UI Engineering
- quotaTracker
- ui.tsx
- published-rules.mjs
- SchedulingEngine.ts
- NSC Clinic Roster: complete project guide
- savingSafety.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
- Incremental Implementation
- RulesTab.tsx
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
- hoursBalance.ts
- NurseTimesheetModal.tsx
- Source-Driven Development
- fixtures.ts
- PublishView.tsx
- createApiApp
- EmailTab.tsx
- Design system: NSC Clinic Roster
- README.md
- lastResort.test.ts
- 16. History of work (for context)
- wholeDates
- Sidebar.tsx
- hoursPolicy.ts
- assignmentChecks.ts
- types/index.ts
- weekHours.test.ts
- uiComponents.test.ts
- WorkingHoursPeriodsPanel.tsx
- ui/index.ts
- engineRules.test.ts
- seedRunner.ts
- geminiApi.test.ts
- repositoryManager
- harness/main.tsx
- ClinicRoster
- Finish a change
- Button
- ddmmyyyy
- context7
- firestore-rules-reviewer.md
- firebase-mcp.sh
- react
- start.sh
- stop.sh
- index.tsx
- newRosterDates.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `react` - 91 edges
4. `Schedule` - 86 edges
5. `DutyWindow` - 81 edges
6. `Nurse` - 81 edges
7. `lucide-react` - 76 edges
8. `useDialogA11y()` - 74 edges
9. `Doctor` - 70 edges
10. `notify()` - 69 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `9. Checking a roster (`src/services/validation/ScheduleValidator.ts`)` --references--> `recordHolidayDayOff()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/requests/staffRequestService.ts

## Import Cycles
- None detected.

## Communities (105 total, 10 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (75): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+67 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.15
Nodes (25): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+17 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (47): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+39 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 5 - "authService.ts"
Cohesion: 0.08
Nodes (38): 3. Users, roles and access, LoginPageProps, signOutSafely(), AppShellProps, SidebarProps, AccountMenu(), TopBar(), TopBarProps (+30 more)

### Community 6 - "getRepository"
Cohesion: 0.12
Nodes (48): confirmDialog(), notify(), SwapManagerModal(), TemplateModal(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTab() (+40 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (6): authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.20
Nodes (18): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+10 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.09
Nodes (49): 10. Hours, 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+41 more)

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.10
Nodes (13): 11. Saving, live updates, versions, forgetCachedRoster(), saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+5 more)

### Community 16 - "preferenceFocus.test.ts"
Cohesion: 0.16
Nodes (12): 6. Clinic model (the business rules in plain English), applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus, CARD, KHAN (+4 more)

### Community 17 - "makeSchedule"
Cohesion: 0.10
Nodes (20): SchedulingEngine, hoursOnlyRules(), makeSchedule(), SENIOR, LATE, run(), setup(), LONG (+12 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "formatDate"
Cohesion: 0.12
Nodes (20): Report, What to check, What to look at, DateInput(), HolidayDayOffPicker(), HolidayDayOffPickerProps, ProblemsPanel(), SEVERITY (+12 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.10
Nodes (27): nurseClinicRoleOf(), YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP (+19 more)

### Community 22 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishedRosterView.tsx"
Cohesion: 0.19
Nodes (11): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), buildTeamRosterSheet(), loadPublicRoster(), nurses, published (+3 more)

### Community 26 - "FirestoreRepository.ts"
Cohesion: 0.32
Nodes (11): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+3 more)

### Community 27 - "IRepository"
Cohesion: 0.10
Nodes (19): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments(), IRepository (+11 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (33): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, fmt() (+25 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "DoctorsView.tsx"
Cohesion: 0.12
Nodes (33): CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView(), WEEKDAY_NAMES (+25 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.09
Nodes (18): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+10 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.19
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.12
Nodes (18): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, Request (+10 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "nurseRosterService.ts"
Cohesion: 0.16
Nodes (24): dateLabel(), PublishedRosterSheet(), LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate() (+16 more)

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (52): 7. Rules, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+44 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.20
Nodes (9): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, WalkthroughModal() (+1 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (8): clearYearToDateCache(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps, { initializeTestEnvironment }, requireRules

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

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

### Community 68 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (28): NurseTimesheetModalProps, SortField, TabMode, askedCarry(), closePeriod(), earlierPeriodTotals(), HoursPart, HoursSchedule (+20 more)

### Community 69 - "NurseTimesheetModal.tsx"
Cohesion: 0.06
Nodes (42): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), AuditAction (+34 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "fixtures.ts"
Cohesion: 0.06
Nodes (39): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+31 more)

### Community 72 - "PublishView.tsx"
Cohesion: 0.27
Nodes (12): 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), PublishTab, PublishView(), ensureNurseLink(), nurseLinkUrl(), regenerateNurseLink() (+4 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "EmailTab.tsx"
Cohesion: 0.08
Nodes (33): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+25 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 78 - "16. History of work (for context)"
Cohesion: 0.32
Nodes (11): 16. History of work (for context), cx(), Checkbox(), Field(), Input(), InputProps, Select(), SelectProps (+3 more)

### Community 79 - "wholeDates"
Cohesion: 0.67
Nodes (3): ConfirmBox(), DialogHost(), wholeDates()

### Community 80 - "Sidebar.tsx"
Cohesion: 0.29
Nodes (7): APP_NAME, SCREEN_NAMES, NAV_ITEMS, Sidebar(), IconButton(), Dialog(), WIDTHS

### Community 81 - "hoursPolicy.ts"
Cohesion: 0.27
Nodes (10): LeaveAndLocksSheet(), CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay() (+2 more)

### Community 82 - "assignmentChecks.ts"
Cohesion: 0.12
Nodes (30): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FairnessModal(), ProblemsPanelProps, checkAssignment(), hardRule() (+22 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (34): CellChoice, InternalSlot, othersOnRoster(), STALE_MS, TAB_ID, usePresence(), EMAIL_LOG_HTML_BUDGET, encoder (+26 more)

### Community 84 - "weekHours.test.ts"
Cohesion: 0.10
Nodes (13): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+5 more)

### Community 85 - "uiComponents.test.ts"
Cohesion: 0.20
Nodes (12): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, nextTabIndex(), TabItem (+4 more)

### Community 86 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.27
Nodes (11): WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown, WorkingHoursCalculationResult (+3 more)

### Community 87 - "ui/index.ts"
Cohesion: 0.14
Nodes (19): ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, Card(), Crumb (+11 more)

### Community 88 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 89 - "seedRunner.ts"
Cohesion: 0.20
Nodes (11): ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup(), initializeDatabaseIfEmpty() (+3 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 94 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Button"
Cohesion: 0.21
Nodes (10): MenuButton(), MenuButtonProps, MenuItem, LocalModeBanner(), LocalModeBannerProps, Button(), EmptyState(), ErrorState() (+2 more)

### Community 98 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 104 - "react"
Cohesion: 0.09
Nodes (40): lucide-react, react, uuid, ConfirmOptions, DialogState, dismissNotice(), listeners, Notice (+32 more)

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

## Knowledge Gaps
- **795 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+790 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 966 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `formatDate`, `PublishedRosterView.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `DoctorsView.tsx`, `data.ts`, `nurseRosterService.ts`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `RulesTab.tsx`, `hoursBalance.ts`, `NurseTimesheetModal.tsx`, `fixtures.ts`, `PublishView.tsx`, `EmailTab.tsx`, `16. History of work (for context)`, `wholeDates`, `Sidebar.tsx`, `types/index.ts`, `uiComponents.test.ts`, `WorkingHoursPeriodsPanel.tsx`, `ui/index.ts`, `harness/main.tsx`, `Button`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `formatDate`, `PublishedRosterView.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `DoctorsView.tsx`, `data.ts`, `nurseRosterService.ts`, `ui.tsx`, `RulesTab.tsx`, `hoursBalance.ts`, `NurseTimesheetModal.tsx`, `PublishView.tsx`, `EmailTab.tsx`, `16. History of work (for context)`, `Sidebar.tsx`, `uiComponents.test.ts`, `WorkingHoursPeriodsPanel.tsx`, `ui/index.ts`, `harness/main.tsx`, `Button`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `react` to `SchedulesView.tsx`, `Button`, `ExportModal.tsx`, `authService.ts`, `NurseTimesheetModal.tsx`, `getRepository`, `PublishView.tsx`, `AppShell.tsx`, `Design system: NSC Clinic Roster`, `AvailabilityView.tsx`, `16. History of work (for context)`, `wholeDates`, `Sidebar.tsx`, `assignmentChecks.ts`, `WorkingHoursPeriodsPanel.tsx`, `WorkbookGrid.tsx`, `DoctorsView.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _795 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12659176029962546 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08525506638714186 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._