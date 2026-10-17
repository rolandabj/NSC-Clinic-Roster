# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 383 files · ~691,502 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2801 nodes · 9116 edges · 148 communities (130 shown, 18 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 400 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `836834ea`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- publicRosterService.ts
- createApiApp
- fixtures.ts
- clinicModel.test.ts
- authService
- AvailabilityView.tsx
- getRepository
- 16. History of work (for context)
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- RosterToolbar.tsx
- HistoryView.tsx
- savingSafety.test.ts
- authService.ts
- scheduleRanges.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- emailService.ts
- devDependencies
- usePresence.ts
- quick reference
- decisionEmail.test.ts
- hoursBalance.ts
- WorkbookGridView
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- ClinicContextState
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- dateUtils.ts
- GridTable.tsx
- WhoCanCover.tsx
- Optimization Patterns
- Assignment
- analysisExport.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- RulesTab.tsx
- firestore-rules/package.json
- staffRequestService.ts
- continuousHours.test.ts
- cellView.ts
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
- FairnessModal.tsx
- doctorWeekChange.test.ts
- NurseSelfServicePanel.tsx
- rosterPdfService.ts
- links.cjs
- icsExportService.ts
- GridSelection
- makeNurse
- SchedulingEngine.ts
- grid-keys.cjs
- UI overhaul: summary and next steps
- apiApp.ts
- types/index.ts
- DashboardView.tsx
- repository/index.ts
- harness/main.tsx
- react
- PublishedRosterView.tsx
- Finish a change
- Rules
- handMoves.test.ts
- scheduleTransactions.test.ts
- context7
- SchedulesView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- checkScheduler.test.ts
- start.sh
- stop.sh
- Rules
- grid-flow.cjs
- LiveCollectionCache
- NurseTimesheetModal.tsx
- authorizedFetch
- hoursPolicy.ts
- RosterGrid
- ScheduleValidator.ts
- RequestsView.tsx
- quotaTracker
- engineRules.test.ts
- UI overhaul: checklist
- NSC Clinic Roster: complete project guide
- sharing.test.ts
- address.ts
- dateDefaults.ts
- hoursRules.test.ts
- createLiveReconciler
- ref_node_assert
- nurseClinicFloat.test.ts
- grid-timing.cjs
- gridSelection.ts
- fakeAuth.ts
- IRepository.ts
- my-requests.cjs
- nurse-editor.cjs
- ui/index.ts
- RosterSteps.tsx
- nurseForm.ts
- liveCollectionCache.ts
- allowance.cjs
- scripts
- usePhoneLayout.ts
- rowsInSteps.ts
- ref_playwright
- nurse-page.cjs
- weekend.ts
- plain-english-reviewer.md
- nurses-list.cjs
- requests.cjs
- public-pages.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 118 edges
2. `Assignment` - 113 edges
3. `16. History of work (for context)` - 102 edges
4. `Nurse` - 99 edges
5. `getRepository()` - 97 edges
6. `DutyWindow` - 93 edges
7. `Schedule` - 92 edges
8. `lucide-react` - 89 edges
9. `Doctor` - 79 edges
10. `LeaveEntry` - 76 edges

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

## Communities (148 total, 18 thin omitted)

### Community 0 - "publicRosterService.ts"
Cohesion: 0.27
Nodes (9): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+1 more)

