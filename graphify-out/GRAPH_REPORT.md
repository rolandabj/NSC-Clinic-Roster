# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 303 files · ~358,918 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2419 nodes · 7707 edges · 115 communities (104 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 290 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02708a08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- ExportModal.tsx
- clinicModel.test.ts
- quotaTracker
- authService.ts
- notify
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- getRepository
- App.tsx
- CollectionSyncer
- IRepository.ts
- makeSchedule
- firebaseIdentityService.ts
- SchedulesView.tsx
- compilerOptions
- savingSafety.test.ts
- ShareModal.tsx
- gridSelection.ts
- devDependencies
- nurseRosterService.ts
- seedRunner.ts
- IRepository
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- engineRules.test.ts
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- WorkbookGrid.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- cellView.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- EntityForCollection
- ui.tsx
- firestore-rules/package.json
- yearToDate.ts
- NSC Clinic Roster: complete project guide
- dialogs.tsx
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- analysisExportService.ts
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
- emailService.ts
- published-rules.mjs
- createApiApp
- RosterGrid
- Design system: NSC Clinic Roster
- README.md
- hoursRules.test.ts
- weekHours.test.ts
- holidayLeave.ts
- authorizedFetch
- links.cjs
- Sidebar.tsx
- types/index.ts
- fixtures.ts
- ui/index.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- address.ts
- access.ts
- apiApp.ts
- firebaseConfig.ts
- harness/main.tsx
- doctorScheduleService.ts
- liveCollectionCache.ts
- Finish a change
- lastResort.test.ts
- DoctorsView.tsx
- dateUtils.test.ts
- context7
- firestore-rules-reviewer.md
- ref_node_assert
- firebase-mcp.sh
- react
- start.sh
- stop.sh
- nurseClinicFloat.test.ts
- NurseSample.tsx
- UI overhaul: checklist
- devDependencies
- makeNurse
- emailPublishing.test.ts
- explainCell.ts
- newRosterDates.ts
- plain-english-reviewer.md

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 101 edges
2. `getRepository()` - 95 edges
3. `react` - 93 edges
4. `Schedule` - 86 edges
5. `DutyWindow` - 83 edges
6. `Nurse` - 83 edges
7. `lucide-react` - 77 edges
8. `useDialogA11y()` - 74 edges
9. `Doctor` - 73 edges
10. `notify()` - 69 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts

## Import Cycles
- None detected.

