# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 324 files · ~370,574 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2532 nodes · 8076 edges · 133 communities (124 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 332 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5707132`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- Button.tsx
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
- FirestoreRepository.ts
- makeNurse
- firebaseIdentityService.ts
- WorkingHoursPeriodsPanel.tsx
- compilerOptions
- savingSafety.test.ts
- weekHours.test.ts
- gridSelection.ts
- devDependencies
- nurseRosterService.ts
- HistoryView
- Sidebar.tsx
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- published-rules.mjs
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- icsExportService.ts
- WorkbookGrid.tsx
- emailService.ts
- Optimization Patterns
- cellView.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- ui.tsx
- firestore-rules/package.json
- yearToDate.ts
- NSC Clinic Roster: complete project guide
- DoctorsScheduleSheet.tsx
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
- doctorWeekChange.test.ts
- guide-with-code.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- editSaving.test.ts
- engineRules.test.ts
- handMoves.test.ts
- ExportModal.tsx
- links.cjs
- ClinicContextState
- types/index.ts
- ref_node_assert
- address.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- colorContrast.ts
- authService.ts
- geminiApi.test.ts
- hoursRules.test.ts
- harness/main.tsx
- LiveCollectionCache
- FairnessModal.tsx
- Finish a change
- Rules
- ui/index.ts
- WarningsSheet.tsx
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- SchedulesView.tsx
- start.sh
- stop.sh
- Rules
- nurseClinicFloat.test.ts
- index.tsx
- rosterPublishService.ts
- sharing.test.ts
- seedRunner.ts
- devDependencies
- teamRoster.test.ts
- checkScheduler.test.ts
- fakeAuth.ts
- holidayLeave.ts
- EmailTab.tsx
- PublishedRosterView.tsx
- ruleSyncService.ts
- WhoCanCover.tsx
- lastResort.test.ts
- newRosterDates.ts
- plain-english-reviewer.md
- middleware/auth.ts
- ddmmyyyy
- IRepository
- RosterToolbar.tsx
- 16. History of work (for context)
- FillDialog.tsx
- RosterSteps.tsx
- dateUtils.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 110 edges
2. `react` - 102 edges
3. `getRepository()` - 95 edges
4. `Schedule` - 92 edges
5. `Nurse` - 89 edges
6. `DutyWindow` - 85 edges
7. `lucide-react` - 81 edges
8. `useDialogA11y()` - 78 edges
9. `Doctor` - 75 edges
10. `LeaveEntry` - 71 edges

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

## Communities (133 total, 9 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.13
Nodes (69): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, ShareModalProps, NONE (+61 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.20
Nodes (19): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+11 more)

