# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 275 files · ~335,355 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2228 nodes · 7124 edges · 113 communities (104 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 242 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea770214`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- MyRosterView.tsx
- rosterPdfService.ts
- clinicModel.test.ts
- icsExportService.ts
- authService.ts
- getRepository
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AvailabilityView.tsx
- react
- CollectionSyncer
- DashboardView.tsx
- makeNurse
- firebaseIdentityService.ts
- SchedulesView
- compilerOptions
- doctorScheduleService.ts
- ClinicTab.tsx
- FirestoreRepository
- devDependencies
- emailService.ts
- seedRunner.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- PlannerSample.tsx
- useDialogA11y
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- ref_node_assert
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- IRepository.ts
- ui.tsx
- published-rules.mjs
- SchedulingEngine.ts
- fixtures.ts
- yearToDate.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
- Incremental Implementation
- RulesTab.tsx
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
- hoursBalance.ts
- publicRosterService.ts
- Source-Driven Development
- analysisExport.test.ts
- PublishModal.tsx
- harness/vite.config.ts
- EmailTab.tsx
- Design system: NSC Clinic Roster
- README.md
- guide-with-code.mjs
- lastResort.test.ts
- dialogs.tsx
- PublishedRosterView.tsx
- hoursRules.test.ts
- NSC Clinic Roster: complete project guide
- types/index.ts
- engineRules.test.ts
- Phases
- fakeAuth.ts
- holidayLeave.ts
- handMoveChecks.ts
- nurseRosterService.ts
- geminiApi.test.ts
- UI overhaul: checklist
- harness/main.tsx
- nurseRoster.test.ts
- createLiveReconciler
- Finish a change
- emailLogSize.ts
- 12. Publishing and nurse links
- QuickCellPopup.tsx
- context7
- WhoCanCover.tsx
- firestore-rules-reviewer.md
- yearSeed.ts
- firebase-mcp.sh
- ExportModal.tsx
- start.sh
- stop.sh
- weekHours.ts
- teamRoster.test.ts
- rosterSaving.test.ts
- ask-before-main.mjs
- uuid
- weekHours.test.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 86 edges
4. `DutyWindow` - 81 edges
5. `Nurse` - 81 edges
6. `react` - 79 edges
7. `useDialogA11y()` - 71 edges
8. `Doctor` - 70 edges
9. `lucide-react` - 66 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Phase 7: publishing, History and all dialogs` --references--> `Dialog()`  [INFERRED]
  tasks/plan.md → .claude/skills/browser-check/harness/sample/ui.tsx
- `Phase 7: publishing, History and dialogs` --references--> `Dialog()`  [INFERRED]
  tasks/todo.md → .claude/skills/browser-check/harness/sample/ui.tsx
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Parts (first drafts in `.claude/skills/browser-check/harness/sample/`)` --references--> `useDialogA11y()`  [INFERRED]
  design-system/nsc-clinic-roster/MASTER.md → src/components/common/useDialogA11y.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts

## Import Cycles
- None detected.

## Communities (113 total, 9 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.14
Nodes (67): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+59 more)

### Community 1 - "MyRosterView.tsx"
Cohesion: 0.26
Nodes (15): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+7 more)

### Community 2 - "rosterPdfService.ts"
Cohesion: 0.09
Nodes (25): jspdf, jspdf-autotable, chunk(), exportRosterToPdf(), firstName(), GRID, HEAD_FILL, hexToRgb() (+17 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "icsExportService.ts"
Cohesion: 0.22
Nodes (15): RFC-5545, calendarRouter, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact() (+7 more)

### Community 5 - "authService.ts"
Cohesion: 0.08
Nodes (34): LoginPageProps, signOutSafely(), usePermissions(), AppShellProps, NAV_ITEMS, SidebarProps, TopBar(), TopBarProps (+26 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (43): confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), DatabaseTab(), DatabaseTabProps, DutiesTab(), DutiesTabProps (+35 more)

### Community 7 - "authService"
Cohesion: 0.10
Nodes (9): authService, computePrivileges(), getAppAuth(), othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord (+1 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.12
Nodes (27): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+19 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.11
Nodes (40): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter (+32 more)

### Community 14 - "react"
Cohesion: 0.10
Nodes (19): lucide-react, react, App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+11 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.12
Nodes (11): 11. Saving, live updates, versions, saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+3 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (25): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+17 more)

### Community 17 - "makeNurse"
Cohesion: 0.12
Nodes (23): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+15 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.18
Nodes (15): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+7 more)

