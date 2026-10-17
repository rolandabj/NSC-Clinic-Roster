# Graph Report - NSC-Clinic-Roster  (2026-10-17)

## Corpus Check
- 385 files · ~419,057 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2819 nodes · 9171 edges · 151 communities (133 shown, 18 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 404 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae4c03e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- publicRosterService.ts
- harness/vite.config.ts
- fixtures.ts
- clinicModel.test.ts
- authService
- AvailabilityView.tsx
- getRepository
- 16. History of work (for context)
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- RosterToolbar.tsx
- seedRunner.ts
- savingSafety.test.ts
- access.ts
- FirestoreRepository.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- hoursAccounting.ts
- App.tsx
- emailService.ts
- devDependencies
- usePresence.ts
- quick reference
- decisionEmail.test.ts
- hoursBalance.ts
- dayView.test.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- authService.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- MyRosterView.tsx
- GridTable.tsx
- explainCell.ts
- Optimization Patterns
- Assignment
- analysisExport.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- RulesTab.tsx
- firestore-rules/package.json
- staffRequestService.ts
- continuousHours.test.ts
- cellView.test.ts
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
- approvedDayOff.test.ts
- Planning and Task Breakdown
- Find Skills
- PublishModal.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- DoctorsView.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- Other engine files
- doctorWeekChange.test.ts
- formatDate
- ExportModal.tsx
- links.cjs
- icsExportService.ts
- useDialogA11y
- makeNurse
- analysisExportService.ts
- grid-keys.cjs
- UI overhaul: summary and next steps
- geminiApi.test.ts
- types/index.ts
- DashboardView.tsx
- CreateScheduleModal.tsx
- harness/main.tsx
- dialogs.tsx
- PublishedRosterView.tsx
- Finish a change
- Rules
- handMoves.test.ts
- apiApp.ts
- context7
- ScheduleValidator.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- checkScheduler.test.ts
- start.sh
- stop.sh
- Rules
- grid-flow.cjs
- LiveCollectionCache
- Schedule
- EmailTab.tsx
- guide-with-code.mjs
- RosterGrid
- SchedulingEngine.ts
- holidayLeave.ts
- quotaTracker
- engineRules.test.ts
- UI overhaul: checklist
- NSC Clinic Roster: complete project guide
- sharing.test.ts
- address.ts
- SchedulesView.tsx
- hoursRules.test.ts
- createLiveReconciler
- IRepository
- ref_node_assert
- grid-timing.cjs
- WorkingHoursPeriodsPanel.tsx
- fakeAuth.ts
- editSaving.test.ts
- my-requests.cjs
- nurse-editor.cjs
- react
- RosterSteps.tsx
- NursesView.tsx
- preferenceOrder.ts
- allowance.cjs
- scripts
- usePhoneLayout.ts
- repository/index.ts
- ref_playwright
- nurse-page.cjs
- emailLogSize.ts
- plain-english-reviewer.md
- yearSeed.ts
- requests.cjs
- public-pages.cjs
- ask-before-main.mjs
- leave-grid.cjs
- toolbar.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 118 edges
2. `Assignment` - 113 edges
3. `16. History of work (for context)` - 103 edges
4. `Nurse` - 100 edges
5. `getRepository()` - 97 edges
6. `DutyWindow` - 93 edges
7. `Schedule` - 92 edges
8. `lucide-react` - 89 edges
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

## Communities (151 total, 18 thin omitted)

### Community 0 - "publicRosterService.ts"
Cohesion: 0.35
Nodes (9): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+1 more)

### Community 1 - "harness/vite.config.ts"
Cohesion: 0.27
Nodes (6): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, clinicApi()

### Community 2 - "fixtures.ts"
Cohesion: 0.09
Nodes (19): 15. Tests, ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, LONG, NOV (+11 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (27): Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D, DOCTORS (+19 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (25): DateInput(), FieldInputProps, Input(), inputClass, InputProps, Select(), SelectProps, Switch() (+17 more)

### Community 6 - "getRepository"
Cohesion: 0.16
Nodes (35): confirmDialog(), notify(), signOutSafely(), TemplateModal(), AccessManagementPanel(), DatabaseTabProps, DutiesTab(), DutiesTabProps (+27 more)

### Community 7 - "16. History of work (for context)"
Cohesion: 0.13
Nodes (26): 16. History of work (for context), useLatestCallback(), Button(), DataTable(), Textarea(), EmptyState(), ErrorState(), LoadingState() (+18 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (47): DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), CellEditorDialog(), withDr() (+39 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "RosterToolbar.tsx"
Cohesion: 0.24
Nodes (11): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+3 more)

### Community 14 - "seedRunner.ts"
Cohesion: 0.18
Nodes (17): useAppContext(), DatabaseTab(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats (+9 more)

### Community 15 - "savingSafety.test.ts"
Cohesion: 0.18
Nodes (7): clearYearToDateCache(), forgetCachedRoster(), afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 16 - "access.ts"
Cohesion: 0.19
Nodes (18): 3. Users, roles and access, 4. Navigation and app shell, usePermissions(), APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS (+10 more)

### Community 17 - "FirestoreRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "hoursAccounting.ts"
Cohesion: 0.10
Nodes (31): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField, TabMode (+23 more)

### Community 22 - "App.tsx"
Cohesion: 0.12
Nodes (16): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+8 more)

### Community 23 - "emailService.ts"
Cohesion: 0.20
Nodes (11): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+3 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "usePresence.ts"
Cohesion: 0.21
Nodes (8): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), frame, november, now

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+12 more)

