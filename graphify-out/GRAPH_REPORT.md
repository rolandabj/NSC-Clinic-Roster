# Graph Report - NSC-Clinic-Roster  (2026-11-15)

## Corpus Check
- 447 files · ~456,896 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3133 nodes · 11045 edges · 164 communities (131 shown, 33 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 519 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9725f450`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- analysisExportService.ts
- SchedulingEngine.ts
- nurseRosterService.ts
- clinicModel.test.ts
- authService
- gridSelection.ts
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- react
- DashboardView.tsx
- IRepository.ts
- handMoves.test.ts
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- lucide-react
- App.tsx
- emailService.ts
- devDependencies
- access.ts
- quick reference
- decisionEmail.test.ts
- emailPublishing.test.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- GridTable.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- fixtures.ts
- Optimization Patterns
- Assignment
- savingSafety.test.ts
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- AvailabilityView.tsx
- firestore-rules/package.json
- EntityForCollection
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- NSC Clinic Roster: complete project guide
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- myRequests.ts
- Planning and Task Breakdown
- Find Skills
- ClinicContextState
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- navigation.ts
- Rules
- RosterToolbar.tsx
- README.md
- types/index.ts
- holidayLeave.ts
- apiApp.ts
- teamRoster.test.ts
- links.cjs
- icsExportService.ts
- cellView.test.ts
- makeNurse
- checkScheduler.test.ts
- coverageRepair.test.ts
- ProblemCounts
- FirestoreRepository
- doctorEligibilityForm.ts
- Design system: NSC Clinic Roster
- nurseRoster.test.ts
- harness/main.tsx
- GridSelection
- 16. History of work (for context)
- Finish a change
- Rules
- hoursRules.test.ts
- eligibility-publish.cjs
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- geminiApi.test.ts
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- analysisExport.test.ts
- createLiveReconciler
- fakeAuth.ts
- yearToDate.ts
- quotaTracker
- HistoryView.tsx
- canonical
- approvedDayOff.test.ts
- peopleImport.ts
- futureReservations.test.ts
- publish.cjs
- authService.ts
- RosterGrid
- settings-dialogs.cjs
- leaveGuard.ts
- seedRunner.ts
- sheet-tabs.cjs
- ref_node_assert
- grid-timing.cjs
- colorContrast.ts
- NursesView.tsx
- nurseClinicFloat.test.ts
- my-requests.cjs
- pairedDoctorSafety.test.ts
- ui/index.ts
- DoctorSession
- RosterSteps.tsx
- lastResort.test.ts
- allowance.cjs
- grid-keys.cjs
- data-backup.cjs
- roster-dialogs.cjs
- nurse-editor.cjs
- nurse-page.cjs
- nurses-list.cjs
- form-dialogs.cjs
- preferenceFocus.test.ts
- ruleDraft.ts
- usePhoneLayout.ts
- useRowsInSteps
- leave-grid.cjs
- UI overhaul: checklist
- your-access.cjs
- roster-editing-dialogs.cjs
- access.cjs
- grid-flow.cjs
- weekHours.test.ts
- history.cjs
- request-clinic-dialogs.cjs
- requests.cjs
- resume.cjs
- time-periods.cjs
- toolbar.cjs
- scripts
- plain-english-reviewer.md

## God Nodes (most connected - your core abstractions)
1. `16. History of work (for context)` - 128 edges
2. `Assignment` - 126 edges
3. `react` - 119 edges
4. `Nurse` - 114 edges
5. `DutyWindow` - 101 edges
6. `getRepository()` - 99 edges
7. `formatDate()` - 96 edges
8. `Button()` - 93 edges
9. `Schedule` - 93 edges
10. `Doctor` - 91 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Final audit, 14-11-2026 (Phase 9)` --references--> `AppShell()`  [INFERRED]
  tasks/plan.md → src/components/layout/AppShell.tsx
- `6. Next steps and items outside the plan` --references--> `ResumePublish()`  [INFERRED]
  tasks/summary.md → src/components/publish/ResumePublish.tsx

## Import Cycles
- None detected.

## Communities (164 total, 33 thin omitted)

### Community 0 - "analysisExportService.ts"
Cohesion: 0.06
Nodes (73): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps, DayTotal, GridTableProps (+65 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (58): 6. Clinic model (the business rules in plain English), 7. Rules, dayTotalsOf(), assignmentCoversDoctor(), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coverageSlots() (+50 more)

### Community 2 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (17): LoadState, MyRosterViewProps, MyDay, myShiftDays(), dayMonth(), formatRosterAsText(), NURSE_ROSTER_LOOKBACK_DAYS, nurseCalendarUrl() (+9 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (27): Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D, DOCTORS (+19 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (6): authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "gridSelection.ts"
Cohesion: 0.12
Nodes (19): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelectionState, isRosterCell() (+11 more)

### Community 6 - "getRepository"
Cohesion: 0.14
Nodes (51): useAppContext(), confirmDialog(), notify(), PublishModal(), AllocationReviews(), Checkbox(), Field(), Input() (+43 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.33
Nodes (5): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 5. What comes next, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (23): description, firebase, name, private, type, version, esbuild, eslint (+15 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.04
Nodes (88): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, CellContextMenu() (+80 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "react"
Cohesion: 0.11
Nodes (25): react, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+17 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.19
Nodes (20): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+12 more)

### Community 15 - "IRepository.ts"
Cohesion: 0.19
Nodes (11): FirebaseClientConfig, SubscribeCallback, Unsubscribe, countOf(), listPage(), Page, pageFromList(), PageRequest (+3 more)

### Community 16 - "handMoves.test.ts"
Cohesion: 0.06
Nodes (48): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, checkAssignment(), hardRule(), listProblem(), minutes() (+40 more)

### Community 17 - "IRepository"
Cohesion: 0.08
Nodes (27): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster() (+19 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): jose, authMiddleware(), AuthUser, Express, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken() (+15 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "lucide-react"
Cohesion: 0.10
Nodes (38): lucide-react, EmailHtmlPreview(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, CHANGE_LABELS, CHANGE_TONES, AUDIT_PAGE_SIZE (+30 more)

### Community 22 - "App.tsx"
Cohesion: 0.13
Nodes (15): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoadErrorBoundary (+7 more)

### Community 23 - "emailService.ts"
Cohesion: 0.29
Nodes (7): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SMTP_CONNECTION_KEYS, withoutConnectionSettings()

### Community 24 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, esbuild, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react-hooks, tailwindcss, @types/express (+7 more)

### Community 25 - "access.ts"
Cohesion: 0.26
Nodes (12): 3. Users, roles and access, signOutSafely(), usePermissions(), AccountMenu(), TopBar(), canAccessRoute(), canApproveRequests(), canEditClinicData() (+4 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+12 more)

### Community 28 - "emailPublishing.test.ts"
Cohesion: 0.10
Nodes (21): nodemailer, authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+13 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (32): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+24 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "GridTable.tsx"
Cohesion: 0.21
Nodes (20): CellView, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL (+12 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.05
Nodes (39): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+31 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (47): CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, EditDoctorShiftModal(), TIME_PRESETS, ExportModal(), FairnessModal() (+39 more)

### Community 39 - "fixtures.ts"
Cohesion: 0.08
Nodes (24): 15. Tests, EARLY, input(), LATE, softHoursLimit, week, ANNUAL_LEAVE, DAY_DUTY (+16 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.11
Nodes (84): 5. Data model (Firestore collections), VersionRosterProps, WEEKDAY_NAMES, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps (+76 more)

### Community 42 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (20): 11. Saving, live updates, versions, useRosterEdits(), forgetCachedRoster(), Desired, fingerprint(), Known, planSync(), SyncPlan (+12 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.05
Nodes (46): ServerEmailConfig, EmailTabProps, daysBefore(), loadClinicSetup(), filterNurses(), nurseCounts(), NurseFilters, EMAIL_LOG_HTML_BUDGET (+38 more)

### Community 46 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (30): uuid, LoginPage(), NoticeTone, useLatestCallback(), ShareModal(), TemplateModal(), IconButton(), Switch() (+22 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "EntityForCollection"
Cohesion: 0.17
Nodes (4): saveHolidayLeave(), CollectionSyncer, saveDoctorSessions(), EntityForCollection

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.13
Nodes (14): loadHoursHistory(), balance(), duties, first, goal8(), history, long, nurse (+6 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.12
Nodes (29): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+21 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.12
Nodes (14): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, Development, Getting Started (+6 more)

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

### Community 65 - "myRequests.ts"
Cohesion: 0.24
Nodes (10): checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors, leaveStatus(), MyRequest, myRequestList(), range() (+2 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "ClinicContextState"
Cohesion: 0.10
Nodes (24): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps (+16 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, Final audit, 14-11-2026 (Phase 9), How every phase is done, Not in this plan (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "navigation.ts"
Cohesion: 0.32
Nodes (9): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, SidebarProps, AppRoute (+1 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "RosterToolbar.tsx"
Cohesion: 0.12
Nodes (20): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+12 more)

### Community 77 - "types/index.ts"
Cohesion: 0.06
Nodes (44): Request, ClinicTabProps, RuleDef, allocationSignature(), approveAllocation(), hasAllocationReview(), WEEK_HOURS_DEFAULT, AllocationDraft (+36 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.18
Nodes (11): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+3 more)

### Community 80 - "teamRoster.test.ts"
Cohesion: 0.16
Nodes (17): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), addDaysIso(), buildTeamRosterSheet() (+9 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.22
Nodes (15): RFC-5545, calendarRouter, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact() (+7 more)

### Community 83 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 84 - "makeNurse"
Cohesion: 0.12
Nodes (22): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account(), doctorOfAmy() (+14 more)

### Community 85 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 86 - "coverageRepair.test.ts"
Cohesion: 0.18
Nodes (6): dates, DAY, doctors, FULL, specialties, staff

### Community 87 - "ProblemCounts"
Cohesion: 0.13
Nodes (18): Key(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands now (+10 more)

### Community 88 - "FirestoreRepository"
Cohesion: 0.16
Nodes (4): FirestoreRepository, sanitizePayload(), LiveCollectionCache, entry

### Community 89 - "doctorEligibilityForm.ts"
Cohesion: 0.48
Nodes (5): eligibilityNeedsReview(), ids(), reviewedDoctorEligibility(), NurseDoctorEligibility, saved

### Community 90 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 91 - "nurseRoster.test.ts"
Cohesion: 0.18
Nodes (12): documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs(), NURSE_TOKEN_PATTERN (+4 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 94 - "16. History of work (for context)"
Cohesion: 0.22
Nodes (13): 16. History of work (for context), CellChoice, GridCell, moveInGrid(), pickStep(), AssignmentKind, addDays(), DateRange (+5 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "hoursRules.test.ts"
Cohesion: 0.10
Nodes (15): SchedulingEngine, D, E, L, NC, PHL, SENIOR, week (+7 more)

### Community 98 - "eligibility-publish.cjs"
Cohesion: 0.25
Nodes (7): args, assert, { chromium }, fixture(), pageFor(), preview(), Phase 9: tidy up, ESLint in CI, final audit and guide section 13 (03-11-2026 to 14-11-2026, guide items 105 to 112)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.11
Nodes (11): args, { chromium }, args, { chromium }, { chromium }, args, { chromium }, args (+3 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "geminiApi.test.ts"
Cohesion: 0.17
Nodes (11): express, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights() (+3 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "analysisExport.test.ts"
Cohesion: 0.25
Nodes (8): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift()

### Community 110 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 111 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 112 - "yearToDate.ts"
Cohesion: 0.15
Nodes (19): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+11 more)

### Community 113 - "quotaTracker"
Cohesion: 0.14
Nodes (8): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

### Community 114 - "HistoryView.tsx"
Cohesion: 0.25
Nodes (20): shiftTargetName(), VersionRoster(), DeleteVersionModal(), plural(), VersionCompareModal(), VersionViewModal(), Badge(), CHANGE_WORDS (+12 more)

### Community 116 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (34): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+26 more)

### Community 118 - "futureReservations.test.ts"
Cohesion: 0.22
Nodes (5): dates, doctors, fill(), rules, specialties

### Community 120 - "authService.ts"
Cohesion: 0.15
Nodes (18): LoginPageProps, AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, accessStatusWord(), accessWords() (+10 more)

### Community 121 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 123 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 124 - "seedRunner.ts"
Cohesion: 0.11
Nodes (23): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+15 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.10
Nodes (14): computeScheduleDiff(), MONTHS, suggestRosterName(), ctx(), EARLY, LATE, diff(), LATE (+6 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 129 - "NursesView.tsx"
Cohesion: 0.13
Nodes (41): 13. Screens in detail, BulkImportModal(), WeekChangePreview, PageHeader(), Column, DataTable(), DateInput(), Select() (+33 more)

### Community 130 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 132 - "pairedDoctorSafety.test.ts"
Cohesion: 0.22
Nodes (8): check(), doctors, eligibility, nurse, pair, refs, schedule, sessions

### Community 133 - "ui/index.ts"
Cohesion: 0.08
Nodes (43): PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, ButtonProps, ButtonSize, ButtonVariant (+35 more)

### Community 134 - "DoctorSession"
Cohesion: 0.14
Nodes (22): RepairTarget, leaveApprovalFields(), DeleteDoctorShiftResult, doctorFromDate(), generateDoctorSessionsForDateRange(), nextDay(), PatternSessionPlan, planPatternSessions() (+14 more)

### Community 135 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 136 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 145 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 146 - "ruleDraft.ts"
Cohesion: 0.48
Nodes (4): FIELDS, rebaseRules(), ruleChanges(), same()

### Community 147 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 148 - "useRowsInSteps"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 150 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 155 - "weekHours.test.ts"
Cohesion: 0.10
Nodes (10): ScheduleValidator, check(), nurse, nurse2, schedule, EARLY, LATE, shifts (+2 more)

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **1049 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1044 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1288 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `analysisExportService.ts`, `NursesView.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `getRepository`, `RosterSteps.tsx`, `gridSelection.ts`, `package.json`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `NurseSample.tsx`, `usePhoneLayout.ts`, `lucide-react`, `App.tsx`, `useRowsInSteps`, `access.ts`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `fixtures.ts`, `Assignment`, `AvailabilityView.tsx`, `AppShell.tsx`, `ClinicContextState`, `navigation.ts`, `RosterToolbar.tsx`, `teamRoster.test.ts`, `ProblemCounts`, `harness/main.tsx`, `HistoryView.tsx`, `authService.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `analysisExportService.ts`, `NursesView.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `getRepository`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `react`, `DashboardView.tsx`, `NurseSample.tsx`, `App.tsx`, `access.ts`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `Assignment`, `AvailabilityView.tsx`, `AppShell.tsx`, `navigation.ts`, `RosterToolbar.tsx`, `teamRoster.test.ts`, `ProblemCounts`, `harness/main.tsx`, `HistoryView.tsx`, `authService.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `colorContrast.ts`, `NursesView.tsx`, `SchedulingEngine.ts`, `nurseRosterService.ts`, `ui/index.ts`, `getRepository`, `RosterSteps.tsx`, `gridSelection.ts`, `WorkbookGrid.tsx`, `react`, `IRepository.ts`, `IRepository`, `ruleDraft.ts`, `usePhoneLayout.ts`, `useRowsInSteps`, `lucide-react`, `App.tsx`, `access.ts`, `GridTable.tsx`, `Code Review and Quality`, `SchedulesView.tsx`, `Assignment`, `savingSafety.test.ts`, `resumePublish.ts`, `AvailabilityView.tsx`, `AppShell.tsx`, `NSC Clinic Roster: complete project guide`, `myRequests.ts`, `ClinicContextState`, `navigation.ts`, `RosterToolbar.tsx`, `apiApp.ts`, `checkScheduler.test.ts`, `ProblemCounts`, `FirestoreRepository`, `nurseRoster.test.ts`, `GridSelection`, `eligibility-publish.cjs`, `HistoryView.tsx`, `peopleImport.ts`, `authService.ts`, `leaveGuard.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 127 inferred relationships involving `16. History of work (for context)` (e.g. with `preview()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 127 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1049 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0576592082616179 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._