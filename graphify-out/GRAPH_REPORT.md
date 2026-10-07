# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 263 files · ~320,889 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 3, (none) 3, .example 1)

## Summary
- 2117 nodes · 6756 edges · 106 communities (95 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 215 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bab09729`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- ExportModal.tsx
- hoursBalance.ts
- clinicModel.test.ts
- PublishedRosterView.tsx
- authService.ts
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
- DashboardView.tsx
- fixtures.ts
- firebaseIdentityService.ts
- PublishModal.tsx
- compilerOptions
- RulesTab.tsx
- seedRunner.ts
- FirestoreRepository
- devDependencies
- emailService.ts
- yearToDate.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- preferenceFocus.test.ts
- dateFormatter.ts
- Hardening Controls
- dialogs.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- SchedulesView.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- makeNurse
- 17. Known quirks and ideas for later
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- quotaTracker
- EmailTab.tsx
- published-rules.mjs
- SchedulingEngine.ts
- QuickCellPopup.tsx
- savingSafety.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
- Incremental Implementation
- I18nManager
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
- hoursRules.test.ts
- Source-Driven Development
- doctorWeekChange.test.ts
- react
- Sidebar.tsx
- ref_node_assert
- nurseRosterService.ts
- README.md
- MyRosterView.tsx
- lastResort.test.ts
- WorkingHoursPeriodsPanel.tsx
- FirestoreRepository.ts
- ClinicRoster
- doctorScheduleService.ts
- types/index.ts
- engineRules.test.ts
- Phases
- newRosterDates.ts
- holidayLeave.ts
- middleware/auth.ts
- continuousHours.test.ts
- geminiClient.ts
- UI overhaul: checklist
- harness/main.tsx
- WarningsSheet.tsx
- createLiveReconciler
- Finish a change
- WhoCanCover.tsx
- yearSeed.ts
- versionRestore.test.ts
- context7
- repositoryManager
- firestore-rules-reviewer.md
- plain-english-reviewer.md
- firebase-mcp.sh
- start.sh
- stop.sh

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 85 edges
4. `Nurse` - 82 edges
5. `DutyWindow` - 81 edges
6. `react` - 75 edges
7. `Doctor` - 70 edges
8. `useDialogA11y()` - 68 edges
9. `lucide-react` - 63 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `Phase 3: roster grid speed and structure` --references--> `CollectionSyncer`  [INFERRED]
  tasks/plan.md → src/services/repository/collectionSyncer.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx

## Import Cycles
- None detected.

## Communities (106 total, 11 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (65): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+57 more)

### Community 1 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (44): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, VersionViewModal() (+36 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.08
Nodes (44): fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField, TabMode (+36 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishedRosterView.tsx"
Cohesion: 0.11
Nodes (25): RFC-5545, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, buildNurseIcs(), buildNurseRosterIcs(), downloadIcsFile(), escapeIcsText() (+17 more)

### Community 5 - "authService.ts"
Cohesion: 0.12
Nodes (23): LoginPageProps, signOutSafely(), AppShellProps, TopBarProps, AuthModal(), AuthModalProps, AllRequestsPanelProps, ApprovalsQueuePanelProps (+15 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (45): confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTab(), DatabaseTabProps (+37 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

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
Cohesion: 0.09
Nodes (47): 0. Quick start for a new chat, 13. Screens in detail, 14. Server, security and config, 16. History of work (for context), 1. Features at a glance, 2. Repository layout, 3. Users, roles and access, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+39 more)

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (13): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+5 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.14
Nodes (3): 11. Saving, live updates, versions, CollectionSyncer, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.22
Nodes (15): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+7 more)

### Community 17 - "fixtures.ts"
Cohesion: 0.08
Nodes (27): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+19 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "PublishModal.tsx"
Cohesion: 0.15
Nodes (20): Request, EmailHtmlPreview(), Step, CHANGE_LABELS, PublishTab, AssignmentDiffItem, ChangeType, computeScheduleDiff() (+12 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.07
Nodes (41): 7. Rules, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FairnessModal(), ALWAYS_ON, effectiveValue() (+33 more)

### Community 22 - "seedRunner.ts"
Cohesion: 0.18
Nodes (13): toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults() (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.16
Nodes (15): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+7 more)

### Community 26 - "yearToDate.ts"
Cohesion: 0.17
Nodes (17): isLateDuty(), clearYearToDateCache(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster (+9 more)

### Community 27 - "IRepository"
Cohesion: 0.19
Nodes (12): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removePublicRoster(), fingerprint(), syncScheduleAssignments(), IRepository, deleteEntireSchedule() (+4 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.14
Nodes (25): CellChoice, cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso(), SOURCE_WORDS, WEEKDAY_ABBR, withDr() (+17 more)

### Community 30 - "preferenceFocus.test.ts"
Cohesion: 0.18
Nodes (11): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus, CARD, KHAN, LATE (+3 more)

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
Cohesion: 0.09
Nodes (18): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+10 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.14
Nodes (25): MenuButton(), MenuButtonProps, MenuItem, DeleteScheduleModal(), SwapManagerModal(), VersionCompareModal(), readStoredScheduleId(), SchedulesView() (+17 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "makeNurse"
Cohesion: 0.13
Nodes (19): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+11 more)

### Community 42 - "17. Known quirks and ideas for later"
Cohesion: 0.50
Nodes (3): 17. Known quirks and ideas for later, WalkthroughModal(), WalkthroughModalProps

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "EmailTab.tsx"
Cohesion: 0.16
Nodes (16): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+8 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (55): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup (+47 more)

### Community 49 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.12
Nodes (13): forgetCachedRoster(), Desired, fingerprint(), Known, planSync(), SyncPlan, afterShiftsSaved(), queuesByRepo (+5 more)

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

### Community 68 - "ShareModal.tsx"
Cohesion: 0.19
Nodes (16): PublishModal(), ShareModal(), TabType, PublishView(), ensureNurseLink(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+8 more)

### Community 69 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "doctorWeekChange.test.ts"
Cohesion: 0.17
Nodes (10): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+2 more)

### Community 72 - "react"
Cohesion: 0.13
Nodes (28): 6. Clinic model (the business rules in plain English), lucide-react, react, openStack, useDialogA11y(), BulkImportModal(), CreateScheduleModal(), CreateScheduleModalProps (+20 more)

### Community 73 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (13): NAV_ITEMS, SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, DICTIONARY, i18n (+5 more)

### Community 74 - "ref_node_assert"
Cohesion: 0.10
Nodes (10): ctx(), EARLY, LATE, diff(), LATE, nurse, DAY_DUTY, emptyProps (+2 more)

### Community 75 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (24): loadViewerData(), addDaysIso(), buildNurseRosterDoc(), BuildNurseRosterInput, buildTeamRosterSheet(), latestPublishedVersions(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS (+16 more)

### Community 77 - "MyRosterView.tsx"
Cohesion: 0.19
Nodes (17): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView() (+9 more)

### Community 78 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 79 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.23
Nodes (13): WorkingHoursPeriodsPanel(), WorkingHoursPeriodsPanelProps, earlierPeriodTotals(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays() (+5 more)

### Community 80 - "FirestoreRepository.ts"
Cohesion: 0.15
Nodes (16): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+8 more)

### Community 81 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 82 - "doctorScheduleService.ts"
Cohesion: 0.18
Nodes (15): EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), DeleteDoctorShiftParams, getWeekdayFromIsoDate(), PatternSessionPlan (+7 more)

### Community 83 - "types/index.ts"
Cohesion: 0.08
Nodes (28): uuid, AccessManagementPanelProps, InternalSlot, othersOnRoster(), STALE_MS, TAB_ID, usePresence(), ApprovalStatus (+20 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "Phases"
Cohesion: 0.11
Nodes (18): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+10 more)

### Community 86 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 87 - "holidayLeave.ts"
Cohesion: 0.24
Nodes (14): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday() (+6 more)

### Community 88 - "middleware/auth.ts"
Cohesion: 0.11
Nodes (20): repoRoot, swaps, express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react (+12 more)

### Community 89 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 90 - "geminiClient.ts"
Cohesion: 0.29
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.10
Nodes (6): context, publishNovember(), Single(), start(), user, react-dom

### Community 93 - "WarningsSheet.tsx"
Cohesion: 0.27
Nodes (9): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding (+1 more)

### Community 94 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 97 - "yearSeed.ts"
Cohesion: 0.33
Nodes (6): YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 98 - "versionRestore.test.ts"
Cohesion: 0.29
Nodes (4): BACKUPS_KEPT, october, octoberVersion, september

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **762 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+757 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 930 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `ExportModal.tsx`, `hoursBalance.ts`, `PublishedRosterView.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `PublishModal.tsx`, `RulesTab.tsx`, `WorkbookGrid.tsx`, `dialogs.tsx`, `SchedulesView.tsx`, `17. Known quirks and ideas for later`, `EmailTab.tsx`, `QuickCellPopup.tsx`, `ShareModal.tsx`, `Sidebar.tsx`, `ref_node_assert`, `MyRosterView.tsx`, `WorkingHoursPeriodsPanel.tsx`, `doctorScheduleService.ts`, `types/index.ts`, `harness/main.tsx`, `WarningsSheet.tsx`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `ExportModal.tsx`, `hoursBalance.ts`, `PublishedRosterView.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `PublishModal.tsx`, `RulesTab.tsx`, `WorkbookGrid.tsx`, `dialogs.tsx`, `SchedulesView.tsx`, `EmailTab.tsx`, `QuickCellPopup.tsx`, `ShareModal.tsx`, `Sidebar.tsx`, `MyRosterView.tsx`, `WorkingHoursPeriodsPanel.tsx`, `doctorScheduleService.ts`, `types/index.ts`, `WarningsSheet.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `MemoryRepo`, `ShareModal.tsx`, `authService.ts`, `PublishedRosterView.tsx`, `SchedulesView.tsx`, `react`, `Sidebar.tsx`, `AppShell.tsx`, `getRepository`, `AvailabilityView.tsx`, `App.tsx`, `EmailTab.tsx`, `DashboardView.tsx`, `types/index.ts`, `PublishModal.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _762 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.13986013986013987 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07616892911010557 - nodes in this community are weakly interconnected._