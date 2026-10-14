# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 361 files · ~399,984 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2716 nodes · 8772 edges · 133 communities (122 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 389 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8cdff59c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- emailService.ts
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- handMoveChecks.ts
- getRepository
- authService.ts
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- gridSelection.ts
- savingSafety.test.ts
- CollectionSyncer
- GridTable.tsx
- nurseClinicFloat.test.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- weekend.ts
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
- react
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- fixtures.ts
- explainCell.ts
- PublishModal.tsx
- Optimization Patterns
- cellView.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- hoursAccounting.ts
- firestore-rules/package.json
- AvailabilityView.tsx
- WhoCanCover.tsx
- usePresence.ts
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
- published-rules.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- FirestoreRepository.ts
- engineRules.test.ts
- grid-keys.cjs
- ExportModal.tsx
- links.cjs
- icsExportService.ts
- types/index.ts
- makeNurse
- RosterSheetTabs.tsx
- ref_playwright
- UI overhaul: summary and next steps
- geminiApi.test.ts
- PublishedRosterSheet.tsx
- dashboardSummary.ts
- Phases
- harness/main.tsx
- Handover for a new chat
- MyRosterView.tsx
- Finish a change
- Rules
- assignmentChecks.ts
- formatDate
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- teamRoster.test.ts
- start.sh
- stop.sh
- Rules
- 16. History of work (for context)
- LiveCollectionCache
- createLiveReconciler
- ref_node_assert
- SchedulesView.tsx
- RosterGrid
- explainCell.test.ts
- preferenceFocus.test.ts
- quotaTracker
- lastResort.test.ts
- preferenceOrder.ts
- holidayLeave.ts
- newRosterDates.ts
- ClinicRoster
- requestFindings.test.ts
- shiftMoves.ts
- grid-timing.cjs
- NSC Clinic Roster: complete project guide
- my-requests.cjs
- RosterSteps.tsx
- ui/index.ts
- EmailTab.tsx
- address.ts
- usePhoneLayout.ts
- nurse-page.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 117 edges
2. `Assignment` - 113 edges
3. `Nurse` - 96 edges
4. `getRepository()` - 95 edges
5. `Schedule` - 92 edges
6. `16. History of work (for context)` - 91 edges
7. `lucide-react` - 89 edges
8. `DutyWindow` - 89 edges
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
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx

## Import Cycles
- None detected.

## Communities (133 total, 11 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.16
Nodes (62): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+54 more)

### Community 1 - "emailService.ts"
Cohesion: 0.26
Nodes (8): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS, withoutConnectionSettings()

### Community 2 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (32): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+24 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.20
Nodes (13): BuildNurseRosterInput, dayMonth(), formatRosterAsText(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, nurseLinkUrl(), origin(), RegenerateNurseLinkResult (+5 more)

### Community 5 - "handMoveChecks.ts"
Cohesion: 0.31
Nodes (13): Other engine files, FairnessModal(), SwapManagerModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings() (+5 more)

### Community 6 - "getRepository"
Cohesion: 0.09
Nodes (59): ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+51 more)

