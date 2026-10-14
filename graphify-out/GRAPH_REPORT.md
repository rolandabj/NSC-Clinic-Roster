# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 370 files · ~408,242 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2756 nodes · 8925 edges · 145 communities (129 shown, 16 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 393 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `51fc5fae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- fixtures.ts
- hoursBalance.ts
- clinicModel.test.ts
- authService
- holidayLeave.ts
- react
- FairnessModal.tsx
- ui-audit.cjs
- package.json
- RosterSheetTabs.tsx
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
- App.tsx
- apiApp.ts
- devDependencies
- RosterToolbar.tsx
- quick reference
- decisionEmail.test.ts
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- ClinicContextState
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- ValidationReport
- NurseSelfServicePanel.tsx
- useDialogA11y
- Optimization Patterns
- ref_node_assert
- checkScheduler.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- engineRules.test.ts
- firestore-rules/package.json
- staffRequestService.ts
- continuousHours.test.ts
- editSaving.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- sharing.test.ts
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
- publicRosterService.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- NursesView.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- MyRosterView.tsx
- teamRoster.test.ts
- access.ts
- analysisExportService.ts
- links.cjs
- icsExportService.ts
- types/index.ts
- makeNurse
- AllRequestsPanel.tsx
- grid-keys.cjs
- UI overhaul: summary and next steps
- createApiApp
- Button
- DashboardView.tsx
- Phases
- harness/main.tsx
- Handover for a new chat
- nurseRosterService.ts
- Finish a change
- Rules
- handMoves.test.ts
- SchedulesView.tsx
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- SchedulingEngine
- start.sh
- stop.sh
- Rules
- grid-flow.cjs
- LiveCollectionCache
- WorkbookGrid.tsx
- EmailTab.tsx
- IRepository.ts
- RosterGrid
- NSC Clinic Roster: complete project guide
- Sidebar.tsx
- quotaTracker
- RosterSteps.tsx
- Field.tsx
- ClinicRoster
- 16. History of work (for context)
- emailLogSize.ts
- assignmentChecks.ts
- doctorWeekChange.test.ts
- savingSafety.test.ts
- newRosterDates.ts
- rowsInSteps.ts
- grid-timing.cjs
- GridTable.tsx
- fakeAuth.ts
- decisionEmail.ts
- ref_playwright
- nurse-editor.cjs
- ui/index.ts
- sheet-tabs.cjs
- explainCell.test.ts
- hoursDecisions.test.ts
- usePhoneLayout.ts
- weekend.ts
- plain-english-reviewer.md
- PublishedRosterView
- doctors.cjs
- nurse-page.cjs
- nurses-list.cjs
- public-pages.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 117 edges
2. `Assignment` - 113 edges
3. `Nurse` - 98 edges
4. `getRepository()` - 95 edges
5. `16. History of work (for context)` - 95 edges
6. `Schedule` - 92 edges
7. `lucide-react` - 89 edges
8. `DutyWindow` - 89 edges
9. `Doctor` - 79 edges
10. `formatDate()` - 76 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (145 total, 16 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (66): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, ExportTab, WEEKDAY_NAMES, FairnessModalProps, NurseTimesheetModalProps (+58 more)

### Community 1 - "fixtures.ts"
Cohesion: 0.11
Nodes (22): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+14 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.08
Nodes (49): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+41 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.08
Nodes (24): Steps, planner(), history(), D, DOCTORS, DR_X, DUTIES, E (+16 more)

### Community 4 - "authService"
Cohesion: 0.15
Nodes (3): authService, computePrivileges(), getAppAuth()

### Community 5 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 6 - "react"
Cohesion: 0.10
Nodes (57): lucide-react, react, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice() (+49 more)

### Community 7 - "FairnessModal.tsx"
Cohesion: 0.18
Nodes (20): uuid, FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap, NONE, SwapManagerModal(), listProblem() (+12 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "RosterSheetTabs.tsx"
Cohesion: 0.43
Nodes (4): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), render()

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
Cohesion: 0.09
Nodes (23): saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+15 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.12
Nodes (9): 11. Saving, live updates, versions, saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, rebaseEdit() (+1 more)

### Community 16 - "authService.ts"
Cohesion: 0.18
Nodes (14): LoginPageProps, signOutSafely(), AppShellProps, AccountMenu(), TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+6 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.18
Nodes (18): useAppContext(), DatabaseTab(), DatabaseTabProps, ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.14
Nodes (21): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+13 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.14
Nodes (21): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+13 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (12): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+4 more)

