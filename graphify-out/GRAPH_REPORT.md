# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 408 files · ~425,379 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2920 nodes · 9973 edges · 163 communities (135 shown, 28 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 428 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74893a46`
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
- lastResort.test.ts
- seedRunner.ts
- access.ts
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- emailService.ts
- devDependencies
- GridTable.tsx
- quick reference
- decisionEmail.test.ts
- doctorScheduleService.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- authService.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- EmailTab.tsx
- emailLogSize.ts
- RulesTab.tsx
- Optimization Patterns
- Assignment
- PublishView.tsx
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- assignmentChecks.ts
- firestore-rules/package.json
- AvailabilityView.tsx
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
- guide-with-code.mjs
- dialogs.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- doctorWeekChange.test.ts
- published-rules.mjs
- usePresence.ts
- apiApp.ts
- links.cjs
- icsExportService.ts
- VersionCompareModal.tsx
- makeNurse
- nurseForm.ts
- cellView.test.ts
- UI overhaul: summary and next steps
- 16. History of work (for context)
- types/index.ts
- DashboardView.tsx
- dateDefaults.ts
- harness/main.tsx
- nurseRosterService.ts
- nurseRoster.test.ts
- Finish a change
- Rules
- handMoves.test.ts
- createLiveReconciler
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- geminiApi.test.ts
- start.sh
- stop.sh
- Rules
- grid-keys.cjs
- scheduleTransactions.test.ts
- PublishedRosterView.tsx
- authorizedFetch
- AppContext.tsx
- FirestoreRepository
- analysisExport.test.ts
- leaveImport.test.ts
- IRepository.ts
- peopleImport.ts
- UI overhaul: checklist
- NSC Clinic Roster: complete project guide
- usePhoneLayout.ts
- checkScheduler.test.ts
- approvedDayOff.test.ts
- TopBar.tsx
- savingSafety.test.ts
- 12. Publishing and nurse links
- ref_node_assert
- grid-timing.cjs
- leaveImport.ts
- myRequests.ts
- scheduleRanges.ts
- my-requests.cjs
- RosterGrid
- react
- leaveAllowance.test.ts
- DoctorsView.tsx
- rowsInSteps.ts
- allowance.cjs
- public-pages.cjs
- publicRosterService.ts
- nurse-editor.cjs
- history.cjs
- nurse-page.cjs
- WhoCanCover.tsx
- form-dialogs.cjs
- grid-flow.cjs
- toolbar.cjs
- PublishLog
- scripts
- leave-grid.cjs
- plain-english-reviewer.md
- decisionEmail.ts
- explainCell.test.ts
- roster-dialogs.cjs
- address.ts
- Review Process
- repositoryManager
- editSaving.test.ts
- publish.cjs
- resume.cjs
- sent-rosters.cjs
- settings-dialogs.cjs
- sheet-tabs.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `16. History of work (for context)` - 115 edges
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

## Communities (163 total, 28 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.08
Nodes (40): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES (+32 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (56): 6. Clinic model (the business rules in plain English), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+48 more)

### Community 2 - "fixtures.ts"
Cohesion: 0.09
Nodes (22): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, LONG, NOV, OCT (+14 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.07
Nodes (25): Browser check, Steps, planner(), history(), D, DOCTORS, DR_X, DUTIES (+17 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (30): useLatestCallback(), VersionCompareModal(), RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), RosterToolbar(), readStoredScheduleId() (+22 more)

### Community 6 - "getRepository"
Cohesion: 0.14
Nodes (49): useAppContext(), confirmDialog(), notify(), SwapManagerModal(), Field(), Input(), AccessManagementPanel(), ClinicTab() (+41 more)

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
Cohesion: 0.06
Nodes (62): 7. Rules, DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), cellLookupsOf() (+54 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.18
Nodes (13): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+5 more)

### Community 14 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 15 - "seedRunner.ts"
Cohesion: 0.14
Nodes (16): toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+8 more)

### Community 16 - "access.ts"
Cohesion: 0.19
Nodes (17): 3. Users, roles and access, 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar() (+9 more)

### Community 17 - "IRepository"
Cohesion: 0.16
Nodes (16): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments() (+8 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (24): jose, AuthUser, Express, Request, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken() (+16 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.12
Nodes (24): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+16 more)

### Community 22 - "App.tsx"
Cohesion: 0.12
Nodes (14): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+6 more)

### Community 23 - "emailService.ts"
Cohesion: 0.29
Nodes (7): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SMTP_CONNECTION_KEYS, withoutConnectionSettings()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "GridTable.tsx"
Cohesion: 0.06
Nodes (45): CellView, problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL, useCellFlags() (+37 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.13
Nodes (15): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+7 more)

