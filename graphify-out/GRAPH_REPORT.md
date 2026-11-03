# Graph Report - NSC-Clinic-Roster  (2026-11-03)

## Corpus Check
- 419 files · ~431,153 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2960 nodes · 10139 edges · 160 communities (131 shown, 29 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 431 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fcc65a1a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- fixtures.ts
- clinicModel.test.ts
- authService
- NursesView.tsx
- SettingsView.tsx
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- RosterToolbar.tsx
- lastResort.test.ts
- seedRunner.ts
- assignmentChecks.ts
- .list
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- analysisExportService.ts
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
- authorizedFetch
- PublishView.tsx
- RulesTab.tsx
- Optimization Patterns
- SchedulesView.tsx
- VersionCompareModal.tsx
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
- makeNurse
- Planning and Task Breakdown
- Find Skills
- HistoryView.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- LiveCollectionCache
- Rules
- Design system: NSC Clinic Roster
- README.md
- IRepository
- holidayLeave.ts
- createApiApp
- formatDate
- links.cjs
- icsExportService.ts
- colorContrast.ts
- makeSchedule
- nurseRosterService.ts
- cellView.test.ts
- UI overhaul: summary and next steps
- gridSelection.ts
- types/index.ts
- DashboardView.tsx
- ClinicContextState
- harness/main.tsx
- MyRosterView.tsx
- Sidebar.tsx
- Finish a change
- Rules
- handMoves.test.ts
- UI overhaul: checklist
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
- GridSelection
- nurses-list.cjs
- AuditTrailView.tsx
- authService.ts
- IRepository.ts
- emailPublishing.test.ts
- roster-editing-dialogs.cjs
- settings-save.cjs
- peopleImport.ts
- dayView.test.ts
- NSC Clinic Roster: complete project guide
- explainCell.test.ts
- RosterGrid
- approvedDayOff.test.ts
- leaveGuard.ts
- quotaTracker
- Phase 3: roster grid speed and structure
- ref_node_assert
- grid-timing.cjs
- scripts
- rowsInSteps.ts
- checkScheduler.test.ts
- my-requests.cjs
- PublishedRosterSheet.tsx
- react
- doctorForm.ts
- createLiveReconciler
- PublishedRosterView.tsx
- allowance.cjs
- diffEngine.ts
- usePresence.ts
- usePhoneLayout.ts
- nurseRoster.test.ts
- nurse-page.cjs
- publicRosterService.ts
- form-dialogs.cjs
- history.cjs
- toolbar.cjs
- nurseForm.ts
- requests.cjs
- leave-grid.cjs
- plain-english-reviewer.md
- time-periods.cjs
- WhoCanCover.tsx
- access.cjs
- grid-flow.cjs
- publish.cjs
- request-clinic-dialogs.cjs
- sheet-tabs.cjs
- resume.cjs
- sent-rosters.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `16. History of work (for context)` - 117 edges
3. `Assignment` - 112 edges
4. `Nurse` - 106 edges
5. `getRepository()` - 99 edges
6. `DutyWindow` - 94 edges
7. `Schedule` - 92 edges
8. `formatDate()` - 90 edges
9. `lucide-react` - 89 edges
10. `Button()` - 87 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `4. What Phases 4 and 5 did (guide items 59 to 72)` --references--> `decideRequest()`  [INFERRED]
  tasks/handover.md → src/services/requests/staffRequestService.ts
- `6. Points to know` --references--> `decideRequest()`  [INFERRED]
  tasks/handover.md → src/services/requests/staffRequestService.ts

## Import Cycles
- None detected.

## Communities (160 total, 29 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (55): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps, ReportsView(), SortField (+47 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (56): 7. Rules, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, DayProblem, DayRow, dayViewOf(), KIND (+48 more)

### Community 2 - "fixtures.ts"
Cohesion: 0.11
Nodes (17): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), UNPAID_LEAVE, LONG, NOV, OCT, D (+9 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (27): Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D, DOCTORS (+19 more)

### Community 4 - "authService"
Cohesion: 0.16
Nodes (3): authService, computePrivileges(), getAppAuth()

### Community 5 - "NursesView.tsx"
Cohesion: 0.30
Nodes (12): uuid, BulkImportModal(), TemplateModal(), Textarea(), TabPanel(), Tabs(), NursesView(), readNurseRows() (+4 more)

### Community 6 - "SettingsView.tsx"
Cohesion: 0.14
Nodes (44): useAppContext(), confirmDialog(), notify(), Field(), Input(), ClinicTab(), DatabaseTab(), DatabaseTabProps (+36 more)

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
Nodes (44): CellContextMenu(), cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), SOURCE_SPOKEN (+36 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.30
Nodes (8): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar()

### Community 14 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 15 - "seedRunner.ts"
Cohesion: 0.12
Nodes (24): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+16 more)

### Community 16 - "assignmentChecks.ts"
Cohesion: 0.08
Nodes (40): 6. Clinic model (the business rules in plain English), Other engine files, RuleDef, checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween() (+32 more)

