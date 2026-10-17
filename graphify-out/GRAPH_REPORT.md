# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 399 files · ~418,488 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2878 nodes · 9770 edges · 154 communities (130 shown, 24 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 414 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c3cdf15c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- peopleImport.test.ts
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
- access.ts
- IRepository
- firebaseIdentityService.ts
- index.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- emailPublishing.test.ts
- devDependencies
- gridSelection.ts
- quick reference
- decisionEmail.test.ts
- doctorScheduleService.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- ClinicContextState
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- versionKinds.test.ts
- nurseRosterService.ts
- RulesTab.tsx
- Optimization Patterns
- Assignment
- Sidebar.tsx
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- SchedulingEngine.ts
- firestore-rules/package.json
- AvailabilityView.tsx
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
- authService.ts
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
- GridSelection
- usePresence.ts
- apiApp.ts
- links.cjs
- icsExportService.ts
- colorContrast.ts
- makeNurse
- nurseForm.ts
- cellView.test.ts
- UI overhaul: summary and next steps
- createApiApp
- types/index.ts
- DashboardView.tsx
- 16. History of work (for context)
- harness/main.tsx
- MyRosterView.tsx
- handMoveChecks.ts
- Finish a change
- Rules
- handMoves.test.ts
- useDialogA11y
- context7
- doctors.cjs
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- geminiApi.test.ts
- start.sh
- stop.sh
- Rules
- grid-keys.cjs
- LiveCollectionCache
- PublishedRosterView.tsx
- EmailTab.tsx
- nurseClinicFloat.test.ts
- Button
- analysisExport.test.ts
- holidayLeave.ts
- quotaTracker
- explainCell.test.ts
- UI overhaul: checklist
- NSC Clinic Roster: complete project guide
- dayView.test.ts
- checkScheduler.test.ts
- approvedDayOff.test.ts
- scripts
- savingSafety.test.ts
- fakeAuth.ts
- ref_node_assert
- grid-timing.cjs
- ddmmyyyy
- newRosterDates.ts
- settings-dialogs.cjs
- my-requests.cjs
- usePhoneLayout.ts
- react
- GridTable.tsx
- doctorForm.ts
- rowsInSteps.ts
- allowance.cjs
- public-pages.cjs
- editSaving.test.ts
- nurse-editor.cjs
- ref_playwright
- nurse-page.cjs
- WhoCanCover.tsx
- form-dialogs.cjs
- grid-flow.cjs
- toolbar.cjs
- weekHours.ts
- doctorWeekChange.test.ts
- leave-grid.cjs
- plain-english-reviewer.md
- nurses-list.cjs
- publish.cjs
- roster-dialogs.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 119 edges
2. `Assignment` - 113 edges
3. `16. History of work (for context)` - 110 edges
4. `Nurse` - 104 edges
5. `getRepository()` - 97 edges
6. `DutyWindow` - 95 edges
7. `Schedule` - 92 edges
8. `lucide-react` - 89 edges
9. `formatDate()` - 88 edges
10. `Doctor` - 83 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (154 total, 24 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (33): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift(), exportRosterToCsvLong(), exportRosterToCsvMatrix() (+25 more)

### Community 1 - "peopleImport.test.ts"
Cohesion: 0.33
Nodes (5): cellsOf(), readDoctorRows(), levels, nurses, roles

### Community 2 - "fixtures.ts"
Cohesion: 0.11
Nodes (16): ANNUAL_LEAVE, makeLeave(), UNPAID_LEAVE, LONG, NOV, OCT, D, E (+8 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "SchedulesView.tsx"
Cohesion: 0.10
Nodes (35): uuid, useLatestCallback(), ShareModal(), TemplateModal(), RosterDayView(), RosterPicker(), ROSTER_SHEET_PANEL_ID, RosterSheet (+27 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (49): useAppContext(), confirmDialog(), notify(), Field(), Input(), AccessManagementPanel(), ClinicTab(), ClinicTabProps (+41 more)

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
Cohesion: 0.06
Nodes (56): How a run works, DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), cellLookupsOf() (+48 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.26
Nodes (8): MenuButtonProps, MenuItem, MenuSection, moreMenuItems(), RosterMenuItem, RosterToolbarProps, RegenerateMode, PresenceRecord

### Community 14 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 15 - "seedRunner.ts"
Cohesion: 0.12
Nodes (26): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+18 more)

### Community 16 - "access.ts"
Cohesion: 0.27
Nodes (12): 3. Users, roles and access, usePermissions(), AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canApproveRequests(), canEditClinicData() (+4 more)

### Community 17 - "IRepository"
Cohesion: 0.16
Nodes (17): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+9 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.14
Nodes (21): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+13 more)

### Community 19 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (23): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+15 more)

### Community 22 - "App.tsx"
Cohesion: 0.16
Nodes (11): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 23 - "emailPublishing.test.ts"
Cohesion: 0.13
Nodes (18): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS (+10 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "gridSelection.ts"
Cohesion: 0.13
Nodes (16): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, isRosterCell(), keyOf(), moveSelection() (+8 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.13
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+11 more)

### Community 28 - "doctorScheduleService.ts"
Cohesion: 0.28
Nodes (14): EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate() (+6 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.08
Nodes (49): NurseTimesheetModalProps, ReportsView(), SortField, TabMode, fmtHours(), HoursAccountingSheet(), askedCarry(), closePeriod() (+41 more)

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
Nodes (23): AppContext, AppContextValue, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps, ReportsViewProps (+15 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.05
Nodes (42): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+34 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "versionKinds.test.ts"
Cohesion: 0.25
Nodes (7): all, backup, lastYear, none, published, saved, v()

### Community 38 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (19): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), PublishView(), dayMonth(), ensureNurseLink(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS (+11 more)

### Community 39 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.08
Nodes (101): 5. Data model (Firestore collections), Request, EmailHtmlPreview(), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps (+93 more)

### Community 42 - "Sidebar.tsx"
Cohesion: 0.31
Nodes (10): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar(), SidebarProps (+2 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "FirestoreRepository"
Cohesion: 0.19
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 46 - "SchedulingEngine.ts"
Cohesion: 0.06
Nodes (85): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+77 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.08
Nodes (51): 13. Screens in detail, NoticeTone, Switch(), Textarea(), AllRequestsPanel(), Draft, KindFilter, STATUS (+43 more)

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
Nodes (30): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+22 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "CollectionSyncer"
Cohesion: 0.10
Nodes (13): 11. Saving, live updates, versions, forgetCachedRoster(), saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+5 more)

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

### Community 65 - "authService.ts"
Cohesion: 0.22
Nodes (11): LoginPageProps, signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL (+3 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "HistoryView.tsx"
Cohesion: 0.18
Nodes (26): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), plural(), ExportModal(), VersionViewModal(), EmptyState() (+18 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+13 more)

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
Cohesion: 0.06
Nodes (17): ScheduleValidator, JUNIOR, LEVELS, NC, PHL, SENIOR, DR_PEDS, ENT (+9 more)

### Community 79 - "usePresence.ts"
Cohesion: 0.31
Nodes (6): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), now

### Community 80 - "apiApp.ts"
Cohesion: 0.14
Nodes (15): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+7 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 84 - "makeNurse"
Cohesion: 0.08
Nodes (32): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup() (+24 more)

### Community 85 - "nurseForm.ts"
Cohesion: 0.31
Nodes (6): checkNurseForm(), movePreference(), nextEmployeeCode(), NurseFormErrors, NurseFormValues, others

### Community 86 - "cellView.test.ts"
Cohesion: 0.08
Nodes (17): 15. Tests, CellDay, ctx(), EARLY, LATE, amy, CARDIOLOGY, ENT (+9 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 89 - "types/index.ts"
Cohesion: 0.07
Nodes (27): InternalSlot, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus, BlockWeeks, DoctorSessionSource (+19 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.15
Nodes (26): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+18 more)

### Community 91 - "16. History of work (for context)"
Cohesion: 0.17
Nodes (17): 16. History of work (for context), MenuButton(), menuSections(), CellChoice, DayColumn, ProblemMark, GridCell, moveInGrid() (+9 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "MyRosterView.tsx"
Cohesion: 0.24
Nodes (12): LoadState, MyRosterView(), MyRosterViewProps, downloadIcsFile(), MyDay, myShiftDays(), formatRosterAsText(), nurseCalendarUrl() (+4 more)

### Community 94 - "handMoveChecks.ts"
Cohesion: 0.25
Nodes (14): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, Other engine files, listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings() (+6 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.11
Nodes (14): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+6 more)

### Community 98 - "useDialogA11y"
Cohesion: 0.23
Nodes (11): dialogsChanged(), openListeners, openStack, useDialogA11y(), AuditTrailView(), AuditTrailViewProps, AuditAction, AuditEvent (+3 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.31
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 110 - "PublishedRosterView.tsx"
Cohesion: 0.36
Nodes (8): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, loadPublicRoster()

### Community 111 - "EmailTab.tsx"
Cohesion: 0.22
Nodes (13): EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+5 more)

### Community 112 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 113 - "Button"
Cohesion: 0.15
Nodes (43): BulkImportModal(), CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, FairnessModal(), fmtHours() (+35 more)

### Community 114 - "analysisExport.test.ts"
Cohesion: 0.25
Nodes (8): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift()

### Community 115 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 116 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 117 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 120 - "dayView.test.ts"
Cohesion: 0.20
Nodes (8): firstDayShown(), isPhoneSize(), amy, LEE, lookups, mary, nina, shift

### Community 121 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.11
Nodes (10): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps (+2 more)

### Community 125 - "fakeAuth.ts"
Cohesion: 0.15
Nodes (9): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, planner(), history() (+1 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.08
Nodes (14): BACKUPS_KEPT, MONTHS, suggestRosterName(), diff(), LATE, nurse, AL, DAY_OFF (+6 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 129 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 133 - "react"
Cohesion: 0.10
Nodes (36): lucide-react, react, LocalModeBannerProps, PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES (+28 more)

### Community 134 - "GridTable.tsx"
Cohesion: 0.19
Nodes (24): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+16 more)

### Community 135 - "doctorForm.ts"
Cohesion: 0.23
Nodes (9): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, usualWeekLines(), WEEKDAY_NAMES, WeeklyPatternSlot (+1 more)

### Community 136 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 139 - "editSaving.test.ts"
Cohesion: 0.38
Nodes (5): useRosterEdits(), changedLists(), sameItems(), countedShift(), shift()

### Community 141 - "ref_playwright"
Cohesion: 0.11
Nodes (11): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+3 more)

### Community 143 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 147 - "weekHours.ts"
Cohesion: 0.52
Nodes (6): addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WeekHours, weeksOverLimit()

### Community 148 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **987 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+982 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1202 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `usePhoneLayout.ts`, `SchedulesView.tsx`, `getRepository`, `GridTable.tsx`, `rowsInSteps.ts`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `WhoCanCover.tsx`, `access.ts`, `App.tsx`, `gridSelection.ts`, `doctorScheduleService.ts`, `hoursBalance.ts`, `PlannerSample.tsx`, `ui.tsx`, `ClinicContextState`, `nurseRosterService.ts`, `RulesTab.tsx`, `Assignment`, `Sidebar.tsx`, `AvailabilityView.tsx`, `AppShell.tsx`, `authService.ts`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `usePresence.ts`, `makeNurse`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `useDialogA11y`, `PublishedRosterView.tsx`, `EmailTab.tsx`, `Button`, `NSC Clinic Roster: complete project guide`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `SchedulesView.tsx`, `getRepository`, `GridTable.tsx`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `access.ts`, `App.tsx`, `doctorScheduleService.ts`, `hoursBalance.ts`, `PlannerSample.tsx`, `ui.tsx`, `nurseRosterService.ts`, `RulesTab.tsx`, `Assignment`, `Sidebar.tsx`, `AvailabilityView.tsx`, `AppShell.tsx`, `authService.ts`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `useDialogA11y`, `PublishedRosterView.tsx`, `EmailTab.tsx`, `Button`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `peopleImport.test.ts`, `usePhoneLayout.ts`, `SchedulesView.tsx`, `getRepository`, `react`, `GridTable.tsx`, `rowsInSteps.ts`, `WorkbookGrid.tsx`, `editSaving.test.ts`, `doctorForm.ts`, `RosterToolbar.tsx`, `access.ts`, `IRepository`, `firebaseIdentityService.ts`, `gridSelection.ts`, `ClinicContextState`, `Code Review and Quality`, `Assignment`, `Sidebar.tsx`, `FirestoreRepository`, `SchedulingEngine.ts`, `AvailabilityView.tsx`, `AppShell.tsx`, `CollectionSyncer`, `HistoryView.tsx`, `dialogs.tsx`, `GridSelection`, `usePresence.ts`, `colorContrast.ts`, `nurseForm.ts`, `MyRosterView.tsx`, `useDialogA11y`, `PublishedRosterView.tsx`, `Button`, `NSC Clinic Roster: complete project guide`, `dayView.test.ts`, `checkScheduler.test.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 109 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 109 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _987 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08846153846153847 - nodes in this community are weakly interconnected._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._