# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 404 files · ~420,881 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2898 nodes · 9844 edges · 150 communities (126 shown, 24 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 417 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be36df89`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
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
- GridTable.tsx
- quick reference
- requests.ts
- DoctorsView.tsx
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- authService.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- decisionEmail.test.ts
- PublishModal.tsx
- RulesTab.tsx
- Optimization Patterns
- Assignment
- AvailabilityView.tsx
- rules.test.mjs
- Frontend UI Engineering
- ProblemsPanel.tsx
- ScheduleValidator.ts
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
- doctorWeekChange.test.ts
- NSC Clinic Roster: complete project guide
- usePresence.ts
- apiApp.ts
- links.cjs
- icsExportService.ts
- cellViewOf
- makeNurse
- peopleImport.ts
- cellView.test.ts
- UI overhaul: summary and next steps
- ProblemCounts
- types/index.ts
- DashboardView.tsx
- 16. History of work (for context)
- harness/main.tsx
- MyRosterView.tsx
- FairnessModal.tsx
- Finish a change
- Rules
- handMoves.test.ts
- createLiveReconciler
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
- formatDate
- analysisExport.test.ts
- holidayLeave.ts
- IRepository.ts
- GridToolbar.tsx
- editSaving.test.ts
- ClinicRoster
- dayView.ts
- checkScheduler.test.ts
- approvedDayOff.test.ts
- ClinicTab.tsx
- savingSafety.test.ts
- scheduleTransactions.test.ts
- ref_node_assert
- grid-timing.cjs
- ddmmyyyy
- newRosterDates.ts
- request-clinic-dialogs.cjs
- my-requests.cjs
- requests.cjs
- react
- roster-editing-dialogs.cjs
- doctorForm.ts
- rowsInSteps.ts
- allowance.cjs
- public-pages.cjs
- nurse-editor.cjs
- ref_playwright
- nurse-page.cjs
- WhoCanCover.tsx
- form-dialogs.cjs
- grid-flow.cjs
- toolbar.cjs
- leave-grid.cjs
- plain-english-reviewer.md
- nurses-list.cjs
- roster-dialogs.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 119 edges
2. `Assignment` - 112 edges
3. `16. History of work (for context)` - 111 edges
4. `Nurse` - 104 edges
5. `getRepository()` - 97 edges
6. `DutyWindow` - 94 edges
7. `Schedule` - 92 edges
8. `formatDate()` - 90 edges
9. `lucide-react` - 89 edges
10. `Doctor` - 82 edges

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

