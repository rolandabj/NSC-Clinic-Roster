# Graph Report - NSC-Clinic-Roster  (2026-11-03)

## Corpus Check
- 424 files · ~433,208 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2988 nodes · 10267 edges · 160 communities (131 shown, 29 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 435 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ada41f82`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- cellView.test.ts
- clinicModel.test.ts
- authService
- AvailabilityView.tsx
- Field
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- fixtures.ts
- sharing.test.ts
- seedRunner.ts
- assignmentChecks.ts
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- App.tsx
- emailService.ts
- devDependencies
- GridTable.tsx
- quick reference
- decisionEmail.test.ts
- 16. History of work (for context)
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- access.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- formatDate
- Button
- nurseRosterService.ts
- Optimization Patterns
- Assignment
- savingSafety.test.ts
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- fakeAuth.ts
- firestore-rules/package.json
- getRepository
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
- lastResort.test.ts
- Planning and Task Breakdown
- Find Skills
- HistoryView.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- LiveCollectionCache
- Rules
- useDialogA11y
- README.md
- doctorWeekChange.test.ts
- holidayLeave.ts
- createApiApp
- handMoves.test.ts
- links.cjs
- icsExportService.ts
- IRepository.ts
- makeNurse
- PublishView.tsx
- formatDayDate
- UI overhaul: summary and next steps
- emailLogSize.ts
- types/index.ts
- DashboardView.tsx
- ClinicContextState
- harness/main.tsx
- MyRosterView.tsx
- scheduleRanges.ts
- Finish a change
- Rules
- dialogs.tsx
- SchedulesView.tsx
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
- usePresence.ts
- nurses-list.cjs
- PublishedRosterSheet.tsx
- yearToDate.ts
- EntityForCollection
- nurseList.test.ts
- FillDialog.tsx
- nurseClinicFloat.test.ts
- peopleImport.ts
- firestoreRest.ts
- NSC Clinic Roster: complete project guide
- RulesTab.tsx
- RosterGrid
- approvedDayOff.test.ts
- leaveGuard.ts
- quotaTracker
- publicRosterService.ts
- ref_node_assert
- grid-timing.cjs
- scripts
- rowsInSteps.ts
- checkScheduler.test.ts
- my-requests.cjs
- request-clinic-dialogs.cjs
- react
- versionKinds.test.ts
- requests.cjs
- PublishedRosterView.tsx
- allowance.cjs
- newRosterDates.ts
- doctors.cjs
- roster-dialogs.cjs
- nurse-editor.cjs
- nurse-page.cjs
- public-pages.cjs
- form-dialogs.cjs
- history.cjs
- toolbar.cjs
- settings-dialogs.cjs
- settings-save.cjs
- leave-grid.cjs
- plain-english-reviewer.md
- Sidebar.tsx
- GridStatusBar.tsx
- access.cjs
- grid-flow.cjs
- engineRules.test.ts
- WhoCanCover.tsx
- address.ts
- usePhoneLayout.ts
- resume.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `16. History of work (for context)` - 119 edges
3. `Assignment` - 112 edges
4. `Nurse` - 106 edges
5. `getRepository()` - 99 edges
6. `DutyWindow` - 94 edges
7. `Schedule` - 92 edges
8. `formatDate()` - 90 edges
9. `lucide-react` - 89 edges
10. `Button()` - 89 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (160 total, 29 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (51): How a run works, jspdf, jspdf-autotable, ExportTab, WEEKDAY_NAMES, NurseTimesheetModalProps, FLOAT_ROLE_ID, isFloatShift() (+43 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (57): 6. Clinic model (the business rules in plain English), 7. Rules, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME (+49 more)

### Community 2 - "cellView.test.ts"
Cohesion: 0.07
Nodes (24): 15. Tests, CellDay, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+16 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.07
Nodes (25): Browser check, Steps, planner(), history(), D, DOCTORS, DR_X, DUTIES (+17 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "AvailabilityView.tsx"
Cohesion: 0.30
Nodes (9): PageHeader(), Switch(), AvailabilityView(), WEEKDAY_ABBR, GridCell, moveInGrid(), pickStep(), InternalSlot (+1 more)

### Community 6 - "Field"
Cohesion: 0.12
Nodes (49): useAppContext(), confirmDialog(), notify(), NONE, SwapManagerModal(), Field(), Input(), ClinicTab() (+41 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (23): firebase, name, private, type, version, autoprefixer, cors, date-fns (+15 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (50): DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), cellLookupsOf(), cellSummary() (+42 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "fixtures.ts"
Cohesion: 0.08
Nodes (23): isPhoneSize(), amy, LEE, lookups, mary, nina, shift, ANNUAL_LEAVE (+15 more)

### Community 14 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 15 - "seedRunner.ts"
Cohesion: 0.13
Nodes (16): countOf(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats (+8 more)

### Community 16 - "assignmentChecks.ts"
Cohesion: 0.15
Nodes (26): Other engine files, checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween(), shiftDate(), nurseClinicRoleOf() (+18 more)

### Community 17 - "IRepository"
Cohesion: 0.12
Nodes (21): saveRosterBackup(), restoreVersion(), VersionRestoreResult, fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository, deleteDoctorShift() (+13 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (24): jose, authMiddleware(), AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken() (+16 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.08
Nodes (46): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, AuditTrailView(), BarList(), hours(), Meter() (+38 more)

### Community 22 - "App.tsx"
Cohesion: 0.11
Nodes (18): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+10 more)

### Community 23 - "emailService.ts"
Cohesion: 0.19
Nodes (12): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+4 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "GridTable.tsx"
Cohesion: 0.06
Nodes (47): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+39 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.13
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, DecidedRequest, decisionEmail() (+11 more)

### Community 28 - "16. History of work (for context)"
Cohesion: 0.24
Nodes (14): 16. History of work (for context), firstDayShown(), useRosterEdits(), planSync(), changedLists(), sameItems(), addDays(), DateRange (+6 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (32): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+24 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "access.ts"
Cohesion: 0.28
Nodes (12): 3. Users, roles and access, signOutSafely(), AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canApproveRequests(), canEditClinicData() (+4 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.06
Nodes (30): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+22 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "formatDate"
Cohesion: 0.11
Nodes (19): DoctorsScheduleSheet(), WEEKDAY_ABBR, GRID_KEY_ID, GridToolbar(), GridToolbarProps, GridZoom, HolidayDayOffPicker(), HolidayDayOffPickerProps (+11 more)

### Community 38 - "Button"
Cohesion: 0.16
Nodes (48): uuid, NoticeTone, LocalModeBanner(), BulkImportModal(), CreateScheduleModal(), CreateScheduleModalProps, DeleteScheduleModal(), DeleteScheduleModalProps (+40 more)

### Community 39 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (24): loadViewerData(), addDaysIso(), buildNurseRosterDoc(), buildTeamRosterSheet(), ensureNurseLink(), latestPublishedVersions(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS (+16 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.13
Nodes (73): 5. Data model (Firestore collections), VersionRosterProps, WEEKDAY_NAMES, BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE (+65 more)

### Community 42 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (13): clearYearToDateCache(), forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.14
Nodes (22): ServerEmailConfig, EmailTabProps, findStoppedPublish(), isDone(), isResumable(), lastNews(), overallSendStatus(), planResume() (+14 more)

### Community 46 - "fakeAuth.ts"
Cohesion: 0.29
Nodes (4): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "getRepository"
Cohesion: 0.11
Nodes (45): 13. Screens in detail, ErrorState(), LoadingState(), AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter (+37 more)

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
Cohesion: 0.15
Nodes (23): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+15 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "CollectionSyncer"
Cohesion: 0.09
Nodes (10): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, rebaseEdit(), countedShift() (+2 more)

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

### Community 65 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (13): ScheduleValidator, DR_PEDS, ENT, FULL, PEDS, RULES, LATE, schedule (+5 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "HistoryView.tsx"
Cohesion: 0.18
Nodes (24): shiftTargetName(), VersionRoster(), DeleteVersionModal(), DeleteVersionModalProps, plural(), CHANGE_LABELS, CHANGE_TONES, VersionCompareModal() (+16 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+13 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "useDialogA11y"
Cohesion: 0.12
Nodes (15): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+7 more)

### Community 77 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 78 - "holidayLeave.ts"
Cohesion: 0.18
Nodes (14): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+6 more)

### Community 79 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 80 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+14 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "IRepository.ts"
Cohesion: 0.23
Nodes (9): FirebaseClientConfig, SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList(), PageRequest, CollectionName (+1 more)

### Community 84 - "makeNurse"
Cohesion: 0.08
Nodes (28): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), SENIOR, LATE, run() (+20 more)

### Community 85 - "PublishView.tsx"
Cohesion: 0.11
Nodes (32): EmailHtmlPreview(), PublishModal(), Step, ResumePublish(), Card(), PublishView(), SENDS_PER_PAGE, SentTab (+24 more)

### Community 86 - "formatDayDate"
Cohesion: 0.13
Nodes (18): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), allowanceFor(), Kind, takesAllowance(), decisionTitle() (+10 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 89 - "types/index.ts"
Cohesion: 0.06
Nodes (33): CellChoice, accessStatusWord(), accessWords(), roleWords(), isPairing(), PREFERENCE_FOCUS_LABELS, KIND_LABELS, FIELDS (+25 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (17): Card(), DashboardView(), loadPlannerData(), PlannerData, readStoredId(), TodayList(), ViewerData, addDays() (+9 more)

### Community 91 - "ClinicContextState"
Cohesion: 0.10
Nodes (26): AppContext, AppContextValue, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+18 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "MyRosterView.tsx"
Cohesion: 0.21
Nodes (12): LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), dayMonth(), formatRosterAsText(), nurseCalendarUrl() (+4 more)

### Community 94 - "scheduleRanges.ts"
Cohesion: 0.40
Nodes (9): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+1 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "dialogs.tsx"
Cohesion: 0.20
Nodes (15): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+7 more)

### Community 98 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (24): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useLatestCallback(), RosterDayView(), RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), useRosterChecks() (+16 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+5 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "apiApp.ts"
Cohesion: 0.16
Nodes (12): express, @google/genai, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "usePresence.ts"
Cohesion: 0.48
Nodes (5): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence()

### Community 111 - "PublishedRosterSheet.tsx"
Cohesion: 0.24
Nodes (7): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), weekdayOf(), RosterPublishService, TeamRosterSheet, safeColor()

### Community 112 - "yearToDate.ts"
Cohesion: 0.14
Nodes (18): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), computeYearToDate() (+10 more)

### Community 113 - "EntityForCollection"
Cohesion: 0.36
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 114 - "nurseList.test.ts"
Cohesion: 0.32
Nodes (4): filterNurses(), nurseCounts(), NurseFilters, nurses

### Community 115 - "FillDialog.tsx"
Cohesion: 0.17
Nodes (15): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, FillRange, moreMenuItems() (+7 more)

### Community 116 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (34): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+26 more)

### Community 118 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.10
Nodes (18): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, NSC Clinic Roster: complete project guide (+10 more)

### Community 120 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+15 more)

### Community 121 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (5): addLeaveGuard(), Guard, guards, isChanged(), leaveReason()

### Community 124 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 125 - "publicRosterService.ts"
Cohesion: 0.31
Nodes (6): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), deleteEntireSchedule(), ScheduleDeleteResult

### Community 126 - "ref_node_assert"
Cohesion: 0.08
Nodes (18): computeScheduleDiff(), BACKUPS_KEPT, MONTHS, suggestRosterName(), ctx(), EARLY, LATE, diff() (+10 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 129 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "react"
Cohesion: 0.11
Nodes (28): lucide-react, react, LocalModeBannerProps, PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES (+20 more)

### Community 134 - "versionKinds.test.ts"
Cohesion: 0.25
Nodes (7): all, backup, lastYear, none, published, saved, v()

### Community 136 - "PublishedRosterView.tsx"
Cohesion: 0.33
Nodes (9): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+1 more)

### Community 138 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 151 - "Sidebar.tsx"
Cohesion: 0.31
Nodes (10): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar(), SidebarProps (+2 more)

### Community 152 - "GridStatusBar.tsx"
Cohesion: 0.29
Nodes (7): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), GridStatusBar(), SelectionView(), render()

### Community 155 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 156 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 157 - "address.ts"
Cohesion: 0.38
Nodes (5): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS

### Community 158 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

## Knowledge Gaps
- **1010 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1005 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1229 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `rowsInSteps.ts`, `AvailabilityView.tsx`, `Field`, `PublishedRosterView.tsx`, `package.json`, `WorkbookGrid.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `Sidebar.tsx`, `GridStatusBar.tsx`, `GridTable.tsx`, `WhoCanCover.tsx`, `PlannerSample.tsx`, `ui.tsx`, `usePhoneLayout.ts`, `access.ts`, `formatDate`, `Button`, `Assignment`, `getRepository`, `AppShell.tsx`, `HistoryView.tsx`, `useDialogA11y`, `makeNurse`, `PublishView.tsx`, `DashboardView.tsx`, `ClinicContextState`, `harness/main.tsx`, `MyRosterView.tsx`, `dialogs.tsx`, `SchedulesView.tsx`, `usePresence.ts`, `PublishedRosterSheet.tsx`, `FillDialog.tsx`, `NSC Clinic Roster: complete project guide`, `RulesTab.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `AvailabilityView.tsx`, `Field`, `PublishedRosterView.tsx`, `package.json`, `WorkbookGrid.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `Sidebar.tsx`, `GridStatusBar.tsx`, `GridTable.tsx`, `PlannerSample.tsx`, `ui.tsx`, `access.ts`, `formatDate`, `Button`, `Assignment`, `getRepository`, `AppShell.tsx`, `HistoryView.tsx`, `PublishView.tsx`, `DashboardView.tsx`, `ClinicContextState`, `harness/main.tsx`, `MyRosterView.tsx`, `dialogs.tsx`, `SchedulesView.tsx`, `PublishedRosterSheet.tsx`, `FillDialog.tsx`, `RulesTab.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 118 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 118 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1010 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07175141242937853 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09181365897783808 - nodes in this community are weakly interconnected._