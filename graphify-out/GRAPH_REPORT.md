# Graph Report - NSC-Clinic-Roster  (2026-11-18)

## Corpus Check
- 506 files · ~520,600 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3616 nodes · 13358 edges · 173 communities (148 shown, 25 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 543 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `89d8a414`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- dialogs.tsx
- clinicModel.test.ts
- authService
- assignmentChecks.ts
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- authService.ts
- DashboardView.tsx
- analysisExportService.ts
- ScheduleValidator
- makeNurse
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- PublishedRosterView.tsx
- emailService.ts
- devDependencies
- leaveAllowance.test.ts
- quick reference
- decisionEmail.test.ts
- nurseRosterService.ts
- hoursAccounting.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- gridSelection.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- makeSchedule
- Optimization Patterns
- Assignment
- CollectionSyncer
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- IRepository.ts
- firestore-rules/package.json
- LiveCollectionCache
- continuousHours.test.ts
- timedManualMoves.test.ts
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
- schedulingSearch.test.ts
- extraction-spec.md
- createLiveReconciler
- Planning and Task Breakdown
- Find Skills
- cellView.test.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- ref_node_fs
- PublishModal.tsx
- Rules
- doctorScheduleService.ts
- README.md
- types/index.ts
- holidayLeave.ts
- geminiApi.test.ts
- leaveGuard.ts
- links.cjs
- timedPublicationReaders.test.ts
- fixtures.ts
- staffRequestService.ts
- schedulingObjective.test.ts
- coverageRepair.test.ts
- quotaTracker
- IRepository
- apiApp.ts
- access.ts
- handMoves.test.ts
- harness/main.tsx
- GridTable.tsx
- 16. History of work (for context)
- Finish a change
- Rules
- timedExports.test.ts
- eligibility-publish.cjs
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- RosterToolbar.tsx
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- published-rules.mjs
- Design system: NSC Clinic Roster
- schedulingWorkerClient.test.ts
- yearToDate.ts
- workerProtocol.ts
- HistoryView.tsx
- RosterGrid
- useRowsInSteps
- peopleImport.ts
- schedulingRun.ts
- approvedDayOff.test.ts
- doctorWeekChange.test.ts
- CheckScheduler
- AvailabilityView.tsx
- Scheduling engine improvement plan
- seedRunner.ts
- sheet-tabs.cjs
- data-backup.cjs
- grid-timing.cjs
- usePresence.ts
- NursesView.tsx
- 4. What each phase did
- publication-availability.cjs
- lowAcuityLastResort.test.ts
- react
- guide-with-code.mjs
- RosterSteps.tsx
- fill-lifecycle.cjs
- allowance.cjs
- myRequests.ts
- GridSelection
- templateCoverage.ts
- manualOverlapAudit.ts
- Scheduling engine improvement checklist
- emailPublishing.test.ts
- firestoreRest.ts
- sharing.test.ts
- nurse-editor.cjs
- retainedCoverage.test.ts
- authorizedFetch
- leave-grid.cjs
- editSaving.test.ts
- your-access.cjs
- nurses-list.cjs
- fakeAuth.ts
- types.ts
- futureCapacity.test.ts
- firebaseConfig.ts
- analysis-report.cjs
- leave-dialogs.cjs
- timedRepairFloat.test.ts
- time-periods.cjs
- weekHours.test.ts
- generationInputFingerprint
- scripts
- history.cjs
- ref_node_assert
- nurse-page.cjs
- request-clinic-dialogs.cjs
- resume.cjs
- content
- plain-english-reviewer.md
- dayView.ts
- settings-save.cjs

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 181 edges
2. `Nurse` - 135 edges
3. `Doctor` - 129 edges
4. `16. History of work (for context)` - 128 edges
5. `DutyWindow` - 125 edges
6. `react` - 122 edges
7. `DoctorSession` - 121 edges
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

## Communities (173 total, 25 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (38): How a run works, jspdf, jspdf-autotable, ExportTab, WEEKDAY_NAMES, doctorCoverageText(), isFloatShift(), exportRosterToCsvLong() (+30 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.06
Nodes (125): 6. Clinic model (the business rules in plain English), 7. Rules, doctorSessionCoverView, assignmentCanCoverDoctor(), nurseIsAvailable(), assignmentCoversDoctor(), assignmentDoctorIds(), bloodCollectionRole() (+117 more)

### Community 2 - "dialogs.tsx"
Cohesion: 0.20
Nodes (15): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+7 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.14
Nodes (4): authService, getAppAuth(), getAppFirestore(), getFirebaseApp()

### Community 5 - "assignmentChecks.ts"
Cohesion: 0.21
Nodes (20): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), resolveRule(), followingRosterFindings(), shiftDate() (+12 more)