## Communities (150 total, 24 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.06
Nodes (64): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps (+56 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (53): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, FillDialogProps, ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME (+45 more)

### Community 2 - "fixtures.ts"
Cohesion: 0.09
Nodes (22): 15. Tests, ANNUAL_LEAVE, DAY_DUTY, makeLeave(), UNPAID_LEAVE, LONG, NOV, OCT (+14 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (24): PageLoading(), useLatestCallback(), RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), RosterToolbar(), useRosterEdits() (+16 more)

### Community 6 - "getRepository"
Cohesion: 0.15
Nodes (45): useAppContext(), confirmDialog(), notify(), Field(), Input(), AccessManagementPanel(), ClinicTab(), DatabaseTab() (+37 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (28): firebase, name, private, scripts, build, clean, dev, lint (+20 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.16
Nodes (19): CellContextMenu(), reuseCellViews(), sameView(), dayTotalsOf(), rowViewsOf(), findCell(), QuickCellPopup(), QuickCellPopupProps (+11 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.26
Nodes (9): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbarProps (+1 more)

### Community 14 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 15 - "seedRunner.ts"
Cohesion: 0.13
Nodes (21): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+13 more)

### Community 16 - "access.ts"
Cohesion: 0.16
Nodes (21): 3. Users, roles and access, signOutSafely(), usePermissions(), APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS (+13 more)

### Community 17 - "IRepository"
Cohesion: 0.09
Nodes (21): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster() (+13 more)

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
Nodes (21): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+13 more)

### Community 22 - "App.tsx"
Cohesion: 0.13
Nodes (15): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+7 more)

### Community 23 - "emailService.ts"
Cohesion: 0.19
Nodes (12): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS, withoutConnectionSettings() (+4 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "GridTable.tsx"
Cohesion: 0.06
Nodes (44): problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL, useCellFlags(), fmtHours() (+36 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "requests.ts"
Cohesion: 0.14
Nodes (17): emailRouter, COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload (+9 more)

### Community 28 - "DoctorsView.tsx"
Cohesion: 0.23
Nodes (16): NoticeTone, WeekChangePreview, DoctorsScheduleSheet(), WEEKDAY_ABBR, doctorCounts(), deleteDoctorShift(), doctorFromDate(), generateDoctorSessionsForDateRange() (+8 more)

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

### Community 33 - "authService.ts"
Cohesion: 0.09
Nodes (28): AppContext, AppContextValue, AuthModalProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+20 more)

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
Cohesion: 0.15
Nodes (13): nodemailer, cache(), cachedEmailSettings(), loadEmailSettings(), saveEmailSettings(), decidedAt, editor, manager (+5 more)

### Community 38 - "PublishModal.tsx"
Cohesion: 0.13
Nodes (17): 12. Publishing and nurse links, uuid, Request, EmailHtmlPreview(), Step, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes() (+9 more)

### Community 39 - "RulesTab.tsx"
Cohesion: 0.14
Nodes (19): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+11 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.12
Nodes (77): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps (+69 more)

### Community 42 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (31): ShareModal(), TemplateModal(), PageHeader(), Switch(), Textarea(), EmptyState(), ErrorState(), LoadingState() (+23 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "ProblemsPanel.tsx"
Cohesion: 0.24
Nodes (8): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding

### Community 46 - "ScheduleValidator.ts"
Cohesion: 0.08
Nodes (51): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+43 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.12
Nodes (37): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter, NurseSelfServicePanel(), STATUS (+29 more)

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
Cohesion: 0.09
Nodes (35): 4. Navigation and app shell, dialogsChanged(), openListeners, openStack, useDialogA11y(), AppShell(), bootstrap(), AuditTrailView (+27 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "EntityForCollection"
Cohesion: 0.13
Nodes (5): 11. Saving, live updates, versions, CollectionSyncer, FirestoreRepository, sanitizePayload(), EntityForCollection

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
Cohesion: 0.16
Nodes (27): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), plural(), CHANGE_LABELS, CHANGE_TONES, VersionViewModal() (+19 more)

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
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 77 - "doctorWeekChange.test.ts"
Cohesion: 0.08
Nodes (19): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, SENIOR (+11 more)

### Community 78 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.22
Nodes (8): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, WalkthroughModal(), WalkthroughModalProps

### Community 79 - "usePresence.ts"
Cohesion: 0.31
Nodes (6): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), now

### Community 80 - "apiApp.ts"
Cohesion: 0.09
Nodes (22): repoRoot, swaps, express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react (+14 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "cellViewOf"
Cohesion: 0.20
Nodes (13): cellViewOf(), fmtHours(), shortDoctorNames(), specialtyMatches(), withDr(), withoutDr(), contrastRatio(), INK (+5 more)

### Community 84 - "makeNurse"
Cohesion: 0.16
Nodes (16): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+8 more)

### Community 85 - "peopleImport.ts"
Cohesion: 0.18
Nodes (12): cellsOf(), DoctorImportRow, NurseImportRow, readDoctorRows(), readNurseRows(), WEEKDAYS, checkNurseForm(), movePreference() (+4 more)

### Community 86 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "ProblemCounts"
Cohesion: 0.39
Nodes (5): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), render()

### Community 89 - "types/index.ts"
Cohesion: 0.06
Nodes (35): isPairing(), PREFERENCE_FOCUS_LABELS, KIND_LABELS, ApprovalStatus, AuditAction, AuditEvent, BlockWeeks, DoctorSessionSource (+27 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.11
Nodes (36): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+28 more)

### Community 91 - "16. History of work (for context)"
Cohesion: 0.22
Nodes (13): 16. History of work (for context), CellChoice, GridCell, moveInGrid(), pickStep(), AssignmentKind, addDays(), DateRange (+5 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "MyRosterView.tsx"
Cohesion: 0.20
Nodes (12): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterViewProps, MyDay, myShiftDays(), dayMonth(), formatRosterAsText() (+4 more)

### Community 94 - "FairnessModal.tsx"
Cohesion: 0.24
Nodes (15): Other engine files, NONE, NurseFairnessMetrics, ProposedSwap, listProblem(), checkSwap(), isPinnedShift(), MoveContext (+7 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 98 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

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
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 110 - "PublishedRosterView.tsx"
Cohesion: 0.26
Nodes (10): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+2 more)

### Community 111 - "EmailTab.tsx"
Cohesion: 0.22
Nodes (13): EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+5 more)

