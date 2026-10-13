# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 334 files · ~375,746 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2564 nodes · 8246 edges · 126 communities (118 shown, 8 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 346 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5be503b8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- .validate
- clinicModel.test.ts
- publicRosterService.ts
- react
- getRepository
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AvailabilityView.tsx
- PublishedRosterView.tsx
- CollectionSyncer
- explainCell.ts
- makeNurse
- firebaseIdentityService.ts
- lastResort.test.ts
- compilerOptions
- yearToDate.ts
- App.tsx
- gridSelection.ts
- devDependencies
- nurseRosterService.ts
- hoursAccounting.ts
- RosterToolbar.tsx
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- NurseSample.tsx
- Hardening Controls
- seedRunner.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- handMoveChecks.ts
- WorkbookGrid.tsx
- emailService.ts
- Optimization Patterns
- analysisExport.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- ui.tsx
- HistoryView.tsx
- firestore-rules/package.json
- data.ts
- checkScheduler.test.ts
- ClinicRoster
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- FirestoreRepository.ts
- Incremental Implementation
- RulesTab.tsx
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
- hoursBalance.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- NSC Clinic Roster: complete project guide
- published-rules.mjs
- apiApp.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- handMoves.test.ts
- rosterPdfService.ts
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- uiComponents.test.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- authService.ts
- access.ts
- geminiApi.test.ts
- ref_node_assert
- harness/main.tsx
- collectionSyncer.ts
- ScheduleValidator.ts
- Finish a change
- Rules
- Button.tsx
- 16. History of work (for context)
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- SchedulesView.tsx
- start.sh
- stop.sh
- Rules
- nurseClinicFloat.test.ts
- requestFindings.test.ts
- LiveCollectionCache
- sharing.test.ts
- IRepository
- devDependencies
- cellView.test.ts
- Sidebar.tsx
- colorContrast.ts
- hoursPolicy.ts
- PublishModal.tsx
- RosterGrid
- createLiveReconciler
- ClinicTab.tsx
- doctorWeekChange.test.ts
- plain-english-reviewer.md
- middleware/auth.ts
- ui/index.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 112 edges
2. `Assignment` - 110 edges
3. `getRepository()` - 95 edges
4. `Nurse` - 94 edges
5. `Schedule` - 92 edges
6. `DutyWindow` - 88 edges
7. `lucide-react` - 85 edges
8. `useDialogA11y()` - 78 edges
9. `Doctor` - 77 edges
10. `LeaveEntry` - 71 edges

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

## Communities (126 total, 8 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (71): 5. Data model (Firestore collections), BulkImportModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps, ExportTab, WEEKDAY_NAMES (+63 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (18): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+10 more)

### Community 2 - ".validate"
Cohesion: 0.11
Nodes (27): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+19 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "publicRosterService.ts"
Cohesion: 0.25
Nodes (10): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+2 more)

### Community 5 - "react"
Cohesion: 0.09
Nodes (37): lucide-react, react, uuid, ConfirmOptions, DialogState, listeners, Notice, NoticeTone (+29 more)

### Community 6 - "getRepository"
Cohesion: 0.14
Nodes (40): confirmDialog(), dismissNotice(), notify(), setState(), settleConfirm(), signOutSafely(), TemplateModal(), AccessManagementPanel() (+32 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.09
Nodes (37): AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+29 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (35): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+27 more)

### Community 14 - "PublishedRosterView.tsx"
Cohesion: 0.19
Nodes (18): RFC-5545, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, buildNurseIcs(), buildNurseRosterIcs(), downloadIcsFile(), escapeIcsText() (+10 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.12
Nodes (4): CollectionSyncer, FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 16 - "explainCell.ts"
Cohesion: 0.14
Nodes (23): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+15 more)

### Community 17 - "makeNurse"
Cohesion: 0.12
Nodes (21): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+13 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.14
Nodes (19): jose, verifyToken(), calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig (+11 more)

### Community 19 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (20): YearToDate, daysBefore(), loadClinicSetup(), clearYearToDateCache(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), forgetCachedRoster() (+12 more)

### Community 22 - "App.tsx"
Cohesion: 0.13
Nodes (14): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+6 more)

