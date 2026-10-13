# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 339 files · ~380,038 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2597 nodes · 8306 edges · 126 communities (117 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 351 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e509b744`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- weekHours.ts
- clinicModel.test.ts
- nurseRosterService.ts
- react
- SettingsView.tsx
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- getRepository
- EntityForCollection
- CollectionSyncer
- EmailTab.tsx
- makeNurse
- firebaseIdentityService.ts
- savingSafety.test.ts
- compilerOptions
- yearToDate.ts
- App.tsx
- gridSelection.ts
- devDependencies
- icsExportService.ts
- quick reference
- RosterToolbar.tsx
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- GridTable.tsx
- Hardening Controls
- CreateScheduleModal.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- handMoveChecks.ts
- WorkbookGrid.tsx
- emailService.ts
- Optimization Patterns
- ref_node_assert
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- authService.ts
- PublishedRosterView.tsx
- firestore-rules/package.json
- Button.tsx
- 16. History of work (for context)
- NSC Clinic Roster: complete project guide
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
- HistoryView.tsx
- Source-Driven Development
- address.ts
- published-rules.mjs
- apiApp.ts
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
- GridStatusBar.tsx
- ref_playwright
- UI overhaul: summary and next steps
- emailLogSize.ts
- access.ts
- geminiApi.test.ts
- hoursRules.test.ts
- harness/main.tsx
- weekHours.test.ts
- fakeAuth.ts
- Finish a change
- Rules
- lastResort.ts
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- SchedulesView.tsx
- start.sh
- stop.sh
- Rules
- nurseClinicFloat.test.ts
- lastResort.test.ts
- LiveCollectionCache
- sharing.test.ts
- IRepository
- ScheduleVersion
- cellView.test.ts
- Sidebar.tsx
- usePresence.ts
- holidayLeave.ts
- PublishModal.tsx
- doctorWeekChange.test.ts
- WhoCanCover.tsx
- plain-english-reviewer.md
- middleware/auth.ts
- newRosterDates.ts
- grid-timing.cjs
- react-dom
- ui/index.ts

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
10. `16. History of work (for context)` - 72 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (126 total, 9 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (69): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+61 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.20
Nodes (21): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+13 more)

### Community 2 - "weekHours.ts"
Cohesion: 0.52
Nodes (6): addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WeekHours, weeksOverLimit()

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (28): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+20 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (28): lucide-react, react, uuid, ConfirmOptions, DialogState, dismissNotice(), listeners, Notice (+20 more)

### Community 6 - "SettingsView.tsx"
Cohesion: 0.12
Nodes (40): useAppContext(), confirmDialog(), AccessManagementPanel(), ClinicTab(), DatabaseTab(), DatabaseTabProps, DutiesTab(), DutiesTabProps (+32 more)

### Community 7 - "authService"
Cohesion: 0.15
Nodes (3): authService, computePrivileges(), getAppAuth()

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.17
Nodes (22): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.14
Nodes (36): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+28 more)

### Community 14 - "EntityForCollection"
Cohesion: 0.36
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 15 - "CollectionSyncer"
Cohesion: 0.11
Nodes (8): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, rebaseEdit(), CollectionName

### Community 16 - "EmailTab.tsx"
Cohesion: 0.14
Nodes (19): nodemailer, ClinicTabProps, EmailTab(), EmailTabProps, SaveStatus, authorizedFetch(), checkEmailReadiness(), EmailReadiness (+11 more)

### Community 17 - "makeNurse"
Cohesion: 0.10
Nodes (25): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+17 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "savingSafety.test.ts"
Cohesion: 0.11
Nodes (10): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps (+2 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.12
Nodes (24): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+16 more)

### Community 22 - "App.tsx"
Cohesion: 0.12
Nodes (17): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+9 more)

