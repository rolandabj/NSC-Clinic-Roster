# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 364 files · ~404,245 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2730 nodes · 8820 edges · 127 communities (114 shown, 13 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 389 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9b2fb4e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- emailService.ts
- hoursBalance.ts
- clinicModel.test.ts
- makeNurse
- publicHolidays.test.ts
- notify
- continuousHours.test.ts
- ui-audit.cjs
- package.json
- GridStatusBar.tsx
- dependencies
- Test-Driven Development
- geminiApi.test.ts
- IRepository
- CollectionSyncer
- GridTable.tsx
- dialogs.tsx
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- FairnessModal.tsx
- App.tsx
- apiApp.ts
- devDependencies
- authService
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
- NurseSelfServicePanel.tsx
- PublishView.tsx
- Optimization Patterns
- cellView.test.ts
- checkScheduler.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- engineRules.test.ts
- firestore-rules/package.json
- getRepository
- address.ts
- UI overhaul: checklist
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- lastResort.test.ts
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
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- NursesView.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- FillDialog.tsx
- access.ts
- usePhoneLayout.ts
- analysisExportService.ts
- links.cjs
- icsExportService.ts
- types/index.ts
- makeSchedule
- RosterSteps.tsx
- ref_playwright
- UI overhaul: summary and next steps
- createApiApp
- PublishedRosterView.tsx
- DashboardView.tsx
- Phases
- harness/main.tsx
- Handover for a new chat
- nurseRosterService.ts
- Finish a change
- Rules
- handMoves.test.ts
- formatDate
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- ref_node_assert
- start.sh
- stop.sh
- Rules
- grid-flow.cjs
- LiveCollectionCache
- WorkbookGrid.tsx
- public-pages.cjs
- seedRunner.ts
- RosterGrid
- FirestoreRepository.ts
- NSC Clinic Roster: complete project guide
- ClinicRoster
- RosterDayView.tsx
- RulesTab.tsx
- savingSafety.test.ts
- grid-timing.cjs
- 16. History of work (for context)
- fakeAuth.ts
- my-requests.cjs
- ui/index.ts
- EmailTab.tsx
- nurse-page.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 117 edges
2. `Assignment` - 113 edges
3. `Nurse` - 97 edges
4. `getRepository()` - 95 edges
5. `Schedule` - 92 edges
6. `16. History of work (for context)` - 92 edges
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

## Communities (127 total, 13 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (81): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, Step, ShareModalProps (+73 more)

