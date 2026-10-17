# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 387 files · ~420,736 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2822 nodes · 9247 edges · 145 communities (127 shown, 18 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 404 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d9839fa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- firestoreRest.ts
- createApiApp
- fixtures.ts
- clinicModel.test.ts
- authService
- AvailabilityView.tsx
- notify
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- RosterToolbar.tsx
- nurseClinicFloat.test.ts
- FirestoreRepository.ts
- access.ts
- seedRunner.ts
- firebaseIdentityService.ts
- index.tsx
- compilerOptions
- FairnessModal.tsx
- App.tsx
- emailPublishing.test.ts
- devDependencies
- gridSelection.ts
- quick reference
- decisionEmail.test.ts
- hoursAccounting.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- ClinicContextState
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- MyRosterView.tsx
- GridTable.tsx
- ddmmyyyy
- Optimization Patterns
- Assignment
- analysisExport.test.ts
- rules.test.mjs
- Frontend UI Engineering
- EntityForCollection
- RulesTab.tsx
- firestore-rules/package.json
- 16. History of work (for context)
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- CollectionSyncer
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
- PublishModal.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- DoctorsView.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- NSC Clinic Roster: complete project guide
- doctorWeekChange.test.ts
- NurseSelfServicePanel.tsx
- getRepository
- links.cjs
- nurseRoster.test.ts
- 17. Known quirks and ideas for later
- makeNurse
- WorkbookGridView
- cellView.ts
- UI overhaul: summary and next steps
- geminiApi.test.ts
- types/index.ts
- DashboardView.tsx
- newRosterDates.ts
- harness/main.tsx
- nurses-list.cjs
- apiApp.ts
- Finish a change
- Rules
- handMoves.test.ts
- weekHours.test.ts
- context7
- SettingsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- fakeAuth.ts
- start.sh
- stop.sh
- Rules
- dialogs.tsx
- LiveCollectionCache
- GridSelection
- EmailTab.tsx
- authService.ts
- CreateScheduleModal.tsx
- SchedulingEngine.ts
- holidayLeave.ts
- quotaTracker
- engineRules.test.ts
- editSaving.test.ts
- ClinicRoster
- lastResort.test.ts
- checkScheduler.test.ts
- usePresence.ts
- scripts
- createLiveReconciler
- IRepository
- ref_node_assert
- grid-timing.cjs
- preferenceOrder.ts
- WhoCanCover.tsx
- LeaveTab.tsx
- my-requests.cjs
- rowsInSteps.ts
- react
- SchedulesView.tsx
- NursesView.tsx
- nurse-editor.cjs
- allowance.cjs
- public-pages.cjs
- roster-dialogs.cjs
- toolbar.cjs
- ref_playwright
- nurse-page.cjs
- requests.cjs
- leave-grid.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 118 edges
2. `Assignment` - 113 edges
3. `16. History of work (for context)` - 103 edges
4. `Nurse` - 100 edges
5. `getRepository()` - 97 edges
6. `DutyWindow` - 93 edges
7. `Schedule` - 92 edges
8. `lucide-react` - 88 edges
9. `Doctor` - 79 edges
10. `LeaveEntry` - 77 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
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

## Communities (145 total, 18 thin omitted)

