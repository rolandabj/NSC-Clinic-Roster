# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 398 files · ~418,035 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2876 nodes · 9762 edges · 148 communities (125 shown, 23 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 414 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9649a657`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- peopleImport.ts
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
- emailService.ts
- devDependencies
- gridSelection.ts
- quick reference
- requests.ts
- NurseSelfServicePanel.tsx
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- ClinicContextState
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- decisionEmail.test.ts
- nurseRosterService.ts
- RulesTab.tsx
- Optimization Patterns
- Assignment
- navigation.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- SchedulingEngine.ts
- firestore-rules/package.json
- FairnessModal.tsx
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
- doctorWeekChange.test.ts
- GridSelection
- usePresence.ts
- engineRules.test.ts
- links.cjs
- icsExportService.ts
- colorContrast.ts
- makeNurse
- nurseForm.ts
- cellView.test.ts
- UI overhaul: summary and next steps
- apiApp.ts
- types/index.ts
- DashboardView.tsx
- dateDefaults.ts
- harness/main.tsx
- hoursRules.test.ts
- PublishModal.tsx
- Finish a change
- Rules
- handMoves.test.ts
- useDialogA11y
- context7
- doctors.cjs
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- PublishModal
- start.sh
- stop.sh
- Rules
- grid-keys.cjs
- LiveCollectionCache
- PublishedRosterView.tsx
- EmailTab.tsx
- nurseClinicFloat.test.ts
- Button
- createLiveReconciler
- holidayLeave.ts
- quotaTracker
- address.ts
- UI overhaul: checklist
- NSC Clinic Roster: complete project guide
- dayView.test.ts
- 16. History of work (for context)
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
- ui/index.ts
- GridTable.tsx
- doctorForm.ts
- rowsInSteps.ts
- allowance.cjs
- public-pages.cjs
- history.cjs
- nurse-editor.cjs
- ref_playwright
- nurse-page.cjs
- roster-editing-dialogs.cjs
- form-dialogs.cjs
- grid-flow.cjs
- toolbar.cjs
- leave-grid.cjs

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

## Communities (148 total, 23 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (50): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps, fmtHours(), HoursAccountingSheet() (+42 more)

### Community 1 - "peopleImport.ts"
Cohesion: 0.40
Nodes (5): cellsOf(), DoctorImportRow, NurseImportRow, readDoctorRows(), WEEKDAYS

