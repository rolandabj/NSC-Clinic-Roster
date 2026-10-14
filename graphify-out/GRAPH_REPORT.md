# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 379 files · ~414,316 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2787 nodes · 9075 edges · 144 communities (130 shown, 14 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 399 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d232d6e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Nurse
- analysisExport.test.ts
- Schedule
- clinicModel.test.ts
- authService
- holidayLeave.ts
- notify
- assignmentChecks.ts
- ui-audit.cjs
- package.json
- scheduleTransactions.test.ts
- dependencies
- Test-Driven Development
- geminiApi.test.ts
- IRepository
- CollectionSyncer
- access.ts
- seedRunner.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- emailService.ts
- devDependencies
- RosterToolbar.tsx
- quick reference
- decisionEmail.test.ts
- hoursBalance.ts
- dayView.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- ClinicContextState
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- WorkbookGrid.tsx
- Handover for a new chat
- explainCell.ts
- Optimization Patterns
- SchedulesView.tsx
- checkScheduler.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- engineRules.test.ts
- firestore-rules/package.json
- staffRequestService.ts
- continuousHours.test.ts
- gridSelection.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- lastResort.test.ts
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
- getRepository
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- DoctorsView.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- nurseRosterService.ts
- doctorScheduleService.ts
- fixtures.ts
- ExportModal.tsx
- links.cjs
- icsExportService.ts
- types/index.ts
- makeNurse
- SchedulingEngine.ts
- grid-keys.cjs
- UI overhaul: summary and next steps
- apiApp.ts
- PublishModal.tsx
- DashboardView.tsx
- cellView.ts
- harness/main.tsx
- HistoryView.tsx
- NSC Clinic Roster: complete project guide
- Finish a change
- Rules
- handMoves.test.ts
- formatDate
- context7
- 16. History of work (for context)
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- NurseSelfServicePanel.tsx
- start.sh
- stop.sh
- Rules
- grid-flow.cjs
- LiveCollectionCache
- NurseTimesheetModal.tsx
- authService.ts
- analysisExportService.ts
- RosterGrid
- react
- TopBar.tsx
- FirestoreRepository.ts
- ref_node_assert
- UI overhaul: checklist
- ClinicRoster
- dateDefaults.ts
- firestoreRest.ts
- RulesTab.tsx
- doctorWeekChange.test.ts
- savingSafety.test.ts
- newRosterDates.ts
- nurseClinicFloat.test.ts
- grid-timing.cjs
- GridTable.tsx
- fakeAuth.ts
- RosterSteps.tsx
- my-requests.cjs
- nurse-editor.cjs
- ui/index.ts
- sheet-tabs.cjs
- nurseForm.ts
- ensureNurseLink
- hoursRules.test.ts
- scripts
- DatabaseTab.tsx
- dashboardSummary.ts
- ref_playwright
- nurse-page.cjs
- requests.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 118 edges
2. `Assignment` - 113 edges
3. `16. History of work (for context)` - 100 edges
4. `Nurse` - 98 edges
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

## Communities (144 total, 14 thin omitted)

### Community 0 - "Nurse"
Cohesion: 0.12
Nodes (54): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+46 more)

### Community 1 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+11 more)

