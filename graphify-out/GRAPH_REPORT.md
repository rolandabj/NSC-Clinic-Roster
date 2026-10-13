# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 341 files · ~384,218 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2619 nodes · 8392 edges · 134 communities (125 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 358 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fc4ea349`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- ReportsView.tsx
- clinicModel.test.ts
- nurseRosterService.ts
- published-rules.mjs
- confirmDialog
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AllRequestsPanel.tsx
- EntityForCollection
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
- shared.tsx
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
- assignmentChecks.ts
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
- staffRequestService.ts
- checkScheduler.test.ts
- ClinicRoster
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- FirestoreRepository.ts
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
- data.ts
- guide-with-code.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- handMoves.test.ts
- rosterPdfService.ts
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- Badge.tsx
- ref_playwright
- UI overhaul: summary and next steps
- emailLogSize.ts
- access.ts
- apiApp.ts
- weekHours.test.ts
- harness/main.tsx
- authService.ts
- uiComponents.test.ts
- Finish a change
- Rules
- SettingsView.tsx
- formatDate
- context7
- Schedule
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- RosterSteps.tsx
- start.sh
- stop.sh
- Rules
- nurseClinicFloat.test.ts
- Sidebar.tsx
- LiveCollectionCache
- sharing.test.ts
- IRepository
- RosterGrid
- cellView.test.ts
- dateDefaults.ts
- usePresence.ts
- holidayLeave.ts
- getRepository
- createLiveReconciler
- analysisExport.test.ts
- NSC Clinic Roster: complete project guide
- doctorWeekChange.test.ts
- explainCell.ts
- plain-english-reviewer.md
- lastResort.test.ts
- seedRunner.ts
- grid-timing.cjs
- 16. History of work (for context)
- SchedulesView.tsx
- calendar.ts
- newRosterDates.ts
- weekend.ts
- ui/index.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 113 edges
2. `Assignment` - 110 edges
3. `getRepository()` - 95 edges
4. `Nurse` - 94 edges
5. `Schedule` - 92 edges
6. `DutyWindow` - 88 edges
7. `lucide-react` - 87 edges
8. `useDialogA11y()` - 78 edges
9. `Doctor` - 77 edges
10. `16. History of work (for context)` - 76 edges

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

