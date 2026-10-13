# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 309 files · ~362,854 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2475 nodes · 7809 edges · 121 communities (111 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 293 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `32e75194`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- ExportModal.tsx
- clinicModel.test.ts
- PublishModal.tsx
- react
- getRepository
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AvailabilityView.tsx
- App.tsx
- CollectionSyncer
- seedRunner.ts
- makeNurse
- firebaseIdentityService.ts
- MenuButton.tsx
- compilerOptions
- savingSafety.test.ts
- analysisExportService.ts
- gridSelection.ts
- devDependencies
- nurseRosterService.ts
- SchedulesView.tsx
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
- icsExportService.ts
- WorkbookGrid.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- cellView.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- ui.tsx
- firestore-rules/package.json
- yearToDate.ts
- holidayLeave.ts
- dialogs.tsx
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- quotaTracker
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
- harness/vite.config.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- hoursRules.test.ts
- weekHours.test.ts
- handMoves.test.ts
- Badge.tsx
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- ui/index.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- apiApp.ts
- access.ts
- geminiApi.test.ts
- FairnessModal.tsx
- harness/main.tsx
- LiveCollectionCache
- 16. History of work (for context)
- Finish a change
- Rules
- dateDefaults.ts
- formatDate
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- ref_node_assert
- firebase-mcp.sh
- NurseTimesheetModal.tsx
- start.sh
- stop.sh
- Rules
- lastResort.test.ts
- index.tsx
- Sidebar.tsx
- sharing.test.ts
- GridRow.tsx
- devDependencies
- emailLogSize.ts
- preferenceFocus.test.ts
- createLiveReconciler
- EmailTab.tsx
- fakeAuth.ts
- newRosterDates.ts
- ddmmyyyy

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 103 edges
2. `getRepository()` - 95 edges
3. `react` - 94 edges
4. `Nurse` - 87 edges
5. `Schedule` - 86 edges
6. `DutyWindow` - 83 edges
7. `lucide-react` - 77 edges
8. `useDialogA11y()` - 74 edges
9. `Doctor` - 73 edges
10. `notify()` - 69 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `9. Checking a roster (`src/services/validation/ScheduleValidator.ts`)` --references--> `recordHolidayDayOff()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/requests/staffRequestService.ts

## Import Cycles
- None detected.

## Communities (121 total, 10 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.15
Nodes (63): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, ShareModalProps, NONE (+55 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (23): PageLoading(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId() (+15 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (39): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+31 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishModal.tsx"
Cohesion: 0.19
Nodes (21): Things that went wrong before, 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink() (+13 more)

### Community 5 - "react"
Cohesion: 0.13
Nodes (26): lucide-react, react, uuid, NoticeTone, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModalProps (+18 more)

### Community 6 - "getRepository"
Cohesion: 0.11
Nodes (53): useAppContext(), confirmDialog(), notify(), SwapManagerModal(), TemplateModal(), AccessManagementPanel(), NursesView(), ClinicTab() (+45 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.11
Nodes (30): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+22 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.11
Nodes (38): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+30 more)

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (12): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+4 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.15
Nodes (5): 11. Saving, live updates, versions, CollectionSyncer, fingerprint(), planSync(), EntityForCollection

### Community 16 - "seedRunner.ts"
Cohesion: 0.13
Nodes (22): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+14 more)

### Community 17 - "makeNurse"
Cohesion: 0.16
Nodes (17): input(), shift(), hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup() (+9 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.10
Nodes (25): jose, AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields (+17 more)

### Community 19 - "MenuButton.tsx"
Cohesion: 0.50
Nodes (3): MenuButton(), MenuButtonProps, MenuItem

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "savingSafety.test.ts"
Cohesion: 0.09
Nodes (13): Desired, Known, SyncPlan, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, rebaseEdit() (+5 more)

### Community 22 - "analysisExportService.ts"
Cohesion: 0.13
Nodes (21): isPendingLeave(), isLateDuty(), ANALYSIS_FORMAT, ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy(), downloadRosterAnalysis() (+13 more)

### Community 23 - "gridSelection.ts"
Cohesion: 0.10
Nodes (15): GridCellProps, CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelection (+7 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (33): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+25 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.10
Nodes (29): DeleteScheduleModal(), DeleteVersionModal(), VersionCompareModal(), VersionViewModal(), HistoryView(), WEEKDAY_NAMES, readStoredScheduleId(), SchedulesView() (+21 more)

### Community 27 - "IRepository"
Cohesion: 0.08
Nodes (27): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), removeNurseRoster(), revokeNurseLink(), pick(), PUBLIC_LEAVE_TYPE (+19 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (57): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+49 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (14): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+6 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "icsExportService.ts"
Cohesion: 0.14
Nodes (20): RFC-5545, calendarRouter, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact() (+12 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.09
Nodes (37): cellLookupsOf(), CellView, cellViewOf(), fmtHours(), reuseCellViews(), sameView(), SOURCE_WORDS, specialtyMatches() (+29 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.20
Nodes (9): @firebase/rules-unit-testing, firebase-tools, description, firebase, name, private, scripts, test (+1 more)

### Community 48 - "yearToDate.ts"
Cohesion: 0.15
Nodes (20): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+12 more)

### Community 49 - "holidayLeave.ts"
Cohesion: 0.07
Nodes (31): 0. Quick start for a new chat, 10. Hours, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+23 more)

### Community 50 - "dialogs.tsx"
Cohesion: 0.18
Nodes (14): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+6 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "quotaTracker"
Cohesion: 0.13
Nodes (8): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

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

### Community 68 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (31): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+23 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (19): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+11 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "emailService.ts"
Cohesion: 0.17
Nodes (13): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+5 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "harness/vite.config.ts"
Cohesion: 0.24
Nodes (7): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, startServer(), clinicApi()

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.15
Nodes (17): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+9 more)

### Community 77 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 78 - "weekHours.test.ts"
Cohesion: 0.11
Nodes (12): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+4 more)

### Community 79 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 80 - "Badge.tsx"
Cohesion: 0.24
Nodes (10): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, nextTabIndex(), TabItem (+2 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.15
Nodes (16): AppContext, AppContextValue, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+8 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (37): LoginPageProps, signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, MASTER_ADMIN_EMAIL, UserPrivileges (+29 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.09
Nodes (23): 15. Tests, EARLY, input(), LATE, softHoursLimit, week, ANNUAL_LEAVE, DAY_DUTY (+15 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.12
Nodes (27): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, Card() (+19 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "apiApp.ts"
Cohesion: 0.19
Nodes (8): express, express-rate-limit, helmet, createApiApp(), authMiddleware(), BackendRole, requireAuth(), authRouter

### Community 89 - "access.ts"
Cohesion: 0.23
Nodes (11): 3. Users, roles and access, AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor() (+3 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "FairnessModal.tsx"
Cohesion: 0.13
Nodes (19): NONE, NurseFairnessMetrics, ProposedSwap, NurseTimesheetModalProps, SortField, TabMode, HoursPart, NurseHoursBalance (+11 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "LiveCollectionCache"
Cohesion: 0.19
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 94 - "16. History of work (for context)"
Cohesion: 0.24
Nodes (14): 16. History of work (for context), cx(), Checkbox(), DateInput(), Field(), FieldInputProps, Input(), inputClass (+6 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 98 - "formatDate"
Cohesion: 0.07
Nodes (42): Report, What to check, What to look at, Other engine files, FairnessModal(), HolidayDayOffPicker(), HolidayDayOffPickerProps, ProblemsPanel() (+34 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.19
Nodes (21): 13. Screens in detail, CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift() (+13 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "ref_node_assert"
Cohesion: 0.11
Nodes (11): ctx(), EARLY, LATE, diff(), LATE, nurse, nurses, published (+3 more)

### Community 104 - "NurseTimesheetModal.tsx"
Cohesion: 0.11
Nodes (24): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), AuditAction (+16 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (14): FLOAT_ROLE_ID, SchedulingEngine, DR_PEDS, ENT, FULL, PEDS, RULES, CARD (+6 more)

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "Sidebar.tsx"
Cohesion: 0.36
Nodes (7): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "GridRow.tsx"
Cohesion: 0.43
Nodes (7): GridCell, GridCellActions, fmtHours(), GridRow, GridRowActions, hoursDisplay(), PROBLEM_SEPARATOR

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 115 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 116 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 118 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 119 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 123 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 126 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

## Knowledge Gaps
- **868 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+863 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1056 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `ExportModal.tsx`, `PublishModal.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `makeNurse`, `MenuButton.tsx`, `gridSelection.ts`, `nurseRosterService.ts`, `SchedulesView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `holidayLeave.ts`, `dialogs.tsx`, `RulesTab.tsx`, `Badge.tsx`, `ClinicContextState`, `types/index.ts`, `ui/index.ts`, `access.ts`, `FairnessModal.tsx`, `harness/main.tsx`, `16. History of work (for context)`, `formatDate`, `doctorScheduleService.ts`, `NurseTimesheetModal.tsx`, `Sidebar.tsx`, `GridRow.tsx`, `EmailTab.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `ExportModal.tsx`, `PublishModal.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `gridSelection.ts`, `nurseRosterService.ts`, `SchedulesView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `dialogs.tsx`, `RulesTab.tsx`, `Badge.tsx`, `types/index.ts`, `ui/index.ts`, `access.ts`, `FairnessModal.tsx`, `harness/main.tsx`, `16. History of work (for context)`, `formatDate`, `doctorScheduleService.ts`, `NurseTimesheetModal.tsx`, `Sidebar.tsx`, `EmailTab.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `DashboardView.tsx`, `PublishModal.tsx`, `doctorScheduleService.ts`, `react`, `getRepository`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `Sidebar.tsx`, `types/index.ts`, `EmailTab.tsx`, `access.ts`, `SchedulesView.tsx`, `FairnessModal.tsx`, `nurseRosterService.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _868 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10241545893719807 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.12605042016806722 - nodes in this community are weakly interconnected._