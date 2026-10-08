# Graph Report - NSC-Clinic-Roster  (2026-10-08)

## Corpus Check
- 297 files · ~348,074 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2337 nodes · 7509 edges · 114 communities (103 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 276 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0ae060b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- analysisExportService.ts
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
- ReportsView.tsx
- makeNurse
- firebaseIdentityService.ts
- SchedulesView.tsx
- compilerOptions
- savingSafety.test.ts
- IRepository.ts
- icsExportService.ts
- devDependencies
- nurseRosterService.ts
- seedRunner.ts
- IRepository
- scripts
- ScheduleValidator.ts
- PlannerSample.tsx
- doctorWeekChange.test.ts
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- weekend.ts
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- ui.tsx
- firestore-rules/package.json
- SchedulingEngine.ts
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- FairnessModal.tsx
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
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- analysisExport.test.ts
- published-rules.mjs
- harness/vite.config.ts
- PublishModal.tsx
- Design system: NSC Clinic Roster
- README.md
- sharing.test.ts
- Field.tsx
- dialogs.tsx
- Sidebar.tsx
- links.cjs
- Button
- types/index.ts
- ref_node_assert
- ui/index.ts
- grid-timing.cjs
- cx
- engineRules.test.ts
- access.ts
- geminiApi.test.ts
- lastResort.test.ts
- harness/main.tsx
- 16. History of work (for context)
- address.ts
- Finish a change
- AppContext.tsx
- fixtures.ts
- changeAlerts.test.ts
- context7
- colorContrast.ts
- firestore-rules-reviewer.md
- versionRestore.test.ts
- firebase-mcp.sh
- react
- start.sh
- stop.sh
- usePresence.ts
- calendar.ts
- index.tsx
- newRosterDates.ts
- ddmmyyyy
- repositoryManager
- devDependencies

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `react` - 92 edges
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
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts

## Import Cycles
- None detected.

## Communities (114 total, 11 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.11
Nodes (78): 5. Data model (Firestore collections), BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps (+70 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.15
Nodes (22): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), readStoredId(), TodayList(), addDays() (+14 more)

### Community 2 - "analysisExportService.ts"
Cohesion: 0.08
Nodes (54): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, resolveClinicSetup() (+46 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 5 - "authService.ts"
Cohesion: 0.11
Nodes (25): LoginPageProps, signOutSafely(), AppShellProps, TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+17 more)

### Community 6 - "notify"
Cohesion: 0.10
Nodes (50): useAppContext(), confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), ClinicTab(), ClinicTabProps (+42 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.18
Nodes (21): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.15
Nodes (35): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+27 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (13): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+5 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.10
Nodes (11): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+3 more)

### Community 16 - "ReportsView.tsx"
Cohesion: 0.10
Nodes (29): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), SortField (+21 more)

### Community 17 - "makeNurse"
Cohesion: 0.12
Nodes (23): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+15 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "SchedulesView.tsx"
Cohesion: 0.09
Nodes (40): Report, What to check, What to look at, MenuButton(), MenuButtonProps, MenuItem, EditDoctorShiftModal(), TIME_PRESETS (+32 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (8): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 22 - "IRepository.ts"
Cohesion: 0.22
Nodes (7): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CollectionName, apps, { initializeTestEnvironment }, requireRules

### Community 23 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (30): dateLabel(), PublishedRosterSheet(), ViewerData, DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView() (+22 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.14
Nodes (22): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+14 more)

