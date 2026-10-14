# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 377 files · ~412,613 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2781 nodes · 9051 edges · 129 communities (114 shown, 15 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 398 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2dcd7cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- fixtures.ts
- hoursBalance.ts
- clinicModel.test.ts
- authService
- publicHolidays.test.ts
- getRepository
- ScheduleValidator.ts
- ui-audit.cjs
- package.json
- scheduleTransactions.test.ts
- dependencies
- Test-Driven Development
- geminiApi.test.ts
- IRepository
- CollectionSyncer
- authService.ts
- seedRunner.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- PublishedRosterView.tsx
- emailService.ts
- devDependencies
- RosterToolbar.tsx
- quick reference
- decisionEmail.test.ts
- hoursPolicy.ts
- dayView.test.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- AvailabilityView.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- WorkbookGrid.tsx
- Handover for a new chat
- WhoCanCover.tsx
- Optimization Patterns
- checkScheduler.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- engineRules.test.ts
- firestore-rules/package.json
- NurseSelfServicePanel.tsx
- continuousHours.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- lastResort.test.ts
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
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- DoctorsView.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- MyRosterView.tsx
- CreateScheduleModal.tsx
- SchedulingEngine.ts
- links.cjs
- icsExportService.ts
- types/index.ts
- makeNurse
- FairnessModal.tsx
- grid-keys.cjs
- UI overhaul: summary and next steps
- apiApp.ts
- DashboardView.tsx
- Phases
- harness/main.tsx
- ApprovalsQueuePanel.tsx
- Finish a change
- Rules
- handMoves.test.ts
- SchedulesView.tsx
- context7
- formatDate
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- start.sh
- stop.sh
- Rules
- grid-flow.cjs
- LiveCollectionCache
- rowsInSteps.ts
- EmailTab.tsx
- IRepository.ts
- RosterGrid
- react
- quotaTracker
- ref_node_assert
- ClinicRoster
- 16. History of work (for context)
- RulesTab.tsx
- weekHours.test.ts
- savingSafety.test.ts
- newRosterDates.ts
- grid-timing.cjs
- GridTable.tsx
- my-requests.cjs
- nurse-editor.cjs
- ui/index.ts
- sheet-tabs.cjs
- explainCell.test.ts
- PublishModal
- ref_playwright
- nurse-page.cjs
- createLiveReconciler
- requests.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 118 edges
2. `Assignment` - 113 edges
3. `16. History of work (for context)` - 99 edges
4. `Nurse` - 98 edges
5. `getRepository()` - 97 edges
6. `DutyWindow` - 93 edges
7. `Schedule` - 92 edges
8. `lucide-react` - 89 edges
9. `Doctor` - 79 edges
10. `formatDate()` - 76 edges

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

## Communities (129 total, 15 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.11
Nodes (81): 5. Data model (Firestore collections), Request, EmailHtmlPreview(), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, PublishModalProps, Step (+73 more)