### Community 28 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (35): askedCarry(), closePeriod(), countedEarlierRosters(), countHoursInRange(), dutyDurationHours(), earlierPeriodTotals(), HoursSchedule, Leftover (+27 more)

### Community 29 - "dayView.test.ts"
Cohesion: 0.22
Nodes (7): isPhoneSize(), amy, LEE, lookups, mary, nina, shift

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
Cohesion: 0.14
Nodes (19): TopBarProps, AuthModalProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps, ReportsViewProps (+11 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.06
Nodes (33): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+25 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "MyRosterView.tsx"
Cohesion: 0.16
Nodes (15): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterViewProps, MyDay, myShiftDays(), dayMonth(), formatRosterAsText() (+7 more)

### Community 38 - "GridTable.tsx"
Cohesion: 0.06
Nodes (43): CellView, DayTotal, problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL (+35 more)

### Community 39 - "explainCell.ts"
Cohesion: 0.15
Nodes (20): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+12 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.16
Nodes (57): 5. Data model (Firestore collections), BulkImportModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap, PublishModalProps (+49 more)

### Community 42 - "analysisExport.test.ts"
Cohesion: 0.12
Nodes (14): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+6 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.13
Nodes (26): PageHeader(), TabPanel(), AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+18 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 50 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.10
Nodes (33): AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+25 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "CollectionSyncer"
Cohesion: 0.12
Nodes (9): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, rebaseEdit(), CollectionName (+1 more)

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

### Community 68 - "PublishModal.tsx"
Cohesion: 0.15
Nodes (26): 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), withoutBackups() (+18 more)

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
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 73 - "DoctorsView.tsx"
Cohesion: 0.14
Nodes (25): DoctorsView(), byDayAndTime(), checkDoctorForm(), doctorCounts(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors() (+17 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "Other engine files"
Cohesion: 0.29
Nodes (12): Other engine files, SwapManagerModal(), listProblem(), checkSwap(), isPinnedShift(), newFindings(), rebalancedFields(), suggestMoves() (+4 more)

### Community 78 - "doctorWeekChange.test.ts"
Cohesion: 0.10
Nodes (15): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, DR_PEDS (+7 more)

### Community 79 - "formatDate"
Cohesion: 0.12
Nodes (27): 13. Screens in detail, NoticeTone, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, MyRosterView(), NurseSelfServicePanel(), STATUS (+19 more)

### Community 80 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (43): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, AuditTrailView() (+35 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.11
Nodes (26): RFC-5545, calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument() (+18 more)

### Community 83 - "useDialogA11y"
Cohesion: 0.11
Nodes (28): dialogsChanged(), openListeners, openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps (+20 more)

### Community 84 - "makeNurse"
Cohesion: 0.11
Nodes (22): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+14 more)

### Community 85 - "analysisExportService.ts"
Cohesion: 0.11
Nodes (35): FairnessModal(), dayTotalsOf(), coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes(), hoursToCover() (+27 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 89 - "types/index.ts"
Cohesion: 0.09
Nodes (24): uuid, CellChoice, ApprovalStatus, AssignmentKind, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind (+16 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.11
Nodes (34): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+26 more)

### Community 91 - "CreateScheduleModal.tsx"
Cohesion: 0.35
Nodes (8): CreateScheduleModal(), CreateScheduleModalProps, generateDoctorSessionsForDateRange(), addDays(), iso(), monthEnd(), suggestNewRosterDates(), BlockWeeks

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "dialogs.tsx"
Cohesion: 0.21
Nodes (14): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+6 more)

### Community 94 - "PublishedRosterView.tsx"
Cohesion: 0.29
Nodes (9): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+1 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 98 - "apiApp.ts"
Cohesion: 0.15
Nodes (13): express, express-rate-limit, helmet, createApiApp(), startServer(), authMiddleware(), AuthUser, BackendRole (+5 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ScheduleValidator.ts"
Cohesion: 0.12
Nodes (24): readStoredScheduleId(), SchedulesView(), storeScheduleId(), ProblemsPanel(), ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS (+16 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "checkScheduler.test.ts"
Cohesion: 0.24
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), recordHolidayDayOff(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 110 - "Schedule"
Cohesion: 0.24
Nodes (16): EditDoctorShiftModalProps, TIME_PRESETS, DoctorsScheduleSheetProps, WEEKDAY_ABBR, OutsideList, DeleteDoctorShiftParams, DeleteDoctorShiftResult, PatternSessionPlan (+8 more)

### Community 111 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 112 - "guide-with-code.mjs"
Cohesion: 0.12
Nodes (7): command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }, builtServer, __dirname, __filename

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "SchedulingEngine.ts"
Cohesion: 0.12
Nodes (27): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+19 more)

### Community 115 - "holidayLeave.ts"
Cohesion: 0.21
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+4 more)

