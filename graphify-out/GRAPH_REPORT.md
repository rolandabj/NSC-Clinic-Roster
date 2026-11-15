# Graph Report - NSC-Clinic-Roster  (2026-11-15)

## Corpus Check
- 443 files · ~451,364 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3096 nodes · 10745 edges · 156 communities (125 shown, 31 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 445 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `98a91aa7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- nurseRosterService.ts
- clinicModel.test.ts
- authService
- GridTable.tsx
- Field
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- middleware/auth.ts
- DashboardView.tsx
- IRepository.ts
- FairnessModal.tsx
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- App.tsx
- emailService.ts
- devDependencies
- authService.ts
- quick reference
- decisionEmail.test.ts
- ScheduleValidator.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- analysisExportService.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- fixtures.ts
- Optimization Patterns
- Nurse
- CollectionSyncer
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- Assignment
- firestore-rules/package.json
- Button
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- explainCell.ts
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ExplainDayInput
- Planning and Task Breakdown
- Find Skills
- ClinicContextState
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- Sidebar.tsx
- Rules
- RosterToolbar.tsx
- README.md
- PublishModal.tsx
- holidayLeave.ts
- apiApp.ts
- MyRosterView.tsx
- links.cjs
- icsExportService.ts
- cellView.test.ts
- makeNurse
- LiveCollectionCache
- coverageRepair.test.ts
- UI overhaul: summary and next steps
- EntityForCollection
- types/index.ts
- Design system: NSC Clinic Roster
- firestoreRest.ts
- harness/main.tsx
- address.ts
- dateDefaults.ts
- Finish a change
- Rules
- sharing.test.ts
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
- doctorEligibility.test.ts
- yearToDate.ts
- quotaTracker
- HistoryView.tsx
- publicationInputs.ts
- audit.cjs
- peopleImport.ts
- doctors.cjs
- publish.cjs
- PublishView.tsx
- RosterGrid
- settings-dialogs.cjs
- leaveGuard.ts
- seedRunner.ts
- sheet-tabs.cjs
- ref_node_assert
- grid-timing.cjs
- colorContrast.ts
- getRepository
- my-requests.cjs
- react
- Doctor
- allowance.cjs
- grid-keys.cjs
- data-backup.cjs
- roster-dialogs.cjs
- nurse-editor.cjs
- nurse-page.cjs
- nurses-list.cjs
- form-dialogs.cjs
- sent-rosters.cjs
- settings-save.cjs
- leave-grid.cjs
- UI overhaul: checklist
- your-access.cjs
- roster-editing-dialogs.cjs
- access.cjs
- grid-flow.cjs
- coverageChecks.test.ts
- newRosterDates.ts
- time-periods.cjs
- hoursRules.test.ts
- scripts
- teamRoster.test.ts
- plain-english-reviewer.md

## God Nodes (most connected - your core abstractions)
1. `16. History of work (for context)` - 128 edges
2. `Assignment` - 123 edges
3. `react` - 119 edges
4. `Nurse` - 114 edges
5. `getRepository()` - 99 edges
6. `DutyWindow` - 99 edges
7. `formatDate()` - 96 edges
8. `Button()` - 93 edges
9. `Schedule` - 93 edges
10. `lucide-react` - 89 edges

## Surprising Connections (you probably didn't know these)
- `16. History of work (for context)` --references--> `preview()`  [INFERRED]
  PROJECT_GUIDE.md → .claude/skills/browser-check/scripts/eligibility-publish.cjs
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx

## Import Cycles
- None detected.

## Communities (156 total, 31 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (59): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps (+51 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.06
Nodes (56): 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, RuleDef, checkAssignment(), hardRule(), minutes() (+48 more)

### Community 2 - "nurseRosterService.ts"
Cohesion: 0.10
Nodes (18): MyDay, myShiftDays(), dayMonth(), formatRosterAsText(), NURSE_ROSTER_LOOKBACK_DAYS, NURSE_TOKEN_PATTERN, RegenerateNurseLinkResult, ShiftRefs (+10 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.08
Nodes (23): Steps, planner(), D, DOCTORS, DR_X, DUTIES, E, freeNurse (+15 more)

### Community 4 - "authService"
Cohesion: 0.07
Nodes (16): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before, authorizedFetch(), authService, getAppAuth() (+8 more)

### Community 5 - "GridTable.tsx"
Cohesion: 0.07
Nodes (43): PROBLEM_MARKS, CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions (+35 more)

### Community 6 - "Field"
Cohesion: 0.09
Nodes (66): useAppContext(), confirmDialog(), dismissNotice(), notify(), setState(), TemplateModal(), Field(), Input() (+58 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (18): firebase, name, private, type, version, esbuild, express-rate-limit, @google/genai (+10 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.06
Nodes (59): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, CellContextMenu() (+51 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "middleware/auth.ts"
Cohesion: 0.17
Nodes (9): express, BackendRole, Express, Request, requireOwner, ROLE_HIERARCHY, authRouter, DispatchResult (+1 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.20
Nodes (22): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+14 more)

### Community 15 - "IRepository.ts"
Cohesion: 0.18
Nodes (16): FirebaseClientConfig, SubscribeCallback, Unsubscribe, Page, PageRequest, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict() (+8 more)

### Community 16 - "FairnessModal.tsx"
Cohesion: 0.09
Nodes (33): Other engine files, NONE, NurseFairnessMetrics, ProposedSwap, NONE, SwapManagerModalProps, listProblem(), checkSwap() (+25 more)

### Community 17 - "IRepository"
Cohesion: 0.10
Nodes (23): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster() (+15 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (16): jose, AuthUser, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig (+8 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.13
Nodes (33): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, CHANGE_LABELS, CHANGE_TONES, VersionCompareModal(), BarList() (+25 more)

### Community 22 - "App.tsx"
Cohesion: 0.16
Nodes (11): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 23 - "emailService.ts"
Cohesion: 0.12
Nodes (19): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+11 more)

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, esbuild, tailwindcss, @types/express, @types/node, @types/nodemailer, @types/react, @types/react-dom (+2 more)

### Community 25 - "authService.ts"
Cohesion: 0.16
Nodes (20): 3. Users, roles and access, uuid, signOutSafely(), AccountMenu(), TopBar(), AuthModal(), ShareModal(), Textarea() (+12 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+12 more)

### Community 28 - "ScheduleValidator.ts"
Cohesion: 0.15
Nodes (25): dayTotalsOf(), ProblemsPanelProps, coverageSlots(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes(), hoursToCover() (+17 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (35): leaveCountingOnHoliday(), askedCarry(), closePeriod(), earlierPeriodTotals(), hoursCheckpoints(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+27 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "analysisExportService.ts"
Cohesion: 0.16
Nodes (20): coveredMinutes(), resolveClinicSetup(), isLateDuty(), ANALYSIS_FORMAT, ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy() (+12 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.06
Nodes (33): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+25 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.07
Nodes (47): 16. History of work (for context), useLatestCallback(), SwapManagerModal(), PHONE_QUERY, RosterDayView(), RosterPicker(), ROSTER_SHEET_PANEL_ID, RosterSheet (+39 more)

### Community 39 - "fixtures.ts"
Cohesion: 0.08
Nodes (23): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, dates, doctors, rules (+15 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Nurse"
Cohesion: 0.15
Nodes (51): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, ExportModalProps, FairnessModalProps, PublishModalProps (+43 more)

### Community 42 - "CollectionSyncer"
Cohesion: 0.06
Nodes (18): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+10 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.06
Nodes (43): 0. Quick start for a new chat, 12. Publishing and nurse links, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+35 more)

### Community 46 - "Assignment"
Cohesion: 0.16
Nodes (22): TemplateModalProps, EMPTY_REPORT, RosterSnapshot, useRosterEdits(), CellFacts, daysInclusive(), LeaveImportRow, AssignmentCheckContext (+14 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "Button"
Cohesion: 0.15
Nodes (40): BulkImportModal(), CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS (+32 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.15
Nodes (12): duties, first, goal8(), history, long, nurse, p8, periods (+4 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.12
Nodes (27): dialogsChanged(), openListeners, openStack, useDialogA11y(), AppShell(), bootstrap(), AuditTrailView, AvailabilityView (+19 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "explainCell.ts"
Cohesion: 0.22
Nodes (14): 7. Rules, BlockedShift, explainNurseDay(), ExplainNurseDayInput, pendingLeaveOn(), plainReason(), PossibleShift, RequestWords (+6 more)

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

### Community 65 - "ExplainDayInput"
Cohesion: 0.43
Nodes (7): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), ExplainDayInput, NurseDayExplanation

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "ClinicContextState"
Cohesion: 0.08
Nodes (32): react-dom, LoginPageProps, AppContext, AppContextValue, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps (+24 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "Sidebar.tsx"
Cohesion: 0.30
Nodes (11): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar(), SidebarProps (+3 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "RosterToolbar.tsx"
Cohesion: 0.19
Nodes (13): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+5 more)

### Community 77 - "PublishModal.tsx"
Cohesion: 0.12
Nodes (21): Step, allocationSignature(), approveAllocation(), hasAllocationReview(), AssignmentDiffItem, FormattedAssignmentState, ScheduleVersionDiff, WEEKDAY_NAMES (+13 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.20
Nodes (10): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), authMiddleware() (+2 more)

### Community 80 - "MyRosterView.tsx"
Cohesion: 0.17
Nodes (19): PublicMessage(), PublicPageFrame(), dateLabel(), PublishedRosterSheet(), AcknowledgePage(), AcknowledgePageProps, LoadState, MyRosterView() (+11 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.25
Nodes (14): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), IcsParams, nextDayCompact() (+6 more)

### Community 83 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 84 - "makeNurse"
Cohesion: 0.05
Nodes (43): SchedulingEngine, DR, NINE_SEVEN, ORTHO, roland(), RULES, run(), hoursOnlyRules() (+35 more)

### Community 86 - "coverageRepair.test.ts"
Cohesion: 0.06
Nodes (22): ScheduleValidator, dates, DAY, doctors, FULL, specialties, staff, LEE (+14 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "EntityForCollection"
Cohesion: 0.29
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 89 - "types/index.ts"
Cohesion: 0.07
Nodes (31): eligibilityNeedsReview(), ids(), reviewedDoctorEligibility(), emailKindLabel(), KIND_LABELS, sendResult, ApprovalStatus, BlockWeeks (+23 more)

### Community 90 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 91 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 94 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 98 - "eligibility-publish.cjs"
Cohesion: 0.29
Nodes (6): args, assert, { chromium }, fixture(), pageFor(), preview()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+5 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "analysisExport.test.ts"
Cohesion: 0.09
Nodes (17): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+9 more)

### Community 110 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 111 - "doctorEligibility.test.ts"
Cohesion: 0.25
Nodes (5): doctors, prefs, refs, sessions, specialties

### Community 112 - "yearToDate.ts"
Cohesion: 0.13
Nodes (22): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+14 more)

### Community 113 - "quotaTracker"
Cohesion: 0.10
Nodes (12): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker (+4 more)

### Community 114 - "HistoryView.tsx"
Cohesion: 0.21
Nodes (23): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), DeleteVersionModalProps, plural(), VersionViewModal(), IconButton() (+15 more)

### Community 115 - "publicationInputs.ts"
Cohesion: 0.83
Nodes (3): assertPublicationCurrent(), canonical(), content()

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (31): byDayAndTime(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES, addDays() (+23 more)

### Community 120 - "PublishView.tsx"
Cohesion: 0.16
Nodes (25): EmailHtmlPreview(), Card(), PageHeader(), Column, DataTable(), Select(), EmptyState(), ErrorState() (+17 more)

### Community 121 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 123 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 124 - "seedRunner.ts"
Cohesion: 0.12
Nodes (18): countOf(), listPage(), pageFromList(), SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, ClearResult (+10 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.05
Nodes (23): BACKUPS_KEPT, MONTHS, suggestRosterName(), LATE, nurse, history(), configured, live (+15 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 129 - "getRepository"
Cohesion: 0.09
Nodes (53): 13. Screens in detail, Switch(), wholeDates(), AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter (+45 more)

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "react"
Cohesion: 0.08
Nodes (42): lucide-react, react, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice (+34 more)

### Community 134 - "Doctor"
Cohesion: 0.19
Nodes (17): EditDoctorShiftModalProps, DoctorsScheduleSheetProps, DeleteDoctorShiftParams, DeleteDoctorShiftResult, doctorFromDate(), generateDoctorSessionsForDateRange(), nextDay(), PatternSessionPlan (+9 more)

### Community 150 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 155 - "coverageChecks.test.ts"
Cohesion: 0.25
Nodes (4): check(), nurse, nurse2, schedule

### Community 157 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 162 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 169 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **1037 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1032 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1275 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `getRepository`, `GridTable.tsx`, `Field`, `package.json`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `FairnessModal.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `authService.ts`, `PlannerSample.tsx`, `ui.tsx`, `SchedulesView.tsx`, `fixtures.ts`, `Nurse`, `Assignment`, `Button`, `AppShell.tsx`, `ExplainDayInput`, `ClinicContextState`, `Sidebar.tsx`, `RosterToolbar.tsx`, `PublishModal.tsx`, `MyRosterView.tsx`, `harness/main.tsx`, `HistoryView.tsx`, `PublishView.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `getRepository`, `GridTable.tsx`, `Field`, `package.json`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `FairnessModal.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `authService.ts`, `PlannerSample.tsx`, `ui.tsx`, `SchedulesView.tsx`, `Nurse`, `Assignment`, `Button`, `AppShell.tsx`, `ClinicContextState`, `Sidebar.tsx`, `RosterToolbar.tsx`, `PublishModal.tsx`, `MyRosterView.tsx`, `harness/main.tsx`, `HistoryView.tsx`, `PublishView.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `SchedulesView.tsx` to `ExportModal.tsx`, `getRepository`, `nurseRosterService.ts`, `SchedulingEngine.ts`, `colorContrast.ts`, `react`, `Field`, `GridTable.tsx`, `WorkbookGrid.tsx`, `IRepository.ts`, `ReportsView.tsx`, `authService.ts`, `ScheduleValidator.ts`, `Nurse`, `CollectionSyncer`, `resumePublish.ts`, `Assignment`, `Button`, `AppShell.tsx`, `ClinicContextState`, `Sidebar.tsx`, `RosterToolbar.tsx`, `apiApp.ts`, `MyRosterView.tsx`, `EntityForCollection`, `types/index.ts`, `firestoreRest.ts`, `address.ts`, `dateDefaults.ts`, `eligibility-publish.cjs`, `HistoryView.tsx`, `peopleImport.ts`, `PublishView.tsx`, `leaveGuard.ts`, `seedRunner.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 127 inferred relationships involving `16. History of work (for context)` (e.g. with `preview()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 127 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1037 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06519114688128773 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06128364389233954 - nodes in this community are weakly interconnected._