### Community 1 - "fixtures.ts"
Cohesion: 0.06
Nodes (39): 15. Tests, CellDay, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+31 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (40): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField (+32 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.13
Nodes (6): authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "publicHolidays.test.ts"
Cohesion: 0.23
Nodes (12): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday(), planHolidayLeaveTidy() (+4 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (41): confirmDialog(), notify(), signOutSafely(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps, DutiesTab() (+33 more)

### Community 7 - "ScheduleValidator.ts"
Cohesion: 0.15
Nodes (25): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+17 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (29): firebase, name, private, scripts, build, clean, dev, lint (+21 more)

### Community 10 - "scheduleTransactions.test.ts"
Cohesion: 0.20
Nodes (4): rosterSaveQueues, apps, { initializeTestEnvironment }, requireRules

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 14 - "IRepository"
Cohesion: 0.11
Nodes (17): VersionRestoreResult, saveHolidayLeave(), fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository, DeleteDoctorShiftParams, doctorFromDate() (+9 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.17
Nodes (4): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, EntityForCollection

### Community 16 - "authService.ts"
Cohesion: 0.12
Nodes (27): 3. Users, roles and access, 4. Navigation and app shell, LoginPageProps, AppShellProps, APP_NAME, SCREEN_NAMES, screenName(), screenTitle() (+19 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.18
Nodes (19): useAppContext(), DatabaseTab(), defaultFirebaseConfig, toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase() (+11 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.14
Nodes (21): calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+13 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (23): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+15 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.11
Nodes (21): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+13 more)

### Community 23 - "emailService.ts"
Cohesion: 0.18
Nodes (13): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.07
Nodes (28): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbarProps (+20 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.13
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+11 more)

### Community 28 - "hoursPolicy.ts"
Cohesion: 0.31
Nodes (9): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange() (+1 more)

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

### Community 33 - "AvailabilityView.tsx"
Cohesion: 0.09
Nodes (29): react-dom, TopBarProps, AuthModalProps, PageHeader(), TabPanel(), AuditTrailViewProps, AvailabilityView(), AvailabilityViewProps (+21 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (13): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+5 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (55): 7. Rules, DayProblem, DayRow, KIND, ORDER, CellChoice, CellEditorDialog(), withDr() (+47 more)

### Community 38 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 39 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 42 - "checkScheduler.test.ts"
Cohesion: 0.10
Nodes (14): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks() (+6 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "NurseSelfServicePanel.tsx"
Cohesion: 0.11
Nodes (39): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+31 more)

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
Nodes (31): AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+23 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

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

### Community 68 - "ShareModal.tsx"
Cohesion: 0.52
Nodes (6): ShareModal(), TabType, ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster()

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.17
Nodes (11): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+3 more)

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
Cohesion: 0.13
Nodes (28): BulkImportModal(), Badge(), Checkbox(), Field(), Input(), Select(), Notice(), DoctorsView() (+20 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.15
Nodes (17): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+9 more)

### Community 77 - "MyRosterView.tsx"
Cohesion: 0.11
Nodes (21): 0. Quick start for a new chat, 12. Publishing and nurse links, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, WalkthroughModal() (+13 more)

### Community 78 - "CreateScheduleModal.tsx"
Cohesion: 0.22
Nodes (14): CreateScheduleModal(), CreateScheduleModalProps, WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate() (+6 more)

### Community 80 - "SchedulingEngine.ts"
Cohesion: 0.06
Nodes (80): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, ClinicSetup (+72 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "types/index.ts"
Cohesion: 0.05
Nodes (40): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NurseFormErrors, NurseFormValues, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes() (+32 more)

### Community 84 - "makeNurse"
Cohesion: 0.10
Nodes (25): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+17 more)

### Community 85 - "FairnessModal.tsx"
Cohesion: 0.14
Nodes (26): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, uuid, FairnessModal(), FairnessModalProps, NONE (+18 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "apiApp.ts"
Cohesion: 0.10
Nodes (20): repoRoot, swaps, express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react (+12 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.09
Nodes (42): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+34 more)

### Community 91 - "Phases"
Cohesion: 0.22
Nodes (9): Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, and request decision emails, Phase 6: Nurses, Doctors, Availability and Requests (planner screens), Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit (+1 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "ApprovalsQueuePanel.tsx"
Cohesion: 0.20
Nodes (16): LocalModeBanner(), LocalModeBannerProps, Button(), Textarea(), EmptyState(), ErrorState(), LoadingState(), ApprovalsQueuePanel() (+8 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.12
Nodes (12): AMY, BEA, CARA, DAN, DOCTORS, DUTIES, EARLY, JUNIOR (+4 more)

### Community 98 - "SchedulesView.tsx"
Cohesion: 0.07
Nodes (43): useLatestCallback(), DeleteScheduleModal(), SwapManagerModal(), TemplateModal(), VersionCompareModal(), PHONE_QUERY, FillDialog(), FillDialogProps (+35 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "formatDate"
Cohesion: 0.14
Nodes (18): Report, What to check, What to look at, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DateInput(), MyRosterView() (+10 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 110 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 111 - "EmailTab.tsx"
Cohesion: 0.15
Nodes (16): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+8 more)

### Community 112 - "IRepository.ts"
Cohesion: 0.18
Nodes (14): FirebaseClientConfig, SubscribeCallback, Unsubscribe, ScheduleDeleteResult, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps() (+6 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "react"
Cohesion: 0.08
Nodes (36): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), lucide-react, react, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice() (+28 more)

### Community 116 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 117 - "ref_node_assert"
Cohesion: 0.07
Nodes (16): BACKUPS_KEPT, diff(), LATE, nurse, CARD, EARLY, FULL, LATE (+8 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "16. History of work (for context)"
Cohesion: 0.23
Nodes (15): 16. History of work (for context), VersionViewModal(), dayViewOf(), firstDayShown(), RosterDayView(), ProblemBadge(), cellSummary(), dayTotalsOf() (+7 more)

### Community 122 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 123 - "weekHours.test.ts"
Cohesion: 0.08
Nodes (16): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, SENIOR (+8 more)

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (13): Desired, fingerprint(), Known, planSync(), SyncPlan, queuesByRepo, RETRY_EVERY_MS, STAMP_EVERY_MS (+5 more)

### Community 125 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "GridTable.tsx"
Cohesion: 0.06
Nodes (49): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+41 more)

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.10
Nodes (37): AccountMenu(), TopBar(), PROBLEM_MARKS, ProblemCounts(), ProblemKind, Tone, TONE_CLASSES, ButtonProps (+29 more)

### Community 135 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 136 - "PublishModal"
Cohesion: 0.17
Nodes (20): PublishModal(), HistoryView(), PublishView(), DoctorsScheduleSheet(), saveRosterBackup(), restoreVersion(), ensureNurseLink(), regenerateNurseLink() (+12 more)

### Community 141 - "ref_playwright"
Cohesion: 0.13
Nodes (9): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 144 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

## Knowledge Gaps
- **947 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+942 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1155 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `GridTable.tsx`, `hoursBalance.ts`, `fixtures.ts`, `ui/index.ts`, `getRepository`, `package.json`, `authService.ts`, `seedRunner.ts`, `NurseSample.tsx`, `PublishedRosterView.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `AvailabilityView.tsx`, `WorkbookGrid.tsx`, `WhoCanCover.tsx`, `NurseSelfServicePanel.tsx`, `AppShell.tsx`, `ShareModal.tsx`, `DoctorsView.tsx`, `MyRosterView.tsx`, `CreateScheduleModal.tsx`, `SchedulingEngine.ts`, `FairnessModal.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `ApprovalsQueuePanel.tsx`, `SchedulesView.tsx`, `formatDate`, `rowsInSteps.ts`, `EmailTab.tsx`, `16. History of work (for context)`, `RulesTab.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `GridTable.tsx`, `hoursBalance.ts`, `ui/index.ts`, `getRepository`, `package.json`, `authService.ts`, `seedRunner.ts`, `NurseSample.tsx`, `PublishedRosterView.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `AvailabilityView.tsx`, `WorkbookGrid.tsx`, `NurseSelfServicePanel.tsx`, `AppShell.tsx`, `ShareModal.tsx`, `DoctorsView.tsx`, `MyRosterView.tsx`, `CreateScheduleModal.tsx`, `SchedulingEngine.ts`, `FairnessModal.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `ApprovalsQueuePanel.tsx`, `SchedulesView.tsx`, `formatDate`, `EmailTab.tsx`, `16. History of work (for context)`, `RulesTab.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `AvailabilityView.tsx`, `SchedulesView.tsx`, `ShareModal.tsx`, `ui/index.ts`, `getRepository`, `checkScheduler.test.ts`, `CreateScheduleModal.tsx`, `EmailTab.tsx`, `authService.ts`, `react`, `AppShell.tsx`, `PublishedRosterView.tsx`, `FairnessModal.tsx`, `RosterToolbar.tsx`, `DashboardView.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 98 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 98 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _947 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.10575139146567718 - nodes in this community are weakly interconnected._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05870020964360587 - nodes in this community are weakly interconnected._