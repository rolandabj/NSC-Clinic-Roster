# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 336 files · ~377,259 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2572 nodes · 8270 edges · 131 communities (121 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 348 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `850a6572`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- dashboardSummary.ts
- ScheduleValidator.ts
- clinicModel.test.ts
- ExportModal.tsx
- react
- notify
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- getRepository
- FirestoreRepository
- CollectionSyncer
- explainCell.ts
- makeNurse
- firebaseIdentityService.ts
- savingSafety.test.ts
- compilerOptions
- yearToDate.ts
- App.tsx
- gridSelection.ts
- devDependencies
- DashboardView.tsx
- hoursAccounting.ts
- FillDialog.tsx
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- GridTable.tsx
- Hardening Controls
- GridSelection
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- handMoveChecks.ts
- WorkbookGrid.tsx
- emailService.ts
- Optimization Patterns
- analysisExport.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- quotaTracker
- HistoryView.tsx
- firestore-rules/package.json
- dialogs.tsx
- hoursHistoryService.ts
- ClinicRoster
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- seedRunner.ts
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
- ref_node_assert
- Planning and Task Breakdown
- Find Skills
- hoursBalance.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- preferenceFocus.test.ts
- published-rules.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- editSaving.test.ts
- engineRules.test.ts
- handMoves.test.ts
- analysisExportService.ts
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- ProblemCounts
- ref_playwright
- UI overhaul: summary and next steps
- authService.ts
- access.ts
- geminiApi.test.ts
- RosterSteps.tsx
- harness/main.tsx
- Phase 3: roster grid speed and structure
- ProblemsPanel.tsx
- Finish a change
- Rules
- GridToolbar.tsx
- dateDefaults.ts
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- SchedulesView.tsx
- start.sh
- stop.sh
- Rules
- rosterSaving.test.ts
- SENIOR
- LiveCollectionCache
- sharing.test.ts
- IRepository
- versionRestore.test.ts
- cellView.test.ts
- Sidebar.tsx
- usePresence.ts
- holidayLeave.ts
- PublishModal.tsx
- dateUtils.ts
- createLiveReconciler
- cellViewOf
- doctorWeekChange.test.ts
- WhoCanCover.tsx
- plain-english-reviewer.md
- middleware/auth.ts
- newRosterDates.ts
- grid-timing.cjs
- wholeDates
- shiftMoves.ts
- 16. History of work (for context)

## God Nodes (most connected - your core abstractions)
1. `react` - 113 edges
2. `Assignment` - 110 edges
3. `getRepository()` - 95 edges
4. `Nurse` - 94 edges
5. `Schedule` - 92 edges
6. `DutyWindow` - 88 edges
7. `lucide-react` - 86 edges
8. `useDialogA11y()` - 78 edges
9. `Doctor` - 77 edges
10. `LeaveEntry` - 71 edges

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

## Communities (131 total, 10 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (65): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+57 more)

### Community 2 - "ScheduleValidator.ts"
Cohesion: 0.10
Nodes (30): 6. Clinic model (the business rules in plain English), RuleDef, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+22 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "ExportModal.tsx"
Cohesion: 0.12
Nodes (14): ExportTab, WEEKDAY_NAMES, GRID, HEAD_FILL, HOLIDAY_HEAD, INK, MISSING_FILL, MISSING_TEXT (+6 more)

### Community 5 - "react"
Cohesion: 0.13
Nodes (22): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModalProps, DeleteVersionModal() (+14 more)

### Community 6 - "notify"
Cohesion: 0.12
Nodes (44): useAppContext(), confirmDialog(), notify(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTab(), DatabaseTabProps (+36 more)

### Community 7 - "authService"
Cohesion: 0.08
Nodes (19): EmailTab(), authorizedFetch(), authService, computePrivileges(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), FirebaseConfig (+11 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.13
Nodes (26): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+18 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.11
Nodes (42): NoticeTone, ShareModal(), TabType, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE (+34 more)

### Community 14 - "FirestoreRepository"
Cohesion: 0.19
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 15 - "CollectionSyncer"
Cohesion: 0.11
Nodes (9): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, rebaseEdit(), EntityForCollection (+1 more)

### Community 16 - "explainCell.ts"
Cohesion: 0.20
Nodes (18): 7. Rules, BlockedShift, explainDay(), explainNurseDay(), ExplainNurseDayInput, pendingLeaveOn(), plainReason(), PossibleShift (+10 more)

### Community 17 - "makeNurse"
Cohesion: 0.12
Nodes (21): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account(), doctorOfAmy() (+13 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (7): queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps, { initializeTestEnvironment }, requireRules

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.15
Nodes (20): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+12 more)

### Community 22 - "App.tsx"
Cohesion: 0.12
Nodes (15): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+7 more)

### Community 23 - "gridSelection.ts"
Cohesion: 0.18
Nodes (15): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), keyOf(), moveSelection() (+7 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "DashboardView.tsx"
Cohesion: 0.06
Nodes (68): RFC-5545, 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), Card(), DashboardView(), loadPlannerData(), loadViewerData() (+60 more)

