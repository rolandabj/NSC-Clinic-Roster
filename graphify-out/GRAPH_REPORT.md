# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 361 files · ~402,713 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2719 nodes · 8781 edges · 136 communities (124 shown, 12 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 390 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7b1ff846`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Schedule
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
- IRepository
- CollectionSyncer
- GridTable.tsx
- Assignment
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- routes/auth.ts
- devDependencies
- RosterToolbar.tsx
- quick reference
- decisionEmail.test.ts
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- lucide-react
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- hoursRules.test.ts
- NurseSelfServicePanel.tsx
- PublishModal.tsx
- Optimization Patterns
- cellView.ts
- NurseTimesheetModal.tsx
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- hoursAccounting.ts
- firestore-rules/package.json
- AvailabilityView.tsx
- WhoCanCover.tsx
- UI overhaul: checklist
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
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
- dayView.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- authService.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- FirestoreRepository.ts
- access.ts
- grid-keys.cjs
- ExportModal.tsx
- links.cjs
- icsExportService.ts
- types/index.ts
- ref_node_assert
- SchedulesView.tsx
- ref_playwright
- UI overhaul: summary and next steps
- apiApp.ts
- PublishedRosterView.tsx
- DashboardView.tsx
- Phases
- harness/main.tsx
- Handover for a new chat
- MyRosterView.tsx
- Finish a change
- Rules
- Nurse
- react
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- SchedulingEngine
- firebase-mcp.sh
- versionRestore.test.ts
- start.sh
- stop.sh
- Rules
- dateDefaults.ts
- LiveCollectionCache
- WorkbookGrid.tsx
- cx
- seedRunner.ts
- RosterGrid
- preferenceFocus.test.ts
- Button
- quotaTracker
- NSC Clinic Roster: complete project guide
- uiComponents.test.ts
- ClinicRoster
- RosterDayView.tsx
- scheduleTransactions.test.ts
- weekHours.test.ts
- firestoreRest.ts
- createLiveReconciler
- colorContrast.ts
- teamRoster.test.ts
- grid-timing.cjs
- 16. History of work (for context)
- fakeAuth.ts
- newRosterDates.ts
- my-requests.cjs
- Notice
- ui/index.ts
- EmailTab.tsx
- nurse-page.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 117 edges
2. `Assignment` - 113 edges
3. `Nurse` - 96 edges
4. `getRepository()` - 95 edges
5. `Schedule` - 92 edges
6. `16. History of work (for context)` - 92 edges
7. `lucide-react` - 89 edges
8. `DutyWindow` - 89 edges
9. `Doctor` - 78 edges
10. `useDialogA11y()` - 76 edges

## Surprising Connections (you probably didn't know these)
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `4. What Phases 4 and 5 did (guide items 59 to 72)` --references--> `decideRequest()`  [INFERRED]
  tasks/handover.md → src/services/requests/staffRequestService.ts
- `6. Points to know` --references--> `decideRequest()`  [INFERRED]
  tasks/handover.md → src/services/requests/staffRequestService.ts

## Import Cycles
- None detected.

## Communities (136 total, 12 thin omitted)

### Community 0 - "Schedule"
Cohesion: 0.19
Nodes (46): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, NONE, SwapManagerModalProps (+38 more)

