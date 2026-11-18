# Scheduling engine improvement checklist

Plan: `tasks/scheduler-improvement-plan.md`. Implementation approval does not approve pushing to main or proceeding past a stage checkpoint.

## Stage 1

- [x] Shared availability and clinical coverage checks
- [x] A shift on an approved day off blocks publication, even without a pin
- [x] Required availability reads stop safely on failure
- [x] Neighbouring roster duties constrain both ends
- [x] Publication rejects changed availability and boundary inputs
- [x] Reports agree on real coverage and missing minutes
- [x] Unit, type, lint, build, email and browser checks pass
- [x] Guide and graph updated; work committed and pushed
- [x] Owner review before Stage 2 (approved on 16-11-2026)

## Stage 2

- [x] Optional doctor cover times on duties, pins and templates
- [x] Shared exact interval validation, busy time and free time
- [x] Existing views, reports, communications and calendars read the times
- [x] Timing changes affect history, reviews and publication freshness
- [x] Notes, pins and copies preserve timing; automatic timed writers remain guarded
- [x] Unit, type, lint, build, email, browser and clinic replay checks
- [x] Guide and graph updated; work committed and pushed

## Stage 3

- [x] Exact generated handovers and two eligible doctors in sequence
- [x] Partial Float relief and permitted configured duty extensions
- [x] Exact manual overlap intent, Check findings and saved audit events
- [x] Timed manual editor, pins, pastes, swaps, templates and copies
- [x] Fixed selected date boundaries and protected manual records
- [x] Final unit, type, lint, build, email, browser and clinic replay checks
- [x] Guide and graph updated; work committed and pushed

## Stage 4

- [x] One common comparison for safety, Nurse Clinic, exact doctor gaps and later preferences
- [x] Private worker with 24 candidate states and exchanges of up to six changed duties
- [x] Two minute deadline, final validation reserve and ongoing progress
- [x] Cancellation through the last server check without saving intermediate states
- [x] Fresh server inputs, stale input rejection and bounded fill dates
- [x] One final save with an authoritative save base, backup and Undo
- [x] Unit, type, lint, build, email, emulator, browser and clinic replay checks
- [x] Guide and graph updated; work committed and pushed

## Stage 5

- [x] Independent small clinic answers and minute audits
- [x] Same input clinic comparisons with honest search limits and hours
- [x] Partial Nurse Clinic preserving Float cover and preference exception relief
- [x] Partial save, uncertain acknowledgement, Retry and Undo recovery
- [x] Sign out invalidates stale save callbacks and retries
- [x] Actual timed worker output through database, snapshots and communications
- [x] Cancellation, stale inputs, backup, failed saves and reload checks
- [x] Planner reload and clinic review actions documented in scheduler-rollout.md
- [ ] Final browser checks, guide and graph; commit and push
- [ ] Clinic planner closes old tabs and reviews the actual draft before publication

## Stage checkpoints

- [x] Stage 2: timed cover foundation and all readers
- [x] Owner review before Stage 3 (approved on 16-11-2026)
- [x] Stage 3: sequential cover, partial Float relief and manual editing
- [x] Owner review before Stage 4 (approved on 17-11-2026)
- [x] Stage 4: stronger search, worker and automatic save
- [x] Owner review before Stage 5 (approved on 18-11-2026)
- [x] Stage 5 engineering: clinic verification and rollout instructions
- [x] Stage 4 main push approved by the owner on 18-11-2026
- [x] Stage 5 main push approved by the owner on 18-11-2026