### Community 28 - "doctorScheduleService.ts"
Cohesion: 0.26
Nodes (15): 13. Screens in detail, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), nextDay() (+7 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.08
Nodes (44): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday(), planHolidayLeaveTidy() (+36 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "authService.ts"
Cohesion: 0.13
Nodes (22): AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps (+14 more)

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
Cohesion: 0.29
Nodes (8): nodemailer, EmailTab(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), configured, live, v()

### Community 38 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 39 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+15 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.10
Nodes (85): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps (+77 more)

### Community 42 - "PublishView.tsx"
Cohesion: 0.31
Nodes (9): EmailHtmlPreview(), ResumePublish(), PublishView(), SENDS_PER_PAGE, SentTab, nurseLinkUrl(), cache(), cachedEmailSettings() (+1 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.14
Nodes (20): ServerEmailConfig, EmailTabProps, findStoppedPublish(), isDone(), isResumable(), lastNews(), overallSendStatus(), planResume() (+12 more)

### Community 46 - "assignmentChecks.ts"
Cohesion: 0.11
Nodes (29): Other engine files, checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween(), shiftDate(), checkSwap() (+21 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.09
Nodes (46): Switch(), ErrorState(), LoadingState(), Tabs(), AllRequestsPanel(), Draft, KindFilter, STATUS (+38 more)

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

### Community 55 - "EntityForCollection"
Cohesion: 0.12
Nodes (5): applyHolidayChangeToLeave(), saveHolidayLeave(), CollectionSyncer, saveDoctorSessions(), EntityForCollection

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
Cohesion: 0.09
Nodes (13): FLOAT_ROLE_ID, SchedulingEngine, JUNIOR, LEVELS, NC, PHL, CARD, EARLY (+5 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "HistoryView.tsx"
Cohesion: 0.15
Nodes (31): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), DeleteVersionModalProps, plural(), VersionViewModal(), CHANGE_WORDS (+23 more)

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

### Community 73 - "dialogs.tsx"
Cohesion: 0.14
Nodes (21): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+13 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.18
Nodes (10): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+2 more)

### Community 77 - "doctorWeekChange.test.ts"
Cohesion: 0.11
Nodes (13): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, LATE (+5 more)

### Community 78 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 79 - "usePresence.ts"
Cohesion: 0.31
Nodes (6): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), now

### Community 80 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+4 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.22
Nodes (15): RFC-5545, calendarRouter, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact() (+7 more)

### Community 83 - "VersionCompareModal.tsx"
Cohesion: 0.16
Nodes (21): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, CHANGE_LABELS, CHANGE_TONES, AuditTrailView() (+13 more)

### Community 84 - "makeNurse"
Cohesion: 0.18
Nodes (14): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account(), doctorOfAmy() (+6 more)

### Community 85 - "nurseForm.ts"
Cohesion: 0.31
Nodes (6): checkNurseForm(), movePreference(), nextEmployeeCode(), NurseFormErrors, NurseFormValues, others

### Community 86 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "16. History of work (for context)"
Cohesion: 0.15
Nodes (17): 11. Saving, live updates, versions, 16. History of work (for context), firstDayShown(), isPhoneSize(), RosterDayView(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs() (+9 more)

### Community 89 - "types/index.ts"
Cohesion: 0.07
Nodes (30): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, BlockWeeks, DoctorSessionSource, Invitation (+22 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (25): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+17 more)

### Community 91 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (22): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterView(), MyRosterViewProps, downloadIcsFile(), MyDay, myShiftDays() (+14 more)

### Community 94 - "nurseRoster.test.ts"
Cohesion: 0.18
Nodes (12): documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs(), NURSE_TOKEN_PATTERN (+4 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

### Community 98 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

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

### Community 104 - "geminiApi.test.ts"
Cohesion: 0.16
Nodes (11): express, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights() (+3 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "scheduleTransactions.test.ts"
Cohesion: 0.12
Nodes (9): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS, apps, { initializeTestEnvironment } (+1 more)

### Community 110 - "PublishedRosterView.tsx"
Cohesion: 0.32
Nodes (8): PublicMessage(), PublicPageFrame(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, withoutBackups(), loadPublicRoster()

### Community 111 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 112 - "AppContext.tsx"
Cohesion: 0.18
Nodes (10): AppContext, AppContextValue, Permissions, ProblemCount, problemCountWords(), ProblemTally, frame, november (+2 more)

### Community 114 - "analysisExport.test.ts"
Cohesion: 0.14
Nodes (13): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+5 more)

### Community 115 - "leaveImport.test.ts"
Cohesion: 0.18
Nodes (10): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, The Five-Axis Review, AL, data() (+2 more)

### Community 116 - "IRepository.ts"
Cohesion: 0.18
Nodes (12): Desired, Known, SyncPlan, FirebaseClientConfig, SubscribeCallback, Unsubscribe, listPage(), Page (+4 more)

### Community 117 - "peopleImport.ts"
Cohesion: 0.25
Nodes (9): cellsOf(), DoctorImportRow, NurseImportRow, readDoctorRows(), readNurseRows(), WEEKDAYS, levels, nurses (+1 more)

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.14
Nodes (13): fingerprint(), planSync(), rebaseEdit(), Phase 0: setup, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails (+5 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 120 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 121 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "TopBar.tsx"
Cohesion: 0.29
Nodes (5): signOutSafely(), AccountMenu(), TopBar(), TopBarProps, rosterSaveQueues

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, queuesByRepo, RETRY_EVERY_MS, STAMP_EVERY_MS

### Community 125 - "12. Publishing and nurse links"
Cohesion: 0.14
Nodes (10): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before, 12. Publishing and nurse links, ensureNurseLink(), newToken(), regenerateNurseLink() (+2 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.09
Nodes (18): computeScheduleDiff(), formatAssignment(), addDays(), iso(), monthEnd(), suggestNewRosterDates(), MONTHS, suggestRosterName() (+10 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "leaveImport.ts"
Cohesion: 0.31
Nodes (7): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), parseDayMonthYear(), leaves, pins

### Community 129 - "myRequests.ts"
Cohesion: 0.29
Nodes (9): checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors, leaveStatus(), MyRequest, myRequestList(), range() (+1 more)

### Community 130 - "scheduleRanges.ts"
Cohesion: 0.40
Nodes (9): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+1 more)

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 133 - "react"
Cohesion: 0.09
Nodes (56): lucide-react, react, LocalModeBanner(), LocalModeBannerProps, CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps (+48 more)

### Community 134 - "leaveAllowance.test.ts"
Cohesion: 0.31
Nodes (6): allowanceFor(), Kind, takesAllowance(), AL, DAY_OFF, SICK

### Community 135 - "DoctorsView.tsx"
Cohesion: 0.13
Nodes (35): uuid, NoticeTone, BulkImportModal(), WeekChangePreview, ShareModal(), ShareModalProps, TemplateModal(), IconButton() (+27 more)

### Community 136 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 139 - "publicRosterService.ts"
Cohesion: 0.31
Nodes (5): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), ScheduleDeleteResult

### Community 143 - "WhoCanCover.tsx"
Cohesion: 0.53
Nodes (5): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, NurseDayExplanation

### Community 147 - "PublishLog"
Cohesion: 0.33
Nodes (7): emailKindLabel(), KIND_LABELS, sendResult, EmailLogKind, PublishLog, log(), rec()

### Community 148 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 151 - "decisionEmail.ts"
Cohesion: 0.46
Nodes (6): decisionEmail(), DecisionEmailInput, oneLine(), what(), when(), escapeHtml()

### Community 152 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 154 - "address.ts"
Cohesion: 0.38
Nodes (5): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS

### Community 155 - "Review Process"
Cohesion: 0.33
Nodes (6): Review Process, Step 1: Understand the Context, Step 2: Review the Tests First, Step 3: Review the Implementation, Step 4: Categorize Findings, Step 5: Verify the Verification

## Knowledge Gaps
- **992 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+987 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1208 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `fixtures.ts`, `SchedulesView.tsx`, `getRepository`, `DoctorsView.tsx`, `rowsInSteps.ts`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `WhoCanCover.tsx`, `access.ts`, `NurseSample.tsx`, `App.tsx`, `GridTable.tsx`, `doctorScheduleService.ts`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `EmailTab.tsx`, `RulesTab.tsx`, `Assignment`, `PublishView.tsx`, `AvailabilityView.tsx`, `AppShell.tsx`, `HistoryView.tsx`, `dialogs.tsx`, `usePresence.ts`, `VersionCompareModal.tsx`, `16. History of work (for context)`, `DashboardView.tsx`, `harness/main.tsx`, `nurseRosterService.ts`, `PublishedRosterView.tsx`, `AppContext.tsx`, `NSC Clinic Roster: complete project guide`, `usePhoneLayout.ts`, `TopBar.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `SchedulesView.tsx`, `getRepository`, `DoctorsView.tsx`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `access.ts`, `NurseSample.tsx`, `App.tsx`, `GridTable.tsx`, `doctorScheduleService.ts`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `EmailTab.tsx`, `RulesTab.tsx`, `Assignment`, `PublishView.tsx`, `AvailabilityView.tsx`, `AppShell.tsx`, `HistoryView.tsx`, `dialogs.tsx`, `VersionCompareModal.tsx`, `16. History of work (for context)`, `DashboardView.tsx`, `harness/main.tsx`, `nurseRosterService.ts`, `PublishedRosterView.tsx`, `TopBar.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Are the 114 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 114 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _992 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09623015873015874 - nodes in this community are weakly interconnected._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08846153846153847 - nodes in this community are weakly interconnected._