# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 275 files · ~334,991 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2229 nodes · 7112 edges · 101 communities (93 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 236 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f5d5b17a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- nurseRosterService.ts
- ExportModal.tsx
- clinicModel.test.ts
- icsExportService.ts
- lucide-react
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
- DashboardView.tsx
- makeNurse
- firebaseIdentityService.ts
- SchedulesView.tsx
- compilerOptions
- DoctorsView.tsx
- weekend.ts
- EntityForCollection
- devDependencies
- emailService.ts
- seedRunner.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- PlannerSample.tsx
- dateFormatter.ts
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- ref_node_assert
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- FirestoreRepository.ts
- ui.tsx
- published-rules.mjs
- SchedulingEngine.ts
- fixtures.ts
- yearToDate.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
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
- access.ts
- ShareModal.tsx
- Source-Driven Development
- WorkingHoursPeriodsPanel.tsx
- PublishModal
- createApiApp
- emailSettingsStore.ts
- Design system: NSC Clinic Roster
- README.md
- plain-english-reviewer.md
- lastResort.test.ts
- Button
- PublishedRosterView.tsx
- hoursRules.test.ts
- handMoveChecks.ts
- types/index.ts
- engineRules.test.ts
- Phases
- Things that went wrong before
- holidayLeave.ts
- geminiApi.test.ts
- UI overhaul: checklist
- harness/main.tsx
- createLiveReconciler
- Finish a change
- context7
- newRosterDates.ts
- firestore-rules-reviewer.md
- firebase-mcp.sh
- hoursAccounting.ts
- start.sh
- stop.sh
- weekHours.test.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 86 edges
4. `DutyWindow` - 81 edges
5. `Nurse` - 81 edges
6. `react` - 79 edges
7. `useDialogA11y()` - 71 edges
8. `Doctor` - 70 edges
9. `lucide-react` - 66 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Parts (first drafts in `.claude/skills/browser-check/harness/sample/`)` --references--> `useDialogA11y()`  [INFERRED]
  design-system/nsc-clinic-roster/MASTER.md → src/components/common/useDialogA11y.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (101 total, 8 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.13
Nodes (71): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+63 more)

### Community 1 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (26): dateLabel(), PublishedRosterSheet(), ViewerData, DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView() (+18 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (42): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+34 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "icsExportService.ts"
Cohesion: 0.11
Nodes (23): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+15 more)

### Community 5 - "lucide-react"
Cohesion: 0.10
Nodes (30): lucide-react, LoginPageProps, signOutSafely(), AppShellProps, TopBar(), TopBarProps, AuthModal(), AuthModalProps (+22 more)

### Community 6 - "notify"
Cohesion: 0.10
Nodes (52): ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+44 more)

### Community 7 - "authService"
Cohesion: 0.07
Nodes (18): authorizedFetch(), authService, computePrivileges(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), FirebaseConfig, getAppAuth() (+10 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (21): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.13
Nodes (37): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+29 more)

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.08
Nodes (15): 11. Saving, live updates, versions, clearYearToDateCache(), forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+7 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.15
Nodes (26): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+18 more)

### Community 17 - "makeNurse"
Cohesion: 0.11
Nodes (26): 15. Tests, SchedulingEngine, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+18 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "SchedulesView.tsx"
Cohesion: 0.08
Nodes (47): react, MenuButton(), MenuButtonProps, MenuItem, openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps (+39 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "DoctorsView.tsx"
Cohesion: 0.11
Nodes (34): 16. History of work (for context), CreateScheduleModal(), CreateScheduleModalProps, WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView(), WEEKDAY_NAMES (+26 more)

### Community 22 - "weekend.ts"
Cohesion: 0.23
Nodes (10): ClinicTab(), ClinicTabProps, WEEKDAY_NAMES, SettingsViewProps, ClinicProfile, currentWeekendDays, DEFAULT_WEEKEND_DAYS, getWeekendDays() (+2 more)

### Community 23 - "EntityForCollection"
Cohesion: 0.36
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.16
Nodes (15): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+7 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.14
Nodes (21): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+13 more)

### Community 27 - "IRepository"
Cohesion: 0.10
Nodes (18): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removePublicRoster(), fingerprint(), syncScheduleAssignments(), repositoryManager (+10 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.06
Nodes (62): 7. Rules, How a run works, findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish (+54 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.18
Nodes (27): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+19 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (25): Cell, dayLabel(), DAYS, ddmmyyyy(), DOCTORS, LEAVE, Nurse, NURSES (+17 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (14): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+6 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 38 - "ref_node_assert"
Cohesion: 0.11
Nodes (10): computeScheduleDiff(), ctx(), EARLY, LATE, diff(), LATE, nurse, configured (+2 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.13
Nodes (15): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, Request (+7 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "FirestoreRepository.ts"
Cohesion: 0.11
Nodes (11): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, FirebaseClientConfig, CacheEntry, ListFilter, UNCACHED_COLLECTIONS (+3 more)

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (64): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+56 more)

### Community 49 - "fixtures.ts"
Cohesion: 0.08
Nodes (22): EARLY, input(), LATE, softHoursLimit, week, ANNUAL_LEAVE, DAY_DUTY, makeLeave() (+14 more)

### Community 50 - "yearToDate.ts"
Cohesion: 0.16
Nodes (17): YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), computeYearToDate(), earlierRostersThisYear() (+9 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

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

### Community 68 - "access.ts"
Cohesion: 0.20
Nodes (13): 3. Users, roles and access, usePermissions(), NAV_ITEMS, SidebarProps, DashboardViewProps, canAccessRoute(), canEditClinicData(), canExportReports() (+5 more)

### Community 69 - "ShareModal.tsx"
Cohesion: 0.43
Nodes (6): uuid, ShareModal(), TabType, ensurePublicRosters(), pick(), syncPublicRoster()

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.25
Nodes (12): WorkingHoursPeriodsPanel(), WorkingHoursPeriodsPanelProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+4 more)

### Community 72 - "PublishModal"
Cohesion: 0.23
Nodes (11): 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), PublishView(), ensureNurseLink(), newToken(), nurseLinkUrl(), regenerateNurseLink() (+3 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "emailSettingsStore.ts"
Cohesion: 0.32
Nodes (9): removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), clearDatabase(), writeInitializationState(), cache(), cachedEmailSettings(), loadEmailSettings() (+1 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.18
Nodes (10): Checklist before a screen is delivered, Colours, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks, Sizes of controls (+2 more)

### Community 77 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 78 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 79 - "Button"
Cohesion: 0.33
Nodes (9): datesOf(), day(), PageHeader(), ProblemList(), RequestsCard(), StatusBadge(), Badge(), Button() (+1 more)

### Community 80 - "PublishedRosterView.tsx"
Cohesion: 0.39
Nodes (7): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), withoutBackups(), buildTeamRosterSheet(), loadPublicRoster()

### Community 81 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 82 - "handMoveChecks.ts"
Cohesion: 0.06
Nodes (38): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), Entry points (+30 more)

### Community 83 - "types/index.ts"
Cohesion: 0.05
Nodes (39): isPairing(), PREFERENCE_FOCUS_LABELS, STALE_MS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus (+31 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "Phases"
Cohesion: 0.11
Nodes (17): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+9 more)

### Community 86 - "Things that went wrong before"
Cohesion: 0.29
Nodes (4): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before

### Community 87 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.14
Nodes (13): Dialog(), Phase 7: publishing, History and all dialogs, Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails (+5 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.08
Nodes (11): context, publishNovember(), Single(), start(), user, FONTS, renderSample(), Drawer() (+3 more)

### Community 94 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 104 - "hoursAccounting.ts"
Cohesion: 0.14
Nodes (26): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField, TabMode (+18 more)

### Community 112 - "weekHours.test.ts"
Cohesion: 0.11
Nodes (12): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+4 more)

## Knowledge Gaps
- **783 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+778 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 952 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SchedulesView.tsx` to `Assignment`, `nurseRosterService.ts`, `ExportModal.tsx`, `lucide-react`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `DoctorsView.tsx`, `weekend.ts`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `data.ts`, `ui.tsx`, `fixtures.ts`, `RulesTab.tsx`, `access.ts`, `ShareModal.tsx`, `WorkingHoursPeriodsPanel.tsx`, `PublishedRosterView.tsx`, `handMoveChecks.ts`, `harness/main.tsx`, `hoursAccounting.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `Assignment`, `nurseRosterService.ts`, `ExportModal.tsx`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `SchedulesView.tsx`, `DoctorsView.tsx`, `weekend.ts`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `data.ts`, `ui.tsx`, `RulesTab.tsx`, `access.ts`, `ShareModal.tsx`, `WorkingHoursPeriodsPanel.tsx`, `PublishedRosterView.tsx`, `hoursAccounting.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `nurseRosterService.ts`, `ExportModal.tsx`, `clinicModel.test.ts`, `icsExportService.ts`, `CollectionSyncer`, `DashboardView.tsx`, `makeNurse`, `SchedulesView.tsx`, `DoctorsView.tsx`, `IRepository`, `WorkbookGrid.tsx`, `ref_node_assert`, `continuousHours.test.ts`, `nurseClinicFloat.test.ts`, `SchedulingEngine.ts`, `fixtures.ts`, `yearToDate.ts`, `handMoves.test.ts`, `lastResort.test.ts`, `hoursRules.test.ts`, `handMoveChecks.ts`, `types/index.ts`, `engineRules.test.ts`, `hoursAccounting.ts`, `weekHours.test.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _783 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.12929767851895385 - nodes in this community are weakly interconnected._
- **Should `nurseRosterService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14532019704433496 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09608843537414966 - nodes in this community are weakly interconnected._