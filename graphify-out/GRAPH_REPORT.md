# Graph Report - NSC-Clinic-Roster  (2026-11-03)

## Corpus Check
- 428 files · ~437,443 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3013 nodes · 10384 edges · 156 communities (126 shown, 30 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 439 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a055e76f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- DashboardView.tsx
- clinicModel.test.ts
- authService
- GridTable.tsx
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- dayView.test.ts
- apiApp.ts
- seedRunner.ts
- FairnessModal.tsx
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- App.tsx
- emailService.ts
- devDependencies
- gridSelection.ts
- quick reference
- decisionEmail.test.ts
- 16. History of work (for context)
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- authService.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- nurseRosterService.ts
- Optimization Patterns
- Assignment
- EntityForCollection
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- lucide-react
- firestore-rules/package.json
- staffRequestService.ts
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- dialogs.tsx
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- navigation.ts
- Planning and Task Breakdown
- Find Skills
- ClinicContextState
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- fakeAuth.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- GridSelection
- holidayLeave.ts
- createApiApp
- handMoves.test.ts
- links.cjs
- nurseRoster.test.ts
- cellView.test.ts
- makeNurse
- LiveCollectionCache
- MyRosterView.tsx
- UI overhaul: summary and next steps
- usePresence.ts
- types/index.ts
- teamRoster.test.ts
- IRepository.ts
- harness/main.tsx
- editSaving.test.ts
- scheduleRanges.ts
- Finish a change
- Rules
- nurseClinicFloat.test.ts
- RosterSteps.tsx
- context7
- ref_playwright
- firestore-rules-reviewer.md
- SchedulingEngine
- firebase-mcp.sh
- geminiApi.test.ts
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- fixtures.ts
- savingSafety.test.ts
- preferenceFocus.test.ts
- yearToDate.ts
- FirestoreRepository
- HistoryView.tsx
- RosterToolbar.tsx
- nurseList.test.ts
- peopleImport.ts
- doctorWeekChange.test.ts
- NSC Clinic Roster: complete project guide
- AvailabilityView.tsx
- RosterGrid
- approvedDayOff.test.ts
- leaveGuard.ts
- quotaTracker
- ref_node_assert
- grid-timing.cjs
- scripts
- rowsInSteps.ts
- checkScheduler.test.ts
- my-requests.cjs
- request-clinic-dialogs.cjs
- react
- requests.cjs
- allowance.cjs
- grid-keys.cjs
- data-backup.cjs
- roster-dialogs.cjs
- nurse-editor.cjs
- nurse-page.cjs
- nurses-list.cjs
- form-dialogs.cjs
- history.cjs
- toolbar.cjs
- sent-rosters.cjs
- settings-save.cjs
- leave-grid.cjs
- plain-english-reviewer.md
- your-access.cjs
- roster-editing-dialogs.cjs
- access.cjs
- grid-flow.cjs
- lastResort.test.ts
- usePhoneLayout.ts
- resume.cjs
- time-periods.cjs

## God Nodes (most connected - your core abstractions)
1. `16. History of work (for context)` - 123 edges
2. `react` - 120 edges
3. `Assignment` - 112 edges
4. `Nurse` - 106 edges
5. `getRepository()` - 99 edges
6. `DutyWindow` - 94 edges
7. `Button()` - 93 edges
8. `Schedule` - 92 edges
9. `formatDate()` - 92 edges
10. `lucide-react` - 89 edges

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

## Communities (156 total, 30 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (62): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps (+54 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.06
Nodes (66): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+58 more)

### Community 2 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (22): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+14 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (6): authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "GridTable.tsx"
Cohesion: 0.15
Nodes (28): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+20 more)

### Community 6 - "getRepository"
Cohesion: 0.11
Nodes (62): useAppContext(), confirmDialog(), notify(), PublishModal(), TemplateModal(), Checkbox(), Field(), Input() (+54 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.06
Nodes (65): 7. Rules, DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), cellLookupsOf() (+57 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "dayView.test.ts"
Cohesion: 0.20
Nodes (8): firstDayShown(), isPhoneSize(), amy, LEE, lookups, mary, nina, shift

### Community 14 - "apiApp.ts"
Cohesion: 0.14
Nodes (14): express, express-rate-limit, helmet, authMiddleware(), BackendRole, Express, Request, requireOwner (+6 more)

### Community 15 - "seedRunner.ts"
Cohesion: 0.14
Nodes (15): countOf(), SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+7 more)

