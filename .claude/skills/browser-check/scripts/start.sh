#!/bin/bash
# Copies the test page into _preview/ (ignored by git and the type check) and serves it
# with Vite at http://localhost:5179, then waits until it answers. Log: _preview/vite.log.
# An existing _preview/ is kept, so a changed seed.ts or main.tsx survives a restart.
#   bash start.sh        development build at http://localhost:5179 (fast to start)
#   bash start.sh prod   production build at http://localhost:5180 (for timings: React's
#                        development build is several times slower). Log: _preview/prod.log.
set -euo pipefail
ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
cd "$ROOT"
MODE="${1:-dev}"
PORT=5179
[ "$MODE" = "prod" ] && PORT=5180
up() { curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null | grep -q 200; }

[ -d _preview ] || cp -r .claude/skills/browser-check/harness _preview
if up; then
  echo "Already serving at http://localhost:$PORT/"
  exit 0
fi
if [ "$MODE" = "prod" ]; then
  npx vite build --config _preview/vite.config.ts --outDir dist --emptyOutDir > _preview/prod.log 2>&1 \
    || { echo "The production build failed: see _preview/prod.log" >&2; exit 1; }
  (setsid nohup npx vite preview --config _preview/vite.config.ts --outDir dist --port "$PORT" --strictPort >> _preview/prod.log 2>&1 &)
else
  (setsid nohup npx vite --config _preview/vite.config.ts --port "$PORT" --strictPort > _preview/vite.log 2>&1 &)
fi
for _ in $(seq 1 90); do
  if up; then
    echo "Serving at http://localhost:$PORT/ (?view=schedules|doctors|availability|history|nurses|reports|dashboard|app|me|published|ack|sample|sample-nurse, ?as=owner|planner|manager|nurse|none, ?seed=big|fair|clean)"
    exit 0
  fi
  sleep 1
done
echo "The test page did not start: see _preview/vite.log or _preview/prod.log" >&2
exit 1
