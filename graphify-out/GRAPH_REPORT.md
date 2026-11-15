# Graph Report - NSC-Clinic-Roster  (2026-11-15)

## Corpus Check
- 456 files · ~466,031 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3194 nodes · 11321 edges · 161 communities (132 shown, 29 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 519 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c45eb210`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- NurseRosterShift
- clinicModel.test.ts
- authService
- gridSelection.ts
- Field
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- ClinicContextState
- DashboardView.tsx
- analysisExportService.ts
- SwapManagerModal.tsx
- nurseRosterService.ts
- firebaseIdentityService.ts
- index.tsx
- compilerOptions
- ReportsView.tsx
- PublishedRosterView.tsx
- emailService.ts
- devDependencies
- leaveImport.ts
- quick reference
- decisionEmail.test.ts
- emailPublishing.test.ts
- hoursAccounting.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- GridTable.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- ref_node_assert
- Optimization Patterns
- Assignment
- CollectionSyncer
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- cellView.test.ts
- firestore-rules/package.json
- doctorScheduleService.ts
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- NSC Clinic Roster
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- savingSafety.test.ts
- Planning and Task Breakdown
- Find Skills
- nurseClinicFloat.test.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- guide-with-code.mjs
- access.ts
- Rules
- RosterToolbar.tsx
- README.md
- types/index.ts
- holidayLeave.ts
- apiApp.ts
- leaveGuard.ts
- links.cjs
- icsExportService.ts
- dayView.ts
- preferenceFocus.test.ts
- RulesTab.tsx
- coverageRepair.test.ts
- MyRosterView.tsx
- IRepository
- NursesView.tsx
- middleware/auth.ts
- shiftIds.test.ts
- harness/main.tsx
- RosterAnalysisPanel.tsx
- 16. History of work (for context)
- Finish a change
- Rules
- SchedulingEngine
- eligibility-publish.cjs
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- usePresence.ts
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- published-rules.mjs
- WhoCanCover.tsx
- fakeAuth.ts
- yearToDate.ts
- hoursRules.test.ts
- HistoryView.tsx
- createLiveReconciler
- versionKinds.test.ts
- peopleImport.ts
- collectionSyncer.ts
- leaveImport.test.ts
- authService.ts
- Review Process
- futureCapacity.test.ts
- The Five-Axis Review
- seedRunner.ts
- sheet-tabs.cjs
- doctorEligibility.test.ts
- grid-timing.cjs
- ddmmyyyy
- getRepository
- rosterName.ts
- nurseList.test.ts
- lowAcuityLastResort.test.ts
- react
- request-clinic-dialogs.cjs
- RosterSteps.tsx
- resume.cjs
- allowance.cjs
- grid-keys.cjs
- data-backup.cjs
- roster-dialogs.cjs
- RuleTemplateKey
- canonical
- form-dialogs.cjs
- ProblemCounts
- leave-grid.cjs
- UI overhaul: checklist
- your-access.cjs
- access.cjs
- grid-flow.cjs
- coverageChecks.test.ts
- analysis-report.cjs
- NSC Clinic Roster: complete project guide
- time-periods.cjs
- scripts
- leaveAllowance.test.ts
- newRosterDates.ts
- plain-english-reviewer.md
- audit.cjs
- sent-rosters.cjs
- settings-save.cjs

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 132 edges
2. `16. History of work (for context)` - 128 edges
3. `react` - 120 edges
4. `Nurse` - 119 edges
5. `DutyWindow` - 105 edges
6. `formatDate()` - 100 edges
7. `getRepository()` - 99 edges
8. `Button()` - 95 edges
9. `Doctor` - 95 edges
10. `Schedule` - 93 edges

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

## Communities (161 total, 29 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (38): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, assignmentDoctorIds(), isFloatShift(), exportRosterToCsvLong() (+30 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (71): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), assignmentCoversDoctor(), bloodCollectionRole(), canBeFreeNurse() (+63 more)

### Community 2 - "NurseRosterShift"
Cohesion: 0.33
Nodes (5): 1. Features at a glance, MyDay, myShiftDays(), NurseRosterDoc, NurseRosterShift

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (27): Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D, DOCTORS (+19 more)

### Community 4 - "authService"
Cohesion: 0.05
Nodes (16): authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError (+8 more)

### Community 5 - "gridSelection.ts"
Cohesion: 0.12
Nodes (20): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN (+12 more)

### Community 6 - "Field"
Cohesion: 0.11
Nodes (56): ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice (+48 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.33
Nodes (5): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 5. What comes next, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (25): description, firebase, name, private, type, version, esbuild, eslint (+17 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.11
Nodes (28): useRosterEdits(), CellContextMenu(), reuseCellViews(), sameView(), GRID_KEY_ID, GridLegend(), rowViewsOf(), GridStatusBar() (+20 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "ClinicContextState"
Cohesion: 0.09
Nodes (30): LoginPageProps, AppContext, AppContextValue, AppShellProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps (+22 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.13
Nodes (29): useAppContext(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+21 more)

### Community 15 - "analysisExportService.ts"
Cohesion: 0.10
Nodes (31): isPendingLeave(), hasReviewedDoctorEligibility(), namesSpecialty(), OutsideList, outsideNurseList(), ANALYSIS_FORMAT_VERSION, buildRosterAnalysis(), countBy() (+23 more)

### Community 16 - "SwapManagerModal.tsx"
Cohesion: 0.10
Nodes (27): Other engine files, NONE, listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields() (+19 more)

### Community 17 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (19): ClinicTabProps, BuildNurseRosterInput, dayMonth(), ensureNurseLink(), formatRosterAsText(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, nurseCalendarUrl() (+11 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (22): jose, calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+14 more)

### Community 19 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.06
Nodes (57): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+49 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.11
Nodes (21): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+13 more)

### Community 23 - "emailService.ts"
Cohesion: 0.12
Nodes (20): nodemailer, uuid, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail() (+12 more)

### Community 24 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, esbuild, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react-hooks, tailwindcss, @types/express (+7 more)

### Community 25 - "leaveImport.ts"
Cohesion: 0.33
Nodes (6): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), leaves, pins

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailResult, DecidedRequest, decisionEmail() (+11 more)

### Community 28 - "emailPublishing.test.ts"
Cohesion: 0.12
Nodes (17): 12. Publishing and nurse links, authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+9 more)

### Community 29 - "hoursAccounting.ts"
Cohesion: 0.08
Nodes (55): 10. Hours, 7. Rules, NurseTimesheetModalProps, BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift (+47 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "GridTable.tsx"
Cohesion: 0.10
Nodes (26): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+18 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.11
Nodes (17): Change Descriptions, Change Sizing, Code Review and Quality, Common Rationalizations, Dead Code Hygiene, Dependency Discipline, Handling Disagreements, Honesty in Review (+9 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (55): NoticeTone, CreateScheduleModal(), DeleteScheduleModal(), EditDoctorShiftModal(), TIME_PRESETS, ExportModal(), FairnessModal(), PublishModal() (+47 more)

### Community 39 - "ref_node_assert"
Cohesion: 0.05
Nodes (66): 15. Tests, ANALYSIS_FORMAT, ScheduleValidator, CARD, input(), KHAN, LATE, reviewInput() (+58 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.12
Nodes (81): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps (+73 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.09
Nodes (15): args, { chromium }, args, { chromium }, args, { chromium }, anon, editor (+7 more)

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.11
Nodes (25): computeScheduleDiff(), EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), findStoppedPublish(), isDone(), isResumable() (+17 more)

### Community 46 - "cellView.test.ts"
Cohesion: 0.12
Nodes (18): CellDay, cellLookupsOf(), cellViewOf(), fmtHours(), shortDoctorNames(), specialtyMatches(), withDr(), withoutDr() (+10 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "doctorScheduleService.ts"
Cohesion: 0.13
Nodes (24): deleteDoctorShift(), DeleteDoctorShiftParams, doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), missingPatternSessions(), nextDay(), PatternSessionPlan (+16 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.12
Nodes (22): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+14 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.09
Nodes (36): 4. Navigation and app shell, leaveReason(), dialogsChanged(), openListeners, openStack, useDialogA11y(), AppShell(), bootstrap() (+28 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "NSC Clinic Roster"
Cohesion: 0.20
Nodes (8): Development, Getting Started, Key Features, NSC Clinic Roster, Overview, Production Build, Running Checks, Tech Stack

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

### Community 65 - "savingSafety.test.ts"
Cohesion: 0.21
Nodes (4): queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, Final audit, 14-11-2026 (Phase 9), How every phase is done, Not in this plan (+13 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.17
Nodes (8): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 73 - "access.ts"
Cohesion: 0.14
Nodes (24): 3. Users, roles and access, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar(), SidebarProps (+16 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "RosterToolbar.tsx"
Cohesion: 0.19
Nodes (14): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+6 more)

### Community 77 - "types/index.ts"
Cohesion: 0.07
Nodes (30): eligibilityNeedsReview(), ids(), reviewedDoctorEligibility(), KIND_LABELS, FIELDS, rebaseRules(), ruleChanges(), same() (+22 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.31
Nodes (10): applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy(), saveHolidayLeave() (+2 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.10
Nodes (20): repoRoot, swaps, express, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer() (+12 more)

### Community 80 - "leaveGuard.ts"
Cohesion: 0.48
Nodes (5): addLeaveGuard(), Guard, guards, isChanged(), rebaseDraft()

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "dayView.ts"
Cohesion: 0.09
Nodes (28): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, PHONE_QUERY (+20 more)

### Community 84 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 85 - "RulesTab.tsx"
Cohesion: 0.19
Nodes (15): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup, RulesTab() (+7 more)

### Community 86 - "coverageRepair.test.ts"
Cohesion: 0.18
Nodes (6): dates, DAY, doctors, FULL, specialties, staff

### Community 87 - "MyRosterView.tsx"
Cohesion: 0.33
Nodes (9): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterView(), MyRosterViewProps, weekdayOf(), 4. What the UI overhaul did (Phases 0 to 9, guide items 42 to 112), Phase 5: nurse screens for phones, and request decision emails (+1 more)

### Community 88 - "IRepository"
Cohesion: 0.07
Nodes (26): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removePublicRoster(), fingerprint(), syncScheduleAssignments(), FirebaseClientConfig (+18 more)

### Community 89 - "NursesView.tsx"
Cohesion: 0.25
Nodes (19): BulkImportModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, IconButton(), Column, DataTable(), DateInput() (+11 more)

### Community 90 - "middleware/auth.ts"
Cohesion: 0.21
Nodes (10): authMiddleware(), AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken(), DispatchResult (+2 more)

### Community 91 - "shiftIds.test.ts"
Cohesion: 0.21
Nodes (9): moveShift(), swapShifts(), dates, doctors, fill(), LATE, nurses, schedule (+1 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "RosterAnalysisPanel.tsx"
Cohesion: 0.38
Nodes (8): RosterAnalysisPanel(), analysisFileName(), downloadAnalysisContent(), downloadRosterAnalysis(), downloadRosterReview(), RosterAnalysis, reviewDuration(), rosterReviewText()

### Community 94 - "16. History of work (for context)"
Cohesion: 0.13
Nodes (18): 16. History of work (for context), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), CellChoice, GridCell, moveInGrid(), pickStep(), sameHoursHistory() (+10 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "SchedulingEngine"
Cohesion: 0.07
Nodes (19): SchedulingEngine, DR, NINE_SEVEN, ORTHO, roland(), RULES, run(), DR_PEDS (+11 more)

### Community 98 - "eligibility-publish.cjs"
Cohesion: 0.25
Nodes (7): args, assert, { chromium }, fixture(), pageFor(), preview(), Phase 9: tidy up, ESLint in CI, final audit and guide section 13 (03-11-2026 to 14-11-2026, guide items 105 to 112)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.06
Nodes (23): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+15 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "usePresence.ts"
Cohesion: 0.31
Nodes (6): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), now

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "published-rules.mjs"
Cohesion: 0.12
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 110 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 111 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 112 - "yearToDate.ts"
Cohesion: 0.11
Nodes (27): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), isLateDuty(), lateDutyThreshold(), clamp(), KEYS (+19 more)

### Community 113 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 114 - "HistoryView.tsx"
Cohesion: 0.12
Nodes (39): EmailHtmlPreview(), shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), plural(), VersionViewModal(), ResumePublish() (+31 more)

### Community 115 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 116 - "versionKinds.test.ts"
Cohesion: 0.25
Nodes (7): all, backup, lastYear, none, published, saved, v()

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (34): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+26 more)

### Community 118 - "collectionSyncer.ts"
Cohesion: 0.18
Nodes (12): Desired, fingerprint(), Known, planSync(), SyncPlan, changedLists(), sameItems(), rebaseEdit() (+4 more)

### Community 119 - "leaveImport.test.ts"
Cohesion: 0.33
Nodes (5): 2. Readability & Simplicity, AL, data(), nurses, SL

### Community 120 - "authService.ts"
Cohesion: 0.22
Nodes (14): signOutSafely(), AuthModal(), AccessManagementPanel(), accessStatusWord(), accessWords(), roleWords(), youCanDo(), computePrivileges() (+6 more)

### Community 121 - "Review Process"
Cohesion: 0.33
Nodes (6): Review Process, Step 1: Understand the Context, Step 2: Review the Tests First, Step 3: Review the Implementation, Step 4: Categorize Findings, Step 5: Verify the Verification

### Community 122 - "futureCapacity.test.ts"
Cohesion: 0.47
Nodes (3): CapacityJob, Edge, futureCapacity()

### Community 123 - "The Five-Axis Review"
Cohesion: 0.40
Nodes (5): 1. Correctness, 3. Architecture, 4. Security, 5. Performance, The Five-Axis Review

### Community 124 - "seedRunner.ts"
Cohesion: 0.10
Nodes (23): removeNurseRoster(), revokeNurseLink(), assertPublicationCurrent(), countOf(), afterShiftsSaved(), toScheduleRange(), SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS (+15 more)

### Community 126 - "doctorEligibility.test.ts"
Cohesion: 0.25
Nodes (5): doctors, prefs, refs, sessions, specialties

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 129 - "getRepository"
Cohesion: 0.09
Nodes (50): 13. Screens in detail, useLatestCallback(), Switch(), wholeDates(), AllRequestsPanel(), Draft, KindFilter, STATUS (+42 more)

### Community 132 - "lowAcuityLastResort.test.ts"
Cohesion: 0.08
Nodes (32): allocationSignature(), approveAllocation(), hasAllocationReview(), AllocationDraft, AllocationDrafts, AllocationRefs, applyAllocationDrafts(), pendingAllocationReviews() (+24 more)

### Community 133 - "react"
Cohesion: 0.10
Nodes (31): lucide-react, react, LocalModeBannerProps, PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES (+23 more)

### Community 135 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 141 - "RuleTemplateKey"
Cohesion: 0.67
Nodes (3): RuleDef, CanonicalRuleDef, RuleTemplateKey

### Community 148 - "ProblemCounts"
Cohesion: 0.23
Nodes (9): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), nextRowLimit(), ROW_STEP, useRowsInSteps(), Phase 4: roster screen layout, words and accessibility (13-10-2026, guide items 59 to 67) (+1 more)

### Community 150 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 155 - "coverageChecks.test.ts"
Cohesion: 0.25
Nodes (4): check(), nurse, nurse2, schedule

### Community 157 - "analysis-report.cjs"
Cohesion: 0.08
Nodes (15): args, assert, {chromium}, downloads, fs, os, path, args (+7 more)

### Community 159 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.16
Nodes (13): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 2. Repository layout, 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works (+5 more)

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 165 - "leaveAllowance.test.ts"
Cohesion: 0.31
Nodes (6): allowanceFor(), Kind, takesAllowance(), AL, DAY_OFF, SICK

### Community 170 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **1076 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1071 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1320 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `getRepository`, `gridSelection.ts`, `Field`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `ClinicContextState`, `DashboardView.tsx`, `SwapManagerModal.tsx`, `ProblemCounts`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `ref_node_assert`, `Assignment`, `AppShell.tsx`, `data.ts`, `access.ts`, `RosterToolbar.tsx`, `dayView.ts`, `RulesTab.tsx`, `MyRosterView.tsx`, `NursesView.tsx`, `harness/main.tsx`, `RosterAnalysisPanel.tsx`, `usePresence.ts`, `WhoCanCover.tsx`, `HistoryView.tsx`, `authService.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `getRepository`, `gridSelection.ts`, `Field`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `SwapManagerModal.tsx`, `ProblemCounts`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `Assignment`, `AppShell.tsx`, `data.ts`, `access.ts`, `RosterToolbar.tsx`, `RulesTab.tsx`, `MyRosterView.tsx`, `NursesView.tsx`, `harness/main.tsx`, `RosterAnalysisPanel.tsx`, `HistoryView.tsx`, `authService.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `getRepository`, `NurseRosterShift`, `SchedulingEngine.ts`, `react`, `Field`, `RosterSteps.tsx`, `gridSelection.ts`, `WorkbookGrid.tsx`, `ClinicContextState`, `firebaseIdentityService.ts`, `ProblemCounts`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `leaveImport.ts`, `NSC Clinic Roster: complete project guide`, `GridTable.tsx`, `leaveAllowance.test.ts`, `SchedulesView.tsx`, `Assignment`, `resumePublish.ts`, `cellView.test.ts`, `AppShell.tsx`, `access.ts`, `RosterToolbar.tsx`, `types/index.ts`, `apiApp.ts`, `leaveGuard.ts`, `dayView.ts`, `RulesTab.tsx`, `IRepository`, `NursesView.tsx`, `eligibility-publish.cjs`, `usePresence.ts`, `HistoryView.tsx`, `peopleImport.ts`, `collectionSyncer.ts`, `authService.ts`, `seedRunner.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 127 inferred relationships involving `16. History of work (for context)` (e.g. with `preview()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 127 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1076 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08599033816425121 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07228327228327229 - nodes in this community are weakly interconnected._