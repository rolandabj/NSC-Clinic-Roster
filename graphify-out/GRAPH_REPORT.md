# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 348 files · ~389,469 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2651 nodes · 8537 edges · 135 communities (126 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 370 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ca54051`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- SchedulesView.tsx
- clinicModel.test.ts
- nurseRosterService.ts
- published-rules.mjs
- getRepository
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
- makeSchedule
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- GridRow.tsx
- devDependencies
- useDialogA11y
- quick reference
- RosterToolbar.tsx
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- CreateScheduleModal.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- FairnessModal.tsx
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
- AvailabilityView.tsx
- 16. History of work (for context)
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
- explainCell.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- guide-with-code.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- firebaseConfig.ts
- ExportModal.tsx
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- ProblemsPanel.tsx
- ref_playwright
- UI overhaul: summary and next steps
- emailLogSize.ts
- access.ts
- apiApp.ts
- weekHours.test.ts
- harness/main.tsx
- authService.ts
- address.ts
- Finish a change
- Rules
- RulesTab.tsx
- formatDate
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- RosterSteps.tsx
- start.sh
- stop.sh
- Rules
- weekend.ts
- FirestoreRepository
- LiveCollectionCache
- nurseClinicFloat.test.ts
- IRepository
- RosterGrid
- cellView.test.ts
- dateDefaults.ts
- usePresence.ts
- holidayLeave.ts
- PublishModal.tsx
- Button.tsx
- 12. Publishing and nurse links
- NSC Clinic Roster: complete project guide
- 13. Screens in detail
- Sidebar.tsx
- plain-english-reviewer.md
- doctorWeekChange.test.ts
- seedRunner.ts
- grid-timing.cjs
- GridToolbar.tsx
- Phase 3: roster grid speed and structure
- icsExportService.ts
- phone.cjs
- fakeAuth.ts
- ui/index.ts
- rowsInSteps.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 116 edges
2. `Assignment` - 113 edges
3. `Nurse` - 96 edges
4. `getRepository()` - 95 edges
5. `Schedule` - 92 edges
6. `lucide-react` - 88 edges
7. `DutyWindow` - 88 edges
8. `16. History of work (for context)` - 82 edges
9. `useDialogA11y()` - 78 edges
10. `Doctor` - 78 edges

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

## Communities (135 total, 9 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.12
Nodes (68): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, ShareModalProps, SwapManagerModalProps (+60 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.21
Nodes (20): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+12 more)

