# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 357 files · ~394,890 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2680 nodes · 8678 edges · 141 communities (131 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 383 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0beaf48d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- emailService.ts
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- handMoveChecks.ts
- getRepository
- authService
- ui-audit.cjs
- package.json
- ClinicContextState
- dependencies
- Test-Driven Development
- gridSelection.ts
- savingSafety.test.ts
- CollectionSyncer
- NurseSelfServicePanel.tsx
- nurseClinicFloat.test.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- middleware/auth.ts
- devDependencies
- RosterToolbar.tsx
- quick reference
- dayView.ts
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- react
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- fixtures.ts
- ref_node_assert
- PublishModal.tsx
- Optimization Patterns
- makeNurse
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- quotaTracker
- ReportsView.tsx
- firestore-rules/package.json
- AvailabilityView.tsx
- explainCell.ts
- SeniorityLevel
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- seedRunner.ts
- Incremental Implementation
- handMoves.test.ts
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
- WorkbookGrid.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- guide-with-code.mjs
- apiApp.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- grid-keys.cjs
- analysisExportService.ts
- links.cjs
- icsExportService.ts
- types/index.ts
- makeSchedule
- TopBar.tsx
- ref_playwright
- UI overhaul: summary and next steps
- weekHours.test.ts
- HistoryView.tsx
- geminiApi.test.ts
- Phases
- harness/main.tsx
- published-rules.mjs
- MyRosterView.tsx
- Finish a change
- Rules
- RulesTab.tsx
- lucide-react
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- DashboardView.tsx
- start.sh
- stop.sh
- Rules
- 16. History of work (for context)
- FirestoreRepository
- AppShell.tsx
- sharing.test.ts
- IRepository
- RosterGrid
- cellView.test.ts
- dateDefaults.ts
- authService.ts
- Button
- PublishModal
- holidayLeave.ts
- access.ts
- NSC Clinic Roster: complete project guide
- PublishedRosterView.tsx
- analysisExport.test.ts
- AppContext.tsx
- dialogs.tsx
- scheduleTransactions.test.ts
- grid-timing.cjs
- preferenceOrder.ts
- fakeAuth.ts
- PublishedRosterSheet.tsx
- my-requests.cjs
- RosterSteps.tsx
- ui/index.ts
- EmailTab.tsx
- authorizedFetch
- address.ts
- ShareModal.tsx
- usePhoneLayout.ts
- plain-english-reviewer.md
- nurse-page.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 117 edges
2. `Assignment` - 113 edges
3. `Nurse` - 96 edges
4. `getRepository()` - 95 edges
5. `Schedule` - 92 edges
6. `lucide-react` - 89 edges
7. `DutyWindow` - 89 edges
8. `16. History of work (for context)` - 89 edges
9. `Doctor` - 78 edges
10. `useDialogA11y()` - 76 edges

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

## Communities (141 total, 10 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.15
Nodes (66): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+58 more)