### Community 26 - "hoursAccounting.ts"
Cohesion: 0.16
Nodes (25): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField (+17 more)

### Community 27 - "FillDialog.tsx"
Cohesion: 0.21
Nodes (11): MenuButton(), MenuButtonProps, MenuItem, FillDialogProps, FillRange, RosterMenuItem, RosterToolbarProps, GenerationPreflightSummary (+3 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (32): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes() (+24 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.06
Nodes (82): Cell, countOf(), dayLabel(), dayProblems(), DAYS, ddmmyyyy(), DOCTORS, LEAVE (+74 more)

### Community 31 - "GridTable.tsx"
Cohesion: 0.20
Nodes (16): CellView, DayTotal, GridCell, GridCellActions, GridCellProps, fmtHours(), GridRow, GridRowActions (+8 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "GridSelection"
Cohesion: 0.15
Nodes (4): GridSelection, GridSelectionState, GridStatusBar(), SelectionView()

### Community 34 - "MemoryRepo"
Cohesion: 0.08
Nodes (19): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+11 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "handMoveChecks.ts"
Cohesion: 0.21
Nodes (16): Other engine files, FairnessModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields() (+8 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.15
Nodes (20): CellContextMenu(), cellLookupsOf(), reuseCellViews(), sameView(), dayTotalsOf(), rowViewsOf(), findCell(), QuickCellPopup() (+12 more)

### Community 39 - "emailService.ts"
Cohesion: 0.15
Nodes (16): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+8 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+11 more)

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

### Community 46 - "HistoryView.tsx"
Cohesion: 0.13
Nodes (23): CHANGE_LABELS, VersionCompareModal(), SOURCE_LABELS, VersionViewModal(), WEEKDAY_NAMES, HistoryView(), WEEKDAY_NAMES, isFloatShift() (+15 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "dialogs.tsx"
Cohesion: 0.24
Nodes (10): ConfirmOptions, DialogState, dismissNotice(), listeners, Notice, PendingConfirm, setState(), settleConfirm() (+2 more)

### Community 49 - "hoursHistoryService.ts"
Cohesion: 0.19
Nodes (9): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), countedEarlierRosters(), loadHoursHistory(), sameHoursHistory(), recordHolidayDayOff(), afterNextFrame(), CheckScheduler (+1 more)

### Community 50 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "seedRunner.ts"
Cohesion: 0.12
Nodes (26): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+18 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.18
Nodes (15): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup, RulesTab() (+7 more)

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

### Community 65 - "ref_node_assert"
Cohesion: 0.13
Nodes (9): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run(), configured (+1 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (34): leaveCountingOnHoliday(), askedCarry(), closePeriod(), earlierPeriodTotals(), hoursHistoryOverlaps(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+26 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

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

### Community 77 - "editSaving.test.ts"
Cohesion: 0.12
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 79 - "handMoves.test.ts"
Cohesion: 0.12
Nodes (13): AGREED_EXCEPTION_NOTE, AMY, BEA, CARA, DAN, DOCTORS, DUTIES, EARLY (+5 more)

### Community 80 - "analysisExportService.ts"
Cohesion: 0.11
Nodes (35): jspdf, jspdf-autotable, xlsx, ExportModal(), fmtHours(), doctorSessionsOn(), resolveClinicSetup(), isLateDuty() (+27 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.11
Nodes (23): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+15 more)

### Community 83 - "types/index.ts"
Cohesion: 0.08
Nodes (31): ShareModalProps, PublishedRosterViewProps, CellChoice, withoutBackups(), BuildNurseRosterInput, NURSE_ROSTER_LOOKBACK_DAYS, RegenerateNurseLinkResult, ShiftRefs (+23 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.11
Nodes (16): ANNUAL_LEAVE, DAY_DUTY, UNPAID_LEAVE, LONG, NOV, OCT, D, E (+8 more)

### Community 85 - "ProblemCounts"
Cohesion: 0.39
Nodes (5): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), render()

### Community 86 - "ref_playwright"
Cohesion: 0.22
Nodes (5): { chromium }, args, { chromium }, args, { chromium }

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "authService.ts"
Cohesion: 0.19
Nodes (14): LoginPageProps, signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL (+6 more)

### Community 89 - "access.ts"
Cohesion: 0.15
Nodes (19): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 3. Users, roles and access, 4. Navigation and app shell, NSC Clinic Roster: complete project guide (+11 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 91 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "Phase 3: roster grid speed and structure"
Cohesion: 0.33
Nodes (6): CellEditorDialog(), withDr(), GridTable(), cellKeyOf(), useGridSelection(), Phase 3: roster grid speed and structure

### Community 94 - "ProblemsPanel.tsx"
Cohesion: 0.24
Nodes (8): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "GridToolbar.tsx"
Cohesion: 0.33
Nodes (5): GRID_KEY_ID, GridLegend(), GridToolbar(), GridToolbarProps, GridZoom

### Community 98 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.15
Nodes (27): 13. Screens in detail, CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView() (+19 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "SchedulesView.tsx"
Cohesion: 0.18
Nodes (21): useLatestCallback(), DeleteScheduleModal(), SwapManagerModal(), FillDialog(), RosterPicker(), RosterPickerProps, RosterToolbar(), useRosterEdits() (+13 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "rosterSaving.test.ts"
Cohesion: 0.11
Nodes (12): FLOAT_ROLE_ID, SchedulingEngine, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN (+4 more)

### Community 109 - "SENIOR"
Cohesion: 0.09
Nodes (13): ScheduleValidator, SENIOR, DR_PEDS, ENT, FULL, PEDS, RULES, LATE (+5 more)

### Community 110 - "LiveCollectionCache"
Cohesion: 0.20
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.13
Nodes (21): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster() (+13 more)

### Community 113 - "versionRestore.test.ts"
Cohesion: 0.29
Nodes (4): BACKUPS_KEPT, october, octoberVersion, september

### Community 114 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 115 - "Sidebar.tsx"
Cohesion: 0.36
Nodes (7): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 116 - "usePresence.ts"
Cohesion: 0.48
Nodes (5): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence()

### Community 117 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 118 - "PublishModal.tsx"
Cohesion: 0.15
Nodes (23): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), EMAIL_LOG_HTML_BUDGET, encoder (+15 more)

### Community 119 - "dateUtils.ts"
Cohesion: 0.48
Nodes (4): formatDateTime(), formatDayDate(), parseDayMonthYear(), WEEKDAYS

### Community 120 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 121 - "cellViewOf"
Cohesion: 0.33
Nodes (6): cellViewOf(), fmtHours(), specialtyMatches(), withDr(), describeRequest(), view()

### Community 122 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 123 - "WhoCanCover.tsx"
Cohesion: 0.53
Nodes (5): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, NurseDayExplanation

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (12): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+4 more)

### Community 126 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "wholeDates"
Cohesion: 0.67
Nodes (3): ConfirmBox(), DialogHost(), wholeDates()

### Community 133 - "16. History of work (for context)"
Cohesion: 0.08
Nodes (53): 16. History of work (for context), LocalModeBanner(), LocalModeBannerProps, Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone (+45 more)

## Knowledge Gaps
- **880 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+875 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1074 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `wholeDates`, `ExportModal.tsx`, `16. History of work (for context)`, `notify`, `authService`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `gridSelection.ts`, `DashboardView.tsx`, `hoursAccounting.ts`, `FillDialog.tsx`, `PlannerSample.tsx`, `GridTable.tsx`, `GridSelection`, `WorkbookGrid.tsx`, `HistoryView.tsx`, `dialogs.tsx`, `RulesTab.tsx`, `ClinicContextState`, `types/index.ts`, `fixtures.ts`, `ProblemCounts`, `authService.ts`, `access.ts`, `RosterSteps.tsx`, `harness/main.tsx`, `Phase 3: roster grid speed and structure`, `ProblemsPanel.tsx`, `GridToolbar.tsx`, `DoctorsView.tsx`, `SchedulesView.tsx`, `Sidebar.tsx`, `usePresence.ts`, `PublishModal.tsx`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `ExportModal.tsx`, `16. History of work (for context)`, `notify`, `authService`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `gridSelection.ts`, `DashboardView.tsx`, `hoursAccounting.ts`, `FillDialog.tsx`, `PlannerSample.tsx`, `GridTable.tsx`, `WorkbookGrid.tsx`, `HistoryView.tsx`, `dialogs.tsx`, `RulesTab.tsx`, `types/index.ts`, `ProblemCounts`, `authService.ts`, `access.ts`, `RosterSteps.tsx`, `harness/main.tsx`, `ProblemsPanel.tsx`, `GridToolbar.tsx`, `DoctorsView.tsx`, `SchedulesView.tsx`, `Sidebar.tsx`, `PublishModal.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `react` to `wholeDates`, `Assignment`, `ExportModal.tsx`, `16. History of work (for context)`, `notify`, `AppShell.tsx`, `getRepository`, `hoursAccounting.ts`, `FillDialog.tsx`, `handMoveChecks.ts`, `HistoryView.tsx`, `dialogs.tsx`, `Design system: NSC Clinic Roster`, `analysisExportService.ts`, `authService.ts`, `access.ts`, `Phase 3: roster grid speed and structure`, `DoctorsView.tsx`, `SchedulesView.tsx`, `PublishModal.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _880 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.13821138211382114 - nodes in this community are weakly interconnected._
- **Should `ScheduleValidator.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._