### Community 2 - "Schedule"
Cohesion: 0.21
Nodes (22): NurseTimesheetModalProps, SortField, TabMode, fmtHours(), HoursAccountingSheet(), HoursAccountingSheetProps, ExplainDayInput, RosterExportOptions (+14 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 6 - "notify"
Cohesion: 0.14
Nodes (38): confirmDialog(), notify(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps, DutiesTab(), DutiesTabProps (+30 more)

### Community 7 - "assignmentChecks.ts"
Cohesion: 0.10
Nodes (33): Other engine files, FairnessModal(), checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween(), shiftDate() (+25 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (23): firebase, name, private, type, version, autoprefixer, cors, date-fns (+15 more)

### Community 10 - "scheduleTransactions.test.ts"
Cohesion: 0.22
Nodes (7): Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), nurses()

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 14 - "IRepository"
Cohesion: 0.19
Nodes (10): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), fingerprint(), syncScheduleAssignments(), IRepository, saveDoctorSessions() (+2 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.10
Nodes (12): 11. Saving, live updates, versions, useLatestCallback(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+4 more)

### Community 16 - "access.ts"
Cohesion: 0.19
Nodes (19): 3. Users, roles and access, 4. Navigation and app shell, usePermissions(), APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS (+11 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.14
Nodes (20): assertScheduleRangeAvailable(), assertValidDates(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap, ScheduleRange (+12 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.21
Nodes (13): AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache, jwks (+5 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.12
Nodes (25): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), lateDutyThreshold(), clamp(), KEYS, YEAR_SEED_CAP (+17 more)

### Community 22 - "App.tsx"
Cohesion: 0.11
Nodes (18): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+10 more)

### Community 23 - "emailService.ts"
Cohesion: 0.24
Nodes (9): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS (+1 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.12
Nodes (17): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+9 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.10
Nodes (23): requirePlanner, emailRouter, COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail() (+15 more)

### Community 28 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (35): askedCarry(), closePeriod(), countedEarlierRosters(), countHoursInRange(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+27 more)

### Community 29 - "dayView.ts"
Cohesion: 0.09
Nodes (25): VersionViewModal(), DayProblem, DayRow, dayViewOf(), isPhoneSize(), KIND, ORDER, PHONE_QUERY (+17 more)

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
Cohesion: 0.11
Nodes (24): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+16 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (13): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+5 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (26): CellContextMenu(), GRID_KEY_ID, GridLegend(), rowViewsOf(), GridToolbar(), GridToolbarProps, GridZoom, findCell() (+18 more)

### Community 38 - "Handover for a new chat"
Cohesion: 0.29
Nodes (6): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 5. What comes next, 6. Points to know, Handover for a new chat

### Community 39 - "explainCell.ts"
Cohesion: 0.17
Nodes (19): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+11 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "SchedulesView.tsx"
Cohesion: 0.17
Nodes (23): TemplateModalProps, FillDialogProps, FillRange, RosterToolbarProps, CheckInputs, EMPTY_REPORT, RosterSnapshot, useRosterEdits() (+15 more)

### Community 42 - "checkScheduler.test.ts"
Cohesion: 0.27
Nodes (5): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "FirestoreRepository"
Cohesion: 0.23
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 46 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.10
Nodes (35): PageHeader(), TabPanel(), AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+27 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 50 - "gridSelection.ts"
Cohesion: 0.11
Nodes (20): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf() (+12 more)

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

### Community 55 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (16): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, SchedulingEngine, DR_PEDS, ENT, FULL, PEDS (+8 more)

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

### Community 68 - "getRepository"
Cohesion: 0.16
Nodes (26): useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), PublishModal(), ShareModal(), TabType, SwapManagerModal() (+18 more)

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
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "DoctorsView.tsx"
Cohesion: 0.10
Nodes (39): BulkImportModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, Badge(), IconButton(), cx(), Dialog() (+31 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (23): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), LoadState, MyRosterViewProps, MyDay, myShiftDays(), dayMonth() (+15 more)

### Community 78 - "doctorScheduleService.ts"
Cohesion: 0.17
Nodes (23): 13. Screens in detail, CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift() (+15 more)

### Community 79 - "fixtures.ts"
Cohesion: 0.11
Nodes (13): ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, LONG, NOV, OCT, OCT (+5 more)

### Community 80 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (39): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+31 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "types/index.ts"
Cohesion: 0.09
Nodes (20): ApprovalStatus, AuditAction, BlockWeeks, DoctorSessionSource, EmailLogKind, EmailLogStatus, Invitation, InvitationStatus (+12 more)

### Community 84 - "makeNurse"
Cohesion: 0.13
Nodes (20): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account(), CARD (+12 more)

### Community 85 - "SchedulingEngine.ts"
Cohesion: 0.12
Nodes (39): 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes() (+31 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "apiApp.ts"
Cohesion: 0.11
Nodes (18): repoRoot, swaps, express, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer() (+10 more)

### Community 89 - "PublishModal.tsx"
Cohesion: 0.18
Nodes (17): Request, EmailHtmlPreview(), Step, PublishTab, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog() (+9 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (23): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+15 more)

### Community 91 - "cellView.ts"
Cohesion: 0.13
Nodes (22): CellDay, cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), SOURCE_SPOKEN (+14 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "HistoryView.tsx"
Cohesion: 0.14
Nodes (17): ShareModalProps, CHANGE_LABELS, SOURCE_LABELS, WEEKDAY_NAMES, WEEKDAY_NAMES, PublishedRosterViewProps, AssignmentDiffItem, ChangeType (+9 more)

### Community 94 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.12
Nodes (17): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, PublicMessage(), PublicPageFrame() (+9 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

### Community 98 - "formatDate"
Cohesion: 0.11
Nodes (21): Report, What to check, What to look at, FillDialog(), CellEditorDialog(), withDr(), GridTable(), HolidayDayOffPicker() (+13 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "16. History of work (for context)"
Cohesion: 0.17
Nodes (20): 16. History of work (for context), firstDayShown(), RosterDayView(), ProblemBadge(), AvailabilityView(), WEEKDAY_ABBR, MyRosterView(), dayTotalsOf() (+12 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "NurseSelfServicePanel.tsx"
Cohesion: 0.19
Nodes (17): DateInput(), NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors (+9 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 110 - "NurseTimesheetModal.tsx"
Cohesion: 0.33
Nodes (9): fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), csvCell(), downloadCsv() (+1 more)

### Community 111 - "authService.ts"
Cohesion: 0.16
Nodes (17): EmailTab(), authorizedFetch(), MASTER_ADMIN_EMAIL, UserPrivileges, checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights() (+9 more)

### Community 112 - "analysisExportService.ts"
Cohesion: 0.23
Nodes (12): isLateDuty(), ANALYSIS_FORMAT_VERSION, buildRosterAnalysis(), countBy(), FIELD_GUIDE, minutesBetween(), PROBLEM_RULES, problemRule() (+4 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "react"
Cohesion: 0.11
Nodes (25): lucide-react, react, uuid, ConfirmOptions, DialogState, dismissNotice(), listeners, Notice (+17 more)

### Community 115 - "TopBar.tsx"
Cohesion: 0.27
Nodes (8): AccountMenu(), TopBar(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), Tabs(), render()

### Community 116 - "FirestoreRepository.ts"
Cohesion: 0.12
Nodes (10): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry (+2 more)

### Community 117 - "ref_node_assert"
Cohesion: 0.13
Nodes (8): diff(), LATE, nurse, leaves, pins, october, octoberVersion, september

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 121 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 122 - "RulesTab.tsx"
Cohesion: 0.15
Nodes (18): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+10 more)

### Community 123 - "doctorWeekChange.test.ts"
Cohesion: 0.11
Nodes (13): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, LATE (+5 more)

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (7): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 125 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 126 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "GridTable.tsx"
Cohesion: 0.12
Nodes (24): CellView, DayTotal, FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL, useCellFlags() (+16 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 130 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.08
Nodes (38): ConfirmBox(), DialogHost(), LocalModeBanner(), LocalModeBannerProps, PROBLEM_MARKS, ProblemKind, Tone, TONE_CLASSES (+30 more)

### Community 135 - "nurseForm.ts"
Cohesion: 0.31
Nodes (6): checkNurseForm(), movePreference(), nextEmployeeCode(), NurseFormErrors, NurseFormValues, others

### Community 136 - "ensureNurseLink"
Cohesion: 0.31
Nodes (9): ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), writeInitializationState(), cache() (+1 more)

### Community 137 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 138 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 139 - "DatabaseTab.tsx"
Cohesion: 0.50
Nodes (7): useAppContext(), DatabaseTab(), defaultFirebaseConfig, checkBackup(), clearDatabase(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 140 - "dashboardSummary.ts"
Cohesion: 0.40
Nodes (4): addDays(), NEXT_ROSTER_WARNING_DAYS, nextRosterNeeded(), OnDutyEntry

### Community 141 - "ref_playwright"
Cohesion: 0.13
Nodes (9): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

## Knowledge Gaps
- **949 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+944 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1157 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Nurse`, `GridTable.tsx`, `RosterSteps.tsx`, `Schedule`, `ui/index.ts`, `notify`, `package.json`, `DatabaseTab.tsx`, `CollectionSyncer`, `access.ts`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `dayView.ts`, `PlannerSample.tsx`, `ui.tsx`, `ClinicContextState`, `WorkbookGrid.tsx`, `explainCell.ts`, `SchedulesView.tsx`, `staffRequestService.ts`, `gridSelection.ts`, `AppShell.tsx`, `getRepository`, `DoctorsView.tsx`, `nurseRosterService.ts`, `doctorScheduleService.ts`, `ExportModal.tsx`, `makeNurse`, `PublishModal.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `HistoryView.tsx`, `NSC Clinic Roster: complete project guide`, `formatDate`, `16. History of work (for context)`, `NurseSelfServicePanel.tsx`, `NurseTimesheetModal.tsx`, `authService.ts`, `TopBar.tsx`, `RulesTab.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Nurse`, `GridTable.tsx`, `RosterSteps.tsx`, `Schedule`, `ui/index.ts`, `notify`, `package.json`, `DatabaseTab.tsx`, `access.ts`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `WorkbookGrid.tsx`, `SchedulesView.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `getRepository`, `DoctorsView.tsx`, `nurseRosterService.ts`, `doctorScheduleService.ts`, `ExportModal.tsx`, `PublishModal.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `HistoryView.tsx`, `NSC Clinic Roster: complete project guide`, `formatDate`, `16. History of work (for context)`, `NurseSelfServicePanel.tsx`, `NurseTimesheetModal.tsx`, `authService.ts`, `TopBar.tsx`, `RulesTab.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Nurse`, `fakeAuth.ts`, `getRepository`, `16. History of work (for context)`, `notify`, `SchedulesView.tsx`, `doctorScheduleService.ts`, `authService.ts`, `access.ts`, `staffRequestService.ts`, `react`, `TopBar.tsx`, `AppShell.tsx`, `App.tsx`, `PublishModal.tsx`, `DashboardView.tsx`, `HistoryView.tsx`, `RosterToolbar.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 99 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 99 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _949 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Nurse` be split into smaller, more focused modules?**
  _Cohesion score 0.1185792349726776 - nodes in this community are weakly interconnected._
- **Should `analysisExport.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._