### Community 17 - ".list"
Cohesion: 0.13
Nodes (18): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments() (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.10
Nodes (25): jose, authMiddleware(), AuthUser, BackendRole, Express, Request, requireOwner, ROLE_HIERARCHY (+17 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "analysisExportService.ts"
Cohesion: 0.07
Nodes (41): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), isLateDuty(), lateDutyThreshold(), ANALYSIS_FORMAT_VERSION, analysisFileName() (+33 more)

### Community 22 - "App.tsx"
Cohesion: 0.16
Nodes (11): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+3 more)

### Community 23 - "emailService.ts"
Cohesion: 0.14
Nodes (17): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+9 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "GridTable.tsx"
Cohesion: 0.21
Nodes (22): CellView, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL (+14 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.10
Nodes (27): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, documentUrl() (+19 more)

### Community 28 - "16. History of work (for context)"
Cohesion: 0.19
Nodes (15): 16. History of work (for context), CellChoice, DayColumn, ProblemMark, GridCell, moveInGrid(), pickStep(), AssignmentKind (+7 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (33): LeaveAndLocksSheet(), askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+25 more)

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
Cohesion: 0.20
Nodes (15): 3. Users, roles and access, signOutSafely(), usePermissions(), AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canApproveRequests() (+7 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.05
Nodes (42): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+34 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "authorizedFetch"
Cohesion: 0.27
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 38 - "PublishView.tsx"
Cohesion: 0.14
Nodes (30): EmailHtmlPreview(), PublishModal(), Step, Card(), DataTable(), Select(), EmptyState(), ErrorState() (+22 more)

### Community 39 - "RulesTab.tsx"
Cohesion: 0.20
Nodes (14): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup, RulesTab() (+6 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (78): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps (+70 more)

### Community 42 - "VersionCompareModal.tsx"
Cohesion: 0.25
Nodes (13): fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, CHANGE_LABELS, CHANGE_TONES, VersionCompareModal(), Column (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.14
Nodes (21): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), findStoppedPublish(), isDone(), isResumable(), lastNews() (+13 more)

### Community 46 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "getRepository"
Cohesion: 0.11
Nodes (44): 13. Screens in detail, PageHeader(), AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter, AvailabilityView() (+36 more)

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
Cohesion: 0.12
Nodes (30): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+22 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "CollectionSyncer"
Cohesion: 0.07
Nodes (19): 11. Saving, live updates, versions, useRosterEdits(), clearYearToDateCache(), forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known (+11 more)

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

### Community 65 - "makeNurse"
Cohesion: 0.08
Nodes (17): ScheduleValidator, ctx(), EARLY, LATE, JUNIOR, LEVELS, NC, PHL (+9 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "HistoryView.tsx"
Cohesion: 0.21
Nodes (24): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), DeleteVersionModalProps, plural(), VersionViewModal(), IconButton() (+16 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (19): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+11 more)

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

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 77 - "IRepository"
Cohesion: 0.11
Nodes (23): saveHolidayLeave(), repositoryManager, IRepository, doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), missingPatternSessions(), nextDay() (+15 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 80 - "formatDate"
Cohesion: 0.17
Nodes (39): CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, ExportModal() (+31 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.27
Nodes (13): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+5 more)

### Community 83 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 84 - "makeSchedule"
Cohesion: 0.07
Nodes (30): SchedulingEngine, hoursOnlyRules(), makeSchedule(), SENIOR, LATE, run(), setup(), CARD (+22 more)

### Community 85 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (26): loadViewerData(), ClinicTabProps, addDaysIso(), buildNurseRosterDoc(), BuildNurseRosterInput, buildTeamRosterSheet(), ensureNurseLink(), latestPublishedVersions() (+18 more)

### Community 86 - "cellView.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, CellDay, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+11 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "gridSelection.ts"
Cohesion: 0.11
Nodes (20): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf() (+12 more)

### Community 89 - "types/index.ts"
Cohesion: 0.06
Nodes (33): accessStatusWord(), accessWords(), roleWords(), isPairing(), PREFERENCE_FOCUS_LABELS, InternalSlot, KIND_LABELS, FIELDS (+25 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (17): PageLoading(), Card(), DashboardView(), loadPlannerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+9 more)

### Community 91 - "ClinicContextState"
Cohesion: 0.08
Nodes (29): AppContext, AppContextValue, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), AvailabilityViewProps, DoctorsViewProps (+21 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "MyRosterView.tsx"
Cohesion: 0.24
Nodes (9): LoadState, MyRosterViewProps, MyDay, myShiftDays(), nurseCalendarUrl(), nurseWebcalUrl(), origin(), NurseRosterDoc (+1 more)

### Community 94 - "Sidebar.tsx"
Cohesion: 0.31
Nodes (10): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar(), SidebarProps (+2 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

### Community 98 - "UI overhaul: checklist"
Cohesion: 0.15
Nodes (11): useLatestCallback(), Phase 0: setup, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

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
Cohesion: 0.16
Nodes (12): express, @google/genai, authRouter, calendarRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 111 - "AuditTrailView.tsx"
Cohesion: 0.16
Nodes (15): ConfirmBox(), DialogHost(), dismissNotice(), setState(), settleConfirm(), dialogsChanged(), isAnyDialogOpen(), onDialogsChange() (+7 more)

### Community 112 - "authService.ts"
Cohesion: 0.17
Nodes (13): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL, UserPrivileges, UserProfile (+5 more)

### Community 113 - "IRepository.ts"
Cohesion: 0.17
Nodes (12): FirebaseClientConfig, FirestoreRepository, sanitizePayload(), SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList() (+4 more)

### Community 114 - "emailPublishing.test.ts"
Cohesion: 0.11
Nodes (13): nodemailer, EmailReadiness, readEmailResponse(), RosterPublishService, configured, live, all, backup (+5 more)

### Community 117 - "peopleImport.ts"
Cohesion: 0.16
Nodes (16): addDays(), MONTHS, nextPeriodDefaults(), parse(), PeriodDefaults, sameDayNextMonth(), toIso(), cellsOf() (+8 more)

### Community 118 - "dayView.test.ts"
Cohesion: 0.20
Nodes (8): firstDayShown(), isPhoneSize(), amy, LEE, lookups, mary, nina, shift

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 120 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

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

### Community 125 - "Phase 3: roster grid speed and structure"
Cohesion: 0.21
Nodes (8): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), cellKeyOf(), useGridSelection(), Phase 3: roster grid speed and structure, base

### Community 126 - "ref_node_assert"
Cohesion: 0.11
Nodes (13): addDays(), iso(), monthEnd(), suggestNewRosterDates(), MONTHS, suggestRosterName(), AL, DAY_OFF (+5 more)

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
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "PublishedRosterSheet.tsx"
Cohesion: 0.46
Nodes (5): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), weekdayOf(), safeColor()

### Community 133 - "react"
Cohesion: 0.07
Nodes (41): lucide-react, react, ConfirmOptions, DialogState, listeners, Notice, NoticeTone, PendingConfirm (+33 more)

### Community 134 - "doctorForm.ts"
Cohesion: 0.22
Nodes (10): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+2 more)

### Community 135 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 136 - "PublishedRosterView.tsx"
Cohesion: 0.33
Nodes (9): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+1 more)