### Community 2 - "Button.tsx"
Cohesion: 0.17
Nodes (14): LocalModeBanner(), LocalModeBannerProps, Button(), ButtonProps, ButtonSize, ButtonVariant, IconButton(), IconButtonProps (+6 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishModal.tsx"
Cohesion: 0.21
Nodes (18): Things that went wrong before, 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink() (+10 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (31): lucide-react, react, uuid, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice() (+23 more)

### Community 6 - "getRepository"
Cohesion: 0.15
Nodes (38): confirmDialog(), notify(), ShareModal(), TemplateModal(), AccessManagementPanel(), ClinicTab(), DutiesTab(), DutiesTabProps (+30 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.20
Nodes (22): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (34): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+26 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+4 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.10
Nodes (11): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, rebaseEdit() (+3 more)

### Community 16 - "FirestoreRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 17 - "makeNurse"
Cohesion: 0.10
Nodes (27): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+19 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.14
Nodes (19): jose, calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+11 more)

### Community 19 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.32
Nodes (9): WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), PeriodProratingBreakdown, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS (+1 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (11): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS (+3 more)

### Community 22 - "weekHours.test.ts"
Cohesion: 0.18
Nodes (4): SchedulingEngine, LONG, OCT, LATE

### Community 23 - "gridSelection.ts"
Cohesion: 0.20
Nodes (13): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelectionState, keyOf() (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (27): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+19 more)

### Community 26 - "HistoryView"
Cohesion: 0.20
Nodes (10): DeleteScheduleModal(), DeleteVersionModal(), VersionCompareModal(), VersionViewModal(), HistoryView(), computeScheduleDiff(), formatAssignment(), diff() (+2 more)

### Community 27 - "Sidebar.tsx"
Cohesion: 0.39
Nodes (6): APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.06
Nodes (85): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+77 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

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
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.08
Nodes (42): cellLookupsOf(), CellView, cellViewOf(), fmtHours(), reuseCellViews(), sameView(), SOURCE_WORDS, specialtyMatches() (+34 more)

### Community 39 - "emailService.ts"
Cohesion: 0.19
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+5 more)

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

### Community 45 - "FirestoreRepository"
Cohesion: 0.21
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.20
Nodes (9): @firebase/rules-unit-testing, firebase-tools, description, firebase, name, private, scripts, test (+1 more)

### Community 48 - "yearToDate.ts"
Cohesion: 0.14
Nodes (21): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+13 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 50 - "DoctorsScheduleSheet.tsx"
Cohesion: 0.19
Nodes (12): EditDoctorShiftModal(), ClinicTabProps, SaveStatus, WEEKDAY_NAMES, DoctorsScheduleSheet(), WEEKDAY_ABBR, ClinicProfile, currentWeekendDays (+4 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "quotaTracker"
Cohesion: 0.13
Nodes (9): defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener (+1 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.18
Nodes (15): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup, RulesTab() (+7 more)

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
Cohesion: 0.13
Nodes (25): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+17 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (19): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+11 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "doctorWeekChange.test.ts"
Cohesion: 0.17
Nodes (10): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+2 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (12): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+4 more)

### Community 77 - "editSaving.test.ts"
Cohesion: 0.12
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 79 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

### Community 80 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (63): xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps (+55 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.10
Nodes (28): 3. Users, roles and access, AppContext, AppContextValue, usePermissions(), AccountMenu(), TopBar(), TopBarProps, AuditTrailViewProps (+20 more)

### Community 83 - "types/index.ts"
Cohesion: 0.09
Nodes (21): ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus, Invitation, InvitationStatus (+13 more)

### Community 84 - "ref_node_assert"
Cohesion: 0.08
Nodes (28): 15. Tests, ctx(), EARLY, LATE, EARLY, input(), LATE, softHoursLimit (+20 more)

### Community 85 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 89 - "authService.ts"
Cohesion: 0.18
Nodes (11): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, computePrivileges(), MASTER_ADMIN_EMAIL, UserPrivileges (+3 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "LiveCollectionCache"
Cohesion: 0.17
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 94 - "FairnessModal.tsx"
Cohesion: 0.19
Nodes (19): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap (+11 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "ui/index.ts"
Cohesion: 0.11
Nodes (38): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Card(), Crumb (+30 more)

### Community 98 - "WarningsSheet.tsx"
Cohesion: 0.24
Nodes (8): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.15
Nodes (24): CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, WorkingHoursCalculationResult (+16 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "SchedulesView.tsx"
Cohesion: 0.19
Nodes (21): useLatestCallback(), SwapManagerModal(), FillDialog(), RosterPicker(), RosterPickerProps, RosterSheet, RosterSheetTabs(), RosterSteps() (+13 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "rosterPublishService.ts"
Cohesion: 0.17
Nodes (12): Request, AcknowledgePageProps, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, WEEKDAY_NAMES (+4 more)

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "seedRunner.ts"
Cohesion: 0.12
Nodes (27): useAppContext(), DatabaseTab(), DatabaseTabProps, saveRosterBackup(), restoreVersion(), removeNurseRoster(), revokeNurseLink(), afterShiftsSaved() (+19 more)

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 115 - "checkScheduler.test.ts"
Cohesion: 0.23
Nodes (7): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler(), history()

### Community 116 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 117 - "holidayLeave.ts"
Cohesion: 0.28
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday() (+4 more)

### Community 118 - "EmailTab.tsx"
Cohesion: 0.16
Nodes (16): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+8 more)

### Community 119 - "PublishedRosterView.tsx"
Cohesion: 0.43
Nodes (6): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, withoutBackups(), buildTeamRosterSheet(), loadPublicRoster()

### Community 120 - "ruleSyncService.ts"
Cohesion: 0.29
Nodes (7): RuleDef, WEEK_HOURS_DEFAULT, CANONICAL_RULES_SPEC, CanonicalRuleDef, MAX_CONSECUTIVE_SHIFTS_NAME, RuleSyncResult, RuleTemplateKey

### Community 121 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 122 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 123 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (13): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+5 more)

### Community 126 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 127 - "IRepository"
Cohesion: 0.12
Nodes (16): BACKUPS_KEPT, VersionRestoreResult, saveHolidayLeave(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+8 more)

### Community 128 - "RosterToolbar.tsx"
Cohesion: 0.19
Nodes (12): MenuButton(), MenuButtonProps, MenuItem, RosterMenuItem, RosterToolbarProps, RegenerateMode, othersOnRoster(), samePeople() (+4 more)

### Community 129 - "16. History of work (for context)"
Cohesion: 0.15
Nodes (10): 16. History of work (for context), GridCellProps, GridSelection, addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange() (+2 more)

### Community 130 - "FillDialog.tsx"
Cohesion: 0.60
Nodes (4): FillDialogProps, FillRange, GenerationPreflightSummary, GenerationProgress

### Community 132 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 133 - "dateUtils.ts"
Cohesion: 0.33
Nodes (5): HolidayDayOffPickerProps, formatDateTime(), formatDayDate(), parseDayMonthYear(), WEEKDAYS

## Knowledge Gaps
- **873 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+868 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1067 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `RosterToolbar.tsx`, `Assignment`, `Button.tsx`, `FillDialog.tsx`, `PublishModal.tsx`, `RosterSteps.tsx`, `DashboardView.tsx`, `getRepository`, `dateUtils.ts`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `WorkingHoursPeriodsPanel.tsx`, `gridSelection.ts`, `nurseRosterService.ts`, `Sidebar.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `DoctorsScheduleSheet.tsx`, `RulesTab.tsx`, `Design system: NSC Clinic Roster`, `ExportModal.tsx`, `ClinicContextState`, `ref_node_assert`, `authService.ts`, `harness/main.tsx`, `FairnessModal.tsx`, `ui/index.ts`, `WarningsSheet.tsx`, `DoctorsView.tsx`, `SchedulesView.tsx`, `rosterPublishService.ts`, `seedRunner.ts`, `EmailTab.tsx`, `PublishedRosterView.tsx`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `RosterToolbar.tsx`, `Button.tsx`, `FillDialog.tsx`, `PublishModal.tsx`, `RosterSteps.tsx`, `DashboardView.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `WorkingHoursPeriodsPanel.tsx`, `gridSelection.ts`, `nurseRosterService.ts`, `Sidebar.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `DoctorsScheduleSheet.tsx`, `RulesTab.tsx`, `ExportModal.tsx`, `ClinicContextState`, `authService.ts`, `harness/main.tsx`, `FairnessModal.tsx`, `ui/index.ts`, `WarningsSheet.tsx`, `DoctorsView.tsx`, `SchedulesView.tsx`, `rosterPublishService.ts`, `seedRunner.ts`, `EmailTab.tsx`, `PublishedRosterView.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `DashboardView.tsx`, `RosterToolbar.tsx`, `PublishModal.tsx`, `react`, `DoctorsView.tsx`, `getRepository`, `SchedulesView.tsx`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `rosterPublishService.ts`, `ClinicContextState`, `EmailTab.tsx`, `PublishedRosterView.tsx`, `authService.ts`, `Sidebar.tsx`, `FairnessModal.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _873 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.13135468704084632 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.1101010101010101 - nodes in this community are weakly interconnected._