### Community 16 - "FairnessModal.tsx"
Cohesion: 0.14
Nodes (22): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, uuid, NONE, NurseFairnessMetrics, ProposedSwap (+14 more)

### Community 17 - "IRepository"
Cohesion: 0.12
Nodes (18): saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (22): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+14 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.18
Nodes (22): BarList(), hours(), Meter(), METER_FILL, plural(), ReportsView(), Stat(), calculateClinicHoursMetrics() (+14 more)

### Community 22 - "App.tsx"
Cohesion: 0.11
Nodes (19): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+11 more)

### Community 23 - "emailService.ts"
Cohesion: 0.19
Nodes (12): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+4 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "gridSelection.ts"
Cohesion: 0.12
Nodes (18): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf() (+10 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.11
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+12 more)

### Community 28 - "16. History of work (for context)"
Cohesion: 0.22
Nodes (13): 16. History of work (for context), CellChoice, GridCell, moveInGrid(), pickStep(), AssignmentKind, addDays(), DateRange (+5 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.13
Nodes (25): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+17 more)

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
Cohesion: 0.11
Nodes (26): 3. Users, roles and access, LoginPageProps, signOutSafely(), usePermissions(), AppShellProps, AccountMenu(), TopBar(), TopBarProps (+18 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.05
Nodes (42): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+34 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.09
Nodes (56): useLatestCallback(), CreateScheduleModal(), DeleteScheduleModal(), FairnessModal(), ShareModal(), SwapManagerModal(), ResumePublish(), FillDialog() (+48 more)

### Community 39 - "nurseRosterService.ts"
Cohesion: 0.18
Nodes (15): ClinicTabProps, BuildNurseRosterInput, dayMonth(), formatRosterAsText(), NURSE_ROSTER_LOOKBACK_DAYS, nurseCalendarUrl(), nurseWebcalUrl(), origin() (+7 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.10
Nodes (90): RFC-5545, 5. Data model (Firestore collections), VersionRosterProps, WEEKDAY_NAMES, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps (+82 more)

### Community 42 - "EntityForCollection"
Cohesion: 0.11
Nodes (11): 11. Saving, live updates, versions, forgetCachedRoster(), saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, SyncPlan (+3 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.06
Nodes (45): authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus (+37 more)

### Community 46 - "lucide-react"
Cohesion: 0.17
Nodes (26): lucide-react, BulkImportModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, DateInput() (+18 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.09
Nodes (45): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter, ApprovalsQueuePanel(), Waiting (+37 more)

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
Cohesion: 0.10
Nodes (32): dialogsChanged(), useDialogA11y(), AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+24 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "dialogs.tsx"
Cohesion: 0.17
Nodes (17): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+9 more)

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

### Community 65 - "navigation.ts"
Cohesion: 0.29
Nodes (10): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps (+2 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "ClinicContextState"
Cohesion: 0.11
Nodes (22): AppContext, AppContextValue, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+14 more)

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

### Community 73 - "fakeAuth.ts"
Cohesion: 0.15
Nodes (9): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, planner(), history() (+1 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 77 - "GridSelection"
Cohesion: 0.15
Nodes (3): GridSelection, cellKeyOf(), useGridSelection()

### Community 78 - "holidayLeave.ts"
Cohesion: 0.28
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday() (+4 more)

### Community 79 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 80 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "nurseRoster.test.ts"
Cohesion: 0.14
Nodes (15): buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), nurseShiftUid(), shortHash() (+7 more)

### Community 83 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 84 - "makeNurse"
Cohesion: 0.11
Nodes (25): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+17 more)

### Community 85 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 86 - "MyRosterView.tsx"
Cohesion: 0.33
Nodes (6): LoadState, MyRosterViewProps, MyDay, myShiftDays(), NurseRosterDoc, NurseRosterShift

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "usePresence.ts"
Cohesion: 0.31
Nodes (6): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), now

### Community 89 - "types/index.ts"
Cohesion: 0.07
Nodes (30): RuleDef, isPairing(), PREFERENCE_FOCUS_LABELS, KIND_LABELS, FIELDS, rebaseRules(), ruleChanges(), same() (+22 more)

### Community 90 - "teamRoster.test.ts"
Cohesion: 0.20
Nodes (13): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), addDaysIso(), buildTeamRosterSheet(), syncNurseRosters(), weekdayOf(), safeColor() (+5 more)

