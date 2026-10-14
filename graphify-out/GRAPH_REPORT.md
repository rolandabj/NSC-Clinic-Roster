# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 381 files · ~415,151 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2790 nodes · 9093 edges · 124 communities (109 shown, 15 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 400 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `881d64f9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DutyWindow
- createApiApp
- SchedulesView.tsx
- clinicModel.test.ts
- authService
- publicHolidays.test.ts
- getRepository
- ApprovalsQueuePanel.tsx
- ui-audit.cjs
- package.json
- authService.ts
- dependencies
- Test-Driven Development
- RosterToolbar.tsx
- IRepository
- CollectionSyncer
- access.ts
- seedRunner.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- emailPublishing.test.ts
- devDependencies
- usePresence.ts
- quick reference
- decisionEmail.test.ts
- analysisExportService.ts
- WorkbookGrid.tsx
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- ClinicContextState
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- MyRosterView.tsx
- Handover for a new chat
- WhoCanCover.tsx
- Optimization Patterns
- Assignment
- PublishedRosterSheet.tsx
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- firestore-rules/package.json
- AvailabilityView.tsx
- continuousHours.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
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
- PublishModal
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
- ExportModal.tsx
- links.cjs
- icsExportService.ts
- ref_node_assert
- SchedulingEngine.ts
- grid-keys.cjs
- UI overhaul: summary and next steps
- apiApp.ts
- types/index.ts
- DashboardView.tsx
- harness/main.tsx
- useDialogA11y
- teamRoster.test.ts
- Finish a change
- Rules
- handMoves.test.ts
- context7
- 16. History of work (for context)
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- start.sh
- stop.sh
- Rules
- grid-flow.cjs
- LiveCollectionCache
- ReportsView.tsx
- EmailTab.tsx
- RosterGrid
- Schedule
- react
- quotaTracker
- UI overhaul: checklist
- NSC Clinic Roster: complete project guide
- savingSafety.test.ts
- newRosterDates.ts
- grid-timing.cjs
- GridTable.tsx
- fakeAuth.ts
- my-requests.cjs
- nurse-editor.cjs
- ui/index.ts
- sheet-tabs.cjs
- preferenceOrder.ts
- scripts
- ref_playwright
- nurse-page.cjs
- requests.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 118 edges
2. `Assignment` - 113 edges
3. `16. History of work (for context)` - 101 edges
4. `Nurse` - 98 edges
5. `getRepository()` - 97 edges
6. `DutyWindow` - 93 edges
7. `Schedule` - 92 edges
8. `lucide-react` - 89 edges
9. `Doctor` - 79 edges
10. `LeaveEntry` - 76 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts

## Import Cycles
- None detected.

## Communities (124 total, 15 thin omitted)

### Community 0 - "DutyWindow"
Cohesion: 0.21
Nodes (26): 5. Data model (Firestore collections), BulkImportModalProps, VersionCompareModalProps, VersionViewModalProps, AllRequestsPanelProps, NurseSelfServicePanelProps, PublishedRosterViewProps, CellChoice (+18 more)