### Community 1 - "emailService.ts"
Cohesion: 0.16
Nodes (15): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+7 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.09
Nodes (35): askedCarry(), closePeriod(), earlierPeriodTotals(), hoursCheckpoints(), HoursPart, HoursSchedule, Leftover, MAX_CARRY_PERIODS (+27 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (22): loadViewerData(), addDaysIso(), buildNurseRosterDoc(), buildTeamRosterSheet(), dayMonth(), latestPublishedVersions(), NURSE_ROSTER_LOOKBACK_DAYS, nurseLinkUrl() (+14 more)

### Community 5 - "handMoveChecks.ts"
Cohesion: 0.38
Nodes (11): Other engine files, FairnessModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields() (+3 more)

### Community 6 - "getRepository"
Cohesion: 0.14
Nodes (42): useAppContext(), confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), DatabaseTab(), DatabaseTabProps, DutiesTab() (+34 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "ClinicContextState"
Cohesion: 0.11
Nodes (22): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, TopBarProps, AuditTrailViewProps, AvailabilityViewProps (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "gridSelection.ts"
Cohesion: 0.08
Nodes (17): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelection, GridSelectionState, isRosterCell(), keyOf() (+9 more)

### Community 14 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (7): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 15 - "CollectionSyncer"
Cohesion: 0.09
Nodes (16): 11. Saving, live updates, versions, useRosterEdits(), forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+8 more)

### Community 16 - "NurseSelfServicePanel.tsx"
Cohesion: 0.17
Nodes (22): Dialog(), DateInput(), Field(), Select(), Textarea(), NurseSelfServicePanel(), STATUS, useFocusFirstError() (+14 more)

### Community 17 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (22): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+14 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (12): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+4 more)

### Community 23 - "middleware/auth.ts"
Cohesion: 0.21
Nodes (7): express, AuthUser, BackendRole, Express, requireOwner, ROLE_HIERARCHY, authRouter

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.14
Nodes (17): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+9 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "dayView.ts"
Cohesion: 0.17
Nodes (15): DayProblem, DayRow, dayViewOf(), KIND, ORDER, cellSummary(), isDayProblem(), requestOn() (+7 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (55): 6. Clinic model (the business rules in plain English), RuleDef, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+47 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "react"
Cohesion: 0.11
Nodes (27): react, uuid, NoticeTone, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps (+19 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.15
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.11
Nodes (18): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), UNPAID_LEAVE, LONG, NOV, OCT, D (+10 more)

### Community 38 - "ref_node_assert"
Cohesion: 0.12
Nodes (10): isPhoneSize(), ctx(), EARLY, LATE, amy, LEE, lookups, mary (+2 more)

### Community 39 - "PublishModal.tsx"
Cohesion: 0.15
Nodes (18): Request, EmailHtmlPreview(), Step, PublishTab, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog() (+10 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "makeNurse"
Cohesion: 0.10
Nodes (15): EARLY, input(), LATE, softHoursLimit, week, makeNurse(), SENIOR, account() (+7 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 46 - "ReportsView.tsx"
Cohesion: 0.16
Nodes (21): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, CHANGE_LABELS, VersionCompareModal() (+13 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (30): 13. Screens in detail, useLatestCallback(), AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+22 more)

### Community 49 - "explainCell.ts"
Cohesion: 0.16
Nodes (20): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+12 more)

### Community 50 - "SeniorityLevel"
Cohesion: 0.14
Nodes (29): CoverageSheet(), CoverageSheetProps, CellView, SOURCE_SPOKEN, SOURCE_WORDS, DayTotal, dayTotalWords(), problemWords() (+21 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "seedRunner.ts"
Cohesion: 0.11
Nodes (25): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+17 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

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

### Community 68 - "WorkbookGrid.tsx"
Cohesion: 0.08
Nodes (42): CellContextMenu(), CellEditorDialog(), withDr(), cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView() (+34 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.17
Nodes (11): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+3 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+4 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 80 - "analysisExportService.ts"
Cohesion: 0.07
Nodes (59): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+51 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.13
Nodes (22): RFC-5545, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText() (+14 more)

### Community 83 - "types/index.ts"
Cohesion: 0.08
Nodes (26): CellChoice, CellEditorDialogProps, DayColumn, ApprovalStatus, AssignmentKind, AuditAction, AuditEvent, DoctorSessionSource (+18 more)

### Community 84 - "makeSchedule"
Cohesion: 0.09
Nodes (22): SchedulingEngine, hoursOnlyRules(), makeSchedule(), LATE, run(), setup(), CARD, doctorOfAmy() (+14 more)

### Community 85 - "TopBar.tsx"
Cohesion: 0.27
Nodes (8): AccountMenu(), TopBar(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), IconButton(), render()

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "weekHours.test.ts"
Cohesion: 0.09
Nodes (15): CANONICAL_RULES_SPEC, ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS (+7 more)

### Community 89 - "HistoryView.tsx"
Cohesion: 0.13
Nodes (16): ShareModalProps, SOURCE_LABELS, WEEKDAY_NAMES, WEEKDAY_NAMES, AssignmentDiffItem, ChangeType, computeScheduleDiff(), formatAssignment() (+8 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "Phases"
Cohesion: 0.22
Nodes (9): Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, and request decision emails, Phase 6: Nurses, Doctors, Availability and Requests (planner screens), Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit (+1 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 94 - "MyRosterView.tsx"
Cohesion: 0.19
Nodes (15): RosterDayView(), Notice(), LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), formatRosterAsText() (+7 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "RulesTab.tsx"
Cohesion: 0.18
Nodes (15): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup, RulesTab() (+7 more)

### Community 98 - "lucide-react"
Cohesion: 0.09
Nodes (30): lucide-react, EditDoctorShiftModal(), TIME_PRESETS, SwapManagerModal(), FillDialog(), RosterPicker(), RosterPickerProps, readStoredScheduleId() (+22 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.15
Nodes (20): CreateScheduleModal(), CreateScheduleModalProps, doctorFromDate(), generateDoctorSessionsForDateRange(), missingPatternSessions(), nextDay(), PatternSessionPlan, planPatternSessions() (+12 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "DashboardView.tsx"
Cohesion: 0.19
Nodes (15): Card(), DashboardView(), loadPlannerData(), PlannerData, readStoredId(), TodayList(), ViewerData, addDays() (+7 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "16. History of work (for context)"
Cohesion: 0.16
Nodes (12): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), ConfirmBox(), DialogHost(), firstDayShown(), useRosterChecks(), wholeDates(), ProblemMark (+4 more)

### Community 109 - "FirestoreRepository"
Cohesion: 0.17
Nodes (5): FirestoreRepository, sanitizePayload(), LiveCollectionCache, entry, matchesFilter()

### Community 110 - "AppShell.tsx"
Cohesion: 0.22
Nodes (18): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+10 more)

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.10
Nodes (21): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments(), repositoryManager (+13 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 115 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 116 - "authService.ts"
Cohesion: 0.24
Nodes (11): LoginPageProps, signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, MASTER_ADMIN_EMAIL, UserPrivileges (+3 more)

### Community 117 - "Button"
Cohesion: 0.17
Nodes (13): LocalModeBanner(), LocalModeBannerProps, Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES (+5 more)

### Community 118 - "PublishModal"
Cohesion: 0.18
Nodes (14): PublishModal(), PublishView(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), ensureNurseLink(), newToken(), regenerateNurseLink() (+6 more)

### Community 119 - "holidayLeave.ts"
Cohesion: 0.30
Nodes (11): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+3 more)

### Community 120 - "access.ts"
Cohesion: 0.32
Nodes (8): 3. Users, roles and access, 4. Navigation and app shell, canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor(), roleLabel(), VIEWER_ROUTES

### Community 121 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 122 - "PublishedRosterView.tsx"
Cohesion: 0.33
Nodes (9): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+1 more)

### Community 123 - "analysisExport.test.ts"
Cohesion: 0.22
Nodes (10): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+2 more)

### Community 124 - "AppContext.tsx"
Cohesion: 0.27
Nodes (8): AppContext, AppContextValue, Permissions, ProblemCount, problemCountWords(), ProblemTally, frame, november

### Community 125 - "dialogs.tsx"
Cohesion: 0.24
Nodes (10): ConfirmOptions, DialogState, dismissNotice(), listeners, Notice, PendingConfirm, setState(), settleConfirm() (+2 more)

### Community 126 - "scheduleTransactions.test.ts"
Cohesion: 0.20
Nodes (8): nurse(), Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), nurses()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "preferenceOrder.ts"
Cohesion: 0.22
Nodes (9): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, GenerationResult, NursePreference (+1 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 130 - "PublishedRosterSheet.tsx"
Cohesion: 0.39
Nodes (6): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), TeamRosterSheet, escapeHtml(), safeColor()

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 133 - "ui/index.ts"
Cohesion: 0.12
Nodes (32): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Card(), Crumb (+24 more)

### Community 134 - "EmailTab.tsx"
Cohesion: 0.33
Nodes (7): ClinicTab(), ClinicTabProps, EmailTabProps, SaveStatus, WEEKDAY_NAMES, ClinicProfile, getWeekendDays()

### Community 135 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 136 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 137 - "ShareModal.tsx"
Cohesion: 0.52
Nodes (6): ShareModal(), TabType, ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster()

### Community 138 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 139 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **919 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+914 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1120 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `PublishedRosterSheet.tsx`, `RosterSteps.tsx`, `ui/index.ts`, `EmailTab.tsx`, `getRepository`, `package.json`, `ClinicContextState`, `ShareModal.tsx`, `usePhoneLayout.ts`, `gridSelection.ts`, `NurseSelfServicePanel.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `fixtures.ts`, `PublishModal.tsx`, `ReportsView.tsx`, `AvailabilityView.tsx`, `explainCell.ts`, `SeniorityLevel`, `WorkbookGrid.tsx`, `analysisExportService.ts`, `types/index.ts`, `TopBar.tsx`, `HistoryView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `RulesTab.tsx`, `lucide-react`, `doctorScheduleService.ts`, `DashboardView.tsx`, `16. History of work (for context)`, `AppShell.tsx`, `authService.ts`, `Button`, `NSC Clinic Roster: complete project guide`, `PublishedRosterView.tsx`, `AppContext.tsx`, `dialogs.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `SchedulesView.tsx`, `PublishedRosterSheet.tsx`, `RosterSteps.tsx`, `ui/index.ts`, `EmailTab.tsx`, `getRepository`, `package.json`, `ClinicContextState`, `ShareModal.tsx`, `NurseSelfServicePanel.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `react`, `PublishModal.tsx`, `ReportsView.tsx`, `AvailabilityView.tsx`, `SeniorityLevel`, `WorkbookGrid.tsx`, `analysisExportService.ts`, `types/index.ts`, `TopBar.tsx`, `HistoryView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `RulesTab.tsx`, `doctorScheduleService.ts`, `DashboardView.tsx`, `AppShell.tsx`, `authService.ts`, `Button`, `PublishedRosterView.tsx`, `dialogs.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `react` to `SchedulesView.tsx`, `handMoveChecks.ts`, `getRepository`, `ui/index.ts`, `ShareModal.tsx`, `NurseSelfServicePanel.tsx`, `PublishModal.tsx`, `ReportsView.tsx`, `AvailabilityView.tsx`, `WorkbookGrid.tsx`, `Design system: NSC Clinic Roster`, `analysisExportService.ts`, `types/index.ts`, `HistoryView.tsx`, `lucide-react`, `doctorScheduleService.ts`, `16. History of work (for context)`, `AppShell.tsx`, `authService.ts`, `Button`, `PublishModal`, `access.ts`, `dialogs.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _919 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14661654135338345 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09388335704125178 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._