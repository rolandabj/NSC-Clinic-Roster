# NSC Clinic Roster

Read `PROJECT_GUIDE.md` first: it describes the whole app, the code layout, the roster engine, data, deploy, tests and how the owner likes to work (plain English with no hyphens, ask before pushing to `main`, inspect before fixing).

## graphify

- **graphify** (`.claude/skills/graphify/SKILL.md`) turns the codebase into a knowledge graph. Trigger: `/graphify`.
  When the user types `/graphify`, use this skill before doing anything else.
- The graph is committed in `graphify-out/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`). For questions about the architecture or how files relate, read `graphify-out/GRAPH_REPORT.md` or use `graphify query "<question>"`, `graphify path "A" "B"`, `graphify explain "X"`.
- The `graphify` command is installed by `.claude/hooks/session-start.sh` when a web session starts. If it is missing, run `uv tool install graphifyy==0.9.73`.
- After code changes, refresh the graph with `graphify update .` (no AI calls) and commit the changed files in `graphify-out/`.
