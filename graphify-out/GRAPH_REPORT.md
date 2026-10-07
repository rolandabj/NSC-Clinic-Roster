# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 295 files · ~345,199 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2324 nodes · 7476 edges · 112 communities (104 shown, 8 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 275 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3513234`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- DashboardView.tsx
- ExportModal.tsx
- clinicModel.test.ts
- icsExportService.ts
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
- formatDate
- compilerOptions
- yearToDate.ts
- ref_node_assert
- AvailabilityView.tsx
- devDependencies
- nurseRoster.test.ts
- seedRunner.ts
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
- quotaTracker
- nurseClinicFloat.test.ts
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- nurseRosterService.ts
- Frontend UI Engineering
- MyRosterView.tsx
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
- Phases
- Source-Driven Development
- analysisExport.test.ts
- guide-with-code.mjs
- harness/vite.config.ts
- PublishModal.tsx
- Design system: NSC Clinic Roster
- README.md
- weekHours.test.ts
- cx
- dialogs.tsx
- Sidebar.tsx
- publicRosterService.ts
- handMoveChecks.ts
- types/index.ts
- fixtures.ts
- ui/index.ts
- ClinicTab.tsx
- Button.tsx
- engineRules.test.ts
- access.ts
- geminiApi.test.ts
- UI overhaul: checklist
- harness/main.tsx
- 16. History of work (for context)
- address.ts
- Finish a change
- uiComponents.test.ts
- hoursRules.test.ts
- ddmmyyyy
- context7
- calendar.ts
- firestore-rules-reviewer.md
- WhoCanCover.tsx
- firebase-mcp.sh
- react
- start.sh
- stop.sh
- weekHours.ts
- ask-before-main.mjs
- index.tsx
- newRosterDates.ts
- MenuButton.tsx

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

## Communities (112 total, 8 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.14
Nodes (67): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+59 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (18): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+10 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (44): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+36 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "icsExportService.ts"
Cohesion: 0.27
Nodes (13): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+5 more)

### Community 5 - "authService.ts"
Cohesion: 0.11
Nodes (25): LoginPageProps, signOutSafely(), AccountMenu(), TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, AllRequestsPanelProps (+17 more)