### Community 1 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 2 - "fixtures.ts"
Cohesion: 0.08
Nodes (20): ScheduleValidator, ANNUAL_LEAVE, SENIOR, UNPAID_LEAVE, LONG, NOV, OCT, DR_PEDS (+12 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "AvailabilityView.tsx"
Cohesion: 0.18
Nodes (17): AvailabilityView(), WEEKDAY_ABBR, GridCell, moveInGrid(), pickStep(), leaveApprovalFields(), InternalSlot, DatedLeave (+9 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (42): confirmDialog(), dismissNotice(), notify(), setState(), TemplateModal(), AccessManagementPanel(), ClinicTab(), ClinicTabProps (+34 more)

### Community 7 - "16. History of work (for context)"
Cohesion: 0.18
Nodes (19): 16. History of work (for context), MenuButton(), menuSections(), LocalModeBanner(), LocalModeBannerProps, Button(), Textarea(), EmptyState() (+11 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.09
Nodes (27): CellContextMenu(), CellChoice, CellEditorDialog(), withDr(), GRID_KEY_ID, GridLegend(), GridToolbar(), GridToolbarProps (+19 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.18
Nodes (12): MenuButtonProps, MenuItem, MenuSection, FillDialogProps, FillRange, moreMenuItems(), RosterMenuItem, RosterToolbarProps (+4 more)

### Community 14 - "HistoryView.tsx"
Cohesion: 0.08
Nodes (37): DeleteScheduleModal(), DeleteVersionModal(), VersionViewModal(), HistoryView(), WEEKDAY_NAMES, DatabaseTab(), saveRosterBackup(), restoreVersion() (+29 more)

### Community 15 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (18): 11. Saving, live updates, versions, useRosterEdits(), clearYearToDateCache(), forgetCachedRoster(), Desired, fingerprint(), Known, planSync() (+10 more)

### Community 16 - "authService.ts"
Cohesion: 0.12
Nodes (30): 3. Users, roles and access, 4. Navigation and app shell, LoginPageProps, signOutSafely(), AppShellProps, APP_NAME, SCREEN_NAMES, screenName() (+22 more)

### Community 17 - "scheduleRanges.ts"
Cohesion: 0.47
Nodes (8): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): jose, authMiddleware(), AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken() (+15 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.12
Nodes (24): 10. Hours, nurseClinicRoleOf(), YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS (+16 more)

### Community 22 - "App.tsx"
Cohesion: 0.18
Nodes (11): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 23 - "emailService.ts"
Cohesion: 0.19
Nodes (12): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+4 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "usePresence.ts"
Cohesion: 0.22
Nodes (8): useLatestCallback(), othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), Phase 3: roster grid speed and structure, now

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.10
Nodes (26): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, documentUrl() (+18 more)

### Community 28 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (32): NurseTimesheetModalProps, SortField, TabMode, fmtHours(), HoursAccountingSheet(), askedCarry(), closePeriod(), earlierPeriodTotals() (+24 more)

### Community 29 - "WorkbookGridView"
Cohesion: 0.13
Nodes (21): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, cellSummary() (+13 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "ClinicContextState"
Cohesion: 0.13
Nodes (16): AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps, ReportsViewProps (+8 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "dateUtils.ts"
Cohesion: 0.11
Nodes (24): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), LoadState, MyRosterView(), MyRosterViewProps, leaveClash(), MyDay (+16 more)

### Community 38 - "GridTable.tsx"
Cohesion: 0.14
Nodes (27): CellView, DayTotal, dayTotalsOf(), dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions (+19 more)

### Community 39 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.14
Nodes (66): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, ShareModalProps, SwapManagerModalProps (+58 more)

### Community 42 - "analysisExport.test.ts"
Cohesion: 0.09
Nodes (20): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+12 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "FirestoreRepository"
Cohesion: 0.31
Nodes (3): FirestoreRepository, sanitizePayload(), toScheduleRange()

### Community 46 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.11
Nodes (32): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+24 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 50 - "cellView.ts"
Cohesion: 0.13
Nodes (22): CellDay, cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), SOURCE_SPOKEN (+14 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.12
Nodes (28): AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+20 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

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
Cohesion: 0.14
Nodes (22): EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), EmailTab(), checkEmailReadiness(), EmailReadiness (+14 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "DoctorsView.tsx"
Cohesion: 0.12
Nodes (24): DoctorWeekChangeDialog(), WeekChangePreview, byDayAndTime(), checkDoctorForm(), doctorCounts(), DoctorFilters, DoctorFormErrors, DoctorFormValues (+16 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "FairnessModal.tsx"
Cohesion: 0.24
Nodes (15): FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap, NONE, listProblem(), checkSwap(), isPinnedShift() (+7 more)

### Community 78 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 79 - "NurseSelfServicePanel.tsx"
Cohesion: 0.22
Nodes (15): wholeDates(), NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors (+7 more)

### Community 80 - "rosterPdfService.ts"
Cohesion: 0.08
Nodes (27): jspdf, jspdf-autotable, FLOAT_ROLE_ID, chunk(), exportRosterToPdf(), firstName(), GRID, HEAD_FILL (+19 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "GridSelection"
Cohesion: 0.13
Nodes (6): GridSelection, GridSelectionState, HOURS_COLUMN, TOTALS_ROW, GridStatusBar(), SelectionView()

### Community 84 - "makeNurse"
Cohesion: 0.10
Nodes (23): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup() (+15 more)

### Community 85 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (59): 6. Clinic model (the business rules in plain English), xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, bloodCollectionRole(), canBeFreeNurse() (+51 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "apiApp.ts"
Cohesion: 0.15
Nodes (14): express, express-rate-limit, helmet, BackendRole, authRouter, calendarRouter, geminiRouter, GEMINI_MODEL (+6 more)

### Community 89 - "types/index.ts"
Cohesion: 0.06
Nodes (38): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult (+30 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.10
Nodes (40): useAppContext(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+32 more)

### Community 91 - "repository/index.ts"
Cohesion: 0.24
Nodes (12): CreateScheduleModal(), CreateScheduleModalProps, WorkingHoursPeriodsPanel(), defaultFirebaseConfig, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays() (+4 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "react"
Cohesion: 0.10
Nodes (31): lucide-react, react, uuid, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners (+23 more)

### Community 94 - "PublishedRosterView.tsx"
Cohesion: 0.33
Nodes (9): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+1 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 98 - "scheduleTransactions.test.ts"
Cohesion: 0.17
Nodes (8): Browser check, Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), nurses()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "SchedulesView.tsx"
Cohesion: 0.14
Nodes (26): SwapManagerModal(), VersionCompareModal(), FillDialog(), RosterPicker(), RosterPickerProps, rosterSteps(), RosterSteps(), RosterToolbar() (+18 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 110 - "NurseTimesheetModal.tsx"
Cohesion: 0.25
Nodes (13): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), AuditAction (+5 more)

### Community 111 - "authorizedFetch"
Cohesion: 0.27
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 112 - "hoursPolicy.ts"
Cohesion: 0.31
Nodes (9): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange() (+1 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "ScheduleValidator.ts"
Cohesion: 0.11
Nodes (36): 7. Rules, Other engine files, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), BlockedShift (+28 more)

### Community 115 - "RequestsView.tsx"
Cohesion: 0.15
Nodes (16): react-dom, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), PROBLEM_MARKS, ProblemCounts(), ProblemKind, Tone (+8 more)

### Community 116 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 117 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.09
Nodes (19): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works (+11 more)

### Community 120 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 121 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 122 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 123 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 124 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 125 - "ref_node_assert"
Cohesion: 0.10
Nodes (15): computeScheduleDiff(), BACKUPS_KEPT, addDays(), iso(), monthEnd(), suggestNewRosterDates(), diff(), LATE (+7 more)

### Community 126 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "gridSelection.ts"
Cohesion: 0.14
Nodes (17): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), isRosterCell(), keyOf() (+9 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.29
Nodes (4): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before

### Community 130 - "IRepository.ts"
Cohesion: 0.39
Nodes (5): FirebaseClientConfig, SubscribeCallback, Unsubscribe, ScheduleRange, CollectionName

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.10
Nodes (44): BulkImportModal(), RosterDayView(), Badge(), ProblemBadge(), ButtonProps, ButtonSize, ButtonVariant, IconButton() (+36 more)

### Community 134 - "RosterSteps.tsx"
Cohesion: 0.38
Nodes (3): RosterStep, RosterStepAction, base

### Community 135 - "nurseForm.ts"
Cohesion: 0.31
Nodes (6): checkNurseForm(), movePreference(), nextEmployeeCode(), NurseFormErrors, NurseFormValues, others

### Community 136 - "liveCollectionCache.ts"
Cohesion: 0.40
Nodes (4): CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

### Community 138 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 139 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 140 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 141 - "ref_playwright"
Cohesion: 0.12
Nodes (9): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 143 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 144 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **955 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+950 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1168 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `publicRosterService.ts`, `gridSelection.ts`, `ui/index.ts`, `RosterSteps.tsx`, `16. History of work (for context)`, `AvailabilityView.tsx`, `package.json`, `getRepository`, `usePhoneLayout.ts`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `HistoryView.tsx`, `rowsInSteps.ts`, `authService.ts`, `NurseSample.tsx`, `App.tsx`, `usePresence.ts`, `hoursBalance.ts`, `PlannerSample.tsx`, `ui.tsx`, `dateUtils.ts`, `GridTable.tsx`, `WhoCanCover.tsx`, `Assignment`, `RulesTab.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `PublishModal.tsx`, `DoctorsView.tsx`, `FairnessModal.tsx`, `NurseSelfServicePanel.tsx`, `GridSelection`, `makeNurse`, `SchedulingEngine.ts`, `DashboardView.tsx`, `repository/index.ts`, `harness/main.tsx`, `PublishedRosterView.tsx`, `SchedulesView.tsx`, `NurseTimesheetModal.tsx`, `RequestsView.tsx`, `NSC Clinic Roster: complete project guide`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `publicRosterService.ts`, `gridSelection.ts`, `ui/index.ts`, `RosterSteps.tsx`, `16. History of work (for context)`, `AvailabilityView.tsx`, `package.json`, `getRepository`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `HistoryView.tsx`, `authService.ts`, `NurseSample.tsx`, `App.tsx`, `hoursBalance.ts`, `PlannerSample.tsx`, `ui.tsx`, `dateUtils.ts`, `GridTable.tsx`, `Assignment`, `RulesTab.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `PublishModal.tsx`, `DoctorsView.tsx`, `FairnessModal.tsx`, `NurseSelfServicePanel.tsx`, `SchedulingEngine.ts`, `DashboardView.tsx`, `repository/index.ts`, `harness/main.tsx`, `PublishedRosterView.tsx`, `SchedulesView.tsx`, `NurseTimesheetModal.tsx`, `RequestsView.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `fixtures.ts`, `clinicModel.test.ts`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `HistoryView.tsx`, `savingSafety.test.ts`, `yearToDate.ts`, `hoursBalance.ts`, `WorkbookGridView`, `GridTable.tsx`, `analysisExport.test.ts`, `continuousHours.test.ts`, `cellView.ts`, `PublishModal.tsx`, `FairnessModal.tsx`, `doctorWeekChange.test.ts`, `rosterPdfService.ts`, `icsExportService.ts`, `makeNurse`, `SchedulingEngine.ts`, `types/index.ts`, `DashboardView.tsx`, `react`, `handMoves.test.ts`, `SchedulesView.tsx`, `ScheduleValidator.ts`, `engineRules.test.ts`, `sharing.test.ts`, `hoursRules.test.ts`, `ref_node_assert`, `nurseClinicFloat.test.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 101 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 101 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _955 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07823613086770982 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._