### Community 138 - "diffEngine.ts"
Cohesion: 0.24
Nodes (8): ChangeType, computeScheduleDiff(), formatAssignment(), FormattedAssignmentState, WEEKDAY_NAMES, diff(), LATE, nurse

### Community 139 - "usePresence.ts"
Cohesion: 0.29
Nodes (7): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 140 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 141 - "nurseRoster.test.ts"
Cohesion: 0.20
Nodes (7): dayMonth(), formatRosterAsText(), NURSE_TOKEN_PATTERN, base, dutyWindows, refs, schedule

### Community 143 - "publicRosterService.ts"
Cohesion: 0.31
Nodes (6): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), deleteEntireSchedule(), ScheduleDeleteResult

### Community 147 - "nurseForm.ts"
Cohesion: 0.32
Nodes (5): checkNurseForm(), movePreference(), NurseFormErrors, NurseFormValues, others

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 152 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

## Knowledge Gaps
- **1005 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1000 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1223 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `rowsInSteps.ts`, `PublishedRosterSheet.tsx`, `NursesView.tsx`, `SettingsView.tsx`, `PublishedRosterView.tsx`, `package.json`, `WorkbookGrid.tsx`, `usePresence.ts`, `usePhoneLayout.ts`, `RosterToolbar.tsx`, `NurseSample.tsx`, `App.tsx`, `WhoCanCover.tsx`, `GridTable.tsx`, `PlannerSample.tsx`, `ui.tsx`, `access.ts`, `PublishView.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `VersionCompareModal.tsx`, `getRepository`, `AppShell.tsx`, `HistoryView.tsx`, `formatDate`, `gridSelection.ts`, `DashboardView.tsx`, `ClinicContextState`, `harness/main.tsx`, `MyRosterView.tsx`, `Sidebar.tsx`, `UI overhaul: checklist`, `AuditTrailView.tsx`, `authService.ts`, `NSC Clinic Roster: complete project guide`, `Phase 3: roster grid speed and structure`, `ref_node_assert`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `PublishedRosterSheet.tsx`, `NursesView.tsx`, `SettingsView.tsx`, `PublishedRosterView.tsx`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `NurseSample.tsx`, `App.tsx`, `GridTable.tsx`, `PlannerSample.tsx`, `ui.tsx`, `access.ts`, `PublishView.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `VersionCompareModal.tsx`, `getRepository`, `AppShell.tsx`, `HistoryView.tsx`, `formatDate`, `DashboardView.tsx`, `ClinicContextState`, `harness/main.tsx`, `MyRosterView.tsx`, `Sidebar.tsx`, `AuditTrailView.tsx`, `authService.ts`, `Phase 3: roster grid speed and structure`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 116 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 116 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1005 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07115384615384615 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08231569425599276 - nodes in this community are weakly interconnected._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10695187165775401 - nodes in this community are weakly interconnected._