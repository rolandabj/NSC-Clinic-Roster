# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 355 files · ~393,735 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2675 nodes · 8649 edges · 117 communities (106 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 381 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7bd5bd0f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- emailService.ts
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- handMoveChecks.ts
- react
- authService.ts
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- GridTable.tsx
- savingSafety.test.ts
- CollectionSyncer
- NurseSelfServicePanel.tsx
- makeSchedule
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- middleware/auth.ts
- devDependencies
- RosterToolbar.tsx
- quick reference
- ProblemsPanel.tsx
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- newRosterDates.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- fixtures.ts
- 16. History of work (for context)
- publicRosterService.ts
- Optimization Patterns
- explainCell.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- quotaTracker
- useDialogA11y
- firestore-rules/package.json
- AvailabilityView.tsx
- WhoCanCover.tsx
- GridToolbar.tsx
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- seedRunner.ts
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
- WorkbookGrid.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- grid-keys.cjs
- analysisExportService.ts
- links.cjs
- types/index.ts
- makeNurse
- ProblemCounts
- ref_playwright
- UI overhaul: summary and next steps
- doctorWeekChange.test.ts
- geminiApi.test.ts
- Button
- harness/main.tsx
- Finish a change
- Rules
- RulesTab.tsx
- SchedulesView.tsx
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- start.sh
- stop.sh
- Rules
- FirestoreRepository
- LiveCollectionCache
- ref_node_assert
- IRepository
- RosterGrid
- cellView.test.ts
- dateDefaults.ts
- usePresence.ts
- PublishModal.tsx
- NSC Clinic Roster: complete project guide
- weekHours.test.ts
- grid-timing.cjs
- my-requests.cjs
- ui/index.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 116 edges
2. `Assignment` - 113 edges
3. `Nurse` - 96 edges
4. `getRepository()` - 95 edges
5. `Schedule` - 92 edges
6. `DutyWindow` - 89 edges
7. `lucide-react` - 88 edges
8. `16. History of work (for context)` - 88 edges
9. `Doctor` - 78 edges
10. `useDialogA11y()` - 76 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx

## Import Cycles
- None detected.

## Communities (117 total, 11 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.12
Nodes (77): 5. Data model (Firestore collections), BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE (+69 more)