### Community 6 - "getRepository"
Cohesion: 0.15
Nodes (46): useAppContext(), confirmDialog(), notify(), Checkbox(), Field(), Input(), AccessManagementPanel(), ClinicTab() (+38 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.33
Nodes (5): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 5. What comes next, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): description, firebase, name, private, type, version, esbuild, eslint (+14 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.11
Nodes (27): CellContextMenu(), CellChoice, GRID_KEY_ID, GridLegend(), GridStatusBar(), GridToolbar(), GridToolbarProps, GridZoom (+19 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "authService.ts"
Cohesion: 0.11
Nodes (28): signOutSafely(), AccountMenu(), TopBarProps, AuthModal(), AuthModalProps, AuditTrailViewProps, HistoryViewProps, NursesViewProps (+20 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.13
Nodes (29): PageLoading(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+21 more)

### Community 15 - "analysisExportService.ts"
Cohesion: 0.07
Nodes (45): ProblemsPanelProps, isPendingLeave(), hasReviewedDoctorEligibility(), namesSpecialty(), OutsideList, ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis() (+37 more)

### Community 16 - "ScheduleValidator"
Cohesion: 0.06
Nodes (22): ScheduleValidator, check(), nurse, nurse2, schedule, doctors, prefs, refs (+14 more)

### Community 17 - "makeNurse"
Cohesion: 0.08
Nodes (26): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, reviewInput(), SCHEDULE (+18 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): jose, AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields (+15 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.14
Nodes (29): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, BarList(), hours(), Meter(), METER_FILL (+21 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.09
Nodes (24): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, react-dom, App() (+16 more)

### Community 23 - "emailService.ts"
Cohesion: 0.22
Nodes (10): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+2 more)

### Community 24 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, esbuild, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react-hooks, tailwindcss, @types/express (+7 more)

### Community 25 - "leaveAllowance.test.ts"
Cohesion: 0.12
Nodes (17): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), allowanceFor(), Kind, takesAllowance(), daysInclusive() (+9 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+12 more)

### Community 28 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (26): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterViewProps, ClinicTabProps, MyDay, myShiftDays(), BuildNurseRosterInput (+18 more)

### Community 29 - "hoursAccounting.ts"
Cohesion: 0.07
Nodes (43): NurseTimesheetModalProps, DayTotal, GridTableProps, fmtHours(), HoursAccountingSheet(), askedCarry(), closePeriod(), earlierPeriodTotals() (+35 more)

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
Nodes (20): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN (+12 more)

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

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.09
Nodes (63): CreateScheduleModal(), CreateScheduleModalProps, DeleteScheduleModal(), DeleteScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal() (+55 more)

### Community 39 - "makeSchedule"
Cohesion: 0.05
Nodes (37): SchedulingEngine, SchedulingWorkerDependencies, hoursOnlyRules(), makeSchedule(), LATE, run(), setup(), validate() (+29 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.11
Nodes (93): 5. Data model (Firestore collections), VersionRosterProps, WEEKDAY_NAMES, BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE (+85 more)

### Community 42 - "CollectionSyncer"
Cohesion: 0.07
Nodes (16): 11. Saving, live updates, versions, clearYearToDateCache(), forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, SyncPlan (+8 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.09
Nodes (15): args, { chromium }, args, { chromium }, args, { chromium }, anon, editor (+7 more)

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.10
Nodes (29): 12. Publishing and nurse links, ServerEmailConfig, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), assertPublicationCurrent(), findStoppedPublish() (+21 more)

### Community 46 - "IRepository.ts"
Cohesion: 0.15
Nodes (12): FirebaseClientConfig, FirestoreRepository, sanitizePayload(), SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList() (+4 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 50 - "timedManualMoves.test.ts"
Cohesion: 0.13
Nodes (15): moveShift(), swapShifts(), dates, doctors, fill(), LATE, nurses, schedule (+7 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.09
Nodes (36): AppContext, AppContextValue, leaveReason(), dialogsChanged(), openListeners, openStack, useDialogA11y(), AppShell() (+28 more)

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

### Community 68 - "cellView.test.ts"
Cohesion: 0.08
Nodes (28): CellDay, cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), specialtyMatches() (+20 more)

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
Cohesion: 0.07
Nodes (20): args, assert, {chromium}, fs, path, args, assert, fixture (+12 more)

### Community 73 - "PublishModal.tsx"
Cohesion: 0.14
Nodes (23): NoticeTone, EmailHtmlPreview(), PublishModal(), Step, ShareModalProps, AllocationReviews(), Card(), PublishView() (+15 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "doctorScheduleService.ts"
Cohesion: 0.27
Nodes (11): deleteDoctorShift(), doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), nextDay(), PatternSessionPlan, planPatternSessions(), PopulateRecurringDoctorSessionsParams (+3 more)

### Community 77 - "types/index.ts"
Cohesion: 0.08
Nodes (26): eligibilityNeedsReview(), ids(), reviewedDoctorEligibility(), FIELDS, rebaseRules(), ruleChanges(), same(), ApprovalStatus (+18 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.18
Nodes (14): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+6 more)

### Community 79 - "geminiApi.test.ts"
Cohesion: 0.16
Nodes (11): express, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights() (+3 more)

### Community 80 - "leaveGuard.ts"
Cohesion: 0.48
Nodes (5): addLeaveGuard(), Guard, guards, isChanged(), rebaseDraft()

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "timedPublicationReaders.test.ts"
Cohesion: 0.07
Nodes (35): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+27 more)

### Community 83 - "fixtures.ts"
Cohesion: 0.06
Nodes (32): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, dates, doctors, fill() (+24 more)

### Community 84 - "staffRequestService.ts"
Cohesion: 0.13
Nodes (28): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter, NurseSelfServicePanel(), STATUS (+20 more)

### Community 85 - "schedulingObjective.test.ts"
Cohesion: 0.14
Nodes (10): LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES, doctors, input() (+2 more)

### Community 86 - "coverageRepair.test.ts"
Cohesion: 0.17
Nodes (7): context(), dates, DAY, doctors, FULL, specialties, staff

### Community 87 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 88 - "IRepository"
Cohesion: 0.08
Nodes (27): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+19 more)

### Community 89 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+4 more)

### Community 90 - "access.ts"
Cohesion: 0.16
Nodes (23): 3. Users, roles and access, 4. Navigation and app shell, LoginPageProps, AppShellProps, APP_NAME, SCREEN_NAMES, screenName(), screenTitle() (+15 more)

### Community 91 - "handMoves.test.ts"
Cohesion: 0.06
Nodes (47): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, listProblem() (+39 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "GridTable.tsx"
Cohesion: 0.17
Nodes (21): dayTotalsOf(), dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, SELECTED_CELL, useCellFlags() (+13 more)

### Community 94 - "16. History of work (for context)"
Cohesion: 0.15
Nodes (18): 16. History of work (for context), GridCell, moveInGrid(), pickStep(), Address, addressHash(), ORDER, readAddress() (+10 more)

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
Cohesion: 0.04
Nodes (29): args, { chromium }, args, { chromium }, args, { chromium }, { chromium }, args (+21 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "RosterToolbar.tsx"
Cohesion: 0.24
Nodes (10): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbarProps (+2 more)

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
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 111 - "schedulingWorkerClient.test.ts"
Cohesion: 0.19
Nodes (8): SchedulingWorkerScope, scope, SchedulingWorkerPort, SchedulingWorkerRequest, SchedulingWorkerResponse, FakeWorker, fixture(), input()

### Community 112 - "yearToDate.ts"
Cohesion: 0.10
Nodes (28): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), consecutiveLateRuleOf(), isLateDuty() (+20 more)

### Community 113 - "workerProtocol.ts"
Cohesion: 0.19
Nodes (13): isSchedulingCancelled(), SchedulingWorkerJob, SchedulingWorkerOptions, GenerationResult, MAX_SCHEDULING_RUN_MS, SCHEDULING_VALIDATION_RESERVE_MS, SchedulingRunInput, SchedulingRunResult (+5 more)

### Community 114 - "HistoryView.tsx"
Cohesion: 0.14
Nodes (31): shiftTargetName(), VersionRoster(), DeleteVersionModal(), DeleteVersionModalProps, plural(), CHANGE_LABELS, CHANGE_TONES, VersionViewModal() (+23 more)

### Community 115 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 116 - "useRowsInSteps"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 117 - "peopleImport.ts"
Cohesion: 0.06
Nodes (37): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+29 more)

### Community 118 - "schedulingRun.ts"
Cohesion: 0.26
Nodes (12): SchedulingCancelledError, SchedulingTimeoutError, SchedulingWorkerError, startSchedulingWorker(), schedulingClockMs(), missingPatternSessions(), assertGenerationInputsCurrent(), cloneGenerationInputs() (+4 more)

### Community 119 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 120 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 122 - "AvailabilityView.tsx"
Cohesion: 0.20
Nodes (18): Select(), Switch(), AvailabilityView(), AvailabilityViewProps, WEEKDAY_ABBR, CellEditorDialog(), choiceClass(), withDr() (+10 more)

### Community 123 - "Scheduling engine improvement plan"
Cohesion: 0.25
Nodes (7): Agreed policy, Scheduling engine improvement plan, Stage 1: coverage correctness, Stage 2: timed cover foundation, Stage 3: sequential cover and manual editing, Stage 4: stronger search, Stage 5: clinic verification and rollout

### Community 124 - "seedRunner.ts"
Cohesion: 0.11
Nodes (23): countOf(), assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+15 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "usePresence.ts"
Cohesion: 0.21
Nodes (8): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), frame, november, now

### Community 129 - "NursesView.tsx"
Cohesion: 0.14
Nodes (33): uuid, useLatestCallback(), BulkImportModal(), TemplateModal(), PageHeader(), Column, DataTable(), Textarea() (+25 more)

### Community 130 - "4. What each phase did"
Cohesion: 0.20
Nodes (9): 1. Where things stand, 2. Why this work, 4. What each phase did, 5. Numbers: baseline vs final, 6. Next steps and items outside the plan, 7. Where to find things, Phase 0: setup (07-10-2026, guide item 42), Phase 1: quick fixes and safety (07-10-2026, guide item 44) (+1 more)

### Community 131 - "publication-availability.cjs"
Cohesion: 0.33
Nodes (3): args, assert, { chromium }

### Community 132 - "lowAcuityLastResort.test.ts"
Cohesion: 0.05
Nodes (45): allocationSignature(), approveAllocation(), hasAllocationReview(), AllocationDraft, applyAllocationDrafts(), pendingAllocationReviews(), publicationReport(), AllocationReview (+37 more)

### Community 133 - "react"
Cohesion: 0.05
Nodes (68): preview(), lucide-react, react, LoginPage(), PublicPageFrame(), LocalModeBannerProps, GROUPS, Key() (+60 more)

### Community 134 - "guide-with-code.mjs"
Cohesion: 0.17
Nodes (8): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 135 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 136 - "fill-lifecycle.cjs"
Cohesion: 0.18
Nodes (8): args, assert, check(), errors, fs, noWrites(), path, snapshot()

### Community 138 - "myRequests.ts"
Cohesion: 0.24
Nodes (10): checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors, leaveStatus(), MyRequest, myRequestList(), range() (+2 more)

### Community 139 - "GridSelection"
Cohesion: 0.15
Nodes (4): CellView, GridCellProps, GridRowProps, GridSelection

### Community 140 - "templateCoverage.ts"
Cohesion: 0.29
Nodes (10): doctorCoverageProblems(), ResolvedDoctorCoverage, ManualDoctorChoice, assertTemplateCoverageCurrent(), buildTemplateCoveragePlan(), checkPlan(), fingerprint(), readable() (+2 more)

### Community 141 - "manualOverlapAudit.ts"
Cohesion: 0.25
Nodes (8): completed, eventId(), running, validRecord(), writeManualOverlapAudits(), ManualDoctorOverlap, record, shift

### Community 142 - "Scheduling engine improvement checklist"
Cohesion: 0.29
Nodes (6): Remaining stages, Scheduling engine improvement checklist, Stage 1, Stage 2, Stage 3, Stage 4

### Community 143 - "emailPublishing.test.ts"
Cohesion: 0.27
Nodes (6): nodemailer, EmailReadiness, readEmailResponse(), configured, live, v()

### Community 144 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 145 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 147 - "retainedCoverage.test.ts"
Cohesion: 0.13
Nodes (13): changes, current, database(), shift(), doctor, generate(), leave, nurses (+5 more)

### Community 148 - "authorizedFetch"
Cohesion: 0.27
Nodes (9): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload (+1 more)

### Community 150 - "editSaving.test.ts"
Cohesion: 0.12
Nodes (17): useRosterEdits(), planSync(), changedLists(), sameItems(), Phase 3: roster grid speed and structure (13-10-2026, guide items 48 to 58), Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure (+9 more)

### Community 153 - "fakeAuth.ts"
Cohesion: 0.15
Nodes (9): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, planner(), history() (+1 more)

### Community 154 - "types.ts"
Cohesion: 0.38
Nodes (5): FillDialogProps, GenerationPreflightSummary, GenerationProgress, render(), summary

### Community 155 - "futureCapacity.test.ts"
Cohesion: 0.47
Nodes (3): CapacityJob, Edge, futureCapacity()

### Community 156 - "firebaseConfig.ts"
Cohesion: 0.20
Nodes (6): FirebaseConfig, googleAuthProvider, CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

### Community 157 - "analysis-report.cjs"
Cohesion: 0.18
Nodes (7): args, assert, {chromium}, downloads, fs, os, path

### Community 159 - "timedRepairFloat.test.ts"
Cohesion: 0.22
Nodes (7): cover(), ctx(), doctors, float, nurses, pair, sessions

### Community 162 - "generationInputFingerprint"
Cohesion: 0.50
Nodes (4): assignmentContent(), canonical(), generationInputFingerprint(), lockContent()

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 165 - "ref_node_assert"
Cohesion: 0.07
Nodes (25): addDays(), iso(), monthEnd(), suggestNewRosterDates(), MONTHS, suggestRosterName(), following, previous (+17 more)

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 173 - "dayView.ts"
Cohesion: 0.09
Nodes (26): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, PHONE_QUERY (+18 more)

## Knowledge Gaps
- **1200 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1195 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1490 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `NursesView.tsx`, `dialogs.tsx`, `usePresence.ts`, `getRepository`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `authService.ts`, `DashboardView.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `types.ts`, `nurseRosterService.ts`, `PlannerSample.tsx`, `ui.tsx`, `gridSelection.ts`, `ref_node_assert`, `SchedulesView.tsx`, `Assignment`, `dayView.ts`, `AppShell.tsx`, `PublishModal.tsx`, `staffRequestService.ts`, `access.ts`, `handMoves.test.ts`, `harness/main.tsx`, `GridTable.tsx`, `RosterToolbar.tsx`, `HistoryView.tsx`, `useRowsInSteps`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `NursesView.tsx`, `dialogs.tsx`, `getRepository`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `authService.ts`, `DashboardView.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `nurseRosterService.ts`, `PlannerSample.tsx`, `ui.tsx`, `gridSelection.ts`, `SchedulesView.tsx`, `Assignment`, `AppShell.tsx`, `PublishModal.tsx`, `staffRequestService.ts`, `access.ts`, `harness/main.tsx`, `GridTable.tsx`, `RosterToolbar.tsx`, `HistoryView.tsx`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `ExportModal.tsx`, `NursesView.tsx`, `SchedulingEngine.ts`, `clinicModel.test.ts`, `lowAcuityLastResort.test.ts`, `assignmentChecks.ts`, `WorkbookGrid.tsx`, `templateCoverage.ts`, `manualOverlapAudit.ts`, `DashboardView.tsx`, `analysisExportService.ts`, `ScheduleValidator`, `makeNurse`, `sharing.test.ts`, `retainedCoverage.test.ts`, `ReportsView.tsx`, `editSaving.test.ts`, `types.ts`, `nurseRosterService.ts`, `hoursAccounting.ts`, `timedRepairFloat.test.ts`, `weekHours.test.ts`, `ref_node_assert`, `SchedulesView.tsx`, `makeSchedule`, `CollectionSyncer`, `dayView.ts`, `continuousHours.test.ts`, `timedManualMoves.test.ts`, `schedulingSearch.test.ts`, `cellView.test.ts`, `PublishModal.tsx`, `types/index.ts`, `timedPublicationReaders.test.ts`, `fixtures.ts`, `schedulingObjective.test.ts`, `coverageRepair.test.ts`, `IRepository`, `handMoves.test.ts`, `GridTable.tsx`, `timedExports.test.ts`, `engineRules.test.ts`, `yearToDate.ts`, `workerProtocol.ts`, `HistoryView.tsx`, `doctorWeekChange.test.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 127 inferred relationships involving `16. History of work (for context)` (e.g. with `preview()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 127 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1200 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05695611577964519 - nodes in this community are weakly interconnected._