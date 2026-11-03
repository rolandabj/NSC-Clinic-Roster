# Graph Report - NSC-Clinic-Roster  (2026-11-03)

## Corpus Check
- 427 files · ~437,387 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2999 nodes · 10335 edges · 173 communities (142 shown, 31 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 441 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b46c3d78`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- nurseRosterService.ts
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
- usePhoneLayout.ts
- Assignment
- seedRunner.ts
- handMoves.test.ts
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- App.tsx
- emailService.ts
- devDependencies
- authService.ts
- quick reference
- decisionEmail.test.ts
- checkScheduler.test.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- navigation.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- dateUtils.ts
- CreateScheduleModal.tsx
- fixtures.ts
- Optimization Patterns
- DutyWindow
- EntityForCollection
- rules.test.mjs
- Frontend UI Engineering
- PublishModal.tsx
- weekHours.test.ts
- firestore-rules/package.json
- Button
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
- explainCell.ts
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
- emailPublishing.test.ts
- holidayLeave.ts
- apiApp.ts
- cx
- links.cjs
- icsExportService.ts
- cellView.test.ts
- makeNurse
- LiveCollectionCache
- staffRequestService.ts
- UI overhaul: summary and next steps
- PublishView.tsx
- types/index.ts
- DashboardView.tsx
- IRepository.ts
- harness/main.tsx
- teamRoster.test.ts
- myRequests.ts
- Finish a change
- Rules
- hoursRules.test.ts
- SchedulesView.tsx
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- geminiApi.test.ts
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- leaveImport.ts
- savingSafety.test.ts
- firestoreRest.ts
- yearToDate.ts
- FirestoreRepository
- HistoryView.tsx
- RosterToolbar.tsx
- usePresence.ts
- peopleImport.ts
- authorizedFetch
- NSC Clinic Roster: complete project guide
- AvailabilityView.tsx
- RosterGrid
- approvedDayOff.test.ts
- leaveGuard.ts
- quotaTracker
- 16. History of work (for context)
- ref_node_assert
- grid-timing.cjs
- scripts
- MyRosterView.tsx
- Nurse
- my-requests.cjs
- request-clinic-dialogs.cjs
- react
- Getting started
- requests.cjs
- analysisExport.test.ts
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
- doctorWeekChange.test.ts
- ScheduleValidator.ts
- address.ts
- nurseClinicFloat.test.ts
- resume.cjs
- time-periods.cjs
- preferenceOrder.ts
- ProblemCounts
- nurseRoster.test.ts
- shiftIds.test.ts
- The Five-Axis Review
- WhoCanCover.tsx
- versionRestore.test.ts
- Review Process
- resumePublish.test.ts
- editSaving.test.ts
- PublishedRosterView
- Phase 3: roster grid speed and structure

## God Nodes (most connected - your core abstractions)
1. `16. History of work (for context)` - 126 edges
2. `react` - 119 edges
3. `Assignment` - 112 edges
4. `Nurse` - 105 edges
5. `getRepository()` - 99 edges
6. `Button()` - 93 edges
7. `DutyWindow` - 93 edges
8. `formatDate()` - 92 edges
9. `Schedule` - 91 edges
10. `lucide-react` - 89 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `17. Known quirks and ideas for later` --references--> `doctorSessionsOn()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/clinicModel.ts

## Import Cycles
- None detected.

## Communities (173 total, 31 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (54): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, FLOAT_ROLE_ID (+46 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (52): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+44 more)

### Community 2 - "nurseRosterService.ts"
Cohesion: 0.20
Nodes (16): dateLabel(), PublishedRosterSheet(), MyRosterView(), dayMonth(), formatRosterAsText(), NURSE_ROSTER_LOOKBACK_DAYS, nurseCalendarUrl(), nurseWebcalUrl() (+8 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (27): Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D, DOCTORS (+19 more)

### Community 5 - "GridTable.tsx"
Cohesion: 0.07
Nodes (43): CellView, DayTotal, problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL (+35 more)

### Community 6 - "getRepository"
Cohesion: 0.14
Nodes (48): uuid, confirmDialog(), notify(), NONE, SwapManagerModal(), Field(), Input(), ClinicTab() (+40 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (17): firebase, name, private, type, version, esbuild, @google/genai, jose (+9 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.06
Nodes (56): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, RosterDayView() (+48 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 14 - "Assignment"
Cohesion: 0.21
Nodes (30): 5. Data model (Firestore collections), ExportModalProps, FairnessModalProps, NONE, ProposedSwap, PublishModalProps, SwapManagerModalProps, TemplateModalProps (+22 more)

### Community 15 - "seedRunner.ts"
Cohesion: 0.10
Nodes (26): ClinicTabProps, countOf(), assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges() (+18 more)

### Community 16 - "handMoves.test.ts"
Cohesion: 0.09
Nodes (28): Other engine files, listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields(), suggestMoves() (+20 more)

### Community 17 - "IRepository"
Cohesion: 0.11
Nodes (26): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster() (+18 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (19): authMiddleware(), AuthUser, Express, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields, cacheKey() (+11 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.08
Nodes (47): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, BarList(), hours(), Meter() (+39 more)

### Community 22 - "App.tsx"
Cohesion: 0.12
Nodes (16): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+8 more)

### Community 23 - "emailService.ts"
Cohesion: 0.20
Nodes (11): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+3 more)

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, esbuild, tailwindcss, @types/express, @types/node, @types/nodemailer, @types/react, @types/react-dom (+2 more)

### Community 25 - "authService.ts"
Cohesion: 0.15
Nodes (19): LoginPageProps, signOutSafely(), AppShellProps, AccountMenu(), TopBar(), AuthModal(), AuthModalProps, AccessManagementPanelProps (+11 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+12 more)

### Community 28 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 29 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (34): askedCarry(), closePeriod(), earlierPeriodTotals(), hoursCheckpoints(), HoursPart, HoursSchedule, Leftover, MAX_CARRY_PERIODS (+26 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "navigation.ts"
Cohesion: 0.17
Nodes (20): 3. Users, roles and access, 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar() (+12 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.11
Nodes (17): Change Descriptions, Change Sizing, Code Review and Quality, Common Rationalizations, Dead Code Hygiene, Dependency Discipline, Handling Disagreements, Honesty in Review (+9 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "dateUtils.ts"
Cohesion: 0.17
Nodes (19): Card(), AUDIT_PAGE_SIZE, AuditTrailView(), ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields() (+11 more)

### Community 38 - "CreateScheduleModal.tsx"
Cohesion: 0.23
Nodes (11): CreateScheduleModal(), EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, doctorFromDate(), generateDoctorSessionsForDateRange(), nextDay() (+3 more)

### Community 39 - "fixtures.ts"
Cohesion: 0.09
Nodes (22): 15. Tests, EARLY, input(), LATE, softHoursLimit, week, ANNUAL_LEAVE, DAY_DUTY (+14 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "DutyWindow"
Cohesion: 0.14
Nodes (36): VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, EditDoctorShiftModalProps, VersionCompareModalProps, VersionViewModalProps, RosterPickerProps (+28 more)

### Community 42 - "EntityForCollection"
Cohesion: 0.13
Nodes (7): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, EntityForCollection

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "PublishModal.tsx"
Cohesion: 0.10
Nodes (33): 12. Publishing and nurse links, Request, Step, AssignmentDiffItem, computeScheduleDiff(), formatAssignment(), FormattedAssignmentState, WEEKDAY_NAMES (+25 more)

### Community 46 - "weekHours.test.ts"
Cohesion: 0.12
Nodes (17): RuleDef, LATE_DUTY_RULE_WORDS, addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WEEK_HOURS_DEFAULT, WEEK_HOURS_RULE (+9 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "Button"
Cohesion: 0.12
Nodes (60): NoticeTone, VersionRoster(), BulkImportModal(), DeleteScheduleModal(), DeleteVersionModal(), plural(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps (+52 more)

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
Cohesion: 0.13
Nodes (27): AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+19 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "dialogs.tsx"
Cohesion: 0.11
Nodes (27): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+19 more)

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

### Community 65 - "explainCell.ts"
Cohesion: 0.21
Nodes (13): 7. Rules, BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift, RequestWords, round1() (+5 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "ClinicContextState"
Cohesion: 0.13
Nodes (17): TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+9 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+12 more)

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
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.18
Nodes (10): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+2 more)

### Community 77 - "emailPublishing.test.ts"
Cohesion: 0.22
Nodes (9): nodemailer, checkEmailReadiness(), EmailReadiness, readEmailResponse(), cache(), saveEmailSettings(), DEFAULT_EMAIL_SETTINGS, configured (+1 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.18
Nodes (11): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+3 more)

### Community 80 - "cx"
Cohesion: 0.18
Nodes (18): cx(), ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup (+10 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.27
Nodes (13): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+5 more)

### Community 83 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 84 - "makeNurse"
Cohesion: 0.08
Nodes (26): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account(), CARD (+18 more)

### Community 85 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 86 - "staffRequestService.ts"
Cohesion: 0.18
Nodes (14): allowanceFor(), Kind, takesAllowance(), dayOffLockId(), daysInclusive(), isPendingLeave(), PendingAvailabilityItem, PendingLeaveItem (+6 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "PublishView.tsx"
Cohesion: 0.20
Nodes (14): EmailHtmlPreview(), PublishModal(), ShareModal(), ResumePublish(), Textarea(), SENDS_PER_PAGE, SentTab, ensurePublicRosters() (+6 more)

### Community 89 - "types/index.ts"
Cohesion: 0.08
Nodes (25): KIND_LABELS, FIELDS, rebaseRules(), ruleChanges(), same(), ApprovalStatus, BlockWeeks, DoctorSessionSource (+17 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.24
Nodes (12): loadPlannerData(), PlannerData, readStoredId(), ViewerData, addDays(), countChangedCells(), NEXT_ROSTER_WARNING_DAYS, nextRosterNeeded() (+4 more)

### Community 91 - "IRepository.ts"
Cohesion: 0.21
Nodes (9): FirebaseClientConfig, SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList(), PageRequest, CollectionName (+1 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "teamRoster.test.ts"
Cohesion: 0.26
Nodes (13): loadViewerData(), addDaysIso(), buildNurseRosterDoc(), buildTeamRosterSheet(), latestPublishedVersions(), shiftDetail(), syncNurseRosters(), todayIso() (+5 more)

### Community 94 - "myRequests.ts"
Cohesion: 0.29
Nodes (9): checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors, leaveStatus(), MyRequest, myRequestList(), range() (+1 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "hoursRules.test.ts"
Cohesion: 0.10
Nodes (15): SchedulingEngine, D, E, L, NC, PHL, SENIOR, week (+7 more)

### Community 98 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (21): useAppContext(), useLatestCallback(), RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), useRosterEdits(), readStoredScheduleId() (+13 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): args, { chromium }, args, { chromium }, { chromium }, args, { chromium }, args (+5 more)

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

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "leaveImport.ts"
Cohesion: 0.22
Nodes (9): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), leaves, pins, AL, nurses (+1 more)

### Community 110 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (8): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, rebaseEdit()

### Community 111 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 112 - "yearToDate.ts"
Cohesion: 0.12
Nodes (24): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+16 more)

### Community 113 - "FirestoreRepository"
Cohesion: 0.21
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 114 - "HistoryView.tsx"
Cohesion: 0.11
Nodes (28): shiftTargetName(), WEEKDAY_NAMES, DeleteVersionModalProps, ShareModalProps, CHANGE_LABELS, CHANGE_TONES, CHANGE_WORDS, KIND_TONES (+20 more)

### Community 115 - "RosterToolbar.tsx"
Cohesion: 0.20
Nodes (13): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+5 more)

### Community 116 - "usePresence.ts"
Cohesion: 0.23
Nodes (9): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), planSync(), PresenceRecord, Phase 3: roster grid speed and structure (+1 more)

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (33): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, usualWeekLines(), WEEKDAY_NAMES, addDays() (+25 more)

### Community 118 - "authorizedFetch"
Cohesion: 0.27
Nodes (9): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload (+1 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.33
Nodes (6): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide

### Community 120 - "AvailabilityView.tsx"
Cohesion: 0.16
Nodes (21): 13. Screens in detail, Switch(), ApprovalsQueuePanel(), Waiting, AvailabilityView(), WEEKDAY_ABBR, GridCell, moveInGrid() (+13 more)

### Community 121 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 124 - "quotaTracker"
Cohesion: 0.13
Nodes (8): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 125 - "16. History of work (for context)"
Cohesion: 0.33
Nodes (10): 16. History of work (for context), CellChoice, AssignmentKind, addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange() (+2 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.10
Nodes (13): addDays(), iso(), monthEnd(), suggestNewRosterDates(), MONTHS, suggestRosterName(), ctx(), EARLY (+5 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 129 - "MyRosterView.tsx"
Cohesion: 0.33
Nodes (6): LoadState, MyRosterViewProps, MyDay, myShiftDays(), NurseRosterDoc, NurseRosterShift

### Community 130 - "Nurse"
Cohesion: 0.22
Nodes (7): NurseFairnessMetrics, AllRequestsPanelProps, CoverageSheetProps, GridRowProps, OutsideList, ResumePlan, Nurse

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "react"
Cohesion: 0.10
Nodes (32): lucide-react, react, LocalModeBannerProps, GROUPS, Key(), ShortcutsModal(), ShortcutsModalProps, PROBLEM_MARKS (+24 more)

### Community 134 - "Getting started"
Cohesion: 0.22
Nodes (7): Built with, Development, Getting started, NSC Clinic Roster, Production build, Tests, What it does

### Community 136 - "analysisExport.test.ts"
Cohesion: 0.25
Nodes (8): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift()

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 155 - "doctorWeekChange.test.ts"
Cohesion: 0.13
Nodes (12): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, DR_PEDS (+4 more)

### Community 156 - "ScheduleValidator.ts"
Cohesion: 0.18
Nodes (14): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, isAgreedException(), isLastResortShift(), LAST_RESORT_NOTE (+6 more)

### Community 157 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 158 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 161 - "preferenceOrder.ts"
Cohesion: 0.29
Nodes (7): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, PreferenceFocus

### Community 162 - "ProblemCounts"
Cohesion: 0.39
Nodes (5): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), render()

### Community 163 - "nurseRoster.test.ts"
Cohesion: 0.25
Nodes (5): NURSE_TOKEN_PATTERN, base, dutyWindows, refs, schedule

### Community 164 - "shiftIds.test.ts"
Cohesion: 0.25
Nodes (7): dates, doctors, fill(), LATE, nurses, schedule, sessions

### Community 165 - "The Five-Axis Review"
Cohesion: 0.29
Nodes (7): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, The Five-Axis Review, data()

### Community 166 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 167 - "versionRestore.test.ts"
Cohesion: 0.29
Nodes (4): BACKUPS_KEPT, october, octoberVersion, september

### Community 168 - "Review Process"
Cohesion: 0.33
Nodes (6): Review Process, Step 1: Understand the Context, Step 2: Review the Tests First, Step 3: Review the Implementation, Step 4: Categorize Findings, Step 5: Verify the Verification

### Community 169 - "resumePublish.test.ts"
Cohesion: 0.40
Nodes (4): STOPPED_AFTER_MS, rec(), resumeOpts, stopped()

### Community 170 - "editSaving.test.ts"
Cohesion: 0.47
Nodes (4): changedLists(), sameItems(), countedShift(), shift()

### Community 171 - "PublishedRosterView"
Cohesion: 0.67
Nodes (4): PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), loadPublicRoster()

### Community 172 - "Phase 3: roster grid speed and structure"
Cohesion: 0.67
Nodes (3): cellKeyOf(), useGridSelection(), Phase 3: roster grid speed and structure

## Knowledge Gaps
- **1007 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1002 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1228 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `MyRosterView.tsx`, `nurseRosterService.ts`, `Nurse`, `GridTable.tsx`, `getRepository`, `package.json`, `WorkbookGrid.tsx`, `usePhoneLayout.ts`, `Assignment`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `authService.ts`, `ScheduleValidator.ts`, `PlannerSample.tsx`, `ui.tsx`, `navigation.ts`, `ProblemCounts`, `dateUtils.ts`, `CreateScheduleModal.tsx`, `WhoCanCover.tsx`, `fixtures.ts`, `DutyWindow`, `Phase 3: roster grid speed and structure`, `PublishModal.tsx`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `cx`, `PublishView.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `SchedulesView.tsx`, `HistoryView.tsx`, `RosterToolbar.tsx`, `usePresence.ts`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `MyRosterView.tsx`, `nurseRosterService.ts`, `Nurse`, `GridTable.tsx`, `getRepository`, `package.json`, `WorkbookGrid.tsx`, `Assignment`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `authService.ts`, `ScheduleValidator.ts`, `PlannerSample.tsx`, `ui.tsx`, `navigation.ts`, `ProblemCounts`, `dateUtils.ts`, `CreateScheduleModal.tsx`, `DutyWindow`, `PublishModal.tsx`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `cx`, `PublishView.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `SchedulesView.tsx`, `HistoryView.tsx`, `RosterToolbar.tsx`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `ExportModal.tsx`, `MyRosterView.tsx`, `SchedulingEngine.ts`, `react`, `getRepository`, `GridTable.tsx`, `WorkbookGrid.tsx`, `usePhoneLayout.ts`, `Assignment`, `seedRunner.ts`, `ReportsView.tsx`, `App.tsx`, `authService.ts`, `checkScheduler.test.ts`, `address.ts`, `navigation.ts`, `ProblemCounts`, `dateUtils.ts`, `editSaving.test.ts`, `Phase 3: roster grid speed and structure`, `PublishModal.tsx`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `staffRequestService.ts`, `PublishView.tsx`, `types/index.ts`, `IRepository.ts`, `myRequests.ts`, `SchedulesView.tsx`, `leaveImport.ts`, `firestoreRest.ts`, `FirestoreRepository`, `HistoryView.tsx`, `RosterToolbar.tsx`, `usePresence.ts`, `peopleImport.ts`, `NSC Clinic Roster: complete project guide`, `AvailabilityView.tsx`, `leaveGuard.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 125 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 125 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1007 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07373271889400922 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09943502824858758 - nodes in this community are weakly interconnected._