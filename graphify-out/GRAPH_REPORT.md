# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 291 files · ~342,827 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2307 nodes · 7399 edges · 112 communities (103 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 270 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6f63ee3`
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
- hoursAccounting.ts
- makeNurse
- firebaseIdentityService.ts
- formatDate
- compilerOptions
- yearToDate.ts
- createLiveReconciler
- FirestoreRepository
- devDependencies
- emailService.ts
- IRepository.ts
- IRepository
- scripts
- QuickCellPopup.tsx
- PlannerSample.tsx
- DoctorsView.tsx
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- ref_node_assert
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- MyRosterView.tsx
- Frontend UI Engineering
- quotaTracker
- ui.tsx
- published-rules.mjs
- SchedulingEngine.ts
- holidayLeave.ts
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
- PublishModal
- apiApp.ts
- EmailTab.tsx
- Design system: NSC Clinic Roster
- README.md
- lastResort.test.ts
- 16. History of work (for context)
- dialogs.tsx
- usePresence.ts
- fixtures.ts
- handMoveChecks.ts
- types/index.ts
- weekHours.test.ts
- ui/index.ts
- CreateScheduleModal.tsx
- Button.tsx
- uiComponents.test.ts
- seedRunner.ts
- geminiApi.test.ts
- UI overhaul: checklist
- harness/main.tsx
- ClinicTab.tsx
- ClinicRoster
- Finish a change
- Phase 2: design system and app shell
- plain-english-reviewer.md
- ddmmyyyy
- context7
- emailSettingsStore.ts
- firestore-rules-reviewer.md
- DoctorsScheduleSheet.tsx
- firebase-mcp.sh
- react
- start.sh
- stop.sh
- colorContrast.ts
- dateDefaults.ts
- index.tsx
- newRosterDates.ts
- ruleChecker.test.ts

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
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `9. Checking a roster (`src/services/validation/ScheduleValidator.ts`)` --references--> `recordHolidayDayOff()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/requests/staffRequestService.ts

## Import Cycles
- None detected.

## Communities (112 total, 9 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (83): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+75 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.09
Nodes (41): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+33 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (44): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, FLOAT_ROLE_ID (+36 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "icsExportService.ts"
Cohesion: 0.14
Nodes (19): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+11 more)

### Community 5 - "authService.ts"
Cohesion: 0.08
Nodes (34): 3. Users, roles and access, LoginPageProps, usePermissions(), AppShellProps, NAV_ITEMS, SidebarProps, TopBarProps, AuthModalProps (+26 more)

### Community 6 - "getRepository"
Cohesion: 0.16
Nodes (38): confirmDialog(), notify(), BulkImportModal(), TemplateModal(), AccessManagementPanel(), NursesView(), DatabaseTabProps, DutiesTab() (+30 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.13
Nodes (26): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+18 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (38): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+30 more)

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.11
Nodes (10): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+2 more)

### Community 16 - "hoursAccounting.ts"
Cohesion: 0.13
Nodes (27): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField, TabMode (+19 more)

### Community 17 - "makeNurse"
Cohesion: 0.10
Nodes (24): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account() (+16 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "formatDate"
Cohesion: 0.13
Nodes (22): readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet(), HolidayDayOffPicker(), HolidayDayOffPickerProps, LeaveAndLocksSheet(), ProblemsPanel() (+14 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.15
Nodes (18): nurseClinicRoleOf(), YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds() (+10 more)

### Community 22 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.19
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+5 more)

### Community 26 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 27 - "IRepository"
Cohesion: 0.15
Nodes (10): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removePublicRoster(), fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository (+2 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "DoctorsView.tsx"
Cohesion: 0.20
Nodes (17): DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, DeleteDoctorShiftParams, doctorFromDate(), nextDay() (+9 more)

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

### Community 38 - "ref_node_assert"
Cohesion: 0.08
Nodes (16): ctx(), EARLY, LATE, diff(), LATE, nurse, CARD, EARLY (+8 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.19
Nodes (10): authMiddleware(), Express, Request, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken(), emailRouter (+2 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "MyRosterView.tsx"
Cohesion: 0.17
Nodes (20): dateLabel(), PublishedRosterSheet(), LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate() (+12 more)

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
Cohesion: 0.06
Nodes (85): 6. Clinic model (the business rules in plain English), 7. Rules, How a run works, CellChoice, cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso() (+77 more)

### Community 49 - "holidayLeave.ts"
Cohesion: 0.13
Nodes (20): 0. Quick start for a new chat, 10. Hours, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+12 more)

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
Nodes (22): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+14 more)

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
Cohesion: 0.12
Nodes (27): leaveCountingOnHoliday(), askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+19 more)

### Community 69 - "Phases"
Cohesion: 0.11
Nodes (18): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+10 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "analysisExport.test.ts"
Cohesion: 0.09
Nodes (21): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+13 more)

### Community 72 - "PublishModal"
Cohesion: 0.13
Nodes (14): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before, 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), PublishView() (+6 more)

### Community 73 - "apiApp.ts"
Cohesion: 0.12
Nodes (15): repoRoot, swaps, express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react (+7 more)

### Community 74 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (12): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+4 more)

### Community 77 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 78 - "16. History of work (for context)"
Cohesion: 0.24
Nodes (14): 16. History of work (for context), cx(), Checkbox(), DateInput(), Field(), FieldInputProps, Input(), inputClass (+6 more)

### Community 79 - "dialogs.tsx"
Cohesion: 0.20
Nodes (12): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+4 more)

### Community 80 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 81 - "fixtures.ts"
Cohesion: 0.11
Nodes (14): ANNUAL_LEAVE, UNPAID_LEAVE, LONG, NOV, OCT, D, E, L (+6 more)

### Community 82 - "handMoveChecks.ts"
Cohesion: 0.13
Nodes (26): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, Other engine files, FairnessModal(), SwapManagerModal(), fmt(), hoursText(), WhoCanCover() (+18 more)

### Community 83 - "types/index.ts"
Cohesion: 0.08
Nodes (28): isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, ApprovalStatus (+20 more)

### Community 84 - "weekHours.test.ts"
Cohesion: 0.08
Nodes (13): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, JUNIOR (+5 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.20
Nodes (16): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Card(), Crumb (+8 more)

### Community 86 - "CreateScheduleModal.tsx"
Cohesion: 0.27
Nodes (11): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+3 more)

### Community 87 - "Button.tsx"
Cohesion: 0.22
Nodes (9): ButtonProps, ButtonSize, ButtonVariant, IconButton(), IconButtonProps, SIZES, VARIANTS, Dialog() (+1 more)

### Community 88 - "uiComponents.test.ts"
Cohesion: 0.24
Nodes (8): Column, DataTable(), SortDirection, sortRows(), SortState, Phase 6: Nurses, Doctors, Availability and Requests (planner screens), columns, Row

### Community 89 - "seedRunner.ts"
Cohesion: 0.16
Nodes (18): DatabaseTab(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats (+10 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "ClinicTab.tsx"
Cohesion: 0.27
Nodes (8): ClinicTab(), ClinicTabProps, SaveStatus, SettingsViewProps, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ClinicProfile, getWeekendDays()

### Community 94 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Phase 2: design system and app shell"
Cohesion: 0.27
Nodes (8): MenuButton(), MenuButtonProps, MenuItem, Button(), EmptyState(), ErrorState(), LoadingState(), Phase 2: design system and app shell

### Community 97 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 98 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "emailSettingsStore.ts"
Cohesion: 0.38
Nodes (7): removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), cache(), cachedEmailSettings(), loadEmailSettings(), saveEmailSettings()

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "DoctorsScheduleSheet.tsx"
Cohesion: 0.36
Nodes (8): EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift(), WEEKDAY_FULL_NAMES

### Community 104 - "react"
Cohesion: 0.12
Nodes (26): lucide-react, react, uuid, NoticeTone, signOutSafely(), openStack, useDialogA11y(), DeleteScheduleModal() (+18 more)

### Community 107 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 108 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 112 - "ruleChecker.test.ts"
Cohesion: 0.33
Nodes (4): EARLY, LATE, restFindings(), shifts

## Knowledge Gaps
- **794 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+789 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 965 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `hoursAccounting.ts`, `makeNurse`, `formatDate`, `QuickCellPopup.tsx`, `PlannerSample.tsx`, `DoctorsView.tsx`, `data.ts`, `MyRosterView.tsx`, `ui.tsx`, `SchedulingEngine.ts`, `holidayLeave.ts`, `RulesTab.tsx`, `PublishModal`, `EmailTab.tsx`, `Design system: NSC Clinic Roster`, `16. History of work (for context)`, `dialogs.tsx`, `usePresence.ts`, `handMoveChecks.ts`, `ui/index.ts`, `CreateScheduleModal.tsx`, `Button.tsx`, `uiComponents.test.ts`, `seedRunner.ts`, `harness/main.tsx`, `ClinicTab.tsx`, `Phase 2: design system and app shell`, `DoctorsScheduleSheet.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `hoursAccounting.ts`, `formatDate`, `QuickCellPopup.tsx`, `PlannerSample.tsx`, `DoctorsView.tsx`, `data.ts`, `MyRosterView.tsx`, `ui.tsx`, `SchedulingEngine.ts`, `RulesTab.tsx`, `EmailTab.tsx`, `16. History of work (for context)`, `dialogs.tsx`, `ui/index.ts`, `CreateScheduleModal.tsx`, `Button.tsx`, `uiComponents.test.ts`, `seedRunner.ts`, `harness/main.tsx`, `ClinicTab.tsx`, `Phase 2: design system and app shell`, `DoctorsScheduleSheet.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `react` to `SchedulesView.tsx`, `ExportModal.tsx`, `getRepository`, `AppShell.tsx`, `AvailabilityView.tsx`, `hoursAccounting.ts`, `formatDate`, `DoctorsView.tsx`, `SchedulingEngine.ts`, `Phases`, `PublishModal`, `Design system: NSC Clinic Roster`, `16. History of work (for context)`, `dialogs.tsx`, `handMoveChecks.ts`, `CreateScheduleModal.tsx`, `Button.tsx`, `Phase 2: design system and app shell`, `DoctorsScheduleSheet.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _794 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11232323232323232 - nodes in this community are weakly interconnected._
- **Should `DashboardView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09219858156028368 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0889894419306184 - nodes in this community are weakly interconnected._