### Community 1 - "emailService.ts"
Cohesion: 0.20
Nodes (11): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+3 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (35): NurseTimesheetModalProps, askedCarry(), closePeriod(), countHoursInRange(), earlierPeriodTotals(), HoursPart, HoursSchedule, Leftover (+27 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.08
Nodes (24): Steps, planner(), history(), D, DOCTORS, DR_X, DUTIES, E (+16 more)

### Community 4 - "makeNurse"
Cohesion: 0.09
Nodes (16): ctx(), EARLY, LATE, EARLY, input(), LATE, softHoursLimit, week (+8 more)

### Community 5 - "publicHolidays.test.ts"
Cohesion: 0.15
Nodes (13): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday(), planHolidayLeaveTidy() (+5 more)

### Community 6 - "notify"
Cohesion: 0.11
Nodes (45): confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps (+37 more)

### Community 7 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "GridStatusBar.tsx"
Cohesion: 0.15
Nodes (14): react-dom, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), nextTabIndex(), Tabs(), GridSelectionState (+6 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 14 - "IRepository"
Cohesion: 0.13
Nodes (19): saveRosterBackup(), restoreVersion(), VersionRestoreResult, applyHolidayChangeToLeave(), saveHolidayLeave(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+11 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.09
Nodes (14): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, changedLists() (+6 more)

### Community 16 - "GridTable.tsx"
Cohesion: 0.09
Nodes (37): problemWords(), FOCUS_CELL, GridCell, GridCellActions, SELECTED_CELL, useCellFlags(), fmtHours(), GridRow (+29 more)

### Community 17 - "dialogs.tsx"
Cohesion: 0.21
Nodes (10): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, PendingConfirm, settleConfirm() (+2 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.14
Nodes (21): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+13 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "FairnessModal.tsx"
Cohesion: 0.10
Nodes (31): FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap, YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup() (+23 more)

### Community 22 - "App.tsx"
Cohesion: 0.18
Nodes (11): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 23 - "apiApp.ts"
Cohesion: 0.13
Nodes (15): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, Request (+7 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "authService"
Cohesion: 0.07
Nodes (21): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+13 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+12 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.12
Nodes (40): 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+32 more)

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
Nodes (31): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps (+23 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.09
Nodes (21): isPhoneSize(), amy, LEE, lookups, mary, nina, shift, ANNUAL_LEAVE (+13 more)

### Community 38 - "NurseSelfServicePanel.tsx"
Cohesion: 0.12
Nodes (30): Badge(), cx(), Dialog(), WIDTHS, Checkbox(), DateInput(), Field(), FieldInputProps (+22 more)

### Community 39 - "PublishView.tsx"
Cohesion: 0.12
Nodes (27): EmailHtmlPreview(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, PublishModal(), AuditTrailView(), AuditTrailViewProps (+19 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, CellDay, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+11 more)

### Community 42 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "getRepository"
Cohesion: 0.12
Nodes (38): 13. Screens in detail, NoticeTone, AllRequestsPanel(), AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE (+30 more)

### Community 49 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 50 - "UI overhaul: checklist"
Cohesion: 0.14
Nodes (12): useLatestCallback(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens (+4 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.13
Nodes (30): 4. Navigation and app shell, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+22 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

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

### Community 68 - "ShareModal.tsx"
Cohesion: 0.53
Nodes (5): ShareModal(), TabType, ensurePublicRosters(), pick(), syncPublicRoster()

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
Cohesion: 0.11
Nodes (24): LoginPageProps, signOutSafely(), AppShellProps, AccountMenu(), TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps (+16 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "FillDialog.tsx"
Cohesion: 0.53
Nodes (5): FillDialogProps, FillRange, GenerationPreflightSummary, GenerationProgress, RegenerateMode

### Community 78 - "access.ts"
Cohesion: 0.18
Nodes (15): 3. Users, roles and access, usePermissions(), APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, DashboardViewProps, canAccessRoute() (+7 more)

### Community 79 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 80 - "analysisExportService.ts"
Cohesion: 0.07
Nodes (56): How a run works, jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES (+48 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (30): isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus, AuditAction (+22 more)

### Community 84 - "makeSchedule"
Cohesion: 0.07
Nodes (28): SchedulingEngine, CANONICAL_RULES_SPEC, DAY_DUTY, hoursOnlyRules(), makeSchedule(), SENIOR, LATE, run() (+20 more)

### Community 85 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 89 - "PublishedRosterView.tsx"
Cohesion: 0.25
Nodes (10): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+2 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.13
Nodes (28): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+20 more)

### Community 91 - "Phases"
Cohesion: 0.25
Nodes (8): Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 4: roster screen layout, words and accessibility, Phase 6: Nurses, Doctors, Availability and Requests (planner screens), Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit, Phases

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 94 - "nurseRosterService.ts"
Cohesion: 0.11
Nodes (28): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), LoadState, MyRosterViewProps, MyDay, myShiftDays(), dayMonth() (+20 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+14 more)

### Community 98 - "formatDate"
Cohesion: 0.08
Nodes (35): Report, What to check, What to look at, EditDoctorShiftModal(), TIME_PRESETS, FillDialog(), RosterSteps(), useRosterEdits() (+27 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.11
Nodes (31): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+23 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "ref_node_assert"
Cohesion: 0.09
Nodes (15): nextRowLimit(), ROW_STEP, useRowsInSteps(), LATE, nurse, CARD, EARLY, FULL (+7 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 110 - "WorkbookGrid.tsx"
Cohesion: 0.06
Nodes (60): 6. Clinic model (the business rules in plain English), DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), CellChoice (+52 more)

### Community 112 - "seedRunner.ts"
Cohesion: 0.12
Nodes (29): AppContext, useAppContext(), DatabaseTab(), assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+21 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 116 - "FirestoreRepository.ts"
Cohesion: 0.08
Nodes (17): defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener (+9 more)

### Community 117 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.22
Nodes (8): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, WalkthroughModal(), WalkthroughModalProps

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "RosterDayView.tsx"
Cohesion: 0.36
Nodes (9): firstDayShown(), RosterDayView(), ProblemBadge(), Notice(), MyRosterView(), dayTotalWords(), formatDateTime(), formatDayDate() (+1 more)

### Community 122 - "RulesTab.tsx"
Cohesion: 0.07
Nodes (48): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, Other engine files, SwapManagerModal(), ALWAYS_ON, effectiveValue(), findRule(), GROUPS (+40 more)

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (10): clearYearToDateCache(), forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS (+2 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "16. History of work (for context)"
Cohesion: 0.13
Nodes (12): 16. History of work (for context), GridCellProps, GridSelection, cellKeyOf(), useGridSelection(), addDays(), DateRange, defaultPatternRange() (+4 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.10
Nodes (32): PROBLEM_MARKS, ProblemKind, Tone, TONE_CLASSES, Button(), ButtonProps, ButtonSize, ButtonVariant (+24 more)

### Community 135 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

## Knowledge Gaps
- **933 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+928 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1139 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `16. History of work (for context)`, `ui/index.ts`, `notify`, `EmailTab.tsx`, `package.json`, `GridStatusBar.tsx`, `GridTable.tsx`, `dialogs.tsx`, `NurseSample.tsx`, `FairnessModal.tsx`, `App.tsx`, `authService`, `PlannerSample.tsx`, `ui.tsx`, `NurseSelfServicePanel.tsx`, `PublishView.tsx`, `getRepository`, `UI overhaul: checklist`, `AppShell.tsx`, `ShareModal.tsx`, `NursesView.tsx`, `FillDialog.tsx`, `access.ts`, `usePhoneLayout.ts`, `analysisExportService.ts`, `makeSchedule`, `RosterSteps.tsx`, `PublishedRosterView.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `nurseRosterService.ts`, `formatDate`, `doctorScheduleService.ts`, `ref_node_assert`, `WorkbookGrid.tsx`, `seedRunner.ts`, `NSC Clinic Roster: complete project guide`, `RosterDayView.tsx`, `RulesTab.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `ui/index.ts`, `notify`, `EmailTab.tsx`, `package.json`, `GridStatusBar.tsx`, `GridTable.tsx`, `dialogs.tsx`, `NurseSample.tsx`, `FairnessModal.tsx`, `App.tsx`, `authService`, `PlannerSample.tsx`, `ui.tsx`, `NurseSelfServicePanel.tsx`, `PublishView.tsx`, `getRepository`, `AppShell.tsx`, `ShareModal.tsx`, `NursesView.tsx`, `FillDialog.tsx`, `access.ts`, `analysisExportService.ts`, `RosterSteps.tsx`, `PublishedRosterView.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `nurseRosterService.ts`, `formatDate`, `doctorScheduleService.ts`, `WorkbookGrid.tsx`, `seedRunner.ts`, `RosterDayView.tsx`, `RulesTab.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `SchedulesView.tsx`, `ui/index.ts`, `notify`, `GridStatusBar.tsx`, `IRepository`, `CollectionSyncer`, `GridTable.tsx`, `firebaseIdentityService.ts`, `authService`, `SchedulingEngine.ts`, `react`, `fixtures.ts`, `NurseSelfServicePanel.tsx`, `checkScheduler.test.ts`, `FirestoreRepository`, `getRepository`, `address.ts`, `UI overhaul: checklist`, `AppShell.tsx`, `Design system: NSC Clinic Roster`, `access.ts`, `usePhoneLayout.ts`, `RosterSteps.tsx`, `PublishedRosterView.tsx`, `nurseRosterService.ts`, `formatDate`, `ref_node_assert`, `WorkbookGrid.tsx`, `RosterGrid`, `NSC Clinic Roster: complete project guide`, `RosterDayView.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _933 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1160585446299732 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10099573257467995 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._