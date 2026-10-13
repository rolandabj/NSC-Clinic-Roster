# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 352 files · ~391,825 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2657 nodes · 8571 edges · 134 communities (122 shown, 12 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 374 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ce262fa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- gridSelection.ts
- notify
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- GridTable.tsx
- savingSafety.test.ts
- CollectionSyncer
- authService.ts
- makeNurse
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- middleware/auth.ts
- devDependencies
- navigation.ts
- quick reference
- guide-with-code.mjs
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- CreateScheduleModal.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- fixtures.ts
- 16. History of work (for context)
- collectionSyncer.ts
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
- nurseClinicFloat.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- FirestoreRepository.ts
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
- harness/vite.config.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- nurseRoster.test.ts
- ExportModal.tsx
- links.cjs
- ClinicContextState
- types/index.ts
- analysisExport.test.ts
- GridStatusBar.tsx
- ref_playwright
- UI overhaul: summary and next steps
- doctorWeekChange.test.ts
- TopBar.tsx
- geminiApi.test.ts
- Button.tsx
- harness/main.tsx
- address.ts
- PublishedRosterSheet.tsx
- Finish a change
- Rules
- RulesTab.tsx
- SchedulesView.tsx
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- PublishedRosterView.tsx
- start.sh
- stop.sh
- Rules
- createLiveReconciler
- FirestoreRepository
- LiveCollectionCache
- sharing.test.ts
- IRepository
- RosterGrid
- cellView.test.ts
- dateDefaults.ts
- usePresence.ts
- holidayLeave.ts
- PublishModal.tsx
- RosterSteps.tsx
- teamRoster.test.ts
- NSC Clinic Roster: complete project guide
- ask-before-main.mjs
- usePhoneLayout.ts
- plain-english-reviewer.md
- weekHours.test.ts
- repository/index.ts
- grid-timing.cjs
- rowsInSteps.ts
- repositoryManager
- icsExportService.ts
- phone.cjs
- grid-flow.cjs
- ui/index.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 116 edges
2. `Assignment` - 113 edges
3. `Nurse` - 96 edges
4. `getRepository()` - 95 edges
5. `Schedule` - 92 edges
6. `lucide-react` - 88 edges
7. `DutyWindow` - 88 edges
8. `16. History of work (for context)` - 85 edges
9. `useDialogA11y()` - 78 edges
10. `Doctor` - 78 edges

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

## Communities (134 total, 12 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.11
Nodes (78): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+70 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.23
Nodes (21): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+13 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.12
Nodes (27): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+19 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (19): LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), dayMonth(), formatRosterAsText(), newToken() (+11 more)

### Community 5 - "gridSelection.ts"
Cohesion: 0.13
Nodes (19): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), HOURS_COLUMN, isRosterCell() (+11 more)

### Community 6 - "notify"
Cohesion: 0.12
Nodes (41): confirmDialog(), notify(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps, DutiesTab(), DutiesTabProps (+33 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): 3. Users, roles and access, authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.13
Nodes (27): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+19 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "GridTable.tsx"
Cohesion: 0.11
Nodes (25): CellView, DayTotal, problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL (+17 more)

### Community 14 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (9): forgetCachedRoster(), afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps, { initializeTestEnvironment } (+1 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.16
Nodes (3): 11. Saving, live updates, versions, CollectionSyncer, EntityForCollection

### Community 16 - "authService.ts"
Cohesion: 0.23
Nodes (10): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, computePrivileges(), MASTER_ADMIN_EMAIL, UserPrivileges (+2 more)

### Community 17 - "makeNurse"
Cohesion: 0.11
Nodes (23): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+15 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.15
Nodes (18): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+10 more)

### Community 22 - "App.tsx"
Cohesion: 0.14
Nodes (13): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+5 more)

