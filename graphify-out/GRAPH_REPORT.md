# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 388 files · ~419,897 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2826 nodes · 9336 edges · 138 communities (118 shown, 20 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 404 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f7498eb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- hoursBalance.ts
- createApiApp
- fixtures.ts
- clinicModel.test.ts
- authService
- 16. History of work (for context)
- react
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- RosterToolbar.tsx
- nurseClinicFloat.test.ts
- IRepository.ts
- authService.ts
- seedRunner.ts
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
- ExportModal.tsx
- analysisExportService.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- ClinicContextState
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- NursesView.tsx
- emailSettingsStore.ts
- ddmmyyyy
- Optimization Patterns
- DutyWindow
- analysisExport.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- RulesTab.tsx
- firestore-rules/package.json
- staffRequestService.ts
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
- leaveAllowance.test.ts
- Planning and Task Breakdown
- Find Skills
- PublishModal.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- doctorScheduleService.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- NSC Clinic Roster: complete project guide
- doctorWeekChange.test.ts
- NurseSelfServicePanel.tsx
- plain-english-reviewer.md
- links.cjs
- icsExportService.ts
- colorContrast.ts
- makeNurse
- dayView.test.ts
- cellView.test.ts
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
- ScheduleValidator.ts
- usePhoneLayout.ts
- context7
- doctors.cjs
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- fakeAuth.ts
- start.sh
- stop.sh
- Rules
- grid-keys.cjs
- LiveCollectionCache
- EmailTab.tsx
- resolveNurseHoursBalance
- SchedulingEngine.ts
- holidayLeave.ts
- quotaTracker
- engineRules.test.ts
- editSaving.test.ts
- ClinicRoster
- sharing.test.ts
- useRosterChecks.ts
- scripts
- savingSafety.test.ts
- IRepository
- ref_node_assert
- grid-timing.cjs
- explainCell.ts
- my-requests.cjs
- ui/index.ts
- SchedulesView.tsx
- formatDate
- nurse-editor.cjs
- allowance.cjs
- public-pages.cjs
- roster-dialogs.cjs
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

## Communities (138 total, 20 thin omitted)

### Community 0 - "hoursBalance.ts"
Cohesion: 0.12
Nodes (33): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, CHANGE_LABELS, VersionCompareModal(), ReportsView() (+25 more)