### Community 23 - "apiApp.ts"
Cohesion: 0.11
Nodes (17): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, Request (+9 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.14
Nodes (16): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+8 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.11
Nodes (21): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail() (+13 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (44): 6. Clinic model (the business rules in plain English), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+36 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "ClinicContextState"
Cohesion: 0.11
Nodes (22): AppContext, AppContextValue, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+14 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "ValidationReport"
Cohesion: 0.27
Nodes (9): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding (+1 more)

### Community 38 - "NurseSelfServicePanel.tsx"
Cohesion: 0.14
Nodes (27): DateInput(), Field(), Select(), Textarea(), Notice(), NurseSelfServicePanel(), STATUS, useFocusFirstError() (+19 more)

### Community 39 - "useDialogA11y"
Cohesion: 0.08
Nodes (49): EmailHtmlPreview(), useDialogA11y(), usePermissions(), DeleteScheduleModal(), DeleteVersionModal(), DeleteVersionModalProps, fmtHours(), NurseTimesheetModal() (+41 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "ref_node_assert"
Cohesion: 0.10
Nodes (13): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+5 more)

### Community 42 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "FirestoreRepository"
Cohesion: 0.28
Nodes (3): FirestoreRepository, sanitizePayload(), toScheduleRange()

### Community 46 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "staffRequestService.ts"
Cohesion: 0.26
Nodes (18): 13. Screens in detail, AllRequestsPanel(), ApprovalsQueuePanel(), AvailabilityView(), canApproveRequests(), countPendingApprovals(), dayOffLockId(), decideRequest() (+10 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 50 - "editSaving.test.ts"
Cohesion: 0.13
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.11
Nodes (30): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+22 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

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

### Community 68 - "publicRosterService.ts"
Cohesion: 0.27
Nodes (10): ShareModal(), ShareModalProps, TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, syncPublicRoster() (+2 more)

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

### Community 73 - "NursesView.tsx"
Cohesion: 0.15
Nodes (13): isPairing(), PREFERENCE_FOCUS_LABELS, checkNurseForm(), movePreference(), NurseFormErrors, NurseFormValues, filterNurses(), nurseCounts() (+5 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "MyRosterView.tsx"
Cohesion: 0.33
Nodes (6): LoadState, MyRosterViewProps, MyDay, myShiftDays(), NurseRosterDoc, NurseRosterShift

### Community 78 - "teamRoster.test.ts"
Cohesion: 0.21
Nodes (12): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), addDaysIso(), buildTeamRosterSheet(), syncNurseRosters(), safeColor(), nurses (+4 more)

### Community 79 - "access.ts"
Cohesion: 0.36
Nodes (8): 3. Users, roles and access, 4. Navigation and app shell, canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor(), roleLabel(), VIEWER_ROUTES

### Community 80 - "analysisExportService.ts"
Cohesion: 0.06
Nodes (55): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, jspdf, jspdf-autotable, xlsx, ExportModal(), fmtHours() (+47 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (35): CreateScheduleModal(), CreateScheduleModalProps, ClinicTabProps, WorkingHoursPeriodsPanel(), CellChoice, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod() (+27 more)

### Community 84 - "makeNurse"
Cohesion: 0.08
Nodes (32): ctx(), EARLY, LATE, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), account() (+24 more)

### Community 85 - "AllRequestsPanel.tsx"
Cohesion: 0.20
Nodes (9): AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 89 - "Button"
Cohesion: 0.29
Nodes (7): PublicMessage(), PublicPageFrame(), LocalModeBanner(), LocalModeBannerProps, Button(), AcknowledgePage(), AcknowledgePageProps

### Community 90 - "DashboardView.tsx"
Cohesion: 0.21
Nodes (19): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+11 more)

### Community 91 - "Phases"
Cohesion: 0.25
Nodes (8): Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, and request decision emails, Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit, Phases

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 94 - "nurseRosterService.ts"
Cohesion: 0.19
Nodes (16): MyRosterView(), BuildNurseRosterInput, dayMonth(), formatRosterAsText(), NURSE_ROSTER_LOOKBACK_DAYS, nurseCalendarUrl(), nurseWebcalUrl(), origin() (+8 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.11
Nodes (14): AGREED_EXCEPTION_NOTE, AMY, BEA, CARA, DAN, DOCTORS, DUTIES, EARLY (+6 more)

### Community 98 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (30): useLatestCallback(), EditDoctorShiftModal(), TIME_PRESETS, FillDialog(), FillDialogProps, FillRange, RosterPicker(), RosterPickerProps (+22 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.13
Nodes (28): BulkImportModal(), DoctorWeekChangeDialog(), WeekChangePreview, DoctorsView(), byDayAndTime(), checkDoctorForm(), doctorCounts(), DoctorFilters (+20 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "SchedulingEngine"
Cohesion: 0.11
Nodes (11): FLOAT_ROLE_ID, SchedulingEngine, LATE, run(), CARD, EARLY, FULL, LATE (+3 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 110 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (54): DayProblem, DayRow, dayViewOf(), isPhoneSize(), KIND, ORDER, CellContextMenu(), CellEditorDialog() (+46 more)

### Community 111 - "EmailTab.tsx"
Cohesion: 0.16
Nodes (17): nodemailer, EmailTab(), EmailTabProps, SaveStatus, authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse() (+9 more)

### Community 112 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.22
Nodes (8): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, WalkthroughModal(), WalkthroughModalProps

### Community 115 - "Sidebar.tsx"
Cohesion: 0.42
Nodes (6): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, AppRoute

### Community 116 - "quotaTracker"
Cohesion: 0.13
Nodes (9): defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener (+1 more)

### Community 117 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 118 - "Field.tsx"
Cohesion: 0.22
Nodes (8): Checkbox(), FieldInputProps, Input(), inputClass, InputProps, SelectProps, TextareaProps, parseDayMonthYear()

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "16. History of work (for context)"
Cohesion: 0.28
Nodes (12): 16. History of work (for context), EmptyState(), ErrorState(), LoadingState(), addDays(), DateRange, defaultPatternRange(), defaultSessionDate() (+4 more)

### Community 121 - "emailLogSize.ts"
Cohesion: 0.33
Nodes (6): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, EmailRecipientLog

### Community 122 - "assignmentChecks.ts"
Cohesion: 0.08
Nodes (40): Other engine files, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef (+32 more)

### Community 123 - "doctorWeekChange.test.ts"
Cohesion: 0.10
Nodes (15): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, SENIOR (+7 more)

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (13): clearYearToDateCache(), forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS (+5 more)

### Community 125 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 126 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "GridTable.tsx"
Cohesion: 0.06
Nodes (50): firstDayShown(), RosterDayView(), CellView, DayTotal, dayTotalsOf(), dayTotalWords(), problemWords(), FOCUS_CELL (+42 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 130 - "decisionEmail.ts"
Cohesion: 0.39
Nodes (7): DecidedRequest, decisionEmail(), DecisionEmailInput, oneLine(), what(), when(), escapeHtml()

### Community 131 - "ref_playwright"
Cohesion: 0.17
Nodes (8): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.11
Nodes (37): TopBar(), Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemCounts(), ProblemKind, Tone, TONE_CLASSES (+29 more)

### Community 135 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 136 - "hoursDecisions.test.ts"
Cohesion: 0.33
Nodes (3): LONG, NOV, OCT

### Community 137 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 138 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 139 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 140 - "PublishedRosterView"
Cohesion: 0.67
Nodes (4): PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), loadPublicRoster()

## Knowledge Gaps
- **941 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+936 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1149 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `GridTable.tsx`, `hoursBalance.ts`, `ui/index.ts`, `FairnessModal.tsx`, `package.json`, `RosterSheetTabs.tsx`, `usePhoneLayout.ts`, `authService.ts`, `seedRunner.ts`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `ClinicContextState`, `ValidationReport`, `NurseSelfServicePanel.tsx`, `useDialogA11y`, `AppShell.tsx`, `publicRosterService.ts`, `NursesView.tsx`, `MyRosterView.tsx`, `teamRoster.test.ts`, `types/index.ts`, `makeNurse`, `AllRequestsPanel.tsx`, `Button`, `DashboardView.tsx`, `harness/main.tsx`, `SchedulesView.tsx`, `DoctorsView.tsx`, `WorkbookGrid.tsx`, `EmailTab.tsx`, `NSC Clinic Roster: complete project guide`, `Sidebar.tsx`, `RosterSteps.tsx`, `Field.tsx`, `16. History of work (for context)`, `assignmentChecks.ts`, `rowsInSteps.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `GridTable.tsx`, `ui/index.ts`, `FairnessModal.tsx`, `package.json`, `RosterSheetTabs.tsx`, `authService.ts`, `seedRunner.ts`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `ValidationReport`, `NurseSelfServicePanel.tsx`, `useDialogA11y`, `AppShell.tsx`, `publicRosterService.ts`, `NursesView.tsx`, `MyRosterView.tsx`, `teamRoster.test.ts`, `types/index.ts`, `AllRequestsPanel.tsx`, `Button`, `DashboardView.tsx`, `harness/main.tsx`, `SchedulesView.tsx`, `DoctorsView.tsx`, `WorkbookGrid.tsx`, `EmailTab.tsx`, `Sidebar.tsx`, `RosterSteps.tsx`, `Field.tsx`, `16. History of work (for context)`, `assignmentChecks.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `GridTable.tsx`, `Assignment`, `ui/index.ts`, `react`, `usePhoneLayout.ts`, `RosterSheetTabs.tsx`, `IRepository`, `firebaseIdentityService.ts`, `RosterToolbar.tsx`, `SchedulingEngine.ts`, `ClinicContextState`, `NurseSelfServicePanel.tsx`, `useDialogA11y`, `checkScheduler.test.ts`, `FirestoreRepository`, `staffRequestService.ts`, `editSaving.test.ts`, `AppShell.tsx`, `NursesView.tsx`, `Design system: NSC Clinic Roster`, `MyRosterView.tsx`, `access.ts`, `types/index.ts`, `Button`, `nurseRosterService.ts`, `SchedulesView.tsx`, `DoctorsView.tsx`, `WorkbookGrid.tsx`, `RosterGrid`, `NSC Clinic Roster: complete project guide`, `RosterSteps.tsx`, `Field.tsx`, `rowsInSteps.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 94 inferred relationships involving `16. History of work (for context)` (e.g. with `GridCell()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 94 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _941 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.14462025316455696 - nodes in this community are weakly interconnected._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1053763440860215 - nodes in this community are weakly interconnected._