### Community 23 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (13): express, express-rate-limit, helmet, createApiApp(), startServer(), authMiddleware(), AuthUser, BackendRole (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "navigation.ts"
Cohesion: 0.21
Nodes (12): usePermissions(), APP_NAME, SCREEN_NAMES, NAV_ITEMS, Sidebar(), SidebarProps, canAccessRoute(), canExportReports() (+4 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "guide-with-code.mjs"
Cohesion: 0.12
Nodes (7): command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }, builtServer, __dirname, __filename

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (62): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+54 more)

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
Cohesion: 0.25
Nodes (12): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), PeriodProratingBreakdown, WorkingHoursCalculationResult (+4 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.08
Nodes (19): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+11 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.08
Nodes (23): isPhoneSize(), amy, LEE, lookups, mary, nina, shift, ANNUAL_LEAVE (+15 more)

### Community 38 - "16. History of work (for context)"
Cohesion: 0.21
Nodes (14): 16. History of work (for context), MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), firstDayShown(), RosterDayView() (+6 more)

### Community 39 - "collectionSyncer.ts"
Cohesion: 0.18
Nodes (12): Desired, fingerprint(), Known, planSync(), SyncPlan, changedLists(), sameItems(), rebaseEdit() (+4 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "ref_node_assert"
Cohesion: 0.09
Nodes (11): BACKUPS_KEPT, LATE, nurse, EARLY, input(), LATE, softHoursLimit, week (+3 more)

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
Cohesion: 0.11
Nodes (33): lucide-react, react, uuid, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice() (+25 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "getRepository"
Cohesion: 0.14
Nodes (35): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+27 more)

### Community 49 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 50 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "FirestoreRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoves.test.ts"
Cohesion: 0.06
Nodes (43): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FairnessModal(), fmt(), hoursText(), WhoCanCover() (+35 more)

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
Cohesion: 0.06
Nodes (58): DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), CellChoice, CellEditorDialog() (+50 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (19): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+11 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 73 - "harness/vite.config.ts"
Cohesion: 0.27
Nodes (6): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, clinicApi()

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

### Community 79 - "nurseRoster.test.ts"
Cohesion: 0.19
Nodes (9): calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), NURSE_TOKEN_PATTERN, base, dutyWindows, refs (+1 more)

### Community 80 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (65): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+57 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.10
Nodes (24): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps (+16 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (33): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, BlockWeeks, DoctorSessionSource, EmailLogKind (+25 more)

### Community 84 - "analysisExport.test.ts"
Cohesion: 0.09
Nodes (20): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+12 more)

### Community 85 - "GridStatusBar.tsx"
Cohesion: 0.22
Nodes (9): react-dom, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), GridSelectionState, GridStatusBar(), SelectionView() (+1 more)

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "doctorWeekChange.test.ts"
Cohesion: 0.09
Nodes (16): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, SENIOR (+8 more)

### Community 89 - "TopBar.tsx"
Cohesion: 0.46
Nodes (5): signOutSafely(), AccountMenu(), TopBar(), canEditClinicData(), roleLabel()

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 91 - "Button.tsx"
Cohesion: 0.21
Nodes (11): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, EmptyState() (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 94 - "PublishedRosterSheet.tsx"
Cohesion: 0.43
Nodes (6): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), weekdayOf(), TeamRosterSheet, safeColor()

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
Cohesion: 0.09
Nodes (43): useLatestCallback(), DeleteScheduleModal(), SwapManagerModal(), VersionCompareModal(), VersionViewModal(), FillDialog(), FillDialogProps, FillRange (+35 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.13
Nodes (30): 13. Screens in detail, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView(), WEEKDAY_NAMES (+22 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "PublishedRosterView.tsx"
Cohesion: 0.43
Nodes (6): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), withoutBackups(), loadPublicRoster()

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 110 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.10
Nodes (29): daysBefore(), loadClinicSetup(), saveRosterBackup(), restoreVersion(), VersionRestoreResult, loadHoursHistory(), removeNurseRoster(), revokeNurseLink() (+21 more)

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
Cohesion: 0.31
Nodes (6): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), now

