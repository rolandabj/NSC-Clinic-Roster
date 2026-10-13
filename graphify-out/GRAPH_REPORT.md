# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 322 files · ~369,778 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2526 nodes · 8012 edges · 134 communities (125 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 324 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `355876ff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- rosterPdfService.ts
- clinicModel.test.ts
- PublishModal.tsx
- dialogs.tsx
- getRepository
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AvailabilityView.tsx
- lucide-react
- CollectionSyncer
- IRepository.ts
- makeSchedule
- firebaseIdentityService.ts
- react
- compilerOptions
- createLiveReconciler
- explainCell.ts
- gridSelection.ts
- devDependencies
- nurseRosterService.ts
- HistoryView.tsx
- IRepository
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- published-rules.mjs
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- icsExportService.ts
- WorkbookGrid.tsx
- emailService.ts
- Optimization Patterns
- cellView.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- ui.tsx
- firestore-rules/package.json
- yearToDate.ts
- ClinicRoster
- weekend.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- quotaTracker
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
- ref_node_test
- guide-with-code.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- handMoves.test.ts
- ExportModal.tsx
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- analysisExportService.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- NSC Clinic Roster: complete project guide
- authService.ts
- geminiApi.test.ts
- dateDefaults.ts
- harness/main.tsx
- scheduleTransactions.test.ts
- assignmentChecks.ts
- Finish a change
- Rules
- 16. History of work (for context)
- WarningsSheet.tsx
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- SchedulesView.tsx
- start.sh
- stop.sh
- Rules
- nurseClinicFloat.test.ts
- index.tsx
- emailLogSize.ts
- lastResort.test.ts
- seedRunner.ts
- devDependencies
- ref_node_assert
- checkScheduler.test.ts
- fakeAuth.ts
- holidayLeave.ts
- EmailTab.tsx
- PublishedRosterSheet.tsx
- analysisExport.test.ts
- WhoCanCover.tsx
- usePresence.ts
- CreateScheduleModal.tsx
- plain-english-reviewer.md
- middleware/auth.ts
- ddmmyyyy
- publicRosterService.ts
- FillDialog.tsx
- GridSelection
- GridRow.tsx
- SENIOR
- RosterSteps.tsx
- dateUtils.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 108 edges
2. `react` - 100 edges
3. `getRepository()` - 95 edges
4. `Schedule` - 90 edges
5. `Nurse` - 87 edges
6. `DutyWindow` - 83 edges
7. `lucide-react` - 81 edges
8. `useDialogA11y()` - 78 edges
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
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts

## Import Cycles
- None detected.

## Communities (134 total, 9 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.18
Nodes (54): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, SwapManagerModalProps, TemplateModalProps (+46 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.17
Nodes (22): bootstrap(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId() (+14 more)

### Community 2 - "rosterPdfService.ts"
Cohesion: 0.12
Nodes (20): jspdf, chunk(), exportRosterToPdf(), firstName(), GRID, HEAD_FILL, hexToRgb(), HOLIDAY_HEAD (+12 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishModal.tsx"
Cohesion: 0.18
Nodes (22): Things that went wrong before, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink() (+14 more)

### Community 5 - "dialogs.tsx"
Cohesion: 0.22
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+5 more)

### Community 6 - "getRepository"
Cohesion: 0.14
Nodes (41): useAppContext(), confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), ClinicTab(), DatabaseTab(), DatabaseTabProps (+33 more)

### Community 7 - "authService"
Cohesion: 0.11
Nodes (8): 3. Users, roles and access, authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, testFirestoreConnection()

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.11
Nodes (31): 4. Navigation and app shell, AppShell(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+23 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (37): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+29 more)

### Community 14 - "lucide-react"
Cohesion: 0.14
Nodes (14): lucide-react, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+6 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.08
Nodes (17): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+9 more)

