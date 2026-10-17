# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 408 files · ~427,399 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2921 nodes · 9985 edges · 161 communities (134 shown, 27 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 429 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea0ad9d2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- fixtures.ts
- clinicModel.test.ts
- authService
- formatDate
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- RosterToolbar.tsx
- sharing.test.ts
- FirestoreRepository.ts
- Sidebar.tsx
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
- 16. History of work (for context)
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- authService.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- EmailTab.tsx
- doctorForm.ts
- RulesTab.tsx
- Optimization Patterns
- SchedulesView.tsx
- IRepository
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- analysisExport.test.ts
- firestore-rules/package.json
- staffRequestService.ts
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
- published-rules.mjs
- dialogs.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- weekHours.test.ts
- holidayLeave.ts
- createApiApp
- ProblemsPanel.tsx
- links.cjs
- icsExportService.ts
- CellEditorDialog.tsx
- makeNurse
- versionRestore.test.ts
- cellView.test.ts
- UI overhaul: summary and next steps
- gridSelection.ts
- types/index.ts
- DashboardView.tsx
- dayView.ts
- harness/main.tsx
- nurseRosterService.ts
- firestoreRest.ts
- Finish a change
- Rules
- FairnessModal.tsx
- savingSafety.test.ts
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
- LiveCollectionCache
- AvailabilityView.tsx
- PublishView.tsx
- ClinicContextState
- FirestoreRepository
- nurseClinicFloat.test.ts
- The Five-Axis Review
- publicRosterService.ts
- peopleImport.ts
- UI overhaul: checklist
- ClinicRoster
- NSC Clinic Roster: complete project guide
- RosterSteps.tsx
- approvedDayOff.test.ts
- formatDayDate
- quotaTracker
- checkScheduler.test.ts
- ref_node_assert
- grid-timing.cjs
- leaveImport.ts
- 13. Screens in detail
- versionKinds.test.ts
- my-requests.cjs
- hoursRules.test.ts
- react
- leaveAllowance.test.ts
- createLiveReconciler
- rowsInSteps.ts
- allowance.cjs
- public-pages.cjs
- newRosterDates.ts
- nurse-editor.cjs
- history.cjs
- nurse-page.cjs
- ddmmyyyy
- form-dialogs.cjs
- grid-flow.cjs
- toolbar.cjs
- explainCell.test.ts
- WhoCanCover.tsx
- leave-grid.cjs
- plain-english-reviewer.md
- doctorWeekChange.test.ts
- WarningsSheet.tsx
- roster-dialogs.cjs
- ShortcutsModal.tsx
- Review Process
- publish.cjs
- resume.cjs
- sent-rosters.cjs
- settings-dialogs.cjs
- sheet-tabs.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `16. History of work (for context)` - 116 edges
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
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (161 total, 27 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.06
Nodes (56): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps, SortField, TabMode (+48 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (73): 6. Clinic model (the business rules in plain English), 7. Rules, RosterToolbarProps, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate() (+65 more)

### Community 2 - "fixtures.ts"
Cohesion: 0.11
Nodes (17): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, LONG, NOV, OCT (+9 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 5 - "formatDate"
Cohesion: 0.18
Nodes (45): NoticeTone, BulkImportModal(), CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal() (+37 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (50): confirmDialog(), notify(), Field(), Input(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTab() (+42 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.06
Nodes (30): firebase, name, private, scripts, build, clean, dev, lint (+22 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (42): useRosterEdits(), CellContextMenu(), cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames() (+34 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.12
Nodes (17): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+9 more)

### Community 14 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 15 - "FirestoreRepository.ts"
Cohesion: 0.23
Nodes (14): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+6 more)

### Community 16 - "Sidebar.tsx"
Cohesion: 0.33
Nodes (9): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps (+1 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.11
Nodes (27): saveRosterBackup(), restoreVersion(), ensureNurseLink(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), deleteDoctorShift() (+19 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): authMiddleware(), AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields (+15 more)

### Community 19 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.12
Nodes (24): nurseClinicRoleOf(), YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), isLateDuty(), clamp(), KEYS (+16 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.11
Nodes (21): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+13 more)

### Community 23 - "emailService.ts"
Cohesion: 0.14
Nodes (16): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+8 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "GridTable.tsx"
Cohesion: 0.11
Nodes (27): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+19 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+12 more)

### Community 28 - "16. History of work (for context)"
Cohesion: 0.13
Nodes (22): 16. History of work (for context), dayViewOf(), firstDayShown(), isPhoneSize(), RosterDayView(), cellSummary(), dayTotalsOf(), DayColumn (+14 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (33): LeaveAndLocksSheet(), askedCarry(), closePeriod(), earlierPeriodTotals(), hoursHistoryOverlaps(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+25 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "authService.ts"
Cohesion: 0.15
Nodes (19): LoginPageProps, signOutSafely(), AppShellProps, AccountMenu(), TopBar(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+11 more)

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
Cohesion: 0.16
Nodes (16): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+8 more)

### Community 38 - "doctorForm.ts"
Cohesion: 0.22
Nodes (10): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+2 more)

### Community 39 - "RulesTab.tsx"
Cohesion: 0.10
Nodes (29): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+21 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (81): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps (+73 more)

### Community 42 - "IRepository"
Cohesion: 0.15
Nodes (13): saveHolidayLeave(), repositoryManager, IRepository, DeleteDoctorShiftParams, doctorFromDate(), nextDay(), PatternSessionPlan, planPatternSessions() (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.15
Nodes (20): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), findStoppedPublish(), isDone(), isResumable(), lastNews() (+12 more)

### Community 46 - "analysisExport.test.ts"
Cohesion: 0.14
Nodes (13): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+5 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.32
Nodes (11): canApproveRequests(), dayOffLockId(), deleteAvailabilityRequest(), isPendingLeave(), listPendingApprovals(), PendingAvailabilityItem, PendingLeaveItem, recordHolidayDayOff() (+3 more)

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
Nodes (31): dialogsChanged(), openListeners, openStack, useDialogA11y(), AppShell(), bootstrap(), AuditTrailView, AvailabilityView (+23 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "EntityForCollection"
Cohesion: 0.16
Nodes (3): 11. Saving, live updates, versions, CollectionSyncer, EntityForCollection

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
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "HistoryView.tsx"
Cohesion: 0.17
Nodes (26): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), plural(), CHANGE_LABELS, CHANGE_TONES, VersionViewModal() (+18 more)

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
Cohesion: 0.14
Nodes (22): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+14 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 77 - "weekHours.test.ts"
Cohesion: 0.10
Nodes (11): ScheduleValidator, DR_PEDS, ENT, FULL, PEDS, RULES, EARLY, LATE (+3 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.29
Nodes (11): 10. Hours, forgetCachedRoster(), applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange() (+3 more)

### Community 79 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 80 - "ProblemsPanel.tsx"
Cohesion: 0.23
Nodes (9): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), ProblemsPanel(), ProblemsPanelProps, SEVERITY, ValidationFinding (+1 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "CellEditorDialog.tsx"
Cohesion: 0.28
Nodes (12): CellChoice, CellEditorDialog(), choiceClass(), withDr(), AssignmentKind, contrastRatio(), INK, INK_MUTED (+4 more)

### Community 84 - "makeNurse"
Cohesion: 0.09
Nodes (30): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+22 more)

### Community 85 - "versionRestore.test.ts"
Cohesion: 0.21
Nodes (7): BACKUPS_KEPT, VersionRestoreResult, fingerprint(), syncScheduleAssignments(), october, octoberVersion, september

### Community 86 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "gridSelection.ts"
Cohesion: 0.12
Nodes (19): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf() (+11 more)

### Community 89 - "types/index.ts"
Cohesion: 0.10
Nodes (22): KIND_LABELS, ApprovalStatus, BlockWeeks, DoctorSessionSource, EmailLogKind, Invitation, InvitationStatus, LockMode (+14 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (25): useAppContext(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+17 more)

### Community 91 - "dayView.ts"
Cohesion: 0.40
Nodes (4): DayProblem, DayRow, KIND, ORDER

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (24): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), dayMonth() (+16 more)

### Community 94 - "firestoreRest.ts"
Cohesion: 0.46
Nodes (7): documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "FairnessModal.tsx"
Cohesion: 0.07
Nodes (38): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, uuid, NONE, NurseFairnessMetrics, ProposedSwap (+30 more)

### Community 98 - "savingSafety.test.ts"
Cohesion: 0.08
Nodes (20): clearYearToDateCache(), Desired, fingerprint(), Known, planSync(), SyncPlan, queuesByRepo, RETRY_EVERY_MS (+12 more)

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
Cohesion: 0.14
Nodes (15): express, express-rate-limit, @google/genai, helmet, BackendRole, authRouter, calendarRouter, geminiRouter (+7 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 110 - "AvailabilityView.tsx"
Cohesion: 0.40
Nodes (7): PageHeader(), Switch(), AvailabilityView(), WEEKDAY_ABBR, GridCell, moveInGrid(), pickStep()

### Community 111 - "PublishView.tsx"
Cohesion: 0.14
Nodes (24): EmailHtmlPreview(), usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, ResumePublish(), Card() (+16 more)

### Community 112 - "ClinicContextState"
Cohesion: 0.12
Nodes (22): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+14 more)

### Community 114 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 115 - "The Five-Axis Review"
Cohesion: 0.29
Nodes (7): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, The Five-Axis Review, data()

### Community 116 - "publicRosterService.ts"
Cohesion: 0.17
Nodes (11): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster(), listPage(), Page, pageFromList() (+3 more)

### Community 117 - "peopleImport.ts"
Cohesion: 0.14
Nodes (16): cellsOf(), DoctorImportRow, NurseImportRow, readDoctorRows(), readNurseRows(), WEEKDAYS, checkNurseForm(), movePreference() (+8 more)

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.13
Nodes (12): 0. Quick start for a new chat, 12. Publishing and nurse links, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 3. Users, roles and access, NSC Clinic Roster: complete project guide (+4 more)

### Community 121 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "formatDayDate"
Cohesion: 0.36
Nodes (5): decisionTitle(), waitingDayText(), waitingLeaveText(), formatDayDate(), shifts

### Community 124 - "quotaTracker"
Cohesion: 0.11
Nodes (11): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker (+3 more)

### Community 125 - "checkScheduler.test.ts"
Cohesion: 0.10
Nodes (15): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks() (+7 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.10
Nodes (11): MONTHS, suggestRosterName(), diff(), LATE, nurse, nurses, nurses, published (+3 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "leaveImport.ts"
Cohesion: 0.21
Nodes (10): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), parseDayMonthYear(), leaves, pins, AL (+2 more)

### Community 129 - "13. Screens in detail"
Cohesion: 0.16
Nodes (15): 13. Screens in detail, useLatestCallback(), PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout(), checkDayRequest(), checkLeaveRequest() (+7 more)

### Community 130 - "versionKinds.test.ts"
Cohesion: 0.25
Nodes (7): all, backup, lastYear, none, published, saved, v()

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 133 - "react"
Cohesion: 0.08
Nodes (47): lucide-react, react, LocalModeBanner(), LocalModeBannerProps, PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone (+39 more)

### Community 134 - "leaveAllowance.test.ts"
Cohesion: 0.23
Nodes (9): allowanceFor(), Kind, takesAllowance(), daysInclusive(), requireNurseId(), submitLeaveRequest(), AL, DAY_OFF (+1 more)

### Community 135 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 136 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 139 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 143 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 147 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 148 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 151 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 152 - "WarningsSheet.tsx"
Cohesion: 0.33
Nodes (5): CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity

### Community 154 - "ShortcutsModal.tsx"
Cohesion: 0.50
Nodes (4): GROUPS, Key(), ShortcutsModal(), ShortcutsModalProps

### Community 155 - "Review Process"
Cohesion: 0.33
Nodes (6): Review Process, Step 1: Understand the Context, Step 2: Review the Tests First, Step 3: Review the Implementation, Step 4: Categorize Findings, Step 5: Verify the Verification

## Knowledge Gaps
- **993 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+988 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1209 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `13. Screens in detail`, `formatDate`, `getRepository`, `rowsInSteps.ts`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `Sidebar.tsx`, `WhoCanCover.tsx`, `PublishedRosterView.tsx`, `WarningsSheet.tsx`, `GridTable.tsx`, `ShortcutsModal.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `EmailTab.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `AppShell.tsx`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `ProblemsPanel.tsx`, `CellEditorDialog.tsx`, `makeNurse`, `gridSelection.ts`, `DashboardView.tsx`, `harness/main.tsx`, `nurseRosterService.ts`, `FairnessModal.tsx`, `AvailabilityView.tsx`, `PublishView.tsx`, `ClinicContextState`, `NSC Clinic Roster: complete project guide`, `RosterSteps.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `formatDate`, `getRepository`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `Sidebar.tsx`, `PublishedRosterView.tsx`, `WarningsSheet.tsx`, `GridTable.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `EmailTab.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `AppShell.tsx`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `ProblemsPanel.tsx`, `CellEditorDialog.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `nurseRosterService.ts`, `FairnessModal.tsx`, `AvailabilityView.tsx`, `PublishView.tsx`, `RosterSteps.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `data()` connect `The Five-Axis Review` to `leaveImport.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 115 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 115 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _993 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06433566433566433 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._