### Community 91 - "IRepository.ts"
Cohesion: 0.25
Nodes (9): FirebaseClientConfig, SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList(), PageRequest, CollectionName (+1 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "editSaving.test.ts"
Cohesion: 0.12
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 94 - "scheduleRanges.ts"
Cohesion: 0.40
Nodes (9): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+1 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 98 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): args, { chromium }, args, { chromium }, { chromium }, args, { chromium }, args (+5 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "SchedulingEngine"
Cohesion: 0.08
Nodes (17): SchedulingEngine, DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS (+9 more)

### Community 104 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "fixtures.ts"
Cohesion: 0.07
Nodes (27): EARLY, input(), LATE, softHoursLimit, week, ANNUAL_LEAVE, DAY_DUTY, makeLeave() (+19 more)

### Community 110 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (11): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS (+3 more)

### Community 111 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 112 - "yearToDate.ts"
Cohesion: 0.23
Nodes (14): isLateDuty(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster, loadPublishedRoster() (+6 more)

### Community 113 - "FirestoreRepository"
Cohesion: 0.28
Nodes (3): FirestoreRepository, sanitizePayload(), toScheduleRange()

### Community 114 - "HistoryView.tsx"
Cohesion: 0.10
Nodes (52): EmailHtmlPreview(), shiftTargetName(), VersionRoster(), DeleteVersionModal(), plural(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS (+44 more)

### Community 115 - "RosterToolbar.tsx"
Cohesion: 0.24
Nodes (10): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbarProps (+2 more)

### Community 116 - "nurseList.test.ts"
Cohesion: 0.32
Nodes (4): filterNurses(), nurseCounts(), NurseFilters, nurses

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (34): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+26 more)

### Community 118 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 120 - "AvailabilityView.tsx"
Cohesion: 0.24
Nodes (12): NoticeTone, Switch(), AvailabilityView(), WEEKDAY_ABBR, canEditClinicData(), contrastRatio(), INK, INK_MUTED (+4 more)

### Community 121 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 124 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 126 - "ref_node_assert"
Cohesion: 0.08
Nodes (19): BACKUPS_KEPT, addDays(), iso(), monthEnd(), suggestNewRosterDates(), MONTHS, suggestRosterName(), ctx() (+11 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 129 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 130 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "react"
Cohesion: 0.07
Nodes (49): react, LocalModeBanner(), LocalModeBannerProps, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), PROBLEM_MARKS, ProblemBadge() (+41 more)

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 155 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (12): ScheduleValidator, DR_PEDS, ENT, FULL, PEDS, RULES, LATE, schedule (+4 more)

### Community 158 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

## Knowledge Gaps
- **1018 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1013 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1238 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `rowsInSteps.ts`, `DashboardView.tsx`, `GridTable.tsx`, `getRepository`, `package.json`, `WorkbookGrid.tsx`, `FairnessModal.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `gridSelection.ts`, `PlannerSample.tsx`, `ui.tsx`, `usePhoneLayout.ts`, `authService.ts`, `SchedulesView.tsx`, `Assignment`, `resumePublish.ts`, `lucide-react`, `staffRequestService.ts`, `AppShell.tsx`, `dialogs.tsx`, `navigation.ts`, `ClinicContextState`, `GridSelection`, `MyRosterView.tsx`, `usePresence.ts`, `teamRoster.test.ts`, `harness/main.tsx`, `RosterSteps.tsx`, `fixtures.ts`, `HistoryView.tsx`, `RosterToolbar.tsx`, `NSC Clinic Roster: complete project guide`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `ExportModal.tsx`, `DashboardView.tsx`, `react`, `getRepository`, `GridTable.tsx`, `package.json`, `WorkbookGrid.tsx`, `FairnessModal.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `SchedulesView.tsx`, `Assignment`, `resumePublish.ts`, `staffRequestService.ts`, `AppShell.tsx`, `dialogs.tsx`, `navigation.ts`, `MyRosterView.tsx`, `teamRoster.test.ts`, `harness/main.tsx`, `RosterSteps.tsx`, `HistoryView.tsx`, `RosterToolbar.tsx`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 122 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 122 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1018 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06768388106416276 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060527825588066554 - nodes in this community are weakly interconnected._