### Community 23 - "gridSelection.ts"
Cohesion: 0.10
Nodes (15): GridCellProps, CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelection (+7 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.08
Nodes (44): dateLabel(), PublishedRosterSheet(), loadViewerData(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView() (+36 more)

### Community 26 - "hoursAccounting.ts"
Cohesion: 0.13
Nodes (27): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), AuditTrailViewProps, ReportsView() (+19 more)

### Community 27 - "RosterToolbar.tsx"
Cohesion: 0.13
Nodes (14): MenuButton(), MenuButtonProps, MenuItem, RosterMenuItem, RosterToolbarProps, RegenerateMode, othersOnRoster(), samePeople() (+6 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (45): coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes(), hoursToCover(), isFreeDuring(), openingHourSlots() (+37 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "seedRunner.ts"
Cohesion: 0.13
Nodes (23): useAppContext(), DatabaseTab(), removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS (+15 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.08
Nodes (19): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+11 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "handMoveChecks.ts"
Cohesion: 0.24
Nodes (15): Other engine files, FairnessModal(), SwapManagerModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings() (+7 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (53): CellContextMenu(), CellEditorDialog(), withDr(), cellLookupsOf(), CellView, cellViewOf(), fmtHours(), reuseCellViews() (+45 more)

### Community 39 - "emailService.ts"
Cohesion: 0.16
Nodes (14): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+6 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+11 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 46 - "HistoryView.tsx"
Cohesion: 0.17
Nodes (11): CHANGE_LABELS, WEEKDAY_NAMES, AssignmentDiffItem, ChangeType, FormattedAssignmentState, ScheduleVersionDiff, WEEKDAY_NAMES, currentWeekendDays (+3 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.20
Nodes (9): @firebase/rules-unit-testing, firebase-tools, description, firebase, name, private, scripts, test (+1 more)

### Community 48 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 49 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 50 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "FirestoreRepository.ts"
Cohesion: 0.08
Nodes (23): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry (+15 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.15
Nodes (18): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+10 more)

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

### Community 68 - "hoursBalance.ts"
Cohesion: 0.14
Nodes (25): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), hoursCheckpoints(), hoursHistoryOverlaps(), HoursSchedule, Leftover (+17 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+13 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.17
Nodes (11): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works (+3 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+4 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (14): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+6 more)

### Community 77 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 79 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 80 - "rosterPdfService.ts"
Cohesion: 0.09
Nodes (36): jspdf, jspdf-autotable, xlsx, ExportModal(), fmtHours(), isFloatShift(), exportRosterToCsvLong(), exportRosterToCsvMatrix() (+28 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.16
Nodes (13): TopBarProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps, ReportsViewProps, SchedulesViewProps (+5 more)

### Community 83 - "types/index.ts"
Cohesion: 0.08
Nodes (26): CellChoice, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AssignmentKind, BlockWeeks, DoctorSessionSource (+18 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.11
Nodes (16): ANNUAL_LEAVE, DAY_DUTY, UNPAID_LEAVE, LONG, NOV, OCT, D, E (+8 more)

### Community 85 - "uiComponents.test.ts"
Cohesion: 0.18
Nodes (13): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemCounts(), ProblemKind, Tone, TONE_CLASSES, nextTabIndex() (+5 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "authService.ts"
Cohesion: 0.13
Nodes (19): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, authorizedFetch(), computePrivileges(), MASTER_ADMIN_EMAIL (+11 more)

### Community 89 - "access.ts"
Cohesion: 0.28
Nodes (11): 3. Users, roles and access, 4. Navigation and app shell, usePermissions(), AccountMenu(), TopBar(), canAccessRoute(), canEditClinicData(), canExportReports() (+3 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.23
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "ref_node_assert"
Cohesion: 0.15
Nodes (6): ctx(), EARLY, LATE, LATE, nurse, base

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "collectionSyncer.ts"
Cohesion: 0.21
Nodes (9): Desired, fingerprint(), Known, planSync(), SyncPlan, sameItems(), CollectionName, countedShift() (+1 more)

### Community 94 - "ScheduleValidator.ts"
Cohesion: 0.19
Nodes (12): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, isAgreedException(), isLastResortShift(), LAST_RESORT_NOTE (+4 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "Button.tsx"
Cohesion: 0.21
Nodes (11): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, EmptyState() (+3 more)

### Community 98 - "16. History of work (for context)"
Cohesion: 0.33
Nodes (10): 16. History of work (for context), ProblemMark, addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults() (+2 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.15
Nodes (24): 13. Screens in detail, CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), DoctorsScheduleSheet(), deleteDoctorShift(), DeleteDoctorShiftParams, doctorFromDate() (+16 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "SchedulesView.tsx"
Cohesion: 0.10
Nodes (30): 11. Saving, live updates, versions, useLatestCallback(), DeleteScheduleModal(), VersionCompareModal(), RosterSheet, RosterSheetTabs(), RosterStep, RosterStepAction (+22 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "requestFindings.test.ts"
Cohesion: 0.17
Nodes (7): ScheduleValidator, LATE, schedule, wishFindings(), EARLY, LATE, shifts

### Community 110 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.13
Nodes (14): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), fingerprint(), syncScheduleAssignments(), repositoryManager (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 115 - "Sidebar.tsx"
Cohesion: 0.36
Nodes (7): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 116 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 117 - "hoursPolicy.ts"
Cohesion: 0.15
Nodes (21): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday() (+13 more)

### Community 118 - "PublishModal.tsx"
Cohesion: 0.10
Nodes (37): 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), EmailTab() (+29 more)

### Community 119 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 120 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 121 - "ClinicTab.tsx"
Cohesion: 0.36
Nodes (7): ClinicTab(), ClinicTabProps, EmailTabProps, SaveStatus, WEEKDAY_NAMES, ClinicProfile, getWeekendDays()

### Community 122 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "middleware/auth.ts"
Cohesion: 0.21
Nodes (7): express, AuthUser, BackendRole, Express, requireOwner, ROLE_HIERARCHY, authRouter

### Community 133 - "ui/index.ts"
Cohesion: 0.14
Nodes (27): Card(), Crumb, PageHeader(), cx(), Column, DataTable(), SortDirection, sortRows() (+19 more)

## Knowledge Gaps
- **878 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+873 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1072 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `publicRosterService.ts`, `ui/index.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `PublishedRosterView.tsx`, `explainCell.ts`, `App.tsx`, `gridSelection.ts`, `nurseRosterService.ts`, `hoursAccounting.ts`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `NurseSample.tsx`, `seedRunner.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `HistoryView.tsx`, `RulesTab.tsx`, `NSC Clinic Roster: complete project guide`, `ClinicContextState`, `fixtures.ts`, `uiComponents.test.ts`, `authService.ts`, `access.ts`, `harness/main.tsx`, `ScheduleValidator.ts`, `Button.tsx`, `doctorScheduleService.ts`, `SchedulesView.tsx`, `Sidebar.tsx`, `PublishModal.tsx`, `ClinicTab.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `publicRosterService.ts`, `ui/index.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `PublishedRosterView.tsx`, `App.tsx`, `gridSelection.ts`, `nurseRosterService.ts`, `hoursAccounting.ts`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `NurseSample.tsx`, `seedRunner.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `HistoryView.tsx`, `RulesTab.tsx`, `uiComponents.test.ts`, `authService.ts`, `access.ts`, `harness/main.tsx`, `ScheduleValidator.ts`, `Button.tsx`, `doctorScheduleService.ts`, `SchedulesView.tsx`, `Sidebar.tsx`, `PublishModal.tsx`, `ClinicTab.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `Assignment`, `.validate`, `publicRosterService.ts`, `react`, `getRepository`, `ui/index.ts`, `AppShell.tsx`, `AvailabilityView.tsx`, `CollectionSyncer`, `gridSelection.ts`, `RosterToolbar.tsx`, `WorkbookGrid.tsx`, `checkScheduler.test.ts`, `NSC Clinic Roster: complete project guide`, `Design system: NSC Clinic Roster`, `types/index.ts`, `uiComponents.test.ts`, `access.ts`, `collectionSyncer.ts`, `Button.tsx`, `SchedulesView.tsx`, `colorContrast.ts`, `RosterGrid`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _878 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.13765822784810128 - nodes in this community are weakly interconnected._
- **Should `.validate` be split into smaller, more focused modules?**
  _Cohesion score 0.10953058321479374 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._