### Community 7 - "authService.ts"
Cohesion: 0.08
Nodes (19): LoginPageProps, signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, authService (+11 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.07
Nodes (65): 3. Users, roles and access, 4. Navigation and app shell, AppContext, AppContextValue, useAppContext(), AppShell(), bootstrap(), AuditTrailView (+57 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "gridSelection.ts"
Cohesion: 0.09
Nodes (19): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelection, GridSelectionState (+11 more)

### Community 14 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (8): clearYearToDateCache(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps, { initializeTestEnvironment }, requireRules

### Community 15 - "CollectionSyncer"
Cohesion: 0.13
Nodes (4): CollectionSyncer, fingerprint(), rebaseEdit(), EntityForCollection

### Community 16 - "GridTable.tsx"
Cohesion: 0.11
Nodes (32): firstDayShown(), RosterDayView(), ProblemBadge(), CellView, DayTotal, dayTotalsOf(), dayTotalWords(), problemWords() (+24 more)

### Community 17 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (21): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+13 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 22 - "App.tsx"
Cohesion: 0.18
Nodes (10): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+2 more)

### Community 23 - "apiApp.ts"
Cohesion: 0.16
Nodes (13): express, express-rate-limit, helmet, authMiddleware(), BackendRole, Express, requireOwner, requirePlanner (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.17
Nodes (15): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialog(), FillDialogProps, FillRange (+7 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.13
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+12 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (59): bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes() (+51 more)

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
Cohesion: 0.10
Nodes (32): lucide-react, react, uuid, NoticeTone, Props, State, openStack, useDialogA11y() (+24 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.08
Nodes (19): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+11 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.11
Nodes (16): ANNUAL_LEAVE, DAY_DUTY, UNPAID_LEAVE, LONG, NOV, OCT, D, E (+8 more)

### Community 38 - "explainCell.ts"
Cohesion: 0.20
Nodes (17): 7. Rules, BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift, round1(), shiftDate() (+9 more)

### Community 39 - "PublishModal.tsx"
Cohesion: 0.11
Nodes (33): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), AssignmentDiffItem, ChangeType (+25 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.test.ts"
Cohesion: 0.08
Nodes (25): 15. Tests, CellDay, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+17 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "FirestoreRepository"
Cohesion: 0.23
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 46 - "hoursAccounting.ts"
Cohesion: 0.15
Nodes (26): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, CHANGE_LABELS, VersionCompareModal() (+18 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (32): 13. Screens in detail, AllRequestsPanel(), AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+24 more)

### Community 49 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 50 - "usePresence.ts"
Cohesion: 0.09
Nodes (21): useLatestCallback(), othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), planSync(), PresenceRecord (+13 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "seedRunner.ts"
Cohesion: 0.15
Nodes (15): toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+7 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoves.test.ts"
Cohesion: 0.12
Nodes (12): AMY, BEA, CARA, DAN, DOCTORS, DUTIES, EARLY, JUNIOR (+4 more)

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
Cohesion: 0.06
Nodes (55): DayProblem, DayRow, dayViewOf(), isPhoneSize(), KIND, ORDER, CellContextMenu(), CellEditorDialog() (+47 more)

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

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "FirestoreRepository.ts"
Cohesion: 0.26
Nodes (12): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+4 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 80 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (40): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, VersionViewModal() (+32 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (29): CellChoice, changedLists(), sameItems(), ApprovalStatus, AssignmentKind, AuditAction, AuditEvent, BlockWeeks (+21 more)

### Community 84 - "makeNurse"
Cohesion: 0.09
Nodes (27): earlierRostersThisYear(), latestPublishedVersion(), hoursOnlyRules(), makeNurse(), makeSchedule(), SENIOR, LATE, run() (+19 more)

### Community 85 - "RosterSheetTabs.tsx"
Cohesion: 0.43
Nodes (4): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), render()

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 89 - "PublishedRosterSheet.tsx"
Cohesion: 0.29
Nodes (9): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), weekdayOf(), loadPublicRoster() (+1 more)

### Community 90 - "dashboardSummary.ts"
Cohesion: 0.29
Nodes (6): addDays(), countChangedCells(), NEXT_ROSTER_WARNING_DAYS, nextRosterNeeded(), OnDutyEntry, receiptSummary()

### Community 91 - "Phases"
Cohesion: 0.22
Nodes (9): Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, and request decision emails, Phase 6: Nurses, Doctors, Availability and Requests (planner screens), Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit (+1 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 94 - "MyRosterView.tsx"
Cohesion: 0.25
Nodes (10): ViewerData, LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), nurseCalendarUrl(), nurseWebcalUrl() (+2 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "assignmentChecks.ts"
Cohesion: 0.07
Nodes (42): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+34 more)

### Community 98 - "formatDate"
Cohesion: 0.09
Nodes (31): Report, What to check, What to look at, ProblemCounts(), GridStatusBar(), SelectionView(), HolidayDayOffPicker(), HolidayDayOffPickerProps (+23 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.12
Nodes (28): CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, WorkingHoursCalculationResult, deleteDoctorShift() (+20 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "teamRoster.test.ts"
Cohesion: 0.22
Nodes (16): loadPlannerData(), loadViewerData(), readStoredId(), todayAtClinic, addDaysIso(), buildNurseRosterDoc(), buildTeamRosterSheet(), latestPublishedVersions() (+8 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "16. History of work (for context)"
Cohesion: 0.13
Nodes (18): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), PublicMessage(), PublicPageFrame(), useRosterChecks(), AcknowledgePage(), AcknowledgePageProps, sameHoursHistory() (+10 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.17
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 110 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 111 - "ref_node_assert"
Cohesion: 0.09
Nodes (14): ctx(), EARLY, LATE, diff(), LATE, nurse, now, DR_PCC (+6 more)

### Community 112 - "SchedulesView.tsx"
Cohesion: 0.06
Nodes (54): 11. Saving, live updates, versions, DeleteScheduleModal(), DeleteVersionModal(), ShareModalProps, useRosterEdits(), HistoryViewProps, WEEKDAY_NAMES, PublishedRosterViewProps (+46 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 115 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 116 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 117 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 118 - "preferenceOrder.ts"
Cohesion: 0.33
Nodes (6): 6. Clinic model (the business rules in plain English), applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus

### Community 119 - "holidayLeave.ts"
Cohesion: 0.36
Nodes (9): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy(), withHolidaysAtZero() (+1 more)

### Community 120 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 121 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 122 - "requestFindings.test.ts"
Cohesion: 0.33
Nodes (3): LATE, schedule, wishFindings()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.17
Nodes (11): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works (+3 more)

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 133 - "ui/index.ts"
Cohesion: 0.08
Nodes (57): Badge(), PROBLEM_MARKS, ProblemKind, Tone, TONE_CLASSES, Button(), ButtonProps, ButtonSize (+49 more)

### Community 135 - "EmailTab.tsx"
Cohesion: 0.15
Nodes (16): nodemailer, EmailTab(), EmailTabProps, authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights() (+8 more)

### Community 136 - "address.ts"
Cohesion: 0.38
Nodes (5): Address, ORDER, ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 138 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

## Knowledge Gaps
- **930 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+925 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1133 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `NSC Clinic Roster: complete project guide`, `RosterSteps.tsx`, `ui/index.ts`, `getRepository`, `authService.ts`, `EmailTab.tsx`, `package.json`, `AppShell.tsx`, `usePhoneLayout.ts`, `gridSelection.ts`, `GridTable.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `fixtures.ts`, `PublishModal.tsx`, `hoursAccounting.ts`, `AvailabilityView.tsx`, `WhoCanCover.tsx`, `usePresence.ts`, `WorkbookGrid.tsx`, `ExportModal.tsx`, `RosterSheetTabs.tsx`, `PublishedRosterSheet.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `assignmentChecks.ts`, `formatDate`, `doctorScheduleService.ts`, `16. History of work (for context)`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `RosterSteps.tsx`, `ui/index.ts`, `getRepository`, `authService.ts`, `EmailTab.tsx`, `package.json`, `AppShell.tsx`, `gridSelection.ts`, `GridTable.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `PublishModal.tsx`, `hoursAccounting.ts`, `AvailabilityView.tsx`, `WorkbookGrid.tsx`, `ExportModal.tsx`, `RosterSheetTabs.tsx`, `PublishedRosterSheet.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `assignmentChecks.ts`, `formatDate`, `doctorScheduleService.ts`, `16. History of work (for context)`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `react` to `Assignment`, `doctorScheduleService.ts`, `handMoveChecks.ts`, `getRepository`, `authService.ts`, `PublishModal.tsx`, `ui/index.ts`, `AppShell.tsx`, `Design system: NSC Clinic Roster`, `16. History of work (for context)`, `WorkbookGrid.tsx`, `hoursAccounting.ts`, `SchedulesView.tsx`, `ExportModal.tsx`, `AvailabilityView.tsx`, `RosterToolbar.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _930 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11092436974789915 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `getRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.09398782343987823 - nodes in this community are weakly interconnected._