### Community 112 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 113 - "formatDate"
Cohesion: 0.21
Nodes (35): BulkImportModal(), CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, EditDoctorShiftModal(), TIME_PRESETS, FairnessModal() (+27 more)

### Community 114 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (16): CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift(), ctx() (+8 more)

### Community 115 - "holidayLeave.ts"
Cohesion: 0.18
Nodes (14): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+6 more)

### Community 116 - "IRepository.ts"
Cohesion: 0.10
Nodes (16): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry (+8 more)

### Community 117 - "GridToolbar.tsx"
Cohesion: 0.33
Nodes (5): GRID_KEY_ID, GridLegend(), GridToolbar(), GridToolbarProps, GridZoom

### Community 118 - "editSaving.test.ts"
Cohesion: 0.12
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "dayView.ts"
Cohesion: 0.11
Nodes (21): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, PHONE_QUERY (+13 more)

### Community 121 - "checkScheduler.test.ts"
Cohesion: 0.27
Nodes (5): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "ClinicTab.tsx"
Cohesion: 0.60
Nodes (4): ClinicTabProps, SaveStatus, WEEKDAY_NAMES, ClinicProfile

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (11): forgetCachedRoster(), Desired, fingerprint(), Known, SyncPlan, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS (+3 more)

### Community 125 - "scheduleTransactions.test.ts"
Cohesion: 0.11
Nodes (12): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, apps, { initializeTestEnvironment } (+4 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.07
Nodes (18): MONTHS, suggestRosterName(), diff(), LATE, nurse, AL, DAY_OFF, SICK (+10 more)

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

### Community 133 - "react"
Cohesion: 0.09
Nodes (38): lucide-react, react, LocalModeBanner(), LocalModeBannerProps, fmtHours(), SOURCE_LABELS, STATUS_LABELS, PROBLEM_MARKS (+30 more)

### Community 135 - "doctorForm.ts"
Cohesion: 0.22
Nodes (10): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+2 more)

### Community 136 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 141 - "ref_playwright"
Cohesion: 0.11
Nodes (11): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+3 more)

### Community 143 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 150 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **991 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+986 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1206 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `fixtures.ts`, `SchedulesView.tsx`, `getRepository`, `rowsInSteps.ts`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `WhoCanCover.tsx`, `access.ts`, `App.tsx`, `GridTable.tsx`, `DoctorsView.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `PublishModal.tsx`, `RulesTab.tsx`, `Assignment`, `AvailabilityView.tsx`, `ProblemsPanel.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `NSC Clinic Roster: complete project guide`, `usePresence.ts`, `ProblemCounts`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `FairnessModal.tsx`, `PublishedRosterView.tsx`, `EmailTab.tsx`, `formatDate`, `GridToolbar.tsx`, `dayView.ts`, `ClinicTab.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `SchedulesView.tsx`, `getRepository`, `package.json`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `access.ts`, `App.tsx`, `GridTable.tsx`, `DoctorsView.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `PublishModal.tsx`, `RulesTab.tsx`, `Assignment`, `AvailabilityView.tsx`, `ProblemsPanel.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `HistoryView.tsx`, `data.ts`, `dialogs.tsx`, `ProblemCounts`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `FairnessModal.tsx`, `PublishedRosterView.tsx`, `EmailTab.tsx`, `formatDate`, `GridToolbar.tsx`, `ClinicTab.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `SchedulesView.tsx`, `getRepository`, `react`, `rowsInSteps.ts`, `doctorForm.ts`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `access.ts`, `IRepository`, `firebaseIdentityService.ts`, `GridTable.tsx`, `authService.ts`, `Code Review and Quality`, `Assignment`, `AvailabilityView.tsx`, `ScheduleValidator.ts`, `staffRequestService.ts`, `AppShell.tsx`, `EntityForCollection`, `HistoryView.tsx`, `dialogs.tsx`, `NSC Clinic Roster: complete project guide`, `usePresence.ts`, `cellViewOf`, `peopleImport.ts`, `ProblemCounts`, `MyRosterView.tsx`, `PublishedRosterView.tsx`, `formatDate`, `IRepository.ts`, `editSaving.test.ts`, `dayView.ts`, `checkScheduler.test.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 110 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 110 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _991 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.063568010936432 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07401129943502825 - nodes in this community are weakly interconnected._