## Communities (134 total, 9 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.15
Nodes (60): 5. Data model (Firestore collections), BulkImportModalProps, ExportModalProps, ExportTab, WEEKDAY_NAMES, FairnessModalProps, NONE, NurseFairnessMetrics (+52 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (16): useAppContext(), Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList() (+8 more)

### Community 2 - "ReportsView.tsx"
Cohesion: 0.21
Nodes (16): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), SortField (+8 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.05
Nodes (70): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before, RFC-5545, 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet() (+62 more)

### Community 5 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 6 - "confirmDialog"
Cohesion: 0.19
Nodes (21): confirmDialog(), DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab(), HolidaysTabProps, BUILT_IN, NurseSkillsTab() (+13 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (23): firebase, name, private, type, version, autoprefixer, cors, date-fns (+15 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.10
Nodes (33): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+25 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AllRequestsPanel.tsx"
Cohesion: 0.23
Nodes (15): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+7 more)

### Community 14 - "EntityForCollection"
Cohesion: 0.36
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 15 - "CollectionSyncer"
Cohesion: 0.07
Nodes (22): 11. Saving, live updates, versions, useLatestCallback(), useRosterEdits(), forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known (+14 more)

### Community 16 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 17 - "makeNurse"
Cohesion: 0.12
Nodes (21): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account(), CARD (+13 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.12
Nodes (22): authMiddleware(), AuthUser, Express, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken(), emailRouter (+14 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.11
Nodes (24): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+16 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (13): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+5 more)

### Community 23 - "GridTable.tsx"
Cohesion: 0.06
Nodes (45): CellView, DayTotal, dayTotalsOf(), dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions (+37 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "shared.tsx"
Cohesion: 0.21
Nodes (11): ClinicTabProps, BUILT_IN_LEAVE_CODES, isBuiltInCode(), LeaveTab(), LeaveTabProps, LEAVE_COLOR_PALETTE, SaveStatus, SettingsDialogProps (+3 more)

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
Cohesion: 0.10
Nodes (51): 6. Clinic model (the business rules in plain English), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+43 more)

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
Cohesion: 0.33
Nodes (9): WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown, SEED_CLINIC_PROFILE (+1 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (15): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+7 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "assignmentChecks.ts"
Cohesion: 0.12
Nodes (32): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FairnessModal(), checkAssignment(), hardRule(), listProblem() (+24 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.08
Nodes (44): FillDialog(), CellContextMenu(), CellEditorDialog(), withDr(), cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews() (+36 more)

### Community 39 - "emailService.ts"
Cohesion: 0.20
Nodes (12): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult, ServerEmailConfig (+4 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "ref_node_assert"
Cohesion: 0.12
Nodes (10): ctx(), EARLY, LATE, diff(), LATE, nurse, emptyProps, october (+2 more)

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
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "react"
Cohesion: 0.09
Nodes (46): lucide-react, react, ConfirmOptions, DialogState, dismissNotice(), listeners, Notice, NoticeTone (+38 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.25
Nodes (14): NurseSelfServicePanel(), cancelAvailabilityRequest(), cancelLeaveRequest(), countPendingApprovals(), dayOffLockId(), daysInclusive(), isPendingLeave(), listMyRequests() (+6 more)

### Community 49 - "checkScheduler.test.ts"
Cohesion: 0.23
Nodes (7): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), recordHolidayDayOff(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 50 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "FirestoreRepository.ts"
Cohesion: 0.13
Nodes (18): FirebaseClientConfig, CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict() (+10 more)

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
Cohesion: 0.12
Nodes (26): LeaveAndLocksSheet(), askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+18 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+12 more)

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
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 79 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 80 - "rosterPdfService.ts"
Cohesion: 0.09
Nodes (39): jspdf, jspdf-autotable, xlsx, ExportModal(), fmtHours(), fmtHours(), HoursAccountingSheet(), isFloatShift() (+31 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.12
Nodes (22): AppContext, AppContextValue, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+14 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (26): NONE, CellChoice, InternalSlot, ApprovalStatus, AssignmentKind, AuditAction, AuditEvent, DoctorSessionSource (+18 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.14
Nodes (13): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, LONG, NOV, OCT (+5 more)

### Community 85 - "Badge.tsx"
Cohesion: 0.18
Nodes (13): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), PROBLEM_MARKS, ProblemCounts(), ProblemKind, Tone, TONE_CLASSES (+5 more)

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
Cohesion: 0.21
Nodes (15): 3. Users, roles and access, 4. Navigation and app shell, signOutSafely(), usePermissions(), AccountMenu(), TopBar(), TopBarProps, canAccessRoute() (+7 more)

### Community 90 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): express, @google/genai, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 91 - "weekHours.test.ts"
Cohesion: 0.11
Nodes (10): SchedulingEngine, D, E, L, NC, PHL, SENIOR, week (+2 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "authService.ts"
Cohesion: 0.23
Nodes (11): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, computePrivileges(), MASTER_ADMIN_EMAIL, UserPrivileges (+3 more)

### Community 94 - "uiComponents.test.ts"
Cohesion: 0.21
Nodes (10): Badge(), ProblemBadge(), Column, DataTable(), SortDirection, sortRows(), SortState, Phase 6: Nurses, Doctors, Availability and Requests (planner screens) (+2 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "SettingsView.tsx"
Cohesion: 0.36
Nodes (10): AccessManagementPanel(), ClinicTab(), SettingsView(), cache(), cachedEmailSettings(), loadEmailSettings(), saveEmailSettings(), DEFAULT_EMAIL_SETTINGS (+2 more)

### Community 98 - "formatDate"
Cohesion: 0.13
Nodes (23): readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet(), HolidayDayOffPicker(), HolidayDayOffPickerProps, ProblemsPanel(), ProblemsPanelProps (+15 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "Schedule"
Cohesion: 0.11
Nodes (38): CreateScheduleModal(), CreateScheduleModalProps, DeleteScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), EditDoctorShiftModalProps (+30 more)

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

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "Sidebar.tsx"
Cohesion: 0.36
Nodes (7): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.13
Nodes (12): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), removePublicRoster(), fingerprint(), syncScheduleAssignments(), repositoryManager (+4 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 115 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 116 - "usePresence.ts"
Cohesion: 0.26
Nodes (8): RosterToolbarProps, othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 117 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 118 - "getRepository"
Cohesion: 0.13
Nodes (29): uuid, Request, EmailHtmlPreview(), DeleteVersionModalProps, PublishModal(), Step, ShareModal(), ShareModalProps (+21 more)

### Community 119 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 120 - "analysisExport.test.ts"
Cohesion: 0.12
Nodes (15): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+7 more)

### Community 121 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.22
Nodes (8): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, WalkthroughModal(), WalkthroughModalProps

### Community 122 - "doctorWeekChange.test.ts"
Cohesion: 0.11
Nodes (13): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, LATE (+5 more)

### Community 123 - "explainCell.ts"
Cohesion: 0.14
Nodes (21): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+13 more)

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 126 - "seedRunner.ts"
Cohesion: 0.17
Nodes (18): DatabaseTab(), DatabaseTabProps, removeNurseRoster(), revokeNurseLink(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase() (+10 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "16. History of work (for context)"
Cohesion: 0.22
Nodes (10): 16. History of work (for context), react-dom, ConfirmBox(), DialogHost(), Button(), EmptyState(), ErrorState(), LoadingState() (+2 more)

### Community 129 - "SchedulesView.tsx"
Cohesion: 0.38
Nodes (6): FillDialogProps, FillRange, GenerationPreflightSummary, GenerationProgress, RegenerateMode, BACKUPS_KEPT

### Community 130 - "calendar.ts"
Cohesion: 0.53
Nodes (4): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument()

### Community 131 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 132 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 133 - "ui/index.ts"
Cohesion: 0.13
Nodes (27): ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, Card(), Crumb (+19 more)

## Knowledge Gaps
- **901 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+896 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1099 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `SchedulesView.tsx`, `ReportsView.tsx`, `16. History of work (for context)`, `nurseRosterService.ts`, `ui/index.ts`, `DashboardView.tsx`, `confirmDialog`, `package.json`, `AppShell.tsx`, `AllRequestsPanel.tsx`, `EmailTab.tsx`, `NurseSample.tsx`, `App.tsx`, `GridTable.tsx`, `shared.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `WorkingHoursPeriodsPanel.tsx`, `WorkbookGrid.tsx`, `ref_node_assert`, `staffRequestService.ts`, `RulesTab.tsx`, `ClinicContextState`, `types/index.ts`, `Badge.tsx`, `access.ts`, `harness/main.tsx`, `authService.ts`, `uiComponents.test.ts`, `SettingsView.tsx`, `formatDate`, `Schedule`, `RosterSteps.tsx`, `Sidebar.tsx`, `usePresence.ts`, `getRepository`, `NSC Clinic Roster: complete project guide`, `explainCell.ts`, `seedRunner.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `SchedulesView.tsx`, `ReportsView.tsx`, `16. History of work (for context)`, `nurseRosterService.ts`, `ui/index.ts`, `DashboardView.tsx`, `confirmDialog`, `package.json`, `AppShell.tsx`, `AllRequestsPanel.tsx`, `EmailTab.tsx`, `NurseSample.tsx`, `App.tsx`, `GridTable.tsx`, `shared.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `WorkingHoursPeriodsPanel.tsx`, `WorkbookGrid.tsx`, `staffRequestService.ts`, `RulesTab.tsx`, `types/index.ts`, `Badge.tsx`, `access.ts`, `harness/main.tsx`, `authService.ts`, `uiComponents.test.ts`, `SettingsView.tsx`, `formatDate`, `Schedule`, `RosterSteps.tsx`, `Sidebar.tsx`, `getRepository`, `seedRunner.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `SchedulesView.tsx`, `DashboardView.tsx`, `ReportsView.tsx`, `nurseRosterService.ts`, `clinicModel.test.ts`, `CollectionSyncer`, `makeNurse`, `yearToDate.ts`, `GridTable.tsx`, `SchedulingEngine.ts`, `assignmentChecks.ts`, `WorkbookGrid.tsx`, `ref_node_assert`, `continuousHours.test.ts`, `react`, `hoursBalance.ts`, `engineRules.test.ts`, `handMoves.test.ts`, `rosterPdfService.ts`, `types/index.ts`, `fixtures.ts`, `weekHours.test.ts`, `Schedule`, `nurseClinicFloat.test.ts`, `sharing.test.ts`, `IRepository`, `cellView.test.ts`, `getRepository`, `analysisExport.test.ts`, `doctorWeekChange.test.ts`, `explainCell.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _901 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `nurseRosterService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.053482221569203646 - nodes in this community are weakly interconnected._
- **Should `published-rules.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.11052631578947368 - nodes in this community are weakly interconnected._