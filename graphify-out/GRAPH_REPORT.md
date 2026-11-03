# Graph Report - NSC-Clinic-Roster  (2026-11-03)

## Corpus Check
- 427 files · ~437,396 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3000 nodes · 10336 edges · 160 communities (129 shown, 31 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 441 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7bdb8aff`
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
- dayView.ts
- apiApp.ts
- seedRunner.ts
- handMoves.test.ts
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- PublishedRosterView.tsx
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
- Button
- analysisExport.test.ts
- Optimization Patterns
- Assignment
- EntityForCollection
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- published-rules.mjs
- firestore-rules/package.json
- PublishView.tsx
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
- guide-with-code.mjs
- fakeAuth.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- EmailTab.tsx
- holidayLeave.ts
- createApiApp
- RulesTab.tsx
- links.cjs
- icsExportService.ts
- cellView.ts
- makeNurse
- LiveCollectionCache
- staffRequestService.ts
- UI overhaul: summary and next steps
- emailSettingsStore.ts
- types/index.ts
- doctorForm.ts
- IRepository.ts
- harness/main.tsx
- UI overhaul: checklist
- myRequests.ts
- Finish a change
- Rules
- nurseClinicFloat.test.ts
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
- fixtures.ts
- savingSafety.test.ts
- firestoreRest.ts
- yearToDate.ts
- FirestoreRepository
- HistoryView.tsx
- RosterToolbar.tsx
- nurseList.test.ts
- nextPeriod.ts
- authorizedFetch
- NSC Clinic Roster: complete project guide
- AvailabilityView.tsx
- RosterGrid
- approvedDayOff.test.ts
- leaveGuard.ts
- quotaTracker
- emailLogSize.ts
- ref_node_assert
- grid-timing.cjs
- scripts
- rowsInSteps.ts
- decisionEmail.ts
- my-requests.cjs
- request-clinic-dialogs.cjs
- react
- nurseForm.ts
- requests.cjs
- versionKinds.test.ts
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
- weekHours.test.ts
- WarningsSheet.tsx
- newRosterDates.ts
- resume.cjs
- time-periods.cjs

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
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `17. Known quirks and ideas for later` --references--> `doctorSessionsOn()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/clinicModel.ts

## Import Cycles
- None detected.

## Communities (160 total, 31 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (49): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps, fmtHours(), HoursAccountingSheet() (+41 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (66): 6. Clinic model (the business rules in plain English), 7. Rules, FillDialogProps, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME (+58 more)

### Community 2 - "DashboardView.tsx"
Cohesion: 0.06
Nodes (54): 12. Publishing and nurse links, useAppContext(), dateLabel(), PublishedRosterSheet(), Card(), DashboardView(), loadPlannerData(), loadViewerData() (+46 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.15
Nodes (3): authService, computePrivileges(), getAppAuth()

### Community 5 - "GridTable.tsx"
Cohesion: 0.11
Nodes (25): CellView, DayTotal, dayTotalsOf(), dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellProps (+17 more)

### Community 6 - "getRepository"
Cohesion: 0.12
Nodes (52): confirmDialog(), notify(), ShareModal(), Field(), Input(), ClinicTab(), ClinicTabProps, DatabaseTab() (+44 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (18): firebase, name, private, type, version, esbuild, @google/genai, jose (+10 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (25): CellContextMenu(), GRID_KEY_ID, GridLegend(), GridSelectionState, GridStatusBar(), GridToolbar(), GridToolbarProps, GridZoom (+17 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "dayView.ts"
Cohesion: 0.10
Nodes (21): DayProblem, DayRow, firstDayShown(), isPhoneSize(), KIND, ORDER, PHONE_QUERY, isPhone() (+13 more)

### Community 14 - "apiApp.ts"
Cohesion: 0.13
Nodes (16): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, Request (+8 more)

### Community 15 - "seedRunner.ts"
Cohesion: 0.13
Nodes (16): countOf(), listPage(), pageFromList(), ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+8 more)

### Community 16 - "handMoves.test.ts"
Cohesion: 0.06
Nodes (52): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, RuleDef, checkAssignment(), hardRule(), listProblem() (+44 more)

### Community 17 - "IRepository"
Cohesion: 0.15
Nodes (18): saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.21
Nodes (13): AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache, jwks (+5 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.12
Nodes (35): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, BarList(), hours(), Meter(), METER_FILL (+27 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.11
Nodes (21): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+13 more)

### Community 23 - "emailService.ts"
Cohesion: 0.29
Nodes (7): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SMTP_CONNECTION_KEYS, withoutConnectionSettings()

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, esbuild, tailwindcss, @types/express, @types/node, @types/nodemailer, @types/react, @types/react-dom (+2 more)

### Community 25 - "gridSelection.ts"
Cohesion: 0.12
Nodes (20): GridCellActions, CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), HOURS_COLUMN (+12 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.14
Nodes (14): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+6 more)

### Community 28 - "16. History of work (for context)"
Cohesion: 0.12
Nodes (20): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), CellChoice, DayColumn, ProblemMark, GridCell, moveInGrid() (+12 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (33): LeaveAndLocksSheet(), askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+25 more)

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
Nodes (30): 3. Users, roles and access, 4. Navigation and app shell, LoginPageProps, AppContext, AppContextValue, signOutSafely(), AppShellProps, APP_NAME (+22 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.05
Nodes (39): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+31 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "Button"
Cohesion: 0.11
Nodes (56): 13. Screens in detail, AuthModal(), CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal() (+48 more)

### Community 39 - "analysisExport.test.ts"
Cohesion: 0.07
Nodes (24): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+16 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.10
Nodes (87): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps (+79 more)

### Community 42 - "EntityForCollection"
Cohesion: 0.09
Nodes (17): 11. Saving, live updates, versions, useRosterEdits(), forgetCachedRoster(), saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known (+9 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.21
Nodes (17): nurseLinkUrl(), findStoppedPublish(), isDone(), isResumable(), lastNews(), overallSendStatus(), planResume(), ResumePlan (+9 more)

### Community 46 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "PublishView.tsx"
Cohesion: 0.12
Nodes (41): EmailHtmlPreview(), BulkImportModal(), Card(), PageHeader(), Column, DataTable(), Select(), Textarea() (+33 more)

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
Nodes (32): dialogsChanged(), openListeners, openStack, useDialogA11y(), AppShell(), bootstrap(), AuditTrailView, AvailabilityView (+24 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "dialogs.tsx"
Cohesion: 0.13
Nodes (19): uuid, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+11 more)

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
Nodes (15): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay(), ExplainNurseDayInput (+7 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "ClinicContextState"
Cohesion: 0.12
Nodes (20): TopBarProps, AuthModalProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+12 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "fakeAuth.ts"
Cohesion: 0.15
Nodes (9): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, planner(), history() (+1 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 77 - "EmailTab.tsx"
Cohesion: 0.23
Nodes (7): nodemailer, checkEmailReadiness(), EmailReadiness, readEmailResponse(), RosterPublishService, configured, live

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 80 - "RulesTab.tsx"
Cohesion: 0.20
Nodes (14): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup, RulesTab() (+6 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.27
Nodes (13): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+5 more)

### Community 83 - "cellView.ts"
Cohesion: 0.11
Nodes (27): dayViewOf(), CellDay, cellLookupsOf(), cellSummary(), cellViewOf(), fmtHours(), reuseCellViews(), sameView() (+19 more)

### Community 84 - "makeNurse"
Cohesion: 0.08
Nodes (31): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup() (+23 more)

### Community 86 - "staffRequestService.ts"
Cohesion: 0.28
Nodes (12): canApproveRequests(), dayOffLockId(), daysInclusive(), deleteAvailabilityRequest(), isPendingLeave(), listPendingApprovals(), PendingAvailabilityItem, PendingLeaveItem (+4 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "emailSettingsStore.ts"
Cohesion: 0.24
Nodes (10): ServerEmailConfig, EmailTabProps, ResumeOptions, cache(), cachedEmailSettings(), loadEmailSettings(), saveEmailSettings(), DEFAULT_EMAIL_SETTINGS (+2 more)

### Community 89 - "types/index.ts"
Cohesion: 0.06
Nodes (36): youCanDo(), UserPrivileges, isPairing(), PREFERENCE_FOCUS_LABELS, emailKindLabel(), KIND_LABELS, sendResult, FIELDS (+28 more)

### Community 90 - "doctorForm.ts"
Cohesion: 0.23
Nodes (9): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, usualWeekLines(), WEEKDAY_NAMES, WeeklyPatternSlot (+1 more)

### Community 91 - "IRepository.ts"
Cohesion: 0.19
Nodes (15): FirebaseClientConfig, SubscribeCallback, Unsubscribe, Page, PageRequest, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict() (+7 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 94 - "myRequests.ts"
Cohesion: 0.27
Nodes (9): checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors, leaveStatus(), MyRequest, myRequestList(), range() (+1 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "nurseClinicFloat.test.ts"
Cohesion: 0.09
Nodes (15): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run() (+7 more)

### Community 98 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (16): useLatestCallback(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), RosterStep, RosterStepAction, rosterSteps(), RosterSteps() (+8 more)

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
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "fixtures.ts"
Cohesion: 0.11
Nodes (14): ANNUAL_LEAVE, UNPAID_LEAVE, LONG, NOV, OCT, D, E, L (+6 more)

### Community 110 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (11): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS (+3 more)

### Community 111 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 112 - "yearToDate.ts"
Cohesion: 0.16
Nodes (18): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), computeYearToDate() (+10 more)

### Community 113 - "FirestoreRepository"
Cohesion: 0.23
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 114 - "HistoryView.tsx"
Cohesion: 0.19
Nodes (26): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), plural(), CHANGE_LABELS, CHANGE_TONES, VersionCompareModal() (+18 more)

### Community 115 - "RosterToolbar.tsx"
Cohesion: 0.12
Nodes (18): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+10 more)

### Community 116 - "nurseList.test.ts"
Cohesion: 0.32
Nodes (4): filterNurses(), nurseCounts(), NurseFilters, nurses

### Community 117 - "nextPeriod.ts"
Cohesion: 0.20
Nodes (13): addDays(), MONTHS, nextPeriodDefaults(), parse(), PeriodDefaults, sameDayNextMonth(), toIso(), cellsOf() (+5 more)

### Community 118 - "authorizedFetch"
Cohesion: 0.27
Nodes (9): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload (+1 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.12
Nodes (14): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+6 more)

### Community 120 - "AvailabilityView.tsx"
Cohesion: 0.22
Nodes (14): NoticeTone, Switch(), AvailabilityView(), WEEKDAY_ABBR, NurseSelfServicePanel(), STATUS, useFocusFirstError(), cancelAvailabilityRequest() (+6 more)

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
Cohesion: 0.10
Nodes (12): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker (+4 more)

### Community 125 - "emailLogSize.ts"
Cohesion: 0.33
Nodes (6): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, EmailRecipientLog

### Community 126 - "ref_node_assert"
Cohesion: 0.07
Nodes (19): BACKUPS_KEPT, MONTHS, suggestRosterName(), diff(), LATE, nurse, AL, DAY_OFF (+11 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 129 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 130 - "decisionEmail.ts"
Cohesion: 0.39
Nodes (7): DecidedRequest, decisionEmail(), DecisionEmailInput, oneLine(), what(), when(), escapeHtml()

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "react"
Cohesion: 0.10
Nodes (33): lucide-react, react, LocalModeBanner(), LocalModeBannerProps, PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone (+25 more)

### Community 134 - "nurseForm.ts"
Cohesion: 0.32
Nodes (5): checkNurseForm(), movePreference(), NurseFormErrors, NurseFormValues, others

### Community 136 - "versionKinds.test.ts"
Cohesion: 0.25
Nodes (7): all, backup, lastYear, none, published, saved, v()

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 155 - "weekHours.test.ts"
Cohesion: 0.07
Nodes (19): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, SENIOR (+11 more)

### Community 156 - "WarningsSheet.tsx"
Cohesion: 0.33
Nodes (5): CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity

### Community 157 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

## Knowledge Gaps
- **1008 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1003 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1229 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `rowsInSteps.ts`, `DashboardView.tsx`, `GridTable.tsx`, `getRepository`, `package.json`, `WorkbookGrid.tsx`, `dayView.ts`, `NurseSample.tsx`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `gridSelection.ts`, `WarningsSheet.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `Button`, `Assignment`, `resumePublish.ts`, `PublishView.tsx`, `AppShell.tsx`, `dialogs.tsx`, `explainCell.ts`, `ClinicContextState`, `EmailTab.tsx`, `RulesTab.tsx`, `makeNurse`, `harness/main.tsx`, `SchedulesView.tsx`, `HistoryView.tsx`, `RosterToolbar.tsx`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `DashboardView.tsx`, `GridTable.tsx`, `getRepository`, `package.json`, `WorkbookGrid.tsx`, `dayView.ts`, `NurseSample.tsx`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `gridSelection.ts`, `WarningsSheet.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `Button`, `Assignment`, `resumePublish.ts`, `PublishView.tsx`, `AppShell.tsx`, `dialogs.tsx`, `EmailTab.tsx`, `RulesTab.tsx`, `harness/main.tsx`, `SchedulesView.tsx`, `HistoryView.tsx`, `RosterToolbar.tsx`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `rowsInSteps.ts`, `DashboardView.tsx`, `SchedulingEngine.ts`, `react`, `getRepository`, `GridTable.tsx`, `nurseForm.ts`, `WorkbookGrid.tsx`, `dayView.ts`, `seedRunner.ts`, `IRepository`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `gridSelection.ts`, `authService.ts`, `Code Review and Quality`, `Button`, `Assignment`, `EntityForCollection`, `resumePublish.ts`, `PublishView.tsx`, `AppShell.tsx`, `dialogs.tsx`, `ClinicContextState`, `cellView.ts`, `staffRequestService.ts`, `types/index.ts`, `doctorForm.ts`, `IRepository.ts`, `myRequests.ts`, `SchedulesView.tsx`, `firestoreRest.ts`, `FirestoreRepository`, `HistoryView.tsx`, `RosterToolbar.tsx`, `nextPeriod.ts`, `NSC Clinic Roster: complete project guide`, `AvailabilityView.tsx`, `leaveGuard.ts`, `emailLogSize.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 125 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 125 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1008 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07199032062915911 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07894736842105263 - nodes in this community are weakly interconnected._