### Community 0 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 1 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 2 - "fixtures.ts"
Cohesion: 0.11
Nodes (14): ANNUAL_LEAVE, UNPAID_LEAVE, LONG, NOV, OCT, D, E, L (+6 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.11
Nodes (8): authService, computePrivileges(), defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (26): firstDayShown(), RosterDayView(), ProblemBadge(), Switch(), AvailabilityView(), WEEKDAY_ABBR, dayTotalsOf(), dayTotalWords() (+18 more)

### Community 6 - "notify"
Cohesion: 0.17
Nodes (22): dismissNotice(), notify(), setState(), DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTabProps (+14 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.09
Nodes (26): CellContextMenu(), CellChoice, CellEditorDialog(), withDr(), GRID_KEY_ID, GridLegend(), GridToolbar(), GridToolbarProps (+18 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.30
Nodes (8): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar()

### Community 14 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 15 - "FirestoreRepository.ts"
Cohesion: 0.20
Nodes (13): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+5 more)

### Community 16 - "access.ts"
Cohesion: 0.19
Nodes (18): 3. Users, roles and access, 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar() (+10 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.18
Nodes (18): useAppContext(), DatabaseTab(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "FairnessModal.tsx"
Cohesion: 0.09
Nodes (41): Other engine files, uuid, FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap, NONE, listProblem() (+33 more)

### Community 22 - "App.tsx"
Cohesion: 0.16
Nodes (11): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 23 - "emailPublishing.test.ts"
Cohesion: 0.18
Nodes (11): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS (+3 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "gridSelection.ts"
Cohesion: 0.13
Nodes (19): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), HOURS_COLUMN, isRosterCell() (+11 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.11
Nodes (21): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+13 more)

### Community 28 - "hoursAccounting.ts"
Cohesion: 0.06
Nodes (67): jspdf, jspdf-autotable, xlsx, usePermissions(), ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES (+59 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.13
Nodes (24): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+16 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "ClinicContextState"
Cohesion: 0.11
Nodes (24): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+16 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.06
Nodes (33): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+25 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "MyRosterView.tsx"
Cohesion: 0.24
Nodes (14): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterView(), MyRosterViewProps, downloadIcsFile(), myShiftDays(), dayMonth() (+6 more)

### Community 38 - "GridTable.tsx"
Cohesion: 0.15
Nodes (25): CellView, DayTotal, FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL, useCellFlags() (+17 more)

### Community 39 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.13
Nodes (68): RFC-5545, 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, TIME_PRESETS, ExportModalProps, FairnessModalProps, PublishModalProps (+60 more)

### Community 42 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+11 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "EntityForCollection"
Cohesion: 0.26
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 46 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "16. History of work (for context)"
Cohesion: 0.13
Nodes (32): 16. History of work (for context), Column, DataTable(), Textarea(), EmptyState(), ErrorState(), LoadingState(), TabPanel() (+24 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.13
Nodes (26): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+18 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "CollectionSyncer"
Cohesion: 0.08
Nodes (14): 11. Saving, live updates, versions, clearYearToDateCache(), forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, SyncPlan (+6 more)

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

### Community 68 - "PublishModal.tsx"
Cohesion: 0.08
Nodes (50): Request, EmailHtmlPreview(), dialogsChanged(), openListeners, openStack, useDialogA11y(), DeleteVersionModal(), DeleteVersionModalProps (+42 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "DoctorsView.tsx"
Cohesion: 0.12
Nodes (31): 13. Screens in detail, CreateScheduleModal(), WeekChangePreview, EditDoctorShiftModal(), DoctorsScheduleSheet(), WEEKDAY_ABBR, byDayAndTime(), checkDoctorForm() (+23 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.25
Nodes (8): 0. Quick start for a new chat, 14. Server, security and config, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, NSC Clinic Roster: complete project guide

### Community 78 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 79 - "NurseSelfServicePanel.tsx"
Cohesion: 0.12
Nodes (27): NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors, leaveStatus() (+19 more)

### Community 80 - "getRepository"
Cohesion: 0.17
Nodes (19): Report, What to check, What to look at, confirmDialog(), signOutSafely(), ShareModal(), TabType, TemplateModal() (+11 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "nurseRoster.test.ts"
Cohesion: 0.14
Nodes (15): buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), nurseShiftUid(), shortHash() (+7 more)

### Community 83 - "17. Known quirks and ideas for later"
Cohesion: 0.50
Nodes (3): 17. Known quirks and ideas for later, WalkthroughModal(), WalkthroughModalProps

### Community 84 - "makeNurse"
Cohesion: 0.09
Nodes (27): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup() (+19 more)

### Community 85 - "WorkbookGridView"
Cohesion: 0.13
Nodes (20): DayProblem, DayRow, dayViewOf(), isPhoneSize(), KIND, ORDER, cellSummary(), isDayProblem() (+12 more)

### Community 86 - "cellView.ts"
Cohesion: 0.13
Nodes (21): CellDay, cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), SOURCE_SPOKEN, SOURCE_WORDS (+13 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 89 - "types/index.ts"
Cohesion: 0.08
Nodes (26): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), MyDay, ApprovalStatus, AuditAction, DoctorSessionSource (+18 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (24): 12. Publishing and nurse links, Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+16 more)

### Community 91 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 94 - "apiApp.ts"
Cohesion: 0.15
Nodes (13): express, express-rate-limit, authMiddleware(), AuthUser, BackendRole, Express, requireOwner, requirePlanner (+5 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

### Community 98 - "weekHours.test.ts"
Cohesion: 0.10
Nodes (10): ScheduleValidator, SENIOR, LATE, schedule, wishFindings(), EARLY, LATE, shifts (+2 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "SettingsView.tsx"
Cohesion: 0.24
Nodes (13): ClinicTab(), ClinicTabProps, EmailTabProps, HolidaysTab(), SaveStatus, SettingsDialogProps, SettingsTab, WEEKDAY_NAMES (+5 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "fakeAuth.ts"
Cohesion: 0.17
Nodes (8): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, planner(), nurses()

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "dialogs.tsx"
Cohesion: 0.19
Nodes (14): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, NoticeTone, PendingConfirm (+6 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 110 - "GridSelection"
Cohesion: 0.15
Nodes (4): GridSelection, GridSelectionState, GridStatusBar(), SelectionView()

### Community 111 - "EmailTab.tsx"
Cohesion: 0.26
Nodes (11): EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus (+3 more)

### Community 112 - "authService.ts"
Cohesion: 0.26
Nodes (10): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL, UserPrivileges, UserProfile (+2 more)

### Community 113 - "CreateScheduleModal.tsx"
Cohesion: 0.31
Nodes (10): CreateScheduleModalProps, WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+2 more)

### Community 114 - "SchedulingEngine.ts"
Cohesion: 0.06
Nodes (80): 7. Rules, RosterToolbarProps, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+72 more)

### Community 115 - "holidayLeave.ts"
Cohesion: 0.22
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+4 more)

### Community 116 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 117 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 118 - "editSaving.test.ts"
Cohesion: 0.13
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 121 - "checkScheduler.test.ts"
Cohesion: 0.24
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), afterNextFrame(), CheckScheduler, createCheckScheduler(), history()

### Community 122 - "usePresence.ts"
Cohesion: 0.29
Nodes (7): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 123 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 124 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 125 - "IRepository"
Cohesion: 0.09
Nodes (23): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments() (+15 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.09
Nodes (14): diff(), LATE, nurse, AL, DAY_OFF, SICK, leaves, pins (+6 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "preferenceOrder.ts"
Cohesion: 0.33
Nodes (6): 6. Clinic model (the business rules in plain English), applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, missingPatternSessions(), PreferenceFocus

### Community 129 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 130 - "LeaveTab.tsx"
Cohesion: 0.40
Nodes (5): BUILT_IN_LEAVE_CODES, isBuiltInCode(), LeaveTab(), LeaveTabProps, LEAVE_COLOR_PALETTE

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 133 - "react"
Cohesion: 0.08
Nodes (39): lucide-react, react, PublicMessage(), PublicPageFrame(), AccountMenu(), TopBar(), ROSTER_SHEET_PANEL_ID, RosterSheet (+31 more)

### Community 134 - "SchedulesView.tsx"
Cohesion: 0.10
Nodes (33): useLatestCallback(), SwapManagerModal(), PHONE_QUERY, RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), isPhone() (+25 more)

### Community 135 - "NursesView.tsx"
Cohesion: 0.10
Nodes (42): LocalModeBanner(), LocalModeBannerProps, BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, GROUPS (+34 more)

### Community 141 - "ref_playwright"
Cohesion: 0.11
Nodes (11): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+3 more)

## Knowledge Gaps
- **963 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+958 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1178 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `WhoCanCover.tsx`, `LeaveTab.tsx`, `rowsInSteps.ts`, `AvailabilityView.tsx`, `SchedulesView.tsx`, `NursesView.tsx`, `notify`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `access.ts`, `seedRunner.ts`, `FairnessModal.tsx`, `App.tsx`, `gridSelection.ts`, `hoursAccounting.ts`, `PlannerSample.tsx`, `ui.tsx`, `ClinicContextState`, `MyRosterView.tsx`, `GridTable.tsx`, `Assignment`, `RulesTab.tsx`, `16. History of work (for context)`, `AppShell.tsx`, `PublishModal.tsx`, `data.ts`, `DoctorsView.tsx`, `NurseSelfServicePanel.tsx`, `getRepository`, `17. Known quirks and ideas for later`, `makeNurse`, `DashboardView.tsx`, `harness/main.tsx`, `SettingsView.tsx`, `dialogs.tsx`, `GridSelection`, `EmailTab.tsx`, `authService.ts`, `CreateScheduleModal.tsx`, `usePresence.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `LeaveTab.tsx`, `AvailabilityView.tsx`, `SchedulesView.tsx`, `NursesView.tsx`, `notify`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `access.ts`, `seedRunner.ts`, `FairnessModal.tsx`, `App.tsx`, `gridSelection.ts`, `hoursAccounting.ts`, `PlannerSample.tsx`, `ui.tsx`, `MyRosterView.tsx`, `GridTable.tsx`, `Assignment`, `RulesTab.tsx`, `16. History of work (for context)`, `AppShell.tsx`, `PublishModal.tsx`, `data.ts`, `DoctorsView.tsx`, `NurseSelfServicePanel.tsx`, `getRepository`, `DashboardView.tsx`, `harness/main.tsx`, `SettingsView.tsx`, `dialogs.tsx`, `EmailTab.tsx`, `authService.ts`, `CreateScheduleModal.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 102 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 102 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _963 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._