### Community 6 - "notify"
Cohesion: 0.15
Nodes (37): confirmDialog(), notify(), AccessManagementPanel(), DatabaseTab(), DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours() (+29 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (21): PageLoading(), AppShell(), bootstrap(), AppShellProps, AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.12
Nodes (39): 13. Screens in detail, CreateScheduleModal(), EditDoctorShiftModal(), ShareModal(), SwapManagerModal(), TemplateModal(), AllRequestsPanel(), Draft (+31 more)

### Community 14 - "App.tsx"
Cohesion: 0.14
Nodes (11): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+3 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.09
Nodes (12): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, FirestoreRepository (+4 more)

### Community 16 - "ReportsView.tsx"
Cohesion: 0.12
Nodes (29): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, CHANGE_LABELS, VersionCompareModal() (+21 more)

### Community 17 - "makeNurse"
Cohesion: 0.12
Nodes (23): DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+15 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "formatDate"
Cohesion: 0.12
Nodes (22): Report, What to check, What to look at, DateInput(), HolidayDayOffPicker(), HolidayDayOffPickerProps, ProblemsPanel(), ProblemsPanelProps (+14 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (23): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+15 more)

### Community 22 - "ref_node_assert"
Cohesion: 0.10
Nodes (12): computeScheduleDiff(), formatAssignment(), ctx(), EARLY, LATE, diff(), LATE, nurse (+4 more)

### Community 23 - "AvailabilityView.tsx"
Cohesion: 0.20
Nodes (18): 10. Hours, ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, leaveApprovalFields(), applyHolidayChangeToLeave(), DatedLeave, datesOf() (+10 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRoster.test.ts"
Cohesion: 0.15
Nodes (16): loadViewerData(), buildNurseRosterDoc(), buildTeamRosterSheet(), latestPublishedVersions(), shiftDetail(), syncNurseRosters(), todayIso(), base (+8 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.13
Nodes (24): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+16 more)

### Community 27 - "IRepository"
Cohesion: 0.12
Nodes (20): saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+12 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.11
Nodes (32): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+24 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "DoctorsView.tsx"
Cohesion: 0.13
Nodes (26): DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, InternalSlot, doctorFromDate(), generateDoctorSessionsForDateRange() (+18 more)

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

### Community 37 - "quotaTracker"
Cohesion: 0.10
Nodes (10): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, LiveCollectionCache, entry (+2 more)

### Community 38 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (13): express, express-rate-limit, helmet, createApiApp(), startServer(), authMiddleware(), AuthUser, BackendRole (+5 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "nurseRosterService.ts"
Cohesion: 0.21
Nodes (13): BuildNurseRosterInput, dayMonth(), formatRosterAsText(), NURSE_ROSTER_LOOKBACK_DAYS, nurseCalendarUrl(), nurseWebcalUrl(), origin(), RegenerateNurseLinkResult (+5 more)

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "MyRosterView.tsx"
Cohesion: 0.20
Nodes (17): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+9 more)

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (63): 6. Clinic model (the business rules in plain English), 7. Rules, How a run works, CoverageSheet(), checkAssignment(), hardRule(), minutes(), restHoursBetween() (+55 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.10
Nodes (17): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, ClinicRoster (+9 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (12): forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues (+4 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.11
Nodes (14): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+6 more)

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
Cohesion: 0.10
Nodes (39): LeaveAndLocksSheet(), askedCarry(), closePeriod(), countHoursInRange(), earlierPeriodTotals(), HoursPart, HoursSchedule, Leftover (+31 more)

### Community 69 - "Phases"
Cohesion: 0.11
Nodes (18): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+10 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+11 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.12
Nodes (7): command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }, builtServer, __dirname, __filename

### Community 73 - "harness/vite.config.ts"
Cohesion: 0.27
Nodes (6): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, clinicApi()

### Community 74 - "PublishModal.tsx"
Cohesion: 0.06
Nodes (55): 12. Publishing and nurse links, nodemailer, Request, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService (+47 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.15
Nodes (17): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+9 more)

### Community 77 - "weekHours.test.ts"
Cohesion: 0.11
Nodes (10): SchedulingEngine, DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES (+2 more)

### Community 78 - "cx"
Cohesion: 0.23
Nodes (12): cx(), Checkbox(), Field(), FieldInputProps, Input(), inputClass, InputProps, Select() (+4 more)

### Community 79 - "dialogs.tsx"
Cohesion: 0.20
Nodes (14): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+6 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.36
Nodes (7): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 81 - "publicRosterService.ts"
Cohesion: 0.23
Nodes (9): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster(), SubscribeCallback, Unsubscribe, deleteEntireSchedule() (+1 more)

### Community 82 - "handMoveChecks.ts"
Cohesion: 0.27
Nodes (14): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, Other engine files, FairnessModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext (+6 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (37): isPairing(), PREFERENCE_FOCUS_LABELS, othersOnRoster(), STALE_MS, TAB_ID, usePresence(), ApprovalStatus, AuditAction (+29 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.08
Nodes (20): ScheduleValidator, ANNUAL_LEAVE, SENIOR, UNPAID_LEAVE, LONG, NOV, OCT, DR_PEDS (+12 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.20
Nodes (16): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Card(), Crumb (+8 more)

### Community 86 - "ClinicTab.tsx"
Cohesion: 0.24
Nodes (9): ClinicTab(), ClinicTabProps, EmailTabProps, SaveStatus, WEEKDAY_NAMES, SettingsViewProps, SEED_CLINIC_PROFILE, ClinicProfile (+1 more)

### Community 87 - "Button.tsx"
Cohesion: 0.18
Nodes (12): LocalModeBanner(), LocalModeBannerProps, Button(), ButtonProps, ButtonSize, ButtonVariant, IconButton(), IconButtonProps (+4 more)

### Community 88 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 89 - "access.ts"
Cohesion: 0.29
Nodes (10): 3. Users, roles and access, 4. Navigation and app shell, TopBar(), canAccessRoute(), canEditClinicData(), canExportReports(), Permissions, permissionsFor() (+2 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

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

### Community 96 - "uiComponents.test.ts"
Cohesion: 0.20
Nodes (11): Column, DataTable(), SortDirection, sortRows(), SortState, EmptyState(), ErrorState(), LoadingState() (+3 more)

### Community 97 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 98 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "calendar.ts"
Cohesion: 0.43
Nodes (5): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), NurseRosterDoc

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 104 - "react"
Cohesion: 0.15
Nodes (21): lucide-react, react, uuid, NoticeTone, openStack, useDialogA11y(), BulkImportModal(), CreateScheduleModalProps (+13 more)

### Community 107 - "weekHours.ts"
Cohesion: 0.52
Nodes (6): addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WeekHours, weeksOverLimit()

### Community 108 - "ask-before-main.mjs"
Cohesion: 0.50
Nodes (4): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 111 - "MenuButton.tsx"
Cohesion: 0.50
Nodes (3): MenuButton(), MenuButtonProps, MenuItem

## Knowledge Gaps
- **798 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+793 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 969 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `ReportsView.tsx`, `makeNurse`, `formatDate`, `AvailabilityView.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `DoctorsView.tsx`, `data.ts`, `MyRosterView.tsx`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `RulesTab.tsx`, `PublishModal.tsx`, `cx`, `dialogs.tsx`, `Sidebar.tsx`, `types/index.ts`, `ui/index.ts`, `ClinicTab.tsx`, `Button.tsx`, `access.ts`, `harness/main.tsx`, `uiComponents.test.ts`, `WhoCanCover.tsx`, `MenuButton.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `ReportsView.tsx`, `formatDate`, `AvailabilityView.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `DoctorsView.tsx`, `data.ts`, `MyRosterView.tsx`, `ui.tsx`, `RulesTab.tsx`, `PublishModal.tsx`, `cx`, `dialogs.tsx`, `Sidebar.tsx`, `ui/index.ts`, `ClinicTab.tsx`, `Button.tsx`, `harness/main.tsx`, `uiComponents.test.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `SchedulesView.tsx`, `DashboardView.tsx`, `MemoryRepo`, `authService.ts`, `notify`, `react`, `AppShell.tsx`, `PublishModal.tsx`, `App.tsx`, `Sidebar.tsx`, `types/index.ts`, `AvailabilityView.tsx`, `access.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _798 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14145569620253165 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09125188536953242 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._