## Communities (115 total, 11 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.05
Nodes (132): 5. Data model (Firestore collections), uuid, Request, EmailHtmlPreview(), BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps (+124 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (24): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+16 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (39): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+31 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 5 - "authService.ts"
Cohesion: 0.10
Nodes (27): LoginPageProps, signOutSafely(), AppShellProps, TopBarProps, AuthModal(), AuthModalProps, BulkImportModal(), AccessManagementPanelProps (+19 more)

### Community 6 - "notify"
Cohesion: 0.09
Nodes (55): useAppContext(), confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), ClinicTab(), ClinicTabProps (+47 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (24): 4. Navigation and app shell, AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView (+16 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.14
Nodes (36): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+28 more)

### Community 14 - "App.tsx"
Cohesion: 0.12
Nodes (14): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+6 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.11
Nodes (8): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan

### Community 16 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 17 - "makeSchedule"
Cohesion: 0.09
Nodes (22): SchedulingEngine, hoursOnlyRules(), makeSchedule(), LATE, run(), setup(), CARD, doctorOfAmy() (+14 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (20): jose, authMiddleware(), AuthUser, Express, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields (+12 more)

### Community 19 - "SchedulesView.tsx"
Cohesion: 0.10
Nodes (34): MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), EditDoctorShiftModal(), SwapManagerModal(), TemplateModal(), VersionCompareModal() (+26 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (11): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS (+3 more)

### Community 22 - "ShareModal.tsx"
Cohesion: 0.48
Nodes (6): PublishModal(), ShareModal(), TabType, PublishView(), ensurePublicRosters(), syncPublicRoster()

### Community 23 - "gridSelection.ts"
Cohesion: 0.10
Nodes (16): CellView, GridCellActions, GridCellProps, CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef (+8 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.07
Nodes (53): RFC-5545, 12. Publishing and nurse links, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), dateLabel(), PublishedRosterSheet() (+45 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.15
Nodes (16): toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+8 more)

### Community 27 - "IRepository"
Cohesion: 0.11
Nodes (21): saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+13 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (45): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+37 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.09
Nodes (18): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+10 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.11
Nodes (33): cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), SOURCE_WORDS, specialtyMatches(), withDr() (+25 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "EntityForCollection"
Cohesion: 0.32
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 46 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.20
Nodes (9): @firebase/rules-unit-testing, firebase-tools, description, firebase, name, private, scripts, test (+1 more)

### Community 48 - "yearToDate.ts"
Cohesion: 0.14
Nodes (20): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+12 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.10
Nodes (17): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, ClinicRoster (+9 more)

### Community 50 - "dialogs.tsx"
Cohesion: 0.24
Nodes (10): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, PendingConfirm, settleConfirm() (+2 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "analysisExportService.ts"
Cohesion: 0.18
Nodes (16): resolveClinicSetup(), isPendingLeave(), isLateDuty(), lateDutyThreshold(), ANALYSIS_FORMAT_VERSION, buildRosterAnalysis(), countBy(), FIELD_GUIDE (+8 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+15 more)

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

### Community 68 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (35): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), hoursCheckpoints(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+27 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "emailService.ts"
Cohesion: 0.17
Nodes (13): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+5 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "hoursRules.test.ts"
Cohesion: 0.10
Nodes (14): D, E, L, NC, PHL, SENIOR, week, DR_PCC (+6 more)

### Community 78 - "weekHours.test.ts"
Cohesion: 0.14
Nodes (14): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, leaveApprovalFields(), GenerationResult, addDays(), fitsWeekHours() (+6 more)

### Community 79 - "holidayLeave.ts"
Cohesion: 0.23
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+4 more)

### Community 80 - "authorizedFetch"
Cohesion: 0.28
Nodes (7): authorizedFetch(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "Sidebar.tsx"
Cohesion: 0.39
Nodes (6): APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (32): isPairing(), PREFERENCE_FOCUS_LABELS, STALE_MS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus (+24 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.09
Nodes (24): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+16 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.08
Nodes (54): 16. History of work (for context), LocalModeBanner(), LocalModeBannerProps, Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone (+46 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 89 - "access.ts"
Cohesion: 0.33
Nodes (9): 3. Users, roles and access, AccountMenu(), TopBar(), canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor(), roleLabel() (+1 more)

### Community 90 - "apiApp.ts"
Cohesion: 0.16
Nodes (12): express, @google/genai, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 91 - "firebaseConfig.ts"
Cohesion: 0.38
Nodes (5): FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "doctorScheduleService.ts"
Cohesion: 0.16
Nodes (18): doctorFromDate(), generateDoctorSessionsForDateRange(), missingPatternSessions(), nextDay(), PatternSessionPlan, planPatternSessions(), PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult (+10 more)

### Community 94 - "liveCollectionCache.ts"
Cohesion: 0.33
Nodes (4): CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "lastResort.test.ts"
Cohesion: 0.13
Nodes (10): ScheduleValidator, DR_PEDS, ENT, FULL, PEDS, RULES, EARLY, LATE (+2 more)

### Community 97 - "DoctorsView.tsx"
Cohesion: 0.23
Nodes (12): DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, DateRange, defaultPatternRange(), defaultSessionDate() (+4 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "ref_node_assert"
Cohesion: 0.08
Nodes (14): BACKUPS_KEPT, csvCell(), diff(), LATE, nurse, now, nurses, published (+6 more)

### Community 104 - "react"
Cohesion: 0.13
Nodes (29): lucide-react, react, NoticeTone, openStack, useDialogA11y(), usePermissions(), DeleteScheduleModal(), DeleteVersionModal() (+21 more)

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 112 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 117 - "makeNurse"
Cohesion: 0.10
Nodes (17): ctx(), EARLY, LATE, EARLY, input(), LATE, softHoursLimit, week (+9 more)

### Community 118 - "emailPublishing.test.ts"
Cohesion: 0.31
Nodes (6): nodemailer, checkEmailReadiness(), EmailReadiness, readEmailResponse(), configured, live

### Community 120 - "explainCell.ts"
Cohesion: 0.15
Nodes (22): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+14 more)

### Community 123 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **833 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+828 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1017 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `SchedulesView.tsx`, `ShareModal.tsx`, `gridSelection.ts`, `nurseRosterService.ts`, `PlannerSample.tsx`, `WorkbookGrid.tsx`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `dialogs.tsx`, `RulesTab.tsx`, `Sidebar.tsx`, `fixtures.ts`, `ui/index.ts`, `access.ts`, `harness/main.tsx`, `DoctorsView.tsx`, `NurseSample.tsx`, `explainCell.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `SchedulesView.tsx`, `ShareModal.tsx`, `gridSelection.ts`, `nurseRosterService.ts`, `PlannerSample.tsx`, `WorkbookGrid.tsx`, `ui.tsx`, `dialogs.tsx`, `RulesTab.tsx`, `Sidebar.tsx`, `ui/index.ts`, `access.ts`, `harness/main.tsx`, `DoctorsView.tsx`, `NurseSample.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `DashboardView.tsx`, `ExportModal.tsx`, `clinicModel.test.ts`, `makeSchedule`, `SchedulesView.tsx`, `savingSafety.test.ts`, `nurseRosterService.ts`, `IRepository`, `SchedulingEngine.ts`, `engineRules.test.ts`, `WorkbookGrid.tsx`, `cellView.test.ts`, `continuousHours.test.ts`, `yearToDate.ts`, `analysisExportService.ts`, `hoursBalance.ts`, `hoursRules.test.ts`, `weekHours.test.ts`, `types/index.ts`, `fixtures.ts`, `doctorScheduleService.ts`, `lastResort.test.ts`, `ref_node_assert`, `react`, `nurseClinicFloat.test.ts`, `makeNurse`, `explainCell.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _833 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.05264695144213216 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09619450317124736 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._