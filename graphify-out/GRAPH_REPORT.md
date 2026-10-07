# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 269 files · ~325,142 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 3, (none) 3, .example 1)

## Summary
- 2128 nodes · 6846 edges · 101 communities (92 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 224 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba890cdf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- analysisExportService.ts
- ScheduleValidator.ts
- clinicModel.test.ts
- nurseRosterService.ts
- authService.ts
- confirmDialog
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AvailabilityView.tsx
- App.tsx
- CollectionSyncer
- DashboardView.tsx
- makeNurse
- firebaseIdentityService.ts
- react
- compilerOptions
- doctorScheduleService.ts
- SettingsView.tsx
- FirestoreRepository
- devDependencies
- emailService.ts
- seedRunner.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- explainCell.test.ts
- dateFormatter.ts
- Hardening Controls
- dialogs.tsx
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
- quotaTracker
- EmailTab.tsx
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
- handMoveChecks.ts
- getRepository
- Source-Driven Development
- CreateScheduleModal.tsx
- WarningsSheet.tsx
- usePresence.ts
- repository/index.ts
- formatDate
- README.md
- plain-english-reviewer.md
- hoursRules.test.ts
- hoursPolicy.ts
- IRepository.ts
- NSC Clinic Roster: complete project guide
- types/index.ts
- engineRules.test.ts
- Phases
- holidayLeave.ts
- geminiApi.test.ts
- UI overhaul: checklist
- harness/main.tsx
- savingSafety.test.ts
- Finish a change
- WhoCanCover.tsx
- lastResort.test.ts
- context7
- newRosterDates.ts
- firestore-rules-reviewer.md
- firebase-mcp.sh
- SchedulesView.tsx
- start.sh
- stop.sh
- assignmentChecks.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 86 edges
4. `Nurse` - 82 edges
5. `DutyWindow` - 81 edges
6. `react` - 76 edges
7. `useDialogA11y()` - 70 edges
8. `Doctor` - 70 edges
9. `lucide-react` - 63 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `Phase 3: roster grid speed and structure` --references--> `CollectionSyncer`  [INFERRED]
  tasks/plan.md → src/services/repository/collectionSyncer.ts

## Import Cycles
- None detected.

## Communities (101 total, 9 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.05
Nodes (148): 5. Data model (Firestore collections), jspdf, jspdf-autotable, uuid, xlsx, Request, EmailHtmlPreview(), usePermissions() (+140 more)

### Community 1 - "analysisExportService.ts"
Cohesion: 0.18
Nodes (17): resolveClinicSetup(), isPendingLeave(), isLateDuty(), ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy(), downloadRosterAnalysis() (+9 more)

### Community 2 - "ScheduleValidator.ts"
Cohesion: 0.14
Nodes (31): 7. Rules, BlockedShift, explainNurseDay(), ExplainNurseDayInput, pendingLeaveOn(), plainReason(), PossibleShift, requestOn() (+23 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.05
Nodes (74): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before, RFC-5545, 12. Publishing and nurse links, PublishModal(), dateLabel() (+66 more)

### Community 5 - "authService.ts"
Cohesion: 0.11
Nodes (28): signOutSafely(), AppShellProps, NAV_ITEMS, SidebarProps, TopBar(), TopBarProps, AuthModalProps, AccessManagementPanelProps (+20 more)

### Community 6 - "confirmDialog"
Cohesion: 0.14
Nodes (28): confirmDialog(), DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTab(), HolidaysTabProps, BUILT_IN_LEAVE_CODES, isBuiltInCode() (+20 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): 3. Users, roles and access, authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (24): repoRoot, swaps, firebase, name, private, type, version, autoprefixer (+16 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (23): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+15 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (37): 13. Screens in detail, AllRequestsPanel(), AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+29 more)

### Community 14 - "App.tsx"
Cohesion: 0.14
Nodes (13): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps, LoadErrorBoundary (+5 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.11
Nodes (10): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+2 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (18): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), addDays() (+10 more)

### Community 17 - "makeNurse"
Cohesion: 0.10
Nodes (24): DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+16 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "react"
Cohesion: 0.17
Nodes (23): lucide-react, react, notify(), openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps (+15 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "doctorScheduleService.ts"
Cohesion: 0.16
Nodes (20): CreateScheduleModal(), doctorFromDate(), generateDoctorSessionsForDateRange(), missingPatternSessions(), nextDay(), PatternSessionPlan, planPatternSessions(), populateRecurringDoctorSessionsForSchedule() (+12 more)

### Community 22 - "SettingsView.tsx"
Cohesion: 0.18
Nodes (19): ClinicTab(), ClinicTabProps, SaveStatus, SENIORITY_COLOR_PALETTE, SettingsDialogProps, SettingsTab, WEEKDAY_NAMES, SettingsView() (+11 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.15
Nodes (16): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+8 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.14
Nodes (19): removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase() (+11 more)

### Community 27 - "IRepository"
Cohesion: 0.18
Nodes (8): restoreVersion(), VersionRestoreResult, saveHolidayLeave(), fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository, saveDoctorSessions()

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (24): 6. Clinic model (the business rules in plain English), findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption (+16 more)

### Community 30 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

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
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "ref_node_assert"
Cohesion: 0.11
Nodes (10): BACKUPS_KEPT, ctx(), EARLY, LATE, diff(), LATE, nurse, october (+2 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.11
Nodes (18): express, express-rate-limit, helmet, vite, createApiApp(), startServer(), authMiddleware(), AuthUser (+10 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "EmailTab.tsx"
Cohesion: 0.19
Nodes (14): EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+6 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.14
Nodes (27): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes() (+19 more)

### Community 49 - "fixtures.ts"
Cohesion: 0.09
Nodes (23): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+15 more)

### Community 50 - "yearToDate.ts"
Cohesion: 0.13
Nodes (23): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+15 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+13 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.15
Nodes (18): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+10 more)

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

### Community 68 - "handMoveChecks.ts"
Cohesion: 0.16
Nodes (20): Other engine files, FairnessModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields() (+12 more)

### Community 69 - "getRepository"
Cohesion: 0.27
Nodes (11): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster() (+3 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "CreateScheduleModal.tsx"
Cohesion: 0.24
Nodes (12): CreateScheduleModalProps, earlierPeriodTotals(), shiftIsoDate(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays() (+4 more)

### Community 72 - "WarningsSheet.tsx"
Cohesion: 0.27
Nodes (9): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding (+1 more)

### Community 73 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 74 - "repository/index.ts"
Cohesion: 0.38
Nodes (5): DatabaseTab(), DatabaseTabProps, defaultFirebaseConfig, StorageMode, getDatabaseStatistics()

### Community 75 - "formatDate"
Cohesion: 0.24
Nodes (12): EditDoctorShiftModal(), TIME_PRESETS, CoverageSheet(), DoctorsScheduleSheet(), WEEKDAY_ABBR, HolidayDayOffPicker(), HolidayDayOffPickerProps, deleteDoctorShift() (+4 more)

### Community 77 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 78 - "hoursRules.test.ts"
Cohesion: 0.10
Nodes (15): SchedulingEngine, D, E, L, NC, PHL, SENIOR, week (+7 more)

### Community 79 - "hoursPolicy.ts"
Cohesion: 0.31
Nodes (9): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange() (+1 more)

### Community 80 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 82 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.09
Nodes (25): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+17 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (27): isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus, DoctorSessionSource (+19 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "Phases"
Cohesion: 0.11
Nodes (18): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+10 more)

### Community 87 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.10
Nodes (6): context, publishNovember(), Single(), start(), user, react-dom

### Community 94 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (10): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps (+2 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 97 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 98 - "lastResort.test.ts"
Cohesion: 0.13
Nodes (10): ScheduleValidator, DR_PEDS, ENT, FULL, PEDS, RULES, EARLY, LATE (+2 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 104 - "SchedulesView.tsx"
Cohesion: 0.16
Nodes (17): MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), VersionCompareModal(), readStoredScheduleId(), SchedulesView(), SchedulesViewProps (+9 more)

### Community 112 - "assignmentChecks.ts"
Cohesion: 0.12
Nodes (24): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse(), nurseClinicRoleOf() (+16 more)

## Knowledge Gaps
- **761 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+756 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 929 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `nurseRosterService.ts`, `authService.ts`, `confirmDialog`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `makeNurse`, `SettingsView.tsx`, `WorkbookGrid.tsx`, `dialogs.tsx`, `EmailTab.tsx`, `RulesTab.tsx`, `getRepository`, `CreateScheduleModal.tsx`, `WarningsSheet.tsx`, `usePresence.ts`, `repository/index.ts`, `formatDate`, `NSC Clinic Roster: complete project guide`, `harness/main.tsx`, `WhoCanCover.tsx`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `nurseRosterService.ts`, `authService.ts`, `confirmDialog`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `SettingsView.tsx`, `WorkbookGrid.tsx`, `dialogs.tsx`, `EmailTab.tsx`, `RulesTab.tsx`, `getRepository`, `CreateScheduleModal.tsx`, `WarningsSheet.tsx`, `repository/index.ts`, `formatDate`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `nurseRosterService.ts`, `authService.ts`, `getRepository`, `CreateScheduleModal.tsx`, `SchedulesView.tsx`, `usePresence.ts`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `EmailTab.tsx`, `DashboardView.tsx`, `react`, `SettingsView.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _761 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.051158119389868806 - nodes in this community are weakly interconnected._
- **Should `ScheduleValidator.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13949579831932774 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._