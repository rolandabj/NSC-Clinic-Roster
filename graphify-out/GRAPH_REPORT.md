# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 408 files · ~427,121 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2921 nodes · 9977 edges · 157 communities (131 shown, 26 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 429 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `295b8956`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- fixtures.ts
- clinicModel.test.ts
- authService
- SchedulesView.tsx
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- RosterToolbar.tsx
- sharing.test.ts
- seedRunner.ts
- Sidebar.tsx
- IRepository
- firebaseIdentityService.ts
- index.tsx
- compilerOptions
- yearToDate.ts
- PublishedRosterView.tsx
- emailService.ts
- devDependencies
- GridTable.tsx
- quick reference
- decisionEmail.test.ts
- dayView.test.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- authService.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- EmailTab.tsx
- doctorForm.ts
- RulesTab.tsx
- Optimization Patterns
- Assignment
- nurseRosterService.ts
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- preferenceFocus.test.ts
- firestore-rules/package.json
- staffRequestService.ts
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- EntityForCollection
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- engineRules.test.ts
- Planning and Task Breakdown
- Find Skills
- HistoryView.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- dialogs.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- weekHours.test.ts
- holidayLeave.ts
- GridSelection
- NurseTimesheetModal.tsx
- links.cjs
- icsExportService.ts
- formatDayDate
- makeNurse
- nurseForm.ts
- cellView.test.ts
- UI overhaul: summary and next steps
- gridSelection.ts
- types/index.ts
- DashboardView.tsx
- dayView.ts
- harness/main.tsx
- MyRosterView.tsx
- firestoreRest.ts
- Finish a change
- Rules
- handMoves.test.ts
- savingSafety.test.ts
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- apiApp.ts
- start.sh
- stop.sh
- Rules
- grid-keys.cjs
- LiveCollectionCache
- AvailabilityView.tsx
- AuditTrailView.tsx
- ClinicContextState
- FirestoreRepository
- nurseClinicFloat.test.ts
- The Five-Axis Review
- IRepository.ts
- peopleImport.ts
- UI overhaul: checklist
- NSC Clinic Roster: complete project guide
- NurseRosterShift
- 16. History of work (for context)
- approvedDayOff.test.ts
- Phases
- FirestoreRepository.ts
- fakeAuth.ts
- ref_node_assert
- grid-timing.cjs
- leaveImport.ts
- 13. Screens in detail
- versionKinds.test.ts
- my-requests.cjs
- types.ts
- react
- leaveAllowance.test.ts
- DoctorsView.tsx
- rowsInSteps.ts
- allowance.cjs
- public-pages.cjs
- newRosterDates.ts
- nurse-editor.cjs
- history.cjs
- nurse-page.cjs
- ddmmyyyy
- form-dialogs.cjs
- grid-flow.cjs
- toolbar.cjs
- PublishLog
- leave-grid.cjs
- plain-english-reviewer.md
- roster-dialogs.cjs
- Review Process
- publish.cjs
- resume.cjs
- sent-rosters.cjs
- settings-dialogs.cjs
- sheet-tabs.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `16. History of work (for context)` - 116 edges
3. `Assignment` - 112 edges
4. `Nurse` - 106 edges
5. `getRepository()` - 99 edges
6. `DutyWindow` - 94 edges
7. `Schedule` - 92 edges
8. `lucide-react` - 90 edges
9. `formatDate()` - 90 edges
10. `Button()` - 82 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts

## Import Cycles
- None detected.

## Communities (157 total, 26 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (52): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps, SortField, TabMode (+44 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (79): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+71 more)