### Community 23 - "gridSelection.ts"
Cohesion: 0.15
Nodes (17): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), keyOf(), moveSelection() (+9 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "icsExportService.ts"
Cohesion: 0.12
Nodes (23): RFC-5545, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText() (+15 more)

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
Nodes (48): 7. Rules, FillDialogProps, RosterToolbarProps, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate() (+40 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.06
Nodes (82): Cell, countOf(), dayLabel(), dayProblems(), DAYS, ddmmyyyy(), DOCTORS, LEAVE (+74 more)

### Community 31 - "GridTable.tsx"
Cohesion: 0.11
Nodes (17): CellView, DayTotal, GridCell, GridCellActions, GridCellProps, fmtHours(), GridRow, GridRowActions (+9 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "CreateScheduleModal.tsx"
Cohesion: 0.26
Nodes (11): CreateScheduleModalProps, WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+3 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (15): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+7 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "handMoveChecks.ts"
Cohesion: 0.40
Nodes (10): Other engine files, listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields(), suggestMoves() (+2 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.08
Nodes (45): CellChoice, CellEditorDialog(), withDr(), cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView() (+37 more)

### Community 39 - "emailService.ts"
Cohesion: 0.17
Nodes (14): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+6 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "ref_node_assert"
Cohesion: 0.10
Nodes (11): ctx(), EARLY, LATE, LATE, nurse, EARLY, input(), LATE (+3 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "authService.ts"
Cohesion: 0.13
Nodes (10): MASTER_ADMIN_EMAIL, UserPrivileges, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError (+2 more)

### Community 46 - "PublishedRosterView.tsx"
Cohesion: 0.18
Nodes (11): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, withoutBackups(), buildTeamRosterSheet(), loadPublicRoster(), nurses, published (+3 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "Button.tsx"
Cohesion: 0.21
Nodes (11): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, EmptyState() (+3 more)

### Community 49 - "16. History of work (for context)"
Cohesion: 0.18
Nodes (14): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler(), addDays() (+6 more)

### Community 50 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.09
Nodes (20): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points (+12 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "FirestoreRepository.ts"
Cohesion: 0.20
Nodes (14): FirebaseClientConfig, CacheEntry, ListFilter, UNCACHED_COLLECTIONS, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), holdsDates() (+6 more)

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
Nodes (24): askedCarry(), closePeriod(), earlierPeriodTotals(), hoursHistoryOverlaps(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+16 more)

### Community 69 - "HistoryView.tsx"
Cohesion: 0.06
Nodes (47): Props, State, usePermissions(), DeleteVersionModal(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS (+39 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): repoRoot, swaps, express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react (+4 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "editSaving.test.ts"
Cohesion: 0.13
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 79 - "handMoves.test.ts"
Cohesion: 0.10
Nodes (16): ProblemsPanelProps, moveShift(), swapShifts(), ValidationFinding, AMY, BEA, CARA, DAN (+8 more)

### Community 80 - "analysisExportService.ts"
Cohesion: 0.06
Nodes (70): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps (+62 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.15
Nodes (19): AppContext, AppContextValue, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, NursesViewProps, ReportsViewProps, SchedulesViewProps (+11 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (34): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, BlockWeeks, DoctorSessionSource (+26 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.09
Nodes (24): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+16 more)

### Community 85 - "GridStatusBar.tsx"
Cohesion: 0.24
Nodes (8): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), GridSelectionState, GridStatusBar(), SelectionView(), render()

### Community 86 - "ref_playwright"
Cohesion: 0.17
Nodes (7): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "emailLogSize.ts"
Cohesion: 0.33
Nodes (6): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, EmailRecipientLog

### Community 89 - "access.ts"
Cohesion: 0.26
Nodes (12): 3. Users, roles and access, 4. Navigation and app shell, AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canApproveRequests(), canEditClinicData() (+4 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 94 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "lastResort.ts"
Cohesion: 0.50
Nodes (3): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.14
Nodes (27): DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView(), WEEKDAY_NAMES, DoctorsScheduleSheet() (+19 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "SchedulesView.tsx"
Cohesion: 0.08
Nodes (45): useDialogA11y(), useLatestCallback(), CreateScheduleModal(), DeleteScheduleModal(), DeleteScheduleModalProps, FairnessModal(), ShareModal(), NONE (+37 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 110 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.09
Nodes (25): saveRosterBackup(), restoreVersion(), removeNurseRoster(), revokeNurseLink(), removePublicRoster(), repositoryManager, IRepository, afterShiftsSaved() (+17 more)

### Community 113 - "ScheduleVersion"
Cohesion: 0.15
Nodes (12): DeleteVersionModalProps, ShareModalProps, BACKUPS_KEPT, VersionRestoreResult, fingerprint(), syncScheduleAssignments(), SubscribeCallback, Unsubscribe (+4 more)

### Community 114 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 115 - "Sidebar.tsx"
Cohesion: 0.36
Nodes (7): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 116 - "usePresence.ts"
Cohesion: 0.21
Nodes (9): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, frame, november (+1 more)

### Community 117 - "holidayLeave.ts"
Cohesion: 0.22
Nodes (11): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+3 more)

### Community 118 - "PublishModal.tsx"
Cohesion: 0.14
Nodes (27): Things that went wrong before, 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), PublishViewProps (+19 more)

### Community 122 - "doctorWeekChange.test.ts"
Cohesion: 0.17
Nodes (10): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+2 more)

### Community 123 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (10): authMiddleware(), AuthUser, BackendRole, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken() (+2 more)

### Community 126 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "react-dom"
Cohesion: 0.33
Nodes (4): react-dom, ConfirmBox(), DialogHost(), wholeDates()

### Community 133 - "ui/index.ts"
Cohesion: 0.11
Nodes (38): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Card(), Crumb (+30 more)

## Knowledge Gaps
- **896 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+891 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1092 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `react-dom`, `DashboardView.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `SettingsView.tsx`, `package.json`, `AppShell.tsx`, `getRepository`, `EmailTab.tsx`, `App.tsx`, `gridSelection.ts`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `GridTable.tsx`, `CreateScheduleModal.tsx`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `Button.tsx`, `NSC Clinic Roster: complete project guide`, `RulesTab.tsx`, `HistoryView.tsx`, `analysisExportService.ts`, `ClinicContextState`, `fixtures.ts`, `GridStatusBar.tsx`, `access.ts`, `harness/main.tsx`, `DoctorsView.tsx`, `SchedulesView.tsx`, `Sidebar.tsx`, `usePresence.ts`, `PublishModal.tsx`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `SettingsView.tsx`, `package.json`, `AppShell.tsx`, `getRepository`, `EmailTab.tsx`, `App.tsx`, `gridSelection.ts`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `GridTable.tsx`, `CreateScheduleModal.tsx`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `Button.tsx`, `RulesTab.tsx`, `HistoryView.tsx`, `analysisExportService.ts`, `GridStatusBar.tsx`, `access.ts`, `harness/main.tsx`, `DoctorsView.tsx`, `SchedulesView.tsx`, `Sidebar.tsx`, `PublishModal.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `DashboardView.tsx`, `clinicModel.test.ts`, `nurseRosterService.ts`, `react`, `makeNurse`, `savingSafety.test.ts`, `yearToDate.ts`, `icsExportService.ts`, `SchedulingEngine.ts`, `handMoveChecks.ts`, `WorkbookGrid.tsx`, `ref_node_assert`, `continuousHours.test.ts`, `PublishedRosterView.tsx`, `hoursBalance.ts`, `HistoryView.tsx`, `editSaving.test.ts`, `engineRules.test.ts`, `handMoves.test.ts`, `analysisExportService.ts`, `types/index.ts`, `fixtures.ts`, `hoursRules.test.ts`, `weekHours.test.ts`, `lastResort.ts`, `DoctorsView.tsx`, `SchedulesView.tsx`, `nurseClinicFloat.test.ts`, `sharing.test.ts`, `ScheduleVersion`, `cellView.test.ts`, `PublishModal.tsx`, `doctorWeekChange.test.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _896 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.14345991561181434 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `nurseRosterService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13763440860215054 - nodes in this community are weakly interconnected._