### Community 1 - "emailService.ts"
Cohesion: 0.19
Nodes (12): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+4 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.07
Nodes (45): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+37 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (16): dayMonth(), ensureNurseLink(), formatRosterAsText(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, NURSE_TOKEN_PATTERN, regenerateNurseLink(), RegenerateNurseLinkResult (+8 more)

### Community 5 - "handMoveChecks.ts"
Cohesion: 0.33
Nodes (11): FairnessModal(), SwapManagerModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields() (+3 more)

### Community 6 - "getRepository"
Cohesion: 0.06
Nodes (91): Report, What to check, What to look at, useAppContext(), confirmDialog(), ConfirmOptions, DialogState, dismissNotice() (+83 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (23): firebase, name, private, type, version, autoprefixer, cors, date-fns (+15 more)

### Community 10 - "ClinicContextState"
Cohesion: 0.11
Nodes (21): AppContext, AppContextValue, TopBarProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "gridSelection.ts"
Cohesion: 0.17
Nodes (14): CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf(), moveSelection(), PopupRef (+6 more)

### Community 14 - "IRepository"
Cohesion: 0.10
Nodes (14): VersionRestoreResult, fingerprint(), syncScheduleAssignments(), Desired, Known, SyncPlan, repositoryManager, IRepository (+6 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.13
Nodes (7): 11. Saving, live updates, versions, CollectionSyncer, fingerprint(), planSync(), rebaseEdit(), EntityForCollection, Phase 3: roster grid speed and structure

### Community 16 - "GridTable.tsx"
Cohesion: 0.12
Nodes (30): CellView, DayTotal, FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL, useCellFlags() (+22 more)

### Community 17 - "Assignment"
Cohesion: 0.19
Nodes (17): TemplateModalProps, RosterSnapshot, CellFacts, LeaveAndLocksSheetProps, NEXT_ROSTER_WARNING_DAYS, OnDutyEntry, ResolvedClinicSetup, GenerationResult (+9 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (20): jose, authMiddleware(), AuthUser, Express, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields (+12 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.14
Nodes (20): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+12 more)

### Community 22 - "App.tsx"
Cohesion: 0.16
Nodes (11): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+3 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.14
Nodes (17): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+9 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.13
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+11 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (70): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+62 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "lucide-react"
Cohesion: 0.12
Nodes (26): lucide-react, openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, ShortcutItem (+18 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (14): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+6 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 38 - "NurseSelfServicePanel.tsx"
Cohesion: 0.20
Nodes (16): NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors, leaveStatus() (+8 more)

### Community 39 - "PublishModal.tsx"
Cohesion: 0.14
Nodes (26): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), EMAIL_LOG_HTML_BUDGET, encoder (+18 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.ts"
Cohesion: 0.13
Nodes (22): CellDay, cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), SOURCE_SPOKEN (+14 more)

### Community 42 - "NurseTimesheetModal.tsx"
Cohesion: 0.18
Nodes (14): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), AuditTrailViewProps, AuditAction (+6 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "hoursAccounting.ts"
Cohesion: 0.22
Nodes (13): NurseTimesheetModalProps, SortField, TabMode, HoursHistory, HoursPart, NurseHoursBalance, calculateClinicHoursMetrics(), ClinicHoursMetrics (+5 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.09
Nodes (46): 10. Hours, AllRequestsPanel(), AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+38 more)

### Community 49 - "WhoCanCover.tsx"
Cohesion: 0.53
Nodes (5): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, NurseDayExplanation

### Community 50 - "UI overhaul: checklist"
Cohesion: 0.20
Nodes (9): Phase 0: setup, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit (+1 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.12
Nodes (30): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+22 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoves.test.ts"
Cohesion: 0.06
Nodes (27): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, AMY, BEA, CARA, DAN, DOCTORS (+19 more)

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

### Community 68 - "dayView.ts"
Cohesion: 0.13
Nodes (18): DayProblem, DayRow, dayViewOf(), isPhoneSize(), KIND, ORDER, cellSummary(), isDayProblem() (+10 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.15
Nodes (12): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+4 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "authService.ts"
Cohesion: 0.16
Nodes (17): LoginPageProps, AppShellProps, APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, AuthModalProps (+9 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.13
Nodes (14): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+6 more)

### Community 77 - "FirestoreRepository.ts"
Cohesion: 0.26
Nodes (12): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+4 more)

### Community 78 - "access.ts"
Cohesion: 0.29
Nodes (10): 3. Users, roles and access, 4. Navigation and app shell, AccountMenu(), TopBar(), canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor() (+2 more)

### Community 80 - "ExportModal.tsx"
Cohesion: 0.08
Nodes (46): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, ReportsView() (+38 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.27
Nodes (13): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+5 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (29): ShareModalProps, AssignmentDiffItem, ChangeType, FormattedAssignmentState, WEEKDAY_NAMES, BuildNurseRosterInput, PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT (+21 more)

### Community 84 - "ref_node_assert"
Cohesion: 0.04
Nodes (67): 15. Tests, ANALYSIS_FORMAT, ScheduleValidator, CARD, input(), KHAN, LATE, SCHEDULE (+59 more)

### Community 85 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (25): PageLoading(), useLatestCallback(), PHONE_QUERY, FillDialog(), FillDialogProps, FillRange, ROSTER_SHEET_PANEL_ID, RosterSheet (+17 more)

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "apiApp.ts"
Cohesion: 0.13
Nodes (18): repoRoot, swaps, express, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer() (+10 more)

### Community 89 - "PublishedRosterView.tsx"
Cohesion: 0.29
Nodes (9): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+1 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.23
Nodes (21): 12. Publishing and nurse links, Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+13 more)

### Community 91 - "Phases"
Cohesion: 0.29
Nodes (7): Phase 0: setup (right after approval), Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, and request decision emails, Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit, Phases

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 94 - "MyRosterView.tsx"
Cohesion: 0.23
Nodes (12): PublishedRosterSheet(), LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), nurseCalendarUrl(), nurseWebcalUrl() (+4 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "Nurse"
Cohesion: 0.18
Nodes (11): uuid, NONE, NurseFairnessMetrics, ProposedSwap, NurseSelfServicePanelProps, MoveSuggestion, namesSpecialty(), OutsideList (+3 more)

### Community 98 - "react"
Cohesion: 0.13
Nodes (19): react, DoctorWeekChangeDialogProps, dateLabel(), RosterPicker(), RosterPickerProps, CoverageSheet(), HolidayDayOffPicker(), HolidayDayOffPickerProps (+11 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.12
Nodes (33): 13. Screens in detail, CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView() (+25 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "SchedulingEngine"
Cohesion: 0.08
Nodes (18): FLOAT_ROLE_ID, SchedulingEngine, DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN (+10 more)

### Community 104 - "versionRestore.test.ts"
Cohesion: 0.29
Nodes (4): BACKUPS_KEPT, october, octoberVersion, september

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 109 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 110 - "WorkbookGrid.tsx"
Cohesion: 0.11
Nodes (26): CellContextMenu(), CellEditorDialog(), withDr(), GRID_KEY_ID, GridLegend(), GridStatusBar(), GridToolbar(), GridToolbarProps (+18 more)

### Community 111 - "cx"
Cohesion: 0.21
Nodes (14): cx(), Checkbox(), DateInput(), Field(), FieldInputProps, Input(), inputClass, InputProps (+6 more)

### Community 112 - "seedRunner.ts"
Cohesion: 0.11
Nodes (24): saveRosterBackup(), restoreVersion(), removeNurseRoster(), revokeNurseLink(), removePublicRoster(), afterShiftsSaved(), deleteEntireSchedule(), ScheduleDeleteResult (+16 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "preferenceFocus.test.ts"
Cohesion: 0.18
Nodes (11): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus, CARD, KHAN, LATE (+3 more)

### Community 115 - "Button"
Cohesion: 0.21
Nodes (11): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, EmptyState() (+3 more)

### Community 116 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 117 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.17
Nodes (11): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works (+3 more)

### Community 118 - "uiComponents.test.ts"
Cohesion: 0.21
Nodes (9): Column, DataTable(), SortDirection, sortRows(), SortState, Dialog(), Phase 6: Nurses, Doctors, Availability and Requests (planner screens), columns (+1 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "RosterDayView.tsx"
Cohesion: 0.42
Nodes (8): firstDayShown(), RosterDayView(), dayTotalsOf(), dayTotalWords(), problemWords(), WarningsSheetProps, ValidationReport, formatDayDate()

### Community 121 - "scheduleTransactions.test.ts"
Cohesion: 0.22
Nodes (4): rosterSaveQueues, apps, { initializeTestEnvironment }, requireRules

### Community 122 - "weekHours.test.ts"
Cohesion: 0.15
Nodes (13): Other engine files, addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WEEK_HOURS_DEFAULT, WEEK_HOURS_RULE, WeekHours (+5 more)

### Community 123 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 124 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 125 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 126 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "16. History of work (for context)"
Cohesion: 0.10
Nodes (13): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), useRosterEdits(), CellChoice, GridSelection, cellKeyOf(), useGridSelection() (+5 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.29
Nodes (4): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before

### Community 130 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "Notice"
Cohesion: 0.50
Nodes (3): KINDS, Notice(), NoticeKind

### Community 133 - "ui/index.ts"
Cohesion: 0.24
Nodes (14): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemCounts(), ProblemKind, Tone, TONE_CLASSES, Card() (+6 more)

### Community 135 - "EmailTab.tsx"
Cohesion: 0.19
Nodes (14): EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+6 more)

## Knowledge Gaps
- **930 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+925 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1133 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Schedule`, `16. History of work (for context)`, `Notice`, `ui/index.ts`, `getRepository`, `EmailTab.tsx`, `package.json`, `ClinicContextState`, `gridSelection.ts`, `GridTable.tsx`, `Assignment`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `lucide-react`, `NurseSelfServicePanel.tsx`, `PublishModal.tsx`, `NurseTimesheetModal.tsx`, `hoursAccounting.ts`, `AvailabilityView.tsx`, `WhoCanCover.tsx`, `AppShell.tsx`, `authService.ts`, `Design system: NSC Clinic Roster`, `access.ts`, `ExportModal.tsx`, `ref_node_assert`, `SchedulesView.tsx`, `PublishedRosterView.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `Nurse`, `DoctorsView.tsx`, `WorkbookGrid.tsx`, `cx`, `Button`, `NSC Clinic Roster: complete project guide`, `uiComponents.test.ts`, `RosterDayView.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `Schedule`, `Notice`, `ui/index.ts`, `getRepository`, `EmailTab.tsx`, `package.json`, `GridTable.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `NurseSelfServicePanel.tsx`, `PublishModal.tsx`, `NurseTimesheetModal.tsx`, `hoursAccounting.ts`, `AvailabilityView.tsx`, `AppShell.tsx`, `authService.ts`, `access.ts`, `ExportModal.tsx`, `SchedulesView.tsx`, `PublishedRosterView.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `Nurse`, `react`, `DoctorsView.tsx`, `WorkbookGrid.tsx`, `cx`, `Button`, `uiComponents.test.ts`, `RosterDayView.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `lucide-react` to `16. History of work (for context)`, `Schedule`, `handMoveChecks.ts`, `getRepository`, `PublishModal.tsx`, `NurseTimesheetModal.tsx`, `AvailabilityView.tsx`, `AppShell.tsx`, `NSC Clinic Roster: UI review and overhaul in phases`, `authService.ts`, `Design system: NSC Clinic Roster`, `access.ts`, `ExportModal.tsx`, `SchedulesView.tsx`, `Nurse`, `react`, `DoctorsView.tsx`, `WorkbookGrid.tsx`, `Button`, `uiComponents.test.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _930 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06693877551020408 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `nurseRosterService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._