### Community 116 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 117 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 118 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 120 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 121 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 122 - "SchedulesView.tsx"
Cohesion: 0.30
Nodes (8): FillDialog(), FillDialogProps, FillRange, CoverageSheet(), LeaveAndLocksSheet(), GenerationPreflightSummary, GenerationProgress, BACKUPS_KEPT

### Community 123 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 124 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 125 - "IRepository"
Cohesion: 0.13
Nodes (19): EditDoctorShiftModal(), DoctorsScheduleSheet(), saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint() (+11 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.09
Nodes (15): FLOAT_ROLE_ID, ctx(), EARLY, LATE, LATE, nurse, leaves, pins (+7 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.25
Nodes (8): ClinicTab(), ClinicTabProps, SaveStatus, WEEKDAY_NAMES, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ClinicProfile, getWeekendDays()

### Community 129 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 130 - "editSaving.test.ts"
Cohesion: 0.36
Nodes (6): useRosterEdits(), changedLists(), RosterLists, sameItems(), countedShift(), shift()

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "react"
Cohesion: 0.08
Nodes (46): lucide-react, react, react-dom, LocalModeBanner(), LocalModeBannerProps, AccountMenu(), TopBar(), ROSTER_SHEET_PANEL_ID (+38 more)

### Community 134 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 135 - "NursesView.tsx"
Cohesion: 0.13
Nodes (21): BulkImportModal(), firstDayShown(), RosterDayView(), Badge(), ProblemBadge(), Checkbox(), Field(), Notice() (+13 more)

### Community 136 - "preferenceOrder.ts"
Cohesion: 0.25
Nodes (8): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, GenerationResult, NursePreference

### Community 138 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 139 - "usePhoneLayout.ts"
Cohesion: 0.29
Nodes (7): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout(), nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 140 - "repository/index.ts"
Cohesion: 0.25
Nodes (3): defaultFirebaseConfig, repositoryManager, StorageMode

### Community 141 - "ref_playwright"
Cohesion: 0.12
Nodes (9): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 143 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 144 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 145 - "yearSeed.ts"
Cohesion: 0.33
Nodes (6): YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 148 - "ask-before-main.mjs"
Cohesion: 0.50
Nodes (4): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }

## Knowledge Gaps
- **962 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+957 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1177 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `publicRosterService.ts`, `WorkingHoursPeriodsPanel.tsx`, `editSaving.test.ts`, `fixtures.ts`, `AvailabilityView.tsx`, `RosterSteps.tsx`, `16. History of work (for context)`, `NursesView.tsx`, `package.json`, `getRepository`, `usePhoneLayout.ts`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `seedRunner.ts`, `access.ts`, `NurseSample.tsx`, `hoursAccounting.ts`, `App.tsx`, `usePresence.ts`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `MyRosterView.tsx`, `GridTable.tsx`, `explainCell.ts`, `Assignment`, `RulesTab.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `PublishModal.tsx`, `DoctorsView.tsx`, `formatDate`, `ExportModal.tsx`, `useDialogA11y`, `types/index.ts`, `DashboardView.tsx`, `CreateScheduleModal.tsx`, `harness/main.tsx`, `dialogs.tsx`, `PublishedRosterView.tsx`, `ScheduleValidator.ts`, `Schedule`, `EmailTab.tsx`, `NSC Clinic Roster: complete project guide`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `publicRosterService.ts`, `WorkingHoursPeriodsPanel.tsx`, `AvailabilityView.tsx`, `RosterSteps.tsx`, `NursesView.tsx`, `16. History of work (for context)`, `package.json`, `getRepository`, `WorkbookGrid.tsx`, `RosterToolbar.tsx`, `seedRunner.ts`, `access.ts`, `NurseSample.tsx`, `hoursAccounting.ts`, `App.tsx`, `PlannerSample.tsx`, `ui.tsx`, `authService.ts`, `MyRosterView.tsx`, `GridTable.tsx`, `Assignment`, `RulesTab.tsx`, `staffRequestService.ts`, `AppShell.tsx`, `PublishModal.tsx`, `DoctorsView.tsx`, `formatDate`, `ExportModal.tsx`, `useDialogA11y`, `types/index.ts`, `DashboardView.tsx`, `CreateScheduleModal.tsx`, `harness/main.tsx`, `dialogs.tsx`, `PublishedRosterView.tsx`, `ScheduleValidator.ts`, `Schedule`, `EmailTab.tsx`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 102 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 102 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _962 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09358974358974359 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._