### Community 117 - "holidayLeave.ts"
Cohesion: 0.30
Nodes (11): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+3 more)

### Community 118 - "PublishModal.tsx"
Cohesion: 0.06
Nodes (58): nodemailer, Request, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail() (+50 more)

### Community 119 - "RosterSteps.tsx"
Cohesion: 0.38
Nodes (3): RosterStep, RosterStepAction, base

### Community 120 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 121 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 122 - "ask-before-main.mjs"
Cohesion: 0.50
Nodes (4): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 123 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 126 - "repository/index.ts"
Cohesion: 0.39
Nodes (6): useAppContext(), DatabaseTab(), defaultFirebaseConfig, StorageMode, checkBackup(), getDatabaseStatistics()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 130 - "icsExportService.ts"
Cohesion: 0.27
Nodes (13): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+5 more)

### Community 131 - "phone.cjs"
Cohesion: 0.50
Nodes (3): args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.10
Nodes (39): Badge(), PROBLEM_MARKS, ProblemKind, Tone, TONE_CLASSES, Card(), Crumb, PageHeader() (+31 more)

## Knowledge Gaps
- **913 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+908 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1113 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `rowsInSteps.ts`, `nurseRosterService.ts`, `ui/index.ts`, `notify`, `gridSelection.ts`, `package.json`, `AppShell.tsx`, `GridTable.tsx`, `authService.ts`, `NurseSample.tsx`, `App.tsx`, `navigation.ts`, `PlannerSample.tsx`, `ui.tsx`, `CreateScheduleModal.tsx`, `fixtures.ts`, `16. History of work (for context)`, `getRepository`, `handMoves.test.ts`, `WorkbookGrid.tsx`, `ExportModal.tsx`, `ClinicContextState`, `GridStatusBar.tsx`, `TopBar.tsx`, `Button.tsx`, `harness/main.tsx`, `PublishedRosterSheet.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `DoctorsView.tsx`, `PublishedRosterView.tsx`, `usePresence.ts`, `PublishModal.tsx`, `RosterSteps.tsx`, `NSC Clinic Roster: complete project guide`, `usePhoneLayout.ts`, `repository/index.ts`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `notify`, `gridSelection.ts`, `package.json`, `AppShell.tsx`, `GridTable.tsx`, `authService.ts`, `NurseSample.tsx`, `App.tsx`, `navigation.ts`, `PlannerSample.tsx`, `ui.tsx`, `CreateScheduleModal.tsx`, `16. History of work (for context)`, `getRepository`, `WorkbookGrid.tsx`, `ExportModal.tsx`, `GridStatusBar.tsx`, `TopBar.tsx`, `Button.tsx`, `harness/main.tsx`, `PublishedRosterSheet.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `DoctorsView.tsx`, `PublishedRosterView.tsx`, `PublishModal.tsx`, `RosterSteps.tsx`, `repository/index.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `DashboardView.tsx`, `icsExportService.ts`, `hoursBalance.ts`, `nurseRosterService.ts`, `clinicModel.test.ts`, `savingSafety.test.ts`, `makeNurse`, `yearToDate.ts`, `SchedulingEngine.ts`, `fixtures.ts`, `16. History of work (for context)`, `collectionSyncer.ts`, `ref_node_assert`, `continuousHours.test.ts`, `react`, `nurseClinicFloat.test.ts`, `handMoves.test.ts`, `WorkbookGrid.tsx`, `engineRules.test.ts`, `nurseRoster.test.ts`, `ExportModal.tsx`, `types/index.ts`, `analysisExport.test.ts`, `doctorWeekChange.test.ts`, `SchedulesView.tsx`, `DoctorsView.tsx`, `sharing.test.ts`, `IRepository`, `cellView.test.ts`, `PublishModal.tsx`, `teamRoster.test.ts`, `weekHours.test.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _913 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.11103951890034364 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12315270935960591 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._