### Community 19 - "SchedulesView"
Cohesion: 0.09
Nodes (34): Report, What to check, What to look at, 16. History of work (for context), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), TIME_PRESETS (+26 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "doctorScheduleService.ts"
Cohesion: 0.10
Nodes (32): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+24 more)

### Community 22 - "ClinicTab.tsx"
Cohesion: 0.38
Nodes (6): ClinicTab(), ClinicTabProps, EmailTabProps, SaveStatus, WEEKDAY_NAMES, getWeekendDays()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.17
Nodes (14): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+6 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.14
Nodes (21): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+13 more)

### Community 27 - "IRepository"
Cohesion: 0.15
Nodes (14): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments(), repositoryManager (+6 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.13
Nodes (29): 7. Rules, CellChoice, cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso(), SOURCE_WORDS, WEEKDAY_ABBR (+21 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.14
Nodes (39): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), datesOf(), day() (+31 more)

### Community 31 - "useDialogA11y"
Cohesion: 0.13
Nodes (26): openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, DoctorWeekChangeDialog() (+18 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (26): Cell, dayLabel(), DAYS, ddmmyyyy(), DOCTORS, LEAVE, Nurse, NURSES (+18 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (14): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+6 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 38 - "ref_node_assert"
Cohesion: 0.09
Nodes (12): LATE, nurse, DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS (+4 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.15
Nodes (13): express, express-rate-limit, helmet, createApiApp(), startServer(), authMiddleware(), AuthUser, BackendRole (+5 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "IRepository.ts"
Cohesion: 0.10
Nodes (12): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry (+4 more)

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (64): 6. Clinic model (the business rules in plain English), CoverageSheet(), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+56 more)

### Community 49 - "fixtures.ts"
Cohesion: 0.12
Nodes (13): ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, LONG, NOV, OCT, OCT (+5 more)

### Community 50 - "yearToDate.ts"
Cohesion: 0.10
Nodes (20): clearYearToDateCache(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), forgetCachedRoster(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster (+12 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.12
Nodes (13): AGREED_EXCEPTION_NOTE, AMY, BEA, CARA, DAN, DOCTORS, DUTIES, EARLY (+5 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+15 more)

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
Cohesion: 0.50
Nodes (3): Always, with every change (owner's standing instruction), graphify, NSC Clinic Roster

### Community 65 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "hoursBalance.ts"
Cohesion: 0.11
Nodes (28): LeaveAndLocksSheet(), askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+20 more)

### Community 69 - "publicRosterService.ts"
Cohesion: 0.28
Nodes (11): Request, ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster() (+3 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "analysisExport.test.ts"
Cohesion: 0.10
Nodes (19): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+11 more)

### Community 72 - "PublishModal.tsx"
Cohesion: 0.22
Nodes (19): Things that went wrong before, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink(), nurseLinkUrl() (+11 more)

### Community 73 - "harness/vite.config.ts"
Cohesion: 0.27
Nodes (6): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, clinicApi()

### Community 74 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.18
Nodes (10): Checklist before a screen is delivered, Colours, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks, Sizes of controls (+2 more)

### Community 77 - "guide-with-code.mjs"
Cohesion: 0.12
Nodes (7): command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }, builtServer, __dirname, __filename

### Community 78 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 79 - "dialogs.tsx"
Cohesion: 0.21
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 80 - "PublishedRosterView.tsx"
Cohesion: 0.48
Nodes (6): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), buildTeamRosterSheet(), loadPublicRoster()

### Community 81 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 82 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.09
Nodes (20): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), Entry points (+12 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (30): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus (+22 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "Phases"
Cohesion: 0.11
Nodes (18): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+10 more)

### Community 86 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 87 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 88 - "handMoveChecks.ts"
Cohesion: 0.35
Nodes (12): Other engine files, FairnessModal(), SwapManagerModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings() (+4 more)

### Community 89 - "nurseRosterService.ts"
Cohesion: 0.21
Nodes (12): BuildNurseRosterInput, dayMonth(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, origin(), RegenerateNurseLinkResult, ShiftRefs, SyncNurseRostersResult (+4 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.10
Nodes (8): context, publishNovember(), Single(), start(), user, FONTS, renderSample(), react-dom

### Community 93 - "nurseRoster.test.ts"
Cohesion: 0.21
Nodes (8): fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), NURSE_TOKEN_PATTERN, base, dutyWindows, refs, schedule

### Community 94 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "emailLogSize.ts"
Cohesion: 0.33
Nodes (6): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, EmailRecipientLog

### Community 97 - "12. Publishing and nurse links"
Cohesion: 0.32
Nodes (4): 12. Publishing and nurse links, AcknowledgePageProps, RosterPublishService, safeColor()

### Community 98 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "yearSeed.ts"
Cohesion: 0.33
Nodes (6): YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 104 - "ExportModal.tsx"
Cohesion: 0.11
Nodes (45): xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps (+37 more)

### Community 107 - "weekHours.ts"
Cohesion: 0.52
Nodes (6): addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WeekHours, weeksOverLimit()

### Community 108 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 109 - "rosterSaving.test.ts"
Cohesion: 0.33
Nodes (3): DOCTOR, handEdit, leave()

### Community 110 - "ask-before-main.mjs"
Cohesion: 0.50
Nodes (4): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 111 - "uuid"
Cohesion: 0.50
Nodes (3): uuid, moveShift(), swapShifts()

### Community 112 - "weekHours.test.ts"
Cohesion: 0.15
Nodes (6): ScheduleValidator, EARLY, LATE, shifts, LONG, OCT

## Knowledge Gaps
- **783 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+778 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 952 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `MyRosterView.tsx`, `authService.ts`, `getRepository`, `authService`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `DashboardView.tsx`, `SchedulesView`, `doctorScheduleService.ts`, `ClinicTab.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `useDialogA11y`, `data.ts`, `ui.tsx`, `fixtures.ts`, `RulesTab.tsx`, `publicRosterService.ts`, `PublishModal.tsx`, `EmailTab.tsx`, `dialogs.tsx`, `PublishedRosterView.tsx`, `NSC Clinic Roster: complete project guide`, `harness/main.tsx`, `12. Publishing and nurse links`, `QuickCellPopup.tsx`, `WhoCanCover.tsx`, `ExportModal.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `MyRosterView.tsx`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `DashboardView.tsx`, `SchedulesView`, `doctorScheduleService.ts`, `ClinicTab.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `useDialogA11y`, `data.ts`, `ui.tsx`, `RulesTab.tsx`, `publicRosterService.ts`, `PublishModal.tsx`, `EmailTab.tsx`, `dialogs.tsx`, `PublishedRosterView.tsx`, `12. Publishing and nurse links`, `QuickCellPopup.tsx`, `ExportModal.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Assignment` connect `SchedulesView.tsx` to `rosterPdfService.ts`, `clinicModel.test.ts`, `icsExportService.ts`, `getRepository`, `DashboardView.tsx`, `makeNurse`, `SchedulesView`, `doctorScheduleService.ts`, `IRepository`, `WorkbookGrid.tsx`, `useDialogA11y`, `ref_node_assert`, `continuousHours.test.ts`, `nurseClinicFloat.test.ts`, `SchedulingEngine.ts`, `fixtures.ts`, `yearToDate.ts`, `handMoves.test.ts`, `hoursBalance.ts`, `analysisExport.test.ts`, `PublishModal.tsx`, `hoursRules.test.ts`, `types/index.ts`, `engineRules.test.ts`, `handMoveChecks.ts`, `nurseRosterService.ts`, `nurseRoster.test.ts`, `ExportModal.tsx`, `teamRoster.test.ts`, `rosterSaving.test.ts`, `uuid`, `weekHours.test.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _783 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13886113886113885 - nodes in this community are weakly interconnected._
- **Should `rosterPdfService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08620689655172414 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._