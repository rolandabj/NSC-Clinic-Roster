# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 301 files · ~355,893 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2389 nodes · 7638 edges · 126 communities (118 shown, 8 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 281 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `302918ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- ExportModal.tsx
- clinicModel.test.ts
- quotaTracker
- authService.ts
- notify
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- getRepository
- App.tsx
- CollectionSyncer
- FirestoreRepository.ts
- makeNurse
- firebaseIdentityService.ts
- formatDate
- compilerOptions
- yearToDate.ts
- ShareModal.tsx
- icsExportService.ts
- devDependencies
- nurseRosterService.ts
- seedRunner.ts
- IRepository
- scripts
- SchedulesView.tsx
- PlannerSample.tsx
- engineRules.test.ts
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- WorkbookGrid.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- analysisExport.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- EntityForCollection
- ui.tsx
- firestore-rules/package.json
- yearSeed.ts
- NSC Clinic Roster: complete project guide
- dialogs.tsx
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
- uiComponents.test.ts
- Planning and Task Breakdown
- Find Skills
- hoursBalance.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- emailService.ts
- published-rules.mjs
- apiApp.ts
- PublishModal
- Design system: NSC Clinic Roster
- README.md
- lastResort.test.ts
- weekHours.ts
- holidayLeave.ts
- collectionSyncer.ts
- links.cjs
- Sidebar.tsx
- types/index.ts
- fixtures.ts
- ui/index.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- SwapManagerModal.tsx
- access.ts
- geminiApi.test.ts
- middleware/auth.ts
- harness/main.tsx
- doctorScheduleService.ts
- repository/index.ts
- Finish a change
- weekHours.test.ts
- 16. History of work (for context)
- preferenceFocus.test.ts
- context7
- ClinicRoster
- firestore-rules-reviewer.md
- ref_node_assert
- firebase-mcp.sh
- react
- start.sh
- stop.sh
- colorContrast.ts
- nurseClinicFloat.test.ts
- index.tsx
- CreateScheduleModal.tsx
- ddmmyyyy
- UI overhaul: checklist
- devDependencies
- ruleSyncService.ts
- QuickCellPopup.tsx
- createLiveReconciler
- explainCell.test.ts
- EmailTab.tsx
- SchedulesView
- WhoCanCover.tsx
- doctorWeekChange.test.ts
- DataTable.tsx
- newRosterDates.ts
- plain-english-reviewer.md
- FairnessModal.tsx

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 101 edges
2. `getRepository()` - 95 edges
3. `react` - 93 edges
4. `Schedule` - 86 edges
5. `DutyWindow` - 83 edges
6. `Nurse` - 83 edges
7. `lucide-react` - 77 edges
8. `useDialogA11y()` - 74 edges
9. `Doctor` - 73 edges
10. `notify()` - 69 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (126 total, 8 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.11
Nodes (81): 5. Data model (Firestore collections), Request, BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseTimesheetModalProps, SOURCE_LABELS (+73 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.14
Nodes (27): AppContext, AppContextValue, useAppContext(), SidebarProps, Card(), DashboardView(), DashboardViewProps, loadPlannerData() (+19 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.06
Nodes (63): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+55 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 5 - "authService.ts"
Cohesion: 0.10
Nodes (26): LoginPageProps, signOutSafely(), AppShellProps, TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, AllRequestsPanelProps (+18 more)

### Community 6 - "notify"
Cohesion: 0.13
Nodes (40): confirmDialog(), notify(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps, DutiesTab(), DutiesTabProps (+32 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.11
Nodes (29): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+21 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.14
Nodes (36): NoticeTone, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+28 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (13): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+5 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.15
Nodes (3): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer

### Community 16 - "FirestoreRepository.ts"
Cohesion: 0.19
Nodes (14): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+6 more)

### Community 17 - "makeNurse"
Cohesion: 0.09
Nodes (28): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup() (+20 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.14
Nodes (19): jose, verifyToken(), calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig (+11 more)

### Community 19 - "formatDate"
Cohesion: 0.15
Nodes (17): HolidayDayOffPicker(), HolidayDayOffPickerProps, ProblemsPanel(), ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheet() (+9 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (16): isLateDuty(), clearYearToDateCache(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster (+8 more)

### Community 22 - "ShareModal.tsx"
Cohesion: 0.53
Nodes (5): ShareModal(), TabType, ensurePublicRosters(), pick(), syncPublicRoster()

### Community 23 - "icsExportService.ts"
Cohesion: 0.10
Nodes (24): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+16 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (33): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+25 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.20
Nodes (11): ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup(), initializeDatabaseIfEmpty() (+3 more)

### Community 27 - "IRepository"
Cohesion: 0.12
Nodes (22): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+14 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulesView.tsx"
Cohesion: 0.08
Nodes (61): CoverageSheet(), fmtHours(), HoursAccountingSheet(), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate() (+53 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (14): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+6 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.09
Nodes (39): cellLookupsOf(), CellView, cellViewOf(), fmtHours(), reuseCellViews(), sameView(), SOURCE_WORDS, specialtyMatches() (+31 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "analysisExport.test.ts"
Cohesion: 0.09
Nodes (23): 15. Tests, CellDay, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+15 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "EntityForCollection"
Cohesion: 0.22
Nodes (4): FirestoreRepository, sanitizePayload(), repositoryManager, EntityForCollection

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.20
Nodes (9): @firebase/rules-unit-testing, firebase-tools, description, firebase, name, private, scripts, test (+1 more)

### Community 48 - "yearSeed.ts"
Cohesion: 0.29
Nodes (7): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.13
Nodes (14): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+6 more)

### Community 50 - "dialogs.tsx"
Cohesion: 0.20
Nodes (12): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+4 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.12
Nodes (12): AMY, BEA, CARA, DAN, DOCTORS, DUTIES, EARLY, JUNIOR (+4 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.16
Nodes (16): 7. Rules, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup (+8 more)

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

### Community 65 - "uiComponents.test.ts"
Cohesion: 0.20
Nodes (12): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, nextTabIndex(), TabItem (+4 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (31): LeaveAndLocksSheet(), askedCarry(), closePeriod(), countedEarlierRosters(), countHoursInRange(), earlierPeriodTotals(), hoursCheckpoints(), HoursSchedule (+23 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "emailService.ts"
Cohesion: 0.15
Nodes (15): emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload (+7 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+4 more)

### Community 74 - "PublishModal"
Cohesion: 0.16
Nodes (13): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before, 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), PublishView() (+5 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (12): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+4 more)

### Community 77 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 78 - "weekHours.ts"
Cohesion: 0.50
Nodes (7): Other engine files, addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WeekHours, weeksOverLimit()

### Community 79 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 80 - "collectionSyncer.ts"
Cohesion: 0.19
Nodes (9): saveHolidayLeave(), Desired, fingerprint(), Known, planSync(), SyncPlan, saveDoctorSessions(), rebaseEdit() (+1 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "Sidebar.tsx"
Cohesion: 0.24
Nodes (9): LocalModeBanner(), LocalModeBannerProps, NAV_ITEMS, Button(), IconButton(), EmptyState(), ErrorState(), LoadingState() (+1 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (31): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog() (+23 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.11
Nodes (14): ANNUAL_LEAVE, UNPAID_LEAVE, LONG, NOV, OCT, D, E, L (+6 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.13
Nodes (27): ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, Card(), Crumb (+19 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.18
Nodes (4): { chromium }, args, { chromium }, { chromium }

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "SwapManagerModal.tsx"
Cohesion: 0.27
Nodes (11): NONE, SwapManagerModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, RosterCheck, SwapCheck (+3 more)

### Community 89 - "access.ts"
Cohesion: 0.30
Nodes (10): 3. Users, roles and access, usePermissions(), AccountMenu(), TopBar(), canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor() (+2 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.26
Nodes (9): express, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "middleware/auth.ts"
Cohesion: 0.18
Nodes (7): AuthUser, BackendRole, Express, requireOwner, requirePlanner, ROLE_HIERARCHY, authRouter

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "doctorScheduleService.ts"
Cohesion: 0.23
Nodes (16): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), doctorFromDate(), getWeekdayFromIsoDate() (+8 more)

### Community 94 - "repository/index.ts"
Cohesion: 0.26
Nodes (8): DatabaseTab(), defaultFirebaseConfig, StorageMode, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, checkBackup(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "weekHours.test.ts"
Cohesion: 0.10
Nodes (10): ScheduleValidator, SENIOR, LATE, schedule, wishFindings(), EARLY, LATE, shifts (+2 more)

### Community 97 - "16. History of work (for context)"
Cohesion: 0.44
Nodes (8): 16. History of work (for context), addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 98 - "preferenceFocus.test.ts"
Cohesion: 0.18
Nodes (11): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus, CARD, KHAN, LATE (+3 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "ref_node_assert"
Cohesion: 0.08
Nodes (14): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run(), diff() (+6 more)

### Community 104 - "react"
Cohesion: 0.13
Nodes (27): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps (+19 more)

### Community 107 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "CreateScheduleModal.tsx"
Cohesion: 0.26
Nodes (12): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+4 more)

### Community 111 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 112 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "ruleSyncService.ts"
Cohesion: 0.29
Nodes (7): RuleDef, WEEK_HOURS_DEFAULT, CANONICAL_RULES_SPEC, CanonicalRuleDef, MAX_CONSECUTIVE_SHIFTS_NAME, RuleSyncResult, RuleTemplateKey

### Community 115 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 116 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 117 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 118 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 119 - "SchedulesView"
Cohesion: 0.29
Nodes (6): MenuButton(), MenuButtonProps, MenuItem, readStoredScheduleId(), SchedulesView(), storeScheduleId()

### Community 120 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 121 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 122 - "DataTable.tsx"
Cohesion: 0.40
Nodes (5): Column, DataTable(), SortDirection, sortRows(), SortState

### Community 123 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 127 - "FairnessModal.tsx"
Cohesion: 0.26
Nodes (10): FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap, MoveSuggestion, newFindings(), rebalancedFields(), suggestMoves() (+2 more)

## Knowledge Gaps
- **831 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+826 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1008 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `makeNurse`, `formatDate`, `ShareModal.tsx`, `nurseRosterService.ts`, `SchedulesView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `dialogs.tsx`, `RulesTab.tsx`, `uiComponents.test.ts`, `PublishModal`, `Design system: NSC Clinic Roster`, `Sidebar.tsx`, `types/index.ts`, `ui/index.ts`, `SwapManagerModal.tsx`, `access.ts`, `harness/main.tsx`, `doctorScheduleService.ts`, `repository/index.ts`, `CreateScheduleModal.tsx`, `QuickCellPopup.tsx`, `EmailTab.tsx`, `SchedulesView`, `WhoCanCover.tsx`, `DataTable.tsx`, `FairnessModal.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `formatDate`, `ShareModal.tsx`, `nurseRosterService.ts`, `SchedulesView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `dialogs.tsx`, `RulesTab.tsx`, `uiComponents.test.ts`, `Sidebar.tsx`, `ui/index.ts`, `SwapManagerModal.tsx`, `access.ts`, `harness/main.tsx`, `doctorScheduleService.ts`, `repository/index.ts`, `CreateScheduleModal.tsx`, `QuickCellPopup.tsx`, `EmailTab.tsx`, `DataTable.tsx`, `FairnessModal.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `@firebase/rules-unit-testing` connect `firestore-rules/package.json` to `rules.test.mjs`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _831 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.10502577319587629 - nodes in this community are weakly interconnected._
- **Should `DashboardView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13978494623655913 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06385964912280702 - nodes in this community are weakly interconnected._