### Community 1 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 2 - "SchedulesView.tsx"
Cohesion: 0.22
Nodes (11): FillDialogProps, FillRange, CoverageSheet(), LeaveAndLocksSheet(), daysBefore(), loadClinicSetup(), GenerationPreflightSummary, GenerationProgress (+3 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (31): Browser check, Steps, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler() (+23 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "publicHolidays.test.ts"
Cohesion: 0.22
Nodes (12): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy(), withHolidaysAtZero() (+4 more)

### Community 6 - "getRepository"
Cohesion: 0.05
Nodes (97): Report, What to check, What to look at, useAppContext(), ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost() (+89 more)

### Community 7 - "ApprovalsQueuePanel.tsx"
Cohesion: 0.30
Nodes (11): DataTable(), EmptyState(), ErrorState(), LoadingState(), ApprovalsQueuePanel(), Waiting, decisionTitle(), waitingDayText() (+3 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "authService.ts"
Cohesion: 0.26
Nodes (10): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL, UserPrivileges, UserProfile (+2 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.30
Nodes (8): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar()

### Community 14 - "IRepository"
Cohesion: 0.09
Nodes (20): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+12 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.10
Nodes (16): 11. Saving, live updates, versions, useRosterEdits(), saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+8 more)

### Community 16 - "access.ts"
Cohesion: 0.19
Nodes (17): 3. Users, roles and access, 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar() (+9 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.12
Nodes (26): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+18 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (22): jose, calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+14 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.14
Nodes (21): nurseClinicRoleOf(), YearToDate, YearToDateCounts, isLateDuty(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+13 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (12): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+4 more)

### Community 23 - "emailPublishing.test.ts"
Cohesion: 0.20
Nodes (10): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SMTP_CONNECTION_KEYS, withoutConnectionSettings() (+2 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "usePresence.ts"
Cohesion: 0.21
Nodes (9): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, frame, november (+1 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.11
Nodes (22): emailRouter, COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload (+14 more)

### Community 28 - "analysisExportService.ts"
Cohesion: 0.06
Nodes (71): fmtHours(), HoursAccountingSheet(), BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift, RequestWords (+63 more)

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.05
Nodes (65): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, CellContextMenu() (+57 more)

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
Cohesion: 0.12
Nodes (22): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+14 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (13): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+5 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "MyRosterView.tsx"
Cohesion: 0.33
Nodes (6): LoadState, MyRosterViewProps, MyDay, myShiftDays(), NurseRosterDoc, NurseRosterShift

### Community 38 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 39 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.17
Nodes (38): ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap, PublishModalProps, NONE, SwapManagerModalProps (+30 more)

### Community 42 - "PublishedRosterSheet.tsx"
Cohesion: 0.52
Nodes (5): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), weekdayOf(), safeColor()

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.08
Nodes (42): PageHeader(), TabPanel(), AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+34 more)

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

### Community 68 - "PublishModal"
Cohesion: 0.19
Nodes (15): Things that went wrong before, EmailHtmlPreview(), PublishModal(), PublishView(), ensureNurseLink(), nurseLinkUrl(), regenerateNurseLink(), syncNurseRosters() (+7 more)

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

### Community 73 - "DoctorsView.tsx"
Cohesion: 0.10
Nodes (46): LocalModeBanner(), LocalModeBannerProps, BulkImportModal(), Badge(), Button(), IconButton(), cx(), Dialog() (+38 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "nurseRosterService.ts"
Cohesion: 0.21
Nodes (13): MyRosterView(), dayMonth(), formatRosterAsText(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, nurseCalendarUrl(), nurseWebcalUrl(), origin() (+5 more)

### Community 78 - "doctorScheduleService.ts"
Cohesion: 0.14
Nodes (23): CreateScheduleModal(), CreateScheduleModalProps, deleteDoctorShift(), doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), missingPatternSessions(), nextDay() (+15 more)

### Community 80 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (28): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, exportRosterToExcel() (+20 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 84 - "ref_node_assert"
Cohesion: 0.03
Nodes (84): 15. Tests, FLOAT_ROLE_ID, SchedulingEngine, ANALYSIS_FORMAT, ScheduleValidator, CARD, input(), KHAN (+76 more)

### Community 85 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (52): 6. Clinic model (the business rules in plain English), 7. Rules, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, hardRule(), minutes(), restHoursBetween() (+44 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "apiApp.ts"
Cohesion: 0.11
Nodes (19): express, @google/genai, authMiddleware(), AuthUser, BackendRole, Express, requireOwner, requirePlanner (+11 more)

### Community 89 - "types/index.ts"
Cohesion: 0.07
Nodes (39): uuid, Request, NoticeTone, Step, ShareModalProps, TabType, PublishTab, NEXT_ROSTER_WARNING_DAYS (+31 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.25
Nodes (18): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+10 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "useDialogA11y"
Cohesion: 0.13
Nodes (25): openStack, useDialogA11y(), DeleteScheduleModal(), DeleteVersionModal(), DeleteVersionModalProps, CHANGE_LABELS, VersionCompareModal(), SOURCE_LABELS (+17 more)

### Community 94 - "teamRoster.test.ts"
Cohesion: 0.18
Nodes (10): PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), buildTeamRosterSheet(), loadPublicRoster(), nurses, published, refs (+2 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.09
Nodes (31): Other engine files, FairnessModal(), SwapManagerModal(), checkAssignment(), listProblem(), shiftDate(), checkSwap(), isPinnedShift() (+23 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "16. History of work (for context)"
Cohesion: 0.09
Nodes (38): 13. Screens in detail, 16. History of work (for context), useLatestCallback(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), PHONE_QUERY (+30 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.08
Nodes (16): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+8 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 110 - "ReportsView.tsx"
Cohesion: 0.18
Nodes (21): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView() (+13 more)

### Community 111 - "EmailTab.tsx"
Cohesion: 0.19
Nodes (15): ServerEmailConfig, EmailTab(), EmailTabProps, authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights() (+7 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "Schedule"
Cohesion: 0.13
Nodes (17): DeleteScheduleModalProps, EditDoctorShiftModalProps, TIME_PRESETS, RosterPicker(), RosterPickerProps, RosterToolbarProps, DoctorsScheduleSheetProps, WEEKDAY_ABBR (+9 more)

### Community 115 - "react"
Cohesion: 0.10
Nodes (23): lucide-react, react, PublicMessage(), PublicPageFrame(), AccountMenu(), TopBar(), ROSTER_SHEET_PANEL_ID, RosterSheet (+15 more)

### Community 116 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.11
Nodes (12): forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues (+4 more)

### Community 125 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "GridTable.tsx"
Cohesion: 0.05
Nodes (55): FillDialog(), RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), CellView, DayTotal, problemWords() (+47 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.09
Nodes (31): PROBLEM_MARKS, ProblemKind, Tone, TONE_CLASSES, ButtonProps, ButtonSize, ButtonVariant, IconButtonProps (+23 more)

### Community 135 - "preferenceOrder.ts"
Cohesion: 0.18
Nodes (10): isPairing(), PREFERENCE_FOCUS_LABELS, checkNurseForm(), movePreference(), nextEmployeeCode(), NurseFormErrors, NurseFormValues, NursePreference (+2 more)

### Community 138 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 141 - "ref_playwright"
Cohesion: 0.13
Nodes (9): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

## Knowledge Gaps
- **949 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+944 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1157 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DutyWindow`, `GridTable.tsx`, `SchedulesView.tsx`, `ui/index.ts`, `getRepository`, `ApprovalsQueuePanel.tsx`, `package.json`, `authService.ts`, `RosterToolbar.tsx`, `access.ts`, `NurseSample.tsx`, `App.tsx`, `usePresence.ts`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `ui.tsx`, `ClinicContextState`, `MyRosterView.tsx`, `WhoCanCover.tsx`, `Assignment`, `PublishedRosterSheet.tsx`, `AvailabilityView.tsx`, `AppShell.tsx`, `DoctorsView.tsx`, `doctorScheduleService.ts`, `ExportModal.tsx`, `ref_node_assert`, `types/index.ts`, `DashboardView.tsx`, `harness/main.tsx`, `useDialogA11y`, `16. History of work (for context)`, `ReportsView.tsx`, `EmailTab.tsx`, `Schedule`, `NSC Clinic Roster: complete project guide`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `DutyWindow`, `GridTable.tsx`, `SchedulesView.tsx`, `ui/index.ts`, `getRepository`, `ApprovalsQueuePanel.tsx`, `package.json`, `authService.ts`, `RosterToolbar.tsx`, `access.ts`, `NurseSample.tsx`, `App.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `ui.tsx`, `MyRosterView.tsx`, `Assignment`, `PublishedRosterSheet.tsx`, `AvailabilityView.tsx`, `AppShell.tsx`, `DoctorsView.tsx`, `doctorScheduleService.ts`, `ExportModal.tsx`, `types/index.ts`, `DashboardView.tsx`, `harness/main.tsx`, `useDialogA11y`, `ReportsView.tsx`, `EmailTab.tsx`, `Schedule`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `DutyWindow`, `SchedulesView.tsx`, `PublishModal`, `getRepository`, `Assignment`, `authService.ts`, `doctorScheduleService.ts`, `access.ts`, `AvailabilityView.tsx`, `react`, `AppShell.tsx`, `App.tsx`, `emailPublishing.test.ts`, `types/index.ts`, `DashboardView.tsx`, `usePresence.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 100 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 100 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _949 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05731707317073171 - nodes in this community are weakly interconnected._
- **Should `authService` be split into smaller, more focused modules?**
  _Cohesion score 0.11576354679802955 - nodes in this community are weakly interconnected._