### Community 2 - "fixtures.ts"
Cohesion: 0.06
Nodes (33): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+25 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.08
Nodes (24): Steps, planner(), history(), D, DOCTORS, DR_X, DUTIES, E (+16 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (6): authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "SchedulesView.tsx"
Cohesion: 0.09
Nodes (37): Report, What to check, What to look at, react, useLatestCallback(), CreateScheduleModal(), DeleteScheduleModal(), ROSTER_SHEET_PANEL_ID (+29 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (53): confirmDialog(), notify(), NONE, SwapManagerModal(), Checkbox(), Field(), Input(), AccessManagementPanel() (+45 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (24): firebase, name, private, type, version, autoprefixer, cors, date-fns (+16 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (44): DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), cellLookupsOf(), cellSummary() (+36 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.24
Nodes (11): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+3 more)

### Community 14 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 15 - "seedRunner.ts"
Cohesion: 0.13
Nodes (24): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+16 more)

### Community 16 - "access.ts"
Cohesion: 0.24
Nodes (13): 3. Users, roles and access, signOutSafely(), usePermissions(), AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canApproveRequests() (+5 more)

### Community 17 - "IRepository"
Cohesion: 0.12
Nodes (26): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+18 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.12
Nodes (21): authMiddleware(), AuthUser, Express, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken(), emailRouter (+13 more)

### Community 19 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.14
Nodes (20): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+12 more)

### Community 22 - "App.tsx"
Cohesion: 0.16
Nodes (11): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 23 - "emailService.ts"
Cohesion: 0.23
Nodes (10): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS, withoutConnectionSettings() (+2 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "gridSelection.ts"
Cohesion: 0.10
Nodes (23): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf() (+15 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "requests.ts"
Cohesion: 0.11
Nodes (23): calendarRouter, COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload (+15 more)

### Community 28 - "NurseSelfServicePanel.tsx"
Cohesion: 0.15
Nodes (24): 13. Screens in detail, NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors (+16 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (34): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), hoursHistoryOverlaps(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+26 more)

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
Cohesion: 0.12
Nodes (21): AppContext, AppContextValue, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+13 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.05
Nodes (42): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+34 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (16): emailDecision(), cache(), cachedEmailSettings(), loadEmailSettings(), decidedAt, editor, manager, NOW (+8 more)

### Community 38 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (23): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterViewProps, MyDay, myShiftDays(), dayMonth(), formatRosterAsText() (+15 more)

### Community 39 - "RulesTab.tsx"
Cohesion: 0.06
Nodes (49): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, Other engine files, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS (+41 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.13
Nodes (72): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps (+64 more)

### Community 42 - "navigation.ts"
Cohesion: 0.30
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
Nodes (84): 6. Clinic model (the business rules in plain English), 7. Rules, How a run works, FillDialogProps, checkAssignment(), hardRule(), minutes(), restHoursBetween() (+76 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "FairnessModal.tsx"
Cohesion: 0.10
Nodes (38): NONE, ProposedSwap, fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, Column, DataTable() (+30 more)

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
Cohesion: 0.16
Nodes (4): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, EntityForCollection

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
Cohesion: 0.23
Nodes (11): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, computePrivileges(), MASTER_ADMIN_EMAIL, UserPrivileges (+3 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "HistoryView.tsx"
Cohesion: 0.15
Nodes (28): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), DeleteVersionModalProps, plural(), CHANGE_LABELS, CHANGE_TONES (+20 more)

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

### Community 73 - "dialogs.tsx"
Cohesion: 0.20
Nodes (15): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+7 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.18
Nodes (10): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+2 more)

### Community 77 - "doctorWeekChange.test.ts"
Cohesion: 0.10
Nodes (15): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, DR_PEDS (+7 more)

### Community 79 - "usePresence.ts"
Cohesion: 0.21
Nodes (8): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), frame, november, now

### Community 80 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

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
Cohesion: 0.12
Nodes (19): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+11 more)

### Community 85 - "nurseForm.ts"
Cohesion: 0.31
Nodes (6): checkNurseForm(), movePreference(), nextEmployeeCode(), NurseFormErrors, NurseFormValues, others

### Community 86 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "apiApp.ts"
Cohesion: 0.10
Nodes (21): repoRoot, swaps, express, @google/genai, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+13 more)

### Community 89 - "types/index.ts"
Cohesion: 0.06
Nodes (34): isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus, BlockWeeks (+26 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.19
Nodes (22): useAppContext(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+14 more)

### Community 91 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 94 - "PublishModal.tsx"
Cohesion: 0.18
Nodes (17): Request, EmailHtmlPreview(), Step, PublishTab, AssignmentDiffItem, FormattedAssignmentState, ScheduleVersionDiff, WEEKDAY_NAMES (+9 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 98 - "useDialogA11y"
Cohesion: 0.21
Nodes (13): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), dialogsChanged(), openListeners, openStack, useDialogA11y(), AuditTrailView(), ReportsView(), AuditAction (+5 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "PublishModal"
Cohesion: 0.16
Nodes (16): Browser check, Things that went wrong before, 12. Publishing and nurse links, PublishModal(), PublishView(), computeScheduleDiff(), formatAssignment(), ensureNurseLink() (+8 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.19
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 110 - "PublishedRosterView.tsx"
Cohesion: 0.27
Nodes (11): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+3 more)

### Community 111 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (14): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), GeminiGenerateResponse, GeminiInsightsResponse (+6 more)

### Community 112 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 113 - "Button"
Cohesion: 0.13
Nodes (49): uuid, NoticeTone, LocalModeBanner(), LocalModeBannerProps, BulkImportModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview (+41 more)

### Community 114 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 115 - "holidayLeave.ts"
Cohesion: 0.23
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+4 more)

### Community 116 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 117 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 120 - "dayView.test.ts"
Cohesion: 0.25
Nodes (6): amy, LEE, lookups, mary, nina, shift

### Community 121 - "16. History of work (for context)"
Cohesion: 0.09
Nodes (23): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), firstDayShown(), isPhoneSize(), useRosterChecks(), useRosterEdits(), CellChoice, DayColumn (+15 more)

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (13): clearYearToDateCache(), Desired, fingerprint(), Known, SyncPlan, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues (+5 more)

### Community 125 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 126 - "ref_node_assert"
Cohesion: 0.06
Nodes (21): BACKUPS_KEPT, MONTHS, suggestRosterName(), LATE, nurse, AL, DAY_OFF, SICK (+13 more)

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

### Community 133 - "ui/index.ts"
Cohesion: 0.11
Nodes (28): lucide-react, RosterDayView(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, ButtonProps (+20 more)

### Community 134 - "GridTable.tsx"
Cohesion: 0.19
Nodes (24): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+16 more)

### Community 135 - "doctorForm.ts"
Cohesion: 0.23
Nodes (9): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, usualWeekLines(), WEEKDAY_NAMES, WeeklyPatternSlot (+1 more)

### Community 136 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 141 - "ref_playwright"
Cohesion: 0.11
Nodes (11): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+3 more)

## Knowledge Gaps
- **985 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+980 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1200 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SchedulesView.tsx` to `ExportModal.tsx`, `fixtures.ts`, `usePhoneLayout.ts`, `ui/index.ts`, `getRepository`, `GridTable.tsx`, `rowsInSteps.ts`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `access.ts`, `App.tsx`, `gridSelection.ts`, `NurseSelfServicePanel.tsx`, `PlannerSample.tsx`, `ui.tsx`, `ClinicContextState`, `nurseRosterService.ts`, `RulesTab.tsx`, `Assignment`, `navigation.ts`, `FairnessModal.tsx`, `AppShell.tsx`, `authService.ts`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `usePresence.ts`, `DashboardView.tsx`, `harness/main.tsx`, `PublishModal.tsx`, `useDialogA11y`, `PublishedRosterView.tsx`, `EmailTab.tsx`, `Button`, `NSC Clinic Roster: complete project guide`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `ui/index.ts` to `ExportModal.tsx`, `SchedulesView.tsx`, `getRepository`, `GridTable.tsx`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `access.ts`, `App.tsx`, `NurseSelfServicePanel.tsx`, `PlannerSample.tsx`, `ui.tsx`, `nurseRosterService.ts`, `RulesTab.tsx`, `Assignment`, `navigation.ts`, `FairnessModal.tsx`, `AppShell.tsx`, `authService.ts`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `PublishModal.tsx`, `useDialogA11y`, `PublishedRosterView.tsx`, `EmailTab.tsx`, `Button`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 109 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 109 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _985 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07422559906487435 - nodes in this community are weakly interconnected._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06453634085213032 - nodes in this community are weakly interconnected._