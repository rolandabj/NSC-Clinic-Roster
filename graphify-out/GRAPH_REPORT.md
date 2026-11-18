# Graph Report - NSC-Clinic-Roster  (2026-11-18)

## Corpus Check
- 510 files · ~531,160 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3667 nodes · 13554 edges · 186 communities (157 shown, 29 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 544 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ddbb7af1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- analysisExportService.ts
- clinicModel.ts
- schedulingObjective.ts
- clinicModel.test.ts
- authService
- surroundingRosterChecks.ts
- lucide-react
- Handover for a new chat
- ui-audit.cjs
- package.json
- 16. History of work (for context)
- dependencies
- Test-Driven Development
- AppShell.tsx
- DashboardView.tsx
- lowAcuityDoctors.test.ts
- SENIOR
- makeNurse
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- react
- emailService.ts
- devDependencies
- calculateNurseHoursAccounting
- quick reference
- decisionEmail.test.ts
- nurseRosterService.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- gridSelection.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- formatDate
- hoursOnlyRules
- Optimization Patterns
- Nurse
- CollectionSyncer
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- IRepository.ts
- firestore-rules/package.json
- LiveCollectionCache
- continuousHours.test.ts
- handMoves.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- makeSchedule
- Incremental Implementation
- NSC Clinic Roster: complete project guide
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- schedulingSearch.test.ts
- extraction-spec.md
- createLiveReconciler
- Planning and Task Breakdown
- Find Skills
- timedCoverageReaders.test.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- ref_node_fs
- MyRosterView.tsx
- Rules
- doctorScheduleService.ts
- README.md
- types/index.ts
- holidayLeave.ts
- apiApp.ts
- 4. What each phase did
- links.cjs
- nurseRoster.test.ts
- fixtures.ts
- getRepository
- schedulingObjective.test.ts
- ExportModal.tsx
- quotaTracker
- IRepository
- createApiApp
- timedPublicationReaders.test.ts
- handMoveChecks.ts
- harness/main.tsx
- GridTable.tsx
- address.ts
- Finish a change
- Rules
- timedExports.test.ts
- eligibility-publish.cjs
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- fill-verification.cjs
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- published-rules.mjs
- Design system: NSC Clinic Roster
- schedulingWorkerClient.test.ts
- SchedulesView.tsx
- schedulingWorkerRunner.ts
- HistoryView.tsx
- RosterGrid
- useRowsInSteps
- peopleImport.ts
- schedulingRun.ts
- schedulingCommunications.test.ts
- timedCoverageValidation.test.ts
- checkScheduler.test.ts
- explainCell.ts
- Scheduling engine improvement plan
- seedRunner.ts
- sheet-tabs.cjs
- assignmentPresence.test.ts
- grid-timing.cjs
- schedulingVerification.test.ts
- scheduleRanges.ts
- UI overhaul: summary and final results
- publication-availability.cjs
- outsideNurseList
- ui/index.ts
- guide-with-code.mjs
- RosterSteps.tsx
- fill-lifecycle.cjs
- allowance.cjs
- 13. Screens in detail
- cellView.ts
- preferenceFocus.test.ts
- manualOverlapAudit.ts
- Scheduling engine improvement checklist
- emailPublishing.test.ts
- firestoreRest.ts
- sharing.test.ts
- nurse-editor.cjs
- retainedCoverage.test.ts
- authorizedFetch
- leave-grid.cjs
- UI overhaul: checklist
- your-access.cjs
- nurses-list.cjs
- fakeAuth.ts
- types.ts
- SchedulingEngine.ts
- dateDefaults.ts
- analysis-report.cjs
- leave-dialogs.cjs
- ScheduleValidator.ts
- time-periods.cjs
- futureReservations.test.ts
- pairedDoctorSafety.test.ts
- scripts
- history.cjs
- ref_node_assert
- nurse-page.cjs
- request-clinic-dialogs.cjs
- resume.cjs
- ruleDraft.ts
- teamRoster.test.ts
- plain-english-reviewer.md
- newRosterDates.ts
- Assignment
- leaveGridPick.ts
- settings-save.cjs
- Scheduling improvements: rollout and clinic review
- access.cjs
- audit.cjs
- doctors.cjs
- form-dialogs.cjs
- grid-keys.cjs
- publish.cjs
- requests.cjs
- sent-rosters.cjs
- toolbar.cjs

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 184 edges
2. `Nurse` - 136 edges
3. `Doctor` - 130 edges
4. `16. History of work (for context)` - 128 edges
5. `DutyWindow` - 125 edges
6. `DoctorSession` - 124 edges
7. `react` - 122 edges
8. `formatDate()` - 106 edges
9. `Schedule` - 103 edges
10. `getRepository()` - 99 edges

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

## Communities (186 total, 29 thin omitted)

### Community 0 - "analysisExportService.ts"
Cohesion: 0.07
Nodes (52): assignmentCoversDoctor(), assignmentDoctorIds(), doctorCoverageText(), isFloatShift(), isLateDuty(), ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis() (+44 more)

### Community 1 - "clinicModel.ts"
Cohesion: 0.12
Nodes (43): doctorSessionCoverView, timedCoverageViewOf(), canonicalDoctorCoverage(), CoverageDisplayRef, coverageSlots(), coverageStructureProblems(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME (+35 more)

### Community 2 - "schedulingObjective.ts"
Cohesion: 0.11
Nodes (47): ProblemsPanelProps, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+39 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.07
Nodes (25): Browser check, Steps, planner(), history(), D, DOCTORS, DR_X, DUTIES (+17 more)

### Community 4 - "authService"
Cohesion: 0.06
Nodes (28): 3. Users, roles and access, MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem (+20 more)

### Community 5 - "surroundingRosterChecks.ts"
Cohesion: 0.14
Nodes (20): RuleDef, LATE_DUTY_RULE_WORDS, followingRosterFindings(), mergeFollowingRosterFindings(), shiftDate(), addDays(), fitsWeekHours(), heaviestWeekAround() (+12 more)

### Community 6 - "lucide-react"
Cohesion: 0.07
Nodes (74): lucide-react, useAppContext(), ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice() (+66 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.33
Nodes (5): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 5. What comes next, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (25): description, firebase, name, private, type, version, esbuild, eslint (+17 more)

### Community 10 - "16. History of work (for context)"
Cohesion: 0.08
Nodes (44): 16. History of work (for context), dayViewOf(), RosterSteps(), useRosterEdits(), CellContextMenu(), CellChoice, cellSummary(), reuseCellViews() (+36 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AppShell.tsx"
Cohesion: 0.05
Nodes (83): 4. Navigation and app shell, LoginPageProps, AppContext, AppContextValue, EmailHtmlPreview(), LoadErrorBoundary, signOutSafely(), AppShell() (+75 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.17
Nodes (22): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+14 more)

### Community 15 - "lowAcuityDoctors.test.ts"
Cohesion: 0.11
Nodes (16): computeScheduleDiff(), diff(), LATE, nurse, CARD, DERM, DR_LEE, DR_OMAR (+8 more)

### Community 16 - "SENIOR"
Cohesion: 0.04
Nodes (33): ScheduleValidator, check(), nurse, nurse2, schedule, dates, DAY, doctors (+25 more)

### Community 17 - "makeNurse"
Cohesion: 0.06
Nodes (29): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, reviewInput(), SCHEDULE, SESSIONS (+21 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): jose, authMiddleware(), AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken() (+15 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.10
Nodes (40): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, CHANGE_LABELS, CHANGE_TONES, AUDIT_PAGE_SIZE, BarList() (+32 more)

### Community 22 - "react"
Cohesion: 0.07
Nodes (36): preview(), react, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView (+28 more)

### Community 23 - "emailService.ts"
Cohesion: 0.14
Nodes (17): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+9 more)

### Community 24 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, esbuild, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react-hooks, tailwindcss, @types/express (+7 more)

### Community 25 - "calculateNurseHoursAccounting"
Cohesion: 0.11
Nodes (19): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), allowanceFor(), Kind, takesAllowance(), calculateNurseHoursAccounting() (+11 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailResult, DecidedRequest, decisionEmail() (+11 more)

### Community 28 - "nurseRosterService.ts"
Cohesion: 0.16
Nodes (23): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), addDaysIso(), buildTeamRosterSheet(), dayMonth(), ensureNurseLink(), formatRosterAsText() (+15 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (33): LeaveAndLocksSheet(), askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+25 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "gridSelection.ts"
Cohesion: 0.12
Nodes (19): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell() (+11 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (10): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, clinic(), november (+2 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "formatDate"
Cohesion: 0.13
Nodes (70): uuid, NoticeTone, useLatestCallback(), BulkImportModal(), CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps (+62 more)

### Community 39 - "hoursOnlyRules"
Cohesion: 0.05
Nodes (39): 15. Tests, SchedulingEngine, SchedulingWorkerDependencies, assertTimedPinCurrent(), hoursOnlyRules(), makeLock(), check(), doctors (+31 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Nurse"
Cohesion: 0.11
Nodes (60): RFC-5545, VersionRosterProps, WEEKDAY_NAMES, BulkImportModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, NurseFairnessMetrics, PublishModalProps (+52 more)

### Community 42 - "CollectionSyncer"
Cohesion: 0.07
Nodes (21): 11. Saving, live updates, versions, clearYearToDateCache(), forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+13 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.09
Nodes (15): args, { chromium }, args, { chromium }, args, { chromium }, anon, editor (+7 more)

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.17
Nodes (18): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), nurseLinkUrl(), findStoppedPublish(), isDone(), isResumable() (+10 more)

### Community 46 - "IRepository.ts"
Cohesion: 0.15
Nodes (12): FirebaseClientConfig, FirestoreRepository, sanitizePayload(), SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList() (+4 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 50 - "handMoves.test.ts"
Cohesion: 0.06
Nodes (28): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+20 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "makeSchedule"
Cohesion: 0.06
Nodes (26): makeSchedule(), changes, current, database(), shift(), LATE, run(), allowed() (+18 more)

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

### Community 63 - "schedulingSearch.test.ts"
Cohesion: 0.24
Nodes (7): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), base(), clinic(), doctors, nurse(), options

### Community 65 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "timedCoverageReaders.test.ts"
Cohesion: 0.15
Nodes (16): cellLookupsOf(), cellViewOf(), fmtHours(), shortDoctorNames(), specialtyMatches(), withDr(), withoutDr(), describeRequest() (+8 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, Final audit, 14-11-2026 (Phase 9), How every phase is done, Not in this plan (+13 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "ref_node_fs"
Cohesion: 0.08
Nodes (20): args, assert, {chromium}, fs, path, args, assert, fixture (+12 more)

### Community 73 - "MyRosterView.tsx"
Cohesion: 0.18
Nodes (15): LoadState, MyRosterView(), MyRosterViewProps, PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), MyDay, myShiftDays() (+7 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "doctorScheduleService.ts"
Cohesion: 0.21
Nodes (13): saveHolidayLeave(), doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), missingPatternSessions(), nextDay(), PatternSessionPlan, planPatternSessions() (+5 more)

### Community 77 - "types/index.ts"
Cohesion: 0.07
Nodes (32): eligibilityNeedsReview(), ids(), reviewedDoctorEligibility(), emailKindLabel(), KIND_LABELS, sendResult, AllocationReview, ApprovalStatus (+24 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.14
Nodes (12): express, @google/genai, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 80 - "4. What each phase did"
Cohesion: 0.22
Nodes (11): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft(), 4. What each phase did, Phase 0: setup (07-10-2026, guide item 42) (+3 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "nurseRoster.test.ts"
Cohesion: 0.16
Nodes (13): buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), timeZoneOffsetMs(), zonedTimeToUtc() (+5 more)

### Community 83 - "fixtures.ts"
Cohesion: 0.05
Nodes (38): amy, LEE, lookups, mary, nina, shift, EARLY, input() (+30 more)

### Community 84 - "getRepository"
Cohesion: 0.13
Nodes (32): ResumePublish(), AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter, ApprovalsQueuePanel(), Waiting (+24 more)

### Community 85 - "schedulingObjective.test.ts"
Cohesion: 0.40
Nodes (4): doctors, input(), rules, session()

### Community 86 - "ExportModal.tsx"
Cohesion: 0.21
Nodes (13): ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours(), HoursAccountingSheet(), HoursAccountingSheetProps, HoursPart, NurseHoursBalance (+5 more)

### Community 87 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 88 - "IRepository"
Cohesion: 0.10
Nodes (16): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removePublicRoster(), fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository (+8 more)

### Community 89 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 90 - "timedPublicationReaders.test.ts"
Cohesion: 0.15
Nodes (15): nurseShiftUid(), shortHash(), PUBLIC_ROSTER_FORMAT, Phase 0: setup, changed, docInput(), doctors, legacy (+7 more)

### Community 91 - "handMoveChecks.ts"
Cohesion: 0.13
Nodes (27): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, listProblem(), doctorCoverageProblems(), checkSwap(), isPinnedShift() (+19 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "GridTable.tsx"
Cohesion: 0.11
Nodes (25): DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL (+17 more)

### Community 94 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "timedExports.test.ts"
Cohesion: 0.19
Nodes (12): xlsx, cover(), data(), doctors, exportData(), handover(), nurses, pair (+4 more)

### Community 98 - "eligibility-publish.cjs"
Cohesion: 0.33
Nodes (5): args, assert, { chromium }, fixture(), pageFor()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+5 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "fill-verification.cjs"
Cohesion: 0.15
Nodes (7): args, assert, errors, fs, pairedSetup(), path, setup()

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "published-rules.mjs"
Cohesion: 0.12
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 110 - "Design system: NSC Clinic Roster"
Cohesion: 0.18
Nodes (10): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Roster marks, Sizes of controls (+2 more)

### Community 111 - "schedulingWorkerClient.test.ts"
Cohesion: 0.19
Nodes (8): SchedulingWorkerScope, isSchedulingCancelled(), SchedulingWorkerPort, SchedulingWorkerRequest, SchedulingWorkerResponse, FakeWorker, fixture(), input()

### Community 112 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (32): CreateScheduleModalProps, DeleteScheduleModalProps, NurseTimesheetModalProps, Step, ShareModalProps, RosterPickerProps, readStoredScheduleId(), storeScheduleId() (+24 more)

### Community 113 - "schedulingWorkerRunner.ts"
Cohesion: 0.12
Nodes (17): scope, clearAssignments(), emptyOnlySeedInput(), runSchedulingWorker(), SchedulingRunnerCancelledError, SchedulingRunnerTimeoutError, SchedulingRunnerValidationError, selectedDates() (+9 more)

### Community 114 - "HistoryView.tsx"
Cohesion: 0.15
Nodes (25): shiftTargetName(), VersionRoster(), DeleteVersionModal(), plural(), VersionViewModal(), RosterAnalysisPanel(), CHANGE_WORDS, HistoryView() (+17 more)

### Community 115 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 116 - "useRowsInSteps"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (33): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+25 more)

### Community 118 - "schedulingRun.ts"
Cohesion: 0.17
Nodes (21): SchedulingCancelledError, SchedulingTimeoutError, SchedulingWorkerError, SchedulingWorkerJob, SchedulingWorkerOptions, startSchedulingWorker(), GenerationResult, MAX_SCHEDULING_RUN_MS (+13 more)

### Community 119 - "schedulingCommunications.test.ts"
Cohesion: 0.22
Nodes (8): clinic(), doctors, email(), generated(), input(), personal(), roundTrip(), version()

### Community 120 - "timedCoverageValidation.test.ts"
Cohesion: 0.15
Nodes (8): check(), clinic, doctors, nurse, schedule, secondNurse, sessions, sharedPair

### Community 121 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 122 - "explainCell.ts"
Cohesion: 0.30
Nodes (10): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), ExplainDayInput, ExplainNurseDayInput (+2 more)

### Community 123 - "Scheduling engine improvement plan"
Cohesion: 0.25
Nodes (7): Agreed policy, Scheduling engine improvement plan, Stage 1: coverage correctness, Stage 2: timed cover foundation, Stage 3: sequential cover and manual editing, Stage 4: stronger search, Stage 5: clinic verification and rollout

### Community 124 - "seedRunner.ts"
Cohesion: 0.11
Nodes (21): ClinicTabProps, countOf(), toScheduleRange(), SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, checkBackup() (+13 more)

### Community 126 - "assignmentPresence.test.ts"
Cohesion: 0.20
Nodes (10): check(), doctor, missing(), noDoctorCover(), nurse, off, refs, schedule (+2 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "schedulingVerification.test.ts"
Cohesion: 0.25
Nodes (8): audit(), doctor(), exhaustiveOrdinaryCover(), visit(), input(), minute(), nurse(), rules()

### Community 129 - "scheduleRanges.ts"
Cohesion: 0.40
Nodes (9): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+1 more)

### Community 130 - "UI overhaul: summary and final results"
Cohesion: 0.29
Nodes (6): 1. Where things stand, 2. Why this work, 5. Numbers: baseline vs final, 6. Next steps and items outside the plan, 7. Where to find things, UI overhaul: summary and final results

### Community 131 - "publication-availability.cjs"
Cohesion: 0.33
Nodes (3): args, assert, { chromium }

### Community 132 - "outsideNurseList"
Cohesion: 0.12
Nodes (26): allocationSignature(), approveAllocation(), hasAllocationReview(), doctorCoverageFingerprint(), stableCoverageRaw(), hasReviewedDoctorEligibility(), namesSpecialty(), OutsideList (+18 more)

### Community 133 - "ui/index.ts"
Cohesion: 0.07
Nodes (41): Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), dialogsChanged(), openListeners, openStack, useDialogA11y(), PROBLEM_MARKS, ProblemBadge(), ProblemKind (+33 more)

### Community 134 - "guide-with-code.mjs"
Cohesion: 0.17
Nodes (8): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 135 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 136 - "fill-lifecycle.cjs"
Cohesion: 0.18
Nodes (8): args, assert, check(), errors, fs, noWrites(), path, snapshot()

### Community 138 - "13. Screens in detail"
Cohesion: 0.18
Nodes (15): 13. Screens in detail, isPhoneSize(), PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout(), checkDayRequest(), checkLeaveRequest() (+7 more)

### Community 139 - "cellView.ts"
Cohesion: 0.19
Nodes (8): CoverageSheet(), CoverageSheetProps, CellView, SOURCE_SPOKEN, SOURCE_WORDS, GridRowProps, TimedCoverageView, ValidationReport

### Community 140 - "preferenceFocus.test.ts"
Cohesion: 0.20
Nodes (8): NursePreference, CARD, doctorOfAmy(), KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 141 - "manualOverlapAudit.ts"
Cohesion: 0.25
Nodes (8): completed, eventId(), running, validRecord(), writeManualOverlapAudits(), ManualDoctorOverlap, record, shift

### Community 142 - "Scheduling engine improvement checklist"
Cohesion: 0.25
Nodes (7): Scheduling engine improvement checklist, Stage 1, Stage 2, Stage 3, Stage 4, Stage 5, Stage checkpoints

### Community 143 - "emailPublishing.test.ts"
Cohesion: 0.12
Nodes (14): nodemailer, checkEmailReadiness(), EmailReadiness, readEmailResponse(), RosterPublishService, configured, live, all (+6 more)

### Community 144 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 145 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 147 - "retainedCoverage.test.ts"
Cohesion: 0.20
Nodes (9): doctor, generate(), leave, nurses, retained, roles, schedule, session (+1 more)

### Community 148 - "authorizedFetch"
Cohesion: 0.27
Nodes (9): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload (+1 more)

### Community 150 - "UI overhaul: checklist"
Cohesion: 0.20
Nodes (9): Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit (+1 more)

### Community 153 - "fakeAuth.ts"
Cohesion: 0.29
Nodes (4): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before

### Community 154 - "types.ts"
Cohesion: 0.28
Nodes (7): react-dom, FillDialogProps, FillRunProgress, GenerationPreflightSummary, GenerationProgress, render(), summary

### Community 155 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (30): 6. Clinic model (the business rules in plain English), coveredMinutes(), hoursToCover(), YearToDateCounts, CapacityJob, Edge, futureCapacity(), isPendingLeave() (+22 more)

### Community 156 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 157 - "analysis-report.cjs"
Cohesion: 0.18
Nodes (7): args, assert, {chromium}, downloads, fs, os, path

### Community 159 - "ScheduleValidator.ts"
Cohesion: 0.12
Nodes (38): 7. Rules, assignmentCanCoverDoctor(), nurseIsAvailable(), overlaps(), resolveClinicSetup(), doctorPairingProblems(), isAgreedException(), isLastResortShift() (+30 more)

### Community 161 - "futureReservations.test.ts"
Cohesion: 0.22
Nodes (5): dates, doctors, fill(), rules, specialties

### Community 162 - "pairedDoctorSafety.test.ts"
Cohesion: 0.22
Nodes (8): check(), doctors, eligibility, nurse, pair, refs, schedule, sessions

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 165 - "ref_node_assert"
Cohesion: 0.06
Nodes (21): CellDay, MONTHS, suggestRosterName(), amy, CARDIOLOGY, ENT, LEE, lookups (+13 more)

### Community 169 - "ruleDraft.ts"
Cohesion: 0.48
Nodes (4): FIELDS, rebaseRules(), ruleChanges(), same()

### Community 170 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 172 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 173 - "Assignment"
Cohesion: 0.13
Nodes (38): 5. Data model (Firestore collections), ExportModalProps, FairnessModalProps, NONE, ProposedSwap, DayProblem, DayRow, firstDayShown() (+30 more)

### Community 174 - "leaveGridPick.ts"
Cohesion: 0.60
Nodes (3): GridCell, moveInGrid(), pickStep()

### Community 176 - "Scheduling improvements: rollout and clinic review"
Cohesion: 0.40
Nodes (4): Engineering checks, Planner actions after deployment, Scheduling improvements: rollout and clinic review, Scope of the clinic replay

## Knowledge Gaps
- **1210 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1205 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1511 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `authService`, `ui/index.ts`, `lucide-react`, `RosterSteps.tsx`, `package.json`, `13. Screens in detail`, `cellView.ts`, `16. History of work (for context)`, `AppShell.tsx`, `DashboardView.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `types.ts`, `nurseRosterService.ts`, `hoursBalance.ts`, `PlannerSample.tsx`, `ui.tsx`, `gridSelection.ts`, `ref_node_assert`, `formatDate`, `Nurse`, `Assignment`, `MyRosterView.tsx`, `getRepository`, `ExportModal.tsx`, `harness/main.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `HistoryView.tsx`, `useRowsInSteps`, `explainCell.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `authService`, `ui/index.ts`, `RosterSteps.tsx`, `package.json`, `16. History of work (for context)`, `cellView.ts`, `AppShell.tsx`, `DashboardView.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `react`, `nurseRosterService.ts`, `hoursBalance.ts`, `PlannerSample.tsx`, `ui.tsx`, `formatDate`, `Nurse`, `Assignment`, `MyRosterView.tsx`, `getRepository`, `ExportModal.tsx`, `harness/main.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `HistoryView.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `analysisExportService.ts`, `clinicModel.ts`, `schedulingObjective.ts`, `clinicModel.test.ts`, `outsideNurseList`, `surroundingRosterChecks.ts`, `schedulingVerification.test.ts`, `16. History of work (for context)`, `cellView.ts`, `manualOverlapAudit.ts`, `DashboardView.tsx`, `lowAcuityDoctors.test.ts`, `SENIOR`, `makeNurse`, `sharing.test.ts`, `retainedCoverage.test.ts`, `ReportsView.tsx`, `types.ts`, `SchedulingEngine.ts`, `nurseRosterService.ts`, `hoursBalance.ts`, `ScheduleValidator.ts`, `pairedDoctorSafety.test.ts`, `ref_node_assert`, `formatDate`, `hoursOnlyRules`, `Nurse`, `CollectionSyncer`, `teamRoster.test.ts`, `continuousHours.test.ts`, `handMoves.test.ts`, `makeSchedule`, `schedulingSearch.test.ts`, `timedCoverageReaders.test.ts`, `types/index.ts`, `nurseRoster.test.ts`, `fixtures.ts`, `schedulingObjective.test.ts`, `ExportModal.tsx`, `IRepository`, `timedPublicationReaders.test.ts`, `handMoveChecks.ts`, `timedExports.test.ts`, `engineRules.test.ts`, `SchedulesView.tsx`, `schedulingWorkerRunner.ts`, `HistoryView.tsx`, `schedulingRun.ts`, `schedulingCommunications.test.ts`, `timedCoverageValidation.test.ts`, `explainCell.ts`, `assignmentPresence.test.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 127 inferred relationships involving `16. History of work (for context)` (e.g. with `preview()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 127 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07205513784461152 - nodes in this community are weakly interconnected._
- **Should `clinicModel.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._