### Community 2 - "SchedulesView.tsx"
Cohesion: 0.09
Nodes (41): NurseTimesheetModalProps, FillDialogProps, FillRange, RosterToolbarProps, useRosterEdits(), SortField, TabMode, fmtHours() (+33 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (28): nurse(), Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D (+20 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (30): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+22 more)

### Community 5 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 6 - "getRepository"
Cohesion: 0.14
Nodes (43): useAppContext(), confirmDialog(), notify(), BulkImportModal(), ShareModal(), TemplateModal(), AccessManagementPanel(), NursesView() (+35 more)

### Community 7 - "authService"
Cohesion: 0.14
Nodes (4): 3. Users, roles and access, authService, computePrivileges(), getAppAuth()

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (24): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+16 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "gridSelection.ts"
Cohesion: 0.11
Nodes (21): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN (+13 more)

### Community 14 - "savingSafety.test.ts"
Cohesion: 0.11
Nodes (11): 11. Saving, live updates, versions, clearYearToDateCache(), forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS (+3 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.10
Nodes (13): saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, changedLists() (+5 more)

### Community 16 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 17 - "makeSchedule"
Cohesion: 0.11
Nodes (16): SchedulingEngine, hoursOnlyRules(), makeSchedule(), LATE, run(), setup(), account(), DOCTOR (+8 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): jose, authMiddleware(), AuthUser, Express, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields (+15 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.14
Nodes (20): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+12 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (13): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+5 more)

### Community 23 - "GridRow.tsx"
Cohesion: 0.13
Nodes (15): FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL, useCellFlags(), fmtHours(), GridRow (+7 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "useDialogA11y"
Cohesion: 0.17
Nodes (23): useDialogA11y(), usePermissions(), DeleteScheduleModal(), DeleteVersionModal(), DeleteVersionModalProps, fmtHours(), NurseTimesheetModal(), SOURCE_LABELS (+15 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "RosterToolbar.tsx"
Cohesion: 0.30
Nodes (8): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar()

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (76): 6. Clinic model (the business rules in plain English), 7. Rules, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, checkAssignment(), hardRule() (+68 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "CreateScheduleModal.tsx"
Cohesion: 0.23
Nodes (12): CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), PeriodProratingBreakdown, WorkingHoursCalculationResult, addDays() (+4 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.15
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "FairnessModal.tsx"
Cohesion: 0.20
Nodes (19): FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap, NONE, SwapManagerModal(), listProblem(), checkSwap() (+11 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.06
Nodes (62): DayProblem, DayRow, dayViewOf(), isPhoneSize(), KIND, ORDER, PHONE_QUERY, isPhone() (+54 more)

### Community 39 - "emailService.ts"
Cohesion: 0.16
Nodes (15): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+7 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "ref_node_assert"
Cohesion: 0.07
Nodes (18): diff(), LATE, nurse, D, E, L, NC, PHL (+10 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "react"
Cohesion: 0.12
Nodes (22): lucide-react, react, uuid, ConfirmOptions, DialogState, dismissNotice(), listeners, Notice (+14 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (34): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+26 more)

### Community 49 - "16. History of work (for context)"
Cohesion: 0.18
Nodes (12): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), firstDayShown(), RosterDayView(), useRosterChecks(), dayTotalWords(), problemWords(), ProblemMark (+4 more)

### Community 50 - "ClinicRoster"
Cohesion: 0.25
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
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

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

### Community 68 - "explainCell.ts"
Cohesion: 0.12
Nodes (24): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay(), ExplainNurseDayInput (+16 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.17
Nodes (11): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+3 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

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
Cohesion: 0.14
Nodes (12): useLatestCallback(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens (+4 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 79 - "firebaseConfig.ts"
Cohesion: 0.40
Nodes (4): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 80 - "ExportModal.tsx"
Cohesion: 0.08
Nodes (45): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+37 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.15
Nodes (17): AppContext, AppContextValue, AuthModalProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+9 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (32): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus (+24 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.08
Nodes (33): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+25 more)

### Community 85 - "ProblemsPanel.tsx"
Cohesion: 0.12
Nodes (14): react-dom, ConfirmBox(), DialogHost(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), wholeDates() (+6 more)

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 89 - "access.ts"
Cohesion: 0.29
Nodes (9): AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor(), roleLabel() (+1 more)

### Community 90 - "apiApp.ts"
Cohesion: 0.16
Nodes (12): express, @google/genai, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 91 - "weekHours.test.ts"
Cohesion: 0.25
Nodes (3): CANONICAL_RULES_SPEC, LONG, OCT

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "authService.ts"
Cohesion: 0.22
Nodes (11): LoginPageProps, signOutSafely(), AppShellProps, AuthModal(), AccessManagementPanelProps, MASTER_ADMIN_EMAIL, UserPrivileges, UserProfile (+3 more)

### Community 94 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "RulesTab.tsx"
Cohesion: 0.15
Nodes (18): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+10 more)

### Community 98 - "formatDate"
Cohesion: 0.14
Nodes (20): FillDialog(), RosterPicker(), readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet(), HolidayDayOffPicker(), HolidayDayOffPickerProps (+12 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.16
Nodes (22): CreateScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, InternalSlot, doctorFromDate() (+14 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "weekend.ts"
Cohesion: 0.18
Nodes (12): ClinicTab(), ClinicTabProps, SaveStatus, WEEKDAY_NAMES, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ClinicProfile, currentWeekendDays (+4 more)

### Community 110 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 111 - "nurseClinicFloat.test.ts"
Cohesion: 0.09
Nodes (15): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run() (+7 more)

### Community 112 - "IRepository"
Cohesion: 0.13
Nodes (17): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+9 more)

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
Cohesion: 0.21
Nodes (9): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, frame, november (+1 more)

### Community 117 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 118 - "PublishModal.tsx"
Cohesion: 0.20
Nodes (21): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink(), nurseLinkUrl() (+13 more)

### Community 119 - "Button.tsx"
Cohesion: 0.21
Nodes (11): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, EmptyState() (+3 more)

### Community 120 - "12. Publishing and nurse links"
Cohesion: 0.24
Nodes (7): 12. Publishing and nurse links, buildTeamRosterSheet(), ensurePublicRosters(), pick(), syncPublicRoster(), RosterPublishService, safeColor()

### Community 121 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.18
Nodes (8): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, WalkthroughModal(), WalkthroughModalProps

### Community 122 - "13. Screens in detail"
Cohesion: 0.42
Nodes (8): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift()

### Community 123 - "Sidebar.tsx"
Cohesion: 0.39
Nodes (6): APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "doctorWeekChange.test.ts"
Cohesion: 0.10
Nodes (16): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, DR_PEDS (+8 more)

### Community 126 - "seedRunner.ts"
Cohesion: 0.20
Nodes (11): ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup(), initializeDatabaseIfEmpty() (+3 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "GridToolbar.tsx"
Cohesion: 0.40
Nodes (4): GRID_KEY_ID, GridLegend(), GridToolbarProps, GridZoom

### Community 129 - "Phase 3: roster grid speed and structure"
Cohesion: 0.14
Nodes (14): CellContextMenu(), GridToolbar(), cellKeyOf(), useGridSelection(), Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+6 more)

### Community 130 - "icsExportService.ts"
Cohesion: 0.14
Nodes (20): RFC-5545, calendarRouter, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact() (+12 more)

### Community 131 - "phone.cjs"
Cohesion: 0.50
Nodes (3): args, { chromium }, t()

### Community 132 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 133 - "ui/index.ts"
Cohesion: 0.11
Nodes (38): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Card(), Crumb (+30 more)

### Community 134 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

## Knowledge Gaps
- **913 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+908 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1111 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `SchedulesView.tsx`, `GridToolbar.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `getRepository`, `rowsInSteps.ts`, `Phase 3: roster grid speed and structure`, `package.json`, `AppShell.tsx`, `gridSelection.ts`, `EmailTab.tsx`, `NurseSample.tsx`, `App.tsx`, `GridRow.tsx`, `useDialogA11y`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `CreateScheduleModal.tsx`, `FairnessModal.tsx`, `WorkbookGrid.tsx`, `AvailabilityView.tsx`, `explainCell.ts`, `UI overhaul: checklist`, `ExportModal.tsx`, `ClinicContextState`, `fixtures.ts`, `ProblemsPanel.tsx`, `access.ts`, `harness/main.tsx`, `authService.ts`, `RulesTab.tsx`, `formatDate`, `DoctorsView.tsx`, `RosterSteps.tsx`, `weekend.ts`, `usePresence.ts`, `PublishModal.tsx`, `Button.tsx`, `NSC Clinic Roster: complete project guide`, `13. Screens in detail`, `Sidebar.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `SchedulesView.tsx`, `GridToolbar.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `EmailTab.tsx`, `NurseSample.tsx`, `App.tsx`, `GridRow.tsx`, `useDialogA11y`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `CreateScheduleModal.tsx`, `FairnessModal.tsx`, `WorkbookGrid.tsx`, `AvailabilityView.tsx`, `ExportModal.tsx`, `ProblemsPanel.tsx`, `access.ts`, `harness/main.tsx`, `authService.ts`, `RulesTab.tsx`, `formatDate`, `DoctorsView.tsx`, `RosterSteps.tsx`, `weekend.ts`, `PublishModal.tsx`, `Button.tsx`, `13. Screens in detail`, `Sidebar.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `Assignment`, `Phase 3: roster grid speed and structure`, `ui/index.ts`, `getRepository`, `rowsInSteps.ts`, `AppShell.tsx`, `gridSelection.ts`, `CollectionSyncer`, `GridRow.tsx`, `useDialogA11y`, `RosterToolbar.tsx`, `SchedulingEngine.ts`, `WorkbookGrid.tsx`, `AvailabilityView.tsx`, `Design system: NSC Clinic Roster`, `UI overhaul: checklist`, `ProblemsPanel.tsx`, `access.ts`, `address.ts`, `formatDate`, `RosterSteps.tsx`, `FirestoreRepository`, `IRepository`, `RosterGrid`, `dateDefaults.ts`, `usePresence.ts`, `Button.tsx`, `NSC Clinic Roster: complete project guide`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _913 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.12492997198879552 - nodes in this community are weakly interconnected._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08599290780141844 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._