### Community 27 - "IRepository"
Cohesion: 0.13
Nodes (21): saveRosterBackup(), restoreVersion(), VersionRestoreResult, applyHolidayChangeToLeave(), saveHolidayLeave(), removeNurseRoster(), revokeNurseLink(), removePublicRoster() (+13 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "ScheduleValidator.ts"
Cohesion: 0.08
Nodes (56): 7. Rules, findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption (+48 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "doctorWeekChange.test.ts"
Cohesion: 0.17
Nodes (10): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+2 more)

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

### Community 38 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.14
Nodes (15): express, express-rate-limit, helmet, createApiApp(), startServer(), authMiddleware(), AuthUser, BackendRole (+7 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.15
Nodes (12): duties, first, goal8(), history, long, nurse, p8, periods (+4 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.20
Nodes (9): @firebase/rules-unit-testing, firebase-tools, description, firebase, name, private, scripts, test (+1 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (48): ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover(), openingHourSlots(), ResolvedClinicSetup (+40 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.08
Nodes (21): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+13 more)

### Community 50 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "FairnessModal.tsx"
Cohesion: 0.08
Nodes (38): Other engine files, uuid, NONE, NurseFairnessMetrics, ProposedSwap, NONE, fmt(), hoursText() (+30 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.10
Nodes (30): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+22 more)

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
Cohesion: 0.07
Nodes (51): 10. Hours, NurseTimesheetModalProps, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+43 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (19): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+11 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "analysisExport.test.ts"
Cohesion: 0.11
Nodes (18): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+10 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "harness/vite.config.ts"
Cohesion: 0.27
Nodes (6): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, clinicApi()

### Community 74 - "PublishModal.tsx"
Cohesion: 0.05
Nodes (63): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before, 12. Publishing and nurse links, nodemailer, Request, emailFailureMessage() (+55 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (12): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+4 more)

### Community 77 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 78 - "Field.tsx"
Cohesion: 0.15
Nodes (12): Checkbox(), DateInput(), Field(), FieldInputProps, inputClass, InputProps, Select(), SelectProps (+4 more)

### Community 79 - "dialogs.tsx"
Cohesion: 0.21
Nodes (10): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, PendingConfirm, settleConfirm() (+2 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.39
Nodes (6): APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "Button"
Cohesion: 0.33
Nodes (7): LocalModeBanner(), LocalModeBannerProps, Button(), EmptyState(), ErrorState(), LoadingState(), Phase 2: design system and app shell

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (33): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditEvent, BlockWeeks, DoctorSessionSource, EmailLogKind (+25 more)

### Community 84 - "ref_node_assert"
Cohesion: 0.10
Nodes (11): DAY_DUTY, SENIOR, LATE, schedule, wishFindings(), DOCTOR, handEdit, leave() (+3 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.16
Nodes (22): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Card(), Crumb (+14 more)

### Community 87 - "cx"
Cohesion: 0.18
Nodes (13): ButtonProps, ButtonSize, ButtonVariant, IconButton(), IconButtonProps, SIZES, VARIANTS, cx() (+5 more)

### Community 88 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 89 - "access.ts"
Cohesion: 0.29
Nodes (8): 3. Users, roles and access, AccountMenu(), TopBar(), canEditClinicData(), canExportReports(), permissionsFor(), roleLabel(), VIEWER_ROUTES

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "16. History of work (for context)"
Cohesion: 0.44
Nodes (8): 16. History of work (for context), addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 94 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "AppContext.tsx"
Cohesion: 0.43
Nodes (5): AppContext, AppContextValue, PlannerData, Permissions, ProblemCount

### Community 97 - "fixtures.ts"
Cohesion: 0.11
Nodes (14): ANNUAL_LEAVE, UNPAID_LEAVE, LONG, NOV, OCT, D, E, L (+6 more)

### Community 98 - "changeAlerts.test.ts"
Cohesion: 0.33
Nodes (5): computeScheduleDiff(), formatAssignment(), diff(), LATE, nurse

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "versionRestore.test.ts"
Cohesion: 0.29
Nodes (4): BACKUPS_KEPT, october, octoberVersion, september

### Community 104 - "react"
Cohesion: 0.15
Nodes (26): lucide-react, react, NoticeTone, openStack, useDialogA11y(), BulkImportModal(), CreateScheduleModal(), DeleteScheduleModal() (+18 more)

### Community 107 - "usePresence.ts"
Cohesion: 0.43
Nodes (5): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord

### Community 108 - "calendar.ts"
Cohesion: 0.53
Nodes (4): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument()

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 111 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

## Knowledge Gaps
- **803 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+798 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 978 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `analysisExportService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `ReportsView.tsx`, `SchedulesView.tsx`, `nurseRosterService.ts`, `ScheduleValidator.ts`, `PlannerSample.tsx`, `data.ts`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `FairnessModal.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `Design system: NSC Clinic Roster`, `Field.tsx`, `dialogs.tsx`, `Sidebar.tsx`, `Button`, `ref_node_assert`, `ui/index.ts`, `cx`, `access.ts`, `harness/main.tsx`, `AppContext.tsx`, `usePresence.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `analysisExportService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `ReportsView.tsx`, `SchedulesView.tsx`, `nurseRosterService.ts`, `ScheduleValidator.ts`, `PlannerSample.tsx`, `data.ts`, `ui.tsx`, `FairnessModal.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `Field.tsx`, `dialogs.tsx`, `Sidebar.tsx`, `Button`, `ui/index.ts`, `cx`, `access.ts`, `harness/main.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `react` to `Assignment`, `analysisExportService.ts`, `authService.ts`, `notify`, `AppShell.tsx`, `Design system: NSC Clinic Roster`, `PublishModal.tsx`, `getRepository`, `dialogs.tsx`, `ReportsView.tsx`, `ScheduleValidator.ts`, `SchedulesView.tsx`, `Button`, `FairnessModal.tsx`, `cx`, `16. History of work (for context)`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _803 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.10636704119850188 - nodes in this community are weakly interconnected._
- **Should `DashboardView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14814814814814814 - nodes in this community are weakly interconnected._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07578084997439836 - nodes in this community are weakly interconnected._