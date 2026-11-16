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
- [ ] Owner review before Stage 2

## Remaining stages

- [ ] Stage 2: timed cover foundation and all readers
- [ ] Owner review before Stage 3
- [ ] Stage 3: sequential cover, partial Float relief and manual editing
- [ ] Owner review before Stage 4
- [ ] Stage 4: stronger search, worker and automatic save
- [ ] Owner review before Stage 5
- [ ] Stage 5: clinic verification and coordinated rollout
- [ ] Main push approved separately
