# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 343 files · ~386,090 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2624 nodes · 8409 edges · 136 communities (127 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 360 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04436065`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- published-rules.mjs
- notify
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- gridSelection.ts
- savingSafety.test.ts
- CollectionSyncer
- EmailTab.tsx
- makeNurse
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- GridTable.tsx
- devDependencies
- middleware/auth.ts
- quick reference
- RosterToolbar.tsx
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- WorkingHoursPeriodsPanel.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- preferenceFocus.test.ts
- WorkbookGrid.tsx
- emailService.ts
- Optimization Patterns
- ref_node_assert
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- quotaTracker
- react
- firestore-rules/package.json
- getRepository
- checkScheduler.test.ts
- ClinicRoster
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- IRepository.ts
- Incremental Implementation
- handMoves.test.ts
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
- hoursPolicy.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- guide-with-code.mjs
- apiApp.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- firebaseConfig.ts
- analysisExportService.ts
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- GridStatusBar.tsx
- ref_playwright
- UI overhaul: summary and next steps
- emailLogSize.ts
- navigation.ts
- geminiApi.test.ts
- weekHours.test.ts
- harness/main.tsx
- authService.ts
- address.ts
- Finish a change
- Rules
- emailSettingsStore.ts
- 16. History of work (for context)
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
- teamRoster.test.ts
- LiveCollectionCache
- sharing.test.ts
- IRepository
- RosterGrid
- cellView.test.ts
- dateDefaults.ts
- usePresence.ts
- holidayLeave.ts
- PublishModal.tsx
- createLiveReconciler
- analysisExport.test.ts
- NSC Clinic Roster: complete project guide
- requestFindings.test.ts
- WhoCanCover.tsx
- plain-english-reviewer.md
- lastResort.test.ts
- seedRunner.ts
- grid-timing.cjs
- dialogs.tsx
- editSaving.test.ts
- icsExportService.ts
- newRosterDates.ts
- fakeAuth.ts
- ui/index.ts
- rowsInSteps.ts
- 17. Known quirks and ideas for later

## God Nodes (most connected - your core abstractions)
1. `react` - 114 edges
2. `Assignment` - 110 edges
3. `getRepository()` - 95 edges
4. `Nurse` - 94 edges
5. `Schedule` - 92 edges
6. `DutyWindow` - 88 edges
7. `lucide-react` - 87 edges
8. `useDialogA11y()` - 78 edges
9. `Doctor` - 77 edges
10. `16. History of work (for context)` - 77 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (136 total, 9 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.13
Nodes (73): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+65 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (22): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+14 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.09
Nodes (42): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField (+34 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (34): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+26 more)

### Community 5 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 6 - "notify"
Cohesion: 0.12
Nodes (41): confirmDialog(), dismissNotice(), notify(), setState(), TemplateModal(), AccessManagementPanel(), ClinicTab(), ClinicTabProps (+33 more)

### Community 7 - "authService"
Cohesion: 0.15
Nodes (3): 3. Users, roles and access, authService, getAppAuth()

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (22): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "gridSelection.ts"
Cohesion: 0.11
Nodes (20): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf() (+12 more)

### Community 14 - "savingSafety.test.ts"
Cohesion: 0.12
Nodes (10): Desired, Known, SyncPlan, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps (+2 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.13
Nodes (4): CollectionSyncer, FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 16 - "EmailTab.tsx"
Cohesion: 0.19
Nodes (14): EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+6 more)

### Community 17 - "makeNurse"
Cohesion: 0.11
Nodes (25): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+17 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.15
Nodes (20): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+12 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (13): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+5 more)