### Community 1 - "emailService.ts"
Cohesion: 0.16
Nodes (14): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+6 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (32): LeaveAndLocksSheet(), askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+24 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (28): nurse(), Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D (+20 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.05
Nodes (67): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before, RFC-5545, dateLabel(), PublishedRosterSheet() (+59 more)

### Community 5 - "handMoveChecks.ts"
Cohesion: 0.18
Nodes (18): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FairnessModal(), listProblem(), checkSwap(), isPinnedShift() (+10 more)

### Community 6 - "react"
Cohesion: 0.09
Nodes (67): lucide-react, react, uuid, useAppContext(), confirmDialog(), ConfirmOptions, DialogState, dismissNotice() (+59 more)

### Community 7 - "authService.ts"
Cohesion: 0.06
Nodes (39): LoginPageProps, signOutSafely(), AppShellProps, AccountMenu(), TopBar(), AuthModal(), AuthModalProps, ShareModal() (+31 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.06
Nodes (64): 4. Navigation and app shell, AppContext, AppContextValue, PageLoading(), AppShell(), bootstrap(), AuditTrailView, AvailabilityView (+56 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "GridTable.tsx"
Cohesion: 0.06
Nodes (46): CellView, problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL, useCellFlags() (+38 more)

### Community 14 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (10): clearYearToDateCache(), forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS (+2 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.08
Nodes (17): 11. Saving, live updates, versions, useRosterEdits(), GridToolbar(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+9 more)

### Community 16 - "NurseSelfServicePanel.tsx"
Cohesion: 0.20
Nodes (18): Badge(), Dialog(), NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest(), dayStatus() (+10 more)

### Community 17 - "makeSchedule"
Cohesion: 0.12
Nodes (11): makeSchedule(), LATE, run(), account(), CARD, EARLY, FULL, LATE (+3 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.12
Nodes (25): 10. Hours, YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), isLateDuty(), lateDutyThreshold(), clamp() (+17 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+4 more)

### Community 23 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (12): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+4 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.18
Nodes (14): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, FillRange, moreMenuItems() (+6 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "ProblemsPanel.tsx"
Cohesion: 0.22
Nodes (8): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (50): 6. Clinic model (the business rules in plain English), dayTotalsOf(), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+42 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 34 - "MemoryRepo"
Cohesion: 0.15
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.09
Nodes (21): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), UNPAID_LEAVE, LONG, NOV, OCT, D (+13 more)

### Community 38 - "16. History of work (for context)"
Cohesion: 0.13
Nodes (25): 16. History of work (for context), DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER (+17 more)

### Community 39 - "publicRosterService.ts"
Cohesion: 0.31
Nodes (5): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), ScheduleDeleteResult

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "useDialogA11y"
Cohesion: 0.12
Nodes (30): 3. Users, roles and access, openStack, useDialogA11y(), usePermissions(), CreateScheduleModal(), DeleteScheduleModal(), DeleteVersionModal(), fmtHours() (+22 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (36): NoticeTone, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+28 more)

### Community 49 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 50 - "GridToolbar.tsx"
Cohesion: 0.50
Nodes (3): GRID_KEY_ID, GridToolbarProps, GridZoom

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "seedRunner.ts"
Cohesion: 0.11
Nodes (26): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+18 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+14 more)

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

### Community 68 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (50): 7. Rules, CellContextMenu(), CellChoice, CellEditorDialog(), withDr(), cellLookupsOf(), cellViewOf(), fmtHours() (+42 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.17
Nodes (11): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+3 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

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

### Community 80 - "analysisExportService.ts"
Cohesion: 0.05
Nodes (73): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps (+65 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 83 - "types/index.ts"
Cohesion: 0.05
Nodes (38): isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus, AuditAction (+30 more)

### Community 84 - "makeNurse"
Cohesion: 0.09
Nodes (25): 15. Tests, SchedulingEngine, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+17 more)

### Community 85 - "ProblemCounts"
Cohesion: 0.14
Nodes (12): react-dom, ConfirmBox(), DialogHost(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), wholeDates() (+4 more)

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "doctorWeekChange.test.ts"
Cohesion: 0.09
Nodes (17): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, SENIOR (+9 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "Button"
Cohesion: 0.16
Nodes (14): Button(), EmptyState(), ErrorState(), LoadingState(), Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility (+6 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 98 - "SchedulesView.tsx"
Cohesion: 0.08
Nodes (33): Report, What to check, What to look at, useLatestCallback(), SwapManagerModal(), FillDialog(), RosterPicker(), RosterStep (+25 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.15
Nodes (23): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, nextRowLimit(), ROW_STEP, useRowsInSteps() (+15 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "FirestoreRepository"
Cohesion: 0.23
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 110 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 111 - "ref_node_assert"
Cohesion: 0.11
Nodes (10): diff(), LATE, nurse, DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC (+2 more)

### Community 112 - "IRepository"
Cohesion: 0.11
Nodes (23): DeleteVersionModalProps, ShareModalProps, BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), removeNurseRoster() (+15 more)

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
Cohesion: 0.27
Nodes (8): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, frame, november

### Community 118 - "PublishModal.tsx"
Cohesion: 0.13
Nodes (31): 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), EmailTab() (+23 more)

### Community 121 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.08
Nodes (22): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, ClinicRoster (+14 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.09
Nodes (41): PROBLEM_MARKS, ProblemKind, Tone, TONE_CLASSES, ButtonProps, ButtonSize, ButtonVariant, IconButtonProps (+33 more)

## Knowledge Gaps
- **917 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+912 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1118 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `nurseRosterService.ts`, `ui/index.ts`, `authService.ts`, `package.json`, `AppShell.tsx`, `GridTable.tsx`, `NurseSelfServicePanel.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `ProblemsPanel.tsx`, `PlannerSample.tsx`, `ui.tsx`, `fixtures.ts`, `16. History of work (for context)`, `useDialogA11y`, `AvailabilityView.tsx`, `WhoCanCover.tsx`, `GridToolbar.tsx`, `WorkbookGrid.tsx`, `analysisExportService.ts`, `ProblemCounts`, `Button`, `harness/main.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `doctorScheduleService.ts`, `usePresence.ts`, `PublishModal.tsx`, `NSC Clinic Roster: complete project guide`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `nurseRosterService.ts`, `ui/index.ts`, `authService.ts`, `package.json`, `AppShell.tsx`, `GridTable.tsx`, `NurseSelfServicePanel.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `ProblemsPanel.tsx`, `PlannerSample.tsx`, `ui.tsx`, `16. History of work (for context)`, `useDialogA11y`, `AvailabilityView.tsx`, `GridToolbar.tsx`, `WorkbookGrid.tsx`, `analysisExportService.ts`, `ProblemCounts`, `Button`, `harness/main.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `doctorScheduleService.ts`, `PublishModal.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `Assignment`, `nurseRosterService.ts`, `ui/index.ts`, `react`, `authService.ts`, `AppShell.tsx`, `GridTable.tsx`, `CollectionSyncer`, `NurseSelfServicePanel.tsx`, `RosterToolbar.tsx`, `SchedulingEngine.ts`, `publicRosterService.ts`, `useDialogA11y`, `AvailabilityView.tsx`, `WorkbookGrid.tsx`, `Design system: NSC Clinic Roster`, `ProblemCounts`, `Button`, `SchedulesView.tsx`, `doctorScheduleService.ts`, `FirestoreRepository`, `RosterGrid`, `dateDefaults.ts`, `usePresence.ts`, `NSC Clinic Roster: complete project guide`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _917 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.11976506639427988 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10420168067226891 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._