### Community 16 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 17 - "makeSchedule"
Cohesion: 0.10
Nodes (20): SchedulingEngine, hoursOnlyRules(), makeSchedule(), LATE, run(), setup(), CARD, doctorOfAmy() (+12 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "react"
Cohesion: 0.23
Nodes (15): react, uuid, NoticeTone, openStack, useDialogA11y(), BulkImportModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 22 - "explainCell.ts"
Cohesion: 0.13
Nodes (16): 7. Rules, BlockedShift, explainNurseDay(), ExplainNurseDayInput, pendingLeaveOn(), plainReason(), PossibleShift, round1() (+8 more)

### Community 23 - "gridSelection.ts"
Cohesion: 0.21
Nodes (12): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelectionState, keyOf() (+4 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (24): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), downloadIcsFile() (+16 more)

### Community 26 - "HistoryView.tsx"
Cohesion: 0.12
Nodes (25): DeleteVersionModal(), DeleteVersionModalProps, ShareModalProps, CHANGE_LABELS, VersionCompareModal(), SOURCE_LABELS, VersionViewModal(), WEEKDAY_NAMES (+17 more)

### Community 27 - "IRepository"
Cohesion: 0.16
Nodes (8): saveRosterBackup(), restoreVersion(), VersionRestoreResult, fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository, PopulateRecurringDoctorSessionsParams

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.17
Nodes (27): ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes(), hoursToCover(), isFreeDuring() (+19 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (15): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+7 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "icsExportService.ts"
Cohesion: 0.15
Nodes (19): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+11 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.13
Nodes (24): cellLookupsOf(), DayTotal, dayTotalsOf(), moveSelection(), findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote (+16 more)

### Community 39 - "emailService.ts"
Cohesion: 0.19
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+5 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.ts"
Cohesion: 0.14
Nodes (18): CellDay, cellViewOf(), fmtHours(), reuseCellViews(), sameView(), SOURCE_WORDS, specialtyMatches(), withDr() (+10 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

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

### Community 48 - "yearToDate.ts"
Cohesion: 0.13
Nodes (23): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+15 more)

### Community 49 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 50 - "weekend.ts"
Cohesion: 0.19
Nodes (11): ClinicTabProps, SaveStatus, WEEKDAY_NAMES, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ClinicProfile, currentWeekendDays, DEFAULT_WEEKEND_DAYS (+3 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (24): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+16 more)

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
Cohesion: 0.40
Nodes (4): Always, with every change (owner's standing instruction), Caveman voice in every chat (owner's choice of 13-10-2026), graphify, NSC Clinic Roster

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
Nodes (31): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), hoursCheckpoints(), HoursPart, HoursSchedule, Leftover (+23 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "ref_node_test"
Cohesion: 0.14
Nodes (8): BACKUPS_KEPT, EARLY, LATE, restFindings(), shifts, october, octoberVersion, september

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "UI overhaul: checklist"
Cohesion: 0.13
Nodes (13): useLatestCallback(), changedLists(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails (+5 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.12
Nodes (11): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, JUNIOR (+3 more)

### Community 79 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

### Community 80 - "ExportModal.tsx"
Cohesion: 0.12
Nodes (31): jspdf-autotable, xlsx, usePermissions(), ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+23 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.12
Nodes (23): AppContext, AppContextValue, APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, TopBarProps, AuditTrailViewProps (+15 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (33): NONE, NurseFairnessMetrics, ProposedSwap, NONE, checkSwap(), isPinnedShift(), MoveContext, MoveSuggestion (+25 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.11
Nodes (16): ANNUAL_LEAVE, makeLeave(), UNPAID_LEAVE, LONG, NOV, OCT, D, E (+8 more)

### Community 85 - "analysisExportService.ts"
Cohesion: 0.14
Nodes (28): 10. Hours, fmtHours(), HoursAccountingSheet(), isLateDuty(), ANALYSIS_FORMAT_VERSION, buildRosterAnalysis(), countBy(), FIELD_GUIDE (+20 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (17): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works (+9 more)

### Community 89 - "authService.ts"
Cohesion: 0.15
Nodes (19): LoginPageProps, signOutSafely(), AppShellProps, AccountMenu(), TopBar(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+11 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "scheduleTransactions.test.ts"
Cohesion: 0.12
Nodes (9): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS, apps, { initializeTestEnvironment } (+1 more)

### Community 94 - "assignmentChecks.ts"
Cohesion: 0.16
Nodes (25): 6. Clinic model (the business rules in plain English), Other engine files, FairnessModal(), checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween() (+17 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "16. History of work (for context)"
Cohesion: 0.09
Nodes (50): 16. History of work (for context), Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Button() (+42 more)

### Community 98 - "WarningsSheet.tsx"
Cohesion: 0.27
Nodes (9): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding (+1 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.20
Nodes (20): 13. Screens in detail, CreateScheduleModal(), EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), doctorFromDate() (+12 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "SchedulesView.tsx"
Cohesion: 0.16
Nodes (23): DeleteScheduleModal(), DeleteScheduleModalProps, SwapManagerModal(), FillDialog(), RosterPicker(), RosterPickerProps, RosterSheet, RosterSheetTabs() (+15 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 111 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 112 - "seedRunner.ts"
Cohesion: 0.15
Nodes (18): removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase() (+10 more)

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "ref_node_assert"
Cohesion: 0.11
Nodes (15): ctx(), EARLY, LATE, DAY_DUTY, makeNurse(), account(), LATE, schedule (+7 more)

### Community 115 - "checkScheduler.test.ts"
Cohesion: 0.25
Nodes (5): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 116 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 117 - "holidayLeave.ts"
Cohesion: 0.22
Nodes (11): applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy(), saveHolidayLeave() (+3 more)

### Community 118 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 119 - "PublishedRosterSheet.tsx"
Cohesion: 0.29
Nodes (9): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), PublishedRosterView(), loadPublishedRoster(), buildTeamRosterSheet(), loadPublicRoster(), escapeHtml() (+1 more)

### Community 120 - "analysisExport.test.ts"
Cohesion: 0.22
Nodes (10): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+2 more)

### Community 121 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 122 - "usePresence.ts"
Cohesion: 0.21
Nodes (8): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), frame, november, now

### Community 123 - "CreateScheduleModal.tsx"
Cohesion: 0.36
Nodes (7): CreateScheduleModalProps, WorkingHoursCalculationResult, addDays(), iso(), monthEnd(), suggestNewRosterDates(), BlockWeeks

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (13): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+5 more)

### Community 126 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 127 - "publicRosterService.ts"
Cohesion: 0.22
Nodes (11): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+3 more)

### Community 128 - "FillDialog.tsx"
Cohesion: 0.21
Nodes (11): MenuButton(), MenuButtonProps, MenuItem, FillDialogProps, FillRange, RosterMenuItem, RosterToolbarProps, GenerationPreflightSummary (+3 more)

### Community 129 - "GridSelection"
Cohesion: 0.15
Nodes (4): CellView, GridCellProps, GridRowProps, GridSelection

### Community 130 - "GridRow.tsx"
Cohesion: 0.31
Nodes (8): GridCell, GridCellActions, fmtHours(), GridRow, GridRowActions, hoursDisplay(), PROBLEM_SEPARATOR, rowViewsOf()

### Community 131 - "SENIOR"
Cohesion: 0.18
Nodes (6): EARLY, input(), LATE, softHoursLimit, week, SENIOR

### Community 132 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 133 - "dateUtils.ts"
Cohesion: 0.48
Nodes (4): formatDateTime(), formatDayDate(), parseDayMonthYear(), WEEKDAYS

## Knowledge Gaps
- **872 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+867 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1066 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `FillDialog.tsx`, `DashboardView.tsx`, `Assignment`, `GridRow.tsx`, `PublishModal.tsx`, `dialogs.tsx`, `RosterSteps.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `lucide-react`, `gridSelection.ts`, `nurseRosterService.ts`, `HistoryView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `weekend.ts`, `RulesTab.tsx`, `UI overhaul: checklist`, `ExportModal.tsx`, `ClinicContextState`, `types/index.ts`, `NSC Clinic Roster: complete project guide`, `authService.ts`, `harness/main.tsx`, `16. History of work (for context)`, `WarningsSheet.tsx`, `doctorScheduleService.ts`, `SchedulesView.tsx`, `ref_node_assert`, `EmailTab.tsx`, `PublishedRosterSheet.tsx`, `WhoCanCover.tsx`, `usePresence.ts`, `CreateScheduleModal.tsx`, `publicRosterService.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `FillDialog.tsx`, `DashboardView.tsx`, `Assignment`, `PublishModal.tsx`, `dialogs.tsx`, `RosterSteps.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `react`, `gridSelection.ts`, `nurseRosterService.ts`, `HistoryView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `weekend.ts`, `RulesTab.tsx`, `ExportModal.tsx`, `ClinicContextState`, `types/index.ts`, `authService.ts`, `harness/main.tsx`, `16. History of work (for context)`, `WarningsSheet.tsx`, `doctorScheduleService.ts`, `SchedulesView.tsx`, `EmailTab.tsx`, `PublishedRosterSheet.tsx`, `CreateScheduleModal.tsx`, `publicRosterService.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `FillDialog.tsx`, `DashboardView.tsx`, `rosterPdfService.ts`, `clinicModel.test.ts`, `PublishModal.tsx`, `SENIOR`, `GridRow.tsx`, `CollectionSyncer`, `makeSchedule`, `react`, `explainCell.ts`, `nurseRosterService.ts`, `HistoryView.tsx`, `IRepository`, `SchedulingEngine.ts`, `icsExportService.ts`, `WorkbookGrid.tsx`, `cellView.ts`, `continuousHours.test.ts`, `yearToDate.ts`, `hoursBalance.ts`, `ref_node_test`, `engineRules.test.ts`, `handMoves.test.ts`, `ExportModal.tsx`, `types/index.ts`, `fixtures.ts`, `analysisExportService.ts`, `NSC Clinic Roster: complete project guide`, `assignmentChecks.ts`, `doctorScheduleService.ts`, `SchedulesView.tsx`, `nurseClinicFloat.test.ts`, `lastResort.test.ts`, `ref_node_assert`, `analysisExport.test.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _872 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rosterPdfService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `getRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.14150943396226415 - nodes in this community are weakly interconnected._