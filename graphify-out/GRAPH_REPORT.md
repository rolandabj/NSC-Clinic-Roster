# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 255 files · ~311,314 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 3, (none) 2, .example 1)

## Summary
- 2039 nodes · 6639 edges · 95 communities (82 shown, 13 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 200 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `95cba94f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- isFloatShift
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- authService.ts
- notify
- authService
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- getRepository
- App.tsx
- EntityForCollection
- DashboardView.tsx
- analysisExport.test.ts
- firebaseIdentityService.ts
- react
- compilerOptions
- RulesTab.tsx
- seedRunner.ts
- FirestoreRepository
- devDependencies
- emailService.ts
- yearToDate.ts
- IRepository
- scripts
- ScheduleValidator.ts
- SchedulingEngine.ts
- dateFormatter.ts
- Hardening Controls
- dialogs.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- SchedulesView.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- makeNurse
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- quotaTracker
- EmailTab.tsx
- published-rules.mjs
- analysisExportService.ts
- WorkbookGrid.tsx
- savingSafety.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
- Incremental Implementation
- I18nManager
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
- ShareModal.tsx
- fixtures.ts
- Source-Driven Development
- doctorWeekChange.test.ts
- DoctorsView.tsx
- Sidebar.tsx
- weekHours.test.ts
- README.md
- lastResort.test.ts
- WorkingHoursPeriodsPanel.tsx
- IRepository.ts
- ClinicRoster
- types/index.ts
- ref_node_assert
- newRosterDates.ts
- apiApp.ts
- continuousHours.test.ts
- harness/main.tsx
- fakeAuth.ts
- Finish a change
- context7
- firestore-rules-reviewer.md
- plain-english-reviewer.md
- firebase-mcp.sh
- example.cjs
- start.sh
- stop.sh

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 85 edges
4. `Nurse` - 82 edges
5. `DutyWindow` - 81 edges
6. `react` - 75 edges
7. `Doctor` - 70 edges
8. `useDialogA11y()` - 66 edges
9. `lucide-react` - 63 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `9. Checking a roster (`src/services/validation/ScheduleValidator.ts`)` --references--> `recordHolidayDayOff()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/requests/staffRequestService.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx

## Import Cycles
- None detected.

## Communities (95 total, 13 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.07
Nodes (113): 5. Data model (Firestore collections), Request, EmailHtmlPreview(), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, ExportTab, WEEKDAY_NAMES (+105 more)

### Community 1 - "isFloatShift"
Cohesion: 0.14
Nodes (26): jspdf, jspdf-autotable, xlsx, ExportModal(), fmtHours(), isFloatShift(), analysisFileName(), downloadRosterAnalysis() (+18 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (34): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday(), planHolidayLeaveTidy() (+26 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.06
Nodes (69): RFC-5545, 12. Publishing and nurse links, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), dateLabel(), PublishedRosterSheet() (+61 more)

### Community 5 - "authService.ts"
Cohesion: 0.12
Nodes (25): LoginPageProps, signOutSafely(), AppShellProps, TopBar(), TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps (+17 more)

### Community 6 - "notify"
Cohesion: 0.11
Nodes (45): confirmDialog(), notify(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps, DutiesTab(), DutiesTabProps (+37 more)

### Community 7 - "authService"
Cohesion: 0.14
Nodes (4): 3. Users, roles and access, authService, computePrivileges(), getAppAuth()

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.17
Nodes (19): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+11 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.13
Nodes (40): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+32 more)

### Community 14 - "App.tsx"
Cohesion: 0.14
Nodes (13): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+5 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.13
Nodes (9): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+1 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (17): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+9 more)

### Community 17 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+11 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.12
Nodes (21): jose, authMiddleware(), AuthUser, Express, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken() (+13 more)

### Community 19 - "react"
Cohesion: 0.14
Nodes (24): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps (+16 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 22 - "seedRunner.ts"
Cohesion: 0.16
Nodes (20): DatabaseTab(), removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup() (+12 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.19
Nodes (11): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailResult (+3 more)

### Community 26 - "yearToDate.ts"
Cohesion: 0.13
Nodes (22): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+14 more)

### Community 27 - "IRepository"
Cohesion: 0.11
Nodes (13): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository (+5 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "ScheduleValidator.ts"
Cohesion: 0.16
Nodes (25): 7. Rules, ClinicSetup, isFreeDuring(), overlaps(), BlockedShift, explainNurseDay(), ExplainNurseDayInput, pendingLeaveOn() (+17 more)

### Community 30 - "SchedulingEngine.ts"
Cohesion: 0.12
Nodes (30): 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, checkAssignment(), hardRule(), minutes(), restHoursBetween() (+22 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.17
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (34): MenuButton(), MenuButtonProps, MenuItem, FairnessModal(), SwapManagerModal(), TemplateModal(), VersionCompareModal(), readStoredScheduleId() (+26 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "makeNurse"
Cohesion: 0.10
Nodes (26): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+18 more)

### Community 42 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.20
Nodes (9): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, WalkthroughModal() (+1 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.13
Nodes (9): defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener (+1 more)

### Community 46 - "EmailTab.tsx"
Cohesion: 0.17
Nodes (17): SendEmailPayload, ServerEmailConfig, EmailTab(), EmailTabProps, authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse() (+9 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "analysisExportService.ts"
Cohesion: 0.12
Nodes (29): coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes(), hoursToCover(), openingHourSlots(), resolveClinicSetup() (+21 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.15
Nodes (19): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+11 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (10): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps (+2 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (30): Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, listProblem(), explainDay(), NurseDayExplanation (+22 more)

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
Cohesion: 0.50
Nodes (3): Always, with every change (owner's standing instruction), graphify, NSC Clinic Roster

### Community 65 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "ShareModal.tsx"
Cohesion: 0.21
Nodes (9): 16. History of work (for context), ShareModal(), TabType, ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster(), deleteEntireSchedule() (+1 more)

### Community 69 - "fixtures.ts"
Cohesion: 0.10
Nodes (17): ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, LONG, NOV, OCT, D (+9 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 72 - "DoctorsView.tsx"
Cohesion: 0.14
Nodes (27): CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView() (+19 more)

### Community 73 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (15): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, canAccessRoute() (+7 more)

### Community 78 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 79 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.29
Nodes (10): WorkingHoursPeriodsPanel(), WorkingHoursPeriodsPanelProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+2 more)

### Community 80 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 81 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 83 - "types/index.ts"
Cohesion: 0.05
Nodes (37): isPairing(), PREFERENCE_FOCUS_LABELS, othersOnRoster(), STALE_MS, TAB_ID, ApprovalStatus, AuditAction, AuditEvent (+29 more)

### Community 84 - "ref_node_assert"
Cohesion: 0.07
Nodes (15): ScheduleValidator, csvCell(), diff(), LATE, nurse, JUNIOR, LEVELS, NC (+7 more)

### Community 86 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 88 - "apiApp.ts"
Cohesion: 0.13
Nodes (15): repoRoot, swaps, express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react (+7 more)

### Community 89 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 94 - "fakeAuth.ts"
Cohesion: 0.20
Nodes (6): AuthService, MASTER_ADMIN_EMAIL, user, Browser check, Steps, Things that went wrong before

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **727 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+722 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 883 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `nurseRosterService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `seedRunner.ts`, `dialogs.tsx`, `SchedulesView.tsx`, `NSC Clinic Roster: complete project guide`, `EmailTab.tsx`, `WorkbookGrid.tsx`, `handMoves.test.ts`, `ShareModal.tsx`, `fixtures.ts`, `DoctorsView.tsx`, `Sidebar.tsx`, `WorkingHoursPeriodsPanel.tsx`, `types/index.ts`, `harness/main.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `ShareModal.tsx`, `authService.ts`, `SchedulesView.tsx`, `notify`, `DoctorsView.tsx`, `Sidebar.tsx`, `AppShell.tsx`, `getRepository`, `App.tsx`, `EmailTab.tsx`, `DashboardView.tsx`, `react`, `types/index.ts`, `fakeAuth.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `nurseRosterService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `seedRunner.ts`, `dialogs.tsx`, `SchedulesView.tsx`, `EmailTab.tsx`, `WorkbookGrid.tsx`, `ShareModal.tsx`, `DoctorsView.tsx`, `Sidebar.tsx`, `WorkingHoursPeriodsPanel.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _727 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.0701114488348531 - nodes in this community are weakly interconnected._
- **Should `isFloatShift` be split into smaller, more focused modules?**
  _Cohesion score 0.14461538461538462 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0960960960960961 - nodes in this community are weakly interconnected._