### Community 1 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 2 - "fixtures.ts"
Cohesion: 0.08
Nodes (25): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, LONG, NOV, OCT (+17 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.11
Nodes (8): authService, computePrivileges(), defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "16. History of work (for context)"
Cohesion: 0.12
Nodes (29): 16. History of work (for context), AccountMenu(), TopBar(), ProblemCounts(), Switch(), AvailabilityView(), WEEKDAY_ABBR, LoadState (+21 more)

### Community 6 - "react"
Cohesion: 0.07
Nodes (78): lucide-react, react, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice() (+70 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (46): DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), cellLookupsOf(), cellSummary() (+38 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.14
Nodes (17): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+9 more)

### Community 14 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 15 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 16 - "authService.ts"
Cohesion: 0.12
Nodes (27): 3. Users, roles and access, 4. Navigation and app shell, LoginPageProps, AppShellProps, APP_NAME, SCREEN_NAMES, screenName(), screenTitle() (+19 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.19
Nodes (19): useAppContext(), DatabaseTab(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult (+11 more)

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
Cohesion: 0.23
Nodes (13): YearToDate, daysBefore(), loadClinicSetup(), earlierRostersThisYear(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster, loadPublishedRoster() (+5 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.11
Nodes (20): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+12 more)

### Community 23 - "emailService.ts"
Cohesion: 0.20
Nodes (12): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult, ServerEmailConfig (+4 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "GridTable.tsx"
Cohesion: 0.05
Nodes (55): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), useRosterEdits(), CellView, DayTotal, dayTotalWords() (+47 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (18): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, DecidedRequest, decisionEmail(), DecisionEmailInput (+10 more)

### Community 28 - "ExportModal.tsx"
Cohesion: 0.11
Nodes (32): xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift(), exportRosterToCsvLong(), exportRosterToCsvMatrix() (+24 more)

### Community 29 - "analysisExportService.ts"
Cohesion: 0.11
Nodes (28): isPendingLeave(), isLateDuty(), ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy(), downloadRosterAnalysis(), FIELD_GUIDE (+20 more)

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

### Community 37 - "NursesView.tsx"
Cohesion: 0.25
Nodes (11): PageHeader(), NursesView(), checkNurseForm(), movePreference(), nextEmployeeCode(), NurseFormErrors, NurseFormValues, filterNurses() (+3 more)

### Community 38 - "emailSettingsStore.ts"
Cohesion: 0.28
Nodes (10): ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), cache(), cachedEmailSettings() (+2 more)

### Community 39 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "DutyWindow"
Cohesion: 0.14
Nodes (56): 5. Data model (Firestore collections), BulkImportModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE (+48 more)

### Community 42 - "analysisExport.test.ts"
Cohesion: 0.09
Nodes (18): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+10 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "RulesTab.tsx"
Cohesion: 0.08
Nodes (32): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+24 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.14
Nodes (30): DataTable(), EmptyState(), ErrorState(), LoadingState(), AllRequestsPanel(), Draft, KindFilter, STATUS (+22 more)

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
Nodes (33): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+25 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "CollectionSyncer"
Cohesion: 0.12
Nodes (9): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, rebaseEdit() (+1 more)

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

### Community 65 - "leaveAllowance.test.ts"
Cohesion: 0.29
Nodes (5): Kind, takesAllowance(), AL, DAY_OFF, SICK

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "PublishModal.tsx"
Cohesion: 0.12
Nodes (25): Request, EmailHtmlPreview(), PublishModal(), Step, WEEKDAY_NAMES, PublishTab, PublishView(), AssignmentDiffItem (+17 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (19): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+11 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "doctorScheduleService.ts"
Cohesion: 0.19
Nodes (18): 13. Screens in detail, useLatestCallback(), isPhoneSize(), DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), doctorFromDate(), getWeekdayFromIsoDate() (+10 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.18
Nodes (10): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+2 more)

### Community 77 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.22
Nodes (8): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, WalkthroughModal(), WalkthroughModalProps

### Community 78 - "doctorWeekChange.test.ts"
Cohesion: 0.10
Nodes (15): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, DR_PEDS (+7 more)

### Community 79 - "NurseSelfServicePanel.tsx"
Cohesion: 0.12
Nodes (28): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), wholeDates(), NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest(), dayStatus() (+20 more)

### Community 80 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.12
Nodes (21): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+13 more)

### Community 83 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 84 - "makeNurse"
Cohesion: 0.08
Nodes (30): SchedulingEngine, DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run() (+22 more)

### Community 85 - "dayView.test.ts"
Cohesion: 0.22
Nodes (7): firstDayShown(), amy, LEE, lookups, mary, nina, shift

### Community 86 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 89 - "types/index.ts"
Cohesion: 0.06
Nodes (36): isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus, AuditAction (+28 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.10
Nodes (40): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData (+32 more)

### Community 91 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 94 - "apiApp.ts"
Cohesion: 0.13
Nodes (15): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+7 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "ScheduleValidator.ts"
Cohesion: 0.07
Nodes (41): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, ProblemsPanelProps, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps (+33 more)

### Community 98 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "fakeAuth.ts"
Cohesion: 0.15
Nodes (9): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, planner(), history() (+1 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 111 - "EmailTab.tsx"
Cohesion: 0.16
Nodes (16): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+8 more)

### Community 113 - "resolveNurseHoursBalance"
Cohesion: 0.17
Nodes (18): CreateScheduleModal(), CreateScheduleModalProps, askedCarry(), closePeriod(), earlierPeriodTotals(), resolveNurseHoursBalance(), round1(), shiftIsoDate() (+10 more)

### Community 114 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (42): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+34 more)

### Community 115 - "holidayLeave.ts"
Cohesion: 0.28
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday() (+4 more)

### Community 116 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 117 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 118 - "editSaving.test.ts"
Cohesion: 0.12
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 121 - "useRosterChecks.ts"
Cohesion: 0.24
Nodes (7): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), EMPTY_REPORT, useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 123 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (11): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS (+3 more)

### Community 125 - "IRepository"
Cohesion: 0.13
Nodes (12): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), removePublicRoster(), fingerprint(), syncScheduleAssignments(), repositoryManager (+4 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.11
Nodes (9): diff(), LATE, nurse, leaves, pins, nurses, october, octoberVersion (+1 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 129 - "explainCell.ts"
Cohesion: 0.15
Nodes (24): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+16 more)

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.08
Nodes (33): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES (+25 more)

### Community 134 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (28): NurseFairnessMetrics, TemplateModalProps, FillDialogProps, CheckInputs, RosterSnapshot, AllRequestsPanelProps, readStoredScheduleId(), storeScheduleId() (+20 more)

### Community 135 - "formatDate"
Cohesion: 0.09
Nodes (58): uuid, LocalModeBanner(), LocalModeBannerProps, DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal() (+50 more)

### Community 141 - "ref_playwright"
Cohesion: 0.11
Nodes (11): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+3 more)

## Knowledge Gaps
- **965 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+960 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1180 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `hoursBalance.ts`, `explainCell.ts`, `fixtures.ts`, `16. History of work (for context)`, `SchedulesView.tsx`, `formatDate`, `ui/index.ts`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `authService.ts`, `seedRunner.ts`, `PublishedRosterView.tsx`, `GridTable.tsx`, `ExportModal.tsx`, `PlannerSample.tsx`, `ui.tsx`, `ClinicContextState`, `NursesView.tsx`, `DutyWindow`, `RulesTab.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `PublishModal.tsx`, `data.ts`, `doctorScheduleService.ts`, `NSC Clinic Roster: complete project guide`, `NurseSelfServicePanel.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `ScheduleValidator.ts`, `usePhoneLayout.ts`, `EmailTab.tsx`, `resolveNurseHoursBalance`, `useRosterChecks.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `hoursBalance.ts`, `16. History of work (for context)`, `SchedulesView.tsx`, `formatDate`, `ui/index.ts`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `authService.ts`, `seedRunner.ts`, `PublishedRosterView.tsx`, `GridTable.tsx`, `ExportModal.tsx`, `PlannerSample.tsx`, `ui.tsx`, `NursesView.tsx`, `DutyWindow`, `RulesTab.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `PublishModal.tsx`, `data.ts`, `doctorScheduleService.ts`, `NurseSelfServicePanel.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `ScheduleValidator.ts`, `EmailTab.tsx`, `resolveNurseHoursBalance`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `LiveCollectionCache` connect `LiveCollectionCache` to `quotaTracker`, `FirestoreRepository`, `IRepository.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 102 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 102 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _965 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11614401858304298 - nodes in this community are weakly interconnected._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07632850241545894 - nodes in this community are weakly interconnected._