### Community 2 - "fixtures.ts"
Cohesion: 0.06
Nodes (30): EARLY, input(), LATE, softHoursLimit, week, ANNUAL_LEAVE, DAY_DUTY, makeLeave() (+22 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): 3. Users, roles and access, authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (44): CreateScheduleModal(), DeleteScheduleModal(), EditDoctorShiftModal(), TIME_PRESETS, ExportModal(), FairnessModal(), PublishModal(), NONE (+36 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (50): useAppContext(), confirmDialog(), notify(), Field(), Input(), AccessManagementPanel(), ClinicTab(), ClinicTabProps (+42 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.06
Nodes (30): firebase, name, private, scripts, build, clean, dev, lint (+22 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.09
Nodes (33): useRosterEdits(), CellContextMenu(), cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames() (+25 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.30
Nodes (8): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar()

### Community 14 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 15 - "seedRunner.ts"
Cohesion: 0.10
Nodes (29): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster(), ScheduleDeleteResult, assertScheduleRangeAvailable(), assertValidDates() (+21 more)

### Community 16 - "Sidebar.tsx"
Cohesion: 0.30
Nodes (11): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar(), SidebarProps (+3 more)

### Community 17 - "IRepository"
Cohesion: 0.09
Nodes (31): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments() (+23 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (24): jose, authMiddleware(), AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken() (+16 more)

### Community 19 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.14
Nodes (21): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+13 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.12
Nodes (19): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+11 more)

### Community 23 - "emailService.ts"
Cohesion: 0.22
Nodes (10): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+2 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "GridTable.tsx"
Cohesion: 0.11
Nodes (32): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+24 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.11
Nodes (21): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+13 more)

### Community 28 - "dayView.test.ts"
Cohesion: 0.14
Nodes (14): dayViewOf(), firstDayShown(), RosterDayView(), cellSummary(), isDayProblem(), dayTotalsOf(), ProblemsPanelProps, ValidationFinding (+6 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (32): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+24 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "authService.ts"
Cohesion: 0.12
Nodes (25): LoginPageProps, signOutSafely(), dialogsChanged(), openListeners, openStack, useDialogA11y(), AppShellProps, AccountMenu() (+17 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.11
Nodes (17): Change Descriptions, Change Sizing, Code Review and Quality, Common Rationalizations, Dead Code Hygiene, Dependency Discipline, Handling Disagreements, Honesty in Review (+9 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 38 - "doctorForm.ts"
Cohesion: 0.22
Nodes (10): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+2 more)

### Community 39 - "RulesTab.tsx"
Cohesion: 0.06
Nodes (49): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, ALWAYS_ON, effectiveValue(), findRule(), GROUPS (+41 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.12
Nodes (79): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps (+71 more)

### Community 42 - "nurseRosterService.ts"
Cohesion: 0.21
Nodes (12): ensureNurseLink(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, nurseLinkUrl(), origin(), regenerateNurseLink(), RegenerateNurseLinkResult, ShiftRefs (+4 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.10
Nodes (27): ServerEmailConfig, EmailTabProps, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), findStoppedPublish(), isDone() (+19 more)

### Community 46 - "preferenceFocus.test.ts"
Cohesion: 0.18
Nodes (10): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, PreferenceFocus, CARD, KHAN, LATE, LEE (+2 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.25
Nodes (14): canApproveRequests(), dayOffLockId(), daysInclusive(), deleteAvailabilityRequest(), isPendingLeave(), listPendingApprovals(), PendingAvailabilityItem, PendingLeaveItem (+6 more)

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
Cohesion: 0.11
Nodes (29): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+21 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "EntityForCollection"
Cohesion: 0.09
Nodes (16): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+8 more)

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

### Community 65 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "HistoryView.tsx"
Cohesion: 0.19
Nodes (25): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), plural(), CHANGE_LABELS, CHANGE_TONES, VersionCompareModal() (+17 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.15
Nodes (12): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+4 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "dialogs.tsx"
Cohesion: 0.20
Nodes (15): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+7 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 77 - "weekHours.test.ts"
Cohesion: 0.07
Nodes (17): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, DR_PEDS (+9 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.30
Nodes (11): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+3 more)

### Community 80 - "NurseTimesheetModal.tsx"
Cohesion: 0.31
Nodes (9): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, ReportsView(), downloadCsv(), Phase 1: quick fixes and safety (+1 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.17
Nodes (17): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+9 more)

### Community 83 - "formatDayDate"
Cohesion: 0.16
Nodes (17): CellChoice, CellEditorDialog(), choiceClass(), withDr(), decisionTitle(), waitingDayText(), waitingLeaveText(), AssignmentKind (+9 more)

### Community 84 - "makeNurse"
Cohesion: 0.11
Nodes (26): 15. Tests, SchedulingEngine, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+18 more)

### Community 85 - "nurseForm.ts"
Cohesion: 0.28
Nodes (6): checkNurseForm(), movePreference(), NurseFormErrors, NurseFormValues, NursePreference, others

### Community 86 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "gridSelection.ts"
Cohesion: 0.15
Nodes (17): ProblemCounts(), CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf(), moveSelection() (+9 more)

### Community 89 - "types/index.ts"
Cohesion: 0.08
Nodes (27): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), ApprovalStatus, BlockWeeks, DoctorSessionSource (+19 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (25): PageLoading(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+17 more)

### Community 91 - "dayView.ts"
Cohesion: 0.22
Nodes (8): DayProblem, DayRow, KIND, ORDER, currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "MyRosterView.tsx"
Cohesion: 0.24
Nodes (13): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), LoadState, MyRosterView(), MyRosterViewProps, dayMonth(), formatRosterAsText() (+5 more)

### Community 94 - "firestoreRest.ts"
Cohesion: 0.31
Nodes (9): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs() (+1 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 98 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (8): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.11
Nodes (11): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+3 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "apiApp.ts"
Cohesion: 0.09
Nodes (22): repoRoot, swaps, express, express-rate-limit, @google/genai, @tailwindcss/vite, vite, @vitejs/plugin-react (+14 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.31
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 110 - "AvailabilityView.tsx"
Cohesion: 0.44
Nodes (6): Switch(), AvailabilityView(), WEEKDAY_ABBR, GridCell, moveInGrid(), pickStep()

### Community 111 - "AuditTrailView.tsx"
Cohesion: 0.39
Nodes (6): AuditTrailView(), AuditAction, AuditEvent, csvCell(), CsvValue, toCsv()

### Community 112 - "ClinicContextState"
Cohesion: 0.12
Nodes (21): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+13 more)

### Community 113 - "FirestoreRepository"
Cohesion: 0.19
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 114 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 115 - "The Five-Axis Review"
Cohesion: 0.29
Nodes (7): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, The Five-Axis Review, data()

### Community 116 - "IRepository.ts"
Cohesion: 0.26
Nodes (7): SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList(), PageRequest, logs

### Community 117 - "peopleImport.ts"
Cohesion: 0.24
Nodes (10): cellsOf(), DoctorImportRow, NurseImportRow, readDoctorRows(), readNurseRows(), WEEKDAYS, nextEmployeeCode(), levels (+2 more)

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.20
Nodes (9): Phase 0: setup, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit (+1 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (15): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development, Getting Started (+7 more)

### Community 120 - "NurseRosterShift"
Cohesion: 0.36
Nodes (4): 1. Features at a glance, MyDay, myShiftDays(), NurseRosterShift

### Community 121 - "16. History of work (for context)"
Cohesion: 0.18
Nodes (14): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler(), addDays() (+6 more)

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "Phases"
Cohesion: 0.25
Nodes (8): Phase 0: setup (right after approval), Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, and request decision emails, Phase 6: Nurses, Doctors, Availability and Requests (planner screens), Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit, Phases

### Community 124 - "FirestoreRepository.ts"
Cohesion: 0.11
Nodes (11): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, FirebaseClientConfig, CacheEntry, ListFilter, UNCACHED_COLLECTIONS (+3 more)

### Community 125 - "fakeAuth.ts"
Cohesion: 0.15
Nodes (9): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, planner(), history() (+1 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.08
Nodes (15): MONTHS, suggestRosterName(), ctx(), EARLY, LATE, diff(), LATE, nurse (+7 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "leaveImport.ts"
Cohesion: 0.21
Nodes (10): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), parseDayMonthYear(), leaves, pins, AL (+2 more)

### Community 129 - "13. Screens in detail"
Cohesion: 0.16
Nodes (16): 13. Screens in detail, useLatestCallback(), isPhoneSize(), PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout(), checkDayRequest() (+8 more)

### Community 130 - "versionKinds.test.ts"
Cohesion: 0.25
Nodes (7): all, backup, lastYear, none, published, saved, v()

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "types.ts"
Cohesion: 0.47
Nodes (5): FillDialogProps, RosterToolbarProps, GenerationPreflightSummary, GenerationProgress, RegenerateMode

### Community 133 - "react"
Cohesion: 0.07
Nodes (58): lucide-react, react, EmailHtmlPreview(), LocalModeBanner(), LocalModeBannerProps, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs() (+50 more)

### Community 134 - "leaveAllowance.test.ts"
Cohesion: 0.31
Nodes (6): allowanceFor(), Kind, takesAllowance(), AL, DAY_OFF, SICK

### Community 135 - "DoctorsView.tsx"
Cohesion: 0.16
Nodes (30): uuid, NoticeTone, BulkImportModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, ShareModal(), TemplateModal() (+22 more)

### Community 136 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 139 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 143 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 147 - "PublishLog"
Cohesion: 0.33
Nodes (7): emailKindLabel(), KIND_LABELS, sendResult, EmailLogKind, PublishLog, log(), rec()

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 155 - "Review Process"
Cohesion: 0.33
Nodes (6): Review Process, Step 1: Understand the Context, Step 2: Review the Tests First, Step 3: Review the Implementation, Step 4: Categorize Findings, Step 5: Verify the Verification

## Knowledge Gaps
- **993 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+988 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1209 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `13. Screens in detail`, `fixtures.ts`, `SchedulesView.tsx`, `getRepository`, `DoctorsView.tsx`, `rowsInSteps.ts`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `Sidebar.tsx`, `PublishedRosterView.tsx`, `GridTable.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `EmailTab.tsx`, `RulesTab.tsx`, `Assignment`, `AppShell.tsx`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `NurseTimesheetModal.tsx`, `formatDayDate`, `gridSelection.ts`, `types/index.ts`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `AvailabilityView.tsx`, `AuditTrailView.tsx`, `ClinicContextState`, `NSC Clinic Roster: complete project guide`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `SchedulesView.tsx`, `getRepository`, `DoctorsView.tsx`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `Sidebar.tsx`, `PublishedRosterView.tsx`, `GridTable.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `EmailTab.tsx`, `RulesTab.tsx`, `Assignment`, `AppShell.tsx`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `NurseTimesheetModal.tsx`, `formatDayDate`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `AvailabilityView.tsx`, `AuditTrailView.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `data()` connect `The Five-Axis Review` to `leaveImport.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 115 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 115 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _993 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07103825136612021 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06910866910866911 - nodes in this community are weakly interconnected._