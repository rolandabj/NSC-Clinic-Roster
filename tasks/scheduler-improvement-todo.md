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

## Remaining stages

- [x] Stage 2: timed cover foundation and all readers
- [x] Owner review before Stage 3 (approved on 16-11-2026)
- [x] Stage 3: sequential cover, partial Float relief and manual editing
- [x] Owner review before Stage 4 (approved on 17-11-2026)
- [ ] Stage 4: stronger search, worker and automatic save
- [ ] Owner review before Stage 5
- [ ] Stage 5: clinic verification and coordinated rollout
- [ ] Main push approved separately