### Community 23 - "GridTable.tsx"
Cohesion: 0.11
Nodes (28): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+20 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "middleware/auth.ts"
Cohesion: 0.24
Nodes (9): authMiddleware(), AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken(), Acknowledgment (+1 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "RosterToolbar.tsx"
Cohesion: 0.21
Nodes (12): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+4 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (47): 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+39 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.31
Nodes (10): WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown, SEED_CLINIC_PROFILE (+2 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (15): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+7 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (50): CellContextMenu(), CellChoice, CellEditorDialog(), withDr(), cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews() (+42 more)

### Community 39 - "emailService.ts"
Cohesion: 0.16
Nodes (15): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+7 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "ref_node_assert"
Cohesion: 0.12
Nodes (9): BACKUPS_KEPT, ctx(), EARLY, LATE, LATE, nurse, october, octoberVersion (+1 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 46 - "react"
Cohesion: 0.08
Nodes (42): lucide-react, react, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal() (+34 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "getRepository"
Cohesion: 0.13
Nodes (39): NoticeTone, AllRequestsPanel(), AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+31 more)

### Community 49 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 50 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoves.test.ts"
Cohesion: 0.05
Nodes (56): Other engine files, FairnessModal(), ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField (+48 more)

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

### Community 68 - "hoursPolicy.ts"
Cohesion: 0.32
Nodes (7): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditPerDay(), leaveDaysInRange()

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (19): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+11 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "apiApp.ts"
Cohesion: 0.18
Nodes (11): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+3 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.15
Nodes (17): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+9 more)

### Community 77 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.12
Nodes (11): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, JUNIOR (+3 more)

### Community 79 - "firebaseConfig.ts"
Cohesion: 0.33
Nodes (5): defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 80 - "analysisExportService.ts"
Cohesion: 0.07
Nodes (57): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, FLOAT_ROLE_ID (+49 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.13
Nodes (15): TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+7 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (30): uuid, ShareModal(), TabType, AuditTrailView(), PREFERENCE_FOCUS_LABELS, InternalSlot, ensurePublicRosters(), StorageMode (+22 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.09
Nodes (21): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, LONG, NOV, OCT (+13 more)

### Community 85 - "GridStatusBar.tsx"
Cohesion: 0.17
Nodes (12): react-dom, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), GridStatusBar(), SelectionView(), problemCountWords() (+4 more)

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "emailLogSize.ts"
Cohesion: 0.33
Nodes (6): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, EmailRecipientLog

### Community 89 - "navigation.ts"
Cohesion: 0.13
Nodes (21): 4. Navigation and app shell, AppContext, AppContextValue, APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, Sidebar() (+13 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.16
Nodes (11): express, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights() (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "authService.ts"
Cohesion: 0.19
Nodes (14): LoginPageProps, signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL (+6 more)

### Community 94 - "address.ts"
Cohesion: 0.38
Nodes (5): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "emailSettingsStore.ts"
Cohesion: 0.27
Nodes (8): restoreVersion(), removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), cache(), saveEmailSettings(), DEFAULT_EMAIL_SETTINGS, EmailProviderType

### Community 98 - "16. History of work (for context)"
Cohesion: 0.23
Nodes (15): 16. History of work (for context), cx(), Checkbox(), DateInput(), Field(), FieldInputProps, Input(), inputClass (+7 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.18
Nodes (22): 13. Screens in detail, CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, WorkingHoursCalculationResult (+14 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "SchedulesView.tsx"
Cohesion: 0.15
Nodes (20): VersionCompareModal(), FillDialog(), RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), readStoredScheduleId(), SchedulesView() (+12 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 110 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.10
Nodes (16): VersionRestoreResult, saveHolidayLeave(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster(), fingerprint() (+8 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 115 - "dateDefaults.ts"
Cohesion: 0.39
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 116 - "usePresence.ts"
Cohesion: 0.29
Nodes (7): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 117 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 118 - "PublishModal.tsx"
Cohesion: 0.20
Nodes (19): Things that went wrong before, 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), computeScheduleDiff() (+11 more)

### Community 119 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 120 - "analysisExport.test.ts"
Cohesion: 0.12
Nodes (15): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+7 more)

### Community 121 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.20
Nodes (11): 0. Quick start for a new chat, 14. Server, security and config, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works (+3 more)

### Community 122 - "requestFindings.test.ts"
Cohesion: 0.33
Nodes (3): LATE, schedule, wishFindings()

### Community 123 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 126 - "seedRunner.ts"
Cohesion: 0.17
Nodes (19): useAppContext(), DatabaseTab(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult (+11 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "dialogs.tsx"
Cohesion: 0.18
Nodes (12): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, PendingConfirm (+4 more)

### Community 129 - "editSaving.test.ts"
Cohesion: 0.18
Nodes (12): 11. Saving, live updates, versions, useLatestCallback(), useRosterEdits(), fingerprint(), planSync(), changedLists(), sameItems(), rebaseEdit() (+4 more)

### Community 130 - "icsExportService.ts"
Cohesion: 0.13
Nodes (21): RFC-5545, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText() (+13 more)

### Community 131 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 132 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 133 - "ui/index.ts"
Cohesion: 0.09
Nodes (40): LocalModeBanner(), LocalModeBannerProps, Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES (+32 more)

### Community 134 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 135 - "17. Known quirks and ideas for later"
Cohesion: 0.50
Nodes (3): 17. Known quirks and ideas for later, WalkthroughModal(), WalkthroughModalProps

## Knowledge Gaps
- **901 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+896 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1099 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dialogs.tsx`, `editSaving.test.ts`, `Assignment`, `hoursBalance.ts`, `nurseRosterService.ts`, `ui/index.ts`, `DashboardView.tsx`, `17. Known quirks and ideas for later`, `notify`, `package.json`, `AppShell.tsx`, `rowsInSteps.ts`, `gridSelection.ts`, `EmailTab.tsx`, `NurseSample.tsx`, `App.tsx`, `GridTable.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `WorkingHoursPeriodsPanel.tsx`, `WorkbookGrid.tsx`, `getRepository`, `handMoves.test.ts`, `analysisExportService.ts`, `types/index.ts`, `fixtures.ts`, `GridStatusBar.tsx`, `navigation.ts`, `harness/main.tsx`, `authService.ts`, `16. History of work (for context)`, `doctorScheduleService.ts`, `SchedulesView.tsx`, `usePresence.ts`, `PublishModal.tsx`, `WhoCanCover.tsx`, `seedRunner.ts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `dialogs.tsx`, `Assignment`, `hoursBalance.ts`, `DashboardView.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `notify`, `package.json`, `AppShell.tsx`, `EmailTab.tsx`, `NurseSample.tsx`, `App.tsx`, `GridTable.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `WorkingHoursPeriodsPanel.tsx`, `WorkbookGrid.tsx`, `getRepository`, `handMoves.test.ts`, `analysisExportService.ts`, `types/index.ts`, `GridStatusBar.tsx`, `navigation.ts`, `harness/main.tsx`, `authService.ts`, `16. History of work (for context)`, `doctorScheduleService.ts`, `SchedulesView.tsx`, `PublishModal.tsx`, `seedRunner.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `DashboardView.tsx`, `doctorScheduleService.ts`, `nurseRosterService.ts`, `notify`, `SchedulesView.tsx`, `AppShell.tsx`, `react`, `getRepository`, `EmailTab.tsx`, `types/index.ts`, `usePresence.ts`, `PublishModal.tsx`, `App.tsx`, `navigation.ts`, `authService.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _901 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.13044640470462443 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0889894419306184 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._